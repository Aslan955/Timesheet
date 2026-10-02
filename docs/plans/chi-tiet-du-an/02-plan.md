# Kế hoạch triển khai: Chi tiết dự án + Form cấp mã (kèm Lập PAKD)

> Đầu vào: `01-design-brief.md`. Template: SRS v04 Technical. Văn phong và cách đặt tên bám theo `docs/srs/SRS_DanhSachDuAn.md`.
> Prototype đã có sẵn (React). Không dựng HTML mới. Batch cuối đối soát SRS với prototype và lập danh sách việc cho dev.

## Sản phẩm bàn giao
- `docs/srs/SRS_ChiTietDuAn.md`: Form cấp mã / sửa dự án, Chi tiết dự án, ngăn Quy trình, thanh thao tác, mã outsource, hợp đồng và tài liệu, lịch sử, kết thúc / mở lại.
- `docs/srs/SRS_LapPAKD.md`: form PAKD (2 biến thể), bảng điều khiển, kiểm tra khi gửi, kế hoạch tháng sinh từ PAKD, CFO duyệt, phiên bản, điều chỉnh PAKD, đồng bộ số liệu.
- `03-prototype-gaps.md` và `04-dev-tasks.md`.

## Câu hỏi cần chốt trước Batch A
| # | Vị trí trên màn | Câu hỏi | Đề xuất |
|---|---|---|---|
| Q1 | Phạm vi tài liệu | Tách 2 SRS (Chi tiết dự án; Lập PAKD) hay gộp 1? | Tách 2. Form PAKD đủ lớn để thành tài liệu riêng (khoảng 40 trường, 3 bảng nhập, 9 kiểm tra, công thức dòng tiền) |
| Q2 | Thanh tiêu đề Chi tiết, nút **Sửa** / **Xoá** | Ai được sửa thông tin dự án, ai được xoá dự án, ở trạng thái nào? | Sửa: AM / SM / GĐK của dự án, không ở Pending / Close. Xoá: chỉ khi *Chờ duyệt mã*, bởi người tạo hoặc GĐK |
| Q3 | Ngăn Quy trình bước 5, nút **Kết thúc dự án** | Ai được kết thúc dự án? | GĐK của khối. Chặn khi còn PAKD điều chỉnh chờ CFO (D21) |
| Q4 | Tab Thông tin dự án (khu *Số liệu theo tháng* đã bị bỏ) | Có cần xem kế hoạch / thực tế theo tháng của dự án ở màn Chi tiết không? | Không. Kế hoạch xem trong form PAKD; thực tế xem ở Báo cáo hiệu quả dự án |
| Q5 | Khu Mã dự án, nút **Tạo mã outsource** / xoá mã | Ai được tạo, xoá mã outsource và đổi PM? Xoá được khi nào? | GĐK của khối. Không ở Pending / Close |
| Q6 | Form cấp mã, nút **+ Mới** (thêm khách hàng) | Ai được thêm khách hàng mới ngay trên form? | AM, SM, GĐK. Bắt buộc mã KH + tên, mã không trùng |

## Quyết định đã chốt (Batch 0, 2026-10-02)
| # | Quyết định | Ảnh hưởng |
|---|---|---|
| C1 (Q1) | Tách 2 SRS: `SRS_ChiTietDuAn.md` và `SRS_LapPAKD.md` | Phạm vi |
| C2 (Q2) | Sửa thông tin dự án: AM / SM / GĐK của dự án, không ở Pending / Close. Xoá: chỉ khi *Chờ duyệt mã*, do người tạo hoặc GĐK | BR quyền |
| C3 (Q2) | ~~Sửa PAKD chỉ GĐK~~ → **thay bằng C21** | — |
| C4 (Q3) | Kết thúc dự án: GĐK của khối, chặn khi còn PAKD điều chỉnh chờ CFO | BR kết thúc |
| C5 (Q4) | Không hiển thị số liệu theo tháng ở Chi tiết. Kế hoạch xem trong PAKD, thực tế xem ở Báo cáo hiệu quả dự án | Phạm vi |
| C6 (Q5) | Mã outsource (tạo / xoá / đổi PM): GĐK và Admin, dự án không ở Pending / Close | BR mã outsource |
| C7 (Q6) | Thêm khách hàng mới ngay tại màn Tạo dự án nếu chưa có trong hệ thống: AM, SM, GĐK; bắt buộc mã + tên, mã không trùng | BR khách hàng |
| C8 | Khối và khách hàng **vẫn đổi được** sau khi cấp mã | BR8 |
| C9 | Mã outsource sinh từ **mã sản xuất**: Mã SX.1 … Mã SX.5, **tối đa 5**, không dùng lại số đã dùng | BR11; đã đồng bộ SRS Danh sách v03 |
| C10 | Xoá dự án = xoá mềm | BR15 |
| C11 | Tài liệu đính kèm: AM / SM / GĐK của dự án, không Pending / Close | BR16 |
| C12 | Người phụ trách chọn từ danh mục nhân sự của hệ thống | BR17 |
| C13 | Tạo mã outsource giống tạo mã dự án: GĐK tạo thì có hiệu lực ngay; Admin tạo thì chờ **GĐK duyệt**; có hiệu lực thì version dự án +1; từ chối bắt buộc lý do | BR9, BR12 |
| C14 | Thêm thao tác GĐK **từ chối** yêu cầu mở mã, lý do bắt buộc, xoá mềm, báo người tạo | BR5, AC9.4 |
| C15 | Đổi khối / khách hàng sau khi cấp mã: **giữ nguyên mã**, ghi lịch sử giá trị cũ → mới | BR8 |
| C16 | GĐK được huỷ bản điều chỉnh PAKD chưa gửi | SRS_LapPAKD BR21 |
| C17 | Thêm kiểm tra Từ / Đến của giai đoạn có tổng mức đầu tư (Chưa ký) | SRS_LapPAKD BR17 |
| C18 | Hợp đồng tạo từ PAKD Đã ký (dự án chưa có HĐ) phải **chờ CFO duyệt** như PAKD | SRS_LapPAKD BR22; có thể ảnh hưởng SRS_DanhSachDuAn BR26–BR31 |
| C19 | Nhắc cập nhật hợp đồng: đợt này chỉ hiển thị, không gửi tự động | SRS_LapPAKD BR23 |
| C20 | **Mọi hợp đồng** (popup, sửa, tạo từ PAKD) phải được CFO duyệt mới có hiệu lực | SRS_DanhSachDuAn v04 BR31, BR35; SRS_ChiTietDuAn BR9, BR19 |
| C21 | (Rà soát 8cff07a) **GĐK và SM** đều được sửa PAKD sau khi bị từ chối và điều chỉnh PAKD đã duyệt | PAKD v02 BR2, BR21; CT v02; DS v05 |
| C22 | Bỏ ngăn Quy trình; tiến trình xem qua thanh thao tác và tab Lịch sử | CT v02 US8, BR20 |
| C23 | Sửa dự án là **màn hình riêng** (không phải popup), 2 tab Thông tin cơ bản / PAKD; khu Mã dự án luôn hiển thị; PM outsource; Update PM | CT v02 BR21, BR22 |
| C24 | Mọi hợp đồng tạo mới / cập nhật đều phải CFO duyệt; HĐ được duyệt thì điền vào bản điều chỉnh PAKD, không ghi thẳng vào PAKD đã duyệt | PAKD v02 BR22; DS v05 BR35 |
| C25 | Chấp nhận: popup Thêm khách hàng (mã 3 ký tự, thêm trường), kế hoạch chi phí theo tháng, tự điền khi chuyển Đã ký, biểu đồ cột | CT v02 BR7; PAKD v02 BR5, BR6, BR24 |
| C26 | Dự án Pending: phải mở lại xong CFO mới được duyệt PAKD (giữ SRS, báo dev sửa) | DS BR6, BR10; CT BR19; gap C14 |

## Dàn ý SRS_ChiTietDuAn
| Mục | Nội dung | Độ phức tạp |
|---|---|---|
| 1 | Mô tả; bố cục màn; vai trò × thao tác; sơ đồ: luồng tạo / duyệt mã / kết thúc / mở lại, trạng thái (tham chiếu SRS Danh sách), quan hệ dữ liệu, trình tự | TB |
| 2 – Epic A, Form cấp mã | Tạo yêu cầu mở mã (AM / SM); GĐK tạo và cấp mã ngay; thêm khách hàng mới; đính kèm tài liệu lúc tạo; sửa thông tin dự án (version) | TB |
| 2 – Epic B, Chi tiết | Xem thông tin; thanh thao tác bước hiện tại; ngăn Quy trình; duyệt mã; mã outsource; hợp đồng và tài liệu; lịch sử; kết thúc; mở lại; xoá | Cao |
| 3 | BR: quyền theo vai trò × trạng thái; version dự án; mã outsource; khách hàng; kết thúc / mở lại; khoá Pending / Close; lịch sử | TB |
| 4 | Data Dictionary: các trường của `biz_project` thuộc form (bổ sung cho SRS Danh sách), `biz_customer`, `biz_project_history`, `biz_attachment` (dự án) | TB |
| 5 | Interaction: form nhập tại chỗ, nút KEY, hộp hướng dẫn, hộp lỗi tổng hợp, thanh thao tác vàng, ngăn Quy trình (mở / ẩn / kéo độ rộng / nhớ), xác nhận kết thúc / xoá | TB |

## Dàn ý SRS_LapPAKD
| Mục | Nội dung | Độ phức tạp |
|---|---|---|
| 1 | Mô tả; vòng đời PAKD (Đang soạn → Chờ CFO → Đã duyệt / Từ chối; điều chỉnh → phiên bản mới); sơ đồ luồng, trạng thái phiên bản, quan hệ dữ liệu, trình tự gửi → CFO duyệt → đồng bộ số liệu | Cao |
| 2 | Lập PAKD (Đã ký / Chưa ký); lưu nháp; gửi duyệt; xem bảng điều khiển; CFO duyệt / từ chối; sửa sau khi bị từ chối; điều chỉnh PAKD đã duyệt; xem phiên bản | Cao |
| 3 | BR: quyền (GĐK / SM; AM không xem); trường bắt buộc và 9 kiểm tra; công thức (giá trị mốc, giá trị thu, tháng thu tiền, doanh thu, chi phí theo nhóm, lợi nhuận, biên LN, luỹ kế dòng tiền, chia đều giai đoạn); ngưỡng 20% và 2%; phiên bản; đồng bộ khi CFO duyệt (BR34 Danh sách) | Cao |
| 4 | Data Dictionary: `biz_pakd_form` theo phiên bản, `biz_pakd_milestone`, `biz_pakd_cost`, `biz_pakd_phase`, `biz_month_plan` | TB |
| 5 | Interaction: ô tiền / % / tháng, đổi biến thể, thêm / xoá dòng, dòng TỔNG (đỏ khi tổng % ≠ 100), biểu đồ có tooltip, nhãn Đạt / Dưới khung, hộp lỗi "Chưa gửi được — cần bổ sung" | TB |

## Các batch và checkpoint
### Batch 0: Chốt câu hỏi
- [x] BA trả lời Q1–Q6.
- **Checkpoint 0:** chốt phạm vi và quyền.

### Batch A: SRS_ChiTietDuAn mục 1–3
- [x] Mục 1 + 4 sơ đồ. DoD: render được, khớp D1–D29.
- [x] Mục 2 (Epic A–B) + mục 3. DoD: AC đánh số, BR trỏ chéo; nhãn **[Mới]** cho chỗ khác prototype.
- **Checkpoint A.**

### Batch B: SRS_ChiTietDuAn mục 4–5
- [x] Data Dictionary, kiểm tra chéo với ERD bằng script. Mục 5.
- **Checkpoint B.**

### Batch C: SRS_LapPAKD mục 1–3
- [x] Sơ đồ, User Story / AC, BR công thức. DoD: công thức khớp `pakd.ts`; ví dụ số cho mỗi công thức.
- **Checkpoint C.**

### Batch D: SRS_LapPAKD mục 4–5
- [x] Data Dictionary 7 bảng (kiểm tra chéo ERD) + mục 5.
- **Checkpoint D.**

### Batch E: Đối soát và việc cho dev
- [x] `03-prototype-gaps.md` (truy vết 100% AC của cả 2 SRS), `04-dev-tasks.md`.
- **Checkpoint E:** chuyển sang `requesting-review`.

## Rủi ro
- **Prototype thay đổi nhanh:** commit `d8a9358` sửa lớn ở màn này. Mỗi lần dev push mới cần đối soát lại.
- **SRS Danh sách dự án phải đồng bộ:** BR6, BR7, BR34 bên đó nói về PAKD. Khi có SRS Lập PAKD, cần đổi các BR này thành tham chiếu sang SRS mới để không trùng nội dung.
- **Chưa có danh mục nhân sự và khách hàng:** danh sách người và khách hàng hiện lấy từ dữ liệu dự án. SRS sẽ ghi là dùng danh mục hệ thống, kèm giả định.
