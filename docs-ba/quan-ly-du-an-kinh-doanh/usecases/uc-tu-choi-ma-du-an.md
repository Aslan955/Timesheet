# Use Case: GĐK từ chối mã dự án

> Scope: MH-02c — nút "Từ chối mã" · Level: User goal

## Primary Actor

GĐK (Giám đốc khối).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| AM / SM đã gửi yêu cầu | Biết lý do bị từ chối để sửa và gửi lại |

## Trigger

GĐK bấm "Từ chối mã" trên chi tiết dự án "Chờ duyệt mã".

## Preconditions

- Dự án ở trạng thái "Chờ duyệt mã"; người dùng là GĐK của khối dự án (BR-quan-ly-du-an-kinh-doanh-053).

## Guarantees

- __Minimal Guarantee:__ Huỷ, thiếu lý do hoặc trạng thái đã đổi → dự án giữ "Chờ duyệt mã".
- __Success Guarantee:__ Dự án "Từ chối mã", lý do được lưu và hiện trong lịch sử "Từ chối mã"; dự án vẫn chưa có mã, chưa có hạn PAKD.

## Main Success Scenario

1. GĐK bấm "Từ chối mã".
2. Hệ thống mở hộp "Từ chối mã dự án" với ô lý do (bắt buộc).
3. GĐK nhập lý do và xác nhận.
4. Hệ thống kiểm lại trạng thái, đặt dự án "Từ chối mã", lưu lý do.
5. Hệ thống ghi lịch sử "Từ chối mã" với ghi chú là lý do và hiện thông báo "Đã từ chối mã dự án {tên}".

## Extensions

__3a. Lý do trống hoặc chỉ khoảng trắng:__
- 3a1. Hệ thống tô đỏ ô lý do kèm "Vui lòng nhập lý do từ chối.", không từ chối (E-quan-ly-du-an-kinh-doanh-028); quay lại bước 3.

__3b. GĐK huỷ:__
- 3b1. Đóng hộp, không đổi gì.

__4a. Trạng thái dự án đã đổi:__
- 4a1. Hệ thống báo E-quan-ly-du-an-kinh-doanh-030 (nạp lại dự án, giữ lý do đang nhập), không thực hiện.

__5a. Sau khi từ chối:__
- 5a1. Người tạo dự án / SM của dự án sửa rồi gửi lại → UC-gui-lai-yeu-cau-mo-ma; hoặc GĐK xoá → UC-xoa-du-an.

__4b. Hệ thống không ghi được trọn vẹn:__
- 4b1. Báo E-quan-ly-du-an-kinh-doanh-037; dự án giữ "Chờ duyệt mã"; hộp lý do giữ nội dung đã nhập.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-041 · BR-quan-ly-du-an-kinh-doanh-009, -042 · E-quan-ly-du-an-kinh-doanh-028, -030 · BR-quan-ly-du-an-kinh-doanh-050 · E-quan-ly-du-an-kinh-doanh-037, -040 · BR-quan-ly-du-an-kinh-doanh-053 · (Đã chốt Phase H — Q-40, Q-19.)
