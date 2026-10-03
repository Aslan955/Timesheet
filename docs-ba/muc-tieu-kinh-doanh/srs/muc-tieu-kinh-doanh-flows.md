---
type: srs-flows
feature: muc-tieu-kinh-doanh
updated: 2026-10-03
---

# Mục tiêu kinh doanh — Flows

## Flow: Mở hồ sơ và xác định quyền sửa
__Trigger__: GĐK mở tab "GĐK lập mục tiêu" hoặc đổi Năm kế hoạch
__Related UC__: uc-lap-ho-so-muc-tieu
__Related FR__: FR-muc-tieu-kinh-doanh-001, FR-muc-tieu-kinh-doanh-002, FR-muc-tieu-kinh-doanh-005, FR-muc-tieu-kinh-doanh-014, FR-muc-tieu-kinh-doanh-025, FR-muc-tieu-kinh-doanh-026

### Sequence — Mở hồ sơ và xác định quyền sửa

```mermaid
sequenceDiagram
    actor GDK as Giám đốc khối
    participant S as Hệ thống
    participant TK as Đăng nhập
    GDK->>S: Mở tab GĐK lập mục tiêu
    S->>TK: Lấy tên, vai trò và khối của tài khoản
    TK-->>S: Vai trò GĐK, khối của tài khoản
    opt Tài khoản GĐK chưa gắn khối
        S-->>GDK: Tài khoản chưa được gắn khối - liên hệ quản trị (E-muc-tieu-kinh-doanh-015), dừng
    end
    S->>S: Chọn năm mặc định theo giờ Asia/Ho_Chi_Minh (tháng 10-12 chọn năm sau)
    GDK->>S: Giữ hoặc đổi Năm kế hoạch
    alt Năm đã qua
        S-->>GDK: Hồ sơ chỉ đọc, lý do E-muc-tieu-kinh-doanh-009
    else Năm hiện tại hoặc năm sau
        alt Chưa có hồ sơ
            S-->>GDK: Hồ sơ trống, Bản nháp - Phiên bản 01, chưa lưu
        else Đã có hồ sơ
            S-->>GDK: Nạp hồ sơ, trạng thái, phiên bản, lịch sử
        end
        alt Hồ sơ đang Chờ BOD duyệt
            S-->>GDK: Bảng chỉ đọc, lý do E-muc-tieu-kinh-doanh-006, chỉ còn nút Rút hồ sơ
        else Sửa được
            S-->>GDK: Bảng nhập được, hiện Lưu nháp và Gửi BOD duyệt
        end
        opt Hồ sơ đã có phiên bản được duyệt và chưa ở Đã duyệt
            S-->>GDK: Hiện song song Mục tiêu chính thức - Phiên bản NN
        end
    end
```

### Activity — Mở hồ sơ và xác định quyền sửa

```mermaid
flowchart TD
    A["GĐK mở tab GĐK lập mục tiêu<br/>khối lấy theo tài khoản"] --> K0{"Tài khoản đã<br/>gắn khối?"}
    K0 -->|"Chưa"| E15["Tài khoản chưa được gắn khối<br/>E-muc-tieu-kinh-doanh-015"]
    K0 -->|"Rồi"| B["Chọn Năm kế hoạch<br/>(mặc định theo giờ Asia/Ho_Chi_Minh)"]
    B --> C{"Năm kế hoạch nhỏ hơn<br/>năm hiện tại?"}
    C -->|"Có"| RO1["Chỉ đọc - lý do E-muc-tieu-kinh-doanh-009"]
    C -->|"Không"| D{"Đã có hồ sơ của khối<br/>trong năm kế hoạch?"}
    D -->|"Chưa"| E["Hồ sơ trống<br/>Bản nháp - Phiên bản 01"]
    D -->|"Có"| F["Nạp hồ sơ đã lưu"]
    E --> G{"Hồ sơ đang<br/>Chờ BOD duyệt?"}
    F --> G
    G -->|"Có"| RO2["Chỉ đọc - lý do E-muc-tieu-kinh-doanh-006<br/>chỉ còn nút Rút hồ sơ"]
    G -->|"Không"| W["Sửa được - hiện Lưu nháp<br/>và Gửi BOD duyệt"]
    W --> H{"Đã có phiên bản được duyệt<br/>và chưa ở Đã duyệt?"}
    H -->|"Có"| P["Hiện song song<br/>Mục tiêu chính thức - Phiên bản NN"]
    H -->|"Không"| KetThuc(["Kết thúc"])
    P --> KetThuc
    RO1 --> KetThuc
    RO2 --> KetThuc
    E15 --> KetThuc
```

## Flow: Lập / sửa dòng mục tiêu và Lưu nháp
__Trigger__: GĐK sửa bảng đăng ký rồi bấm "Lưu nháp"
__Related UC__: uc-lap-ho-so-muc-tieu
__Related FR__: FR-muc-tieu-kinh-doanh-009, FR-muc-tieu-kinh-doanh-010, FR-muc-tieu-kinh-doanh-011, FR-muc-tieu-kinh-doanh-012, FR-muc-tieu-kinh-doanh-015, FR-muc-tieu-kinh-doanh-016, FR-muc-tieu-kinh-doanh-027

### Sequence — Lập / sửa dòng mục tiêu và Lưu nháp

```mermaid
sequenceDiagram
    actor GDK as Giám đốc khối
    participant S as Hệ thống
    participant H as Lịch sử hồ sơ
    GDK->>S: Thêm, sửa, xoá dòng
    S-->>GDK: Gợi ý khách hàng, cập nhật ngay % dòng, 3 ô chỉ số, biểu đồ, dòng tổng
    opt Ô tháng gõ sai dạng MM/YYYY
        S-->>GDK: Ô tô đỏ, giữ giá trị cũ của dòng (E-muc-tieu-kinh-doanh-004)
    end
    GDK->>S: Bấm Lưu nháp
    alt Còn ô tháng sai định dạng
        S-->>GDK: Dải đỏ liệt kê từng ô tháng sai, tô viền đỏ, không lưu (E-muc-tieu-kinh-doanh-004)
    else Kiểm tra qua
        alt Hồ sơ chưa từng lưu
            S->>S: Hồ sơ mới, Phiên bản 01, Bản nháp, người lập là tài khoản hiện tại
        else Hồ sơ đang Bản nháp, Đang điều chỉnh hoặc Đã rút
            S->>S: Giữ phiên bản, trạng thái Bản nháp hoặc Đang điều chỉnh
        else Hồ sơ đang Đã duyệt hoặc Từ chối, nội dung có thay đổi
            S->>S: Phiên bản cộng 1, trạng thái Bản nháp hoặc Đang điều chỉnh, giữ ý kiến BOD
        end
        alt Ghi hồ sơ và lịch sử thành công
            S->>H: Ghi Tạo hồ sơ (lần đầu) hoặc Lưu nháp kèm nội dung đổi so với lần lưu trước
            S-->>GDK: Toast Đã lưu nháp
        else Không ghi được
            S-->>GDK: Báo E-muc-tieu-kinh-doanh-010, giữ dữ liệu đang soạn
            Note over S,H: Trạng thái, phiên bản, lịch sử giữ nguyên. Lần thất bại được ghi nhận để tra soát
        end
    end
```

### Activity — Lập / sửa dòng mục tiêu và Lưu nháp

```mermaid
flowchart TD
    A["GĐK thêm / sửa / xoá dòng"] --> B["Tính lại % dòng, tổng khối,<br/>biểu đồ ngay (chưa lưu)"]
    B --> C{"Bảng có ít nhất 1 dòng và<br/>có thay đổi so với bản đã lưu?<br/>(ô tháng đỏ tính là có thay đổi)"}
    C -->|"Không"| X["Nút Lưu nháp mờ"]
    C -->|"Có"| D["GĐK bấm Lưu nháp"]
    D --> M{"Còn ô tháng<br/>sai định dạng?"}
    M -->|"Có"| ERR["Dải đỏ + viền đỏ ô tháng<br/>E-muc-tieu-kinh-doanh-004 - không lưu"]
    M -->|"Không"| E{"Hồ sơ đã tồn tại?"}
    E -->|"Chưa"| F["Phiên bản 01 - Bản nháp<br/>lịch sử: Tạo hồ sơ"]
    E -->|"Rồi"| G{"Trạng thái hiện tại là<br/>Đã duyệt hoặc Từ chối?"}
    G -->|"Có"| I["Phiên bản + 1<br/>lịch sử: Lưu nháp"]
    G -->|"Không"| J["Giữ phiên bản<br/>lịch sử: Lưu nháp"]
    I --> K{"Hồ sơ đã có phiên bản<br/>được duyệt?"}
    J --> K
    K -->|"Có"| L1["Nhãn Đang điều chỉnh"]
    K -->|"Không"| L2["Nhãn Bản nháp"]
    F --> W{"Ghi hồ sơ và lịch sử<br/>thành công?"}
    L1 --> W
    L2 --> W
    W -->|"Có"| T["Toast: Đã lưu nháp"]
    W -->|"Không"| E10["Báo E-muc-tieu-kinh-doanh-010<br/>giữ dữ liệu đang soạn<br/>hồ sơ không đổi"]
    E10 -->|"GĐK bấm lại"| D
    X --> KetThuc(["Kết thúc"])
    ERR --> KetThuc
    T --> KetThuc
```

## Flow: Gửi BOD duyệt
__Trigger__: GĐK bấm "Gửi BOD duyệt"
__Related UC__: uc-gui-bod-duyet
__Related FR__: FR-muc-tieu-kinh-doanh-013, FR-muc-tieu-kinh-doanh-015, FR-muc-tieu-kinh-doanh-016, FR-muc-tieu-kinh-doanh-023, FR-muc-tieu-kinh-doanh-027

### Sequence — Gửi BOD duyệt

```mermaid
sequenceDiagram
    actor GDK as Giám đốc khối
    participant S as Hệ thống
    participant H as Lịch sử hồ sơ
    GDK->>S: Bấm Gửi BOD duyệt
    S->>S: Kiểm tra toàn bộ bảng, không dừng ở lỗi đầu tiên
    alt Không có dòng nào
        S-->>GDK: Dải đỏ Chưa có dự án đăng ký. (E-muc-tieu-kinh-doanh-001)
    else Có lỗi dữ liệu
        S-->>GDK: Dải đỏ liệt kê đủ lỗi theo thứ tự dòng (E-muc-tieu-kinh-doanh-002, E-muc-tieu-kinh-doanh-003, E-muc-tieu-kinh-doanh-004, E-muc-tieu-kinh-doanh-011, E-muc-tieu-kinh-doanh-013)
        S-->>GDK: Tô viền đỏ từng ô lỗi, trạng thái không đổi
    else Hợp lệ
        S->>S: Đánh phiên bản (cộng 1 nếu đang Đã duyệt hoặc Từ chối)
        alt Ghi hồ sơ và lịch sử thành công
            S->>S: Trạng thái Chờ BOD duyệt, ghi nhận nội dung vừa gửi làm mốc so sánh, xoá ý kiến BOD cũ
            S->>H: Ghi Gửi BOD duyệt kèm nội dung đổi so với bản đã gửi gần nhất
            S-->>GDK: Toast Đã gửi BOD duyệt mục tiêu khối năm
            S-->>GDK: Khoá sửa, chỉ còn nút Rút hồ sơ
        else Không ghi được
            S-->>GDK: Báo E-muc-tieu-kinh-doanh-010, giữ dữ liệu đang soạn
            Note over S,H: Trạng thái, phiên bản, lịch sử giữ nguyên. Lần thất bại được ghi nhận để tra soát
        end
    end
```

### Activity — Gửi BOD duyệt

```mermaid
flowchart TD
    A{"Lần gửi gần nhất đã được BOD quyết định và<br/>nội dung giống bản đó?<br/>(kể cả đã lưu điều chỉnh rồi sửa trở lại)"} -->|"Có"| X["Nút Gửi BOD duyệt mờ<br/>phiên bản không lùi"]
    A -->|"Không"| B["GĐK bấm Gửi BOD duyệt"]
    B --> C{"Số dòng = 0?"}
    C -->|"Có"| E1["Dải đỏ E-muc-tieu-kinh-doanh-001<br/>Chưa có dự án đăng ký."]
    C -->|"Không"| D{"Có lỗi thiếu thông tin, LN gộp vượt,<br/>tháng sai, Ký HĐ trước Ra thầu hoặc<br/>Ký HĐ ngoài năm kế hoạch ở bất kỳ dòng nào?"}
    D -->|"Có"| E2["Dải đỏ liệt kê đủ lỗi theo thứ tự dòng<br/>+ viền đỏ từng ô lỗi"]
    D -->|"Không"| F{"Hồ sơ đang Đã duyệt<br/>hoặc Từ chối?"}
    F -->|"Có"| G["Phiên bản + 1"]
    F -->|"Không (mới / Bản nháp /<br/>Đang điều chỉnh / Đã rút)"| G2["Giữ phiên bản (mới = 01)"]
    G --> W{"Ghi hồ sơ và lịch sử<br/>thành công?"}
    G2 --> W
    W -->|"Có"| H["Chờ BOD duyệt - ghi nhận nội dung đã gửi<br/>làm mốc so sánh - xoá ý kiến BOD - ghi lịch sử"]
    W -->|"Không"| E10["Báo E-muc-tieu-kinh-doanh-010<br/>giữ dữ liệu đang soạn<br/>hồ sơ không đổi"]
    E10 -->|"GĐK bấm lại"| B
    H --> I["Toast + khoá sửa<br/>hiện nút Rút hồ sơ"]
    X --> KetThuc(["Kết thúc"])
    E1 --> KetThuc
    E2 --> KetThuc
    I --> KetThuc
```

## Flow: Rút hồ sơ đang chờ duyệt
__Trigger__: GĐK bấm "Rút hồ sơ" trên hồ sơ đang Chờ BOD duyệt
__Related UC__: uc-rut-ho-so
__Related FR__: FR-muc-tieu-kinh-doanh-016, FR-muc-tieu-kinh-doanh-023, FR-muc-tieu-kinh-doanh-024

### Sequence — Rút hồ sơ

```mermaid
sequenceDiagram
    actor GDK as Giám đốc khối
    participant S as Hệ thống
    participant H as Lịch sử hồ sơ
    GDK->>S: Bấm Rút hồ sơ
    S-->>GDK: Popup Rút hồ sơ, ô Lý do rút bắt buộc
    alt GĐK bấm Huỷ
        S-->>GDK: Đóng popup, hồ sơ vẫn Chờ BOD duyệt
    else Lý do trống hoặc chỉ khoảng trắng
        S-->>GDK: Nút Xác nhận rút mờ (E-muc-tieu-kinh-doanh-008)
    else Có lý do và GĐK bấm Xác nhận rút
        alt Hồ sơ không còn Chờ BOD duyệt hoặc năm vừa thành năm đã qua
            S-->>GDK: Báo E-muc-tieu-kinh-doanh-014, nạp lại hồ sơ, không rút
        else Ghi hồ sơ và lịch sử thành công
            S->>S: Trạng thái Đã rút, giữ phiên bản và nội dung, lưu lý do đã cắt khoảng trắng
            S->>H: Ghi Rút hồ sơ kèm lý do
            S-->>GDK: Toast Đã rút hồ sơ mục tiêu khối năm
            S-->>GDK: Mở khoá bảng, hộp Đã rút kèm lý do, hiện Lưu nháp và Gửi BOD duyệt
        else Không ghi được
            S-->>GDK: Báo E-muc-tieu-kinh-doanh-010, popup vẫn mở và giữ lý do, hồ sơ vẫn Chờ BOD duyệt
        end
    end
```

### Activity — Rút hồ sơ

```mermaid
flowchart TD
    A["GĐK bấm Rút hồ sơ<br/>(hồ sơ Chờ BOD duyệt)"] --> B["Popup: ô Lý do rút bắt buộc"]
    B --> D{"Lý do sau khi cắt<br/>khoảng trắng có rỗng?"}
    D -->|"Rỗng"| E["Nút Xác nhận rút mờ<br/>E-muc-tieu-kinh-doanh-008"]
    D -->|"Có nội dung"| S2["Nút Xác nhận rút bấm được"]
    E --> C1{"GĐK chọn"}
    C1 -->|"Nhập lý do"| D
    C1 -->|"Huỷ"| H1["Đóng popup - hồ sơ không đổi"]
    S2 --> C2{"GĐK chọn"}
    C2 -->|"Sửa lý do"| D
    C2 -->|"Huỷ"| H1
    C2 -->|"Xác nhận rút"| V{"Lúc bấm: hồ sơ vẫn Chờ BOD duyệt<br/>và năm còn sửa được?"}
    V -->|"Không"| E14["Báo E-muc-tieu-kinh-doanh-014<br/>nạp lại hồ sơ - không rút"]
    V -->|"Có"| W{"Ghi hồ sơ và lịch sử<br/>thành công?"}
    W -->|"Có"| F["Đã rút - giữ phiên bản<br/>ghi lịch sử Rút hồ sơ kèm lý do"]
    W -->|"Không"| E10["Báo E-muc-tieu-kinh-doanh-010<br/>popup giữ lý do - hồ sơ vẫn Chờ BOD duyệt"]
    E10 --> C2
    F --> G["Toast - hồ sơ sửa được và gửi lại được"]
    H1 --> KetThuc(["Kết thúc"])
    G --> KetThuc
    E14 --> KetThuc
```

## Flow: BOD phê duyệt / từ chối và ghi nhận mục tiêu chính thức
__Trigger__: BOD mở tab "BOD phê duyệt" và mở một hồ sơ
__Related UC__: uc-bod-phe-duyet, uc-bod-tu-choi
__Related FR__: FR-muc-tieu-kinh-doanh-018, FR-muc-tieu-kinh-doanh-019, FR-muc-tieu-kinh-doanh-020, FR-muc-tieu-kinh-doanh-021, FR-muc-tieu-kinh-doanh-022, FR-muc-tieu-kinh-doanh-023

### Sequence — BOD phê duyệt / từ chối

```mermaid
sequenceDiagram
    actor BOD as Ban giám đốc
    participant S as Hệ thống
    participant H as Lịch sử hồ sơ
    participant K as Kho mục tiêu khối
    BOD->>S: Mở tab BOD phê duyệt (chỉ tài khoản BOD)
    S-->>BOD: Danh sách hồ sơ đã gửi ít nhất 1 lần, chờ duyệt lên đầu
    BOD->>S: Bấm một hồ sơ
    S-->>BOD: Chi tiết chỉ đọc, lịch sử
    alt Hồ sơ không ở Chờ BOD duyệt
        S-->>BOD: Dòng trạng thái, ý kiến BOD hoặc lý do rút, không có nút quyết định
    else Hồ sơ Chờ BOD duyệt
        BOD->>S: Nhập ý kiến (tuỳ chọn) và bấm Phê duyệt hoặc Từ chối
        alt Lúc bấm hồ sơ không còn Chờ BOD duyệt (BOD khác vừa quyết định, GĐK vừa rút)
            S-->>BOD: Báo E-muc-tieu-kinh-doanh-014, nạp lại hồ sơ, giữ ý kiến đang nhập
        else Từ chối và ý kiến trống hoặc chỉ khoảng trắng
            S-->>BOD: Lỗi E-muc-tieu-kinh-doanh-005 Từ chối bắt buộc nhập ý kiến
        else Từ chối có ý kiến
            alt Ghi hồ sơ và lịch sử thành công
                S->>S: Trạng thái Từ chối, giữ phiên bản, lưu ý kiến đã cắt khoảng trắng
                S->>H: Ghi BOD từ chối kèm ý kiến
                S-->>BOD: Toast BOD đã từ chối mục tiêu khối năm
            else Không ghi được
                S-->>BOD: Báo E-muc-tieu-kinh-doanh-010, giữ ý kiến đang nhập, hồ sơ vẫn Chờ BOD duyệt
            end
        else Phê duyệt
            alt Ghi được cả hồ sơ, lịch sử và mục tiêu chính thức
                S->>S: Trạng thái Đã duyệt, giữ phiên bản, lưu ý kiến nếu có
                S->>H: Ghi BOD phê duyệt - ghi nhận kế hoạch chính thức
                S->>K: Mục tiêu của khối trong năm kế hoạch = tổng HĐ ký mới x 1.000.000 VNĐ, nguồn BOD duyệt
                K-->>S: Ghi đè số nhập tay nếu có, giữ các khối khác
                S-->>BOD: Toast BOD đã phê duyệt - ghi nhận kế hoạch chính thức
            else Một phần không ghi được
                S-->>BOD: Báo E-muc-tieu-kinh-doanh-010, giữ ý kiến đang nhập
                Note over S,K: Không phần nào được ghi (BR-muc-tieu-kinh-doanh-032). Hồ sơ giữ Chờ BOD duyệt, mục tiêu chính thức giữ nguyên
            end
        end
    end
    Note over K: Sổ theo dõi dự án đọc kho này và khoá nhập tay P-05 với khối có nguồn BOD duyệt
    Note over BOD,S: Hồ sơ năm đã qua còn Chờ BOD duyệt vẫn quyết định được như trên
```

### Activity — BOD phê duyệt / từ chối

```mermaid
flowchart TD
    A["BOD mở danh sách hồ sơ đã gửi<br/>(chờ duyệt - năm giảm dần - khối A-Z)"] --> B["Bấm dòng - xem chi tiết chỉ đọc"]
    B --> C{"Trạng thái =<br/>Chờ BOD duyệt?"}
    C -->|"Không"| V["Chỉ hiện trạng thái + ý kiến<br/>hoặc lý do rút - Quay lại danh sách"]
    C -->|"Có"| D["BOD nhập ý kiến (tuỳ chọn)<br/>bấm Phê duyệt hoặc Từ chối"]
    D --> CK{"Lúc bấm hồ sơ vẫn<br/>Chờ BOD duyệt?"}
    CK -->|"Không"| E14["Báo E-muc-tieu-kinh-doanh-014<br/>nạp lại hồ sơ - giữ ý kiến"]
    CK -->|"Có"| D2{"Thao tác BOD bấm"}
    D2 -->|"Từ chối"| E{"Ý kiến sau khi cắt<br/>khoảng trắng có rỗng?"}
    E -->|"Rỗng"| ERR["Lỗi E-muc-tieu-kinh-doanh-005<br/>hồ sơ không đổi"]
    E -->|"Có nội dung"| WR{"Ghi hồ sơ và lịch sử<br/>thành công?"}
    WR -->|"Có"| RJ["Từ chối - giữ phiên bản<br/>ghi lịch sử kèm ý kiến"]
    WR -->|"Không"| E10["Báo E-muc-tieu-kinh-doanh-010<br/>giữ ý kiến - hồ sơ vẫn Chờ BOD duyệt"]
    D2 -->|"Phê duyệt"| WA{"Ghi được cả hồ sơ, lịch sử<br/>và mục tiêu chính thức?"}
    WA -->|"Có"| AP["Đã duyệt - giữ phiên bản - ghi lịch sử<br/>mục tiêu chính thức của khối trong năm<br/>= tổng HĐ ký mới x 1.000.000 VNĐ<br/>nguồn BOD duyệt, đè số nhập tay"]
    WA -->|"Không - không phần nào được ghi"| E10
    E10 -->|"BOD bấm lại"| D
    E14 --> KetThuc
    AP --> OK1["Toast phê duyệt - ở lại màn chi tiết"]
    RJ --> OK2["Toast từ chối - mục tiêu chính thức không đổi"]
    V --> KetThuc(["Kết thúc"])
    ERR --> KetThuc
    OK1 --> KetThuc
    OK2 --> KetThuc
```

## Notes

- Thao tác khi hồ sơ vừa bị người khác đổi trạng thái (2 BOD cùng quyết định, GĐK rút sau khi BOD đã quyết định, BOD quyết định trên hồ sơ vừa rút, thao tác của GĐK qua thời điểm sang năm mới): hệ thống kiểm lại quyền + trạng thái + năm tại lúc bấm; không thỏa thì không thực hiện, báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." (E-muc-tieu-kinh-doanh-014) và nạp lại hồ sơ, giữ ô ý kiến / lý do đang nhập (Phase H Q-21). Đã vẽ ở Flow Rút hồ sơ và Flow BOD; với Lưu nháp / Gửi BOD duyệt (năm kế hoạch vừa trở thành năm đã qua) áp cùng quy tắc, không vẽ riêng. Không đủ quyền → E-muc-tieu-kinh-doanh-012.
- Nhánh "Không ghi được" (E-muc-tieu-kinh-doanh-010) áp cho mọi thao tác ghi: trạng thái, phiên bản, lịch sử và mục tiêu chính thức giữ nguyên, dữ liệu đang nhập được giữ để bấm lại; lần thất bại được ghi nhận để tra soát (NFR-muc-tieu-kinh-doanh-010). Phê duyệt chỉ hoàn tất khi ghi được cả hồ sơ, lịch sử và mục tiêu chính thức (BR-muc-tieu-kinh-doanh-032).
- "Đăng nhập" là hệ thống dùng chung module; mỗi tài khoản đúng 1 vai trò (Phase H Q-27); cơ chế chưa chốt (reverse OQ-8, `phuong-an-kinh-doanh:OQ-5`).
