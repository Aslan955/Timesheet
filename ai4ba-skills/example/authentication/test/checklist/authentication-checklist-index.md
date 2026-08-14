---
type: test-checklist-index
feature: authentication
status: stale
updated: 2026-07-19
next_chk_id: 105
links:
  - docs/authentication/srs/authentication-spec.md
  - docs/authentication/usecases/authentication-usecase-index.md
  - docs/authentication/ascii-wireframe/authentication-wireframe-index.md
---

# Test Checklists — authentication‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Master metadata + bảng Checklists cho feature authentication. File `checklist-*.md` là __zero frontmatter__ (parser-friendly cho QA tool ngoài). Preview HTML self-contained xem ở `preview.html` (double-click mở browser). Grammar item: `[priority] [Yes/No] CHK-authentication-NNN → Ref · nội dung`.

## Checklists‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Scope | Target | File | Items | P1 | P2 | P3 | P4 | Auto (Yes/No) | Status | Updated |
|-------|--------|------|-------|----|----|----|----|---------------|--------|---------|
| uc | uc-signup-email | [checklist-uc-signup-email.md](checklist-uc-signup-email.md) | 20 | 11 | 6 | 3 | 0 | 16/4 | draft | 2026-07-19 |
| uc | uc-verify-email | [checklist-uc-verify-email.md](checklist-uc-verify-email.md) | 16 | 8 | 6 | 2 | 0 | 12/4 | draft | 2026-07-19 |
| uc | uc-login-email | [checklist-uc-login-email.md](checklist-uc-login-email.md) | 20 | 15 | 4 | 1 | 0 | 14/6 | draft | 2026-07-19 |
| uc | uc-google-oauth | [checklist-uc-google-oauth.md](checklist-uc-google-oauth.md) | 14 | 8 | 5 | 1 | 0 | 9/5 | draft | 2026-07-19 |
| uc | uc-forgot-password | [checklist-uc-forgot-password.md](checklist-uc-forgot-password.md) | 20 | 12 | 7 | 1 | 0 | 14/6 | draft | 2026-07-19 |
| uc | uc-unlink-google | [checklist-uc-unlink-google.md](checklist-uc-unlink-google.md) | 14 | 8 | 4 | 2 | 0 | 11/3 | draft | 2026-07-19 |
| | __Total__ | | __104__ | __62__ | __32__ | __10__ | __0__ | __76/28__ | | |

__Status values:__ `draft` / `in-review` / `revisions` / `approved` / `shipped`.

## Coverage‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Per-obligation: mỗi UC-scope phủ obligation nào (FR/BR/NFR/E). Tầng = UI (checklist này). Tầng API (`/api-checklist`) chưa chạy cho feature này → cột API `—`.

| Scope | Obligations phủ (từ Ref) | Tầng | State |
|-------|--------------------------|------|-------|‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| uc-signup-email | FR-001, FR-002, FR-003, FR-004, FR-031, E-001, E-002, BR-001, BR-002 | UI | covered |
| uc-verify-email | FR-004, FR-005, FR-006, FR-007, E-006, E-007, BR-001 | UI | covered |
| uc-login-email | FR-008, FR-009, FR-010, FR-011, FR-021, FR-022, FR-025, FR-026, FR-027, E-003, E-004, E-005, BR-005, BR-006, BR-011, NFR-006, NFR-007, NFR-009 | UI | covered |
| uc-google-oauth | FR-012, FR-013, FR-014, FR-015, E-008, BR-003, BR-009 | UI | covered |
| uc-forgot-password | FR-016, FR-017, FR-018, FR-019, FR-020, E-002, E-009, BR-008 | UI | covered |
| uc-unlink-google | FR-023, FR-024, FR-003, E-010, BR-004 | UI | covered |

## Retired CHK-IDs‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

*Chưa có — bản khởi tạo đầu tiên (CHK-authentication-001..104).*

## Preview‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- `preview.html` — viewer (Bootstrap 5 + SheetJS), filter/search/export Excel + dropdown lọc theo file checklist. Double-click mở browser file:// trực tiếp. Copy literal từ `_templates/test-checklist-preview.html`.
- `data.js` — chứa `window.CHECKLISTS_DATA` (104 items parse từ 6 file `checklist-*.md`). `preview.html` load qua `<script src="data.js">`. Regen mỗi lần `/test-checklist` chạy.

## Links upstream

- [[docs/authentication/srs/authentication-spec.md|SRS spec]]
- [[docs/authentication/usecases/authentication-usecase-index.md|Use Cases index]]
- [[docs/authentication/ascii-wireframe/authentication-wireframe-index.md|Screens index]]‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
