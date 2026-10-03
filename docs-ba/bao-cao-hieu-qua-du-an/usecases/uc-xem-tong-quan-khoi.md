# Use Case: Xem tổng quan hiệu quả cả khối / công ty

> Scope: Module Quản trị dự án & Tài chính — màn MH-03, tab "Tổng quan cả khối / công ty" · Level: User goal (sea-level)

## Primary Actor

Người xem báo cáo (Ban lãnh đạo, GĐK, SM, Kế toán). GĐK / SM chỉ xem dự án khối mình; AM không mở được MH-03, không là actor (BR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-037 — Đã chốt Phase H — Q-19, Q-20).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| Ban lãnh đạo | Thấy dự án nào lệch kế hoạch cùng kỳ để can thiệp |
| Kế toán (CFO) | Số thực tế trên báo cáo khớp sổ kế toán và số đã import |

## Trigger

Người xem chọn menu "Quản trị dự án & Tài chính → Báo cáo hiệu quả dự án".

## Preconditions

- Người xem đã đăng nhập với một vai trò xem báo cáo.
- Có dự án thuộc báo cáo (đã có PAKD được duyệt hoặc đã có số thực tế đã ghi nhận ở bất kỳ chỉ tiêu nào) để báo cáo có số liệu.

## Guarantees

- __Minimal Guarantee:__ Màn chỉ đọc — không thay đổi dữ liệu nào khi xem / lọc.
- __Success Guarantee:__ Người xem thấy 5 ô số, biểu đồ Kế hoạch – Thực tế và bảng chi tiết có mức sức khoẻ của mọi dự án thuộc báo cáo trong phạm vi; mỗi chỉ tiêu tính trên kỳ so sánh cắt tại Chốt số đến của chính nó.

## Main Success Scenario

1. Người xem mở màn.
2. Hệ thống tính Chốt số đến riêng cho Doanh thu, Chi phí, Dòng tiền thu, KLCV và hiện meta "Chốt số: DT MM/YYYY · CP MM/YYYY · DTT MM/YYYY · KLCV MM/YYYY · Số dự án"; nút Import sổ kế toán chỉ hiện nếu người xem là Kế toán.
3. Hệ thống mở tab "Tổng quan cả khối / công ty" với kỳ mặc định (Đến = chốt số muộn nhất trong 4 chỉ tiêu, Từ = tháng 01 năm đó — BR-bao-cao-hieu-qua-du-an-004), Phạm vi "Toàn công ty" (Kế toán, Ban lãnh đạo) hoặc khối của tài khoản (GĐK, SM — BR-bao-cao-hieu-qua-du-an-005), chỉ tiêu Doanh thu, trục Theo tháng, lọc sức khoẻ Tất cả.
4. Người xem điều chỉnh Từ tháng / Đến tháng / Phạm vi xem (GĐK, SM không đổi được khối).
5. Hệ thống lấy các dự án thuộc báo cáo trong phạm vi (và trong phạm vi dữ liệu của người xem), cắt kỳ so sánh từng chỉ tiêu tại min(Đến tháng, chốt số của chỉ tiêu), cộng Kế hoạch / Thực tế và xếp mức sức khoẻ từng dự án.
6. Hệ thống hiện 5 ô số (Biên lợi nhuận gộp, Doanh thu, Chi phí, Dòng tiền thu, KLCV) với % hoàn thành và màu tốt / xấu (Chi phí đảo chiều).
7. Người xem chọn chỉ tiêu và trục cho biểu đồ; hệ thống vẽ cột Kế hoạch / Thực tế.
8. Người xem lọc bảng theo mức sức khoẻ; hệ thống hiện các dự án ở mức đó và dòng "Tổng cộng (n dự án)".
9. Người xem đọc khung "Định nghĩa về mức sức khoẻ" để hiểu điều kiện xếp mức.

## Extensions

__1a. Người dùng không có vai trò xem báo cáo (gồm AM):__
- 1a1. Menu không hiện; mở trực tiếp bị từ chối với E-bao-cao-hieu-qua-du-an-027 "Bạn không có quyền thực hiện thao tác này." và được ghi nhận để tra soát (NFR-bao-cao-hieu-qua-du-an-011, NFR-bao-cao-hieu-qua-du-an-015). Use case kết thúc.

__1b. GĐK / SM mở trực tiếp phạm vi hoặc dự án ngoài khối của mình:__
- 1b1. Hệ thống từ chối (E-bao-cao-hieu-qua-du-an-027), không trả số liệu ngoài khối; lần bị từ chối được ghi nhận.

__2a. Một chỉ tiêu chưa có số thực tế ở dự án nào (chưa có Chốt số):__
- 2a1. Meta hiện "—" cho chỉ tiêu đó; ô số và cột Thực tế của chỉ tiêu hiện "—" kèm "Chưa có số thực tế"; chỉ tiêu bị bỏ qua khi tính % và xếp mức (BR-bao-cao-hieu-qua-du-an-002, E-bao-cao-hieu-qua-du-an-020).

__2b. Chưa dự án nào có số thực tế:__
- 2b1. Mọi dự án xếp "Chưa phát sinh".

__4a. Người xem chuyển sang tab "Tổng quan dự án" rồi quay lại:__
- 4a1. Hệ thống giữ nguyên Từ / Đến, Phạm vi, chỉ tiêu, trục, lọc sức khoẻ.

__7a. Không có nhóm cột nào trong kỳ:__
- 7a1. Biểu đồ hiện "Không có số liệu trong kỳ." (E-bao-cao-hieu-qua-du-an-017).

__8a. Không có dự án ở mức đang lọc:__
- 8a1. Bảng hiện "Không có dự án nào ở mức này.", ẩn dòng tổng (E-bao-cao-hieu-qua-du-an-016).

__8b. Người xem bấm 1 dòng dự án:__
- 8b1. Hệ thống chuyển sang tab "Tổng quan dự án" với dự án đó (UC uc-xem-tong-quan-du-an).

__6a / 8c. Người xem bấm con số thực tế Chi phí / Dòng tiền thu (khác 0):__
- 6a1. Hệ thống mở P-06 với phạm vi và kỳ so sánh của chỉ tiêu đó (UC uc-tra-cuu-so-ke-toan).

## Related Requirements

FR-bao-cao-hieu-qua-du-an-001, FR-bao-cao-hieu-qua-du-an-002, FR-bao-cao-hieu-qua-du-an-003, FR-bao-cao-hieu-qua-du-an-004, FR-bao-cao-hieu-qua-du-an-005, FR-bao-cao-hieu-qua-du-an-006, FR-bao-cao-hieu-qua-du-an-007, FR-bao-cao-hieu-qua-du-an-008, FR-bao-cao-hieu-qua-du-an-009, FR-bao-cao-hieu-qua-du-an-010, FR-bao-cao-hieu-qua-du-an-016 · BR-bao-cao-hieu-qua-du-an-001, BR-bao-cao-hieu-qua-du-an-002, BR-bao-cao-hieu-qua-du-an-003, BR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-006, BR-bao-cao-hieu-qua-du-an-007, BR-bao-cao-hieu-qua-du-an-008, BR-bao-cao-hieu-qua-du-an-009, BR-bao-cao-hieu-qua-du-an-010, BR-bao-cao-hieu-qua-du-an-011, BR-bao-cao-hieu-qua-du-an-012, BR-bao-cao-hieu-qua-du-an-013, BR-bao-cao-hieu-qua-du-an-014, BR-bao-cao-hieu-qua-du-an-034, BR-bao-cao-hieu-qua-du-an-036, BR-bao-cao-hieu-qua-du-an-037 · E-bao-cao-hieu-qua-du-an-016, E-bao-cao-hieu-qua-du-an-017, E-bao-cao-hieu-qua-du-an-020, E-bao-cao-hieu-qua-du-an-027 · NFR-bao-cao-hieu-qua-du-an-003, NFR-bao-cao-hieu-qua-du-an-005, NFR-bao-cao-hieu-qua-du-an-006, NFR-bao-cao-hieu-qua-du-an-008, NFR-bao-cao-hieu-qua-du-an-011, NFR-bao-cao-hieu-qua-du-an-015 · OQ-5, OQ-10, OQ-21
