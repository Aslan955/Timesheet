---
name: figma
description: Dùng khi cần vẽ màn hình UI thật lên Figma qua reqwise-figma MCP — từ 1 màn cụ thể tới cả feature với đầy đủ state/error variant. Cần có ASCII wireframe trước khi vẽ.
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, AskUserQuestion, mcp__reqwise-figma__figma_status, mcp__reqwise-figma__figma_docs, mcp__reqwise-figma__figma_read, mcp__reqwise-figma__figma_write, mcp__reqwise-figma__figma_rules
user-invocable: true
disable-model-invocation: true
argument-hint: "<feature> [<screen-slug> | --screens screen1,screen2]"
---
<!-- Licensed to nguyennam162nvn@gmail.com — Order ZQ6DTFZBW -->

# /figma — Draw UI Screens on Figma‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Vẽ thật lên Figma qua **reqwise-figma MCP**. Đọc `design.md` + `ascii-wireframe` (+ `html-wireframe` nếu có) → output frames đúng tokens/layout/iconography. Hỏi user muốn vẽ nhanh 1 vài màn hay vẽ đầy đủ cả feature (kèm state/error variant) — không cần nhớ flag.
>
> **Tool surface là superset của figma-ui-mcp** — vẫn 5 tool cùng tên (`figma_status`/`figma_read`/`figma_write`/`figma_rules`/`figma_docs`), vẫn model chạy JS trên `figma.*` proxy. Khác biệt tận dụng: **`state` persist qua các call** (setup token 1 lần), **`layout_audit`** (verify bằng dữ liệu thay vì đoán qua screenshot), **`figma.overlay()`** (scrim đúng lớp), **full modern ES** (dùng `?.`/`??`/spread thoải mái), **batch không cap cứng**, **`inset`/`align`/`insertAt`** (khỏi tự tính x/y), **`findOrCreateComponent`/`clone` có childMap**.

## Goal‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Convert ASCII wireframe spec thành Figma frames hoàn chỉnh với đúng design system. Mỗi screen = 1 Figma frame, kích thước theo **device đã chốt** (Phase 1) — KHÔNG mặc định mobile.

2 chế độ, chọn bằng câu hỏi tự nhiên (Phase 1), KHÔNG bằng flag kỹ thuật:

* **Nhanh (mặc định cho 1 vài màn)** — vẽ đúng screen user chỉ định, mỗi screen 1 frame base state.
* **Đầy đủ (cho cả feature)** — vẽ mọi screen của feature, mỗi screen kèm state-variant quan trọng (pressing/disabled) + error variant đại diện (gom lỗi cùng kiểu vào 1 note box), ưu tiên tái dùng component đã có thay vì vẽ lại.

## Constraints‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Hard rules — never violate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* **HARD GATE kết nối**: phải xác nhận đường ghi tới Figma thông trước khi làm bất kỳ việc gì khác (xem Phase 0). Lưu ý `figma_status.pluginConnected` CHỈ đáng tin khi `mode: "leader"` — ở `mode: "follower"` nó luôn `false` bất kể plugin có chạy hay không (xem Phase 0 bước 3). KHÔNG tự ý thử workaround khác.
* **Feature chưa tồn tại HOẶC chưa có `ascii-wireframe/` nào → REFUSE + route `/user-flow` + `/wireframe-ascii`** (per `feature-bootstrap.md` nhóm B) — không có ASCII screen thật thì không có gì để vẽ, tự bịa layout sẽ sai. KHÔNG tự tạo feature. Chi tiết + wording refuse: Phase 1 bước 1.
* **HARD GATE ASCII**: mỗi screen định vẽ phải có block ASCII thật — thiếu thì skip screen đó + warn (chi tiết Phase 1 bước 4).
* **HARD GATE DEVICE**: phải chốt device size với user trước khi vẽ (per `ba-conventions.md` Mục 7) — KHÔNG tự suy rồi vẽ luôn. Frame size + mọi toạ độ element dẫn xuất từ device này, KHÔNG hardcode 390.
* **KHÔNG hardcode hex màu** — luôn `setupTokens` + `applyVariable` sau MỖI create có màu/radius/spacing. Dừng ở hex = hardcode = global rebrand chết. `setupTokens` set giá trị cho MỌI mode (light+dark) và lưu ở `state.tokens`, idempotent. Dùng helper `bind()` (chi tiết: `references/drawing-patterns.md` § Token Setup).
* **Typography set INLINE khi create TEXT** (`fontSize` + `fontName:{family,style}`) — reqwise KHÔNG có `applyTextStyle`/named text-style (`setupTokens({textStyles})` bị bỏ qua âm thầm). Đây là ngoại lệ hợp lệ so với token-hoá màu/radius: font đi inline, mọi recipe `figma_docs` làm vậy.
* **AUTO-LAYOUT, KHÔNG absolute x/y cho con trong screen** — screen frame là VERTICAL auto-layout, con xếp bằng `layoutAlign: "STRETCH"` + `itemSpacing`. Cần định vị tương đối (căn giữa modal, pin cạnh) → dùng `inset`/`align` trên `create` (plugin tự tính toạ độ), KHÔNG tự tính x/y. x/y chỉ dùng cho: grid giữa các FRAME trên page. Chi tiết: `references/drawing-patterns.md` § 2 nguyên tắc bất di bất dịch.
* **GOM create vào `figma.batch()`** cho con không phụ thuộc id nhau — tránh 20-40 round-trip/screen (chậm + timeout). **Không cap cứng** (stream theo chunk 20, partial-commit, báo lỗi theo index). Chi tiết: `references/drawing-patterns.md` § Batch.
* **Scrim/overlay dùng `figma.overlay()`** — tạo RECTANGLE đúng lớp, KHÔNG tự dựng FRAME opacity (dim cả subtree). Chi tiết: `references/drawing-patterns.md` § Modal.
* **Multi-tab: pin `sessionId`** — `figma_status` trả `sessions[]`; có ≥2 file connected → hỏi user file nào rồi pin `sessionId` mọi call figma (không thì op rơi non-deterministic).
* **KHÔNG dùng emoji làm icon** — `figma.searchIcons(query)` chọn tên trước (rẻ, resolve alias `visibility→eye`), rồi `figma.loadIcon(name)` (default library lucide). Bảng tên: `references/drawing-patterns.md` § Icon Names.
* **KHÔNG tạo page mới** nếu Figma plan Starter (giới hạn 3 pages). Dùng page hiện tại.
* **Design tokens bắt buộc từ `docs/design.md`**. File missing → dùng dark-theme fallback + warn rõ trong L1 preview.
* **Component-first ở chế độ Đầy đủ**: trước khi vẽ 1 element lặp lại (button, input, banner, checkbox...), gọi `figma.findOrCreateComponent(name, spec, {dryRun:true})` — trả `decision: "reuse"|"create"` + `score`/`reason` (minh bạch). Reuse → `figma.instantiate(nameOrQuery, {parentId, props})`, KHÔNG vẽ lại từ đầu.
* **L1 approval** trước khi bắt đầu vẽ (danh sách screens + states dự kiến nếu chế độ Đầy đủ + layout grid + figma page target).
* **`layout_audit` verify** sau mỗi screen/frame nhóm — đọc `summary.issues` (overflow/clipping/text-truncated là dữ liệu, không phải phán đoán mắt). Có issue → fix ngay trước khi sang cái tiếp theo. Screenshot chỉ chụp 1 lần cuối cho user xem, KHÔNG dùng làm cách verify chính.
* **Cập nhật `{feature}-wireframe-index.md` cột Figma** sau khi vẽ xong.
* **BA conventions** per `../../rules/ba-conventions.md`. **Approval gate** per `../../rules/approval-gate.md`.

### Pitfalls — easy to get wrong‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* **Critical Bugs to Avoid trong `references/drawing-patterns.md`** — đọc trước khi vẽ, đừng lặp lại lỗi cũ (absolute x/y trong screen, quên applyVariable, modal tràn, overlay che content, counterAxis STRETCH throw, icon sai tên...).
* **2 lỗi nặng nhất hay mắc**: (1) đặt con bằng `x/y` trong screen thay vì auto-layout STRETCH → vỡ layout; (2) dừng ở `create(hex)` không `applyVariable` → màu hardcode, rebrand chết. Sequence Phase 5 bước F+G ép làm đúng.
* **`pluginConnected: false` ở `mode: "follower"` là BÁO SAI, không phải lỗi kết nối** — hằng số cứng trong `diagnostics()` (`src/server/index.ts`), không đo gì cả. Triệu chứng nhận ra ngay: `lastHeartbeatMs: -1` + `channels: []` + `sessions: []` cùng lúc, và **không đổi sau khi user restart plugin**. Đối chiếu bằng `lsof -nP -iTCP:38470` (thấy Figma ESTABLISHED = đã nối) rồi probe ghi-xoá. Đừng bắt user bật plugin ba lần như bug này từng gây ra.
* **Xoá node là `figma.delete(id)`** — proxy KHÔNG có `node.remove()` (official Plugin API mới có). `getNode()` trả snapshot phẳng, không phải live node: sửa qua `modify()`, đừng gán thuộc tính trực tiếp.
* **`figma_docs` + `figma_rules` là nguồn sự thật cuối** — `drawing-patterns.md` là bản rút gọn map sang token/device vault. Nghi ngờ API (tên method, param, op enum) → load lại `figma_docs` section tương ứng, đừng đoán. reqwise cũng dạy qua lỗi: mọi error là `{code, message, hint}`, đọc `hint` — nó nói bước tiếp theo.
* **Full modern ES — KHÔNG còn workaround sandbox cũ**: dùng `?.`/`??`/spread/destructuring/async-await thoải mái (reqwise chạy Node `vm`). Chỉ cấm `require`/`process`/`fetch`/`setTimeout`/`eval`. Đừng bê nguyên các "né optional-chaining" của figma-ui-mcp.
* **`state` persist qua call** — setup token/rootId 1 lần rồi đọc lại `state.tokens`/`state.rootId`; KHÔNG redeclare mỗi figma_write (khác bản cũ). Vẫn cần cùng `sessionId` để chung state.
* **Verify bằng `layout_audit`, không phải mắt** — overflow/clipping/truncation là dữ liệu. Screenshot chỉ để user nhìn cuối. Đừng "nhìn ảnh thấy ổn" rồi bỏ audit.
* **Refuse-vs-skip là 2 case khác nhau**: feature/ASCII hoàn toàn không có → refuse + route (Phase 1 bước 1). Feature đã có ASCII nhưng thiếu 1 screen lẻ → skip screen đó + warn, vẫn vẽ các screen còn lại (Phase 1 bước 4).
* **Mọi kích thước dẫn xuất từ device đã chốt** — pattern viết theo biến `W`/`H`/`PAD`/`FORM_W`, không phải số của mobile. Đổi device mà quên tính lại `STEP_X`/`STEP_Y` → frame đè nhau.
* **Batch chỉ gom node không cần id giữa chừng** — element lồng sâu (input+icon+text) cần id cha trước thì tạo tuần tự phần đó, đừng ép hết vào 1 batch (dù batch không cap cứng).

## Inputs

```
/figma authentication                                  # feature bắt buộc; skill hỏi tiếp muốn vẽ gì
/figma login --feature authentication                  # đủ ý (1 screen) → khỏi hỏi lại chế độ
/figma --feature authentication --screens login,signup  # đủ ý (vài screen chọn lọc) → khỏi hỏi
/figma --feature authentication --all                   # đủ ý muốn cả feature → hỏi có cần state coverage không
/figma                                                  # interactive: hỏi feature trước
```

Nguyên tắc: **input càng rõ, hỏi càng ít.** Chỉ hỏi phần còn mơ hồ, không hỏi lại cái user đã nói rõ.

## Context (dynamic)

Today: !`date +%Y-%m-%d`
Figma MCP tools: mcp__reqwise-figma__figma_status, figma_docs, figma_read, figma_write, figma_rules
Features có ascii-wireframe: !`for d in docs/*/ascii-wireframe/*-wireframe-index.md; do [ -f "$d" ] && dirname "$d" | xargs dirname | xargs basename; done 2>/dev/null | head -20`
design.md: !`test -f docs/design.md && echo "EXISTS" || echo "MISSING"`

---

## Approach

### Phase 0 — Check Figma Connection (HARD GATE)

1) Gọi `figma_status`. Đọc **`mode`** TRƯỚC `pluginConnected` — `mode` quyết định con số kia có nghĩa hay không.
2) `mode: "leader"` + `pluginConnected: true` → tiếp Phase 1.
3) `mode: "follower"` → **`pluginConnected`/`lastHeartbeatMs`/`channels`/`sessions` VÔ NGHĨA, KHÔNG được dùng làm căn cứ.** Nhánh follower của MCP trả hằng số cứng (`pluginConnected: false`, `lastHeartbeatMs: -1`, mảng rỗng) chứ không hỏi leader — xem `src/server/index.ts` hàm `diagnostics()`, comment *"Follower: it does not hold plugin state"*. Plugin vẫn có thể đang chạy và ghi được bình thường; follower có `forward()` đẩy op qua `/rpc` tới leader.

   **KHÔNG bắt user đi bật/restart plugin dựa trên `pluginConnected: false` ở mode này** — đó là đuổi theo triệu chứng giả, user bật lại bao nhiêu lần status vẫn `false`. Thay vào đó **probe đường ghi** (hỏi user trước vì có đụng file Figma):
   ```js
   // 1) ghi thử
   const probe = await figma.create({ type: "FRAME", name: "__reqwise-probe", width: 100, height: 100 });
   return { probeId: probe.id };
   // 2) xác nhận: figma_read op get_node với probeId → thấy node là đường ghi THÔNG
   // 3) dọn: await figma.delete(probeId)  ← KHÔNG phải node.remove() (proxy không có), xem figma_docs(section:"api")
   ```
   Probe ok → coi như connected, tiếp Phase 1. Probe lỗi → đọc `{code, message, hint}` của lỗi (nó nói bước tiếp theo cụ thể) rồi mới kết luận, KHÔNG đoán.

   Muốn kiểm độc lập trước khi probe: `lsof -nP -iTCP:38470 | grep -i figma` — thấy dòng `ESTABLISHED` từ tiến trình Figma là plugin ĐÃ nối, mọi hướng dẫn "bật plugin lên" đều thừa.
4) `mode: "leader"` + `pluginConnected: false` → đây mới là chưa kết nối thật. **DỪNG LẠI**. `figma_status` trả sẵn mảng `hints` (đã sắp theo thứ tự hành động cụ thể nhất) — ĐỌC `hints` trước, nó nói bước tiếp theo. Nếu cần in hướng dẫn cho user, dùng mẫu dưới, KHÔNG proceed:
   ```
   ❌ Chưa kết nối được với Figma plugin.

   Hướng dẫn kết nối (làm theo thứ tự):
   1. Mở Figma Desktop app (không phải bản web trên trình duyệt). Chưa cài → tải tại figma.com/downloads
   2. Mở 1 file Figma bất kỳ (file bạn muốn vẽ lên).
   3. Vào menu Plugins → Development → "Reqwise Figma MCP".
      - Không thấy mục "Development": Plugins → Development → Import plugin from manifest... rồi trỏ tới `plugin/manifest.json` trong repo reqwise-figma-mcp.
   4. Click "Reqwise Figma MCP" để chạy plugin. Panel nhỏ hiện ra, cần thấy trạng thái kết nối tới bridge port {port} (mặc định 38470).
   5. GIỮ panel/plugin đang chạy trong suốt phiên làm việc (đừng đóng cửa sổ).

   Sau khi bật xong, gõ lại /figma để em check lại kết nối.
   ```
   Sau khi user báo đã bật, gọi lại `figma_status` để verify. Vẫn `false` ở `mode: "leader"` → đọc `hints` mới (vd protocol-version mismatch, heartbeat cũ) rồi hành động theo đó, KHÔNG đoán mò. **Gọi `figma_status` lần thứ 3 mà kết quả không đổi thì dừng lặp** — status không phải thứ tự thay đổi theo thời gian, lặp thêm chỉ tốn lượt của user; chuyển sang probe (bước 3) hoặc `lsof` để lấy sự thật.
5) **Multi-tab**: `figma_status` trả `sessions[]`. Có ≥2 entry `connected: true` → hỏi user vẽ vào file nào (list `fileName`), lấy `id` → **pin `sessionId` cho MỌI figma_write/figma_read** phần còn lại của session. 1 file thì bỏ qua.
6) Sau khi connected: load docs **một lần** tại session start (BẮT BUỘC trước figma_write đầu tiên — bỏ qua sẽ hardcode màu, sai sizing). `figma_docs` nhận `section` ∈ `rules | layout | api | tokens | icons | recipes`: `{section:"rules"}` (safe-default semantics), `{section:"layout"}` (auto-layout + inset/align math), `{section:"api"}` (create/batch/modify), `{section:"tokens"}` (setupTokens + applyVariable; typography set inline, KHÔNG applyTextStyle), `{section:"icons"}` (searchIcons/loadIcon + lucide names — màu icon set qua stroke vector con), `{section:"recipes"}` (mẫu screen/modal/variant copy-paste).

### Phase 1 — Resolve Feature + Device + Chế độ vẽ

1) Parse `<feature>`. Missing → interactive picker: list features có `ascii-wireframe/{feature}-wireframe-index.md`. Phân biệt 2 case (per `feature-bootstrap.md` nhóm B):‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
   * **Feature KHÔNG tồn tại HOẶC chưa có `docs/{feature}/ascii-wireframe/` nào** (arg gõ sai, hoặc feature mới hoàn toàn) → **REFUSE tường minh + route đầu chain**: "Chưa thể chạy `/figma` cho `{feature}` — chưa có ASCII wireframe nào (cần screen thật để vẽ lên Figma). Feature hiện có: {list}. Chạy `/user-flow {feature}` rồi `/wireframe-ascii {feature}` trước, rồi quay lại." KHÔNG tự tạo feature.
   * **Feature có `ascii-wireframe/`** → proceed (thiếu ASCII của 1 screen lẻ vẫn xử lý ở HARD GATE ASCII bước 4: skip screen đó + warn).
2) Đọc `docs/{feature}/ascii-wireframe/{feature}-wireframe-index.md` → lấy bảng Screens (Slug/Status/Used by functions/Updated) + section Descriptions.
3) **Xác định chế độ — chỉ hỏi phần user chưa nói rõ:**
   * Đã có `<screen-slug>` đơn hoặc `--screens list` trong input → **chế độ Nhanh**, danh sách screen đã rõ, khỏi hỏi.
   * Đã có `--all` → hỏi 1 câu duy nhất: "Vẽ {feature} — chỉ base state mỗi màn, hay vẽ đầy đủ kèm state pressing/disabled + lỗi đại diện (khuyên dùng nếu feature có form/validation phức tạp)?" (Nhanh / Đầy đủ).
   * Không có gì cụ thể (chỉ `<feature>` trơn) → hỏi gộp 1 lần: liệt kê toàn bộ screen của feature, hỏi "Vẽ hết hay chọn vài màn? Nếu vẽ hết, cần đủ state/lỗi variant hay chỉ base state?".
4) **HARD GATE ASCII**: mỗi screen trong danh sách cuối cùng phải có block `## Screen: {slug}` với sub-section `### Wireframe (ASCII)` trong `docs/{feature}/ascii-wireframe/{flow-slug}.md` (tra flow qua `{feature}-wireframe-index.md` cột "Thuộc flow"). Thiếu → skip screen đó + warn, đề xuất `/wireframe-ascii {feature} --flow {flow-slug}`.
5) **HARD GATE DEVICE — chốt device size** (per `ba-conventions.md` Mục 7, cùng cách `/wireframe-ascii` + `/wireframe-html`):
   * Đề xuất sẵn 1 option: ưu tiên `srs/{feature}-userflow.md` frontmatter `primary_device`; thiếu → suy từ `docs/design.md` (Breakpoints / Max content width).
   * Hỏi qua AskUserQuestion: **Mobile 375 / Tablet 768 / Desktop 1024 / Responsive** — option đề xuất để đầu + note "(đề xuất — từ {nguồn})". KHÔNG tự chốt im lặng dù `design.md` rõ ràng.
   * Device đã chốt → set `frameW`/`frameH` dùng xuyên suốt Phase 4-6. Mọi toạ độ element tính theo `frameW` (xem `references/drawing-patterns.md` § Token Setup), KHÔNG dùng số literal của mobile.
   * `userflow.md` chưa có `primary_device` → gợi ý ghi ngược vào frontmatter để lần sau không hỏi lại.
6) **[Chỉ chế độ Đầy đủ]** Nếu tồn tại `docs/{feature}/html-wireframe/*.html` liên quan (tra `{feature}-wireframe-index.md` bảng Flows) → đọc nhanh để đối chiếu thứ tự flow/grouping (B&W, chỉ tham khảo layout — KHÔNG lấy style/màu).

### Phase 2 — Đọc nghiệp vụ

Với mỗi screen trong danh sách:

7) Đọc block `## Screen: {slug}` trong `ascii-wireframe/{flow-slug}.md`: sub-section `### Wireframe (ASCII)` (layout) + `### Screen description` (bảng 5 cột `# | Items | Control type | Data type | Description` — nguồn chính cho elements, state, error).
8) **[Chỉ chế độ Đầy đủ]** Phân loại state coverage từ cột **Description** của bảng `### Screen description` (6 lớp thông tin per `ba-conventions.md` Mục 6):
   * **Button có state**: default luôn vẽ. Description lớp 3 "States" mô tả rõ `Disabled khi...`/`submitting`/pressing khác biệt về màu/text → đánh dấu cần thêm state-variant.
   * **Lỗi/error trên screen**: gom mã lỗi (`E-{feature}-NNN`, Description lớp 5) theo **kiểu hiển thị** (inline dưới field, banner đỏ, toast...). Cùng kiểu → chỉ vẽ 1 variant đại diện + note box liệt kê các mã còn lại cùng kiểu.
   * **State loại trừ nhau** (vd success/expired) đã được `/wireframe-ascii` tách thành screen riêng `{screen}-{state}` (per `ba-conventions.md` Mục 8) → vẽ mỗi state 1 frame. Nếu nguồn ASCII nhồi ≥2 state loại trừ trong 1 khung (vi phạm Mục 8) → warn + đề xuất chạy lại `/wireframe-ascii`, KHÔNG vẽ y hệt state lẫn lộn.
9) **[Chỉ chế độ Đầy đủ]** Group screen theo flow nghiệp vụ (cột "Thuộc flow" trong `{feature}-wireframe-index.md`) — mỗi flow 1 nhóm, thứ tự điều hướng theo Description lớp 4 "Navigation".

### Phase 3 — Đọc Design System (Reuse-First — vault + Figma file)

10) Đọc `docs/design.md`. Extract đúng token/component đã định nghĩa, KHÔNG suy diễn thêm: colors (canvas/surface/primary/text/border/status), typography, border radius, spacing, **Components đã định nghĩa sẵn** (mục `## Components` — ưu tiên tái dùng khi map element), platform/breakpoint.
10b. **Design system SẴN CÓ trong file Figma** (dự án đang chạy đã có tokens/components): gọi tool `figma_rules` (1 call ra rule sheet: styles + variables + component catalog). Cần chi tiết hơn → `figma_read` op `get_components` / `get_variables` / `get_styles`, hoặc op `generate_design_md` (sinh spec đầy đủ có kèm ví dụ `instantiate`, lưu lại làm `design.md` bền nếu file lớn). Có token/text-style/component cùng vai trò → **tái dùng cái đã có** (`applyVariable` cho màu/số, `findOrCreateComponent`/`instantiate` cho component), KHÔNG ghi đè bằng bộ mới từ `design.md`. `design.md` là nguồn khi file Figma trống.
11) Missing `design.md` → fallback:
    ```
    canvas: #0b0e11  |  surface: #1e2329  |  elevated: #2b3139
    primary: #FCD535  |  on-primary: #181a20
    text-base: #eaecef  |  text-sub: #929aa5  |  text-muted: #707a8a
    positive: #0ecb81  |  negative: #f6465d  |  info: #3b82f6
    radius: sm=4 md=6 lg=8 xl=12  |  font: Inter
    ```
    Warn rõ trong L1 preview: "⚠️ design.md không tìm thấy, dùng fallback dark-theme."

### Phase 4 — Plan Layout (L1 Preview)

12) Tính grid layout **từ device đã chốt ở Phase 1** (`frameW`/`frameH`): `Step X = frameW + 80`, `Step Y = frameH + 120`. KHÔNG dùng số cố định — desktop `frameW=1024` mà lấy Step X của mobile sẽ làm các frame đè lên nhau. **Chế độ Đầy đủ**: tối đa 5 screens/hàng (quá 5 → xuống hàng mới trong CÙNG flow, không tách flow); state-variant đặt ngay sau base frame, cùng hàng, tên `01b`/`01c`...; mỗi flow bắt đầu 1 hàng mới có label. **Chế độ Nhanh**: mỗi screen 1 vị trí grid tuần tự, không cần group flow.
13) **Chế độ Nhanh — nếu > 10 screens**: show list + hỏi user chọn batch. **Chế độ Đầy đủ — nếu > 15 tổng frame** (base + variants): hỏi chọn batch theo flow, tránh timeout.
14) **L1 Plan preview** (prose, BA-friendly theo `ba-conventions.md`):

    Chế độ Nhanh:
    ```
    Em sẽ vẽ {N} screens cho feature {feature} lên Figma:
    Flow 1 — {flow name}: {screen1} → {screen2} → {screen3}   (Vị trí: hàng 1, x=0 y=0)
    Khung: {device} {frameW}×{frameH}
    Figma page: "{current page name}"
    Design tokens: đọc từ docs/design.md (dark theme)
    Apply? (Y / sửa / chọn flow cụ thể)
    ```

    Chế độ Đầy đủ:
    ```
    Em sẽ vẽ {feature} lên Figma theo {N_flows} luồng, tổng {N_base} screens + {N_variants} state-variant:
    Luồng 1 — {flow name} (hàng 1, y=0): {screen1}(base) → {screen1b}(pressing) → {screen2}(base) → {screen2b}(error đại diện)
    State/error coverage: {screen1}: thêm variant "submitting" · lỗi đại diện dùng E-{feature}-003, note liệt kê E-...-004/005 cùng kiểu
    Khung: {device} {frameW}×{frameH}
    Design tokens: đọc từ docs/design.md ({theme name nếu có})
    Figma page: "{current page name}"
    Apply? (Y / sửa / chọn luồng cụ thể)
    ```

### Phase 5 — Draw on Figma

Với mỗi frame, theo **MANDATORY SEQUENCE** (chi tiết code mẫu từng bước: `references/drawing-patterns.md`). `state` persist qua các call trong cùng session — **setup token 1 lần ở call đầu**, các call sau đọc lại `state.tokens`/id đã lưu, KHÔNG redeclare mỗi lần (khác figma-ui-mcp cũ):

```
A. [call đầu] setupTokens (colors đa-mode + numbers + fontSizes + fonts + textStyles, idempotent → state.tokens)
B. [call đầu] get_variables → build varMap V + helper bind(id,field,varName); lưu state.V nếu muốn tái dùng
C. setCurrentPage → current page
D. [Chế độ Đầy đủ] Component-first: figma.findOrCreateComponent(name, spec, {dryRun}) → reuse/instantiate nếu có
E. Tạo screen frame (VERTICAL auto-layout, KHÔNG x/y cho con) → bind fill; lưu state.rootId nếu vẽ tiếp ở call sau
F. Vẽ elements con — GOM vào figma.batch() (stream chunk 20, không cap), con full-width dùng layoutAlign:"STRETCH"; căn giữa/pin cạnh dùng inset/align
G. Vòng applyVariable (mọi màu/radius/spacing) cho id vừa nhận — typography ĐÃ set inline lúc create (fontSize+fontName). Icon status: set STROKE vector con (lucide stroke-based, loadIcon color không áp)
H. [Chế độ Đầy đủ] State-variant: clone(base) → dùng childMap định vị node cần đổi → modify (KHÔNG search theo tên)
I. [Chế độ Đầy đủ] Note box error-grouping nếu áp dụng
J. layout_audit(frame.id) → đọc summary.issues, fix trước khi sang frame kế (screenshot chỉ cho user xem cuối)
```

**[Prototype clickable — CHƯA hỗ trợ trong reqwise MCP]:** reqwise-figma **KHÔNG có op `set_reactions`/prototype** (danh sách op thật + lối thay thế: `references/drawing-patterns.md` § Prototyping). KHÔNG hứa "nối Figma bấm-chạy-được" rồi mới phát hiện bất khả thi — muốn prototype thật thì route `/prototype-html {feature}` (HTML chạy như app), hoặc mở rộng MCP thêm op trước. TRƯỚC khi hứa 1 khả năng, kiểm op có thật trong `plugin/code.js`/`figma_docs(section:"api")`.

Xem `references/drawing-patterns.md` cho: 2 nguyên tắc bất di bất dịch (auto-layout + token-first), batch, token/textStyle setup, screen frame, mọi element pattern (input/button/divider/modal/banner/icon-circle/OAuth), layer order, sandbox rules, state-variant, error-grouping note box, component reuse + property binding, prototyping, icon names, grid convention, và bảng bug + cách fix.

### Phase 6 — Verify (layout_audit) & Screenshot

Sau mỗi frame, verify bằng DỮ LIỆU trước, screenshot sau:

1) `figma_read({ op: "layout_audit", params: { nodeId: frame.id } })` → đọc `summary.issues` (+ `styleHints`). Sạch = chỉ trả summary + nodeCount (token-frugal). Có issue (`overflowsParent`/`clippedBy`/`textTruncated`/`zIndexWarnings`) → **fix ngay**, đây là sự thật cấu trúc chứ không phải phán đoán mắt.
2) Chỉ khi audit sạch → `figma_read({ op: "screenshot", params: { nodeId: frame.id, scale: 0.6 } })` cho user nhìn tổng thể.

Checklist bổ sung (mắt người, layout_audit không bắt được — **BẮT BUỘC chụp screenshot đánh giá thẩm mỹ, audit=0 chưa phải xong**): đối chiếu bảng "Critical Bugs to Avoid" (`references/drawing-patterns.md`) · **màu đã applyVariable** (không hardcode) + **typography set inline** (`fontSize`+`fontName` — KHÔNG có `applyTextStyle`) · **status badge nền đặc + icon trắng** (không nét mảnh nền nhạt) · **wordmark/row full-width căn đúng** (row STRETCH kèm `primaryAxisSizingMode:FIXED`) · **màu không lạc brand** (icon G, accent) · **con dùng auto-layout STRETCH, không x/y** · layout spacing hợp lý · **[Tablet/Desktop]** form/auth/dialog trong box hẹp căn giữa (~380-460px), KHÔNG kéo full frame width (per `ba-conventions.md` Mục 8) · **[Đầy đủ]** state-variant thực sự khác biệt rõ so với base · **[Đầy đủ]** note box không đè frame khác.

Lỗi → fix ngay trước khi sang screen tiếp theo.

### Phase 7 — Update `{feature}-wireframe-index.md`

Update `docs/{feature}/ascii-wireframe/{feature}-wireframe-index.md` cột Figma (L2 diff trước khi edit):
* Chế độ Nhanh: `"{FrameName}"` (vd `"01 · Login"`)
* Chế độ Đầy đủ: `"{base frame name} (+{N} states)"` (vd `"01 · Login (+2 states)"`)

### Phase 8 — Final Report

```
✅ Vẽ xong {N} screens cho feature {feature} trên Figma:

| Screen | Frame name | Vị trí |
|--------|------------|--------|
| login  | 01 · Login | x=0, y=0 |
...

Figma page: "{page name}" trong file "{file name}"
Khung: {device} {frameW}×{frameH} — {N_flows} flows, {N_screens} screens tổng
   [Đầy đủ] Component reused: {list tên component đã instantiate thay vì vẽ lại}
   (prototype clickable: reqwise chưa hỗ trợ — route /prototype-html nếu user muốn app chạy được)

Recommended next:
  - /prototype-html {feature}   — build clickable HTML prototype
```

## Output

**KHÔNG sinh file local.** Skill vẽ thẳng lên Figma qua MCP `reqwise-figma`.

Frame URL được ghi vào cột `Figma` của `docs/{feature}/ascii-wireframe/{feature}-wireframe-index.md` — đó là nơi duy nhất lưu vết output.

Nguồn element: bảng 5 cột trong `ascii-wireframe/{flow-slug}.md`; design token theo `docs/design.md`.

## References

* @references/drawing-patterns.md (token setup, mọi element pattern, sandbox rules, icon names, critical bugs — đọc trước Phase 5)
* @../../rules/approval-gate.md
* @../../rules/ba-conventions.md
* @../../rules/naming-conventions.md
* @../../rules/feature-bootstrap.md
* @../../rules/changelog.md
* @../wireframe-html/SKILL.md (html-wireframe format — tham khảo flow/grouping ở chế độ Đầy đủ, không lấy style)
* figma_docs (rules + layout + api + tokens + icons + recipes) — load tại Phase 0, nguồn API sự thật cuối cùng
* figma_rules (design-system rule sheet của file Figma đang mở) — gọi Phase 3 khi file đã có tokens/components
* reqwise-figma-mcp docs: trong repo reqwise-figma-mcp nơi MCP server được cài trên máy đang chạy (path tùy máy) — `docs/TOOLS.md` (API đầy đủ + error codes), `docs/RECIPES.md` (mẫu), `docs/MIGRATION.md` (khác biệt so figma-ui-mcp)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
