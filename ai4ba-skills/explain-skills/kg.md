---
type: skill-explainer
skill: kg
updated: 2026-08-01
---

# `/kg` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/kg` (Knowledge Graph — bản đồ tri thức) là lệnh quản lý **tấm bản đồ liên kết của toàn bộ vault** — nó quét MỌI tài liệu trong `docs/` (yêu cầu, use case, user story, test, màn hình, luồng, ERD, quyết định họp, thuật ngữ, CR...) và ghi lại mọi mối nối giữa chúng: yêu cầu nào được story nào cover, story nào có test, màn hình nào thuộc luồng nào, quyết định họp nào đụng yêu cầu nào. Bạn có thể hình dung nó giống **mục lục + bảng chỉ dẫn của một tòa thư viện**: muốn biết cuốn sách A liên quan tới cuốn nào, tra bảng chỉ dẫn trong 5 giây — thay vì rút từng cuốn xuống đọc lại từ đầu.

Điểm đặc biệt: **bạn gần như không bao giờ phải gõ `/kg` trực tiếp**. Nó là hạ tầng chạy ngầm cho các lệnh bạn vẫn dùng hằng ngày (`/gap`, `/cr`, `/dashboard`...). Bạn chỉ chủ động gõ khi:

| Tình huống của bạn | Gõ gì |
|---|---|
| Muốn xem bản đồ vault dạng hình | mở file `docs/_shared/kg/kg-viewer.html` (xem Mục 8) |
| Vừa sửa tài liệu bằng Obsidian/tay (ngoài Claude Code) | `/kg build` — đồng bộ lại bản đồ |
| Muốn "khám sức khỏe" liên kết: link gãy, mã lỗi refer nhầm | `/kg verify` |
| Muốn hỏi nhanh 1 câu cấu trúc ("sửa FR này đụng gì?") | `/kg impact FR-...-011` |
| Muốn biết **1 tài liệu/yêu cầu đã đổi mấy lần, CR nào sửa nó** | `/kg history FR-...-011` (xem Mục 10) |
| Muốn biết **yêu cầu này hồi tháng trước ghi gì** (bản cũ nguyên văn) | `/kg asof FR-...-011 2026-06-15 --show` (xem Mục 10) |

---

## 2. Vì sao phải làm tính năng này — câu chuyện gốc‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trước khi có KG, một số lệnh phải **đọc lại toàn bộ tài liệu của feature** mỗi lần chạy, chỉ để tìm xem file nào liên quan. Đo thật trên feature `authentication` (57 file):

- `/gap` hoặc `/cr` nạp **679 KB văn bản (~170.000 token)** vào đầu AI **mỗi lần chạy** — như bắt một nhân viên đọc lại cả tủ hồ sơ chỉ để trả lời "hồ sơ nào nhắc tới điều khoản số 11".
- Token = tiền. Đọc thừa lặp đi lặp lại là đốt tiền vào việc máy tính thường làm được miễn phí.

Nhưng có một ràng buộc quan trọng hơn tiền: **cắt token mà làm AI hiểu thiếu ngữ cảnh thì output sai — còn tệ hơn tốn tiền.** Vì vậy KG được thiết kế theo một nguyên tắc bất di bất dịch:

> **Bản đồ chỉ để CHỌN file cần đọc. Kết luận nội dung LUÔN dựa trên việc đọc nguyên văn tài liệu đã chọn.**

Giống như bảng chỉ dẫn thư viện giúp bạn rút đúng 8 cuốn thay vì 57 cuốn — nhưng 8 cuốn đó bạn **vẫn phải đọc thật**, không ai tóm tắt hộ rồi bảo bạn tin.

---

> **6 từ sẽ gặp nhiều trong tài liệu này:**
> - **Token** — đơn vị tính tiền của AI, đại khái ~3/4 chữ. AI đọc/viết càng nhiều chữ càng tốn.
> - **Node / edge** — chấm và dây trên bản đồ: node = 1 "vật" (1 yêu cầu, 1 màn hình...), edge = 1 quan hệ có tên giữa 2 vật.
> - **Prose / nguyên văn** — câu chữ thật trong tài liệu (khác với bản đồ chỉ ghi "A nối B").
> - **Shortlist** — danh sách rút gọn các file đáng đọc mà bản đồ chọn ra.
> - **File dẫn xuất** — file máy sinh ra từ nguồn khác (như bản in từ file gốc): hỏng thì sinh lại, không sửa tay.
> - **Tìm toàn văn (grep)** — máy quét chuỗi ký tự qua mọi file, 0 token.

## 3. Bộ máy gồm những gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Tất cả nằm trong `.claude/skills/kg/` + 1 rule + 1 hook. Không cần cài thêm bất kỳ phần mềm nào (chỉ dùng Node.js có sẵn):

| Bộ phận | File | Việc của nó | Ai chạy nó |
|---|---|---|---|
| **Trình biên dịch** | `engine/kg-build.mjs` | Quét toàn bộ `docs/` (~1 giây) → dựng file bản đồ `graph.json`: ~1.085 điểm nút (FR, US, AC, màn hình, luồng, entity, test case, quyết định họp, thuật ngữ...) + ~3.400 mối nối có tên (US *cover* FR, AC *verify* FR, test *automate* checklist, quyết định *thay thế* quyết định cũ...) | Tự động (xem Mục 5) |
| **Trình tra cứu** | `engine/kg-query.mjs` | 14 lệnh hỏi bản đồ: `impact` (sửa X vỡ gì), `coverage` (FR nào chưa ai cover), `suspect` (tài liệu nào lỗi thời so với nguồn), `tour` (lộ trình đọc onboarding), `trace`, `crud`, `counts`... **+ 2 lệnh lịch sử** `history`/`asof` (Mục 10) | Các skill khác + bạn |
| **Trình lịch sử** | `engine/kg-history.mjs` | Dựng file bản đồ RIÊNG `graph-history.json` — lịch sử đổi của tài liệu qua thời gian (ai/khi/CR nào sửa yêu cầu nào, bản cũ ra sao). TÁCH khỏi bản đồ chính để việc tra hằng ngày không nặng thêm. Xem Mục 10 | Tự động khi bạn hỏi lịch sử |
| **Trình vẽ hình** | `engine/kg-viewer.mjs` | Sinh `kg-viewer.html` — bản đồ dạng hình mở bằng browser | Đã có sẵn trong repo; mỗi lần build lại bản đồ nó tự được làm MỚI. (Lỡ xóa file thì chạy lại 1 lần: `node .claude/skills/kg/engine/kg-viewer.mjs`) |
| **Máy soát lỗi** | `kg-build.mjs --verify` | Như CI cho tài liệu: bắt link gãy, mã refer không tồn tại, file mồ côi không index nào biết (đã bắt được 75 lỗi thật trong docs demo) | Bạn, khi muốn khám sức khỏe |
| **Luật chơi** | `.claude/rules/kg-usage.md` | Quy tắc vàng cho MỌI skill dùng bản đồ (Mục 4) | 24 skill tự tuân |
| **Chuông báo** | `.claude/hooks/kg-refresh.sh` | Mỗi lần tài liệu được ghi/sửa → đánh dấu "bản đồ cũ rồi" | Tự động, vô hình |
| **Máy tự kiểm** | `engine/kg-selftest.mjs` | Bộ 137 phép thử trên một feature mẫu chuẩn: mỗi lần ai đó sửa engine, chạy bộ này để chắc bản đồ vẫn đọc đúng mọi loại tài liệu (kể cả các lỗi cài sẵn phải bắt được, kể cả lịch sử dựng từ git thật) | Người sửa engine, trước khi lưu |
| **3 file sản phẩm** | `docs/_shared/kg/graph.json` + `graph-history.json` + `kg-viewer.html` | Bản đồ dữ liệu (hiện tại) + bản đồ lịch sử + bản đồ hình. Đều là **file DẪN XUẤT** — hỏng thì xóa, build lại là xong, không bao giờ sửa tay | — |

---

## 4. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

**Nguyên tắc lõi: mọi thứ tự động, bản đồ luôn tươi mà bạn không phải nhớ lệnh nào.**

```
┌─────────────────────────────────────────────────────────────┐
│  BẠN LÀM VIỆC BÌNH THƯỜNG                                    │
│  /brainstorm, /srs, /userstory... ghi/sửa tài liệu           │
└──────────────────────┬──────────────────────────────────────┘
                       ▼  (tự động, 0 token)
┌─────────────────────────────────────────────────────────────┐
│  CHUÔNG BÁO kg-refresh.sh                                    │
│  đánh dấu cờ "bản đồ đã cũ" (.dirty) — chưa build vội        │
└──────────────────────┬──────────────────────────────────────┘
                       ▼  (lần ĐẦU TIÊN có ai cần bản đồ)
┌─────────────────────────────────────────────────────────────┐
│  TỰ BUILD LẠI  kg-build.mjs  (~1 giây, 0 token)              │
│  graph.json mới  ──►  kg-viewer.html (đã có) tự làm mới theo │
│  Build hỏng? → BÁO TO, skill quay về cách đọc cũ,            │
│  KHÔNG BAO GIỜ âm thầm dùng bản đồ cũ                        │
└──────────────────────┬──────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  SKILL DÙNG BẢN ĐỒ ĐỂ CHỌN FILE  (vd /cr):                   │
│  kg impact FR-payment-011  →  "cần đọc 8 file này"           │
│  + mục "PHẢI ĐỌC TAY": file bản đồ không hiểu được           │
└──────────────────────┬──────────────────────────────────────┘
                       ▼  (đây mới là chỗ tốn token — có chủ đích)
┌─────────────────────────────────────────────────────────────┐
│  AI ĐỌC NGUYÊN VĂN 8 file đã chọn + grep quét giá trị        │
│  → phân tích, kết luận, đề xuất — như trước giờ vẫn làm      │
└─────────────────────────────────────────────────────────────┘
```

Ba "van an toàn" được ép vào code (không phải lời dặn suông):

1. **Danh sách không bao giờ bị cắt lặng lẽ** — dài quá thì in rõ "⚠ còn N mục — chạy với --all", skill bắt buộc lấy đủ rồi mới đọc.
2. **File bản đồ không hiểu được** (format lạ, bảng thiếu cột) → tự động vào mục **"Phải Read tay"** kèm dòng "Độ phủ: 151/162" — skill phải đọc bù các file đó, không tin mù bản đồ.
3. **Bản đồ hỏng/lỗi thời → báo lỗi to** (`KG-ERROR`) và skill quay về cách đọc-toàn-bộ cũ. Chậm mà đúng, không nhanh mà sai.

---

## 5. Cái nào tốn token (tiền), cái nào không?

Đây là phần quan trọng nhất với người quản ngân sách. Quy tắc nhớ nhanh: **script chạy trên máy = miễn phí; AI đọc chữ = tốn tiền.**

> Các con số dưới đây đo thật trên vault demo này (57 file/feature) — vault của bạn khác cỡ thì số khác theo, nhưng TỶ LỆ giữa các mức thì giữ nguyên.

### Miễn phí tuyệt đối (0 token — thuần máy tính)

| Việc | Khi nào chạy |
|---|---|
| Chuông báo đánh dấu bản đồ cũ | Mỗi lần ghi tài liệu |
| Build lại bản đồ (~1 giây) | Tự động khi cần |
| Làm mới viewer HTML (khi file đã tồn tại) | Tự động theo build |
| Soát lỗi `--verify` (phần chạy máy) | Khi bạn gọi |
| **Mở viewer xem hình, click, filter, search** | Bất cứ lúc nào — xem cả ngày không tốn đồng nào |

### Tốn ít (vài trăm → vài nghìn token — AI đọc KẾT QUẢ tra cứu)

| Việc | Cỡ | So với trước |
|---|---|---|
| `kg counts` (số liệu cho dashboard/banner) | ~300 token | thay ~10 lượt quét vault |
| `kg coverage` (FR nào chưa cover — cho `/gap`) | ~1.100 token | thay đọc cả feature ~170.000 |
| `kg impact` (sửa X vỡ gì — cho `/cr`) | ~4.000 token | — |
| Gõ `/kg build` trong chat | ~vài trăm token | (AI gọi lệnh + đọc 1 dòng kết quả; chạy tay ngoài chat = 0) |

### Tốn có chủ đích (phần "mua ngữ cảnh" — KHÔNG được cắt)

| Việc | Cỡ | Vì sao đáng tiền |
|---|---|---|
| AI đọc nguyên văn các file trong shortlist | tùy số file — trên demo: ~26-35 file thay 57 | Kết luận nghiệp vụ phải dựa trên chữ thật — cắt chỗ này là output sai |
| AI đọc file "Phải Read tay" | tùy | Bản đồ tự thú nhận không hiểu file đó — ai đó phải đọc thật |
| `/update-overview` quét prose tìm thuật ngữ | như cũ | Thuật ngữ/wording sống trong câu chữ, bản đồ không chứa |

Đo thật trên vault demo: `/gap` tiết kiệm **~91%** khi tài liệu viết bằng skill hiện hành; `/cr` đọc ~26-35 file thay 57 (gồm cả các file bản đồ tự nhận không hiểu, bắt đọc bù). Với tài liệu format cũ (demo), tiết kiệm tụt còn ~22% vì bản đồ trung thực bắt đọc tay những file nó không hiểu — **đó là trả giá đúng cho ngữ cảnh, không phải lỗi.**

---

## 6. Nó tương tác với các skill khác thế nào

**24 skill** đã được nối vào bản đồ (nhóm "đọc-rộng-để-chọn"), chia 2 mức:

| Mức | Skill | Dùng bản đồ để làm gì |
|---|---|---|
| **Sâu** — thay hẳn bước quét | `/gap` | `coverage` + `trace` dựng ma trận truy vết; máy dò thiếu-luồng cũng chạy thuật toán trên bản đồ này; riêng bước so-lệch-nội-dung (ngày BRD vs PRD, định nghĩa trôi) **vẫn đọc nguyên văn vô điều kiện** |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| | `/cr` | `impact` chọn shortlist → đọc đủ prose → **quét thêm giá trị** ("5 lần", "24h") toàn feature — lưới an toàn kép |
| | `/dashboard` | `counts`/`coverage`/`orphans` làm nguồn số; máy đếm cũ thành phương án dự phòng |
| | `/update-overview` | bản đồ CHỈ chọn file đáng quét; việc quét chữ giữ nguyên |
| | `/discover` | tìm feature/brainstorm liên quan trước, rồi grep + đọc như cũ |
| **Nhẹ** — thêm 1 bước chọn nguồn | `/srs` `/userstory` `/ac` `/usecase` `/user-flow` `/urd` `/brd` `/prd-epic` `/api-doc` `/wireframe-ascii` `/wireframe-html` `/test-checklist` `/api-checklist` `/test-cases` `/jira` `/confluence` `/meet` | trước khi quét tìm tài liệu nguồn, hỏi bản đồ "quanh feature này có gì" — rồi vẫn đọc nguyên văn file đã chọn. Vd `/jira` hỏi story nào đã map Jira, `/meet` hỏi "chủ đề này từng có quyết định nào" — nhưng nội dung quyết định/story vẫn đọc từ file thật |

**~26 skill còn lại KHÔNG đụng bản đồ — có chủ đích:**
- Nhóm "đọc-để-tạo-sản-phẩm" (`/export`, `/userguide`, `/preview`, `/figma`, `/prototype-html`...): với chúng, đọc toàn văn **chính là công việc** — render một bản export mà không đọc đủ nội dung thì export thiếu. Cắt là hỏng.
- Nhóm "vốn đã rẻ" (`/erd`, `/sequence`, `/roadmap`...): chỉ đọc 1-2 file cố định, nối bản đồ vào không bõ công.

Mọi skill nhóm A đều tuân chung 1 luật (`.claude/rules/kg-usage.md`) — sửa luật 1 chỗ, 24 skill theo.

---

## 7. Vì sao bản đồ tự cập nhật được — và khi nào KHÔNG?

Chu trình tự động: **ghi tài liệu → chuông báo → lần dùng kế tiếp tự build → viewer đang có tự được làm mới.** Bạn thêm feature mới bằng `/brainstorm`, chạy bất kỳ lệnh nào có dùng KG, mở viewer là thấy cụm node mới.

Chỉ có **1 trường hợp bản đồ không tự biết**: bạn sửa tài liệu **ngoài Claude Code** (gõ trực tiếp trong Obsidian, kéo file trong Finder, git pull từ đồng nghiệp). Chuông báo không reo vì không ai gọi nó. Xử lý: quay lại chat gõ `/kg build` (hoặc chạy tay lệnh dưới) — 1 giây là đồng bộ.

3 điều PHẢI nhớ (rút từ audit vận hành):

1. **Bản đồ là bản chụp dẫn xuất** — không phải nguồn sự thật. Kết luận coverage dùng `/gap`, kết luận nội dung đọc tài liệu gốc.
2. **Đổi tên / xóa feature là một cuộc "chuyển nhà"**: phải đổi cả folder + dòng `feature:` trong từng file + các mã ID liên quan, xong chạy `/kg verify` soát lại. Chỉ rename folder bằng Finder → bản đồ sẽ cảnh báo "frontmatter ≠ folder" nhưng đừng để tới lúc đó.
3. **Sau khi git pull / làm việc nhóm**: đừng bao giờ sửa tay hay merge tay `graph.json`/`kg-viewer.html` — xóa và build lại luôn cho sạch.

---

## 8. Xem bản đồ dạng hình bằng cách nào? (4 đường)

### Đường 1 — Double-click (dễ nhất, 0 token)

Mở file **`docs/_shared/kg/kg-viewer.html`** bằng browser (Chrome/Safari/Edge đều được, không cần mạng, không cài gì). Trong đó có:

- Hình **bản đồ điểm-và-dây**: mỗi chấm là 1 "vật" (FR đỏ, tài liệu xám, màn hình, entity...), chấm càng to càng nhiều liên kết đang hiển thị nối vào nó; dây là quan hệ.
- **Panel trái**: chọn Feature, tìm theo mã/tên, bật tắt loại quan hệ, chú giải màu (bấm để ẩn/hiện loại node), và mục **"ℹ️ Đọc trước khi xem"** dành cho người mở lần đầu.
- **Panel phải**: bấm 1 chấm → hiện đầy đủ hồ sơ (mô tả, trạng thái, file nguồn dòng bao nhiêu, ai nối vào nó — bấm tiếp để "đi bộ" trên bản đồ).

**Công thức 5 phút cho người mới:** chọn 1 Feature → gõ 1 mã vào ô tìm (vd `FR-authentication-011`) → bấm chấm được zoom tới → lần theo bảng quan hệ ở panel phải → để ý chấm TO (nhiều liên kết — sửa nó thường là chuyện lớn) và chấm LẺ tách bầy (ứng viên mồ côi).

> Lưu ý khi đưa sếp/khách xem: **màu = LOẠI, không phải tốt/xấu** (chấm đỏ là "yêu cầu chức năng", không phải "đang lỗi"); 3 loại dây nhiễu đang ẩn mặc định nên "2 chấm không nối" chưa chắc không liên quan.

### Đường 2 — Sinh lại chủ động (khi vừa sửa docs ngoài Claude)

```bash
node .claude/skills/kg/engine/kg-build.mjs      # build + làm mới viewer đang có (0 token, ~1s)
open docs/_shared/kg/kg-viewer.html
```
Hoặc trong chat: `/kg build` rồi F5 browser.

### Đường 3 — Hỏi bằng chữ thay vì nhìn hình (chính xác tuyệt đối)

Hình để định hướng; con số nghiêm túc thì hỏi thẳng:

```bash
/kg impact FR-payment-011      # sửa cái này đụng gì — danh sách ĐỦ, không bị filter che
/kg coverage payment           # FR nào chưa có story/test
/kg suspect --feature payment  # tài liệu nào chưa cập nhật theo thượng nguồn
/kg verify                     # khám sức khỏe link toàn vault
/kg history FR-payment-011     # LỊCH SỬ: yêu cầu này đổi mấy lần + CR nào sửa (Mục 10)
/kg asof FR-payment-011 2026-06-15 --show   # LỊCH SỬ: bản yêu cầu hồi 15/6, nội dung nguyên văn
```

### Đường 4 — Neo4j (dành cho người muốn nghịch sâu)

`/kg cypher > kg.cypher` rồi import vào Neo4j Browser/Bloom — chỉ đáng khi bạn đã có Neo4j và muốn viết truy vấn đồ thị riêng. Với nhu cầu BA hằng ngày, Đường 1 + 3 là đủ.

> Giới hạn hiện tại của viewer: thoải mái tới ~1.000-2.000 node. Vault phình lớn hơn nữa thì luôn lọc theo 1 feature trước khi nhìn (dropdown trái) — nhìn toàn vault 5.000 chấm vừa lag vừa không đọc được gì.

---

## 9. Bản đồ hiện BIẾT gì và CHƯA biết gì? (thành thật)

**Đã phủ tốt:**
- Chuỗi yêu cầu lõi: BO → CAP → FR/NFR/BR/E → UC → US → AC, màn hình, luồng, entity/ERD/DBML, trạng thái, CR, nghiên cứu `/discover`.
- **Chuỗi test đầy đủ:** checklist item → test case → script tự động — hỏi được "FR nào chưa có checklist?", "test nào automate rồi?".
- **Kế hoạch sản phẩm:** feature trong Feature Map **chưa tạo folder** vẫn có trên bản đồ (đánh dấu "planned"), kèm phụ thuộc giữa feature và đợt Now/Next/Later.
- **Quyết định trong họp:** mỗi quyết định/rủi ro/action item trong meeting note là 1 chấm — thấy được quyết định nào **thay thế** quyết định cũ, quyết định nào đụng FR/BR nào.
- **Ai render màn hình nào:** "screen nào chưa có wireframe/prototype?" giờ nằm ngay trong `kg coverage`.
- **Thuật ngữ:** mỗi mục Glossary trong `definitions.md` là 1 chấm (kèm tên Việt/alias).
- **BPMN:** quy trình nào ném ra mã lỗi nào (đọc từ file nguồn `.src.json`).
- **Lịch sử tài liệu nghiệp vụ:** tài liệu/yêu cầu đã đổi mấy lần, ai/khi/skill nào, CR nào sửa yêu cầu nào (kèm bản trước/sau), và yêu cầu đó **hồi ngày X ghi chính xác gì** — hỏi bằng `history`/`asof`. Chi tiết Mục 10. Sống ở file bản đồ RIÊNG nên KHÔNG làm nặng việc tra hằng ngày.

**Còn chưa vào bản đồ (hỏi graph sẽ KHÔNG thấy — phải đọc tài liệu trực tiếp):**

| Vùng mù | Nghĩa là gì với bạn |
|---|---|
| **Chi tiết Impact Matrix trong CR** | Impact mức file thì có; mức từng-ID-kèm-độ-rủi-ro thì chưa |
| **Từng endpoint API của đối tác** (`api-summary.md`) | "Endpoint nào chưa có test?" chưa query được — sẽ làm khi có tích hợp đối tác thật |
| **Thuật ngữ dùng ở ĐÂU** | Bản đồ biết term tồn tại, chưa biết doc nào đang dùng nó — đổi định nghĩa vẫn phải rà tay |

---

## 10. Lịch sử tài liệu — bản đồ "quá khứ" tách riêng

Bản đồ chính (`graph.json`) chỉ chụp **hiện tại**: yêu cầu bây giờ ghi gì, nối với gì. Nó không giữ diễn tiến — một FR từng ghi khác, CR nào đã sửa nó, bản cũ ra sao. Từ 2026-07 có thêm một **bản đồ quá khứ RIÊNG** trả lời đúng những câu đó.

### Vì sao TÁCH riêng, không nhồi vào bản đồ chính?

Đây là quyết định thiết kế cốt lõi. Nếu nhét lịch sử vào bản đồ chính, mọi lệnh tra hằng ngày (`/gap`, `/cr`, `/dashboard`) sẽ **vô tình kéo theo cả đống dữ liệu quá khứ dư thừa** — như hỏi "hồ sơ nhân viên này hiện thế nào" mà bị dúi thêm 20 bản nháp cũ. Nên lịch sử sống ở file riêng `docs/_shared/kg/graph-history.json`:

> **Luồng hằng ngày KHÔNG đọc một byte quá khứ nào.** Chỉ khi bạn hỏi rõ về lịch sử (gõ `history`/`asof`) thì bản đồ quá khứ mới được mở ra.

### 3 câu hỏi lịch sử trả lời được

| Bạn hỏi | Gõ | Nguồn |
|---|---|---|
| "Tài liệu / yêu cầu này **đổi mấy lần**, ai, khi nào, bằng skill gì?" | `/kg history docs/.../spec.md` | nhật ký hoạt động (`changelog.md`) |
| "**CR nào đã sửa** yêu cầu này, đổi từ gì thành gì?" | `/kg history FR-...-011` | các bản ghi CR (phần "Applied Changes") |
| "Yêu cầu này **hồi ngày 15/6 ghi chính xác gì**?" | `/kg asof FR-...-011 2026-06-15 --show` | lịch sử Git của file (lấy nội dung nguyên văn bản cũ) |

Ví dụ thật trên vault này — `history BR-authentication-002` cho biết CR-20260627-001 đã đổi chính sách mật khẩu từ "6-20 ký tự" thành "8-20 ký tự"; `asof BR-authentication-002 2026-07-01 --show` in ra nguyên văn dòng yêu cầu tại thời điểm đó (lấy từ Git, không phải chép tay).

### Nó lấy dữ liệu từ đâu (và điểm trung thực)

Ba nguồn có sẵn, trước giờ bị bỏ phí: **nhật ký hoạt động** (mỗi lần skill ghi/sửa file đều để lại 1 dòng), **bản ghi CR** (đã lưu trước/sau khi sửa), và **lịch sử Git** (mọi phiên bản file đều còn trong git). Bản đồ quá khứ chỉ *nối* chúng lại — nội dung bản cũ nguyên văn thì lấy trực tiếp từ Git khi bạn thêm `--show`, không lưu bản sao (nhẹ, không phình file).

Vài chỗ thành thật về giới hạn (đã ghi trong kế hoạch, sẽ cải thiện): CR ghi kiểu gạch đầu dòng (không có khối trước/sau) chỉ được đánh dấu "có nhắc tới" chứ chưa chắc "đã sửa"; yêu cầu bị **xóa hẳn** khỏi tài liệu hiện tại thì mất dấu quá khứ; file bị **đổi tên** qua nhiều commit có thể không lấy được nội dung bản rất cũ. Những điểm này nằm trong danh sách việc-làm-tiếp, không ảnh hưởng độ đúng của phần lõi.

---

## Ví dụ thực tế

Chị Lan (BA) nhận yêu cầu: *"Đổi chính sách khóa tài khoản từ 5 lần sai còn 3 lần."*

1. Chị gõ `/cr "đổi lockout 5 lần thành 3 lần" --feature authentication`.
2. Ngầm bên dưới: bản đồ được kiểm tra độ tươi (vừa có người sửa docs sáng nay → tự build lại trong 1 giây, chị không thấy gì cả).
3. `/cr` hỏi bản đồ: *"FR-authentication-011 nối với những gì?"* → nhận về shortlist 19 file (spec, use case đăng nhập, các user story liên quan, màn hình login, test...) **cộng** danh sách "Phải Read tay" — trên vault demo là 16 file nữa vì demo còn nhiều file format cũ bản đồ không hiểu (vault viết bằng skill mới thì mục này mỏng đi hẳn).
4. AI đọc **nguyên văn** ~35 file đó (đây là chỗ tốn token — đáng, và vẫn ít hơn hẳn 57 file như trước), rồi tìm toàn văn chữ "5 lần" khắp feature để chắc không sót chỗ nào ghi con số cũ trong câu văn.
5. Chị nhận bản phân tích tác động + đề xuất sửa từng file, duyệt từng diff như mọi khi. Toàn bộ HITL (dừng chờ duyệt) giữ nguyên — bản đồ không bao giờ tự ý sửa gì.
6. Chiều đó, sếp hỏi "feature đăng nhập giờ phức tạp cỡ nào?" — chị mở `kg-viewer.html`, chọn feature `authentication`, chụp màn hình cụm bản đồ gửi sếp. 0 token.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (schema bản đồ, 14 lệnh tra cứu, quy tắc an toàn ngữ cảnh, temporal 3 tầng, lộ trình mở rộng), đọc file gốc: `.claude/skills/kg/SKILL.md`, hợp đồng lịch sử `.claude/skills/kg/engine/SCHEMA-history.md`, luật chung `.claude/rules/kg-usage.md`, và kế hoạch thiết kế `docs/reports/2026-07-13-knowledge-graph-plan.md` + `docs/reports/2026-07-17-kg-temporal-history-plan.md`. Về hai file log mà KG ăn dữ liệu (`changelog.md` cho lịch sử, `staleness.md` cho cạnh ảnh hưởng), đọc `explain-skills/changelog-staleness.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
