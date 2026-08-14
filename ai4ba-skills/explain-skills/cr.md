---
type: skill-explainer
skill: cr
updated: 2026-07-28
---

# `/cr` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/cr` (viết tắt của "Change Request" — yêu cầu thay đổi) là lệnh bạn gõ khi cần __sửa một điều gì đó trong tài liệu đã có sẵn__, chứ không phải tạo tài liệu mới từ đầu.

Vài tình huống điển hình nên dùng `/cr`:

- Bạn muốn thêm 1 yêu cầu mới vào bản SRS đã được duyệt (approved) — ví dụ "thêm cho user đăng nhập bằng Apple ID".
- Một quyết định cũ đã lỗi thời, cần sửa lại nhiều nơi cùng lúc (URD, PRD, màn hình wireframe...).
- Một story đã đẩy lên Jira rồi nhưng nghiệp vụ đổi, cần chỉnh lại.
- Tài liệu bị đánh dấu "stale" (lỗi thời so với tài liệu gốc) và cần đối chiếu lại cho khớp. Muốn biết nó stale __vì tài liệu gốc nào đổi__, tra bảng `docs/_shared/staleness.md` — lý do chỉ ghi ở đó, không ghi trong tài liệu (giải thích ở `explain-skills/changelog-staleness.md`).

Nói ngắn gọn: __bất cứ khi nào bạn sửa vào phần "đã xong" thay vì phần "đang nháp"__, `/cr` là lệnh an toàn nhất vì nó luôn bắt bạn xem trước "sửa cái này sẽ ảnh hưởng tới bao nhiêu chỗ khác" — trước khi động vào bất kỳ file nào.

Gõ lệnh đơn giản như:

```
/cr "thêm đăng nhập bằng Apple ID vào tính năng authentication"
```

Hệ thống sẽ tự tìm ra bạn đang nói về feature (tính năng) nào, không cần bạn chỉ rõ đường dẫn file.

---

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quan trọng nhất cần nhớ: **`/cr` luôn dừng lại và chờ bạn xác nhận trước khi sửa bất kỳ file nào.** Nó không bao giờ tự ý "tiện thể sửa luôn cho nhanh".

```
 BẠN GÕ LỆNH
 /cr "mo ta thay doi can lam"
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Tìm đúng tính năng (feature)            │
 │  Hệ thống đọc mô tả của bạn, dò trong các thư mục     │
 │  tài liệu để đoán bạn đang nói về tính năng nào.      │
 │  Nếu không chắc → hỏi lại bạn chọn.                   │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1.5 — Bạn đã nói đủ ý chưa?                 │
 │  Hệ thống soi lại mô tả của bạn theo 4 câu tối thiểu: │
 │  đổi cái gì · từ gì sang gì · vì sao · ranh giới nào. │
 │  Thiếu ý nào mà tài liệu cũng không trả lời được      │
 │  → HỎI BẠN GỌN 1 LƯỢT, rồi mới phân tích.             │
 │  (Vì sao hỏi ngay từ đây — xem Mục 3)                 │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Phân tích ảnh hưởng                     │
 │  Hệ thống đọc HẾT tài liệu của tính năng đó, rồi nhờ  │
 │  2 "trợ lý chuyên trách" (xem bảng bên dưới) rà soát  │
 │  xem sửa chỗ này sẽ kéo theo ảnh hưởng ở đâu.         │
 │  Gặp chỗ mơ hồ, không tự đoán → HỎI BẠN ngay tại đây. │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Viết báo cáo tác động ra file            │
 │  Hệ thống GHI RA FILE một bản báo cáo: "nếu làm theo  │
 │  yêu cầu này, sẽ có N tài liệu bị đổi, cụ thể là..."  │
 │  Tài liệu THẬT (URD/SRS/wireframe...) CHƯA BỊ ĐỘNG    │
 │  TỚI — chỉ có báo cáo được ghi ra.                    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
   ┌────────────────────────────────────────────────────┐
   │  ██████████████  HARD STOP  ██████████████         │
   │                                                      │
   │  HỆ THỐNG DỪNG HẲN Ở ĐÂY.                           │
   │  Không tự làm tiếp bất kể chuyện gì xảy ra.         │
   │                                                      │
   │  Bạn cần: đọc kỹ báo cáo vừa ghi ra, rồi gõ:        │
   │      "apply"   → đồng ý, cho làm tiếp               │
   │      "cancel"  → huỷ, giữ báo cáo lại làm hồ sơ      │
   └────────────────────────────────────────────────────┘
        │
        │  (chỉ đi tiếp khi bạn gõ "apply")
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3.5 — Tài liệu có đổi từ lúc viết báo cáo?   │
 │  Hệ thống so nội dung hiện tại của từng file với       │
 │  "dấu vân tay" đã ghi lúc viết báo cáo (Giai đoạn 3).  │
 │  Có ai sửa xen vào giữa chừng → DỪNG, hỏi bạn chọn:    │
 │  phân tích lại / làm tiếp chấp nhận rủi ro / huỷ.      │
 │  (Vì phân tích cũ có thể đã sai — xem Mục 6)           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Sửa từng file, từng cái một              │
 │  Với MỖI file bị ảnh hưởng, hệ thống:                  │
 │   1. Soạn sẵn nội dung sẽ sửa                          │
 │   2. Cho bạn xem "trước / sau" (giống bản nháp Word    │
 │      bật chế độ theo dõi thay đổi — track changes)     │
 │   3. Chờ bạn gật đầu (Y) rồi MỚI thật sự ghi vào file  │
 │  Bạn có thể đồng ý từng file, từ chối 1 file, hoặc      │
 │  yêu cầu sửa lại cách viết trước khi ghi.               │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4.5 — Đối chiếu lại: đã sửa ĐỦ chưa?         │
 │  Trước khi coi là "xong", hệ thống tự đếm lại:         │
 │  danh sách file CẦN sửa (từ báo cáo Giai đoạn 3) có    │
 │  khớp 100% với danh sách file ĐÃ sửa xong không.       │
 │  Thiếu file nào → tự quay lại sửa nốt file đó, KHÔNG   │
 │  được đánh dấu "hoàn tất" khi còn sót.                 │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Kiểm tra lại + báo cáo hoàn tất          │
 │  - Quét lại toàn bộ tài liệu tính năng xem còn thiếu   │
 │    liên kết / còn sót gì không                         │
 │  - Liệt kê những thứ "phái sinh" cần vẽ/refresh lại    │
 │    (ví dụ: hình Figma, file preview, bản PDF xuất ra)  │
 │  - In tóm tắt: đã sửa file nào, ghi log ở đâu           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có hồ sơ đầy đủ để tra cứu lại sau này
     (muốn đóng hồ sơ hẳn, xem Mục 9 — /cr close cũng tự
     kiểm tra lại phần "phái sinh" trước khi cho đóng)
```

---

## 3. Vì sao hệ thống hỏi lại ngay từ đầu, trước khi phân tích (Giai đoạn 1.5)?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Một yêu cầu thay đổi viết vội thường thiếu ý. Ví dụ bạn gõ:

```
/cr "tăng số lần nhập sai mật khẩu lên 10"
```

Nghe thì rõ, nhưng thật ra còn thiếu: __10 lần trong bao lâu__ (10 lần liên tiếp, hay 10 lần trong 1 giờ)? __Đang là mấy__ (nếu tài liệu ghi 5 thì đối chiếu được, nhưng nếu tài liệu ghi khác thì có thể bạn đang nhớ nhầm)? __Áp cho ai__ (mọi tài khoản, hay chỉ tài khoản thường còn tài khoản quản trị vẫn giữ nguyên)? Và __vì sao đổi__ (khách phàn nàn bị khoá oan, hay đội bảo mật yêu cầu) — điều này quyết định hệ thống xếp thay đổi vào loại "nhỏ" hay "cần thận trọng".

Nếu không hỏi, hệ thống sẽ phải tự đoán những chỗ trống đó — và bản báo cáo tác động viết ra sẽ dựa trên phỏng đoán, tức là không đáng tin.

Vì vậy `/cr` soi mô tả của bạn theo __4 câu tối thiểu__:

| Câu hỏi | Vì sao cần |
|---|---|
| __Đổi cái gì__ | Để biết chính xác con số/quy tắc/câu chữ nào bị đụng, thay vì mò cả tính năng |
| __Từ gì sang gì__ | Thiếu vế "hiện đang là gì" thì hệ thống không đối chiếu được với tài liệu, không biết bạn nhớ đúng hay nhớ nhầm |
| __Vì sao__ | Nguồn yêu cầu (họp / khách hàng / quy định pháp lý / lỗi) quyết định mức độ nghiêm trọng |
| __Ranh giới__ | Áp cho ai, từ khi nào, có trường hợp ngoại lệ nào không |

Ba nguyên tắc khi hỏi, để việc này không thành phiền phức:

- __Hỏi gọn 1 lượt__, không hỏi lắt nhắt từng câu một.
- __Không hỏi lại điều bạn đã nói__, và cũng không hỏi điều tài liệu đã trả lời được (hệ thống tự đọc lấy).
- __Chỉ hỏi điều thật sự chặn việc phân tích.__ Chi tiết nhỏ không ảnh hưởng thì bỏ qua — `/cr` là lệnh sửa tài liệu, không phải buổi phỏng vấn.

Nếu bạn cũng chưa biết câu trả lời (rất bình thường — có thể phải hỏi lại PM hoặc khách hàng), hệ thống __không ép__: nó ghi thẳng chỗ chưa rõ đó vào mục "Câu hỏi mở" trong hồ sơ và hạ mức tự tin của phần đánh giá tác động, để người đọc báo cáo biết chỗ nào còn treo. Điều nó __không__ được phép làm là tự bịa ra một con số rồi viết như thể đã chốt.

> __Vì sao hỏi ở đây mà không đợi lát nữa?__ Bản thân hệ thống vẫn có một lượt hỏi nữa ở Giai đoạn 2 — nhưng lượt đó dành cho loại mơ hồ khác: mơ hồ __do tài liệu__ (hai file đang nói khác nhau, hoặc có nhiều cách làm cùng hợp lý) — thứ chỉ lộ ra sau khi đọc xong tài liệu. Còn mơ hồ __do mô tả của bạn__ thì phát hiện được ngay từ đầu. Đẩy nó xuống cuối nghĩa là hệ thống phải đọc hết tài liệu, huy động cả 2 trợ lý phân tích (Mục 7), rồi mới quay ra hỏi bạn một câu lẽ ra hỏi được từ giây đầu tiên — tốn công vô ích cho cả hai bên.

---

## 4. Vì sao phải có bước "DỪNG LẠI" (HARD STOP)?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là phần thiết kế quan trọng nhất của `/cr`, nên xứng đáng giải thích kỹ.

Hãy tưởng tượng bạn nhờ ai đó "sửa giúp tôi 1 câu trong hợp đồng". Nếu người đó tự ý sửa luôn cả hợp đồng, ký thay bạn, gửi cho đối tác — mà không cho bạn xem bản sửa trước, bạn sẽ rất lo lắng, đúng không? Ngay cả khi họ sửa đúng ý bạn 90% các lần, chỉ cần 1 lần sửa sai hoặc hiểu nhầm ý, hậu quả có thể rất khó sửa lại (đối tác đã đọc bản sai, dev đã code theo bản sai...).

`/cr` áp dụng đúng logic đó: **trước khi hệ thống viết được 1 chữ nào vào tài liệu chính thức, nó bắt buộc phải dừng lại, đưa cho bạn xem toàn bộ "sẽ đổi cái gì, ở đâu, ảnh hưởng gì" — và CHỜ bạn tự tay gõ chữ `apply` để xác nhận.**

Có 2 lý do cụ thể:

1. __Thay đổi nhỏ vẫn có thể lan rộng.__ Một câu chữ tưởng chừng đơn giản trong SRS có thể kéo theo phải sửa lại wireframe, user story, thậm chí story đã đẩy lên Jira rồi. Nếu hệ thống tự động sửa hết mà không hỏi, bạn sẽ không biết được "vừa rồi có bao nhiêu chỗ bị đổi" cho tới khi phát hiện ra hậu quả (ví dụ dev đã code theo tài liệu sai).

2. __Từng có bài học thực tế.__ Hệ thống này từng gặp lỗi khi được gọi ở chế độ "chạy nền, không ai ngồi chờ trả lời" — lúc đó nó đã tự quyết định luôn là "không ai trả lời thì chắc là đồng ý" rồi tự động sửa hết mọi tài liệu. Đó là một lỗi nghiêm trọng vì không ai xác nhận thật sự đồng ý với các thay đổi đó. Từ bài học này, `/cr` được thiết kế lại với nguyên tắc cứng: __dù trong bất kỳ hoàn cảnh nào — kể cả khi không có ai để hỏi — hệ thống vẫn phải DỪNG chứ tuyệt đối không được tự suy diễn là "chắc đồng ý rồi".__

Nói cách khác: thà hỏi thừa 1 câu, còn hơn tự ý làm rồi phải dọn dẹp hậu quả.

---

## 5. Vì sao phải "đối chiếu lại" sau khi sửa xong (Giai đoạn 4.5)?

Đây là phần được bổ sung sau khi phát hiện một rủi ro thực tế: khi 1 thay đổi kéo theo sửa rất nhiều file (ví dụ 18 file cùng lúc), AI có thể __sửa xong 16/18 file rồi vô tình bỏ sót 2 file cuối__ — do lỗi công cụ, do bị ngắt giữa chừng, hoặc đơn giản là quên. Nếu không ai đối chiếu lại, hồ sơ vẫn được đóng dấu "đã hoàn tất" trong khi thực tế còn thiếu — và người phát hiện ra sẽ là ai đó đọc tài liệu sau này, thấy 2 chỗ nói khác nhau về cùng 1 điều.

Đây là lỗi khá phổ biến của AI khi phải xử lý một danh sách dài việc giống nhau: nó có xu hướng "báo cáo đã làm xong" ngay khi chạy hết lượt, chứ không tự hỏi lại "mình có thực sự làm đủ số lượng đã hứa không". Giống như một nhân viên nhận việc "gửi 18 email", gửi xong một lượt rồi báo "xong rồi anh" — mà không đếm lại xem có đúng 18 email đã gửi hay chỉ 16.

Vì vậy `/cr` có thêm một bước tự-kiểm tra bắt buộc: trước khi được phép đóng dấu "đã hoàn tất" cho 1 yêu cầu thay đổi, nó phải __đếm lại danh sách file cần sửa (đã liệt kê từ báo cáo Giai đoạn 3) và đối chiếu với danh sách file đã thực sự sửa xong__. Nếu thiếu, nó tự quay lại làm nốt — không hỏi bạn có muốn tiếp tục hay không, vì đây chỉ là hoàn tất đúng phần việc bạn đã đồng ý ở bước `apply`, không phải một quyết định mới cần xin phép lại.

---

## 6. Vì sao phải kiểm "tài liệu có đổi từ lúc viết báo cáo không" (Giai đoạn 3.5)?

Từ lúc `/cr` viết xong báo cáo đến lúc bạn gõ `apply` có thể trôi qua vài phút, mà cũng có thể vài ngày — đủ để ai đó (hoặc chính bạn ở phiên khác) sửa tài liệu. Vấn đề: toàn bộ phân tích tác động được tính trên __nội dung tại thời điểm phân tích__. Nội dung đổi rồi thì phân tích có thể sai hoàn toàn — đoạn định sửa không còn ở đó, hoặc ai đó đã sửa theo hướng khác.

Vì thế, ngay khi bạn gõ `apply`, hệ thống làm một việc trước tiên: lúc viết báo cáo nó đã ghi lại một __"dấu vân tay" nội dung__ cho mỗi file (một mã ngắn đại diện cho nội dung file tại thời điểm đó — nội dung đổi dù chỉ một ký tự thì mã cũng đổi theo). Giờ nó tính lại dấu vân tay hiện tại và so với bản đã ghi:

- __Khớp hết__ → yên tâm, tài liệu còn nguyên như lúc phân tích, đi tiếp bình thường.
- __Lệch bất kỳ file nào__ (kể cả file đã bị xoá) → __dừng hẳn__, in danh sách file đã đổi và hỏi bạn chọn: phân tích lại (`re-assess`), làm tiếp và ghi nhận rủi ro (`apply-anyway`), hay huỷ (`cancel`). Hệ thống __không tự chọn__, vì nó không biết thay đổi xen vào kia là vô hại hay phá vỡ toàn bộ phân tích.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
- __Hồ sơ cũ không có dấu vân tay__ → hệ thống nói thẳng "không kiểm được", rồi vẫn hỏi bạn 3 lựa chọn trên. Nó không im lặng cho qua.

Điểm chung với Mục 5: cả hai đều là cơ chế __kiểm tra bằng bằng chứng thay vì bằng trí nhớ__. Mục 5 chống "sót file"; mục này chống "phân tích đã lỗi thời". Cả hai cùng phục vụ một nguyên tắc: hệ thống không được phép sửa tài liệu dựa trên giả định.

---

## 7. Ai tham gia "soát" trước khi báo cáo được viết ra?

Trước khi viết báo cáo tác động, hệ thống nhờ 2 "trợ lý chuyên trách" (bạn có thể hình dung như 2 đồng nghiệp có chuyên môn khác nhau, được mời vào cùng xem xét yêu cầu thay đổi) đọc và cho ý kiến độc lập:

| Tên trợ lý | Việc trợ lý đó làm | Tại sao cần trợ lý này |
|---|---|---|
| __@change-tracker__ (Người theo dõi thay đổi) | Đọc toàn bộ chuỗi tài liệu của tính năng (từ BRD → PRD → SRS → Use Case → User Story → AC → Jira → bản xuất PDF/Export) rồi trả lời: "nếu làm theo yêu cầu này, những tài liệu nào cần đổi theo, tài liệu nào KHÔNG cần đụng tới, và nên sửa file nào trước file nào". | Một tính năng thường có rất nhiều tài liệu liên kết với nhau. Nếu không có ai rà soát toàn bộ chuỗi, rất dễ __sửa 1 chỗ mà quên mất 3 chỗ khác cũng đang nói về cùng 1 điều__ — dẫn tới tài liệu mâu thuẫn nhau (ví dụ URD ghi "ưu tiên cao" nhưng PRD vẫn ghi "ưu tiên thấp"). Trợ lý này giống như người giữ sổ cái, đảm bảo không quên chỗ nào. |
| __@gap-analyst__ (Người rà soát lỗ hổng liên kết) | Kiểm tra xem sau khi đổi, có yêu cầu nào bị "mồ côi" không — tức là có nhắc tới nhưng không còn ai theo dõi/thực hiện; có mã lỗi, có liên kết nào trỏ tới chỗ đã xoá/đổi tên mà quên cập nhật không; có tài liệu nào đang bị đánh dấu "lỗi thời" quá lâu chưa ai xử lý không. | Đây là việc "dọn dẹp mạng lưới liên kết" — tài liệu trong hệ thống này liên kết chằng chịt với nhau qua các mã số (như FR-001, US-002...). Nếu sửa 1 chỗ mà làm đứt liên kết ở chỗ khác thì về sau rất khó truy ngược lại "cái này áp dụng cho ai, ai chịu trách nhiệm". Trợ lý này đảm bảo mạng lưới liên kết vẫn toàn vẹn sau khi sửa. |

Hai trợ lý này làm việc song song (cùng lúc, không chờ nhau) để tiết kiệm thời gian, rồi ý kiến của cả hai được gộp lại thành 1 bản báo cáo duy nhất cho bạn đọc.

---

## 8. Thay đổi "nhỏ" và thay đổi "cần thận trọng" khác nhau thế nào?

`/cr` không đối xử với mọi thay đổi như nhau. Nó tự đánh giá mức độ rồi quyết định viết báo cáo chi tiết tới đâu (nhưng dù mức nào cũng vẫn phải qua bước DỪNG LẠI ở trên — không có ngoại lệ "nhỏ nên bỏ qua bước xác nhận").

__Thay đổi nhỏ (gọi là "direct-edit-ok"):__
Là khi toàn bộ tài liệu bị ảnh hưởng vẫn đang ở dạng __nháp__ (chưa ai duyệt), và __chưa có story nào liên quan đã đẩy lên Jira__ để dev đang làm theo. Ví dụ: bạn đang viết nháp URD cho 1 tính năng hoàn toàn mới, chưa ai review, và bạn muốn chỉnh lại 1 câu mô tả. Trường hợp này hệ thống viết báo cáo gọn — chỉ tóm tắt "sẽ đổi gì" là đủ, không cần phân tích sâu.

__Thay đổi cần thận trọng (gọi là "cr-needed"):__
Là khi có __ít nhất 1 trong các điều kiện sau__ xảy ra:
- Có tài liệu đã ở trạng thái "đang review", "đã duyệt (approved)" hoặc "đã lên production (shipped)" — tức là đã có người khác đọc/dựa vào bản đó rồi.
- Có story đã đẩy lên Jira — nghĩa là dev có thể đã bắt đầu code theo bản cũ.
- Mức độ nghiêm trọng cao (ví dụ liên quan tới bảo mật, tiền bạc, pháp lý).
- Thay đổi này kéo theo một chuỗi ảnh hưởng dây chuyền quá dài (nhiều hơn 2 tầng tài liệu bị kéo theo).

Trường hợp này, hệ thống viết báo cáo __đầy đủ hơn nhiều__ — vẫn là __một hồ sơ duy nhất__, nhưng phần "Tác động chi tiết" bên trong được điền kín (do 2 trợ lý ở Mục 7 phân tích) để bạn thấy rõ toàn bộ hệ quả trước khi quyết định. Điều khác nhau giữa "nhỏ" và "cần thận trọng" là __độ sâu của các phần bên trong cùng một file__, không phải số lượng file được tạo ra.

Ví dụ dễ hình dung: sửa lỗi chính tả trong 1 bản nháp chưa ai xem là "nhỏ". Đổi lại logic tính giá trong 1 tài liệu đã duyệt và đã có story trên Jira là "cần thận trọng".

---

## 9. "Đóng hồ sơ" (`/cr close`) — vì sao có thể bị từ chối?

Sau khi sửa xong tài liệu, hệ thống thường liệt kê thêm những thứ "phái sinh" cần làm mới lại cho khớp — ví dụ file dữ liệu cho bảng checklist test, bản preview HTML, bản prototype có thể click thử. Đây là những file KHÔNG phải tài liệu gốc, mà được "vẽ lại" tự động từ tài liệu gốc mỗi khi bạn chạy đúng lệnh (ví dụ `/preview`, `/test-checklist`).

Vấn đề thực tế từng xảy ra: sau khi sửa xong tài liệu gốc, hệ thống có nhắc "nên làm mới lại 3 thứ này", nhưng vì không bắt buộc làm ngay, việc đó bị quên — dẫn tới tài liệu gốc đã đúng nhưng các bản xem trước vẫn hiển thị nội dung cũ, gây hiểu nhầm cho người đọc sau này.

Để tránh lặp lại, khi bạn gõ lệnh đóng hồ sơ hẳn (`/cr close`), hệ thống sẽ __tự kiểm tra xem những thứ "phái sinh" đó đã được làm mới chưa__:

- Nếu còn thứ nào chưa làm → hệ thống __từ chối đóng hồ sơ__, hỏi lại bạn: muốn làm luôn bây giờ, hay đóng hồ sơ nhưng ghi rõ lại là "còn thiếu, cố ý bỏ qua", hay thôi chưa đóng vội.
- Ngoài ra, nếu một hồ sơ đã sửa xong tài liệu gốc hơn 7 ngày mà vẫn còn phần phái sinh chưa làm, bảng theo dõi `/dashboard` (bạn có thể gõ bất cứ lúc nào để xem "giờ tôi cần làm gì") cũng sẽ tự nhắc lại việc này ở mục Action items, phòng trường hợp bạn quên hẳn không quay lại đóng hồ sơ.

Cách này đảm bảo "còn thiếu việc" không bao giờ bị lãng quên hoàn toàn — chỉ là chọn làm ngay hay làm sau, nhưng luôn có ai đó (hệ thống) nhắc lại.

---

## 10. Ví dụ thực tế

Chị __Lan__, một BA đang phụ trách tính năng "authentication" (đăng nhập), nhận được yêu cầu từ Product Manager: *"Thêm cho user đăng nhập bằng Apple ID luôn nhé, SRS đã duyệt rồi nhưng bổ sung thêm được không?"*

Chị Lan mở terminal, gõ:

```
/cr "thêm phương thức đăng nhập bằng Apple ID vào tính năng authentication, tương tự Google đã có"
```

1. Hệ thống nhận ra ngay đây là tính năng `authentication` (vì chị Lan nhắc rõ tên và trong vault cũng chỉ có 1 tính năng khớp) — không cần hỏi lại.

2. Trước khi đọc tài liệu, hệ thống soi lại mô tả theo 4 câu tối thiểu (Mục 3). *Đổi cái gì* — rõ (thêm 1 phương thức đăng nhập). *Vì sao* — rõ (PM yêu cầu). Nhưng *ranh giới* thì chưa: Apple ID áp cho cả app iOS lẫn web, hay chỉ iOS? Người đã có tài khoản bằng email trùng Apple ID thì gộp làm một hay tạo tài khoản riêng? Hệ thống hỏi gọn 1 lượt. Chị Lan trả lời câu đầu (cả hai nền tảng), còn câu thứ hai chị chưa rõ vì phải hỏi lại PM — hệ thống __không ép__, ghi câu đó vào mục "Câu hỏi mở" của hồ sơ rồi đi tiếp.

3. Hệ thống đọc toàn bộ tài liệu của `authentication`: URD, SRS, các màn hình wireframe, user story... rồi nhờ __@change-tracker__ và __@gap-analyst__ cùng rà soát. Hai trợ lý phát hiện: SRS đã ở trạng thái "approved", có 1 user story liên quan đã đẩy lên Jira (mã PROJ-42), và màn hình login cần thêm 1 nút bấm mới.

4. Vì SRS đã duyệt + đã có story trên Jira, hệ thống xếp đây là __thay đổi cần thận trọng__ (cr-needed). Nó viết ra __đúng 1 file hồ sơ__ — `docs/cr/CR-20260708-001.md` — trong đó đã gộp sẵn cả bảng tác động, phần tác động chi tiết và phương án quay lui. File này liệt kê rõ: sẽ sửa SRS (thêm 1 yêu cầu mới), sửa màn hình login (thêm nút "Sign in with Apple"), và cần lưu ý story PROJ-42 trên Jira có thể cần cập nhật theo. Phần "Câu hỏi mở" ghi lại chỗ chị Lan còn treo ở bước 2 (gộp tài khoản trùng email). Kèm theo, mỗi file sắp bị sửa được ghi lại một __"dấu vân tay" nội dung tại thời điểm này__ (xem bước 7).

5. Ngay sau đó, hệ thống __dừng hẳn lại__ và nhắn chị Lan: *"Đã tạo báo cáo, chưa đụng gì vào tài liệu thật. Đọc kỹ file trên, khi sẵn sàng gõ `apply`."*

6. Chị Lan đọc báo cáo, thấy hợp lý, gõ `apply`.

7. Hệ thống đối chiếu lại "dấu vân tay" đã ghi lúc viết báo cáo (cơ chế xem Mục 6) — tài liệu còn nguyên, nên đi tiếp bình thường.

8. Hệ thống bắt đầu sửa từng file một: đầu tiên là SRS — cho chị Lan xem đoạn "trước/sau", chị Lan gõ `Y`, hệ thống mới thật sự ghi vào file. Tiếp theo là màn hình login — tương tự, xem trước rồi mới ghi.

9. Sửa xong lượt cuối, hệ thống tự đếm lại: báo cáo ban đầu nói có 2 file cần sửa (SRS + màn hình login), và cả 2 đều đã ghi xong — khớp. Nếu lúc đó có 1 file bị lỗi giữa chừng và chưa kịp sửa, hệ thống sẽ tự quay lại sửa nốt file đó trước khi báo "xong", chứ không dừng nửa chừng rồi báo hoàn tất.

10. Hệ thống tự kiểm tra lại toàn bộ liên kết trong tính năng, báo cho chị Lan biết: "Nên vẽ lại hình Figma cho màn login và làm mới bản preview HTML vì nội dung đã đổi." Chị Lan bận việc khác nên chọn "để sau" — hệ thống vẫn ghi lại việc này vào hồ sơ, không ép làm ngay.

11. Vài ngày sau, chị Lan gõ `/cr close CR-20260708-001` định đóng hồ sơ cho gọn. Hệ thống phát hiện phần "làm mới hình Figma + bản preview" ở bước 10 vẫn chưa ai làm, nên từ chối đóng luôn — hỏi lại chị Lan muốn làm ngay bây giờ, hay đóng hồ sơ nhưng ghi rõ "cố ý bỏ qua phần này". Chị Lan chọn làm ngay, hệ thống chạy xong rồi mới cho đóng hồ sơ.

12. Cuối cùng, hệ thống in ra một bảng tóm tắt: đã ghi log thay đổi vào những file nào, còn gợi ý chị Lan nên chạy lại `/srs authentication` để bản đặc tả vừa sửa được soát lại một lượt (hoặc nhờ người duyệt đọc lại), và nên cập nhật story PROJ-42 trên Jira cho khớp.

Toàn bộ quá trình, chị Lan chưa từng bị bất ngờ — mọi thứ đều được xem trước khi xảy ra, và không có việc nào bị âm thầm bỏ sót mà không ai hay biết.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (từng bước 1-21, format lệnh, các trường hợp đặc biệt), đọc file gốc: `.claude/skills/cr/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
