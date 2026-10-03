# Use Case: Đặt mục tiêu giá trị HĐ ký của khối (P-05)

> Scope: MH-02a — popup P-05 "Mục tiêu giá trị HĐ ký năm X" · Level: Subfunction

## Primary Actor

Kế toán (CFO).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| BOD | Mục tiêu đã duyệt ở MH-01 không bị ghi đè bởi số nhập tay |
| Lãnh đạo khối | Sổ theo dõi có mục tiêu để so sánh khi chưa có hồ sơ BOD duyệt |

## Trigger

Kế toán bấm "Đặt mục tiêu" trên bảng "Theo khối so với mục tiêu".

## Preconditions

- Người dùng là Kế toán (nút chỉ hiện với Kế toán).

## Guarantees

- __Minimal Guarantee:__ Huỷ / bấm nền thì mục tiêu giữ nguyên; số do BOD duyệt không bao giờ bị ghi đè từ P-05.
- __Success Guarantee:__ Mục tiêu các khối được nhập (chưa có số BOD) của năm được lưu; ô để trống không thành 0; khối bị Xoá mục tiêu về "chưa có mục tiêu"; Sổ theo dõi tính lại ngay.

## Main Success Scenario

1. Hệ thống xác định năm = năm đang lọc (nếu "Tất cả" thì năm hiện tại theo giờ Việt Nam) và mở popup với mục tiêu hiện có của năm đó.
2. Hệ thống khoá ô của các khối đã có mục tiêu do BOD duyệt, kèm nhãn "Theo BOD duyệt".
3. Kế toán nhập mục tiêu VNĐ cho các khối còn lại (chỉ nhận chữ số, tối đa 15 chữ số, tự định dạng nghìn; nhập 0 coi như để trống); dòng "Toàn công ty" tự cộng.
4. Kế toán bấm "Lưu mục tiêu".
5. Hệ thống ghi mục tiêu các khối có nhập, giữ nguyên khối để trống, ghi nhật ký mục tiêu khối (người, thời điểm, năm × khối, giá trị cũ → mới), đóng popup; ô ① và bảng ② tính lại.

## Extensions

__4a. Kế toán bấm "Huỷ" hoặc bấm nền:__
- 4a1. Hệ thống đóng popup, không đổi gì.

__5a. Sau đó BOD phê duyệt mục tiêu của một khối ở MH-01:__
- 5a1. Số BOD duyệt ghi đè số nhập tay của khối đó; lần mở P-05 sau ô khối đó bị khoá.

__3a. Kế toán gỡ mục tiêu nhập tay đã lưu sai:__
- 3a1. Kế toán bấm "Xoá mục tiêu" cạnh khối; hệ thống hỏi "Xoá mục tiêu năm {năm} của khối {khối}?".
- 3a2. Đồng ý: khối về "chưa có mục tiêu", ghi nhật ký mục tiêu khối (giá trị cũ → trống), ô ① và bảng ② tính lại; huỷ: không đổi (Đã chốt Phase H — Q-48).

__5b. Khối đang nhập vừa có mục tiêu do BOD duyệt (BOD duyệt trong lúc popup đang mở):__
- 5b1. Hệ thống không lưu, báo E-quan-ly-du-an-kinh-doanh-030 và nạp lại mục tiêu mới nhất (khối đó bị khoá); Kế toán nhập lại nếu cần.

__5c. Hệ thống không ghi được trọn vẹn:__
- 5c1. Báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-quan-ly-du-an-kinh-doanh-037); popup giữ số đang nhập; quay lại bước 4.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-004 · BR-quan-ly-du-an-kinh-doanh-021, -022 · NFR-quan-ly-du-an-kinh-doanh-007 · BR-quan-ly-du-an-kinh-doanh-050 · E-quan-ly-du-an-kinh-doanh-030, -037, -040 · NFR-quan-ly-du-an-kinh-doanh-014.
