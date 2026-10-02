# Đối soát SRS ↔ Prototype: Mục tiêu kinh doanh

- **SRS:** `docs/srs/SRS_MucTieuKinhDoanh.md` (v01, 2026-10-02)
- **Prototype:** `src/components/BizTargetPage.tsx` (ký hiệu **BTP** trong bảng), `src/components/ProjectTracker.tsx` (**PT**), `src/components/Header.tsx`
- **Ký hiệu trạng thái:** ✅ Có, đúng SRS · ⚠️ Có nhưng lệch SRS · ❌ Chưa có

## 1. Bảng truy vết AC ↔ prototype

### Epic A — GĐK lập mục tiêu
| AC | Thành phần prototype | Trạng thái | Gap |
|---|---|---|---|
| AC1.1 Chỉ khối của mình | Ô chọn Khối (BTP:723), người dùng gán cứng `CURRENT_USER` (BTP:25) | ⚠️ | GAP-01 |
| AC1.2 Chọn năm kế hoạch | Ô *Năm kế hoạch*, năm hiện tại + năm kế tiếp, mặc định theo quý 4 (`GdkTab`) | ✅ | |
| AC1.3 Mở / tạo hồ sơ Khối – Năm | Nạp hồ sơ theo khoá Khối-Năm (BTP:685), `blank()` | ✅ | |
| AC1.4 Thông tin chung hồ sơ | `PlanHeader` | ✅ | |
| AC1.5 Chờ duyệt chỉ xem, có lý do | Dòng cảnh báo vàng, `lockReason` | ✅ | |
| AC1.6 Xem ý kiến BOD khi bị từ chối | Hộp đỏ (BTP:754) | ✅ | |
| AC2.1 Thêm nhiều dòng đủ trường | `RowsTable`, nút *Thêm dòng* | ✅ | |
| AC2.2 Gợi ý khách hàng, vẫn nhập mới | `datalist target-customers` | ✅ | |
| AC2.3 Tháng thuộc năm kế hoạch | `MonthInput` (BTP:446) cho gõ tháng của năm bất kỳ | ⚠️ | GAP-07 |
| AC2.4 Tự tính % LN gộp | Cột % chỉ đọc | ✅ | |
| AC2.5 Sửa / xoá khi không chờ duyệt | `editable`, nhưng còn phụ thuộc kỳ lập (`windowFor`) | ⚠️ | GAP-02 |
| AC3.1 3 chỉ số tổng | `KpiBox` × 3 trong `PlanSummary` | ✅ | |
| AC3.2 Nổi bật khi ≥ 20% | `tone='good'` | ✅ | |
| AC3.3 Theo KH / theo tháng ký HĐ | `Segmented` + `TargetChart` | ✅ | |
| AC3.4 Bảng chi tiết theo KH + tổng khối | Bảng *Chi tiết mục tiêu theo khách hàng* | ✅ | |
| AC3.5 Cập nhật ngay khi sửa | `PlanSummary rows={draft.rows}` | ✅ | |
| AC4.1 Lưu nháp không kiểm tra | `save(false)` bỏ qua `validate` | ✅ | |
| AC4.2 Chỉ ghi khi có thay đổi | Nút *Lưu nháp* mờ khi `!dirty` | ✅ | |
| AC4.3 Ghi lịch sử + nội dung thay đổi | `diffRows`, `TargetLog.changes` | ✅ | |
| AC4.4 Không đổi mục tiêu chính thức | Chỉ `decide` ghi mục tiêu, nhưng nội dung bản đã duyệt bị ghi đè (xem GAP-05) | ⚠️ | GAP-05 |
| AC5.1 Điều kiện gửi | `validate` (BTP:699), chưa kiểm tra tháng thuộc năm | ⚠️ | GAP-07 |
| AC5.2 Chỉ rõ dòng lỗi | "Dòng N: …" | ✅ | |
| AC5.3 Chờ duyệt và khoá | `status = 'Chờ BOD duyệt'`, `waiting` | ✅ | |
| AC5.4 Ghi lịch sử + báo BOD | Có lịch sử, chưa có thông báo | ⚠️ | GAP-08 |
| AC6.1–AC6.4 Rút hồ sơ | Không có | ❌ | GAP-03, GAP-09 |
| AC7.1 Sửa / gửi lại bất kỳ lúc nào | Còn phụ thuộc kỳ | ⚠️ | GAP-02 |
| AC7.2 Từ chối: sửa mới tăng phiên bản | `bump` (BTP:154) tăng phiên bản cả khi không sửa | ⚠️ | GAP-04 |
| AC7.3 Đã rút: giữ phiên bản | Chưa có trạng thái Đã rút | ❌ | GAP-03, GAP-04 |
| AC7.4 Vẫn thấy ý kiến BOD khi sửa | Hộp đỏ chỉ hiện khi `status === 'Từ chối'` (BTP:754), mất ngay sau lần lưu nháp đầu | ⚠️ | GAP-10 |
| AC8.1 Điều chỉnh bản đã duyệt bất kỳ lúc nào | Còn phụ thuộc kỳ | ⚠️ | GAP-02 |
| AC8.2 Sửa nội dung → phiên bản mới | `bump` không so nội dung | ⚠️ | GAP-04 |
| AC8.3 Giữ bản đã duyệt đến khi duyệt bản mới | Giá trị ở Sổ theo dõi được giữ, nhưng nội dung dòng của bản đã duyệt bị ghi đè | ⚠️ | GAP-05 |
| AC8.4 Thấy bản đã duyệt gần nhất là con số chính thức | Không có | ❌ | GAP-06 |
| AC9.1–AC9.3 Lịch sử | `HistoryPanel`, mới nhất trên cùng, chỉ đọc. Thiếu thao tác *Rút hồ sơ* | ⚠️ | GAP-09 |

### Epic B — BOD phê duyệt
| AC | Thành phần prototype | Trạng thái | Gap |
|---|---|---|---|
| AC10.1 Mọi khối, mọi trạng thái kể cả nháp | Danh sách `BodTab` lấy toàn bộ `plans` | ✅ | |
| AC10.2 Cột thông tin | 9 cột + cột *Duyệt / Xem* | ✅ | |
| AC10.3 Ưu tiên chờ duyệt, đếm số chờ | Sắp xếp `list`, badge tab | ✅ | |
| AC11.1–AC11.3 Xem chi tiết, chỉ đọc, lịch sử | `PlanHeader` + `PlanSummary` + `RowsTable` chỉ đọc + `HistoryPanel` | ✅ | |
| AC11.4 Trạng thái khác: xem ý kiến / lý do rút | Có ý kiến BOD, chưa có lý do rút | ⚠️ | GAP-09 |
| AC12.1 / AC13.1 Chỉ quyết định khi chờ duyệt | Ẩn nút theo `canDecide`, nhưng `decide` (BTP:169) không kiểm tra lại trạng thái | ⚠️ | GAP-11 |
| AC12.2 Ý kiến tuỳ chọn khi duyệt | `act(true)` | ✅ | |
| AC12.3 Đã duyệt → mục tiêu chính thức | `setYearTargets` trong `decide` | ✅ | |
| AC12.4 / AC13.4 Ghi lịch sử + báo GĐK | Có lịch sử, chưa có thông báo | ⚠️ | GAP-08 |
| AC13.2 Bắt buộc ý kiến khi từ chối | `act` (BTP:854) | ✅ | |
| AC13.3 Từ chối giữ mục tiêu cũ | `decide` không ghi khi từ chối | ✅ | |

### Epic C — Thông báo và ghi nhận
| AC | Thành phần prototype | Trạng thái | Gap |
|---|---|---|---|
| AC14.1–AC14.4 Thông báo | Biểu tượng chuông tĩnh ở `Header.tsx`, không có dữ liệu | ❌ | GAP-08 |
| AC15.1 Ghi tổng HĐ sang Sổ theo dõi | `decide` → `setYearTargets` (× 1.000.000) | ✅ | |
| AC15.2 Chỉ đổi khi duyệt | Đúng ở màn này, nhưng nút *Đặt mục tiêu* của PT ghi đè trực tiếp | ⚠️ | GAP-12 |
| AC15.3 Chưa duyệt thì chưa có mục tiêu | Có dữ liệu mẫu `SEED_TARGETS` năm 2026 không qua duyệt | ⚠️ | GAP-12 |
| AC15.4 Chỉ đổi qua hồ sơ | `TargetModal` của PT (PT:171, 214, 225) | ❌ | GAP-12 |
| AC15.5 Không ghi LN gộp | Chỉ ghi giá trị HĐ | ✅ | |

**Tổng hợp 63 AC (đã truy vết đủ 100%):** 30 ✅ (48%) · 22 ⚠️ (35%) · 11 ❌ (17%).

## 2. Danh sách chỉnh sửa prototype

| ID | Ưu tiên | Thành phần cần sửa | Hiện trạng | Cần sửa thành | Nguồn SRS |
|---|---|---|---|---|---|
| GAP-01 | Cao | BTP `GdkTab` ô Khối (dòng 723), `CURRENT_USER` (dòng 25), `PlanHeader` | GĐK chọn được mọi khối. Người lập ghi dạng "GĐK G1". | Khối lấy theo người dùng đăng nhập, hiển thị dạng chữ. Thêm cách đổi vai trò / người dùng để demo (GĐK G1, GĐK G2, BOD). | BR1, AC1.1, mục 5 |
| GAP-02 | Cao | BTP `windowFor` (dòng 230), nhãn kỳ, `ignoreLock`, `editable` | Khoá theo kỳ lập T12 / T3-6-9-12, có ô *Chế độ thử*. | Bỏ `windowFor`, nhãn kỳ và ô *Chế độ thử*. Chỉ khoá khi `Chờ BOD duyệt`. | BR5, BR6 |
| GAP-03 | Cao | BTP `TargetStatus` (dòng 41), `STATUS_CLS` (dòng 245), provider, chân khung `GdkTab` | Không có trạng thái Đã rút, không có nút Rút. | Thêm trạng thái `Đã rút` (màu tím nhạt), hàm `withdraw` trong provider, nút *Rút hồ sơ* khi chờ duyệt, popup có lý do bắt buộc, toast "Đã rút hồ sơ…". | US6, BR7, mục 5 |
| GAP-04 | Cao | BTP `savePlan`, dòng `bump` (154) | Tăng phiên bản mỗi khi lưu hồ sơ không phải nháp, kể cả khi không sửa gì. | Chỉ tăng khi trạng thái là `Đã duyệt` / `Từ chối` **và** nội dung khác phiên bản BOD đã quyết định. `Đã rút` và gửi lại không sửa thì giữ nguyên phiên bản. | BR9, BR10 |
| GAP-05 | Cao | BTP `TargetPlan`, `savePlan` | Chỉ có `rows` + `lastSubmitted`. Sửa bản đã duyệt là ghi đè lên `rows`. | Thêm `effectiveVersion` và lưu riêng dòng của bản đã duyệt (`approvedRows`), hoặc lưu `rows` theo phiên bản. Bản đã quyết định không bị ghi đè. | BR11, BR12, AC8.3 |
| GAP-06 | Trung bình | BTP `GdkTab`, dưới `PlanHeader` | Không có. | Khung *Mục tiêu chính thức — Phiên bản NN: [tổng] tr · LN gộp [tổng] tr*, chỉ hiện khi phiên bản hiện tại khác phiên bản hiệu lực. | AC8.4, mục 5 |
| GAP-07 | Trung bình | BTP `MonthInput` (dòng 446), `validate` (dòng 699) | Ô gõ tự do MM/YYYY, chấp nhận năm bất kỳ. | Đổi thành ô chọn T01–T12 của năm kế hoạch. Thêm điều kiện kiểm tra tháng thuộc năm khi gửi. | BR15, AC2.3 |
| GAP-08 | Trung bình | `Header.tsx` (chuông), provider mới / `BizTargetProvider` | Chuông tĩnh. | Tạo danh sách thông báo theo 4 sự kiện, số đếm chưa đọc, bấm vào thì mở hồ sơ và đánh dấu đã đọc. Email chỉ mô tả, không cần dựng. | US14, BR25, BR26 |
| GAP-09 | Trung bình | BTP `TargetLog`, `HistoryPanel`, `BodTab` (dòng 902), `GdkTab` | Không có thao tác *Rút hồ sơ* và không có lý do rút. | Thêm action *Rút hồ sơ* kèm lý do vào lịch sử. Hiện lý do rút ở hộp tím (GĐK) và ở dòng trạng thái (BOD). | BR22, AC9.1, AC11.4 |
| GAP-10 | Thấp | BTP `GdkTab` hộp đỏ (dòng 754), `savePlan` (dòng 163) | Hộp ý kiến từ chối mất sau lần lưu nháp đầu, vì trạng thái chuyển sang Bản nháp. | Hiện ý kiến BOD gần nhất cho đến khi có quyết định mới, kể cả khi hồ sơ đã về Bản nháp. | AC7.4, BR21 |
| GAP-11 | Thấp | BTP `decide` (dòng 169), `act` (dòng 854) | Không kiểm tra lại trạng thái trước khi ghi quyết định. | Nếu hồ sơ không còn `Chờ BOD duyệt` thì chặn và báo "Hồ sơ đã được GĐK rút — không thể quyết định". | BR2, mục 5 |
| GAP-12 | Cao | PT nút *Đặt mục tiêu* (dòng 171), `TargetModal` (dòng 214, 225), `SEED_TARGETS` | Nhập thẳng mục tiêu theo khối và ghi đè, không qua duyệt. | Nút chuyển sang màn Mục tiêu kinh doanh, mở đúng khối / năm (GĐK vào tab lập, BOD vào tab duyệt). Bỏ `TargetModal`. Dữ liệu mẫu nên sinh từ hồ sơ đã duyệt. | BR28, AC15.2–AC15.4 |
| GAP-13 | Thấp | BTP `GdkTab` đổi năm (dòng 685) | Bỏ thay đổi chưa lưu mà không hỏi. | Hỏi xác nhận trước khi đổi năm nếu còn thay đổi chưa lưu. | Mục 5 (đề xuất đã duyệt) |

## 3. Đề xuất thứ tự sửa (nếu BA quyết định sửa)
1. **Đợt 1, luồng lõi:** GAP-01, GAP-02, GAP-03, GAP-04, GAP-05, GAP-12. Sửa xong thì demo được đúng vòng đời 5 trạng thái và nguồn mục tiêu duy nhất.
2. **Đợt 2, hiển thị và kiểm tra:** GAP-06, GAP-07, GAP-09, GAP-10, GAP-11, GAP-13.
3. **Đợt 3, thông báo:** GAP-08.
