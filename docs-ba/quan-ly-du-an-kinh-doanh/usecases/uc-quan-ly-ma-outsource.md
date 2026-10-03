# Use Case: Tạo / đổi PM / xoá mã outsource

> Scope: MH-02c — khung "Mã dự án" · Level: Subfunction

## Primary Actor

SM, GĐK, Kế toán.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Kế toán | Hạch toán chi phí thuê ngoài theo mã; số mã đã xoá không bị cấp lại cho phần việc khác |
| PM outsource | Được gắn đúng mã |

## Trigger

Người dùng bấm "Tạo mã outsource ({n}/2)", đổi ô PM của một mã, hoặc bấm thùng rác cạnh mã.

## Preconditions

- Dự án đã có mã tổng và không ở trạng thái "Kết thúc"; người dùng là SM / GĐK / Kế toán.

## Guarantees

- __Minimal Guarantee:__ Đủ 2 mã thì không tạo thêm; huỷ xác nhận xoá thì mã giữ nguyên.
- __Success Guarantee:__ Mã mới / PM mới / mã bị xoá được lưu ngay và ghi lịch sử (không tăng version); số đã xoá không được cấp lại.

## Main Success Scenario

1. Người dùng bấm "Tạo mã outsource (n/2)".
2. Hệ thống kiểm lại số mã đang có, trạng thái và quyền, rồi cấp mã = mã tổng + hậu tố (mã đầu tiên `.3`, mã sau = hậu tố lớn nhất từng cấp + 1, không dùng lại số đã xoá), gán PM = PM outsource mặc định của dự án, sắp danh sách theo mã.
3. Hệ thống ghi lịch sử "Tạo mã outsource" — "{mã} · PM {tên}" và hiện dòng mã mới với ô chọn PM + nút xoá.
4. Người dùng chọn PM khác cho mã (danh mục nhân sự IMIS).
5. Hệ thống lưu ngay, lịch sử "Cập nhật PM outsource" — "{mã} · {PM}".

## Extensions

__1a. Đã có 2 mã:__
- 1a1. Nút mờ, chú thích "Tối đa 2 mã outsource" (E-quan-ly-du-an-kinh-doanh-021). Xoá bớt một mã thì tạo tiếp được với số mới (vd đã dùng `.3`, `.4` → `.5`) (Đã chốt Phase H — Q-49).

__4a. Chọn "— Chọn PM outsource —" (bỏ PM):__
- 4a1. Lịch sử "{mã} · bỏ PM".

__*a. Bấm thùng rác:__
- *a1. Hệ thống hỏi xác nhận "Xoá mã outsource {mã}? Số này sẽ không được dùng lại." (Phase H Q-60).
- *a2. Đồng ý → xoá mã, lịch sử "Xoá mã outsource" — "{mã}"; huỷ → không đổi.

__*b. Dự án "Kết thúc" hoặc người dùng là AM:__
- *b1. Chỉ xem mã và PM, không có nút tạo / ô chọn PM / nút xoá.

__1b. Tại lúc tạo, người khác vừa tạo đủ 2 mã hoặc dự án vừa "Kết thúc":__
- 1b1. Không tạo, báo E-quan-ly-du-an-kinh-doanh-030.

__4b. Không tải được danh mục nhân sự:__
- 4b1. Ô chọn PM bị khoá kèm nút "Thử lại" (E-quan-ly-du-an-kinh-doanh-038).

__*c. Hệ thống không ghi được trọn vẹn (tạo / đổi PM / xoá):__
- *c1. Báo E-quan-ly-du-an-kinh-doanh-037, mã và PM giữ nguyên.

## Related Requirements

FR-quan-ly-du-an-kinh-doanh-021, -022, -023 · BR-quan-ly-du-an-kinh-doanh-008, -033, -038 · E-quan-ly-du-an-kinh-doanh-021 · E-quan-ly-du-an-kinh-doanh-030, -037, -038.
