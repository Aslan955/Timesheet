---
type: skill-explainer
skill: dashboard
updated: 2026-07-14
---

# `/dashboard` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/dashboard` là lệnh tạo một __bảng tổng hợp tình trạng kho tài liệu BA__. Bạn có thể hình dung nó giống bảng đồng hồ trên ô tô: không cần mở từng bộ phận để kiểm tra, chỉ cần nhìn một nơi là biết mọi thứ đang ổn hay có chỗ cần xử lý ngay.

Dashboard trả lời bốn câu hỏi theo đúng thứ tự quan trọng:

1. __Cả kho tài liệu có khỏe không?__ — một dòng kết luận (verdict) và bốn “đèn sức khỏe”.
2. __Việc nào gấp nhất?__ — tối đa năm đến sáu việc ưu tiên cao nhất (có thể ít hơn nếu vault đang ổn), kèm lệnh cần gõ để xử lý.
3. __Từng feature (tính năng) đã đi tới đâu?__ — tiến độ qua tám giai đoạn của mỗi tính năng.
4. __Lỗ hổng và rủi ro cụ thể nằm ở đâu?__ — yêu cầu chưa được triển khai thành user story, tài liệu lỗi thời, review quá hạn và các vấn đề tương tự.

Kết quả là một file HTML có thể mở bằng cách nhấp đúp rồi xem trên trình duyệt, giống như mở một trang web được lưu sẵn trên máy.

Muốn xem toàn bộ workspace, gõ:

```
/dashboard
```

File được tạo tại `docs/_shared/dashboard.html`.

Nếu chỉ muốn xem một tính năng, ví dụ `authentication`, gõ:

```
/dashboard authentication
```

File riêng được tạo tại `docs/_shared/dashboard-authentication.html`, không ghi đè bản tổng của toàn workspace.

Bạn nên chạy `/dashboard` trước buổi họp tiến độ, sau một đợt sửa nhiều tài liệu, hoặc bất cứ khi nào muốn biết “việc nào cần làm trước” mà không muốn mở từng file để tự kiểm tra.

---

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm cần nhớ: **`/dashboard` chỉ đọc tài liệu để thống kê, không sửa hay xóa tài liệu nguồn.** Ngoài việc đọc, nó chỉ tạo hoặc làm mới đúng một file HTML dashboard.

```
 BẠN GÕ LỆNH
 /dashboard
 hoặc /dashboard authentication
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Xác định phạm vi                        │
 │  Không ghi tên feature → xem toàn bộ kho tài liệu.    │
 │  Có tên feature → chỉ xem tính năng đó và dùng một    │
 │  file đầu ra riêng, không đè dashboard tổng.          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — “Máy đếm” đọc kho tài liệu              │
 │  Một bộ quy tắc cố định đếm trạng thái, độ phủ, tiến  │
 │  độ, độ tươi, việc gấp và các lỗ hổng liên kết.       │
 │  AI không tự nhìn rồi chấm điểm theo cảm tính.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Tính verdict và 4 đèn sức khỏe          │
 │  Máy đếm trả về màu xanh / vàng / đỏ cho từng đèn.    │
 │  Đèn tệ nhất quyết định kết luận chung của cả vault.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Sắp thông tin theo mức quan trọng        │
 │  Kết luận và việc gấp nằm trên. Bằng chứng chi tiết   │
 │  nằm dưới. Feature yếu được xếp trước feature ổn.     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ ĐIỂM DUYỆT L1 — Trước khi ghi file HTML               │
 │  Hệ thống cho biết file nào sẽ được tạo hoặc làm mới, │
 │  phạm vi và số liệu tổng quát. Bình thường, người     │
 │  dùng đồng ý thì hệ thống mới ghi file dashboard.     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Ghi đúng 1 file HTML                    │
 │  Mọi dữ liệu cần xem được kẹp sẵn trong file. Tài     │
 │  liệu URD, PRD, SRS, story... vẫn nguyên vẹn.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 6 — Mở bằng trình duyệt                     │
 │  Nhấp đúp để xem. Có nút bật chế độ tối. Có thể gửi   │
 │  file qua Zalo, email hoặc chép sang máy khác.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 HOÀN TẤT — biết vault khỏe không và nên làm gì trước
```

---

## 3. Vì sao kết luận phải nằm trên, bằng chứng nằm dưới?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Một dashboard tốt không bắt người đọc tự cộng hàng chục con số rồi đoán xem tình hình đang tốt hay xấu. Nó phải nói thẳng kết luận trước, sau đó mới đưa bằng chứng để người cần đào sâu có thể kiểm tra.

Hãy hình dung bạn đi khám sức khỏe. Điều bạn muốn nghe đầu tiên là “ổn”, “cần chú ý” hay “có rủi ro”, chứ không phải nhận ngay mười trang kết quả xét nghiệm rồi tự suy luận. `/dashboard` làm tương tự:

- Trên cùng là verdict: 🔴 __Vault có rủi ro__, 🟡 __Vault cần chú ý__, hoặc 🟢 __Vault ổn định__.
- Ngay dưới là bốn đèn cho biết vấn đề thuộc nhóm nào.
- Tiếp theo là những việc gấp nhất, ưu tiên P0 trước, kèm lệnh để xử lý.
- Sau đó mới tới tiến độ từng feature và các bảng chi tiết.

Feature có vấn đề cũng được xếp lên trước. Feature ổn nằm dưới, vì người dùng không nên phải cuộn qua nhiều chỗ xanh mới tìm thấy điểm yếu.

Biểu đồ chỉ được dùng khi giúp kết luận dễ hiểu hơn. Nó không thay thế câu kết luận và không được đặt ở đầu trang chỉ để trang trông đẹp.

---

## 4. Vì sao cần đúng 4 “đèn sức khỏe”, và mỗi đèn nói điều gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bốn đèn nhìn kho tài liệu từ bốn góc khác nhau. Một kho có thể làm nhanh nhưng thiếu liên kết, hoặc liên kết đủ nhưng tài liệu đã quá cũ. Chỉ nhìn một con số sẽ dễ bỏ sót.

| Đèn | Nó trả lời câu hỏi gì? | Cách đổi màu |
|---|---|---|
| __1. Truy vết (Coverage)__ | Trung bình bao nhiêu phần trăm yêu cầu chức năng (FR) đã có ít nhất một user story bao phủ? | Xanh từ __85%__; vàng từ __60%__ đến dưới 85%; đỏ dưới __60%__. |
| __2. Tiến độ pipeline__ | Trung bình mỗi feature đã có bao nhiêu trong tám giai đoạn tài liệu cần thiết? | Xanh từ __75%__; vàng từ __40%__ đến dưới 75%; đỏ dưới __40%__. |
| __3. Độ tươi tài liệu__ | Tài liệu còn mới hay đã để lâu không cập nhật? | Xanh từ __70 điểm__; vàng từ __45__ đến dưới 70; đỏ dưới __45__. |
| __4. Rủi ro / việc gấp__ | Có bao nhiêu việc P0, yêu cầu thay đổi (CR) còn treo và review quá hạn? | __0__ là xanh; từ __1 đến 3__ là vàng; hơn __3__ là đỏ. |

Đèn “độ tươi” có thêm một chốt an toàn. Nếu điểm trung bình vẫn cao nhưng có từ __8 tài liệu trở lên dưới 40 điểm__, đèn tự hạ xuống vàng. Nhờ vậy, vài tài liệu rất mới không thể che khuất một nhóm lớn tài liệu đang “mục”.

Tám giai đoạn pipeline là các chặng tài liệu của một feature, từ yêu cầu ban đầu đến kiểm thử: __URD → BRD → PRD → SRS → use case → user story → AC → test__. Dashboard thể hiện mỗi chặng bằng một ô: ô đậm là đã có tài liệu của chặng đó, ô nhạt là chưa có. Lưu ý ô chỉ cho biết "có hay chưa có tài liệu", không bắt buộc phải làm tuần tự — một feature có thể đã có chặng sau mà còn thiếu chặng trước, và nhìn cả hàng là thấy ngay chỗ nào còn trống.

---

## 5. Vì sao chỉ một đèn đỏ cũng làm cả vault đỏ?

Verdict (kết luận chung) được quyết định bởi __đèn tệ nhất__:

- Có ít nhất một đèn đỏ → 🔴 __Vault có rủi ro__.
- Không có đỏ nhưng có ít nhất một đèn vàng → 🟡 __Vault cần chú ý__.
- Không đèn nào đỏ hay vàng → 🟢 __Vault ổn định__.

(Một đèn có thể ở trạng thái xám khi chưa đủ dữ liệu để chấm — ví dụ chưa có feature nào chạy tới mức tính được coverage. Đèn xám không kéo verdict xuống: nó được xếp ngang với xanh, vì "chưa đủ dữ liệu" không phải là "có vấn đề".)

Đây là quy tắc “mắt xích yếu nhất”. Một cây cầu có bốn đoạn, chỉ cần một đoạn hỏng thì không thể kết luận cả cây cầu an toàn chỉ vì ba đoạn còn lại tốt.

Quy tắc này ngăn một kiểu tự trấn an rất dễ xảy ra: thấy ba đèn xanh rồi bỏ qua một đèn đỏ. Dashboard cố ý nghiêm ở điểm này để rủi ro quan trọng không bị chìm trong các con số đẹp.

---

## 6. Vì sao mọi con số phải do một “máy đếm” cố định tính?

Đây là điểm thiết kế quan trọng nhất của `/dashboard`.

Mọi con số, màu đèn và verdict đều được tính bởi một script cố định tên `_scripts/workspace-status.py`. Có thể hiểu script này là __máy đếm theo công thức đã khóa sẵn__. Dashboard nhận kết quả rồi trình bày và tô màu; AI không tự nhìn kho tài liệu rồi đoán “chắc khoảng 70%” hay “có vẻ màu vàng”.

Lý do rất đơn giản: cùng một kho tài liệu mà chạy lần đầu ra xanh, lần sau lại ra vàng chỉ vì AI diễn giải khác đi thì không ai còn tin dashboard.

Cách làm này giống dùng cân điện tử thay vì ước lượng bằng mắt. Cùng một vật, cùng một thời điểm, ai bấm cân cũng nhận cùng một con số. Vì vậy, chạy `/dashboard` hai lần khi tài liệu không đổi sẽ cho cùng số liệu và cùng verdict.

Máy đếm là nguồn duy nhất cho các phần như trạng thái tài liệu, coverage, pipeline, độ tươi, chất lượng và danh sách việc gấp. Dashboard không tự đếm lại lần hai, tránh cảnh hai khu vực trên cùng một trang hiển thị hai số khác nhau.

---

## 7. Vì sao `/dashboard` an toàn để chạy và dễ mang đi chia sẻ?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/dashboard` hoạt động theo nguyên tắc __chỉ đọc__. Nó xem nội dung tài liệu để thống kê nhưng không sửa, không xóa và không đổi trạng thái bất kỳ URD, BRD, PRD, SRS, use case hay user story nào.

Thứ duy nhất nó ghi là một file HTML dashboard. Vì việc ghi file vẫn là một thay đổi trên đĩa, quy trình bình thường vẫn có bước duyệt L1 trước khi tạo hoặc làm mới file đó.

File HTML chứa sẵn dữ liệu cần xem nên có thể gửi qua Zalo, email hoặc chép sang máy khác rồi mở bằng trình duyệt. Nếu mất mạng, các bảng và kanban vẫn hiện bình thường; chỉ một số biểu đồ dùng thư viện trực tuyến có thể không hiện. Nội dung chính không bị vỡ.

Dashboard còn có nút bật hoặc tắt chế độ tối để dễ đọc trong môi trường thiếu sáng.

---

## 8. Vì sao “chưa có FR” không được hiện thành “0% đỏ”?

Hai trường hợp này mang ý nghĩa hoàn toàn khác nhau:

- Feature __chưa có yêu cầu chức năng (FR)__ vì chưa chạy `/srs` → hiện dấu __—__ màu xám. Nó chưa bắt đầu, nên chưa có gì để tính coverage.
- Feature __đã có FR nhưng chưa FR nào được user story bao phủ__ → hiện __0% đỏ__. Đây mới là một lỗ hổng thật.

Ví dụ, một lớp học chưa tổ chức bài kiểm tra thì phải ghi “chưa có điểm”, không thể chấm cả lớp 0 điểm. Phân biệt này giúp dashboard không gắn nhãn “tệ” cho một feature đơn giản là chưa bước vào giai đoạn đó.

Nếu toàn bộ vault còn rỗng, dashboard cũng không bịa đèn hay phần trăm. Nó báo thân thiện: __“Vault rỗng — chưa có gì để đánh giá”__ và gợi ý bắt đầu với `/urd` hoặc `/brainstorm`.

Tương tự, nếu bạn gõ `/dashboard <tên-feature>` với một tính năng chưa tồn tại (gõ nhầm hoặc chưa tạo), dashboard không dựng ra một bảng trống đầy số 0 giả. Nó báo thân thiện rằng chưa có tính năng đó và gợi ý cách bắt đầu, thay vì để bạn tưởng nhầm là feature "tệ toàn tập".

---

## 9. Vì sao vẫn cần Kanban khi đã có verdict và tiến độ?

Verdict cho biết sức khỏe tổng thể; pipeline cho biết từng feature đã đi qua bao nhiêu chặng. Kanban — bảng chia việc theo cột trạng thái — trả lời một câu khác: __từng tài liệu hiện đang ở trạng thái làm việc nào?__

Dashboard chia tài liệu vào năm cột:

1. __Nháp__
2. __Đang review__
3. __Sửa lại__
4. __Đã duyệt__
5. __Đã ship__

Nhờ đó, BA có thể nhìn nhanh xem tài liệu đang dồn ở khâu review hay đã được duyệt nhưng chưa ship. Tài liệu lỗi thời vẫn có dấu cảnh báo riêng để không bị lẫn với tài liệu nháp bình thường.

Phần cuối dashboard còn cho phép đào sâu vào yêu cầu FR chưa được story phủ, user story không trỏ về FR nào, use case chưa có kiểm thử, câu hỏi mở, review quá hạn, CR còn treo và chuỗi tài liệu lỗi thời.

`/dashboard` hiện là nơi duy nhất để quan sát tình trạng vault. Nó đã thay thế hoàn toàn lệnh `/health` dạng chữ trên màn hình, vốn được bỏ ngày __2026-07-13__.

---

## 10. Vì sao mỗi tài liệu lại có một “trạng thái”?

Năm cột Kanban ở trên không phải do dashboard tự nghĩ ra để cho đẹp — chúng phản chiếu một thứ có thật gắn trên từng tài liệu: __trạng thái (status)__. Mỗi file tài liệu (URD, BRD, PRD, SRS, user story…) đều mang một nhãn nhỏ ghi rõ nó đang ở giai đoạn nào trong vòng đời của mình:

```
Nháp → Đang review → Sửa lại → Đã duyệt → Đã ship
        (in-review)   (revisions) (approved)  (shipped)
         ▲                │
         └────────────────┘  (review đi lại nhiều vòng là bình thường)
```

| Trạng thái | Nghĩa là gì |
|---|---|
| __Nháp__ (draft) | Đang viết, chưa xong, chưa đưa ai xem. |
| __Đang review__ (in-review) | Đã gửi cho người khác (hoặc trợ lý review) soi. |
| __Sửa lại__ (revisions) | Người review đã chỉ ra chỗ chưa ổn, cần chỉnh. |
| __Đã duyệt__ (approved) | Được chấp nhận, “đóng băng” để dev bắt đầu làm theo. |
| __Đã ship__ (shipped) | Tính năng đã lên production thật. |

__Vậy đặt trạng thái để làm gì?__ Có ba mục tiêu rất thực tế:

1. __Biết tài liệu nào ĐÃ đáng tin để làm theo, tài liệu nào CHƯA.__ Đây là mục tiêu lớn nhất. Một bản SRS còn “nháp” và một bản SRS “đã duyệt” trông giống hệt nhau khi mở ra đọc, nhưng ý nghĩa khác một trời một vực: dev mà lỡ code theo bản nháp (còn có thể thay đổi bất cứ lúc nào) thì rất dễ làm sai rồi phải làm lại. Nhãn trạng thái là lời cảnh báo dán sẵn: “bản này chốt rồi, cứ theo” hay “bản này còn nháp, khoan đã”. Giống như trên công trường phân biệt bản vẽ “đã phê duyệt thi công” với bản vẽ “còn đang góp ý” — cùng là bản vẽ, nhưng chỉ một cái được phép mang ra xây.

2. __Biết công việc đang tắc ở khâu nào.__ Khi tất cả tài liệu đều dồn ở cột “Đang review” cả tuần không nhúc nhích, đó là dấu hiệu khâu duyệt đang là nút thắt cổ chai — cần ai đó vào review gấp. Nếu không có trạng thái, bạn phải mở từng file hỏi “cái này xong chưa, ai đang giữ” mới biết. Có trạng thái thì liếc bảng Kanban là thấy ngay dòng chảy công việc đang kẹt chỗ nào.

3. __Cho phép hệ thống tự động hóa vài việc đúng thời điểm.__ Vì trạng thái là nhãn máy đọc được, hệ thống có thể phản ứng theo từng bước chuyển: ví dụ khi một tài liệu chuyển sang “Đã duyệt”, nó được coi là mốc chốt và dashboard tính vào phần đã hoàn tất; khi tài liệu nằm ở “Đang review” quá bảy ngày mà không ai động tới, dashboard tự đẩy nó vào mục “review quá hạn” để nhắc. Không có trạng thái thì không có cách nào để hệ thống biết “lúc nào nên nhắc”.

Chính vì trạng thái mang những mục tiêu đó, dashboard mới dùng nó làm xương sống cho bảng Kanban và cho một trong bốn đèn sức khỏe (đèn “Rủi ro / việc gấp” có tính cả số review quá hạn). Trạng thái không phải thủ tục hành chính rườm rà — nó là cách cả đội thống nhất “tài liệu này đã tới đâu, có được phép tin chưa”.

> Lưu ý phân biệt: trạng thái ở đây là __vòng đời duyệt tài liệu__ (nháp → duyệt → ship). Nó KHÁC với “trạng thái công việc trên Jira” (Đang làm / Xong) — cái đó nói về tiến độ code, không phải mức độ chín của tài liệu. Một tài liệu “đã duyệt” vẫn có thể có story trên Jira mới “đang làm”.

---

## Ví dụ thực tế

Chị __Lan__ là BA phụ trách ba tính năng của ứng dụng học tiếng Anh. Sáng thứ Hai, trước buổi họp với Product Owner, chị muốn biết đội nên tập trung vào đâu. Chị gõ:

```
/dashboard
```

1. Hệ thống xác định chị muốn xem toàn bộ workspace, cho “máy đếm” đọc tài liệu tính chỉ số theo công thức cố định (không sửa file nghiệp vụ nào), rồi hiển thị bước duyệt L1: file đầu ra + phạm vi toàn dự án + vài con số tổng quát. Chị đồng ý, hệ thống ghi ra `docs/_shared/dashboard.html`.

2. Chị Lan nhấp đúp mở file. Dòng đầu hiện: 🔴 __Vault có rủi ro__. Ba đèn đang xanh hoặc vàng, nhưng đèn “Rủi ro / việc gấp” đỏ vì cộng lại có tới năm mục dồn ứ (ba việc P0, một CR còn treo, một review quá hạn — vượt ngưỡng 3), nên quy tắc mắt xích yếu nhất kéo verdict chung xuống đỏ.

3. Ngay dưới, phần “Việc gấp nhất” đưa ba việc P0 lên đầu, rồi tới CR chưa xử lý và review quá hạn. Mỗi việc có sẵn lệnh cần gõ, nên chị không phải tự tìm đường dẫn hoặc đoán bước tiếp theo.

4. Chị kéo xuống phần tiến độ. Feature `authentication` mới đạt ba trong tám giai đoạn nên được xếp trên feature đã gần hoàn tất — chị thấy ngay điểm nghẽn mà không phải mở từng thư mục.

5. Ở phần truy vết, một feature hiện __0% đỏ__ vì đã có FR nhưng chưa có user story nào phủ; feature khác hiện dấu __—__ xám vì chưa chạy SRS. Chị hiểu đây là hai tình huống khác nhau, không gom cả hai thành “làm kém”. Xuống Kanban, chị thấy nhiều tài liệu dồn ở cột “Đang review”, phần chi tiết chỉ rõ cái nào đã quá hạn hơn bảy ngày.

6. Trong cuộc họp, chị gửi luôn file HTML qua nhóm chat. Mọi người mở được trên trình duyệt và cùng nhìn một bộ số liệu, không cần cài thêm công cụ. Sau đó, muốn soi riêng `authentication`, chị gõ:

```
/dashboard authentication
```

Hệ thống tạo `docs/_shared/dashboard-authentication.html`, còn bản tổng vẫn nguyên — chị có cả góc nhìn toàn dự án lẫn góc nhìn riêng cho tính năng đang xử lý.

Nhờ vậy, cuộc họp bắt đầu bằng kết luận và việc cần làm, không mất thời gian tranh luận xem mỗi người đã đếm tài liệu theo cách nào.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (nguồn số liệu, ngưỡng màu, thứ tự các khu vực, trường hợp vault rỗng và cách tạo file HTML), đọc file gốc: `.claude/skills/dashboard/SKILL.md`. Cây stale trong dashboard được vẽ từ bảng `docs/_shared/staleness.md` — hai file log của vault khác vai nhau thế nào, đọc `explain-skills/changelog-staleness.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
