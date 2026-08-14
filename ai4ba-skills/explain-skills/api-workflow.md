---
type: skill-explainer
skill: api-workflow
updated: 2026-07-14
---

# Quy trình tích hợp API — từ "chọn đối tác" tới "chạy thật an toàn"‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Tài liệu này là **bản đồ toàn cảnh** của bảy lệnh tích hợp API, trình bày như một *quy trình có thứ tự* thay vì mô tả từng lệnh rời. Muốn hiểu mối liên quan giữa chúng theo ngôn ngữ đời thường, đọc `explain-skills/api-family.md`. Muốn hiểu sâu từng lệnh, đọc file explainer riêng (liệt kê ở cuối). File này trả lời câu hỏi bao trùm: **một tích hợp API đi qua những chặng nào, mỗi chặng để lại gì, và vì sao xếp đúng thứ tự đó.**

## 1. Vì sao "test API xong" chưa phải là "tích hợp xong"‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Rất dễ nghĩ tích hợp một API đối tác chỉ gồm ba việc: **đọc tài liệu của họ → viết vài phép thử → bấm chạy thấy đậu**. Nhiều nơi làm đúng như vậy, rồi vỡ trận lúc lên thật. Vì "đọc và test API" mới là *khúc giữa* của câu chuyện. Mục tiêu thật không phải "gọi được API", mà là **đưa một năng lực phụ-thuộc-đối-tác vào sản phẩm và vận hành nó an toàn** — một việc rộng hơn hẳn.

Bốn chỗ hay rơi rớt khi làm tắt:

| Làm tắt (chỉ đọc + test) | Chuyện gì xảy ra khi lên thật |
|---|---|
| **Không cân nhắc có nên hợp tác không** | Đọc kỹ + test kỹ một API rồi bị loại vì giá cao / không đạt tuân thủ / đối tác không có bản thử — công toi. |
| **Nhảy thẳng từ "hiểu API" sang "test API"** | Test đúng từng lời gọi, nhưng *cách ráp tổng thể* sai: đối tác báo tin ngược (webhook) mà tin thất lạc → trạng thái lệch; thử lại → tính tiền hai lần. |
| **Coi "test đậu" là "sẵn sàng"** | Đậu ở môi trường thử, nhưng lên thật thì đổi khóa, đổi địa chỉ, không ai trực khi lỗi, không có đường lùi. |
| **Không theo dõi sau khi lên** | Đối tác âm thầm đổi hoặc ngừng phiên bản API đang dùng, không ai biết cho tới khi hỏng. |

Gốc rễ của cả bốn: **thiếu hai đầu của quy trình** — đầu vào (*có nên tích hợp không*) và đầu ra (*chuẩn bị chạy thật + vận hành*) — và **thiếu cây cầu ở giữa** (*thiết kế cách hệ thống phối hợp với đối tác*). Bảy lệnh dưới đây có đủ cả ba.

## 2. Bảy chặng của quy trình‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đọc từ trên xuống — đây là **thứ tự chạy**, không phải danh sách rời (khác với các lệnh vẽ sơ đồ vốn thay thế nhau).

```
[0] /api-assess    Đánh giá đối tác     (CÓ ĐIỀU KIỆN — chỉ khi chưa chốt đối tác)
         │
[1] /api-doc       Hiểu tài liệu API    (đối tác cho làm gì, cần gì, trả gì, lỗi nào)
         │
[2] /api-design    ⭐ THIẾT KẾ cách phối hợp   (bản thiết kế lắp ráp — chặng quan trọng nhất)
         ├── /api-map   bảng tra ô dữ liệu (1 phần của bản thiết kế)
         │
[3] /api-checklist Lập danh sách cần kiểm   (hiểu rồi mới liệt kê; đừng bịa)
         │
[4] /api-test      Thử thật bằng Bruno   (như Postman, AI điền sẵn, ghi đậu/rớt)
         │
[5] /api-readiness Kiểm tra trước khi lên sóng   ("đậu" ≠ "sẵn sàng chạy thật")
```

## 3. Bảng quy trình — mỗi chặng để lại gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| # | Lệnh | Chặng này trả lời câu gì | Để lại tài liệu gì | Ai làm |
|---|---|---|---|---|
| **[0]** | `/api-assess` | "Có **đáng** hợp tác với đối tác này không?" (giá, độ tin cậy, cam kết, có bản thử không) | `integration/api-assess.md` — bảng chấm điểm + khuyến nghị chọn/không | BA/PO |
| **[1]** | `/api-doc` | "Đối tác **cho làm gì**, cần gì, trả gì, lỗi nào?" — dịch tài liệu kỹ thuật sang nghiệp vụ | `integration/api-summary.md` — bảng thao tác + danh mục lỗi | BA/PO |
| **[2]** | `/api-design` ⭐ | "Các hệ thống **phối hợp thế nào** để hoàn thành đúng một giao dịch — và giữ đúng khi có trục trặc?" | `integration/api-design.md` — bản thiết kế lắp ráp | BA/PO |
| — | `/api-map` | "Ô dữ liệu đối tác trả về **hiện ở đâu** trên màn hình?" | `integration/api-map.md` — bảng tra ba tầng | BA/PO |
| **[3]** | `/api-checklist` | "**Cần kiểm** những trường hợp nào? (đừng bịa cái chưa rõ)" | `test/api/api-checklist.md` — danh sách + độ tin cậy | BA/QC |
| **[4]** | `/api-test` | "Thử thật thì **đậu hay rớt**?" | `test/api/api-tests.md` + bộ Bruno chạy được | BA/QC |
| **[5]** | `/api-readiness` | "**Sẵn sàng chạy thật** chưa? Lỗi thì ai lo, lùi thế nào?" | `integration/api-readiness.md` — checklist + quyết định lên/không | BA/PO |

## 4. Ba cây cầu mới (thêm 2026-07-14) — vì sao thêm‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trước đây quy trình chỉ có bốn chặng ở giữa (`/api-doc → /api-checklist → /api-test`, cùng `/api-map` chạy lẻ). Ba lệnh **`/api-assess`, `/api-design`, `/api-readiness` là bổ sung mới**, lấp đúng ba lỗ hổng ở Mục 1:

| Cầu mới | Lấp lỗ hổng | Vì sao quan trọng |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
|---|---|---|
| **`/api-assess`** (đầu vào) | "không cân nhắc có nên hợp tác" | Chặn việc tốn công đọc + test một API rồi bị loại vì lý do phi kỹ thuật. Đây là kỹ thuật *đánh giá nhà cung cấp* chuẩn của nghề BA. |
| **`/api-design`** (cây cầu giữa) ⭐ | "nhảy thẳng hiểu → test, thiếu khúc ráp" | **Tác động cao nhất.** Biết từng lời gọi chưa đủ để biết *webhook thất lạc thì sao, thử lại có tính tiền hai lần không, ai giữ sự thật về trạng thái*. Không có bản thiết kế này thì test đúng từng phần mà tích hợp tổng thể vẫn sai. |
| **`/api-readiness`** (đầu ra) | "coi test-đậu là sẵn-sàng" | "Đậu trong Bruno" khác "chạy được ở production". Cầu này bắt các thứ dễ quên: đổi khóa, ai trực khi lỗi, kế hoạch lùi, theo dõi khi đối tác đổi/ngừng API. |

> Nhắc lại điểm dễ nhầm: **`/api-map` không thay được `/api-design`.** `/api-map` chỉ là *bảng tra* "ô dữ liệu này hiện ở đâu"; `/api-design` là *bản thiết kế lắp ráp* trả lời "hệ thống phối hợp thế nào". Bảng tra là một phần nằm trong bản thiết kế, không phải toàn bộ.

## 5. Không phải lúc nào cũng chạy đủ bảy chặng

Quy trình có thứ tự, nhưng **cắt bớt chặng không cần** là chuyện bình thường — tùy tình huống:

| Tình huống của bạn | Chạy chặng nào |
|---|---|
| **API của ĐỐI TÁC, chưa chốt chọn ai** | Đủ bảy: `[0]→[1]→[2]→[3]→[4]→[5]` |
| **API của ĐỐI TÁC, đã ký hợp đồng rồi** | Bỏ `[0]`: bắt đầu từ `/api-doc` |
| **API của CHÍNH MÌNH (own)** | Bỏ `[0]` + `[1]` (không có đối tác để đánh giá / đọc tài liệu); nguồn thay thế là bản đặc tả SRS của mình. Vẫn cần `[2]` **bất cứ khi nào có phối hợp giữa các dịch vụ, trạng thái, hay giao dịch quan trọng** — không chỉ khi gọi sang đối tác |
| **Hỗn hợp** (endpoint mình gọi sang đối tác) | Cần cả ba "làn" test (own / đối tác / đầu-cuối) — `[2]` bản thiết kế là bắt buộc vì đây là nơi mô tả cách ráp hai bên |

## 6. Hai điều xuyên suốt cả quy trình

**Ba làn test, hai chiều gọi.** Từ chặng `[3]` trở đi, mỗi phép thử được gắn rõ: nó kiểm **API của mình** (own), **của đối tác** (3rd), hay **cả luồng ráp hai bên** (hỗn hợp/đầu-cuối) — vì ba loại này kiểm *rủi ro khác nhau*, không chỉ khác đối tác. Và phân biệt **chiều gọi**: *mình gọi ra* đối tác, hay *đối tác gọi vào* mình (webhook — tin báo ngược). Chiều đối-tác-gọi-vào hay bị bỏ sót, mà lại là nơi tiền bạc dễ lệch nhất.

**Ranh giới BA và lập trình viên.** Cả bảy chặng đều là **việc của BA/PO**: hiểu nghiệp vụ, thiết kế cách phối hợp ở tầng nghiệp vụ, test kiểu Postman (AI điền sẵn, bạn bấm chạy + đọc kết quả). Cái *vượt sang lập trình viên* — dựng hạ tầng, chọn thuật toán thử-lại, cấu hình theo dõi — thì BA chỉ **ghi lại yêu cầu và kế hoạch**, không tự làm. Bạn nói "không được thu tiền hai lần"; lập trình viên quyết *làm cách nào* để không thu hai lần.

## 7. Một câu chốt

> Tích hợp một API không phải "đọc tài liệu rồi test cho đậu". Nó là một hành trình bảy chặng: **cân nhắc có nên hợp tác (`/api-assess`) → hiểu họ cho gì (`/api-doc`) → thiết kế cách ráp vào hệ thống mình (`/api-design`, kèm bảng tra `/api-map`) → liệt kê cần kiểm gì (`/api-checklist`) → thử thật (`/api-test`) → chuẩn bị chạy thật an toàn (`/api-readiness`)**. Bỏ khúc đầu thì tốn công nhầm đối tác; bỏ khúc giữa thì ráp sai; bỏ khúc cuối thì vỡ lúc lên sóng. Đủ cả ba khúc mới biến "gọi được API" thành "một năng lực vận hành được".

***

## Xem thêm

- `explain-skills/api-selection.md` — bàn chỉ đường "việc trước mắt của tôi thì gõ lệnh nào" (gồm phân biệt test API vs test giao diện).
- `explain-skills/api-family.md` — mối liên quan bảy lệnh này bằng ngôn ngữ đời thường (ẩn dụ "thuê đối tác giao hàng").
- `explain-skills/api-assess.md`, `api-doc.md`, `api-design.md`, `api-map.md`, `api-checklist.md`, `api-test.md`, `api-readiness.md` — mỗi file một lệnh.
- `.claude/rules/api-integration.md` — nội quy kỹ thuật của cả họ (thứ tự, ba làn, hai chiều, ranh giới) cho người muốn đọc bản đầy đủ.
- `explain-skills/why-this-approach.md` — vì sao cả bộ công cụ được thiết kế theo kiểu này.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
