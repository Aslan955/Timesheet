# Design Brief: Báo cáo hiệu quả dự án

> Brief này được **dựng ngược từ prototype**, chưa qua phiên refinement. Các file nguồn:
> - `src/components/BizReportPage.tsx`: màn chính, 2 tab.
> - `src/business/bizReport.ts`: công thức tính, mức sức khoẻ.
> - `src/components/LedgerImportModal.tsx`: popup import sổ kế toán.
> - `src/components/LedgerDetailModal.tsx`: popup xem chi tiết sổ kế toán.
> - `src/business/BusinessProjectContext.tsx`: dữ liệu dự án, sổ kế toán, chốt số.
>
> Các mục đánh dấu ❓ là điểm cần BA chốt (xem mục 7).

## 1. Bối cảnh và vị trí
- **Đường dẫn:** Quản trị dự án & Tài chính → **Báo cáo hiệu quả dự án**. Màn đang hiện trên menu.
- **Mục đích:** so sánh **Kế hoạch** với **Thực tế** của 4 chỉ tiêu (Doanh thu, Chi phí, Dòng tiền thu, Khối lượng công việc) và biên lợi nhuận gộp. Có thể xem cho toàn công ty, cho một khối, hoặc cho từng dự án. Mỗi dự án được xếp **mức sức khoẻ**.
- **Nguồn mẫu:** theo file Excel mẫu "Gửi đội Phát triển", gồm 2 sheet tương ứng 2 tab.
- **Đơn vị:** tiền tính bằng **VNĐ**, KLCV tính bằng **SP**.

## 2. Vai trò (theo prototype)
| Vai trò | Việc làm |
|---|---|
| Người xem báo cáo (BOD, GĐK, Kế toán…) | Lọc kỳ / phạm vi, xem số liệu, xem chi tiết sổ kế toán, xuất chi tiết sổ ra Excel |
| Kế toán | Import sổ kế toán (Dòng tiền thu, Chi thực tế). Prototype ghi cứng người import là `ketoan` |

## 3. Nguồn dữ liệu
| Số liệu | Nguồn trong prototype |
|---|---|
| Kế hoạch: Doanh thu, Chi SX/KD, Dòng tiền thu, KLCV theo tháng | `project.plan`, import ở màn chi tiết dự án (Danh sách dự án → tab Số liệu theo tháng → Kế hoạch) |
| Thực tế: Dòng tiền thu | Sổ tiền gửi ngân hàng, import trên màn này. Mỗi dòng được ghép vào dự án theo Mã công trình (khớp Mã tổng / Mã PAKD / Mã SX) |
| Thực tế: Chi phí (Chi SX + Chi KD) | Sổ chi thực tế, import trên màn này, ghép theo Mã dự án |
| Thực tế: Doanh thu, KLCV | `project.actual`, import ở màn chi tiết dự án (tab Thực tế) |
| Chốt số đến | Tháng mới nhất có số thực tế, tính trên **toàn bộ** dự án |

## 4. Chức năng chính (theo prototype)
**Tab 1: Tổng quan cả khối / công ty**
- **Bộ lọc:** Từ tháng, Đến tháng, Phạm vi xem (Toàn công ty hoặc một trong 6 khối). Mặc định từ tháng 01 của năm chốt số đến tháng chốt số.
- **5 ô số:**
  - Biên LN gộp = (DT − CP) / DT, kèm số kế hoạch và mức chênh tương đối.
  - 4 chỉ tiêu: số to là thực tế, bên dưới là kế hoạch và % hoàn thành. Màu xanh / đỏ theo tốt / xấu. Riêng Chi phí đảo chiều: vượt kế hoạch là xấu.
- **Biểu đồ cột Kế hoạch – Thực tế:** chọn chỉ tiêu, chọn trục Theo tháng hoặc Theo dự án. Tooltip ghi % hoàn thành. Tháng sau kỳ chốt số không có cột thực tế.
- **Bảng Chi tiết theo dự án:**
  - Cột: Mã dự án, Start, End, Sức khoẻ, rồi KH / TT / Chênh lệch % cho từng chỉ tiêu, kèm dòng Tổng cộng.
  - Lọc theo mức sức khoẻ, có số đếm từng mức.
  - Bấm một dòng thì chuyển sang tab Tổng quan dự án.
- **Định nghĩa mức sức khoẻ:**
  - Tốt: DT ≥ 95% KH, CP ≤ 100% KH và Dòng tiền thu ≥ 95% KH.
  - Cần chú ý: DT ≤ 85% KH, hoặc CP ≥ 130% KH, hoặc Dòng tiền thu ≤ 65% KH.
  - Theo dõi: các trường hợp còn lại.
  - Chưa phát sinh: chưa có số thực tế trong kỳ.
  - KLCV chưa tham gia xếp mức.
- **Kỳ so sánh:** từ "Từ tháng" đến tháng nhỏ hơn giữa "Đến tháng" và "Chốt số đến". Kế hoạch chỉ được cộng tới tháng chốt số để so cùng kỳ với thực tế.

**Tab 2: Tổng quan dự án**
- **Chọn:** dự án (gom theo khối) và chỉ tiêu.
- **Thông tin dự án:** Khối, Tên, Mã, Chỉ tiêu, Start, End.
- **5 ô số:**
  - Tổng KH cả vòng đời dự án.
  - Luỹ kế KH đến kỳ chốt.
  - Luỹ kế TT đến kỳ chốt.
  - Còn lại theo KH = Tổng KH − Luỹ kế KH.
  - Mức thực hiện luỹ kế = Luỹ kế TT / Luỹ kế KH, kèm nhãn Đạt / Chưa đạt / Vượt KH.
- **Biểu đồ theo tháng.**
- **Bảng từng tháng:** Tháng, KH, TT, Chênh lệch, +/- %, Luỹ kế KH, Luỹ kế TT, % luỹ kế. Tháng chốt số có nhãn "Chốt số". Tháng sau kỳ chốt có nền xám.

**Xem chi tiết sổ kế toán (popup)**
- **Mở từ đâu:** bấm vào con số thực tế của **Chi phí** hoặc **Dòng tiền thu** ở ô số, bảng hoặc dòng tổng.
- **Nội dung:** liệt kê các dòng sổ tạo nên con số đó.
- **Thao tác:** tìm kiếm, ẩn dòng bằng 0, xuất Excel.
- **Cảnh báo:** khi tổng chi tiết khác con số trên báo cáo, popup ghi rõ phần chênh lệch là số đã được import dạng số tổng, không kèm chứng từ.

**Import sổ kế toán (popup, Kế toán)**
- **Luồng 3 bước:** tải file mẫu → chọn file → xem trước và kiểm tra lỗi → Import.
- **Nhận loại file:** tự nhận theo dòng tiêu đề, là *Dòng tiền thu* hoặc *Chi thực tế*.
- **Lỗi** (chặn import): ngày, tháng hoặc số tiền sai định dạng; thiếu mã dự án; file rỗng; sai loại file.
- **Cảnh báo** (vẫn cho import): dòng không có mã công trình; dòng có mã chưa khớp dự án nào. Các dòng này vẫn được lưu vào sổ nhưng không tính vào dự án.
- **Ghi dữ liệu:** dữ liệu các tháng có trong file **thay thế** dữ liệu cũ của cùng loại sổ. Thu / Chi thực tế của các dự án liên quan được tính lại, và lịch sử dự án được ghi lại.

## 5. Phạm vi đề xuất
- **Trong phạm vi:** 2 tab, popup chi tiết sổ kế toán, popup Import sổ kế toán, công thức tính và mức sức khoẻ.
- **Ngoài phạm vi (chỉ tham chiếu):**
  - Import Kế hoạch / Thực tế theo tháng ở màn chi tiết dự án.
  - Các màn Kế hoạch thu chi, Overview, Thông tin tài chính dự án.
  - Mục 6–8 của template v04.

## 6. Phát hiện từ prototype
| # | Vị trí trên màn | Phát hiện |
|---|---|---|
| G1 | Cả màn + nút *Import sổ kế toán* | Chưa có phân quyền. Ai cũng xem được mọi khối và đều bấm được Import. |
| G2 | Thanh tiêu đề: *Chốt số đến* | Chốt số tự lấy tháng mới nhất có thực tế của **bất kỳ** dự án nào, không có thao tác "chốt sổ" chính thức. Chỉ cần một dự án có số của tháng mới là chốt số của cả công ty nhảy theo. |
| G3 | Tab 1: ô *Biên lợi nhuận gộp* | Nhãn dưới ô so sánh mức thay đổi **tương đối** (biên TT / biên KH − 1), không phải chênh lệch điểm %. Chi phí dùng để tính gồm cả Chi SX lẫn Chi KD. |
| G4 | Tab 1: *Định nghĩa mức sức khoẻ* | KLCV chưa tham gia xếp mức ("chờ chốt ngưỡng"). Các ngưỡng đang cố định trong code. |
| G5 | Nguồn số thực tế | Thu / Chi thực tế được ghi từ **hai nơi**: import sổ kế toán trên màn này, và import Thực tế ở màn chi tiết dự án. Lần import sau ghi đè lần trước. |
| G6 | Nguồn số kế hoạch | Màn này lấy kế hoạch từ PAKD của dự án, trong khi màn Overview lấy từ *Kế hoạch thu chi*. Hai báo cáo có thể ra số kế hoạch khác nhau. |
| G7 | Tab 1 và Tab 2 | Chưa có xuất Excel báo cáo, chỉ xuất được popup chi tiết sổ. |
| G8 | Popup Import sổ kế toán | Dòng có mã chưa khớp dự án được lưu nhưng không có nơi nào để xem lại hay ghép sau. |
| G9 | Tab 1: bảng dự án | Lấy mọi dự án, kể cả dự án *Đóng* / *Kết thúc*, và không lọc theo trạng thái. |

## 7. Câu hỏi mở cần BA chốt
1. ❓ **(Cả màn, G1) Phân quyền xem:** ai được xem báo cáo, và mỗi vai trò xem được phạm vi nào? Đề xuất: BOD và Kế toán xem toàn công ty; GĐK chỉ xem khối mình; chỉ Kế toán được Import sổ.
2. ❓ **(Thanh tiêu đề, G2) Chốt số đến:** giữ cách tự lấy tháng mới nhất có số thực tế, hay để Kế toán chốt sổ theo tháng?
3. ❓ **(Popup Import / màn chi tiết dự án, G5) Nguồn số thực tế:** Thu và Chi thực tế chỉ lấy từ sổ kế toán, hay vẫn cho import ở màn chi tiết dự án?
4. ❓ **(Tab 1 và Tab 2, G7) Xuất Excel báo cáo:** có cần thêm không?
5. ❓ **(Phạm vi tài liệu)** Viết 1 SRS cho cả màn (2 tab + 2 popup), hay tách *Import sổ kế toán* thành SRS riêng?
