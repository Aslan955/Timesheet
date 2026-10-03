# Use Case: Điều chỉnh PAKD đã duyệt

> Scope: MH-02c — khung PAKD ở chế độ điều chỉnh + nút trên đầu trang · Level: user goal

## Primary Actor

SM hoặc GĐK.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| SM / GĐK | Cập nhật PAKD khi đã ký hợp đồng / thay đổi chi phí |
| Kế toán (CFO) | Duyệt lại trước khi số liệu dự án thay đổi |

## Trigger

SM / GĐK bấm **Sửa PAKD** ở góc khung, hoặc **Sửa PAKD** / **Tiếp tục sửa PAKD** trên dòng thông báo bước hiện tại.

## Preconditions

- Dự án "Đang thực hiện".
- Người dùng vai trò SM hoặc GĐK.
- Không có bản điều chỉnh đang "Chờ CFO".

## Guarantees

- __Minimal Guarantee:__ số liệu dự án và PAKD đang áp dụng không đổi cho tới khi Kế toán duyệt.
- __Success Guarantee:__ (Gửi) bản điều chỉnh lưu, phiên bản điều chỉnh "Chờ CFO" số V{n} = số bản đã duyệt + 1, bản chụp lúc nộp được lưu, dự án vẫn "Đang thực hiện", lịch sử "Gửi điều chỉnh PAKD".

## Main Success Scenario

1. SM / GĐK bấm Sửa PAKD; hệ thống thoát chế độ sửa thông tin cơ bản (nếu có), về tab "Thông tin dự án", cuộn tới khung, mở chế độ điều chỉnh.
2. Khung đổi tiêu đề "Phương án kinh doanh (PAKD) — điều chỉnh", dải xanh "Đang sửa PAKD…", nhãn "Đang điều chỉnh"; đầu trang hiện **Huỷ sửa** · **Lưu nháp** · **Gửi Kế toán duyệt điều chỉnh**.
3. Người dùng sửa nội dung (vd đổi Chưa ký → Đã ký, nhập thông tin HĐ, mốc nghiệm thu, chi phí theo tháng).
4. Người dùng bấm **Gửi Kế toán duyệt điều chỉnh**; hệ thống kiểm tra theo tình trạng — hợp lệ.
5. Hệ thống lưu bản điều chỉnh, thêm phiên bản "Chờ CFO" đánh dấu điều chỉnh, lưu bản chụp lúc nộp, ghi lịch sử "Gửi điều chỉnh PAKD", thoát chế độ sửa.
6. Hệ thống hiện toast "Đã gửi bản điều chỉnh PAKD V{n} — chờ Kế toán (CFO) duyệt lại"; khung hiển thị bản điều chỉnh chỉ xem, nhãn "Chờ duyệt V{n}", dải vàng.

## Extensions

__3a. PAKD đang áp dụng là Đã ký, hoặc dự án đã được đánh dấu "đã ký":__
- 3a1. Không chọn lại được "Chưa ký" (BR-phuong-an-kinh-doanh-021; Phase H — Q-26).

__4a. Người dùng bấm Lưu nháp:__
- 4a1. Hệ thống lưu bản điều chỉnh không kiểm tra, ghi lịch sử "Lưu nháp điều chỉnh PAKD", toast "Đã lưu nháp bản điều chỉnh PAKD"; chế độ sửa vẫn mở; nút huỷ đổi thành "Huỷ bản điều chỉnh"; dòng thông báo "Có bản điều chỉnh PAKD đang soạn…". Quay lại bước 3.

__4b. Nội dung không hợp lệ:__
- 4b1. Dải đỏ lỗi (E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010), không gửi. Quay lại bước 3.

__4c. Người dùng bấm Huỷ sửa (chưa có bản điều chỉnh lưu):__
- 4c1. Thoát sửa, nạp lại PAKD đang áp dụng, không lịch sử / toast. Use case kết thúc.

__4d. Người dùng bấm Huỷ bản điều chỉnh (đã có bản nháp hoặc bản bị từ chối):__
- 4d1. Hệ thống bỏ bản điều chỉnh khỏi dự án (nội dung vẫn được lưu lại, chưa có màn xem — Phase H Q-29), giữ bản đang áp dụng, ghi lịch sử "Huỷ bản điều chỉnh PAKD", toast "Đã huỷ bản điều chỉnh PAKD".
- 4d2. Nếu bản điều chỉnh đã bị từ chối: danh sách / meta hiện bản đang áp dụng ("V{n}, đã duyệt"), cột Hạn lập hiện "Duyệt" + ngày duyệt của bản đó. Use case kết thúc.

__1a. Bản điều chỉnh trước bị Kế toán từ chối:__
- 1a1. Khung mở bản điều chỉnh với dải đỏ "Bản điều chỉnh V{n} bị Kế toán từ chối: {ý kiến}…", nhãn "Điều chỉnh bị từ chối"; gửi lại giữ số V{n}.

__1b. Có bản điều chỉnh "Chờ CFO" (kể cả bản sinh khi lưu P-03):__
- 1b1. Không có nút Sửa PAKD; dòng thông báo "Đang chờ Kế toán (CFO) duyệt bản điều chỉnh PAKD V{n}." Use case kết thúc.

__1c. Người dùng không phải SM / GĐK, hoặc là SM / GĐK của khối khác (Phase H — Q-19):__
- 1c1. Chỉ xem, chân khung "PAKD đã được duyệt — chỉ Giám đốc khối / Giám đốc kinh doanh (SM) được sửa PAKD."; thao tác ghi bị từ chối (E-phuong-an-kinh-doanh-018). Use case kết thúc.

__\*a. Lưu P-03 trong lúc có bản điều chỉnh nháp / bị từ chối:__
- \*a1. Hệ thống cập nhật Mục 1 và kỳ thực hiện của chính bản điều chỉnh đó theo hợp đồng, giữ phần SM / GĐK đang soạn ở các mục khác, không sinh bản thứ hai; khung tự nạp lại (FR-phuong-an-kinh-doanh-046); nếu do người khác lưu P-03 thì người đang sửa thấy E-phuong-an-kinh-doanh-024 và phần chưa lưu bị bỏ (FR-phuong-an-kinh-doanh-003).

__\*b. Dự án được kết thúc khi còn bản điều chỉnh nháp / bị từ chối:__
- \*b1. Hộp xác nhận Kết thúc dự án báo trước "Dự án còn bản điều chỉnh PAKD chưa gửi — bản này sẽ bị huỷ."; người kết thúc xác nhận thì bản điều chỉnh tự huỷ (nội dung được lưu lại), ghi lịch sử "Huỷ bản điều chỉnh PAKD (Kết thúc dự án)" (FR-phuong-an-kinh-doanh-047; Phase H — Q-23, Q-29). Use case kết thúc.

__\*c. Tại lúc Lưu nháp / Gửi / Huỷ, bản điều chỉnh vừa được người khác gửi hoặc huỷ, hoặc dự án vừa Kết thúc:__
- \*c1. Không ghi (không ghi đè bản đã gửi), báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-phuong-an-kinh-doanh-019) và tự nạp lại dự án; khung hiện dữ liệu mới, phần chưa lưu bị bỏ (Phase H — Q-21).

__\*d. Hệ thống không ghi được trọn vẹn:__
- \*d1. Không ghi, giữ nội dung đang nhập, báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-phuong-an-kinh-doanh-020); bấm lại được.

## Related Requirements

FR-phuong-an-kinh-doanh-012, FR-phuong-an-kinh-doanh-020, FR-phuong-an-kinh-doanh-022, FR-phuong-an-kinh-doanh-024…FR-phuong-an-kinh-doanh-028, FR-phuong-an-kinh-doanh-038, FR-phuong-an-kinh-doanh-046, FR-phuong-an-kinh-doanh-047 · BR-phuong-an-kinh-doanh-003, BR-phuong-an-kinh-doanh-021, BR-phuong-an-kinh-doanh-024, BR-phuong-an-kinh-doanh-025, BR-phuong-an-kinh-doanh-037, BR-phuong-an-kinh-doanh-042, BR-phuong-an-kinh-doanh-044, BR-phuong-an-kinh-doanh-047 · E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010, E-phuong-an-kinh-doanh-012…E-phuong-an-kinh-doanh-014, E-phuong-an-kinh-doanh-017…E-phuong-an-kinh-doanh-021, E-phuong-an-kinh-doanh-024
