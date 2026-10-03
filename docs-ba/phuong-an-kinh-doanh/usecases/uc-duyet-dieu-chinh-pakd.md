# Use Case: Kế toán duyệt / từ chối bản điều chỉnh PAKD

> Scope: Popup P-04 ở dạng bản điều chỉnh (so sánh cũ → mới) · Level: user goal

## Primary Actor

Kế toán (CFO).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Kế toán (CFO) | Chỉ cho số liệu dự án đổi khi đã kiểm tra bản điều chỉnh |
| SM / GĐK | Biết kết quả; bị từ chối thì sửa tiếp hoặc huỷ |

## Trigger

Kế toán bấm link **Duyệt điều chỉnh** (danh sách) hoặc nút **Duyệt / Từ chối điều chỉnh** (dòng thông báo).

## Preconditions

- Dự án "Đang thực hiện"; phiên bản mới nhất là bản điều chỉnh "Chờ CFO" (do SM / GĐK gửi hoặc sinh khi lưu P-03); bản điều chỉnh còn tồn tại.
- Người dùng vai trò Kế toán (CFO).

## Guarantees

- __Minimal Guarantee:__ Huỷ / từ chối thiếu ý kiến → không đổi gì.
- __Success Guarantee:__ (Duyệt) bản điều chỉnh thành PAKD đang áp dụng, số liệu dự án cập nhật, hợp đồng ban đầu được tạo nếu cần, phiên bản "Đã duyệt". (Từ chối) giữ PAKD và số liệu đang áp dụng, giữ bản điều chỉnh, phiên bản "Từ chối".

## Main Success Scenario

1. Kế toán mở P-04; tiêu đề "CFO duyệt bản điều chỉnh PAKD — V{n}".
2. Popup hiện Dự án, Người nộp / ngày nộp, Tình trạng hợp đồng "{hiện tại} → {mới}", Doanh thu / Chi phí kế hoạch / LN gộp dạng ~~cũ~~ → **mới** (LN gộp kèm biên % mới), Số HĐ / ngày ký (nếu bản mới Đã ký).
3. Kế toán bấm **Duyệt** (ý kiến tuỳ chọn).
4. Hệ thống áp số liệu bản điều chỉnh vào dự án (doanh thu dự kiến, chi phí SX / KD, cờ đã ký, ngày dự kiến ký, ngày bắt đầu / kết thúc, kế hoạch tháng), đặt bản điều chỉnh làm PAKD đang áp dụng, bỏ bản điều chỉnh, phiên bản "Đã duyệt", ghi lịch sử "CFO duyệt điều chỉnh PAKD".
5. Hệ thống hiện toast "Kế toán đã duyệt bản điều chỉnh PAKD V{n} — đã cập nhật số liệu dự án".

## Extensions

__2a. Bản điều chỉnh do lưu P-03 sinh ra không đạt kiểm tra gửi:__
- 2a1. Popup liệt kê các điểm chưa đạt theo câu của E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010 (E-phuong-an-kinh-doanh-023); không chặn — Kế toán quyết duyệt, hoặc từ chối kèm ý kiến để SM / GĐK sửa rồi gửi lại (FR-phuong-an-kinh-doanh-030, FR-phuong-an-kinh-doanh-041; Phase H — Q-25). Quay lại bước 3.

__2b. Phiên bản có dấu "Cập nhật theo hợp đồng sau khi nộp":__
- 2b1. Popup hiện thêm nhãn và so sánh 8 trường giữa bản chụp lúc nộp và nội dung hiện tại (FR-phuong-an-kinh-doanh-043). Quay lại bước 3.

__3a. Từ chối khi Ý kiến trống:__
- 3a1. Báo E-phuong-an-kinh-doanh-011, popup giữ nguyên. Quay lại bước 3.

__3b. Từ chối có ý kiến:__
- 3b1. Phiên bản "Từ chối", giữ PAKD đang áp dụng, giữ bản điều chỉnh; lịch sử "CFO từ chối điều chỉnh PAKD"; toast "Kế toán đã từ chối bản điều chỉnh PAKD V{n} — giữ bản đang áp dụng".
- 3b2. SM / GĐK thấy nhãn "Điều chỉnh bị từ chối" ([[docs/phuong-an-kinh-doanh/usecases/uc-dieu-chinh-pakd.md|UC điều chỉnh PAKD]] 1a). Use case kết thúc.

__3c. Huỷ:__
- 3c1. Đóng popup. Use case kết thúc.

__4a. Bản mới Đã ký và dự án chưa có hợp đồng:__
- 4a1. Hệ thống tạo hợp đồng ban đầu từ PAKD, tăng Version dự án thêm 1, ghi lịch sử "Tạo hợp đồng từ PAKD V{n}".

__4b. Bản mới Đã ký và dự án đã có hợp đồng:__
- 4b1. Không ghi đè hợp đồng; lệch quá 2% chỉ cảnh báo (E-phuong-an-kinh-doanh-015).

__4c. Bản điều chỉnh không còn (trường hợp bất thường):__
- 4c1. Chỉ đổi trạng thái phiên bản, không áp số liệu.

__3d. Tại lúc ghi, phiên bản không còn "Chờ CFO" hoặc nội dung bản điều chỉnh đã đổi so với lúc mở P-04:__
- 3d1. Không ghi, báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-phuong-an-kinh-doanh-019), tự nạp lại dự án và P-04, giữ Ý kiến (Phase H — Q-21, Q-32). Use case kết thúc.

__1a. Người dùng không phải Kế toán:__
- 1a1. Thao tác ghi quyết định bị từ chối với câu "Bạn không có quyền thực hiện thao tác này." (E-phuong-an-kinh-doanh-018). Use case kết thúc.

## Related Requirements

FR-phuong-an-kinh-doanh-029…FR-phuong-an-kinh-doanh-032, FR-phuong-an-kinh-doanh-035, FR-phuong-an-kinh-doanh-038, FR-phuong-an-kinh-doanh-041, FR-phuong-an-kinh-doanh-043, FR-phuong-an-kinh-doanh-045 · BR-phuong-an-kinh-doanh-004, BR-phuong-an-kinh-doanh-026, BR-phuong-an-kinh-doanh-027, BR-phuong-an-kinh-doanh-029…BR-phuong-an-kinh-doanh-031, BR-phuong-an-kinh-doanh-045 · E-phuong-an-kinh-doanh-011, E-phuong-an-kinh-doanh-015, E-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-019, E-phuong-an-kinh-doanh-023
