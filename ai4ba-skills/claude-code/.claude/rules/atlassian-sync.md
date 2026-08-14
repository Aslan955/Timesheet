# Atlassian Sync — rule chung cho `/jira` + `/confluence`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Rule chung định nghĩa **đồng bộ 2 chiều** giữa vault local và Atlassian (Jira Cloud + Confluence Cloud). Cả `/jira` và `/confluence` MUST reference file này. Nó trả lời: **làm sao kéo (pull) issue/page về, làm sao phát hiện conflict khi CẢ local lẫn remote cùng đổi, và ai (local hay remote) là chủ của từng loại thông tin.**
>
> Engine mỗi bên KHÁC bản chất (Jira = field cấu trúc + changelog; Confluence = page body có `version.number` + optimistic lock) nên 2 skill giữ riêng. File này chỉ chuẩn hóa **khái niệm chung**: sync-state, 3-way compare, bảng quyết định, field-ownership, các mode, feedback-inbox.

## 1. Nguyên tắc nền‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> **Local vault = nguồn sự thật đã-được-duyệt cho nội dung BA. Remote (Jira/Confluence) = nguồn cộng tác hạng nhất — thay đổi ở đó phải được PHÁT HIỆN, IMPORT và GIẢI QUYẾT rõ ràng, KHÔNG được ghi đè im lặng cũng KHÔNG được lờ đi.**

* **Default luôn là inspect (read-only).** Không mode nào ghi đè bất kỳ bên nào chỉ vì có cờ `--push`/`--pull`. Mọi thay đổi (local edit HOẶC remote write) đều qua approval gate.
* **Không bao giờ ghi đè mù bằng ID.** `page_id` / issue-key chỉ đảm bảo *idempotent create* (không tạo trùng), KHÔNG đảm bảo *update an toàn*. Trước mọi push update PHẢI làm **remote preflight** (Mục 5).
* **Không tự đoán mapping.** Story split, epic move, page mới lạ → hỏi BA map, không tự gán.

## 2. Các mode (cả 2 skill dùng chung nghĩa)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Mode | Cờ | Ý nghĩa | Ghi ở đâu |
|---|---|---|---|
| **inspect** | (mặc định, không cờ) | So sánh 3-way, in bảng drift/conflict. KHÔNG ghi gì. | — |
| **push** | `--push` | Đẩy artifact **chỉ-local-đổi** lên remote sau approval + preflight. | remote + sync-state |
| **pull** | `--pull` | Kéo artifact **chỉ-remote-đổi** về local sau L2 diff. | local + sync-state |
| **reconcile** | `--reconcile` | Xử lý artifact **cả 2 bên cùng đổi** (conflict) — BA chọn từng cái. | tùy quyết định |
| **import** | `import jira <KEY>` / `import confluence <page-url|id>` | Kéo epic/story/page **chưa map** về làm bản nháp có kiểm soát. | local draft + sync-state |

> `--push` chỉ đụng cái chỉ-local-đổi; `--pull` chỉ đụng cái chỉ-remote-đổi; conflict luôn phải qua `--reconcile`. Chạy `--push` mà gặp conflict → skill KHÔNG push cái đó, báo "cần /… --reconcile trước".

## 3. Sync-state store (watermark + base snapshot)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

State máy-đọc-được, tách khỏi doc BA (để **không kích hoạt hook stale-propagation** — sync metadata KHÔNG phải semantic change của requirement):

```
.claude/state/atlassian/
├── sync-state.yaml          # NGUỒN SỰ THẬT DUY NHẤT: config + mapping + watermark + hash, GỘP cả Jira lẫn Confluence
├── base/                    # snapshot chuẩn hóa lần sync THÀNH CÔNG gần nhất (nguồn để 3-way compare)
│   ├── jira-PAY-123.json
│   └── confluence-67893.json
└── locks/                   # lock/feature khi đang reconcile (chống 2 BA đụng cùng lúc)
```

> **Mapping GỘP — không còn 2 file rời.** `sync-state.yaml` **thay thế** cặp `docs/_shared/jira-map.md` + `docs/_shared/confluence-map.md` cũ (2 file rời gây khó đối chiếu: 1 artifact vừa map Jira story vừa map Confluence page phải tra 2 chỗ, dễ lệch). Ở đây **1 artifact = 1 hoặc nhiều mapping trong CÙNG entry**, tra 1 nơi ra hết. Config dùng chung (project key, space, base URL, mermaid app) sống ở section `context` đầu file — **không lặp** ở 2 nơi.
>
> **Di trú (migration) — trigger theo SỰ TỒN TẠI của file cũ, KHÔNG theo "sync-state chưa có":** mỗi lần chạy, nếu CÒN `docs/_shared/jira-map.md` / `confluence-map.md` → **luôn** migrate (kể cả khi `sync-state.yaml` đã tồn tại một phần): đọc file cũ, **merge** mapping+config vào `sync-state.yaml` (entry đã có thì bổ sung, không ghi đè), xác minh mọi row đã parse vào entry đúng, show L1 diff. User Y → **xóa file cũ** (thao tác xóa qua L2/dangerous-op confirm riêng). Guard "sync-state chưa có" là SAI (partial state + old-file → không bao giờ dọn được, sinh 2 nguồn song song đúng cái thiết kế cấm). Sau di trú `sync-state.yaml` là nguồn duy nhất; template `_templates/jira-map.md` ngừng dùng. Bảng cho stakeholder → `/dashboard` render từ `sync-state.yaml`.
>
> **Tạo thư mục lần đầu:** trước lần ghi đầu, skill `mkdir -p .claude/state/atlassian/{base,locks}` (idempotent). Đảm bảo `.claude/state/atlassian/` KHÔNG bị `.gitignore` (kiểm 1 lần; commit chung vault).

**Vì sao base snapshot phải là NỘI DUNG chuẩn hóa, không chỉ hash:** không có bản base thật thì không giải thích/tái lập được 3-way merge, và không show được diff cho BA. Hash chỉ để so nhanh "có đổi không"; base để so "đổi cái gì".

**Schema `sync-state.yaml` — GỘP config + mapping Jira + Confluence trong 1 file:**

```yaml
# --- Config dùng chung (không lặp ở 2 nơi) ---
context:
  jira:
    project_key: PAY
    base_url: https://acme.atlassian.net
  confluence:
    space: BA
    root_parent_id: 12345
    mermaid_app: "Mermaid Diagrams for Confluence (Stratus)"
    macro_key: mermaid-cloud       # rỗng nếu chưa có app → png-prerendered
  updated: 2026-07-13

# --- Mapping + sync-state: 1 entry / artifact vault. Mỗi entry có thể mang CẢ jira LẪN confluence ---
artifacts:
  - vault_path: docs/payment/userstories/us-003.md
    feature: payment
    mappings:                    # 1 artifact ↔ nhiều hệ, GỘP CHUNG entry
      jira:
        remote_id: PAY-123       # issue key
        remote_url: https://acme.atlassian.net/browse/PAY-123
        mapping_type: story      # epic | story | subtask
        base_snapshot: base/jira-PAY-123.json  # NỘI DUNG chuẩn hóa: cả local-projection + remote-fields + converter_version
        base_local_hash: "sha256:…"    # kênh content: hash local chuẩn hóa lúc sync cuối
        base_remote_hash: "sha256:…"   # kênh content: hash remote chuẩn hóa lúc sync cuối
        base_meta_hash: "sha256:…"     # kênh phụ: hash status/assignee/sprint/comment-ids
        ac_mapping: subtasks     # subtasks | description | checklist (chốt 1 lần)
        delivery_metadata: { status: "In Progress", assignee: "an.pm", sprint: "S12" }  # pull-về, KHÔNG đổi doc status
        watermark_hint: { jira_updated: "2026-07-13T09:16:00Z" }  # CHỈ gợi ý, không phải khóa preflight
        state: synced            # xem Mục 7
      confluence:
        remote_id: "67901"       # page_id
        remote_url: https://…/pages/67901
        mapping_type: page
        parent_id: "67890"       # theo dõi move
        base_snapshot: base/confluence-67901.json  # gồm cả opaque region (macro/panel/attachment) nguyên bản
        base_local_hash: "sha256:…"
        base_remote_hash: "sha256:…"
        base_meta_hash: "sha256:…"     # comment/inline-comment ids
        has_opaque: true         # true → chặn push tới khi BA chọn authoritative side (Mục 6)
        watermark_hint: { confluence_version: 4 }  # CHỈ gợi ý
        state: remote-changed
    field_ownership:             # override mặc định Mục 6 (áp cho cả 2 hệ)
      acceptance_criteria: shared
      workflow_status: remote
    last_synced_at: "2026-07-13T09:20:00Z"
```

> Artifact chỉ map 1 hệ (vd SRS spec chỉ lên Confluence) thì entry chỉ có 1 key. Map cả 2 → 2 key, tra 1 nơi.
> **Quan hệ 1-nhiều** (1 doc → nhiều page, 1 US → nhiều AC subtask, import epic → nhiều children): giá trị của `jira`/`confluence` là **list** các object mapping thay vì 1 object, mỗi phần tử có `remote_id` + `sub_ref` (vd `#AC-001`, `#page-child-2`) để biết phần local nào sở hữu remote nào. Import tree: mỗi child/page 1 phần tử, KHÔNG gộp 1 mapping mù.

> State **được commit chung với vault** nếu nhiều BA sync cùng feature. **TUYỆT ĐỐI không chứa token/credential.** `.claude/state/atlassian/` KHÔNG được nằm trong `.gitignore` của sync-state (nhưng cũng không đẩy secret vào).

## 4. 3-way compare (base / local / remote)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
base   = snapshot nội dung chuẩn hóa lúc sync THÀNH CÔNG gần nhất (local+remote)
local  = doc vault hiện tại
remote = issue/page Atlassian hiện tại
```

### 4a. HAI kênh drift — đừng gộp làm một

Một artifact có **2 kênh thay đổi độc lập**, hash riêng, xử lý riêng (đây là fix để metadata/comment KHÔNG bị bỏ sót):

| Kênh | Gồm gì | Base hash | Khi remote kênh này đổi → |
|---|---|---|---|
| **requirement-content** (kênh chính) | Jira: summary/description/AC/priority/epic-parent/labels/links. Confluence: body+title+parent+labels. | `base_local_hash` + `base_remote_hash` | Vào 3-way (bảng 4b) — có thể thành conflict, cần BA quyết. |
| **delivery-metadata + comment** (kênh phụ) | Jira: status/resolution/sprint/assignee + comment mới. Confluence: comment/inline-comment mới. | `base_meta_hash` (chỉ remote) | **Luôn là pull-thẳng** (không bao giờ conflict): status/assignee → delivery metadata; comment → feedback inbox (Mục 6, 10). KHÔNG cần BA "giải quyết", chỉ cần L1 xác nhận batch. |

Mỗi artifact tính:
```
content_local_changed  = hash(chuẩn-hóa-content(local))  != base_local_hash
content_remote_changed = hash(chuẩn-hóa-content(remote)) != base_remote_hash
meta_remote_changed    = hash(chuẩn-hóa-meta(remote))    != base_meta_hash   # kênh phụ, chỉ remote
```

> **KHÔNG chỉ dựa timestamp/version.** Timestamp (`fields.updated`) và version (`version.number`) chỉ là **gợi ý nhanh "có thể đã đổi"** — dùng để quyết có cần fetch full + hash hay không, KHÔNG dùng làm thẩm quyền "an toàn ghi đè". **Content hash chuẩn hóa mới là quyết định cuối** (tránh false conflict khi Atlassian re-render/re-save không đổi nội dung). Xem Mục 5 về vì sao version.number KHÔNG được coi là khóa preflight.

### 4b. Bảng quyết định — kênh requirement-content

| content_local | content_remote | Kết quả → state |
|---|---|---|
| unchanged | unchanged | `synced` (nếu `meta_remote_changed` → thêm pull metadata kênh phụ) |
| changed | unchanged | Push candidate → `local-changed` |
| unchanged | changed | Pull candidate → `remote-changed` |
| changed | changed, hash chuẩn hóa GIỐNG nhau | **Đã hội tụ → tự set `synced` + refresh 3 hash, KHÔNG hỏi BA** |
| changed | changed, hash KHÁC | **Conflict → `conflict`** (cần BA quyết, Mục 8) |
| — | remote deleted (không phải move) | `remote-missing` (tombstone) — KHÔNG tự xóa local |
| local mất | remote unchanged | Hỏi có phải cố ý archive → nếu archive: đề xuất unlink/label remote (Mục 6), KHÔNG tự xóa remote |
| local mất | remote changed | KHÔNG tự tạo lại local — hỏi BA (recreate từ remote / archive / unmap) |

> **Page MOVE ≠ deletion.** Confluence page đổi parent nhưng `page_id` còn → KHÔNG phải `remote-missing`. Cập nhật parent trong mapping + drift note, không tombstone. Chỉ page thật sự deleted/không còn `page_id` mới là `remote-missing`. Permission/inaccessible → state riêng `restricted` (xem Mục 6), KHÔNG lẫn với deleted.

### 4c. First-run / thiếu base (rất thường gặp — phải rõ)

* **`sync-state.yaml` NEW hoặc artifact chưa có base hash** → coi là `unmapped`. KHÔNG so hash với `null` (sẽ ra "conflict giả toàn bộ"). Push đầu = create; hoặc nếu artifact đã tồn tại remote (import/link) → **one-time baseline-capture**: fetch remote, ghi cả 3 base hash + snapshot, set `synced`, KHÔNG hỏi conflict.
* **Base snapshot thiếu/hỏng/không đọc được** (hand-edited, corrupt) → KHÔNG đoán. Set `unmapped` + cảnh báo, đề xuất re-baseline (fetch lại remote làm base mới, qua L1), KHÔNG âm thầm coi mọi thứ đã đổi.

**Chuẩn hóa (canonicalize) trước khi hash — tránh conflict giả:**
* Jira content: summary, description, AC (theo dạng đã chọn), priority, epic/parent, labels, links. Bỏ status/assignee/sprint khỏi kênh content (chúng ở kênh phụ).
* Confluence content: body chuẩn hóa (bỏ khác biệt whitespace/thứ tự thuộc tính macro không đổi nghĩa) + title + parent + labels.
* **Vùng opaque không round-trip được** (macro/panel/attachment/inline-comment Confluence): giữ nguyên từ remote trong snapshot, KHÔNG đưa vào diff content local; xem Mục 6 (cấm mark `synced` chỉ vì đã tạo placeholder).

## 5. Remote preflight (chốt chặn mất-dữ-liệu, BẮT BUỘC)

**Ngay trước MỌI ghi ra remote** (push update / apply resolution), fetch **bản remote đầy đủ hiện tại** và tính lại `content_remote_changed` = `hash(chuẩn-hóa-content(remote vừa fetch)) != base_remote_hash`:

* Remote **chưa đổi** (hash khớp base) → an toàn, update.
* Remote **đã đổi** (hash lệch base) → **DỪNG update cái đó**, chuyển vào reconcile. KHÔNG có "force update" như đường tắt thường ngày.

Áp dụng **kể cả khi đã có** issue-key / page_id (ID chỉ chống tạo trùng, KHÔNG chống ghi đè).

> **Thẩm quyền preflight = content-hash của bản remote VỪA fetch, KHÔNG phải watermark/version đã lưu.** `version.number` (Confluence) và `fields.updated` (Jira) là **gợi ý** để quyết có cần fetch-full không — chúng KHÔNG phải khóa an toàn ghi đè. **Không giả định API cho phép "submit version+1 rồi server tự chặn".** Tùy tool Atlassian MCP thực tế (Mục 12): nếu tool có tham số version/optimistic-lock thì tận dụng như lớp bảo vệ thứ 2; nếu KHÔNG expose version (nhiều MCP quản version nội bộ, không nhận version param) → **content-hash preflight ở trên là lớp bảo vệ DUY NHẤT** và BẮT BUỘC phải chạy đúng (fetch-full → hash → so base → mới ghi). Tuyệt đối KHÔNG update chỉ vì watermark khớp mà bỏ qua fetch-full-hash.

### 5a. Reconcile write protocol (fix mâu thuẫn "Giữ local" vs preflight)

Trong conflict, remote **đương nhiên đã đổi** so base — nên "Giữ local → push" phải theo protocol có kiểm soát, KHÔNG bỏ preflight:

1) BA xem diff của conflict (dựa trên bản remote R1 vừa fetch lúc build bảng reconcile).
2) BA chọn "Giữ local" (hoặc merge).
3) **Ngay trước khi ghi**, fetch lại remote R2. Nếu `hash(R2) == hash(R1)` (remote KHÔNG đổi thêm kể từ lúc BA xem) → ghi resolution (đây là ghi đè CÓ CHỦ ĐÍCH lên đúng phiên bản BA đã thấy, hợp lệ). Nếu `hash(R2) != hash(R1)` (remote đổi tiếp trong lúc BA cân nhắc) → **HỦY ghi, báo "remote vừa đổi tiếp, xem lại"**, dựng lại conflict với R2.
4) Sau ghi thành công → cập nhật cả 3 base hash + snapshot = trạng thái vừa ghi, set `synced`.

Cơ chế này thay cho việc dựa vào optimistic-lock của server (có thể không có). Nó biến "Giữ local" thành ghi-đè-có-chủ-đích-lên-đúng-phiên-bản-đã-xem, không phải ghi mù.

## 6. Field ownership (không phải "last write wins" toàn doc)

| Thay đổi remote | Xử lý mặc định |
|---|---|‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| Jira status / resolution / sprint / assignee | Pull về làm **delivery metadata** (ghi ở story-index hoặc sync-state). **KHÔNG** đổi `status` lifecycle của doc vault. |
| Jira summary / description / priority / AC | Conflict hoặc CR candidate (nếu local cũng đổi). |
| Jira epic/parent link, split/clone | Re-scope candidate — cần review traceability, đề xuất CR. KHÔNG tự map. |
| Jira comment | Import vào **feedback inbox** (Mục 8) — KHÔNG trộn vào prose requirement. |
| Confluence page body / title | Conflict nếu local đổi; pull nếu local không đổi. |
| Confluence comment / inline comment | Feedback inbox (có tác giả/ngày/link) — KHÔNG tự sửa doc nguồn. |
| Confluence page move (còn page_id) | Cập nhật parent trong mapping, KHÔNG tombstone. |
| Confluence page deletion (mất page_id) | Tombstone — cần BA quyết. |
| Confluence page restriction (không đọc/ghi được) | State `restricted` — cảnh báo visibility, KHÔNG tombstone, KHÔNG recreate ở quyền khác. |
| Attachment/diagram remote đổi, macro/panel/inline-comment | **Vùng opaque** — giữ nguyên từ remote, KHÔNG thay bằng placeholder rồi mark `synced`. Xem quy tắc dưới. |

> **Jira workflow status ≠ vault doc `status`.** `status` doc = vòng đời duyệt tài liệu (`draft`/`approved`/`stale`). Jira status = tiến độ thực thi (`In Progress`/`Done`). Lưu Jira status như delivery metadata, đừng ghi đè lifecycle.

> **Vùng opaque (Confluence không round-trip sạch):** khi pull, phần macro/panel/attachment/inline-comment KHÔNG map sạch sang markdown thì **giữ nguyên bản remote trong base snapshot** (opaque region) + placeholder có cấu trúc trong doc local để BA thấy. **CẤM mark `synced` chỉ vì đã tạo placeholder** — artifact có vùng opaque chưa được BA chọn "bên nào authoritative" thì **chặn push** (để lần push sau không dựng body từ markdown thiếu macro rồi ghi đè remote). Chỉ khi BA xác nhận authoritative side mới cho push, và push phải ghép lại opaque region từ snapshot.

> **Jira status write-back (transition):** mặc định `/jira --push` **KHÔNG** tự transition status trên Jira (tránh làm board nhảy ngoài ý muốn) — đây là no-op CÓ CHỦ ĐÍCH, nêu rõ cho BA. Nếu BA muốn đẩy tiến độ (vd đánh dấu story shipped) → đó là hành động **opt-in riêng** (dùng tool transition nếu MCP có), hỏi tường minh, KHÔNG gộp vào push field thường.

## 7. Sync state (drift) — tách khỏi `status: stale`

Trạng thái đồng bộ của artifact (ghi ở `sync-state.yaml`, KHÁC `status` lifecycle của doc):

```
synced | local-changed | remote-changed | conflict | remote-missing | local-missing | restricted | unmapped | partial-failure
```

| State | Ai set | Cách rời state |
|---|---|---|
| `synced` | Sau mỗi sync thành công / converged tự động | Kênh nào đó đổi ở lần inspect sau |
| `local-changed` | inspect: chỉ content-local đổi | `--push` thành công → `synced` |
| `remote-changed` | inspect: chỉ content-remote đổi | `--pull` thành công → `synced` |
| `conflict` | inspect: cả 2 content đổi, hash khác | `--reconcile` (giữ local/remote/merge/CR) → `synced`; skip → giữ `conflict` + chặn push |
| `remote-missing` | inspect: remote deleted (mất id) | BA quyết (recreate/archive/unmap) |
| `local-missing` | inspect: doc local mất | BA quyết (recreate từ remote/archive/unmap) |
| `restricted` | inspect: page permission chặn đọc/ghi | BA cấp quyền / unmap; KHÔNG recreate |
| `unmapped` | chưa map, hoặc base thiếu/hỏng (Mục 4c) | push create / baseline-capture → `synced` |
| `partial-failure` | 1 item ghi remote lỗi giữa batch (Mục 11) | rerun mode đó cho item đó thành công → `synced`; hoặc BA skip |

* **Đừng nhồi mọi drift tích hợp vào `status: stale`.** `stale` = biết có tác động tài liệu downstream. `remote-changed` = có thay đổi ngoài chưa xử lý. Chúng có thể kích hoạt nhau *sau khi review*, nhưng không đồng nhất.
* **converged (Mục 4b) → tự set `synced`, KHÔNG để kẹt `conflict`.**
* `/dashboard` nên hiện cả hai: stale chain (tài liệu) + Atlassian drift/conflict + last sync/feature + comment/issue chưa triage.

## 8. Màn hình reconcile cho BA (approval gate)

L1 preview của `--reconcile` (ngôn ngữ BA, KHÔNG tag dev):

```
Đối chiếu feature: payment
| Artifact       | Hệ         | Base   | Local     | Remote      | Đề xuất       |
| US-003         | Jira       | sync   | AC đổi    | AC đổi (PO) | Conflict      |
| prd.md         | Confluence | sync   | không đổi | body đã đổi | Kéo về (pull) |
| Epic PAY-42    | Jira       | sync   | không đổi | scope đổi   | Tạo CR        |
| uc-checkout.md | Confluence | sync   | đã đổi    | không đổi   | Đẩy lên (push)|
```

> Cột hiển thị "đã đổi / không đổi" theo hash, KHÔNG hiển thị version number như thẩm quyền (version chỉ là hint nội bộ, Mục 5).

Mỗi conflict: show diff gọn theo field/section, chỉ cho **5 lựa chọn có chủ đích**:

1) **Giữ local** → push bản local theo **reconcile write protocol** (Mục 5a: fetch-lại-so-hash trước ghi, remote đổi tiếp thì hủy). KHÔNG bỏ preflight.
2) **Giữ remote** → áp bản remote vào local qua **L2 diff**.
3) **Merge** → sinh bản gộp đề xuất (local diff), BA confirm qua L2, rồi push theo protocol Mục 5a. *Merge là bản đề xuất biên tập, KHÔNG phải tuyên bố đã tự merge prose đúng.*
4) **Tạo CR** → giữ cả 2 bên, tạo change record (`/cr`), mark doc liên quan stale/review-needed.
5) **Skip** → để chưa giải quyết, **chặn push artifact đó** cho tới khi xử lý.

## 9. Import = bootstrap có kiểm soát, KHÔNG phải máy sinh doc BA hoàn chỉnh

Epic/story/task/page chưa map:
1) Fetch + preview.
2) Hỏi BA chọn feature có sẵn HOẶC tạo feature mới (theo `feature-bootstrap.md`).
3) Tạo bản nháp/raw capture kèm source URL, version, tác giả, ngày lấy về.
4) **KHÔNG bao giờ** gắn nhãn `approved` cho nội dung import.
5) Hỏi BA có muốn chuyển thành URD/PRD/SRS/story không (việc của skill spec, không phải sync).

> Description của 1 remote epic là context hữu ích, KHÔNG tự động là SRS/requirement đã duyệt.

## 10. Feedback inbox (comment không phải requirement)

Comment Jira/Confluence pull về `docs/inbox/YYYY-MM-DD-{system}-feedback-{slug}.md` (hoặc register riêng), mỗi mục:
* Hệ nguồn, URL issue/page, tác giả, timestamp, comment ID.
* Feature/artifact liên quan.
* Trích ngắn (nếu được phép).
* Đề xuất xử lý: clarify / accept-as-CR / reject / duplicate / informational.
* Link tới quyết định/CR kết quả.

Bảo vệ doc BA canonical khỏi biến thành bản ghi thô hoạt động Jira/Confluence.

## 11. Partial failure & concurrency

* Ghi state per-artifact NGAY sau mỗi ghi remote thành công (resumable).
* Run ID + report rõ succeeded/failed/skipped/conflicted. Item lỗi giữa batch → set `partial-failure`.
* **Crash-safe create (chống tạo trùng sau crash):** TRƯỚC khi create remote (chưa có id), ghi 1 **pending-op record** (`.claude/state/atlassian/locks/pending-{runid}.yaml`) với vault_path + fingerprint (hash content sắp gửi). Nếu crash SAU create nhưng TRƯỚC khi ghi `remote_id`: lần resume thấy pending-op còn treo → **KHÔNG create lại**; search remote theo fingerprint/label (vd label `ba-vault:{vault_path}`) để adopt kết quả đã tạo; tìm thấy → ghi id + xóa pending; không thấy → mới create. Remote preflight (Mục 5) chỉ bảo vệ update-có-id, pending-op bảo vệ create.
* **Concurrency — lock cho MỌI write mode, không chỉ reconcile:** lock/feature (`locks/{feature}.lock` chứa owner + timestamp + run-id) khi chạy `--push`/`--pull`/`--reconcile`/`import`. Lock cũ quá hạn (vd >30 phút, process chết) → cảnh báo + cho phép chiếm với confirm.
* **Multi-BA khác máy:** local lock chỉ bảo vệ trong 1 working copy. Vì `sync-state.yaml` commit chung git → 2 BA ở 2 clone có thể tạo **git merge conflict** trên sync-state. Quy tắc: coi sync-state như file nguồn — merge conflict thì BA giải quyết thủ công (mỗi entry độc lập theo `vault_path`, thường merge dễ), rồi chạy lại inspect để đối chiếu remote thật. KHÔNG auto-merge sync-state.
* Re-fetch remote trước khi resume batch lỗi.
* **KHÔNG auto-retry** khi lỗi validation/permission/conflict/mapping. Rate-limit → kế hoạch retry hiện cho user thấy.

## 12. Capability discovery (đừng hứa API chưa kiểm — BẮT BUỘC chạy TRƯỚC L1)

Bộ Atlassian MCP thực tế có thể **KHÔNG expose** những gì REST API Cloud có (vd không nhận `version.number` param, không có tool upload attachment, macro phải qua `contentFormat: html` chứ không phải ADF thô). Vì vậy:

* **Chạy capability-discovery TRƯỚC khi đưa BA vào L1 plan** có thao tác phụ thuộc tool (mermaid render, attachment, transition, đọc changelog, walk tree, version-guard). Thiếu tool → chọn fallback NGAY, để plan BA duyệt là plan thực thi được — KHÔNG để duyệt xong mới phát hiện bất khả thi rồi xin lại quyết định.
* **Version-guard KHÔNG chắc có** → content-hash preflight (Mục 5) là lớp bảo vệ duy nhất, luôn chạy.
* **Mermaid:** kiểm tool nhận định dạng nào (ADF extension node? `contentFormat: html` với `data-extension-key`? — xem `../skills/confluence/references/mermaid-adf.md`). Chọn đúng định dạng tool THẬT nhận, đừng bám 1 recipe cứng.
* Thiếu tool cho 1 mode → fallback rõ ràng (export file / hỏi user), KHÔNG giả định.

## 13. Phạm vi tool (Claude vs Codex)

`/jira` + `/confluence` + rule này + sync-state hiện đặt ở `.claude/`. Codex CLI đọc `.codex/` (xem `AGENTS.md`) — repo này CHƯA mirror 2 skill sang `.codex/skills/`. Nếu muốn chạy sync từ Codex → cần copy skill + rule sang `.codex/` tương ứng. Hiện tại là **Claude-only**, có chủ đích (tránh 2 toolchain áp governance lệch nhau).

## Tóm tắt 1 dòng

> **Default inspect · 2 kênh drift (content 3-way + metadata/comment pull-thẳng) bằng content-hash · content-hash preflight (KHÔNG dựa version) trước mọi ghi · reconcile write-protocol fetch-lại-so-hash · cả-2-content-đổi = conflict cho BA (5 lựa chọn) · status Jira ≠ status doc, push không tự transition · comment vào feedback-inbox · opaque region chặn push · crash-safe create · import = nháp inbox chưa duyệt · capability-discovery trước L1.**‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
