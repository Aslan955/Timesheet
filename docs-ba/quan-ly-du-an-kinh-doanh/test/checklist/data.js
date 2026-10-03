window.FEATURE = "quan-ly-du-an-kinh-doanh";
window.UPDATED = "2026-10-03";
window.CHECKLISTS_DATA = [
  {
    "scope": "uc",
    "target": "xem-so-theo-doi-du-an",
    "file": "checklist-uc-xem-so-theo-doi-du-an.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-001",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Đầu trang",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mở menu \"Danh sách dự án\" hiển thị đủ breadcrumb \"Quản trị dự án & Tài chính › Danh sách dự án\" và tiêu đề \"Sổ theo dõi dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-002",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-001",
          "BR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Đầu trang",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nút \"Cấp mã dự án\" hiển thị với mỗi vai trò AM, SM, GĐK",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-003",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-001",
          "BR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Đầu trang",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nút \"Cấp mã dự án\" không hiển thị với tài khoản Kế toán",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-004",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Đầu trang",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify rê chuột vào nút \"Cấp mã dự án\" với tài khoản GĐK hiện chú thích \"GĐK tạo → mã được cấp ngay\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-005",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Đầu trang",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify rê chuột vào nút \"Cấp mã dự án\" với tài khoản AM / SM hiện chú thích \"AM / SM tạo → chờ GĐK duyệt mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-006",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Bộ lọc mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bộ lọc Năm mặc định là năm hiện tại khi mở màn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-007",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Bộ lọc mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ô Năm liệt kê \"Tất cả\", năm hiện tại, năm của các dự án, năm đã có mục tiêu, sắp tăng dần"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-008",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Bộ lọc mặc định",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify ô Khối với tài khoản Kế toán gồm \"Tất cả\" và đủ 6 khối G1, G2, G3, G4, BFSI, GPDV"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-009",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Bộ lọc mặc định",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify ô Tìm kiếm có placeholder \"Tìm mã, tên dự án, khách hàng, PM...\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-010",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005",
          "BR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Bộ lọc mặc định",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ô Trạng thái gồm \"Tất cả trạng thái\" và đủ 7 trạng thái Chờ duyệt mã, Từ chối mã, Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, Kết thúc, Pending kèm số đếm"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-011",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Mở màn Danh sách dự án",
        "subcategory": "Bộ lọc mặc định",
        "priority": 4,
        "auto": "No",
        "text": "Verify nhãn trạng thái đúng màu: Chờ duyệt mã xám, Từ chối mã đỏ, Chưa có PAKD đỏ nhạt, PAKD chờ duyệt vàng, Đang thực hiện xanh dương, Kết thúc xanh lá, Pending cam"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-012",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002",
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Giá trị và tiêu đề",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify số to ở ô ① bằng tổng Giá trị đã ký và Giá trị chưa ký của bảng ② trên các khối đang hiển thị",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-013",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002",
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Giá trị và tiêu đề",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify khi Khối = Tất cả, số to ở ô ① bằng đúng số của dòng \"Toàn công ty\" ở bảng ②",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-014",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Giá trị và tiêu đề",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn một năm cụ thể thì tiêu đề ô ① là \"Giá trị hợp đồng dự kiến ký năm {năm}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-015",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Giá trị và tiêu đề",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn Năm = Tất cả thì tiêu đề ô ① là \"Giá trị hợp đồng dự kiến ký (tất cả các năm)\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-016",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Giá trị và tiêu đề",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify lọc Khối G1 thì tiêu đề ô ① có thêm \" · Khối G1\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-017",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Giá trị và tiêu đề",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn một năm cụ thể thì ô ① hiện dòng \"Mục tiêu năm\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-018",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002",
          "BR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Giá trị và tiêu đề",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn Năm = Tất cả thì ô ① hiện dòng \"Mục tiêu luỹ kế\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-019",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Giá trị và tiêu đề",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đổi nội dung ô Tìm kiếm không làm thay đổi số nào ở ô ①"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-020",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Giá trị và tiêu đề",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đổi bộ lọc Trạng thái không làm thay đổi số nào ở ô ①"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-021",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dòng mục tiêu ở ô ① bằng tổng mục tiêu các khối đang hiển thị"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-022",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify khi Giá trị nhỏ hơn Mục tiêu, \"Còn thiếu\" hiện Mục tiêu − Giá trị bằng chữ đỏ",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-023",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khi Giá trị bằng Mục tiêu, \"Còn thiếu\" hiện \"0\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-024",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khi Giá trị lớn hơn Mục tiêu, \"Còn thiếu\" hiện \"Vượt …\" chữ xanh"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-025",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khi các khối đang hiển thị chưa có mục tiêu, \"Còn thiếu\" và \"Đạt\" cùng hiện \"—\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-026",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khi tổng mục tiêu bằng 0, \"Còn thiếu\" và \"Đạt\" cùng hiện \"—\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-027",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify \"Đạt\" bằng Giá trị chia Mục tiêu, hiển thị phần trăm 1 chữ số thập phân",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-028",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify \"Đạt\" hiện chữ xanh khi tỷ lệ chưa làm tròn từ 100% trở lên"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-029",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify tỷ lệ chưa làm tròn 99,96% hiển thị \"100,0%\" nhưng \"Đạt\" không chuyển chữ xanh"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-030",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khi các khối đang hiển thị chưa có mục tiêu, ô ① không hiện thanh tiến độ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-031",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Sổ theo dõi — ô ① Giá trị hợp đồng dự kiến ký",
        "subcategory": "Mục tiêu, Còn thiếu, Đạt",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify khi có mục tiêu, ô ① hiện thanh tiến độ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-032",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cấu trúc bảng",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bảng ② có mỗi khối 1 dòng với đủ cột Khối, So với mục tiêu, Giá trị mục tiêu, Giá trị đã ký, Giá trị chưa ký, Giá trị chờ duyệt PAKD, Giá trị còn thiếu so với mục tiêu, % Đạt"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-033",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cấu trúc bảng",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dòng \"Toàn công ty\" hiện khi Khối = Tất cả"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-034",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cấu trúc bảng",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dòng \"Toàn công ty\" không hiện khi lọc một khối"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-035",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cấu trúc bảng",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify chọn một năm cụ thể thì tiêu đề bảng ② là \"Theo khối so với mục tiêu năm {năm}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-036",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cấu trúc bảng",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify chọn Năm = Tất cả thì tiêu đề bảng ② là \"Theo khối so với mục tiêu (Tất cả)\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-037",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cấu trúc bảng",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify chân khung bảng ② ghi công thức của các cột"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-038",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cấu trúc bảng",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify rê chuột vào thanh \"So với mục tiêu\" hiện \"Đã ký … · Chưa ký … · Mục tiêu …\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-039",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cấu trúc bảng",
        "priority": 4,
        "auto": "No",
        "text": "Verify thanh \"So với mục tiêu\" vẽ phần Đã ký xanh đậm, phần Chưa ký xanh nhạt, vạch đen tại mức mục tiêu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-040",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cấu trúc bảng",
        "priority": 3,
        "auto": "No",
        "text": "Verify thang của thanh mỗi dòng bằng giá trị lớn hơn giữa mục tiêu và tổng Đã ký + Chưa ký của dòng đó"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-041",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cột Giá trị đã ký và Giá trị chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Giá trị đã ký của khối bằng tổng giá trị HĐ ký của các dự án khối có ngày ký trong năm đang lọc, tính cả dự án Kết thúc, Pending",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-042",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cột Giá trị đã ký và Giá trị chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án tạo năm trước, ký HĐ trong năm đang lọc được cộng vào Giá trị đã ký của năm đang lọc"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-043",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019",
          "FR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cột Giá trị đã ký và Giá trị chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Giá trị chưa ký bằng tổng Doanh thu dự kiến theo PAKD đã được Kế toán duyệt của các dự án chưa ký dự kiến ký trong năm đang lọc",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-044",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cột Giá trị đã ký và Giá trị chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án chưa ký có PAKD đang chờ Kế toán duyệt không được cộng vào Giá trị chưa ký",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-045",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cột Giá trị đã ký và Giá trị chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Kết thúc chưa ký không được cộng vào Giá trị chưa ký"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-046",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cột Giá trị đã ký và Giá trị chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Pending chưa ký không được cộng vào Giá trị chưa ký"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-047",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cột Giá trị đã ký và Giá trị chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án tạo năm trước, dự kiến ký trong năm đang lọc được cộng vào Giá trị chưa ký của năm đang lọc"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-048",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cột Giá trị đã ký và Giá trị chưa ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án dữ liệu cũ đã ký nhưng chưa nhập HĐ được tính vào Giá trị đã ký theo năm ngày dự kiến ký"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-049",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Cột Giá trị đã ký và Giá trị chưa ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án dữ liệu cũ đã ký, chưa nhập HĐ, không có ngày dự kiến ký được tính vào Giá trị đã ký theo năm ngày bắt đầu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-050",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Còn thiếu, % Đạt của khối",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Giá trị còn thiếu của khối bằng mục tiêu trừ Giá trị đã ký trừ Giá trị chưa ký",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-051",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Còn thiếu, % Đạt của khối",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify % Đạt của khối bằng (Giá trị đã ký + Giá trị chưa ký) chia mục tiêu",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-052",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Còn thiếu, % Đạt của khối",
        "priority": 3,
        "auto": "No",
        "text": "Verify khối có tỷ lệ chưa làm tròn 99,96% không được đánh dấu là đạt mục tiêu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-053",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Còn thiếu, % Đạt của khối",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khối chưa có mục tiêu hiện \"—\" ở cả % Đạt và Giá trị còn thiếu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-054",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Còn thiếu, % Đạt của khối",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khối có mục tiêu bằng 0 hiện \"—\" ở cả % Đạt và Giá trị còn thiếu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-055",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Còn thiếu, % Đạt của khối",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify khối chưa có mục tiêu: thanh chỉ vẽ Đã ký, Chưa ký, không có vạch mục tiêu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-056",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Năm = Tất cả",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Năm = Tất cả: Giá trị mục tiêu mỗi khối bằng tổng mục tiêu mọi năm của khối đó"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-057",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Năm = Tất cả",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Năm = Tất cả: Giá trị đã ký và Giá trị chưa ký tính dự án của mọi năm"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-058",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Sổ theo dõi — bảng ② Theo khối so với mục tiêu",
        "subcategory": "Năm = Tất cả",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Năm = Tất cả: Giá trị chờ duyệt PAKD tính dự án của mọi năm"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-059",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Phạm vi cộng",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify cột Chờ duyệt PAKD bằng tổng doanh thu đề xuất của bản PAKD lần đầu đang chờ Kế toán duyệt của các dự án chưa ký thuộc khối có ngày dự kiến ký theo bản đang chờ trong năm đang lọc",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-060",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Phạm vi cộng",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bản PAKD làm lại sau khi bị từ chối đang chờ duyệt được cộng vào cột Chờ duyệt PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-061",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Phạm vi cộng",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bản điều chỉnh PAKD đang chờ duyệt của dự án Đang thực hiện không được cộng vào cột Chờ duyệt PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-062",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Phạm vi cộng",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Pending có bản PAKD đang chờ không được cộng vào cột Chờ duyệt PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-063",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Phạm vi cộng",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã ký HĐ có bản PAKD đang chờ không được cộng vào cột Chờ duyệt PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-064",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-046",
          "BR-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Phạm vi cộng",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án tạo năm X có bản PAKD chờ duyệt dự kiến ký năm X+1 được cộng vào cột Chờ duyệt PAKD khi lọc Năm X+1"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-065",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Phạm vi cộng",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dòng \"Toàn công ty\" cộng cột Chờ duyệt PAKD của các khối"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-066",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-045",
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Chỉ để tham khảo",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify thêm một bản PAKD chờ duyệt không làm thay đổi % Đạt của khối",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-067",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-045",
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Chỉ để tham khảo",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify thêm một bản PAKD chờ duyệt không làm thay đổi Giá trị còn thiếu của khối"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-068",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-045",
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Chỉ để tham khảo",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify thêm một bản PAKD chờ duyệt không làm thay đổi số to ở ô ①"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-069",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-045",
          "FR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Sổ theo dõi — cột Giá trị chờ duyệt PAKD",
        "subcategory": "Chỉ để tham khảo",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify thanh \"So với mục tiêu\" không vẽ phần giá trị chờ duyệt PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-070",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-015",
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Năm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify lọc một năm hiển thị dự án đã ký có năm ngày ký HĐ bằng năm chọn",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-071",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Năm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án chưa ký có ngày dự kiến ký được xếp theo năm dự kiến ký khi lọc Năm",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-072",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Năm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án chưa có ngày ký, chưa có ngày dự kiến ký được xếp theo năm tạo khi lọc Năm"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-073",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Năm",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án tạo năm X đang có PAKD lần đầu chờ duyệt dự kiến ký năm X+1 hiện trong danh sách khi lọc Năm X"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-074",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Năm",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án dữ liệu cũ đã ký chưa nhập HĐ hiện trong danh sách khi lọc theo năm ngày dự kiến ký"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-075",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Năm",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Năm = Tất cả hiển thị dự án của mọi năm trong phạm vi khối của tài khoản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-076",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Khối",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán lọc Khối G1 thì danh sách chỉ còn dự án khối G1",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-077",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005",
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Khối",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify ô Khối của bộ lọc với mỗi vai trò GĐK, SM, AM chỉ có khối của tài khoản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-078",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-016",
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Tìm kiếm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tìm kiếm một chuỗi con khớp lần lượt trên mỗi trường Mã dự án, Tên dự án, Mã KH, Tên KH, PM KD, PM SX ra đúng dự án chứa chuỗi đó",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-079",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Tìm kiếm",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chuỗi tìm kiếm có khoảng trắng đầu cuối cho kết quả giống chuỗi đã bỏ khoảng trắng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-080",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Tìm kiếm",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tìm kiếm không phân biệt hoa thường: gõ \"abc\" ra dự án tên \"ABC\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-081",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Tìm kiếm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify gõ \"ha noi\" ra dự án có tên chứa \"Hà Nội\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-082",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Trạng thái và số đếm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chọn trạng thái \"Chờ duyệt mã\" thì danh sách chỉ còn dự án Chờ duyệt mã",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-083",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Trạng thái và số đếm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify số đếm cạnh mỗi trạng thái bằng số dự án thoả Năm, Khối, Tìm kiếm đang chọn",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-084",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Trạng thái và số đếm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chọn một trạng thái không làm thay đổi số đếm cạnh các trạng thái khác"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-085",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Trạng thái và số đếm",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tổ hợp đủ 4 bộ lọc Năm, Khối, Tìm kiếm, Trạng thái ra đúng các dòng thoả cả 4 điều kiện"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-086",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-043",
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Trạng thái và số đếm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã xoá không xuất hiện trong danh sách với Năm = Tất cả, Trạng thái = Tất cả trạng thái",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-087",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Trạng thái và số đếm",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã xoá không được tính vào số đếm trạng thái"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-088",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Không có kết quả",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bộ lọc không ra dòng nào thì bảng hiện 1 dòng \"Không có dự án phù hợp.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-089",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Lọc danh sách dự án",
        "subcategory": "Không có kết quả",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bộ lọc không ra dòng nào thì dòng tổng bị ẩn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-090",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bảng hiển thị đủ 14 cột TT, Mã dự án, Tên dự án, Tên khách hàng, Khối, Loại dự án, Thời điểm dự kiến ký HĐ, Giá trị hợp đồng dự kiến, PM Kinh doanh, PM sản xuất, Trạng thái, Hạn lập PAKD, Phiên bản PAKD, Thao tác với tài khoản Kế toán"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-091",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify nhóm \"Thông tin hợp đồng đã ký\" có đủ 6 cột Giá trị hợp đồng ký, Số hợp đồng, Ngày ký, Ngày hết hạn, Tệp, Trạng thái"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-092",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa có mã hiện \"Chờ cấp mã\" ở cột Mã dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-093",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án trọng điểm hiện nhãn ⭐KEY cạnh Tên dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-094",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify cột \"Giá trị hợp đồng dự kiến\" bằng Doanh thu dự kiến theo PAKD đã được Kế toán duyệt",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-095",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án chưa có PAKD được duyệt hiện \"—\" ở cột \"Giá trị hợp đồng dự kiến\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-096",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify cột \"Thời điểm dự kiến ký HĐ\" lấy theo PAKD đã được Kế toán duyệt"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-097",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa có PAKD được duyệt hiện \"—\" ở cột \"Thời điểm dự kiến ký HĐ\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-098",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dòng \"Tổng cộng (n dự án)\" có Σ Giá trị HĐ dự kiến bằng tổng các dòng đang lọc"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-099",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dòng tổng có Σ Giá trị HĐ ký bằng tổng các dòng đang lọc"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-100",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chân khung hiện \"{n} / {N} dự án · Đang xem với vai trò {vai trò} · Bấm vào dòng để xem chi tiết, bấm \"Đã ký / Chưa ký\" để cập nhật hợp đồng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-101",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột và giá trị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bảng danh sách cuộn ngang được để xem hết các cột"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-102",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã hiện \"—\" ở cột Hạn lập PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-103",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Pending hiện \"Pending\" kèm ngày đóng ở cột Hạn lập PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-104",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024",
          "FR-quan-ly-du-an-kinh-doanh-007"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Chưa có PAKD còn hạn 10 ngày hiện \"Còn 10 ngày\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-105",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify \"Còn 3 ngày\" hiện màu cam"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-106",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify \"Còn 4 ngày\" không hiện màu cam"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-107",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Chưa có PAKD đúng ngày hạn hiện \"Hết hạn hôm nay\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-108",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Chưa có PAKD quá hạn 2 ngày (tác vụ chuyển Pending chưa chạy) hiện \"Quá hạn 2 ngày\" chữ đỏ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-109",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án Chưa có PAKD không có hạn (dữ liệu cũ) hiện \"Chưa đặt hạn\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-110",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Chưa có PAKD có bản mới nhất bị từ chối hiện dòng chính đếm ngày theo hạn gốc",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-111",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Chưa có PAKD có bản mới nhất bị từ chối hiện dòng phụ \"V{n} bị từ chối dd/mm/yyyy\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-112",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án có bản PAKD mới nhất đang chờ Kế toán hiện \"Nộp V{n}\" kèm ngày nộp"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-113",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án có bản PAKD mới nhất đã duyệt hiện \"Duyệt\" kèm ngày duyệt"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-114",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án có bản điều chỉnh PAKD bị từ chối chưa huỷ hiện \"Điều chỉnh bị từ chối dd/mm/yyyy\" với ngày từ chối"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-115",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify sau khi huỷ bản điều chỉnh bị từ chối, cột hiện \"Duyệt\" kèm ngày duyệt của bản PAKD đang áp dụng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-116",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Hạn lập PAKD",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án ở trạng thái khác Chờ duyệt mã, Từ chối mã, Chưa có PAKD, Pending mà không có bản PAKD nào (dữ liệu cũ) hiện \"—\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-117",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-025",
          "FR-quan-ly-du-an-kinh-doanh-007"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Phiên bản PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bản PAKD mới nhất V1 đang chờ hiện \"V1, chờ CFO\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-118",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Phiên bản PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bản PAKD mới nhất V1 đã duyệt hiện \"V1, đã duyệt\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-119",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-025",
          "FR-quan-ly-du-an-kinh-doanh-007"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Phiên bản PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bản PAKD mới nhất V2 bị từ chối hiện \"V2, từ chối\" chữ đỏ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-120",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Phiên bản PAKD",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify sau khi huỷ bản điều chỉnh bị từ chối, cột Phiên bản PAKD hiện bản đang áp dụng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-121",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cột Phiên bản PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa có bản PAKD nào hiện \"—\" ở cột Phiên bản PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-122",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa ký hiện \"—\" chữ xám ở cột Giá trị hợp đồng ký"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-123",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020",
          "BR-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã ký có HĐ hiện giá trị HĐ ở cột Giá trị hợp đồng ký"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-124",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án dữ liệu cũ đã ký chưa nhập HĐ hiện Doanh thu dự kiến ở cột Giá trị hợp đồng ký với tài khoản SM"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-125",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify cột Ngày ký hiện ngày ký trên HĐ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-126",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án dữ liệu cũ đã ký chưa nhập HĐ hiện ngày dự kiến ký ở cột Ngày ký"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-127",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify cột Ngày hết hạn hiện ngày \"Đến\" của HĐ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-128",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án dữ liệu cũ đã ký chưa nhập HĐ hiện ngày kết thúc dự án ở cột Ngày hết hạn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-129",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án dữ liệu cũ đã ký nhưng thiếu dữ liệu HĐ hiện \"—\" ở các cột Số HĐ, Ngày ký, Ngày hết hạn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-130",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án chưa ký, chưa có dữ liệu HĐ để trống các cột Số HĐ, Ngày ký, Ngày hết hạn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-131",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Thông tin hợp đồng đã ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify HĐ không có tệp hiện \"—\" ở cột Tệp"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-132",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cảnh báo quá tháng dự kiến ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã qua tháng dự kiến ký mà chưa có HĐ hiện dòng chữ đỏ \"Quá tháng dự kiến ký MM/YYYY\" dưới Tên dự án",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-133",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006",
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cảnh báo quá tháng dự kiến ký",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tài khoản AM cũng thấy dòng \"Quá tháng dự kiến ký MM/YYYY\", không kèm số tiền"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-134",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Cảnh báo quá tháng dự kiến ký",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi lưu HĐ ở P-03, dòng \"Quá tháng dự kiến ký MM/YYYY\" của dự án không còn hiện"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-135",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023",
          "FR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Chờ duyệt mã hiện link \"Duyệt mã\" với GĐK của khối",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-136",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Chờ duyệt mã hiện link \"Xem\" với mỗi vai trò AM, SM, Kế toán"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-137",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Từ chối mã hiện link \"Gửi lại\" với người tạo dự án",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-138",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Từ chối mã hiện link \"Gửi lại\" với SM của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-139",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Từ chối mã hiện link \"Xem\" với GĐK, Kế toán, AM không phải người tạo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-140",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Chưa có PAKD hiện link \"Lập PAKD\" với mỗi vai trò SM, GĐK"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-141",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Chưa có PAKD hiện link \"Xem\" với mỗi vai trò AM, Kế toán"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-142",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án PAKD chờ duyệt hiện link \"Duyệt\" với Kế toán",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-143",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án PAKD chờ duyệt hiện link \"Xem\" với mỗi vai trò AM, SM, GĐK"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-144",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Đang thực hiện có bản mới nhất là bản điều chỉnh chờ duyệt hiện link \"Duyệt điều chỉnh\" với Kế toán"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-145",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Đang thực hiện không có bản điều chỉnh chờ duyệt hiện link \"Cập nhật\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-146",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Pending hiện link \"Mở lại\" với Kế toán",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-147",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Pending hiện link \"Xem\" với mỗi vai trò AM, SM, GĐK"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-148",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Kết thúc hiện link \"Mở lại\" với Kế toán"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-149",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Kết thúc không có link Thao tác với mỗi vai trò AM, SM, GĐK"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-150",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 4,
        "auto": "Yes",
        "text": "Verify link \"Duyệt\", \"Duyệt điều chỉnh\" hiển thị chữ đỏ đậm"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-151",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán bấm link \"Duyệt\" mở popup duyệt PAKD ngay trên danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-152",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Kế toán bấm link \"Duyệt điều chỉnh\" mở popup duyệt PAKD ngay trên danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-153",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm link \"Xem\" mở màn chi tiết dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-154",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm link \"Gửi lại\" không tự gửi lại yêu cầu: dự án vẫn ở \"Từ chối mã\" khi màn chi tiết mở ra"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-155",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-023",
          "FR-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Kế toán bấm link \"Mở lại\" không tự mở lại dự án: trạng thái giữ nguyên khi màn chi tiết mở ra"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-156",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Link Thao tác",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm link \"Duyệt\" chỉ mở popup duyệt, màn vẫn ở danh sách (không kích hoạt bấm dòng)"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-157",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Bảng danh sách dự án",
        "subcategory": "Mở chi tiết",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm vào một dòng mở màn chi tiết dự án của dòng đó",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-158",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Mở P-03 từ danh sách",
        "subcategory": "Ô Tệp và link Đã ký / Chưa ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify rê chuột vào ô \"📎 {n} tệp\" hiện tên các tệp HĐ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-159",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Mở P-03 từ danh sách",
        "subcategory": "Ô Tệp và link Đã ký / Chưa ký",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm ô \"📎 {n} tệp\" mở popup Cập nhật ký hợp đồng của dự án đó"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-160",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Mở P-03 từ danh sách",
        "subcategory": "Ô Tệp và link Đã ký / Chưa ký",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bấm ô Tệp đang hiện \"—\" không mở popup nào"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-161",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Mở P-03 từ danh sách",
        "subcategory": "Ô Tệp và link Đã ký / Chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò SM, GĐK, Kế toán bấm link \"Chưa ký\" của dự án đã có mã khác Kết thúc mở P-03 ở chế độ cập nhật",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-162",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Mở P-03 từ danh sách",
        "subcategory": "Ô Tệp và link Đã ký / Chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify AM bấm link \"Đã ký\" mở P-03 ở chế độ chỉ xem"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-163",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Mở P-03 từ danh sách",
        "subcategory": "Ô Tệp và link Đã ký / Chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán bấm link \"Đã ký\" của dự án Kết thúc mở P-03 ở chế độ chỉ xem"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-164",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Mở P-03 từ danh sách",
        "subcategory": "Ô Tệp và link Đã ký / Chưa ký",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify SM bấm link \"Chưa ký\" của dự án Pending mở P-03 ở chế độ cập nhật"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-165",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-010",
          "BR-quan-ly-du-an-kinh-doanh-049"
        ],
        "category": "Mở P-03 từ danh sách",
        "subcategory": "Ô Tệp và link Đã ký / Chưa ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify GĐK bấm link \"Chưa ký\" của dự án Chờ duyệt mã mở P-03 ở chế độ chỉ xem"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-166",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009",
          "NFR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm \"Xuất Excel\" tải về tệp \"du-an-kinh-doanh.xlsx\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-167",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009",
          "NFR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tệp xuất có đúng 1 sheet tên \"DuAn\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-168",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp xuất chỉ chứa các dòng đang lọc theo cả 4 bộ lọc",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-169",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify cột trong tệp gồm các cột danh sách đang xem bỏ cột \"Thao tác\", thêm 6 cột hợp đồng, có 2 cột cùng tên \"Trạng thái\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-170",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify cột Giá trị HĐ dự kiến trong tệp ở dạng số"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-171",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify cột Hạn lập PAKD trong tệp ghi \"dòng chính + dòng phụ\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-172",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify cột Tệp trong tệp ghi \"{n} tệp\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-173",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009",
          "FR-quan-ly-du-an-kinh-doanh-047",
          "BR-quan-ly-du-an-kinh-doanh-046",
          "NFR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp xuất của AM không có 3 cột Hạn lập PAKD, Phiên bản PAKD, Giá trị hợp đồng dự kiến",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-174",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009",
          "BR-quan-ly-du-an-kinh-doanh-053",
          "NFR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp xuất của SM chỉ có dự án thuộc khối của tài khoản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-175",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Xuất Excel",
        "subcategory": "Tệp xuất",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp xuất không chứa dự án đã xoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-176",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009",
          "BR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Xuất Excel",
        "subcategory": "Không có dòng để xuất",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bộ lọc ra 0 dòng thì nút \"Xuất Excel\" mờ, không bấm được"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-177",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Xuất Excel",
        "subcategory": "Không có dòng để xuất",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bộ lọc ra 0 dòng, rê chuột vào nút \"Xuất Excel\" hiện \"Không có dòng để xuất\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-178",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-009",
          "NFR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Xuất Excel",
        "subcategory": "Ghi nhận tra soát",
        "priority": 2,
        "auto": "No",
        "text": "Verify mỗi lần xuất được ghi nhận tra soát đủ người, thời điểm, bộ lọc Năm / Khối / Tìm kiếm / Trạng thái, số dòng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-179",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-047",
          "BR-quan-ly-du-an-kinh-doanh-046",
          "NFR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Phạm vi hiển thị theo vai trò AM",
        "subcategory": "Sổ theo dõi và cột PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM không thấy Sổ theo dõi (ô ①, bảng ②, nút Đặt mục tiêu), chỉ thấy khung \"Danh sách dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-180",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-047",
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Phạm vi hiển thị theo vai trò AM",
        "subcategory": "Sổ theo dõi và cột PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM không thấy 3 cột Hạn lập PAKD, Phiên bản PAKD, Giá trị hợp đồng dự kiến",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-181",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-047",
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Phạm vi hiển thị theo vai trò AM",
        "subcategory": "Sổ theo dõi và cột PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM không thấy ô Σ Giá trị HĐ dự kiến ở dòng tổng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-182",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-020",
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Phạm vi hiển thị theo vai trò AM",
        "subcategory": "Sổ theo dõi và cột PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify với dự án dữ liệu cũ đã ký chưa nhập HĐ, tài khoản AM thấy \"—\" ở cột Giá trị hợp đồng ký"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-183",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053",
          "NFR-quan-ly-du-an-kinh-doanh-010",
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "Danh sách theo khối của tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò GĐK, SM, AM chỉ thấy dự án thuộc khối của tài khoản trong danh sách",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-184",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "Danh sách theo khối của tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify số đếm trạng thái của SM chỉ tính dự án thuộc khối của tài khoản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-185",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "Danh sách theo khối của tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dòng tổng của GĐK chỉ cộng dự án thuộc khối của tài khoản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-186",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "Danh sách theo khối của tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Sổ theo dõi của mỗi vai trò SM, GĐK chỉ có dòng khối của tài khoản ở bảng ②"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-187",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053",
          "FR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "Danh sách theo khối của tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản Kế toán thấy dự án của mọi khối",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-188",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "Danh sách theo khối của tài khoản",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tài khoản GĐK chưa được gắn khối thấy \"Tài khoản chưa được gắn khối — liên hệ quản trị\" thay cho danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-189",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053",
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "Mở dự án khối khác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify SM mở trực tiếp đường dẫn chi tiết dự án khối khác bị từ chối, báo \"Bạn không có quyền thực hiện thao tác này.\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-190",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-016",
          "E-quan-ly-du-an-kinh-doanh-030",
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Phạm vi dữ liệu theo khối",
        "subcategory": "Mở dự án khối khác",
        "priority": 2,
        "auto": "No",
        "text": "Verify lần mở dự án khối khác bị từ chối được ghi nhận tra soát đủ người, thời điểm, dự án, thao tác"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "dat-muc-tieu-khoi",
    "file": "checklist-uc-dat-muc-tieu-khoi.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-191",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Quyền và nội dung popup",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nút \"Đặt mục tiêu\" trên bảng ② hiển thị với tài khoản Kế toán",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-192",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Quyền và nội dung popup",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nút \"Đặt mục tiêu\" không hiển thị với mỗi vai trò SM, GĐK",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-193",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Quyền và nội dung popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify đang lọc Năm 2026, bấm \"Đặt mục tiêu\" mở popup tiêu đề \"Mục tiêu giá trị HĐ ký năm 2026\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-194",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Quyền và nội dung popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify đang lọc Năm = Tất cả, bấm \"Đặt mục tiêu\" mở popup cho năm hiện tại"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-195",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Quyền và nội dung popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify popup gồm đủ 6 khối và dòng \"Toàn công ty\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-196",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Quyền và nội dung popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify popup hiển thị mục tiêu hiện có của năm đó ở từng khối"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-197",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004",
          "BR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Khối có mục tiêu do BOD duyệt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify ô của khối đã có mục tiêu do BOD duyệt bị khoá, không nhập được",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-198",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Khối có mục tiêu do BOD duyệt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ô bị khoá hiển thị số BOD duyệt kèm nhãn \"Theo BOD duyệt\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-199",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Khối có mục tiêu do BOD duyệt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khối có mục tiêu do BOD duyệt không có nút \"Xoá mục tiêu\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-200",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Mở popup P-05",
        "subcategory": "Khối có mục tiêu do BOD duyệt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khối đang có mục tiêu nhập tay có nút \"Xoá mục tiêu\" cạnh ô"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-201",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Nhập mục tiêu",
        "subcategory": "Ô số",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify gõ chữ cái vào ô mục tiêu không được nhận"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-202",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Nhập mục tiêu",
        "subcategory": "Ô số",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify gõ \"1500000000\" ô tự hiển thị \"1,500,000,000\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-203",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Nhập mục tiêu",
        "subcategory": "Ô số",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dòng \"Toàn công ty\" tự cộng bằng tổng các khối khi nhập"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-204",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004",
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Nhập mục tiêu",
        "subcategory": "Ô số",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify nhập đúng 15 chữ số được nhận, lưu thành công"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-205",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-040",
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Nhập mục tiêu",
        "subcategory": "Ô số",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify nhập 16 chữ số hiện chữ đỏ \"Tối đa 15 chữ số\" dưới ô"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-206",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Nhập mục tiêu",
        "subcategory": "Ô số",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Lưu mục tiêu\" khi ô có 16 chữ số thì mục tiêu không được lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-207",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004",
          "BR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Lưu mục tiêu",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nhập mục tiêu cho khối G1 chưa có mục tiêu, bấm \"Lưu mục tiêu\" thì bảng ② hiện mục tiêu mới của G1",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-208",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Lưu mục tiêu",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sau khi lưu, ô ① và % Đạt ở bảng ② tính lại ngay theo mục tiêu mới",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-209",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Lưu mục tiêu",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify để trống ô của khối đang có mục tiêu nhập tay, bấm Lưu thì mục tiêu của khối đó giữ nguyên",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-210",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004",
          "BR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Lưu mục tiêu",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nhập 0 cho khối đang có mục tiêu nhập tay, bấm Lưu thì mục tiêu của khối đó giữ nguyên"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-211",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Lưu mục tiêu",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify để trống ô của khối chưa có mục tiêu, bấm Lưu thì khối đó vẫn hiện \"—\" ở % Đạt (không thành mục tiêu 0)"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-212",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-022",
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Lưu mục tiêu",
        "subcategory": "Lưu thành công",
        "priority": 2,
        "auto": "No",
        "text": "Verify mỗi lần lưu ghi nhật ký mục tiêu khối đủ người thao tác, thời điểm, năm × khối, giá trị cũ → mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-213",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Lưu mục tiêu",
        "subcategory": "Lưu thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify BOD phê duyệt mục tiêu khối G1 ở MH-01 sau khi Kế toán đã nhập tay thì bảng ② hiện số BOD duyệt cho G1",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-214",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Lưu mục tiêu",
        "subcategory": "Đóng không lưu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Huỷ\" đóng popup, mục tiêu các khối không đổi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-215",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Lưu mục tiêu",
        "subcategory": "Đóng không lưu",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bấm vào nền ngoài popup đóng popup, mục tiêu các khối không đổi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-216",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Xoá mục tiêu nhập tay",
        "subcategory": "Xác nhận xoá",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Xoá mục tiêu\" của khối G2 năm 2026 hiện hộp hỏi xác nhận đúng câu \"Xoá mục tiêu năm 2026 của khối G2\" kèm dấu chấm hỏi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-217",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004",
          "BR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Xoá mục tiêu nhập tay",
        "subcategory": "Xác nhận xoá",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đồng ý xoá thì khối G2 về \"chưa có mục tiêu\", bảng ② hiện \"—\" ở % Đạt của G2",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-218",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Xoá mục tiêu nhập tay",
        "subcategory": "Xác nhận xoá",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sau khi xoá mục tiêu, ô ① tính lại ngay"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-219",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Xoá mục tiêu nhập tay",
        "subcategory": "Xác nhận xoá",
        "priority": 2,
        "auto": "No",
        "text": "Verify xoá mục tiêu ghi nhật ký mục tiêu khối với giá trị cũ → trống"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-220",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Xoá mục tiêu nhập tay",
        "subcategory": "Xác nhận xoá",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify huỷ hộp xác nhận xoá thì mục tiêu của khối giữ nguyên"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-221",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004",
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "BOD duyệt trong lúc P-05 đang mở",
        "priority": 1,
        "auto": "No",
        "text": "Verify BOD duyệt mục tiêu khối G3 trong lúc Kế toán đang nhập G3 ở P-05, bấm Lưu thì hiện \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-222",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004",
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "BOD duyệt trong lúc P-05 đang mở",
        "priority": 1,
        "auto": "No",
        "text": "Verify sau lỗi BOD vừa duyệt, mục tiêu khối G3 giữ số BOD duyệt, số Kế toán vừa nhập không được ghi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-223",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "BOD duyệt trong lúc P-05 đang mở",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi BOD vừa duyệt, popup P-05 nạp lại mục tiêu mới nhất, ô G3 bị khoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-224",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "BOD duyệt trong lúc P-05 đang mở",
        "priority": 2,
        "auto": "No",
        "text": "Verify bấm \"Xoá mục tiêu\" của khối vừa được BOD duyệt trong lúc popup mở thì khối giữ mục tiêu BOD duyệt, không bị xoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-225",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-004",
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi Lưu mục tiêu thì hiện \"Thao tác chưa thực hiện được, vui lòng thử lại\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-226",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-014",
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify sau lỗi ghi giữa chừng khi Lưu mục tiêu, mục tiêu các khối không đổi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-227",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi không trọn vẹn, popup P-05 vẫn giữ các số đang nhập"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "tao-du-an",
    "file": "checklist-uc-tao-du-an.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-228",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò AM, SM bấm \"Cấp mã dự án\" mở màn tạo có nút gửi \"Gửi GĐK duyệt\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-229",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify GĐK bấm \"Cấp mã dự án\" mở màn tạo có nút gửi \"Tạo & cấp mã\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-230",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011",
          "BR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản Kế toán mở trực tiếp đường dẫn màn tạo dự án không vào được màn tạo",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-231",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify đầu trang màn tạo có đủ \"← Quay lại\", \"Huỷ\", nút gửi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-232",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify meta màn tạo hiện \"Version: Mới · Trạng thái: Đang soạn · Người tạo\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-233",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify với AM / SM dải hướng dẫn bắt đầu \"Hướng dẫn quy trình: AM / SM gửi yêu cầu → Giám đốc khối duyệt\" đúng câu ở Mục 10 spec"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-234",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify với GĐK dải hướng dẫn bắt đầu \"Hướng dẫn quy trình: Giám đốc khối tạo → hệ thống cấp mã ngay (bỏ bước duyệt mã)\" đúng câu ở Mục 10 spec"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-235",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify khung Mã dự án hiện \"Tự sinh sau khi GĐK duyệt\" ở mã, \"Tạo sau khi được cấp mã (tối đa 2 mã)\" ở mã outsource"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-236",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify khung Hợp đồng & tài liệu hiện nhãn \"Chưa ký\" kèm ghi chú \"Cập nhật ký hợp đồng trên màn chi tiết sau khi dự án được cấp mã.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-237",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify với AM / SM khung PAKD chỉ có ghi chú bắt đầu \"Phần nhập PAKD mở sau khi Giám đốc khối duyệt\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-238",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify với GĐK khung PAKD chỉ có ghi chú bắt đầu \"Phần nhập PAKD mở ngay sau khi tạo\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-239",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify cuối màn tạo lặp lại nút \"Huỷ\" và nút gửi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-240",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Mở màn tạo dự án",
        "subcategory": "Bố cục màn tạo",
        "priority": 4,
        "auto": "Yes",
        "text": "Verify nút \"← Quay lại\" nằm bên trái, các nút tác vụ nằm bên phải đầu trang màn tạo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-241",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-017",
          "BR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi ô PM kinh doanh, PM sản xuất, PM outsource, Giám đốc kinh doanh, Giám đốc khối, AM chỉ liệt kê người có vai trò tương ứng trong danh mục nhân sự IMIS",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-242",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify danh sách người trong ô chọn sắp theo thứ tự tiếng Việt"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-243",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify người đã ngừng hoạt động trong IMIS không có trong danh sách chọn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-244",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn 2 AM thì mỗi AM thành 1 thẻ có nút ×"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-245",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bấm × trên thẻ AM bỏ AM đó khỏi danh sách đã chọn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-246",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-017",
          "BR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify ô Tên khách hàng liệt kê khách hàng từ danh mục khách hàng IMIS",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-247",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn khách hàng thì ô Mã khách hàng tự điền mã của khách hàng đó"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-248",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify chưa chọn khách hàng thì ô Mã khách hàng hiện \"Theo khách hàng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-249",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify ô Người tạo tự động là người dùng đang tạo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-250",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ô Khối ở màn tạo của mỗi vai trò GĐK, SM, AM chỉ có khối của tài khoản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-251",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Chọn người và khách hàng từ IMIS",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify chọn PM trực tiếp ở màn tạo, không có nút \"Update PM\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-252",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-038",
          "FR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Danh mục IMIS không tải được",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập IMIS lỗi khi mở màn tạo thì ô chọn người bị khoá kèm câu \"Không tải được danh mục từ hệ thống nhân sự / khách hàng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-253",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-038"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Danh mục IMIS không tải được",
        "priority": 2,
        "auto": "No",
        "text": "Verify giả lập danh mục khách hàng lỗi thì ô Tên khách hàng bị khoá kèm nút \"Thử lại\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-254",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-038",
          "FR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Danh mục IMIS không tải được",
        "priority": 2,
        "auto": "No",
        "text": "Verify khi ô chọn người bị khoá, các ô khác vẫn nhập được, dữ liệu đang nhập không mất"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-255",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-038"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Danh mục IMIS không tải được",
        "priority": 2,
        "auto": "No",
        "text": "Verify IMIS hoạt động lại, bấm \"Thử lại\" tải được danh mục, ô chọn mở khoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-256",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-038"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Danh mục IMIS không tải được",
        "priority": 2,
        "auto": "No",
        "text": "Verify ô Khách hàng bị khoá chưa chọn được thì bấm gửi hiện lỗi \"Chọn khách hàng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-257",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Đính kèm tài liệu khi tạo",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khung \"Tài liệu đính kèm (n)\" có nút \"Đính kèm tài liệu\" chọn được nhiều tệp, danh sách tệp hiện tên, dung lượng, nút xoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-258",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Đính kèm tài liệu khi tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dung lượng tệp hiển thị theo đơn vị KB / MB"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-259",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Đính kèm tài liệu khi tạo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bấm nút xoá tệp trên màn tạo bỏ tệp khỏi danh sách trước khi gửi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-260",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-051"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Đính kèm tài liệu khi tạo",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn tệp đúng 20 MB định dạng pdf được nhận vào danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-261",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-041",
          "BR-quan-ly-du-an-kinh-doanh-051",
          "FR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Đính kèm tài liệu khi tạo",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn tệp lớn hơn 20 MB bị loại kèm câu \"Tệp \"{tên}\" vượt 20 MB\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-262",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-041",
          "BR-quan-ly-du-an-kinh-doanh-051"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Đính kèm tài liệu khi tạo",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn tệp .zip bị loại kèm câu \"Tệp \"{tên}\" không đúng định dạng (chỉ nhận pdf, doc, docx, xls, xlsx, jpg, png)\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-263",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-041",
          "BR-quan-ly-du-an-kinh-doanh-051"
        ],
        "category": "Nhập thông tin dự án",
        "subcategory": "Đính kèm tài liệu khi tạo",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn cùng lượt 1 tệp .zip và 1 tệp .docx thì tệp .docx vẫn được nhận vào danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-264",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-001",
          "BR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bỏ trống Tên dự án, bấm gửi hiện lỗi \"Nhập tên dự án\" dưới ô",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-265",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-026",
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Thông tin bắt buộc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Tên dự án chỉ gồm khoảng trắng, bấm gửi hiện lỗi \"Nhập tên dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-266",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-002",
          "BR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chưa chọn Khối, bấm gửi hiện lỗi \"Chọn khối\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-267",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-003",
          "BR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chưa chọn Loại dự án, bấm gửi hiện lỗi \"Chọn loại dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-268",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-004",
          "BR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chưa chọn khách hàng, bấm gửi hiện lỗi \"Chọn khách hàng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-269",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-005",
          "BR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Ngày dự án",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify ngày kết thúc trước ngày bắt đầu, bấm gửi hiện lỗi \"Ngày kết thúc phải sau ngày bắt đầu\" ở ô ngày",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-270",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Ngày dự án",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ngày kết thúc bằng ngày bắt đầu được chấp nhận, gửi thành công"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-271",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Ngày dự án",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify chỉ nhập ngày bắt đầu, bỏ trống ngày kết thúc thì không có lỗi ngày"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-272",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-006",
          "FR-quan-ly-du-an-kinh-doanh-012"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Dải lỗi tổng hợp và thời điểm hiện lỗi",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bỏ trống Tên dự án, Khối, bấm gửi hiện dải đỏ \"Còn 2 thông tin cần bổ sung: Nhập tên dự án · Chọn khối\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-273",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-012",
          "E-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Dải lỗi tổng hợp và thời điểm hiện lỗi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ô lỗi viền đỏ kèm dòng chữ đỏ dưới ô"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-274",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-012",
          "E-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Dải lỗi tổng hợp và thời điểm hiện lỗi",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm gửi khi còn lỗi thì dự án không được tạo, màn vẫn ở màn tạo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-275",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-012"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Dải lỗi tổng hợp và thời điểm hiện lỗi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mở màn tạo, chưa bấm gửi thì không hiện lỗi nào dù ô bắt buộc đang trống"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-276",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-012"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Dải lỗi tổng hợp và thời điểm hiện lỗi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau lần bấm gửi đầu, nhập Tên dự án thì lỗi \"Nhập tên dự án\" biến mất ngay, dải đỏ giảm số lỗi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-277",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Giới hạn độ dài",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Tên dự án dài đúng 255 ký tự được chấp nhận"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-278",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-040",
          "FR-quan-ly-du-an-kinh-doanh-012"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Giới hạn độ dài",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Tên dự án dài 256 ký tự, bấm gửi hiện chữ đỏ \"Tối đa 255 ký tự\" dưới ô"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-279",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Giới hạn độ dài",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lỗi vượt độ dài nằm trong dải lỗi tổng hợp \"Còn {n} thông tin cần bổ sung: …\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-280",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Giới hạn độ dài",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Ghi chú dài 1.001 ký tự, bấm gửi hiện chữ đỏ \"Tối đa {n} ký tự\" với n là 1.000"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-281",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Kiểm tra dữ liệu khi gửi",
        "subcategory": "Giới hạn độ dài",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify Tên dự án nhập \"  Dự án A  \" được lưu thành \"Dự án A\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-282",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-013",
          "BR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify AM gửi hợp lệ tạo dự án ở trạng thái \"Chờ duyệt mã\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-283",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-003",
          "FR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án vừa gửi chưa có mã: khung Mã dự án hiện \"Chờ GĐK duyệt\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-284",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-003",
          "FR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án vừa gửi có cột Hạn lập PAKD \"—\" trên danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-285",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-013",
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án vừa gửi có meta Version v1"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-286",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-013",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Tạo dự án\" ghi chú \"Version 1\", người thực hiện \"{người dùng} ({vai trò})\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-287",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi gửi, màn chuyển sang chi tiết của dự án mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-288",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi gửi hiện thông báo \"Đã gửi yêu cầu mở mã dự án — chờ GĐK duyệt\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-289",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-018",
          "FR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify gửi kèm 2 tệp thì 2 tệp hiện trong cột Tài liệu đính kèm của dự án mới",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-290",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-018",
          "BR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify gửi kèm tệp thì tab Lịch sử có dòng \"Cập nhật tài liệu đính kèm\" ghi chú \"Đính kèm {tên tệp, …}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-291",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Gửi yêu cầu mở mã (AM / SM)",
        "subcategory": "Kết quả gửi",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bật nút KEY khi tạo thì dự án mới hiện nhãn KEY cạnh tên"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-292",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Cấp mã ngay",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify GĐK gửi hợp lệ tạo dự án ở trạng thái \"Chưa có PAKD\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-293",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-015",
          "BR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Cấp mã ngay",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify khách hàng mã \"022\" đã có mã tổng lớn nhất \"022.687\" thì dự án GĐK tạo nhận mã tổng \"022.688\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-294",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Cấp mã ngay",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khách hàng có mã tổng lớn nhất \".007\" thì dự án mới nhận số thứ tự \".008\" đủ 3 chữ số"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-295",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-015",
          "BR-quan-ly-du-an-kinh-doanh-007"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Cấp mã ngay",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án mã tổng \"022.688\" có Mã kinh doanh \"022.688.1\", Mã sản xuất \"022.688.2\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-296",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-004",
          "BR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Cấp mã ngay",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án GĐK tạo có Hạn lập PAKD \"Còn 30 ngày\" trên danh sách ngay sau khi tạo",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-297",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Cấp mã ngay",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi GĐK tạo hiện thông báo \"Đã cấp mã {mã} — GĐK lập PAKD trước {dd/mm/yyyy}\" với ngày = hôm nay + 30"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-298",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Cấp mã ngay",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tab Lịch sử của dự án GĐK tạo chỉ có dòng \"Tạo dự án\", không có dòng riêng cho việc cấp mã"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-299",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Cấp mã ngay",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi GĐK tạo, màn chuyển sang chi tiết dự án mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-300",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Hết số thứ tự",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khách hàng có mã tổng lớn nhất \".998\" thì dự án mới nhận \".999\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-301",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-027",
          "FR-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Hết số thứ tự",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify khách hàng có mã tổng lớn nhất \".999\", GĐK gửi tạo hiện \"Khách hàng {Mã KH} đã dùng hết số thứ tự 999 — không cấp được mã mới\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-302",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Hết số thứ tự",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sau lỗi hết số thứ tự, dự án không được tạo, người dùng ở lại màn tạo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-303",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-015",
          "BR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "GĐK tạo & cấp mã",
        "subcategory": "Mã không trùng",
        "priority": 1,
        "auto": "No",
        "text": "Verify 2 phiên GĐK cùng lúc tạo dự án cho cùng khách hàng nhận 2 mã tổng khác nhau"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-304",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Thoát màn tạo và thao tác lặp",
        "subcategory": "Quay lại, Huỷ, Back",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"← Quay lại\" về ngay danh sách, không hiện hộp xác nhận"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-305",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Thoát màn tạo và thao tác lặp",
        "subcategory": "Quay lại, Huỷ, Back",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"← Quay lại\" sau khi đã nhập dữ liệu thì không có dự án mới trên danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-306",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Thoát màn tạo và thao tác lặp",
        "subcategory": "Quay lại, Huỷ, Back",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Huỷ\" về ngay danh sách, không hiện hộp xác nhận"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-307",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Thoát màn tạo và thao tác lặp",
        "subcategory": "Quay lại, Huỷ, Back",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Huỷ\" sau khi đã nhập dữ liệu thì không có dự án mới trên danh sách",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-308",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Thoát màn tạo và thao tác lặp",
        "subcategory": "Quay lại, Huỷ, Back",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bấm nút Back của trình duyệt khi đang nhập ở màn tạo không tạo dự án mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-309",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Thoát màn tạo và thao tác lặp",
        "subcategory": "Bấm gửi nhiều lần",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm nhanh 2 lần nút \"Gửi GĐK duyệt\" chỉ tạo đúng 1 dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-310",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-013",
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Lỗi khi ghi",
        "subcategory": "Quyền thay đổi tại lúc gửi",
        "priority": 1,
        "auto": "No",
        "text": "Verify tài khoản bị đổi khỏi vai trò AM trong lúc đang ở màn tạo, bấm gửi thì dự án không được tạo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-311",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi ghi",
        "subcategory": "Quyền thay đổi tại lúc gửi",
        "priority": 1,
        "auto": "No",
        "text": "Verify tài khoản không còn là GĐK tại lúc bấm \"Tạo & cấp mã\" thì dự án không được tạo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-312",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-013",
          "NFR-quan-ly-du-an-kinh-doanh-014",
          "FR-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Lỗi khi ghi",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi AM gửi thì không có dự án, tệp, dòng lịch sử nào được ghi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-313",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi khi ghi",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi không trọn vẹn, màn tạo giữ nguyên dữ liệu đang nhập"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-314",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi ghi",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi khi GĐK tạo, lần tạo kế tiếp thành công nhận đúng số thứ tự đã định cho lần lỗi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-315",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi khi ghi",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi không trọn vẹn, bấm gửi lại thành công tạo đúng 1 dự án"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "them-khach-hang",
    "file": "checklist-uc-them-khach-hang.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-316",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Mở popup P-01 Thêm khách hàng",
        "subcategory": "Nội dung popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm link \"+ Mới\" cạnh ô Tên khách hàng mở popup \"Thêm khách hàng\" có đủ 7 trường Tên khách hàng *, Nội bộ, Mã KH *, Địa chỉ, Email, Số điện thoại, Mô tả",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-317",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Nhập thông tin khách hàng",
        "subcategory": "Ô Mã KH",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify gõ \"ab1\" vào ô Mã KH tự hiển thị \"AB1\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-318",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Nhập thông tin khách hàng",
        "subcategory": "Ô Mã KH",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify gõ \"A B1\" vào ô Mã KH tự hiển thị \"AB1\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-319",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Nhập thông tin khách hàng",
        "subcategory": "Ô Mã KH",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify gõ ký tự thứ 4 vào ô Mã KH không được nhận"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-320",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050",
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Nhập thông tin khách hàng",
        "subcategory": "Giới hạn độ dài",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Tên khách hàng dài 256 ký tự, bấm Lưu hiện \"Tối đa 255 ký tự\" dưới ô"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-321",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Nhập thông tin khách hàng",
        "subcategory": "Giới hạn độ dài",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify Mô tả dài 1.001 ký tự, bấm Lưu hiện \"Tối đa {n} ký tự\" với n là 1.000"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-322",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016",
          "BR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nhập hợp lệ, bấm \"Lưu\" thì khách hàng mới được chọn sẵn ở ô Tên khách hàng của form dự án",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-323",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Lưu thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi lưu, ô Mã khách hàng của form tự điền mã khách hàng mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-324",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016",
          "BR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Lưu thành công",
        "priority": 2,
        "auto": "No",
        "text": "Verify khách hàng mới được lưu vào danh mục IMIS đủ các trường Tên, Nội bộ, Mã KH, Địa chỉ, Email, Số điện thoại, Mô tả"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-325",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016",
          "BR-quan-ly-du-an-kinh-doanh-034",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify thêm khách hàng ở P-01, bấm \"Huỷ\" màn tạo dự án, mở lại màn tạo thì khách hàng mới vẫn có trong ô Tên khách hàng",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-326",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Lưu thành công",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify để trống Email thì lưu được"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-327",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Phím tắt và đóng popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify nhấn Enter khi đang ở ô Tên khách hàng thực hiện Lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-328",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Phím tắt và đóng popup",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify nhấn Enter khi đang ở ô Mô tả không thực hiện Lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-329",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Phím tắt và đóng popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify nhấn Esc thì popup đóng mà không thêm khách hàng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-330",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Phím tắt và đóng popup",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bấm vào nền ngoài popup thì popup đóng mà không thêm khách hàng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-331",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lưu khách hàng",
        "subcategory": "Phím tắt và đóng popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Huỷ\" thì popup đóng mà không thêm khách hàng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-332",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-007",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Lỗi chặn lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bỏ trống Tên khách hàng, bấm Lưu hiện \"Nhập tên khách hàng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-333",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-008",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Lỗi chặn lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bỏ trống Mã KH, bấm Lưu hiện \"Nhập mã khách hàng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-334",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-009",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Lỗi chặn lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Mã KH chỉ 2 ký tự, bấm Lưu hiện \"Mã KH gồm đúng 3 ký tự chữ / số, viết liền, không dấu\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-335",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Lỗi chặn lưu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Mã KH chứa ký tự có dấu \"Ă1B\", bấm Lưu hiện \"Mã KH gồm đúng 3 ký tự chữ / số, viết liền, không dấu\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-336",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-010",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Lỗi chặn lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Mã KH trùng mã khách hàng đã có trong danh mục, bấm Lưu hiện \"Mã khách hàng đã tồn tại\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-337",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Lỗi chặn lưu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau lỗi mã trùng, đổi sang mã chưa có, bấm Lưu thì lưu thành công"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-338",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-011",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Lỗi chặn lưu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Email nhập \"abc@xyz\" sai dạng, bấm Lưu hiện \"Email không hợp lệ\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-339",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-027",
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Thời điểm hiện lỗi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mở popup, chưa bấm Lưu thì không hiện lỗi nào dù ô bắt buộc đang trống"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-340",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Thời điểm hiện lỗi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau lần bấm Lưu đầu, nhập Tên khách hàng thì lỗi \"Nhập tên khách hàng\" biến mất ngay"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-341",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-043",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Cảnh báo trùng tên",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Tên khách hàng \" công ty abc \" trùng khách hàng \"Công ty ABC\" mã \"ABC\" thì dưới ô hiện cảnh báo \"Đã có khách hàng cùng tên (ABC)\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-342",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-043",
          "FR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Kiểm tra dữ liệu",
        "subcategory": "Cảnh báo trùng tên",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khi có cảnh báo trùng tên, nhập Mã KH khác, bấm Lưu thì vẫn lưu thành công"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-343",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-010",
          "FR-quan-ly-du-an-kinh-doanh-016",
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Lỗi khi ghi vào danh mục IMIS",
        "subcategory": "Mã vừa được người khác thêm",
        "priority": 1,
        "auto": "No",
        "text": "Verify 2 phiên cùng lúc thêm khách hàng cùng Mã KH, phiên lưu sau hiện \"Mã khách hàng đã tồn tại\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-344",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-039",
          "FR-quan-ly-du-an-kinh-doanh-016",
          "BR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Lỗi khi ghi vào danh mục IMIS",
        "subcategory": "IMIS không ghi được",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập IMIS lỗi khi bấm Lưu hợp lệ thì hiện \"Không lưu được khách hàng, vui lòng thử lại\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-345",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-039"
        ],
        "category": "Lỗi khi ghi vào danh mục IMIS",
        "subcategory": "IMIS không ghi được",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi IMIS, popup P-01 vẫn mở, giữ nguyên dữ liệu đã nhập"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-346",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-039"
        ],
        "category": "Lỗi khi ghi vào danh mục IMIS",
        "subcategory": "IMIS không ghi được",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi IMIS, ô Tên khách hàng của form dự án chưa có khách hàng mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-347",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-039"
        ],
        "category": "Lỗi khi ghi vào danh mục IMIS",
        "subcategory": "IMIS không ghi được",
        "priority": 2,
        "auto": "No",
        "text": "Verify IMIS hoạt động lại, bấm \"Lưu\" lần nữa thì lưu thành công"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "duyet-ma-du-an",
    "file": "checklist-uc-duyet-ma-du-an.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-348",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-019",
          "FR-quan-ly-du-an-kinh-doanh-028",
          "BR-quan-ly-du-an-kinh-doanh-009"
        ],
        "category": "Hiển thị bước chờ duyệt mã",
        "subcategory": "Nút và dòng thông báo theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify GĐK của khối mở dự án Chờ duyệt mã thấy nút \"Duyệt mã dự án\" và \"Từ chối mã\" ở đầu trang",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-349",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-009",
          "FR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Hiển thị bước chờ duyệt mã",
        "subcategory": "Nút và dòng thông báo theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò AM, SM, Kế toán mở dự án Chờ duyệt mã không thấy nút \"Duyệt mã dự án\", \"Từ chối mã\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-350",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Hiển thị bước chờ duyệt mã",
        "subcategory": "Nút và dòng thông báo theo vai trò",
        "priority": 4,
        "auto": "Yes",
        "text": "Verify nút \"Duyệt mã dự án\" đứng trước nút \"Sửa\" ở đầu trang"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-351",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041",
          "FR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Hiển thị bước chờ duyệt mã",
        "subcategory": "Nút và dòng thông báo theo vai trò",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify GĐK thấy dải xanh nhạt \"Yêu cầu mở mã dự án đang chờ Giám đốc khối duyệt — bấm Duyệt mã dự án ở góc phải. Duyệt xong hệ thống sinh Mã dự án / Mã KD / Mã SX và bắt đầu đếm 30 ngày lập PAKD.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-352",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041",
          "E-quan-ly-du-an-kinh-doanh-023",
          "FR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Hiển thị bước chờ duyệt mã",
        "subcategory": "Nút và dòng thông báo theo vai trò",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mỗi vai trò AM, SM, Kế toán thấy dải xám \"Đang chờ Giám đốc khối duyệt mã dự án.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-353",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028",
          "BR-quan-ly-du-an-kinh-doanh-009"
        ],
        "category": "Xác nhận duyệt mã",
        "subcategory": "Hộp xác nhận",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Duyệt mã dự án\" hiện hộp xác nhận đúng câu \"Duyệt mã cho dự án {tên}\" kèm dấu chấm hỏi và câu \"Hệ thống sẽ sinh Mã dự án / Mã KD / Mã SX và bắt đầu đếm 30 ngày lập PAKD.\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-354",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Xác nhận duyệt mã",
        "subcategory": "Hộp xác nhận",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify huỷ hộp xác nhận thì dự án giữ \"Chờ duyệt mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-355",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đồng ý duyệt thì dự án chuyển sang \"Chưa có PAKD\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-356",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028",
          "FR-quan-ly-du-an-kinh-doanh-015",
          "BR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đồng ý duyệt thì dự án có mã tổng theo khách hàng bằng số thứ tự lớn nhất của khách hàng + 1",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-357",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-007"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án vừa duyệt có Mã KD = mã tổng + \".1\", Mã SX = mã tổng + \".2\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-358",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028",
          "BR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án vừa duyệt có Hạn lập PAKD \"Còn 30 ngày\" trên danh sách",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-359",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Duyệt mã dự án\" ghi chú \"Cấp mã {mã} · Hạn lập PAKD: {dd/mm/yyyy}\", người thực hiện \"{người dùng} ({vai trò})\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-360",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi duyệt hiện thông báo \"Đã duyệt — hệ thống cấp mã {mã} (KD {mã}.1 · SX {mã}.2), hạn lập PAKD {dd/mm/yyyy}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-361",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify duyệt mã không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-362",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi duyệt, SM của dự án thấy khung PAKD ở màn chi tiết"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-363",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi duyệt, dòng thông báo chuyển sang bước lập PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-364",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Duyệt mã thành công",
        "subcategory": "Kết quả duyệt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi duyệt, mỗi vai trò AM, SM, Kế toán xem dự án thấy khối \"Số liệu dự án theo tháng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-365",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-027",
          "FR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Lỗi khi duyệt",
        "subcategory": "Hết số thứ tự",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify khách hàng có mã tổng lớn nhất \".999\", GĐK đồng ý duyệt thì hiện \"Khách hàng {Mã KH} đã dùng hết số thứ tự 999 — không cấp được mã mới\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-366",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Lỗi khi duyệt",
        "subcategory": "Hết số thứ tự",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sau lỗi hết số thứ tự, dự án giữ \"Chờ duyệt mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-367",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028",
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Lỗi khi duyệt",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify 2 phiên GĐK cùng mở 1 dự án Chờ duyệt mã, phiên duyệt sau không sinh thêm mã (lịch sử chỉ có 1 dòng \"Duyệt mã dự án\")"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-368",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Lỗi khi duyệt",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi dữ liệu đã đổi, màn chi tiết tự nạp lại trạng thái mới nhất của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-369",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Lỗi khi duyệt",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify GĐK duyệt dự án vừa bị xoá ở phiên khác thì thao tác duyệt không được thực hiện, dự án không có mã"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-370",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-015",
          "BR-quan-ly-du-an-kinh-doanh-006"
        ],
        "category": "Lỗi khi duyệt",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify 2 yêu cầu cùng khách hàng được 2 phiên GĐK duyệt cùng lúc nhận 2 mã tổng khác nhau"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-371",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi duyệt",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi duyệt thì dự án giữ \"Chờ duyệt mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-372",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Lỗi khi duyệt",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi khi duyệt, lần duyệt lại thành công nhận đúng số thứ tự đã định cho lần lỗi"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "tu-choi-ma-du-an",
    "file": "checklist-uc-tu-choi-ma-du-an.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-373",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Mở hộp Từ chối mã",
        "subcategory": "Hộp lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify GĐK bấm \"Từ chối mã\" mở hộp \"Từ chối mã dự án\" có ô lý do",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-374",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Mở hộp Từ chối mã",
        "subcategory": "Hộp lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm Huỷ ở hộp \"Từ chối mã dự án\" thì dự án giữ \"Chờ duyệt mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-375",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041",
          "BR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Từ chối thành công",
        "subcategory": "Kết quả từ chối",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nhập lý do, xác nhận thì dự án chuyển sang \"Từ chối mã\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-376",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041",
          "BR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Từ chối thành công",
        "subcategory": "Kết quả từ chối",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Từ chối mã vẫn chưa có mã, cột Hạn lập PAKD hiện \"—\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-377",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Từ chối thành công",
        "subcategory": "Kết quả từ chối",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Từ chối mã\" ghi chú đúng lý do đã nhập, người thực hiện \"{người dùng} ({vai trò})\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-378",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Từ chối thành công",
        "subcategory": "Kết quả từ chối",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi từ chối hiện thông báo \"Đã từ chối mã dự án {tên}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-379",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Từ chối thành công",
        "subcategory": "Kết quả từ chối",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify từ chối mã không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-380",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Từ chối thành công",
        "subcategory": "Kết quả từ chối",
        "priority": 4,
        "auto": "No",
        "text": "Verify nhãn trạng thái \"Từ chối mã\" hiển thị màu đỏ trên danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-381",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Kiểm tra lý do",
        "subcategory": "Lý do bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify xác nhận khi ô lý do trống thì ô viền đỏ kèm chữ đỏ \"Vui lòng nhập lý do từ chối.\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-382",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-028",
          "FR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Kiểm tra lý do",
        "subcategory": "Lý do bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify xác nhận khi ô lý do trống thì dự án không bị từ chối, giữ \"Chờ duyệt mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-383",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041",
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Kiểm tra lý do",
        "subcategory": "Lý do bắt buộc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lý do chỉ gồm khoảng trắng bị coi như trống, hiện \"Vui lòng nhập lý do từ chối.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-384",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Kiểm tra lý do",
        "subcategory": "Độ dài lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lý do dài đúng 1.000 ký tự được chấp nhận"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-385",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Kiểm tra lý do",
        "subcategory": "Độ dài lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lý do dài 1.001 ký tự hiện \"Tối đa {n} ký tự\" với n là 1.000"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-386",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Lỗi khi từ chối",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify GĐK từ chối dự án vừa được phiên khác duyệt mã thì dự án không bị từ chối, giữ trạng thái vừa được duyệt"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-387",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Lỗi khi từ chối",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi dữ liệu đã đổi, ô lý do từ chối giữ nguyên nội dung đang nhập"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-388",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-041",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi từ chối",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi từ chối thì dự án giữ \"Chờ duyệt mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-389",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi khi từ chối",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi không trọn vẹn, hộp lý do giữ nội dung đã nhập"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "gui-lai-yeu-cau-mo-ma",
    "file": "checklist-uc-gui-lai-yeu-cau-mo-ma.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-390",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Hiển thị dự án Từ chối mã",
        "subcategory": "Dòng thông báo theo người xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi người dùng là người tạo dự án, SM của dự án thấy dòng thông báo bắt đầu \"Yêu cầu mở mã bị từ chối: “{lý do}”\" với đúng lý do GĐK đã nhập",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-391",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Hiển thị dự án Từ chối mã",
        "subcategory": "Dòng thông báo theo người xem",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify GĐK, Kế toán thấy dải xám \"Đang chờ {người tạo} gửi lại yêu cầu mở mã.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-392",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042",
          "FR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Hiển thị dự án Từ chối mã",
        "subcategory": "Nút Gửi lại theo người xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify người tạo dự án thấy nút \"Gửi lại yêu cầu mở mã\" ở đầu trang",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-393",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Hiển thị dự án Từ chối mã",
        "subcategory": "Nút Gửi lại theo người xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify SM của dự án (không phải người tạo) thấy nút \"Gửi lại yêu cầu mở mã\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-394",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Hiển thị dự án Từ chối mã",
        "subcategory": "Nút Gửi lại theo người xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi người dùng AM khác, SM khác cùng khối, GĐK, Kế toán không thấy nút \"Gửi lại yêu cầu mở mã\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-395",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042",
          "BR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Gửi lại yêu cầu mở mã",
        "subcategory": "Gửi lại thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify người tạo sửa thông tin cơ bản, bấm \"Gửi lại yêu cầu mở mã\" thì dự án về \"Chờ duyệt mã\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-396",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Gửi lại yêu cầu mở mã",
        "subcategory": "Gửi lại thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Gửi lại yêu cầu mở mã\" ghi chú \"—\", người thực hiện \"{người dùng} ({vai trò})\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-397",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Gửi lại yêu cầu mở mã",
        "subcategory": "Gửi lại thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi gửi lại hiện thông báo \"Đã gửi lại yêu cầu mở mã dự án {tên}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-398",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Gửi lại yêu cầu mở mã",
        "subcategory": "Gửi lại thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify gửi lại không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-399",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Gửi lại yêu cầu mở mã",
        "subcategory": "Gửi lại thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sau khi gửi lại, GĐK của khối thấy lại nút \"Duyệt mã dự án\" và \"Từ chối mã\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-400",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Gửi lại yêu cầu mở mã",
        "subcategory": "Gửi lại thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify SM của dự án gửi lại thành công, dự án về \"Chờ duyệt mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-401",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042",
          "E-quan-ly-du-an-kinh-doanh-006",
          "BR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Gửi lại yêu cầu mở mã",
        "subcategory": "Thiếu thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Từ chối mã dữ liệu cũ thiếu Loại dự án, bấm \"Gửi lại yêu cầu mở mã\" hiện dải đỏ \"Còn 1 thông tin cần bổ sung: Chọn loại dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-402",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Gửi lại yêu cầu mở mã",
        "subcategory": "Thiếu thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify gửi lại khi thiếu thông tin bắt buộc thì dự án giữ \"Từ chối mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-403",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Lỗi khi gửi lại",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify GĐK xoá yêu cầu trong lúc người tạo đang xem, người tạo bấm gửi lại thì hiện \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-404",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Lỗi khi gửi lại",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify người dùng không còn là SM của dự án tại lúc bấm gửi lại thì hệ thống báo \"Bạn không có quyền thực hiện thao tác này.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-405",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-042",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi gửi lại",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi gửi lại thì dự án giữ \"Từ chối mã\""
      }
    ]
  },
  {
    "scope": "uc",
    "target": "xem-chi-tiet-du-an",
    "file": "checklist-uc-xem-chi-tiet-du-an.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-406",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Đầu trang màn chi tiết",
        "subcategory": "Nút và meta",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"← Quay lại\" ở màn chi tiết về màn Danh sách dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-407",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Đầu trang màn chi tiết",
        "subcategory": "Nút và meta",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify meta đầu trang hiện đủ Version vN, Trạng thái, PAKD (phiên bản), Cập nhật dạng dd/mm/yyyy HH:mm với tài khoản SM"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-408",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-019",
          "BR-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Đầu trang màn chi tiết",
        "subcategory": "Nút và meta",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM không thấy mục PAKD trong meta đầu trang"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-409",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-019",
          "BR-quan-ly-du-an-kinh-doanh-032",
          "BR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Đầu trang màn chi tiết",
        "subcategory": "Nút và meta",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nút \"Sửa\" hiện với mỗi vai trò AM, SM, GĐK trên dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã, Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, Pending",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-410",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-019",
          "BR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Đầu trang màn chi tiết",
        "subcategory": "Nút và meta",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nút \"Sửa\" không hiện trên dự án Kết thúc với mỗi vai trò AM, SM, GĐK",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-411",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-019",
          "BR-quan-ly-du-an-kinh-doanh-002",
          "BR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Đầu trang màn chi tiết",
        "subcategory": "Nút và meta",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản Kế toán không thấy nút \"Sửa\", không vào được chế độ sửa",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-412",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Đầu trang màn chi tiết",
        "subcategory": "Nút và meta",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify SM mở dự án Chưa có PAKD thấy các nút \"Lưu nháp\", \"Gửi Kế toán duyệt\" do khung PAKD cung cấp ở đầu trang"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-413",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Đầu trang màn chi tiết",
        "subcategory": "Nút và meta",
        "priority": 4,
        "auto": "Yes",
        "text": "Verify nút \"← Quay lại\" nằm bên trái, các nút tác vụ nằm bên phải đầu trang màn chi tiết"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-414",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041",
          "FR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Chưa có PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify SM mở dự án Chưa có PAKD thấy dải xanh nhạt \"Dự án cần lập phương án kinh doanh (PAKD).\" kèm \"Hạn lập: {ngày} (còn {n} ngày)\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-415",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Chưa có PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify GĐK mở dự án Chưa có PAKD có bản V1 bị từ chối thấy \"PAKD V1 bị từ chối ({lý do}) — cần lập lại.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-416",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Chưa có PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Kế toán mở dự án Chưa có PAKD thấy dải xám \"Đang chờ SM / Giám đốc khối lập PAKD (hạn {ngày}).\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-417",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041",
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Chưa có PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify AM mở dự án Chưa có PAKD thấy dải xám \"Đang chờ SM / GĐK lập PAKD.\", không có hạn lập PAKD",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-418",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-007"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Chưa có PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify số ngày ở dòng thông báo trùng với số ngày ở cột Hạn lập PAKD trên danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-419",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "PAKD chờ duyệt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán mở dự án PAKD chờ duyệt thấy \"PAKD V{n} đang chờ Kế toán (CFO) duyệt.\" kèm nút \"Duyệt / Từ chối PAKD\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-420",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "PAKD chờ duyệt",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mỗi vai trò SM, GĐK mở dự án PAKD chờ duyệt thấy dải xám \"Đang chờ Kế toán (CFO) duyệt PAKD V{n}.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-421",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "PAKD chờ duyệt",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify AM mở dự án PAKD chờ duyệt thấy \"Đang chờ Kế toán duyệt PAKD.\", không có số phiên bản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-422",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Đang thực hiện",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán mở dự án Đang thực hiện có bản điều chỉnh chờ duyệt thấy nút \"Duyệt / Từ chối điều chỉnh\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-423",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Đang thực hiện",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mỗi vai trò SM, GĐK mở dự án có bản điều chỉnh chờ thấy \"Đang chờ Kế toán (CFO) duyệt bản điều chỉnh PAKD V{n}.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-424",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Đang thực hiện",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify AM mở dự án có bản điều chỉnh chờ thấy \"Đang chờ Kế toán duyệt PAKD.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-425",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Đang thực hiện",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify SM mở dự án Đang thực hiện không có bản điều chỉnh thấy nút \"Sửa PAKD\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-426",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Đang thực hiện",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify SM mở dự án Đang thực hiện đang có bản điều chỉnh nháp thấy nút \"Tiếp tục sửa PAKD\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-427",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Đang thực hiện",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify GĐK mở dự án Đang thực hiện không có bản điều chỉnh chờ thấy nút \"Sửa PAKD\" và \"Kết thúc dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-428",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Đang thực hiện",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Kế toán mở dự án Đang thực hiện không có bản điều chỉnh chờ thấy nút \"Kết thúc dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-429",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Đang thực hiện",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify AM mở dự án Đang thực hiện thấy dòng thông báo chỉ gồm \"Dự án đang thực hiện.\" (không kèm nút)"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-430",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Dòng thông báo bước hiện tại",
        "subcategory": "Cảnh báo quá tháng dự kiến ký",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã qua tháng dự kiến ký mà chưa có HĐ có thêm chữ đỏ \"Quá tháng dự kiến ký MM/YYYY\" trên dòng thông báo, với mỗi vai trò AM, SM, GĐK, Kế toán"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-431",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Mã",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án đã có mã hiện Mã dự án chữ to màu xanh, Mã kinh doanh, Mã sản xuất"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-432",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Mã",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa có mã hiện \"Chờ GĐK duyệt\" ở Mã dự án, \"Tự sinh sau khi GĐK duyệt\" ở Mã sản xuất"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-433",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Mã",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án đã có mã tổng, chưa có mã outsource hiện \"Chưa có (tối đa 2 mã)\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-434",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Mã",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án chưa có mã tổng hiện \"Tạo sau khi được cấp mã\" ở mã outsource"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-435",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Mã",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án có 1 mã outsource hiện nhãn \"Mã outsource\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-436",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Mã",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án có 2 mã outsource hiện nhãn \"Mã outsource 1\", \"Mã outsource 2\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-437",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Tên và PM",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bên phải khung hiện Tên dự án kèm KEY, PM kinh doanh, PM sản xuất, PM outsource"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-438",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Tên và PM",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án chưa có mã hiện PM outsource mặc định của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-439",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Tên và PM",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án có mã outsource hiện PM riêng của từng mã outsource"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-440",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021",
          "BR-quan-ly-du-an-kinh-doanh-038"
        ],
        "category": "Khung Mã dự án",
        "subcategory": "Tên và PM",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify Mã dự án (mã tổng) không có PM đi kèm, PM gắn với Mã KD, Mã SX"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-441",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Thông tin chi tiết",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lưới chỉ xem hiện đủ Khối, Loại dự án, Tên khách hàng, Mã khách hàng, Thời gian; cột phải Giám đốc kinh doanh, Giám đốc khối, AM, Người tạo, Ghi chú"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-442",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Thông tin chi tiết",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Thời gian hiện dạng \"dd/mm/yyyy → dd/mm/yyyy\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-443",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Thông tin chi tiết",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án có 2 AM hiện tên 2 AM ngăn bằng dấu phẩy"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-444",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-024"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Thông tin chi tiết",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify ô Ghi chú trống hiện \"—\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-445",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-033",
          "FR-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Thông tin chi tiết",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify PM đã gắn với dự án, nay ngừng hoạt động trong IMIS, vẫn hiện tên đã lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-446",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Thông tin chi tiết",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khách hàng đã gắn với dự án, nay bị xoá trong IMIS, vẫn hiện tên và mã đã lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-447",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Hợp đồng & tài liệu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa ký hiện nhãn \"Chưa ký\", dòng \"Chưa có thông tin ký hợp đồng\", nút \"Cập nhật ký hợp đồng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-448",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Hợp đồng & tài liệu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án đã ký có HĐ hiện \"Số {số HĐ} · ký {ngày}\", \"Thời hạn {từ} → {đến}\", nút \"Xem / cập nhật hợp đồng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-449",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Hợp đồng & tài liệu",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án dữ liệu cũ đã ký chưa có chi tiết hiện \"Chưa có thông tin chi tiết hợp đồng\", nút \"Bổ sung thông tin HĐ\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-450",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-026",
          "BR-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Khung PAKD theo quyền xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò SM, GĐK, Kế toán mở dự án đã có mã thấy khung PAKD",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-451",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-026",
          "FR-quan-ly-du-an-kinh-doanh-026",
          "BR-quan-ly-du-an-kinh-doanh-030",
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Khung PAKD theo quyền xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify AM mở dự án đã có mã thấy khung \"Phương án kinh doanh (PAKD)\" chỉ có dòng 🔒 \"PAKD của dự án chỉ hiển thị với Giám đốc kinh doanh (SM), Giám đốc khối và Kế toán duyệt.\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-452",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-026",
          "BR-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Tab Thông tin dự án",
        "subcategory": "Khung PAKD theo quyền xem",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã không hiện khung PAKD với SM"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-453",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khối chỉ có tab \"Thực tế (kế toán) ({n} tháng)\", không có tab Kế hoạch"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-454",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bảng có tháng nằm ngang dạng T{m}/{yyyy}, chỉ tiêu nằm dọc đủ Doanh thu thực tế, Thu thực tế, Chi thực tế (└ SX, └ KD), Khối lượng công việc"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-455",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify cột \"Luỹ kế\" mỗi chỉ tiêu bằng tổng các tháng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-456",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify số liệu trải hơn 1 năm thì có ô chọn năm, chọn năm 2026 cột tổng đổi thành \"Năm 2026\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-457",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify số liệu chỉ trong 1 năm thì không có ô chọn năm"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-458",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify chân khung hiện \"ĐVT: VNĐ · KLCV: SP · Chốt số: DT {MM/YYYY} · CP {MM/YYYY} · DTT {MM/YYYY} · KLCV {MM/YYYY}\" kèm thông tin lần import"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-459",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa có số thực tế hiện \"Kế toán chưa import số thực tế\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-460",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify khối hiện ở dự án mỗi trạng thái Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, Pending, Kết thúc"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-461",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã không có khối Số liệu dự án theo tháng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-462",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044",
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM thấy khối Số liệu dự án theo tháng với số thực tế",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-463",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Mở chi tiết sổ kế toán",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Kế toán bấm con số Thu thực tế khác 0 mở popup chi tiết sổ kế toán P-06"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-464",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Mở chi tiết sổ kế toán",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify con số Thu thực tế bằng 0 không bấm được"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-465",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Khối Số liệu dự án theo tháng",
        "subcategory": "Mở chi tiết sổ kế toán",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM bấm con số Thu thực tế khác 0 không mở P-06"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-466",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Tab Lịch sử",
        "subcategory": "Bảng lịch sử",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm tab \"Lịch sử (n)\" hiện bảng \"Lịch sử thay đổi\" đủ cột STT, Thời gian, Người thực hiện, Thao tác, Ghi chú",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-467",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Tab Lịch sử",
        "subcategory": "Bảng lịch sử",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dòng lịch sử mới nhất nằm trên đầu bảng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-468",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Tab Lịch sử",
        "subcategory": "Bảng lịch sử",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify cột Thời gian của lịch sử hiện dạng dd/mm/yyyy HH:mm"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-469",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Tab Lịch sử",
        "subcategory": "Bảng lịch sử",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dòng lịch sử không có ghi chú hiện \"—\" ở cột Ghi chú"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-470",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-027",
          "BR-quan-ly-du-an-kinh-doanh-046",
          "BR-quan-ly-du-an-kinh-doanh-036",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Tab Lịch sử",
        "subcategory": "Bảng lịch sử",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM không thấy các dòng thao tác PAKD (Lưu nháp PAKD, Nộp PAKD, Gửi điều chỉnh PAKD, Huỷ bản điều chỉnh PAKD, duyệt / từ chối PAKD) trong tab Lịch sử",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-471",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Tab Lịch sử",
        "subcategory": "Bảng lịch sử",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify số (n) ở tab \"Lịch sử (n)\" của AM chỉ đếm các dòng AM được xem"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-472",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Tab Lịch sử",
        "subcategory": "Bảng lịch sử",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify SM thấy các dòng thao tác PAKD trong tab Lịch sử"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-473",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Vai trò và phạm vi khối",
        "subcategory": "Vai trò theo tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chuyển từ danh sách sang chi tiết, sang màn tạo, quay lại danh sách, chân khung vẫn hiện \"Đang xem với vai trò {vai trò}\" đúng vai trò tài khoản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-474",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Vai trò và phạm vi khối",
        "subcategory": "Vai trò theo tài khoản",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify không có ô chọn \"Vai trò\" trên các màn danh sách, chi tiết, tạo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-475",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Vai trò và phạm vi khối",
        "subcategory": "Vai trò theo tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản Kế toán thấy đúng bộ nút, cột, khung của Kế toán theo các BR phân quyền"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-476",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053",
          "FR-quan-ly-du-an-kinh-doanh-040"
        ],
        "category": "Vai trò và phạm vi khối",
        "subcategory": "Dự án khối khác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify AM mở trực tiếp đường dẫn chi tiết dự án khối khác bị từ chối, báo \"Bạn không có quyền thực hiện thao tác này.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-477",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Vai trò và phạm vi khối",
        "subcategory": "Dự án khối khác",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify GĐK mở trực tiếp đường dẫn chi tiết dự án Chờ duyệt mã khối khác bị từ chối, báo \"Bạn không có quyền thực hiện thao tác này.\""
      }
    ]
  },
  {
    "scope": "uc",
    "target": "sua-thong-tin-co-ban",
    "file": "checklist-uc-sua-thong-tin-co-ban.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-478",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Bố cục chế độ sửa",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm \"Sửa\" chuyển màn sang chế độ sửa: bên trái đầu trang \"Sửa dự án\", đầu trang còn \"Huỷ sửa\" và \"Lưu thay đổi\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-479",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "FR-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Bố cục chế độ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chế độ sửa ẩn đủ \"← Quay lại\", dòng thông báo bước, tab Lịch sử, nút theo bước, \"Sửa\", \"Xoá\", \"Tạo mã outsource\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-480",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Bố cục chế độ sửa",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify chế độ sửa hiện dải xanh \"Đang sửa thông tin dự án. Sửa trực tiếp các ô bên dưới (đổi PM bằng nút Update PM), xong bấm Lưu thay đổi — tạo Version v{n+1}.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-481",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Bố cục chế độ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify các khung Mã dự án, Thông tin chi tiết, Hợp đồng & tài liệu chuyển thành ô nhập"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-482",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Bố cục chế độ sửa",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã có mã: Mã dự án, Mã KD, Mã SX chỉ hiển thị, không sửa được",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-483",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Bố cục chế độ sửa",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án có mã outsource hiện \"{mã, …} — tạo / sửa ở khối Mã dự án sau khi lưu\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-484",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Bố cục chế độ sửa",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án chưa có mã outsource hiện bắt đầu \"Chưa có — \" ở chế độ sửa"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-485",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Bố cục chế độ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify SM ở chế độ sửa vẫn thấy khung PAKD theo quyền xem"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-486",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Bố cục chế độ sửa",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify cuối khung Hợp đồng & tài liệu lặp nút \"Huỷ sửa\" và \"Lưu thay đổi\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-487",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Ô Khách hàng",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã có mã: ô Khách hàng bị khoá",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-488",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Ô Khách hàng",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Chờ duyệt mã: ô Khách hàng chọn được, có link \"+ Mới\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-489",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Vào chế độ sửa",
        "subcategory": "Ô Khách hàng",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ô Khối ở chế độ sửa của mỗi vai trò GĐK, SM, AM chỉ có khối của tài khoản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-490",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Update PM",
        "subcategory": "Đổi PM trong chế độ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dòng PM kinh doanh hiện tên PM hiện tại kèm nút \"Update PM\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-491",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-030",
          "BR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Update PM",
        "subcategory": "Đổi PM trong chế độ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Update PM\" hiện ô chọn PM từ danh mục nhân sự IMIS kèm nút × \"Huỷ đổi PM\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-492",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Update PM",
        "subcategory": "Đổi PM trong chế độ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn PM khác, bấm × \"Huỷ đổi PM\" thì PM trở về PM cũ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-493",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Update PM",
        "subcategory": "Đổi PM trong chế độ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify PM cũ đã ngừng hoạt động trong IMIS vẫn được giữ khi lưu mà không đổi ô PM"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-494",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-038",
          "FR-quan-ly-du-an-kinh-doanh-029",
          "FR-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Update PM",
        "subcategory": "Đổi PM trong chế độ sửa",
        "priority": 2,
        "auto": "No",
        "text": "Verify giả lập IMIS lỗi khi bấm \"Update PM\" thì ô chọn PM bị khoá kèm nút \"Thử lại\", dữ liệu đang sửa không mất"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-495",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sửa Tên dự án, bấm \"Lưu thay đổi\" thì Version tăng thêm 1",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-496",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Cập nhật\" ghi chú \"Version {n+1}\", người thực hiện chỉ \"{người dùng}\" không kèm vai trò",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-497",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Lưu thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi lưu hiện thông báo \"Đã cập nhật thông tin cơ bản — Version {n+1}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-498",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Lưu thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi lưu, màn về chế độ xem với dữ liệu mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-499",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Lưu thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify lưu sửa không làm đổi trạng thái dự án, không cần Kế toán duyệt",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-500",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Không có thay đổi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify vào chế độ sửa không đổi gì, bấm \"Lưu thay đổi\" hiện \"Không có thay đổi\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-501",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Không có thay đổi",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify lưu khi không có thay đổi thì không có gì được ghi (Version giữ nguyên, không có dòng lịch sử mới)",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-502",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Không có thay đổi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chỉ thêm khoảng trắng cuối Tên dự án, bấm \"Lưu thay đổi\" hiện \"Không có thay đổi\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-503",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-051"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Tệp trong chế độ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify thêm 1 tệp, đổi Ghi chú, bấm \"Lưu thay đổi\" thì tab Lịch sử có thêm dòng \"Cập nhật tài liệu đính kèm\" ghi chú \"Cập nhật tài liệu đính kèm (1 tệp)\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-504",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-051",
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Tệp trong chế độ sửa",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chỉ thêm tệp, không đổi trường nào, bấm \"Lưu thay đổi\" thì Version giữ nguyên"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-505",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-051"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Tệp trong chế độ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify thêm tệp, gỡ một tệp cũ, bấm \"Huỷ sửa\" thì danh sách tệp trở về như trước khi sửa"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-506",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Lưu thay đổi",
        "subcategory": "Huỷ sửa",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sửa Tên dự án, bấm \"Huỷ sửa\" thì màn về chế độ xem, Tên dự án giữ giá trị cũ",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-507",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "E-quan-ly-du-an-kinh-doanh-001",
          "E-quan-ly-du-an-kinh-doanh-006",
          "BR-quan-ly-du-an-kinh-doanh-026"
        ],
        "category": "Kiểm tra dữ liệu khi lưu",
        "subcategory": "Lỗi nhập",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify xoá trống Tên dự án, bấm \"Lưu thay đổi\" hiện \"Nhập tên dự án\" trong dải đỏ \"Còn 1 thông tin cần bổ sung: Nhập tên dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-508",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Kiểm tra dữ liệu khi lưu",
        "subcategory": "Lỗi nhập",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify đặt ngày kết thúc trước ngày bắt đầu, bấm \"Lưu thay đổi\" hiện \"Ngày kết thúc phải sau ngày bắt đầu\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-509",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Kiểm tra dữ liệu khi lưu",
        "subcategory": "Lỗi nhập",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Ghi chú dài 1.001 ký tự, bấm \"Lưu thay đổi\" hiện \"Tối đa {n} ký tự\" với n là 1.000"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-510",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Kiểm tra dữ liệu khi lưu",
        "subcategory": "Lỗi nhập",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify thêm tệp .exe ở chế độ sửa bị loại kèm câu \"Tệp \"{tên}\" không đúng định dạng (chỉ nhận pdf, doc, docx, xls, xlsx, jpg, png)\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-511",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-048",
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Chỉ ghi trường đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify 2 phiên cùng sửa 1 dự án, phiên A đổi Tên, phiên B đổi Ghi chú, cả hai lưu thì dự án có cả Tên mới và Ghi chú mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-512",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-048"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Chỉ ghi trường đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify tác vụ chuyển dự án sang Pending trong lúc đang sửa, lưu sửa thì dự án vẫn ở Pending"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-513",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-048"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Chỉ ghi trường đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify Kế toán mở lại dự án Pending (hạn mới) trong lúc đang sửa, lưu sửa thì hạn lập PAKD giữ hạn mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-514",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-048"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Chỉ ghi trường đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify người khác tạo mã outsource trong lúc đang sửa, lưu sửa thì mã outsource mới vẫn còn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-515",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-048"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Chỉ ghi trường đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify SM gửi PAKD trong lúc người khác đang sửa thông tin cơ bản, lưu sửa thì PAKD giữ bản vừa gửi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-516",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Lưu bị từ chối",
        "priority": 1,
        "auto": "No",
        "text": "Verify dự án được Kế toán kết thúc trong lúc đang sửa, bấm \"Lưu thay đổi\" thì hiện \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-517",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-032",
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Lưu bị từ chối",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi dự án vừa Kết thúc, màn nạp lại dự án ở chế độ xem theo dữ liệu mới nhất"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-518",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Lưu bị từ chối",
        "priority": 1,
        "auto": "No",
        "text": "Verify GĐK duyệt mã trong lúc AM đang sửa đã đổi Khách hàng, AM bấm \"Lưu thay đổi\" thì Khách hàng mới không được lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-519",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Lưu bị từ chối",
        "priority": 2,
        "auto": "No",
        "text": "Verify tài khoản bị đổi khỏi vai trò SM trong lúc đang sửa, bấm \"Lưu thay đổi\" thì hiện \"Bạn không có quyền thực hiện thao tác này.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-520",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-029",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi lưu sửa thì không có gì được ghi (Version, lịch sử, dữ liệu dự án không đổi)"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-521",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Thay đổi cùng lúc khi đang sửa",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi không trọn vẹn, chế độ sửa giữ nguyên dữ liệu đang sửa"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "cap-nhat-ky-hop-dong",
    "file": "checklist-uc-cap-nhat-ky-hop-dong.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-522",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Mở từ màn chi tiết",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify SM bấm \"Cập nhật ký hợp đồng\" ở khung Hợp đồng & tài liệu mở popup \"Cập nhật ký hợp đồng\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-523",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Mở từ màn chi tiết",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify GĐK bấm \"Xem / cập nhật hợp đồng\" của dự án đã có HĐ mở P-03 hiện dữ liệu HĐ đã lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-524",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dòng phụ hiện \"{Mã} — {Tên} · Giá trị đã khai báo (Doanh thu dự kiến): {X} VNĐ\" với X là Doanh thu dự kiến"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-525",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-028",
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án có PAKD đã duyệt: X bằng doanh thu của PAKD đã được Kế toán duyệt"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-526",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án chưa có PAKD được duyệt, đang có bản PAKD đang lập: X bằng doanh thu của bản đang lập"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-527",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án không có Doanh thu dự kiến: X hiện \"—\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-528",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa có HĐ: Giá trị hợp đồng mặc định bằng Doanh thu dự kiến"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-529",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án chưa có HĐ, không có Doanh thu dự kiến: Giá trị hợp đồng để trống"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-530",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa có HĐ: Thời hạn thực hiện Từ–Đến mặc định bằng thời gian dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-531",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án chưa có HĐ: chân popup hiện \"Lưu sẽ chuyển dự án sang trạng thái \"Đã ký\"\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-532",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án đã có HĐ: chân popup hiện \"Cập nhật lần cuối bởi {người} lúc {thời gian}\" với người, thời điểm của lần lưu gần nhất"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-533",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa có HĐ có nút \"Lưu & xác nhận đã ký\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-534",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Thông tin đầu popup",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án đã có HĐ có nút \"Lưu thay đổi\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-535",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-048",
          "BR-quan-ly-du-an-kinh-doanh-049"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Chế độ chỉ xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify AM mở P-03 không có nút lưu, không có nút \"Thêm phụ lục\", không xoá được dòng phụ lục",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-536",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-048",
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Chế độ chỉ xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify AM mở P-03 thấy dòng phụ chỉ \"{Mã} — {Tên}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-537",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-048",
          "BR-quan-ly-du-an-kinh-doanh-046",
          "NFR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Chế độ chỉ xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify AM mở P-03 không thấy bảng đối chiếu \"Doanh thu dự kiến ↔ Giá trị hợp đồng\", ô Lý do lệch",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-538",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-048",
          "BR-quan-ly-du-an-kinh-doanh-039"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Chế độ chỉ xem",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify AM mở P-03 bấm tên tệp HĐ vẫn mở xem được tệp"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-539",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-048",
          "BR-quan-ly-du-an-kinh-doanh-029",
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Chế độ chỉ xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán bấm \"Xem / cập nhật hợp đồng\" ở dự án Kết thúc mở P-03 chỉ xem, không có nút lưu",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-540",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-049",
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Chế độ chỉ xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify SM bấm \"Cập nhật ký hợp đồng\" ở dự án Từ chối mã mở P-03 chỉ xem, không có nút lưu",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-541",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-049"
        ],
        "category": "Mở popup P-03 Cập nhật ký hợp đồng",
        "subcategory": "Chế độ chỉ xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify GĐK lưu P-03 ở dự án Pending thành công, dự án chuyển \"Đã ký\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-542",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Ô nhập",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify gõ chữ cái vào ô Giá trị hợp đồng không được nhận"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-543",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Ô nhập",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Giá trị hợp đồng 15 chữ số được chấp nhận"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-544",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-040",
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Ô nhập",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Giá trị hợp đồng 16 chữ số, bấm lưu hiện \"Tối đa 15 chữ số\" dưới ô"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-545",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Ô nhập",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn ngày \"Từ\" là 10/03/2026 thì bộ chọn ngày \"Đến\" không cho chọn ngày 09/03/2026"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-546",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Ô nhập",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Số hợp đồng dài 256 ký tự, bấm lưu hiện \"Tối đa 255 ký tự\" dưới ô"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-547",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bảng đối chiếu \"Doanh thu dự kiến ↔ Giá trị hợp đồng\" hiện chênh lệch bằng số kèm phần trăm",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-548",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Doanh thu dự kiến trống thì bảng đối chiếu hiện \"—\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-549",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Doanh thu dự kiến bằng 0 thì bảng đối chiếu hiện \"—\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-550",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify không có Doanh thu dự kiến, Giá trị HĐ bất kỳ, để trống lý do lệch thì lưu được"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-551",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-017",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Doanh thu dự kiến 100.000.000, Giá trị HĐ 103.000.000 (lệch 3%), lý do trống, bấm lưu hiện \"Giá trị hợp đồng khác giá trị đã khai báo — bắt buộc nhập lý do\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-552",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lệch quá 2% có lý do trống thì bảng đối chiếu hiện \"Lệch\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-553",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Doanh thu dự kiến 100.000.000, Giá trị HĐ 97.000.000 (thấp hơn 3%), lý do trống, bấm lưu hiện lỗi bắt buộc nhập lý do"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-554",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Doanh thu dự kiến 100.000.000, Giá trị HĐ 102.000.000 (lệch đúng 2%), lý do trống thì lưu được",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-555",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Doanh thu dự kiến 100.000.000, Giá trị HĐ 102.000.001 (lệch hơn 2% trên giá trị chưa làm tròn), lý do trống, bấm lưu hiện lỗi bắt buộc nhập lý do"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-556",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lệch 1% thì bảng đối chiếu hiện \"Lệch 1,0%\" màu trung tính",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-557",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lệch 1%, ô lý do mở cho nhập, để trống vẫn lưu được"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-558",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-017"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lệch quá 2%, lý do chỉ gồm khoảng trắng, bấm lưu hiện lỗi bắt buộc nhập lý do"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-559",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Nhập thông tin hợp đồng",
        "subcategory": "Bảng đối chiếu và lý do lệch",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify Lý do lệch dài 1.001 ký tự, bấm lưu hiện \"Tối đa {n} ký tự\" với n là 1.000"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-560",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-012",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bỏ trống Số hợp đồng, bấm lưu hiện \"Nhập số hợp đồng\" dưới ô",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-561",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-013",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chưa chọn Ngày ký, bấm lưu hiện \"Chọn ngày ký\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-562",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bỏ trống Giá trị hợp đồng, bấm lưu hiện \"Nhập giá trị hợp đồng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-563",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Giá trị hợp đồng bằng 0, bấm lưu hiện \"Nhập giá trị hợp đồng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-564",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-015",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Thông tin bắt buộc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bỏ trống ngày \"Từ\" của Thời hạn thực hiện, bấm lưu hiện \"Chọn thời hạn thực hiện\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-565",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Thông tin bắt buộc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bỏ trống ngày \"Đến\" của Thời hạn thực hiện, bấm lưu hiện \"Chọn thời hạn thực hiện\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-566",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-016",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Thông tin bắt buộc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify nhập tay ngày \"Đến\" trước ngày \"Từ\", bấm lưu hiện \"Ngày kết thúc phải sau ngày bắt đầu\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-567",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Thông tin bắt buộc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ngày \"Đến\" bằng ngày \"Từ\" được chấp nhận, lưu thành công"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-568",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Dải lỗi và thời điểm hiện lỗi",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bỏ trống Số hợp đồng, Ngày ký, bấm lưu hiện dải đỏ \"Còn 2 mục chưa hợp lệ: Nhập số hợp đồng; Chọn ngày ký.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-569",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Dải lỗi và thời điểm hiện lỗi",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm lưu khi còn lỗi thì dự án giữ \"Chưa ký\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-570",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-027",
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Dải lỗi và thời điểm hiện lỗi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mở P-03, chưa bấm lưu thì không hiện lỗi nào dù ô bắt buộc trống"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-571",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-027"
        ],
        "category": "Kiểm tra dữ liệu P-03",
        "subcategory": "Dải lỗi và thời điểm hiện lỗi",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau lần bấm lưu đầu, nhập Số hợp đồng thì lỗi \"Nhập số hợp đồng\" biến mất ngay"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-572",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chưa có phụ lục thì hiện \"Chưa có phụ lục điều chỉnh — bấm \"Thêm phụ lục\" khi có.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-573",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Thêm phụ lục\" thêm 1 dòng có đủ STT, Số phụ lục *, Ngày ký *, Nội dung điều chỉnh, Cập nhật file phụ lục, nút xoá dòng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-574",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify tiêu đề bảng hiện \"Phụ lục điều chỉnh (2)\" khi có 2 dòng phụ lục"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-575",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm thùng rác ở dòng phụ lục bỏ dòng đó khỏi bảng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-576",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-018",
          "BR-quan-ly-du-an-kinh-doanh-028"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dòng phụ lục thứ 1 thiếu Số phụ lục, bấm lưu hiện \"Phụ lục dòng 1: nhập Số phụ lục và Ngày ký\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-577",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dòng phụ lục thứ 2 thiếu Ngày ký, bấm lưu hiện \"Phụ lục dòng 2: nhập Số phụ lục và Ngày ký\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-578",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dòng phụ lục lỗi có nền đỏ nhạt"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-579",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-018"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify xoá dòng phụ lục đang lỗi, bấm lưu thì lưu thành công"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-580",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050",
          "FR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify Số phụ lục dài 256 ký tự, bấm lưu hiện \"Tối đa 255 ký tự\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-581",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Phụ lục",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify Nội dung điều chỉnh dài 1.001 ký tự, bấm lưu hiện \"Tối đa {n} ký tự\" với n là 1.000"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-582",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Tệp hợp đồng và tệp phụ lục",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn nhiều tệp ở ô Tệp tài liệu thì các tệp hiện trong danh sách tệp HĐ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-583",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-051",
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Tệp hợp đồng và tệp phụ lục",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn tệp HĐ lớn hơn 20 MB bị loại kèm câu \"Tệp \"{tên}\" vượt 20 MB\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-584",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-051",
          "FR-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Tệp hợp đồng và tệp phụ lục",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn tệp phụ lục .zip bị loại kèm câu báo không đúng định dạng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-585",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-051"
        ],
        "category": "Phụ lục điều chỉnh và tệp",
        "subcategory": "Tệp hợp đồng và tệp phụ lục",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify gỡ tệp HĐ hiện hộp hỏi xác nhận \"Gỡ tệp \"{tên}\"\" kèm dấu chấm hỏi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-586",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033",
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Lưu hợp đồng",
        "subcategory": "Lưu lần đầu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify SM nhập hợp lệ, bấm \"Lưu & xác nhận đã ký\" thì dự án chuyển sang \"Đã ký\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-587",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033",
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lưu hợp đồng",
        "subcategory": "Lưu lần đầu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify lưu HĐ lần đầu thì Version dự án tăng thêm 1",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-588",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Lưu hợp đồng",
        "subcategory": "Lưu lần đầu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Ký hợp đồng\" ghi chú \"HĐ {số} · {n} phụ lục · Version {n+1}\", người thực hiện \"{người dùng}\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-589",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Lưu hợp đồng",
        "subcategory": "Lưu lần đầu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau lần lưu đầu hiện thông báo \"Đã xác nhận ký hợp đồng {số} — {mã}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-590",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Lưu hợp đồng",
        "subcategory": "Cập nhật HĐ đã có",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sửa Giá trị HĐ đã có, bấm \"Lưu thay đổi\" thì tab Lịch sử có dòng \"Cập nhật hợp đồng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-591",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Lưu hợp đồng",
        "subcategory": "Cập nhật HĐ đã có",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi cập nhật HĐ hiện thông báo \"Đã cập nhật hợp đồng {số} — {mã}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-592",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Lưu hợp đồng",
        "subcategory": "Cập nhật HĐ đã có",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify P-03 không có thao tác bỏ ký, dự án đã ký không quay về \"Chưa ký\" qua P-03"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-593",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Lưu hợp đồng",
        "subcategory": "Cập nhật HĐ đã có",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án đã ký, SM mở khung PAKD thì lựa chọn \"Chưa ký\" bị khoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-594",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029",
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã có PAKD được duyệt, chưa có bản điều chỉnh đang mở: lưu HĐ sinh bản điều chỉnh PAKD chờ Kế toán duyệt (Phiên bản PAKD hiện bản mới \"chờ CFO\")",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-595",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 2,
        "auto": "No",
        "text": "Verify bản điều chỉnh sinh từ HĐ vào \"Chờ duyệt\" kể cả khi không đạt kiểm tra gửi, P-04 liệt kê các điểm chưa đạt"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-596",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án có bản PAKD lập lần đầu đang chờ duyệt: lưu HĐ thì P-04 của bản đó hiện nhãn \"Cập nhật theo hợp đồng sau khi nộp\" kèm so sánh",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-597",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án có bản PAKD lập lần đầu đang chờ duyệt: lưu HĐ không sinh thêm phiên bản PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-598",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án chưa có PAKD được duyệt, đang có bản PAKD đang lập: lưu HĐ ghi thông tin HĐ vào Mục 1 của bản đang lập",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-599",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029",
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án có bản điều chỉnh đang chờ Kế toán duyệt: lưu HĐ cập nhật Mục 1 của bản đó, P-04 gắn nhãn \"Cập nhật theo hợp đồng sau khi nộp\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-600",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án có bản điều chỉnh nháp: lưu HĐ cập nhật Mục 1 của bản nháp, các mục khác SM đang soạn giữ nguyên",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-601",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án có bản điều chỉnh bị từ chối chưa huỷ: lưu HĐ không sinh bản điều chỉnh thứ hai"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-602",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029",
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án chưa có bản PAKD nào: lưu HĐ chỉ lưu HĐ, Phiên bản PAKD vẫn \"—\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-603",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án chưa có PAKD đã lưu HĐ, SM mở khung PAKD lập lần đầu thì Mục 1 nạp sẵn thông tin HĐ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-604",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify cập nhật HĐ chỉ đổi phụ lục (không đổi tình trạng, số HĐ, ngày ký, giá trị, tháng bắt đầu / kết thúc) thì không sinh bản điều chỉnh PAKD"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-605",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-029",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Đưa thông tin hợp đồng sang PAKD",
        "subcategory": "Theo tình trạng PAKD tại lúc lưu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify các nhánh cập nhật Mục 1 có trường khác ghi lịch sử \"Cập nhật PAKD theo hợp đồng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-606",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Đóng popup và lỗi khi lưu",
        "subcategory": "Đóng không lưu",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Huỷ\" thì P-03 đóng mà không lưu thay đổi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-607",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Đóng popup và lỗi khi lưu",
        "subcategory": "Đóng không lưu",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bấm vào nền ngoài P-03 thì popup đóng mà không lưu thay đổi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-608",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Đóng popup và lỗi khi lưu",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify Kế toán kết thúc dự án trong lúc SM đang mở P-03, SM bấm lưu thì HĐ không được lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-609",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Đóng popup và lỗi khi lưu",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi dữ liệu đã đổi ở P-03, popup nạp lại, ô Lý do lệch giữ nội dung đang nhập"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-610",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Đóng popup và lỗi khi lưu",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify tài khoản bị đổi khỏi vai trò SM trong lúc mở P-03, bấm lưu thì hiện \"Bạn không có quyền thực hiện thao tác này.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-611",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-033",
          "NFR-quan-ly-du-an-kinh-doanh-014",
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Đóng popup và lỗi khi lưu",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi khi ghi phần sang PAKD thì HĐ, Version, PAKD đều không đổi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-612",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Đóng popup và lỗi khi lưu",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi không trọn vẹn, P-03 giữ dữ liệu đang nhập"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "quan-ly-ma-outsource",
    "file": "checklist-uc-quan-ly-ma-outsource.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-613",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022",
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Hiển thị nút Tạo mã outsource",
        "subcategory": "Theo vai trò và trạng thái",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò SM, GĐK, Kế toán thấy nút \"Tạo mã outsource (0/2)\" ở góc khung Mã dự án của dự án đã có mã, khác Kết thúc",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-614",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022",
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Hiển thị nút Tạo mã outsource",
        "subcategory": "Theo vai trò và trạng thái",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM không thấy nút \"Tạo mã outsource\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-615",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022",
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Hiển thị nút Tạo mã outsource",
        "subcategory": "Theo vai trò và trạng thái",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Kết thúc không có nút \"Tạo mã outsource\" với Kế toán",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-616",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022",
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Hiển thị nút Tạo mã outsource",
        "subcategory": "Theo vai trò và trạng thái",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Chờ duyệt mã không có nút \"Tạo mã outsource\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-617",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022",
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Tạo mã outsource",
        "subcategory": "Tạo thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm \"Tạo mã outsource (0/2)\" ở dự án mã \"022.688\" tạo mã \"022.688.3\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-618",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-008",
          "FR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Tạo mã outsource",
        "subcategory": "Tạo thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm tạo lần thứ hai tạo mã \"022.688.4\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-619",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022",
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Tạo mã outsource",
        "subcategory": "Tạo thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mã mới có PM bằng PM outsource mặc định của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-620",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Tạo mã outsource",
        "subcategory": "Tạo thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Tạo mã outsource\" ghi chú \"{mã} · PM {tên}\", người thực hiện \"{người dùng} ({vai trò})\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-621",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Tạo mã outsource",
        "subcategory": "Tạo thành công",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify dự án không có PM outsource mặc định, tạo mã thì lịch sử ghi chú chỉ \"{mã}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-622",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Tạo mã outsource",
        "subcategory": "Tạo thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tạo mã outsource không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-623",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Tạo mã outsource",
        "subcategory": "Tạo thành công",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify danh sách mã outsource sắp theo thứ tự mã"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-624",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-021",
          "FR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Tạo mã outsource",
        "subcategory": "Giới hạn 2 mã đang có",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã có 2 mã outsource thì nút \"Tạo mã outsource (2/2)\" mờ, chú thích \"Tối đa 2 mã outsource\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-625",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-008",
          "E-quan-ly-du-an-kinh-doanh-021"
        ],
        "category": "Tạo mã outsource",
        "subcategory": "Giới hạn 2 mã đang có",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đã dùng \".3\", \".4\", xoá \".4\" thì tạo tiếp ra \".5\", không dùng lại \".4\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-626",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023",
          "BR-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Đổi PM",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ô chọn PM của mã outsource liệt kê người có vai trò PM outsource từ danh mục nhân sự IMIS"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-627",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Đổi PM",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chọn PM khác cho mã outsource thì PM mới được lưu ngay (tải lại màn vẫn hiện PM mới)",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-628",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Đổi PM",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify đổi PM mã outsource thì tab Lịch sử có dòng \"Cập nhật PM outsource\" ghi chú \"{mã} · {PM}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-629",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Đổi PM",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn \"— Chọn PM outsource —\" thì lịch sử ghi chú \"{mã} · bỏ PM\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-630",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023",
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Xoá mã",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm thùng rác cạnh mã hiện hộp hỏi xác nhận \"Xoá mã outsource {mã}\" kèm dấu chấm hỏi và câu \"Số này sẽ không được dùng lại.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-631",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Xoá mã",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đồng ý xoá thì mã không còn trong khung Mã dự án",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-632",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Xoá mã",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify xoá mã thì tab Lịch sử có dòng \"Xoá mã outsource\" ghi chú \"{mã}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-633",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Xoá mã",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify huỷ hộp xác nhận xoá thì mã giữ nguyên"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-634",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-021",
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Chỉ xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM thấy mã outsource và PM nhưng không có ô chọn PM, không có nút xoá",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-635",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Đổi PM và xoá mã outsource",
        "subcategory": "Chỉ xem",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Kết thúc: mã outsource không có ô chọn PM, không có nút xoá với Kế toán"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-636",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022",
          "BR-quan-ly-du-an-kinh-doanh-008"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Tạo khi dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify 2 phiên cùng bấm tạo khi dự án có 1 mã outsource thì chỉ 1 mã mới được tạo, phiên còn lại không tạo được mã"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-637",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Tạo khi dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify 2 phiên cùng bấm tạo khi dự án chưa có mã outsource thì 2 mã tạo ra có số khác nhau"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-638",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Tạo khi dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify dự án vừa Kết thúc ở phiên khác, bấm \"Tạo mã outsource\" thì không có mã mới được tạo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-639",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Tạo khi dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify dự án vừa Kết thúc ở phiên khác, đổi PM mã outsource thì PM mới không được lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-640",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-038",
          "FR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Danh mục và ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify giả lập IMIS lỗi thì ô chọn PM outsource bị khoá kèm nút \"Thử lại\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-641",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-022",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Danh mục và ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi tạo mã thì không có mã mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-642",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Lỗi và thao tác cùng lúc",
        "subcategory": "Danh mục và ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi xoá mã thì mã giữ nguyên"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "dinh-kem-tai-lieu",
    "file": "checklist-uc-dinh-kem-tai-lieu.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-643",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Đính kèm tài liệu dự án",
        "subcategory": "Thêm tệp",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify cột \"Tài liệu đính kèm (n)\" ở màn chi tiết có nút \"Đính kèm tài liệu\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-644",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-025",
          "BR-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Đính kèm tài liệu dự án",
        "subcategory": "Thêm tệp",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chọn 2 tệp thì 2 tệp được lưu ngay, hiện trong danh sách kèm tên, dung lượng",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-645",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Đính kèm tài liệu dự án",
        "subcategory": "Thêm tệp",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify thêm tệp thì tab Lịch sử có dòng \"Cập nhật tài liệu đính kèm\" ghi chú \"Thêm {tên tệp, …}\", người thực hiện \"{người dùng}\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-646",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Đính kèm tài liệu dự án",
        "subcategory": "Thêm tệp",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify thêm tệp không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-647",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-041",
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Đính kèm tài liệu dự án",
        "subcategory": "Thêm tệp",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn cùng lượt 1 tệp .exe và 1 tệp .pdf ở màn chi tiết thì tệp .pdf vẫn được lưu vào dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-648",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-025",
          "NFR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Đính kèm tài liệu dự án",
        "subcategory": "Mở xem tệp",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm tên tệp mở xem được tệp"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-649",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Đính kèm tài liệu dự án",
        "subcategory": "Mở xem tệp",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tải lại màn chi tiết, bấm tên tệp đã lưu từ trước vẫn mở xem được"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-650",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-051",
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Gỡ tài liệu dự án",
        "subcategory": "Gỡ tệp",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm nút gỡ cạnh tệp hiện hộp hỏi xác nhận \"Gỡ tệp \"{tên}\"\" kèm dấu chấm hỏi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-651",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Gỡ tài liệu dự án",
        "subcategory": "Gỡ tệp",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đồng ý gỡ thì tệp không còn trong danh sách tài liệu",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-652",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Gỡ tài liệu dự án",
        "subcategory": "Gỡ tệp",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify gỡ tệp thì tab Lịch sử có dòng \"Cập nhật tài liệu đính kèm\" ghi chú \"Xoá {tên}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-653",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-051"
        ],
        "category": "Gỡ tài liệu dự án",
        "subcategory": "Gỡ tệp",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify huỷ hộp xác nhận gỡ thì tệp vẫn còn trong danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-654",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-051",
          "NFR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Gỡ tài liệu dự án",
        "subcategory": "Gỡ tệp",
        "priority": 2,
        "auto": "No",
        "text": "Verify tệp đã gỡ vẫn được lưu trữ, lịch sử giữ tên tệp"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-655",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-039",
          "BR-quan-ly-du-an-kinh-doanh-051",
          "FR-quan-ly-du-an-kinh-doanh-025"
        ],
        "category": "Theo trạng thái và vai trò",
        "subcategory": "Dự án Kết thúc và mọi vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Kết thúc vẫn đính kèm được tệp",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-656",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-039"
        ],
        "category": "Theo trạng thái và vai trò",
        "subcategory": "Dự án Kết thúc và mọi vai trò",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Kết thúc vẫn gỡ được tệp"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-657",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-039"
        ],
        "category": "Theo trạng thái và vai trò",
        "subcategory": "Dự án Kết thúc và mọi vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò AM, SM, GĐK, Kế toán đều đính kèm được tệp vào dự án",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-658",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-025",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi lưu tệp",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi thêm tệp thì danh sách tệp giữ nguyên"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "xoa-du-an",
    "file": "checklist-uc-xoa-du-an.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-659",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034",
          "BR-quan-ly-du-an-kinh-doanh-010",
          "FR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Nút Xoá theo vai trò và trạng thái",
        "subcategory": "Hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify GĐK của khối thấy nút \"Xoá\" màu đỏ ở đầu trang chi tiết",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-660",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034",
          "BR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Nút Xoá theo vai trò và trạng thái",
        "subcategory": "Hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò AM, SM, Kế toán không thấy nút \"Xoá\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-661",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034",
          "BR-quan-ly-du-an-kinh-doanh-010",
          "FR-quan-ly-du-an-kinh-doanh-019"
        ],
        "category": "Nút Xoá theo vai trò và trạng thái",
        "subcategory": "Hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify GĐK mở dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã: nút \"Xoá\" bấm được",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-662",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Nút Xoá theo vai trò và trạng thái",
        "subcategory": "Hiển thị",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify rê chuột vào nút \"Xoá\" của dự án Chờ duyệt mã hiện chú thích \"Xoá yêu cầu mở mã (chưa được Giám đốc khối duyệt)\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-663",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-020",
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Nút Xoá theo vai trò và trạng thái",
        "subcategory": "Hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify GĐK mở dự án ở mỗi trạng thái Chưa có PAKD, PAKD chờ duyệt, Đang thực hiện, Pending, Kết thúc: nút \"Xoá\" mờ, không bấm được",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-664",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-020"
        ],
        "category": "Nút Xoá theo vai trò và trạng thái",
        "subcategory": "Hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify rê chuột vào nút \"Xoá\" mờ hiện chú thích \"Dự án đã được Giám đốc khối duyệt — không xoá được\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-665",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Xác nhận xoá",
        "subcategory": "Hộp xoá có lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Xoá\" hiện hộp hỏi xác nhận \"Xoá dự án \"{tên}\"\" kèm dấu chấm hỏi và ô lý do xoá",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-666",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-024",
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Xác nhận xoá",
        "subcategory": "Hộp xoá có lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm Huỷ ở hộp xoá thì dự án không bị xoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-667",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Xác nhận xoá",
        "subcategory": "Lý do xoá",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đồng ý khi ô lý do trống thì ô viền đỏ kèm chữ đỏ \"Vui lòng nhập lý do xoá.\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-668",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-029",
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Xác nhận xoá",
        "subcategory": "Lý do xoá",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đồng ý khi ô lý do trống thì dự án không bị xoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-669",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Xác nhận xoá",
        "subcategory": "Lý do xoá",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lý do xoá chỉ gồm khoảng trắng bị coi như trống, hiện \"Vui lòng nhập lý do xoá.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-670",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050",
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Xác nhận xoá",
        "subcategory": "Lý do xoá",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lý do xoá dài 1.001 ký tự hiện \"Tối đa {n} ký tự\" với n là 1.000"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-671",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Xoá thành công",
        "subcategory": "Kết quả xoá",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nhập lý do, đồng ý xoá dự án Chờ duyệt mã thì màn chuyển về danh sách",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-672",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Xoá thành công",
        "subcategory": "Kết quả xoá",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi xoá hiện thông báo \"Đã xoá dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-673",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Xoá thành công",
        "subcategory": "Kết quả xoá",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify GĐK xoá được dự án Từ chối mã, màn về danh sách"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-674",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034",
          "BR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Xoá thành công",
        "subcategory": "Kết quả xoá",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án đã xoá không còn trên danh sách với mọi bộ lọc",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-675",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Xoá thành công",
        "subcategory": "Kết quả xoá",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify xoá dự án Chờ duyệt mã không làm thay đổi số nào trên Sổ theo dõi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-676",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034",
          "BR-quan-ly-du-an-kinh-doanh-043",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "NFR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Xoá thành công",
        "subcategory": "Kết quả xoá",
        "priority": 1,
        "auto": "No",
        "text": "Verify nhật ký xoá ghi đủ người xoá, thời điểm, lý do"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-677",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-043",
          "NFR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Xoá thành công",
        "subcategory": "Kết quả xoá",
        "priority": 2,
        "auto": "No",
        "text": "Verify dữ liệu, lịch sử của dự án đã xoá vẫn được giữ, không xoá hẳn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-678",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Xoá thành công",
        "subcategory": "Kết quả xoá",
        "priority": 4,
        "auto": "No",
        "text": "Verify MH-02 không có thao tác khôi phục dự án đã xoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-679",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034",
          "BR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Lỗi khi xoá",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify dự án vừa được duyệt mã ở phiên khác, GĐK đồng ý xoá thì dự án không bị xoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-680",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Lỗi khi xoá",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi dữ liệu đã đổi ở hộp xoá, ô lý do xoá giữ nội dung đang nhập"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-681",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-034",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi xoá",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi xoá thì không có gì được ghi (dự án không bị đánh dấu xoá, không có nhật ký xoá)"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-682",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi khi xoá",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi không trọn vẹn, hộp xoá giữ lý do đã nhập"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "ket-thuc-du-an",
    "file": "checklist-uc-ket-thuc-du-an.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-683",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "BR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Nút Kết thúc dự án",
        "subcategory": "Hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò GĐK của khối, Kế toán thấy nút \"Kết thúc dự án\" trên dòng thông báo của dự án Đang thực hiện không có bản điều chỉnh chờ duyệt",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-684",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "BR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Nút Kết thúc dự án",
        "subcategory": "Hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò SM, AM không thấy nút \"Kết thúc dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-685",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "BR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Nút Kết thúc dự án",
        "subcategory": "Hiển thị",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Đang thực hiện có bản điều chỉnh PAKD chờ Kế toán duyệt không có nút \"Kết thúc dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-686",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Nút Kết thúc dự án",
        "subcategory": "Hiển thị",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Chưa có PAKD không có nút \"Kết thúc dự án\" với GĐK"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-687",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "BR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Xác nhận kết thúc",
        "subcategory": "Hộp xác nhận",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Kết thúc dự án\" hiện hộp hỏi \"Kết thúc dự án \"{tên}\"\" kèm dấu chấm hỏi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-688",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Xác nhận kết thúc",
        "subcategory": "Hộp xác nhận",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án không có bản điều chỉnh PAKD nháp, hộp xác nhận không có câu về bản điều chỉnh"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-689",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "BR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Xác nhận kết thúc",
        "subcategory": "Hộp xác nhận",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án còn bản điều chỉnh PAKD nháp, hộp xác nhận có thêm câu \"Dự án còn bản điều chỉnh PAKD chưa gửi — bản này sẽ bị huỷ.\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-690",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Xác nhận kết thúc",
        "subcategory": "Hộp xác nhận",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án còn bản điều chỉnh PAKD bị từ chối chưa huỷ, hộp xác nhận có thêm câu \"Dự án còn bản điều chỉnh PAKD chưa gửi — bản này sẽ bị huỷ.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-691",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-025",
          "FR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Xác nhận kết thúc",
        "subcategory": "Hộp xác nhận",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm Huỷ ở hộp xác nhận thì dự án giữ \"Đang thực hiện\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-692",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Kết thúc thành công",
        "subcategory": "Kết quả",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify đồng ý thì dự án chuyển sang \"Kết thúc\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-693",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Kết thúc thành công",
        "subcategory": "Kết quả",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Kết thúc dự án\" ghi chú \"—\", người thực hiện \"{người dùng} ({vai trò})\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-694",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Kết thúc thành công",
        "subcategory": "Kết quả",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi kết thúc hiện thông báo \"Đã kết thúc dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-695",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Kết thúc thành công",
        "subcategory": "Kết quả",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify kết thúc không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-696",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-013"
        ],
        "category": "Kết thúc thành công",
        "subcategory": "Kết quả",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify kết thúc được dự án chưa ký HĐ (không kiểm điều kiện nghiệp vụ khác)"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-697",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Kết thúc thành công",
        "subcategory": "Tự huỷ bản điều chỉnh PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify kết thúc dự án còn bản điều chỉnh nháp thì Phiên bản PAKD hiện bản PAKD đang áp dụng",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-698",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Kết thúc thành công",
        "subcategory": "Tự huỷ bản điều chỉnh PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify kết thúc dự án còn bản điều chỉnh nháp thì tab Lịch sử có dòng \"Huỷ bản điều chỉnh PAKD (Kết thúc dự án)\" ngay sau dòng \"Kết thúc dự án\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-699",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Kết thúc thành công",
        "subcategory": "Tự huỷ bản điều chỉnh PAKD",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tài khoản AM không thấy dòng \"Huỷ bản điều chỉnh PAKD (Kết thúc dự án)\" trong tab Lịch sử"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-700",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "NFR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Kết thúc thành công",
        "subcategory": "Tự huỷ bản điều chỉnh PAKD",
        "priority": 2,
        "auto": "No",
        "text": "Verify bản điều chỉnh bị tự huỷ vẫn được lưu lại, không xoá cứng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-701",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Lỗi khi kết thúc",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify SM gửi bản điều chỉnh PAKD trong lúc Kế toán đang mở hộp xác nhận, Kế toán đồng ý thì dự án không bị kết thúc"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-702",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-035",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi kết thúc",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi kết thúc thì không có gì được ghi (dự án giữ \"Đang thực hiện\", bản điều chỉnh nháp không bị huỷ)"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "mo-lai-du-an-ket-thuc",
    "file": "checklist-uc-mo-lai-du-an-ket-thuc.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-703",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043",
          "BR-quan-ly-du-an-kinh-doanh-041",
          "BR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Hiển thị bước mở lại dự án Kết thúc",
        "subcategory": "Dòng thông báo và nút",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán mở dự án Kết thúc thấy dòng thông báo kèm nút \"Mở lại dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-704",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043",
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Hiển thị bước mở lại dự án Kết thúc",
        "subcategory": "Dòng thông báo và nút",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò AM, SM, GĐK mở dự án Kết thúc không thấy dòng thông báo bước, không có nút \"Mở lại dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-705",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043",
          "BR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Xác nhận mở lại",
        "subcategory": "Hộp lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Mở lại dự án\" mở hộp xác nhận có ô lý do mở lại"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-706",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Xác nhận mở lại",
        "subcategory": "Hộp lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm Huỷ ở hộp mở lại thì dự án giữ \"Kết thúc\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-707",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Xác nhận mở lại",
        "subcategory": "Hộp lý do",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify xác nhận khi ô lý do trống thì ô viền đỏ kèm chữ đỏ \"Vui lòng nhập lý do mở lại.\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-708",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Xác nhận mở lại",
        "subcategory": "Hộp lý do",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify xác nhận khi ô lý do trống thì dự án không được mở lại, giữ \"Kết thúc\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-709",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Xác nhận mở lại",
        "subcategory": "Hộp lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lý do chỉ gồm khoảng trắng bị coi như trống, hiện \"Vui lòng nhập lý do mở lại.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-710",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-050",
          "FR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Xác nhận mở lại",
        "subcategory": "Hộp lý do",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify lý do dài 1.001 ký tự hiện \"Tối đa {n} ký tự\" với n là 1.000"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-711",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043",
          "BR-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Mở lại thành công",
        "subcategory": "Kết quả",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify nhập lý do, xác nhận thì dự án về \"Đang thực hiện\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-712",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043",
          "BR-quan-ly-du-an-kinh-doanh-044",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Mở lại thành công",
        "subcategory": "Kết quả",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Mở lại dự án (từ Kết thúc)\" ghi chú đúng lý do đã nhập, người thực hiện \"{người dùng} ({vai trò})\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-713",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Mở lại thành công",
        "subcategory": "Kết quả",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi mở lại hiện thông báo \"Đã mở lại dự án {mã}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-714",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043",
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Mở lại thành công",
        "subcategory": "Kết quả",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mở lại không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-715",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Mở lại thành công",
        "subcategory": "Kết quả",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi mở lại, SM thấy lại nút \"Sửa\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-716",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Mở lại thành công",
        "subcategory": "Kết quả",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi mở lại, Kế toán thấy lại nút \"Tạo mã outsource\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-717",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043"
        ],
        "category": "Lỗi khi mở lại",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify 2 phiên Kế toán cùng mở lại 1 dự án Kết thúc, phiên sau không ghi thêm dòng lịch sử \"Mở lại dự án (từ Kết thúc)\" thứ hai"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-718",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Lỗi khi mở lại",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi dữ liệu đã đổi, ô lý do mở lại giữ nội dung đang nhập"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-719",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi mở lại",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi mở lại thì dự án giữ \"Kết thúc\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-720",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-043",
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi khi mở lại",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi giữa chừng khi mở lại, hộp mở lại giữ lý do đã nhập"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "tu-dong-chuyen-pending",
    "file": "checklist-uc-tu-dong-chuyen-pending.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-721",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-036",
          "BR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Điều kiện chuyển Pending",
        "subcategory": "Dự án quá hạn",
        "priority": 1,
        "auto": "No",
        "text": "Verify dự án Chưa có PAKD có hạn lập PAKD nhỏ hơn hôm nay được tác vụ hằng ngày chuyển sang \"Pending\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-722",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Điều kiện chuyển Pending",
        "subcategory": "Dự án quá hạn",
        "priority": 1,
        "auto": "No",
        "text": "Verify dự án PAKD chờ duyệt có hạn nhỏ hơn hôm nay được chuyển sang \"Pending\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-723",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Điều kiện chuyển Pending",
        "subcategory": "Dự án quá hạn",
        "priority": 1,
        "auto": "No",
        "text": "Verify tác vụ chạy đúng ngày hạn không chuyển dự án Chưa có PAKD sang \"Pending\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-724",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-011",
          "BR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Điều kiện chuyển Pending",
        "subcategory": "Dự án quá hạn",
        "priority": 1,
        "auto": "No",
        "text": "Verify dự án đã bị Kế toán từ chối PAKD, hạn gốc đã qua được chuyển sang \"Pending\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-725",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Điều kiện chuyển Pending",
        "subcategory": "Dự án quá hạn",
        "priority": 2,
        "auto": "No",
        "text": "Verify dự án Đang thực hiện có hạn đã qua không bị chuyển \"Pending\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-726",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-011",
          "BR-quan-ly-du-an-kinh-doanh-042"
        ],
        "category": "Điều kiện chuyển Pending",
        "subcategory": "Dự án quá hạn",
        "priority": 2,
        "auto": "No",
        "text": "Verify dự án ở mỗi trạng thái Chờ duyệt mã, Từ chối mã không bị chuyển \"Pending\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-727",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-007"
        ],
        "category": "Điều kiện chuyển Pending",
        "subcategory": "Dự án quá hạn",
        "priority": 2,
        "auto": "No",
        "text": "Verify tác vụ chạy 00:30 giờ Việt Nam ngày D+1 chuyển \"Pending\" dự án có hạn ngày D"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-728",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-036",
          "BR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Điều kiện chuyển Pending",
        "subcategory": "Kiểm lại tại lúc chuyển",
        "priority": 1,
        "auto": "No",
        "text": "Verify dự án vừa được Kế toán duyệt PAKD trong lúc tác vụ đang chạy thì tác vụ bỏ qua dự án đó"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-729",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-036",
          "NFR-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Kết quả chuyển Pending",
        "subcategory": "Ngày đóng và lịch sử",
        "priority": 1,
        "auto": "No",
        "text": "Verify dự án hạn 10/03/2026 chuyển Pending có ngày đóng 11/03/2026 hiện ở cột Hạn lập PAKD",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-730",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-036",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Kết quả chuyển Pending",
        "subcategory": "Ngày đóng và lịch sử",
        "priority": 1,
        "auto": "No",
        "text": "Verify dự án đã có bản PAKD nộp chuyển Pending có lịch sử người thực hiện \"Hệ thống\", thao tác \"Tự động chuyển Pending\", ghi chú \"Quá 30 ngày (hạn {dd/mm/yyyy}) PAKD chưa được Kế toán duyệt\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-731",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Kết quả chuyển Pending",
        "subcategory": "Ngày đóng và lịch sử",
        "priority": 2,
        "auto": "No",
        "text": "Verify dự án chưa có PAKD chuyển Pending có lịch sử ghi chú \"Quá 30 ngày (hạn {dd/mm/yyyy}) chưa có PAKD\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-732",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Kết quả chuyển Pending",
        "subcategory": "Ngày đóng và lịch sử",
        "priority": 2,
        "auto": "No",
        "text": "Verify chuyển Pending không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-733",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-036",
          "NFR-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Vận hành tác vụ hằng ngày",
        "subcategory": "Lỡ ngày, chạy lại, lỗi",
        "priority": 1,
        "auto": "No",
        "text": "Verify tác vụ không chạy 2 ngày, lần chạy sau chuyển mọi dự án đã quá hạn sang \"Pending\" với ngày đóng = hạn + 1"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-734",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-036",
          "NFR-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Vận hành tác vụ hằng ngày",
        "subcategory": "Lỡ ngày, chạy lại, lỗi",
        "priority": 1,
        "auto": "No",
        "text": "Verify chạy lại tác vụ trong cùng ngày không tạo dòng lịch sử \"Tự động chuyển Pending\" thứ hai"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-735",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-036",
          "NFR-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Vận hành tác vụ hằng ngày",
        "subcategory": "Lỡ ngày, chạy lại, lỗi",
        "priority": 2,
        "auto": "No",
        "text": "Verify tác vụ hoàn tất trước 06:00 giờ Việt Nam"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-736",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-036",
          "NFR-quan-ly-du-an-kinh-doanh-015"
        ],
        "category": "Vận hành tác vụ hằng ngày",
        "subcategory": "Lỡ ngày, chạy lại, lỗi",
        "priority": 2,
        "auto": "No",
        "text": "Verify giả lập tác vụ lỗi thì bộ phận vận hành nhận cảnh báo"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-737",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Vận hành tác vụ hằng ngày",
        "subcategory": "Lỡ ngày, chạy lại, lỗi",
        "priority": 2,
        "auto": "No",
        "text": "Verify lỗi của tác vụ hằng ngày được ghi nhận tra soát"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "mo-lai-du-an-pending",
    "file": "checklist-uc-mo-lai-du-an-pending.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-738",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Hiển thị dự án Pending",
        "subcategory": "Dòng thông báo theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán mở dự án Pending thấy dòng thông báo bắt đầu \"Dự án Pending: quá 30 ngày (hạn {ngày})\" kèm nút \"Mở lại dự án\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-739",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Hiển thị dự án Pending",
        "subcategory": "Dòng thông báo theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán mở dự án Pending đang có bản PAKD chờ thấy thêm nút \"Duyệt / Từ chối PAKD\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-740",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041",
          "E-quan-ly-du-an-kinh-doanh-023"
        ],
        "category": "Hiển thị dự án Pending",
        "subcategory": "Dòng thông báo theo vai trò",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mỗi vai trò SM, GĐK mở dự án Pending thấy dải xám \"Đang chờ Kế toán (CFO) mở lại dự án Pending (quá hạn PAKD {ngày}).\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-741",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-041"
        ],
        "category": "Hiển thị dự án Pending",
        "subcategory": "Dòng thông báo theo vai trò",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify AM mở dự án Pending thấy dải xám chờ Kế toán mở lại, không kèm ngày"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-742",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-012"
        ],
        "category": "Hiển thị dự án Pending",
        "subcategory": "Dòng thông báo theo vai trò",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò AM, SM, GĐK không thấy nút \"Mở lại dự án\" ở dự án Pending",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-743",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Mở lại dự án Pending",
        "subcategory": "Kết quả mở lại",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Kế toán bấm \"Mở lại dự án\" thực hiện ngay, không hiện hộp xác nhận"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-744",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-012"
        ],
        "category": "Mở lại dự án Pending",
        "subcategory": "Kết quả mở lại",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Pending không có bản PAKD chờ, mở lại thì về \"Chưa có PAKD\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-745",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-012"
        ],
        "category": "Mở lại dự án Pending",
        "subcategory": "Kết quả mở lại",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Pending có bản PAKD mới nhất đang chờ Kế toán, mở lại thì về \"PAKD chờ duyệt\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-746",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-012",
          "BR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Mở lại dự án Pending",
        "subcategory": "Kết quả mở lại",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sau khi mở lại, cột Hạn lập PAKD hiện \"Còn 30 ngày\" (hạn mới = hôm nay + 30)",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-747",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-012"
        ],
        "category": "Mở lại dự án Pending",
        "subcategory": "Kết quả mở lại",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi mở lại, cột Hạn lập PAKD không còn ngày đóng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-748",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Mở lại dự án Pending",
        "subcategory": "Kết quả mở lại",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Mở lại dự án\" ghi chú \"Hạn PAKD mới: {dd/mm/yyyy}\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-749",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Mở lại dự án Pending",
        "subcategory": "Kết quả mở lại",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi mở lại hiện thông báo \"Đã mở lại dự án {mã} — hạn lập PAKD {dd/mm/yyyy}\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-750",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Mở lại dự án Pending",
        "subcategory": "Kết quả mở lại",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify mở lại dự án Pending không làm thay đổi Version"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-751",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Quyết định PAKD khi dự án Pending",
        "subcategory": "Duyệt và từ chối",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán duyệt bản PAKD đang chờ của dự án Pending thì dự án chuyển \"Đang thực hiện\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-752",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Quyết định PAKD khi dự án Pending",
        "subcategory": "Duyệt và từ chối",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi Kế toán duyệt PAKD lúc dự án Pending, cột Hạn lập PAKD không còn ngày đóng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-753",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Quyết định PAKD khi dự án Pending",
        "subcategory": "Duyệt và từ chối",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán từ chối bản PAKD đang chờ của dự án Pending thì dự án giữ \"Pending\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-754",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038"
        ],
        "category": "Quyết định PAKD khi dự án Pending",
        "subcategory": "Duyệt và từ chối",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify từ chối PAKD lúc dự án Pending không sinh thêm dòng lịch sử \"Tự động chuyển Pending\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-755",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi khi mở lại",
        "subcategory": "Dữ liệu đã đổi và ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify Kế toán duyệt PAKD ở phiên khác trong lúc phiên này bấm \"Mở lại dự án\" thì dự án không được mở lại, giữ trạng thái \"Đang thực hiện\" vừa duyệt"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-756",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-037",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi mở lại",
        "subcategory": "Dữ liệu đã đổi và ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi mở lại thì dự án giữ \"Pending\""
      }
    ]
  },
  {
    "scope": "uc",
    "target": "import-so-lieu-thuc-te",
    "file": "checklist-uc-import-so-lieu-thuc-te.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-757",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045",
          "BR-quan-ly-du-an-kinh-doanh-047"
        ],
        "category": "Nút Import thực tế",
        "subcategory": "Theo vai trò và trạng thái",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán thấy nút \"Import thực tế\" ở khối Số liệu dự án theo tháng của dự án Đang thực hiện",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-758",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Nút Import thực tế",
        "subcategory": "Theo vai trò và trạng thái",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify mỗi vai trò AM, SM, GĐK không thấy nút \"Import thực tế\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-759",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045",
          "BR-quan-ly-du-an-kinh-doanh-047"
        ],
        "category": "Nút Import thực tế",
        "subcategory": "Theo vai trò và trạng thái",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án Kết thúc không có nút \"Import thực tế\" với Kế toán",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-760",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045",
          "BR-quan-ly-du-an-kinh-doanh-047"
        ],
        "category": "Nút Import thực tế",
        "subcategory": "Theo vai trò và trạng thái",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án Pending có nút \"Import thực tế\", import được"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-761",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Popup Import 3 bước",
        "subcategory": "Tải file mẫu và chọn file",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Import thực tế\" mở popup \"Import số thực tế theo tháng — {mã} · {tên}\" có 3 bước"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-762",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Popup Import 3 bước",
        "subcategory": "Tải file mẫu và chọn file",
        "priority": 2,
        "auto": "No",
        "text": "Verify file mẫu tải ở bước \"Tải file mẫu\" có các tháng theo thời gian dự án kèm số hiện có"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-763",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Popup Import 3 bước",
        "subcategory": "Tải file mẫu và chọn file",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn file đã điền ở bước \"Chọn file đã điền\" hiện phần xem trước"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-764",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Popup Import 3 bước",
        "subcategory": "Tải file mẫu và chọn file",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify kéo thả file đã điền vào bước \"Chọn file đã điền\" hiện phần xem trước"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-765",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Popup Import 3 bước",
        "subcategory": "Tải file mẫu và chọn file",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify phần xem trước hiện số tháng mới, số tháng cập nhật"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-766",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-009"
        ],
        "category": "Popup Import 3 bước",
        "subcategory": "Giới hạn tệp",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tệp đúng 20 MB, đúng 50.000 dòng dữ liệu được nhận vào xem trước"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-767",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-044",
          "NFR-quan-ly-du-an-kinh-doanh-009",
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Popup Import 3 bước",
        "subcategory": "Giới hạn tệp",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp 20 MB + 1 byte hiện \"File vượt giới hạn cho phép (tối đa 20 MB và 50.000 dòng dữ liệu).\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-768",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-044",
          "NFR-quan-ly-du-an-kinh-doanh-009"
        ],
        "category": "Popup Import 3 bước",
        "subcategory": "Giới hạn tệp",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp có 50.001 dòng dữ liệu hiện \"File vượt giới hạn cho phép (tối đa 20 MB và 50.000 dòng dữ liệu).\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-769",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-044"
        ],
        "category": "Popup Import 3 bước",
        "subcategory": "Giới hạn tệp",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tệp vượt giới hạn thì nút \"Import thực tế\" bị khoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-770",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Tệp không đọc được",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify chọn tệp .pdf hiện \"Chỉ hỗ trợ file .xlsx, .xls, .csv.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-771",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Tệp không đọc được",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chọn tệp .xlsx đặt mật khẩu hiện câu báo bắt đầu \"Không đọc được file.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-772",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-031"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Tệp không đọc được",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tệp không đọc được thì nút \"Import thực tế\" bị khoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-773",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Sai cấu trúc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp không có dòng tiêu đề \"Chỉ tiêu\" hiện \"Không tìm thấy dòng tiêu đề có ô \"Chỉ tiêu\". Hãy dùng file mẫu.\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-774",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Sai cấu trúc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dòng tiêu đề không có cột tháng hiện \"Dòng tiêu đề không có cột tháng nào (vd 12/2026).\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-775",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-032"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Sai cấu trúc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tệp không có dòng chỉ tiêu hiện \"File không có dòng chỉ tiêu nào.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-776",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Sai cấu trúc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ô tiêu đề tháng \"13/2026\" hiện \"Cột {cột}: \"13/2026\" không phải tháng hợp lệ (dùng MM/YYYY).\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-777",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-033"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Sai cấu trúc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tháng 03/2026 xuất hiện ở 2 cột hiện \"Tháng 03/2026 bị trùng (cột {a} và {b}).\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-778",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-034"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Sai cấu trúc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ô số liệu \"abc\" hiện \"Ô {ô} ({MM/YYYY}): \"abc\" không phải số.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-779",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Sai cấu trúc",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify chỉ tiêu \"Doanh thu thực tế\" xuất hiện ở 2 dòng hiện \"Chỉ tiêu \"Doanh thu thực tế\" bị trùng với dòng {n}.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-780",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045",
          "E-quan-ly-du-an-kinh-doanh-032",
          "E-quan-ly-du-an-kinh-doanh-033",
          "E-quan-ly-du-an-kinh-doanh-034",
          "E-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Sai cấu trúc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp còn lỗi thì nút \"Import thực tế\" bị khoá kèm chú thích \"Sửa hết lỗi trong file trước khi import\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-781",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Cảnh báo không chặn",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tệp có tháng ngoài thời gian dự án hiện cảnh báo \"Tháng {MM/YYYY} nằm ngoài thời gian dự án.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-782",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Cảnh báo không chặn",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tệp có giá trị âm hiện cảnh báo \"Ô {ô} ({MM/YYYY}) có giá trị âm ({n}).\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-783",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Cảnh báo không chặn",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tệp thiếu dòng \"Khối lượng công việc\" hiện cảnh báo \"Thiếu dòng \"Khối lượng công việc\" — giữ nguyên số hiện có.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-784",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-036",
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Cảnh báo không chặn",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp có dòng \"Thu thực tế\" hiện cảnh báo \"Bỏ qua dòng \"Thu thực tế\" — Thu / Chi thực tế chỉ nhận từ Import sổ kế toán.\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-785",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Cảnh báo không chặn",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify tệp có dòng \"Ghi chú\" không phải chỉ tiêu hiện cảnh báo \"Bỏ qua dòng \"Ghi chú\" — không phải chỉ tiêu.\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-786",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Kiểm tra tệp import",
        "subcategory": "Cảnh báo không chặn",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tệp chỉ có cảnh báo, không có lỗi thì nút \"Import thực tế\" bấm được"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-787",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045",
          "BR-quan-ly-du-an-kinh-doanh-047"
        ],
        "category": "Import thành công",
        "subcategory": "Ghi số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify import tệp có Doanh thu thực tế, KLCV tháng 03/2026 thì tab Thực tế hiện đúng số của tháng 03/2026",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-788",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Ghi số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tháng 03/2026 đã có số, import tệp có tháng 03/2026 thì số của tháng 03/2026 được thay bằng số trong tệp",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-789",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Ghi số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tháng 02/2026 đã có số, import tệp không có tháng 02/2026 thì số tháng 02/2026 giữ nguyên",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-790",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Ghi số thực tế",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify popup chỉ có một chế độ \"Gộp theo tháng\", không có lựa chọn chế độ khác"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-791",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Ghi số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify ô trống trong tệp không ghi 0, tháng đó giữ \"chưa có số\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-792",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Ghi số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify ô có số 0 gõ tường minh được ghi thành 0"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-793",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Ghi số thực tế",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tệp thiếu dòng KLCV thì số KLCV đã có giữ nguyên sau khi import"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-794",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-047",
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Ghi số thực tế",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify import tệp có dòng Thu thực tế thì số Thu thực tế đã có giữ nguyên",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-795",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045",
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Import thành công",
        "subcategory": "Lịch sử và thông báo",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify import không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-796",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Import thành công",
        "subcategory": "Lịch sử và thông báo",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Import thực tế Doanh thu / KLCV\" ghi chú \"{n} tháng: MM/YYYY, …\", người thực hiện \"{người dùng} ({vai trò})\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-797",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Lịch sử và thông báo",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify sau khi import hiện thông báo \"Đã import thực tế {n} tháng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-798",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Lịch sử và thông báo",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify chân khung Số liệu theo tháng hiện \"Import từ {tệp} bởi {người} lúc {thời gian}\" của lần import vừa xong"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-799",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Import thành công",
        "subcategory": "Lịch sử và thông báo",
        "priority": 2,
        "auto": "No",
        "text": "Verify số tháng bị Import thực tế thay, tệp import gốc được lưu lại"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-800",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Huỷ và chọn lại",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify bấm \"Huỷ\" ở popup thì đóng popup, số thực tế không đổi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-801",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Import thành công",
        "subcategory": "Huỷ và chọn lại",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify bấm \"Chọn lại\" cho chọn file khác, chưa ghi số"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-802",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045"
        ],
        "category": "Lỗi khi ghi import",
        "subcategory": "Dữ liệu đã đổi",
        "priority": 1,
        "auto": "No",
        "text": "Verify GĐK kết thúc dự án trong lúc Kế toán đang mở popup, Kế toán bấm \"Import thực tế\" thì không tháng nào được ghi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-803",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-045",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Lỗi khi ghi import",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi import 3 tháng thì không tháng nào được ghi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-804",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Lỗi khi ghi import",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify sau lỗi ghi không trọn vẹn, popup giữ tệp đã chọn"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-805",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Lỗi khi ghi import",
        "subcategory": "Ghi không trọn vẹn",
        "priority": 2,
        "auto": "No",
        "text": "Verify lỗi import thực tế được ghi nhận tra soát đủ người, thời điểm, dự án, tệp, lỗi"
      }
    ]
  },
  {
    "scope": "uc",
    "target": "chung",
    "file": "checklist-uc-chung.md",
    "items": [
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-806",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-013",
          "BR-quan-ly-du-an-kinh-doanh-049"
        ],
        "category": "Phân quyền cơ bản theo vai trò và khối",
        "subcategory": "Kiểm quyền tại lúc thực hiện",
        "priority": 1,
        "auto": "No",
        "text": "Verify AM gửi trực tiếp yêu cầu lưu P-03 (không qua nút) bị từ chối, hợp đồng không đổi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-807",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053",
          "NFR-quan-ly-du-an-kinh-doanh-013",
          "NFR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Phân quyền cơ bản theo vai trò và khối",
        "subcategory": "Kiểm quyền tại lúc thực hiện",
        "priority": 1,
        "auto": "No",
        "text": "Verify GĐK khối G1 gửi trực tiếp yêu cầu duyệt mã dự án khối G2 bị từ chối, dự án giữ \"Chờ duyệt mã\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-808",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-013",
          "BR-quan-ly-du-an-kinh-doanh-010"
        ],
        "category": "Phân quyền cơ bản theo vai trò và khối",
        "subcategory": "Kiểm quyền tại lúc thực hiện",
        "priority": 1,
        "auto": "No",
        "text": "Verify Kế toán gửi trực tiếp yêu cầu xoá dự án Chờ duyệt mã bị từ chối, dự án không bị xoá"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-809",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Phân quyền cơ bản theo vai trò và khối",
        "subcategory": "Báo cáo hiệu quả dự án (MH-03)",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM không thấy menu Báo cáo hiệu quả dự án (MH-03)",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-810",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-046"
        ],
        "category": "Phân quyền cơ bản theo vai trò và khối",
        "subcategory": "Báo cáo hiệu quả dự án (MH-03)",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tài khoản AM mở trực tiếp đường dẫn MH-03 bị từ chối",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-811",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-053"
        ],
        "category": "Phân quyền cơ bản theo vai trò và khối",
        "subcategory": "Báo cáo hiệu quả dự án (MH-03)",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tài khoản SM mở MH-03 chỉ thấy dự án thuộc khối của tài khoản"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-812",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-039",
          "NFR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Thông báo thành công",
        "subcategory": "Vị trí và thời gian hiển thị",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify thông báo thành công (vd \"Đã xoá dự án\") hiện ở góc trên phải màn hình"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-813",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-039",
          "NFR-quan-ly-du-an-kinh-doanh-002"
        ],
        "category": "Thông báo thành công",
        "subcategory": "Vị trí và thời gian hiển thị",
        "priority": 3,
        "auto": "No",
        "text": "Verify thông báo thành công tự ẩn sau 2,5 giây"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-814",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Thông báo thành công",
        "subcategory": "Vị trí và thời gian hiển thị",
        "priority": 2,
        "auto": "No",
        "text": "Verify thao tác lỗi (E-037) không hiện thông báo thành công"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-815",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Định dạng hiển thị",
        "subcategory": "Số, ngày, thời gian",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify số tiền VNĐ hiển thị số nguyên có dấu phẩy ngăn nghìn, vd \"1,000,000\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-816",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Định dạng hiển thị",
        "subcategory": "Số, ngày, thời gian",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify ngày hiển thị dạng dd/mm/yyyy trên MH-02"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-817",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Định dạng hiển thị",
        "subcategory": "Số, ngày, thời gian",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify ô không có dữ liệu hiển thị \"—\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-818",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Định dạng hiển thị",
        "subcategory": "Số, ngày, thời gian",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify thời gian ở meta Cập nhật, lịch sử, chân P-03, thông tin lần import hiển thị dạng dd/mm/yyyy HH:mm 24 giờ theo giờ Việt Nam"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-819",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-001"
        ],
        "category": "Định dạng hiển thị",
        "subcategory": "Số, ngày, thời gian",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify phần trăm hiển thị 1 chữ số thập phân"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-820",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-007"
        ],
        "category": "Thời gian theo giờ Việt Nam",
        "subcategory": "Hôm nay theo Asia/Ho_Chi_Minh",
        "priority": 1,
        "auto": "No",
        "text": "Verify GĐK duyệt mã lúc 06:30 giờ Việt Nam ngày D (23:30 UTC ngày D−1) thì ngày cấp mã là ngày D, hạn lập PAKD là D + 30"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-821",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-007",
          "FR-quan-ly-du-an-kinh-doanh-004"
        ],
        "category": "Thời gian theo giờ Việt Nam",
        "subcategory": "Hôm nay theo Asia/Ho_Chi_Minh",
        "priority": 2,
        "auto": "No",
        "text": "Verify mở danh sách lúc 00:30 giờ Việt Nam ngày 01/01 (17:30 UTC ngày 31/12) thì Năm mặc định là năm mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-822",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Gửi và duyệt PAKD lần đầu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify SM gửi PAKD lần đầu ở dự án Chưa có PAKD thì dự án chuyển \"PAKD chờ duyệt\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-823",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Gửi và duyệt PAKD lần đầu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify dự án PAKD chờ duyệt chưa đồng bộ số liệu PAKD: cột Giá trị hợp đồng dự kiến vẫn \"—\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-824",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Gửi và duyệt PAKD lần đầu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán duyệt bản PAKD lập lần đầu thì dự án chuyển \"Đang thực hiện\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-825",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Gửi và duyệt PAKD lần đầu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sau khi Kế toán duyệt PAKD, cột Giá trị hợp đồng dự kiến hiện Doanh thu dự kiến của bản được duyệt",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-826",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Gửi và duyệt PAKD lần đầu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán từ chối bản PAKD lần đầu thì dự án về \"Chưa có PAKD\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-827",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-005"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Gửi và duyệt PAKD lần đầu",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify sau khi bị từ chối PAKD, hạn lập PAKD giữ hạn gốc"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-828",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Tạo hợp đồng ban đầu từ PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán duyệt bản PAKD có tình trạng Đã ký khi dự án chưa có HĐ thì dự án có HĐ ban đầu, nhãn \"Đã ký\"",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-829",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Tạo hợp đồng ban đầu từ PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tạo HĐ ban đầu từ PAKD làm Version dự án tăng thêm 1"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-830",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-052",
          "BR-quan-ly-du-an-kinh-doanh-036"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Tạo hợp đồng ban đầu từ PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify tab Lịch sử có dòng \"Tạo hợp đồng từ PAKD V{n}\" ghi chú \"HĐ {số} · Version {n+1}\", người thực hiện là Kế toán duyệt kèm vai trò",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-831",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035",
          "BR-quan-ly-du-an-kinh-doanh-029"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Tạo hợp đồng ban đầu từ PAKD",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify Kế toán duyệt bản PAKD Đã ký khi dự án đã có HĐ thì HĐ đã lưu giữ nguyên",
        "uat": true
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-832",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Tạo hợp đồng ban đầu từ PAKD",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify Kế toán duyệt bản PAKD Đã ký lệch HĐ hiện có hơn 2% thì hiển thị cảnh báo lệch theo feature phuong-an-kinh-doanh"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-833",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "BR-quan-ly-du-an-kinh-doanh-035"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Bản điều chỉnh",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify SM gửi bản điều chỉnh PAKD thì dự án giữ \"Đang thực hiện\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-834",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Bản điều chỉnh",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Kế toán duyệt bản điều chỉnh PAKD thì dự án giữ \"Đang thực hiện\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-835",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Bản điều chỉnh",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify Kế toán từ chối bản điều chỉnh PAKD thì dự án giữ \"Đang thực hiện\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-836",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-014",
          "BR-quan-ly-du-an-kinh-doanh-052"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Bản điều chỉnh",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify thao tác PAKD (gửi, duyệt, từ chối) không làm thay đổi Version của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-837",
        "ref": [
          "FR-quan-ly-du-an-kinh-doanh-038",
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Trạng thái dự án theo PAKD (điểm nối)",
        "subcategory": "Toàn vẹn quyết định PAKD",
        "priority": 1,
        "auto": "No",
        "text": "Verify giả lập lỗi ghi giữa chừng khi Kế toán duyệt PAKD thì không có gì được ghi (trạng thái dự án, số liệu, HĐ, PAKD đều không đổi)"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-838",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Toàn vẹn dữ liệu và thao tác lặp",
        "subcategory": "Bấm lặp và cùng lúc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm nhanh 2 lần \"Lưu thay đổi\" ở chế độ sửa chỉ tăng Version thêm đúng 1"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-839",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Toàn vẹn dữ liệu và thao tác lặp",
        "subcategory": "Bấm lặp và cùng lúc",
        "priority": 1,
        "auto": "Yes",
        "text": "Verify bấm nhanh 2 lần \"Lưu & xác nhận đã ký\" chỉ tạo 1 dòng lịch sử \"Ký hợp đồng\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-840",
        "ref": [
          "BR-quan-ly-du-an-kinh-doanh-014",
          "E-quan-ly-du-an-kinh-doanh-030"
        ],
        "category": "Toàn vẹn dữ liệu và thao tác lặp",
        "subcategory": "Bấm lặp và cùng lúc",
        "priority": 1,
        "auto": "No",
        "text": "Verify 2 phiên cùng lúc lưu sửa thông tin và lưu P-03 trên cùng dự án nhận 2 số Version khác nhau, không trùng"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-841",
        "ref": [
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Toàn vẹn dữ liệu và thao tác lặp",
        "subcategory": "Mất kết nối khi lưu",
        "priority": 1,
        "auto": "No",
        "text": "Verify ngắt mạng khi bấm \"Lưu thay đổi\" thì hiện \"Thao tác chưa thực hiện được, vui lòng thử lại\""
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-842",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Toàn vẹn dữ liệu và thao tác lặp",
        "subcategory": "Mất kết nối khi lưu",
        "priority": 1,
        "auto": "No",
        "text": "Verify sau lỗi mất kết nối khi lưu, dữ liệu dự án không đổi"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-843",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-014"
        ],
        "category": "Toàn vẹn dữ liệu và thao tác lặp",
        "subcategory": "Mất kết nối khi lưu",
        "priority": 1,
        "auto": "No",
        "text": "Verify sau lỗi mất kết nối, bật mạng, bấm lại thì thao tác được ghi đúng một lần"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-844",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-016",
          "E-quan-ly-du-an-kinh-doanh-037"
        ],
        "category": "Toàn vẹn dữ liệu và thao tác lặp",
        "subcategory": "Ghi nhận tra soát",
        "priority": 2,
        "auto": "No",
        "text": "Verify mỗi lần ghi không trọn vẹn được ghi nhận tra soát đủ người, thời điểm, dự án, thao tác"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-845",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Toàn vẹn dữ liệu và thao tác lặp",
        "subcategory": "Ghi nhận tra soát",
        "priority": 2,
        "auto": "No",
        "text": "Verify thao tác bị từ chối do dữ liệu vừa đổi được ghi nhận tra soát đủ người, thời điểm, dự án, thao tác"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-846",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-016"
        ],
        "category": "Toàn vẹn dữ liệu và thao tác lặp",
        "subcategory": "Ghi nhận tra soát",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify các tình huống bị từ chối, ghi không trọn vẹn không tạo dòng mới trong tab Lịch sử của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-847",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-011"
        ],
        "category": "Lưu trữ",
        "subcategory": "Lịch sử đầy đủ",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify dự án đã qua nhiều thao tác vẫn có dòng \"Tạo dự án\" ở cuối tab Lịch sử"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-848",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "No",
        "text": "Verify dùng phím Tab di chuyển lần lượt qua bộ lọc Năm, Khối, Tìm kiếm, Trạng thái, nút \"Xuất Excel\" theo thứ tự hiển thị"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-849",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "No",
        "text": "Verify các nút \"Cấp mã dự án\", \"Lưu thay đổi\", \"Lưu & xác nhận đã ký\" kích hoạt được bằng phím Enter khi đang được focus"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-850",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "No",
        "text": "Verify mỗi ô nhập ở màn tạo dự án, P-01, P-03 có nhãn hiển thị gắn với ô"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-851",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "No",
        "text": "Verify khi mở hộp xác nhận (Xoá, Kết thúc, Từ chối mã) focus chuyển vào trong hộp"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-852",
        "ref": [],
        "category": "Accessibility cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "No",
        "text": "Verify lỗi nhập liệu có dòng chữ dưới ô, không chỉ thể hiện bằng màu đỏ"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-853",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Responsive cơ bản (Desktop Chrome)",
        "subcategory": "Cửa sổ hẹp và rộng",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify thu hẹp cửa sổ trình duyệt, bảng danh sách cuộn ngang trong khung, trang không vỡ layout"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-854",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Responsive cơ bản (Desktop Chrome)",
        "subcategory": "Cửa sổ hẹp và rộng",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify cửa sổ hẹp, lưới Thông tin chi tiết hiển thị 1 cột"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-855",
        "ref": [
          "NFR-quan-ly-du-an-kinh-doanh-003"
        ],
        "category": "Responsive cơ bản (Desktop Chrome)",
        "subcategory": "Cửa sổ hẹp và rộng",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify cửa sổ rộng, lưới Thông tin chi tiết hiển thị 2 cột"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-856",
        "ref": [],
        "category": "Responsive cơ bản (Desktop Chrome)",
        "subcategory": "Cửa sổ hẹp và rộng",
        "priority": 3,
        "auto": "No",
        "text": "Verify cửa sổ hẹp, popup P-03 vẫn cuộn được tới nút lưu"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-857",
        "ref": [],
        "category": "Loading và mạng chậm",
        "subcategory": "Trạng thái đang tải",
        "priority": 3,
        "auto": "No",
        "text": "Verify mạng chậm, màn Danh sách dự án cho người dùng thấy đang tải trước khi dữ liệu xuất hiện"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-858",
        "ref": [],
        "category": "Loading và mạng chậm",
        "subcategory": "Trạng thái đang tải",
        "priority": 3,
        "auto": "No",
        "text": "Verify mạng chậm, màn chi tiết không hiện dữ liệu của dự án trước đó trong lúc tải dự án mới"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-859",
        "ref": [],
        "category": "Edge cases điều hướng",
        "subcategory": "Back và refresh",
        "priority": 3,
        "auto": "Yes",
        "text": "Verify nút Back của trình duyệt ở màn chi tiết quay về màn Danh sách dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-860",
        "ref": [],
        "category": "Edge cases điều hướng",
        "subcategory": "Back và refresh",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tải lại trang (F5) ở màn chi tiết hiển thị dữ liệu mới nhất của dự án"
      },
      {
        "chk": "CHK-quan-ly-du-an-kinh-doanh-861",
        "ref": [],
        "category": "Edge cases điều hướng",
        "subcategory": "Back và refresh",
        "priority": 2,
        "auto": "Yes",
        "text": "Verify tải lại trang khi đang ở chế độ sửa thì thay đổi chưa lưu không được ghi (Version giữ nguyên)"
      }
    ]
  }
];
