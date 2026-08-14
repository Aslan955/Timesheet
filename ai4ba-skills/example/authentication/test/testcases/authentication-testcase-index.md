---
type: test-cases-index
feature: authentication
status: draft
updated: 2026-07-20
links:
  - docs/authentication/test/checklist/authentication-checklist-index.md
  - docs/authentication/srs/authentication-spec.md
---

# Test Cases — authentication‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Master metadata + bảng TestCases cho feature authentication. File `testcases-*.md` là **zero frontmatter** (parser-ready). Sinh **1:1** từ checklist gần nhất (`test/checklist/`) — mỗi checklist item → đúng 1 TC. Preview HTML self-contained ở `preview.html` (double-click mở browser).

## TestCases‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Scope | Target | File | TC | Nguồn checklist | Updated |
|-------|--------|------|----|-----------------|---------|
| uc | uc-signup-email | [testcases-uc-signup-email.md](testcases-uc-signup-email.md) | 20 | checklist-uc-signup-email.md | 2026-07-19 |
| uc | uc-verify-email | [testcases-uc-verify-email.md](testcases-uc-verify-email.md) | 16 | checklist-uc-verify-email.md | 2026-07-19 |
| uc | uc-login-email | [testcases-uc-login-email.md](testcases-uc-login-email.md) | 20 | checklist-uc-login-email.md | 2026-07-19 |
| uc | uc-google-oauth | [testcases-uc-google-oauth.md](testcases-uc-google-oauth.md) | 14 | checklist-uc-google-oauth.md | 2026-07-19 |
| uc | uc-forgot-password | [testcases-uc-forgot-password.md](testcases-uc-forgot-password.md) | 20 | checklist-uc-forgot-password.md | 2026-07-19 |
| uc | uc-unlink-google | [testcases-uc-unlink-google.md](testcases-uc-unlink-google.md) | 14 | checklist-uc-unlink-google.md | 2026-07-19 |
| | **Total** | | **104** | | |

> Traceability 1:1: 104 TC ↔ 104 checklist item (CHK-authentication-001..104). Mỗi TC anchor về CHK-ID qua field **Checklist**. Nguồn cho `/playwright-gen` (codegen `.spec.ts`).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Cần bổ sung‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Các điểm cần BA/dev cấp thêm để TC automation-ready. Bản khởi tạo: một số TC có `Preconditions` dạng "(dựng: ...)" cần fixture setup; Action ở mức nghiệp vụ (codegen map nhãn nút/field). Chưa có TBD chặn.

| File/Scope | CHK-ID | Field/Step | Loại | Thiếu gì | Gợi ý cấp |
|------------|--------|-----------|------|----------|-----------|
| (chưa có) | — | — | — | — | — |

## Preview‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- `preview.html` — viewer (Bootstrap 5 + SheetJS), filter/search/export Excel (flat + merged). Double-click mở browser file://. Copy literal từ `_templates/test-cases-preview.html`.
- `data.js` — chứa `window.TESTCASES_DATA` (104 TC parse từ 6 file `testcases-*.md`). Regen mỗi lần `/test-cases` chạy.

## Links upstream‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- [[docs/authentication/test/checklist/authentication-checklist-index.md|Test Checklists index]]
- [[docs/authentication/srs/authentication-spec.md|SRS spec]]‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
