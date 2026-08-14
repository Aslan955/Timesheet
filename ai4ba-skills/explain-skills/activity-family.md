---
type: skill-explainer
skill: activity-family
updated: 2026-07-14
---

# Ba lệnh vẽ "sơ đồ quy trình" — chọn cái nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Tài liệu này giải thích __mối liên quan__ giữa ba lệnh cùng vẽ sơ đồ quy trình: `/activity`, `/activity-swimlane`, `/d2-activity`. Muốn hiểu sâu từng lệnh, đọc file explainer riêng của nó (liệt kê ở cuối).

## 1. Vì sao lại có tận ba lệnh cho cùng một việc?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cả ba lệnh đều trả lời cùng một câu hỏi nghiệp vụ: __"quy trình này chạy thế nào — có những bước gì, ai làm bước nào, rẽ nhánh ra sao khi có tình huống khác nhau?"__ Kết quả đều là một __sơ đồ quy trình / sơ đồ luồng công việc__: các ô là bước công việc, các mũi tên là hướng đi, hình thoi là điểm rẽ nhánh (có/không). (Loại sơ đồ này bài bản hơn lưu đồ — flowchart — cơ bản: nó thêm được phần chia làn theo vai trò; nên đừng gọi lẫn nó là "lưu đồ".)

Vậy tại sao không gộp làm một? Vì cùng một quy trình có thể cần __vẽ ra theo ba kiểu khác nhau, phục vụ ba mục đích khác nhau__ — giống như cùng một ngôi nhà, kiến trúc sư có thể đưa bạn bản vẽ tay phác nhanh, bản vẽ kỹ thuật in đẹp, hoặc bản phối cảnh trưng bày. Mỗi kiểu mạnh ở một chỗ:

* **`/activity`** — vẽ nhanh, __nhúng thẳng vào tài liệu__ để đọc ngay trong file.
* **`/activity-swimlane`__ — vẽ __"phân làn" rõ ai làm bước nào**, hợp quy trình nhiều người tham gia.
* **`/d2-activity`** — cách vẽ thứ ba: __dàn gọn hơn Mermaid khi nhiều nhánh__, cho ra __file ảnh đứng riêng__ tiện đem đi dùng.

Điểm chung quan trọng: __cả ba đều là các "góc nhìn" hợp lệ của cùng một quy trình.__ Vẽ cái này không xoá cái kia — bạn hoàn toàn có thể có cả ba bản cho cùng một luồng nếu cần.

---

## 2. Bảng chọn nhanh‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nếu chỉ đọc một phần, đọc bảng này:

```
 CÂU HỎI                                          → CHỌN LỆNH

 Quy trình GỌN, 1-2 người, và muốn xem hình
 ngay trong file tài liệu (mở trên GitHub /
 Obsidian là hiện hình luôn)?                     → /activity  (Mermaid)

 Quy trình NHIỀU VAI TRÒ (Khách / Hệ thống /
 Nhân viên / Quản lý...), nhiều qua lại giữa
 các bên, cần thấy rõ "ai làm bước nào"?          → /activity-swimlane  (PlantUML)  ⭐ mặc định

 Quy trình NHIỀU NHÁNH nhưng ít giao cắt, vẽ
 bằng Mermaid thì rối — và muốn một FILE ẢNH
 đứng riêng để đưa vào slide / xuất ra?           → /d2-activity  (D2)

 Luồng Business phức tạp/nhiều bước, hoặc cần
 chuẩn quốc tế (OMG) + mở bằng phần mềm quy
 trình như Camunda?                               → /bpmn  (xem file explainer riêng)
```

Một câu để nhớ: **nhúng-thẳng → `/activity`; nhiều-vai-trò → `/activity-swimlane`; nhiều-nhánh-cần-file-riêng → `/d2-activity`.**

---

## 3. So sánh ba lệnh cạnh nhau‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| | `/activity` | `/activity-swimlane` | `/d2-activity` |
|---|---|---|---|
| __Công cụ vẽ__ | Mermaid | PlantUML | D2 (engine ELK) |
| __Mạnh nhất ở__ | Nhúng thẳng vào tài liệu, mở là hiện hình | "Phân làn" thật — rõ ai làm bước nào | Dàn gọn hơn Mermaid khi nhiều nhánh; file đứng riêng |
| __Hợp với__ | Quy trình gọn, 1-2 vai trò | Quy trình nhiều vai trò, nhiều qua lại | Nhiều nhánh + ít giao cắt, cần file ảnh riêng để đem đi |
| __Kết quả để ở đâu__ | Ghi thẳng vào `flows.md` (mở file là thấy) | Bản gốc `.puml` + ảnh `.svg` trong `srs/`; ảnh được nhúng vào `flows.md` | Đứng riêng thư mục `d2/` (không nhúng) |

> Note: `/activity-swimlane` dùng dịch vụ plantuml.com để tạo ra file ảnh output (svg/png) từ bản mô tả.

---

## 4. Vì sao "nhiều vai trò" lại là ranh giới quan trọng nhất?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nếu chỉ nhớ một điều để chọn đúng, hãy nhớ điều này: __số vai trò tham gia quyết định phần lớn việc chọn lệnh nào.__

Lý do nằm ở cách máy sắp xếp hình. Khi một quy trình có nhiều vai trò (Khách, Hệ thống, Nhân viên, Quản lý...) và công việc __nhảy qua nhảy lại__ giữa họ, thì việc vẽ sao cho __mỗi vai trò một "làn" thẳng cột__ trở nên khó với công cụ thường:‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

* **Mermaid (`/activity`)** vẽ "làn" chỉ như một cái khung trang trí — các bước bên trong vẫn trôi tự do, nên khi nhiều làn + nhiều qua lại thì __các làn xô lệch, nhìn rối__.
* **D2 (`/d2-activity`)** dàn hình gọn hơn Mermaid, nhưng khi có rất nhiều đường nhảy chéo giữa các làn, nó __kéo các làn ra xa nhau__, đường đi thành như "mì Ý".
* **PlantUML (`/activity-swimlane`)** được thiết kế riêng cho kiểu này: nó __giữ mỗi làn thẳng một cột cố định__, bước nào của ai thì nằm đúng làn người đó. Đây là công cụ đúng cho quy trình nhiều vai trò.

Vì vậy quy tắc mặc định là: **quy trình đa vai trò → dùng `/activity-swimlane` (⭐).** Chỉ khi quy trình gọn (1-2 vai) và bạn muốn nhúng thẳng vào tài liệu thì mới dùng `/activity`. Bản thân `/activity` cũng đủ "tự biết điều": nếu bạn đưa cho nó một quy trình nhiều vai trò với nhiều tương tác chéo, nó sẽ **tự đề xuất bạn chuyển sang `/activity-swimlane`** trước khi vẽ.

---

## 5. Ba điểm giống nhau ở cả ba lệnh

Dù khác công cụ, cả ba lệnh vận hành theo cùng vài nguyên tắc — biết trước sẽ đỡ bỡ ngỡ:

1) __Bạn mô tả nghiệp vụ, máy lo sắp xếp hình.__ Bạn không phải kéo thả hay canh chỉnh vị trí từng ô. Bạn (hoặc hệ thống, đọc từ tài liệu đã có) mô tả: các bước, các điểm rẽ nhánh, ai làm gì — rồi công cụ tự dàn thành hình. Đây gọi là "AI mô tả cấu trúc, engine lo layout".

2) __Hỏi xác nhận vai trò trước khi vẽ (khi quy trình có nhiều vai trò).__ Khi phát hiện quy trình có từ 2 vai trò trở lên, cả ba đều dừng lại hỏi bạn "quy trình này có những vai trò nào — {liệt kê}, đủ chưa?" trước khi vẽ. Lý do: một vai trò có thể bị __ẩn/nói ngụ ý__ trong câu văn (không gọi tên rõ), quét tự động dễ sót — mà sót một vai trò là sót cả một làn. Hỏi lại là để không bỏ lọt. (Quy trình chỉ một vai trò thì không có làn nào để chia, nên bỏ qua bước hỏi này.)

3) __Không xem-và-sửa nhiều vòng trong khung chat.__ Khác với vẽ wireframe bằng ký tự (hiện ngay trong chat để sửa tới lui), sơ đồ của ba lệnh này __không hiện được trong khung chat__ — bạn xem hình từ file đã xuất ra, thấy cần đổi thì gọi lại lệnh và nói cần sửa gì. Bù lại, `/activity-swimlane` có một bước đặc biệt: sau khi vẽ, nó __tự mở ảnh ra soi lại__ (mũi tên đúng chiều chưa? bước có nằm đúng làn không?) để bắt lỗi thay bạn.

---

## 6. Ví dụ thực tế — cùng một quy trình, ba cách vẽ

Anh __Sơn__, một BA, trong tuần gặp ba tình huống cần vẽ sơ đồ quy trình khác nhau — và mỗi lần anh chọn một lệnh khác nhau theo đúng nhu cầu:

1) __Quy trình "hoàn tiền" — bốn vai trò, chuyền việc qua lại liên tục__ (Khách → Hệ thống → Nhân viên → Quản lý → Hệ thống). Vì nhiều vai trò và nhiều tương tác chéo, anh chọn `/activity-swimlane` — cho ra sơ đồ phân làn thẳng cột rõ ràng, nhìn phát biết bước nào của ai. Ảnh được nhúng vào file `flows.md` để cả nhóm đọc trên GitHub. (Anh không chọn `/d2-activity` ở đây — vì quá nhiều giao cắt giữa các làn thì D2 sẽ kéo làn rối như "mì Ý".)

2) __Quy trình "đăng ký gói cước" — nhiều nhánh nhưng ít giao cắt giữa các vai trò__, anh cần một __file ảnh đứng riêng để dán vào slide__ trình bày cho ban giám đốc. Anh thử vẽ bằng Mermaid nhưng nhiều nhánh nên rối, nên chuyển sang `/d2-activity`: dàn gọn hơn, đường kẻ vuông góc, đứng riêng một file ảnh tiện dán slide.

3) __Quy trình "đổi mật khẩu" — chỉ Người dùng và Hệ thống, rất gọn.__ Anh chỉ cần một sơ đồ quy trình nhỏ nhúng thẳng vào tài liệu — anh dùng `/activity` (Mermaid), mở file là thấy hình ngay, không cần file ảnh riêng.

Điểm mấu chốt: anh Sơn chọn công cụ theo __hai yếu tố__ — quy trình có nhiều vai trò giao cắt hay không, và cần hình để đọc tại chỗ hay để trưng bày riêng — chứ không theo "cái nào đẹp nhất". Nhiều bản của cùng một quy trình có thể tồn tại song song, không cái nào xoá cái nào.

---

## Xem thêm

Muốn hiểu sâu từng lệnh, đọc file explainer riêng:

* `explain-skills/activity.md` — `/activity` (Mermaid, nhúng thẳng vào tài liệu).
* `explain-skills/activity-swimlane.md` — `/activity-swimlane` (PlantUML, phân làn thật, ⭐ mặc định cho đa vai trò).
* `explain-skills/d2-activity.md` — `/d2-activity` (D2, dàn gọn hơn Mermaid khi nhiều nhánh, file đứng riêng).
* `explain-skills/bpmn.md` — `/bpmn` (chuẩn quốc tế BPMN, đưa vào phần mềm quản lý quy trình).

Quy tắc chọn diagram đầy đủ (cho mọi loại sơ đồ, không chỉ activity) nằm ở file gốc: `.claude/rules/diagram-selection.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
