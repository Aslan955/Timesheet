# Use Case: Gửi hồ sơ mục tiêu cho BOD duyệt

> Scope: Màn Mục tiêu kinh doanh — tab "GĐK lập mục tiêu" · Level: User goal (sea-level)

## Primary Actor

Giám đốc khối (GĐK) — tài khoản gắn với một khối.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| BOD | Thấy hồ sơ chờ duyệt lên đầu danh sách và số đếm trên tab "BOD phê duyệt (n)"; thấy đúng những gì đã đổi so với bản gửi trước |

## Trigger

GĐK bấm "Gửi BOD duyệt" ở chân khung "Đăng ký mục tiêu theo khách hàng / dự án".

## Preconditions

- Hồ sơ thuộc khối của tài khoản, năm kế hoạch là năm hiện tại hoặc năm sau, không ở Chờ BOD duyệt (nút chỉ hiện khi đó).
- Nếu lần gửi gần nhất đã được BOD quyết định (Đã duyệt / Từ chối) thì nội dung đang soạn phải khác bản đó (nếu không, nút mờ — nhánh 1a).
- Hồ sơ có thể chưa từng lưu (gửi thẳng vẫn được).

## Guarantees

- __Minimal Guarantee:__ Dữ liệu không hợp lệ hoặc hệ thống không ghi được thì hồ sơ không đổi trạng thái / phiên bản, không ghi lịch sử, dữ liệu đang soạn được giữ; GĐK thấy đủ mọi lỗi dữ liệu cùng lúc.
- __Success Guarantee:__ Hồ sơ ở Chờ BOD duyệt, phiên bản đúng quy tắc, nội dung vừa gửi được ghi nhận làm mốc so sánh cho lần gửi sau, ý kiến BOD cũ bị xoá, có bản ghi lịch sử "Gửi BOD duyệt" kèm nội dung điều chỉnh so với bản đã gửi gần nhất; GĐK không sửa được nữa cho tới khi BOD quyết định hoặc GĐK rút hồ sơ.

## Main Success Scenario

1. GĐK bấm "Gửi BOD duyệt".
2. Hệ thống kiểm tra toàn bộ bảng: có ít nhất 1 dòng; mọi dòng có Khách hàng, Tên dự án, tháng Ký HĐ, HĐ ký mới > 0; không dòng nào có LN gộp lớn hơn HĐ ký mới; không còn ô tháng sai định dạng; không dòng nào có tháng Ký HĐ trước tháng Ra thầu; mọi tháng Ký HĐ thuộc năm kế hoạch.
3. Hệ thống đánh phiên bản: hồ sơ mới = 01; đang Bản nháp / Đang điều chỉnh / Đã rút giữ nguyên; đang Đã duyệt / Từ chối (nội dung đã khác) cộng 1.
4. Hệ thống chuyển trạng thái Chờ BOD duyệt, ghi nhận nội dung vừa gửi làm mốc so sánh cho lần gửi sau, xoá ý kiến BOD cũ.
5. Hệ thống ghi lịch sử "Gửi BOD duyệt" với người thực hiện "<tên> (GĐK <khối>)" và nội dung điều chỉnh so với bản đã gửi gần nhất (lần gửi đầu: mọi dòng là "Thêm").
6. Hệ thống hiện toast "Đã gửi BOD duyệt mục tiêu <khối> năm <năm>", khoá bảng, ẩn Lưu nháp / Gửi BOD duyệt, hiện dòng cam "Hồ sơ đang chờ BOD duyệt — không sửa được cho tới khi BOD phê duyệt hoặc từ chối." và nút "Rút hồ sơ".

## Extensions

__1a. Lần gửi gần nhất đã được BOD quyết định và nội dung chưa khác bản đó:__
- 1a1. Nút "Gửi BOD duyệt" mờ, không bấm được; GĐK cần sửa nội dung trước. Áp cả khi GĐK đã lưu bản điều chỉnh (hồ sơ sang Bản nháp / Đang điều chỉnh, phiên bản đã +1) rồi sửa trở lại như cũ — phiên bản giữ số mới, không lùi (BR-muc-tieu-kinh-doanh-011).

__2a. Hồ sơ không có dòng nào:__
- 2a1. Hệ thống hiện dải đỏ "Chưa có dự án đăng ký." (E-muc-tieu-kinh-doanh-001); dừng.

__2b. Có một hoặc nhiều lỗi dữ liệu:__
- 2b1. Hệ thống hiện dải đỏ liệt kê đủ mọi lỗi: "Dòng n: nhập đủ Khách hàng, Tên dự án, Ký HĐ và HĐ ký mới." cho mỗi dòng thiếu (E-muc-tieu-kinh-doanh-002), "Dòng n: LN gộp không được lớn hơn giá trị HĐ ký mới." cho mỗi dòng vượt (E-muc-tieu-kinh-doanh-003), "Dòng n: tháng {Ra thầu / Ký HĐ} sai định dạng MM/YYYY" cho mỗi ô tháng sai (E-muc-tieu-kinh-doanh-004), "Dòng n: tháng Ký HĐ không được trước tháng Ra thầu." cho mỗi dòng sai thứ tự (E-muc-tieu-kinh-doanh-011), "Dòng n: tháng Ký HĐ phải thuộc năm kế hoạch {năm}." cho mỗi dòng có tháng Ký HĐ ngoài năm kế hoạch (E-muc-tieu-kinh-doanh-013). Lỗi xếp theo số dòng tăng dần, trong cùng dòng theo thứ tự E-muc-tieu-kinh-doanh-002, E-muc-tieu-kinh-doanh-003, E-muc-tieu-kinh-doanh-004, E-muc-tieu-kinh-doanh-011, E-muc-tieu-kinh-doanh-013; "Dòng n" là STT đang hiển thị.
- 2b2. Hệ thống tô viền đỏ từng ô lỗi; trạng thái không đổi.
- 2b3. GĐK sửa rồi bấm lại; quay lại bước 1.

__3a. Hồ sơ chưa từng lưu:__
- 3a1. Hồ sơ được tạo luôn ở Chờ BOD duyệt, Phiên bản 01; lịch sử chỉ có "Gửi BOD duyệt" (không có "Tạo hồ sơ"); người lập là tài khoản đang gửi.

__3b. Hồ sơ Đã rút được gửi lại (có hoặc không sửa):__
- 3b1. Phiên bản giữ nguyên; nội dung điều chỉnh so với bản đã gửi trước khi rút (không sửa thì "—").

__4a. Hệ thống không ghi được hồ sơ:__
- 4a1. Hệ thống báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-muc-tieu-kinh-doanh-010); trạng thái, phiên bản, lịch sử giữ nguyên; dữ liệu đang soạn được giữ; lần thất bại được ghi nhận để tra soát.
- 4a2. GĐK bấm lại; quay lại bước 1.

__4b. Năm kế hoạch vừa trở thành năm đã qua tại lúc bấm:__
- 4b1. Hệ thống không gửi, báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-muc-tieu-kinh-doanh-014) và nạp lại hồ sơ ở chế độ chỉ xem (E-muc-tieu-kinh-doanh-009).

## Related Requirements

FR-muc-tieu-kinh-doanh-013, FR-muc-tieu-kinh-doanh-014, FR-muc-tieu-kinh-doanh-015, FR-muc-tieu-kinh-doanh-016, FR-muc-tieu-kinh-doanh-023, FR-muc-tieu-kinh-doanh-027 · BR-muc-tieu-kinh-doanh-006 – BR-muc-tieu-kinh-doanh-009, BR-muc-tieu-kinh-doanh-011, BR-muc-tieu-kinh-doanh-012, BR-muc-tieu-kinh-doanh-020, BR-muc-tieu-kinh-doanh-021, BR-muc-tieu-kinh-doanh-023 · BR-muc-tieu-kinh-doanh-025 · E-muc-tieu-kinh-doanh-001, E-muc-tieu-kinh-doanh-002, E-muc-tieu-kinh-doanh-003, E-muc-tieu-kinh-doanh-004, E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-011, E-muc-tieu-kinh-doanh-013, E-muc-tieu-kinh-doanh-014
