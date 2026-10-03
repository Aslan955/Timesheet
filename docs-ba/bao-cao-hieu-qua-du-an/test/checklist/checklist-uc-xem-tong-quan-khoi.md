#1. Mở màn báo cáo
##1.1. Truy cập màn & thanh tiêu đề
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-001 → FR-bao-cao-hieu-qua-du-an-001, FR-bao-cao-hieu-qua-du-an-003 · Ban lãnh đạo chọn menu "Quản trị dự án & Tài chính → Báo cáo hiệu quả dự án" mở màn MH-03 với tab "Tổng quan cả khối / công ty" đang chọn
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-002 → FR-bao-cao-hieu-qua-du-an-001 · Thanh tiêu đề MH-03 hiển thị đủ đường dẫn "Quản trị dự án & Tài chính › Báo cáo hiệu quả dự án", tiêu đề "Báo cáo hiệu quả dự án", dòng meta Chốt số và meta Số dự án
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-003 → FR-bao-cao-hieu-qua-du-an-001, BR-bao-cao-hieu-qua-du-an-037 · Kế toán mở MH-03 thấy nút Import sổ kế toán trên thanh tiêu đề
##1.2. Meta Chốt số
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-004 → FR-bao-cao-hieu-qua-du-an-002, BR-bao-cao-hieu-qua-du-an-003 · Dữ liệu có số thực tế DT đến tháng 06, CP đến 08, DTT đến 07, KLCV đến 05: meta hiển thị "Chốt số: DT 06/YYYY · CP 08/YYYY · DTT 07/YYYY · KLCV 05/YYYY"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-005 → FR-bao-cao-hieu-qua-du-an-002, E-bao-cao-hieu-qua-du-an-020 · Chỉ tiêu KLCV chưa có số thực tế ở dự án nào: meta Chốt số hiện "—" ở vị trí KLCV
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-006 → BR-bao-cao-hieu-qua-du-an-003 · GĐK khối G1 mở MH-03 khi dòng Chi thực tế mới nhất (tháng 08) chỉ thuộc dự án khối G2: meta Chốt số CP vẫn là 08/YYYY (tính chung toàn công ty)
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-007 → BR-bao-cao-hieu-qua-du-an-003, BR-bao-cao-hieu-qua-du-an-036 · Tháng mới nhất có Chi phí thực tế là 09 với số ghi nhận bằng 0: meta Chốt số CP là 09/YYYY
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-008 → BR-bao-cao-hieu-qua-du-an-003, BR-bao-cao-hieu-qua-du-an-036 · Doanh thu tháng 10 còn "chưa có số" ở mọi dự án, tháng 09 đã ghi nhận: meta Chốt số DT là 09/YYYY
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-009 → FR-bao-cao-hieu-qua-du-an-002 · Meta Chốt số chỉ hiển thị, người dùng không chọn / sửa được giá trị
##1.3. Meta Số dự án
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-010 → FR-bao-cao-hieu-qua-du-an-001, BR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-034 · Kế toán mở MH-03: meta Số dự án bằng số dự án thuộc báo cáo toàn công ty
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-011 → FR-bao-cao-hieu-qua-du-an-001, BR-bao-cao-hieu-qua-du-an-005 · GĐK khối G1 mở MH-03: meta Số dự án chỉ đếm dự án thuộc báo cáo khối G1
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-012 → BR-bao-cao-hieu-qua-du-an-005 · Kế toán đổi Phạm vi xem từ Toàn công ty sang Khối G1: meta Số dự án giữ nguyên số toàn công ty
#2. Dự án thuộc báo cáo & nguồn Kế hoạch
##2.1. Dự án có mặt trên báo cáo
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-013 → BR-bao-cao-hieu-qua-du-an-034, FR-bao-cao-hieu-qua-du-an-007 · Dự án có 1 phiên bản PAKD được Kế toán duyệt có dòng trong bảng "Chi tiết theo dự án"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-014 → BR-bao-cao-hieu-qua-du-an-034 · Dự án chưa có PAKD được duyệt nhưng đã có Chi thực tế từ sổ kế toán có dòng trong bảng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-015 → BR-bao-cao-hieu-qua-du-an-034, BR-bao-cao-hieu-qua-du-an-036 · Dự án chưa có PAKD được duyệt nhưng đã có Doanh thu thực tế do Kế toán import có dòng trong bảng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-016 → BR-bao-cao-hieu-qua-du-an-034, FR-bao-cao-hieu-qua-du-an-007 · Dự án ở trạng thái Chờ duyệt mã không có dòng trong bảng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-017 → BR-bao-cao-hieu-qua-du-an-034, FR-bao-cao-hieu-qua-du-an-007 · Dự án Chưa có PAKD, chưa có số thực tế, không có dòng trong bảng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-018 → BR-bao-cao-hieu-qua-du-an-034, BR-bao-cao-hieu-qua-du-an-033 · Dự án có PAKD đang chờ duyệt (chưa từng được duyệt, chưa có số thực tế) không có dòng trong bảng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-019 → BR-bao-cao-hieu-qua-du-an-033 · Dự án có PAKD bị từ chối (chưa từng được duyệt, chưa có số thực tế) không có dòng trong bảng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-020 → BR-bao-cao-hieu-qua-du-an-034 · Dự án đã từng được duyệt PAKD, nay ở trạng thái Kết thúc vẫn có dòng trong bảng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-021 → BR-bao-cao-hieu-qua-du-an-034 · Dự án đã từng được duyệt PAKD, nay ở trạng thái Pending vẫn có dòng trong bảng
##2.2. Nguồn số Kế hoạch
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-022 → BR-bao-cao-hieu-qua-du-an-033 · Cột Kế hoạch Doanh thu của dự án bằng kế hoạch theo tháng của phiên bản PAKD được Kế toán duyệt gần nhất
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-023 → BR-bao-cao-hieu-qua-du-an-033 · Kế toán duyệt PAKD điều chỉnh: cột Kế hoạch của dự án đổi theo bản điều chỉnh
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-024 → BR-bao-cao-hieu-qua-du-an-033 · Dự án có PAKD điều chỉnh đang chờ duyệt: cột Kế hoạch giữ theo phiên bản được duyệt trước đó
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-025 → BR-bao-cao-hieu-qua-du-an-033 · Dự án có PAKD điều chỉnh bị từ chối: cột Kế hoạch giữ theo phiên bản được duyệt trước đó
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-026 → BR-bao-cao-hieu-qua-du-an-033 · Kế toán duyệt PAKD sinh ra 0 tháng kế hoạch: cột Kế hoạch giữ kế hoạch cũ
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-027 → BR-bao-cao-hieu-qua-du-an-033 · PAKD "Đã ký": Kế hoạch Doanh thu rơi vào tháng mốc nghiệm thu
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-028 → BR-bao-cao-hieu-qua-du-an-033 · PAKD "Đã ký": Kế hoạch Dòng tiền thu rơi vào tháng thu tiền
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-029 → BR-bao-cao-hieu-qua-du-an-033, BR-bao-cao-hieu-qua-du-an-001 · PAKD "Đã ký": Kế hoạch Chi phí từng tháng bằng Chi SX + Chi KD theo kế hoạch chi phí tháng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-030 → BR-bao-cao-hieu-qua-du-an-033 · PAKD "Chưa ký": Kế hoạch Chi phí chia đều theo giai đoạn
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-031 → BR-bao-cao-hieu-qua-du-an-033 · PAKD "Chưa ký": Kế hoạch Doanh thu và Kế hoạch Dòng tiền thu đều bằng 0
#3. Kỳ so sánh & Phạm vi xem
##3.1. Kỳ mặc định
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-032 → BR-bao-cao-hieu-qua-du-an-004, FR-bao-cao-hieu-qua-du-an-004 · Chốt số DT 06, CP 08, DTT 07, KLCV 05: ô Đến tháng mặc định 08/YYYY (chốt số muộn nhất)
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-033 → BR-bao-cao-hieu-qua-du-an-004 · Đến tháng mặc định 08/YYYY: ô Từ tháng mặc định 01/YYYY cùng năm
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-034 → BR-bao-cao-hieu-qua-du-an-004 · Chưa chỉ tiêu nào có Chốt số: kỳ mặc định Từ 01 đến 12 của năm hiện tại
[2] [No] CHK-bao-cao-hieu-qua-du-an-035 → BR-bao-cao-hieu-qua-du-an-004, NFR-bao-cao-hieu-qua-du-an-006 · Mở màn lúc 01h ngày 01/01 giờ Việt Nam (máy đặt múi giờ UTC), chưa có Chốt số: kỳ mặc định thuộc năm mới
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-036 → BR-bao-cao-hieu-qua-du-an-004 · Đổi chỉ tiêu ở nút gạt biểu đồ: Từ tháng, Đến tháng mặc định không đổi
##3.2. Chỉnh Từ tháng / Đến tháng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-037 → BR-bao-cao-hieu-qua-du-an-004 · Ô Từ tháng không cho chọn tháng lớn hơn Đến tháng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-038 → BR-bao-cao-hieu-qua-du-an-004 · Ô Đến tháng không cho chọn tháng nhỏ hơn Từ tháng
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-039 → BR-bao-cao-hieu-qua-du-an-004 · Xoá trống ô Từ tháng: ô giữ giá trị cũ
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-040 → BR-bao-cao-hieu-qua-du-an-004 · Xoá trống ô Đến tháng: ô giữ giá trị cũ
##3.3. Phạm vi xem theo vai trò
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-041 → FR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005 · Kế toán mở ô Phạm vi xem thấy đủ: Toàn công ty, Khối G1, G2, G3, G4, BFSI, GPDV
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-042 → FR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005 · Ban lãnh đạo mở ô Phạm vi xem thấy đủ: Toàn công ty, Khối G1, G2, G3, G4, BFSI, GPDV
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-043 → FR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005 · Kế toán mở màn: Phạm vi xem mặc định "Toàn công ty"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-044 → FR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005 · Ban lãnh đạo mở màn: Phạm vi xem mặc định "Toàn công ty"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-045 → FR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005 · GĐK khối G1 mở màn: ô Phạm vi xem cố định "Khối G1", không chọn được khối khác
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-046 → FR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005 · SM khối G3 mở màn: ô Phạm vi xem cố định "Khối G3", không chọn được khối khác
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-047 → FR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005 · Kế toán chọn Phạm vi "Khối G2": bảng "Chi tiết theo dự án" chỉ còn dự án thuộc báo cáo có khối G2
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-048 → FR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005 · Kế toán chọn Phạm vi "Khối G2": ô Doanh thu chỉ cộng số của dự án khối G2
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-049 → FR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005 · Kế toán chọn Phạm vi "Khối G2", trục "Theo dự án": biểu đồ chỉ có cột của dự án khối G2
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-050 → BR-bao-cao-hieu-qua-du-an-005 · Phạm vi "Toàn công ty": bảng gồm dự án thuộc báo cáo của cả 6 khối
##3.4. Kỳ so sánh từng chỉ tiêu
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-051 → BR-bao-cao-hieu-qua-du-an-002, FR-bao-cao-hieu-qua-du-an-005 · Kỳ 01–12, Chốt số DT 06: ô Doanh thu cộng Thực tế và Kế hoạch các tháng 01–06
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-052 → BR-bao-cao-hieu-qua-du-an-002 · Đến tháng 04, Chốt số CP 08: ô Chi phí cộng các tháng 01–04 (min của Đến tháng và chốt số)
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-053 → BR-bao-cao-hieu-qua-du-an-002 · Chỉ tiêu Dòng tiền thu chưa có Chốt số, kỳ 01–12: dòng "Kế hoạch" của ô Dòng tiền thu vẫn hiện, cộng Kế hoạch các tháng 01–12
#4. 5 ô số
##4.1. Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-054 → FR-bao-cao-hieu-qua-du-an-005 · Tab tổng quan hiển thị đủ 5 ô: Biên lợi nhuận gộp, Doanh thu (VNĐ), Chi phí (VNĐ), Dòng tiền thu (VNĐ), Khối lượng công việc (SP)
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-055 → FR-bao-cao-hieu-qua-du-an-005 · Ô Doanh thu: số to bằng Σ Doanh thu thực tế trong kỳ so sánh của Doanh thu
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-056 → FR-bao-cao-hieu-qua-du-an-005 · Ô Doanh thu: dòng dưới hiện "Kế hoạch {Σ KH}" bằng Σ Kế hoạch Doanh thu trong kỳ so sánh của Doanh thu
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-057 → FR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-001 · Ô Chi phí: số to bằng Σ (Chi sản xuất + Chi kinh doanh) thực tế trong kỳ so sánh của Chi phí
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-058 → FR-bao-cao-hieu-qua-du-an-005 · Ô Dòng tiền thu: số to bằng Σ tiền thu thực tế trong kỳ so sánh của Dòng tiền thu
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-059 → FR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-001 · Ô Khối lượng công việc: số to bằng Σ KLCV thực tế (SP) trong kỳ so sánh của KLCV
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-060 → BR-bao-cao-hieu-qua-du-an-007 · Ô Doanh thu có TT 90, KH 100: nhãn % hoàn thành hiện "90.0%"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-061 → BR-bao-cao-hieu-qua-du-an-007 · Ô Doanh thu có TT ≥ KH: viền và nhãn màu xanh
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-062 → BR-bao-cao-hieu-qua-du-an-007 · Ô Doanh thu có TT < KH: viền và nhãn màu đỏ
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-063 → BR-bao-cao-hieu-qua-du-an-007 · Ô Chi phí có TT ≤ KH: viền và nhãn màu xanh (chiều đảo ngược)
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-064 → BR-bao-cao-hieu-qua-du-an-007 · Ô Chi phí có TT > KH: viền và nhãn màu đỏ
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-065 → BR-bao-cao-hieu-qua-du-an-007 · Ô Dòng tiền thu có KH = 0: không hiện nhãn %, màu trung tính
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-066 → FR-bao-cao-hieu-qua-du-an-005, E-bao-cao-hieu-qua-du-an-020 · Chỉ tiêu Dòng tiền thu chưa có Chốt số: ô Dòng tiền thu hiện số to "—" kèm "Chưa có số thực tế"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-067 → FR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-002, E-bao-cao-hieu-qua-du-an-020 · Chỉ tiêu Dòng tiền thu chưa có Chốt số: ô Dòng tiền thu không có nhãn %, màu trung tính
##4.2. Ô Biên lợi nhuận gộp
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-068 → BR-bao-cao-hieu-qua-du-an-006 · DT thực tế 1.000, CP thực tế 700: ô Biên lợi nhuận gộp hiện "30.0%"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-069 → FR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-006 · Ô Biên lợi nhuận gộp: dòng dưới hiện "Kế hoạch x% · (DT − CP) / DT" với x là biên kế hoạch
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-070 → BR-bao-cao-hieu-qua-du-an-006, BR-bao-cao-hieu-qua-du-an-002 · Kỳ 01–12, Chốt số DT 06, CP 08: Biên thực tế bằng (DT 01–06 − CP 01–08) / DT 01–06
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-071 → BR-bao-cao-hieu-qua-du-an-006 · DT thực tế trong kỳ bằng 0: ô Biên lợi nhuận gộp hiện "—"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-072 → BR-bao-cao-hieu-qua-du-an-006 · DT thực tế trong kỳ bằng 0: ô Biên không có nhãn chênh biên, màu trung tính
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-073 → BR-bao-cao-hieu-qua-du-an-006, E-bao-cao-hieu-qua-du-an-020 · Doanh thu chưa có Chốt số: ô Biên hiện "—" kèm "Chưa có số thực tế"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-074 → BR-bao-cao-hieu-qua-du-an-006, E-bao-cao-hieu-qua-du-an-020 · Chi phí chưa có Chốt số: ô Biên hiện "—" kèm "Chưa có số thực tế"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-075 → BR-bao-cao-hieu-qua-du-an-006 · Biên thực tế 33%, Biên kế hoạch 30%: nhãn chênh biên hiện "+10.0%" màu xanh
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-076 → BR-bao-cao-hieu-qua-du-an-006 · Biên thực tế 27%, Biên kế hoạch 30%: nhãn chênh biên hiện "-10.0%" màu đỏ
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-077 → BR-bao-cao-hieu-qua-du-an-006 · Biên kế hoạch bằng 0: không hiện nhãn chênh biên, màu trung tính
##4.3. Bấm số thực tế mở P-06
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-078 → FR-bao-cao-hieu-qua-du-an-016 · Số thực tế Chi phí khác 0 được gạch chân chấm, rê chuột hiện tooltip "Xem chi tiết sổ kế toán"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-079 → FR-bao-cao-hieu-qua-du-an-005, FR-bao-cao-hieu-qua-du-an-016, BR-bao-cao-hieu-qua-du-an-019 · Kỳ so sánh Chi phí 01–08, Phạm vi Toàn công ty: bấm số thực tế ô Chi phí mở P-06 sổ Chi với kỳ "Từ tháng 01/YYYY đến tháng 08/YYYY"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-080 → FR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-019 · Phạm vi "Khối G1": bấm số thực tế ô Dòng tiền thu mở P-06 sổ thu với tiêu đề phạm vi "Khối G1 · n dự án"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-081 → BR-bao-cao-hieu-qua-du-an-019, BR-bao-cao-hieu-qua-du-an-040 · Phạm vi Toàn công ty: bấm số thực tế ô Chi phí mở P-06 với tiêu đề phạm vi "Toàn công ty · n dự án"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-082 → FR-bao-cao-hieu-qua-du-an-016, BR-bao-cao-hieu-qua-du-an-018 · Số thực tế ô Doanh thu không gạch chân, bấm không mở P-06
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-083 → FR-bao-cao-hieu-qua-du-an-016, BR-bao-cao-hieu-qua-du-an-018 · Số thực tế ô Khối lượng công việc bấm không mở P-06
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-084 → BR-bao-cao-hieu-qua-du-an-018 · Ô Chi phí có số thực tế bằng 0: bấm không mở P-06
#5. Biểu đồ kế hoạch – thực tế
##5.1. Nút gạt & mặc định
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-085 → FR-bao-cao-hieu-qua-du-an-006 · Khung "Biểu đồ kế hoạch – thực tế" có nút gạt chỉ tiêu đủ: Doanh thu · Chi phí · Dòng tiền thu · Khối lượng công việc
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-086 → FR-bao-cao-hieu-qua-du-an-006 · Khung biểu đồ có nút gạt trục đủ: Theo tháng · Theo dự án
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-087 → FR-bao-cao-hieu-qua-du-an-006 · Mở màn lần đầu: biểu đồ chọn sẵn chỉ tiêu Doanh thu, trục Theo tháng
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-088 → FR-bao-cao-hieu-qua-du-an-006 · Chỉ tiêu Chi phí: chú giải biểu đồ kèm "ĐVT: VNĐ"
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-089 → FR-bao-cao-hieu-qua-du-an-006 · Chỉ tiêu Khối lượng công việc: chú giải biểu đồ kèm "ĐVT: SP"
##5.2. Trục Theo tháng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-090 → BR-bao-cao-hieu-qua-du-an-014 · Kỳ 01–12, Chốt số DT 06: trục Theo tháng có đủ 12 nhóm cột tháng 01–12
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-091 → BR-bao-cao-hieu-qua-du-an-014, FR-bao-cao-hieu-qua-du-an-006 · Kỳ 01–12, Chốt số DT 06: các tháng 07–12 chỉ có cột Kế hoạch
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-092 → BR-bao-cao-hieu-qua-du-an-014 · Cột Kế hoạch tháng 03 bằng Σ Kế hoạch tháng 03 của các dự án trong phạm vi
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-093 → FR-bao-cao-hieu-qua-du-an-006 · Rê chuột nhóm cột tháng 03 (không sau chốt số): bảng nhỏ hiện đủ Kế hoạch, Thực tế, Hoàn thành (%)
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-094 → FR-bao-cao-hieu-qua-du-an-006 · Rê chuột nhóm cột tháng 09 (sau chốt số): Thực tế hiện "chưa chốt số"
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-095 → BR-bao-cao-hieu-qua-du-an-007 · Rê chuột tháng có Kế hoạch bằng 0: Hoàn thành hiện "—"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-096 → BR-bao-cao-hieu-qua-du-an-014 · Chỉ tiêu Dòng tiền thu chưa có Chốt số: biểu đồ chỉ có cột Kế hoạch ở các tháng trong kỳ Từ – Đến
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-097 → BR-bao-cao-hieu-qua-du-an-014 · Chỉ tiêu Dòng tiền thu chưa có Chốt số: rê chuột hiện Thực tế "chưa chốt số"
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-098 → BR-bao-cao-hieu-qua-du-an-014 · Chỉ tiêu Dòng tiền thu chưa có Chốt số: rê chuột hiện Hoàn thành "—"
[4] [No] CHK-bao-cao-hieu-qua-du-an-099 → NFR-bao-cao-hieu-qua-du-an-005 · Cột Kế hoạch màu xanh #2a78d6, cột Thực tế màu cam #eb6834
[4] [No] CHK-bao-cao-hieu-qua-du-an-100 → NFR-bao-cao-hieu-qua-du-an-005 · Trục Y có 5 vạch, giá trị lớn nhất làm tròn lên mức 1 / 2 / 2.5 / 5 / 10 × 10^n
##5.3. Trục Theo dự án
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-101 → BR-bao-cao-hieu-qua-du-an-014 · Trục Theo dự án: nhãn mỗi nhóm cột là Mã tổng của dự án
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-102 → BR-bao-cao-hieu-qua-du-an-014, BR-bao-cao-hieu-qua-du-an-002 · Trục Theo dự án, chỉ tiêu Chi phí, Chốt số CP 08, kỳ 01–12: cột của mỗi dự án cộng các tháng 01–08
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-103 → BR-bao-cao-hieu-qua-du-an-014 · Trục Theo dự án: dự án có Kế hoạch và Thực tế của chỉ tiêu đều bằng 0 không có cột
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-104 → E-bao-cao-hieu-qua-du-an-017, FR-bao-cao-hieu-qua-du-an-006 · Kỳ không có nhóm cột nào: vùng biểu đồ hiện "Không có số liệu trong kỳ."
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-105 → E-bao-cao-hieu-qua-du-an-017 · Đang hiện "Không có số liệu trong kỳ.", đổi kỳ sang tháng có số liệu: biểu đồ hiện lại các cột
#6. Bảng Chi tiết theo dự án
##6.1. Cột & định dạng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-106 → FR-bao-cao-hieu-qua-du-an-007 · Bảng có đủ cột: Mã dự án, Start, End, Sức khoẻ và 4 nhóm Doanh thu, Chi phí, Dòng tiền thu, KLCV, mỗi nhóm gồm Kế hoạch / Thực tế / Chênh lệch (%)
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-107 → FR-bao-cao-hieu-qua-du-an-007 · Cột Mã dự án hiện Mã tổng in đậm kèm dòng nhỏ "Khối · Tên dự án"
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-108 → FR-bao-cao-hieu-qua-du-an-007, NFR-bao-cao-hieu-qua-du-an-006 · Cột Start, End hiển thị dạng dd/mm/yyyy
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-109 → NFR-bao-cao-hieu-qua-du-an-003, FR-bao-cao-hieu-qua-du-an-007 · Cuộn ngang bảng: cột Mã dự án vẫn cố định bên trái
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-110 → FR-bao-cao-hieu-qua-du-an-007 · Chân khung hiện "Bấm vào 1 dòng để xem Tổng quan dự án · Bấm vào con số thực tế của Chi phí / Dòng tiền thu để xem chi tiết sổ kế toán · ĐVT: VNĐ (KLCV: SP)"
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-111 → NFR-bao-cao-hieu-qua-du-an-006 · Số tiền trong bảng làm tròn đơn vị, ngăn nghìn bằng dấu phẩy
##6.2. Số liệu từng nhóm chỉ tiêu
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-112 → FR-bao-cao-hieu-qua-du-an-007, BR-bao-cao-hieu-qua-du-an-002 · Kỳ 01–12, Chốt số DT 06, CP 08: mỗi nhóm cắt theo chốt số riêng (nhóm Doanh thu cộng 01–06, nhóm Chi phí cộng 01–08)
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-113 → FR-bao-cao-hieu-qua-du-an-007, E-bao-cao-hieu-qua-du-an-020 · Chỉ tiêu Dòng tiền thu chưa có Chốt số: cột Thực tế của nhóm Dòng tiền thu hiện "—"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-114 → FR-bao-cao-hieu-qua-du-an-007, E-bao-cao-hieu-qua-du-an-020, BR-bao-cao-hieu-qua-du-an-002 · Chỉ tiêu Dòng tiền thu chưa có Chốt số: cột Chênh lệch (%) của nhóm Dòng tiền thu hiện "—"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-115 → BR-bao-cao-hieu-qua-du-an-008 · KH 200, TT 230: Chênh lệch (%) hiện "+15.0%"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-116 → BR-bao-cao-hieu-qua-du-an-008 · Chênh lệch tuyệt đối dưới 0.05%: Chênh lệch (%) hiện "0.0%"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-117 → BR-bao-cao-hieu-qua-du-an-008 · KH bằng 0: Chênh lệch (%) hiện "–"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-118 → BR-bao-cao-hieu-qua-du-an-008 · Dự án "Chưa phát sinh": cột Thực tế hiện "–"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-119 → BR-bao-cao-hieu-qua-du-an-008 · Dự án "Chưa phát sinh": cột Chênh lệch (%) hiện "–"
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-120 → BR-bao-cao-hieu-qua-du-an-008 · Chênh lệch tuyệt đối làm tròn bằng 0: chữ Chênh lệch màu xám
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-121 → BR-bao-cao-hieu-qua-du-an-008 · Doanh thu TT > KH: Chênh lệch màu xanh
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-122 → BR-bao-cao-hieu-qua-du-an-008 · Chi phí TT > KH: Chênh lệch màu đỏ (chiều đảo ngược)
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-123 → BR-bao-cao-hieu-qua-du-an-008 · Rê chuột ô Chênh lệch Doanh thu: hiện "Chênh lệch: ±{số tuyệt đối} VNĐ"
##6.3. Dòng Tổng cộng
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-124 → BR-bao-cao-hieu-qua-du-an-009, FR-bao-cao-hieu-qua-du-an-007 · Dòng "Tổng cộng (n dự án)": Kế hoạch, Thực tế bằng tổng của các dự án đang hiển thị
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-125 → BR-bao-cao-hieu-qua-du-an-009 · Dòng tổng: Chênh lệch (%) tính trên tổng Kế hoạch và tổng Thực tế
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-126 → BR-bao-cao-hieu-qua-du-an-009 · Lọc sức khoẻ "Tốt": dòng tổng chỉ cộng dự án mức Tốt, n bằng số dự án Tốt
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-127 → BR-bao-cao-hieu-qua-du-an-009 · Lọc "Tất cả": dự án "Chưa phát sinh" được tính vào n của dòng tổng với Thực tế bằng 0
[4] [No] CHK-bao-cao-hieu-qua-du-an-128 → NFR-bao-cao-hieu-qua-du-an-003 · Dòng tổng của bảng có nền vàng
##6.4. Bấm dòng & số thực tế
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-129 → FR-bao-cao-hieu-qua-du-an-007 · Bấm 1 dòng dự án: màn chuyển sang tab "Tổng quan dự án" với đúng dự án đó được chọn
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-130 → BR-bao-cao-hieu-qua-du-an-019, FR-bao-cao-hieu-qua-du-an-007 · Bấm số thực tế Chi phí của 1 dòng dự án: P-06 mở với tiêu đề "{Mã tổng} — {Tên}" của dự án đó
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-131 → BR-bao-cao-hieu-qua-du-an-019, BR-bao-cao-hieu-qua-du-an-040, FR-bao-cao-hieu-qua-du-an-007 · Đang lọc "Cần chú ý": bấm số thực tế Dòng tiền thu ở dòng tổng mở P-06 với tiêu đề phạm vi kèm n bằng số dự án đang hiển thị
#7. Lọc & xếp mức sức khoẻ
##7.1. Nút gạt Sức khoẻ
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-132 → FR-bao-cao-hieu-qua-du-an-008 · Góc khung có nút gạt "Sức khoẻ:" đủ: Tất cả (n) · Tốt (n) · Cần chú ý (n) · Theo dõi (n) · Chưa phát sinh (n)
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-133 → FR-bao-cao-hieu-qua-du-an-008 · Phạm vi "Khối G1": số n trên mỗi nút gạt chỉ đếm dự án khối G1
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-134 → FR-bao-cao-hieu-qua-du-an-008 · Chọn "Cần chú ý": bảng chỉ còn dự án mức Cần chú ý
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-135 → E-bao-cao-hieu-qua-du-an-016, FR-bao-cao-hieu-qua-du-an-008 · Chọn mức không có dự án nào: bảng hiện "Không có dự án nào ở mức này."
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-136 → E-bao-cao-hieu-qua-du-an-016, BR-bao-cao-hieu-qua-du-an-009 · Chọn mức không có dự án nào: bảng không có dòng tổng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-137 → E-bao-cao-hieu-qua-du-an-016 · Kế toán chọn Phạm vi khối không có dự án thuộc báo cáo: bảng hiện "Không có dự án nào ở mức này."
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-138 → E-bao-cao-hieu-qua-du-an-016 · Đang hiện "Không có dự án nào ở mức này.", chọn "Tất cả": bảng hiện lại danh sách dự án
##7.2. Xếp mức sức khoẻ
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-139 → BR-bao-cao-hieu-qua-du-an-010, BR-bao-cao-hieu-qua-du-an-013, FR-bao-cao-hieu-qua-du-an-009 · Dự án có Kế hoạch nhưng không có số thực tế ở chỉ tiêu nào trong kỳ: xếp "Chưa phát sinh"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-140 → BR-bao-cao-hieu-qua-du-an-013 · Dự án chỉ có Chi thực tế ghi nhận bằng 0 trong kỳ: không xếp "Chưa phát sinh"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-141 → BR-bao-cao-hieu-qua-du-an-013 · Dự án chỉ có số thực tế ở tháng ngoài kỳ so sánh: xếp "Chưa phát sinh"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-142 → BR-bao-cao-hieu-qua-du-an-010, FR-bao-cao-hieu-qua-du-an-009 · DT đúng 85% KH, CP 100%, DTT 100%: xếp "Cần chú ý"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-143 → BR-bao-cao-hieu-qua-du-an-010, FR-bao-cao-hieu-qua-du-an-009 · CP đúng 130% KH, DT 100%, DTT 100%: xếp "Cần chú ý"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-144 → BR-bao-cao-hieu-qua-du-an-010 · Chi phí KH bằng 0, Chi phí thực tế lớn hơn 0: xếp "Cần chú ý"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-145 → BR-bao-cao-hieu-qua-du-an-010 · DTT đúng 65% KH, DT 100%, CP 100%: xếp "Cần chú ý"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-146 → BR-bao-cao-hieu-qua-du-an-010, FR-bao-cao-hieu-qua-du-an-009 · DT đúng 95%, CP đúng 100%, DTT đúng 95% KH: xếp "Tốt"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-147 → BR-bao-cao-hieu-qua-du-an-010, FR-bao-cao-hieu-qua-du-an-009 · DT 90%, CP 100%, DTT 100% KH: xếp "Theo dõi"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-148 → BR-bao-cao-hieu-qua-du-an-010 · DT 100%, CP 110%, DTT 100% KH: xếp "Theo dõi"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-149 → BR-bao-cao-hieu-qua-du-an-010 · DT 100%, CP 100%, DTT 80% KH: xếp "Theo dõi"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-150 → BR-bao-cao-hieu-qua-du-an-010, BR-bao-cao-hieu-qua-du-an-011, FR-bao-cao-hieu-qua-du-an-009 · Dự án có số thực tế, KH Doanh thu, Chi phí, Dòng tiền thu đều bằng 0, Chi phí thực tế bằng 0: xếp "Theo dõi"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-151 → BR-bao-cao-hieu-qua-du-an-011 · KH Doanh thu bằng 0 (bị bỏ qua), CP 90%, DTT 100% KH: xếp "Tốt"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-152 → BR-bao-cao-hieu-qua-du-an-011 · KH Dòng tiền thu bằng 0 (bị bỏ qua), DT 100%, CP 90% KH: xếp "Tốt"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-153 → BR-bao-cao-hieu-qua-du-an-011 · KH Chi phí bằng 0, Chi phí thực tế bằng 0 (bị bỏ qua), DT 100%, DTT 100%: xếp "Tốt"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-154 → BR-bao-cao-hieu-qua-du-an-011, BR-bao-cao-hieu-qua-du-an-002, E-bao-cao-hieu-qua-du-an-020 · Dòng tiền thu chưa có Chốt số (bị bỏ qua), DT 100%, CP 90% KH: xếp "Tốt"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-155 → BR-bao-cao-hieu-qua-du-an-012 · DT, CP, DTT đạt ngưỡng Tốt, KLCV thực tế bằng 0: vẫn xếp "Tốt"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-156 → BR-bao-cao-hieu-qua-du-an-010, BR-bao-cao-hieu-qua-du-an-002 · Chốt số DT 06, kỳ 01–12, DT 01–06 đạt 100% KH, KH DT 07–12 lớn: dự án không bị "Cần chú ý" vì Doanh thu
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-157 → FR-bao-cao-hieu-qua-du-an-009 · Mỗi dự án trong bảng mang đúng 1 nhãn mức sức khoẻ
[3] [No] CHK-bao-cao-hieu-qua-du-an-158 → FR-bao-cao-hieu-qua-du-an-009 · Nhãn mức: Tốt xanh lá, Cần chú ý đỏ, Theo dõi vàng, Chưa phát sinh xám
##7.3. Khung Định nghĩa về mức sức khoẻ
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-159 → FR-bao-cao-hieu-qua-du-an-010 · Khung "Định nghĩa về mức sức khoẻ" có 2 cột "Mức" / "Điều kiện (so với kế hoạch cùng kỳ)" và 4 dòng
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-160 → FR-bao-cao-hieu-qua-du-an-010, BR-bao-cao-hieu-qua-du-an-010 · Dòng "Cần chú ý" của khung có điều kiện Chi phí kế hoạch bằng 0 mà có chi thực tế
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-161 → FR-bao-cao-hieu-qua-du-an-010, BR-bao-cao-hieu-qua-du-an-011 · Dòng "Theo dõi" của khung có trường hợp mọi chỉ tiêu đều bị bỏ qua
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-162 → FR-bao-cao-hieu-qua-du-an-010, BR-bao-cao-hieu-qua-du-an-012 · Chân khung hiện "Khối lượng công việc chưa tham gia xếp mức (chờ chốt ngưỡng)."
[3] [Yes] CHK-bao-cao-hieu-qua-du-an-163 → FR-bao-cao-hieu-qua-du-an-010 · Khung Định nghĩa chỉ xem, không có ô sửa
#8. Giữ bộ lọc khi chuyển tab
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-164 → FR-bao-cao-hieu-qua-du-an-003 · Đặt Từ tháng 03, Đến tháng 09, chuyển sang tab "Tổng quan dự án", quay lại tab tổng quan: Từ / Đến giữ 03–09
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-165 → FR-bao-cao-hieu-qua-du-an-003 · Kế toán chọn Phạm vi "Khối G2", chuyển sang tab dự án, quay lại: Phạm vi giữ "Khối G2"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-166 → FR-bao-cao-hieu-qua-du-an-003 · Chọn trục "Theo dự án", chuyển sang tab dự án, quay lại: trục giữ "Theo dự án"
[2] [Yes] CHK-bao-cao-hieu-qua-du-an-167 → FR-bao-cao-hieu-qua-du-an-003 · Chọn lọc sức khoẻ "Theo dõi", chuyển sang tab dự án, quay lại: lọc giữ "Theo dõi"
[1] [Yes] CHK-bao-cao-hieu-qua-du-an-168 → FR-bao-cao-hieu-qua-du-an-003 · Đổi chỉ tiêu sang Chi phí ở tab "Tổng quan dự án", quay lại tab tổng quan: nút gạt chỉ tiêu của biểu đồ đang ở Chi phí
