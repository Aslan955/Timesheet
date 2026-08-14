---
type: api-readiness
feature: premium-payment
status: draft
updated: 2026-07-15
links: [docs/premium-payment/integration/api-design.md, docs/premium-payment/test/api/api-tests.md, docs/premium-payment/integration/api-summary-paygate.md, docs/premium-payment/integration/api-summary-mailgate.md]
---

# API Readiness — Premium Payment‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Mục 1 — Phạm vi go-live‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Gate này áp dụng trước khi mở thanh toán Premium thật cho khách hàng, gồm:

- PayGate: tạo charge, xác nhận trạng thái charge, kích hoạt Premium, polling event và đối soát.
- MailGate: gửi biên nhận sau charge `succeeded`, theo dõi trạng thái giao email và xử lý bounced.
- Các quy tắc không được vi phạm: không thu tiền hai lần, không kích hoạt Premium khi charge chưa `succeeded`, không lộ khóa đối tác, và không hứa email đã giao khi mới chỉ gửi thành công.

## Mục 2 — Checklist sẵn sàng vận hành‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Hạng mục | Trạng thái | Owner | Ghi chú |
|---|---|---|---|
| Test critical-path PayGate charges | ⚠️ | QA + Payment Engineering | Bruno mock đã PASS cho charge flow. Chưa có bằng chứng chạy trên PayGate sandbox thật; mock PASS không đủ chứng minh sẵn sàng production. |
| Test luồng email biên nhận và bounced | ⚠️ | QA + Payment Engineering | Cần test MailGate sandbox/prod-like: `receipt`, tra `delivered/bounced`, và fallback hiển thị biên nhận trong app. |
| Cutover endpoint PayGate | ⚠️ | Payment Engineering | Chuyển từ `http://localhost:4242` sang `https://paygate.ai4ba.com`. Cần xác nhận endpoint production, allowlist/certificate và smoke test. |
| Cutover endpoint MailGate | ❓ | Payment Engineering | Chuyển từ `http://localhost:4343` sang endpoint MailGate production. Tên miền production chưa được xác nhận trong summary. |
| Credential production và rotation | ❓ | Platform/Security | NFR-004 yêu cầu khóa PayGate/MailGate lưu server-side trong secret store, không log/nhúng client. Credential production và cơ chế xoay khóa chưa rõ. |
| Rate limit production | ✅ | Payment Engineering | PayGate và MailGate đều giới hạn 30 request/10 giây/IP; đã có yêu cầu retry/backoff khi gặp 429. |
| Volume ngày go-live so với quota | ❓ | Product + Payment Engineering | Chưa có ước lượng số charge, polling event và email trong giờ cao điểm để đối chiếu limit 30 req/10s/IP. |
| Idempotency charge | ⚠️ | Payment Engineering | NFR-003 yêu cầu `Idempotency-Key` cho mọi charge để tránh thu trùng; cần xác nhận bằng test sandbox thật và production smoke test. |
| Polling event và không trễ gia hạn | ⚠️ | Payment Engineering + Operations | NFR-005 quy định polling tối đa mỗi 1 phút và lưu con trỏ event. Cơ chế có trong thiết kế; cần chứng minh vận hành và cảnh báo khi polling chậm/trễ. |
| Feature flag và rollout | ⚠️ | Product + Engineering | Chưa có kế hoạch. Đề xuất feature flag, canary với nhóm nhỏ và tăng dần sau khi theo dõi outcome ổn định. |
| Monitoring business outcome | ⚠️ | SRE/Operations | Cần dựng dashboard cho: tỷ lệ `charge succeeded`, email `delivered` so với `bounced`, và polling không trễ gia hạn. |
| Alert owner và escalation path | ❓ | Engineering Manager + Operations | Chưa có người nhận cảnh báo 401, 429, lỗi polling, charge chênh lệch hoặc email bounce tăng bất thường. |
| Đầu mối incident PayGate/MailGate | ❓ | Partner Manager | Chưa có contact/escalation path phía hai đối tác. |
| Kill-switch và degraded mode | ✅ | Product + Payment Engineering | Khi PayGate down: chặn mua và hiển thị “Đang bảo trì thanh toán”; không xác nhận Premium hoặc thu tiền theo trạng thái chưa rõ. |
| Hoàn tiền (refund) | ⚠️ | Finance Operations + Payment Engineering | FR-012 + BR-003 (chỉ hoàn charge `succeeded`) đụng tiền thật ra ngoài. Cần test flow refund trên sandbox + xác nhận thu hồi Premium sau refund (OQ trong api-design). Chưa có gate riêng. |
| Hạ cấp Free sau 3 ngày (BR-002/FR-009) | ⚠️ | Payment Engineering + Product | Quy tắc đụng quyền lợi khách: thuê bao charge.failed liên tục 3 ngày → hạ Free. Có timing + edge case (đếm ngày). Cần verify job/logic hạ cấp trước go-live. |
| Reconciliation charge/email | ⚠️ | Finance Operations + Payment Engineering | Có cơ chế polling event tối đa 1 phút và đối soát charge/email. Lịch đối soát cuối ngày cùng owner xử lý chênh lệch chưa chốt. |
| Manual recovery runbook | ⚠️ | Operations + Payment Engineering | Cần runbook cho tiền đã trừ nhưng chưa kích hoạt Premium, polling miss, charge/email chênh lệch, và email bounced. |
| Production smoke test | ⚠️ | QA + Payment Engineering | Chưa có kế hoạch smoke test charge thật/sandbox thật, xác nhận Premium và gửi/tra trạng thái biên nhận sau cutover. |
| Rollback và cutover window | ⚠️ | Product + Operations | Chưa có tiêu chí rollback hoặc cửa sổ cutover. Đề xuất cutover giờ thấp điểm, có người trực và khả năng tắt feature flag ngay. |
| Version và deprecation PayGate | ❓ | Payment Engineering + Partner Manager | Endpoint đang pin `/v1`; **tài liệu tóm tắt cũ** từng nhắc "PayGate v2" — cần xác nhận version contract thực tế đang dùng. Chưa có deprecation policy hoặc thời hạn thông báo thay đổi. |
| Impact khi contract thay đổi | ⚠️ | Payment Engineering | Cần owner theo dõi thay đổi trạng thái charge/subscription, error code, event feed, template MailGate và rate limit. |
| Go/no-go sign-off | ❓ | Product Owner + Engineering Lead + Operations | Chưa có danh sách người phê duyệt và thời điểm ký gate. |

## Mục 3 — Kế hoạch rollout và giảm thiểu ảnh hưởng‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Đề xuất rollout theo feature flag:

1. Hoàn tất test trên sandbox thật cho PayGate và MailGate, gồm success, decline, timeout/unknown outcome, 429, polling event và bounced.
2. Cutover trong giờ thấp điểm, với Payment Engineering, QA và Operations trực theo dõi.
3. Canary cho nhóm nhỏ khách hàng nội bộ/được chọn; theo dõi tỷ lệ charge `succeeded`, tỷ lệ email `delivered`, lỗi 401/429 và độ trễ polling.
4. Mở rộng dần chỉ khi không có chênh lệch charge–Premium và polling không trễ gia hạn.
5. Tắt feature flag ngay khi PayGate lỗi diện rộng, có chênh lệch tiền–quyền lợi, hoặc vượt ngưỡng lỗi chưa được phê duyệt.

## Mục 4 — Xử lý sự cố, đối soát và phục hồi‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

- Khi PayGate không khả dụng hoặc phản hồi chưa rõ: chặn mua mới, hiển thị “Đang bảo trì thanh toán”, không cấp Premium trước khi charge được xác nhận `succeeded`.
- Khi charge `succeeded` nhưng ghi nhận Premium hoặc email thất bại: đưa vào hàng đợi manual recovery; PayGate là nguồn xác nhận cuối cho trạng thái thu tiền.
- Polling event phải chạy tối đa mỗi 1 phút và lưu con trỏ event cuối đã xử lý. Mọi khoảng trễ vượt ngưỡng cần tạo cảnh báo.
- Đối soát charge và email cần có lịch cuối ngày, owner và thời hạn xử lý chênh lệch chưa chốt.
- Với email `bounced`, biên nhận vẫn phải có trong app; quyết định gửi lại hoặc thông báo khách còn là câu hỏi mở.

## Mục 5 — Theo dõi version và thay đổi contract

PayGate đang được gọi qua endpoint `/v1`; **tài liệu tóm tắt cũ** từng nhắc "PayGate v2" (bản summary hiện tại pin `/v1`) — cần xác nhận version contract thực tế đang dùng trước cutover. Chưa có chính sách deprecation của PayGate, cũng chưa có cam kết thông báo thay đổi của MailGate.

Trước go-live, Partner Manager và Payment Engineering phải xác nhận:

- Version API, endpoint production và lịch deprecation của từng đối tác.
- Kênh nhận thông báo thay đổi contract, quota, trạng thái event và template email.
- Owner đánh giá tác động và kế hoạch test lại khi contract thay đổi.

## Mục 6 — Quyết định go/no-go

| Điều kiện quyết định | Bằng chứng / ghi chú | Người xác nhận | Trạng thái |
|---|---|---|---|
| Critical-path đã chạy trên môi trường thật/prod-like | Hiện chỉ có Bruno mock PASS; chưa test PayGate sandbox thật. | QA Lead + Payment Engineering | ⚠️ |
| Credential production an toàn và có rotation | NFR-004 đã yêu cầu secret server-side; credential và rotation chưa xác nhận. | Platform/Security | ❓ |
| Monitoring và alert có owner | Chưa có dashboard business outcome, alert owner hoặc escalation path. | SRE/Operations | ⚠️ |
| Incident contact đối tác | Chưa có đầu mối PayGate/MailGate. | Partner Manager | ❓ |
| Rollout, rollback và cutover window | Chưa có kế hoạch được phê duyệt. | Product Owner + Operations | ⚠️ |
| Đối soát và manual recovery | Có polling/reconciliation mechanism; lịch cuối ngày và runbook chưa chốt. | Finance Operations + Payment Engineering | ⚠️ |
| Version/deprecation đã rõ | Pin `/v1` nhưng version contract và deprecation policy chưa xác nhận. | Payment Engineering + Partner Manager | ❓ |

**Quyết định đề xuất: GO CÓ ĐIỀU KIỆN**

Không thể kết luận GO tuyệt đối vì chưa có bằng chứng test trên sandbox PayGate thật. Trước cutover phải hoàn tất:

1. PASS critical-path trên PayGate sandbox thật và MailGate prod-like, lưu evidence gồm ngày chạy, môi trường và kết quả.
2. Xác nhận credential production, lưu server-side, quy trình rotation và production smoke test.
3. Thiết lập dashboard/alert cho charge succeeded, email delivered/bounced và độ trễ polling; gán owner trực.
4. Chốt incident contact/escalation với PayGate và MailGate.
5. Phê duyệt feature flag, canary, rollback criteria và cutover giờ thấp điểm.
6. Chốt lịch đối soát cuối ngày, manual recovery runbook và owner xử lý chênh lệch.
7. Xác nhận endpoint/version production cùng chính sách deprecation.

## Mục 7 — Câu hỏi mở / điều kiện còn thiếu

1. Credential production của PayGate và MailGate được cấp cho ai, lưu ở secret store nào, và xoay khóa theo lịch/quy trình nào?
2. MailGate production base URL, allowlist và yêu cầu certificate là gì?
3. Volume go-live và giờ cao điểm có vượt hoặc tiệm cận 30 request/10 giây/IP không?
4. Ai là alert owner, người trực cutover và đầu mối incident của từng đối tác?
5. Ngưỡng nào sẽ kích hoạt rollback hoặc tắt feature flag?
6. Lịch đối soát charge/email cuối ngày, SLA xử lý chênh lệch và runbook recovery là gì?
7. PayGate đang pin version contract nào, và chính sách deprecation/thông báo thay đổi của PayGate và MailGate là gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍



<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
