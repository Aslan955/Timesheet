# Design Brief: Mục tiêu kinh doanh (Business Target)

> Brief này được **dựng ngược từ prototype** (`src/components/BizTargetPage.tsx`, `src/components/ProjectTracker.tsx`, `src/business/BusinessProjectContext.tsx`) — chưa qua phiên refinement với BA. Các mục đánh dấu ❓ là điểm cần BA xác nhận (xem mục 8).

## 1. Bối cảnh & vị trí
- Module: **Quản trị dự án & Tài chính** (Project Management) → menu **Mục tiêu kinh doanh** (màn mặc định khi vào hệ thống).
- Mục đích: Giám đốc khối (GĐK) đăng ký mục tiêu **giá trị HĐ ký mới** và **lợi nhuận gộp** của năm kế hoạch, chi tiết theo khách hàng / dự án; BOD phê duyệt; bản đã duyệt trở thành **mục tiêu chính thức của khối**.
- Đầu ra nghiệp vụ: Tổng giá trị mục tiêu đã duyệt được ghi vào **Sổ theo dõi dự án** (đầu màn *Danh sách dự án*) để so sánh với giá trị HĐ đã ký / chưa ký.

## 2. Vai trò
| Vai trò | Việc làm |
|---|---|
| GĐK (Giám đốc khối) | Lập, lưu nháp, sửa, gửi duyệt hồ sơ mục tiêu khối mình theo năm |
| BOD | Xem danh sách hồ sơ, xem chi tiết (chỉ đọc), phê duyệt / từ chối kèm ý kiến |
| Người xem Sổ theo dõi (GĐK, BOD, Kế toán…) | Đọc mục tiêu chính thức để theo dõi tiến độ ký HĐ |

## 3. Đối tượng dữ liệu chính
- **Hồ sơ mục tiêu** (`TargetPlan`) — khoá nghiệp vụ *(Khối, Năm)*: người lập, phiên bản, trạng thái, ý kiến BOD, bản đã gửi gần nhất.
- **Dòng đăng ký** (`TargetRow`): Khách hàng, Tên dự án, Tháng ra thầu, Tháng ký HĐ, HĐ ký mới (triệu VNĐ), LN gộp mục tiêu (triệu VNĐ), Cơ sở đăng ký / thuyết minh. % LN gộp tính tự động.
- **Lịch sử** (`TargetLog`): thời gian, người, thao tác, phiên bản, danh sách nội dung điều chỉnh (diff), ý kiến.
- **Mục tiêu ký HĐ theo khối/năm** (`targets[year][division]`, đơn vị VNĐ) — dùng ở Sổ theo dõi dự án.

## 4. Luồng chính (theo prototype)
1. GĐK chọn Khối + Năm kế hoạch (chỉ năm hiện tại và năm sau; quý 4 mặc định năm sau) → hệ thống nạp hồ sơ có sẵn hoặc tạo hồ sơ trống.
2. *(Prototype)* Hệ thống kiểm tra kỳ lập / điều chỉnh (T12/N cho năm N+1; T3/6/9/12) — **to-be: bỏ, xem A1.**
3. GĐK thêm/sửa/xoá dòng; xem tổng hợp KPI (Tổng giá trị, LN gộp, % LN gộp — xanh khi ≥ 20%), biểu đồ cột theo khách hàng hoặc theo tháng ký HĐ, bảng chi tiết theo khách hàng.
4. **Lưu nháp** (không validate) hoặc **Gửi BOD duyệt** (validate: ≥ 1 dòng; mỗi dòng đủ Khách hàng, Tên dự án, Ký HĐ, HĐ ký mới > 0; LN gộp ≤ HĐ ký mới).
5. Hồ sơ *Chờ BOD duyệt* → GĐK không sửa được.
6. BOD mở tab *BOD phê duyệt* (badge số hồ sơ chờ), danh sách ưu tiên hồ sơ chờ duyệt → mở hồ sơ → nhập ý kiến → **Phê duyệt** (ý kiến tuỳ chọn) / **Từ chối** (ý kiến bắt buộc, không chấp nhận khoảng trắng).
7. Phê duyệt → ghi `Tổng HĐ ký mới × 1.000.000` vào mục tiêu khối/năm của Sổ theo dõi dự án.
8. Hồ sơ *Đã duyệt / Từ chối* được sửa lại → **tăng phiên bản**, trạng thái quay về *Bản nháp*; mọi lần lưu/gửi/duyệt/từ chối ghi lịch sử kèm diff.

## 5. Vòng đời trạng thái
**Prototype hiện tại:** `Bản nháp` → (Gửi) → `Chờ BOD duyệt` → (Duyệt) → `Đã duyệt` | (Từ chối) → `Từ chối`; `Đã duyệt`/`Từ chối` → (GĐK sửa & lưu) → `Bản nháp` (phiên bản +1).

**To-be (theo quyết định BA, mục 8):**
- `Bản nháp` → (GĐK gửi) → `Chờ BOD duyệt`
- `Chờ BOD duyệt` → (BOD duyệt) → `Đã duyệt` · (BOD từ chối) → `Từ chối` · (BOD trả lại) → `Trả lại bổ sung` · (GĐK rút) → `Đã rút`
- `Từ chối` / `Đã rút` → GĐK sửa & gửi lại **bất cứ lúc nào** (không phụ thuộc kỳ)
- `Đã duyệt` → GĐK điều chỉnh bất cứ lúc nào → phiên bản mới → `Chờ BOD duyệt`; mục tiêu chính thức giữ bản đã duyệt cũ đến khi bản mới được duyệt
- Mỗi lần chuyển trạng thái → gửi thông báo cho bên liên quan

## 6. Phạm vi
- **Trong phạm vi SRS:** 2 tab (GĐK lập mục tiêu, BOD phê duyệt), kỳ lập/điều chỉnh, phiên bản & lịch sử, tích hợp sang Sổ theo dõi dự án.
- **Ngoài phạm vi:** "Chế độ thử: bỏ qua khoá kỳ" (chỉ phục vụ demo); SRS các màn Danh sách dự án, Kế hoạch thu chi (chỉ tham chiếu); mục 6–8 template v04.

## 7. Phát hiện từ prototype (gap / rủi ro nghiệp vụ)
| # | Phát hiện | Tác động |
|---|---|---|
| G1 | Sổ theo dõi dự án vẫn có nút **"Đặt mục tiêu"** cho nhập tay → ghi đè cùng dữ liệu với BOD phê duyệt | Hai nguồn sự thật cho mục tiêu khối |
| G2 | GĐK chọn được **mọi khối** (không giới hạn theo khối của mình); người dùng đang hard-code | Thiếu ma trận phân quyền |
| G3 | Chỉ **giá trị HĐ** được ghi nhận chính thức; **LN gộp mục tiêu** không chuyển đi đâu | Không đo được LN gộp thực tế vs mục tiêu |
| G4 | Khi hồ sơ đã duyệt đang được điều chỉnh (Bản nháp v+1), mục tiêu chính thức vẫn là bản cũ — chưa được mô tả rõ | Cần quy tắc "bản hiệu lực" |
| G5 | Không validate **tháng ký HĐ thuộc năm kế hoạch**, **ra thầu ≤ ký HĐ**, trùng dự án | Dữ liệu sai năm lọt vào tổng |
| G6 | GĐK không **rút lại** hồ sơ đang chờ duyệt; BOD không có "trả lại để bổ sung" khác "từ chối"; không có thông báo | Luồng phê duyệt cứng |
| G7 | Khách hàng là **text tự do** (gợi ý từ dự án + hồ sơ) — chưa liên kết danh mục khách hàng | Gom nhóm theo khách hàng dễ lệch tên |
| G8 | Lệch đơn vị: màn mục tiêu dùng **triệu VNĐ**, Sổ theo dõi dùng **VNĐ** | Cần quy tắc quy đổi trong BR |
| G9 | Tháng 12 vừa là kỳ lập năm N+1 vừa là kỳ điều chỉnh Q4 năm N; kỳ điều chỉnh Q4 có ý nghĩa thực tế không | Cần chốt lịch kỳ |
| G10 | Mục tiêu (HĐ ký mới) và **Kế hoạch thu chi** (doanh thu/thu/chi theo tháng) cùng do GĐK lập nhưng không liên kết | Cần làm rõ quan hệ hai kế hoạch |

## 8. Quyết định của BA (2026-10-02)
1. ✅ G1: Sửa mục tiêu ở **bất kỳ nguồn nào** (màn Mục tiêu kinh doanh hay nút "Đặt mục tiêu" ở Sổ theo dõi) đều phải **BOD duyệt lại** mới có hiệu lực.
2. ✅ G2: GĐK **chỉ được chọn khối của mình**.
3. ✅ G3: LN gộp mục tiêu **tạm thời không cần** đưa sang màn khác — chỉ hiển thị trong màn Mục tiêu kinh doanh.
4. ✅ G4: Trong lúc điều chỉnh, mục tiêu chính thức **vẫn là bản đã duyệt gần nhất** cho đến khi BOD duyệt phiên bản mới.
5. ✅ G6: Bổ sung vào SRS (yêu cầu mới, chưa có trên prototype): **GĐK rút hồ sơ** đang chờ duyệt, **BOD trả lại để bổ sung** (khác Từ chối), **gửi thông báo**. Không bổ sung kiểm tra tháng ký HĐ (G5) — giữ validate như prototype.
6. ✅ G9: Hồ sơ **Từ chối** hoặc **Đã rút (cancel)** luôn được sửa và gửi lại, **không theo kỳ**.

### Xác nhận giả định (2026-10-02)
- ✅ A1 (đổi): **Không có kỳ lập / kỳ điều chỉnh, không khoá theo tháng.** Hồ sơ lập theo **năm kế hoạch**; tháng Ra thầu / Ký HĐ của từng dòng chọn trong 12 tháng của năm đó. GĐK lập và điều chỉnh lúc nào cũng được; chỉ khoá khi hồ sơ đang *Chờ BOD duyệt*; mọi điều chỉnh hồ sơ đã duyệt đều qua BOD duyệt lại.
- ~~A2~~: không còn áp dụng — *Trả lại bổ sung* đã gộp vào *Từ chối* (xem A6).
- ✅ A6 (2026-10-02): **Gộp *Trả lại bổ sung* và *Từ chối* thành một trạng thái *Từ chối*.** BOD chỉ có Phê duyệt / Từ chối; ý kiến bắt buộc khi từ chối.
- ✅ A7 (2026-10-02): **Phiên bản** chỉ tăng khi GĐK sửa nội dung hồ sơ *Đã duyệt* / *Từ chối*. *Đã rút* sửa hoặc gửi lại → giữ phiên bản (BOD chưa quyết định). Gửi lại không sửa → giữ phiên bản.
- ✅ A8 (2026-10-02): BOD xem được hồ sơ ở mọi trạng thái, kể cả Bản nháp. Rút hồ sơ bắt buộc ghi lý do. Đang điều chỉnh thì GĐK thấy bản đã duyệt gần nhất là con số chính thức. Thông báo gửi/rút đến tất cả BOD.
- ✅ A3: Nút "Đặt mục tiêu" ở Sổ theo dõi dự án mở hồ sơ Mục tiêu kinh doanh của khối/năm tương ứng.
- ✅ A4: Thông báo trong hệ thống + email; BOD nhận khi GĐK gửi/rút; GĐK nhận khi BOD duyệt/từ chối/trả lại.
- ✅ A5: Chỉ màn Mục tiêu kinh doanh; G7, G8, G10 chỉ ghi chú.
