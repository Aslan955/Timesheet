# Use Case: BOD từ chối hồ sơ kèm ý kiến

> Scope: Màn Mục tiêu kinh doanh — tab "BOD phê duyệt", chi tiết hồ sơ · Level: User goal (sea-level)

## Primary Actor

BOD (Ban giám đốc) — tài khoản vai trò BOD.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| GĐK lập hồ sơ | Biết lý do để điều chỉnh: dải đỏ "BOD từ chối: “<ý kiến>” — điều chỉnh và gửi lại (phiên bản mới)." khi mở tab GĐK |

## Trigger

BOD đang xem chi tiết hồ sơ Chờ BOD duyệt và bấm "Từ chối".

## Preconditions

- BOD đã đăng nhập bằng tài khoản vai trò BOD.
- Hồ sơ đang ở Chờ BOD duyệt (nút chỉ hiện khi đó).

## Guarantees

- __Minimal Guarantee:__ Ý kiến trống / chỉ khoảng trắng thì không đổi gì. Mục tiêu chính thức của khối không bao giờ bị đổi bởi use case này.
- __Success Guarantee:__ Hồ sơ ở Từ chối (phiên bản giữ nguyên), ý kiến đã cắt khoảng trắng được lưu và ghi vào lịch sử "BOD từ chối"; GĐK sửa lại được, phiên bản +1 khi nội dung khác bản bị từ chối.

## Main Success Scenario

1. BOD nhập ý kiến vào ô "Nhập ý kiến của BOD…".
2. BOD bấm "Từ chối".
3. Hệ thống kiểm tra ý kiến sau khi cắt khoảng trắng không rỗng.
4. Hệ thống chuyển hồ sơ sang Từ chối, giữ phiên bản, lưu ý kiến, ghi lịch sử "BOD từ chối" với người thực hiện "<tên> (BOD)" và ý kiến (in nghiêng trong khung lịch sử).
5. Hệ thống hiện toast "BOD đã từ chối mục tiêu <khối> năm <năm>"; màn vẫn ở chi tiết, khung ý kiến chuyển thành "Hồ sơ đang ở trạng thái Từ chối — ý kiến BOD: “…”."

## Extensions

__3a. Ý kiến trống hoặc chỉ khoảng trắng:__
- 3a1. Dòng hướng dẫn dưới ô chuyển chữ đỏ đậm: "Từ chối bắt buộc nhập ý kiến (không chấp nhận nội dung trống hoặc chỉ có khoảng trắng)." (E-muc-tieu-kinh-doanh-005); hồ sơ không đổi.
- 3a2. BOD gõ vào ô ý kiến → lỗi tự ẩn; quay lại bước 2.

__3b. Hồ sơ vừa được người khác cập nhật trong lúc BOD đang xem (GĐK vừa rút, BOD khác vừa quyết định):__
- 3b1. Như uc-bod-phe-duyet nhánh 4b: không từ chối, báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-muc-tieu-kinh-doanh-014), nạp lại hồ sơ, giữ ý kiến đang nhập.

__3c. Hồ sơ Chờ BOD duyệt thuộc năm kế hoạch đã qua:__
- 3c1. BOD vẫn từ chối được như bình thường (FR-muc-tieu-kinh-doanh-026).

__4a. Hệ thống không ghi được hồ sơ:__
- 4a1. Hệ thống báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-muc-tieu-kinh-doanh-010); hồ sơ giữ Chờ BOD duyệt, không ghi lịch sử, ý kiến đang nhập được giữ.
- 4a2. BOD bấm lại; quay lại bước 2.

__5a. GĐK xử lý sau khi bị từ chối (ngoài use case này):__
- 5a1. GĐK sửa rồi Lưu nháp → Bản nháp (hoặc Đang điều chỉnh nếu hồ sơ từng được duyệt), phiên bản +1, ý kiến BOD vẫn được giữ; hoặc sửa rồi Gửi lại → Chờ BOD duyệt, phiên bản +1, ý kiến BOD bị xoá. Không sửa thì nút Gửi BOD duyệt mờ.

## Related Requirements

FR-muc-tieu-kinh-doanh-018, FR-muc-tieu-kinh-doanh-019, FR-muc-tieu-kinh-doanh-021, FR-muc-tieu-kinh-doanh-023 · BR-muc-tieu-kinh-doanh-011 – BR-muc-tieu-kinh-doanh-014, BR-muc-tieu-kinh-doanh-021, BR-muc-tieu-kinh-doanh-023, BR-muc-tieu-kinh-doanh-029 · E-muc-tieu-kinh-doanh-005, E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-014
