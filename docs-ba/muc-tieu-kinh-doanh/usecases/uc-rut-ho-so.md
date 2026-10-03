# Use Case: Rút hồ sơ mục tiêu đang chờ BOD duyệt

> Scope: Màn Mục tiêu kinh doanh — tab "GĐK lập mục tiêu", popup "Rút hồ sơ" · Level: User goal (sea-level)

## Primary Actor

Giám đốc khối (GĐK) — tài khoản gắn với khối của hồ sơ.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| BOD | Không phải từ chối một hồ sơ GĐK đã biết là cần sửa; thấy hồ sơ ở trạng thái Đã rút kèm lý do |

## Trigger

GĐK phát hiện hồ sơ đã gửi cần chỉnh sửa và bấm "Rút hồ sơ" ở chân khung đăng ký.

## Preconditions

- Hồ sơ thuộc khối của tài khoản, đang Chờ BOD duyệt, năm kế hoạch là năm hiện tại hoặc năm sau.

## Guarantees

- __Minimal Guarantee:__ Huỷ popup hoặc chưa có lý do thì hồ sơ không đổi. Mục tiêu chính thức của khối không bao giờ bị đổi bởi use case này.
- __Success Guarantee:__ Hồ sơ ở Đã rút, nội dung và phiên bản giữ nguyên, lý do rút được lưu và ghi vào lịch sử "Rút hồ sơ"; GĐK sửa và gửi lại được ngay; BOD không còn quyết định được hồ sơ này.

## Main Success Scenario

1. GĐK bấm "Rút hồ sơ" (nút phụ nền trắng viền xám ở chân khung đăng ký).
2. Hệ thống mở popup "Rút hồ sơ" với ô "Lý do rút" bắt buộc, nút "Huỷ" và "Xác nhận rút".
3. GĐK nhập lý do rút.
4. GĐK bấm "Xác nhận rút".
5. Hệ thống chuyển hồ sơ sang Đã rút, giữ nguyên phiên bản và nội dung, lưu lý do đã cắt khoảng trắng.
6. Hệ thống ghi lịch sử "Rút hồ sơ" với người thực hiện "<tên> (GĐK <khối>)" và lý do (in nghiêng trong ngoặc kép).
7. Hệ thống đóng popup, hiện toast "Đã rút hồ sơ mục tiêu <khối> năm <năm>", mở khoá bảng, hiện hộp "Đã rút: “<lý do>”" và lại hiện Lưu nháp / Gửi BOD duyệt.

## Extensions

__3a. Lý do trống hoặc chỉ khoảng trắng:__
- 3a1. Nút "Xác nhận rút" mờ, không bấm được (E-muc-tieu-kinh-doanh-008).
- 3a2. GĐK nhập lý do; quay lại bước 4.

__4a. GĐK bấm "Huỷ":__
- 4a1. Popup đóng, hồ sơ vẫn Chờ BOD duyệt, không ghi gì.

__5a. BOD đã phê duyệt / từ chối hồ sơ (hoặc năm kế hoạch vừa trở thành năm đã qua) trước khi GĐK xác nhận rút:__
- 5a1. Tại lúc bấm, hệ thống kiểm lại trạng thái và năm; không thỏa → không rút, báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-muc-tieu-kinh-doanh-014), nạp lại hồ sơ theo trạng thái mới (lý do đang nhập được giữ).
- 5a2. Use case kết thúc; hồ sơ theo quyết định của BOD.

__5b. Hệ thống không ghi được hồ sơ:__
- 5b1. Hệ thống báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-muc-tieu-kinh-doanh-010); popup vẫn mở và giữ lý do đã nhập; hồ sơ vẫn Chờ BOD duyệt, không ghi lịch sử.
- 5b2. GĐK bấm lại; quay lại bước 4.

## Related Requirements

FR-muc-tieu-kinh-doanh-005, FR-muc-tieu-kinh-doanh-014, FR-muc-tieu-kinh-doanh-016, FR-muc-tieu-kinh-doanh-023, FR-muc-tieu-kinh-doanh-024 · BR-muc-tieu-kinh-doanh-011, BR-muc-tieu-kinh-doanh-012, BR-muc-tieu-kinh-doanh-021, BR-muc-tieu-kinh-doanh-023, BR-muc-tieu-kinh-doanh-028, BR-muc-tieu-kinh-doanh-029 · E-muc-tieu-kinh-doanh-008, E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-014
