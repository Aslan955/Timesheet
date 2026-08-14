---
type: srs-states
feature: premium-payment
updated: 2026-05-26
---

# States — Premium Payment‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## State: Subscription‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```mermaid
stateDiagram-v2
    [*] --> active: tạo thành công (charge đầu OK)
    active --> active: gia hạn OK (event subscription.renewed)
    active --> past_due: gia hạn thất bại (charge.failed)
    past_due --> active: thu lại thành công trong 3 ngày
    past_due --> canceled: quá 3 ngày chưa thu được (hạ cấp Free)
    active --> canceled: user hủy gói (/cancel)
    canceled --> [*]
```

## State: Payment (charge)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```mermaid
stateDiagram-v2
    [*] --> pending: gửi POST /v1/charges
    pending --> succeeded: thẻ hợp lệ
    pending --> failed: thẻ lỗi (declined/insufficient/expired/cvc)
    succeeded --> refunded: hoàn tiền (POST /v1/refunds)
    failed --> [*]
    refunded --> [*]
    succeeded --> [*]
```


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
