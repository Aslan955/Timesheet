---
type: skill-explainer
skill: confluence
updated: 2026-07-26
---

# `/confluence` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Lệnh này là __người anh em song sinh__ của `/jira`. Nếu bạn chưa đọc `explain-skills/jira.md`, nên đọc trước — vì các ý tưởng cốt lõi (__sổ liên kết__, __so sánh 3 phía__, __kiểm tra lại trước khi ghi đè__, __cầu nối MCP__) là __chung__ cho cả hai, giải thích kỹ ở đó. Tài liệu này tập trung vào phần __riêng của Confluence__.

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/confluence` là lệnh để __đồng bộ hai chiều__ giữa __tài liệu mô tả__ bạn viết ở máy (URD, BRD, PRD, đặc tả SRS, use case, mô tả màn hình...) và các __trang (page)__ trên __Confluence__ — nơi cả công ty (kể cả người không rành kỹ thuật: sếp, khách hàng, kế toán...) vào đọc và bình luận.

Khác biệt cốt lõi so với `/jira`:
* `/jira` lo __công việc__ (ai làm gì, tới đâu) — dành cho đội dev/PM.
* `/confluence` lo __nội dung để đọc__ (tính năng này là gì, hoạt động ra sao) — dành cho người đọc, để họ hiểu và góp ý.

Vài tình huống điển hình nên dùng `/confluence`:

* Bạn viết xong tài liệu tính năng "thanh toán", muốn đưa lên Confluence cho sếp và khách hàng đọc, xem sơ đồ, để lại bình luận.
* Có người vừa sửa một trang trên Confluence (hoặc để lại bình luận), bạn muốn mang thay đổi/góp ý đó về lại tài liệu gốc.
* Sếp đưa link một trang Confluence có sẵn và bảo "lấy về đây làm tài liệu".

Gõ đơn giản như:

```
/confluence payment
```

Chỉ gõ vậy là chế độ __chỉ xem__ — so sánh hai bên, in bảng lệch/khớp, __không đụng gì cả__. Bốn chế độ (`--push` đẩy lên, `--pull` kéo về, `--reconcile` hòa giải chỗ đụng nhau, `import <trang>` lấy trang có sẵn về) hoạt động **giống hệt `/jira`** — xem Mục 2 của `explain-skills/jira.md`.

> __Một câu để nhớ:__ `/confluence` = "giữ cho các trang tài liệu trên Confluence và tài liệu gốc ở máy luôn nói giống nhau — và luôn cho bạn xem trước khi đổi bất cứ bên nào".

---

## 2. Mapping — vì sao cần, và vì sao gộp chung với `/jira`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Lý do cần sổ liên kết đã giải thích kỹ ở `/jira` Mục 3 (tóm tắt: để __không tạo trang trùng__ mỗi lần đẩy, và để biết __ai đã sửa gì__ kể từ lần đồng bộ trước). Với Confluence cũng đúng y hệt: trang trên Confluence mang một mã số riêng (ví dụ `67901`), không liên quan gì về chữ nghĩa với tên file ở máy (`payment-prd.md`) — nên cần một dòng ghi lại sự liên kết *"`payment-prd.md` = trang `67901`"*.

__Điểm đáng nói riêng: cuốn sổ này là MỘT, gộp chung cả Jira lẫn Confluence.__ Vì sao lại gộp thay vì mỗi bên một sổ?

Hãy hình dung: một user story `us-003` của bạn vừa là __một công việc trên Jira__ (`PAY-123`), vừa có thể xuất hiện như __một trang mô tả trên Confluence__ (`67905`). Nếu để hai cuốn sổ riêng, muốn biết "story này đang nằm ở đâu, khớp chưa" bạn phải tra hai chỗ, và hai chỗ rất dễ __lệch nhau__ theo thời gian (sổ Jira ghi một kiểu, sổ Confluence ghi kiểu khác).

Gộp làm một cuốn (`sync-state.yaml`) thì __tra một chỗ ra hết__: `us-003` ứng với công việc Jira nào, trang Confluence nào, mỗi bên khớp tới đâu — gọn và khỏi lệch.

---

## 3. Bốn thứ RIÊNG của Confluence mà Jira không có‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Vì Confluence là "nơi đọc" chứ không phải "bảng công việc", nó có mấy đặc thù mà `/confluence` phải xử lý khéo:

### (a) Cây trang (page tree) — tài liệu có thứ bậc cha–con‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trên Confluence, các trang xếp thành __cây có thứ bậc__: một trang "Tính năng thanh toán" (trang cha) có các trang con "URD", "BRD", "Các màn hình"... Khi đẩy lên, `/confluence` dựng đúng cây đó cho gọn gàng, dễ điều hướng. Khi __lấy về__ (`import`) một cây trang có sẵn, nó lấy cả cây con — và ghi __mỗi trang con một dòng trong sổ liên kết__ (không gộp mù thành một), để lần sau đồng bộ đúng từng trang.

### (b) Bình luận (comment) — góp ý, KHÔNG phải nội dung chính thức

Người đọc trên Confluence hay để lại bình luận ("chỗ này nên thêm điều kiện X", "câu này chưa rõ"...). Đây là __góp ý quý giá nhưng chưa phải yêu cầu chính thức__. Nếu trộn thẳng bình luận vào nội dung tài liệu, tài liệu sẽ biến thành một mớ hỗn độn giữa "điều đã chốt" và "ý kiến đang bàn".

Vì vậy `/confluence` mang bình luận về một __"hộp thư góp ý" riêng__ (kèm tên người, ngày, link tới đúng chỗ trên Confluence), để bạn xem xét từng cái: tiếp thu / bỏ qua / lập yêu-cầu-thay-đổi. Tài liệu gốc __không bị bình luận làm vấy bẩn__.

### (c) Nội dung "đặc thù Confluence" không chuyển sạch được — vùng "giữ nguyên"

Trên Confluence có những thứ __không có bản tương đương ở tài liệu văn bản thuần__ của bạn: sơ đồ vẽ bằng tiện ích riêng, tệp đính kèm, khung màu, bình luận gắn giữa dòng... Khi kéo về, những thứ này __không thể "dịch" sạch sang văn bản ở máy__.

`/confluence` xử lý cẩn thận: nó __giữ nguyên bản gốc của những phần đó từ Confluence__ (gọi là "vùng giữ nguyên"), chỉ chèn một dấu-chỗ trong tài liệu ở máy để bạn thấy "ở đây có sơ đồ/tệp đính kèm". Quan trọng: __nó tuyệt đối không tự coi là "đã khớp xong" chỉ vì đã chèn dấu-chỗ__ — vì nếu lần sau đẩy ngược lên mà dựng lại trang từ bản văn bản thiếu mấy phần đó, sơ đồ/đính kèm trên Confluence sẽ __bị xóa mất__. Nên chừng nào bạn chưa quyết "phần này lấy bên nào làm chuẩn", nó __chặn không cho đẩy đè__ phần đó.

### (d) Sơ đồ (mermaid) — lệnh lo việc hiển thị

Tài liệu của bạn hay có sơ đồ luồng vẽ bằng "mermaid". Confluence __không tự vẽ được__ loại sơ đồ này — dán thẳng vào thì người đọc chỉ thấy một đống mã.

Khi đẩy lên, `/confluence` kiểm xem Confluence bên bạn hiển thị được sơ đồ không, rồi chọn một trong ba đường:

* __Hiển thị được__ (Confluence đã cài phần mở rộng vẽ sơ đồ) → chèn sơ đồ, lên trang xem được hình ngay.
* __Không hiển thị được__ → vẽ sẵn thành __ảnh__ rồi đưa ảnh lên. Người đọc vẫn thấy hình, chỉ là không sửa trực tiếp trên Confluence được.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
* __Không xác định được__ → __hỏi bạn chọn__, ngay ở bước duyệt kế hoạch.

---

## 4. Luồng chạy — giống `/jira`, khác vài chỗ

Luồng tổng thể **giống hệt `/jira`** (xem sơ đồ Mục 4 ở đó): kết nối → mở sổ liên kết → lấy bản mới nhất + so 3 phía → in bảng đối chiếu → (nếu có cờ) kiểm tra lại lần cuối → xem trước rồi ghi → cập nhật sổ. Vài khác biệt của Confluence:

* __Bước so sánh__ phân biệt __ba tình huống__ dễ bị lẫn:

  | Trang trên Confluence | Hệ thống làm gì |
  |---|---|
  | Bị __chuyển sang chỗ khác__ (vẫn còn) | Cập nhật vị trí, không báo động |
  | Bị __xóa hẳn__ | Hỏi bạn: tạo lại hay bỏ ghép nối. __Không tự xóa__ tài liệu ở máy |
  | Còn đó nhưng bạn __hết quyền__ | Báo bạn đi xin quyền. Không nhầm thành "đã xóa", không tự tạo bản khác (đẻ trang trùng lặp) |
* __Bước ghi (kéo về)__ có thêm việc __giữ vùng "giữ nguyên"__ như nói ở Mục 3(c).
* __Chống ghi đè:__ giống `/jira`, trước khi đẩy đè một trang, hệ thống lấy lại bản mới nhất và so — nếu vừa có người sửa thì dừng, không đè. (Chi tiết vì sao ở `/jira` Mục 5.)
* __Chặn cứng tài liệu "lỗi thời" (stale):__ cũng giống `/jira`, trang nào có tài liệu gốc đã đổi mà chưa đối chiếu lại thì __bị từ chối đẩy lên, không có cách ép qua__. Ở Confluence điều này còn đáng ngại hơn: người đọc trang Confluence thường là __khách hàng hoặc phòng ban khác__ — họ không có cách nào biết bản họ đang đọc đã lỗi thời. Gỡ bằng cách chạy `/cr` đối chiếu cho hết stale rồi đẩy lại. (Chi tiết ở `/jira` Mục 6.)
* __Vùng "giữ nguyên" chưa chốt cũng chặn đẩy__ — xem Mục 3(c).

---

## 5. Kết nối tới Confluence — hiện chỉ hỗ trợ bản Cloud

Phần này **giống hệt `/jira`** (xem Mục 6 ở đó), chỉ đổi tên hệ thống. Tóm tắt lại vì rất hay gặp:

* __Confluence Cloud__ (của Atlassian, `*.atlassian.net`): có sẵn cầu nối MCP chính thức, đăng nhập một lần là dùng.

* __Confluence tự quản (công ty tự cài) — hiện CHƯA dùng được__, giống hệt `/jira` (xem `/jira` Mục 7). Cầu nối chính thức chỉ nói chuyện với bản Cloud. Lối đi thay thế: để lệnh soạn nội dung rồi bạn tự đưa lên, hoặc nhờ đội kỹ thuật phát triển thêm.

* __Với bản Cloud__, trước khi trình kế hoạch cho bạn duyệt, hệ thống luôn __dò xem cầu nối làm được gì__ — đặc biệt ba khả năng Confluence hay cần: tải tệp đính kèm, đọc bình luận, hiển thị sơ đồ. Thiếu khả năng nào thì báo rõ và đề xuất cách thay thế ngay từ đầu, không để duyệt xong mới phát hiện bất khả thi.

> Chìa khóa đăng nhập chỉ nằm trong cấu hình kết nối, __không ghi vào tài liệu hay sổ liên kết__ (sổ này thường chia sẻ chung cả nhóm).

---

## 6. Ví dụ thực tế

Chị __Hà__, BA tính năng "thanh toán", đã đẩy user story lên Jira xong (bằng `/jira`). Giờ chị muốn đưa __tài liệu mô tả__ lên Confluence cho khách hàng đọc và góp ý. Công ty chị dùng Confluence Cloud.

1) Lần đầu, hệ thống dò khả năng của cầu nối: đọc/tạo/sửa trang được, đọc bình luận được, nhưng __chưa có phần mở rộng vẽ sơ đồ__. Nó báo ngay và đề xuất chuyển sơ đồ thành ảnh. Chị Hà đồng ý.

2) Chị gõ `/confluence payment` (chỉ xem). Hệ thống báo: chưa trang nào tồn tại, đề xuất dựng cây trang mới (trang cha "Payment" + các trang con URD/BRD/PRD/SRS/màn hình).

3) Chị gõ `/confluence payment --push`. Hệ thống hỏi vài thứ lần đầu (đưa vào "không gian" nào trên Confluence, có cài tiện ích vẽ sơ đồ chưa), kiểm tra cầu nối làm được gì, rồi cho chị xem cây trang sẽ tạo. Chị gật. Hệ thống tạo trang, __ghi vào sổ liên kết chung__ (cùng cuốn với Jira): `payment-prd.md = trang 67901`...

4) Khách hàng đọc, để lại 3 bình luận trên trang PRD. Vài hôm sau chị gõ `/confluence payment`. Hệ thống báo: *"Trang PRD có 3 bình luận mới; nội dung trang không đổi."* Chị gõ `--pull`, 3 bình luận được mang về __hộp thư góp ý__ (kèm tên khách, ngày, link) — tài liệu PRD gốc không bị đụng. Chị đọc, thấy 1 góp ý hợp lý, quyết định lập một yêu-cầu-thay-đổi (`/cr`) để xử lý đàng hoàng.

5) Đồng thời, một đồng nghiệp đã sửa trực tiếp phần mô tả trên trang SRS, mà chị cũng vừa sửa file SRS ở máy. Hệ thống báo *"đụng nhau"*. Chị gõ `--reconcile`, xem hai bản cạnh nhau, chọn gộp. Trước khi ghi đè lên Confluence, hệ thống kiểm tra lại thấy trang không đổi tiếp — rồi mới ghi. Sơ đồ và tệp đính kèm trên trang đó được __giữ nguyên__, không bị mất.

6) Hệ thống cập nhật sổ liên kết và in tóm tắt. Chị Hà không mất bình luận nào của khách, không mất phần đồng nghiệp sửa, không mất sơ đồ — mọi thứ được giữ đúng chỗ.

---

## Xem thêm

* Người anh em `/jira` — đồng bộ __công việc__ (không phải nội dung đọc), __chung cuốn sổ liên kết__ với lệnh này. Các khái niệm nền (mapping, so 3 phía, chống ghi đè, cầu nối MCP) giải thích kỹ ở `explain-skills/jira.md`.
* Chi tiết kỹ thuật đầy đủ: file gốc `.claude/skills/confluence/SKILL.md`, quy tắc chung `.claude/rules/atlassian-sync.md`, và phần sơ đồ mermaid ở `.claude/skills/confluence/references/mermaid-adf.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
