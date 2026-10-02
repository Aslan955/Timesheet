# Design Brief: Danh sách dự án

> Brief này được **dựng ngược từ prototype**, chưa qua phiên refinement. Nguồn đọc:
> - `src/components/BusinessProjectPage.tsx`: `ProjectList`, `rowAction`, `pakdDeadlineCell`, `PakdDecisionModal`.
> - `src/components/ProjectTracker.tsx`: Sổ theo dõi dự án.
> - `src/components/ContractModal.tsx`: popup cập nhật ký hợp đồng.
> - `src/business/BusinessProjectContext.tsx`: trạng thái, vai trò, quy trình PAKD, tự động đóng.
>
> Các mục ❓ cần BA chốt (xem mục 8).

## 1. Bối cảnh và vị trí
- **Đường dẫn:** Quản trị dự án & Tài chính → **Danh sách dự án**. Tên định tuyến là "Dự án kinh doanh".
- **Mục đích:** nơi tập trung theo dõi mọi dự án kinh doanh: xem tiến độ ký hợp đồng so với mục tiêu khối, tra cứu và lọc dự án, biết dự án đang ở bước nào của quy trình PAKD, và thao tác nhanh theo vai trò (cấp mã, duyệt PAKD, cập nhật hợp đồng).
- **Đơn vị tiền:** VNĐ.
- **Phạm vi màn:** cùng một mục menu có 3 chế độ: **Danh sách** → **Form cấp mã / sửa dự án** → **Chi tiết dự án**. Chi tiết dự án gồm giai đoạn KH01–KH05, quy trình PAKD, hợp đồng, số liệu theo tháng, đính kèm và lịch sử.

## 2. Vai trò (prototype đang cho chọn vai trò ngay trên màn)
| Vai trò | Thao tác trên danh sách |
|---|---|
| AM | Tạo yêu cầu cấp mã dự án, xem |
| GĐK | Tạo dự án và được cấp mã ngay, duyệt mã dự án do AM tạo, lập / nộp PAKD |
| Kế toán (CFO) | Duyệt / từ chối PAKD, mở lại dự án bị đóng |
| PM | Có trong mã nguồn nhưng bị ẩn khỏi ô chọn vai trò |
| Mọi vai trò | Lọc, tìm kiếm, xuất Excel, cập nhật ký hợp đồng |

## 3. Vòng đời dự án (theo prototype)
`Chờ duyệt mã` → (GĐK duyệt, hệ thống cấp mã) → `Chưa có PAKD` → (GĐK nộp PAKD) → `PAKD chờ duyệt` → (CFO duyệt) → `Đang thực hiện` → (kết thúc) → `Kết thúc`.

Các nhánh khác:
- CFO từ chối PAKD → quay về `Chưa có PAKD`, GĐK làm lại phiên bản PAKD tiếp theo.
- Quá **30 ngày** kể từ ngày cấp mã (hoặc ngày mở lại) mà chưa từng nộp PAKD → hệ thống **tự động** chuyển `Đóng`.
- CFO mở lại dự án `Đóng` → quay về `Chưa có PAKD`, hạn PAKD mới là hôm nay + 30 ngày.
- GĐK tạo dự án thì bỏ qua bước `Chờ duyệt mã`.

**Mã dự án:**
- Mã tổng (Master) = `<Mã KH>.<STT 3 chữ số>`.
- Mã KD = Master + `.1`, Mã SX = Master + `.2`.

## 4. Chức năng trên màn Danh sách (theo prototype)
1. **Thanh tiêu đề "Sổ theo dõi dự án":**
   - Bộ lọc **Năm** (Tất cả hoặc từng năm) và **Khối**.
   - Ô chọn **Vai trò**.
   - Nút **Cấp mã dự án**, chỉ hiện cho AM và GĐK.
2. **Khối Sổ theo dõi dự án** (`ProjectTracker`):
   - **Ô tổng:** mục tiêu, giá trị HĐ dự kiến ký, phần còn thiếu, % đạt.
   - **Bảng theo khối:** thanh tiến độ, Giá trị mục tiêu, Đã ký, Chưa ký, Còn thiếu (Mục tiêu − Đã ký − Chưa ký), % Đạt = (Đã ký + Chưa ký) / Mục tiêu.
   - **Nút "Đặt mục tiêu":** nhập tay mục tiêu theo khối.
3. **Bảng Danh sách dự án:**
   - **Tìm kiếm** theo mã, tên, khách hàng, PM.
   - **Lọc** theo Trạng thái và Hợp đồng (Đã ký / Chưa ký). Mỗi lựa chọn có số đếm, tính trên các bộ lọc còn lại.
   - **14 cột chính:** TT, Mã dự án (hoặc "Chờ cấp mã"), Tên dự án + nhãn KEY, Khách hàng, Khối, Loại dự án, Thời điểm dự kiến ký HĐ, Giá trị HĐ dự kiến, PM KD, PM SX, Trạng thái, Hạn lập PAKD, Phiên bản PAKD, Thao tác.
   - **Nhóm cột "Thông tin hợp đồng đã ký":** Giá trị HĐ ký, Số HĐ, Ngày ký, Ngày hết hạn, Tệp, Trạng thái (Đã ký / Chưa ký, bấm vào được).
   - **Dòng tổng:** Giá trị HĐ dự kiến và Giá trị HĐ ký.
   - **Bấm vào dòng:** mở Chi tiết dự án.
4. **Cột "Hạn lập PAKD":** Còn N ngày (vàng khi còn 3 ngày trở xuống) / Hết hạn hôm nay / Quá hạn N ngày (đỏ) / Làm lại V(n+1) / Nộp + ngày nộp / Duyệt + ngày duyệt / Đã đóng + ngày đóng.
5. **Cột "Thao tác":** nút đổi theo trạng thái × vai trò:
   - Duyệt mã (GĐK) / Xem.
   - Lập PAKD.
   - Duyệt (CFO, mở popup duyệt) / Xem.
   - Cập nhật.
   - Mở lại (CFO) / Xem.
6. **Popup Duyệt PAKD:**
   - Tóm tắt: dự án, người nộp / ngày nộp, Doanh thu PAKD, Chi phí kế hoạch, LN gộp kế hoạch (kèm %), số tháng kế hoạch đã import.
   - Ô ý kiến: bắt buộc khi từ chối.
   - Nút Huỷ / Từ chối / Duyệt.
7. **Popup Cập nhật ký hợp đồng:**
   - Trường: Số HĐ, Ngày ký, Giá trị, Thời hạn từ – đến, Lý do lệch, Tệp, Phụ lục (số, ngày ký, nội dung, file).
   - Lý do lệch bắt buộc khi giá trị HĐ khác Doanh thu dự kiến.
8. **Xuất Excel:** xuất danh sách đang lọc, kèm nhóm cột hợp đồng.

**Năm của dự án** (dùng cho bộ lọc Năm): lấy năm ký HĐ. Nếu chưa ký thì lấy năm dự kiến ký HĐ. Nếu chưa có thì lấy năm tạo yêu cầu.

## 5. Quyết định đã có từ SRS Mục tiêu kinh doanh (áp dụng lại)
- Nút "Đặt mục tiêu" ở Sổ theo dõi dự án **không** cho nhập số trực tiếp. Nút mở hồ sơ Mục tiêu kinh doanh của khối / năm tương ứng: GĐK vào tab lập, BOD vào tab duyệt (BR28 SRS_MucTieuKinhDoanh).
- Giá trị mục tiêu của khối = mục tiêu chính thức đã được BOD duyệt (bảng `division_sign_target`).

## 6. Phạm vi đề xuất
- **Trong phạm vi SRS này:** thanh tiêu đề + Sổ theo dõi dự án, bảng Danh sách dự án (lọc, tìm, cột, thao tác theo vai trò, xuất Excel), popup Duyệt PAKD và popup Cập nhật ký hợp đồng mở từ danh sách, vòng đời trạng thái dự án ở mức cần để hiểu danh sách.
- **Ngoài phạm vi:** Form cấp mã / sửa dự án và màn Chi tiết dự án (giai đoạn, quy trình PAKD chi tiết, số liệu theo tháng, đính kèm). Nên viết SRS riêng (xem câu hỏi 1).

## 7. Phát hiện từ prototype (gap)
| # | Vị trí trên màn | Phát hiện |
|---|---|---|
| G1 | Thanh tiêu đề: ô *Vai trò* | Vai trò chọn tay trên màn, người dùng ghi cứng `namnv`. Mọi vai trò thấy mọi khối. |
| G2 | Sổ theo dõi: nút *Đặt mục tiêu* | Đang nhập tay, lệch với quyết định ở SRS Mục tiêu kinh doanh. |
| G3 | Cột *Thao tác* | Nút *Duyệt mã*, *Lập PAKD*, *Mở lại* chỉ mở màn chi tiết, không thao tác ngay trên danh sách. Chỉ *Duyệt* PAKD là mở popup. |
| G4 | Popup Duyệt PAKD | Ghi chú trong popup nói "trả về GĐK lập lại", trong khi toast khi từ chối lại ghi "Kế toán đã từ chối". Vai trò PM bị ẩn nhưng vẫn còn trong mã nguồn. |
| G5 | Cột *Hạn lập PAKD* | Hạn 30 ngày chỉ áp dụng cho lần nộp đầu. Bị từ chối thì không có hạn làm lại. Việc tự đóng chỉ xảy ra với dự án chưa từng nộp PAKD. |
| G6 | Nhóm cột hợp đồng | Dự án đã ký nhưng chưa nhập HĐ thì lấy Doanh thu dự kiến / ngày dự kiến ký làm giá trị / ngày ký. Số hiển thị "giả" như vậy có thể gây hiểu nhầm. |
| G7 | Cột *Trạng thái HĐ* (Đã ký / Chưa ký) | Ai cũng cập nhật được hợp đồng, kể cả dự án `Chờ duyệt mã` hoặc `Đóng`. |
| G8 | Bộ lọc Năm | Năm của dự án đổi theo ngày ký / dự kiến ký. Một dự án có thể "chuyển năm" khi ngày dự kiến ký thay đổi. |
| G9 | Sổ theo dõi khi chọn "Tất cả" năm | Mục tiêu được cộng dồn qua các năm. Cách tính này có ý nghĩa nghiệp vụ không? |

## 8. Câu hỏi mở cần BA chốt
Đã chốt ngày 2026-10-02, xem `02-plan.md` → mục "Quyết định đã chốt" (D1–D6).
