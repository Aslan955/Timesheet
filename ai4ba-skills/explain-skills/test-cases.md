---
type: skill-explainer
skill: test-cases
updated: 2026-07-26
---

# `/test-cases` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/test-cases` biến mỗi mục trong checklist thành một __kịch bản kiểm thử chi tiết__ — có các bước bấm-gõ, dữ liệu, và kết quả mong đợi. Mục tiêu là kịch bản __chạy được__; nhưng chỗ nào tài liệu nghiệp vụ chưa nói (chưa rõ dữ liệu thử, chưa rõ kết quả đúng), lệnh ghi thẳng __“cần bổ sung”__ thay vì bịa — và đánh dấu kịch bản đó __chưa sẵn sàng tự động hóa__.

Nếu `/test-checklist` là __mục lục__ (“cần kiểm những gì”), thì `/test-cases` là __từng chương viết đầy đủ__ (“kiểm bằng cách nào, nhập gì, mong chờ điều gì”).

Ví dụ, từ một mục checklist *“Kiểm: nhập sai mật khẩu thì báo lỗi chung chung”*, lệnh sinh ra một kịch bản như:

> - __Bước 1:__ Mở màn hình Đăng nhập.
> - __Bước 2:__ Nhập field “Email” = `user@abc.com`.
> - __Bước 3:__ Nhập field “Mật khẩu” = `sai-mat-khau`.
> - __Bước 4:__ Bấm nút “Đăng nhập”.
> - __Kết quả mong đợi:__ Hiện đúng câu “Email hoặc mật khẩu không đúng”.

Đây là thứ mà một người kiểm thử (hoặc sau này một công cụ tự động) có thể làm theo từng bước. (Các giá trị như `user@abc.com` ở trên chỉ là *ví dụ minh họa cách trình bày* — trong kịch bản thật, dữ liệu và câu thông báo đều lấy từ tài liệu, không tự chế.)

Gõ đơn giản:

```text
/test-cases dang-nhap
```

Lệnh __bắt buộc phải có checklist đúng phạm vi đang chọn trước__ — ví dụ làm test case cho màn Login thì phải có checklist của màn Login (checklist cả feature không thay được). Chưa có thì lệnh nhắc bạn chạy `/test-checklist` cho đúng phạm vi đó.

## 2. “Bám sát 1:1” — mỗi mục checklist thành đúng một kịch bản‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nguyên tắc cốt lõi: __mỗi mục checklist → đúng một kịch bản, không thêm, không bớt.__

* Không tự đẻ thêm tình huống ngoài checklist (nếu muốn thêm, phải quay lại `/test-checklist` bổ sung — để danh sách phạm vi luôn là nơi duyệt duy nhất).
* Không gộp hai mục thành một kịch bản (dễ bỏ sót).

Đây là lý do vì sao bước trước cố gắng giữ “mỗi mục một việc”: nhờ đó, một mục hóa một kịch bản gọn gàng, có đúng __một điều để kết luận đậu hay rớt__.

Mỗi kịch bản mang theo __mã theo dõi__ của mục checklist gốc (ví dụ `CHK-dang-nhap-027`), như sợi chỉ đỏ nối “tình huống cần kiểm” → “kịch bản kiểm” → sau này là “kết quả chạy”.

## 3. Kết quả mong đợi phải rõ ràng và lấy từ tài liệu thật‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quyết định chất lượng của một kịch bản là ô __“Kết quả mong đợi”__. Lệnh yêu cầu ô này:

* __Dứt khoát:__ ghi rõ câu thông báo, trạng thái, hoặc màn hình đích — chứ không viết mờ như “người dùng thấy lỗi”.
* __Lấy từ nguồn thật:__ câu thông báo chính xác (“Email hoặc mật khẩu không đúng”), con số, hệ quả kèm theo (“tăng bộ đếm sai +1”) đều phải rút từ tài liệu đặc tả — __không bịa__.

Đây là điểm rất quan trọng: bảng đối chiếu độ phủ ở bước trước chỉ là __bản đồ điều hướng__, không phải nguồn nội dung. Khi viết kết quả mong đợi, lệnh luôn quay về đọc __tài liệu gốc__ (đặc tả, use case, mô tả màn hình) để lấy đúng từng chữ. Thiếu thông tin thì hỏi lại hoặc đánh dấu “cần bổ sung”, tuyệt đối không điền bừa cho kịch bản trông hoàn chỉnh.

## 4. Mỗi kịch bản có “điều kiện cần trước” và cờ “tự động được hay không”‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Ngoài các bước, mỗi kịch bản còn có hai thông tin đáng chú ý:

* __Điều kiện cần trước:__ trạng thái phải có sẵn trước bước 1. Ô này có __bốn khả năng, phân biệt rõ để không nhầm:__
  * __“—” (gạch ngang)__ = kịch bản __không cần__ trạng thái đặc biệt (chạy từ trạng thái mặc định, chưa đăng nhập).
  * __Trạng thái + cách dựng (kèm nguồn)__ = nhiều trạng thái *dựng được bằng cách ghép các thao tác đã có trong tài liệu*, nên lệnh __tự viết sẵn cách dựng, ghi kèm nguồn__. Ví dụ “tài khoản đã khóa (dựng: tạo tài khoản mới → login sai 5 lần; nguồn: quy tắc khóa BR-006)”. Đây __không phải bịa__ — vì mọi bước và con số đều có nguồn. Lưu ý: mỗi mắt xích phải có nguồn, không chỉ con số — nếu cả *cách tạo tài khoản* hay *cách reset* cũng chưa có trong tài liệu thì không dựng, chuyển sang “cần bổ sung”.
  * __Trạng thái trỏ tới “đồ nghề dựng sẵn”__ = khi tài liệu chiến lược test đã đặt tên một công cụ/fixture lo việc tạo trạng thái, ô này chỉ trỏ tới nó.
  * __“cần bổ sung”__ = khi một con số/quy tắc/cách-dựng chưa có trong tài liệu → không dựng được → đưa vào __danh sách cần bổ sung__ (Mục 5) để bạn cấp, chứ không tự đoán. (Cẩn thận ví dụ dễ nhầm: “phiên hết hạn” *không* giống “xóa phiên đăng nhập” — xóa phiên chỉ là đăng xuất, khác với hết hạn theo thời gian. Nên nếu tài liệu chưa nói thời gian hết hạn thì để “cần bổ sung”.)
  Điểm quan trọng: “không cần” khác “dựng được” khác “thiếu gốc chưa dựng được” — phân đúng thì không rớt oan mà cũng không bế tắc.
* __Cờ “tự động được / phải làm tay”:__ đánh dấu kịch bản nào một công cụ có thể tự chạy, kịch bản nào cần người kiểm bằng mắt. Những việc như “xem cột đếm trong cơ sở dữ liệu”, “thử hai thao tác cùng lúc”, “đo thời gian phản hồi” __nên được đánh dấu làm tay ngay từ checklist__. `/test-cases` __mang nguyên cờ này từ checklist sang, không tự đổi__ — nếu thấy một cờ có vẻ sai, nó chỉ __cảnh báo__ để bạn sửa ở checklist rồi tạo lại.

## 5. Thiếu gì thì gom vào MỘT danh sách “cần bổ sung” — không rải rác, không bịa

Khi làm kịch bản, sẽ có chỗ tài liệu chưa nói đủ: chưa có dữ liệu thử phù hợp, chưa rõ một con số/ngưỡng, chưa có câu thông báo lỗi chính xác. Lệnh __không tự bịa__ cho đầy — nhưng cũng __không để bạn phải đi lục từng kịch bản__ để tìm chỗ thiếu.

Thay vào đó, lệnh __gom tất cả chỗ thiếu vào một bảng “Cần bổ sung”__ (nằm trong file tổng của test case, và được chiếu lại ở phần báo cáo cuối), phân theo loại:

* __thiếu dữ liệu thử__ (chưa có email/tài khoản test phù hợp)
* __thiếu con số/quy tắc__ (tài liệu chưa nói khóa sau mấy lần)
* __thiếu câu thông báo/mã lỗi__ (chưa biết chính xác hệ thống hiện câu gì)
* __thiếu cách dựng trạng thái__ (biết cần trạng thái gì nhưng tài liệu chưa nói cách đạt)

Bảng này là __nơi bạn review một chỗ__ — nó *không* thay cho dấu “cần bổ sung” đánh ngay trong từng kịch bản (dấu đó vẫn ở lại để bước tự-động-hóa biết mà bỏ qua). Bạn đọc bảng một lần, rồi cấp thứ thiếu __vào đúng chỗ bền của nó__: con số/quy tắc/câu-lỗi thì __cập nhật vào tài liệu đặc tả trước__ (để còn truy nguồn), còn tài khoản/dữ liệu test thì ghi vào hồ sơ chiến lược test. Sau đó __chạy lại lệnh__ — trong tình huống này nó chỉ điền vào những kịch bản còn thiếu, giữ nguyên phần đã xong. (Chạy lại còn có hai kiểu khác khi checklist đã đổi — xem Mục 9.)

## 6. Kịch bản viết sẵn sàng cho công cụ tự động (nhưng người vẫn đọc được)

`/test-cases` viết kịch bản theo cách mà **bước sau (`/playwright-gen`) có thể biến thành script chạy máy**. Cụ thể:

* Mỗi bước gọi tên nút/ô __bằng nhãn nghiệp vụ__ thật (“nút Đăng nhập”, “field Email”), chứ không dùng mã kỹ thuật rối rắm. Bạn — người viết nghiệp vụ — không bao giờ phải đụng đến “ngôn ngữ máy”.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
* Dữ liệu thử là giá trị thật (email, mật khẩu cụ thể), không phải chỗ trống “<điền gì đó>”. (Chỗ nào chưa có thì ghi “cần bổ sung” — không bịa một giá trị giả, xem Mục 5.)

Nói cách khác, cùng một kịch bản vừa để người đọc hiểu, vừa đủ chi tiết để máy dựng thành test tự động về sau.

Một phân biệt tinh nhưng quan trọng: __“đủ để dựng script” khác “chạy được ngay”.__ Một kịch bản “tài khoản đã khóa” có thể *dựng thành script*, nhưng để *chạy* thì trước đó phải có sẵn một tài khoản đang khóa. Những kịch bản cần một trạng thái đặc biệt như vậy sẽ được đánh dấu là __“cần dựng trạng thái trước”__ — bước tự động hóa sẽ tạm bỏ qua chúng khỏi phần chạy tự động (thay vì chạy rồi rớt oan vì chưa vào đúng trạng thái).

## 7. Xem và xuất kết quả: trang HTML + xuất Excel

Kịch bản được lưu ở dạng văn bản (`.md`), nhưng lệnh tạo kèm một __trang HTML__ (`preview.html` là khung trang, `data.js` là dữ liệu làm mới mỗi lần chạy) để dễ xem: chỉ cần __nhấp đúp mở bằng trình duyệt__ (không cần cài gì, không cần internet). Trang này lọc/tìm/phân trang các kịch bản gọn gàng.

Điểm riêng của `/test-cases`: trang HTML còn có nút __Xuất Excel__ — biến toàn bộ kịch bản thành một file bảng tính, tiện gửi cho người kiểm hoặc nhập vào công cụ quản lý test (như TestRail, Jira). Có hai kiểu xuất: một dòng cho mỗi bước (dễ lọc), hoặc gộp gọn theo từng kịch bản (đẹp để làm báo cáo). Trang cũng xem được ở __hai kiểu__: dạng thẻ (dễ đọc từng kịch bản) hoặc dạng bảng (dễ so sánh nhiều kịch bản).

Ngoài ra, mỗi kịch bản có nút __💬 ghi góp ý__ ngay tại chỗ, và nút __📋 chép toàn bộ góp ý__ — đây là đầu vào cho cách làm việc nhóm mô tả ở Mục 10.

Lưu ý như mọi khi: **file `.md` là bản gốc.** Sửa `.md` bằng tay thì phải chạy lại lệnh để trang HTML cập nhật theo.

## 8. “Tiêu đề” và “mô tả” phải nói được ý định, không chép máy móc

Một lỗi thường gặp của các công cụ sinh test là __chép nguyên văn__ dòng checklist vào tiêu đề, rồi thêm câu mô tả rập khuôn kiểu “Kiểm tra …”. Kết quả là kịch bản đọc vô nghĩa.

`/test-cases` được yêu cầu làm khác: tiêu đề __thêm ngữ cảnh làm rõ ý định__ (ví dụ nói rõ “với tài khoản *có tồn tại*”), mô tả nêu __vì sao case này quan trọng__ (ví dụ “để chống dò email: sai mật khẩu và email không tồn tại phải trả *cùng* một câu, không tiết lộ email nào có thật”). Với những case đơn giản (như hiển thị logo) thì cho phép tiêu đề ngắn gọn — không bắt bịa ra ý nghĩa giả.

## 9. Chạy lại lệnh: ba tình huống khác nhau, đừng lẫn

Câu "chạy lại lệnh thì nó chỉ điền phần còn thiếu" chỉ đúng cho __một__ trong ba tình huống. Hệ thống chốt kiểu chạy lại __trước khi__ sửa bất cứ thứ gì, dựa vào tình huống và cách bạn nói:

| Khi nào xảy ra | Hệ thống làm gì |
|---|---|
| Bạn vừa cấp những thứ còn thiếu trong bảng "cần bổ sung" (số liệu, quy tắc, tài khoản thử) rồi chạy lại | __Chỉ đụng kịch bản đang treo__ — điền vào, gỡ khỏi bảng. Kịch bản đã xong giữ nguyên |
| Danh sách checklist đã đổi — đây là kiểu __mặc định__ khi bạn nói *"update lại"* | Mục mới → sinh kịch bản mới; mục sửa → cập nhật theo; mục bị xoá → hỏi bạn xoá hay giữ |
| Bạn nói rõ *"làm lại từ đầu"* | Dựng lại toàn bộ, bỏ hết bản cũ |

Điểm cần nhớ: nếu thứ bạn cấp là một __quy tắc nghiệp vụ__ (ví dụ "khoá tài khoản sau 5 lần sai"), hãy cập nhật __tài liệu đặc tả trước__ rồi mới chạy lại — đừng để kịch bản test là nơi đầu tiên ghi quy tắc đó, vì sau này không ai truy được nó từ đâu ra.

Một chi tiết nhỏ nhưng hay gặp: khi một mục checklist bị xoá mà bạn chọn __giữ lại__ kịch bản tương ứng, kịch bản đó được đánh dấu __"đã nghỉ hưu"__. Nó vẫn nằm đó để tra cứu, nhưng không còn tính vào quan hệ một-đối-một nữa — nên đừng ngạc nhiên khi thấy số kịch bản nhiều hơn số mục checklist.

---

## 10. Góp ý trên trang xem rồi đưa ngược lại

Cách làm giống `/test-checklist` Mục 10: bấm 💬 góp ý ngay trên từng kịch bản, bấm 📋 chép hết, dán vào phiên chat — hệ thống phân 6 nhóm rồi dừng chờ bạn duyệt, chỉ nhóm (A) được sửa tự động.

Hai khác biệt, đều do ràng buộc một-đối-một:

* __Góp ý đòi thêm/bớt/tách/gộp kịch bản không sửa được ở đây__ (nhóm B) — làm vậy sẽ phá quan hệ một-đối-một. Phải quay lại `/test-checklist` sửa ở tầng danh sách, rồi chạy lại `/test-cases` kiểu "đồng bộ".
* __Áp xong, hệ thống tự kiểm lại toàn bộ file.__ Nếu phát hiện hỏng (ví dụ quan hệ một-đối-một bị vỡ) thì trả file về nguyên trạng trước khi sửa, không để dở dang.

---

## 11. BA/QC làm phần nào, ai làm phần nào?

* __BA/QC (bạn):__ duyệt kịch bản, bổ sung câu thông báo/quy tắc/trạng thái mà tài liệu còn thiếu, quyết định case nào ưu tiên.
* __Lệnh (AI):__ đọc checklist + tài liệu gốc, viết các bước và kết quả mong đợi, gắn điều kiện cần trước. Cờ “tự động được / làm tay” thì __mang nguyên từ checklist sang__ (không tự quyết) — nếu thấy không hợp lý, lệnh __cảnh báo__ để BA/QC sửa ở checklist rồi tạo lại, chứ không tự đổi.
* Không cần lập trình. Đây là bước __đặc tả kịch bản nghiệp vụ__, không phải viết code.

## 12. Vị trí trong họ lệnh test

`/test-cases` là __chặng giữa__:

* Trước nó: `/test-checklist` cung cấp danh sách tình huống (bắt buộc phải có).
* Sau nó: `/playwright-gen` biến kịch bản “tự-động-được” thành script Playwright chạy máy. Hoặc bạn xuất kịch bản sang công cụ quản lý test (TestRail/Jira) cho người kiểm làm tay.

Xem `test-family.md` để hiểu cả bộ.

## Câu chốt

> **`/test-cases` biến mỗi tình huống trong checklist thành một kịch bản đủ chi tiết để chạy — bám 1:1, kết quả mong đợi lấy từ tài liệu thật (không bịa), đủ giàu để về sau dựng thành test tự động, mà vẫn đọc được như tài liệu nghiệp vụ.**

## Xem thêm

* [`test-family.md` — cả bộ lệnh test nối với nhau thế nào](test-family.md)
* [`/test-checklist` — danh sách tình huống cần kiểm (bước trước)](test-checklist.md)
* [`/playwright-gen` — biến kịch bản thành script tự động (bước sau)](playwright-gen.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
