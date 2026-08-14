# 08 — Mang sang Codex, Antigravity và agent khác‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Bộ này viết cho Claude Code. Nhưng nếu công ty các bạn đang dùng Codex CLI hoặc Google Antigravity thì vẫn mang sang được — chỉ cần hiểu __chuyển cái gì giữ nguyên, cái gì phải thiết kế lại__.

---

## Nguyên tắc: copy logic, đừng copy cấu trúc‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Copy nguyên thư mục `.claude/` sang nền tảng khác có thể __nhìn giống nhau nhưng không hành xử giống nhau__.

Cùng gọi là "skill", "agent", "hook" — nhưng mỗi nền tảng có vòng đời và phạm vi riêng. Một agent ở Claude Code chạy trong phiên tách biệt; ở nền tảng khác "agent" có thể chỉ là một đoạn chỉ dẫn.

Nên trước khi copy, hãy __lập bảng ánh xạ__, rồi mới quyết định file nào giữ, file nào viết lại.

Tin tốt: phần lớn nội dung bộ này là __markdown mô tả quy trình__ — thứ đó chuyển đi đâu cũng dùng được. Phần phải sửa thường chỉ là đường dẫn, định dạng agent, và cách khai hook.

---

## Bảng ánh xạ ba nền tảng‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Thành phần | Claude Code | Codex CLI | Antigravity |
|---|---|---|---|
| Skill | `.claude/skills/{tên}/SKILL.md` | `.codex/skills/{tên}/SKILL.md` | `.agents/skills/{tên}/SKILL.md` |
| Rule | `.claude/rules/*.md` | `.codex/rules/*.md` | Gộp vào file nền hoặc thư mục rules tương ứng |
| Agent | `.claude/agents/{tên}.md` (Markdown + frontmatter) | `.codex/agents/{tên}.toml` (đổi định dạng) | Theo cơ chế agent của nền tảng |
| Script / engine | `.claude/scripts/*.mjs` | `.codex/scripts/*.mjs` | Giữ nguyên |
| Template | `_templates/` | `_templates/` | `_templates/` |
| File nền | `CLAUDE.md` | `AGENTS.md` | Theo quy ước nền tảng |
| Hook | `.claude/hooks/` + `settings.json` | Kiểm cơ chế tương đương | Kiểm cơ chế tương đương |

---

## Cách làm: để AI tự port‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Không cần các bạn tự gõ từng lệnh. Cách hiệu quả là mở __chính agent đích__ (Codex hoặc Antigravity) lên rồi đưa prompt cho nó tự chuyển.

Vì sao dùng agent đích? Vì nó đọc được tài liệu và biết quy ước của chính nó — Claude Code không chắc biết Codex đọc thư mục nào.

### Prompt cho Codex CLI‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Mở Codex CLI trong thư mục dự án của các bạn, dán prompt này:

```text
Tôi có một bộ skill viết cho Claude Code, đặt tại [đường dẫn tới ba-kit/claude-code].
Tôi muốn port sang Codex CLI để dùng trong dự án này.

Tôi chỉ muốn mang các skill sau: [liệt kê 5-10 skill].

Làm theo thứ tự, CHƯA TẠO FILE NÀO — đưa kế hoạch trước:

1. Đọc tài liệu chính thức của Codex CLI về skills, rules, agents và file nền
   AGENTS.md. Tóm tắt cơ chế thật, đừng suy đoán.

2. Đọc từng SKILL.md tôi chọn. Với mỗi cái, liệt kê ĐỆ QUY mọi phụ thuộc:
   rule nào, agent nào, template nào, script nào, công cụ ngoài nào.

3. Lập bảng ánh xạ:
   | Thành phần nguồn | Đích ở Codex | Giữ nguyên hay thiết kế lại? | Vì sao |

4. Chỉ ra thứ KHÔNG có tương đương ở Codex — ví dụ hook tự chạy sau khi ghi file,
   hoặc cơ chế agent phụ. Với mỗi cái, đề xuất phương án thay thế hoặc nói thẳng
   là phải bỏ.

5. Liệt kê mọi đường dẫn cần sửa (tham chiếu .claude/... trong SKILL.md).

6. Đề xuất nội dung AGENTS.md — chỉ mô tả skill tôi thật sự mang sang.

Sau khi tôi duyệt kế hoạch, thực hiện từng mục và show diff trước mỗi lần ghi.
```

### Prompt cho Antigravity (IDE hoặc CLI)

Mở Antigravity — bản IDE hoặc bản CLI, tùy các bạn đang dùng cái nào — trong thư mục dự án, rồi dán prompt này. Nhớ điền đúng biến thể ở dòng đầu, vì IDE và CLI đọc cấu hình khác nhau.

```text
Tôi đang dùng Antigravity bản [IDE / CLI — ghi rõ một cái].

Tôi có bộ skill viết cho Claude Code tại [đường dẫn tới ba-kit/claude-code],
muốn dùng trong Antigravity.

Skill tôi cần: [liệt kê 5-10 skill].

Làm theo thứ tự, CHƯA TẠO FILE NÀO — đưa kế hoạch trước:

1. Tra tài liệu chính thức MỚI NHẤT của Antigravity (bản online hôm nay, không
   dùng trí nhớ của bạn — cơ chế này thay đổi nhanh) về: Agent Skills, rules,
   subagent, và file cấu hình nền. Trả lời rõ:
   - thư mục nào được đọc tự động, cho bản [IDE / CLI] tôi đang dùng
   - định dạng file nào được chấp nhận (Markdown? frontmatter gì? TOML?)
   - skill được kích hoạt ra sao (gõ lệnh, hay model tự chọn theo mô tả)
   - có cơ chế chạy script/hook theo sự kiện không
   Ghi kèm link tài liệu cho mỗi ý. Chỗ nào tài liệu không nói rõ thì ghi
   "tài liệu không nêu", đừng suy đoán.

2. Đọc từng SKILL.md tôi chọn. Với mỗi cái, liệt kê ĐỆ QUY mọi phụ thuộc:
   rule nào, agent nào, template nào, script nào, công cụ ngoài nào.

3. Lập bảng ánh xạ:
   | Thành phần nguồn | Đích ở Antigravity | Giữ nguyên hay thiết kế lại? | Vì sao |

4. Chỉ ra thứ KHÔNG có tương đương — ví dụ hook tự chạy sau khi ghi file,
   agent phụ chạy phiên riêng, cổng duyệt trước khi ghi file. Với mỗi cái,
   đề xuất cách bù đắp hoặc nói thẳng là phải bỏ.

5. Liệt kê mọi đường dẫn cần sửa (tham chiếu .claude/... trong SKILL.md).

6. Đề xuất kế hoạch file: tạo gì, đặt ở đâu, nội dung ra sao — kèm nội dung
   file cấu hình nền, chỉ mô tả skill tôi thật sự mang sang.

Duyệt xong tôi mới cho làm, và show diff trước mỗi lần ghi.
```

---

## Ba thứ hay mất khi port

Nói trước để các bạn khỏi ngạc nhiên.

### 1. Cổng duyệt trước khi ghi file

Trong bộ này, L1/L2/L3 là __luật viết trong rule__ — model đọc và tuân theo. Nó không phải cơ chế kỹ thuật chặn ở tầng hệ thống.

Nghĩa là khi port sang nền tảng khác, cổng duyệt vẫn "chuyển" được (vì nó chỉ là chữ trong file rule), nhưng nó __cũng chỉ đáng tin bằng đúng mức model chịu nghe lời__ — y như ở Claude Code.

Muốn chặn cứng thì phải dùng cơ chế phân quyền hoặc hook chặn-trước-khi-ghi của nền tảng đích, nếu nó có.

> Đây cũng là điều đáng biết ngay cả khi các bạn ở lại Claude Code: L1/L2/L3 là quy ước, không phải hàng rào.

### 2. Hook tự chạy

Hook trong bộ này chạy __sau khi__ file được ghi: cập nhật nhật ký thay đổi, đánh dấu tài liệu phía sau có thể lỗi thời.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nền tảng đích có thể không có cơ chế tương đương, hoặc có nhưng sự kiện khác. Hai lựa chọn:

- Bỏ hook, làm tay việc đó (ghi changelog thủ công)
- Chuyển thành **một bước trong `Approach` của skill** — kém tin cậy hơn (phụ thuộc model nhớ làm) nhưng vẫn hơn không có

### 3. Agent phụ chạy phiên riêng

Giá trị của agent review nằm ở chỗ nó đọc lại bằng __context sạch__, không bị ảnh hưởng bởi thứ vừa viết ra.

Nếu nền tảng đích không có cơ chế đó, "agent" biến thành một đoạn chỉ dẫn trong cùng phiên — vẫn có ích, nhưng mất phần lớn giá trị vì AI có xu hướng bảo vệ cái nó vừa viết.

Cách bù: chạy review thành __một phiên riêng biệt__ — mở phiên mới, đưa file vào, yêu cầu review. Thủ công hơn nhưng giữ được tinh thần.

---

## Kiểm tra sau khi port

Đừng tin "đã copy xong là chạy được". Chạy ba phép thử:

| Phép thử | Cách làm | Đạt khi |
|---|---|---|
| __Skill có được nhận không__ | Gõ lệnh gọi skill | Nó khởi động, không báo không tìm thấy |
| __Phụ thuộc có đủ không__ | Chạy một skill có tham chiếu rule và template | Chạy hết, không báo thiếu file |
| __Hành vi có giữ không__ | Cho input __thiếu__ một thông tin quan trọng | __Dừng hỏi__ hoặc ghi open question — không tự bịa |

Phép thử thứ ba quan trọng nhất. Nếu skill chạy nhưng bắt đầu tự điền thông tin, nghĩa là rule không được nạp — dù file đã nằm đúng chỗ.

---

## Dùng nhiều agent cùng lúc

Có một cách dùng thực dụng mà nhiều người bỏ qua: __không cần chọn một nền tảng.__

Các bạn có thể để `.claude/` và `.codex/` song song trong cùng dự án. Mỗi công cụ đọc thư mục của nó, không đụng nhau. Tài liệu sinh ra vẫn nằm chung trong `docs/`.

Cách này hữu ích khi:

- Muốn ý kiến thứ hai — cho hai agent cùng review một tài liệu rồi so
- Hết hạn mức bên này thì chuyển sang bên kia
- Mỗi công cụ mạnh một việc khác nhau

Cái giá phải trả: __duy trì hai bản skill__. Sửa một bên phải nhớ sửa bên kia, nếu không hai công cụ hành xử lệch nhau.

Nếu chọn cách này, nên giữ __một bản là gốc__ và ghi rõ trong file nền của cả hai bên là bản nào gốc.

---

## Tóm tắt

- __Copy logic, đừng copy cấu trúc.__ Cùng tên gọi không có nghĩa cùng cơ chế.
- Lập __bảng ánh xạ__ trước khi copy — để chính agent đích đọc tài liệu của nó rồi lập.
- Skill, rule, template, script __gần như giữ nguyên__. Agent phải đổi định dạng. Hook là chỗ rủi ro nhất.
- __Ba thứ hay mất:__ cổng duyệt (vốn chỉ là quy ước), hook tự chạy, agent chạy phiên riêng.
- Sau khi port, thử ba ca — quan trọng nhất là __input thiếu thì AI có dừng hỏi không__.
- Chạy nhiều nền tảng song song được, nhưng phải chấp nhận duy trì nhiều bản.

---

Chương tiếp: [09 — Vì sao không hợp AI Chat](09-vi-sao-khong-hop-ai-chat.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
