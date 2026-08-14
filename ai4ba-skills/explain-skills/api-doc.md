---
type: skill-explainer
skill: api-doc
updated: 2026-07-15
---

# `/api-doc` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Mục 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/api-doc` đọc tài liệu API của **đối tác** rồi tóm tắt lại thành một tài liệu nghiệp vụ dễ hiểu cho BA, QC, quản lý và khách hàng.

API là cách hai hệ thống “nói chuyện” với nhau. Nhưng tài liệu đối tác thường viết cho lập trình viên: nhiều mã, tên trường dữ liệu, đường dẫn kỹ thuật. `/api-doc` làm việc giống như **đọc hợp đồng hoặc tờ hướng dẫn của nhà thầu phụ, rồi tóm tắt lại bằng lời dễ hiểu cho cả nhóm**.

Nó trả lời các câu hỏi thực tế:

* Đối tác cho hệ thống của mình làm được những thao tác nào?
* Mỗi thao tác cần cung cấp thông tin gì?
* Đối tác sẽ trả lại kết quả gì?
* Nếu có lỗi thì lỗi đó có ý nghĩa gì với người dùng?
* Có giới hạn sử dụng nào không, ví dụ quá nhiều lần gửi yêu cầu trong một khoảng thời gian?
* Nhóm đang dùng phiên bản tài liệu nào của đối tác?

Ví dụ: công ty bạn tích hợp cổng thanh toán. Đối tác gửi một file tài liệu rất dài. Bạn không cần tự đọc từng phần kỹ thuật; có thể gõ `/api-doc` để nhận bản tóm tắt như: “có thể tạo thanh toán, tra trạng thái giao dịch, hoàn tiền; người dùng cần nhập số tiền và mã đơn; khi báo lỗi A thì yêu cầu thanh toán bị từ chối...”.

Gõ lệnh như sau:

```text
/api-doc _teaching/mock-paygate/openapi.yaml --feature premium-payment
```

Hoặc đọc trang tài liệu trên web:

```text
/api-doc https://docs.partner.com/api --feature premium-payment
```

`--feature` nghĩa là tên tính năng đang làm. Nếu bạn chưa ghi, hệ thống sẽ cố suy ra từ ngữ cảnh; chỉ hỏi lại khi chưa rõ.

**Một câu để nhớ:** `/api-doc` là người “phiên dịch” tài liệu kỹ thuật của đối tác thành lời nghiệp vụ: họ làm được gì, cần gì, trả gì, lỗi gì và bị ràng buộc gì.

---

## Mục 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
 BẠN GÕ LỆNH
 /api-doc openapi.yaml --feature premium-payment
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Nhận tài liệu đối tác                         │
 │ Đọc file OpenAPI/Swagger, PDF, Markdown hoặc trang     │
 │ tài liệu web. Đây chỉ là ĐỌC tài liệu, chưa gọi API.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Dịch sang góc nhìn nghiệp vụ                  │
 │ Gom phần kỹ thuật thành các thao tác dễ hiểu: tạo      │
 │ thanh toán, tra cứu giao dịch, hoàn tiền...            │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Gom thông tin quan trọng                       │
 │ Ghi nhận xác thực, kết quả trả về, lỗi, giới hạn dùng, │
 │ và phiên bản API đối tác đang công bố.                 │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Đối chiếu nhu cầu đã có                        │
 │ Quét các brainstorm trong toàn dự án, đưa danh sách    │
 │ liên quan cho bạn CHỌN rồi mới đối chiếu chênh lệch.   │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Xem trước rồi mới ghi (xin phép)              │
 │ Báo sẽ tóm tắt bao nhiêu thao tác, bao nhiêu lỗi,      │
 │ dùng cách xác thực nào và phát hiện bao nhiêu gap.     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Tạo bản tóm tắt chung                          │
 │ Ghi vào docs/{feature}/integration/api-summary.md:     │
 │ tổng quan, thao tác, error catalog, ràng buộc, gap...  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 7 — Tự kiểm tra lại                                │
 │ Đọc lại file vừa tạo, kiểm đủ 7 mục, không còn chỗ     │
 │ trống hoặc thông tin “để sau điền”.                    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — cả nhóm có bản hiểu chung về API đối tác
```

---

## Mục 3. Kết quả bạn nhận được‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Kết quả luôn nằm tại:

```text
docs/{feature}/integration/api-summary.md
```

Trong đó `{feature}` là tên tính năng, ví dụ `premium-payment`.

File có bảy phần để người không chuyên vẫn theo dõi được:

* Tổng quan: API của ai, phục vụ việc gì, đang dùng phiên bản nào.
* Xác thực: cần chuẩn bị quan hệ/tài khoản với đối tác ra sao để được dùng.
* Bảng thao tác: mỗi việc đối tác hỗ trợ, cần nhập gì, trả lại gì, dùng lúc nào.
* Error catalog: danh mục lỗi — mã lỗi và ý nghĩa nghiệp vụ của chúng.
* Ràng buộc: giới hạn lượt dùng, hạn mức, yêu cầu chống gửi trùng...
* Đối chiếu brainstorm và gap tích hợp: nhu cầu của sản phẩm khớp hoặc lệch API ở đâu.
* Câu hỏi mở: các điểm cần xác nhận ở bước thiết kế, tra dữ liệu hoặc thử thật.

*Error catalog* có thể hiểu đơn giản là **“bảng từ điển lỗi”**. Thay vì thấy một mã khó hiểu rồi đoán, BA và QC biết lỗi đó là “giao dịch bị từ chối”, “mã đơn đã dùng”, hay “đối tác đang tạm bận” để thiết kế thông báo và tình huống kiểm thử phù hợp.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

---

## Mục 4. Vì sao phải đối chiếu brainstorm?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đọc tài liệu đối tác thôi chưa đủ. Đối tác có thể cung cấp rất nhiều khả năng, nhưng sản phẩm của mình chỉ cần một phần; hoặc ngược lại, sản phẩm đang cần một việc mà API không hỗ trợ.

Vì vậy `/api-doc` luôn tìm các ghi chú ý tưởng (*brainstorm* — nơi nhóm ghi nhu cầu và khả năng mong muốn) trong **toàn bộ dự án**, rồi đưa danh sách để bạn chọn cái nào cần đối chiếu. Nó không tự âm thầm chọn thay bạn.

Kết quả đối chiếu thường có bốn loại:

| Trạng thái | Nghĩa dễ hiểu |
|---|---|
| ✅ API đáp ứng | Nhu cầu sản phẩm đã có thao tác tương ứng từ đối tác. |
| ⚠️ API thiếu | Sản phẩm cần, nhưng tài liệu đối tác chưa cho thấy họ hỗ trợ. |
| ➕ API có, brainstorm chưa lường | Đối tác làm được, nhưng sản phẩm chưa quyết định có dùng hay không. |
| ❓ Cần xác nhận | Có điểm chưa đủ rõ, hoặc ràng buộc của đối tác có thể lệch giả định ban đầu. |

Nếu không tìm thấy brainstorm phù hợp, `/api-doc` vẫn ghi rõ một cảnh báo. Đây không phải lỗi kỹ thuật; đó là tín hiệu rằng nhóm đang định tích hợp một dịch vụ nhưng chưa có yêu cầu nghiệp vụ mô tả lý do tích hợp.

---

## Mục 5. Ranh giới — `/api-doc` không làm gì?

`/api-doc` chỉ **đọc hiểu và tóm tắt**. Nó không thử giao dịch thật, không gửi dữ liệu khách hàng và không gọi API đối tác.

Nó cũng không biến tài liệu thành một danh sách kỹ thuật dài dằng dặc kiểu đường dẫn, cấu trúc dữ liệu hay mã lập trình. Những chi tiết đó vẫn có thể nằm trong tài liệu gốc cho dev, còn bản tóm tắt này ưu tiên câu hỏi nghiệp vụ: “làm việc gì, khi nào, kết quả ra sao?”.

Nó không tự sửa brainstorm khi phát hiện chênh lệch. Nó chỉ ghi nhận gap để nhóm quyết định: cập nhật yêu cầu, hỏi lại đối tác, hay đổi cách tích hợp.

Nếu URL tài liệu cần đăng nhập mà không đọc được, lệnh sẽ cần bạn cung cấp nội dung hoặc file thay thế. Nếu tài liệu không nêu lỗi hay phiên bản API, nó không bịa; nó ghi đây là câu hỏi cần xác nhận.

---

## Mục 6. Vị trí trong họ 7 lệnh API

`/api-doc` là chặng **[1] — hiểu đối tác** trong hành trình tích hợp API.

```text
/api-assess → /api-doc → /api-design ──┬── /api-map ([2] kèm)
             (bạn ở đây)               └── (cách phối hợp)
                                              │ map hội tụ vào design, rồi mới:
                                              ▼
                          /api-checklist → /api-test → /api-readiness
```

Trước nó là `/api-assess`: đánh giá xem có nên chọn đối tác này hay không.

Ngay sau nó là `/api-design`: thiết kế cách hệ thống của mình và đối tác phối hợp, nhất là khi chậm, báo trùng hoặc xảy ra sự cố. **Đừng nhảy thẳng từ `/api-doc` sang bước test** — phải qua `/api-design` (cây cầu giữa), nếu không sẽ test đúng từng lời gọi mà tích hợp tổng thể vẫn sai.

Nói đơn giản: `/api-doc` trả lời **“đối tác nói họ làm được gì?”**; còn `/api-design` (bước ngay sau) trả lời **“vậy mình ráp vào hệ thống thế nào cho đúng?”**. Việc *thử thật xem họ có làm đúng không* là của `/api-test`, ở xa hơn về sau.

---

## Xem thêm

* [api-family.md](api-family.md) — bức tranh đầy đủ về họ 7 lệnh API và thứ tự dùng chúng.
* [api-selection.md](api-selection.md) — chọn đúng lệnh API theo tình huống bạn đang gặp.
* [api-workflow.md](api-workflow.md) — quy trình làm việc API từ lúc đánh giá đối tác đến lúc sẵn sàng chạy thật.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
