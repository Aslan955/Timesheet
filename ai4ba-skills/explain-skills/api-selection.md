---
type: skill-explainer
skill: api-selection
updated: 2026-07-15
---

# Chọn lệnh API/tích hợp nào? — bàn chỉ đường cho mọi việc dính tới API‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Tài liệu này là **điểm bắt đầu** khi bạn biết mình cần "làm gì đó với API" — của đối tác hay của chính mình — nhưng **chưa biết nên dùng lệnh nào**. Nó chỉ đường tới đúng lệnh theo *việc bạn đang cần*, rồi bạn đọc file explainer riêng của lệnh đó để hiểu sâu. Nói cách khác: đây là *tấm bản đồ tổng*, các file kia là *đường đi chi tiết*.
>
> Có hai file bạn nên đọc kèm: `explain-skills/api-workflow.md` (bảy chặng của một tích hợp, theo **thứ tự thời gian**) và `explain-skills/api-family.md` (bảy lệnh **liên quan nhau thế nào**, dùng ẩn dụ nhà thầu phụ). File bạn đang đọc lo câu hỏi khác hai file kia: **"việc trước mắt của tôi thì gõ lệnh nào?"**

## 1. Vì sao cần một tài liệu chỉ đường riêng?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Làm việc với API có **nhiều lệnh** — mỗi lệnh mạnh ở một khâu. Câu hỏi thường gặp không phải "lệnh này chạy thế nào" (đã có explainer riêng), mà là câu *đứng trước* đó: **"việc tôi đang cần thì thuộc khâu nào, gõ lệnh nào?"**

Chọn nhầm thì mất công: ví dụ bạn muốn *thiết kế cách hệ thống phối hợp với đối tác khi có sự cố* mà lại đi chạy lệnh *lập bảng tra field*, thì kết quả không trả lời đúng câu bạn cần. Tệ hơn: nhiều người nhầm **test API** với **test giao diện** — hai việc khác hẳn, hai bộ lệnh khác nhau (xem Mục 4).

Tài liệu này giải bài toán đó: bạn mô tả **việc mình đang cần**, nó chỉ cho bạn **đúng lệnh**.

> Lưu ý phân biệt: có một file khác tên gần giống — `.claude/rules/api-integration.md`. File đó là **nội quy cho máy** (quy tắc kỹ thuật đầy đủ: thứ tự, ba làn, hai chiều, ranh giới). File bạn đang đọc là **bản cho người**, giải thích cùng chuyện bằng lời thường.

---

## 2. Bảy câu hỏi để chọn đúng lệnh API‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cách nhanh nhất: hỏi **"việc trước mắt của tôi là gì?"** rồi so với bảy khâu dưới đây. Mỗi khâu là một *loại việc* khác nhau trong hành trình đưa API vào sản phẩm.

| Việc bạn đang cần làm | Ví dụ | Lệnh | Khâu |
|---|---|---|---|
| **Cân nhắc có nên hợp tác** với đối tác này không (giá, độ tin cậy, có bản thử không) — khi chưa chốt chọn ai | so 2 cổng thanh toán, tính build-vs-buy | `/api-assess` | [0] |
| **Đọc hiểu tài liệu API của đối tác** — họ cho làm gì, cần gì, trả gì, lỗi nào | nhận file OpenAPI/PDF của cổng thanh toán | `/api-doc` | [1] |
| **Thiết kế cách hệ thống phối hợp** với đối tác — khi nào gọi, ai giữ trạng thái đúng, tin báo ngược thất lạc thì sao, thử lại có tính tiền 2 lần không | ghép luồng thanh toán vào app đang chạy | `/api-design` | [2] ⭐ |
| **Lập bảng tra dữ liệu** — ô đối tác trả về → lưu ở đâu → hiện ở màn nào | map field charge → màn kết quả | `/api-map` | [2] kèm |
| **Liệt kê các trường hợp cần test** (hiểu API rồi mới lập, chỗ chưa rõ thì ghi câu hỏi) | trước khi viết test thật | `/api-checklist` | [3] |
| **Thử thật** bằng Bruno (như Postman — AI điền sẵn request, bạn bấm chạy, ghi đậu/rớt) | gọi thử endpoint charge | `/api-test` | [4] |
| **Kiểm tra trước khi "lên sóng"** thật — đổi môi trường thử sang thật, ai trực khi lỗi, kế hoạch lùi, theo dõi khi đối tác đổi API | trước khi mở thanh toán cho khách thật | `/api-readiness` | [5] |

Một câu để nhớ: **cân nhắc → assess; hiểu → doc; thiết kế cách ráp → design (kèm map tra field); liệt kê cần thử → checklist; thử thật → test; chuẩn bị chạy thật → readiness.**

> **Đây là một hành trình có thứ tự** (khác họ sơ đồ, nơi các lệnh thay thế nhau). Nhưng **không phải lúc nào cũng chạy đủ bảy** — xem Mục 3.

---

## 3. Cắt bớt khâu nào tùy tình huống‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Tình huống của bạn | Chạy lệnh nào |
|---|---|
| **API đối tác, chưa chốt chọn ai** | Đủ bảy: `/api-assess → /api-doc → /api-design (+/api-map) → /api-checklist → /api-test → /api-readiness` |
| **API đối tác, đã ký hợp đồng rồi** | Bỏ `/api-assess`: bắt đầu từ `/api-doc` |
| **API của CHÍNH MÌNH** (own — backend mình tự làm) | Bỏ `/api-assess` + `/api-doc` (không có đối tác để đánh giá/đọc tài liệu). Nguồn thay thế là bản đặc tả SRS của mình. Vẫn cần `/api-design` **bất cứ khi nào có phối hợp giữa các dịch vụ, trạng thái, hay giao dịch quan trọng** (không chỉ khi gọi sang đối tác) + `/api-checklist` + `/api-test` + `/api-readiness` |
| **Chỉ muốn lập checklist + thử một endpoint nhanh** (dò thử, ad-hoc) | `/api-checklist → /api-test` để khám phá nhanh. **Nhưng đây KHÔNG thay pipeline production**: một tích hợp thật đụng tiền/trạng thái vẫn phải qua `/api-design` (+`/api-map`) — không được dùng lối tắt này để bỏ gate thiết kế |
| **Thay đổi nhỏ trên tích hợp đang chạy** | Đọc lại phần liên quan, cập nhật `/api-design`, test đúng phần bị ảnh hưởng, soát `/api-readiness` — không làm lại cả hành trình |

---

## 4. ⚠️ Test API ≠ Test giao diện — đừng nhầm hai bộ lệnh‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là chỗ **rất hay nhầm**, và bạn đã hỏi đúng câu này. Có **hai "họ test" song song**, phục vụ hai loại kiểm thử khác nhau:

| | **Test API** (kiểm request/response) | **Test giao diện** (kiểm hành vi màn hình) |
|---|---|---|
| Kiểm cái gì | App gọi endpoint đúng chưa: gửi đúng dữ liệu, nhận đúng HTTP/lỗi | Người dùng bấm nút, nhập form, thấy màn hình đúng chưa |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| Lập danh sách cần thử | `/api-checklist` | `/test-checklist` |
| Viết case chi tiết | `/api-test` (→ request Bruno **chạy được**, như Postman) | `/test-cases` (→ test case chi tiết dạng văn bản: các bước thủ công cho tester, hoặc nguồn để dev tự động hoá bằng Playwright/TestRail sau) |
| Một item nở ra mấy case | **n–n**: 1 item checklist có thể thành **nhiều** case cùng ý-định (vd "validation số tiền" → null/âm/vượt-hạn) | **1:1**: mỗi item checklist ra **đúng 1** test case |
| Ví dụ 1 case | "gọi `POST /charges` với thẻ hết hạn → nhận 402 `expired_card`" | "ở màn thanh toán, nhập thẻ hết hạn → hiện thông báo 'Thẻ đã hết hạn'" |

Cả hai đều theo **cùng một nếp 2 bước**: *lập checklist (liệt kê cần thử) → expand thành case chi tiết*. Khác nhau ở **tầng kiểm** (một bên là **cửa sau** — API, máy nói với máy; một bên là **cửa trước** — màn hình, người bấm) **và ở cách nở case** (API n–n, giao diện 1:1 — xem hàng trên).

**Chọn nhanh:**
- Bạn đang tích hợp / gọi một API (của đối tác hay của mình)? → họ **API test**: `/api-checklist` → `/api-test`.
- Bạn đang kiểm một màn hình / luồng người dùng bấm? → họ **giao diện**: `/test-checklist` → `/test-cases`.

> Hai họ **bổ trợ nhau**, không loại trừ. Một tính năng thanh toán đầy đủ thường cần **cả hai**: test API (cửa sau — gọi cổng thanh toán đúng chưa) *và* test giao diện (cửa trước — màn kết quả hiện đúng lỗi chưa). Cùng một lỗi "thẻ hết hạn" được kiểm ở hai tầng khác nhau.

---

## 5. Bảng "tình huống thật → nên dùng lệnh gì"

Đôi khi dễ chọn hơn nếu nhìn tình huống cụ thể:

| Tình huống bạn đang gặp | Nên dùng | Lệnh |
|---|---|---|
| "Sếp đưa 2 cổng thanh toán, hỏi nên chọn cái nào" | Đánh giá đối tác | `/api-assess` |
| "Đối tác gửi file tài liệu API, tôi cần hiểu họ cho làm gì" | Đọc hiểu tài liệu | `/api-doc` |
| "Cần chốt: khi khách bấm Thanh toán, app gọi đối tác lúc nào, nếu tin báo ngược thất lạc thì sao" | Thiết kế cách phối hợp | `/api-design` |
| "Cần biết ô 'mã giao dịch' đối tác trả về sẽ hiện ở màn nào" | Bảng tra dữ liệu | `/api-map` |
| "Cần liệt kê các trường hợp phải thử với API charge trước khi test" | Checklist test API | `/api-checklist` |
| "Cần gọi thử endpoint charge với vài loại thẻ, xem đậu/rớt" | Thử thật bằng Bruno | `/api-test` |
| "Sắp mở thanh toán thật cho khách, cần soát đã sẵn sàng chưa" | Gate lên sóng | `/api-readiness` |
| "Cần kiểm màn hình đăng nhập bấm nút có báo lỗi đúng không" | Test **giao diện** (không phải API) | `/test-checklist` → `/test-cases` |

Nếu tình huống của bạn không khớp hàng nào, quay lại **bảy câu hỏi ở Mục 2** — hầu hết việc dính tới API đều rơi vào một trong bảy khâu đó.

---

## 6. Hai nguyên tắc chung — đọc trước khi bắt tay

**"Test API xong" chưa phải "tích hợp xong".** Đọc tài liệu rồi test cho đậu mới là *khúc giữa*. Bỏ khâu đầu (`/api-assess` — có nên hợp tác) thì tốn công nhầm đối tác; bỏ khâu giữa (`/api-design` — cách ráp) thì test đúng từng phần mà tổng thể vẫn sai; bỏ khâu cuối (`/api-readiness` — chuẩn bị chạy thật) thì vỡ lúc lên sóng. Đủ cả ba khúc mới biến "gọi được API" thành "một năng lực vận hành được".

**Đây là việc của BA/PO, không phải đi lập trình API.** Cả bảy lệnh đều ở tầng nghiệp vụ: hiểu đối tác, thiết kế cách phối hợp ở góc nghiệp vụ, test kiểu Postman (AI điền sẵn, bạn bấm chạy + đọc kết quả). Cái *vượt sang lập trình viên* — dựng hạ tầng, chọn thuật toán thử-lại, cấu hình theo dõi — thì BA chỉ **ghi lại yêu cầu và kế hoạch**, không tự làm. Bạn nói "không được thu tiền hai lần"; lập trình viên quyết *làm cách nào*.

---

## Xem thêm

Sau khi bàn chỉ đường này giúp bạn chọn **lệnh**, đọc tiếp để hiểu sâu:

**Hai file nhìn toàn cảnh họ API:**
- `explain-skills/api-workflow.md` — bảy chặng theo **thứ tự thời gian** (bảng quy trình, kiểu why-this-approach).
- `explain-skills/api-family.md` — bảy lệnh **liên quan nhau thế nào** (ẩn dụ nhà thầu phụ).

**Explainer từng lệnh:**
- `explain-skills/api-assess.md` · `api-doc.md` · `api-design.md` · `api-map.md` · `api-checklist.md` · `api-test.md` · `api-readiness.md`.

**Quy tắc gốc (cho máy / người muốn chi tiết kỹ thuật):**
- `.claude/rules/api-integration.md` — nội quy đầy đủ (thứ tự, ba làn own/3rd/mixed, hai chiều, ranh giới BA↔dev). Bản kỹ thuật; file bạn vừa đọc là bản diễn giải cho người.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
