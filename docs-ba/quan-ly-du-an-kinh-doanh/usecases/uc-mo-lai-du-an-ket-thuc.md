# Use Case: Kế toán mở lại dự án Kết thúc

> Scope: MH-02c — dự án "Kết thúc" · Level: User goal

## Primary Actor

Kế toán (CFO).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| GĐK / SM | Tiếp tục xử lý dự án đã kết thúc nhầm hoặc phát sinh thêm |

## Trigger

Kế toán bấm nút "Mở lại dự án" trên dòng thông báo bước của dự án "Kết thúc" (từ danh sách: link "Mở lại" mở chi tiết dự án).

## Preconditions

- Dự án "Kết thúc"; người dùng là Kế toán.

## Guarantees

- __Minimal Guarantee:__ Huỷ, thiếu lý do, trạng thái đã đổi hoặc không có quyền → không thực hiện, dự án giữ "Kết thúc".
- __Success Guarantee:__ Dự án về "Đang thực hiện", lịch sử "Mở lại dự án (từ Kết thúc)" ghi chú lý do; version không đổi; sửa thông tin cơ bản và thao tác mã outsource hoạt động lại.

## Main Success Scenario

1. Hệ thống hiển thị dòng thông báo bước kèm nút "Mở lại dự án" cho Kế toán trên dự án "Kết thúc".
2. Kế toán bấm "Mở lại dự án"; hệ thống mở hộp xác nhận kèm ô lý do bắt buộc.
3. Kế toán nhập lý do và xác nhận; hệ thống kiểm lại trạng thái, đặt dự án "Đang thực hiện".
4. Hệ thống ghi lịch sử "Mở lại dự án (từ Kết thúc)" ghi chú lý do và hiện thông báo "Đã mở lại dự án {mã}".

## Extensions

__3a. Trạng thái đã đổi:__
- 3a1. Báo E-quan-ly-du-an-kinh-doanh-030 (nạp lại dự án), không thực hiện.

__3c. Lý do trống hoặc chỉ khoảng trắng:__
- 3c1. Ô lý do viền đỏ "Vui lòng nhập lý do mở lại." (E-quan-ly-du-an-kinh-doanh-042), không mở lại; quay lại bước 3.

__3d. Kế toán huỷ:__
- 3d1. Đóng hộp, không đổi gì.

__1a. Người dùng không phải Kế toán:__
- 1a1. Không có dòng thông báo, không có nút / link mở lại; dự án chỉ xem.

__3b. Hệ thống không ghi được trọn vẹn:__
- 3b1. Báo E-quan-ly-du-an-kinh-doanh-037; dự án giữ "Kết thúc"; hộp giữ lý do đã nhập.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-043 · BR-quan-ly-du-an-kinh-doanh-023, -041, -044, -050 · E-quan-ly-du-an-kinh-doanh-030 · E-quan-ly-du-an-kinh-doanh-037, -042 · NFR-quan-ly-du-an-kinh-doanh-014 · (Đã chốt Phase H — Q-41.)
