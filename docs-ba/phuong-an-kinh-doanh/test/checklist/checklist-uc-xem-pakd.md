#1. Mở màn chi tiết — quyền xem khung PAKD
##1.1. Vai trò được xem
[1] [Yes] CHK-phuong-an-kinh-doanh-001 → FR-phuong-an-kinh-doanh-001, BR-phuong-an-kinh-doanh-001 · Verify SM mở chi tiết dự án thuộc khối mình (trạng thái khác "Chờ duyệt mã") thấy khung PAKD trong tab "Thông tin dự án"
[1] [Yes] CHK-phuong-an-kinh-doanh-002 → FR-phuong-an-kinh-doanh-001, BR-phuong-an-kinh-doanh-001 · Verify GĐK mở chi tiết dự án thuộc khối mình thấy khung PAKD trong tab "Thông tin dự án"
[1] [Yes] CHK-phuong-an-kinh-doanh-003 → FR-phuong-an-kinh-doanh-001, BR-phuong-an-kinh-doanh-001 · Verify Kế toán (CFO) mở chi tiết dự án của một khối bất kỳ thấy khung PAKD
[2] [Yes] CHK-phuong-an-kinh-doanh-004 → FR-phuong-an-kinh-doanh-001 · Verify dòng meta đầu trang có mục "PAKD" khi SM xem dự án khối mình
[2] [Yes] CHK-phuong-an-kinh-doanh-005 → FR-phuong-an-kinh-doanh-001 · Verify khung PAKD vẫn hiển thị khi SM đang ở chế độ sửa thông tin cơ bản của dự án

##1.2. Vai trò bị chặn
[1] [Yes] CHK-phuong-an-kinh-doanh-006 → FR-phuong-an-kinh-doanh-001, NFR-phuong-an-kinh-doanh-007 · Verify AM mở chi tiết dự án thấy khung "Phương án kinh doanh (PAKD)" chỉ có dòng 🔒 "PAKD của dự án chỉ hiển thị với Giám đốc kinh doanh (SM), Giám đốc khối và Kế toán duyệt."
[1] [Yes] CHK-phuong-an-kinh-doanh-007 → FR-phuong-an-kinh-doanh-001, NFR-phuong-an-kinh-doanh-007 · Verify AM mở chi tiết dự án thì dòng meta đầu trang không có mục "PAKD"
[1] [Yes] CHK-phuong-an-kinh-doanh-008 → FR-phuong-an-kinh-doanh-001, BR-phuong-an-kinh-doanh-001, E-phuong-an-kinh-doanh-018 · Verify SM mở dự án thuộc khối khác bằng đường dẫn trực tiếp bị từ chối với câu "Bạn không có quyền thực hiện thao tác này."
[2] [Yes] CHK-phuong-an-kinh-doanh-009 → FR-phuong-an-kinh-doanh-001, BR-phuong-an-kinh-doanh-001 · Verify GĐK mở dự án thuộc khối khác bằng đường dẫn trực tiếp bị từ chối với câu "Bạn không có quyền thực hiện thao tác này."
[1] [Yes] CHK-phuong-an-kinh-doanh-010 → BR-phuong-an-kinh-doanh-001 · Verify SM khối A xem danh sách dự án không thấy dự án thuộc khối B
[2] [Yes] CHK-phuong-an-kinh-doanh-011 → FR-phuong-an-kinh-doanh-001 · Verify dự án trạng thái "Chờ duyệt mã" không hiển thị khung PAKD trên màn chi tiết
[3] [Yes] CHK-phuong-an-kinh-doanh-012 → FR-phuong-an-kinh-doanh-001 · Verify khi chuyển sang tab "Lịch sử" của màn chi tiết thì khung PAKD không hiển thị

#2. Nạp nội dung khung
##2.1. Thứ tự nguồn nội dung
[1] [Yes] CHK-phuong-an-kinh-doanh-013 → FR-phuong-an-kinh-doanh-002 · Verify dự án "Đang thực hiện" có bản điều chỉnh nháp thì khung hiển thị nội dung bản điều chỉnh thay vì PAKD đang áp dụng
[1] [Yes] CHK-phuong-an-kinh-doanh-014 → FR-phuong-an-kinh-doanh-002 · Verify dự án "Chưa có PAKD" đã Lưu nháp PAKD thì mở lại màn chi tiết khung hiển thị đúng nội dung đã lưu
[1] [Yes] CHK-phuong-an-kinh-doanh-015 → FR-phuong-an-kinh-doanh-002 · Verify dự án chưa từng lưu PAKD thì khung hiển thị form trống mặc định

##2.2. Nạp lại khi dữ liệu dự án đổi
[2] [Yes] CHK-phuong-an-kinh-doanh-016 → FR-phuong-an-kinh-doanh-003 · Verify đang nhập dở khung PAKD của dự án A, chuyển sang dự án B thì khung hiển thị nội dung PAKD của dự án B
[2] [Yes] CHK-phuong-an-kinh-doanh-017 → FR-phuong-an-kinh-doanh-003 · Verify quay lại dự án A sau khi chuyển dự án thì phần đang sửa chưa lưu của dự án A không còn
[1] [No] CHK-phuong-an-kinh-doanh-018 → FR-phuong-an-kinh-doanh-003, E-phuong-an-kinh-doanh-024 · Verify SM đang mở khung dự án, người khác lưu P-03 thì khung của SM tự nạp lại theo dữ liệu mới, phần đang sửa chưa lưu bị bỏ
[2] [No] CHK-phuong-an-kinh-doanh-019 → FR-phuong-an-kinh-doanh-003, E-phuong-an-kinh-doanh-024 · Verify khung tự nạp lại do người khác thay đổi dự án thì hiện thông báo "Dữ liệu dự án vừa thay đổi — khung PAKD đã được tải lại."
[2] [No] CHK-phuong-an-kinh-doanh-020 → FR-phuong-an-kinh-doanh-003 · Verify SM đang mở khung dự án "Chưa có PAKD", GĐK cùng khối Lưu nháp PAKD thì khung của SM tự nạp lại theo nội dung GĐK vừa lưu
[3] [No] CHK-phuong-an-kinh-doanh-021 → FR-phuong-an-kinh-doanh-003 · Verify SM đang mở khung dự án "PAKD chờ duyệt", Kế toán Duyệt PAKD thì khung của SM tự nạp lại với nhãn "Đã duyệt"
[2] [Yes] CHK-phuong-an-kinh-doanh-022 → FR-phuong-an-kinh-doanh-003, E-phuong-an-kinh-doanh-024 · Verify SM tự bấm Lưu nháp thì không hiện thông báo "Dữ liệu dự án vừa thay đổi — khung PAKD đã được tải lại."

#3. Hàng thông tin đầu khung
##3.1. Người lập · Hạn lập PAKD
[2] [Yes] CHK-phuong-an-kinh-doanh-023 → FR-phuong-an-kinh-doanh-004 · Verify ô "Người lập" hiển thị người lưu PAKD gần nhất của dự án "Chưa có PAKD"
[2] [Yes] CHK-phuong-an-kinh-doanh-024 → FR-phuong-an-kinh-doanh-004 · Verify khi dự án có bản điều chỉnh nháp thì ô "Người lập" hiển thị người lưu bản điều chỉnh
[4] [Yes] CHK-phuong-an-kinh-doanh-025 → FR-phuong-an-kinh-doanh-004 · Verify PAKD chưa có người lưu nhưng đã có phiên bản thì ô "Người lập" hiển thị người nộp phiên bản mới nhất
[3] [Yes] CHK-phuong-an-kinh-doanh-026 → FR-phuong-an-kinh-doanh-004 · Verify dự án chưa có lần lưu PAKD nào và chưa có phiên bản thì ô "Người lập" hiển thị tài khoản đang đăng nhập
[2] [Yes] CHK-phuong-an-kinh-doanh-027 → FR-phuong-an-kinh-doanh-004 · Verify ô "Hạn lập PAKD" hiển thị dạng dd/mm/yyyy cho dự án đã được đặt hạn
[3] [Yes] CHK-phuong-an-kinh-doanh-028 → FR-phuong-an-kinh-doanh-004 · Verify dự án chưa có hạn lập thì ô "Hạn lập PAKD" hiển thị "—"

##3.2. Thời gian còn lại
[2] [Yes] CHK-phuong-an-kinh-doanh-029 → FR-phuong-an-kinh-doanh-004, BR-phuong-an-kinh-doanh-005 · Verify Hạn lập PAKD sau hôm nay 5 ngày thì "Thời gian còn lại" hiển thị "Còn 5 ngày"
[2] [Yes] CHK-phuong-an-kinh-doanh-030 → BR-phuong-an-kinh-doanh-005 · Verify Hạn lập PAKD đúng hôm nay thì "Thời gian còn lại" hiển thị "Hết hạn hôm nay"
[2] [Yes] CHK-phuong-an-kinh-doanh-031 → BR-phuong-an-kinh-doanh-005 · Verify Hạn lập PAKD trước hôm nay 2 ngày thì "Thời gian còn lại" hiển thị "Quá hạn 2 ngày"
[3] [Yes] CHK-phuong-an-kinh-doanh-032 → BR-phuong-an-kinh-doanh-005 · Verify dự án không có Hạn lập PAKD thì "Thời gian còn lại" hiển thị "—"
[2] [Yes] CHK-phuong-an-kinh-doanh-033 → BR-phuong-an-kinh-doanh-005 · Verify phiên bản mới nhất "Chờ CFO" thì "Thời gian còn lại" hiển thị "Đã nộp"
[2] [Yes] CHK-phuong-an-kinh-doanh-034 → BR-phuong-an-kinh-doanh-005 · Verify dự án đã có phiên bản "Đã duyệt" thì "Thời gian còn lại" hiển thị "Đã nộp"
[1] [Yes] CHK-phuong-an-kinh-doanh-035 → BR-phuong-an-kinh-doanh-005 · Verify dự án bị Kế toán từ chối PAKD lần đầu thì "Thời gian còn lại" đếm tiếp theo hạn gốc ("Còn n ngày"), không hiển thị "Đã nộp"
[3] [No] CHK-phuong-an-kinh-doanh-036 → BR-phuong-an-kinh-doanh-005 · Verify còn 3 ngày tới hạn và chưa nộp thì "Thời gian còn lại" hiển thị chữ đỏ
[3] [No] CHK-phuong-an-kinh-doanh-037 → BR-phuong-an-kinh-doanh-005 · Verify còn 4 ngày tới hạn thì "Thời gian còn lại" không tô đỏ

##3.3. Nhãn "Trạng thái PAKD"
[1] [Yes] CHK-phuong-an-kinh-doanh-038 → FR-phuong-an-kinh-doanh-005 · Verify phiên bản mới nhất là bản điều chỉnh "Chờ CFO" số V2 thì nhãn hiển thị "Chờ duyệt V2"
[1] [Yes] CHK-phuong-an-kinh-doanh-039 → FR-phuong-an-kinh-doanh-005 · Verify bản điều chỉnh mới nhất bị Kế toán từ chối và chưa huỷ thì nhãn hiển thị "Điều chỉnh bị từ chối"
[1] [Yes] CHK-phuong-an-kinh-doanh-040 → FR-phuong-an-kinh-doanh-005 · Verify dự án "Đang thực hiện" SM vừa bấm "Sửa PAKD" thì nhãn hiển thị "Đang điều chỉnh"
[2] [Yes] CHK-phuong-an-kinh-doanh-041 → FR-phuong-an-kinh-doanh-005 · Verify dự án "Đang thực hiện" có bản điều chỉnh nháp (không mở sửa) thì nhãn hiển thị "Đang điều chỉnh"
[1] [Yes] CHK-phuong-an-kinh-doanh-042 → FR-phuong-an-kinh-doanh-005 · Verify dự án chưa có phiên bản nào (kể cả đã Lưu nháp) thì nhãn hiển thị "Chưa có PAKD"
[1] [Yes] CHK-phuong-an-kinh-doanh-043 → FR-phuong-an-kinh-doanh-005 · Verify phiên bản lần đầu mới nhất "Chờ CFO" thì nhãn hiển thị "Đã có PAKD · chờ Kế toán duyệt"
[1] [Yes] CHK-phuong-an-kinh-doanh-044 → FR-phuong-an-kinh-doanh-005 · Verify phiên bản mới nhất "Đã duyệt" thì nhãn hiển thị "Đã duyệt"
[1] [Yes] CHK-phuong-an-kinh-doanh-045 → FR-phuong-an-kinh-doanh-005 · Verify dự án "Chưa có PAKD" sau khi bị Kế toán từ chối thì nhãn hiển thị "Từ chối — làm lại"
[2] [Yes] CHK-phuong-an-kinh-doanh-046 → FR-phuong-an-kinh-doanh-005 · Verify dự án "Đang thực hiện" sau khi huỷ bản điều chỉnh bị từ chối thì nhãn hiển thị "Đã duyệt"
[3] [Yes] CHK-phuong-an-kinh-doanh-047 → FR-phuong-an-kinh-doanh-005 · Verify dự án "Pending" có phiên bản mới nhất bị từ chối thì nhãn hiển thị tên trạng thái phiên bản "Từ chối"
[3] [No] CHK-phuong-an-kinh-doanh-048 → FR-phuong-an-kinh-doanh-005 · Verify nhãn "Đã duyệt" hiển thị màu xanh lá
[3] [No] CHK-phuong-an-kinh-doanh-049 → FR-phuong-an-kinh-doanh-005 · Verify nhãn "Chờ duyệt V2" và nhãn "Đã có PAKD · chờ Kế toán duyệt" hiển thị màu vàng
[3] [No] CHK-phuong-an-kinh-doanh-050 → FR-phuong-an-kinh-doanh-005 · Verify nhãn "Từ chối — làm lại" và nhãn "Điều chỉnh bị từ chối" hiển thị màu đỏ
[3] [No] CHK-phuong-an-kinh-doanh-051 → FR-phuong-an-kinh-doanh-005 · Verify nhãn "Đang điều chỉnh" hiển thị màu xanh dương
[4] [No] CHK-phuong-an-kinh-doanh-052 → FR-phuong-an-kinh-doanh-005 · Verify nhãn "Chưa có PAKD" hiển thị màu xám

##3.4. Quyền nhập — chỉ xem
[1] [Yes] CHK-phuong-an-kinh-doanh-053 → FR-phuong-an-kinh-doanh-006, BR-phuong-an-kinh-doanh-002 · Verify SM của khối dự án mở dự án "Chưa có PAKD" thì các ô Mục 1–4 nhập được
[1] [Yes] CHK-phuong-an-kinh-doanh-054 → FR-phuong-an-kinh-doanh-006 · Verify Kế toán mở dự án "Chưa có PAKD" thì toàn bộ khung ở chế độ chỉ xem
[1] [Yes] CHK-phuong-an-kinh-doanh-055 → FR-phuong-an-kinh-doanh-006 · Verify SM mở dự án "PAKD chờ duyệt" thì toàn bộ khung ở chế độ chỉ xem
[1] [Yes] CHK-phuong-an-kinh-doanh-056 → FR-phuong-an-kinh-doanh-006 · Verify SM mở dự án "Pending" thì toàn bộ khung ở chế độ chỉ xem
[1] [Yes] CHK-phuong-an-kinh-doanh-057 → FR-phuong-an-kinh-doanh-006 · Verify SM mở dự án "Kết thúc" thì toàn bộ khung ở chế độ chỉ xem
[1] [Yes] CHK-phuong-an-kinh-doanh-058 → FR-phuong-an-kinh-doanh-006 · Verify SM mở dự án "Đang thực hiện" chưa bấm "Sửa PAKD" thì khung ở chế độ chỉ xem
[2] [Yes] CHK-phuong-an-kinh-doanh-059 → FR-phuong-an-kinh-doanh-006 · Verify ở chế độ chỉ xem các nút Thêm dòng, Xoá dòng, Đính kèm, Chia đều đều không dùng được

#4. Tiêu đề khung và chân khung
##4.1. Tiêu đề khung
[3] [Yes] CHK-phuong-an-kinh-doanh-060 → FR-phuong-an-kinh-doanh-007 · Verify dự án "Chưa có PAKD" có tiêu đề khung "Lập phương án kinh doanh (PAKD)"
[3] [Yes] CHK-phuong-an-kinh-doanh-061 → FR-phuong-an-kinh-doanh-007 · Verify dự án có bản điều chỉnh "Chờ CFO" có tiêu đề khung "Phương án kinh doanh (PAKD) — điều chỉnh"

##4.2. Dòng hướng dẫn chân khung
[3] [Yes] CHK-phuong-an-kinh-doanh-062 → FR-phuong-an-kinh-doanh-020, BR-phuong-an-kinh-doanh-040 · Verify SM mở dự án "Chưa có PAKD" thấy chân khung "SM / GĐK nhập PAKD trong 30 ngày kể từ ngày GĐK duyệt → Gửi Kế toán (CFO) duyệt. Quá hạn chưa được duyệt → dự án Pending."
[2] [Yes] CHK-phuong-an-kinh-doanh-063 → BR-phuong-an-kinh-doanh-040 · Verify Kế toán mở dự án "Chưa có PAKD" thấy chân khung "Đang chờ SM / GĐK lập PAKD."
[3] [Yes] CHK-phuong-an-kinh-doanh-064 → BR-phuong-an-kinh-doanh-040 · Verify dự án "PAKD chờ duyệt" có chân khung "PAKD đã gửi duyệt — chỉ xem."
[3] [Yes] CHK-phuong-an-kinh-doanh-065 → BR-phuong-an-kinh-doanh-040 · Verify SM mở dự án "Đang thực hiện" không có bản chờ thấy chân khung "PAKD đã được duyệt. Bấm "Sửa PAKD" để điều chỉnh — gửi Kế toán duyệt lại, duyệt xong sinh phiên bản mới."
[3] [Yes] CHK-phuong-an-kinh-doanh-066 → BR-phuong-an-kinh-doanh-040 · Verify Kế toán mở dự án "Đang thực hiện" thấy chân khung "PAKD đã được duyệt — chỉ Giám đốc khối / Giám đốc kinh doanh (SM) được sửa PAKD."
[3] [Yes] CHK-phuong-an-kinh-doanh-067 → BR-phuong-an-kinh-doanh-040 · Verify dự án có bản điều chỉnh chờ duyệt có chân khung "Bản điều chỉnh đang chờ Kế toán (CFO) duyệt — chỉ xem."
[3] [Yes] CHK-phuong-an-kinh-doanh-068 → BR-phuong-an-kinh-doanh-040 · Verify dự án "Pending" có chân khung "Dự án Pending (quá hạn PAKD) — Kế toán mở lại để tiếp tục."
[3] [Yes] CHK-phuong-an-kinh-doanh-069 → BR-phuong-an-kinh-doanh-040 · Verify dự án "Kết thúc" có chân khung "Dự án đã kết thúc — PAKD chỉ xem."
[3] [Yes] CHK-phuong-an-kinh-doanh-070 → FR-phuong-an-kinh-doanh-020 · Verify sau khi Lưu nháp PAKD, chân khung có thêm "· Lưu lần cuối dd/mm/yyyy bởi {người}" với ngày hôm nay và người vừa lưu

#5. Chỉ số, biểu đồ, tóm tắt chi phí
##5.1. 3 ô chỉ số
[1] [Yes] CHK-phuong-an-kinh-doanh-071 → FR-phuong-an-kinh-doanh-008, BR-phuong-an-kinh-doanh-006 · Verify tình trạng Đã ký, Giá trị hợp đồng 1,000,000,000 thì ô "Doanh thu kế hoạch" hiển thị 1,000,000,000 kèm ghi chú "VNĐ · theo hợp đồng đã ký"
[1] [Yes] CHK-phuong-an-kinh-doanh-072 → FR-phuong-an-kinh-doanh-008, BR-phuong-an-kinh-doanh-006 · Verify tình trạng Chưa ký, Giá trị hợp đồng dự kiến 800,000,000 thì "Doanh thu kế hoạch" hiển thị 800,000,000 kèm ghi chú "VNĐ · theo giá trị dự kiến"
[2] [Yes] CHK-phuong-an-kinh-doanh-073 → FR-phuong-an-kinh-doanh-008, BR-phuong-an-kinh-doanh-006 · Verify tình trạng Chưa ký chưa nhập Giá trị dự kiến thì "Doanh thu kế hoạch" bằng 0 kèm ghi chú "VNĐ · ước tính, chưa có hợp đồng"
[1] [Yes] CHK-phuong-an-kinh-doanh-074 → FR-phuong-an-kinh-doanh-008, BR-phuong-an-kinh-doanh-009 · Verify Doanh thu kế hoạch 1,000,000,000, tổng chi phí 700,000,000 thì ô "Lợi nhuận" hiển thị 300,000,000 kèm ghi chú "Doanh thu kế hoạch − tổng chi phí"
[3] [No] CHK-phuong-an-kinh-doanh-075 → FR-phuong-an-kinh-doanh-008 · Verify Lợi nhuận âm thì ô "Lợi nhuận" tô đỏ
[1] [Yes] CHK-phuong-an-kinh-doanh-076 → FR-phuong-an-kinh-doanh-008, BR-phuong-an-kinh-doanh-009 · Verify Lợi nhuận 300,000,000 trên Doanh thu 1,000,000,000 thì "Biên lợi nhuận" hiển thị "30.0%"
[2] [Yes] CHK-phuong-an-kinh-doanh-077 → FR-phuong-an-kinh-doanh-008, BR-phuong-an-kinh-doanh-009 · Verify Biên lợi nhuận đúng 20.0% thì hiển thị nhãn "▲ Đạt"
[2] [Yes] CHK-phuong-an-kinh-doanh-078 → FR-phuong-an-kinh-doanh-008, BR-phuong-an-kinh-doanh-009, E-phuong-an-kinh-doanh-016 · Verify Biên lợi nhuận 19.9% thì hiển thị nhãn "! Dưới khung"
[2] [Yes] CHK-phuong-an-kinh-doanh-079 → FR-phuong-an-kinh-doanh-008, BR-phuong-an-kinh-doanh-009 · Verify chưa có doanh thu thì "Biên lợi nhuận" hiển thị "—" và không có nhãn
[3] [Yes] CHK-phuong-an-kinh-doanh-080 → FR-phuong-an-kinh-doanh-008 · Verify ô "Biên lợi nhuận" có ghi chú "Khung tối thiểu 20.0%"
[1] [Yes] CHK-phuong-an-kinh-doanh-081 → BR-phuong-an-kinh-doanh-007 · Verify tình trạng Đã ký có khoản mục ở cả 6 nhóm thì tổng chi phí bằng tổng kế hoạch tháng của mọi khoản mục
[2] [Yes] CHK-phuong-an-kinh-doanh-082 → BR-phuong-an-kinh-doanh-007 · Verify tình trạng Đã ký còn dòng giai đoạn cũ có số thì tổng chi phí không cộng bảng giai đoạn
[1] [Yes] CHK-phuong-an-kinh-doanh-083 → BR-phuong-an-kinh-doanh-007 · Verify tình trạng Chưa ký, 2 giai đoạn SX 100,000,000 và KD 50,000,000 mỗi giai đoạn thì tổng chi phí là 300,000,000
[2] [Yes] CHK-phuong-an-kinh-doanh-084 → BR-phuong-an-kinh-doanh-007 · Verify tình trạng Chưa ký còn khoản mục chi phí theo tháng cũ có số thì tổng chi phí không cộng bảng khoản mục

##5.2. Biểu đồ dòng tiền
[2] [Yes] CHK-phuong-an-kinh-doanh-085 → FR-phuong-an-kinh-doanh-009 · Verify tình trạng Đã ký biểu đồ có tiêu đề "Luỹ kế dòng tiền (LKDT = Dòng thu − Dòng chi + Số dư kỳ trước)" và đủ 3 chuỗi "Dòng thu", "Dòng chi", "Luỹ kế dòng tiền"
[2] [Yes] CHK-phuong-an-kinh-doanh-086 → FR-phuong-an-kinh-doanh-009 · Verify tình trạng Chưa ký biểu đồ có tiêu đề "Dòng tiền chi của dự án theo tháng" và đủ 2 cột "Sản xuất", "Kinh doanh"
[2] [Yes] CHK-phuong-an-kinh-doanh-087 → FR-phuong-an-kinh-doanh-009 · Verify trục tháng của biểu đồ chạy từ tháng đầu đến tháng cuối có số liệu
[3] [Yes] CHK-phuong-an-kinh-doanh-088 → FR-phuong-an-kinh-doanh-009 · Verify trục tiền dùng nhãn "x tỷ" khi giá trị từ 1 tỷ
[3] [Yes] CHK-phuong-an-kinh-doanh-089 → FR-phuong-an-kinh-doanh-009 · Verify trục tiền dùng nhãn "x tr" khi giá trị từ 1 triệu tới dưới 1 tỷ
[4] [No] CHK-phuong-an-kinh-doanh-090 → FR-phuong-an-kinh-doanh-009 · Verify vạch chia trục tiền theo bước 1 · 2 · 2,5 · 5 × 10ⁿ
[3] [Yes] CHK-phuong-an-kinh-doanh-091 → FR-phuong-an-kinh-doanh-009 · Verify rê chuột lên một tháng hiển thị "Tháng MM/YYYY" kèm số của từng chuỗi
[4] [Yes] CHK-phuong-an-kinh-doanh-092 → FR-phuong-an-kinh-doanh-009 · Verify biểu đồ có chú thích "ĐVT: VNĐ"
[3] [Yes] CHK-phuong-an-kinh-doanh-093 → FR-phuong-an-kinh-doanh-009 · Verify tình trạng Đã ký chưa có số thì biểu đồ hiển thị "Nhập mốc nghiệm thu (thời điểm, %) và chi phí (thời điểm, giá trị) để xem luỹ kế dòng tiền."
[3] [Yes] CHK-phuong-an-kinh-doanh-094 → FR-phuong-an-kinh-doanh-009 · Verify tình trạng Chưa ký chưa có số thì biểu đồ hiển thị "Nhập mốc kế hoạch (từ – đến, tổng mức đầu tư) để xem dòng tiền chi theo tháng."
[1] [Yes] CHK-phuong-an-kinh-doanh-095 → BR-phuong-an-kinh-doanh-013 · Verify Đã ký có mốc Giá trị thu đợt 270,000,000 với Tháng thu tiền 04/2027 thì cột "Dòng thu" tháng 04/2027 bằng 270,000,000
[1] [Yes] CHK-phuong-an-kinh-doanh-096 → BR-phuong-an-kinh-doanh-013, BR-phuong-an-kinh-doanh-015 · Verify Đã ký có chi phí khối A 40,000,000 và khối B 10,000,000 trong tháng 03/2027 thì cột "Dòng chi" tháng 03/2027 bằng 50,000,000
[2] [Yes] CHK-phuong-an-kinh-doanh-097 → BR-phuong-an-kinh-doanh-013 · Verify mốc không có Thời điểm nhưng có Thời gian gửi hồ sơ vẫn sinh "Dòng thu" ở tháng thu tiền
[3] [Yes] CHK-phuong-an-kinh-doanh-098 → BR-phuong-an-kinh-doanh-013 · Verify ô tháng chi phí giá trị 0 không làm xuất hiện tháng đó trên trục biểu đồ
[1] [Yes] CHK-phuong-an-kinh-doanh-099 → BR-phuong-an-kinh-doanh-015 · Verify "Luỹ kế dòng tiền" tháng 2 bằng Dòng thu tháng 2 trừ Dòng chi tháng 2 cộng Luỹ kế tháng 1
[2] [Yes] CHK-phuong-an-kinh-doanh-100 → BR-phuong-an-kinh-doanh-015 · Verify tháng trống nằm giữa dải có số thì "Luỹ kế dòng tiền" giữ bằng luỹ kế tháng trước
[2] [Yes] CHK-phuong-an-kinh-doanh-101 → BR-phuong-an-kinh-doanh-014 · Verify Chưa ký giai đoạn SX 9,000,000 từ 01/2027 đến 03/2027 thì cột "Sản xuất" mỗi tháng 01–03/2027 bằng 3,000,000
[3] [No] CHK-phuong-an-kinh-doanh-102 → BR-phuong-an-kinh-doanh-014 · Verify Chưa ký giai đoạn SX 10,000,000 chia 3 tháng thì tổng kế hoạch 3 tháng đúng 10,000,000 (chia chính xác, không làm tròn nghìn)
[2] [Yes] CHK-phuong-an-kinh-doanh-103 → BR-phuong-an-kinh-doanh-014 · Verify Chưa ký giai đoạn để trống "Đến" thì toàn bộ chi phí giai đoạn rơi vào tháng "Từ"
[3] [Yes] CHK-phuong-an-kinh-doanh-104 → BR-phuong-an-kinh-doanh-014 · Verify Chưa ký biểu đồ không có chuỗi doanh thu, chỉ có chi "Sản xuất" và "Kinh doanh"
[2] [Yes] CHK-phuong-an-kinh-doanh-105 → BR-phuong-an-kinh-doanh-014 · Verify Chưa ký giai đoạn thiếu "Từ" không sinh tháng nào trên biểu đồ nhưng vẫn được cộng vào tổng chi phí

##5.3. Tóm tắt chi phí
[2] [Yes] CHK-phuong-an-kinh-doanh-106 → FR-phuong-an-kinh-doanh-010 · Verify tình trạng Đã ký có bảng tóm tắt cột "Nhóm chi phí · Số tiền (VNĐ) · % doanh thu" đủ 6 nhóm và dòng "TỔNG CHI PHÍ"
[2] [Yes] CHK-phuong-an-kinh-doanh-107 → FR-phuong-an-kinh-doanh-010 · Verify nhóm Sản xuất 200,000,000 với Doanh thu 1,000,000,000 thì cột "% doanh thu" hiển thị "20.0%"
[3] [Yes] CHK-phuong-an-kinh-doanh-108 → FR-phuong-an-kinh-doanh-010 · Verify Đã ký chưa có doanh thu thì cột "% doanh thu" hiển thị "—"
[2] [Yes] CHK-phuong-an-kinh-doanh-109 → FR-phuong-an-kinh-doanh-010 · Verify tình trạng Chưa ký có bảng theo tháng cột "Tháng · Sản xuất · %/Tổng SX · Kinh doanh · %/Tổng KD · %/Tổng mức đầu tư"
[3] [Yes] CHK-phuong-an-kinh-doanh-110 → FR-phuong-an-kinh-doanh-010 · Verify Chưa ký chưa có tháng nào thì bảng tóm tắt hiển thị "Chưa có mốc kế hoạch."
[2] [Yes] CHK-phuong-an-kinh-doanh-111 → FR-phuong-an-kinh-doanh-010 · Verify Chưa ký dòng "TỔNG CHI PHÍ" hiển thị Σ Sản xuất, Σ Kinh doanh và "100%"
[3] [Yes] CHK-phuong-an-kinh-doanh-112 → FR-phuong-an-kinh-doanh-010 · Verify Chưa ký tổng chi phí bằng 0 thì cột tổng % của dòng "TỔNG CHI PHÍ" hiển thị "—"

#6. Kế hoạch cập nhật thông tin hợp đồng
##6.1. Đối chiếu giá trị hợp đồng — Đã ký
[2] [Yes] CHK-phuong-an-kinh-doanh-113 → FR-phuong-an-kinh-doanh-018 · Verify Đã ký, dự án đã có hợp đồng thì mục hiển thị "Đối chiếu: giá trị hợp đồng {giá trị HĐ của dự án} so với doanh thu PAKD {doanh thu}. Cảnh báo nếu lệch quá 2.0%"
[1] [Yes] CHK-phuong-an-kinh-doanh-114 → FR-phuong-an-kinh-doanh-018, BR-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-015 · Verify giá trị HĐ dự án lệch doanh thu PAKD 2,01% thì dòng đối chiếu có thêm "— đang lệch {z%}" và biểu tượng ⚠
[1] [Yes] CHK-phuong-an-kinh-doanh-115 → BR-phuong-an-kinh-doanh-018 · Verify giá trị HĐ dự án lệch doanh thu PAKD đúng 2% thì không có "— đang lệch" và không có ⚠
[3] [Yes] CHK-phuong-an-kinh-doanh-116 → BR-phuong-an-kinh-doanh-018 · Verify giá trị HĐ 1,020,000,001 so với doanh thu 1,000,000,000 vẫn cảnh báo lệch (tính trên giá trị chưa làm tròn)
[2] [Yes] CHK-phuong-an-kinh-doanh-117 → FR-phuong-an-kinh-doanh-018, BR-phuong-an-kinh-doanh-018 · Verify Đã ký, dự án chưa có hợp đồng thì phần giá trị đối chiếu hiển thị "—" và không cảnh báo
[3] [Yes] CHK-phuong-an-kinh-doanh-118 → FR-phuong-an-kinh-doanh-018, BR-phuong-an-kinh-doanh-018 · Verify Đã ký, doanh thu PAKD bằng 0 thì phần đối chiếu hiển thị "—" và không cảnh báo
[2] [Yes] CHK-phuong-an-kinh-doanh-119 → FR-phuong-an-kinh-doanh-018, BR-phuong-an-kinh-doanh-018 · Verify dự án có bản điều chỉnh chờ duyệt với doanh thu khác bản đã duyệt thì dòng đối chiếu dùng doanh thu của bản điều chỉnh đang hiển thị
[3] [No] CHK-phuong-an-kinh-doanh-120 → E-phuong-an-kinh-doanh-015 · Verify phần chữ "— đang lệch {z%}" và biểu tượng ⚠ hiển thị màu cam

##6.2. Nhắc cập nhật — Chưa ký
[3] [Yes] CHK-phuong-an-kinh-doanh-121 → FR-phuong-an-kinh-doanh-018 · Verify Chưa ký có Thời điểm dự kiến ký 05/2027 thì mục hiển thị "Nhắc cập nhật thông tin hợp đồng từ 01/05/2027. Cảnh báo nếu quá tháng dự kiến ký 05/2027."
[3] [Yes] CHK-phuong-an-kinh-doanh-122 → FR-phuong-an-kinh-doanh-018 · Verify Chưa ký chưa có Thời điểm dự kiến ký thì mục hiển thị "PAKD tạm: cập nhật thông tin hợp đồng (giá trị, ngày ký) ngay khi có. Hệ thống nhắc định kỳ. Chưa tính vào Dự kiến ký còn lại của khối cho đến khi có ngày dự kiến ký."
[4] [Yes] CHK-phuong-an-kinh-doanh-123 → FR-phuong-an-kinh-doanh-018 · Verify mục luôn có dòng "Khi có hợp đồng ký, hệ thống đối chiếu giá trị ký với PAKD và cảnh báo nếu lệch; lập bản điều chỉnh PAKD khi cần."

#7. Phiên bản và cột PAKD ở danh sách
##7.1. Cột "Phiên bản PAKD" và meta
[1] [Yes] CHK-phuong-an-kinh-doanh-124 → FR-phuong-an-kinh-doanh-033 · Verify dự án có phiên bản V1 "Chờ CFO" thì cột "Phiên bản PAKD" ở danh sách hiển thị "V1, chờ CFO"
[2] [Yes] CHK-phuong-an-kinh-doanh-125 → FR-phuong-an-kinh-doanh-033 · Verify dự án có phiên bản V1 "Đã duyệt" thì mục meta "PAKD" trên màn chi tiết hiển thị "V1, đã duyệt"
[2] [Yes] CHK-phuong-an-kinh-doanh-126 → FR-phuong-an-kinh-doanh-033 · Verify dự án có phiên bản V2 bị từ chối thì cột "Phiên bản PAKD" hiển thị "V2, từ chối"
[3] [No] CHK-phuong-an-kinh-doanh-127 → FR-phuong-an-kinh-doanh-033 · Verify phiên bản bị từ chối hiển thị chữ đỏ ở cột danh sách, còn mục meta trên màn chi tiết không tô đỏ
[2] [Yes] CHK-phuong-an-kinh-doanh-128 → FR-phuong-an-kinh-doanh-033 · Verify dự án chưa có phiên bản thì cột "Phiên bản PAKD" và meta "PAKD" hiển thị "—"

##7.2. Cột "Hạn lập PAKD"
[3] [Yes] CHK-phuong-an-kinh-doanh-129 → FR-phuong-an-kinh-doanh-034 · Verify dự án "Chờ duyệt mã" có cột "Hạn lập PAKD" hiển thị "—"
[2] [Yes] CHK-phuong-an-kinh-doanh-130 → FR-phuong-an-kinh-doanh-034 · Verify dự án "Pending" có cột "Hạn lập PAKD" hiển thị "Pending" kèm ngày chuyển Pending
[1] [Yes] CHK-phuong-an-kinh-doanh-131 → FR-phuong-an-kinh-doanh-034 · Verify dự án bị từ chối V1 lần đầu có dòng chính cột "Hạn lập PAKD" là "Làm lại V1" kèm "Còn n ngày" theo hạn gốc
[2] [Yes] CHK-phuong-an-kinh-doanh-132 → FR-phuong-an-kinh-doanh-034 · Verify dự án bị từ chối V1 lần đầu có dòng phụ cột "Hạn lập PAKD" là "V1 bị từ chối dd/mm/yyyy" với ngày Kế toán từ chối
[3] [Yes] CHK-phuong-an-kinh-doanh-133 → FR-phuong-an-kinh-doanh-034 · Verify dự án bị từ chối đã quá hạn gốc 4 ngày thì dòng chính hiển thị "Làm lại V1" kèm "Quá hạn 4 ngày"
[3] [Yes] CHK-phuong-an-kinh-doanh-134 → FR-phuong-an-kinh-doanh-034 · Verify dự án "Chưa có PAKD" chưa có hạn thì cột hiển thị "Chưa đặt hạn"
[2] [Yes] CHK-phuong-an-kinh-doanh-135 → FR-phuong-an-kinh-doanh-034 · Verify dự án "Chưa có PAKD" còn 10 ngày thì cột hiển thị "Còn 10 ngày"
[3] [No] CHK-phuong-an-kinh-doanh-136 → FR-phuong-an-kinh-doanh-034 · Verify dự án "Chưa có PAKD" còn 3 ngày thì chữ "Còn 3 ngày" màu cam
[2] [Yes] CHK-phuong-an-kinh-doanh-137 → FR-phuong-an-kinh-doanh-034 · Verify dự án "Chưa có PAKD" hạn đúng hôm nay thì cột hiển thị "Hết hạn hôm nay"
[2] [Yes] CHK-phuong-an-kinh-doanh-138 → FR-phuong-an-kinh-doanh-034 · Verify dự án "Chưa có PAKD" quá hạn 2 ngày thì cột hiển thị "Quá hạn 2 ngày"
[4] [Yes] CHK-phuong-an-kinh-doanh-139 → FR-phuong-an-kinh-doanh-034 · Verify dự án ở trạng thái khác "Chưa có PAKD", "Pending", "Chờ duyệt mã" mà chưa có phiên bản PAKD nào thì cột hiển thị "—"
[1] [Yes] CHK-phuong-an-kinh-doanh-140 → FR-phuong-an-kinh-doanh-034 · Verify phiên bản hiển thị V1 "Chờ CFO" thì cột hiển thị "Nộp V1" kèm ngày nộp
[1] [Yes] CHK-phuong-an-kinh-doanh-141 → FR-phuong-an-kinh-doanh-034 · Verify phiên bản hiển thị "Đã duyệt" thì cột hiển thị "Duyệt" kèm ngày duyệt
[1] [Yes] CHK-phuong-an-kinh-doanh-142 → FR-phuong-an-kinh-doanh-034 · Verify dự án "Đang thực hiện" có bản điều chỉnh bị từ chối chưa huỷ thì cột hiển thị "Điều chỉnh bị từ chối dd/mm/yyyy" với ngày Kế toán từ chối

##7.3. Ẩn cột PAKD với AM
[1] [Yes] CHK-phuong-an-kinh-doanh-143 → FR-phuong-an-kinh-doanh-044, NFR-phuong-an-kinh-doanh-007 · Verify AM xem danh sách dự án không thấy 3 cột "Hạn lập PAKD", "Phiên bản PAKD", "Giá trị hợp đồng dự kiến"
[1] [Yes] CHK-phuong-an-kinh-doanh-144 → FR-phuong-an-kinh-doanh-044, NFR-phuong-an-kinh-doanh-007 · Verify AM xem danh sách dự án thì dòng "Tổng cộng" không có ô Σ Giá trị hợp đồng dự kiến
[1] [Yes] CHK-phuong-an-kinh-doanh-145 → FR-phuong-an-kinh-doanh-044, NFR-phuong-an-kinh-doanh-007 · Verify AM Xuất Excel danh sách thì file không có 3 cột "Hạn lập PAKD", "Phiên bản PAKD", "Giá trị hợp đồng dự kiến"
[2] [Yes] CHK-phuong-an-kinh-doanh-146 → FR-phuong-an-kinh-doanh-044 · Verify SM xem danh sách dự án khối mình thấy đủ 3 cột "Hạn lập PAKD", "Phiên bản PAKD", "Giá trị hợp đồng dự kiến"
