---
type: skill-explainer
skill: api-readiness
updated: 2026-07-15
---

# `/api-readiness` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/api-readiness` là **cổng kiểm tra sẵn sàng trước khi cho một API hoặc tích hợp chạy thật với khách hàng** — nghề hay gọi là *go-live / operational readiness* (sẵn sàng vận hành).

Ẩn dụ đời thường: chạy thử xe trong sân đậu xe **khác** với sẵn sàng chở khách ra đường lớn. Xe có thể nổ máy, chạy được vài vòng, phanh ổn — nhưng trước khi mở cửa đón khách, bạn vẫn phải kiểm tra đủ xăng chưa, giấy tờ có đủ không, số cứu hộ ở đâu, ai lái, có đường quay về nếu xe hỏng giữa đường không.

API cũng vậy. `/api-test` cho biết lần thử có đậu hay không; `/api-readiness` hỏi thêm: **nếu khách thật dùng đông, nếu đối tác lỗi, nếu dữ liệu bị lệch hoặc cần dừng gấp, cả nhóm đã biết làm gì chưa?**

Nên dùng lệnh này khi:

* Tích hợp đã có thiết kế và đã bắt đầu hoặc hoàn tất chạy thử.
* Nhóm chuẩn bị đổi từ môi trường thử (*sandbox*) sang môi trường thật (*production*).
* Có ngày go-live, cần người chịu trách nhiệm ký quyết định cho chạy.
* Muốn tránh tình huống “test đậu rồi mà lên thật vẫn rối”.

Gõ lệnh như:

```text
/api-readiness --feature premium-payment
```

(nghĩa là: kiểm tra độ sẵn sàng go-live cho tính năng `premium-payment`).

**Một câu để nhớ:** `/api-readiness` không hỏi “API có chạy thử đậu không?” mà hỏi “nếu mở cửa phục vụ khách thật ngay bây giờ, nhóm đã đủ người, đủ kế hoạch và đủ đường lùi chưa?”.

***

## 2. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
 BẠN GÕ LỆNH
 /api-readiness --feature premium-payment
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Xác định tính năng cần lên thật              │
 │ Hiểu API/tích hợp nào chuẩn bị go-live. Nếu mơ hồ,   │
 │ hỏi bạn chọn đúng tính năng, không tự đoán bừa.       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Đọc bằng chứng đang có                       │
 │ Đọc bản thiết kế tích hợp, kết quả test và tóm tắt   │
 │ đối tác (SLA, phiên bản API, mốc ngừng hỗ trợ...).   │
 │ Không coi kết quả PASS cũ là production-ready.       │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — Lập checklist sẵn sàng                       │
 │ Soát đổi môi trường, người trực lỗi, rollout từ từ, │
 │ theo dõi nghiệp vụ, công tắc tắt, đối soát,          │
 │ rollback và đầu mối đối tác.                          │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Gắn rõ trạng thái + người chịu trách nhiệm  │
 │ Mỗi mục đều có: sẵn sàng / thiếu / cần xác nhận,    │
 │ owner cụ thể và ghi chú bằng chứng hoặc việc còn lại.│
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 5 — Xem trước rồi mới ghi (xin phép)             │
 │ Báo sẽ tạo/cập nhật file nào, còn bao nhiêu điểm     │
 │ thiếu và những ai cần sign-off. Bạn đồng ý mới ghi.  │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 6 — Đưa ra verdict go-live                       │
 │ Kết luận GO, GO CÓ ĐIỀU KIỆN hoặc NO-GO; không cho   │
 │ GO tuyệt đối nếu chưa có bằng chứng test phù hợp.    │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     HOÀN TẤT — có một “bảng kiểm trước giờ mở cửa”
```

***

## 3. Vì sao test-đậu KHÁC sẵn-sàng production?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

**Test PASS** nghĩa là: ở một thời điểm, với dữ liệu và môi trường đã thử, những tình huống được chạy cho kết quả đúng kỳ vọng.

Nhưng production là nơi có khách thật, tiền thật, dữ liệu thật và áp lực thật. Ở đó có thể khác môi trường thử ở rất nhiều chỗ:

* Khóa truy cập, địa chỉ kết nối, chứng chỉ hoặc danh sách IP được phép có thể khác.
* Môi trường thật có giới hạn số lần gọi (*rate limit / quota*) chặt hơn; test đậu nhưng lúc đông khách vẫn có thể bị từ chối.
* Đối tác có thể phản hồi chậm, tạm gián đoạn hoặc đổi phiên bản API.
* Khi có lỗi, cần biết **ai nhận cảnh báo**, gọi ai tiếp theo và khách hàng sẽ thấy gì.
* Nếu dừng tích hợp, dữ liệu đang dang dở xử lý thế nào, ai đối soát lại?

Vì vậy, “đậu trong công cụ thử” là một điều kiện quan trọng, nhưng mới là **một phần** của việc sẵn sàng vận hành.

Có một giới hạn an toàn rất rõ: nếu chưa có kết quả test (`api-tests.md`), hoặc các test quan trọng còn rớt/bỏ qua, `/api-readiness` **không bao giờ** kết luận `GO` tuyệt đối. Cao nhất chỉ có thể là `GO CÓ ĐIỀU KIỆN`.

***

## 4. Checklist go-live gồm những gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Lệnh tạo một checklist; mỗi dòng luôn có **trạng thái**, **owner** (người/vai trò chịu trách nhiệm) và **ghi chú**. Ba nhãn trạng thái là:

* `✅ sẵn sàng` — đã có bằng chứng hoặc xác nhận rõ ràng.
* `⚠️ thiếu` — chưa có, cần hoàn tất trước go-live.
* `❓ cần xác nhận` — chưa đủ thông tin để kết luận, cần đúng người trả lời.

Các nhóm cần kiểm tối thiểu gồm:

* **Đổi môi trường thật** (*cutover*): đổi khóa, địa chỉ API, chứng chỉ, allowlist (*danh sách địa chỉ được phép gọi*) và các cấu hình từ thử sang thật.
* **Kết quả test đường chính**: các tình huống quan trọng nhất đã PASS ở môi trường nào, vào ngày nào.
* **Năng lực chịu tải**: lượng giao dịch dự kiến ngày đầu có nằm trong giới hạn và cam kết của đối tác không.
* **Ra mắt từ từ**: có feature flag (công tắc bật/tắt tính năng) và canary/phased rollout (mở cho một nhóm nhỏ trước) không.
* **Theo dõi kết quả nghiệp vụ**: theo dõi “giao dịch tạo thành công”, “học viên được đồng bộ” — không chỉ nhìn API trả mã `200`.
* **Người trực sự cố**: ai nhận cảnh báo, đường escalation (chuyển việc khẩn cấp lên cấp tiếp theo) là gì.
* **Đầu mối đối tác**: khi lỗi nằm phía đối tác thì liên hệ ai, theo kênh nào.
* **Dừng khẩn và đường lùi**: kill-switch (*công tắc tắt ngay tính năng khi có sự cố lớn*), fallback/degraded mode (*chế độ chạy tạm/hạn chế khi đối tác lỗi, thay vì sập hẳn*), tiêu chí rollback (*khi nào thì quyết định lùi về bản cũ*).
* **Đối soát và phục hồi**: lịch reconciliation (đối soát), cách xử lý thủ công dữ liệu dang dở.
* **Theo dõi thay đổi API**: đang dùng phiên bản nào, đối tác dự kiến ngừng hỗ trợ khi nào, đổi contract thì ảnh hưởng gì.
* **Quyết định cuối**: ai có quyền ký `GO`, ai chấp nhận các điều kiện còn mở.

***

## 5. Ba mức GO / GO CÓ ĐIỀU KIỆN / NO-GO

`/api-readiness` không tự “bật đèn xanh” mơ hồ. Nó buộc nhóm chọn một trong ba mức rõ ràng:

| Mức | Nghĩa là gì |
|---|---|
| `GO` | Các điều kiện quan trọng đã đủ bằng chứng, owner rõ, có thể chạy thật. |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| `GO CÓ ĐIỀU KIỆN` | Có thể chạy nhưng còn điều kiện phải hoàn tất, giới hạn phạm vi hoặc theo dõi sát. |
| `NO-GO` | Chưa nên chạy thật vì rủi ro lớn cho tiền, dữ liệu, quyền lợi khách hàng hoặc không có người xử lý sự cố. |

Ví dụ: test đậu nhưng chưa có số điện thoại trực sự cố của đối tác. Nếu API này chỉ làm một việc phụ, nhóm có thể chọn `GO CÓ ĐIỀU KIỆN` và chỉ mở cho 5% khách trước. Nhưng nếu API dùng để thu tiền mà chưa có rollback hay đối soát, đó thường là `NO-GO`.

Điểm quan trọng: `GO CÓ ĐIỀU KIỆN` không có nghĩa “cứ chạy đại”. Nó phải ghi rõ:

* Điều kiện nào còn thiếu.
* Ai hoàn tất.
* Hoàn tất trước mốc nào.
* Trong lúc chờ, chỉ được mở cho phạm vi nào.
* Nếu điều kiện không đạt thì phải dừng hay lùi lại ra sao.

***

## 6. Việc của BA khác việc của dev/DevOps thế nào?

BA hoặc PO **không bị bắt tự cấu hình kỹ thuật**. Vai trò của BA là làm cho kế hoạch vận hành rõ ràng, kiểm tra được và có người chịu trách nhiệm.

BA/PO sẽ ghi nhận:

* Ngày, phạm vi và cách rollout.
* Kết quả nghiệp vụ cần theo dõi.
* Khách hàng chịu ảnh hưởng gì nếu có lỗi.
* Tiêu chí phải rollback và cách xử lý các trường hợp dang dở.
* Lịch đối soát, người liên hệ đối tác và các sign-off cần có.

Dev/DevOps sẽ triển khai phần kỹ thuật:

* Cấu hình feature flag, canary và kill-switch.
* Đổi credential, endpoint, certificate, allowlist.
* Cài monitoring, alerting, dashboard, quota/rate-limit.
* Chuẩn bị hạ tầng, smoke test production và cơ chế phục hồi.

Nói ngắn gọn: **BA ghi kế hoạch “cần bảo đảm điều gì, ai chịu trách nhiệm, khách bị ảnh hưởng thế nào”; dev/DevOps làm cấu hình để kế hoạch đó hoạt động.**

***

## 7. Kết quả để ở đâu? Và khi nào cần chạy lại?

Kết quả nằm cố định tại:

```text
docs/{feature}/integration/api-readiness.md
```

Ví dụ:

```text
docs/premium-payment/integration/api-readiness.md
```

File này là “ảnh chụp sẵn sàng” tại một thời điểm, nên nó luôn cần ghi rõ bằng chứng đến từ môi trường nào và ngày nào. Một kết quả PASS từ tuần trước không tự động chứng minh hôm nay vẫn sẵn sàng.

Sau khi go-live, nên gọi lại `/api-readiness` khi:

* Có kết quả test mới hoặc lỗi mới.
* Đổi ngày cutover, đổi cách rollout hoặc đổi owner trực sự cố.
* Đối tác thay đổi SLA, quota, phiên bản API hay thông báo deprecation (ngừng hỗ trợ).
* Có sự cố production, cần cập nhật runbook và điều kiện rollback.
* Chuẩn bị mở rộng từ nhóm khách nhỏ sang toàn bộ khách hàng.

Nếu file đã tồn tại, lệnh hiểu đây là **cập nhật**, cho xem phần thay đổi trước khi ghi.

***

## 8. Vị trí trong họ lệnh API

`/api-readiness` là bước **[5] cuối** trong hành trình API:

```text
/api-assess → /api-doc → /api-design ──┬── /api-map ([2] kèm)
                                       └── (cách phối hợp)
                                              │ map hội tụ vào design, rồi mới:
                                              ▼
                          /api-checklist → /api-test → /api-readiness  ← bạn đang ở đây
```

Nó không đánh giá lại “có nên chọn đối tác này không” — đó là `/api-assess`. Nó cũng không thay `/api-test` để bấm chạy và ghi đậu/rớt. Việc của readiness là nối các bằng chứng đó với câu hỏi vận hành cuối cùng:

> “Sáng mai mở cho khách thật, nếu mọi thứ không như dự tính, chúng ta có biết ai làm gì không?”

***

## Xem thêm

Tài liệu này giải thích ở mức dễ hiểu. Chi tiết đầy đủ về checklist, giới hạn verdict và cấu trúc tài liệu nằm ở `.claude/skills/api-readiness/SKILL.md`.

Các lệnh liên quan trong cùng họ:

* `explain-skills/api-family.md` — bức tranh của toàn bộ 7 lệnh API.
* `/api-test` — chạy thử và ghi nhận PASS/FAIL trước readiness.
* `/api-checklist` — lập các tình huống cần thử để tránh sót rủi ro.
* `/api-design` — thiết kế cách hai hệ thống phối hợp, xử lý lỗi và đối soát.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
