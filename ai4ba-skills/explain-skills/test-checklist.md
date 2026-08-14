---
type: skill-explainer
skill: test-checklist
updated: 2026-07-26
---

# `/test-checklist` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/test-checklist` giúp bạn __liệt kê những tình huống cần kiểm thử__ cho một tính năng — ở dạng danh sách gọn, mỗi dòng một tình huống — để mọi người soát “đã đủ chưa, có sót gì không” __trước khi__ ngồi viết kịch bản test chi tiết.

Hãy hình dung bạn sắp nghiệm thu một căn hộ. Trước khi cầm bút ghi từng bước “mở vòi, hứng nước, xem áp lực”, bạn cần một __bảng những thứ phải kiểm__: điện, nước, cửa, ổ cắm, chống thấm... Bảng đó chưa nói *làm thế nào để kiểm*, chỉ nói *phải kiểm những gì*. `/test-checklist` chính là bảng đó cho phần mềm.

Ví dụ đời thường với màn đăng nhập:

* Nhập đúng email + đúng mật khẩu → có vào được không?
* Nhập sai mật khẩu → có báo lỗi đúng không?
* Nhập email không tồn tại → có báo *chung chung* (không tiết lộ email nào có thật) không?
* Sai 3 lần → có bắt nhập mã xác thực không?
* Bấm nút khi mạng chậm → có chặn bấm hai lần không?

Mỗi gạch đầu dòng như thế là __một mục checklist__. Lệnh này sinh ra cả danh sách đó, nhóm gọn theo từng bước của luồng.

Gõ đơn giản:

```text
/test-checklist dang-nhap
```

Lệnh sẽ hỏi bạn muốn làm checklist cho __cả tính năng, một màn hình, một user story, hay một use case__, rồi hỏi vài câu về __chiến lược test__ (xem Mục 4) trước khi liệt kê.

## 2. Đây là bước “outline”, chưa phải bước “chi tiết”‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm dễ nhầm nhất: checklist __không chứa dữ liệu thử cụ thể__, không có các bước bấm-gõ chi tiết.

* Checklist nói: *“Kiểm: nhập sai mật khẩu thì báo lỗi generic.”*
* Test case chi tiết (do `/test-cases` viết sau) mới nói: *“Bước 1: mở /login. Bước 2: nhập email `user@abc.com`. Bước 3: nhập mật khẩu `sai123`. Kết quả mong đợi: hiện đúng câu ‘Email hoặc mật khẩu không đúng’.”*

Tách hai bước như vậy có lợi: mọi người __duyệt phạm vi trước__ (nhanh, dễ thấy chỗ sót) rồi mới bỏ công viết chi tiết. Giống như duyệt mục lục một cuốn sách trước khi viết từng chương.

## 3. Mỗi mục có một “mã theo dõi” riêng để không lạc‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Mỗi dòng checklist thực ra mang vài thông tin gọn trong một dòng — một ví dụ thật trông thế này:

```text
[1] [Yes] CHK-dang-nhap-027 → E-dang-nhap-003 · Verify sai mật khẩu hiển thị message "Email hoặc mật khẩu không đúng"
```

Đọc từ trái sang: `[1]` = mức ưu tiên (1 cao nhất); `[Yes]` = có thể cho máy tự chạy; `CHK-dang-nhap-027` = __mã theo dõi__; `→ E-dang-nhap-003` = mã yêu cầu/quy tắc nghiệp vụ mà mục này kiểm (để đối chiếu không sót); phần sau dấu `·` là nội dung. Bạn không cần thuộc cú pháp này — lệnh tự viết đúng; chỉ cần biết mỗi mục đã kèm sẵn ưu tiên, khả năng tự động, và liên kết ngược tới nghiệp vụ.

Riêng __mã theo dõi__ (`CHK-...`) giống __số thứ tự phòng trong khách sạn__: một khi đã gán, nó *không đổi, không dùng lại* — kể cả khi bạn xóa mục ở giữa.

Vì sao quan trọng? Vì bước sau (`/test-cases`) sẽ bám đúng mã này để viết kịch bản chi tiết, và bám tiếp để biết “tình huống này đã có kịch bản chưa, đã chạy chưa”. Nếu mã cứ đổi loạn thì mọi liên kết đứt hết. Bạn không cần nhớ mã — lệnh tự quản lý. Chỉ cần biết: __mỗi tình huống có một địa chỉ riêng, theo suốt hành trình.__

## 4. Trước khi liệt kê, lệnh hỏi bạn “test kiểu gì”‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là điểm mới quan trọng. Trước khi sinh danh sách, lệnh hỏi vài câu để hiểu __ý định test lần này__, gồm hai nhóm:

__Nhóm “gần như cố định”__ (hỏi một lần, lần sau nhớ luôn):

* Test trên môi trường nào (thử nội bộ / môi trường giống thật / chưa có)?
* Lấy dữ liệu thử từ đâu?
* Ngôn ngữ viết checklist?

__Nhóm “thay đổi theo mỗi lần chạy”__ (mỗi lần xác nhận nhanh một dòng):

* Mục đích lần này: nghiệm thu / kiểm nhanh trước demo / kiểm lại toàn bộ trước khi phát hành?
* Phạm vi: toàn bộ hành vi / chỉ phần vừa thay đổi / chỉ các luồng quan trọng?
* Mức độ phủ: chỉ chức năng cơ bản, hay thêm bảo mật / khả năng tiếp cận / hiệu năng?

Trả lời được lưu vào một hồ sơ nhỏ (`test-strategy.md`) dùng chung, để lần sau không phải hỏi lại từ đầu. Ý nghĩa: __cùng một tính năng, nhưng “kiểm nhanh trước demo” và “kiểm kỹ trước phát hành” cần danh sách khác nhau__ — lệnh phải biết bạn đang cần cái nào.

## 5. Có “mức nền” luôn kiểm, phần chuyên sâu mới bật thêm

Để tránh chuyện danh sách lúc dày lúc mỏng tùy hứng, lệnh chia hai tầng:

* __Mức nền — luôn có, bất kể chọn gì:__ luồng chính + luồng phụ, kiểm tra dữ liệu nhập + tính toàn vẹn dữ liệu, xử lý lỗi, bảo mật cơ bản (phải đăng nhập, đúng vai trò), màn hình tải, khả năng tiếp cận cơ bản (đi bằng bàn phím), hiển thị đúng ở kích thước màn hình chính, tình huống hiếm (bấm hai lần, mất mạng giữa chừng, hết phiên). (Phần dùng chung như header/footer chỉ thêm khi tài liệu xác nhận ứng dụng thật sự có.)
* __Phần chuyên sâu — chỉ bật khi bạn chọn:__ đo hiệu năng có ngưỡng cụ thể, kiểm khả năng tiếp cận đầy đủ, bảo mật sâu, kiểm nối nhiều hệ thống.

Nhờ vậy, chọn “chuyên sâu” chỉ __thêm__ chứ không bao giờ làm mỏng đi phần nền. Bạn không lo bỏ sót những thứ cơ bản chỉ vì lần này chạy nhanh.

## 6. “Mỗi mục một việc” — vì sao không gộp bừa

Lệnh cố ý giữ __mỗi mục có đúng một “kết luận cuối” để quyết định đậu/rớt__. (Một mục vẫn được có vài bước chuẩn bị, hoặc kiểm một *bộ* thứ như một kết luận chung — ví dụ “form hiện đủ 3 ô” là một kết luận. Điều cấm là nhét *hai* kết luận khác nhau vào một mục.) Ví dụ:

* ✅ Tách: *“logo hiển thị đúng”* và *“bấm logo quay về Trang chủ”* là __hai mục__ (hai kết luận khác nhau: một cái về hiển thị, một cái về chuyển trang).
* ❌ Không gộp: *“logo hiển thị và bấm quay về Trang chủ”* trong một dòng (hai kết luận).

Lý do rất thực tế: bước sau viết __đúng một kịch bản cho mỗi mục__. Nếu một mục ôm hai việc, kịch bản dễ __bỏ quên một nửa__ — kiểm cái hiển thị mà quên kiểm cái chuyển trang. Tách sẵn từ checklist thì không rơi rớt.

Cũng vì thế, lệnh cấm viết mục kiểu mập mờ: *“hiển thị lỗi __hoặc__ cho phép tùy trường hợp”*, hay *“báo lỗi __nếu__ có”*. Chưa chốt được kết quả đúng thì ghi thành __câu hỏi mở__ để hỏi lại, chứ không viết một mục không biết đâu là đậu đâu là rớt.

## 7. Bảng “độ phủ” — bằng chứng không sót nghiệp vụ

Đây là phần trả lời trực tiếp câu hỏi *“nghiệp vụ có bị thiếu trong checklist không?”*.

Nếu tính năng đã có tài liệu đặc tả (SRS), lệnh sẽ lập một __bảng đối chiếu__: mỗi *nghĩa vụ nghiệp vụ nhỏ* (từng nhánh của một quy tắc, từng phần của một mã lỗi, từng luồng của một yêu cầu) phải có mục checklist phủ — hoặc được ghi rõ “tạm loại, có lý do, có người duyệt”.

Điều tinh tế: bảng này đếm __theo từng nghĩa vụ nhỏ__, không đếm gộp. Ví dụ quy tắc “sai 3 lần thì khóa” có ba nhánh (sai 1 lần, sai 2 lần, sai từ 3 lần); phủ mỗi nhánh 1 lần mới tính là đủ. Một mã lỗi cũng tách nhỏ: câu thông báo, cách phục hồi, hệ quả kèm theo — mỗi thứ là một nghĩa vụ. Nhờ đó, những chỗ __thiếu__ lộ ra ngay thay vì lẫn vào một con số “đã có nhiều mục”.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Mỗi nghĩa vụ trong bảng mang một trạng thái đời thường: __đã phủ__ / __tạm loại (có lý do, có người duyệt)__ / __chưa có nguồn__ / __đang treo chờ làm rõ__ / __mới phủ một phần__. Chỉ hai trạng thái đầu mới tính là “xong”; còn lại __chưa cho đóng phạm vi__ — buộc phải giải quyết hoặc được duyệt loại. Và khi chưa biết kết quả đúng của một tình huống, lệnh ghi thành __câu hỏi mở__ để hỏi lại, chứ không viết một mục checklist mơ hồ kiểu “cần bổ sung”.

## 8. Lệnh này KHÔNG bịa nội dung

Một nguyên tắc xuyên suốt: nội dung mỗi mục (câu thông báo lỗi chính xác, con số cụ thể) phải __lấy từ tài liệu nghiệp vụ thật__ (đặc tả, use case, mô tả màn hình) — không tự nghĩ ra. Chỗ nào tài liệu chưa nói, lệnh __hỏi lại bạn hoặc đánh dấu cần bổ sung__, chứ không điền bừa cho danh sách trông đầy đặn. Danh sách trung thực quan trọng hơn danh sách dài.

## 9. Xem kết quả: có một trang HTML mở bằng cách nhấp đúp

Danh sách được lưu ở dạng văn bản (file `.md`) — nhưng để __dễ xem, lọc, tìm__, lệnh tạo kèm một __trang HTML__ (`preview.html`). Bạn chỉ cần __nhấp đúp mở bằng trình duyệt__ (không cần cài gì, không cần internet).

Trang này cho phép:

* Lọc danh sách theo nhóm, theo mức ưu tiên, theo file.
* Tìm nhanh một mục.
* Xem gọn gàng như một bảng, thay vì đọc văn bản thô.
* __Xuất ra Excel__ để gửi đi hoặc nhập vào công cụ quản lý test.
* __Ghi góp ý ngay trên từng mục__ (nút 💬) — góp ý được gắn vào __mã theo dõi__ của mục đó, và có nút 📋 để chép toàn bộ góp ý ra một lượt. Đây là đầu vào cho Mục 10.

Về mặt file, trang xem này gồm hai phần: `preview.html` là __khung trang__ (giao diện bảng, ô lọc — copy sẵn một lần), còn `data.js` là __dữ liệu__ (được làm mới mỗi lần chạy lệnh). Trang HTML đọc dữ liệu từ `data.js`.

Lưu ý: **file văn bản `.md` mới là bản gốc.** Trang HTML chỉ là “cửa sổ nhìn vào” dữ liệu đó. Nếu bạn sửa file `.md` bằng tay, phải chạy lại lệnh để `data.js` (và trang HTML) cập nhật theo — trình duyệt không tự đọc file `.md`.

## 10. Góp ý trên trang xem rồi đưa ngược lại — cách làm việc nhóm

Đây là cách dùng thường gặp nhất sau khi có danh sách: bạn (hoặc QC, hoặc PO) mở trang HTML, đọc từng mục, thấy chỗ nào chưa ổn thì __bấm 💬 ghi góp ý ngay tại mục đó__ — không cần mở file văn bản, không cần biết mã số gì.

Góp xong, bấm __📋 "Copy toàn bộ góp ý"__, rồi __dán thẳng vào phiên chat__ với lệnh này. Hệ thống hiểu đây là góp ý (không phải yêu cầu làm mới), phân vào __6 nhóm__ rồi in bảng cho bạn duyệt và __dừng lại chờ__ — chưa sửa gì trước khi bạn đồng ý:

| Nhóm | Là gì | Hệ thống làm gì |
|---|---|---|
| __(A) Sửa được ngay__ | Sửa câu chữ, mức ưu tiên của một mục — không đổi số lượng mục, không đụng nghiệp vụ | Sửa, có cho bạn xem trước/sau |
| __(B) Thêm/bớt/tách/gộp mục__ | Số lượng mục thay đổi | Cấp mã mới hoặc cho mã cũ nghỉ hưu, rồi **nhắc bạn chạy lại `/test-cases`** vì quan hệ 1-đối-1 đã lệch |
| __(C) Chặn lại — lệch nghiệp vụ__ | Góp ý mâu thuẫn với quy tắc đã chốt trong đặc tả | __Không sửa__, trích đúng điều khoản đang mâu thuẫn và chỉ bạn sang `/cr` |
| __(D) Việc của lệnh khác__ | Đòi sửa đặc tả, sửa màn hình, sửa luồng | Chỉ tên lệnh cần dùng, không tự làm |
| __(E) Cần nói rõ hơn__ | Góp ý mơ hồ kiểu "chỗ này chưa ổn" | Hỏi lại, không đoán |
| __(F) Bỏ qua__ | Mục đó không còn tồn tại / đã nghỉ hưu / danh sách đã dựng lại từ lúc bạn góp ý | Nêu lý do, không gán bừa sang mục gần giống |

Ba điểm đáng chú ý:

* __Sau khi bạn duyệt, chỉ nhóm (A) được áp dụng ngay__ — kể cả khi bạn gõ "đồng ý hết". Các nhóm còn lại đi đường riêng.
* __Hai góp ý mâu thuẫn nhau__ (một người bảo gộp hai mục, người kia bảo sửa riêng một mục) → hệ thống tách ra mục "xung đột" cho bạn chọn, không áp cả hai.
* Xử lý xong, nên bấm __🗑 "Xoá hết"__ trên trang xem, tránh lần sau dán lại chồng và áp hai lần.

Góp ý được gắn với __mã theo dõi__ chứ không theo số thứ tự (số thứ tự đổi mỗi lần dựng lại danh sách), và __không dòng nào bị bỏ sót__ — mọi dòng đều xuất hiện trong bảng ở đúng một nhóm.

---

## 11. BA/QC làm phần nào, ai làm phần nào?

* __BA/QC (bạn):__ quyết định phạm vi test, xác nhận mục nào quan trọng, bổ sung số liệu/quy tắc mà tài liệu còn thiếu, duyệt danh sách cuối.
* __Lệnh (AI):__ đọc mọi tài liệu của tính năng, dựng danh sách theo luồng, gắn mã theo dõi, đối chiếu độ phủ, chỉ ra chỗ còn trống, tạo trang xem HTML.
* Không ai phải viết code hay đụng đến kỹ thuật ở bước này — đây thuần là bước __nghiệp vụ__.

## 12. Vị trí trong họ lệnh test

`/test-checklist` là __chặng mở đầu__ của việc kiểm thử giao diện:

* Sau nó, `/test-cases` biến từng mục thành kịch bản chi tiết chạy được.
* Cuối cùng, `/playwright-gen` có thể biến kịch bản thành script tự động chạy.
* Song song, nếu tính năng có API, `/api-checklist` làm việc tương tự cho tầng API.

Xem `test-family.md` để hiểu cả bộ nối với nhau ra sao.

## Câu chốt

> **`/test-checklist` không viết test chi tiết — nó dựng bản đồ “cần kiểm những gì”, gắn mã theo dõi cho từng tình huống, và đối chiếu để chắc chắn không sót nghiệp vụ. Duyệt đúng bản đồ này thì mọi bước sau mới không đi lạc.**

## Xem thêm

* [`test-family.md` — cả bộ lệnh test nối với nhau thế nào](test-family.md)
* [`/test-cases` — biến checklist thành kịch bản chi tiết](test-cases.md)
* [`/playwright-gen` — biến kịch bản thành script tự động](playwright-gen.md)
* [`/api-checklist` — checklist cho tầng API](api-checklist.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
