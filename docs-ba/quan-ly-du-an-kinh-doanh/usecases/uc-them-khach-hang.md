# Use Case: Thêm khách hàng (P-01)

> Scope: Popup P-01 "Thêm khách hàng" trong màn tạo / chế độ sửa dự án · Level: Subfunction

## Primary Actor

Người đang tạo / sửa dự án (AM / SM / GĐK).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Quản lý danh mục IMIS | Khách hàng mới có đủ thông tin, mã không trùng |

## Trigger

Người dùng bấm link "+ Mới" cạnh ô Tên khách hàng.

## Preconditions

- Đang ở màn tạo dự án hoặc chế độ sửa của dự án chưa có mã (dự án đã có mã thì ô Khách hàng bị khoá).

## Guarantees

- __Minimal Guarantee:__ Huỷ / Esc / bấm nền / còn lỗi → không thêm gì vào danh mục; ghi sang IMIS không thành công → popup vẫn mở, giữ dữ liệu đã nhập.
- __Success Guarantee:__ Khách hàng mới được lưu ngay vào danh mục khách hàng IMIS với đủ 7 trường, được chọn sẵn trong form, Mã KH tự điền.

## Main Success Scenario

1. Hệ thống mở popup: Tên khách hàng *, Nội bộ, Mã KH *, Địa chỉ, Email, Số điện thoại, Mô tả.
2. Người dùng nhập; Mã KH tự in hoa, tự bỏ khoảng trắng, tối đa 3 ký tự.
3. Người dùng bấm "Lưu" (hoặc Enter khi không ở ô Mô tả).
4. Hệ thống kiểm (lỗi hiện sau lần bấm Lưu đầu tiên rồi cập nhật ngay khi sửa): tên bắt buộc; mã bắt buộc, đúng 3 ký tự A–Z / 0–9, không trùng danh mục IMIS; email đúng dạng nếu có.
5. Hệ thống lưu khách hàng vào danh mục IMIS, chọn sẵn ở ô Tên khách hàng, đóng popup.

## Extensions

__4a. Tên trống:__
- 4a1. "Nhập tên khách hàng" (E-quan-ly-du-an-kinh-doanh-007); quay lại bước 2.

__4b. Mã trống / sai dạng / trùng:__
- 4b1. "Nhập mã khách hàng" (E-quan-ly-du-an-kinh-doanh-008) / "Mã KH gồm đúng 3 ký tự chữ / số, viết liền, không dấu" (E-quan-ly-du-an-kinh-doanh-009) / "Mã khách hàng đã tồn tại" (E-quan-ly-du-an-kinh-doanh-010); quay lại bước 2.

__4c. Email sai dạng:__
- 4c1. "Email không hợp lệ" (E-quan-ly-du-an-kinh-doanh-011); quay lại bước 2.

__*a. Bấm Huỷ / Esc / bấm nền:__
- *a1. Đóng popup, không lưu.

__2a. Ô vượt độ dài cho phép:__
- 2a1. Báo E-quan-ly-du-an-kinh-doanh-040; quay lại bước 2.

__5a. Mã KH vừa được người khác thêm (kiểm lại tại lúc ghi):__
- 5a1. "Mã khách hàng đã tồn tại" (E-quan-ly-du-an-kinh-doanh-010); quay lại bước 2.

__5b. Không ghi được vào danh mục IMIS:__
- 5b1. Báo "Không lưu được khách hàng, vui lòng thử lại" (E-quan-ly-du-an-kinh-doanh-039); popup giữ nguyên dữ liệu; quay lại bước 3.

__4d. Tên khách hàng trùng tên khách hàng đã có trong danh mục:__
- 4d1. Cảnh báo không chặn "Đã có khách hàng cùng tên ({Mã KH})" (E-quan-ly-du-an-kinh-doanh-043); người dùng vẫn Lưu được với Mã KH khác hoặc đóng popup và chọn khách hàng có sẵn (Đã chốt Phase H — Q-56).

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-016, -017 · BR-quan-ly-du-an-kinh-doanh-027, -034 · E-quan-ly-du-an-kinh-doanh-007 → -011 · BR-quan-ly-du-an-kinh-doanh-050 · E-quan-ly-du-an-kinh-doanh-039, -040, -043.
