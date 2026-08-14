---
type: skill-explainer
skill: delegate
updated: 2026-07-16
---

# `/delegate` là gì và nó chạy như thế nào?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

## 1. Dùng để làm gì, khi nào nên gõ lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

`/delegate` (nghĩa là "giao việc / uỷ thác") là lệnh bạn gõ khi muốn **nhờ một trợ lý AI khác làm bớt một phần việc, thay vì để một mình trợ lý chính làm hết**.

Vì sao lại cần nhờ trợ lý khác? Có 2 lý do rất đời thường:

- **Tiết kiệm "lượt dùng".** Mỗi trợ lý AI đều có hạn mức (giống như gói cước điện thoại có giới hạn phút gọi mỗi tuần). Nếu dồn hết việc — kể cả việc nặng nhọc, lặp đi lặp lại — vào một trợ lý, bạn sẽ nhanh hết hạn mức của trợ lý đó. Giao bớt việc nặng sang trợ lý khác giúp bạn dùng được lâu hơn.
- **Có thêm góc nhìn.** Đôi khi bạn muốn "ý kiến thứ hai" — hỏi thêm một trợ lý khác xem họ có nghĩ giống không, hoặc nhờ một trợ lý chuyên soát lỗi rà lại bài của trợ lý đầu tiên.

Vài tình huống điển hình nên dùng `/delegate`:

- "Nhờ trợ lý khác code giúp hàm này đi, để dành lượt của tôi cho việc suy nghĩ."
- "Viết xong bản nháp rồi, nhờ một trợ lý chuyên soát lỗi đọc lại xem có chỗ nào sai."
- "Hỏi cả hai trợ lý cùng một câu, xem họ trả lời có khớp nhau không."
- "Việc này lớn quá, chia nhỏ ra rồi giao mỗi phần cho một trợ lý làm song song cho nhanh."

Gõ lệnh đơn giản như:

```
/delegate "nhờ soát lại 4 file tài liệu vừa viết, bắt câu dư thừa và chỗ giải thích sai"
```

Hoặc chỉ cần trong lúc trò chuyện bạn nói *"hỏi thêm trợ lý khác xem sao"*, *"nhờ ai đó review giúp"*, *"cho tôi ý kiến thứ hai"* — trợ lý chính sẽ tự hiểu và khởi động quy trình này.

**Điều quan trọng cần nhớ ngay từ đầu:** trợ lý chính (đang trò chuyện với bạn) không hề biến mất hay đùn việc. Nó đóng vai **người quản lý / kiến trúc sư** — nó vẫn là người suy nghĩ, chia việc, và chốt kết quả cuối. Các trợ lý được nhờ chỉ là **thợ làm việc nặng**. Việc "nghĩ và quyết định" luôn giữ ở trợ lý chính, vì đó là việc quan trọng nhất và cũng "rẻ" nhất (tốn ít lượt nhất).

---

## 2. Bối cảnh: "nhiều trợ lý" ở đây nghĩa là gì?‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Trước khi xem luồng chạy, cần hiểu một điều nền: trên cùng một chiếc máy tính, bạn có thể cài sẵn **nhiều trợ lý AI khác nhau**, và mỗi loại lại có thể đăng nhập bằng **nhiều tài khoản khác nhau**.

Hãy hình dung như một văn phòng nhỏ ngay trong máy của bạn:

- Có vài **nhóm nhân viên** khác nhau — mỗi nhóm giỏi một kiểu việc. Ví dụ một nhóm chuyên code, một nhóm chuyên đọc tài liệu và tra cứu, một nhóm chuyên soát lỗi.
- Trong mỗi nhóm lại có **vài người** (mỗi người là một tài khoản riêng, có hạn mức riêng). Ví dụ nhóm code có 3 người, mỗi người còn một lượng "sức làm việc" khác nhau trong tuần.

Nhiệm vụ của trợ lý chính (người quản lý) là: **giao đúng loại việc cho đúng nhóm, và trong nhóm đó thì chọn người còn nhiều sức nhất** — để không ai bị vắt kiệt trong khi người khác ngồi chơi.

> Trong tài liệu này, để dễ hiểu, ta gọi chung các trợ lý được nhờ là "thợ" và gọi trợ lý đang trò chuyện với bạn là "người quản lý". Máy của mỗi người có thể cài các loại thợ khác nhau với số lượng tài khoản khác nhau — nguyên tắc điều phối thì giống nhau.

### Cần chuẩn bị gì trước khi dùng lệnh này‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Khác với hầu hết lệnh trong bộ, `/delegate` cần **có sẵn trợ lý khác trên máy** thì mới nhờ được. Cụ thể:

1. **Cài ít nhất một CLI AI khác** — ví dụ Codex CLI, hoặc Gemini CLI. (Nếu bạn chỉ có mỗi Claude Code đang dùng thì chưa nhờ ai được — nó không tự nhờ chính mình.)
2. **Khai vào danh sách** `.claude/state/delegate-roster.yaml`. File đi kèm bộ đã có sẵn mẫu, mở ra là thấy hướng dẫn ngay đầu file: cài cái nào thì để `enabled: true`, chưa cài thì `false`. Chỉ vậy thôi.
3. **Không chắc máy mình có gì?** Bảo Claude *"check & update roster"* — nó tự dò xem máy bạn có CLI nào rồi đề xuất sửa file cho bạn duyệt.

Chưa cấu hình thì lệnh này **báo rõ là chưa dùng được** chứ không đoán bừa rồi gọi nhầm lệnh lạ. Và đây là lệnh **tuỳ chọn** — mọi lệnh khác trong bộ vẫn chạy bình thường dù bạn không bao giờ dùng `/delegate`.

---

## 3. Toàn bộ luồng chạy — sơ đồ‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điểm quan trọng nhất: với việc lớn hoặc việc nhiều vòng, **`/delegate` luôn cho bạn xem trước bản kế hoạch "sẽ nhờ ai làm gì, tốn khoảng mấy lượt" và chờ bạn gật đầu, trước khi bắt đầu giao việc.**

```
 BẠN GÕ LỆNH
 /delegate "viec can nho tro ly khac lam"
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 1 — Xem "ai còn sức làm việc" (nếu đo được)     │
 │  Đọc danh sách thợ đã khai, kiểm lệnh có thật trên    │
 │  máy không. Đo được hạn mức thì ai gần hết → để nghỉ, │
 │  ai còn nhiều → ưu tiên. KHÔNG đo được thì bỏ qua,    │
 │  coi như mọi thợ đều dùng được. (xem Mục 6)           │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 2 — Chọn đúng "người" cho đúng việc              │
 │  Việc DÀI/nhiều ngữ cảnh → thợ giỏi bối cảnh rộng.    │
 │  Việc NGẮN/cần chính xác → thợ tập trung sâu.         │
 │  Việc tra cứu trên mạng → nhóm có nối mạng.           │
 │  Việc soát lỗi → giao người chuyên soát.              │
 │  Việc dễ thì chọn "mức làm việc" rẻ cho đỡ tốn.       │
 │  (Chi tiết các nguyên tắc phân việc: xem Mục 5.)      │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ (Với việc nhỏ, rõ ràng: đi thẳng xuống "GIAO VIỆC",  │
 │  không cần bước xin phép bên dưới.)                   │
 │                                                       │
 │ Với việc LỚN / nhiều vòng → hiện BẢN KẾ HOẠCH:        │
 │  "Sẽ nhờ ai, làm gì, ước tính khoảng mấy lượt."       │
 │  → CHỜ BẠN GẬT ĐẦU (Y) mới chạy tiếp.                 │
 └──────────────────────────────────────────────────────┘
        │
        │  (chỉ đi tiếp khi bạn đồng ý)
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 3 — GIAO VIỆC + làm cầu nối                      │
 │  Người quản lý gửi việc (kèm mọi thông tin cần        │
 │  thiết) sang cho thợ, chờ thợ làm xong, đọc kết       │
 │  quả về. Các thợ KHÔNG nói chuyện trực tiếp với       │
 │  nhau — mọi trao đổi đều đi qua người quản lý.        │
 └──────────────────────────────────────────────────────┘
        │
        ▼
 ┌──────────────────────────────────────────────────────┐
 │ BƯỚC 4 — Tổng hợp + chốt                              │
 │  Người quản lý gom kết quả từ các thợ, tự mình        │
 │  đọc lại, chỉnh sửa, và đưa ra câu trả lời cuối       │
 │  cho bạn. Việc "chốt" không giao cho thợ.             │
 └──────────────────────────────────────────────────────┘
        │
        ▼
     BÁO CÁO: đã nhờ ai (nhóm nào, còn bao nhiêu sức),
     làm được gì, kết quả cuối ra sao.
```

---

## 4. Bốn cách giao việc (4 "chế độ")

`/delegate` không chỉ có một kiểu "giao rồi nhận". Tuỳ việc khó hay dễ, một mình hay nhiều bên, nó có 4 cách làm khác nhau:

### Cách 1 — Giao thẳng

Việc nhỏ, rõ ràng: người quản lý chỉ gọi **một** thợ, giao một phát, nhận kết quả. Không cần kế hoạch, không cần xin phép nhiều. Ví dụ: "code giúp hàm cộng hai số này".

### Cách 2 — Chia nhỏ rồi giao (decompose)

Việc lớn hoặc mơ hồ: người quản lý tự đọc bối cảnh trước (việc này không tốn lượt của ai), **xẻ việc lớn thành nhiều phần nhỏ rõ ràng**, rồi giao mỗi phần cho một thợ phù hợp.

- Những phần **không phụ thuộc nhau** → giao cùng lúc cho nhiều thợ làm song song cho nhanh.
- Những phần **phần sau cần kết quả phần trước** → làm lần lượt, người quản lý chuyển kết quả từ thợ này sang thợ kia.
- Cuối cùng người quản lý tự gom lại thành một đáp án hoàn chỉnh — không để thợ tự ghép.

Một biến thể hay dùng cho việc code lớn: tách làm hai nấc — **"đề xuất cách làm"** (viết ra hướng giải quyết bằng lời) cho bạn xem và duyệt trước, rồi mới **"biến thành code thật"**. Như vậy bạn được chốt hướng đi trước khi có ai gõ dòng code nào.

### Cách 3 — Làm rồi soát, sai thì sửa (vòng lặp review→fix)

Đây là cách để nâng chất lượng: **một thợ làm → một thợ khác soát lỗi → sửa → soát lại**.

Điểm cốt lõi: **người soát và người làm nên là hai bên khác nhau**, để tránh cảnh "tự chấm bài mình" (ai cũng dễ dãi với lỗi của chính mình).

Vòng lặp này có **giới hạn cứng là 3 vòng**. Vì sao phải chặn? Vì nếu không, hai bên có thể "soát tới soát lui" mãi không dừng — người soát luôn tìm được một điều gì đó để chê, tốn lượt vô ích. Nên quy ước rõ:

- Người soát kết thúc bằng một trong hai câu: **"ĐẠT"** (không còn lỗi đáng sửa) hoặc **"CÒN LỖI"** kèm danh sách chỗ cần sửa.
- Hễ người soát nói "ĐẠT" → dừng, báo bạn là xong tốt.
- Hết 3 vòng mà vẫn còn lỗi → dừng, báo bạn "đã làm hết 3 vòng, còn tồn đọng những điểm này" — chứ không cố đấm ăn xôi thêm.

> Đây chính là cách được dùng khi bạn nhờ *"nhờ trợ lý khác viết bản nháp, rồi cho một trợ lý soát lỗi đọc lại"*. Người viết và người soát là hai bên riêng, và tối đa 3 lượt qua lại.

### Cách 4 — Tranh luận rồi phân xử (debate)

Dùng khi bạn hỏi **hai** thợ cùng một câu và họ trả lời **lệch nhau thật sự** (không phải chỉ khác cách diễn đạt).

1. Người quản lý kiểm tra: hai câu trả lời có thật sự mâu thuẫn không? Nếu chỉ khác chữ nghĩa mà cùng ý → bỏ qua tranh luận, gộp lại là xong.
2. Nếu lệch thật → cho **một vòng phản biện**: đưa lập luận của thợ A cho thợ B đọc và phản hồi, rồi ngược lại. (Chỉ đúng một vòng, không cãi nhau vô tận.)
3. Sau vòng đó, nếu hai bên đồng thuận → người quản lý xác nhận kết luận chung. Nếu vẫn lệch → **người quản lý tự đứng ra phân xử**, đưa ra khuyến nghị cuối và đánh dấu rõ đây là phần "tôi (người quản lý) quyết" để bạn có thể lật lại nếu muốn.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
4. Báo bạn cả hai quan điểm ban đầu lẫn kết luận — **không giả vờ hai bên đã đồng ý khi thực chất vẫn khác nhau**.

---

## 5. Giao việc gì cho kiểu thợ nào — các nguyên tắc phân việc

Mỗi kiểu thợ giỏi một kiểu việc khác nhau, không ai giỏi mọi thứ. Người quản lý dựa vào vài nguyên tắc đơn giản dưới đây để giao đúng người — giao sai thì vừa tốn lượt vừa ra kết quả kém.

**Nguyên tắc quan trọng nhất — việc dài giao một kiểu, việc ngắn giao kiểu kia:**

- **Việc DÀI, phải đọc/nhớ nhiều thứ cùng lúc** (đọc qua nhiều file, nắm nhiều quy tắc rồi mới làm được một việc, sửa đổi lan ra nhiều chỗ) → giao cho **kiểu thợ giỏi giữ nhiều thông tin trong đầu một lúc**. Họ không bị "quên đầu quên đuôi" khi bối cảnh rộng.
- **Việc NGẮN, gọn, cần thật chính xác** (một việc nhỏ có yêu cầu rõ ràng, cần soi kỹ từng trường hợp hiếm gặp để không sót lỗi) → giao cho **kiểu thợ giỏi tập trung sâu vào một điểm hẹp**. Họ "cày kỹ" một chỗ nhỏ tốt hơn.

Ngoài trục dài/ngắn, còn vài quy ước theo loại việc:

| Loại việc | Giao cho ai (theo kiểu thợ) |
|---|---|
| **Lập kế hoạch tổng, chia việc, chốt kết luận** | Người quản lý tự giữ — đây là việc "nghĩ và quyết", không đẩy ra ngoài. |
| **Thiết kế/kiến trúc, cân nhắc hơn-thiệt** | Kiểu thợ giỏi bối cảnh rộng (giống việc dài). |
| **Làm giao diện, chăm chút cái nhìn/thẩm mỹ** | Kiểu thợ giỏi "cảm giác đúng" về bố cục, màu, khoảng cách. |
| **Viết bài kiểm thử, kịch bản test, đoạn mã kiểm tra tự động** | Kiểu thợ bám sát khuôn mẫu, không tự bịa thêm ngoài yêu cầu. |
| **Cài đặt, dựng môi trường, thao tác theo bước** | Kiểu thợ làm-theo-bước cũng được; nhưng **nếu cần bản hướng dẫn giải thích chi tiết** thì giao kiểu thợ giỏi diễn đạt. |
| **Viết tài liệu, nội dung** | Tuỳ: cần văn phong mạch lạc, bối cảnh rộng → thợ giỏi diễn đạt; cần bám khuôn, ngắn gọn → thợ bám mẫu. |
| **Soát lỗi / cho ý kiến thứ hai** | Kiểu thợ chuyên soát (và luôn khác bên với người làm). |

**Hai lưu ý người quản lý luôn nhớ:**

- **Tra cứu trên mạng thì chỉ vài kiểu thợ làm được** — có những thợ làm việc trong môi trường "không nối mạng", nên mọi việc cần lên internet (tìm thông tin mới, đọc trang web) buộc phải giao đúng thợ có mạng. Với việc "tìm hiểu thêm": nếu thông tin **đã nằm sẵn trong tài liệu/dự án** thì giao thợ đào-tại-chỗ (rẻ); nếu phải **lên mạng tìm** thì giao thợ có mạng; còn **tổng hợp lại và rút ra kết luận** thì luôn để người quản lý làm.
- **Việc phức tạp, dài, dễ sót trường hợp → luôn kèm bước soát chéo.** Không giao một phát rồi tin ngay: cho một thợ làm, rồi một thợ *khác* soát lại (như Cách 3 ở trên), để bắt những lỗi mà người làm tự đọc sẽ bỏ qua.

> Tóm gọn: **việc dài/cần suy nghĩ/thẩm mỹ/hướng-dẫn-kỹ/tra-mạng/kết-luận → thợ giỏi bối cảnh rộng · việc ngắn/chính-xác/kiểm-thử/đào-tại-chỗ → thợ tập trung sâu · soát lỗi → thợ chuyên soát.** Việc càng dễ sai càng phải có người soát lại.

---

## 6. Vì sao trước mỗi lần giao việc phải "xem ai còn sức"?

Đây là bước dễ bị xem nhẹ nhưng lại quan trọng.

Mỗi tài khoản AI có một hạn mức dùng theo chu kỳ (có loại tính theo tuần, có loại tính theo vài giờ). Nếu người quản lý cứ nhắm mắt giao hết việc cho một tài khoản quen tay, sẽ xảy ra hai chuyện khó chịu:

1. **Cạn hạn mức giữa chừng.** Đang làm dở một việc dài thì tài khoản đó hết lượt, phải dừng — trong khi các tài khoản khác vẫn còn đầy sức mà không được dùng.
2. **Chờ lâu để hồi.** Có loại tài khoản hồi hạn mức rất chậm (cả tuần mới đầy lại). Dồn việc vào đó rồi cạn thì phải chờ rất lâu.

Vì vậy, **trước mỗi lượt giao việc**, người quản lý đều xem lại "giờ ai còn nhiều sức nhất trong nhóm cần dùng" rồi mới chọn — và cố tình **chia đều** cho nhiều tài khoản thay vì dồn một chỗ. Đặc biệt với những việc lặp nhiều vòng (như vòng lặp soát-sửa ở Cách 3), mỗi vòng lại đổi sang một tài khoản khác trong cùng nhóm, để không ai bị vắt kiệt.

Nói ngắn gọn: giống như phân ca cho nhân viên — không ai phải làm liên tục tới kiệt sức trong khi đồng nghiệp rảnh tay.

> **Lưu ý thực tế:** phần lớn trợ lý AI **không có cách cho biết mình còn bao nhiêu hạn mức** — không có nút nào để hỏi. Nên bước "xem ai còn sức" chỉ chạy được khi bạn dùng thêm một công cụ quản-lý-nhiều-tài-khoản có ghi lại số liệu đó (khai đường dẫn ở mục `quota_source` trong file danh sách). **Không có thì bỏ qua bước này** — lệnh vẫn chạy bình thường, chỉ là chọn thợ theo loại việc thay vì theo hạn mức còn lại. Nếu bạn chỉ có một tài khoản mỗi loại thì cũng không cần bước này làm gì.

---

## 7. Vì sao "chọn đúng mức làm việc" lại tiết kiệm?

Ngoài việc chọn đúng người, người quản lý còn chọn **mức đầu tư công sức** cho từng việc.

Cùng một nhóm thợ thường có nhiều "chế độ làm việc": chế độ suy nghĩ kỹ (chậm, tốn nhiều, hợp việc khó), chế độ làm thường ngày (cân bằng), và chế độ làm nhanh gọn (rẻ, hợp việc đơn giản lặp lại).

Nguyên tắc: **việc khó mới cần chế độ đắt; việc dễ thì dùng chế độ rẻ.** Ví dụ:

- Việc "thiết kế lại cả một cấu trúc phức tạp" → dùng chế độ suy nghĩ kỹ.
- Việc "sửa một lỗi nhỏ hằng ngày" → dùng chế độ thường.
- Việc "định dạng lại 200 dòng cho đều, phân loại một danh sách dài" → dùng chế độ nhanh gọn.

Nếu lấy chế độ đắt nhất để làm cả những việc vặt, bạn sẽ đốt hạn mức rất nhanh mà chẳng thu được gì hơn. Chọn đúng mức là cách tiết kiệm âm thầm nhưng hiệu quả.

---

## 8. Ví dụ thực tế

Anh **Minh** vừa viết xong 4 file tài liệu giải thích cho đồng nghiệp không rành kỹ thuật. Anh lo mình viết dài dòng, có chỗ giải thích chưa đúng, hoặc lan man. Anh muốn có người soát lại — nhưng không muốn tự soát bài mình (dễ bỏ sót lỗi của chính mình), và cũng muốn để dành "lượt dùng" của trợ lý chính cho việc sửa sau này.

Anh gõ:

```
/delegate "nhờ soát lại 4 file tài liệu vừa viết trong thư mục này — bắt câu dư thừa, chỗ thổi phồng ý phụ thành ý chính, và chỗ giải thích sai bản chất. Chỉ ra vấn đề, đừng viết lại giúp."
```

1. **Xem ai còn sức.** Người quản lý kiểm tra các tài khoản, thấy nhóm soát lỗi còn nhiều hạn mức, nhóm code cũng còn — chọn ra người phù hợp trong mỗi nhóm.

2. **Chọn cách làm.** Đây là việc "soát lại bài đã viết" → dùng Cách 3 (làm rồi soát). Nhưng ở đây phần "làm" đã có sẵn (4 file), nên thực chất là nhờ **một vài thợ khác nhau cùng soát độc lập** rồi gộp ý kiến — để bắt được nhiều lỗi hơn, và tránh thiên vị.

3. **Hiện kế hoạch, chờ duyệt.** Vì đây là việc nhiều bên, người quản lý hiện ra: "Sẽ gửi 4 file cho 2 thợ soát độc lập, gom ý kiến lại, ước tính khoảng 2-3 lượt. Đồng ý không?" Anh Minh gõ `Y`.

4. **Giao việc + làm cầu nối.** Người quản lý gửi nội dung 4 file kèm yêu cầu rõ ràng sang từng thợ. Các thợ đọc, trả về danh sách góp ý: chỗ này một câu bị lặp ý ở file khác, chỗ kia thổi một lợi ích phụ lên thành lý do chính, chỗ nọ dùng một hình ảnh so sánh gượng ép khó hiểu.

5. **Gom + đối chiếu.** Người quản lý đọc góp ý của cả hai thợ, thấy có chỗ hai bên nói lệch nhau — một thợ bảo đoạn nọ "sai bản chất", thợ kia bảo "vẫn ổn". Vì đây là mâu thuẫn thật, người quản lý áp dụng Cách 4: cho hai bên phản biện một vòng, rồi tự phân xử, đánh dấu rõ "đây là phần tôi quyết" để anh Minh có thể xem lại.

6. **Chốt + báo cáo.** Người quản lý trình cho anh Minh một danh sách góp ý gọn gàng, đã lọc trùng và đã giải quyết chỗ mâu thuẫn — kèm ghi rõ đã nhờ những ai, mỗi tài khoản lúc đó còn bao nhiêu sức. Việc **sửa** 4 file theo góp ý đó thì anh Minh quyết định làm sau, do trợ lý chính đảm nhiệm — chứ `/delegate` không tự động sửa vào tài liệu thật.

Kết quả: anh Minh có được góc nhìn từ bên ngoài (bắt được lỗi mà anh tự đọc sẽ bỏ qua), không tốn lượt của trợ lý chính cho phần soát, và toàn bộ quá trình anh đều được xem trước và chốt cuối.

---

## Xem thêm

Tài liệu này chỉ giải thích ý tưởng và luồng chạy ở mức dễ hiểu, và nói theo kiểu chung ("nhiều thợ, nhiều tài khoản trên một máy"). Muốn xem chi tiết kỹ thuật thật (tên các công cụ cụ thể trên máy, cách đọc hạn mức, cú pháp gọi từng loại thợ, các mức làm việc), đọc file gốc: `.claude/skills/delegate/SKILL.md`.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
