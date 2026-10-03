# Use Case: Kết thúc dự án

> Scope: MH-02c — nút "Kết thúc dự án" trên dòng thông báo bước hiện tại · Level: User goal

## Primary Actor

GĐK, Kế toán.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Kế toán | Dự án đóng đúng lúc, không còn phát sinh chỉnh sửa |

## Trigger

Người dùng bấm "Kết thúc dự án".

## Preconditions

- Dự án "Đang thực hiện" và không có bản điều chỉnh PAKD đang chờ Kế toán duyệt; người dùng là GĐK của khối dự án (BR-quan-ly-du-an-kinh-doanh-053) / Kế toán.

## Guarantees

- __Minimal Guarantee:__ Huỷ xác nhận hoặc trạng thái đã đổi → không đổi.
- __Success Guarantee:__ Dự án "Kết thúc", lịch sử "Kết thúc dự án"; bản điều chỉnh PAKD nháp / bị từ chối (nếu có) bị huỷ (vẫn được lưu lại) kèm lịch sử "Huỷ bản điều chỉnh PAKD (Kết thúc dự án)"; version không đổi; không còn sửa thông tin cơ bản, không thao tác mã outsource.

## Main Success Scenario

1. Hệ thống hiện nút "Kết thúc dự án" (GĐK: cạnh "Sửa PAKD"; Kế toán: nút này).
2. Người dùng bấm, hệ thống hỏi "Kết thúc dự án "{tên}"?".
3. Người dùng đồng ý.
4. Hệ thống kiểm lại trạng thái, chuyển "Kết thúc", ghi lịch sử, thông báo "Đã kết thúc dự án".

## Extensions

__1a. Đang có bản điều chỉnh PAKD chờ duyệt:__
- 1a1. Không có nút (Kế toán thấy nút duyệt điều chỉnh, vai trò khác thấy dải chờ).

__2a. Dự án còn bản điều chỉnh PAKD nháp hoặc bị từ chối (chưa huỷ):__
- 2a1. Hộp xác nhận có thêm câu "Dự án còn bản điều chỉnh PAKD chưa gửi — bản này sẽ bị huỷ."; đồng ý thì ở bước 4 hệ thống tự huỷ bản đó (giữ PAKD đang áp dụng) và ghi lịch sử "Huỷ bản điều chỉnh PAKD (Kết thúc dự án)" (Đã chốt Phase H — Q-23).

__3a. Huỷ xác nhận:__
- 3a1. Không đổi (E-quan-ly-du-an-kinh-doanh-025).

__4a. Trạng thái đã đổi:__
- 4a1. Báo E-quan-ly-du-an-kinh-doanh-030 (nạp lại dự án), không thực hiện.

__4b. Sau khi Kết thúc, cần tiếp tục dự án:__
- 4b1. Kế toán mở lại → UC-mo-lai-du-an-ket-thuc.

__4c. Hệ thống không ghi được trọn vẹn:__
- 4c1. Báo E-quan-ly-du-an-kinh-doanh-037; dự án giữ "Đang thực hiện".

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-035 · BR-quan-ly-du-an-kinh-doanh-013, -041 · E-quan-ly-du-an-kinh-doanh-025, -030 · E-quan-ly-du-an-kinh-doanh-037 · NFR-quan-ly-du-an-kinh-doanh-011, -014 · `phuong-an-kinh-doanh` FR-phuong-an-kinh-doanh-047.
