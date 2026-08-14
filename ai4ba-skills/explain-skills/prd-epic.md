---
type: skill-explainer
skill: prd-epic
updated: 2026-07-14
---

# `/prd-epic` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/prd-epic` (viết tắt của “Product Requirements Document” — tài liệu yêu cầu sản phẩm, cho một *epic* tức một mảng việc/tính năng cụ thể) dùng để đặc tả __MỘT tính năng sẽ làm gì__.

Nó trả lời: tính năng này có những __capability (khả năng)__ nào, khả năng nào phải làm trước, vì sao ưu tiên như vậy, làm tới đâu thì xem là xong ở góc độ sản phẩm.

Đừng nhầm ngay từ đầu:

* `/prd-epic` đặc tả __một feature (tính năng)__, ví dụ: “Bài học ngắn 5 phút”.
* `/prd` không có `-epic` là PRD __toàn sản phẩm__, dùng để bóc ra nhiều feature, ví dụ: bài học ngắn, luyện phát âm, nhắc học, theo dõi tiến độ.
* P0/P1/P2 trong `/prd-epic` là mức ưu tiên của __các khả năng bên trong một feature__, không phải danh sách feature của cả dự án.

Bạn nên dùng `/prd-epic` khi:

* Đã chọn một feature từ PRD toàn sản phẩm và cần chốt phạm vi làm cho feature đó.
* Đã có `/urd`, `/brd` hoặc ghi chú brainstorm (phiên trao đổi ý tưởng), muốn gom lại thành bản mô tả sản phẩm mạch lạc.
* Cần một tài liệu để bàn giao xuống `/srs` viết yêu cầu chức năng, nhưng chưa muốn sa vào cách lập trình.
* Cần chuẩn bị cho backlog (danh sách việc chờ thực hiện): mỗi capability đủ rõ để sau này bóc thành các user story (mẩu việc theo góc nhìn người dùng).

Ví dụ:

```text
/prd-epic bai-hoc-ngan
```

Hoặc gõ trơn:

```text
/prd-epic
```

Khi đó hệ thống sẽ cho bạn chọn feature. Nếu feature chưa tồn tại, bạn vẫn có thể bắt đầu từ mô tả thô; hệ thống cảnh báo rằng nên có URD/BRD để đầy đủ hơn, nhưng không bắt buộc phải dừng.

Kết quả là một file:

```text
docs/{feature}/{feature}-prd.md
```

Ví dụ:

```text
docs/bai-hoc-ngan/bai-hoc-ngan-prd.md
```

Đây là __bản lề của hai điểm bàn giao__:

1) Bàn giao xuống `/srs`: capability đủ rõ để bóc yêu cầu chức năng, nhưng không chứa API, cơ sở dữ liệu hay cách xây hệ thống.
2) Bàn giao sang backlog: capability có mức ưu tiên, lý do ưu tiên, tiêu chí xong và đủ “vừa tầm” để bóc thành các story sau này.

***

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bản PRD-epic tạo hoặc cập nhật ban đầu __luôn được cho xem trước trước khi ghi__. Nếu file đã có, hệ thống cho xem phần trước/sau để bạn duyệt phần thay đổi.

```text
 BẠN GÕ LỆNH
 /prd-epic bai-hoc-ngan
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 1 — Xác định đúng feature                    │
 │  Kiểm tra feature đã có hay chưa.                      │
 │  Nếu tên chưa rõ → hỏi đó là feature mới hay gõ nhầm. │
 │  Nếu đã có PRD-epic → báo đang cập nhật bản cũ.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 2 — Tìm và đọc nguồn có sẵn                  │
 │  Liệt kê URD, BRD và các ghi chú brainstorm của        │
 │  feature để bạn chọn dùng một hay nhiều nguồn.         │
 │  Bạn cũng có thể đưa một file khác hoặc dán nội dung.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 3 — Chỉ hỏi phần còn thiếu hoặc mâu thuẫn    │
 │  Đọc kỹ nguồn đã chọn trước, rồi mới hỏi 4–8 câu       │
 │  quan trọng: phạm vi, capability, ưu tiên, chỉ số,     │
 │  phụ thuộc nghiệp vụ, điều kiện ra mắt...               │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 4 — Soạn PRD-epic và tự kiểm tra ranh giới   │
 │  Gom thông tin thành mục tiêu, non-goal (điều không    │
 │  làm), capability P0/P1/P2, chỉ số, rủi ro, kế hoạch   │
 │  phát hành. Chi tiết kỹ thuật hoặc tài chính bị tách   │
 │  khỏi tài liệu này và chuyển đúng tầng.                │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 5 — Xem trước trước khi ghi (L1)             │
 │  Hệ thống tóm tắt số capability, mức ưu tiên, chỉ số, │
 │  phụ thuộc, giả định, rủi ro và câu hỏi còn mở.        │
 │  Bạn đồng ý (Y) thì mới ghi bản đầu tiên.              │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 6 — Nếu đang cập nhật: xem trước/sau (L2)   │
 │  File cũ được giữ các phần bạn đã điền. Hệ thống chỉ   │
 │  đề xuất sửa phần có thông tin mới, rồi cho bạn xem    │
 │  phần thay đổi trước khi ghi.                          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 7 — Xử lý câu hỏi mở                         │
 │  Hệ thống hỏi bạn muốn giải quyết ngay, bỏ qua, hay    │
 │  chỉ chọn vài câu. Nếu câu trả lời làm đổi file cũ,    │
 │  phần đổi cũng được cho xem trước/sau.                 │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ GIAI ĐOẠN 8 — Tự rà soát và tự sửa                     │
 │  Ba trợ lý đọc lại về nghiệp vụ, ưu tiên và kế hoạch. │
 │  Sửa an toàn được tự áp dụng. Chỗ phải quyết thay bạn │
 │  cũng có thể được tự chọn và đánh dấu 🔶 để xem lại.  │
 │  Muốn bỏ bước này, nói “khỏi review”.                  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có PRD-epic sẵn sàng cho /srs và backlog
```

***

## 3. Capability khác feature như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đây là chỗ dễ lẫn nhất.

__Feature (tính năng)__ là một phần độc lập của sản phẩm. Ví dụ với app học tiếng Anh: “Bài học ngắn 5 phút” là một feature.

__Capability (khả năng)__ là một phần việc có giá trị nằm __bên trong__ feature đó. Ví dụ feature “Bài học ngắn 5 phút” có thể gồm:

* Chọn bài theo mục tiêu học.
* Hiển thị một bài học hoàn thành trong khoảng 5 phút.
* Lưu tiến độ hoàn thành bài.
* Gợi ý bài tiếp theo.

Các capability được xếp:

| Mức ưu tiên | Ý nghĩa |
|---|---|
| __P0__ | Phải có để bản đầu tiên có thể ra mắt; thiếu thì feature chưa phục vụ được mục tiêu chính. |
| __P1__ | Nên làm sớm sau P0 vì tăng giá trị hoặc hoàn thiện trải nghiệm. |
| __P2__ | Có ích nhưng để sau, khi đã có căn cứ hoặc nguồn lực phù hợp. |

P0/P1/P2 là quyết định về __phạm vi trong feature này__. Nó không có nghĩa “P0 là feature A, P1 là feature B” của cả dự án; việc đó thuộc `/prd` toàn sản phẩm.

Mỗi capability phải có __rationale (lý do ưu tiên)__. “P0 vì tôi nói P0” không đủ để cả nhóm bảo vệ thứ tự làm việc. Một lý do đứng vững thường nói rõ giá trị hoặc ràng buộc, ví dụ:

* “P0 vì người học không thể hoàn thành mục tiêu học 5 phút nếu chưa có bài học phù hợp.”
* “P1 vì chỉ hữu ích sau khi người dùng đã có dữ liệu tiến độ.”
* “P0 vì cần đáp ứng quy định từ đối tác nội dung.”

P0 cũng cần đủ để ra mắt bản đầu tiên. Nếu danh sách P0 quá dài, đó là dấu hiệu feature có thể đang quá rộng và nên tách.

***

## 4. “Bóc khoảng N story” và “done when” để kiểm tra capability có vừa tầm‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Mỗi capability được ước lượng có thể bóc thành khoảng bao nhiêu __user story (mẩu việc theo góc nhìn người dùng)__. Đây không phải là lúc viết story chi tiết hay chấm số ngày công; chỉ là thước đo xem capability có vừa tầm để bàn giao hay không.

* Dưới khoảng 3 story: quá nhỏ, có thể chỉ là một việc lẻ; nên gộp vào capability lớn hơn hoặc để xuống tầng acceptance criteria (tiêu chí chấp nhận).
* Khoảng 3–15 story: vừa tầm để đưa vào backlog và làm rõ tiếp.
* Trên khoảng 15 story: quá lớn, có thể đã là một feature/epic khác; nên cân nhắc tách feature.

Mỗi capability còn cần một dòng __done when (xong khi)__: kết quả sản phẩm có thể quan sát được.

Ví dụ tốt:

> Xong khi người học chọn mục tiêu và hoàn thành một bài học ngắn phù hợp trong một phiên học.

Ví dụ chưa đúng:

> Xong khi hệ thống gọi API thành công.

Câu sau nói về cách kỹ thuật vận hành, không phải kết quả người dùng hay doanh nghiệp nhìn thấy.

Cũng đừng nhầm “done when” với __acceptance criteria (tiêu chí chấp nhận)__ hoặc dạng Given–When–Then. “Done when” ở đây là một kết quả cấp sản phẩm; `/ac` mới là nơi viết các điều kiện kiểm thử chi tiết.

`/prd-epic` chỉ kiểm tra “có thể bóc khoảng N story không”, không tự viết hàng loạt story, không ghi Given–When–Then, không ước lượng điểm hay thời gian làm.

***

## 5. Đọc cái đã biết, không bịa số khi chưa có

Trước khi hỏi, `/prd-epic` đọc toàn bộ PRD-epic cũ nếu đang cập nhật, cùng các nguồn bạn đã chọn như URD, BRD và brainstorm. Sau đó, nó chỉ hỏi phần:

* Chưa có thông tin.
* Có thông tin mâu thuẫn nhau.
* Quan trọng nhưng không thể suy ra an toàn.

Vì vậy bạn không phải lặp lại những điều tài liệu đã nói rõ.

Các thông tin có thể suy luận hợp lý được ghi là __assumption (giả định)__ hoặc đánh dấu cần làm rõ, thay vì trình bày như sự thật đã xác nhận. Chẳng hạn, nếu chưa chốt mục tiêu của một capability, tài liệu không nên giả vờ rằng mục tiêu ấy đã được duyệt.

Điều này đặc biệt quan trọng với __success metric (chỉ số thành công)__. Mỗi chỉ số nên có:

* __Baseline (mức hiện tại)__: hiện nay đang đạt bao nhiêu.
* __Target (mức mục tiêu)__: muốn đạt bao nhiêu.
* __Measurement (cách đo)__: lấy số liệu bằng cách nào.
* __Timeframe (khoảng thời gian đo)__: đo trong bao lâu hoặc khi nào xem xét.

Nếu chưa có baseline, hệ thống không tự chế số. Nó ghi theo tinh thần:

> Chưa có — sẽ xác lập bằng khảo sát tỷ lệ hoàn thành bài học trong 4 tuần đầu.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cách ghi này trung thực hơn một con số đẹp nhưng không có căn cứ.

***

## 6. Những gì phải để đúng tầng

`/prd-epic` mô tả “feature sẽ làm gì”, nên có những nội dung phải để ở tài liệu khác.

| Nội dung | Thuộc nơi nào |
|---|---|
| Nhu cầu, nỗi khó khăn, nghiên cứu người dùng chi tiết | `/urd` |
| ROI (lợi tức đầu tư), mô hình chi phí, quyết định đầu tư | `/brd` hoặc sponsor (người bảo trợ) |
| API, SDK, cơ sở dữ liệu, mã lỗi, tốc độ phản hồi | `/srs` |
| Given–When–Then, điều kiện kiểm thử chi tiết | `/ac` |
| Danh sách nhiều feature của toàn sản phẩm | `/prd` |

Một ranh giới quan trọng khác là __dependency (phụ thuộc)__.

PRD-epic chỉ giữ __business dependency (phụ thuộc nghiệp vụ)__, chẳng hạn:

* Cần đội Nội dung bàn giao 100 bài học trước ngày ra mắt.
* Cần đối tác cấp quyền dùng nội dung.
* Cần bộ phận Pháp chế duyệt câu chữ điều khoản.

Mỗi phụ thuộc nghiệp vụ cần có người phụ trách, trạng thái và thời điểm cần xong.

Các phụ thuộc kỹ thuật như máy chủ, webhook, mã hóa, SDK hay cơ sở dữ liệu không nằm ở đây; chúng được đẩy sang SRS/NFR (yêu cầu phi chức năng).

Tương tự, __launch readiness (điều kiện sẵn sàng ra mắt)__ của PRD-epic chỉ dùng guardrail (ngưỡng an toàn) nghiệp vụ, như tỷ lệ hoàn thành bài hoặc tỷ lệ đăng ký thành công. CPU, latency (độ trễ) hay sức tải hạ tầng thuộc SRS/NFR.

***

## 7. Bước tự rà soát cuối: có chỗ tự sửa và tự quyết

Sau khi tạo hoặc cập nhật tài liệu, `/prd-epic` mặc định nhờ ba trợ lý rà soát:

| Trợ lý | Góc nhìn rà soát |
|---|---|
| `@senior-ba` | Tính đầy đủ, liên kết từ nhu cầu/doanh nghiệp đến capability, chỗ mơ hồ. |
| `@po-reviewer` | Giá trị sản phẩm, lý do ưu tiên, capability có vừa tầm để vào backlog không. |
| `@pm-reviewer` | Phụ thuộc, rủi ro, mốc phát hành và tính nhất quán với kế hoạch. |

Họ kiểm tra, trong đó có:

* Capability có dẫn được về nhu cầu người dùng hoặc mục tiêu nghiệp vụ không.
* Capability có quá nhỏ hay quá lớn so với mốc 3–15 story không.
* Chỉ số có baseline, mục tiêu, cách đo và thời gian đo không.
* Có chi tiết kỹ thuật, ROI hay điều kiện kiểm thử lọt nhầm vào PRD-epic không.

Điểm cần hiểu đúng: bước này __không chờ bạn duyệt từng sửa đổi__.

* Lỗi diễn đạt, lỗi nhất quán nội bộ, hoặc bổ sung từ thông tin bạn đã chốt có thể được tự sửa.
* Với quyết định nghiệp vụ cần chọn phương án, hệ thống cũng tự chọn phương án ít rủi ro và nhất quán hơn, rồi áp dụng.
* Những quyết định thay bạn được liệt kê bằng ký hiệu __🔶__ trong báo cáo để bạn xem lại và chỉnh nếu cần.

Nếu muốn tự kiểm soát hoàn toàn phần này, bạn có thể nói “khỏi review” khi chạy lệnh.

***

## 8. Phân biệt ba anh em: `/urd` vs `/brd` vs `/prd-epic`

Ba lệnh này cùng nói về một feature nhưng mỗi lệnh trả lời một câu khác nhau.

| | `/urd` | `/brd` | `/prd-epic` |
|---|---|---|---|
| __Câu hỏi chính__ | Người dùng cần gì? | Doanh nghiệp cần thay đổi vì sao? | Feature sẽ làm gì? |
| __Trọng tâm__ | Nhu cầu, bối cảnh, hành trình, đau điểm của người dùng | Mục tiêu kinh doanh, quy tắc nghiệp vụ, lợi ích, rủi ro | Capability P0/P1/P2, phạm vi, tiêu chí xong, chỉ số, phát hành |
| __Không làm__ | Không chốt giải pháp sản phẩm chi tiết | Không viết ROI/cost model vào PRD-epic | Không viết kỹ thuật, API, ROI hoặc AC chi tiết |
| __Đầu ra dùng tiếp cho__ | Hiểu đúng người dùng | Bảo đảm feature có lý do kinh doanh | Bàn giao sang `/srs` và backlog |

Một câu để nhớ: **`/urd` hỏi người dùng cần gì; `/brd` hỏi doanh nghiệp cần vì sao; `/prd-epic` chốt feature sẽ làm gì.**

Và nhớ thêm một tầng phía trên: **`/prd` không có `-epic` nhìn toàn sản phẩm để bóc nhiều feature; `/prd-epic` đi sâu vào đúng một feature trong số đó.**

***

## 9. Ví dụ thực tế

Chị __Thảo__ là BA của app học tiếng Anh cho người đi làm. PRD toàn sản phẩm đã có feature “Bài học ngắn 5 phút”. URD cho biết người dùng bận, muốn học nhanh và vẫn thấy mình tiến bộ. BRD đặt mục tiêu tăng tỷ lệ học đều hằng tuần.

Chị gõ:

```text
/prd-epic bai-hoc-ngan
```

1) Hệ thống tìm thấy feature “bai-hoc-ngan”, rồi liệt kê URD, BRD và ghi chú brainstorm liên quan. Chị Thảo chọn dùng cả ba.

2) Hệ thống đọc chúng trước. Vì đã biết người dùng là người đi làm bận rộn, nó không hỏi lại. Nó chỉ hỏi phần còn thiếu: “Bản đầu tiên phải có những khả năng nào?”, “Vì sao ưu tiên?”, “Mỗi khả năng có thể bóc khoảng bao nhiêu story?”, “Xong khi nào?”, “Đo thành công thế nào?”

3) Chị Thảo chốt ba capability:
   * P0: chọn bài phù hợp mục tiêu học — vì người dùng cần bắt đầu ngay, ước bóc khoảng 5 story.
   * P0: hoàn thành một bài trong khoảng 5 phút — vì đây là lời hứa cốt lõi của feature, ước khoảng 8 story.
   * P1: gợi ý bài tiếp theo — vì chỉ có ích sau khi đã có lịch sử học, ước khoảng 4 story.

4) Với capability thứ hai, chị nói “xong khi người học học xong”. Hệ thống hỏi làm rõ kết quả quan sát được. Chị sửa thành: “Xong khi người học hoàn thành một bài phù hợp trong một phiên học ngắn và thấy tiến độ được ghi nhận.”

5) Chị chưa có tỷ lệ hoàn thành bài hiện tại. Thay vì bịa số, tài liệu ghi: “Chưa có — xác lập bằng theo dõi 4 tuần đầu.” Chị cũng ghi phụ thuộc nghiệp vụ: đội Nội dung cần bàn giao 50 bài trước ngày thử nghiệm, có người phụ trách và trạng thái theo dõi.

6) Hệ thống tách đề xuất “dùng SDK chấm phát âm” khỏi PRD-epic vì đó là chi tiết kỹ thuật để `/srs` xử lý. Nó cũng không đưa ROI hay chi phí sản xuất bài học vào tài liệu, vì phần đó thuộc BRD.

7) Hệ thống tóm tắt: 3 capability, 2 P0, 1 P1, một chỉ số chưa có baseline, một phụ thuộc nghiệp vụ và vài giả định. Chị Thảo gõ `Y` để duyệt bản tạo ban đầu.

8) Sau đó ba trợ lý tự rà soát. Một lỗi diễn đạt được tự sửa. Một lựa chọn nghiệp vụ được tự quyết để nhất quán với mục tiêu đã chốt và được ghi 🔶 trong báo cáo để chị Thảo xem lại.

Kết quả, chị có một PRD-epic cho riêng “Bài học ngắn 5 phút”: đủ rõ để chạy `/srs bai-hoc-ngan` và đủ gọn để Product Owner bóc backlog, nhưng chưa lấn sang cách lập trình hay bài toán đầu tư.

***

## Xem thêm

Tài liệu này giải thích luồng ở mức dễ hiểu. Muốn xem đầy đủ quy tắc, đọc file gốc: `.claude/skills/prd-epic/SKILL.md`.

Các lệnh liên quan trong dây chuyền:

* `explain-skills/prd.md` — `/prd`: PRD toàn sản phẩm (tầng trên), bóc ra danh sách nhiều feature.
* `explain-skills/urd.md` — `/urd`: làm rõ nhu cầu và hành trình của người dùng trong một feature.
* `explain-skills/brd.md` — `/brd`: làm rõ mục tiêu, quy tắc và giá trị nghiệp vụ của feature.
* `.claude/skills/srs/SKILL.md` — `/srs`: chuyển capability đã chốt thành yêu cầu chức năng và yêu cầu kỹ thuật.
* `.claude/skills/ac/SKILL.md` — `/ac`: viết tiêu chí chấp nhận (Given-When-Then) cho từng user story.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
