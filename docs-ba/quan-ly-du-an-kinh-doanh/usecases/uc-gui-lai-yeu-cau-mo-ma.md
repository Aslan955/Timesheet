# Use Case: Gửi lại yêu cầu mở mã sau khi bị từ chối

> Scope: MH-02c — dự án "Từ chối mã" · Level: User goal

## Primary Actor

Người tạo dự án hoặc SM (Giám đốc kinh doanh) của dự án.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| GĐK | Nhận lại yêu cầu đã được sửa theo lý do từ chối |

## Trigger

Người tạo dự án / SM của dự án mở chi tiết dự án "Từ chối mã" (từ danh sách: link "Gửi lại") để sửa và gửi lại.

## Preconditions

- Dự án ở trạng thái "Từ chối mã"; người dùng là người tạo dự án hoặc SM của dự án (người khác chỉ thấy "Đang chờ {người tạo} gửi lại yêu cầu mở mã.").

## Guarantees

- __Minimal Guarantee:__ Thiếu thông tin bắt buộc → không gửi lại, dự án giữ "Từ chối mã".
- __Success Guarantee:__ Dự án về "Chờ duyệt mã", lịch sử "Gửi lại yêu cầu mở mã"; GĐK thấy lại nút Duyệt mã / Từ chối mã.

## Main Success Scenario

1. Hệ thống hiển thị dự án "Từ chối mã" (nhãn đỏ) kèm dòng thông báo "Yêu cầu mở mã bị từ chối: “{lý do}” — sửa thông tin rồi bấm Gửi lại yêu cầu mở mã."
2. Người dùng bấm "Sửa", sửa thông tin cơ bản theo lý do (UC-sua-thong-tin-co-ban), lưu.
3. Người dùng bấm "Gửi lại yêu cầu mở mã".
4. Hệ thống kiểm Tên, Khối, Loại, Khách hàng, ngày hợp lệ (BR-quan-ly-du-an-kinh-doanh-026).
5. Hệ thống đặt dự án "Chờ duyệt mã", ghi lịch sử "Gửi lại yêu cầu mở mã" và hiện thông báo "Đã gửi lại yêu cầu mở mã dự án {tên}".

## Extensions

__4a. Thiếu / sai thông tin:__
- 4a1. Dải đỏ "Còn {n} thông tin cần bổ sung: …" (E-quan-ly-du-an-kinh-doanh-006); quay lại bước 2.

__3a. GĐK quyết định không chờ gửi lại:__
- 3a1. GĐK xoá yêu cầu → UC-xoa-du-an.

__5a. Tại lúc gửi lại, dự án không còn "Từ chối mã" (vd GĐK vừa xoá) hoặc vai trò không còn quyền:__
- 5a1. Hệ thống báo E-quan-ly-du-an-kinh-doanh-030 (nạp lại dự án), không thực hiện.

__5b. Hệ thống không ghi được trọn vẹn:__
- 5b1. Báo E-quan-ly-du-an-kinh-doanh-037; dự án giữ "Từ chối mã"; người dùng bấm gửi lại.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-029, -042 · BR-quan-ly-du-an-kinh-doanh-026, -042 · E-quan-ly-du-an-kinh-doanh-001 → -006 · E-quan-ly-du-an-kinh-doanh-030, -037 · BR-quan-ly-du-an-kinh-doanh-023, -041 · (Đã chốt Phase H — Q-40.)
