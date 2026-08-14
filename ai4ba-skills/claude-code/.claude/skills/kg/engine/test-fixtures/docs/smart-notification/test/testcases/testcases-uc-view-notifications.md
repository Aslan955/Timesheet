---
**STT:** 01
**Category:** Truy cập màn Thông báo
**Sub-Category:** Hiển thị danh sách
**Checklist:** CHK-smart-notification-001 — Verify danh sách thông báo hiển thị đúng thứ tự mới nhất trước, tối đa 50 item/trang
**Ref:** FR-smart-notification-001
**Priority:** 1
**Title:** Verify danh sách thông báo sắp xếp mới nhất trước, giới hạn 50 item/trang
**Description:** Kiểm tra màn notification-list tải danh sách thông báo in-app đúng thứ tự thời gian giảm dần và không vượt quá 50 item trên 1 trang.
**Auto:** Yes
**Preconditions:** Learner đã đăng nhập và có ít hơn 50 thông báo trong 90 ngày gần nhất

**Step:** 1
**Action:** Learner mở màn hình Thông báo từ icon chuông trên thanh điều hướng chính
**Expected:** Màn notification-list mở, hệ thống bắt đầu tải danh sách
**Test Data:** —

**Step:** 2
**Action:** Quan sát thứ tự và số lượng item trong danh sách vừa tải
**Expected:** Danh sách hiển thị các thông báo theo thứ tự mới nhất trước; số item hiển thị không vượt quá 50
**Test Data:** —
---
__STT:__ 02
__Category:__ Đánh dấu đã đọc + badge
__Sub-Category:__ Cập nhật trạng thái đã đọc
__Checklist:__ CHK-smart-notification-003 — Verify chạm vào 1 thông báo đánh dấu thông báo đó là đã đọc và badge số chưa đọc giảm tương ứng ngay lập tức
__Ref:__ FR-smart-notification-002
__Priority:__ 1
__Title:__ Verify chạm vào thông báo chưa đọc chuyển trạng thái đã đọc và giảm badge ngay lập tức
__Description:__ Kiểm tra hành động chạm vào 1 thông báo chưa đọc cập nhật trạng thái đã đọc/chưa đọc của đúng item đó và badge số chưa đọc giảm tương ứng (FR-smart-notification-005) mà không cần tải lại trang.
__Auto:__ Yes
__Preconditions:__ Learner đã đăng nhập, danh sách notification-list đang hiển thị ít nhất 1 thông báo ở trạng thái chưa đọc, badge hiện tại hiển thị 3

__Step:__ 1
__Action:__ Learner chạm vào 1 thông báo đang ở trạng thái chưa đọc trong danh sách
__Expected:__ Thông báo được mở xem chi tiết và item đó chuyển sang trạng thái đã đọc trong danh sách
__Test Data:__ badge trước đó: 3

__Step:__ 2
__Action:__ Quan sát badge số chưa đọc trên icon chuông ngay sau khi thông báo được đánh dấu đã đọc
__Expected:__ Badge giảm còn "2" ngay lập tức, không cần tải lại màn hình
__Test Data:__ badge sau: 2‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍
---
__STT:__ 03
__Category:__ Đánh dấu đã đọc + badge
__Sub-Category:__ Cập nhật trạng thái đã đọc
__Checklist:__ CHK-smart-notification-005 — Verify badge hiển thị "99+" khi số thông báo chưa đọc vượt quá 99, không hiển thị số chính xác quá lớn
__Ref:__ FR-smart-notification-005
__Priority:__ 2
__Title:__ Verify badge chuyển hiển thị "99+" khi số thông báo chưa đọc vượt quá 99
__Description:__ Kiểm tra badge số chưa đọc trên icon chuông không hiển thị số chính xác gây rối giao diện khi vượt ngưỡng 99, mà chuyển sang dạng rút gọn "99+".
__Auto:__ Yes
__Preconditions:__ Learner đã đăng nhập, tài khoản có 100 thông báo chưa đọc

__Step:__ 1
__Action:__ Learner mở màn hình Thông báo khi có 100 thông báo chưa đọc
__Expected:__ Badge trên icon chuông hiển thị "99+", không hiển thị "100"
__Test Data:__ số thông báo chưa đọc: 100
---‍​​‌‌​‌‌​‌‌‌​​‌​‌‌‌​​​​​​‌​‌‌​‌‌‌‌‌‌​​​​‌​‌‌​‌‌‌‌​‌‌‌‌‌‌‌‌​‌‌​‌​​‌​‌‌‌​​​‌‌‌‌‌‌​​​‌​‌‌‌​​‌‌‌‌‌​​‌​‌‌‌‌‌​‌​​‌‌​​‌​​‌​​​​‌‌​​​​​​‌​‍


<!-- wm:3fed37a0598336173f221e8b9a1ea6e6 -->
<sub>Tài liệu thuộc bộ AI4BA BA-Kit — bản quyền ai4ba.com</sub>
