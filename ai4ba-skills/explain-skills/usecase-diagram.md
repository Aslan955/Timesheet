---
type: skill-explainer
skill: usecase-diagram
updated: 2026-08-01
---

# `/usecase-diagram` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/usecase-diagram` vẽ __use case diagram — sơ đồ tổng quan về người tham gia và việc họ làm được__ trong một feature.

Nếu `/usecase` là bản mô tả chi tiết từng kịch bản, thì `/usecase-diagram` là bức tranh treo trên tường: ai đứng ngoài hệ thống, trong hệ thống có những việc chính nào, và phạm vi feature nằm ở đâu.

Ví dụ đời thường: một nhà hàng có khách, thu ngân và đối tác giao hàng. Sơ đồ tổng quan cho thấy:

- Khách có thể đặt món, theo dõi đơn.
- Thu ngân có thể xác nhận thanh toán.
- Đối tác giao hàng có thể nhận thông tin giao đơn.

Nó không kể chi tiết từng bước đặt món, cũng không mô tả màn hình nào xuất hiện trước. Mục đích là để mọi người cùng hiểu __phạm vi__ trước khi đi sâu.

Bạn nên dùng `/usecase-diagram` khi:

- Chuẩn bị kickoff với stakeholder và cần một hình nhìn nhanh.
- Muốn xác nhận: "trong feature này ai làm được gì?"
- Feature có nhiều actor hoặc nhiều mục tiêu, đọc bảng chữ bắt đầu khó hình dung.
- Đã có use case index hoặc SRS để làm nguồn thông tin thật.

Ví dụ lệnh:

```
/usecase-diagram --feature payment
```

__Một câu để nhớ:__ `/usecase-diagram` vẽ bản đồ phạm vi: __ai ở ngoài hệ thống, việc gì ở trong hệ thống__ — chứ không kể chi tiết từng bước của một kịch bản.

---

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```
 BẠN GÕ LỆNH
 /usecase-diagram --feature payment
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Tìm đúng feature và nguồn có sẵn             │
 │  Skill tìm use case index hoặc SRS của feature.       │
 │  Thiếu cả hai → từ chối, hướng dẫn chạy /usecase      │
 │  hoặc /srs trước; không tự nghĩ ra actor/use case.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Gom actor và use case                         │
 │  Đọc index, file use case, URD và SRS để tìm:         │
 │  ai tham gia, họ làm gì, có hệ thống bên ngoài nào.   │
 │  Skill đưa danh sách để bạn xác nhận hoặc sửa.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Xác định phạm vi và nhóm thật                 │
 │  Mọi use case nằm trong khung "System: {feature}".    │
 │  Chỉ chia nhóm khi có domain thật như User/Admin.     │
 │  Không chia nhóm chỉ vì số lượng nhiều.               │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Kiểm tra quan hệ đặc biệt                     │
 │  Include/extend/generalization chỉ được vẽ khi văn    │
 │  bản nguồn chứng minh được và giải thích được lý do.  │
 │  Không chắc → chỉ nối actor với use case.             │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Xem trước kế hoạch rồi mới ghi                │
 │  Skill nêu số actor, use case, nhóm và quan hệ.       │
 │  Bạn đồng ý (Y) thì mới tạo hoặc cập nhật file.       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — MÁY CHẤM NGỮ PHÁP (chặn trước khi vẽ)        │
 │  Skill tạo file nguồn .puml, rồi cho một chương trình │
 │  kiểm tra tự động soi từng dòng: nét nối actor có     │
 │  đúng kiểu không, <<include>>/<<extend>> có vẽ đúng   │
 │  chiều không, có khung ranh giới chưa (xem Mục 7).    │
 │  SAI → DỪNG, không render. Sửa xong mới đi tiếp.      │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 7 — Render thành ảnh                              │
 │  Gửi nội dung sang plantuml.com để ra ảnh .svg.       │
 │  Ảnh lỗi thì tự sửa tối đa 2 lượt.                    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 8 — Tự soi nghiệp vụ + cập nhật index             │
 │  Máy chỉ chấm được ngữ pháp, KHÔNG chấm được đúng     │
 │  nghiệp vụ — nên skill tự soi lại: actor có trùng vai │
 │  không, quan hệ có khớp mô tả use case không.         │
 │  Ảnh cùng bảng Actors/Relationships được nhúng vào    │
 │  file use case index của feature.                     │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có file nguồn, ảnh SVG và trang tổng quan
```

---

## 3. Vì sao sơ đồ này khác `/usecase`?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Hai skill nói về cùng một feature nhưng trả lời hai câu hỏi khác nhau.

`/usecase-diagram` trả lời: __"Ai có thể làm những việc gì trong phạm vi này?"__

`/usecase` trả lời: __"Để hoàn thành một mục tiêu cụ thể, điều gì xảy ra theo đường chuẩn, khi lỗi thì sao, và kết quả phải được bảo đảm là gì?"__

Hãy hình dung một trung tâm thương mại:

- Sơ đồ use case là sơ đồ tầng: khách vào khu nào, nhân viên vào khu nào, có những dịch vụ chính nào. Nó giúp người mới không bị lạc.
- Use case text là quy trình chi tiết để đổi trả hàng: cần hóa đơn gì, nếu thiếu hóa đơn xử lý ra sao, thành công thì chứng từ nào được cập nhật.

Vì vậy, use case diagram rất hữu ích cho kickoff và trao đổi scope với stakeholder, nhưng không thay thế được use case chi tiết, flow hay acceptance criteria. Một hình có thể "đẹp" và vẫn thiếu quy tắc nghiệp vụ; skill không coi việc render ra ảnh là bằng chứng rằng nghiệp vụ đã đúng.

---

## 4. Vì sao phải có một khung ranh giới hệ thống?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trong sơ đồ, tất cả use case bắt buộc nằm trong một khung tên dạng:

```
System: {feature}
```

Các actor — người dùng, admin, hoặc hệ thống bên ngoài như cổng thanh toán — đứng __ngoài__ khung.

Đây là một quy tắc nhỏ nhưng rất quan trọng. Nó giống bản vẽ mặt bằng một căn hộ: phải có đường bao căn hộ thì mới biết phòng nào thuộc căn hộ, hành lang nào là phần chung và khách đứng ở đâu.

Nếu không có khung này, stakeholder dễ hiểu nhầm:

- Việc nào là trách nhiệm của feature?
- Việc nào do hệ thống bên ngoài làm?
- Có thứ gì đang bị vẽ vào nhưng thực tế không thuộc scope?

Ví dụ, "Google OAuth" hay "cổng thanh toán" có thể xuất hiện trong sơ đồ như actor bên ngoài. Điều đó không có nghĩa hệ thống của bạn làm thay Google hoặc ngân hàng; nó chỉ cho thấy feature có trao đổi với họ.

Khi feature có các domain thật sự khác nhau, skill có thể chia các use case thành nhóm như "Người dùng", "Quản trị", "Tích hợp". Nhưng skill không chia nhóm chỉ vì có nhiều use case. Đếm số lượng giống như chia tủ hồ sơ vì giấy nhiều; điều cần xem là chúng có thuộc các nhóm nghiệp vụ khác nhau hay không.

---

## 5. Vì sao không tự vẽ `include`, `extend` và các quan hệ "có vẻ hợp lý"?

Sơ đồ có thể có các quan hệ đặc biệt như:

- __include__: một hành vi luôn bắt buộc để use case chính hoàn thành.
- __extend__: một hành vi bổ sung chỉ xảy ra trong điều kiện cụ thể.
- __generalization__: một use case là dạng chuyên biệt thật sự của use case khác.

Các tên này không phải để làm sơ đồ trông chuyên nghiệp hơn. Vẽ sai sẽ khiến người đọc hiểu sai quan hệ nghiệp vụ.

Ví dụ, hai việc cùng xuất hiện ở màn hình đăng nhập không tự động là `extend`. Một lỗi xảy ra trong quá trình thanh toán cũng không tự động thành `extend`. Skill chỉ vẽ quan hệ này khi tìm thấy bằng chứng từ use case text hoặc SRS, và giải thích được lý do.

Mặc định an toàn là chỉ nối actor với use case bằng đường không hướng: người này __tham gia__ vào việc này. Chưa có đủ bằng chứng thì không thêm mũi tên đặc biệt.

Điều này giống như sơ đồ gia phả: thấy hai người cùng họ không có nghĩa được tự ghi ngay quan hệ cha–con. Cần có căn cứ trước.

Một lưu ý nhẹ: hướng mũi tên của `include` và `extend` rất hay bị đảo. `include` đi từ use case chính đến hành vi luôn cần; `extend` đi từ hành vi bổ sung về use case nền. Vì dễ sai và dễ gây hiểu nhầm, skill thận trọng hơn là "vẽ cho đủ ký hiệu".

---

## 6. Vì sao dùng PlantUML và vì sao cần biết chuyện dữ liệu đi qua internet?

Skill dùng __PlantUML native__ — công cụ có ký hiệu chuẩn cho actor, use case và nhóm phạm vi. Đây không phải một sơ đồ luồng được "giả làm" use case diagram.

Kết quả gồm hai file:

```
docs/{feature}/usecases/{feature}-usecase-diagram.puml
docs/{feature}/usecases/{feature}-usecase-diagram.svg
```

- `.puml` là nguồn gốc bằng chữ. Khi cần sửa, skill sửa file này.
- `.svg` là hình đã render để bạn mở bằng browser, IDE hoặc Obsidian.

Hiện tại skill render bằng server công khai `plantuml.com`. Điều đó nghĩa là tên actor và use case trong sơ đồ được gửi qua internet mỗi lần vẽ ảnh. Với đa số sơ đồ nghiệp vụ thông thường, đây là thông tin cần biết để quyết định; nếu nội dung nhạy cảm, nhóm cần chọn phương án render nội bộ thay vì dùng luồng hiện tại.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Skill không hiển thị ảnh trực tiếp trong chat để bạn sửa qua nhiều vòng. Sau khi hoàn thành, bạn xem file `.svg`; nếu muốn đổi, gọi lại `/usecase-diagram` và nói rõ cần đổi gì. Skill sẽ hiểu đó là cập nhật, cho xem phần thay đổi trước khi ghi.

---

## 7. Có ảnh đẹp KHÔNG có nghĩa là vẽ đúng — nên có máy chấm ngữ pháp

Đây là điều dễ gây hiểu nhầm nhất, và nó xuất phát từ một sự cố có thật.

Sơ đồ use case được viết bằng chữ (mã nguồn), rồi mới dựng thành ảnh. Vấn đề nằm ở chỗ: __một sơ đồ sai ngữ pháp UML vẫn dựng ra ảnh rất đẹp.__ Vẽ nét nối giữa người dùng và chức năng bằng mũi tên (sai — phải là nét thẳng không mũi tên), vẽ `<<include>>` chỉa ngược chiều, hay quên khung ranh giới hệ thống — tất cả đều cho ra một tấm hình trông hoàn toàn bình thường. Nhìn ảnh không phát hiện được.

Đã từng xảy ra đúng như vậy: một sơ đồ mắc 6 lỗi UML cùng lúc mà vẫn render thành công, và vì "có ảnh rồi" nên được coi là đã xong.

Vì thế bây giờ có một __chương trình kiểm tra tự động chạy TRƯỚC khi render__. Nó soi từng dòng theo bộ luật cố định: nét nối actor–use case phải đúng kiểu, `<<include>>` và `<<extend>>` phải đúng chiều và đúng chỗ, phải có khung ranh giới. __Sai một lỗi là dừng hẳn, không cho render ra ảnh__ — chứ không phải cảnh báo rồi vẫn chạy tiếp.

Lý do phải làm chặt tới mức đó: cách viết đúng ở đây __ngược với thói quen__. Ở hầu hết loại sơ đồ khác, nối hai thứ với nhau thì dùng mũi tên. Riêng use case diagram, nét nối giữa người dùng và chức năng __không được__ có mũi tên. Một lời dặn suông rất dễ bị quên; một chương trình chặn thì không.

Nhưng cần nhớ ranh giới của nó: __máy chỉ chấm được ngữ pháp, không chấm được nghiệp vụ.__ Một sơ đồ có thể qua hết bộ luật mà vẫn sai — ví dụ gán nhầm chức năng cho actor không có quyền đó, hoặc tách một actor thành hai vai trùng nhau. Phần đó vẫn phải người đọc soi. Vì vậy khi báo kết quả, skill tách rõ hai mức: *ngữ pháp đã được máy kiểm* và *nghiệp vụ thì bạn cần tự xác nhận*.

---

## 8. Kết quả để ở đâu, và vì sao không có file `.md` riêng cho diagram?

Ngoài `.puml` và `.svg`, skill nhúng ảnh và bảng giải thích trực tiếp vào:

```
docs/{feature}/usecases/{feature}-usecase-index.md
```

Trong đó có các phần:

- __Diagram__: ảnh sơ đồ.
- __Actors__: actor nào, loại gì, mô tả và nguồn lấy thông tin.
- __Relationships__: nếu có quan hệ đặc biệt, quan hệ đó là gì và vì sao được vẽ.

Cách này giúp index trở thành trang tổng quan duy nhất của toàn bộ use case trong feature. Bạn không cần mở thêm một file Markdown chỉ để xem lại nội dung đã có ở index.

Lưu ý: phần Diagram, Actors và Relationships được skill tạo lại khi render. Không nên sửa tay trực tiếp các phần này, vì lần chạy sau chúng có thể bị ghi đè. Khi cần thay đổi nội dung, hãy cập nhật nguồn `.puml` bằng cách gọi lại skill.

---

## 9. Điều `/usecase-diagram` KHÔNG hỏi bạn (và vì sao)

Skill không hỏi bạn về chi tiết lập trình, ví dụ:

- dùng API nào;
- dữ liệu lưu ở bảng nào;
- màn hình có bao nhiêu nút;
- lỗi kỹ thuật trả về mã gì.

Đó không phải mục đích của một sơ đồ scope. Điều skill cần từ BA và stakeholder là:

- Ai tham gia?
- Người đó có mục tiêu gì trong feature?
- Có hệ thống bên ngoài nào tham gia?
- Có quan hệ bắt buộc, có điều kiện hoặc chuyên biệt nào được tài liệu nguồn chứng minh không?

Skill cũng không tự bịa actor/use case nếu feature thiếu cả SRS lẫn use case index. Khi đó nó sẽ từ chối và chỉ đường:

```
/usecase {feature}
```

hoặc:

```
/srs {feature}
```

Lý do là một sơ đồ tổng quan sai còn nguy hiểm hơn chưa có sơ đồ: nó có thể khiến cả buổi kickoff đồng thuận nhầm về scope.

Nếu feature chỉ có một actor và một mục tiêu rất rõ, skill có thể nhắc rằng sơ đồ có thể không cần thiết. Đây là gợi ý về nhu cầu, không phải đánh giá feature "nhỏ" hay "kém quan trọng".

---

## 10. Ví dụ thực tế

Chị __Lan__ đang phụ trách feature `authentication` (đăng nhập). Team sắp kickoff với PM, QA, dev và stakeholder. Chị muốn mọi người nhìn nhanh xem feature gồm những ai và những khả năng nào.

Chị Lan gõ:

```
/usecase-diagram --feature authentication
```

1) Skill tìm thấy SRS và use case index của feature nên có nguồn thật để đọc.

2) Skill gom được các actor: Người dùng, Quản trị viên và Google OAuth. Nó cũng gom được các use case: đăng ký, đăng nhập, xác thực email, quên mật khẩu, quản lý tài khoản.

3) Skill đề xuất nhóm "Người dùng" và "Quản trị", vì đây là hai domain thật. Google OAuth được đặt ngoài khung như một hệ thống bên ngoài.

4) Skill thấy tài liệu chứng minh "Đăng ký" luôn phải có "Xác thực email" để hoàn tất. Nó đề xuất một quan hệ `include` và nêu lý do. Với "Quên mật khẩu", tài liệu chưa đủ để chứng minh đây là `extend` của "Đăng nhập", nên skill không tự vẽ quan hệ đó.

5) Skill trình chị Lan kế hoạch: 3 actor, 6 use case, 2 nhóm và 1 quan hệ có lý do. Chị Lan xác nhận `Y`.

6) Skill tạo file nguồn `.puml`, render thành `.svg` qua plantuml.com và tự kiểm ảnh có hợp lệ không.

7) Skill cập nhật `authentication-usecase-index.md` bằng ảnh, bảng actor và bảng quan hệ.

8) Trong buổi kickoff, chị Lan mở index. Cả nhóm thấy ngay Google OAuth nằm ngoài ranh giới hệ thống, còn chức năng quản lý tài khoản nằm ở nhánh quản trị. Một tranh luận về việc "quên mật khẩu có phải một phần bắt buộc của đăng nhập không?" được ghi nhận để làm rõ trong use case text, thay vì vẽ đại một mũi tên.

---

## Xem thêm

Tài liệu gốc của skill: `.claude/skills/usecase-diagram/SKILL.md`.

Các explainer liên quan:

- `explain-skills/usecase-family.md` — __cái nhìn tổng__: `/usecase`, `/usecase-diagram`, `/userstory` liên quan với nhau thế nào.
- `explain-skills/usecase.md` — mô tả chi tiết từng kịch bản người dùng.
- `explain-skills/userstory.md` — chuyển yêu cầu và use case thành backlog-draft.
- `.claude/rules/diagram-selection.md` — quy tắc chọn loại sơ đồ phù hợp.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
