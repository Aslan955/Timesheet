# Use Case: Xem Sổ theo dõi & danh sách dự án, lọc, xuất Excel

> Scope: MH-02a "Danh sách dự án" · Level: User goal

## Primary Actor

AM, SM, GĐK, Kế toán (phạm vi xem khác nhau theo vai trò).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Lãnh đạo khối (GĐK), Kế toán | Thấy ngay khoảng cách giữa giá trị HĐ ký / dự kiến ký với mục tiêu năm của từng khối |
| AM | Theo dõi dự án mình phụ trách mà không thấy số liệu PAKD mật |

## Trigger

Người dùng mở menu "Danh sách dự án" (Quản trị dự án & Tài chính).

## Preconditions

- Người dùng có một trong 4 vai trò AM / SM / GĐK / Kế toán (mỗi tài khoản một vai trò); GĐK / SM / AM được gắn khối.

## Guarantees

- __Minimal Guarantee:__ Không thay đổi dữ liệu dự án; dự án đã xoá không bao giờ hiện.
- __Success Guarantee:__ Người dùng thấy danh sách dự án đã lọc đúng 4 bộ lọc, (trừ AM) thấy Sổ theo dõi đúng Năm + Khối; GĐK / SM / AM chỉ thấy dự án khối của mình (BR-quan-ly-du-an-kinh-doanh-053); file Excel (nếu xuất) chứa đúng các dòng đang lọc và đúng phạm vi cột của vai trò.

## Main Success Scenario

1. Hệ thống hiển thị tiêu đề "Sổ theo dõi dự án", Sổ theo dõi (ô ①, bảng ② có cột "Chờ duyệt PAKD") theo năm hiện tại và bảng dự án năm hiện tại.
2. Người dùng chọn Năm, Khối (GĐK / SM / AM: chỉ khối của mình), gõ Tìm kiếm (không phân biệt dấu), chọn Trạng thái.
3. Hệ thống lọc danh sách theo Năm, Khối, Tìm kiếm (cập nhật số đếm từng trạng thái) rồi theo Trạng thái; Sổ theo dõi tính lại theo Năm + Khối.
4. Hệ thống hiển thị bảng, dòng "Tổng cộng (n dự án)" và chân khung "{n} / {N} dự án …".
5. Người dùng bấm "Xuất Excel".
6. Hệ thống tải file `du-an-kinh-doanh.xlsx` (sheet `DuAn`) gồm các dòng đang lọc và ghi nhận lần xuất để tra soát (NFR-quan-ly-du-an-kinh-doanh-016).
7. Người dùng bấm vào một dòng; hệ thống mở chi tiết dự án (MH-02c).

## Extensions

__1a. Vai trò là AM:__
- 1a1. Hệ thống ẩn toàn bộ Sổ theo dõi (ô ①, bảng ②, nút Đặt mục tiêu) và 3 cột Hạn lập PAKD / Phiên bản PAKD / Giá trị hợp đồng dự kiến.
- 1a2. File Xuất Excel ở bước 6 cũng không có 3 cột này.

__3a. Bộ lọc không ra dòng nào:__
- 3a1. Hệ thống hiện "Không có dự án phù hợp." và ẩn dòng tổng (E-quan-ly-du-an-kinh-doanh-022).

__4a. Dự án đã qua tháng dự kiến ký mà chưa có hợp đồng:__
- 4a1. Dưới Tên dự án hiện chữ đỏ "Quá tháng dự kiến ký MM/YYYY" (mọi vai trò, kể cả AM) (Đã chốt Phase H — Q-53).

__7a. Người dùng bấm link Thao tác "Duyệt" / "Duyệt điều chỉnh" (Kế toán):__
- 7a1. Hệ thống mở popup duyệt PAKD ngay trên danh sách (feature `phuong-an-kinh-doanh`).

__7b. Người dùng bấm ô Tệp hoặc "Đã ký / Chưa ký":__
- 7b1. Hệ thống mở P-03 (UC-cap-nhat-ky-hop-dong); AM ở chế độ chỉ xem.

__7c. Người dùng bấm link Thao tác khác (kể cả "Gửi lại", "Mở lại"):__
- 7c1. Hệ thống mở MH-02c như bước 7.

__7d. Mở trực tiếp dự án khối khác (GĐK / SM / AM):__
- 7d1. Hệ thống từ chối, báo "Bạn không có quyền thực hiện thao tác này." (E-quan-ly-du-an-kinh-doanh-030).

__6a. Bộ lọc ra 0 dòng:__
- 6a1. Nút "Xuất Excel" mờ, rê chuột hiện "Không có dòng để xuất"; không xuất tệp (BR-quan-ly-du-an-kinh-doanh-016 — Phase H Q-57).

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-001, -002, -003, -005 → -010, -046, -047 · BR-quan-ly-du-an-kinh-doanh-015 → -021, -023 → -025, -040, -043, -045, -046, -053 · E-quan-ly-du-an-kinh-doanh-022, -030 · NFR-quan-ly-du-an-kinh-doanh-008, -010 · NFR-quan-ly-du-an-kinh-doanh-016.
