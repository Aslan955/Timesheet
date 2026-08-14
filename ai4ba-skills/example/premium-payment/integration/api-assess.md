---
type: api-assess
feature: premium-payment
status: draft
updated: 2026-07-15
links: [docs/premium-payment/integration/api-summary-paygate.md, docs/premium-payment/integration/api-summary-mailgate.md, docs/premium-payment/premium-payment-prd.md]
---

# Đánh giá đối tác API — Premium Payment‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Mục 1 — Bối cảnh và quyết định cần hỗ trợ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Ứng dụng học tiếng Anh cần bán gói Premium theo hình thức mua một lần, thuê bao tháng hoặc năm; đồng thời gửi email biên nhận và thông báo thanh toán thất bại.

> __Minh bạch về quyết định:__ thực tế __PayGate đã được chọn__ và đã có sandbox mock. Tài liệu này là __assessment hồi tố__ nhằm minh hoạ tiêu chí đánh giá đối tác, không mô tả một quyết định mua sắm đang mở.

Đánh giá bao gồm PayGate cho thanh toán và MailGate cho email giao dịch. Phương án tham chiếu được dùng để so sánh là tích hợp trực tiếp một cổng thanh toán nội địa khác, trong khi vẫn cần một dịch vụ email giao dịch tương đương MailGate.

__Nhãn tin cậy nguồn__

| Nhãn | Ý nghĩa |
|---|---|
| Xác thực từ tài liệu | Có trong API summary hoặc SRS đã cung cấp |
| Assumption demo | Giả định hợp lý để minh hoạ, chưa phải cam kết |
| Cần làm rõ | Thiếu evidence; cần câu hỏi mở hoặc xác nhận đối tác |

## Mục 2 — Phương án đánh giá‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Phương án | Mô tả | Vai trò trong assessment |
|---|---|---|
| A — PayGate + MailGate | PayGate hỗ trợ charges, subscriptions, refunds và event polling; MailGate hỗ trợ email giao dịch theo template. | Phương án đã chọn thực tế |
| B — Cổng nội địa tích hợp trực tiếp + dịch vụ email tương đương | Tự tích hợp một cổng thanh toán nội địa khác và vẫn cần dịch vụ gửi email giao dịch. Không có tài liệu nhà cung cấp, báo giá hoặc SLA trong scope. | Phương án tham chiếu để thấy khoảng evidence cần có trước khi chọn |

## Mục 3 — Scorecard và evidence‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Tiêu chí | A — PayGate + MailGate | B — Cổng nội địa tích hợp trực tiếp + email tương đương | Evidence |
|---|---|---|---|
| Business fit | __Phù hợp.__ Hỗ trợ bán Premium một lần và thuê bao; email phục vụ biên nhận, báo lỗi thanh toán và chào mừng Premium. | __Cần làm rõ.__ Chưa biết cổng tham chiếu có hỗ trợ thuê bao, hoàn tiền và trạng thái bất đồng bộ theo nhu cầu hay không. | Xác thực từ SRS Mục 1–4; API summaries |
| Capability coverage | __Phù hợp.__ PayGate có charges, subscriptions, refunds, events; MailGate có `receipt`, `payment_failed`, `welcome_premium`. | __Cần làm rõ.__ Chưa có contract/API catalog để đối chiếu charge, subscription, refund, event và template email. | Xác thực từ hai API summary |
| Integration effort tương đối | __Phù hợp cho demo.__ Đã có mock PayGate tại `localhost:4242`, MailGate tại `localhost:4343`; PayGate có magic token `tok_*` để kiểm tra các nhánh thanh toán. | __Cần làm rõ.__ Chưa có sandbox, tài liệu, contract hay effort estimate của phương án tham chiếu. | Xác thực từ API summaries; riêng mức effort production là Cần làm rõ |
| Maturity / reliability | __Cần làm rõ.__ Không có uptime lịch sử, số khách hàng, incident công khai hoặc dữ liệu vận hành thật của PayGate/MailGate. | __Cần làm rõ.__ Chưa xác định nhà cung cấp để đánh giá. | Không có evidence trong nguồn cung cấp |
| SLA / support | __Cần làm rõ.__ Chưa có SLA, giờ hỗ trợ, kênh escalation hay cam kết xử lý incident. | __Cần làm rõ.__ Chưa có proposal hoặc SLA. | Không có evidence trong nguồn cung cấp |
| Sandbox / dev-experience | __Phù hợp.__ PayGate có sandbox mock `localhost:4242`, endpoint tạo event test và magic token `tok_chargeable`, `tok_declined`, `tok_insufficient`, `tok_expired`, `tok_cvc_fail`, `tok_error`. | __Cần làm rõ.__ Chưa có bằng chứng sandbox, test card/token hay công cụ mô phỏng event. | Xác thực từ API Summary — PayGate Mục 3 và 5 |
| Security / compliance | __Cần làm rõ.__ Có yêu cầu Bearer key lưu server-side, secret theo môi trường và không lộ client; chưa rõ chứng nhận PCI, phạm vi trách nhiệm dữ liệu thẻ, rotation key và compliance production. | __Cần làm rõ.__ Chưa có tài liệu bảo mật hoặc chứng nhận. | Xác thực một phần từ SRS NFR-004 và API summaries |
| Cost / commercial constraint | __Cần làm rõ.__ Không có bảng giá, phí giao dịch, phí refund, phí email, mức cam kết tối thiểu hoặc điều khoản thanh toán. | __Cần làm rõ.__ Không có báo giá để so sánh. | Không có evidence trong nguồn cung cấp |
| Data ownership / portability | __Cần làm rõ, có giảm thiểu một phần.__ App lưu bản sao `Payment`, `Subscription`, `EmailMessage` để hiển thị và đối soát; chưa rõ quyền export dữ liệu gốc, retention và xóa dữ liệu ở đối tác. | __Cần làm rõ.__ Chưa có chính sách dữ liệu của cổng tham chiếu. | Xác thực một phần từ SRS Mục 1 và 6 |
| Versioning / deprecation policy | __Cần làm rõ.__ API dùng đường dẫn `/v1`; chưa có chính sách version, deprecation window hoặc cách thông báo breaking change. | __Cần làm rõ.__ Chưa có tài liệu API. | Xác thực một phần từ API summaries |
| Vendor lock-in + exit plan | __Phù hợp có điều kiện.__ Bản sao nghiệp vụ nội bộ giảm phụ thuộc cho lịch sử, hiển thị và đối soát. Tuy vậy, token thẻ, customer/payment method và luồng subscription có thể không chuyển được nếu chưa xác nhận khả năng export/migration. | __Cần làm rõ.__ Chưa có cơ sở đánh giá lock-in của phương án tham chiếu. | Xác thực một phần từ SRS Mục 1; phần portability là Cần làm rõ |

## Mục 4 — Trade-off, rủi ro và phương án thoát‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

__Lợi ích đã có evidence__

- PayGate đáp ứng các capability trọng yếu: charge, thuê bao, refund, tra cứu và event polling.
- MailGate có đúng template phục vụ receipt, payment failure và welcome Premium.
- Sandbox và magic token của PayGate cho phép kiểm thử nhánh thành công, từ chối thẻ, thiếu tiền, thẻ hết hạn, sai CVC và lỗi tạm trước khi cam kết production.
- App đã định nghĩa lưu bản sao `Payment`, `Subscription` và `EmailMessage`, hỗ trợ lịch sử giao dịch, quyền lợi Premium và đối soát độc lập với màn hình của đối tác.

__Rủi ro cần quản trị__

| Rủi ro | Tác động nghiệp vụ | Hướng xử lý trước go-live |
|---|---|---|
| Chưa có SLA, uptime hoặc đầu mối incident | Không xác định được mức chấp nhận gián đoạn cho thu tiền và email. | Lấy SLA, support hours, escalation path và lịch sử reliability từ đối tác. |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| Chưa rõ PCI/compliance và rotation key | Rủi ro xử lý dữ liệu thanh toán, cấu hình sai credential hoặc không đáp ứng yêu cầu tuân thủ. | Xác nhận trách nhiệm PCI, phạm vi dữ liệu thẻ, key rotation và chứng nhận liên quan. |
| Chưa có pricing | Không đánh giá được biên lợi nhuận của gói 99.000đ/tháng và 990.000đ/năm. | Lấy bảng phí charge, refund, subscription và email; mô hình hoá chi phí theo volume dự kiến. |
| Không có webhook thật, dùng polling events | Cập nhật trạng thái thuê bao có thể trễ; cần kiểm soát không bỏ sót event. | Giữ con trỏ event cuối, poll tối đa mỗi phút theo NFR-005 và kiểm tra đối soát định kỳ. |
| Lock-in ở payment method, customer và subscription | Chuyển cổng có thể yêu cầu người dùng nhập lại thẻ hoặc đăng ký lại thuê bao. | Xác nhận khả năng export/migration; duy trì ID đối tác và bản sao trạng thái nội bộ; lập kế hoạch truyền thông nếu phải re-authorize. |
| Email gửi thành công chưa đồng nghĩa giao thành công | User có thể không nhận biên nhận dù thanh toán thành công. | Tra `message.status`; khi `bounced`/`failed`, hiển thị biên nhận trong app theo Error Matrix. |

__Phương án thoát__

1. Duy trì dữ liệu nghiệp vụ nội bộ là nguồn phục vụ lịch sử, quyền lợi và đối soát; không chỉ dựa vào portal đối tác.
2. Lưu liên kết giữa bản ghi nội bộ và ID `ch_`, `sub_`, `re_`, `msg_` của đối tác để truy vết trong giai đoạn chuyển đổi.
3. Trước khi ký hoặc go-live, xác nhận export dữ liệu, retention, quy trình đóng tài khoản và khả năng chuyển subscription/payment method.
4. Nếu phải đổi PayGate, coi việc người dùng nhập lại phương thức thanh toán hoặc đăng ký lại thuê bao là rủi ro cần có kế hoạch truyền thông; chưa được giả định là migration tự động.

## Mục 5 — Assumption và câu hỏi mở

__Assumption demo__

| ID | Assumption | Ảnh hưởng |
|---|---|---|
| A-01 | App học tiếng Anh dự kiến bán Premium cho người dùng Việt Nam với gói tháng/năm và có thể có mua một lần. | Là cơ sở đánh giá business fit. |
| A-02 | Phương án B là một cổng nội địa giả định, chưa có tên nhà cung cấp và chưa có tài liệu. | Chỉ dùng làm baseline; không được xem là đánh giá vendor thực tế. |
| A-03 | PayGate và MailGate trong nguồn là mock/tài liệu đào tạo; thông tin production phải được xác minh lại. | Không suy diễn SLA, compliance, pricing hoặc maturity từ sandbox. |

__Câu hỏi mở__

| ID | Câu hỏi | Owner cần xác nhận | Mức ảnh hưởng |
|---|---|---|---|
| OQ-01 | SLA uptime, maintenance window, support hours và escalation path của PayGate/MailGate là gì? | Đối tác + Product/Operations | Cao |
| OQ-02 | PayGate có chứng nhận PCI nào, phạm vi trách nhiệm dữ liệu thẻ và quy trình rotation/revocation key ra sao? | PayGate + Security | Cao |
| OQ-03 | Bảng giá charge, refund, subscription, email và điều khoản thương mại production là gì? | Procurement/Product + đối tác | Cao |
| OQ-04 | Chính sách versioning, deprecation và thông báo breaking change của cả hai API là gì? | PayGate/MailGate | Trung bình |
| OQ-05 | Có thể export customer, payment, subscription, refund và email log không; retention/xóa dữ liệu thế nào? | PayGate/MailGate + Legal | Cao |
| OQ-06 | Cơ chế xoay khóa PayGate production là gì? | PayGate + Engineering | Cao |
| OQ-07 | Khi MailGate trả `bounced`, có gửi lại hay thông báo in-app cho người dùng không? | Product + MailGate | Trung bình |
| OQ-08 | Ai là người có quyền sign-off quyết định vendor và go-live? | Product Sponsor | Cao |

## Mục 6 — Khuyến nghị

__Khuyến nghị:__ tiếp tục chọn __PayGate + MailGate__ cho Premium Payment.

Đây là lựa chọn hồi tố phù hợp với evidence hiện có: PayGate đủ capability cho one-time payment, subscription, refund và event handling; MailGate có các template email nghiệp vụ cần thiết; sandbox PayGate cùng magic token hỗ trợ phát triển và kiểm thử rõ ràng hơn phương án tham chiếu chưa có tài liệu.

__Điều kiện bắt buộc trước go-live__

1. Làm rõ và được chấp thuận SLA/support, pricing/commercial terms và PCI/security responsibility.
2. Xác nhận key rotation, data export/retention, versioning/deprecation và đầu mối incident.
3. Chốt cách xử lý email `bounced` và kế hoạch thoát khỏi vendor cho payment method/subscription.
4. Chuyển các điều kiện trên sang checklist `/api-readiness`; không coi sandbox evidence là bằng chứng production readiness.

__Owner quyết định:__ Cần xác nhận Product Sponsor hoặc người có thẩm quyền mua sắm; Engineering, Security và Operations là các bên đồng xác nhận điều kiện go-live.

__Bước tiếp theo:__ chạy `/api-readiness --feature premium-payment` để chuyển các câu hỏi OQ-01 đến OQ-08 thành gate có owner, evidence và quyết định go/no-go.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
