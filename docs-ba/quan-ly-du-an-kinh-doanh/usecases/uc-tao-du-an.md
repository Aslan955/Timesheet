# Use Case: Tạo dự án (yêu cầu mở mã / GĐK tạo & cấp mã)

> Scope: MH-02b "Tạo dự án" · Level: User goal

## Primary Actor

AM, SM (Giám đốc kinh doanh), GĐK (Giám đốc khối).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| GĐK | Kiểm soát việc cấp mã dự án (duyệt yêu cầu của AM / SM) |
| Kế toán | Mã dự án đúng quy tắc để ghép sổ kế toán |

## Trigger

Người dùng bấm "Cấp mã dự án" trên MH-02a.

## Preconditions

- Người dùng là AM / SM / GĐK (Kế toán không mở được màn tạo).

## Guarantees

- __Minimal Guarantee:__ Quay lại / Huỷ / dữ liệu không hợp lệ / khách hàng hết số thứ tự → không tạo dự án (khách hàng mới đã lưu ở P-01 vẫn còn trong danh mục IMIS).
- __Success Guarantee:__ Một dự án mới (version 1, lịch sử "Tạo dự án") ở trạng thái "Chờ duyệt mã" (AM / SM) hoặc "Chưa có PAKD" có mã không trùng + hạn PAKD (GĐK); màn chuyển sang chi tiết dự án.

## Main Success Scenario

1. Hệ thống mở màn tạo: Quay lại, Huỷ, nút gửi ("Gửi GĐK duyệt" / "Tạo & cấp mã"), meta "Version: Mới · Trạng thái: Đang soạn · Người tạo", dải hướng dẫn quy trình theo vai trò; danh sách người và khách hàng lấy từ danh mục IMIS.
2. Người dùng nhập Tên dự án, bật KEY nếu trọng điểm, chọn PM kinh doanh / sản xuất / outsource.
3. Người dùng chọn Khối, Loại dự án, Khách hàng (Mã KH tự điền), Thời gian, Giám đốc kinh doanh, Giám đốc khối, AM (nhiều), Ghi chú; đính kèm tài liệu nếu có.
4. Người dùng bấm nút gửi.
5. Hệ thống kiểm Tên, Khối, Loại, Khách hàng và ngày kết thúc không trước ngày bắt đầu.
6. (AM / SM) Hệ thống tạo dự án "Chờ duyệt mã", chưa có mã, chưa có hạn PAKD, lưu tệp (nếu có) kèm lịch sử, chuyển sang chi tiết, thông báo "Đã gửi yêu cầu mở mã dự án — chờ GĐK duyệt".

## Extensions

__3a. Khách hàng chưa có trong danh mục:__
- 3a1. Người dùng bấm "+ Mới" → UC-them-khach-hang.
- 3a2. Quay lại bước 3 với khách hàng mới được chọn sẵn.

__5a. Thiếu / sai thông tin:__
- 5a1. Hệ thống hiện dải đỏ "Còn {n} thông tin cần bổ sung: …", tô đỏ ô lỗi (E-quan-ly-du-an-kinh-doanh-001 → -006).
- 5a2. Quay lại bước 2.

__6a. Vai trò là GĐK:__
- 6a1. Hệ thống sinh mã tổng `[Mã KH].[STT 3 chữ số]` (không trùng), mã KD `.1`, mã SX `.2`; trạng thái "Chưa có PAKD", ngày cấp mã = hôm nay, hạn lập PAKD = hôm nay + 30.
- 6a2. Thông báo "Đã cấp mã {mã} — GĐK lập PAKD trước {dd/mm/yyyy}".

__6a1a. Số thứ tự mã tổng lớn nhất của khách hàng đã là 999:__
- 6a1a1. Hệ thống báo E-quan-ly-du-an-kinh-doanh-027, không tạo dự án; người dùng ở lại màn tạo.

__*a. Bấm Quay lại / Huỷ:__
- *a1. Về danh sách, không lưu, không hỏi xác nhận.

__1a. Không tải được danh mục nhân sự / khách hàng từ IMIS:__
- 1a1. Ô chọn tương ứng bị khoá kèm nút "Thử lại" (E-quan-ly-du-an-kinh-doanh-038); các ô khác vẫn nhập được, dữ liệu đang nhập không mất.

__3b. Tệp vượt 20 MB hoặc sai định dạng:__
- 3b1. Tệp đó bị loại (E-quan-ly-du-an-kinh-doanh-041), các tệp hợp lệ khác vẫn được nhận.

__6b. Tại lúc gửi, vai trò không còn quyền tạo dự án:__
- 6b1. Hệ thống báo E-quan-ly-du-an-kinh-doanh-030, không tạo dự án.

__6c. Hệ thống không ghi được trọn vẹn (dự án, tệp, lịch sử):__
- 6c1. Báo E-quan-ly-du-an-kinh-doanh-037, không tạo dự án (GĐK: không chiếm số thứ tự); màn tạo giữ dữ liệu đang nhập; người dùng bấm gửi lại.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-011 → -015, -017, -018 · BR-quan-ly-du-an-kinh-doanh-002 → -007, -026, -033, -034, -037 · E-quan-ly-du-an-kinh-doanh-001 → -006, -027 · reverse OQ-6 (cách xác định vai trò) · BR-quan-ly-du-an-kinh-doanh-050, -051 · E-quan-ly-du-an-kinh-doanh-030, -037, -038, -040, -041 · NFR-quan-ly-du-an-kinh-doanh-014.
