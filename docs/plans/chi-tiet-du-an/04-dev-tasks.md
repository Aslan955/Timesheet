# Việc cần báo dev: Chi tiết dự án, Form cấp mã, Lập PAKD

- **Căn cứ:**
  - `docs/srs/SRS_ChiTietDuAn.md` v02
  - `docs/srs/SRS_LapPAKD.md` v02
  - `docs/srs/SRS_DanhSachDuAn.md` v05
- **Đối soát với code commit `8cff07a`.** Mã gap theo `03-prototype-gaps.md`.
- **Việc đã xong ở 8cff07a, không cần làm nữa:** luồng điều chỉnh PAKD khi Đang thực hiện (P06); Pending và mở lại về đúng bước; SM tạo dự án và lập / sửa PAKD; kế hoạch chi phí theo tháng; popup Thêm khách hàng; PM outsource; Update PM.

## Ưu tiên 1: Làm ngược quyết định đã chốt
| # | Việc | Chỗ sửa | Nghiệm thu | Gap |
|---|---|---|---|---|
| 1 | **AM không lập và không xem PAKD.** Bỏ AM khỏi `canLapPakd`; ẩn form PAKD, tab PAKD, nội dung PAKD trên thanh thao tác với AM | BPC:38, PF:551, `StepActionBar`, `<PakdForm>` | PAKD BR1, BR2; CT AC6.4 | C05, P01 |
| 2 | **Lần gửi PAKD đầu không ghi số liệu dự án.** Bỏ `applyPakd` trong `savePakdForm` khi gửi; chỉ áp khi CFO duyệt (như bản điều chỉnh) | BPC `savePakdForm`, `decidePakd` | PAKD BR18, BR22; AC6.3, AC11.2 | P04 |
| 3 | **Lưu hợp đồng không ghi thẳng vào PAKD đã duyệt.** Bỏ ghi vào `pakdForm` trong `syncContractToPakd`. Sau khi CFO duyệt HĐ, điền thông tin HĐ vào bản điều chỉnh (`pakdDraft`, tạo mới nếu chưa có) và báo GĐK / SM | PK:273–292, BPC `saveContract` | PAKD BR22, AC11.5 | P09 |
| 4 | **Sửa dự án là màn hình riêng**, không phải popup. Giữ 2 tab Thông tin cơ bản / PAKD | `EditProjectModal` (BPP:1344) → view mới | CT BR22, AC5.2, AC9.1 (PAKD) | C13 |
| 5 | *Kết thúc dự án* chỉ GĐK của khối | `StepActionBar` (BPP:1227–1259) | CT BR13, AC13.1 | C10 |
| 5b | Dự án **Pending**: CFO **không** duyệt / từ chối PAKD được; bỏ nút *Duyệt / Từ chối PAKD* và câu "…hoặc duyệt PAKD đang chờ". CFO *Mở lại dự án* trước, sau đó mới duyệt | `StepActionBar` (nhánh Pending) | CT BR19; DS BR6, BR10 | C14 |

## Ưu tiên 2: Duyệt và trạng thái
| # | Việc | Chỗ sửa | Nghiệm thu | Gap |
|---|---|---|---|---|
| 6 | **Mọi hợp đồng phải được CFO duyệt** (popup, sửa, tạo từ PAKD) | `ContractModal`, `saveContract`, danh sách | DS BR31, BR35 | C09, P08 |
| 7 | Mã outsource: Mã SX.1…5, không dùng lại số; GĐK / Admin tạo; Admin tạo thì chờ GĐK duyệt; trạng thái; version +1 khi có hiệu lực; "Tạo mã outsource (n/5)" | BPC:324–331, `CodeTable` | CT BR11, BR12 | C04 |
| 8 | Đổi *Kết thúc* → **Close**; mở lại Close về Đang thực hiện; **Admin** cùng CFO mở lại | `BizStatus`, `finishProject`, `reopenProject`, `StepActionBar` | CT BR14; DS BR9, BR11 | C07 |
| 9 | *Xoá*: chỉ *Chờ duyệt mã*, người tạo / GĐK; xoá mềm | BPP:1576–1578, `deleteProject` | CT BR15 | C11 |
| 10 | GĐK **từ chối** yêu cầu mở mã (lý do bắt buộc) → xoá mềm, email người tạo | `StepActionBar` | CT BR5, AC9.4 | C08 |

## Ưu tiên 3: Quyền và dữ liệu
| # | Việc | Chỗ sửa | Nghiệm thu | Gap |
|---|---|---|---|---|
| 11 | Vai trò theo tài khoản; thêm BOD, Admin; GĐK chỉ khối mình; bỏ ô chọn Vai trò | `BIZ_ROLES`, `RoleSelect` | CT BR1, BR2 | C01 |
| 12 | *Sửa* và tài liệu: chỉ AM / SM / GĐK **của dự án**; khoá ở Pending / Close | Nút Sửa, tài liệu đính kèm | CT BR3, BR16 | C02 |
| 13 | Danh mục khách hàng dùng chung; lưu đủ các trường của popup | `customerList`, popup Thêm khách hàng | CT BR7, AC3.4 | C03 |
| 14 | **Khối Phiên bản PAKD** dưới form (ngăn Quy trình đã bỏ); xem lại phiên bản cũ ở chế độ chỉ đọc | PF | PAKD BR20, AC10 | P07 |

## Ưu tiên 4: Hiển thị và kiểm tra
| # | Việc | Chỗ sửa | Nghiệm thu | Gap |
|---|---|---|---|---|
| 15 | **Sửa lỗi số phiên bản hiển thị:** nút "Lập lại PAKD V…", cột "Làm lại V…", các toast phải dùng `nextPakdVersion`; bỏ / sửa `submitPakd` cũ | BPP:213, 217, 225, 301, 1214; BPC:882 | PAKD BR20, AC8.3 | P05 |
| 16 | Kiểm tra Từ / Đến của giai đoạn (Chưa ký) | `validatePakd` | PAKD BR17 | P03 |
| 17 | Thanh thao tác: thêm dòng HĐ / mã outsource chờ duyệt | `StepActionBar` | CT BR19 | C06 |
| 18 | Câu chữ: "GĐK / SM lập PAKD" (hướng dẫn, chú thích form); bỏ "Chọn vai trò AM, SM hoặc GĐK…" | BPP:2029, PF:672–674 | CT mục 5, PAKD BR3 | C12, P02 |
