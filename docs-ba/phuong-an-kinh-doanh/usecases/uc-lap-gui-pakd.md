# Use Case: Lập, lưu nháp và gửi PAKD lần đầu / làm lại

> Scope: MH-02c — khung PAKD và nút trên đầu trang · Level: user goal

## Primary Actor

Giám đốc kinh doanh (SM) hoặc Giám đốc khối (GĐK) của khối dự án (Phase H — Q-19).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| SM / GĐK | Có PAKD được Kế toán duyệt trong 30 ngày để dự án không bị Pending |
| Kế toán (CFO) | Nhận PAKD đủ thông tin bắt buộc để duyệt; số liệu dự án chỉ đổi sau khi mình duyệt |
| Ban lãnh đạo | Sổ theo dõi / báo cáo chỉ phản ánh PAKD đã duyệt |

## Trigger

SM / GĐK mở dự án trạng thái "Chưa có PAKD" (link "Lập PAKD" ở danh sách hoặc bấm dòng dự án).

## Preconditions

- Dự án trạng thái "Chưa có PAKD" (mới cấp mã hoặc bị Kế toán từ chối, không Pending).
- Người dùng vai trò SM hoặc GĐK.

## Guarantees

- __Minimal Guarantee:__ nếu không lưu / gửi được, dữ liệu dự án và PAKD đã lưu không đổi; dự án không nhận số liệu nào từ PAKD chưa duyệt.
- __Success Guarantee:__ (Lưu nháp) PAKD được lưu kèm người / thời điểm, trạng thái giữ nguyên, lịch sử "Lưu nháp PAKD". (Gửi) dự án "PAKD chờ duyệt", thêm phiên bản "Chờ CFO" số V{n} = số bản đã duyệt + 1, bản chụp lúc nộp được lưu, lịch sử "Nộp PAKD"; số liệu dự án chưa đổi.

## Main Success Scenario

1. SM / GĐK mở dự án "Chưa có PAKD"; hệ thống hiện khung cho nhập và 2 nút **Lưu nháp** · **Gửi Kế toán duyệt** trên đầu trang.
2. Hệ thống nạp PAKD đã lưu, hoặc form trống điền sẵn (mốc gợi ý, khoản mục mẫu, thông tin từ hợp đồng / thời gian / chi phí kế hoạch của dự án).
3. Người dùng chọn Tình trạng dự án và nhập Mục 1.
4. (Đã ký) Người dùng nhập Mục 2 Bắt đầu / Kết thúc / Phạm vi, Mục 3 các mốc nghiệm thu (tổng 100%), Mục 4 kế hoạch chi phí theo tháng (có thể dùng ÷ chia đều).
5. Hệ thống tính lại chỉ số, biểu đồ, tóm tắt, tháng thu tiền mỗi lần đổi ô.
6. Người dùng bấm **Gửi Kế toán duyệt**.
7. Hệ thống kiểm tra theo tình trạng — hợp lệ.
8. Hệ thống lưu PAKD, chuyển dự án sang "PAKD chờ duyệt", thêm phiên bản "Chờ CFO" số V{n} = số bản đã duyệt + 1, lưu bản chụp nội dung lúc nộp, ghi lịch sử "Nộp PAKD". Hệ thống không đồng bộ số liệu PAKD vào dự án.
9. Hệ thống hiện toast "Đã gửi PAKD V{n} — chờ Kế toán (CFO) duyệt"; khung chuyển chỉ xem, nhãn "Đã có PAKD · chờ Kế toán duyệt".

## Extensions

__3a. Tình trạng Chưa ký:__
- 3a1. Người dùng nhập Thời điểm dự kiến ký, Giá trị dự kiến, Xác suất, Phạm vi, Đánh giá rủi ro và bảng Mốc kế hoạch thay cho bước 4.
- 3a2. Giai đoạn có tiền mà thiếu "Từ" hoặc "Đến" trước "Từ" → hệ thống hiện cảnh báo cam E-phuong-an-kinh-doanh-017, vẫn cho gửi.

__3b. Người dùng đổi Chưa ký → Đã ký:__
- 3b1. Hệ thống điền sẵn giá trị HĐ, kỳ thực hiện, chuyển giai đoạn sang chi phí tháng nếu chưa có chi phí; xoá dải lỗi.

__3d. Dự án đã được đánh dấu "đã ký" (đã lưu P-03):__
- 3d1. Lựa chọn "Chưa ký" bị khoá, kể cả khi lập lần đầu / làm lại (BR-phuong-an-kinh-doanh-021; Phase H — Q-26).

__3c. Ô tháng nhập sai dạng:__
- 3c1. Hệ thống tô đỏ ô (E-phuong-an-kinh-doanh-012), giữ giá trị cũ. Gõ "2/2027" được chấp nhận và chuẩn hoá thành "02/2027".

__4a. % / tỷ lệ thanh toán / xác suất lớn hơn 100:__
- 4a1. Hệ thống tự đưa về 100.

__6a. Người dùng bấm Lưu nháp:__
- 6a1. Hệ thống lưu không kiểm tra, trạng thái giữ nguyên, ghi lịch sử "Lưu nháp PAKD", toast "Đã lưu nháp PAKD". Use case kết thúc.

__7a. Nội dung không hợp lệ:__
- 7a1. Hệ thống hiện dải đỏ "Chưa gửi được — cần bổ sung:" + danh sách lỗi E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010, cuộn tới khung; không gửi.
- 7a2. Người dùng sửa (dải tự mất khi sửa ô), quay lại bước 6.

__1a. Dự án đã bị Kế toán từ chối:__
- 1a1. Dòng thông báo "PAKD V{n} bị từ chối ({ý kiến}) — cần lập lại. Hạn lập: …"; nhãn khung "Từ chối — làm lại"; Thời gian còn lại đếm tiếp.
- 1a2. Gửi lại vẫn mang số V{n}; toast "Đã gửi PAKD V{n} — chờ Kế toán (CFO) duyệt".

__1b. Người dùng không phải SM / GĐK, hoặc là SM / GĐK của khối khác:__
- 1b1. Kế toán: khung chỉ xem, chân khung "Đang chờ SM / GĐK lập PAKD." (Phase H — Q-17, Q-27). SM / GĐK khối khác: không thấy dự án trong danh sách; mở trực tiếp hoặc cố ghi bị từ chối "Bạn không có quyền thực hiện thao tác này." (E-phuong-an-kinh-doanh-018; Phase H — Q-19). Use case kết thúc.

__\*a. Quá Hạn lập PAKD mà chưa có bản được duyệt:__
- \*a1. Tác vụ hằng ngày tự chuyển dự án Pending (feature `quan-ly-du-an-kinh-doanh`); khung chuyển chỉ xem.

__\*b. Dữ liệu dự án đổi (vd lưu P-03) khi đang nhập:__
- \*b1. Khung nạp lại theo dữ liệu mới, phần chưa lưu bị bỏ; nếu do người khác gây ra thì hiện "Dữ liệu dự án vừa thay đổi — khung PAKD đã được tải lại." (E-phuong-an-kinh-doanh-024; FR-phuong-an-kinh-doanh-003, Phase H — Q-38).

__\*c. Tại lúc Lưu nháp / Gửi, dự án không còn "Chưa có PAKD" (PAKD vừa được người khác gửi, dự án vừa Pending) hoặc P-03 vừa đổi Mục 1:__
- \*c1. Không ghi, báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-phuong-an-kinh-doanh-019), tự nạp lại dự án và khung (Phase H — Q-21). Use case kết thúc.

__\*d. Hệ thống không ghi được trọn vẹn:__
- \*d1. Không đổi gì, báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-phuong-an-kinh-doanh-020), khung giữ nội dung đang nhập; bấm lại được.

## Related Requirements

FR-phuong-an-kinh-doanh-002, FR-phuong-an-kinh-doanh-003, FR-phuong-an-kinh-doanh-011…FR-phuong-an-kinh-doanh-017, FR-phuong-an-kinh-doanh-019…FR-phuong-an-kinh-doanh-023, FR-phuong-an-kinh-doanh-038 · BR-phuong-an-kinh-doanh-002, BR-phuong-an-kinh-doanh-010…BR-phuong-an-kinh-doanh-017, BR-phuong-an-kinh-doanh-020…BR-phuong-an-kinh-doanh-026, BR-phuong-an-kinh-doanh-033…BR-phuong-an-kinh-doanh-036, BR-phuong-an-kinh-doanh-044 · E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010, E-phuong-an-kinh-doanh-012…E-phuong-an-kinh-doanh-014, E-phuong-an-kinh-doanh-017…E-phuong-an-kinh-doanh-022, E-phuong-an-kinh-doanh-024
