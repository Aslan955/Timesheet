---
type: usecase-index
feature: quan-ly-du-an-kinh-doanh
status: draft
updated: 2026-10-03
links:
  - docs/quan-ly-du-an-kinh-doanh/srs/quan-ly-du-an-kinh-doanh-spec.md
  - docs/quan-ly-du-an-kinh-doanh/srs/quan-ly-du-an-kinh-doanh-flows.md
  - docs/quan-ly-du-an-kinh-doanh/srs/quan-ly-du-an-kinh-doanh-states.md
  - docs/_reverse/quan-ly-du-an-kinh-doanh/usecases/quan-ly-du-an-kinh-doanh-reverse-usecase-index.md
---

# Quản lý dự án kinh doanh — Use Cases Index

## Use cases

> FR / E viết tắt số cuối của `FR-quan-ly-du-an-kinh-doanh-NNN` / `E-quan-ly-du-an-kinh-doanh-NNN`. Priority TBD (reverse OQ-21).

| # | Slug | Level | Status | Actor primary | Covers FR | Screens | Errors (E-*) | OQ ref | Priority | Updated |
|---|------|-------|--------|---------------|-----------|---------|--------------|--------|----------|---------|
| 1 | [uc-xem-so-theo-doi-du-an](uc-xem-so-theo-doi-du-an.md) | sea | draft | AM / SM / GĐK / Kế toán | FR-001, 002, 003, 005, 006, 007, 008, 009, 010, 046, 047 | MH-02a | E-022, 030 | — | TBD | 2026-10-03 |
| 2 | [uc-dat-muc-tieu-khoi](uc-dat-muc-tieu-khoi.md) | fish | draft | Kế toán | FR-004 | MH-02a, P-05 | E-030, 037, 040 | — | TBD | 2026-10-03 |
| 3 | [uc-tao-du-an](uc-tao-du-an.md) | sea | draft | AM / SM / GĐK | FR-011, 012, 013, 014, 015, 017, 018 | MH-02b | E-001 → 006, 027, 030, 037, 038, 040, 041 | reverse OQ-6 | TBD | 2026-10-03 |
| 4 | [uc-them-khach-hang](uc-them-khach-hang.md) | fish | draft | AM / SM / GĐK | FR-016, 017 | P-01 | E-007 → 011, 039, 040, 043 | — | TBD | 2026-10-03 |
| 5 | [uc-duyet-ma-du-an](uc-duyet-ma-du-an.md) | sea | draft | GĐK | FR-015, 020, 028 | MH-02c | E-023, 027, 030, 037 | — | TBD | 2026-10-03 |
| 6 | [uc-tu-choi-ma-du-an](uc-tu-choi-ma-du-an.md) | sea | draft | GĐK | FR-041 | MH-02c, hộp lý do từ chối | E-028, 030, 037, 040 | — | TBD | 2026-10-03 |
| 7 | [uc-gui-lai-yeu-cau-mo-ma](uc-gui-lai-yeu-cau-mo-ma.md) | sea | draft | Người tạo dự án / SM của dự án | FR-029, 042 | MH-02c | E-001 → 006, 030, 037 | — | TBD | 2026-10-03 |
| 8 | [uc-xem-chi-tiet-du-an](uc-xem-chi-tiet-du-an.md) | sea | draft | AM / SM / GĐK / Kế toán | FR-019, 020, 021, 024, 026, 027, 040, 044 | MH-02c | E-023, 026, 030 | reverse OQ-6 | TBD | 2026-10-03 |
| 9 | [uc-sua-thong-tin-co-ban](uc-sua-thong-tin-co-ban.md) | sea | draft | AM / SM / GĐK | FR-029, 030 | MH-02c (chế độ sửa) | E-001 → 006, 030, 037, 038, 040, 041 | — | TBD | 2026-10-03 |
| 10 | [uc-cap-nhat-ky-hop-dong](uc-cap-nhat-ky-hop-dong.md) | sea | draft | SM / GĐK / Kế toán | FR-010, 025, 031, 032, 033, 048 | P-03 | E-012 → 019, 030, 037, 040, 041 | — (reverse OQ-12 đã chốt Phase H) | TBD | 2026-10-03 |
| 11 | [uc-quan-ly-ma-outsource](uc-quan-ly-ma-outsource.md) | fish | draft | SM / GĐK / Kế toán | FR-021, 022, 023 | MH-02c | E-021, 030, 037, 038 | — | TBD | 2026-10-03 |
| 12 | [uc-dinh-kem-tai-lieu](uc-dinh-kem-tai-lieu.md) | fish | draft | AM / SM / GĐK / Kế toán | FR-018, 025 | MH-02c | E-037, 041 | — | TBD | 2026-10-03 |
| 13 | [uc-xoa-du-an](uc-xoa-du-an.md) | sea | draft | GĐK | FR-034 | MH-02c, hộp xoá có lý do | E-020, 024, 029, 030, 037, 040 | — | TBD | 2026-10-03 |
| 14 | [uc-ket-thuc-du-an](uc-ket-thuc-du-an.md) | sea | draft | GĐK / Kế toán | FR-035 | MH-02c | E-025, 030, 037 | — | TBD | 2026-10-03 |
| 15 | [uc-mo-lai-du-an-ket-thuc](uc-mo-lai-du-an-ket-thuc.md) | sea | draft | Kế toán | FR-043 | MH-02c, hộp mở lại có lý do | E-030, 037, 042 | — | TBD | 2026-10-03 |
| 16 | [uc-tu-dong-chuyen-pending](uc-tu-dong-chuyen-pending.md) | fish | draft | Hệ thống | FR-036 | (không có màn) | — | — | TBD | 2026-10-03 |
| 17 | [uc-mo-lai-du-an-pending](uc-mo-lai-du-an-pending.md) | sea | draft | Kế toán | FR-037, 038 | MH-02c | E-023, 030, 037 | — | TBD | 2026-10-03 |
| 18 | [uc-import-so-lieu-thuc-te](uc-import-so-lieu-thuc-te.md) | sea | draft | Kế toán | FR-044, 045 | MH-02c, popup Import thực tế | E-030, 031 → 037, 044 | — | TBD | 2026-10-03 |

> FR-039 (thông báo thành công) là FR xuyên suốt, xuất hiện ở bước kết thúc của từng UC. FR-038 (trạng thái dự án theo PAKD) chủ yếu thuộc use case của feature `phuong-an-kinh-doanh`; ở đây chỉ phủ phần quyết định khi dự án Pending (UC 17).

## CRUD matrix

| UC \ Entity | DuAn | KhachHang | NhanSu | MucTieuKhoi | HopDong | PhuLucHopDong | TepDinhKem | MaOutsource | LichSuDuAn | NhatKyXoa | SoLieuThang |
|---|---|---|---|---|---|---|---|---|---|---|---|
| [uc-xem-so-theo-doi-du-an](uc-xem-so-theo-doi-du-an.md) | R | R | R | R | R |  | R |  |  |  |  |
| [uc-dat-muc-tieu-khoi](uc-dat-muc-tieu-khoi.md) |  |  |  | CUD |  |  |  |  |  |  |  |
| [uc-tao-du-an](uc-tao-du-an.md) | C | R | R |  |  |  | C |  | C |  |  |
| [uc-them-khach-hang](uc-them-khach-hang.md) |  | C |  |  |  |  |  |  |  |  |  |
| [uc-duyet-ma-du-an](uc-duyet-ma-du-an.md) | U |  |  |  |  |  |  |  | C |  |  |
| [uc-tu-choi-ma-du-an](uc-tu-choi-ma-du-an.md) | U |  |  |  |  |  |  |  | C |  |  |
| [uc-gui-lai-yeu-cau-mo-ma](uc-gui-lai-yeu-cau-mo-ma.md) | U |  |  |  |  |  |  |  | C |  |  |
| [uc-xem-chi-tiet-du-an](uc-xem-chi-tiet-du-an.md) | R | R | R |  | R | R | R | R | R |  | R |
| [uc-sua-thong-tin-co-ban](uc-sua-thong-tin-co-ban.md) | U | R | R |  |  |  | CD |  | C |  |  |
| [uc-cap-nhat-ky-hop-dong](uc-cap-nhat-ky-hop-dong.md) | U |  |  |  | CRU | CRUD | CD |  | C |  |  |
| [uc-quan-ly-ma-outsource](uc-quan-ly-ma-outsource.md) | R |  | R |  |  |  |  | CUD | C |  |  |
| [uc-dinh-kem-tai-lieu](uc-dinh-kem-tai-lieu.md) | R |  |  |  |  |  | CRD |  | C |  |  |
| [uc-xoa-du-an](uc-xoa-du-an.md) | U |  |  |  |  |  |  |  |  | C |  |
| [uc-ket-thuc-du-an](uc-ket-thuc-du-an.md) | U |  |  |  |  |  |  |  | C |  |  |
| [uc-mo-lai-du-an-ket-thuc](uc-mo-lai-du-an-ket-thuc.md) | U |  |  |  |  |  |  |  | C |  |  |
| [uc-tu-dong-chuyen-pending](uc-tu-dong-chuyen-pending.md) | U |  |  |  |  |  |  |  | C |  |  |
| [uc-mo-lai-du-an-pending](uc-mo-lai-du-an-pending.md) | U |  |  |  |  |  |  |  | C |  |  |
| [uc-import-so-lieu-thuc-te](uc-import-so-lieu-thuc-te.md) | U |  |  |  |  |  |  |  |  |  | CU |

## Actors

| Actor | Loại | Mô tả | Nguồn |
|---|---|---|---|
| AM | primary | Tạo / sửa yêu cầu mở mã, gửi lại (nếu là người tạo), đính kèm tài liệu; chỉ dự án khối mình; không xem PAKD, Sổ theo dõi, MH-03 | spec Mục 2, BR-053 |
| SM (Giám đốc kinh doanh) | primary | Như AM (gửi lại khi là người tạo hoặc SM của dự án) + Sổ theo dõi khối mình, lưu hợp đồng, quản lý mã outsource, lập / sửa PAKD | spec Mục 2, BR-053 |
| GĐK (Giám đốc khối) | primary | Duyệt / từ chối mã, xoá yêu cầu, kết thúc dự án, lưu hợp đồng, mã outsource — chỉ dự án khối mình | spec Mục 2, BR-053 |
| Kế toán (CFO) | primary | Đặt mục tiêu, lưu hợp đồng, mã outsource, kết thúc, mở lại Pending / Kết thúc, import thực tế | spec Mục 2 |
| Hệ thống | system | Tác vụ hằng ngày chuyển Pending, sinh mã, ghi lịch sử | spec Mục 2 |
| IMIS | secondary | Danh mục nhân sự và khách hàng dùng chung | spec Mục 2 |
| BOD | secondary | Mục tiêu đã duyệt ghi đè số nhập tay (qua MH-01) | spec Mục 2 |

## Relationships

| Type | From | To | Rationale |
|---|---|---|---|
| extend | uc-them-khach-hang | uc-tao-du-an | Chỉ khi khách hàng chưa có trong danh mục; tạo dự án vẫn đủ nếu không xảy ra |
| extend | uc-them-khach-hang | uc-sua-thong-tin-co-ban | Chỉ khi dự án chưa có mã và cần khách hàng mới |
| include | uc-gui-lai-yeu-cau-mo-ma | uc-sua-thong-tin-co-ban | Gửi lại luôn đi kèm sửa thông tin theo lý do từ chối |

## Nguồn dữ liệu

* FR + Error Matrix: [[docs/quan-ly-du-an-kinh-doanh/srs/quan-ly-du-an-kinh-doanh-spec.md|SRS spec]]
* Flows: [[docs/quan-ly-du-an-kinh-doanh/srs/quan-ly-du-an-kinh-doanh-flows.md|Flows]] · States: [[docs/quan-ly-du-an-kinh-doanh/srs/quan-ly-du-an-kinh-doanh-states.md|States]]
* Open Questions: `srs/quan-ly-du-an-kinh-doanh-spec.md` Mục 12 (canonical)
