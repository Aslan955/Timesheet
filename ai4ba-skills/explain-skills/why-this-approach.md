---
type: skill-explainer
skill: why-this-approach
updated: 2026-07-14
---

# Vì sao làm theo cách này? — bàn về triết lý nền tảng‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Đây là file __nên đọc đầu tiên__, trước mọi file explainer của từng lệnh. Các file kia trả lời "lệnh này làm gì, chạy thế nào". File này trả lời câu hỏi đứng *trước* đó và bao trùm hơn: __vì sao cả bộ công cụ lại được thiết kế theo kiểu này__ — vì sao tài liệu nằm ngay trong dự án, vì sao dùng nhiều "bộ não" AI, làm sao AI hiểu đúng việc, và năm mảnh ghép (lệnh / chuyên gia / nội quy / cảm biến / trí nhớ) ăn khớp với nhau ra sao.

## 1. Cách làm cũ hỏng ở đâu‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cách nhiều người đang làm việc với AI hôm nay: mở một ô chat trên web, gõ yêu cầu, AI trả lời, rồi __copy kết quả dán vào Word/Confluence__. Nghe thì tiện, nhưng nó rò rỉ ở bốn chỗ:

| Vấn đề của cách cũ | Chuyện gì xảy ra |
|---|---|
| __Ngữ cảnh không tập trung__ | Tài liệu nằm ở Word, ý tưởng nằm trong đầu, quyết định nằm rải trong các đoạn chat cũ. Không chỗ nào là "sự thật gốc". |
| __Phải tự nhập lại ngữ cảnh mỗi lần__ | Mỗi lần hỏi AI phải kể lại "dự án này là gì, tính năng này ra sao". Kể thiếu → AI đoán sai. Kể đủ → mất thời gian, mà lần sau vẫn phải kể lại. |
| __Chép tay là nơi sai sót sinh ra__ | Copy/paste giữa chat và tài liệu làm lệch bản, quên cập nhật chỗ này chỗ kia. Không ai biết bản nào mới nhất. |
| __AI không thấy tài liệu khác của bạn__ | Bạn viết yêu cầu, nhưng AI không tự đọc được tài liệu nghiệp vụ đã có để dùng lại — nên nó dễ bịa hoặc mâu thuẫn với cái bạn đã chốt. |

Gốc rễ của cả bốn: __ngữ cảnh dự án bị tách rời khỏi nơi làm việc.__ AI giỏi tới đâu cũng chỉ trả lời tốt bằng ngữ cảnh nó được thấy — mà theo cách cũ, nó gần như không thấy gì ngoài câu bạn vừa gõ.

## 2. Trụ 1 — Tài liệu sống ngay trong dự án (local-first)‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Ở đây mọi tài liệu BA đều là __file thật nằm trong thư mục dự án__ (`docs/{tính-năng}/...`), không phải nội dung trôi nổi trong một ô chat. Đây là điểm xoay của mọi thứ khác.

Vì tài liệu nằm ngay cạnh nhau trong một thư mục:

- __AI tự đọc được tài liệu đã có.__ Khi bạn chạy một lệnh, nó không bắt đầu từ con số không — nó đọc yêu cầu người dùng, quy tắc nghiệp vụ, luồng màn hình bạn đã viết trước đó, rồi dùng lại. Không phải kể lại từ đầu.
- __Một nguồn sự thật duy nhất.__ Sửa ở đây là sửa thật, không có bản copy lạc ở nơi khác.
- __Lịch sử thay đổi tự ghi lại__ (`docs/_shared/changelog.md`) — ai làm gì, lúc nào, không cần nhớ thủ công. Kèm theo là bảng cảnh báo `staleness.md` — tài liệu nào cần rà lại vì tài liệu gốc của nó vừa đổi. (Hai cuốn sổ này khác vai nhau thế nào: `explain-skills/changelog-staleness.md`.)
- __Mở bằng công cụ quen__ (VS Code, Obsidian, GitHub) — hình vẽ, bảng biểu hiện ra ngay.

Nói ngắn: __ngữ cảnh dự án và nơi làm việc giờ là một.__ Đó là lý do AI ở đây trả lời sát nghiệp vụ hơn hẳn một ô chat rời.

## 3. Trụ 2 — Nhiều "bộ não" AI, mỗi cái một vai‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Không chỉ một AI. Hệ thống điều phối được __nhiều trợ lý AI khác nhau__ (Claude, Codex, và các CLI khác) — không phải để cho oai, mà vì hai lý do thực tế:

- __San tải khi hết lượt dùng (quota).__ Mỗi AI có giới hạn lượt trong ngày. Khi một cái sắp cạn, việc nặng được đẩy sang cái khác — công việc không bị đứng. Ở đây Claude đóng vai __kiến trúc sư chính__ (chốt hướng, ráp kết quả), các AI khác __gánh việc nặng__ khi cần.
- __Ý kiến thứ hai độc lập.__ Một AI tự chấm bài của chính nó thường dễ dãi. Nên với việc quan trọng, một AI *viết*, một AI *khác* soi lỗi — thậm chí cho hai bên "tranh luận" rồi Claude làm trọng tài chốt. Cách này bắt được lỗi mà một mình không thấy.

Bạn không cần bận tâm cái nào đang chạy — hệ thống tự chọn theo việc và theo lượt còn lại. (Muốn hiểu sâu cách điều phối này, đọc `explain-skills/delegate.md`.)

## 4. Trụ 3 — Nói chuyện với thế giới bên ngoài qua MCP‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Tài liệu nằm local là tốt, nhưng công việc BA còn phải __chạm tới công cụ khác__: đẩy story lên Jira, cập nhật trang Confluence, vẽ lên Figma. Nếu phải làm tay hết thì lại quay về chuyện copy/paste.

Hệ thống giải chuyện này bằng __MCP__ — một chuẩn cho phép AI __kết nối trực tiếp tới công cụ ngoài__ và thao tác thật:

| Công cụ ngoài | AI làm được gì qua MCP |
|---|---|
| __Jira__ | Đẩy user story / epic lên, kéo trạng thái + bình luận về, đối chiếu hai chiều để không ghi đè nhầm |
| __Confluence__ | Đăng / cập nhật trang tài liệu, kéo bình luận của người duyệt về hộp phản hồi |
| __Figma__ | Vẽ màn hình thật lên file thiết kế theo đúng bộ màu / khoảng cách đã quy định |

Điểm cốt lõi: tài liệu __gốc vẫn sống ở local__ (nơi bạn kiểm soát), còn MCP là __cây cầu hai chiều__ ra ngoài — thay đổi ở đâu cũng được *phát hiện* và *đối chiếu* đàng hoàng, không ghi đè im lặng. Bạn không rời khỏi luồng làm việc để đi cập nhật tay từng nơi.

__Vì sao vẽ Figma qua đây tốt hơn vẽ thẳng trên công cụ AI thiết kế.__ Đây là điểm nhiều người bỏ lỡ. Khi bạn dùng một AI agent vẽ thẳng trên Figma/Stitch, hay dựng prototype trên v0 / Lovable, chúng ra hình __đẹp__ — nhưng chúng chỉ biết đúng câu bạn vừa gõ, __không có ngữ cảnh nghiệp vụ__. Nên hình ra thường thiếu: thiếu trạng thái lỗi, thiếu màn hình cho trường hợp biên (hết hạn, không có dữ liệu, mất mạng), thiếu ràng buộc nghiệp vụ đã chốt ở tài liệu. Bạn lại phải ngồi sửa tay từng cái.

Ở đây thì ngược lại: vì AI đã __đọc sẵn cả bộ tài liệu nghiệp vụ__ (yêu cầu, luồng, danh sách lỗi, ca sử dụng) rồi mới vẽ Figma qua MCP, nên hình ra __sát nghiệp vụ và đủ case__ ngay từ đầu — đúng các màn hình cần có, đúng trạng thái lỗi, đúng trường hợp biên. Cùng một AI, nhưng có ngữ cảnh thì đỡ cực hơn rất nhiều so với vẽ thẳng không ngữ cảnh. (Chi tiết ở `explain-skills/jira.md`, `confluence.md`, và các file về Figma / prototype.)

## 5. Trụ 4 — AI len lỏi vào luồng làm việc thật của bạn

Ba trụ trên nói về *chỗ để tài liệu* và *công cụ*. Trụ này nói về điều quan trọng nhất: __AI không phải một ô chat bạn ghé qua rồi rời đi — nó nằm ngay trong luồng làm việc hằng ngày của bạn.__ Bạn không "đi hỏi AI" như một việc riêng; AI có mặt ở từng bước của quy trình BA — lúc phỏng vấn làm rõ, lúc viết tài liệu, lúc vẽ sơ đồ, lúc rà lỗi, lúc đồng bộ ra ngoài.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Điều này thành hiện thực nhờ __năm loại mảnh phối hợp__ như một xưởng thợ. Hình dung một xưởng:

| Mảnh | Ví như | Vai trò |
|---|---|---|
| __Lệnh (skill)__ | Người thợ lành nghề | Làm ra một loại tài liệu cụ thể — `/urd` viết yêu cầu người dùng, `/sequence` vẽ sơ đồ, `/jira` đồng bộ backlog |
| __Nội quy (rule)__ | Nội quy của xưởng | Quy tắc chung mọi người thợ phải theo — cách đặt tên file, quy tắc "phải hỏi bạn trước khi ghi", ngôn ngữ nghiệp vụ chứ không kỹ thuật |
| __Chuyên gia (agent)__ | Chuyên gia mời vào soi | Người duyệt độc lập cho từng lĩnh vực — một chuyên gia UX soi luồng màn hình, một chuyên gia QA soi tính kiểm thử được |
| __Cảm biến (hook)__ | Cảm biến tự động của xưởng | Chạy ngầm sau mỗi lần ghi — tự ghi nhật ký thay đổi, tự đánh dấu tài liệu nào đã cũ do phụ thuộc |
| __Trí nhớ (memory)__ | Sổ tay ghi nhớ của xưởng | Nhớ bạn là ai, thói quen của bạn, quyết định đã chốt — để không hỏi lại lần sau |

Khi bạn gõ __một__ lệnh, cả năm mảnh này cùng vào việc: người thợ (lệnh) làm theo nội quy (rule), mời chuyên gia (agent) soi, cảm biến (hook) ghi lại dấu vết, dựa trên trí nhớ (memory) về bạn. Bạn chỉ thấy một câu lệnh — bên dưới là cả xưởng phối hợp.

Một sợi chỉ đỏ xuyên suốt tất cả: __luôn hỏi bạn trước khi ghi.__ Không mảnh nào tự ý sửa tài liệu — nó trình bày kế hoạch, cho bạn xem, bạn đồng ý rồi mới ghi. Bạn là người quyết, AI là người làm.

## 6. Hai điều khiến bộ tài liệu không "chết cứng"

Viết tài liệu ra là một chuyện. Giữ cho cả bộ __nhất quán khi có thay đổi__ — và __kiểm soát được chất lượng__ — mới là chỗ cách cũ đuối nhất. Hai cơ chế dưới đây lo đúng hai việc đó.

__Cập nhật + tự rà thiếu sót và mâu thuẫn giữa các tài liệu.__ Trong thực tế yêu cầu luôn đổi. Ở cách cũ, đổi một chỗ trong Word thì các tài liệu liên quan (story, màn hình, test) lặng lẽ lệch nhau — không ai biết cho tới khi lỗi lộ ra. Ở đây có lệnh quản lý thay đổi (`/cr`) và rà truy vết (`/gap`): khi bạn đổi một yêu cầu, hệ thống __soi ngược ra mọi tài liệu bị ảnh hưởng__, chỉ ra chỗ nào giờ thiếu, chỗ nào mâu thuẫn với chỗ khác, rồi đề xuất sửa. Cả bộ tài liệu được giữ ăn khớp thay vì rã dần theo thời gian.

__Luôn có con người trong vòng lặp (HITL) để kiểm soát chất lượng.__ AI làm nhanh, nhưng *bạn* mới là người chịu trách nhiệm về tài liệu. HITL ở đây có hai chiều:

- __Bạn là người cấp ngữ cảnh khi AI thiếu.__ AI đọc được tài liệu đã có, nhưng chỗ nào tài liệu chưa nói tới — một con số nghiệp vụ, một quy tắc, một quyết định chưa ghi ở đâu — thì nó __dừng lại hỏi bạn, chứ không tự bịa__. Bạn trả lời, nó mới viết tiếp. Đây là điều giữ cho tài liệu đúng với thực tế nghiệp vụ, không phải "AI đoán cho có".
- __Bạn duyệt trước mọi thay đổi.__ Không có bước nào AI tự ý ghi đè: mỗi lần định tạo hay sửa file, nó __trình kế hoạch / bản nháp / khác biệt cho bạn xem trước__ — bạn đồng ý, sửa lại, hoặc huỷ. Với những thứ ra ngoài (đẩy Jira, đăng Confluence) thì càng chặt: đối chiếu kỹ, không đè nhầm việc người khác.

Kết quả: bạn được tốc độ của AI mà __không mất quyền kiểm soát__ — chất lượng cuối vẫn do bạn gác cổng, và nội dung vẫn xuất phát từ hiểu biết nghiệp vụ của bạn.

## 7. Ví dụ thực tế — một buổi chiều của chị Hà

Chị __Hà__, BA của app học tiếng Anh, cần đặc tả tính năng "đặt lịch học". So hai cách:

__Cách cũ:__ chị mở chat web, gõ mô tả, AI trả về một bản yêu cầu. Chị copy vào Word. Rồi cần sơ đồ — chị lại kể lại toàn bộ ngữ cảnh cho AI (vì nó đã quên), copy hình dán vào. Rồi đẩy Jira — chị gõ tay từng story. Ba nơi (chat, Word, Jira), không nơi nào biết nơi kia, và nửa buổi trôi vào copy/paste.

__Cách này:__ chị gõ `/urd đặt-lịch-học`. Lệnh tự đọc ghi chú nghiệp vụ đã có, phỏng vấn chị đúng vài chỗ thiếu, trình kế hoạch, chị duyệt — file yêu cầu ra đời trong dự án. Chị gõ `/sequence` — lệnh __tự đọc lại__ file yêu cầu vừa xong làm nền, không cần kể lại. Một chuyên gia AI soi luồng, bắt một nhánh lỗi chị quên. Chị gõ `/jira` — story đẩy thẳng lên Jira qua MCP, đối chiếu để không đè nhầm. Nhật ký tự ghi ai làm gì. Cuối buổi chị có một bộ tài liệu __nhất quán, liên kết với nhau, đồng bộ ra ngoài__ — không một lần copy/paste.

Khác biệt không nằm ở "AI thông minh hơn". Nó nằm ở chỗ __ngữ cảnh không bị rơi rớt giữa các bước__ — và đó chính là điều cách cũ không làm được.

## 8. Ba lợi ích đến "miễn phí" từ cách làm này

Ba điều dưới đây không phải tính năng riêng — chúng là __hệ quả tự nhiên__ của việc để tài liệu sống chung một chỗ. Cách cũ khó có được, dù cố tới đâu.

__Mọi tài liệu liên kết và truy vết được với nhau.__ Yêu cầu nối tới story, story nối tới màn hình, màn hình nối tới lỗi và test. Nhờ vậy bạn trả lời được ngay câu "đổi yêu cầu này thì kéo theo những gì" — và thấy được chỗ nào còn hở (yêu cầu chưa có story, story chưa có màn hình). Word rời rạc không làm được: ở đó mối liên hệ chỉ nằm trong đầu người viết, mất người là mất luôn.

__Một bộ tài liệu nuôi được nhiều đầu ra, không lệch nhau.__ Cùng một gốc sự thật (yêu cầu + luồng) đẻ ra được sơ đồ, wireframe, prototype, story Jira, cẩm nang vận hành — tất cả __cùng một nguồn__ nên tự khớp nhau. Không còn cảnh sơ đồ nói một đằng, story nói một nẻo vì được viết rời ở hai nơi hai lúc.

__Không bị khoá vào một hãng.__ Tài liệu ở đây là __file markdown thường trong dự án của bạn__, không bị nhốt trong một app đóng. Bạn đổi AI khác, đổi công cụ khác, hay chỉ đơn giản muốn mở bằng tay — tài sản vẫn nguyên đó, đọc được, chuyển được. Bạn sở hữu nội dung, không phải đi thuê chỗ chứa nó.

## 9. Vì sao cách này đáng học — tóm một câu

> Cách cũ bắt __bạn__ làm cầu nối: bê ngữ cảnh từ đầu bạn vào chat, bê kết quả từ chat ra tài liệu, bê tài liệu ra công cụ ngoài — và mỗi lần bê là một lần rơi rớt, sai lệch. Cách này __xoá các cây cầu thủ công đó__: tài liệu sống chung một chỗ với AI (local-first), nhiều bộ não AI san tải và soi lỗi cho nhau, MCP nối thẳng ra công cụ ngoài (nên Figma/prototype ra hình sát nghiệp vụ, đủ case), năm mảnh ghép đưa AI vào đúng luồng làm việc của bạn, và cơ chế quản lý thay đổi giữ cả bộ tài liệu ăn khớp. Xuyên suốt là bạn — người gác cổng chất lượng (HITL): AI thiếu ngữ cảnh thì hỏi, bạn là người cấp (chứ nó không bịa), và bạn duyệt trước mọi thay đổi. Bạn làm ít việc tay hơn, giữ tài liệu là tài sản của mình, mà kiểm soát nhiều hơn.

---

## Xem thêm

Sau khi hiểu __vì sao__ làm theo cách này, đọc tiếp để biết __làm gì__:

- `explain-skills/diagram-selection.md` — bàn chỉ đường: cần vẽ thì nên vẽ loại sơ đồ nào, lệnh nào.
- `explain-skills/delegate.md` — cách điều phối nhiều AI (san tải quota + ý kiến thứ hai + tranh luận) hoạt động chi tiết.
- `explain-skills/jira.md`, `confluence.md` — cách đồng bộ hai chiều ra công cụ ngoài qua MCP.
- Các file explainer từng lệnh khác trong thư mục `explain-skills/` — mỗi file một lệnh.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
