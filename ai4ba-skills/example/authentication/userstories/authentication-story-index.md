---
type: userstory-index
feature: authentication
status: draft
updated: 2026-07-17
links:
  - docs/authentication/srs/authentication-spec.md
---

# authentication — User Stories Index‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Master index cho mọi user stories của feature authentication. Mỗi story file riêng (zero frontmatter, prose + AC inline). Metadata + status + priority + jira key tập trung ở file này. Lịch sử ở `docs/_shared/changelog.md`.

## Stories‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | ID | Title | Persona | Covers FR | Screens | Priority | Status | Jira | Updated |
|---|----|----|----|----|----|----|----|----|----|
| 1 | [US-001](us-001.md) | Đăng ký bằng email + mật khẩu | Học viên miễn phí | FR-...-001, 002, 003, 004 | signup, verify-sent | P0 | draft | — | 2026-07-17 |
| 2 | [US-002](us-002.md) | Xác nhận email qua link | Học viên miễn phí | FR-...-004, 005, 006 | verify-sent, verify-result-success/expired | P0 | draft | — | 2026-07-17 |
| 3 | [US-003](us-003.md) | Gửi lại email xác nhận | Học viên miễn phí | FR-...-007 | verify-sent | P0 | draft | — | 2026-07-17 |
| 4 | [US-004](us-004.md) | Đăng nhập email + mật khẩu (remember-me) | Người dùng quay lại | FR-...-008, 009, 011 | login | P0 | draft | — | 2026-07-17 |
| 5 | [US-005](us-005.md) | Bảo vệ chống dò mật khẩu (captcha + khóa) | Người dùng quay lại | FR-...-010, 025, 026, 027 | login | P0 | draft | — | 2026-07-17 |
| 6 | [US-006](us-006.md) | Đăng ký/đăng nhập bằng Google | Người dùng ưu tiên Google | FR-...-012, 013, 015 | login | P0 | draft | — | 2026-07-17 |
| 7 | [US-007](us-007.md) | Tự động liên kết Google trùng email | Người dùng ưu tiên Google | FR-...-014 | login | P0 | draft | — | 2026-07-17 |
| 8 | [US-008](us-008.md) | Yêu cầu đặt lại mật khẩu (quên MK) | Người dùng quay lại | FR-...-016, 017 | forgot-password | P0 | draft | — | 2026-07-17 |
| 9 | [US-009](us-009.md) | Đặt mật khẩu mới + đăng xuất mọi phiên | Người dùng quay lại | FR-...-018, 019, 020, 003 | reset-password, reset-result-success | P0 | draft | — | 2026-07-17 |
| 10 | [US-010](us-010.md) | Gỡ liên kết Google (buộc đặt MK) | Người dùng ưu tiên Google | FR-...-023, 024, 003 | account-security | P0 | draft | — | 2026-07-17 |
| 11 | [US-011](us-011.md) | Đa thiết bị + đăng xuất hiện tại | Học viên trả phí | FR-...-021, 022 | login | P0 | draft | — | 2026-07-17 |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 12 | [US-012](us-012.md) | Danh sách thiết bị + đăng xuất từ xa | Học viên trả phí | FR-...-030 | account-security | P1 | draft | — | 2026-07-17 |
| 13 | [US-013](us-013.md) | Đo độ mạnh mật khẩu real-time | Học viên miễn phí | FR-...-029 | signup, reset-password | P1 | draft | — | 2026-07-17 |
| 14 | [US-014](us-014.md) | Captcha chống bot khi đăng ký | Bộ phận vận hành / hỗ trợ | FR-...-031 | signup | P1 | draft | — | 2026-07-17 |

**Status:** `draft`/`in-review`/`revisions`/`approved`/`shipped`/`stale`. **Jira:** `—` = chưa push; mapping canonical ở `.claude/state/atlassian/sync-state.yaml`.

> **Slice:** 14 stories gộp 31 FR theo năng lực dọc (không 1-FR-1-story). US-005 gom brute-force (FR-010/025/026/027). US-006 (Google gốc) và US-007 (auto-link) tách vì auto-link có rủi ro chiếm tài khoản riêng (OQ). US-011 (P0) và US-012 (P1) tách theo priority.

## Coverage check (P0 FR → story)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Mọi FR P0 (FR-001..026 trừ 027/028) đều có ≥1 story: signup/verify (001-007→US-001/002/003), login/brute-force (008-011, 025-026→US-004/005), Google (012-015→US-006/007), reset (016-020→US-008/009), multi-device (021-022→US-011), unlink (023-024→US-010).

> FR-028 (tự xóa tài khoản `unverified` quá 24h, P1) là tiến trình nền, không có màn user-facing → chưa gắn story riêng; candidate cho `/gap`.

## Open Questions (aggregated)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* [ ] US-003 — quota gửi lại 5 lần/ngày theo lịch hay cửa sổ trượt 24h? (SRS Mục 12)
* [ ] US-005 — bộ đếm sai reset khi nào? (SRS Mục 12)
* [ ] US-007 — cần xác minh quyền sở hữu khi auto-link Google? (SRS Mục 11 + 12)

## Links upstream‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* [[docs/authentication/srs/authentication-spec.md|SRS spec]]‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
