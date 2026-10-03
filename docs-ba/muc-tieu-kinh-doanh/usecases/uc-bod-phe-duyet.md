# Use Case: BOD phê duyệt hồ sơ và ghi nhận mục tiêu chính thức

> Scope: Màn Mục tiêu kinh doanh — tab "BOD phê duyệt" · Level: User goal (sea-level)

## Primary Actor

BOD (Ban giám đốc) — tài khoản vai trò BOD.

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| GĐK lập hồ sơ | Biết kết quả qua trạng thái / lịch sử khi mở lại tab GĐK (không có thông báo chủ động) |
| Người dùng Sổ theo dõi dự án | Mục tiêu khối cập nhật ngay sau khi duyệt và không bị số nhập tay đè |

## Trigger

BOD mở tab "BOD phê duyệt (n)" và bấm vào một hồ sơ (cột thao tác "Duyệt" chữ đỏ đậm với hồ sơ đang chờ).

## Preconditions

- BOD đã đăng nhập bằng tài khoản vai trò BOD.
- Có hồ sơ ở trạng thái Chờ BOD duyệt.

## Guarantees

- __Minimal Guarantee:__ Không bấm Phê duyệt, hoặc phê duyệt không ghi được trọn vẹn, thì hồ sơ (Chờ BOD duyệt), lịch sử và mục tiêu chính thức giữ nguyên (BR-muc-tieu-kinh-doanh-032).
- __Success Guarantee:__ Hồ sơ ở Đã duyệt (phiên bản giữ nguyên), lịch sử có "BOD phê duyệt — ghi nhận kế hoạch chính thức" kèm ý kiến nếu có, mục tiêu chính thức của khối trong năm kế hoạch = Σ HĐ ký mới × 1.000.000 VNĐ với nguồn "BOD duyệt" (ghi đè số nhập tay nếu có, các khối khác giữ nguyên).

## Main Success Scenario

1. BOD mở tab "BOD phê duyệt"; hệ thống hiện danh sách hồ sơ đã gửi ít nhất 1 lần của mọi khối, mọi năm, sắp: chờ duyệt lên đầu → năm giảm dần → khối A→Z.
2. BOD bấm dòng hồ sơ cần duyệt.
3. Hệ thống hiện chi tiết chỉ đọc: thông tin hồ sơ, 3 ô chỉ số (kèm "Mục tiêu chính thức — Phiên bản NN: X tr" khi hồ sơ đã có phiên bản được duyệt và đang khác Đã duyệt — chỉ giá trị HĐ ký mới) + Tổng mục tiêu khối, bảng đăng ký không có cột Xoá, khung "Ý kiến BOD — bắt buộc nếu từ chối", Lịch sử điều chỉnh.
4. BOD (tuỳ chọn) nhập ý kiến và bấm "Phê duyệt".
5. Hệ thống chuyển hồ sơ sang Đã duyệt, giữ phiên bản, lưu ý kiến đã cắt khoảng trắng (rỗng thì không lưu), ghi lịch sử "BOD phê duyệt — ghi nhận kế hoạch chính thức" với người thực hiện "<tên> (BOD)".
6. Hệ thống ghi mục tiêu chính thức của khối cho năm kế hoạch = Σ HĐ ký mới (triệu) × 1.000.000 VNĐ, nguồn "BOD duyệt", kèm phiên bản hồ sơ, vào kho mục tiêu khối dùng chung.
7. Hệ thống hiện toast "BOD đã phê duyệt mục tiêu <khối> năm <năm> — ghi nhận kế hoạch chính thức"; màn vẫn ở chi tiết hồ sơ, khung ý kiến chuyển thành "Hồ sơ đang ở trạng thái Đã duyệt — ý kiến BOD: “…”."

## Extensions

__2a. BOD mở hồ sơ không ở Chờ BOD duyệt (cột thao tác "Xem"):__
- 2a1. Khung ý kiến thay bằng dòng "Hồ sơ đang ở trạng thái <TT> — ý kiến BOD: “…”." (vế ý kiến chỉ khi có), thêm "GĐK chưa gửi duyệt." nếu Bản nháp / Đang điều chỉnh; hồ sơ Đã rút hiện "Hồ sơ đang ở trạng thái Đã rút — lý do rút: “{lý do}”. GĐK chưa gửi lại."; không có nút Phê duyệt / Từ chối.
- 2a2. BOD bấm "Quay lại danh sách".

__2b. Hồ sơ Chờ BOD duyệt thuộc năm kế hoạch đã qua:__
- 2b1. BOD vẫn phê duyệt được như bình thường (tiếp bước 3); khi phê duyệt, mục tiêu chính thức của khối được ghi cho đúng năm kế hoạch đó (FR-muc-tieu-kinh-doanh-026).

__4a. BOD đổi ý, bấm "Quay lại danh sách":__
- 4a1. Ý kiến đang nhập bị bỏ; hồ sơ không đổi.

__4b. Hồ sơ vừa được người khác cập nhật trong lúc BOD đang xem (GĐK vừa rút, BOD khác vừa quyết định):__
- 4b1. Tại lúc bấm, hệ thống kiểm lại quyền và trạng thái; hồ sơ không còn Chờ BOD duyệt → không phê duyệt, báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-muc-tieu-kinh-doanh-014), nạp lại hồ sơ theo trạng thái mới, giữ ý kiến đang nhập.
- 4b2. Use case kết thúc; mục tiêu chính thức và lịch sử theo kết quả của người cập nhật trước.

__4c. Tài khoản không còn quyền BOD tại lúc bấm:__
- 4c1. Hệ thống từ chối, báo "Bạn không có quyền thực hiện thao tác này." (E-muc-tieu-kinh-doanh-012); hồ sơ không đổi.

__5a. Hệ thống không ghi được trọn vẹn (hồ sơ, lịch sử hoặc mục tiêu chính thức):__
- 5a1. Không phần nào được ghi (BR-muc-tieu-kinh-doanh-032): hồ sơ giữ Chờ BOD duyệt, không ghi lịch sử, mục tiêu chính thức giữ nguyên; hệ thống báo "Thao tác chưa thực hiện được, vui lòng thử lại" (E-muc-tieu-kinh-doanh-010), giữ ý kiến đang nhập; lần thất bại được ghi nhận để tra soát.
- 5a2. BOD bấm lại; quay lại bước 4.

__6a. Năm đó khối đã có mục tiêu nhập tay qua P-05:__
- 6a1. Số phê duyệt ghi đè số nhập tay; từ đó Sổ theo dõi khoá nhập tay với khối này ("Theo BOD duyệt").

__6b. Hồ sơ đã có phiên bản được duyệt trước đó:__
- 6b1. Mục tiêu chính thức đổi sang số của phiên bản vừa duyệt; dòng "Mục tiêu chính thức — Phiên bản NN" không còn hiện vì hồ sơ đã ở Đã duyệt.

## Related Requirements

FR-muc-tieu-kinh-doanh-001, FR-muc-tieu-kinh-doanh-018, FR-muc-tieu-kinh-doanh-019, FR-muc-tieu-kinh-doanh-020, FR-muc-tieu-kinh-doanh-022, FR-muc-tieu-kinh-doanh-023 · BR-muc-tieu-kinh-doanh-012 – BR-muc-tieu-kinh-doanh-015, BR-muc-tieu-kinh-doanh-021, BR-muc-tieu-kinh-doanh-022, BR-muc-tieu-kinh-doanh-027, BR-muc-tieu-kinh-doanh-029, BR-muc-tieu-kinh-doanh-031, BR-muc-tieu-kinh-doanh-032 · E-muc-tieu-kinh-doanh-010, E-muc-tieu-kinh-doanh-012, E-muc-tieu-kinh-doanh-014 · FR-muc-tieu-kinh-doanh-025, FR-muc-tieu-kinh-doanh-026
