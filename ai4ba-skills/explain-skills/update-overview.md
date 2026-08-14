---
type: skill-explainer
skill: update-overview
updated: 2026-08-01
---

# `/update-overview` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/update-overview` là lệnh dùng để quản lý **những thông tin chung cho toàn bộ dự án** — thứ không thuộc riêng một tính năng nào.

Hãy hình dung mỗi tính năng là một phòng riêng: phòng học từ vựng, phòng luyện nghe, phòng theo dõi tiến độ... Mỗi phòng có tài liệu riêng, nhưng cả tòa nhà vẫn cần một cuốn sổ chung để thống nhất:

* "Learner" nghĩa là ai?
* Dự án chạy trên iOS, Android hay Web?
* Ngày tháng và tiền tệ hiển thị theo kiểu nào?
* Các tính năng liên hệ với nhau ra sao?
* Màn hình đang tải hay thông báo lỗi dùng mẫu nào?

Những thông tin như vậy được lưu trong 6 file dùng chung tại `docs/_shared/`, và `/update-overview` chính là lệnh giúp bạn bổ sung hoặc làm mới các file đó.

Bạn nên dùng lệnh này khi:

* Có một thuật ngữ nghiệp vụ mới cần thống nhất cho cả dự án (ví dụ vừa đặt ra khái niệm "Streak").
* Dự án hỗ trợ thêm nền tảng, thiết bị, ngôn ngữ hoặc khu vực.
* Cần bổ sung quy ước chung về cách viết, đặt tên hoặc hiển thị thông tin.
* Muốn dựng lại bản đồ tổng thể của hệ thống sau khi có thêm tính năng.
* Thấy nhiều màn hình đang dùng chung một mẫu và muốn ghi lại để tái sử dụng.
* Muốn quét các tài liệu tính năng để gom những thông tin chung còn nằm rải rác.

### Các cách gõ lệnh‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nếu chưa biết nên cập nhật phần nào, gõ trơn:

```
/update-overview
```

Hệ thống sẽ liệt kê 6 loại tài liệu dùng chung, cho biết file nào đã có và file nào chưa có, rồi hỏi bạn chọn loại nào.

Nếu muốn tự thêm một thuật ngữ:

```
/update-overview definitions
```

Mặc định hệ thống hiểu đây là chế độ "add" (thêm) và hỏi bạn muốn thêm thuật ngữ gì.

Nếu muốn hệ thống tự đi quét các tài liệu tính năng để gợi ý thuật ngữ:

```
/update-overview definitions --extract
```

Nếu muốn dựng lại bản đồ tổng thể của hệ thống:

```
/update-overview system
```

Bạn cũng có thể nói thẳng yêu cầu trong cùng một câu, không cần gõ theo cú pháp cứng:

```
/update-overview definitions, thêm term Learner
```

Khi yêu cầu đã rõ như vậy, hệ thống dùng luôn nội dung bạn đưa, không hỏi lại "Bạn muốn thêm thuật ngữ nào?".

---

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quan trọng nhất cần nhớ: `/update-overview` **luôn cho bạn xem trước khi ghi**. Nếu tạo file mới, bạn được xem kế hoạch (L1). Nếu sửa file đã có, bạn được xem rõ phần "trước / sau" (L2). Không có chuyện nó tự ghi rồi mới báo.

Luồng chạy tách làm hai nhánh tùy file đã tồn tại hay chưa:

```
 BẠN GÕ LỆNH
 /update-overview [target] [che-do]
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Chọn đúng "ngăn hồ sơ" (target)         │
 │  Hệ thống đọc yêu cầu, xác định 1 trong 6 loại tài    │
 │  liệu dùng chung.                                     │
 │  Gõ trơn không tham số → liệt kê 6 loại + trạng thái  │
 │  (đã có file / chưa) rồi hỏi bạn chọn.                │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Kiểm tra file đã tồn tại chưa?          │
 └──────────────────────────────────────────────────────┘
        │
        ├─── FILE CHƯA CÓ ────────────────┐
        │                                 ▼
        │                  ┌──────────────────────────────────┐
        │                  │ L1 — xem kế hoạch tạo file mới    │
        │                  │  "Sẽ tạo file rỗng có khung sẵn"  │
        │                  │  Bạn gõ Y → tạo file khung.       │
        │                  └──────────────────────────────────┘
        │                                 │
        ▼                                 │
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Thu thập nội dung (tùy chế độ)          │
 │  • ADD (tự nhập): hỏi bạn nội dung mới + kiểm tra      │
 │    trùng với cái đã có.                               │
 │  • EXTRACT (tự quét): quét tài liệu tính năng, lập     │
 │    bảng gợi ý để bạn tick chọn cái nào muốn lấy.      │
 │  • REGEN (chỉ cho "system"): tự dựng lại bản đồ tính  │
 │    năng + tích hợp, hỏi bạn chọn kiểu vẽ sơ đồ, cho   │
 │    xem trước các phần rồi bạn chỉnh chữ nếu cần.      │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — L2: xem "trước / sau" rồi mới ghi        │
 │  Khi sửa file đã có, hệ thống cho bạn xem chính xác    │
 │  dòng nào được thêm / thay (giống track changes Word).│
 │  Bạn gõ Y → nội dung mới mới thật sự được ghi.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Ghi nhật ký + nhắc trạng thái           │
 │  Ghi lại việc vừa làm vào nhật ký hoạt động chung,     │
 │  cập nhật ngày chỉnh sửa. Nếu file còn "nháp" mà đã    │
 │  sửa từ 3 lần trở lên → gợi ý đưa đi xem xét.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 6 — Báo cáo kết quả                         │
 │  Đã cập nhật file gì, thêm bao nhiêu mục, tổng cộng    │
 │  bao nhiêu, gợi ý bước tiếp theo.                     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT
```

> Lưu ý về thứ tự: với chế độ tự nhập (add) và tự quét (extract), **nội dung được chuẩn bị TRƯỚC** (bạn nhập, hoặc bạn tick chọn từ bảng gợi ý), sau đó mới tới bước xem "trước / sau" (L2) rồi ghi. Còn lớp xem kế hoạch L1 chỉ xuất hiện khi cần **tạo file mới** — để bạn đồng ý dựng khung file trước đã.

---

## 3. "Tài liệu dùng chung cấp dự án" nghĩa là gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Hãy tưởng tượng một công ty có nhiều phòng ban. Mỗi phòng có sổ công việc riêng, nhưng toàn công ty vẫn cần một cuốn sổ quy định chung: tên chức danh, cách viết ngày tháng, mẫu thông báo, những nguyên tắc ai cũng phải theo.

Các file trong `docs/_shared/` chính là cuốn sổ chung đó.

Ví dụ, nếu "Learner" đã được định nghĩa là người đang học trong hệ thống, thì mọi tài liệu tính năng nên gọi cùng một tên và hiểu cùng một nghĩa. Không thể để tính năng luyện nghe gọi là "Student", còn tính năng học từ vựng lại gọi là "User", trong khi cả hai đang nói về cùng một người.

Điểm khác biệt cốt lõi:

* Tài liệu trong từng thư mục tính năng **chỉ mô tả tính năng đó**.
* Tài liệu trong `docs/_shared/` **áp dụng cho toàn bộ dự án**.

Vì thế các file dùng chung **không gắn nhãn tính năng (feature)**. Chúng không thuộc riêng tính năng đăng nhập, luyện nghe hay học từ vựng — mà là của chung.

---

## 4. Sáu loại file dùng chung chứa những gì?

Có thể hình dung `docs/_shared/` như một tủ hồ sơ 6 ngăn:

| Ngăn (target) | File | Chứa gì | Ví dụ dễ hình dung |
|---|---|---|---|
| `definitions` | `definitions.md` | Từ điển thuật ngữ nghiệp vụ dùng chung | Learner, Lesson, Streak, XP, CEFR |
| `env` | `operating-environment.md` | Môi trường sản phẩm cần hoạt động | iOS, Android, Web, thiết bị, trình duyệt, khu vực, ngôn ngữ, phạm vi PDPA |
| `conventions` | `conventions.md` | Quy ước chung về cách trình bày và gọi tên | Giọng văn, cách format, đặt tên, hiển thị ngày / tiền / thông báo lỗi |
| `system` | `system-overview.md` | Bức tranh tổng thể của hệ thống | Kiến trúc tổng thể, bản đồ tính năng, tích hợp bên ngoài, luồng dữ liệu |
| `patterns` | `screen-patterns.md` | Những mẫu màn hình dùng lại ở nhiều nơi | Header, màn hình rỗng, đang tải, toast lỗi, bố cục form |
| `profile` | `project-profile.md` | Bối cảnh dự án tích lũy — kho "hỏi 1 lần, mọi lệnh dùng lại" | Lĩnh vực sản phẩm, cách gọi người dùng cuối, đối thủ, thị trường, quy định pháp lý |

### `definitions` — cuốn từ điển chung

Giúp mọi người gọi cùng một sự vật bằng cùng một tên. Nếu "Streak" nghĩa là chuỗi ngày học liên tục, định nghĩa đó nên ghi một lần ở đây, thay vì mỗi tính năng tự giải thích một kiểu.

### `env` — nơi sản phẩm sẽ hoạt động

Ghi lại các điều kiện chung: chạy trên iOS / Android / Web, thiết bị và trình duyệt cần hỗ trợ, khu vực và ngôn ngữ, phạm vi tuân thủ pháp lý (chẳng hạn PDPA). Giống danh sách "địa điểm và điều kiện hoạt động" của sản phẩm.

### `conventions` — bộ quy ước dùng chung

Giúp các tài liệu và màn hình không "mỗi nơi một kiểu": giọng văn thân thiện hay trang trọng, ngày tháng hiển thị theo định dạng nào, tiền tệ viết ra sao, thông báo lỗi theo quy ước nào.

### `system` — bản đồ toàn cảnh

Giống tấm bản đồ treo ở lối vào một khu lớn: dự án có những tính năng nào, các phần chính liên hệ ra sao, có kết nối với bên ngoài không, dữ liệu đi qua các phần như thế nào. Đây là ngăn **duy nhất** có chế độ dựng lại toàn bộ (xem Mục 6).

### `patterns` — sổ mẫu màn hình

Ghi lại những cách bố trí hoặc trạng thái màn hình được dùng đi dùng lại (header, màn hình chưa có dữ liệu, trạng thái đang tải, thông báo lỗi dạng toast, cách bố trí form) — để các tính năng không phải nghĩ lại cùng một mẫu từ đầu.

### `profile` — hồ sơ dự án (ngăn hoạt động khác 5 ngăn kia)

Đây là kho lưu những câu **chỉ cần trả lời một lần cho cả dự án**: sản phẩm thuộc lĩnh vực gì, người dùng cuối được gọi là gì (học viên / khách hàng / tài xế / bệnh nhân...), đối thủ là ai, thị trường nào, phải tuân quy định pháp lý nào.

Điểm khác biệt quan trọng: **bạn thường không cần tự điền ngăn này.** Năm ngăn kia chờ bạn chủ động thêm vào, còn hồ sơ dự án **tự đầy lên trong lúc bạn dùng các lệnh khác**. Khi `/prd`, `/urd`, `/brd`, `/discover`, `/srs`... cần một thông tin cấp dự án mà hồ sơ chưa có, chúng hỏi bạn ngay tại chỗ rồi xin phép ghi vào đây — để lần sau không lệnh nào phải hỏi lại nữa.

Vì vậy hồ sơ **bắt đầu rỗng và đầy dần**, không phải bản khai bắt bạn điền trước khi làm gì. Target `profile` của `/update-overview` chỉ dùng khi bạn muốn **chủ động xem lại hoặc sửa** những gì đã tích lũy (ví dụ đối thủ mới xuất hiện, hoặc đổi cách gọi người dùng) thay vì đợi lệnh khác hỏi.

---

## 5. Hai cách đưa thông tin vào: tự thêm và tự quét

`/update-overview` có hai cách bổ sung nội dung.

### Cách 1 — Tự nhập (chế độ `add`)

Giống như bạn tự tay ghi thêm một mục vào sổ tay.

```
/update-overview definitions, thêm term Learner
```

Hệ thống sẽ:

1) Đọc file hiện tại.
2) Nhận nội dung mới từ bạn.
3) Kiểm tra xem mục đó đã có chưa.
4) Cho bạn xem phần thay đổi "trước / sau".
5) Chỉ ghi sau khi bạn gõ Y.

Nếu thuật ngữ đã tồn tại, hệ thống **không âm thầm thêm bản thứ hai**. Nó cảnh báo và hỏi bạn muốn: thay nội dung cũ / bỏ qua / thêm một biến thể. Cách `add` hợp khi bạn đã biết rõ mình muốn bổ sung điều gì.

### Cách 2 — Tự quét (chế độ `extract`)

Giống như nhờ một người đi qua các phòng, nhặt những ghi chú chung đang nằm rải rác rồi mang về cho bạn duyệt.

```
/update-overview definitions --extract
```

Mỗi ngăn hồ sơ sẽ được quét từ đúng nguồn phù hợp với nó — hệ thống không quét bừa mọi tài liệu:

* `definitions` — quét các tài liệu yêu cầu (URD, BRD, PRD, SRS) để nhặt thuật ngữ hay lặp lại.
* `env` — quét phần ràng buộc / giả định trong BRD và PRD (nền tảng, khu vực, ngôn ngữ, tuân thủ).
* `conventions` — quét các tài liệu, đặc biệt là màn hình, để bắt cách hiển thị ngày / tiền / thông báo lỗi.
* `system` — quét đặc tả (SRS) và PRD để lấy danh sách tính năng + tích hợp bên ngoài.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
* `patterns` — quét các file wireframe để tìm khối bố cục lặp lại (header, footer, màn rỗng, toast).

Sau khi quét, hệ thống dựng một bảng gợi ý, ví dụ:

| Thuật ngữ | Xuất hiện ở tính năng nào | Xem trước định nghĩa |
|---|---|---|
| Learner | onboarding, lesson | Người đang tham gia học trong hệ thống |
| Streak | lesson, progress | Chuỗi ngày học liên tục |
| XP | lesson, rewards | Điểm kinh nghiệm của người học |

Đây mới chỉ là **danh sách đề xuất**, chưa phải nội dung được ghi. Bạn tick chọn bằng cách trả lời `1,3,5` (chọn vài mục), `all` (chọn tất cả) hoặc `none` (không chọn gì).

Với từng mục đã chọn, hệ thống cho bạn xem đoạn ngữ cảnh nó trích ra; bạn xác nhận hoặc sửa lại. Cuối cùng toàn bộ được gộp thành **một lần xem "trước / sau"** để bạn duyệt một thể.

Những mục **đã có sẵn trong file sẽ bị loại khỏi danh sách** — hệ thống không đề xuất lại cái trùng, để bạn khỏi phải bỏ tick từng cái đã có.

---

## 6. Vì sao `system` có chế độ dựng lại riêng?

Các file như `definitions.md` thường được bổ sung **từng mục một**. Ngược lại, `system-overview.md` là một **bức tranh tổng thể**: khi dự án thêm hoặc bớt tính năng, cả bức tranh có thể cần vẽ lại cho khớp hiện trạng.

Vì vậy khi bạn gõ `/update-overview system` **mà không kèm mục cụ thể và không kèm `--extract`**, hệ thống hiểu là bạn muốn **dựng lại** (chế độ `regen`). (Còn nếu bạn nói rõ mục muốn thêm thì đó là tự nhập; nếu kèm `--extract` thì đó là tự quét — `system` vẫn dùng được cả ba cách.)

Trong chế độ dựng lại, hệ thống:

* Quét các thư mục tính năng, đọc phần thông tin đầu mỗi tài liệu.
* Dựng lại bản đồ tính năng.
* Dựng danh sách những tích hợp bên ngoài.
* Hỏi bạn chọn kiểu vẽ cho sơ đồ kiến trúc (xem Mục 7).
* **Cho bạn xem trước các phần** và chỉnh lại chữ nếu cần, rồi mới tới bước xem "trước / sau" cho toàn file.

Giống việc vẽ lại bản đồ khu phố sau khi mọc thêm nhiều con đường mới: sửa từng nét nhỏ đôi khi rối hơn là dựng lại một bản mới — nhưng bản mới vẫn phải được bạn xem và đồng ý trước khi dùng.

---

## 7. Mermaid và D2: hai cách thể hiện sơ đồ kiến trúc

Khi dựng lại `system-overview.md`, ở phần sơ đồ kiến trúc hệ thống, hệ thống **hỏi bạn muốn vẽ theo cách nào** — nó không tự chọn, vì đây là một quyết định về cách trình bày.

### Nhánh A — Mermaid đặt ngay trong file (mặc định đề xuất)

Sơ đồ được viết thẳng vào file tài liệu. Mở file trên GitHub hoặc Obsidian là thấy hình ngay, không cần cài gì thêm. Hợp khi bạn muốn mở tài liệu ra tham chiếu nhanh và giữ mọi thứ nằm gọn trong một file.

### Nhánh B — D2 tạo thành ảnh riêng

Hệ thống tự viết phần mô tả sơ đồ (một file nguồn `.d2`) rồi tạo ra một ảnh `.svg` riêng, sau đó nhúng ảnh đó vào tài liệu. Hợp khi sơ đồ có **nhiều khối lồng nhau** và bạn muốn các khối được sắp gọn hơn. Đổi lại, cách này cần công cụ D2 được cài sẵn và sinh thêm một file ảnh (cùng file nguồn) để quản lý.

**Không có cách nào "đẹp hơn" trong mọi trường hợp** — chỉ khác nhau về đánh đổi:

* Mermaid: mở file là thấy sơ đồ ngay, nhẹ, mọi thứ trong một file.
* D2: sắp xếp nhiều khối lồng nhau gọn hơn, đổi lại phải cài công cụ và quản lý thêm ảnh riêng.

Chọn theo nhu cầu đọc, không theo "đẹp". Nếu D2 chưa cài, hoặc vẽ hỏng hai lần, hệ thống **tự quay về Mermaid** để không chặn cả quá trình. Và nếu phần sơ đồ này **đã có sẵn** (đang là Mermaid hay D2) mà bạn không yêu cầu đổi, hệ thống giữ nguyên kiểu cũ, không hỏi lại cho phiền.

---

## 8. Hai lớp xem trước bảo vệ bạn thế nào?

`/update-overview` có hai lớp xác nhận: L1 và L2.

### L1 — xem kế hoạch trước khi ghi

L1 cho bạn biết: file nào sẽ được tạo hoặc cập nhật, hành động dự kiến là gì, nội dung ở mức tổng quát. Hệ thống chờ bạn gõ Y hoặc n. Giống phiếu yêu cầu sửa chữa: trước khi thợ bắt tay, bạn được biết họ sẽ sửa phòng nào, làm việc gì.

Nếu file chưa có, L1 nói rõ hệ thống dự định tạo file mới với khung các phần cần thiết. Nhưng hệ thống **không được tạo một file dùng chung chỉ có khung rỗng hoặc toàn chữ "TBD"** — một cuốn sổ trống mà treo biển "Nội quy chung" chỉ khiến người ta tưởng phần đó đã xong, trong khi thực tế chưa có gì để dùng.

### L2 — xem chính xác "trước / sau" khi sửa

Khi cập nhật một file đã có, L2 cho bạn xem nội dung hiện tại, nội dung đề xuất, và phần nào sẽ được thêm / thay. Chỉ khi bạn gõ Y, thay đổi mới được ghi.

Giống chế độ theo dõi thay đổi trong Word: bạn không chỉ nghe câu "tôi sẽ cập nhật từ điển", mà thấy rõ dòng nào được thêm hoặc sửa. Với chế độ tự quét, các mục bạn chọn được gộp vào một bản "trước / sau" duy nhất; với chế độ dựng lại của `system`, bạn xem thay đổi của cả file trước khi xác nhận.

---

## 9. Vì sao hệ thống không hỏi sâu về kỹ thuật?

`/update-overview` được thiết kế theo cách nhìn của một IT BA: tập trung vào bức tranh nghiệp vụ, phạm vi hoạt động, quy ước chung và cách các phần chính liên hệ với nhau.

Vì vậy nó **không hỏi** những câu như:

* "Dùng PostgreSQL hay MySQL?"
* "SDK phiên bản nào?"
* "Endpoint đặt tên ra sao?"
* "Bảng dữ liệu gồm những cột nào?"

Những câu đó thuộc mức đặc tả kỹ thuật chi tiết — là việc của `/srs`. Một cách dễ hình dung:

* `/update-overview` mô tả tòa nhà có những khu nào, lối đi chính ở đâu, kết nối với bên ngoài ra sao.
* `/srs` mới đi sâu vào đường ống, ổ điện và kích thước kỹ thuật trong từng khu.

Giữ đúng ranh giới này giúp tài liệu dùng chung dễ đọc với BA, Product Owner và các bên liên quan, thay vì biến thành một bản kỹ thuật quá chi tiết.

---

## 10. Vì sao phải kiểm tra trùng và tránh file rỗng?

Tài liệu dùng chung chỉ có ích khi người đọc tin được rằng mỗi mục ở đó có nghĩa rõ ràng.

Nếu "Learner" xuất hiện ba lần với ba cách giải thích hơi khác nhau, người đọc sẽ không biết bản nào mới là bản nên dùng. Vì thế:

* Chế độ tự nhập (add) cảnh báo khi mục đã tồn tại.
* Chế độ tự quét (extract) loại bỏ sẵn những mục đã có.
* Bạn là người quyết định thay / bỏ qua / thêm biến thể khi cần.

Tương tự, hệ thống không tạo file dùng chung rỗng hoặc toàn "TBD". Một file rỗng giống như treo biển "Nội quy chung" nhưng bên dưới không có nội quy nào — tạo cảm giác việc đã làm xong, trong khi người đọc vẫn không có gì để dùng.

---

## 11. Nhật ký thay đổi và lời nhắc đưa tài liệu đi xem xét

Sau khi ghi thành công, hệ thống cập nhật nhật ký hoạt động chung, cập nhật ngày chỉnh sửa, rồi báo: đã thêm bao nhiêu mục, tổng cộng bao nhiêu, gợi ý bước tiếp theo.

Nếu file vẫn đang ở trạng thái "nháp" (draft) mà đã được cập nhật từ 3 lần trở lên, hệ thống **gợi ý** chuyển sang "đang xem xét" (in-review). Đây chỉ là lời nhắc — hệ thống không tự đổi trạng thái. Nó giống một cuốn tài liệu đã sửa đi sửa lại nhiều lần: có thể nội dung đã đủ chín để mời người khác đọc và góp ý.

---

## Ví dụ thực tế

Chị **Mai** là BA của một sản phẩm học tiếng Anh. Trong các tài liệu tính năng, chị thấy những từ như "Learner", "Lesson", "Streak", "XP" xuất hiện nhiều lần. Chị muốn gom các thuật ngữ dùng chung vào một nơi, nhưng chưa chắc còn thiếu từ nào.

Chị gõ:

```
/update-overview definitions --extract
```

1) Hệ thống xác định ngăn hồ sơ là `definitions`, chế độ là tự quét (extract).

2) Hệ thống kiểm tra `docs/_shared/definitions.md` và thấy file đã có sẵn.

3) Hệ thống quét các tài liệu yêu cầu (URD, BRD, PRD, SRS). Những thuật ngữ **đã có** trong `definitions.md` bị loại, không xuất hiện lại trong danh sách gợi ý.

4) Hệ thống đưa ra bảng gợi ý gồm: Learner, Lesson, Streak, XP, CEFR — mỗi dòng cho biết từ đó xuất hiện ở tính năng nào và kèm phần xem trước định nghĩa.

5) Chị Mai thấy "Lesson" trong tài liệu nguồn mô tả chưa đủ rõ nên chưa muốn đưa vào. Chị chọn:

```
1,3,4,5
```

6) Với từng mục được chọn, hệ thống cho chị xem đoạn ngữ cảnh trích ra. Ở mục "Learner", chị sửa lại câu mô tả cho hợp với ngôn ngữ nghiệp vụ của dự án; các mục còn lại chị xác nhận nguyên.

7) Hệ thống gộp bốn thuật ngữ thành **một bản "trước / sau"** (L2), cho chị Mai xem chính xác `definitions.md` sẽ đổi những gì.

8) Chị Mai kiểm lần cuối rồi gõ Y. Lúc này các thay đổi mới thật sự được ghi.

9) Hệ thống cập nhật nhật ký hoạt động và ngày chỉnh sửa. Vì file vẫn là "nháp" và đây đã là lần cập nhật thứ ba, hệ thống gợi ý chị cân nhắc chuyển tài liệu sang "đang xem xét".

10) Cuối cùng, hệ thống báo: file vừa cập nhật, số thuật ngữ vừa thêm, tổng số thuật ngữ hiện có, và gợi ý bước tiếp theo.

Suốt quá trình, chị Mai luôn là người quyết định thuật ngữ nào được đưa vào từ điển và định nghĩa cuối cùng viết thế nào. Chế độ tự quét chỉ giúp **tìm và đề xuất**, không tự biến mọi thứ nó nhặt được thành quy ước chung.

---

## Xem thêm

Tài liệu này giải thích `/update-overview` theo cách dễ hiểu. Muốn xem đầy đủ quy tắc và từng bước xử lý của skill, đọc file gốc: `.claude/skills/update-overview/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
