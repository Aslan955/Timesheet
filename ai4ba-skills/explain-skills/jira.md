---
type: skill-explainer
skill: jira
updated: 2026-07-26
---

# `/jira` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/jira` là lệnh để __đồng bộ hai chiều__ giữa tài liệu bạn viết ở máy (user story, epic...) và các "công việc" (issue) trên __Jira__ — công cụ quản lý công việc mà đội dev/PM dùng để theo dõi ai làm gì, tới đâu.

"Hai chiều" nghĩa là:
* __Đẩy lên (push):__ biến user story bạn viết thành Story trên Jira để dev nhận việc.
* __Kéo về (pull):__ khi có người sửa gì đó trên Jira (đổi trạng thái sang "Done", thêm ghi chú, PO sửa lại điều kiện nghiệm thu...), lệnh này mang thay đổi đó về lại tài liệu của bạn để hai bên luôn khớp.

Vài tình huống điển hình nên dùng `/jira`:

* Bạn vừa viết xong bộ user story cho tính năng "thanh toán", muốn đẩy hết lên Jira để đội dev bắt đầu làm.
* Bạn nghi ngờ Jira và tài liệu ở máy đã "lệch nhau" (ai đó sửa bên Jira mà bạn chưa biết), muốn xem chỗ nào khác nhau.
* Sếp/PO đã đưa cho bạn một epic có sẵn trên Jira và bảo "lấy về đây làm tài liệu đi".

Gõ lệnh đơn giản như:

```
/jira payment
```

Chỉ gõ vậy (không thêm gì) là chế độ __an toàn nhất__: hệ thống chỉ *nhìn và so sánh*, __không đụng vào Jira lẫn tài liệu của bạn__. Nó in ra một bảng "chỗ nào khớp, chỗ nào lệch, ai sửa" để bạn xem trước đã.

> __Một câu để nhớ:__ `/jira` = "giữ cho danh sách công việc trên Jira và tài liệu ở máy luôn nói giống nhau — và luôn cho bạn xem trước khi đổi bất cứ bên nào".

---

## 2. Bốn chế độ — gõ thêm gì để làm gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Mặc định (không thêm chữ nào) là chỉ xem. Muốn thực sự thay đổi, bạn gõ thêm một "chế độ":

```
 ┌─────────────────────────────────────────────────────────┐
 │  /jira payment              (không thêm gì)              │
 │  = CHỈ XEM. So sánh 2 bên, in bảng lệch/khớp.            │
 │    Không ghi gì cả. Đây là chế độ mặc định, an toàn.     │
 └─────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────┐
 │  /jira payment --push                                   │
 │  = ĐẨY LÊN. Chỉ đẩy những thứ BẠN vừa sửa ở máy         │
 │    (mà Jira chưa có/chưa đổi) lên Jira.                  │
 └─────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────┐
 │  /jira payment --pull                                   │
 │  = KÉO VỀ. Chỉ kéo những thứ có người sửa BÊN JIRA      │
 │    (mà bạn chưa đổi ở máy) về lại tài liệu.              │
 └─────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────┐
 │  /jira payment --reconcile                              │
 │  = HÒA GIẢI. Xử lý những chỗ CẢ HAI bên cùng sửa        │
 │    (đụng nhau) — hệ thống hỏi bạn giữ bên nào.           │
 └─────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────┐
 │  /jira import PAY-42                                     │
 │  = LẤY VỀ MỘT EPIC/STORY CÓ SẴN trên Jira mà máy        │
 │    chưa có, làm bản nháp để bắt đầu viết tài liệu.       │
 └─────────────────────────────────────────────────────────┘
```

Điểm cốt lõi: **`--push` chỉ động vào cái chỉ bạn sửa, `--pull` chỉ động vào cái chỉ Jira sửa. Còn chỗ cả hai cùng sửa (đụng nhau) thì không tự quyết — luôn hỏi bạn qua `--reconcile`.**

---

## 3. Vì sao cần "sổ liên kết" (nơi ghi lại sự liên kết giữa hai bên)?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là phần quan trọng nhất, đáng giải thích kỹ, vì nếu không có nó thì mọi thứ khác sụp đổ.

__Vấn đề:__ tài liệu ở máy của bạn và issue trên Jira là __hai thế giới có cách gọi tên khác nhau__. Ở máy, một user story tên là `us-003.md`. Trên Jira, cũng công việc đó lại mang mã `PAY-123`. Hai cái tên này __không có gì liên quan về mặt chữ nghĩa__ — máy tính không tự biết `us-003.md` chính là `PAY-123`.

Bây giờ tưởng tượng lần sau bạn chạy `/jira payment --push`. Nếu hệ thống __không nhớ__ rằng `us-003.md` đã từng được đẩy lên và trở thành `PAY-123`, nó sẽ nghĩ "à, story này chưa có trên Jira" và __tạo thêm một issue mới nữa__ — thế là trên Jira bây giờ có 2 công việc y hệt nhau (`PAY-123` và `PAY-200`), đội dev hoang mang không biết làm cái nào.

__"Sổ liên kết" chính là thứ giải quyết chuyện đó__ — bạn cứ hình dung như một cuốn sổ nhỏ ghi lại *chuyện file nào ở máy đang nối với việc nào trên Jira*. Nó ghi từng dòng: *"`us-003.md` ở máy = `PAY-123` trên Jira"*. Nhờ cuốn sổ này, lần sau hệ thống biết ngay: "story này đã có mã `PAY-123` rồi, nên __cập nhật__ nó chứ không tạo mới".

Nhưng sổ liên kết làm nhiều hơn là chỉ nối tên. Nó còn lưu __"ảnh chụp lần khớp gần nhất"__ — tức là nội dung của cả hai bên tại thời điểm chúng vừa đồng bộ xong. Cái ảnh chụp này chính là thứ giúp phát hiện "ai đã sửa gì":

* So nội dung ở máy __hiện tại__ với ảnh chụp → biết __bạn__ có sửa gì không.
* So nội dung trên Jira __hiện tại__ với ảnh chụp → biết __người khác__ có sửa gì trên Jira không.
* Nếu chỉ một bên đổi → dễ, đẩy hoặc kéo. Nếu __cả hai__ cùng đổi → đó là "đụng nhau", phải hỏi bạn.

Không có ảnh chụp này, hệ thống không thể biết ai sửa gì — nó chỉ thấy "hai bên khác nhau" nhưng không biết vì bạn sửa, hay vì người khác sửa, hay cả hai. Giống như bạn với đồng nghiệp cùng sửa một file Word: nếu không có bản gốc để đối chiếu, không ai biết ai đã đổi câu nào.

Trong hệ thống này, sổ liên kết đó là __một file duy nhất__ tên `sync-state.yaml`. Nó gộp chung cả Jira lẫn Confluence (xem thêm ở `/confluence`) — mỗi công việc chỉ tra một chỗ là ra hết: nó ứng với issue Jira nào, page Confluence nào, ảnh chụp lần khớp cuối ra sao.

> __Tóm lại vì sao cần mapping:__ để (1) không tạo trùng công việc mỗi lần đẩy, và (2) biết được *ai* đã sửa *cái gì* kể từ lần đồng bộ trước — nền tảng để phát hiện "đụng nhau" mà không ghi đè mất công sức của người khác.

---

## 4. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
 BẠN GÕ LỆNH
 /jira payment [--push | --pull | --reconcile]
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Kết nối được tới Jira không?                 │
 │  Hệ thống kiểm tra "cầu nối" tới Jira có sẵn sàng     │
 │  chưa (xem Mục 7 về cầu nối này). Chưa kết nối được   │
 │  → xuất ra 1 file để bạn tự nhập tay, không bịa.      │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Mở "sổ liên kết" ra                          │
 │  Đọc file sync-state.yaml: story nào ở máy đã ứng     │
 │  với issue nào trên Jira, ảnh chụp lần khớp cuối.     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Lấy bản Jira mới nhất + SO SÁNH 3 phía       │
 │  Với mỗi story: so (a) bản ở máy bây giờ, (b) bản     │
 │  Jira bây giờ, (c) ảnh chụp lần khớp cuối.            │
 │  → suy ra: chỉ bạn sửa / chỉ Jira sửa / cả hai sửa / │
 │    không ai sửa / bị xóa mất.                         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — In bảng đối chiếu cho bạn xem                │
 │  | Story | Jira | Bạn sửa? | Jira sửa? | Đề xuất |    │
 │  Nếu bạn CHỈ gõ /jira (không cờ) → DỪNG ở đây.        │
 └──────────────────────────────────────────────────────┘
        │
        │  (chỉ đi tiếp nếu bạn gõ --push / --pull / --reconcile)
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4.5 — CHẶN CỨNG: story nào đang "lỗi thời"?      │
 │  (chỉ khi --push) Story mang dấu stale = tài liệu gốc │
 │  của nó đã đổi mà chưa ai đối chiếu lại. Hệ thống     │
 │  TỪ CHỐI đẩy story đó lên Jira — không có cách ép.    │
 │  Phải chạy /cr đối chiếu cho hết stale rồi mới đẩy.   │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — KIỂM TRA LẠI JIRA LẦN CUỐI ngay trước khi ghi│
 │  Trước khi ghi đè bất kỳ issue nào (--push, và cả khi │
 │  --reconcile bạn chọn "giữ bản của tôi"), lấy lại bản │
 │  Jira MỘT LẦN NỮA. Nếu vừa có người sửa → KHÔNG ghi   │
 │  cái đó, báo "cần hòa giải trước" / bắt xem lại.      │
 │  (Đây là chốt chặn mất-dữ-liệu — xem Mục 5.)          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Xem trước rồi mới ghi                         │
 │  --push: xem danh sách sẽ đẩy → bạn gật → đẩy.        │
 │  --pull: xem "trước/sau" nội dung sẽ mang về → gật →  │
 │          mới sửa vào tài liệu.                         │
 │  --reconcile: từng chỗ đụng nhau, hỏi bạn giữ bên nào.│
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 7 — Cập nhật lại "sổ liên kết" + báo cáo          │
 │  Ghi lại ảnh chụp mới (cho lần đồng bộ sau), in tóm   │
 │  tắt: đẩy/kéo/hòa giải những gì.                       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — Jira và tài liệu ở máy lại khớp nhau
```

---

## 5. Vì sao có bước "kiểm tra lại Jira lần cuối" (chống ghi đè)?

Đây là điểm an toàn quan trọng nhất, đáng nhớ.

Việc một story ở máy "đã có mã `PAY-123`" __không__ có nghĩa là cứ thế đẩy đè lên là an toàn. Vì giữa lần đồng bộ trước và bây giờ, **có thể có người vừa sửa `PAY-123` trên Jira** — ví dụ PO thêm một điều kiện nghiệm thu mới. Nếu hệ thống cứ thế đẩy bản ở máy đè lên, điều kiện PO vừa thêm sẽ __biến mất__, và không ai hay biết cho tới khi phát hiện ra hậu quả.

Vì vậy, ngay __trước khi ghi đè__ bất kỳ issue nào, hệ thống làm một việc bắt buộc: __lấy lại bản Jira mới nhất một lần nữa__ và so xem nó có khác với "ảnh chụp lần khớp cuối" không.

* Nếu Jira __chưa ai đụng__ → an toàn, đẩy.
* Nếu Jira __vừa có người sửa__ → __dừng lại, không đẩy cái đó__, báo bạn "chỗ này cả hai bên cùng sửa, cần hòa giải trước".

Nói cách khác: __mã số issue chỉ giúp không tạo trùng, nó KHÔNG bảo vệ khỏi ghi đè. Việc kiểm tra lại nội dung mới nhất trước khi ghi mới là thứ bảo vệ công sức của người khác.__

Và khi bạn chọn "giữ bản của tôi" trong lúc hòa giải, hệ thống vẫn kiểm tra lần nữa: nếu ngay lúc đó Jira lại vừa đổi tiếp, nó hủy và bắt bạn xem lại — để bạn luôn ghi đè lên đúng cái bạn đã nhìn thấy, chứ không ghi đè mù. Nói cách khác, bước kiểm-tra-lại này áp cho __mọi lần ghi ra Jira__, không riêng `--push`.

---

## 6. Chặn cứng: không đẩy story đang "lỗi thời" (stale)

Ngoài chốt chặn ghi đè ở trên, `/jira` còn một cửa chặn nữa — và đây là cửa __duy nhất không thể ép qua__ trong toàn bộ lệnh.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trong kho tài liệu, một story bị đánh dấu __stale__ (lỗi thời) khi __tài liệu gốc sinh ra nó đã thay đổi mà chưa ai đối chiếu lại__. Ví dụ: SRS vừa sửa quy tắc tính phí, nên story mô tả phần đó tự động bị đánh dấu lỗi thời — nội dung trong story có thể đang mô tả sai nghiệp vụ hiện hành.

Hậu quả nếu đẩy lên: __dev đọc Jira và code theo nghiệp vụ đã bị bãi bỏ__ — sai sót đã ra tới người thực thi, không còn là chuyện tài liệu lệch nhau trong nội bộ. Vì thế `/jira --push` __từ chối thẳng__ những story mang dấu stale:

* Không có cờ nào để ép qua, không có lựa chọn "tôi biết rồi, cứ đẩy đi". Đây là điểm khác biệt so với mọi cảnh báo khác trong hệ thống (chỗ khác thường chỉ nhắc rồi vẫn cho đi tiếp).
* Cách gỡ: chạy `/cr` để đối chiếu story với tài liệu gốc đã đổi. Sau khi đối chiếu xong, dấu stale được gỡ, lúc đó mới đẩy được.
* Các story __không__ stale trong cùng lượt vẫn đẩy bình thường — bị chặn là từng story một, không phải chặn cả mẻ.

---

## 7. Kết nối tới Jira bằng cách nào? — "cầu nối" MCP

Hệ thống ở máy bạn (Claude) không tự biết cách "nói chuyện" với Jira. Nó cần một __cầu nối__ — trong thế giới AI gọi là __MCP__ (một chương trình trung gian nhỏ, biết cách gọi đúng "cửa" của Jira, kèm chìa khóa đăng nhập). Bạn cứ hình dung MCP như một __phiên dịch viên__: bạn nói tiếng Việt với AI, AI nói với phiên dịch, phiên dịch mới nói được "tiếng Jira" với máy chủ Jira.

Có __hai kiểu Jira__ ngoài thực tế, và cách kết nối khác nhau:

### Kiểu 1 — Jira Cloud (của Atlassian, tên miền `*.atlassian.net`)

Đây là bản Jira "cho thuê" chạy trên máy chủ của chính hãng Atlassian. Với kiểu này, Atlassian đã có sẵn cầu nối MCP chính thức — bạn chỉ cần đăng nhập một lần là dùng được. Skill `/jira` mặc định nói chuyện với kiểu này.

### Kiểu 2 — Jira tự quản (công ty tự cài, tên miền riêng)

__Rất nhiều công ty KHÔNG dùng bản cho thuê của Atlassian, mà tự cài Jira trên máy chủ của mình__ — ví dụ `jira.congty.com`. Lý do thường là dữ liệu nhạy cảm phải nằm trong nội bộ.

**Với kiểu này, `/jira` hiện CHƯA dùng được.** Cầu nối chính thức của Atlassian chỉ nói chuyện với bản Cloud, và lệnh `/jira` được xây dựng quanh cầu nối đó. Đây là giới hạn thật, không phải chuyện cấu hình lại là xong.

Nếu công ty bạn dùng bản tự quản, hiện có hai lối:

* __Xuất ra file rồi nhập tay__ — khi không kết nối được, `/jira` vẫn tạo một file tổng hợp các story để bạn tự đưa lên Jira (xem Mục 5). Bạn mất phần tự động, nhưng phần soạn nội dung vẫn được lệnh làm hộ.
* __Nhờ đội kỹ thuật mở rộng công cụ__ — về nguyên tắc dựng được một cầu nối riêng cho tên miền công ty, nhưng đó là __việc phát triển thêm__, cần sửa cả phần khai báo của lệnh. Không nằm trong phạm vi bạn tự làm được, và chưa ai làm sẵn.

> __Dù kết nối kiểu nào__, chìa khóa đăng nhập (API key/token) __không bao giờ được ghi vào tài liệu hay sổ liên kết__ — sổ liên kết thường được chia sẻ chung cả nhóm.

---

## 8. Những chuyện thường ngày lệnh này xử lý ra sao

Vài tình huống rất hay gặp, để bạn biết hệ thống phản ứng thế nào:

| Chuyện xảy ra | `/jira` làm gì |
|---|---|
| Đội dev đổi story sang "Done" trên Jira | Kéo trạng thái "Done" về ghi làm thông tin tiến độ — __KHÔNG__ đổi trạng thái duyệt tài liệu của bạn (hai loại trạng thái khác nhau, xem dưới). |
| PO tự thêm điều kiện nghiệm thu (AC) thẳng trên Jira | Phát hiện "chỗ này Jira đã sửa"; nếu bạn cũng sửa → báo đụng nhau, hỏi giữ bên nào / gộp / lập yêu-cầu-thay-đổi. |
| Ai đó bình luận (comment) trên issue | Mang bình luận về một "hộp thư góp ý" riêng (có tên người, ngày, link) — __KHÔNG__ trộn thẳng vào phần nội dung yêu cầu, vì bình luận là ý kiến, chưa phải yêu cầu chính thức. |
| Một story bị tách làm đôi trên Jira | Không tự đoán story mới ứng với cái gì ở máy — __hỏi bạn__ ghép nối, và đề xuất lập yêu-cầu-thay-đổi. |

__Một điểm dễ nhầm đáng nhớ:__ "trạng thái trên Jira" (`In Progress`, `Done`...) __khác__ với "trạng thái duyệt tài liệu của bạn" (`nháp`, `đã duyệt`, `lỗi thời`). Cái đầu nói *dev làm tới đâu rồi*; cái sau nói *tài liệu đã được duyệt chưa*. Vì vậy khi dev đánh dấu `Done`, hệ thống chỉ ghi nhận tiến độ đó, __không__ tự động coi tài liệu của bạn là "đã xong/đã duyệt".

Ngoài ra, mặc định `/jira --push` __không tự bấm chuyển trạng thái__ trên bảng Jira (để bảng công việc của dev không tự nhảy lung tung ngoài ý bạn). Muốn đẩy tiến độ (ví dụ đánh dấu một story đã ship) thì đó là hành động bạn __chủ động yêu cầu riêng__.

---

## 9. Ví dụ thực tế

Anh __Minh__, BA phụ trách tính năng "thanh toán" (`payment`), vừa viết xong 8 user story. Anh muốn đẩy lên Jira cho đội dev.

1. Anh gõ `/jira payment` (chỉ xem trước). Hệ thống báo: cả 8 story đều __chưa có__ trên Jira (đây là lần đầu), đề xuất "đẩy lên tạo mới 8 Story".

2. Anh gõ `/jira payment --push`. Hệ thống hỏi vài thông tin lần đầu (mã dự án trên Jira là `PAY`, cách đưa điều kiện nghiệm thu vào — dạng công việc con), rồi cho anh xem danh sách sẽ đẩy. Anh gật.

3. Hệ thống tạo 8 Story trên Jira (`PAY-45` đến `PAY-52`), rồi __ghi vào sổ liên kết__: `us-001.md = PAY-45`, `us-002.md = PAY-46`... kèm ảnh chụp nội dung lúc này.

4. __Một tuần sau__, anh Minh gõ lại `/jira payment` để xem có gì đổi. Hệ thống báo: story `us-003.md` — *"Bạn không sửa, nhưng bên Jira có người thêm 1 điều kiện nghiệm thu (PO thêm). Đề xuất: kéo về."* Còn `us-005.md` — *"Cả bạn lẫn Jira đều sửa phần mô tả, khác nhau. Đụng nhau — cần hòa giải."*

5. Anh gõ `/jira payment --pull` để lấy điều kiện PO vừa thêm ở `us-003` về. Hệ thống cho anh xem "trước/sau", anh gật, nội dung mới được ghi vào tài liệu.

6. Với `us-005` (đụng nhau), anh gõ `/jira payment --reconcile`. Hệ thống cho anh xem bản của anh và bản trên Jira cạnh nhau, hỏi: giữ bản của anh / lấy bản Jira / gộp / lập yêu-cầu-thay-đổi. Anh chọn "gộp", chỉnh lại cho gọn, xác nhận. Trước khi ghi đè lên Jira, hệ thống kiểm tra lại lần nữa thấy Jira không đổi tiếp — rồi mới ghi.

7. Cuối cùng hệ thống cập nhật lại sổ liên kết (ảnh chụp mới) và in tóm tắt: kéo về 1, hòa giải 1, còn lại vẫn khớp. Anh Minh chưa từng bị mất công sức của ai — kể cả điều kiện PO thêm lẫn phần anh tự sửa đều được giữ đúng.

---

## Xem thêm

* Người anh em của lệnh này là `/confluence` — đồng bộ __tài liệu mô tả__ (không phải công việc) lên Confluence, dùng __chung cuốn sổ liên kết__ với `/jira`. Xem `explain-skills/confluence.md`; giới hạn về kết nối (chỉ hỗ trợ bản Cloud) áp dụng y hệt.
* Muốn xem đầy đủ chi tiết kỹ thuật (từng bước, cách so sánh 3 phía, xử lý lỗi giữa chừng), đọc file gốc: `.claude/skills/jira/SKILL.md` và quy tắc chung `.claude/rules/atlassian-sync.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
