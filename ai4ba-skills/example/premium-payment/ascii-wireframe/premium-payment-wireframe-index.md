---
type: screen-index
feature: premium-payment
status: draft
updated: 2026-07-20
links: [docs/premium-payment/integration/api-map.md, docs/premium-payment/srs/premium-payment-spec.md]
---

# Premium Payment — Screens Index‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Screens‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Screen | Status | Used by (flow) | Figma | HTML | Updated |
|---|---|---|---|---|---|---|
| 1 | [plan-selection](plan-selection.md) | draft | Mua 1 lần / Thuê bao | — | [Prototype](../html-design/premium-payment-prototype.html#plan-selection) | 2026-07-20 |
| 2 | [payment-method](payment-method.md) | draft | Mua / Lưu thẻ | — | [Prototype](../html-design/premium-payment-prototype.html#payment-method) | 2026-07-20 |
| 3 | [payment-result](payment-result.md) | draft | Mua Premium 1 lần | — | [Prototype](../html-design/premium-payment-prototype.html#payment-result) | 2026-07-20 |
| 4 | [subscription-manage](subscription-manage.md) | draft | Quản lý/hủy thuê bao | — | [Prototype](../html-design/premium-payment-prototype.html#subscription-manage) | 2026-07-20 |
| 5 | [transaction-history](transaction-history.md) | draft | Lịch sử giao dịch | — | [Prototype](../html-design/premium-payment-prototype.html#transaction-history) | 2026-07-20 |
| 6 | [refund-request](refund-request.md) | draft | Hoàn tiền | — | [Prototype](../html-design/premium-payment-prototype.html#refund-request) | 2026-07-20 |

## Descriptions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### plan-selection‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
Màn chọn gói: one-time / thuê bao tháng / thuê bao năm, kèm giá. Điểm vào của mọi luồng thanh toán.

### payment-method‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
Màn nhập thẻ mới hoặc chọn thẻ đã lưu. Có ô nhập số thẻ/hết hạn/CVC; hiển thị lỗi `expired_card`/`incorrect_cvc`.

### payment-result
Kết quả thanh toán: state thành công (kích hoạt Premium + biên nhận) và state lỗi (theo từng mã lỗi thẻ). Mọi field truy về api-map.

### subscription-manage
Quản lý thuê bao: tên gói, trạng thái, ngày gia hạn, nút hủy. Dữ liệu từ `subscription`.

### transaction-history
Danh sách giao dịch (list charges, phân trang), mỗi dòng trạng thái + số tiền + ngày; bấm vào xem chi tiết / tra trạng thái.

### refund-request
Màn (CSKH/user) yêu cầu hoàn tiền 1 giao dịch đang `succeeded`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
