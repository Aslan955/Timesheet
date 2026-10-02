# Yêu cầu review: Danh sách dự án

## Tóm tắt
SRS đặc tả màn **Danh sách dự án** (module Quản trị dự án & Tài chính). Màn có 3 khu vực chính:
- **Sổ theo dõi dự án:** giá trị HĐ đã ký / chưa ký so với mục tiêu chính thức của từng khối.
- **Bảng danh sách dự án:** tra cứu, lọc, xuất Excel, theo dõi hạn và phiên bản PAKD.
- **Thao tác theo vai trò:** cấp mã dự án, CFO duyệt PAKD, cập nhật ký hợp đồng.

Phạm vi lần này gồm màn danh sách và 2 popup mở từ danh sách. Form cấp mã và Chi tiết dự án sẽ có SRS riêng.

## Sản phẩm bàn giao
- **SRS:** `docs/srs/SRS_DanhSachDuAn.md` (v01, 2026-10-02). Gồm 15 User Story, 55 AC, 33 BR, 6 bảng dữ liệu, 4 sơ đồ Mermaid.
- **Prototype:** ứng dụng React đã có sẵn. Chạy `npm run dev` trong `Timesheet/`, rồi vào menu *Quản trị dự án & Tài chính → Danh sách dự án*.
  - **Lưu ý:** prototype **chưa được sửa** theo SRS. 14 điểm lệch được liệt kê trong `03-prototype-gaps.md`.
- **Đối soát:** `docs/plans/danh-sach-du-an/03-prototype-gaps.md`. Truy vết đủ 55/55 AC: 27 khớp, 16 lệch, 12 chưa có.
- **Bối cảnh:** `01-design-brief.md`, `02-plan.md` (22 quyết định D1–D22 đã chốt với BA).

## Kết quả checklist tiền-review
| Nhóm | Kết quả |
|---|---|
| Đầy đủ theo template v04 mục 1–5 | ✅ Đạt. Có Version control, không còn `[AI INSTRUCTION]` / TODO / phần trống |
| Sơ đồ Mermaid | ✅ 4/4 render được bằng mermaid-cli, không dùng ngoặc tròn hay Markdown trong sơ đồ |
| User Story / AC / BR đánh số liền mạch | ✅ Đã kiểm tra bằng script. Mọi BR được AC tham chiếu đều có định nghĩa |
| Data Dictionary `snake_case`, PK / FK | ✅ Khớp 100% với ERD ở mục 1, đã kiểm tra chéo bằng script |
| Truy vết AC ↔ prototype | ✅ 55/55 AC có thành phần tương ứng hoặc được ghi rõ là "chưa có" |
| Prototype HTML / `index.html` | ➖ Không áp dụng: prototype là ứng dụng React có sẵn, không dựng HTML mới (đã thống nhất trong kế hoạch) |
| Mục lục, thuật ngữ thống nhất | ✅ Đã thêm mục lục. GĐK = HOD được định nghĩa ở mục 1 |
| Trường hợp biên | ✅ Đã bổ sung trường hợp CFO duyệt đúng lúc dự án chuyển Pending (BR6, BR10) |

## Điểm cần reviewer chú ý
1. **Quy trình PAKD chỉ CFO duyệt:** không có bước BOD duyệt (D7). BOD chỉ xem.
2. **Phiên bản PAKD (BR7):**
   - CFO từ chối thì sửa và nộp lại trên **cùng phiên bản**.
   - Phiên bản mới chỉ sinh khi điều chỉnh PAKD đã duyệt, lúc dự án đang thực hiện. Trong lúc chờ, phiên bản cũ vẫn có hiệu lực.
   - Prototype hiện làm khác: tạo phiên bản mới ở mỗi lần nộp lại.
3. **Trạng thái mới Pending (BR8):** tính từ ngày cấp mã, quá 30 ngày mà PAKD chưa được duyệt thì dự án chuyển Pending, kể cả khi PAKD đã nộp và đang chờ CFO.
   - Đây là thay đổi lớn so với prototype. Prototype chỉ tự đóng dự án chưa từng nộp PAKD.
   - Chỉ CFO / Admin mở lại được. Hạn mới tính 30 ngày từ ngày mở lại.
4. **Close = dự án kết thúc** và vẫn mở lại được (BR9, BR11). Ở Pending và Close, không ai sửa được gì (BR10).
5. **Phạm vi xem theo vai trò (BR2–BR4):**
   - AM / SM chỉ xem dự án mình tạo hoặc được assign. AM không thấy PAKD.
   - Sổ theo dõi ẩn với AM / SM.
6. **Sổ theo dõi chỉ tính hợp đồng đã nhập (BR16–BR18).** Công thức ô tổng được thống nhất với bảng theo khối. Prototype đang có hai cách tính khác nhau.
7. **Một nguồn mục tiêu (BR15):** không nhập mục tiêu ở Sổ theo dõi. Mục tiêu lấy từ hồ sơ Mục tiêu kinh doanh đã duyệt. Phụ thuộc `SRS_MucTieuKinhDoanh.md` (BR27–BR28).

## Giả định do người viết đặt, BA đã chấp nhận, cần reviewer xác nhận
- **Bảng `biz_project_member`:** lưu người được assign vào dự án (AM, SM, PM KD, PM SX, GĐKD), để xác định phạm vi xem.
- **Mã enum:** mã trạng thái (`waiting_code`, `no_pakd`, `pakd_pending`, `in_progress`, `pending`, `closed`) và tình trạng PAKD (`drafting`, `pending_cfo`, `approved`, `rejected`).
- **Màu nhãn trạng thái:** Pending màu cam, Close màu xám đậm.
- **Người nhiều vai trò:** được hợp quyền của các vai trò (BR1).
- **Năm của dự án trên danh sách (BR20):** lấy năm ký trên hợp đồng → năm dự kiến ký → năm tạo dự án.

## Câu hỏi đã được BA chốt trước khi gửi
1. Dữ liệu cũ *Kết thúc* và *Đóng* đều chuyển thành **Close** (BR33).
2. Tác vụ Pending chạy **00:00 hằng ngày**, tính theo ngày. Dự án có hạn ngày D chuyển Pending lúc 00:00 ngày D + 1 (BR8).
3. Cần **email nhắc khi sắp hết hạn PAKD** (BR32): gửi khi **còn 3 ngày**, người nhận là **GĐK và SM** của dự án, mỗi hạn nhắc 1 lần. Email báo CFO khi có PAKD chờ duyệt đã có sẵn trong hệ thống.
4. Chỉ **kết thúc dự án** khi PAKD điều chỉnh đã qua CFO duyệt. Còn phiên bản chờ CFO thì chưa được kết thúc (BR11).
5. File Excel thêm **Mã KD, Mã SX, Ngày cấp mã** (BR24).

## Câu hỏi mở cần reviewer xác nhận
Không còn câu hỏi mở. Mọi điểm chưa chắc đã được BA chốt trước khi gửi.

## Phần KHÔNG nằm trong lần review này
- SRS **Form cấp mã dự án** và SRS **Chi tiết dự án**: giai đoạn KH01–KH05, thao tác lập / sửa / điều chỉnh PAKD, số liệu theo tháng, đính kèm, lịch sử.
- Việc **sửa prototype** theo `03-prototype-gaps.md`.
- Mục 6–8 của template v04 (Validation, Edge Cases, UI Component Mapping): tạm thời không làm.
