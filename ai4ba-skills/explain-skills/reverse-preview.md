---
type: skill-explainer
skill: reverse-preview
updated: 2026-07-26
---

# `/reverse-preview` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/reverse-preview` gom **một bộ tài liệu đặc tả vừa được dựng lại** (bằng `/code-to-srs` đọc từ mã nguồn, hoặc `/reverse-doc` đọc từ tài liệu cũ) thành **một trang HTML duy nhất để xem cho dễ**.

Ví dụ lệnh:

```text
/reverse-preview login-2fa
```

Trong đó `login-2fa` là tên tính năng đã có bộ tài liệu dựng lại.

Điểm mấu chốt: bộ tài liệu dựng lại **không giống** tài liệu bạn tự viết. Mỗi dòng trong đó mang một **nhãn tin cậy** cho biết nó được nguồn nói thẳng, được suy ra, hay còn phải xác nhận. Trang xem này giữ và làm nổi bật các nhãn đó, thay vì trình bày mọi dòng như nhau.

Bạn nên gõ lệnh này khi:

- Vừa chạy xong `/code-to-srs` hoặc `/reverse-doc` và muốn đọc lại toàn bộ kết quả một lượt cho dễ, thay vì mở từng file.
- Cần đưa bộ tài liệu dựng lại cho người khác xem (tech lead, PO) để cùng rà chỗ nào máy đoán sai.
- Muốn nhìn tập trung vào danh sách **những chỗ còn thiếu / còn phải hỏi** trước khi bắt tay hình thức hoá bằng `/srs`.

> **Một câu để nhớ:** `/reverse-preview` = "bàn xem cho bản tài liệu *máy dựng lại*, luôn kèm nhãn cho biết chỗ nào chắc chỗ nào đoán".

***

## 2. Khác `/preview` ở chỗ nào? — đây là điều quan trọng nhất‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Hai lệnh nhìn giống nhau (cùng tạo một trang HTML để xem) nhưng phục vụ **hai loại tài liệu khác hẳn nhau**:

| | `/preview` | `/reverse-preview` |
|---|---|---|
| Xem tài liệu nào | Bộ tài liệu chính của tính năng (`docs/{tính-năng}/`) | Bản dựng lại từ bằng chứng (`docs/_reverse/{tính-năng}/`) |
| Cột "Nhãn" tin cậy | **Bỏ đi** — tài liệu chính không dùng thang nhãn này | **Giữ nguyên và làm nổi bật** — đây là giá trị cốt lõi |
| Có wireframe / bản vẽ màn hình | Có | Không (bản dựng lại không có phần này) |
| Câu hỏi còn treo | Có mục Open Questions | Có, và **đặt nổi bật** vì là việc phải chốt trước khi chạy `/srs` |
| Bảng truy vết về mã nguồn | Không | Có (khi bộ tài liệu dựng từ mã nguồn) |

Nói ngắn gọn: dùng nhầm `/preview` cho bộ dựng lại thì bạn mất đúng thông tin quan trọng nhất — **dòng nào đáng tin tới đâu**.

***

## 3. Ba dấu nhãn tin cậy nghĩa là gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là thứ bạn sẽ thấy nhiều nhất khi đọc trang này, nên cần hiểu rõ:

- **✅ — chắc chắn.** Nguồn nói thẳng ra điều này. Ví dụ: mã nguồn có dòng kiểm tra "mật khẩu tối thiểu 8 ký tự", hoặc tài liệu cũ ghi rõ con số đó. Loại này thường kèm chỉ dẫn tới đúng chỗ trong nguồn (tên file và số dòng) để bạn tự kiểm chứng.
- **🔵 — suy ra được.** Nguồn không nói thẳng nhưng có thể suy ra khá an toàn từ nhiều mảnh ghép lại.
- **🟡 — phỏng đoán.** Nguồn **im lặng** về chuyện này, máy điền vào cho đủ khung tài liệu. Đây là loại bạn phải soi kỹ nhất.

Vì sao hai loại lẫn trong cùng một tài liệu? Vì nguồn chỉ kể được **cái gì đang xảy ra**, hiếm khi kể **vì sao và cho ai**. Máy biết chắc "khoá tài khoản sau 5 lần sai" (✅), nhưng không biết vì sao chọn con số 5 — chỗ đó buộc phải để 🟡 và đưa vào danh sách cần hỏi.

***

## 4. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
 BẠN GÕ LỆNH
 /reverse-preview login-2fa
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Tính năng này đã có bộ dựng lại chưa?        │
 │  Chưa có → TỪ CHỐI thẳng, liệt kê các tính năng đã    │
 │  có, và chỉ bạn chạy /code-to-srs (từ mã nguồn) hoặc  │
 │  /reverse-doc (từ tài liệu cũ) trước. Không tự bịa.   │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Xem trước rồi mới ghi                        │
 │  In ra: sẽ ghi file nào, gồm những mục gì. Bạn gật    │
 │  (Y) thì mới tạo.                      │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Gom tài liệu lại thành 1 trang               │
 │  Đọc bản đặc tả + danh sách nguồn + danh sách chỗ     │
 │  thiếu + các sơ đồ + use case, gộp lại, GIỮ NGUYÊN    │
 │  cột nhãn tin cậy, rồi dựng thành trang HTML.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Báo bạn file nằm ở đâu                       │
 │  Nháy đúp file đó là mở được bằng trình duyệt.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — không có file tài liệu nào bị sửa
```

***

## 5. Trang xem này gồm những mục gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đọc từ trên xuống, bạn sẽ thấy:

1) **Bảng tin cậy đầu trang** — đếm ✅/🔵/🟡 + cảnh báo "bản chưa duyệt" + giải nghĩa ba nhãn. Con số này cho biết **còn bao nhiêu chỗ phải rà**, không phải điểm chất lượng.
2) **Bản đặc tả đầy đủ** — các yêu cầu chức năng, quy tắc nghiệp vụ, danh sách lỗi..., mỗi dòng kèm **nhãn tin cậy** và **nguồn gốc** (lấy từ đâu ra).
3) **Các sơ đồ** — luồng nghiệp vụ, trạng thái, quan hệ dữ liệu. Bấm vào phóng to xem được.
4) **Use case** — mô tả từng tình huống sử dụng.
5) **Chỗ còn thiếu và câu hỏi cần chốt** — để riêng một mục nổi bật. Đây thường là phần bạn nên đọc trước tiên nếu sắp họp với người hiểu nghiệp vụ.
6) **Bảng truy vết về mã nguồn** — *chỉ có khi bộ tài liệu được dựng từ mã nguồn* (`/code-to-srs`). Nó chỉ rõ điểm nghiệp vụ nào tương ứng với chỗ nào trong mã, kèm tên file và số dòng. Nếu bộ tài liệu dựng từ tài liệu cũ (`/reverse-doc`) thì không có phần này — trang vẫn tạo bình thường, chỉ là thiếu mục đó, không phải lỗi.
7) **Danh mục nguồn** — đã đọc những gì để dựng nên bộ tài liệu này.

Bên trái có mục lục nhiều tầng để nhảy nhanh giữa các phần.

***

## 6. Vài điều cần nhớ để khỏi thắc mắc

- **Sửa tài liệu xong phải chạy lại lệnh.** Trang HTML là bản chụp tại thời điểm tạo, không tự cập nhật. Sửa file gốc rồi mà vẫn thấy nội dung cũ thì chỉ cần gõ lại `/reverse-preview {tính-năng}` và bấm tải lại trang.
- **Cần mạng để vẽ sơ đồ.** Trang tải thư viện vẽ từ Internet. Mở khi không có mạng thì trang vẫn hiện, nhưng sơ đồ ra dạng chữ thô — nối mạng rồi tải lại là được.
- **Tính năng chưa có bộ dựng lại thì lệnh sẽ từ chối**, không tự dựng giúp bạn. Đúng thiết kế: trang xem phải có tài liệu thật làm nguồn, chứ không được tự nghĩ ra nội dung.
- **Xem xong không tự chuyển sang bước tiếp.** Muốn biến bộ dựng lại thành đặc tả chính thức thì đó là việc của `/srs`, gõ riêng.
- **Bộ tài liệu dựng lại luôn mang trạng thái nháp**, kể cả khi nhìn rất đầy đủ. Nó chưa qua người duyệt — cột nhãn tồn tại chính là để nhắc điều đó.

***

## 7. Ví dụ thực tế

Anh **Tuấn** tiếp quản một hệ thống cũ, chỉ có mã nguồn chứ không có tài liệu nào. Anh chạy `/code-to-srs` trỏ vào kho mã, nhận được bộ tài liệu dựng lại cho tính năng `login-2fa`.

1) Anh gõ `/reverse-preview login-2fa`. Hệ thống in kế hoạch, anh gõ `Y`, trang được tạo.

2) Mở ra, việc đầu tiên anh thấy là bảng tin cậy: **31 mục ✅, 12 mục 🔵, 19 mục 🟡** — 19 chỗ phỏng đoán nghĩa là còn nhiều thứ phải hỏi lại người cũ.

3) Anh nhảy thẳng xuống mục "chỗ còn thiếu và câu hỏi cần chốt", thấy những câu như *"vì sao khoá tài khoản sau đúng 5 lần sai — mã nguồn có con số này nhưng không nói lý do"*. Anh chép danh sách ra để hỏi trong buổi bàn giao.

4) Với vài dòng ✅ quan trọng, anh bấm theo chỉ dẫn tên file + số dòng để tự kiểm chứng — thấy khớp, yên tâm không cần hỏi lại.

5) Sau buổi bàn giao, có câu trả lời cho phần lớn dấu 🟡, anh mới chạy `/srs login-2fa` để biến bản dựng lại thành đặc tả chính thức.

***

## Xem thêm

- `explain-skills/code-to-srs.md` — cách dựng bộ tài liệu từ **mã nguồn** (nguồn thứ nhất của lệnh này).
- `explain-skills/reverse-doc.md` — cách dựng bộ tài liệu từ **tài liệu cũ** (nguồn thứ hai).
- `explain-skills/preview.md` — lệnh anh em, dành cho tài liệu chính thức bạn tự viết.
- `explain-skills/srs.md` — bước tiếp theo: biến bản dựng lại thành đặc tả chính thức.
- Chi tiết kỹ thuật đầy đủ: file gốc `.claude/skills/reverse-preview/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
