# Ví dụ — output thật của bộ BA-Kit‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Hai feature chạy qua bộ skill, giữ nguyên kết quả. Không phải ảnh chụp màn hình quảng cáo — đây là file thật, mở ra đọc được, và là thứ các bạn sẽ nhận được khi chạy skill.

---

## Đọc theo thứ tự nào‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nếu chỉ có 5 phút, mở đúng ba file này của `authentication/`:

1. **`brainstorms/`** — điểm bắt đầu. Một ý tưởng thô được hỏi han thành thứ có cấu trúc.
2. **`srs/authentication-spec.md`** — đặc tả. Để ý cột mã lỗi và mục Open Questions.
3. **`userstories/authentication-story-index.md`** — kết quả cuối, thứ đưa cho dev.

Ba file đó cho thấy cả chuỗi: __ý tưởng → đặc tả → backlog__.

Còn nếu muốn xem gì đó bấm được ngay: mở `authentication/authentication-preview.html` bằng trình duyệt.

---

## Hai feature khác nhau ở chỗ nào‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| | `authentication` | `premium-payment` |
|---|---|---|
| Nội dung | Đăng nhập, đăng ký, quên mật khẩu, xác thực 2 lớp | Nâng cấp gói trả phí, thanh toán qua đối tác |
| Số file | ~75 | ~63 |
| Điểm mạnh để xem | Wireframe HTML, BPMN, bộ test đầy đủ | __Tích hợp API đối tác__ + test API bằng Bruno |
| Xem nếu các bạn quan tâm | Luồng nghiệp vụ nội bộ, thiết kế màn hình | Làm việc với API bên thứ ba |

Hai bộ này cộng lại phủ gần hết các nhóm skill trong bộ.

---

## Bản đồ: file này do skill nào sinh ra‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Phần đầu — làm rõ và đặc tả‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| File / thư mục | Skill sinh ra | Nội dung |
|---|---|---|
| `brainstorms/*.md` | `/brainstorm` | Ý tưởng thô sau khi được hỏi làm rõ |
| `{feature}-urd.md` | `/urd` | Người dùng là ai, cần gì |
| `{feature}-brd.md` | `/brd` | Lý do kinh doanh, mục tiêu, rủi ro |
| `{feature}-prd.md` | `/prd-epic` | Phạm vi feature, các năng lực theo mức ưu tiên |
| `srs/{feature}-spec.md` | `/srs` | __Đặc tả lõi__ — yêu cầu chức năng, business rule, bảng mã lỗi |

> `srs/{feature}-spec.md` là file trung tâm. Gần như mọi thứ phía sau đều đọc từ nó.

### Phần sơ đồ

| File | Skill | Nội dung |
|---|---|---|
| `srs/{feature}-flows.md` | `/sequence`, `/activity` | Sơ đồ tuần tự và sơ đồ luồng |
| `srs/{feature}-states.md` | `/state` | Vòng đời trạng thái của một đối tượng |
| `srs/{feature}-erd.md` | `/erd` | Mô hình dữ liệu (Mermaid, nhúng inline) |
| `d2-erd/` | `/d2-erd` | Cùng mô hình dữ liệu nhưng vẽ đẹp hơn, file riêng |
| `bpmn/` | `/bpmn` | Quy trình chuẩn OMG — mở được bằng Camunda, Bizagi |
| `usecases/{feature}-usecase-diagram.svg` | `/usecase-diagram` | Sơ đồ use case tổng quan |

> Mở `d2-erd/` và `srs/{feature}-erd.md` cạnh nhau để thấy __cùng một nội dung, hai cách trình bày__. Đây chính là ví dụ cho chuyện ở [chương 04](../huong-dan/04-skill-preload-va-token.md): nhiều skill gần nghĩa, các bạn chỉ nên giữ một.

### Phần use case và màn hình

| File | Skill | Nội dung |
|---|---|---|
| `usecases/uc-*.md` | `/usecase` | Use case chi tiết, viết văn xuôi |
| `usecases/{feature}-usecase-index.md` | `/usecase` | Bảng tổng + ma trận truy vết |
| `srs/{feature}-userflow.md` | `/user-flow` | __Luồng người dùng__ — nguồn chia flow cho wireframe |
| `ascii-wireframe/` | `/wireframe-ascii` | Màn hình vẽ bằng ký tự + bảng mô tả 5 cột |
| `html-wireframe/` | `/wireframe-html` | Cùng màn hình nhưng dựng bằng HTML, mở trình duyệt xem |
| `html-design/{feature}-prototype.html` | `/prototype-html` | __Bản bấm được__, giữ trạng thái như app thật |

> Mở `html-wireframe/{feature}-wireframe.html` bằng trình duyệt — đây là thứ gửi cho designer hoặc khách xem.

### Phần backlog và kiểm thử

| File | Skill | Nội dung |
|---|---|---|
| `userstories/us-*.md` | `/userstory` | Từng user story |
| `userstories/{feature}-story-index.md` | `/userstory` | Bảng tổng, trạng thái, mã Jira |
| `test/checklist/` | `/test-checklist` | Danh sách kịch bản cần test |
| `test/testcases/` | `/test-cases` | Test case chi tiết, mỗi cái một kịch bản |
| `test/e2e/` | `/playwright-gen` | Script test tự động chạy trên trình duyệt |

### Phần tích hợp API — chỉ có ở `premium-payment`

| File | Skill | Nội dung |
|---|---|---|
| `integration/api-assess.md` | `/api-assess` | Đánh giá nên chọn đối tác nào |
| `integration/api-summary-*.md` | `/api-doc` | Đọc hiểu tài liệu API của đối tác |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| `integration/api-design.md` | `/api-design` | __Thiết kế tích hợp__ — hệ thống phối hợp ra sao |
| `integration/api-map.md` | `/api-map` | Bảng ánh xạ trường dữ liệu ba tầng |
| `integration/api-readiness.md` | `/api-readiness` | Checklist trước khi lên production |
| `test/api/api-checklist.md` | `/api-checklist` | Kịch bản cần test |
| `test/api/api-tests.md` + `bruno/` | `/api-test` | Test chạy được bằng Bruno |

### Phần dùng chung và xuất bản

| File | Skill | Nội dung |
|---|---|---|
| `_shared/definitions.md` | `/update-overview` | Thuật ngữ dùng chung — __nguồn__, không phải kết quả |
| `_shared/conventions.md` | `/update-overview` | Quy ước viết tài liệu |
| `_shared/kg/graph.json` | `/kg build` | Bản đồ liên hệ giữa mọi thứ trong tài liệu |
| `_shared/kg/kg-viewer.html` | `/kg` | __Xem bản đồ đó bằng hình__ — mở bằng trình duyệt |
| `design.md` | (viết tay) | Design token cho wireframe và prototype |
| `{feature}-preview.html` | `/preview` | Gộp toàn bộ tài liệu thành một trang xem được |

---

## Bốn thứ đáng để ý khi đọc

### 1. Open Questions — chỗ AI chịu nói "chưa biết"

Mở `srs/{feature}-spec.md`, kéo xuống mục cuối.

Đó là những chỗ tài liệu nguồn chưa nói rõ, và skill __ghi lại thay vì tự điền__. Đây là điểm khác biệt lớn nhất giữa một skill có luật và một prompt thường.

Một AI viết trơn tru nhưng bịa mất business rule nguy hiểm hơn nhiều một AI chịu dừng lại hỏi.

### 2. Mã lỗi và truy vết

Trong `srs/{feature}-spec.md` có bảng mã lỗi. Các mã đó được dùng lại ở:

* Bảng mô tả màn hình trong `ascii-wireframe/`
* Acceptance criteria trong `userstories/`
* Test case trong `test/`

Thử tìm một mã lỗi bất kỳ trong cả thư mục — sẽ thấy nó xuất hiện ở nhiều chỗ, nhất quán. Đó là thứ khó giữ khi làm tay.

### 3. Bảng mô tả màn hình 5 cột

Mở một file trong `ascii-wireframe/`. Mỗi màn hình có hình vẽ bằng ký tự __và__ một bảng 5 cột: số thứ tự, thành phần, loại điều khiển, kiểu dữ liệu, mô tả.

Cột mô tả là chỗ đáng tiền — nó gom cả mục đích, ràng buộc, trạng thái, điều hướng và mã lỗi. Dev và QC đọc một dòng là đủ hiểu một thành phần, không phải nhảy file.

### 4. Nhật ký thay đổi

Mở `_shared/changelog.md` (nếu có trong bản các bạn nhận). Mỗi lần skill ghi file đều để lại một dòng.

Đây là hook chạy tự động — thứ mà [chương 09](../huong-dan/09-vi-sao-khong-hop-ai-chat.md) nói sẽ mất nếu dùng trên giao diện chat.

### 5. Bản đồ liên hệ giữa mọi thứ — mở `_shared/kg/kg-viewer.html`

Đây là thứ trực quan nhất trong cả thư mục ví dụ. Mở bằng trình duyệt, các bạn sẽ thấy __691 điểm__ và __2.634 đường nối__ — mỗi điểm là một thứ trong tài liệu (một yêu cầu, một màn hình, một use case, một test case), mỗi đường là một liên hệ thật giữa chúng.

Thử vài thao tác:

* Lọc theo feature ở góc trái, hoặc gõ `FR-authentication-001` vào ô tìm
* Bấm vào một điểm bất kỳ → cột phải hiện nó liên hệ với những gì
* Bỏ tick vài loại đường nối để nhìn cho gọn

__Vì sao cái này đáng giá:__ nó trả lời được những câu mà đọc file rời không trả lời nổi — *"sửa yêu cầu này thì những tài liệu nào bị ảnh hưởng?"*, *"yêu cầu nào chưa có user story?"*, *"test case này đang kiểm business rule nào?"*.

#### Hỏi bản đồ bằng lệnh — output thật từ chính thư mục này

Ngoài xem bằng hình, các bạn hỏi được bằng lệnh. Dưới đây là kết quả thật khi chạy trên thư mục ví dụ này (đặt nó thành `docs/` trong một workspace có bộ skill).

__Hỏi "đọc tài liệu feature này theo thứ tự nào":__

```bash
node .claude/skills/kg/engine/kg-query.mjs tour authentication
```

```text
# Tour: authentication (35 tài liệu trong lộ trình, 12 phụ)

| # | đọc file                                             | loại       | vì sao bước này            |
|---|------------------------------------------------------|------------|----------------------------|
| 1 | authentication/brainstorms/email-and-google-auth.md   | brainstorm | —                          |
| 2 | authentication/authentication-urd.md                  | urd        | —                          |
| 3 | authentication/authentication-brd.md                  | brd        | —                          |
| 4 | authentication/authentication-prd.md                  | prd        | —                          |
| 5 | authentication/srs/authentication-spec.md             | srs        | —                          |
| ...                                                                                            |
| 11| authentication/usecases/uc-signup-email.md            | use_case   | →10×SATISFIES, ←2×DISPLAYS |
```

Đây là __lộ trình đọc theo thứ tự phụ thuộc__ — thượng nguồn trước, hạ nguồn sau. Rất hợp lúc mới nhận bàn giao một feature lạ: không phải đoán nên mở file nào trước.

__Hỏi "sửa yêu cầu này thì đụng tới đâu":__

```bash
node .claude/skills/kg/engine/kg-query.mjs impact FR-authentication-001 --depth 2
```

```text
# Impact: FR-authentication-001

| depth | node                                          | edge-path                    |
|-------|-----------------------------------------------|------------------------------|
| 1     | CHK-authentication-011                        | -VERIFIES→ FR-authentication-001 |
| 1     | ascii-wireframe/signup-verify.md              | -REFERENCES→ ...             |
| 1     | srs/authentication-flows.md                   | -REFERENCES→ ...             |
| 1     | test/checklist/checklist-uc-signup-email.md   | -REFERENCES→ ...             |
```

Sửa một yêu cầu là biết ngay wireframe nào, sơ đồ nào, checklist nào phải xem lại — thay vì tìm tay rồi sót.

__Hỏi "yêu cầu nào chưa có user story":__

```bash
node .claude/skills/kg/engine/kg-query.mjs coverage authentication
```

```text
### FR không có US Covers (31)

| key                   | title                          | status |
|-----------------------|--------------------------------|--------|
| FR-authentication-001 | Đăng ký bằng email + mật khẩu  | stale  |
| FR-authentication-002 | Chặn đăng ký email trùng       | stale  |
```

Đây chính là thứ `/gap` dùng để soi tài liệu còn thiếu chỗ nào.

#### Bản đồ này từ đâu ra

Do `/kg build` sinh ra bằng cách đọc toàn bộ tài liệu. Các skill như `/gap`, `/cr`, `/dashboard` dùng nó để __chọn đúng file cần đọc__ thay vì quét cả thư mục — nhanh hơn và đỡ tốn token hơn nhiều.

Muốn tự dựng lại cho dự án của mình:

```bash
node .claude/skills/kg/engine/kg-build.mjs          # dựng bản đồ
node .claude/skills/kg/engine/kg-viewer.mjs         # sinh file xem bằng hình
```

> __Lưu ý quan trọng:__ bản đồ chỉ dùng để *chọn file cần xem*, không dùng để kết luận nội dung. Kết luận vẫn phải đọc tài liệu thật — vì bản đồ chỉ biết cái gì nối với cái gì, không biết bên trong viết gì. Chính công cụ cũng in dòng cảnh báo này mỗi lần chạy.

---

## Lưu ý khi xem

__Đây là bối cảnh của một sản phẩm học tiếng Anh.__ Nội dung nghiệp vụ trong hai feature này không phải của các bạn — đừng copy nội dung. Cái đáng lấy là __cấu trúc và mức độ chi tiết__.

__Không phải feature nào cũng cần đủ chừng này file.__ Hai bộ này chạy gần hết các skill để làm ví dụ. Thực tế một feature vừa phải chỉ cần 5-6 skill là đủ dùng — xem [chương 03](../huong-dan/03-chon-pipeline-cua-ban.md).

__Vài file được sinh ra rồi chỉnh tay.__ Đó là cách dùng bình thường: AI dựng khung và điền phần lặp lại, người quyết phần cần phán đoán.

---

## Muốn xem một skill chạy ra file này thế nào

Mỗi skill có một bài giải thích riêng trong thư mục `explain-skills/` — viết cho người không rành kỹ thuật, nói rõ skill đọc gì, hỏi gì, ghi ra gì.

Ví dụ: xem `explain-skills/srs.md` để hiểu `srs/{feature}-spec.md` được dựng ra sao.

Hoặc mở thẳng `HUONG-DAN-BA-KIT.html` ở thư mục gốc — có cả hướng dẫn lẫn toàn bộ bài giải thích, bấm qua lại được.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
