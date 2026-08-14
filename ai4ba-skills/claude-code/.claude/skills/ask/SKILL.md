---
name: ask
description: Dùng khi cần hỏi và được giải thích một nghiệp vụ đang hoạt động thế nào (business logic, luồng, rule, edge case) dựa trên tài liệu BA đã có, trả lời ngay trong chat kèm sơ đồ ASCII khi hợp. Read-only, không sinh hay sửa doc; soi luồng còn thiếu thì dùng `/gap`.
allowed-tools: Read, Bash, Glob, Grep
user-invocable: true
disable-model-invocation: true
argument-hint: "<câu hỏi | feature | ID (FR-.../UC-.../E-...)>"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /ask — Hỏi nghiệp vụ này hoạt động thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> __KHÔNG Write/Edit gì cả.__ Đây là skill __read-only thuần__ — đọc tài liệu đã có trong vault rồi __trả lời ngay trong chat__. Không sinh doc, không sửa doc, KHÔNG có approval gate (miễn vì không ghi file). Muốn LƯU câu trả lời thành tài liệu chính thức → route `/usecase` (viết use case) hoặc `/reverse-doc`, KHÔNG tự Write.

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trả lời __đúng một câu hỏi của IT-BA/PO__: *"nghiệp vụ này ĐANG hoạt động thế nào?"* — vd "luồng đăng nhập chạy ra sao, khóa tài khoản khi nào", "quy tắc hoàn tiền ở feature payment là gì", "màn checkout có những trạng thái nào".

Đầu ra là __lời giải thích dễ hiểu__ cho người vai nghiệp vụ:
* __Cách nghiệp vụ hoạt động__ (business logic theo bước, rule, ngưỡng, error) — phần chính.
* __Sơ đồ luồng ASCII__ (box-drawing `┌ ─ ┐ │ ▼`, nhánh YES/NO inline) — **giống output flow diagram của `/brainstorm`** — để user NHÌN thấy luồng chạy thế nào, không phải khung màn hình.
* __Userflow__ khi nghiệp vụ có __≥2 luồng__ phân biệt (happy/error/edge, hoặc nhiều phương thức).
* Mọi rule/số liệu/wording đều __trích từ prose đã đọc__ (`file:line`) — KHÔNG bịa.

Đây là __giải thích luồng ĐANG CÓ__, KHÁC `/gap` (soi luồng THIẾU) và KHÁC `/reverse-doc` (tái lập SRS từ nguồn ngoài, có Write).

## Ranh giới với skill khác‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Skill | Nó làm gì | Vì sao khác /ask |
|---|---|---|
| `/gap` | Soi __THIẾU__ luồng (dead-end, thiếu chiều ngược, case chưa phủ) + Write `traceability.md` | /ask __giải thích luồng ĐANG có__, không săn cái thiếu, không Write |
| `/reverse-doc` | Tái lập BỘ SRS từ __nguồn ngoài__ (docx/pdf/ảnh) → Write `docs/_reverse/{feature}/` | /ask đọc __doc đã có trong vault__, trả lời tại chỗ trong chat |
| `/usecase` | Sinh file UC (Cockburn) | /ask không sinh file |
| `/dashboard` | HTML tổng hợp toàn workspace | /ask trả lời 1 câu hỏi cụ thể, trong chat |
| `/kg explore` | Trả node + edge THÔ (bảng ID) — hạ tầng | /ask dùng kg để CHỌN file rồi __đọc prose + diễn giải nghiệp vụ__ |

## Constraints‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* __Read-only thuần__ — KHÔNG Write/Edit bất kỳ file nào. Miễn approval gate (L1/L2/L3) vì không ghi. `allowed-tools` không có Write/Edit — đúng chủ đích.
* __Quy tắc vàng KG__ — graph để __CHỌN__ file + đếm cấu trúc; mọi kết luận nội dung __LUÔN dựa trên prose đã Read__ (`@../../rules/kg-usage.md`). Không bao giờ trả lời "hệ thống làm X" chỉ vì thấy edge/facts.
* __CHỐNG BỊA (tối cao)__ — mỗi rule/số liệu/wording phải kèm evidence `file:line`. Không nhớ được số → đọc lại file, KHÔNG đoán. Không có nguồn cho 1 phần câu hỏi → nói thẳng "phần này chưa có trong tài liệu" + route skill sinh ra nó.
* __IT-BA framing__ — trả lời bằng business language (`@../../rules/ba-conventions.md` Mục 3). CẤM lệch kỹ thuật: DB schema, endpoint, JWT vs session, hashing, SDK. Câu hỏi hỏi thẳng chi tiết kỹ thuật → trả ở tầng nghiệp vụ + note "chi tiết triển khai là việc /srs + dev".
* __Câu hỏi mơ hồ → hỏi lại NGẮN, không đoán bừa__ — không xác định được feature/scope → hỏi 1 câu làm rõ + list feature hợp lệ. KHÔNG auto-pick feature im lặng.
* __Nhóm C (feature-bootstrap)__ — feature không tồn tại → friendly empty-message + list feature hợp lệ, KHÔNG tạo feature (`@../../rules/feature-bootstrap.md`).
* __Typography VN__ — dùng "Mục N" thay `§`, "sang/đến/dẫn tới" trong prose (`@../../rules/ba-conventions.md` Mục 4).

### Pitfalls — easy to get wrong

* ❌ Trả lời "hệ thống làm X" chỉ vì thấy edge/facts trong graph — facts KHÔNG chứa điều kiện/ngoại lệ/wording. Phải Read prose.
* ❌ Bịa số liệu/wording không có `file:line`. Không nhớ → đọc lại. Không có → nói "chưa có trong tài liệu" + route skill.
* ❌ Lệch kỹ thuật (DB/endpoint/SDK/JWT) — trả ở tầng nghiệp vụ.
* ❌ Đổ nguyên section "Phải Read tay" (noise) vào câu trả lời — là tín hiệu nội bộ.
* ❌ Auto-pick feature im lặng khi câu hỏi mơ hồ — hỏi lại NGẮN + list.
* ❌ Emoji trong khung ASCII (viền lệch). Form trải full width (trông sai) — căn giữa hẹp.
* ❌ Thêm Write/Edit vào skill này. Đầu ra là chat. Muốn lưu → `/usecase` / `/reverse-doc`.
* Doc `status: stale` → vẫn trả lời theo nội dung hiện có, ghi chú nhẹ "tài liệu này đang stale (có thay đổi upstream chưa rà)".

## Inputs

```
/ask                          # picker: hỏi "Anh muốn hỏi về feature/luồng nào?" + list feature
/ask <feature>                # giải thích tổng quan nghiệp vụ 1 feature
/ask <câu hỏi tự do>          # vd: "luồng đăng nhập authentication hoạt động thế nào"
/ask <ID>                     # vd: /ask FR-authentication-011  (giải thích 1 requirement/rule)
```

## Context (dynamic)

Today: !`date +%Y-%m-%d`
Features: !`ls -d docs/*/ 2>/dev/null | xargs -I{} basename {} | grep -v "^_" | head -20`

## Approach (Phases)

### Phase A — Nhận input + phân loại câu hỏi

* __Arg rỗng__ → hỏi "Anh muốn hỏi về feature/luồng nào?" + list feature (từ Context ở trên). Chờ trả lời.
* __Feature không tồn tại__ (Nhóm C): khi chạy `tour`/`facts` với feature sai, engine trả __exit 0__ kèm dòng `Feature hợp lệ: ...` + `Gần giống: ...` (KHÔNG phải KG-ERROR). Relay ngay: "Chưa có feature `{arg}`. Feature hiện có: {list}. Ý anh là `{gần-giống}`?" — KHÔNG tạo feature, KHÔNG đoán bừa.
* __Có arg__ → phân loại:
  * Chứa __ID__ (`FR-`/`UC-`/`E-`/`BR-`/`NFR-`/`US-`/`screen:`...) → loại __"ID cụ thể"__.
  * Là __feature slug trần__ khớp `docs/{slug}/` (vd `/ask authentication`, hàm ý "giải thích cả feature") → loại __"tổng quan feature"__.
  * Là __câu hỏi tự do về 1 luồng/khía cạnh__ trong 1 feature (vd "luồng đăng nhập chạy sao", "quy tắc hoàn tiền là gì") → loại __"luồng/khía cạnh cụ thể"__. Trích feature + keyword từ câu. Không rõ feature nào → hỏi lại NGẮN "Câu này về feature nào?" + list, KHÔNG đoán bừa.

### Phase B — Định tuyến qua KG (CHỌN file — KHÔNG kết luận)

Theo loại câu hỏi, chạy đúng 1 lệnh để lấy shortlist file đáng đọc:

```bash
# "tổng quan feature" — lộ trình ĐỌC theo thứ tự phụ thuộc (brainstorm→spec→UC→flow→story...)
node .claude/skills/kg/engine/kg-query.mjs tour <feature>

# "luồng/khía cạnh cụ thể" — liệt kê FR/UC/US/screen/flow/OQ + Độ phủ, chọn file khớp keyword
node .claude/skills/kg/engine/kg-query.mjs facts <feature>

# "ID cụ thể" — cho định nghĩa + source file:line + ai trỏ tới/trỏ tới ai
node .claude/skills/kg/engine/kg-query.mjs explore <ID|key>

# "1 doc/màn cụ thể" — 1-hop upstream/downstream candidates
node .claude/skills/kg/engine/kg-query.mjs neighbors <doc-path>
```

> **`tour` vs `facts`:** `tour` cho __thứ tự đọc__ (thượng nguồn→hạ nguồn) — dùng khi hỏi tổng quan cả feature để /ask đọc đúng trình tự dựng bức tranh. `facts` cho __danh sách phẳng có phân loại__ — dùng khi chỉ cần lọc nhanh file khớp keyword của 1 luồng. Cả hai chỉ CHỌN file; kết luận vẫn từ prose. `tour` cột "Vì sao" là quan hệ graph, KHÔNG phải tóm tắt nội dung — vẫn phải Read.

__3 nghĩa vụ bắt buộc mỗi lần gọi kg-query__ (`@../../rules/kg-usage.md`):
1. **`⚠ còn N mục — chạy với --all`** xuất hiện → BẮT BUỘC chạy lại `--all` lấy đủ trước khi Read.
2. **Mục `### Phải Read tay (ngoài graph)`** → đọc các file liệt kê __có liên quan câu hỏi__ (graph mù về doc không parse được). Dòng `Độ phủ:` cho biết thiếu bao nhiêu.
3. **`KG-ERROR` (exit 2)** → graph không dùng được → Phase B' fallback dưới. TUYỆT ĐỐI không suy diễn từ kết quả một phần.

> __KHÔNG đổ section "Phải Read tay" vào câu trả lời cho user.__ Nó là tín hiệu nội bộ để /ask biết đọc thêm file nào — không phải nội dung BA đọc. Ở vault demo section này có thể rất dài/ồn (format cũ parse thiếu). /ask chỉ (a) đọc file liên quan, (b) nếu độ phủ thấp ảnh hưởng câu trả lời → ghi 1 câu gọn "một số file test/checklist parse thiếu, em đã đọc trực tiếp bù".

__Phase B' — Fallback khi KG-ERROR:__ bỏ định tuyến qua graph, đọc trực tiếp: `ls docs/{feature}/`, Glob `docs/{feature}/**/*.md`, Read `srs/{feature}-spec.md` + `usecases/uc-*.md` + `srs/{feature}-userflow.md`, grep keyword câu hỏi.

### Phase C — Read prose ĐẦY ĐỦ (KẾT LUẬN ở đây)

Read các file shortlist. Nguồn ưu tiên (KHÔNG bịa):
* `srs/{feature}-spec.md` — FR/NFR/BR + __Error Matrix__ (E-code + wording thật) + Success Criteria.
* `usecases/uc-{slug}.md` — Main Success Scenario + Extensions (nhánh rẽ/lỗi).
* `srs/{feature}-userflow.md` — chia flow + happy/error/edge.
* `srs/{feature}-states.md` — nếu câu hỏi về trạng thái entity.
* Screen index / `ascii-wireframe/{flow}.md` — nếu câu hỏi về màn.

Mọi con số/rule/error wording lấy __từ prose__ (`file:line`), không nhớ.

### Phase D — Quyết cấu trúc trả lời‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* __Câu hỏi về 1 LUỒNG hoạt động__ (đăng nhập, thanh toán, hoàn tiền, duyệt...) → __VẼ sơ đồ luồng ASCII__ (box-drawing, kiểu `/brainstorm`) — đây là cách chính để user hiểu luồng. Phủ được cả nhánh quyết định (YES/NO) + error path trong 1 sơ đồ.
* Nghiệp vụ có __≥2 luồng__ phân biệt (nhiều phương thức: login email vs Google; nhiều actor) → __thêm phần Userflow__ (mermaid `flowchart` hoặc mô tả happy/error/edge tách luồng).
* Câu hỏi hẹp về __1 rule/1 con số__ (câu hỏi hẹp, không phải luồng) → trả lời gọn, __KHÔNG ép__ sơ đồ.

### Phase E — Tổng hợp câu trả lời có cấu trúc → in ra chat. HẾT.

Không Write, không approval gate, không HARD STOP (trừ khi Phase A phải hỏi lại làm rõ feature).

## Cấu trúc output trả lời (thích ứng — không phải lúc nào cũng đủ hết)

1. __Tóm tắt (TL;DR)__ — 1-2 câu chốt trực tiếp câu hỏi.
2. __Sơ đồ luồng hoạt động (ASCII)__ — box-drawing kiểu `/brainstorm` (xem quy tắc vẽ dưới). Đặt SỚM để user nắm luồng trước khi đọc chi tiết. Bỏ qua nếu câu hỏi hẹp về 1 rule.
3. __Cách nghiệp vụ hoạt động__ — prose theo bước bám sơ đồ, mỗi rule/số kèm nguồn `(FR-xxx, spec.md:line)`. Phần chính.
4. __Rule & ràng buộc__ — bullet các BR/ngưỡng/điều kiện.
5. __Nhánh / edge case__ — error path + wording thật (từ Error Matrix, E-code).
6. __[Khi ≥2 luồng]__ Userflow — mermaid `flowchart` hoặc mô tả text happy/error/edge tách luồng.
7. __Nguồn đã đọc__ — liệt kê ngắn `file:line` đã dùng (minh bạch, chống bịa). Độ phủ KG thấp → 1 câu ghi chú.

### Quy tắc vẽ sơ đồ luồng ASCII (giống `/brainstorm`)

* Dùng box-drawing `┌ ─ ┐ │ └ ┬ ▼ →` trong `text` fence (monospace). __CẤM emoji__ trong sơ đồ (viền lệch).
* Mỗi bước = 1 box; mũi tên `▼` xuống dưới, nhãn cạnh mũi tên là hành động/điều kiện (`click "Đăng nhập"`, `submit`).
* __Nhánh quyết định__: box câu hỏi → `─NO→` inline ra error/case bên phải, `│ YES` đi tiếp xuống. Phủ cả happy + error/edge trong 1 sơ đồ khi được.
* Node cần chú thích ngắn → để trong ngoặc cạnh box (`(link expire 24h)`, `status=unverified`).
* Giữ hẹp, đọc dọc từ trên xuống — mục tiêu là user hiểu luồng, không phải đẹp.

### Ví dụ output ngắn — `/ask "luồng đăng nhập authentication hoạt động thế nào, khóa tài khoản ra sao"`

> __Tóm tắt:__ User đăng nhập bằng email + password; hệ thống so khớp thông tin, kiểm tra tài khoản đã xác nhận email chưa, và đếm số lần sai để chống dò mật khẩu — sai 5 lần liên tiếp thì khóa 24h tự mở.
>
> __Sơ đồ luồng:__
> ```text
> ┌────────────────┐
> │ Nhập email/pass│
> │ + submit       │
> └───────┬────────┘
>         ▼
> ┌────────────────────┐   NO   ┌──────────────────────────────┐
> │ Email/pass khớp?   │ ─────→ │ E-003 "Email hoặc mật khẩu   │
> │                    │        │ không đúng" + fail counter +1│
> └───────┬────────────┘        └──────────────┬───────────────┘
>         │ YES                                 ▼
>         │                         ┌──────────────────────────┐
>         │                         │ ≥3 lần: yêu cầu captcha   │
>         │                         │ ≥5 lần: KHÓA 24h (E-005)  │
>         ▼                         └──────────────────────────┘
> ┌────────────────────┐   NO
> │ Email đã verified? │ ─────→ E-004 + CTA gửi lại email verify
> └───────┬────────────┘
>         │ YES
>         ▼
> ┌────────────────────┐
> │ Tạo phiên → vào app│
> └────────────────────┘
>   (Lỗi mạng khi so khớp: KHÔNG tính vào fail counter — tránh khóa oan)
> ```
>
> __Cách hoạt động (FR-authentication-004, spec.md:43):__
> 1. So khớp email/password — không khớp → báo lỗi generic "Email hoặc mật khẩu không đúng" (E-authentication-003, cố ý mơ hồ để chống dò tài khoản), tăng bộ đếm fail +1.
> 2. Kiểm tra trạng thái tài khoản: chưa xác nhận email → chặn, hiện CTA gửi lại email (E-authentication-004).
> 3. Qua 2 bước trên → tạo phiên đăng nhập.
>
> __Chống brute-force (FR-authentication-011, spec.md:50 + BR-006/007):__
> - Sai __≥3 lần__ → yêu cầu captcha.
> - Sai __≥5 lần__ → __khóa 24h__, tự mở, không cần admin (BR-authentication-007, spec.md:79). Đang khóa mà login → "Tài khoản tạm khóa, thử lại sau {X} giờ" (E-authentication-005).
> - __Lỗi mạng KHÔNG tính vào bộ đếm__ (FR-011) — tránh khóa oan.
>
> __Nguồn đã đọc:__ `srs/spec.md` (FR-004, FR-011, BR-006/007, E-003/004/005), `usecases/uc-login-email.md`.

## References

* @../../rules/kg-usage.md
* @../../rules/ba-conventions.md
* @../../rules/feature-bootstrap.md
* @../../skills/kg/SKILL.md‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
