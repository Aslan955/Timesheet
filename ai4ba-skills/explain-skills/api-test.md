---
type: skill-explainer
skill: api-test
updated: 2026-07-15
---

# `/api-test` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/api-test` giúp bạn __gọi thử API thật__ và kiểm tra xem nó có trả lời đúng như đã hứa không. API là cách hai hệ thống “nói chuyện” với nhau — ví dụ ứng dụng của bạn gửi yêu cầu thanh toán sang PayGate, hoặc màn đăng nhập gọi API của chính hệ thống mình.

Hãy hình dung đây là việc __gọi thử nhà thầu vài cuộc để xem họ trả lời đúng không__ — nhưng AI đã soạn sẵn nội dung từng cuộc gọi, bạn chỉ cần bấm gọi và ghi lại kết quả.

Ví dụ đời thường:

* Cửa hàng gửi yêu cầu thu tiền cho đối tác thanh toán. Bạn thử một đơn hợp lệ: đối tác có báo “thu tiền thành công” không?
* Bạn thử một thẻ không đủ tiền: đối tác có trả đúng lý do từ chối không?
* Hệ thống của bạn có API đăng nhập. Bạn thử đăng nhập đúng, sai mật khẩu, hoặc đăng xuất: hệ thống có phản hồi đúng quy tắc nghiệp vụ không?

Lệnh này thường dùng **sau `/api-checklist`**: checklist trả lời “cần thử những tình huống nào?”, còn `/api-test` biến từng tình huống đó thành những lần gọi thử có thể chạy được.

Gõ lệnh đơn giản như:

```text
/api-test --feature thanh-toan
```

Lệnh trên chỉ chuẩn bị bộ test. Khi đã có môi trường để gọi thật, dùng:

```text
/api-test --feature thanh-toan --run --env mock
```

Bạn cũng có thể chỉ chạy vài test case cụ thể:

```text
/api-test --feature thanh-toan --run --env sandbox --tc TC-01,TC-03
```

> Vài từ hay gặp: __mock__ = một "đối tác giả" chạy trên máy để thử khi chưa gọi được đối tác thật (không đụng tiền). __sandbox__ = môi trường thử *của chính đối tác*, cũng không đụng tiền/dữ liệu thật. Cả hai đối lại với môi trường thật (production) — nơi khách hàng thật dùng.

__Một câu để nhớ:__ `/api-test` là “bộ cuộc gọi thử” do AI soạn sẵn — BA/QC bấm chạy bằng Bruno, rồi ghi nhận API đậu, rớt, hay chưa thể test.

---

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
 BẠN GÕ LỆNH
 /api-test --feature thanh-toan
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Đọc danh sách cần kiểm                       │
 │  Đọc bảng từ /api-checklist: cần thử tình huống nào, │
 │  mong đợi gì, dùng dữ liệu mẫu nào.                   │
 │  Chưa có checklist → nhắc bạn, nhưng vẫn có thể       │
 │  đề xuất bộ test từ tài liệu API đang có.             │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Chuyển thành các cuộc gọi thử                │
 │  Mỗi tình huống thành một hoặc vài test case cùng     │
 │  ý định: gọi URL nào, gửi gì, chờ mã phản hồi nào.    │
 │  Không tự bịa thêm tình huống ngoài checklist.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Xem trước rồi mới tạo (xin phép)             │
 │  Bạn xem bảng dự kiến: bao nhiêu case, kiểm gì,       │
 │  sẽ tạo những file nào. Bạn đồng ý mới tiếp tục.      │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Tạo bảng test + bộ Bruno                     │
 │  Bảng api-tests.md giữ ý nghĩa nghiệp vụ và expected. │
 │  Bruno nhận các file kỹ thuật để thực hiện cuộc gọi.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Bạn chuẩn bị môi trường an toàn              │
 │  Điền khóa bí mật vào bruno/.env trên máy mình.       │
 │  AI không đọc khóa; chỉ kiểm tra file có tồn tại.     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Chạy thử thật khi bạn gõ --run               │
 │  Bruno gửi request, so đáp án mong đợi, rồi trả       │
 │  PASS / FAIL / PENDING cho từng test case.            │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 7 — Ghi kết quả ngược vào bảng                   │
 │  Kết quả và thời điểm chạy được cập nhật vào          │
 │  api-tests.md; AI giải thích ý nghĩa nghiệp vụ.       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 HOÀN TẤT — có bằng chứng rõ: cái nào đậu, rớt, chưa test được
```

---

## 3. Bruno là gì, vì sao không phải Postman?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Bruno__ là công cụ để gửi các “cuộc gọi thử” đến API, rất giống Postman. Nếu bạn từng dùng Postman để bấm nút Send, nhìn mã `200`, `400`, `401` hoặc nội dung phản hồi, thì dùng Bruno cũng cùng ý tưởng đó.

Khác biệt chính nằm ở cách Bruno lưu bộ test:

* Bruno lưu từng request thành các file chữ đơn giản, nên mở được trong IDE và dễ xem lịch sử thay đổi.
* Bạn có thể mở bộ test bằng Bruno để bấm chạy trực quan, như dùng Postman.
* Bruno cũng chạy được bằng dòng lệnh, để hệ thống ghi kết quả ngược lại bảng tài liệu một cách nhất quán.

Nói cách khác: __Postman và Bruno đều là “điện thoại để gọi thử API”__. Dự án này chọn Bruno vì các cuộc gọi thử được lưu thành file dễ đọc, dễ kiểm soát cùng với tài liệu BA.

Khi mở Bruno bằng giao diện, bạn có thể click từng request để xem nhanh phản hồi. Tuy nhiên, kết quả bấm trong giao diện __chỉ hiện trong Bruno__. Muốn cập nhật chính thức vào bảng `api-tests.md`, hãy chạy `/api-test ... --run`.

---

## 4. Bảng `.md` là gốc — sửa bảng, không sửa file kỹ thuật‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là quy tắc quan trọng nhất của lệnh này.

File `api-tests.md` là __bản gốc__: nó nói rõ mỗi test case kiểm gì, gửi gì, kỳ vọng điều gì, liên quan đến yêu cầu nào, và lần gần nhất chạy cho kết quả gì.

Các file Bruno chỉ là __bản thực thi__ được tạo ra từ bảng đó.

```text
 api-tests.md
 (BA/QC đọc và chỉnh)
        │
        │ regen
        ▼
 file Bruno .bru
 (Bruno dùng để bấm chạy)
```

Ví dụ bạn muốn đổi “số tiền thử” từ 99.000 thành 100.000, hoặc đổi mã lỗi mong đợi. Hãy sửa dòng tương ứng trong bảng `api-tests.md`, rồi nói:

```text
regen lại giùm
```

Hệ thống sẽ tạo lại file Bruno đúng theo bảng.

Không nên sửa trực tiếp request trong Bruno rồi xem đó là bản chính thức. Lý do rất đơn giản: lần “regen” tiếp theo, file kỹ thuật sẽ được tạo lại và thay đổi tay đó có thể mất. Bảng `.md` mới là nơi BA/QC quản lý ý nghĩa nghiệp vụ, nên nó phải luôn đáng tin nhất.

---

## 5. An toàn khóa bí mật

Một số API cần khóa truy cập: ví dụ khóa Bearer của đối tác thanh toán, hoặc tài khoản mẫu để đăng nhập vào API nội bộ. Đây là thông tin nhạy cảm, tương tự chìa khóa kho hàng.

Quy tắc là:

* Khóa thật chỉ nằm trong `bruno/.env` trên máy của bạn.
* File này không được đưa lên Git, không nằm trong bảng `.md`, không xuất hiện trong chat.
* AI không đọc, in, sao chép hay kiểm tra nội dung của file khóa.
* File Bruno chỉ ghi “hãy lấy khóa tên này”, chứ không ghi giá trị khóa thật.
* Khi chạy xong, dữ liệu báo cáo tạm có thể chứa thông tin nhạy cảm sẽ được xử lý và xoá.

Bạn thường sẽ thấy file `.env.example`: đây chỉ là __mẫu tên biến__, để biết cần điền khóa nào. Bạn tự sao chép thành `.env` rồi tự điền giá trị thật.

> Nếu ai yêu cầu bạn dán API key vào bảng test, chat, tài liệu, hoặc file Bruno, đó là sai quy tắc. Dừng lại và để dev hoặc người quản trị môi trường hỗ trợ.

---

## 6. Đậu, rớt, và “chưa-test-được” khác nhau thế nào?

Sau khi chạy, kết quả có ba trạng thái dễ hiểu:

| Trạng thái | Nghĩa là gì | Ví dụ |
|---|---|---|
| ✅ PASS / Đậu | API trả đúng như mong đợi | Gửi thẻ hợp lệ, nhận `201` và trạng thái thanh toán thành công |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| ❌ FAIL / Rớt | Đã gọi được API, nhưng kết quả khác mong đợi | Mong `402` “không đủ tiền” nhưng lại nhận lỗi máy chủ `500` |
| ⏳ PENDING / Chưa-test-được | Cả môi trường không có nơi để gọi, nên chưa thể kết luận | Backend/mock chưa bật, Bruno không kết nối được request nào |

__Một điểm dễ hiểu nhầm cần nhớ:__ PASS/FAIL là kết quả __của từng test case__; còn PENDING là trạng thái __của cả lần chạy__ — nó chỉ xuất hiện khi __toàn bộ__ request trong lần đó đều không kết nối được (chưa có backend/mock — "API trên giấy"). Chỉ cần __một__ request kết nối được thì mọi case đều được chấm PASS/FAIL thật (một tình huống mock chưa hỗ trợ thường thành FAIL — nhận HTTP khác mong đợi — chứ không phải "PENDING riêng cho case đó").

__PENDING không phải FAIL.__ Nếu chưa có nơi để gọi mà ghi "rớt giả", cả nhóm sẽ hiểu sai rằng API có lỗi. Ghi `⏳ PENDING` = "chưa có bằng chứng để kết luận", tách bạch "API sai" với "chưa có API để thử".

---

## 7. API của mình, API đối tác, và chiều webhook

`/api-test` hỗ trợ cả hai kiểu API thường gặp.

__API của đối tác (3rd-party)__ là khi ứng dụng của bạn gọi sang bên ngoài — ví dụ PayGate, dịch vụ gửi email, vận chuyển. Những API này thường cần khóa Bearer, nằm an toàn trong `.env`.

__API của mình (own API)__ là khi bạn thử API do chính dự án xây — ví dụ đăng nhập, đăng xuất, cập nhật hồ sơ. Với loại này, Bruno có thể đăng nhập bằng tài khoản mẫu trước, lấy phiên làm việc, rồi mới thử các API cần đăng nhập.

Còn một chiều dễ nhầm là __webhook đi vào__ (`Dir=in`): đối tác gọi vào hệ thống của mình để báo “đã thanh toán”, “đã giao hàng”, hoặc “đã có sự kiện mới”.

```text
 API bình thường:  Hệ thống mình  ──gọi──►  Đối tác

 Webhook đi vào:   Đối tác        ──gọi──►  Hệ thống mình
```

Webhook không được test bằng cách gọi ngược sang API của đối tác. Muốn test đúng, cần gửi một payload giống đối tác vào endpoint webhook của __hệ thống mình__, thường kèm chữ ký bảo mật. Vì chữ ký cần khóa bí mật và nhiều tình huống cần nhiều bước liên tiếp, phần lớn webhook sẽ được ghi là test thủ công hoặc `Auto No` — không ép tự động hóa cho có.

---

## 8. BA/QC làm phần nào, dev làm phần nào?

BA hoặc QC dùng Bruno, bấm chạy request, đọc PASS/FAIL, và hiểu kết quả đang nói gì về nghiệp vụ — đó là __đúng vai__, hoàn toàn giống dùng Postman.

Ví dụ BA/QC có thể nói:

* “TC-03 rớt vì khách không đủ tiền nhưng màn hình chưa nhận đúng mã lỗi.”
* “TC-07 đang PENDING vì mock thanh toán chưa bật.”
* “Case này cần thêm vào checklist vì chưa thử giao dịch bị gửi trùng.”

Còn việc __bảo trì bộ máy chạy__ là phần của dev:

* Sửa runner chuyển bảng thành file Bruno.
* Gỡ lỗi Bruno CLI, môi trường, mock, hoặc pipeline chạy tự động.
* Mở rộng cách đăng nhập, chuỗi request nhiều bước, hoặc xử lý payload webhook phức tạp.

BA/QC không bị yêu cầu phải gánh các việc này. Nếu bộ máy hỏng, bạn chỉ cần mô tả hiện tượng và chuyển cho dev — giống như người lái xe không phải tự sửa động cơ.

---

## 9. Vị trí của `/api-test` trong họ lệnh API

`/api-test` là bước __[4] — thử thật bằng Bruno__ trong hành trình API.

```text
[0] /api-assess     Chọn đối tác có phù hợp không?
[1] /api-doc        Hiểu tài liệu API nói gì?
[2] /api-design     Thiết kế cách hai bên phối hợp ra sao?
      └ /api-map    ([2] kèm) bảng tra field — hội tụ vào api-design
[3] /api-checklist  Liệt kê tình huống cần kiểm.
[4] /api-test       Gọi thử thật, ghi nhận đậu/rớt.  ← bạn đang ở đây
[5] /api-readiness  Soát xem đã sẵn sàng chạy thật chưa.
```

`/api-test` không thay `/api-checklist`. Checklist là danh sách “nên kiểm gì”; test là bằng chứng “đã gọi thử chưa và kết quả ra sao”.

Và `/api-test` cũng chưa có nghĩa là có thể lên môi trường thật ngay. Dù mọi case đều PASS, vẫn cần `/api-readiness` để kiểm tra vận hành: dùng môi trường thật có an toàn không, ai theo dõi lỗi, có phương án quay lại không, và đối tác thay đổi thì xử lý thế nào.

---

## 10. Ví dụ thực tế

Anh Minh là BA của tính năng thanh toán. Sau khi cùng nhóm hoàn thành `/api-checklist thanh-toan`, anh có một danh sách gồm: thanh toán thành công, thẻ không đủ tiền, gửi trùng yêu cầu, và đối tác phản hồi chậm.

Anh gõ:

```text
/api-test --feature thanh-toan
```

Hệ thống đọc checklist, đề xuất các test case như `TC-01` thanh toán thành công và `TC-02` không đủ tiền. Anh Minh xem trước bảng, thấy đúng ý, rồi đồng ý tạo bộ test.

Sau đó anh tự tạo `bruno/.env` từ file mẫu và điền khóa sandbox của PayGate (*sandbox* = môi trường thử của đối tác, không đụng tiền/dữ liệu thật). Khóa không xuất hiện trong bảng hay trong chat.

Khi mock đã chạy, anh gõ:

```text
/api-test --feature thanh-toan --run --env mock
```

Kết quả:

* `TC-01` PASS: giao dịch hợp lệ trả về thành công.
* `TC-02` PASS: thẻ thiếu tiền trả đúng mã lỗi.
* `TC-03` FAIL: gửi trùng vẫn bị trừ tiền lần hai, trái với quy tắc chống trùng.

(Vì các case trên đã kết nối được mock, cả lần chạy được chấm PASS/FAIL thật — không có "PENDING". Nếu hôm đó __quên bật mock__, toàn bộ 3 case sẽ cùng ra `⏳ PENDING` — cả lần chạy chưa test được, chứ không phải rớt.)

Hệ thống ghi kết quả và thời điểm chạy vào `api-tests.md`. Anh Minh không cần hiểu cấu trúc file Bruno; anh chỉ cần báo nhóm: “Chống giao dịch trùng đang có lỗi thật, cần dev xem lại.”

---

## Xem thêm

Tài liệu này giải thích `/api-test` ở mức dễ hiểu. Chi tiết về bảng test, Bruno, môi trường, và các trường hợp kỹ thuật nằm trong skill gốc `/api-test`.

Các tài liệu liên quan:

* `explain-skills/api-family.md` — bức tranh đầy đủ về họ 7 lệnh API và vị trí bước `[4]`.
* `/api-checklist` — lập danh sách tình huống cần kiểm trước khi gọi thử.
* `/api-readiness` — kiểm tra mức sẵn sàng trước khi dùng API ở môi trường thật.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
