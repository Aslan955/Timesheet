---
type: srs-flows
feature: premium-payment
updated: 2026-05-26
---

# Flows — Premium Payment‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Sequence diagram các luồng tích hợp PayGate + MailGate. Review từ file rendered (IDE/Obsidian/GitHub).

## Flow: Mua Premium 1 lần‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Trigger__: User bấm "Mua Premium" (gói 1 tháng).
__Related screens__: [[../ascii-wireframe/payment-result.md]]
__Related API__: PayGate `POST /v1/charges`, MailGate `POST /v1/messages`

```mermaid
sequenceDiagram
    actor User
    participant App as English App
    participant Pay as PayGate
    participant Mail as MailGate
    participant DB as App DB

    User->>App: Chọn gói + nhập thẻ
    App->>Pay: POST /v1/charges (amount, source, Idempotency-Key)
    alt Thẻ hợp lệ
        Pay-->>App: 201 status=succeeded
        App->>DB: Lưu Payment + plan=premium
        App->>Mail: POST /v1/messages (template=receipt)
        Mail-->>App: 201 status=delivered
        App-->>User: Màn kết quả "Đã kích hoạt Premium"
    else Thẻ lỗi
        Pay-->>App: 402 (card_declined / insufficient_funds / ...)
        App-->>User: Màn kết quả lỗi + hướng xử lý
    end
```

## Flow: Đăng ký thuê bao định kỳ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Trigger__: User chọn gói thuê bao (tháng/năm).
__Related API__: PayGate `POST /v1/customers`, `POST /v1/payment_methods`, `POST /v1/subscriptions`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```mermaid
sequenceDiagram
    actor User
    participant App as English App
    participant Pay as PayGate
    participant Mail as MailGate

    User->>App: Chọn gói định kỳ + nhập thẻ
    App->>Pay: POST /v1/customers (email)
    Pay-->>App: 201 customer
    App->>Pay: POST /v1/payment_methods (customer, card)
    Pay-->>App: 201 payment_method
    App->>Pay: POST /v1/subscriptions (customer, plan)
    Pay-->>App: 201 status=active, current_period_end
    App->>Mail: POST /v1/messages (template=welcome_premium)
    App-->>User: "Đã kích hoạt gói định kỳ, gia hạn ngày ..."
```

## Flow: Gia hạn thất bại → cảnh báo → hạ cấp (sự kiện bất đồng bộ)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Trigger__: PayGate thu định kỳ thất bại, sinh event `charge.failed`.
__Related API__: PayGate `GET /v1/events`, MailGate `POST /v1/messages`
__Related rules__: BR-premium-payment-002 (3 ngày), FR-premium-payment-009

```mermaid
sequenceDiagram
    participant Pay as PayGate
    participant App as English App
    participant Mail as MailGate
    participant DB as App DB

    Note over App,Pay: App polling sự kiện mỗi ~1 phút (NFR-005)
    App->>Pay: GET /v1/events?type=charge.failed
    Pay-->>App: event charge.failed (subscription)
    App->>DB: subscription.status = past_due
    App->>Mail: POST /v1/messages (template=payment_failed)
    Mail-->>App: 201 (kiểm tra status delivered/bounced)
    alt Thu lại OK trong 3 ngày
        App->>Pay: GET /v1/events?type=subscription.renewed
        Pay-->>App: event renewed
        App->>DB: status = active
    else Quá 3 ngày
        App->>DB: status = canceled, plan = free
        App->>Mail: POST /v1/messages (hạ cấp)
    end
```

## Flow: Hoàn tiền‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Trigger__: CSKH/User yêu cầu hoàn tiền 1 charge.
__Related API__: PayGate `POST /v1/refunds`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```mermaid
sequenceDiagram
    actor CSKH
    participant App as English App
    participant Pay as PayGate
    participant DB as App DB

    CSKH->>App: Yêu cầu hoàn tiền charge ch_x
    App->>Pay: POST /v1/refunds (charge=ch_x)
    alt Charge đang succeeded
        Pay-->>App: 201 refund succeeded
        App->>DB: Payment.status = refunded
        App-->>CSKH: "Đã hoàn tiền"
    else Charge không hợp lệ
        Pay-->>App: 400 charge_not_refundable / 404
        App-->>CSKH: Thông báo không hoàn được
    end
```


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
