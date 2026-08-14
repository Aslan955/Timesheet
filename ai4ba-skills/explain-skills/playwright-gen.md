---
type: skill-explainer
skill: playwright-gen
updated: 2026-07-17
---

# `/playwright-gen` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/playwright-gen` biến các **kịch bản test** (do `/test-cases` viết) thành **script chạy máy** — những đoạn lệnh mà máy tính tự mở trình duyệt, tự bấm nút, tự gõ dữ liệu và tự kiểm kết quả, không cần người ngồi làm từng bước.

Hãy hình dung bạn có một tập kịch bản nghiệm thu viết tay: “mở màn đăng nhập, gõ email này, bấm nút kia, xem có hiện đúng câu báo lỗi không”. Bình thường một người phải cầm tập đó làm lại từng dòng mỗi lần cần kiểm. `/playwright-gen` giống như **thuê một robot làm theo kịch bản đó** — viết ra “bản chỉ dẫn cho robot” một lần, rồi robot chạy lại bao nhiêu lần cũng được.

Playwright là tên công cụ điều khiển trình duyệt tự động (giống một tài xế tự lái cho trình duyệt). Bạn không cần biết nó hoạt động ra sao — chỉ cần biết lệnh này tạo ra script để nó chạy.

Gõ đơn giản:

```text
/playwright-gen dang-nhap
```

Lệnh **bắt buộc phải có test case trước** — nếu chưa chạy `/test-cases`, nó sẽ nhắc bạn làm bước đó.

## 2. Điểm cốt lõi: viết script MỘT LẦN, chạy nhiều lần — KHÔNG cần AI mỗi lần‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là chỗ dễ hiểu nhầm nhất, nên nói thật rõ:

* `/playwright-gen` **không** phải “AI chạy test giúp bạn mỗi lần”.
* Khi gõ lệnh, AI chỉ **kích hoạt một cỗ máy dựng script** (có sẵn) — chính cỗ máy đó sinh ra file script, không phải AI viết tay từng dòng.
* File script (một lần) rồi **tự chạy** trên máy hoặc hệ thống kiểm thử tự động — không tốn AI, không tốn tiền gọi AI. Cùng một cách kiểm được **lặp lại ổn định** mỗi lần (kết quả có thể khác nếu ứng dụng hoặc dữ liệu thay đổi — đó là điều bình thường, không phải lỗi script).

Giống như: bạn bấm nút để một cái máy in ra công thức nấu ăn một lần, sau đó bất cứ đầu bếp nào (hay cái nồi tự động nào) cũng nấu lại được mà không cần bấm nút xin công thức mỗi bữa.

Đây cũng là cách người anh em `/api-test` hoạt động (sinh file test cho API rồi chạy lại), chỉ khác là `/playwright-gen` lo tầng **giao diện/trình duyệt** thay vì tầng API.

## 3. Bạn tả nút bằng nhãn thường, máy tự tìm — bạn không viết “ngôn ngữ máy”‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Một lo ngại chính đáng: “tôi là người làm nghiệp vụ, đâu biết viết mã kỹ thuật để chỉ cho máy biết nút nào là nút nào?”

Yên tâm — bạn không phải làm việc đó. Trong kịch bản, bạn (qua `/test-cases`) chỉ gọi tên nút/ô **bằng nhãn hiển thị thật**: “nút Đăng nhập”, “ô Email”. Cỗ máy sinh script sẽ tự dịch những nhãn đó sang cách máy tìm phần tử trên trang. Ranh giới rất rõ: **bạn tả bằng ngôn ngữ người dùng nhìn thấy, máy lo phần kỹ thuật.**

## 4. Dữ liệu thử được TÁCH khỏi script — sửa lúc chạy mà không đụng script‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là điểm rất quan trọng khi đưa vào chạy thật. Nhớ rằng **test case thường được viết TRƯỚC khi có phần mềm chạy được** — lúc đó dữ liệu thử (email, giá trị nhập) chỉ là **giá trị giả-định làm mẫu**. Đến khi bạn chạy script thật (phần mềm đã thành hình), dữ liệu giả đó có thể **không đúng / không dùng được** với hệ thống thật (ví dụ cần một tài khoản có thật trên môi trường thử).

Để không phải sửa từng dòng script mỗi lần đổi dữ liệu, lệnh **tách dữ liệu thử ra một file riêng** (`testdata.json`). Script chỉ *tham chiếu* tới dữ liệu đó theo một cái tên. Vậy nên:

* **Lúc chạy thật**, bạn chỉ cần mở `testdata.json` và điền dữ liệu đúng của môi trường (email/tài khoản thật) — **không đụng đến file script**.
* Dữ liệu giả-định trong test case trở thành **giá trị mặc định** (nếu bạn chưa điền gì thì script vẫn chạy với nó).
* Khi tạo lại script, lệnh **giữ nguyên dữ liệu bạn đã điền** trong file đó (không ghi đè về giá trị mẫu). Và nếu bạn lỡ gõ sai định dạng file (thiếu dấu phẩy, sai ngoặc), lệnh **dừng lại và báo**, kèm một bản sao lưu — **không** âm thầm xóa hết dữ liệu thật bạn đã điền để thay bằng giá trị mẫu.
* **Mật khẩu và thông tin nhạy cảm** thì *không* để trong file này (vì file được lưu chung với mã nguồn) — chúng đi qua một file bí mật riêng, không bị commit.

Và một tiện lợi: nếu lúc chạy bạn phát hiện dữ liệu thật khác hẳn dữ liệu giả trong test case, lệnh sẽ **hỏi bạn có muốn cập nhật ngược dữ liệu thật đó vào test case không** — để lần sau test case có sẵn dữ liệu đúng. Bạn đồng ý thì nó cập nhật; không thì giữ nguyên. (Không bao giờ tự ghi mật khẩu thật vào test case.)

## 5. Nếu kịch bản chưa đủ rõ, lệnh KHÔNG bịa — có hai cách xử lý

Đây là điểm an toàn quan trọng nhất, và cũng là điều khiến lệnh này đáng tin. Tùy “chưa rõ” ở mức nào, lệnh xử lý một trong **hai cách** — nhưng cả hai đều KHÔNG đoán bừa:

**Cách 1 — BỎ QUA hẳn (không tạo script cho kịch bản đó):** khi kịch bản thiếu thứ cốt lõi để chạy tự động.

* Kịch bản đánh dấu **làm tay** (xem dữ liệu trong cơ sở dữ liệu, thử hai thao tác cùng lúc, đo thời gian).
* Kịch bản còn ghi **“cần bổ sung”** ở dữ liệu thử, kết quả mong đợi, **hoặc điều kiện cần trước** (chưa biết nhập gì / chưa biết kết quả đúng / chưa biết cách dựng trạng thái).
* Kịch bản **cần dựng một trạng thái trước** (ví dụ “tài khoản đã khóa”): lệnh **tạm bỏ qua khỏi phần tự-chạy** thay vì chạy rồi rớt oan — vì trạng thái đó phải được dựng trước, không tự có (xem thêm ô cảnh báo ở Mục 6).

Những cái này lệnh **bỏ qua và liệt kê rõ** “chưa tạo script, vì lý do X” — để bạn biết phần nào automation phủ, phần nào chưa.

**Cách 2 — VẪN tạo script nhưng chèn ghi chú “cần dev xác nhận”:** khi kịch bản đủ để chạy, chỉ **thiếu cách nhận diện một phần tử** (ví dụ “logo” — không có nhãn chữ để máy tìm). Lệnh dựng script bản nháp, chỗ phần tử mờ đó thay bằng một dòng ghi chú `TODO` để dev gắn “dấu nhận diện” kỹ thuật. Nó **không tự bịa** một cách tìm logo có thể sai.

Vì sao phân biệt hai cách quan trọng? Vì một script tự-tin-giả — chạy xong báo “đậu” trong khi chẳng kiểm gì — **nguy hiểm hơn không có script** (tạo cảm giác an toàn giả). Nên: thiếu cốt lõi thì bỏ qua; thiếu chút nhận diện thì để bản nháp có TODO. Không bao giờ đoán bừa.

## 6. Chạy thử ra sao, và khi chưa có môi trường thì sao?

Sau khi sinh script, bạn có thể cho chạy. Điểm khác biệt lớn: lệnh **không chỉ báo đậu/rớt** — nó cố **đoán vì sao rớt**, vì một cái rớt có thể do lỗi ứng dụng thật, mà cũng có thể chỉ do **dữ liệu thử sai/thiếu/cũ**. Các loại kết quả:

* **✅ Đậu:** máy làm theo kịch bản, kết quả đúng như mong đợi.
* **🔴 Nghi app lỗi:** rớt ngay ở bước **kiểm kết quả nghiệp vụ** (đã nhập data xong, đến lúc so kết quả thì sai). Đây mới là loại đáng báo cho đội phát triển.
* **🟡 Nghi do dữ liệu:** rớt ở bước **nhập liệu / mở trang / đăng nhập** — thường không phải ứng dụng lỗi, mà do dữ liệu thử chưa đúng (xem Mục 7). Nên đi kiểm dữ liệu trước khi kết luận app lỗi.
* **🟠 Nghi dữ liệu đã cũ:** case này **từng đậu** với đúng bộ dữ liệu đó, nay lại rớt ở bước dữ liệu → khả năng dữ liệu đã lỗi thời (ví dụ tài khoản thử bị người khác đổi mật khẩu / xóa).
* **⏳ Chưa chạy được (chờ):** khi chưa có môi trường để mở ứng dụng (backend chưa dựng), hoặc case cần dựng trạng thái trước. Lệnh **không báo “rớt” giả** — ghi rõ “chưa kết nối được / cần dựng trạng thái”.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cách phân biệt “rớt do data” với “rớt do app” dựa vào **vị trí rớt trong kịch bản**: rớt ở khúc *nhập liệu/đăng nhập* thì nghi data, rớt ở khúc *so kết quả* thì nghi app. Đây là **phỏng đoán để bạn biết nên đi hướng nào trước**, không phải phán quyết chắc chắn — bạn xem lại rồi quyết.

> ⚠️ **Về “điều kiện cần trước” (Preconditions):** nhiều trạng thái **dựng được bằng thao tác có nguồn** — ví dụ “tài khoản đã khóa sau 5 lần sai” chỉ cần *tạo một tài khoản mới rồi login sai 5 lần*. Với loại này, `/test-cases` đã **mô tả sẵn cách dựng, kèm nguồn** trong ô Preconditions (không bịa, vì mọi bước và con số đều có trong tài liệu). Khi chạy script, phần dựng trạng thái đó phải được thực hiện trước (người chạy làm tay theo mô tả, hoặc bước sau này bổ sung tự động). Nếu chưa dựng mà chạy thì script rớt — **cái rớt đó chưa chắc là lỗi ứng dụng**, mà do chưa vào đúng trạng thái; vì vậy bước tự động hóa **tạm bỏ qua nhóm này** thay vì báo rớt. Chỉ khi *bất kỳ mắt xích nào của cách dựng* (con số, cách tạo tài khoản, thứ tự, cách reset) chưa có trong tài liệu thì mới không dựng được và phải chờ bổ sung.

Khi có môi trường thật, bạn chỉ cần khai báo địa chỉ ứng dụng vào một file cấu hình (không chứa mật khẩu thật trong nơi công khai) rồi chạy lại.

> 🔒 **An toàn: KHÔNG chạy trên môi trường thật (production) một cách tự động.** Chính công cụ chạy tự **chặn** việc này — nó chỉ chạy thẳng khi địa chỉ ứng dụng nằm trong danh sách “đã xác nhận là môi trường thử” (hoặc là máy nội bộ). Với địa chỉ **lạ / chưa rõ**, nó **dừng và hỏi**, không tự đoán qua tên miền (vì một địa chỉ production có thể không mang chữ “prod”). Muốn chạy trên production thì cần **hai lớp cấp phép**: bật cờ cho phép *và* gõ đúng địa chỉ để xác nhận — thiếu một trong hai là dừng. Lý do: test tự động có thể *tạo dữ liệu hoặc đổi trạng thái thật* (đăng ký tài khoản, login sai nhiều lần khóa tài khoản), chạy nhầm production là rủi ro thật.

## 7. Làm sao biết dữ liệu thử bị thiếu / bị cũ, và vòng “cấp dữ liệu rồi chạy lại”

Đây là phần trả lời trực tiếp cho lo ngại: *kịch bản viết lúc chưa có sản phẩm nên dữ liệu chỉ là mẫu; đến khi chạy thật thì sao biết dữ liệu nào chưa đúng?*

Sau mỗi lần chạy, lệnh **không hỏi bạn từng câu giữa chừng** (không làm gián đoạn luồng test). Nó chạy một mạch cho hết, rồi **ghi ra một bản báo cáo** (`run-report.md`) để bạn đọc lại lúc rảnh. Trong đó có hai thứ quan trọng:

1) **Bảng kết quả từng case**, đã gắn nhãn ✅ / 🔴 nghi-app / 🟡 nghi-data / 🟠 nghi-cũ / ⏳ chờ (như Mục 6) — nhìn là biết cái nào nên đi kiểm dữ liệu, cái nào nên báo đội phát triển.
2) **Bảng “dữ liệu cần bổ sung”**, liệt kê rõ:
   * ô dữ liệu nào **còn để giá trị mẫu** (chưa ai thay bằng dữ liệu thật của môi trường) — vì lệnh có lưu lại bản “giá trị mẫu gốc” để đối chiếu;
   * ô dữ liệu nào **bị thiếu** hẳn (chưa có trong file dữ liệu).

Nhờ vậy, thay vì đoán mò “sao test rớt”, bạn có ngay danh sách cụ thể cần cấp gì.

**Vòng làm việc rất gọn:**

1) Chạy → đọc `run-report.md`.
2) Bạn **tự điền dữ liệu thật** vào file dữ liệu cho những ô còn mẫu/thiếu (mật khẩu thì để ở nơi bí mật, không viết vào đây — xem Mục 4).
3) Gõ lệnh chạy lại với tùy chọn **“chỉ chạy lại những case chưa đậu”** — lệnh tự nhớ case nào vòng trước chưa đậu và chỉ chạy đúng nhóm đó, **bạn không phải liệt kê tay**. Những case đã đậu thì bỏ qua cho nhanh.
4) Đọc báo cáo vòng 2. Lặp tới khi sạch, hoặc chỉ còn 🔴 nghi-app thật thì mang sang cho đội phát triển.

Nói ngắn: **máy chạy hết → báo cáo gom hết → bạn xem và cấp dữ liệu → máy chạy lại phần còn thiếu.** Không có câu hỏi nào chen ngang giữa lúc test đang chạy.

## 8. Script tự sinh — đừng sửa tay, hãy sửa kịch bản rồi tạo lại

Vì script là **sản phẩm dẫn xuất** từ kịch bản, nguyên tắc là:

* **Không sửa file script bằng tay.** Đầu mỗi file có ghi rõ “file tự tạo, đừng sửa”.
* Muốn đổi test → sửa **kịch bản** ở `/test-cases`, rồi cho `/playwright-gen` tạo lại. Sửa tay sẽ bị ghi đè lần tạo lại sau.

Cách này giữ cho “kịch bản nghiệp vụ” luôn là bản gốc duy nhất; script chỉ là bản dịch máy của nó.

## 9. BA/QC làm phần nào, dev làm phần nào?

* **BA/QC (bạn):** sở hữu kịch bản nghiệp vụ (đến từ `/test-cases`), đọc kết quả đậu/rớt, quyết định điều đó nói gì về tính năng.
* **Lệnh (AI/máy):** dịch kịch bản sang script, chạy, ghi kết quả về.
* **Đội kỹ thuật:** lo phần hạ tầng chạy (cài công cụ, dựng môi trường, hỗ trợ khi một nút không đủ nhãn để máy tìm — cần gắn “dấu nhận diện” kỹ thuật). Phần này là dev-enablement, ngoài vai BA thuần.

## 10. Vị trí trong họ lệnh test

`/playwright-gen` là **chặng cuối** của nhánh test giao diện:

* Trước nó: `/test-checklist` (danh sách) → `/test-cases` (kịch bản, bắt buộc phải có).
* Nó biến kịch bản “tự-động-được” thành script → chạy → kết quả.
* Song song, nhánh API dùng `/api-test` để test tầng hệ-thống-nói-chuyện-với-nhau.

Xem `test-family.md` để hiểu cả bộ nối với nhau.

## Câu chốt

> **`/playwright-gen` biến kịch bản nghiệp vụ thành “robot làm theo” — viết script một lần rồi chạy lại nhiều lần không cần AI. Điều quý nhất: kịch bản thiếu thứ cốt lõi thì nó thẳng thắn bỏ qua và báo lý do; chỉ thiếu chút nhận diện thì để bản nháp có ghi chú cho dev — chứ không tạo test dối trông có vẻ đậu. Khi chạy thật, nó còn tách “rớt do dữ liệu thử” khỏi “rớt do ứng dụng lỗi”, liệt kê dữ liệu còn thiếu/cũ, để bạn cấp dữ liệu rồi chạy lại đúng phần chưa đậu.**

## Xem thêm

* [`test-family.md` — cả bộ lệnh test nối với nhau thế nào](test-family.md)
* [`/test-cases` — kịch bản chi tiết, nguồn cho lệnh này (bước trước)](test-cases.md)
* [`/api-test` — cách làm tương tự nhưng cho tầng API](api-test.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
