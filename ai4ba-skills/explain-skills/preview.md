---
type: skill-explainer
skill: preview
updated: 2026-07-18
---

# `/preview` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/preview` gom các tài liệu SRS đang nằm rời rạc ở nhiều file thành **một trang HTML dễ xem cho toàn bộ SRS** của một tính năng.

Ví dụ lệnh:

```text
/preview payment
```

Trong đó `payment` là tên tính năng bạn muốn xem.

> **Một câu để nhớ:** `/preview` = "bàn xem tổng thể cho chính bạn, dùng trong lúc đang làm tài liệu".

***

## 2. Toàn bộ luồng chạy diễn ra như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/preview` là một lệnh "hiền": nó chỉ tạo một trang xem mới và không sửa nội dung trong các tài liệu gốc của bạn. Nhưng trước khi tạo, hệ thống vẫn kiểm tra điều kiện và cho bạn xem trước.

```text
 BẠN GÕ LỆNH
 /preview payment
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN A — Xác định tính năng                      │
 │ Hệ thống tìm tính năng `payment`.                     │
 │ Nếu bạn chưa ghi tên tính năng, hệ thống hiện danh    │
 │ sách các tính năng đã sẵn sàng để bạn chọn.           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN B — Kiểm tra SRS                            │
 │ Phải có SRS tại `srs/{feature}-spec.md`.              │
 │ Chưa có thì dừng và chỉ bạn chạy `/srs` trước.        │
 │ Không tự bịa nội dung để làm trang xem cho có.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN C — Cho bạn xem trước (L1)                  │
 │ Hệ thống báo sẽ tạo file ở đâu và trang đó gồm các    │
 │ phần nào.                                             │
 │ Bạn đồng ý thì mới bắt đầu tạo file.                  │
 └──────────────────────────────────────────────────────┘
        │
        │  (chỉ đi tiếp khi bạn đồng ý)
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN D — Gom nội dung thành trang xem            │
 │ Hệ thống đọc các tài liệu hiện có của tính năng,       │
 │ sắp chúng thành mục lục và dựng thành một trang HTML. │
 │ Các sơ đồ được để trình duyệt vẽ khi bạn mở trang.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ HOÀN TẤT — Mở bằng trình duyệt                        │
 │ File được tạo tại:                                    │
 │ docs/{feature}/{feature}-preview.html                 │
 │ Ví dụ: docs/payment/payment-preview.html              │
 └──────────────────────────────────────────────────────┘
```

Bạn chỉ cần bấm đúp file HTML vừa tạo để máy mở nó bằng trình duyệt quen thuộc như Chrome hoặc Safari, không cần chạy server hay cài thêm ứng dụng riêng để xem.

***

## 3. Trang xem này gồm những gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trang xem đi theo thứ tự "từ tổng quan xuống chi tiết". Mở ra, bạn đọc một lèo từ trên xuống là hiểu cả tính năng.

| Phần trên trang xem | Bạn nhìn thấy gì | Biết để làm gì |
|---|---|---|
| Tổng quan nhanh | Một bảng đếm: bao nhiêu yêu cầu chức năng, phi chức năng, quy tắc nghiệp vụ, mã lỗi, màn hình... | Liếc một cái biết quy mô tính năng, chưa cần đọc chi tiết |
| Giới thiệu & Mô tả chung | Từ điển thuật ngữ (glossary), môi trường vận hành, quy ước — lấy từ tài liệu dùng chung của cả dự án | Hiểu các từ ngữ và bối cảnh trước khi đọc yêu cầu |
| SRS Spec | Đặc tả yêu cầu chi tiết: yêu cầu chức năng, phi chức năng, quy tắc, bảng lỗi, tiêu chí thành công | Đọc kỹ tính năng phải làm gì |
| ERD | Sơ đồ dữ liệu | Xem các dữ liệu liên quan với nhau ra sao |
| State diagrams | Sơ đồ trạng thái, nếu có | Xem một đối tượng đổi trạng thái thế nào |
| Functions / Use case | Kịch bản sử dụng | Đọc cách người dùng và hệ thống tương tác |
| Screens (catalog) | Bảng các màn hình kèm mô tả từng màn | Rà các màn hình đang có, biết mỗi màn để làm gì |
| Wireframes | Bản vẽ khung màn hình: bản HTML (khung đen-trắng bấm được) và bản ASCII (vẽ bằng ký tự) + bảng mô tả từng ô | Xem màn hình trông thế nào ngay trên trang, không cần mở file khác |
| Designs | Link tới bản thiết kế Figma / HTML prototype (nếu có) | Đi tới bản thiết kế khi cần |
| Open Questions | Các câu hỏi chưa chốt, gom từ mọi tài liệu | Không bỏ sót việc còn treo |

***

## 4. `/preview` khác `/export` thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cả `/preview` và `/export` đều tạo trang HTML, đồng thời dùng chung một bộ khung giao diện để trình bày tài liệu. Nhưng chúng phục vụ hai thời điểm hoàn toàn khác nhau.

| | `/preview` | `/export` |
|---|---|---|
| Dành cho ai | Chính bạn, lúc đang làm | Người khác: sếp, khách, dev, QC |
| Khi nào dùng | Đang viết hoặc rà tài liệu | Đã xong và cần gửi đi |
| Nội dung | Những phần cần để kiểm tra khi làm | Đầy đủ hơn, có Executive Summary, Stories + AC và Traceability |
| Cần mạng? | Có, để tải thư viện vẽ sơ đồ khi mở lần đầu | Không, vì sơ đồ đã được vẽ sẵn trong file |
| Vòng đời | Tạo lại nhiều lần sau mỗi lần sửa | Đóng dấu ngày tháng để chốt và gửi |

Bạn có thể xem `/preview` như bản nháp trải ra trên bàn làm việc. Còn `/export` giống bộ hồ sơ đã đóng gói để đưa cho người khác.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

**Đừng gửi file `/preview` cho khách.** Máy của khách có thể không có mạng, hoặc công ty của họ chặn Internet ngoài. Khi đó các sơ đồ có thể trắng trơn và khách có thể tưởng tài liệu của bạn làm thiếu hoặc làm ẩu.

Nếu cần gửi ra ngoài, hãy dùng `/export`. `/preview` là bản xem cho mình, còn `/export` là bản chốt để gửi đi.

***

## 5. Có điều gì cần nhớ để không bị "sao vẫn thấy bản cũ"?

Có một điểm rất thực tế: `/preview` **không tự cập nhật**. Bạn sửa file markdown xong, trang preview cũ không tự biết để đổi nội dung.

Bạn cần làm đúng theo thứ tự này:

1) Sửa tài liệu markdown.
2) Chạy lại lệnh `/preview payment`.
3) Mở lại hoặc refresh trang trên trình duyệt.

Nếu bạn quên bước 2, bạn vẫn đang xem bản HTML được tạo từ lần trước, nghĩa là trang xem chưa được tạo lại từ tài liệu mới.

***

## 6. Nếu chưa có SRS thì sao?

SRS là đặc tả yêu cầu chi tiết. Bạn có thể coi nó là phần xương sống để hệ thống hiểu tính năng này đang cần làm gì.

Vì vậy `/preview` bắt buộc phải tìm thấy file:

```text
srs/{feature}-spec.md
```

Nếu chưa có SRS, lệnh sẽ từ chối chạy và chỉ bạn chạy `/srs` trước.

Nếu bạn gõ `/preview` mà không nêu tên tính năng, hệ thống sẽ hiện danh sách các tính năng đã có SRS. Bạn chọn từ danh sách đó, không cần nhớ chính xác tên thư mục hay đường dẫn file.

***

## 7. Ví dụ thực tế

Chị **Lan** là BA phụ trách tính năng `payment`. Chị đang hoàn thiện tài liệu trước buổi trao đổi nội bộ với dev và QC.

Sáng nay, chị sửa lại một yêu cầu trong SRS. Chị cũng cập nhật use case "Người dùng thanh toán đơn hàng". Sau đó chị muốn kiểm tra xem bản vẽ màn hình, use case và yêu cầu có đang khớp nhau không.

Chị gõ:

```text
/preview payment
```

1) Hệ thống tìm tính năng `payment` và kiểm tra có SRS hay chưa.

2) Vì SRS đã có, hệ thống báo trước sẽ tạo trang xem tại `docs/payment/payment-preview.html`, gồm bảng tổng quan nhanh, phần giới thiệu & thuật ngữ, SRS, sơ đồ, use case, màn hình + wireframe và câu hỏi còn treo.

3) Chị Lan đồng ý tạo file.

4) Hệ thống gom các tài liệu hiện có thành một trang HTML.

5) Chị bấm đúp mở file bằng Chrome.

6) Chị dùng mục lục bên trái để nhảy tới use case thanh toán.

7) Ngay trong use case đó, chị thấy bản vẽ màn hình được nhúng kèm và có nhãn `HTML`.

8) Chị bấm vào sơ đồ luồng thanh toán để phóng to, rồi nhận ra một bước xác nhận đang chưa khớp với yêu cầu mới sửa.

9) Chị quay lại sửa tài liệu markdown.

10) Chị chạy lại `/preview payment`, refresh trình duyệt và kiểm tra lần nữa.

Nhờ vậy, chị Lan phát hiện chỗ lệch khi tài liệu vẫn còn ở trên bàn làm việc, trước khi gửi bản chính thức cho bất kỳ ai.

***

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (cách gom nội dung, dựng HTML, ưu tiên wireframe HTML/ASCII và các trường hợp đặc biệt), đọc file gốc: `.claude/skills/preview/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
