# Use Case: Cập nhật ký hợp đồng & phụ lục (P-03)

> Scope: Popup P-03 "Cập nhật ký hợp đồng", mở từ MH-02a hoặc MH-02c · Level: User goal

## Primary Actor

SM, GĐK, Kế toán (lưu). AM chỉ xem.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Kế toán | Số liệu HĐ đúng; mọi thay đổi PAKD do HĐ gây ra phải qua Kế toán duyệt |
| SM / GĐK | PAKD phản ánh đúng hợp đồng đã ký |

## Trigger

Người dùng bấm "Chưa ký" / "Đã ký" / "{n} tệp" ở danh sách, hoặc nút "Cập nhật ký hợp đồng" / "Bổ sung thông tin HĐ" / "Xem / cập nhật hợp đồng" ở chi tiết.

## Preconditions

- Dự án tồn tại, chưa bị xoá; muốn lưu thì dự án đã có mã và không ở "Kết thúc" (Kết thúc hoặc chưa có mã — "Chờ duyệt mã" / "Từ chối mã": chỉ xem; Đã chốt Phase H — Q-39).

## Guarantees

- __Minimal Guarantee:__ Huỷ / đóng / còn lỗi / vai trò AM → không lưu gì.
- __Success Guarantee:__ Dự án "Đã ký", HĐ được lưu (kèm người / thời điểm cập nhật), version +1, lịch sử; thông tin HĐ được đưa sang PAKD theo BR-quan-ly-du-an-kinh-doanh-029 (đã có PAKD được duyệt → bản điều chỉnh chờ Kế toán duyệt).

## Main Success Scenario

1. Hệ thống mở popup "Cập nhật ký hợp đồng", dòng phụ "{Mã} — {Tên} · Giá trị đã khai báo (Doanh thu dự kiến): {X} VNĐ"; chưa có HĐ thì giá trị mặc định = Doanh thu dự kiến, thời hạn = thời gian dự án.
2. Người dùng nhập Số HĐ, Ngày ký, Giá trị HĐ, Thời hạn Từ–Đến; bảng đối chiếu hiện chênh lệch (số + %; không có Doanh thu dự kiến thì hiện "—").
3. Người dùng tải tệp tài liệu, thêm phụ lục nếu có.
4. Người dùng bấm "Lưu & xác nhận đã ký" (lần đầu) / "Lưu thay đổi".
5. Hệ thống kiểm BR-quan-ly-du-an-kinh-doanh-028.
6. Hệ thống lưu HĐ, đặt dự án "Đã ký", version +1, lịch sử "Ký hợp đồng" / "Cập nhật hợp đồng" ("HĐ {số} · {n} phụ lục · Version {n+1}"), thông báo "Đã xác nhận ký hợp đồng {số} — {mã}" / "Đã cập nhật hợp đồng {số} — {mã}".
7. Hệ thống đưa thông tin HĐ sang PAKD theo BR-quan-ly-du-an-kinh-doanh-029: dự án đã có PAKD được duyệt và chưa có bản điều chỉnh đang mở → sinh bản điều chỉnh PAKD (Mục 1 theo HĐ) chờ Kế toán duyệt. Bước 6 và 7 được ghi trọn vẹn cùng nhau (NFR-quan-ly-du-an-kinh-doanh-014).

## Extensions

__1a. Vai trò AM, dự án "Kết thúc" hoặc dự án chưa có mã:__
- 1a1. Popup ở chế độ chỉ xem, không có nút lưu (AM: không hiện "Giá trị đã khai báo (Doanh thu dự kiến)", bảng đối chiếu, lý do lệch); kết thúc use case khi đóng.

__2a. Giá trị HĐ lệch Doanh thu dự kiến quá 2% (chênh lệch tuyệt đối chia Doanh thu dự kiến, lớn hơn 2% — BR-quan-ly-du-an-kinh-doanh-028):__
- 2a1. Ô "Lý do lệch so với giá trị đã khai báo" bắt buộc.

__2b. Không có Doanh thu dự kiến (trống hoặc 0):__
- 2b1. Bảng đối chiếu hiện "—", lý do lệch không bắt buộc.

__2c. Lệch khác 0 nhưng không quá 2%:__
- 2c1. Bảng đối chiếu hiện "Lệch {z%}" màu trung tính; ô lý do mở, không bắt buộc (Đã chốt Phase H — Q-55).

__5a. Lỗi (E-quan-ly-du-an-kinh-doanh-012 → -018, -040, -041):__
- 5a1. Lỗi dưới ô + dải đỏ "Còn {n} mục chưa hợp lệ: …." (E-quan-ly-du-an-kinh-doanh-019); lỗi hiện từ lần bấm Lưu đầu rồi cập nhật ngay khi sửa (Phase H Q-56); quay lại bước 2.

__3a. Bấm thùng rác ở dòng phụ lục:__
- 3a1. Bỏ dòng phụ lục.

__7a. Bản PAKD lập / làm lại hoặc bản điều chỉnh đang chờ Kế toán duyệt:__
- 7a1. Cập nhật Mục 1 của bản đang chờ theo HĐ; P-04 hiện nhãn "Cập nhật theo hợp đồng sau khi nộp" kèm so sánh; không sinh phiên bản.

__7b. Chưa có PAKD được duyệt, đang có bản đang lập:__
- 7b1. Ghi thông tin HĐ vào bản PAKD đang lập.

__*a. Bấm Huỷ / × / nền:__
- *a1. Đóng, không lưu.

__6a. Tại lúc lưu, dự án vừa "Kết thúc" hoặc vai trò không còn quyền:__
- 6a1. Hệ thống không lưu, báo E-quan-ly-du-an-kinh-doanh-030 (popup nạp lại, giữ lý do lệch đang nhập).

__6b. Hệ thống không ghi được trọn vẹn (kể cả phần ghi sang PAKD):__
- 6b1. Báo E-quan-ly-du-an-kinh-doanh-037, không ghi gì; popup giữ dữ liệu đang nhập; quay lại bước 4.

__7c. Đã có bản điều chỉnh nháp hoặc bị từ chối (chưa huỷ):__
- 7c1. Cập nhật Mục 1 của chính bản đó, giữ phần SM / GĐK đang soạn, không sinh bản thứ hai.

__7d. Chưa có bản PAKD nào:__
- 7d1. Chỉ lưu HĐ; khi SM / GĐK mở khung PAKD lập lần đầu, Mục 1 nạp sẵn thông tin HĐ.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-010, -025, -031, -032, -033, -048 · BR-quan-ly-du-an-kinh-doanh-014, -020, -028, -029, -049 · E-quan-ly-du-an-kinh-doanh-012 → -019 · reverse OQ-12 (đã chốt Phase H Q-39, Q-26) · BR-quan-ly-du-an-kinh-doanh-046, -050, -051 · E-quan-ly-du-an-kinh-doanh-030, -037, -040, -041 · NFR-quan-ly-du-an-kinh-doanh-014.
