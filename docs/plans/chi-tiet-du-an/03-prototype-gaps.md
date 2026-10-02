# Đối soát SRS ↔ Prototype: Chi tiết dự án, Form cấp mã, Lập PAKD

- **SRS:** `docs/srs/SRS_ChiTietDuAn.md` v02 và `docs/srs/SRS_LapPAKD.md` v02 (2026-10-02).
- **Prototype:** commit **`8cff07a`**, đối soát lại sau khi pull. Lần đối soát trước theo commit `d8a9358`.
- **Ký hiệu file:**
  - **BPP** `src/components/BusinessProjectPage.tsx`
  - **BPC** `src/business/BusinessProjectContext.tsx`
  - **PF** `src/components/PakdForm.tsx`
  - **PK** `src/business/pakd.ts`
- **Ký hiệu trạng thái:** ✅ Có, đúng SRS · ⚠️ Có nhưng lệch · ❌ Chưa có · ➖ Ngoài prototype (chức năng đã có của hệ thống).
- **"= DS GAP-xx":** gap trùng với `docs/plans/danh-sach-du-an/03-prototype-gaps.md`.

## 1. Truy vết AC: SRS_ChiTietDuAn v02

| AC | Thành phần prototype (8cff07a) | Trạng thái | Gap |
|---|---|---|---|
| AC1.1 Tạo dự án đủ trường, có SM | `ProjectForm`; đã có SM (`canCreateProject`, BPC:37) | ✅ | |
| AC1.2 Bắt buộc tên / khối / loại / KH | `errors` trong `ProjectForm` | ✅ | |
| AC1.3 Chờ duyệt mã, version 1 | `createProject` | ✅ | |
| AC1.4 Hướng dẫn quy trình | Câu hướng dẫn ghi "AM / SM / GĐK lập PAKD" (BPP:2029); SRS là GĐK / SM | ⚠️ | C12 |
| AC2.1 GĐK tạo → cấp mã ngay | `willIssue` | ✅ | |
| AC2.2 Hạn = ngày tạo + 30 | `addDays(d, PAKD_DAYS)` | ✅ | |
| AC2.3 GĐK chỉ tạo cho khối mình | Chọn được mọi khối | ❌ | C01 |
| AC3.1 Chọn KH từ danh mục | Danh sách lấy từ các dự án | ⚠️ | C03 |
| AC3.2 Popup Thêm khách hàng đủ trường | Popup "Thêm khách hàng" (BPP:2265–2340) | ✅ | |
| AC3.3 Kiểm tra trùng mã / 3 ký tự / email | BPP:1903–1912 | ✅ | |
| AC3.4 KH mới lưu danh mục đủ trường | Chỉ mã và tên ghi vào dự án; các trường khác mất | ❌ | C03 |
| AC4.1 Đính kèm khi tạo | `files` | ✅ | |
| AC4.2 Ghi lịch sử tệp | `setAttachments` | ✅ | |
| AC5.1 Quyền sửa, khoá Pending / Close | Nút *Sửa* chỉ AM / SM / GĐK (BPP:1566–1579), nhưng không kiểm tra "của dự án", không khoá Pending / Kết thúc | ⚠️ | C02 |
| AC5.2 Sửa trên **màn hình riêng** | Đang là **popup** `EditProjectModal` (BPP:1344) | ❌ | C13 |
| AC5.3 Version v{n} → v{n+1} | "Đã cập nhật thông tin cơ bản — Version N" | ✅ | |
| AC5.4 Đổi khối / KH sau cấp mã | Đổi được | ✅ | |
| AC5.5 Update PM | Nút "Update PM" (BPP:1959–1990) | ✅ | |
| AC5.6 Tab Thông tin / PAKD tách nhau | 2 tab trong popup | ✅ | |
| AC6.1 Thông tin phụ | Thanh tiêu đề | ✅ | |
| AC6.2 Mã tổng / KD / SX / outsource | `CodeTable` (BPP:1109); mã outsource vẫn `.3` / `.4` | ⚠️ | C04 |
| AC6.3 Thông tin chi tiết, HĐ, tài liệu | Có | ✅ | |
| AC6.4 AM không thấy PAKD | AM vẫn thấy và lập được PAKD (`canLapPakd`, BPC:38) | ❌ | C05 |
| AC7.1 Thanh thao tác theo vai trò | `StepActionBar` (BPP:1179–1300) đã thêm SM, điều chỉnh, Pending. Còn: AM lập PAKD, *Kết thúc* cho mọi vai trò | ⚠️ | C06 |
| AC7.2 Người khác thấy đang chờ ai | Có | ✅ | |
| AC7.3 Hạn và số ngày còn lại | Có | ✅ | |
| AC8.1 Bước hiện tại trên thanh thao tác | `StepActionBar` | ✅ | |
| AC8.2 Tra cứu ở tab Lịch sử | Tab Lịch sử | ✅ | |
| AC8.3 Pending / Close thể hiện rõ | Pending có; chưa có Close (vẫn *Kết thúc*) | ⚠️ | C07 |
| AC9.1 Chỉ GĐK của khối duyệt mã | GĐK duyệt mọi khối | ⚠️ | C01 |
| AC9.2 Cấp mã, đặt hạn, báo | `approveCode` | ✅ | |
| AC9.3 Ghi lịch sử, thanh thao tác chuyển bước | Có | ✅ | |
| AC9.4 GĐK từ chối yêu cầu mở mã | Không có | ❌ | C08 |
| AC10.1 GĐK / Admin tạo, Mã SX.1…5 | Ai cũng tạo; `.3` / `.4`, tối đa 2 (BPC:324–331) | ⚠️ | C04 |
| AC10.2 Admin tạo → chờ GĐK duyệt | Không có | ❌ | C04 |
| AC10.3 GĐK duyệt / từ chối mã outsource | Không có | ❌ | C04 |
| AC10.4 Chỉ mã có hiệu lực mới dùng, version +1 | Không có | ❌ | C04 |
| AC10.5 Đổi PM, xoá, ghi lịch sử | Có | ✅ | |
| AC10.6 Không dùng lại số | Dùng lại số trống nhỏ nhất | ❌ | C04 |
| AC10.7 PM outsource mặc định | `addOutsourceCode` lấy `outsourcePm` làm PM mặc định | ✅ | |
| AC11.1 HĐ phải được CFO duyệt | Lưu là có hiệu lực ngay | ⚠️ | C09 |
| AC11.2 Xem thông tin hợp đồng | `ContractPanel` | ✅ | |
| AC11.3 Thêm / xoá tài liệu theo quyền | Không giới hạn quyền / trạng thái | ⚠️ | C02 |
| AC12.1 Lịch sử, mới nhất trước | Có | ✅ | |
| AC12.2 Không sửa / xoá lịch sử | Có | ✅ | |
| AC13.1 Chỉ GĐK kết thúc | Mọi vai trò thấy *Kết thúc dự án* (BPP:1227–1259) | ❌ | C10 |
| AC13.2 Chặn khi còn PAKD điều chỉnh chờ CFO | Ẩn nút khi có bản điều chỉnh chờ duyệt | ✅ | |
| AC13.3 Xác nhận, chuyển Close | Có xác nhận; chuyển *Kết thúc* | ⚠️ | C07 |
| AC14.1 CFO / Admin mở lại Pending / Close | Chỉ CFO, chỉ Pending | ⚠️ | C07 |
| AC14.2 Pending về bước cũ (+30), Close về Đang thực hiện | Pending đúng; chưa có mở lại Close | ⚠️ | C07 |
| AC14.3 Ghi lịch sử mở lại | Có | ✅ | |
| AC15.1 Xoá: Chờ duyệt mã, người tạo / GĐK | Mọi vai trò, mọi trạng thái | ❌ | C11 |
| AC15.2 Xác nhận, xoá mềm | Có xác nhận; xoá hẳn | ⚠️ | C11 |

## 2. Truy vết AC: SRS_LapPAKD v02

| AC | Thành phần prototype (8cff07a) | Trạng thái | Gap |
|---|---|---|---|
| AC1.1 AM không xem PAKD | AM xem và lập được | ❌ | P01 |
| AC1.2 Thông tin chung (4 ô) | PF:640–645 | ✅ | |
| AC1.3 Chỉ đọc kèm lý do | Có; câu "Chọn vai trò AM, SM hoặc GĐK để nhập PAKD." (PF:674) | ⚠️ | P02 |
| AC2.1–AC2.3 Thông tin HĐ, tiến độ, mốc nghiệm thu | PF mục 1–3 | ✅ | |
| AC2.4 Kế hoạch chi phí theo tháng | Mục "4. Kế hoạch chi phí theo tháng" (PF:184–380) | ✅ | |
| AC2.5 Chia đều, tổng, luỹ kế | Nút ÷, `spreadEven` (PK:111), dòng Luỹ kế | ✅ | |
| AC2.6 Cảnh báo ngoài kỳ | PF:190, 324 | ✅ | |
| AC3.1–AC3.3 Chưa ký, đổi biến thể | Có; tự điền khi chuyển sang Đã ký (PF:581–611) | ✅ | |
| AC4.1–AC4.6 Bảng điều khiển | PF:765–817 | ✅ | |
| AC5.1 Ai lưu nháp | `canLapPakd` gồm cả AM | ⚠️ | P01 |
| AC5.2 Lần lưu cuối | Có | ✅ | |
| AC5.3 Lưu nháp không đổi số liệu | Có | ✅ | |
| AC6.1 Kiểm tra khi gửi | `validatePakd`, có 2 lỗi mới về kế hoạch chi phí. Thiếu kiểm tra Từ / Đến của giai đoạn | ⚠️ | P03 |
| AC6.2 Chờ CFO, khoá form | Có | ✅ | |
| AC6.3 Gửi chưa đổi số liệu | **Lần gửi đầu** vẫn gọi `applyPakd` ngay (BPC `savePakdForm`) | ❌ | P04 |
| AC6.4 Email cho CFO | Prototype không gửi email | ➖ | |
| AC7.1 CFO xem đủ, biết bản hiệu lực | Popup điều chỉnh so sánh cũ → mới | ✅ | |
| AC7.2 CFO duyệt / từ chối | Popup, `StepActionBar`, *Duyệt điều chỉnh* trên danh sách | ✅ | |
| AC7.3 Duyệt → ghi số liệu | Đúng với bản điều chỉnh; lần đầu đã ghi từ lúc gửi | ⚠️ | P04 |
| AC8.1 GĐK / SM sửa sau từ chối, AM không | GĐK / SM sửa được, nhưng AM cũng sửa được | ⚠️ | P01 |
| AC8.2 Thấy ý kiến CFO | `StepActionBar`, dải thông báo | ✅ | |
| AC8.3 Giữ nguyên phiên bản | Dữ liệu đúng (`nextPakdVersion`, BPC:40); nút / cột / toast vẫn hiện V{n+1} | ⚠️ | P05 |
| AC9.1 GĐK / SM điều chỉnh qua **màn** Sửa dự án | Có điều chỉnh, nhưng trong **popup** | ⚠️ | C13 |
| AC9.2 Dự án giữ Đang thực hiện, số liệu cũ | Có | ✅ | |
| AC9.3 Bản điều chỉnh chỉ CFO duyệt | Có | ✅ | |
| AC9.4 Huỷ bản điều chỉnh | `cancelPakdAdjust` | ✅ | |
| AC9.5 Chặn kết thúc khi có bản chờ | Có | ✅ | |
| AC10.1 Danh sách phiên bản | Ngăn Quy trình bị gỡ, không còn chỗ nào hiển thị danh sách phiên bản | ❌ | P07 |
| AC10.2 Mở nội dung phiên bản cũ | Không có | ❌ | P07 |
| AC11.1 Duyệt → ghi số liệu dự án | Đúng với bản điều chỉnh; sai ở lần đầu | ⚠️ | P04 |
| AC11.2 Nháp / gửi / từ chối không đổi số liệu | Lần gửi đầu có ghi đè | ❌ | P04 |
| AC11.3 Kế hoạch tháng sinh từ PAKD | `pakdMonthlyPlan` | ✅ | |
| AC11.4 HĐ từ PAKD chờ CFO duyệt | Hợp đồng tạo / ghi đè ngay, không duyệt | ❌ | P08 |
| AC11.5 HĐ được duyệt → điền vào bản điều chỉnh | `syncContractToPakd` ghi thẳng vào PAKD đã duyệt, không qua duyệt | ❌ | P09 |

**Tổng hợp (8cff07a):**
- SRS_ChiTietDuAn v02: 28 ✅ · 14 ⚠️ · 11 ❌ (tổng 53, truy vết đủ 100%).
- SRS_LapPAKD v02: 27 ✅ · 8 ⚠️ · 7 ❌ · 1 ➖ (tổng 43, truy vết đủ 100%).

## 3. Danh sách chỉnh sửa prototype (cập nhật theo 8cff07a)

| ID | Ưu tiên | Tình trạng ở 8cff07a | Còn phải sửa | Nguồn | Trùng |
|---|---|---|---|---|---|
| C01 | Cao | Đã thêm SM | Vai trò theo tài khoản; thêm BOD, Admin; GĐK chỉ khối mình | CT BR1, BR2 | DS GAP-01 |
| C02 | Cao | *Sửa* chỉ AM / SM / GĐK | Chỉ người của dự án; khoá ở Pending / Close; áp dụng cả tài liệu | CT BR1, BR3, BR16 | DS GAP-10 |
| C03 | Trung bình | Popup KH đủ trường | Danh mục `biz_customer` dùng chung; lưu đủ trường | CT BR7 | |
| C04 | Cao | Chưa sửa | Mã SX.1…5, không dùng lại; GĐK / Admin; Admin tạo chờ GĐK duyệt; trạng thái; version +1 | CT BR11, BR12 | DS GAP-18 |
| C05 | Cao | Chưa sửa | Ẩn PAKD với AM | CT BR1; PAKD BR1 | DS GAP-16 |
| C06 | Trung bình | Phần lớn đã đúng | Bỏ AM khỏi Lập PAKD; *Kết thúc* chỉ GĐK; thêm dòng HĐ / mã outsource chờ duyệt | CT BR19 | |
| C07 | Cao | Pending đã đúng | Đổi *Kết thúc* → Close; mở lại Close về Đang thực hiện; thêm Admin mở lại | CT BR14 | DS GAP-03, GAP-04 |
| C08 | Trung bình | Chưa sửa | GĐK từ chối yêu cầu mở mã | CT BR5 | |
| C09 | Cao | Chưa sửa | Hợp đồng phải được CFO duyệt | DS BR31, BR35 | DS GAP-20 |
| C10 | Cao | Đã ẩn khi có bản điều chỉnh chờ | Chỉ GĐK của khối | CT BR13 | |
| C11 | Trung bình | Chưa sửa | Chỉ *Chờ duyệt mã*, người tạo / GĐK; xoá mềm | CT BR15 | |
| C12 | Thấp | Một phần | Câu hướng dẫn: "GĐK / SM lập PAKD" | CT mục 5 | |
| **C13** | Trung bình | **Mới** | Đổi popup `EditProjectModal` (BPP:1344) thành **màn hình Sửa dự án** riêng, giữ 2 tab | CT BR22 | |
| P01 | Cao | SM đã có | Bỏ AM khỏi `canLapPakd` (BPC:38) | PAKD BR1, BR2 | DS GAP-16 |
| P02 | Thấp | Chưa sửa | Câu chú thích theo PAKD BR3 | PAKD BR3 | |
| P03 | Trung bình | Chưa sửa | Kiểm tra Từ / Đến của giai đoạn | PAKD BR17 | |
| P04 | Cao | Bản điều chỉnh đã đúng | **Lần gửi đầu**: bỏ `applyPakd` lúc gửi, chuyển sang lúc CFO duyệt | PAKD BR18, BR22 | DS GAP-17 |
| P05 | Trung bình | Dữ liệu đã đúng | Sửa hiển thị số phiên bản ở nút "Lập lại PAKD V…", cột "Làm lại V…", toast (BPP:213, 217, 225, 301, 1214); `submitPakd` cũ (BPC:882) | PAKD BR20 | DS GAP-11 |
| P06 | — | **Đã sửa** ở 8cff07a | (Luồng điều chỉnh PAKD) | PAKD BR21 | DS GAP-08 |
| P07 | Trung bình | Xấu đi: ngăn Quy trình bị gỡ nên mất cả danh sách phiên bản | Khối *Phiên bản PAKD* dưới form; xem lại phiên bản cũ | PAKD BR20, mục 5 | |
| P08 | Trung bình | Chưa sửa | HĐ tạo từ PAKD phải chờ CFO duyệt | PAKD BR22 | |
| **P09** | Cao | **Mới** | `syncContractToPakd` (PK:273–292) không được ghi thẳng vào `pakdForm` đã duyệt; chỉ điền vào bản điều chỉnh sau khi HĐ được CFO duyệt | PAKD BR22, AC11.5 | |

## 4. Đề xuất thứ tự sửa
1. **Đợt 1:** C05 / P01, P04, P09, C10, C13.
2. **Đợt 2:** C09, P08, C04, C07, C11.
3. **Đợt 3:** C01, C02, C03, C08, P07.
4. **Đợt 4:** C06, C12, P02, P03, P05.
