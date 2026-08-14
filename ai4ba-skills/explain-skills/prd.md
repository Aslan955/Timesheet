---
type: skill-explainer
skill: prd
updated: 2026-08-01
---

# `/prd` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/prd` (viết tắt của "Product Requirements Document" — tài liệu yêu cầu sản phẩm) là lệnh bạn gõ khi có __một ý tưởng sản phẩm còn mơ hồ trong đầu__ và muốn biến nó thành một bản mô tả rõ ràng: sản phẩm này là gì, làm cho ai, giải quyết vấn đề gì, và __gồm những tính năng nào__.

Điểm quan trọng nhất cần nhớ ngay từ đầu: đây là tài liệu ở __cấp toàn sản phẩm__ — nhìn từ trên cao xuống cả dự án, chứ không phải đào sâu một tính năng cụ thể. Nó trả lời câu hỏi *"toàn bộ sản phẩm này gồm những mảnh gì"*, chưa phải *"mảnh này chạy ra sao"*.

Vài tình huống điển hình nên dùng `/prd`:

- Bạn vừa có ý tưởng một sản phẩm mới (ví dụ "app học tiếng Anh 5 phút mỗi ngày cho người đi làm") và cần một bản mô tả để cả nhóm cùng hiểu, cùng bàn.
- Bạn muốn có một __danh sách tính năng đã bóc tách gọn gàng__ để biết nên làm cái nào trước, cái nào sau.
- Bạn cần một tài liệu "gốc" để từ đó chạy tiếp các bước sau: xếp lịch ưu tiên (`/roadmap`), rồi đào sâu từng tính năng (`/brainstorm`).

Gõ lệnh đơn giản như:

```
/prd app học tiếng Anh cho người đi làm bận rộn, học 5 phút mỗi ngày
```

Hoặc gõ trơn `/prd` — hệ thống sẽ hỏi bạn về sản phẩm trước khi bắt đầu.

> __Mẹo quan trọng:__ câu ví dụ trên chỉ là một dòng ngắn cho gọn. Thực tế, __bạn nên gõ ra càng nhiều càng tốt mọi thứ bạn đang nghĩ về sản phẩm__ — ai là người dùng, họ đang khổ vì cái gì, bạn hình dung có những tính năng nào, khác đối thủ ở đâu, ràng buộc gì... Cứ viết thoải mái, dài dòng cũng không sao. Bạn cung cấp càng nhiều bối cảnh (context), AI càng phân tích đúng và sâu, càng đỡ phải hỏi đi hỏi lại và càng ít phải suy đoán. Viết sơ sài thì nó vẫn chạy được — chỉ là nó sẽ phải hỏi bạn nhiều hơn ở phần phỏng vấn (Mục 2) để bù lại.

Kết quả cuối cùng là __một file duy nhất__: `docs/_product/prd.md` — bản mô tả toàn sản phẩm cộng với __Feature Map__ (bản đồ tính năng). Feature Map không chỉ là một danh sách tên tính năng: mỗi tính năng còn kèm một __mô tả ngắn__ (mini-brief) — nó phục vụ nhu cầu gì của người dùng, phạm vi làm trong bản đầu (v1) tới đâu, luồng chính vài bước, rủi ro chính và cách đo thành công. Đó là lý do lúc phỏng vấn `/prd` hỏi bạn cả về phạm vi, rủi ro và chỉ số cho từng tính năng (xem Mục 3-4).

---

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm cần nhớ: **`/prd` phỏng vấn bạn từng nhóm câu hỏi một, chờ bạn trả lời rồi mới hỏi tiếp** — chứ không dồn một loạt câu hỏi khiến bạn hoa mắt. Và như mọi lệnh khác, nó luôn cho bạn xem trước rồi mới ghi file.

```
 BẠN GÕ LỆNH
 /prd "y tuong san pham"
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Nhận ý tưởng, tìm hiểu bối cảnh          │
 │  Hệ thống đọc mô tả của bạn (hoặc hỏi nếu bạn gõ      │
 │  lệnh trơn). Nếu đã có PRD cũ → tự đọc lại để cập      │
 │  nhật thay vì viết đè.                                 │
 │  Đọc luôn "hồ sơ dự án" (nếu đã có) để khỏi hỏi lại   │
 │  những gì bạn từng trả lời ở lệnh khác — xem Mục 5.   │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Phỏng vấn 6 nhóm, TỪNG NHÓM MỘT         │
 │   Nhóm 1: Tầm nhìn & Vấn đề (giải cho ai, đau gì)     │
 │   Nhóm 2: Người dùng & Bối cảnh (họ muốn đạt gì)      │
 │   Nhóm 3: Giá trị & Khác biệt (vì sao chọn mình)      │
 │   Nhóm 4: Tính năng (kể ra, hệ thống bóc + đề xuất)   │
 │   Nhóm 5: Phạm vi & Ràng buộc (cái gì KHÔNG làm)      │
 │   Nhóm 6: Chỉ số thành công (đo bằng gì)              │
 │  → Hỏi 1 nhóm, CHỜ bạn trả lời, rồi mới sang nhóm sau │
 │  → Chưa trả lời được nhóm nào? Gõ "skip" — nó ghi     │
 │    "chưa rõ" (TBD) + câu hỏi mở, KHÔNG ép bạn.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Bóc tính năng + chấm "vừa tầm"          │
 │  Với danh sách tính năng bạn kể, hệ thống:            │
 │   • Chấm từng cái xem có "vừa tầm" không (Mục 3)      │
 │     - Quá to  → đề xuất TÁCH nhỏ (hỏi bạn)            │
 │     - Quá nhỏ → đề xuất GỘP lại (hỏi bạn)            │
 │   • Tự ĐỀ XUẤT THÊM tính năng còn thiếu, suy ra từ    │
 │     điều bạn đã kể ở nhóm 1-3 (Mục 4)                 │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Bạn duyệt Feature Map + luồng tổng quan  │
 │  Hệ thống trình bảng nháp: danh sách tính năng đã     │
 │  bóc + phần "em đề xuất thêm" + một luồng người dùng  │
 │  tổng quan 5-8 bước. Bạn chỉnh/duyệt (tối đa 2 vòng). │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Xem trước rồi mới ghi                    │
 │  Hệ thống tóm tắt "sẽ ghi cái gì vào file" bằng lời   │
 │  dễ hiểu, CHỜ bạn gật đầu (Y). File đã có sẵn thì cho │
 │  xem phần thay đổi (trước/sau) rồi mới ghi đè.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 6 — Giải quyết các "câu hỏi mở"              │
 │  Nếu trong lúc phỏng vấn còn chỗ chưa rõ (bạn đã       │
 │  skip, hoặc số liệu chưa có), hệ thống hỏi: "giải      │
 │  quyết mấy câu này luôn không?" Bạn chọn làm ngay      │
 │  (Y), bỏ qua (skip), hay chỉ làm vài câu. Sửa gì cũng  │
 │  cho xem trước/sau rồi mới ghi.                        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 7 — Tự rà soát lại (auto-review)             │
 │  3 "trợ lý chuyên trách" đọc lại bản vừa ghi, bắt các │
 │  lỗi (tính năng lạc mạch, tính năng nào không phục vụ │
 │  ai, chỉ số đo sai...). Sửa nhỏ thì tự sửa; chỗ phải  │
 │  QUYẾT thay bạn thì nó tự chọn phương án hợp lý rồi    │
 │  đánh dấu 🔶 để bạn xem lại (không dừng hỏi giữa       │
 │  chừng). Không muốn bước này → nói "khỏi review".     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 8 — Báo cáo + gợi ý bước tiếp                │
 │  In tóm tắt: đã bóc bao nhiêu tính năng, cái nào đã    │
 │  làm dở, còn câu hỏi mở nào. Gợi ý chạy tiếp:         │
 │    /roadmap        → xếp thứ tự làm trước/sau          │
 │    /brainstorm <x> → đào sâu 1 tính năng               │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có PRD sản phẩm + bản đồ tính năng gọn gàng
```

---

## 3. Điểm quan trọng nhất: tính năng phải "vừa tầm"‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là phần thiết kế cốt lõi của `/prd`, và cũng là chỗ dễ hiểu nhầm nhất, nên xứng đáng giải thích kỹ.

Khi bóc một sản phẩm thành danh sách tính năng, có một cái bẫy: người ta hay liệt kê các tính năng __to nhỏ lẫn lộn__. Ví dụ trong cùng một danh sách lại có cả *"Thanh toán"* (một mảng khổng lồ) đứng cạnh *"Kiểm tra mã CVV của thẻ"* (một chi tiết bé xíu). Danh sách kiểu đó không dùng để làm việc được — vì bạn không biết mỗi dòng là "một mẩu bao lớn".

`/prd` giải quyết bằng cách bắt __mọi tính năng phải cùng một tầm vóc__ — thuật ngữ trong nghề gọi là *altitude* (độ cao). Hãy hình dung bạn chia một sản phẩm thành các phần sao cho __mỗi phần là một mảng việc trọn vẹn, tự đứng được, làm xong bật lên "khoe" được, và đủ gọn để ngồi đào sâu một buổi ra được một bộ luồng/màn hình mạch lạc__ — không quá to đến mức phải chẻ nhỏ mới bàn được, cũng không quá nhỏ đến mức chẳng đáng gọi là một phần riêng.

Cụ thể, một tính năng "vừa tầm" phải thỏa mấy điều:

- __Là một việc rõ ràng__ (một động từ + một đối tượng), ví dụ "Lưu phương thức thanh toán" — chứ không phải "Thanh toán" (quá to, thực ra là cả một mảng gồm nhiều việc) và cũng không phải "Kiểm tra mã CVV" (quá nhỏ, đó chỉ là một quy tắc bên trong).
- __Tự đứng được và demo được__ — làm xong có thể bật lên cho người khác xem "đây, tính năng này chạy thế này".
- __Phục vụ đúng một mục tiêu của người dùng__ (một "job", xem Mục 4).
- __Bóc ra được khoảng 3 đến 15 việc nhỏ__ (user story). Ít hơn 3 → nó thực ra chỉ là một việc nhỏ, nên gộp vào cái lớn hơn. Nhiều hơn 15-20 → nó là một mảng khổng lồ (gọi là "epic"), phải tách ra.

Hệ thống __tự chấm từng tính năng__ theo thước đo này trước khi đưa vào danh sách. Cái nào quá to, nó đề xuất tách; cái nào quá nhỏ, nó đề xuất gộp. Nhưng — điểm quan trọng — nó __chỉ đề xuất và giải thích lý do, rồi hỏi bạn__, chứ không tự ý đổi. Bạn vẫn có quyền giữ nguyên nếu bạn có lý do riêng (khi đó nó ghi chú lại rủi ro của việc để tính năng quá to).

Vì sao phải kỹ vậy? Vì "vừa tầm" là điều kiện để bước sau chạy trơn: mỗi tính năng vừa tầm chính là **một buổi đào sâu (`/brainstorm`) gọn gàng** — không bị loãng vì quá to, không bị vụn vì quá nhỏ.

---

## 4. "AI tự đề xuất thêm tính năng" — và vì sao đó không phải bịa‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Sau khi bạn kể ra các tính năng bạn hình dung (Nhóm 4), hệ thống làm một việc thú vị: nó __tự đề xuất thêm những tính năng bạn có thể đã bỏ sót__.

Nghe qua thì dễ lo: liệu nó có "bịa" ra tính năng linh tinh không? Rủi ro đó được chặn rất chặt — vì mỗi đề xuất __bắt buộc phải có căn cứ từ chính điều bạn đã kể__, chứ không được lấy từ một "danh sách mẫu của ngành" rồi nhét bừa vào.

Hãy nhớ lại: trước Nhóm 4, bạn đã trả lời 3 nhóm câu hỏi về __vấn đề bạn giải, người dùng của bạn là ai, và họ muốn đạt được điều gì__ (những điều họ muốn đạt được gọi là "job" — công việc họ đang cố hoàn thành). Hệ thống làm phép đối chiếu đơn giản:

> "Người dùng nói họ muốn đạt điều X. Nhưng trong danh sách tính năng bạn vừa kể, chưa có tính năng nào giúp họ đạt điều X. Vậy hình như đang thiếu một tính năng ở đây?"

Nói cách khác, mỗi đề xuất đều __truy ngược về một câu trả lời cụ thể của chính bạn__ — không phải lấy từ một "danh sách mẫu của ngành" nào đó rồi nhét bừa vào. Ví dụ: nếu bạn kể sản phẩm cần "học 5 phút mỗi ngày" nhưng lại quên nhắc đến tính năng __nhắc học__ (reminder), hệ thống sẽ chỉ ra: *"Anh muốn người dùng học đều mỗi ngày, nhưng chưa có tính năng nhắc — em đề xuất thêm 'Nhắc học hằng ngày', anh thấy sao?"*

Nó cũng đề xuất một số tính năng "ngầm bắt buộc" — nhưng chỉ khi __chính bối cảnh sản phẩm của bạn cho thấy chúng là nền không thể thiếu__. Ví dụ nếu sản phẩm cần lưu tiến độ học theo từng người thì hiển nhiên phải có __tài khoản/đăng nhập__; nếu người mới vào cần được dẫn dắt thì cần __onboarding__ (màn hình chào lần đầu). Đây là suy ra từ nhu cầu cụ thể của bạn, không phải một checklist bê nguyên vào.

Và bạn __duyệt từng cái một__ — nhận hay bỏ tùy bạn. Nếu bạn bỏ một đề xuất mà thực ra nó phục vụ một nhu cầu có thật, hệ thống không lặng lẽ quên: nó ghi lại thành "cố ý không làm" (non-goal) hoặc một câu hỏi mở để sau này còn nhớ.

---

## 5. "Hồ sơ dự án" — vì sao lần chạy sau bạn bị hỏi ít đi

Có một cơ chế chạy ngầm mà bạn sẽ __cảm nhận được ngay ở lần dùng thứ hai__, nên đáng biết trước để khỏi thấy lạ.

Trong lúc phỏng vấn, có những câu không thuộc riêng một tính năng nào mà thuộc về __cả dự án__: sản phẩm này ở lĩnh vực gì, người dùng cuối được gọi là gì (học viên? khách hàng? tài xế?), đối thủ là ai, có quy định pháp lý nào phải tuân (bảo mật dữ liệu cá nhân chẳng hạn). Những câu đó, hỏi một lần là đủ cho cả dự án.

Vì vậy hệ thống làm bốn bước:

1. __Đọc trước__ — mở file `docs/_shared/project-profile.md` (hồ sơ dự án) xem đã có sẵn câu trả lời chưa.
2. __Thiếu thì hỏi__ — chỉ hỏi đúng phần còn trống, không hỏi lại phần đã có.
3. __Đề xuất ghi lại__ — sau khi bạn trả lời, nó xin phép lưu vào hồ sơ dự án (bạn vẫn duyệt trước khi ghi; từ chối cũng được, khi đó nó chỉ dùng câu trả lời cho lần chạy này).
4. __Lần sau dùng lại__ — bất kỳ lệnh nào khác (`/urd`, `/brd`, `/brainstorm`, `/srs`...) cũng đọc chung hồ sơ này, nên __không hỏi lại bạn nữa__.

Điều này giải thích một hiện tượng dễ gây bối rối: lần đầu chạy `/prd` bạn bị hỏi khá nhiều về bối cảnh dự án, nhưng lần sau chạy `/urd` hay `/brd` thì những câu đó biến mất. Không phải nó quên hỏi — mà là __nó đã biết rồi__.

Lưu ý: hồ sơ dự án __không phải một bản khai bạn phải điền trước__. Nó bắt đầu rỗng và đầy dần lên qua từng lần bạn dùng các lệnh. Muốn xem hoặc sửa chủ động thì dùng `/update-overview profile`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

---

## 6. Đừng nhầm ba lệnh: `/prd` vs `/prd-epic` vs `/brainstorm`

Ba lệnh này tên na ná nhau và đều liên quan tới "mô tả cái sẽ làm", nên rất hay bị lẫn. Thực ra chúng ở __ba tầng khác nhau__, đi từ cao xuống thấp:

| | `/prd` (lệnh này) | `/prd-epic` | `/brainstorm` |
|---|---|---|---|
| __Tầm nhìn__ | Toàn sản phẩm (cả dự án) | Một tính năng / epic | Một tính năng, đào sâu chi tiết |
| __Trả lời câu hỏi__ | "Sản phẩm gồm những tính năng nào?" | "Tính năng này có những khả năng gì (P0/P1/P2)?" | "Tính năng này chạy thế nào, có những màn hình/luồng gì?" |
| __Cho ra cái gì__ | 1 file PRD sản phẩm + bản đồ tính năng | 1 file đặc tả cho 1 tính năng | 1 file đào sâu ý tưởng 1 tính năng |
| __Kết quả để ở đâu__ | `docs/_product/prd.md` (một file duy nhất) | `docs/{tính-năng}/{tên}-prd.md` | `docs/{tính-năng}/brainstorms/*.md` |
| __Khi nào dùng__ | Bắt đầu — chưa biết sản phẩm gồm gì | Đã chọn 1 tính năng, cần liệt kê khả năng | Đã chọn 1 tính năng, cần đào sâu cách làm |

Một câu để nhớ: **`/prd` nhìn cả rừng (sản phẩm có những cây nào); `/prd-epic` và `/brainstorm` đi vào từng cây (một tính năng cụ thể).**

Thứ tự tự nhiên là: chạy `/prd` trước để có danh sách tính năng → chọn một tính năng → dùng `/brainstorm` (đào sâu) hoặc `/prd-epic` (đặc tả) cho tính năng đó.

---

## 7. Một ranh giới nữa dễ nhầm: `/prd` không làm bài toán tiền bạc

Có một chỗ hay bị kỳ vọng nhầm: nhiều người tưởng PRD sản phẩm phải kèm luôn phân tích lời-lỗ, hoàn vốn (ROI), giá trị đầu tư... Không phải.

`/prd` chỉ nói về __giá trị theo kiểu mô tả (định tính)__ — "sản phẩm này mang lại điều gì có ích cho người dùng, khác biệt ở đâu". Nó __không__ làm phép tính chi phí — lợi ích, không tính hoàn vốn, không mô hình tài chính. Những bài toán tiền bạc đó là việc của lệnh khác (`/brd` — tài liệu yêu cầu nghiệp vụ) hoặc của một bản business case riêng do bộ phận tài chính/sponsor làm.

Nếu lúc phỏng vấn bạn có khai chi tiết về giá trị kinh doanh, hệ thống vẫn ghi nhận ở mức mô tả và __gợi ý__ bạn "phần cost-benefit đầy đủ thì để `/brd` làm" — chứ không nhồi bảng tính tài chính vào PRD sản phẩm.

---

## 8. Cột "Chi tiết hóa" — đánh dấu bằng lời nói

Trong bản đồ tính năng (Feature Map), mỗi tính năng có một cột nhỏ tên __"Chi tiết hóa"__ với ba mức:

- `⬜ chưa` — tính năng mới nằm trong danh sách, chưa ai đào sâu.
- `🔄 đang brainstorm` — đang được đào sâu dở.
- `✅ đã chi tiết` — đã brainstorm xong (nhãn đầy đủ trong file ghi kèm số buổi, kiểu `✅ đã chi tiết (2 brainstorm)`).

> Lưu ý: cột này chỉ nói __đã làm rõ nghiệp vụ tới đâu__ (đã brainstorm chưa), KHÔNG có nghĩa "đã lập trình xong". `✅` = đã bàn kỹ, chưa phải đã code.

Cái hay là bạn __không cần cú pháp phức tạp__ để chỉnh cột này. Chỉ cần __nói bằng lời__ như nói chuyện bình thường:

```
đánh dấu payment đã chi tiết
authentication brainstorm xong rồi
payment giờ đang làm dở
```

Hệ thống tự hiểu ý bạn muốn đổi tính năng nào sang trạng thái gì, rồi cho bạn xác nhận nhanh một câu trước khi sửa. Nếu câu bạn nói mơ hồ (không rõ đang nói tính năng nào), nó hỏi lại chứ không đoán bừa.

---

## 9. Ví dụ thực tế

Anh __Minh__, một BA, vừa được giao dựng ý tưởng cho một sản phẩm mới: __app học tiếng Anh cho người đi làm bận rộn, học 5 phút mỗi ngày__. Ý tưởng mới chỉ có vậy trong đầu — chưa có gì rõ ràng. Anh mở terminal, gõ:

```
/prd app học tiếng Anh cho người đi làm bận rộn, học 5 phút mỗi ngày
```

1. Hệ thống nhận ý tưởng, thấy chưa có PRD sản phẩm nào tồn tại nên biết đây là lần tạo mới.

2. Nó bắt đầu __phỏng vấn từng nhóm một__. Nhóm 1 (Tầm nhìn): *"Vấn đề cốt lõi là gì, ai đau nhất?"* — anh Minh trả lời "người đi làm muốn giỏi tiếng Anh nhưng không có thời gian học bài dài". Nó chờ, rồi mới sang Nhóm 2 (Người dùng): *"Họ đang cố đạt điều gì?"* — anh kể "muốn tự tin nói trong cuộc họp với khách nước ngoài", "muốn duy trì thói quen học đều đặn". Cứ thế qua Nhóm 3 (giá trị khác biệt).

3. Đến __Nhóm 4 (Tính năng)__, anh Minh kể: *"bài học ngắn 5 phút, luyện phát âm, theo dõi chuỗi ngày học liên tiếp (streak)."* Hệ thống chấm từng cái theo thước "vừa tầm". Nó thấy anh kể "luyện phát âm" khá to, nhưng vẫn ổn ở tầm này. Rồi nó __đối chiếu với những gì anh đã kể ở nhóm 1-3__: anh nói muốn người dùng "duy trì thói quen học đều" và "tự tin trong cuộc họp", nhưng danh sách chưa có tính năng nào __nhắc học__ và chưa có __tài khoản/đăng nhập__. Nó đề xuất: *"Em đề xuất thêm 'Nhắc học hằng ngày' (vì anh muốn giữ thói quen đều), và 'Tài khoản người dùng' (feature nền để lưu tiến độ). Anh duyệt cái nào?"* Anh Minh nhận cả hai.

4. Hệ thống trình __bản nháp Feature Map__ (khoảng 5-6 tính năng, kèm phần "em đề xuất thêm" đánh dấu rõ) cùng một __luồng người dùng tổng quan__ 6 bước: *đăng ký → chọn mục tiêu học → học bài 5 phút → luyện phát âm → nhận nhắc học → xem tiến độ*. Anh Minh xem, thấy thiếu một bước, góp ý chỉnh — hệ thống sửa lại (đây là vòng iterate nhẹ, tối đa 2 vòng).

5. Chốt xong, hệ thống __tóm tắt bằng lời__ sẽ ghi gì vào file: tầm nhìn, 6 tính năng bóc tách (2 cái do nó đề xuất, anh đã duyệt), luồng tổng quan, chỉ số North Star... rồi hỏi *"Apply? (Y / sửa)"*. Anh Minh gõ `Y`. Hệ thống ghi file `docs/_product/prd.md`.

6. Ghi xong, hệ thống thấy trong lúc phỏng vấn còn vài __câu hỏi mở__ chưa rõ (ví dụ anh Minh chưa có số liệu thật cho chỉ số North Star nên lúc đó ghi tạm "chưa rõ"). Nó hỏi: *"Có 2 câu hỏi mở, anh muốn làm rõ luôn không? (Y / bỏ qua / chọn câu)"*. Anh Minh bận nên gõ "bỏ qua" — hệ thống giữ nguyên phần "chưa rõ" đó để xử lý sau.

7. Sau đó, __3 trợ lý tự động rà soát__ bản vừa ghi: một trợ lý phát hiện tính năng "luyện phát âm" chưa ghi rõ nó phục vụ "job" nào của người dùng → tự bổ sung dòng "Phục vụ job: giúp tự tin nói trong cuộc họp". Một quyết định khác — chọn chỉ số đo thành công cho một tính năng — nó __tự chọn phương án hợp lý và áp dụng luôn__ (không dừng lại hỏi anh Minh), nhưng __đánh dấu 🔶__ để anh xem lại sau.

8. Cuối cùng hệ thống in báo cáo: *"Đã bóc 6 tính năng, tất cả đều ⬜ chưa brainstorm. Có 2 quyết định 🔶 em tự chọn thay anh, anh xem lại bên dưới."* Và gợi ý bước tiếp: *"Chạy `/roadmap` để xếp thứ tự làm trước/sau, hoặc `/brainstorm bai-hoc-ngan` để đào sâu tính năng đầu tiên."*

Toàn bộ quá trình, anh Minh chủ yếu chỉ trả lời câu hỏi và duyệt — không phải tự nghĩ ra cấu trúc tài liệu. Bản PRD được xem trước khi ghi; riêng bước tự rà soát cuối thì hệ thống có quyền tự sửa và tự quyết vài chỗ (những chỗ này đều gắn cờ 🔶 để anh kiểm lại, và anh có thể tắt hẳn bước này bằng "khỏi review" nếu muốn tự tay kiểm soát mọi thứ). Từ một câu ý tưởng mơ hồ, anh có một bản mô tả sản phẩm gọn gàng cùng bản đồ tính năng sẵn sàng cho các bước sau.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (6 nhóm câu hỏi phỏng vấn chính xác, thước đo altitude, quy tắc format, các trường hợp đặc biệt), đọc file gốc: `.claude/skills/prd/SKILL.md`.

Các lệnh liên quan trong dây chuyền:

- `explain-skills/roadmap.md` — `/roadmap`: **bước tiếp ngay sau `/prd`**, đọc bản đồ tính năng rồi xếp thứ tự ưu tiên và phân đợt (Now/Next/Later).
- `.claude/skills/prd-epic/SKILL.md` — `/prd-epic`: đặc tả __một__ tính năng cụ thể (khả năng P0/P1/P2), tầng dưới `/prd`.
- `.claude/skills/brainstorm/SKILL.md` — `/brainstorm`: đào sâu __một__ tính năng đã có trong Feature Map (chạy xong tự đánh dấu ✅ ngược lên PRD).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
