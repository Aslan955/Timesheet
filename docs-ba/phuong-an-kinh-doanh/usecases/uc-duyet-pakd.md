# Use Case: Kế toán duyệt / từ chối PAKD lần đầu

> Scope: Popup P-04 "Duyệt PAKD" mở từ danh sách (MH-02a) hoặc chi tiết (MH-02c) · Level: user goal

## Primary Actor

Kế toán (CFO).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Kế toán (CFO) | Kiểm soát PAKD trước khi dự án triển khai; số liệu dự án chỉ đổi theo bản mình duyệt (mục tiêu nghiệp vụ đầy đủ: OQ-22) |
| SM / GĐK | Biết kết quả và lý do từ chối để lập lại |
| Ban lãnh đạo | Sổ theo dõi / báo cáo chỉ có số liệu PAKD đã duyệt |

## Trigger

Kế toán bấm link **Duyệt** (danh sách, dự án "PAKD chờ duyệt") hoặc nút **Duyệt / Từ chối PAKD** trên dòng thông báo (PAKD chờ duyệt, hoặc Pending đang có bản chờ).

## Preconditions

- Phiên bản mới nhất là bản lần đầu (không phải điều chỉnh) ở trạng thái "Chờ CFO".
- Người dùng vai trò Kế toán (CFO).

## Guarantees

- __Minimal Guarantee:__ bấm Huỷ hoặc từ chối thiếu ý kiến → không thay đổi gì; dự án không nhận số liệu từ PAKD bị từ chối.
- __Success Guarantee:__ (Duyệt) phiên bản "Đã duyệt", số liệu PAKD đồng bộ vào dự án, hợp đồng ban đầu được tạo nếu PAKD Đã ký và dự án chưa có hợp đồng, dự án "Đang thực hiện", lịch sử "CFO duyệt PAKD". (Từ chối) phiên bản "Từ chối" kèm ý kiến, dự án "Chưa có PAKD" (hoặc giữ Pending), lịch sử "CFO từ chối PAKD".

## Main Success Scenario

1. Kế toán mở P-04; tiêu đề "CFO duyệt PAKD — V{n}" (V{n} = số phiên bản lưu).
2. Popup hiện Dự án, Người nộp / ngày nộp, Doanh thu PAKD, Chi phí kế hoạch, LN gộp kế hoạch (biên %), Kế hoạch theo tháng ("{n} tháng" / "Chưa import") — tính từ nội dung PAKD đang chờ duyệt.
3. Kế toán (tuỳ chọn) nhập Ý kiến, bấm **Duyệt**.
4. Hệ thống đổi phiên bản mới nhất sang "Đã duyệt" (ngày hôm nay, người quyết định hiển thị "CFO" kèm tài khoản lưu trên phiên bản, ý kiến hoặc giữ ý kiến cũ).
5. Hệ thống đồng bộ số liệu PAKD vào dự án (doanh thu dự kiến, chi phí SX / KD, cờ đã ký, ngày dự kiến ký, ngày bắt đầu / kết thúc, kế hoạch theo tháng).
6. Hệ thống chuyển dự án sang "Đang thực hiện", ghi lịch sử "CFO duyệt PAKD".
7. Hệ thống hiện toast "Kế toán đã duyệt PAKD V{n} — dự án chuyển "Đang thực hiện""; popup đóng.

## Extensions

__2a. Phiên bản có dấu "Cập nhật theo hợp đồng sau khi nộp":__
- 2a1. Popup hiện nhãn "Cập nhật theo hợp đồng sau khi nộp" và phần so sánh giữa bản chụp lúc nộp và nội dung hiện tại theo 8 trường: Tình trạng, Số HĐ, Ngày ký, Giá trị HĐ, Bắt đầu / Kết thúc, Doanh thu, Chi phí, LN gộp (FR-phuong-an-kinh-doanh-043, Phase H — Q-32).
- 2a2. Kế toán quyết định trên nội dung hiện tại; quay lại bước 3.

__2d. Nội dung bản đang chờ không đạt bộ kiểm tra gửi (vd vừa được cập nhật theo hợp đồng sau khi nộp):__
- 2d1. Popup liệt kê các điểm chưa đạt theo câu của E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010 (E-phuong-an-kinh-doanh-023); không chặn — Kế toán quyết duyệt hay từ chối; quay lại bước 3 (FR-phuong-an-kinh-doanh-030 (🔶 quyết định thay người dùng trong review — cần xác nhận)).

__2b. PAKD không sinh tháng kế hoạch nào:__
- 2b1. Dòng Kế hoạch theo tháng hiện "Chưa import" chữ đỏ; vẫn duyệt được.

__2c. Biên lợi nhuận dưới 20%:__
- 2c1. Không chặn duyệt, không bắt giải trình.

__3a. Kế toán bấm Từ chối khi Ý kiến trống:__
- 3a1. Ô Ý kiến thành bắt buộc, báo "Nhập lý do từ chối" (E-phuong-an-kinh-doanh-011), popup giữ nguyên. Quay lại bước 3.

__3b. Kế toán nhập ý kiến, bấm Từ chối:__
- 3b1. Hệ thống đổi phiên bản sang "Từ chối" kèm ý kiến; không có số liệu dự án nào cần hoàn lại.
- 3b2. Dự án "PAKD chờ duyệt" về "Chưa có PAKD"; ghi lịch sử "CFO từ chối PAKD"; toast "Kế toán đã từ chối PAKD V{n} — trả về GĐK lập lại".
- 3b3. SM / GĐK lập lại theo [[docs/phuong-an-kinh-doanh/usecases/uc-lap-gui-pakd.md|UC lập, gửi PAKD]]. Use case kết thúc.

__3c. Kế toán bấm Huỷ / ✕ / nền mờ:__
- 3c1. Đóng popup, không đổi gì. Use case kết thúc.

__3d. Dự án đang Pending và Kế toán từ chối:__
- 3d1. Phiên bản "Từ chối"; dự án giữ Pending, không ghi thêm lịch sử chuyển trạng thái.
- 3d2. Muốn lập lại, Kế toán mở lại dự án (feature `quan-ly-du-an-kinh-doanh`). Use case kết thúc.

__4a. Dự án đang Pending và Kế toán duyệt:__
- 4a1. Dự án sang "Đang thực hiện" như bước 6.

__5a. PAKD Đã ký và dự án chưa có hợp đồng:__
- 5a1. Hệ thống tạo hợp đồng ban đầu từ PAKD, tăng Version dự án thêm 1, ghi lịch sử "Tạo hợp đồng từ PAKD V{n}".

__5b. PAKD Đã ký và dự án đã có hợp đồng:__
- 5b1. Hệ thống không ghi đè hợp đồng. Nếu giá trị hợp đồng lệch doanh thu của bản đang chờ quá 2%, P-04 đã hiện dòng "Giá trị HĐ hiện có {x} — lệch {z%} ⚠" từ bước 2, trước khi Kế toán bấm Duyệt (E-phuong-an-kinh-doanh-015); chỉ cảnh báo, không chặn.

__4b. Tại lúc ghi, phiên bản không còn "Chờ CFO" (Kế toán khác vừa quyết định) hoặc nội dung bản đang chờ đã đổi so với lúc mở P-04 (vd vừa lưu P-03):__
- 4b1. Hệ thống không ghi, báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-phuong-an-kinh-doanh-019), tự nạp lại dự án và P-04, giữ Ý kiến đang nhập (Phase H — Q-21, Q-32).
- 4b2. Nếu phiên bản vẫn "Chờ CFO", Kế toán xem lại nội dung mới rồi quay lại bước 3; ngược lại use case kết thúc.

__4c. Hệ thống không ghi được trọn vẹn quyết định:__
- 4c1. Không thay đổi gì (phiên bản, số liệu dự án, hợp đồng, Version, lịch sử), báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-phuong-an-kinh-doanh-020), popup giữ Ý kiến; bấm lại thành công thì ghi đúng một lần.

__1a. Người dùng không phải Kế toán:__
- 1a1. Không có link / nút duyệt; thao tác ghi quyết định bị từ chối với câu "Bạn không có quyền thực hiện thao tác này." (E-phuong-an-kinh-doanh-018). Use case kết thúc.

## Related Requirements

FR-phuong-an-kinh-doanh-029…FR-phuong-an-kinh-doanh-032, FR-phuong-an-kinh-doanh-035, FR-phuong-an-kinh-doanh-036, FR-phuong-an-kinh-doanh-038, FR-phuong-an-kinh-doanh-043, FR-phuong-an-kinh-doanh-045 · BR-phuong-an-kinh-doanh-004, BR-phuong-an-kinh-doanh-026…BR-phuong-an-kinh-doanh-028, BR-phuong-an-kinh-doanh-030, BR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-018, BR-phuong-an-kinh-doanh-044, BR-phuong-an-kinh-doanh-045 · E-phuong-an-kinh-doanh-011, E-phuong-an-kinh-doanh-015, E-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-019, E-phuong-an-kinh-doanh-020, E-phuong-an-kinh-doanh-023
