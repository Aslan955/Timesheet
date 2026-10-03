---
type: srs-flows
feature: phuong-an-kinh-doanh
updated: 2026-10-03
---

# Phương án kinh doanh (PAKD) — Flows

## Flow: F1 — Lập và gửi PAKD lần đầu / làm lại
__Trigger__: SM / GĐK mở dự án trạng thái "Chưa có PAKD" (mới cấp mã hoặc bị từ chối)
__Related UC__: [[docs/phuong-an-kinh-doanh/usecases/uc-lap-gui-pakd.md]]
__Related FR__: FR-phuong-an-kinh-doanh-002, FR-phuong-an-kinh-doanh-011, FR-phuong-an-kinh-doanh-012, FR-phuong-an-kinh-doanh-013, FR-phuong-an-kinh-doanh-014, FR-phuong-an-kinh-doanh-015, FR-phuong-an-kinh-doanh-016, FR-phuong-an-kinh-doanh-017, FR-phuong-an-kinh-doanh-019, FR-phuong-an-kinh-doanh-020, FR-phuong-an-kinh-doanh-021, FR-phuong-an-kinh-doanh-022, FR-phuong-an-kinh-doanh-023, FR-phuong-an-kinh-doanh-038 · Errors: E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010, E-phuong-an-kinh-doanh-012, E-phuong-an-kinh-doanh-013, E-phuong-an-kinh-doanh-014, E-phuong-an-kinh-doanh-016, E-phuong-an-kinh-doanh-017, E-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-019, E-phuong-an-kinh-doanh-020, E-phuong-an-kinh-doanh-021, E-phuong-an-kinh-doanh-022

```mermaid
sequenceDiagram
    actor SM as SM hoặc GĐK
    participant UI as Màn chi tiết dự án
    participant HT as Hệ thống
    SM->>UI: Mở dự án Chưa có PAKD
    UI->>HT: Xác định quyền lập PAKD
    alt Không phải SM, GĐK của khối dự án
        HT-->>UI: Khung chỉ xem, không có nút Lưu nháp và Gửi
        Note over UI,HT: E-phuong-an-kinh-doanh-018 chỉ hiện khi cố thực hiện thao tác ghi
    else SM hoặc GĐK
        HT-->>UI: PAKD đã lưu hoặc form trống điền sẵn, nút Lưu nháp và Gửi Kế toán duyệt
        SM->>UI: Nhập Mục 1 đến 4 hoặc Mốc kế hoạch
        UI->>HT: Tính chỉ số, biểu đồ, tóm tắt, cảnh báo E-phuong-an-kinh-doanh-017 nếu giai đoạn thiếu hoặc sai Từ Đến
        alt Lưu nháp
            SM->>UI: Bấm Lưu nháp
            UI->>HT: Lưu PAKD kèm người và thời điểm, chỉ kiểm giới hạn nhập
            alt Dự án không còn Chưa có PAKD
                HT-->>UI: E-phuong-an-kinh-doanh-019, không lưu, tự nạp lại dự án và khung
            else Ghi không trọn vẹn
                HT-->>UI: E-phuong-an-kinh-doanh-020, giữ nội dung đang nhập
            else Ghi thành công
                HT-->>UI: Lịch sử Lưu nháp PAKD, trạng thái giữ nguyên
                UI-->>SM: Toast Đã lưu nháp PAKD
            end
        else Gửi Kế toán duyệt
            SM->>UI: Bấm Gửi Kế toán duyệt
            UI->>HT: Kiểm tra theo tình trạng và giới hạn nhập
            alt Có lỗi E-phuong-an-kinh-doanh-001 đến E-phuong-an-kinh-doanh-010 hoặc E-phuong-an-kinh-doanh-021
                HT-->>UI: Danh sách lỗi
                UI-->>SM: Dải đỏ Chưa gửi được - cần bổ sung, cuộn tới khung
            else Tại lúc gửi dự án vừa Pending, PAKD vừa được gửi hoặc P-03 vừa đổi Mục 1
                HT-->>UI: E-phuong-an-kinh-doanh-019, không gửi
                UI-->>SM: Dữ liệu vừa được người khác cập nhật - đã tải lại, khung nạp theo dữ liệu mới
            else Ghi không trọn vẹn
                HT-->>UI: E-phuong-an-kinh-doanh-020, không đổi gì
                UI-->>SM: Thao tác chưa thực hiện được, vui lòng thử lại
            else Hợp lệ, ghi trọn vẹn
                HT->>HT: Lưu PAKD, dự án sang PAKD chờ duyệt
                HT->>HT: Thêm phiên bản Chờ CFO số Vn bằng số bản đã duyệt cộng 1
                HT->>HT: Lưu bản chụp nội dung lúc nộp
                HT-->>UI: Lịch sử Nộp PAKD
                UI-->>SM: Toast Đã gửi PAKD Vn - chờ Kế toán (CFO) duyệt
                Note over HT: Không đồng bộ số liệu PAKD vào dự án ở bước gửi
            end
        end
    end
```

```mermaid
flowchart TD
    A["Người dùng mở dự án Chưa có PAKD"] --> Q{"Vai trò SM hoặc GĐK của khối dự án?"}
    Q -->|"Không"| Q1["Khung chỉ xem; E-phuong-an-kinh-doanh-018 chỉ khi cố ghi"]
    Q -->|"Có"| B{"Đã có PAKD lưu trước đó?"}
    B -->|"Có"| C["Nạp PAKD đã lưu"]
    B -->|"Chưa"| D["Form trống điền sẵn từ hợp đồng, thời gian và chi phí kế hoạch của dự án"]
    C --> E["Nhập Mục 1 Thông tin dự án"]
    D --> E
    E --> F{"Tình trạng dự án?"}
    F -->|"Đã ký"| G["Mục 2 Tiến độ, Mục 3 Nghiệm thu, Mục 4 Kế hoạch chi phí theo tháng"]
    F -->|"Chưa ký"| H["Phạm vi, Rủi ro, Mốc kế hoạch"]
    H --> H0{"Giai đoạn có tiền mà thiếu hoặc sai Từ Đến?"}
    H0 -->|"Có"| H3["Cảnh báo cam E-phuong-an-kinh-doanh-017, vẫn cho gửi"]
    H0 -->|"Không"| H1
    H3 --> H1{"Đổi sang Đã ký?"}
    H1 -->|"Có"| H2["Điền sẵn giá trị HĐ, kỳ thực hiện, chuyển giai đoạn sang chi phí tháng nếu chưa có chi phí"]
    H2 --> G
    H1 -->|"Không"| I
    G --> I{"Bấm nút nào?"}
    I -->|"Lưu nháp"| J["Lưu PAKD, chỉ kiểm giới hạn nhập, trạng thái giữ nguyên"]
    I -->|"Gửi Kế toán duyệt"| K{"Hợp lệ theo E-phuong-an-kinh-doanh-001 đến E-phuong-an-kinh-doanh-010 và giới hạn nhập?"}
    K -->|"Không"| L["Dải đỏ liệt kê lỗi, không gửi"]
    L --> E
    K -->|"Có"| K1{"Tại lúc gửi trạng thái và quyền còn đúng?"}
    K1 -->|"Không"| K2["E-phuong-an-kinh-doanh-019, không gửi, tự nạp lại dự án và khung"]
    K1 -->|"Có"| K3{"Ghi trọn vẹn?"}
    K3 -->|"Không"| K4["E-phuong-an-kinh-doanh-020, không đổi gì, bấm lại được"]
    K4 --> E
    K3 -->|"Có"| N["Dự án sang PAKD chờ duyệt, phiên bản Chờ CFO số Vn, lưu bản chụp"]
    N --> O["Lịch sử Nộp PAKD, toast Đã gửi PAKD Vn, chưa đồng bộ số liệu"]
    Q1 --> KetThuc1(["Kết thúc"])
    K2 --> KetThuc1
    J --> KetThuc1
    O --> KetThuc1
```

## Flow: F2 — Kế toán duyệt hoặc từ chối PAKD lần đầu
__Trigger__: Kế toán bấm link Duyệt (danh sách) hoặc nút Duyệt / Từ chối PAKD (dòng thông báo)
__Related UC__: [[docs/phuong-an-kinh-doanh/usecases/uc-duyet-pakd.md]]
__Related FR__: FR-phuong-an-kinh-doanh-029, FR-phuong-an-kinh-doanh-030, FR-phuong-an-kinh-doanh-031, FR-phuong-an-kinh-doanh-032, FR-phuong-an-kinh-doanh-035, FR-phuong-an-kinh-doanh-036, FR-phuong-an-kinh-doanh-038, FR-phuong-an-kinh-doanh-043, FR-phuong-an-kinh-doanh-045 · Errors: E-phuong-an-kinh-doanh-011, E-phuong-an-kinh-doanh-015, E-phuong-an-kinh-doanh-023, E-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-019, E-phuong-an-kinh-doanh-020, E-phuong-an-kinh-doanh-021

```mermaid
sequenceDiagram
    actor KT as Kế toán CFO
    participant UI as Danh sách hoặc chi tiết dự án
    participant P4 as Popup P-04
    participant HT as Hệ thống
    KT->>UI: Bấm Duyệt hoặc Duyệt / Từ chối PAKD
    UI->>HT: Kiểm quyền duyệt
    alt Không phải Kế toán
        HT-->>UI: E-phuong-an-kinh-doanh-018, không mở P-04
    else Kế toán
        UI->>P4: Mở P-04 với số liệu tính từ PAKD đang chờ duyệt
        opt Phiên bản có dấu cập nhật theo HĐ sau khi nộp
            P4-->>KT: Nhãn Cập nhật theo hợp đồng sau khi nộp và so sánh với bản chụp
        end
        opt Dự án đã có hợp đồng, lệch doanh thu bản chờ quá 2%
            P4-->>KT: Giá trị HĐ hiện có x - lệch z% kèm cảnh báo, trước khi bấm Duyệt
        end
        opt Nội dung bản chờ không đạt kiểm tra gửi
            P4-->>KT: E-phuong-an-kinh-doanh-023 liệt kê điểm chưa đạt, không chặn
        end
        alt Từ chối khi Ý kiến trống
            KT->>P4: Bấm Từ chối
            P4-->>KT: E-phuong-an-kinh-doanh-011 Nhập lý do từ chối, popup giữ nguyên
        else Tại lúc ghi phiên bản không còn Chờ CFO hoặc nội dung vừa đổi sau khi mở P-04
            KT->>P4: Bấm Duyệt hoặc Từ chối
            P4->>HT: Ghi quyết định
            HT-->>P4: E-phuong-an-kinh-doanh-019, Kế toán khác vừa quyết định hoặc nội dung vừa cập nhật theo HĐ
            P4-->>KT: Không ghi, tự nạp lại dự án và P-04, giữ Ý kiến
        else Ghi không trọn vẹn
            KT->>P4: Bấm Duyệt hoặc Từ chối
            P4->>HT: Ghi quyết định
            HT-->>P4: E-phuong-an-kinh-doanh-020, không đổi gì
            P4-->>KT: Thao tác chưa thực hiện được, giữ Ý kiến để bấm lại
        else Từ chối có ý kiến
            KT->>P4: Nhập ý kiến, bấm Từ chối
            P4->>HT: Ghi quyết định từ chối
            HT->>HT: Phiên bản Từ chối, dự án PAKD chờ duyệt về Chưa có PAKD, dự án Pending giữ Pending
            HT-->>UI: Lịch sử CFO từ chối PAKD
            UI-->>KT: Toast Kế toán đã từ chối PAKD Vn - trả về GĐK lập lại
        else Duyệt
            KT->>P4: Bấm Duyệt (ý kiến tuỳ chọn)
            P4->>HT: Ghi quyết định duyệt
            HT->>HT: Phiên bản Đã duyệt, đồng bộ số liệu PAKD vào dự án
            opt PAKD Đã ký và dự án chưa có hợp đồng tại lúc ghi
                HT->>HT: Tạo hợp đồng ban đầu, Version dự án cộng 1 đúng một lần, lịch sử Tạo hợp đồng từ PAKD Vn
            end
            HT->>HT: Dự án sang Đang thực hiện
            HT-->>UI: Lịch sử CFO duyệt PAKD
            UI-->>KT: Toast Kế toán đã duyệt PAKD Vn - dự án chuyển Đang thực hiện
        end
    end
```

```mermaid
flowchart TD
    A["Dự án PAKD chờ duyệt hoặc Pending có bản Chờ CFO"] --> B{"Người dùng là Kế toán CFO?"}
    B -->|"Không"| C["Chỉ thấy dòng Đang chờ Kế toán (CFO) duyệt PAKD Vn"]
    B -->|"Có"| D["Mở P-04, số liệu tính từ PAKD đang chờ"]
    D --> D1{"Có dấu cập nhật theo HĐ sau khi nộp?"}
    D1 -->|"Có"| D2["Hiện nhãn và so sánh với bản chụp lúc nộp"]
    D1 -->|"Không"| D3
    D2 --> D3{"Dự án đã có HĐ và lệch quá 2%?"}
    D3 -->|"Có"| D4["Hiện Giá trị HĐ hiện có x - lệch z% kèm cảnh báo"]
    D3 -->|"Không"| E
    D4 --> E{"Kế toán chọn?"}
    E -->|"Huỷ"| F["Đóng popup, không đổi gì"]
    E -->|"Từ chối"| G{"Ý kiến có nội dung?"}
    G -->|"Không"| H["E-phuong-an-kinh-doanh-011 Nhập lý do từ chối"]
    H --> E
    G -->|"Có"| VT{"Tại lúc ghi phiên bản còn Chờ CFO, nội dung chưa đổi và ghi trọn vẹn?"}
    VT -->|"Không"| V1["E-phuong-an-kinh-doanh-019 tự nạp lại hoặc E-phuong-an-kinh-doanh-020, không ghi, giữ Ý kiến"]
    VT -->|"Có"| I["Phiên bản Từ chối kèm ý kiến"]
    E -->|"Duyệt"| VD{"Tại lúc ghi phiên bản còn Chờ CFO, nội dung chưa đổi và ghi trọn vẹn?"}
    VD -->|"Không"| V1
    I --> I1{"Dự án đang Pending?"}
    I1 -->|"Có"| I2["Giữ Pending, chờ Kế toán mở lại"]
    I1 -->|"Không"| I3["Dự án về Chưa có PAKD, SM hoặc GĐK lập lại"]
    VD -->|"Có"| K["Phiên bản Đã duyệt, đồng bộ số liệu PAKD vào dự án"]
    K --> K1{"PAKD Đã ký?"}
    K1 -->|"Không"| L["Dự án sang Đang thực hiện"]
    K1 -->|"Có"| K2{"Dự án đã có hợp đồng?"}
    K2 -->|"Chưa"| K3["Tạo hợp đồng ban đầu, Version cộng 1 đúng một lần"]
    K2 -->|"Có"| K4["Không ghi đè, cảnh báo E-phuong-an-kinh-doanh-015 nếu lệch quá 2%"]
    K3 --> L
    K4 --> L
    I2 --> M["Ghi lịch sử, toast"]
    I3 --> M
    L --> M
    C --> KetThuc2(["Kết thúc"])
    V1 --> KetThuc2
    F --> KetThuc2
    M --> KetThuc2
```

## Flow: F3 — Điều chỉnh PAKD đã duyệt
__Trigger__: SM / GĐK bấm Sửa PAKD (góc khung) hoặc Sửa PAKD / Tiếp tục sửa PAKD (dòng thông báo)
__Related UC__: [[docs/phuong-an-kinh-doanh/usecases/uc-dieu-chinh-pakd.md]]
__Related FR__: FR-phuong-an-kinh-doanh-020, FR-phuong-an-kinh-doanh-024, FR-phuong-an-kinh-doanh-025, FR-phuong-an-kinh-doanh-026, FR-phuong-an-kinh-doanh-027, FR-phuong-an-kinh-doanh-028, FR-phuong-an-kinh-doanh-033, FR-phuong-an-kinh-doanh-034, FR-phuong-an-kinh-doanh-038, FR-phuong-an-kinh-doanh-047 · Errors: E-phuong-an-kinh-doanh-001…E-phuong-an-kinh-doanh-010, E-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-019, E-phuong-an-kinh-doanh-020, E-phuong-an-kinh-doanh-021

```mermaid
sequenceDiagram
    actor SM as SM hoặc GĐK
    participant UI as Khung PAKD trên màn chi tiết
    participant HT as Hệ thống
    SM->>UI: Bấm Sửa PAKD
    UI-->>SM: Chế độ điều chỉnh, dải xanh Đang sửa PAKD, nút Huỷ sửa, Lưu nháp, Gửi điều chỉnh
    SM->>UI: Sửa nội dung (Đã ký thì không chọn lại Chưa ký)
    alt Lưu nháp
        UI->>HT: Lưu bản điều chỉnh, chỉ kiểm giới hạn nhập
        alt Bản điều chỉnh vừa được người khác gửi hoặc huỷ
            HT-->>UI: E-phuong-an-kinh-doanh-019, không ghi đè bản đã gửi, tự nạp lại dự án và khung
        else Ghi không trọn vẹn
            HT-->>UI: E-phuong-an-kinh-doanh-020, giữ nội dung đang nhập
        else Ghi thành công
            HT-->>UI: Lịch sử Lưu nháp điều chỉnh PAKD
            UI-->>SM: Toast Đã lưu nháp bản điều chỉnh PAKD
        end
    else Gửi Kế toán duyệt điều chỉnh
        UI->>HT: Kiểm tra theo tình trạng và giới hạn nhập
        alt Có lỗi E-phuong-an-kinh-doanh-001 đến E-phuong-an-kinh-doanh-010 hoặc E-phuong-an-kinh-doanh-021
            UI-->>SM: Dải đỏ liệt kê lỗi
        else Trạng thái đã đổi
            HT-->>UI: E-phuong-an-kinh-doanh-019, không gửi, tự nạp lại dự án và khung
        else Ghi không trọn vẹn
            HT-->>UI: E-phuong-an-kinh-doanh-020, giữ nội dung đang nhập
        else Hợp lệ
            HT->>HT: Lưu bản điều chỉnh, phiên bản Chờ CFO đánh dấu điều chỉnh, lưu bản chụp
            HT-->>UI: Lịch sử Gửi điều chỉnh PAKD, dự án vẫn Đang thực hiện
            UI-->>SM: Toast Đã gửi bản điều chỉnh PAKD Vn - chờ Kế toán (CFO) duyệt lại
        end
    else Huỷ
        alt Chưa có bản điều chỉnh lưu
            UI-->>SM: Thoát chế độ sửa, nạp lại PAKD đang áp dụng
        else Đã có bản điều chỉnh nháp hoặc bị từ chối
            UI->>HT: Bỏ bản điều chỉnh khỏi dự án
            HT->>HT: Phiên bản bị từ chối của bản này đánh dấu đã huỷ (nếu có)
            HT-->>UI: Lịch sử Huỷ bản điều chỉnh PAKD, hiển thị bản đang áp dụng
            UI-->>SM: Toast Đã huỷ bản điều chỉnh PAKD
        end
    end
```

```mermaid
flowchart TD
    A["Dự án Đang thực hiện"] --> B{"Vai trò SM hoặc GĐK của khối dự án?"}
    B -->|"Không"| C["Chỉ xem PAKD đã duyệt"]
    B -->|"Có"| D{"Đang có bản điều chỉnh Chờ CFO?"}
    D -->|"Có"| E["Chỉ xem bản điều chỉnh, dải vàng chờ duyệt"]
    D -->|"Không"| F["Bấm Sửa PAKD hoặc Tiếp tục sửa PAKD"]
    F --> G["Sửa nội dung trên khung"]
    G --> H{"Bấm nút nào?"}
    H -->|"Lưu nháp"| I["Lưu bản điều chỉnh, số liệu dự án giữ nguyên"]
    I --> G
    H -->|"Gửi điều chỉnh"| J{"Hợp lệ?"}
    J -->|"Không"| K["Dải đỏ lỗi"]
    K --> G
    J -->|"Có"| J1{"Tại lúc gửi còn hợp lệ và ghi trọn vẹn?"}
    J1 -->|"Không"| J2["E-phuong-an-kinh-doanh-019 tự nạp lại, hoặc E-phuong-an-kinh-doanh-020 giữ nội dung"]
    J2 --> G
    J1 -->|"Có"| L["Phiên bản điều chỉnh Chờ CFO số Vn, lưu bản chụp"]
    L --> E
    H -->|"Huỷ"| M{"Đã có bản điều chỉnh lưu?"}
    M -->|"Không"| N["Thoát sửa, nạp lại bản đang áp dụng"]
    M -->|"Có"| O["Bỏ bản điều chỉnh, giữ bản đang áp dụng"]
    O --> O1["Danh sách và meta hiện phiên bản đang áp dụng V đã duyệt"]
    C --> KetThuc3(["Kết thúc"])
    E --> KetThuc3
    N --> KetThuc3
    O1 --> KetThuc3
```

## Flow: F4 — Kế toán duyệt hoặc từ chối bản điều chỉnh
__Trigger__: Kế toán bấm link Duyệt điều chỉnh (danh sách) hoặc nút Duyệt / Từ chối điều chỉnh (dòng thông báo)
__Related UC__: [[docs/phuong-an-kinh-doanh/usecases/uc-duyet-dieu-chinh-pakd.md]]
__Related FR__: FR-phuong-an-kinh-doanh-029, FR-phuong-an-kinh-doanh-030, FR-phuong-an-kinh-doanh-031, FR-phuong-an-kinh-doanh-032, FR-phuong-an-kinh-doanh-043, FR-phuong-an-kinh-doanh-045 · Errors: E-phuong-an-kinh-doanh-011, E-phuong-an-kinh-doanh-015, E-phuong-an-kinh-doanh-023, E-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-019, E-phuong-an-kinh-doanh-020

```mermaid
sequenceDiagram
    actor KT as Kế toán CFO
    participant P4 as Popup P-04
    participant HT as Hệ thống
    actor SM as SM hoặc GĐK
    KT->>P4: Mở từ Duyệt điều chỉnh
    P4-->>KT: So sánh cũ sang mới: tình trạng HĐ, doanh thu, chi phí, LN gộp, số HĐ
    opt Có dấu cập nhật theo HĐ sau khi nộp, hoặc dự án có HĐ lệch quá 2%
        P4-->>KT: Nhãn và so sánh 8 trường với bản chụp, dòng Giá trị HĐ hiện có x - lệch z%
    end
    opt Bản điều chỉnh không đạt kiểm tra gửi, thường là bản sinh từ P-03
        P4-->>KT: E-phuong-an-kinh-doanh-023 liệt kê điểm chưa đạt, không chặn
    end
    alt Từ chối khi Ý kiến trống
        KT->>P4: Bấm Từ chối
        P4-->>KT: E-phuong-an-kinh-doanh-011, popup giữ nguyên
    else Tại lúc ghi đã có quyết định khác, nội dung vừa đổi, hoặc ghi lỗi
        KT->>P4: Bấm Duyệt hoặc Từ chối
        P4-->>KT: E-phuong-an-kinh-doanh-019 tự nạp lại hoặc E-phuong-an-kinh-doanh-020, không đổi gì, giữ Ý kiến
    else Từ chối có ý kiến
        KT->>P4: Nhập ý kiến, bấm Từ chối
        P4->>HT: Ghi quyết định từ chối
        HT->>HT: Phiên bản Từ chối, giữ PAKD đang áp dụng, giữ bản điều chỉnh
        HT-->>KT: Toast Kế toán đã từ chối bản điều chỉnh PAKD Vn - giữ bản đang áp dụng
        HT-->>SM: Khung hiện Điều chỉnh bị từ chối kèm ý kiến
    else Duyệt
        KT->>P4: Bấm Duyệt
        P4->>HT: Ghi quyết định duyệt
        HT->>HT: Áp số liệu bản điều chỉnh vào dự án, bản điều chỉnh thành PAKD đang áp dụng
        opt Bản mới Đã ký và dự án chưa có hợp đồng
            HT->>HT: Tạo hợp đồng ban đầu, Version dự án cộng 1
        end
        HT-->>KT: Toast Kế toán đã duyệt bản điều chỉnh PAKD Vn - đã cập nhật số liệu dự án
    end
```

```mermaid
flowchart TD
    A["Bản điều chỉnh Chờ CFO, dự án Đang thực hiện"] --> B["Kế toán mở P-04 so sánh cũ sang mới"]
    B --> C{"Quyết định?"}
    C -->|"Huỷ"| C1["Đóng popup, không đổi gì"]
    C -->|"Từ chối, ý kiến trống"| D["E-phuong-an-kinh-doanh-011 Nhập lý do từ chối"]
    D --> C
    C -->|"Từ chối có ý kiến"| E["Phiên bản Từ chối, giữ bản đang áp dụng và bản điều chỉnh"]
    E --> F["SM hoặc GĐK sửa tiếp rồi gửi lại cùng số V, hoặc huỷ bản điều chỉnh"]
    C -->|"Duyệt"| H["Áp doanh thu, chi phí, kế hoạch tháng của bản mới vào dự án"]
    H --> H1{"Bản mới Đã ký và dự án chưa có hợp đồng?"}
    H1 -->|"Có"| H2["Tạo hợp đồng ban đầu, Version cộng 1"]
    H1 -->|"Không"| I
    H2 --> I["Bản mới thành PAKD đang áp dụng, phiên bản Đã duyệt"]
    C1 --> KetThuc4(["Kết thúc"])
    F --> KetThuc4
    I --> KetThuc4
```

## Flow: F5 — Đồng bộ hợp đồng (P-03) xuống PAKD
__Trigger__: Người dùng lưu popup P-03 (thuộc `quan-ly-du-an-kinh-doanh`)
__Related UC__: [[docs/phuong-an-kinh-doanh/usecases/uc-dong-bo-hop-dong-vao-pakd.md]]
__Related FR__: FR-phuong-an-kinh-doanh-003, FR-phuong-an-kinh-doanh-037, FR-phuong-an-kinh-doanh-038, FR-phuong-an-kinh-doanh-041, FR-phuong-an-kinh-doanh-042, FR-phuong-an-kinh-doanh-043, FR-phuong-an-kinh-doanh-046 · Errors: E-phuong-an-kinh-doanh-018, E-phuong-an-kinh-doanh-019, E-phuong-an-kinh-doanh-020, E-phuong-an-kinh-doanh-023, E-phuong-an-kinh-doanh-024

```mermaid
sequenceDiagram
    actor ND as SM, GĐK hoặc Kế toán
    participant P3 as Popup P-03
    participant HT as Hệ thống
    participant KP as Khung PAKD
    ND->>P3: Nhập số HĐ, ngày ký, giá trị, thời hạn, bấm Lưu
    P3->>HT: Lưu hợp đồng
    alt Người dùng vai trò AM hoặc dự án Kết thúc
        HT-->>P3: P-03 chỉ xem, không lưu, E-phuong-an-kinh-doanh-018 nếu cố ghi
    else Ghi không trọn vẹn
        HT-->>P3: E-phuong-an-kinh-doanh-020, hợp đồng và PAKD không đổi, giữ dữ liệu đang nhập
    else SM, GĐK hoặc Kế toán, ghi thành công
        HT->>HT: Lưu hợp đồng, dự án đánh dấu đã ký, tăng Version dự án
        HT->>HT: Xác định bản nhận theo tình trạng PAKD tại lúc ghi
        alt Không có trường ánh xạ nào khác bản nhận
            Note over HT: Chỉ lưu hợp đồng, PAKD và phiên bản giữ nguyên
        else a. Đã có PAKD duyệt, chưa có bản điều chỉnh đang mở
            HT->>HT: Sinh bản điều chỉnh từ PAKD đang áp dụng, Mục 1 và kỳ theo HĐ
            HT->>HT: Phiên bản Chờ CFO đánh dấu điều chỉnh kể cả khi chưa đạt kiểm tra gửi, lưu bản chụp
            HT->>HT: Người nộp là người lưu P-03, lịch sử Gửi điều chỉnh PAKD Vn theo hợp đồng
            Note over HT: Số liệu dự án giữ theo bản đang áp dụng tới khi Kế toán duyệt, điểm chưa đạt hiện ở P-04
        else b hoặc d. Bản lần đầu hoặc bản điều chỉnh đang chờ duyệt
            HT->>HT: Cập nhật Mục 1 và kỳ của bản đang chờ theo HĐ
            HT->>HT: Dấu Cập nhật theo hợp đồng sau khi nộp, giữ số V và bản chụp
            HT->>HT: Lịch sử Cập nhật PAKD theo hợp đồng, bản đang chờ Vn
        else c. Chưa có PAKD duyệt, có bản đang lập
            HT->>HT: Cập nhật Mục 1 và kỳ của bản đang lập, lịch sử bản đang lập
        else e. Bản điều chỉnh nháp hoặc bị từ chối
            HT->>HT: Cập nhật Mục 1 và kỳ của chính bản đó, giữ phần đang soạn
            HT->>HT: Lịch sử Cập nhật PAKD theo hợp đồng, bản điều chỉnh đang soạn
        else g. Chưa có bản PAKD nào
            Note over HT: Chỉ lưu hợp đồng, Mục 1 nạp sẵn khi lập lần đầu
        end
        HT-->>KP: Khung PAKD nạp lại nội dung, người khác đang mở thấy E-phuong-an-kinh-doanh-024
    end
```

```mermaid
flowchart TD
    A["Người dùng bấm Lưu P-03"] --> A1{"Kế toán, hoặc SM, GĐK của khối dự án, và dự án chưa Kết thúc?"}
    A1 -->|"Không"| A2["P-03 chỉ xem, không lưu; E-phuong-an-kinh-doanh-018 nếu cố ghi"]
    A1 -->|"Có"| A3["Lưu hợp đồng, dự án đã ký, Version cộng 1"]
    A3 --> B0{"Có trường ánh xạ khác bản nhận?"}
    B0 -->|"Không"| H["Chỉ lưu hợp đồng, PAKD giữ nguyên"]
    B0 -->|"Có"| B{"Tình trạng PAKD tại lúc ghi?"}
    B -->|"a. Đã có PAKD duyệt, không có bản điều chỉnh mở"| C["Sinh bản điều chỉnh: PAKD đang áp dụng với Mục 1 và kỳ theo HĐ"]
    C --> C1["Luôn Chờ CFO kể cả chưa đạt kiểm tra gửi, lưu bản chụp, lịch sử Gửi điều chỉnh PAKD Vn theo hợp đồng"]
    B -->|"b hoặc d. Có bản đang chờ duyệt"| E["Cập nhật Mục 1 và kỳ bản đang chờ, dấu Cập nhật theo hợp đồng sau khi nộp"]
    B -->|"c. Có bản đang lập"| G["Cập nhật Mục 1 và kỳ PAKD đang lập, không sinh phiên bản"]
    B -->|"e. Bản điều chỉnh nháp hoặc bị từ chối"| G2["Cập nhật Mục 1 và kỳ của chính bản đó, giữ phần đang soạn"]
    B -->|"g. Chưa có bản nào"| H2["Chỉ lưu hợp đồng, Mục 1 nạp sẵn khi lập lần đầu"]
    E --> L["Lịch sử Cập nhật PAKD theo hợp đồng"]
    G --> L
    G2 --> L
    C1 --> I["Khung PAKD nạp lại, báo E-phuong-an-kinh-doanh-024 cho người khác đang mở"]
    L --> I
    A2 --> KetThuc5(["Kết thúc"])
    H --> KetThuc5
    H2 --> KetThuc5
    I --> KetThuc5
```

## Flow: F6 — Nhắc cập nhật hợp đồng
__Trigger__: Hằng ngày theo giờ Việt Nam, hệ thống xét các dự án có PAKD đang áp dụng (đã duyệt) tình trạng Chưa ký mà chưa có hợp đồng
__Related UC__: [[docs/phuong-an-kinh-doanh/usecases/uc-nhac-cap-nhat-hop-dong.md]]
__Related FR__: FR-phuong-an-kinh-doanh-018, FR-phuong-an-kinh-doanh-036, FR-phuong-an-kinh-doanh-039, FR-phuong-an-kinh-doanh-040 · Errors: —

```mermaid
sequenceDiagram
    participant HT as Hệ thống
    actor NN as Người lập PAKD và GĐK khối
    participant DS as Danh sách và dòng thông báo
    HT->>HT: Xét dự án có PAKD Chưa ký đã duyệt, chưa có hợp đồng
    opt Hôm nay là ngày nhắc: 01 tháng dự kiến ký rồi mỗi 7 ngày, hoặc 01 hằng tháng nếu chưa có tháng dự kiến
        HT-->>NN: Dự án mã dự kiến ký HĐ MM/YYYY - cập nhật hợp đồng (P-03)
        Note over HT,NN: Chỉ gửi khi đã có kênh thông báo, OQ-36
    end
    opt Hôm nay đã qua tháng dự kiến ký
        HT-->>DS: Chữ đỏ Quá tháng dự kiến ký MM/YYYY dưới tên dự án và trên dòng thông báo, mọi vai trò kể cả AM
    end
    NN->>HT: Lưu P-03 hợp đồng
    HT-->>DS: Gỡ cảnh báo đỏ, dừng nhắc
```

```mermaid
flowchart TD
    A["Hằng ngày, giờ Việt Nam"] --> B{"PAKD đang áp dụng Chưa ký và dự án chưa có hợp đồng?"}
    B -->|"Không"| Z["Không nhắc, không cảnh báo"]
    B -->|"Có"| B1{"PAKD có tháng dự kiến ký?"}
    B1 -->|"Không"| D2{"Hôm nay là ngày 01?"}
    D2 -->|"Có"| D["Gửi nhắc cho người lập PAKD và GĐK khối"]
    D2 -->|"Không"| H
    B1 -->|"Có"| C{"Hôm nay so với tháng dự kiến ký?"}
    C -->|"Trước ngày 01 tháng dự kiến ký"| Z
    C -->|"Từ ngày 01 tháng dự kiến ký"| C2{"Đúng ngày 01 hoặc cách lần nhắc trước 7 ngày?"}
    C2 -->|"Có"| D
    C2 -->|"Không"| C3
    D --> C3{"Đã qua hết tháng dự kiến ký?"}
    C3 -->|"Có"| E["Chữ đỏ Quá tháng dự kiến ký MM/YYYY ở danh sách và dòng thông báo"]
    C3 -->|"Không"| F
    E --> F{"Đã lưu hợp đồng P-03?"}
    F -->|"Có"| G["Dừng nhắc, gỡ cảnh báo"]
    F -->|"Chưa"| H["Giữ nhắc hoặc cảnh báo tới lần xét sau"]
    Z --> KetThuc6(["Kết thúc"])
    G --> KetThuc6
    H --> KetThuc6
```

## Notes

- Thời điểm "hôm nay" ở mọi flow theo Asia/Ho_Chi_Minh, đếm ngày lịch (NFR-phuong-an-kinh-doanh-005).
- Kiểm quyền (E-phuong-an-kinh-doanh-018 — "Bạn không có quyền thực hiện thao tác này.") chạy ở mọi thao tác ghi, không chỉ ẩn nút (NFR-phuong-an-kinh-doanh-007); vai trò chỉ được xem thấy khung chỉ xem, E-phuong-an-kinh-doanh-018 chỉ hiện khi cố ghi; cơ chế tài khoản chờ OQ-5.
- Mọi thao tác ghi kiểm lại quyền và trạng thái tại lúc thực hiện (NFR-phuong-an-kinh-doanh-011, E-phuong-an-kinh-doanh-019) và ghi trọn vẹn (NFR-phuong-an-kinh-doanh-010, E-phuong-an-kinh-doanh-020); nhánh lỗi vẽ ở F1–F5, áp tương tự cho Huỷ bản điều chỉnh. E-phuong-an-kinh-doanh-019 báo "Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại." và tự nạp lại dự án (khung nạp theo dữ liệu mới, P-04 giữ Ý kiến); E-phuong-an-kinh-doanh-020 giữ nội dung đang nhập để bấm lại (Phase H — Q-21).
- F5: 7 nhánh (a)–(g) theo BR-phuong-an-kinh-doanh-032, khớp `quan-ly-du-an-kinh-doanh` BR-quan-ly-du-an-kinh-doanh-029; chỉ đồng bộ khi có trường khác (BR-phuong-an-kinh-doanh-046). Nhánh (a): bản điều chỉnh sinh ra luôn vào "Chờ CFO" kể cả khi không đạt kiểm tra gửi, P-04 liệt kê điểm chưa đạt (E-phuong-an-kinh-doanh-023) (Phase H — Q-25); người nộp = người lưu P-03, lịch sử "Gửi điều chỉnh PAKD V{n} (theo hợp đồng)" (🔶 quyết định thay người dùng trong review — cần xác nhận). P-03 ghi sau lần Gửi lần đầu thì đi nhánh (b); P-03 ghi trước thì lần Gửi bị E-phuong-an-kinh-doanh-019.
- F2 / F4: nội dung bản đang chờ đổi trong lúc P-04 đang mở → Duyệt / Từ chối bị từ chối (E-phuong-an-kinh-doanh-019), P-04 nạp lại (FR-phuong-an-kinh-doanh-043, Phase H — Q-32).
- Khung PAKD tự nạp lại khi dữ liệu dự án đổi; nạp lại do người khác thì hiện E-phuong-an-kinh-doanh-024 (FR-phuong-an-kinh-doanh-003, Phase H — Q-38).
- Dự án Kết thúc khi còn bản điều chỉnh nháp / bị từ chối: hộp xác nhận Kết thúc báo trước "Dự án còn bản điều chỉnh PAKD chưa gửi — bản này sẽ bị huỷ."; bản điều chỉnh tự huỷ (nội dung được lưu lại), lịch sử "Huỷ bản điều chỉnh PAKD (Kết thúc dự án)" (FR-phuong-an-kinh-doanh-047, Phase H — Q-23, Q-29).
- F6: tác vụ hằng ngày xong trước 06:00, tự bù ngày lỡ, không nhắc trùng (NFR-phuong-an-kinh-doanh-012); người nhận, lịch nhắc và nội dung theo FR-phuong-an-kinh-doanh-039 / BR-phuong-an-kinh-doanh-019 (Phase H — Q-54); kênh gửi chờ OQ-36.
- F6: cảnh báo đỏ chỉ bật khi đã qua hết tháng dự kiến ký (BR-phuong-an-kinh-doanh-043), hiện cả với AM (Phase H — Q-53); có hợp đồng thì cả nhắc lẫn cảnh báo dừng.
