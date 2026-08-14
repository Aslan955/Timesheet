# 01 — Bắt đầu nhanh: chạy thử trong 15 phút‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Chương này để các bạn __thấy nó chạy__ trước đã. Chưa cần hiểu cơ chế, chưa cần quyết định giữ skill nào. Cài, chạy một feature giả, xem output, rồi mới tính tiếp.
>
> __Chưa muốn cài gì?__ Mở thư mục [`example/`](../example/README.md) — có sẵn hai feature đã chạy qua bộ skill, hơn 130 file output thật. Xem trước cho biết mình sắp nhận được cái gì.

***

## Claude Code là gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nếu các bạn mới chỉ dùng ChatGPT hay Claude trên trình duyệt, thì đây là điểm khác quan trọng nhất.

__Claude Code chạy trên máy các bạn__ và __nhìn thấy thư mục dự án__. Nó đọc được file, ghi ra file mới, chạy được lệnh — trong khi bản chat trên trình duyệt chỉ nhìn thấy đúng thứ các bạn dán vào ô chat.

Có ba cách dùng, chọn cái nào cũng được:

| Cách dùng | Hợp với ai |
|---|---|
| __Ứng dụng Claude trên máy__ — Claude Code nằm sẵn trong đó | Không quen gõ lệnh, muốn giao diện bấm được |
| __Extension trong VS Code__ | Đã quen VS Code, muốn AI làm việc ngay cạnh file |
| __Terminal__ (Mac) / PowerShell (Windows) | Quen dòng lệnh, hoặc muốn chạy trên máy chủ |

Cả ba đều dùng chung một bộ skill và đọc cùng thư mục `.claude/` — chọn theo thói quen, không ảnh hưởng gì tới nội dung hướng dẫn này.

Tài liệu này minh họa bằng __Terminal__ vì nó ngắn gọn và không phụ thuộc giao diện. Dùng ứng dụng hay extension thì các bạn không cần gõ mấy dòng `claude` — chỉ cần mở đúng thư mục dự án rồi gõ lệnh `/tên-skill` vào ô chat.

Đó chính là lý do bộ skill này chạy trên Claude Code chứ không phải trên chat — chương [09](09-vi-sao-khong-hop-ai-chat.md) nói kỹ hơn.

> __Về chi phí:__ các bạn trả tiền trực tiếp cho Anthropic (nhà làm ra Claude), không trả cho mình. Có gói thuê bao tháng và có kiểu trả theo lượng dùng. Xem [claude.com/claude-code](https://claude.com/claude-code) để biết gói hiện tại.

***

## Bước 1 — Cài Claude Code‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Làm theo hướng dẫn chính thức: [claude.com/claude-code](https://claude.com/claude-code) — trang này có đủ cả ba cách (ứng dụng, extension VS Code, dòng lệnh).

__Dùng ứng dụng Claude hoặc extension VS Code:__ cài xong là dùng được luôn, bỏ qua phần kiểm tra dưới đây.

__Dùng dòng lệnh:__ mở Terminal rồi kiểm tra:

```bash
claude --version
```

Ra được số phiên bản là ổn.

> __Terminal ở đâu?__
> Mac: nhấn `Cmd + dấu cách`, gõ "Terminal", Enter.
> Windows: nhấn phím Windows, gõ "PowerShell", Enter.

***

## Bước 2 — Tạo một thư mục thử‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Đừng thử ngay trên dự án thật.__ Tạo một thư mục riêng để nghịch — đặt tên `ba-kit-thu` cho dễ nhớ.

Tạo bằng Finder/Explorer cũng được, hoặc gõ:

```bash
mkdir ~/ba-kit-thu
cd ~/ba-kit-thu
git init
```

Dòng `git init` đáng làm: nó biến thư mục này thành nơi có thể hoàn tác được. Nếu AI ghi ra thứ gì các bạn không thích, quay lại được.

> Không quen dòng lệnh thì tạo thư mục bằng tay, rồi ở bước sau nhờ AI chạy `git init` hộ.

***

## Bước 3 — Copy bộ tối thiểu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Chỉ lấy __4 skill__ để bắt đầu: `/brainstorm`, `/srs`, `/user-flow`, `/userstory`.

Nhưng đừng copy tay. Mỗi skill còn kéo theo một loạt rule và template mà nó cần — riêng bốn skill này đã là __23 file phụ thuộc__. Copy thiếu một cái là skill chạy sai mà không báo lỗi rõ ràng.

Cách đúng là để AI dò và copy.

Mở Claude Code **trong thư mục `~/ba-kit-thu` vừa tạo**:

- __Ứng dụng Claude:__ mở app, chọn thư mục `~/ba-kit-thu`
- __VS Code:__ mở thư mục `~/ba-kit-thu`, rồi mở panel Claude
- __Terminal:__ `cd ~/ba-kit-thu` rồi gõ `claude`

> Mở __đúng thư mục__ là điểm quan trọng nhất — Claude Code chỉ thấy file trong thư mục các bạn mở.

Rồi dán prompt này:

```text
Tôi vừa mua bộ BA-Kit, giải nén ở: <đường-dẫn-ba-kit>

Copy giúp tôi 4 skill để chạy thử: brainstorm, srs, user-flow, userstory.

Làm theo thứ tự sau:

1. Với MỖI skill, mở <đường-dẫn-ba-kit>/claude-code/.claude/skills/<tên>/SKILL.md
   và tìm mọi dòng bắt đầu bằng @ (thường ở mục References cuối file) —
   đó là danh sách file nó phụ thuộc.

2. Dò ĐỆ QUY: mỗi rule tìm được cũng có thể tham chiếu rule khác. Lặp lại
   cho tới khi không ra thêm gì mới.

3. Kiểm xem skill có gọi agent nào không (tìm chữ "Task tool", "reviewer",
   "senior-ba", "subagent_type" trong SKILL.md).

4. Cho tôi xem DANH SÁCH đầy đủ những file sắp copy trước khi copy.

5. Sau khi tôi duyệt: copy mọi thứ sang thư mục hiện tại, giữ đúng cấu trúc
   (.claude/skills/, .claude/rules/, .claude/agents/, _templates/).

6. Kiểm lại: với mỗi skill vừa copy, xác nhận mọi đường dẫn @ trong đó đều
   trỏ tới file có thật. Báo tôi nếu còn thiếu.

Chưa copy gì cả — đưa danh sách trước.
```

Câu cuối quan trọng: xem danh sách trước rồi mới cho copy.

> __Vì sao chỉ 4 skill?__ Xem [chương 04](04-skill-preload-va-token.md) — cài nhiều thì tốn tiền ở mọi phiên chat. Bắt đầu nhỏ, thêm dần khi thật sự thiếu.
>
> __Copy về dự án thật sau này?__ [Chương 06](06-copy-skill-ve-du-an.md) có prompt đầy đủ hơn — kèm bước rà chỗ hard-code và viết lại `CLAUDE.md`.

***

## Bước 4 — Chạy thử

Vẫn ở phiên Claude Code vừa nãy (đang mở trong `~/ba-kit-thu`), gõ:

```
/brainstorm quản lý đặt phòng họp cho công ty
```

__Chuyện gì sẽ xảy ra:__

1. Skill hỏi các bạn vài câu để làm rõ ý tưởng — ai dùng, giải quyết vấn đề gì, có ràng buộc gì. Cứ trả lời bằng tiếng Việt bình thường.
2. Chỗ nào các bạn chưa biết, cứ nói "chưa rõ" — nó sẽ ghi thành __open question__ thay vì tự bịa. Đây là điểm đáng chú ý nhất, để ý xem nó có làm đúng không.
3. Trước khi ghi file, nó hiện __kế hoạch__: sắp tạo file nào, nội dung gì. Các bạn gõ `Y` để đồng ý.
4. File xuất hiện trong `docs/quan-ly-dat-phong-hop/brainstorms/`.

Mở file đó ra xem. Đó là output thật của bộ này.

***

## Bước 5 — Chạy tiếp một bước nữa

Để thấy các skill nối nhau thế nào:

```
/srs quan-ly-dat-phong-hop
```

Skill này __đọc file brainstorm vừa tạo__ làm nguồn, rồi hỏi tiếp những gì còn thiếu để viết đặc tả.

Đó là ý tưởng cốt lõi của cả bộ: __output của bước trước là input của bước sau.__ Không phải mỗi skill làm việc riêng lẻ rồi các bạn tự ghép lại.

***

## Các bạn vừa thấy gì

Nếu mọi thứ chạy đúng, các bạn vừa quan sát được bốn thứ:

| Điều xảy ra | Ý nghĩa |
|---|---|
| Skill __hỏi lại__ thay vì đoán bừa | Có rule chặn AI tự điền thông tin nó không có |
| Nó hiện __kế hoạch trước khi ghi file__ | Cổng duyệt L1 — AI không ghi sau lưng các bạn |
| File ra đúng thư mục, đúng cấu trúc | Quy ước đặt tên được áp tự động |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| Skill sau __đọc được__ output của skill trước | Các skill nối thành chuỗi, không rời rạc |

Bốn thứ đó là khác biệt giữa "bộ skill" và "một tập prompt viết kỹ".

***

## Không biết dùng skill nào? Hỏi thẳng AI

Bộ này __tự mô tả được chính nó__. Không cần học thuộc 57 skill — chỉ cần chỉ cho AI đọc thư mục gói rồi hỏi bằng lời thường.

Điểm mấu chốt: __luôn đưa đường dẫn thư mục gói vào câu hỏi.__ Không có nó, AI đoán từ trí nhớ và bịa ra tên skill không tồn tại.

### Hỏi theo việc cần làm

Cách hỏi tự nhiên nhất — mô tả việc, để AI chọn skill:

```text
Đọc <đường-dẫn-ba-kit>/claude-code/.claude/skills/ và
<đường-dẫn-ba-kit>/explain-skills/.

Việc tôi cần làm: [mô tả bằng lời thường, ví dụ "vẽ sơ đồ quy trình duyệt
đơn hàng có 3 vai trò: khách, kho, admin"]

Hãy:
1. Liệt kê những skill bạn đã CÂN NHẮC, nói rõ vì sao chọn/bỏ từng cái
2. Cho tôi cú pháp gọi chính xác của skill được chọn
3. Nói trước nó sẽ hỏi tôi gì và tạo ra file nào

Chỉ nói về skill có thật trong thư mục đó. Chưa chạy gì — tôi xem trước rồi tự chạy.
```

Mục 1 bắt AI __cho thấy nó đã so sánh__ thay vì phán một cái tên — bộ này có bốn skill cùng vẽ quy trình có nhánh, biết vì sao nó loại ba cái kia giúp các bạn tự chọn được lần sau.

Câu cuối chống bịa. Không có nó, AI hay "sáng tạo" thêm skill nghe rất hợp lý nhưng không tồn tại.

### Vài câu hỏi khác, dùng luôn được

Đổi phần trong ngoặc vuông:

```text
Liệt kê tất cả skill trong <đường-dẫn-ba-kit>/claude-code/.claude/skills/,
nhóm theo mục đích. Chỉ skill có thật.
```

```text
Đọc SKILL.md và explain-skills của /<tên-skill> trong <đường-dẫn-ba-kit>.
Giải thích đơn giản: nó làm gì, hỏi tôi gì, tạo file nào, cần chạy skill nào
trước, và ba chỗ dễ sai nhất. Trích dẫn file làm bằng chứng.
```

```text
Nhìn thư mục docs/ của tôi và bộ skill ở <đường-dẫn-ba-kit>, gợi ý 2-3 bước
hợp lý tiếp theo. Mục tiêu của tôi: [ví dụ "có wireframe và backlog cho dev"].
Mỗi gợi ý nói rõ cần file nào làm nguồn — tôi đã có đủ chưa.
```

```text
Đọc <đường-dẫn-ba-kit>/example/. Cho tôi xem một feature hoàn chỉnh trông
thế nào: file nào do skill nào sinh ra, file nào đáng đọc trước.
```

### Ba cách kiểm AI không "diễn"

AI nói rất trôi chảy về những thứ nó chưa đọc:

- __Kiểm tên skill có thật:__ hỏi *"Liệt kê thư mục `.claude/skills/`"* rồi đối chiếu
- __Bắt trích dẫn:__ *"Trích đúng dòng trong SKILL.md làm bằng chứng"*
- __Chặn trước khi ghi:__ *"Chưa tạo hay sửa gì — liệt kê file sẽ tác động trước"*

AI là tra cứu viên nhanh, không phải nguồn sự thật. Nó chỉ đường. Các bạn là người quyết.

***

## Nếu có trục trặc

| Triệu chứng | Xử lý |
|---|---|
| Gõ `/brainstorm` không thấy gì | Kiểm xem Claude Code có đang mở __đúng thư mục__ `~/ba-kit-thu` không. Rồi hỏi AI: *"Liệt kê các skill trong .claude/skills/ giúp tôi"* |
| Skill báo thiếu file | Copy sót phụ thuộc. Hỏi AI: *"Kiểm mọi đường dẫn @ trong .claude/skills/ xem file nào chưa có, rồi copy nốt từ `<đường-dẫn-ba-kit>`"* |
| Skill ghi file mà không hỏi | Thiếu `approval-gate.md` trong `.claude/rules/` |
| Skill hỏi kiểu kỹ thuật (tên bảng, tên API) | Thiếu `ba-conventions.md` |
| Muốn xoá hết làm lại | Hỏi AI: *"Xoá hết file vừa copy, đưa thư mục về trạng thái sạch"* — hoặc gõ `git clean -fd && git restore .` |

***

## Cài thêm công cụ (chỉ khi cần)

Bốn skill ở trên chạy được ngay, không cần cài gì thêm. Nhưng vài skill khác cần công cụ ngoài:

| Công cụ | Skill cần nó | Cài thế nào |
|---|---|---|
| Node.js | `/bpmn`, `/kg`, kiểm cú pháp sơ đồ | [nodejs.org](https://nodejs.org) |
| `@mermaid-js/mermaid-cli` | Render sơ đồ ra ảnh PNG | `npm install -g @mermaid-js/mermaid-cli` |
| `d2` | `/d2-activity`, `/d2-erd`, `/d2-architect` | [d2lang.com](https://d2lang.com) |
| `pandoc` | `/export` ra file DOCX | [pandoc.org](https://pandoc.org) |

Một số skill có __engine__ riêng cần cài thư viện trước khi dùng:

```bash
cd .claude/skills/bpmn/engine
npm ci
```

> `npm ci` là lệnh tải các thư viện mà engine cần (giống cài phần mềm phụ trợ). Cần có Node.js trước. Chỉ chạy một lần cho mỗi engine.
>
> Không quen gõ lệnh thì nhờ AI: *"Cài engine cho skill /bpmn giúp tôi"* — nó chạy hộ và báo nếu thiếu Node.js.

Chưa cần cài mấy thứ này ngay. Khi nào dùng tới skill tương ứng thì quay lại.

***

## Về quyền và dữ liệu

Câu hỏi hay gặp: __cấp quyền đọc file cho AI thì dữ liệu công ty đi đâu?__

Hai điều cần biết:

__1. Các bạn kiểm soát được phạm vi.__ File `.claude/settings.json` khai báo AI được đọc gì, ghi gì. Ví dụ:

```json
"permissions": {
  "allow": ["Read(*)", "Edit(docs/**)"],
  "deny":  ["Edit(.git/**)"]
}
```

Dòng `Edit(docs/**)` nghĩa là chỉ được sửa file trong `docs/`, không đụng được chỗ khác.

__2. Chính sách dữ liệu là của Anthropic, không phải của bộ skill này.__ Bộ skill chỉ là file text hướng dẫn — nó không gửi dữ liệu đi đâu cả. Việc dữ liệu có được dùng để huấn luyện hay không phụ thuộc gói các bạn đăng ký với Anthropic. Đọc điều khoản của họ trước khi dùng với tài liệu nhạy cảm.

__Nguyên tắc an toàn:__ đừng để file chứa khoá API, mật khẩu hay dữ liệu khách hàng thật trong thư mục dự án khi thử nghiệm.

***

## Bước tiếp theo

Chạy thử xong rồi, giờ mới đến lúc quyết định giữ gì:

| Muốn gì | Đọc chương |
|---|---|
| Hiểu skill/rule/hook khác nhau ra sao, sửa ở đâu | [02](02-hieu-cau-truc-bo-kit.md) |
| Biết cài bao nhiêu skill là hợp lý | [04](04-skill-preload-va-token.md) |
| Ghép luồng làm việc của riêng mình | [03](03-chon-pipeline-cua-ban.md) |
| Mang skill về dự án thật | [06](06-copy-skill-ve-du-an.md) |

***

## Tóm tắt

- Claude Code chạy __trên máy các bạn__ và __đọc/ghi được file dự án__ — dùng qua __ứng dụng Claude__, __extension VS Code__, hoặc __dòng lệnh__, cả ba như nhau.
- Thử trên __thư mục riêng__ trước, có `git init` để hoàn tác được.
- Bắt đầu với __4 skill__, đừng copy cả bộ. __Nhờ AI dò phụ thuộc rồi copy__ — bốn skill đó kéo theo 23 file, copy tay là thiếu.
- Chạy `/brainstorm` rồi `/srs` để thấy skill nối nhau.
- Bốn dấu hiệu bộ chạy đúng: __hỏi lại khi thiếu__, __xin phép trước khi ghi__, __file ra đúng chỗ__, __skill sau đọc được output skill trước__.
- Không biết dùng skill nào thì __hỏi thẳng AI__ — nhớ __đưa đường dẫn thư mục gói__ vào câu hỏi, và bắt nó __trích dẫn file__ làm bằng chứng.

***

Chương tiếp: [02 — Bộ Kit gồm những gì, và sửa ở đâu](02-hieu-cau-truc-bo-kit.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
