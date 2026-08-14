---
type: skill-explainer
skill: wireframe-html
updated: 2026-07-13
---

# `/wireframe-html` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/wireframe-html` (wireframe = "khung dây", bản phác thảo màn hình) là lệnh bạn gõ khi muốn **nhìn thấy các màn hình của một tính năng dưới dạng bản vẽ nháp** — có nút bấm, ô nhập liệu, đường kẻ... nhưng **chưa tô màu, chưa làm đẹp**. Mục đích là để mọi người cùng thống nhất "màn hình này gồm những gì, sắp xếp ra sao" trước khi tốn công thiết kế đẹp hoặc code thật.

Kết quả là một **file HTML mở bằng trình duyệt** (Chrome, Safari...) chỉ bằng cách bấm đúp — không cần cài gì thêm. Bản vẽ này chỉ có **đen, trắng, xám** (cố tình không màu, sẽ giải thích lý do ở Mục 4).

Vài tình huống điển hình nên dùng `/wireframe-html`:

* Bạn vừa viết xong mô tả nghiệp vụ (yêu cầu, luồng người dùng) và muốn "hình dung" nó thành các màn hình để đưa cho sếp / dev / designer xem thử.
* Bạn muốn kiểm tra: một luồng đăng nhập gồm mấy màn, mỗi màn có đủ nút/ô cần thiết chưa, có sót màn nào không.
* Bạn cần một bản nháp nhanh để họp, không cần đẹp, chỉ cần đúng bố cục và đúng tỉ lệ trên điện thoại / máy tính.

Gõ lệnh đơn giản như:

```
/wireframe-html authentication
```

Trong đó `authentication` là tên tính năng (feature) bạn muốn vẽ. Hệ thống sẽ tự tìm tài liệu của tính năng đó và vẽ tất cả các màn hình cho bạn.

> **Một câu để nhớ:** `/wireframe-html` = "cho tôi xem thử các màn hình của tính năng này trông ra sao, dạng nháp đen trắng, mở bằng trình duyệt".

***

## 2. Ba "mức độ hoàn thiện" của bản vẽ — lệnh này đứng ở đâu?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trước khi đi vào chi tiết, cần hiểu một điều: trong bộ công cụ này có **3 lệnh cùng để vẽ màn hình**, nhưng ở 3 mức độ "thật" khác nhau. Giống như vẽ một ngôi nhà: đầu tiên là nét chì nguệch ngoạc, rồi tới bản vẽ kỹ thuật đen trắng, cuối cùng là bản phối cảnh 3D có màu.

```
 MỨC 1 — NHÁP TRONG KHUNG CHAT (thô nhất)
 /wireframe-ascii
 Vẽ bằng ký tự bàn phím (─ │ ┌ ┐), hiện ngay trong cửa sổ chat.
 Nhìn như bản vẽ tay. Nhanh, xem liền, không cần mở trình duyệt.
        │
        ▼
 MỨC 2 — BẢN VẼ HTML ĐEN TRẮNG  ◄── /wireframe-html LÀ MỨC NÀY
 Mở bằng trình duyệt, có nút/ô thật nhưng chỉ đen-trắng-xám.
 Đúng tỉ lệ điện thoại/máy tính. Xem được bố cục thật, chưa có màu.
        │
        ▼
 MỨC 3 — BẢN MÔ PHỎNG CÓ MÀU, BẤM ĐƯỢC (thật nhất)
 /prototype-html
 Có màu sắc đầy đủ, bấm vào nút thì chuyển màn như app thật.
 Dùng để demo cho khách/sếp xem gần giống sản phẩm cuối.
```

`/wireframe-html` nằm **ở giữa**: thật hơn bản vẽ ký tự (vì có nút/ô thật, đúng tỉ lệ màn hình), nhưng đơn giản hơn bản mô phỏng có màu (vì cố tình bỏ màu, bỏ hiệu ứng bấm-chuyển-màn).

Một điểm hay: **Mức 1 (ASCII) và Mức 2 (HTML) là "anh em cùng vẽ một màn hình"**, chỉ khác cách thể hiện. Nếu bạn đã vẽ bản ASCII trước rồi, khi vẽ bản HTML, hệ thống sẽ **đọc lại bản ASCII đó để dùng lại thông tin** thay vì tự nghĩ lại từ đầu — nhờ vậy hai bản không bị "mỗi bản nói một kiểu". (Xem thêm Mục 6.)

### Khi nào nên chọn bản HTML thay vì bản ASCII?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là câu hỏi thực tế hay gặp nhất. Cả hai cùng bậc "nháp", nhưng mỗi bản mạnh ở một loại màn hình:

**Nên dùng bản HTML (`/wireframe-html`) khi màn hình PHỨC TẠP về bố cục** — nhiều nút, nhiều cột, có bảng dữ liệu. Ví dụ điển hình: **một trang bảng điều khiển (dashboard) hay báo cáo** — có bảng nhiều dòng nhiều cột, biểu đồ, bộ lọc, nhiều nút thao tác cùng lúc.

Lý do: vẽ những thứ đó **bằng ký tự (ASCII) trông rất rối và không gọn** — các cột khó thẳng hàng, bảng dài bị vỡ, không thể hiện được đúng tỉ lệ "cột này rộng, cột kia hẹp". Còn bản HTML dùng phần tử bảng thật của trình duyệt, nên các cột **tự căn thẳng, đúng kích cỡ, gọn gàng**, nhìn ra ngay bố cục thật. Nói cách khác: khi cần chỉnh cho màn hình "hiển thị cho vừa vặn và đúng tỉ lệ", HTML làm được còn ASCII thì không.

```
 Màn hình ĐƠN GIẢN (form đăng nhập, vài ô + 1 nút)
   → ASCII đủ dùng, lại nhanh và xem liền trong chat.

 Màn hình PHỨC TẠP (dashboard, bảng báo cáo nhiều cột,
 danh sách dài, nhiều nút/bộ lọc)
   → Dùng HTML: bảng/cột thẳng hàng, đúng tỉ lệ, gọn.
     ASCII loại này nhìn rối và sai kích cỡ.
```

Một cách nhớ gọn: **ô nhập ít → ASCII cũng ổn; bảng biểu nhiều → chọn HTML.**

***

## 3. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quan trọng cần nhớ: giống mọi lệnh trong bộ công cụ này, `/wireframe-html` **luôn dừng lại hỏi bạn trước khi ghi file** — nó không tự ý vẽ rồi lưu luôn.

```
 BẠN GÕ LỆNH
 /wireframe-html authentication
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Kiểm tra "đã có bản đồ luồng chưa?"     │
 │  Hệ thống cần một tài liệu gọi là "user flow" (sơ đồ  │
 │  luồng người dùng) — nó cho biết tính năng này chia    │
 │  thành mấy luồng, mỗi luồng gồm những màn nào.         │
 │  CHƯA CÓ, hoặc CÓ NHƯNG CHƯA DUYỆT → hệ thống tự chạy  │
 │  lệnh /user-flow trước để có bản đồ đã chốt, rồi mới   │
 │  quay lại vẽ. (xem Mục 5)                              │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — HỎI: vẽ theo kích thước màn hình nào?   │
 │  Điện thoại (hẹp) / Máy tính bảng / Máy tính (rộng)?   │
 │  Đây là quyết định thiết kế, hệ thống KHÔNG tự đoán    │
 │  bừa — nó gợi ý sẵn 1 lựa chọn hợp lý rồi CHỜ bạn      │
 │  xác nhận. (vì sao quan trọng → xem Mục 7)             │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Đọc hết tài liệu nghiệp vụ              │
 │  Hệ thống đọc mô tả tính năng (yêu cầu, quy tắc, luồng)│
 │  để biết mỗi màn cần những ô/nút gì, ràng buộc ra sao. │
 │  Nếu bản vẽ ASCII đã có sẵn → đọc lại để tái sử dụng.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — CHO BẠN XEM TRƯỚC danh sách sẽ vẽ       │
 │  "Em sẽ tạo 3 file: luồng đăng nhập gồm các màn A,B,C; │
 │   luồng quên mật khẩu gồm màn D,E... Đồng ý không?"    │
 │  Bạn gõ Y (đồng ý) / sửa kế hoạch / bỏ qua 1 luồng.    │
 └──────────────────────────────────────────────────────┘
        │
        │  (chỉ vẽ khi bạn đồng ý)
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Vẽ từng luồng thành file HTML           │
 │  Mỗi luồng = 1 file. Trong file, mỗi màn là 1 khung    │
 │  đúng bề rộng thiết bị, có nút/ô thật, đen trắng.      │
 │  KÈM THEO: 1 bảng mô tả chi tiết từng ô/nút (5 cột)    │
 │  để dev/tester đọc hiểu đầy đủ. (xem Mục 8)            │
 │                                                        │
 │  ⚠ Nếu tài liệu thiếu thông tin (vd "ô này giới hạn   │
 │  50 ký tự nhưng không nói cho nhập ký tự gì") →        │
 │  hệ thống DỪNG HỎI BẠN, không tự bịa quy tắc.          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 6 — Tạo "trang bìa" điều hướng              │
 │  Sinh thêm 1 file HTML tổng — đây là "cửa vào" bạn     │
 │  bấm đúp để mở: có menu bên trái liệt kê mọi luồng/màn │
 │  + sơ đồ luồng bấm được. Đỡ phải mở từng file rời rạc. │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — bấm đúp file "trang bìa" để xem toàn bộ
```

***

## 4. Vì sao bản vẽ lại CỐ TÌNH chỉ có đen-trắng-xám?

Nhiều người mới nhìn sẽ hỏi "sao không vẽ luôn màu đẹp cho dễ xem?". Đây là **chủ ý thiết kế**, không phải làm ẩu.

Lý do: khi một bản vẽ có màu sắc đẹp, người xem sẽ **vô thức tập trung vào cái đẹp** — "nút này màu xanh chưa hợp", "phông chữ này chưa ưng", "logo để góc này xấu". Trong khi ở giai đoạn này, câu hỏi quan trọng lại là chuyện khác hẳn: **"màn hình này đã đủ các ô cần thiết chưa? Luồng đi có hợp lý không? Có sót màn nào không?"**

Bản đen trắng cố tình "xấu đều" để buộc mọi người bàn đúng chuyện cần bàn ở giai đoạn này — bố cục và nội dung, chứ chưa phải màu mè. Chuyện màu sắc để dành cho Mức 3 (`/prototype-html`), khi bố cục đã chốt.

Giống như khi xây nhà, kiến trúc sư đưa bản vẽ mặt bằng đen trắng trước (phòng nào ở đâu, cửa mở hướng nào) — chưa ai bàn màu sơn tường vội, vì bàn màu sơn khi còn chưa chốt vị trí phòng là vô nghĩa.

***

## 5. Vì sao phải có "bản đồ luồng" (user flow) trước khi vẽ?

Ở Giai đoạn 1, nếu chưa có tài liệu "user flow" — hoặc có nhưng chưa được duyệt — hệ thống sẽ **tự chạy `/user-flow` để có bản đồ đã chốt trước**, rồi mới quay lại vẽ. Vì sao bắt buộc phải có nó?

"User flow" trả lời câu hỏi: **tính năng này chia thành mấy luồng, và mỗi luồng gồm những màn hình nào, theo thứ tự nào.** Ví dụ tính năng "đăng nhập" có thể chia thành:
* Luồng "đăng nhập thường": màn nhập email → màn nhập mật khẩu → màn trang chủ.
* Luồng "quên mật khẩu": màn nhập email → màn nhập mã OTP → màn đặt lại mật khẩu.

Nếu không có bản đồ này, hệ thống sẽ không biết phải vẽ những màn nào và gộp chúng vào luồng nào — dễ vẽ thiếu, vẽ thừa, hoặc gộp lung tung.

Quan trọng hơn: **bản đồ luồng này được dùng CHUNG cho cả bản vẽ ASCII lẫn bản HTML.** Nghĩa là cả hai loại bản vẽ đều chia luồng giống hệt nhau, không bị lệch. Đây là "một nguồn sự thật duy nhất" cho việc chia luồng — sửa một chỗ, cả hai cùng theo.

**Một "trợ lý soát luồng" tham gia trước khi bản đồ được chốt.** Khi tạo bản đồ luồng (bằng lệnh `/user-flow`), hệ thống không tự vẽ xong là xong — nó mời một trợ lý chuyên trách tên **flow-reviewer** (vai "người soát trải nghiệm người dùng") đọc lại và bắt lỗi: có luồng nào bị cụt (đi vào rồi không có đường ra) không? có sót màn hình nào không (vd quên màn "báo link đã hết hạn")? đã phủ đủ các tình huống chưa (thành công / lỗi / các trường hợp biên như bấm hai lần, quay lại giữa chừng)? Trợ lý này góp ý, hệ thống sửa lại cho tốt hơn, rồi mới đưa bạn duyệt lần cuối. Nhờ vậy, tới lúc `/wireframe-html` bắt đầu vẽ, danh sách màn hình đã được rà khá kỹ — bạn ít khi vẽ xong mới phát hiện thiếu màn.

***

## 6. Quan hệ với bản vẽ ASCII — "đọc lại thay vì nghĩ lại"

Như đã nói ở Mục 2, bản ASCII và bản HTML là hai cách thể hiện của **cùng một màn hình**. Điều này dẫn tới một hành vi thông minh của hệ thống:

* Nếu bạn **chưa** vẽ bản ASCII → khi vẽ HTML, hệ thống tự đọc tài liệu nghiệp vụ để suy ra mỗi màn cần ô/nút gì.
* Nếu bạn **đã** vẽ bản ASCII trước rồi → khi vẽ HTML, hệ thống **đọc lại bảng mô tả của bản ASCII** và dùng lại y nguyên, thay vì tự suy luận lại từ đầu.

Vì sao điều này quan trọng? Hãy tưởng tượng bạn nhờ hai người vẽ cùng một căn phòng dựa trên cùng một mô tả, nhưng mỗi người tự hiểu theo ý mình — rất dễ ra hai bản vẽ khác nhau (một người vẽ 3 cửa sổ, người kia vẽ 2). Bằng cách bắt bản vẽ sau **đọc lại bản vẽ trước**, hệ thống đảm bảo bản ASCII và bản HTML luôn nói cùng một câu chuyện về từng màn hình — không "mỗi bản một phách".

Điều này chạy theo cả hai chiều: dù bạn vẽ ASCII trước hay HTML trước, bản chạy sau luôn tôn trọng bản chạy trước.

***

## 7. Vì sao phải HỎI kích thước màn hình trước khi vẽ?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Ở Giai đoạn 2, hệ thống dừng lại hỏi bạn muốn vẽ theo kích thước nào: **điện thoại (hẹp ~375px), máy tính bảng (~768px), hay máy tính (rộng ~1024px)**. Nó có gợi ý sẵn một lựa chọn hợp lý, nhưng vẫn **chờ bạn xác nhận** chứ không tự quyết. Gợi ý đó lấy từ đâu? Từ bản đồ luồng (nếu đã ghi thiết bị chính), hoặc từ file **`docs/design.md`** — bộ quy chuẩn thiết kế của dự án, nơi ghi các mốc kích thước màn hình chuẩn.

> **Lưu ý về `design.md` ở bản wireframe:** khác với bản mô phỏng có màu (`/prototype-html`) đọc `design.md` để lấy **màu sắc**, bản wireframe này cố tình **đen trắng** nên KHÔNG lấy màu từ đó. Nó chỉ tham khảo `design.md` ở phần **kích thước thiết bị** để gợi ý cho bạn. Nói cách khác: cùng một file `design.md`, nhưng mỗi lệnh lấy phần mình cần — wireframe lấy kích thước, prototype/Figma lấy cả màu.

Lý do: cùng một màn hình đăng nhập, nhưng trên điện thoại các ô sẽ xếp dọc, nút to full chiều ngang; còn trên máy tính thì ô nằm gọn giữa màn, hai bên là khoảng trống. **Kích thước thiết bị quyết định cách sắp xếp** — đó là một quyết định thiết kế thực sự, không phải chi tiết vặt.

Trước đây hệ thống từng vẽ mọi màn cùng một bề rộng cố định (kiểu "thẻ chiếm 1/3 màn"), khiến màn đăng nhập trên điện thoại và màn bảng điều khiển trên máy tính hiện ra cùng cỡ — trông giả và sai tỉ lệ. Nay hệ thống vẽ **đúng bề rộng thật của thiết bị bạn chọn**, nên tỉ lệ nhìn giống thật.

Nguyên tắc chung của cả bộ công cụ: **không tự quyết thay bạn những chuyện thuộc về quyết định thiết kế** — kể cả khi có vẻ đã rõ. Nó có thể *gợi ý*, nhưng người *chốt* là bạn.

Một chi tiết tinh tế: nếu bạn chốt kích thước mà bản đồ luồng chưa ghi lại, hệ thống sẽ đề nghị ghi lại vào đó — để lần sau (hoặc khi vẽ bản mô phỏng có màu) không phải hỏi lại bạn câu này nữa.

***

## 8. Bảng mô tả 5 cột — phần "ruột thịt" cho dev và tester

Cùng với hình vẽ, mỗi luồng còn kèm một **bảng mô tả chi tiết từng ô/nút**. Đây thường là phần giá trị nhất cho người sẽ code hoặc kiểm thử, vì hình vẽ chỉ cho thấy "trông ra sao", còn bảng này cho biết "hoạt động thế nào".

Bảng có 5 cột:

| Cột | Nghĩa là gì |
|---|---|
| **#** | Số thứ tự của ô/nút trên màn |
| **Items** | Tên ô/nút đó (vd "Ô nhập email", "Nút Đăng nhập") |
| **Control type** | Loại điều khiển — là ô nhập chữ, nút bấm, ô tích chọn, hay danh sách xổ xuống? |
| **Data type** | Cách người dùng tương tác — gõ chữ, bấm, chọn, hay chỉ để đọc? |
| **Description** | Mô tả đầy đủ: ô này để làm gì, bắt buộc hay không, ràng buộc ra sao, bấm vào thì đi đâu, báo lỗi gì nếu sai... |

Cột **Description** được viết **sâu, không hời hợt** — hệ thống được yêu cầu mô tả tới 6 khía cạnh cho mỗi ô (mục đích, ràng buộc, các trạng thái, dẫn đi màn nào, thông báo lỗi, các tình huống đặc biệt). Mục tiêu: đọc một dòng là hiểu đủ một ô, dev không phải đi lục tìm khắp nơi.

**Điểm đáng chú ý nhất:** nếu tài liệu nghiệp vụ **thiếu thông tin** — ví dụ nói "ô tên giới hạn 50 ký tự" nhưng không nói rõ được nhập ký tự gì (có cho ký tự đặc biệt không? tiếng Việt có dấu không?) — thì hệ thống **KHÔNG tự bịa ra quy tắc**. Nó dừng lại, hỏi bạn từng chỗ thiếu một. Đây là nguyên tắc quan trọng: **thà hỏi thêm còn hơn tự đoán bừa rồi ghi vào tài liệu**, vì một quy tắc bịa ra có thể khiến dev code sai.

***

## 9. Ví dụ thực tế

Anh **Minh**, một BA phụ trách tính năng "authentication" (đăng nhập), vừa họp xong và cần một bản nháp các màn hình để buổi chiều đưa team dev xem. Anh mở terminal, gõ:

```
/wireframe-html authentication
```

1) Hệ thống kiểm tra: tính năng `authentication` đã có sẵn tài liệu "user flow" (bản đồ luồng) — tốt, không cần tạo mới. Nó đọc và thấy tính năng này chia thành 2 luồng: "đăng nhập" và "quên mật khẩu".

2) Hệ thống hỏi anh Minh: *"Vẽ theo kích thước nào? Em gợi ý **điện thoại (375px)** vì tài liệu ghi ứng dụng này ưu tiên mobile."* Anh Minh gõ chọn điện thoại.

3) Hệ thống đọc mô tả nghiệp vụ, đồng thời phát hiện anh Minh đã vẽ bản ASCII cho luồng đăng nhập tuần trước — nên nó **đọc lại bản ASCII đó** để lấy danh sách ô/nút, thay vì nghĩ lại từ đầu.

4) Hệ thống cho anh Minh xem trước: *"Em sẽ tạo 2 file: luồng đăng nhập (gồm màn nhập email, màn nhập mật khẩu, màn trang chủ) và luồng quên mật khẩu (gồm màn nhập email, màn nhập OTP, màn đặt lại mật khẩu). Cộng thêm 1 file trang bìa để điều hướng. Đồng ý không?"* Anh Minh gõ `Y`.

5) Trong lúc vẽ, hệ thống gặp một chỗ mơ hồ: ô "mật khẩu mới" ở màn đặt lại có ghi "tối thiểu 8 ký tự" nhưng không nói có bắt buộc chữ hoa/số/ký tự đặc biệt không. Nó **dừng lại hỏi** anh Minh. Anh Minh trả lời "cần ít nhất 1 chữ hoa và 1 số". Hệ thống ghi đúng như vậy vào bảng mô tả, không tự bịa.

6) Vẽ xong, hệ thống tạo thêm file "trang bìa" `authentication-wireframe.html`. Anh Minh bấm đúp mở nó bằng Chrome — thấy menu bên trái liệt kê cả 2 luồng và mọi màn, bấm vào màn nào thì nhảy tới màn đó. Anh xem qua, thấy đủ và đúng bố cục điện thoại.

7) Buổi chiều, anh Minh chiếu file này lên họp. Team dev nhìn bản đen trắng, tập trung bàn đúng chuyện "luồng quên mật khẩu còn thiếu màn thông báo 'link đã hết hạn'" — chứ không sa đà vào màu mè. Anh Minh ghi nhận, lát nữa bổ sung.

Toàn bộ quá trình, anh Minh không bị bất ngờ: được hỏi kích thước trước, được xem trước danh sách sẽ vẽ, và mọi chỗ tài liệu thiếu đều được hỏi lại chứ không bịa.

***

## 10. Sau khi vẽ xong thì đi đâu tiếp — biến bản nháp thành thiết kế thật

Bản HTML đen trắng là để chốt bố cục. Khi bố cục đã ổn, bạn thường muốn nâng nó lên thành **thiết kế đẹp có màu, giống sản phẩm thật**. Ở bước dựng bản đẹp này, các công cụ phía sau lấy **bản vẽ nháp ASCII** (kèm bảng mô tả từng ô/nút) làm "bản thiết kế gốc" để dựng lên, thay vì bắt đầu từ số không — nên bạn cần có bản ASCII trước khi lên bản đẹp. Bản HTML đen trắng bạn vừa vẽ đóng vai trò **kiểm tra bố cục và tỉ lệ** ở giai đoạn nháp (và một số công cụ có thể tham khảo thêm nó), nhưng nguồn nội dung chính vẫn là bản ASCII.

Có mấy hướng đi tiếp, tùy bạn muốn dùng công cụ nào:

* **Vẽ thẳng lên Figma** (lệnh `/figma`) — Figma là công cụ thiết kế giao diện phổ biến nhất hiện nay. Hệ thống kết nối trực tiếp vào Figma và **vẽ thật từng màn hình lên đó**: đúng màu thương hiệu, đúng phông chữ, đúng khoảng cách (lấy từ bộ quy chuẩn thiết kế của dự án). Nó dựng dựa trên **bản vẽ nháp ASCII** — nên `/figma` **cần có bản ASCII trước** thì mới vẽ được (chưa có thì nó nhắc bạn vẽ ASCII trước, chứ không tự bịa bố cục). Bạn có thể chọn vẽ nhanh vài màn, hoặc vẽ cả tính năng kèm đủ các trạng thái (nút đang bấm, ô báo lỗi...). Sau đó designer chỉ việc tinh chỉnh trên Figma thay vì vẽ lại từ đầu.

* **Dựng qua Google Stitch hoặc Pencil.dev** — ngoài Figma, hệ thống còn có thể kết nối tới các công cụ tạo giao diện khác này (đây là hướng mở rộng, chưa phải một lệnh cố định như `/figma`). Cùng ý tưởng: lấy bố cục + bảng mô tả từ bản vẽ nháp làm đầu vào rồi dựng lên màn đẹp hơn. Hữu ích khi nhóm bạn quen dùng công cụ khác Figma, hoặc muốn thử nhanh nhiều phương án giao diện.

* **Bản mô phỏng bấm được** (lệnh `/prototype-html`) — nếu bạn chỉ cần một bản demo chạy trong trình duyệt (có màu, bấm nút chuyển màn như app thật) mà không cần mở công cụ thiết kế nào, đây là lựa chọn gọn nhất. Nó cũng dựng dựa trên bản ASCII làm nguồn nội dung màn.

> **Một điểm cần biết về Figma:** để hệ thống vẽ được lên Figma, bạn cần **mở Figma và bật một tiện ích kết nối (plugin)** trước. Nếu chưa bật, lệnh `/figma` sẽ dừng lại và hướng dẫn bạn từng bước bật nó — nó không tự vẽ liều khi chưa kết nối được. Đây là "cửa an toàn" để tránh vẽ nhầm chỗ.

Tóm lại chuỗi công việc thường là: **`/user-flow` (vạch luồng) → `/wireframe-ascii` (chốt bố cục nháp — bản HTML này là cách xem song song, hợp màn nhiều bảng/cột) → `/figma` / Stitch / Pencil / `/prototype-html` (dựng thiết kế đẹp, đều lấy bản ASCII làm gốc)**. Mỗi bước sau đều dựa trên kết quả bước trước.

***

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (từng Phase A–I, cách map ô/nút sang HTML, cấu trúc file template), đọc file gốc: `.claude/skills/wireframe-html/SKILL.md`.

Các lệnh liên quan:
* `/user-flow` — tạo "bản đồ luồng" mà lệnh này cần (chạy trước).
* `/wireframe-ascii` — bản vẽ nháp bằng ký tự, hiện trong khung chat (Mức 1); xem `explain-skills/wireframe-ascii.md`.
* `/figma` — vẽ thật lên Figma từ bản wireframe (đúng màu/phông thương hiệu); xem `explain-skills/figma.md`.
* `/prototype-html` — bản mô phỏng có màu, bấm chuyển màn như app thật (Mức 3).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
