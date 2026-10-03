# Use Case: Lập / điều chỉnh hồ sơ mục tiêu và lưu nháp

> Scope: Màn Mục tiêu kinh doanh — tab "GĐK lập mục tiêu" · Level: User goal (sea-level)

## Primary Actor

Giám đốc khối (GĐK) — tài khoản gắn với một khối.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| BOD | Nhận hồ sơ đủ thông tin theo khách hàng / dự án; chỉ thấy hồ sơ khi đã được gửi ít nhất 1 lần |
| Người dùng Sổ theo dõi dự án | Lưu nháp không đổi mục tiêu chính thức của khối — chỉ phê duyệt của BOD mới ghi |

## Trigger

GĐK mở tab "GĐK lập mục tiêu" và chọn Năm kế hoạch để lập mới hoặc điều chỉnh hồ sơ của khối mình.

## Preconditions

- GĐK đã đăng nhập bằng tài khoản vai trò GĐK có gắn khối.

## Guarantees

- __Minimal Guarantee:__ Nếu GĐK không lưu thành công thì không có gì được lưu (trạng thái, phiên bản, lịch sử giữ nguyên, dữ liệu đang soạn vẫn còn trên màn); thay đổi chưa lưu bị bỏ khi đổi năm hoặc rời tab (không hỏi). Mục tiêu chính thức của khối không bao giờ bị đổi bởi use case này.
- __Success Guarantee:__ Hồ sơ được lưu ở trạng thái Bản nháp (hoặc Đang điều chỉnh nếu đã có phiên bản được duyệt), phiên bản đúng quy tắc, có thêm 1 bản ghi lịch sử ("Tạo hồ sơ" hoặc "Lưu nháp") kèm nội dung điều chỉnh so với lần lưu trước; toast "Đã lưu nháp".

## Main Success Scenario

1. GĐK mở tab "GĐK lập mục tiêu"; hệ thống hiển thị Khối của tài khoản (dạng chữ) và Năm kế hoạch mặc định (tháng 10–12 là năm sau, còn lại năm hiện tại, theo giờ Asia/Ho_Chi_Minh).
2. GĐK giữ hoặc đổi Năm kế hoạch.
3. Hệ thống nạp hồ sơ của cặp Khối–Năm; chưa có thì hiện hồ sơ trống "Bản nháp — Phiên bản 01" (chưa lưu), và xác định hồ sơ sửa được.
4. GĐK bấm "+ Thêm dòng" và nhập Khách hàng (có gợi ý), Tên dự án, Ra thầu, Ký HĐ (MM/YYYY), HĐ ký mới, LN gộp mục tiêu (triệu VNĐ), Cơ sở đăng ký / Thuyết minh; sửa hoặc xoá dòng có sẵn.
5. Hệ thống tính ngay % LN gộp từng dòng, 3 ô chỉ số, biểu đồ, bảng chi tiết theo khách hàng và dòng tổng.
6. GĐK bấm "Lưu nháp".
7. Hệ thống kiểm tra không còn ô tháng sai định dạng.
8. Hệ thống lưu hồ sơ ở trạng thái Bản nháp, đánh phiên bản (hồ sơ mới = 01, đang Bản nháp giữ nguyên), ghi lịch sử với nội dung điều chỉnh so với lần lưu trước và người thực hiện "<tên> (GĐK <khối>)", hiện toast "Đã lưu nháp".
9. Khung "Lịch sử điều chỉnh (n)" hiện / cập nhật, mới nhất lên đầu.

## Extensions

__1a. Hồ sơ đang Chờ BOD duyệt:__
- 1a1. Hệ thống hiện "Hồ sơ đang chờ BOD duyệt — không sửa được cho tới khi BOD phê duyệt hoặc từ chối.", bảng chỉ đọc, ẩn Lưu nháp / Gửi BOD duyệt, nút Thêm / Xoá mờ kèm lý do (E-muc-tieu-kinh-doanh-006); chân khung chỉ còn "Rút hồ sơ".
- 1a2. GĐK chỉ xem, hoặc rút hồ sơ (uc-rut-ho-so).

__1b. GĐK chọn một năm đã qua có hồ sơ:__
- 1b1. Hệ thống hiển thị hồ sơ chỉ đọc với lý do "Hồ sơ năm {năm} đã qua — chỉ xem." (E-muc-tieu-kinh-doanh-009); không có Lưu nháp / Gửi BOD duyệt / Rút hồ sơ; lịch sử vẫn xem được.
- 1b2. Use case kết thúc (chỉ xem).

__1c. Tài khoản GĐK chưa được gắn khối:__
- 1c1. Hệ thống hiện "Tài khoản chưa được gắn khối — liên hệ quản trị" thay cho hồ sơ (E-muc-tieu-kinh-doanh-015); use case kết thúc.

__3a. Hồ sơ đang Từ chối có ý kiến BOD:__
- 3a1. Hệ thống hiện dải đỏ "BOD từ chối: “<ý kiến>” — điều chỉnh và gửi lại (phiên bản mới)."
- 3a2. Tiếp bước 4; ở bước 8, nếu nội dung khác bản BOD đã quyết định thì phiên bản +1, trạng thái về Bản nháp (hoặc Đang điều chỉnh nếu hồ sơ từng được duyệt), ý kiến BOD vẫn được giữ.

__3b. Hồ sơ đang Đã duyệt (điều chỉnh):__
- 3b1. Tiếp bước 4; ở bước 8 phiên bản +1, trạng thái "Đang điều chỉnh".
- 3b2. Hệ thống hiện song song "Mục tiêu chính thức — Phiên bản NN: X tr" cạnh tổng đang soạn; mục tiêu chính thức của khối vẫn giữ số đã duyệt.

__3c. Hồ sơ đang Đã rút:__
- 3c1. Hệ thống hiện hộp "Đã rút: “<lý do>”".
- 3c2. Tiếp bước 4; ở bước 8 phiên bản giữ nguyên.

__4a. Ô tháng gõ sai dạng:__
- 4a1. Ô tô nền đỏ, tooltip "Nhập đúng dạng MM/YYYY, ví dụ 02/2027"; giá trị của dòng giữ giá trị cũ (E-muc-tieu-kinh-doanh-004).
- 4a2. GĐK gõ lại; quay lại bước 4.

__6a. Bảng không có dòng nào, hoặc hồ sơ đã lưu và chưa có thay đổi:__
- 6a1. Nút Lưu nháp mờ, không bấm được.

__7a. Còn ô tháng sai định dạng khi bấm Lưu nháp:__
- 7a1. Hệ thống hiện dải đỏ liệt kê mỗi ô "Dòng n: tháng {Ra thầu / Ký HĐ} sai định dạng MM/YYYY" và tô viền đỏ các ô đó; không lưu (E-muc-tieu-kinh-doanh-004).
- 7a2. GĐK sửa; quay lại bước 6.

__8a. Hệ thống không ghi được hồ sơ:__
- 8a1. Hệ thống báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-muc-tieu-kinh-doanh-010); trạng thái, phiên bản, lịch sử giữ nguyên; dữ liệu đang soạn được giữ; lần thất bại được ghi nhận để tra soát.
- 8a2. GĐK bấm lại; quay lại bước 6.

__8b. Năm kế hoạch vừa trở thành năm đã qua tại lúc bấm:__
- 8b1. Hệ thống không lưu, báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-muc-tieu-kinh-doanh-014) và nạp lại hồ sơ ở chế độ chỉ xem (E-muc-tieu-kinh-doanh-009).

__\*a. GĐK đổi năm hoặc rời tab trước khi lưu:__
- \*a1. Mọi thay đổi chưa lưu bị bỏ, không hỏi xác nhận.

## Related Requirements

FR-muc-tieu-kinh-doanh-002, FR-muc-tieu-kinh-doanh-005 – FR-muc-tieu-kinh-doanh-012, FR-muc-tieu-kinh-doanh-014 – FR-muc-tieu-kinh-doanh-017, FR-muc-tieu-kinh-doanh-025, FR-muc-tieu-kinh-doanh-026, FR-muc-tieu-kinh-doanh-027 · BR-muc-tieu-kinh-doanh-001, BR-muc-tieu-kinh-doanh-002, BR-muc-tieu-kinh-doanh-006, BR-muc-tieu-kinh-doanh-010, BR-muc-tieu-kinh-doanh-011, BR-muc-tieu-kinh-doanh-012, BR-muc-tieu-kinh-doanh-016 – BR-muc-tieu-kinh-doanh-021, BR-muc-tieu-kinh-doanh-023 – BR-muc-tieu-kinh-doanh-026, BR-muc-tieu-kinh-doanh-029 – BR-muc-tieu-kinh-doanh-031 · E-muc-tieu-kinh-doanh-004, E-muc-tieu-kinh-doanh-006, E-muc-tieu-kinh-doanh-009, E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-014, E-muc-tieu-kinh-doanh-015 · NFR-muc-tieu-kinh-doanh-010
