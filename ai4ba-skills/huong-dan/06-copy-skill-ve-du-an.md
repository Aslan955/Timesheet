# 06 — Copy skill về dự án thật‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Chương này là phần thao tác quan trọng nhất: **mang skill từ bộ này về dự án thật của các bạn**.
>
> Tin tốt: các bạn không phải gõ lệnh nào cả. Có một prompt làm hết — dán vào là xong.

---

## Vì sao đừng copy cả thư mục `.claude/`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Ba lý do, xếp theo mức độ đau:

**1. Tốn tiền mãi mãi.** Mô tả của những skill mà AI được phép tự gọi sẽ được nạp vào mọi phiên chat — dùng hay không dùng. Xem [chương 04](04-skill-preload-va-token.md).

**2. AI chọn sai skill.** Bốn skill cùng vẽ sơ đồ luồng, ba skill cùng vẽ mô hình dữ liệu — càng nhiều lựa chọn gần nghĩa, AI càng dễ chọn nhầm.

**3. Đè mất cấu hình cũ.** Dự án các bạn có thể đã có `.claude/settings.json` riêng. Copy đè là xoá mất.

Cách đúng: **chọn 5-10 skill khớp việc của các bạn, copy kèm đúng thứ chúng cần.**

Nhưng "đúng thứ chúng cần" không dễ đoán. Mỗi skill khai phụ thuộc bằng dòng `@` trong file của nó, và những phụ thuộc đó **lồng nhau** — rule này tham chiếu rule kia. Riêng `/srs` cần **11 file**; bốn skill khởi đầu cộng lại là **23 file**.

Đó là lý do nên để AI dò, đừng copy tay.

---

## Prompt copy skill — dán vào là xong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

**Bước 1:** mở Claude Code **trong thư mục dự án đích** của các bạn.

**Bước 2:** dán prompt này, điền 3 chỗ trong ngoặc vuông:

```text
Tôi có bộ BA-Kit giải nén ở: [đường dẫn tới thư mục ba-kit]

Dự án của tôi: [mô tả ngắn — làm gì, tài liệu hiện để ở thư mục nào]

Tôi muốn mang về các skill: [liệt kê, ví dụ: brainstorm, srs, user-flow, userstory]

Làm giúp tôi theo thứ tự sau. CHƯA COPY GÌ CẢ — đưa kế hoạch trước:

1. Chụp ảnh an toàn: chạy `git add -A && git commit` để tôi quay lại được
   nếu hỏng. Dự án chưa có git thì chạy `git init` trước.

2. Với mỗi skill tôi chọn, mở SKILL.md của nó trong
   [đường dẫn ba-kit]/claude-code/.claude/skills/<tên>/ và liệt kê ĐỆ QUY
   mọi thứ nó cần:
   - Dòng bắt đầu bằng @ (rule, template — thường ở mục References cuối file)
   - Rule tìm được cũng có thể tham chiếu rule khác → dò tiếp tới khi hết
   - Agent nó gọi ra (tìm chữ "Task tool", "reviewer", "subagent_type")
   - Công cụ ngoài cần cài (node, mmdc, d2, pandoc, playwright, MCP...)

3. Cho tôi xem BẢNG kế hoạch: | file | copy đi đâu | vì sao cần |
   Kèm danh sách công cụ ngoài tôi phải tự cài (nếu có).

4. Sau khi tôi duyệt: copy sang dự án này, giữ đúng cấu trúc thư mục
   (.claude/skills/, .claude/rules/, .claude/agents/, _templates/).

5. Kiểm lại: với mỗi skill vừa copy, xác nhận mọi đường dẫn @ bên trong đều
   trỏ tới file có thật. Báo tôi nếu còn thiếu.

6. Rà chỗ hard-code: skill viết cho cấu trúc docs/{feature}/. Nếu dự án tôi
   khác, chỉ ra những chỗ cần đổi — nhưng ĐỪNG tự đổi, hỏi tôi trước.

7. Viết lại CLAUDE.md cho dự án này: chỉ mô tả skill tôi vừa lấy, đường dẫn
   theo cấu trúc của tôi. Đừng copy nguyên CLAUDE.md của bộ gốc.

Show diff trước mỗi lần ghi file.
```

**Ba câu quan trọng nhất trong prompt trên:**

* *"CHƯA COPY GÌ CẢ — đưa kế hoạch trước"* — để các bạn thấy nó định làm gì
* *"liệt kê ĐỆ QUY"* — không có chữ này, AI dò một tầng rồi dừng, thiếu file
* *"show diff trước mỗi lần ghi"* — để không bị sửa hàng loạt sau lưng

> **Không dùng Claude Code ở dự án đích được?** Mở nó trong thư mục ba-kit rồi thêm câu: *"Dự án đích của tôi ở [đường dẫn], copy sang đó."*

---

## Chọn skill nào để bắt đầu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Chưa biết chọn gì thì lấy một trong ba gói này, dán vào chỗ "Tôi muốn mang về các skill":

```text
▸ TỐI THIỂU — chạy được ngay, không cần cài công cụ ngoài
  brainstorm, srs, user-flow, wireframe-ascii

▸ TIÊU CHUẨN — thêm phần đặc tả và kiểm tra
  Gói tối thiểu + urd, brd, prd-epic, usecase, userstory, ac, sequence, erd, gap

▸ ĐẦY ĐỦ — khi đã quen và có nhu cầu thật
  Gói tiêu chuẩn + họ API, đồng bộ Jira/Confluence, bộ test, dashboard, kg
```

Không cần liệt kê rule và agent — AI tự dò ra từ skill.

Nguyên tắc: **bắt đầu từ gói tối thiểu, thêm dần khi thật sự thiếu.** Ngược lại (cài đầy đủ rồi bỏ bớt) gần như không ai làm nổi — vì bỏ thứ mình chưa dùng bao giờ thì khó biết bỏ cái nào.

---

## Chạy thử trước khi dùng thật‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Copy xong, đừng nhảy vào dự án thật ngay. Tạo một feature giả:

```
/srs test-nhap
```

Kiểm ba tình huống:

| Tình huống | Kỳ vọng |
|---|---|
| Trả lời đầy đủ | Chạy trơn, file ra đúng chỗ |
| **Có câu các bạn nói "chưa rõ"** | **Ghi open question — không tự bịa** |
| Chạy lại lần hai trên feature đó | Hiện diff cho duyệt, không ghi đè im lặng |

Tình huống thứ hai là phép thử quan trọng nhất. **Nếu AI tự điền thông tin nó không có, nghĩa là thiếu rule** — hỏi AI: *"Skill này vừa tự bịa thông tin. Kiểm xem đã copy đủ rule chưa, nhất là `ba-conventions.md`."*

Xong thì lưu lại:

```
Commit giúp tôi những gì vừa copy, ghi rõ là import skill từ BA-Kit
```

---

## Bốn rule luôn cần — biết để kiểm

AI sẽ tự dò ra, nhưng các bạn nên biết bốn cái này để kiểm nó làm đúng chưa:

| Rule | Thiếu nó thì sao |
|---|---|
| `approval-gate` | Skill **ghi file mà không hỏi** |
| `ba-conventions` | Skill hỏi lại câu đã trả lời, hoặc hỏi bằng ngôn ngữ dev |
| `naming-conventions` | File đặt tên lung tung, mã ID không nhất quán |
| `feature-bootstrap` | Gặp feature chưa tồn tại thì xử lý sai |

Thiếu chúng skill **vẫn chạy** — chỉ hành xử sai. Nên đây là chỗ đáng liếc qua sau khi copy.

---

## Thứ gì copy được, thứ gì không

| Loại | Xử lý |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
|---|---|
| `SKILL.md`, rule, agent, template | ✅ Copy thẳng |
| Script Python (`_scripts/*.py`) | ✅ Copy thẳng |
| Engine Node (`skills/*/engine/`) | ⚠️ Copy code + `package.json`, rồi chạy `npm ci`. **Đừng copy `node_modules`** — nó chứa file biên dịch theo hệ điều hành |
| Hook (`.claude/hooks/*.sh`) | ⚠️ Copy, `chmod +x`, rồi **khai báo trong `settings.json`** — quên khai báo thì hook nằm im |
| `.claude/settings.json` | ⚠️ **Gộp thủ công**, đừng copy đè |
| `.claude/state/` | ❌ **Không copy từ dự án khác** — nó ghi trạng thái đồng bộ của dự án gốc |
| File `.env`, token, khoá API | ❌ **Không bao giờ copy.** Cũng đừng commit |

Prompt ở trên đã xử lý mấy trường hợp này, nhưng biết để kiểm lại vẫn hơn.

> **Về `.claude/state/`:** không copy từ nơi khác, nhưng **một khi đã sinh ra ở dự án của các bạn thì nên commit** — nếu nhiều người cùng đồng bộ Jira/Confluence, ai cũng cần thấy cùng một trạng thái. Điều kiện: state **tuyệt đối không chứa token**.

---

## Nếu skill cần công cụ ngoài

Vài skill cần phần mềm cài thêm. Prompt ở trên đã bắt AI liệt kê — nhờ nó cài luôn:

```
Cài giúp tôi những công cụ mà mấy skill vừa copy cần. Kiểm cái nào có rồi,
cái nào thiếu, rồi hướng dẫn tôi cài từng cái.
```

Danh sách thường gặp: **Node.js** (engine BPMN, kiểm sơ đồ), **mmdc** (render Mermaid ra ảnh), **d2** (sơ đồ D2), **pandoc** (xuất DOCX).

> **Riêng `/figma`:** gói này kèm sẵn **Reqwise Figma MCP** trong thư mục `mcp-figma/`. Xem `mcp-figma/README.md` — cũng có prompt nhờ AI cài hộ.

---

## Khi nhiều người cùng dùng một repo

Nếu cả team dùng chung bộ skill, thống nhất trước ba điều — nếu không sẽ thành mỗi người một bản:

**1. Ai sở hữu `.claude/`.** Chỉ định một người chịu trách nhiệm duyệt thay đổi trong `.claude/skills/` và `.claude/rules/`. Không phải để kiểm soát — mà để khi hai người cùng sửa một rule thì có người quyết.

**2. Sửa skill đi qua pull request như code.** `SKILL.md` là file văn bản, xung đột merge xử lý y như code.

**3. Ghi lại mình đã import từ đâu.** Commit riêng bản gốc **trước khi sửa**, ghi rõ phiên bản BA-Kit trong thông điệp commit. Sau này có bản mới, các bạn mới so được ba chiều — xem [chương 07](07-tuy-bien-skill.md).

---

## Cách kiểm AI không "diễn"

AI nói rất trôi chảy về những thứ nó chưa đọc. Ba cách kiểm nhanh:

* **Kiểm skill có thật:** hỏi *"Liệt kê thư mục `.claude/skills/` giúp tôi"* — đối chiếu với danh sách nó vừa đưa
* **Bắt trích dẫn:** *"Trích đúng dòng trong SKILL.md làm bằng chứng"*
* **Chặn trước khi ghi:** *"Chưa tạo hay sửa gì — liệt kê file sẽ tác động trước"*

AI là tra cứu viên nhanh, không phải nguồn sự thật. Nó chỉ đường. Các bạn là người quyết.

---

## Xử lý sự cố

| Triệu chứng | Hỏi AI thế này |
|---|---|
| Gõ `/tên-skill` không thấy gì | *"Kiểm `.claude/skills/` xem skill đã ở đúng chỗ chưa, và frontmatter có lỗi cú pháp không"* |
| Skill chạy nửa chừng báo thiếu file | *"Dò lại đệ quy mọi đường dẫn @ trong skill này, copy nốt cái nào thiếu"* |
| Skill ghi file mà không hỏi | Thiếu `approval-gate.md` — *"Copy nốt rule approval-gate"* |
| Skill hỏi kiểu dev (tên bảng, tên API) | Thiếu `ba-conventions.md` |
| File ra sai chỗ | Chưa sửa đường dẫn — xem [chương 05](05-cau-hinh-output.md) |
| Hook không chạy | *"Kiểm hook đã `chmod +x` và khai báo trong settings.json chưa"* |
| Lỗi Node khi chạy engine | *"Xoá node_modules rồi chạy npm ci lại giúp tôi"* |

---

## Tóm tắt

* **Một prompt làm hết** — không cần gõ lệnh. Điền 3 chỗ trong ngoặc vuông rồi dán.
* Ba câu bắt buộc có trong prompt: **"chưa copy gì, đưa kế hoạch trước"**, **"liệt kê đệ quy"**, **"show diff trước khi ghi"**.
* Copy **từng skill kèm phụ thuộc**, không copy cả thư mục — bốn skill khởi đầu đã kéo theo 23 file.
* **Chạy thử feature nháp** trước khi dùng thật. Phép thử quan trọng nhất: nói *"chưa rõ"* thì AI có **ghi open question** không, hay tự bịa.
* **Không copy** `node_modules`, `.claude/state/` từ nơi khác, file `.env`. **Gộp thủ công** `settings.json`.
* Bốn rule luôn cần: `approval-gate`, `ba-conventions`, `naming-conventions`, `feature-bootstrap` — biết để kiểm AI làm đúng chưa.

---

Chương tiếp: [07 — Tùy biến skill](07-tuy-bien-skill.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
