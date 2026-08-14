# Bộ cột so sánh — Column dictionary‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nạp ở **CHECKPOINT 1** để đề xuất cột cho user duyệt. Chọn **5-8 cột** phù hợp với tính năng —
đừng dùng hết. Giữ tối thiểu: *Có tính năng?* + *Giải job người dùng thế nào* + *Cách triển khai* + *Gap/cơ hội* + *Confidence*.
(Từ "người dùng" thay bằng thuật ngữ trong `docs/_shared/project-profile.md` nếu có — học viên/khách hàng/...)

> **Lưu ý:** đây là cột cho bảng **competitive** (Mục 3 report). Phần **opportunity/JTBD** (job người dùng mình,
> bằng chứng nhu cầu) KHÔNG ở bảng này — nó là Mục 0 report, đứng TRƯỚC. Bảng competitive luôn có cột
> **"Giải job người dùng thế nào"** (đối thủ giúp user hoàn thành job ra sao — không chỉ liệt kê UI) để nối
> về trục opportunity, và cột **Confidence** để Pha E strip/flag ô không nhãn.

---

## Cột lõi (gần như luôn dùng)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Cột | Nội dung điền |
|---|---|
| **Có tính năng?** | ✅ Có / ⚠️ Một phần / ❌ Không |
| **Giải job người dùng thế nào** | Đối thủ giúp user hoàn thành **job** (Mục 0) ra sao — nối về opportunity, không chỉ liệt kê UI |
| **Cách triển khai (nghiệp vụ)** | Mô tả luồng dùng, thuật toán, quy tắc — phần quan trọng nhất |
| **Trigger / Entry point** | Khi nào / ở đâu user gặp tính năng |
| **Monetization gate** | Free / Premium / Mixed |
| **Điểm mạnh** | Đối thủ làm tốt gì ở tính năng này |
| **Hạn chế** | Điểm yếu / phàn nàn user / thiếu sót |
| **Gap / cơ hội** | Khoảng trống sản phẩm mình có thể khai thác |

---

## Cột tùy chọn — đặc thù theo domain (tự soạn cho dự án)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Mỗi domain có 3-6 cột đặc thù riêng = **chiều cạnh tranh mà domain đó quyết thắng thua**. Soạn ở
CHECKPOINT 1 dựa trên Domain trong `project-profile.md` + đề xuất user duyệt; đã soạn 1 lần → ghi
vào profile để lần sau reuse. Nguyên tắc chọn cột đặc thù + 4 domain minh họa: `example-competitors.md` Mục 3.

2 cột dưới đây luôn dùng bất kể domain:‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Cột | Khi nào dùng |
|---|---|
| **Năm observed / Source** | Luôn gắn để track độ cũ của data |
| **Confidence** | High / Med / Low — mức độ tin cậy của thông tin ô đó |

---

## Cột tùy chọn — generic‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Cột | Khi nào dùng |
|---|---|
| **Mức tự động hóa** | So sánh thủ công vs tự động (vd tạo quiz manually vs AI-generated) |
| **Platform / offline** | Quan trọng về coverage (iOS / Android / web / offline mode) |
| **Dữ liệu & metric hiển thị** | Tính năng cho user thấy progress / insight / stats gì |
| **Onboarding flow** | Nghiên cứu luồng làm quen tính năng lần đầu |
| **UX nổi bật** | Interaction design / micro-animation / phản hồi đặc biệt |

---

## Mẫu bảng so sánh (Markdown)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```markdown
| Khía cạnh | **My app** | {Competitor 1} | {Competitor 2} | {Competitor 3} | {Competitor 4} |
|---|---|---|---|---|---|
| **Có tính năng?** | ⚠️ Chưa | ✅ | ✅ | ⚠️ Một phần | ❌ |
| **Cách triển khai** | dự kiến... | ... [F] | ... [F] | ... [I] | — |
| **Trigger / Entry** | — | ... | ... | ... | — |
| **Monetization gate** | — | Free | Freemium | Premium | — |
| **Điểm mạnh** | — | ... | ... | ... | — |
| **Hạn chế** | — | ... | ... | ... | — |
| **Gap / cơ hội** | — | ... | ... | ... | — |
| **Năm observed** | — | YYYY-MM | YYYY-MM | YYYY-MM | — |
```

> Cột **My app** điền dự kiến từ Phase B (URD / brainstorm đã có) hoặc "chưa có — greenfield".
> KHÔNG bịa. Dùng `—` cho ô không có data.

## Nhãn Fact / Inference / Recommendation

Gắn vào mỗi ô hoặc inline trong claim:

| Nhãn | Nghĩa |
|---|---|
| **[F]** | Fact — có nguồn URL + ngày rõ ràng |
| **[I]** | Inference — suy luận từ tín hiệu gián tiếp (screenshot, review, changelog) |
| **[R]** | Recommendation — đề xuất của BA dựa trên phân tích |

Mọi ô trong bảng so sánh phải có ít nhất 1 nhãn nếu điền data (không để trống mà không nhãn).‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
