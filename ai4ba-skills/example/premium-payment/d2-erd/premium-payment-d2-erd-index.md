---
type: d2-erd-index
feature: premium-payment
status: draft
updated: 2026-07-08
links:
  - docs/premium-payment/srs/premium-payment-spec.md
  - docs/premium-payment/srs/premium-payment-erd.md
---

# premium-payment — D2 ERD‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> ERD đẹp standalone (D2 `sql_table` + layout ELK). Mở `.svg` bằng browser/IDE/Obsidian. Nguồn: `srs/premium-payment-erd.md`. Render qua `.claude/skills/d2-activity/render.sh`. Lifecycle inherit từ `srs/premium-payment-spec.md`.

## Entities‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Entity | Cột | PK | FK ra |
|--------|-----|----|----|
| `USER` | 4 | id | — |
| `CUSTOMER` | 3 | id | user_id → USER |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| `PAYMENT_METHOD` | 5 | id | customer_id → CUSTOMER |
| `PAYMENT` | 7 | id | user_id → USER, subscription_id → SUBSCRIPTION |
| `SUBSCRIPTION` | 6 | id | user_id → USER |
| `REFUND` | 4 | id | payment_id → PAYMENT |
| `EMAIL_MESSAGE` | 4 | id | payment_id → PAYMENT |

__File:__ `premium-payment.d2` (source) + `premium-payment.svg` (render). 8 quan hệ.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
