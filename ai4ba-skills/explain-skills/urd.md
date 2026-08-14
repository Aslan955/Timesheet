---
type: skill-explainer
skill: urd
updated: 2026-08-01
---

# `/urd` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/urd` là viết tắt của **User Requirements Document** (tài liệu yêu cầu người dùng). Đây là lệnh dùng để làm rõ, cho **một tính năng**, người dùng đang gặp vấn đề gì, họ là ai, họ cần đạt kết quả gì và thế nào thì coi là thành công.

Nó không thiết kế màn hình, không mô tả cách lập trình, cũng không tính lợi nhuận. Trọng tâm duy nhất là: **người dùng cần gì trong bối cảnh thực tế của họ**.

Bạn nên dùng `/urd` khi:

* Đã chọn một tính năng và cần hiểu kỹ người dùng trước khi bàn đến giải pháp.
* Có ghi chú brainstorm (buổi trao đổi ý tưởng), nhưng các nhu cầu còn rời rạc.
* Muốn tách rõ điều người dùng thật sự cần khỏi ý tưởng về màn hình, nút bấm hay công nghệ.
* Cần một tài liệu chung để BA, PM và UX cùng xác nhận trước khi làm BRD, PRD cho tính năng hoặc SRS.

Ví dụ:

```text
/urd bai-hoc-5-phut
```

Hoặc gõ trơn:

```text
/urd
```

Khi đó hệ thống liệt kê các tính năng đang có để bạn chọn.

Kết quả là một file:

```text
docs/{feature}/{feature}-urd.md
```

File này ghi lại chuỗi logic hoàn chỉnh:

```text
Vấn đề người dùng
        ↓
Nhu cầu người dùng
        ↓
Hành trình để đạt nhu cầu đó
        ↓
Tình huống bất thường cần xử lý cho người dùng
        ↓
Kết quả đo được để biết họ đã thành công
```

***

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm cần nhớ: `/urd` **đọc những gì đã có trước**, chỉ hỏi phần còn thiếu, rồi luôn cho bạn xem trước trước khi tạo file. Nếu file URD đã tồn tại, nó chuyển sang chế độ cập nhật và cho xem phần trước/sau trước khi sửa.

```text
 BẠN GÕ LỆNH
 /urd bai-hoc-5-phut
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Xác định tính năng                       │
 │  Gõ tên tính năng thì dùng ngay.                       │
 │  Gõ /urd không tên thì hệ thống đưa danh sách để chọn. │
 │  Tên lạ hoặc chưa có thì hỏi lại: tính năng mới hay    │
 │  chỉ là gõ nhầm.                                       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Đọc tài liệu đang có và chọn nguồn       │
 │  Nếu URD cũ đã có, hệ thống đọc TOÀN BỘ trước.         │
 │  Nó tìm các ghi chú brainstorm liên quan, liệt kê để   │
 │  bạn chọn dùng, bỏ qua hoặc đưa nguồn khác vào.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Rà phần đã biết và phần còn thiếu        │
 │  Hệ thống đối chiếu: vấn đề, nhóm người dùng, nhu cầu, │
 │  hành trình, ngoại lệ, giả định và cách đo thành công. │
 │  Chỉ hỏi 3–8 câu quan trọng còn thiếu hoặc mâu thuẫn.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Soạn bản URD                              │
 │  Viết đúng góc nhìn người dùng: họ gặp gì, cần gì,     │
 │  đi qua những bước lớn nào và kết quả nào có ích.      │
 │  Loại bỏ nội dung lạc tầng như ROI, P0/P1/P2, API, DB  │
 │  hay chi tiết màn hình.                                │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Xem trước rồi mới ghi (L1)                │
 │  Hệ thống tóm tắt bằng lời: có bao nhiêu nhóm người    │
 │  dùng, nhu cầu, hành trình, ngoại lệ, giả định, tiêu   │
 │  chí thành công và câu hỏi mở.                         │
 │  Bạn gõ Y để đồng ý, hoặc n để dừng/chỉnh lại.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 6 — Ghi mới hoặc cập nhật                     │
 │  File mới: chỉ ghi sau khi bạn đồng ý ở L1.            │
 │  File cũ: cho xem phần trước/sau (L2 diff — bản so     │
 │  sánh thay đổi) trước khi sửa, và giữ các nội dung bạn │
 │  đã tự viết nếu không liên quan.                       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 7 — Xử lý câu hỏi mở                          │
 │  Hệ thống hỏi bạn muốn giải quyết câu hỏi nào ngay,    │
 │  bỏ qua, hay chỉ chọn vài câu. Mọi lần sửa tiếp đều    │
 │  được cho xem trước/sau.                               │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 8 — Tự rà soát và tự sửa                      │
 │  @senior-ba và @po-reviewer đọc lại bản URD.           │
 │  Những sửa chữa hợp lý được áp dụng luôn. Nếu phải     │
 │  chọn thay bạn ở chỗ chưa chốt, hệ thống chọn phương   │
 │  án ít rủi ro hơn và đánh dấu 🔶 để bạn xem lại.       │
 │  Muốn bỏ bước này, nói: "khỏi review".                 │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có URD tập trung vào người dùng
     và gợi ý bước tiếp: /brd, /prd-epic
```

***

## 3. Vì sao nó đọc trước và chỉ hỏi phần còn thiếu?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Một feature thường đã có thông tin nằm ở nhiều nơi: ghi chú brainstorm, URD cũ hoặc nội dung bạn vừa dán vào cuộc trò chuyện. Nếu hỏi lại toàn bộ từ đầu, người trả lời rất dễ mệt, trả lời lệch với tài liệu cũ hoặc bỏ sót điều đã thống nhất.

Vì vậy `/urd` đọc đầy đủ các nguồn bạn đã chọn rồi tự kiểm tra nội bộ xem mỗi phần đã:

* **Đã biết**: có thông tin rõ ràng.
* **Có thể suy ra**: có căn cứ để suy luận thận trọng.
* **Còn thiếu**: chưa đủ dữ liệu để viết.
* **Mâu thuẫn**: các nguồn đang nói khác nhau.

Nó chỉ hỏi các điểm còn thiếu hoặc mâu thuẫn có ảnh hưởng lớn. Một lượt thường có từ 3 đến 8 câu đánh số để bạn dễ trả lời.

Ví dụ, ghi chú brainstorm đã nói: “Người đi làm bận rộn muốn luyện nói tiếng Anh mỗi ngày nhưng thường bỏ dở vì bài quá dài.” `/urd` không nên hỏi lại câu đó. Thay vào đó, nó có thể hỏi:

1) Ai là người dùng chính: người mới đi làm, quản lý, hay tất cả?
2) Khi bỏ dở bài học, họ cần nhìn thấy kết quả gì để biết nên làm gì tiếp?
3) Hiện có số liệu nào về tỷ lệ hoàn thành bài học không?

Thiếu brainstorm hoặc nguồn ban đầu không làm lệnh bị chặn. Hệ thống chỉ cảnh báo rằng dữ liệu đầu vào còn ít, rồi hỏi các dữ kiện URD cần thiết để vẫn có thể bắt đầu.

### Một nguồn nữa: hồ sơ dự án‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Ngoài các nguồn thuộc riêng tính năng ở trên, `/urd` còn đọc **hồ sơ dự án** (`docs/_shared/project-profile.md`) — nơi lưu những câu chỉ cần trả lời **một lần cho cả dự án**: người dùng cuối được gọi là gì (học viên / khách hàng / tài xế / bệnh nhân...), các nhóm người dùng chung của sản phẩm, và quy định pháp lý phải tuân.

Cách gọi người dùng đặc biệt quan trọng với `/urd`, vì nó xuất hiện dày đặc trong tài liệu này — persona, nhu cầu, hành trình đều nói về "người dùng". Hồ sơ ghi "học viên" thì URD viết "học viên" xuyên suốt, thay vì lúc gọi thế này lúc gọi thế khác.

Cơ chế vẫn là bốn bước quen thuộc: đọc hồ sơ trước → thiếu thì hỏi → xin phép ghi lại (bạn duyệt) → các lệnh sau dùng chung, không hỏi lại.

Lưu ý ranh giới: hồ sơ chỉ giữ thông tin **cấp dự án**. Còn **persona riêng của từng tính năng** (ai dùng tính năng này, họ cần gì ở đây) thì `/urd` vẫn hỏi bình thường — đó mới là nội dung chính của URD, không thể lấy sẵn từ hồ sơ.

***

## 4. Đừng nhầm “nhu cầu” với “hành trình”

Đây là hai khái niệm gần nhau nhưng khác vai trò.

**User need** (nhu cầu người dùng) là **kết quả người dùng cần đạt**. Nó trả lời: *“Người này cần điều gì để giải quyết vấn đề?”*

**Journey** (hành trình người dùng) là **bối cảnh và các bước lớn** người dùng đi qua để đạt kết quả đó. Nó trả lời: *“Từ lúc nào, vì điều gì, họ làm những gì để tới kết quả?”*

Ví dụ với app học tiếng Anh:

| Nội dung | Ví dụ |
|---|---|
| Nhu cầu người dùng | Người đi làm cần hoàn thành một bài luyện nói ngắn trong thời gian nghỉ ít ỏi, để duy trì việc học đều. |
| Hành trình người dùng | Khi có 5 phút trước cuộc họp, người dùng mở app, chọn bài ngắn phù hợp, luyện nói, nhận kết quả và biết mình đã hoàn thành. |

Nhu cầu không nên biến thành danh sách bước. Ngược lại, hành trình không nên chỉ chép lại nguyên câu nhu cầu.

Mỗi nhu cầu và hành trình được gắn mức **importance** (mức quan trọng đối với người dùng):

| Mức | Ý nghĩa |
|---|---|
| Critical | Không đáp ứng thì người dùng gần như không đạt được mục tiêu chính. |
| High | Rất quan trọng với trải nghiệm và kết quả của người dùng. |
| Medium | Có ích rõ ràng nhưng người dùng vẫn có thể đạt mục tiêu cốt lõi nếu thiếu. |
| Low | Giá trị bổ sung, ảnh hưởng thấp hơn. |

Các mức này **không phải** P0/P1/P2. `Critical / High / Medium / Low` nói về tác động với người dùng; còn P0/P1/P2 là thứ tự hoặc mức ưu tiên làm sản phẩm, thuộc `/prd-epic`.

### “Kiểm chứng độc lập” của hành trình nghĩa là gì?

Mỗi hành trình cần một **independent verification** (điểm kiểm chứng độc lập): người rà soát phải xác nhận được người dùng đã đạt một kết quả có giá trị mà không cần dựa vào hành trình ít quan trọng hơn.

Ví dụ:

* Hành trình “hoàn thành bài luyện nói 5 phút” có thể tự kiểm chứng bằng việc người dùng hoàn thành bài và nhận được kết quả luyện tập.
* Không thể chỉ nói “đã thành công vì sau đó người dùng xem báo cáo tiến độ”, vì xem báo cáo là một hành trình khác, có thể chưa được làm.

Cách này giúp từng hành trình tự đứng vững, thay vì mọi thứ chỉ có ý nghĩa khi toàn bộ tính năng đều hoàn hảo.

***

## 5. Không bịa số, không giấu giả định

URD cần có **success criteria** (tiêu chí thành công): kết quả người dùng có thể đo hoặc quan sát được. Mỗi tiêu chí cần có:

* **Baseline** (mức hiện tại đang là bao nhiêu).
* Mục tiêu cần đạt.
* Cách đo.
* Kỳ xem lại kết quả.

Nếu chưa có baseline, `/urd` ghi rõ **“Chưa có”**, kèm cách và thời điểm cần xác lập. Nó không tự đặt ra con số như “tăng 30%” chỉ để bảng trông đầy đủ.

Ví dụ trung thực:‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Tiêu chí | Cách ghi đúng |
|---|---|
| Tỷ lệ người dùng hoàn thành bài 5 phút | Baseline: Chưa có — xác lập bằng dữ liệu 4 tuần đầu. Mục tiêu: cần chốt sau khi có baseline. |
| Người dùng biết cần làm gì khi bài bị gián đoạn | Quan sát được: người dùng thấy trạng thái bài và bước tiếp theo rõ ràng. Đánh giá qua thử nghiệm với người dùng trong kỳ đầu. |

Tương tự, một điều có thể suy ra hợp lý vẫn phải được gắn nhãn **Assumption** (giả định), không được trình bày như sự thật đã xác nhận.

Ví dụ: “Giả định người dùng chính có điện thoại và thường học vào giờ nghỉ trưa.” Nếu giả định này sai, lựa chọn về thời điểm, cách tiếp cận hoặc phạm vi tính năng có thể phải đổi. Vì vậy URD sẽ ghi cả tác động nếu sai, trạng thái và việc cần làm để kiểm chứng.

Điều chưa thể suy ra mà lại ảnh hưởng đến phạm vi, nhu cầu hay kết quả sẽ trở thành **Open Question** (câu hỏi mở), thay vì bị che bằng câu chữ mơ hồ.

***

## 6. Ngoại lệ được nhìn từ phía người dùng

Một URD không chỉ mô tả đường đi thuận lợi. Nó phải xem cả **edge condition** (tình huống ngoại lệ) mà người dùng thật có thể gặp, chẳng hạn:

* Bài học không còn khả dụng.
* Người dùng nhập dữ liệu không hợp lệ.
* Họ bị gián đoạn giữa chừng.
* Kết quả xuất hiện chậm.
* Danh sách bài học trống.
* Người dùng không đủ điều kiện dùng một nội dung nào đó.

Điều URD ghi là:

1) Tình huống xảy ra với người dùng.
2) Tác động mà họ cảm nhận.
3) Kết quả họ cần thấy để không bị bỏ rơi.

Ví dụ đúng góc nhìn người dùng:

> Người dùng bị gián đoạn khi đang luyện nói. Khi quay lại, họ cần biết bài đã hoàn thành tới đâu và có thể tiếp tục hoặc bắt đầu lại một cách rõ ràng.

Ví dụ không thuộc URD:

> Hệ thống thử lại kết nối ba lần rồi gọi dịch vụ lưu trạng thái.

Câu thứ hai là cách xử lý kỹ thuật, phù hợp với SRS hơn là URD.

***

## 7. Phân biệt ba anh em: `/urd` vs `/brd` vs `/prd-epic`

Ba lệnh này thường đi liền nhau nhưng trả lời ba câu hỏi khác nhau.

| | `/urd` | `/brd` | `/prd-epic` |
|---|---|---|---|
| Trọng tâm | Người dùng cần gì | Doanh nghiệp vì sao cần thay đổi | Tính năng sẽ cung cấp khả năng gì |
| Câu hỏi chính | “Người dùng đang gặp gì và muốn đạt kết quả nào?” | “Làm việc này mang lại giá trị, mục tiêu và thay đổi nghiệp vụ gì?” | “Trong feature này sẽ có những capability (khả năng) nào?” |
| Có gì bên trong | Vấn đề, nhóm người dùng, nhu cầu, hành trình, ngoại lệ, giả định, tiêu chí thành công | Mục tiêu kinh doanh, lợi ích, chi phí-lợi ích, rủi ro, mốc nghiệp vụ | Capability P0/P1/P2, phạm vi sản phẩm, kế hoạch phát hành |
| Không làm gì | Không nói ROI, không P0/P1/P2, không API/DB/màn hình | Không thay URD để mô tả chi tiết hành trình người dùng | Không thay URD để giải thích nhu cầu gốc, không thay SRS để mô tả kỹ thuật |

Một câu để nhớ: **`/urd` hỏi người dùng cần gì; `/brd` hỏi doanh nghiệp vì sao làm; `/prd-epic` quyết định feature sẽ làm gì.**

Nếu câu hỏi là “người học cần biết gì khi bài bị gián đoạn?”, đó là `/urd`.

Nếu câu hỏi là “giảm bỏ học có đem lại lợi ích kinh doanh nào?”, đó là `/brd`.

Nếu câu hỏi là “khả năng tiếp tục bài học thuộc P0 hay P1?”, đó là `/prd-epic`.

***

## 8. Bước tự rà soát cuối hoạt động thế nào?

Sau khi URD được ghi và các câu hỏi mở đã được xử lý hoặc giữ lại, `/urd` mặc định mời hai người rà soát chuyên trách:

* **@senior-ba** (người rà soát BA cấp cao): xem tài liệu có thiếu, mơ hồ, lẫn tầng hoặc chưa bao phủ tình huống quan trọng không.
* **@po-reviewer** (người rà soát góc nhìn sản phẩm): xem nhu cầu và phạm vi có nhất quán với giá trị người dùng hay không.

Đây không phải một vòng “cho bạn xem trước mọi thứ”. Những sửa lỗi biên tập, tính nhất quán hoặc sự thật đã có căn cứ sẽ được tự sửa.

Nếu gặp quyết định nghiệp vụ chưa được bạn chốt, hệ thống chọn phương án nhất quán hơn với dữ kiện có sẵn, giá trị người dùng và mức rủi ro thấp hơn. Phần đó được nêu ở báo cáo cuối dưới nhãn:

```text
🔶 Quyết định thay user — review lại
```

Các suy luận đi kèm vẫn phải được đưa vào phần giả định hoặc bằng chứng, để bạn nhìn thấy và có thể sửa sau này.

Nếu muốn tự kiểm soát toàn bộ mà không chạy bước này, bạn chỉ cần nói:

```text
khỏi review
```

***

## 9. Ví dụ thực tế

Chị **Lan** là BA của app học tiếng Anh cho người đi làm. Nhóm đã có một ghi chú brainstorm về tính năng **bài học 5 phút**, nhưng mọi người đang tranh luận: “Thực ra người học cần gì ngoài một bài ngắn?”

Chị gõ:

```text
/urd bai-hoc-5-phut
```

1) Hệ thống tìm thấy hai ghi chú brainstorm liên quan và liệt kê để chị Lan chọn. Chị chọn cả hai vì một ghi chú nói về thói quen học, ghi chú kia nói về luyện nói.

2) Nó đọc các nguồn trước. Vì đã biết người dùng là người đi làm bận rộn và họ thường học trong giờ nghỉ, hệ thống không hỏi lại. Nó chỉ hỏi: ai là người dùng chính, hiện có số liệu hoàn thành bài không, và khi bị gián đoạn người dùng cần được hỗ trợ ra sao.

3) Chị Lan trả lời rằng người dùng chính là nhân viên văn phòng cần luyện cho cuộc họp với khách nước ngoài. Chị chưa có số liệu hoàn thành bài. Khi bị gián đoạn, người học cần biết có thể tiếp tục từ đâu.

4) Hệ thống soạn bản URD: một nhóm người dùng chính, các nhu cầu như hoàn thành bài ngắn và tiếp tục sau gián đoạn; các hành trình theo mức quan trọng; ngoại lệ khi bài bị gián đoạn hoặc nội dung không sẵn có.

5) Với tiêu chí thành công, nó không bịa tỷ lệ hoàn thành. Thay vào đó, ghi baseline là **“Chưa có — xác lập từ dữ liệu 4 tuần đầu”** và nêu cách đo cần thực hiện.

6) Hệ thống trình bản tóm tắt để chị Lan xem trước: số nhu cầu, hành trình, ngoại lệ, giả định và câu hỏi mở. Chị gõ `Y`, nên file URD mới được tạo.

7) Sau đó, hệ thống hỏi chị có muốn xử lý các câu hỏi mở còn lại không. Chị chọn giữ lại một câu về thời lượng học phù hợp vì chưa có nghiên cứu người dùng.

8) Hai người rà soát đọc lại. Một điểm được bổ sung là cần làm rõ kết quả người dùng phải thấy khi bài học bị chậm. Một quyết định suy luận được áp dụng và đánh dấu `🔶` để chị Lan kiểm tra.

Cuối cùng, chị Lan có một bản URD nói rõ người dùng đang cố đạt điều gì, chứ chưa vội quyết định màn hình nào, chức năng nào hay làm trước làm sau. Chị có thể dùng nó để đi tiếp sang `/brd` và `/prd-epic`.

***

## Xem thêm

Tài liệu này giải thích luồng ở mức dễ hiểu. Muốn xem quy tắc đầy đủ, đọc file gốc: `.claude/skills/urd/SKILL.md`.

Các lệnh liên quan trong dây chuyền:

* `.claude/skills/brainstorm/SKILL.md` — `/brainstorm`: ghi nhận và đào sâu ý tưởng đầu vào cho một tính năng.
* `explain-skills/brd.md` — `/brd`: giải thích yêu cầu nghiệp vụ, tức doanh nghiệp vì sao cần thay đổi.
* `explain-skills/prd-epic.md` — `/prd-epic`: đặc tả một feature theo các capability (khả năng) và mức P0/P1/P2.
* `.claude/skills/srs/SKILL.md` — `/srs`: chuyển yêu cầu đã rõ sang đặc tả chi tiết hơn cho đội triển khai.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
