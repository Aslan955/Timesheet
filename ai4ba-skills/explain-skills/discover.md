---
type: skill-explainer
skill: discover
updated: 2026-08-01
---

# `/discover` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> __Về các ví dụ trong tài liệu này.__ Để dễ hình dung, phần lớn ví dụ dưới đây lấy từ một sản phẩm giả định là __ứng dụng học tiếng Anh__ (nên người dùng cuối được gọi là "học viên", đối thủ là các app học ngoại ngữ). Đó chỉ là ví dụ minh hoạ — `/discover` __không gắn với lĩnh vực nào cả__. Nó đọc lĩnh vực, danh sách đối thủ và __cách gọi người dùng cuối__ từ hồ sơ dự án của chính bạn (xem Mục 8). Dự án bán lẻ thì gọi "khách hàng", app gọi xe thì "tài xế", phần mềm bệnh viện thì "bệnh nhân" — và đối thủ cũng là đối thủ trong ngành đó.

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/discover` là lệnh dùng khi bạn có __một ý tưởng tính năng còn đang phân vân__: chưa biết người dùng có thật sự cần không, có đáng bỏ công làm không, và nếu làm thì nên bắt đầu ở phạm vi nào.

Ví dụ, trong danh sách tính năng của một ứng dụng học tiếng Anh có dòng: “nhắc học bằng chuỗi ngày học liên tục”. Bạn biết nhiều ứng dụng khác có cách này, nhưng chưa chắc nó có giúp học viên của mình học đều hơn hay chỉ tạo thêm áp lực. Đây chính là lúc nên dùng `/discover`.

Nó điều tra hai phía:

- __Người dùng của mình cần làm được việc gì__ và hiện có bằng chứng nào cho nhu cầu đó.
- __Các sản phẩm cùng ngành__ đang giải nhu cầu ấy như thế nào, có điểm nào đáng học và lỗi nào cần tránh.

Sau đó, hệ thống đưa ra một khuyến nghị rõ ràng: __nên làm__, __không nên làm__, hoặc __nên làm nhưng cần điều chỉnh__. Nếu nên làm, nó chỉ đề xuất từ 1 đến 3 hướng vừa đủ để bạn đi tiếp sang `/brainstorm`, không biến thành một danh sách dài các ý tưởng lan man.

Bạn có thể gõ như sau:

```
/discover ôn tập ngắt quãng
```

Nếu bạn không nói gì thêm và chủ đề đã rõ, `/discover` mặc định giúp bạn __quyết có nên làm hay không__. Hoặc để hệ thống hỏi lại chủ đề:

```
/discover
```

Bạn cũng có thể nói rõ điều mình muốn quyết:

```
/discover AI pronunciation feedback, tôi muốn quyết có nên làm không
```

Nếu chỉ muốn suy nghĩ dựa trên tài liệu nội bộ, không muốn tìm hiểu đối thủ trên mạng, bạn có thể nói thêm:

```
/discover AI pronunciation feedback, đừng search web nhé
```

Khi đó, báo cáo bỏ hẳn phần đối thủ, chỉ dùng thông tin nội bộ, và ghi rõ là __chưa đối chiếu với các ứng dụng khác__ để người đọc biết nhận định còn thiếu góc nhìn thị trường.

`/discover` thường nằm sau `/prd` (bản yêu cầu sản phẩm): bản yêu cầu sản phẩm có thể liệt kê nhiều tính năng tiềm năng, còn `/discover` giúp soi kỹ __một dòng còn chưa chắc chắn__ trước khi cả đội dành thời gian bàn sâu hơn trong `/brainstorm`.

***

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quan trọng nhất cần nhớ: **`/discover` có 2 lần dừng lại để bạn duyệt.** Lần đầu là trước khi hệ thống đi tìm hiểu đối thủ; lần thứ hai là trước khi ghi bản nghiên cứu thành file. Vì vậy, bạn luôn biết hệ thống sắp tìm gì, đang kết luận gì và có thể chỉnh hướng kịp thời.

```
 BẠN GÕ LỆNH
 /discover "chu de dang phan van"
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Hiểu đúng điều bạn đang phân vân         │
 │  Hệ thống đọc chủ đề và mục tiêu của bạn.              │
 │  Nếu ý định còn mơ hồ, nó hỏi 1-3 câu làm rõ:          │
 │  bạn đang muốn quyết nên làm, muốn xem đối thủ, hay    │
 │  đang tìm một hướng khác cho vấn đề học viên gặp phải? │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Lập kế hoạch điều tra                    │
 │  Hệ thống phác thảo:                                   │
 │  - Chủ đề và mục tiêu cần làm rõ                       │
 │  - Nhu cầu học viên sẽ kiểm tra                        │
 │  - Những ứng dụng sẽ tham khảo                         │
 │  - Các điểm sẽ so sánh                                 │
 └──────────────────────────────────────────────────────┘
        │
        ▼
   ┌────────────────────────────────────────────────────┐
   │  ██████████  ĐIỂM DỪNG 1 — BẠN DUYỆT  ██████████   │
   │                                                      │
   │  Bạn xem kế hoạch rồi chọn:                          │
   │      Y       → đồng ý cho điều tra tiếp              │
   │      sửa lại → đổi chủ đề, mục tiêu, đối thủ,        │
   │                hoặc điểm cần so sánh                 │
   │                                                      │
   │  Chỉ khi bạn đồng ý, hệ thống mới tìm hiểu đối thủ.  │
   └────────────────────────────────────────────────────┘
        │
        │  (chỉ đi tiếp khi bạn duyệt)
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Điều tra có căn cứ                       │
 │  Hệ thống xem nhu cầu học viên trước: phản hồi, đánh  │
 │  giá, dấu hiệu học viên bỏ dở, hay dữ liệu sẵn có.     │
 │  Sau đó mới nhờ một trợ lý chuyên tìm hiểu đối thủ     │
 │  xem các ứng dụng khác đang giải nhu cầu ấy ra sao.    │
 │  Nhận định quan trọng phải có nguồn hoặc ghi rõ là     │
 │  suy đoán cần kiểm lại.                                │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3B — Ba trợ lý TRANH LUẬN nên làm không     │
 │  Trước khi kết luận, hệ thống KHÔNG tự quyết một mình. │
 │  Nó giao cho ba trợ lý ba vai đối lập, cùng một dữ    │
 │  kiện nhưng nhìn từ ba phía:                           │
 │   • Trợ lý ỦNG HỘ: nêu lý do mạnh nhất NÊN làm.        │
 │   • Trợ lý PHẢN ĐỐI: nêu lý do mạnh nhất KHÔNG nên.    │
 │   • Trợ lý KHẢ THI: xét công sức, chi phí, phụ thuộc.  │
 │  Nếu ba bên lệch nhau, cho tranh luận thêm một vòng.   │
 │  Cuối cùng hệ thống (đóng vai người phân xử) đọc cả    │
 │  ba, cân nhắc rồi chốt — có ghi lại vì sao chốt vậy.   │
 │                                                        │
 │  (Bỏ qua bước này nếu bạn nói "khỏi tranh luận", hoặc  │
 │   chỉ muốn tham khảo đối thủ, hoặc đã tắt tìm web.)    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Soạn bản nghiên cứu                      │
 │  Mở đầu bằng phần Tóm tắt, rồi tới 5 mục:              │
 │  1. Học viên cần gì                                    │
 │  2. Đối thủ làm thế nào                                │
 │  3. Nếu làm thì lưu ý gì                               │
 │  4. Nên làm không (kèm "các góc nhìn đã cân nhắc" —    │
 │     tóm tắt ba trợ lý đồng thuận/lệch chỗ nào)         │
 │  5. Bước tiếp theo                                     │
 │                                                        │
 │  Hệ thống cũng xếp thô mức ưu tiên để hỗ trợ so sánh,  │
 │  nhưng không để con số tự quyết định thay bạn.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
   ┌────────────────────────────────────────────────────┐
   │  ██████████  ĐIỂM DỪNG 2 — BẠN DUYỆT  ██████████   │
   │                                                      │
   │  Hệ thống đưa ngay trong khung chat:                 │
   │  - Bản tóm tắt                                      │
   │  - Bảng so sánh rút gọn                              │
   │  - Khuyến nghị (kèm ba trợ lý đồng thuận/lệch gì)    │
   │  - 1-3 hướng đề xuất để bàn tiếp                     │
   │                                                      │
   │  Bạn có thể đồng ý, yêu cầu sửa, tối đa 2 vòng.      │
   │  Chưa duyệt thì CHƯA ghi file.                       │
   └────────────────────────────────────────────────────┘
        │
        │  (chỉ đi tiếp khi bạn duyệt)
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Ghi bản nghiên cứu hoàn chỉnh            │
 │  Hệ thống lưu lại một tài liệu nghiên cứu để cả đội   │
 │  có thể đọc lại: bằng chứng nào đã xem, điều gì còn   │
 │  chưa chắc, và vì sao đi đến khuyến nghị hiện tại.     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 HOÀN TẤT
 Nếu nên làm: lấy 1-3 hướng gọn này sang /brainstorm.
 Nếu nên làm có điều chỉnh: mang phạm vi đã chỉnh sang /brainstorm.
 Nếu không nên làm: cập nhật lại dòng tính năng trong PRD
 và dừng, không tốn thêm công cho một ý tưởng chưa cần.
```

***

## 3. Vì sao “nhu cầu người dùng” phải đứng trước “đối thủ”?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Vì đối thủ có một tính năng không đồng nghĩa người dùng của mình cần tính năng đó.

Hãy hình dung một quán cà phê thấy quán bên cạnh bán bánh ngọt rất chạy. Nếu chủ quán lập tức mua lò nướng, thuê thợ, nhập nguyên liệu chỉ vì “họ có thì mình cũng phải có”, có thể vài tháng sau mới nhận ra khách của quán mình chủ yếu cần chỗ ngồi làm việc yên tĩnh, không phải bánh ngọt. Đầu tư đó không hẳn sai, nhưng được đưa ra vì nhìn người khác chứ không phải vì hiểu khách của mình.

Sản phẩm phần mềm cũng vậy. Các đối thủ trong ngành của bạn có thể đều làm một việc nào đó, nhưng mỗi bên phục vụ nhóm khách khác nhau, mục tiêu khác nhau và có cách kiếm tiền khác nhau. Điều phù hợp với họ chưa chắc phù hợp với sản phẩm của mình. (Trong ví dụ app học tiếng Anh: các app học ngoại ngữ lớn đều có “chuỗi ngày học”, nhưng họ nhắm người học phổ thông rảnh giờ, còn app của bạn nhắm người đi làm chỉ học được buổi tối — cùng một tính năng, tác dụng khác hẳn.)

Vì vậy, bản nghiên cứu luôn bắt đầu bằng câu hỏi:

> Người dùng của mình đang cố làm được việc gì, và có dấu hiệu nào cho thấy họ đang gặp khó ở đó?

Ví dụ với chủ đề “chuỗi ngày học liên tục”, câu hỏi không phải là: “Bao nhiêu đối thủ có chuỗi ngày học?” Mà là: “Học viên của mình có đang học ngắt quãng không, vì sao họ bỏ dở, và một lời nhắc hay phần thưởng có thật sự giúp họ quay lại không?”

Nếu chưa có phản hồi, đánh giá hay số liệu nào để trả lời, hệ thống phải ghi thẳng: __chưa có dữ liệu, phần lớn là suy đoán__. Sự thẳng thắn này quan trọng hơn một kết luận nghe có vẻ tự tin nhưng không có căn cứ.

Đối thủ vẫn rất đáng tìm hiểu, nhưng họ là nguồn để học cách giải quyết, nhận ra rủi ro và mở rộng góc nhìn — không phải lý do tự thân để mình chạy theo.

***

## 4. Vì sao có hai điểm dừng để bạn duyệt?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điều tra đối thủ có thể tốn công, còn một bản nghiên cứu dài có thể đi lệch hướng nếu ngay từ đầu hiểu sai điều bạn muốn biết. Hai điểm dừng giúp tránh cả hai việc đó.

__Điểm dừng thứ nhất__ xảy ra trước khi tìm hiểu đối thủ. Hệ thống sẽ cho bạn xem kế hoạch: chủ đề đang điều tra là gì, mục tiêu là gì, nhu cầu học viên nào cần kiểm tra, sẽ xem những ứng dụng nào và sẽ so sánh theo các điểm nào.

Bạn có thể thấy ngay một vấn đề như: “Tôi không muốn biết tất cả đối thủ; chỉ muốn xem cách Duolingo và ELSA xử lý việc luyện phát âm.” Hoặc: “Tôi không định làm tính năng này ngay, chỉ muốn xem liệu có nên bỏ nó khỏi kế hoạch không.” Bạn sửa ở đây thì cả phần điều tra phía sau sẽ đúng trọng tâm hơn.

__Điểm dừng thứ hai__ xảy ra khi hệ thống đã có bản soạn nhưng chưa ghi thành tài liệu. Lúc này, bạn không phải đọc một file dài đã được viết cố định rồi mới tìm cách sửa; bạn được xem trước phần quan trọng nhất ngay trong cuộc trò chuyện: kết luận, lý do, bảng so sánh rút gọn và các hướng đề xuất.

Bạn có thể yêu cầu sửa tối đa hai vòng. Ví dụ: “Kết luận này đúng, nhưng đừng đề xuất làm màn hình mới; hãy thử dùng thông báo nhắc học trước.” Chỉ sau khi bạn đồng ý, hệ thống mới ghi bản nghiên cứu hoàn chỉnh.

Hai điểm dừng này giống như duyệt thực đơn trước khi đầu bếp đi chợ, rồi nếm món trước khi mang ra bàn. Bạn vẫn là người quyết định hướng đi; hệ thống chỉ giúp chuẩn bị có trật tự.

***

## 5. Vì sao trước khi kết luận lại cho ba trợ lý tranh luận?

Kết luận “nên làm hay không” là phần quan trọng nhất của cả bản nghiên cứu. Nếu chỉ một mình hệ thống tự nghĩ ra kết luận đó, nó rất dễ bị nghiêng theo hướng nó đã tìm hiểu lúc đầu — giống như một người điều tra xong rồi tự chấm điểm bài của chính mình. Vì vậy, trước khi chốt, hệ thống __giao việc phản biện cho ba trợ lý khác nhau__, mỗi người đóng một vai đối lập.

Hãy hình dung một cuộc họp nhỏ để quyết có nên làm tính năng “chuỗi ngày học liên tục” không. Thay vì để một người vừa đề xuất vừa tự gật đầu, bạn mời ba người vào phòng:

- __Người ủng hộ__ cố nêu ra lý do thuyết phục nhất để làm: học viên đang bỏ dở nhiều, một lời nhắc đúng lúc có thể giúp họ quay lại, và đây là cơ hội tăng mức độ gắn bó.
- __Người phản đối__ cố tìm mọi lý do để khoan làm: bằng chứng nhu cầu còn yếu, chuỗi ngày học có thể gây áp lực khiến học viên bỏ hẳn, và có cách rẻ hơn để thử trước.
- __Người xét khả thi__ không bàn nên hay không, mà hỏi: làm cái này tốn bao nhiêu công, cần lưu lại những gì, phụ thuộc vào phần nào của hệ thống, và những cạm bẫy thường gặp khi vận hành.

Cả ba nhận __cùng một tập dữ liệu__ (nhu cầu học viên, cách đối thủ làm, các lưu ý đã thu thập) nhưng nhìn từ ba phía. Nếu ba người vẫn lệch nhau về kết luận, hệ thống cho họ __tranh luận thêm một vòng__: đưa lập luận của người này cho người kia đọc và phản biện lại. Cuối cùng, chính hệ thống đóng vai __người phân xử__ — đọc cả ba, cân nhắc rồi đưa ra kết luận, và ghi lại rõ vì sao chốt như vậy, ba bên đồng thuận ở đâu, còn lệch ở đâu.

Điều này mang lại hai lợi ích. Thứ nhất, bản nghiên cứu có được __nhiều góc nhìn thay vì một__, nên kết luận đáng tin hơn. Thứ hai, bạn không chỉ đọc một câu “nên làm” hay “không nên làm”, mà thấy được __cả những phản biện đã được cân nhắc__ — nếu sau này ai đó hỏi “sao lại quyết vậy?”, bạn có sẵn câu trả lời.

Về mặt kỹ thuật, phần tranh luận này được giao ra cho các trợ lý AI khác chạy song song, để không dồn hết vào một chỗ. Nhưng người __chốt cuối cùng vẫn là hệ thống chính__ (rồi tới bạn duyệt ở điểm dừng thứ hai) — các trợ lý chỉ đóng vai tranh luận, không ai được tự quyết thay bạn.

Bước tranh luận này __chạy mặc định__ khi bạn đang muốn quyết nên làm hay không. Nếu bạn chỉ muốn tham khảo đối thủ cho nhanh, hoặc muốn bỏ qua để tiết kiệm thời gian, chỉ cần nói “khỏi tranh luận” và hệ thống sẽ tự kết luận một mình — nhưng khi đó nó ghi rõ là __kết luận này chưa qua phản biện nhiều góc nhìn__, để bạn biết mà cân nhắc thêm.

***

## 6. “Mức ưu tiên” là gì, và vì sao nó không được tự quyết định?

Trong bản nghiên cứu, hệ thống có thể xếp thô mức ưu tiên dựa trên ba điều:

- Giá trị tính năng có thể mang lại cho học viên và sản phẩm.
- Công sức cần bỏ ra để thực hiện.
- Độ chắc chắn của nhận định hiện có.

Mục đích của phần này là giúp bạn so sánh tương đối. Chẳng hạn, nếu có ba chủ đề đều đang phân vân, bạn sẽ dễ nhận ra chủ đề nào có vẻ mang lại nhiều giá trị hơn với công sức thấp hơn, hoặc chủ đề nào hấp dẫn nhưng hiện chưa có đủ bằng chứng.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nhưng __đây không phải là máy chấm điểm để thay con người ra quyết định__.

Ví dụ, hai chủ đề được xếp gần nhau, một cái 87 và một cái 85. Chênh lệch nhỏ như vậy có thể chỉ là do ước lượng, không nói lên rằng chủ đề 87 chắc chắn đáng làm hơn. Hơn nữa, còn những điều điểm số không thể tự hiểu hết: chiến lược sản phẩm năm nay, một đối tác đang chờ tích hợp, một tính năng tuy ít giá trị trực tiếp nhưng bắt buộc phải có để cạnh tranh, hay một phụ thuộc lớn mà đội chưa sẵn sàng xử lý.

Vì vậy, phần “Nên làm không” phải là __một lập luận bằng lời__: học viên cần gì, bằng chứng mạnh đến đâu, lợi ích và rủi ro là gì, rồi mới kết luận nên làm, không nên làm, hay nên làm sau khi điều chỉnh. Mức ưu tiên chỉ là một tấm bản đồ phác thảo, không phải người cầm lái.

***

## 7. Vì sao hệ thống không bịa số liệu và luôn cần nguồn?

Một câu như “tính năng này sẽ giúp tăng tỷ lệ học đều 20%” nghe rất thuyết phục. Nhưng nếu tính năng đó chưa tồn tại trong ứng dụng của mình, câu này thường chỉ là dự đoán.

Dự đoán không phải lúc nào cũng xấu. Đội sản phẩm vẫn cần giả định để bàn bạc và chọn hướng thử nghiệm. Vấn đề chỉ xuất hiện khi giả định được viết như thể nó đã là sự thật. Khi đó, người đọc sau rất dễ dựa vào một con số không có gốc để ra quyết định lớn hơn.

Vì vậy, `/discover` có nguyên tắc rõ ràng:

- Có nguồn thì nêu nguồn, kèm đường dẫn và ngày xem.
- Là ước lượng thì gọi đúng là __ước lượng__.
- Chưa có dữ liệu công khai thì ghi rõ là __chưa có dữ liệu công khai__.
- Là nhận định chưa kiểm được thì ghi là __suy đoán, cần kiểm lại__.
- Câu nhận định quan trọng không có căn cứ sẽ bị bỏ đi hoặc chuyển thành câu hỏi cần tiếp tục xác minh.

Cách làm này không khiến bản nghiên cứu “yếu” hơn. Ngược lại, nó giúp cả đội biết chính xác phần nào đã chắc, phần nào đang tạm giả định, phần nào cần hỏi học viên thêm. Giống như bác sĩ phân biệt rõ kết quả xét nghiệm với nghi ngờ ban đầu: cả hai đều hữu ích, nhưng không được lẫn vào nhau.

Tài liệu cũng dùng tiếng Việt dễ đọc. Thay vì rải các nhãn viết tắt hoặc mức cao, trung bình, thấp khắp bảng, hệ thống nói rõ bằng lời: thông tin nào “chắc chắn có nguồn”, thông tin nào là “suy đoán cần kiểm lại”.

***

## 8. Lĩnh vực, đối thủ và cách gọi người dùng — lấy từ đâu?

`/discover` phải biết ba thứ trước khi điều tra được: __sản phẩm của bạn thuộc lĩnh vực nào__, __đối thủ là những ai__, và __người dùng cuối được gọi là gì__ (học viên? khách hàng? tài xế? bệnh nhân?). Ba thứ này không có sẵn trong câu lệnh bạn gõ, mà cũng không nên hỏi lại mỗi lần.

Nên hệ thống dùng một file dùng chung tên là __hồ sơ dự án__ — `docs/_shared/project-profile.md`:

1. __Đọc trước.__ Đầu mỗi lần chạy, nó mở hồ sơ dự án xem đã có lĩnh vực / đối thủ / cách gọi người dùng chưa.
2. __Thiếu thì hỏi.__ Chưa có → nó hỏi bạn ở phần làm rõ đầu lệnh (cùng lúc hỏi mục tiêu research), chỉ hỏi phần còn trống.
3. __Xin ghi lại.__ Sau khi bạn trả lời, nó đề xuất lưu vào hồ sơ — gồm cả __bảng đối thủ đã chốt__ — để lần sau khỏi phải tìm lại từ đầu. Bạn duyệt trước khi ghi.
4. __Lần sau dùng lại.__ Các lệnh khác (`/prd`, `/urd`, `/brd`, `/brainstorm`, `/srs`...) cũng đọc chung hồ sơ này nên không hỏi lại bạn nữa.

Điều này có một hệ quả bạn sẽ thấy ngay trong file kết quả: __tiêu đề Mục 1 đổi theo dự án của bạn__. Hồ sơ ghi "học viên" thì mục đó tên là *“Học viên cần gì”*; ghi "khách hàng" thì thành *“Khách hàng cần gì”*. Chưa có hồ sơ thì dùng từ trung tính *“Người dùng cần gì”* — không chặn bạn chạy lệnh.

Muốn xem hoặc sửa hồ sơ chủ động (thay vì đợi lệnh hỏi), dùng `/update-overview profile`.

***

## 9. `/discover` khác `/prd` và `/brainstorm` ở đâu?

Bạn có thể nhớ đơn giản theo phạm vi công việc:

- `/prd` giúp nhìn __toàn bộ sản phẩm__ và liệt kê các tính năng có thể cần có.
- `/discover` soi kỹ __một chủ đề còn phân vân__ để trả lời: có nên làm không, vì sao, và nếu làm thì phạm vi ban đầu nên cỡ nào.
- `/brainstorm` bắt đầu bàn sâu hơn về một hướng đã đáng để theo đuổi: người dùng gặp tình huống nào, cách giải nào hợp lý, cần giới hạn phạm vi ra sao.

Vì vậy, `/discover` không có nhiệm vụ bóc hết danh sách tính năng của sản phẩm. Nó cũng không vẽ luồng thao tác hay màn hình chi tiết. Những việc đó đến sau, khi đội đã có lý do đủ tốt để đầu tư thời gian.

Nếu kết luận là __không nên làm__, đó vẫn là một kết quả có giá trị: bạn cập nhật lại dòng tính năng trong PRD và dừng đúng lúc. Không cần cố biến mọi ý tưởng thành một dự án.

Nếu kết luận là __nên làm__, hệ thống chỉ đưa ra 1 đến 3 hướng gọn để làm mồi cho buổi `/brainstorm`. Ví dụ: thử nhắc học theo mục tiêu cá nhân, thử phần thưởng nhỏ khi quay lại học, hoặc chỉ thử với một nhóm học viên trước. Không đẻ thêm mười tính năng để đội bị loãng.

***

## Ví dụ thực tế

Chị __Mai__ là BA của một ứng dụng học tiếng Anh. Trong bản kế hoạch sản phẩm có một dòng ghi: “Chuỗi ngày học liên tục để giúp học viên duy trì thói quen”. Chị Mai phân vân: tính năng này rất phổ biến, nhưng chị không muốn làm chỉ vì các ứng dụng khác đều có.

Chị gõ:

```
/discover chuỗi ngày học liên tục, tôi muốn quyết có nên làm không
```

1. Hệ thống hiểu mục tiêu mặc định là ra quyết định nên làm hay không. Tuy nhiên, nó hỏi chị Mai một câu làm rõ: nhóm học viên chính của ứng dụng là người mới bắt đầu hay người đi làm đang cần duy trì thói quen? Chị Mai trả lời: người đi làm, thường chỉ học được vào buổi tối.

2. Hệ thống đưa ra kế hoạch điều tra: xem các dấu hiệu học viên bỏ dở đang có, tìm phản hồi về việc duy trì thói quen, sau đó tham khảo cách Duolingo, ELSA và Memrise xử lý việc nhắc học và khuyến khích quay lại. Bảng so sánh sẽ đặt ứng dụng của mình cạnh từng ứng dụng tham khảo, và ghi riêng phần miễn phí với phần trả phí.

3. Đây là __điểm dừng thứ nhất__. Chị Mai đọc kế hoạch và sửa một ý: tập trung vào một tính năng cơ bản cho tất cả học viên, nên phần trả phí của đối thủ chỉ cần ghi nhận sơ để tham chiếu, đừng đào sâu. Hệ thống chỉnh lại kế hoạch, chị Mai gõ `Y`.

4. Hệ thống bắt đầu điều tra. Nó phát hiện phản hồi hiện có cho thấy nhiều học viên bỏ dở sau vài ngày bận rộn, nhưng chưa có dữ liệu đủ mạnh để kết luận rằng họ muốn một “chuỗi ngày học”. Vì vậy, bản soạn ghi rõ: nhu cầu duy trì thói quen có dấu hiệu thật, còn cách giải bằng chuỗi ngày học vẫn là giả định cần kiểm chứng.

5. Khi xem đối thủ, hệ thống ghi nhận một số ứng dụng dùng chuỗi ngày học, lời nhắc cá nhân và phần thưởng nhỏ. Nó cũng nêu những điều cần tránh: đừng khiến học viên cảm thấy thất bại nặng nề khi lỡ một ngày; cần cân nhắc cách xử lý ngày bận hoặc học bù; và phải xác định rõ hệ thống cần lưu lại những lần học nào.

6. Trước khi chốt, hệ thống cho __ba trợ lý tranh luận__. Trợ lý ủng hộ cho rằng nên làm vì nhiều học viên đi làm đang bỏ dở và một lời nhắc đúng lúc có thể kéo họ về. Trợ lý phản đối cảnh báo rằng bằng chứng nhu cầu còn yếu, và một chuỗi ngày cứng nhắc có thể khiến người bận rộn thấy áp lực rồi bỏ hẳn. Trợ lý xét khả thi nhắc rằng cần quyết rõ ghi nhận “một buổi học” là gì và xử lý ngày bận thế nào, nếu không sẽ rối. Ba bên lệch nhau nên có thêm một vòng phản biện; cuối cùng hệ thống đóng vai người phân xử, nghiêng về hướng “nên làm nhưng phải mềm dẻo” và ghi rõ lý do.

7. Dựa trên phần tranh luận đó, hệ thống đề xuất kết luận: __nên làm có điều chỉnh__. Thay vì đưa ngay một chuỗi ngày học cứng nhắc, hãy bắt đầu bằng lời nhắc học theo mục tiêu cá nhân và cho phép học viên quay lại sau ngày bận mà không thấy bị “mất trắng” toàn bộ nỗ lực. Mục “nên làm không” cũng tóm tắt lại ba góc nhìn để chị Mai thấy vì sao chốt vậy.

8. Đây là __điểm dừng thứ hai__. Chị Mai xem bản tóm tắt và đồng ý với kết luận, nhưng yêu cầu thêm một câu hỏi còn mở: “Học viên có thích được nhắc vào buổi tối hay muốn tự chọn giờ nhắc?” Hệ thống bổ sung câu hỏi này.

9. Chị Mai duyệt bản soạn. Hệ thống mới ghi bản nghiên cứu hoàn chỉnh: mở đầu bằng phần tóm tắt, rồi tới năm mục — học viên cần gì, đối thủ làm thế nào, nếu làm thì lưu ý gì, nên làm không, và bước tiếp theo.

10. Ở phần bước tiếp theo, hệ thống chỉ đề xuất hai hướng để chị Mai mang sang `/brainstorm`: thiết kế lời nhắc theo mục tiêu học, và thử một cách ghi nhận việc học linh hoạt hơn chuỗi ngày cứng nhắc.

Nhờ vậy, chị Mai không còn nói “đối thủ có thì mình cũng làm”. Chị có một lý do rõ ràng để tiếp tục bàn sâu: ứng dụng cần giúp người đi làm quay lại học sau những ngày bận, còn “chuỗi ngày học” chỉ là một trong nhiều cách có thể thử.

***

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ chi tiết kỹ thuật (hai điểm dừng, cách chọn đối thủ và bộ cột so sánh, cách ba trợ lý tranh luận rồi phân xử, cách gắn nhãn nguồn/độ tin cậy, các trường hợp đặc biệt), đọc file gốc: `.claude/skills/discover/SKILL.md`. Cách chia việc và điều phối các trợ lý AI tranh luận nằm ở `.claude/skills/delegate/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
