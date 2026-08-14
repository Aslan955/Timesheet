---
type: bpmn-index
feature: authentication
status: draft
updated: 2026-07-19
links:
  - docs/authentication/usecases/uc-signup-email.md
  - docs/authentication/usecases/uc-verify-email.md
  - docs/authentication/usecases/uc-login-email.md
  - docs/authentication/usecases/uc-google-oauth.md
  - docs/authentication/srs/authentication-flows.md
---

# authentication — BPMN Index‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Master index cho mọi quy trình BPMN 2.0 của feature authentication. File `.bpmn` là XML chuẩn OMG đầy đủ (semantic + BPMNDiagram swimlane) — import được Camunda/Bizagi/draw.io. Render qua `_viewer.html` (double-click).

## Processes‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Process | File | Lanes | Gateways | Viewer |
|---------|------|-------|----------|--------|
| Đăng ký + xác nhận email | `signup-verify-email.bpmn` | 3 | 3 | `_viewer.html#signup-verify-email` |
| Đăng nhập bằng email | `login-email.bpmn` | 2 | 4 | `_viewer.html#login-email` |
| Đăng nhập bằng Google | `login-google.bpmn` | 3 | 3 | `_viewer.html#login-google` |

**Nhánh quyết định chính:**
- *Signup+verify:* mật khẩu đạt chính sách (E-002) · email đã đăng ký (E-001) · token còn hạn (E-006).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
- *Login email:* sai mật khẩu → đếm fail, ≥5 lần khóa 24h (E-005) · account chưa verified (E-004) · onboarding.
- *Login Google:* callback thất bại (E-008) · email Google đã có account → auto-link, chưa có → tạo mới · onboarding.

## Links upstream‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- [[docs/authentication/usecases/uc-signup-email.md|UC Đăng ký email]]
- [[docs/authentication/usecases/uc-verify-email.md|UC Xác nhận email]]
- [[docs/authentication/srs/authentication-flows.md|SRS flows]]

## Changelog‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Newest entries on top. Format: `{date} | {skill-name} | {note}`. Apply cho mọi process BPMN của feature.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
