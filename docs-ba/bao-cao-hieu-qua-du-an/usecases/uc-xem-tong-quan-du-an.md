# Use Case: Xem tổng quan hiệu quả một dự án

> Scope: Module Quản trị dự án & Tài chính — màn MH-03, tab "Tổng quan dự án" · Level: User goal (sea-level)

## Primary Actor

Người xem báo cáo (Ban lãnh đạo, GĐK, SM, Kế toán). GĐK / SM chỉ xem dự án khối mình; AM không mở được MH-03, không là actor (BR-bao-cao-hieu-qua-du-an-005, BR-bao-cao-hieu-qua-du-an-037 — Đã chốt Phase H — Q-19, Q-20).

## Stakeholders & Interests

| Stakeholder | Interest |
|-------------|----------|
| GĐK / PM dự án | Theo dõi luỹ kế thực hiện so với kế hoạch cả vòng đời dự án |

## Trigger

Người xem bấm tab "Tổng quan dự án", hoặc bấm 1 dòng dự án ở tab tổng quan.

## Preconditions

- Người xem đã đăng nhập với một vai trò xem báo cáo.
- Có ít nhất 1 dự án thuộc báo cáo.

## Guarantees

- __Minimal Guarantee:__ Không thay đổi dữ liệu.
- __Success Guarantee:__ Người xem thấy thông tin dự án, 5 ô số vòng đời / luỹ kế đến Chốt số đến của chỉ tiêu đang chọn, biểu đồ và bảng từng tháng của chỉ tiêu đó.

## Main Success Scenario

1. Hệ thống chọn dự án mặc định: dự án vừa bấm từ tab tổng quan; nếu không có thì dự án đầu tiên có số thực tế; nếu không có thì dự án đầu tiên. Chỉ tiêu lấy theo chỉ tiêu đang chọn ở tab tổng quan.
2. Người xem chọn dự án trong ô nhóm theo khối (chỉ dự án trong phạm vi dữ liệu của người xem — GĐK / SM: khối mình) và / hoặc đổi chỉ tiêu.
3. Hệ thống xác định vòng đời dự án (tháng đầu đến tháng cuối có Kế hoạch hoặc số thực tế đã ghi nhận; không có thì Start đến End).
4. Hệ thống tính Tổng KH vòng đời, Luỹ kế KH / TT đến chốt số của chỉ tiêu, Còn lại theo KH, Mức thực hiện luỹ kế (nhãn Đạt / Chưa đạt / Vượt KH).
5. Hệ thống hiện khung Thông tin dự án, 5 ô số, biểu đồ "<Chỉ tiêu> theo tháng".
6. Hệ thống hiện bảng từng tháng: Kế hoạch, Thực tế, Chênh lệch, +/- %, luỹ kế, % luỹ kế; tháng chốt số gắn nhãn "Chốt số"; tháng sau chốt số nền xám "–"; dòng "Tổng cộng".

## Extensions

__1a. Không có dự án nào thuộc báo cáo:__
- 1a1. Tab hiện "Chưa có dự án." (E-bao-cao-hieu-qua-du-an-018). Use case kết thúc.

__4a. Luỹ kế KH = 0:__
- 4a1. Mức thực hiện hiện "—", không nhãn.

__4b. Dự án chưa có số thực tế của chỉ tiêu đang chọn:__
- 4b1. Ô Luỹ kế TT hiện "Chưa có số thực tế", ô Mức thực hiện hiện "Chưa phát sinh" (E-bao-cao-hieu-qua-du-an-020).

__4c. Chỉ tiêu đang chọn chưa có Chốt số (chưa dự án nào có số thực tế):__
- 4c1. Ô Luỹ kế KH và Còn lại theo kế hoạch hiện "—", ô Luỹ kế TT "Chưa có số thực tế", ô Mức thực hiện "Chưa phát sinh"; bảng tháng mọi tháng nền xám, Thực tế "–" (BR-bao-cao-hieu-qua-du-an-016).

__6a. Tháng không sau chốt số nhưng dự án chưa có số thực tế của chỉ tiêu ở tháng đó:__
- 6a1. Thực tế, Chênh lệch, +/- % hiện "–"; luỹ kế vẫn cộng dồn với thực tế tính 0.

__5a / 6b. Chỉ tiêu là Chi phí hoặc Dòng tiền thu và người xem bấm số thực tế (khác 0):__
- 5a1. Bấm ô Luỹ kế TT hoặc Thực tế dòng tổng → P-06 từ tháng đầu vòng đời đến chốt số của chỉ tiêu.
- 6b1. Bấm Thực tế 1 tháng → P-06 của tháng đó; bấm Luỹ kế thực tế → P-06 từ tháng đầu đến tháng đó (UC uc-tra-cuu-so-ke-toan).

## Related Requirements

FR-bao-cao-hieu-qua-du-an-003, FR-bao-cao-hieu-qua-du-an-011, FR-bao-cao-hieu-qua-du-an-012, FR-bao-cao-hieu-qua-du-an-013, FR-bao-cao-hieu-qua-du-an-014, FR-bao-cao-hieu-qua-du-an-015, FR-bao-cao-hieu-qua-du-an-016 · BR-bao-cao-hieu-qua-du-an-001, BR-bao-cao-hieu-qua-du-an-003, BR-bao-cao-hieu-qua-du-an-007, BR-bao-cao-hieu-qua-du-an-015, BR-bao-cao-hieu-qua-du-an-016, BR-bao-cao-hieu-qua-du-an-017, BR-bao-cao-hieu-qua-du-an-018, BR-bao-cao-hieu-qua-du-an-019, BR-bao-cao-hieu-qua-du-an-034, BR-bao-cao-hieu-qua-du-an-035, BR-bao-cao-hieu-qua-du-an-036 · E-bao-cao-hieu-qua-du-an-017, E-bao-cao-hieu-qua-du-an-018, E-bao-cao-hieu-qua-du-an-020 · OQ-4
