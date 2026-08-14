---
type: skill-explainer
skill: userguide
updated: 2026-08-01
---

# `/userguide` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/userguide` là lệnh tạo **cẩm nang hướng dẫn sử dụng / vận hành** cho những người sẽ dùng sản phẩm trong công việc hằng ngày, như giáo viên, admin, CSKH hoặc nhân viên nội bộ.

Nó biến các tài liệu BA vốn khá “khô” thành tài liệu trả lời những câu thực tế hơn:

- Tôi cần bắt đầu từ đâu?
- Muốn tạo, sửa hoặc xử lý một việc thì bấm gì trước?
- Một nút hay trạng thái này có ý nghĩa gì?
- Gặp lỗi thì kiểm tra và xử lý thế nào?
- Một thuật ngữ trong hệ thống nghĩa là gì?

Nói đơn giản: tài liệu BA thường mô tả **hệ thống phải làm gì**; `/userguide` viết ra tài liệu dạy người dùng **phải dùng hệ thống như thế nào**.

Bạn có thể gõ:

```text
/userguide
```

Lệnh này quét toàn bộ sản phẩm để làm một cẩm nang chung.

Hoặc chỉ làm cho một hay nhiều tính năng:

```text
/userguide payment
```

```text
/userguide payment authentication
```

Sau khi đã duyệt mục lục, bạn gõ:

```text
/userguide tiếp
```

để bắt đầu viết cẩm nang chi tiết.

> **Một câu để nhớ:** `/userguide` = “lấy tài liệu BA đã chốt và chuyển thành hướng dẫn để người thật làm được việc thật.”

***

## 2. Cẩm nang được sắp xếp theo những phần nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Một cẩm nang hoàn chỉnh không chỉ là một danh sách nút bấm. Nó được tổ chức thành 6 nhóm nội dung quen thuộc với người vận hành:

1. **Tổng quan / Khái niệm**  
   Giải thích sản phẩm dùng để làm gì, ai dùng và các khái niệm cần hiểu.

2. **Bắt đầu nhanh**  
   Dẫn người mới đi theo một đường đơn giản nhất để làm được việc đầu tiên.

3. **Hướng dẫn theo tác vụ**  
   Các bài hướng dẫn cụ thể như “Tạo lớp học”, “Khóa tài khoản”, “Xuất báo cáo”.

4. **Tra cứu**  
   Các bảng thông tin: trạng thái, quy tắc, giới hạn, ý nghĩa trường dữ liệu.

5. **Xử lý sự cố**  
   Khi gặp lỗi, cần kiểm tra gì và nên làm gì tiếp theo.

6. **FAQ + Thuật ngữ**  
   Các câu hỏi thường gặp và phần giải nghĩa từ chuyên môn.

Cách chia này có một lợi ích rất thực tế: người mới cần “Bắt đầu nhanh”, còn người đang gặp lỗi không phải đọc lại từ đầu mà có thể đi thẳng tới “Xử lý sự cố”.

Mỗi trang cũng được viết để tự đứng vững. Nghĩa là nếu bạn mở thẳng một trang từ kết quả tìm kiếm hoặc đường link đồng nghiệp gửi, trang đó vẫn có đủ bối cảnh tối thiểu để bạn hiểu và thực hiện.

***

## 3. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quan trọng nhất của `/userguide`: **nó có 2 giai đoạn và bắt buộc dừng giữa chừng để bạn duyệt mục lục.**

```text
 BẠN GÕ LỆNH
 /userguide payment
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1a — Đọc nguồn tài liệu                      │
 │  Hệ thống quét các tài liệu BA của tính năng:          │
 │  PRD, BRD, SRS, use case, user flow, wireframe,        │
 │  Error Matrix và bảng thuật ngữ.                       │
 │                                                        │
 │  Sau đó in bảng: feature nào có nguồn gì, thiếu gì.   │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ HỎI PHẠM VI CẨM NANG (trước khi dựng mục lục)          │
 │  - Muốn viết những luồng nào? (hệ thống tự dò rồi      │
 │    hỏi bạn xác nhận đủ/thiếu)                          │
 │  - Nếu đã có cẩm nang: gộp vào hay tách riêng?         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1b — Dựng mục lục                            │
 │  Hệ thống gom nội dung thành các phần: tổng quan,      │
 │  bắt đầu nhanh, hướng dẫn tác vụ, tra cứu, xử lý lỗi,  │
 │  FAQ và thuật ngữ.                                    │
 │                                                        │
 │  Một người rà soát chuyên trách kiểm tra: có thiếu     │
 │  luồng nào không, tiêu đề đã thiên về hành động chưa,  │
 │  một trang có đang trộn quá nhiều loại nội dung không. │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ IN MỤC LỤC RA CHAT                                     │
 │  Mỗi trang có: tên trang, nhóm nội dung, nguồn dùng    │
 │  để viết và các câu hỏi còn cần bạn chốt.              │
 │                                                        │
 │  Ở đây CHƯA tạo file cẩm nang nào.                     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
   ╔════════════════════ HARD STOP ════════════════════╗
   ║                                                    ║
   ║              HỆ THỐNG DỪNG HẲN.                    ║
   ║                                                    ║
   ║  Bạn xem mục lục, trả lời các câu hỏi còn thiếu,    ║
   ║  rồi gõ:                                           ║
   ║                                                    ║
   ║      tiếp / ok / Y                                 ║
   ║                                                    ║
   ║  Chưa có xác nhận → TUYỆT ĐỐI chưa viết cẩm nang.  ║
   ║                                                    ║
   ╚════════════════════════════════════════════════════╝
        │
        │  (chỉ đi tiếp khi bạn xác nhận)
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ HỎI CÁCH VIẾT (ngay sau khi bạn gõ `tiếp`)             │
 │  - Viết bằng ngôn ngữ nào?                             │
 │  - Ai là người đọc cuối?                               │
 │  - Giọng văn / cách xưng hô?                           │
 │  - Ngắn gọn, vừa đủ hay chi tiết sâu?                  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Viết cẩm nang chi tiết                   │
 │  Hệ thống viết từng trang theo mục lục đã duyệt.       │
 │  Thiếu thông tin → đánh dấu TBD / câu hỏi mở,          │
 │  không tự đoán con số, giới hạn hay thông báo lỗi.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ HỎI CÁCH LẤY ẢNH MINH HỌA                              │
 │  A. Tự chụp app / HTML thật                            │
 │  B. Bạn tự chụp, hệ thống để sẵn chỗ và brief          │
 │  C. Dùng wireframe / ASCII đã có                       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ XUẤT CẨM NANG                                          │
 │  1 file HTML để mở trực tiếp                           │
 │  + 1 folder chứa toàn bộ trang, ảnh và dữ liệu phụ.   │
 │                                                        │
 │  Các trang chuyển qua lại bên trong cùng cẩm nang.     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có thể mở đọc ngay hoặc dùng /export
     để đóng gói thành PDF cho người nhận.
```

***

## 4. Vì sao phải có HARD STOP ở giữa?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

HARD STOP là “điểm dừng bắt buộc”. Sau khi dựng mục lục, hệ thống phải in mục lục ra chat và chờ bạn gõ `tiếp`, `ok` hoặc `Y`.

Nó không được tự suy luận rằng “chắc người dùng đồng ý rồi” để bắt đầu viết.

Lý do rất đơn giản: **mục lục quyết định cẩm nang sẽ dạy điều gì và bỏ điều gì**.

Nếu ngay từ đầu hệ thống hiểu sai phạm vi, ví dụ:

- Bạn chỉ muốn hướng dẫn luồng “Giáo viên tạo bài tập”.
- Nhưng hệ thống tự viết luôn cả phần quản lý học viên, thanh toán và báo cáo.
- Hoặc ngược lại, nó bỏ mất bước “Duyệt bài” mà giáo viên cần dùng mỗi ngày.

thì cẩm nang có thể viết rất đẹp nhưng vẫn không hữu ích.

HARD STOP giúp bạn kiểm tra các quyết định quan trọng trước khi tốn công viết chi tiết:

- Luồng nào được đưa vào?
- Luồng nào chưa cần viết?
- Ai là người đọc cuối?
- Ngôn ngữ có đúng không?
- Cẩm nang nên ngắn gọn hay đi sâu?
- Có nên nhập thêm vào cẩm nang cũ không?

Đây giống như việc duyệt mục lục trước khi một người viết bắt đầu làm cả cuốn sổ tay. Sửa tên một chương ở giai đoạn này rất nhanh; sửa lại toàn bộ sau khi đã viết xong thì mất công hơn nhiều.

Một điểm cần lưu ý: ở Giai đoạn 1, hệ thống **không tạo một file mục lục tạm riêng**. Mục lục chỉ hiện trong chat để bạn duyệt. Khi bạn xác nhận đi tiếp, hệ thống mới ghi file index chính thức của cẩm nang, để nếu quá trình viết bị gián đoạn thì tiến độ đã duyệt vẫn được giữ lại.

***

## 5. `/userguide` lấy nội dung từ đâu?

`/userguide` không “tự nghĩ ra” cách dùng phần mềm. Nó đọc ngược từ các tài liệu BA sẵn có để viết lại theo góc nhìn người vận hành.

| Nguồn tài liệu | Được dùng để viết phần nào trong cẩm nang |
|---|---|
| PRD / BRD | Tổng quan, mục tiêu, đối tượng sử dụng, khả năng chính |
| Use case | Hướng dẫn theo tác vụ, từng bước thực hiện |
| User flow | Trình tự thao tác, màn hình nào xuất hiện trước/sau |
| Wireframe ASCII / HTML | Ảnh minh họa, vị trí nút bấm và trường nhập |
| SRS: yêu cầu và quy tắc | Phần tra cứu: trạng thái, quy tắc, giới hạn |
| Error Matrix trong SRS | Phần xử lý sự cố và thông báo lỗi |
| `docs/_shared/definitions.md` | Thuật ngữ dùng chung |

Ví dụ, nếu Use Case ghi “Giáo viên tạo lớp học”, `/userguide` có thể viết bài “Tạo lớp học mới”.

Nếu Error Matrix có mã lỗi về email đã tồn tại, cẩm nang có thể đưa lỗi đó vào mục “Xử lý sự cố khi thêm học viên”.

Nếu nguồn không có một thông tin quan trọng, hệ thống sẽ không bịa ra. Chẳng hạn:

- SRS không nói giới hạn số học viên trong một lớp.
- Không có wording chính thức cho thông báo lỗi.
- Không có màn hình hoặc luồng mô tả bước thao tác.

Khi đó cẩm nang để chỗ cần làm rõ bằng dấu `TBD` hoặc câu hỏi mở. Đây là cách để người đọc sau biết chính xác phần nào chưa có nguồn xác nhận, thay vì vô tình tin vào một con số do AI tự chế.

Nếu câu trả lời mới mâu thuẫn với tài liệu BA hiện có, `/userguide` cũng không tự sửa ngược đặc tả. Cẩm nang là đầu ra của tài liệu BA, không phải nơi âm thầm đổi nghiệp vụ.

***

## 6. Vì sao cẩm nang phải hỏi ngôn ngữ, người đọc và độ chi tiết?

Cùng một sản phẩm, nhưng cẩm nang cho giáo viên sẽ rất khác cẩm nang cho đội CSKH.

Ví dụ:

- Giáo viên cần biết “Tạo lớp”, “Giao bài”, “Xem tiến độ”.
- CSKH cần biết “Tìm tài khoản”, “Kiểm tra trạng thái”, “Hỗ trợ lỗi”.
- Admin nội bộ có thể cần thêm các phần cấu hình và quản lý quyền.

Vì vậy, ngay sau khi bạn gõ `tiếp` để duyệt mục lục (và trước khi viết nội dung chi tiết), skill hỏi bạn 4 quyết định:

1. **Ngôn ngữ viết**  
   Hệ thống có thể gợi ý tiếng Việt hoặc tiếng Anh dựa trên tài liệu nguồn, nhưng không tự chốt cứng. Bạn có thể chọn ngôn ngữ khác nếu cần.

2. **Người đọc cuối**  
   Giáo viên, CSKH-vận hành, học viên cuối hay một nhóm khác.

3. **Giọng văn và cách xưng hô**  
   Thân thiện “bạn”, trung tính “quý vị”, hoặc cách viết phù hợp tổ chức.

4. **Độ chi tiết**  ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
   Bản ngắn để bắt đầu nhanh, bản vừa đủ cho vận hành hằng ngày, hoặc bản sâu hơn có nhiều tình huống và ảnh minh họa.

Thiết kế này đặc biệt quan trọng với đa ngôn ngữ. Không chỉ phần nội dung chính, mà cả tiêu đề điều hướng và nhãn giao diện trong cẩm nang cũng cần dùng cùng ngôn ngữ đã chốt. Nếu không hỏi trước, một cẩm nang có thể bị lẫn tiếng Việt, tiếng Anh và thuật ngữ kỹ thuật, khiến người đọc mất tự tin khi làm theo.

**Danh sách người đọc gợi ý không phải bịa ra.** Trước khi hỏi câu số 2, hệ thống đọc **hồ sơ dự án** (`docs/_shared/project-profile.md`) để biết sản phẩm thuộc lĩnh vực nào và người dùng cuối được gọi là gì. Nhờ đó nó gợi ý đúng nhóm người đọc **của ngành bạn**: dự án đào tạo thì gợi ý giáo viên / học viên / CSKH; sản phẩm bán lẻ thì gợi ý nhân viên bán hàng / khách hàng / quản lý kho; phần mềm bệnh viện thì gợi ý điều dưỡng / bác sĩ / lễ tân — chứ không liệt kê nhóm của một ngành khác rồi bắt bạn tự sửa.

Cách gọi người dùng trong hồ sơ cũng quyết định cách xưng hô ở câu số 3. Hồ sơ chưa có thông tin → hệ thống hỏi bạn rồi xin phép ghi lại (bạn duyệt trước), để các lệnh sau dùng chung mà không hỏi lại.

***

## 7. Ảnh minh họa được lấy như thế nào?

Ảnh rất hữu ích khi hướng dẫn thao tác, nhưng `/userguide` không tự ý truy cập app hay tự cài công cụ để chụp màn hình. Skill sẽ hỏi bạn chọn một trong 3 cách.

### Cách A — Tự chụp app hoặc HTML thật

Nếu bạn cho phép, hệ thống có thể chụp màn hình từ:

- App thật qua URL bạn cung cấp.
- Prototype HTML hoặc wireframe HTML đã có trong dự án.

Ảnh có thể được đánh số, thêm mũi tên, nhãn hoặc khung để chỉ rõ người đọc cần nhìn vào đâu. Ví dụ:

- (1) Nút **Tạo lớp**
- (2) Ô nhập tên lớp
- (3) Nút **Lưu**

Nếu app có email, tên thật hoặc dữ liệu nhạy cảm, hệ thống sẽ hỏi bạn muốn che chúng hay giữ nguyên.

Trước khi dùng cách này, hệ thống cũng kiểm tra công cụ chụp ảnh đã sẵn sàng chưa. Nếu còn thiếu, nó **hỏi bạn có muốn cài không**; không được tự cài âm thầm.

### Cách B — Bạn tự chụp ảnh

Đây là lựa chọn an toàn khi bạn không muốn cấp quyền truy cập app.

Hệ thống vẫn viết đầy đủ phần hướng dẫn bằng chữ, đồng thời để sẵn vị trí ảnh trong cẩm nang. Ngay dưới đó có ghi chú cụ thể cho người chụp:

- Chụp màn hình nào.
- Chụp ở bước nào.
- Cần để trạng thái nào trên màn hình.
- Cần đánh dấu những vùng nào bằng số, mũi tên hoặc khung.

Nhờ vậy, bạn hoặc team thiết kế chỉ cần chụp đúng ảnh rồi thả vào folder `images/`, không phải đoán xem ảnh đó sẽ minh họa cho điều gì.

### Cách C — Dùng wireframe hoặc ASCII có sẵn

Nếu feature đã có wireframe ASCII, HTML wireframe hoặc user flow, `/userguide` có thể dùng lại chúng làm minh họa.

Cách này phù hợp khi app chưa build xong, hoặc bạn chỉ cần cẩm nang để đào tạo sớm trước khi có giao diện thật.

Lý do phải hỏi bạn trước là vì “ảnh đẹp” không quan trọng bằng “ảnh đúng nguồn và đúng quyền truy cập”. Có tổ chức cho phép dùng prototype; có tổ chức chỉ cho dùng ảnh đã được che dữ liệu; cũng có nơi muốn đội vận hành tự kiểm soát toàn bộ screenshot.

***

## 8. Vì sao `/userguide` không chạy nền?

Một số việc có thể được chia nhỏ để chạy song song, nhưng `/userguide` không chạy theo kiểu “làm nền rồi tự hoàn tất”.

Lý do là HARD STOP cần bạn trả lời ngay trong cuộc trò chuyện:

- Chọn luồng nào.
- Chọn gộp hay tách cẩm nang.
- Chốt người đọc, ngôn ngữ và độ chi tiết.
- Duyệt mục lục trước khi viết.
- Chọn cách lấy ảnh.

Nếu chạy trong chế độ không còn kênh trả lời, hệ thống có nguy cơ bỏ qua bước chờ xác nhận và nhảy thẳng sang viết. Điều đó đi ngược lại mục tiêu an toàn nhất của skill: **người dùng phải là người chốt cấu trúc cẩm nang trước**.

Skill vẫn có thể nhờ một người rà soát chuyên trách kiểm tra mục lục về độ phủ, cách phân loại và tiêu đề thiên về hành động. Tuy nhiên, người rà soát không thay bạn quyết định. Người chốt cuối cùng luôn là bạn tại HARD STOP.

***

## 9. Sau khi xong, bạn nhận được những gì?

Đầu ra được giữ gọn để người không rành kỹ thuật cũng dễ dùng.

Ở cấp ngoài cùng, bạn chỉ cần mở **một file HTML**:

```text
docs/userguide/userguide.html
```

Hoặc, nếu chỉ làm cho một feature:

```text
docs/userguide/{feature}-userguide.html
```

Bạn có thể double-click file này để mở bằng trình duyệt.

Cẩm nang có phong cách gần với tài liệu Word hoặc Notion:

- Nền sáng, chữ rõ ràng.
- Màu đen trắng, điểm xanh dương để nhấn liên kết hoặc mục đang chọn.
- Có tìm kiếm.
- Các trang điều hướng bên trong cùng một cẩm nang.
- Bấm liên kết không mở các file Markdown rời rạc.

Các file phụ được gom trong một folder bundle cùng tên, bao gồm:

- File index theo dõi các trang và nguồn.
- Nội dung từng trang.
- Dữ liệu phục vụ việc hiển thị.
- Ảnh minh họa.

Cách tổ chức này có ý nghĩa rất thực tế: người dùng cuối chỉ thấy một “cửa vào” để đọc; còn BA hoặc người bảo trì vẫn có đầy đủ nguồn, ảnh và tiến độ để cập nhật sau này.

***

## 10. Ví dụ thực tế

Chị **Mai** là BA của một nền tảng học tiếng Anh. Sản phẩm đã có tài liệu cho feature `classroom`: PRD, SRS, use case “Giáo viên tạo lớp”, “Thêm học viên”, “Giao bài tập”, một số wireframe và bảng lỗi.

Đội vận hành chuẩn bị đào tạo giáo viên trước khi mở rộng hệ thống. Chị Mai muốn có cẩm nang dễ đọc, không phải đưa giáo viên đọc SRS.

Chị Mai gõ:

```text
/userguide classroom
```

1. Hệ thống quét tài liệu của `classroom`, rồi báo cho chị Mai biết đã tìm thấy PRD, SRS, use case và wireframe. Nó cũng nhận ra có một số lỗi đã được liệt kê trong Error Matrix.

2. Hệ thống tự dò các luồng từ tài liệu: tạo lớp, thêm học viên và giao bài tập. Nó hỏi chị Mai: “Cẩm nang cần phủ cả 3 luồng này không, hay chỉ viết phần tạo lớp và giao bài?”

3. Chị Mai trả lời: “Chỉ cần tạo lớp và giao bài. Viết tiếng Việt cho giáo viên, giọng thân thiện, mức vừa đủ.”

4. Hệ thống dựng mục lục gồm: tổng quan lớp học, bắt đầu nhanh, bài “Tạo lớp học mới”, bài “Giao bài tập cho lớp”, bảng tra cứu trạng thái bài tập, xử lý lỗi thường gặp và thuật ngữ.

5. Một người rà soát chuyên trách phát hiện mục lục đang thiếu trang hướng dẫn cho người mới biết cần chuẩn bị gì trước khi tạo lớp. Hệ thống bổ sung trang đó và chỉnh tiêu đề thành “Chuẩn bị trước khi tạo lớp học”.

6. Hệ thống in mục lục ra chat, kèm câu hỏi: “Có cần hướng dẫn giáo viên tự thêm ảnh đại diện lớp không?” Sau đó nó dừng hẳn.

7. Chị Mai xem mục lục, quyết định chưa cần phần ảnh đại diện, rồi gõ:

```text
tiếp
```

8. Hệ thống mới bắt đầu viết chi tiết từng trang. Với bài “Tạo lớp học mới”, nó dùng use case để viết các bước, dùng wireframe để minh họa nút bấm và dùng SRS để giải thích trạng thái sau khi lưu.

9. Hệ thống hỏi cách lấy ảnh. Vì app thật đang có dữ liệu học viên, chị Mai không muốn cấp quyền truy cập. Chị chọn cách B: tự chụp ảnh.

10. Cẩm nang vẫn được viết xong. Ở mỗi chỗ cần ảnh, hệ thống để sẵn brief như: “Chụp màn hình Tạo lớp sau khi đã nhập tên lớp; đánh dấu (1) ô Tên lớp, (2) danh sách học viên, (3) nút Lưu.”

11. Cuối cùng, chị Mai nhận được file `docs/userguide/classroom-userguide.html`. Chị chỉ cần mở file đó trong trình duyệt để kiểm tra, rồi gửi cho đội đào tạo. Sau khi ảnh thật được chụp, team chỉ việc đặt chúng đúng tên vào folder ảnh đã chuẩn bị sẵn.

Nếu vài tuần sau nghiệp vụ “Giao bài tập” thay đổi, chị Mai gọi lại `/userguide classroom`. Skill nhận ra cẩm nang đã tồn tại, đọc lại nội dung cũ và cho chị Mai xem phần thay đổi trước khi cập nhật từng file.

***

## 11. Điều cần nhớ khi dùng `/userguide`

- Đây là lệnh viết **hướng dẫn sử dụng**, không phải lệnh sửa nghiệp vụ.
- Nội dung luôn đi từ tài liệu BA đã có sang cẩm nang cho người vận hành.
- Thiếu nguồn thì đánh dấu cần làm rõ, không tự bịa.
- Mục lục phải được bạn duyệt trước khi hệ thống viết chi tiết.
- Hệ thống hỏi trước khi chụp app, che dữ liệu nhạy cảm hoặc cài công cụ chụp ảnh.
- Bạn chỉ cần mở một file HTML; các file phụ được gom gọn trong bundle.
- Khi tài liệu BA thay đổi, có thể chạy lại `/userguide` để cập nhật cẩm nang.
- Sau khi cẩm nang hoàn thiện, `/export` là bước tiếp theo để đóng gói PDF cho stakeholder.

***

## Xem thêm

Tài liệu này giải thích luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật, cấu trúc file, các bước xử lý ảnh và các trường hợp đặc biệt, đọc file gốc: `.claude/skills/userguide/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
