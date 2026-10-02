# Kế hoạch triển khai: Mục tiêu kinh doanh

> Đầu vào: `01-design-brief.md` (dựng từ prototype + quyết định BA ngày 2026-10-02). Template: SRS v04 Technical (`.claude/skills/executing-plans/references/TEMPLATE_SRS_04_Technical_v01.md`). Văn phong, cách đặt tên bám theo các SRS đã có trong `docs/srs/`.
> **Phạm vi:** chỉ màn Mục tiêu kinh doanh. Sổ theo dõi dự án chỉ được nhắc ở phần tích hợp (nơi nhận mục tiêu đã duyệt).

## Sản phẩm bàn giao
- SRS: `docs/srs/SRS_MucTieuKinhDoanh.md` — 1 tài liệu, 3 Epic: GĐK lập mục tiêu · BOD phê duyệt · Thông báo & ghi nhận mục tiêu chính thức.
- Prototype: **đã có** (React — `src/components/BizTargetPage.tsx`). Không dựng HTML mới; đối soát SRS ↔ prototype và ghi danh sách chỉnh prototype vào `03-prototype-gaps.md`.

## Quyết định đã chốt (Batch 0 — xong)
| # | Quyết định | Ảnh hưởng tới SRS |
|---|---|---|
| D1 | Sửa mục tiêu ở bất kỳ nguồn nào cũng phải BOD duyệt lại | BR tích hợp; giả định A3 |
| D2 | GĐK chỉ chọn được khối của mình | US1, BR phân quyền |
| D3 | LN gộp mục tiêu chỉ hiển thị trong màn này | Không ghi LN gộp sang Sổ theo dõi |
| D4 | Đang điều chỉnh → mục tiêu chính thức giữ bản đã duyệt gần nhất | BR bản hiệu lực |
| D5 | Bổ sung: GĐK rút hồ sơ · thông báo | US mới, trạng thái Đã rút, bảng thông báo |
| D6 | Không có kỳ lập / điều chỉnh: lập theo năm, tháng Ra thầu / Ký HĐ chọn trong năm kế hoạch; sửa lúc nào cũng được trừ khi *Chờ BOD duyệt* | BR quyền sửa, BR tháng trong năm |
| D7 | Xác nhận A3–A5 (bỏ A2 do D8; nút "Đặt mục tiêu" mở hồ sơ; thông báo trong hệ thống + email; chỉ màn này) | Epic C, BR thông báo, gaps |
| D8 | Gộp *Trả lại bổ sung* vào *Từ chối* — chỉ còn một trạng thái **Từ chối**, ý kiến bắt buộc | Bỏ US Trả lại bổ sung; còn 5 trạng thái |
| D9 | Phiên bản chỉ tăng khi sửa nội dung hồ sơ *Đã duyệt* / *Từ chối*; *Đã rút* sửa hoặc gửi lại và *Từ chối* gửi lại không sửa đều giữ nguyên phiên bản | BR phiên bản, state diagram |
| D10 | BOD xem được hồ sơ ở mọi trạng thái, kể cả Bản nháp (nội dung đã lưu gần nhất) — như prototype | BR2, AC10.1 |
| D11 | Rút hồ sơ bắt buộc ghi lý do | BR7, AC6.2, BR25 |
| D12 | Đang điều chỉnh: GĐK thấy phiên bản đã duyệt gần nhất là con số chính thức | AC8.4, BR11 |
| D13 | Thông báo gửi/rút đến tất cả người dùng vai trò BOD | BR25 |

Vòng đời to-be: `Bản nháp` → `Chờ BOD duyệt` → `Đã duyệt` | `Từ chối` | `Đã rút`.

## Dàn ý SRS
| Mục | Nội dung | Độ phức tạp | Song song? |
|-----|----------|-------------|------------|
| Header | Tiêu đề "MỤC TIÊU KINH DOANH CỦA KHỐI", Version control v01 | Thấp | |
| 1.1 | Mô tả: mục đích, vai trò GĐK/BOD (GĐK chỉ khối mình), ĐVT triệu VNĐ, menu, nơi nhận mục tiêu đã duyệt | TB | |
| 1.2 | Flowchart: lập → gửi → duyệt / từ chối / rút → ghi nhận chính thức | TB | [có thể song song] |
| 1.3 | State diagram 5 trạng thái + tăng phiên bản + điều kiện sửa | Cao | [có thể song song] |
| 1.4 | ERD: TARGET_PLAN, TARGET_PLAN_ROW, TARGET_PLAN_LOG, TARGET_NOTIFICATION, DIVISION_SIGN_TARGET | TB | [có thể song song] |
| 1.5 | Sequence: GĐK gửi → thông báo BOD → BOD duyệt → ghi mục tiêu chính thức → thông báo GĐK | TB | [có thể song song] |
| 2 – Epic A (GĐK) | US1 Chọn năm & nạp hồ sơ khối mình · US2 Đăng ký dòng mục tiêu · US3 Xem tổng hợp KPI / biểu đồ / chi tiết theo KH · US4 Lưu nháp · US5 Gửi BOD duyệt · **US6 Rút hồ sơ** · US7 Sửa & gửi lại hồ sơ bị từ chối / đã rút · US8 Điều chỉnh hồ sơ đã duyệt (cần BOD duyệt lại) · US9 Xem lịch sử | Cao | [có thể song song] với Epic B |
| 2 – Epic B (BOD) | US10 Danh sách hồ sơ (ưu tiên chờ duyệt) · US11 Xem chi tiết · US12 Phê duyệt · US13 Từ chối (bắt buộc ý kiến) | TB | [có thể song song] với Epic A |
| 2 – Epic C | **US14 Nhận thông báo** · US15 Ghi nhận mục tiêu chính thức khi duyệt (giữ bản cũ khi đang điều chỉnh) | TB | |
| 3 | BR quyền sửa theo trạng thái & tháng thuộc năm kế hoạch | TB | [có thể song song] |
| 3 | BR trạng thái, phiên bản, bản hiệu lực | TB | [có thể song song] |
| 3 | BR tính toán & validate (tổng, % LN gộp, ngưỡng 20%, LN ≤ HĐ, trường bắt buộc, gom theo KH / tháng ký) | TB | [có thể song song] |
| 3 | BR lịch sử & nội dung điều chỉnh | Thấp | [có thể song song] |
| 3 | BR thông báo (sự kiện → người nhận → nội dung) | TB | [có thể song song] |
| 3 | BR phân quyền & tích hợp (GĐK chỉ khối mình; quy đổi triệu → VNĐ; một nguồn mục tiêu, mọi thay đổi qua duyệt) | TB | [có thể song song] |
| 4.1 | `target_plan` (enum 5 trạng thái, `version`, `effective_version`) | TB | [có thể song song] |
| 4.2 | `target_plan_row` | TB | [có thể song song] |
| 4.3 | `target_plan_log` | Thấp | [có thể song song] |
| 4.4 | `target_notification` | Thấp | [có thể song song] |
| 4.5 | `division_sign_target` (mục tiêu chính thức theo khối/năm) | Thấp | [có thể song song] |
| 5 | Interaction: badge số hồ sơ chờ duyệt, ô chọn tháng trong năm kế hoạch, định dạng số, % LN tự tính, tooltip biểu đồ, nút mờ kèm lý do khoá, toast, lỗi validate, xác nhận khi Rút hồ sơ, chỉ báo thông báo | TB | |

## Danh sách màn hình prototype (đối soát)
| Màn hình / thành phần | Mục đích | US liên quan | Trạng thái cần thể hiện | Có trên prototype? |
|----------|----------|--------------|--------------------------|------------|
| Tab GĐK – lọc Năm | Chọn hồ sơ theo năm | US1 | năm có / chưa có hồ sơ | Có — **sửa**: khoá ô Khối theo người dùng; **bỏ** nhãn kỳ và chế độ thử |
| Tab GĐK – thông tin hồ sơ | Khối, người lập, năm, trạng thái-phiên bản | US1, US7 | 5 trạng thái; ý kiến BOD khi từ chối | Một phần — **thêm** trạng thái Đã rút |
| Tab GĐK – tổng hợp | KPI + biểu đồ + bảng theo KH | US3 | rỗng / có dữ liệu / % ≥ 20% | Có |
| Tab GĐK – bảng đăng ký + nút | Nhập dòng, lưu, gửi, rút | US2, US4–US8 | rỗng / sửa / khoá / lỗi | Một phần — **thêm** nút Rút hồ sơ; bỏ khoá kỳ; ô tháng chỉ chọn tháng của năm kế hoạch |
| Lịch sử điều chỉnh | Truy vết | US9 | tạo / có thay đổi / có ý kiến | Có |
| Tab BOD – danh sách | Chọn hồ sơ | US10 | có / không có hồ sơ chờ | Có |
| Tab BOD – chi tiết + ý kiến | Duyệt / từ chối | US11–US13 | chờ duyệt / đã xử lý / thiếu ý kiến | Có |
| Thông báo | Báo sự kiện | US14 | chưa đọc / đã đọc | **Chưa có** |

## Các batch & checkpoint

### Batch A — Khung SRS + Mục 1 Business Flow
- [x] Tạo `docs/srs/SRS_MucTieuKinhDoanh.md`: header, Version control v01, header mục 1–5 — DoD: đúng template, không còn `[AI INSTRUCTION]`.
- [x] 1.1 Mô tả phân hệ — DoD: nêu đủ vai trò, phân quyền khối, đơn vị, nơi nhận mục tiêu đã duyệt.
- [x] 1.2–1.5 Bốn sơ đồ Mermaid [có thể song song] — DoD: render được, không dùng `( )` và Markdown trong sơ đồ, thể hiện đủ 5 trạng thái và D1–D8.
- **Checkpoint A:** BA duyệt luồng và vòng đời hồ sơ.

### Batch B — Mục 2 User Stories & AC + Mục 3 Business Rules
- [x] Epic A (US1–US9) [có thể song song] — DoD: Role / Hành động / Mục đích; AC đánh số AC<n>.<m>; AC hướng nghiệp vụ.
- [x] Epic B (US10–US13) [có thể song song] — DoD: như trên; ý kiến bắt buộc khi từ chối.
- [x] Epic C (US14–US15) — DoD: bảng sự kiện → người nhận; quy tắc giữ bản cũ khi đang điều chỉnh.
- [x] Business Rules 6 nhóm [có thể song song] — DoD: format `BR<n> (Tên)`; ghi rõ BR nào là yêu cầu mới (chưa có trên prototype).
- **Checkpoint B:** BA review độ phủ AC và BR.

### Batch C — Mục 4 Data Dictionary + Mục 5 Interaction
- [x] 4.1–4.5 bảng dữ liệu [có thể song song] — DoD: `snake_case`, PK/FK, loại data, bắt buộc, mô tả, đơn vị tiền, enum trạng thái.
- [x] Mục 5 Interaction Details — DoD: đủ các hiệu ứng ở dàn ý.
- **Checkpoint C:** BA review mô hình dữ liệu.

### Batch D — Đối soát SRS ↔ prototype
- [x] Bảng truy vết US/AC ↔ thành phần prototype — DoD: mọi AC có thành phần tương ứng hoặc gắn "chưa có trên prototype".
- [x] `03-prototype-gaps.md` — DoD: mỗi mục ghi thành phần cần sửa + US/BR nguồn (khoá ô Khối, nút Rút, trạng thái Đã rút, thông báo, bỏ khoá kỳ, giới hạn tháng trong năm, nút "Đặt mục tiêu" ở Sổ theo dõi).
- **Checkpoint D:** BA quyết định có sửa prototype trước khi review không → chuyển `requesting-review`.

## Rủi ro / điểm cần quyết định
- **Thông báo (D5)** là chức năng mới hoàn toàn. Kênh gửi (trong hệ thống / email) ảnh hưởng tới bảng 4.4.
- **Nút "Đặt mục tiêu" ở Sổ theo dõi (A3)** thuộc màn khác. SRS này chỉ ghi quy tắc; việc sửa màn đó được ghi ở `03-prototype-gaps.md`.
