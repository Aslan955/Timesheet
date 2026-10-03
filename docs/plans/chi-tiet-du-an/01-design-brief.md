# Design Brief: Chi tiết dự án + Form cấp mã (kèm Lập PAKD)

> Brief này được **dựng ngược từ prototype** ở commit `d8a9358`. Các file nguồn:
> - `src/components/BusinessProjectPage.tsx`: `ProjectForm`, `ProjectDetail`, `CodeTable`, `StepActionBar`, `ContractPanel`, `PakdDecisionModal`
> - `src/components/PakdForm.tsx` và `src/business/pakd.ts`
> - `src/components/WorkflowDrawer.tsx`, `src/components/ContractModal.tsx`
> - `src/business/BusinessProjectContext.tsx`
>
> **Phải tuân theo các quyết định đã chốt ở SRS Danh sách dự án** (`docs/plans/danh-sach-du-an/02-plan.md`, D1–D29). Mục 5 dưới đây tóm tắt các quyết định đó.

## 1. Bối cảnh
- Màn *Danh sách dự án* có 3 chế độ: Danh sách, **Form cấp mã / sửa dự án**, và **Chi tiết dự án**.
- SRS Danh sách dự án đã tách hai chế độ sau ra SRS riêng. Brief này phân tích hai chế độ đó.
- Từ commit `d8a9358`, màn Chi tiết có thêm **form Lập PAKD trên hệ thống**, thay cho việc import kế hoạch theo tháng từ Excel như trước.

## 2. Form cấp mã / Sửa dự án (`ProjectForm`)
- **Tạo mới:**
  - Tiêu đề "Yêu cầu mở mã dự án".
  - Có ô nhập tên dự án và nút đánh dấu **KEY** (dự án trọng điểm) ngay trên thanh tiêu đề.
  - Có hộp "Hướng dẫn quy trình".
  - Nút chính:
    - GĐK thấy **"Tạo & cấp mã"**: mã được cấp ngay, bắt đầu đếm hạn PAKD 30 ngày.
    - AM thấy **"Gửi GĐK duyệt"**: dự án vào trạng thái *Chờ duyệt mã*.
- **Sửa:**
  - Nút "Lưu thay đổi". Mỗi lần lưu, **Version dự án** tăng 1 (v{n} → v{n+1}).
  - Version này khác phiên bản PAKD.
- **Khu Mã dự án:**
  - Mã tổng, Mã KD, Mã SX hiển thị "Tự sinh sau khi GĐK duyệt".
  - Có ô chọn PM KD và PM SX.
  - Mã outsource chỉ tạo được ở màn Chi tiết.
- **Thông tin chi tiết:** Khối\*, Loại dự án\* (5 loại), Tên khách hàng\*, Mã KH, Thời gian từ – đến, Giám đốc kinh doanh, Giám đốc khối, AM (nhiều người), Người tạo, Ghi chú.
  - Khách hàng chọn từ danh sách các khách hàng đã có trong dự án, hoặc thêm mới ngay trên form (mã KH + tên, kiểm tra trùng mã).
  - Danh sách người (GĐKD, GĐK, AM, PM) lấy từ các dự án đã có. Chưa có danh mục nhân sự riêng.
- **Hợp đồng & tài liệu:** hợp đồng hiển thị "Chưa ký", kèm ghi chú "Cập nhật ký hợp đồng trên màn chi tiết sau khi dự án được cấp mã". Đính kèm được tài liệu ngay lúc tạo.
- **Kiểm tra dữ liệu:**
  - Bắt buộc: tên dự án, khối, loại dự án, khách hàng.
  - Ngày kết thúc phải sau ngày bắt đầu.
  - Lỗi được tổng hợp trong hộp "Còn N thông tin cần bổ sung".

## 3. Chi tiết dự án (`ProjectDetail`)
- **Thanh tiêu đề:**
  - Tên dự án + nhãn KEY.
  - Nút: Vai trò, Quy trình (ẩn / hiện), Quay lại, **Sửa**, **Xoá**.
  - Thông tin phụ: Mã dự án, Version, Trạng thái, Khối, PAKD, Cập nhật.
- **Thanh thao tác bước hiện tại (`StepActionBar`):** thông báo vàng kèm nút theo trạng thái × vai trò:
  - *Duyệt mã dự án* (GĐK).
  - *Lập PAKD / Lập lại PAKD V{n+1}* (AM, GĐK).
  - *Duyệt / Từ chối PAKD* (CFO).
  - *Mở lại dự án* (CFO, khi dự án *Đóng*).
  - Vai trò không có thao tác thì thấy "Đang chờ …".
- **Tab Thông tin dự án:**
  - **Mã dự án:** Mã tổng / KD / SX kèm PM phụ trách. Thêm được tối đa **2 mã outsource** (Master.3, .4); mỗi mã chọn PM, có thể xoá. Mã outsource chỉ tạo được sau khi có mã tổng.
  - **Thông tin chi tiết dự án:** chỉ đọc.
  - **Hợp đồng & tài liệu:**
    - Tình trạng Đã ký / Chưa ký, số HĐ, ngày ký, thời hạn.
    - Nút *Cập nhật ký hợp đồng* / *Bổ sung thông tin HĐ* / *Xem / cập nhật hợp đồng*, mở popup hợp đồng.
    - Danh sách tài liệu đính kèm, thêm / xoá được (không tăng version).
  - **Lập phương án kinh doanh (PAKD):** hiển thị khi dự án đã qua bước duyệt mã. Xem mục 4.
  - **Thông tin hợp đồng** (`ContractPanel`): hiển thị khi đã có hợp đồng, gồm phụ lục và tệp.
- **Tab Lịch sử:** STT, Thời gian, Người thực hiện, Thao tác, Ghi chú. Mới nhất ở trên.
- **Ngăn Quy trình (`WorkflowDrawer`), bên phải:**
  - 6 bước: Lập yêu cầu mở mã → GĐK phê duyệt → Khối cập nhật PAKD → Kế toán duyệt PAKD → Thực hiện dự án → Kết thúc. Nhánh đóng là 1 → 2 → 3 → Đóng dự án.
  - Trạng thái từng bước: xong / hiện tại / chưa đến / đóng. Có nút thao tác trên bước hiện tại.
  - Khối *Theo dõi lập PAKD* (ngày cấp mã, hạn) và khối *Phiên bản PAKD*.
  - Nhớ trạng thái mở / ẩn và độ rộng (300–620px) trên trình duyệt.
- **Khu "Số liệu theo tháng"** (kế hoạch / thực tế, import Excel) **đã bị bỏ khỏi màn Chi tiết** ở commit `d8a9358`. Code `FinanceSection` và `PhaseStepper` vẫn còn nhưng không được hiển thị.

## 4. Form Lập PAKD (`PakdForm`): tóm tắt
- **Sửa được** khi dự án *Chưa có PAKD* và vai trò là AM hoặc GĐK. Các trường hợp khác chỉ xem.
- **Thông tin chung** (chỉ đọc): mã, tên, khối, người lập, hạn lập PAKD, thời gian còn lại, trạng thái PAKD.
- **Hai biến thể** theo *Tình trạng dự án*:
  - **Đã ký:**
    1. Thông tin HĐ: số, ngày ký trên HĐ, ngày ký thực tế, giá trị\*.
    2. Tiến độ: bắt đầu\*, kết thúc\*, số tháng, phạm vi\*.
    3. Mốc nghiệm thu: %, giá trị, tỷ lệ thanh toán, giá trị thu, tháng gửi hồ sơ, thời gian chờ, tháng thu tiền. Tổng % phải bằng 100.
    4. Chi phí theo 6 nhóm: SX, KD, Dự phòng SX / KD, Thưởng SX / KD.
  - **Chưa ký:**
    1. Thời điểm dự kiến ký\*, giá trị dự kiến\*, xác suất thành công, phạm vi\*, đánh giá rủi ro\*.
    2. Mốc kế hoạch theo giai đoạn: từ – đến, tổng mức đầu tư SX / KD, kết quả đầu ra.
- **Bảng điều khiển:**
  - Doanh thu kế hoạch, Lợi nhuận, Biên lợi nhuận. Biên LN chuẩn tối thiểu là **20%**, dưới mức này chỉ cảnh báo.
  - Biểu đồ luỹ kế dòng tiền (Đã ký) hoặc dòng tiền chi theo tháng (Chưa ký).
  - Bảng tóm tắt chi phí.
  - Đối chiếu giá trị HĐ, cảnh báo khi lệch quá **2%**.
- **Nút:**
  - *Lưu nháp*: không kiểm tra dữ liệu.
  - *Gửi Kế toán duyệt*: kiểm tra dữ liệu (9 thông báo lỗi), rồi tạo phiên bản V(n+1) ở trạng thái chờ CFO.
- **Kế hoạch theo tháng** được sinh tự động từ PAKD:
  - Đã ký: doanh thu theo mốc, dòng thu theo tháng thu tiền, chi phí theo tháng.
  - Chưa ký: chi phí giai đoạn chia đều cho các tháng.
  - Khối lượng công việc luôn bằng 0.

## 5. Quyết định đã chốt (từ SRS Danh sách dự án), bắt buộc áp dụng
| Mã | Nội dung |
|---|---|
| D7 | Quy trình: AM / SM / GĐK tạo dự án → GĐK duyệt mã (bỏ qua nếu GĐK tạo) → GĐK hoặc SM lập PAKD → chỉ **CFO** duyệt → Đang thực hiện. BOD chỉ xem |
| D8 | 6 trạng thái: Chờ duyệt mã, Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, Pending, Close |
| D9, D16 | Vai trò: AM, SM, GĐK, CFO, BOD, Admin |
| D10, D27 | AM chỉ tạo dự án, **không lập và không xem PAKD**. SM tạo dự án và lập PAKD |
| D13 | Bị từ chối thì sửa trên **cùng phiên bản**. Phiên bản mới chỉ sinh khi điều chỉnh PAKD đã duyệt (dự án Đang thực hiện, chỉ CFO duyệt lại) |
| D14, D19 | Quá 30 ngày từ ngày cấp mã mà PAKD chưa được duyệt → Pending. Tác vụ chạy 00:00 |
| D15, D16 | Mở lại Pending / Close: CFO hoặc Admin. Pending về trạng thái cũ, hạn mới +30 ngày. Close về Đang thực hiện |
| D17 | Pending / Close: không ai sửa được gì |
| D20 | Email nhắc khi còn 3 ngày, gửi GĐK và SM |
| D21 | Chỉ kết thúc dự án khi không còn PAKD điều chỉnh chờ CFO |
| D26 | Số liệu PAKD chỉ ghi vào dự án khi **CFO duyệt** |
| D28 | Mã outsource Master.3 / .4, tối đa 2 mã |
| D29 | Lệch giá trị HĐ quá 2%: chỉ cảnh báo |

## 6. Điểm lệch giữa prototype và các quyết định trên
| # | Vị trí | Prototype hiện tại | Theo quyết định |
|---|---|---|---|
| G1 | Form PAKD, Quy trình bước 3, `StepActionBar` | AM và GĐK lập PAKD | GĐK và SM lập. AM không thấy PAKD |
| G2 | Nút "Lập lại PAKD V{n+1}" | Bị từ chối thì tạo phiên bản mới | Giữ nguyên phiên bản |
| G3 | Gửi Kế toán duyệt | Ghi đè số liệu dự án (và tạo hợp đồng) ngay lúc nộp | Chỉ ghi khi CFO duyệt |
| G4 | Form PAKD khi Đang thực hiện | Chỉ xem, không có cách điều chỉnh | Cho điều chỉnh, sinh phiên bản mới, CFO duyệt |
| G5 | Ngăn Quy trình, nhánh đóng | Trạng thái *Đóng* / *Kết thúc*, chỉ CFO mở lại | Pending / Close, CFO hoặc Admin mở lại |
| G6 | Nút *Kết thúc dự án* (bước 5) | **Mọi vai trò** bấm được, chỉ hỏi xác nhận | Cần quy định vai trò (câu hỏi Q3), chặn khi còn PAKD điều chỉnh chờ CFO |
| G7 | Nút *Sửa*, *Xoá*, *Cập nhật thông tin*, *Lập PAKD →* | Không giới hạn vai trò / trạng thái | Cần quy định (câu hỏi Q2) |
| G8 | Mã outsource | Ai cũng tạo / xoá được | Cần quy định (câu hỏi Q5) |
| G9 | Thông tin trong ngăn Quy trình | Bước 3 luôn ghi vai trò "GĐK". Câu "import kế hoạch… Nộp PAKD" là văn bản cũ | Sửa câu chữ |
| G10 | Số liệu theo tháng | Đã bỏ khỏi Chi tiết. Không còn nơi xem kế hoạch / thực tế theo tháng của dự án | Câu hỏi Q4 |
