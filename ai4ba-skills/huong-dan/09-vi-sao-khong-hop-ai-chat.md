# 09 — Vì sao bộ này không hợp với AI Chat‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Câu hỏi hay gặp: *"tôi đang dùng claude.ai / ChatGPT, copy skill vào dán làm prompt được không?"*
>
> Được. Nhưng phần lớn giá trị sẽ mất. Chương này nói rõ mất cái gì, và khi nào thì chat vẫn dùng tốt.

***

## Khác biệt gốc: chat không thấy dự án của các bạn‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là điểm phân định, mọi thứ khác đều từ đây mà ra.

**AI Chat** không nối vào thư mục dự án trên máy các bạn. Muốn nó đọc đặc tả thì phải dán đặc tả vào. Muốn nó biết business rule đã chốt thì phải dán rule.

**AI Coding Agent** (Claude Code, Codex CLI, Antigravity) chạy trên máy các bạn, trong thư mục dự án. Nó **tự đọc file**, **tự ghi file**, **chạy được lệnh**.

> Các nền tảng chat vẫn đang thêm tính năng — có bản cho tải file lên, có bản nối được vào kho mã nguồn. Nhưng chừng nào nó chưa **ghi thẳng vào thư mục dự án** và chưa **chạy được hook sau khi ghi**, thì mấy điểm dưới đây vẫn đúng.

Nghe như một khác biệt kỹ thuật nhỏ. Thực tế nó đổi hoàn toàn cách làm việc:

| | AI Chat | AI Coding Agent |
|---|---|---|
| Đọc tài liệu dự án | Các bạn phải dán vào (hoặc tải lên từng file) | Tự đọc, tự chọn file cần |
| Ghi kết quả | Các bạn copy ra dán vào file | Ghi thẳng vào đúng thư mục |
| Nhớ giữa các phiên | Phụ thuộc tính năng của từng nền tảng | Tài liệu nằm trên đĩa, phiên sau đọc lại được |
| Nối nhiều bước | Các bạn tự chuyển output sang bước sau | Skill sau đọc output skill trước |
| Tự động sau khi ghi | Không | Hook chạy được |
| Truy vết thay đổi trong dự án | Không | Git |

***

## Bốn thứ mất khi dùng trên chat‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### 1. Skill không đọc được nguồn — các bạn phải làm người bưng bê‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Skill viết SRS trong bộ này đọc brainstorm, PRD, và các quy ước dùng chung, rồi mới hỏi các bạn phần còn thiếu.

Trên chat, nó không đọc được gì cả. Các bạn phải tự dán hết vào. Mà dán hết thì gặp vấn đề của [chương 04](04-skill-preload-va-token.md): cửa sổ ngữ cảnh có hạn, dán năm tài liệu vào thì phần quan trọng nhất dễ bị chìm.

Kết quả thường thấy: AI viết một bản SRS nghe rất trôi chảy nhưng **không khớp** với business rule các bạn đã chốt ở tài liệu khác — vì nó chưa từng thấy tài liệu đó.

### 2. Các skill không nối được thành chuỗi‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Giá trị lớn nhất của bộ này không phải từng skill riêng lẻ. Là chuyện **output của bước trước tự động thành input của bước sau**.

Trên chat, mỗi lần chuyển bước là một lần các bạn phải copy tay. Làm một hai lần thì được. Làm cho cả một feature với năm sáu bước, mỗi bước vài tài liệu — sẽ có lúc dán nhầm bản cũ. Và không ai biết là đã nhầm.

### 3. Không có hook, không có truy vết

Bộ này có cơ chế: sửa đặc tả xong, hệ thống tự đánh dấu user story phía sau **có thể đã lỗi thời**.

Nghe nhỏ nhưng đây là chỗ hay gây lỗi thật. Yêu cầu đổi, tài liệu đầu nguồn được sửa, còn tài liệu phía sau thì quên. Ba tuần sau dev làm theo bản cũ.

Trên chat không có cơ chế nào làm việc đó. Cũng không có git để xem "hôm qua AI đã sửa gì".

### 4. Không có agent review độc lập

Bộ này dùng agent chạy **phiên riêng, context sạch** để review lại tài liệu vừa viết.

Vì sao phải phiên riêng? Vì AI vừa viết xong một bản thì có xu hướng bảo vệ nó. Bảo nó "tự review đi" trong cùng cuộc trò chuyện thì hay nhận được câu "bản này ổn rồi".

Trên chat, các bạn có thể **giả lập** bằng cách mở một phiên mới hoàn toàn rồi dán tài liệu vào nhờ review. Cách này thật ra hoạt động khá tốt — chỉ là phải làm tay.

***

## Vậy chat dùng được việc gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đừng hiểu nhầm là chat vô dụng. Nó vẫn tốt cho:

| Việc | Vì sao chat hợp |
|---|---|
| Hỏi nhanh một khái niệm | Không cần đọc file dự án |
| Nháp một đoạn ngắn | Dán vào, lấy ra, xong |
| Suy nghĩ cùng AI về một vấn đề | Trao đổi qua lại, không cần ghi file |
| Review một tài liệu **đã có** | Dán vào, nhờ soi — phiên sạch còn là điểm cộng |
| Viết lại cho gọn, đổi giọng văn | Việc trên một đoạn text, không cần bối cảnh dự án |

Nhận ra quy luật chưa? **Chat hợp với việc gói gọn trong một lần trao đổi.** Coding agent hợp với việc **trải qua nhiều bước và nhiều file**.

Công việc BA có cả hai loại. Nên câu trả lời thực tế là: dùng cả hai, đúng việc.

***

## Nếu vẫn muốn dùng vài skill trên chat

Có cách, và cũng có giới hạn cần biết trước.

**Chọn skill nào:** những skill làm việc trên **một đoạn nội dung**, không cần đọc nhiều file. Ví dụ viết acceptance criteria từ một story các bạn dán vào; hoặc một checklist review.

**Đừng chọn:** skill điều phối nhiều bước, skill cần đọc nhiều tài liệu, skill ghi ra nhiều file cùng lúc.

**Cách chuyển một skill thành prompt cho chat:**

```text
Đọc file .claude/skills/ac/SKILL.md.

Viết lại nó thành MỘT prompt dán được vào ChatGPT/Claude web, biết rằng:
- AI ở đó KHÔNG đọc được file nào — mọi thứ tôi phải dán vào
- Không ghi được file — output phải in ra trong chat
- Không có hook, không có agent phụ

Cụ thể:
1. Giữ nguyên phần luật trong Constraints — nhất là luật "thiếu thông tin thì ghi
   open question, không được tự bịa". Đó là phần giá trị nhất.
2. Đổi mục Inputs thành danh sách "những gì tôi cần dán vào trước khi hỏi".
3. Bỏ mọi thứ liên quan tới đường dẫn file, hook, agent.
4. Giữ format output.
5. Thêm một dòng đầu: nếu tôi dán thiếu thứ gì trong danh sách, hãy hỏi tôi
   trước khi làm.

Cho tôi prompt hoàn chỉnh, tôi copy đi dùng.
```

Mục 1 và 5 là phần đáng giữ nhất. Cái làm skill hơn một prompt thường không phải cấu trúc đẹp — mà là **luật buộc AI dừng lại khi thiếu thông tin**.

***

## Vậy nên chọn gì

| Hoàn cảnh | Gợi ý |
|---|---|
| Làm tài liệu cho cả một feature, nhiều bước | Coding agent — đúng chỗ bộ này phát huy |
| Chỉ cần nháp nhanh một đoạn | Chat, không cần cài gì |
| Công ty chưa cho cài phần mềm lên máy | Chat + vài skill đã chuyển thành prompt, chấp nhận làm tay phần nối |
| Đã quen chat, muốn thử coding agent | Đọc [chương 01](01-bat-dau-nhanh.md), thử trên thư mục nháp trước |

Nếu công ty chưa cho cài, cách thực tế: dùng chat cho phần soạn nội dung, tự tay giữ tài liệu trong git. Mất phần tự động, nhưng vẫn giữ được phần quan trọng nhất — **tài liệu có truy vết, và AI phải hỏi khi thiếu thông tin**.

***

## Tóm tắt

* Khác biệt gốc: **chat không thấy dự án của các bạn**; coding agent đọc và ghi được file.
* Bốn thứ mất trên chat: skill **không đọc được nguồn**, các bước **không nối được**, không có **hook và truy vết**, không có **agent review độc lập**.
* Chat vẫn tốt cho việc gọn trong một lần trao đổi: hỏi nhanh, nháp ngắn, review một tài liệu đã có.
* Muốn dùng skill trên chat thì chọn loại làm việc trên **một đoạn nội dung**, và **giữ bằng được luật "thiếu thì hỏi, không bịa"**.
* Thực tế nên dùng cả hai, đúng việc.

***

> Hết phần hướng dẫn. Muốn xem output thật của bộ này trông thế nào, mở [`example/README.md`](../example/README.md).
>
> Còn nếu các bạn muốn tự build skill và workflow cho đúng cách làm của mình — có người hướng dẫn khi bị kẹt — thì khoá [AI4BA v2](https://ai4ba.com) là bước tiếp theo. Mua BA-Kit từ [ai4ba.com/ba-kit](https://ai4ba.com/ba-kit) được giảm 500.000đ.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
