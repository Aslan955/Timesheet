# Use Case: Đồng bộ hợp đồng (P-03) xuống PAKD

> Scope: Hệ thống, khi lưu popup P-03 (popup thuộc `quan-ly-du-an-kinh-doanh`) · Level: subfunction

## Primary Actor

Người cập nhật hợp đồng — SM, GĐK hoặc Kế toán (CFO); hệ thống thực hiện đồng bộ.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| SM / GĐK | Không phải gõ lại thông tin hợp đồng vào PAKD |
| Kế toán (CFO) | Mọi thay đổi PAKD do hợp đồng vẫn qua mình duyệt; biết PAKD đang chờ đã bị cập nhật sau khi nộp |

## Trigger

Lưu P-03 thành công (đã qua kiểm tra của P-03).

## Preconditions

- Người dùng vai trò SM, GĐK hoặc Kế toán (CFO).

## Guarantees

- __Minimal Guarantee:__ PAKD đã duyệt và số liệu dự án do PAKD sinh không bị ghi thẳng; mọi thay đổi số liệu dự án chỉ xảy ra khi Kế toán duyệt.
- __Success Guarantee:__ Mục 1 và kỳ thực hiện của bản PAKD phù hợp khớp hợp đồng (bản đang lập, bản đang chờ, hoặc bản điều chỉnh sinh mới chờ duyệt); khung PAKD nạp lại.

## Main Success Scenario

1. Người dùng lưu P-03; hệ thống lưu hợp đồng, đánh dấu dự án đã ký, tăng Version dự án, ghi lịch sử hợp đồng (feature `quan-ly-du-an-kinh-doanh`).
2. Hệ thống xác định (tại lúc ghi) dự án đã có PAKD được Kế toán duyệt, chưa có bản điều chỉnh nào đang mở, và có ít nhất 1 trường ánh xạ khác PAKD đang áp dụng (BR-phuong-an-kinh-doanh-046).
3. Hệ thống sinh bản điều chỉnh = PAKD đang áp dụng, đặt Tình trạng = Đã ký; Số HĐ, Ngày ký trên HĐ, Ngày ký thực tế = số / ngày ký của hợp đồng (trống thì giữ cũ); Giá trị HĐ = giá trị hợp đồng (0 thì giữ cũ); Bắt đầu / Kết thúc = tháng của thời hạn (trống thì giữ cũ).
4. Hệ thống thêm phiên bản "Chờ CFO" đánh dấu điều chỉnh, số V{n} = số bản đã duyệt + 1, lưu bản chụp lúc nộp — luôn vào "Chờ CFO" kể cả khi nội dung không đạt kiểm tra gửi (xem 3c); số liệu dự án giữ theo bản đang áp dụng. Người nộp = người lưu P-03; lịch sử "Gửi điều chỉnh PAKD V{n} (theo hợp đồng)" (🔶 quyết định thay người dùng trong review — cần xác nhận).
5. Khung PAKD tự nạp lại, nhãn "Chờ duyệt V{n}" (người khác đang mở khung thấy E-phuong-an-kinh-doanh-024); Kế toán duyệt / từ chối theo [[docs/phuong-an-kinh-doanh/usecases/uc-duyet-dieu-chinh-pakd.md|UC duyệt điều chỉnh]].

## Extensions

__1a. Người dùng vai trò AM:__
- 1a1. P-03 chỉ xem; thao tác lưu bị từ chối (E-phuong-an-kinh-doanh-018). Use case kết thúc.

__2a. Dự án có PAKD lần đầu hoặc bản điều chỉnh đang chờ Kế toán duyệt (nhánh (b) / (d)):__
- 2a1. Hệ thống cập nhật Mục 1 và kỳ thực hiện của bản đang chờ theo hợp đồng (như bước 3), đánh dấu phiên bản "Cập nhật theo hợp đồng sau khi nộp", giữ số V{n} và bản chụp lúc nộp, không sinh phiên bản / bản điều chỉnh mới, ghi lịch sử "Cập nhật PAKD theo hợp đồng" ghi chú "bản đang chờ V{n}".
- 2a2. Khi Kế toán mở P-04, popup hiện nhãn và phần so sánh 8 trường với bản chụp ([[docs/phuong-an-kinh-doanh/usecases/uc-duyet-pakd.md|UC duyệt PAKD]] 2a); nếu P-04 đang mở đúng lúc này thì lần bấm Duyệt / Từ chối kế tiếp bị từ chối (E-phuong-an-kinh-doanh-019) và P-04 nạp lại (FR-phuong-an-kinh-doanh-043). Use case kết thúc.

__2b. Dự án chưa có PAKD được duyệt và không có PAKD đang chờ, đã có PAKD đang lập:__
- 2b1. Hệ thống cập nhật Mục 1 và kỳ thực hiện của PAKD đang lập theo hợp đồng (như bước 3), không sinh phiên bản, không đổi số liệu dự án, ghi lịch sử "Cập nhật PAKD theo hợp đồng" ghi chú "bản đang lập". Use case kết thúc.

__2c. Dự án chưa từng lưu PAKD (nhánh (g)):__
- 2c1. Chỉ lưu hợp đồng; khi SM / GĐK mở khung lập lần đầu, Mục 1 nạp sẵn số HĐ, ngày ký, giá trị, kỳ từ hợp đồng. Use case kết thúc.

__2d. Không có trường ánh xạ nào khác bản nhận đồng bộ:__
- 2d1. Chỉ lưu hợp đồng; PAKD, phiên bản, dấu và lịch sử PAKD giữ nguyên (BR-phuong-an-kinh-doanh-046). Use case kết thúc.

__2e. Dự án đang có bản điều chỉnh nháp hoặc bị từ chối, chưa huỷ (nhánh (e)):__
- 2e1. Hệ thống cập nhật Mục 1 và kỳ thực hiện của chính bản điều chỉnh đó, giữ nguyên phần SM / GĐK đang soạn ở các mục khác, không sinh bản điều chỉnh thứ hai; bản Chưa ký không bị chuyển giai đoạn sang kế hoạch chi phí theo tháng.
- 2e2. Ghi lịch sử "Cập nhật PAKD theo hợp đồng" ghi chú "bản điều chỉnh đang soạn"; số liệu dự án không đổi (FR-phuong-an-kinh-doanh-046). Use case kết thúc.

__3a. Bản nhận đồng bộ đang là Chưa ký và chưa có khoản mục chi phí nào có giá trị:__
- 3a1. Hệ thống chuyển các giai đoạn có tháng "Từ" thành kế hoạch chi phí theo tháng (mỗi giai đoạn tối đa 1 dòng Sản xuất + 1 dòng Kinh doanh, chia đều làm tròn nghìn).

__3b. Dự án đã Kết thúc (nhánh (f)):__
- 3b1. P-03 mở ở chế độ chỉ xem với mọi vai trò, không lưu, không đồng bộ PAKD. Use case kết thúc. (Bản điều chỉnh nháp / bị từ chối / đang chờ: xem 2a, 2e.)

__3d. Tại lúc lưu, tình trạng PAKD vừa đổi (vd PAKD vừa được gửi duyệt):__
- 3d1. Hệ thống chọn nhánh theo tình trạng tại lúc ghi (vd đi nhánh 2a thay cho 2b); lần Gửi của SM / GĐK nếu ghi sau P-03 và dựa trên Mục 1 cũ thì bị từ chối (E-phuong-an-kinh-doanh-019).

__3e. Hệ thống không ghi được trọn vẹn hợp đồng và phần đồng bộ PAKD:__
- 3e1. Không thay đổi gì, báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-phuong-an-kinh-doanh-020), P-03 giữ dữ liệu đang nhập. Use case kết thúc.

__3c. Bản điều chỉnh sinh ra không đạt kiểm tra gửi (E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010):__
- 3c1. Hệ thống vẫn lưu hợp đồng và đưa bản điều chỉnh vào "Chờ CFO" như bước 4 (không chặn, không thành bản nháp).
- 3c2. Khi Kế toán mở P-04, popup liệt kê các điểm chưa đạt theo câu của E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010 (E-phuong-an-kinh-doanh-023) để Kế toán quyết duyệt hay từ chối (FR-phuong-an-kinh-doanh-030, FR-phuong-an-kinh-doanh-041; Phase H — Q-25). Use case tiếp tục ở bước 5.

__5a. Người dùng khác đang nhập dở trên khung PAKD:__
- 5a1. Khung của người đó nạp lại theo dữ liệu mới, phần chưa lưu bị bỏ, và hiện thông báo "Dữ liệu dự án vừa thay đổi — khung PAKD đã được tải lại." (E-phuong-an-kinh-doanh-024; FR-phuong-an-kinh-doanh-003, Phase H — Q-38).

## Related Requirements

FR-phuong-an-kinh-doanh-002, FR-phuong-an-kinh-doanh-003, FR-phuong-an-kinh-doanh-037, FR-phuong-an-kinh-doanh-041, FR-phuong-an-kinh-doanh-042, FR-phuong-an-kinh-doanh-043, FR-phuong-an-kinh-doanh-046 · BR-phuong-an-kinh-doanh-016, BR-phuong-an-kinh-doanh-020, BR-phuong-an-kinh-doanh-024, BR-phuong-an-kinh-doanh-025, BR-phuong-an-kinh-doanh-032, BR-phuong-an-kinh-doanh-037, BR-phuong-an-kinh-doanh-041, BR-phuong-an-kinh-doanh-044, BR-phuong-an-kinh-doanh-046 · E-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-019, E-phuong-an-kinh-doanh-020, E-phuong-an-kinh-doanh-023, E-phuong-an-kinh-doanh-024
