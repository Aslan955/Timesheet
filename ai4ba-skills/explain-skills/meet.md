---
type: skill-explainer
skill: meet
updated: 2026-07-14
---

# `/meet` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/meet` là lệnh biến **một đống ghi chú họp lộn xộn** thành **một biên bản họp gọn gàng, có cấu trúc** — để sau này ai đọc cũng nắm được: buổi họp đã chốt gì, giao việc cho ai, còn vướng gì, còn câu nào chưa trả lời.

Bạn dùng nó khi vừa họp xong và trong tay có:

- Một bản ghi âm đã chuyển thành chữ (transcript) — kiểu "Anh Tâm: ... / Chị Mai: ..." dài mấy trang.
- Hoặc ghi chú tay bạn gõ vội trong lúc họp — câu cụt, tiếng Việt lẫn tiếng Anh, không ghi rõ ai nói.

Bạn dán nội dung đó vào, `/meet` đọc và **tự bóc tách** ra thành các phần rõ ràng: người dự, các quyết định, việc cần làm, rủi ro, câu hỏi còn treo — kèm sẵn **một email tóm tắt** để bạn copy gửi lại cho những người dự họp. Nếu ghi chú của bạn quá thô (thiếu người nói, thiếu ngữ cảnh), hệ thống sẽ chỉ giữ lại phần nào chắc chắn và **hỏi bạn bổ sung** phần còn thiếu, chứ không tự đoán bừa cho đầy.

Gõ lệnh đơn giản như:

```
/meet client payment-kickoff
```

Trong đó `client` là loại họp (họp với khách), còn `payment-kickoff` là cái tên ngắn gọn để đặt cho biên bản này. Sau khi gõ, hệ thống sẽ mời bạn dán nội dung buổi họp vào.

Nói ngắn gọn: **`/meet` là thư ký ghi biên bản** — bạn đưa nó nội dung thô của buổi họp, nó trả lại một biên bản sạch sẽ, đúng chỗ, không bịa thêm.

---

## 2. Điều quan trọng nhất cần hiểu trước: biên bản họp **chưa phải là yêu cầu chính thức**‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Hãy tưởng tượng: trong buổi họp, khách hàng nói "ừ chốt dùng Stripe đi". Trong biên bản, đây hoàn toàn có thể ghi là một quyết định đã được chấp nhận **trong cuộc họp**. Nhưng một quyết định trong phòng họp và một **yêu cầu đã được duyệt chính thức để đem đi làm** vẫn là hai chuyện khác nhau — người ta có thể đổi ý sau khi về suy nghĩ lại, lúc nói chưa đủ thông tin, hoặc chỉ "nói cho qua" chứ chưa thật sự cam kết.

Vì vậy `/meet` được thiết kế theo một nguyên tắc cứng:

> **Biên bản họp ghi lại điều cuộc họp đã nói hoặc đã chốt, nhưng nội dung đó KHÔNG tự động trở thành yêu cầu chính thức để đem đi làm. Nó chỉ thành yêu cầu thật khi người có thẩm quyền xác nhận lại (thường là reply lại email tóm tắt).**

Hệ quả cụ thể của nguyên tắc này — và đây là điểm khác biệt lớn nhất so với suy nghĩ thông thường:

- `/meet` **KHÔNG tự động** đem nội dung buổi họp đi sửa vào các tài liệu khác (các tài liệu mô tả yêu cầu và đặc tả tính năng — thường viết tắt là URD, PRD, SRS — hay bản kế hoạch...). Nó tuyệt đối không "tiện thể cập nhật luôn".
- Thay vào đó, ở cuối biên bản nó **liệt kê gợi ý**: "quyết định này liên quan tới tài liệu kia, nếu anh đã xác nhận rồi thì có thể chạy lệnh `/cr` hoặc `/brainstorm` để cập nhật". Nhưng chạy hay không, khi nào chạy — **là do bạn quyết**, hệ thống chỉ gợi ý chứ không tự làm.

---

## 3. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
 BẠN GÕ LỆNH
 /meet client payment-kickoff
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Nhận nội dung buổi họp                   │
 │  Bạn dán transcript / ghi chú tay vào.                │
 │  Hệ thống tự nhận ra đây là tiếng Việt, tiếng Anh     │
 │  hay lẫn cả hai, để viết biên bản cho đúng.           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Bóc tách nội dung (phần quan trọng)     │
 │  Hệ thống đọc kỹ và tách ra thành:                    │
 │   • Người dự họp                                      │
 │   • Các quyết định  • Việc cần làm (có người + hạn)   │
 │   • Rủi ro / vướng mắc / phụ thuộc (gọi chung: RAID)  │
 │   • Câu hỏi còn treo chưa ai trả lời                  │
 │                                                        │
 │  QUY TẮC VÀNG: mỗi quyết định / việc cần làm / mục    │
 │  RAID phải trích được CÂU GỐC trong buổi họp. Không   │
 │  trích được → KHÔNG ghi mục đó (chống bịa — xem Mục 4)│
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Cho bạn xem trước bản bóc tách          │
 │  Hệ thống in ra "tôi nghe được những mục này, mỗi     │
 │  mục kèm câu gốc". Bạn duyệt: giữ hết / bỏ mục nào.   │
 │  Mục nào hệ thống không chắc → nó đánh dấu rõ, đợi    │
 │  bạn xác nhận chứ không tự thêm vào.                  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3.5 — Dò quyết định mâu thuẫn buổi họp trước │
 │  Nếu buổi này chốt một điều TRÁI với buổi họp cũ       │
 │  (vd hôm nay "dùng Momo", buổi trước "dùng Stripe"),  │
 │  hệ thống cảnh báo và hỏi bạn xử lý sao — KHÔNG tự     │
 │  ý sửa quyết định cũ.                                  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Xin phép trước khi ghi (chốt chặn)      │
 │  Hệ thống tóm tắt "sẽ tạo 1 biên bản gồm N quyết      │
 │  định, M việc cần làm..." rồi CHỜ bạn gật đầu (Y).    │
 │  Bạn đồng ý → mới ghi ra file. Không đồng ý → sửa.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Ghi ra MỘT biên bản duy nhất            │
 │  Tất cả gói vào 1 file:                               │
 │  docs/meetings/{ngày}-{loại}-{tên}.md                 │
 │  Không tách rời mỗi quyết định / mỗi vướng mắc thành  │
 │  một file riêng (xem Mục 7).                          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 6 — Trả kết quả + email tóm tắt             │
 │  In ra: đã tạo file gì, đếm được bao nhiêu quyết       │
 │  định / việc / câu hỏi, và MỘT EMAIL sẵn để bạn copy  │
 │  gửi người dự họp (nhắc họ reply xác nhận).           │
 │  Kèm gợi ý bước tiếp — nhưng KHÔNG tự chạy.           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — bạn có 1 biên bản sạch + 1 email recap để gửi đi
```

---

## 4. Vì sao "phải trích được câu gốc"? (chống bịa)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Các công cụ ghi biên bản bằng AI có một điểm yếu phổ biến: chúng dễ **suy diễn thêm những quyết định hoặc việc cần làm không hề xuất hiện trong buổi họp**, để biên bản trông cho đầy đủ. Bạn họp có 3 quyết định thôi, nhưng nó trả về biên bản 8 quyết định và 12 việc cần làm — nghe thì "chuyên nghiệp", nhưng một nửa là nó tự thêm vào chứ trong phòng họp chẳng ai nói vậy.

Chuyện này nguy hiểm trong công việc thật: một "việc cần làm" bịa ra có thể khiến ai đó đi làm một chuyện không ai yêu cầu; một "quyết định" bịa ra có thể bị đem đi thực hiện rồi sau này cãi nhau "ai chốt cái này?".

`/meet` chặn điều đó bằng một quy tắc đơn giản mà nghiêm: **mỗi quyết định, mỗi việc cần làm, và mỗi mục RAID (rủi ro / giả định / vấn đề / phụ thuộc — xem Mục 6) đều phải kèm được câu gốc mà ai đó thật sự đã nói trong buổi họp** (ghi rõ luôn ai nói, nếu biết). Nếu hệ thống không tìm được câu gốc để dẫn chứng, thì mục đó **không được ghi** — dù nó "có vẻ hợp lý" đến đâu.

(Những phần mang tính tóm lược như "tóm tắt thảo luận" hay "góc nhìn nhanh" thì không cần trích từng câu — quy tắc trích câu gốc áp cho các mục *có thể bị đem đi thực hiện*: quyết định, việc cần làm, rủi ro.)

Kết quả: thà biên bản ngắn mà mỗi dòng đều có thật, còn hơn biên bản dài mà lẫn đồ bịa. Bạn đọc lại sẽ luôn thấy được "câu này ai nói" để đối chiếu.

---

## 5. "Việc cần làm" khác "câu hỏi còn treo" như thế nào?

Trong một buổi họp, người ta nói đủ kiểu câu. Có câu là cam kết thật sự, có câu chỉ là suy nghĩ bâng quơ. `/meet` phân biệt rất rạch ròi hai loại này, vì gộp lẫn chúng là nguồn gốc của rất nhiều hiểu lầm.

**Việc cần làm (action item)** — chỉ được ghi khi có **cam kết rõ ràng**, đủ ba yếu tố: *ai* + *làm gì* + *hạn/động từ cam kết*.

> Ví dụ: *"Nam sẽ dựng môi trường thử nghiệm Momo trước ngày 15"* → đây là một việc cần làm rõ ràng (có người: Nam, có việc: dựng môi trường, có hạn: ngày 15).

**Câu hỏi còn treo (open question)** — dành cho những câu **ngụ ý, chưa chắc chắn**, kiểu "nên", "chắc là", "cần xem lại", nhưng chưa ai nhận làm.

> Ví dụ: *"chắc nên xem lại chuyện cho khách chưa đăng nhập thanh toán trên 5 triệu"* → đây KHÔNG phải việc cần làm (chưa ai nhận, chưa có hạn), mà là một câu hỏi còn treo, cần chốt sau.

Vì sao phải tách? Vì nếu biến mọi câu bâng quơ thành "việc cần làm có người phụ trách", bạn sẽ vô tình gán trách nhiệm cho người ta cho một việc họ chưa hề nhận. Ngược lại, một cam kết thật mà bị xem nhẹ thành "câu hỏi treo" thì việc quan trọng dễ bị bỏ quên. `/meet` giữ ranh giới này để biên bản phản ánh đúng cái buổi họp **thật sự** đã cam kết.

---

## 6. RAID là gì — vì sao không chỉ ghi "vướng mắc"?

Nhiều biên bản họp chỉ có một mục cụt lủn tên là "Vướng mắc" (Blockers), và nhét tất tần tật mọi thứ trục trặc vào đó. `/meet` chia nhỏ hơn thành **RAID** — bốn loại khác nhau, vì cách xử lý mỗi loại một khác:

| Chữ | Tên | Nghĩa dễ hiểu | Ví dụ |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
|-----|-----|----------------|-------|
| **R** | Risk (Rủi ro) | Điều **chưa** xảy ra nhưng có thể xảy ra và gây hại | "Deadline Q3 hơi gấp, có nguy cơ trượt" |
| **A** | Assumption (Giả định) | Điều đang **mặc nhiên coi là đúng** nhưng chưa ai kiểm chứng | "Đang giả định khách đã có sẵn tài khoản Momo" |
| **I** | Issue (Vấn đề đã xảy ra) | Điều **đã** trục trặc ngay bây giờ; nếu nó đang chặn công việc thì cũng chính là "vướng mắc" (blocker) theo nghĩa cũ | "Chưa có tài khoản kết nối Momo nên chưa thử được" |
| **D** | Dependency (Phụ thuộc) | Việc của mình **phải chờ** một bên khác / hệ thống khác / mốc khác | "Phải chờ bộ phận pháp lý xác nhận mới làm tiếp được" |

---

## 7. Email tóm tắt — công cụ để "chốt" cho chắc

Nhớ lại nguyên tắc ở Mục 2: biên bản họp chỉ là bằng chứng, chưa phải yêu cầu đã chốt. Vậy làm sao để nó *trở thành* đã chốt? Câu trả lời nằm ở **email tóm tắt (recap)**.

Cuối mỗi lần chạy, `/meet` soạn sẵn cho bạn một email tóm tắt gọn: chào hỏi, tóm tắt những gì đã bàn, liệt kê các quyết định và việc cần làm, rồi **đề nghị người nhận reply lại xác nhận** ("mình ghi lại như trên, mọi người xem giúp có đúng không nhé").

Email này chính là cây cầu biến "câu nói trong phòng họp" thành "yêu cầu được xác nhận":

- Bạn copy email, gửi cho những người dự họp.
- Họ đọc, nếu đúng thì reply "ok đúng rồi" → lúc này quyết định mới thật sự được chốt.
- Nếu họ sửa ("chỗ refund là 15 ngày chứ không phải 30") → bạn biết ngay để chỉnh, tránh làm sai từ đầu.

Trong biên bản còn có riêng một bảng **Xác nhận**, đánh dấu rõ mục nào **đã** được xác nhận (✅), mục nào **còn chờ** reply (⏳), mục nào **chưa chốt** (❌). Nhìn bảng đó là biết ngay: cái gì đã chắc chắn để đem đi làm, cái gì còn phải đợi.

---

## 8. Ai / cái gì tham gia khi `/meet` chạy?

Khác với vài lệnh vẽ sơ đồ (có "trợ lý chuyên trách" được mời vào rà soát), `/meet` **không gọi thêm trợ lý riêng** — nó tự làm phần bóc tách. Nhưng "tự làm" không có nghĩa là "tự quyết": nó vẫn **hỏi bạn** mỗi khi nội dung chưa rõ (câu mơ hồ, mục không chắc chắn, chưa rõ ai chịu trách nhiệm, có quyết định mâu thuẫn với buổi cũ), và **luôn chờ bạn duyệt** trước khi ghi biên bản ra file. Để làm phần bóc tách cho đúng, nó dựa vào hai "cẩm nang quy tắc" có sẵn:

| Cẩm nang | Nó giúp gì |
|---|---|
| **Bộ nhận diện từ khóa** (`keyword-detection.md`) | Đây là "danh sách các dấu hiệu" giúp hệ thống nhận ra: câu nào là quyết định ("chốt là...", "quyết định..."), câu nào là việc cần làm ("Nam sẽ...", "giao cho..."), câu nào là rủi ro, câu nào là câu hỏi. Nhờ nó mà hệ thống bóc tách được từ văn bản lộn xộn — và cũng nhờ nó mà biết phân biệt tiếng Việt / tiếng Anh để viết biên bản cho đúng. |
| **Bộ quy tắc chung của BA** (`ba-conventions.md`) | Đảm bảo biên bản viết bằng ngôn ngữ nghiệp vụ dễ đọc, không sa vào thuật ngữ kỹ thuật, và không hỏi lại những câu bạn đã trả lời. |

Một điểm dễ nhầm cần nói rõ: hệ thống có lưu sẵn danh tính của **bạn** (người đang chạy lệnh) — nhưng danh tính đó chỉ dùng để ghi "ai là người lập biên bản này", **KHÔNG** dùng để tự gán "ai phải làm việc trong buổi họp". Người thực hiện mỗi việc luôn phải dựa vào câu cam kết thật trong buổi họp; nếu không rõ ai nhận, hệ thống đánh dấu là "chưa có người phụ trách" (`@TBD`), cảnh báo cho bạn và đề nghị bạn chỉ định — chứ không đoán bừa gán cho ai.

---

## 9. Ví dụ thực tế

Chị **Hương**, một BA, vừa họp xong buổi họp khởi động (kickoff) với khách hàng về tính năng thanh toán. Buổi họp kéo dài 45 phút, chị có bản ghi âm đã chuyển thành chữ. Chị mở cửa sổ nhập lệnh, gõ:

```
/meet client payment-kickoff --feature payment
```

(Phần `--feature payment` chỉ là cách nói với hệ thống "biên bản này gắn với tính năng thanh toán", để sau này dễ tra cứu theo tính năng — không bắt buộc, bỏ đi vẫn chạy.)

1. Hệ thống mời chị dán transcript vào. Chị dán cả đoạn dài "Anh Tâm: ... / Chị Mai: ... / Nam: ...". Hệ thống nhận ra đây là tiếng Việt, sẽ viết biên bản bằng tiếng Việt.

2. Hệ thống đọc và bóc tách, rồi in ra cho chị xem trước: nghe được **3 quyết định** (dùng Stripe cho thẻ, launch quý 3, cho hoàn tiền trong 30 ngày), **một số mục RAID** (rủi ro deadline gấp, vấn đề chưa có tài khoản kết nối Momo...), **2 việc cần làm** (Nam dựng môi trường thử Momo, chị Hương viết tài liệu mô tả yêu cầu người dùng). Mỗi mục đều kèm câu gốc: *"Q3 nhé, tight cũng được, tôi chấp nhận"* — Anh Tâm.

3. Có một câu trong họp: *"chắc nên xem lại chuyện khách chưa đăng nhập mà thanh toán trên 5 triệu"*. Vì câu này chỉ ngụ ý (chưa ai nhận làm, chưa có hạn), hệ thống **không** biến nó thành việc cần làm mà xếp vào **câu hỏi còn treo** — đúng bản chất của nó.

4. Chị Hương xem bản bóc tách, thấy khớp, gõ `Y` đồng ý. Hệ thống ghi ra **một file biên bản duy nhất**: `docs/meetings/2026-05-12-client-payment-kickoff.md`.

5. Ngay sau đó, hệ thống in ra **email tóm tắt** sẵn để copy — có đủ lời chào, tóm tắt các quyết định, việc cần làm, và câu đề nghị: *"Nhờ anh chị xem lại giúp, nếu đúng thì reply xác nhận nhé."* Chị Hương copy, gửi cho Anh Tâm và Chị Mai.

6. Cuối cùng, hệ thống gợi ý các bước tiếp — ví dụ *"quyết định về hoàn tiền liên quan tới tài liệu nghiệp vụ payment, khi anh chị xác nhận xong, chị có thể chạy `/brainstorm` hoặc `/cr` để cập nhật"* — nhưng **không tự chạy gì cả**, để chị Hương chủ động quyết khi đã có xác nhận.

7. Hai hôm sau, Anh Tâm reply email: *"Ổn hết, riêng hoàn tiền là 15 ngày thôi nhé không phải 30."* Nhờ có email recap, chị Hương phát hiện sai lệch ngay từ đầu — thay vì đợi tới lúc đã viết xong cả tài liệu mới biết. Chị mở lại biên bản, cập nhật con số, và giờ quyết định hoàn tiền mới thật sự được đánh dấu ✅ đã xác nhận.

Suốt quá trình, chị Hương không bao giờ bị hệ thống "tự tiện" sửa vào tài liệu chính thức từ một câu nói chưa chắc chắn. Buổi họp được ghi lại trung thực, gửi đi xác nhận, rồi mới thành cơ sở để làm tiếp.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (từng bước xử lý, cấu trúc bảng, các trường hợp đặc biệt), đọc file gốc: `.claude/skills/meet/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
