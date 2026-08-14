---
type: skill-explainer
skill: api-family
updated: 2026-07-14
---

# Họ 7 lệnh API — chúng liên quan với nhau thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Tài liệu này giải thích __mối liên quan__ giữa bảy lệnh làm việc với API (cách hai hệ thống trao đổi dữ liệu với nhau): `/api-assess`, `/api-doc`, `/api-design`, `/api-map`, `/api-checklist`, `/api-test`, `/api-readiness`. Muốn hiểu sâu từng lệnh, đọc file explainer riêng của nó ở cuối.

## 1. Đây KHÔNG phải bảy cách làm cùng một việc‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bảy lệnh này là __bảy chặng nối tiếp của một hành trình__:

> __Hiểu + tích hợp API của đối tác vào ứng dụng đang chạy, rồi kiểm tra cả API của mình lẫn API của đối tác.__

Hãy hình dung ứng dụng của bạn là một cửa hàng, còn API đối tác là một __nhà thầu phụ giao hàng__. Khách đặt hàng ở cửa hàng của bạn, nhưng một phần việc phải nhờ nhà thầu làm giúp: giao hàng, thu tiền, gửi tin nhắn, kiểm tra địa chỉ...

Không thể chỉ “gọi thử nhà thầu” rồi cho họ làm thật. Cần đi lần lượt:

* Có nên chọn nhà thầu này không?
* Họ nhận việc gì, yêu cầu gì, trả kết quả gì?
* Cửa hàng và nhà thầu phối hợp ra sao khi đơn bị chậm, thất lạc, hoặc báo trùng?
* Thông tin từ họ được lưu và hiện ở đâu?
* Cần thử những tình huống nào?
* Thử thật có đậu không?
* Đậu rồi thì đã sẵn sàng phục vụ khách thật chưa?

Nói ngắn gọn: __đánh giá → hiểu → thiết kế phối hợp → tra dữ liệu → lập danh sách kiểm → thử thật → chuẩn bị lên thật.__

***

## 2. Bức tranh dòng chảy — bảy chặng nối với nhau‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

```text
 ┌──────────────────────────────────────────────────────────────┐
 │ [0] /api-assess — ĐÁNH GIÁ ĐỐI TÁC                            │
 │ Có đáng hợp tác không: giá, độ tin cậy, cam kết, rủi ro?      │
 │ Chỉ chạy khi CHƯA chốt đối tác.                               │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ [1] /api-doc — ĐỌC HIỂU TÀI LIỆU ĐỐI TÁC                      │
 │ Họ cho làm gì, cần gì, trả gì, và báo lỗi thế nào?            │
 │ Dịch từ ngôn ngữ kỹ thuật sang ngôn ngữ nghiệp vụ.            │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ [2] /api-design — THIẾT KẾ CÁCH PHỐI HỢP  ⭐                  │
 │ "Bản thiết kế lắp ráp": lúc nào gọi đối tác, ai giữ trạng     │
 │ thái chuẩn, xử lý mất tin/báo trùng/chậm thế nào?             │
 └───────────────┬───────────────────────────┬──────────────────┘
                 │                           │
                 │                           ▼
                 │              ┌────────────────────────────────┐
                 │              │ /api-map — BẢNG TRA DỮ LIỆU     │
                 │              │ Dữ liệu đối tác → lưu ở đâu →   │
                 │              │ hiện ở màn nào.                 │
                 │              └───────────────┬────────────────┘
                 │                              │
                 └─────────────── hội tụ ───────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ [3] /api-checklist — LẬP DANH SÁCH CẦN KIỂM                   │
 │ Có những tình huống nào phải thử, theo đúng điều đã hiểu?     │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ [4] /api-test — THỬ THẬT BẰNG BRUNO                           │
 │ Bruno giống Postman: AI chuẩn bị sẵn lần gửi thử, bạn bấm     │
 │ chạy và ghi nhận đậu/rớt.                                     │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ [5] /api-readiness — KIỂM TRA SẴN SÀNG LÊN THẬT               │
 │ Đổi môi trường thử sang thật, ai trực khi lỗi, có đường lùi,  │
 │ theo dõi đối tác đổi hoặc ngừng dịch vụ thế nào?              │
 └──────────────────────────────────────────────────────────────┘
```

Điểm quan trọng nhất từ sơ đồ: đây là __hành trình có thứ tự__. Khác với họ use case, nơi các lệnh có thể bổ trợ nhau song song, các lệnh API đi từ “có nên hợp tác” tới “có sẵn sàng phục vụ khách thật”.

Tuy vậy, không phải lúc nào cũng cần chạy đủ bảy chặng.

***

## 3. Bảng phân biệt nhanh‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

| Lệnh | Làm gì bằng lời dễ hiểu | Trả lời câu hỏi chính |
|---|---|---|
| `/api-assess` | Đánh giá đối tác trước khi ký | “Có nên chọn bên này không?” |
| `/api-doc` | Đọc và diễn giải tài liệu đối tác | “Họ nhận gì, làm gì, trả gì?” |
| `/api-design` | Thiết kế cách hai bên phối hợp | “Khi có sự cố, ai quyết định trạng thái đúng?” |
| `/api-map` | Lập bảng tra dữ liệu | “Ô thông tin này từ đâu đến, nằm ở đâu, hiện ở đâu?” |
| `/api-checklist` | Liệt kê các tình huống cần thử | “Cần kiểm những gì để không sót rủi ro?” |
| `/api-test` | Bấm chạy thử và ghi đậu/rớt | “Thực tế có hoạt động đúng không?” |
| `/api-readiness` | Soát trước khi chạy thật | “Đậu thử rồi, nhưng đã sẵn sàng phục vụ khách chưa?” |

Một câu để nhớ: __assess chọn đối tác; doc hiểu đối tác; design ráp cách làm việc; map tra dữ liệu; checklist chọn cái cần thử; test thử thật; readiness chuẩn bị lên thật.__

***

## 4. Chặng quan trọng nhất: `/api-design` là “bản thiết kế lắp ráp”‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Nhiều nhóm từng đi tắt: đọc xong tài liệu API rồi nhảy thẳng sang thử API. Cách đó giống như đọc hướng dẫn của nhà thầu giao hàng, gọi thử một chuyến, nhưng chưa hề thống nhất cách hai bên xử lý khi đơn bị kẹt.

`/api-design` lấp đúng khoảng trống này. Nó không lập trình API. Nó giúp BA/PO chốt __cách phối hợp ở góc nhìn nghiệp vụ__, chẳng hạn:

* Khi khách bấm “Thanh toán”, ứng dụng gọi đối tác ở thời điểm nào?
* Khi nào đơn được xem là thành công: lúc ứng dụng gửi yêu cầu, hay lúc đối tác xác nhận?
* Ai giữ “sự thật” về trạng thái đơn hàng khi hai bên báo khác nhau?
* Nếu đối tác gửi tin ngược về mà tin bị thất lạc thì sao?
* Nếu gửi lại yêu cầu, có nguy cơ khách bị tính tiền hai lần không?
* Nếu số liệu hai bên lệch nhau, đối chiếu và xử lý thủ công thế nào?
* Nếu đối tác chậm hoặc lỗi, khách nhìn thấy gì và nhân viên hỗ trợ xử lý ra sao?

Tin ngược mà đối tác gửi vào ứng dụng thường gọi là __webhook__ — hiểu đơn giản là: thay vì mình phải hỏi “xong chưa?”, đối tác chủ động nhắn “đơn này đã xong rồi”.

Đây là lý do `/api-design` khác `/api-map`:

* **`/api-design`** là bản thiết kế lắp ráp tổng thể: luồng phối hợp, trạng thái, tình huống lỗi, cách phục hồi.
* **`/api-map`** chỉ là bảng tra dữ liệu: ví dụ “mã giao dịch đối tác” lưu ở cột nào, hiện ở màn hình nào.

`/api-map` là __một phần của__ bản thiết kế, không phải bản thiết kế thay thế.

***

## 5. Không phải lúc nào cũng chạy đủ bảy lệnh

__Đối tác chưa chốt.__ Nếu đang cân nhắc vài nhà cung cấp thanh toán, giao hàng hoặc nhắn tin, bắt đầu bằng `/api-assess`. Chặng này nhìn vào giá, độ tin cậy, mức cam kết, rủi ro phụ thuộc và điều kiện hợp tác.

__Đối tác đã chốt hoặc bị chỉ định.__ Bỏ `/api-assess`; không cần đánh giá lại một lựa chọn mà nhóm không có quyền đổi. Đi từ `/api-doc` sang `/api-design`.

__Chỉ là API của chính mình.__ Bỏ cả `/api-assess` lẫn `/api-doc`, vì không có đối tác để đánh giá hay đọc tài liệu của họ. Nguồn để hiểu kỳ vọng sẽ là yêu cầu nghiệp vụ và tài liệu nội bộ. Vẫn cần `/api-design`, `/api-checklist`, `/api-test`, `/api-readiness` nếu API này tham gia vào một hành trình quan trọng.

__Thay đổi nhỏ trên tích hợp đang chạy.__ Có thể chỉ cần đọc lại phần liên quan, cập nhật thiết kế, kiểm tra đúng các tình huống bị ảnh hưởng và soát khả năng lên thật. Không cần làm lại cả hành trình từ đầu.

***

## 6. Ba “làn” cần kiểm — không chỉ có API đối tác

Khi đến `/api-checklist` và `/api-test`, hãy phân biệt ba loại việc cần kiểm:

| Làn kiểm | Cần xác nhận điều gì? | Ví dụ |
|---|---|---|‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
| __API đối tác__ | Đối tác có làm đúng điều họ đã cam kết không? | Họ có trả đúng kết quả thanh toán, báo lỗi rõ, giới hạn sử dụng hợp lý không? |
| __API của mình__ | Ứng dụng của mình có xử lý yêu cầu đúng không? | Có chặn số tiền không hợp lệ, trả thông báo đúng, cập nhật đơn đúng không? |
| __Kết hợp hai bên__ | Cả chuỗi từ mình sang đối tác rồi quay về có chạy đúng không? | Khách thanh toán → đối tác xác nhận → đơn đổi trạng thái → màn hình hiển thị đúng. |

Đây là chỗ rất dễ hiểu nhầm: __API của mình đậu riêng và API đối tác đậu riêng chưa có nghĩa tích hợp đã đậu.__

Ví dụ, cửa hàng nhận yêu cầu tốt, nhà thầu giao hàng cũng hoạt động tốt, nhưng tin báo “đã giao” không quay về được cửa hàng. Khách vẫn thấy “đang giao”, nhân viên tưởng đơn chưa xong. Chỉ là khi kiểm cả chuỗi kết hợp mới phát hiện được.

***

## 7. Hai chiều trao đổi — mình gọi ra và đối tác gọi vào

Một tích hợp thường có hai chiều:

| Chiều | Nghĩa dễ hiểu | Ví dụ |
|---|---|---|
| __Mình gọi ra__ | Ứng dụng gửi yêu cầu cho đối tác | Gửi yêu cầu thu tiền hoặc tạo đơn giao hàng |
| __Đối tác gọi vào__ | Đối tác chủ động báo kết quả về ứng dụng | Báo “đã thu tiền”, “giao thất bại”, hoặc “đơn bị hủy” |

Nếu chỉ thử chiều “mình gọi ra”, giống như chỉ kiểm tra việc nhân viên gửi đơn cho nhà thầu mà không kiểm tra họ có báo kết quả về hay không.

Vì vậy, `/api-design`, `/api-checklist` và `/api-test` đều phải để ý chiều đối tác gọi vào — nhất là khi có webhook.

***

## 8. Vì sao “thử đậu” vẫn khác “sẵn sàng chạy thật”?

`/api-test` trả lời: __lần thử này có đậu không?__

`/api-readiness` trả lời: __nếu mở cho khách thật dùng, tổ chức có chịu được chuyện xấu xảy ra không?__

Trước khi “lên sóng” môi trường thật, `/api-readiness` giúp kiểm các câu hỏi như:

* Đã đổi từ môi trường thử sang môi trường thật chưa?
* Ai chịu trách nhiệm theo dõi khi có lỗi?
* Nếu đối tác ngừng hoạt động, có cách thông báo và xử lý khách hàng không?
* Có kế hoạch lùi lại nếu phát hiện sự cố lớn không?
* Nếu đối tác đổi cách làm, tăng giá, hoặc ngừng API, ai phát hiện và ai xử lý?
* Điều kiện nào thì quyết định “được lên thật”, điều kiện nào thì “chưa được”?

Ẩn dụ đời thường: thử đậu giống như __chạy thử xe trong sân__. Readiness là kiểm tra xe có đủ xăng, giấy tờ, số điện thoại cứu hộ và người cầm lái trước khi chở khách ra đường lớn.

***

## 9. Ba chặng mới thêm ngày 2026-07-14

Ba chặng `/api-assess`, `/api-design`, `/api-readiness` được thêm vào ngày __2026-07-14__ để bịt hai lỗ hổng quan trọng:

1) __Trước khi hiểu API:__ thiếu bước cân nhắc “có nên chọn đối tác này không?” khi lựa chọn chưa chốt.
2) __Giữa hiểu API và thử API:__ thiếu bước thiết kế “hai bên sẽ phối hợp thế nào khi thực tế không hoàn hảo?”.
3) __Sau khi thử API:__ thiếu bước chuẩn bị vận hành thật, nơi lỗi có khách hàng, tiền bạc và cam kết dịch vụ liên quan.

Nhờ đó, hành trình không còn là “đọc rồi test”, mà trở thành __chọn đúng → ráp đúng → thử đúng → vận hành an toàn__.

***

## 10. Ranh giới công việc — đây là việc BA/PO, không phải đi lập trình API

BA/PO hoàn toàn có vai trò chính trong họ lệnh này:

* Làm rõ lúc nào nghiệp vụ cần gọi đối tác.
* Chốt kết quả nào được xem là thành công hay thất bại.
* Đặt quy tắc “không được thu tiền hai lần”.
* Xác định trải nghiệm khách hàng khi đối tác chậm hoặc lỗi.
* Lập danh sách tình huống cần kiểm và chạy thử kiểu Postman/Bruno.
* Đọc kết quả đậu/rớt để trao đổi với đội kỹ thuật và đối tác.
* Đánh giá mức sẵn sàng trước khi cho khách thật dùng.

Phần vượt ngoài ranh giới BA/PO là cách lập trình chi tiết, cấu hình hạ tầng, hoặc tự xây công cụ chạy thử. Đội kỹ thuật sở hữu phần đó; BA/PO sở hữu __ý nghĩa nghiệp vụ, rủi ro, kết quả mong đợi và quyết định có nên lên thật hay không__.

***

## 11. Câu chốt

> __Bảy lệnh API không phải bảy nút bấm rời rạc: chúng là một hành trình đưa “nhà thầu phụ” vào cửa hàng của mình — chọn đúng, hiểu đúng, phối hợp đúng, thử đúng và chỉ mở cửa cho khách khi đã thật sự sẵn sàng.__

## Xem thêm

* [`api-selection.md` — bàn chỉ đường "cần gì → gõ lệnh nào"](api-selection.md) (gồm phân biệt test API vs test giao diện).
* [`api-workflow.md` — bản đồ quy trình bảy chặng dạng bảng](api-workflow.md) (trình bày kiểu `why-this-approach`).
* [`/api-assess` — đánh giá đối tác](api-assess.md)
* [`/api-doc` — đọc hiểu tài liệu API đối tác](api-doc.md)
* [`/api-design` — thiết kế tích hợp](api-design.md)
* [`/api-map` — bảng tra dữ liệu](api-map.md)
* [`/api-checklist` — lập danh sách cần kiểm](api-checklist.md)
* [`/api-test` — thử API bằng Bruno](api-test.md)
* [`/api-readiness` — kiểm tra sẵn sàng lên thật](api-readiness.md)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
