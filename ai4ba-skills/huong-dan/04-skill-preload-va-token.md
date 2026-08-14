# 04 — Skill preload và token: vì sao càng nhiều skill càng tốn tiền‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Chương trước các bạn vừa liệt kê ra luồng của mình — chắc khoảng 5-8 skill. Chương này giải thích vì sao **đừng lấy thêm cho chắc**.
>
> Nó nói về một cơ chế mà rất nhiều người không biết, rồi đến cuối tháng nhìn hoá đơn thấy lạ. Nếu các bạn chỉ đọc một chương kỹ thuật trong bộ hướng dẫn này, hãy đọc chương này.

---

## Câu chuyện ngắn trước‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Các bạn cài 50 skill vào workspace. Hôm nay chỉ định làm một việc: nhờ AI viết user story cho feature đăng nhập.

Các bạn mở phiên chat, gõ `/userstory authentication`. AI làm việc, ra kết quả tốt. Ổn.

Nhưng trước khi các bạn kịp gõ chữ đầu tiên, đã có một mớ token được nạp vào phiên đó — mô tả của những skill mà AI cần biết để tự gọi khi thấy phù hợp. Trong đó phần lớn là skill hôm nay các bạn không đụng tới.

Ngày mai mở phiên mới, mớ đó lại nạp lại. Ngày kia cũng vậy.

Mấy token đó không mua cho các bạn thứ gì cả.

---

## Cơ chế: cái gì được nạp, lúc nào‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Để AI **tự** gọi đúng skill khi cần, nó phải biết có những skill nào và mỗi cái làm gì. Nhưng nạp toàn bộ nội dung mọi skill thì context nổ ngay — riêng bộ này đã hơn một triệu ký tự.

Nên cơ chế chạy theo hai tầng:

```
┌──────────────────────────────────────────────────────────────┐
│  TẦNG 1 — DANH SÁCH SKILL (nạp ở MỌI phiên chat)            │
│                                                              │
│  Chỉ gồm name + description, và CHỈ của những skill mà      │
│  model được phép tự gọi.                                     │
│                                                              │
│  → Skill có `disable-model-invocation: true` KHÔNG nằm ở đây │
│  → Đây là chi phí cố định, trả ở mọi phiên                   │
└──────────────────────────────────────────────────────────────┘
                          ↓
              (chỉ khi skill được gọi thật)
                          ↓
┌──────────────────────────────────────────────────────────────┐
│  TẦNG 2 — NỘI DUNG SKILL (chỉ khi gọi)                      │
│                                                              │
│  Claude Code chạy các lệnh động trong skill, render toàn bộ  │
│  SKILL.md, rồi đưa vào hội thoại như MỘT khối.               │
│                                                              │
│  → Chỉ tốn khi các bạn thật sự dùng skill                    │
└──────────────────────────────────────────────────────────────┘
```

Hai điểm hay bị hiểu nhầm, nói rõ luôn:

**Không phải mọi skill đều nằm ở tầng 1.** Skill khai `disable-model-invocation: true` bị loại khỏi danh sách — model không thấy nó, nên nó không tốn gì cho tới khi các bạn gõ lệnh gọi.

**Nội dung skill được nạp một lần, không nạp tuần tự.** Khi skill được gọi, Claude Code render cả file rồi đưa vào một lượt. Không có chuyện "đọc Goal xong mới đọc Constraints".

---

## Con số thật của bộ này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đo trên chính bộ BA-Kit (đếm ký tự Unicode, ước lượng thô `ký tự ÷ 3`):

| Chỉ số | Giá trị |
|---|---:|
| Tổng số `SKILL.md` | 57 |
| Gọi được bằng lệnh (`user-invocable: true`) | 55 |
| Khai `disable-model-invocation: true` | 27 |
| **Thật sự nằm trong danh sách preload** | **30** |
| Mô tả của 30 skill đó | ~5.200 ký tự |
| **Preload mỗi phiên chat** | **~1.700 token** |
| Toàn bộ nội dung 57 `SKILL.md` (chỉ nạp khi gọi) | ~1.065.000 ký tự (~355.000 token) |

> `÷ 3` chỉ là ước lượng thô cho tiếng Việt. Token thật phụ thuộc tokenizer, và còn phần khung mà Claude Code bọc quanh danh sách skill. Đừng dùng con số này để tính hoá đơn — dùng nó để **so sánh trước và sau khi dọn**.

Điều đáng chú ý: bộ này có 57 skill nhưng chỉ 30 cái chiếm chỗ preload, vì gần một nửa đã tắt cờ tự-gọi. Đó là lựa chọn có chủ đích — skill nặng, ghi nhiều file thì nên bắt gọi tay.

Nếu các bạn copy cả bộ mà **không** giữ cờ đó, con số preload sẽ tăng gần gấp đôi.

---

## Nhưng đắt không phải vấn đề duy nhất‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nếu chỉ là tiền thì còn dễ chịu. Vấn đề thứ hai khó chịu hơn: **nhiều skill gần nghĩa làm AI chọn sai.**

Trong bộ này có những nhóm nghe rất giống nhau:

- `/activity` vs `/activity-swimlane` vs `/d2-activity` vs `/bpmn` — cả bốn đều "vẽ quy trình có nhánh"
- `/erd` vs `/d2-erd` vs `/dbdiagram` — cả ba đều "vẽ mô hình dữ liệu"
- `/wireframe-ascii` vs `/wireframe-html` vs `/prototype-html` vs `/figma` — cả bốn đều "dựng màn hình"
- `/prd` vs `/prd-epic` — một cái cấp sản phẩm, một cái cấp feature

Bộ này có hẳn tài liệu riêng để phân biệt (`explain-skills/diagram-selection.md`, `explain-skills/erd-family.md`). Nhưng các bạn thấy vấn đề rồi đấy: **phải có tài liệu hướng dẫn chọn skill nghĩa là việc chọn đang khó.**

Nếu chỉ giữ `/activity` và bỏ ba cái còn lại, câu hỏi "dùng cái nào" biến mất. AI không thể chọn sai khi chỉ có một lựa chọn.

> Nhiều skill gần nghĩa không làm workflow mạnh hơn. Nó làm việc chọn khó hơn — cho cả các bạn lẫn AI.

---

## Ba cờ quyết định skill tốn bao nhiêu

Chương [02](02-hieu-cau-truc-bo-kit.md) có bảng đầy đủ các trường trong frontmatter. Ở đây chỉ nói ba cái ảnh hưởng tới chi phí.

### `disable-model-invocation` — cờ quan trọng nhất về token

```yaml
disable-model-invocation: true
```

Nghĩa là: **model không thấy skill này**, nên nó không chiếm chỗ preload. Skill chỉ chạy khi các bạn gõ lệnh.

Đây là cờ đáng quan tâm nhất nếu muốn giảm chi phí. Trong bộ này 27/57 skill bật nó — chủ yếu là skill nặng, ghi nhiều file, hoặc chạy lâu.

**Khi tự viết skill: skill nào ghi file thì nên bật.** Vừa đỡ tốn, vừa tránh AI tự khởi động một quy trình viết tài liệu khi các bạn chỉ hỏi một câu.

### `user-invocable` — không phải cờ tiết kiệm token

```yaml
user-invocable: false
```

Cái này chỉ **ẩn skill khỏi danh sách lệnh `/`** của các bạn. Nó **không** làm skill biến mất khỏi context, và cũng không ngăn model tự gọi.

Đây là chỗ rất dễ hiểu nhầm. Bộ này có hai skill nền (`stacks-reference`, `code-explorer`) đặt `user-invocable: false` vì chúng không phải lệnh cho người dùng — nhưng nếu muốn chúng thật sự không tốn preload thì phải thêm `disable-model-invocation: true`.

Nhớ gọn: **`user-invocable` quản danh sách lệnh. `disable-model-invocation` quản token.**

### `description` — nội dung của phần preload

Vì `description` là thứ tốn token ở mọi phiên (với skill model-visible), nó cần vừa **ngắn** vừa **đủ để phân biệt**.

Một `description` tốt trả lời **một câu là chính**: khi nào dùng skill này. Chỉ thêm vế phân biệt khi thật sự có skill gần nghĩa dễ nhầm.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đừng thêm câu "Kích hoạt bằng `/tên-skill`" — skill vốn được gọi bằng tên của nó, và tham số đã khai ở `argument-hint`. Câu đó lặp lại thứ đã có.

```yaml
# ❌ Quá chung — AI không biết khi nào chọn cái này thay vì skill khác
description: Vẽ sơ đồ cho tài liệu.

# ❌ Quá dài — tốn token ở mọi phiên, mà phần thừa không giúp AI chọn
description: Skill này rất mạnh, giúp các bạn vẽ sơ đồ hoạt động chuyên nghiệp
  với nhiều tính năng như tự động kiểm tra cú pháp, render ra ảnh chất lượng cao,
  hỗ trợ nhiều định dạng, phù hợp với BA, PO, PM và cả developer...

# ✅ Vừa đủ
description: Dùng khi cần vẽ activity/flowchart Mermaid cho quy trình có nhiều
  nhánh quyết định. Khác `/bpmn` (chuẩn OMG) và `/activity-swimlane` (swimlane thật).
```

> Đừng biến `description` thành đoạn quảng cáo. AI không bị thuyết phục bởi tính từ — nó cần tín hiệu để phân biệt.

---

## Vậy nên cài bao nhiêu skill

Không có con số đúng cho mọi người. Nhưng đây là cách nghĩ thực dụng:

**Chỉ cài skill các bạn đã dùng ít nhất một lần trong tháng vừa rồi.**

Chưa biết mình dùng gì thì bắt đầu nhỏ rồi thêm dần:

```
▸ BẮT ĐẦU (4-6 skill) — chạy được ngay, không cần cài công cụ ngoài
  /brainstorm  → làm rõ ý tưởng thô
  /srs         → đặc tả nghiệp vụ
  /user-flow   → dựng luồng người dùng
  /userstory   → bóc story cho backlog
  (+ rule: approval-gate, ba-conventions, naming-conventions, feature-bootstrap)

▸ THÊM KHI CẦN
  Cần sơ đồ?          → chọn ĐÚNG MỘT trong /activity, /sequence, /erd
  Cần màn hình?       → chọn ĐÚNG MỘT trong /wireframe-ascii, /wireframe-html
  Cần AC riêng?       → /ac
  Cần kiểm chất lượng?→ /gap
  Cần bàn giao?       → /export hoặc /jira
  Cần test?           → /test-checklist → /test-cases
```

Chữ **ĐÚNG MỘT** là cố ý. Đừng mang cả họ skill về "cho chắc" — đó chính là cái bẫy.

Khi nào thì thêm skill mới? Khi các bạn thấy mình đang làm tay một việc **lặp lại, ổn định, có format rõ, có rule rõ, và review được**. Thiếu một trong năm điều kiện đó thì cứ dùng prompt thường, chưa cần skill.

---

## Còn một chỗ tốn token nữa: đọc tài liệu

Từ nãy giờ chương này chỉ nói về chi phí **cài** skill. Nhưng khi dự án đã có vài chục file tài liệu, phần tốn hơn nhiều là mỗi lần chạy skill nó phải **đọc** những file nào.

Bộ này giải quyết bằng `/kg` — nó dựng một **bản đồ liên hệ** giữa mọi thứ trong tài liệu (yêu cầu nào nằm ở file nào, story nào phủ yêu cầu nào, test case nào kiểm rule nào). Các skill như `/gap`, `/cr`, `/dashboard` hỏi bản đồ này trước để biết **chỉ cần mở 5 file nào** thay vì quét cả thư mục.

> Muốn thấy nó trông ra sao: mở [`example/_shared/kg/kg-viewer.html`](../example/README.md) trong gói — 691 điểm, 2.634 đường nối, dựng từ chính hai feature mẫu. `example/README.md` mục 5 có cả ví dụ chạy lệnh kèm kết quả thật.

Lưu ý ranh giới: bản đồ chỉ để **chọn file cần đọc**, không để kết luận nội dung. Nó biết cái gì nối với cái gì, không biết bên trong viết gì.

---

## Cách tự đo workspace của mình

```bash
# Đếm skill đang cài
ls -d .claude/skills/*/ | wc -l

# Đếm skill model tự gọi được (= skill chiếm chỗ preload)
total=$(ls -d .claude/skills/*/ | wc -l)
hidden=$(grep -l "disable-model-invocation: true" .claude/skills/*/SKILL.md | wc -l)
echo "Tổng: $total  |  Ẩn khỏi model: $hidden  |  Chiếm preload: $((total - hidden))"
```

Ước lượng chi phí preload:

```bash
python3 - <<'PY'
import glob, re
tot = n = 0
for p in glob.glob('.claude/skills/*/SKILL.md'):
    m = re.match(r'^---\n(.*?)\n---\n', open(p, encoding='utf-8').read(), re.S)
    if not m:
        print("Bỏ qua (frontmatter lỗi):", p); continue
    fm = m.group(1)
    if 'disable-model-invocation: true' in fm:
        continue                      # model không thấy -> không tính
    d = re.search(r'^description:\s*(.+?)(?=\n[a-z-]+:|\Z)', fm, re.S | re.M)
    if d:
        tot += len(d.group(1).strip()); n += 1
print(f"{n} skill model-visible | ~{tot:,} ký tự | ~{tot//3:,} token mỗi phiên (ước lượng)")
PY
```

Chạy trước và sau khi dọn — chênh lệch sẽ rất rõ.

> **Script trên chỉ ước lượng token, không kiểm cú pháp YAML.** Muốn kiểm cú pháp thì chạy riêng:
>
> ```bash
> python3 -c "
> import glob,re,yaml
> for p in sorted(glob.glob('.claude/skills/*/SKILL.md')):
>     m=re.match(r'^---\n(.*?)\n---\n', open(p,encoding='utf-8').read(), re.S)
>     if not m: print('KHÔNG CÓ FRONTMATTER:', p); continue
>     try: yaml.safe_load(m.group(1))
>     except Exception as e: print('YAML LỖI:', p, '->', str(e)[:60])
> "
> ```
>
> Lỗi hay gặp nhất: `description` có dấu `:` mà không được bọc. Sửa bằng block scalar:
>
> ```yaml
> description: >-
>   Nội dung mô tả có chứa: dấu hai chấm cũng không sao.
> ```
>
> Đáng chạy lệnh này sau mỗi lần sửa frontmatter — file lỗi YAML có thể không được nạp đúng.

---

## Prompt nhờ AI dọn hộ

```text
Đọc toàn bộ .claude/skills/*/SKILL.md trong workspace này.

Bối cảnh công việc của tôi: [mô tả loại dự án, tài liệu phải giao, công cụ team dùng].

Hãy:
1. Liệt kê mọi skill đang cài kèm 1 câu mô tả, và đánh dấu cái nào có
   `disable-model-invocation: true` (không chiếm preload) vs không có (có chiếm).
2. Nhóm chúng theo mục đích, chỉ ra nhóm nào có nhiều skill TRÙNG CHỨC NĂNG —
   tôi chỉ cần giữ 1 trong mỗi nhóm.
3. Dựa trên bối cảnh của tôi, đề xuất danh sách NÊN GIỮ và NÊN BỎ, nói rõ lý do.
4. Với skill nên giữ nhưng ít dùng, đề xuất bật `disable-model-invocation: true`
   thay vì xoá hẳn.
5. Kiểm description của skill giữ lại có đủ phân biệt với nhau không.
6. Ước lượng token preload trước và sau khi dọn.

Chưa xoá gì cả — đưa kế hoạch trước để tôi duyệt.
```

Câu cuối quan trọng. Đừng để AI xoá skill mà chưa xem qua.

> **Cách tắt skill an toàn:** đừng xoá ngay, và đừng đổi tên thư mục (Claude Code vẫn tìm thấy thư mục nào có `SKILL.md`). Cách đúng là **thêm `disable-model-invocation: true`** — skill biến khỏi context nhưng vẫn gọi tay được khi cần. Chạy một hai tuần thấy không nhớ tới nó thì mới **chuyển hẳn thư mục ra ngoài `.claude/skills/`**.

---

## Tóm tắt

- Chỉ mô tả của skill **model tự gọi được** mới nằm trong context ở mọi phiên. Skill có `disable-model-invocation: true` thì không.
- Bộ này: 57 skill, 27 cái đã tắt tự-gọi → còn **30 cái chiếm preload, khoảng 1.500 token mỗi phiên**.
- Nội dung đầy đủ của skill chỉ nạp khi gọi, và nạp **một lần cả file**, không tuần tự.
- `user-invocable` quản **danh sách lệnh**; `disable-model-invocation` quản **token**. Đừng nhầm hai cái.
- Nhiều skill gần nghĩa còn làm AI **chọn sai skill**, không chỉ tốn tiền.
- Tắt skill đúng cách: **thêm cờ**, không đổi tên thư mục.
- Tài liệu nhiều lên thì chỗ tốn token lớn nhất chuyển sang **việc đọc file** — `/kg` dựng bản đồ liên hệ để skill chỉ mở đúng file cần (xem ví dụ thật trong `example/_shared/kg/`).
- Nguyên tắc: **cài tối thiểu, thêm khi thật sự cần.**

---

Chương tiếp: [05 — Cấu hình output](05-cau-hinh-output.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
