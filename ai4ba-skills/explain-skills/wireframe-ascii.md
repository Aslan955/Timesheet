---
type: skill-explainer
skill: wireframe-ascii
updated: 2026-07-13
---

# `/wireframe-ascii` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/wireframe-ascii` là lệnh vẽ __bản nháp màn hình nhanh nhất, thô nhất__ — vẽ bằng chính các __ký tự trên bàn phím__ (gạch ngang `─`, gạch dọc `│`, góc `┌ ┐ └ ┘`), và __hiện ngay trong cửa sổ chat__ để bạn xem liền, không cần mở trình duyệt, không cần cài gì.

Bạn có thể hình dung nó giống như __vẽ nháp một màn hình lên giấy kẻ ô ly bằng bút chì__: nguệch ngoạc, chưa đẹp, nhưng đủ để nói "màn này có một ô nhập tên ở trên, một nút bấm ở dưới". Nhìn nó sẽ ra như thế này:

```
┌──────────────────────────────┐
│  Đăng nhập                    │
├──────────────────────────────┤
│  Email                        │
│  [__________________]         │
│  Mật khẩu                     │
│  [__________________]         │
│                               │
│  [   Đăng nhập   ]            │
│  < Quên mật khẩu? >           │
└──────────────────────────────┘
```

Vài tình huống điển hình nên dùng `/wireframe-ascii`:

* Bạn muốn phác nhanh các màn hình ngay trong lúc trao đổi, xem liền trong chat, không muốn mở file hay trình duyệt.
* Bạn cần một bản để dán vào tin nhắn / tài liệu / pull request cho đồng nghiệp xem qua — chữ thuần nên dán đâu cũng đọc được.
* Bạn muốn duyệt __cấu trúc__ của màn (có đủ ô/nút chưa, sắp xếp có hợp lý không) trước khi tốn công vẽ bản đẹp hơn.

Gõ lệnh đơn giản như:

```
/wireframe-ascii authentication
```

Trong đó `authentication` là tên tính năng bạn muốn vẽ.

> __Một câu để nhớ:__ `/wireframe-ascii` = "phác nhanh các màn hình bằng ký tự bàn phím, hiện ngay trong chat để duyệt cấu trúc".

---

## 2. Lệnh này đứng ở đâu trong 3 mức độ bản vẽ?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trong bộ công cụ này có __3 lệnh cùng vẽ màn hình__, ở 3 mức "thật" khác nhau. `/wireframe-ascii` là __mức thô nhất__ — nhưng cũng là mức nhanh nhất.

```
 MỨC 1 — NHÁP BẰNG KÝ TỰ, HIỆN TRONG CHAT  ◄── /wireframe-ascii LÀ MỨC NÀY
 Vẽ bằng ─ │ ┌ ┐, hiện ngay trong khung chat.
 Nhanh nhất, xem liền, dán đâu cũng được. Nhìn như vẽ tay.
        │
        ▼
 MỨC 2 — BẢN VẼ HTML ĐEN TRẮNG
 /wireframe-html
 Mở bằng trình duyệt, có nút/ô thật, đúng tỉ lệ điện thoại/máy tính.
        │
        ▼
 MỨC 3 — BẢN MÔ PHỎNG CÓ MÀU, BẤM ĐƯỢC
 /prototype-html
 Có màu, bấm nút chuyển màn như app thật. Dùng để demo cho khách/sếp.
```

Có một điểm cần làm rõ để khỏi nhầm: __Mức 1 (ASCII) và Mức 2 (HTML) KHÔNG phải là "thô" và "tinh" của nhau — chúng là hai CÁCH THỂ HIỆN của cùng một màn hình__, dùng cho hai mục đích khác nhau:
* Bản ASCII (Mức 1): xem nhanh trong chat, tiện dán vào tin nhắn/tài liệu.
* Bản HTML (Mức 2): xem đúng tỉ lệ thật trên khung điện thoại/máy tính trong trình duyệt.

Vì là "cùng một màn hình", nên nếu bạn đã vẽ bản này rồi thì khi vẽ bản kia, hệ thống __đọc lại bản đã có để dùng lại thông tin__ thay vì nghĩ lại từ đầu — đảm bảo hai bản không nói khác nhau. (Xem thêm Mục 6.)

Còn Mức 3 (`/prototype-html`) mới thực sự là bậc "tinh" hơn hẳn: có màu, bấm được, giống app thật.

### ASCII giỏi việc gì, và khi nào nên chuyển sang HTML?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Vẽ bằng ký tự rất tiện cho __màn hình đơn giản__ — một form đăng nhập vài ô, một hộp thoại xác nhận, một màn nhập OTP. Những màn kiểu đó ít phần tử, xếp dọc gọn gàng, nên ký tự thể hiện tốt và bạn xem được liền trong chat.

Nhưng ký tự __đuối rõ rệt với màn hình phức tạp__ — nhất là những màn nhiều nút, nhiều cột, có __bảng dữ liệu__ (ví dụ trang bảng điều khiển / báo cáo dashboard). Lý do rất thực tế:

* Bảng nhiều cột vẽ bằng ký tự thì __các cột khó thẳng hàng__, nhìn rối mắt.
* Không thể hiện được đúng __tỉ lệ và kích cỡ__ (cột nào rộng, cột nào hẹp) — mọi thứ bị bó vào bề rộng ký tự cố định.
* Bảng dài hoặc màn nhiều thành phần thì trông __không gọn, không giống màn thật__.

Với những màn kiểu đó, **hãy chuyển sang bản HTML (`/wireframe-html`)**. Bản HTML dùng phần tử bảng thật của trình duyệt nên các cột tự căn thẳng, đúng tỉ lệ, và bạn tinh chỉnh cho "hiển thị vừa vặn" được — điều mà ASCII chịu thua.

```
 Màn ĐƠN GIẢN (form, hộp thoại, vài ô + nút)
   → ASCII là lựa chọn tốt: nhanh, xem liền trong chat.

 Màn PHỨC TẠP (dashboard, bảng báo cáo nhiều cột, nhiều nút)
   → Chuyển sang /wireframe-html: cột thẳng hàng, đúng tỉ lệ, gọn.
     Vẽ mấy màn này bằng ASCII sẽ rối và sai kích cỡ.
```

Nói gọn: __ít ô, xếp dọc → ASCII; nhiều bảng/cột → HTML.__

---

## 3. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm đặc trưng nhất của lệnh này so với các lệnh khác: nó có __vòng lặp sửa ngay trong chat__. Nó vẽ ra cho bạn xem, bạn chê chỗ nào thì nó vẽ lại chỗ đó, tới khi bạn ưng mới lưu.

```
 BẠN GÕ LỆNH
 /wireframe-ascii authentication
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Kiểm tra "đã có bản đồ luồng chưa?"     │
 │  Cần tài liệu "user flow" (bản đồ luồng) để biết      │
 │  tính năng chia mấy luồng, mỗi luồng gồm màn nào.     │
 │  CHƯA CÓ, hoặc CÓ NHƯNG CHƯA DUYỆT → hệ thống tự chạy │
 │  /user-flow trước để có bản đồ đã chốt.               │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — HỎI: vẽ theo kích thước màn hình nào?   │
 │  Điện thoại (khung hẹp) / Máy tính (khung rộng)?      │
 │  Kích thước quyết định bề rộng khung ASCII. Hệ thống  │
 │  gợi ý sẵn rồi CHỜ bạn xác nhận, không tự quyết.       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Đọc tài liệu để biết mỗi màn có gì      │
 │  Đọc mô tả nghiệp vụ (yêu cầu, quy tắc) để biết mỗi   │
 │  màn cần ô/nút gì. Nếu bản HTML đã vẽ trước → đọc lại. │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — VẼ RA TRONG CHAT, CHỜ BẠN DUYỆT         │  ◄── vòng lặp
 │  Hệ thống vẽ nguyên một luồng bằng ký tự, hiện thẳng  │      sửa
 │  trong chat, rồi hỏi:                                  │
 │      "Đồng ý / Sửa: <nói cần đổi gì> / Hủy"           │
 │                                                        │
 │  • Bạn gõ "Đồng ý"  → chốt, đi tiếp.                   │
 │  • Bạn gõ "Sửa: cho nút to hơn" → vẽ lại bản mới.      │
 │  • Bạn gõ "Hủy"     → dừng, không lưu gì.              │
 │                                                        │
 │  Sửa tối đa 3 lần cho mỗi luồng (xem Mục 5).           │
 └──────────────────────────────────────────────────────┘
        │
        │  (chỉ lưu khi bạn "Đồng ý")
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Xin phép lần cuối rồi mới ghi file      │
 │  Cho bạn xem trước sẽ tạo file nào, gõ Y để lưu.      │
 │  KÈM THEO: bảng mô tả chi tiết từng ô/nút (5 cột)     │
 │  để dev/tester đọc hiểu đầy đủ (xem Mục 7).           │
 │                                                        │
 │  ⚠ Nếu tài liệu thiếu thông tin → DỪNG HỎI BẠN,       │
 │  không tự bịa quy tắc.                                 │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — file lưu tại docs/{feature}/ascii-wireframe/
```

---

## 4. Vì sao lại vẽ bằng ký tự bàn phím — nghe có vẻ "cổ lỗ"?

Vẽ màn hình bằng gạch ngang gạch dọc nghe như công nghệ từ thời máy tính đen trắng. Nhưng đây là lựa chọn có chủ đích, và lý do đều xoay quanh một chữ: __nhanh và rẻ__.

1. __AI tạo ra rất nhanh, tốn ít "công".__ Vì chỉ là chữ thuần, AI dựng một bản ASCII gần như tức thì — nhẹ hơn nhiều so với dựng một file HTML có màu, có bố cục phức tạp. Nói theo ngôn ngữ vận hành: nó tốn rất ít "token" (đơn vị tính chi phí khi làm việc với AI), nên vừa nhanh vừa rẻ. Bạn có thể vẽ đi vẽ lại nhiều lần mà không ngại tốn kém.

2. __Xem được ngay trong chat, review liền.__ Bản ASCII hiện thẳng trong cửa sổ trò chuyện — không phải lưu file, không phải mở trình duyệt. Nhìn phát thấy liền, góp ý được ngay tại chỗ. Cực tiện khi đang trao đổi qua lại và muốn duyệt nhanh.

3. __Sửa và cập nhật dễ.__ Muốn đổi gì chỉ cần nói, AI vẽ lại bản mới trong tích tắc. Không có chuyện phải mở công cụ thiết kế, kéo thả, canh chỉnh pixel. Chính vì "rẻ và nhanh để làm lại", ASCII rất hợp cho giai đoạn còn đang bàn tới bàn lui, chưa chốt.

Nói ngắn gọn: khi bạn chỉ cần "phác nhanh cho dễ hình dung rồi bàn tiếp", ký tự bàn phím là công cụ tiện nhất — vì nó rẻ, nhanh tạo, và dễ sửa.

---

## 5. Vòng lặp "Đồng ý / Sửa / Hủy" — điểm khác biệt lớn nhất

Đây là thứ khiến `/wireframe-ascii` khác hẳn nhiều lệnh khác. Vì bản vẽ hiện thẳng trong chat, bạn có thể __xem và yêu cầu sửa ngay tại chỗ__, nhiều vòng, trước khi bất cứ gì được lưu.

Cách hoạt động: hệ thống vẽ nguyên một luồng ra chat, rồi hỏi bạn ba lựa chọn:
* __"Đồng ý"__ → bạn ưng bản này, hệ thống chốt và đi tiếp.
* __"Sửa: ..."__ → bạn nói cần đổi gì (vd "cho nút đăng nhập xuống dưới ô mật khẩu", "thêm ô nhập số điện thoại"), hệ thống vẽ lại một bản mới ngay.
* __"Hủy"__ → dừng hẳn, không lưu gì.

Vòng sửa này __tối đa 3 lần__ cho mỗi luồng. Vì sao có giới hạn? Để tránh việc chỉnh tới lui vô tận không bao giờ chốt. Đến lần thứ 3, hệ thống sẽ chốt bản đó lại và đi tiếp — nếu vẫn còn muốn chỉnh chi tiết nhỏ, bạn tự sửa tay trong file sau cũng được. Đây là cách buộc mọi người "chốt cái khung trước, tỉa chi tiết sau".

Điểm hay của việc sửa-ngay-trong-chat: bạn thấy kết quả tức thì sau mỗi lần góp ý, không phải chờ lưu file rồi mở ra xem rồi mới biết đúng ý chưa.

> __Lưu ý nhỏ:__ khi lệnh này được gọi tự động bên trong một quy trình lớn hơn (lệnh `/srs` chạy cả dây chuyền), vòng lặp sửa này được bỏ qua để không làm gián đoạn — hệ thống vẽ luôn bản đầu. Vòng lặp chỉ bật khi bạn gõ `/wireframe-ascii` trực tiếp một mình.

---

## 6. Quan hệ với bản vẽ HTML và "bản đồ luồng"‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Hai điều này giống hệt lệnh `/wireframe-html`, nên chỉ tóm tắt lại:

__"Bản đồ luồng" (user flow) phải có VÀ đã được duyệt trước.__ Ở Giai đoạn 1, nếu chưa có tài liệu "user flow" — hoặc có nhưng chưa được duyệt — hệ thống sẽ tự chạy `/user-flow` trước để có bản đồ đã chốt, rồi mới vẽ. (Bản đồ chưa duyệt không được dùng để chia luồng, vì nó có thể còn đổi.) Bản đồ này được __dùng chung cho cả bản ASCII lẫn bản HTML__, nên hai loại bản vẽ luôn chia luồng giống nhau, không lệch.

Khi tạo bản đồ luồng đó, có một __"trợ lý soát trải nghiệm người dùng"__ (tên `flow-reviewer`) được mời vào rà lại trước khi chốt: nó bắt các lỗi như luồng bị cụt (vào rồi không có đường ra), sót màn hình, hoặc thiếu tình huống (chưa phủ trường hợp lỗi / trường hợp biên). Nhờ bước soát này, tới lúc `/wireframe-ascii` bắt đầu vẽ thì danh sách màn đã tương đối đầy đủ — đỡ cảnh vẽ xong mới phát hiện thiếu màn.

__Đọc lại bản HTML nếu đã có.__ Vì bản ASCII và bản HTML là hai cách thể hiện của cùng một màn hình, nếu bạn đã vẽ bản HTML trước rồi thì khi vẽ ASCII, hệ thống __đọc lại thông tin từ bản HTML__ thay vì tự nghĩ lại. Nhờ vậy hai bản không "mỗi bản một phách". Điều này chạy theo cả hai chiều — ai chạy trước thì thành nguồn cho cái chạy sau.

**Về file `docs/design.md`.__ Ở Giai đoạn 2, khi hỏi bạn vẽ theo kích thước nào, gợi ý mặc định được lấy từ bản đồ luồng hoặc từ file __`docs/design.md`** — bộ quy chuẩn thiết kế của dự án (ghi màu sắc, phông chữ, các mốc kích thước màn hình chuẩn). Nhưng lưu ý: bản ASCII cố tình chỉ dùng ký tự đen trắng nên __không lấy màu__ từ file này — nó chỉ mượn phần __kích thước__ để gợi ý cho bạn. Phần màu sắc trong `design.md` để dành cho các lệnh dựng bản đẹp (`/prototype-html`, `/figma`) dùng ở bước sau.

---

## 7. Bảng mô tả 5 cột và quy tắc "không bịa"

Giống các lệnh vẽ màn khác, mỗi luồng còn kèm một __bảng mô tả chi tiết từng ô/nút__ — thường là phần giá trị nhất cho dev và tester, vì hình vẽ chỉ cho thấy "trông ra sao" còn bảng cho biết "hoạt động thế nào".

Bảng có 5 cột: __#__ (số thứ tự), __Items__ (tên ô/nút), __Control type__ (là ô nhập / nút / ô tích / danh sách xổ...), __Data type__ (gõ chữ / bấm / chọn / chỉ đọc), và __Description__ (mô tả đầy đủ: để làm gì, bắt buộc không, ràng buộc ra sao, bấm đi đâu, báo lỗi gì).

Cột __Description__ được viết __sâu__, tới 6 khía cạnh cho mỗi ô, để đọc một dòng là hiểu đủ.

__Quy tắc quan trọng nhất — không bịa:__ nếu tài liệu nghiệp vụ thiếu thông tin (vd nói "ô này tối đa 50 ký tự" nhưng không nói cho nhập ký tự gì), hệ thống __KHÔNG tự đặt ra quy tắc__. Nó dừng lại hỏi bạn từng chỗ thiếu. Thà hỏi thêm còn hơn ghi một quy tắc bịa vào tài liệu khiến dev code sai.

Chi tiết này giống hệt `/wireframe-html` — vì cả hai dùng __chung một bảng mô tả 5 cột__.

---

## 8. Vì sao CẤM emoji bên trong khung vẽ? (chi tiết thú vị)

Đây là một quy tắc riêng của bản ASCII, đáng giải thích vì nó rất dễ hiểu và cho thấy sự tỉ mỉ trong thiết kế.

Bạn có thể nghĩ "thêm vài icon 👁 🔊 ⭐ vào cho sinh động thì sao?". Vấn đề: khung vẽ ASCII chỉ vuông vắn khi __mọi ký tự rộng bằng nhau__. Emoji lại __rộng không đều__ — nên chỉ cần một cái lọt vào khung là __đường viền lệch, khung méo xẹo__:

```
┌──────────────────┐        ┌──────────────────┐
│  Xem mật khẩu    │  ✅     │  Xem mật khẩu 👁 │  ❌ (viền lệch)
│  [___________]   │        │  [___________]  │
└──────────────────┘        └──────────────────┘
```

Cách xử lý: bên trong khung, thay vì emoji, hệ thống dùng __ký hiệu chữ__ như `(eye)` (thay 👁), `(play)` (thay 🔊), `[IMG: ảnh sản phẩm]` (thay chỗ để hình). Emoji chỉ được dùng ở __cột mô tả__ (phần chữ ngoài khung, không cần thẳng hàng).

Tóm lại: quy tắc này không phải khó tính vô cớ — nó đảm bảo bản vẽ luôn vuông vắn, đọc được, không bị "trông giả" vì viền méo.

---

## 9. Ví dụ thực tế

Chị __Hà__, một BA, đang trao đổi nhanh với đồng nghiệp qua chat về tính năng "authentication" (đăng nhập) và muốn phác vài màn hình để cả hai cùng hình dung. Chị gõ:

```
/wireframe-ascii authentication
```

1. Hệ thống kiểm tra: tính năng `authentication` đã có "bản đồ luồng" — tốt. Nó thấy có 2 luồng: "đăng nhập" và "quên mật khẩu".

2. Hệ thống hỏi kích thước. Chị Hà chọn "điện thoại" vì app này chủ yếu dùng trên mobile. Khung ASCII sẽ vẽ hẹp cho đúng tỉ lệ điện thoại.

3. Hệ thống đọc tài liệu, vẽ nguyên luồng "đăng nhập" ra chat: màn nhập email, màn nhập mật khẩu, màn trang chủ — tất cả bằng ký tự, hiện thẳng trong cửa sổ chat.

4. Chị Hà nhìn, thấy thiếu nút "Đăng nhập bằng Google". Chị gõ: `Sửa: thêm nút đăng nhập bằng Google dưới nút đăng nhập thường`. Hệ thống vẽ lại bản mới có thêm nút đó ngay lập tức.

5. Lần này chị Hà thấy ổn, gõ `Đồng ý`.

6. Khi lập bảng mô tả, hệ thống gặp chỗ mơ hồ: ô mật khẩu ghi "tối thiểu 8 ký tự" nhưng tài liệu không nói có cần chữ hoa/số không. Nó __dừng hỏi__ chị Hà. Chị trả lời "cần 1 chữ hoa và 1 số". Hệ thống ghi đúng vậy, không bịa.

7. Hệ thống xin phép lần cuối, cho chị Hà xem sẽ tạo file nào, chị gõ `Y`. File được lưu. Chị copy nguyên bản ASCII trong chat, dán thẳng vào tin nhắn gửi đồng nghiệp — bên kia đọc được ngay, không cần mở gì.

8. Hôm sau chị Hà muốn xem bản đẹp hơn đúng tỉ lệ trình duyệt, chị chạy `/wireframe-html authentication`. Lệnh đó __đọc lại bản ASCII chị vừa vẽ__ để dùng lại danh sách ô/nút — nên bản HTML khớp y hệt bản ASCII, không phải làm lại từ đầu.

Toàn bộ quá trình, chị Hà chủ động: xem ngay trong chat, sửa tới khi ưng, được hỏi mọi chỗ thiếu, và bản vẽ dùng lại được cho bước sau.

---

## 10. Sau khi vẽ xong thì đi đâu tiếp — biến bản nháp thành thiết kế thật

Bản ASCII là để __chốt nhanh cấu trúc__. Khi cấu trúc đã ổn, bạn thường muốn nâng nó lên thành thiết kế đẹp có màu. Điểm mạnh ở đây: bản ASCII của bạn chính là __bản thiết kế gốc__ mà các công cụ vẽ đẹp đọc lại để dựng lên — không phải làm lại từ đầu, và thiết kế đẹp luôn khớp với cấu trúc đã duyệt.

Có mấy hướng đi tiếp, tùy công cụ bạn muốn dùng:

* __Vẽ thẳng lên Figma__ (lệnh `/figma`) — Figma là công cụ thiết kế giao diện phổ biến nhất. Hệ thống kết nối trực tiếp vào Figma và __vẽ thật từng màn__ với đúng màu thương hiệu, phông chữ, khoảng cách (lấy từ bộ quy chuẩn thiết kế của dự án). Bản ASCII bạn vừa vẽ được dùng làm khuôn bố cục — nên `/figma` __bắt buộc phải có bản ASCII trước__ thì mới vẽ được (không có thì nó sẽ nhắc bạn vẽ ASCII trước, chứ không tự bịa layout).

* __Dựng qua Google Stitch hoặc Pencil.dev__ — ngoài Figma, hệ thống còn có thể kết nối tới các công cụ tạo giao diện khác này (đây là hướng mở rộng, chưa phải một lệnh cố định như `/figma`). Cùng ý tưởng: lấy bố cục + bảng mô tả từ bản ASCII của bạn làm đầu vào rồi dựng lên màn đẹp hơn. Hữu ích khi nhóm bạn quen dùng công cụ khác Figma hoặc muốn thử nhanh nhiều phương án.

* __Bản mô phỏng bấm được__ (lệnh `/prototype-html`) — nếu chỉ cần bản demo chạy trong trình duyệt (có màu, bấm nút chuyển màn như app thật), đây là lựa chọn gọn nhất, không cần mở công cụ thiết kế nào. Nó cũng đọc bản ASCII của bạn làm nền.

> __Một điểm cần biết về Figma:__ để hệ thống vẽ được lên Figma, bạn cần __mở Figma và bật một tiện ích kết nối (plugin)__ trước. Chưa bật thì lệnh `/figma` dừng lại và hướng dẫn bạn từng bước — nó không vẽ liều khi chưa kết nối. Đây là "cửa an toàn" tránh vẽ nhầm chỗ.

Tóm lại chuỗi công việc thường là: **`/user-flow` (vạch luồng) → `/wireframe-ascii` (chốt cấu trúc nhanh; màn phức tạp thì `/wireframe-html`) → `/figma` / Stitch / Pencil / `/prototype-html` (dựng thiết kế đẹp)**. Mỗi bước sau dựa trên kết quả bước trước.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (từng Phase A–E, bộ ký tự quy ước, cấu trúc file), đọc file gốc: `.claude/skills/wireframe-ascii/SKILL.md`.

Các lệnh liên quan:
* `/user-flow` — tạo "bản đồ luồng" mà lệnh này cần (chạy trước).
* `/wireframe-html` — bản vẽ đen trắng mở bằng trình duyệt, đúng tỉ lệ thiết bị; __nên dùng cho màn nhiều bảng/cột__ (cùng bậc, xem `explain-skills/wireframe-html.md`).
* `/figma` — vẽ thật lên Figma từ bản ASCII (đúng màu/phông thương hiệu; cần có ASCII trước); xem `explain-skills/figma.md`.
* `/prototype-html` — bản mô phỏng có màu, bấm chuyển màn như app thật; đọc bản ASCII làm nền.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
