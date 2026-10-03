# Use Case: Hệ thống tự chuyển dự án quá hạn PAKD sang Pending

> Scope: Tác vụ hằng ngày của hệ thống trên dữ liệu dự án · Level: Subfunction

## Primary Actor

Hệ thống (lịch sử ghi người thực hiện "Hệ thống").

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| SM / GĐK | Biết dự án bị Pending vì quá hạn lập PAKD |
| Kế toán | Quyết định mở lại hay không |

## Trigger

Tác vụ chạy mỗi ngày vào đầu ngày theo giờ Việt Nam, hoàn tất trước 06:00.

## Preconditions

- Có dự án "Chưa có PAKD" hoặc "PAKD chờ duyệt", chưa có bản PAKD "Đã duyệt", có hạn lập PAKD.

## Guarantees

- __Minimal Guarantee:__ Dự án không thoả điều kiện giữ nguyên.
- __Success Guarantee:__ Mỗi dự án quá hạn → "Pending", ngày đóng = hạn + 1 ngày, đúng một dòng lịch sử "Tự động chuyển Pending".

## Main Success Scenario

1. Hệ thống tính "hôm nay" theo giờ Asia/Ho_Chi_Minh.
2. Hệ thống lọc dự án thoả điều kiện ở Preconditions có hạn nhỏ hơn hôm nay.
3. Với mỗi dự án: kiểm lại điều kiện ngay tại lúc chuyển, đặt "Pending", ngày đóng = hạn + 1 ngày, thêm lịch sử bởi "Hệ thống", thao tác "Tự động chuyển Pending", ghi chú "Quá 30 ngày (hạn {dd/mm/yyyy}) PAKD chưa được Kế toán duyệt" (đã có bản nộp) hoặc "Quá 30 ngày (hạn {dd/mm/yyyy}) chưa có PAKD".

## Extensions

__2a. Không có dự án quá hạn:__
- 2a1. Không làm gì.

__2b. Đúng ngày hạn:__
- 2b1. Chưa chuyển; tác vụ ngày hôm sau mới chuyển.

__2c. Dự án đã bị Kế toán từ chối PAKD, hạn gốc đã qua:__
- 2c1. Vẫn chuyển Pending (hạn gốc không gia hạn).

__3a. Dự án vừa có PAKD được duyệt hoặc vừa đổi trạng thái tại lúc chuyển:__
- 3a1. Bỏ qua dự án đó.

__*a. Tác vụ bị lỡ một hoặc nhiều ngày:__
- *a1. Lần chạy sau tự bù mọi dự án đã quá hạn, ngày đóng vẫn = hạn + 1.

__*b. Tác vụ chạy lại trong ngày:__
- *b1. Không tạo trạng thái / lịch sử trùng.

__*c. Tác vụ lỗi:__
- *c1. Hệ thống cảnh báo bộ phận vận hành và ghi nhận lỗi (NFR-quan-ly-du-an-kinh-doanh-016); lần chạy sau tự bù.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-036 · BR-quan-ly-du-an-kinh-doanh-005, -011 · NFR-quan-ly-du-an-kinh-doanh-007 · NFR-quan-ly-du-an-kinh-doanh-015, -016.
