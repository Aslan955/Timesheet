---
type: usecase-index
feature: bao-cao-hieu-qua-du-an
status: draft
updated: 2026-10-03
links:
  - docs/bao-cao-hieu-qua-du-an/srs/bao-cao-hieu-qua-du-an-spec.md
  - docs/_reverse/bao-cao-hieu-qua-du-an/usecases/bao-cao-hieu-qua-du-an-reverse-usecase-index.md
---

# Báo cáo hiệu quả dự án — Use Cases Index

## Use cases

| # | Slug | Level | Status | Actor primary | Covers FR | Screens | Errors (E-*) | OQ ref | Priority | Updated |
|---|------|-------|--------|---------------|-----------|---------|--------------|--------|----------|---------|
| 1 | [uc-xem-tong-quan-khoi](uc-xem-tong-quan-khoi.md) | sea | draft | Người xem báo cáo | FR-bao-cao-hieu-qua-du-an-001, FR-bao-cao-hieu-qua-du-an-002, FR-bao-cao-hieu-qua-du-an-003, FR-bao-cao-hieu-qua-du-an-004, FR-bao-cao-hieu-qua-du-an-005, FR-bao-cao-hieu-qua-du-an-006, FR-bao-cao-hieu-qua-du-an-007, FR-bao-cao-hieu-qua-du-an-008, FR-bao-cao-hieu-qua-du-an-009, FR-bao-cao-hieu-qua-du-an-010, FR-bao-cao-hieu-qua-du-an-016 | MH-03 tab Tổng quan cả khối / công ty | E-bao-cao-hieu-qua-du-an-016, E-bao-cao-hieu-qua-du-an-017, E-bao-cao-hieu-qua-du-an-020, E-bao-cao-hieu-qua-du-an-027 | OQ-5, OQ-10, OQ-21 | P0 | 2026-10-03 |
| 2 | [uc-xem-tong-quan-du-an](uc-xem-tong-quan-du-an.md) | sea | draft | Người xem báo cáo | FR-bao-cao-hieu-qua-du-an-003, FR-bao-cao-hieu-qua-du-an-011, FR-bao-cao-hieu-qua-du-an-012, FR-bao-cao-hieu-qua-du-an-013, FR-bao-cao-hieu-qua-du-an-014, FR-bao-cao-hieu-qua-du-an-015, FR-bao-cao-hieu-qua-du-an-016 | MH-03 tab Tổng quan dự án | E-bao-cao-hieu-qua-du-an-017, E-bao-cao-hieu-qua-du-an-018, E-bao-cao-hieu-qua-du-an-020, E-bao-cao-hieu-qua-du-an-027 | OQ-4 | P0 | 2026-10-03 |
| 3 | [uc-tra-cuu-so-ke-toan](uc-tra-cuu-so-ke-toan.md) | subfunction | draft | Người xem báo cáo | FR-bao-cao-hieu-qua-du-an-016, FR-bao-cao-hieu-qua-du-an-017, FR-bao-cao-hieu-qua-du-an-018, FR-bao-cao-hieu-qua-du-an-019, FR-bao-cao-hieu-qua-du-an-020, FR-bao-cao-hieu-qua-du-an-021 | P-06 Chi tiết sổ kế toán | E-bao-cao-hieu-qua-du-an-015, E-bao-cao-hieu-qua-du-an-019, E-bao-cao-hieu-qua-du-an-023, E-bao-cao-hieu-qua-du-an-027 | — | P0 | 2026-10-03 |
| 4 | [uc-import-so-ke-toan](uc-import-so-ke-toan.md) | sea | draft | Kế toán (CFO) | FR-bao-cao-hieu-qua-du-an-001, FR-bao-cao-hieu-qua-du-an-002, FR-bao-cao-hieu-qua-du-an-022, FR-bao-cao-hieu-qua-du-an-023, FR-bao-cao-hieu-qua-du-an-024, FR-bao-cao-hieu-qua-du-an-025, FR-bao-cao-hieu-qua-du-an-026, FR-bao-cao-hieu-qua-du-an-027, FR-bao-cao-hieu-qua-du-an-028, FR-bao-cao-hieu-qua-du-an-029, FR-bao-cao-hieu-qua-du-an-030, FR-bao-cao-hieu-qua-du-an-031 | P-07 Import sổ kế toán, MH-03 thanh tiêu đề | E-bao-cao-hieu-qua-du-an-001, E-bao-cao-hieu-qua-du-an-002, E-bao-cao-hieu-qua-du-an-003, E-bao-cao-hieu-qua-du-an-004, E-bao-cao-hieu-qua-du-an-005, E-bao-cao-hieu-qua-du-an-006, E-bao-cao-hieu-qua-du-an-007, E-bao-cao-hieu-qua-du-an-008, E-bao-cao-hieu-qua-du-an-009, E-bao-cao-hieu-qua-du-an-010, E-bao-cao-hieu-qua-du-an-011, E-bao-cao-hieu-qua-du-an-012, E-bao-cao-hieu-qua-du-an-013, E-bao-cao-hieu-qua-du-an-014, E-bao-cao-hieu-qua-du-an-015, E-bao-cao-hieu-qua-du-an-021, E-bao-cao-hieu-qua-du-an-022, E-bao-cao-hieu-qua-du-an-024, E-bao-cao-hieu-qua-du-an-025, E-bao-cao-hieu-qua-du-an-026 | OQ-7, OQ-26 | P0 | 2026-10-03 |

## CRUD matrix

| UC \ Entity | DuAn | MaOutsource | PhienBanPAKD | KeHoachThang | ThucTeThang | SoKeToan | DongSoThu | DongSoChi | NhatKyImportSo | LichSuDuAn |
|---|---|---|---|---|---|---|---|---|---|---|
| [uc-xem-tong-quan-khoi](uc-xem-tong-quan-khoi.md) | R | | R | R | R | | | | | |
| [uc-xem-tong-quan-du-an](uc-xem-tong-quan-du-an.md) | R | | R | R | R | | | | | |
| [uc-tra-cuu-so-ke-toan](uc-tra-cuu-so-ke-toan.md) | R | R | | | R | R | R | R | | |
| [uc-import-so-ke-toan](uc-import-so-ke-toan.md) | R | R | | | CU | RU | CRU | CRU | CR | C |

## Actors

| Actor | Loại | Mô tả | Nguồn |
|---|---|---|---|
| Người xem báo cáo (Ban lãnh đạo, GĐK, SM, Kế toán) | primary | Xem báo cáo, tra cứu sổ, xuất XLSX; GĐK / SM chỉ dự án khối mình, Ban lãnh đạo / Kế toán mọi khối (Đã chốt Phase H — Q-19) | Spec Mục 2, BR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-037 |
| AM | — | Không mở MH-03 (menu ẩn, mở trực tiếp bị từ chối — E-bao-cao-hieu-qua-du-an-027), không là actor của UC nào (Đã chốt Phase H — Q-20) | Spec Mục 2, BR-bao-cao-hieu-qua-du-an-037 |
| Kế toán (CFO) | primary | Import sổ kế toán, xem Lịch sử import | Spec Mục 2, BR-bao-cao-hieu-qua-du-an-037 |
| Hệ thống | system | Tính chốt số, kỳ so sánh, mức sức khoẻ, ghép dòng sổ, tính lại thực tế | Spec Mục 2 |
| Quy trình PAKD (feature `phuong-an-kinh-doanh`) | secondary | Cung cấp kế hoạch theo tháng khi Kế toán duyệt PAKD | Spec Mục 11 Dependencies |
| Khối Số liệu theo tháng (feature `quan-ly-du-an-kinh-doanh`) | secondary | Cung cấp Doanh thu, KLCV thực tế do Kế toán import | Spec Mục 11 Dependencies |

## Relationships

| Type | From | To | Rationale |
|---|---|---|---|
| extend | uc-xem-tong-quan-du-an | uc-xem-tong-quan-khoi | Mở tab dự án khi người xem bấm 1 dòng ở bảng chi tiết (tab tổng quan vẫn đủ nếu không bấm) |
| extend | uc-tra-cuu-so-ke-toan | uc-xem-tong-quan-khoi | Mở P-06 khi người xem bấm số thực tế Chi phí / Dòng tiền thu khác 0 |
| extend | uc-tra-cuu-so-ke-toan | uc-xem-tong-quan-du-an | Mở P-06 khi người xem bấm số thực tế Chi phí / Dòng tiền thu khác 0 |

## Nguồn dữ liệu

* FR + Error Matrix: [[docs/bao-cao-hieu-qua-du-an/srs/bao-cao-hieu-qua-du-an-spec.md|SRS spec]]
* Flows: [[docs/bao-cao-hieu-qua-du-an/srs/bao-cao-hieu-qua-du-an-flows.md|Flows]]
* Open Questions: `srs/bao-cao-hieu-qua-du-an-spec.md` Mục 12 (canonical)
