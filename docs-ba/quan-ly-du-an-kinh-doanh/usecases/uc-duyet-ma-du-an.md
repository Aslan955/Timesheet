# Use Case: GĐK duyệt mã dự án

> Scope: MH-02c — nút "Duyệt mã dự án" · Level: User goal

## Primary Actor

GĐK (Giám đốc khối).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| AM / SM đã gửi yêu cầu | Có mã để bắt đầu lập PAKD |
| Kế toán | Mã không trùng, đúng quy tắc để ghép sổ kế toán |

## Trigger

GĐK mở chi tiết dự án "Chờ duyệt mã" (từ link "Duyệt mã" hoặc bấm dòng) và bấm "Duyệt mã dự án".

## Preconditions

- Dự án ở trạng thái "Chờ duyệt mã"; người dùng là GĐK của khối dự án (BR-quan-ly-du-an-kinh-doanh-053 — Phase H Q-19).

## Guarantees

- __Minimal Guarantee:__ Huỷ xác nhận, khách hàng hết số thứ tự hoặc trạng thái đã đổi → dự án giữ nguyên.
- __Success Guarantee:__ Dự án "Chưa có PAKD", có mã tổng (không trùng) / KD / SX, ngày cấp mã = hôm nay, hạn lập PAKD = hôm nay + 30; lịch sử "Duyệt mã dự án".

## Main Success Scenario

1. Hệ thống hiện nút "Duyệt mã dự án" và "Từ chối mã" (đầu trang) và dòng thông báo "Yêu cầu mở mã dự án đang chờ Giám đốc khối duyệt — bấm Duyệt mã dự án ở góc phải. Duyệt xong hệ thống sinh Mã dự án / Mã KD / Mã SX và bắt đầu đếm 30 ngày lập PAKD."
2. GĐK bấm "Duyệt mã dự án".
3. Hệ thống hỏi xác nhận "Duyệt mã cho dự án {tên}? Hệ thống sẽ sinh Mã dự án / Mã KD / Mã SX và bắt đầu đếm 30 ngày lập PAKD." (Phase H Q-60).
4. GĐK đồng ý.
5. Hệ thống kiểm lại trạng thái, sinh mã tổng theo khách hàng (BR-quan-ly-du-an-kinh-doanh-006), mã KD `.1`, mã SX `.2`, chuyển "Chưa có PAKD", ghi ngày cấp mã + hạn PAKD.
6. Hệ thống ghi lịch sử "Duyệt mã dự án" — "Cấp mã {mã} · Hạn lập PAKD: {dd/mm/yyyy}" và hiện thông báo "Đã duyệt — hệ thống cấp mã {mã} (KD {mã}.1 · SX {mã}.2), hạn lập PAKD {dd/mm/yyyy}".
7. Khung PAKD xuất hiện (với SM / GĐK / Kế toán); dòng thông báo chuyển sang bước lập PAKD.

## Extensions

__2a. GĐK muốn từ chối yêu cầu:__
- 2a1. → UC-tu-choi-ma-du-an.

__4a. GĐK huỷ xác nhận:__
- 4a1. Không đổi gì.

__5a. Số thứ tự mã tổng lớn nhất của khách hàng đã là 999:__
- 5a1. Hệ thống báo E-quan-ly-du-an-kinh-doanh-027; dự án giữ "Chờ duyệt mã".

__5b. Trạng thái dự án đã đổi (vd đã bị xoá / duyệt bởi người khác):__
- 5b1. Hệ thống báo E-quan-ly-du-an-kinh-doanh-030, không thực hiện.

__1a. Người dùng không phải GĐK:__
- 1a1. Chỉ thấy dải xám "Đang chờ Giám đốc khối duyệt mã dự án." (E-quan-ly-du-an-kinh-doanh-023).

__5c. Hệ thống không ghi được trọn vẹn:__
- 5c1. Báo E-quan-ly-du-an-kinh-doanh-037; dự án giữ "Chờ duyệt mã", không chiếm số thứ tự; GĐK bấm duyệt lại.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-015, -020, -028 · BR-quan-ly-du-an-kinh-doanh-005 → -007, -009 · E-quan-ly-du-an-kinh-doanh-023, -027, -030 · E-quan-ly-du-an-kinh-doanh-037 · NFR-quan-ly-du-an-kinh-doanh-014.
