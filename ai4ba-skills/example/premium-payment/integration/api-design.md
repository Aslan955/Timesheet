---
type: api-design
feature: premium-payment
status: draft
updated: 2026-07-15
links: [docs/premium-payment/srs/premium-payment-spec.md, docs/premium-payment/integration/api-summary-paygate.md, docs/premium-payment/integration/api-summary-mailgate.md, docs/premium-payment/integration/api-map.md]
---

# Integration Blueprint — Premium Payment‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Mục 1 — Phạm vi hệ thống và ownership‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Hệ thống | Ownership nghiệp vụ |
|---|---|
| App | Nhận thao tác người dùng, lưu bản sao `Payment`, `Subscription`, `EmailMessage` để hiển thị và đối soát; kích hoạt/hạ Premium theo trạng thái PayGate đã xác nhận. |
| PayGate | Nguồn sự thật cho trạng thái charge, subscription và refund. |
| MailGate | Nhận yêu cầu gửi email và cung cấp trạng thái giao email. |
| Người dùng | Chọn gói, cung cấp/chọn phương thức thanh toán, đăng ký/hủy thuê bao và yêu cầu hoàn tiền. |

App không tự coi thanh toán thành công chỉ vì đã gửi yêu cầu sang PayGate. Premium chỉ được kích hoạt khi PayGate xác nhận charge `succeeded` theo BR-premium-payment-001.

## Mục 2 — Giao dịch nghiệp vụ và trigger/actor theo từng flow‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Flow | Trigger / actor | Điều kiện hoàn tất nghiệp vụ |
|---|---|---|
| Mua Premium một lần | Người dùng chọn gói và thanh toán | Charge được PayGate xác nhận `succeeded`; app kích hoạt Premium và gửi biên nhận. |
| Đăng ký / gia hạn thuê bao | Người dùng đăng ký thuê bao; PayGate phát sinh trạng thái gia hạn | Subscription được PayGate xác nhận `active`; các charge gia hạn được đối soát qua event polling. |
| Xử lý thanh toán thuê bao thất bại | PayGate ghi nhận `charge.failed` liên quan thuê bao | App gửi email `payment_failed`; nếu thất bại liên tục 3 ngày thì hạ về Free. |
| Hoàn tiền | Người dùng hoặc vận hành yêu cầu hoàn | Chỉ gửi yêu cầu hoàn cho charge đang `succeeded`; trạng thái charge/refund được PayGate xác nhận. |
| Gửi và đối soát email | Charge thành công hoặc thanh toán thuê bao thất bại | MailGate xác nhận trạng thái giao; `201 Created` chỉ xác nhận nhận yêu cầu gửi, không xác nhận đã giao. |

## Mục 3 — Cách phối hợp‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Chiều phối hợp | Hình thức | Mục đích |
|---|---|---|
| App → PayGate | Đồng bộ: tạo charge, tạo/hủy subscription, tạo refund, tra charge | Khởi tạo hoặc tra cứu giao dịch. |
| PayGate → App | Bất đồng bộ qua polling `GET /v1/events` | Cập nhật charge/subscription, bù trạng thái khi app chưa kịp ghi nhận. PayGate **không có webhook callback thật**. |
| App → MailGate | Đồng bộ: `POST /v1/messages` | Yêu cầu gửi `receipt` sau charge thành công hoặc `payment_failed` khi thuê bao thất bại. |
| App → MailGate | Bất đồng bộ qua polling `GET /v1/messages/{id}` | Đối soát trạng thái giao `delivered`, `bounced`, hoặc `failed`. |

App poll PayGate tối đa mỗi 1 phút và lưu con trỏ event cuối đã xử lý để không bỏ sót event. Không thiết kế HMAC hoặc webhook inbound giả cho PayGate.

## Mục 4 — Happy flow và exception flow‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### 4.1 Mua Premium một lần

1) Người dùng chọn gói và cung cấp thẻ mới hoặc `payment_method` đã lưu.
2) App tạo charge tại PayGate.
3) Nếu charge `succeeded`, app cập nhật Payment, kích hoạt Premium và yêu cầu MailGate gửi template `receipt`.
4) App poll trạng thái gửi của `msg_...`; chỉ ghi nhận email đã giao khi MailGate trả `delivered`.

| Ngoại lệ | Xử lý nghiệp vụ |
|---|---|
| `card_declined`, `insufficient_funds`, `expired_card`, `incorrect_cvc` | Không kích hoạt Premium; hiển thị đúng loại lỗi và cho phép người dùng sửa/thử thẻ khác. |
| PayGate `processing_error` hoặc phản hồi chưa rõ | Hiển thị trạng thái đang xử lý hoặc hướng dẫn thử lại; không thông báo thành công khi chưa có `succeeded`. |
| PayGate `429 rate_limited` | Retry theo backoff; không báo lỗi cứng ngay cho người dùng. |
| Charge đã `succeeded` nhưng app chưa kịp kích hoạt Premium | Event polling phát hiện trạng thái chính thức, cập nhật Payment và kích hoạt Premium như hành động bù. |
| MailGate trả `201` nhưng sau đó `bounced` | Thanh toán vẫn hợp lệ; hiển thị biên nhận trong app làm fallback. |

### 4.2 Đăng ký và gia hạn thuê bao

1) Người dùng chọn `premium_monthly` hoặc `premium_yearly`.
2) App tạo subscription tại PayGate.
3) App lưu bản sao Subscription để hiển thị kỳ gia hạn và quản lý hủy.
4) App poll events để đồng bộ trạng thái subscription và charge phát sinh trong kỳ.

| Ngoại lệ | Xử lý nghiệp vụ |
|---|---|
| Subscription/charge chưa được PayGate xác nhận | Giữ trạng thái chờ; không tự kết luận Premium đã được kích hoạt. |
| Charge gia hạn `failed` | Gửi email `payment_failed`; tiếp tục đối soát theo events. |
| Charge thuê bao thất bại liên tục 3 ngày | Hạ quyền người dùng về Free theo BR-premium-payment-002. |
| User hủy thuê bao | App gửi yêu cầu hủy; chỉ hiển thị `canceled` khi PayGate xác nhận. |
| Event đến muộn hoặc app bỏ lỡ lúc tạm gián đoạn | Polling từ con trỏ event đã lưu để bù dữ liệu; PayGate là phán quyết cuối. |

### 4.3 Hoàn tiền

1) App kiểm tra Payment nội bộ và trạng thái charge từ PayGate.
2) Chỉ charge `succeeded` mới đủ điều kiện gửi yêu cầu refund.
3) App cập nhật bản sao Refund/Payment theo xác nhận PayGate và đối soát lại qua events.

| Ngoại lệ | Xử lý nghiệp vụ |
|---|---|
| Charge `failed` hoặc đã `refunded` | Không cho hoàn tiền theo BR-premium-payment-003. |
| Không tìm thấy charge | Báo không tìm thấy giao dịch; không tạo refund nội bộ. |
| Phản hồi refund chưa rõ | Giữ trạng thái chờ đối soát; không kết luận đã hoàn tiền trước khi PayGate xác nhận. |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Mục 5 — State mapping và source of truth

| Đối tượng | PayGate | App nội bộ | Ý nghĩa cho người dùng | Source of truth / cách xử lý lệch |
|---|---|---|---|---|
| Payment | `pending` | `pending` | Đang xử lý thanh toán | PayGate; không kích hoạt Premium. |
| Payment | `succeeded` | `succeeded` | Thanh toán thành công | PayGate; app kích hoạt Premium và gửi biên nhận. |
| Payment | `failed` | `failed` | Thanh toán không thành công | PayGate; hiển thị lỗi phù hợp, không cấp Premium. |
| Payment | `refunded` | `refunded` | Đã hoàn tiền | PayGate; app hiển thị trạng thái hoàn tiền. |
| Subscription | `active` | `active` | Thuê bao đang hoạt động | PayGate; app duy trì quyền Premium theo charge đã xác nhận. |
| Subscription | `past_due` | `past_due` | Thanh toán thuê bao có vấn đề | PayGate; gửi thông báo thất bại và theo dõi mốc 3 ngày. |
| Subscription | `canceled` | `canceled` | Thuê bao đã hủy | PayGate; app cập nhật quản lý thuê bao. |
| EmailMessage | `queued` / `delivered` / `bounced` / `failed` | Bản sao trạng thái email | Biên nhận đã giao hoặc cần fallback | MailGate là nguồn trạng thái giao; không ảnh hưởng kết quả thanh toán. |

Khi bản sao app khác PayGate về charge hoặc subscription, kết quả từ PayGate events là phán quyết cuối. App tự điều chỉnh bản sao và quyền Premium tương ứng; các chênh lệch không thể khôi phục tự động cần được đưa vào recovery vận hành.

## Mục 6 — Timeout, retry và idempotency nghiệp vụ

- Mọi lần tạo charge phải dùng `Idempotency-Key` để bảo đảm thao tác lại hoặc retry không thu tiền hai lần.
- Với `429 rate_limited`, app retry theo backoff theo NFR-premium-payment-002. Với `500 processing_error`, app auto retry theo hành vi Error Matrix E-premium-payment-005 (không cùng nguồn ràng buộc với 429; NFR-002 chỉ quy định cho 429). Cả hai đều không trả kết quả thất bại cuối cùng cho người dùng ngay khi vẫn còn khả năng đối soát.
- Nếu phản hồi tạo charge bị timeout hoặc không rõ, app coi giao dịch là đang xử lý và tra cứu/đối soát PayGate trước khi cho phép kết luận hoặc tạo giao dịch mới.
- Không kích hoạt Premium, không xác nhận refund và không xác nhận hủy thuê bao chỉ dựa vào yêu cầu đã gửi; cần trạng thái được PayGate xác nhận.
- Khóa PayGate và MailGate chỉ lưu ở secret store phía server, không nhúng client và không ghi vào log.

## Mục 7 — Event trùng, sai thứ tự, webhook-miss và reconciliation

PayGate không có webhook thật, vì vậy “webhook-miss” không áp dụng. Rủi ro tương đương là app bỏ lỡ hoặc xử lý chậm event polling.

- App lưu con trỏ event PayGate cuối đã xử lý và poll `GET /v1/events` tối đa mỗi 1 phút.
- Event trùng, đến muộn hoặc sai thứ tự không được dùng để đảo ngược một trạng thái đã được PayGate xác nhận mới hơn; app đối chiếu trạng thái charge/subscription chính thức của PayGate.
- Charge `succeeded` nhưng Payment/Premium chưa được app cập nhật là partial success; polling phải bù cập nhật Payment, quyền Premium và yêu cầu email biên nhận.
- Đối soát email dùng `GET /v1/messages/{id}`. `POST /v1/messages` trả `201` không đồng nghĩa email đã giao.
- Khi email `bounced`, app hiển thị biên nhận trong app theo E-premium-payment-008; việc gửi lại email là câu hỏi mở.
- Khi có khác biệt giữa bản sao app và PayGate, PayGate quyết định trạng thái charge/subscription; MailGate quyết định trạng thái giao email.

## Mục 8 — Manual recovery, operational handoff và degraded UX

| Tình huống | Trải nghiệm người dùng | Handoff / recovery |
|---|---|---|
| PayGate chậm, timeout hoặc 429 | Hiển thị “đang xử lý”; không báo Premium thành công trước `succeeded`. | Đối soát bằng charge/event PayGate trước khi hỗ trợ người dùng thanh toán lại. |
| Sai khóa đối tác `401 unauthorized` | Không hiển thị lỗi cấu hình cho người dùng. | Cảnh báo đội vận hành; kiểm tra secret store và khóa theo từng đối tác. |
| Charge thành công nhưng chưa cấp Premium | Người dùng có thể chưa thấy Premium tạm thời. | Poll events để bù; nếu vẫn lệch, vận hành đối chiếu charge ID và Payment nội bộ. |
| Email bounced | Người dùng vẫn có thể xem biên nhận trong app. | Lưu trạng thái `bounced`; xử lý gửi lại/chỉnh email theo quyết định còn mở. |
| Thuê bao past due / failed | Thông báo thanh toán thất bại; không hứa duy trì quyền quá điều kiện nghiệp vụ. | Theo dõi chuỗi 3 ngày thất bại để hạ Free. |

Thông tin bàn giao tối thiểu cho recovery: user, charge/subscription/refund/message ID, trạng thái nội bộ hiện tại, trạng thái đối tác đã tra, thời điểm và con trỏ event liên quan.

## Mục 9 — SLA/SLO kỳ vọng

| Mục tiêu | Kỳ vọng nghiệp vụ |
|---|---|
| Phản hồi thanh toán | P95 dưới 3 giây theo NFR-premium-payment-001. |
| Đồng bộ event PayGate | Poll tối đa mỗi 1 phút, có lưu con trỏ event để tránh bỏ sót. |
| Khi đối tác giới hạn tải | Retry/backoff cho `429`; ưu tiên trạng thái đang xử lý hơn là kết luận sai. |
| Tính đúng đắn tiền và quyền lợi | Không thu tiền hai lần; không cấp Premium khi charge chưa `succeeded`. |
| Giao email | Theo dõi đến trạng thái MailGate; không coi `201` là đã giao. |

Chưa có cam kết SLA/uptime riêng của PayGate hoặc MailGate trong nguồn hiện có.

## Mục 10 — Liên kết `/api-map` và artifact sơ đồ

- Mapping trường và định danh liên hệ giữa App, PayGate, MailGate: [[docs/premium-payment/integration/api-map.md|API map]].
- Cần chốt state diagram cho các thực thể:
  - `/state Payment --feature premium-payment`
  - `/state Subscription --feature premium-payment`
- Cần minh họa sequence cho giao dịch chính, bao gồm nhánh app bỏ lỡ event và polling bù:
  - `/sequence "Mua Premium: tạo charge, charge succeeded, kích hoạt Premium và poll-event-miss recovery" --feature premium-payment`
- Có thể bổ sung sequence riêng cho gia hạn thuê bao thất bại và hạ Free sau 3 ngày.

## Mục 11 — Assumptions và câu hỏi mở

| ID | Câu hỏi mở | Tác động cần chốt |
|---|---|---|
| OQ-1 | Polling interval nào trong giới hạn tối đa 1 phút là đủ để không trễ gia hạn? | Độ trễ cập nhật Payment, Subscription và quyền Premium. |
| OQ-2 | Cơ chế và lịch xoay khóa PayGate/MailGate là gì? | Recovery khi khóa lỗi, vận hành secret store và tránh gián đoạn tích hợp. |
| OQ-3 | Khi MailGate báo `bounced`, có retry gửi lại hay thông báo người dùng cập nhật email không? | Cách hoàn tất fallback ngoài biên nhận trong app. |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
