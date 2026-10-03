# Use Case: Xem PAKD và chỉ số của dự án

> Scope: Màn Chi tiết dự án (MH-02c) — khung PAKD; danh sách dự án (MH-02a) — cột PAKD · Level: user goal

## Primary Actor

SM, GĐK hoặc Kế toán (CFO). AM là actor bị chặn.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| SM / GĐK | Theo dõi PAKD mình lập, hạn lập, trạng thái duyệt |
| Kế toán (CFO) | Xem đủ PAKD để duyệt |
| AM | Không được thấy số liệu PAKD (thông tin mật nội bộ) |

## Trigger

Người dùng mở màn chi tiết dự án đã có mã (trạng thái khác "Chờ duyệt mã"), tab "Thông tin dự án"; hoặc mở danh sách dự án.

## Preconditions

- Dự án đã được cấp mã.
- Người dùng đã đăng nhập với một vai trò (cơ chế tài khoản chờ OQ-5).

## Guarantees

- __Minimal Guarantee:__ không thay đổi dữ liệu nào; người không đủ quyền không thấy nội dung PAKD.
- __Success Guarantee:__ người dùng thấy hàng thông tin đầu khung, nhãn trạng thái PAKD, 3 chỉ số, biểu đồ, tóm tắt chi phí và các mục nội dung theo tình trạng; chỉ nhập được khi đủ quyền.

## Main Success Scenario

1. Người dùng mở chi tiết dự án.
2. Hệ thống kiểm vai trò: SM / GĐK / Kế toán → hiện khung PAKD; meta đầu trang hiện "PAKD: V{n}, {trạng thái}" của phiên bản hiển thị, hoặc "—".
3. Hệ thống nạp nội dung PAKD: bản điều chỉnh (dự án Đang thực hiện có bản điều chỉnh) → PAKD đã lưu → form trống điền sẵn.
4. Hệ thống hiển thị hàng thông tin: Người lập, Hạn lập PAKD, Thời gian còn lại, Trạng thái PAKD.
5. Hệ thống tính và hiển thị Doanh thu kế hoạch, Lợi nhuận, Biên lợi nhuận với nhãn "▲ Đạt" / "! Dưới khung" theo ngưỡng 20%.
6. Hệ thống vẽ biểu đồ dòng tiền (Đã ký: luỹ kế dòng tiền; Chưa ký: dòng tiền chi theo tháng) và tóm tắt chi phí.
7. Hệ thống hiển thị các mục nội dung theo tình trạng (Đã ký: Mục 1–4; Chưa ký: Mục 1 + Mốc kế hoạch) và mục "Kế hoạch cập nhật thông tin hợp đồng", ở chế độ nhập hoặc chỉ xem theo quyền.
8. Hệ thống hiện chân khung: dòng hướng dẫn theo tình huống + "Lưu lần cuối dd/mm/yyyy bởi {người}".

## Extensions

__2a. Người dùng vai trò AM:__
- 2a1. Hệ thống thay khung bằng dòng 🔒 "PAKD của dự án chỉ hiển thị với Giám đốc kinh doanh (SM), Giám đốc khối và Kế toán duyệt."; meta không có mục "PAKD". Nếu dự án quá tháng dự kiến ký, dòng thông báo bước vẫn hiện chữ đỏ "Quá tháng dự kiến ký MM/YYYY" (không có số tiền — FR-phuong-an-kinh-doanh-040; Phase H — Q-53).
- 2a2. Use case kết thúc.

__2b. Dự án "Chờ duyệt mã" hoặc đang ở tab "Lịch sử":__
- 2b1. Hệ thống không hiện khung PAKD. Use case kết thúc.

__2c. Người không đủ quyền (kể cả SM / GĐK mở dự án khối khác — Phase H Q-19) cố truy cập nội dung PAKD bằng đường khác:__
- 2c1. Hệ thống từ chối "Bạn không có quyền thực hiện thao tác này." (E-phuong-an-kinh-doanh-018), không trả nội dung.

__4a. Dự án bị từ chối PAKD lần đầu, đang làm lại:__
- 4a1. Thời gian còn lại đếm tiếp "Còn n ngày" / "Quá hạn n ngày" (không hiện "Đã nộp").

__8a. Dự án đã Kết thúc:__
- 8a1. Chân khung hiện "Dự án đã kết thúc — PAKD chỉ xem." (BR-phuong-an-kinh-doanh-040; Phase H — Q-60).

__5a. Chưa có doanh thu:__
- 5a1. Biên lợi nhuận hiện "—", không nhãn.

__6a. Chưa có tháng nào có số:__
- 6a1. Biểu đồ hiện thông báo trống theo tình trạng.

__7a. Đã ký, lệch giá trị hợp đồng quá 2%:__
- 7a1. Hệ thống hiện cảnh báo "— đang lệch {z%}" (E-phuong-an-kinh-doanh-015), không chặn.

__7b. Có chi phí ngoài kỳ / chưa có kỳ / giai đoạn thiếu hoặc sai Từ–Đến:__
- 7b1. Hệ thống hiện cảnh báo cam E-phuong-an-kinh-doanh-013 / E-phuong-an-kinh-doanh-014 / E-phuong-an-kinh-doanh-017.

__\*a. Xem ở danh sách dự án:__
- \*a1. SM / GĐK (chỉ dự án khối mình) / Kế toán (mọi khối) thấy cột "Hạn lập PAKD", "Phiên bản PAKD", "Giá trị hợp đồng dự kiến" (dự án chưa có PAKD được duyệt hiện "—").
- \*a2. AM không thấy 3 cột này, kể cả trong file Xuất Excel; mọi vai trò (kể cả AM) thấy chữ đỏ "Quá tháng dự kiến ký MM/YYYY" dưới tên dự án khi đã qua tháng dự kiến ký mà chưa có hợp đồng (FR-phuong-an-kinh-doanh-040).
- \*a3. Cột "Hạn lập PAKD": dự án bị từ chối PAKD lần đầu hiện "Làm lại V{n}" kèm "Còn n ngày / Quá hạn n ngày" và dòng phụ "V{n} bị từ chối dd/mm/yyyy"; dự án Đang thực hiện có bản điều chỉnh bị từ chối chưa huỷ hiện "Điều chỉnh bị từ chối dd/mm/yyyy" (FR-phuong-an-kinh-doanh-034; Phase H — Q-52).

__\*b. Bản điều chỉnh bị từ chối đã bị huỷ:__
- \*b1. Cột "Phiên bản PAKD" / meta hiện bản đang áp dụng ("V{n}, đã duyệt"); cột "Hạn lập PAKD" hiện "Duyệt" + ngày duyệt của bản đó.

__\*c. Người khác thay đổi dự án trong lúc người dùng đang xem (vd lưu P-03, Kế toán quyết định):__
- \*c1. Khung tự nạp lại theo dữ liệu mới và hiện "Dữ liệu dự án vừa thay đổi — khung PAKD đã được tải lại." (E-phuong-an-kinh-doanh-024; FR-phuong-an-kinh-doanh-003, Phase H — Q-38).

## Related Requirements

FR-phuong-an-kinh-doanh-001…FR-phuong-an-kinh-doanh-010, FR-phuong-an-kinh-doanh-018, FR-phuong-an-kinh-doanh-033, FR-phuong-an-kinh-doanh-034, FR-phuong-an-kinh-doanh-036, FR-phuong-an-kinh-doanh-040, FR-phuong-an-kinh-doanh-044 · BR-phuong-an-kinh-doanh-001, BR-phuong-an-kinh-doanh-005…BR-phuong-an-kinh-doanh-019, BR-phuong-an-kinh-doanh-040, BR-phuong-an-kinh-doanh-042 · E-phuong-an-kinh-doanh-013…E-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-024 · NFR-phuong-an-kinh-doanh-001, NFR-phuong-an-kinh-doanh-002, NFR-phuong-an-kinh-doanh-005, NFR-phuong-an-kinh-doanh-007
