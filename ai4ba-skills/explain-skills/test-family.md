---
type: skill-explainer
skill: test-family
updated: 2026-07-17
---

# Họ lệnh TEST — chúng liên quan với nhau thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Tài liệu này giải thích __mối liên quan__ giữa các lệnh làm việc kiểm thử: `/test-checklist`, `/test-cases`, `/playwright-gen` (nhánh giao diện) và `/api-checklist`, `/api-test` (nhánh API). Muốn hiểu sâu từng lệnh, đọc file explainer riêng ở cuối.

## 1. Đây KHÔNG phải nhiều cách làm cùng một việc‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Các lệnh test là __những chặng nối tiếp của một hành trình__ từ “cần kiểm gì” đến “kiểm được bằng máy”:

> __Liệt kê tình huống cần kiểm → viết kịch bản chi tiết → biến thành test tự động chạy.__

Hãy hình dung việc nghiệm thu một căn hộ:

1. Trước tiên lập __bảng những thứ phải kiểm__ (điện, nước, cửa, chống thấm) — chưa nói cách kiểm, chỉ nói kiểm gì.
2. Rồi viết __từng phiếu kiểm chi tiết__: mở vòi nào, hứng bao nhiêu nước, áp lực bao nhiêu là đạt.
3. Cuối cùng, nếu muốn kiểm đi kiểm lại nhiều lần, __giao cho một cỗ máy tự làm theo phiếu__.

Ba bước đó chính là ba chặng của nhánh giao diện.

## 2. Bức tranh dòng chảy — hai nhánh, một triết lý‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
                        ┌────────────────────────────┐
                        │  Tài liệu nghiệp vụ          │
                        │  (SRS, use case, màn hình)  │
                        └───────────┬─────────────────┘
                                    │  nguồn sự thật (không bịa)
             ┌──────────────────────┴──────────────────────┐
             ▼                                               ▼
 ══ NHÁNH GIAO DIỆN (người dùng bấm) ══        ══ NHÁNH API (hệ thống nói với nhau) ══

 ┌─────────────────────────────────┐          ┌─────────────────────────────────┐
 │ /test-checklist                 │          │ /api-checklist                  │
 │ Liệt kê tình huống cần kiểm     │          │ Liệt kê tình huống cần kiểm     │
 │ trên giao diện. Gắn mã CHK.     │          │ ở tầng API (có hỏi làm rõ trước)│
 └───────────────┬─────────────────┘          └───────────────┬─────────────────┘
                 │                                             │
                 ▼                                             ▼
 ┌─────────────────────────────────┐          ┌─────────────────────────────────┐
 │ /test-cases                     │          │ /api-test                       │
 │ Viết kịch bản chi tiết 1:1      │          │ Biến từng mục thành lần gọi     │
 │ (bước, dữ liệu, kết quả).       │          │ thử API chạy được (qua Bruno).  │
 └───────────────┬─────────────────┘          └─────────────────────────────────┘
                 │
                 ▼
 ┌─────────────────────────────────┐
 │ /playwright-gen                 │
 │ Biến kịch bản → script robot    │
 │ tự mở trình duyệt, bấm, kiểm.   │
 └─────────────────────────────────┘
```

Điểm chung của cả hai nhánh — __một triết lý duy nhất__:

> __Tài liệu .md là bản gốc → công cụ sinh ra thứ chạy được → chạy → ghi kết quả về. Con người sửa bản gốc, không sửa thứ máy sinh.__

`/test-cases` là bản gốc, `/playwright-gen` sinh script. `/api-checklist`+`/api-test` là bản gốc, Bruno là thứ chạy. Không ai sửa tay “thứ máy sinh”.

Ngoài ra, `/test-checklist` và `/test-cases` còn tạo kèm một __trang HTML nhấp-đúp-mở__ (`preview.html` là khung trang, `data.js` là dữ liệu làm mới mỗi lần chạy) để xem/lọc/tìm cho dễ — và riêng `/test-cases` có thêm nút __Xuất Excel__ (một dòng/bước, hoặc gộp theo kịch bản) để gửi người kiểm hoặc nhập vào TestRail/Jira. Trang HTML chỉ là “cửa sổ nhìn vào” dữ liệu; file `.md` vẫn là bản gốc.

## 3. Bảng phân biệt nhanh‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Lệnh | Làm gì bằng lời dễ hiểu | Trả lời câu hỏi chính |
|---|---|---|
| `/test-checklist` | Liệt kê tình huống cần kiểm trên giao diện | “Cần kiểm những gì để không sót?” |
| `/test-cases` | Viết kịch bản chi tiết cho từng tình huống | “Kiểm bằng cách nào, nhập gì, mong đợi gì?” |
| `/playwright-gen` | Biến kịch bản thành script robot tự chạy | “Làm sao chạy lại nhiều lần không tốn công?” |
| `/api-checklist` | Liệt kê tình huống cần kiểm ở tầng API | “API cần thử những gì?” |
| `/api-test` | Biến mục API thành lần gọi thử chạy được | “API thực tế trả đúng không?” |

Một câu để nhớ: __checklist chọn cái cần kiểm; test-cases/api-test viết cách kiểm; playwright-gen cho robot chạy lại.__

## 4. Vì sao tách “liệt kê” và “chi tiết” thành hai bước?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là quyết định thiết kế quan trọng, dùng cho cả hai nhánh.

Nếu nhảy thẳng vào viết kịch bản chi tiết, bạn dễ __lạc vào tiểu tiết__ và khó thấy mình đã sót tình huống nào. Tách bước “liệt kê” (checklist) ra trước cho phép mọi người __duyệt phạm vi khi nó còn gọn__ — một trang danh sách dễ soát hơn là hàng chục trang kịch bản.

Giống như duyệt mục lục sách trước khi viết từng chương: sửa mục lục thì nhanh, sửa khi đã viết xong hết thì tốn.

## 5. Sợi chỉ đỏ: “mã theo dõi” nối cả hành trình

Mỗi tình huống trên giao diện được gắn một mã cố định — ví dụ `CHK-dang-nhap-027` — ngay từ checklist. Mã này:

- __Không đổi, không dùng lại__ (như số phòng khách sạn).
- Theo sang kịch bản chi tiết (`/test-cases` bám đúng mã).
- Theo tiếp vào script tự động (`/playwright-gen` đặt mã vào tên test).

Nhờ sợi chỉ đỏ này, bạn luôn trả lời được: *“Tình huống này đã có kịch bản chưa? Đã dựng script chưa? Chạy đậu hay rớt?”* — mà không sợ lẫn lộn. Bạn không cần nhớ mã; các lệnh tự quản lý.

## 6. “Mỗi mục một việc” — vì sao nó quan trọng cho cả chuỗi

Nhánh giao diện giữ nguyên tắc __mỗi mục checklist có đúng một “kết luận cuối” để quyết định đậu/rớt__ (được có nhiều bước chuẩn bị, nhưng chỉ một kết luận). Lý do dây chuyền:

- Checklist tách “logo hiển thị” và “bấm logo về trang chủ” thành hai mục.
- → `/test-cases` viết hai kịch bản riêng (không gộp, không rơi rớt nửa nào).
- → `/playwright-gen` dựng hai test rõ ràng, mỗi test kiểm đúng một điều.

Nếu ngay từ checklist gộp hai việc vào một dòng, sai lệch sẽ __lan xuống tận script__. Vì thế kỷ luật “atomic” bắt đầu từ chặng đầu.

> __Lưu ý:__ nhánh API cố tình __khác__ ở điểm này. Một “ý định” API (ví dụ “kiểm tra số tiền”) thường phải nở thành nhiều lần gọi thử (số 0, số âm, vượt hạn mức...) vì bản chất API là vậy — không ép 1:1 cứng. Đây là khác biệt __có chủ đích__ giữa hai nhánh, không phải mâu thuẫn: giao diện thì một-hành-vi-một-kịch-bản, còn API thì một-ý-định-nhiều-lần-gọi. Cả hai đều chung một luật vàng: __không đẻ tình huống mới ngoài checklist đã duyệt.__‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 7. Nguyên tắc xuyên suốt: KHÔNG bịa

Cả bộ lệnh test tuân một luật chung, và đây là điều làm chúng đáng tin:

- __Nội dung lấy từ tài liệu thật:__ câu thông báo lỗi chính xác, con số, quy tắc — đều rút từ đặc tả/use case/màn hình, không tự nghĩ.
- __Thiếu thì hỏi hoặc đánh dấu, không điền bừa:__ chỗ nào tài liệu chưa nói, lệnh nêu câu hỏi mở hoặc ghi “cần bổ sung”.
- __Máy không đủ chắc thì không đoán:__ `/playwright-gen` thiếu dữ liệu/kết quả mong đợi thì __bỏ qua hẳn__ kịch bản đó; chỉ thiếu cách nhận diện một phần tử (như logo) thì __dựng bản nháp có ghi chú TODO__ để dev xác nhận. Cả hai đều thà vậy còn hơn dựng một script tự-tin-giả chạy xong báo “đậu” mà chẳng kiểm gì.

Một danh sách trung thực (biết rõ mình còn thiếu gì) luôn quý hơn một danh sách trông đầy đặn nhưng lẫn lộn thật-giả.

Cùng tinh thần cẩn trọng đó áp cả lúc __chạy thật__: khi cho test tự động chạy, các lệnh __không tự chạy trên môi trường thật (production)__ — vì test có thể tạo dữ liệu hoặc đổi trạng thái thật. Mặc định chỉ chạy trên môi trường thử; muốn chạm production phải cấp phép rõ ràng. “Không bịa” và “không chạy nhầm chỗ nguy hiểm” là hai mặt của cùng một sự thận trọng.

Và vì kịch bản thường viết __trước khi có sản phẩm chạy được__ (nên dữ liệu thử lúc đó chỉ là mẫu), khi chạy thật `/playwright-gen` còn __tách “rớt do dữ liệu thử”__ (sai/thiếu/cũ) __khỏi “rớt do ứng dụng lỗi”__, và liệt kê ra dữ liệu nào còn thiếu để bạn cấp rồi chạy lại đúng phần chưa đậu — chi tiết ở explainer riêng của lệnh.

## 8. Bằng chứng không sót nghiệp vụ — bảng “độ phủ”

Câu hỏi muôn thuở: *“làm sao chắc checklist không bỏ sót nghiệp vụ nào?”*

`/test-checklist` lập một __bảng đối chiếu__: mỗi *nghĩa vụ nghiệp vụ nhỏ* (từng nhánh của một quy tắc, từng phần của một mã lỗi) phải có mục checklist phủ — hoặc ghi rõ “tạm loại, có lý do, có người duyệt”. Bảng đếm __theo từng nghĩa vụ nhỏ__, không đếm gộp — nên chỗ thiếu lộ ra thay vì bị che. Những nghĩa vụ còn “chưa có nguồn / đang treo / mới phủ một phần” đều __chưa cho đóng phạm vi__.

Bảng này cũng biết phân biệt tình huống nào nên kiểm ở __giao diện__, tình huống nào thuộc __tầng API__ — để bạn thấy được cả bức tranh và không tưởng nhầm “kiểm giao diện xong là kiểm hết”.

## 9. Giao diện đậu riêng, API đậu riêng — chưa chắc cả hệ thống đậu

Đây là chỗ dễ hiểu nhầm nhất, giống hệt bài học bên họ API:

- Kiểm giao diện đậu (màn đăng nhập hiện đúng, bấm đúng) — tốt.
- Kiểm API đậu (backend trả đúng khi gọi trực tiếp) — tốt.
- Nhưng __cả chuỗi ghép lại__ — người dùng bấm trên màn → gọi API → nhận kết quả → màn cập nhật — có thể vẫn hỏng ở khớp nối.

Vì vậy hai nhánh test không thay thế nhau: __giao diện và API là hai lớp bổ sung__, cần cả hai để yên tâm rằng tính năng chạy đúng từ đầu đến cuối.

## 10. Ranh giới công việc — đây là việc BA/QC, không phải đi lập trình

BA/QC có vai trò chính:

- Quyết định phạm vi test và độ sâu (nghiệm thu nhanh hay kiểm kỹ trước phát hành).
- Bổ sung câu thông báo/quy tắc/trạng thái mà tài liệu còn thiếu.
- Duyệt danh sách và kịch bản; đọc kết quả đậu/rớt để kết luận về tính năng.
- Tả nút/ô bằng nhãn nghiệp vụ — không viết mã kỹ thuật.

Phần vượt ngoài ranh giới BA: gắn “dấu nhận diện” kỹ thuật cho phần tử khó tìm, cài đặt công cụ, dựng môi trường chạy. Đội kỹ thuật lo phần đó. BA/QC sở hữu __ý nghĩa nghiệp vụ, phạm vi, kết quả mong đợi và kết luận đậu/rớt__.

## 11. Không phải lúc nào cũng chạy đủ cả bộ

- __Chỉ cần duyệt phạm vi:__ dừng ở `/test-checklist` để chốt “cần kiểm gì”, chưa vội viết chi tiết.
- __Cần kịch bản cho người kiểm tay:__ đi tới `/test-cases`, xuất sang công cụ quản lý test — không nhất thiết tự động hóa.
- __Cần chạy đi chạy lại nhiều lần (hồi quy):__ mới cần `/playwright-gen` dựng script tự động.
- __Tính năng có tầng API:__ thêm nhánh `/api-checklist` → `/api-test` song song.

## 12. Câu chốt

> __Bộ lệnh test là một hành trình: liệt kê cái cần kiểm → viết cách kiểm → cho robot chạy lại. Hai nhánh giao diện và API bổ sung nhau, cùng chung một luật — tài liệu thật là bản gốc, không bịa, thiếu cốt lõi thì thẳng thắn báo “chưa làm được” (chỉ thiếu chút nhận diện thì để bản nháp có ghi chú) — chứ không tạo test dối.__

## Xem thêm

- [`/test-checklist` — liệt kê tình huống cần kiểm (giao diện)](test-checklist.md)
- [`/test-cases` — viết kịch bản chi tiết](test-cases.md)
- [`/playwright-gen` — biến kịch bản thành script tự động](playwright-gen.md)
- [`/api-checklist` — liệt kê tình huống cần kiểm (API)](api-checklist.md)
- [`/api-test` — thử API bằng Bruno](api-test.md)
- [`api-family.md` — cả bộ lệnh API nối với nhau](api-family.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
