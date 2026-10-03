# Use Case: Kế toán mở lại dự án Pending

> Scope: MH-02c — nút "Mở lại dự án" trên dòng thông báo bước hiện tại · Level: User goal

## Primary Actor

Kế toán (CFO).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| SM / GĐK | Có thêm 30 ngày để có PAKD được duyệt |

## Trigger

Kế toán mở dự án Pending (link "Mở lại" trên danh sách chỉ mở chi tiết) và bấm "Mở lại dự án".

## Preconditions

- Dự án "Pending"; người dùng là Kế toán.

## Guarantees

- __Minimal Guarantee:__ Vai trò khác chỉ thấy dải xám "Đang chờ Kế toán (CFO) mở lại dự án Pending (quá hạn PAKD {ngày})."; không đổi gì.
- __Success Guarantee:__ Dự án về "PAKD chờ duyệt" (nếu bản PAKD mới nhất đang chờ Kế toán) hoặc "Chưa có PAKD"; hạn lập PAKD mới = hôm nay + 30; xoá ngày đóng; lịch sử "Mở lại dự án".

## Main Success Scenario

1. Hệ thống hiện dòng thông báo "Dự án Pending: quá 30 ngày (hạn {ngày}) … Kế toán mở lại để có thêm 30 ngày…" và nút "Mở lại dự án".
2. Kế toán bấm "Mở lại dự án" (không hỏi xác nhận).
3. Hệ thống kiểm lại trạng thái, đặt trạng thái theo bản PAKD mới nhất, hạn mới = hôm nay + 30, xoá ngày đóng.
4. Hệ thống ghi lịch sử "Mở lại dự án" — "Hạn PAKD mới: {dd/mm/yyyy}"; thông báo "Đã mở lại dự án {mã} — hạn lập PAKD {dd/mm/yyyy}".

## Extensions

__1a. Đang có bản PAKD chờ Kế toán:__
- 1a1. Dòng thông báo thêm ", hoặc duyệt PAKD đang chờ" và nút "Duyệt / Từ chối PAKD" (popup thuộc feature `phuong-an-kinh-doanh`).
- 1a2. Kế toán duyệt → dự án "Đang thực hiện" (xoá ngày đóng); từ chối → dự án giữ "Pending".

__3a. Bản PAKD mới nhất đang chờ Kế toán:__
- 3a1. Trạng thái "PAKD chờ duyệt"; ngược lại "Chưa có PAKD".

__3b. Trạng thái đã đổi:__
- 3b1. Báo E-quan-ly-du-an-kinh-doanh-030, không thực hiện.

__3c. Hệ thống không ghi được trọn vẹn:__
- 3c1. Báo E-quan-ly-du-an-kinh-doanh-037; dự án giữ "Pending".

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-037, -038 · BR-quan-ly-du-an-kinh-doanh-005, -012, -035, -041 · E-quan-ly-du-an-kinh-doanh-023, -030 · E-quan-ly-du-an-kinh-doanh-037 · NFR-quan-ly-du-an-kinh-doanh-014.
