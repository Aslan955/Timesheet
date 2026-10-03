#1. Mở P-06 & hiển thị dòng sổ
##1.1. Tiêu đề & dòng phụ
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-239 → FR-bao-cao-hieu-qua-du-an-017, BR-bao-cao-hieu-qua-du-an-018 · Mở P-06 từ số thực tế Chi phí: tiêu đề "CHI THỰC TẾ"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-240 → FR-bao-cao-hieu-qua-du-an-017 · Mở P-06 từ số thực tế Dòng tiền thu: tiêu đề "BÁO CÁO DÒNG TIỀN THU TRONG KỲ"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-241 → FR-bao-cao-hieu-qua-du-an-017, BR-bao-cao-hieu-qua-du-an-019 · Dòng phụ của P-06 hiện tên phạm vi / dự án truyền vào (vd "Khối G1 · 12 dự án")
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-242 → FR-bao-cao-hieu-qua-du-an-017 · Kỳ từ = đến = 09/2026: dòng phụ hiện "Tháng 9 năm 2026 · ĐVT: VNĐ · Nguồn: sổ kế toán import"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-243 → FR-bao-cao-hieu-qua-du-an-017 · Kỳ 01/2026–08/2026: dòng phụ hiện "Từ tháng 01/2026 đến tháng 08/2026 · ĐVT: VNĐ · Nguồn: sổ kế toán import"
##1.2. Cột bảng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-244 → FR-bao-cao-hieu-qua-du-an-017 · Sổ thu: bảng có đủ 8 cột Ngày hạch toán · Diễn giải · Số tiền · Tên đối tượng · Mã công trình · Tên công trình · Mã đơn vị · Tên đơn vị
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-245 → FR-bao-cao-hieu-qua-du-an-017, BR-bao-cao-hieu-qua-du-an-020, BR-bao-cao-hieu-qua-du-an-018 · Sổ chi: bảng có đủ 5 cột Mã dự án (Mã tổng/Mã SX/Mã KD) · Tháng (MM/yyyy) · Chi sản xuất (đ) · Chi kinh doanh (đ) · Ghi chú
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-246 → NFR-bao-cao-hieu-qua-du-an-006 · Sổ thu: cột Ngày hạch toán hiển thị dd/mm/yyyy
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-247 → NFR-bao-cao-hieu-qua-du-an-006 · Cột Số tiền hiển thị làm tròn đơn vị, ngăn nghìn bằng dấu phẩy
##1.3. Dòng sổ được lấy
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-248 → BR-bao-cao-hieu-qua-du-an-020, FR-bao-cao-hieu-qua-du-an-016 · P-06 của dự án X có dòng sổ mang Mã tổng của X
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-249 → BR-bao-cao-hieu-qua-du-an-020 · P-06 của dự án X có dòng sổ mang Mã KD (Mã tổng.1) của X
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-250 → BR-bao-cao-hieu-qua-du-an-020 · P-06 của dự án X có dòng sổ mang Mã SX (Mã tổng.2) của X
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-251 → BR-bao-cao-hieu-qua-du-an-020 · P-06 của dự án X có dòng sổ mang mã outsource đang dùng của X (vd Mã tổng.3)
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-252 → BR-bao-cao-hieu-qua-du-an-020 · P-06 của dự án X có dòng sổ mang mã outsource đã xoá của X
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-253 → BR-bao-cao-hieu-qua-du-an-020 · Dòng sổ mang mã của X viết chữ thường, có khoảng trắng đầu / cuối: vẫn có trong P-06 của X
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-254 → BR-bao-cao-hieu-qua-du-an-020 · P-06 của dự án X không có dòng sổ mang mã của dự án khác
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-255 → BR-bao-cao-hieu-qua-du-an-020 · P-06 sổ thu mức Toàn công ty không có dòng trống Mã công trình
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-256 → FR-bao-cao-hieu-qua-du-an-016, BR-bao-cao-hieu-qua-du-an-019 · P-06 kỳ 01–08 không có dòng sổ thuộc tháng 09
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-257 → BR-bao-cao-hieu-qua-du-an-022 · Sổ thu: dòng có Ngày hạch toán 31/08 không có trong P-06 kỳ tháng 9
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-258 → NFR-bao-cao-hieu-qua-du-an-001, BR-bao-cao-hieu-qua-du-an-030 · Dòng sổ đã bị thay ở lần import sau (hết hiệu lực) không có trong P-06
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-259 → BR-bao-cao-hieu-qua-du-an-022 · Sổ thu: các dòng sắp theo Ngày hạch toán tăng dần
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-260 → BR-bao-cao-hieu-qua-du-an-022 · Sổ chi: các dòng sắp theo Tháng, cùng tháng sắp theo Mã dự án
##1.4. Tổng & hiển thị theo từng phần
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-261 → FR-bao-cao-hieu-qua-du-an-017 · Sổ thu: dòng "Tổng cộng" bằng Σ Số tiền các dòng thoả bộ lọc
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-262 → FR-bao-cao-hieu-qua-du-an-017 · Sổ chi: dòng tổng có thêm "Tổng chi: X" với X bằng Σ Chi sản xuất + Σ Chi kinh doanh
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-263 → FR-bao-cao-hieu-qua-du-an-017 · Thanh công cụ hiện "n dòng · Tổng X" với n là số dòng thoả bộ lọc
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-264 → BR-bao-cao-hieu-qua-du-an-040, FR-bao-cao-hieu-qua-du-an-017 · P-06 mức Toàn công ty kỳ 12 tháng (nhiều dòng): bảng hiển thị theo từng phần
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-265 → BR-bao-cao-hieu-qua-du-an-040 · Bảng đang hiển thị theo từng phần: "n dòng · Tổng X" tính trên toàn bộ dòng thoả bộ lọc, không chỉ phần đang hiện
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-266 → BR-bao-cao-hieu-qua-du-an-040 · Bảng đang hiển thị theo từng phần: dòng "Tổng cộng" tính trên toàn bộ dòng thoả bộ lọc
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-267 → E-bao-cao-hieu-qua-du-an-019, FR-bao-cao-hieu-qua-du-an-017 · Không có dòng sổ nào trong phạm vi / kỳ: bảng hiện "Không có dòng chi tiết nào trong kỳ."
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-268 → E-bao-cao-hieu-qua-du-an-019 · Không có dòng sổ nào: bảng không có dòng tổng
#2. Tìm kiếm
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-269 → FR-bao-cao-hieu-qua-du-an-018 · Sổ thu: ô tìm kiếm có placeholder "Tìm diễn giải, đối tượng, mã công trình..."
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-270 → FR-bao-cao-hieu-qua-du-an-018 · Sổ chi: ô tìm kiếm có placeholder "Tìm mã dự án, ghi chú..."
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-271 → FR-bao-cao-hieu-qua-du-an-018 · Gõ từ khoá vào ô tìm: bảng lọc ngay khi gõ, không cần bấm nút
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-272 → BR-bao-cao-hieu-qua-du-an-021 · Sổ thu: từ khoá có trong Diễn giải ra đúng dòng đó
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-273 → BR-bao-cao-hieu-qua-du-an-021 · Sổ thu: từ khoá có trong Tên đối tượng ra đúng dòng đó
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-274 → BR-bao-cao-hieu-qua-du-an-021 · Sổ thu: từ khoá có trong Mã công trình ra đúng dòng đó
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-275 → BR-bao-cao-hieu-qua-du-an-021 · Sổ thu: từ khoá có trong Tên công trình ra đúng dòng đó
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-276 → BR-bao-cao-hieu-qua-du-an-021 · Sổ thu: từ khoá chỉ có trong Mã đơn vị không ra dòng nào
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-277 → BR-bao-cao-hieu-qua-du-an-021 · Sổ chi: từ khoá có trong Mã dự án ra đúng dòng đó
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-278 → BR-bao-cao-hieu-qua-du-an-021 · Sổ chi: từ khoá có trong Ghi chú ra đúng dòng đó
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-279 → BR-bao-cao-hieu-qua-du-an-021 · Từ khoá "ha noi" (không dấu) ra dòng có "Hà Nội"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-280 → BR-bao-cao-hieu-qua-du-an-021 · Từ khoá "HÀ NỘI" (chữ hoa) ra dòng có "Hà Nội"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-281 → BR-bao-cao-hieu-qua-du-an-021 · Từ khoá "  Hà Nội  " (khoảng trắng đầu / cuối) ra cùng kết quả với "Hà Nội"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-282 → BR-bao-cao-hieu-qua-du-an-021 · Từ khoá chỉ gồm khoảng trắng: bảng hiện toàn bộ dòng như ô tìm trống
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-283 → BR-bao-cao-hieu-qua-du-an-040, FR-bao-cao-hieu-qua-du-an-017 · Đang tìm kiếm: "n dòng · Tổng X" tính theo các dòng thoả từ khoá
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-284 → E-bao-cao-hieu-qua-du-an-019 · Từ khoá không khớp dòng nào: bảng hiện "Không có dòng chi tiết nào trong kỳ."
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-285 → E-bao-cao-hieu-qua-du-an-019 · Đang hiện "Không có dòng chi tiết nào trong kỳ." do tìm kiếm, xoá từ khoá: bảng hiện lại các dòng
#3. Ẩn dòng bằng 0
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-286 → FR-bao-cao-hieu-qua-du-an-019 · Sổ chi: ô tích "Ẩn dòng bằng 0" đang bật khi mở P-06
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-287 → FR-bao-cao-hieu-qua-du-an-019 · Ô tích bật: dòng có Chi SX = 0 và Chi KD = 0 không hiện
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-288 → FR-bao-cao-hieu-qua-du-an-019 · Ô tích bật: dòng có Chi SX = 0, Chi KD khác 0 vẫn hiện
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-289 → FR-bao-cao-hieu-qua-du-an-019 · Bỏ tích "Ẩn dòng bằng 0": dòng có Chi SX = Chi KD = 0 hiện lại
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-290 → FR-bao-cao-hieu-qua-du-an-019 · Sổ thu: không có ô tích "Ẩn dòng bằng 0"
#4. Cảnh báo lệch tổng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-291 → E-bao-cao-hieu-qua-du-an-015, FR-bao-cao-hieu-qua-du-an-021 · Ô tìm trống, tổng các dòng khác con số vừa bấm: dải vàng hiện "Tổng chi tiết ({X}) khác con số trên báo cáo ({Y}) — vui lòng đối chiếu với Kế toán."
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-292 → FR-bao-cao-hieu-qua-du-an-021 · Tổng các dòng bằng con số vừa bấm: không có dải vàng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-293 → BR-bao-cao-hieu-qua-du-an-023 · Ô tìm có từ khoá, tổng các dòng khác con số vừa bấm: không có dải vàng
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-294 → BR-bao-cao-hieu-qua-du-an-023 · Tổng các dòng lệch con số vừa bấm dưới 0,5 đồng (làm tròn đơn vị bằng nhau): không có dải vàng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-295 → BR-bao-cao-hieu-qua-du-an-040 · Bảng hiển thị theo từng phần, tổng toàn bộ dòng bằng con số vừa bấm: không có dải vàng dù tổng phần đang hiện nhỏ hơn
#5. Export XLSX
##5.1. Xuất file
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-296 → FR-bao-cao-hieu-qua-du-an-020 · Bấm "Export XLSX": tải về 1 file .xlsx
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-297 → BR-bao-cao-hieu-qua-du-an-024, FR-bao-cao-hieu-qua-du-an-020 · Đang tìm kiếm: file xuất chỉ có các dòng thoả từ khoá
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-298 → BR-bao-cao-hieu-qua-du-an-024, BR-bao-cao-hieu-qua-du-an-040 · Bảng hiển thị theo từng phần: file xuất có cả các dòng chưa hiện trên bảng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-299 → BR-bao-cao-hieu-qua-du-an-024 · Sổ chi, ô tích "Ẩn dòng bằng 0" bật: file xuất không có dòng Chi SX = Chi KD = 0
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-300 → BR-bao-cao-hieu-qua-du-an-024 · File xuất không có dòng Tổng cộng
##5.2. Mẫu file sổ thu
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-301 → BR-bao-cao-hieu-qua-du-an-024 · File xuất sổ thu có sheet "SỔ TIỀN GỬI NGÂN HÀNG"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-302 → BR-bao-cao-hieu-qua-du-an-024 · File xuất sổ thu: dòng 1 là tiêu đề, dòng 2 là kỳ, dòng 3 là tên 8 cột
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-303 → BR-bao-cao-hieu-qua-du-an-024 · File xuất sổ thu: cột Ngày hạch toán dạng dd/mm/yyyy
##5.3. Mẫu file sổ chi
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-304 → BR-bao-cao-hieu-qua-du-an-024 · File xuất sổ chi có sheet "Chi thuc te"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-305 → BR-bao-cao-hieu-qua-du-an-024, BR-bao-cao-hieu-qua-du-an-020 · File xuất sổ chi: dòng tên cột có "Mã dự án (Mã tổng/Mã SX/Mã KD) *", "Tháng (MM/yyyy) *", "Chi sản xuất (đ) *", "Chi kinh doanh (đ) *", "Ghi chú" (cột Ghi chú không có dấu *)
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-306 → BR-bao-cao-hieu-qua-du-an-024 · File xuất sổ chi: cột Tháng dạng MM/YYYY
##5.4. Tên file
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-307 → BR-bao-cao-hieu-qua-du-an-024 · P-06 sổ chi của 1 dự án Mã tổng ABC, kỳ 01–08/2026: tên file "ChiThucTe_ABC_2026-01_2026-08.xlsx"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-308 → BR-bao-cao-hieu-qua-du-an-024 · P-06 sổ thu mức khối nhiều dự án, kỳ 09/2026: tên file "DongTienThu_nhieu-du-an_2026-09_2026-09.xlsx"
##5.5. Giới hạn & trường hợp không xuất
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-309 → FR-bao-cao-hieu-qua-du-an-020, BR-bao-cao-hieu-qua-du-an-024 · Không có dòng thoả bộ lọc: nút Export XLSX mờ
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-310 → FR-bao-cao-hieu-qua-du-an-020 · Nút Export XLSX mờ: rê chuột hiện tooltip "Không có dòng để xuất"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-311 → E-bao-cao-hieu-qua-du-an-023, BR-bao-cao-hieu-qua-du-an-040 · Số dòng thoả bộ lọc 1.000.001, bấm Export XLSX: hiện "Quá nhiều dòng để xuất ({n}) — vui lòng thu hẹp kỳ hoặc phạm vi."
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-312 → E-bao-cao-hieu-qua-du-an-023, BR-bao-cao-hieu-qua-du-an-040 · Số dòng thoả bộ lọc 1.000.001, bấm Export XLSX: không có file nào được tải về
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-313 → BR-bao-cao-hieu-qua-du-an-040 · Số dòng thoả bộ lọc đúng 1.000.000: Export XLSX tải file đủ 1.000.000 dòng
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-314 → E-bao-cao-hieu-qua-du-an-023 · Đã báo quá nhiều dòng để xuất: P-06 giữ nguyên bảng và bộ lọc
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-315 → E-bao-cao-hieu-qua-du-an-023 · Gõ từ khoá thu hẹp số dòng xuống dưới 1.000.000, bấm Export XLSX: tải file thành công
##5.6. Vai trò & tra soát
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-316 → FR-bao-cao-hieu-qua-du-an-020, BR-bao-cao-hieu-qua-du-an-037 · GĐK bấm Export XLSX: tải được file
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-317 → FR-bao-cao-hieu-qua-du-an-020, BR-bao-cao-hieu-qua-du-an-037 · SM bấm Export XLSX: tải được file
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-318 → FR-bao-cao-hieu-qua-du-an-020, BR-bao-cao-hieu-qua-du-an-037 · Ban lãnh đạo bấm Export XLSX: tải được file
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-319 → BR-bao-cao-hieu-qua-du-an-005, NFR-bao-cao-hieu-qua-du-an-011 · GĐK khối G1 export từ P-06 mức Khối G1: file chỉ có dòng sổ của dự án khối G1
[2] [No] CHK-bao-cao-hieu-qua-du-an-320 → NFR-bao-cao-hieu-qua-du-an-015, FR-bao-cao-hieu-qua-du-an-020 · Mỗi lần Export XLSX được ghi nhận tra soát đủ: người, thời điểm, loại sổ, phạm vi, kỳ, số dòng
#6. Đóng P-06
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-321 → — · Bấm nút ×: P-06 đóng
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-322 → — · Bấm nền tối ngoài popup: P-06 đóng
