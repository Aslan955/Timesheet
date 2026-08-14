---
type: skill-explainer
skill: brd
updated: 2026-08-01
---

# `/brd` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/brd` là viết tắt của **Business Requirements Document** (tài liệu yêu cầu nghiệp vụ). Đây là lệnh dùng để làm rõ **vì sao doanh nghiệp cần thay đổi**, muốn đạt kết quả kinh doanh nào, phạm vi nghiệp vụ tới đâu, và những quy tắc hay rủi ro nào phải tính đến.

Nói đơn giản, `/brd` không hỏi “màn hình sẽ có nút gì?” mà hỏi:

> “Vấn đề kinh doanh hiện nay là gì, thay đổi này giúp doanh nghiệp tốt hơn thế nào, và cần giữ những ranh giới nào?”

Vài tình huống nên dùng `/brd`:

- Bộ phận vận hành nói “xử lý yêu cầu học viên đang quá chậm”, nhưng chưa thống nhất vấn đề cụ thể là gì.
- Nhóm muốn thêm tính năng học tiếng Anh mới, nhưng cần xác định nó phục vụ mục tiêu kinh doanh nào.
- Nhiều phòng ban cùng liên quan và cần ghi rõ kỳ vọng của từng bên.
- Cần chốt phạm vi nghiệp vụ trước khi đội sản phẩm quyết định sẽ làm những khả năng nào.
- Có quy định như “yêu cầu hoàn phí phải được quản lý duyệt”, cần ghi thành chính sách nghiệp vụ rõ ràng.

Gõ lệnh như sau:

```text
/brd nhac-hoc-hang-ngay
```

Hoặc gõ trơn:

```text
/brd
```

Khi gõ trơn, hệ thống sẽ đưa danh sách để bạn chọn tính năng.

Kết quả cuối cùng là một tài liệu BRD cho một tính năng, ví dụ:

`docs/nhac-hoc-hang-ngay/nhac-hoc-hang-ngay-brd.md`

Tài liệu này do IT-BA (Business Analyst làm việc với công nghệ) hoặc PO (Product Owner — người phụ trách định hướng sản phẩm) tổng hợp. Nó **không phải** business case (hồ sơ phân tích đầu tư đầy đủ) của bộ phận tài chính hay sponsor (người bảo trợ dự án).

***

## 2. Toàn bộ luồng chạy‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quan trọng cần nhớ: `/brd` luôn cho bạn xem kế hoạch nội dung trước khi tạo tài liệu. Nếu tài liệu đã tồn tại, hệ thống cho xem phần thay đổi trước/sau rồi mới sửa.

```text
 BẠN GÕ LỆNH
 /brd nhac-hoc-hang-ngay
        │
        ▼
┌──────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 1 — Xác định đúng tính năng                 │
│ Nếu bạn gõ tên tính năng → kiểm tra tên đó có hợp lý. │
│ Nếu gõ trơn → mời bạn chọn từ danh sách.              │
│ Nếu tên chưa rõ → hỏi đây là tính năng mới hay gõ nhầm│
└──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 2 — Đọc tài liệu sẵn có và chọn nguồn       │
│ Đọc BRD cũ nếu đã có.                                 │
│ Tìm URD, brainstorm và PRD sản phẩm liên quan.        │
│ Liệt kê nguồn để BẠN chọn, không tự ý chọn thay.      │
└──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 3 — Kiểm kê điều đã biết và còn thiếu       │
│ Xem đã có: vấn đề, hiện trạng, mục tiêu, phạm vi,     │
│ quy tắc, rủi ro, số đo thành công...                  │
│ Chỉ hỏi các điểm thiếu hoặc mâu thuẫn.                │
└──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 4 — Hỏi theo ngôn ngữ nghiệp vụ             │
│ Hỏi 3–8 câu trong một lượt, ưu tiên câu ảnh hưởng     │
│ đến mục tiêu, phạm vi và quyết định kinh doanh.       │
│ Điều suy ra hợp lý được ghi rõ là giả định.           │
└──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 5 — Soạn bản BRD                            │
│ Chuỗi logic được giữ xuyên suốt:                      │
│ Vấn đề → Mục tiêu → Thước đo → Phạm vi →              │
│ Quy tắc/ràng buộc → Rủi ro                            │
└──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 6 — Xem trước khi ghi (L1)                  │
│ Bạn xem tóm tắt: mục tiêu, phạm vi, quy tắc, rủi ro,  │
│ lợi ích/chi phí định tính, giả định và câu hỏi mở.    │
│ Chỉ khi bạn đồng ý, hệ thống mới tạo file.            │
│ File đã có → xem bản khác biệt trước/sau (L2).        │
└──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 7 — Làm rõ câu hỏi mở                       │
│ Những điểm chưa chốt được giữ lại thành câu hỏi mở.   │
│ Bạn có thể xử lý ngay, chọn vài câu, hoặc để sau.     │
└──────────────────────────────────────────────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────┐
│ GIAI ĐOẠN 8 — Tự rà soát và tự sửa                    │
│ Ba người rà soát chuyên môn đọc lại BRD.              │
│ Sửa hợp lý có thể được áp dụng tự động.               │
│ Quyết định thay bạn được đánh dấu 🔶 để xem lại.      │
│ Có thể nói “khỏi review” để bỏ bước này.              │
└──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có BRD nêu rõ lý do, mục tiêu,
     ranh giới nghiệp vụ và rủi ro của thay đổi
```

***

## 3. Chỉ hỏi phần còn thiếu, không bắt bạn kể lại từ đầu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trước khi hỏi, `/brd` đọc toàn bộ tài liệu BRD hiện có và các nguồn bạn đã chọn, chẳng hạn:

- URD (User Requirements Document — tài liệu yêu cầu người dùng);
- ghi chú brainstorm (buổi đào sâu ý tưởng);
- PRD sản phẩm (Product Requirements Document — tài liệu yêu cầu sản phẩm ở cấp toàn sản phẩm);
- tài liệu bạn gắn trực tiếp vào yêu cầu.

Sau đó, hệ thống tự phân loại thông tin:

- **Đã biết**: có nguồn nói rõ, không hỏi lại.
- **Có thể suy ra**: dùng cách hiểu hợp lý nhưng ghi là **giả định**.
- **Còn thiếu**: cần hỏi bạn.
- **Mâu thuẫn**: hai nguồn nói khác nhau, cần bạn quyết.

Ví dụ, URD đã nói người học thường quên học vào buổi tối. `/brd` sẽ không hỏi lại “người học gặp khó khăn gì?”. Thay vào đó, nó có thể hỏi: “Doanh nghiệp muốn giảm tỷ lệ bỏ học bao nhiêu, đo trong khoảng thời gian nào?”

Nếu chưa có URD hay brainstorm, `/brd` vẫn chạy. Đây là **soft gate** (điều kiện mềm): hệ thống cảnh báo thiếu nguồn tham khảo, rồi hỏi đúng phần bối cảnh nghiệp vụ còn thiếu; không bắt bạn phải chạy lệnh trước đó mới được làm BRD.

### Bối cảnh cấp dự án lấy từ hồ sơ dự án‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

BRD chạm nhiều thông tin **không thuộc riêng tính năng nào** mà đúng ở cấp dự án: sản phẩm thuộc lĩnh vực gì, thị trường mục tiêu, mô hình kinh doanh (thu phí thuê bao? miễn phí có bản trả tiền? bán cho doanh nghiệp?), và quy định pháp lý phải tuân. Những thứ này xuất hiện đi xuất hiện lại ở phần Phạm vi nghiệp vụ và phần Rủi ro.

Chúng được lưu ở **hồ sơ dự án** (`docs/_shared/project-profile.md`) và dùng chung cho mọi lệnh: `/brd` đọc hồ sơ trước → thiếu phần nào mới hỏi → trả lời xong xin phép ghi lại (bạn duyệt) → lệnh sau không hỏi lại nữa.

Nhờ vậy bạn không phải giải thích lại "sản phẩm mình bán theo kiểu gì" ở mỗi tính năng. Muốn xem/sửa hồ sơ chủ động thì dùng `/update-overview profile`.

***

## 4. Chuỗi cốt lõi: từ vấn đề đến rủi ro

Một BRD tốt không phải là danh sách ý tưởng rời rạc. Nó nối từng phần thành một chuỗi có lý do:

```text
Business problem
(Vấn đề kinh doanh)
        ↓
Business objective
(Mục tiêu nghiệp vụ)
        ↓
Success measure
(Thước đo thành công)
        ↓
Business scope
(Ranh giới nghiệp vụ)
        ↓
Business rule / constraint
(Quy tắc / ràng buộc)
        ↓
Business risk
(Rủi ro nghiệp vụ)
```

Ví dụ với tính năng nhắc học hằng ngày cho app học tiếng Anh:

| Mắt xích | Ví dụ |
|---|---|
| Vấn đề kinh doanh | Nhiều người học không quay lại sau tuần đầu, khiến tỷ lệ tiếp tục học thấp. |
| Mục tiêu nghiệp vụ | Tăng số người duy trì học đều trong 30 ngày đầu. |
| Thước đo thành công | Tỷ lệ người học hoàn thành ít nhất 12 buổi trong 30 ngày; có mức hiện tại, mục tiêu và cách đo rõ ràng. |
| Phạm vi nghiệp vụ | Áp dụng cho người học mới tại Việt Nam, trên kênh ứng dụng di động. |
| Quy tắc nghiệp vụ | Người học chỉ nhận tối đa một lời nhắc học mỗi ngày và có quyền tắt lời nhắc. |
| Rủi ro nghiệp vụ | Nhắc quá nhiều làm người học khó chịu và tắt thông báo; bộ phận vận hành cần theo dõi phản hồi. |

Điểm kiểm tra quan trọng: **mỗi mục tiêu nghiệp vụ phải có ít nhất một thước đo thành công**.

Không nên viết mục tiêu kiểu “cải thiện trải nghiệm học” rồi để đó. Cần nói rõ cải thiện bằng kết quả nào, ví dụ tỷ lệ học lại, số buổi học hoàn tất, hoặc tỷ lệ người duy trì thói quen.

Nếu chưa có baseline (mức hiện tại đang là bao nhiêu), BRD ghi thẳng là **“Chưa có”** và nêu cách cần xác lập số đó. Hệ thống không tự đặt ra con số cho có vẻ chính xác.

***

## 5. Current State, Future State và Gap: lõi công việc của IT-BA

Ba phần này rất quan trọng vì chúng biến một mong muốn chung chung thành lý do thay đổi rõ ràng.

- **Current State** (trạng thái hiện tại): doanh nghiệp hoặc người dùng đang làm việc thế nào.
- **Future State** (trạng thái mong muốn): sau thay đổi, cách làm cần tốt lên ra sao.
- **Gap** (khoảng cách cần giải quyết): điều đang thiếu giữa hiện tại và mong muốn.

Ví dụ:

| | Hiện trạng | Trạng thái mong muốn | Khoảng cách |
|---|---|---|---|
| Việc học hằng ngày | Người học tự nhớ lịch học, thường quên khi bận. | Người học được hỗ trợ duy trì lịch học phù hợp. | Chưa có cách nhắc đúng thời điểm và tôn trọng lựa chọn của người học. |
| Theo dõi hiệu quả | Đội vận hành chỉ thấy tổng số buổi học. | Đội vận hành biết lời nhắc có giúp người học quay lại không. | Thiếu cách theo dõi hiệu quả của chương trình nhắc học. |

Nhờ bộ ba này, nhóm không chỉ nói “hãy làm thông báo nhắc học”, mà hiểu **vì sao** cần thay đổi và khoảng trống nghiệp vụ nào cần lấp.

Đây cũng là điểm khác giữa BRD của BA với một bản mô tả truyền thông: BRD phải chỉ ra thực tế hiện nay, thực tế cần đạt và lý do của khoảng cách đó.

***

## 6. Phạm vi, quy tắc nghiệp vụ và quy tắc kỹ thuật không giống nhau

### Phạm vi là ranh giới nghiệp vụ, không phải danh sách tính năng

Business scope (phạm vi nghiệp vụ) trả lời thay đổi này áp dụng cho:

- quy trình nào;
- nhóm khách hàng nào;
- khu vực nào;
- kênh nào;
- đơn vị vận hành nào;
- phần nào chủ động không làm.

Ví dụ đúng về phạm vi:

- Áp dụng cho người học mới trong 30 ngày đầu.
- Áp dụng trên ứng dụng di động tại thị trường Việt Nam.
- Không áp dụng cho học viên doanh nghiệp trong giai đoạn đầu.

Ví dụ không đúng về phạm vi BRD:

- Có nút bật/tắt thông báo.
- Có màn hình chọn giờ nhắc.
- Gửi thông báo qua một dịch vụ cụ thể.

Ba ý sau là chi tiết sản phẩm hoặc kỹ thuật; chúng sẽ được làm rõ ở tầng sau.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

### Business rule khác technical rule

Business rule (quy tắc nghiệp vụ) là chính sách hay ràng buộc doanh nghiệp cần tuân theo.

Ví dụ:

- “Một đơn hàng có thể được khiếu nại tối đa 5 lần.”
- “Đơn hoàn tiền trên 50 triệu đồng cần quản lý phê duyệt.”
- “Người học đã tắt lời nhắc thì không được tự bật lại nếu chưa có sự đồng ý.”

Technical rule (quy tắc kỹ thuật) là cách hệ thống kiểm tra hoặc thực hiện, ví dụ:

- “Trường số tiền chỉ nhận kiểu number (số).”
- “Kiểm tra dữ liệu trước khi gửi.”
- “Thử gửi lại khi kết nối lỗi.”

Các quy tắc kỹ thuật thuộc SRS (Software Requirements Specification — tài liệu yêu cầu phần mềm), không thuộc BRD. `/brd` sẽ đưa chúng ra khỏi tài liệu để giữ đúng tầng nghiệp vụ.

***

## 7. BRD chỉ giữ phân tích lợi ích/chi phí định tính

Một nhầm lẫn phổ biến là xem BRD như business case (hồ sơ đề xuất đầu tư đầy đủ). Hai tài liệu này liên quan nhưng không giống nhau.

BRD có thể nêu:

- cost driver (yếu tố tạo chi phí chính), như công sức vận hành, nội dung, đào tạo hoặc tuân thủ;
- benefit (lợi ích) chính, như giảm người học bỏ cuộc hoặc giảm thao tác thủ công;
- mức ưu tiên hay rough ROI (ước lượng giá trị ở mức thô, không phải mô hình tài chính chi tiết).

BRD không làm:

- NPV (giá trị hiện tại ròng);
- DCF (dòng tiền chiết khấu);
- nhiều kịch bản ROI (tỷ suất hoàn vốn);
- so sánh nhiều phương án đầu tư;
- cổng ra quyết định đầu tư.

Lý do rất đơn giản: khi chưa có số liệu đáng tin, việc dựng bảng tiền bạc chi tiết tạo ra cảm giác chính xác giả. BRD ghi rõ “Chưa có” khi thiếu dữ liệu, nêu câu hỏi cần xác minh, và chỉ giữ phần định tính để giải thích vì sao thay đổi đáng được ưu tiên.

Nếu cần quyết định đầu tư chính thức, hãy làm một business case riêng do sponsor và bộ phận tài chính sở hữu.

***

## 8. Stakeholder không chỉ là danh sách tên người

Stakeholder (bên liên quan) là nhóm có lợi ích, trách nhiệm hoặc ảnh hưởng tới thay đổi. Trong BRD, mỗi nhóm không chỉ được ghi tên và vai trò; tài liệu còn ghi **họ cần gì hoặc kỳ vọng gì**.

Ví dụ:

| Bên liên quan | Mối quan tâm | Kỳ vọng cần ghi rõ |
|---|---|---|
| Người học | Không bị làm phiền, vẫn duy trì học đều. | Tự chọn thời điểm nhắc và dễ tắt khi không cần. |
| Đội vận hành học tập | Muốn giảm số người bỏ học. | Có cách theo dõi lời nhắc có giúp người học quay lại hay không. |
| Quản lý sản phẩm | Muốn ưu tiên đúng việc tạo giá trị. | Biết phạm vi giai đoạn đầu và các rủi ro cần chấp nhận. |
| Bộ phận tuân thủ | Quan tâm quyền riêng tư và sự đồng ý. | Chính sách gửi lời nhắc tôn trọng lựa chọn của người học. |

Nếu chưa xác nhận tên cá nhân, BRD dùng vai trò như “Quản lý vận hành” thay vì bịa ra tên người.

Rủi ro cũng theo tinh thần tương tự — ghi bằng ngôn ngữ kinh doanh và vận hành: mức độ có thể xảy ra, mức độ ảnh hưởng, cách giảm rủi ro và vai trò chịu trách nhiệm. Nó không đi vào cách sửa lỗi kỹ thuật.

***

## 9. Ba anh em `/urd`, `/brd` và `/prd-epic` khác nhau thế nào?

| | `/urd` | `/brd` | `/prd-epic` |
|---|---|---|---|
| **Tầng nhìn** | Người dùng | Doanh nghiệp | Sản phẩm của một tính năng |
| **Câu hỏi chính** | “Người dùng cần gì, gặp khó gì?” | “Vì sao doanh nghiệp cần thay đổi này?” | “Tính năng sẽ cung cấp những khả năng gì?” |
| **Nội dung chính** | Nhu cầu, chân dung người dùng, hành trình sử dụng. | Vấn đề, mục tiêu, thước đo, phạm vi, quy tắc, rủi ro. | Khả năng P0/P1/P2, luồng sản phẩm, phạm vi phát hành. |
| **Không làm** | Không lập chính sách nghiệp vụ hay quyết định phạm vi doanh nghiệp. | Không mô tả chi tiết nhu cầu người dùng, khả năng sản phẩm hay kỹ thuật. | Không thay BRD để giải thích lý do kinh doanh ban đầu. |
| **Ví dụ câu hỏi** | “Người học cần gì để không bỏ dở?” | “Doanh nghiệp cần cải thiện chỉ số nào, trong phạm vi nào?” | “Bản đầu của nhắc học cần có những khả năng nào?” |

Một câu để nhớ:

> **`/urd` hỏi người dùng cần gì; `/brd` hỏi doanh nghiệp vì sao phải thay đổi; `/prd-epic` chốt tính năng sẽ làm gì.**

Thứ tự thường là: hiểu người dùng bằng `/urd`, rồi chốt lý do và ranh giới kinh doanh bằng `/brd`, sau đó xác định các khả năng sản phẩm bằng `/prd-epic`.

***

## 10. Bước tự rà soát cuối: có tự sửa, có đánh dấu 🔶

Sau khi BRD được tạo, `/brd` mặc định mời ba người rà soát chuyên môn cùng xem:

- `@senior-ba` — kiểm tra tính đầy đủ, mơ hồ và các tình huống dễ bỏ sót.
- `@po-reviewer` — kiểm tra giá trị kinh doanh, ưu tiên và việc phạm vi bị phình ra.
- `@pm-reviewer` — kiểm tra phụ thuộc, tác động liên phòng ban và bối cảnh kế hoạch.

Họ đặc biệt xem:

- mỗi mục tiêu có thước đo thành công hay chưa;
- có đủ hiện trạng, trạng thái mong muốn và khoảng cách hay chưa;
- phạm vi có lẫn sang chi tiết sản phẩm hoặc kỹ thuật không;
- quy tắc có thật sự là quy tắc nghiệp vụ không;
- số liệu có căn cứ hay đang được trình bày như sự thật khi chưa chắc chắn.

Đây là điểm cần hiểu đúng: hệ thống có thể **tự áp dụng các sửa đổi hợp lý** ở bước này. Khi phải tự chọn một phương án thay bạn, nó ghi là giả định và đánh dấu dưới phần:

```text
🔶 Quyết định thay user — review lại
```

Nghĩa là bạn vẫn cần xem lại các quyết định có ký hiệu 🔶. Nếu không muốn có bước tự rà soát, bạn có thể nói “khỏi review”.

***

## 11. Ví dụ thực tế

Chị **Lan** là BA cho một app học tiếng Anh. Đội vận hành nhận thấy nhiều người đăng ký học nhưng bỏ dở ngay trong tuần đầu. Một người đề xuất rất nhanh: “Hay thêm thông báo nhắc học?”

Lan chưa vội đặc tả nút bấm hay màn hình. Chị gõ:

```text
/brd nhac-hoc-hang-ngay
```

1. Hệ thống tìm thấy ghi chú brainstorm và URD của tính năng, liệt kê chúng để Lan chọn nguồn tham khảo. Lan chọn cả hai.

2. Hệ thống đã đọc rằng người học bận, thường quên học vào buổi tối, nên không hỏi lại điều đó. Nó chỉ hỏi các phần còn thiếu: “Mục tiêu kinh doanh cần cải thiện là gì?”, “Áp dụng cho nhóm người học nào trước?”, “Có giới hạn nào về tần suất nhắc không?”

3. Lan trả lời: mục tiêu là tăng tỷ lệ người học hoàn thành ít nhất 12 buổi trong 30 ngày đầu; trước mắt chỉ áp dụng cho người học mới ở Việt Nam; mỗi ngày tối đa một lời nhắc và người học phải được quyền tắt.

4. Lan chưa có con số hiện tại về tỷ lệ học đều. Hệ thống không tự điền một tỷ lệ đẹp mắt. Nó ghi “Chưa có”, đồng thời tạo câu hỏi mở: đội dữ liệu cần xác lập mức hiện tại bằng báo cáo 30 ngày gần nhất.

5. Hệ thống soạn chuỗi logic: vấn đề là người học bỏ dở sớm; mục tiêu là tăng duy trì học; thước đo là tỷ lệ hoàn thành 12 buổi; phạm vi là người học mới tại Việt Nam; quy tắc là tối đa một lời nhắc mỗi ngày; rủi ro là người học thấy phiền và tắt thông báo.

6. Trước khi ghi file, hệ thống tóm tắt số mục tiêu, thước đo, quy tắc, rủi ro, giả định và câu hỏi mở. Lan đồng ý.

7. Sau khi tạo BRD, ba người rà soát phát hiện phần rủi ro chưa ghi ai chịu trách nhiệm theo dõi phản hồi tiêu cực. Hệ thống bổ sung vai trò “Quản lý vận hành học tập”. Một lựa chọn về cách diễn đạt phạm vi được tự quyết và đánh dấu 🔶 để Lan xem lại.

Cuối cùng, Lan có một BRD giải thích rõ **vì sao** cần nhắc học, thành công được đo thế nào và ranh giới nào phải giữ. Bước tiếp theo hợp lý là chạy `/prd-epic nhac-hoc-hang-ngay` để quyết định tính năng này sẽ có những khả năng nào trong từng mức ưu tiên.

***

## Xem thêm

Tài liệu này giải thích luồng chạy ở mức dễ hiểu. Muốn xem đầy đủ quy tắc, cấu trúc tài liệu và các trường hợp đặc biệt, đọc file gốc: `.claude/skills/brd/SKILL.md`.

Các lệnh liên quan trong dây chuyền:

- `explain-skills/urd.md` — `/urd`: làm rõ nhu cầu, khó khăn và hành trình của người dùng.
- `explain-skills/prd-epic.md` — `/prd-epic`: đặc tả khả năng sản phẩm của một tính năng sau khi đã có định hướng nghiệp vụ.
- `.claude/skills/srs/SKILL.md` — `/srs`: chuyển yêu cầu đã chốt thành yêu cầu phần mềm và quy tắc kỹ thuật.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
