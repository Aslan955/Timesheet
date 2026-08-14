---
type: skill-explainer
skill: ask
updated: 2026-07-18
---

# `/ask` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/ask` trả lời **đúng một câu hỏi**: *"nghiệp vụ này **đang** hoạt động thế nào?"*

Bạn có cả một kho tài liệu (yêu cầu, use case, luồng, bảng lỗi, màn hình...) trải trên hàng chục file. Khi cần **hiểu nhanh một tính năng chạy ra sao**, bình thường bạn phải mở lần lượt từng file, ghép mảnh lại trong đầu. `/ask` làm hộ bạn việc đó: gõ 1 câu hỏi, nó **đọc đúng những file liên quan** rồi trả lời gọn **ngay trong khung chat** — kèm **sơ đồ luồng** để bạn nhìn thấy đường đi, không phải tự vẽ trong đầu.

Vài lúc nên gõ `/ask`:

- Bạn mới nhận bàn giao một feature, muốn **nắm tổng quan** nó làm gì: `/ask authentication`.
- Bạn quên **một luồng cụ thể** chạy sao: `/ask "luồng quên mật khẩu hoạt động thế nào"`.
- Bạn thấy một mã trong tài liệu và muốn biết **nó là gì**: `/ask FR-authentication-011`.
- Họp xong, ai đó hỏi "khóa tài khoản khi nào?", bạn cần **trả lời có căn cứ trong 30 giây**.

Nói gọn: **gõ `/ask` khi bạn muốn hỏi "cái này chạy thế nào?" và cần câu trả lời dễ hiểu, có dẫn nguồn, ngay lập tức.**

> `/ask` **chỉ đọc và giải thích — không sửa gì cả.** Nó không tạo file, không đổi tài liệu. Giống như hỏi một đồng nghiệp đã đọc hết hồ sơ: họ giải thích cho bạn nghe, chứ không viết lại hồ sơ.

## 2. Nó tìm câu trả lời như thế nào — "tra mục lục trước, đọc sách sau"‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điều quan trọng nhất cần hiểu: `/ask` **không đoán từ trí nhớ**. Nó luôn đi hai bước theo đúng thứ tự.

**Bước 1 — Tra tấm bản đồ (Knowledge Graph) để CHỌN file.**
Vault có một tấm bản đồ liên kết mọi tài liệu (xem thêm lệnh `/kg`). `/ask` hỏi bản đồ: *"câu hỏi này liên quan tới những file nào?"* — và bản đồ trả về một **danh sách rút gọn** các file đáng đọc, thay vì bắt nó lật cả tủ hồ sơ. Tùy câu hỏi, nó tra theo kiểu khác nhau:

| Bạn hỏi kiểu | Bản đồ trả về |
|---|---|
| Cả một feature (`/ask authentication`) | **Lộ trình đọc** theo thứ tự phụ thuộc: đọc yêu cầu gốc trước, rồi use case, rồi luồng... |
| Một luồng/khía cạnh cụ thể ("luồng đăng nhập") | Danh sách yêu cầu / use case / màn hình khớp với chủ đề đó |
| Một mã cụ thể (`FR-authentication-011`) | Đúng dòng, đúng file định nghĩa nó + những thứ liên quan tới nó |
| Câu hỏi về **quá khứ** ("yêu cầu này TỪNG ghi gì", "ai đổi khi nào", "CR nào sửa") | Bản đồ **lịch sử** (`history`/`asof`) trả về chuỗi thay đổi + bản cũ nguyên văn — xem `explain-skills/kg.md` Mục 10 |

**Bước 2 — Đọc nguyên văn các file đó để KẾT LUẬN.**
Bản đồ chỉ nói "A nối với B", nó **không chứa nội dung thật** (rule, con số, câu chữ lỗi). Nên sau khi chọn được file, `/ask` **đọc thật từng file** rồi mới diễn giải. Đây là luật vàng:

> **Bản đồ để CHỌN đúng sách. Câu trả lời LUÔN dựa trên việc đọc thật quyển sách đó — không ai tóm tắt hộ rồi bảo bạn tin.**

Nhờ vậy nó vừa nhanh (không đọc thừa cả tủ hồ sơ), vừa chính xác (mọi kết luận đều từ chữ thật).

## 3. Câu trả lời trông như thế nào‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/ask` trình bày cho **người làm nghiệp vụ** đọc, không phải cho lập trình viên. Một câu trả lời đầy đủ thường có:

1) **Một câu tóm tắt** — chốt ngay ý chính.
2) **Sơ đồ luồng bằng ký tự** (giống output của `/brainstorm`) — vẽ các bước bằng khung `┌─┐│▼`, có cả nhánh "đúng thì đi đâu / sai thì báo gì". Đặt sớm để bạn nhìn thấy đường đi trước.
3) **Diễn giải từng bước** — kèm dẫn nguồn kiểu `(FR-004, spec.md dòng 43)` để bạn tra lại được.
4) **Các quy tắc + ngưỡng** — ví dụ "khóa 24h sau 5 lần sai".
5) **Các nhánh lỗi** — thông báo lỗi thật người dùng sẽ thấy.
6) **Nguồn đã đọc** — liệt kê file để bạn biết câu trả lời dựa trên đâu.

Câu hỏi càng hẹp (chỉ hỏi 1 con số) thì trả lời càng gọn — nó **không ép vẽ sơ đồ** khi không cần.

## 4. Chống bịa — luật quan trọng nhất‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cũng như `/gap`, `/ask` bị buộc **không được phán suông**. Ba nguyên tắc:

- **Mọi con số, mọi câu chữ lỗi, mọi quy tắc → phải có dẫn nguồn `file:dòng`.** Không nhớ chính xác → đọc lại file, tuyệt đối không "đoán cho hợp lý".
- **Không có trong tài liệu → nói thẳng "cái này tài liệu chưa ghi"**, và chỉ bạn lệnh nào tạo ra nó (ví dụ chưa có sơ đồ trạng thái → gợi ý chạy `/state`). Nó **không nặn ra** cho đủ ý.
- **Không lạc sang chuyện kỹ thuật.** Bạn là người làm nghiệp vụ, nên nó trả lời bằng ngôn ngữ nghiệp vụ ("hệ thống so khớp thông tin", "tạo phiên đăng nhập") — không lôi ra chuyện cơ sở dữ liệu, mã hóa, hay tên hàm. Nếu bạn hỏi thẳng vào kỹ thuật, nó trả ở mức nghiệp vụ rồi ghi chú "chi tiết triển khai là việc của `/srs` và dev".

## 5. Một BA thật dùng `/ask` như thế nào‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> **Minh (BA)** vừa được giao tiếp quản feature đăng nhập của người khác, chưa nắm gì. Gõ:
>
>     /ask authentication
>
> `/ask` tra bản đồ, thấy đây là câu hỏi tổng quan → lấy **lộ trình đọc** (yêu cầu gốc → use case → luồng), đọc thật các file, rồi trả về: một câu tóm tắt ("3 cách đăng nhập, email là danh tính duy nhất..."), **một sơ đồ luồng** vẽ cả 6 luồng, rồi giải thích từng nhóm kèm nguồn, và bảng 6 luồng phủ happy/error/edge.
>
> Minh đọc 2 phút là nắm được bức tranh — thay vì mở 15 file ghép trong đầu. Thấy chỗ "auto-link Google", anh tò mò, hỏi tiếp:
>
>     /ask "luồng auto-link Google khi email trùng chạy thế nào"
>
> Lần này câu hỏi hẹp hơn → `/ask` chỉ lấy đúng vài file liên quan, trả lời chi tiết một luồng đó.
>
> Cuối cùng Minh phát hiện tài liệu có nhắc "rủi ro chiếm tài khoản" nhưng chưa rõ xử lý sao. `/ask` nói thẳng: *"phần này còn là câu hỏi mở OQ-3, tài liệu chưa chốt"* — không bịa ra câu trả lời.

**Điểm mấu chốt:** `/ask` giúp bạn **hiểu nhanh và đúng**, và khi tài liệu chưa có câu trả lời thì nó **thành thật nói chưa có**, chứ không nặn ra.

## 6. Toàn bộ luồng chạy — từng bước

Bạn gõ `/ask authentication` (hoặc một câu hỏi, hoặc một mã ID). `/ask` đi lần lượt 4 bước:

**Bước 1 — Hiểu bạn đang hỏi gì.**
Nó phân loại: bạn hỏi *cả một feature*, hay *một luồng cụ thể*, hay *một mã ID*? Nếu câu hỏi mơ hồ hoặc không rõ hỏi về feature nào, nó **hỏi lại một câu ngắn** chứ không đoán bừa.

⬇️

**Bước 2 — Tra bản đồ (KG) để chọn đúng file cần đọc.**
- Hỏi cả feature → lấy **lộ trình đọc** theo thứ tự.
- Hỏi một luồng → lấy **danh sách file khớp chủ đề**.
- Hỏi một mã ID → lấy **đúng dòng định nghĩa** nó và những thứ liên quan.

⬇️

**Bước 3 — Đọc nguyên văn các file vừa chọn.**
Mọi quy tắc, con số, câu chữ lỗi đều lấy từ **chữ thật** trong tài liệu, kèm dẫn nguồn `file:dòng`.

⬇️

**Bước 4 — Tổng hợp câu trả lời cho người làm nghiệp vụ.**
Gồm: câu tóm tắt + **sơ đồ luồng bằng ký tự** + diễn giải từng bước + quy tắc + các nhánh lỗi + danh sách nguồn đã đọc.

⬇️

**Kết quả in thẳng ra khung chat. Hết. Không tạo hay sửa bất kỳ file nào.**

## 7. Khi chưa có đủ dữ liệu

Nếu bạn gõ tên một feature **chưa tồn tại**, `/ask` không bịa — nó **liệt kê các feature đang có** và hỏi "ý bạn là cái nào?". Nếu câu hỏi **quá mơ hồ** (không rõ hỏi về feature nào), nó cũng **hỏi lại một câu ngắn** thay vì đoán bừa.

Nếu một phần câu hỏi **chưa được tài liệu ghi lại** (ví dụ hỏi về trạng thái mà feature chưa vẽ sơ đồ trạng thái), nó nói thẳng phần đó chưa có + gợi ý lệnh tạo ra nó. Nguyên tắc bất di bất dịch: **không có nguồn thì không đoán.**

Cũng cần biết: `docs/` hiện phần lớn là **tài liệu demo cũ**, nên một số file có thể đọc thiếu — khi đó `/ask` sẽ đọc bù trực tiếp và (nếu ảnh hưởng câu trả lời) ghi chú nhẹ một dòng, chứ không im lặng bỏ qua.

## Xem thêm

- Chi tiết kỹ thuật đầy đủ: `.claude/skills/ask/SKILL.md`
- Tấm bản đồ mà `/ask` tra để chọn file: `explain-skills/kg.md`
- Người anh em soi lỗ hổng: `explain-skills/gap.md`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
