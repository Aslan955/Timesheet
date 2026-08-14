---
type: skill-explainer
skill: userstory
updated: 2026-07-26
---

# `/userstory` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/userstory` tạo __user story — mẩu nhu cầu người dùng cho backlog__ từ SRS, use case và màn hình đã có.

Một story tốt không chỉ là một việc cần làm. Nó là một __lát cắt nghiệp vụ dọc__: một người cụ thể có thể làm một việc từ đầu đến cuối và nhận được một giá trị quan sát được.

Ví dụ đời thường: một nhà hàng muốn làm ứng dụng đặt món.

- "Thiết kế màn hình chọn món" không phải giá trị mà khách nhận được.
- "Tạo bảng dữ liệu đơn hàng" cũng không phải giá trị mà khách nhận được.
- "Khách đặt được món và nhận xác nhận đơn" mới là một kết quả nghiệp vụ từ đầu đến cuối.

Bạn nên dùng `/userstory` khi:

- Đã có SRS với FR, và muốn chuẩn bị danh sách backlog để refinement.
- Muốn chuyển use case hoặc màn hình thành các đơn vị công việc nghiệp vụ rõ ràng.
- Muốn phát hiện sớm yêu cầu nào chưa rõ trước khi đưa cho team làm.
- Muốn có liên kết từ mỗi story về FR nguồn, thay vì các story không biết từ đâu ra.

Ví dụ lệnh:

```
/userstory payment
```

Bạn cũng có thể gõ `/userstory` không kèm feature để chọn trong danh sách. Nếu chỉ muốn làm cho một use case hoặc FR, bạn có thể nói rõ bằng lời ở phần xem trước, ví dụ: "chỉ tạo story cho FR-payment-002".

__Một câu để nhớ:__ `/userstory` chia backlog theo __kết quả nghiệp vụ nhỏ nhất nhưng trọn vẹn__, không chia theo màn hình hay theo việc kỹ thuật.

***

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
 BẠN GÕ LỆNH
 /userstory payment
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Kiểm tra feature và SRS                       │
 │  Skill cần SRS có FR thật để làm nguồn.               │
 │  Chưa có SRS → từ chối, hướng dẫn chạy /srs trước.    │
 │  SRS còn nháp → cảnh báo, vẫn có thể tạo bản nháp.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Đọc nguồn liên quan                           │
 │  Đọc FR, luồng, use case và màn hình nếu đã có để     │
 │  hiểu actor, quy tắc, lỗi và giá trị cần tạo ra.       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Chia theo kết quả nghiệp vụ                   │
 │  Tìm "việc nhỏ nhất mà làm xong đã có giá trị".       │
 │  Màn hình, actor và FR chỉ gợi ý chỗ cắt; không phải  │
 │  công thức bắt buộc để chia story.                    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Tự soi chất lượng và chỗ còn mơ hồ            │
 │  Skill kiểm INVEST và DoR nhẹ. Thiếu rule/actor/      │
 │  ngưỡng → đánh Open Question, không tự bịa thêm.      │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Xem trước danh sách sẽ tạo                    │
 │  Bạn xem title, persona, FR, màn hình, ưu tiên,       │
 │  nguồn và các story còn cần refinement.               │
 │  Đồng ý (Y) thì skill mới ghi file.                   │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Tạo story và bảng index                       │
 │  Mỗi story là một file us-NNN.md. Index giữ danh      │
 │  sách chung, trạng thái, ưu tiên và Jira key.         │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 7 — Hỏi có tạo AC tiếp không                      │
 │  Skill hỏi bạn có muốn chain /ac để tạo bản nháp      │
 │  acceptance criteria cho các story vừa sinh không.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 8 — Gợi ý soát lại độ phủ                         │
 │  Skill nhắc bạn chạy /gap để dựng bảng đối chiếu      │
 │  yêu cầu ↔ story ↔ điều kiện nghiệm thu — xem có      │
 │  yêu cầu nào chưa story nào phủ, hoặc 2 story trùng   │
 │  ý nhau không. Đây là gợi ý, không tự chạy.           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — backlog-draft có nguồn và chỗ cần làm rõ
```

***

## 3. Vì sao phải chia theo "kết quả nghiệp vụ", không phải theo màn hình?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là nguyên tắc quan trọng nhất của `/userstory`.

Một user story cần là một __vertical slice — lát cắt dọc__. Nghĩa là nó đi xuyên qua mọi phần cần thiết để người dùng thật sự nhận được một kết quả. Bạn không cần biết bên trong có bao nhiêu màn hình, bao nhiêu hệ thống hay bao nhiêu bước kỹ thuật; điều quan trọng là người dùng đã làm xong một việc có ích.

Ví dụ feature đặt lịch khám:

- "Bệnh nhân đặt được lịch khám và nhận xác nhận" là một story có giá trị.
- "Làm màn hình chọn bác sĩ" chỉ là một lát cắt ngang theo giao diện. Nếu làm xong riêng nó, bệnh nhân chưa đặt lịch được.
- "Tạo API đặt lịch" hay "tạo bảng lịch hẹn" là việc kỹ thuật. Chúng có thể cần làm, nhưng không nên giả vờ là user story.

Màn hình, actor và FR vẫn rất hữu ích, nhưng là __tín hiệu phụ__:

- Một FR hoặc cụm FR có thể gợi ra một kết quả.
- Hai actor có mục tiêu hay quy tắc thật sự khác nhau có thể cần tách story.
- Một màn hình chỉ đáng dùng làm ranh giới khi nó đúng bằng một kết quả độc lập.

Vì sao không chia theo màn hình? Vì một kết quả thường đi qua nhiều màn hình; ngược lại một màn hình có thể phục vụ nhiều mục tiêu. Nếu chia theo màn hình, backlog dễ thành "làm trang A", "làm trang B", nhưng không ai biết sprint đó đã tạo giá trị gì cho người dùng.

Nếu phát hiện một việc chỉ là kỹ thuật, skill sẽ đề xuất gộp nó vào outcome phù hợp hoặc đánh dấu là __enabler — việc nền hỗ trợ__. Nó không cố biến mọi việc thành story có mẫu câu đẹp.

***

## 4. INVEST và DoR nhẹ là gì, và skill dùng chúng để làm gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trước khi đưa story ra xem trước, skill tự soi theo __INVEST__ — một bộ câu hỏi ngắn để xem story có đủ chất lượng cho backlog hay không:

- __Independent__: có thể làm tương đối độc lập, không mắc vào chuỗi phụ thuộc cứng.
- __Negotiable__: vẫn còn chỗ để team bàn cách làm; không khóa chặt giải pháp quá sớm.
- __Valuable__: tạo giá trị nghiệp vụ thật, không phải task kỹ thuật trá hình.
- __Estimable__: đủ rõ để team ước lượng.
- __Small__: vừa một lần thực hiện, một kết quả.
- __Testable__: có thể kiểm tra đạt/chưa đạt bằng quan sát.

Skill cũng kiểm tra __Definition of Ready (DoR) nhẹ__: persona và outcome có rõ không, giá trị/ưu tiên có lý do không, phạm vi và ngoài phạm vi đã nhận diện chưa, có phụ thuộc hay rủi ro nào không.

Điều này không có nghĩa skill tự tuyên bố story là "dev-ready". Kết quả của `/userstory` luôn là __backlog-draft cần refinement__. AC sinh kèm cũng là bản nháp; PO và QA vẫn cần chốt ví dụ, quy tắc, ngoại lệ và phụ thuộc.

Hãy xem skill như một người trợ lý chuẩn bị hồ sơ trước buổi refinement. Người này giúp đánh dấu chỗ thiếu, chứ không tự ký xác nhận thay người chịu trách nhiệm nghiệp vụ.

***

## 5. Khi FR mơ hồ, vì sao skill không tự điền cho "đủ"?

Một FR có thể rộng nhưng vẫn rõ. Ví dụ: "Khách có thể hủy đơn trước khi đơn được đóng gói." Skill có thể tách thành các outcome hợp lý nếu nguồn đã nêu rõ actor, điều kiện và giá trị.

Nhưng một FR kiểu "Hệ thống xử lý đơn nhanh" lại mơ hồ:

- Nhanh là bao lâu?
- Đơn nào?
- Ai nhìn thấy kết quả?
- Có ngoại lệ nào?
- Mức ưu tiên nghiệp vụ là gì?

Trong trường hợp đó, `/userstory` không tự bịa con số, quyền hạn hoặc quy tắc để tạo cảm giác hoàn chỉnh. Nó vẫn có thể tạo một story nháp, nhưng đánh dấu __Open Question — câu hỏi cần làm rõ__ để đưa về buổi refinement.

Mỗi story cũng cố gắng phân biệt ba loại thông tin:

- __Fact từ spec__: điều SRS hoặc use case đã nói rõ.
- __Suy luận hợp lý__: điều được suy ra từ nguồn, có ghi nhận là suy luận.
- __Open Question__: điều chưa đủ căn cứ, cần người có trách nhiệm nghiệp vụ quyết định.

Cách này giống ghi biên bản họp: điều đã thống nhất phải khác với điều người ghi suy luận, và càng phải khác với điều còn chờ trả lời. Nếu trộn ba loại vào nhau, team rất dễ coi giả định là quyết định chính thức.

***

## 6. Kết quả để ở đâu? Vì sao có index?

Skill tạo hoặc cập nhật hai loại file.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

File index chung:

```
docs/{feature}/userstories/{feature}-story-index.md
```

Mỗi story có một dòng với các thông tin như:

- ID;
- tên story;
- persona;
- FR liên quan;
- màn hình tham chiếu;
- ưu tiên;
- trạng thái;
- Jira key;
- ngày cập nhật.

Mỗi story chi tiết có một file riêng:

```
docs/{feature}/userstories/us-NNN.md
```

Ví dụ:

```
docs/payment/userstories/us-001.md
```

File story chứa mô tả nhu cầu, ngữ cảnh, FR liên quan, tham chiếu giao diện, lỗi, phụ thuộc, Open Question và phần AC inline.

Tại sao tách như vậy? Index giống bảng backlog để người quản lý nhìn nhanh; file riêng giống thẻ hồ sơ để BA, PO, QA và dev đọc kỹ một story mà không bị chìm giữa hàng chục story khác.

Trạng thái, ưu tiên và Jira key được giữ ở index để tránh bị lặp và lệch thông tin giữa nhiều file. Nếu story đã có Jira key, skill không tự đổi Jira key hoặc trạng thái đó; Jira được quản lý bởi luồng `/jira`.

Nhưng có một điều nó __sẽ nhắc__: nếu story đã có trên Jira mà nội dung ở máy vừa đổi, lệnh cảnh báo hai bên đang lệch — dev đọc Jira sẽ thấy bản cũ. Dùng `/cr` cho thay đổi nghiệp vụ cần hồ sơ, hoặc `/jira` để đồng bộ. `/userstory` __không tự đẩy__.

***

## 7. Vì sao story vẫn có Acceptance Criteria nhưng chưa phải bản cuối?

__Acceptance Criteria (AC) — tiêu chí chấp nhận__ là các điều kiện giúp kiểm tra story đã đáp ứng đúng hay chưa.

Sau khi tạo story, `/userstory` hỏi bạn có muốn chạy tiếp `/ac` cho các story vừa tạo không. Bạn có thể:

- Đồng ý tạo AC cho tất cả story mới.
- Từ chối và để placeholder, làm sau.
- Chọn một vài story cụ thể.

Dù chọn cách nào, AC sinh ra ở giai đoạn này vẫn là __draft__. Lý do: một câu AC có thể nhìn rất hợp lý nhưng chưa chắc đã phản ánh đúng chính sách, ngưỡng, quyền hạn và ví dụ biên mà PO/QA cần chốt.

Ví dụ: "Người dùng không được hủy đơn sau khi đóng gói." Câu này chỉ trở thành AC đáng tin khi nhóm đã đồng ý "đóng gói" được xác định theo trạng thái nào, ai được ngoại lệ, và thông báo cho người dùng ra sao.

Skill giúp tạo điểm bắt đầu có cấu trúc. Nó không thay thế refinement hay quyết định nghiệp vụ.

***

## 8. Điều `/userstory` KHÔNG hỏi bạn (và vì sao)

Skill không bắt BA phải trả lời ngay các câu kỹ thuật như:

- Database nào lưu dữ liệu?
- API có tên gì?
- Dev dùng framework nào?
- Cần tạo bao nhiêu bảng?

Đó là cách triển khai, không phải giá trị người dùng cần nhận. Nếu team có task kỹ thuật cần làm, hãy coi đó là task hỗ trợ hoặc enabler, thay vì viết thành một user story giả dạng.

Skill cũng không tự sinh user story nếu feature chưa có SRS. Nó sẽ từ chối và hướng dẫn:

```
/srs {feature}
```

Không có FR thật thì không có nền để chia backlog; tự bịa story dễ khiến backlog đi chệch quyết định nghiệp vụ.

Skill không tự xem mọi story là sẵn sàng cho dev. Nếu SRS còn draft, nó sẽ cảnh báo story được xây từ nguồn chưa duyệt. Nếu thiếu actor, rule, ngưỡng hoặc phụ thuộc, nó đánh OQ để nhóm refinement thay vì tự lấp chỗ trống.

Cuối cùng, skill không chia story chỉ vì có thêm màn hình, thêm role hoặc thêm FR. Những thứ đó chỉ là dấu hiệu để xem xét; trục chính vẫn là __một kết quả nghiệp vụ nhỏ nhất, trọn vẹn và có thể kiểm tra__.

***

## 9. Ví dụ thực tế

Chị __Lan__ là BA cho feature `appointment` (đặt lịch khám). SRS đã có FR về chọn bác sĩ, chọn khung giờ, kiểm tra lịch trống, ghi lịch hẹn và gửi xác nhận. Feature cũng có một số wireframe.

Chị Lan gõ:

```
/userstory appointment
```

1. Skill tìm thấy SRS của `appointment`, đọc FR, use case và màn hình có sẵn.

2. Skill không tạo ba story "làm màn chọn bác sĩ", "làm màn chọn giờ", "làm màn xác nhận". Nó nhận ra ba màn này cùng góp phần cho một outcome: bệnh nhân __đặt được lịch khám và nhận xác nhận__.

3. Skill dự thảo story `us-001`: persona là Bệnh nhân, outcome là đặt lịch khám, liên kết các FR về chọn bác sĩ, khung giờ và ghi lịch hẹn.

4. Skill tự soi INVEST. Story có giá trị và có thể kiểm tra, nhưng phát hiện SRS chưa nói rõ bệnh nhân có được đặt hai lịch trùng giờ không. Nó không tự đặt quy tắc; đánh Open Question: "Có cho phép lịch hẹn chồng chéo không?"

5. Trong phần xem trước, chị Lan thấy rõ story này có nguồn FR nào và OQ nào cần refinement. Chị xác nhận `Y`.

6. Skill tạo `appointment-story-index.md` và `us-001.md`. Story được ghi là draft, chưa tự nhận sẵn sàng phát triển.

7. Skill hỏi có tạo AC luôn không. Chị Lan chọn `Y` để tạo draft AC cho `us-001`.

8. Trong buổi refinement, chị Lan, PO và QA chốt câu hỏi về lịch chồng chéo. Sau đó họ cập nhật rule và AC. Chỉ lúc này story mới có đủ cơ sở để team cân nhắc đưa vào sprint.

***

## Xem thêm

Tài liệu gốc của skill: `.claude/skills/userstory/SKILL.md`.

Các explainer liên quan:

- `explain-skills/usecase-family.md` — __cái nhìn tổng__: `/usecase`, `/usecase-diagram`, `/userstory` liên quan với nhau thế nào.
- `explain-skills/usecase.md` — viết kịch bản chi tiết theo mục tiêu người dùng.
- `explain-skills/usecase-diagram.md` — vẽ hình tổng quan actor và phạm vi use case.
- `.claude/skills/ac/SKILL.md` — tạo hoặc rà soát acceptance criteria cho user story.
- `.claude/skills/srs/SKILL.md` — tạo SRS làm nguồn FR trước khi sinh story.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
