---
type: test-checklist-index
feature: bao-cao-hieu-qua-du-an
status: draft
updated: 2026-10-03
next_chk_id: 558
links:
  - docs/bao-cao-hieu-qua-du-an/srs/bao-cao-hieu-qua-du-an-spec.md
  - docs/bao-cao-hieu-qua-du-an/usecases/bao-cao-hieu-qua-du-an-usecase-index.md
  - docs/bao-cao-hieu-qua-du-an/test/test-strategy.md
---

# Test Checklists — bao-cao-hieu-qua-du-an

## Checklists

| Scope | Target | File | Items | P1 | P2 | P3 | P4 | Auto | Status | Updated |
|-------|--------|------|-------|----|----|----|----|------|--------|---------|
| uc | uc-xem-tong-quan-khoi | [checklist-uc-xem-tong-quan-khoi.md](checklist-uc-xem-tong-quan-khoi.md) | 168 | 85 | 62 | 18 | 3 | 163/5 | draft | 2026-10-03 |
| uc | uc-xem-tong-quan-du-an | [checklist-uc-xem-tong-quan-du-an.md](checklist-uc-xem-tong-quan-du-an.md) | 70 | 34 | 29 | 7 | 0 | 70/0 | draft | 2026-10-03 |
| uc | uc-tra-cuu-so-ke-toan | [checklist-uc-tra-cuu-so-ke-toan.md](checklist-uc-tra-cuu-so-ke-toan.md) | 84 | 20 | 49 | 15 | 0 | 83/1 | draft | 2026-10-03 |
| uc | uc-import-so-ke-toan | [checklist-uc-import-so-ke-toan.md](checklist-uc-import-so-ke-toan.md) | 192 | 76 | 104 | 12 | 0 | 169/23 | draft | 2026-10-03 |
| uc | chung (cross-cutting) | [checklist-uc-chung.md](checklist-uc-chung.md) | 43 | 22 | 5 | 16 | 0 | 23/20 | draft | 2026-10-03 |

Tập UAT: 150 mục — xem mục Tập UAT.

## Coverage

> Đối chiếu nghĩa vụ test ↔ CHK (per-obligation). Nguồn edge VERIFIES cho KG. Coverage table là **bản đồ điều hướng**, KHÔNG phải nguồn nội dung TC. Tầng: UI · API · —. Trạng thái: covered · excluded-approved · blocked · tbd · partial.

| Source ID | Nghĩa vụ (obligation) | Scope | CHK-ID | Tầng | Trạng thái | Lý do (nếu excluded) |
|-----------|----------------------|-------|--------|------|-----------|----------------------|
| FR-bao-cao-hieu-qua-du-an-001 | happy: menu mở MH-03, thanh tiêu đề đủ thành phần | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-001, CHK-bao-cao-hieu-qua-du-an-002 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-001 | nút Import sổ kế toán chỉ hiện với Kế toán | xem-tong-quan-khoi, chung | CHK-bao-cao-hieu-qua-du-an-003, CHK-bao-cao-hieu-qua-du-an-520, CHK-bao-cao-hieu-qua-du-an-521, CHK-bao-cao-hieu-qua-du-an-522 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-001 | AM: menu ẩn | chung | CHK-bao-cao-hieu-qua-du-an-515 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-001 | meta Số dự án theo phạm vi dữ liệu người xem | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-010, CHK-bao-cao-hieu-qua-du-an-011 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-002 | happy: meta Chốt số đủ 4 chỉ tiêu | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-004 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-002 | chỉ tiêu chưa có số thực tế hiện "—" | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-005 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-002 | người dùng không chọn được Chốt số | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-009 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-002 | alternate: import số thực tế mới → chỉ chốt số chỉ tiêu tương ứng đổi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-465, CHK-bao-cao-hieu-qua-du-an-466, CHK-bao-cao-hieu-qua-du-an-467 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-003 | happy: 2 tab, mặc định tab tổng quan | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-001 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-003 | giữ Từ / Đến, Phạm vi, trục, lọc sức khoẻ khi chuyển tab | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-164, CHK-bao-cao-hieu-qua-du-an-165, CHK-bao-cao-hieu-qua-du-an-166, CHK-bao-cao-hieu-qua-du-an-167 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-003 | chỉ tiêu dùng chung 2 tab | xem-tong-quan-khoi, xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-168, CHK-bao-cao-hieu-qua-du-an-172 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-003 | giữ dự án đang chọn ở tab dự án | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-183 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-003 | tab dự án không có bộ lọc kỳ | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-182 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-004 | happy: Từ / Đến / Phạm vi áp cho 5 ô số, biểu đồ, bảng | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-032, CHK-bao-cao-hieu-qua-du-an-047, CHK-bao-cao-hieu-qua-du-an-048, CHK-bao-cao-hieu-qua-du-an-049 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-004 | Kế toán, Ban lãnh đạo: Toàn công ty + 6 khối, mặc định Toàn công ty | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-041, CHK-bao-cao-hieu-qua-du-an-042, CHK-bao-cao-hieu-qua-du-an-043, CHK-bao-cao-hieu-qua-du-an-044 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-004 | GĐK, SM: ô Phạm vi cố định khối mình | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-045, CHK-bao-cao-hieu-qua-du-an-046 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-005 | happy: 5 ô số cộng đúng kỳ so sánh của từng chỉ tiêu | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-051, CHK-bao-cao-hieu-qua-du-an-054, CHK-bao-cao-hieu-qua-du-an-055, CHK-bao-cao-hieu-qua-du-an-056, CHK-bao-cao-hieu-qua-du-an-057, CHK-bao-cao-hieu-qua-du-an-058, CHK-bao-cao-hieu-qua-du-an-059 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-005 | ô Biên lợi nhuận gộp: dòng Kế hoạch | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-069 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-005 | chỉ tiêu chưa có Chốt số: "—" kèm "Chưa có số thực tế", không nhãn % | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-066, CHK-bao-cao-hieu-qua-du-an-067 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-005 | bấm số thực tế Chi phí / Dòng tiền thu mở P-06 đúng phạm vi và kỳ | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-079, CHK-bao-cao-hieu-qua-du-an-080 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-006 | happy: biểu đồ cột nhóm, nút gạt chỉ tiêu + trục, chú giải ĐVT | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-085, CHK-bao-cao-hieu-qua-du-an-086, CHK-bao-cao-hieu-qua-du-an-087, CHK-bao-cao-hieu-qua-du-an-088, CHK-bao-cao-hieu-qua-du-an-089 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-006 | tooltip Kế hoạch / Thực tế / Hoàn thành, "chưa chốt số" | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-091, CHK-bao-cao-hieu-qua-du-an-093, CHK-bao-cao-hieu-qua-du-an-094 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-006 | không có nhóm cột → thông báo | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-104 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-007 | happy: cột bảng, Mã dự án, Start / End, chân khung | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-106, CHK-bao-cao-hieu-qua-du-an-107, CHK-bao-cao-hieu-qua-du-an-108, CHK-bao-cao-hieu-qua-du-an-110 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-007 | mỗi nhóm chỉ tiêu tính trên kỳ của chỉ tiêu đó | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-112 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-007 | chỉ tiêu chưa có Chốt số: Thực tế, Chênh lệch "—" | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-113, CHK-bao-cao-hieu-qua-du-an-114 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-007 | dự án ngoài BR-034 không có dòng | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-016, CHK-bao-cao-hieu-qua-du-an-017 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-007 | dòng Tổng cộng | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-124 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-007 | bấm dòng chuyển tab dự án | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-129 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-007 | bấm số thực tế Chi phí / Dòng tiền thu của dòng, dòng tổng → P-06 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-130, CHK-bao-cao-hieu-qua-du-an-131 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-008 | happy: nút gạt Sức khoẻ có n theo phạm vi, lọc bảng | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-132, CHK-bao-cao-hieu-qua-du-an-133, CHK-bao-cao-hieu-qua-du-an-134 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-008 | không còn dòng → E-016 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-135 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-009 | happy: mỗi dự án đúng 1 mức theo thứ tự xét | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-139, CHK-bao-cao-hieu-qua-du-an-142, CHK-bao-cao-hieu-qua-du-an-143, CHK-bao-cao-hieu-qua-du-an-146, CHK-bao-cao-hieu-qua-du-an-147, CHK-bao-cao-hieu-qua-du-an-150, CHK-bao-cao-hieu-qua-du-an-157 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-009 | nhãn mức có màu / chữ | xem-tong-quan-khoi, chung | CHK-bao-cao-hieu-qua-du-an-158, CHK-bao-cao-hieu-qua-du-an-549 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-010 | khung Định nghĩa: 2 cột, 4 dòng, điều kiện CP KH = 0, mọi chỉ tiêu bị bỏ qua, chân khung, chỉ xem | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-159, CHK-bao-cao-hieu-qua-du-an-160, CHK-bao-cao-hieu-qua-du-an-161, CHK-bao-cao-hieu-qua-du-an-162, CHK-bao-cao-hieu-qua-du-an-163 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-011 | happy: ô Dự án chỉ dự án thuộc báo cáo, nhóm theo khối, mục "<Mã tổng> — <Tên>" | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-175, CHK-bao-cao-hieu-qua-du-an-176, CHK-bao-cao-hieu-qua-du-an-177 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-011 | GĐK / SM chỉ dự án khối mình | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-178 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-011 | dự án mặc định: vừa bấm → đầu tiên có số thực tế → đầu tiên | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-169, CHK-bao-cao-hieu-qua-du-an-170, CHK-bao-cao-hieu-qua-du-an-171 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-011 | chỉ tiêu mặc định Doanh thu, dùng chung tab tổng quan | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-172, CHK-bao-cao-hieu-qua-du-an-173, CHK-bao-cao-hieu-qua-du-an-174 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-011 | đổi dự án cập nhật tab | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-179 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-011 | không có dự án → E-018 | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-180 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-012 | happy: lưới thông tin dự án chỉ xem | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-184, CHK-bao-cao-hieu-qua-du-an-185, CHK-bao-cao-hieu-qua-du-an-186, CHK-bao-cao-hieu-qua-du-an-187 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-013 | happy: 5 ô số vòng đời / luỹ kế | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-188, CHK-bao-cao-hieu-qua-du-an-191, CHK-bao-cao-hieu-qua-du-an-192, CHK-bao-cao-hieu-qua-du-an-193, CHK-bao-cao-hieu-qua-du-an-195 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-013 | dự án chưa có số thực tế của chỉ tiêu: "Chưa có số thực tế" / "Chưa phát sinh" | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-203, CHK-bao-cao-hieu-qua-du-an-204 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-013 | luỹ kế cắt đúng Chốt số của chỉ tiêu đang chọn | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-202 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-013 | ô Luỹ kế TT bấm được với Chi phí / Dòng tiền thu | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-211 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-014 | happy: biểu đồ "<Chỉ tiêu> theo tháng" trên vòng đời, tháng sau chốt số chỉ cột KH | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-213, CHK-bao-cao-hieu-qua-du-an-214, CHK-bao-cao-hieu-qua-du-an-215, CHK-bao-cao-hieu-qua-du-an-216 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-015 | happy: cột, nhãn "Chốt số", nền xám, chân khung | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-217, CHK-bao-cao-hieu-qua-du-an-218, CHK-bao-cao-hieu-qua-du-an-219, CHK-bao-cao-hieu-qua-du-an-220, CHK-bao-cao-hieu-qua-du-an-221 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-015 | tháng chưa có số thực tế hiện "–" (không phải 0) | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-222 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-015 | bấm Thực tế tháng / Luỹ kế / dòng tổng → P-06 đúng kỳ | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-234, CHK-bao-cao-hieu-qua-du-an-235, CHK-bao-cao-hieu-qua-du-an-236 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-016 | happy: số thực tế Chi phí / Dòng tiền thu khác 0 gạch chân, tooltip, mở P-06 với loại sổ / dự án / kỳ | xem-tong-quan-khoi, tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-078, CHK-bao-cao-hieu-qua-du-an-079, CHK-bao-cao-hieu-qua-du-an-248, CHK-bao-cao-hieu-qua-du-an-256 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-016 | Doanh thu / KLCV không bấm được | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-082, CHK-bao-cao-hieu-qua-du-an-083 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-017 | happy: tiêu đề, dòng phụ phạm vi, kỳ 2 dạng | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-239, CHK-bao-cao-hieu-qua-du-an-240, CHK-bao-cao-hieu-qua-du-an-241, CHK-bao-cao-hieu-qua-du-an-242, CHK-bao-cao-hieu-qua-du-an-243 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-017 | sổ thu 8 cột, sổ chi 5 cột có "Mã KD" | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-244, CHK-bao-cao-hieu-qua-du-an-245 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-017 | dòng Tổng cộng, "Tổng chi", "n dòng · Tổng X" | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-261, CHK-bao-cao-hieu-qua-du-an-262, CHK-bao-cao-hieu-qua-du-an-263, CHK-bao-cao-hieu-qua-du-an-283 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-017 | hiển thị theo từng phần khi nhiều dòng | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-264 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-017 | không có dòng → E-019 | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-267 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-018 | happy: placeholder 2 loại sổ, lọc tức thì | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-269, CHK-bao-cao-hieu-qua-du-an-270, CHK-bao-cao-hieu-qua-du-an-271 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-019 | happy: ô tích mặc định bật, ẩn dòng Chi SX = Chi KD = 0 | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-286, CHK-bao-cao-hieu-qua-du-an-287, CHK-bao-cao-hieu-qua-du-an-288 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-019 | alternate: bỏ tích hiện lại; sổ thu không có ô tích | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-289, CHK-bao-cao-hieu-qua-du-an-290 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-020 | happy: Export xuất đúng dòng thoả bộ lọc | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-296, CHK-bao-cao-hieu-qua-du-an-297 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-020 | mọi vai trò xem báo cáo dùng được | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-316, CHK-bao-cao-hieu-qua-du-an-317, CHK-bao-cao-hieu-qua-du-an-318 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-020 | 0 dòng → nút mờ, tooltip "Không có dòng để xuất" | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-309, CHK-bao-cao-hieu-qua-du-an-310 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-020 | mỗi lần Export được ghi nhận tra soát | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-320 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-021 | happy: tổng khác con số vừa bấm → dải vàng; khớp → không | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-291, CHK-bao-cao-hieu-qua-du-an-292 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-022 | happy: popup + 2 file mẫu đúng tên, sheet, tiêu đề, cột "Mã KD" | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-323, CHK-bao-cao-hieu-qua-du-an-324, CHK-bao-cao-hieu-qua-du-an-325, CHK-bao-cao-hieu-qua-du-an-326, CHK-bao-cao-hieu-qua-du-an-327, CHK-bao-cao-hieu-qua-du-an-328, CHK-bao-cao-hieu-qua-du-an-329, CHK-bao-cao-hieu-qua-du-an-330, CHK-bao-cao-hieu-qua-du-an-331, CHK-bao-cao-hieu-qua-du-an-332, CHK-bao-cao-hieu-qua-du-an-333 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-023 | happy: kéo thả / bấm chọn, tên file, chỉ lấy file đầu | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-334, CHK-bao-cao-hieu-qua-du-an-335, CHK-bao-cao-hieu-qua-du-an-336, CHK-bao-cao-hieu-qua-du-an-337 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-023 | kiểm đuôi, đọc file, giới hạn 20 MB / 50.000 dòng, bảng mã CSV | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-341, CHK-bao-cao-hieu-qua-du-an-344, CHK-bao-cao-hieu-qua-du-an-345, CHK-bao-cao-hieu-qua-du-an-347, CHK-bao-cao-hieu-qua-du-an-349 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-024 | happy: tự nhận loại sổ, ánh xạ cột | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-360, CHK-bao-cao-hieu-qua-du-an-361 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-024 | không nhận ra loại sổ / thiếu cột bắt buộc | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-354, CHK-bao-cao-hieu-qua-du-an-356, CHK-bao-cao-hieu-qua-du-an-357 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-025 | happy: kiểm từng dòng, lỗi dòng, lỗi tháng tương lai, cảnh báo, file rỗng | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-358, CHK-bao-cao-hieu-qua-du-an-370, CHK-bao-cao-hieu-qua-du-an-372, CHK-bao-cao-hieu-qua-du-an-374, CHK-bao-cao-hieu-qua-du-an-375, CHK-bao-cao-hieu-qua-du-an-376, CHK-bao-cao-hieu-qua-du-an-378, CHK-bao-cao-hieu-qua-du-an-405, CHK-bao-cao-hieu-qua-du-an-408 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-026 | happy: chip, danh sách lỗi / cảnh báo, bảng tổng hợp, dòng "Không gắn / chưa khớp dự án" | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-336, CHK-bao-cao-hieu-qua-du-an-410, CHK-bao-cao-hieu-qua-du-an-412, CHK-bao-cao-hieu-qua-du-an-413, CHK-bao-cao-hieu-qua-du-an-414, CHK-bao-cao-hieu-qua-du-an-415, CHK-bao-cao-hieu-qua-du-an-416, CHK-bao-cao-hieu-qua-du-an-417, CHK-bao-cao-hieu-qua-du-an-418, CHK-bao-cao-hieu-qua-du-an-419 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-026 | dải vàng nêu số dòng sổ hiện có, gồm dòng không gắn dự án | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-423, CHK-bao-cao-hieu-qua-du-an-424 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-027 | happy: nút bật khi 0 lỗi; ghi, đóng popup, toast | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-435, CHK-bao-cao-hieu-qua-du-an-443, CHK-bao-cao-hieu-qua-du-an-445, CHK-bao-cao-hieu-qua-du-an-448 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-027 | alternate: sổ chưa có dòng các tháng trong file → ghi không qua hộp xác nhận | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-444 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-027 | toast {m} gồm dự án chỉ có dòng bị thay | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-446 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-027 | bấm lặp chỉ ghi 1 lần, nút mờ khi đang ghi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-475, CHK-bao-cao-hieu-qua-du-an-476 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-028 | happy: Chọn lại xoá kết quả; Huỷ / nền / × đóng, không ghi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-494, CHK-bao-cao-hieu-qua-du-an-495, CHK-bao-cao-hieu-qua-du-an-496, CHK-bao-cao-hieu-qua-du-an-497, CHK-bao-cao-hieu-qua-du-an-498, CHK-bao-cao-hieu-qua-du-an-499 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-029 | happy: nút tải danh sách lỗi, cột Dòng / lý do, lỗi cấp file để trống | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-426, CHK-bao-cao-hieu-qua-du-an-427, CHK-bao-cao-hieu-qua-du-an-428, CHK-bao-cao-hieu-qua-du-an-430, CHK-bao-cao-hieu-qua-du-an-431, CHK-bao-cao-hieu-qua-du-an-432 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-029 | số Dòng khớp số dòng thật trên sheet | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-429 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-029 | tải file không đổi trạng thái popup | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-433 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-030 | happy: hộp xác nhận đúng câu, đồng ý mới ghi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-437, CHK-bao-cao-hieu-qua-du-an-443 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-030 | quay lại: không ghi, giữ xem trước | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-442 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-030 | {n} = 0 vẫn hiện câu đầy đủ (giả định Mục 11) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-441 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-030 | rời bước xem trước (Back / F5) không ghi | chung | CHK-bao-cao-hieu-qua-du-an-554, CHK-bao-cao-hieu-qua-du-an-555 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-031 | happy: 10 lần gần nhất, cả 2 loại sổ, mới nhất trên cùng, đủ cột, giờ Việt Nam | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-473, CHK-bao-cao-hieu-qua-du-an-500, CHK-bao-cao-hieu-qua-du-an-501, CHK-bao-cao-hieu-qua-du-an-502, CHK-bao-cao-hieu-qua-du-an-503, CHK-bao-cao-hieu-qua-du-an-504 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-031 | chỉ Kế toán thấy | chung | CHK-bao-cao-hieu-qua-du-an-524 | UI | covered | — |
| FR-bao-cao-hieu-qua-du-an-031 | không có màn xem dòng bị thay / tệp gốc | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-505 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-001 | lưu bền: tải lại trang / đăng nhập lại vẫn thấy số mới | import-so-ke-toan, chung | CHK-bao-cao-hieu-qua-du-an-449, CHK-bao-cao-hieu-qua-du-an-450, CHK-bao-cao-hieu-qua-du-an-556 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-001 | dòng bị thay hết hiệu lực: không ở P-06, còn trong lưu trữ | tra-cuu-so-ke-toan, import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-258, CHK-bao-cao-hieu-qua-du-an-454 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-001 | tệp gốc lưu kèm nhật ký import | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-455 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-002 | nhận .xlsx / .xls / .csv, chỉ đọc sheet đầu | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-338, CHK-bao-cao-hieu-qua-du-an-339, CHK-bao-cao-hieu-qua-du-an-340 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-002 | giới hạn 20 MB / 50.000 dòng (biên) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-346, CHK-bao-cao-hieu-qua-du-an-347, CHK-bao-cao-hieu-qua-du-an-348, CHK-bao-cao-hieu-qua-du-an-349 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-002 | CSV phải UTF-8, sai bảng mã không đọc tiếp | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-351, CHK-bao-cao-hieu-qua-du-an-352 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-003 | bảng cuộn ngang cột Mã dự án cố định; dòng tổng nền vàng | xem-tong-quan-khoi, chung | CHK-bao-cao-hieu-qua-du-an-109, CHK-bao-cao-hieu-qua-du-an-128, CHK-bao-cao-hieu-qua-du-an-551 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-004 | toast tự ẩn sau 3 giây | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-447 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-005 | màu Kế hoạch / Thực tế, trục Y 5 vạch | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-099, CHK-bao-cao-hieu-qua-du-an-100 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-006 | định dạng số, ngày, tháng | xem-tong-quan-khoi, tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-108, CHK-bao-cao-hieu-qua-du-an-111, CHK-bao-cao-hieu-qua-du-an-246, CHK-bao-cao-hieu-qua-du-an-247 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-006 | giờ Việt Nam cho thời điểm, năm / tháng hiện tại | xem-tong-quan-khoi, import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-035, CHK-bao-cao-hieu-qua-du-an-382, CHK-bao-cao-hieu-qua-du-an-504 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-007 | chỉ Kế toán thấy nút Import, mở được P-07 | chung | CHK-bao-cao-hieu-qua-du-an-520, CHK-bao-cao-hieu-qua-du-an-521, CHK-bao-cao-hieu-qua-du-an-522, CHK-bao-cao-hieu-qua-du-an-523 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-007 | người import ghi theo tài khoản đăng nhập | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-474 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-007 | quyền Kế toán kiểm tại lúc ghi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-483 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-008 | mở màn, đổi bộ lọc / tab, mở P-06 ≤ 3 giây | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-bao-cao-hieu-qua-du-an-008 | P-06 mức Toàn công ty hiện trang đầu ≤ 3 giây | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-bao-cao-hieu-qua-du-an-008 | Export XLSX ≤ 10 giây với 100.000 dòng | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-bao-cao-hieu-qua-du-an-009 | chọn file đến khi hiện kết quả kiểm tra ≤ 30 giây (50.000 dòng) | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-bao-cao-hieu-qua-du-an-009 | xác nhận Import sổ đến khi hiện toast ≤ 30 giây | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-bao-cao-hieu-qua-du-an-010 | quy mô 200 người dùng, 2.000 dự án / năm, 50.000 dòng sổ / tháng | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-bao-cao-hieu-qua-du-an-011 | AM / tài khoản không vai trò xem báo cáo không mở được màn, P-06 | chung | CHK-bao-cao-hieu-qua-du-an-516, CHK-bao-cao-hieu-qua-du-an-517, CHK-bao-cao-hieu-qua-du-an-518, CHK-bao-cao-hieu-qua-du-an-519 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-011 | GĐK / SM không thấy dữ liệu ngoài khối, kể cả mở trực tiếp / gọi thao tác không qua màn | chung | CHK-bao-cao-hieu-qua-du-an-529, CHK-bao-cao-hieu-qua-du-an-530, CHK-bao-cao-hieu-qua-du-an-531, CHK-bao-cao-hieu-qua-du-an-535 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-011 | file Export chỉ chứa dòng thoả bộ lọc trong phạm vi | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-319 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-012 | nhật ký import, lịch sử dự án không sửa / xoá được qua giao diện | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-506, CHK-bao-cao-hieu-qua-du-an-509 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-013 | kiểm vai trò Kế toán tại lúc ghi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-483, CHK-bao-cao-hieu-qua-du-an-484 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-013 | sổ cùng loại đổi sau xem trước → không ghi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-477, CHK-bao-cao-hieu-qua-du-an-478 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-013 | 2 lần import cùng loại không ghi chồng | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-482 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-013 | bấm lặp chỉ ghi 1 lần | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-475 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-014 | ghi trọn vẹn: lỗi giữa chừng không đổi gì | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-489 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-014 | bấm lại sau lỗi ghi đúng 1 lần | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-491 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-014 | áp cho tính lại khi cấp mã | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-514 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-015 | (a) mỗi lần Export XLSX | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-320 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-015 | (b) import có lỗi: ghi tra soát, không vào Lịch sử import | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-507, CHK-bao-cao-hieu-qua-du-an-508 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-015 | (c) ghi không trọn vẹn | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-493 | UI | covered | — |
| NFR-bao-cao-hieu-qua-du-an-015 | (d) thao tác bị từ chối | import-so-ke-toan, chung | CHK-bao-cao-hieu-qua-du-an-487, CHK-bao-cao-hieu-qua-du-an-537 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-001 | 4 chỉ tiêu: Chi phí = Chi SX + Chi KD, VNĐ / SP | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-029, CHK-bao-cao-hieu-qua-du-an-057, CHK-bao-cao-hieu-qua-du-an-059 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-002 | kỳ so sánh = [Từ, min(Đến, Chốt số của chỉ tiêu)] | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-051, CHK-bao-cao-hieu-qua-du-an-052, CHK-bao-cao-hieu-qua-du-an-070, CHK-bao-cao-hieu-qua-du-an-102, CHK-bao-cao-hieu-qua-du-an-112 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-002 | chỉ tiêu chưa có Chốt số bị bỏ qua: Thực tế "—", không %, không xếp mức | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-067, CHK-bao-cao-hieu-qua-du-an-114, CHK-bao-cao-hieu-qua-du-an-154 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-002 | Kế hoạch của chỉ tiêu chưa có Chốt số vẫn hiện, cộng trên [Từ, Đến] (🔶) | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-053 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-003 | Chốt số = tháng lớn nhất có số thực tế ở bất kỳ dự án | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-004, CHK-bao-cao-hieu-qua-du-an-008 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-003 | tính chung toàn công ty, không theo Phạm vi xem | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-006 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-003 | kể cả ghi nhận bằng 0 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-007 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-003 | tính lại sau mỗi lần ghi nhận thực tế | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-465, CHK-bao-cao-hieu-qua-du-an-467 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-004 | mặc định Đến = chốt số muộn nhất, Từ = tháng 01 năm đó | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-032, CHK-bao-cao-hieu-qua-du-an-033 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-004 | chưa có chốt số → 01–12 năm hiện tại (giờ Việt Nam) | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-034, CHK-bao-cao-hieu-qua-du-an-035 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-004 | kỳ mặc định không đổi theo chỉ tiêu | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-036 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-004 | Từ không lớn hơn Đến; xoá trống giữ giá trị cũ | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-037, CHK-bao-cao-hieu-qua-du-an-038, CHK-bao-cao-hieu-qua-du-an-039, CHK-bao-cao-hieu-qua-du-an-040 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-005 | Kế toán / Ban lãnh đạo mọi khối, mặc định Toàn công ty | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-041, CHK-bao-cao-hieu-qua-du-an-042, CHK-bao-cao-hieu-qua-du-an-043, CHK-bao-cao-hieu-qua-du-an-044, CHK-bao-cao-hieu-qua-du-an-050 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-005 | GĐK / SM chỉ dự án khối mình (ô số, bảng, ô dự án, P-06, Export) | xem-tong-quan-khoi, xem-tong-quan-du-an, chung, tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-045, CHK-bao-cao-hieu-qua-du-an-046, CHK-bao-cao-hieu-qua-du-an-178, CHK-bao-cao-hieu-qua-du-an-319, CHK-bao-cao-hieu-qua-du-an-533, CHK-bao-cao-hieu-qua-du-an-534 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-005 | Phạm vi "Khối X" chỉ lấy dự án khối X | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-047, CHK-bao-cao-hieu-qua-du-an-048, CHK-bao-cao-hieu-qua-du-an-049 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-005 | meta Số dự án theo phạm vi dữ liệu người xem, không theo Phạm vi xem | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-010, CHK-bao-cao-hieu-qua-du-an-011, CHK-bao-cao-hieu-qua-du-an-012 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-005 | mở trực tiếp phạm vi / dự án ngoài khối bị từ chối | chung | CHK-bao-cao-hieu-qua-du-an-529, CHK-bao-cao-hieu-qua-du-an-532 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-005 | GĐK / SM chưa được gắn khối mở MH-03 | chung | — | — | blocked | [NEEDS CLARIFICATION] BR-005: GĐK / SM chưa gắn khối thấy gì (đi cùng quy tắc MH-01 "Tài khoản chưa được gắn khối — liên hệ quản trị"?) — chưa có expected / wording |
| BR-bao-cao-hieu-qua-du-an-006 | Biên = (DT − CP) / DT, 1 chữ số thập phân | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-068, CHK-bao-cao-hieu-qua-du-an-069 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-006 | DT và CP mỗi chỉ tiêu theo kỳ riêng | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-070 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-006 | DT thực tế = 0 → "—", không nhãn | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-071, CHK-bao-cao-hieu-qua-du-an-072 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-006 | DT / CP chưa có Chốt số → "—" kèm "Chưa có số thực tế" | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-073, CHK-bao-cao-hieu-qua-du-an-074 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-006 | nhãn chênh biên: dấu "+", xanh / đỏ | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-075, CHK-bao-cao-hieu-qua-du-an-076 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-006 | Biên KH = 0 → không nhãn | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-077 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-007 | % hoàn thành = TT / KH, 1 chữ số thập phân | xem-tong-quan-khoi, xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-060, CHK-bao-cao-hieu-qua-du-an-196 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-007 | tốt / xấu xanh – đỏ, Chi phí đảo chiều | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-061, CHK-bao-cao-hieu-qua-du-an-062, CHK-bao-cao-hieu-qua-du-an-063, CHK-bao-cao-hieu-qua-du-an-064 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-007 | KH = 0 → không nhãn, tooltip Hoàn thành "—" | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-065, CHK-bao-cao-hieu-qua-du-an-095 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-008 | Chênh lệch (%): công thức, dấu, "0.0%", KH = 0 → "–" | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-115, CHK-bao-cao-hieu-qua-du-an-116, CHK-bao-cao-hieu-qua-du-an-117 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-008 | dự án Chưa phát sinh: Thực tế, Chênh lệch "–" | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-118, CHK-bao-cao-hieu-qua-du-an-119 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-008 | màu xám / xanh / đỏ (Chi phí đảo chiều) | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-120, CHK-bao-cao-hieu-qua-du-an-121, CHK-bao-cao-hieu-qua-du-an-122 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-008 | tooltip chênh lệch tuyệt đối | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-123 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-009 | tổng các dự án đang hiển thị, % trên tổng, theo lọc sức khoẻ | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-124, CHK-bao-cao-hieu-qua-du-an-125, CHK-bao-cao-hieu-qua-du-an-126 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-009 | gồm dự án Chưa phát sinh với Thực tế = 0 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-127 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-009 | ẩn dòng tổng khi không có dự án | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-136 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-010 | (1) không có số thực tế trong kỳ → Chưa phát sinh | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-139 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-010 | (2) DT ≤ 85% KH → Cần chú ý (biên) | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-142 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-010 | (2) CP ≥ 130% KH → Cần chú ý (biên) | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-143 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-010 | (2) CP KH = 0 mà CP thực tế > 0 → Cần chú ý | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-144, CHK-bao-cao-hieu-qua-du-an-160 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-010 | (2) DTT ≤ 65% KH → Cần chú ý (biên) | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-145 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-010 | (3) mọi chỉ tiêu bị bỏ qua → Theo dõi | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-150 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-010 | (4) đạt DT ≥ 95%, CP ≤ 100%, DTT ≥ 95% → Tốt (biên) | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-146 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-010 | (5) còn lại → Theo dõi | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-147, CHK-bao-cao-hieu-qua-du-an-148, CHK-bao-cao-hieu-qua-du-an-149 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-010 | mỗi chỉ tiêu xét trên kỳ so sánh riêng | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-156 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-011 | bỏ qua chỉ tiêu chưa có Chốt số | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-154 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-011 | bỏ qua Doanh thu KH = 0 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-151 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-011 | bỏ qua Dòng tiền thu KH = 0 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-152 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-011 | bỏ qua Chi phí KH = 0 và Chi phí thực tế ≤ 0 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-153 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-011 | DT, CP, DTT đều bị bỏ qua → Theo dõi | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-150, CHK-bao-cao-hieu-qua-du-an-161 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-012 | KLCV không tham gia xếp mức | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-155, CHK-bao-cao-hieu-qua-du-an-162 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-013 | có số thực tế trong kỳ, kể cả ghi nhận bằng 0 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-140 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-013 | chỉ có số thực tế ngoài kỳ → Chưa phát sinh | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-139, CHK-bao-cao-hieu-qua-du-an-141 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-014 | Theo tháng: mọi tháng [Từ, Đến], Thực tế chỉ tới chốt số | xem-tong-quan-khoi, xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-090, CHK-bao-cao-hieu-qua-du-an-091, CHK-bao-cao-hieu-qua-du-an-092, CHK-bao-cao-hieu-qua-du-an-215 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-014 | Theo dự án: kỳ so sánh, bỏ dự án KH = TT = 0, nhãn Mã tổng | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-101, CHK-bao-cao-hieu-qua-du-an-102, CHK-bao-cao-hieu-qua-du-an-103 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-014 | chỉ tiêu chưa có Chốt số: chỉ cột Kế hoạch cộng trên [Từ, Đến] (🔶) | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-096 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-014 | chỉ tiêu chưa có Chốt số: tooltip "chưa chốt số", Hoàn thành "—" | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-097, CHK-bao-cao-hieu-qua-du-an-098 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-014 | không có nhóm cột → E-017 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-104 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-015 | vòng đời = tháng nhỏ nhất → lớn nhất có KH / số thực tế | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-188, CHK-bao-cao-hieu-qua-du-an-189 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-015 | chưa có tháng nào → Start → End | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-190 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-016 | công thức 5 ô số tab dự án | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-191, CHK-bao-cao-hieu-qua-du-an-192, CHK-bao-cao-hieu-qua-du-an-194, CHK-bao-cao-hieu-qua-du-an-195, CHK-bao-cao-hieu-qua-du-an-196 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-016 | nhãn Đạt / Chưa đạt / Vượt KH | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-197, CHK-bao-cao-hieu-qua-du-an-198, CHK-bao-cao-hieu-qua-du-an-199, CHK-bao-cao-hieu-qua-du-an-200 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-016 | Luỹ kế KH = 0 → "—" | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-201 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-016 | dự án chưa có số thực tế của chỉ tiêu | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-203, CHK-bao-cao-hieu-qua-du-an-204 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-016 | chỉ tiêu chưa có Chốt số | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-205, CHK-bao-cao-hieu-qua-du-an-206, CHK-bao-cao-hieu-qua-du-an-207, CHK-bao-cao-hieu-qua-du-an-208, CHK-bao-cao-hieu-qua-du-an-209, CHK-bao-cao-hieu-qua-du-an-210 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-017 | tháng chưa có số: "–", luỹ kế vẫn cộng dồn | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-222, CHK-bao-cao-hieu-qua-du-an-223, CHK-bao-cao-hieu-qua-du-an-224, CHK-bao-cao-hieu-qua-du-an-225 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-017 | Chênh lệch, +/- %, tô màu, KH = 0 | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-227, CHK-bao-cao-hieu-qua-du-an-228, CHK-bao-cao-hieu-qua-du-an-229, CHK-bao-cao-hieu-qua-du-an-230 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-017 | luỹ kế, % luỹ kế | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-231, CHK-bao-cao-hieu-qua-du-an-232 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-017 | dòng Tổng cộng | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-233 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-018 | chỉ Chi phí / Dòng tiền thu bấm được, khác 0 mới bấm được | xem-tong-quan-khoi, xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-082, CHK-bao-cao-hieu-qua-du-an-083, CHK-bao-cao-hieu-qua-du-an-084, CHK-bao-cao-hieu-qua-du-an-212, CHK-bao-cao-hieu-qua-du-an-238 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-018 | bấm Chi phí → sổ Chi (Chi SX lẫn Chi KD) | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-239, CHK-bao-cao-hieu-qua-du-an-245 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-019 | ô số / dòng tổng tab tổng quan: phạm vi × kỳ so sánh | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-079, CHK-bao-cao-hieu-qua-du-an-080, CHK-bao-cao-hieu-qua-du-an-081, CHK-bao-cao-hieu-qua-du-an-131 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-019 | dòng dự án: dự án × kỳ so sánh | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-130 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-019 | tab dự án: tháng, luỹ kế tháng, ô Luỹ kế TT / dòng tổng | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-211, CHK-bao-cao-hieu-qua-du-an-234, CHK-bao-cao-hieu-qua-du-an-235, CHK-bao-cao-hieu-qua-du-an-236 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-019 | tiêu đề phạm vi 3 dạng | xem-tong-quan-khoi, xem-tong-quan-du-an, tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-080, CHK-bao-cao-hieu-qua-du-an-081, CHK-bao-cao-hieu-qua-du-an-237, CHK-bao-cao-hieu-qua-du-an-241 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-020 | khớp Mã tổng, Mã KD, Mã SX, mã outsource kể cả đã xoá | tra-cuu-so-ke-toan, import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-248, CHK-bao-cao-hieu-qua-du-an-249, CHK-bao-cao-hieu-qua-du-an-250, CHK-bao-cao-hieu-qua-du-an-251, CHK-bao-cao-hieu-qua-du-an-252, CHK-bao-cao-hieu-qua-du-an-419, CHK-bao-cao-hieu-qua-du-an-420 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-020 | bỏ khoảng trắng đầu / cuối, không phân biệt hoa / thường | tra-cuu-so-ke-toan, import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-253, CHK-bao-cao-hieu-qua-du-an-421 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-020 | mã trống / mã chưa cấp không khớp | tra-cuu-so-ke-toan, import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-255, CHK-bao-cao-hieu-qua-du-an-422 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-020 | không lấy dòng của dự án khác | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-254 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-020 | thuật ngữ "Mã KD" trên màn, file mẫu, file xuất | tra-cuu-so-ke-toan, import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-245, CHK-bao-cao-hieu-qua-du-an-305, CHK-bao-cao-hieu-qua-du-an-332 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-021 | sổ thu tìm trong 4 trường | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-272, CHK-bao-cao-hieu-qua-du-an-273, CHK-bao-cao-hieu-qua-du-an-274, CHK-bao-cao-hieu-qua-du-an-275, CHK-bao-cao-hieu-qua-du-an-276 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-021 | sổ chi tìm trong 2 trường | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-277, CHK-bao-cao-hieu-qua-du-an-278 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-021 | không phân biệt hoa / thường, tìm không dấu | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-279, CHK-bao-cao-hieu-qua-du-an-280 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-021 | bỏ khoảng trắng đầu / cuối; chỉ khoảng trắng = ô trống | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-281, CHK-bao-cao-hieu-qua-du-an-282 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-022 | sắp xếp sổ thu / sổ chi | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-259, CHK-bao-cao-hieu-qua-du-an-260 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-022 | tháng của dòng sổ thu theo Ngày hạch toán | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-257 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-023 | chỉ xét khi ô tìm trống | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-293 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-023 | so sau khi làm tròn đơn vị | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-294 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-024 | xuất dòng thoả bộ lọc, kể cả phần chưa hiện, tôn trọng ẩn dòng 0 | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-297, CHK-bao-cao-hieu-qua-du-an-298, CHK-bao-cao-hieu-qua-du-an-299 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-024 | mẫu file sổ thu | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-301, CHK-bao-cao-hieu-qua-du-an-302, CHK-bao-cao-hieu-qua-du-an-303 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-024 | mẫu file sổ chi | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-304, CHK-bao-cao-hieu-qua-du-an-305, CHK-bao-cao-hieu-qua-du-an-306 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-024 | file xuất không có dòng Tổng cộng | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-300 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-024 | tên file | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-307, CHK-bao-cao-hieu-qua-du-an-308 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-024 | 0 dòng thoả bộ lọc → không xuất | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-309 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-025 | nhận Dòng tiền thu | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-360 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-025 | nhận Chi thực tế (cùng dòng) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-361, CHK-bao-cao-hieu-qua-du-an-362 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-025 | có cả hai → ưu tiên Dòng tiền thu | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-363 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-025 | chuẩn hoá tiêu đề (bỏ dấu, chữ thường, gộp khoảng trắng) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-364, CHK-bao-cao-hieu-qua-du-an-365 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-025 | ánh xạ cột theo tiền tố tên cột | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-366, CHK-bao-cao-hieu-qua-du-an-367 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-025 | bỏ qua các dòng trên dòng tiêu đề | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-368 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-026 | Ngày: số Excel, d/m/yyyy (/ . -), yyyy-m-d; ngày > 31 sai | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-371, CHK-bao-cao-hieu-qua-du-an-390, CHK-bao-cao-hieu-qua-du-an-391, CHK-bao-cao-hieu-qua-du-an-392, CHK-bao-cao-hieu-qua-du-an-393, CHK-bao-cao-hieu-qua-du-an-394 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-026 | Tháng: số Excel, M/yyyy, yyyy-M, ngày hợp lệ | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-395, CHK-bao-cao-hieu-qua-du-an-396, CHK-bao-cao-hieu-qua-du-an-397, CHK-bao-cao-hieu-qua-du-an-398 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-026 | Số: trống / "-" / "–" = 0, nhóm nghìn, dấu thập phân, số âm | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-373, CHK-bao-cao-hieu-qua-du-an-399, CHK-bao-cao-hieu-qua-du-an-400, CHK-bao-cao-hieu-qua-du-an-401, CHK-bao-cao-hieu-qua-du-an-402, CHK-bao-cao-hieu-qua-du-an-403, CHK-bao-cao-hieu-qua-du-an-404 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-026 | cột Chi kinh doanh vắng → 0 | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-369 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-027 | bỏ qua dòng trống hoàn toàn | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-389 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-027 | chỉ báo lỗi đầu tiên theo thứ tự | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-383, CHK-bao-cao-hieu-qua-du-an-384, CHK-bao-cao-hieu-qua-du-an-385, CHK-bao-cao-hieu-qua-du-an-386, CHK-bao-cao-hieu-qua-du-an-387 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-027 | tháng sau tháng hiện tại là lỗi chặn; tháng hiện tại hợp lệ | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-379, CHK-bao-cao-hieu-qua-du-an-380, CHK-bao-cao-hieu-qua-du-an-381 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-027 | "Dòng {n}" = số dòng thật trên sheet | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-388, CHK-bao-cao-hieu-qua-du-an-429 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-027 | Số tiền trống ở sổ thu = 0, không lỗi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-373 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-028 | 1 lỗi bất kỳ → nút Import sổ mờ | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-343, CHK-bao-cao-hieu-qua-du-an-359, CHK-bao-cao-hieu-qua-du-an-381, CHK-bao-cao-hieu-qua-du-an-436 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-028 | cảnh báo không chặn import | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-407 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-028 | sửa file theo danh sách lỗi, chọn lại | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-434 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-029 | dòng không mã / mã không khớp: lưu vào sổ, không cộng dự án, gom dòng "Không gắn" | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-411, CHK-bao-cao-hieu-qua-du-an-417 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-029 | cảnh báo tối đa 12 mã kèm "…" | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-409 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-029 | sổ chi thiếu mã là lỗi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-374 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-030 | thay dòng cùng loại các tháng trong file | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-451 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-030 | tháng khác, loại sổ kia giữ nguyên | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-452, CHK-bao-cao-hieu-qua-du-an-453 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-030 | không xoá cứng: dòng cũ hết hiệu lực | tra-cuu-so-ke-toan, import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-258, CHK-bao-cao-hieu-qua-du-an-454 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-030 | tập dòng tại lúc ghi khác xem trước → không ghi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-478 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-031 | tính lại Thu / Chi SX / Chi KD thực tế | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-456, CHK-bao-cao-hieu-qua-du-an-457, CHK-bao-cao-hieu-qua-du-an-458 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-031 | tháng không còn dòng khớp → 0 | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-459 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-031 | không ghi nhận Doanh thu / KLCV | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-461, CHK-bao-cao-hieu-qua-du-an-462 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-031 | dự án không bị ảnh hưởng giữ nguyên | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-460 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-031 | áp cho mọi trạng thái kể cả Kết thúc / Pending | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-463, CHK-bao-cao-hieu-qua-du-an-464 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-031 | số dự án bị ảnh hưởng gồm dự án chỉ có dòng bị thay | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-446 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-032 | lịch sử dự án: hành động + ghi chú | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-469, CHK-bao-cao-hieu-qua-du-an-470 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-032 | không tăng phiên bản | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-471 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-032 | áp cho dự án mọi trạng thái | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-472 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-032 | nhật ký import đủ thông tin, người import theo tài khoản | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-473, CHK-bao-cao-hieu-qua-du-an-474 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-033 | Kế hoạch = PAKD được duyệt gần nhất, ghi đè khi duyệt | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-022, CHK-bao-cao-hieu-qua-du-an-023 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-033 | PAKD chờ duyệt / bị từ chối không đổi Kế hoạch | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-018, CHK-bao-cao-hieu-qua-du-an-019, CHK-bao-cao-hieu-qua-du-an-024, CHK-bao-cao-hieu-qua-du-an-025 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-033 | PAKD sinh rỗng giữ Kế hoạch cũ | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-026 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-033 | "Đã ký": DT theo mốc nghiệm thu, Thu theo tháng thu tiền, Chi theo kế hoạch chi phí | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-027, CHK-bao-cao-hieu-qua-du-an-028, CHK-bao-cao-hieu-qua-du-an-029 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-033 | "Chưa ký": Chi chia đều, DT = Thu = 0 | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-030, CHK-bao-cao-hieu-qua-du-an-031 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-033 | KLCV kế hoạch luôn = 0 (ô / cột KLCV kế hoạch, % hoàn thành KLCV) | chung | — | — | blocked | [NEEDS CLARIFICATION] BR-033: bổ sung KLCV vào PAKD hay lấy từ nguồn khác — OQ-4 (Phase H Q-64) còn mở |
| BR-bao-cao-hieu-qua-du-an-034 | có ≥ 1 PAKD được duyệt → thuộc báo cáo | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-013 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-034 | ngoại lệ: đã có số thực tế ở bất kỳ chỉ tiêu nào | xem-tong-quan-khoi, import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-014, CHK-bao-cao-hieu-qua-du-an-015, CHK-bao-cao-hieu-qua-du-an-468 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-034 | Chờ duyệt mã / Chưa có PAKD / PAKD chờ duyệt không có mặt | xem-tong-quan-khoi, xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-016, CHK-bao-cao-hieu-qua-du-an-017, CHK-bao-cao-hieu-qua-du-an-018, CHK-bao-cao-hieu-qua-du-an-175 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-034 | đã từng duyệt, nay Kết thúc / Pending vẫn có mặt | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-020, CHK-bao-cao-hieu-qua-du-an-021 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-034 | không đếm vào meta Số dự án | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-010 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-035 | ô Dự án nhóm theo 6 khối | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-175, CHK-bao-cao-hieu-qua-du-an-176 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-036 | "chưa có số" khác ghi nhận bằng 0 | xem-tong-quan-khoi, xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-007, CHK-bao-cao-hieu-qua-du-an-008, CHK-bao-cao-hieu-qua-du-an-226 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-036 | ghi nhận theo chỉ tiêu từ đúng nguồn | xem-tong-quan-khoi, import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-015, CHK-bao-cao-hieu-qua-du-an-461, CHK-bao-cao-hieu-qua-du-an-462, CHK-bao-cao-hieu-qua-du-an-468 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-037 | Import sổ + Lịch sử import chỉ Kế toán | xem-tong-quan-khoi, chung | CHK-bao-cao-hieu-qua-du-an-003, CHK-bao-cao-hieu-qua-du-an-520, CHK-bao-cao-hieu-qua-du-an-521, CHK-bao-cao-hieu-qua-du-an-522, CHK-bao-cao-hieu-qua-du-an-523, CHK-bao-cao-hieu-qua-du-an-524 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-037 | xem báo cáo, P-06, Export cho mọi vai trò xem báo cáo | chung, tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-316, CHK-bao-cao-hieu-qua-du-an-317, CHK-bao-cao-hieu-qua-du-an-318, CHK-bao-cao-hieu-qua-du-an-525, CHK-bao-cao-hieu-qua-du-an-526, CHK-bao-cao-hieu-qua-du-an-527, CHK-bao-cao-hieu-qua-du-an-528 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-037 | AM không mở MH-03 | chung | CHK-bao-cao-hieu-qua-du-an-515, CHK-bao-cao-hieu-qua-du-an-516 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-037 | quyền kiểm tại lúc mở màn / P-06 / tải Export (🔶) | chung | CHK-bao-cao-hieu-qua-du-an-536 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-037 | quyền Kế toán kiểm cả tại lúc ghi sổ | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-486 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-038 | {n} = dòng của dự án không có trong file, {m} = số dự án đó | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-438, CHK-bao-cao-hieu-qua-du-an-439 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-038 | dòng cũ không gắn dự án không tính vào {n} | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-440 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-038 | tính lại khi sổ đổi trước lúc ghi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-480 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-039 | cấp mã outsource mới → tính lại thực tế | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-510 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-039 | cấp Mã tổng → tính lại thực tế | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-511 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-039 | lịch sử "Cấp mã {mã} · {n} dòng", không tăng phiên bản | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-512, CHK-bao-cao-hieu-qua-du-an-513 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-039 | ghi trọn vẹn | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-514 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-040 | P-06 hiển thị theo từng phần; "n dòng · Tổng X", Tổng cộng, cảnh báo lệch tính trên toàn bộ | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-264, CHK-bao-cao-hieu-qua-du-an-265, CHK-bao-cao-hieu-qua-du-an-266, CHK-bao-cao-hieu-qua-du-an-283, CHK-bao-cao-hieu-qua-du-an-295 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-040 | Export tối đa 1.000.000 dòng (biên) | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-311, CHK-bao-cao-hieu-qua-du-an-312, CHK-bao-cao-hieu-qua-du-an-313 | UI | covered | — |
| BR-bao-cao-hieu-qua-du-an-040 | Export toàn bộ dòng thoả bộ lọc | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-298 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-001 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-341 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-001 | trạng thái màn: tên file, chip "1 lỗi", Import sổ mờ | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-342, CHK-bao-cao-hieu-qua-du-an-343 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-002 | message (file hỏng; đặt mật khẩu) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-344, CHK-bao-cao-hieu-qua-du-an-345 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-003 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-354, CHK-bao-cao-hieu-qua-du-an-362 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-003 | không có chip loại sổ | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-355 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-004 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-356 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-005 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-357 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-006 | message kèm "Dòng {n}" | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-370, CHK-bao-cao-hieu-qua-du-an-371 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-007 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-372 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-008 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-374 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-009 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-375 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-010 | message (Chi sản xuất; Chi kinh doanh) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-376, CHK-bao-cao-hieu-qua-du-an-377 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-011 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-358 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-011 | Import sổ mờ | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-359 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-012 | message (thiếu mã; không có cột Mã công trình) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-405, CHK-bao-cao-hieu-qua-du-an-406 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-012 | không chặn import | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-407 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-013 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-408 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-013 | tối đa 12 mã kèm "…" | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-409 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-014 | message dải vàng với số dòng sổ hiện có | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-411, CHK-bao-cao-hieu-qua-du-an-423, CHK-bao-cao-hieu-qua-du-an-424 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-014 | không có dải vàng khi sổ cùng loại chưa có dòng | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-425 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-014 | hộp xác nhận khi bấm Import sổ | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-437 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-015 | message | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-291 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-016 | message (lọc mức; phạm vi không có dự án) | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-135, CHK-bao-cao-hieu-qua-du-an-137 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-016 | trạng thái màn: không có dòng tổng | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-136 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-016 | recovery: đổi bộ lọc | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-138 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-017 | message | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-104 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-017 | recovery: đổi kỳ | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-105 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-018 | message | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-180 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-018 | trạng thái màn: chỉ có thông báo | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-181 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-019 | message (không có dòng; tìm không ra) | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-267, CHK-bao-cao-hieu-qua-du-an-284 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-019 | trạng thái màn: không có dòng tổng | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-268 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-019 | recovery: đổi tìm kiếm | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-285 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-020 | tab tổng quan: meta "—", ô / cột "—" kèm "Chưa có số thực tế" | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-005, CHK-bao-cao-hieu-qua-du-an-066, CHK-bao-cao-hieu-qua-du-an-073, CHK-bao-cao-hieu-qua-du-an-074, CHK-bao-cao-hieu-qua-du-an-113 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-020 | không tính %, không xếp mức | xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-067, CHK-bao-cao-hieu-qua-du-an-114, CHK-bao-cao-hieu-qua-du-an-154 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-020 | tab dự án: "Chưa có số thực tế" / "Chưa phát sinh" | xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-203, CHK-bao-cao-hieu-qua-du-an-204, CHK-bao-cao-hieu-qua-du-an-207, CHK-bao-cao-hieu-qua-du-an-208 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-021 | message (lỗi hệ thống; mất kết nối) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-488, CHK-bao-cao-hieu-qua-du-an-492 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-021 | không thay đổi sổ, thực tế, nhật ký, lịch sử | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-489 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-021 | trạng thái màn: giữ bước 3, không có toast | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-490 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-021 | recovery: bấm lại ghi đúng 1 lần | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-491 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-021 | ghi nhận tra soát | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-493 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-022 | (a) message mất vai trò Kế toán | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-483 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-022 | (a) không ghi, đóng P-07, ẩn nút Import | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-484, CHK-bao-cao-hieu-qua-du-an-485, CHK-bao-cao-hieu-qua-du-an-486 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-022 | (b) message sổ vừa được cập nhật | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-477 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-022 | (b) không ghi; xem trước, dải vàng, hộp xác nhận tính lại | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-478, CHK-bao-cao-hieu-qua-du-an-479, CHK-bao-cao-hieu-qua-du-an-480 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-022 | (b) recovery: import lại | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-481 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-022 | ghi nhận tra soát | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-487 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-023 | message | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-311 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-023 | không tải file, P-06 giữ nguyên | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-312, CHK-bao-cao-hieu-qua-du-an-314 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-023 | recovery: thu hẹp bộ lọc | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-315 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-024 | message (20 MB; 50.000 dòng) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-346, CHK-bao-cao-hieu-qua-du-an-348 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-024 | recovery: tách file | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-350 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-025 | message | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-351 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-025 | recovery: lưu CSV UTF-8 | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-353 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-026 | message (sổ thu; sổ chi) | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-378, CHK-bao-cao-hieu-qua-du-an-379 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-026 | chặn import | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-381 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-026 | có trong file danh sách lỗi | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-432 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-026 | tháng hiện tại theo giờ Việt Nam | import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-382 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-027 | message: AM / không vai trò mở MH-03, P-06 (🔶) | chung | CHK-bao-cao-hieu-qua-du-an-516, CHK-bao-cao-hieu-qua-du-an-518, CHK-bao-cao-hieu-qua-du-an-519 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-027 | message: GĐK / SM mở ngoài khối (🔶) | chung | CHK-bao-cao-hieu-qua-du-an-529, CHK-bao-cao-hieu-qua-du-an-531, CHK-bao-cao-hieu-qua-du-an-532 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-027 | không trả dữ liệu ngoài phạm vi (🔶) | chung | CHK-bao-cao-hieu-qua-du-an-517, CHK-bao-cao-hieu-qua-du-an-530, CHK-bao-cao-hieu-qua-du-an-535 | UI | covered | — |
| E-bao-cao-hieu-qua-du-an-027 | ghi nhận tra soát | chung | CHK-bao-cao-hieu-qua-du-an-537 | UI | covered | — |
| Mục 11 Constraint go-live | số Thu / Chi đầu kỳ lúc go-live đưa vào qua sổ kế toán (cách làm, tháng bắt đầu, người đối chiếu) | chung | — | — | blocked | [NEEDS CLARIFICATION] Mục 11 — OQ-26 còn mở |
| Baseline phiên đăng nhập | phiên hết hạn / chưa đăng nhập khi mở MH-03, P-06, P-07 | chung | — | — | blocked | cơ chế đăng nhập chờ chốt (Mục 11 Constraints, OQ-7 cùng phuong-an-kinh-doanh:OQ-5) — chưa có expected |
| Baseline loading | trạng thái đang tải định tính | chung | CHK-bao-cao-hieu-qua-du-an-538, CHK-bao-cao-hieu-qua-du-an-539, CHK-bao-cao-hieu-qua-du-an-540, CHK-bao-cao-hieu-qua-du-an-541, CHK-bao-cao-hieu-qua-du-an-542 | UI | covered | — |
| Baseline a11y | bàn phím, focus, nhãn | chung | CHK-bao-cao-hieu-qua-du-an-543, CHK-bao-cao-hieu-qua-du-an-544, CHK-bao-cao-hieu-qua-du-an-545, CHK-bao-cao-hieu-qua-du-an-546, CHK-bao-cao-hieu-qua-du-an-547, CHK-bao-cao-hieu-qua-du-an-548, CHK-bao-cao-hieu-qua-du-an-549 | UI | covered | — |
| Baseline responsive | cửa sổ Chrome hẹp không vỡ layout | chung | CHK-bao-cao-hieu-qua-du-an-550, CHK-bao-cao-hieu-qua-du-an-551, CHK-bao-cao-hieu-qua-du-an-552, CHK-bao-cao-hieu-qua-du-an-553 | UI | covered | — |
| Baseline edge | Back / tải lại trang / chỉ đọc | chung | CHK-bao-cao-hieu-qua-du-an-554, CHK-bao-cao-hieu-qua-du-an-555, CHK-bao-cao-hieu-qua-du-an-556, CHK-bao-cao-hieu-qua-du-an-557 | UI | covered | — |
| Baseline đóng P-06 | đóng popup bằng nút × / bấm nền tối | tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-321, CHK-bao-cao-hieu-qua-du-an-322 | UI | covered | — |

## Tập UAT

| UC | CHK-ID | Nội dung | Ưu tiên |
|----|--------|----------|---------|
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-001 | Ban lãnh đạo mở MH-03 từ menu, mặc định tab "Tổng quan cả khối" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-003 | Kế toán thấy nút Import sổ kế toán | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-004 | Meta "Chốt số" đủ 4 chỉ tiêu, mỗi chỉ tiêu tháng riêng | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-005 | Chỉ tiêu chưa có số thực tế: meta Chốt số hiện "—" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-006 | Chốt số tính chung toàn công ty, không theo khối người xem | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-010 | Kế toán: meta Số dự án đếm dự án thuộc báo cáo toàn công ty | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-013 | Dự án có PAKD được Kế toán duyệt có mặt trên bảng | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-014 | Dự án chưa duyệt PAKD nhưng đã có Chi thực tế vẫn có mặt | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-016 | Dự án Chờ duyệt mã không có trên bảng | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-020 | Dự án từng được duyệt PAKD, nay Kết thúc vẫn có trên bảng | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-022 | Kế hoạch lấy từ phiên bản PAKD được duyệt gần nhất | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-023 | Kế toán duyệt PAKD điều chỉnh: Kế hoạch đổi theo bản mới | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-024 | PAKD điều chỉnh đang chờ duyệt: Kế hoạch giữ bản đã duyệt | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-027 | PAKD "Đã ký": Kế hoạch Doanh thu theo tháng mốc nghiệm thu | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-030 | PAKD "Chưa ký": Kế hoạch Chi phí chia đều theo giai đoạn | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-032 | Đến tháng mặc định bằng Chốt số muộn nhất trong 4 chỉ tiêu | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-041 | Kế toán: Phạm vi xem có Toàn công ty và 6 khối | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-045 | GĐK: Phạm vi xem cố định khối của mình | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-047 | Chọn "Khối G2": bảng chỉ còn dự án khối G2 | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-051 | Ô Doanh thu cộng KH, TT đến Chốt số Doanh thu | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-057 | Ô Chi phí bằng Σ Chi sản xuất + Chi kinh doanh trong kỳ | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-063 | Chi phí thực tế ≤ kế hoạch: ô màu xanh (đảo chiều) | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-064 | Chi phí thực tế > kế hoạch: ô màu đỏ | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-066 | Chỉ tiêu chưa có Chốt số: ô hiện "—" kèm "Chưa có số thực tế" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-070 | Biên lợi nhuận gộp: Doanh thu, Chi phí cắt theo chốt số riêng | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-079 | Bấm số thực tế Chi phí: mở P-06 đúng kỳ so sánh | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-091 | Biểu đồ Theo tháng: tháng sau Chốt số chỉ có cột Kế hoạch | P2 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-112 | Bảng chi tiết: mỗi nhóm chỉ tiêu cắt theo chốt số riêng | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-115 | Chênh lệch (%) KH 200, TT 230 hiện "+15.0%" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-124 | Dòng "Tổng cộng (n dự án)" bằng tổng dự án đang hiển thị | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-129 | Bấm dòng dự án: chuyển tab "Tổng quan dự án" đúng dự án | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-134 | Lọc "Cần chú ý": bảng chỉ còn dự án Cần chú ý | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-139 | Không có số thực tế trong kỳ: xếp "Chưa phát sinh" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-142 | Doanh thu đúng 85% kế hoạch: xếp "Cần chú ý" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-143 | Chi phí đúng 130% kế hoạch: xếp "Cần chú ý" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-144 | Chi phí kế hoạch bằng 0 mà có chi thực tế: "Cần chú ý" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-145 | Dòng tiền thu đúng 65% kế hoạch: xếp "Cần chú ý" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-146 | DT 95%, CP 100%, DTT 95% kế hoạch: xếp "Tốt" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-147 | DT 90%, các chỉ tiêu khác đạt: xếp "Theo dõi" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-150 | Kế hoạch DT, CP, DTT đều bằng 0: xếp "Theo dõi" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-155 | KLCV không tham gia xếp mức sức khoẻ | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-156 | Kế hoạch các tháng sau Chốt số không làm dự án "Cần chú ý" | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-164 | Chuyển tab và quay lại: Từ / Đến giữ nguyên | P1 |
| uc-xem-tong-quan-khoi | CHK-bao-cao-hieu-qua-du-an-168 | Đổi chỉ tiêu ở tab dự án: tab tổng quan đổi theo | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-169 | Bấm dòng dự án X ở tab tổng quan: tab dự án chọn sẵn X | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-170 | Mở tab dự án: mặc định dự án đầu tiên có số thực tế | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-172 | Chỉ tiêu tab dự án dùng chung với tab tổng quan | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-175 | Ô Dự án chỉ liệt kê dự án thuộc báo cáo | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-178 | GĐK: ô Dự án chỉ có dự án khối mình | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-179 | Chọn dự án khác: Thông tin dự án đổi theo | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-180 | Không có dự án thuộc báo cáo: hiện "Chưa có dự án." | P2 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-188 | Vòng đời dự án từ tháng đầu đến tháng cuối có KH / thực tế | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-191 | Tổng KH cả vòng đời bằng Σ kế hoạch mọi tháng | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-192 | Luỹ kế KH cắt đến Chốt số của chỉ tiêu đang chọn | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-194 | Luỹ kế TT cắt đến Chốt số, tháng chưa có số tính 0 | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-195 | Còn lại theo kế hoạch bằng Tổng KH − Luỹ kế KH | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-197 | Doanh thu luỹ kế đạt kế hoạch: nhãn "Đạt" | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-199 | Chi phí luỹ kế vượt kế hoạch: nhãn "Vượt KH" | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-203 | Dự án chưa có số thực tế: Luỹ kế TT "Chưa có số thực tế" | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-204 | Dự án chưa có số thực tế: Mức thực hiện "Chưa phát sinh" | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-211 | Bấm Luỹ kế TT Chi phí: P-06 từ tháng đầu đến Chốt số | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-218 | Tháng bằng Chốt số có nhãn xanh "Chốt số" | P2 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-220 | Tháng sau Chốt số: Thực tế hiện "–" | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-222 | Tháng chưa có số thực tế hiện "–", không hiện 0 | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-225 | Tháng chưa có số thực tế: luỹ kế vẫn cộng dồn | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-226 | Thực tế ghi nhận bằng 0 hiện "0", không hiện "–" | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-227 | Chênh lệch tháng KH 100, TT 120 hiện "+20" | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-233 | Dòng "Tổng cộng" bảng tháng đủ tổng và luỹ kế | P1 |
| uc-xem-tong-quan-du-an | CHK-bao-cao-hieu-qua-du-an-234 | Bấm Thực tế tháng 05: P-06 kỳ "Tháng 5 năm YYYY" | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-239 | Mở từ Chi phí: tiêu đề "CHI THỰC TẾ" | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-240 | Mở từ Dòng tiền thu: tiêu đề "BÁO CÁO DÒNG TIỀN THU TRONG KỲ" | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-242 | Kỳ 1 tháng: dòng phụ "Tháng 9 năm 2026 · ĐVT: VNĐ…" | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-244 | Sổ thu hiện đủ 8 cột | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-245 | Sổ chi hiện đủ 5 cột, cột mã ghi "Mã KD" | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-249 | Dòng sổ mang Mã KD của dự án có trong P-06 | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-252 | Dòng sổ mang mã outsource đã xoá vẫn có trong P-06 | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-254 | P-06 không có dòng sổ của dự án khác | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-258 | Dòng sổ đã bị thay khi import không còn trong P-06 | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-261 | Dòng "Tổng cộng" bằng Σ Số tiền các dòng | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-265 | "n dòng · Tổng X" tính trên toàn bộ dòng thoả bộ lọc | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-267 | Không có dòng: "Không có dòng chi tiết nào trong kỳ." | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-272 | Tìm theo Diễn giải ra đúng dòng | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-279 | Tìm "ha noi" ra dòng có "Hà Nội" | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-286 | Sổ chi: "Ẩn dòng bằng 0" bật sẵn | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-289 | Bỏ tích "Ẩn dòng bằng 0": dòng 0 hiện lại | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-291 | Tổng dòng lệch con số báo cáo: dải vàng cảnh báo lệch | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-293 | Đang tìm kiếm: không hiện dải vàng lệch tổng | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-296 | Bấm "Export XLSX": tải về file .xlsx | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-297 | File xuất chỉ có các dòng thoả từ khoá tìm | P1 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-300 | File xuất không có dòng Tổng cộng | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-307 | Tên file xuất "ChiThucTe_ABC_2026-01_2026-08.xlsx" | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-309 | Không có dòng thoả bộ lọc: nút Export XLSX mờ | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-311 | Quá 1.000.000 dòng: báo "Quá nhiều dòng để xuất…" | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-316 | GĐK bấm Export XLSX tải được file | P2 |
| uc-tra-cuu-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-319 | GĐK: file xuất chỉ có dòng sổ dự án khối mình | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-323 | Kế toán bấm "Import sổ kế toán": mở popup Import sổ kế toán | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-326 | Bấm "Mẫu dòng tiền thu": tải Mau_dong_tien_thu.xlsx | P2 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-330 | Bấm "Mẫu chi thực tế": tải Mau_chi_thuc_te.xlsx | P2 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-336 | Chọn file hợp lệ: hiện bước "Kiểm tra & import" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-341 | File .pdf: "Chỉ hỗ trợ file .xlsx, .xls, .csv." | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-344 | File hỏng: "Không đọc được file. File có thể bị hỏng…" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-346 | File quá 20 MB: báo "File vượt giới hạn cho phép…" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-351 | CSV không UTF-8: "File CSV phải lưu dạng UTF-8." | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-354 | Sai dòng tiêu đề: "Không nhận ra loại file…" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-358 | File không có dữ liệu: "File không có dòng dữ liệu nào." | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-360 | Có ô "Ngày hạch toán": nhận sổ Dòng tiền thu | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-361 | Có "Mã dự án" và "Chi sản xuất": nhận sổ Chi thực tế | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-370 | Ngày hạch toán sai: báo lỗi kèm "Dòng {n}" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-374 | Sổ chi trống Mã dự án: "Thiếu Mã dự án." | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-378 | Dòng tháng tương lai: "Tháng 11/2026 sau tháng hiện tại." | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-381 | Có dòng tháng tương lai: nút Import sổ mờ | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-388 | Số "Dòng {n}" khớp số dòng khi mở bằng Excel | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-405 | Dòng không mã công trình: cảnh báo, vẫn lưu vào sổ | P2 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-407 | Chỉ có cảnh báo, không lỗi: nút Import sổ bật | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-415 | Sổ thu: bảng tổng hợp Dự án · Số dòng · Số tiền thu | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-417 | Dòng không mã, mã chưa khớp gom vào "Không gắn / chưa khớp dự án" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-423 | Sổ đã có dòng tháng 09: dải vàng nêu số dòng hiện có | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-428 | Tải danh sách dòng lỗi: file Excel có "Dòng {n}" và lý do | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-436 | Có 1 dòng lỗi: nút Import sổ mờ | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-437 | Bấm Import sổ: hiện hộp xác nhận thay thế | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-438 | Hộp xác nhận nêu số dòng cũ của dự án không có trong file | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-442 | Quay lại trong hộp xác nhận: không ghi, giữ xem trước | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-443 | Đồng ý thay thế: ghi sổ, hiện toast "Đã import …" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-444 | Sổ chưa có dòng các tháng đó: ghi ngay, không hỏi xác nhận | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-445 | Toast "Đã import Chi thực tế: 250 dòng, tháng… — cập nhật {m} dự án" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-446 | Toast đếm cả dự án chỉ có dòng cũ bị thay | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-449 | Import xong tải lại trang: số thực tế mới vẫn còn | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-451 | Import sổ Chi tháng 09: dòng Chi cũ tháng 09 bị thay | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-452 | Import sổ Chi tháng 09: dòng Chi tháng 08 giữ nguyên | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-456 | Thu thực tế tháng bằng Σ Số tiền dòng khớp mã dự án | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-459 | Dự án không còn dòng tháng đó: Chi thực tế về 0 | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-461 | Import sổ Chi tháng mới: Doanh thu tháng đó vẫn "–" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-463 | Dự án Kết thúc vẫn được tính lại Chi thực tế | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-465 | Import sổ Chi tháng mới: Chốt số CP tăng lên | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-468 | Dự án chưa duyệt PAKD có Chi khớp mã: vào báo cáo | P2 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-469 | Lịch sử dự án ghi "Cập nhật Chi thực tế từ sổ kế toán" | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-474 | Lịch sử import ghi đúng tài khoản Kế toán import | P1 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-496 | Huỷ ở bước xem trước: không ghi gì | P2 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-500 | Lịch sử import chỉ hiện 10 lần gần nhất | P2 |
| uc-import-so-ke-toan | CHK-bao-cao-hieu-qua-du-an-510 | Cấp mã outsource X.3: Chi thực tế cộng dòng sổ đã import trước | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-515 | AM: menu "Báo cáo hiệu quả dự án" không hiện | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-516 | AM mở trực tiếp MH-03: "Bạn không có quyền thực hiện thao tác này." | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-520 | Ban lãnh đạo không thấy nút Import sổ kế toán | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-521 | GĐK không thấy nút Import sổ kế toán | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-522 | SM không thấy nút Import sổ kế toán | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-523 | GĐK mở trực tiếp P-07: không mở được | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-525 | Ban lãnh đạo xem được báo cáo dự án mọi khối | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-526 | SM xem được báo cáo dự án khối mình | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-529 | GĐK khối G1 mở dự án khối G2: bị từ chối | P1 |
| chung | CHK-bao-cao-hieu-qua-du-an-533 | SM khối G3: bảng chỉ có dự án khối G3 | P1 |

Tổng: 150 mục / 5 UC

## Retired CHK-IDs

> ID của item đã xóa — KHÔNG reuse, KHÔNG lấp gap. List máy-đọc (validator reject nếu item sống mang ID ở đây).

| CHK-ID | Retired date | Lý do |
|--------|--------------|-------|
