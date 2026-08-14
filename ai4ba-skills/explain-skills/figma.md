---
type: skill-explainer
skill: figma
updated: 2026-07-26
---

# `/figma` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/figma` là lệnh __vẽ thật màn hình lên Figma__ — Figma là công cụ thiết kế giao diện phổ biến nhất hiện nay, nơi designer thường ngồi làm việc. Thay vì bạn (hoặc designer) phải vẽ tay từng ô, từng nút, lệnh này __nối thẳng vào Figma đang mở trên máy bạn và vẽ hộ__, đúng màu thương hiệu, đúng phông chữ, đúng khoảng cách của dự án.

Hình dung thế này: bản nháp ASCII giống __bản vẽ bút chì trên giấy ô ly__. `/figma` là người thợ cầm bản nháp đó, ngồi vào máy, và __dựng lại thành bản vẽ kỹ thuật có màu, đúng tỉ lệ__ — thứ mà designer có thể mở ra tinh chỉnh tiếp, hoặc dev nhìn vào để code.

Vài tình huống điển hình nên dùng `/figma`:

- Cấu trúc màn đã chốt xong ở bản nháp, giờ muốn có bản đẹp để đưa designer tinh chỉnh hoặc trình cho khách/sếp.
- Muốn dựng nhanh cả một tính năng lên Figma kèm đủ các trạng thái (nút đang bấm, ô báo lỗi) mà không phải vẽ tay từng cái.
- Nhóm bạn làm việc trên Figma, và bạn muốn tài liệu nghiệp vụ với file thiết kế __khớp nhau__, không phải bản một đằng bản một nẻo.

Gõ lệnh đơn giản như:

```
/figma authentication
```

Trong đó `authentication` là tên tính năng bạn muốn vẽ.

> __Một câu để nhớ:__ `/figma` = "lấy bản nháp đã chốt, vẽ thật lên Figma với đúng màu và phông của dự án".

***

## 2. Lệnh này đứng ở đâu trong thang bản vẽ?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trong bộ công cụ này, `/figma` nằm ở __cuối đường__ — nó không vẽ từ con số không, mà __dựng lên từ bản nháp đã có__.

```
 BƯỚC 1 — VẠCH LUỒNG
 /user-flow          Tính năng có mấy luồng, mỗi luồng gồm màn nào.
        │
        ▼
 BƯỚC 2 — CHỐT CẤU TRÚC MÀN (bản nháp)
 /wireframe-ascii    Vẽ bằng ký tự, xem liền trong chat.
 /wireframe-html     Bản đen trắng mở bằng trình duyệt (hợp màn nhiều bảng/cột).
        │
        ▼
 BƯỚC 3 — DỰNG BẢN ĐẸP  ◄── /figma LÀ BƯỚC NÀY
 /figma              Vẽ thật lên Figma, đúng màu/phông. Designer tinh chỉnh tiếp.
 /prototype-html      Bản demo bấm được trong trình duyệt (không cần Figma).
```

`/figma` và `/prototype-html` là __hai lựa chọn song song__ cho cùng một mục tiêu "lên bản đẹp", khác nhau ở chỗ đến:
- `/figma` → kết quả nằm __trong Figma__, hợp khi nhóm có designer làm việc trên đó.
- `/prototype-html` → kết quả là __một file mở bằng trình duyệt, bấm chuyển màn được__, hợp khi chỉ cần demo nhanh, không cần mở công cụ thiết kế nào.

Không có cái nào "hơn" cái nào — chọn theo chỗ nhóm bạn làm việc.

### Vì sao BẮT BUỘC phải có bản nháp trước?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là điểm quan trọng nhất cần hiểu về lệnh này: **`/figma` không tự nghĩ ra bố cục màn hình.** Nếu tính năng chưa có bản nháp ASCII nào, lệnh sẽ __dừng lại và nhắc bạn vẽ nháp trước__, chứ không vẽ liều.

Nghe có vẻ khó tính, nhưng lý do rất thực tế: nếu để AI tự bịa bố cục, nó sẽ vẽ ra một màn "trông cũng được" nhưng __sai nghiệp vụ__ — thiếu ô, sai thứ tự, thiếu nút. Mà vẽ lên Figma thì tốn công hơn nhiều so với sửa bản nháp. Chặn từ đầu rẻ hơn sửa sau.

```
 Chưa có bản nháp ASCII nào
   → /figma DỪNG, nhắc bạn chạy /user-flow rồi /wireframe-ascii trước.

 Có bản nháp, nhưng thiếu đúng 1 màn lẻ
   → /figma BỎ QUA màn đó (báo cho bạn biết), vẫn vẽ các màn còn lại.
```

Hai tình huống này khác nhau: __không có gì cả thì dừng hẳn; thiếu lẻ tẻ thì vẽ tiếp phần có, không im lặng bỏ qua.__

***

## 3. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
 BẠN GÕ LỆNH
 /figma authentication
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 0 — Kiểm tra "Figma đã kết nối chưa?"       │
 │  Hệ thống cần nối được vào Figma trên máy bạn.        │
 │  CHƯA NỐI ĐƯỢC → DỪNG HẲN, hướng dẫn bạn bật từng     │
 │  bước, rồi chờ bạn báo đã xong để kiểm lại.           │
 │  KHÔNG đoán mò, KHÔNG vẽ liều. (xem Mục 4)            │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Chốt 3 thứ: vẽ gì, khung nào, mức nào   │
 │  a) Vẽ màn nào? — bạn nói rõ rồi thì khỏi hỏi lại.    │
 │  b) HỎI kích thước màn: điện thoại / máy tính bảng /  │
 │     máy tính? Gợi ý sẵn rồi CHỜ bạn chốt. (Mục 5)     │
 │  c) Vẽ "Nhanh" hay "Đầy đủ"? (xem Mục 6)              │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2-3 — Đọc bản nháp + bộ quy chuẩn thiết kế  │
 │  Đọc bản nháp ASCII để biết màn có ô/nút gì, mỗi ô    │
 │  hoạt động ra sao, báo lỗi gì.                        │
 │  Đọc docs/design.md để lấy màu, phông, bo góc.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Xin phép trước khi vẽ                   │
 │  Cho bạn xem trước: sẽ vẽ mấy màn, xếp ra sao, khung  │
 │  kích thước nào, lấy màu từ đâu. Bạn gõ Y mới vẽ.     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5-6 — Vẽ, rồi TỰ CHỤP ẢNH KIỂM LẠI          │
 │  Vẽ xong mỗi màn → tự chụp màn hình đó xem lại:       │
 │  có bị tràn viền không, chữ có bị cắt không, màu       │
 │  đúng chưa. Lỗi → sửa NGAY trước khi vẽ màn tiếp.     │
 │  (xem Mục 7)                                          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 7-8 — Ghi lại vị trí + báo cáo              │
 │  Ghi tên khung Figma vào bảng theo dõi màn hình, để    │
 │  sau này ai cũng biết màn nào nằm ở đâu trên Figma.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — các khung đã nằm trong file Figma của bạn
```

***

## 4. "Cửa an toàn" đầu tiên: chưa nối được Figma thì dừng hẳn

Đây là điểm khác biệt lớn so với các lệnh vẽ khác. `/wireframe-ascii` hay `/prototype-html` chỉ cần ghi file là xong — còn `/figma` phải __nói chuyện được với phần mềm Figma đang chạy trên máy bạn__.

Cách nối: bạn mở __Figma bản cài trên máy__ (không phải bản chạy trong trình duyệt), mở một file, rồi bật một __tiện ích nhỏ (plugin)__ làm cầu nối. Bật xong thì để yên đó suốt buổi làm.

Nếu chưa nối được, hệ thống __dừng hẳn và hướng dẫn bạn từng bước__ — mở app nào, vào menu nào, bấm gì. Bạn làm xong, báo lại, nó kiểm tra lần nữa.

> __Một trường hợp dễ hiểu nhầm:__ đôi khi hệ thống báo "chưa kết nối" nhưng thực ra __đã kết nối rồi__ — chuyện này xảy ra khi phiên làm việc của bạn không phải phiên "chủ" của cầu nối (ví dụ có nhiều cửa sổ cùng mở). Lúc đó bắt bạn đi bật lại plugin là __sai và mất công vô ích__, vì có bật lại cũng vẫn báo y như vậy. Hệ thống được dặn phải phân biệt hai tình huống này: gặp trường hợp trên thì nó __tự thử ghi một nét nhỏ để xem đường truyền có thật sự thông không__, thay vì tin ngay vào lời báo. Chỉ khi đúng là chưa kết nối thật, nó mới nhờ bạn bật plugin.

Vì sao khắt khe vậy? Vì vẽ lên Figma là __ghi vào file thật của bạn__. Đoán mò mà vẽ nhầm file, nhầm trang thì bạn phải dọn tay. Thà dừng lại hỏi cho chắc.

***

## 5. Vì sao phải HỎI kích thước màn hình trước khi vẽ?

Kích thước màn (điện thoại hẹp / máy tính rộng) __quyết định toàn bộ bản vẽ__: khung rộng bao nhiêu, ô nhập dài bao nhiêu, các màn xếp cách nhau bao xa. Chọn sai thì vẽ lại từ đầu.

Quy tắc ở đây rất rõ: __hệ thống được phép gợi ý, nhưng KHÔNG được tự chốt.__ Nó nhìn vào bản đồ luồng (nơi đã ghi "tính năng này chủ yếu chạy trên gì") hoặc bộ quy chuẩn thiết kế để __đề xuất sẵn một lựa chọn__, nhưng vẫn hỏi bạn xác nhận.

Nghe hơi thừa? Không hề — đây là bài học từ một lỗi thật. Trước đây lệnh này __mặc định vẽ theo khung điện thoại__, trong khi bộ quy chuẩn thiết kế của dự án lại mô tả một __sản phẩm cho máy tính__ (bảng nhiều cột, trang rộng). Kết quả: vẽ ra một loạt màn điện thoại cho một sản phẩm desktop — sai hoàn toàn, phải bỏ vẽ lại.

Bài học: __"có vẻ rõ ràng" không đủ để tự quyết.__ Một câu hỏi mất 3 giây, còn vẽ sai mất cả buổi.

> Đây cũng là cách `/wireframe-ascii` và `/wireframe-html` làm — cả ba lệnh vẽ đều hỏi kích thước theo cùng một kiểu, nên bạn trả lời một lần ở bước vạch luồng thì các bước sau chỉ cần xác nhận nhanh.

***

## 6. Hai mức vẽ: "Nhanh" và "Đầy đủ"

Ở Giai đoạn 1, hệ thống hỏi bạn muốn vẽ mức nào. Khác biệt nằm ở __có vẽ các trạng thái phụ hay không__:

__Mức Nhanh__ — mỗi màn vẽ __một khung duy nhất__, ở trạng thái bình thường. Hợp khi bạn chỉ cần vài màn để hình dung, hoặc muốn xem thử trước khi làm nhiều.

__Mức Đầy đủ__ — vẽ cả tính năng, và __mỗi màn kèm thêm các trạng thái quan trọng__. Ví dụ màn đăng nhập sẽ có thêm: khung lúc đang bấm nút, khung lúc báo lỗi sai mật khẩu. Hợp khi cần bàn giao cho designer hoặc dev làm thật.

Mức Đầy đủ có hai điểm thông minh đáng nói:

- __Gom lỗi cùng kiểu.__ Một màn có thể có 5 loại lỗi khác nhau, nhưng nếu cả 5 đều hiện dạng "dòng chữ đỏ dưới ô nhập" thì vẽ 5 khung gần như giống hệt là phí. Hệ thống vẽ __một khung đại diện__, kèm ghi chú liệt kê các lỗi còn lại cùng kiểu.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- __Dùng lại thay vì vẽ lại.__ Trước khi vẽ một nút hay một ô lặp đi lặp lại, hệ thống __kiểm tra trong Figma xem đã có sẵn chưa__ — có rồi thì lấy dùng lại. Nhờ vậy khi designer sửa một nút, mọi chỗ dùng nút đó đổi theo, không phải sửa từng màn.

> __Lưu ý về trạng thái loại trừ nhau:__ có những màn mà hai trạng thái __không bao giờ hiện cùng lúc__ — ví dụ màn xác minh email: hoặc "thành công", hoặc "link hết hạn". Những cái đó đã được tách thành __hai màn riêng__ từ bước vẽ nháp, nên `/figma` vẽ mỗi cái một khung. Nếu bản nháp lỡ nhồi cả hai vào chung một khung, hệ thống __cảnh báo bạn__ và đề nghị sửa bản nháp trước, chứ không vẽ y hệt cái sai đó lên Figma.

***

## 7. Vì sao vẽ xong mỗi màn lại phải tự kiểm lại?

Sau khi vẽ xong một màn, hệ thống tự kiểm lại — nhưng cách kiểm đáng nói rõ, vì nó không phải "nhìn ảnh rồi đánh giá".

Việc kiểm chia __hai lớp__, làm theo đúng thứ tự:

1. __Đo bằng số liệu__ — hỏi ngược Figma kích thước, toạ độ, cách xếp lớp, mã màu của từng thành phần rồi đối chiếu quy tắc. Lớp này bắt lỗi *cấu trúc*: chữ bị cắt cụt, hộp thoại tràn khung, dùng mã màu ngoài bộ quy chuẩn, và — với khung máy tính — __form đăng nhập bị kéo giãn hết chiều ngang__ (một form rộng 1000px trông sai hoàn toàn; nó phải là hộp hẹp nằm giữa).

2. __Soi bằng mắt__ — chỉ làm khi lớp 1 đã sạch, và đây là bước __bắt buộc__, không phải tuỳ chọn. Lớp này bắt những lỗi số liệu không thấy được: màu tuy đúng mã nhưng đặt vào chỗ trông lạc, huy hiệu trạng thái mờ nhạt, khoảng cách đúng số mà nhìn vẫn lệch, các biến thể trạng thái khác nhau quá ít nên trông như trùng.

Cả hai lớp đạt mới sang màn kế tiếp.

Có lỗi → __sửa ngay màn đó trước khi vẽ màn tiếp theo__.

Vì sao không vẽ hết rồi kiểm một lượt? Vì các màn dùng chung một khuôn. Nếu màn 1 sai mà không phát hiện, màn 2 đến màn 10 sẽ sai y hệt — sửa 10 lần thay vì 1 lần. Bắt lỗi sớm rẻ hơn nhiều.

Hệ thống cũng kiểm sẵn các lỗi hiển thị thường gặp (hộp thoại tràn màn, lớp phủ che nội dung) để không lặp lại.

***

## 8. `docs/design.md` — nguồn màu duy nhất, và quy tắc "không bịa màu"

Toàn bộ màu sắc, phông chữ, độ bo góc mà `/figma` dùng đều lấy từ **một file duy nhất: `docs/design.md`** — bộ quy chuẩn thiết kế của dự án.

Quy tắc quan trọng: hệ thống __bị cấm tự bịa mã màu__. Không được "thấy màu này hợp thì dùng". Chỉ được dùng màu đã khai trong file đó. Nhờ vậy mọi màn trong Figma dùng chung một bảng màu — và nếu sau này thương hiệu đổi màu, sửa `design.md` rồi chạy lại là xong.

File này **dùng chung với `/prototype-html`**, nên bản Figma và bản demo trình duyệt luôn khớp màu, không lệch tông.

Nếu dự án chưa có `design.md`? Hệ thống dùng một bảng màu tối dự phòng và __báo rõ cho bạn biết__ trong bước xin phép — để bạn quyết định có chấp nhận hay dừng lại làm bộ quy chuẩn trước.

***

## 9. Ví dụ thực tế

Anh __Tuấn__, một BA, vừa cùng đồng nghiệp chốt xong cấu trúc các màn đăng nhập ở bản nháp ASCII. Giờ anh muốn có bản đẹp trên Figma để designer tinh chỉnh. Anh gõ:

```
/figma authentication
```

1. Hệ thống kiểm tra kết nối Figma — chưa nối được. Nó __dừng lại__, hướng dẫn anh Tuấn mở Figma bản cài trên máy, vào menu bật tiện ích cầu nối. Anh làm theo, báo đã xong. Hệ thống kiểm lại: nối được.

2. Hệ thống thấy tính năng `authentication` đã có bản nháp ASCII — tốt, có nguyên liệu để vẽ.

3. Hệ thống hỏi kích thước màn, gợi ý sẵn "máy tính" vì bộ quy chuẩn thiết kế của dự án mô tả sản phẩm chạy trên desktop. Anh Tuấn xác nhận "máy tính". *(Nếu hệ thống tự đoán "điện thoại" rồi vẽ luôn thì cả loạt màn đã sai kích thước.)*

4. Hệ thống hỏi vẽ mức nào. Anh Tuấn chọn __Đầy đủ__, vì cần bàn giao cho designer làm thật — cần cả trạng thái báo lỗi.

5. Hệ thống đọc bản nháp + `design.md`, rồi __xin phép__: sẽ vẽ 4 màn cơ bản + 3 khung trạng thái phụ, khung máy tính, lấy màu từ `design.md`. Anh Tuấn gõ `Y`.

6. Vẽ màn đăng nhập xong, hệ thống __tự chụp ảnh kiểm lại__ — phát hiện form bị kéo giãn hết chiều ngang 1024px, trông sai. Nó __sửa ngay__: bó form vào một hộp hẹp nằm giữa. Các màn sau vẽ đúng luôn theo khuôn đã sửa.

7. Tới màn thứ ba, hệ thống thấy nút "Gửi" đã có sẵn trong Figma từ màn trước — nó __lấy dùng lại__ thay vì vẽ nút mới.

8. Vẽ xong, hệ thống ghi tên các khung Figma vào bảng theo dõi màn hình, và báo cáo: 4 màn + 3 trạng thái, nằm ở trang nào trong file Figma nào.

Anh Tuấn mở Figma, thấy đủ các màn đúng màu thương hiệu, gửi link cho designer. Designer chỉ việc tinh chỉnh, không phải vẽ lại từ đầu.

***

## 10. Sau khi vẽ xong thì đi đâu tiếp

Bản Figma thường là __điểm bàn giao cho designer__ — họ mở ra tinh chỉnh chi tiết, thêm hiệu ứng, rồi chốt thành thiết kế chính thức để dev code theo.

Nếu bạn muốn một bản __demo bấm được__ để trình cho khách hoặc sếp (bấm nút là chuyển màn như app thật), chạy `/prototype-html` — mở bằng trình duyệt, không cần cài Figma. Nó đọc cùng bản nháp và cùng `design.md`, nên khớp màu với bản Figma.

> __Lưu ý về giới hạn hiện tại:__ `/figma` __chỉ vẽ ra màn hình tĩnh__, nó __không nối được các màn thành bản bấm-chạy-được ngay trong Figma__ (cầu nối đang dùng chưa có khả năng đó). Nên nếu nhu cầu của bạn là "bấm thử như app thật" thì đường đúng là `/prototype-html`, chứ đừng chờ `/figma` làm việc đó. Designer vẫn có thể tự nối prototype bằng tay trong Figma sau khi nhận bản vẽ.

Tóm lại chuỗi công việc thường là: **`/user-flow` (vạch luồng) → `/wireframe-ascii` (chốt cấu trúc) → `/figma` (bản đẹp cho designer) và/hoặc `/prototype-html` (demo bấm được)**.

***

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (từng Phase 0–8, cách dựng từng loại ô/nút, danh sách lỗi thường gặp), đọc file gốc: `.claude/skills/figma/SKILL.md` và `.claude/skills/figma/references/drawing-patterns.md`.

Các lệnh liên quan:
- `/wireframe-ascii` — vẽ bản nháp bằng ký tự; __bắt buộc chạy trước__ `/figma` (là nguồn bố cục).
- `/user-flow` — vạch "bản đồ luồng", chạy trước cả bản nháp; cũng là nơi ghi "thiết bị chính".
- `/wireframe-html` — bản nháp đen trắng mở bằng trình duyệt, cùng bậc với ASCII (hợp màn nhiều bảng/cột).
- `/prototype-html` — bản demo có màu, bấm chuyển màn được; lựa chọn song song với `/figma` để lên bản đẹp.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
