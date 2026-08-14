---
type: skill-explainer
skill: changelog-staleness
updated: 2026-07-30
---

# Hai cuốn sổ của vault — `changelog.md` và `staleness.md`‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Trong `docs/_shared/` có hai file log do hệ thống __tự ghi__ (bạn không phải viết tay dòng nào). Thoạt nhìn dễ tưởng trùng vai — "đều là log cả mà" — nhưng chúng trả lời __hai câu hỏi khác nhau__, và cái thứ hai không thể bỏ. File này giải thích từng cuốn, vì sao tách đôi, và cách đọc chúng.

## 1. Hình dung: nhật ký công trình và bảng cảnh báo‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Hãy hình dung một công trường xây dựng có hai thứ treo ở cổng:

1. __Cuốn nhật ký công trình__ — mỗi ngày ghi: ai làm gì, ở hạng mục nào, lúc nào. Lật lại là biết lịch sử.
2. __Bảng cảnh báo__ — khi đội móng đổi bản vẽ, quản đốc treo lên bảng: "bản vẽ móng đã đổi → đội điện, đội nước phải rà lại phần của mình". Bảng này không kể lịch sử — nó chỉ ra __ai đang nợ một lần rà soát, và vì lý do gì__.

Hai thứ đó chính là hai file:

| Cuốn sổ | File | Trả lời câu hỏi |
|---|---|---|
| Nhật ký công trình | `docs/_shared/changelog.md` | "Tài liệu X __đã bị sửa__ — khi nào, ai, bằng lệnh nào, sửa gì?" |
| Bảng cảnh báo | `docs/_shared/staleness.md` | "__Vì__ X bị sửa nên tài liệu Y phái sinh từ nó __cần rà lại__ — cặp nào, vì sao?" |

## 2. `changelog.md` — nhật ký thay đổi toàn vault‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Giống CHANGELOG của một dự án phần mềm: __một file duy nhất__ cho cả vault, mỗi sự kiện một dòng bảng, dòng mới nhất nằm cuối.

| Ngày | Skill | Người | File | Ghi chú |
|---|---|---|---|---|
| 2026-07-12 | /srs | @ba | `docs/payment/srs/payment-spec.md` | initial spec 12 FR + 9 error |
| 2026-07-13 | /cr | @ba | `docs/payment/srs/payment-spec.md` | applied CR-20260713-001 |

Năm cột đọc thành một câu: *ngày nào, lệnh nào, ai chạy, sửa tài liệu nào, tóm tắt sửa gì.*

Ba điều cần biết:

- __Bạn không bao giờ ghi tay file này.__ Một cảm biến (hook `auto-changelog.sh`) tự ghi sau mỗi lần tài liệu được tạo/sửa. Chỉ có đúng một "người ghi sổ" nên không bao giờ có hai bản lệch nhau.
- __Tài liệu KHÔNG mang lịch sử riêng.__ Không có mục "Changelog" trong từng file tài liệu — lịch sử của mọi file sống tập trung ở đây. Muốn xem lịch sử một tính năng: lọc cột File theo `docs/{tính-năng}/`.
- __Là bảng Markdown__ nên mở bằng Obsidian/GitHub là thấy bảng đẹp, không phải đọc text thô.

## 3. `staleness.md` — bảng cảnh báo "tài liệu này cần rà lại"‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cơ chế đứng sau: tài liệu trong vault __phái sinh lẫn nhau__ (spec sinh ra use case, use case sinh ra story, story sinh ra test...). Khi bạn sửa một tài liệu gốc, các tài liệu phái sinh __có thể__ đã lệch — nhưng không ai tự nhớ nổi cây phụ thuộc đó trong đầu.

Nên mỗi lần một tài liệu bị sửa, một cảm biến (hook `post-edit-stale.sh`) tự quét: tài liệu nào khai báo "tôi phái sinh từ file vừa sửa" (qua mục `links:` ở đầu file) → đánh dấu nó `status: stale` (= cần rà lại) và ghi một dòng vào bảng này:

| Ngày | Upstream đổi | Downstream bị đánh stale | Lý do |
|---|---|---|---|
| 2026-07-13 | `docs/payment/srs/payment-spec.md` | `docs/payment/usecases/uc-checkout.md` | upstream changed: ... by /cr |

__Điểm mấu chốt — vì sao file này không bỏ được:__ khi một tài liệu bị đánh `stale`, phần đầu file của nó **chỉ ghi đúng chữ `status: stale`**, không ghi lý do (trường lý do đã được bỏ khỏi frontmatter có chủ đích, để frontmatter gọn). Lý do — *stale vì upstream nào đổi, hôm nào, bởi lệnh nào* — **chỉ sống ở `staleness.md`**. Xóa file này đi thì bạn nhìn thấy tài liệu "cần rà lại" mà không biết rà vì cái gì, phải tự dò ngược cả cây phụ thuộc.

Thoát khỏi trạng thái stale bằng lệnh `/cr`: nó đọc thay đổi upstream, soi tài liệu stale còn khớp không, đề xuất sửa hoặc xác nhận "không ảnh hưởng" — duyệt xong tài liệu quay về trạng thái trước đó.

## 4. Ai đang "đọc" hai cuốn sổ này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Không chỉ để người đọc — nhiều bộ phận của hệ thống ăn dữ liệu từ chúng:

| Bộ phận | Đọc file nào | Để làm gì |
|---|---|---|
| Banner đầu phiên làm việc | `staleness.md` | Đếm "có N lần lan truyền stale trong 7 ngày" nhắc bạn |
| `/dashboard` | `staleness.md` | Vẽ cây stale (upstream → downstream) trong khu "Stale" |
| Knowledge Graph (`/kg`) | cả hai | `changelog.md` → ai sửa/lần cuối sửa từng tài liệu; `staleness.md` → cạnh "ảnh hưởng" giữa các tài liệu |
| `/kg history` | `changelog.md` | Trả lời "tài liệu này đổi mấy lần, ai, khi nào" |
| Chuyên gia review trong `/cr` | `staleness.md` | Biết chuỗi ảnh hưởng khi phân tích một thay đổi |

## 5. Vì sao không gộp thành một file?

Câu hỏi tự nhiên: "đều là log, gộp một file cho gọn?" Không nên, vì:

- __Khác bản chất dòng ghi.__ Một bên là *sự kiện sửa file* (ai/lệnh/ghi chú), một bên là *cặp quan hệ upstream → downstream*. Ép chung một bảng thì phải thêm cột "loại sự kiện" và một nửa số cột luôn bỏ trống — bảng xấu đi cho cả hai kiểu người đọc.
- __Khác người đọc.__ `changelog.md` là thứ bạn (và stakeholder) mở ra đọc như CHANGELOG dự án. `staleness.md` chủ yếu cho máy (dashboard, KG, /cr) — người chỉ liếc khi cần biết "tài liệu này stale vì đâu".
- __Đổi lại chẳng được gì__ ngoài bớt một file — trong khi mọi bộ phận đang đọc phải sửa theo.

## 6. Bảng phân biệt nhanh

| | `changelog.md` | `staleness.md` |
|---|---|---|
| Ghi cái gì | Lịch sử sửa tài liệu | Lan truyền "cần rà lại" giữa các tài liệu |
| Một dòng nghĩa là | "X đã bị sửa" | "Y cần rà lại vì X đổi" |
| Ai ghi | hook `auto-changelog.sh` | hook `post-edit-stale.sh` |
| Người đọc chính | Bạn + stakeholder | Máy (dashboard, KG, /cr); bạn tra khi cần lý do |
| Tương đương bên phần mềm | CHANGELOG.md | Danh sách "cần review lại sau thay đổi" (impact list) |
| Xóa được không | Không nên (mất lịch sử) | __Không__ — lý do stale chỉ sống ở đây |

## 7. Câu chốt

> **`changelog.md` kể lại quá khứ — ai đã sửa gì. `staleness.md` chỉ ra món nợ hiện tại — tài liệu nào đang cần rà lại và vì sao.** Cả hai đều do cảm biến tự ghi, bạn không phải nhớ hộ hệ thống điều gì.

***

## Xem thêm

- `explain-skills/why-this-approach.md` — Mục 5: vị trí của "cảm biến (hook)" trong bức tranh năm mảnh ghép.
- `explain-skills/cr.md` — lệnh `/cr`: con đường chính thống để đưa tài liệu ra khỏi trạng thái stale.
- `explain-skills/kg.md` — Knowledge Graph ăn hai log này để trả lời câu hỏi lịch sử và ảnh hưởng.
- `explain-skills/dashboard.md` — nơi cây stale được vẽ thành hình trong khu "Stale".‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
