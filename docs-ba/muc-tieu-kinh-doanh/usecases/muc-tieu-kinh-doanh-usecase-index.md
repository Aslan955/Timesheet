---
type: usecase-index
feature: muc-tieu-kinh-doanh
status: draft
updated: 2026-10-03
links:
  - docs/muc-tieu-kinh-doanh/srs/muc-tieu-kinh-doanh-spec.md
  - docs/_reverse/muc-tieu-kinh-doanh/usecases/muc-tieu-kinh-doanh-reverse-usecase-index.md
---

# Mục tiêu kinh doanh — Use Cases Index

## Use cases

| # | Slug | Level | Status | Actor primary | Covers FR | Screens | Errors (E-*) | OQ ref | Priority | Updated |
|---|------|-------|--------|---------------|-----------|---------|--------------|--------|----------|---------|
| 1 | [uc-lap-ho-so-muc-tieu](uc-lap-ho-so-muc-tieu.md) | sea | draft | Giám đốc khối | FR-muc-tieu-kinh-doanh-002, FR-muc-tieu-kinh-doanh-005, FR-muc-tieu-kinh-doanh-006, FR-muc-tieu-kinh-doanh-007, FR-muc-tieu-kinh-doanh-008, FR-muc-tieu-kinh-doanh-009, FR-muc-tieu-kinh-doanh-010, FR-muc-tieu-kinh-doanh-011, FR-muc-tieu-kinh-doanh-012, FR-muc-tieu-kinh-doanh-014, FR-muc-tieu-kinh-doanh-015, FR-muc-tieu-kinh-doanh-016, FR-muc-tieu-kinh-doanh-017, FR-muc-tieu-kinh-doanh-025, FR-muc-tieu-kinh-doanh-026, FR-muc-tieu-kinh-doanh-027 | Tab GĐK lập mục tiêu | E-muc-tieu-kinh-doanh-004, E-muc-tieu-kinh-doanh-006, E-muc-tieu-kinh-doanh-009, E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-014, E-muc-tieu-kinh-doanh-015 | reverse:OQ-8 | P0 | 2026-10-03 |
| 2 | [uc-gui-bod-duyet](uc-gui-bod-duyet.md) | sea | draft | Giám đốc khối | FR-muc-tieu-kinh-doanh-013, FR-muc-tieu-kinh-doanh-014, FR-muc-tieu-kinh-doanh-015, FR-muc-tieu-kinh-doanh-016, FR-muc-tieu-kinh-doanh-023, FR-muc-tieu-kinh-doanh-027 | Tab GĐK lập mục tiêu | E-muc-tieu-kinh-doanh-001, E-muc-tieu-kinh-doanh-002, E-muc-tieu-kinh-doanh-003, E-muc-tieu-kinh-doanh-004, E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-011, E-muc-tieu-kinh-doanh-013, E-muc-tieu-kinh-doanh-014 | — (reverse:OQ-7(a) đã chốt Phase H Q-45) | P0 | 2026-10-03 |
| 3 | [uc-rut-ho-so](uc-rut-ho-so.md) | sea | draft | Giám đốc khối | FR-muc-tieu-kinh-doanh-005, FR-muc-tieu-kinh-doanh-014, FR-muc-tieu-kinh-doanh-016, FR-muc-tieu-kinh-doanh-023, FR-muc-tieu-kinh-doanh-024 | Tab GĐK lập mục tiêu, Popup Rút hồ sơ | E-muc-tieu-kinh-doanh-008, E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-014 | — (reverse:OQ-7(b) đã chốt Phase H Q-21) | P1 | 2026-10-03 |
| 4 | [uc-bod-phe-duyet](uc-bod-phe-duyet.md) | sea | draft | BOD | FR-muc-tieu-kinh-doanh-001, FR-muc-tieu-kinh-doanh-018, FR-muc-tieu-kinh-doanh-019, FR-muc-tieu-kinh-doanh-020, FR-muc-tieu-kinh-doanh-022, FR-muc-tieu-kinh-doanh-023, FR-muc-tieu-kinh-doanh-025, FR-muc-tieu-kinh-doanh-026 | Tab BOD — danh sách, Tab BOD — chi tiết hồ sơ | E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-012, E-muc-tieu-kinh-doanh-014 | reverse:OQ-12 (reverse:OQ-7(b) đã chốt Phase H Q-21) | P0 | 2026-10-03 |
| 5 | [uc-bod-tu-choi](uc-bod-tu-choi.md) | sea | draft | BOD | FR-muc-tieu-kinh-doanh-018, FR-muc-tieu-kinh-doanh-019, FR-muc-tieu-kinh-doanh-021, FR-muc-tieu-kinh-doanh-023, FR-muc-tieu-kinh-doanh-026 | Tab BOD — chi tiết hồ sơ | E-muc-tieu-kinh-doanh-005, E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-014 | — (reverse:OQ-7(b) đã chốt Phase H Q-21) | P0 | 2026-10-03 |

## CRUD matrix

| UC \ Entity | TargetPlan | TargetRow | SubmittedRow | TargetLog | OfficialDivisionTarget | Division | UserAccount |
|---|---|---|---|---|---|---|---|
| [uc-lap-ho-so-muc-tieu](uc-lap-ho-so-muc-tieu.md) | CRU | CRUD | R | CR | R | R | R |
| [uc-gui-bod-duyet](uc-gui-bod-duyet.md) | CRU | CR | CRU | CR | | R | R |
| [uc-rut-ho-so](uc-rut-ho-so.md) | RU | R | | CR | | | R |
| [uc-bod-phe-duyet](uc-bod-phe-duyet.md) | RU | R | | CR | CU | R | R |
| [uc-bod-tu-choi](uc-bod-tu-choi.md) | RU | R | | CR | | R | R |

## Actors

| Actor | Loại | Mô tả | Nguồn |
|---|---|---|---|
| Giám đốc khối (GĐK) | primary | Lập, lưu nháp, gửi, rút hồ sơ mục tiêu năm của khối gắn với tài khoản (mỗi tài khoản 1 vai trò) | spec Mục 2 · reverse OQ-2 · Phase H Q-27 |
| BOD (Ban giám đốc) | primary | Xem hồ sơ đã gửi của mọi khối, phê duyệt / từ chối | spec Mục 2 · reverse OQ-2 |
| Kho mục tiêu khối (Sổ theo dõi dự án) | system | Nhận mục tiêu chính thức khi BOD phê duyệt (feature `quan-ly-du-an-kinh-doanh`) | spec Mục 2, Mục 11 |
| Đăng nhập / tài khoản | system | Cung cấp tên, vai trò, khối của tài khoản (`phuong-an-kinh-doanh:OQ-5`) | spec Mục 11 |

## Nguồn dữ liệu

* FR + Error Matrix: [[docs/muc-tieu-kinh-doanh/srs/muc-tieu-kinh-doanh-spec.md|SRS spec]]
* Open Questions: `srs/muc-tieu-kinh-doanh-spec.md` Mục 12 (canonical)
