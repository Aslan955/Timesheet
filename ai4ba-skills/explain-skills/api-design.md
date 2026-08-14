---
type: skill-explainer
skill: api-design
updated: 2026-07-15
---

# `/api-design` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Mục 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/api-design` tạo một **Integration Blueprint** — bản thiết kế cách các hệ thống phối hợp với nhau để hoàn thành và duy trì đúng **một giao dịch nghiệp vụ**.

Nghe kỹ thuật, nhưng hãy hình dung cửa hàng của bạn thuê một nhà thầu giao hàng. Không chỉ cần biết nhà thầu “có giao hàng được không”, mà còn phải chốt rõ:

- Khi khách đặt hàng thì lúc nào cửa hàng giao việc cho nhà thầu?
- Ai giữ “sự thật” về trạng thái đơn: cửa hàng hay nhà thầu?
- Nhà thầu báo đã giao nhưng tin báo bị thất lạc thì sao?
- Khách bấm lại vì tưởng chưa xong: làm sao không tính tiền hoặc tạo đơn hai lần?
- Nhà thầu chậm/lỗi thì khách nhìn thấy gì?
- Đã trừ tiền nhưng hệ thống cửa hàng chưa ghi nhận được đơn thì xử lý bù thế nào?

Đó chính là việc `/api-design` làm: thiết kế **cách lắp ráp và vận hành chung**, không chỉ đọc từng API riêng lẻ.

Nên dùng lệnh này khi tính năng của bạn cần phối hợp với hệ thống khác, ví dụ cổng thanh toán, đơn vị giao hàng, dịch vụ gửi SMS, hệ thống CRM, hoặc một dịch vụ nội bộ khác.

Cú pháp:

```text
/api-design --feature premium-payment
```

(nghĩa là: thiết kế cách phối hợp API cho tính năng `premium-payment`).

**Một câu để nhớ:** `/api-design` chốt **hai hệ thống cùng làm một việc ra sao, tin ai khi có lệch nhau, và cứu giao dịch thế nào khi có sự cố**.

---

## Mục 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
 BẠN GÕ LỆNH
 /api-design --feature premium-payment
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Xác định tính năng và giao dịch trung tâm    │
 │  Hiểu tính năng đang tích hợp gì, ai khởi động,       │
 │  và “xong” nghĩa là kết quả nghiệp vụ nào.            │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Đọc những gì đã biết                         │
 │  Đọc tài liệu API đối tác hoặc SRS nội bộ; đọc thêm   │
 │  bảng map dữ liệu nếu đã có. Thiếu thông tin → hỏi,   │
 │  không tự bịa cách đối tác hoạt động.                 │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Chốt cách hai bên phối hợp                   │
 │  Lúc nào hệ thống mình gọi ra ngoài? Đối tác có báo   │
 │  ngược qua webhook không? Chờ kết quả ngay hay chờ    │
 │  xử lý nền?                                           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Chốt trạng thái nào đáng tin                 │
 │  Khi đang chờ, thành công, thất bại hoặc hai bên lệch │
 │  nhau: bên nào là “nguồn sự thật” cuối cùng, user     │
 │  được thấy gì, và lúc nào phải đối soát?              │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Nghĩ hết các trường hợp không đẹp            │
 │  Chậm, timeout, bị từ chối, báo trùng, báo sai thứ tự,│
 │  mất webhook, thành công một nửa, khách làm lại...    │
 │  Mỗi tình huống có cách giữ giao dịch an toàn.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Xem trước rồi mới ghi                         │
 │  Hệ thống nói rõ sẽ tạo/cập nhật file nào, có những   │
 │  flow, trạng thái, câu hỏi mở nào. Bạn đồng ý (Y)     │
 │  thì mới ghi tài liệu.                                │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 7 — Bàn giao blueprint                            │
 │  Ghi bản thiết kế vào api-design.md, liên kết tới     │
 │  sơ đồ trạng thái, sơ đồ trình tự và bảng map dữ liệu │
 │  nếu đã có.                                           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — cả nhóm có một “bản lắp ráp” chung
```

---

## Mục 3. Những câu hỏi nó buộc bạn trả lời‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là phần quan trọng nhất của `/api-design`. Nó không tạo tài liệu cho đủ bộ; nó buộc nhóm trả lời các câu hỏi thường chỉ lộ ra khi đã có sự cố thật.

**Ai bắt đầu giao dịch, và thế nào là hoàn tất?** Ví dụ khách bấm “Thanh toán” là bắt đầu, nhưng không phải cứ gửi yêu cầu sang cổng thanh toán là xong. Có thể phải chờ cổng thanh toán xác nhận, hoặc chờ tin báo ngược sau đó.

> Tin báo ngược từ đối tác về app mình có hai kiểu: **webhook** = đối tác *chủ động* nhắn về ("giao dịch này xong rồi"); **polling** = app mình *chủ động hỏi lại* định kỳ ("đã xong chưa?"). Blueprint phải chốt đối tác dùng kiểu nào, và nếu tin báo (webhook) bị mất thì bù ra sao.

**Ai giữ sự thật về trạng thái?** Khi đơn đang chờ thanh toán, hệ thống mình có thể là nơi theo dõi chính. Nhưng “đã thu tiền thật chưa” có thể cần lấy xác nhận cuối cùng từ cổng thanh toán. Không được để hai bên cùng tự nhận mình đúng mà không có quy tắc phân xử.

**Nếu kết quả chưa rõ thì sao?** Đối tác chậm phản hồi không đồng nghĩa giao dịch thất bại. Có thể tiền đã bị trừ nhưng tin trả về bị chậm. Blueprint phải chốt trạng thái “đang chờ xác nhận”, thay vì báo thất bại rồi cho khách trả lại ngay.

**Làm sao không xử lý trùng?** Đây là ý nghĩa nghiệp vụ của *idempotency* — xử lý lặp lại nhưng kết quả vẫn chỉ được tính một lần. Nói đời thường: khách bấm nút hai lần, mạng gửi lại yêu cầu, hoặc đối tác báo trùng thì không được thu tiền hai lần, tạo hai đơn, hay cấp quyền hai lần.

**Nếu thành công một nửa thì bù thế nào?** Ví dụ cổng thanh toán đã thu tiền nhưng hệ thống nội bộ không tạo được đơn. Cần chốt hành động bù: ghi nhận lại đơn, hoàn tiền, hay chuyển đội vận hành xử lý — chứ không để giao dịch “mất tích”.

**Nếu số liệu lệch nhau thì sao?** Đây là *reconciliation* — đối soát. Hệ thống cần biết đối chiếu những gì, khi nào phát hiện chênh lệch, ai nhận việc xử lý, và kết quả cuối cùng sẽ được điều chỉnh ra sao.

---

## Mục 4. Khác `/api-map` thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Hai lệnh này liên quan chặt, nhưng không làm cùng một việc.

`/api-map` là **bảng tra dữ liệu**: trường thông tin của đối tác đi vào đâu, lưu ở đâu, hiện ở màn hình nào. Ví dụ: `transaction_id` của cổng thanh toán được lưu vào hồ sơ giao dịch và hiện trong trang lịch sử thanh toán.

`/api-design` là **bản thiết kế lắp ráp tổng thể**: lúc nào gọi đối tác, gọi theo chiều nào, ai quyết định trạng thái cuối, khi tin báo mất thì làm gì, và làm sao phục hồi khi có lệch.

Có thể nhớ bằng ví dụ nhà thầu giao hàng:

- `/api-map`: mã vận đơn nằm ở ô nào, hiện trên màn hình nào.
- `/api-design`: lúc nào gửi đơn cho nhà thầu, nếu họ báo giao trễ thì đơn ở trạng thái gì, ai kiểm tra khi cửa hàng và nhà thầu báo khác nhau.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bảng map là bằng chứng hỗ trợ blueprint, không thay blueprint. Trước khi sang bước kiểm thử, hai phần này cần hội tụ: biết **cách phối hợp** và biết **dữ liệu cần thiết nằm ở đâu**.

---

## Mục 5. Việc của BA/PO là gì, và không phải việc gì?

`/api-design` là việc của BA/PO vì trọng tâm là **ý nghĩa nghiệp vụ**:

- Người dùng được hứa điều gì và không được hứa sai điều gì?
- Khi nào coi là thanh toán xong, giao hàng xong, cấp quyền xong?
- Khi chờ xác nhận, user nhìn thấy trạng thái nào và làm gì tiếp?
- Rủi ro “thu tiền hai lần” hoặc “cấp quyền trùng” được ngăn ở mức kết quả nghiệp vụ ra sao?
- Khi nào cần đội vận hành can thiệp, cần họ có những thông tin gì?
- Đối tác chậm/lỗi thì trải nghiệm suy giảm (*degraded UX*) như thế nào để vẫn trung thực với user?

Lệnh này **không** bắt BA/PO chọn thuật toán, queue, framework, database, SDK, endpoint hay cách lập trình retry. Đó là quyết định của dev/architect.

Bạn chỉ cần chốt bằng ngôn ngữ nghiệp vụ như: “không thu tiền hai lần”, “không cấp quyền khi chưa có xác nhận”, “timeout là chưa rõ kết quả, phải đối soát trước khi cho thanh toán lại”.

---

## Mục 6. Kết quả nằm ở đâu và nên dùng cùng sơ đồ nào?

Kết quả được ghi vào:

```text
docs/{feature}/integration/api-design.md
```

Đây là file blueprint chính của tính năng tích hợp. Nó mô tả các flow chính, ngoại lệ riêng cho từng flow, trạng thái, nguồn sự thật, cách đối soát, phục hồi thủ công và mức tác động nghiệp vụ khi đối tác lỗi.

`/api-design` không tự vẽ sơ đồ kỹ thuật thay bạn. Thay vào đó, nó gợi ý liên kết tới hai tài liệu hỗ trợ:

- Sơ đồ trạng thái từ `/state`: để thấy vòng đời giao dịch, ví dụ *chờ thanh toán → đã xác nhận → đã cấp quyền*.
- Sơ đồ trình tự từ `/sequence`: để thấy từng bên gửi/nhận gì theo thứ tự, đặc biệt cần có nhánh “webhook bị mất” nếu đối tác dùng webhook.

Hai sơ đồ này giúp nhìn trực quan; blueprint là nơi chốt **quyết định nghiệp vụ** đằng sau chúng.

---

## Mục 7. Vị trí trong họ lệnh API

`/api-design` là bước **[2] — quan trọng nhất** trong hành trình API:

```text
/api-assess → /api-doc → /api-design ──┬── /api-map ([2] kèm — tra field)
                        (bạn ở đây)     └── (cách phối hợp)
                                              │ map hội tụ vào design, rồi mới:
                                              ▼
                          /api-checklist → /api-test → /api-readiness
```

Trước nó, `/api-doc` giúp hiểu đối tác làm được gì, cần gì, trả gì và có báo ngược hay không.

Tại bước này, `/api-design` biến hiểu biết đó thành cách phối hợp thật sự của sản phẩm. `/api-map` (bảng tra field) chạy kèm ở cùng chặng [2] và **hội tụ vào bản thiết kế trước khi** sang `/api-checklist` — hai phần này là một khối, không phải hai bước tuần tự.

Đừng nhảy thẳng sang kiểm thử khi chưa chốt “trong trường hợp mơ hồ thì tin ai và xử lý thế nào”.

---

## Xem thêm

- `explain-skills/api-family.md` — bức tranh toàn bộ họ 7 lệnh API và thứ tự các chặng.
- `/api-doc` — đọc, diễn giải tài liệu API của đối tác trước khi thiết kế phối hợp.
- `/api-map` — lập bảng tra dữ liệu API ↔ hệ thống ↔ màn hình.
- `/state` — vẽ vòng đời trạng thái của giao dịch quan trọng.
- `/sequence` — vẽ trình tự phối hợp giữa hệ thống mình và đối tác.
- `/api-checklist` — lập danh sách tình huống cần kiểm sau khi blueprint và mapping đã hội tụ.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
