---
type: skill-explainer
skill: gap
updated: 2026-07-16
---

# /gap là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/gap` trả lời **đúng một câu hỏi**: *"tính năng này còn **thiếu luồng nghiệp vụ** nào không?"*

**Ví dụ vàng để nhớ cả đời:** tài liệu ghi rõ *"sai mật khẩu 5 lần thì khóa tài khoản"* — nhưng đọc hết cả feature **không thấy chỗ nào mở khóa lại**. Vậy là người dùng bị khóa vĩnh viễn, không có đường ra. Đó chính là **thiếu luồng nghiệp vụ**. Máy tính không báo "thiếu file" — vì mọi file vẫn đủ. Nhưng nghiệp vụ thì **cụt**.

Vài tình huống điển hình nên gõ `/gap`:

- Có màn thanh toán thành công, nhưng **thiếu nhánh thẻ bị từ chối giữa chừng**.
- Có luồng gửi mã OTP, nhưng **không có luồng gửi lại OTP khi hết hạn**.
- Có "tạo đơn hàng", nhưng **không thấy đâu hủy đơn / hoàn tiền**.

Nói gọn: **gõ `/gap` khi bạn muốn hỏi "mình đã bỏ sót đường nào chưa vẽ chưa?"** trước khi đưa tài liệu cho dev.

> Ngoài cách dùng chính (soi 1 tính năng) ở trên, `/gap` còn một chế độ phụ ít dùng hơn: gõ `/gap --product` để đối chiếu **danh sách tính năng của cả sản phẩm** với **lộ trình (roadmap)** — xem có tính năng nào đã lên kế hoạch mà quên xếp vào lộ trình, hoặc ngược lại. Phần còn lại của tài liệu này nói về cách dùng chính.

## 2. Cách nó tìm — hai người thợ, không ai được bịa‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/gap` dùng **hai người thợ**. Người thứ nhất (cái máy) chạy trước để khoanh vùng, người thứ hai (trợ lý đọc hiểu) soi tiếp phần chữ. Mỗi người giỏi một kiểu, và **cả hai đều bị buộc phải kèm bằng chứng — không được phán suông**.

### Thợ thứ nhất: cái máy dò (chạy bằng thuật toán)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cái máy này **đọc sơ đồ trạng thái** của tính năng (file `states.md` — bản vẽ mô tả mỗi thứ có những trạng thái nào và đi qua lại ra sao). Nó dò **mấy kiểu lỗ hổng bằng máy** — hai kiểu đầu soi thuần hình học (đếm mũi tên, chắc chắn), hai kiểu sau đối chiếu chữ (dễ báo nhầm hơn, nên máy tự hạ mức):

   +--------------------------------------------------------------+
   |   CAC KIEU LO HONG MAY DO DUOC (soi hinh ve + doi chieu chu) |
   +--------------------------------------------------------------+
   |                                                              |
   |  (a) VAO DUOC MA KHONG RA DUOC                               |
   |      Co mui ten di VAO trang thai "locked" nhung             |
   |      KHONG co mui ten nao di RA.                             |
   |      -> nghi "locked" thieu luong thoat (mo khoa?)          |
   |                                                              |
   |  (b) KET, KHONG TOI DUOC DIEM KET THUC                       |
   |      Di long vong mai ma khong bao gio cham vao             |
   |      diem "xong" -> nghi bi ket vong lap.                   |
   |                                                              |
   |  (c) CO CHIEU DI, THIEU CHIEU VE                             |
   |      Co "khoa" thi thuong phai co "mo khoa";                |
   |      co "logout" thi phai co "login". Thay 1 chieu           |
   |      ma khong thay chieu nguoc lai -> nghi thieu.           |
   |                                                              |
   |  (d) DOI TUONG THIEU THAO TAC                                |
   |      Moi doi tuong (don hang, tai khoan...) thuong           |
   |      can du: tao / xem / sua / xoa. Thay co "tao" ma         |
   |      khong thay "xoa" -> hoi lai cho chac.                   |
   |                                                              |
   +--------------------------------------------------------------+

**Vì sao máy đáng tin hơn ở kiểu (a) và (b)?** Vì đó là chuyện **hình học thuần**: mũi tên có hay không, ai cũng đếm ra như nhau. Kiểu (c) yếu hơn — nó chỉ khớp **chữ** ("khóa"/"mở khóa"), nên đôi khi báo nhầm. Vì vậy máy tự chia mức **mạnh / yếu / cần xác nhận**.

### Thợ thứ hai: trợ lý biết ĐỌC HIỂU (`@flow-reviewer`)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Máy chỉ thấy **cái đã vẽ thành sơ đồ**. Nhiều nhánh nghiệp vụ lại nằm trong **chữ** — trong bảng lỗi, trong mô tả use case, trong wireframe. Nên có thêm một **trợ lý biết đọc hiểu** đi soi phần chữ đó.

Trợ lý này bắt được thứ máy không thấy, ví dụ: **bảng lỗi có mã `E-payment-012` "thẻ hết hạn", nhưng không màn hình nào hiển thị thông báo đó** — tức là lỗi được định nghĩa mà người dùng chẳng bao giờ được báo. Máy đếm mũi tên không tìm ra loại này; người đọc hiểu thì thấy ngay.

## 3. Chống bịa — luật quan trọng nhất

Đây là chỗ dễ hỏng nhất của mọi công cụ "tìm thiếu sót": **trích được "có khóa" thì DỄ, nhưng kết luận "thiếu mở khóa" thì NGUY HIỂM** — vì "mở khóa" có thể nằm ở một file chưa đọc, hoặc máy đọc sót.

Nên `/gap` bắt buộc **mỗi phát hiện phải chứng minh CẢ HAI vế**:

- **Vế "có A":** chỉ ra dòng nào, file nào. Ví dụ `states.md:31` có câu "khóa sau 5 lần sai".
- **Vế "chưa thấy B":** đã **tìm những từ nào** (mở khóa, gỡ khóa, unlock...) trên **những file nào**, và đã đọc hết chưa.

Nếu chưa tìm đủ các cách gọi, hoặc chưa đọc hết file → **KHÔNG được phép nói "THIẾU"**.

Và cách nói cũng phải **giọng nghi vấn, không phán xanh rờn**:

> ❌ Sai: "**THIẾU luồng mở khóa.**"
>
> ✅ Đúng: "Có luồng khóa tài khoản (`states.md:31`), đã tìm 'mở khóa'/'unlock' trên 8 file không thấy — **anh xác nhận là cố ý bỏ qua, hay cần bổ sung?**"

**Người chốt luôn là BA, không phải máy.** `/gap` chỉ đưa ra *nghi vấn có bằng chứng*, còn "đây có thật là thiếu sót không" thì bạn quyết. Nếu không tìm ra gì, nó nói thẳng **"không phát hiện"** — chứ không nặn ra cho có.

## 4. Kết quả xếp thế nào

Phát hiện được **xếp theo mức tin cậy**, mạnh lên đầu:

- **mạnh** — thuần hình học (vào-không-ra-được, kẹt không tới điểm kết thúc). Đáng xem trước.
- **yếu** — tên gợi ý đây là điểm kết thúc tự nhiên (`expired`, `used`, `revoked` thường đúng là dừng ở đó, tài liệu chỉ thiếu ghi dấu "kết thúc"). Xếp cuối, gợi ý bổ sung nhẹ nhàng.
- **cần xác nhận** — máy chỉ khớp chữ, có thể nhầm.

Cuối cùng nó ghi một **ma trận truy vết** (bảng đối chiếu ai nối với ai: yêu cầu ↔ story ↔ màn hình ↔ lỗi) vào `docs/_shared/traceability.md`, để lần sau soi tiếp cho nhanh.

## 5. Một BA thật dùng `/gap` như thế nào

> **Lan (BA)** vừa viết xong tài liệu tính năng đăng nhập, sắp đưa dev. Gõ:
>
>     /gap authentication
>
> Vài giây sau, `/gap` báo:
>
> - **[mạnh]** "Trạng thái `locked` vào được nhưng không có đường ra (`states.md:31`) — có luồng nào đưa nó tới điểm kết thúc không?"‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
> - **[yếu]** "`expired` không có đường ra — tên gợi ý đây là kết thúc tự nhiên, có thể chỉ cần ghi dấu `--> [*]`."
> - **[trợ lý đọc]** "Mã lỗi `E-auth-007` 'tài khoản bị khóa' có trong bảng lỗi nhưng không màn nào hiển thị — người dùng bị khóa mà không biết vì sao?"
>
> Lan đọc, gật gù: cái `locked` đúng là **quên mất màn mở khóa qua email** — thiếu thật. Cái `expired` thì cố ý, chỉ ghi thêm dấu kết thúc. Cái mã lỗi thì phải thêm màn thông báo.
>
> Lan không sửa trong `/gap` (nó chỉ báo cáo). Cô gõ tiếp `/cr "thêm luồng mở khóa tài khoản qua email"` để sửa cho đúng quy trình.

**Điểm mấu chốt:** `/gap` không tự sửa gì cả. Nó là **cái đèn pin soi lỗ hổng**, còn vá lỗ thì dùng `/cr`.

## 6. Toàn bộ luồng chạy — sơ đồ

   +-----------------------------------------------------------+
   |  Ban go:  /gap authentication                             |
   +-----------------------------------------------------------+
                          |
                          v
   +-----------------------------------------------------------+
   |  [1] Chon tinh nang (go san ten thi dung luon)            |
   +-----------------------------------------------------------+
                          |
                          v
   +-----------------------------------------------------------+
   |  [2] MAY DO chay tren so do trang thai + doi chieu chu    |
   |      - vao-khong-ra-duoc   (manh)                         |
   |      - ket, khong toi ket thuc  (manh)                    |
   |      - co chieu di thieu chieu ve  (can xac nhan)         |
   |      - doi tuong thieu thao tac tao/xem/sua/xoa (nhe)     |
   +-----------------------------------------------------------+
                          |
                          v
   +-----------------------------------------------------------+
   |  [3] DOC chu that: use case, bang loi, wireframe          |
   |      (in ro da doc file nao -> ban thay do phu)           |
   +-----------------------------------------------------------+
                          |
                          v
   +-----------------------------------------------------------+
   |  [4] TRO LY doc hieu (@flow-reviewer) bat nhanh thieu     |
   |      ma may khong thay (loi co trong bang, khong man hien)|
   +-----------------------------------------------------------+
                          |
                          v
   +-----------------------------------------------------------+
   |  [5] Loc theo 3 nhan: chua-toi-buoc (im) /               |
   |      thieu-that (bao) / mau-thuan (bao)                   |
   +-----------------------------------------------------------+
                          |
                          v
   +-----------------------------------------------------------+
   |  [6] Xep manh -> yeu, moi phat hien KEM BANG CHUNG,       |
   |      noi giong NGHI VAN (chua co X - xac nhan?)           |
   +-----------------------------------------------------------+
                          |
                          v
   +-----------------------------------------------------------+
   |  [7] Xem truoc (L1) -> ghi ma tran truy vet               |
   |      vao docs/_shared/traceability.md                     |
   +-----------------------------------------------------------+
                          |
                          v
                 Ban chot -> viec vao dung
                 thi go /cr de sua

## 7. Khi chưa có đủ dữ liệu

Nếu tính năng **chưa có sơ đồ trạng thái** (`states.md`), cái máy dò không có gì để soi. `/gap` **báo thẳng**:

> "Tính năng này chưa có sơ đồ trạng thái nên chưa soi được luồng trạng thái — chạy `/state` để vẽ trước."

Nó **KHÔNG bịa** ra "luồng thiếu" từ con số không. Tương tự, chưa có sơ đồ luồng người dùng thì nó gợi ý chạy `/user-flow`. Nguyên tắc bất di bất dịch: **không có nguồn thì không đoán** — thà nói "chưa đủ dữ liệu" còn hơn nặn ra một danh sách nghe hợp lý mà sai.

Cũng cần biết: `docs/` hiện tại phần lớn là **tài liệu demo cũ**, nên đôi khi `/gap` báo vài gap "giả" do dữ liệu demo thiếu liên kết — đó là lỗi của dữ liệu mẫu, không phải lỗi tính năng thật của bạn.

## Xem thêm

- Chi tiết kỹ thuật đầy đủ: `.claude/skills/gap/SKILL.md`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
