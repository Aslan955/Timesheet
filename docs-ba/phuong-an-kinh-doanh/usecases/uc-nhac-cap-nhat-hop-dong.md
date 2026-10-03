# Use Case: Nhắc cập nhật hợp đồng cho PAKD chưa ký

> Scope: Hệ thống — thông báo nhắc và cảnh báo trên danh sách dự án (MH-02a) / dòng thông báo bước (MH-02c) · Level: subfunction

## Primary Actor

Hệ thống (tác vụ hằng ngày theo giờ Việt Nam); người nhận nhắc là người lập PAKD đang áp dụng và Giám đốc khối (GĐK) của khối dự án.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Người lập PAKD, GĐK khối | Được nhắc kịp để cập nhật hợp đồng khi tới / đã qua tháng dự kiến ký |
| AM | Thấy dự án quá tháng dự kiến ký để theo dõi việc ký với khách hàng (không thấy số tiền) |
| Kế toán (CFO), Ban lãnh đạo | Dự án chưa ký quá hạn được nhìn thấy ngay trên danh sách |

## Trigger

Mỗi ngày (giờ Asia/Ho_Chi_Minh), hệ thống xét các dự án có PAKD đang áp dụng (đã được Kế toán duyệt) tình trạng Chưa ký mà chưa có hợp đồng.

## Preconditions

- PAKD đang áp dụng của dự án là tình trạng Chưa ký (PAKD đang lập / chờ duyệt không được nhắc).
- Dự án chưa có hợp đồng.
- Đã có kênh gửi thông báo (OQ-36) — chỉ áp cho phần gửi nhắc; cảnh báo đỏ không phụ thuộc kênh.

## Guarantees

- __Minimal Guarantee:__ không thay đổi nội dung PAKD hay số liệu dự án; chạy lại cùng ngày không gửi nhắc trùng.
- __Success Guarantee:__ người lập PAKD và GĐK khối nhận nhắc từ ngày 01 của tháng dự kiến ký, lặp mỗi 7 ngày; dự án quá tháng dự kiến ký mà chưa có hợp đồng hiện chữ đỏ "Quá tháng dự kiến ký MM/YYYY" ở danh sách và dòng thông báo bước; có hợp đồng thì dừng nhắc và gỡ cảnh báo.

## Main Success Scenario

1. Hệ thống xác định dự án có PAKD đang áp dụng Chưa ký, Thời điểm dự kiến ký = tháng M, dự án chưa có hợp đồng.
2. Hôm nay là ngày 01 của tháng M, hoặc tròn 7 ngày sau lần nhắc trước → hệ thống gửi nhắc "Dự án {mã} dự kiến ký HĐ {MM/YYYY} — cập nhật hợp đồng (P-03)" cho người lập PAKD và GĐK khối (BR-phuong-an-kinh-doanh-019).
3. Người nhận mở dự án, lưu P-03 với thông tin hợp đồng.
4. Hệ thống dừng nhắc cho dự án đó; đồng bộ hợp đồng xuống PAKD theo [[docs/phuong-an-kinh-doanh/usecases/uc-dong-bo-hop-dong-vao-pakd.md|UC đồng bộ hợp đồng]].

## Extensions

__2a. Hôm nay đã qua hết tháng M mà dự án vẫn chưa có hợp đồng:__
- 2a1. Hệ thống hiện chữ đỏ "Quá tháng dự kiến ký MM/YYYY" dưới tên dự án ở danh sách và trên dòng thông báo bước của màn chi tiết; mọi vai trò xem dự án đều thấy, kể cả AM (FR-phuong-an-kinh-doanh-040).
- 2a2. Nhắc tiếp tục mỗi 7 ngày; cảnh báo giữ tới khi có hợp đồng; quay lại bước 3.

__2b. Hôm nay trước ngày 01 tháng M, hoặc không phải ngày nhắc:__
- 2b1. Không gửi nhắc. Use case kết thúc.

__2c. Chưa có kênh gửi thông báo (OQ-36):__
- 2c1. Không gửi nhắc; cảnh báo đỏ (2a) vẫn áp dụng. Use case kết thúc.

__1a. PAKD Chưa ký chưa có Thời điểm dự kiến ký:__
- 1a1. Hệ thống nhắc vào ngày 01 hằng tháng tới khi có hợp đồng; nội dung bỏ phần tháng (🔶 quyết định thay người dùng trong review — cần xác nhận). Không có cảnh báo đỏ. Use case kết thúc.

__\*a. Email nhắc:__
- \*a1. Ngoài phạm vi đợt này.

## Related Requirements

FR-phuong-an-kinh-doanh-018, FR-phuong-an-kinh-doanh-036, FR-phuong-an-kinh-doanh-039, FR-phuong-an-kinh-doanh-040 · BR-phuong-an-kinh-doanh-019, BR-phuong-an-kinh-doanh-043 · NFR-phuong-an-kinh-doanh-005, NFR-phuong-an-kinh-doanh-007, NFR-phuong-an-kinh-doanh-012
