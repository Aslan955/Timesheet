---
type: srs-erd
feature: premium-payment
updated: 2026-05-26
---

# ERD — Premium Payment‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Data model nghiệp vụ. App lưu bản sao của dữ liệu PayGate/MailGate để hiển thị + đối soát.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```mermaid
erDiagram
    USER ||--o{ PAYMENT : "thực hiện"
    USER ||--o| SUBSCRIPTION : "có thể có"
    USER ||--o{ PAYMENT_METHOD : "lưu"
    CUSTOMER ||--o{ PAYMENT_METHOD : "sở hữu"
    USER ||--|| CUSTOMER : "ánh xạ"
    PAYMENT ||--o| REFUND : "có thể có"
    SUBSCRIPTION ||--o{ PAYMENT : "sinh ra theo kỳ"
    PAYMENT ||--o| EMAIL_MESSAGE : "kèm biên nhận"

    USER {
        string id PK
        string email
        string plan "free | premium"
        date premium_until
    }
    CUSTOMER {
        string id PK "map cus_ của PayGate"
        string user_id FK
        string email
    }
    PAYMENT_METHOD {
        string id PK "map pm_"
        string customer_id FK
        string brand
        string last4
        string exp
    }
    PAYMENT {
        string id PK "map ch_"
        string user_id FK
        string subscription_id FK "null nếu mua 1 lần"
        int amount "đồng VND"
        string status "pending|succeeded|failed|refunded"
        string failure_code "null nếu thành công"
        datetime created
    }
    SUBSCRIPTION {
        string id PK "map sub_"
        string user_id FK
        string plan "premium_monthly|premium_yearly"
        int amount
        string status "active|past_due|canceled"
        datetime current_period_end
    }
    REFUND {
        string id PK "map re_"
        string payment_id FK
        int amount
        string status
    }
    EMAIL_MESSAGE {
        string id PK "map msg_ của MailGate"
        string payment_id FK
        string template "receipt|payment_failed|welcome_premium"
        string status "queued|delivered|bounced|failed"
    }
```


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
