# Đối soát SRS ↔ Prototype: Danh sách dự án

- **SRS:** `docs/srs/SRS_DanhSachDuAn.md` (v01, 2026-10-02)
- **Prototype:**
  - `src/components/BusinessProjectPage.tsx` (ký hiệu **BPP**)
  - `src/components/ProjectTracker.tsx` (**PT**)
  - `src/components/ContractModal.tsx` (**CM**)
  - `src/business/BusinessProjectContext.tsx` (**CTX**)
- **Ký hiệu trạng thái:** ✅ Có, đúng SRS · ⚠️ Có nhưng lệch SRS · ❌ Chưa có

## 1. Bảng truy vết AC ↔ prototype

### Epic A — Sổ theo dõi dự án
| AC | Thành phần prototype | Trạng thái | Gap |
|---|---|---|---|
| AC1.1 Mục tiêu / Đã ký / Chưa ký / Còn thiếu / % đạt | `trackerRows` (PT:39), `RowCells` | ✅ | |
| AC1.2 Mục tiêu là mục tiêu chính thức | `targets` ghi từ hai nơi: duyệt Mục tiêu kinh doanh và `TargetModal` nhập tay | ⚠️ | GAP-02 |
| AC1.3 Đã ký chỉ theo hợp đồng đã nhập | `signedValue` / `signedDate` lấy Doanh thu dự kiến / ngày dự kiến khi chưa nhập HĐ (CTX:69, 72) | ⚠️ | GAP-07 |
| AC1.4 Lọc năm / khối, Tất cả = cộng dồn | `yearTargets` (PT:94) | ✅ | |
| AC1.5 Chưa có mục tiêu "—", vượt mục tiêu | `RowCells` | ✅ | |
| AC1.6 Chỉ GĐK / CFO / BOD / Admin thấy | Luôn hiển thị (BPP:509) | ❌ | GAP-06 |
| AC2.1 Không nhập mục tiêu trực tiếp | Nút *Đặt mục tiêu* + `TargetModal` (PT:171, 208, 224) | ❌ | GAP-02 |
| AC2.2 Dẫn tới hồ sơ Mục tiêu kinh doanh | Không có | ❌ | GAP-02 |

### Epic B — Tra cứu danh sách
| AC | Thành phần prototype | Trạng thái | Gap |
|---|---|---|---|
| AC3.1 Lọc Năm / Khối cho cả màn | Ô Năm, Khối trên thanh tiêu đề, truyền vào `ProjectTracker` | ✅ | |
| AC3.2 Danh sách năm | `years` (BPP:408) | ✅ | |
| AC3.3 Mặc định năm hiện tại | `useState(...getFullYear())` (BPP:414) | ✅ | |
| AC4.1 Tìm theo mã, mã outsource, tên, KH, PM | `base` (BPP:419) chưa tìm theo mã outsource | ⚠️ | GAP-18 |
| AC4.2 Lọc 6 trạng thái + hợp đồng | Danh sách trạng thái cũ (CTX:33). **Bộ lọc Hợp đồng đã bị bỏ** ở commit d8a9358 | ⚠️ | GAP-03, GAP-15 |
| AC4.3 Số đếm theo điều kiện còn lại | Còn số đếm trạng thái; mất số đếm Đã ký / Chưa ký (d8a9358) | ⚠️ | GAP-15 |
| AC4.4 Báo không có dự án phù hợp | BPP:652 | ✅ | |
| AC5.1 Các cột thông tin | `LIST_HEAD` (BPP:392) | ✅ | |
| AC5.2 KEY, chờ cấp mã | `KeyBadge` (BPP:571), "Chờ cấp mã" (BPP:569) | ✅ | |
| AC5.3 Chỉ dự án trong phạm vi xem | Không lọc phạm vi; vai trò chọn tay (BPP:133, 499) | ❌ | GAP-01 |
| AC5.4 AM không thấy PAKD | Mọi vai trò thấy 2 cột PAKD | ❌ | GAP-05 |
| AC6.1 Còn bao nhiêu ngày, nổi bật khi sắp hết hạn | `pakdDeadlineCell` (BPP:261). Quá hạn vẫn hiển thị "Quá hạn N ngày" thay vì chuyển Pending | ⚠️ | GAP-04 |
| AC6.2 Nộp / chờ / từ chối / duyệt kèm ngày | `pakdDeadlineCell`, `pakdVersionText` (BPP:281) | ✅ | |
| AC6.3 Phiên bản chờ duyệt + phiên bản hiệu lực | Không có khái niệm phiên bản hiệu lực | ❌ | GAP-08 |
| AC6.4 Quá hạn → Pending | Tự chuyển *Đóng*, và chỉ khi chưa từng nộp PAKD (CTX:797–808) | ❌ | GAP-04 |
| AC6.5 Email nhắc khi sắp hết hạn | Không có | ❌ | GAP-14 |
| AC7.1 Thông tin HĐ đã nhập | Nhóm cột hợp đồng | ✅ | |
| AC7.2 "Chưa nhập HĐ" khi đã ký mà chưa nhập | Hiển thị Doanh thu dự kiến / ngày dự kiến thay thế (BPP:603) | ⚠️ | GAP-07 |
| AC7.3 Chưa ký | Liên kết *Chưa ký* | ✅ | |
| AC8.1 x / y dự án | Chân bảng | ✅ | |
| AC8.2 Tổng HĐ dự kiến, tổng HĐ ký | `rev`, `contractRev`. `contractRev` có cộng giá trị dự kiến thay thế | ⚠️ | GAP-07 |
| AC9.1 Xuất danh sách đang lọc + Mã KD / Mã SX / Mã outsource / Ngày cấp mã | `exportXlsx` (BPP:439) chưa có 4 cột thêm | ⚠️ | GAP-05, GAP-18 |
| AC9.2 File của AM không có PAKD | Luôn xuất 2 cột PAKD | ❌ | GAP-05 |
| AC10.1 Mở chi tiết | `onView` (BPP:567) | ✅ | |
| AC10.2 Dữ liệu cập nhật khi quay lại | Dùng chung context | ✅ | |

### Epic C — Thao tác theo vai trò
| AC | Thành phần prototype | Trạng thái | Gap |
|---|---|---|---|
| AC11.1 AM, SM, GĐK tạo dự án | Nút chỉ hiện cho AM, GĐK (BPP:500–502). Chưa có SM | ⚠️ | GAP-01 |
| AC11.2 AM / SM chờ duyệt mã, GĐK cấp ngay | Đúng với AM / GĐK, chưa có SM | ⚠️ | GAP-01 |
| AC11.3 Chuyển Form cấp mã | `onCreate` | ✅ | |
| AC12.1 Thao tác theo ma trận | `rowAction` (BPP:291) lệch ma trận: mọi vai trò thấy *Lập PAKD* / *Cập nhật*; chưa có SM, BOD, Admin | ⚠️ | GAP-09 |
| AC12.2 GĐK duyệt mã | *Duyệt mã* với GĐK | ✅ | |
| AC12.3 GĐK và SM lập PAKD | Chưa có SM | ⚠️ | GAP-09 |
| AC12.4 CFO duyệt PAKD lần đầu và điều chỉnh | Có với PAKD lần đầu, chưa có PAKD điều chỉnh | ⚠️ | GAP-08 |
| AC12.5 CFO / Admin mở lại Pending / Close | Chỉ CFO mở lại *Đóng*. Chưa có Admin, Pending, Close | ⚠️ | GAP-04, GAP-09 |
| AC12.6 Khoá ở Pending / Close | Không có khoá | ❌ | GAP-10 |
| AC13.1 CFO duyệt từ danh sách | `PakdDecisionModal` (BPP:322) | ✅ | |
| AC13.2 Tóm tắt + phiên bản hiệu lực | Có tóm tắt, chưa có phiên bản hiệu lực | ⚠️ | GAP-08 |
| AC13.3 Ý kiến bắt buộc khi từ chối | BPP:374 | ✅ | |
| AC13.4 Duyệt → Đang thực hiện / phiên bản có hiệu lực | Đúng với lần đầu, chưa có điều chỉnh | ⚠️ | GAP-08 |
| AC13.5 Từ chối → sửa, giữ nguyên phiên bản | `submitPakd` luôn tạo phiên bản mới (CTX:821) | ⚠️ | GAP-11 |
| AC13.6 Ghi lịch sử quyết định | `patch` ghi lịch sử | ✅ | |
| AC13.7 Số liệu PAKD chỉ cập nhật khi CFO duyệt | `savePakdForm` ghi đè số liệu dự án ngay lúc nộp (d8a9358) | ❌ | GAP-17 |

### Epic D — Hợp đồng
| AC | Thành phần prototype | Trạng thái | Gap |
|---|---|---|---|
| AC14.1 Quyền: AM / SM / GĐK, có mã, không Pending / Close | Ai cũng mở được, ở mọi trạng thái (BPP:620, 637) | ❌ | GAP-12 |
| AC14.2 Trường bắt buộc | `errors` (CM:93) | ✅ | |
| AC14.3 Lệch quá 2% chỉ cảnh báo | Popup hợp đồng **bắt buộc** lý do với mọi mức lệch (CM:99) | ⚠️ | GAP-19 |
| AC14.4 Phụ lục + tệp | Phụ lục, tệp đính kèm trong CM | ✅ | |
| AC14.5 Lưu → Đã ký, cập nhật Sổ theo dõi | `saveContract` (CTX:856–863) | ✅ | |
| AC14.6 Người không có quyền chỉ xem | Chưa có chế độ chỉ xem | ❌ | GAP-12 |
| AC15.1 Số tệp, mở xem | Cột *Tệp* (BPP:620) | ✅ | |

**Tổng hợp 56 AC (đã truy vết đủ 100%, cập nhật theo commit d8a9358):** 24 ✅ (43%) · 19 ⚠️ (34%) · 13 ❌ (23%).

## 2. Danh sách chỉnh sửa prototype

| ID | Ưu tiên | Thành phần cần sửa | Hiện trạng | Cần sửa thành | Nguồn SRS |
|---|---|---|---|---|---|
| GAP-01 | Cao | CTX `BIZ_ROLES` (dòng 39), BPP `role` (133), `RoleSelect` (499), nút *Cấp mã* (500–502) | Vai trò chọn tay, chỉ có AM / GĐK / CFO. Không lọc phạm vi xem. | Lấy vai trò theo tài khoản (có cách đổi tài khoản để demo). Thêm SM, BOD, Admin. Lọc dự án theo phạm vi BR2 (cần thêm danh sách thành viên dự án). | BR1, BR2, AC5.3, AC11 |
| GAP-02 | Cao | PT nút *Đặt mục tiêu* (171), `TargetModal` (208, 224) | Nhập tay mục tiêu, ghi đè mục tiêu chính thức. | Nút chuyển sang màn Mục tiêu kinh doanh đúng khối / năm. Chỉ hiện với GĐK, BOD. Bỏ `TargetModal`. Trùng GAP-12 của Mục tiêu kinh doanh. | BR15, AC1.2, AC2 |
| GAP-03 | Cao | CTX `BizStatus` / `BIZ_STATUSES` (32–33), BPP `STATUS_CLS` (100) | Có *Kết thúc*, *Đóng*. Thiếu *Pending*, *Close*. | 6 trạng thái theo SRS. Pending màu cam, Close màu xám đậm. | Mục 1, BR11, mục 5 |
| GAP-04 | Cao | CTX tự đóng (797–808), `reopenProject` (790), `finishProject` (845), BPP `pakdDeadlineCell` | Quá hạn thì *Đóng*, chỉ khi chưa từng nộp PAKD. Mở lại chỉ đặt lại hạn. Kết thúc thì về *Kết thúc*. | Quá hạn mà PAKD chưa được duyệt (chưa nộp / chờ duyệt / đang sửa) thì chuyển **Pending**, lưu trạng thái trước đó. Mở lại Pending thì về trạng thái cũ, hạn mới = ngày mở lại + 30. Kết thúc thì chuyển **Close**, chặn kết thúc khi còn PAKD điều chỉnh chờ CFO. Mở lại Close thì về *Đang thực hiện*. Cột Hạn hiển thị Pending / Close. Dữ liệu mẫu *Kết thúc* / *Đóng* đổi thành Close. | BR8, BR9, BR11, BR13, BR33 |
| GAP-05 | Trung bình | BPP `LIST_HEAD` (392), bảng, `exportXlsx` (439) | Mọi vai trò thấy 2 cột PAKD. File xuất thiếu Mã KD / Mã SX / Ngày cấp mã. | Ẩn cột *Hạn lập PAKD*, *Phiên bản PAKD* trên bảng và trong file xuất khi người dùng là AM. Thêm 3 cột Mã KD, Mã SX, Ngày cấp mã vào file xuất. | BR3, BR24, AC5.4, AC9.1, AC9.2 |
| GAP-06 | Trung bình | BPP `<ProjectTracker>` (509) | Luôn hiển thị. | Ẩn với AM, SM. GĐK chỉ thấy khối mình. | BR4, AC1.6 |
| GAP-07 | Cao | CTX `signedDate` / `signedValue` (69, 72), PT `trackerRows` (42–47) và ô tổng (114–115), BPP nhóm cột HĐ (603…) và `contractRev` | Đã ký mà chưa nhập HĐ thì lấy số / ngày dự kiến. Ô tổng tính theo giá trị dự kiến của mọi dự án. | Đã ký chỉ tính theo hợp đồng đã nhập. Đã ký mà chưa nhập HĐ thì để trống kèm nhãn "Chưa nhập HĐ", và không cộng vào Đã ký / Chưa ký. Ô tổng dùng cùng công thức với bảng theo khối. Chưa ký loại thêm dự án Pending / Close. | BR16–BR18, BR30, AC1.3, AC7.2, AC8.2 |
| GAP-08 | Trung bình | CTX `PakdVersion`, `BizProject`; BPP `pakdVersionText`, `PakdDecisionModal`, `rowAction` | Không có phiên bản có hiệu lực. Không có điều chỉnh PAKD khi đang thực hiện. | Thêm `effectiveVersion`. Cho điều chỉnh PAKD khi *Đang thực hiện* (sinh phiên bản mới, giữ trạng thái dự án). Cột Phiên bản hiển thị "V2, chờ CFO · hiệu lực V1". Tiêu đề popup ghi phiên bản đang hiệu lực. CFO có nút *Duyệt* ở dự án Đang thực hiện khi có bản chờ. Luồng sửa PAKD nằm ở màn Chi tiết. | BR7, BR14, AC6.3, AC12.4, AC13.2, AC13.4 |
| GAP-09 | Cao | BPP `rowAction` (291) | Mọi vai trò thấy *Lập PAKD*, *Cập nhật*. Chỉ CFO mở lại. | Viết lại theo ma trận mục 1: AM *Cập nhật* (chưa có PAKD / đang thực hiện); SM, GĐK *Lập PAKD*; CFO / BOD *Xem*; CFO, Admin *Mở lại* ở Pending / Close. | Ma trận 1, AC12.1, AC12.3, AC12.5 |
| GAP-10 | Trung bình | BPP `ProjectList`, `ProjectDetail`, `ContractModal` | Không khoá theo trạng thái. | Ở Pending / Close: chặn cập nhật thông tin dự án, PAKD, hợp đồng. Chỉ còn *Xem* / *Mở lại*. | BR10, AC12.6 |
| GAP-11 | Cao | CTX `submitPakd` (818–821), `savePakdForm`, `decidePakd` (827); nút "Lập lại PAKD V{n+1}" (`WorkflowDrawer`, `StepActionBar`) | Mỗi lần nộp lại sau khi bị từ chối đều tạo phiên bản mới, và nút ghi "Lập lại PAKD V{n+1}". | Bị từ chối thì sửa và nộp lại trên **cùng phiên bản**. Phiên bản mới chỉ sinh khi điều chỉnh PAKD đã duyệt. | BR7, AC13.5 |
| GAP-12 | Trung bình | BPP liên kết *Đã ký / Chưa ký* và *Tệp* (620, 637), CM | Ai cũng mở và lưu được hợp đồng, ở mọi trạng thái. | Chỉ AM / SM / GĐK của dự án, dự án đã có mã, không Pending / Close mới được sửa. Trường hợp khác mở chế độ chỉ xem; *Chưa ký* thì không bấm được. | BR26, AC14.1, AC14.6 |
| GAP-15 | Cao | BPP `ProjectList`: bộ lọc hợp đồng (bị bỏ ở d8a9358) | Không còn lọc *Đã ký / Chưa ký*. | **Khôi phục** ô lọc *Tất cả hợp đồng / Đã ký (n) / Chưa ký (n)*, số đếm theo các điều kiện còn lại. | AC4.2, AC4.3, BR22 |
| GAP-16 | Cao | `WorkflowDrawer` (nút Lập PAKD), `StepActionBar`, `PakdForm` | **AM** được lập / nộp PAKD. Chưa có vai trò SM. | Chỉ **GĐK và SM** lập / nộp PAKD. AM không thấy PAKD (form, cột, thanh thao tác). | D10, D11, BR3, BR6 |
| GAP-17 | Cao | CTX `savePakdForm` | Nộp PAKD là ghi đè ngay: giá trị HĐ dự kiến, chi phí, ngày dự kiến ký, kế hoạch tháng, cờ đã ký, hợp đồng. | Lúc nộp chỉ lưu PAKD. Số liệu chỉ ghi vào dự án khi **CFO duyệt** (`decidePakd` approve). | BR34, AC13.7 |
| GAP-18 | Trung bình | BPP `ProjectList` → `base` (tìm kiếm), `exportXlsx` | Không tìm theo mã outsource; file xuất không có cột Mã outsource. | Tìm kiếm khớp cả mã outsource. File xuất thêm cột *Mã outsource* (các mã cách nhau bằng dấu phẩy). Không thêm cột trên màn. | BR12, BR21, BR24, AC4.1, AC9.1 |
| GAP-19 | Trung bình | CM `errors.deviationReason` (dòng 99), bảng so sánh chênh lệch | Lệch bất kỳ là bắt buộc nhập lý do, chặn lưu. | Bỏ bắt buộc. Lệch quá 2% thì cảnh báo (chữ vàng + dòng cảnh báo), vẫn cho lưu. | BR28, AC14.3 |
| GAP-14 | Thấp | Tác vụ hằng ngày (mô phỏng trong CTX) | Không có email nhắc hạn. | Mô phỏng email nhắc hạn: khi còn 3 ngày thì gửi cho GĐK, SM của dự án, mỗi hạn 1 lần. Prototype có thể chỉ hiện thông báo trong ứng dụng. | BR32, AC6.5 |
| GAP-13 | Thấp | BPP `PakdDecisionModal` (322), `decide` (142) | Tiêu đề lấy theo vai trò đang chọn. Ghi chú "trả về GĐK lập lại", ngụ ý lập phiên bản mới. | Tiêu đề "CFO duyệt PAKD — V{n}". Ghi chú và toast: "trả về GĐK / SM chỉnh sửa, giữ nguyên phiên bản". | Mục 5, BR6 |

## 3. Đề xuất thứ tự sửa (nếu BA quyết định sửa)
1. **Đợt 1, vòng đời và quyền:** GAP-01, GAP-03, GAP-04, GAP-09, GAP-11, GAP-15, GAP-16, GAP-17. Xong đợt này thì demo được đúng 6 trạng thái, đúng vai trò và đúng phiên bản PAKD.
2. **Đợt 2, số liệu:** GAP-02, GAP-07. Xong đợt này thì Sổ theo dõi khớp mục tiêu chính thức và hợp đồng thật.
3. **Đợt 3, hiển thị theo quyền:** GAP-05, GAP-06, GAP-10, GAP-12, GAP-13.
4. **Đợt 4, điều chỉnh PAKD và nhắc hạn:** GAP-08 (làm cùng màn Chi tiết dự án), GAP-14.

---

## 4. Rà soát lần 2 sau khi pull code (commit `d8a9358`, 2026-10-02)

So sánh code từ `2d0f5ac` đến `d8a9358`. Các file liên quan được sửa: `BusinessProjectPage.tsx` (+902 / −323 dòng), `BusinessProjectContext.tsx`, `WorkflowDrawer.tsx`, thêm `pakd.ts` và `PakdForm.tsx`. Hai file `ProjectTracker.tsx` và `ContractModal.tsx` **không đổi**.

### 4.1. Tình trạng 14 gap đã ghi
**Chưa gap nào được sửa.** Vai trò vẫn chọn tay (AM / GĐK / CFO). Vẫn 6 trạng thái cũ (có *Kết thúc*, *Đóng*). `rowAction`, `pakdDeadlineCell`, Sổ theo dõi, nút *Đặt mục tiêu* và popup hợp đồng giữ nguyên như lần đối soát trước.

### 4.2. Thay đổi mới trên màn Danh sách (thuộc phạm vi SRS)
| # | Thay đổi | Ảnh hưởng tới SRS | Đề xuất |
|---|---|---|---|
| N1 → GAP-15 | **Bỏ bộ lọc Hợp đồng** (*Đã ký / Chưa ký*) và số đếm của nó | Lệch AC4.2, AC4.3, BR22 | **BA chốt: khôi phục** (GAP-15) |
| N2 | Bộ lọc **Năm / Khối** chuyển từ thanh tiêu đề xuống khung *Danh sách dự án*, nhưng vẫn điều khiển Sổ theo dõi nằm phía trên | Lệch mô tả mục 1 ("Thanh tiêu đề: bộ lọc Năm và Khối") và mục 5 | **BA chấp nhận vị trí mới.** SRS v02 đã sửa mục 1 và mục 5 |

### 4.3. Thay đổi ở màn Chi tiết / Form (ngoài phạm vi SRS này) nhưng ảnh hưởng tới quyết định đã chốt
| # | Thay đổi | Mâu thuẫn với | Mức độ |
|---|---|---|---|
| N3 → GAP-16 | Lập PAKD ngay trên hệ thống (`PakdForm`). **AM hoặc GĐK** được lập / nộp PAKD (`WorkflowDrawer`, `StepActionBar`) | D10 (AM không xem PAKD), D11 (GĐK và **SM** lập PAKD). Vai trò SM vẫn chưa có | Cao. **BA chốt giữ SRS:** AM chỉ tạo dự án, không lập PAKD; SM tạo dự án và lập PAKD. Báo dev sửa |
| N4 → GAP-11 | Nút "**Lập lại PAKD V{n+1}**" sau khi bị từ chối. `savePakdForm` luôn tạo phiên bản mới | BR7 / D13 (bị từ chối thì giữ nguyên phiên bản), GAP-11 | Cao |
| N5 → GAP-17 | **Nộp PAKD ghi đè số liệu dự án** ngay lúc nộp, chưa chờ CFO duyệt: Giá trị HĐ dự kiến, chi phí kế hoạch, cờ đã ký, thời điểm dự kiến ký, kế hoạch theo tháng. Nếu PAKD ở trạng thái "Đã ký" thì **tự tạo / ghi đè hợp đồng** (số HĐ, ngày ký, giá trị, thời hạn) | BR16, BR17 (Sổ theo dõi nhận số chưa duyệt), BR28 (hợp đồng tạo từ PAKD không kiểm tra lý do lệch), BR31 (hợp đồng chỉ ghi qua popup) | Cao. **BA chốt: cập nhật khi CFO duyệt** (BR34) |
| N6 → GAP-18 | Thêm **mã outsource** `Mã tổng.3`, `.4`, tối đa 2 mã, mỗi mã có PM phụ trách | **BA chốt (SRS v02):** tìm kiếm theo mã outsource, thêm cột trong file Excel, không thêm cột trên màn | Trung bình |
| N7 | PAKD có ngưỡng **biên LN tối thiểu 20%** và cảnh báo **lệch giá trị HĐ > 2%** so với doanh thu PAKD | **BA chốt: chỉ cảnh báo khi lệch quá 2%** (BR28 v02). Popup hợp đồng cần sửa theo (GAP-19) | Trung bình |
| N8 | Thanh thao tác `StepActionBar` vẫn dùng trạng thái *Đóng*, chỉ CFO mở lại | GAP-04, D15–D16 | Đã có trong GAP-04 |
