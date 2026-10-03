# Use Case: Kế toán import số thực tế Doanh thu / KLCV theo tháng

> Scope: MH-02c — khối "Số liệu dự án theo tháng", tab Thực tế · Level: User goal

## Primary Actor

Kế toán (CFO).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Ban lãnh đạo | Báo cáo hiệu quả dự án có Doanh thu / KLCV thực tế cập nhật |
| Người dùng báo cáo (feature `bao-cao-hieu-qua-du-an`) | Số Thu / Chi từ sổ kế toán không bị ghi đè |

## Trigger

Kế toán bấm "Import thực tế" ở khối Số liệu theo tháng.

## Preconditions

- Người dùng là Kế toán; dự án có thời gian dự án (để sinh file mẫu); dự án không ở "Kết thúc" ("Pending" vẫn import được).

## Guarantees

- __Minimal Guarantee:__ File lỗi hoặc Huỷ → số thực tế không đổi.
- __Success Guarantee:__ Doanh thu thực tế và KLCV thực tế các tháng trong file được ghi theo chế độ "Gộp theo tháng" (tất cả hoặc không tháng nào; tháng không có trong file giữ nguyên); Thu / Chi SX / Chi KD thực tế giữ nguyên; thông tin lần import (tệp, người, thời điểm) được cập nhật; lịch sử "Import thực tế Doanh thu / KLCV" ghi chú "{n} tháng: MM/YYYY, …"; version không đổi.

## Main Success Scenario

1. Hệ thống mở popup "Import số thực tế theo tháng — {mã} · {tên}".
2. Kế toán tải file mẫu (bước 1 "Tải file mẫu": tháng theo thời gian dự án, kèm số hiện có).
3. Kế toán chọn / kéo thả file đã điền (bước 2 "Chọn file đã điền"; tối đa 20 MB và 50.000 dòng dữ liệu).
4. Hệ thống đọc file, kiểm tiêu đề, tháng, số, chỉ tiêu; hiển thị xem trước, số tháng mới / cập nhật.
5. Kế toán bấm "Import thực tế".
6. Hệ thống ghi Doanh thu và KLCV thực tế của các tháng trong file (ô trống giữ "chưa có số"), cập nhật bảng tab Thực tế và chân khung "Import từ {tệp} bởi {người} lúc {thời gian}", ghi lịch sử và hiện thông báo "Đã import thực tế {n} tháng".

## Extensions

__4a. File không đọc được / sai định dạng:__
- 4a1. Báo E-quan-ly-du-an-kinh-doanh-031; quay lại bước 3.

__3a. File lớn hơn 20 MB hoặc hơn 50.000 dòng dữ liệu:__
- 3a1. Báo E-quan-ly-du-an-kinh-doanh-044, nút Import khoá; quay lại bước 3 (Đã chốt Phase H — Q-22).

__4b. Sai cấu trúc, tháng, số, chỉ tiêu trùng:__
- 4b1. Liệt kê lỗi theo dòng (E-quan-ly-du-an-kinh-doanh-032 → -035), nút Import khoá ("Sửa hết lỗi trong file trước khi import"); quay lại bước 3.

__4c. Có cảnh báo (tháng ngoài thời gian dự án, giá trị âm, thiếu dòng, dòng Thu / Chi thực tế, dòng không phải chỉ tiêu):__
- 4c1. Hiện cảnh báo (E-quan-ly-du-an-kinh-doanh-036), vẫn cho import; dòng Thu / Chi bị bỏ qua (Đã chốt Phase H — Q-43).

__5a. Kế toán bấm Huỷ hoặc "Chọn lại":__
- 5a1. Đóng popup / chọn file khác, không ghi.

__1a. Người dùng không phải Kế toán:__
- 1a1. Không có nút Import; chỉ xem bảng (khối hiện từ khi dự án có mã, với mọi vai trò xem được dự án — FR-quan-ly-du-an-kinh-doanh-044, Phase H Q-44).

__1b. Dự án "Kết thúc":__
- 1b1. Không có nút Import thực tế.

__6a. Tại lúc ghi, dự án vừa "Kết thúc" hoặc vai trò không còn quyền:__
- 6a1. Không ghi, báo E-quan-ly-du-an-kinh-doanh-030 (nạp lại dự án).

__6b. Hệ thống không ghi được trọn vẹn:__
- 6b1. Không ghi tháng nào (E-quan-ly-du-an-kinh-doanh-037); popup giữ tệp đã chọn; quay lại bước 5.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-044, -045 · BR-quan-ly-du-an-kinh-doanh-014, -047 · E-quan-ly-du-an-kinh-doanh-031 → -036, -044 · BR-quan-ly-du-an-kinh-doanh-052 · NFR-quan-ly-du-an-kinh-doanh-009 · E-quan-ly-du-an-kinh-doanh-030, -037 · NFR-quan-ly-du-an-kinh-doanh-014, -016.
