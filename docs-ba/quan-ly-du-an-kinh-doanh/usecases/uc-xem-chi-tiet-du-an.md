# Use Case: Xem chi tiết dự án & lịch sử

> Scope: MH-02c "Chi tiết dự án" · Level: User goal

## Primary Actor

AM, SM, GĐK, Kế toán.

## Trigger

Người dùng bấm vào dòng hoặc link Thao tác (không phải loại duyệt) trên MH-02a.

## Preconditions

- Dự án tồn tại và chưa bị xoá.

## Guarantees

- __Minimal Guarantee:__ Không thay đổi dữ liệu.
- __Success Guarantee:__ Người dùng thấy đầu trang, dòng thông báo bước hiện tại, khung Mã dự án, Thông tin chi tiết, Hợp đồng & tài liệu, khung PAKD (theo quyền), khối Số liệu theo tháng (tab Thực tế, khi dự án đã có mã) và tab Lịch sử của dự án, đúng phạm vi vai trò và khối.

## Main Success Scenario

1. Hệ thống hiển thị đầu trang: ← Quay lại, nút theo bước của vai trò, Sửa / Xoá (nếu có quyền), meta Version · Trạng thái · PAKD (ẩn với AM) · Cập nhật.
2. Hệ thống hiển thị dòng thông báo bước hiện tại theo trạng thái × vai trò (BR-quan-ly-du-an-kinh-doanh-041).
3. Hệ thống hiển thị khung Mã dự án (mã tổng / KD / SX, mã outsource, tên, PM).
4. Hệ thống hiển thị tab "Thông tin dự án": Thông tin chi tiết, Hợp đồng & tài liệu, khung PAKD (SM / GĐK / Kế toán, khi đã có mã), khối Số liệu dự án theo tháng (tab Thực tế — từ khi dự án có mã, mọi vai trò xem được dự án; FR-quan-ly-du-an-kinh-doanh-044, Phase H Q-44).
5. Người dùng bấm tab "Lịch sử (n)".
6. Hệ thống hiển thị bảng "Lịch sử thay đổi", mới nhất lên đầu.
7. Người dùng bấm ← Quay lại; hệ thống về danh sách.

## Extensions

__2a. Người dùng không phải người thực hiện bước:__
- 2a1. Dải xám "Đang chờ {…}." (E-quan-ly-du-an-kinh-doanh-023).

__4a. Vai trò AM, dự án đã có mã:__
- 4a1. Khung PAKD thay bằng dòng 🔒 (E-quan-ly-du-an-kinh-doanh-026).

__4b. Dự án "Chờ duyệt mã" / "Từ chối mã":__
- 4b1. Không hiện khung PAKD, không hiện khối Số liệu dự án theo tháng.

__1a. GĐK / SM / AM mở dự án thuộc khối khác (vd mở trực tiếp đường dẫn):__
- 1a1. Hệ thống từ chối, báo "Bạn không có quyền thực hiện thao tác này." (E-quan-ly-du-an-kinh-doanh-030, BR-quan-ly-du-an-kinh-doanh-053 — Phase H Q-19).

__6a. Vai trò AM:__
- 6a1. Bảng không hiện các dòng thao tác PAKD; số (n) chỉ đếm các dòng AM được xem.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-019, -020, -021, -024, -026, -027, -040, -044 · BR-quan-ly-du-an-kinh-doanh-030, -036, -038, -041 · E-quan-ly-du-an-kinh-doanh-023, -026 · BR-quan-ly-du-an-kinh-doanh-046, -052, -053 · E-quan-ly-du-an-kinh-doanh-030.
