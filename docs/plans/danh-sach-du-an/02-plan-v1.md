# Kế hoạch triển khai: Danh sách dự án

> Đầu vào: `01-design-brief.md` (dựng từ prototype). Template: SRS v04 Technical (`.claude/skills/executing-plans/references/TEMPLATE_SRS_04_Technical_v01.md`). Văn phong bám theo `docs/srs/SRS_MucTieuKinhDoanh.md`.
> **Phạm vi:** chỉ màn **Danh sách dự án** và 2 popup mở từ danh sách. Form cấp mã và Chi tiết dự án chỉ được nhắc ở điểm chuyển màn.

## Sản phẩm bàn giao
- SRS: `docs/srs/SRS_DanhSachDuAn.md`.
- Prototype: **đã có** (React, `src/components/BusinessProjectPage.tsx` → `ProjectList`, `ProjectTracker.tsx`, `ContractModal.tsx`). Không dựng HTML mới. Đối soát SRS ↔ prototype và ghi chỗ cần sửa vào `03-prototype-gaps.md`.

## Câu hỏi cần chốt trước Batch A
| # | Vị trí trên màn | Câu hỏi | Đề xuất |
|---|---|---|---|
| Q1 | Phạm vi tài liệu | Viết SRS chỉ cho màn Danh sách và 2 popup, còn Form cấp mã và Chi tiết dự án để SRS riêng? | Đồng ý tách |
| Q2 | Thanh tiêu đề, ô *Vai trò* (G1) | Mỗi vai trò xem được dự án của phạm vi nào? | AM: dự án mình tạo hoặc phụ trách · GĐK: khối mình · CFO / BOD: toàn công ty |
| Q3 | Cột *Thao tác* (G3) | Giữ như prototype (chỉ *Duyệt* PAKD làm ngay trên danh sách, các nút khác mở Chi tiết)? | Giữ như prototype |
| Q4 | Cột *Trạng thái HĐ* Đã ký / Chưa ký (G7) | Ai được cập nhật hợp đồng, ở những trạng thái nào? | GĐK và AM của khối, chỉ khi dự án đã có mã và chưa *Đóng* |
| Q5 | Nhóm cột *Thông tin hợp đồng đã ký* (G6) | Dự án đánh dấu đã ký nhưng chưa nhập HĐ: hiển thị số dự kiến như prototype, hay để trống kèm nhãn "Chưa nhập HĐ"? | Để trống + nhãn "Chưa nhập HĐ" |
| Q6 | Sổ theo dõi khi chọn Năm = *Tất cả* (G9) | Mục tiêu đang cộng dồn qua các năm. Giữ cách này, hay yêu cầu chọn một năm cụ thể khi xem Sổ theo dõi? | Sổ theo dõi luôn theo một năm, mặc định năm hiện tại |

## Quyết định đã chốt (Batch 0, 2026-10-02)
| # | Quyết định | Ảnh hưởng |
|---|---|---|
| D1 (Q1) | Tách riêng: SRS này chỉ gồm màn Danh sách + 2 popup. Form cấp mã và Chi tiết dự án viết SRS sau | Phạm vi |
| D2 (Q2) | AM: dự án mình phụ trách · GĐK: khối mình · CFO / BOD: toàn công ty | BR phân quyền, Sổ theo dõi |
| D3 (Q3) | Cột Thao tác như prototype: chỉ *Duyệt* PAKD làm trên danh sách, các nút khác mở Chi tiết | Ma trận 1.6 |
| D4 (Q4) | Cập nhật hợp đồng: GĐK, SM và AM của dự án, chỉ khi dự án đã có mã và không ở *Pending* / *Close* (cập nhật theo D8) | BR hợp đồng |
| D5 (Q5) | Đã ký nhưng chưa nhập HĐ: để trống các cột HĐ kèm nhãn "Chưa nhập HĐ" | BR hiển thị HĐ, mục 5 |
| D6 (Q6) | Năm = *Tất cả*: Sổ theo dõi cộng dồn mục tiêu và giá trị qua các năm (giữ như prototype) | BR Sổ theo dõi |
| D7 | Quy trình: AM / SM / GĐK tạo dự án → GĐK duyệt mã (bỏ qua nếu GĐK tạo) → GĐK hoặc SM lập PAKD → **chỉ CFO** duyệt / từ chối → Đang thực hiện. **Bỏ bước BOD duyệt**, BOD chỉ xem. GĐK = HOD | State diagram, ma trận, BR vòng đời |
| D8 | 6 trạng thái: Chờ duyệt mã, Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, **Pending**, **Close** | Enum trạng thái, bộ lọc |
| D9 | Thêm vai trò SM: xem dự án được assign hoặc tự tạo; AM cùng phạm vi | BR phân quyền, `biz_project_member` |
| D10 | AM không xem PAKD: ẩn cột Hạn lập PAKD và Phiên bản PAKD, vẫn thấy Trạng thái. SM, GĐK, CFO, BOD xem được PAKD | BR phân quyền, mục 5 |
| D11 | AM / SM / GĐK cập nhật được thông tin dự án; GĐK **và SM** lập / chỉnh sửa PAKD; CFO duyệt; BOD chỉ xem | Ma trận 1.6 |
| D12 | Sổ theo dõi: Đã ký chỉ tính theo giá trị và ngày ký của hợp đồng đã nhập; đã ký mà chưa nhập HĐ thì không cộng | BR Sổ theo dõi |
| D13 | Phiên bản PAKD: V1 khi nộp lần đầu; CFO từ chối → sửa và nộp lại **cùng phiên bản**; phiên bản mới chỉ sinh khi chỉnh sửa PAKD đã duyệt lúc dự án Đang thực hiện (chỉ CFO duyệt lại, trạng thái dự án giữ Đang thực hiện) | BR phiên bản PAKD |
| D14 | Pending: quá 30 ngày kể từ ngày cấp mã mà PAKD chưa được CFO duyệt (chưa nộp / chờ duyệt / đang sửa) → Pending; cần CFO mở lại | BR tự động, state diagram |
| D15 | Close = dự án kết thúc; CFO / Admin mở lại được (về Đang thực hiện) | BR vòng đời |
| D16 | Thêm vai trò **Admin**: xem toàn công ty, mở lại dự án Pending / Close (cùng CFO) | Bảng vai trò, ma trận |
| D17 | Pending và Close: không ai sửa được gì (thông tin dự án, PAKD, hợp đồng) cho tới khi được mở lại | BR quyền sửa theo trạng thái |
| D18 | Dữ liệu cũ: *Kết thúc* và *Đóng* đều chuyển thành Close | BR33 |
| D19 | Tác vụ Pending chạy 00:00 hằng ngày, tính theo ngày | BR8 |
| D20 | Cần email nhắc khi sắp hết hạn PAKD: còn 3 ngày, gửi GĐK và SM; email báo CFO khi có PAKD chờ duyệt đã có sẵn | BR32, AC6.5 |
| D21 | Chỉ kết thúc dự án khi PAKD điều chỉnh đã qua CFO duyệt | BR11 |
| D22 | File Excel thêm Mã KD, Mã SX, Ngày cấp mã | BR24, AC9.1 |

## Dàn ý SRS
| Mục | Nội dung | Độ phức tạp | Song song? |
|-----|----------|-------------|------------|
| Header | Tiêu đề "DANH SÁCH DỰ ÁN", Version control v01 | Thấp | |
| 1.1 | Mô tả màn: mục đích, vai trò và phạm vi dữ liệu, 3 khu vực (Sổ theo dõi, bảng danh sách, popup), điểm chuyển sang Form / Chi tiết | TB | |
| 1.2 | Flowchart: thao tác trên danh sách theo vai trò → popup hoặc chuyển màn | TB | [có thể song song] |
| 1.3 | State diagram vòng đời dự án 6 trạng thái (gồm Pending, Close) | Cao | [có thể song song] |
| 1.4 | ERD: BIZ_PROJECT, BIZ_PAKD_VERSION, BIZ_CONTRACT, BIZ_CONTRACT_ADDENDUM, BIZ_ATTACHMENT, DIVISION_SIGN_TARGET | TB | [có thể song song] |
| 1.5 | Sequence: CFO duyệt PAKD từ danh sách, và tác vụ tự động đóng dự án quá hạn | Thấp | [có thể song song] |
| 1.6 | Ma trận thao tác: Trạng thái × Vai trò → nút ở cột Thao tác | TB | |
| 2 – Epic A (Sổ theo dõi) | US1 Xem tiến độ ký HĐ so với mục tiêu theo khối / năm · US2 Đi tới hồ sơ Mục tiêu kinh doanh | TB | [có thể song song] |
| 2 – Epic B (Tra cứu) | US3 Lọc theo Năm / Khối · US4 Tìm kiếm, lọc Trạng thái / Hợp đồng kèm số đếm · US5 Xem thông tin dự án và hợp đồng trên danh sách · US6 Theo dõi hạn và phiên bản PAKD · US7 Xem dòng tổng · US8 Xuất Excel · US9 Mở chi tiết dự án | Cao | [có thể song song] |
| 2 – Epic C (Thao tác theo vai trò) | US10 Cấp mã dự án (AM / GĐK) · US11 Thao tác nhanh theo trạng thái · US12 CFO duyệt / từ chối PAKD từ danh sách | TB | [có thể song song] |
| 2 – Epic D (Hợp đồng) | US13 Cập nhật ký hợp đồng · US14 Xem tài liệu hợp đồng | TB | [có thể song song] |
| 3 | BR phân quyền và phạm vi dữ liệu (theo Q2) | TB | [có thể song song] |
| 3 | BR vòng đời và chuyển trạng thái (cấp mã, nộp / duyệt / từ chối PAKD, tự động đóng sau 30 ngày, mở lại, kết thúc) | Cao | [có thể song song] |
| 3 | BR mã dự án (Master / KD / SX) | Thấp | [có thể song song] |
| 3 | BR hiển thị Hạn lập PAKD và Phiên bản PAKD | TB | [có thể song song] |
| 3 | BR Sổ theo dõi: mục tiêu, đã ký, chưa ký, còn thiếu, % đạt, năm của dự án | TB | [có thể song song] |
| 3 | BR lọc, tìm kiếm, số đếm, dòng tổng, xuất Excel | Thấp | [có thể song song] |
| 3 | BR hợp đồng: trường bắt buộc, lý do lệch giá trị, phụ lục, quyền cập nhật (Q4, Q5) | TB | [có thể song song] |
| 4.1 | `biz_project`: các trường hiển thị và lọc trên danh sách | Cao | [có thể song song] |
| 4.2 | `biz_pakd_version` | Thấp | [có thể song song] |
| 4.3 | `biz_contract` | TB | [có thể song song] |
| 4.4 | `biz_contract_addendum` + `biz_attachment` | Thấp | [có thể song song] |
| 4.5 | `division_sign_target`: tham chiếu SRS Mục tiêu kinh doanh mục 4.5 | Thấp | |
| 5 | Interaction: màu trạng thái, nhãn KEY, "Chờ cấp mã", màu cột Hạn PAKD, nút *Duyệt* đỏ, thanh tiến độ Sổ theo dõi, số đếm trong ô lọc, popup duyệt, popup hợp đồng (lỗi tổng hợp), toast, chân bảng | TB | |

## Danh sách màn hình prototype (đối soát)
| Màn hình / thành phần | Mục đích | US liên quan | Trạng thái cần thể hiện | Có trên prototype? |
|---|---|---|---|---|
| Thanh tiêu đề (Năm, Khối, Vai trò, Cấp mã) | Lọc chung, tạo dự án | US3, US10 | vai trò AM / GĐK có nút, CFO không có | Có, **sửa** theo Q2 (bỏ ô chọn vai trò, lấy theo đăng nhập) |
| Sổ theo dõi dự án | Tiến độ ký so với mục tiêu | US1, US2 | khối chưa có mục tiêu / thiếu / vượt | Có, **sửa** nút *Đặt mục tiêu* |
| Bảng Danh sách dự án | Tra cứu | US4–US9 | rỗng "Không có dự án phù hợp" / có dữ liệu / dự án KEY / chờ cấp mã | Có |
| Cột Hạn lập PAKD | Theo dõi hạn | US6 | còn hạn / sắp hết hạn / quá hạn / làm lại / đã nộp / đã duyệt / đã đóng | Có |
| Cột Thao tác | Thao tác nhanh | US11 | theo ma trận 1.6 | Có |
| Popup Duyệt PAKD | CFO quyết định | US12 | thiếu ý kiến khi từ chối / chưa import kế hoạch | Có |
| Popup Cập nhật ký hợp đồng | Nhập HĐ | US13, US14 | lần đầu / cập nhật / lệch giá trị / lỗi | Có, **sửa** quyền theo Q4 |

## Các batch & checkpoint

### Batch 0: Chốt câu hỏi
- [x] BA trả lời Q1–Q6. DoD: mỗi gap G1–G9 được gắn nhãn *"như prototype"* / *"yêu cầu mới"* / *"ngoài phạm vi"*.
- **Checkpoint 0:** chốt phạm vi tài liệu.

### Batch A: Khung SRS + Mục 1
- [x] Tạo `docs/srs/SRS_DanhSachDuAn.md`: header, Version control v01, header mục 1–5. DoD: đúng template, không còn `[AI INSTRUCTION]`.
- [x] 1.1 Mô tả và 1.6 Ma trận thao tác. DoD: đủ vai trò, phạm vi dữ liệu, 3 khu vực trên màn, điểm chuyển màn.
- [x] 1.2–1.5 Bốn sơ đồ Mermaid. DoD: render được bằng mermaid-cli, không dùng `( )` và Markdown trong sơ đồ, khớp 6 trạng thái.
- **Checkpoint A:** BA duyệt vòng đời dự án và ma trận thao tác.

### Batch B: Mục 2 User Stories & AC + Mục 3 Business Rules
- [x] Epic A–D (US1–US15). DoD: AC đánh số, hướng nghiệp vụ, mỗi AC trỏ tới BR liên quan; gắn **[Mới]** cho yêu cầu chưa có trên prototype.
- [x] Business Rules 7 nhóm. DoD: format `BR<n> (Tên)`; công thức Sổ theo dõi khớp `ProjectTracker.tsx`; quy tắc mục tiêu khớp BR27–BR28 của SRS Mục tiêu kinh doanh.
- **Checkpoint B:** BA review độ phủ AC và BR.

### Batch C: Mục 4 Data Dictionary + Mục 5 Interaction
- [x] 4.1–4.5. DoD: `snake_case`, PK/FK, enum trạng thái, đơn vị VNĐ; khớp ERD ở mục 1 (có kiểm tra chéo bằng script).
- [x] Mục 5. DoD: đủ các hiệu ứng ở dàn ý.
- **Checkpoint C:** BA review mô hình dữ liệu.

### Batch D: Đối soát SRS ↔ prototype
- [x] Bảng truy vết AC ↔ thành phần prototype. DoD: 100% AC được truy vết (có kiểm tra bằng script).
- [x] `03-prototype-gaps.md`. DoD: mỗi gap có file / dòng code, hiện trạng, cần sửa, nguồn US / BR, ưu tiên.
- **Checkpoint D:** BA quyết định sửa prototype hay chuyển `requesting-review`.

## Rủi ro / điểm cần quyết định
- **Phụ thuộc SRS Mục tiêu kinh doanh:** Sổ theo dõi đọc `division_sign_target`. Nếu SRS kia thay đổi BR27–BR28 thì phải cập nhật SRS này.
- **Ranh giới với Chi tiết dự án:** quy trình PAKD (nộp, duyệt mã, kết thúc) chủ yếu nằm ở màn Chi tiết. SRS này chỉ mô tả phần hiện trên danh sách. Nếu Q1 chọn gộp, khối lượng tài liệu tăng khoảng gấp 2–3 lần và cần tách thêm batch.
- **Hạn làm lại PAKD (G5):** khi PAKD bị từ chối thì chưa có hạn làm lại và dự án không bao giờ tự đóng. Có thể cần BA chốt ở Checkpoint A.
