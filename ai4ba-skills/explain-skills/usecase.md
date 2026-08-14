---
type: skill-explainer
skill: usecase
updated: 2026-07-14
---

# `/usecase` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/usecase` dùng để viết __use case — kịch bản người dùng__ cho một tính năng. Mỗi use case kể rõ một người đạt được __một mục tiêu nghiệp vụ có ý nghĩa__ như thế nào: bắt đầu từ đâu, cần điều kiện gì, thành công thì kết quả nào phải tồn tại, và gặp lỗi thì hệ thống vẫn phải bảo vệ điều gì.

Ví dụ đời thường: chị Lan đặt đồ ăn. Mục tiêu của chị không phải là "bấm nút chọn món", cũng không phải "xác thực giỏ hàng". Mục tiêu là __đặt được đơn hàng__. Việc chọn món, kiểm tra giỏ, thanh toán… là các bước hoặc nhánh trong hành trình đạt mục tiêu đó.

Bạn nên dùng `/usecase` khi:

- Muốn __khám phá nghiệp vụ sớm__: dựng ra các kịch bản người dùng để cả nhóm cùng hình dung tính năng, trước khi chốt yêu cầu.
- Đã có SRS và muốn __biến các yêu cầu FR thành kịch bản dễ đọc, dễ review__.
- Cần thống nhất với stakeholder: "người dùng sẽ đạt mục tiêu này theo những điều kiện nào?"
- Tester cần biết thành công thực sự trông như thế nào, kể cả khi có lỗi.
- Có nhiều yêu cầu rời rạc nhưng muốn gom chúng lại theo mục tiêu của người dùng.

Ví dụ lệnh:

```
/usecase payment
```

Hoặc chỉ tập trung vào một yêu cầu:

```
/usecase payment --from-fr FR-payment-001
```

Hoặc tạo cho tất cả mục tiêu phù hợp trong feature:

```
/usecase payment --all
```

__Một câu để nhớ:__ `/usecase` viết "một người hoàn thành một việc có giá trị" — không phải liệt kê từng nút bấm hay tách mỗi yêu cầu thành một file.

***

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
 BẠN GÕ LỆNH
 /usecase payment
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Xem đã có SRS chưa → chọn cách làm            │
 │  CÓ SRS  → chế độ "diễn giải": đọc FR làm nguồn.       │
 │  CHƯA có → chế độ "khám phá": hỏi bạn về nghiệp vụ.    │
 │  (Không từ chối khi chưa có SRS — use case viết sớm   │
 │   để khám phá là việc bình thường của BA.)            │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Tìm các mục tiêu của người dùng              │
 │  Có SRS: đọc FR, luồng, màn hình rồi gom thành các    │
 │   mục tiêu nghiệp vụ có ý nghĩa.                      │
 │  Chưa có SRS: hỏi bạn (hoặc đọc ghi chú ý tưởng/URD)  │
 │   để lấy người dùng, mục tiêu, các bước.              │
 │  Cả hai: không tự coi "1 FR = 1 use case".            │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Lọc đúng "mức mục tiêu"                       │
 │  Việc con như đăng nhập/kiểm giỏ → thành bước.        │
 │  Mục tiêu quá rộng như "Quản lý đơn hàng" → tách ra.  │
 │  Chỉ mục tiêu hoàn thành trong một phiên mới vào UC.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Đưa danh sách để bạn chọn                     │
 │  Skill nêu actor, mục tiêu, FR liên quan và nguồn.    │
 │  Bạn chọn mục nào cần viết: một số, tất cả, hoặc hủy. │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Xem trước kế hoạch ghi file                   │
 │  Skill cho biết sẽ tạo/cập nhật file nào và nội dung  │
 │  chính. Bạn đồng ý (Y) thì mới ghi tài liệu.          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Viết use case đầy đủ                          │
 │  Mỗi mục tiêu có một file uc-*.md: điều kiện, đường   │
 │  chuẩn, nhánh lỗi và kết quả cần bảo đảm.             │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 7 — Cập nhật bảng theo dõi chung                  │
 │  Skill cập nhật index: UC liên quan FR nào, màn hình, │
 │  mã lỗi và câu hỏi mở nào.                             │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có kịch bản chi tiết và bảng truy vết
```

***

## 3. Vì sao phải chọn đúng "sea-level"?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trong skill này có một cách gọi là __sea-level__. Nghe có vẻ học thuật, nhưng ý rất đơn giản: một use case phải là một mục tiêu mà người dùng có thể hoàn thành trong __một phiên làm việc__ và rời đi với một kết quả có ý nghĩa.

Hãy hình dung một chuyến đi biển:

- Việc rất nhỏ như "buộc dây giày" giống __việc con__. Nó cần thiết, nhưng không phải lý do bạn thực hiện cả chuyến đi.
- "Đi tham quan một hòn đảo" là mục tiêu vừa tầm: có khởi đầu, quá trình và kết quả.
- "Quản lý toàn bộ du lịch Việt Nam" thì quá rộng, cần tách thành nhiều hành trình nhỏ hơn.

Trong use case cũng vậy:

- "Đặt đơn hàng" hoặc "Gửi yêu cầu hoàn tiền" thường là mục tiêu vừa tầm.
- "Đăng nhập", "kiểm tra giỏ hàng", "gửi email" thường là việc con; chúng xuất hiện như một bước hoặc một nhánh của mục tiêu lớn hơn.
- "Quản lý đơn hàng" quá rộng; có thể phải tách thành "Xem đơn", "Hủy đơn", "Yêu cầu hoàn tiền"…

Vì thế, `/usecase` không áp dụng công thức máy móc "một FR tạo một use case". Một mục tiêu như "Đặt đơn hàng" có thể cần nhiều FR cùng phối hợp. Ngược lại, một FR chỉ có thể là một quy tắc nhỏ trong use case đó.

Câu tự kiểm rất hữu ích là: __"Sau khi xong, người này có rời hệ thống với một kết quả nghiệp vụ đáng kể không?"__ Nếu câu trả lời là có, đó có thể là use case.

***

## 4. Một use case đầy đủ gồm những gì, và vì sao cần tách rõ?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/usecase` viết theo dạng __fully-dressed — đầy đủ thành phần__. Bạn có thể xem nó như một phiếu hướng dẫn nghiệp vụ kỹ lưỡng, không phải một đoạn văn kể chuyện chung chung.

Một file use case gồm:

- __Scope__: phạm vi hệ thống nào chịu trách nhiệm.
- __Level__: mức mục tiêu; với use case trong catalog này là sea-level.
- __Primary Actor__: người hoặc hệ thống bên ngoài có mục tiêu chính.
- __Trigger__: chuyện gì khởi động kịch bản.
- __Preconditions__: điều gì phải đúng trước khi bắt đầu.
- __Minimal Guarantee__: nếu thất bại thì điều tối thiểu nào vẫn được bảo vệ.
- __Success Guarantee__: nếu thành công thì trạng thái nghiệp vụ nào phải tồn tại.
- __Main Success Scenario__: đường chuẩn, đánh số từng bước.
- __Extensions__: các nhánh rẽ, ngoại lệ và lỗi.
- __Related Requirements__: các yêu cầu FR/BR liên quan.

Cách tách này giống như hướng dẫn làm thủ tục ở sân bay. "Đường chuẩn" là lúc giấy tờ đầy đủ và bạn đi qua từng quầy. "Nhánh rẽ" là khi hộ chiếu hết hạn, hành lý quá cân hoặc chuyến bay bị đổi. Nếu trộn tất cả vào một đoạn, người đọc sẽ khó biết đường nào là bình thường và đường nào chỉ xảy ra trong một điều kiện đặc biệt.

Do đó, __Main Success Scenario__ chỉ giữ đường đi chuẩn từ lúc bắt đầu đến khi đạt kết quả. Không nhồi những câu "nếu… thì…" vào đây. Các nhánh nằm riêng ở __Extensions__, gắn vào đúng số bước, ví dụ:

- `2a`: tại bước 2, giấy tờ thiếu.
- `2a1`: hệ thống thông báo giấy tờ nào thiếu.
- `2a2`: người dùng bổ sung rồi quay lại bước 2.

Nhờ vậy, BA, stakeholder và tester cùng nhìn vào một cấu trúc rõ ràng: đường chuẩn là gì, lỗi xảy ra ở đâu, xử lý xong thì quay lại hay kết thúc.

***

## 5. "Guarantee" quan trọng thế nào? Nó là đáp án để kiểm tra

__Guarantee — điều bảo đảm__ là phần rất quan trọng. Nó không phải câu "hệ thống hiển thị thông báo thành công", vì thấy một màn hình chưa chứng minh nghiệp vụ đã thật sự đúng.

Hãy hình dung bạn chuyển khoản. Thứ bạn cần không phải chỉ là màn hình có chữ "Thành công", mà là:

- tiền được ghi nhận đúng giao dịch;
- số dư không bị trừ hai lần;
- có dấu vết để tra cứu khi cần.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trong use case, __Success Guarantee__ mô tả trạng thái nghiệp vụ có thể quan sát được sau khi thành công. Ví dụ: "Yêu cầu hoàn tiền được tạo ở trạng thái Đã tiếp nhận và có lịch sử ghi nhận."

Còn __Minimal Guarantee__ trả lời: nếu có lỗi, hệ thống tối thiểu phải giữ được điều gì? Ví dụ: "Không tạo yêu cầu dở dang", "Không thu tiền hai lần", hoặc "Không làm mất dữ liệu người dùng đã nhập."

Đây là lý do skill coi guarantee như một __test oracle — chuẩn để đối chiếu khi kiểm tra__. Tester không cần đoán "thế nào mới gọi là pass"; họ đối chiếu với trạng thái đã cam kết trong use case.

***

## 6. Kết quả nằm ở đâu, và vì sao có cả file riêng lẫn file index?

Mỗi use case được ghi thành một file riêng:

```
docs/{feature}/usecases/uc-{muc-tieu}.md
```

Ví dụ:

```
docs/payment/usecases/uc-submit-refund-claim.md
```

File này không có phần đầu kỹ thuật rườm rà. Nó tập trung hoàn toàn vào kịch bản nghiệp vụ để người đọc có thể review độc lập.

Song song đó, skill duy trì một file index:

```
docs/{feature}/usecases/{feature}-usecase-index.md
```

Bạn có thể coi index như __sổ mục lục kiêm bảng đối chiếu__. Mỗi dòng cho biết:

- use case nào;
- actor nào thực hiện;
- liên quan FR nào;
- dùng hoặc ảnh hưởng màn hình nào;
- có mã lỗi nào;
- còn câu hỏi mở nào;
- mức ưu tiên và trạng thái hiện tại.

Cách này giống hồ sơ bệnh án: từng phiếu khám chứa chi tiết một lần khám, còn danh mục tổng giúp bạn biết nhanh toàn bộ lịch sử và mối liên hệ.

Ở __chế độ khám phá__ (chưa có SRS), các cột "liên quan FR nào" và "có mã lỗi nào" tạm để trống (chưa có yêu cầu chính thức để trỏ tới), còn câu hỏi mở được ghi tạm ngay trong bảng index. Khi bạn chạy `/srs` để dựng yêu cầu rồi gọi lại `/usecase`, skill sẽ __tự điền__ các cột này và chuyển câu hỏi mở về SRS.

Một điểm quan trọng: khi đã có SRS, __câu hỏi mở (Open Question/OQ) sống chính thức ở SRS__. Use case chỉ trỏ đến câu hỏi đó trong bảng index, không chép lại nhiều nơi. Như vậy khi đã có câu trả lời, nhóm chỉ cần cập nhật một nguồn thay vì đi tìm và sửa nhiều bản sao.

***

## 7. Điều `/usecase` KHÔNG hỏi bạn (và vì sao)

`/usecase` dùng ngôn ngữ nghiệp vụ. Nó sẽ không bắt chị Lan trả lời những câu thuộc cách lập trình như:

- Dữ liệu lưu ở bảng nào?
- API tên gì?
- Nút bấm gọi hàm nào?
- Hệ thống dùng công nghệ gì để kiểm tra?

Những câu đó có thể cần ở tài liệu kỹ thuật khác, nhưng không phải điều cần thiết để xác định __người nào đạt mục tiêu gì, theo điều kiện nào và kết quả nào được bảo đảm__.

Skill cũng __không tự bịa__ những con số hay quy tắc nghiệp vụ mà nguồn chưa nói rõ — dù ở chế độ nào. Nếu chưa biết chắc "thời hạn hoàn tiền là bao nhiêu ngày", nó không đoán đại một con số, mà __đánh dấu câu hỏi mở__ để bạn (hoặc PO) làm rõ sau.

Điểm khác biệt của `/usecase` so với các lệnh cùng nhóm (`/userstory`, `/usecase-diagram`): __nó KHÔNG bắt bạn phải có SRS trước.__ Vì viết use case sớm để khám phá nghiệp vụ là một cách làm chuẩn của BA. Khi chưa có SRS, skill chuyển sang chế độ "khám phá" — hỏi bạn về người dùng, mục tiêu, các bước và tình huống lỗi — rồi viết use case nháp (chưa gắn mã FR/mã lỗi, vì chưa có). Sau đó nó gợi ý bạn chạy:

```
/srs {feature}
```

để dựng ra các yêu cầu chính thức (FR) __từ chính các use case này__; rồi gọi lại `/usecase` một lần nữa để nó tự điền các liên kết truy vết. Đây là vòng khép kín: khám phá bằng use case → hình thức hóa bằng SRS → quay lại bổ sung liên kết.

Nếu SRS đã có nhưng còn ở dạng nháp, skill sẽ cảnh báo để bạn biết use case cũng cần được review lại khi SRS thay đổi — nhưng vẫn viết bình thường.

Cuối cùng, `/usecase` không nhét sơ đồ vào file use case. Use case là bản "cam kết actor–mục tiêu"; sơ đồ luồng, sơ đồ trạng thái hay sơ đồ tương tác có mục đích khác. Khi cần, hãy dùng `/sequence`, `/activity` hoặc `/state` để giữ mỗi tài liệu ở đúng mức chi tiết.

***

## 8. Ví dụ thực tế

Chị __Lan__ là BA của feature `refund` (hoàn tiền). SRS đã có các FR về việc khách gửi yêu cầu hoàn tiền, hệ thống kiểm điều kiện, lưu yêu cầu và thông báo kết quả.

Chị Lan gõ:

```
/usecase refund
```

1) Skill tìm thấy SRS của `refund`, đọc FR, luồng và các màn hình liên quan.

2) Skill nhận ra "Gửi yêu cầu hoàn tiền" là một mục tiêu sea-level: khách có thể hoàn thành trong một phiên và nhận được kết quả có ý nghĩa.

3) Skill cũng thấy "Kiểm tra chứng từ" và "Xác thực đơn hàng" chỉ là việc con. Nó ghi rõ chúng sẽ là bước hoặc nhánh trong use case, không tạo file riêng cho từng việc nhỏ.

4) Skill đưa chị Lan xem danh sách: "Gửi yêu cầu hoàn tiền — Khách hàng — liên quan FR-refund-001, FR-refund-002". Chị chọn mục này.

5) Skill cho xem kế hoạch: tạo file `uc-submit-refund-claim.md` và cập nhật `refund-usecase-index.md`. Chị Lan gõ `Y`.

6) Trong use case, đường chuẩn ghi: khách gửi yêu cầu, hệ thống kiểm điều kiện, hệ thống ghi nhận, hệ thống xác nhận tiếp nhận. Nhánh `2a` mô tả trường hợp quá hạn hoàn tiền; nhánh `2b` mô tả thiếu chứng từ.

7) Skill ghi Success Guarantee: "Yêu cầu hoàn tiền được ghi nhận ở trạng thái Đã tiếp nhận." Minimal Guarantee: "Không tạo yêu cầu hoàn tiền khi điều kiện không hợp lệ."

8) Skill cập nhật index, liên kết use case với FR, màn hình yêu cầu hoàn tiền, mã lỗi liên quan và các OQ còn mở ở SRS.

Sau đó, chị Lan gửi file cho PO và QA. PO xem có đúng chính sách hoàn tiền không; QA có sẵn tiêu chuẩn để nghĩ test case; dev hiểu mục tiêu và các nhánh nghiệp vụ mà không cần suy đoán từ vài dòng FR rời rạc.

***

## Xem thêm

Tài liệu gốc của skill: `.claude/skills/usecase/SKILL.md`.

Các explainer liên quan:

- `explain-skills/usecase-family.md` — __cái nhìn tổng__: `/usecase`, `/usecase-diagram`, `/userstory` liên quan với nhau thế nào.
- `explain-skills/usecase-diagram.md` — khi cần __hình tổng quan__ ai làm được việc gì trong phạm vi feature.
- `explain-skills/userstory.md` — khi cần chuyển yêu cầu/use case thành các lát cắt công việc cho backlog.
- `.claude/skills/sequence/SKILL.md`, `.claude/skills/activity/SKILL.md`, `.claude/skills/state/SKILL.md` — các lệnh vẽ sơ đồ cho luồng hoặc vòng đời, không nhét vào use case text.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
