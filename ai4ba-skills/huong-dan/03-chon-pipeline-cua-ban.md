# 03 — Chọn pipeline của bạn‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Chương này về một câu hỏi rất hay bị hỏi: *"chạy skill nào trước, skill nào sau?"* Câu trả lời ngắn gọn là __không có thứ tự đúng cho mọi người__. Chương này giúp các bạn tự ghép luồng của mình.

---

## Đừng chạy đủ chuỗi chỉ vì nó có sẵn‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Sai lầm phổ biến nhất của người mới: thấy bộ có `/urd`, `/brd`, `/prd-epic`, `/srs`, `/usecase`, `/userstory`, `/ac` thì nghĩ phải chạy đủ theo thứ tự đó cho mọi việc.

Không phải vậy.

Một bug nhỏ không cần PRD đầy đủ. Một thay đổi nhỏ có thể bắt đầu thẳng từ báo cáo tác động. Một feature nội bộ cho 5 người dùng không cần cùng độ chi tiết như tính năng thanh toán cho 50.000 người.

Nhưng ngược lại cũng đúng: khi làm một feature có thanh toán, có nhiều trạng thái và nhiều người dùng nội bộ, bỏ qua bước làm rõ bối cảnh hoặc kiểm gap thường sẽ trả giá muộn hơn.

> Chọn kịch bản gần nhất với việc các bạn đang làm, không chọn kịch bản dài nhất.

---

## Ba luồng mẫu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là ba luồng có thật, ba người khác nhau dùng, cả ba đều hợp lý.

### Luồng A — Đi trọn vòng đời sản phẩm‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
/prd → /roadmap → /brainstorm → /srs → /wireframe-html → /userstory → /jira
     → /test-checklist → /test-cases
```

__Hợp khi:__ các bạn đang định hình sản phẩm từ đầu, hoặc phụ trách cả phần product lẫn phần đặc tả.

__Ý tưởng:__ định hình sản phẩm → làm rõ nghiệp vụ → đặc tả → thiết kế → bóc story → kiểm thử.

__Điểm mạnh:__ đầy đủ nhất, dễ trả lời câu hỏi "yêu cầu này từ đâu ra".
__Điểm yếu:__ chậm. Dev phải chờ khá lâu mới có story để làm.

---

### Luồng B — Backlog sớm cho dev, chi tiết sau‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
/brainstorm → /srs (chỉ lớp lõi) → /userstory → /ac
            → /srs (chạy tiếp các lớp sau) → /wireframe-html
            → /test-checklist → /test-cases
```

__Hợp khi:__ dev đang chờ backlog, các bạn cần chốt story sớm rồi mới quay lại đặc tả sâu.

__Ý tưởng:__ làm rõ vừa đủ → viết __phần lõi__ của đặc tả (yêu cầu chức năng, business rule, mã lỗi) → bóc story ngay cho dev có việc → sau đó mới quay lại làm sơ đồ, màn hình và kiểm thử.

__Điểm mạnh:__ dev không phải chờ cả bộ tài liệu.
__Điểm yếu:__ story viết khi đặc tả mới có phần lõi, dễ phải sửa lại. Chấp nhận được nếu biết trước.

> **Vì sao vẫn có `/srs` ở giữa?** Vì bản gốc của `/userstory` __từ chối chạy__ khi chưa có file đặc tả — nó cần yêu cầu chức năng để bóc story, không có thì phải bịa.
>
> Mẹo nhanh: `/srs` cho phép chọn chạy tới lớp nào. Chọn __lớp lõi__ thôi là đủ để `/userstory` có nguồn — nhanh hơn nhiều so với chạy hết.
>
> __Không thích ràng buộc đó?__ Sửa được — xem mục ngay dưới đây.

---

### Luồng C — Bản bấm được cho khách xem trước

```
/user-flow → /wireframe-ascii → /prototype-html → /brainstorm → /srs
           → /userstory → /test-checklist → /test-cases
```

__Hợp khi:__ khách hàng hoặc sếp cần __nhìn thấy__ cái gì đó bấm được trước khi cam kết.

__Ý tưởng:__ dựng luồng → phác màn hình → làm bản bấm được cho khách xem sớm → chốt hướng xong mới làm chi tiết nghiệp vụ và kiểm thử.

__Điểm mạnh:__ phản hồi sớm, tránh viết cả tập tài liệu cho thứ khách không muốn.
__Điểm yếu:__ dễ sa đà vào giao diện mà quên nghiệp vụ. Prototype đẹp không có nghĩa yêu cầu đã rõ.

> **Vì sao có `/wireframe-ascii` ở giữa?** Vì bản gốc của `/prototype-html` đọc bảng mô tả màn hình từ đó làm nguồn nội dung — thiếu thì nó từ chối chạy.
>
> Nhiều người muốn đi thẳng từ luồng sang bản bấm được, bỏ qua bước phác ASCII. __Sửa được__ — xem mục ngay dưới đây.

---

### Ba luồng này khác nhau ở đâu

| | Luồng A | Luồng B | Luồng C |
|---|---|---|---|
| Bắt đầu bằng | Định hình sản phẩm | Làm rõ ý tưởng | Dựng luồng + bản demo |
| Dev có việc sau | ~5-7 bước | __~3 bước__ | ~6 bước |
| Khách thấy hình sau | ~5 bước | ~6 bước | __~3 bước__ |
| Rủi ro chính | Chậm | Story phải sửa lại | Sa đà giao diện |

Điểm chung: **cả ba đều kết thúc bằng `/test-checklist` → `/test-cases`.** Đó không phải trùng hợp — kiểm thử là chỗ phát hiện đặc tả có lỗ hổng.

---

## Tự ghép luồng của mình

### Bước 1 — Liệt kê thứ mình PHẢI giao

Đừng bắt đầu từ danh sách skill. Bắt đầu từ __thứ người khác đòi ở các bạn__.

Viết ra: trong 3 tháng qua, các bạn thật sự phải nộp những tài liệu gì? Cho ai? Ai đọc chúng?

Ví dụ một danh sách thật:

```
- Tài liệu đặc tả cho dev          (mỗi feature 1 lần)
- User story trên Jira             (mỗi sprint)
- Sơ đồ luồng cho buổi họp kickoff (thỉnh thoảng)
- Mô tả màn hình cho designer      (mỗi feature)
- Test case cho QC                 (mỗi feature)
```

Thứ không nằm trong danh sách này thì các bạn __không cần skill cho nó__. Đơn giản vậy thôi.

### Bước 2 — Ánh xạ sang skill

| Mình phải giao | Skill làm việc đó |
|---|---|
| Làm rõ ý tưởng thô trước khi viết | `/brainstorm` |
| Tài liệu yêu cầu người dùng | `/urd` |
| Lý do kinh doanh, mục tiêu | `/brd` |
| Phạm vi một feature | `/prd-epic` |
| Đặc tả cho dev | `/srs` |
| Use case chi tiết | `/usecase` |
| Sơ đồ luồng, ERD, trạng thái | `/sequence`, `/activity`, `/erd`, `/state` |
| Luồng người dùng | `/user-flow` |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| Mô tả màn hình | `/wireframe-ascii` hoặc `/wireframe-html` |
| Bản bấm được cho khách | `/prototype-html` |
| User story | `/userstory` |
| Acceptance criteria | `/ac` |
| Đẩy lên Jira / Confluence | `/jira`, `/confluence` |
| Kiểm tài liệu thiếu gì | `/gap` |
| Test | `/test-checklist` → `/test-cases` |
| Gói tài liệu gửi stakeholder | `/export` |

### Bước 3 — Xếp theo thứ tự phụ thuộc

Quy tắc duy nhất cần nhớ: __skill nào cần output của skill khác thì phải chạy sau.__

Vài ràng buộc thật trong bộ này:

```
/ac          cần user story  →  chạy sau /userstory
/userstory   cần FR          →  chạy sau /srs (hoặc dùng luồng B, chấp nhận sửa lại)
/wireframe-* cần luồng       →  chạy sau /user-flow
/test-cases  cần checklist   →  chạy sau /test-checklist
/gap         cần có tài liệu →  chạy khi đã có kha khá
```

Cách kiểm nhanh: mở `SKILL.md`, đọc mục __Inputs__. Nếu Inputs nhắc tới file do skill khác sinh ra, đó là ràng buộc thứ tự.

> Đây là __mặc định của bộ này__, không phải luật cứng. Ràng buộc nào không hợp luồng của các bạn thì gỡ được — xem Bước 3b ngay dưới.

### Bước 3b — Ràng buộc nào không hợp thì gỡ

Đây là phần quan trọng, và cũng hay bị hiểu nhầm nhất.

Mấy ràng buộc ở trên __không phải luật của Claude Code__. Chúng là __lựa chọn thiết kế__ mình viết vào `Constraints` của từng skill — vì trong hoàn cảnh của mình, chạy sai thứ tự hay dẫn tới AI bịa. Hoàn cảnh của các bạn có thể khác.

Hai ví dụ hay gặp:

| Ràng buộc | Ai thấy vướng |
|---|---|
| `/userstory` đòi có đặc tả | Team chốt story trước rồi mới viết đặc tả sâu |
| `/prototype-html` đòi có wireframe ASCII | Muốn đi thẳng từ luồng sang bản bấm được, bỏ bước phác |

__Đây là quyết định của các bạn, không phải của bộ skill.__ Chính bộ này đã từng làm y hệt: `/usecase` ban đầu cũng đòi có đặc tả trước, rồi được sửa thành __hai chế độ__ — chưa có đặc tả thì chạy chế độ khám phá (viết use case để làm rõ nghiệp vụ, chỗ nào chưa rõ thì ghi open question), có đặc tả rồi thì chạy chế độ đầy đủ. Lý do sửa: chặn cứng là chặn nhầm một cách làm việc hoàn toàn hợp lệ.

Các bạn làm được đúng như vậy với bất kỳ skill nào.

__Prompt gỡ ràng buộc:__

```text
Đọc .claude/skills/<tên-skill>/SKILL.md, tập trung mục Constraints và Approach.

Skill này đang TỪ CHỐI chạy khi chưa có <file/skill upstream>. Luồng của tôi
không đi qua bước đó — tôi cần nó chạy được luôn.

Hãy đổi thành HAI CHẾ ĐỘ, đừng bỏ hẳn ràng buộc:

1. Có <upstream> → giữ nguyên hành vi hiện tại (đọc nguồn, điền truy vết đầy đủ).

2. Chưa có <upstream> → vẫn chạy, nhưng:
   - Hỏi tôi những thông tin mà lẽ ra nó lấy từ upstream
   - Chỗ nào tôi chưa biết thì ghi open question, TUYỆT ĐỐI không tự bịa
   - Đánh dấu output là bản nháp, ghi rõ thiếu nguồn nào
   - Cuối cùng gợi ý tôi chạy <skill upstream> để hoàn thiện sau

Trước khi sửa, cho tôi biết:
- Ràng buộc này đang nằm ở dòng nào, viết thế nào
- Bỏ nó đi thì skill mất thông tin gì, và rủi ro thật là gì
- Skill nào phía sau đang đọc output của skill này — có bị ảnh hưởng không

Show diff trước khi ghi.
```

Ba câu hỏi cuối là phần đáng giá nhất. Chúng bắt AI __cho các bạn thấy cái giá__ trước khi gỡ — chứ không gỡ mù.

> __Đừng bỏ hẳn ràng buộc, hãy đổi thành hai chế độ.__ Ràng buộc tồn tại vì một lý do thật: không có nguồn thì AI phải đoán. Chế độ hai giữ được cái đó — nó vẫn chạy, nhưng __hỏi các bạn__ thay vì tự điền, và đánh dấu rõ chỗ nào còn thiếu.

__Sau khi sửa, thử ba ca:__

| Ca | Kỳ vọng |
|---|---|
| Có upstream đầy đủ | Chạy y như cũ, không đổi hành vi |
| Không có upstream, các bạn trả lời đủ | Chạy được, output đánh dấu là nháp |
| Không có upstream, các bạn nói "chưa rõ" | __Ghi open question__ — không tự bịa |

Ca thứ ba quan trọng nhất. Nếu AI tự điền, nghĩa là gỡ ràng buộc mà chưa thay bằng gì — quay lại bổ sung `Constraints`.

### Bước 4 — Cắt bớt

Nhìn lại luồng vừa ghép và hỏi: *bước nào mình sẽ bỏ qua trong 80% trường hợp?*

Bỏ nó ra khỏi luồng chính. Cần thì gọi lẻ, không cần đưa vào quy trình chuẩn.

Luồng của một người thật sau khi cắt:

```
/brainstorm → /srs → /user-flow → /wireframe-html → /userstory → /jira
```

Sáu skill. Hết. Không `/urd`, không `/brd`, không `/usecase`, không `/prd-epic` — vì công ty họ không yêu cầu mấy tài liệu đó.

Đó là một luồng hoàn toàn hợp lệ.

---

## Ghi luồng của mình vào đâu

Sau khi chốt, ghi nó lại để AI biết. Thêm vào `CLAUDE.md` của dự án:

```markdown
## Luồng làm việc của team

/brainstorm → /srs → /user-flow → /wireframe-html → /userstory → /jira

- Không dùng /urd, /brd, /prd-epic — công ty không yêu cầu.
- Sơ đồ: chỉ dùng /sequence và /erd. Không dùng BPMN.
- Wireframe: dùng /wireframe-html, không dùng ASCII.
```

Có đoạn này, AI sẽ gợi ý bước tiếp theo đúng luồng của mình thay vì gợi ý bừa theo bộ gốc.

---

## Prompt nhờ AI ghép luồng hộ

```text
Đọc .claude/skills/*/SKILL.md trong workspace này, tập trung vào mục Goal và Inputs.

Bối cảnh của tôi:
- Tôi làm [vai trò] tại [loại công ty/dự án]
- Tài liệu tôi PHẢI giao định kỳ: [liệt kê]
- Người đọc tài liệu của tôi: [dev / QC / khách hàng / sếp]
- Công cụ team đang dùng: [Jira / Confluence / Figma / không có]
- Tôi KHÔNG bao giờ phải làm: [liệt kê]

Hãy:
1. Đề xuất một pipeline gồm 5-8 skill khớp với những gì tôi phải giao.
2. Với mỗi skill, nói rõ nó chạy sau skill nào và VÌ SAO (dựa vào Inputs, trích dẫn file).
3. Liệt kê skill trong bộ mà tôi NÊN BỎ, nói rõ lý do.
4. Chỉ ra chỗ nào trong pipeline này dễ tắc nhất, và cách xử lý.
5. Viết giúp tôi đoạn mô tả luồng để dán vào CLAUDE.md.

Chỉ dựa trên file thật, đừng suy đoán skill không có trong workspace.
```

---

## Vài lưu ý khi chạy luồng

__Không phải lúc nào cũng chạy hết luồng.__ Sửa một dòng trong đặc tả thì gọi thẳng skill đó, không cần chạy lại từ đầu.

__Output bước trước là input bước sau — nên hãy review trước khi đi tiếp.__ Nếu đặc tả sai mà các bạn duyệt qua, story và test case sinh ra từ đó cũng sai theo. Sửa ở bước đầu rẻ hơn sửa ở bước cuối rất nhiều.

__Khi yêu cầu đổi, tài liệu phía sau có thể lỗi thời.__ Bộ này có hook đánh dấu hộ, nhưng đánh dấu không phải sửa. Các bạn vẫn phải xem lại.

**Chạy `/gap` định kỳ,** đừng đợi đến cuối. Nó chỉ ra chỗ đáng nghi — ví dụ có luồng thanh toán trong đặc tả nhưng chưa có story tương ứng, hoặc business rule nói giữ chỗ 24 giờ mà AC lại ghi 48 giờ. Đó là finding để các bạn xem, không phải kết luận.

---

## Tóm tắt

* __Không có thứ tự đúng cho mọi người.__ Chọn kịch bản gần nhất với việc của các bạn.
* Ba luồng mẫu: __A__ đi trọn vòng đời, __B__ chốt story sớm cho dev, __C__ demo trước cho khách.
* Tự ghép luồng theo 4 bước: liệt kê thứ __phải giao__ → ánh xạ sang skill → xếp theo phụ thuộc (đọc mục __Inputs__) → __cắt bớt__.
* Ràng buộc thứ tự là __lựa chọn thiết kế, không phải luật__ — không hợp thì gỡ (Bước 3b). Nhưng đổi thành __hai chế độ__, đừng bỏ hẳn: chế độ thiếu nguồn phải __hỏi các bạn__, không được tự bịa.
* Luồng 5-6 skill là bình thường và hoàn toàn hợp lệ.
* Ghi luồng đã chốt vào `CLAUDE.md` để AI gợi ý đúng.
* Review kỹ ở bước đầu — sai ở đầu luồng lan xuống toàn bộ phần sau.

---

Giờ các bạn đã có danh sách skill mình cần. Chương tiếp giải thích vì sao __đừng lấy thêm__ những cái không nằm trong danh sách đó.

Chương tiếp: [04 — Skill preload và token](04-skill-preload-va-token.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
