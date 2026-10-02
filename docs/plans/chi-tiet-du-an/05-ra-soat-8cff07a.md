# Rà soát code mới: commit `d8a9358` → `8cff07a` (2026-10-02)

- **3 commit mới:** `85e914d`, `a22d8a0`, `8cff07a`. Đã merge vào nhánh `docs/danh-sach-du-an-v02` (merge commit `6519f4c`).
- **9 file thay đổi** (+1.280 / −429 dòng), chủ yếu ở `BusinessProjectPage.tsx`, `PakdForm.tsx`, `pakd.ts`, `BusinessProjectContext.tsx`.
- **Đối chiếu với:** SRS_DanhSachDuAn v04, SRS_ChiTietDuAn v01, SRS_LapPAKD v01.

## 1. Code đã sửa đúng theo SRS (đóng hoặc đóng một phần gap)
| Thay đổi | Gap liên quan | Còn thiếu |
|---|---|---|
| Thêm vai trò **SM** (nhãn "Giám đốc kinh doanh (SM)"). SM tạo dự án, lập PAKD lần đầu | DS GAP-01, C01 | Chưa có BOD, Admin. Vẫn chọn vai trò tay trên màn |
| Trạng thái *Đóng* → **Pending**. Quá 30 ngày mà chưa có PAKD được duyệt (gồm cả đang chờ CFO) thì chuyển Pending. Mở lại về đúng trạng thái trước (chờ duyệt / chưa có PAKD), hạn +30 ngày | DS GAP-03, GAP-04, C07 | Vẫn còn *Kết thúc*, chưa có **Close**. Chỉ CFO mở lại (chưa có Admin) |
| Số phiên bản PAKD trong dữ liệu = số bản đã duyệt + 1, nên **nộp lại sau khi bị từ chối vẫn là V1** | DS GAP-11, P05 | **Lỗi hiển thị:** nút "Lập lại PAKD V{n+1}", cột "Làm lại V{n+1}" và toast vẫn hiện số tăng |
| **Điều chỉnh PAKD khi Đang thực hiện:** có bản điều chỉnh (nháp / chờ / bị từ chối), huỷ được; số liệu dự án chỉ đổi khi CFO duyệt; dự án giữ Đang thực hiện; popup duyệt hiện so sánh cũ → mới; CFO có nút *Duyệt điều chỉnh* trên danh sách | DS GAP-08, P06 | Quyền điều chỉnh là **GĐK và SM** (SRS: chỉ GĐK) → câu hỏi Q1 |
| Nút *Sửa* chỉ hiện với AM / SM / GĐK | C02 | Chưa khoá ở Pending / Kết thúc |
| Ẩn nút *Kết thúc dự án* khi có bản điều chỉnh chờ CFO | C10 | Vẫn mọi vai trò kết thúc được |
| Sổ theo dõi: *Chưa ký* loại dự án Pending | DS BR17 | — |

## 2. Thay đổi mới chưa có trong SRS (cần BA quyết định)
| # | Thay đổi | Ảnh hưởng tài liệu |
|---|---|---|
| N1 | **Gỡ ngăn Quy trình** (`WorkflowDrawer`) khỏi màn Chi tiết. Thanh thao tác (`StepActionBar`) đảm nhận việc báo bước hiện tại và chứa nút thao tác (Lập / Sửa PAKD, Duyệt, Kết thúc, Mở lại) | SRS_ChiTietDuAn US8, BR20, BR21, mục 5 |
| N2 | **Sửa dự án bằng popup** "Sửa dự án — {mã} · {tên}", 2 tab: *Thông tin cơ bản* (AM / SM / GĐK) và *Phương án kinh doanh (PAKD)* (SM / GĐK). Bỏ trang sửa toàn màn hình | SRS_ChiTietDuAn mục 1, US5, mục 5 |
| N3 | **Khu Mã dự án** chuyển lên trên thanh thao tác, hiện ở mọi tab. Bố cục 2 cột: Mã dự án / KD / SX / outsource \| Tên dự án (kèm KEY) / PM KD / PM SX / PM outsource. Trên Form tạo mới, Tên dự án và nút KEY chuyển từ thanh tiêu đề vào khu này | SRS_ChiTietDuAn mục 1, mục 5 |
| N4 | Trường mới **PM outsource** khi tạo dự án, được gán mặc định cho mã outsource khi tạo. Khi sửa, đổi PM qua nút **"Update PM"** | SRS_ChiTietDuAn BR11, BR12, BR17, mục 4.3, mục 5 |
| N5 | **Popup Thêm khách hàng:** Tên\*, Nội bộ (ô tích), **Mã KH\* đúng 3 ký tự chữ / số** (tự viết hoa, bỏ khoảng trắng), Địa chỉ, Email (kiểm tra định dạng), Số điện thoại, Mô tả. Chỉ mã và tên được lưu vào dự án | SRS_ChiTietDuAn BR7, US3, mục 4.1, mục 5 |
| N6 | **PAKD Đã ký, mục 4 đổi thành "Kế hoạch chi phí theo tháng":** lưới khoản mục × tháng trong kỳ (Bắt đầu → Kết thúc; chưa có thì tạm 12 tháng năm hiện tại); 2 khối A (SX) / B (KD); **8 khoản mục mặc định**; nút **÷ Chia đều** (làm tròn xuống nghìn đồng, phần dư dồn tháng cuối); dòng *Luỹ kế chi phí*; tô vàng tháng ngoài kỳ. Thêm 2 lỗi kiểm tra mới | SRS_LapPAKD US2, BR6, BR10, BR12, BR17, mục 4.3, mục 5 |
| N7 | **Đổi Chưa ký → Đã ký** trong form: tự điền giá trị HĐ, kỳ thực hiện; chuyển các giai đoạn thành khoản chi phí chia đều theo tháng. Khi điều chỉnh bản đã duyệt là Đã ký thì không chọn lại được Chưa ký | SRS_LapPAKD BR5 |
| N8 | **Lưu hợp đồng tự ghi thông tin HĐ xuống PAKD** (cả bản đã duyệt và bản điều chỉnh), không qua CFO duyệt | Mâu thuẫn nguyên tắc "thay đổi PAKD phải được duyệt" và quyết định C20 / D31 → câu hỏi Q4 |
| N9 | PAKD: hàng thông tin chung còn 4 ô (bỏ Mã, Tên, Khối). Biểu đồ Chưa ký đổi từ đường sang cột. Ô tháng tự chèn "/" | SRS_LapPAKD mục 5 |

## 3. Vẫn chưa sửa (gap giữ nguyên)
- AM vẫn **lập được PAKD lần đầu** (DS GAP-16, C05, P01).
- **Nộp PAKD lần đầu vẫn ghi đè số liệu dự án và hợp đồng ngay** (DS GAP-17, P04, P08). Bản điều chỉnh thì đã đúng.
- Mã outsource vẫn `.3` / `.4`, tối đa 2, ai cũng tạo, không duyệt, dùng lại số (C04, DS GAP-18).
- Hợp đồng vẫn **không qua CFO duyệt** (C09, DS GAP-20).
- Ai cũng **xoá** và **kết thúc** dự án được; xoá vẫn là xoá hẳn (C10, C11).
- Không có GĐK từ chối yêu cầu mở mã (C08).
- Danh sách: chưa khôi phục bộ lọc Hợp đồng (GAP-15); nút *Đặt mục tiêu* vẫn nhập tay (GAP-02); AM vẫn thấy cột PAKD (GAP-05).
- Danh mục khách hàng vẫn chỉ lưu tạm trong form (C03).

## 4. Quyết định của BA và tài liệu đã cập nhật
- Q1: GĐK **và SM** được sửa / điều chỉnh PAKD (C21).
- Q2: Bỏ ngăn Quy trình (C22).
- Q3: Sửa dự án là **màn hình riêng**, không phải popup (C23). Code hiện là popup, nên ghi thành gap C13.
- Q4: Mọi hợp đồng tạo / cập nhật phải được duyệt; không ghi thẳng vào PAKD đã duyệt (C24). Ghi thành gap P09 / GAP-21.
- Q5: Chấp nhận các thay đổi N5–N9 (C25).

Đã cập nhật: SRS_LapPAKD **v02**, SRS_ChiTietDuAn **v02**, SRS_DanhSachDuAn **v05**, `03-prototype-gaps.md` và `04-dev-tasks.md` của cả hai thư mục.
