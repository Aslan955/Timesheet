---
type: skill-explainer
skill: ac
updated: 2026-07-14
---

# `/ac` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/ac` tạo, sửa hoặc chỉ rà soát **AC (Acceptance Criteria — tiêu chí chấp nhận)** cho một user story. AC là những điều để BA, PO, dev và QA cùng kiểm tra xem story đã tạo ra đúng kết quả nghiệp vụ hay chưa.

Ví dụ đời thường: một nhà hàng nhận đặt bàn trực tuyến. Nhu cầu không chỉ là “có nút Đặt bàn”. Kết quả cần chốt có thể là: khách đặt được bàn khi còn chỗ, và nhà hàng ghi nhận lượt đặt đó. Đó là điều mọi người có thể cùng xác nhận, dù mỗi người nhìn nó từ góc độ khác nhau.

Bạn nên dùng `/ac` khi:

* Đã có user story và muốn thêm tiêu chí chấp nhận cho story đó.
* Story đã có AC nhưng câu chữ đang mơ hồ, gộp nhiều hành vi, hoặc khó kiểm tra.
* Muốn rà soát coverage AC trước khi đưa story sang bước tiếp theo.
* Muốn chỉ ra chỗ SRS, quy tắc hay Error Matrix còn thiếu thay vì tự đoán.

Ví dụ lệnh:

```
/ac payment --story us-001
```

Bạn cũng có thể gõ `/ac` để chọn feature rồi chọn story; gõ `/ac <feature>` để chọn phạm vi cả feature, một story, hoặc một FR; hoặc dùng `/ac <feature> --fr FR-{feature}-NNN` để làm các story phủ một FR.

**Một câu để nhớ:** `/ac` chốt **kết quả nghiệp vụ có thể kiểm tra**, không viết thay toàn bộ test case.

***

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
 BẠN GÕ LỆNH
 /ac payment --story us-001
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Kiểm tra feature và user story               │
 │  Skill cần file us-NNN.md làm nơi gắn AC.             │
 │  Chưa có story → từ chối, hướng dẫn chạy /userstory.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Xác định mode và phạm vi                      │
 │  Generate để sinh mới, repair để sửa, review để chỉ   │
 │  phân tích. Yêu cầu mơ hồ cần ghi file → hỏi chốt.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Đọc nguồn theo thứ tự ưu tiên                 │
 │  SRS: FR/BR/Error Matrix là contract; sau đó là use   │
 │  case. Screen chỉ cho biết cách trình bày.             │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Tìm outcome, rule và rủi ro                   │
 │  Chỉ lấy happy path, policy, quyền, validation hay    │
 │  lỗi thật sự áp dụng cho story.                        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Hỏi làm rõ chỗ thiếu, rồi viết AC            │
 │  Chỗ nguồn thiếu mà chặn viết AC thì hỏi bạn trước;   │
 │  bạn trả lời thì dùng làm căn cứ, bỏ qua thì đánh     │
 │  Open Question. Viết Given / When / Then, gắn FR.      │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Xem diff trước khi sửa                        │
 │  Sửa một story có diff phần AC; làm cả feature có xác │
 │  nhận batch. Mode review không chỉnh file.             │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 7 — Ghi inline vào user story                     │
 │  AC nằm trong mục “Acceptance Criteria” của us-NNN.md │
 │  và giữ ID AC-NNN theo phạm vi story.                  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — AC rõ outcome, rule, rủi ro và chỗ cần hỏi
```

***

## 3. Ba mode: generate / repair / review — khi nào skill làm gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/ac` có ba cách làm việc.

* **Generate** là mode mặc định: sinh AC mới cho story chưa có AC.
* **Repair** dùng khi story đã có AC nhưng cần làm lại cho rõ, atomic và testable. Skill giữ nguyên các ID AC cũ, không đánh số lại.
* **Review** chỉ rà soát và trả findings theo mức BLOCKING, WARNING hoặc SUGGESTION. Mode này không sửa file.

**Atomic** nghĩa là một AC chỉ nên nói về một hành vi có thể xác nhận đạt hoặc chưa đạt. Ví dụ một rule về việc cho phép hủy đơn là một behavior; nếu có quy tắc tiền hoặc quyền hạn độc lập, chúng có thể cần scenario riêng.

Tuy nhiên, “tách” không phải mệnh lệnh máy móc. Câu “khách gửi đơn thành công và email xác nhận được gửi” vẫn có thể là một AC nếu email là outcome cam kết của chính giao dịch đó: gửi đơn thành công thì email bắt buộc phải được gửi. Tách hai vế khi chúng thật sự có thể pass/fail độc lập sẽ rõ hơn.

Nếu bạn yêu cầu generate nhưng story đã có AC, skill không append thêm một loạt AC dễ trùng hay mâu thuẫn ID. Nó báo story đang có bao nhiêu AC và chuyển sang repair hoặc review, để bổ sung chỗ thiếu thay vì sinh lại từ đầu.

Nếu yêu cầu cần ghi file nhưng mode chưa rõ, chẳng hạn “làm AC đi” trong khi story đã có AC, skill hỏi một câu để chốt: bạn muốn sửa hay chỉ review. Nó không tự chọn rồi ghi đè.

***

## 4. Vì sao AC viết theo "kết quả nghiệp vụ" chứ không theo thao tác click‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

AC theo **business outcome — kết quả nghiệp vụ** mô tả điều người dùng và tổ chức nhận được sau hành động, thay vì khóa chặt cách giao diện vận hành.

Ví dụ chưa đúng trọng tâm: “Người dùng bấm nút Thanh toán, nhập mã và bấm Xác nhận.” Đây chủ yếu là mô tả thao tác click và field.

Ví dụ đúng trọng tâm hơn: “Khi khách hoàn tất thanh toán hợp lệ cho đơn hàng, đơn được ghi nhận là đã thanh toán.” Câu này cho biết kết quả cần quan sát. Team vẫn có thể làm giao diện phù hợp, nhưng không hiểu nhầm thao tác màn hình là mục tiêu cuối.

Lý do rất thực tế: màn hình là cách trình bày, còn AC là cam kết về hành vi. Một màn hình có thể đổi thiết kế mà rule vẫn giữ nguyên. Ngược lại, nhìn thấy một ô nhập liệu trên màn hình không chứng minh đằng sau có policy, quyền hay xử lý lỗi nào đã được chốt.

Vì thế skill có thể liên kết AC với screen khi screen là tham chiếu có sẵn, nhưng không suy ra validation, error hay backend outcome chỉ vì screen có vẻ gợi ý điều đó. Khi spec chưa cam kết, câu trả lời đúng là Open Question chứ không phải một AC nghe có vẻ hợp lý.

***

## 5. Given / When / Then là gì

`/ac` viết AC theo **Gherkin** — một dạng câu có cấu trúc để người nghiệp vụ và người kiểm thử cùng đọc được. Keyword được viết bằng tiếng Anh, còn nội dung viết bằng tiếng Việt.

* **Given** là bối cảnh ban đầu.
* **When** là hành động hoặc sự kiện xảy ra.
* **Then** là kết quả phải quan sát được.

Ví dụ đời thường ở phòng khám:

```gherkin
Given bệnh nhân đã chọn một khung giờ còn trống
When bệnh nhân xác nhận đặt lịch
Then lịch hẹn được ghi nhận cho bệnh nhân tại khung giờ đã chọn
```

Ba dòng này không yêu cầu bạn biết hệ thống dùng công nghệ gì. Chúng giúp mọi người tách rõ điều kiện, việc xảy ra và kết quả phải đạt.

Khi có nhiều biến thể của cùng một rule, skill không lặp nhiều block gần giống nhau. Nó gom chúng dưới `Rule:`, dùng `Scenario Outline` và bảng `Examples` để thể hiện các dữ liệu hoặc trường hợp thay đổi.

Ví dụ, nếu cùng một chính sách áp dụng theo nhiều ngưỡng, việc nhóm biến thể làm người đọc thấy đây là một rule với nhiều trường hợp, không phải nhiều quy tắc rời rạc. Các keyword được dùng là `Given`, `When`, `Then`, `Rule`, `Scenario`, `Scenario Outline` và `Examples`.

***

## 6. Khi Error Matrix thiếu / spec mơ hồ, skill hỏi làm rõ trước — không tự bịa‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nguồn có thứ tự ưu tiên rõ ràng: SRS, gồm FR, BR và Error Matrix, là contract; sau đó đến use case cho hành vi; screen chỉ nói về cách trình bày. Khi các nguồn mâu thuẫn, `/ac` ưu tiên theo thứ tự này.

Điều đó đặc biệt quan trọng với lỗi. Nếu Error Matrix không nêu một lỗi, skill **không tự phát minh** error path để cho bộ AC trông đầy đủ. Nhưng nó cũng không im lặng bỏ qua. Trước tiên, skill **hỏi bạn để làm rõ**.

Cách xử lý một chỗ mơ hồ đi theo thứ tự này:

1) **Hỏi bạn trước.** Với những điểm còn thiếu mà thật sự cản trở việc viết AC, skill đặt câu hỏi bằng ngôn ngữ nghiệp vụ, ví dụ: "Đơn thanh toán thất bại thì hệ thống báo gì cho khách?", "Có giới hạn số lần thử lại không?", "Ai được phép hủy sau khi đơn đã đóng gói?". Skill hỏi theo nguyên tắc không hỏi lại điều đã có trong spec, story hay điều bạn vừa trả lời.
2) **Bạn trả lời** thì skill dùng câu trả lời đó làm căn cứ viết AC, và ghi rõ đây là quyết định nghiệp vụ bạn cung cấp (không phải điều spec đã có sẵn). Skill có thể gợi ý bạn cân nhắc bổ sung chính thức vào SRS bằng `/srs` để chốt lâu dài.
3) **Bạn bỏ qua hoặc chưa biết** thì lúc đó skill mới ghi **Open Question — câu hỏi cần làm rõ** để đưa về buổi refinement. OQ là phương án dự phòng, không phải phản xạ đầu tiên.

Skill **không mặc định đánh OQ ngay** cho mọi chỗ thiếu rồi để đó. Nó chủ động hỏi, vì nhiều lúc bạn có sẵn câu trả lời trong đầu mà spec chưa kịp ghi. Chỉ khi thật sự chưa ai chốt được thì mới thành OQ.

Trong mọi trường hợp, skill vẫn phân biệt ba loại thông tin, giống khi ghi biên bản họp:

* **Fact từ spec**: điều nguồn đã nói rõ.
* **Suy luận hợp lý**: điều có thể suy ra, và phải ghi rõ đó là suy luận.
* **Open Question**: điều chưa đủ căn cứ, cần người có trách nhiệm nghiệp vụ quyết định.

Nếu story đụng tới tiền, pháp lý hoặc an toàn mà thiếu xử lý lỗi và vẫn chưa chốt được ngay cả sau khi hỏi, OQ đó là **BLOCKING** theo Definition of Ready: không nên để team hiểu rằng thiếu xử lý lỗi vẫn được chấp nhận. Skill gợi ý bổ sung Error Matrix bằng `/srs` trước khi dev.

Có một loại "mơ hồ" mà skill **không** hỏi và cũng **không** đánh OQ: chi tiết không làm đổi kết quả nghiệp vụ, ví dụ độ dài tối đa của một ô nhập hay cách màn hình quay vòng chờ. Đó là phần test design của QA, nên skill để nó ở đó thay vì làm phiền bạn.

SRS còn mỏng hoặc chưa approved là soft gate: skill cảnh báo nhưng vẫn có thể xây AC dựa trên nội dung story. Trường hợp đó khác hoàn toàn với không có story để gắn AC.

***

## 7. Điều `/ac` KHÔNG làm (và vì sao)

Skill không tự tạo feature hay user story. AC được ghi inline vào mục `## Acceptance Criteria` trong file `docs/{feature}/userstories/us-NNN.md`; không có story thì không có nơi hợp lệ để đặt AC. Nếu chưa có các file `us-*.md`, skill từ chối rõ ràng và hướng dẫn:

```
/userstory {feature}
```

Skill không tạo một file AC riêng và cũng không regenerate toàn bộ story khi cần update. Nó chỉ thay đổi phần AC theo semantic diff, để phần nội dung còn lại của story không bị viết lại vô cớ.

Skill không suy AC validation, permission, error hay outcome hệ thống chỉ từ screen. Screen không chứng minh những rule đó đã được contract. Chỗ thiếu thì skill hỏi bạn làm rõ trước, chưa chốt được mới thành OQ — không tự bịa từ giao diện.

Skill không ép quota kiểu “mỗi category phải có một AC negative”. Nó chỉ sinh loại thật sự áp dụng: happy path, business rule/branch, error path khi lỗi là hành vi nghiệp vụ đã yêu cầu, permission khi có ràng buộc quyền thật, và validation khi ràng buộc làm đổi kết quả nghiệp vụ. Một story đơn giản có thể không cần AC negative nào; một lỗi tiền hoặc pháp lý có thể cần nhiều scenario.

Cuối cùng, skill không hỏi BA các câu kỹ thuật như database, API hay framework. Đây là tiêu chí nghiệp vụ; cách triển khai là việc khác với outcome cần chốt.

***

## 8. Ví dụ thực tế

Chị **Mai** là BA cho feature `appointment` (đặt lịch khám). Feature đã có user story `us-001` về việc bệnh nhân đặt lịch, cùng FR mô tả kiểm tra khung giờ trống và ghi nhận lịch hẹn. Chị Mai muốn có tiêu chí chấp nhận trước buổi refinement.

Chị gõ:

```
/ac appointment --story us-001
```

1) Skill tìm thấy `us-001`, nên có nơi để gắn AC. Nếu không có story này, skill sẽ không tự tạo một story trống mà route chị Mai sang `/userstory appointment`.

2) Skill xác định đây là generate vì story chưa có AC. Nó đọc FR và Error Matrix trước, rồi đọc use case. Wireframe có thể được xem như tham chiếu trình bày, nhưng không được dùng để tự suy ra rule.

3) Từ FR, skill tạo AC happy path: với một khung giờ còn trống, khi bệnh nhân xác nhận thì lịch hẹn được ghi nhận. Đây là outcome nghiệp vụ, không phải câu “bệnh nhân bấm nút Xác nhận”.

4) Chị Mai thấy SRS có rule về lịch trống, nên rule đó có scenario riêng. Skill không thêm một AC permission vì nguồn không hề có ràng buộc phân quyền cho story này.

5) Story liên quan tới lịch khám nhưng Error Matrix không nói điều gì xảy ra khi hai bệnh nhân cùng giành một khung giờ. Skill không bịa cách xử lý, nhưng cũng không lặng lẽ đánh Open Question. Nó hỏi chị Mai: "Khi khung giờ vừa bị người khác đặt mất, hệ thống báo gì cho bệnh nhân?". Chị Mai biết chính sách phòng khám nên trả lời ngay, và skill dùng câu trả lời đó để viết AC error-path, ghi rõ đây là quyết định do chị cung cấp. Với một câu hỏi khác mà chị Mai chưa chắc, chị nói "để mình hỏi lại trưởng phòng khám", nên chỗ đó mới thành Open Question. Nếu đây là feature thanh toán hoặc pháp lý mà vẫn chưa chốt được, OQ thiếu Error Matrix sẽ là BLOCKING.

6) QA đề nghị bổ sung các trường hợp tên bệnh nhân dài tối đa bao nhiêu ký tự và lúc màn hình đang tải. Chị Mai và QA phân biệt rõ: nếu các chi tiết đó không làm thay đổi outcome nghiệp vụ, chúng thuộc test design, không phải AC. QA vẫn có thể lập nhiều test từ AC đặt lịch thành công.

7) Chị Mai xem diff phần `Acceptance Criteria` trước khi đồng ý ghi. Các AC nhận ID như `AC-001`, `AC-002` trong chính file `us-001.md`. Về sau, nếu cần repair, các ID cũ được giữ nguyên; số đã mất cũng không bị đánh lại.

8) Sau khi nhóm chốt OQ và các AC, chị Mai có thể đưa story sang `/jira`, hoặc chạy lại `/ac` ở chế độ chỉ-review (nói "chỉ review AC thôi") để rà lại chất lượng mà không sửa gì.

***

## Xem thêm

Tài liệu gốc của skill: `.claude/skills/ac/SKILL.md`.

Các explainer liên quan:

* `explain-skills/userstory.md` — tạo user story (nguồn để gắn AC, chạy trước /ac).
* `explain-skills/usecase-family.md` — cái nhìn tổng về use case, user story và AC liên quan nhau thế nào.
* `.claude/skills/srs/SKILL.md` — tạo SRS (FR + Error Matrix) làm nguồn nội dung cho AC.
* `.claude/skills/jira/SKILL.md` — đẩy story + AC lên Jira sau khi chốt.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
