window.FEATURE = "bao-cao-hieu-qua-du-an";
window.UPDATED = "2026-10-03";
window.CHECKLISTS_DATA = [
  {
    "scope": "uc",
    "target": "xem-tong-quan-khoi",
    "file": "checklist-uc-xem-tong-quan-khoi.md",
    "items": [
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-001",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-001",
          "FR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Truy cập màn & thanh tiêu đề",
        "priority": 1,
        "auto": "Yes",
        "text": "Ban lãnh đạo chọn menu \"Quản trị dự án & Tài chính → Báo cáo hiệu quả dự án\" mở màn MH-03 với tab \"Tổng quan cả khối / công ty\" đang chọn",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-002",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Truy cập màn & thanh tiêu đề",
        "priority": 2,
        "auto": "Yes",
        "text": "Thanh tiêu đề MH-03 hiển thị đủ đường dẫn \"Quản trị dự án & Tài chính › Báo cáo hiệu quả dự án\", tiêu đề \"Báo cáo hiệu quả dự án\", dòng meta Chốt số và meta Số dự án"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-003",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-001",
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Truy cập màn & thanh tiêu đề",
        "priority": 1,
        "auto": "Yes",
        "text": "Kế toán mở MH-03 thấy nút Import sổ kế toán trên thanh tiêu đề",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-004",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-002",
          "BR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Meta Chốt số",
        "priority": 1,
        "auto": "Yes",
        "text": "Dữ liệu có số thực tế DT đến tháng 06, CP đến 08, DTT đến 07, KLCV đến 05: meta hiển thị \"Chốt số: DT 06/YYYY · CP 08/YYYY · DTT 07/YYYY · KLCV 05/YYYY\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-005",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-002",
          "E-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Meta Chốt số",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu KLCV chưa có số thực tế ở dự án nào: meta Chốt số hiện \"—\" ở vị trí KLCV",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-006",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Meta Chốt số",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK khối G1 mở MH-03 khi dòng Chi thực tế mới nhất (tháng 08) chỉ thuộc dự án khối G2: meta Chốt số CP vẫn là 08/YYYY (tính chung toàn công ty)",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-007",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-003",
          "BR-bao-cao-hieu-qua-du-an-036"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Meta Chốt số",
        "priority": 2,
        "auto": "Yes",
        "text": "Tháng mới nhất có Chi phí thực tế là 09 với số ghi nhận bằng 0: meta Chốt số CP là 09/YYYY"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-008",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-003",
          "BR-bao-cao-hieu-qua-du-an-036"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Meta Chốt số",
        "priority": 2,
        "auto": "Yes",
        "text": "Doanh thu tháng 10 còn \"chưa có số\" ở mọi dự án, tháng 09 đã ghi nhận: meta Chốt số DT là 09/YYYY"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-009",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Meta Chốt số",
        "priority": 3,
        "auto": "Yes",
        "text": "Meta Chốt số chỉ hiển thị, người dùng không chọn / sửa được giá trị"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-010",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-001",
          "BR-bao-cao-hieu-qua-du-an-005",
          "BR-bao-cao-hieu-qua-du-an-034"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Meta Số dự án",
        "priority": 1,
        "auto": "Yes",
        "text": "Kế toán mở MH-03: meta Số dự án bằng số dự án thuộc báo cáo toàn công ty",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-011",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-001",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Meta Số dự án",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK khối G1 mở MH-03: meta Số dự án chỉ đếm dự án thuộc báo cáo khối G1"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-012",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Mở màn báo cáo",
        "subcategory": "Meta Số dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Kế toán đổi Phạm vi xem từ Toàn công ty sang Khối G1: meta Số dự án giữ nguyên số toàn công ty"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-013",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-034",
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Dự án có mặt trên báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án có 1 phiên bản PAKD được Kế toán duyệt có dòng trong bảng \"Chi tiết theo dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-014",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-034"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Dự án có mặt trên báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án chưa có PAKD được duyệt nhưng đã có Chi thực tế từ sổ kế toán có dòng trong bảng",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-015",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-034",
          "BR-bao-cao-hieu-qua-du-an-036"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Dự án có mặt trên báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án chưa có PAKD được duyệt nhưng đã có Doanh thu thực tế do Kế toán import có dòng trong bảng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-016",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-034",
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Dự án có mặt trên báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án ở trạng thái Chờ duyệt mã không có dòng trong bảng",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-017",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-034",
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Dự án có mặt trên báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án Chưa có PAKD, chưa có số thực tế, không có dòng trong bảng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-018",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-034",
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Dự án có mặt trên báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án có PAKD đang chờ duyệt (chưa từng được duyệt, chưa có số thực tế) không có dòng trong bảng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-019",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Dự án có mặt trên báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án có PAKD bị từ chối (chưa từng được duyệt, chưa có số thực tế) không có dòng trong bảng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-020",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-034"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Dự án có mặt trên báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án đã từng được duyệt PAKD, nay ở trạng thái Kết thúc vẫn có dòng trong bảng",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-021",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-034"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Dự án có mặt trên báo cáo",
        "priority": 2,
        "auto": "Yes",
        "text": "Dự án đã từng được duyệt PAKD, nay ở trạng thái Pending vẫn có dòng trong bảng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-022",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 1,
        "auto": "Yes",
        "text": "Cột Kế hoạch Doanh thu của dự án bằng kế hoạch theo tháng của phiên bản PAKD được Kế toán duyệt gần nhất",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-023",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 1,
        "auto": "Yes",
        "text": "Kế toán duyệt PAKD điều chỉnh: cột Kế hoạch của dự án đổi theo bản điều chỉnh",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-024",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án có PAKD điều chỉnh đang chờ duyệt: cột Kế hoạch giữ theo phiên bản được duyệt trước đó",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-025",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án có PAKD điều chỉnh bị từ chối: cột Kế hoạch giữ theo phiên bản được duyệt trước đó"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-026",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 2,
        "auto": "Yes",
        "text": "Kế toán duyệt PAKD sinh ra 0 tháng kế hoạch: cột Kế hoạch giữ kế hoạch cũ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-027",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 1,
        "auto": "Yes",
        "text": "PAKD \"Đã ký\": Kế hoạch Doanh thu rơi vào tháng mốc nghiệm thu",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-028",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 1,
        "auto": "Yes",
        "text": "PAKD \"Đã ký\": Kế hoạch Dòng tiền thu rơi vào tháng thu tiền"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-029",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033",
          "BR-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 1,
        "auto": "Yes",
        "text": "PAKD \"Đã ký\": Kế hoạch Chi phí từng tháng bằng Chi SX + Chi KD theo kế hoạch chi phí tháng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-030",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 1,
        "auto": "Yes",
        "text": "PAKD \"Chưa ký\": Kế hoạch Chi phí chia đều theo giai đoạn",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-031",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-033"
        ],
        "category": "Dự án thuộc báo cáo & nguồn Kế hoạch",
        "subcategory": "Nguồn số Kế hoạch",
        "priority": 1,
        "auto": "Yes",
        "text": "PAKD \"Chưa ký\": Kế hoạch Doanh thu và Kế hoạch Dòng tiền thu đều bằng 0"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-032",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-004",
          "FR-bao-cao-hieu-qua-du-an-004"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Kỳ mặc định",
        "priority": 1,
        "auto": "Yes",
        "text": "Chốt số DT 06, CP 08, DTT 07, KLCV 05: ô Đến tháng mặc định 08/YYYY (chốt số muộn nhất)",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-033",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-004"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Kỳ mặc định",
        "priority": 1,
        "auto": "Yes",
        "text": "Đến tháng mặc định 08/YYYY: ô Từ tháng mặc định 01/YYYY cùng năm"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-034",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-004"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Kỳ mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Chưa chỉ tiêu nào có Chốt số: kỳ mặc định Từ 01 đến 12 của năm hiện tại"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-035",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-004",
          "NFR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Kỳ mặc định",
        "priority": 2,
        "auto": "No",
        "text": "Mở màn lúc 01h ngày 01/01 giờ Việt Nam (máy đặt múi giờ UTC), chưa có Chốt số: kỳ mặc định thuộc năm mới"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-036",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-004"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Kỳ mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Đổi chỉ tiêu ở nút gạt biểu đồ: Từ tháng, Đến tháng mặc định không đổi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-037",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-004"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Chỉnh Từ tháng / Đến tháng",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô Từ tháng không cho chọn tháng lớn hơn Đến tháng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-038",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-004"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Chỉnh Từ tháng / Đến tháng",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô Đến tháng không cho chọn tháng nhỏ hơn Từ tháng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-039",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-004"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Chỉnh Từ tháng / Đến tháng",
        "priority": 3,
        "auto": "Yes",
        "text": "Xoá trống ô Từ tháng: ô giữ giá trị cũ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-040",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-004"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Chỉnh Từ tháng / Đến tháng",
        "priority": 3,
        "auto": "Yes",
        "text": "Xoá trống ô Đến tháng: ô giữ giá trị cũ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-041",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-004",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Kế toán mở ô Phạm vi xem thấy đủ: Toàn công ty, Khối G1, G2, G3, G4, BFSI, GPDV",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-042",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-004",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Ban lãnh đạo mở ô Phạm vi xem thấy đủ: Toàn công ty, Khối G1, G2, G3, G4, BFSI, GPDV"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-043",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-004",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Kế toán mở màn: Phạm vi xem mặc định \"Toàn công ty\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-044",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-004",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Ban lãnh đạo mở màn: Phạm vi xem mặc định \"Toàn công ty\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-045",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-004",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK khối G1 mở màn: ô Phạm vi xem cố định \"Khối G1\", không chọn được khối khác",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-046",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-004",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "SM khối G3 mở màn: ô Phạm vi xem cố định \"Khối G3\", không chọn được khối khác"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-047",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-004",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Kế toán chọn Phạm vi \"Khối G2\": bảng \"Chi tiết theo dự án\" chỉ còn dự án thuộc báo cáo có khối G2",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-048",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-004",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Kế toán chọn Phạm vi \"Khối G2\": ô Doanh thu chỉ cộng số của dự án khối G2"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-049",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-004",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 2,
        "auto": "Yes",
        "text": "Kế toán chọn Phạm vi \"Khối G2\", trục \"Theo dự án\": biểu đồ chỉ có cột của dự án khối G2"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-050",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Phạm vi xem theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Phạm vi \"Toàn công ty\": bảng gồm dự án thuộc báo cáo của cả 6 khối"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-051",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-002",
          "FR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Kỳ so sánh từng chỉ tiêu",
        "priority": 1,
        "auto": "Yes",
        "text": "Kỳ 01–12, Chốt số DT 06: ô Doanh thu cộng Thực tế và Kế hoạch các tháng 01–06",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-052",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Kỳ so sánh từng chỉ tiêu",
        "priority": 1,
        "auto": "Yes",
        "text": "Đến tháng 04, Chốt số CP 08: ô Chi phí cộng các tháng 01–04 (min của Đến tháng và chốt số)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-053",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Kỳ so sánh & Phạm vi xem",
        "subcategory": "Kỳ so sánh từng chỉ tiêu",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu Dòng tiền thu chưa có Chốt số, kỳ 01–12: dòng \"Kế hoạch\" của ô Dòng tiền thu vẫn hiện, cộng Kế hoạch các tháng 01–12"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-054",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 2,
        "auto": "Yes",
        "text": "Tab tổng quan hiển thị đủ 5 ô: Biên lợi nhuận gộp, Doanh thu (VNĐ), Chi phí (VNĐ), Dòng tiền thu (VNĐ), Khối lượng công việc (SP)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-055",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Doanh thu: số to bằng Σ Doanh thu thực tế trong kỳ so sánh của Doanh thu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-056",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Doanh thu: dòng dưới hiện \"Kế hoạch {Σ KH}\" bằng Σ Kế hoạch Doanh thu trong kỳ so sánh của Doanh thu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-057",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005",
          "BR-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Chi phí: số to bằng Σ (Chi sản xuất + Chi kinh doanh) thực tế trong kỳ so sánh của Chi phí",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-058",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Dòng tiền thu: số to bằng Σ tiền thu thực tế trong kỳ so sánh của Dòng tiền thu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-059",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005",
          "BR-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô Khối lượng công việc: số to bằng Σ KLCV thực tế (SP) trong kỳ so sánh của KLCV"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-060",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Doanh thu có TT 90, KH 100: nhãn % hoàn thành hiện \"90.0%\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-061",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Doanh thu có TT ≥ KH: viền và nhãn màu xanh"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-062",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Doanh thu có TT < KH: viền và nhãn màu đỏ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-063",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Chi phí có TT ≤ KH: viền và nhãn màu xanh (chiều đảo ngược)",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-064",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Chi phí có TT > KH: viền và nhãn màu đỏ",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-065",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô Dòng tiền thu có KH = 0: không hiện nhãn %, màu trung tính"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-066",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005",
          "E-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu Dòng tiền thu chưa có Chốt số: ô Dòng tiền thu hiện số to \"—\" kèm \"Chưa có số thực tế\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-067",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005",
          "BR-bao-cao-hieu-qua-du-an-002",
          "E-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Doanh thu, Chi phí, Dòng tiền thu, KLCV",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu Dòng tiền thu chưa có Chốt số: ô Dòng tiền thu không có nhãn %, màu trung tính"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-068",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 1,
        "auto": "Yes",
        "text": "DT thực tế 1.000, CP thực tế 700: ô Biên lợi nhuận gộp hiện \"30.0%\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-069",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005",
          "BR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Biên lợi nhuận gộp: dòng dưới hiện \"Kế hoạch x% · (DT − CP) / DT\" với x là biên kế hoạch"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-070",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-006",
          "BR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 1,
        "auto": "Yes",
        "text": "Kỳ 01–12, Chốt số DT 06, CP 08: Biên thực tế bằng (DT 01–06 − CP 01–08) / DT 01–06",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-071",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 2,
        "auto": "Yes",
        "text": "DT thực tế trong kỳ bằng 0: ô Biên lợi nhuận gộp hiện \"—\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-072",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 2,
        "auto": "Yes",
        "text": "DT thực tế trong kỳ bằng 0: ô Biên không có nhãn chênh biên, màu trung tính"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-073",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-006",
          "E-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 1,
        "auto": "Yes",
        "text": "Doanh thu chưa có Chốt số: ô Biên hiện \"—\" kèm \"Chưa có số thực tế\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-074",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-006",
          "E-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 2,
        "auto": "Yes",
        "text": "Chi phí chưa có Chốt số: ô Biên hiện \"—\" kèm \"Chưa có số thực tế\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-075",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 2,
        "auto": "Yes",
        "text": "Biên thực tế 33%, Biên kế hoạch 30%: nhãn chênh biên hiện \"+10.0%\" màu xanh"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-076",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 2,
        "auto": "Yes",
        "text": "Biên thực tế 27%, Biên kế hoạch 30%: nhãn chênh biên hiện \"-10.0%\" màu đỏ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-077",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "5 ô số",
        "subcategory": "Ô Biên lợi nhuận gộp",
        "priority": 3,
        "auto": "Yes",
        "text": "Biên kế hoạch bằng 0: không hiện nhãn chênh biên, màu trung tính"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-078",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số",
        "subcategory": "Bấm số thực tế mở P-06",
        "priority": 2,
        "auto": "Yes",
        "text": "Số thực tế Chi phí khác 0 được gạch chân chấm, rê chuột hiện tooltip \"Xem chi tiết sổ kế toán\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-079",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005",
          "FR-bao-cao-hieu-qua-du-an-016",
          "BR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "5 ô số",
        "subcategory": "Bấm số thực tế mở P-06",
        "priority": 1,
        "auto": "Yes",
        "text": "Kỳ so sánh Chi phí 01–08, Phạm vi Toàn công ty: bấm số thực tế ô Chi phí mở P-06 sổ Chi với kỳ \"Từ tháng 01/YYYY đến tháng 08/YYYY\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-080",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-005",
          "BR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "5 ô số",
        "subcategory": "Bấm số thực tế mở P-06",
        "priority": 1,
        "auto": "Yes",
        "text": "Phạm vi \"Khối G1\": bấm số thực tế ô Dòng tiền thu mở P-06 sổ thu với tiêu đề phạm vi \"Khối G1 · n dự án\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-081",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-019",
          "BR-bao-cao-hieu-qua-du-an-040"
        ],
        "category": "5 ô số",
        "subcategory": "Bấm số thực tế mở P-06",
        "priority": 2,
        "auto": "Yes",
        "text": "Phạm vi Toàn công ty: bấm số thực tế ô Chi phí mở P-06 với tiêu đề phạm vi \"Toàn công ty · n dự án\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-082",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-016",
          "BR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "5 ô số",
        "subcategory": "Bấm số thực tế mở P-06",
        "priority": 2,
        "auto": "Yes",
        "text": "Số thực tế ô Doanh thu không gạch chân, bấm không mở P-06"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-083",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-016",
          "BR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "5 ô số",
        "subcategory": "Bấm số thực tế mở P-06",
        "priority": 2,
        "auto": "Yes",
        "text": "Số thực tế ô Khối lượng công việc bấm không mở P-06"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-084",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "5 ô số",
        "subcategory": "Bấm số thực tế mở P-06",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô Chi phí có số thực tế bằng 0: bấm không mở P-06"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-085",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Nút gạt & mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Khung \"Biểu đồ kế hoạch – thực tế\" có nút gạt chỉ tiêu đủ: Doanh thu · Chi phí · Dòng tiền thu · Khối lượng công việc"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-086",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Nút gạt & mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Khung biểu đồ có nút gạt trục đủ: Theo tháng · Theo dự án"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-087",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Nút gạt & mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở màn lần đầu: biểu đồ chọn sẵn chỉ tiêu Doanh thu, trục Theo tháng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-088",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Nút gạt & mặc định",
        "priority": 3,
        "auto": "Yes",
        "text": "Chỉ tiêu Chi phí: chú giải biểu đồ kèm \"ĐVT: VNĐ\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-089",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Nút gạt & mặc định",
        "priority": 3,
        "auto": "Yes",
        "text": "Chỉ tiêu Khối lượng công việc: chú giải biểu đồ kèm \"ĐVT: SP\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-090",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 2,
        "auto": "Yes",
        "text": "Kỳ 01–12, Chốt số DT 06: trục Theo tháng có đủ 12 nhóm cột tháng 01–12"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-091",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-014",
          "FR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 2,
        "auto": "Yes",
        "text": "Kỳ 01–12, Chốt số DT 06: các tháng 07–12 chỉ có cột Kế hoạch",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-092",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 2,
        "auto": "Yes",
        "text": "Cột Kế hoạch tháng 03 bằng Σ Kế hoạch tháng 03 của các dự án trong phạm vi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-093",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 2,
        "auto": "Yes",
        "text": "Rê chuột nhóm cột tháng 03 (không sau chốt số): bảng nhỏ hiện đủ Kế hoạch, Thực tế, Hoàn thành (%)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-094",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 2,
        "auto": "Yes",
        "text": "Rê chuột nhóm cột tháng 09 (sau chốt số): Thực tế hiện \"chưa chốt số\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-095",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 3,
        "auto": "Yes",
        "text": "Rê chuột tháng có Kế hoạch bằng 0: Hoàn thành hiện \"—\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-096",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu Dòng tiền thu chưa có Chốt số: biểu đồ chỉ có cột Kế hoạch ở các tháng trong kỳ Từ – Đến"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-097",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu Dòng tiền thu chưa có Chốt số: rê chuột hiện Thực tế \"chưa chốt số\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-098",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 3,
        "auto": "Yes",
        "text": "Chỉ tiêu Dòng tiền thu chưa có Chốt số: rê chuột hiện Hoàn thành \"—\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-099",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 4,
        "auto": "No",
        "text": "Cột Kế hoạch màu xanh #2a78d6, cột Thực tế màu cam #eb6834"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-100",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo tháng",
        "priority": 4,
        "auto": "No",
        "text": "Trục Y có 5 vạch, giá trị lớn nhất làm tròn lên mức 1 / 2 / 2.5 / 5 / 10 × 10^n"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-101",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Trục Theo dự án: nhãn mỗi nhóm cột là Mã tổng của dự án"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-102",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-014",
          "BR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Trục Theo dự án, chỉ tiêu Chi phí, Chốt số CP 08, kỳ 01–12: cột của mỗi dự án cộng các tháng 01–08"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-103",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Trục Theo dự án: dự án có Kế hoạch và Thực tế của chỉ tiêu đều bằng 0 không có cột"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-104",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-017",
          "FR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Kỳ không có nhóm cột nào: vùng biểu đồ hiện \"Không có số liệu trong kỳ.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-105",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Biểu đồ kế hoạch – thực tế",
        "subcategory": "Trục Theo dự án",
        "priority": 3,
        "auto": "Yes",
        "text": "Đang hiện \"Không có số liệu trong kỳ.\", đổi kỳ sang tháng có số liệu: biểu đồ hiện lại các cột"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-106",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Cột & định dạng",
        "priority": 2,
        "auto": "Yes",
        "text": "Bảng có đủ cột: Mã dự án, Start, End, Sức khoẻ và 4 nhóm Doanh thu, Chi phí, Dòng tiền thu, KLCV, mỗi nhóm gồm Kế hoạch / Thực tế / Chênh lệch (%)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-107",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Cột & định dạng",
        "priority": 2,
        "auto": "Yes",
        "text": "Cột Mã dự án hiện Mã tổng in đậm kèm dòng nhỏ \"Khối · Tên dự án\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-108",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-007",
          "NFR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Cột & định dạng",
        "priority": 3,
        "auto": "Yes",
        "text": "Cột Start, End hiển thị dạng dd/mm/yyyy"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-109",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-003",
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Cột & định dạng",
        "priority": 2,
        "auto": "Yes",
        "text": "Cuộn ngang bảng: cột Mã dự án vẫn cố định bên trái"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-110",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Cột & định dạng",
        "priority": 3,
        "auto": "Yes",
        "text": "Chân khung hiện \"Bấm vào 1 dòng để xem Tổng quan dự án · Bấm vào con số thực tế của Chi phí / Dòng tiền thu để xem chi tiết sổ kế toán · ĐVT: VNĐ (KLCV: SP)\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-111",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Cột & định dạng",
        "priority": 3,
        "auto": "Yes",
        "text": "Số tiền trong bảng làm tròn đơn vị, ngăn nghìn bằng dấu phẩy"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-112",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-007",
          "BR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 1,
        "auto": "Yes",
        "text": "Kỳ 01–12, Chốt số DT 06, CP 08: mỗi nhóm cắt theo chốt số riêng (nhóm Doanh thu cộng 01–06, nhóm Chi phí cộng 01–08)",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-113",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-007",
          "E-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu Dòng tiền thu chưa có Chốt số: cột Thực tế của nhóm Dòng tiền thu hiện \"—\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-114",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-007",
          "E-bao-cao-hieu-qua-du-an-020",
          "BR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu Dòng tiền thu chưa có Chốt số: cột Chênh lệch (%) của nhóm Dòng tiền thu hiện \"—\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-115",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 1,
        "auto": "Yes",
        "text": "KH 200, TT 230: Chênh lệch (%) hiện \"+15.0%\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-116",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 2,
        "auto": "Yes",
        "text": "Chênh lệch tuyệt đối dưới 0.05%: Chênh lệch (%) hiện \"0.0%\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-117",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 2,
        "auto": "Yes",
        "text": "KH bằng 0: Chênh lệch (%) hiện \"–\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-118",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 2,
        "auto": "Yes",
        "text": "Dự án \"Chưa phát sinh\": cột Thực tế hiện \"–\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-119",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 2,
        "auto": "Yes",
        "text": "Dự án \"Chưa phát sinh\": cột Chênh lệch (%) hiện \"–\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-120",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 3,
        "auto": "Yes",
        "text": "Chênh lệch tuyệt đối làm tròn bằng 0: chữ Chênh lệch màu xám"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-121",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 2,
        "auto": "Yes",
        "text": "Doanh thu TT > KH: Chênh lệch màu xanh"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-122",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 2,
        "auto": "Yes",
        "text": "Chi phí TT > KH: Chênh lệch màu đỏ (chiều đảo ngược)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-123",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Số liệu từng nhóm chỉ tiêu",
        "priority": 3,
        "auto": "Yes",
        "text": "Rê chuột ô Chênh lệch Doanh thu: hiện \"Chênh lệch: ±{số tuyệt đối} VNĐ\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-124",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-009",
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Dòng Tổng cộng",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng \"Tổng cộng (n dự án)\": Kế hoạch, Thực tế bằng tổng của các dự án đang hiển thị",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-125",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Dòng Tổng cộng",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng tổng: Chênh lệch (%) tính trên tổng Kế hoạch và tổng Thực tế"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-126",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Dòng Tổng cộng",
        "priority": 2,
        "auto": "Yes",
        "text": "Lọc sức khoẻ \"Tốt\": dòng tổng chỉ cộng dự án mức Tốt, n bằng số dự án Tốt"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-127",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Dòng Tổng cộng",
        "priority": 2,
        "auto": "Yes",
        "text": "Lọc \"Tất cả\": dự án \"Chưa phát sinh\" được tính vào n của dòng tổng với Thực tế bằng 0"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-128",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Dòng Tổng cộng",
        "priority": 4,
        "auto": "No",
        "text": "Dòng tổng của bảng có nền vàng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-129",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Bấm dòng & số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Bấm 1 dòng dự án: màn chuyển sang tab \"Tổng quan dự án\" với đúng dự án đó được chọn",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-130",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-019",
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Bấm dòng & số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Bấm số thực tế Chi phí của 1 dòng dự án: P-06 mở với tiêu đề \"{Mã tổng} — {Tên}\" của dự án đó"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-131",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-019",
          "BR-bao-cao-hieu-qua-du-an-040",
          "FR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Bảng Chi tiết theo dự án",
        "subcategory": "Bấm dòng & số thực tế",
        "priority": 2,
        "auto": "Yes",
        "text": "Đang lọc \"Cần chú ý\": bấm số thực tế Dòng tiền thu ở dòng tổng mở P-06 với tiêu đề phạm vi kèm n bằng số dự án đang hiển thị"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-132",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Nút gạt Sức khoẻ",
        "priority": 2,
        "auto": "Yes",
        "text": "Góc khung có nút gạt \"Sức khoẻ:\" đủ: Tất cả (n) · Tốt (n) · Cần chú ý (n) · Theo dõi (n) · Chưa phát sinh (n)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-133",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Nút gạt Sức khoẻ",
        "priority": 2,
        "auto": "Yes",
        "text": "Phạm vi \"Khối G1\": số n trên mỗi nút gạt chỉ đếm dự án khối G1"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-134",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Nút gạt Sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn \"Cần chú ý\": bảng chỉ còn dự án mức Cần chú ý",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-135",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-016",
          "FR-bao-cao-hieu-qua-du-an-008"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Nút gạt Sức khoẻ",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn mức không có dự án nào: bảng hiện \"Không có dự án nào ở mức này.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-136",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-016",
          "BR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Nút gạt Sức khoẻ",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn mức không có dự án nào: bảng không có dòng tổng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-137",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Nút gạt Sức khoẻ",
        "priority": 2,
        "auto": "Yes",
        "text": "Kế toán chọn Phạm vi khối không có dự án thuộc báo cáo: bảng hiện \"Không có dự án nào ở mức này.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-138",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Nút gạt Sức khoẻ",
        "priority": 3,
        "auto": "Yes",
        "text": "Đang hiện \"Không có dự án nào ở mức này.\", chọn \"Tất cả\": bảng hiện lại danh sách dự án"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-139",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010",
          "BR-bao-cao-hieu-qua-du-an-013",
          "FR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án có Kế hoạch nhưng không có số thực tế ở chỉ tiêu nào trong kỳ: xếp \"Chưa phát sinh\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-140",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án chỉ có Chi thực tế ghi nhận bằng 0 trong kỳ: không xếp \"Chưa phát sinh\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-141",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án chỉ có số thực tế ở tháng ngoài kỳ so sánh: xếp \"Chưa phát sinh\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-142",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010",
          "FR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "DT đúng 85% KH, CP 100%, DTT 100%: xếp \"Cần chú ý\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-143",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010",
          "FR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "CP đúng 130% KH, DT 100%, DTT 100%: xếp \"Cần chú ý\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-144",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "Chi phí KH bằng 0, Chi phí thực tế lớn hơn 0: xếp \"Cần chú ý\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-145",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "DTT đúng 65% KH, DT 100%, CP 100%: xếp \"Cần chú ý\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-146",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010",
          "FR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "DT đúng 95%, CP đúng 100%, DTT đúng 95% KH: xếp \"Tốt\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-147",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010",
          "FR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "DT 90%, CP 100%, DTT 100% KH: xếp \"Theo dõi\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-148",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "DT 100%, CP 110%, DTT 100% KH: xếp \"Theo dõi\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-149",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "DT 100%, CP 100%, DTT 80% KH: xếp \"Theo dõi\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-150",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010",
          "BR-bao-cao-hieu-qua-du-an-011",
          "FR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án có số thực tế, KH Doanh thu, Chi phí, Dòng tiền thu đều bằng 0, Chi phí thực tế bằng 0: xếp \"Theo dõi\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-151",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "KH Doanh thu bằng 0 (bị bỏ qua), CP 90%, DTT 100% KH: xếp \"Tốt\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-152",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "KH Dòng tiền thu bằng 0 (bị bỏ qua), DT 100%, CP 90% KH: xếp \"Tốt\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-153",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "KH Chi phí bằng 0, Chi phí thực tế bằng 0 (bị bỏ qua), DT 100%, DTT 100%: xếp \"Tốt\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-154",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-011",
          "BR-bao-cao-hieu-qua-du-an-002",
          "E-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng tiền thu chưa có Chốt số (bị bỏ qua), DT 100%, CP 90% KH: xếp \"Tốt\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-155",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-012"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "DT, CP, DTT đạt ngưỡng Tốt, KLCV thực tế bằng 0: vẫn xếp \"Tốt\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-156",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-010",
          "BR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "Chốt số DT 06, kỳ 01–12, DT 01–06 đạt 100% KH, KH DT 07–12 lớn: dự án không bị \"Cần chú ý\" vì Doanh thu",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-157",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 1,
        "auto": "Yes",
        "text": "Mỗi dự án trong bảng mang đúng 1 nhãn mức sức khoẻ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-158",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Xếp mức sức khoẻ",
        "priority": 3,
        "auto": "No",
        "text": "Nhãn mức: Tốt xanh lá, Cần chú ý đỏ, Theo dõi vàng, Chưa phát sinh xám"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-159",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-010"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Khung Định nghĩa về mức sức khoẻ",
        "priority": 2,
        "auto": "Yes",
        "text": "Khung \"Định nghĩa về mức sức khoẻ\" có 2 cột \"Mức\" / \"Điều kiện (so với kế hoạch cùng kỳ)\" và 4 dòng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-160",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-010",
          "BR-bao-cao-hieu-qua-du-an-010"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Khung Định nghĩa về mức sức khoẻ",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng \"Cần chú ý\" của khung có điều kiện Chi phí kế hoạch bằng 0 mà có chi thực tế"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-161",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-010",
          "BR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Khung Định nghĩa về mức sức khoẻ",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng \"Theo dõi\" của khung có trường hợp mọi chỉ tiêu đều bị bỏ qua"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-162",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-010",
          "BR-bao-cao-hieu-qua-du-an-012"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Khung Định nghĩa về mức sức khoẻ",
        "priority": 3,
        "auto": "Yes",
        "text": "Chân khung hiện \"Khối lượng công việc chưa tham gia xếp mức (chờ chốt ngưỡng).\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-163",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-010"
        ],
        "category": "Lọc & xếp mức sức khoẻ",
        "subcategory": "Khung Định nghĩa về mức sức khoẻ",
        "priority": 3,
        "auto": "Yes",
        "text": "Khung Định nghĩa chỉ xem, không có ô sửa"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-164",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Giữ bộ lọc khi chuyển tab",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Đặt Từ tháng 03, Đến tháng 09, chuyển sang tab \"Tổng quan dự án\", quay lại tab tổng quan: Từ / Đến giữ 03–09",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-165",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Giữ bộ lọc khi chuyển tab",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Kế toán chọn Phạm vi \"Khối G2\", chuyển sang tab dự án, quay lại: Phạm vi giữ \"Khối G2\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-166",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Giữ bộ lọc khi chuyển tab",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn trục \"Theo dự án\", chuyển sang tab dự án, quay lại: trục giữ \"Theo dự án\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-167",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Giữ bộ lọc khi chuyển tab",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn lọc sức khoẻ \"Theo dõi\", chuyển sang tab dự án, quay lại: lọc giữ \"Theo dõi\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-168",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Giữ bộ lọc khi chuyển tab",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Đổi chỉ tiêu sang Chi phí ở tab \"Tổng quan dự án\", quay lại tab tổng quan: nút gạt chỉ tiêu của biểu đồ đang ở Chi phí",
        "uat": true
      }
    ]
  },
  {
    "scope": "uc",
    "target": "xem-tong-quan-du-an",
    "file": "checklist-uc-xem-tong-quan-du-an.md",
    "items": [
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-169",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Dự án & chỉ tiêu mặc định",
        "priority": 1,
        "auto": "Yes",
        "text": "Bấm dòng dự án X ở tab tổng quan: tab \"Tổng quan dự án\" chọn sẵn dự án X",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-170",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Dự án & chỉ tiêu mặc định",
        "priority": 1,
        "auto": "Yes",
        "text": "Mở tab \"Tổng quan dự án\" khi chưa bấm dòng dự án nào: dự án mặc định là dự án đầu tiên có số thực tế",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-171",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Dự án & chỉ tiêu mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Chưa dự án nào có số thực tế: dự án mặc định là dự án đầu tiên trong ô Dự án"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-172",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011",
          "FR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Dự án & chỉ tiêu mặc định",
        "priority": 1,
        "auto": "Yes",
        "text": "Tab tổng quan đang chọn chỉ tiêu Dòng tiền thu, chuyển sang tab dự án: nút gạt Chỉ tiêu ở Dòng tiền thu",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-173",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Dự án & chỉ tiêu mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở màn, chưa đổi chỉ tiêu, vào tab dự án: chỉ tiêu mặc định Doanh thu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-174",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Dự án & chỉ tiêu mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Nút gạt Chỉ tiêu có đủ: Doanh thu, Chi phí, Dòng tiền thu, Khối lượng công việc"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-175",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011",
          "BR-bao-cao-hieu-qua-du-an-034",
          "BR-bao-cao-hieu-qua-du-an-035"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Ô Dự án",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Dự án chỉ liệt kê dự án thuộc báo cáo (dự án Chờ duyệt mã không có trong danh sách)",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-176",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-035",
          "FR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Ô Dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô Dự án nhóm các mục theo khối với nhãn nhóm \"Khối G1\", \"Khối G2\"…"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-177",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Ô Dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Mỗi mục trong ô Dự án hiển thị \"<Mã tổng> — <Tên>\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-178",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Ô Dự án",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK khối G1: ô Dự án chỉ có dự án khối G1",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-179",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Ô Dự án",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn dự án Y trong ô Dự án: khung Thông tin dự án hiện Mã dự án của Y",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-180",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-018",
          "FR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Ô Dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Không có dự án nào thuộc báo cáo: tab dự án hiện \"Chưa có dự án.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-181",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Ô Dự án",
        "priority": 3,
        "auto": "Yes",
        "text": "Không có dự án nào thuộc báo cáo: tab dự án không hiện ô số, biểu đồ, bảng tháng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-182",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Ô Dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Tab \"Tổng quan dự án\" không có ô Từ tháng, Đến tháng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-183",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Mở tab & chọn dự án",
        "subcategory": "Ô Dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn dự án Y, chuyển sang tab tổng quan, quay lại tab dự án: dự án Y vẫn được chọn"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-184",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-012"
        ],
        "category": "Thông tin dự án",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Khung Thông tin dự án hiện đủ 6 cặp nhãn – giá trị: Khối, Tên dự án, Start, Mã dự án, Chỉ tiêu, End"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-185",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-012"
        ],
        "category": "Thông tin dự án",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Chỉ tiêu Chi phí: ô Chỉ tiêu hiện \"Chi phí (VNĐ)\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-186",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-012"
        ],
        "category": "Thông tin dự án",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Chỉ tiêu Khối lượng công việc: ô Chỉ tiêu hiện \"Khối lượng công việc (SP)\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-187",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-012"
        ],
        "category": "Thông tin dự án",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Khung Thông tin dự án chỉ xem, không có ô nhập"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-188",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-015",
          "FR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Vòng đời dự án",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án có Kế hoạch 02–11, thực tế 03–08: ô Tổng KH cả vòng đời có dòng dưới \"02/YYYY → 11/YYYY\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-189",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-015"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Vòng đời dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Dự án có số thực tế tháng 01, Kế hoạch bắt đầu từ 02: vòng đời bắt đầu từ 01/YYYY"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-190",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-015"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Vòng đời dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Dự án chưa có tháng Kế hoạch, chưa có số thực tế: vòng đời từ tháng Start đến tháng End"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-191",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016",
          "FR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Tổng KH cả vòng đời bằng Σ Kế hoạch mọi tháng của chỉ tiêu đang chọn",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-192",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016",
          "FR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Luỹ kế KH đến kỳ chốt bằng Σ Kế hoạch các tháng không sau Chốt số của chỉ tiêu đang chọn",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-193",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 2,
        "auto": "Yes",
        "text": "Chốt số DT 06, chỉ tiêu Doanh thu: ô Luỹ kế KH có dòng dưới \"Đến 06/YYYY\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-194",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Luỹ kế TT đến kỳ chốt bằng Σ Thực tế các tháng không sau Chốt số, tháng chưa có số tính 0",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-195",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016",
          "FR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô Còn lại theo kế hoạch bằng Tổng KH − Luỹ kế KH",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-196",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016",
          "BR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 1,
        "auto": "Yes",
        "text": "Luỹ kế TT 450, Luỹ kế KH 500: ô Mức thực hiện luỹ kế hiện \"90.0%\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-197",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu Doanh thu, Luỹ kế TT ≥ Luỹ kế KH: ô Mức thực hiện có nhãn \"Đạt\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-198",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu Doanh thu, Luỹ kế TT < Luỹ kế KH: ô Mức thực hiện có nhãn \"Chưa đạt\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-199",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu Chi phí, Luỹ kế TT > Luỹ kế KH: ô Mức thực hiện có nhãn \"Vượt KH\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-200",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu Chi phí, Luỹ kế TT ≤ Luỹ kế KH: ô Mức thực hiện có nhãn \"Đạt\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-201",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 2,
        "auto": "Yes",
        "text": "Luỹ kế KH bằng 0: ô Mức thực hiện hiện \"—\", không nhãn"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-202",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Giá trị các ô",
        "priority": 1,
        "auto": "Yes",
        "text": "Chốt số DT 06, CP 08: đổi chỉ tiêu từ Doanh thu sang Chi phí, ô Luỹ kế KH đổi sang \"Đến 08/YYYY\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-203",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-013",
          "E-bao-cao-hieu-qua-du-an-020",
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án chưa có số thực tế của chỉ tiêu đang chọn: ô Luỹ kế TT hiện \"Chưa có số thực tế\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-204",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-013",
          "E-bao-cao-hieu-qua-du-an-020",
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án chưa có số thực tế của chỉ tiêu đang chọn: ô Mức thực hiện hiện \"Chưa phát sinh\", không nhãn Đạt / Chưa đạt",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-205",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu đang chọn chưa có Chốt số: ô Luỹ kế KH hiện \"—\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-206",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu đang chọn chưa có Chốt số: ô Còn lại theo kế hoạch hiện \"—\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-207",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016",
          "E-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu đang chọn chưa có Chốt số: ô Luỹ kế TT hiện \"Chưa có số thực tế\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-208",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016",
          "E-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu đang chọn chưa có Chốt số: ô Mức thực hiện hiện \"Chưa phát sinh\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-209",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Chưa có số thực tế",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu đang chọn chưa có Chốt số: mọi tháng của bảng số liệu từng tháng có nền xám"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-210",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Chưa có số thực tế",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu đang chọn chưa có Chốt số: mọi tháng của bảng số liệu từng tháng có Thực tế \"–\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-211",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-013",
          "BR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Mở P-06 từ ô luỹ kế",
        "priority": 1,
        "auto": "Yes",
        "text": "Chỉ tiêu Chi phí, vòng đời từ 02, Chốt số CP 08: bấm ô Luỹ kế TT mở P-06 kỳ \"Từ tháng 02/YYYY đến tháng 08/YYYY\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-212",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "5 ô số vòng đời / luỹ kế",
        "subcategory": "Mở P-06 từ ô luỹ kế",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu Doanh thu: ô Luỹ kế TT không bấm được"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-213",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ theo tháng",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu Chi phí: tiêu đề khung biểu đồ \"Chi phí theo tháng\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-214",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ theo tháng",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Biểu đồ có nhóm cột cho mọi tháng trong vòng đời dự án"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-215",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-014",
          "BR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ theo tháng",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Tháng sau Chốt số của chỉ tiêu chỉ có cột Kế hoạch"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-216",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Biểu đồ theo tháng",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Rê chuột 1 nhóm cột: bảng nhỏ hiện đủ Kế hoạch, Thực tế, Hoàn thành (%)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-217",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-015"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Cột & nhãn",
        "priority": 2,
        "auto": "Yes",
        "text": "Khung \"Số liệu từng tháng của dự án đang chọn\" có đủ cột: Tháng · Kế hoạch · Thực tế · Chênh lệch · +/- % · Luỹ kế kế hoạch · Luỹ kế thực tế · % luỹ kế"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-218",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-015"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Cột & nhãn",
        "priority": 2,
        "auto": "Yes",
        "text": "Tháng bằng Chốt số của chỉ tiêu có nhãn xanh \"Chốt số\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-219",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-015"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Cột & nhãn",
        "priority": 2,
        "auto": "Yes",
        "text": "Tháng sau Chốt số có nền xám"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-220",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-015"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Cột & nhãn",
        "priority": 1,
        "auto": "Yes",
        "text": "Tháng sau Chốt số có Thực tế \"–\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-221",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-015"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Cột & nhãn",
        "priority": 3,
        "auto": "Yes",
        "text": "Chỉ tiêu tiền: chân khung hiện \"ĐVT: VNĐ · Dòng nền xám: tháng sau kỳ chốt số (chưa có thực tế)\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-222",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-015",
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Tháng chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Tháng 04 không sau chốt số, dự án chưa có số thực tế tháng 04: Thực tế hiện \"–\" (không hiện 0)",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-223",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Tháng chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Tháng chưa có số thực tế: Chênh lệch hiện \"–\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-224",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Tháng chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Tháng chưa có số thực tế: +/- % hiện \"–\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-225",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Tháng chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Tháng 04 chưa có số thực tế: Luỹ kế thực tế tháng 04 bằng Luỹ kế thực tế tháng 03 (cộng dồn với 0)",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-226",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-036"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Tháng chưa có số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Tháng có số thực tế ghi nhận bằng 0: Thực tế hiện \"0\", không hiện \"–\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-227",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Công thức",
        "priority": 1,
        "auto": "Yes",
        "text": "KH 100, TT 120: Chênh lệch hiện \"+20\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-228",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Công thức",
        "priority": 2,
        "auto": "Yes",
        "text": "Chênh lệch làm tròn khác 0 được tô màu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-229",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Công thức",
        "priority": 1,
        "auto": "Yes",
        "text": "KH 100, TT 120: +/- % hiện \"+20.0%\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-230",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Công thức",
        "priority": 2,
        "auto": "Yes",
        "text": "KH bằng 0: +/- % hiện \"–\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-231",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Công thức",
        "priority": 1,
        "auto": "Yes",
        "text": "Luỹ kế kế hoạch tháng n bằng Σ Kế hoạch từ tháng đầu vòng đời đến tháng n"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-232",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Công thức",
        "priority": 1,
        "auto": "Yes",
        "text": "% luỹ kế bằng Luỹ kế TT / Luỹ kế KH, hiển thị 1 chữ số thập phân"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-233",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Công thức",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng \"Tổng cộng\" hiện đủ: Tổng KH · Σ TT đến chốt số · \"Luỹ kế đến MM/YYYY: ±(LK TT − LK KH)\" · LK KH · LK TT · % luỹ kế",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-234",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-015",
          "BR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Mở P-06 từ bảng",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu Chi phí: bấm Thực tế tháng 05 mở P-06 kỳ \"Tháng 5 năm YYYY\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-235",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-015",
          "BR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Mở P-06 từ bảng",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu Chi phí, vòng đời từ 02: bấm Luỹ kế thực tế tháng 05 mở P-06 kỳ \"Từ tháng 02/YYYY đến tháng 05/YYYY\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-236",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-015",
          "BR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Mở P-06 từ bảng",
        "priority": 2,
        "auto": "Yes",
        "text": "Chỉ tiêu Dòng tiền thu: bấm Thực tế dòng tổng mở P-06 kỳ từ tháng đầu vòng đời đến Chốt số DTT"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-237",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Mở P-06 từ bảng",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở P-06 từ tab dự án: tiêu đề phạm vi là \"{Mã tổng} — {Tên}\" của dự án đang chọn"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-238",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "Bảng số liệu từng tháng",
        "subcategory": "Mở P-06 từ bảng",
        "priority": 2,
        "auto": "Yes",
        "text": "Tháng có Thực tế Chi phí bằng 0: ô Thực tế không bấm được"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "tra-cuu-so-ke-toan",
    "file": "checklist-uc-tra-cuu-so-ke-toan.md",
    "items": [
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-239",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017",
          "BR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tiêu đề & dòng phụ",
        "priority": 1,
        "auto": "Yes",
        "text": "Mở P-06 từ số thực tế Chi phí: tiêu đề \"CHI THỰC TẾ\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-240",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tiêu đề & dòng phụ",
        "priority": 1,
        "auto": "Yes",
        "text": "Mở P-06 từ số thực tế Dòng tiền thu: tiêu đề \"BÁO CÁO DÒNG TIỀN THU TRONG KỲ\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-241",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017",
          "BR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tiêu đề & dòng phụ",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng phụ của P-06 hiện tên phạm vi / dự án truyền vào (vd \"Khối G1 · 12 dự án\")"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-242",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tiêu đề & dòng phụ",
        "priority": 2,
        "auto": "Yes",
        "text": "Kỳ từ = đến = 09/2026: dòng phụ hiện \"Tháng 9 năm 2026 · ĐVT: VNĐ · Nguồn: sổ kế toán import\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-243",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tiêu đề & dòng phụ",
        "priority": 2,
        "auto": "Yes",
        "text": "Kỳ 01/2026–08/2026: dòng phụ hiện \"Từ tháng 01/2026 đến tháng 08/2026 · ĐVT: VNĐ · Nguồn: sổ kế toán import\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-244",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Cột bảng",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ thu: bảng có đủ 8 cột Ngày hạch toán · Diễn giải · Số tiền · Tên đối tượng · Mã công trình · Tên công trình · Mã đơn vị · Tên đơn vị",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-245",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017",
          "BR-bao-cao-hieu-qua-du-an-020",
          "BR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Cột bảng",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ chi: bảng có đủ 5 cột Mã dự án (Mã tổng/Mã SX/Mã KD) · Tháng (MM/yyyy) · Chi sản xuất (đ) · Chi kinh doanh (đ) · Ghi chú",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-246",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Cột bảng",
        "priority": 3,
        "auto": "Yes",
        "text": "Sổ thu: cột Ngày hạch toán hiển thị dd/mm/yyyy"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-247",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Cột bảng",
        "priority": 3,
        "auto": "Yes",
        "text": "Cột Số tiền hiển thị làm tròn đơn vị, ngăn nghìn bằng dấu phẩy"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-248",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020",
          "FR-bao-cao-hieu-qua-du-an-016"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 1,
        "auto": "Yes",
        "text": "P-06 của dự án X có dòng sổ mang Mã tổng của X"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-249",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 1,
        "auto": "Yes",
        "text": "P-06 của dự án X có dòng sổ mang Mã KD (Mã tổng.1) của X",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-250",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 1,
        "auto": "Yes",
        "text": "P-06 của dự án X có dòng sổ mang Mã SX (Mã tổng.2) của X"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-251",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 1,
        "auto": "Yes",
        "text": "P-06 của dự án X có dòng sổ mang mã outsource đang dùng của X (vd Mã tổng.3)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-252",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 1,
        "auto": "Yes",
        "text": "P-06 của dự án X có dòng sổ mang mã outsource đã xoá của X",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-253",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ mang mã của X viết chữ thường, có khoảng trắng đầu / cuối: vẫn có trong P-06 của X"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-254",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 1,
        "auto": "Yes",
        "text": "P-06 của dự án X không có dòng sổ mang mã của dự án khác",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-255",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 2,
        "auto": "Yes",
        "text": "P-06 sổ thu mức Toàn công ty không có dòng trống Mã công trình"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-256",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-016",
          "BR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 1,
        "auto": "Yes",
        "text": "P-06 kỳ 01–08 không có dòng sổ thuộc tháng 09"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-257",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ thu: dòng có Ngày hạch toán 31/08 không có trong P-06 kỳ tháng 9"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-258",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-001",
          "BR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ đã bị thay ở lần import sau (hết hiệu lực) không có trong P-06",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-259",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ thu: các dòng sắp theo Ngày hạch toán tăng dần"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-260",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Dòng sổ được lấy",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ chi: các dòng sắp theo Tháng, cùng tháng sắp theo Mã dự án"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-261",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tổng & hiển thị theo từng phần",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ thu: dòng \"Tổng cộng\" bằng Σ Số tiền các dòng thoả bộ lọc",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-262",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tổng & hiển thị theo từng phần",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ chi: dòng tổng có thêm \"Tổng chi: X\" với X bằng Σ Chi sản xuất + Σ Chi kinh doanh"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-263",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tổng & hiển thị theo từng phần",
        "priority": 2,
        "auto": "Yes",
        "text": "Thanh công cụ hiện \"n dòng · Tổng X\" với n là số dòng thoả bộ lọc"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-264",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-040",
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tổng & hiển thị theo từng phần",
        "priority": 2,
        "auto": "Yes",
        "text": "P-06 mức Toàn công ty kỳ 12 tháng (nhiều dòng): bảng hiển thị theo từng phần"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-265",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-040"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tổng & hiển thị theo từng phần",
        "priority": 1,
        "auto": "Yes",
        "text": "Bảng đang hiển thị theo từng phần: \"n dòng · Tổng X\" tính trên toàn bộ dòng thoả bộ lọc, không chỉ phần đang hiện",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-266",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-040"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tổng & hiển thị theo từng phần",
        "priority": 1,
        "auto": "Yes",
        "text": "Bảng đang hiển thị theo từng phần: dòng \"Tổng cộng\" tính trên toàn bộ dòng thoả bộ lọc"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-267",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-019",
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tổng & hiển thị theo từng phần",
        "priority": 2,
        "auto": "Yes",
        "text": "Không có dòng sổ nào trong phạm vi / kỳ: bảng hiện \"Không có dòng chi tiết nào trong kỳ.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-268",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Mở P-06 & hiển thị dòng sổ",
        "subcategory": "Tổng & hiển thị theo từng phần",
        "priority": 2,
        "auto": "Yes",
        "text": "Không có dòng sổ nào: bảng không có dòng tổng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-269",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Sổ thu: ô tìm kiếm có placeholder \"Tìm diễn giải, đối tượng, mã công trình...\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-270",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Sổ chi: ô tìm kiếm có placeholder \"Tìm mã dự án, ghi chú...\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-271",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-018"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Gõ từ khoá vào ô tìm: bảng lọc ngay khi gõ, không cần bấm nút"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-272",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ thu: từ khoá có trong Diễn giải ra đúng dòng đó",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-273",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ thu: từ khoá có trong Tên đối tượng ra đúng dòng đó"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-274",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ thu: từ khoá có trong Mã công trình ra đúng dòng đó"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-275",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ thu: từ khoá có trong Tên công trình ra đúng dòng đó"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-276",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Sổ thu: từ khoá chỉ có trong Mã đơn vị không ra dòng nào"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-277",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ chi: từ khoá có trong Mã dự án ra đúng dòng đó"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-278",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ chi: từ khoá có trong Ghi chú ra đúng dòng đó"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-279",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Từ khoá \"ha noi\" (không dấu) ra dòng có \"Hà Nội\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-280",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Từ khoá \"HÀ NỘI\" (chữ hoa) ra dòng có \"Hà Nội\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-281",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Từ khoá \"  Hà Nội  \" (khoảng trắng đầu / cuối) ra cùng kết quả với \"Hà Nội\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-282",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Từ khoá chỉ gồm khoảng trắng: bảng hiện toàn bộ dòng như ô tìm trống"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-283",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-040",
          "FR-bao-cao-hieu-qua-du-an-017"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Đang tìm kiếm: \"n dòng · Tổng X\" tính theo các dòng thoả từ khoá"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-284",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Từ khoá không khớp dòng nào: bảng hiện \"Không có dòng chi tiết nào trong kỳ.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-285",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Tìm kiếm",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Đang hiện \"Không có dòng chi tiết nào trong kỳ.\" do tìm kiếm, xoá từ khoá: bảng hiện lại các dòng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-286",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Ẩn dòng bằng 0",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ chi: ô tích \"Ẩn dòng bằng 0\" đang bật khi mở P-06",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-287",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Ẩn dòng bằng 0",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô tích bật: dòng có Chi SX = 0 và Chi KD = 0 không hiện"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-288",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Ẩn dòng bằng 0",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô tích bật: dòng có Chi SX = 0, Chi KD khác 0 vẫn hiện"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-289",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Ẩn dòng bằng 0",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Bỏ tích \"Ẩn dòng bằng 0\": dòng có Chi SX = Chi KD = 0 hiện lại",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-290",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-019"
        ],
        "category": "Ẩn dòng bằng 0",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Sổ thu: không có ô tích \"Ẩn dòng bằng 0\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-291",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-015",
          "FR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Cảnh báo lệch tổng",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Ô tìm trống, tổng các dòng khác con số vừa bấm: dải vàng hiện \"Tổng chi tiết ({X}) khác con số trên báo cáo ({Y}) — vui lòng đối chiếu với Kế toán.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-292",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Cảnh báo lệch tổng",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Tổng các dòng bằng con số vừa bấm: không có dải vàng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-293",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Cảnh báo lệch tổng",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô tìm có từ khoá, tổng các dòng khác con số vừa bấm: không có dải vàng",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-294",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Cảnh báo lệch tổng",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Tổng các dòng lệch con số vừa bấm dưới 0,5 đồng (làm tròn đơn vị bằng nhau): không có dải vàng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-295",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-040"
        ],
        "category": "Cảnh báo lệch tổng",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Bảng hiển thị theo từng phần, tổng toàn bộ dòng bằng con số vừa bấm: không có dải vàng dù tổng phần đang hiện nhỏ hơn"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-296",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Export XLSX",
        "subcategory": "Xuất file",
        "priority": 1,
        "auto": "Yes",
        "text": "Bấm \"Export XLSX\": tải về 1 file .xlsx",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-297",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024",
          "FR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Export XLSX",
        "subcategory": "Xuất file",
        "priority": 1,
        "auto": "Yes",
        "text": "Đang tìm kiếm: file xuất chỉ có các dòng thoả từ khoá",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-298",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024",
          "BR-bao-cao-hieu-qua-du-an-040"
        ],
        "category": "Export XLSX",
        "subcategory": "Xuất file",
        "priority": 1,
        "auto": "Yes",
        "text": "Bảng hiển thị theo từng phần: file xuất có cả các dòng chưa hiện trên bảng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-299",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Xuất file",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ chi, ô tích \"Ẩn dòng bằng 0\" bật: file xuất không có dòng Chi SX = Chi KD = 0"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-300",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Xuất file",
        "priority": 2,
        "auto": "Yes",
        "text": "File xuất không có dòng Tổng cộng",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-301",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Mẫu file sổ thu",
        "priority": 2,
        "auto": "Yes",
        "text": "File xuất sổ thu có sheet \"SỔ TIỀN GỬI NGÂN HÀNG\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-302",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Mẫu file sổ thu",
        "priority": 2,
        "auto": "Yes",
        "text": "File xuất sổ thu: dòng 1 là tiêu đề, dòng 2 là kỳ, dòng 3 là tên 8 cột"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-303",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Mẫu file sổ thu",
        "priority": 3,
        "auto": "Yes",
        "text": "File xuất sổ thu: cột Ngày hạch toán dạng dd/mm/yyyy"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-304",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Mẫu file sổ chi",
        "priority": 2,
        "auto": "Yes",
        "text": "File xuất sổ chi có sheet \"Chi thuc te\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-305",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024",
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Export XLSX",
        "subcategory": "Mẫu file sổ chi",
        "priority": 2,
        "auto": "Yes",
        "text": "File xuất sổ chi: dòng tên cột có \"Mã dự án (Mã tổng/Mã SX/Mã KD) *\", \"Tháng (MM/yyyy) *\", \"Chi sản xuất (đ) *\", \"Chi kinh doanh (đ) *\", \"Ghi chú\" (cột Ghi chú không có dấu *)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-306",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Mẫu file sổ chi",
        "priority": 3,
        "auto": "Yes",
        "text": "File xuất sổ chi: cột Tháng dạng MM/YYYY"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-307",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Tên file",
        "priority": 2,
        "auto": "Yes",
        "text": "P-06 sổ chi của 1 dự án Mã tổng ABC, kỳ 01–08/2026: tên file \"ChiThucTe_ABC_2026-01_2026-08.xlsx\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-308",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Tên file",
        "priority": 2,
        "auto": "Yes",
        "text": "P-06 sổ thu mức khối nhiều dự án, kỳ 09/2026: tên file \"DongTienThu_nhieu-du-an_2026-09_2026-09.xlsx\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-309",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-020",
          "BR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Export XLSX",
        "subcategory": "Giới hạn & trường hợp không xuất",
        "priority": 2,
        "auto": "Yes",
        "text": "Không có dòng thoả bộ lọc: nút Export XLSX mờ",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-310",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Export XLSX",
        "subcategory": "Giới hạn & trường hợp không xuất",
        "priority": 3,
        "auto": "Yes",
        "text": "Nút Export XLSX mờ: rê chuột hiện tooltip \"Không có dòng để xuất\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-311",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-023",
          "BR-bao-cao-hieu-qua-du-an-040"
        ],
        "category": "Export XLSX",
        "subcategory": "Giới hạn & trường hợp không xuất",
        "priority": 2,
        "auto": "Yes",
        "text": "Số dòng thoả bộ lọc 1.000.001, bấm Export XLSX: hiện \"Quá nhiều dòng để xuất ({n}) — vui lòng thu hẹp kỳ hoặc phạm vi.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-312",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-023",
          "BR-bao-cao-hieu-qua-du-an-040"
        ],
        "category": "Export XLSX",
        "subcategory": "Giới hạn & trường hợp không xuất",
        "priority": 2,
        "auto": "Yes",
        "text": "Số dòng thoả bộ lọc 1.000.001, bấm Export XLSX: không có file nào được tải về"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-313",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-040"
        ],
        "category": "Export XLSX",
        "subcategory": "Giới hạn & trường hợp không xuất",
        "priority": 2,
        "auto": "Yes",
        "text": "Số dòng thoả bộ lọc đúng 1.000.000: Export XLSX tải file đủ 1.000.000 dòng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-314",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Export XLSX",
        "subcategory": "Giới hạn & trường hợp không xuất",
        "priority": 3,
        "auto": "Yes",
        "text": "Đã báo quá nhiều dòng để xuất: P-06 giữ nguyên bảng và bộ lọc"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-315",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Export XLSX",
        "subcategory": "Giới hạn & trường hợp không xuất",
        "priority": 3,
        "auto": "Yes",
        "text": "Gõ từ khoá thu hẹp số dòng xuống dưới 1.000.000, bấm Export XLSX: tải file thành công"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-316",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-020",
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Export XLSX",
        "subcategory": "Vai trò & tra soát",
        "priority": 2,
        "auto": "Yes",
        "text": "GĐK bấm Export XLSX: tải được file",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-317",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-020",
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Export XLSX",
        "subcategory": "Vai trò & tra soát",
        "priority": 2,
        "auto": "Yes",
        "text": "SM bấm Export XLSX: tải được file"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-318",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-020",
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Export XLSX",
        "subcategory": "Vai trò & tra soát",
        "priority": 2,
        "auto": "Yes",
        "text": "Ban lãnh đạo bấm Export XLSX: tải được file"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-319",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-005",
          "NFR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Export XLSX",
        "subcategory": "Vai trò & tra soát",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK khối G1 export từ P-06 mức Khối G1: file chỉ có dòng sổ của dự án khối G1",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-320",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-015",
          "FR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Export XLSX",
        "subcategory": "Vai trò & tra soát",
        "priority": 2,
        "auto": "No",
        "text": "Mỗi lần Export XLSX được ghi nhận tra soát đủ: người, thời điểm, loại sổ, phạm vi, kỳ, số dòng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-321",
        "ref": [],
        "category": "Đóng P-06",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Bấm nút ×: P-06 đóng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-322",
        "ref": [],
        "category": "Đóng P-06",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Bấm nền tối ngoài popup: P-06 đóng"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "import-so-ke-toan",
    "file": "checklist-uc-import-so-ke-toan.md",
    "items": [
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-323",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Popup & các bước",
        "priority": 1,
        "auto": "Yes",
        "text": "Kế toán bấm \"Import sổ kế toán\": mở popup tiêu đề \"Import sổ kế toán — Dòng tiền thu / Chi thực tế\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-324",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Popup & các bước",
        "priority": 3,
        "auto": "Yes",
        "text": "Popup có dòng phụ \"File toàn công ty, nhiều dự án; hệ thống ghép từng dòng vào dự án theo mã. ĐVT: VNĐ\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-325",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022",
          "FR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Popup & các bước",
        "priority": 2,
        "auto": "Yes",
        "text": "Popup vừa mở hiện đủ: bước 1 \"Tải file mẫu\", bước 2 \"Chọn file của kế toán\", mục \"Lịch sử import\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-326",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Tải file mẫu",
        "priority": 2,
        "auto": "Yes",
        "text": "Bấm \"Mẫu dòng tiền thu\": tải file Mau_dong_tien_thu.xlsx",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-327",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Tải file mẫu",
        "priority": 2,
        "auto": "Yes",
        "text": "File Mau_dong_tien_thu.xlsx có sheet \"SỔ TIỀN GỬI NGÂN HÀNG\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-328",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Tải file mẫu",
        "priority": 2,
        "auto": "Yes",
        "text": "File Mau_dong_tien_thu.xlsx có 2 dòng tiêu đề \"BÁO CÁO DÒNG TIỀN THU TRONG KỲ\" / \"Tháng 9 năm 2026\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-329",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Tải file mẫu",
        "priority": 2,
        "auto": "Yes",
        "text": "File Mau_dong_tien_thu.xlsx có dòng tên 8 cột kèm 1 dòng ví dụ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-330",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Tải file mẫu",
        "priority": 2,
        "auto": "Yes",
        "text": "Bấm \"Mẫu chi thực tế\": tải file Mau_chi_thuc_te.xlsx",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-331",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Tải file mẫu",
        "priority": 2,
        "auto": "Yes",
        "text": "File Mau_chi_thuc_te.xlsx có sheet \"Chi thuc te\", không có dòng tiêu đề báo cáo"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-332",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022",
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Tải file mẫu",
        "priority": 2,
        "auto": "Yes",
        "text": "File Mau_chi_thuc_te.xlsx có đủ 5 cột \"Mã dự án (Mã tổng/Mã SX/Mã KD) *\", \"Tháng (MM/yyyy) *\", \"Chi sản xuất (đ) *\", \"Chi kinh doanh (đ) *\", \"Ghi chú\" kèm 1 dòng ví dụ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-333",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Mở popup Import sổ kế toán",
        "subcategory": "Tải file mẫu",
        "priority": 3,
        "auto": "Yes",
        "text": "Bước 1 hiện danh sách cột của từng file mẫu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-334",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Chọn file",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Bước 2 có vùng \"Kéo thả file vào đây hoặc bấm để chọn\" kèm dòng \"Tự nhận loại sổ theo dòng tiêu đề · .xlsx, .xls, .csv\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-335",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Chọn file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Bấm vùng chọn file, chọn file .xlsx hợp lệ: vùng hiện tên file kèm \"· bấm để chọn file khác\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-336",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-023",
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Chọn file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Kéo thả file .xlsx hợp lệ vào vùng: popup hiện bước 3 \"Kiểm tra & import\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-337",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Chọn file",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Kéo thả 2 file cùng lúc: popup chỉ đọc file đầu tiên"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-338",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Chọn file",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn file .xls hợp lệ: đọc được, hiện chip loại sổ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-339",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Chọn file",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn file .csv lưu UTF-8 hợp lệ: đọc được, hiện chip loại sổ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-340",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Chọn file",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "File .xlsx có 2 sheet: chỉ dữ liệu sheet đầu tiên được đọc"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-341",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-001",
          "FR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn file .pdf: báo lỗi \"Chỉ hỗ trợ file .xlsx, .xls, .csv.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-342",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn file .pdf: vùng chọn hiện tên file, chip \"1 lỗi\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-343",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-001",
          "BR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn file .pdf: nút Import sổ mờ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-344",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-002",
          "FR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn file .xlsx bị hỏng: báo lỗi \"Không đọc được file. File có thể bị hỏng hoặc đặt mật khẩu.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-345",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-002",
          "FR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn file .xlsx đặt mật khẩu: báo lỗi \"Không đọc được file. File có thể bị hỏng hoặc đặt mật khẩu.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-346",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-024",
          "NFR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn file 20,1 MB: báo lỗi \"File vượt giới hạn cho phép (tối đa 20 MB và 50.000 dòng dữ liệu) — vui lòng tách file theo tháng.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-347",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-002",
          "FR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn file hợp lệ dung lượng đúng 20 MB: không báo lỗi giới hạn"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-348",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-024",
          "NFR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn file 50.001 dòng dữ liệu: báo lỗi \"File vượt giới hạn cho phép (tối đa 20 MB và 50.000 dòng dữ liệu) — vui lòng tách file theo tháng.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-349",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-002",
          "FR-bao-cao-hieu-qua-du-an-023"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn file hợp lệ đúng 50.000 dòng dữ liệu: không báo lỗi giới hạn"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-350",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Tách file 50.001 dòng thành 2 file theo tháng, chọn lại file thứ nhất: đọc được, không báo lỗi giới hạn"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-351",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-025",
          "NFR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn file .csv lưu bảng mã Windows-1258: báo lỗi \"File CSV phải lưu dạng UTF-8.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-352",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "File .csv sai bảng mã: không hiện chip loại sổ, không hiện bảng tổng hợp"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-353",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Lưu lại file dạng \"CSV UTF-8\", chọn lại: đọc được, hết lỗi bảng mã"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-354",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-003",
          "FR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "File không có dòng tiêu đề hợp lệ: báo lỗi \"Không nhận ra loại file. Cần dòng tiêu đề \"Ngày hạch toán …\" (dòng tiền thu) hoặc \"Mã dự án … | Chi sản xuất …\" (chi thực tế).\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-355",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "File không nhận ra loại sổ: không hiện chip loại sổ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-356",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-004",
          "FR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ thu thiếu cột Số tiền: báo lỗi \"Thiếu cột \"Số tiền\".\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-357",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-005",
          "FR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ chi thiếu cột Tháng: báo lỗi \"Thiếu cột \"Tháng (MM/yyyy)\".\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-358",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-011",
          "FR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "File chỉ có dòng tên cột, không có dòng dữ liệu: báo lỗi \"File không có dòng dữ liệu nào.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-359",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-011",
          "BR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Lỗi cấp file",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "File không có dòng dữ liệu: nút Import sổ mờ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-360",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-025",
          "FR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Sheet đầu có ô \"Ngày hạch toán\": nhận loại sổ Dòng tiền thu, chip \"Dòng tiền thu\" màu xanh",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-361",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-025",
          "FR-bao-cao-hieu-qua-du-an-024"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Sheet đầu có ô bắt đầu \"Mã dự án\" và ô bắt đầu \"Chi sản xuất\" trên cùng dòng: nhận loại sổ Chi thực tế, chip \"Chi thực tế\" màu đỏ",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-362",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-025",
          "E-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô \"Mã dự án\" và ô \"Chi sản xuất\" nằm ở 2 dòng khác nhau, không có ô \"Ngày hạch toán\": báo lỗi không nhận ra loại file"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-363",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sheet có cả ô \"Ngày hạch toán\" lẫn dòng \"Mã dự án … Chi sản xuất …\": nhận loại sổ Dòng tiền thu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-364",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô tiêu đề viết \"NGAY HACH TOAN\" (không dấu, chữ hoa): nhận loại sổ Dòng tiền thu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-365",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô tiêu đề \"Ngày   hạch toán\" có nhiều khoảng trắng: nhận loại sổ Dòng tiền thu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-366",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Cột tên \"Số tiền (VNĐ)\": được ánh xạ thành cột Số tiền theo tiền tố"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-367",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Các cột sổ chi xếp khác thứ tự file mẫu: Chi sản xuất, Chi kinh doanh vẫn ánh xạ đúng theo tên"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-368",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "File sổ thu có 2 dòng tiêu đề báo cáo phía trên dòng tên cột: 2 dòng đó bị bỏ qua, không báo lỗi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-369",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Nhận loại sổ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "File sổ chi không có cột Chi kinh doanh: các dòng nhận Chi KD bằng 0, không báo lỗi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-370",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-006",
          "FR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi dòng sổ thu",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ thu có Ngày hạch toán \"31/13/2026\": báo \"Ngày hạch toán \"31/13/2026\" không hợp lệ (dùng dd/mm/yyyy).\" kèm \"Dòng {n}\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-371",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-006",
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi dòng sổ thu",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ thu có Ngày hạch toán \"32/08/2026\": báo lỗi Ngày hạch toán không hợp lệ kèm \"Dòng {n}\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-372",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-007",
          "FR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi dòng sổ thu",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ thu có Số tiền \"abc\": báo \"Số tiền \"abc\" không phải số.\" kèm \"Dòng {n}\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-373",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-027",
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi dòng sổ thu",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ thu có Số tiền trống: không báo lỗi, dòng nhận Số tiền 0"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-374",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-008",
          "FR-bao-cao-hieu-qua-du-an-025",
          "BR-bao-cao-hieu-qua-du-an-029"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi dòng sổ chi",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ chi trống Mã dự án: báo \"Thiếu Mã dự án.\" kèm \"Dòng {n}\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-375",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-009",
          "FR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi dòng sổ chi",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ chi có Tháng \"13/2026\": báo \"Tháng \"13/2026\" không hợp lệ (dùng MM/yyyy).\" kèm \"Dòng {n}\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-376",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-010",
          "FR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi dòng sổ chi",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ chi có Chi sản xuất \"abc\": báo \"Chi sản xuất / Chi kinh doanh không phải số.\" kèm \"Dòng {n}\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-377",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-010"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi dòng sổ chi",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ chi có Chi kinh doanh \"abc\": báo \"Chi sản xuất / Chi kinh doanh không phải số.\" kèm \"Dòng {n}\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-378",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-026",
          "FR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Dòng thuộc tháng tương lai",
        "priority": 1,
        "auto": "Yes",
        "text": "Tháng hiện tại 10/2026, dòng sổ thu có Ngày hạch toán 05/11/2026: báo \"Tháng 11/2026 sau tháng hiện tại.\" kèm \"Dòng {n}\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-379",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-026",
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Dòng thuộc tháng tương lai",
        "priority": 1,
        "auto": "Yes",
        "text": "Tháng hiện tại 10/2026, dòng sổ chi có Tháng 11/2026: báo \"Tháng 11/2026 sau tháng hiện tại.\" kèm \"Dòng {n}\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-380",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Dòng thuộc tháng tương lai",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ chi có Tháng bằng tháng hiện tại 10/2026: không báo lỗi tháng tương lai"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-381",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-026",
          "BR-bao-cao-hieu-qua-du-an-028",
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Dòng thuộc tháng tương lai",
        "priority": 1,
        "auto": "Yes",
        "text": "File có 1 dòng thuộc tháng tương lai: nút Import sổ mờ",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-382",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-026",
          "NFR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Dòng thuộc tháng tương lai",
        "priority": 2,
        "auto": "No",
        "text": "Máy đặt múi giờ UTC, thao tác lúc 01h ngày 01/11 giờ Việt Nam: dòng tháng 11 không bị báo tháng tương lai"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-383",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi đầu tiên của dòng & số dòng",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ thu sai cả Ngày hạch toán lẫn Số tiền: chỉ báo lỗi Ngày hạch toán"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-384",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi đầu tiên của dòng & số dòng",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ thu có Ngày thuộc tháng tương lai, Số tiền \"abc\": chỉ báo lỗi tháng tương lai"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-385",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi đầu tiên của dòng & số dòng",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ chi trống Mã dự án, Tháng sai: chỉ báo \"Thiếu Mã dự án.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-386",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi đầu tiên của dòng & số dòng",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ chi Tháng sai, Chi sản xuất \"abc\": chỉ báo lỗi Tháng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-387",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi đầu tiên của dòng & số dòng",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ chi Tháng thuộc tháng tương lai, Chi sản xuất \"abc\": chỉ báo lỗi tháng tương lai"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-388",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi đầu tiên của dòng & số dòng",
        "priority": 1,
        "auto": "Yes",
        "text": "File sổ thu có 2 dòng tiêu đề báo cáo, 1 dòng tên cột, 1 dòng trống xen giữa, lỗi nằm ở dòng 7 khi mở bằng Excel: lỗi báo \"Dòng 7\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-389",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Lỗi đầu tiên của dòng & số dòng",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng trống hoàn toàn xen giữa dữ liệu: bị bỏ qua, không báo lỗi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-390",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Ngày hạch toán là số ngày kiểu Excel: hợp lệ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-391",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Ngày hạch toán \"5/9/2026\" (d/m/yyyy): hợp lệ, nhận ngày 05/09/2026"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-392",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Ngày hạch toán \"05.09.2026\": hợp lệ, nhận ngày 05/09/2026"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-393",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Ngày hạch toán \"05-09-2026\": hợp lệ, nhận ngày 05/09/2026"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-394",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Ngày hạch toán \"2026-9-5\" (yyyy-m-d): hợp lệ, nhận ngày 05/09/2026"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-395",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Tháng \"9/2026\" (M/yyyy): hợp lệ, nhận tháng 09/2026"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-396",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Tháng \"2026-9\" (yyyy-M): hợp lệ, nhận tháng 09/2026"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-397",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Tháng là ngày \"15/09/2026\": hợp lệ, nhận tháng 09/2026"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-398",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Tháng là số ngày kiểu Excel: hợp lệ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-399",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Số tiền \"1.000.000\": nhận 1.000.000 VNĐ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-400",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Số tiền \"1,000,000\": nhận 1.000.000 VNĐ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-401",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Số tiền \"1000,5\": nhận 1000.5 (dấu \",\" còn lại là dấu thập phân)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-402",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô Chi sản xuất \"-\": nhận 0"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-403",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Ô Chi sản xuất \"–\": nhận 0"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-404",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Chuẩn hoá giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Số tiền \"-500000\" (bút toán điều chỉnh): hợp lệ, nhận số âm"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-405",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-012",
          "FR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Cảnh báo",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ thu có 3 dòng trống Mã công trình: cảnh báo \"3 dòng không có mã công trình — lưu vào sổ nhưng không tính vào dự án nào (vd hoàn ứng, chi phí chung).\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-406",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-012"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Cảnh báo",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ thu không có cột Mã công trình, 10 dòng dữ liệu: cảnh báo \"10 dòng không có mã công trình — lưu vào sổ nhưng không tính vào dự án nào (vd hoàn ứng, chi phí chung).\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-407",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-012",
          "BR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Cảnh báo",
        "priority": 1,
        "auto": "Yes",
        "text": "File chỉ có cảnh báo, không có lỗi: nút Import sổ bật",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-408",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-013",
          "FR-bao-cao-hieu-qua-du-an-025"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Cảnh báo",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ thu có 4 dòng mang 2 mã chưa khớp dự án nào (ZZ1, ZZ2): cảnh báo \"4 dòng có mã chưa khớp dự án nào: ZZ1, ZZ2\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-409",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-029",
          "E-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Cảnh báo",
        "priority": 3,
        "auto": "Yes",
        "text": "Có 13 mã chưa khớp: cảnh báo liệt kê 12 mã kèm \"…\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-410",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Cảnh báo",
        "priority": 2,
        "auto": "Yes",
        "text": "File có cảnh báo: chip \"{n} cảnh báo\" màu vàng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-411",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-029",
          "E-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Kiểm tra từng dòng",
        "subcategory": "Cảnh báo",
        "priority": 2,
        "auto": "Yes",
        "text": "Đã import file có 3 dòng không mã công trình, chọn lại cùng file: dải vàng nêu số dòng sổ hiện có gồm cả 3 dòng đó"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-412",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Bước 3 hiện đủ: chip loại sổ, \"{n} dòng\", \"Tháng MM/YYYY, …\", \"{n} dự án khớp mã\", \"{n} lỗi\", \"{n} cảnh báo\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-413",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "File có cả lỗi và cảnh báo: danh sách lỗi hiện trước danh sách cảnh báo"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-414",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "File sổ thu có dòng tháng 08 và 09/2026: bước 3 hiện \"Tháng 08/2026, 09/2026\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-415",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ thu: bảng tổng hợp có cột Dự án · Số dòng · Số tiền thu",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-416",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ chi: bảng tổng hợp có cột Dự án · Số dòng · Chi sản xuất · Chi kinh doanh"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-417",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-026",
          "BR-bao-cao-hieu-qua-du-an-029"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng không mã công trình và dòng mã chưa khớp được gom vào dòng \"Không gắn / chưa khớp dự án\" của bảng tổng hợp",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-418",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Tổng Số dòng và tổng Số tiền của bảng tổng hợp khớp với file"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-419",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020",
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ chi mang Mã KD của dự án X được gộp vào dòng của X ở bảng tổng hợp"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-420",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ chi mang mã outsource đã xoá của dự án X được gộp vào dòng của X"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-421",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Mã dự án viết chữ thường, có khoảng trắng đầu / cuối: vẫn gộp vào đúng dự án"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-422",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-020"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng sổ thu mang mã chưa được cấp cho dự án nào: nằm ở dòng \"Không gắn / chưa khớp dự án\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-423",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-014",
          "FR-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ Chi thực tế đang có 120 dòng hiệu lực tháng 09/2026, chọn file Chi tháng 09/2026: dải vàng \"Sổ Chi thực tế đang có 120 dòng ở tháng 09/2026 — sẽ được thay bằng dữ liệu trong file này.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-424",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-026",
          "E-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Số dòng ở dải vàng gồm cả dòng sổ cùng loại không gắn dự án ở các tháng trong file"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-425",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Xem trước",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sổ cùng loại chưa có dòng ở các tháng trong file (sổ loại kia đã có dòng): không có dải vàng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-426",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-029"
        ],
        "category": "Tải danh sách dòng lỗi",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Kết quả kiểm tra có lỗi: có nút tải danh sách dòng lỗi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-427",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-029"
        ],
        "category": "Tải danh sách dòng lỗi",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Kết quả kiểm tra 0 lỗi: không có nút tải danh sách dòng lỗi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-428",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-029"
        ],
        "category": "Tải danh sách dòng lỗi",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Bấm tải danh sách dòng lỗi: tải file Excel mỗi lỗi 1 dòng gồm số \"Dòng {n}\" và lý do",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-429",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-029",
          "BR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Tải danh sách dòng lỗi",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "File có dòng trống xen giữa: số Dòng trong file lỗi tải về khớp số dòng thật trên sheet"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-430",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-029"
        ],
        "category": "Tải danh sách dòng lỗi",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Lỗi cấp file (sai định dạng): file lỗi tải về để trống cột Dòng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-431",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-029"
        ],
        "category": "Tải danh sách dòng lỗi",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Cột lý do trong file lỗi đúng câu lỗi hiển thị trên popup"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-432",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-029",
          "E-bao-cao-hieu-qua-du-an-026"
        ],
        "category": "Tải danh sách dòng lỗi",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "File có dòng tháng tương lai: file lỗi tải về có lý do \"Tháng {MM/YYYY} sau tháng hiện tại.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-433",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-029"
        ],
        "category": "Tải danh sách dòng lỗi",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Tải danh sách dòng lỗi xong: popup giữ bước 3, nút Import sổ vẫn mờ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-434",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Tải danh sách dòng lỗi",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Sửa file theo danh sách lỗi, bấm \"Chọn lại\", chọn file đã sửa: hết lỗi, nút Import sổ bật"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-435",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-027",
          "BR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Điều kiện bật nút",
        "priority": 1,
        "auto": "Yes",
        "text": "Đã nhận loại sổ, có ít nhất 1 dòng hợp lệ, 0 lỗi: nút Import sổ bật"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-436",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Điều kiện bật nút",
        "priority": 1,
        "auto": "Yes",
        "text": "File 99 dòng hợp lệ, 1 dòng lỗi: nút Import sổ mờ",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-437",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-030",
          "E-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Hộp xác nhận thay thế",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ Chi thực tế đã có dòng tháng 09/2026, bấm Import sổ: hiện hộp xác nhận \"Sẽ thay toàn bộ sổ Chi thực tế các tháng 09/2026 — {n} dòng cũ của {m} dự án không có trong file sẽ bị xoá.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-438",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-038"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Hộp xác nhận thay thế",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ cũ tháng 09 có 5 dòng của dự án A, B mà file không có dòng nào của A, B: hộp xác nhận nêu \"5 dòng cũ\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-439",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-038"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Hộp xác nhận thay thế",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án A, B có dòng cũ tháng 09, file không có dòng nào của A, B: hộp xác nhận nêu \"của 2 dự án\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-440",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-038"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Hộp xác nhận thay thế",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng cũ không gắn dự án nào ở tháng 09 không được tính vào số dòng cũ của hộp xác nhận"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-441",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Hộp xác nhận thay thế",
        "priority": 2,
        "auto": "Yes",
        "text": "Mọi dự án có dòng cũ đều có dòng trong file: hộp xác nhận nêu \"0 dòng cũ của 0 dự án\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-442",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Hộp xác nhận thay thế",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn quay lại trong hộp xác nhận: không ghi gì, popup giữ bước xem trước",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-443",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-030",
          "FR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Hộp xác nhận thay thế",
        "priority": 1,
        "auto": "Yes",
        "text": "Đồng ý trong hộp xác nhận: sổ được ghi, toast \"Đã import …\" hiện",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-444",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Bấm Import sổ & hộp xác nhận",
        "subcategory": "Hộp xác nhận thay thế",
        "priority": 1,
        "auto": "Yes",
        "text": "Sổ cùng loại chưa có dòng ở các tháng trong file, bấm Import sổ: ghi ngay, không hiện hộp xác nhận",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-445",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Kết quả hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ Chi thực tế 250 dòng tháng 08, 09/2026 thành công: toast góc phải \"Đã import Chi thực tế: 250 dòng, tháng 08/2026, 09/2026 — cập nhật {m} dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-446",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-027",
          "BR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Kết quả hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "File có dòng của 3 dự án, dự án D chỉ có dòng cũ bị thay: toast nêu \"cập nhật 4 dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-447",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-004",
          "FR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Kết quả hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Toast kết quả import tự ẩn sau 3 giây"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-448",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Kết quả hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Import thành công: popup P-07 đóng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-449",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Kết quả hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Import thành công, tải lại trang: báo cáo vẫn hiện số thực tế mới",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-450",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Kết quả hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Import thành công, đăng xuất, đăng nhập lại: báo cáo vẫn hiện số thực tế mới"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-451",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Thay thế theo tháng",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ Chi tháng 09: dòng Chi cũ tháng 09 không còn trong P-06",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-452",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Thay thế theo tháng",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ Chi tháng 09: dòng Chi tháng 08 giữ nguyên trong P-06",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-453",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Thay thế theo tháng",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ Chi tháng 09: dòng sổ Dòng tiền thu tháng 09 giữ nguyên trong P-06"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-454",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-001",
          "BR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Thay thế theo tháng",
        "priority": 2,
        "auto": "No",
        "text": "Dòng bị thay vẫn còn trong dữ liệu lưu trữ ở trạng thái hết hiệu lực"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-455",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Thay thế theo tháng",
        "priority": 3,
        "auto": "No",
        "text": "Tệp gốc của lần import được lưu kèm nhật ký import, tra được qua bộ phận vận hành"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-456",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Tính lại Thu / Chi thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ thu tháng 09: Thu thực tế tháng 09 của dự án X bằng Σ Số tiền các dòng khớp mã của X",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-457",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Tính lại Thu / Chi thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ chi: Chi SX thực tế từng tháng của dự án X bằng Σ Chi sản xuất các dòng khớp mã của X"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-458",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Tính lại Thu / Chi thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ chi: Chi KD thực tế từng tháng của dự án X bằng Σ Chi kinh doanh các dòng khớp mã của X"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-459",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Tính lại Thu / Chi thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án D có Chi tháng 09, file mới không có dòng của D: Chi thực tế tháng 09 của D về 0",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-460",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Tính lại Thu / Chi thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án không có dòng cũ, không có dòng mới ở các tháng trong file: số thực tế giữ nguyên"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-461",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-031",
          "BR-bao-cao-hieu-qua-du-an-036"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Tính lại Thu / Chi thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ Chi tháng 10 (tháng mới của dự án): Doanh thu tháng 10 vẫn hiện \"–\" ở bảng số liệu từng tháng",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-462",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-031",
          "BR-bao-cao-hieu-qua-du-an-036"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Tính lại Thu / Chi thực tế",
        "priority": 2,
        "auto": "Yes",
        "text": "Import sổ Chi tháng 10 (tháng mới của dự án): KLCV tháng 10 vẫn hiện \"–\" ở bảng số liệu từng tháng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-463",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Tính lại Thu / Chi thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Dự án ở trạng thái Kết thúc có dòng khớp mã: Chi thực tế được tính lại",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-464",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Tính lại Thu / Chi thực tế",
        "priority": 2,
        "auto": "Yes",
        "text": "Dự án ở trạng thái Pending có dòng khớp mã: Chi thực tế được tính lại"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-465",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-002",
          "BR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Chốt số & báo cáo cập nhật",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ Chi có tháng 09 mới: meta Chốt số CP lên 09/YYYY",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-466",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-002"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Chốt số & báo cáo cập nhật",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ Chi có tháng 09 mới: Chốt số DT, DTT, KLCV giữ nguyên"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-467",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-002",
          "BR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Chốt số & báo cáo cập nhật",
        "priority": 2,
        "auto": "Yes",
        "text": "Import sổ Dòng tiền thu có tháng mới: meta Chốt số DTT lên tháng mới"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-468",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-034",
          "BR-bao-cao-hieu-qua-du-an-036"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Chốt số & báo cáo cập nhật",
        "priority": 2,
        "auto": "Yes",
        "text": "Dự án chưa có PAKD được duyệt, có dòng Chi khớp mã trong file: import xong dự án có dòng trong bảng \"Chi tiết theo dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-469",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-032"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Lịch sử dự án & nhật ký import",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ Chi: lịch sử dự án bị ảnh hưởng có dòng \"Cập nhật Chi thực tế từ sổ kế toán\", ghi chú \"{tên file} · {n} dòng\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-470",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-032"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Lịch sử dự án & nhật ký import",
        "priority": 2,
        "auto": "Yes",
        "text": "Import sổ thu: lịch sử dự án bị ảnh hưởng có dòng \"Cập nhật Dòng tiền thu từ sổ kế toán\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-471",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-032"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Lịch sử dự án & nhật ký import",
        "priority": 1,
        "auto": "Yes",
        "text": "Import sổ: số phiên bản dự án không tăng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-472",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-032"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Lịch sử dự án & nhật ký import",
        "priority": 2,
        "auto": "Yes",
        "text": "Dự án Kết thúc bị ảnh hưởng: lịch sử dự án có dòng cập nhật từ sổ kế toán"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-473",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-032",
          "FR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Lịch sử dự án & nhật ký import",
        "priority": 2,
        "auto": "Yes",
        "text": "Import thành công: Lịch sử import có lần mới ở trên cùng với Loại sổ, Tên file, Tháng, Số dòng đúng lần vừa import"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-474",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-007",
          "BR-bao-cao-hieu-qua-du-an-032"
        ],
        "category": "Ghi sổ & tính lại thực tế",
        "subcategory": "Lịch sử dự án & nhật ký import",
        "priority": 1,
        "auto": "Yes",
        "text": "Lịch sử import ghi Người import đúng tài khoản Kế toán đang đăng nhập",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-475",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-027",
          "NFR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Bấm lặp",
        "priority": 1,
        "auto": "Yes",
        "text": "Bấm Import sổ 2 lần liên tiếp: Lịch sử import chỉ thêm 1 lần import"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-476",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Bấm lặp",
        "priority": 2,
        "auto": "No",
        "text": "Trong lúc đang ghi sổ: nút Import sổ mờ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-477",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-022",
          "NFR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Sổ đã đổi tại lúc ghi",
        "priority": 1,
        "auto": "No",
        "text": "Kế toán A đang mở hộp xác nhận sổ Chi tháng 09/2026, Kế toán B import xong sổ Chi tháng 09/2026, A đồng ý: A thấy \"Sổ Chi thực tế các tháng 09/2026 vừa được cập nhật — đã tính lại kết quả kiểm tra, vui lòng xem lại trước khi import.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-478",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-022",
          "NFR-bao-cao-hieu-qua-du-an-013",
          "BR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Sổ đã đổi tại lúc ghi",
        "priority": 1,
        "auto": "No",
        "text": "Tình huống A đồng ý khi sổ đã đổi: lần đồng ý của A không ghi, sổ tháng 09 giữ theo lần import của B"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-479",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-022",
          "E-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Sổ đã đổi tại lúc ghi",
        "priority": 2,
        "auto": "No",
        "text": "Tình huống A đồng ý khi sổ đã đổi: P-07 của A giữ bước 3, dải vàng nêu số dòng sổ hiện có theo sổ của B"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-480",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-022",
          "BR-bao-cao-hieu-qua-du-an-038"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Sổ đã đổi tại lúc ghi",
        "priority": 2,
        "auto": "No",
        "text": "Tình huống A đồng ý khi sổ đã đổi: A bấm Import sổ lần nữa, hộp xác nhận nêu số dòng cũ, số dự án tính theo sổ của B"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-481",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Sổ đã đổi tại lúc ghi",
        "priority": 2,
        "auto": "No",
        "text": "Tình huống A đồng ý khi sổ đã đổi: A đồng ý ở hộp xác nhận mới, ghi thành công kèm toast"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-482",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Sổ đã đổi tại lúc ghi",
        "priority": 1,
        "auto": "No",
        "text": "2 Kế toán cùng bấm Import sổ Chi tháng 09/2026 cùng lúc: Lịch sử import chỉ thêm 1 lần import"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-483",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-022",
          "NFR-bao-cao-hieu-qua-du-an-007",
          "NFR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Mất vai trò Kế toán",
        "priority": 1,
        "auto": "No",
        "text": "Tài khoản bị gỡ vai trò Kế toán khi P-07 đang mở, bấm Import sổ: báo \"Bạn không còn quyền import sổ kế toán.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-484",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-022",
          "NFR-bao-cao-hieu-qua-du-an-013"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Mất vai trò Kế toán",
        "priority": 1,
        "auto": "No",
        "text": "Tình huống mất vai trò Kế toán: không có dòng sổ nào được ghi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-485",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Mất vai trò Kế toán",
        "priority": 2,
        "auto": "No",
        "text": "Tình huống mất vai trò Kế toán: P-07 đóng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-486",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-022",
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Mất vai trò Kế toán",
        "priority": 2,
        "auto": "No",
        "text": "Tình huống mất vai trò Kế toán: nút Import sổ kế toán bị ẩn"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-487",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-015",
          "E-bao-cao-hieu-qua-du-an-022"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Mất vai trò Kế toán",
        "priority": 2,
        "auto": "No",
        "text": "Lần import bị từ chối được ghi nhận tra soát đủ người, thời điểm, thao tác, lý do"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-488",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Ghi không thành công",
        "priority": 1,
        "auto": "No",
        "text": "Giả lập lỗi hệ thống giữa lúc ghi sổ: báo \"Thao tác chưa thực hiện được, vui lòng thử lại\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-489",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-014",
          "E-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Ghi không thành công",
        "priority": 1,
        "auto": "No",
        "text": "Lỗi giữa lúc ghi sổ: sổ, Thu / Chi thực tế, nhật ký import, lịch sử dự án giữ như trước thao tác"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-490",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Ghi không thành công",
        "priority": 2,
        "auto": "No",
        "text": "Lỗi giữa lúc ghi sổ: P-07 giữ bước 3 kèm thông báo lỗi đỏ, không có toast"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-491",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-021",
          "NFR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Ghi không thành công",
        "priority": 1,
        "auto": "No",
        "text": "Gặp lỗi giữa lúc ghi, bấm Import sổ lại thành công: có đúng 1 nhật ký import, mỗi dự án bị ảnh hưởng có đúng 1 dòng lịch sử"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-492",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Ghi không thành công",
        "priority": 2,
        "auto": "No",
        "text": "Mất kết nối mạng giữa lúc ghi sổ: báo \"Thao tác chưa thực hiện được, vui lòng thử lại\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-493",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-015",
          "E-bao-cao-hieu-qua-du-an-021"
        ],
        "category": "Bấm lặp, đồng thời & kiểm tại lúc ghi",
        "subcategory": "Ghi không thành công",
        "priority": 2,
        "auto": "No",
        "text": "Lần ghi không thành công được ghi nhận tra soát đủ người, thời điểm, tên file, loại sổ, các tháng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-494",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Chọn lại / Huỷ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Đã chọn file, bấm \"Chọn lại\": kết quả đọc bị xoá, popup về bước chọn file"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-495",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Chọn lại / Huỷ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Bấm \"Huỷ\": popup đóng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-496",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Chọn lại / Huỷ",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Bấm \"Huỷ\" ở bước xem trước hợp lệ: không ghi gì (Lịch sử import không có lần mới)",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-497",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Chọn lại / Huỷ",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Bấm nền tối ngoài popup: P-07 đóng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-498",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Chọn lại / Huỷ",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Bấm nút ×: P-07 đóng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-499",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-028"
        ],
        "category": "Chọn lại / Huỷ",
        "subcategory": "",
        "priority": 3,
        "auto": "Yes",
        "text": "Chưa chọn file: không có link \"Chọn lại\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-500",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Đã có 11 lần import: mục Lịch sử import chỉ hiện 10 lần",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-501",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Mục Lịch sử import xếp lần mới nhất trên cùng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-502",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Lịch sử import gồm cả lần import sổ Dòng tiền thu và sổ Chi thực tế"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-503",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Mỗi lần trong Lịch sử import hiện đủ: Loại sổ · Tên file · Tháng · Số dòng · Người import · Thời điểm"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-504",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-031",
          "NFR-bao-cao-hieu-qua-du-an-006"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Trình duyệt đặt múi giờ UTC: Thời điểm trong Lịch sử import hiển thị theo giờ Việt Nam"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-505",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-031",
          "NFR-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Lịch sử import không có thao tác xem dòng sổ bị thay, không có thao tác tải tệp gốc"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-506",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-012"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Lịch sử import không có thao tác sửa / xoá"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-507",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-015"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Import file có lỗi (không ghi): Lịch sử import không có lần mới"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-508",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-015"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "No",
        "text": "Lần import có lỗi được ghi nhận tra soát đủ người, thời điểm, tên file, loại sổ, số lỗi, các lỗi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-509",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-012"
        ],
        "category": "Lịch sử import",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Dòng lịch sử dự án \"Cập nhật … từ sổ kế toán\" không có thao tác sửa / xoá"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-510",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-039"
        ],
        "category": "Tính lại khi dự án được cấp mã",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ Chi mang mã X.3 được import khi X.3 chưa cấp, cấp mã outsource X.3 cho dự án X: Chi thực tế của X cộng thêm dòng đó",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-511",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-039"
        ],
        "category": "Tính lại khi dự án được cấp mã",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "Dòng sổ thu mang mã Y được import khi dự án chưa có Mã tổng, dự án được cấp Mã tổng Y: Thu thực tế của dự án tính lại theo dòng đó"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-512",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-039"
        ],
        "category": "Tính lại khi dự án được cấp mã",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Cấp mã X.3 khớp 4 dòng sổ Chi: lịch sử dự án có dòng \"Cập nhật Chi thực tế từ sổ kế toán\", ghi chú \"Cấp mã X.3 · 4 dòng\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-513",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-039"
        ],
        "category": "Tính lại khi dự án được cấp mã",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Cấp mã khớp dòng sổ: số phiên bản dự án không tăng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-514",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-039",
          "NFR-bao-cao-hieu-qua-du-an-014"
        ],
        "category": "Tính lại khi dự án được cấp mã",
        "subcategory": "",
        "priority": 2,
        "auto": "No",
        "text": "Giả lập lỗi giữa chừng khi tính lại do cấp mã: Thu / Chi thực tế, lịch sử dự án không thay đổi"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "chung",
    "file": "checklist-uc-chung.md",
    "items": [
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-515",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-001",
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "AM & tài khoản không có vai trò xem báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "AM đăng nhập: menu \"Báo cáo hiệu quả dự án\" không hiện",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-516",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-027",
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "AM & tài khoản không có vai trò xem báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "AM mở trực tiếp đường dẫn MH-03: hiện \"Bạn không có quyền thực hiện thao tác này.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-517",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-027",
          "NFR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "AM & tài khoản không có vai trò xem báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "AM mở trực tiếp đường dẫn MH-03: không hiện số liệu báo cáo nào"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-518",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-027",
          "NFR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "AM & tài khoản không có vai trò xem báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "AM mở trực tiếp đường dẫn P-06: hiện \"Bạn không có quyền thực hiện thao tác này.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-519",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-027",
          "NFR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "AM & tài khoản không có vai trò xem báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Tài khoản không có vai trò xem báo cáo mở trực tiếp đường dẫn MH-03: hiện \"Bạn không có quyền thực hiện thao tác này.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-520",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-037",
          "NFR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "Import sổ & P-07 chỉ dành cho Kế toán",
        "priority": 1,
        "auto": "Yes",
        "text": "Ban lãnh đạo mở MH-03: không thấy nút Import sổ kế toán",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-521",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-037",
          "NFR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "Import sổ & P-07 chỉ dành cho Kế toán",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK mở MH-03: không thấy nút Import sổ kế toán",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-522",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-037",
          "NFR-bao-cao-hieu-qua-du-an-007"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "Import sổ & P-07 chỉ dành cho Kế toán",
        "priority": 1,
        "auto": "Yes",
        "text": "SM mở MH-03: không thấy nút Import sổ kế toán",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-523",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-007",
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "Import sổ & P-07 chỉ dành cho Kế toán",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK mở trực tiếp đường dẫn P-07: không mở được P-07",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-524",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-037",
          "FR-bao-cao-hieu-qua-du-an-031"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "Import sổ & P-07 chỉ dành cho Kế toán",
        "priority": 1,
        "auto": "Yes",
        "text": "Ban lãnh đạo mở trực tiếp đường dẫn P-07: không thấy mục Lịch sử import"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-525",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "Vai trò xem báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Ban lãnh đạo mở MH-03: xem được báo cáo dự án mọi khối",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-526",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "Vai trò xem báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "SM mở MH-03: xem được báo cáo dự án khối mình",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-527",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "Vai trò xem báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "Ban lãnh đạo bấm số thực tế Chi phí: P-06 mở với các dòng sổ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-528",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Phân quyền theo vai trò",
        "subcategory": "Vai trò xem báo cáo",
        "priority": 1,
        "auto": "Yes",
        "text": "SM bấm số thực tế Dòng tiền thu: P-06 mở với các dòng sổ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-529",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-027",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK khối G1 mở trực tiếp đường dẫn tab dự án của 1 dự án khối G2: hiện \"Bạn không có quyền thực hiện thao tác này.\"",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-530",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-027",
          "NFR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK khối G1 mở trực tiếp đường dẫn dự án khối G2: không hiện số liệu của dự án khối G2"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-531",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-027",
          "NFR-bao-cao-hieu-qua-du-an-011"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK khối G1 mở trực tiếp đường dẫn P-06 của dự án khối G2: bị từ chối, không hiện dòng sổ nào"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-532",
        "ref": [
          "E-bao-cao-hieu-qua-du-an-027",
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "GĐK khối G1 mở trực tiếp đường dẫn với Phạm vi \"Toàn công ty\": hiện \"Bạn không có quyền thực hiện thao tác này.\""
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-533",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "SM khối G3: bảng \"Chi tiết theo dự án\" chỉ có dự án khối G3",
        "uat": true
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-534",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-005"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "",
        "priority": 1,
        "auto": "Yes",
        "text": "SM khối G3 bấm số thực tế ô Chi phí: P-06 chỉ có dòng sổ của dự án khối G3"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-535",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-011",
          "E-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "",
        "priority": 1,
        "auto": "No",
        "text": "GĐK khối G1 gọi thao tác lấy dữ liệu không qua màn cho dự án khối G2: không nhận được dữ liệu ngoài khối"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-536",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-037"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "",
        "priority": 1,
        "auto": "No",
        "text": "Tài khoản bị gỡ vai trò xem báo cáo khi P-06 đang mở, bấm Export XLSX: bị từ chối, không tải file"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-537",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-015",
          "E-bao-cao-hieu-qua-du-an-027"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "",
        "priority": 2,
        "auto": "No",
        "text": "Lần mở MH-03 / P-06 bị từ chối được ghi nhận tra soát đủ người, thời điểm, thao tác, lý do"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-538",
        "ref": [],
        "category": "Loading & response",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Mạng chậm (giả lập 3G), mở MH-03: màn có dấu hiệu đang tải cho tới khi số liệu hiện, không hiện số liệu dở dang"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-539",
        "ref": [],
        "category": "Loading & response",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Mạng chậm, đổi Phạm vi xem: bảng \"Chi tiết theo dự án\" có dấu hiệu đang tải"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-540",
        "ref": [
          "BR-bao-cao-hieu-qua-du-an-040"
        ],
        "category": "Loading & response",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Mở P-06 mức Toàn công ty nhiều dòng: bảng có dấu hiệu đang tải trang đầu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-541",
        "ref": [],
        "category": "Loading & response",
        "subcategory": "",
        "priority": 2,
        "auto": "No",
        "text": "Chọn file 50.000 dòng ở P-07: popup có dấu hiệu đang kiểm tra cho tới khi hiện kết quả"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-542",
        "ref": [],
        "category": "Loading & response",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Bấm Export XLSX với nhiều dòng: có dấu hiệu đang xuất cho tới khi tải file"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-543",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Dùng phím Tab trên MH-03: focus đi theo thứ tự thanh tiêu đề, tab báo cáo, bộ lọc, ô số, bảng"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-544",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Nút gạt chỉ tiêu, trục, sức khoẻ thao tác được bằng bàn phím"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-545",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Ô Từ tháng, Đến tháng, Phạm vi xem, Dự án, ô tìm kiếm P-06 có nhãn đọc được"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-546",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Mở P-06: focus nằm trong popup"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-547",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Vùng chọn file của P-07 mở được hộp chọn file bằng bàn phím"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-548",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Hộp xác nhận thay thế: nút đồng ý, nút quay lại thao tác được bằng bàn phím"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-549",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-009"
        ],
        "category": "Accessibility cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Mức sức khoẻ có nhãn chữ (Tốt, Cần chú ý, Theo dõi, Chưa phát sinh), không chỉ phân biệt bằng màu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-550",
        "ref": [],
        "category": "Responsive cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Thu hẹp cửa sổ Chrome desktop: thanh tiêu đề, 5 ô số không chồng lấn, layout không vỡ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-551",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-003"
        ],
        "category": "Responsive cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Thu hẹp cửa sổ: bảng \"Chi tiết theo dự án\" cuộn ngang trong khung, cột Mã dự án vẫn cố định"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-552",
        "ref": [],
        "category": "Responsive cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Thu hẹp cửa sổ: bảng sổ P-06 cuộn trong popup, nút Export XLSX vẫn thấy"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-553",
        "ref": [],
        "category": "Responsive cơ bản",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Thu hẹp cửa sổ: chân P-07 vẫn thấy đủ nút Chọn lại · Huỷ · Import sổ"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-554",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Edge cases",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "P-07 ở bước xem trước hợp lệ, bấm Back trình duyệt: không có lần import nào được ghi (Lịch sử import không có lần mới)"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-555",
        "ref": [
          "FR-bao-cao-hieu-qua-du-an-030"
        ],
        "category": "Edge cases",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "P-07 ở bước xem trước hợp lệ, tải lại trang (F5): không có lần import nào được ghi"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-556",
        "ref": [
          "NFR-bao-cao-hieu-qua-du-an-001"
        ],
        "category": "Edge cases",
        "subcategory": "",
        "priority": 2,
        "auto": "Yes",
        "text": "Tải lại trang MH-03: báo cáo hiện lại đủ 5 ô số, biểu đồ, bảng với cùng số liệu"
      },
      {
        "chk": "CHK-bao-cao-hieu-qua-du-an-557",
        "ref": [],
        "category": "Edge cases",
        "subcategory": "",
        "priority": 3,
        "auto": "No",
        "text": "Xem, lọc MH-03, mở P-06, Export XLSX không làm thay đổi dữ liệu sổ, số thực tế"
      }
    ]
  }
];
