---
type: skill-explainer
skill: export
updated: 2026-07-14
---

# `/export` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/export` (xuất gói tài liệu) là lệnh bạn gõ khi đã viết xong (hoặc gần xong) tài liệu của một tính năng, và giờ muốn __gom tất cả lại thành một file duy nhất, gọn gàng, đẹp mắt để gửi cho người khác đọc__ — sếp, khách hàng, dev, QC, hay lưu trữ làm hồ sơ.

Vấn đề mà lệnh này giải quyết: tài liệu của một tính năng thường __nằm rải rác ở rất nhiều file khác nhau__ — mô tả người dùng (URD) một file, lý do kinh doanh (BRD) một file, đặc tả kỹ thuật (SRS) một file, sơ đồ luồng một file, bản vẽ màn hình một file nữa... Bạn không thể bắt sếp mở lần lượt 13 file rời rạc để đọc. `/export` __gộp hết lại thành 1 gói duy nhất__, sắp xếp theo thứ tự hợp lý, và biến nó thành định dạng dễ gửi.

Vài tình huống điển hình nên dùng `/export`:

* Bạn viết xong tài liệu cho tính năng "thanh toán" và cần gửi bản PDF cho sếp duyệt hoặc đính kèm email cho khách hàng.
* Bạn muốn gửi bản Word cho stakeholder để họ __góp ý trực tiếp, bật chế độ theo dõi thay đổi (track changes)__ rồi gửi lại.
* Bạn muốn một file HTML để __gửi qua Slack / email__, người nhận chỉ cần bấm đúp là mở xem được ngay trên trình duyệt, không cần cài gì.

Gõ lệnh đơn giản như:

```
/export payment pdf
```

Hoặc chỉ cần nói bằng lời:

```
/export payment
```

rồi hệ thống sẽ hỏi bạn muốn định dạng nào. Trong đó `payment` là tên tính năng (feature) bạn muốn xuất.

> __Một câu để nhớ:__ `/export` = "gom hết tài liệu của tính năng này thành 1 file đẹp, đóng dấu ngày tháng, sẵn sàng gửi cho người khác đọc".

---

## 2. Ba định dạng — chọn cái nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/export` cho bạn xuất ra __3 định dạng khác nhau__, mỗi cái phù hợp với một mục đích. Giống như in một tài liệu: có lúc bạn cần bản in giấy để ký, có lúc cần file Word để người khác sửa, có lúc chỉ cần một link để xem nhanh.

```
 ┌─────────────────────────────────────────────────────────┐
 │  PDF                                                     │
 │  Dùng khi: in ra giấy, đính kèm email, lưu trữ.          │
 │  Đặc điểm: cố định, ai mở cũng thấy giống hệt nhau,      │
 │            KHÔNG sửa được → phù hợp bản "chốt".          │
 └─────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────┐
 │  DOCX (Word)                                             │
 │  Dùng khi: muốn người nhận GÓP Ý, sửa trực tiếp,         │
 │            bật track-changes trong Word / Google Docs.   │
 │  Đặc điểm: mở bằng Word, sửa thoải mái → phù hợp bản     │
 │            "đang lấy ý kiến".                            │
 └─────────────────────────────────────────────────────────┘

 ┌─────────────────────────────────────────────────────────┐
 │  HTML                                                    │
 │  Dùng khi: xem nhanh trên trình duyệt, share qua         │
 │            Slack/email, không cần cài phần mềm gì.       │
 │  Đặc điểm: bấm đúp là mở bằng Chrome/Safari, có mục lục  │
 │            bên cạnh để nhảy nhanh giữa các phần.         │
 └─────────────────────────────────────────────────────────┘
```

Điểm quan trọng của bản __HTML__: nó __mở được kể cả khi không có mạng__. Nghe có vẻ hiển nhiên, nhưng thực ra đây là một điểm được thiết kế kỹ (xem Mục 6) — vì nhiều bản HTML kiểu khác cần phải tải thư viện từ Internet mới hiển thị được sơ đồ, còn bản này thì __mọi thứ đã được "vẽ sẵn" và nhét thẳng vào file__ ngay lúc tạo, nên gửi cho ai, họ mở ở đâu, có mạng hay không, cũng đều thấy đầy đủ.

Nếu bạn không nói rõ định dạng, hệ thống __sẽ hỏi lại một câu__ ("PDF, Word hay HTML?") chứ không tự đoán bừa.

---

## 3. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/export` là một lệnh khá "hiền" — nó chỉ __tạo ra file mới trong máy của bạn__, không sửa vào bất kỳ tài liệu gốc nào. Nhưng nó vẫn theo đúng nguyên tắc chung: cho bạn xem trước rồi mới làm.

```
 BẠN GÕ LỆNH
 /export payment pdf
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN A — Xác định tính năng + định dạng          │
 │  Hệ thống kiểm tra: có tính năng "payment" chưa?      │
 │  Có tài liệu SRS của nó chưa? (bắt buộc phải có)      │
 │  Bạn muốn xuất PDF, Word hay HTML?                    │
 │  → Chưa rõ định dạng thì HỎI, không tự đoán.          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN B — Kiểm tra "công cụ" đã sẵn sàng chưa     │
 │  Mỗi định dạng cần vài công cụ hỗ trợ (xem Mục 5).    │
 │  Thiếu công cụ nào → in ra câu lệnh cài đặt rồi DỪNG, │
 │  KHÔNG lặng lẽ xuất ra file lỗi/thiếu sơ đồ.          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN C — Cho bạn xem trước (L1)                  │
 │  Hệ thống báo: "Sẽ tạo file PDF ở đường dẫn này,      │
 │  dung lượng ước tính khoảng ngần này." Chờ bạn gật    │
 │  đầu (Y) rồi mới bắt tay làm.                         │
 └──────────────────────────────────────────────────────┘
        │
        │  (chỉ đi tiếp khi bạn gõ Y)
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN D — Gom tài liệu + vẽ sơ đồ + đóng gói      │
 │  1. Quét TẤT CẢ tài liệu của tính năng (13 mục), gom  │
 │     theo thứ tự chuẩn, mở đầu bằng một TRANG BÌA       │
 │     (tên tính năng, ngày xuất, phạm vi).              │
 │  2. Những sơ đồ dạng "mã lệnh" (mermaid) được VẼ RA   │
 │     THÀNH HÌNH THẬT trước, để trong file hiện ra là    │
 │     hình vẽ chứ không phải mấy dòng code khó hiểu.     │
 │  3. Đóng gói thành file PDF / Word / HTML.            │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN D.5 — Tự kiểm tra file vừa tạo (bắt buộc)   │
 │  Trước khi báo "xong", hệ thống tự mở lại file kiểm:  │
 │   - PDF: đếm số trang, xem có bị trang trắng bất       │
 │     thường không.                                     │
 │   - Word: file có mở được không, có chữ thật bên       │
 │     trong không (không phải file rỗng).               │
 │   - HTML: mở thử bằng trình duyệt, xem có hiện nội      │
 │     dung không.                                       │
 │  Đây là kiểm "file có hỏng/rỗng không", CHƯA phải      │
 │  soát lỗi trình bày tinh vi (xem Mục 7).             │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN E — Báo cáo hoàn tất                        │
 │  In ra: đã tạo file gì, ở đâu, nặng bao nhiêu, có bao │
 │  nhiêu sơ đồ vẽ thành công / thất bại, và cách chia sẻ.│
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — file nằm trong thư mục docs/exports/,
     sẵn sàng gửi đi
```

---

## 4. Gói tài liệu gồm những gì? Và "thiếu thì sao"?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Khi xuất, hệ thống quét __tối đa 13 loại tài liệu__ của tính năng và gom lại theo thứ tự dễ đọc, đại khái đi từ "vì sao làm" tới "làm cái gì" tới "làm thế nào":

* Mô tả người dùng (URD), lý do kinh doanh (BRD), phạm vi sản phẩm (PRD)
* Đặc tả chi tiết (SRS): các yêu cầu chức năng, sơ đồ dữ liệu (ERD), sơ đồ luồng, sơ đồ trạng thái
* Use case (kịch bản sử dụng), user story kèm điều kiện nghiệm thu (AC)
* Bản vẽ màn hình (wireframe), các sơ đồ khác (BPMN, D2)
* Bằng chứng test API, danh sách kiểm thử giao diện, và link tới cẩm nang vận hành

__Điểm quan trọng — thiếu thì không bịa:__ không phải tính năng nào cũng có đủ cả 13 mục. Nếu tính năng của bạn __chưa có__ một loại tài liệu nào đó (ví dụ chưa vẽ wireframe), hệ thống __không tự bịa ra nội dung__ để lấp chỗ trống. Thay vào đó, ở mục đó nó ghi rõ một dòng kiểu *"chưa chạy `/wireframe-ascii`"* — để người đọc biết đây là phần còn thiếu chứ không phải bị bỏ quên. Nhờ vậy gói tài liệu luôn phản ánh __đúng thực trạng__: có gì xuất nấy, thiếu gì nói thẳng.

Một điều kiện bắt buộc: __phải có tài liệu SRS__ (`srs/{feature}-spec.md`) thì mới xuất được. Vì SRS là "xương sống" chứa các yêu cầu chức năng — không có nó thì gói tài liệu rỗng ruột. Nếu tính năng chưa có SRS, hệ thống __từ chối và chỉ đường__ cho bạn chạy `/srs` trước (xem Mục 8).

---

## 5. Cần "công cụ" gì? Vì sao thiếu là dừng, không xuất bừa?

Để biến tài liệu (vốn là văn bản thuần) thành PDF/Word đẹp có hình vẽ, hệ thống mượn vài công cụ chuyên dụng đã cài sẵn trên máy:

| Công cụ | Làm gì | Định dạng cần |
|---|---|---|
| __mmdc__ | Vẽ các sơ đồ "mã lệnh" (mermaid) thành hình thật | Cả 3 định dạng |
| __pandoc__ | Chuyển văn bản thành PDF hoặc Word | PDF, Word |
| __Chrome__ | Dùng để "in" ra PDF (giống bấm Print → Save as PDF) | PDF |
| __markdown-it-py__ | Biến văn bản thành trang HTML ngay lúc tạo | HTML |

__Vì sao thiếu công cụ là dừng hẳn, không xuất tạm?__ Đây là một quyết định thiết kế có chủ đích. Hãy tưởng tượng bạn thiếu công cụ vẽ sơ đồ, mà hệ thống vẫn cứ xuất ra file — kết quả sẽ là một bản PDF có những sơ đồ __hiện thành mấy dòng mã lệnh khó hiểu__ thay vì hình vẽ. Bạn gửi cho sếp mà không để ý, sếp mở ra thấy một mớ ký tự lộn xộn ở chỗ đáng lẽ là biểu đồ — vừa mất mặt, vừa phải làm lại.

Vì vậy hệ thống chọn cách __thẳng thắn__: thiếu công cụ nào, nó in ngay ra câu lệnh cài đặt công cụ đó rồi dừng lại, chứ __tuyệt đối không "cố xuất đại một bản thiếu hình" rồi để bạn gửi nhầm__. Thà báo "chưa làm được, cài cái này đi" còn hơn giao một sản phẩm hỏng.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

---

## 6. Vì sao bản HTML lại "mở offline được" — và tại sao đó là chuyện đáng nói?

Đây là phần được chăm chút kỹ, nên đáng để giải thích.

Nhiều bản HTML thông thường có một điểm yếu ngầm: chúng chỉ hiển thị đầy đủ __khi máy người xem có mạng__. Lý do là các sơ đồ trong file không được vẽ sẵn, mà file chỉ chứa "mã lệnh sơ đồ" + một dòng nói "hãy lên Internet tải thư viện vẽ giúp tôi". Nếu người nhận mở file lúc không có mạng (trên máy bay, trong phòng họp mạng chập chờn, hoặc công ty họ chặn Internet ngoài), các sơ đồ sẽ __trắng trơn hoặc báo lỗi__ — dù phần chữ vẫn đọc được.

Với người làm BA, đây là rủi ro thật: bạn gửi tài liệu cho khách, khách mở ra thấy thiếu nửa số biểu đồ, và họ nghĩ tài liệu của bạn làm ẩu.

Bản HTML của `/export` giải quyết triệt để: __ngay lúc tạo file, mọi sơ đồ đã được vẽ thành hình và nhét thẳng vào bên trong file, cùng với toàn bộ định dạng trang.__ File không cần "gọi ra ngoài" lấy bất cứ thứ gì. Kết quả: bạn gửi cho ai, họ mở ở đâu, có mạng hay không, cũng thấy __y hệt__ những gì bạn thấy — đầy đủ chữ và hình.

> Điểm khác biệt so với lệnh `/preview`: `/preview` là bản xem-nội-bộ dành cho lúc bạn đang làm việc (nó vẫn cần mạng, và tạo lại liên tục mỗi khi bạn sửa tài liệu). Còn `/export` là bản __đóng dấu ngày tháng, chốt lại để gửi ra ngoài__ — nên nó phải tự đứng vững, không phụ thuộc mạng.

---

## 7. Bước "tự kiểm tra file" (Giai đoạn D.5) làm được gì và KHÔNG làm được gì?

Sau khi tạo xong file, hệ thống __tự mở lại file đó để kiểm tra sơ bộ__ — giống như in xong một xấp giấy thì liếc qua xem có tờ nào trắng, có bị kẹt giấy không, trước khi đưa cho sếp.

Cụ thể nó kiểm:
* __PDF:__ đếm số trang, xem có bị nhiều trang trắng bất thường không.
* __Word:__ file có phải file Word hợp lệ (mở được) và có chữ thật bên trong không (không phải file rỗng).
* __HTML:__ mở thử bằng trình duyệt ngầm, xem trang có hiện nội dung không.

Nhưng cần thành thật về __giới hạn__ của bước này — và tài liệu gốc nói rõ điều đó để bạn không hiểu lầm. Bước kiểm tra này __chỉ bắt được lỗi thô, rõ ràng__: file rỗng, file hỏng, file vỡ. Nó __KHÔNG phát hiện được lỗi trình bày tinh vi__ như: bảng bị lệch cột, chữ tràn ra ngoài khung, một sơ đồ vẽ đúng nhưng nội dung bên trong sai, màu sắc kỳ lạ...

Nói cách khác: máy đảm bảo "file không hỏng", còn "file có đẹp và đúng không" thì __bạn vẫn nên mở ra liếc qua một lượt__ trước khi gửi cho người quan trọng. Đây không phải điểm yếu bị giấu đi, mà là ranh giới được ghi rõ để bạn biết chỗ nào máy lo, chỗ nào mình lo.

---

## 8. Khi tính năng chưa sẵn sàng — hệ thống từ chối thế nào?

`/export` không tự dựng tài liệu từ con số không. Nó chỉ __đóng gói cái đã có__. Vì vậy nếu bạn gõ `/export` cho một tính năng chưa tồn tại, hoặc tồn tại nhưng __chưa có SRS__, hệ thống sẽ không cố "xuất đại".

Thay vào đó nó __từ chối một cách rõ ràng và chỉ đường__:

```
Chưa thể chạy /export cho `payment` — thiếu srs/payment-spec.md.
Feature có SRS: user-login, checkout, ...
→ Chạy /srs payment trước để tạo SRS, rồi quay lại /export payment.
```

Lý do: nếu không có SRS thật làm nguồn, gói tài liệu xuất ra sẽ rỗng ruột hoặc bịa bậy. Thà chặn lại và chỉ bạn tới đúng lệnh cần chạy trước, còn hơn giao một gói tài liệu vô nghĩa.

Nếu bạn gõ `/export` mà không ghi tên tính năng nào, hệ thống hiện ra __danh sách các tính năng đã sẵn sàng__ (đã có SRS) để bạn chọn — không bắt bạn phải nhớ đường dẫn file.

---

## 9. Ví dụ thực tế

Anh __Hùng__, một BA phụ trách tính năng "payment" (thanh toán), vừa hoàn thiện xong tài liệu. Sáng nay Product Manager nhắn: *"Chiều họp với khách, gửi anh bản PDF đầy đủ của payment để anh in ra phát cho mọi người."*

Anh Hùng mở terminal, gõ:

```
/export payment pdf
```

1) Hệ thống kiểm tra: có tính năng `payment`, có tài liệu SRS — hợp lệ. Định dạng đã rõ là PDF.

2) Hệ thống kiểm tra công cụ: `mmdc`, `pandoc`, `Chrome` đều đã cài sẵn — ổn, đi tiếp. (Nếu thiếu công cụ nào, tới đây nó đã dừng và in lệnh cài rồi.)

3) Hệ thống báo trước: *"Sẽ tạo file PDF ở `docs/exports/2026-07-14-feature-payment-package.pdf`, ước tính khoảng 6MB. Apply? (Y/n)"*. Anh Hùng gõ `Y`.

4) Hệ thống quét toàn bộ tài liệu của `payment` — gom URD, BRD, SRS, các sơ đồ luồng, bản vẽ màn hình... theo thứ tự. Có vài mục tính năng này chưa làm (ví dụ chưa có test API), hệ thống ghi rõ *"chưa chạy `/api-test`"* ở mục đó chứ không bịa. Các sơ đồ mermaid được vẽ thành hình rõ nét trước khi nhét vào file. File mở đầu bằng một trang bìa ghi "Payment — xuất ngày 2026-07-14".

5) Tạo xong PDF, hệ thống __tự đếm số trang, kiểm tra không có trang trắng bất thường__ — báo "✓ OK".

6) Hệ thống in báo cáo: *"✅ Đã tạo PDF (6.2 MB), 11 sơ đồ vẽ thành công. Chia sẻ: gửi 1 file này, hình đã nhúng sẵn bên trong."*

7) Anh Hùng mở file liếc qua một lượt (đúng như Mục 7 khuyên — máy đảm bảo file không hỏng, nhưng "đẹp và đúng" thì mình vẫn nên nhìn), thấy ổn, đính kèm vào email gửi cả nhóm.

Chiều hôm sau, khách yêu cầu góp ý trực tiếp vào tài liệu. Anh Hùng chỉ cần gõ lại:

```
/export payment docx
```

để có ngay một bản Word cho khách sửa và bật track-changes — mỗi định dạng là một file riêng, không đè lên nhau.

Toàn bộ quá trình, anh Hùng không phải gom file thủ công, không phải lo sơ đồ hiện thành mã lệnh khó hiểu, và không bao giờ vô tình gửi đi một file hỏng.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (13 mục tài liệu, cách render mermaid, các trường hợp đặc biệt, giới hạn của bước verify), đọc file gốc: `.claude/skills/export/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
