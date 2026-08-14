# Reqwise Figma MCP — kèm theo bộ BA-Kit‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

> Cầu nối để AI **đọc và vẽ trực tiếp lên Figma**. Skill `/figma` trong bộ này cần nó mới chạy được.
>
> Đây là phần **tùy chọn** — chỉ cài khi các bạn thật sự dùng `/figma`. Không cài thì 55 skill còn lại vẫn chạy bình thường.

---

## Nó để làm gì‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Bình thường AI chỉ mô tả màn hình bằng chữ. Với MCP này, AI **vẽ thẳng vào file Figma** của các bạn: tạo frame, đặt text, áp màu theo design token, dựng component.

Khác biệt chính so với các Figma MCP khác: nó **tự kiểm tra kết quả vẽ**. Sau khi vẽ, AI hỏi được "chữ có bị cắt không, khối có tràn ra ngoài khung không" và nhận câu trả lời bằng số đo thật — thay vì chụp màn hình rồi đoán bằng mắt.

Đây là điều làm `/figma` dùng được thật, chứ không phải vẽ ra một mớ lệch lạc rồi bạn phải sửa tay.

---

## Cài thế nào‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Giải nén `reqwise-figma-mcp-0.1.0.zip` vào **một chỗ cố định** — không để trong thư mục dự án, vì đây là công cụ dùng chung cho mọi dự án.

```bash
unzip reqwise-figma-mcp-0.1.0.zip -d ~/tools/
```

Sau đó mở AI (Claude Code) **ngay trong thư mục vừa giải nén** và nhờ nó tự cài:

```text
Đọc README.md và docs/INSTALL.md trong thư mục này.

Tôi dùng [Claude Code / Cursor / Claude Desktop]. Hãy hướng dẫn tôi cài đặt
từng bước một, và làm hộ những bước có thể làm bằng lệnh.

Sau khi cài xong, chỉ tôi cách kiểm tra kết nối đã chạy chưa.
```

Cách này nhanh hơn tự đọc tài liệu, vì nó tự phát hiện máy các bạn thiếu gì.

> **Cần Figma bản desktop**, không dùng được với Figma trên trình duyệt — vì nó cần cài một plugin đi kèm.

---

## Tài liệu trong gói‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Sau khi giải nén, các file đáng đọc (đều bằng tiếng Anh):

| File | Nội dung |‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
|---|---|
| `README.md` | Tổng quan + hướng dẫn nhanh |
| `docs/INSTALL.md` | Cài đặt chi tiết cho từng loại AI |
| `docs/SETUP.md` | Cấu hình, biến môi trường |
| `docs/TOOLS.md` | Danh sách đầy đủ các thao tác AI làm được |
| `docs/RECIPES.md` | Công thức có sẵn cho việc hay gặp |
| `ARCHITECTURE.md` | Vì sao thiết kế như vậy |

Ngại đọc tiếng Anh thì nhờ AI tóm tắt — nó đọc được cả thư mục:

```text
Đọc docs/TOOLS.md trong thư mục này. Tóm tắt bằng tiếng Việt: AI làm được
những thao tác gì trên Figma, nhóm theo mục đích. Tôi là BA, không rành kỹ thuật.
```

---

## Kiểm tra đã chạy chưa‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍

Cài xong, mở Claude Code trong thư mục dự án của các bạn rồi hỏi:

```text
Kiểm tra kết nối Figma MCP giúp tôi. Nếu chưa chạy thì chỉ tôi thiếu bước nào.
```

Chạy được rồi thì quay lại dùng skill:

```
/figma <tên-feature>
```

Skill này cần có wireframe ASCII trước làm nguồn — xem `explain-skills/figma.md` trong gói BA-Kit.

---

## Lưu ý

**Đây là phần mềm riêng, có giấy phép riêng.** Xem file `LICENSE` bên trong gói giải nén — không thuộc phạm vi giấy phép của BA-Kit.

**Chạy trên máy các bạn.** Nó không gửi file Figma đi đâu ngoài kết nối giữa máy các bạn và Figma desktop.

**Cần Node.js.** Nếu chưa có, cài từ [nodejs.org](https://nodejs.org) trước.‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền hoangphan.blog</sub>
