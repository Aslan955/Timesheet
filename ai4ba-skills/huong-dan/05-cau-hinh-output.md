# 05 — Cấu hình output: file ra ở đâu, đặt tên thế nào‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Bộ này mặc định ghi tài liệu vào `docs/{feature}/...`. Công ty các bạn gần như chắc chắn có cấu trúc khác.
>
> Đổi được — nhưng đây là **thay đổi lan rộng nhất trong cả bộ**, nên có prompt riêng cho nó.

---

## Vì sao phần này cần làm sớm‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nghe thì chỉ là "đổi đường dẫn". Nhưng **55/57 skill** có nhắc tới `docs/`, và 17 rule định nghĩa đường dẫn.

Đổi chỗ ghi file không phải sửa một dòng — nó là sửa một **hợp đồng** mà mọi skill cùng tuân theo. Sửa nửa vời thì skill A ghi vào chỗ mới, skill B vẫn tìm ở chỗ cũ, và **báo "không có tài liệu" dù file đang nằm ngay đó**.

> **Chốt cấu trúc TRƯỚC khi chạy skill lần đầu.** Đổi sau khi đã có 50 file thì phải di chuyển cả file lẫn liên kết bên trong chúng.

---

## Bộ này đang ghi ra đâu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
docs/
├── _product/          ← cấp SẢN PHẨM (PRD tổng, lộ trình)
├── _shared/           ← DÙNG CHUNG (thuật ngữ, quy ước, nhật ký)
├── {feature}/         ← phần lớn tài liệu nằm ở đây
│   ├── {feature}-urd.md · {feature}-brd.md · {feature}-prd.md
│   ├── srs/           đặc tả + sơ đồ
│   └── usecases/ · ascii-wireframe/ · userstories/ · test/
├── meetings/          ← theo ngày
└── cr/                ← yêu cầu thay đổi
```

Hai quy ước đáng biết:

**File tên cố định mang tiền tố `{feature}-`** — ví dụ `payment-spec.md` chứ không phải `spec.md`. Nếu mọi feature đều có file tên `spec.md`, mở nhiều tab trong editor sẽ thấy một danh sách không phân biệt được.

**File có tên riêng thì không cần tiền tố** — `uc-dat-hang.md`, `us-001.md` tự phân biệt rồi.

---

## Prompt đổi cấu trúc — dán vào là xong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điền phần trong ngoặc vuông, dòng nào không muốn đổi thì ghi "giữ nguyên":

```text
Tôi muốn đổi cấu trúc thư mục tài liệu của bộ skill này.

Hiện tại: docs/{feature}/
Tôi muốn:
- Thư mục gốc:   [vd product-docs/]
- Phân cấp:      [vd {module}/{feature}/ — hoặc giữ nguyên {feature}/]
- Tên file:      [vd SRS_{Feature}.md — hoặc giữ nguyên]
- Mã ID:         [vd REQ-{DA}-001 — hoặc giữ nguyên]
- Dùng chung:    [vd product-docs/_common/]

Hãy tìm mọi chỗ liên quan tới đường dẫn tài liệu trong .claude/ và _templates/
rồi điều chỉnh. Nhớ ba loại:
1. Đường dẫn skill GHI file ra
2. Lệnh skill dùng để DÒ xem dự án đang có gì (mục "Context (dynamic)")
3. Rule định nghĩa quy ước đặt tên

Trước khi sửa cho tôi biết:
- Có bao nhiêu file phải đụng
- Quy ước mới có làm trùng tên file giữa các feature không
- Cấu trúc mới sâu/nông hơn cũ thì lệnh dò có cần đổi số tầng không

SAU KHI SỬA, bắt buộc làm 2 việc:
- Chạy thử TỪNG lệnh dò và cho tôi xem kết quả thật. Lệnh nào trả rỗng thì
  giải thích: rỗng vì dự án chưa có file đó, hay rỗng vì đường dẫn còn sai?
- Cập nhật CLAUDE.md mô tả cấu trúc mới.

Show diff trước mỗi lần ghi.
```

---

## Điểm mấu chốt: lệnh dò trả rỗng chứ không báo lỗi‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là lý do prompt trên có đoạn "bắt buộc làm 2 việc".

Mỗi skill có một mục chạy lệnh thật lúc khởi động, để biết dự án **hiện đang có gì** — bộ này có khoảng **170 lệnh như vậy** trên 51 skill.

Khi đường dẫn sai, lệnh **không báo lỗi**. Nó trả về rỗng. Và skill hiểu rỗng nghĩa là *"dự án chưa có feature nào"*.

Hậu quả, xếp theo mức nguy hiểm:

- Gõ lệnh không kèm tham số → skill nói "chưa có feature nào" dù các bạn có 12 feature
- Skill tưởng đang tạo mới → **ghi đè** thay vì hiện diff
- Skill bỏ qua tài liệu đầu nguồn → viết nội dung không khớp thứ đã chốt

Cái cuối tệ nhất vì **output trông vẫn bình thường**.

Nếu AI báo "đã sửa xong" mà không chạy thử, hỏi lại:

```
Chạy thử các lệnh dò trong những skill vừa sửa, cho tôi xem kết quả thật.
Cái nào trả rỗng thì giải thích vì sao.
```

---

## Kiểm sau khi đổi

Chạy thử một feature nháp, rồi kiểm bốn thứ:‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Kiểm | Đạt khi |
|---|---|
| **File ra đúng chỗ** | Nằm ở cấu trúc mới, không phải `docs/` cũ |
| **Skill thấy được feature đã có** | Gõ lệnh không kèm tham số → skill liệt kê được feature hiện có. Danh sách rỗng dù đã có tài liệu = lệnh dò còn sai |
| **Skill sau đọc được skill trước** | Chạy `/srs` rồi `/userstory` — skill sau phải tìm thấy file skill trước vừa ghi |
| **Liên kết trong tài liệu không gãy** | Mở file vừa sinh, kiểm các liên kết trỏ tới tài liệu khác |

Cái thứ hai hay hỏng nhất và **khó phát hiện nhất** — skill không báo lỗi, nó chỉ tưởng dự án chưa có gì.

---

## Về mã ID — cân nhắc trước khi đổi

Bộ này đánh mã kiểu `FR-payment-001`, `E-payment-001`, `US-001`.

Tiền tố tên feature ở giữa có lý do: khi gom nhiều feature lại đối chiếu, `FR-001` của hai feature sẽ đụng nhau, còn `FR-payment-001` và `FR-refund-001` thì không.

**Nếu đã có tài liệu chạy rồi, cân nhắc giữ nguyên.** Mã ID nằm trong **nội dung** tài liệu chứ không chỉ ở tên file — đổi quy ước sẽ làm gãy liên kết giữa chúng. Đây là thứ ít ảnh hưởng tới người đọc nhất mà lại tốn công đổi nhất.

---

## Ba lỗi hay gặp

| Lỗi | Hậu quả |
|---|---|
| Sửa đường dẫn ghi file nhưng **quên lệnh dò** | Skill ghi đúng chỗ nhưng không thấy tài liệu đã có → tưởng dự án trống |
| Đổi cấu trúc **sau khi** đã có nhiều tài liệu | Phải di chuyển cả file lẫn liên kết bên trong; dễ sót |
| Bỏ tiền tố `{feature}-` cho gọn | Nhiều file trùng tên giữa các feature, tìm kiếm và mở tab đều khó |

---

## Tóm tắt

- **55/57 skill** nhắc tới đường dẫn tài liệu — đổi chỗ ghi file là sửa một **hợp đồng chung**.
- **Chốt cấu trúc trước khi chạy skill lần đầu.** Đổi sau tốn hơn nhiều.
- Một prompt làm hết — nhưng phải có đoạn **bắt AI chạy thử lệnh dò** và phân biệt "rỗng đúng" với "rỗng vì sai".
- Chỗ hay hỏng nhất: **lệnh dò trả rỗng chứ không báo lỗi**, skill hiểu nhầm là dự án chưa có gì.
- **Mã ID thì cân nhắc kỹ** — đã có tài liệu rồi thì giữ nguyên là hơn.
- Sau khi đổi, kiểm bằng feature nháp — nhất là xem skill **có thấy feature đã có** không.

---

Chương tiếp: [06 — Copy skill về dự án](06-copy-skill-ve-du-an.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
