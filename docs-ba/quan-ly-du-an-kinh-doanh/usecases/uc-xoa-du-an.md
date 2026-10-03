# Use Case: GĐK xoá dự án (xoá mềm)

> Scope: MH-02c — nút "Xoá" · Level: User goal

## Primary Actor

GĐK (Giám đốc khối).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| AM / SM tạo yêu cầu | Biết yêu cầu đã bị huỷ và vì sao |
| Kiểm soát nội bộ | Truy vết được ai xoá, khi nào, vì sao |

## Trigger

GĐK bấm "Xoá" trên đầu trang chi tiết.

## Preconditions

- Người dùng là GĐK của khối dự án (BR-quan-ly-du-an-kinh-doanh-053 — Phase H Q-19); dự án ở trạng thái "Chờ duyệt mã" hoặc "Từ chối mã".

## Guarantees

- __Minimal Guarantee:__ Huỷ, thiếu lý do hoặc trạng thái / quyền không còn hợp lệ → không xoá.
- __Success Guarantee:__ Dự án được đánh dấu đã xoá, ẩn khỏi danh sách / Sổ theo dõi / Excel; nhật ký xoá ghi người xoá, thời điểm, lý do; dữ liệu và lịch sử được giữ.

## Main Success Scenario

1. GĐK bấm "Xoá" (chú thích "Xoá yêu cầu mở mã (chưa được Giám đốc khối duyệt)").
2. Hệ thống hỏi "Xoá dự án "{tên}"?" kèm ô lý do xoá bắt buộc.
3. GĐK nhập lý do và đồng ý.
4. Hệ thống kiểm lại quyền và trạng thái, đánh dấu dự án đã xoá, ghi nhật ký xoá.
5. Hệ thống về danh sách, thông báo "Đã xoá dự án".

## Extensions

__1a. Dự án đã được duyệt mã:__
- 1a1. Nút mờ, chú thích "Dự án đã được Giám đốc khối duyệt — không xoá được" (E-quan-ly-du-an-kinh-doanh-020).

__3a. Lý do trống hoặc chỉ khoảng trắng:__
- 3a1. Tô đỏ ô lý do kèm "Vui lòng nhập lý do xoá.", không xoá (E-quan-ly-du-an-kinh-doanh-029 — Phase H Q-60); quay lại bước 3.

__3b. GĐK huỷ:__
- 3b1. Không đổi (E-quan-ly-du-an-kinh-doanh-024).

__4a. Trạng thái / quyền đã đổi:__
- 4a1. Báo E-quan-ly-du-an-kinh-doanh-030, không xoá.

__1b. Đang ở chế độ sửa:__
- 1b1. Nút Xoá không hiện.

__4b. Hệ thống không ghi được trọn vẹn:__
- 4b1. Báo E-quan-ly-du-an-kinh-doanh-037; dự án không bị đánh dấu xoá, không có nhật ký xoá; hộp xoá giữ lý do.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-034 · BR-quan-ly-du-an-kinh-doanh-010, -043 · E-quan-ly-du-an-kinh-doanh-020, -024, -029, -030 · NFR-quan-ly-du-an-kinh-doanh-011 · BR-quan-ly-du-an-kinh-doanh-050 · E-quan-ly-du-an-kinh-doanh-037, -040 · NFR-quan-ly-du-an-kinh-doanh-014.
