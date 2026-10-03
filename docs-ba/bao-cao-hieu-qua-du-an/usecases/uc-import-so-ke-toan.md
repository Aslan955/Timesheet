# Use Case: Import sổ kế toán (Dòng tiền thu / Chi thực tế)

> Scope: Module Quản trị dự án & Tài chính — popup P-07 từ màn MH-03 · Level: User goal (sea-level)

## Primary Actor

Kế toán (CFO).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Ban lãnh đạo / GĐK | Số thực tế và Chốt số đến được cập nhật để đánh giá sức khoẻ dự án |
| Dự án (lịch sử) | Mỗi lần cập nhật thực tế được ghi lịch sử |

## Trigger

Kế toán bấm nút "Import sổ kế toán" trên thanh tiêu đề MH-03.

## Preconditions

- Người dùng đăng nhập với vai trò Kế toán (vai trò khác không thấy nút).
- Kế toán có file sổ .xlsx / .xls / .csv xuất từ phần mềm kế toán, dòng tiêu đề đúng mẫu.
- Dự án đã được cấp mã (Mã tổng / KD / SX / outsource) để dòng sổ khớp được; dòng sổ import trước khi dự án được cấp mã sẽ được tính khi mã được cấp (BR-bao-cao-hieu-qua-du-an-039).

## Guarantees

- __Minimal Guarantee:__ File có lỗi, Kế toán huỷ, thao tác không còn hợp lệ tại lúc ghi, hoặc ghi sổ không thành công thì sổ, số thực tế, nhật ký import và lịch sử dự án không thay đổi (tất cả hoặc không — NFR-bao-cao-hieu-qua-du-an-014); import lỗi, ghi thất bại, thao tác bị từ chối được ghi nhận để tra soát (NFR-bao-cao-hieu-qua-du-an-015).
- __Success Guarantee:__ Dòng sổ cùng loại của các tháng trong file được thay thế (dòng cũ giữ lại ở trạng thái hết hiệu lực); Thu hoặc Chi thực tế của dự án liên quan được tính lại; Chốt số đến của chỉ tiêu tương ứng cập nhật; lịch sử dự án + nhật ký import được ghi với người import theo tài khoản, tệp gốc được lưu kèm nhật ký import (NFR-bao-cao-hieu-qua-du-an-001 — Đã chốt Phase H — Q-29); toast kết quả.

## Main Success Scenario

1. Hệ thống mở popup "Import sổ kế toán — Dòng tiền thu / Chi thực tế" với bước 1, bước 2 và mục Lịch sử import (10 lần gần nhất).
2. (Tuỳ chọn) Kế toán tải "Mẫu dòng tiền thu" hoặc "Mẫu chi thực tế".
3. Kế toán kéo thả hoặc chọn file.
4. Hệ thống kiểm đuôi file, đọc sheet đầu, tự nhận loại sổ theo dòng tiêu đề, ánh xạ cột.
5. Hệ thống kiểm từng dòng, chuẩn hoá ngày / tháng / số, ghép mã dự án; dòng không mã / không khớp vẫn giữ.
6. Hệ thống hiện bước 3: chip loại sổ, số dòng, các tháng, số dự án khớp mã, số cảnh báo; bảng tổng hợp theo dự án + dòng "Không gắn / chưa khớp dự án"; dải vàng E-bao-cao-hieu-qua-du-an-014 nêu số dòng sổ hiện có nếu sổ đã có dòng các tháng đó.
7. Kế toán bấm "Import sổ".
8. Hệ thống hiện hộp xác nhận "Sẽ thay toàn bộ sổ {loại} các tháng {…} — {n} dòng cũ của {m} dự án không có trong file sẽ bị xoá.", với {n} = số dòng của dự án không có trong file (BR-bao-cao-hieu-qua-du-an-038).
9. Kế toán đồng ý.
10. Hệ thống kiểm lại vai trò Kế toán và sổ cùng loại các tháng trong file tại lúc ghi (NFR-bao-cao-hieu-qua-du-an-013), rồi thay thế dòng cùng loại sổ của các tháng trong file, tính lại Thu hoặc Chi SX / Chi KD thực tế của dự án bị ảnh hưởng, ghi lịch sử dự án (không tăng phiên bản) và nhật ký import — tất cả trọn vẹn trong một lần ghi (NFR-bao-cao-hieu-qua-du-an-014); áp cho dự án ở mọi trạng thái, kể cả Kết thúc / Pending (BR-bao-cao-hieu-qua-du-an-031).
11. Hệ thống đóng popup và hiện toast "Đã import {loại}: {n} dòng, tháng {…} — cập nhật {m} dự án" trong 3 giây, {m} = số dự án bị ảnh hưởng gồm cả dự án chỉ có dòng bị thay; báo cáo tính lại Chốt số đến và các số liệu.

## Extensions

__4a. Đuôi file không phải .xlsx / .xls / .csv:__
- 4a1. Lỗi E-bao-cao-hieu-qua-du-an-001, nút Import sổ mờ.

__4b. Không đọc được file (hỏng hoặc đặt mật khẩu):__
- 4b1. Lỗi E-bao-cao-hieu-qua-du-an-002 "Không đọc được file. File có thể bị hỏng hoặc đặt mật khẩu."

__4c. Không nhận ra dòng tiêu đề:__
- 4c1. Lỗi E-bao-cao-hieu-qua-du-an-003.

__4d. Thiếu cột bắt buộc:__
- 4d1. Sổ thu thiếu "Số tiền" → E-bao-cao-hieu-qua-du-an-004; sổ chi thiếu "Tháng" → E-bao-cao-hieu-qua-du-an-005.

__4e. File quá 20 MB hoặc quá 50.000 dòng dữ liệu, hoặc file CSV không lưu UTF-8:__
- 4e1. Lỗi E-bao-cao-hieu-qua-du-an-024 hoặc E-bao-cao-hieu-qua-du-an-025, nút Import sổ mờ; Kế toán tách file theo tháng hoặc lưu lại dạng CSV UTF-8 / .xlsx rồi chọn lại.

__5a. Dòng lỗi dữ liệu:__
- 5a1. Báo "Dòng {n}" (số dòng thật trên sheet — BR-bao-cao-hieu-qua-du-an-027) + lỗi đầu tiên của dòng: E-bao-cao-hieu-qua-du-an-006 / E-bao-cao-hieu-qua-du-an-007 (sổ thu), E-bao-cao-hieu-qua-du-an-008 / E-bao-cao-hieu-qua-du-an-009 / E-bao-cao-hieu-qua-du-an-010 (sổ chi); nút Import sổ mờ.
- 5a2. Kế toán bấm tải danh sách dòng lỗi; hệ thống tải file Excel liệt kê Dòng + lý do.
- 5a3. Kế toán sửa file rồi bấm "Chọn lại"; quay lại bước 3.

__5b. Không có dòng hợp lệ nào và không có lỗi:__
- 5b1. Lỗi E-bao-cao-hieu-qua-du-an-011.

__5c. Có dòng không mã công trình hoặc mã chưa khớp:__
- 5c1. Cảnh báo E-bao-cao-hieu-qua-du-an-012 / E-bao-cao-hieu-qua-du-an-013 (không chặn); các dòng này vẫn được lưu nhưng không cộng vào dự án.

__5d. File có dòng thuộc tháng sau tháng hiện tại (giờ Việt Nam):__
- 5d1. Lỗi "Tháng {MM/YYYY} sau tháng hiện tại." kèm "Dòng {n}" (E-bao-cao-hieu-qua-du-an-026, lỗi chặn); nút Import sổ mờ, có nút tải danh sách dòng lỗi; Kế toán sửa file rồi chọn lại (như 5a2–5a3). Nhầm khác (tháng đã qua, loại sổ) sửa bằng import lại đúng tháng / loại sổ.

__6a / 7a. Kế toán bấm "Chọn lại" hoặc "Huỷ":__
- 6a1. "Chọn lại" xoá kết quả đọc, quay lại bước chọn file; "Huỷ" đóng popup, không ghi gì.

__7b. Sổ cùng loại chưa có dòng nào ở các tháng trong file:__
- 7b1. Không hiện hộp xác nhận; sang bước 10.

__7c. Kế toán bấm Import sổ (hoặc Đồng ý) nhiều lần liên tiếp:__
- 7c1. Hệ thống chỉ ghi 1 lần; trong lúc ghi nút Import sổ mờ (NFR-bao-cao-hieu-qua-du-an-013).

__9a. Kế toán chọn quay lại trong hộp xác nhận:__
- 9a1. Hệ thống không ghi gì, giữ nguyên bước xem trước.

__10a. Ghi sổ không thành công:__
- 10a1. Hệ thống không thay đổi gì, giữ popup ở bước 3 và báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-bao-cao-hieu-qua-du-an-021); Kế toán bấm lại thì ghi đúng 1 lần.

__10b. Số thực tế của dự án lệch tổng dòng sổ (dữ liệu chuyển đổi đầu kỳ hoặc mã đã thay đổi):__
- 10b1. Dự án không bị ảnh hưởng bởi lần import giữ nguyên số; P-06 có thể hiện cảnh báo lệch E-bao-cao-hieu-qua-du-an-015, người xem đối chiếu với Kế toán.

__10c. Tại lúc ghi, sổ cùng loại ở các tháng trong file đã thay đổi sau bước xem trước (vd Kế toán khác vừa import):__
- 10c1. Hệ thống không ghi, tính lại xem trước, dải vàng E-bao-cao-hieu-qua-du-an-014 và số liệu hộp xác nhận theo sổ mới, báo E-bao-cao-hieu-qua-du-an-022; quay lại bước 6.

__10d. Tại lúc ghi, người dùng không còn vai trò Kế toán:__
- 10d1. Hệ thống không ghi, báo E-bao-cao-hieu-qua-du-an-022, đóng popup và ẩn nút Import sổ kế toán; lần bị từ chối được ghi nhận (NFR-bao-cao-hieu-qua-du-an-015).

## Related Requirements

FR-bao-cao-hieu-qua-du-an-001, FR-bao-cao-hieu-qua-du-an-002, FR-bao-cao-hieu-qua-du-an-022, FR-bao-cao-hieu-qua-du-an-023, FR-bao-cao-hieu-qua-du-an-024, FR-bao-cao-hieu-qua-du-an-025, FR-bao-cao-hieu-qua-du-an-026, FR-bao-cao-hieu-qua-du-an-027, FR-bao-cao-hieu-qua-du-an-028, FR-bao-cao-hieu-qua-du-an-029, FR-bao-cao-hieu-qua-du-an-030, FR-bao-cao-hieu-qua-du-an-031 · BR-bao-cao-hieu-qua-du-an-020, BR-bao-cao-hieu-qua-du-an-025, BR-bao-cao-hieu-qua-du-an-026, BR-bao-cao-hieu-qua-du-an-027, BR-bao-cao-hieu-qua-du-an-028, BR-bao-cao-hieu-qua-du-an-029, BR-bao-cao-hieu-qua-du-an-030, BR-bao-cao-hieu-qua-du-an-031, BR-bao-cao-hieu-qua-du-an-032, BR-bao-cao-hieu-qua-du-an-036, BR-bao-cao-hieu-qua-du-an-037, BR-bao-cao-hieu-qua-du-an-038, BR-bao-cao-hieu-qua-du-an-039 · E-bao-cao-hieu-qua-du-an-001, E-bao-cao-hieu-qua-du-an-002, E-bao-cao-hieu-qua-du-an-003, E-bao-cao-hieu-qua-du-an-004, E-bao-cao-hieu-qua-du-an-005, E-bao-cao-hieu-qua-du-an-006, E-bao-cao-hieu-qua-du-an-007, E-bao-cao-hieu-qua-du-an-008, E-bao-cao-hieu-qua-du-an-009, E-bao-cao-hieu-qua-du-an-010, E-bao-cao-hieu-qua-du-an-011, E-bao-cao-hieu-qua-du-an-012, E-bao-cao-hieu-qua-du-an-013, E-bao-cao-hieu-qua-du-an-014, E-bao-cao-hieu-qua-du-an-015, E-bao-cao-hieu-qua-du-an-021, E-bao-cao-hieu-qua-du-an-022, E-bao-cao-hieu-qua-du-an-024, E-bao-cao-hieu-qua-du-an-025, E-bao-cao-hieu-qua-du-an-026 · NFR-bao-cao-hieu-qua-du-an-001, NFR-bao-cao-hieu-qua-du-an-002, NFR-bao-cao-hieu-qua-du-an-004, NFR-bao-cao-hieu-qua-du-an-007, NFR-bao-cao-hieu-qua-du-an-009, NFR-bao-cao-hieu-qua-du-an-010, NFR-bao-cao-hieu-qua-du-an-012, NFR-bao-cao-hieu-qua-du-an-013, NFR-bao-cao-hieu-qua-du-an-014, NFR-bao-cao-hieu-qua-du-an-015 · OQ-7, OQ-26
