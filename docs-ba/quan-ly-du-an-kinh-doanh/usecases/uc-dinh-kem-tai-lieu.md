# Use Case: Đính kèm / xoá tài liệu dự án

> Scope: MH-02c — cột "Tài liệu đính kèm (n)" của khung Hợp đồng & tài liệu · Level: Subfunction

## Primary Actor

AM, SM, GĐK, Kế toán.

## Trigger

Người dùng bấm "Đính kèm tài liệu" hoặc nút xoá cạnh một tệp.

## Preconditions

- Dự án tồn tại, chưa bị xoá.

## Guarantees

- __Minimal Guarantee:__ Không chọn tệp nào → không đổi.
- __Success Guarantee:__ Danh sách tệp dự án được lưu ngay, lịch sử "Cập nhật tài liệu đính kèm"; version giữ nguyên.

## Main Success Scenario

1. Người dùng bấm "Đính kèm tài liệu" và chọn một hoặc nhiều tệp.
2. Hệ thống lưu tệp vào dự án, hiển thị tên + dung lượng.
3. Hệ thống ghi lịch sử "Cập nhật tài liệu đính kèm" — "Thêm {tên tệp, …}".

## Extensions

__1a. Người dùng bấm nút gỡ cạnh một tệp:__
- 1a1. Hệ thống hỏi xác nhận "Gỡ tệp "{tên}"?"; đồng ý thì gỡ tệp khỏi dự án (tệp vẫn được lưu trữ), lịch sử "Xoá {tên}"; huỷ thì không đổi.

__2a. Người dùng bấm tên tệp:__
- 2a1. Hệ thống mở xem tệp.

__1b. Tệp vượt 20 MB hoặc sai định dạng:__
- 1b1. Tệp đó bị loại (E-quan-ly-du-an-kinh-doanh-041), các tệp hợp lệ khác vẫn được lưu.

__1c. Dự án "Kết thúc":__
- 1c1. Vẫn đính kèm / gỡ được (BR-quan-ly-du-an-kinh-doanh-039).

__*a. Hệ thống không ghi được trọn vẹn:__
- *a1. Báo E-quan-ly-du-an-kinh-doanh-037, danh sách tệp giữ nguyên.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-018, -025 · BR-quan-ly-du-an-kinh-doanh-014, -037, -039 · NFR-quan-ly-du-an-kinh-doanh-005 · BR-quan-ly-du-an-kinh-doanh-051 · E-quan-ly-du-an-kinh-doanh-037, -041 · NFR-quan-ly-du-an-kinh-doanh-014.
