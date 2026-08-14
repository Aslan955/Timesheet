---
type: skill-explainer
skill: api-checklist
updated: 2026-07-15
---

# `/api-checklist` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/api-checklist` giúp bạn lập **danh sách những tình huống cần thử cho API** — tức phần trao đổi dữ liệu giữa ứng dụng của bạn với backend hoặc với một hệ thống đối tác.

Ẩn dụ đời thường: giống như bạn chuẩn bị mở cửa hàng và lập danh sách “cần thử những tình huống nào”: khách mua bình thường, thanh toán lỗi, nhà giao hàng báo trùng, đơn bị chậm, khách không đủ quyền... Nhưng trước khi lập danh sách đó, bạn phải **hiểu rõ nhà thầu làm được gì**. Chỗ nào chưa rõ thì ghi thành câu hỏi, chứ không tự tưởng tượng ra rồi đem đi thử.

Lệnh này không tạo ngay các lần gọi API để bấm chạy. Nó tạo một **outline (dàn ý kiểm thử)** để QC/BA cùng xem: “đã bao phủ đủ rủi ro chưa, còn sót tình huống nào không?”.

Ví dụ:

- API đăng nhập: gửi đúng tài khoản/mật khẩu thì nhận gì? Sai mật khẩu thì sao? Bị khoá tài khoản thì sao? Thiếu mã xác thực thì sao?
- API thanh toán qua đối tác: gửi yêu cầu thanh toán thành công thì sao? Thẻ thiếu tiền thì sao? Gửi lại cùng một yêu cầu có bị trừ tiền hai lần không?
- Webhook thanh toán: đối tác báo “đã thanh toán” vào hệ thống mình. Nếu họ báo trùng, báo sai chữ ký, hoặc báo ngược thứ tự thì xử lý thế nào?

Khi nên dùng:

- Bạn đã có hoặc đang đọc tài liệu API, nhưng chưa chắc đã nghĩ đủ các tình huống cần kiểm.
- Bạn sắp giao việc cho QC/tester, cần chốt phạm vi test trước.
- Bạn tích hợp API đối tác như thanh toán, gửi email, vận chuyển, SMS...
- Bạn có API nội bộ và muốn kiểm tra backend theo đúng quy tắc nghiệp vụ.

Gõ lệnh đơn giản như:

```text
/api-checklist payment
```

Hoặc nói tự nhiên hơn:

```text
/api-checklist tạo checklist cho API thanh toán PayGate
```

**Một câu để nhớ:** `/api-checklist` giúp bạn **hiểu rõ API trước, rồi mới lập danh sách những tình huống cần thử** — chỗ chưa rõ thành câu hỏi mở, không biến thành test bịa.

---

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
 BẠN GÕ LỆNH
 /api-checklist payment
        │
        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Hiểu phạm vi API                                     │
 │ API này của hệ thống mình, của đối tác, hay là luồng phối hợp │
 │ cả hai bên? Endpoint nào thực sự cần kiểm?                   │
 └──────────────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Đọc những tài liệu đã có                             │
 │ Đọc đặc tả, tài liệu API, sơ đồ tích hợp, danh sách lỗi và   │
 │ test cũ để lấy thông tin sẵn có. Không hỏi lại điều đã rõ.   │
 └──────────────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Chấm mức độ hiểu                                     │
 │ 🟢 Đủ thông tin để viết test                                  │
 │ 🟡 Có thể suy đoán nhưng cần xác nhận                         │
 │ 🔴 Thiếu thông tin quan trọng                                 │
 └──────────────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Phỏng vấn discovery từng vòng                        │
 │ Chỉ hỏi những cụm còn 🟡 / 🔴: contract, quyền truy cập,      │
 │ môi trường thử, cách gây lỗi, dữ liệu mẫu, giới hạn...       │
 │ Mỗi vòng chỉ một chủ đề, chờ bạn trả lời rồi mới hỏi tiếp.   │
 └──────────────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Lập checklist theo điều đã biết                      │
 │ Mỗi dòng ghi: gọi API nào, tình huống gì, kích hoạt bằng gì, │
 │ mong HTTP/kết quả gì, ưu tiên bao nhiêu, tự động được không. │
 │ 🔴 không thành dòng test — chuyển thành Câu hỏi mở.          │
 └──────────────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Cho bạn xem và chỉnh                                  │
 │ Hiện bản checklist tóm tắt. Bạn có thể đồng ý, yêu cầu thêm, │
 │ bớt hoặc sửa tình huống trước khi ghi file.                  │
 └──────────────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 7 — Xin phép rồi mới ghi                                 │
 │ Báo rõ sẽ tạo/cập nhật file nào, bao nhiêu tình huống, còn   │
 │ bao nhiêu câu hỏi mở. Bạn đồng ý mới thực hiện.              │
 └──────────────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có checklist để QC/BA review phạm vi test
```

---

## 3. Cơ chế discovery 🟢/🟡/🔴 — vì sao KHÔNG bịa‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quan trọng nhất của `/api-checklist` không phải là “viết được nhiều dòng test”, mà là **biết rõ mình hiểu API đến đâu**.

Nó dùng ba mức dễ nhìn:

| Mức | Nghĩa là gì | Lệnh sẽ làm gì |
|---|---|---|
| 🟢 | Tài liệu đã nói đủ: biết gửi gì, làm sao tạo tình huống và kết quả mong đợi | Viết thành một dòng checklist đầy đủ |
| 🟡 | Có dấu hiệu để đoán, nhưng chưa chắc đúng | Có thể ghi checklist, nhưng đánh dấu “cần xác nhận” |
| 🔴 | Thiếu dữ kiện quan trọng | Không viết test; ghi thành **Câu hỏi mở** |

Ví dụ API thanh toán có tài liệu nói rõ: dùng `tok_insufficient` sẽ tạo lỗi “không đủ tiền”. Đây là 🟢: tester biết chính xác cần gửi gì và mong gì.

Nhưng tài liệu chỉ nói “có giới hạn số lần gọi”, không nói cụ thể bao nhiêu lần trong bao lâu. Đây là 🔴: không thể tự bịa “30 lần trong 10 giây” rồi coi như yêu cầu thật. Lệnh sẽ ghi:

```text
- [ ] OQ: Giới hạn số lần gọi API thanh toán là bao nhiêu yêu cầu trong khoảng thời gian nào?
```

Hay tài liệu nói có webhook nhưng không nói đối tác ký dữ liệu bằng cách nào. Đó cũng là 🔴: không được viết “kiểm chữ ký HMAC” (*HMAC* = một kiểu chữ ký số để xác nhận thông báo đúng là do đối tác gửi, không bị giả mạo) như thể đã biết chắc. Phải hỏi lại cơ chế ký trước.

> **Vì sao nghiêm vậy?** Vì checklist trông rất dễ tạo cảm giác “đã test đủ rồi”. Nếu những dòng bên trong là suy đoán không được đánh dấu, nhóm sẽ có một cảm giác an toàn giả — nguy hiểm hơn là thừa nhận chưa biết.

---

## 4. Ba làn test + hai chiều API‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/api-checklist` không chỉ chia theo “API của ai”, mà còn chia theo **loại rủi ro cần kiểm**.

### Ba làn test

| Làn | Nghĩa dễ hiểu | Ví dụ | Cần kiểm chính |
|---|---|---|---|
| `own` | API do hệ thống mình làm | `POST /auth/login` | Backend mình có đúng quy tắc nghiệp vụ không? |
| `3rd` | API của đối tác | API thu tiền của PayGate | Đối tác nhận/trả đúng theo tài liệu không? |
| `mixed` | Luồng có cả mình và đối tác | `/payment/charge` gọi PayGate phía sau | Hai bên phối hợp có khớp, có xử lý lỗi đủ không? |

Ví dụ với thanh toán:

- `own`: kiểm API của mình có từ chối đơn hết hạn, lưu trạng thái đúng, không tạo đơn nửa chừng.
- `3rd`: kiểm PayGate trả đúng lỗi khi thẻ thiếu tiền hay thiếu thông tin.
- `mixed`: kiểm khi PayGate báo thanh toán thất bại thì API của mình trả gì cho app, đơn hàng chuyển sang trạng thái nào, UI có nhận được trạng thái đúng không.

### Hai chiều API

Nhiều người chỉ nghĩ “ứng dụng mình gọi sang đối tác”. Thực tế còn chiều ngược lại.

| Chiều | Nghĩa dễ hiểu | Ví dụ | Rủi ro đặc thù |
|---|---|---|---|
| `out` | Ứng dụng mình gọi ra ngoài | Gọi API tạo giao dịch | Gửi sai dữ liệu, thiếu quyền, nhận lỗi sai |
| `in` | Đối tác gọi vào hệ thống mình | PayGate gửi webhook báo đã thanh toán | Báo trùng, báo giả, báo chậm, báo ngược thứ tự |

**Webhook** là một thông báo tự động từ đối tác gửi về hệ thống mình. Ví dụ PayGate chủ động nói: “giao dịch này đã thành công”.

Với chiều `in`, checklist phải quan tâm các chuyện rất khác:

- Chữ ký thông báo có hợp lệ không?
- Đối tác gửi cùng một thông báo hai lần thì có bị cộng tiền hai lần không?
- Họ thử gửi lại sau khi mạng lỗi thì hệ thống mình có chịu được không?
- Họ báo “thành công” trước rồi mới báo “đang xử lý” thì trạng thái có bị lùi sai không?

> Đối tác có webhook mà chỉ kiểm chiều `out` thì giống như chỉ kiểm bạn gọi điện được, nhưng không kiểm bên kia gọi lại có ai nghe và xử lý đúng không.

---

## 5. Checklist tạo ra gồm những gì?

Kết quả chính nằm ở:

```text
docs/{feature}/test/api/api-checklist.md
```

Trong file này có năm phần dễ đọc:

1. **Hiểu API** — API làm gì, dùng môi trường nào, endpoint nào nằm trong phạm vi.
2. **Fixtures** — dữ liệu thử: mã test, ID mẫu, tên biến môi trường; không ghi bí mật thật.
3. **Checklist** — từng tình huống cần thử.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
4. **Coverage matrix** — bảng nhìn nhanh endpoint nào đã có Happy, Auth, Validation... hay còn trống.
5. **Câu hỏi mở** — các điểm 🔴 chưa có dữ kiện để kiểm.

Mỗi dòng checklist thường trả lời những câu rất thực tế:

- Gọi API nào?
- Đây là chiều gọi ra hay gọi vào?
- Muốn thử tình huống gì?
- Dùng dữ liệu hoặc trạng thái nào để tạo tình huống đó?
- Mong HTTP `200`, `400`, `401`, `404`...?
- Sau khi gọi, kết quả quan sát được phải là gì?
- Đây có phải tình huống ưu tiên cao không?
- Máy có thể tự chạy hay cần người/chờ trạng thái?
- Mức độ tin cậy 🟢 hay 🟡?

Ví dụ đọc bằng lời:

> “Gọi `POST /v1/charges` với thẻ thiếu tiền, mong nhận lỗi `402 insufficient_funds`, giao dịch không được đánh dấu thành công.”

Đó là checklist rõ ràng, nhưng vẫn chưa phải một lần gọi chạy được trên công cụ test.

---

## 6. `/api-checklist` khác `/test-checklist` thế nào?

Đây là chỗ rất hay bị nhầm.

`/api-checklist` là checklist test **API**: tập trung vào request/response, mã HTTP, quyền truy cập, lỗi nghiệp vụ, dữ liệu trả về, webhook và trạng thái phía backend.

`/test-checklist` là checklist test **giao diện và hành vi người dùng**: tập trung vào màn hình, nút bấm, thông báo, luồng thao tác, hiển thị trên điện thoại/máy tính...

Ví dụ cùng là đăng nhập:

| Nếu cần kiểm gì? | Dùng lệnh nào? |
|---|---|
| Ô mật khẩu có che ký tự không? Nút Đăng nhập có bị mờ khi bỏ trống không? | `/test-checklist` |
| Gửi sai mật khẩu thì API trả mã gì? Bị khoá 5 lần có tạo token không? | `/api-checklist` |
| Bấm nút Đăng nhập và thấy thông báo lỗi đúng trên màn hình không? | `/test-checklist` |
| API có từ chối request thiếu trường `password` không? | `/api-checklist` |

Nói thật gọn:

> `/test-checklist` kiểm **người dùng thấy và làm gì trên giao diện**; `/api-checklist` kiểm **hai hệ thống nói chuyện với nhau ra sao**.

Hai loại này bổ sung nhau, không thay thế nhau. UI có thể báo lỗi đẹp nhưng backend xử lý sai; ngược lại API có thể đúng nhưng màn hình không hiện kết quả cho người dùng.

---

## 7. Vị trí trong họ API — trước và sau nó là gì?

Trong hành trình làm việc với API, `/api-checklist` là bước **[3] — lập danh sách cần kiểm**.

```text
/api-assess  → có nên chọn đối tác?
/api-doc     → đối tác nhận gì, trả gì?
/api-design  → hai bên phối hợp khi bình thường và sự cố ra sao?
   └ /api-map ([2] kèm) → dữ liệu đi đâu, lưu đâu, hiện ở màn nào? (hội tụ vào api-design)
/api-checklist → cần thử những tình huống nào?   ← bạn đang ở đây
/api-test    → biến từng tình huống thành lần gọi chạy được
/api-readiness → đã sẵn sàng chạy thật chưa?
```

Bước ngay sau là:

```text
/api-test payment
```

`/api-test` đọc checklist đã chốt và biến từng dòng thành **request chạy được bằng Bruno**. Bruno là công cụ gửi thử API, tương tự Postman.

Vai trò được tách rõ:

- `/api-checklist`: chọn **cần thử cái gì**.
- `/api-test`: chuẩn bị **thử bằng cách nào**.
- QC/tester: chạy thử, ghi nhận đậu/rớt và theo dõi lỗi.

Lý do tách làm hai: nếu chưa thống nhất “cần thử gì” mà đã lao vào tạo request, đội dễ tạo hàng loạt test kỹ thuật nhưng vẫn bỏ sót rủi ro nghiệp vụ quan trọng.

---

## 8. Ví dụ thực tế

Anh Minh phụ trách tính năng thanh toán gói Premium. Hệ thống của anh gọi PayGate để thu tiền, và PayGate sẽ gửi webhook về khi giao dịch hoàn tất.

Anh gõ:

```text
/api-checklist premium-payment
```

1. Lệnh đọc tài liệu tích hợp đang có. Nó thấy có API tạo giao dịch của PayGate, có endpoint thanh toán của hệ thống mình và có nhắc tới webhook.

2. Nó nhận ra đây là làn `mixed`: không chỉ test PayGate, mà còn phải test cách hệ thống của anh phản ứng sau khi PayGate trả kết quả.

3. Tài liệu nói rõ mã test cho “thanh toán thành công” và “thẻ thiếu tiền”, nên hai tình huống này là 🟢.

4. Nhưng tài liệu không nói PayGate ký webhook như thế nào, cũng không nói giới hạn số lần gọi API. Lệnh hỏi từng cụm riêng, không dồn một loạt câu hỏi làm anh khó trả lời.

5. Anh biết chữ ký webhook dùng HMAC, nhưng chưa biết giới hạn gọi API. Lệnh đưa HMAC vào checklist; phần giới hạn vẫn để thành Câu hỏi mở 🔴.

6. Nó cho anh xem bản nháp gồm các tình huống: thanh toán thành công, thiếu dữ liệu, thẻ thiếu tiền, sai key, gửi trùng yêu cầu, webhook hợp lệ, webhook trùng.

7. Anh bổ sung: “Nếu webhook đến trùng thì không được kích hoạt Premium hai lần.” Lệnh cập nhật lại bản nháp, rồi xin phép ghi file.

8. Sau khi anh đồng ý, file checklist được tạo. Đội QC/BA review và thống nhất phạm vi. Lúc đó mới chạy `/api-test premium-payment` để tạo các request Bruno thật sự.

Kết quả: nhóm không chỉ test “bấm thanh toán có thành công không”, mà đã nhìn thấy cả các rủi ro khó hơn như trừ tiền trùng, báo webhook trùng và trạng thái Premium bị lệch.

---

## Xem thêm

Tài liệu này giải thích ý tưởng ở mức dễ hiểu. Muốn xem đầy đủ quy tắc discovery, cấu trúc bảng checklist và các tình huống đặc biệt, đọc file gốc: `.claude/skills/api-checklist/SKILL.md`.

Các lệnh liên quan:

- `explain-skills/api-family.md` — bản đồ đầy đủ của họ 7 lệnh API.
- `/api-doc` — đọc và diễn giải tài liệu API đối tác trước khi lập checklist.
- `/api-design` — thiết kế cách hệ thống mình và đối tác phối hợp.
- `/api-map` — tra dữ liệu từ API đi vào hệ thống và giao diện ở đâu.
- `/api-test` — biến checklist đã chốt thành request Bruno chạy được.
- `/test-checklist` — checklist riêng cho giao diện và hành vi người dùng, không phải API.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍



<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
