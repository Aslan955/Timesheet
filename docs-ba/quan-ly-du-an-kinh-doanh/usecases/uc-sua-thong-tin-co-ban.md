# Use Case: Sửa thông tin cơ bản dự án trực tiếp (Update PM)

> Scope: MH-02c — chế độ sửa trực tiếp · Level: User goal

## Primary Actor

AM, SM, GĐK.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Kế toán | Không phải duyệt sửa thông tin cơ bản; mã dự án luôn khớp khách hàng |

## Trigger

Người dùng bấm "Sửa" trên đầu trang chi tiết.

## Preconditions

- Người dùng là AM / SM / GĐK; dự án không ở trạng thái "Kết thúc".

## Guarantees

- __Minimal Guarantee:__ Huỷ sửa hoặc lỗi kiểm tra → dữ liệu dự án không đổi.
- __Success Guarantee:__ Chỉ các trường thông tin cơ bản người dùng đã đổi được ghi; trạng thái, hạn PAKD, mã outsource, PAKD giữ giá trị mới nhất; version +1; lịch sử "Cập nhật"; màn về chế độ xem.

## Main Success Scenario

1. Hệ thống chuyển sang chế độ sửa: "Sửa dự án", Huỷ sửa · Lưu thay đổi; ẩn Quay lại, dòng thông báo, tab Lịch sử, nút theo bước, Sửa, Xoá; dải "Đang sửa thông tin dự án… — tạo Version v{n+1}."
2. Khung Mã dự án / Thông tin chi tiết / Hợp đồng & tài liệu thành ô nhập; mã đã cấp chỉ xem; dự án đã có mã thì ô Khách hàng bị khoá.
3. Người dùng sửa các ô; muốn đổi PM thì bấm "Update PM" rồi chọn PM khác từ danh mục IMIS.
4. Người dùng bấm "Lưu thay đổi".
5. Hệ thống kiểm như màn tạo (BR-quan-ly-du-an-kinh-doanh-026).
6. Hệ thống ghi các trường đã đổi, version +1, lịch sử "Cập nhật · Version {n+1}", thông báo "Đã cập nhật thông tin cơ bản — Version {n+1}", về chế độ xem.

## Extensions

__3a. Bấm × "Huỷ đổi PM":__
- 3a1. PM trở về giá trị cũ.

__3b. Dự án chưa có mã, cần khách hàng mới:__
- 3b1. → UC-them-khach-hang.

__5a. Lỗi kiểm tra:__
- 5a1. Dải đỏ + tô đỏ ô (E-quan-ly-du-an-kinh-doanh-001 → -006); quay lại bước 3.

__6a. Danh sách tệp thay đổi:__
- 6a1. Thêm lịch sử "Cập nhật tài liệu đính kèm" ghi chú "Cập nhật tài liệu đính kèm ({n} tệp)" (không tăng version thêm). Tệp chỉ được lưu cùng "Lưu thay đổi", "Huỷ sửa" hoàn tác mọi thay đổi tệp; chỉ đổi tệp (không đổi trường nào) thì không tăng version (BR-quan-ly-du-an-kinh-doanh-051).

__6b. Trong lúc sửa, trạng thái / hạn PAKD đã đổi (vd tác vụ chuyển Pending):__
- 6b1. Lưu không đưa trạng thái / hạn về giá trị cũ (BR-quan-ly-du-an-kinh-doanh-048).

__*a. Bấm "Huỷ sửa":__
- *a1. Về chế độ xem, không lưu.

__3c. Không tải được danh mục nhân sự / khách hàng (Update PM, ô Khách hàng):__
- 3c1. Ô chọn tương ứng bị khoá kèm nút "Thử lại" (E-quan-ly-du-an-kinh-doanh-038); dữ liệu đang sửa không mất.

__6c. Dự án vừa được cấp mã trong lúc sửa (GĐK duyệt mã) mà người dùng đã đổi Khách hàng:__
- 6c1. Hệ thống không lưu, báo E-quan-ly-du-an-kinh-doanh-030 và tự nạp lại dự án theo dữ liệu mới nhất (BR-quan-ly-du-an-kinh-doanh-032 — Phase H Q-21).

__6d. Dự án vừa "Kết thúc" trong lúc sửa:__
- 6d1. Hệ thống không lưu, báo E-quan-ly-du-an-kinh-doanh-030 và nạp lại dự án (chế độ xem) (BR-quan-ly-du-an-kinh-doanh-032).

__5b. Không có trường thông tin cơ bản hay tệp nào thay đổi:__
- 5b1. Hệ thống không tạo version, không ghi lịch sử, báo "Không có thay đổi" (Đã chốt Phase H — Q-28).

__6e. Hệ thống không ghi được trọn vẹn:__
- 6e1. Báo E-quan-ly-du-an-kinh-doanh-037, không ghi gì; dữ liệu đang sửa được giữ; quay lại bước 4.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-029, -030 · BR-quan-ly-du-an-kinh-doanh-014, -026, -031, -032, -033, -037, -048 · E-quan-ly-du-an-kinh-doanh-001 → -006 · BR-quan-ly-du-an-kinh-doanh-050, -051 · E-quan-ly-du-an-kinh-doanh-030, -037, -038, -040, -041 · NFR-quan-ly-du-an-kinh-doanh-014.
