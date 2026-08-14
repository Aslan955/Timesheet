---
type: skill-explainer
skill: srs
updated: 2026-08-01
---

# `/srs` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/srs` tạo ra tài liệu **SRS** (Software Requirements Specification — đặc tả yêu cầu phần mềm).

**Ví dụ vàng để nhớ cả đời:** khách bấm nút **"Thanh toán"**. Câu đó nghe đơn giản, nhưng `/srs` buộc bạn trả lời cho đủ 3 câu hỏi mà dev bắt buộc phải biết:

- **Hệ thống phải làm gì?** → tạo yêu cầu thanh toán, hiện 3 phương thức, gửi email hóa đơn... (đây là **FR** — yêu cầu chức năng).
- **Có thể sai ở đâu?** → thẻ bị từ chối, cổng thanh toán quá hạn phản hồi, trùng thu tiền... (đây là **Error Matrix** — bảng lỗi).
- **Thế nào là đo được là thành công?** → "95% khách thấy kết quả trong 3 giây", "≥92% đơn hoàn tất không bỏ giữa chừng" (đây là **NFR** + **Success Criteria**).

Nói gọn: `/srs` là **cây cầu** giữa "PRD nói muốn tính năng gì" và "dev biết chính xác phải build cái gì, xử lý lỗi ra sao, đo thành công thế nào".

Gõ lệnh đơn giản:

```
/srs payment
```

Hệ thống tự tìm PRD của tính năng đó làm nguồn, không cần bạn chỉ đường dẫn file.

## 2. Không phải "một phát ra hết" — có 4 tầng, bạn chọn đi tới đâu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là điều quan trọng nhất phải hiểu về `/srs`: nó **không** ép bạn làm hết mọi thứ. Ngay đầu, nó hỏi bạn **muốn chạy tới tầng nào**. Có 4 tầng, xếp thành cái thang — tầng sau xây trên tầng trước:

**Thang 4 tầng — chọn số N nghĩa là chạy tầng 1 đến N:**

| Tầng | Tên | Sinh ra gì |
|---|---|---|
| **[1]** | Core spec | **Luôn có — cái lõi:** yêu cầu chức năng (FR), phi chức năng (NFR), quy tắc nghiệp vụ (Business Rules), bảng lỗi (Error Matrix), tiêu chí thành công (Success Criteria) |
| **[2]** | +Models | Vẽ thêm "hình": use case, sơ đồ quan hệ dữ liệu (ERD), sơ đồ luồng (flow), sơ đồ trạng thái |
| **[3]** | +UX | Sơ đồ luồng người dùng (user flow) + vẽ màn hình nhập liệu (wireframe) |
| **[4]** | +Delivery | User story + tiêu chí nghiệm thu (AC) — sẵn sàng đẩy vào backlog |

Tầng sau xây trên tầng trước: chọn `[3]` là có luôn cả `[1]` và `[2]`.

Cách chọn:

- Gõ **`3`** = chạy tầng 1 + 2 + 3 (spec + models + UX). Lũy tiến, không bỏ tầng nào ở giữa.
- Gõ **`1`** (hoặc `--spec-only`, hoặc nói "chỉ cần spec thôi") = chỉ làm cái lõi rồi dừng.
- Gõ **`all`** = chạy hết 4 tầng.
- Gõ **tổ hợp** như **`1,2,4`** = spec + models + story, **bỏ** wireframe ở giữa. Hợp lệ, hệ thống hiểu đúng.

Một điểm tinh tế: hệ thống hỏi menu này **một lần duy nhất, sớm nhất** — để nó biết cần phỏng vấn bạn phần nào. Nó **không** dừng lại hỏi "tiếp không?" giữa mỗi tầng. Chọn `all` thì đi thẳng một mạch qua cả 4 tầng.

## 3. Nó hỏi bằng ngôn ngữ nghiệp vụ, không hỏi câu kỹ thuật‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/srs` phục vụ **BA (chuyên viên phân tích nghiệp vụ)**, không phải dev. Nên nó **cấm hỏi câu kỹ thuật** — luôn hỏi bằng ngôn ngữ nghiệp vụ. So sánh cho dễ thấy:

| Nó KHÔNG bao giờ hỏi (câu kỹ thuật) | Nó hỏi thế này (câu nghiệp vụ) |
|---|---|
| "Dùng thuật toán mã hóa gì?" | "Dữ liệu thẻ là nhạy cảm — ai được xem, giữ bao lâu?" |
| "Mức cô lập giao dịch nào?" | "Khách chờ tối đa mấy giây?" |
| "Endpoint / SDK / cấu trúc dữ liệu gửi đi?" | "Có gọi dịch vụ ngoài nào? (Momo, SendGrid...) để làm gì?" |
| "Giới hạn dung lượng gói bao nhiêu KB?" | "Giờ nào cần hệ thống không được sập?" |

Những quyết định kỹ thuật (nền tảng, thuật toán, cấu trúc dữ liệu vật lý) là việc của **dev/architect** ở một tài liệu riêng — không phải việc của BA.

Và nó **không bắt bạn khai lại từ đầu**. Trước khi hỏi, nó **đọc PRD trước**, tự dựng bản nháp (bóc ra được N yêu cầu chức năng), rồi chỉ hỏi bạn **chỗ nào còn thiếu**: "Em bóc được 12 FR từ PRD, anh xem thiếu/thừa gì?". Cái này gọi là **front-load** — nó làm việc trước, bạn sửa sau, không phải ngồi liệt kê lại thứ PRD đã ghi.

Cùng lúc đó nó đọc thêm **hồ sơ dự án** (`docs/_shared/project-profile.md`) — file dùng chung cho mọi lệnh, lưu những thứ chỉ cần trả lời một lần cho cả dự án: quy định pháp lý phải tuân, thị trường và ngôn ngữ sản phẩm, và cách gọi người dùng cuối. Với `/srs`, ba thứ đó chạm trực tiếp vào hai chỗ:

- **Yêu cầu phi chức năng về bảo mật/riêng tư** — dự án phải tuân quy định bảo vệ dữ liệu cá nhân nào thì viết thẳng vào đó, không hỏi lại bạn mỗi tính năng.
- **Câu chữ thông báo lỗi** — lỗi hiện ra cho ai đọc, gọi họ là gì, viết bằng ngôn ngữ nào.

Hồ sơ chưa có mà NFR đang cần → nó hỏi, rồi xin phép ghi vào hồ sơ (bạn duyệt) để lần sau khỏi hỏi lại.

## 4. Chống bịa — nhiều lớp bảo vệ chồng lên nhau‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là chỗ dễ hỏng nhất: AI hay **đoán bừa** khi thiếu thông tin, rồi viết như thể đã chốt. `/srs` chặn việc đó bằng **năm lớp** khác nhau:

**Năm lớp chống bịa:**

- **(a) Đánh dấu chỗ mơ hồ thay vì đoán bừa.** Gặp chi tiết nhỏ chưa rõ → chèn ngay tại dòng đó một dấu `[NEEDS CLARIFICATION: câu hỏi cụ thể]`, KHÔNG tự chọn một phương án rồi viết như đã chốt.
- **(b) Thiếu nhiều thì dừng hẳn (Stop-on-stuck).** Nếu thiếu thông tin đến mức không viết nổi cả phần (ví dụ một đối tượng dữ liệu không có thuộc tính nào) → nó dừng, hỏi bạn, KHÔNG ghi file dở dang. Còn thiếu thì không ghi gì cả.
- **(c) Tự soát lại trước khi trình (self-verify).** Trước khi cho bạn duyệt, nó tự chấm theo một danh sách kiểm: FR có phủ hết PRD chưa? Mỗi FR có tiêu chí đo được không? Quy tắc nghiệp vụ nào mồ côi? Lỗi nào còn thiếu?
- **(d) Ba "chuyên gia ảo" soi lại (auto-review).** Sau khi viết xong, ba góc nhìn khác nhau đọc lại (xem Mục 5).
- **(e) Vẽ sơ đồ phải chạy được (verify mermaid).** Sơ đồ (luồng/ERD/trạng thái) được vẽ bằng mã lệnh — lỗi cú pháp chỉ lộ khi bạn mở IDE. Nên nó tự kiểm sơ đồ vừa vẽ có chạy không; lỗi thì tự sửa tối đa 2 lần.

Vài điểm đáng nói thêm:

- **Lớp (a) — dấu `[NEEDS CLARIFICATION]`** rất khéo: gặp một chi tiết mơ hồ *nhỏ* (ví dụ "màn xác nhận hiện phân tách phí hay chỉ tổng tiền?") mà nó **không chặn cả phần**, nó vẫn viết tiếp phần còn lại nhưng **cắm một lá cờ** ngay chỗ đó. Cuối cùng những lá cờ chưa gỡ được sẽ được gom hết về mục **Open Questions** (câu hỏi mở). Và **chừng nào còn cờ chưa gỡ, nó không cho tài liệu lên trạng thái "in-review"** — nghĩa là không giả vờ "đã xong".

- **Lớp (d) — 3 chuyên gia ảo** là ba "đồng nghiệp" khác chuyên môn cùng đọc lại (xem bảng bên dưới). Điểm khác biệt với self-verify (lớp c): self-verify là **nó tự chấm mình** — dễ mù chỗ mình sai; còn đây là **người khác chấm** — bắt được cái self-verify bỏ sót.

| Chuyên gia ảo | Việc soi | Tại sao cần |
|---|---|---|
| **@senior-ba** (BA kỳ cựu) | Đủ chưa, có trường hợp biên nào bị bỏ sót, câu nào còn mơ hồ, actor đã khai đủ chưa | Hỏi "nhưng nếu... thì sao?" — chuyên bắt tình huống chưa nghĩ tới |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| **@qa-reviewer** (kiểm thử) | Mỗi yêu cầu có **kiểm thử được** không? Bảng lỗi phủ hết yêu cầu quan trọng chưa? Tiêu chí thành công có đo được không? | Biến spec thành câu hỏi "tôi có test được cái này không?" |
| **@tech-reviewer** (kỹ thuật) | Khả thi không, và quan trọng: có **quyết định kỹ thuật lọt vào SRS** không (thuật toán, endpoint — thứ lẽ ra thuộc dev) | Giữ SRS đúng ranh giới BA, không lấn sân dev |

*(Nếu bạn chạy tới tầng 3 UX, có thêm **@uxui-reviewer** soi trạng thái màn hình + tính nhất quán của luồng.)*

Ba chuyên gia này **chỉ đọc và trả ý kiến — không tự sửa file**. Sau khi gộp ý kiến lại, việc sửa nhỏ (câu chữ, thống nhất nội bộ) thì **tự sửa luôn**; còn việc động tới **quyết định nghiệp vụ** (đổi con số bạn đã chốt) thì nó tự chọn phương án hợp lý nhất **và đánh dấu 🔶 để bạn review lại** ở báo cáo cuối — không âm thầm đổi ý bạn.

## 5. Luôn có người gác cửa — không bao giờ ghi đè im lặng

`/srs` **không** tự ý ghi file. Mỗi lần sắp ghi, nó dừng lại xin phép:

- **Xem trước rồi mới ghi (L1):** trước khi tạo mỗi tài liệu, nó in một bản tóm tắt "sẽ tạo file gì, gồm những gì" — bạn gõ `Y` mới ghi.
- **So sánh trước/sau khi sửa (L2):** nếu file đã tồn tại, nó cho bạn xem bản "trước / sau" (giống track-changes trong Word) rồi mới sửa.
- **Điểm DỪNG cứng ở user flow (tầng 3):** khi vẽ sơ đồ luồng người dùng, nó **dừng hẳn chờ bạn duyệt flow** (chốt / sửa / hủy) trước khi vẽ màn hình — vì vẽ sai flow thì mọi màn hình vẽ sau đều sai theo.

Có một nguyên tắc an toàn cứng ở đằng sau: `/srs` **chạy tuần tự, không chạy nền song song để ghi file trước rồi confirm sau**. Lý do: nếu để một "trợ lý phụ" ghi file trước rồi hỏi sau, mà bạn từ chối, thì việc hoàn tác (`git checkout`/`rm`) **không đáng tin** — có thể nuốt mất thay đổi chưa lưu của bạn. Nên quy tắc là: **ghi file chỉ sau khi bạn đồng ý, không có ngoại lệ.**

## 6. Toàn bộ luồng chạy — sơ đồ

Bạn gõ `/srs payment`, rồi nó đi qua các chặng (mỗi mũi tên `→` là bước kế tiếp):

1. **Chặng A — Chuẩn bị + chọn tầng.** Tìm đúng tính năng → hỏi menu 4 tầng (một lần) → in bản đồ đường đi.
2. **Chặng B — Đọc nguồn trước, chỉ hỏi chỗ thiếu.** Dựng nháp FR/NFR/lỗi từ PRD → hỏi bổ sung chỗ trống. Chỗ mơ hồ nhỏ → cắm dấu `[NEEDS CLARIFICATION]`.
3. **Chặng C — Tầng 1: Core spec (luôn chạy).** Tự soát → cho bạn xem trước (L1) → ghi file spec. *(Chọn `[1]` thì nhảy thẳng xuống Chặng G.)*
4. **Chặng D — Tầng 2: Models (nếu chọn ≥2).** Use case + ERD + luồng + trạng thái → **kiểm sơ đồ có chạy được không**.
5. **Chặng E — Tầng 3: UX (nếu chọn ≥3).** User flow (dừng cho bạn duyệt) → vẽ wireframe.
6. **Chặng F — Tầng 4: Delivery (nếu chọn `[4]`).** User story + tiêu chí nghiệm thu.
7. **Chặng G — Ba chuyên gia ảo soi lại + tự sửa.** Chạy mặc định; sửa nhỏ tự làm, việc nghiệp vụ đánh dấu 🔶.
8. **Chặng H — Gom câu hỏi mở, chốt từng cái (một lần cuối).**
9. **Chặng I — Báo cáo:** đã tạo file gì, còn 🔶 gì, còn câu hỏi mở nào.

Xong xuôi, bạn mở thư mục `docs/payment/` trong IDE để rà lại.

## 7. Một BA thật dùng `/srs` như thế nào

> **Lan (BA)** vừa brainstorm xong tính năng đăng nhập (`authentication`), đã có PRD. Giờ cần đặc tả đầy đủ để giao cho team dev. Cô gõ:
>
>     /srs authentication
>
> Hệ thống hỏi: *"Chạy /srs cho authentication tới đâu? [1] Core spec · [2] +Models · [3] +UX · [4] +Delivery · [all]"*. Lan muốn làm trọn gói, gõ **`all`**.
>
> Hệ thống in bản đồ: *"Chạy tới Tầng 4 — qua 4 chặng, khoảng 20 điểm cần anh xác nhận. Bắt đầu Tầng 1…"*. Rồi nó **đọc PRD trước**, dựng nháp và báo: *"Em bóc được 31 yêu cầu chức năng từ PRD, anh xem thiếu/thừa gì? Còn mấy chỗ NFR em cần hỏi: khách chờ đăng nhập tối đa mấy giây? Sai mật khẩu mấy lần thì khóa?"*
>
> Lan trả lời bằng ngôn ngữ nghiệp vụ — không đụng gì tới kỹ thuật. Hệ thống lần lượt:
>
> - **Tầng 1:** ghi `authentication-spec.md` (31 FR, 5 NFR, 6 Business Rule, 9 lỗi, 3 tiêu chí thành công) — Lan xem trước, gõ `Y`.
> - **Tầng 2:** viết use case, vẽ sơ đồ quan hệ dữ liệu (ERD), sơ đồ luồng, sơ đồ trạng thái — **tự kiểm** các sơ đồ đều chạy được.
> - **Tầng 3:** dừng lại cho Lan duyệt sơ đồ luồng người dùng (Lan sửa 1 nhánh, chốt), rồi vẽ wireframe các màn.
> - **Tầng 4:** sinh user story + tiêu chí nghiệm thu, sẵn sàng đưa vào backlog.
>
> Sau đó **3 chuyên gia ảo** soi lại. `@qa-reviewer` bắt được: *"FR-auth-015 chưa có cách kiểm thử rõ."* — hệ thống tự bổ sung. Một chỗ khác nó phải tự quyết đổi (thời gian khóa tài khoản), nên đánh **🔶** để Lan xem lại.
>
> Cuối cùng nó gom mọi câu hỏi mở còn treo, hỏi Lan chốt từng cái, rồi in báo cáo: đã tạo file gì, còn 1 chỗ 🔶 cần Lan kiểm, còn 2 câu hỏi mở đang hold.

**Điểm mấu chốt:** Lan chọn một lần ở đầu (`all`), rồi chỉ trả lời câu hỏi nghiệp vụ và duyệt từng bước — không phải nhớ gọi 6 skill riêng lẻ theo đúng thứ tự. `/srs` điều phối cả chuỗi giúp cô.

## 8. Khi chưa có PRD, hoặc tính năng hoàn toàn mới

`/srs` **thích** có PRD làm nguồn, nhưng không bắt buộc phải có:

- **Có PRD nhưng chưa hoàn chỉnh:** nó vẫn chạy, chỉ **cảnh báo nhẹ** + hỏi bạn xác nhận trước khi bóc yêu cầu. Khi PRD thiếu, nó còn tự **đọc thêm các nguồn khác của tính năng** — URD (yêu cầu người dùng), BRD (yêu cầu nghiệp vụ), hoặc bản brainstorm ban đầu — để gom đủ ngữ cảnh, thay vì bắt bạn khai lại.
- **Tính năng hoàn toàn mới, chưa có thư mục:** nếu bạn gõ `/srs` kèm một mô tả nghiệp vụ (không phải PRD), nó tự **suy ra tên tính năng** (slug), hỏi bạn xác nhận, rồi **phỏng vấn tầng 1 từ đầu** và tạo thư mục khi ghi file. Đây là một trong những "điểm vào" hợp lệ để khởi tạo tính năng mới.

Nguyên tắc bất di bất dịch vẫn giữ: **không có nguồn thì không nặn ra yêu cầu từ con số không** — nó hỏi bạn, chứ không bịa.

## Xem thêm

- Muốn viết PRD trước khi làm SRS: `/prd-epic <feature>`
- Muốn vẽ riêng lẻ một loại sơ đồ (nếu chỉ chạy tầng 1): `/sequence`, `/erd`, `/user-flow`
- Muốn sinh riêng user story sau này: `/userstory <feature>`
- Muốn đóng gói tài liệu để chia sẻ stakeholder: `/preview`, `/export`
- Chi tiết kỹ thuật đầy đủ (từng bước Phase A→I, format lệnh, các trường hợp đặc biệt): `.claude/skills/srs/SKILL.md`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
