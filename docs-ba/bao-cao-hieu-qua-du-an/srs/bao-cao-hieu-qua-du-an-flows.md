---
type: srs-flows
feature: bao-cao-hieu-qua-du-an
updated: 2026-10-03
---

# Báo cáo hiệu quả dự án — Flows

## Flow: F1 — Xem tổng quan cả khối / công ty
__Trigger__: Người xem chọn menu "Quản trị dự án & Tài chính → Báo cáo hiệu quả dự án"
__Related UC__: [[docs/bao-cao-hieu-qua-du-an/usecases/uc-xem-tong-quan-khoi.md]]
__Related FR__: FR-bao-cao-hieu-qua-du-an-001, FR-bao-cao-hieu-qua-du-an-002, FR-bao-cao-hieu-qua-du-an-003, FR-bao-cao-hieu-qua-du-an-004, FR-bao-cao-hieu-qua-du-an-005, FR-bao-cao-hieu-qua-du-an-006, FR-bao-cao-hieu-qua-du-an-007, FR-bao-cao-hieu-qua-du-an-008 · BR-bao-cao-hieu-qua-du-an-002, BR-bao-cao-hieu-qua-du-an-003, BR-bao-cao-hieu-qua-du-an-004, BR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-014, BR-bao-cao-hieu-qua-du-an-034, BR-bao-cao-hieu-qua-du-an-037 · NFR-bao-cao-hieu-qua-du-an-011

### Sequence — F1

```mermaid
sequenceDiagram
    actor U as Người xem báo cáo
    participant UI as Màn Báo cáo hiệu quả
    participant S as Hệ thống
    participant K as Kho dữ liệu
    U->>UI: Mở menu Báo cáo hiệu quả dự án
    opt Vai trò không được xem báo cáo (gồm AM)
        UI-->>U: Không có menu, mở trực tiếp bị từ chối "Bạn không có quyền thực hiện thao tác này." (E-bao-cao-hieu-qua-du-an-027), ghi nhận tra soát
    end
    UI->>K: Đọc dự án, phiên bản PAKD được duyệt, kế hoạch và thực tế theo tháng
    K-->>UI: Dữ liệu dự án
    UI->>S: Lọc dự án thuộc báo cáo (có PAKD được duyệt hoặc có số thực tế ở bất kỳ chỉ tiêu nào) trong phạm vi dữ liệu (GĐK, SM: khối mình)
    S->>S: Tính Chốt số đến riêng cho DT, CP, DTT, KLCV
    S-->>UI: Danh sách dự án thuộc báo cáo và 4 chốt số
    UI-->>U: Meta Chốt số theo chỉ tiêu, Số dự án, nút Import nếu là Kế toán
    opt Chỉ tiêu chưa có số thực tế ở dự án nào
        UI-->>U: Meta hiện dấu gạch, ô số Chưa có số thực tế, bỏ qua khi tính % và xếp mức (E-bao-cao-hieu-qua-du-an-020)
    end
    U->>UI: Chọn Từ tháng, Đến tháng, Phạm vi xem (GĐK, SM chỉ có khối mình)
    UI->>S: Lọc theo khối, cắt kỳ từng chỉ tiêu tại min(Đến tháng, chốt số của chỉ tiêu)
    S->>S: Cộng KH và TT 4 chỉ tiêu, xếp mức sức khoẻ từng dự án (F2)
    S-->>UI: Tổng KH, tổng TT, hiệu quả từng dự án
    alt Không có dự án ở mức đang lọc
        UI-->>U: Bảng "Không có dự án nào ở mức này." (E-bao-cao-hieu-qua-du-an-016)
    else Có dự án
        UI-->>U: 5 ô số, bảng chi tiết, dòng Tổng cộng
    end
    U->>UI: Chọn chỉ tiêu và trục biểu đồ
    UI->>S: Tính chuỗi KH và TT của chỉ tiêu
    alt Không có nhóm cột nào
        UI-->>U: "Không có số liệu trong kỳ." (E-bao-cao-hieu-qua-du-an-017)
    else Có số liệu
        UI-->>U: Biểu đồ cột KH xanh, TT cam
    end
    opt Chuyển tab rồi quay lại
        UI-->>U: Giữ nguyên Từ, Đến, Phạm vi, chỉ tiêu, trục, lọc sức khoẻ
    end
    opt Bấm 1 dòng dự án
        UI-->>U: Chuyển tab Tổng quan dự án với dự án đó (F3)
    end
    opt Bấm số thực tế Chi phí hoặc Dòng tiền thu khác 0
        UI-->>U: Mở P-06 với kỳ so sánh của chỉ tiêu (F4)
    end
```

### Activity — F1

```mermaid
flowchart TD
    A["Mở màn Báo cáo hiệu quả dự án"] --> A0{"Vai trò được xem báo cáo? (AM không)"}
    A0 -->|"Không"| A1["Từ chối mở màn (E-bao-cao-hieu-qua-du-an-027), ghi nhận tra soát"]
    A0 -->|"Có"| B["Lấy dự án thuộc báo cáo: có PAKD được duyệt hoặc có số thực tế ở bất kỳ chỉ tiêu nào; GĐK, SM chỉ khối mình"]
    B --> C["Tính Chốt số đến riêng cho DT, CP, DTT, KLCV"]
    C --> D{"Người xem là Kế toán?"}
    D -->|"Có"| D1["Hiện nút Import sổ kế toán"]
    D -->|"Không"| D2["Ẩn nút Import sổ kế toán"]
    D1 --> E["Người xem chọn Từ, Đến, Phạm vi xem"]
    D2 --> E
    E --> F{"Phạm vi là Toàn công ty? (chỉ Kế toán, Ban lãnh đạo)"}
    F -->|"Có"| G["Mọi dự án thuộc báo cáo"]
    F -->|"Không"| G2["Dự án thuộc báo cáo của khối đã chọn"]
    G --> H["Mỗi chỉ tiêu: kỳ = Từ đến min(Đến, chốt số của chỉ tiêu); chỉ tiêu chưa có chốt số bị bỏ qua"]
    G2 --> H
    H --> I["Cộng KH và TT 4 chỉ tiêu, xếp mức sức khoẻ (F2)"]
    I --> J["5 ô số: Biên LN gộp và % hoàn thành, Chi phí đảo chiều màu"]
    J --> K{"Lọc mức sức khoẻ còn dự án?"}
    K -->|"Không"| M["Không có dự án nào ở mức này (E-bao-cao-hieu-qua-du-an-016)"]
    K -->|"Có"| N["Bảng KH, TT, Chênh lệch % và dòng Tổng cộng"]
    M --> O{"Trục biểu đồ?"}
    N --> O
    O -->|"Theo tháng"| P["Mỗi tháng Từ đến Đến, TT chỉ tới chốt số của chỉ tiêu"]
    O -->|"Theo dự án"| Q["Mỗi Mã tổng trong kỳ của chỉ tiêu, bỏ dự án KH và TT bằng 0"]
    P --> R{"Có nhóm cột nào?"}
    Q --> R
    R -->|"Không"| S1["Không có số liệu trong kỳ (E-bao-cao-hieu-qua-du-an-017)"]
    R -->|"Có"| S2["Vẽ biểu đồ cột KH và TT"]
    S1 --> KetThuc(["Kết thúc"])
    S2 --> KetThuc
    A1 --> KetThuc
```

## Flow: F2 — Xếp mức sức khoẻ dự án
__Trigger__: Hệ thống tính bảng chi tiết theo dự án (mở màn, đổi kỳ / phạm vi, sau mỗi lần ghi nhận thực tế)
__Related UC__: [[docs/bao-cao-hieu-qua-du-an/usecases/uc-xem-tong-quan-khoi.md]]
__Related FR__: FR-bao-cao-hieu-qua-du-an-009, FR-bao-cao-hieu-qua-du-an-010 · BR-bao-cao-hieu-qua-du-an-010, BR-bao-cao-hieu-qua-du-an-011, BR-bao-cao-hieu-qua-du-an-012, BR-bao-cao-hieu-qua-du-an-013

### Sequence — F2

```mermaid
sequenceDiagram
    participant UI as Màn Báo cáo hiệu quả
    participant S as Hệ thống
    UI->>S: Xếp mức 1 dự án (KH và TT, mỗi chỉ tiêu trong kỳ của nó)
    S->>S: Kiểm tra có số thực tế ở chỉ tiêu nào trong kỳ (kể cả bằng 0)
    alt Không có số thực tế
        S-->>UI: Chưa phát sinh
    else Có số thực tế
        S->>S: Bỏ qua chỉ tiêu chưa có chốt số, DT có KH bằng 0, DTT có KH bằng 0, CP có KH bằng 0 và TT không dương
        alt DT tối đa 85% hoặc CP từ 130% hoặc CP KH bằng 0 mà có chi hoặc DTT tối đa 65%
            S-->>UI: Cần chú ý
        else Cả DT, CP, DTT đều bị bỏ qua
            S-->>UI: Theo dõi
        else Mọi chỉ tiêu được xét đạt DT từ 95%, CP tối đa 100%, DTT từ 95%
            S-->>UI: Tốt
        else Còn lại
            S-->>UI: Theo dõi
        end
    end
    Note over S: KLCV không tham gia xếp mức cho tới khi chốt ngưỡng (OQ-5)
```

### Activity — F2

```mermaid
flowchart TD
    A["Nhận KH và TT của 1 dự án, mỗi chỉ tiêu trong kỳ so sánh của nó"] --> B{"Có số thực tế ở ít nhất 1 chỉ tiêu trong kỳ, kể cả bằng 0?"}
    B -->|"Không"| X1["Chưa phát sinh"]
    B -->|"Có"| C["Đánh dấu bỏ qua: chỉ tiêu chưa có chốt số, DT KH bằng 0, DTT KH bằng 0, CP KH bằng 0 và TT không dương"]
    C --> D{"DT tối đa 85% KH, hoặc CP từ 130% KH, hoặc CP KH bằng 0 mà TT dương, hoặc DTT tối đa 65% KH?"}
    D -->|"Có"| X2["Cần chú ý"]
    D -->|"Không"| E{"Cả DT, CP, DTT đều bị bỏ qua?"}
    E -->|"Có"| X3["Theo dõi"]
    E -->|"Không"| F{"Mọi chỉ tiêu được xét: DT từ 95%, CP tối đa 100%, DTT từ 95%?"}
    F -->|"Có"| X4["Tốt"]
    F -->|"Không"| X5["Theo dõi"]
    X1 --> KetThuc(["Kết thúc"])
    X2 --> KetThuc
    X3 --> KetThuc
    X4 --> KetThuc
    X5 --> KetThuc
```

## Flow: F3 — Xem tổng quan một dự án
__Trigger__: Người xem bấm tab "Tổng quan dự án" hoặc bấm 1 dòng dự án ở tab tổng quan
__Related UC__: [[docs/bao-cao-hieu-qua-du-an/usecases/uc-xem-tong-quan-du-an.md]]
__Related FR__: FR-bao-cao-hieu-qua-du-an-003, FR-bao-cao-hieu-qua-du-an-011, FR-bao-cao-hieu-qua-du-an-012, FR-bao-cao-hieu-qua-du-an-013, FR-bao-cao-hieu-qua-du-an-014, FR-bao-cao-hieu-qua-du-an-015 · BR-bao-cao-hieu-qua-du-an-015, BR-bao-cao-hieu-qua-du-an-016, BR-bao-cao-hieu-qua-du-an-017, BR-bao-cao-hieu-qua-du-an-036

### Sequence — F3

```mermaid
sequenceDiagram
    actor U as Người xem báo cáo
    participant UI as Màn Báo cáo hiệu quả
    participant S as Hệ thống
    U->>UI: Mở tab Tổng quan dự án hoặc bấm dòng ở tab tổng quan
    alt Không có dự án nào thuộc báo cáo
        UI-->>U: "Chưa có dự án." (E-bao-cao-hieu-qua-du-an-018)
    else Có dự án
        UI->>S: Dự án mặc định (vừa bấm, hoặc đầu tiên có thực tế, hoặc đầu tiên), chỉ tiêu đang chọn
        U->>UI: Đổi dự án hoặc chỉ tiêu
        UI->>S: Tính vòng đời, chuỗi tháng KH và TT, TT chỉ tới chốt số của chỉ tiêu
        S->>S: Tổng KH, Luỹ kế KH, Luỹ kế TT, Còn lại, Mức thực hiện
        alt Dự án chưa có số thực tế của chỉ tiêu
            S-->>UI: Luỹ kế TT "Chưa có số thực tế", Mức thực hiện "Chưa phát sinh" (E-bao-cao-hieu-qua-du-an-020)
        else Đã có số thực tế
            S-->>UI: 5 ô số có nhãn Đạt, Chưa đạt hoặc Vượt KH
        end
        UI-->>U: Thông tin dự án, 5 ô số, biểu đồ, bảng tháng (tháng chưa có số hiện gạch)
    end
    opt Bấm số thực tế Chi phí hoặc Dòng tiền thu khác 0
        U->>UI: Bấm số tháng, luỹ kế hoặc tổng
        UI-->>U: Mở P-06 (F4)
    end
```

### Activity — F3

```mermaid
flowchart TD
    A["Mở tab Tổng quan dự án"] --> B{"Có dự án thuộc báo cáo?"}
    B -->|"Không"| E1["Chưa có dự án (E-bao-cao-hieu-qua-du-an-018)"]
    B -->|"Có"| C["Chọn dự án và chỉ tiêu (chỉ tiêu dùng chung với tab tổng quan)"]
    C --> D{"Dự án có tháng KH hoặc số thực tế?"}
    D -->|"Có"| F["Vòng đời = tháng đầu đến tháng cuối có số"]
    D -->|"Không"| F2["Vòng đời = tháng Start đến tháng End"]
    F --> G["Mỗi tháng: KH, TT nếu đã ghi nhận và không sau chốt số của chỉ tiêu, ngược lại hiện gạch"]
    F2 --> G
    G --> H["Tổng KH, Luỹ kế KH và TT đến chốt số, Còn lại = Tổng KH - Luỹ kế KH"]
    H --> I{"Dự án có số thực tế của chỉ tiêu?"}
    I -->|"Không"| J0["Luỹ kế TT: Chưa có số thực tế, Mức thực hiện: Chưa phát sinh (E-bao-cao-hieu-qua-du-an-020)"]
    I -->|"Có"| I2{"Luỹ kế KH bằng 0?"}
    I2 -->|"Có"| J1["Mức thực hiện hiện dấu gạch"]
    I2 -->|"Không"| J2{"Đạt theo chiều chỉ tiêu?"}
    J2 -->|"Đạt"| K1["Nhãn Đạt"]
    J2 -->|"Không đạt"| K2["Nhãn Chưa đạt, Chi phí thì Vượt KH"]
    J0 --> L["Bảng tháng: Chênh lệch, +/- %, Luỹ kế, % luỹ kế, nhãn Chốt số"]
    J1 --> L
    K1 --> L
    K2 --> L
    E1 --> KetThuc(["Kết thúc"])
    L --> KetThuc
```

## Flow: F4 — Truy vết chi tiết sổ kế toán (P-06)
__Trigger__: Người xem bấm con số thực tế Chi phí hoặc Dòng tiền thu (khác 0)
__Related UC__: [[docs/bao-cao-hieu-qua-du-an/usecases/uc-tra-cuu-so-ke-toan.md]]
__Related FR__: FR-bao-cao-hieu-qua-du-an-016, FR-bao-cao-hieu-qua-du-an-017, FR-bao-cao-hieu-qua-du-an-018, FR-bao-cao-hieu-qua-du-an-019, FR-bao-cao-hieu-qua-du-an-020, FR-bao-cao-hieu-qua-du-an-021 · BR-bao-cao-hieu-qua-du-an-018, BR-bao-cao-hieu-qua-du-an-019, BR-bao-cao-hieu-qua-du-an-020, BR-bao-cao-hieu-qua-du-an-021, BR-bao-cao-hieu-qua-du-an-022, BR-bao-cao-hieu-qua-du-an-023, BR-bao-cao-hieu-qua-du-an-024, BR-bao-cao-hieu-qua-du-an-040 · NFR-bao-cao-hieu-qua-du-an-008, NFR-bao-cao-hieu-qua-du-an-015

### Sequence — F4

```mermaid
sequenceDiagram
    actor U as Người xem báo cáo
    participant UI as Màn Báo cáo hiệu quả
    participant P as Popup chi tiết sổ P-06
    participant K as Kho dữ liệu
    U->>UI: Bấm con số thực tế Chi phí hoặc Dòng tiền thu (khác 0)
    UI->>P: Mở với loại sổ, danh sách dự án, kỳ, tiêu đề, con số đối chiếu
    P->>K: Đọc dòng sổ hiệu lực của loại sổ
    K-->>P: Các dòng sổ
    P->>P: Lọc theo Mã tổng, Mã KD, Mã SX, mọi mã outsource từng cấp (kể cả đã xoá) và tháng trong kỳ, sắp xếp
    alt Không có dòng nào
        P-->>U: "Không có dòng chi tiết nào trong kỳ." (E-bao-cao-hieu-qua-du-an-019), nút Export XLSX mờ
    else Có dòng
        P-->>U: Phần đầu của bảng sổ, n dòng, Tổng X, dòng Tổng cộng tính trên toàn bộ dòng
    end
    opt Ô tìm trống và Tổng khác con số đối chiếu
        P-->>U: Dải vàng cảnh báo lệch tổng (E-bao-cao-hieu-qua-du-an-015)
    end
    opt Tìm kiếm hoặc bỏ Ẩn dòng bằng 0 (sổ Chi)
        U->>P: Gõ từ khoá hoặc đổi ô tích
        P-->>U: Danh sách và Tổng cập nhật
    end
    opt Export XLSX
        U->>P: Bấm Export XLSX
        alt Quá 1.000.000 dòng thoả bộ lọc
            P-->>U: "Quá nhiều dòng để xuất (n) — vui lòng thu hẹp kỳ hoặc phạm vi." (E-bao-cao-hieu-qua-du-an-023)
        else Trong giới hạn
            P->>K: Ghi nhận tra soát: người, thời điểm, phạm vi, kỳ, số dòng
            P-->>U: Tải file DongTienThu hoặc ChiThucTe gồm toàn bộ dòng thoả bộ lọc
        end
    end
```

### Activity — F4

```mermaid
flowchart TD
    A["Bấm số thực tế"] --> B{"Chỉ tiêu là Chi phí hoặc Dòng tiền thu và số khác 0?"}
    B -->|"Không"| Z["Không mở gì (Doanh thu, KLCV hoặc số 0)"]
    B -->|"Có"| C["Lấy tập mã: Mã tổng, Mã KD, Mã SX, mọi mã outsource từng cấp của các dự án"]
    C --> D["Lọc dòng sổ hiệu lực có mã thuộc tập và tháng trong kỳ"]
    D --> E{"Loại sổ?"}
    E -->|"Dòng tiền thu"| F["Tìm trong Diễn giải, Đối tượng, Mã và Tên công trình, sắp theo ngày"]
    E -->|"Chi thực tế"| G["Ẩn dòng Chi SX và Chi KD đều 0 (mặc định bật), tìm trong Mã dự án và Ghi chú"]
    F --> H["Tổng = tổng Số tiền"]
    G --> H2["Tổng = tổng Chi SX + tổng Chi KD"]
    H --> I{"Ô tìm trống và Tổng làm tròn khác con số đối chiếu?"}
    H2 --> I
    I -->|"Có"| J["Hiện cảnh báo lệch tổng (E-bao-cao-hieu-qua-du-an-015)"]
    I -->|"Không"| K["Không cảnh báo"]
    J --> L{"Có dòng?"}
    K --> L
    L -->|"Không"| M["Không có dòng chi tiết nào trong kỳ (E-bao-cao-hieu-qua-du-an-019), nút Export XLSX mờ"]
    L -->|"Có"| N["Bảng hiện theo từng phần, n dòng, Tổng và dòng Tổng cộng tính trên toàn bộ dòng"]
    N --> X{"Bấm Export XLSX?"}
    X -->|"Không"| KetThuc
    X -->|"Có"| X1{"Số dòng thoả bộ lọc tối đa 1.000.000?"}
    X1 -->|"Không"| X2["Quá nhiều dòng để xuất (E-bao-cao-hieu-qua-du-an-023)"]
    X1 -->|"Có"| X3["Xuất toàn bộ dòng thoả bộ lọc, ghi nhận tra soát"]
    Z --> KetThuc(["Kết thúc"])
    M --> KetThuc
    X2 --> KetThuc
    X3 --> KetThuc
```

## Flow: F5 — Import sổ kế toán (P-07): đọc, kiểm tra, xem trước
__Trigger__: Kế toán bấm "Import sổ kế toán" trên thanh tiêu đề MH-03
__Related UC__: [[docs/bao-cao-hieu-qua-du-an/usecases/uc-import-so-ke-toan.md]]
__Related FR__: FR-bao-cao-hieu-qua-du-an-022, FR-bao-cao-hieu-qua-du-an-023, FR-bao-cao-hieu-qua-du-an-024, FR-bao-cao-hieu-qua-du-an-025, FR-bao-cao-hieu-qua-du-an-026, FR-bao-cao-hieu-qua-du-an-028, FR-bao-cao-hieu-qua-du-an-029, FR-bao-cao-hieu-qua-du-an-031 · BR-bao-cao-hieu-qua-du-an-025, BR-bao-cao-hieu-qua-du-an-026, BR-bao-cao-hieu-qua-du-an-027, BR-bao-cao-hieu-qua-du-an-028, BR-bao-cao-hieu-qua-du-an-029, BR-bao-cao-hieu-qua-du-an-037 · NFR-bao-cao-hieu-qua-du-an-002, NFR-bao-cao-hieu-qua-du-an-015

### Sequence — F5

```mermaid
sequenceDiagram
    actor KT as Kế toán
    participant UI as Màn Báo cáo hiệu quả
    participant P as Popup Import sổ P-07
    participant S as Hệ thống
    participant K as Kho dữ liệu
    KT->>UI: Bấm Import sổ kế toán (nút chỉ hiện với Kế toán)
    UI->>P: Mở popup 3 bước
    P->>K: Đọc 10 nhật ký import gần nhất
    K-->>P: Lịch sử import
    P-->>KT: Bước 1, bước 2, Lịch sử import
    opt Tải file mẫu
        KT->>P: Bấm Mẫu dòng tiền thu hoặc Mẫu chi thực tế
        P-->>KT: Tải file mẫu xlsx (cột mã ghi Mã tổng, Mã SX, Mã KD)
    end
    KT->>P: Kéo thả hoặc chọn file
    alt Sai đuôi file
        P-->>KT: "Chỉ hỗ trợ file .xlsx, .xls, .csv." (E-bao-cao-hieu-qua-du-an-001)
    else Không đọc được file (hỏng hoặc đặt mật khẩu)
        P-->>KT: "Không đọc được file. File có thể bị hỏng hoặc đặt mật khẩu." (E-bao-cao-hieu-qua-du-an-002)
    else File quá 20 MB hoặc quá 50.000 dòng dữ liệu
        P-->>KT: File vượt giới hạn (E-bao-cao-hieu-qua-du-an-024)
    else File CSV không lưu UTF-8
        P-->>KT: "File CSV phải lưu dạng UTF-8." (E-bao-cao-hieu-qua-du-an-025)
    else Đọc được
        P->>S: Đọc sheet đầu, dò dòng tiêu đề
        alt Không nhận ra loại sổ
            S-->>P: Lỗi E-bao-cao-hieu-qua-du-an-003
        else Thiếu cột bắt buộc
            S-->>P: Lỗi E-bao-cao-hieu-qua-du-an-004 hoặc E-bao-cao-hieu-qua-du-an-005
        else Nhận được loại sổ
            S->>S: Kiểm từng dòng, ghép mã dự án, đếm dòng không mã và mã chưa khớp
            S-->>P: Dòng hợp lệ, các tháng, lỗi E-bao-cao-hieu-qua-du-an-006 đến E-bao-cao-hieu-qua-du-an-011 và E-bao-cao-hieu-qua-du-an-026 tháng tương lai (Dòng n theo số dòng thật trên sheet), cảnh báo E-bao-cao-hieu-qua-du-an-012, E-bao-cao-hieu-qua-du-an-013
        end
        P->>K: Đếm số dòng sổ hiện có cùng loại ở các tháng trong file
        P-->>KT: Chip loại sổ, số dòng, tháng, dự án khớp, lỗi, cảnh báo, bảng tổng hợp, dải vàng E-bao-cao-hieu-qua-du-an-014
    end
    alt Có lỗi hoặc không có dòng hợp lệ
        P->>K: Ghi nhận tra soát lần import lỗi
        P-->>KT: Nút Import sổ mờ, nút tải danh sách dòng lỗi
    else Hợp lệ
        P-->>KT: Nút Import sổ bật, Kế toán bấm thì sang F6
    end
    opt Có lỗi và Kế toán tải danh sách dòng lỗi
        KT->>P: Bấm tải danh sách dòng lỗi
        P-->>KT: File Excel gồm Dòng và lý do
    end
```

### Activity — F5

```mermaid
flowchart TD
    A["Kế toán mở P-07, thấy Lịch sử import 10 lần gần nhất"] --> A1["Chọn file"]
    A1 --> B{"Đuôi .xlsx, .xls hoặc .csv?"}
    B -->|"Không"| E1["E-bao-cao-hieu-qua-du-an-001 Chỉ hỗ trợ file .xlsx, .xls, .csv."]
    B -->|"Có"| C{"Đọc được file?"}
    C -->|"Không"| E2["E-bao-cao-hieu-qua-du-an-002 Không đọc được file, có thể hỏng hoặc đặt mật khẩu"]
    C -->|"Có"| C1{"Tối đa 20 MB, 50.000 dòng dữ liệu, CSV lưu UTF-8?"}
    C1 -->|"Không"| E7["E-bao-cao-hieu-qua-du-an-024 vượt giới hạn hoặc E-bao-cao-hieu-qua-du-an-025 CSV không UTF-8"]
    C1 -->|"Có"| D["Đọc sheet đầu, chuẩn hoá: bỏ dấu, chữ thường"]
    D --> F{"Có ô Ngày hạch toán?"}
    F -->|"Có"| G["Loại sổ: Dòng tiền thu"]
    F -->|"Không"| H{"Có ô Mã dự án và ô Chi sản xuất cùng dòng?"}
    H -->|"Có"| I["Loại sổ: Chi thực tế"]
    H -->|"Không"| E3["E-bao-cao-hieu-qua-du-an-003 Không nhận ra loại file"]
    G --> G1{"Có cột Số tiền?"}
    G1 -->|"Không"| E4["E-bao-cao-hieu-qua-du-an-004 Thiếu cột Số tiền"]
    G1 -->|"Có"| G2["Mỗi dòng: Ngày hợp lệ, không sau tháng hiện tại, rồi Số tiền là số (lỗi đầu tiên E-bao-cao-hieu-qua-du-an-006, E-bao-cao-hieu-qua-du-an-026, E-bao-cao-hieu-qua-du-an-007)"]
    I --> I1{"Có cột Tháng?"}
    I1 -->|"Không"| E5["E-bao-cao-hieu-qua-du-an-005 Thiếu cột Tháng"]
    I1 -->|"Có"| I2["Mỗi dòng: Có mã, Tháng hợp lệ, không sau tháng hiện tại, Chi là số (E-bao-cao-hieu-qua-du-an-008, E-bao-cao-hieu-qua-du-an-009, E-bao-cao-hieu-qua-du-an-026, E-bao-cao-hieu-qua-du-an-010)"]
    G2 --> J["Đếm dòng không mã (E-bao-cao-hieu-qua-du-an-012), mã chưa khớp tối đa 12 mã (E-bao-cao-hieu-qua-du-an-013)"]
    I2 --> J
    J --> K{"Không có dòng hợp lệ và không có lỗi?"}
    K -->|"Có"| E6["E-bao-cao-hieu-qua-du-an-011 File không có dòng dữ liệu nào."]
    K -->|"Không"| L["Xem trước: bảng theo dự án và dòng Không gắn hoặc chưa khớp"]
    L --> M{"Sổ cùng loại đã có dòng hiệu lực ở các tháng này?"}
    M -->|"Có"| N["Dải vàng E-bao-cao-hieu-qua-du-an-014 nêu số dòng sổ hiện có sẽ bị thay"]
    M -->|"Không"| O{"0 lỗi và ít nhất 1 dòng hợp lệ?"}
    N --> O
    O -->|"Có"| Q["Nút Import sổ bật, Kế toán bấm thì sang F6"]
    O -->|"Không"| P["Nút Import sổ mờ, có nút tải danh sách dòng lỗi"]
    E1 --> P
    E2 --> P
    E3 --> P
    E4 --> P
    E5 --> P
    E6 --> P
    E7 --> P
    P --> R{"Kế toán tải danh sách dòng lỗi?"}
    R -->|"Có"| S["Tải file Excel: Dòng (số dòng thật trên sheet) và lý do"]
    R -->|"Không"| T["Sửa file rồi Chọn lại, hoặc Huỷ"]
    S --> T
    Q --> KetThuc(["Kết thúc"])
    T --> KetThuc
```

## Flow: F6 — Xác nhận, ghi sổ và tính lại số thực tế
__Trigger__: Kế toán bấm "Import sổ" khi kết quả kiểm tra hợp lệ
__Related UC__: [[docs/bao-cao-hieu-qua-du-an/usecases/uc-import-so-ke-toan.md]]
__Related FR__: FR-bao-cao-hieu-qua-du-an-002, FR-bao-cao-hieu-qua-du-an-027, FR-bao-cao-hieu-qua-du-an-030 · BR-bao-cao-hieu-qua-du-an-030, BR-bao-cao-hieu-qua-du-an-031, BR-bao-cao-hieu-qua-du-an-032, BR-bao-cao-hieu-qua-du-an-036, BR-bao-cao-hieu-qua-du-an-037, BR-bao-cao-hieu-qua-du-an-038, BR-bao-cao-hieu-qua-du-an-039 · NFR-bao-cao-hieu-qua-du-an-013, NFR-bao-cao-hieu-qua-du-an-014, NFR-bao-cao-hieu-qua-du-an-015

### Sequence — F6

```mermaid
sequenceDiagram
    actor KT as Kế toán
    participant P as Popup Import sổ P-07
    participant K as Kho dữ liệu
    participant UI as Màn Báo cáo hiệu quả
    KT->>P: Bấm Import sổ
    P->>K: Kiểm sổ cùng loại có dòng hiệu lực ở các tháng trong file
    opt Sổ đã có dòng ở các tháng đó
        P->>K: Đếm số dòng của dự án không có trong file và số dự án đó
        P-->>KT: Hộp xác nhận "Sẽ thay toàn bộ sổ ... sẽ bị xoá."
        KT->>P: Đồng ý (chọn quay lại thì dừng, không ghi gì)
    end
    P->>K: Ghi sổ: loại sổ, dòng hợp lệ, các tháng, tên file, người import (nút Import sổ mờ, bấm lặp không gửi thêm)
    K->>K: Kiểm lại vai trò Kế toán và sổ cùng loại các tháng trong file so với bước xem trước
    alt Không còn vai trò Kế toán
        K-->>P: Từ chối, ghi nhận tra soát
        P-->>KT: "Bạn không còn quyền import sổ kế toán." và đóng popup (E-bao-cao-hieu-qua-du-an-022)
    else Sổ đã đổi sau bước xem trước
        K-->>P: Từ chối, ghi nhận tra soát
        P->>K: Tính lại xem trước, dải vàng và số liệu hộp xác nhận
        P-->>KT: Giữ bước xem trước, báo sổ vừa được cập nhật (E-bao-cao-hieu-qua-du-an-022)
    else Hợp lệ
        K->>K: Chuyển dòng cùng loại các tháng đó sang Đã bị thay, thêm dòng mới
        K->>K: Thêm nhật ký import, lưu tệp gốc
        K->>K: Xác định dự án bị ảnh hưởng (khớp mã dòng mới hoặc dòng bị thay, mọi trạng thái dự án)
        loop Mỗi dự án bị ảnh hưởng và mỗi tháng trong file
            K->>K: Tính lại Thu hoặc Chi SX, Chi KD thực tế tháng từ dòng hiệu lực khớp mã
        end
        K->>K: Ghi lịch sử dự án, không tăng phiên bản
        alt Ghi không thành công
            K-->>P: Hoàn nguyên toàn bộ, ghi nhận tra soát
            P-->>KT: Giữ bước xem trước, "Thao tác chưa thực hiện được, vui lòng thử lại" (E-bao-cao-hieu-qua-du-an-021)
        else Ghi thành công
            K-->>P: Hoàn tất
            P-->>UI: Đóng popup, chuỗi kết quả
            UI->>UI: Tính lại Chốt số đến CP hoặc DTT, ô số, bảng, mức sức khoẻ
            UI-->>KT: Toast "Đã import ... — cập nhật m dự án", m = số dự án bị ảnh hưởng (3 giây)
        end
    end
    Note over K: Doanh thu và KLCV thực tế không đổi
```

### Activity — F6

```mermaid
flowchart TD
    A["Kế toán bấm Import sổ"] --> B{"Sổ cùng loại đã có dòng hiệu lực ở các tháng trong file?"}
    B -->|"Có"| C["Hộp xác nhận: số dòng của dự án không có trong file và số dự án đó"]
    B -->|"Không"| V
    C --> D{"Kế toán đồng ý?"}
    D -->|"Quay lại"| D2["Giữ bước xem trước, không ghi gì"]
    D -->|"Đồng ý"| V{"Tại lúc ghi: còn vai trò Kế toán?"}
    V -->|"Không"| V1["Không ghi, đóng popup (E-bao-cao-hieu-qua-du-an-022)"]
    V -->|"Có"| W{"Sổ cùng loại các tháng trong file còn như lúc xem trước?"}
    W -->|"Không"| W1["Không ghi, tính lại xem trước và số liệu hộp xác nhận (E-bao-cao-hieu-qua-du-an-022)"]
    W -->|"Có"| E["Chuyển dòng cùng loại các tháng trong file sang Đã bị thay, thêm dòng mới"]
    E --> F["Ghi nhật ký import (người import theo tài khoản), lưu tệp gốc"]
    F --> G["Dự án bị ảnh hưởng = khớp mã với dòng mới hoặc dòng bị thay"]
    G --> H{"Loại sổ? (mọi trạng thái dự án)"}
    H -->|"Dòng tiền thu"| I["Thu thực tế tháng = tổng Số tiền dòng hiệu lực, không còn dòng thì 0"]
    H -->|"Chi thực tế"| J["Chi SX, Chi KD thực tế tháng = tổng dòng hiệu lực, không còn dòng thì 0"]
    I --> K["Ghi lịch sử dự án, không tăng phiên bản"]
    J --> K
    K --> L{"Ghi thành công?"}
    L -->|"Không"| M["Hoàn nguyên toàn bộ, báo Thao tác chưa thực hiện được (E-bao-cao-hieu-qua-du-an-021)"]
    L -->|"Có"| N["Tính lại Chốt số đến CP hoặc DTT, đóng popup, toast với số dự án bị ảnh hưởng"]
    D2 --> KetThuc(["Kết thúc"])
    V1 --> KetThuc
    W1 --> KetThuc
    M --> KetThuc
    N --> KetThuc
```

## Notes

- "Kho dữ liệu" = nơi lưu dự án, kế hoạch / thực tế theo tháng, sổ kế toán, nhật ký — cơ chế lưu trữ cụ thể chờ chốt (Spec Mục 11, OQ-7).
- Doanh thu và KLCV thực tế được ghi nhận ở feature `quan-ly-du-an-kinh-doanh` (khối Số liệu theo tháng), chỉ ô có số mới được ghi nhận (BR-bao-cao-hieu-qua-du-an-036); sau đó chốt số DT / KLCV và báo cáo tính lại như F1.
- Khi dự án được cấp mã tổng / mã outsource mới (feature `quan-ly-du-an-kinh-doanh`), hệ thống tính lại Thu / Chi thực tế các tháng có dòng sổ khớp mã đó và ghi lịch sử, cùng cách tính và cùng nguyên tắc ghi trọn vẹn như F6 (BR-bao-cao-hieu-qua-du-an-039).
