---
type: skill-explainer
skill: prototype-next
updated: 2026-08-01
---

# `/prototype-next` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/prototype-next` là lệnh __viết code thật__ cho một ứng dụng web demo — bằng công nghệ mà dev thật sự dùng để làm sản phẩm (Next.js). Nó đọc tài liệu nghiệp vụ bạn đã viết, tự viết code, __tự chạy thử, tự sửa lỗi__, rồi báo cho bạn một đường dẫn để mở trong trình duyệt và bấm thử.

Bạn không cần biết code. Bạn chỉ cần trả lời vài câu hỏi nghiệp vụ ở đầu, rồi mở đường dẫn nó đưa.

Điểm khác biệt so với các bản demo trước: đây __không còn là bản mô phỏng nữa, mà là một ứng dụng web thật đang chạy trên máy bạn__ — chỉ thiếu phần máy chủ và cơ sở dữ liệu. Có địa chỉ trang riêng cho từng màn, bấm nút "quay lại" của trình duyệt hoạt động đúng, chưa đăng nhập thì bị đá về trang đăng nhập. Mọi thứ hành xử như một sản phẩm đang vận hành.

Vài tình huống nên dùng:

* Bạn cần một bản demo __tiến sát bản thật nhất có thể__ — để nhà đầu tư, khách hàng hoặc ban lãnh đạo trải nghiệm gần như sản phẩm hoàn chỉnh.
* Bạn muốn __gom nhiều tính năng vào một ứng dụng duy nhất__ — chạy lệnh cho tính năng thứ hai, thứ ba thì chúng cộng dồn vào cùng app, có chung thanh điều hướng, chung tài khoản đăng nhập.
* Bạn muốn __kiểm chứng xem tài liệu nghiệp vụ mình viết có chạy được không__ — vì lệnh này tự bấm thử và đối chiếu từng thông báo lỗi với bảng lỗi trong đặc tả (xem Mục 6).
* Nhóm dev sắp làm thật, và bạn muốn đưa họ một bản chạy được để thống nhất trước khi họ bỏ công.

Gõ lệnh đơn giản:

```
/prototype-next authentication
```

> __Một câu để nhớ:__ `/prototype-next` = "viết code thật thành một ứng dụng web demo chạy được, tự sửa lỗi, tự kiểm tra — bạn chỉ việc mở trình duyệt xem nghiệp vụ".

---

## 2. Khác gì `/prototype-html`?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Hai lệnh cùng làm ra bản demo bấm được, nhưng __khác nhau ở hình thức sản phẩm__, và điều đó quyết định bạn chọn cái nào.

```
 /prototype-html  →  MỘT FILE, bấm đúp là mở
        Giống một cuốn sách mẫu: cầm đi đâu cũng đọc được,
        gửi qua email/chat cho ai cũng mở được ngay.

 /prototype-next  →  MỘT ỨNG DỤNG, cần khởi động rồi mới vào
        Giống một cửa hàng mẫu đã dựng: phải mở cửa mới vào,
        nhưng bên trong đầy đủ và thật hơn hẳn.
```

| | `/prototype-html` | `/prototype-next` |
|---|---|---|
| Kết quả | 1 file, bấm đúp là mở | Một ứng dụng web, lệnh tự khởi động rồi đưa đường dẫn |
| Gửi cho người khác | Gửi file qua chat/email được ngay | Phải chia sẻ màn hình, hoặc nhờ dev đưa lên mạng |
| Nhiều tính năng | Mỗi tính năng một file riêng | __Cộng dồn vào cùng một ứng dụng__ |
| Ghim góp ý lên màn | Có | Không |
| Địa chỉ riêng cho từng màn | Không | Có — gửi được đường dẫn thẳng tới một màn |
| Gần bản thật | Mô phỏng rất giống | Là code thật, dev đọc được và tham khảo được |

__Chọn thế nào:__ cần gửi đi xa cho nhiều người góp ý → `/prototype-html`. Cần demo một sản phẩm nhiều tính năng, hoặc muốn tiến sát bản thật → `/prototype-next`.

Hai lệnh không thay thế nhau, và dùng cả hai cũng được: bản HTML để lấy góp ý sớm, bản Next.js để demo chính thức.

---

## 3. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
 BẠN GÕ LỆNH
 /prototype-next authentication
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Máy tự đọc tài liệu nghiệp vụ          │
 │  Một chương trình quét toàn bộ đặc tả và bóc ra:      │
 │  danh sách thông báo lỗi (kèm câu chữ chính xác),     │
 │  các quy tắc nghiệp vụ, dữ liệu, màn hình, luồng đi.  │
 │  → Máy làm phần này, không phải AI đọc (xem Mục 4)    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Hỏi bạn những gì tài liệu chưa nói      │
 │  Gom TẤT CẢ câu hỏi vào MỘT lần, tối đa 6 câu.        │
 │  Luôn hỏi: màn hình cỡ nào (điện thoại/máy tính).     │
 │  Trả lời xong là chạy một mạch, không ngắt nữa.       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Xin phép trước khi viết                 │
 │  Cho bạn xem: sẽ dựng những màn nào, ở địa chỉ nào,   │
 │  demo được luồng gì, dữ liệu mẫu ra sao, và những     │
 │  chỗ nó tự quyết định thay bạn. Bạn duyệt mới làm.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Viết code                               │
 │  Trước khi viết dòng đầu tiên, nó đọc bản "danh sách  │
 │  được phép dùng" (màu nào, nút nào đã có sẵn) để       │
 │  không tự chế mỗi màn một kiểu — xem Mục 5.           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Tự soát + tự sửa lỗi                    │
 │  Máy soát xem giao diện có bị lệch chuẩn không.        │
 │  Rồi thử build; lỗi máy tự sửa được thì tự sửa.        │
 │  Sửa mãi một lỗi không xong thì DỪNG, gọi AI vào.      │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 6 — Chạy thật + tự bấm thử                  │
 │  Khởi động ứng dụng, rồi tự mở trình duyệt bấm thử    │
 │  từng luồng và đối chiếu từng thông báo lỗi với        │
 │  bảng lỗi trong đặc tả — xem Mục 6.                   │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 BÁO CHO BẠN: đường dẫn để mở, tài khoản để đăng nhập thử,
 luồng nào demo được, lỗi nào bấm ra được, và những gì
 CHƯA làm được (nếu có — nó nói thẳng, không giấu).
```

---

## 4. Vì sao "để máy đọc tài liệu" lại quan trọng‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là điểm khiến lệnh này rẻ và chính xác hơn cách làm thông thường.

Cách ngây thơ là để AI đọc hết toàn bộ tài liệu đặc tả rồi tự nhớ. Vấn đề: tài liệu một tính năng có thể dài hàng chục trang. Đọc hết vừa __tốn tiền__ (AI tính tiền theo lượng chữ nó đọc), vừa __dễ nhớ nhầm__ — nhất là những câu thông báo lỗi phải đúng từng chữ.

Nên lệnh này chia việc:

__Máy làm phần chắc chắn đúng.__ Có một chương trình quét tài liệu và bóc ra dữ liệu có cấu trúc: mã lỗi nào, câu thông báo là gì, ngưỡng số bao nhiêu (khóa tài khoản sau mấy lần sai), màn hình có những ô nào. Máy làm việc này thì không bao giờ nhớ nhầm, và không tốn tiền.

__AI làm phần cần suy nghĩ.__ Đọc luồng người dùng để hiểu ý đồ, dịch một câu quy tắc thành đoạn code kiểm tra, quyết định bố cục màn trông thế nào, nghĩ ra dữ liệu mẫu có ý nghĩa.

Kết quả đo được: lượng chữ AI phải đọc giảm khoảng __hai phần ba__.

> __Máy cũng biết nói "tôi không đọc được".__ Nếu bảng mô tả màn hình viết theo kiểu khác lạ, hoặc tài liệu đã bị đánh dấu cũ, hoặc có mã lỗi nào không tìm thấy câu thông báo — chương trình __báo rõ ra__, chứ không im lặng trả về rỗng rồi để AI tự bịa. Chỗ nào máy không đọc được thì AI sẽ đọc tay chỗ đó.

---

## 5. Chống chuyện "màn thứ 12 trông khác màn thứ 1"

Đây là một vấn đề rất thật khi để AI vẽ nhiều màn hình liên tiếp: đến màn thứ mười mấy, nó __không còn nhớ__ những quyết định đã đưa ra ở màn đầu. Kết quả là mỗi màn một chiều rộng, mỗi chỗ một tông màu hơi lệch, và những nút bấm giống hệt nhau lại được dựng lại từ đầu thay vì dùng lại cái đã có.

Chúng tôi đã đo trên một bản demo 10 màn: có __9 chỗ lệch chuẩn__, trong đó một con số chiều rộng bị viết lại ở hai file khác nhau.

Cách xử lý: __không trông chờ AI nhớ, mà chặn bằng máy.__ Ba lớp:

__5.1. Bản danh sách "được phép dùng", sinh lại mỗi lần chạy.__ Trước khi viết màn nào, hệ thống quét chính code hiện có và lập ra danh sách: những màu nào hợp lệ, những nút/ô nào đã có sẵn, những màn nào đã dựng. AI __chỉ được dùng thứ trong danh sách này__. Cần thứ chưa có thì phải khai báo thêm cho đàng hoàng, không được tự chế tại chỗ.

Điểm quan trọng: danh sách này __được sinh ra từ code, không phải viết tay__. Danh sách viết tay sẽ cũ đi theo thời gian, mà cũ thì còn tệ hơn không có — vì AI tin nó.

__5.2. Một khuôn chung giữ chiều rộng và khoảng cách.__ Mọi màn đều nằm trong cùng một khuôn, và khuôn đó __không cho phép từng màn tự chỉnh__. Nghe hơi cứng nhắc, nhưng đó chính là điểm: mỗi lối cho phép chỉnh riêng là một đường để mọi thứ trôi dạt.

__5.3. Một chương trình soát lại sau khi viết.__ Nó tìm: mã màu viết thẳng thay vì dùng màu chuẩn, con số kích thước tự đặt, nút bấm dựng lại thay vì dùng cái có sẵn, và đặc biệt là __cùng một con số xuất hiện ở nhiều file__ — dấu hiệu rõ nhất cho thấy màn viết sau đã nghĩ lại thứ màn trước đã có.

Còn chỗ nào chưa đạt thì __chưa được báo là xong__.

> Ngoại lệ chính đáng vẫn có chỗ khai báo. Ví dụ logo Google bắt buộc dùng đúng bốn màu thương hiệu của họ — chỗ đó được ghi vào một danh sách miễn trừ riêng, để nó tường minh và có người nhìn qua, chứ không im lặng bỏ qua.

---

## 6. Tự bấm thử — vì "build xong" chưa chứng minh chạy đúng

Một cái bẫy dễ mắc: code biên dịch thành công, trang web mở được, và ta tưởng thế là xong. Nhưng __biên dịch thành công không chứng minh nghiệp vụ chạy đúng__ — bấm nút "Đăng nhập" mà không đi đâu cả thì code vẫn "sạch" như thường.

Nên sau khi chạy, hệ thống __tự mở trình duyệt và bấm thử__, rồi báo cáo tách làm __bốn mức riêng biệt__:

```
 Mức 1 — Trang mở được không?            (không lỗi, không trắng trang)
 Mức 2 — Các ô/nút có đúng như tài liệu?  (ô email, ô mật khẩu, nút gửi)
 Mức 3 — Bấm vào thì đi đúng chỗ không?   (đăng nhập xong có vào app)
 Mức 4 — Báo lỗi có đúng câu chữ không?   (đối chiếu từng chữ với đặc tả)
```

__Mức 4 là mức đáng giá nhất.__ Nó lấy đúng câu thông báo trong bảng lỗi của đặc tả, rồi kiểm xem app có hiện đúng câu đó không. Nói cách khác: nó biến bản demo thành __chỗ nghiệm thu tài liệu của bạn__ — nếu app hiện sai câu, hoặc nhánh lỗi không xảy ra, bạn biết ngay.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Báo cáo cố tình __không gộp bốn mức thành một chữ "đạt"__. Gộp lại là cách nhanh nhất để một lỗi lọt lưới mà ai cũng tưởng đã kiểm hết.

---

## 7. Trang tổng quan — cửa vào cho người xem

Khi mở đường dẫn, thứ đầu tiên bạn thấy __không phải một màn của sản phẩm__, mà là một __trang tổng quan__: mỗi tính năng một khối, mỗi luồng có sơ đồ bấm được, mỗi màn có một thẻ mô tả ngắn.

```
 ┌────────────────────────────────────────────────┐
 │  Tên sản phẩm · Bản mẫu                        │
 │  2 tính năng · 15 màn hình                     │
 │         [ Mở ứng dụng → ]                      │
 ├────────────────────────────────────────────────┤
 │  Xác thực tài khoản                            │
 │   Đăng nhập bằng email                         │
 │   ┌──────────────────────────────────────────┐ │
 │   │ Đăng nhập ──đúng──> Vào ứng dụng         │ │
 │   │ Nếu không vào được:                      │ │
 │   │   Sai mật khẩu · Khóa 24 giờ · Chưa xác  │ │
 │   └──────────────────────────────────────────┘ │
 │   [thẻ Đăng nhập]                              │
 │                                                │
 │  Thanh toán gói Premium          6 màn          │
 └────────────────────────────────────────────────┘
```

__Bấm vào ô nào trong sơ đồ là mở thẳng màn đó__ — không phải bấm lần lượt từ đầu mỗi lần muốn xem một màn ở giữa luồng. Muốn xem ứng dụng chạy bình thường thì bấm "Mở ứng dụng".

Trang này cố ý __tách bạch hai vai__. Nó không giả vờ là trang chủ của sản phẩm, vì nếu trộn hai thứ vào một thì người xem không biết đang nhìn sản phẩm hay nhìn mục lục.

Một chi tiết trong sơ đồ đáng nói: các nhánh lỗi được vẽ __rời nhau, không nối bằng mũi tên__. Nghe nhỏ nhưng quan trọng — "mật khẩu không đạt", "email đã đăng ký", "link hết hạn" là ba tình huống độc lập, nối chúng bằng mũi tên là vẽ sai nghiệp vụ, dù nhìn vẫn đẹp.

---

## 8. Bảng điều khiển demo — diễn kịch bản không cần thao tác thật

Ở góc dưới bên phải có một nút tròn nhỏ. Bấm vào ra một bảng bốn phần:

__Ép lỗi theo mã.__ Đây là phần đáng giá nhất. Danh sách lấy thẳng từ bảng lỗi trong đặc tả. Chọn "khóa tài khoản 24 giờ" rồi bấm đăng nhập — app diễn ngay cảnh đó. Không phải nhập sai mật khẩu năm lần liên tiếp mới xem được.

Chọn xong dùng __một lần rồi tự nhả__: bấm thấy màn lỗi, bấm tiếp là về bình thường — để bạn không bị kẹt trong trạng thái lỗi rồi tưởng app hỏng.

__Nhảy tới màn bất kỳ.__ Danh sách màn nhóm theo luồng. Màn nào cần điều kiện mới vào được (ví dụ màn đặt lại mật khẩu cần có mã hợp lệ) thì hệ thống dựng sẵn điều kiện rồi mới đưa bạn tới.

__Tài khoản mẫu.__ Mỗi tài khoản đại diện một trạng thái khác nhau: đã xác nhận, chưa xác nhận email, đang bị khóa, đăng nhập bằng Google chưa có mật khẩu. Bấm là vào thẳng.

Có một chi tiết cố ý: tài khoản __chưa đủ điều kiện đăng nhập__ (chưa xác nhận, đang khóa) thì bấm vào sẽ __không cho vào thẳng__, mà điền sẵn email vào màn đăng nhập để bạn bấm và thấy đúng nhánh lỗi. Cho vào thẳng là làm sai chính quy tắc đang muốn trình bày.

__Đặt lại và độ trễ.__ Nút xoá sạch dữ liệu về trạng thái ban đầu (khi bạn lỡ làm rối giữa buổi họp), và thanh chỉnh độ chậm giả để xem trạng thái "đang xử lý".

---

## 9. Chạy lệnh lần thứ hai — cộng dồn, không đập đi xây lại

Đây là điểm mạnh riêng của lệnh này. Chạy cho tính năng thứ hai:

```
/prototype-next premium-payment
```

Hệ thống __tự nhận ra đã có ứng dụng sẵn__ và chỉ __thêm vào__: màn mới, mục mới trong thanh điều hướng, dữ liệu mới. Code của tính năng cũ giữ nguyên. Kết quả là __một ứng dụng có nhiều tính năng__, dùng chung tài khoản đăng nhập và thanh điều hướng — chứ không phải mấy bản demo rời rạc.

Chạy lại __cùng một tính năng__ thì nó so code hiện có với tài liệu mới nhất, chỉ sửa phần lệch, và cho bạn xem thay đổi trước khi áp.

---

## 10. Những gì lệnh này KHÔNG làm

Nói rõ ranh giới để bạn không kỳ vọng nhầm:

* __Không có máy chủ, không có cơ sở dữ liệu.__ Mọi dữ liệu nằm trong trình duyệt của bạn. Người khác mở trên máy họ sẽ thấy dữ liệu riêng của họ.
* __Không kết nối hệ thống thật.__ Không đăng nhập Google thật, không thanh toán thật, không gửi email thật. Nút "Đăng nhập với Google" mở ra một hộp thoại giả.
* __Không phải code để đưa lên sản phẩm.__ Nó là bản mẫu — dev đọc tham khảo được, nhưng bản thật cần máy chủ, bảo mật và nhiều thứ khác.
* __Không tự bịa nghiệp vụ.__ Chỗ nào tài liệu không nói, nó hỏi bạn hoặc ghi rõ vào phần "những điều đã tự quyết" — chứ không tự nghĩ ra quy tắc rồi làm như thể đặc tả có.
* __Không giấu lỗi.__ Nếu build không xong, hoặc bấm thử thất bại, nó __nói thẳng cái gì chưa chạy__ thay vì báo hoàn tất.

---

## 11. Ví dụ thực tế

Anh __Tuấn__, BA của một ứng dụng học tiếng Anh, cần demo cho ban lãnh đạo. Anh đã có sẵn đặc tả tính năng đăng nhập. Anh gõ:

```
/prototype-next authentication
```

1. Máy quét tài liệu, bóc ra 10 mã lỗi kèm câu thông báo, 31 yêu cầu chức năng, 11 quy tắc nghiệp vụ, 11 màn hình, 39 thành phần giao diện. Nó cảnh báo hai điều: tài liệu đang được đánh dấu __cũ__ (có thể lệch bản mới nhất), và __hai mã lỗi không tìm thấy câu thông báo__ trong đặc tả.

2. Hệ thống hỏi anh Tuấn một lượt bốn câu: *"Màn hình cỡ nào — điện thoại, máy tính bảng hay máy tính để bàn?"*, *"Đăng nhập xong thì vào màn nào?"*, *"Trang đó hiện dữ liệu gì?"*, và *"Hai mã lỗi này chưa có câu thông báo, anh muốn hiện câu gì?"*. Anh trả lời một lần.

3. Hệ thống cho anh xem kế hoạch: sẽ dựng 10 màn ở những địa chỉ nào, demo được bốn luồng, có ba tài khoản mẫu ở ba trạng thái khác nhau, kèm dòng nhắc *"tài liệu nguồn đang cũ"*. Anh gõ `Y`.

4. Viết code. Trước khi viết, nó đọc bản danh sách được phép dùng: 36 màu, 11 nút/ô có sẵn.

5. Soát giao diện: phát hiện một chỗ tự đặt chiều rộng và một ô nhập liệu dựng lại thay vì dùng cái có sẵn. __Tự sửa cả hai.__ Soát lại: sạch.

6. Build: xanh ngay lần đầu. Khởi động ứng dụng.

7. __Tự bấm thử:__ mở bốn trang, kiểm các ô, đăng nhập bằng tài khoản mẫu và xác nhận vào đúng trang chủ, rồi ép hai nhánh lỗi và __đối chiếu từng chữ__ — cả hai đều khớp đặc tả. Báo cáo: 11/11 đạt, tách rõ bốn mức.

8. Hệ thống báo: đường dẫn để mở, tài khoản đăng nhập thử, bốn luồng demo được, mười mã lỗi bấm ra được từ bảng điều khiển, và hai điều cần biết — *tài liệu nguồn đang cũ*, và *hai câu thông báo lỗi là do anh cung cấp chứ không có trong đặc tả, nên cân nhắc bổ sung vào tài liệu*.

Anh Tuấn mở đường dẫn, thấy trang tổng quan có sơ đồ luồng bấm được. Anh bấm thẳng vào ô "Khóa 24 giờ" để xem màn đó trông thế nào — không phải nhập sai mật khẩu năm lần. Tại buổi họp, anh cho ban lãnh đạo tự bấm thử; họ đăng ký một tài khoản, xác nhận email, đăng nhập vào app.

Tuần sau anh chạy tiếp `/prototype-next premium-payment` — màn thanh toán cộng vào cùng ứng dụng đó, dùng chung tài khoản đăng nhập.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem chi tiết kỹ thuật (từng giai đoạn, cách các chương trình bóc tài liệu hoạt động, cấu trúc code sinh ra), đọc file gốc: `.claude/skills/prototype-next/SKILL.md`.

Tài liệu / lệnh liên quan:
* `/prototype-html` — bản demo một file gửi kèm được, có lớp ghim góp ý. Xem so sánh ở Mục 2; chi tiết ở `explain-skills/prototype-html.md`.
* `/srs` — viết đặc tả nghiệp vụ, __nguồn chính__ mà lệnh này đọc (thông báo lỗi, quy tắc, ngưỡng số); xem `explain-skills/srs.md`.
* `/user-flow` — dựng bản đồ luồng, cho biết tính năng có mấy luồng và mỗi luồng gồm màn nào; xem `explain-skills/user-flow.md`.
* `/wireframe-ascii` — bản vẽ nháp kèm bảng mô tả từng ô/nút, nguồn nội dung màn; xem `explain-skills/wireframe-ascii.md`.
* **`docs/design.md`** — bộ quy chuẩn thiết kế của dự án (màu, phông, khoảng cách). Tùy dự án: có thì lệnh này dùng, không có thì nó dùng bộ màu trung tính và __nói rõ__ cho bạn biết, chứ không tự chế.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
