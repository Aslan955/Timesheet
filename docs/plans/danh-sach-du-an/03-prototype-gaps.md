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
| AC4.1 Tìm theo mã, tên, KH, PM | `base` (BPP:419) | ✅ | |
| AC4.2 Lọc 6 trạng thái + hợp đồng | Danh sách trạng thái cũ (có Kết thúc, Đóng; thiếu Pending, Close) (CTX:33) | ⚠️ | GAP-03 |
| AC4.3 Số đếm theo điều kiện còn lại | `count`, `signedCount`, `unsignedCount` (BPP:435) | ✅ | |
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
| AC9.1 Xuất danh sách đang lọc + Mã KD / Mã SX / Ngày cấp mã | `exportXlsx` (BPP:439) chưa có 3 cột thêm | ⚠️ | GAP-05 |
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

### Epic D — Hợp đồng
| AC | Thành phần prototype | Trạng thái | Gap |
|---|---|---|---|
| AC14.1 Quyền: AM / SM / GĐK, có mã, không Pending / Close | Ai cũng mở được, ở mọi trạng thái (BPP:620, 637) | ❌ | GAP-12 |
| AC14.2 Trường bắt buộc | `errors` (CM:93) | ✅ | |
| AC14.3 Lý do lệch | CM:99 | ✅ | |
| AC14.4 Phụ lục + tệp | Phụ lục, tệp đính kèm trong CM | ✅ | |
| AC14.5 Lưu → Đã ký, cập nhật Sổ theo dõi | `saveContract` (CTX:856–863) | ✅ | |
| AC14.6 Người không có quyền chỉ xem | Chưa có chế độ chỉ xem | ❌ | GAP-12 |
| AC15.1 Số tệp, mở xem | Cột *Tệp* (BPP:620) | ✅ | |

**Tổng hợp 55 AC (đã truy vết đủ 100%):** 27 ✅ (49%) · 16 ⚠️ (29%) · 12 ❌ (22%).

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
| GAP-11 | Cao | CTX `submitPakd` (818–821), `decidePakd` (827) | Mỗi lần nộp lại sau khi bị từ chối đều tạo phiên bản mới. | Bị từ chối thì sửa và nộp lại trên **cùng phiên bản**. Phiên bản mới chỉ sinh khi điều chỉnh PAKD đã duyệt. | BR7, AC13.5 |
| GAP-12 | Trung bình | BPP liên kết *Đã ký / Chưa ký* và *Tệp* (620, 637), CM | Ai cũng mở và lưu được hợp đồng, ở mọi trạng thái. | Chỉ AM / SM / GĐK của dự án, dự án đã có mã, không Pending / Close mới được sửa. Trường hợp khác mở chế độ chỉ xem; *Chưa ký* thì không bấm được. | BR26, AC14.1, AC14.6 |
| GAP-14 | Thấp | Tác vụ hằng ngày (mô phỏng trong CTX) | Không có email nhắc hạn. | Mô phỏng email nhắc hạn: khi còn 3 ngày thì gửi cho GĐK, SM của dự án, mỗi hạn 1 lần. Prototype có thể chỉ hiện thông báo trong ứng dụng. | BR32, AC6.5 |
| GAP-13 | Thấp | BPP `PakdDecisionModal` (322), `decide` (142) | Tiêu đề lấy theo vai trò đang chọn. Ghi chú "trả về GĐK lập lại", ngụ ý lập phiên bản mới. | Tiêu đề "CFO duyệt PAKD — V{n}". Ghi chú và toast: "trả về GĐK / SM chỉnh sửa, giữ nguyên phiên bản". | Mục 5, BR6 |

## 3. Đề xuất thứ tự sửa (nếu BA quyết định sửa)
1. **Đợt 1, vòng đời và quyền:** GAP-01, GAP-03, GAP-04, GAP-09, GAP-11. Xong đợt này thì demo được đúng 6 trạng thái, đúng vai trò và đúng phiên bản PAKD.
2. **Đợt 2, số liệu:** GAP-02, GAP-07. Xong đợt này thì Sổ theo dõi khớp mục tiêu chính thức và hợp đồng thật.
3. **Đợt 3, hiển thị theo quyền:** GAP-05, GAP-06, GAP-10, GAP-12, GAP-13.
4. **Đợt 4, điều chỉnh PAKD và nhắc hạn:** GAP-08 (làm cùng màn Chi tiết dự án), GAP-14.
