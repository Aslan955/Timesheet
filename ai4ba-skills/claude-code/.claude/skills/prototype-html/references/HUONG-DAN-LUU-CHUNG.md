# Hướng dẫn nối comment lên máy chủ chung (jsonbin.io) — cực đơn giản‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Làm 1 lần, ~5 phút. Xong thì mọi người mở link đều thấy comment của nhau, không mất khi đổi máy/trình duyệt. Miễn phí.
>
> __Không cần biết code.__ Chỉ đăng ký 1 email, copy 2 giá trị, dán vào file. Không bảng, không SQL, không "policy".
>
> ⚠️ __Chỉ dùng cho prototype NỘI BỘ.__ Chìa khoá nằm lộ trong file HTML — ai xem "View Source" cũng lấy được và sửa/xoá được. Anh đã chấp nhận rủi ro này ("nội bộ, không ai phá"). Đừng dùng cho dữ liệu quan trọng.

## Vì sao jsonbin (không phải Pantry / cái khác)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đã cân nhắc mấy dịch vụ "không cần đăng ký": __Pantry__ ít bước nhất nhưng __tự xoá dữ liệu nếu ~30 ngày không ai đụng__ — review hay diễn ra theo đợt rồi im, đúng lúc bị xoá thì mất sạch comment. __jsonbin__ đổi lấy 1 lần đăng ký email để có dữ liệu __bền vĩnh viễn__. Đáng.

## Các bước‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Bước 1 — Đăng ký + lấy Master Key (2 phút)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

1) Vào __https://jsonbin.io__ → __Sign Up__ (email hoặc Google).
2) Sau khi vào, menu → __API Keys__ (hoặc vào https://jsonbin.io/api-keys).
3) Copy __Master Key__ (chuỗi dài `$2a$10$...`). Đây là chìa khoá dùng chung.

### Bước 2 — Tạo 1 "bin" trống (1 phút)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

1) Menu → __Bins__ → __Create Bin__ (hoặc nút "+").
2) Xoá nội dung mẫu, dán đúng dòng này:
   ```json
   {"list":[]}
   ```
3) Bấm __Save/Create__.
4) Sau khi tạo, nhìn thanh URL: `https://jsonbin.io/app/bins/XXXXXXXXXXXX` — phần **`XXXXXXXXXXXX`** cuối là __Bin ID__. Copy lại.

### Bước 3 — Nhập Bin ID + Key (chế độ ADMIN)

> __Quan trọng — 2 vai:__ người __thiết lập__ (admin) và người __review__ (bình thường) thấy giao diện khác nhau:
> - __Admin__: mở file bằng URL có `#admin` (vd `prototype.html#admin`) → thấy nút __bánh răng__ để nhập/quản lý cấu hình.
> - __Reviewer__: nhận link thường → __KHÔNG thấy__ bánh răng, cài đặt, Bin ID/Key, hướng dẫn gì cả. Chỉ dùng comment như bình thường.
>
> Một khi đã mở `#admin` 1 lần, máy đó nhớ vai admin (khỏi gõ `#admin` mỗi lần).

__Cách nhập (admin):__ mở `prototype.html#admin` → bấm __bánh răng__ → hộp "Cài đặt lưu chung":
* Có sẵn ô copy đoạn `{"list":[]}` dán qua jsonbin (chính là Bước 2).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
* Dán __Bin ID__ + __Master Key__ → __Lưu & kết nối__. Sai định dạng sẽ báo lỗi ngay dưới ô.
* Sau khi nối, có nút __"Copy link gửi review"__ → gửi link đó cho mọi người.

__Người nhận link__ (reviewer): mở link là __tự nối + thấy comment ngay__, gõ tên 1 lần, dùng bình thường. Link này __không__ kèm `#admin` nên họ không thấy cài đặt/Key.

> __2 cách khác cho admin__ (nếu thích nhúng cứng vào file thay vì gõ trong app):
> - Sửa thẳng đầu `comment-layer.js`: `var BIN_ID='...'; var BIN_KEY='$2a$10$...';`
> - Hoặc đặt trước khi nhúng: `window.CMT_BIN_ID='...'; window.CMT_BIN_KEY='...';`
> Cách này thì mọi người mở file đã tự nối sẵn (khỏi cần link chia sẻ), nhưng vẫn không thấy cài đặt trừ khi mở `#admin`.

### Bước 4 — Host lên và chia sẻ

Đưa file HTML lên chỗ host tĩnh nào cũng được (kéo-thả là xong):
* __Netlify Drop__: https://app.netlify.com/drop — kéo file vào, có link ngay.
* __GitHub Pages__, __Vercel__, __Cloudflare Pages__ — đều được.

Gửi link cho mọi người. Ai mở cũng gõ tên (hỏi 1 lần), ghim comment, và __thấy comment của nhau__. Chấm tròn trên thanh công cụ: __xanh__ = đã đồng bộ, __vàng__ = đang đồng bộ, __đỏ__ = mạng lỗi (comment vẫn lưu tạm trên máy, tự đẩy lại khi có mạng).

## Nó hoạt động thế nào (để yên tâm)

* __Local-first__: mọi thao tác vẫn tức thời trên máy (không chờ mạng). Backend chạy nền.
* __Kéo (pull)__: cứ 15 giây + mỗi khi quay lại tab → tải comment mới của người khác về, __trộn__ vào (không đè cái đang gõ dở).
* __Đẩy (push)__: mỗi lần lưu comment → __đọc bản mới nhất, trộn, rồi mới ghi lại__ (read-merge-write). Nhờ vậy 2 người ghi gần nhau __không đè mất comment của nhau__ — dù jsonbin lưu cả danh sách trong 1 chỗ.
* __Mất mạng__: comment vẫn lưu localStorage, có mạng lại thì tự đẩy lên.

## Giới hạn free tier (đủ dùng cho review nội bộ)

* 10.000 request → dư sức cho vài chục người review vài trăm comment.
* Dữ liệu __không bao giờ tự mất__ (khác Pantry).
* Nếu vượt 10.000 request thì tạm dừng tới tháng sau, hoặc tạo tài khoản mới.

## Nhiều prototype dùng CHUNG 1 bin (tuỳ chọn)

Mỗi comment tự gắn tên feature, nên __nhiều file prototype khác nhau có thể dùng chung 1 Bin ID + Key__ mà không lẫn — mỗi file chỉ thấy comment của feature mình. Đỡ phải tạo bin riêng cho từng cái.

## Gỡ bỏ (quay lại chỉ-lưu-máy)

Xoá 2 giá trị `BIN_ID`/`BIN_KEY` (để rỗng) → module tự về chế độ localStorage như cũ.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
