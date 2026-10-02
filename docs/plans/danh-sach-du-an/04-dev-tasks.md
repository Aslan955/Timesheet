# Việc cần báo dev: Danh sách dự án

- **Căn cứ:** `docs/srs/SRS_DanhSachDuAn.md` **v02** (gồm cả mã outsource) và `03-prototype-gaps.md`, đối soát theo code commit `d8a9358`.
- **Cách đọc:** mỗi việc ghi rõ chỗ sửa trong code và điều kiện nghiệm thu theo AC / BR của SRS.

## Ưu tiên 1: Sửa các điểm commit d8a9358 đi ngược SRS
| # | Việc | Chỗ sửa | Nghiệm thu |
|---|---|---|---|
| 1 | **Khôi phục bộ lọc Hợp đồng** *Tất cả / Đã ký (n) / Chưa ký (n)* trên khung Danh sách dự án | `BusinessProjectPage.tsx` → `ProjectList` (`contractFilter`, `signedCount`, `unsignedCount`) | AC4.2, AC4.3, BR22: số đếm tính theo các điều kiện lọc còn lại |
| 2 | **AM chỉ tạo dự án, không lập PAKD.** **SM tạo dự án và lập PAKD.** Chỉ GĐK và SM được lập / nộp PAKD. AM không thấy PAKD: form, thanh thao tác, cột Hạn / Phiên bản PAKD | `WorkflowDrawer.tsx` (nút Lập PAKD), `StepActionBar`, `PakdForm`; thêm vai trò SM vào `BIZ_ROLES` | BR3, BR6, AC5.4, AC12.3 |
| 3 | **Bị CFO từ chối thì sửa và nộp lại trên cùng phiên bản.** Bỏ nút "Lập lại PAKD V{n+1}", đổi thành "Sửa PAKD V{n}" | `savePakdForm`, `submitPakd`, `WorkflowDrawer`, `StepActionBar` | BR7, AC13.5: phiên bản mới chỉ sinh khi điều chỉnh PAKD đã duyệt |
| 4 | **Số liệu PAKD chỉ ghi vào dự án khi CFO duyệt.** Lúc lưu nháp / nộp chỉ lưu `pakdForm` | `savePakdForm` → chuyển phần ghi `expectedRevenue`, chi phí, `expectedSignDate`, `plan`, `contractSigned`, `contract` sang `decidePakd` (khi approve) | BR34, AC13.7: nộp xong, danh sách và Sổ theo dõi chưa đổi số |

## Ưu tiên 2: Vòng đời và quyền
| # | Việc | Chỗ sửa | Nghiệm thu |
|---|---|---|---|
| 5 | Vai trò lấy theo tài khoản; thêm SM, BOD, Admin; lọc dự án theo phạm vi xem | `BIZ_ROLES`, `RoleSelect`, `ProjectList` | BR1, BR2, AC5.3 |
| 6 | 6 trạng thái: bỏ *Kết thúc*, *Đóng*; thêm *Pending* (cam), *Close* (xám đậm); đổi dữ liệu mẫu | `BizStatus`, `BIZ_STATUSES`, `STATUS_CLS`, seed | Mục 1, BR11, BR33 |
| 7 | Tác vụ 00:00: quá hạn 30 ngày mà PAKD chưa được duyệt thì chuyển Pending, lưu trạng thái trước đó. CFO / Admin mở lại: về trạng thái cũ, hạn mới +30 ngày. Kết thúc → Close (chặn khi còn PAKD điều chỉnh chờ CFO). Mở lại Close → Đang thực hiện | `useEffect` tự đóng, `reopenProject`, `finishProject`, `pakdDeadlineCell`, `StepActionBar` | BR8–BR11, AC6.4, AC12.5 |
| 8 | Cột *Thao tác* theo ma trận 6 vai trò | `rowAction` | Ma trận mục 1, AC12.1 |
| 9 | Khoá mọi chỉnh sửa khi dự án Pending / Close | `ProjectList`, `ProjectDetail`, `ContractModal` | BR10, AC12.6 |

## Ưu tiên 3: Số liệu và hiển thị
| # | Việc | Chỗ sửa | Nghiệm thu |
|---|---|---|---|
| 10 | Nút *Đặt mục tiêu* chuyển sang màn Mục tiêu kinh doanh; bỏ `TargetModal` | `ProjectTracker.tsx` | BR15, AC2 |
| 11 | Sổ theo dõi và cột hợp đồng chỉ tính theo hợp đồng đã nhập; nhãn "Chưa nhập HĐ"; thống nhất công thức ô tổng | `signedValue`, `signedDate`, `trackerRows`, ô tổng, nhóm cột HĐ | BR16–BR18, BR30 |
| 12 | Ẩn Sổ theo dõi với AM / SM; ẩn 2 cột PAKD và cột PAKD trong file xuất với AM; file xuất thêm Mã KD, Mã SX, **Mã outsource**, Ngày cấp mã; ô tìm kiếm khớp cả **mã outsource** (không thêm cột trên màn) | `ProjectList` (`base`), `exportXlsx` | BR3, BR4, BR12, BR21, BR24 |
| 13 | Quyền cập nhật hợp đồng (AM / SM / GĐK của dự án, đã có mã, không Pending / Close) và chế độ chỉ xem. **Bỏ bắt buộc lý do lệch**: lệch quá 2% chỉ cảnh báo, vẫn cho lưu | Liên kết *Đã ký / Chưa ký*, `ContractModal` | BR26, AC14.1, AC14.6 |
| 14 | Popup duyệt: tiêu đề "CFO duyệt PAKD — V{n}", câu chữ "trả về GĐK / SM chỉnh sửa, giữ nguyên phiên bản" | `PakdDecisionModal`, `decide` | BR6, mục 5 |

## Ưu tiên 4
| # | Việc | Chỗ sửa | Nghiệm thu |
|---|---|---|---|
| 15 | Điều chỉnh PAKD khi Đang thực hiện: phiên bản có hiệu lực, cột "V2, chờ CFO · hiệu lực V1" | `PakdVersion`, `pakdVersionText`, `PakdDecisionModal` | BR7, BR14, AC6.3 |
| 16 | Email nhắc hạn PAKD khi còn 3 ngày cho GĐK và SM (prototype có thể chỉ mô phỏng bằng thông báo trong ứng dụng) | Tác vụ hằng ngày | BR32, AC6.5 |
