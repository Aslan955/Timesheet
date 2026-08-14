---
type: wireframe-html-index
feature: authentication
status: stale
updated: 2026-07-19
links:
  - docs/authentication/srs/authentication-userflow.md
  - docs/authentication/ascii-wireframe/authentication-wireframe-index.md
---

# authentication — HTML Wireframes‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> HTML wireframe files (B&W, static, no JS/CDN) cho các flows của feature authentication. Nguồn chia flow: `srs/authentication-userflow.md` Mục 3. Nguồn elements: `ascii-wireframe/{flow}.md` (bảng mô tả 5 cột). Device: desktop 1024, form auth căn giữa box hẹp ~400px theo `ba-conventions.md` Mục 8.
>
> __Cửa vào điều hướng (mở cái này):__ [`authentication-wireframe.html`](authentication-wireframe.html) — sidebar mục lục (flow → màn) + tab "Tổng quan" là sơ đồ luồng click được + iframe load từng flow. Double-click mở browser. Các file `{flow}.html` bên dưới là từng luồng riêng (index chỉ là lớp điều hướng, không gộp).

## Flows‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Flow | File | Screens (theo thứ tự) | Status |
|---|------|------|-----------------------|--------|
| 1 | Đăng nhập email + password | [login-email.html](login-email.html) | login | draft |
| 2 | Đăng ký + xác nhận email | [signup-verify.html](signup-verify.html) | signup → verify-sent → verify-result-success → verify-result-expired | draft |
| 3 | Đăng nhập/đăng ký qua Google | [google-oauth.html](google-oauth.html) | login [chung với flow 1] + bảng nhánh nghiệp vụ OAuth | draft |
| 4 | Quên mật khẩu / đặt lại | [forgot-password.html](forgot-password.html) | forgot-password → reset-password → reset-result-success | draft |
| 5 | Gỡ liên kết Google | [unlink-google.html](unlink-google.html) | account-security (+ dialog tạo mật khẩu) | draft |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Status:__ `draft` / `in-review` / `revisions` / `approved` / `shipped`.

__Quy ước:__
* `[chung với flow X]` — màn hình dùng chung với flow khác, render đầy đủ trong cả 2.
* Hai trạng thái kết quả loại trừ nhau (verify-result-success vs verify-result-expired) tách 2 màn riêng theo `ba-conventions.md` Mục 8.
* Mỗi màn render HTML element thật (input, button, checkbox, link, label) — không dùng ASCII `<pre>`, chỉ B&W (grayscale).
* Mỗi screen có `id="s{n}"` để deep-link.
* Mỗi file có bảng mô tả 5 cột (# / Items / Control type / Data type / Description) ngay dưới phần wireframe.

## Links upstream‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* [[docs/authentication/srs/authentication-userflow.md|User Flow (nguồn chia flow)]]
* [[docs/authentication/ascii-wireframe/authentication-wireframe-index.md|Screens index (nguồn elements)]]‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
