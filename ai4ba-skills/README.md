# BA-Kit — Bộ skill AI cho IT BA / PO / PM‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Bộ skill chạy trên __Claude Code__, đóng gói những task lặp đi lặp lại của IT BA/PO: làm rõ ý tưởng, viết SRS, vẽ sơ đồ, dựng wireframe, bóc user story, kiểm gap, test API, bàn giao tài liệu.
>
> __Đây là bộ tham khảo, không phải chuẩn bắt buộc.__ Hãy lấy phần hợp, bỏ phần thừa, sửa phần lệch cho khớp cách bạn thật sự làm việc. Xem [`huong-dan/00-doc-cai-nay-truoc.md`](huong-dan/00-doc-cai-nay-truoc.md) trước khi copy bất cứ thứ gì.

---

## Bắt đầu ở đâu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Bạn là ai | Đọc theo thứ tự này |
|---|---|
| Mới hoàn toàn, chưa dùng Claude Code | **Mở `HUONG-DAN-BA-KIT.html`** (double-click) → chương 00 → 01 → 02 |
| Đã dùng Claude Code, muốn lắp vào dự án | Chương 00 → 03 (chọn skill) → 05 (cấu hình output) → 06 (copy skill) |
| Muốn xem output trông thế nào trước khi quyết | Mở `example/README.md` |
| Không biết bắt đầu hỏi AI thế nào | Chương 01, mục "Không biết dùng skill nào? Hỏi thẳng AI" |
| Dùng Codex CLI / Antigravity, không dùng Claude | Chương 08 |

---

## Gói này có gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
ba-kit/
├── README.md                      ← bạn đang đọc
├── LICENSE                        ← điều khoản sử dụng (đọc trước khi chia sẻ cho người khác)
├── HUONG-DAN-BA-KIT.html          ← ⭐ CỬA VÀO: hướng dẫn + 64 bài giải thích skill, 1 file
│
├── huong-dan/                     ← 10 chương hướng dẫn (nguồn .md của file HTML)
│   ├── 00-doc-cai-nay-truoc.md    ← bộ này là gì, đến từ đâu, và vì sao đừng bê nguyên
│   ├── 01-bat-dau-nhanh.md        ← Claude Code là gì + chạy thử trong 15 phút
│   ├── 02-hieu-cau-truc-bo-kit.md ← 6 thành phần + cách đọc một SKILL.md
│   ├── 03-chon-pipeline-cua-ban.md ← ghép skill thành luồng riêng của bạn
│   ├── 04-skill-preload-va-token.md ← vì sao càng nhiều skill càng tốn tiền
│   ├── 05-cau-hinh-output.md      ← file ra ở đâu, đặt tên thế nào (đổi cấu trúc docs/)
│   ├── 06-copy-skill-ve-du-an.md  ← prompt để AI copy skill về dự án của bạn
│   ├── 07-tuy-bien-skill.md       ← đổi template, đổi logic, viết skill mới, đổi ngôn ngữ
│   ├── 08-mang-sang-codex-antigravity.md ← prompt copy-paste cho agent khác
│   └── 09-vi-sao-khong-hop-ai-chat.md ← vì sao claude.ai/ChatGPT chưa phải chỗ dùng bộ này
│
├── explain-skills/                ← 64 bài giải thích nghiệp vụ từng skill (không kỹ thuật)
│
├── example/                       ← OUTPUT THẬT của 2 feature chạy qua bộ skill
│   ├── README.md                  ← bản đồ: file này do skill nào sinh ra
│   ├── authentication/            ← 75 file: brainstorm → SRS → wireframe → story → test → BPMN
│   ├── premium-payment/           ← 63 file: thêm nhánh tích hợp API + test Bruno
│   └── _shared/kg/kg-viewer.html  ← ⭐ bản đồ liên hệ 691 điểm — mở bằng trình duyệt
│
├── mcp-figma/                     ← Reqwise Figma MCP (tùy chọn, chỉ cần khi dùng `/figma`)
│
└── claude-code/                   ← BỘ NGUYÊN BẢN để copy vào workspace của bạn
    ├── .claude/
    │   ├── skills/                ← 57 skill (55 gọi bằng `/lệnh`, 2 skill nền)
    │   ├── agents/                ← 12 agent review (senior-ba, qa-reviewer, flow-reviewer...)
    │   ├── rules/                 ← 19 rule dùng chung (approval-gate, naming, ba-conventions...)
    │   ├── hooks/                 ← 9 hook tự chạy (changelog, staleness, session-init)
    │   ├── scripts/               ← script hỗ trợ (mermaid-verify, diagram gates...)
    │   └── settings.json          ← cấu hình quyền + hook (merge có chọn lọc, đừng copy đè)
    ├── _templates/                ← 48 khung file mẫu
    ├── _scripts/                  ← helper Python (build preview, export, workspace-status)
    └── CLAUDE.md                  ← mô tả cấu trúc + quy ước cho AI đọc
```

---

## Bộ này giải quyết vấn đề gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nhiều BA và PO dùng AI theo cách rất quen: một thư mục prompt, vài đoạn chat hay, một mẫu lấy trên mạng rồi sửa lại mỗi lần cần.

Cách đó không sai. Nhưng khi task lặp lại nhiều lần, prompt rời rạc bắt đầu lộ vấn đề. Người này viết một kiểu, người khác viết một kiểu. AI quên đọc SRS. Một rule đã chốt lại bị AI tự thêm cách hiểu khác. Đến lúc review mới thấy tài liệu không khớp nhau.

BA-Kit cố giải quyết phần đó: mỗi skill không chỉ có câu lệnh, mà còn có __bối cảnh phải đọc__, __rule phải giữ__, __format đầu ra__, __điểm phải hỏi lại__ và __bước review trước khi output đi tiếp__.

| Prompt pack | BA-Kit |
|---|---|
| tập trung vào câu lệnh cho một lần chạy | tập trung vào task lặp lại trong workflow |
| context do bạn dán thủ công mỗi lần | quy định rõ tài liệu và context cần đọc |
| đầu ra có thể thay đổi mỗi lần | có output format và rule rõ hơn |
| dễ bỏ qua bước kiểm | có review gate và điểm cần xác nhận |
| ít để ý tài liệu sau đó | có changelog, traceability và tác động downstream |

---

## Ba điều cần biết trước khi dùng‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__1. Bộ này nặng, và nặng là có chủ đích.__
57 skill được viết cho nhiều loại đối tượng và nhiều loại dự án. Bạn gần như chắc chắn __không dùng hết__. Cài cả bộ vào một workspace thật là cách nhanh nhất để đốt tiền token vô ích — vì mọi skill đều được nạp mô tả vào đầu mỗi phiên chat. Chương 04 giải thích kỹ chuyện này.

__2. Copy từng skill, đừng copy cả thư mục.__
Cách dùng đúng là chọn 5–10 skill khớp việc của bạn, copy kèm rule/agent/template mà chúng cần, rồi nối lại thành pipeline riêng. Chương 06 có checklist và câu lệnh dò dependency.

__3. Skill viết bằng tiếng Việt là có lý do.__
Thông thường skill nên viết tiếng Anh cho gọn token. Bộ này để tiếng Việt vì nó phục vụ việc dạy và thị trường Việt Nam — bạn cần __đọc hiểu được__ thì mới sửa được. Khi mang vào dự án thật, nên nhờ AI dịch skill bạn giữ lại sang tiếng Anh. Chương 07 có prompt sẵn.

---

## Bộ này KHÔNG làm được gì

Nói thẳng để bạn kỳ vọng đúng:

* Không tự chạy end-to-end thay bạn. Nó dừng ở các cổng duyệt để bạn quyết.
* Không đi phỏng vấn stakeholder, không biết chính sách nội bộ mà tài liệu chưa ghi.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
* Input mơ hồ thì output mơ hồ theo. Rule chưa ghi thì AI có thể điền bằng một giả định nghe rất hợp lý.
* Sơ đồ đúng cú pháp vẫn có thể thiếu nhánh nghiệp vụ.
* Kiểm gap chỉ gợi ý chỗ đáng nghi, không xác nhận được sự thật.

BA-Kit phù hợp nhất khi bạn __đã có tư duy phân tích__ và muốn giảm việc lặp lại. Nó giúp giữ cách làm nhất quán hơn. Nó không thay quyền phán đoán của bạn.

---

## Yêu cầu môi trường

| Bắt buộc | Ghi chú |
|---|---|
| [Claude Code](https://claude.com/claude-code) | Bộ này thiết kế cho AI Coding Agent, không phải giao diện chat. Xem chương 09 để hiểu vì sao. |
| Git | Lưới an toàn để rollback khi tùy biến hỏng. |

| Tùy chọn (chỉ cần khi dùng skill tương ứng) | Dùng cho |
|---|---|
| Node.js | `/bpmn`, `/kg`, `/playwright-gen`, kiểm cú pháp Mermaid |
| `@mermaid-js/mermaid-cli` + Chrome | render sơ đồ Mermaid ra ảnh |
| `d2` | `/d2-activity`, `/d2-erd`, `/d2-architect` |
| `pandoc` | `/export` ra DOCX |
| MCP Atlassian | `/jira`, `/confluence` |
| __Reqwise Figma MCP__ (đính kèm trong gói — xem `mcp-figma/`) | `/figma` |

Chi tiết cài đặt ở chương 01.

---

## Về AI4BA

Bộ này được xây trong quá trình giảng dạy khoá __AI4BA__ — hơn 300 học viên đã tham gia. Nhiều học viên dùng nó làm điểm khởi đầu rồi tự dựng workflow riêng; một số BA Manager và Product Manager đã mang về áp dụng cho team của họ.

Nội dung và cách làm đến từ kinh nghiệm thực tế của __Hoàng Phan__ ([hoangphan.blog](https://hoangphan.blog)) ở các vai trò IT BA, Product Owner và Product Manager.

__Mua bộ BA-Kit:__ [ai4ba.com/ba-kit](https://ai4ba.com/ba-kit)

### Muốn tự build skill của riêng mình?

Bộ này cho bạn *cái để tham khảo*. Nếu bạn muốn tự build skill, agent và workflow AI cho đúng cách làm của mình — và có người hướng dẫn khi bị kẹt — thì khoá học là bước tiếp theo:

> __Khoá học AI4BA v2 · Trọn gói__
> Không chỉ dùng bộ skills có sẵn — học cách tự build skills, agents và workflow AI cho công việc BA.
>
> 👉 [ai4ba.com](https://ai4ba.com)
>
> __Mua bộ BA-Kit từ ai4ba.com được giảm 500.000đ khi đăng ký khoá học.__

Khoá học dành cho bạn nào mua bộ này về rồi thấy: *"hiểu rồi đấy, nhưng tự custom cho khớp team mình thì vẫn loay hoay"*.

---

## Đọc tiếp

* [`huong-dan/00-doc-cai-nay-truoc.md`](huong-dan/00-doc-cai-nay-truoc.md) — bắt buộc đọc trước khi copy
* [`example/README.md`](example/README.md) — xem output thật trông thế nào
* [`LICENSE`](LICENSE) — điều khoản sử dụng‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
