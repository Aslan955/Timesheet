# 07 — Tùy biến skill‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Copy skill về rồi chạy được. Nhưng chạy được không có nghĩa là vừa.
>
> Nguyên tắc của cả chương: __mô tả cái mình muốn, để AI tự tìm chỗ sửa.__ Các bạn không cần biết luật nằm ở file nào.

***

## Prompt tùy biến — dùng chung cho mọi trường hợp‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là khuôn dùng được cho hầu hết nhu cầu sửa. Điền hai chỗ:

```text
Tôi đang dùng skill /<tên-skill>.

Hiện tại: [output nó ra không ưng chỗ nào — mô tả bằng lời thường,
           dán luôn đoạn output sai nếu có]

Tôi muốn: [mô tả kết quả mong đợi]

Hãy tìm skill, template, rule và script liên quan tới skill này, xem chỗ nào
đang tạo ra hành vi đó, rồi điều chỉnh.

Trước khi sửa cho tôi biết:
1. Nguyên nhân nằm ở file nào, dòng nào
2. Sửa nó thì skill nào khác bị ảnh hưởng không
3. Có gì tuyệt đối không nên đụng vào không

Show diff trước khi ghi.
```

Ba câu hỏi cuối là phần đáng giá nhất. Chúng bắt AI __cho các bạn thấy cái giá__ trước khi sửa — vì `.claude/` là hệ thống liên kết nhau, sửa một chỗ có thể làm gãy chỗ khác.

***

## Vài ví dụ điền vào khuôn trên‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Output không giống mẫu công ty:__

```text
Tôi đang dùng skill /srs.

Hiện tại: nó viết đặc tả 12 mục.
Tôi muốn: khung 8 mục của công ty tôi — [liệt kê 8 mục].

Hãy tìm skill, template, rule liên quan rồi điều chỉnh.
Nếu mục nào bị bỏ mà skill khác đang cần, báo tôi TRƯỚC khi sửa.
Show diff.
```

__Skill hỏi quá nhiều:__

```text
Tôi đang dùng skill /brainstorm.

Hiện tại: ý tưởng nhỏ mà nó vẫn hỏi cả chục câu.
Tôi muốn: ý tưởng ngắn và đã rõ thì hỏi tối đa 3 câu rồi chốt.

Hãy tìm chỗ quy định số câu hỏi rồi thêm nhánh "nhẹ" — ĐỪNG phá chế độ sâu
hiện có. Show diff.
```

__Thêm luật của team:__

```text
Tôi đang dùng skill /srs.

Tôi muốn thêm luật: mọi yêu cầu liên quan tới thanh toán bắt buộc ghi rõ
nhà cung cấp cổng thanh toán và mã lỗi. Thiếu thì ghi open question,
không được để trống.

Hãy tìm chỗ đặt luật của skill này rồi thêm vào, kèm giải thích ngắn vì sao
(để người đọc sau hiểu). Show diff.
```

__Đổi thuật ngữ toàn dự án:__

```text
Team tôi gọi người dùng cuối là "học viên", không phải "user" hay "khách hàng".

Hãy tìm chỗ khai thuật ngữ dùng chung của dự án rồi cập nhật, để mọi skill
đều dùng đúng từ này. Đừng sửa các tài liệu đã sinh ra — tôi chỉ muốn sửa nguồn.
```

Chú ý câu cuối: nói rõ __sửa nguồn, không sửa kết quả__. Không có nó, AI đi sửa từng file tài liệu — lần chạy sau lại sai y như cũ.

***

## Sửa nguồn hay sửa kết quả — hỏi một câu là biết‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> __"Lỗi này có lặp lại ở lần chạy sau không?"__

__Có__ → sửa nguồn (skill, rule, template, hoặc thuật ngữ dùng chung).
__Không__ → sửa thẳng file tài liệu đó là xong.

Đây là chỗ hay nhầm nhất: thấy output không ưng thì sửa ngay file output, lần sau chạy lại nó sai y hệt.

***

## Khi AI lặp lại một lỗi: sửa nguyên nhân, không sửa triệu chứng‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Giả sử AI vẽ ô nhập email bị co lại trên màn hình điện thoại.

__Cách sửa dở:__ *"ô email ở màn Đăng nhập trên mobile phải rộng hết dòng."*
→ Lần sau nó làm sai y hệt với ô mật khẩu.

__Cách sửa tốt:__ *"trong form một cột trên mobile, ô nhập phải rộng hết chiều ngang khung chứa, trừ khi design system quy định khác."*
→ Luật này dùng được cho mọi ô nhập, mọi form.

Thêm hai câu này vào cuối prompt tùy biến khi gặp lỗi lặp:

```text
Đề xuất cách sửa BAO PHỦ được các trường hợp tương tự, không chỉ ca này.
Sau khi sửa, chạy lại ca lỗi VÀ ít nhất hai ca khác.
```

> Mọi lỗi gặp khi test đều nên biến thành một dòng luật trong skill. Sửa bằng miệng trong chat thì phiên sau lỗi tái diễn.

***

## Gỡ ràng buộc thứ tự giữa các skill

Một dạng sửa hay cần riêng: skill __từ chối chạy__ vì thiếu output của skill khác — mà luồng của các bạn không đi qua bước đó.

Ví dụ `/userstory` đòi có đặc tả trước, `/prototype-html` đòi có wireframe ASCII trước. Đó là __lựa chọn thiết kế__, không phải luật của Claude Code — sửa được.

Cách đúng là đổi thành __hai chế độ__ thay vì bỏ hẳn. [Chương 03, mục "Bước 3b"](03-chon-pipeline-cua-ban.md) có prompt sẵn và ba ca test kèm theo.

***

## Tạo skill mới

### Khi nào một việc đáng thành skill

Đừng skill hoá mọi thứ. Nhìn đủ __năm điều kiện__:

| Điều kiện | Câu hỏi |
|---|---|
| Lặp lại | Việc này làm thường xuyên không? |
| Ổn định | Quy trình có tương đối giống nhau mỗi lần không? |
| Output rõ | Có template hoặc format mong muốn không? |
| Rule rõ | Có quy tắc để tránh lỗi không? |
| Review được | Có cách đánh giá output đúng/sai không? |

Đủ năm → đáng làm skill. Thiếu một → cứ dùng prompt thường.

Ví dụ nên: viết user story và AC từ đặc tả theo cùng format mỗi tuần.
Ví dụ không nên: soạn email trả lời khách hàng đang khiếu nại — tình huống quá riêng, phán đoán của người xử lý quan trọng hơn template.

### Prompt tạo skill mới‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
Tôi muốn tạo skill /<tên> cho việc: [mô tả việc].

Quy trình tay hiện tại của tôi:
1. [bước 1]
2. [bước 2]
...

Hãy đọc vài SKILL.md có sẵn trong bộ để nắm khuôn, rồi viết skill mới theo
đúng khuôn đó.

Yêu cầu:
- Map từng bước trong quy trình tay của tôi thành một pha trong skill.
  Bước nào tôi phải "gửi ai đó duyệt" thì đó là điểm dừng chờ tôi xác nhận.
- Chỗ nào thiếu thông tin thì ghi open question, KHÔNG được tự suy luận.
- Tuân đúng các rule dùng chung của bộ (cổng duyệt trước khi ghi file,
  không hỏi bằng ngôn ngữ kỹ thuật).

Cho tôi xem trước, chưa tạo file.
```

Điểm mấu chốt: __khai quy trình tay của mình__. Không có nó, AI tạo một skill chung chung, không giống cách các bạn làm.

### Sau khi tạo, phải test ba ca

| Ca | Kỳ vọng |
|---|---|
| Input đầy đủ | Chạy trơn, output đúng chỗ |
| Input __thiếu__ một thông tin quan trọng | __Dừng hỏi__ hoặc ghi open question — không tự bịa |
| Hai tài liệu nguồn __mâu thuẫn__ nhau | Báo mâu thuẫn — không tự chọn một cái rồi im lặng |

Ca 2 và 3 mới là phép thử thật. Nếu AI tự điền hoặc tự chọn, skill đang thiếu luật — quay lại bổ sung.

***

## Gộp hai skill quá giống nhau

```text
/urd và /brd với tôi gần như luôn làm cùng lúc.

So sánh hai phương án: (a) gộp thành một skill, (b) giữ 2 nhưng cho /urd hỏi
luôn phần business.

Khuyến nghị một cái + nêu rủi ro. Đặc biệt: skill nào phía sau đang đọc output
của chúng, gộp có làm gãy không?

Chưa sửa gì — tôi muốn xem phân tích trước.
```

***

## Chuyển skill sang tiếng Anh

Như đã nói ở [chương 00](00-doc-cai-nay-truoc.md): skill trong bộ này để tiếng Việt cho dễ đọc dễ sửa. Khi đưa vào dự án thật, tiếng Anh gọn token hơn.

__Làm việc này SAU CÙNG__ — sau khi đã chọn xong skill giữ lại và sửa chúng cho vừa. Dịch trước thì mỗi lần sửa lại phải dịch lại.

```text
Dịch skill /<tên> sang tiếng Anh.

Giữ nguyên: cấu trúc mục, mọi đường dẫn file, cú pháp lệnh, và ý nghĩa từng
luật — đừng rút gọn cho "gọn hơn".

Riêng phần mô tả skill: dịch và tối ưu cho ngắn, nhưng vẫn phải phân biệt được
với các skill gần nghĩa.

Làm từng skill một. Show diff.
```

> Team vẫn đọc tiếng Việt? Có thể để __skill tiếng Anh__ nhưng __output tiếng Việt__ — thêm một dòng luật: *"Mọi nội dung ghi ra file phải bằng tiếng Việt."*

***

## Khi có bản BA-Kit mới

Các bạn đã sửa skill cho hợp team. Ba tháng sau có bản mới. Làm gì?

__Đừng copy đè__ — là xoá sạch mọi thứ đã sửa.

Chuẩn bị từ trước: khi copy skill về lần đầu, __commit bản gốc trước khi sửa gì cả__. Sau này mới có mốc để so.

```text
Tôi đang dùng một số skill từ BA-Kit, đã tùy biến cho team.
Bản gốc tôi từng copy về nằm ở commit [hash].
Bản BA-Kit mới ở [đường dẫn].

Với mỗi skill tôi đang dùng, so BA CHIỀU: bản gốc cũ / bản gốc mới / bản tôi
đang dùng. Rồi lập bảng:
| skill | bản mới đổi gì | tôi đã sửa gì | có xung đột không | khuyến nghị |

Ưu tiên rõ:
- Bản mới sửa mà tôi KHÔNG động tới → nên lấy về
- Tôi đã sửa mà bản mới không động tới → giữ của tôi
- CẢ HAI cùng sửa → báo tôi quyết từng cái, đừng tự chọn

Chưa ghi gì — đưa bảng trước.
```

Làm từng skill một, chạy thử rồi mới sang cái kế.

> Nếu đã sửa rất nhiều, có lúc __không nâng cấp là lựa chọn đúng__. Skill đang chạy tốt cho team thì bản mới của người khác chưa chắc tốt hơn cho các bạn.

***

## Những lỗi hay gặp

| Lỗi | Hậu quả | Cách tránh |
|---|---|---|
| Sửa file tài liệu thay vì sửa nguồn | Lần sau chạy lại sai y cũ | Hỏi "lỗi này có lặp lại không?" |
| Nhét quy định riêng của team vào rule dùng chung | Skill khác lãnh đủ | Quy định riêng → đặt trong chính skill đó |
| Hard-code đường dẫn, tên dự án, mã ID | Mang sang dự án khác là gãy | Để ở `CLAUDE.md` hoặc thư mục dùng chung |
| Sửa lỗi bằng miệng trong chat | Phiên sau lỗi tái diễn | Mọi fix đều ghi vào luật của skill |
| Bỏ hẳn một mục thay vì chuyển nó đi | Mất truy vết | Chuyển sang chỗ khác + để lại liên kết |
| Tin output đã sinh là đúng | Sai lan xuống toàn bộ tài liệu sau | Người xác minh, có bằng chứng |

***

## Lưới an toàn

Trước khi sửa nhiều, nhờ AI chụp ảnh an toàn:

```
Commit hết những gì đang có giúp tôi, ghi chú là "trước khi tùy biến skill".
Rồi tạo nhánh riêng để tôi thử nghiệm.
```

Hỏng thì:

```
Hoàn tác mọi thay đổi chưa commit giúp tôi — cho tôi xem danh sách file
sẽ bị xoá trước khi làm.
```

Sau khi sửa skill, nhờ AI kiểm nhanh:

```
Kiểm giúp tôi skill vừa sửa: phần khai báo đầu file còn đúng cú pháp không,
các đường dẫn nó tham chiếu có tồn tại không, và rule dùng chung có làm hỏng
skill khác không.
```

***

## Tóm tắt

* __Mô tả cái mình muốn, để AI tự tìm chỗ sửa.__ Không cần biết luật nằm ở file nào.
* Prompt tùy biến luôn có ba câu hỏi: __nguyên nhân ở đâu__, __ảnh hưởng gì__, __gì không được đụng__.
* Hỏi *"lỗi này có lặp lại không?"* để biết nên __sửa nguồn__ hay __sửa kết quả__.
* Lỗi lặp → sửa nguyên nhân bằng luật __bao phủ được ca tương tự__, không vá riêng ca đó.
* Một việc đáng thành skill khi đủ __năm điều kiện__. Tạo skill mới phải __khai quy trình tay của mình__, rồi test __ba ca__ (đủ / thiếu / mâu thuẫn).
* Dịch sang tiếng Anh __sau cùng__.
* __Commit bản gốc trước khi sửa__ — sau này có bản mới mới so được ba chiều.

***

Chương tiếp: [08 — Mang sang Codex, Antigravity và agent khác](08-mang-sang-codex-antigravity.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
