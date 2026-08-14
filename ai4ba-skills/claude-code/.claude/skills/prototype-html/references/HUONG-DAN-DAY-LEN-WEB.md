# Đẩy prototype lên web (GitHub Pages) — đẩy file gì, làm gì trước‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Trả lời ngắn: **chỉ cần đẩy 1 file `.html`** (bản đã nhúng comment layer). Không cần `comment-layer.js`, không cần file `.md` nào.

## 1. Đẩy file gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| File | Có cần đẩy? |
|---|---|
| `example-authentication-commentable.html` (hoặc file prototype của anh đã nhúng layer) | **CÓ — chỉ cần cái này** |
| `comment-layer.js` | **KHÔNG** — nội dung của nó đã nằm sẵn bên trong file `.html` |
| `README.md`, `HUONG-DAN-*.md` | **KHÔNG** — tài liệu nội bộ, không cần lên web |

Kiểm nhanh xem file `.html` đã tự chứa chưa: mở file bằng trình soạn thảo, tìm chữ `COMMENT LAYER` — có là đã nhúng. Và **không được** có dòng nào kiểu `<script src="comment-layer.js">` (nếu có thì file đang phụ thuộc file ngoài).

## 2. Các bước đẩy‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```bash
# trong repo của anh
mkdir -p prototype
cp example-authentication-commentable.html prototype/auth.html
git add prototype/auth.html
git commit -m "Add clickable prototype with comments"
git push
```

Rồi vào **repo → Settings → Pages → Source: main branch** → lưu. Vài phút sau có link:
`https://<tên-tài-khoản>.github.io/<tên-repo>/prototype/auth.html`

> Repo **public** thì ai có link đều xem được. Repo **private** thì GitHub Pages cần bản trả phí — nếu muốn miễn phí mà kín hơn, dùng **Netlify Drop** (kéo-thả file, link ngẫu nhiên khó đoán).

## 3. Thiết lập kho comment (làm 1 lần, SAU khi có link web)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Thứ tự này quan trọng:‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

1) Mở link web kèm `#admin`:
   `https://.../prototype/auth.html#admin`
2) Bấm **bánh răng** → dán **Bin ID + Master Key** (xem `HUONG-DAN-LUU-CHUNG.md` để lấy) → **Lưu & kết nối**.
3) Vẫn trong hộp đó, bấm **"Copy link gửi review"**.
4) Gửi link vừa copy cho mọi người.

Người nhận mở link → tự nối, gõ tên 1 lần, comment được ngay, **không thấy** cài đặt/Key.

## 4. Vài điều nên biết (tránh bối rối)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* **Comment thử ở máy sẽ KHÔNG theo lên web.** Bản lưu tạm trên máy gắn theo đường dẫn file, mà `file:///Users/...` khác `https://....github.io/...`. Lên web coi như bắt đầu sạch — thường là điều anh muốn.
* **Comment thật nằm trên jsonbin**, không nằm trong file. Nên anh **sửa lại prototype rồi đẩy đè file mới, comment vẫn còn** (miễn giữ nguyên Bin ID + Key).
* **Đổi tên file trên web** (vd `auth.html` → `login.html`) cũng không mất comment — nó kéo lại từ jsonbin. Chỉ là bản đệm trên máy mỗi người coi như mới.
* **Nhiều prototype trên cùng một trang web**: mỗi file nên dùng **1 bin riêng** để comment không lẫn. Hoặc dùng chung 1 bin cũng được — module tự tách theo feature. Nhưng bin riêng thì rõ ràng hơn.
* **HTTPS giúp nút Copy chạy mượt hơn** so với mở file trực tiếp (`file://` hay bị chặn clipboard). Đây là điểm cộng khi lên web.

## 5. Cập nhật prototype về sau

Sửa xong, chạy lại lệnh dựng file (nhúng layer vào prototype mới), rồi `git push` đè lên. Người dùng tải lại trang là thấy bản mới; comment cũ vẫn nguyên vì nằm trên jsonbin.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
