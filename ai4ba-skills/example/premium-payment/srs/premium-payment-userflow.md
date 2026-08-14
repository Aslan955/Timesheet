---
type: srs-userflow
feature: premium-payment
updated: 2026-07-19
stage: flow-approved
primary_device: desktop
---

# premium-payment — User Flow‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Nguồn chia flow DUY NHẤT cho feature này. `/wireframe-ascii` và `/wireframe-html` đọc file này để biết flow nào gồm những màn nào — KHÔNG tự chia flow riêng.
>
> Derived từ `srs/premium-payment-spec.md` (FR/Error Matrix), `usecases/premium-payment-usecase-index.md` (4 UC), `integration/api-design.md` (orchestration PayGate + MailGate). Phủ happy / error / edge. Device chính: __desktop 1024__ (responsive webapp).

## 1. User Flow (tổng)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> `[n]` = số màn hình đối chiếu Mục 2. Xanh = happy, đỏ = error, vàng = edge.

```mermaid
flowchart TD
    n0["Bắt đầu:<br/>người học muốn nâng cấp Premium"]
    n1["[1] Chọn gói<br/>(1 lần / thuê bao tháng / năm)"]
    n2["[2] Phương thức thanh toán<br/>(nhập thẻ / chọn thẻ đã lưu)"]
    dpay{"Cổng PayGate<br/>xử lý thẻ?"}
    n3s["[3] Kết quả: thành công<br/>— kích hoạt Premium + biên nhận"]
    n3e["[3] Kết quả: lỗi<br/>— theo mã lỗi thẻ"]
    e1["Thẻ bị từ chối (E-001)<br/>Thử thẻ khác"]
    e2["Số dư không đủ (E-002)<br/>Dùng thẻ khác"]
    e3["Thẻ hết hạn (E-003)<br/>Sửa thẻ"]
    e4["Sai CVC (E-004)<br/>Nhập lại"]
    e5["Lỗi tạm cổng (E-005)<br/>Hệ thống bận, thử lại"]
    dsub{"Gói là<br/>thuê bao?"}
    n4["[4] Quản lý thuê bao<br/>(tên gói, ngày gia hạn, hủy)"]
    dcancel{"Xác nhận<br/>hủy thuê bao?"}
    n4c["Thuê bao đã hủy<br/>(dùng hết kỳ đã trả)"]
    n5["[5] Lịch sử giao dịch<br/>(danh sách charges)"]
    n6["[6] Yêu cầu hoàn tiền<br/>(CSKH, giao dịch succeeded)"]
    drefund{"Giao dịch đủ<br/>điều kiện hoàn?"}
    n6ok["Hoàn tiền thành công<br/>(gọi PayGate refund)"]
    e6["Không đủ điều kiện hoàn<br/>(đã quá hạn/đã hoàn)"]
    ew["Webhook PayGate trễ/mất<br/>→ đối soát lại (reconciliation)"]

    n0 --> n1
    n1 --> n2
    n2 --> dpay
    dpay -->|"thành công"| n3s
    dpay -->|"thất bại"| n3e
    n3e --> e1
    n3e --> e2
    n3e --> e3
    n3e --> e4
    n3e --> e5
    e1 -.thử lại.-> n2
    e3 -.sửa thẻ.-> n2
    e4 -.nhập lại.-> n2
    n3s --> dsub
    dsub -->|"có"| n4
    dsub -->|"không, mua 1 lần"| n5
    n4 --> dcancel
    dcancel -->|"có"| n4c
    n1 --> n5
    n5 --> n6
    n6 --> drefund
    drefund -->|"đủ"| n6ok
    drefund -->|"không"| e6
    dpay -.webhook async.-> ew

    classDef happy fill:#d5f5e3,stroke:#1e8449;
    classDef error fill:#fadbd8,stroke:#c0392b;
    classDef edge fill:#fdebd0,stroke:#d68910;
    class n0,n1,n2,n3s,n4,n5,n6,n6ok happy;
    class n3e,e1,e2,e3,e4,e5,e6 error;
    class n4c,ew edge;
```

## 2. Danh sách màn hình‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| [#] | Màn hình | Mục đích | Thuộc flow |
|-----|----------|----------|------------|
| 1 | plan-selection | Chọn gói one-time / thuê bao tháng / năm kèm giá; điểm vào mọi luồng thanh toán | buy-onetime, subscribe |
| 2 | payment-method | Nhập thẻ mới hoặc chọn thẻ đã lưu; lỗi thẻ E-003/E-004 | buy-onetime, subscribe |
| 3 | payment-result | Kết quả thanh toán: thành công (kích hoạt Premium + biên nhận) / lỗi (theo mã lỗi thẻ E-001..005) | buy-onetime |
| 4 | subscription-manage | Quản lý thuê bao: tên gói, trạng thái, ngày gia hạn, nút hủy | subscribe, manage-subscription |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 5 | transaction-history | Danh sách giao dịch (list charges, phân trang); bấm xem chi tiết / tra trạng thái | manage-subscription, refund |
| 6 | refund-request | CSKH yêu cầu hoàn tiền 1 giao dịch đang succeeded | refund |

## 3. Chia flow‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Flow-slug | Tên flow | Màn hình gồm | Cases phủ |
|-----------|----------|--------------|-----------|
| buy-onetime | Mua Premium 1 lần | plan-selection → payment-method → payment-result | happy (thanh toán thành công, kích hoạt Premium FR-002/004/005), error (thẻ từ chối E-001, số dư E-002, hết hạn E-003, sai CVC E-004, lỗi cổng E-005), edge (webhook PayGate trễ → đối soát reconciliation) |
| subscribe | Đăng ký thuê bao | plan-selection → payment-method → subscription-manage | happy (tạo thuê bao thành công FR-007), error (thẻ lỗi như buy-onetime), edge (gia hạn tự động kỳ sau, thẻ hết hạn trước kỳ gia hạn) |
| manage-subscription | Quản lý / hủy thuê bao | subscription-manage → transaction-history | happy (xem trạng thái + hủy thuê bao FR-011), edge (hủy giữa kỳ → dùng hết kỳ đã trả, không hoàn phần còn lại) |
| refund | Hoàn tiền | transaction-history → refund-request | happy (CSKH hoàn tiền giao dịch succeeded FR-012), error (giao dịch không đủ điều kiện — đã quá hạn/đã hoàn E-006/009), edge (hoàn 1 phần vs toàn phần theo policy) |

## 4. Open Questions‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* [ ] OQ-1 (kế thừa `spec.md`): chính sách hoàn tiền 1 phần (prorated) khi hủy thuê bao giữa kỳ — hiện mặc định "dùng hết kỳ đã trả, không hoàn phần còn lại", cần xác nhận với business.
* [ ] OQ-2: thời hạn cho phép yêu cầu hoàn tiền tính từ ngày giao dịch (vd 14/30 ngày) — ảnh hưởng điều kiện ở màn refund-request.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
