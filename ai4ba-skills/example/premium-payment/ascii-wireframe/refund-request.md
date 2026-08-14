# Màn hình: Yêu cầu hoàn tiền‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Wireframe (ASCII)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
┌─────────────────────────────────────────────┐
│  ← Hoàn tiền giao dịch                         │
├─────────────────────────────────────────────┤
│  Giao dịch : ch_da12ebdb58a14009              │
│  Số tiền   : 99.000đ                           │
│  Ngày      : 26/05/2026                        │
│  Trạng thái: Đã kích hoạt                      │
│                                               │
│  Lý do hoàn: [ ____________________ ]          │
│                                               │
│           [   Xác nhận hoàn tiền   ]          │
│                                               │
│  ✓ Đã hoàn tiền. Premium sẽ bị thu hồi.        │
└─────────────────────────────────────────────┘
```

## 2. Screen description‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Thành phần | Mô tả & logic | Nguồn dữ liệu / API |
|---|---|---|---|‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 1 | Thông tin giao dịch | • Hiển thị charge cần hoàn (id, số tiền, ngày, trạng thái) | `GET /v1/charges/{id}` |
| 2 | Điều kiện hoàn | • Chỉ cho hoàn khi `status=succeeded` (BR-003)<br>• Charge `failed`/`refunded` → ẩn/khóa nút | `charge.status` |
| 3 | Nút Xác nhận | • Gọi `POST /v1/refunds {charge}`<br>• Thành công → cập nhật trạng thái "Đã hoàn tiền" | PayGate refunds |
| 4 | Thông báo lỗi | • `charge_not_refundable` (400) → "Giao dịch không thể hoàn"<br>• `resource_missing` (404) → "Không tìm thấy giao dịch" | error PayGate |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
