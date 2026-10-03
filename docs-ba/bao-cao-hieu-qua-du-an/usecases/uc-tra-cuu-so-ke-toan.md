# Use Case: Tra cứu chi tiết sổ kế toán tạo nên số thực tế (P-06)

> Scope: Module Quản trị dự án & Tài chính — popup P-06 · Level: Subfunction

## Primary Actor

Người xem báo cáo (Ban lãnh đạo, GĐK, SM, Kế toán). GĐK / SM chỉ xem dự án khối mình; AM không mở được MH-03, không là actor (BR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-037 — Đã chốt Phase H — Q-19, Q-20).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Kế toán (CFO) | Mọi con số thực tế Thu / Chi truy được tới chứng từ; phát hiện lệch do dữ liệu chuyển đổi đầu kỳ hoặc mã đã thay đổi |

## Trigger

Người xem bấm con số **thực tế** của Chi phí hoặc Dòng tiền thu (khác 0) ở MH-03.

## Preconditions

- Con số thuộc chỉ tiêu Chi phí hoặc Dòng tiền thu và khác 0.

## Guarantees

- __Minimal Guarantee:__ Không thay đổi dữ liệu sổ; mỗi lần Export được ghi nhận để tra soát (NFR-bao-cao-hieu-qua-du-an-015).
- __Success Guarantee:__ Người xem thấy đúng các dòng sổ đang hiệu lực khớp mã của các dự án và kỳ đã bấm, tổng và cảnh báo nếu lệch; có thể xuất XLSX toàn bộ dòng thoả bộ lọc (tối đa 1.000.000 dòng).

## Main Success Scenario

1. Hệ thống mở P-06 với loại sổ, danh sách dự án, kỳ [từ, đến], tiêu đề phạm vi và con số đối chiếu.
2. Hệ thống lấy tập mã (Mã tổng, Mã KD, Mã SX, mọi mã outsource từng cấp kể cả đã xoá) của các dự án, lọc dòng sổ hiệu lực có mã thuộc tập và tháng trong kỳ, sắp xếp.
3. Hệ thống hiện tiêu đề "BÁO CÁO DÒNG TIỀN THU TRONG KỲ" / "CHI THỰC TẾ", dòng phụ "{kỳ} · ĐVT: VNĐ · Nguồn: sổ kế toán import", "n dòng · Tổng X", bảng (hiển thị theo từng phần khi nhiều dòng) và dòng "Tổng cộng"; số dòng, tổng và dòng Tổng cộng tính trên toàn bộ dòng thoả bộ lọc (BR-bao-cao-hieu-qua-du-an-040).
4. Người xem gõ tìm kiếm; hệ thống lọc tức thì.
5. Người xem bấm "Export XLSX"; hệ thống tải file toàn bộ dòng thoả bộ lọc và ghi nhận lần Export.
6. Người xem đóng popup (nút × hoặc bấm nền).

## Extensions

__1a. Người xem mở P-06 của dự án / phạm vi ngoài phạm vi dữ liệu của mình (vd mở trực tiếp đường dẫn):__
- 1a1. Hệ thống từ chối (E-bao-cao-hieu-qua-du-an-027), không trả dòng sổ nào; lần bị từ chối được ghi nhận.

__2a. Sổ Chi thực tế:__
- 2a1. Ô tích "Ẩn dòng bằng 0" bật sẵn, ẩn dòng có Chi SX = Chi KD = 0; người xem có thể bỏ tích.

__3a. Ô tìm trống và Tổng các dòng (làm tròn) khác con số đối chiếu:__
- 3a1. Hiện dải vàng E-bao-cao-hieu-qua-du-an-015.

__3b. Không có dòng nào:__
- 3b1. Bảng hiện "Không có dòng chi tiết nào trong kỳ." (E-bao-cao-hieu-qua-du-an-019), không có dòng tổng.

__4a. Đang tìm kiếm:__
- 4a1. Không xét cảnh báo lệch. Từ khoá được bỏ khoảng trắng đầu / cuối, tìm không dấu ("ha noi" ra "Hà Nội"); chỉ gồm khoảng trắng coi như ô tìm trống (BR-bao-cao-hieu-qua-du-an-021).

__5a. Số dòng thoả bộ lọc vượt 1.000.000:__
- 5a1. Hệ thống không xuất file, báo "Quá nhiều dòng để xuất ({n}) — vui lòng thu hẹp kỳ hoặc phạm vi." (E-bao-cao-hieu-qua-du-an-023).

__5b. Không có dòng nào thoả bộ lọc:__
- 5b1. Nút Export XLSX mờ, tooltip "Không có dòng để xuất" (FR-bao-cao-hieu-qua-du-an-020).

## Related Requirements

FR-bao-cao-hieu-qua-du-an-016, FR-bao-cao-hieu-qua-du-an-017, FR-bao-cao-hieu-qua-du-an-018, FR-bao-cao-hieu-qua-du-an-019, FR-bao-cao-hieu-qua-du-an-020, FR-bao-cao-hieu-qua-du-an-021 · BR-bao-cao-hieu-qua-du-an-018, BR-bao-cao-hieu-qua-du-an-019, BR-bao-cao-hieu-qua-du-an-020, BR-bao-cao-hieu-qua-du-an-021, BR-bao-cao-hieu-qua-du-an-022, BR-bao-cao-hieu-qua-du-an-023, BR-bao-cao-hieu-qua-du-an-024, BR-bao-cao-hieu-qua-du-an-037, BR-bao-cao-hieu-qua-du-an-040 · E-bao-cao-hieu-qua-du-an-015, E-bao-cao-hieu-qua-du-an-019, E-bao-cao-hieu-qua-du-an-023, E-bao-cao-hieu-qua-du-an-027 · NFR-bao-cao-hieu-qua-du-an-008, NFR-bao-cao-hieu-qua-du-an-011, NFR-bao-cao-hieu-qua-du-an-015
