---
type: skill-explainer
skill: erd-family
updated: 2026-08-01
---

# Ba lệnh vẽ "sơ đồ dữ liệu" — chọn cái nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Tài liệu này giải thích __mối liên quan__ giữa ba lệnh cùng vẽ sơ đồ dữ liệu: `/erd`, `/d2-erd`, `/dbdiagram`. Muốn hiểu sâu từng lệnh, đọc file explainer riêng của nó (liệt kê ở cuối).

## 1. Vì sao lại có tận ba lệnh cho cùng một việc?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cả ba lệnh đều trả lời cùng một câu hỏi nghiệp vụ: __"tính năng này cần lưu những loại thông tin gì, và các loại thông tin đó gắn với nhau ra sao?"__ Kết quả đều là một __sơ đồ dữ liệu__ (tên chuyên môn: ERD): mỗi ô là một "bảng" thông tin (Khách hàng, Đơn hàng, Giao dịch...), bên trong liệt kê các mẩu thông tin của bảng đó, và các đường nối cho biết mối liên hệ ("một Khách hàng đặt nhiều Đơn hàng").

Vậy tại sao không gộp làm một? Vì cùng một bức tranh dữ liệu có thể cần __cho ra theo ba cách phục vụ ba nhu cầu khác nhau__ — giống như cùng một ngôi nhà, bạn có thể cần bản phác nhanh để bàn với chủ nhà, bản in đẹp để đóng khung, hay bản kỹ thuật chi tiết để giao thợ xây. Mỗi lệnh mạnh ở một chỗ:

* **`/erd`** — vẽ nhanh, __nhúng thẳng vào tài liệu__, tự hiện khi mở (không cần cài công cụ). Cho BA và stakeholder đọc.
* **`/d2-erd`** — **cùng nội dung như `/erd`, chỉ khác kiểu vẽ** (dùng công cụ D2), cho ra một __file ảnh riêng__.
* **`/dbdiagram`** — đi __sâu hơn về kỹ thuật__: kiểu database thật, danh sách lựa chọn, __xuất ra mã SQL__ cho dev dựng database.

Điểm cần nhớ ngay: khác biệt giữa ba lệnh nằm ở __hai trục__ — __kiểu vẽ__ (Mermaid hay D2) và __độ chi tiết__ (nghiệp vụ hay gần dev) — chứ __không phải cái nào "đẹp hơn" hay "xịn hơn"__.

---

## 2. Bảng chọn nhanh‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nếu chỉ đọc một phần, đọc bảng này:

```
 CÂU HỎI                                          → CHỌN LỆNH

 Muốn hình dữ liệu HIỆN NGAY trong tài liệu
 (mở trên GitHub / Obsidian là thấy hình luôn,
 không cần cài gì)?                               → /erd  (Mermaid)

 Muốn cùng nội dung đó nhưng là một FILE ẢNH
 RIÊNG (dán slide / gửi email), hoặc muốn thử
 một kiểu vẽ khác cho hợp mắt?                    → /d2-erd  (D2)

 Cần BÀN GIAO cho dev dựng database: kiểu dữ
 liệu thật, danh sách lựa chọn, quy tắc chống
 trùng, và một file SQL chạy được ngay?          → /dbdiagram  (DBML → SQL)
```

Một câu để nhớ: **đọc-trong-tài-liệu → `/erd`; file-ảnh-riêng → `/d2-erd`; bàn-giao-dev-xuất-SQL → `/dbdiagram`.**

---

## 3. So sánh ba lệnh cạnh nhau‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cả ba vẽ __cùng một loại nội dung__ (bảng + liên hệ) — khác nhau ở hai chuyện: __vẽ bằng kiểu nào__ và __chi tiết tới mức nào__.

| | `/erd` | `/d2-erd` | `/dbdiagram` |
|---|---|---|---|
| __Công cụ vẽ__ | Mermaid | D2 | DBML (ngôn ngữ mô tả database) |
| __Khác biệt chính__ | Nhúng thẳng vào tài liệu, tự hiện khi mở | Cùng nội dung `/erd`, chỉ khác kiểu vẽ | Đi sâu hơn về kỹ thuật, xuất được SQL |
| __Độ chi tiết__ | Mức nghiệp vụ (kiểu gọn: chữ/số/ngày) | Mức nghiệp vụ (như `/erd`) | Gần dev (kiểu database thật, danh sách lựa chọn cố định, quy tắc chống trùng) |
| __Cần cài công cụ?__ | Không | Có (công cụ D2) | Có (một công cụ nhỏ để xuất SQL) |
| __Kết quả để ở đâu__ | Nhúng trong file dữ liệu của tính năng | File ảnh `.svg` đứng riêng | File `.dbml` (dán lên dbdiagram.io) + file `.sql` cho dev |
| __Ai xem / dùng làm gì__ | BA/stakeholder đọc trong tài liệu | Ai thích style này, hoặc cần file ảnh rời | Dev / kỹ sư database triển khai |

> Note: `/dbdiagram` đặt tên theo trang web __dbdiagram.io__ (nơi dán file để xem sơ đồ), nhưng file sinh ra có đuôi `.dbml` — vì "DBML" là tên *ngôn ngữ*, còn "dbdiagram.io" là tên *công cụ xem*. Đừng tìm file đuôi `.dbdiagram` — không có.

---

## 4. Hai ranh giới quan trọng — hiểu đúng để chọn không nhầm‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trong họ này có hai chỗ hay bị hiểu sai. Nắm được hai chỗ này là chọn đúng gần như mọi lúc.

**Ranh giới thứ nhất: `/erd` và `/d2-erd` chỉ khác KIỂU VẼ, không cái nào đẹp hơn.** Hai lệnh này cho ra __cùng một nội dung__ (cùng các bảng, cùng các liên hệ, cùng độ chi tiết nghiệp vụ) — chỉ khác công cụ vẽ bên dưới (Mermaid với `/erd`, D2 với `/d2-erd`) và __nơi kết quả nằm__ (nhúng trong tài liệu với `/erd`, file ảnh riêng với `/d2-erd`). Vì thế đừng chọn `/d2-erd` vì nghĩ "nó xịn hơn" — nó không xịn hơn, chỉ là __một style vẽ khác__ để bạn có thêm lựa chọn. Chọn theo: muốn nhúng thẳng, không cài gì → `/erd`; muốn file ảnh rời hoặc thử dàn hình khác → `/d2-erd`.

**Ranh giới thứ hai: `/dbdiagram` khác về ĐỘ CHI TIẾT, không phải kiểu vẽ.** `/dbdiagram` không đơn thuần là "một cách vẽ khác" — nó __đi sâu hơn hẳn__: dùng đúng kiểu dữ liệu thật của database, thêm được danh sách lựa chọn cố định (ví dụ trạng thái đơn chỉ được là "chờ / đã trả / đã huỷ"), quy tắc chống trùng, giá trị mặc định — những thứ `/erd` và `/d2-erd` cố tình không diễn tả. Và nó xuất kèm một file __SQL__ để dev dựng database chạy được ngay. Đây là lệnh __gần dev nhất__ trong ba anh em.

Từ hai ranh giới đó suy ra một điều quan trọng: **`/dbdiagram` không phải "cái tốt nhất phải luôn dùng".** Với một tính năng nhỏ chỉ có 2-3 bảng mà bạn chỉ muốn thấy nhanh chúng liên hệ ra sao, thì `/erd` là đủ và nhẹ hơn nhiều. `/dbdiagram` chỉ thật sự phát huy khi bạn cần __bàn giao dev, xuất SQL, hoặc mô tả dữ liệu phức tạp__. Chọn theo đúng nhu cầu, đừng chọn theo "cái nào chi tiết nhất".‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

---

## 5. Ba điểm giống nhau ở cả ba lệnh

Dù khác công cụ và độ chi tiết, cả ba vận hành theo cùng vài nguyên tắc:

1. __Không có nguồn thì không bịa.__ Cả ba đều ưu tiên đọc tài liệu sẵn có của tính năng (đặc tả, hoặc sơ đồ dữ liệu đã vẽ trước đó) để rút ra các bảng. Thiếu thông tin → __hỏi bạn__ ("có những loại thông tin nào, mỗi loại lưu gì, liên hệ với nhau ra sao"), chứ không tự nghĩ ra bảng hay tự đoán liên hệ. `/d2-erd` và `/dbdiagram` còn tận dụng luôn bản `/erd` đã vẽ trước đó (nếu có) làm nguồn — không bắt bạn mô tả lại từ đầu.

2. __Bạn mô tả nghĩa nghiệp vụ, máy lo phần còn lại.__ Cả ba đều __không__ hỏi bạn những câu kỹ thuật của dân database ("cột này kiểu gì", "dài bao nhiêu ký tự", "có đánh chỉ mục không"). Bạn chỉ mô tả nghĩa nghiệp vụ ("email là địa chỉ liên hệ", "số tiền là giá đơn"). Ngay cả `/dbdiagram` — dù *tạo ra* thứ chi tiết cho dev — cũng __không bắt bạn phải nghĩ như dev__; nó tự chọn kiểu dữ liệu phù hợp.

3. __Xem trước rồi mới ghi, và tự kiểm trước khi báo xong.__ Trước khi ghi, cả ba đều mô tả bằng lời sẽ vẽ gì và chờ bạn gật đầu (file đã có thì cho xem phần thay đổi trước/sau). Sau khi ghi, cả ba đều __tự kiểm__: `/erd` và `/d2-erd` tự vẽ thử ra ảnh (và `/erd` còn tự mở ảnh soi lại để bắt lỗi *vẽ ngược chiều liên hệ* — lỗi mà máy kiểm cú pháp không thấy); còn `/dbdiagram` tự __thử biến bản mô tả thành file SQL__ — xuất được SQL sạch nghĩa là mô tả chắc chắn hợp lệ, dev import được ngay.

Một điểm chung nữa: __không xem-và-sửa nhiều vòng trong khung chat.__ Cả ba đều dùng "mã chữ" không hiện thành hình trong chat, nên bạn xem hình từ file/web đã xuất ra, thấy cần đổi thì gọi lại lệnh và nói cần sửa gì — hệ thống tự hiểu là đang sửa bản cũ (không tạo trùng).

---

## 6. Rủi ro lớn nhất khi dùng nhiều hơn một lệnh: ba bản trôi lệch nhau

Đây là điều cần biết nếu bạn dùng từ hai lệnh trở lên cho cùng một tính năng.

Ba lệnh cho ra __ba file riêng biệt__, cùng mô tả một bức tranh dữ liệu. Vấn đề xuất hiện khi nghiệp vụ thay đổi: bạn thêm một bảng mới vào bản `/erd`, nhưng quên cập nhật bản `/d2-erd` đã gửi cho sếp và bản `/dbdiagram` đã đưa dev. Ba tháng sau, ba tài liệu nói ba chuyện khác nhau — và không ai biết bản nào mới nhất.

Điều làm chuyện này khó phát hiện: __mỗi file tự nó vẫn hoàn toàn hợp lệ.__ Bản `/d2-erd` thiếu một bảng vẫn vẽ ra ảnh đẹp; bản `/dbdiagram` cũ vẫn xuất được SQL sạch. Không công cụ kiểm tra đơn lẻ nào thấy được vấn đề, vì nó chỉ soi trong phạm vi một file.

Vì vậy hệ thống có một bước __đối chiếu chéo__: bản `/erd` (Mermaid) được coi là __bản chuẩn__, và khi bạn chạy `/d2-erd` hoặc `/dbdiagram`, nó so bản mới với bản chuẩn — bảng nào thừa, bảng nào thiếu, liên hệ nào lệch — rồi báo cho bạn biết.

Kinh nghiệm thực tế: **đổi nghiệp vụ thì sửa bản `/erd` trước**, rồi chạy lại hai lệnh kia để chúng bám theo. Đừng sửa tay từng file một.

---

## 7. Ví dụ thực tế — cùng một dữ liệu, ba cách dùng

Anh __Minh__, một BA phụ trách tính năng "flashcard" (thẻ ghi nhớ) của một app học tiếng Anh, trong vòng đời của tính năng gặp ba nhu cầu khác nhau về sơ đồ dữ liệu — và mỗi lần anh chọn một lệnh khác nhau theo đúng nhu cầu:

1. __Lúc viết đặc tả__ — anh muốn ghi lại "tính năng lưu những gì" ngay trong tài liệu để dev đọc tài liệu là thấy, không phải mở file ảnh riêng. Anh dùng `/erd`: hình nhúng thẳng vào tài liệu, mở trong VS Code là hiện ra ngay giữa trang, không cần cài gì.

2. __Lúc chuẩn bị họp với ban giám đốc__ — anh cần một __file ảnh riêng__ để dán vào slide, và muốn thử một kiểu vẽ khác xem có gọn mắt hơn không. Anh dùng `/d2-erd`: nó đọc lại bản `/erd` đã có (không bắt mô tả lại), vẽ ra một file ảnh `.svg` đứng riêng, anh dán thẳng vào slide.

3. __Lúc bàn giao cho dev dựng database__ — anh cần đưa cho dev thứ chạy được ngay, và dữ liệu có một danh sách lựa chọn cố định (kết quả ôn thẻ chỉ được là "quên / mơ hồ / đã nhớ"). Anh dùng `/dbdiagram`: nó nâng cấp bản dữ liệu lên mức database thật, xuất ra một file `.dbml` (anh dán lên dbdiagram.io để cả team xem) và một file `.sql` được sinh trực tiếp từ cùng bản `.dbml` (anh gửi thẳng cho dev chạy dựng database, khỏi phải gõ lại theo tài liệu — vừa mất công vừa dễ sai lệch).

Điểm mấu chốt: anh Minh __không__ vẽ cùng một thứ ba lần cho phí công. Ba lần dùng ba lệnh là vì ba nhu cầu thật khác nhau — đọc trong tài liệu, dán slide, và bàn giao dev — và ba lệnh phục vụ đúng ba nhu cầu đó. Nhiều bản của cùng một dữ liệu có thể tồn tại song song, không cái nào xoá cái nào.

---

## Xem thêm

Muốn hiểu sâu từng lệnh, đọc file explainer riêng:

* `explain-skills/erd.md` — `/erd` (Mermaid, nhúng thẳng vào tài liệu, cho BA/stakeholder đọc).
* `explain-skills/d2-erd.md` — `/d2-erd` (D2, cùng nội dung `/erd` nhưng khác kiểu vẽ, file ảnh riêng).
* `explain-skills/dbdiagram.md` — `/dbdiagram` (DBML, gần dev nhất, xuất SQL, chia sẻ trên dbdiagram.io).

Quy tắc chọn diagram đầy đủ (cho mọi loại sơ đồ, không chỉ dữ liệu) nằm ở:

* `explain-skills/diagram-selection.md` — bàn chỉ đường chọn loại sơ đồ (bản cho người).
* `.claude/rules/diagram-selection.md` — quy tắc gốc (bản kỹ thuật, cho máy).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
