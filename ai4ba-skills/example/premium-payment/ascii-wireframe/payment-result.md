# Màn hình: Kết quả thanh toán‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Wireframe (ASCII)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
┌─────────────────────────────────────────────┐
│              Kết quả thanh toán               │
├─────────────────────────────────────────────┤
│                                               │
│                  ✓  (icon)                    │
│           Đã kích hoạt Premium!               │
│                                               │
│   Trạng thái   :  [ Đã kích hoạt ]            │
│   Số tiền      :  99.000đ                      │
│   Mã giao dịch :  ch_da12ebdb58a14009         │
│   Thời gian    :  26/05/2026 14:31            │
│                                               │
│        [   Bắt đầu học Premium   ]            │
│        [   Xem lịch sử giao dịch  ]           │
│                                               │
└─────────────────────────────────────────────┘

  (state lỗi — thẻ bị từ chối)
┌─────────────────────────────────────────────┐
│              Kết quả thanh toán               │
├─────────────────────────────────────────────┤
│                  ✕  (icon)                    │
│             Thanh toán thất bại               │
│   Thẻ của bạn bị từ chối bởi ngân hàng.       │
│                                               │
│        [     Thử thẻ khác     ]               │
│        [        Quay lại        ]             │
└─────────────────────────────────────────────┘
```

## 2. Screen description‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Thành phần | Mô tả & logic | Nguồn dữ liệu / API |
|---|---|---|---|
| 1 | Badge trạng thái | • Hiển thị nhãn theo `charge.status`<br>• `succeeded`→**"Đã kích hoạt"** (xanh)<br>• `failed`/`card_declined`→**"Thất bại"** (đỏ)<br>• `pending`→"Đang xử lý" | `charge.status` (PayGate) |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| 2 | Số tiền | • Định dạng nghìn + "đ"<br>• vd `99000`→**"99.000đ"**<br>• KHÔNG chia 100 (VND không có đơn vị lẻ) | `charge.amount` |
| 3 | Mã giao dịch | • Hiển thị nguyên `charge.id`<br>• Dùng để tra cứu / hỗ trợ | `charge.id` |
| 4 | Thời gian | • Đổi unix timestamp sang giờ địa phương | `charge.created` |
| 5 | Nút hành động (state thành công) | • **"Bắt đầu học Premium"** → vào bài học<br>• "Xem lịch sử giao dịch" | — |
| 6 | Khối lỗi (state thất bại) | • Hiện khi `402 card_declined`<br>• Thông báo "Thẻ bị từ chối" + nút **"Thử thẻ khác"** | `error.code` (PayGate) |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
