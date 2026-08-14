# Màn hình: Quản lý thuê bao‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Wireframe (ASCII)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
┌─────────────────────────────────────────────┐
│  Gói của tôi                                  │
├─────────────────────────────────────────────┤
│  Gói tháng — 99.000đ/tháng                    │
│  Trạng thái : [ Đang hoạt động ]              │
│  Gia hạn vào: 25/06/2026                       │
│  Thẻ        : Visa •••• 4242                   │
│                                               │
│  [ Xem lịch sử giao dịch ]                    │
│  [ Hủy gói ]                                   │
│                                               │
│  ⚠ (nếu past_due) Thanh toán kỳ này thất bại. │
│     Cập nhật thẻ trước 28/06 để giữ Premium.  │
└─────────────────────────────────────────────┘
```

## 2. Screen description‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Thành phần | Mô tả & logic | Nguồn dữ liệu / API |
|---|---|---|---|
| 1 | Tên gói + giá | • Dịch `plan` sang tên tiếng Việt + giá | `subscription.plan` |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 2 | Trạng thái | • active→"Đang hoạt động"; past_due→"Cần thanh toán"; canceled→"Đã hủy" | `subscription.status` |
| 3 | Gia hạn vào | • Ngày từ `current_period_end` (unix→ngày) | `subscription.current_period_end` |
| 4 | Cảnh báo past_due | • Hiện khi `status=past_due`<br>• Nhắc cập nhật thẻ trước hạn hạ cấp (3 ngày — BR-002) | event `charge.failed` |
| 5 | Nút Hủy gói | • Gọi `POST /v1/subscriptions/{id}/cancel`<br>• Xác nhận trước khi hủy | PayGate subscriptions |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
