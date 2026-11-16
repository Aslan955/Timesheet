# Quy tắc cho Claude khi làm việc với prototype Timesheet

## Ghi mô tả thay đổi trước mỗi lần đẩy lên Bitbucket

- `Day-len-Bitbucket.bat` gộp mọi thay đổi chưa đẩy thành **một commit** trên nhánh `plan/qa-ba-docs` (thư mục `docs/BA-docs/prototype`).
- Nội dung commit lấy từ file `.bitbucket-message.txt` ở thư mục gốc Timesheet.
- Đẩy thành công thì file bat chuyển nội dung sang `lich-su-day-bitbucket.txt` (cạnh file bat) và xoá `.bitbucket-message.txt`.

**Mỗi lần sửa code, Claude phải:**

1. Đọc `.bitbucket-message.txt` hiện có trên máy người dùng:
   - nếu file không còn thì lần đẩy trước đã xong, bắt đầu file mới;
   - nếu còn thì ghi thêm vào file đó.
2. Ghi thay đổi vừa làm vào đúng nhóm, mỗi dòng ghi rõ **module / màn hình** và **làm gì**:
   - `THÊM MỚI`: chức năng, màn hình, trường, nút mới.
   - `THAY ĐỔI`: đổi logic, giao diện, công thức, luồng duyệt.
   - `XOÁ / BỎ`: bỏ cột, dòng, nút, chức năng.
   - `SỬA LỖI`: lỗi đã sửa.
3. Gộp các lần sửa qua lại cho gọn. Ví dụ: thêm rồi lại bỏ trong cùng đợt thì không ghi, hoặc chỉ ghi kết quả cuối.
4. Cuối file ghi danh sách file chính bị sửa.
5. Chép `.bitbucket-message.txt` về máy người dùng cùng các file code. Không commit file này vào git trong máy cloud.
6. Commit git trong máy cloud cũng ghi rõ dạng `<Module/màn hình>: <thêm / sửa / bỏ gì>`.

Mẫu nội dung file:

```
[Prototype Timesheet] <Module> › <Màn hình> — <chủ đề chính>

THÊM MỚI
- <Màn hình>: <mô tả>
THAY ĐỔI
- ...
XOÁ / BỎ
- ...
SỬA LỖI
- ...

File chính: src/...
```

Bỏ các nhóm không có nội dung. Viết tiếng Việt có dấu, câu ngắn, người khác đọc là biết đẩy lên cái gì.
