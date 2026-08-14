---
type: skill-explainer
skill: prototype-html
updated: 2026-08-01
---

# `/prototype-html` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/prototype-html` (prototype = "bản mẫu thử") là lệnh dựng ra một **bản demo giao diện chạy được như app thật** — có màu sắc đầy đủ, bấm nút thì chuyển màn, tạo dữ liệu thì dữ liệu hiện ra thật, và đóng mở lại vẫn nhớ những gì bạn vừa làm. Tất cả gói trong **một file duy nhất, bấm đúp là mở bằng trình duyệt**, không cần cài đặt hay chạy máy chủ gì cả.

Điểm khác biệt lớn nhất so với các bản vẽ nháp trước đó: bản này **không phải hình tĩnh, mà là app sống**. Nếu bạn bấm "tạo bộ thẻ mới", một bộ thẻ thật sẽ xuất hiện trong danh sách. Thêm một thẻ vào bộ đó, số đếm tăng thật. Đánh giá xong một thẻ, tiến độ học nhích lên thật. Bạn có thể "sờ và cảm nhận" tính năng gần như thể nó đã hoàn thiện.

Vài tình huống điển hình nên dùng:

- Bạn cần **demo cho sếp / khách hàng / nhà đầu tư** một tính năng để họ hình dung sản phẩm cuối sẽ chạy ra sao — mà chưa muốn (hoặc chưa kịp) code thật.
- Bạn muốn **kiểm tra trải nghiệm người dùng thật sự**: bấm qua bấm lại xem luồng có mượt không, có chỗ nào cụt hay khó hiểu không — thứ mà nhìn hình tĩnh khó thấy.
- Bạn muốn một bản "gần như thật" để cả nhóm cùng **góp ý trực tiếp lên từng chỗ** trước khi dev bỏ công code — ghim nhận xét ngay lên đúng cái nút chưa ổn, thay vì chụp màn hình rồi mô tả bằng lời (xem Mục 7 — lớp góp ý ghim-lên-element).

Gõ lệnh đơn giản như:

```
/prototype-html flashcard
```

> **Một câu để nhớ:** `/prototype-html` = "dựng bản demo có màu, bấm được, nhớ dữ liệu — chạy như app thật trong trình duyệt, để đưa người khác xem thử và góp ý ngay trên đó".

---

## 2. Lệnh này đứng ở đâu — bậc CAO NHẤT của thang bản vẽ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trong bộ công cụ có 3 lệnh vẽ giao diện, ở 3 mức "thật" tăng dần. `/prototype-html` là **bậc cao nhất, thật nhất**.

```
 MỨC 1 — NHÁP BẰNG KÝ TỰ (thô nhất)
 /wireframe-ascii — vẽ bằng ─ │ ┌ ┐, hiện trong chat.
        │
        ▼
 MỨC 2 — BẢN VẼ HTML ĐEN TRẮNG
 /wireframe-html — mở bằng trình duyệt, có nút/ô thật nhưng chưa màu, KHÔNG bấm-chuyển-màn.
        │
        ▼
 MỨC 3 — BẢN MÔ PHỎNG CÓ MÀU, BẤM ĐƯỢC  ◄── /prototype-html LÀ MỨC NÀY
 Có màu đầy đủ + bấm nút chuyển màn + tạo/nhớ dữ liệu như app thật.
```

Sự khác nhau giữa Mức 2 và Mức 3, nói bằng ví dụ đời thường:
- **Mức 2 (wireframe-html)** giống **bản vẽ mặt bằng ngôi nhà** trên giấy — thấy phòng nào ở đâu, cửa mở hướng nào, nhưng không đi vào ở được.
- **Mức 3 (prototype-html)** giống **nhà mẫu đã dựng xong** — bạn bước vào, bật công tắc đèn sáng thật, mở tủ lạnh thấy có ngăn thật. Chưa phải nhà bạn sẽ ở (chưa có người thật, đồ đạc thật của bạn), nhưng đủ để "trải nghiệm thử".

Vì là bậc cao nhất, `/prototype-html` **đọc lại kết quả của các bậc dưới** (bản đồ luồng, bản vẽ nháp) làm nền — nó không bắt đầu từ số không, mà nâng cấp những gì đã có lên thành app chạy được.

---

## 3. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Giống các lệnh khác trong bộ công cụ, `/prototype-html` **luôn xin phép trước khi ghi file** và **tự soát chất lượng sau khi dựng xong**.

```
 BẠN GÕ LỆNH
 /prototype-html flashcard
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Kiểm tra nguyên liệu đầu vào           │
 │  Cần 3 thứ: (a) bản đồ luồng, (b) bản vẽ nháp ASCII   │
 │  có bảng mô tả từng ô/nút, (c) bộ quy chuẩn thiết kế. │
 │  Thiếu bản đồ luồng → tự chạy /user-flow trước.       │
 │  Thiếu bản ASCII → dừng, nhắc chạy /wireframe-ascii.  │
 │  (vì sao cần đủ → xem Mục 4)                          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Lấy màu sắc + phông chữ thật           │
 │  Đọc file docs/design.md (bộ quy chuẩn thiết kế) để   │
 │  dùng đúng màu thương hiệu, phông chữ, khoảng cách.   │
 │  Không tự bịa màu. Thiếu file → dùng màu trung tính.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Dựng từng màn + "bộ não" của app       │
 │  Với mỗi màn: lấy nội dung từ bảng mô tả nháp, biến   │
 │  ô/nút thành phần tử thật có màu. Đồng thời viết phần │
 │  logic để app biết: bấm nút này thì làm gì, tạo dữ   │
 │  liệu ra sao, chuyển sang màn nào — kèm các quy tắc   │
 │  "giống app thật" ở Mục 5 (loading, nhớ/quên dữ liệu, │
 │  không hiện lỗi khi chưa ai gõ...).                   │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Cho bạn xem trước rồi mới ghi file      │
 │  "Em sẽ dựng prototype cho flashcard: X màn, chạy như │
 │   app thật, nhớ dữ liệu, menu điều hướng nổi, có/không│
 │   lớp góp ý..."                                       │
 │  Bạn gõ Y (đồng ý) / sửa.                             │
 └──────────────────────────────────────────────────────┘
        │  (chỉ dựng khi bạn đồng ý)
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Gắn lớp GÓP Ý vào file (xem Mục 7)     │
 │  Mặc định CÓ: nhúng sẵn thanh công cụ để người xem   │
 │  ghim nhận xét lên từng nút/ô, kèm "nhãn tên" cho    │
 │  các phần tử chính để ghim bám chắc.                 │
 │  Gõ `no-comment` → bỏ qua bước này, file ra sạch.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 6 — Tự KIỂM TRA: bấm thử có chạy thật ko?  │
 │  Hệ thống tự "bấm thử" các thao tác chính (tạo, thêm, │
 │  lưu, chuyển màn, gõ vào ô nhập liệu...) để chắc chắn │
 │  app chạy đúng, không chỉ trông đẹp mà bấm không ăn.  │
 │  Lỗi → tự sửa.                                        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 7 — "Trợ lý thiết kế" soát lại + tự sửa    │
 │  Mời trợ lý @uxui-reviewer rà: màn nào thiếu trạng    │
 │  thái lỗi/trống? luồng có cụt không? màu có hợp lý?   │
 │  Hệ thống TỰ SỬA hết các lỗi tìm thấy. (xem Mục 6)    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — bấm đúp file để mở, hoặc gửi file cho người khác xem/góp ý
```

---

## 4. Vì sao cần đủ 3 "nguyên liệu" đầu vào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Ở Giai đoạn 1, `/prototype-html` kiểm tra ba thứ. Đây không phải làm khó — mỗi thứ là một nguyên liệu không thể thiếu để dựng một app đúng:

1) **Bản đồ luồng** (từ `/user-flow`) — cho biết tính năng có những màn nào, chia thành mấy luồng, đi lại ra sao. Đây là "sơ đồ dây điện" để app biết bấm nút này thì nhảy sang màn nào. Thiếu nó, hệ thống tự chạy `/user-flow` để tạo trước. Bản đồ luồng này còn cho biết **kích thước màn hình** (điện thoại/máy tính bảng/máy tính) mà lệnh sẽ dùng — thiếu thông tin đó, hệ thống sẽ hỏi bạn một câu trước khi vẽ.

2) **Bản vẽ nháp ASCII kèm bảng mô tả** (từ `/wireframe-ascii`) — cho biết mỗi màn có những ô/nút gì, ràng buộc ra sao, báo lỗi thế nào. Đây là "danh sách vật liệu" cho từng phòng, và là **nguồn nội dung màn bắt buộc**: thiếu bản ASCII, hệ thống **dừng lại và nhắc bạn chạy `/wireframe-ascii` trước** — vì nếu tự bịa nội dung màn thì sẽ sai. (Bản HTML đen trắng nếu có thì tốt để đối chiếu bố cục, nhưng không thay được bản ASCII.)

3) **Bộ quy chuẩn thiết kế** — đây là một file tên **`docs/design.md`** trong dự án. Nó ghi sẵn toàn bộ "luật thiết kế" của sản phẩm: màu thương hiệu (vd màu vàng chủ đạo), phông chữ, độ bo góc nút, khoảng cách chuẩn, và quy tắc khi nào dùng nền sáng / nền tối. Đây là "bảng màu sơn và vật liệu" để app trông đúng nhận diện thương hiệu — và cũng là lý do prototype có màu thật thay vì màu tự bịa. Thiếu file này, hệ thống dùng bộ màu trung tính tạm và báo rõ cho bạn biết.

> **Về `design.md`:** đây là file "một nguồn sự thật" cho mọi thứ liên quan tới màu sắc và diện mạo trong dự án. Nhờ có nó, mọi màn trong prototype dùng **chung một bảng màu nhất quán** — và nếu sau này thương hiệu đổi màu, chỉ cần sửa `design.md` rồi chạy lại là toàn bộ prototype đổi theo. Hệ thống bị **cấm tự bịa mã màu** ngoài những màu đã khai trong file này, để tránh chuyện mỗi màn một tông lệch nhau. File này cũng được lệnh `/figma` dùng chung khi vẽ lên Figma, nên bản Figma và bản prototype luôn khớp màu.

Vì sao đòi đủ? Vì `/prototype-html` **không tự bịa cấu trúc màn hình** — bố cục và các ô/nút của mỗi màn đều lấy từ bản vẽ nháp đã duyệt, kể cả wording thông báo lỗi (mã lỗi kỹ thuật trong bảng nháp chỉ để BA/dev tra cứu, KHÔNG bao giờ hiện thẳng ra màn — người dùng chỉ thấy câu chữ, không thấy mã `E-...`). Giống như thợ dựng nhà mẫu: họ cần bản vẽ (bản đồ luồng), danh sách vật liệu (bảng mô tả nháp), và bảng màu sơn (`design.md`) — chứ không tự ý quyết định phòng ốc hay màu tường. (Những thứ nhỏ mà tài liệu chưa nói rõ — như dữ liệu mẫu để demo, hay một chi tiết trải nghiệm chưa ai chốt — thì hệ thống tự chọn phương án hợp lý và **ghi rõ trong báo cáo** để bạn biết, chứ không im lặng bịa; xem Mục 6.) Nhờ dựa trên nguyên liệu đã duyệt, bản demo luôn khớp với những gì cả nhóm đã thống nhất.

---

## 5. "Chạy như app thật" nghĩa là gì? (điểm cốt lõi)

Đây là thứ khiến `/prototype-html` đặc biệt. Nhiều bản demo khác chỉ là **các ảnh chụp màn hình ghép lại thành slideshow** — bấm nút thì nhảy sang ảnh kế tiếp, nhưng thực ra không có gì "chạy". Prototype này khác hẳn: nó có một "bộ não" thật bên trong, và bộ não đó còn phải cư xử **giống hệt** một app thật ở vài tình huống dễ bị làm ẩu.

**5.1. Dữ liệu sinh ra thật.** Bấm "tạo bộ thẻ" → một bộ thẻ thật xuất hiện trong danh sách (không phải nhảy sang ảnh có sẵn). Thêm thẻ → số đếm tăng đúng. Danh sách trống thì hiện đúng trạng thái "chưa có gì", chứ không mượn dữ liệu của chỗ khác lắp vào.

**5.2. Đi lại có điều kiện thật.** Ví dụ chưa điền đủ ô bắt buộc thì nút "Tiếp tục" không cho đi — giống app thật, chứ không phải bấm là nhảy bừa.

**5.3. Nhớ dữ liệu qua các lần mở.** Đây là điểm hay: bạn tạo vài bộ thẻ, rồi **đóng trình duyệt, mở lại** — mọi thứ vẫn còn nguyên. Hệ thống lưu lại trong bộ nhớ của trình duyệt (gọi kỹ thuật là "localStorage" — bạn không cần nhớ tên). Nhờ vậy khi demo cho sếp, bạn có thể chuẩn bị sẵn "câu chuyện" từ hôm trước, hôm sau mở ra vẫn y nguyên.

**5.4. Bấm nút gửi đi phải có "độ trễ chờ" giống thật.** Ứng dụng thật không bao giờ phản hồi tức thời khi bạn bấm "Đăng nhập" hay "Lưu" — luôn có một khoảnh khắc chờ trong lúc máy chủ xử lý. Prototype mô phỏng đúng điều này: bấm xong, nút lập tức khoá lại và đổi chữ thành "Đang xử lý..." (kèm biểu tượng xoay), giữ khoảng gần 1 giây rồi mới hiện kết quả (chuyển màn, hoặc báo lỗi/thành công). Thiếu bước này, demo sẽ "nhảy" tức thời trông giả, và một dạng lỗi thật ngoài đời (app chạy chậm, người dùng bấm 2 lần) sẽ không được kiểm tra.

**5.5. Ô nhập liệu phải "biết điều" — không mắng bạn khi bạn chưa gõ gì.** Đây là một chi tiết nhỏ nhưng ảnh hưởng lớn tới cảm giác dùng thật: khi một màn (vd form đăng ký) vừa hiện ra, các ô nhập liệu **không được** hiện sẵn dòng chữ đỏ báo lỗi — vì bạn chưa gõ gì thì lấy đâu ra lỗi để báo. Lỗi chỉ xuất hiện sau khi bạn đã rời khỏi một ô (bấm sang ô khác) hoặc đã bấm nút gửi. Và ngay khi bạn sửa lại cho đúng, dòng lỗi phải biến mất **ngay lập tức**, không phải đợi bấm gửi lại mới hết.
   Một số ô còn phải **tự động format khi bạn đang gõ** — ví dụ ô số thẻ ngân hàng tự thêm khoảng trắng chia nhóm 4 số một, ô ngày hết hạn tự thêm dấu `/` sau khi bạn gõ 2 số đầu (biến `1602` thành `16/02` ngay lập tức). Việc "định dạng lại cho đẹp" này xảy ra **trước và độc lập** với việc "báo lỗi hay không" — gõ dở dang không bị mắng, nhưng vẫn được format gọn ngay khi gõ.

**5.6. Màn hình "cửa vào" của một luồng phải tự dọn dẹp khi bạn quay lại, nhưng không được quên câu chuyện đang dở.** Đây là một phân biệt tinh tế đáng nói rõ, vì hai thứ trông giống nhau nhưng phải xử lý ngược nhau:
   - **Dữ liệu bạn tự gõ vào ô** (email, mật khẩu ở màn đăng nhập) — mỗi lần bạn quay lại màn đó (vd bấm quay lại, hoặc thử một nhánh khác rồi trở về), các ô này phải **rỗng lại như mới**, giống việc bạn rời khỏi ứng dụng thật rồi mở lại. Nếu không dọn, ô vẫn còn nguyên chữ cũ trông rất giả.
   - **Dữ liệu được "truyền" từ màn trước sang màn sau trong cùng một câu chuyện** (ví dụ: email bạn vừa đăng ký hiện lại ở màn "kiểm tra hộp thư", hoặc mã xác nhận dùng ở màn tiếp theo) — cái này **phải được giữ nguyên**, vì nó là một phần của câu chuyện đang diễn ra, không phải "dữ liệu cũ" cần xoá.

Cần nói rõ **ranh giới**: đây vẫn là bản mẫu, **không kết nối với hệ thống thật** — không có tài khoản thật, không gửi dữ liệu đi đâu, không thanh toán thật. "Chạy như thật" chỉ có nghĩa là *bên trong bản demo*, mọi thao tác vận hành đúng logic. Dữ liệu bạn tạo chỉ nằm trong trình duyệt của bạn, không gửi ra ngoài — bản demo cũng ghi rõ dòng chữ nhắc điều này.

---

## 6. "Trợ lý thiết kế" (@uxui-reviewer) soát và tự sửa

Trước khi coi là hoàn tất, prototype được một **trợ lý chuyên trách tên `@uxui-reviewer`** (vai chuyên gia trải nghiệm & giao diện) rà lại — giống như nhờ một designer giàu kinh nghiệm soi giúp trước khi giao.

Trợ lý này soi những điểm mà người dựng dễ bỏ sót:
- **Thiếu trạng thái màn:** mỗi màn đã có đủ các trạng thái chưa — lúc đang tải, lúc trống rỗng, lúc báo lỗi, lúc thành công? (Câu hỏi kinh điển của trợ lý này là "*màn này trông ra sao khi nó gặp lỗi?*")
- **Luồng có cụt không:** có màn nào đi vào rồi không có đường ra không?
- **Màu và tông có hợp lý không:** màn sáng/tối đúng vai trò chưa, hộp thoại bật lên có bị chói tông không, chữ có đủ tương phản để đọc không.
- **Lớp vỏ có lẫn với app không:** cái menu nổi "của công cụ" có bị dính màu vào app không.
- **Mã lỗi kỹ thuật có lộ ra ngoài không:** kiểm xem có dòng nào hiện thẳng mã như `E-...` cho người dùng thấy không (chỉ được hiện câu chữ, không hiện mã).

Điểm đáng chú ý: **hệ thống tự sửa hết các lỗi trợ lý tìm ra**, bạn không phải duyệt từng cái một. Với những chỗ cần quyết định về trải nghiệm mà tài liệu chưa nói rõ, hệ thống tự chọn phương án hợp lý và **đánh dấu rõ trong báo cáo cuối** (bằng ký hiệu 🔶) để bạn biết chỗ nào nó đã tự quyết — bạn có thể chỉnh lại sau nếu muốn. Cách này giúp bạn chỉ cần xem **kết quả cuối cùng đã được rà và sửa**, thay vì phải ngồi duyệt từng lỗi.

---

## 7. Lớp GÓP Ý ghim-lên-element — thu nhận xét ngay trên bản demo

Đây là phần đáng giá nhất của prototype sau chính bản demo, nên nói kỹ hơn một chút.

### 7.1 Nó giải quyết chuyện gì

Cách góp ý thông thường rất mất công: người xem chụp màn hình, khoanh đỏ, dán vào chat hoặc email, rồi mô tả bằng lời *"cái nút màu xanh ở màn thứ hai, phía dưới ô nhập email ấy…"*. Bạn nhận về một mớ ảnh rời rạc, phải tự đoán họ nói về chỗ nào, và gom lại thành danh sách việc cần sửa.

Prototype đi kèm sẵn một **lớp góp ý kiểu Figma**: người xem bấm vào **đúng cái nút / ô / dòng chữ** chưa ổn, gõ nhận xét ngay tại đó, và một **cái ghim (pin) đánh số** hiện lên đúng vị trí. Không phải mô tả bằng lời, không phải chụp màn hình — chỗ nào có vấn đề thì cái ghim nằm ngay chỗ đó.

Vài đặc điểm đáng chú ý:

- **Ghim bám đúng chỗ**, kể cả khi bạn phóng to/thu nhỏ cửa sổ, cuộn trang, chuyển sang màn khác rồi quay lại, hoặc khi app tự vẽ lại nội dung (ví dụ bảng giao dịch load lại). Ghim ghi nhớ vị trí theo **tỉ lệ %** trong phần tử chứ không theo pixel, nên màn hình to nhỏ đều đúng.
- **Thà báo mất còn hơn gắn nhầm:** nếu phần tử được ghim đã bị xoá/đổi hẳn (ví dụ bạn dựng lại prototype và bỏ nút đó), ghim **đổi màu tím báo "mất neo"** thay vì âm thầm nhảy sang nút khác. Đây là lựa chọn có chủ đích — một góp ý gắn nhầm chỗ nguy hiểm hơn một góp ý báo mất chỗ.
- **Bấm để ghim thì app không chạy:** khi đang ở chế độ ghim, bấm vào nút "Đăng nhập" chỉ tạo góp ý chứ không kích hoạt hành động đăng nhập của app. Bạn không bị nhảy màn ngoài ý muốn giữa lúc đang góp ý.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
- **Góp ý tách hẳn khỏi dữ liệu demo:** bấm "Reset dữ liệu demo" để diễn lại từ đầu **không xoá góp ý** của mọi người. Hai thứ lưu ở hai chỗ riêng.
- **Sao chép toàn bộ góp ý ra văn bản:** một nút "Copy all" xuất tất cả nhận xét thành danh sách gọn gàng nhóm theo màn, ghi rõ phần tử nào, ai góp ý, lúc nào — dán thẳng vào Jira/Confluence được.

### 7.2 Cách dùng — hai vai khác nhau

Đây là điểm dễ nhầm nhất, nên nắm rõ: file prototype có **hai vai người dùng**, thấy giao diện khác nhau.

| | **Người dựng (admin)** — thường là bạn | **Người góp ý (reviewer)** — sếp, khách, đồng nghiệp |
|---|---|---|
| Mở file kiểu gì | Thêm `#admin` vào cuối địa chỉ (vd `prototype.html#admin`) | Mở link bình thường bạn gửi |
| Thấy gì thêm | Nút **bánh răng** → hộp "Cài đặt lưu chung" (nối kho chung, ngắt kết nối, xoá hết góp ý) + nút **"Copy link gửi review"** | **Không thấy gì** về cấu hình — chỉ có thanh góp ý |
| Làm gì | Thiết lập kho lưu chung 1 lần, rồi gửi link | Gõ tên 1 lần → ghim góp ý |

Máy đã mở `#admin` một lần thì nhớ luôn, khỏi gõ lại. Ngược lại, link bạn gửi cho người khác **không kèm `#admin`** nên họ không bao giờ thấy phần cài đặt hay chìa khoá — họ chỉ thấy đúng một thanh công cụ nhỏ để góp ý.

**Người góp ý được hỏi tên đúng một lần** khi mở lần đầu ("Bạn là ai?"), sau đó mọi nhận xét tự động ghi tên họ. Không phải ký tên thủ công vào từng góp ý.

Thanh công cụ góp ý nằm ở **góc dưới-trái** (góc phải đã có menu điều hướng màn). Trên máy tính nó **mở rộng sẵn** để bấm một phát là ghim được; trên điện thoại nó **thu gọn thành một nút tròn** cho đỡ che nội dung — bạn bấm mũi tên đổi qua lại, và lựa chọn đó được nhớ.

### 7.3 Muốn cả nhóm thấy góp ý của nhau — thiết lập một lần ~5 phút

Mặc định, góp ý chỉ **lưu trên máy người gõ**. Như vậy đã đủ nếu bạn chỉ ngồi cạnh xem cùng, nhưng nếu gửi link cho 3 người thì mỗi người chỉ thấy góp ý của chính mình — và bạn không thấy gì cả.

Để cả nhóm thấy chung, bạn nối prototype với một kho lưu trữ trực tuyến miễn phí tên **jsonbin.io**. Không cần biết code, không tạo bảng, không viết SQL:

1) Đăng ký jsonbin.io bằng email → copy **Master Key**.
2) Tạo một "bin" trống với đúng nội dung `{"list":[]}` → copy **Bin ID** trên thanh địa chỉ.
3) Mở prototype với `#admin` → bấm bánh răng → dán hai giá trị vào → **Lưu & kết nối**.
4) Bấm **"Copy link gửi review"** → gửi link đó cho mọi người. Ai mở link cũng **tự nối sẵn**, không phải gõ chìa khoá gì.

Sau đó: mọi người ghim góp ý, các máy tự đồng bộ với nhau (đẩy khi lưu, kéo về mỗi ~15 giây và mỗi khi quay lại tab). Một **chấm màu** trên thanh công cụ cho biết trạng thái: **xanh** = đã đồng bộ xong, **vàng** = đang đồng bộ, **đỏ** = mất mạng (góp ý vẫn lưu tạm trên máy và tự đẩy lại khi có mạng).

Hai điểm nên biết:

- **Hai người ghim cùng lúc không mất góp ý của nhau.** Mỗi lần đẩy lên, hệ thống đọc bản mới nhất → trộn → mới ghi, chứ không đè.
- ⚠️ **Chỉ dùng cho prototype nội bộ.** Chìa khoá nằm trong file HTML nên ai xem mã nguồn trang cũng lấy được và sửa/xoá được góp ý. Đây là đánh đổi có chủ đích để việc thiết lập chỉ mất 5 phút thay vì phải dựng hệ thống tài khoản. Đừng dùng cho dữ liệu nhạy cảm.

Hướng dẫn từng bước có ảnh chụp: `docs/reports/2026-07-22-prototype-comments/HUONG-DAN-LUU-CHUNG.md`. Muốn đưa file lên web để gửi link (thay vì gửi file đính kèm), xem `HUONG-DAN-DAY-LEN-WEB.md` cùng thư mục.

### 7.4 Nếu bạn không cần góp ý

Chỉ muốn một bản để trình chiếu/demo thuần, không thu thập ý kiến — gõ thêm `no-comment`:

```
/prototype-html flashcard no-comment
```

File ra sẽ **sạch hoàn toàn**, không có thanh công cụ góp ý, không có nút nào thừa. Phù hợp khi mang đi thuyết trình trước đám đông.

### 7.5 Vài giới hạn đã biết

Nói trước để bạn không mất công thử:

- **Chưa ghim được góp ý lên nội dung trong hộp thoại bật lên (dialog/modal)** — do cách trình duyệt xếp lớp hộp thoại lên trên cùng. Góp ý về hộp thoại thì ghim tạm lên nút mở nó.
- **Không có ảnh chụp màn hình kèm góp ý** như các công cụ chuyên dụng (BugHerd, Marker.io) — nằm ngoài phạm vi của một file tự chứa.
- **Cùng một góp ý bị sửa nội dung đồng thời ở hai nơi** thì bản lưu sau thắng. Hiếm gặp trong thực tế review.
- Với review nội bộ, nên dùng **"Đã xử lý"** thay vì xoá hẳn góp ý — để còn dấu vết đã bàn gì.

---

## 8. Ví dụ thực tế

Chị **Mai**, một BA của app học tiếng Anh, cần demo tính năng "flashcard" (thẻ ghi nhớ từ vựng) cho buổi họp nhà đầu tư tuần sau. Chị đã có sẵn bản đồ luồng và bản vẽ nháp ASCII từ trước. Chị gõ:

```
/prototype-html flashcard
```

1) Hệ thống kiểm tra: đủ cả ba nguyên liệu (bản đồ luồng, bản vẽ nháp có bảng mô tả, bộ quy chuẩn thiết kế). Tốt, không cần tạo gì thêm.

2) Nó đọc bộ quy chuẩn thiết kế, lấy đúng màu xanh thương hiệu và phông chữ của app.

3) Nó dựng từng màn: màn thư viện thẻ, màn tạo bộ thẻ, màn học thẻ, màn kết quả — mỗi màn có màu thật, và viết "bộ não" để bấm nút là chạy, kèm khoá nút "Đang xử lý..." khi lưu, và tự dọn ô nhập liệu khi quay lại màn tạo bộ thẻ.

4) Nó cho chị Mai xem trước: *"Em sẽ dựng prototype cho flashcard: 5 màn, chạy như app thật, nhớ dữ liệu qua các lần mở, menu điều hướng nổi, kèm lớp góp ý ghim-lên-element. Kích thước điện thoại. Đồng ý không?"* Chị Mai gõ `Y`.

5) Dựng xong, hệ thống **tự bấm thử**: tạo một bộ thẻ "Từ vựng du lịch", thêm 3 thẻ vào đó, lưu, chuyển màn. Nó phát hiện một lỗi: khi thêm thẻ, app lỡ tạo một bộ thẻ trùng tên mới thay vì thêm vào bộ đang mở. Nó **tự sửa** rồi bấm thử lại — lần này đúng.

6) Trợ lý `@uxui-reviewer` rà tiếp, phát hiện màn "học thẻ" chưa có trạng thái khi bộ thẻ rỗng (chưa có thẻ nào). Hệ thống tự bổ sung màn "chưa có thẻ, hãy thêm thẻ đầu tiên". Có một chỗ về cách sắp xếp nút mà tài liệu chưa nói rõ, hệ thống tự chọn phương án hợp lý và đánh dấu 🔶 trong báo cáo để chị Mai biết.

7) Hệ thống báo hoàn tất, kèm hướng dẫn: *"Bấm đúp file để mở. Thử: bấm nút nổi góc dưới-phải để chọn màn; tạo bộ thẻ → dữ liệu hiện thật, refresh vẫn còn. Bấm nút góc dưới-trái để ghim góp ý lên bất kỳ chỗ nào."*

8) Chị Mai bấm đúp mở file, chơi thử vài phút, thấy chạy mượt và giống app thật. Chị đẩy file lên một trang web nội bộ để cả nhóm cùng xem, rồi gửi link cho 2 đồng nghiệp — họ ghim vài góp ý trực tiếp lên các nút mà họ thấy chưa ổn, chị Mai mở lại thấy ngay các góp ý đó (lưu chung, không cần ai gửi email riêng). Tại buổi họp, chị cho nhà đầu tư tự bấm thử, họ tạo bộ thẻ, học thử vài từ — ấn tượng hơn hẳn xem slide tĩnh.

Toàn bộ quá trình, chị Mai không phải chỉnh sửa tay: hệ thống tự bấm thử, tự soát, tự sửa, và chỉ đưa chị bản cuối đã hoàn chỉnh.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (từng Phase A–H, cách dựng "bộ não" app, cơ chế nhớ dữ liệu, quy tắc màu 2 lớp, cơ chế neo góp ý 4 tầng), đọc file gốc: `.claude/skills/prototype-html/SKILL.md`.

Tài liệu / lệnh liên quan:
- **`docs/design.md`** — bộ quy chuẩn thiết kế (màu, phông, kích thước). Lệnh này đọc file đó để lấy màu thật; sửa file đó rồi chạy lại là prototype đổi màu theo.
- `/user-flow` — tạo "bản đồ luồng" mà lệnh này cần (chạy trước); xem `explain-skills/user-flow.md`.
- `/wireframe-ascii` — bản vẽ nháp ASCII, **nguồn nội dung màn bắt buộc** cho lệnh này; xem `explain-skills/wireframe-ascii.md`.
- `/wireframe-html` — bản vẽ nháp HTML đen trắng (cùng bậc với ASCII), tốt để đối chiếu bố cục nhưng không thay được ASCII; xem `explain-skills/wireframe-html.md`.
- `/figma` — vẽ thiết kế đẹp lên Figma (cũng đọc `design.md` để lấy màu; một hướng khác để lên bản đẹp, dành cho designer tinh chỉnh); xem `explain-skills/figma.md`.
- `docs/reports/2026-07-22-prototype-comments/` — bộ tài liệu của **lớp góp ý** (Mục 7):
  - `HUONG-DAN-LUU-CHUNG.md` — nối kho chung jsonbin từng bước (~5 phút, không cần biết code) để cả nhóm thấy góp ý của nhau.
  - `HUONG-DAN-DAY-LEN-WEB.md` — đưa file lên web (GitHub Pages/Netlify) để gửi link thay vì gửi file đính kèm.
  - `README.md` — báo cáo thiết kế: cơ chế neo 4 tầng, cách chống mất góp ý khi nhiều người cùng ghim, các lỗi đã xử lý.
  - `example-*-commentable.html` — 2 prototype thật có sẵn lớp góp ý, bấm đúp mở là thử được ngay.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
