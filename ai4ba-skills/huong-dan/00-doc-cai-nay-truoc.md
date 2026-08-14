# 00 — Đọc cái này trước‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Nếu các bạn vừa tải bộ này về và định copy nguyên thư mục `.claude/` vào dự án rồi chạy — dừng lại đã.
>
> Chương này không hướng dẫn thao tác. Nó nói về kỳ vọng: bộ này là gì, đến từ đâu, và vì sao bê nguyên về là cách dùng sai.

---

## Bộ này là gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

BA-Kit là bộ skill AI cho công việc của IT BA / Product Owner / Product Manager, chạy trên __Claude Code__.

Mỗi skill xử lý một task quen thuộc — viết SRS, vẽ sơ đồ luồng, bóc user story, kiểm gap tài liệu. Nhưng nó không chỉ có câu lệnh để AI trả lời. Mỗi skill mang theo:

* __bối cảnh__ — tài liệu nào phải đọc trước khi làm
* __rule__ — điều gì AI không được tự quyết
* __format đầu ra__ — output trông như thế nào
* __điểm hỏi lại__ — chỗ nào thiếu thông tin thì phải dừng hỏi, không được đoán
* __cổng duyệt__ — bước xin phép trước khi ghi file, và bước kiểm trước khi output đi tiếp

Hiểu đơn giản: prompt là một lần nhờ AI làm việc. Skill là cách biến một việc lặp lại thành quy trình có thể dùng lại.

Ví dụ khi cần viết acceptance criteria, một prompt ngắn có thể bảo AI viết Given/When/Then. Nhưng skill viết AC cần biết thêm: story nào đang xử lý, SRS và business rule nào phải đọc, screen nào liên quan, happy path và error case tách ra sao, điều gì chưa có trong tài liệu thì ghi open question, và tiêu chí nào để các bạn review AC đã testable chưa.

Khác biệt nằm ở đó. AI không chỉ được bảo "viết AC giúp mình". AI được đặt vào đúng bối cảnh của task.

---

## Nó tiết kiệm cho các bạn cái gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Không phải việc nghĩ. Là việc lặp lại.

Viết SRS cho một feature vừa phải: dựng khung 12 mục, tra lại business rule đã chốt ở đâu, đánh số FR cho khớp, kiểm error case đã phủ chưa, viết bảng truy vết, rồi rà xem screen nào phục vụ luồng nào.

Phần *nghĩ* chiếm ít thời gian nhất trong đó. Phần còn lại là gõ, tra, đánh số, đối chiếu.

Skill làm phần còn lại — theo đúng format các bạn đã chốt, và __dừng hỏi khi thiếu thông tin thay vì tự điền__. Cái sau mới là điểm đáng tiền: một AI chịu nói "chỗ này tài liệu chưa có, anh xác nhận giúp" hữu ích hơn nhiều một AI viết trơn tru rồi bịa mất một business rule.

---

## Bộ này đến từ đâu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bộ này mình xây trong quá trình dạy khoá __AI4BA__, đến giờ hơn 300 học viên đã tham gia. Nội dung đến từ những gì mình làm thật ở vai trò IT BA, Product Owner và Product Manager ([hoangphan.blog](https://hoangphan.blog)).

Trong quá trình dạy, nhiều học viên lấy bộ này làm điểm khởi đầu rồi tự dựng workflow riêng. Một số BA Manager và Product Manager mang về áp dụng cho team của họ và chạy hiệu quả.

Điều đáng nói không phải con số học viên. Mà là: __những người dùng hiệu quả nhất đều đã sửa nó.__

Đó không phải vì bộ gốc chạy không được — nó chạy được, mình dùng hằng ngày. Nhưng mỗi team có template riêng, quy trình riêng, cách gọi tên riêng. Bộ này rút ngắn cho các bạn quãng đường dựng từ đầu. Nó không rút ngắn quãng đường điều chỉnh cho vừa team mình.

---

## Vì sao đây là bộ tham khảo, không phải chuẩn‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bộ skill này là cách làm việc của __một người__, cho __một số loại dự án__. Nó phản ánh:

* loại tài liệu mà mình thường phải giao
* template và format mà team mình từng thống nhất
* thứ tự các bước hợp với cách mình nghĩ
* những lỗi mình từng gặp nên mới viết rule chặn lại

Cách các bạn làm việc gần như chắc chắn khác. Công ty có template riêng. Sếp muốn SRS 8 mục chứ không phải 12. Team không dùng use case. Khách hàng đọc tiếng Anh. Quy trình có bước review pháp lý mà bộ này không có.

Vậy nên các bạn có toàn quyền:

* __bỏ__ skill không cần
* __sửa__ skill đang lệch cách làm của team
* __thêm__ skill cho bước còn thiếu
* __gộp__ các skill quá giống nhau

> __Nguyên tắc vàng:__ bộ skill phục vụ cách các bạn làm việc, chứ không bắt các bạn làm việc theo cách của nó. Khi thấy mình đang *uốn công việc cho vừa skill* — đó là dấu hiệu cần sửa skill, không phải sửa công việc.

Đọc bộ này giống cách một BA đọc quy trình của hệ thống khác: hiểu input, output, dependency và rule trước; sau đó mới chọn phần phù hợp để thiết kế lại cho workflow của mình.

---

## Bộ này không làm được gì

Nói thẳng phần này vì nó quyết định kỳ vọng đúng.

BA-Kit không tự chạy end-to-end thay các bạn. Nó không đi phỏng vấn stakeholder. Nó không chịu trách nhiệm khi một rule chưa rõ. Nó cũng không hiểu domain nội bộ chỉ vì các bạn chạy một câu lệnh.

Có những lúc AI còn yếu hơn nhiều so với cảm giác khi xem demo:

* input mơ hồ thì output rất dễ mơ hồ theo
* rule chưa ghi thì AI có thể điền bằng một giả định nghe hợp lý
* sơ đồ đúng cú pháp vẫn có thể thiếu nhánh nghiệp vụ
* kiểm gap chỉ gợi ý chỗ đáng nghi, không xác nhận được sự thật
* đẩy story sang Jira không đồng nghĩa story đã sẵn sàng để dev làm

Vì vậy bộ này phù hợp nhất khi các bạn __đã có tư duy phân tích__ và muốn giảm việc lặp lại. Nó giúp giữ cách làm nhất quán hơn. Nó không thay quyền phán đoán của các bạn.

---

## Bộ này có 57 skill — và đừng cài hết

Có 57 skill vì mình xây nó cho nhiều loại dự án khác nhau, qua nhiều năm. Nghĩa là khả năng cao việc các bạn đang làm đã có sẵn skill — kể cả những việc ít gặp như dựng lại tài liệu từ source code, hay vẽ BPMN chuẩn OMG để import vào Camunda.

Nhưng nó cũng nghĩa là các bạn không dùng hết. Trong thực tế, một người thường chỉ dùng đều đặn khoảng 5 đến 12 skill.

Và skill không dùng thì __vẫn tốn tiền__.

Mỗi phiên chat mới mở ra, mô tả của những skill mà AI được phép tự gọi đều được nạp vào để nó biết có gì mà dùng.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cài 30 skill loại đó mà chỉ dùng 8 nghĩa là các bạn trả tiền cho 22 mô tả thừa. Ở mọi phiên. Suốt dự án.

Chương [04 — Skill preload và token](04-skill-preload-va-token.md) có con số cụ thể, cách đo, và cách giảm.

---

## Cách dùng đúng: copy từng skill, tự nối pipeline

Cách dùng sai phổ biến nhất là copy nguyên thư mục `.claude/` vào dự án rồi chạy.

Cách đúng gồm ba bước:

__1. Chọn skill theo việc các bạn thật sự làm.__ Không phải theo việc bộ này có. Nếu không bao giờ vẽ BPMN thì đừng mang skill BPMN về, kể cả khi nó xịn.

__2. Copy từng skill kèm những gì nó cần.__ Một skill thường phụ thuộc vài rule, đôi khi một agent, một template, một script. Copy thiếu thì skill gãy giữa chừng. Chương [06](06-copy-skill-ve-du-an.md) có prompt làm hết việc đó — không phải gõ lệnh nào.

__3. Nối chúng lại thành pipeline của riêng mình.__ Đây là phần không ai làm hộ được.

Không có một chuỗi đúng cho mọi người. Một luồng thật, của một người thật:

```
/brainstorm → /srs → /user-flow → /wireframe-html → /userstory → /jira
```

Sáu skill. Không dùng `/urd`, `/brd`, `/prd-epic` — vì công ty họ không yêu cầu mấy tài liệu đó.

Người khác lại bắt đầu bằng `/prd` để định hình sản phẩm trước. Người thứ ba dựng bản bấm được cho khách xem rồi mới quay lại viết đặc tả. Cùng một bộ skill, ba luồng khác nhau — cả ba đều đúng với hoàn cảnh của họ.

Chương [03](03-chon-pipeline-cua-ban.md) phân tích ba luồng mẫu đó và hướng dẫn cách tự ghép luồng của mình.

---

## Vì sao skill trong bộ này viết bằng tiếng Việt

Thông thường người ta viết skill bằng __tiếng Anh__. Lý do rất thực dụng: tiếng Anh tốn ít token hơn cho cùng một lượng thông tin, và model được huấn luyện chủ yếu trên tiếng Anh nên bám chỉ dẫn tiếng Anh thường ổn định hơn một chút.

Bộ này để __tiếng Việt__ (có chêm nhiều thuật ngữ tiếng Anh) vì một lý do khác quan trọng hơn: __bộ này để dạy, và để các bạn đọc hiểu.__

Không đọc được skill thì không sửa được nó. Mà không sửa được thì lại quay về đúng cái bẫy ở trên — bê nguyên một cách làm không phải của mình. Với người học và với thị trường Việt Nam, đọc hiểu quan trọng hơn tiết kiệm vài phần trăm token.

__Khi mang vào dự án thật, nên chuyển sang tiếng Anh__ — đặc biệt nếu team có người nước ngoài, hoặc các bạn muốn tối ưu chi phí.

Cách làm: sau khi đã chọn xong skill giữ lại và sửa chúng cho khớp việc của mình, mới nhờ AI dịch. Chương [07](07-tuy-bien-skill.md) có prompt sẵn. Điểm mấu chốt là __dịch sau khi sửa xong__, không phải trước — để khỏi phải dịch lại nhiều lần.

---

## Bộ này chạy ở đâu

BA-Kit thiết kế cho __AI Coding Agent__ — Claude Code là ưu tiên số một, vì bộ này viết theo đúng cơ chế skill/agent/hook/rule của nó.

Mang được sang Codex CLI hoặc Google Antigravity không? Được, nhưng cần chuyển đổi chứ không phải copy thẳng — chương [08](08-mang-sang-codex-antigravity.md) có prompt sẵn để nhờ AI làm việc đó.

Mang sang __AI Chat__ (claude.ai, ChatGPT) thì sao? Các bạn có thể copy vài skill vào dán làm prompt và nó vẫn ra được cái gì đó. Nhưng phần lớn giá trị sẽ mất — vì bộ này dựa vào việc AI __đọc được file trong dự án__, __ghi ra file__, và __có hook chạy tự động__. Chat không làm được mấy thứ đó. Chương [09](09-vi-sao-khong-hop-ai-chat.md) giải thích cụ thể.

---

## Các bạn được làm gì với bộ này

Vì chương này khuyến khích sửa khá mạnh, nói luôn ranh giới cho rõ:

__Được__ — dùng cho công việc của mình và của công ty đang làm, không giới hạn số dự án; sửa cắt ghép tuỳ ý; dùng cho công việc tính phí với khách hàng.

__Không được__ — bán lại hoặc phân phối lại cho người ngoài công ty; đăng công khai; dùng làm tài liệu giảng dạy trong khoá học thu phí.

Ranh giới gọn: __dùng để làm việc thì thoải mái; phân phối lại hoặc dạy lại thu phí thì không.__ Chi tiết ở [`LICENSE`](../LICENSE).

---

## Lộ trình đọc tiếp

| Nếu các bạn muốn | Đọc chương |
|---|---|
| Cài và chạy thử ngay | [01 — Bắt đầu nhanh](01-bat-dau-nhanh.md) |
| Hiểu skill/agent/rule/hook khác nhau thế nào | [02 — Bộ Kit gồm những gì, và sửa ở đâu](02-hieu-cau-truc-bo-kit.md) |
| Tự ghép luồng làm việc của mình | [03 — Chọn pipeline của bạn](03-chon-pipeline-cua-ban.md) |
| Biết vì sao đừng cài nhiều skill | [04 — Skill preload và token](04-skill-preload-va-token.md) |
| Đổi chỗ ghi file, đổi cách đặt tên | [05 — Cấu hình output](05-cau-hinh-output.md) |
| Mang skill về dự án riêng | [06 — Copy skill về dự án](06-copy-skill-ve-du-an.md) |
| Sửa template, sửa logic, viết skill mới, đổi ngôn ngữ | [07 — Tùy biến skill](07-tuy-bien-skill.md) |
| Dùng Codex CLI hoặc Antigravity | [08 — Mang sang agent khác](08-mang-sang-codex-antigravity.md) |
| Hiểu vì sao không nên dùng trên chat | [09 — Vì sao không hợp AI Chat](09-vi-sao-khong-hop-ai-chat.md) |

Chưa quen Claude Code thì đọc lần lượt 01 → 02 → 03 → 04. Đã quen rồi thì nhảy thẳng 03 (chọn skill cần) → 04 (biết cài bao nhiêu) → 05 (chốt cấu trúc thư mục) → 06 (copy về).

---

## Muốn tự build skill của riêng mình?

Bộ này là __kết quả__ — cách mình đóng gói công việc BA thành skill.

Còn __cách làm ra nó__ thì tài liệu khó dạy được: nhìn một việc lặp lại và biết nó có đáng thành skill không, viết Constraints thế nào để AI không tự đoán, đặt review gate ở đâu cho đúng chỗ, sửa skill khi nó chạy sai mà không phá những thứ đang chạy đúng.

Đó là thứ phải làm cùng nhau.

> __Khoá học AI4BA v2 · Trọn gói__
> Không chỉ dùng bộ skills có sẵn — học cách tự build skills, agents và workflow AI cho công việc BA.
>
> 👉 [ai4ba.com](https://ai4ba.com)
>
> __Mua bộ BA-Kit từ [ai4ba.com/ba-kit](https://ai4ba.com/ba-kit) được giảm 500.000đ khi đăng ký khoá học.__

---

> __Nhắc lại điều quan trọng nhất:__ bộ skill này nên được tinh chỉnh theo nhu cầu của các bạn. Nó không đúng cho tất cả mọi người — nó chỉ đúng trong một số trường hợp. Hãy dùng nó như điểm khởi đầu, không phải điểm kết thúc.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
