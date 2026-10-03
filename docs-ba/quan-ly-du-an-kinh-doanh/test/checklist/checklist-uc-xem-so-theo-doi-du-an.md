#1. Mở màn Danh sách dự án
##1.1. Đầu trang
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-001 → FR-quan-ly-du-an-kinh-doanh-001 · Verify mở menu "Danh sách dự án" hiển thị đủ breadcrumb "Quản trị dự án & Tài chính › Danh sách dự án" và tiêu đề "Sổ theo dõi dự án"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-002 → FR-quan-ly-du-an-kinh-doanh-001, BR-quan-ly-du-an-kinh-doanh-002 · Verify nút "Cấp mã dự án" hiển thị với mỗi vai trò AM, SM, GĐK
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-003 → FR-quan-ly-du-an-kinh-doanh-001, BR-quan-ly-du-an-kinh-doanh-002 · Verify nút "Cấp mã dự án" không hiển thị với tài khoản Kế toán
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-004 → FR-quan-ly-du-an-kinh-doanh-001 · Verify rê chuột vào nút "Cấp mã dự án" với tài khoản GĐK hiện chú thích "GĐK tạo → mã được cấp ngay"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-005 → FR-quan-ly-du-an-kinh-doanh-001 · Verify rê chuột vào nút "Cấp mã dự án" với tài khoản AM / SM hiện chú thích "AM / SM tạo → chờ GĐK duyệt mã"
##1.2. Bộ lọc mặc định
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-006 → FR-quan-ly-du-an-kinh-doanh-005 · Verify bộ lọc Năm mặc định là năm hiện tại khi mở màn
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-007 → FR-quan-ly-du-an-kinh-doanh-005 · Verify ô Năm liệt kê "Tất cả", năm hiện tại, năm của các dự án, năm đã có mục tiêu, sắp tăng dần
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-008 → FR-quan-ly-du-an-kinh-doanh-005 · Verify ô Khối với tài khoản Kế toán gồm "Tất cả" và đủ 6 khối G1, G2, G3, G4, BFSI, GPDV
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-009 → FR-quan-ly-du-an-kinh-doanh-005 · Verify ô Tìm kiếm có placeholder "Tìm mã, tên dự án, khách hàng, PM..."
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-010 → FR-quan-ly-du-an-kinh-doanh-005, BR-quan-ly-du-an-kinh-doanh-001 · Verify ô Trạng thái gồm "Tất cả trạng thái" và đủ 7 trạng thái Chờ duyệt mã, Từ chối mã, Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, Kết thúc, Pending kèm số đếm
[4] [No] CHK-quan-ly-du-an-kinh-doanh-011 → BR-quan-ly-du-an-kinh-doanh-001 · Verify nhãn trạng thái đúng màu: Chờ duyệt mã xám, Từ chối mã đỏ, Chưa có PAKD đỏ nhạt, PAKD chờ duyệt vàng, Đang thực hiện xanh dương, Kết thúc xanh lá, Pending cam
#2. Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký
##2.1. Giá trị và tiêu đề
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-012 → FR-quan-ly-du-an-kinh-doanh-002, BR-quan-ly-du-an-kinh-doanh-018 · Verify số to ở ô ① bằng tổng Giá trị đã ký và Giá trị chưa ký của bảng ② trên các khối đang hiển thị
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-013 → FR-quan-ly-du-an-kinh-doanh-002, BR-quan-ly-du-an-kinh-doanh-018 · Verify khi Khối = Tất cả, số to ở ô ① bằng đúng số của dòng "Toàn công ty" ở bảng ②
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-014 → FR-quan-ly-du-an-kinh-doanh-002 · Verify chọn một năm cụ thể thì tiêu đề ô ① là "Giá trị hợp đồng dự kiến ký năm {năm}"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-015 → FR-quan-ly-du-an-kinh-doanh-002 · Verify chọn Năm = Tất cả thì tiêu đề ô ① là "Giá trị hợp đồng dự kiến ký (tất cả các năm)"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-016 → FR-quan-ly-du-an-kinh-doanh-002 · Verify lọc Khối G1 thì tiêu đề ô ① có thêm " · Khối G1"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-017 → FR-quan-ly-du-an-kinh-doanh-002 · Verify chọn một năm cụ thể thì ô ① hiện dòng "Mục tiêu năm"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-018 → FR-quan-ly-du-an-kinh-doanh-002, BR-quan-ly-du-an-kinh-doanh-021 · Verify chọn Năm = Tất cả thì ô ① hiện dòng "Mục tiêu luỹ kế"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-019 → FR-quan-ly-du-an-kinh-doanh-002 · Verify đổi nội dung ô Tìm kiếm không làm thay đổi số nào ở ô ①
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-020 → FR-quan-ly-du-an-kinh-doanh-002 · Verify đổi bộ lọc Trạng thái không làm thay đổi số nào ở ô ①
##2.2. Mục tiêu, Còn thiếu, Đạt
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-021 → BR-quan-ly-du-an-kinh-doanh-018 · Verify dòng mục tiêu ở ô ① bằng tổng mục tiêu các khối đang hiển thị
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-022 → BR-quan-ly-du-an-kinh-doanh-018 · Verify khi Giá trị nhỏ hơn Mục tiêu, "Còn thiếu" hiện Mục tiêu − Giá trị bằng chữ đỏ
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-023 → BR-quan-ly-du-an-kinh-doanh-018 · Verify khi Giá trị bằng Mục tiêu, "Còn thiếu" hiện "0"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-024 → BR-quan-ly-du-an-kinh-doanh-018 · Verify khi Giá trị lớn hơn Mục tiêu, "Còn thiếu" hiện "Vượt …" chữ xanh
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-025 → BR-quan-ly-du-an-kinh-doanh-018 · Verify khi các khối đang hiển thị chưa có mục tiêu, "Còn thiếu" và "Đạt" cùng hiện "—"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-026 → BR-quan-ly-du-an-kinh-doanh-018 · Verify khi tổng mục tiêu bằng 0, "Còn thiếu" và "Đạt" cùng hiện "—"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-027 → BR-quan-ly-du-an-kinh-doanh-018 · Verify "Đạt" bằng Giá trị chia Mục tiêu, hiển thị phần trăm 1 chữ số thập phân
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-028 → BR-quan-ly-du-an-kinh-doanh-018 · Verify "Đạt" hiện chữ xanh khi tỷ lệ chưa làm tròn từ 100% trở lên
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-029 → BR-quan-ly-du-an-kinh-doanh-018 · Verify tỷ lệ chưa làm tròn 99,96% hiển thị "100,0%" nhưng "Đạt" không chuyển chữ xanh
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-030 → BR-quan-ly-du-an-kinh-doanh-018 · Verify khi các khối đang hiển thị chưa có mục tiêu, ô ① không hiện thanh tiến độ
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-031 → FR-quan-ly-du-an-kinh-doanh-002 · Verify khi có mục tiêu, ô ① hiện thanh tiến độ
#3. Sổ theo dõi — bảng ② Theo khối so với mục tiêu
##3.1. Cấu trúc bảng
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-032 → FR-quan-ly-du-an-kinh-doanh-003 · Verify bảng ② có mỗi khối 1 dòng với đủ cột Khối, So với mục tiêu, Giá trị mục tiêu, Giá trị đã ký, Giá trị chưa ký, Giá trị chờ duyệt PAKD, Giá trị còn thiếu so với mục tiêu, % Đạt
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-033 → FR-quan-ly-du-an-kinh-doanh-003 · Verify dòng "Toàn công ty" hiện khi Khối = Tất cả
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-034 → FR-quan-ly-du-an-kinh-doanh-003 · Verify dòng "Toàn công ty" không hiện khi lọc một khối
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-035 → FR-quan-ly-du-an-kinh-doanh-003 · Verify chọn một năm cụ thể thì tiêu đề bảng ② là "Theo khối so với mục tiêu năm {năm}"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-036 → FR-quan-ly-du-an-kinh-doanh-003 · Verify chọn Năm = Tất cả thì tiêu đề bảng ② là "Theo khối so với mục tiêu (Tất cả)"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-037 → FR-quan-ly-du-an-kinh-doanh-003 · Verify chân khung bảng ② ghi công thức của các cột
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-038 → FR-quan-ly-du-an-kinh-doanh-003 · Verify rê chuột vào thanh "So với mục tiêu" hiện "Đã ký … · Chưa ký … · Mục tiêu …"
[4] [No] CHK-quan-ly-du-an-kinh-doanh-039 → FR-quan-ly-du-an-kinh-doanh-003 · Verify thanh "So với mục tiêu" vẽ phần Đã ký xanh đậm, phần Chưa ký xanh nhạt, vạch đen tại mức mục tiêu
[3] [No] CHK-quan-ly-du-an-kinh-doanh-040 → BR-quan-ly-du-an-kinh-doanh-019 · Verify thang của thanh mỗi dòng bằng giá trị lớn hơn giữa mục tiêu và tổng Đã ký + Chưa ký của dòng đó
##3.2. Cột Giá trị đã ký và Giá trị chưa ký
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-041 → BR-quan-ly-du-an-kinh-doanh-019 · Verify Giá trị đã ký của khối bằng tổng giá trị HĐ ký của các dự án khối có ngày ký trong năm đang lọc, tính cả dự án Kết thúc, Pending
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-042 → BR-quan-ly-du-an-kinh-doanh-019 · Verify dự án tạo năm trước, ký HĐ trong năm đang lọc được cộng vào Giá trị đã ký của năm đang lọc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-043 → BR-quan-ly-du-an-kinh-doanh-019, FR-quan-ly-du-an-kinh-doanh-003 · Verify Giá trị chưa ký bằng tổng Doanh thu dự kiến theo PAKD đã được Kế toán duyệt của các dự án chưa ký dự kiến ký trong năm đang lọc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-044 → BR-quan-ly-du-an-kinh-doanh-019 · Verify dự án chưa ký có PAKD đang chờ Kế toán duyệt không được cộng vào Giá trị chưa ký
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-045 → BR-quan-ly-du-an-kinh-doanh-019 · Verify dự án Kết thúc chưa ký không được cộng vào Giá trị chưa ký
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-046 → BR-quan-ly-du-an-kinh-doanh-019 · Verify dự án Pending chưa ký không được cộng vào Giá trị chưa ký
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-047 → BR-quan-ly-du-an-kinh-doanh-019 · Verify dự án tạo năm trước, dự kiến ký trong năm đang lọc được cộng vào Giá trị chưa ký của năm đang lọc
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-048 → BR-quan-ly-du-an-kinh-doanh-020 · Verify dự án dữ liệu cũ đã ký nhưng chưa nhập HĐ được tính vào Giá trị đã ký theo năm ngày dự kiến ký
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-049 → BR-quan-ly-du-an-kinh-doanh-020 · Verify dự án dữ liệu cũ đã ký, chưa nhập HĐ, không có ngày dự kiến ký được tính vào Giá trị đã ký theo năm ngày bắt đầu
##3.3. Còn thiếu, % Đạt của khối
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-050 → BR-quan-ly-du-an-kinh-doanh-019 · Verify Giá trị còn thiếu của khối bằng mục tiêu trừ Giá trị đã ký trừ Giá trị chưa ký
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-051 → BR-quan-ly-du-an-kinh-doanh-019 · Verify % Đạt của khối bằng (Giá trị đã ký + Giá trị chưa ký) chia mục tiêu
[3] [No] CHK-quan-ly-du-an-kinh-doanh-052 → BR-quan-ly-du-an-kinh-doanh-019 · Verify khối có tỷ lệ chưa làm tròn 99,96% không được đánh dấu là đạt mục tiêu
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-053 → BR-quan-ly-du-an-kinh-doanh-019 · Verify khối chưa có mục tiêu hiện "—" ở cả % Đạt và Giá trị còn thiếu
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-054 → BR-quan-ly-du-an-kinh-doanh-019 · Verify khối có mục tiêu bằng 0 hiện "—" ở cả % Đạt và Giá trị còn thiếu
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-055 → BR-quan-ly-du-an-kinh-doanh-019 · Verify khối chưa có mục tiêu: thanh chỉ vẽ Đã ký, Chưa ký, không có vạch mục tiêu
##3.4. Năm = Tất cả
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-056 → BR-quan-ly-du-an-kinh-doanh-021 · Verify Năm = Tất cả: Giá trị mục tiêu mỗi khối bằng tổng mục tiêu mọi năm của khối đó
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-057 → BR-quan-ly-du-an-kinh-doanh-021 · Verify Năm = Tất cả: Giá trị đã ký và Giá trị chưa ký tính dự án của mọi năm
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-058 → BR-quan-ly-du-an-kinh-doanh-021 · Verify Năm = Tất cả: Giá trị chờ duyệt PAKD tính dự án của mọi năm
#4. Sổ theo dõi — cột Giá trị chờ duyệt PAKD
##4.1. Phạm vi cộng
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-059 → FR-quan-ly-du-an-kinh-doanh-046 · Verify cột Chờ duyệt PAKD bằng tổng doanh thu đề xuất của bản PAKD lần đầu đang chờ Kế toán duyệt của các dự án chưa ký thuộc khối có ngày dự kiến ký theo bản đang chờ trong năm đang lọc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-060 → FR-quan-ly-du-an-kinh-doanh-046 · Verify bản PAKD làm lại sau khi bị từ chối đang chờ duyệt được cộng vào cột Chờ duyệt PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-061 → FR-quan-ly-du-an-kinh-doanh-046 · Verify bản điều chỉnh PAKD đang chờ duyệt của dự án Đang thực hiện không được cộng vào cột Chờ duyệt PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-062 → FR-quan-ly-du-an-kinh-doanh-046 · Verify dự án Pending có bản PAKD đang chờ không được cộng vào cột Chờ duyệt PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-063 → FR-quan-ly-du-an-kinh-doanh-046 · Verify dự án đã ký HĐ có bản PAKD đang chờ không được cộng vào cột Chờ duyệt PAKD
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-064 → FR-quan-ly-du-an-kinh-doanh-046, BR-quan-ly-du-an-kinh-doanh-015 · Verify dự án tạo năm X có bản PAKD chờ duyệt dự kiến ký năm X+1 được cộng vào cột Chờ duyệt PAKD khi lọc Năm X+1
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-065 → FR-quan-ly-du-an-kinh-doanh-046 · Verify dòng "Toàn công ty" cộng cột Chờ duyệt PAKD của các khối
##4.2. Chỉ để tham khảo
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-066 → BR-quan-ly-du-an-kinh-doanh-045, FR-quan-ly-du-an-kinh-doanh-046 · Verify thêm một bản PAKD chờ duyệt không làm thay đổi % Đạt của khối
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-067 → BR-quan-ly-du-an-kinh-doanh-045, FR-quan-ly-du-an-kinh-doanh-046 · Verify thêm một bản PAKD chờ duyệt không làm thay đổi Giá trị còn thiếu của khối
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-068 → BR-quan-ly-du-an-kinh-doanh-045, FR-quan-ly-du-an-kinh-doanh-046 · Verify thêm một bản PAKD chờ duyệt không làm thay đổi số to ở ô ①
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-069 → BR-quan-ly-du-an-kinh-doanh-045, FR-quan-ly-du-an-kinh-doanh-046 · Verify thanh "So với mục tiêu" không vẽ phần giá trị chờ duyệt PAKD
#5. Lọc danh sách dự án
##5.1. Năm
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-070 → BR-quan-ly-du-an-kinh-doanh-015, FR-quan-ly-du-an-kinh-doanh-005 · Verify lọc một năm hiển thị dự án đã ký có năm ngày ký HĐ bằng năm chọn
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-071 → BR-quan-ly-du-an-kinh-doanh-015 · Verify dự án chưa ký có ngày dự kiến ký được xếp theo năm dự kiến ký khi lọc Năm
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-072 → BR-quan-ly-du-an-kinh-doanh-015 · Verify dự án chưa có ngày ký, chưa có ngày dự kiến ký được xếp theo năm tạo khi lọc Năm
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-073 → BR-quan-ly-du-an-kinh-doanh-015 · Verify dự án tạo năm X đang có PAKD lần đầu chờ duyệt dự kiến ký năm X+1 hiện trong danh sách khi lọc Năm X
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-074 → BR-quan-ly-du-an-kinh-doanh-020 · Verify dự án dữ liệu cũ đã ký chưa nhập HĐ hiện trong danh sách khi lọc theo năm ngày dự kiến ký
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-075 → FR-quan-ly-du-an-kinh-doanh-005 · Verify Năm = Tất cả hiển thị dự án của mọi năm trong phạm vi khối của tài khoản
##5.2. Khối
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-076 → FR-quan-ly-du-an-kinh-doanh-005 · Verify Kế toán lọc Khối G1 thì danh sách chỉ còn dự án khối G1
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-077 → FR-quan-ly-du-an-kinh-doanh-005, BR-quan-ly-du-an-kinh-doanh-053 · Verify ô Khối của bộ lọc với mỗi vai trò GĐK, SM, AM chỉ có khối của tài khoản
##5.3. Tìm kiếm
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-078 → BR-quan-ly-du-an-kinh-doanh-016, FR-quan-ly-du-an-kinh-doanh-005 · Verify tìm kiếm một chuỗi con khớp lần lượt trên mỗi trường Mã dự án, Tên dự án, Mã KH, Tên KH, PM KD, PM SX ra đúng dự án chứa chuỗi đó
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-079 → BR-quan-ly-du-an-kinh-doanh-016 · Verify chuỗi tìm kiếm có khoảng trắng đầu cuối cho kết quả giống chuỗi đã bỏ khoảng trắng
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-080 → BR-quan-ly-du-an-kinh-doanh-016 · Verify tìm kiếm không phân biệt hoa thường: gõ "abc" ra dự án tên "ABC"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-081 → BR-quan-ly-du-an-kinh-doanh-016 · Verify gõ "ha noi" ra dự án có tên chứa "Hà Nội"
##5.4. Trạng thái và số đếm
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-082 → FR-quan-ly-du-an-kinh-doanh-005 · Verify chọn trạng thái "Chờ duyệt mã" thì danh sách chỉ còn dự án Chờ duyệt mã
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-083 → BR-quan-ly-du-an-kinh-doanh-017 · Verify số đếm cạnh mỗi trạng thái bằng số dự án thoả Năm, Khối, Tìm kiếm đang chọn
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-084 → BR-quan-ly-du-an-kinh-doanh-017 · Verify chọn một trạng thái không làm thay đổi số đếm cạnh các trạng thái khác
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-085 → FR-quan-ly-du-an-kinh-doanh-005 · Verify tổ hợp đủ 4 bộ lọc Năm, Khối, Tìm kiếm, Trạng thái ra đúng các dòng thoả cả 4 điều kiện
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-086 → BR-quan-ly-du-an-kinh-doanh-043, FR-quan-ly-du-an-kinh-doanh-005 · Verify dự án đã xoá không xuất hiện trong danh sách với Năm = Tất cả, Trạng thái = Tất cả trạng thái
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-087 → BR-quan-ly-du-an-kinh-doanh-043 · Verify dự án đã xoá không được tính vào số đếm trạng thái
##5.5. Không có kết quả
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-088 → E-quan-ly-du-an-kinh-doanh-022 · Verify bộ lọc không ra dòng nào thì bảng hiện 1 dòng "Không có dự án phù hợp."
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-089 → E-quan-ly-du-an-kinh-doanh-022 · Verify bộ lọc không ra dòng nào thì dòng tổng bị ẩn
#6. Bảng danh sách dự án
##6.1. Cột và giá trị
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-090 → FR-quan-ly-du-an-kinh-doanh-006 · Verify bảng hiển thị đủ 14 cột TT, Mã dự án, Tên dự án, Tên khách hàng, Khối, Loại dự án, Thời điểm dự kiến ký HĐ, Giá trị hợp đồng dự kiến, PM Kinh doanh, PM sản xuất, Trạng thái, Hạn lập PAKD, Phiên bản PAKD, Thao tác với tài khoản Kế toán
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-091 → FR-quan-ly-du-an-kinh-doanh-006 · Verify nhóm "Thông tin hợp đồng đã ký" có đủ 6 cột Giá trị hợp đồng ký, Số hợp đồng, Ngày ký, Ngày hết hạn, Tệp, Trạng thái
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-092 → FR-quan-ly-du-an-kinh-doanh-006 · Verify dự án chưa có mã hiện "Chờ cấp mã" ở cột Mã dự án
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-093 → FR-quan-ly-du-an-kinh-doanh-006 · Verify dự án trọng điểm hiện nhãn ⭐KEY cạnh Tên dự án
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-094 → FR-quan-ly-du-an-kinh-doanh-006 · Verify cột "Giá trị hợp đồng dự kiến" bằng Doanh thu dự kiến theo PAKD đã được Kế toán duyệt
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-095 → FR-quan-ly-du-an-kinh-doanh-006 · Verify dự án chưa có PAKD được duyệt hiện "—" ở cột "Giá trị hợp đồng dự kiến"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-096 → FR-quan-ly-du-an-kinh-doanh-006 · Verify cột "Thời điểm dự kiến ký HĐ" lấy theo PAKD đã được Kế toán duyệt
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-097 → FR-quan-ly-du-an-kinh-doanh-006 · Verify dự án chưa có PAKD được duyệt hiện "—" ở cột "Thời điểm dự kiến ký HĐ"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-098 → FR-quan-ly-du-an-kinh-doanh-006 · Verify dòng "Tổng cộng (n dự án)" có Σ Giá trị HĐ dự kiến bằng tổng các dòng đang lọc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-099 → FR-quan-ly-du-an-kinh-doanh-006 · Verify dòng tổng có Σ Giá trị HĐ ký bằng tổng các dòng đang lọc
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-100 → FR-quan-ly-du-an-kinh-doanh-006 · Verify chân khung hiện "{n} / {N} dự án · Đang xem với vai trò {vai trò} · Bấm vào dòng để xem chi tiết, bấm "Đã ký / Chưa ký" để cập nhật hợp đồng"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-101 → FR-quan-ly-du-an-kinh-doanh-006 · Verify bảng danh sách cuộn ngang được để xem hết các cột
##6.2. Cột Hạn lập PAKD
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-102 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã hiện "—" ở cột Hạn lập PAKD
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-103 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án Pending hiện "Pending" kèm ngày đóng ở cột Hạn lập PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-104 → BR-quan-ly-du-an-kinh-doanh-024, FR-quan-ly-du-an-kinh-doanh-007 · Verify dự án Chưa có PAKD còn hạn 10 ngày hiện "Còn 10 ngày"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-105 → BR-quan-ly-du-an-kinh-doanh-024 · Verify "Còn 3 ngày" hiện màu cam
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-106 → BR-quan-ly-du-an-kinh-doanh-024 · Verify "Còn 4 ngày" không hiện màu cam
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-107 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án Chưa có PAKD đúng ngày hạn hiện "Hết hạn hôm nay"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-108 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án Chưa có PAKD quá hạn 2 ngày (tác vụ chuyển Pending chưa chạy) hiện "Quá hạn 2 ngày" chữ đỏ
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-109 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án Chưa có PAKD không có hạn (dữ liệu cũ) hiện "Chưa đặt hạn"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-110 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án Chưa có PAKD có bản mới nhất bị từ chối hiện dòng chính đếm ngày theo hạn gốc
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-111 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án Chưa có PAKD có bản mới nhất bị từ chối hiện dòng phụ "V{n} bị từ chối dd/mm/yyyy"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-112 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án có bản PAKD mới nhất đang chờ Kế toán hiện "Nộp V{n}" kèm ngày nộp
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-113 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án có bản PAKD mới nhất đã duyệt hiện "Duyệt" kèm ngày duyệt
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-114 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án có bản điều chỉnh PAKD bị từ chối chưa huỷ hiện "Điều chỉnh bị từ chối dd/mm/yyyy" với ngày từ chối
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-115 → BR-quan-ly-du-an-kinh-doanh-024 · Verify sau khi huỷ bản điều chỉnh bị từ chối, cột hiện "Duyệt" kèm ngày duyệt của bản PAKD đang áp dụng
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-116 → BR-quan-ly-du-an-kinh-doanh-024 · Verify dự án ở trạng thái khác Chờ duyệt mã, Từ chối mã, Chưa có PAKD, Pending mà không có bản PAKD nào (dữ liệu cũ) hiện "—"
##6.3. Cột Phiên bản PAKD
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-117 → BR-quan-ly-du-an-kinh-doanh-025, FR-quan-ly-du-an-kinh-doanh-007 · Verify bản PAKD mới nhất V1 đang chờ hiện "V1, chờ CFO"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-118 → BR-quan-ly-du-an-kinh-doanh-025 · Verify bản PAKD mới nhất V1 đã duyệt hiện "V1, đã duyệt"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-119 → BR-quan-ly-du-an-kinh-doanh-025, FR-quan-ly-du-an-kinh-doanh-007 · Verify bản PAKD mới nhất V2 bị từ chối hiện "V2, từ chối" chữ đỏ
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-120 → BR-quan-ly-du-an-kinh-doanh-025 · Verify sau khi huỷ bản điều chỉnh bị từ chối, cột Phiên bản PAKD hiện bản đang áp dụng
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-121 → BR-quan-ly-du-an-kinh-doanh-025 · Verify dự án chưa có bản PAKD nào hiện "—" ở cột Phiên bản PAKD
##6.4. Thông tin hợp đồng đã ký
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-122 → BR-quan-ly-du-an-kinh-doanh-040 · Verify dự án chưa ký hiện "—" chữ xám ở cột Giá trị hợp đồng ký
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-123 → BR-quan-ly-du-an-kinh-doanh-020, BR-quan-ly-du-an-kinh-doanh-040 · Verify dự án đã ký có HĐ hiện giá trị HĐ ở cột Giá trị hợp đồng ký
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-124 → BR-quan-ly-du-an-kinh-doanh-020 · Verify dự án dữ liệu cũ đã ký chưa nhập HĐ hiện Doanh thu dự kiến ở cột Giá trị hợp đồng ký với tài khoản SM
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-125 → BR-quan-ly-du-an-kinh-doanh-020 · Verify cột Ngày ký hiện ngày ký trên HĐ
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-126 → BR-quan-ly-du-an-kinh-doanh-020 · Verify dự án dữ liệu cũ đã ký chưa nhập HĐ hiện ngày dự kiến ký ở cột Ngày ký
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-127 → BR-quan-ly-du-an-kinh-doanh-020 · Verify cột Ngày hết hạn hiện ngày "Đến" của HĐ
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-128 → BR-quan-ly-du-an-kinh-doanh-020 · Verify dự án dữ liệu cũ đã ký chưa nhập HĐ hiện ngày kết thúc dự án ở cột Ngày hết hạn
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-129 → BR-quan-ly-du-an-kinh-doanh-040 · Verify dự án dữ liệu cũ đã ký nhưng thiếu dữ liệu HĐ hiện "—" ở các cột Số HĐ, Ngày ký, Ngày hết hạn
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-130 → BR-quan-ly-du-an-kinh-doanh-040 · Verify dự án chưa ký, chưa có dữ liệu HĐ để trống các cột Số HĐ, Ngày ký, Ngày hết hạn
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-131 → BR-quan-ly-du-an-kinh-doanh-040 · Verify HĐ không có tệp hiện "—" ở cột Tệp
##6.5. Cảnh báo quá tháng dự kiến ký
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-132 → FR-quan-ly-du-an-kinh-doanh-006 · Verify dự án đã qua tháng dự kiến ký mà chưa có HĐ hiện dòng chữ đỏ "Quá tháng dự kiến ký MM/YYYY" dưới Tên dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-133 → FR-quan-ly-du-an-kinh-doanh-006, BR-quan-ly-du-an-kinh-doanh-046 · Verify tài khoản AM cũng thấy dòng "Quá tháng dự kiến ký MM/YYYY", không kèm số tiền
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-134 → FR-quan-ly-du-an-kinh-doanh-006 · Verify sau khi lưu HĐ ở P-03, dòng "Quá tháng dự kiến ký MM/YYYY" của dự án không còn hiện
##6.6. Link Thao tác
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-135 → BR-quan-ly-du-an-kinh-doanh-023, FR-quan-ly-du-an-kinh-doanh-008 · Verify dự án Chờ duyệt mã hiện link "Duyệt mã" với GĐK của khối
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-136 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Chờ duyệt mã hiện link "Xem" với mỗi vai trò AM, SM, Kế toán
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-137 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Từ chối mã hiện link "Gửi lại" với người tạo dự án
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-138 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Từ chối mã hiện link "Gửi lại" với SM của dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-139 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Từ chối mã hiện link "Xem" với GĐK, Kế toán, AM không phải người tạo
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-140 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Chưa có PAKD hiện link "Lập PAKD" với mỗi vai trò SM, GĐK
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-141 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Chưa có PAKD hiện link "Xem" với mỗi vai trò AM, Kế toán
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-142 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án PAKD chờ duyệt hiện link "Duyệt" với Kế toán
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-143 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án PAKD chờ duyệt hiện link "Xem" với mỗi vai trò AM, SM, GĐK
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-144 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Đang thực hiện có bản mới nhất là bản điều chỉnh chờ duyệt hiện link "Duyệt điều chỉnh" với Kế toán
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-145 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Đang thực hiện không có bản điều chỉnh chờ duyệt hiện link "Cập nhật"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-146 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Pending hiện link "Mở lại" với Kế toán
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-147 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Pending hiện link "Xem" với mỗi vai trò AM, SM, GĐK
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-148 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Kết thúc hiện link "Mở lại" với Kế toán
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-149 → BR-quan-ly-du-an-kinh-doanh-023 · Verify dự án Kết thúc không có link Thao tác với mỗi vai trò AM, SM, GĐK
[4] [Yes] CHK-quan-ly-du-an-kinh-doanh-150 → FR-quan-ly-du-an-kinh-doanh-008 · Verify link "Duyệt", "Duyệt điều chỉnh" hiển thị chữ đỏ đậm
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-151 → FR-quan-ly-du-an-kinh-doanh-008 · Verify Kế toán bấm link "Duyệt" mở popup duyệt PAKD ngay trên danh sách
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-152 → FR-quan-ly-du-an-kinh-doanh-008 · Verify Kế toán bấm link "Duyệt điều chỉnh" mở popup duyệt PAKD ngay trên danh sách
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-153 → FR-quan-ly-du-an-kinh-doanh-008 · Verify bấm link "Xem" mở màn chi tiết dự án
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-154 → BR-quan-ly-du-an-kinh-doanh-023 · Verify bấm link "Gửi lại" không tự gửi lại yêu cầu: dự án vẫn ở "Từ chối mã" khi màn chi tiết mở ra
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-155 → BR-quan-ly-du-an-kinh-doanh-023, FR-quan-ly-du-an-kinh-doanh-037 · Verify Kế toán bấm link "Mở lại" không tự mở lại dự án: trạng thái giữ nguyên khi màn chi tiết mở ra
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-156 → FR-quan-ly-du-an-kinh-doanh-008 · Verify bấm link "Duyệt" chỉ mở popup duyệt, màn vẫn ở danh sách (không kích hoạt bấm dòng)
##6.7. Mở chi tiết
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-157 → FR-quan-ly-du-an-kinh-doanh-006 · Verify bấm vào một dòng mở màn chi tiết dự án của dòng đó
#7. Mở P-03 từ danh sách
##7.1. Ô Tệp và link Đã ký / Chưa ký
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-158 → FR-quan-ly-du-an-kinh-doanh-010 · Verify rê chuột vào ô "📎 {n} tệp" hiện tên các tệp HĐ
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-159 → FR-quan-ly-du-an-kinh-doanh-010 · Verify bấm ô "📎 {n} tệp" mở popup Cập nhật ký hợp đồng của dự án đó
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-160 → FR-quan-ly-du-an-kinh-doanh-010 · Verify bấm ô Tệp đang hiện "—" không mở popup nào
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-161 → FR-quan-ly-du-an-kinh-doanh-010 · Verify mỗi vai trò SM, GĐK, Kế toán bấm link "Chưa ký" của dự án đã có mã khác Kết thúc mở P-03 ở chế độ cập nhật
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-162 → FR-quan-ly-du-an-kinh-doanh-010 · Verify AM bấm link "Đã ký" mở P-03 ở chế độ chỉ xem
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-163 → FR-quan-ly-du-an-kinh-doanh-010 · Verify Kế toán bấm link "Đã ký" của dự án Kết thúc mở P-03 ở chế độ chỉ xem
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-164 → FR-quan-ly-du-an-kinh-doanh-010 · Verify SM bấm link "Chưa ký" của dự án Pending mở P-03 ở chế độ cập nhật
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-165 → FR-quan-ly-du-an-kinh-doanh-010, BR-quan-ly-du-an-kinh-doanh-049 · Verify GĐK bấm link "Chưa ký" của dự án Chờ duyệt mã mở P-03 ở chế độ chỉ xem
#8. Xuất Excel
##8.1. Tệp xuất
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-166 → FR-quan-ly-du-an-kinh-doanh-009, NFR-quan-ly-du-an-kinh-doanh-006 · Verify bấm "Xuất Excel" tải về tệp "du-an-kinh-doanh.xlsx"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-167 → FR-quan-ly-du-an-kinh-doanh-009, NFR-quan-ly-du-an-kinh-doanh-006 · Verify tệp xuất có đúng 1 sheet tên "DuAn"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-168 → FR-quan-ly-du-an-kinh-doanh-009 · Verify tệp xuất chỉ chứa các dòng đang lọc theo cả 4 bộ lọc
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-169 → FR-quan-ly-du-an-kinh-doanh-009 · Verify cột trong tệp gồm các cột danh sách đang xem bỏ cột "Thao tác", thêm 6 cột hợp đồng, có 2 cột cùng tên "Trạng thái"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-170 → FR-quan-ly-du-an-kinh-doanh-009 · Verify cột Giá trị HĐ dự kiến trong tệp ở dạng số
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-171 → FR-quan-ly-du-an-kinh-doanh-009 · Verify cột Hạn lập PAKD trong tệp ghi "dòng chính + dòng phụ"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-172 → FR-quan-ly-du-an-kinh-doanh-009 · Verify cột Tệp trong tệp ghi "{n} tệp"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-173 → FR-quan-ly-du-an-kinh-doanh-009, FR-quan-ly-du-an-kinh-doanh-047, BR-quan-ly-du-an-kinh-doanh-046, NFR-quan-ly-du-an-kinh-doanh-010 · Verify tệp xuất của AM không có 3 cột Hạn lập PAKD, Phiên bản PAKD, Giá trị hợp đồng dự kiến
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-174 → FR-quan-ly-du-an-kinh-doanh-009, BR-quan-ly-du-an-kinh-doanh-053, NFR-quan-ly-du-an-kinh-doanh-010 · Verify tệp xuất của SM chỉ có dự án thuộc khối của tài khoản
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-175 → BR-quan-ly-du-an-kinh-doanh-043 · Verify tệp xuất không chứa dự án đã xoá
##8.2. Không có dòng để xuất
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-176 → FR-quan-ly-du-an-kinh-doanh-009, BR-quan-ly-du-an-kinh-doanh-016 · Verify bộ lọc ra 0 dòng thì nút "Xuất Excel" mờ, không bấm được
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-177 → BR-quan-ly-du-an-kinh-doanh-016 · Verify bộ lọc ra 0 dòng, rê chuột vào nút "Xuất Excel" hiện "Không có dòng để xuất"
##8.3. Ghi nhận tra soát
[2] [No] CHK-quan-ly-du-an-kinh-doanh-178 → FR-quan-ly-du-an-kinh-doanh-009, NFR-quan-ly-du-an-kinh-doanh-016 · Verify mỗi lần xuất được ghi nhận tra soát đủ người, thời điểm, bộ lọc Năm / Khối / Tìm kiếm / Trạng thái, số dòng
#9. Phạm vi hiển thị theo vai trò AM
##9.1. Sổ theo dõi và cột PAKD
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-179 → FR-quan-ly-du-an-kinh-doanh-047, BR-quan-ly-du-an-kinh-doanh-046, NFR-quan-ly-du-an-kinh-doanh-010 · Verify tài khoản AM không thấy Sổ theo dõi (ô ①, bảng ②, nút Đặt mục tiêu), chỉ thấy khung "Danh sách dự án"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-180 → FR-quan-ly-du-an-kinh-doanh-047, BR-quan-ly-du-an-kinh-doanh-046 · Verify tài khoản AM không thấy 3 cột Hạn lập PAKD, Phiên bản PAKD, Giá trị hợp đồng dự kiến
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-181 → FR-quan-ly-du-an-kinh-doanh-047, BR-quan-ly-du-an-kinh-doanh-046 · Verify tài khoản AM không thấy ô Σ Giá trị HĐ dự kiến ở dòng tổng
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-182 → BR-quan-ly-du-an-kinh-doanh-020, BR-quan-ly-du-an-kinh-doanh-046 · Verify với dự án dữ liệu cũ đã ký chưa nhập HĐ, tài khoản AM thấy "—" ở cột Giá trị hợp đồng ký
#10. Phạm vi dữ liệu theo khối
##10.1. Danh sách theo khối của tài khoản
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-183 → BR-quan-ly-du-an-kinh-doanh-053, NFR-quan-ly-du-an-kinh-doanh-010, FR-quan-ly-du-an-kinh-doanh-005 · Verify mỗi vai trò GĐK, SM, AM chỉ thấy dự án thuộc khối của tài khoản trong danh sách
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-184 → BR-quan-ly-du-an-kinh-doanh-053 · Verify số đếm trạng thái của SM chỉ tính dự án thuộc khối của tài khoản
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-185 → BR-quan-ly-du-an-kinh-doanh-053 · Verify dòng tổng của GĐK chỉ cộng dự án thuộc khối của tài khoản
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-186 → BR-quan-ly-du-an-kinh-doanh-053 · Verify Sổ theo dõi của mỗi vai trò SM, GĐK chỉ có dòng khối của tài khoản ở bảng ②
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-187 → BR-quan-ly-du-an-kinh-doanh-053, FR-quan-ly-du-an-kinh-doanh-005 · Verify tài khoản Kế toán thấy dự án của mọi khối
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-188 → BR-quan-ly-du-an-kinh-doanh-053 · Verify tài khoản GĐK chưa được gắn khối thấy "Tài khoản chưa được gắn khối — liên hệ quản trị" thay cho danh sách
##10.2. Mở dự án khối khác
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-189 → BR-quan-ly-du-an-kinh-doanh-053, E-quan-ly-du-an-kinh-doanh-030 · Verify SM mở trực tiếp đường dẫn chi tiết dự án khối khác bị từ chối, báo "Bạn không có quyền thực hiện thao tác này."
[2] [No] CHK-quan-ly-du-an-kinh-doanh-190 → NFR-quan-ly-du-an-kinh-doanh-016, E-quan-ly-du-an-kinh-doanh-030, BR-quan-ly-du-an-kinh-doanh-053 · Verify lần mở dự án khối khác bị từ chối được ghi nhận tra soát đủ người, thời điểm, dự án, thao tác
