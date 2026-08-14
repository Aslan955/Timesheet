---
type: api-tests
feature: premium-payment
status: draft
updated: 2026-07-15
links: [docs/premium-payment/test/api/api-checklist.md, docs/premium-payment/integration/api-summary-paygate.md, docs/premium-payment/integration/api-summary-mailgate.md, docs/premium-payment/integration/api-design.md, .claude/scripts/bruno-runner.mjs]
---

# API Tests — PayGate + MailGate‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> **Bảng test case = source of truth cho TEST-CASE SPECIFICATION (kiểm thế nào).** Coverage + intent sống ở `api-checklist.md`; kết quả run là **evidence theo từng lần chạy** (env + thời điểm), KHÔNG phải trạng thái hiện tại. Skill sinh collection **Bruno** (`bruno/*.bru`) từ bảng này. Secret chỉ trong `bruno/.env` (gitignored); Bruno nạp qua `{{process.env.*_KEY}}`. Khóa KHÔNG ghi vào file này.

## Cách chạy‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

**A. Headless (CLI) — ghi kết quả ngược bảng:**

```bash
# 1. Tạo bruno/.env từ template rồi điền key (1 lần)
cp docs/premium-payment/test/api/bruno/.env.example docs/premium-payment/test/api/bruno/.env
# (mở bruno/.env điền PAYGATE_KEY / MAILGATE_KEY)

# 2. Bật mock (nếu test env mock)
node _teaching/buoi-6-integrate/mock-paygate/mock-paygate.js &
node _teaching/buoi-6-integrate/mock-mailgate/mock-mailgate.js &

# 3. Sinh lại .bru từ bảng + chạy suite (ghi kết quả ngược bảng) — runner dùng chung
node .claude/scripts/bruno-runner.mjs run --dir docs/premium-payment/test/api --env mock

# Chọn lọc / theo provider / sandbox
node .claude/scripts/bruno-runner.mjs run --dir docs/premium-payment/test/api --env mock --tc TC-02,TC-03
node .claude/scripts/bruno-runner.mjs run --dir docs/premium-payment/test/api --env mock --provider mailgate
node .claude/scripts/bruno-runner.mjs run --dir docs/premium-payment/test/api --env sandbox   # prod cần --allow-prod

# Chỉ regen collection .bru (không chạy)
node .claude/scripts/bruno-runner.mjs gen --dir docs/premium-payment/test/api
```

Runner chung gọi `npx @usebruno/cli`, parse report rồi ghi `✅ PASS`/`❌ FAIL`/`⏳ PENDING` + thời điểm vào cột cuối + thêm dòng **Lịch sử chạy**.

**B. Trong IDE (Bruno extension):** mở folder `bruno/` (Bruno: Open Collection) → chọn env → click từng request hoặc Collection Runner. *GUI KHÔNG tự ghi kết quả về bảng — dùng cách A.*

## Biến môi trường‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Biến | Nơi điền | Mục đích |
|------|----------|----------|
| `PAYGATE_BASE` / `MAILGATE_BASE` | `bruno/environments/{mock,sandbox,prod}.bru` | Base URL per env (committed, KHÔNG secret) |
| `PAYGATE_KEY` | `bruno/.env` (gitignored) | Bearer key `sk_test_...` (mock `sk_test_demo_4242`) |
| `MAILGATE_KEY` | `bruno/.env` (gitignored) | Bearer key `mg_test_...` (khác PayGate; mock `mg_test_demo_4343`) |

## Test cases‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Cột **`Ref`** neo mỗi TC về ACL item + FR/error (traceability n–n: nhiều TC cùng trỏ 1 ACL item). Cột **`Kết quả`** dưới đây là evidence lần chạy **mock cũ (2026-05-26)** — path vừa migrate sang `test/api/`, cần **re-run** để có evidence trên cấu trúc mới.

<!-- TC:START -->
| TC | Provider | Method | Path | Headers | Body | HTTP | Assert | Ref | Kết quả | Lần chạy |
|----|----------|--------|------|---------|------|------|--------|-----|---------|----------|
| TC-01 | paygate | POST | /v1/customers | — | {"email":"learner@example.com"} | 201 | object=customer | ACL#1 FR-003 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-02 | paygate | POST | /v1/charges | Idempotency-Key: key_tc02 | {"amount":99000,"currency":"vnd","source":"tok_chargeable"} | 201 | status=succeeded | ACL#3 FR-002 FR-004 BR-001 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-03 | paygate | POST | /v1/charges | — | {"amount":99000,"currency":"vnd","source":"tok_insufficient"} | 402 | error.code=insufficient_funds | ACL#6 E-002 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-04 | paygate | POST | /v1/charges | — | {"amount":99000,"currency":"vnd","source":"tok_declined"} | 402 | error.code=card_declined | ACL#5 E-001 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-05 | paygate | GET | /v1/charges?limit=2 | — | — | 200 | object=list | ACL#13 FR-010 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-06 | paygate | GET | /v1/events | — | — | 200 | object=list | ACL#19 (smoke) FR-008 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-07 | mailgate | GET | /v1/templates | — | — | 200 | — | ACL#20 FR-006 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-08 | mailgate | POST | /v1/messages | — | {"to":"learner@example.com","template":"receipt","variables":{"customer_name":"Lan","amount":99000,"charge_id":"ch_123"}} | 201 | status=delivered | ACL#21 FR-006 BR-005 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-09 | mailgate | POST | /v1/messages | — | {"to":"bounce@example.com","template":"receipt","variables":{"customer_name":"Lan","amount":99000,"charge_id":"ch_123"}} | 201 | status=queued | ACL#21 (địa chỉ bounce) FR-006 | ⚠️ CẦN SỬA — xem note | 2026-05-26 22:31:17 |
| TC-10 | mailgate | POST | /v1/messages | — | {"to":"khongcoemail","template":"receipt"} | 400 | error.code=invalid_email | ACL#22 E-009 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-11 | paygate | POST | /v1/charges | — | {"amount":99000,"currency":"vnd","source":"tok_expired"} | 402 | error.code=expired_card | ACL#7 E-003 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-12 | paygate | POST | /v1/charges | — | {"amount":99000,"currency":"vnd","source":"tok_cvc_fail"} | 402 | error.code=incorrect_cvc | ACL#8 E-004 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-13 | paygate | POST | /v1/charges | — | {"amount":99000,"currency":"vnd","source":"tok_error"} | 500 | error.code=processing_error | ACL#9 E-005 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-14 | paygate | POST | /v1/charges | — | {"amount":99000,"currency":"vnd"} | 400 | error.code=missing_field | ACL#4 E-001 | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-15 | paygate | GET | /v1/charges/ch_notexist | — | — | 404 | error.code=resource_missing | ACL#14 (E: chưa có mã) | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
| TC-16 | paygate | POST | /v1/subscriptions | — | {"customer":"cus_fake","plan":"premium_weekly"} | 400 | error.code=invalid_plan | ACL#16 (E: chưa có mã) | ✅ PASS (mock cũ) | 2026-05-26 22:31:17 |
<!-- TC:END -->

> Quy ước: **Headers** `K: V` nối `;` (`—`=không). Bruno tự đặt `Content-Type` + `Authorization: Bearer {{process.env.*_KEY}}`. **Body** JSON 1 dòng (không `|`). **Assert** `dotpath=value` nối `;` (`—`=chỉ check HTTP). **Ref** neo ACL#/FR/E (cột phụ — runner index theo tên cột nên bỏ qua an toàn). **`Auto No` → để trống HTTP** (runner skip): các case chiều `in` (poll/webhook idempotency), rate-limit, chained cần state — xem "Ngoài suite auto".‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## Ngoài suite auto (Auto No — test thủ công/chain, KHÔNG chạy 1-request)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bám `api-checklist.md` các row `Auto No` + chiều `in`:

- **Chiều `in` (polling async, KHÔNG phải webhook HMAC):** PayGate không đẩy callback — app POLL `GET /v1/events` (đã có TC-06 gọi feed). Nhưng verify "polling KHÔNG bỏ sót event + cập nhật đúng trạng thái charge/subscription" cần **≥2 lần poll + con trỏ event cuối** (NFR-005) → chain nhiều bước, `Auto No`. Test: chạy `POST /v1/events/simulate` tạo event → poll → kiểm state. Tương tự **MailGate `bounced`** (TC-09 gọi được, nhưng "app fallback hiện biên nhận khi bounced" cần state nội bộ → `Auto No`).
- **Idempotency thu-trùng** (NFR-003): gọi 2 lần cùng `Idempotency-Key` cùng body → chỉ 1 charge. Cần 2 request tuần tự → `Auto No`.
- **Rate-limit** (429, NFR-002): cần spam ≥30 req/10s → `Auto No`.
- **Chained id**: refund cần `charge_id` thật (FR-012), hủy sub cần `sub_id` (FR-011), lưu thẻ cần `customer` (FR-003) — chain tay hoặc GUI.
- **`unauthorized` (401):** cần đổi key per-TC (runner không override key) → thủ công.

## Lịch sử chạy

- 2026-05-26 22:31:17 | 16/16 pass | 0 fail | env=mock (path cũ integration/ — migrate sang test/api/ 2026-07-15, cần re-run)

<!-- runner prepend dòng mới tại đây -->

## Ý nghĩa nghiệp vụ (per TC)

- **TC-01** — `customer` (cus_) để gắn thẻ + thuê bao. App lưu map User ↔ Customer.
- **TC-02** — Charge OK → kích hoạt Premium (BR-001). `Idempotency-Key` chống thu trùng (NFR-003).
- **TC-03 / TC-04 / TC-11 / TC-12** — Thẻ lỗi → màn lỗi tương ứng (E-002 số dư, E-001 từ chối, E-003 hết hạn, E-004 sai CVC). "Thử thẻ khác" / "nhập lại CVC".
- **TC-05** — Lịch sử giao dịch; phân trang cursor `starting_after`.
- **TC-06** — Feed sự kiện cho **polling** cập nhật async (NFR-005); lưu con trỏ event cuối.
- **TC-07 / TC-08** — Template + email biên nhận `delivered` (FR-006, BR-005).
- **TC-09** — **Quan trọng:** 201 nhưng `bounced`. "Gửi OK ≠ giao thành công" → tra status (E-008), fallback hiện biên nhận trong app.
- **TC-10** — Validate email trước khi gửi (E-009).
- **TC-13** — `processing_error` 500 → retry/backoff, KHÔNG báo "thẻ lỗi" (E-005, NFR-002).
- **TC-14** — thiếu `source` → `missing_field`: validate form đủ trường trước khi gọi (E-001).
- **TC-15** — tra charge không tồn tại → 404 (E-010).
- **TC-16** — plan sai → `invalid_plan`: UI chỉ cho `premium_monthly`/`premium_yearly` (E-003). Server check plan TRƯỚC customer.

## Phát hiện khi test

- PayGate không đẩy webhook callback → bắt buộc **polling** `GET /v1/events` (chiều `in` = polling, KHÔNG phải webhook HMAC — phản ánh đúng trong `api-design.md`).
- MailGate phân biệt "nhận để gửi" (201) vs "đã giao" (status) → cần bước tra trạng thái.
- Case phụ thuộc id (refund/hủy sub/lưu thẻ) chưa vào suite tự động — chain tay hoặc `api-tester.html`.
- **Trailing-slash base:** `PAYGATE_BASE` kết thúc `/` làm URL `...com//v1/...` → 404. Runner đã chuẩn hoá cắt `/` thừa. Điền `.env` nên bỏ `/` cuối.
- **Mã lỗi chưa auto-test:** `unauthorized` (401), `rate_limited` (429), `invalid_json` (400) — test thủ công.

### ⚠️ Gap traceability phát hiện qua review (cần xử lý trước khi mark approved)

Review QA bắt 3 vấn đề nguồn — **KHÔNG che, ghi rõ để BA quyết**:

1. **TC-09 assert sai nguyên tắc "gửi OK ≠ giao thành công"** (E-008). `POST /v1/messages` chỉ trả trạng thái tạo (`queued` theo model MailGate `queued/delivered/bounced/failed`); `bounced` **chỉ biết qua** `GET /v1/messages/{id}` (= ACL#25, chiều `in`, Auto No). Mock cũ có thể trả `bounced` ngay ở POST — đó là **hành vi mock, không phản ánh nghiệp vụ thật**. Đã sửa assert TC-09 về `status=queued`; verify `bounced` thật thuộc chain 2 bước ở "Ngoài suite auto" (ACL#25). **Re-run cần** — TC-09 log PASS cũ có thể là false-positive.
2. **`resource_missing` (404, TC-15) chưa có mã E trong SRS Error Matrix.** SRS Mục 5 chỉ có `E-premium-payment-001..009`; `E-010` là **số ma** (api-summary tự claim "..010" nhưng SRS không định nghĩa). Đã bỏ Ref E sai. → Đề xuất `/srs` hoặc `/cr` bổ sung `E-premium-payment-010 = resource_missing` nếu coi là error nghiệp vụ cần track.
3. **`invalid_plan` (400, TC-16) chưa có mã E** (trước gắn nhầm `E-003` = `expired_card`, đã dùng cho TC-11). Đã bỏ Ref E sai. → Đề xuất bổ sung mã E cho `invalid_plan`, HOẶC coi là validation-error thuần (không cần mã Error Matrix). Ngoài ra TC-16 dùng `customer=cus_fake` — nếu server check customer TRƯỚC plan thì 400 có thể do customer, không cô lập đúng biến (OQ: thứ tự validate của PayGate chưa xác nhận từ tài liệu).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
