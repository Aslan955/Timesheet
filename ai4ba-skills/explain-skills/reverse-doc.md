---
type: skill-explainer
skill: reverse-doc
updated: 2026-07-26
---

# `/reverse-doc` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/reverse-doc` là lệnh dùng để **dựng lại một bộ tài liệu đặc tả (SRS) gọn gàng, có cấu trúc từ những tài liệu cũ đang nằm rải rác, lộn xộn**. Bạn đưa vào một mớ nguồn — file Word, PDF, ghi chú, ảnh chụp màn hình, mô tả cũ nhiều đời — và hệ thống đọc hết, gom theo từng tính năng, rồi viết ra cho mỗi tính năng một bộ tài liệu đặc tả đầy đủ: yêu cầu chức năng, quy tắc nghiệp vụ, danh sách lỗi, sơ đồ luồng, sơ đồ trạng thái, sơ đồ dữ liệu và use case.

Điểm khác biệt lớn nhất so với việc viết tài liệu mới: đây là chiều **đọc ngược**. Bạn không kể cho hệ thống nghe ý tưởng trong đầu; bạn đưa cho nó **bằng chứng đã có sẵn** (tài liệu, ghi chú, ảnh), và hệ thống bám vào đó mà dựng tài liệu — không tự nghĩ thêm ngoài những gì nguồn nói.

Đây là bước phù hợp khi:

- Bạn tiếp quản một dự án cũ, chỉ có một đống tài liệu tản mát mà không có bản đặc tả nào tử tế.
- Bạn có nhiều bản mô tả qua các đời (2023, 2024, 2025...) và muốn gom lại thành một bản đặc tả duy nhất, có ghi rõ chỗ nào mâu thuẫn.
- Bạn nhận bàn giao từ một bên khác dưới dạng Word/PDF/ảnh và cần biến nó thành tài liệu dùng được cho đội mình.
- Bạn muốn nhìn một bức tranh có cấu trúc từ mớ hỗn độn, kèm danh sách rõ ràng những chỗ tài liệu cũ còn thiếu.

Bạn gõ kèm đường dẫn tới nguồn:

```
/reverse-doc ./tai-lieu-cu
/reverse-doc ./legacy-docs ./anh-chup ~/Downloads/mo-ta-thanh-toan.docx
/reverse-doc @ghi-chu-hop.pdf
```

Nếu chỉ gõ `/reverse-doc` không kèm gì, hệ thống sẽ hỏi bạn nguồn nằm ở đâu — đây là **câu hỏi duy nhất về nghiệp vụ** nó hỏi bạn trong lúc xử lý (xem Mục 4). Ở cuối, nó vẫn dừng lại để bạn đồng ý ghi file và hỏi bạn có muốn xử lý các câu hỏi mở ngay không — nhưng đó là chuyện sau khi tài liệu đã dựng xong, không phải ngắt bạn giữa chừng.

Sau khi có bộ tài liệu tái lập, bạn thường làm hai việc. Muốn đọc kết quả trên một trang, chạy `/reverse-preview {tên tính năng}`. Rà xong các nhãn và chỗ còn thiếu, chạy `/srs` để biến nó thành đặc tả chính thức.

***

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quan trọng nhất cần nhớ: **hệ thống chạy một mạch, không dừng lại hỏi bạn về nghiệp vụ giữa chừng.** Mọi chỗ chưa rõ, nó tự ghi thành câu hỏi mở thay vì hỏi bạn. Nó chỉ dừng để bạn tham gia ở cuối: xem trước rồi đồng ý cho ghi file (Bước 5), và sau khi ghi xong thì hỏi bạn có muốn giải quyết các câu hỏi mở ngay không — bạn có thể bỏ qua (Bước 6). Nếu có nhiều tính năng, giữa các đợt viết nó cũng cho bạn dừng hoặc đi tiếp. Tất cả những điểm dừng này là để bạn kiểm soát tiến độ, không phải để tra hỏi bạn về nghiệp vụ.

```
 BẠN GÕ LỆNH
 /reverse-doc <đường dẫn nguồn>
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Thu nhận và đọc nguồn                        │
 │  Hệ thống tìm mọi file trong nguồn (Word, PDF, ghi   │
 │  chú, ảnh...). File Word/Excel/PowerPoint được        │
 │  chuyển sang dạng đọc được trước. Nếu không đọc       │
 │  được file nào thì dừng và báo rõ.                    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Gom thành các tính năng                      │
 │  Hệ thống đọc hết nội dung, gom những phần liên quan  │
 │  về cùng một tính năng, đặt tên cho mỗi tính năng.    │
 │  Nó cũng đối chiếu với tài liệu chính thức đang có    │
 │  để biết tính năng nào đã tồn tại (sẽ so khác biệt).  │
 │  In ra bảng chia tính năng cho bạn thấy.              │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Viết bộ tài liệu cho từng tính năng          │
 │  Với mỗi tính năng, hệ thống viết một bộ đặc tả đầy   │
 │  đủ: yêu cầu chức năng, quy tắc, lỗi, sơ đồ luồng,    │
 │  trạng thái, dữ liệu, use case. Mỗi câu đều gắn nhãn  │
 │  độ tin cậy và ghi rõ lấy từ nguồn nào.               │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Rà lại ngược về nguồn                        │
 │  Một lượt kiểm tra độc lập: từng câu trong tài liệu   │
 │  có thật sự truy được về nguồn không? Câu nào không   │
 │  neo được nguồn thì bị hạ độ tin cậy hoặc bỏ.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Xem trước rồi ghi                            │
 │  Hệ thống trình bày sẽ tạo những file gì, mỗi tính    │
 │  năng có bao nhiêu điểm chắc chắn / suy đoán / cần    │
 │  xác nhận. Bạn gõ Y để đồng ý thì nó mới ghi.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Xử lý câu hỏi mở, tổng kết, chỉ đường        │
 │  Hệ thống hỏi bạn có muốn giải quyết ngay các câu     │
 │  hỏi mở không (bạn có thể bỏ qua, để sau). Rồi kiểm   │
 │  tra mọi file đã ghi đủ, báo cáo số tính năng, số     │
 │  câu hỏi mở còn treo, và gợi ý bước tiếp theo.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có một bộ tài liệu đặc tả có cấu trúc,
     kèm danh sách rõ ràng những chỗ cần xác nhận
```

***

## 3. Kết quả bạn nhận được trông như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Với mỗi tính năng, hệ thống tạo một thư mục riêng trong `docs/_reverse/{tên-tính-năng}/`, gồm:

| File | Nội dung |
|------|----------|
| `{tên}-reverse-spec.md` | **File chính** — bản đặc tả đầy đủ theo 12 mục: phạm vi, người dùng, yêu cầu chức năng, yêu cầu phi chức năng, quy tắc nghiệp vụ, bảng lỗi, tiêu chí thành công, dữ liệu, luồng, màn hình, ràng buộc, câu hỏi mở. Mỗi bảng có cột "Nguồn" và cột "Nhãn". |
| `reverse-sources.md` | **Danh mục nguồn** — liệt kê mọi file đã dùng, ngày tháng, độ tin cậy. Đây là chỗ để truy ngược mỗi câu trong đặc tả về đúng file gốc. |
| `reverse-gaps.md` | **Danh sách chỗ chưa chắc** — mọi câu hỏi mở, chỗ nguồn thiếu, và chỗ hai nguồn nói khác nhau. Đây là chỗ bạn đọc để biết cần xác nhận điều gì. |
| `srs/{tên}-reverse-flows.md` | Sơ đồ luồng nghiệp vụ. Mỗi luồng được vẽ bằng **đủ hai kiểu sơ đồ**: một kiểu cho thấy *ai gọi ai theo thứ tự thời gian*, một kiểu cho thấy *các bước và nhánh rẽ khi gặp lỗi*. Thiếu một trong hai kiểu là hệ thống tự coi như chưa đạt và làm lại — vì mỗi kiểu trả lời một câu hỏi khác nhau. |
| `srs/{tên}-reverse-states.md` | Sơ đồ trạng thái (ví dụ tài khoản đi qua các trạng thái: chưa xác thực → bình thường → tạm khoá). |
| `srs/{tên}-reverse-erd.md` | Sơ đồ dữ liệu (các đối tượng nghiệp vụ và quan hệ giữa chúng). |
| `usecases/uc-{tên}.md` | Use case chi tiết cho từng chức năng chính. |
| `usecases/{tên}-reverse-usecase-index.md` | Danh mục use case + bảng truy vết (use case nào liên quan yêu cầu nào, màn hình nào, lỗi nào). |

Toàn bộ nằm trong thư mục `docs/_reverse/` — **tách riêng** khỏi tài liệu chính thức của dự án, nên nó không bao giờ đè lên hay làm hỏng tài liệu đã có.

***

## 4. Vì sao hệ thống không hỏi lại bạn về nghiệp vụ?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là điểm cần nhớ rõ: **tài liệu bạn đưa vào chính là bằng chứng.** Hệ thống bám vào đó mà viết, và nó **không hỏi lại bạn để làm rõ nghiệp vụ** giữa chừng. Về nghiệp vụ, nó chỉ hỏi đúng một câu ở đầu — "nguồn của bạn nằm ở đâu?" — khi bạn chưa chỉ ra đường dẫn. (Những lần dừng khác — đồng ý ghi file, xử lý câu hỏi mở sau khi ghi, dừng/tiếp giữa các đợt — là để bạn kiểm soát tiến độ, không phải hỏi bạn về nghiệp vụ.)

Vậy những chỗ chưa rõ thì sao? Thay vì dừng lại hỏi bạn, hệ thống **ghi lại thành câu hỏi mở** trong file `reverse-gaps.md`. Mọi chỗ nguồn thiếu số liệu, mọi chỗ mơ hồ, mọi chỗ hai nguồn mâu thuẫn nhau — tất cả đều rơi vào đó. Bạn đọc file này một lượt để biết chính xác cần xác nhận hay bổ sung điều gì.

Cách làm này giúp bạn không bị ngắt quãng bởi hàng loạt câu hỏi trong lúc hệ thống đang xử lý một đống tài liệu. Bạn để nó chạy, rồi nhận về hai thứ cùng lúc: bản đặc tả và danh sách những điều còn phải chốt.

***

## 5. Nhãn độ tin cậy — ✅ 🔵 🟡 nghĩa là gì?

Vì tài liệu cũ thường không đầy đủ, hệ thống không viết mọi câu bằng cùng một giọng chắc nịch. Mỗi mệnh đề trong tài liệu mang một trong ba nhãn:

| Nhãn | Ý nghĩa |
|------|---------|
| ✅ **chắc chắn** | Nguồn ghi rõ điều này. Ví dụ: nguồn viết "khoá tài khoản 30 phút" thì con số 30 phút được đánh ✅. |
| 🔵 **suy đoán** | Hệ thống suy ra để nối mạch nghiệp vụ, và có từ hai nguồn trở lên hậu thuẫn. |
| 🟡 **cần xác nhận** | Chưa chắc — hoặc chỉ suy từ đúng một nguồn, hoặc nguồn không nói gì cả. |

Cột "Nguồn" đi kèm mỗi bảng cho biết câu đó lấy từ file nào (ví dụ `S1`, `S2` — mã số của từng nguồn). Nếu một câu không truy được về nguồn nào, nó không bao giờ được đánh ✅.

Nguyên tắc quan trọng nhất: **hệ thống không bịa.** Nếu nguồn không nêu một con số hay một câu thông báo, hệ thống để trống và đánh dấu "cần bổ sung" — chứ không tự nghĩ ra một con số nghe hợp lý. Chẳng hạn, nếu tài liệu cũ không nói mật khẩu cần dài bao nhiêu ký tự, hệ thống ghi rõ "nguồn không nêu" và đưa thành câu hỏi mở, thay vì tự chế ra "8 ký tự".‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

***

## 6. Hệ thống xử lý ảnh chụp màn hình như thế nào?

Ảnh chụp màn hình là nguồn đặc biệt: nó cho thấy giao diện, nhưng không cho thấy quy tắc đằng sau.

Vì vậy khi đọc ảnh, hệ thống chỉ đánh ✅ cho những gì **nhìn thấy trực tiếp** — nhãn ô nhập, tên nút, thứ tự các màn. Còn những gì **đằng sau giao diện** — như "nút này bấm vào thì kiểm tra gì", "trường này bắt buộc hay không", "điều kiện nào thì hiện lỗi" — thì hệ thống chỉ đánh 🟡 (cần xác nhận), vì một tấm ảnh tĩnh không đủ để khẳng định các quy tắc đó.

Nói cách khác, hệ thống không nhìn một cái nút rồi tự tin bịa ra cả một quy tắc nghiệp vụ phía sau nó.

***

## 7. Khi tài liệu cũ mâu thuẫn nhau thì sao?

Chuyện rất thường gặp: bản mô tả năm 2024 nói "khoá 30 phút", nhưng tài liệu chính thức hiện tại của dự án nói "khoá 24 giờ". Hai con số chọi nhau.

Hệ thống **không tự chọn bên nào**. Nó ghi lại **cả hai**, đánh dấu đây là điểm mâu thuẫn (nhãn 🟡), và đưa vào mục "Mâu thuẫn" trong file `reverse-gaps.md` kèm ghi chú (nguồn nào cũ hơn, độ tin cậy ra sao). Việc quyết định con số nào đúng được để lại cho bạn — thường qua bước tạo yêu cầu thay đổi (`/cr`).

Ngoài ra, nếu một tính năng bạn đang tái lập trùng với một tính năng đã có tài liệu chính thức, hệ thống thêm hẳn một bảng "Khác biệt" ở đầu file đặc tả, liệt kê từng điểm mà bản tái lập nói khác với bản chính thức. Nhờ vậy bạn thấy ngay chỗ nào cần đối chiếu, mà tài liệu chính thức vẫn không bị đụng tới.

***

## 8. Vì sao chia việc theo từng tính năng, mỗi tính năng viết riêng?

Một đống tài liệu cũ thường trộn lẫn nhiều tính năng vào nhau: cùng một file Word có thể nói cả đăng nhập, quên mật khẩu, lẫn quản lý hồ sơ.

Hệ thống tách chúng ra: gom mỗi nhóm nội dung xoay quanh một mục tiêu của người dùng thành một tính năng riêng, đặt tên, rồi viết bộ tài liệu riêng cho từng cái. Trong lúc gom, nó đối chiếu với các tính năng đã có trong dự án để nhận ra "cái này thực ra trùng nghiệp vụ với tính năng đã có" — kể cả khi tên gọi khác nhau.

Việc viết từng tính năng cũng đi theo từng đợt (vài tính năng một đợt), và có ghi lại tiến độ. Nếu quá trình bị dừng giữa chừng, lần chạy sau có thể bỏ qua những tính năng đã viết xong và làm tiếp phần còn lại.

***

## 9. Vì sao dừng ở đây rồi chuyển sang `/srs`?

`/reverse-doc` viết ra một bộ tài liệu **đầy đủ về hình thức nhưng chưa được duyệt**. Mọi câu vẫn mang nhãn độ tin cậy, và trạng thái luôn là "bản nháp" — không bao giờ tự đóng dấu "đã duyệt".

Sau khi có bộ tài liệu này, bước tiếp là chạy `/srs` cho tính năng đó. Lúc ấy `/srs` đọc bản tái lập như một nguồn đầu vào, và cùng bạn xác nhận từng chỗ còn 🟡 hay còn để trống — biến bản nháp có nhãn thành đặc tả chính thức.

Đây là lý do `/reverse-doc` không tự động chạy tiếp `/srs`: nó giữ lại các nhãn độ tin cậy để bạn nhìn thấy đâu là điều chắc chắn, đâu là điều cần kiểm tra, trước khi đóng dấu chính thức.

Vị trí của `/reverse-doc` trong dây chuyền:

```
 Tài liệu cũ lộn xộn (Word / PDF / ảnh / ghi chú)
        │
        ▼
   /reverse-doc  →  bộ SRS tái lập (có nhãn, chưa duyệt)
        │
        ▼
      /srs  →  đặc tả chính thức đã xác nhận
        │
        ▼
   /gap, /cr  →  đối chiếu và xử lý khác biệt với tài liệu đã có
```

***

## 10. Những gì `/reverse-doc` không làm

Để giữ đúng phạm vi, có vài thứ hệ thống **cố ý không tạo**:

- **Không vẽ wireframe hay prototype** — nó chỉ tóm tắt màn hình bằng chữ. Muốn wireframe thì chạy `/wireframe-ascii` riêng sau.
- **Không viết tài liệu tích hợp API.**
- **Không viết user story.**
- **Không đụng tới tài liệu nguồn** — nguồn chỉ được đọc, không bị sửa hay xoá. Mọi thứ hệ thống viết ra đều nằm trong thư mục làm việc của bạn, không ghi ngược vào nơi chứa tài liệu gốc.
- **Không hỏi câu lập trình** — nó mô tả nghiệp vụ bằng ngôn ngữ dễ hiểu (người dùng làm gì, kết quả ra sao), không đi vào tên bảng dữ liệu, cách mã hoá, hay công nghệ.

***

## Ví dụ thực tế

Anh **Minh** tiếp quản một ứng dụng học tiếng Anh từ một đội cũ. Thứ anh nhận được không phải là tài liệu đặc tả gọn gàng, mà là một thư mục gồm: một file mô tả đăng nhập từ 2024, một file mô tả chi tiết hơn từ 2025, và vài ảnh chụp màn hình. Anh muốn dựng lại một bản đặc tả tử tế để đội mới hiểu hệ thống đang chạy thế nào.

Anh gõ:

```
/reverse-doc ./ban-giao-dang-nhap
```

Hệ thống đọc cả ba nguồn, nhận ra chúng đều nói về **đăng nhập**, và gom lại thành một tính năng `student-login`. Nó cũng nhận ra tính năng này trùng nghiệp vụ với phần xác thực đã có trong dự án, nên đánh dấu để đối chiếu.

Sau đó nó viết bộ tài liệu. Bản mô tả 2025 rất chi tiết, nên hệ thống bóc ra được nhiều yêu cầu chức năng: đăng nhập bằng email và mật khẩu, kiểm tra định dạng email ngay tại giao diện, chặn tài khoản chưa xác thực email, khoá tài khoản sau 5 lần sai, ghi nhớ đăng nhập 30 ngày, cho đăng nhập nhiều thiết bị, và không tính lỗi mạng vào số lần sai. Mỗi câu thông báo lỗi được ghi đúng nguyên văn từ nguồn.

Có mấy chỗ hệ thống không bịa. Nguồn cũ nói khoá tài khoản **30 phút**, nhưng tài liệu chính thức của dự án nói **24 giờ** — hệ thống ghi cả hai vào bảng "Khác biệt" và mục "Mâu thuẫn", để anh Minh tự quyết. Nguồn nhắc "đang cân nhắc đăng nhập bằng Google, chưa quyết" — hệ thống không đưa Google vào yêu cầu chính, mà để thành câu hỏi mở. Nguồn không nói gì về độ dài mật khẩu — hệ thống để trống và ghi "cần bổ sung" thay vì tự chế ra một con số.

Ngoài file đặc tả chính, hệ thống còn vẽ sơ đồ luồng (đăng nhập thành công, đăng nhập sai rồi bị khoá, tài khoản chưa xác thực, lỗi mạng), sơ đồ trạng thái tài khoản, sơ đồ dữ liệu, và một use case đăng nhập chi tiết.

Cuối cùng hệ thống cho anh Minh xem trước: sẽ tạo 8 file, tính năng `student-login` có 18 điểm chắc chắn, 7 điểm suy đoán, 14 điểm cần xác nhận, cùng 8 câu hỏi mở. Anh Minh gõ `Y`, hệ thống ghi file.

Anh Minh mở file `reverse-gaps.md` và thấy ngay danh sách 8 điều cần chốt — con số khoá tài khoản, chuyện Google, chính sách mật khẩu... Anh không phải đọc lại cả đống tài liệu cũ để tìm ra những chỗ mập mờ; hệ thống đã gom sẵn. Với bộ tài liệu này, anh có thể chạy tiếp `/srs student-login` để cùng hệ thống chốt từng điểm còn treo và biến nó thành đặc tả chính thức.

***

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (các bước xử lý nguồn, cấu trúc bộ tài liệu, quy tắc gắn nhãn và truy vết nguồn, cách rà lại ngược, các trường hợp đặc biệt), đọc file gốc: `.claude/skills/reverse-doc/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
