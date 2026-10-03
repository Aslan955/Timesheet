#1. Truy cập lập PAKD
##1.1. Link "Thao tác" và nút đầu trang
[2] [Yes] CHK-phuong-an-kinh-doanh-147 → FR-phuong-an-kinh-doanh-035 · Verify SM xem danh sách thấy link "Lập PAKD" ở cột "Thao tác" của dự án "Chưa có PAKD"
[2] [Yes] CHK-phuong-an-kinh-doanh-148 → FR-phuong-an-kinh-doanh-035 · Verify Kế toán xem danh sách thấy link "Xem" ở cột "Thao tác" của dự án "Chưa có PAKD"
[2] [Yes] CHK-phuong-an-kinh-doanh-149 → FR-phuong-an-kinh-doanh-035 · Verify bấm link "Lập PAKD" mở màn chi tiết của dự án
[1] [Yes] CHK-phuong-an-kinh-doanh-150 → FR-phuong-an-kinh-doanh-020 · Verify SM mở dự án "Chưa có PAKD" thấy 2 nút "Lưu nháp" · "Gửi Kế toán duyệt" ở đầu trang bên phải, trước nút Sửa
[2] [Yes] CHK-phuong-an-kinh-doanh-151 → FR-phuong-an-kinh-doanh-020 · Verify SM đang ở chế độ sửa thông tin cơ bản thì đầu trang không có nút "Lưu nháp" · "Gửi Kế toán duyệt"
[3] [Yes] CHK-phuong-an-kinh-doanh-152 → FR-phuong-an-kinh-doanh-020 · Verify SM chuyển sang tab "Lịch sử" thì nút "Lưu nháp" · "Gửi Kế toán duyệt" không hiển thị
[1] [Yes] CHK-phuong-an-kinh-doanh-153 → FR-phuong-an-kinh-doanh-020, BR-phuong-an-kinh-doanh-002 · Verify Kế toán mở dự án "Chưa có PAKD" không thấy nút "Lưu nháp" · "Gửi Kế toán duyệt"

##1.2. Dòng thông báo bước hiện tại
[2] [Yes] CHK-phuong-an-kinh-doanh-154 → FR-phuong-an-kinh-doanh-036 · Verify SM mở dự án "Chưa có PAKD" còn 10 ngày thấy dòng thông báo "Dự án cần lập phương án kinh doanh (PAKD). Hạn lập: dd/mm/yyyy (còn 10 ngày) — nhập PAKD bên dưới rồi bấm Gửi Kế toán duyệt ở góc phải."
[3] [Yes] CHK-phuong-an-kinh-doanh-155 → FR-phuong-an-kinh-doanh-036 · Verify SM mở dự án "Chưa có PAKD" đã quá hạn 3 ngày thấy phần hạn trên dòng thông báo là "(quá hạn 3 ngày)"
[1] [Yes] CHK-phuong-an-kinh-doanh-156 → FR-phuong-an-kinh-doanh-036 · Verify SM mở dự án bị từ chối V1 thấy dòng thông báo bắt đầu "PAKD V1 bị từ chối ({ý kiến}) — cần lập lại." kèm phần "Hạn lập: dd/mm/yyyy"
[3] [Yes] CHK-phuong-an-kinh-doanh-157 → FR-phuong-an-kinh-doanh-036 · Verify Kế toán mở dự án "Chưa có PAKD" thấy dòng thông báo "Đang chờ SM / Giám đốc khối lập PAKD (hạn dd/mm/yyyy)."
[1] [Yes] CHK-phuong-an-kinh-doanh-158 → FR-phuong-an-kinh-doanh-036, NFR-phuong-an-kinh-doanh-007 · Verify AM mở dự án "Chưa có PAKD" thấy dòng thông báo "Đang chờ SM / GĐK lập PAKD." không có hạn lập

#2. Form trống mặc định và điền sẵn
##2.1. Form trống mặc định
[2] [Yes] CHK-phuong-an-kinh-doanh-159 → BR-phuong-an-kinh-doanh-023 · Verify form trống Đã ký có đủ 4 mốc gợi ý "Tạm ứng khi có hợp đồng", "Nghiệm thu giai đoạn 1", "Nghiệm thu giai đoạn 2", "Quyết toán, bảo hành" với Tỷ lệ được thanh toán 100, Thời gian chờ 30, % bằng 0
[2] [Yes] CHK-phuong-an-kinh-doanh-160 → BR-phuong-an-kinh-doanh-023 · Verify form trống Đã ký có đủ 8 khoản mục mẫu: khối A "Chi phí lương", "Thuê ngoài / mua sắm", "Dự phòng", "Thưởng" và khối B "Chi phí lương", "Tiếp khách, công tác", "Dự phòng", "Thưởng"
[3] [Yes] CHK-phuong-an-kinh-doanh-161 → BR-phuong-an-kinh-doanh-023 · Verify form trống Chưa ký có Xác suất thành công 50%
[3] [Yes] CHK-phuong-an-kinh-doanh-162 → BR-phuong-an-kinh-doanh-023 · Verify form trống Chưa ký có 1 giai đoạn trống ở bảng Mốc kế hoạch

##2.2. Điền sẵn từ dữ liệu dự án
[1] [Yes] CHK-phuong-an-kinh-doanh-163 → FR-phuong-an-kinh-doanh-002 · Verify dự án đã được đánh dấu "đã ký" mở form lần đầu thì Tình trạng dự án mặc định "Đã ký"
[1] [Yes] CHK-phuong-an-kinh-doanh-164 → FR-phuong-an-kinh-doanh-002 · Verify dự án chưa ký mở form lần đầu thì Tình trạng dự án mặc định "Chưa ký"
[1] [Yes] CHK-phuong-an-kinh-doanh-165 → FR-phuong-an-kinh-doanh-002, FR-phuong-an-kinh-doanh-037 · Verify dự án đã có hợp đồng (lưu P-03) mở form lần đầu thì Mục 1 nạp sẵn Số hợp đồng, Ngày ký trên hợp đồng, Ngày ký thực tế, Giá trị hợp đồng từ hợp đồng
[2] [Yes] CHK-phuong-an-kinh-doanh-166 → FR-phuong-an-kinh-doanh-002 · Verify dự án chưa có hợp đồng mở form lần đầu thì giá trị điền sẵn bằng doanh thu dự kiến của dự án
[2] [Yes] CHK-phuong-an-kinh-doanh-167 → FR-phuong-an-kinh-doanh-002 · Verify dự án có hợp đồng có thời hạn 03/2027 – 08/2027 thì Bắt đầu / Kết thúc điền sẵn 03/2027 / 08/2027
[2] [Yes] CHK-phuong-an-kinh-doanh-168 → FR-phuong-an-kinh-doanh-002 · Verify dự án không có hợp đồng thì Bắt đầu / Kết thúc điền sẵn theo tháng của thời gian dự án
[2] [Yes] CHK-phuong-an-kinh-doanh-169 → FR-phuong-an-kinh-doanh-002 · Verify dự án chưa ký có ngày dự kiến ký 15/05/2027 thì Thời điểm dự kiến ký điền sẵn 05/2027
[2] [Yes] CHK-phuong-an-kinh-doanh-170 → FR-phuong-an-kinh-doanh-002, BR-phuong-an-kinh-doanh-022 · Verify Đã ký, dự án có chi phí kế hoạch SX và KD > 0 thì Mục 4 có 2 dòng "Chi phí sản xuất kế hoạch" (Sản xuất) và "Chi phí kinh doanh kế hoạch" (Kinh doanh) thay 8 khoản mục mẫu
[2] [Yes] CHK-phuong-an-kinh-doanh-171 → BR-phuong-an-kinh-doanh-022, BR-phuong-an-kinh-doanh-016 · Verify Đã ký, chi phí SX kế hoạch 12,000,000 trên thời hạn 3 tháng thì dòng "Chi phí sản xuất kế hoạch" có 4,000,000 mỗi tháng
[3] [Yes] CHK-phuong-an-kinh-doanh-172 → BR-phuong-an-kinh-doanh-022 · Verify Đã ký, dự án chỉ có tháng bắt đầu thì chi phí kế hoạch điền sẵn nằm trọn trong 1 tháng
[3] [Yes] CHK-phuong-an-kinh-doanh-173 → BR-phuong-an-kinh-doanh-022, BR-phuong-an-kinh-doanh-016 · Verify Đã ký, dự án có chi phí kế hoạch nhưng không có thời hạn HĐ và thời gian dự án thì 2 dòng chi phí kế hoạch không có giá trị tháng nào
[2] [Yes] CHK-phuong-an-kinh-doanh-174 → BR-phuong-an-kinh-doanh-022 · Verify Chưa ký, dự án có chi phí kế hoạch thì bảng Mốc kế hoạch có 1 giai đoạn "Toàn dự án" với Từ / Đến và SX / KD theo dự án

#3. Mục 1 "Thông tin dự án"
##3.1. Trường theo tình trạng
[1] [Yes] CHK-phuong-an-kinh-doanh-175 → FR-phuong-an-kinh-doanh-011 · Verify tình trạng Đã ký Mục 1 có đủ Tình trạng dự án*, Số hợp đồng (gợi ý "VD: HĐ-022/688/2026"), Ngày ký trên hợp đồng, Ngày ký thực tế, Giá trị hợp đồng (VNĐ)*
[1] [Yes] CHK-phuong-an-kinh-doanh-176 → FR-phuong-an-kinh-doanh-011 · Verify tình trạng Chưa ký Mục 1 có đủ Thời điểm dự kiến ký*, Giá trị hợp đồng dự kiến (VNĐ)*, Xác suất thành công (%), Phạm vi công việc*, Đánh giá rủi ro*
[2] [Yes] CHK-phuong-an-kinh-doanh-177 → FR-phuong-an-kinh-doanh-011, BR-phuong-an-kinh-doanh-034 · Verify nhập Xác suất thành công 150 thì ô tự về 100
[3] [Yes] CHK-phuong-an-kinh-doanh-178 → BR-phuong-an-kinh-doanh-034 · Verify ô số không nhận dấu âm (gõ "-5" vào Giá trị hợp đồng không ra số âm)
[2] [Yes] CHK-phuong-an-kinh-doanh-179 → BR-phuong-an-kinh-doanh-036 · Verify tình trạng Chưa ký không hiển thị Mục 2, Mục 3 nghiệm thu, Mục 4 kế hoạch chi phí theo tháng mà hiển thị bảng Mốc kế hoạch

##3.2. Đổi tình trạng Chưa ký → Đã ký
[1] [Yes] CHK-phuong-an-kinh-doanh-180 → FR-phuong-an-kinh-doanh-012, BR-phuong-an-kinh-doanh-020 · Verify đổi Chưa ký → Đã ký khi Giá trị hợp đồng trống thì Giá trị hợp đồng điền sẵn bằng Giá trị dự kiến
[2] [Yes] CHK-phuong-an-kinh-doanh-181 → BR-phuong-an-kinh-doanh-020 · Verify đổi Chưa ký → Đã ký khi Giá trị hợp đồng đã có thì giữ nguyên Giá trị hợp đồng
[2] [Yes] CHK-phuong-an-kinh-doanh-182 → BR-phuong-an-kinh-doanh-020 · Verify đổi sang Đã ký khi Bắt đầu trống thì Bắt đầu điền tháng "Từ" sớm nhất của các giai đoạn
[2] [Yes] CHK-phuong-an-kinh-doanh-183 → BR-phuong-an-kinh-doanh-020 · Verify đổi sang Đã ký khi Kết thúc trống thì Kết thúc điền tháng "Đến" muộn nhất của các giai đoạn
[3] [Yes] CHK-phuong-an-kinh-doanh-184 → BR-phuong-an-kinh-doanh-020 · Verify giai đoạn muộn nhất không có "Đến" thì Kết thúc điền theo tháng "Từ" của giai đoạn đó
[1] [Yes] CHK-phuong-an-kinh-doanh-185 → BR-phuong-an-kinh-doanh-020 · Verify đổi sang Đã ký khi chưa có khoản mục nào có giá trị thì mỗi giai đoạn có "Từ" sinh 1 dòng nhóm "Sản xuất" và 1 dòng nhóm "Kinh doanh" mang tên giai đoạn, giá trị chia đều trên các tháng Từ → Đến
[3] [Yes] CHK-phuong-an-kinh-doanh-186 → BR-phuong-an-kinh-doanh-020 · Verify giai đoạn tên trống khi chuyển sang Đã ký sinh dòng tên "Sản xuất" và dòng tên "Kinh doanh"
[2] [Yes] CHK-phuong-an-kinh-doanh-187 → BR-phuong-an-kinh-doanh-020 · Verify giai đoạn KD bằng 0 khi chuyển sang Đã ký không sinh dòng nhóm "Kinh doanh"
[2] [Yes] CHK-phuong-an-kinh-doanh-188 → BR-phuong-an-kinh-doanh-020 · Verify đổi sang Đã ký khi đã có khoản mục có giá trị thì kế hoạch chi phí theo tháng giữ nguyên
[3] [Yes] CHK-phuong-an-kinh-doanh-189 → BR-phuong-an-kinh-doanh-020 · Verify đổi sang Đã ký khi không giai đoạn nào có "Từ" thì kế hoạch chi phí giữ nguyên
[2] [Yes] CHK-phuong-an-kinh-doanh-190 → FR-phuong-an-kinh-doanh-012 · Verify đang có dải lỗi đỏ, đổi sang Đã ký thì dải lỗi biến mất
[2] [Yes] CHK-phuong-an-kinh-doanh-191 → FR-phuong-an-kinh-doanh-012 · Verify đổi Đã ký → Chưa ký thì dữ liệu đã nhập ở Mục 1 giữ nguyên

##3.3. Khoá lựa chọn "Chưa ký"
[1] [Yes] CHK-phuong-an-kinh-doanh-192 → FR-phuong-an-kinh-doanh-012, BR-phuong-an-kinh-doanh-021 · Verify dự án đã lưu P-03 (đã ký), SM lập PAKD lần đầu thì lựa chọn "Chưa ký" bị khoá
[1] [Yes] CHK-phuong-an-kinh-doanh-193 → FR-phuong-an-kinh-doanh-012, BR-phuong-an-kinh-doanh-021 · Verify dự án đã ký, SM làm lại PAKD sau khi bị từ chối thì lựa chọn "Chưa ký" bị khoá
[2] [Yes] CHK-phuong-an-kinh-doanh-194 → BR-phuong-an-kinh-doanh-021 · Verify dự án chưa ký thì đổi qua lại Chưa ký / Đã ký tự do

#4. Mục 2 "Tiến độ và phạm vi (theo hợp đồng)"
##4.1. Trường và Số tháng thực hiện
[1] [Yes] CHK-phuong-an-kinh-doanh-195 → FR-phuong-an-kinh-doanh-013 · Verify tình trạng Đã ký Mục 2 có đủ Bắt đầu thực hiện (tháng)*, Kết thúc dự kiến (tháng)*, Số tháng thực hiện, Phạm vi công việc*
[2] [Yes] CHK-phuong-an-kinh-doanh-196 → FR-phuong-an-kinh-doanh-013, BR-phuong-an-kinh-doanh-012 · Verify Bắt đầu 01/2027, Kết thúc 12/2027 thì Số tháng thực hiện là 12
[2] [Yes] CHK-phuong-an-kinh-doanh-197 → BR-phuong-an-kinh-doanh-012 · Verify Bắt đầu 11/2026, Kết thúc 02/2027 thì Số tháng thực hiện là 4
[3] [Yes] CHK-phuong-an-kinh-doanh-198 → BR-phuong-an-kinh-doanh-012 · Verify Bắt đầu và Kết thúc cùng tháng 03/2027 thì Số tháng thực hiện là 1
[3] [Yes] CHK-phuong-an-kinh-doanh-199 → FR-phuong-an-kinh-doanh-013, BR-phuong-an-kinh-doanh-012 · Verify thiếu Kết thúc thì Số tháng thực hiện hiển thị "—"
[3] [Yes] CHK-phuong-an-kinh-doanh-200 → FR-phuong-an-kinh-doanh-013 · Verify Kết thúc trước Bắt đầu thì Số tháng thực hiện hiển thị "—"

#5. Mục 3 "Nghiệm thu, ghi nhận doanh thu và thu tiền"
##5.1. Bảng mốc và tự tính
[2] [Yes] CHK-phuong-an-kinh-doanh-201 → FR-phuong-an-kinh-doanh-014 · Verify bảng Mục 3 có đủ cột STT · Mốc · Thời điểm · % · Giá trị · Tỷ lệ được thanh toán (%) · Giá trị thu đợt này · Thời gian gửi hồ sơ · Điều kiện nghiệm thu · Thời gian chờ (ngày) · Tháng thu tiền · nút xoá
[1] [Yes] CHK-phuong-an-kinh-doanh-202 → FR-phuong-an-kinh-doanh-014, BR-phuong-an-kinh-doanh-010 · Verify Giá trị hợp đồng 1,000,000,000, mốc 30% thì cột Giá trị của mốc là 300,000,000
[1] [Yes] CHK-phuong-an-kinh-doanh-203 → FR-phuong-an-kinh-doanh-014, BR-phuong-an-kinh-doanh-010 · Verify Giá trị mốc 300,000,000, Tỷ lệ được thanh toán 90 thì Giá trị thu đợt này là 270,000,000
[2] [Yes] CHK-phuong-an-kinh-doanh-204 → FR-phuong-an-kinh-doanh-014, BR-phuong-an-kinh-doanh-034 · Verify nhập % mốc 120 thì ô tự về 100
[2] [Yes] CHK-phuong-an-kinh-doanh-205 → FR-phuong-an-kinh-doanh-014, BR-phuong-an-kinh-doanh-034 · Verify nhập Tỷ lệ được thanh toán 150 thì ô tự về 100
[1] [Yes] CHK-phuong-an-kinh-doanh-206 → FR-phuong-an-kinh-doanh-014, BR-phuong-an-kinh-doanh-011 · Verify Thời gian gửi hồ sơ 03/2027, Thời gian chờ 30 thì Tháng thu tiền là 04/2027
[2] [Yes] CHK-phuong-an-kinh-doanh-207 → BR-phuong-an-kinh-doanh-011 · Verify Thời gian gửi hồ sơ trống, Thời điểm mốc 05/2027, chờ 30 thì Tháng thu tiền là 06/2027
[2] [Yes] CHK-phuong-an-kinh-doanh-208 → BR-phuong-an-kinh-doanh-011 · Verify Thời gian chờ 14 ngày thì Tháng thu tiền bằng tháng gửi hồ sơ (cộng 0 tháng)
[2] [Yes] CHK-phuong-an-kinh-doanh-209 → BR-phuong-an-kinh-doanh-011 · Verify Thời gian chờ 15 ngày thì Tháng thu tiền bằng tháng gửi hồ sơ cộng 1 tháng
[3] [Yes] CHK-phuong-an-kinh-doanh-210 → BR-phuong-an-kinh-doanh-011 · Verify Thời gian chờ 45 ngày thì Tháng thu tiền bằng tháng gửi hồ sơ cộng 2 tháng
[3] [Yes] CHK-phuong-an-kinh-doanh-211 → FR-phuong-an-kinh-doanh-014, BR-phuong-an-kinh-doanh-011 · Verify mốc trống cả Thời gian gửi hồ sơ và Thời điểm thì Tháng thu tiền hiển thị "—"

##5.2. Dòng TỔNG và thao tác dòng
[1] [Yes] CHK-phuong-an-kinh-doanh-212 → FR-phuong-an-kinh-doanh-014 · Verify dòng "TỔNG" Mục 3 hiển thị Σ %, Σ Giá trị, Σ Giá trị thu của các mốc
[2] [No] CHK-phuong-an-kinh-doanh-213 → FR-phuong-an-kinh-doanh-014, E-phuong-an-kinh-doanh-005 · Verify Σ % mốc bằng 90 thì Σ % ở dòng "TỔNG" hiển thị chữ đỏ
[3] [No] CHK-phuong-an-kinh-doanh-214 → FR-phuong-an-kinh-doanh-014 · Verify Σ % mốc bằng 99.99 thì Σ % ở dòng "TỔNG" không tô đỏ
[2] [Yes] CHK-phuong-an-kinh-doanh-215 → FR-phuong-an-kinh-doanh-014 · Verify bấm "Thêm dòng" ở Mục 3 sinh mốc mới với Tỷ lệ được thanh toán 100 và Thời gian chờ 30
[2] [Yes] CHK-phuong-an-kinh-doanh-216 → FR-phuong-an-kinh-doanh-014 · Verify bấm nút xoá của một mốc thì dòng mất ngay, không có hộp hỏi xác nhận

#6. Mục 4 "Kế hoạch chi phí theo tháng"
##6.1. Kỳ kế hoạch và cột tháng
[2] [Yes] CHK-phuong-an-kinh-doanh-217 → FR-phuong-an-kinh-doanh-015 · Verify Bắt đầu 01/2027, Kết thúc 06/2027 thì đầu Mục 4 hiển thị "Kỳ kế hoạch: 01/2027 – 06/2027 (6 tháng) · ĐVT: VNĐ"
[1] [Yes] CHK-phuong-an-kinh-doanh-218 → FR-phuong-an-kinh-doanh-015, BR-phuong-an-kinh-doanh-017 · Verify kỳ 01/2027 – 06/2027 thì bảng có đúng 6 cột tháng nhãn "T1/27" tới "T6/27"
[2] [Yes] CHK-phuong-an-kinh-doanh-219 → BR-phuong-an-kinh-doanh-017 · Verify Bắt đầu 05/2027, thiếu Kết thúc thì bảng tạm có 12 cột "T1/27" tới "T12/27"
[2] [Yes] CHK-phuong-an-kinh-doanh-220 → BR-phuong-an-kinh-doanh-017 · Verify chưa nhập Bắt đầu thì bảng tạm có 12 cột tháng của năm hiện tại
[3] [Yes] CHK-phuong-an-kinh-doanh-221 → BR-phuong-an-kinh-doanh-017 · Verify Kết thúc trước Bắt đầu thì bảng tạm có 12 cột tháng của năm Bắt đầu
[2] [Yes] CHK-phuong-an-kinh-doanh-222 → FR-phuong-an-kinh-doanh-015, E-phuong-an-kinh-doanh-014 · Verify thiếu Bắt đầu / Kết thúc ở Mục 2 thì Mục 4 hiện cảnh báo "Chưa nhập Bắt đầu / Kết thúc ở mục 2 — tạm lập kế hoạch 12 tháng năm {năm}."
[2] [Yes] CHK-phuong-an-kinh-doanh-223 → FR-phuong-an-kinh-doanh-015, BR-phuong-an-kinh-doanh-017 · Verify có giá trị ở tháng 08/2027 nằm ngoài kỳ 01/2027 – 06/2027 thì bảng có thêm cột "T8/27"
[3] [No] CHK-phuong-an-kinh-doanh-224 → FR-phuong-an-kinh-doanh-015, E-phuong-an-kinh-doanh-013 · Verify cột tháng ngoài kỳ được tô vàng
[2] [Yes] CHK-phuong-an-kinh-doanh-225 → FR-phuong-an-kinh-doanh-015, E-phuong-an-kinh-doanh-013 · Verify có chi phí ngoài kỳ thì Mục 4 hiện cảnh báo "Có chi phí ngoài kỳ thực hiện ({tháng}) — các cột tô vàng."
[2] [No] CHK-phuong-an-kinh-doanh-226 → NFR-phuong-an-kinh-doanh-003 · Verify kỳ 24 tháng, bảng cuộn ngang tới cột tháng cuối vẫn nhập được giá trị
[3] [No] CHK-phuong-an-kinh-doanh-227 → FR-phuong-an-kinh-doanh-015, NFR-phuong-an-kinh-doanh-003 · Verify cuộn ngang bảng Mục 4 thì 2 cột "Nhóm chi phí", "Khoản mục chi phí" giữ cố định

##6.2. Khoản mục và tổng
[2] [Yes] CHK-phuong-an-kinh-doanh-228 → FR-phuong-an-kinh-doanh-015 · Verify Mục 4 có khối "A. Chi phí sản xuất" (Sản xuất / Dự phòng sản xuất / Thưởng sản xuất) và khối "B. Chi phí kinh doanh" (Kinh doanh / Dự phòng kinh doanh / Thưởng kinh doanh), mỗi khối có nút "Thêm khoản mục"
[2] [Yes] CHK-phuong-an-kinh-doanh-229 → FR-phuong-an-kinh-doanh-015 · Verify bấm "Thêm khoản mục" ở khối A thêm 1 dòng mới nằm trong khối A
[2] [Yes] CHK-phuong-an-kinh-doanh-230 → BR-phuong-an-kinh-doanh-035 · Verify ô chọn nhóm của dòng khối A chỉ có 3 nhóm Sản xuất / Dự phòng sản xuất / Thưởng sản xuất
[2] [Yes] CHK-phuong-an-kinh-doanh-231 → BR-phuong-an-kinh-doanh-035 · Verify ô chọn nhóm của dòng khối B chỉ có 3 nhóm Kinh doanh / Dự phòng kinh doanh / Thưởng kinh doanh
[2] [Yes] CHK-phuong-an-kinh-doanh-232 → FR-phuong-an-kinh-doanh-015 · Verify mỗi dòng khoản mục có ô tháng, Tổng dòng, Kết quả đầu ra, File đính kèm, nút ÷ và nút ×
[1] [Yes] CHK-phuong-an-kinh-doanh-233 → FR-phuong-an-kinh-doanh-015 · Verify dòng có 3 tháng 10,000,000 thì cột Tổng dòng là 30,000,000
[1] [Yes] CHK-phuong-an-kinh-doanh-234 → FR-phuong-an-kinh-doanh-015, BR-phuong-an-kinh-doanh-008 · Verify dòng "Cộng chi phí sản xuất" tháng 03/2027 bằng tổng ô tháng 03/2027 của các khoản mục khối A
[2] [Yes] CHK-phuong-an-kinh-doanh-235 → FR-phuong-an-kinh-doanh-015, BR-phuong-an-kinh-doanh-008 · Verify dòng "Cộng chi phí kinh doanh" tháng 03/2027 bằng tổng ô tháng 03/2027 của các khoản mục khối B
[3] [Yes] CHK-phuong-an-kinh-doanh-236 → FR-phuong-an-kinh-doanh-015 · Verify tháng có cộng bằng 0 thì ô cộng của tháng đó hiển thị "—"
[1] [Yes] CHK-phuong-an-kinh-doanh-237 → FR-phuong-an-kinh-doanh-015 · Verify dòng "TỔNG CHI PHÍ" hiển thị tổng theo từng tháng và tổng cả kỳ
[2] [Yes] CHK-phuong-an-kinh-doanh-238 → FR-phuong-an-kinh-doanh-015 · Verify dòng "Luỹ kế chi phí" cộng dồn từ tháng đầu kỳ
[2] [Yes] CHK-phuong-an-kinh-doanh-239 → FR-phuong-an-kinh-doanh-015 · Verify nhập 0 vào ô tháng đang có giá trị thì giá trị tháng đó bị xoá (ô hiện gợi ý "0")
[2] [Yes] CHK-phuong-an-kinh-doanh-240 → FR-phuong-an-kinh-doanh-015 · Verify bấm nút × của khoản mục thì dòng bị xoá khỏi Mục 4
[4] [Yes] CHK-phuong-an-kinh-doanh-241 → FR-phuong-an-kinh-doanh-015 · Verify cuối Mục 4 có chú thích "Nhập giá trị chi dự kiến của từng khoản mục vào các tháng thực hiện. Nút ÷ chia đều một tổng giá trị cho các tháng trong kỳ. Kỳ kế hoạch lấy theo Bắt đầu / Kết thúc ở mục 2."

##6.3. Chia đều chi phí cho kỳ
[3] [Yes] CHK-phuong-an-kinh-doanh-242 → FR-phuong-an-kinh-doanh-016 · Verify rê chuột lên nút ÷ hiện gợi ý "Chia đều một tổng giá trị cho các tháng trong kỳ"
[2] [Yes] CHK-phuong-an-kinh-doanh-243 → FR-phuong-an-kinh-doanh-016 · Verify bấm ÷ trên dòng có tổng 15,000,000 với kỳ 01/2027 – 03/2027 mở hộp "Chia đều cho 3 tháng (01/2027 – 03/2027)" có ô "Tổng giá trị (VNĐ)" điền sẵn 15,000,000
[1] [Yes] CHK-phuong-an-kinh-doanh-244 → FR-phuong-an-kinh-doanh-016, BR-phuong-an-kinh-doanh-016 · Verify nhập Tổng giá trị 10,000,000 cho kỳ 3 tháng, bấm "Chia đều" thì 3 tháng nhận 3,333,000 · 3,333,000 · 3,334,000
[2] [Yes] CHK-phuong-an-kinh-doanh-245 → FR-phuong-an-kinh-doanh-016 · Verify dòng có giá trị ở tháng ngoài kỳ, bấm "Chia đều" thì giá trị ngoài kỳ của dòng bị bỏ
[2] [Yes] CHK-phuong-an-kinh-doanh-246 → FR-phuong-an-kinh-doanh-016 · Verify bấm "Huỷ" trong hộp chia đều thì hộp đóng, giá trị tháng của dòng không đổi

#7. Mốc kế hoạch và mục tiêu — Chưa ký
##7.1. Bảng giai đoạn
[2] [Yes] CHK-phuong-an-kinh-doanh-247 → FR-phuong-an-kinh-doanh-017 · Verify bảng Mốc kế hoạch có đủ cột TT · Giai đoạn · Từ · Đến · Sản xuất · Kinh doanh · Tổng · Kết quả đầu ra · File đính kèm · nút xoá
[1] [Yes] CHK-phuong-an-kinh-doanh-248 → FR-phuong-an-kinh-doanh-017 · Verify giai đoạn SX 60,000,000, KD 40,000,000 thì cột Tổng là 100,000,000
[2] [Yes] CHK-phuong-an-kinh-doanh-249 → FR-phuong-an-kinh-doanh-017 · Verify dòng "TỔNG" bảng Mốc kế hoạch hiển thị Σ Sản xuất, Σ Kinh doanh, Σ Tổng
[2] [Yes] CHK-phuong-an-kinh-doanh-250 → FR-phuong-an-kinh-doanh-017 · Verify bấm "Thêm dòng" ở bảng Mốc kế hoạch thêm 1 giai đoạn mới

##7.2. Cảnh báo giai đoạn thiếu / sai Từ–Đến
[2] [Yes] CHK-phuong-an-kinh-doanh-251 → FR-phuong-an-kinh-doanh-017, BR-phuong-an-kinh-doanh-014, E-phuong-an-kinh-doanh-017 · Verify giai đoạn 2 có SX > 0 mà thiếu "Từ" thì hiện cảnh báo cam "Giai đoạn 2 thiếu / sai Từ–Đến — không vào kế hoạch tháng"
[2] [Yes] CHK-phuong-an-kinh-doanh-252 → FR-phuong-an-kinh-doanh-017, BR-phuong-an-kinh-doanh-014, E-phuong-an-kinh-doanh-017 · Verify giai đoạn có KD > 0 với "Đến" trước "Từ" thì hiện cảnh báo "Giai đoạn {n} thiếu / sai Từ–Đến — không vào kế hoạch tháng"
[3] [Yes] CHK-phuong-an-kinh-doanh-253 → FR-phuong-an-kinh-doanh-017 · Verify giai đoạn SX bằng 0, KD bằng 0 thiếu "Từ" thì không hiện cảnh báo thiếu / sai Từ–Đến

#8. Ô nhập Số / % / Tháng / Tệp và giới hạn nhập
##8.1. Ô số và ô %
[2] [Yes] CHK-phuong-an-kinh-doanh-254 → FR-phuong-an-kinh-doanh-019 · Verify gõ 1000000 vào ô Giá trị hợp đồng thì ô hiển thị "1,000,000"
[2] [Yes] CHK-phuong-an-kinh-doanh-255 → FR-phuong-an-kinh-doanh-019 · Verify gõ chữ cái vào ô Giá trị hợp đồng thì ô không nhận ký tự đó
[3] [Yes] CHK-phuong-an-kinh-doanh-256 → FR-phuong-an-kinh-doanh-019 · Verify ô % mốc nhận giá trị thập phân 12.5
[3] [Yes] CHK-phuong-an-kinh-doanh-257 → FR-phuong-an-kinh-doanh-019 · Verify ô số để trống hiển thị gợi ý "0"

##8.2. Ô tháng
[1] [Yes] CHK-phuong-an-kinh-doanh-258 → FR-phuong-an-kinh-doanh-019, BR-phuong-an-kinh-doanh-033 · Verify gõ "2/2027" vào ô tháng, rời ô thì ô hiển thị "02/2027"
[2] [Yes] CHK-phuong-an-kinh-doanh-259 → FR-phuong-an-kinh-doanh-019, BR-phuong-an-kinh-doanh-033 · Verify gõ "022027" vào ô tháng, nhấn Enter thì ô hiển thị "02/2027"
[3] [Yes] CHK-phuong-an-kinh-doanh-260 → BR-phuong-an-kinh-doanh-033 · Verify gõ "2-2027" vào ô tháng, rời ô thì ô hiển thị "02/2027"
[4] [Yes] CHK-phuong-an-kinh-doanh-261 → BR-phuong-an-kinh-doanh-033 · Verify gõ "2.2027" vào ô tháng, rời ô thì ô hiển thị "02/2027"
[2] [Yes] CHK-phuong-an-kinh-doanh-262 → FR-phuong-an-kinh-doanh-019, BR-phuong-an-kinh-doanh-033, E-phuong-an-kinh-doanh-012 · Verify gõ "13/2027" vào ô tháng, rời ô thì ô tô nền đỏ nhạt kèm gợi ý "Nhập đúng dạng MM/YYYY"
[2] [Yes] CHK-phuong-an-kinh-doanh-263 → E-phuong-an-kinh-doanh-012 · Verify ô tháng đang có "05/2027", gõ "13/2027", rời ô thì giá trị "05/2027" được giữ nguyên
[3] [Yes] CHK-phuong-an-kinh-doanh-264 → E-phuong-an-kinh-doanh-012 · Verify gõ "0/2027" vào ô tháng, rời ô thì ô báo "Nhập đúng dạng MM/YYYY"
[3] [Yes] CHK-phuong-an-kinh-doanh-265 → BR-phuong-an-kinh-doanh-033, E-phuong-an-kinh-doanh-012 · Verify gõ "2/27" (năm 2 chữ số) vào ô tháng, rời ô thì ô báo "Nhập đúng dạng MM/YYYY"
[2] [Yes] CHK-phuong-an-kinh-doanh-266 → FR-phuong-an-kinh-doanh-019 · Verify xoá trắng ô tháng đang có giá trị, rời ô thì giá trị tháng bị xoá
[2] [Yes] CHK-phuong-an-kinh-doanh-267 → FR-phuong-an-kinh-doanh-019 · Verify khi Gửi bị lỗi thì lỗi chỉ hiện ở dải lỗi chung, các ô liên quan không bị tô

##8.3. Ô tệp đính kèm
[2] [Yes] CHK-phuong-an-kinh-doanh-268 → FR-phuong-an-kinh-doanh-019 · Verify chọn 2 tệp pdf cho ô Đính kèm của khoản mục thì hiện 2 thẻ tên tệp, mỗi thẻ có nút ×
[3] [Yes] CHK-phuong-an-kinh-doanh-269 → FR-phuong-an-kinh-doanh-019 · Verify bấm × trên thẻ tệp thì tệp bị gỡ khỏi khoản mục
[2] [Yes] CHK-phuong-an-kinh-doanh-270 → BR-phuong-an-kinh-doanh-048, E-phuong-an-kinh-doanh-022 · Verify chọn tệp 21 MB thì tệp bị loại với câu "Tệp "{tên}" vượt 20 MB"
[3] [Yes] CHK-phuong-an-kinh-doanh-271 → BR-phuong-an-kinh-doanh-048 · Verify chọn tệp đúng 20 MB định dạng pdf thì tệp được nhận
[2] [Yes] CHK-phuong-an-kinh-doanh-272 → BR-phuong-an-kinh-doanh-048, E-phuong-an-kinh-doanh-022 · Verify chọn tệp .exe thì tệp bị loại với câu "Tệp "{tên}" không đúng định dạng (chỉ nhận pdf, doc, docx, xls, xlsx, jpg, png)"
[2] [Yes] CHK-phuong-an-kinh-doanh-273 → BR-phuong-an-kinh-doanh-048, E-phuong-an-kinh-doanh-022 · Verify chọn cùng lượt 1 tệp xlsx hợp lệ và 1 tệp 25 MB thì tệp xlsx vẫn được nhận
[3] [Yes] CHK-phuong-an-kinh-doanh-274 → BR-phuong-an-kinh-doanh-048 · Verify ô Đính kèm của giai đoạn (Mốc kế hoạch) loại tệp 21 MB với câu "Tệp "{tên}" vượt 20 MB"

##8.4. Giới hạn độ dài và khoảng trắng
[2] [Yes] CHK-phuong-an-kinh-doanh-275 → FR-phuong-an-kinh-doanh-022, BR-phuong-an-kinh-doanh-047, E-phuong-an-kinh-doanh-021 · Verify Số hợp đồng 256 ký tự, bấm Gửi Kế toán duyệt thì dải lỗi có câu "Tối đa {n} ký tự" (n = 255) kèm tên ô Số hợp đồng
[3] [Yes] CHK-phuong-an-kinh-doanh-276 → BR-phuong-an-kinh-doanh-047 · Verify Số hợp đồng đúng 255 ký tự không bị báo vượt độ dài
[2] [Yes] CHK-phuong-an-kinh-doanh-277 → BR-phuong-an-kinh-doanh-047 · Verify Phạm vi công việc 1.001 ký tự, bấm Gửi thì dải lỗi có câu "Tối đa {n} ký tự" (n = 1.000) kèm tên ô
[3] [Yes] CHK-phuong-an-kinh-doanh-278 → BR-phuong-an-kinh-doanh-047 · Verify tên khoản mục chi phí 256 ký tự, bấm Gửi thì dải lỗi có câu vượt độ dài kèm tên ô
[3] [Yes] CHK-phuong-an-kinh-doanh-279 → BR-phuong-an-kinh-doanh-047 · Verify Đánh giá rủi ro 1.001 ký tự, bấm Gửi thì dải lỗi có câu vượt độ dài kèm tên ô
[2] [Yes] CHK-phuong-an-kinh-doanh-280 → BR-phuong-an-kinh-doanh-047, E-phuong-an-kinh-doanh-021 · Verify Giá trị hợp đồng 16 chữ số, bấm Gửi thì dải lỗi có câu "Tối đa 15 chữ số"
[3] [Yes] CHK-phuong-an-kinh-doanh-281 → BR-phuong-an-kinh-doanh-047 · Verify Giá trị hợp đồng 15 chữ số không bị báo vượt
[3] [Yes] CHK-phuong-an-kinh-doanh-282 → FR-phuong-an-kinh-doanh-016, BR-phuong-an-kinh-doanh-047 · Verify Tổng giá trị chia đều 16 chữ số thì không chia đều được và báo "Tối đa 15 chữ số"
[2] [Yes] CHK-phuong-an-kinh-doanh-283 → BR-phuong-an-kinh-doanh-047, BR-phuong-an-kinh-doanh-034, E-phuong-an-kinh-doanh-021 · Verify Thời gian chờ 1000 ngày, bấm Gửi thì dải lỗi có câu "Tối đa 999 ngày"
[1] [Yes] CHK-phuong-an-kinh-doanh-284 → FR-phuong-an-kinh-doanh-021, BR-phuong-an-kinh-doanh-047, E-phuong-an-kinh-doanh-021 · Verify Số hợp đồng 256 ký tự, bấm Lưu nháp thì dải lỗi có câu vượt độ dài và PAKD không được lưu
[2] [Yes] CHK-phuong-an-kinh-doanh-285 → BR-phuong-an-kinh-doanh-047 · Verify Phạm vi công việc chỉ gồm khoảng trắng, bấm Gửi thì dải lỗi có "Nhập Phạm vi công việc"
[3] [Yes] CHK-phuong-an-kinh-doanh-286 → BR-phuong-an-kinh-doanh-047 · Verify Số hợp đồng nhập "  HĐ-01  ", Lưu nháp, mở lại thì ô hiển thị "HĐ-01"

#9. Lưu nháp PAKD
##9.1. Lưu nháp thành công
[1] [Yes] CHK-phuong-an-kinh-doanh-287 → FR-phuong-an-kinh-doanh-021 · Verify SM bấm Lưu nháp thì hiện toast "Đã lưu nháp PAKD"
[1] [Yes] CHK-phuong-an-kinh-doanh-288 → FR-phuong-an-kinh-doanh-021, BR-phuong-an-kinh-doanh-024 · Verify Lưu nháp khi còn thiếu trường bắt buộc vẫn lưu thành công, không hiện dải lỗi "Chưa gửi được — cần bổ sung:"
[1] [Yes] CHK-phuong-an-kinh-doanh-289 → FR-phuong-an-kinh-doanh-021 · Verify sau Lưu nháp dự án vẫn "Chưa có PAKD" và cột "Phiên bản PAKD" vẫn "—"
[1] [Yes] CHK-phuong-an-kinh-doanh-290 → FR-phuong-an-kinh-doanh-021 · Verify Lưu nháp xong mở lại dự án thì khung hiển thị đúng nội dung vừa lưu
[2] [Yes] CHK-phuong-an-kinh-doanh-291 → FR-phuong-an-kinh-doanh-021, FR-phuong-an-kinh-doanh-038 · Verify tab "Lịch sử" có dòng "Lưu nháp PAKD", người thực hiện "{tài khoản} (SM)", không có ghi chú
[2] [Yes] CHK-phuong-an-kinh-doanh-292 → BR-phuong-an-kinh-doanh-002 · Verify GĐK của khối dự án Lưu nháp thành công với toast "Đã lưu nháp PAKD"

##9.2. Lưu nháp — dữ liệu vừa đổi và lỗi ghi
[1] [No] CHK-phuong-an-kinh-doanh-293 → FR-phuong-an-kinh-doanh-021, E-phuong-an-kinh-doanh-019 · Verify SM bấm Lưu nháp đúng lúc GĐK vừa gửi PAKD đó thì bị từ chối với thông báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại."
[1] [No] CHK-phuong-an-kinh-doanh-294 → E-phuong-an-kinh-doanh-019 · Verify sau thông báo dữ liệu vừa đổi khi Lưu nháp, khung nạp lại hiển thị bản vừa được gửi ở chế độ chỉ xem
[2] [No] CHK-phuong-an-kinh-doanh-295 → FR-phuong-an-kinh-doanh-021 · Verify SM bấm Lưu nháp đúng lúc dự án vừa chuyển Pending thì hiện "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại."
[1] [No] CHK-phuong-an-kinh-doanh-296 → FR-phuong-an-kinh-doanh-021, E-phuong-an-kinh-doanh-020 · Verify giả lập lỗi ghi khi Lưu nháp thì hiện "Thao tác chưa thực hiện được, vui lòng thử lại" và không có toast thành công
[1] [No] CHK-phuong-an-kinh-doanh-297 → E-phuong-an-kinh-doanh-020, NFR-phuong-an-kinh-doanh-010 · Verify sau lỗi ghi khi Lưu nháp, khung giữ nguyên nội dung đang nhập
[2] [No] CHK-phuong-an-kinh-doanh-298 → E-phuong-an-kinh-doanh-020, NFR-phuong-an-kinh-doanh-010 · Verify bấm Lưu nháp lại sau lỗi ghi thì lưu thành công và tab "Lịch sử" chỉ có 1 dòng "Lưu nháp PAKD" mới

#10. Gửi Kế toán duyệt — kiểm tra
##10.1. Dải lỗi
[1] [Yes] CHK-phuong-an-kinh-doanh-299 → FR-phuong-an-kinh-doanh-022, BR-phuong-an-kinh-doanh-024 · Verify bấm "Gửi Kế toán duyệt" khi thiếu trường bắt buộc thì hiện dải đỏ "Chưa gửi được — cần bổ sung:" kèm danh sách lỗi
[2] [Yes] CHK-phuong-an-kinh-doanh-300 → FR-phuong-an-kinh-doanh-022 · Verify khi hiện dải lỗi thì màn cuộn tới đầu khung PAKD
[2] [Yes] CHK-phuong-an-kinh-doanh-301 → FR-phuong-an-kinh-doanh-022 · Verify dải lỗi tự biến mất khi sửa một ô bất kỳ
[2] [Yes] CHK-phuong-an-kinh-doanh-302 → FR-phuong-an-kinh-doanh-022 · Verify Đã ký thiếu cùng lúc Phạm vi công việc, Giá trị hợp đồng và tổng % mốc bằng 90 thì dải lỗi liệt kê đủ 3 dòng lỗi tương ứng

##10.2. Kiểm tra chung và Đã ký
[1] [Yes] CHK-phuong-an-kinh-doanh-303 → BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-001 · Verify Đã ký, Phạm vi công việc trống, bấm Gửi thì dải lỗi có "Nhập Phạm vi công việc"
[2] [Yes] CHK-phuong-an-kinh-doanh-304 → BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-001 · Verify Chưa ký, Phạm vi công việc trống, bấm Gửi thì dải lỗi có "Nhập Phạm vi công việc"
[2] [Yes] CHK-phuong-an-kinh-doanh-305 → E-phuong-an-kinh-doanh-001 · Verify sau khi nhập Phạm vi công việc bị thiếu, bấm Gửi lại thì gửi thành công
[1] [Yes] CHK-phuong-an-kinh-doanh-306 → BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-002 · Verify Đã ký, Giá trị hợp đồng trống, bấm Gửi thì dải lỗi có "Nhập Giá trị hợp đồng"
[2] [Yes] CHK-phuong-an-kinh-doanh-307 → E-phuong-an-kinh-doanh-002 · Verify Đã ký, Giá trị hợp đồng bằng 0, bấm Gửi thì dải lỗi có "Nhập Giá trị hợp đồng"
[1] [Yes] CHK-phuong-an-kinh-doanh-308 → E-phuong-an-kinh-doanh-003 · Verify Đã ký, thiếu Kết thúc, bấm Gửi thì dải lỗi có "Nhập Bắt đầu / Kết thúc thực hiện (tháng)"
[3] [Yes] CHK-phuong-an-kinh-doanh-309 → E-phuong-an-kinh-doanh-003 · Verify Đã ký, thiếu Bắt đầu, bấm Gửi thì dải lỗi có "Nhập Bắt đầu / Kết thúc thực hiện (tháng)"
[1] [Yes] CHK-phuong-an-kinh-doanh-310 → E-phuong-an-kinh-doanh-004 · Verify Đã ký, Kết thúc 02/2027 trước Bắt đầu 03/2027, bấm Gửi thì dải lỗi có "Kết thúc phải sau Bắt đầu"
[2] [Yes] CHK-phuong-an-kinh-doanh-311 → E-phuong-an-kinh-doanh-004 · Verify Đã ký, Bắt đầu và Kết thúc cùng 03/2027 thì không báo "Kết thúc phải sau Bắt đầu"
[1] [Yes] CHK-phuong-an-kinh-doanh-312 → E-phuong-an-kinh-doanh-005 · Verify Đã ký, tổng % mốc 90, bấm Gửi thì dải lỗi có "Tổng % các mốc nghiệm thu phải bằng 100% (hiện 90%)"
[2] [Yes] CHK-phuong-an-kinh-doanh-313 → E-phuong-an-kinh-doanh-005 · Verify Đã ký, 3 mốc mỗi mốc 33.33% (tổng 99.99) thì không báo lỗi tổng % mốc
[2] [Yes] CHK-phuong-an-kinh-doanh-314 → E-phuong-an-kinh-doanh-005 · Verify Đã ký, 3 mốc mỗi mốc 33.3% (tổng 99.9), bấm Gửi thì dải lỗi có câu tổng % mốc kèm "(hiện 99.9%)"
[1] [Yes] CHK-phuong-an-kinh-doanh-315 → E-phuong-an-kinh-doanh-006 · Verify Đã ký, không khoản mục nào có tổng > 0, bấm Gửi thì dải lỗi có "Lập kế hoạch chi phí: nhập giá trị cho ít nhất một khoản mục / tháng"
[2] [Yes] CHK-phuong-an-kinh-doanh-316 → E-phuong-an-kinh-doanh-007 · Verify Đã ký, có dòng chi phí tổng > 0 mà tên khoản mục trống, bấm Gửi thì dải lỗi có "Nhập tên khoản mục cho các dòng chi phí có giá trị"
[3] [Yes] CHK-phuong-an-kinh-doanh-317 → E-phuong-an-kinh-doanh-007 · Verify Đã ký, dòng chi phí tên trống nhưng tổng bằng 0 thì không báo thiếu tên khoản mục

##10.3. Kiểm tra Chưa ký
[1] [Yes] CHK-phuong-an-kinh-doanh-318 → BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-008 · Verify Chưa ký, Thời điểm dự kiến ký trống, bấm Gửi thì dải lỗi có "Nhập Thời điểm dự kiến ký"
[1] [Yes] CHK-phuong-an-kinh-doanh-319 → E-phuong-an-kinh-doanh-009 · Verify Chưa ký, Giá trị hợp đồng dự kiến bằng 0, bấm Gửi thì dải lỗi có "Nhập Giá trị hợp đồng dự kiến"
[1] [Yes] CHK-phuong-an-kinh-doanh-320 → E-phuong-an-kinh-doanh-009 · Verify Chưa ký, Đánh giá rủi ro trống, bấm Gửi thì dải lỗi có "Nhập Đánh giá rủi ro"
[3] [Yes] CHK-phuong-an-kinh-doanh-321 → E-phuong-an-kinh-doanh-009 · Verify Chưa ký thiếu cả Giá trị dự kiến và Đánh giá rủi ro thì dải lỗi có 2 dòng lỗi riêng
[1] [Yes] CHK-phuong-an-kinh-doanh-322 → E-phuong-an-kinh-doanh-010 · Verify Chưa ký, không giai đoạn nào vừa có tên vừa có SX / KD > 0, bấm Gửi thì dải lỗi có "Nhập ít nhất một mốc kế hoạch có tổng mức đầu tư"
[2] [Yes] CHK-phuong-an-kinh-doanh-323 → E-phuong-an-kinh-doanh-010 · Verify Chưa ký, giai đoạn có SX > 0 nhưng tên giai đoạn trống, bấm Gửi thì dải lỗi có "Nhập ít nhất một mốc kế hoạch có tổng mức đầu tư"
[3] [Yes] CHK-phuong-an-kinh-doanh-324 → BR-phuong-an-kinh-doanh-024 · Verify Chưa ký không có khoản mục chi phí theo tháng thì không báo lỗi "Lập kế hoạch chi phí: nhập giá trị cho ít nhất một khoản mục / tháng"

##10.4. Cảnh báo không chặn gửi
[2] [Yes] CHK-phuong-an-kinh-doanh-325 → BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-013 · Verify Đã ký có chi phí ngoài kỳ (cảnh báo cột vàng) vẫn Gửi Kế toán duyệt thành công
[2] [Yes] CHK-phuong-an-kinh-doanh-326 → BR-phuong-an-kinh-doanh-009, BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-016 · Verify Biên lợi nhuận 15.0% ("! Dưới khung") vẫn Gửi Kế toán duyệt thành công
[2] [Yes] CHK-phuong-an-kinh-doanh-327 → FR-phuong-an-kinh-doanh-017, BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-017 · Verify Chưa ký có giai đoạn thiếu "Từ" (cảnh báo cam) vẫn Gửi Kế toán duyệt thành công
[2] [Yes] CHK-phuong-an-kinh-doanh-328 → BR-phuong-an-kinh-doanh-018, BR-phuong-an-kinh-doanh-024, E-phuong-an-kinh-doanh-015 · Verify Đã ký, dự án có hợp đồng lệch doanh thu PAKD 5% vẫn Gửi Kế toán duyệt thành công

#11. Gửi Kế toán duyệt — thành công
##11.1. Kết quả gửi lần đầu
[1] [Yes] CHK-phuong-an-kinh-doanh-329 → FR-phuong-an-kinh-doanh-023 · Verify Gửi hợp lệ thì dự án chuyển trạng thái "PAKD chờ duyệt"
[1] [Yes] CHK-phuong-an-kinh-doanh-330 → FR-phuong-an-kinh-doanh-023, BR-phuong-an-kinh-doanh-025 · Verify Gửi lần đầu hợp lệ thì hiện toast "Đã gửi PAKD V1 — chờ Kế toán (CFO) duyệt"
[1] [Yes] CHK-phuong-an-kinh-doanh-331 → FR-phuong-an-kinh-doanh-023, BR-phuong-an-kinh-doanh-025 · Verify Gửi lần đầu hợp lệ thì cột "Phiên bản PAKD" hiển thị "V1, chờ CFO"
[2] [Yes] CHK-phuong-an-kinh-doanh-332 → FR-phuong-an-kinh-doanh-023, FR-phuong-an-kinh-doanh-038 · Verify Gửi Đã ký hợp lệ thì tab "Lịch sử" có dòng "Nộp PAKD" ghi chú "Đã ký · Doanh thu {x} · Chi phí {y} · Chờ Kế toán (CFO) duyệt"
[1] [Yes] CHK-phuong-an-kinh-doanh-333 → FR-phuong-an-kinh-doanh-023 · Verify sau Gửi khung chuyển chỉ xem và nhãn "Đã có PAKD · chờ Kế toán duyệt"
[2] [Yes] CHK-phuong-an-kinh-doanh-334 → FR-phuong-an-kinh-doanh-020 · Verify sau Gửi đầu trang không còn nút "Lưu nháp" · "Gửi Kế toán duyệt"
[1] [Yes] CHK-phuong-an-kinh-doanh-335 → FR-phuong-an-kinh-doanh-023, BR-phuong-an-kinh-doanh-026 · Verify sau Gửi cột "Giá trị hợp đồng dự kiến" của dự án ở danh sách vẫn hiển thị "—"
[1] [No] CHK-phuong-an-kinh-doanh-336 → BR-phuong-an-kinh-doanh-026 · Verify sau Gửi doanh thu dự kiến, chi phí SX / KD kế hoạch và kế hoạch theo tháng của dự án không đổi
[2] [No] CHK-phuong-an-kinh-doanh-337 → BR-phuong-an-kinh-doanh-026 · Verify dự án "PAKD chờ duyệt" không được cộng vào Sổ theo dõi / Báo cáo theo số liệu PAKD
[2] [No] CHK-phuong-an-kinh-doanh-338 → FR-phuong-an-kinh-doanh-023, BR-phuong-an-kinh-doanh-044 · Verify sau Gửi hệ thống lưu bản chụp toàn bộ nội dung PAKD gắn với phiên bản V1
[2] [No] CHK-phuong-an-kinh-doanh-339 → FR-phuong-an-kinh-doanh-038 · Verify sau Gửi Version dự án không tăng
[1] [Yes] CHK-phuong-an-kinh-doanh-340 → BR-phuong-an-kinh-doanh-002 · Verify GĐK của khối dự án Gửi hợp lệ thì dự án chuyển "PAKD chờ duyệt"
[2] [Yes] CHK-phuong-an-kinh-doanh-341 → NFR-phuong-an-kinh-doanh-011 · Verify bấm "Gửi Kế toán duyệt" 2 lần liên tiếp nhanh thì chỉ có 1 phiên bản "V1, chờ CFO" và 1 dòng lịch sử "Nộp PAKD"

##11.2. Làm lại sau khi bị từ chối
[2] [Yes] CHK-phuong-an-kinh-doanh-342 → FR-phuong-an-kinh-doanh-002, FR-phuong-an-kinh-doanh-006 · Verify SM mở dự án bị từ chối V1 thì khung cho nhập và hiển thị nội dung PAKD đã gửi trước đó để sửa
[1] [Yes] CHK-phuong-an-kinh-doanh-343 → FR-phuong-an-kinh-doanh-023, BR-phuong-an-kinh-doanh-025 · Verify gửi lại sau khi V1 bị từ chối thì toast "Đã gửi PAKD V1 — chờ Kế toán (CFO) duyệt" (giữ số V1)
[1] [Yes] CHK-phuong-an-kinh-doanh-344 → BR-phuong-an-kinh-doanh-025 · Verify gửi lại sau khi V1 bị từ chối thì cột "Phiên bản PAKD" hiển thị "V1, chờ CFO"
[2] [No] CHK-phuong-an-kinh-doanh-345 → BR-phuong-an-kinh-doanh-025, BR-phuong-an-kinh-doanh-038 · Verify gửi lại sau khi bị từ chối thì danh sách phiên bản có thêm 1 dòng V1 mới, dòng V1 "Từ chối" cũ vẫn còn

##11.3. Gửi — quyền, dữ liệu vừa đổi và lỗi ghi
[1] [No] CHK-phuong-an-kinh-doanh-346 → BR-phuong-an-kinh-doanh-002, E-phuong-an-kinh-doanh-018, NFR-phuong-an-kinh-doanh-007 · Verify SM khối khác gửi yêu cầu Lưu nháp PAKD bằng đường ngoài giao diện thì bị từ chối "Bạn không có quyền thực hiện thao tác này."
[1] [No] CHK-phuong-an-kinh-doanh-347 → E-phuong-an-kinh-doanh-018 · Verify sau khi SM khối khác bị từ chối quyền khi Lưu nháp, nội dung PAKD của dự án giữ nguyên như trước thao tác
[1] [No] CHK-phuong-an-kinh-doanh-348 → FR-phuong-an-kinh-doanh-023, E-phuong-an-kinh-doanh-019, NFR-phuong-an-kinh-doanh-011 · Verify bấm Gửi đúng lúc dự án vừa chuyển Pending thì bị từ chối với thông báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại."
[1] [No] CHK-phuong-an-kinh-doanh-349 → FR-phuong-an-kinh-doanh-023 · Verify bấm Gửi đúng lúc PAKD vừa được người khác gửi thì hiện thông báo dữ liệu vừa đổi và không sinh phiên bản thứ hai
[1] [No] CHK-phuong-an-kinh-doanh-350 → FR-phuong-an-kinh-doanh-023 · Verify hợp đồng vừa được lưu qua P-03 và đã cập nhật Mục 1 bản đang lập, SM bấm Gửi trên nội dung cũ thì bị từ chối với thông báo dữ liệu vừa đổi
[1] [No] CHK-phuong-an-kinh-doanh-351 → E-phuong-an-kinh-doanh-019 · Verify sau thông báo dữ liệu vừa đổi khi Gửi, khung nạp lại với Mục 1 theo hợp đồng mới
[1] [No] CHK-phuong-an-kinh-doanh-352 → FR-phuong-an-kinh-doanh-023, E-phuong-an-kinh-doanh-020, NFR-phuong-an-kinh-doanh-010 · Verify giả lập lỗi ghi khi Gửi thì dự án vẫn "Chưa có PAKD", không có phiên bản mới, không có dòng lịch sử "Nộp PAKD"
[1] [No] CHK-phuong-an-kinh-doanh-353 → NFR-phuong-an-kinh-doanh-010 · Verify sau lỗi ghi khi Gửi, khung giữ nguyên nội dung đang nhập để bấm lại
