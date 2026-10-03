window.FEATURE = "phuong-an-kinh-doanh";
window.UPDATED = "2026-10-03";
window.CHECKLISTS_DATA = [
 {
  "scope": "uc",
  "target": "uc-xem-pakd",
  "file": "checklist-uc-xem-pakd.md",
  "items": [
   {
    "chk": "CHK-phuong-an-kinh-doanh-001",
    "ref": [
     "FR-phuong-an-kinh-doanh-001",
     "BR-phuong-an-kinh-doanh-001"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò được xem",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở chi tiết dự án thuộc khối mình (trạng thái khác \"Chờ duyệt mã\") thấy khung PAKD trong tab \"Thông tin dự án\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-002",
    "ref": [
     "FR-phuong-an-kinh-doanh-001",
     "BR-phuong-an-kinh-doanh-001"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò được xem",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify GĐK mở chi tiết dự án thuộc khối mình thấy khung PAKD trong tab \"Thông tin dự án\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-003",
    "ref": [
     "FR-phuong-an-kinh-doanh-001",
     "BR-phuong-an-kinh-doanh-001"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò được xem",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán (CFO) mở chi tiết dự án của một khối bất kỳ thấy khung PAKD",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-004",
    "ref": [
     "FR-phuong-an-kinh-doanh-001"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò được xem",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dòng meta đầu trang có mục \"PAKD\" khi SM xem dự án khối mình"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-005",
    "ref": [
     "FR-phuong-an-kinh-doanh-001"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò được xem",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify khung PAKD vẫn hiển thị khi SM đang ở chế độ sửa thông tin cơ bản của dự án"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-006",
    "ref": [
     "FR-phuong-an-kinh-doanh-001",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò bị chặn",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM mở chi tiết dự án thấy khung \"Phương án kinh doanh (PAKD)\" chỉ có dòng 🔒 \"PAKD của dự án chỉ hiển thị với Giám đốc kinh doanh (SM), Giám đốc khối và Kế toán duyệt.\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-007",
    "ref": [
     "FR-phuong-an-kinh-doanh-001",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò bị chặn",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM mở chi tiết dự án thì dòng meta đầu trang không có mục \"PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-008",
    "ref": [
     "FR-phuong-an-kinh-doanh-001",
     "BR-phuong-an-kinh-doanh-001",
     "E-phuong-an-kinh-doanh-018"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò bị chặn",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở dự án thuộc khối khác bằng đường dẫn trực tiếp bị từ chối với câu \"Bạn không có quyền thực hiện thao tác này.\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-009",
    "ref": [
     "FR-phuong-an-kinh-doanh-001",
     "BR-phuong-an-kinh-doanh-001"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò bị chặn",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify GĐK mở dự án thuộc khối khác bằng đường dẫn trực tiếp bị từ chối với câu \"Bạn không có quyền thực hiện thao tác này.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-010",
    "ref": [
     "BR-phuong-an-kinh-doanh-001"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò bị chặn",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM khối A xem danh sách dự án không thấy dự án thuộc khối B",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-011",
    "ref": [
     "FR-phuong-an-kinh-doanh-001"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò bị chặn",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án trạng thái \"Chờ duyệt mã\" không hiển thị khung PAKD trên màn chi tiết"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-012",
    "ref": [
     "FR-phuong-an-kinh-doanh-001"
    ],
    "category": "Mở màn chi tiết — quyền xem khung PAKD",
    "subcategory": "Vai trò bị chặn",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify khi chuyển sang tab \"Lịch sử\" của màn chi tiết thì khung PAKD không hiển thị"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-013",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Thứ tự nguồn nội dung",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án \"Đang thực hiện\" có bản điều chỉnh nháp thì khung hiển thị nội dung bản điều chỉnh thay vì PAKD đang áp dụng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-014",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Thứ tự nguồn nội dung",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án \"Chưa có PAKD\" đã Lưu nháp PAKD thì mở lại màn chi tiết khung hiển thị đúng nội dung đã lưu",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-015",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Thứ tự nguồn nội dung",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án chưa từng lưu PAKD thì khung hiển thị form trống mặc định"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-016",
    "ref": [
     "FR-phuong-an-kinh-doanh-003"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Nạp lại khi dữ liệu dự án đổi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify đang nhập dở khung PAKD của dự án A, chuyển sang dự án B thì khung hiển thị nội dung PAKD của dự án B"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-017",
    "ref": [
     "FR-phuong-an-kinh-doanh-003"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Nạp lại khi dữ liệu dự án đổi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify quay lại dự án A sau khi chuyển dự án thì phần đang sửa chưa lưu của dự án A không còn"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-018",
    "ref": [
     "FR-phuong-an-kinh-doanh-003",
     "E-phuong-an-kinh-doanh-024"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Nạp lại khi dữ liệu dự án đổi",
    "priority": 1,
    "auto": "No",
    "text": "Verify SM đang mở khung dự án, người khác lưu P-03 thì khung của SM tự nạp lại theo dữ liệu mới, phần đang sửa chưa lưu bị bỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-019",
    "ref": [
     "FR-phuong-an-kinh-doanh-003",
     "E-phuong-an-kinh-doanh-024"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Nạp lại khi dữ liệu dự án đổi",
    "priority": 2,
    "auto": "No",
    "text": "Verify khung tự nạp lại do người khác thay đổi dự án thì hiện thông báo \"Dữ liệu dự án vừa thay đổi — khung PAKD đã được tải lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-020",
    "ref": [
     "FR-phuong-an-kinh-doanh-003"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Nạp lại khi dữ liệu dự án đổi",
    "priority": 2,
    "auto": "No",
    "text": "Verify SM đang mở khung dự án \"Chưa có PAKD\", GĐK cùng khối Lưu nháp PAKD thì khung của SM tự nạp lại theo nội dung GĐK vừa lưu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-021",
    "ref": [
     "FR-phuong-an-kinh-doanh-003"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Nạp lại khi dữ liệu dự án đổi",
    "priority": 3,
    "auto": "No",
    "text": "Verify SM đang mở khung dự án \"PAKD chờ duyệt\", Kế toán Duyệt PAKD thì khung của SM tự nạp lại với nhãn \"Đã duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-022",
    "ref": [
     "FR-phuong-an-kinh-doanh-003",
     "E-phuong-an-kinh-doanh-024"
    ],
    "category": "Nạp nội dung khung",
    "subcategory": "Nạp lại khi dữ liệu dự án đổi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM tự bấm Lưu nháp thì không hiện thông báo \"Dữ liệu dự án vừa thay đổi — khung PAKD đã được tải lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-023",
    "ref": [
     "FR-phuong-an-kinh-doanh-004"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Người lập · Hạn lập PAKD",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify ô \"Người lập\" hiển thị người lưu PAKD gần nhất của dự án \"Chưa có PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-024",
    "ref": [
     "FR-phuong-an-kinh-doanh-004"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Người lập · Hạn lập PAKD",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify khi dự án có bản điều chỉnh nháp thì ô \"Người lập\" hiển thị người lưu bản điều chỉnh"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-025",
    "ref": [
     "FR-phuong-an-kinh-doanh-004"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Người lập · Hạn lập PAKD",
    "priority": 4,
    "auto": "Yes",
    "text": "Verify PAKD chưa có người lưu nhưng đã có phiên bản thì ô \"Người lập\" hiển thị người nộp phiên bản mới nhất"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-026",
    "ref": [
     "FR-phuong-an-kinh-doanh-004"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Người lập · Hạn lập PAKD",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án chưa có lần lưu PAKD nào và chưa có phiên bản thì ô \"Người lập\" hiển thị tài khoản đang đăng nhập"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-027",
    "ref": [
     "FR-phuong-an-kinh-doanh-004"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Người lập · Hạn lập PAKD",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify ô \"Hạn lập PAKD\" hiển thị dạng dd/mm/yyyy cho dự án đã được đặt hạn"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-028",
    "ref": [
     "FR-phuong-an-kinh-doanh-004"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Người lập · Hạn lập PAKD",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án chưa có hạn lập thì ô \"Hạn lập PAKD\" hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-029",
    "ref": [
     "FR-phuong-an-kinh-doanh-004",
     "BR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Thời gian còn lại",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Hạn lập PAKD sau hôm nay 5 ngày thì \"Thời gian còn lại\" hiển thị \"Còn 5 ngày\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-030",
    "ref": [
     "BR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Thời gian còn lại",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Hạn lập PAKD đúng hôm nay thì \"Thời gian còn lại\" hiển thị \"Hết hạn hôm nay\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-031",
    "ref": [
     "BR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Thời gian còn lại",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Hạn lập PAKD trước hôm nay 2 ngày thì \"Thời gian còn lại\" hiển thị \"Quá hạn 2 ngày\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-032",
    "ref": [
     "BR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Thời gian còn lại",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án không có Hạn lập PAKD thì \"Thời gian còn lại\" hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-033",
    "ref": [
     "BR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Thời gian còn lại",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify phiên bản mới nhất \"Chờ CFO\" thì \"Thời gian còn lại\" hiển thị \"Đã nộp\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-034",
    "ref": [
     "BR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Thời gian còn lại",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án đã có phiên bản \"Đã duyệt\" thì \"Thời gian còn lại\" hiển thị \"Đã nộp\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-035",
    "ref": [
     "BR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Thời gian còn lại",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án bị Kế toán từ chối PAKD lần đầu thì \"Thời gian còn lại\" đếm tiếp theo hạn gốc (\"Còn n ngày\"), không hiển thị \"Đã nộp\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-036",
    "ref": [
     "BR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Thời gian còn lại",
    "priority": 3,
    "auto": "No",
    "text": "Verify còn 3 ngày tới hạn và chưa nộp thì \"Thời gian còn lại\" hiển thị chữ đỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-037",
    "ref": [
     "BR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Thời gian còn lại",
    "priority": 3,
    "auto": "No",
    "text": "Verify còn 4 ngày tới hạn thì \"Thời gian còn lại\" không tô đỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-038",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify phiên bản mới nhất là bản điều chỉnh \"Chờ CFO\" số V2 thì nhãn hiển thị \"Chờ duyệt V2\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-039",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh mới nhất bị Kế toán từ chối và chưa huỷ thì nhãn hiển thị \"Điều chỉnh bị từ chối\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-040",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án \"Đang thực hiện\" SM vừa bấm \"Sửa PAKD\" thì nhãn hiển thị \"Đang điều chỉnh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-041",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Đang thực hiện\" có bản điều chỉnh nháp (không mở sửa) thì nhãn hiển thị \"Đang điều chỉnh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-042",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án chưa có phiên bản nào (kể cả đã Lưu nháp) thì nhãn hiển thị \"Chưa có PAKD\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-043",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify phiên bản lần đầu mới nhất \"Chờ CFO\" thì nhãn hiển thị \"Đã có PAKD · chờ Kế toán duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-044",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify phiên bản mới nhất \"Đã duyệt\" thì nhãn hiển thị \"Đã duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-045",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án \"Chưa có PAKD\" sau khi bị Kế toán từ chối thì nhãn hiển thị \"Từ chối — làm lại\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-046",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Đang thực hiện\" sau khi huỷ bản điều chỉnh bị từ chối thì nhãn hiển thị \"Đã duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-047",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án \"Pending\" có phiên bản mới nhất bị từ chối thì nhãn hiển thị tên trạng thái phiên bản \"Từ chối\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-048",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 3,
    "auto": "No",
    "text": "Verify nhãn \"Đã duyệt\" hiển thị màu xanh lá"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-049",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 3,
    "auto": "No",
    "text": "Verify nhãn \"Chờ duyệt V2\" và nhãn \"Đã có PAKD · chờ Kế toán duyệt\" hiển thị màu vàng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-050",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 3,
    "auto": "No",
    "text": "Verify nhãn \"Từ chối — làm lại\" và nhãn \"Điều chỉnh bị từ chối\" hiển thị màu đỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-051",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 3,
    "auto": "No",
    "text": "Verify nhãn \"Đang điều chỉnh\" hiển thị màu xanh dương"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-052",
    "ref": [
     "FR-phuong-an-kinh-doanh-005"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Nhãn \"Trạng thái PAKD\"",
    "priority": 4,
    "auto": "No",
    "text": "Verify nhãn \"Chưa có PAKD\" hiển thị màu xám"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-053",
    "ref": [
     "FR-phuong-an-kinh-doanh-006",
     "BR-phuong-an-kinh-doanh-002"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Quyền nhập — chỉ xem",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM của khối dự án mở dự án \"Chưa có PAKD\" thì các ô Mục 1–4 nhập được"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-054",
    "ref": [
     "FR-phuong-an-kinh-doanh-006"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Quyền nhập — chỉ xem",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán mở dự án \"Chưa có PAKD\" thì toàn bộ khung ở chế độ chỉ xem",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-055",
    "ref": [
     "FR-phuong-an-kinh-doanh-006"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Quyền nhập — chỉ xem",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"PAKD chờ duyệt\" thì toàn bộ khung ở chế độ chỉ xem",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-056",
    "ref": [
     "FR-phuong-an-kinh-doanh-006"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Quyền nhập — chỉ xem",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Pending\" thì toàn bộ khung ở chế độ chỉ xem"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-057",
    "ref": [
     "FR-phuong-an-kinh-doanh-006"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Quyền nhập — chỉ xem",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Kết thúc\" thì toàn bộ khung ở chế độ chỉ xem"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-058",
    "ref": [
     "FR-phuong-an-kinh-doanh-006"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Quyền nhập — chỉ xem",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Đang thực hiện\" chưa bấm \"Sửa PAKD\" thì khung ở chế độ chỉ xem"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-059",
    "ref": [
     "FR-phuong-an-kinh-doanh-006"
    ],
    "category": "Hàng thông tin đầu khung",
    "subcategory": "Quyền nhập — chỉ xem",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify ở chế độ chỉ xem các nút Thêm dòng, Xoá dòng, Đính kèm, Chia đều đều không dùng được"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-060",
    "ref": [
     "FR-phuong-an-kinh-doanh-007"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Tiêu đề khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án \"Chưa có PAKD\" có tiêu đề khung \"Lập phương án kinh doanh (PAKD)\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-061",
    "ref": [
     "FR-phuong-an-kinh-doanh-007"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Tiêu đề khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án có bản điều chỉnh \"Chờ CFO\" có tiêu đề khung \"Phương án kinh doanh (PAKD) — điều chỉnh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-062",
    "ref": [
     "FR-phuong-an-kinh-doanh-020",
     "BR-phuong-an-kinh-doanh-040"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Dòng hướng dẫn chân khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Chưa có PAKD\" thấy chân khung \"SM / GĐK nhập PAKD trong 30 ngày kể từ ngày GĐK duyệt → Gửi Kế toán (CFO) duyệt. Quá hạn chưa được duyệt → dự án Pending.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-063",
    "ref": [
     "BR-phuong-an-kinh-doanh-040"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Dòng hướng dẫn chân khung",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Kế toán mở dự án \"Chưa có PAKD\" thấy chân khung \"Đang chờ SM / GĐK lập PAKD.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-064",
    "ref": [
     "BR-phuong-an-kinh-doanh-040"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Dòng hướng dẫn chân khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án \"PAKD chờ duyệt\" có chân khung \"PAKD đã gửi duyệt — chỉ xem.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-065",
    "ref": [
     "BR-phuong-an-kinh-doanh-040"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Dòng hướng dẫn chân khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Đang thực hiện\" không có bản chờ thấy chân khung \"PAKD đã được duyệt. Bấm \"Sửa PAKD\" để điều chỉnh — gửi Kế toán duyệt lại, duyệt xong sinh phiên bản mới.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-066",
    "ref": [
     "BR-phuong-an-kinh-doanh-040"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Dòng hướng dẫn chân khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Kế toán mở dự án \"Đang thực hiện\" thấy chân khung \"PAKD đã được duyệt — chỉ Giám đốc khối / Giám đốc kinh doanh (SM) được sửa PAKD.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-067",
    "ref": [
     "BR-phuong-an-kinh-doanh-040"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Dòng hướng dẫn chân khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án có bản điều chỉnh chờ duyệt có chân khung \"Bản điều chỉnh đang chờ Kế toán (CFO) duyệt — chỉ xem.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-068",
    "ref": [
     "BR-phuong-an-kinh-doanh-040"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Dòng hướng dẫn chân khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án \"Pending\" có chân khung \"Dự án Pending (quá hạn PAKD) — Kế toán mở lại để tiếp tục.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-069",
    "ref": [
     "BR-phuong-an-kinh-doanh-040"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Dòng hướng dẫn chân khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án \"Kết thúc\" có chân khung \"Dự án đã kết thúc — PAKD chỉ xem.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-070",
    "ref": [
     "FR-phuong-an-kinh-doanh-020"
    ],
    "category": "Tiêu đề khung và chân khung",
    "subcategory": "Dòng hướng dẫn chân khung",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify sau khi Lưu nháp PAKD, chân khung có thêm \"· Lưu lần cuối dd/mm/yyyy bởi {người}\" với ngày hôm nay và người vừa lưu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-071",
    "ref": [
     "FR-phuong-an-kinh-doanh-008",
     "BR-phuong-an-kinh-doanh-006"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify tình trạng Đã ký, Giá trị hợp đồng 1,000,000,000 thì ô \"Doanh thu kế hoạch\" hiển thị 1,000,000,000 kèm ghi chú \"VNĐ · theo hợp đồng đã ký\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-072",
    "ref": [
     "FR-phuong-an-kinh-doanh-008",
     "BR-phuong-an-kinh-doanh-006"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify tình trạng Chưa ký, Giá trị hợp đồng dự kiến 800,000,000 thì \"Doanh thu kế hoạch\" hiển thị 800,000,000 kèm ghi chú \"VNĐ · theo giá trị dự kiến\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-073",
    "ref": [
     "FR-phuong-an-kinh-doanh-008",
     "BR-phuong-an-kinh-doanh-006"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tình trạng Chưa ký chưa nhập Giá trị dự kiến thì \"Doanh thu kế hoạch\" bằng 0 kèm ghi chú \"VNĐ · ước tính, chưa có hợp đồng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-074",
    "ref": [
     "FR-phuong-an-kinh-doanh-008",
     "BR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Doanh thu kế hoạch 1,000,000,000, tổng chi phí 700,000,000 thì ô \"Lợi nhuận\" hiển thị 300,000,000 kèm ghi chú \"Doanh thu kế hoạch − tổng chi phí\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-075",
    "ref": [
     "FR-phuong-an-kinh-doanh-008"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 3,
    "auto": "No",
    "text": "Verify Lợi nhuận âm thì ô \"Lợi nhuận\" tô đỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-076",
    "ref": [
     "FR-phuong-an-kinh-doanh-008",
     "BR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Lợi nhuận 300,000,000 trên Doanh thu 1,000,000,000 thì \"Biên lợi nhuận\" hiển thị \"30.0%\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-077",
    "ref": [
     "FR-phuong-an-kinh-doanh-008",
     "BR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Biên lợi nhuận đúng 20.0% thì hiển thị nhãn \"▲ Đạt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-078",
    "ref": [
     "FR-phuong-an-kinh-doanh-008",
     "BR-phuong-an-kinh-doanh-009",
     "E-phuong-an-kinh-doanh-016"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Biên lợi nhuận 19.9% thì hiển thị nhãn \"! Dưới khung\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-079",
    "ref": [
     "FR-phuong-an-kinh-doanh-008",
     "BR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify chưa có doanh thu thì \"Biên lợi nhuận\" hiển thị \"—\" và không có nhãn"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-080",
    "ref": [
     "FR-phuong-an-kinh-doanh-008"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô \"Biên lợi nhuận\" có ghi chú \"Khung tối thiểu 20.0%\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-081",
    "ref": [
     "BR-phuong-an-kinh-doanh-007"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify tình trạng Đã ký có khoản mục ở cả 6 nhóm thì tổng chi phí bằng tổng kế hoạch tháng của mọi khoản mục"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-082",
    "ref": [
     "BR-phuong-an-kinh-doanh-007"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tình trạng Đã ký còn dòng giai đoạn cũ có số thì tổng chi phí không cộng bảng giai đoạn"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-083",
    "ref": [
     "BR-phuong-an-kinh-doanh-007"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify tình trạng Chưa ký, 2 giai đoạn SX 100,000,000 và KD 50,000,000 mỗi giai đoạn thì tổng chi phí là 300,000,000"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-084",
    "ref": [
     "BR-phuong-an-kinh-doanh-007"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "3 ô chỉ số",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tình trạng Chưa ký còn khoản mục chi phí theo tháng cũ có số thì tổng chi phí không cộng bảng khoản mục"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-085",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tình trạng Đã ký biểu đồ có tiêu đề \"Luỹ kế dòng tiền (LKDT = Dòng thu − Dòng chi + Số dư kỳ trước)\" và đủ 3 chuỗi \"Dòng thu\", \"Dòng chi\", \"Luỹ kế dòng tiền\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-086",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tình trạng Chưa ký biểu đồ có tiêu đề \"Dòng tiền chi của dự án theo tháng\" và đủ 2 cột \"Sản xuất\", \"Kinh doanh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-087",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify trục tháng của biểu đồ chạy từ tháng đầu đến tháng cuối có số liệu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-088",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify trục tiền dùng nhãn \"x tỷ\" khi giá trị từ 1 tỷ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-089",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify trục tiền dùng nhãn \"x tr\" khi giá trị từ 1 triệu tới dưới 1 tỷ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-090",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 4,
    "auto": "No",
    "text": "Verify vạch chia trục tiền theo bước 1 · 2 · 2,5 · 5 × 10ⁿ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-091",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify rê chuột lên một tháng hiển thị \"Tháng MM/YYYY\" kèm số của từng chuỗi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-092",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 4,
    "auto": "Yes",
    "text": "Verify biểu đồ có chú thích \"ĐVT: VNĐ\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-093",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify tình trạng Đã ký chưa có số thì biểu đồ hiển thị \"Nhập mốc nghiệm thu (thời điểm, %) và chi phí (thời điểm, giá trị) để xem luỹ kế dòng tiền.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-094",
    "ref": [
     "FR-phuong-an-kinh-doanh-009"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify tình trạng Chưa ký chưa có số thì biểu đồ hiển thị \"Nhập mốc kế hoạch (từ – đến, tổng mức đầu tư) để xem dòng tiền chi theo tháng.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-095",
    "ref": [
     "BR-phuong-an-kinh-doanh-013"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Đã ký có mốc Giá trị thu đợt 270,000,000 với Tháng thu tiền 04/2027 thì cột \"Dòng thu\" tháng 04/2027 bằng 270,000,000"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-096",
    "ref": [
     "BR-phuong-an-kinh-doanh-013",
     "BR-phuong-an-kinh-doanh-015"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Đã ký có chi phí khối A 40,000,000 và khối B 10,000,000 trong tháng 03/2027 thì cột \"Dòng chi\" tháng 03/2027 bằng 50,000,000"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-097",
    "ref": [
     "BR-phuong-an-kinh-doanh-013"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify mốc không có Thời điểm nhưng có Thời gian gửi hồ sơ vẫn sinh \"Dòng thu\" ở tháng thu tiền"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-098",
    "ref": [
     "BR-phuong-an-kinh-doanh-013"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô tháng chi phí giá trị 0 không làm xuất hiện tháng đó trên trục biểu đồ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-099",
    "ref": [
     "BR-phuong-an-kinh-doanh-015"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify \"Luỹ kế dòng tiền\" tháng 2 bằng Dòng thu tháng 2 trừ Dòng chi tháng 2 cộng Luỹ kế tháng 1",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-100",
    "ref": [
     "BR-phuong-an-kinh-doanh-015"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tháng trống nằm giữa dải có số thì \"Luỹ kế dòng tiền\" giữ bằng luỹ kế tháng trước"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-101",
    "ref": [
     "BR-phuong-an-kinh-doanh-014"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Chưa ký giai đoạn SX 9,000,000 từ 01/2027 đến 03/2027 thì cột \"Sản xuất\" mỗi tháng 01–03/2027 bằng 3,000,000"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-102",
    "ref": [
     "BR-phuong-an-kinh-doanh-014"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 3,
    "auto": "No",
    "text": "Verify Chưa ký giai đoạn SX 10,000,000 chia 3 tháng thì tổng kế hoạch 3 tháng đúng 10,000,000 (chia chính xác, không làm tròn nghìn)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-103",
    "ref": [
     "BR-phuong-an-kinh-doanh-014"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Chưa ký giai đoạn để trống \"Đến\" thì toàn bộ chi phí giai đoạn rơi vào tháng \"Từ\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-104",
    "ref": [
     "BR-phuong-an-kinh-doanh-014"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Chưa ký biểu đồ không có chuỗi doanh thu, chỉ có chi \"Sản xuất\" và \"Kinh doanh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-105",
    "ref": [
     "BR-phuong-an-kinh-doanh-014"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Biểu đồ dòng tiền",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Chưa ký giai đoạn thiếu \"Từ\" không sinh tháng nào trên biểu đồ nhưng vẫn được cộng vào tổng chi phí"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-106",
    "ref": [
     "FR-phuong-an-kinh-doanh-010"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Tóm tắt chi phí",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tình trạng Đã ký có bảng tóm tắt cột \"Nhóm chi phí · Số tiền (VNĐ) · % doanh thu\" đủ 6 nhóm và dòng \"TỔNG CHI PHÍ\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-107",
    "ref": [
     "FR-phuong-an-kinh-doanh-010"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Tóm tắt chi phí",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify nhóm Sản xuất 200,000,000 với Doanh thu 1,000,000,000 thì cột \"% doanh thu\" hiển thị \"20.0%\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-108",
    "ref": [
     "FR-phuong-an-kinh-doanh-010"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Tóm tắt chi phí",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Đã ký chưa có doanh thu thì cột \"% doanh thu\" hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-109",
    "ref": [
     "FR-phuong-an-kinh-doanh-010"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Tóm tắt chi phí",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tình trạng Chưa ký có bảng theo tháng cột \"Tháng · Sản xuất · %/Tổng SX · Kinh doanh · %/Tổng KD · %/Tổng mức đầu tư\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-110",
    "ref": [
     "FR-phuong-an-kinh-doanh-010"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Tóm tắt chi phí",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Chưa ký chưa có tháng nào thì bảng tóm tắt hiển thị \"Chưa có mốc kế hoạch.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-111",
    "ref": [
     "FR-phuong-an-kinh-doanh-010"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Tóm tắt chi phí",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Chưa ký dòng \"TỔNG CHI PHÍ\" hiển thị Σ Sản xuất, Σ Kinh doanh và \"100%\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-112",
    "ref": [
     "FR-phuong-an-kinh-doanh-010"
    ],
    "category": "Chỉ số, biểu đồ, tóm tắt chi phí",
    "subcategory": "Tóm tắt chi phí",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Chưa ký tổng chi phí bằng 0 thì cột tổng % của dòng \"TỔNG CHI PHÍ\" hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-113",
    "ref": [
     "FR-phuong-an-kinh-doanh-018"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Đối chiếu giá trị hợp đồng — Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, dự án đã có hợp đồng thì mục hiển thị \"Đối chiếu: giá trị hợp đồng {giá trị HĐ của dự án} so với doanh thu PAKD {doanh thu}. Cảnh báo nếu lệch quá 2.0%\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-114",
    "ref": [
     "FR-phuong-an-kinh-doanh-018",
     "BR-phuong-an-kinh-doanh-018",
     "E-phuong-an-kinh-doanh-015"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Đối chiếu giá trị hợp đồng — Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify giá trị HĐ dự án lệch doanh thu PAKD 2,01% thì dòng đối chiếu có thêm \"— đang lệch {z%}\" và biểu tượng ⚠",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-115",
    "ref": [
     "BR-phuong-an-kinh-doanh-018"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Đối chiếu giá trị hợp đồng — Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify giá trị HĐ dự án lệch doanh thu PAKD đúng 2% thì không có \"— đang lệch\" và không có ⚠",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-116",
    "ref": [
     "BR-phuong-an-kinh-doanh-018"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Đối chiếu giá trị hợp đồng — Đã ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify giá trị HĐ 1,020,000,001 so với doanh thu 1,000,000,000 vẫn cảnh báo lệch (tính trên giá trị chưa làm tròn)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-117",
    "ref": [
     "FR-phuong-an-kinh-doanh-018",
     "BR-phuong-an-kinh-doanh-018"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Đối chiếu giá trị hợp đồng — Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, dự án chưa có hợp đồng thì phần giá trị đối chiếu hiển thị \"—\" và không cảnh báo"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-118",
    "ref": [
     "FR-phuong-an-kinh-doanh-018",
     "BR-phuong-an-kinh-doanh-018"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Đối chiếu giá trị hợp đồng — Đã ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Đã ký, doanh thu PAKD bằng 0 thì phần đối chiếu hiển thị \"—\" và không cảnh báo"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-119",
    "ref": [
     "FR-phuong-an-kinh-doanh-018",
     "BR-phuong-an-kinh-doanh-018"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Đối chiếu giá trị hợp đồng — Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án có bản điều chỉnh chờ duyệt với doanh thu khác bản đã duyệt thì dòng đối chiếu dùng doanh thu của bản điều chỉnh đang hiển thị"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-120",
    "ref": [
     "E-phuong-an-kinh-doanh-015"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Đối chiếu giá trị hợp đồng — Đã ký",
    "priority": 3,
    "auto": "No",
    "text": "Verify phần chữ \"— đang lệch {z%}\" và biểu tượng ⚠ hiển thị màu cam"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-121",
    "ref": [
     "FR-phuong-an-kinh-doanh-018"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Nhắc cập nhật — Chưa ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Chưa ký có Thời điểm dự kiến ký 05/2027 thì mục hiển thị \"Nhắc cập nhật thông tin hợp đồng từ 01/05/2027. Cảnh báo nếu quá tháng dự kiến ký 05/2027.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-122",
    "ref": [
     "FR-phuong-an-kinh-doanh-018"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Nhắc cập nhật — Chưa ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Chưa ký chưa có Thời điểm dự kiến ký thì mục hiển thị \"PAKD tạm: cập nhật thông tin hợp đồng (giá trị, ngày ký) ngay khi có. Hệ thống nhắc định kỳ. Chưa tính vào Dự kiến ký còn lại của khối cho đến khi có ngày dự kiến ký.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-123",
    "ref": [
     "FR-phuong-an-kinh-doanh-018"
    ],
    "category": "Kế hoạch cập nhật thông tin hợp đồng",
    "subcategory": "Nhắc cập nhật — Chưa ký",
    "priority": 4,
    "auto": "Yes",
    "text": "Verify mục luôn có dòng \"Khi có hợp đồng ký, hệ thống đối chiếu giá trị ký với PAKD và cảnh báo nếu lệch; lập bản điều chỉnh PAKD khi cần.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-124",
    "ref": [
     "FR-phuong-an-kinh-doanh-033"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Phiên bản PAKD\" và meta",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án có phiên bản V1 \"Chờ CFO\" thì cột \"Phiên bản PAKD\" ở danh sách hiển thị \"V1, chờ CFO\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-125",
    "ref": [
     "FR-phuong-an-kinh-doanh-033"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Phiên bản PAKD\" và meta",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án có phiên bản V1 \"Đã duyệt\" thì mục meta \"PAKD\" trên màn chi tiết hiển thị \"V1, đã duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-126",
    "ref": [
     "FR-phuong-an-kinh-doanh-033"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Phiên bản PAKD\" và meta",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án có phiên bản V2 bị từ chối thì cột \"Phiên bản PAKD\" hiển thị \"V2, từ chối\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-127",
    "ref": [
     "FR-phuong-an-kinh-doanh-033"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Phiên bản PAKD\" và meta",
    "priority": 3,
    "auto": "No",
    "text": "Verify phiên bản bị từ chối hiển thị chữ đỏ ở cột danh sách, còn mục meta trên màn chi tiết không tô đỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-128",
    "ref": [
     "FR-phuong-an-kinh-doanh-033"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Phiên bản PAKD\" và meta",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án chưa có phiên bản thì cột \"Phiên bản PAKD\" và meta \"PAKD\" hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-129",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án \"Chờ duyệt mã\" có cột \"Hạn lập PAKD\" hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-130",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Pending\" có cột \"Hạn lập PAKD\" hiển thị \"Pending\" kèm ngày chuyển Pending"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-131",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án bị từ chối V1 lần đầu có dòng chính cột \"Hạn lập PAKD\" là \"Làm lại V1\" kèm \"Còn n ngày\" theo hạn gốc",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-132",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án bị từ chối V1 lần đầu có dòng phụ cột \"Hạn lập PAKD\" là \"V1 bị từ chối dd/mm/yyyy\" với ngày Kế toán từ chối"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-133",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án bị từ chối đã quá hạn gốc 4 ngày thì dòng chính hiển thị \"Làm lại V1\" kèm \"Quá hạn 4 ngày\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-134",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dự án \"Chưa có PAKD\" chưa có hạn thì cột hiển thị \"Chưa đặt hạn\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-135",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Chưa có PAKD\" còn 10 ngày thì cột hiển thị \"Còn 10 ngày\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-136",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 3,
    "auto": "No",
    "text": "Verify dự án \"Chưa có PAKD\" còn 3 ngày thì chữ \"Còn 3 ngày\" màu cam"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-137",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Chưa có PAKD\" hạn đúng hôm nay thì cột hiển thị \"Hết hạn hôm nay\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-138",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Chưa có PAKD\" quá hạn 2 ngày thì cột hiển thị \"Quá hạn 2 ngày\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-139",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 4,
    "auto": "Yes",
    "text": "Verify dự án ở trạng thái khác \"Chưa có PAKD\", \"Pending\", \"Chờ duyệt mã\" mà chưa có phiên bản PAKD nào thì cột hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-140",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify phiên bản hiển thị V1 \"Chờ CFO\" thì cột hiển thị \"Nộp V1\" kèm ngày nộp"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-141",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify phiên bản hiển thị \"Đã duyệt\" thì cột hiển thị \"Duyệt\" kèm ngày duyệt"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-142",
    "ref": [
     "FR-phuong-an-kinh-doanh-034"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Cột \"Hạn lập PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án \"Đang thực hiện\" có bản điều chỉnh bị từ chối chưa huỷ thì cột hiển thị \"Điều chỉnh bị từ chối dd/mm/yyyy\" với ngày Kế toán từ chối",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-143",
    "ref": [
     "FR-phuong-an-kinh-doanh-044",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Ẩn cột PAKD với AM",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM xem danh sách dự án không thấy 3 cột \"Hạn lập PAKD\", \"Phiên bản PAKD\", \"Giá trị hợp đồng dự kiến\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-144",
    "ref": [
     "FR-phuong-an-kinh-doanh-044",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Ẩn cột PAKD với AM",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM xem danh sách dự án thì dòng \"Tổng cộng\" không có ô Σ Giá trị hợp đồng dự kiến"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-145",
    "ref": [
     "FR-phuong-an-kinh-doanh-044",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Ẩn cột PAKD với AM",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM Xuất Excel danh sách thì file không có 3 cột \"Hạn lập PAKD\", \"Phiên bản PAKD\", \"Giá trị hợp đồng dự kiến\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-146",
    "ref": [
     "FR-phuong-an-kinh-doanh-044"
    ],
    "category": "Phiên bản và cột PAKD ở danh sách",
    "subcategory": "Ẩn cột PAKD với AM",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM xem danh sách dự án khối mình thấy đủ 3 cột \"Hạn lập PAKD\", \"Phiên bản PAKD\", \"Giá trị hợp đồng dự kiến\""
   }
  ]
 },
 {
  "scope": "uc",
  "target": "uc-lap-gui-pakd",
  "file": "checklist-uc-lap-gui-pakd.md",
  "items": [
   {
    "chk": "CHK-phuong-an-kinh-doanh-147",
    "ref": [
     "FR-phuong-an-kinh-doanh-035"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Link \"Thao tác\" và nút đầu trang",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM xem danh sách thấy link \"Lập PAKD\" ở cột \"Thao tác\" của dự án \"Chưa có PAKD\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-148",
    "ref": [
     "FR-phuong-an-kinh-doanh-035"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Link \"Thao tác\" và nút đầu trang",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Kế toán xem danh sách thấy link \"Xem\" ở cột \"Thao tác\" của dự án \"Chưa có PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-149",
    "ref": [
     "FR-phuong-an-kinh-doanh-035"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Link \"Thao tác\" và nút đầu trang",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm link \"Lập PAKD\" mở màn chi tiết của dự án"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-150",
    "ref": [
     "FR-phuong-an-kinh-doanh-020"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Link \"Thao tác\" và nút đầu trang",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Chưa có PAKD\" thấy 2 nút \"Lưu nháp\" · \"Gửi Kế toán duyệt\" ở đầu trang bên phải, trước nút Sửa",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-151",
    "ref": [
     "FR-phuong-an-kinh-doanh-020"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Link \"Thao tác\" và nút đầu trang",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM đang ở chế độ sửa thông tin cơ bản thì đầu trang không có nút \"Lưu nháp\" · \"Gửi Kế toán duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-152",
    "ref": [
     "FR-phuong-an-kinh-doanh-020"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Link \"Thao tác\" và nút đầu trang",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify SM chuyển sang tab \"Lịch sử\" thì nút \"Lưu nháp\" · \"Gửi Kế toán duyệt\" không hiển thị"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-153",
    "ref": [
     "FR-phuong-an-kinh-doanh-020",
     "BR-phuong-an-kinh-doanh-002"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Link \"Thao tác\" và nút đầu trang",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán mở dự án \"Chưa có PAKD\" không thấy nút \"Lưu nháp\" · \"Gửi Kế toán duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-154",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Dòng thông báo bước hiện tại",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Chưa có PAKD\" còn 10 ngày thấy dòng thông báo \"Dự án cần lập phương án kinh doanh (PAKD). Hạn lập: dd/mm/yyyy (còn 10 ngày) — nhập PAKD bên dưới rồi bấm Gửi Kế toán duyệt ở góc phải.\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-155",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Dòng thông báo bước hiện tại",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Chưa có PAKD\" đã quá hạn 3 ngày thấy phần hạn trên dòng thông báo là \"(quá hạn 3 ngày)\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-156",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Dòng thông báo bước hiện tại",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở dự án bị từ chối V1 thấy dòng thông báo bắt đầu \"PAKD V1 bị từ chối ({ý kiến}) — cần lập lại.\" kèm phần \"Hạn lập: dd/mm/yyyy\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-157",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Dòng thông báo bước hiện tại",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Kế toán mở dự án \"Chưa có PAKD\" thấy dòng thông báo \"Đang chờ SM / Giám đốc khối lập PAKD (hạn dd/mm/yyyy).\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-158",
    "ref": [
     "FR-phuong-an-kinh-doanh-036",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Truy cập lập PAKD",
    "subcategory": "Dòng thông báo bước hiện tại",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM mở dự án \"Chưa có PAKD\" thấy dòng thông báo \"Đang chờ SM / GĐK lập PAKD.\" không có hạn lập"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-159",
    "ref": [
     "BR-phuong-an-kinh-doanh-023"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Form trống mặc định",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify form trống Đã ký có đủ 4 mốc gợi ý \"Tạm ứng khi có hợp đồng\", \"Nghiệm thu giai đoạn 1\", \"Nghiệm thu giai đoạn 2\", \"Quyết toán, bảo hành\" với Tỷ lệ được thanh toán 100, Thời gian chờ 30, % bằng 0"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-160",
    "ref": [
     "BR-phuong-an-kinh-doanh-023"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Form trống mặc định",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify form trống Đã ký có đủ 8 khoản mục mẫu: khối A \"Chi phí lương\", \"Thuê ngoài / mua sắm\", \"Dự phòng\", \"Thưởng\" và khối B \"Chi phí lương\", \"Tiếp khách, công tác\", \"Dự phòng\", \"Thưởng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-161",
    "ref": [
     "BR-phuong-an-kinh-doanh-023"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Form trống mặc định",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify form trống Chưa ký có Xác suất thành công 50%"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-162",
    "ref": [
     "BR-phuong-an-kinh-doanh-023"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Form trống mặc định",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify form trống Chưa ký có 1 giai đoạn trống ở bảng Mốc kế hoạch"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-163",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án đã được đánh dấu \"đã ký\" mở form lần đầu thì Tình trạng dự án mặc định \"Đã ký\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-164",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án chưa ký mở form lần đầu thì Tình trạng dự án mặc định \"Chưa ký\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-165",
    "ref": [
     "FR-phuong-an-kinh-doanh-002",
     "FR-phuong-an-kinh-doanh-037"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án đã có hợp đồng (lưu P-03) mở form lần đầu thì Mục 1 nạp sẵn Số hợp đồng, Ngày ký trên hợp đồng, Ngày ký thực tế, Giá trị hợp đồng từ hợp đồng",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-166",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án chưa có hợp đồng mở form lần đầu thì giá trị điền sẵn bằng doanh thu dự kiến của dự án"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-167",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án có hợp đồng có thời hạn 03/2027 – 08/2027 thì Bắt đầu / Kết thúc điền sẵn 03/2027 / 08/2027"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-168",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án không có hợp đồng thì Bắt đầu / Kết thúc điền sẵn theo tháng của thời gian dự án"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-169",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án chưa ký có ngày dự kiến ký 15/05/2027 thì Thời điểm dự kiến ký điền sẵn 05/2027"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-170",
    "ref": [
     "FR-phuong-an-kinh-doanh-002",
     "BR-phuong-an-kinh-doanh-022"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, dự án có chi phí kế hoạch SX và KD > 0 thì Mục 4 có 2 dòng \"Chi phí sản xuất kế hoạch\" (Sản xuất) và \"Chi phí kinh doanh kế hoạch\" (Kinh doanh) thay 8 khoản mục mẫu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-171",
    "ref": [
     "BR-phuong-an-kinh-doanh-022",
     "BR-phuong-an-kinh-doanh-016"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, chi phí SX kế hoạch 12,000,000 trên thời hạn 3 tháng thì dòng \"Chi phí sản xuất kế hoạch\" có 4,000,000 mỗi tháng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-172",
    "ref": [
     "BR-phuong-an-kinh-doanh-022"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Đã ký, dự án chỉ có tháng bắt đầu thì chi phí kế hoạch điền sẵn nằm trọn trong 1 tháng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-173",
    "ref": [
     "BR-phuong-an-kinh-doanh-022",
     "BR-phuong-an-kinh-doanh-016"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Đã ký, dự án có chi phí kế hoạch nhưng không có thời hạn HĐ và thời gian dự án thì 2 dòng chi phí kế hoạch không có giá trị tháng nào"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-174",
    "ref": [
     "BR-phuong-an-kinh-doanh-022"
    ],
    "category": "Form trống mặc định và điền sẵn",
    "subcategory": "Điền sẵn từ dữ liệu dự án",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Chưa ký, dự án có chi phí kế hoạch thì bảng Mốc kế hoạch có 1 giai đoạn \"Toàn dự án\" với Từ / Đến và SX / KD theo dự án"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-175",
    "ref": [
     "FR-phuong-an-kinh-doanh-011"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Trường theo tình trạng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify tình trạng Đã ký Mục 1 có đủ Tình trạng dự án*, Số hợp đồng (gợi ý \"VD: HĐ-022/688/2026\"), Ngày ký trên hợp đồng, Ngày ký thực tế, Giá trị hợp đồng (VNĐ)*"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-176",
    "ref": [
     "FR-phuong-an-kinh-doanh-011"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Trường theo tình trạng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify tình trạng Chưa ký Mục 1 có đủ Thời điểm dự kiến ký*, Giá trị hợp đồng dự kiến (VNĐ)*, Xác suất thành công (%), Phạm vi công việc*, Đánh giá rủi ro*"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-177",
    "ref": [
     "FR-phuong-an-kinh-doanh-011",
     "BR-phuong-an-kinh-doanh-034"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Trường theo tình trạng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify nhập Xác suất thành công 150 thì ô tự về 100"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-178",
    "ref": [
     "BR-phuong-an-kinh-doanh-034"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Trường theo tình trạng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô số không nhận dấu âm (gõ \"-5\" vào Giá trị hợp đồng không ra số âm)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-179",
    "ref": [
     "BR-phuong-an-kinh-doanh-036"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Trường theo tình trạng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tình trạng Chưa ký không hiển thị Mục 2, Mục 3 nghiệm thu, Mục 4 kế hoạch chi phí theo tháng mà hiển thị bảng Mốc kế hoạch"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-180",
    "ref": [
     "FR-phuong-an-kinh-doanh-012",
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify đổi Chưa ký → Đã ký khi Giá trị hợp đồng trống thì Giá trị hợp đồng điền sẵn bằng Giá trị dự kiến"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-181",
    "ref": [
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify đổi Chưa ký → Đã ký khi Giá trị hợp đồng đã có thì giữ nguyên Giá trị hợp đồng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-182",
    "ref": [
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify đổi sang Đã ký khi Bắt đầu trống thì Bắt đầu điền tháng \"Từ\" sớm nhất của các giai đoạn"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-183",
    "ref": [
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify đổi sang Đã ký khi Kết thúc trống thì Kết thúc điền tháng \"Đến\" muộn nhất của các giai đoạn"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-184",
    "ref": [
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify giai đoạn muộn nhất không có \"Đến\" thì Kết thúc điền theo tháng \"Từ\" của giai đoạn đó"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-185",
    "ref": [
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify đổi sang Đã ký khi chưa có khoản mục nào có giá trị thì mỗi giai đoạn có \"Từ\" sinh 1 dòng nhóm \"Sản xuất\" và 1 dòng nhóm \"Kinh doanh\" mang tên giai đoạn, giá trị chia đều trên các tháng Từ → Đến",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-186",
    "ref": [
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify giai đoạn tên trống khi chuyển sang Đã ký sinh dòng tên \"Sản xuất\" và dòng tên \"Kinh doanh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-187",
    "ref": [
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify giai đoạn KD bằng 0 khi chuyển sang Đã ký không sinh dòng nhóm \"Kinh doanh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-188",
    "ref": [
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify đổi sang Đã ký khi đã có khoản mục có giá trị thì kế hoạch chi phí theo tháng giữ nguyên"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-189",
    "ref": [
     "BR-phuong-an-kinh-doanh-020"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify đổi sang Đã ký khi không giai đoạn nào có \"Từ\" thì kế hoạch chi phí giữ nguyên"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-190",
    "ref": [
     "FR-phuong-an-kinh-doanh-012"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify đang có dải lỗi đỏ, đổi sang Đã ký thì dải lỗi biến mất"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-191",
    "ref": [
     "FR-phuong-an-kinh-doanh-012"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Đổi tình trạng Chưa ký → Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify đổi Đã ký → Chưa ký thì dữ liệu đã nhập ở Mục 1 giữ nguyên"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-192",
    "ref": [
     "FR-phuong-an-kinh-doanh-012",
     "BR-phuong-an-kinh-doanh-021"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Khoá lựa chọn \"Chưa ký\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án đã lưu P-03 (đã ký), SM lập PAKD lần đầu thì lựa chọn \"Chưa ký\" bị khoá",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-193",
    "ref": [
     "FR-phuong-an-kinh-doanh-012",
     "BR-phuong-an-kinh-doanh-021"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Khoá lựa chọn \"Chưa ký\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án đã ký, SM làm lại PAKD sau khi bị từ chối thì lựa chọn \"Chưa ký\" bị khoá"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-194",
    "ref": [
     "BR-phuong-an-kinh-doanh-021"
    ],
    "category": "Mục 1 \"Thông tin dự án\"",
    "subcategory": "Khoá lựa chọn \"Chưa ký\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án chưa ký thì đổi qua lại Chưa ký / Đã ký tự do"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-195",
    "ref": [
     "FR-phuong-an-kinh-doanh-013"
    ],
    "category": "Mục 2 \"Tiến độ và phạm vi (theo hợp đồng)\"",
    "subcategory": "Trường và Số tháng thực hiện",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify tình trạng Đã ký Mục 2 có đủ Bắt đầu thực hiện (tháng)*, Kết thúc dự kiến (tháng)*, Số tháng thực hiện, Phạm vi công việc*"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-196",
    "ref": [
     "FR-phuong-an-kinh-doanh-013",
     "BR-phuong-an-kinh-doanh-012"
    ],
    "category": "Mục 2 \"Tiến độ và phạm vi (theo hợp đồng)\"",
    "subcategory": "Trường và Số tháng thực hiện",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Bắt đầu 01/2027, Kết thúc 12/2027 thì Số tháng thực hiện là 12"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-197",
    "ref": [
     "BR-phuong-an-kinh-doanh-012"
    ],
    "category": "Mục 2 \"Tiến độ và phạm vi (theo hợp đồng)\"",
    "subcategory": "Trường và Số tháng thực hiện",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Bắt đầu 11/2026, Kết thúc 02/2027 thì Số tháng thực hiện là 4"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-198",
    "ref": [
     "BR-phuong-an-kinh-doanh-012"
    ],
    "category": "Mục 2 \"Tiến độ và phạm vi (theo hợp đồng)\"",
    "subcategory": "Trường và Số tháng thực hiện",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Bắt đầu và Kết thúc cùng tháng 03/2027 thì Số tháng thực hiện là 1"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-199",
    "ref": [
     "FR-phuong-an-kinh-doanh-013",
     "BR-phuong-an-kinh-doanh-012"
    ],
    "category": "Mục 2 \"Tiến độ và phạm vi (theo hợp đồng)\"",
    "subcategory": "Trường và Số tháng thực hiện",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify thiếu Kết thúc thì Số tháng thực hiện hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-200",
    "ref": [
     "FR-phuong-an-kinh-doanh-013"
    ],
    "category": "Mục 2 \"Tiến độ và phạm vi (theo hợp đồng)\"",
    "subcategory": "Trường và Số tháng thực hiện",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Kết thúc trước Bắt đầu thì Số tháng thực hiện hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-201",
    "ref": [
     "FR-phuong-an-kinh-doanh-014"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bảng Mục 3 có đủ cột STT · Mốc · Thời điểm · % · Giá trị · Tỷ lệ được thanh toán (%) · Giá trị thu đợt này · Thời gian gửi hồ sơ · Điều kiện nghiệm thu · Thời gian chờ (ngày) · Tháng thu tiền · nút xoá"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-202",
    "ref": [
     "FR-phuong-an-kinh-doanh-014",
     "BR-phuong-an-kinh-doanh-010"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Giá trị hợp đồng 1,000,000,000, mốc 30% thì cột Giá trị của mốc là 300,000,000",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-203",
    "ref": [
     "FR-phuong-an-kinh-doanh-014",
     "BR-phuong-an-kinh-doanh-010"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Giá trị mốc 300,000,000, Tỷ lệ được thanh toán 90 thì Giá trị thu đợt này là 270,000,000"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-204",
    "ref": [
     "FR-phuong-an-kinh-doanh-014",
     "BR-phuong-an-kinh-doanh-034"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify nhập % mốc 120 thì ô tự về 100"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-205",
    "ref": [
     "FR-phuong-an-kinh-doanh-014",
     "BR-phuong-an-kinh-doanh-034"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify nhập Tỷ lệ được thanh toán 150 thì ô tự về 100"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-206",
    "ref": [
     "FR-phuong-an-kinh-doanh-014",
     "BR-phuong-an-kinh-doanh-011"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Thời gian gửi hồ sơ 03/2027, Thời gian chờ 30 thì Tháng thu tiền là 04/2027",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-207",
    "ref": [
     "BR-phuong-an-kinh-doanh-011"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Thời gian gửi hồ sơ trống, Thời điểm mốc 05/2027, chờ 30 thì Tháng thu tiền là 06/2027"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-208",
    "ref": [
     "BR-phuong-an-kinh-doanh-011"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Thời gian chờ 14 ngày thì Tháng thu tiền bằng tháng gửi hồ sơ (cộng 0 tháng)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-209",
    "ref": [
     "BR-phuong-an-kinh-doanh-011"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Thời gian chờ 15 ngày thì Tháng thu tiền bằng tháng gửi hồ sơ cộng 1 tháng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-210",
    "ref": [
     "BR-phuong-an-kinh-doanh-011"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Thời gian chờ 45 ngày thì Tháng thu tiền bằng tháng gửi hồ sơ cộng 2 tháng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-211",
    "ref": [
     "FR-phuong-an-kinh-doanh-014",
     "BR-phuong-an-kinh-doanh-011"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Bảng mốc và tự tính",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify mốc trống cả Thời gian gửi hồ sơ và Thời điểm thì Tháng thu tiền hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-212",
    "ref": [
     "FR-phuong-an-kinh-doanh-014"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Dòng TỔNG và thao tác dòng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dòng \"TỔNG\" Mục 3 hiển thị Σ %, Σ Giá trị, Σ Giá trị thu của các mốc"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-213",
    "ref": [
     "FR-phuong-an-kinh-doanh-014",
     "E-phuong-an-kinh-doanh-005"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Dòng TỔNG và thao tác dòng",
    "priority": 2,
    "auto": "No",
    "text": "Verify Σ % mốc bằng 90 thì Σ % ở dòng \"TỔNG\" hiển thị chữ đỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-214",
    "ref": [
     "FR-phuong-an-kinh-doanh-014"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Dòng TỔNG và thao tác dòng",
    "priority": 3,
    "auto": "No",
    "text": "Verify Σ % mốc bằng 99.99 thì Σ % ở dòng \"TỔNG\" không tô đỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-215",
    "ref": [
     "FR-phuong-an-kinh-doanh-014"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Dòng TỔNG và thao tác dòng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Thêm dòng\" ở Mục 3 sinh mốc mới với Tỷ lệ được thanh toán 100 và Thời gian chờ 30"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-216",
    "ref": [
     "FR-phuong-an-kinh-doanh-014"
    ],
    "category": "Mục 3 \"Nghiệm thu, ghi nhận doanh thu và thu tiền\"",
    "subcategory": "Dòng TỔNG và thao tác dòng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm nút xoá của một mốc thì dòng mất ngay, không có hộp hỏi xác nhận"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-217",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Bắt đầu 01/2027, Kết thúc 06/2027 thì đầu Mục 4 hiển thị \"Kỳ kế hoạch: 01/2027 – 06/2027 (6 tháng) · ĐVT: VNĐ\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-218",
    "ref": [
     "FR-phuong-an-kinh-doanh-015",
     "BR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify kỳ 01/2027 – 06/2027 thì bảng có đúng 6 cột tháng nhãn \"T1/27\" tới \"T6/27\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-219",
    "ref": [
     "BR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Bắt đầu 05/2027, thiếu Kết thúc thì bảng tạm có 12 cột \"T1/27\" tới \"T12/27\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-220",
    "ref": [
     "BR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify chưa nhập Bắt đầu thì bảng tạm có 12 cột tháng của năm hiện tại"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-221",
    "ref": [
     "BR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Kết thúc trước Bắt đầu thì bảng tạm có 12 cột tháng của năm Bắt đầu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-222",
    "ref": [
     "FR-phuong-an-kinh-doanh-015",
     "E-phuong-an-kinh-doanh-014"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify thiếu Bắt đầu / Kết thúc ở Mục 2 thì Mục 4 hiện cảnh báo \"Chưa nhập Bắt đầu / Kết thúc ở mục 2 — tạm lập kế hoạch 12 tháng năm {năm}.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-223",
    "ref": [
     "FR-phuong-an-kinh-doanh-015",
     "BR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify có giá trị ở tháng 08/2027 nằm ngoài kỳ 01/2027 – 06/2027 thì bảng có thêm cột \"T8/27\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-224",
    "ref": [
     "FR-phuong-an-kinh-doanh-015",
     "E-phuong-an-kinh-doanh-013"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 3,
    "auto": "No",
    "text": "Verify cột tháng ngoài kỳ được tô vàng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-225",
    "ref": [
     "FR-phuong-an-kinh-doanh-015",
     "E-phuong-an-kinh-doanh-013"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify có chi phí ngoài kỳ thì Mục 4 hiện cảnh báo \"Có chi phí ngoài kỳ thực hiện ({tháng}) — các cột tô vàng.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-226",
    "ref": [
     "NFR-phuong-an-kinh-doanh-003"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 2,
    "auto": "No",
    "text": "Verify kỳ 24 tháng, bảng cuộn ngang tới cột tháng cuối vẫn nhập được giá trị"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-227",
    "ref": [
     "FR-phuong-an-kinh-doanh-015",
     "NFR-phuong-an-kinh-doanh-003"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Kỳ kế hoạch và cột tháng",
    "priority": 3,
    "auto": "No",
    "text": "Verify cuộn ngang bảng Mục 4 thì 2 cột \"Nhóm chi phí\", \"Khoản mục chi phí\" giữ cố định"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-228",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Mục 4 có khối \"A. Chi phí sản xuất\" (Sản xuất / Dự phòng sản xuất / Thưởng sản xuất) và khối \"B. Chi phí kinh doanh\" (Kinh doanh / Dự phòng kinh doanh / Thưởng kinh doanh), mỗi khối có nút \"Thêm khoản mục\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-229",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Thêm khoản mục\" ở khối A thêm 1 dòng mới nằm trong khối A"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-230",
    "ref": [
     "BR-phuong-an-kinh-doanh-035"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify ô chọn nhóm của dòng khối A chỉ có 3 nhóm Sản xuất / Dự phòng sản xuất / Thưởng sản xuất"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-231",
    "ref": [
     "BR-phuong-an-kinh-doanh-035"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify ô chọn nhóm của dòng khối B chỉ có 3 nhóm Kinh doanh / Dự phòng kinh doanh / Thưởng kinh doanh"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-232",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify mỗi dòng khoản mục có ô tháng, Tổng dòng, Kết quả đầu ra, File đính kèm, nút ÷ và nút ×"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-233",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dòng có 3 tháng 10,000,000 thì cột Tổng dòng là 30,000,000"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-234",
    "ref": [
     "FR-phuong-an-kinh-doanh-015",
     "BR-phuong-an-kinh-doanh-008"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dòng \"Cộng chi phí sản xuất\" tháng 03/2027 bằng tổng ô tháng 03/2027 của các khoản mục khối A",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-235",
    "ref": [
     "FR-phuong-an-kinh-doanh-015",
     "BR-phuong-an-kinh-doanh-008"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dòng \"Cộng chi phí kinh doanh\" tháng 03/2027 bằng tổng ô tháng 03/2027 của các khoản mục khối B"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-236",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify tháng có cộng bằng 0 thì ô cộng của tháng đó hiển thị \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-237",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dòng \"TỔNG CHI PHÍ\" hiển thị tổng theo từng tháng và tổng cả kỳ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-238",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dòng \"Luỹ kế chi phí\" cộng dồn từ tháng đầu kỳ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-239",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify nhập 0 vào ô tháng đang có giá trị thì giá trị tháng đó bị xoá (ô hiện gợi ý \"0\")"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-240",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm nút × của khoản mục thì dòng bị xoá khỏi Mục 4"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-241",
    "ref": [
     "FR-phuong-an-kinh-doanh-015"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Khoản mục và tổng",
    "priority": 4,
    "auto": "Yes",
    "text": "Verify cuối Mục 4 có chú thích \"Nhập giá trị chi dự kiến của từng khoản mục vào các tháng thực hiện. Nút ÷ chia đều một tổng giá trị cho các tháng trong kỳ. Kỳ kế hoạch lấy theo Bắt đầu / Kết thúc ở mục 2.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-242",
    "ref": [
     "FR-phuong-an-kinh-doanh-016"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Chia đều chi phí cho kỳ",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify rê chuột lên nút ÷ hiện gợi ý \"Chia đều một tổng giá trị cho các tháng trong kỳ\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-243",
    "ref": [
     "FR-phuong-an-kinh-doanh-016"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Chia đều chi phí cho kỳ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm ÷ trên dòng có tổng 15,000,000 với kỳ 01/2027 – 03/2027 mở hộp \"Chia đều cho 3 tháng (01/2027 – 03/2027)\" có ô \"Tổng giá trị (VNĐ)\" điền sẵn 15,000,000"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-244",
    "ref": [
     "FR-phuong-an-kinh-doanh-016",
     "BR-phuong-an-kinh-doanh-016"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Chia đều chi phí cho kỳ",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify nhập Tổng giá trị 10,000,000 cho kỳ 3 tháng, bấm \"Chia đều\" thì 3 tháng nhận 3,333,000 · 3,333,000 · 3,334,000",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-245",
    "ref": [
     "FR-phuong-an-kinh-doanh-016"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Chia đều chi phí cho kỳ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dòng có giá trị ở tháng ngoài kỳ, bấm \"Chia đều\" thì giá trị ngoài kỳ của dòng bị bỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-246",
    "ref": [
     "FR-phuong-an-kinh-doanh-016"
    ],
    "category": "Mục 4 \"Kế hoạch chi phí theo tháng\"",
    "subcategory": "Chia đều chi phí cho kỳ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Huỷ\" trong hộp chia đều thì hộp đóng, giá trị tháng của dòng không đổi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-247",
    "ref": [
     "FR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mốc kế hoạch và mục tiêu — Chưa ký",
    "subcategory": "Bảng giai đoạn",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bảng Mốc kế hoạch có đủ cột TT · Giai đoạn · Từ · Đến · Sản xuất · Kinh doanh · Tổng · Kết quả đầu ra · File đính kèm · nút xoá"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-248",
    "ref": [
     "FR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mốc kế hoạch và mục tiêu — Chưa ký",
    "subcategory": "Bảng giai đoạn",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify giai đoạn SX 60,000,000, KD 40,000,000 thì cột Tổng là 100,000,000"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-249",
    "ref": [
     "FR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mốc kế hoạch và mục tiêu — Chưa ký",
    "subcategory": "Bảng giai đoạn",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dòng \"TỔNG\" bảng Mốc kế hoạch hiển thị Σ Sản xuất, Σ Kinh doanh, Σ Tổng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-250",
    "ref": [
     "FR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mốc kế hoạch và mục tiêu — Chưa ký",
    "subcategory": "Bảng giai đoạn",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Thêm dòng\" ở bảng Mốc kế hoạch thêm 1 giai đoạn mới"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-251",
    "ref": [
     "FR-phuong-an-kinh-doanh-017",
     "BR-phuong-an-kinh-doanh-014",
     "E-phuong-an-kinh-doanh-017"
    ],
    "category": "Mốc kế hoạch và mục tiêu — Chưa ký",
    "subcategory": "Cảnh báo giai đoạn thiếu / sai Từ–Đến",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify giai đoạn 2 có SX > 0 mà thiếu \"Từ\" thì hiện cảnh báo cam \"Giai đoạn 2 thiếu / sai Từ–Đến — không vào kế hoạch tháng\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-252",
    "ref": [
     "FR-phuong-an-kinh-doanh-017",
     "BR-phuong-an-kinh-doanh-014",
     "E-phuong-an-kinh-doanh-017"
    ],
    "category": "Mốc kế hoạch và mục tiêu — Chưa ký",
    "subcategory": "Cảnh báo giai đoạn thiếu / sai Từ–Đến",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify giai đoạn có KD > 0 với \"Đến\" trước \"Từ\" thì hiện cảnh báo \"Giai đoạn {n} thiếu / sai Từ–Đến — không vào kế hoạch tháng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-253",
    "ref": [
     "FR-phuong-an-kinh-doanh-017"
    ],
    "category": "Mốc kế hoạch và mục tiêu — Chưa ký",
    "subcategory": "Cảnh báo giai đoạn thiếu / sai Từ–Đến",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify giai đoạn SX bằng 0, KD bằng 0 thiếu \"Từ\" thì không hiện cảnh báo thiếu / sai Từ–Đến"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-254",
    "ref": [
     "FR-phuong-an-kinh-doanh-019"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô số và ô %",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify gõ 1000000 vào ô Giá trị hợp đồng thì ô hiển thị \"1,000,000\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-255",
    "ref": [
     "FR-phuong-an-kinh-doanh-019"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô số và ô %",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify gõ chữ cái vào ô Giá trị hợp đồng thì ô không nhận ký tự đó"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-256",
    "ref": [
     "FR-phuong-an-kinh-doanh-019"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô số và ô %",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô % mốc nhận giá trị thập phân 12.5"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-257",
    "ref": [
     "FR-phuong-an-kinh-doanh-019"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô số và ô %",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô số để trống hiển thị gợi ý \"0\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-258",
    "ref": [
     "FR-phuong-an-kinh-doanh-019",
     "BR-phuong-an-kinh-doanh-033"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify gõ \"2/2027\" vào ô tháng, rời ô thì ô hiển thị \"02/2027\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-259",
    "ref": [
     "FR-phuong-an-kinh-doanh-019",
     "BR-phuong-an-kinh-doanh-033"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify gõ \"022027\" vào ô tháng, nhấn Enter thì ô hiển thị \"02/2027\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-260",
    "ref": [
     "BR-phuong-an-kinh-doanh-033"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify gõ \"2-2027\" vào ô tháng, rời ô thì ô hiển thị \"02/2027\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-261",
    "ref": [
     "BR-phuong-an-kinh-doanh-033"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 4,
    "auto": "Yes",
    "text": "Verify gõ \"2.2027\" vào ô tháng, rời ô thì ô hiển thị \"02/2027\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-262",
    "ref": [
     "FR-phuong-an-kinh-doanh-019",
     "BR-phuong-an-kinh-doanh-033",
     "E-phuong-an-kinh-doanh-012"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify gõ \"13/2027\" vào ô tháng, rời ô thì ô tô nền đỏ nhạt kèm gợi ý \"Nhập đúng dạng MM/YYYY\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-263",
    "ref": [
     "E-phuong-an-kinh-doanh-012"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify ô tháng đang có \"05/2027\", gõ \"13/2027\", rời ô thì giá trị \"05/2027\" được giữ nguyên"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-264",
    "ref": [
     "E-phuong-an-kinh-doanh-012"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify gõ \"0/2027\" vào ô tháng, rời ô thì ô báo \"Nhập đúng dạng MM/YYYY\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-265",
    "ref": [
     "BR-phuong-an-kinh-doanh-033",
     "E-phuong-an-kinh-doanh-012"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify gõ \"2/27\" (năm 2 chữ số) vào ô tháng, rời ô thì ô báo \"Nhập đúng dạng MM/YYYY\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-266",
    "ref": [
     "FR-phuong-an-kinh-doanh-019"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify xoá trắng ô tháng đang có giá trị, rời ô thì giá trị tháng bị xoá"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-267",
    "ref": [
     "FR-phuong-an-kinh-doanh-019"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tháng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify khi Gửi bị lỗi thì lỗi chỉ hiện ở dải lỗi chung, các ô liên quan không bị tô"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-268",
    "ref": [
     "FR-phuong-an-kinh-doanh-019"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tệp đính kèm",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify chọn 2 tệp pdf cho ô Đính kèm của khoản mục thì hiện 2 thẻ tên tệp, mỗi thẻ có nút ×"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-269",
    "ref": [
     "FR-phuong-an-kinh-doanh-019"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tệp đính kèm",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify bấm × trên thẻ tệp thì tệp bị gỡ khỏi khoản mục"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-270",
    "ref": [
     "BR-phuong-an-kinh-doanh-048",
     "E-phuong-an-kinh-doanh-022"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tệp đính kèm",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify chọn tệp 21 MB thì tệp bị loại với câu \"Tệp \"{tên}\" vượt 20 MB\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-271",
    "ref": [
     "BR-phuong-an-kinh-doanh-048"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tệp đính kèm",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify chọn tệp đúng 20 MB định dạng pdf thì tệp được nhận"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-272",
    "ref": [
     "BR-phuong-an-kinh-doanh-048",
     "E-phuong-an-kinh-doanh-022"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tệp đính kèm",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify chọn tệp .exe thì tệp bị loại với câu \"Tệp \"{tên}\" không đúng định dạng (chỉ nhận pdf, doc, docx, xls, xlsx, jpg, png)\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-273",
    "ref": [
     "BR-phuong-an-kinh-doanh-048",
     "E-phuong-an-kinh-doanh-022"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tệp đính kèm",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify chọn cùng lượt 1 tệp xlsx hợp lệ và 1 tệp 25 MB thì tệp xlsx vẫn được nhận"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-274",
    "ref": [
     "BR-phuong-an-kinh-doanh-048"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Ô tệp đính kèm",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô Đính kèm của giai đoạn (Mốc kế hoạch) loại tệp 21 MB với câu \"Tệp \"{tên}\" vượt 20 MB\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-275",
    "ref": [
     "FR-phuong-an-kinh-doanh-022",
     "BR-phuong-an-kinh-doanh-047",
     "E-phuong-an-kinh-doanh-021"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Số hợp đồng 256 ký tự, bấm Gửi Kế toán duyệt thì dải lỗi có câu \"Tối đa {n} ký tự\" (n = 255) kèm tên ô Số hợp đồng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-276",
    "ref": [
     "BR-phuong-an-kinh-doanh-047"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Số hợp đồng đúng 255 ký tự không bị báo vượt độ dài"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-277",
    "ref": [
     "BR-phuong-an-kinh-doanh-047"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Phạm vi công việc 1.001 ký tự, bấm Gửi thì dải lỗi có câu \"Tối đa {n} ký tự\" (n = 1.000) kèm tên ô"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-278",
    "ref": [
     "BR-phuong-an-kinh-doanh-047"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify tên khoản mục chi phí 256 ký tự, bấm Gửi thì dải lỗi có câu vượt độ dài kèm tên ô"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-279",
    "ref": [
     "BR-phuong-an-kinh-doanh-047"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Đánh giá rủi ro 1.001 ký tự, bấm Gửi thì dải lỗi có câu vượt độ dài kèm tên ô"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-280",
    "ref": [
     "BR-phuong-an-kinh-doanh-047",
     "E-phuong-an-kinh-doanh-021"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Giá trị hợp đồng 16 chữ số, bấm Gửi thì dải lỗi có câu \"Tối đa 15 chữ số\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-281",
    "ref": [
     "BR-phuong-an-kinh-doanh-047"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Giá trị hợp đồng 15 chữ số không bị báo vượt"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-282",
    "ref": [
     "FR-phuong-an-kinh-doanh-016",
     "BR-phuong-an-kinh-doanh-047"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Tổng giá trị chia đều 16 chữ số thì không chia đều được và báo \"Tối đa 15 chữ số\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-283",
    "ref": [
     "BR-phuong-an-kinh-doanh-047",
     "BR-phuong-an-kinh-doanh-034",
     "E-phuong-an-kinh-doanh-021"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Thời gian chờ 1000 ngày, bấm Gửi thì dải lỗi có câu \"Tối đa 999 ngày\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-284",
    "ref": [
     "FR-phuong-an-kinh-doanh-021",
     "BR-phuong-an-kinh-doanh-047",
     "E-phuong-an-kinh-doanh-021"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Số hợp đồng 256 ký tự, bấm Lưu nháp thì dải lỗi có câu vượt độ dài và PAKD không được lưu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-285",
    "ref": [
     "BR-phuong-an-kinh-doanh-047"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Phạm vi công việc chỉ gồm khoảng trắng, bấm Gửi thì dải lỗi có \"Nhập Phạm vi công việc\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-286",
    "ref": [
     "BR-phuong-an-kinh-doanh-047"
    ],
    "category": "Ô nhập Số / % / Tháng / Tệp và giới hạn nhập",
    "subcategory": "Giới hạn độ dài và khoảng trắng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Số hợp đồng nhập \"  HĐ-01  \", Lưu nháp, mở lại thì ô hiển thị \"HĐ-01\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-287",
    "ref": [
     "FR-phuong-an-kinh-doanh-021"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp thành công",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM bấm Lưu nháp thì hiện toast \"Đã lưu nháp PAKD\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-288",
    "ref": [
     "FR-phuong-an-kinh-doanh-021",
     "BR-phuong-an-kinh-doanh-024"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp thành công",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Lưu nháp khi còn thiếu trường bắt buộc vẫn lưu thành công, không hiện dải lỗi \"Chưa gửi được — cần bổ sung:\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-289",
    "ref": [
     "FR-phuong-an-kinh-doanh-021"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp thành công",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau Lưu nháp dự án vẫn \"Chưa có PAKD\" và cột \"Phiên bản PAKD\" vẫn \"—\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-290",
    "ref": [
     "FR-phuong-an-kinh-doanh-021"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp thành công",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Lưu nháp xong mở lại dự án thì khung hiển thị đúng nội dung vừa lưu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-291",
    "ref": [
     "FR-phuong-an-kinh-doanh-021",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp thành công",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tab \"Lịch sử\" có dòng \"Lưu nháp PAKD\", người thực hiện \"{tài khoản} (SM)\", không có ghi chú"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-292",
    "ref": [
     "BR-phuong-an-kinh-doanh-002"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp thành công",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify GĐK của khối dự án Lưu nháp thành công với toast \"Đã lưu nháp PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-293",
    "ref": [
     "FR-phuong-an-kinh-doanh-021",
     "E-phuong-an-kinh-doanh-019"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify SM bấm Lưu nháp đúng lúc GĐK vừa gửi PAKD đó thì bị từ chối với thông báo \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-294",
    "ref": [
     "E-phuong-an-kinh-doanh-019"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify sau thông báo dữ liệu vừa đổi khi Lưu nháp, khung nạp lại hiển thị bản vừa được gửi ở chế độ chỉ xem"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-295",
    "ref": [
     "FR-phuong-an-kinh-doanh-021"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 2,
    "auto": "No",
    "text": "Verify SM bấm Lưu nháp đúng lúc dự án vừa chuyển Pending thì hiện \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-296",
    "ref": [
     "FR-phuong-an-kinh-doanh-021",
     "E-phuong-an-kinh-doanh-020"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi Lưu nháp thì hiện \"Thao tác chưa thực hiện được, vui lòng thử lại\" và không có toast thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-297",
    "ref": [
     "E-phuong-an-kinh-doanh-020",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify sau lỗi ghi khi Lưu nháp, khung giữ nguyên nội dung đang nhập"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-298",
    "ref": [
     "E-phuong-an-kinh-doanh-020",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Lưu nháp PAKD",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 2,
    "auto": "No",
    "text": "Verify bấm Lưu nháp lại sau lỗi ghi thì lưu thành công và tab \"Lịch sử\" chỉ có 1 dòng \"Lưu nháp PAKD\" mới"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-299",
    "ref": [
     "FR-phuong-an-kinh-doanh-022",
     "BR-phuong-an-kinh-doanh-024"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Dải lỗi",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm \"Gửi Kế toán duyệt\" khi thiếu trường bắt buộc thì hiện dải đỏ \"Chưa gửi được — cần bổ sung:\" kèm danh sách lỗi",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-300",
    "ref": [
     "FR-phuong-an-kinh-doanh-022"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Dải lỗi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify khi hiện dải lỗi thì màn cuộn tới đầu khung PAKD"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-301",
    "ref": [
     "FR-phuong-an-kinh-doanh-022"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Dải lỗi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dải lỗi tự biến mất khi sửa một ô bất kỳ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-302",
    "ref": [
     "FR-phuong-an-kinh-doanh-022"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Dải lỗi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký thiếu cùng lúc Phạm vi công việc, Giá trị hợp đồng và tổng % mốc bằng 90 thì dải lỗi liệt kê đủ 3 dòng lỗi tương ứng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-303",
    "ref": [
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-001"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Đã ký, Phạm vi công việc trống, bấm Gửi thì dải lỗi có \"Nhập Phạm vi công việc\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-304",
    "ref": [
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-001"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Chưa ký, Phạm vi công việc trống, bấm Gửi thì dải lỗi có \"Nhập Phạm vi công việc\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-305",
    "ref": [
     "E-phuong-an-kinh-doanh-001"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau khi nhập Phạm vi công việc bị thiếu, bấm Gửi lại thì gửi thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-306",
    "ref": [
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-002"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Đã ký, Giá trị hợp đồng trống, bấm Gửi thì dải lỗi có \"Nhập Giá trị hợp đồng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-307",
    "ref": [
     "E-phuong-an-kinh-doanh-002"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, Giá trị hợp đồng bằng 0, bấm Gửi thì dải lỗi có \"Nhập Giá trị hợp đồng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-308",
    "ref": [
     "E-phuong-an-kinh-doanh-003"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Đã ký, thiếu Kết thúc, bấm Gửi thì dải lỗi có \"Nhập Bắt đầu / Kết thúc thực hiện (tháng)\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-309",
    "ref": [
     "E-phuong-an-kinh-doanh-003"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Đã ký, thiếu Bắt đầu, bấm Gửi thì dải lỗi có \"Nhập Bắt đầu / Kết thúc thực hiện (tháng)\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-310",
    "ref": [
     "E-phuong-an-kinh-doanh-004"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Đã ký, Kết thúc 02/2027 trước Bắt đầu 03/2027, bấm Gửi thì dải lỗi có \"Kết thúc phải sau Bắt đầu\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-311",
    "ref": [
     "E-phuong-an-kinh-doanh-004"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, Bắt đầu và Kết thúc cùng 03/2027 thì không báo \"Kết thúc phải sau Bắt đầu\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-312",
    "ref": [
     "E-phuong-an-kinh-doanh-005"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Đã ký, tổng % mốc 90, bấm Gửi thì dải lỗi có \"Tổng % các mốc nghiệm thu phải bằng 100% (hiện 90%)\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-313",
    "ref": [
     "E-phuong-an-kinh-doanh-005"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, 3 mốc mỗi mốc 33.33% (tổng 99.99) thì không báo lỗi tổng % mốc"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-314",
    "ref": [
     "E-phuong-an-kinh-doanh-005"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, 3 mốc mỗi mốc 33.3% (tổng 99.9), bấm Gửi thì dải lỗi có câu tổng % mốc kèm \"(hiện 99.9%)\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-315",
    "ref": [
     "E-phuong-an-kinh-doanh-006"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Đã ký, không khoản mục nào có tổng > 0, bấm Gửi thì dải lỗi có \"Lập kế hoạch chi phí: nhập giá trị cho ít nhất một khoản mục / tháng\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-316",
    "ref": [
     "E-phuong-an-kinh-doanh-007"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, có dòng chi phí tổng > 0 mà tên khoản mục trống, bấm Gửi thì dải lỗi có \"Nhập tên khoản mục cho các dòng chi phí có giá trị\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-317",
    "ref": [
     "E-phuong-an-kinh-doanh-007"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra chung và Đã ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Đã ký, dòng chi phí tên trống nhưng tổng bằng 0 thì không báo thiếu tên khoản mục"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-318",
    "ref": [
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-008"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra Chưa ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Chưa ký, Thời điểm dự kiến ký trống, bấm Gửi thì dải lỗi có \"Nhập Thời điểm dự kiến ký\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-319",
    "ref": [
     "E-phuong-an-kinh-doanh-009"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra Chưa ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Chưa ký, Giá trị hợp đồng dự kiến bằng 0, bấm Gửi thì dải lỗi có \"Nhập Giá trị hợp đồng dự kiến\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-320",
    "ref": [
     "E-phuong-an-kinh-doanh-009"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra Chưa ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Chưa ký, Đánh giá rủi ro trống, bấm Gửi thì dải lỗi có \"Nhập Đánh giá rủi ro\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-321",
    "ref": [
     "E-phuong-an-kinh-doanh-009"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra Chưa ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Chưa ký thiếu cả Giá trị dự kiến và Đánh giá rủi ro thì dải lỗi có 2 dòng lỗi riêng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-322",
    "ref": [
     "E-phuong-an-kinh-doanh-010"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra Chưa ký",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Chưa ký, không giai đoạn nào vừa có tên vừa có SX / KD > 0, bấm Gửi thì dải lỗi có \"Nhập ít nhất một mốc kế hoạch có tổng mức đầu tư\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-323",
    "ref": [
     "E-phuong-an-kinh-doanh-010"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra Chưa ký",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Chưa ký, giai đoạn có SX > 0 nhưng tên giai đoạn trống, bấm Gửi thì dải lỗi có \"Nhập ít nhất một mốc kế hoạch có tổng mức đầu tư\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-324",
    "ref": [
     "BR-phuong-an-kinh-doanh-024"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Kiểm tra Chưa ký",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Chưa ký không có khoản mục chi phí theo tháng thì không báo lỗi \"Lập kế hoạch chi phí: nhập giá trị cho ít nhất một khoản mục / tháng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-325",
    "ref": [
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-013"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Cảnh báo không chặn gửi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký có chi phí ngoài kỳ (cảnh báo cột vàng) vẫn Gửi Kế toán duyệt thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-326",
    "ref": [
     "BR-phuong-an-kinh-doanh-009",
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-016"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Cảnh báo không chặn gửi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Biên lợi nhuận 15.0% (\"! Dưới khung\") vẫn Gửi Kế toán duyệt thành công",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-327",
    "ref": [
     "FR-phuong-an-kinh-doanh-017",
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-017"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Cảnh báo không chặn gửi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Chưa ký có giai đoạn thiếu \"Từ\" (cảnh báo cam) vẫn Gửi Kế toán duyệt thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-328",
    "ref": [
     "BR-phuong-an-kinh-doanh-018",
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-015"
    ],
    "category": "Gửi Kế toán duyệt — kiểm tra",
    "subcategory": "Cảnh báo không chặn gửi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Đã ký, dự án có hợp đồng lệch doanh thu PAKD 5% vẫn Gửi Kế toán duyệt thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-329",
    "ref": [
     "FR-phuong-an-kinh-doanh-023"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Gửi hợp lệ thì dự án chuyển trạng thái \"PAKD chờ duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-330",
    "ref": [
     "FR-phuong-an-kinh-doanh-023",
     "BR-phuong-an-kinh-doanh-025"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Gửi lần đầu hợp lệ thì hiện toast \"Đã gửi PAKD V1 — chờ Kế toán (CFO) duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-331",
    "ref": [
     "FR-phuong-an-kinh-doanh-023",
     "BR-phuong-an-kinh-doanh-025"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Gửi lần đầu hợp lệ thì cột \"Phiên bản PAKD\" hiển thị \"V1, chờ CFO\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-332",
    "ref": [
     "FR-phuong-an-kinh-doanh-023",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Gửi Đã ký hợp lệ thì tab \"Lịch sử\" có dòng \"Nộp PAKD\" ghi chú \"Đã ký · Doanh thu {x} · Chi phí {y} · Chờ Kế toán (CFO) duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-333",
    "ref": [
     "FR-phuong-an-kinh-doanh-023"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau Gửi khung chuyển chỉ xem và nhãn \"Đã có PAKD · chờ Kế toán duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-334",
    "ref": [
     "FR-phuong-an-kinh-doanh-020"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau Gửi đầu trang không còn nút \"Lưu nháp\" · \"Gửi Kế toán duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-335",
    "ref": [
     "FR-phuong-an-kinh-doanh-023",
     "BR-phuong-an-kinh-doanh-026"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau Gửi cột \"Giá trị hợp đồng dự kiến\" của dự án ở danh sách vẫn hiển thị \"—\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-336",
    "ref": [
     "BR-phuong-an-kinh-doanh-026"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 1,
    "auto": "No",
    "text": "Verify sau Gửi doanh thu dự kiến, chi phí SX / KD kế hoạch và kế hoạch theo tháng của dự án không đổi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-337",
    "ref": [
     "BR-phuong-an-kinh-doanh-026"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 2,
    "auto": "No",
    "text": "Verify dự án \"PAKD chờ duyệt\" không được cộng vào Sổ theo dõi / Báo cáo theo số liệu PAKD"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-338",
    "ref": [
     "FR-phuong-an-kinh-doanh-023",
     "BR-phuong-an-kinh-doanh-044"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 2,
    "auto": "No",
    "text": "Verify sau Gửi hệ thống lưu bản chụp toàn bộ nội dung PAKD gắn với phiên bản V1"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-339",
    "ref": [
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 2,
    "auto": "No",
    "text": "Verify sau Gửi Version dự án không tăng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-340",
    "ref": [
     "BR-phuong-an-kinh-doanh-002"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify GĐK của khối dự án Gửi hợp lệ thì dự án chuyển \"PAKD chờ duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-341",
    "ref": [
     "NFR-phuong-an-kinh-doanh-011"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Kết quả gửi lần đầu",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Gửi Kế toán duyệt\" 2 lần liên tiếp nhanh thì chỉ có 1 phiên bản \"V1, chờ CFO\" và 1 dòng lịch sử \"Nộp PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-342",
    "ref": [
     "FR-phuong-an-kinh-doanh-002",
     "FR-phuong-an-kinh-doanh-006"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Làm lại sau khi bị từ chối",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM mở dự án bị từ chối V1 thì khung cho nhập và hiển thị nội dung PAKD đã gửi trước đó để sửa",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-343",
    "ref": [
     "FR-phuong-an-kinh-doanh-023",
     "BR-phuong-an-kinh-doanh-025"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Làm lại sau khi bị từ chối",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify gửi lại sau khi V1 bị từ chối thì toast \"Đã gửi PAKD V1 — chờ Kế toán (CFO) duyệt\" (giữ số V1)",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-344",
    "ref": [
     "BR-phuong-an-kinh-doanh-025"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Làm lại sau khi bị từ chối",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify gửi lại sau khi V1 bị từ chối thì cột \"Phiên bản PAKD\" hiển thị \"V1, chờ CFO\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-345",
    "ref": [
     "BR-phuong-an-kinh-doanh-025",
     "BR-phuong-an-kinh-doanh-038"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Làm lại sau khi bị từ chối",
    "priority": 2,
    "auto": "No",
    "text": "Verify gửi lại sau khi bị từ chối thì danh sách phiên bản có thêm 1 dòng V1 mới, dòng V1 \"Từ chối\" cũ vẫn còn"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-346",
    "ref": [
     "BR-phuong-an-kinh-doanh-002",
     "E-phuong-an-kinh-doanh-018",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Gửi — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify SM khối khác gửi yêu cầu Lưu nháp PAKD bằng đường ngoài giao diện thì bị từ chối \"Bạn không có quyền thực hiện thao tác này.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-347",
    "ref": [
     "E-phuong-an-kinh-doanh-018"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Gửi — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify sau khi SM khối khác bị từ chối quyền khi Lưu nháp, nội dung PAKD của dự án giữ nguyên như trước thao tác"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-348",
    "ref": [
     "FR-phuong-an-kinh-doanh-023",
     "E-phuong-an-kinh-doanh-019",
     "NFR-phuong-an-kinh-doanh-011"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Gửi — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify bấm Gửi đúng lúc dự án vừa chuyển Pending thì bị từ chối với thông báo \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-349",
    "ref": [
     "FR-phuong-an-kinh-doanh-023"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Gửi — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify bấm Gửi đúng lúc PAKD vừa được người khác gửi thì hiện thông báo dữ liệu vừa đổi và không sinh phiên bản thứ hai"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-350",
    "ref": [
     "FR-phuong-an-kinh-doanh-023"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Gửi — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify hợp đồng vừa được lưu qua P-03 và đã cập nhật Mục 1 bản đang lập, SM bấm Gửi trên nội dung cũ thì bị từ chối với thông báo dữ liệu vừa đổi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-351",
    "ref": [
     "E-phuong-an-kinh-doanh-019"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Gửi — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify sau thông báo dữ liệu vừa đổi khi Gửi, khung nạp lại với Mục 1 theo hợp đồng mới"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-352",
    "ref": [
     "FR-phuong-an-kinh-doanh-023",
     "E-phuong-an-kinh-doanh-020",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Gửi — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi Gửi thì dự án vẫn \"Chưa có PAKD\", không có phiên bản mới, không có dòng lịch sử \"Nộp PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-353",
    "ref": [
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Gửi Kế toán duyệt — thành công",
    "subcategory": "Gửi — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify sau lỗi ghi khi Gửi, khung giữ nguyên nội dung đang nhập để bấm lại"
   }
  ]
 },
 {
  "scope": "uc",
  "target": "uc-duyet-pakd",
  "file": "checklist-uc-duyet-pakd.md",
  "items": [
   {
    "chk": "CHK-phuong-an-kinh-doanh-354",
    "ref": [
     "FR-phuong-an-kinh-doanh-035"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ danh sách",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán xem danh sách thấy link \"Duyệt\" ở cột \"Thao tác\" của dự án \"PAKD chờ duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-355",
    "ref": [
     "FR-phuong-an-kinh-doanh-035"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ danh sách",
    "priority": 4,
    "auto": "No",
    "text": "Verify link \"Duyệt\" hiển thị chữ đỏ đậm"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-356",
    "ref": [
     "FR-phuong-an-kinh-doanh-029"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ danh sách",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm link \"Duyệt\" mở P-04 ngay trên danh sách, không rời màn danh sách"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-357",
    "ref": [
     "FR-phuong-an-kinh-doanh-035"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ danh sách",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM xem danh sách thấy link \"Xem\" ở cột \"Thao tác\" của dự án \"PAKD chờ duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-358",
    "ref": [
     "FR-phuong-an-kinh-doanh-029",
     "BR-phuong-an-kinh-doanh-004"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ danh sách",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán mở P-04 được cho dự án thuộc khối bất kỳ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-359",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ màn chi tiết",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán mở dự án \"PAKD chờ duyệt\" thấy dòng thông báo \"PAKD V1 đang chờ Kế toán (CFO) duyệt.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-360",
    "ref": [
     "FR-phuong-an-kinh-doanh-029"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ màn chi tiết",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm nút \"Duyệt / Từ chối PAKD\" trên dòng thông báo mở P-04",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-361",
    "ref": [
     "FR-phuong-an-kinh-doanh-029"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ màn chi tiết",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Pending\" đang có bản chờ, Kế toán thấy nút \"Duyệt / Từ chối PAKD\" trên dòng thông báo"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-362",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ màn chi tiết",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"PAKD chờ duyệt\" thấy dòng thông báo \"Đang chờ Kế toán (CFO) duyệt PAKD V1.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-363",
    "ref": [
     "FR-phuong-an-kinh-doanh-036",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ màn chi tiết",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM mở dự án \"PAKD chờ duyệt\" thấy dòng thông báo \"Đang chờ Kế toán duyệt PAKD.\" không có số phiên bản"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-364",
    "ref": [
     "FR-phuong-an-kinh-doanh-029",
     "BR-phuong-an-kinh-doanh-004"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ màn chi tiết",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"PAKD chờ duyệt\" không có link / nút duyệt",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-365",
    "ref": [
     "BR-phuong-an-kinh-doanh-004",
     "E-phuong-an-kinh-doanh-018"
    ],
    "category": "Mở popup P-04 \"Duyệt PAKD\"",
    "subcategory": "Từ màn chi tiết",
    "priority": 1,
    "auto": "No",
    "text": "Verify SM gửi yêu cầu ghi quyết định duyệt bằng đường ngoài giao diện thì bị từ chối \"Bạn không có quyền thực hiện thao tác này.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-366",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify P-04 của phiên bản V1 có tiêu đề \"CFO duyệt PAKD — V1\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-367",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify P-04 lần đầu hiển thị đủ Dự án \"{mã} — {tên}\", Người nộp / ngày nộp, Doanh thu PAKD (VNĐ), Chi phí kế hoạch (VNĐ), LN gộp kế hoạch (VNĐ), Kế hoạch theo tháng",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-368",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Doanh thu PAKD trên P-04 lấy từ nội dung PAKD đang chờ duyệt (dự án chưa có số liệu PAKD)",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-369",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Doanh thu 1,000,000,000, Chi phí 700,000,000 thì LN gộp kế hoạch hiển thị \"300,000,000 (30.0%)\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-370",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify PAKD đang chờ sinh 6 tháng kế hoạch thì dòng Kế hoạch theo tháng hiển thị \"6 tháng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-371",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify PAKD đang chờ không sinh tháng nào thì dòng Kế hoạch theo tháng hiển thị \"Chưa import\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-372",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify PAKD đang chờ không sinh tháng nào vẫn bấm Duyệt thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-373",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô Ý kiến có gợi ý \"Ý kiến phê duyệt / lý do từ chối\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-374",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify P-04 lần đầu có chú thích \"Kế toán (CFO) duyệt → PAKD được duyệt, dự án chuyển \"Đang thực hiện\". Từ chối → trả về GĐK lập phiên bản mới.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-375",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Thông tin hiển thị",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify P-04 có đủ 3 nút \"Huỷ\", \"Từ chối\", \"Duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-376",
    "ref": [
     "FR-phuong-an-kinh-doanh-030",
     "BR-phuong-an-kinh-doanh-018",
     "E-phuong-an-kinh-doanh-015"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Cảnh báo lệch hợp đồng trên P-04",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án đã có hợp đồng lệch doanh thu bản đang chờ 5% thì P-04 hiện dòng \"Giá trị HĐ hiện có {x} — lệch {z%} ⚠\" trước khi bấm Duyệt",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-377",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Cảnh báo lệch hợp đồng trên P-04",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án có hợp đồng lệch đúng 2% thì P-04 không có dòng cảnh báo lệch"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-378",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Cảnh báo lệch hợp đồng trên P-04",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án chưa có hợp đồng thì P-04 không có dòng cảnh báo lệch"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-379",
    "ref": [
     "FR-phuong-an-kinh-doanh-030",
     "E-phuong-an-kinh-doanh-015"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Cảnh báo lệch hợp đồng trên P-04",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify P-04 đang có dòng cảnh báo lệch vẫn bấm Duyệt thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-380",
    "ref": [
     "FR-phuong-an-kinh-doanh-030",
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-023"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Điểm chưa đạt kiểm tra gửi",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản lần đầu Chưa ký đang chờ được cập nhật theo hợp đồng thành Đã ký với tổng % mốc 0 thì P-04 hiện khối \"Chưa đạt kiểm tra gửi:\" có dòng \"Tổng % các mốc nghiệm thu phải bằng 100% (hiện 0%)\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-381",
    "ref": [
     "FR-phuong-an-kinh-doanh-030",
     "E-phuong-an-kinh-doanh-023"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Điểm chưa đạt kiểm tra gửi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify P-04 đang có khối \"Chưa đạt kiểm tra gửi:\" vẫn bấm Duyệt thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-382",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Điểm chưa đạt kiểm tra gửi",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bản đang chờ đạt đủ bộ kiểm tra gửi thì P-04 không có khối \"Chưa đạt kiểm tra gửi:\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-383",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Đóng popup",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Huỷ\" thì P-04 đóng và phiên bản vẫn \"V1, chờ CFO\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-384",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Đóng popup",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify bấm nút ✕ thì P-04 đóng, không lưu gì"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-385",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng lần đầu",
    "subcategory": "Đóng popup",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify bấm ra nền mờ ngoài P-04 thì popup đóng, không lưu gì"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-386",
    "ref": [
     "FR-phuong-an-kinh-doanh-043"
    ],
    "category": "P-04 — PAKD đã cập nhật theo hợp đồng sau khi nộp",
    "subcategory": "Nhãn và so sánh với bản chụp",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify phiên bản lần đầu có dấu cập nhật theo hợp đồng thì P-04 hiện nhãn \"Cập nhật theo hợp đồng sau khi nộp\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-387",
    "ref": [
     "FR-phuong-an-kinh-doanh-043"
    ],
    "category": "P-04 — PAKD đã cập nhật theo hợp đồng sau khi nộp",
    "subcategory": "Nhãn và so sánh với bản chụp",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify P-04 của phiên bản có dấu hiện phần so sánh bản chụp lúc nộp với nội dung hiện tại đủ 8 trường Tình trạng, Số HĐ, Ngày ký, Giá trị HĐ, Bắt đầu / Kết thúc, Doanh thu, Chi phí, LN gộp",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-388",
    "ref": [
     "FR-phuong-an-kinh-doanh-043"
    ],
    "category": "P-04 — PAKD đã cập nhật theo hợp đồng sau khi nộp",
    "subcategory": "Nhãn và so sánh với bản chụp",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt phiên bản có dấu thì cột \"Giá trị hợp đồng dự kiến\" của dự án theo doanh thu của nội dung hiện tại, không theo bản chụp"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-389",
    "ref": [
     "FR-phuong-an-kinh-doanh-043",
     "FR-phuong-an-kinh-doanh-031",
     "E-phuong-an-kinh-doanh-019"
    ],
    "category": "P-04 — PAKD đã cập nhật theo hợp đồng sau khi nộp",
    "subcategory": "Nội dung đổi khi P-04 đang mở",
    "priority": 1,
    "auto": "No",
    "text": "Verify P-04 đang mở, P-03 được lưu lần nữa làm đổi bản đang chờ, Kế toán bấm Duyệt thì bị từ chối với thông báo \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-390",
    "ref": [
     "FR-phuong-an-kinh-doanh-043",
     "E-phuong-an-kinh-doanh-019"
    ],
    "category": "P-04 — PAKD đã cập nhật theo hợp đồng sau khi nộp",
    "subcategory": "Nội dung đổi khi P-04 đang mở",
    "priority": 1,
    "auto": "No",
    "text": "Verify sau thông báo dữ liệu vừa đổi trên P-04, popup nạp lại theo nội dung mới và giữ Ý kiến đang nhập"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-391",
    "ref": [
     "FR-phuong-an-kinh-doanh-043",
     "FR-phuong-an-kinh-doanh-032"
    ],
    "category": "P-04 — PAKD đã cập nhật theo hợp đồng sau khi nộp",
    "subcategory": "Nội dung đổi khi P-04 đang mở",
    "priority": 2,
    "auto": "No",
    "text": "Verify P-04 đang mở, nội dung bản chờ đổi, Kế toán bấm Từ chối thì không ghi quyết định và hiện thông báo dữ liệu vừa đổi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-392",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "BR-phuong-an-kinh-doanh-030"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán bấm Duyệt khi ô Ý kiến trống thì duyệt thành công",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-393",
    "ref": [
     "FR-phuong-an-kinh-doanh-031"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt thành công hiện toast \"Kế toán đã duyệt PAKD V1 — dự án chuyển \"Đang thực hiện\"\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-394",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "BR-phuong-an-kinh-doanh-028"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt lần đầu thì dự án chuyển \"Đang thực hiện\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-395",
    "ref": [
     "FR-phuong-an-kinh-doanh-031"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt thì cột \"Phiên bản PAKD\" hiển thị \"V1, đã duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-396",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "BR-phuong-an-kinh-doanh-031"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify phiên bản đã duyệt hiển thị người quyết định là mã vai trò \"CFO\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-397",
    "ref": [
     "BR-phuong-an-kinh-doanh-031"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 2,
    "auto": "No",
    "text": "Verify phiên bản đã duyệt lưu kèm tài khoản Kế toán đã quyết định để tra cứu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-398",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "FR-phuong-an-kinh-doanh-038",
     "BR-phuong-an-kinh-doanh-031"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Duyệt có ý kiến \"Đồng ý\" thì tab \"Lịch sử\" có dòng \"CFO duyệt PAKD\" kèm ý kiến, người thực hiện \"{tài khoản} (CFO)\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-399",
    "ref": [
     "BR-phuong-an-kinh-doanh-030"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Duyệt với ý kiến \"  Đồng ý  \" thì lịch sử ghi ý kiến \"Đồng ý\" (đã cắt khoảng trắng)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-400",
    "ref": [
     "BR-phuong-an-kinh-doanh-030"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 4,
    "auto": "No",
    "text": "Verify phiên bản \"Chờ CFO\" đã có ý kiến lưu trước, Duyệt không nhập ý kiến thì phiên bản giữ ý kiến cũ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-401",
    "ref": [
     "BR-phuong-an-kinh-doanh-009",
     "E-phuong-an-kinh-doanh-016"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Biên lợi nhuận bản chờ 15.0% vẫn Duyệt thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-402",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "BR-phuong-an-kinh-doanh-028"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Kết quả duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án \"Pending\" có bản chờ, Kế toán Duyệt thì dự án chuyển \"Đang thực hiện\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-403",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "BR-phuong-an-kinh-doanh-026",
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt PAKD doanh thu 1,000,000,000 thì cột \"Giá trị hợp đồng dự kiến\" của dự án hiển thị 1,000,000,000",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-404",
    "ref": [
     "BR-phuong-an-kinh-doanh-027",
     "BR-phuong-an-kinh-doanh-008"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 1,
    "auto": "No",
    "text": "Verify Duyệt thì Chi phí SX kế hoạch và Chi phí KD kế hoạch của dự án bằng Chi phí SX / KD của PAKD"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-405",
    "ref": [
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 1,
    "auto": "No",
    "text": "Verify Duyệt PAKD Đã ký thì cờ \"đã ký\" của dự án là \"đã ký\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-406",
    "ref": [
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 2,
    "auto": "No",
    "text": "Verify Duyệt PAKD Đã ký có Ngày ký thực tế thì Ngày dự kiến ký của dự án bằng Ngày ký thực tế"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-407",
    "ref": [
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 3,
    "auto": "No",
    "text": "Verify Duyệt PAKD Đã ký trống Ngày ký thực tế thì Ngày dự kiến ký của dự án bằng Ngày ký trên HĐ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-408",
    "ref": [
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 3,
    "auto": "No",
    "text": "Verify Duyệt PAKD Đã ký trống cả 2 ngày ký thì Ngày dự kiến ký của dự án giữ giá trị cũ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-409",
    "ref": [
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 2,
    "auto": "No",
    "text": "Verify Duyệt PAKD Chưa ký dự kiến ký 05/2027 thì Ngày dự kiến ký của dự án là 01/05/2027"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-410",
    "ref": [
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 1,
    "auto": "No",
    "text": "Verify Duyệt PAKD Đã ký Bắt đầu 03/2027, Kết thúc 12/2027 thì Ngày bắt đầu dự án là 01/03/2027"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-411",
    "ref": [
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 2,
    "auto": "No",
    "text": "Verify Duyệt PAKD Đã ký Kết thúc 01/2027 thì Ngày kết thúc dự án là 31/01/2027"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-412",
    "ref": [
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 2,
    "auto": "No",
    "text": "Verify Duyệt PAKD Đã ký Kết thúc 02/2028 thì Ngày kết thúc dự án là 29/02/2028 (năm nhuận)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-413",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 1,
    "auto": "No",
    "text": "Verify Duyệt thì kế hoạch theo tháng của dự án được thay toàn bộ bằng kế hoạch sinh từ PAKD, nguồn ghi \"PAKD lập trên hệ thống\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-414",
    "ref": [
     "BR-phuong-an-kinh-doanh-027"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 2,
    "auto": "No",
    "text": "Verify Duyệt PAKD không sinh tháng nào thì kế hoạch theo tháng cũ của dự án giữ nguyên"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-415",
    "ref": [
     "BR-phuong-an-kinh-doanh-013"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 1,
    "auto": "No",
    "text": "Verify Duyệt PAKD Đã ký có mốc 30% Thời điểm 04/2027 thì doanh thu tháng 04/2027 trong kế hoạch tháng của dự án bằng giá trị mốc"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-416",
    "ref": [
     "BR-phuong-an-kinh-doanh-014"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Đồng bộ số liệu vào dự án",
    "priority": 2,
    "auto": "No",
    "text": "Verify Duyệt PAKD Chưa ký thì kế hoạch tháng của dự án có chi phí chia đều theo giai đoạn, doanh thu và thu bằng 0"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-417",
    "ref": [
     "FR-phuong-an-kinh-doanh-045",
     "BR-phuong-an-kinh-doanh-045"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Hợp đồng ban đầu từ PAKD",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt PAKD Đã ký khi dự án chưa có hợp đồng thì P-03 của dự án hiển thị hợp đồng mới với Số HĐ và Giá trị lấy từ PAKD",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-418",
    "ref": [
     "BR-phuong-an-kinh-doanh-045"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Hợp đồng ban đầu từ PAKD",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify hợp đồng ban đầu tạo từ PAKD Bắt đầu 03/2027, Kết thúc 02/2028 có thời hạn 01/03/2027 → 29/02/2028"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-419",
    "ref": [
     "BR-phuong-an-kinh-doanh-045"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Hợp đồng ban đầu từ PAKD",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify hợp đồng ban đầu có Ngày ký bằng Ngày ký thực tế của PAKD"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-420",
    "ref": [
     "BR-phuong-an-kinh-doanh-045"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Hợp đồng ban đầu từ PAKD",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify PAKD trống Ngày ký thực tế thì hợp đồng ban đầu có Ngày ký bằng Ngày ký trên HĐ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-421",
    "ref": [
     "FR-phuong-an-kinh-doanh-045",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Hợp đồng ban đầu từ PAKD",
    "priority": 1,
    "auto": "No",
    "text": "Verify tạo hợp đồng ban đầu từ PAKD thì Version dự án tăng thêm đúng 1"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-422",
    "ref": [
     "FR-phuong-an-kinh-doanh-045",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Hợp đồng ban đầu từ PAKD",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tạo hợp đồng ban đầu thì tab \"Lịch sử\" có dòng \"Tạo hợp đồng từ PAKD V1\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-423",
    "ref": [
     "FR-phuong-an-kinh-doanh-045",
     "BR-phuong-an-kinh-doanh-045"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Hợp đồng ban đầu từ PAKD",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt PAKD Đã ký khi dự án đã có hợp đồng thì hợp đồng trên P-03 giữ nguyên, không bị ghi đè",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-424",
    "ref": [
     "FR-phuong-an-kinh-doanh-045"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Hợp đồng ban đầu từ PAKD",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Duyệt PAKD Chưa ký thì dự án không có hợp đồng mới"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-425",
    "ref": [
     "FR-phuong-an-kinh-doanh-045",
     "NFR-phuong-an-kinh-doanh-011"
    ],
    "category": "Kế toán Duyệt PAKD lần đầu",
    "subcategory": "Hợp đồng ban đầu từ PAKD",
    "priority": 1,
    "auto": "No",
    "text": "Verify hợp đồng được lưu qua P-03 cùng lúc Kế toán Duyệt thì không tạo thêm hợp đồng từ PAKD và Version chỉ tăng đúng 1 lần"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-426",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-030",
     "E-phuong-an-kinh-doanh-011"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Ý kiến bắt buộc",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm Từ chối khi ô Ý kiến trống thì hiện chữ đỏ \"Nhập lý do từ chối\" dưới ô Ý kiến",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-427",
    "ref": [
     "E-phuong-an-kinh-doanh-011"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Ý kiến bắt buộc",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm Từ chối khi ô Ý kiến trống thì ô Ý kiến chuyển thành bắt buộc (*)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-428",
    "ref": [
     "E-phuong-an-kinh-doanh-011"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Ý kiến bắt buộc",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm Từ chối khi Ý kiến trống thì phiên bản vẫn \"V1, chờ CFO\" (không lưu)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-429",
    "ref": [
     "BR-phuong-an-kinh-doanh-047"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Ý kiến bắt buộc",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify ô Ý kiến chỉ gồm khoảng trắng, bấm Từ chối thì hiện \"Nhập lý do từ chối\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-430",
    "ref": [
     "E-phuong-an-kinh-doanh-011"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Ý kiến bắt buộc",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau lỗi \"Nhập lý do từ chối\", nhập ý kiến, bấm Từ chối lại thì từ chối thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-431",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-047",
     "E-phuong-an-kinh-doanh-021"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Ý kiến bắt buộc",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Ý kiến 1.001 ký tự thì hiện chữ đỏ dưới ô Ý kiến \"Tối đa {n} ký tự\" và không lưu quyết định"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-432",
    "ref": [
     "FR-phuong-an-kinh-doanh-032"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Kết quả từ chối",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Từ chối có ý kiến thì hiện toast \"Kế toán đã từ chối PAKD V1 — trả về GĐK lập lại\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-433",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-028"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Kết quả từ chối",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Từ chối lần đầu thì dự án \"PAKD chờ duyệt\" về \"Chưa có PAKD\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-434",
    "ref": [
     "FR-phuong-an-kinh-doanh-032"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Kết quả từ chối",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Từ chối thì cột \"Phiên bản PAKD\" hiển thị \"V1, từ chối\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-435",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Kết quả từ chối",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Từ chối thì tab \"Lịch sử\" có dòng \"CFO từ chối PAKD\" kèm ý kiến"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-436",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-026"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Kết quả từ chối",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Từ chối thì cột \"Giá trị hợp đồng dự kiến\" của dự án vẫn \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-437",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-028"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Kết quả từ chối",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án \"Pending\" có bản chờ, Kế toán Từ chối thì dự án giữ \"Pending\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-438",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-028"
    ],
    "category": "Kế toán Từ chối PAKD lần đầu",
    "subcategory": "Kết quả từ chối",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Từ chối khi dự án \"Pending\" thì tab \"Lịch sử\" không có thêm dòng chuyển trạng thái dự án"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-439",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "NFR-phuong-an-kinh-doanh-011"
    ],
    "category": "Quyết định cùng lúc và lỗi ghi",
    "subcategory": "Một phiên bản một quyết định",
    "priority": 1,
    "auto": "No",
    "text": "Verify 2 Kế toán cùng bấm Duyệt V1 thì chỉ 1 quyết định được ghi (1 dòng lịch sử \"CFO duyệt PAKD\")"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-440",
    "ref": [
     "E-phuong-an-kinh-doanh-019"
    ],
    "category": "Quyết định cùng lúc và lỗi ghi",
    "subcategory": "Một phiên bản một quyết định",
    "priority": 1,
    "auto": "No",
    "text": "Verify 2 Kế toán cùng bấm Duyệt V1 thì người bấm sau nhận thông báo \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-441",
    "ref": [
     "FR-phuong-an-kinh-doanh-032"
    ],
    "category": "Quyết định cùng lúc và lỗi ghi",
    "subcategory": "Một phiên bản một quyết định",
    "priority": 1,
    "auto": "No",
    "text": "Verify Kế toán A Duyệt, Kế toán B Từ chối cùng V1 cùng lúc thì chỉ 1 quyết định được ghi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-442",
    "ref": [
     "NFR-phuong-an-kinh-doanh-011"
    ],
    "category": "Quyết định cùng lúc và lỗi ghi",
    "subcategory": "Một phiên bản một quyết định",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm Duyệt 2 lần liên tiếp nhanh thì chỉ có 1 dòng lịch sử \"CFO duyệt PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-443",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Quyết định cùng lúc và lỗi ghi",
    "subcategory": "Lỗi ghi khi quyết định",
    "priority": 1,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi Duyệt thì phiên bản vẫn \"Chờ CFO\", số liệu dự án, hợp đồng, Version, lịch sử không đổi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-444",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "E-phuong-an-kinh-doanh-020"
    ],
    "category": "Quyết định cùng lúc và lỗi ghi",
    "subcategory": "Lỗi ghi khi quyết định",
    "priority": 1,
    "auto": "No",
    "text": "Verify sau lỗi ghi khi Duyệt, P-04 giữ Ý kiến đang nhập"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-445",
    "ref": [
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Quyết định cùng lúc và lỗi ghi",
    "subcategory": "Lỗi ghi khi quyết định",
    "priority": 2,
    "auto": "No",
    "text": "Verify bấm Duyệt lại sau lỗi ghi thì duyệt thành công và chỉ có 1 dòng lịch sử \"CFO duyệt PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-446",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Quyết định cùng lúc và lỗi ghi",
    "subcategory": "Lỗi ghi khi quyết định",
    "priority": 1,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi Từ chối thì phiên bản vẫn \"Chờ CFO\", dự án giữ trạng thái và P-04 giữ Ý kiến"
   }
  ]
 },
 {
  "scope": "uc",
  "target": "uc-dieu-chinh-pakd",
  "file": "checklist-uc-dieu-chinh-pakd.md",
  "items": [
   {
    "chk": "CHK-phuong-an-kinh-doanh-447",
    "ref": [
     "FR-phuong-an-kinh-doanh-007",
     "BR-phuong-an-kinh-doanh-003"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Nút \"Sửa PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Đang thực hiện\" khối mình không có bản chờ thấy nút \"Sửa PAKD\" ở góc khung",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-448",
    "ref": [
     "FR-phuong-an-kinh-doanh-007",
     "BR-phuong-an-kinh-doanh-003"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Nút \"Sửa PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán mở dự án \"Đang thực hiện\" không thấy nút \"Sửa PAKD\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-449",
    "ref": [
     "FR-phuong-an-kinh-doanh-007",
     "BR-phuong-an-kinh-doanh-003",
     "BR-phuong-an-kinh-doanh-037"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Nút \"Sửa PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án có bản điều chỉnh \"Chờ CFO\" thì SM không thấy nút \"Sửa PAKD\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-450",
    "ref": [
     "FR-phuong-an-kinh-doanh-007"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Nút \"Sửa PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM đang ở chế độ điều chỉnh thì nút \"Sửa PAKD\" ở góc khung không hiển thị"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-451",
    "ref": [
     "BR-phuong-an-kinh-doanh-003"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Nút \"Sửa PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Pending\" không có nút \"Sửa PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-452",
    "ref": [
     "BR-phuong-an-kinh-doanh-003"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Nút \"Sửa PAKD\"",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Kết thúc\" không có nút \"Sửa PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-453",
    "ref": [
     "BR-phuong-an-kinh-doanh-003"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Nút \"Sửa PAKD\"",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify GĐK khối dự án mở dự án \"Đang thực hiện\" thấy nút \"Sửa PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-454",
    "ref": [
     "FR-phuong-an-kinh-doanh-024",
     "FR-phuong-an-kinh-doanh-006"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Vào chế độ điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM bấm \"Sửa PAKD\" ở góc khung thì khung chuyển sang chế độ điều chỉnh, các ô nhập được",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-455",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Vào chế độ điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM mở dự án \"Đang thực hiện\" không có bản điều chỉnh thấy dòng thông báo \"Dự án đang thực hiện. Giám đốc khối / Giám đốc kinh doanh (SM) có thể sửa PAKD (cập nhật đã ký hợp đồng, thông tin HĐ, chi phí) — Kế toán duyệt lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-456",
    "ref": [
     "FR-phuong-an-kinh-doanh-024"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Vào chế độ điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Sửa PAKD\" trên dòng thông báo khi đang sửa thông tin cơ bản thì thoát chế độ sửa thông tin cơ bản"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-457",
    "ref": [
     "FR-phuong-an-kinh-doanh-024"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Vào chế độ điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Sửa PAKD\" trên dòng thông báo khi đang ở tab \"Lịch sử\" thì chuyển về tab \"Thông tin dự án\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-458",
    "ref": [
     "FR-phuong-an-kinh-doanh-024"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Vào chế độ điều chỉnh",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify bấm \"Sửa PAKD\" trên dòng thông báo thì màn cuộn tới khung PAKD"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-459",
    "ref": [
     "FR-phuong-an-kinh-doanh-024"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Vào chế độ điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Sửa PAKD\" ở góc khung khi đang sửa thông tin cơ bản thì đầu trang chỉ có \"Huỷ sửa\" · \"Lưu thay đổi\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-460",
    "ref": [
     "FR-phuong-an-kinh-doanh-024"
    ],
    "category": "Mở chế độ điều chỉnh",
    "subcategory": "Vào chế độ điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau khi thoát chế độ sửa thông tin cơ bản thì đầu trang hiện nút \"Lưu nháp\" · \"Gửi Kế toán duyệt điều chỉnh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-461",
    "ref": [
     "FR-phuong-an-kinh-doanh-007"
    ],
    "category": "Giao diện chế độ điều chỉnh",
    "subcategory": "Tiêu đề, dải, nút",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify ở chế độ điều chỉnh tiêu đề khung là \"Phương án kinh doanh (PAKD) — điều chỉnh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-462",
    "ref": [
     "FR-phuong-an-kinh-doanh-025"
    ],
    "category": "Giao diện chế độ điều chỉnh",
    "subcategory": "Tiêu đề, dải, nút",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify ở chế độ điều chỉnh hiện dải xanh \"Đang sửa PAKD. Cập nhật Tình trạng dự án → Đã ký khi đã ký hợp đồng, rồi nhập tiếp thông tin hợp đồng, mốc nghiệm thu và kế hoạch chi phí theo tháng. Gửi Kế toán duyệt lại để áp dụng.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-463",
    "ref": [
     "FR-phuong-an-kinh-doanh-020"
    ],
    "category": "Giao diện chế độ điều chỉnh",
    "subcategory": "Tiêu đề, dải, nút",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify ở chế độ điều chỉnh chưa lưu bản nào, đầu trang có \"Huỷ sửa\" · \"Lưu nháp\" · \"Gửi Kế toán duyệt điều chỉnh\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-464",
    "ref": [
     "BR-phuong-an-kinh-doanh-040"
    ],
    "category": "Giao diện chế độ điều chỉnh",
    "subcategory": "Tiêu đề, dải, nút",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ở chế độ điều chỉnh chân khung hiển thị \"Sửa PAKD (bản điều chỉnh) → Gửi Kế toán (CFO) duyệt lại. Số liệu dự án chỉ thay đổi khi bản điều chỉnh được duyệt.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-465",
    "ref": [
     "FR-phuong-an-kinh-doanh-020"
    ],
    "category": "Giao diện chế độ điều chỉnh",
    "subcategory": "Tiêu đề, dải, nút",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify sau Lưu nháp bản điều chỉnh, chân khung hiển thị \"· Lưu lần cuối dd/mm/yyyy bởi {người}\" của bản điều chỉnh"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-466",
    "ref": [
     "FR-phuong-an-kinh-doanh-012",
     "BR-phuong-an-kinh-doanh-021"
    ],
    "category": "Giao diện chế độ điều chỉnh",
    "subcategory": "Tình trạng trong bản điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify PAKD đang áp dụng là Đã ký, ở chế độ điều chỉnh lựa chọn \"Chưa ký\" bị khoá",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-467",
    "ref": [
     "FR-phuong-an-kinh-doanh-012",
     "BR-phuong-an-kinh-doanh-021"
    ],
    "category": "Giao diện chế độ điều chỉnh",
    "subcategory": "Tình trạng trong bản điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh nháp đã được cập nhật theo hợp đồng (dự án đã ký) thì lựa chọn \"Chưa ký\" bị khoá"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-468",
    "ref": [
     "FR-phuong-an-kinh-doanh-012"
    ],
    "category": "Giao diện chế độ điều chỉnh",
    "subcategory": "Tình trạng trong bản điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify PAKD đang áp dụng Chưa ký, đổi sang Đã ký trong chế độ điều chỉnh thì hiện Mục 2, Mục 3, Mục 4"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-469",
    "ref": [
     "FR-phuong-an-kinh-doanh-026"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp thành công",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm Lưu nháp ở chế độ điều chỉnh thì hiện toast \"Đã lưu nháp bản điều chỉnh PAKD\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-470",
    "ref": [
     "FR-phuong-an-kinh-doanh-026",
     "BR-phuong-an-kinh-doanh-024"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp thành công",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Lưu nháp bản điều chỉnh còn thiếu trường bắt buộc vẫn lưu, không hiện dải lỗi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-471",
    "ref": [
     "FR-phuong-an-kinh-doanh-026"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp thành công",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau Lưu nháp bản điều chỉnh cột \"Giá trị hợp đồng dự kiến\" và cột \"Phiên bản PAKD\" giữ theo bản đã duyệt V1"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-472",
    "ref": [
     "FR-phuong-an-kinh-doanh-026",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp thành công",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Lưu nháp bản điều chỉnh thì tab \"Lịch sử\" có dòng \"Lưu nháp điều chỉnh PAKD\" không có ghi chú"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-473",
    "ref": [
     "FR-phuong-an-kinh-doanh-026"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp thành công",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau Lưu nháp bản điều chỉnh, khung vẫn ở chế độ điều chỉnh"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-474",
    "ref": [
     "FR-phuong-an-kinh-doanh-020"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp thành công",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau Lưu nháp bản điều chỉnh, nút \"Huỷ sửa\" đổi thành \"Huỷ bản điều chỉnh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-475",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp thành công",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify có bản điều chỉnh nháp, SM mở dự án thấy dòng thông báo \"Có bản điều chỉnh PAKD đang soạn — sửa tiếp và gửi Kế toán duyệt lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-476",
    "ref": [
     "FR-phuong-an-kinh-doanh-024"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp thành công",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify có bản điều chỉnh nháp thì dòng thông báo có nút \"Tiếp tục sửa PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-477",
    "ref": [
     "FR-phuong-an-kinh-doanh-026"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp thành công",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Lưu nháp bản điều chỉnh có Phạm vi công việc 1.001 ký tự thì dải lỗi có câu vượt độ dài và không lưu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-478",
    "ref": [
     "E-phuong-an-kinh-doanh-019"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify GĐK Lưu nháp bản điều chỉnh đúng lúc SM vừa gửi bản đó thì bị từ chối với thông báo \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-479",
    "ref": [
     "FR-phuong-an-kinh-doanh-026"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify GĐK Lưu nháp bản điều chỉnh đúng lúc SM vừa gửi bản đó thì nội dung bản V2 đã gửi không bị ghi đè"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-480",
    "ref": [
     "FR-phuong-an-kinh-doanh-026"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify sau thông báo dữ liệu vừa đổi, khung của GĐK nạp lại hiển thị bản điều chỉnh chờ duyệt với nhãn \"Chờ duyệt V2\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-481",
    "ref": [
     "FR-phuong-an-kinh-doanh-026"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 2,
    "auto": "No",
    "text": "Verify Lưu nháp bản điều chỉnh đúng lúc dự án vừa Kết thúc thì hiện thông báo dữ liệu vừa đổi và không lưu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-482",
    "ref": [
     "FR-phuong-an-kinh-doanh-026",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Lưu nháp bản điều chỉnh",
    "subcategory": "Lưu nháp — dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi Lưu nháp bản điều chỉnh thì khung giữ nội dung đang nhập"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-483",
    "ref": [
     "FR-phuong-an-kinh-doanh-022",
     "BR-phuong-an-kinh-doanh-024"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kiểm tra khi gửi điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh Đã ký tổng % mốc 80, bấm \"Gửi Kế toán duyệt điều chỉnh\" thì hiện dải đỏ \"Chưa gửi được — cần bổ sung:\" có câu tổng % mốc và không gửi",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-484",
    "ref": [
     "FR-phuong-an-kinh-doanh-027",
     "BR-phuong-an-kinh-doanh-025"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify gửi điều chỉnh hợp lệ khi đã có V1 duyệt thì hiện toast \"Đã gửi bản điều chỉnh PAKD V2 — chờ Kế toán (CFO) duyệt lại\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-485",
    "ref": [
     "FR-phuong-an-kinh-doanh-027"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify gửi điều chỉnh thì dự án vẫn \"Đang thực hiện\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-486",
    "ref": [
     "FR-phuong-an-kinh-doanh-027",
     "BR-phuong-an-kinh-doanh-037"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify gửi điều chỉnh thì cột \"Giá trị hợp đồng dự kiến\" vẫn theo V1 đã duyệt",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-487",
    "ref": [
     "FR-phuong-an-kinh-doanh-027"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify gửi điều chỉnh thì cột \"Phiên bản PAKD\" hiển thị \"V2, chờ CFO\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-488",
    "ref": [
     "FR-phuong-an-kinh-doanh-027",
     "BR-phuong-an-kinh-doanh-037"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau gửi điều chỉnh khung hiển thị bản điều chỉnh ở chế độ chỉ xem với nhãn \"Chờ duyệt V2\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-489",
    "ref": [
     "FR-phuong-an-kinh-doanh-025"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau gửi điều chỉnh hiện dải vàng \"Đang hiển thị bản điều chỉnh V2 chờ Kế toán (CFO) duyệt. Số liệu dự án vẫn theo bản đã duyệt V1 cho đến khi bản điều chỉnh được duyệt.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-490",
    "ref": [
     "FR-phuong-an-kinh-doanh-027",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify gửi điều chỉnh thì tab \"Lịch sử\" có dòng \"Gửi điều chỉnh PAKD\" với ghi chú kết thúc \"· Chờ Kế toán (CFO) duyệt lại\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-491",
    "ref": [
     "FR-phuong-an-kinh-doanh-027"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau gửi điều chỉnh đầu trang không còn nút \"Lưu nháp\" · \"Gửi Kế toán duyệt điều chỉnh\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-492",
    "ref": [
     "FR-phuong-an-kinh-doanh-027",
     "BR-phuong-an-kinh-doanh-044"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 2,
    "auto": "No",
    "text": "Verify gửi điều chỉnh thì hệ thống lưu bản chụp nội dung bản điều chỉnh gắn với V2"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-493",
    "ref": [
     "NFR-phuong-an-kinh-doanh-011"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Kết quả gửi điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Gửi Kế toán duyệt điều chỉnh\" 2 lần liên tiếp nhanh thì chỉ có 1 phiên bản \"V2, chờ CFO\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-494",
    "ref": [
     "BR-phuong-an-kinh-doanh-003",
     "E-phuong-an-kinh-doanh-018"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Gửi điều chỉnh — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify SM khối khác gửi yêu cầu ghi bản điều chỉnh bằng đường ngoài giao diện thì bị từ chối \"Bạn không có quyền thực hiện thao tác này.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-495",
    "ref": [
     "FR-phuong-an-kinh-doanh-027"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Gửi điều chỉnh — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify SM bấm gửi điều chỉnh đúng lúc GĐK vừa gửi bản đó thì không sinh phiên bản thứ hai (chỉ có 1 phiên bản V2)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-496",
    "ref": [
     "FR-phuong-an-kinh-doanh-027"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Gửi điều chỉnh — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 2,
    "auto": "No",
    "text": "Verify SM bấm gửi điều chỉnh đúng lúc dự án vừa Kết thúc thì hiện thông báo dữ liệu vừa đổi và không gửi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-497",
    "ref": [
     "FR-phuong-an-kinh-doanh-027",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Gửi Kế toán duyệt điều chỉnh",
    "subcategory": "Gửi điều chỉnh — quyền, dữ liệu vừa đổi và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi gửi điều chỉnh thì không có phiên bản mới và khung giữ nội dung đang nhập"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-498",
    "ref": [
     "FR-phuong-an-kinh-doanh-028"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ sửa (chưa lưu bản điều chỉnh)",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm \"Huỷ sửa\" khi chưa lưu bản điều chỉnh thì thoát chế độ sửa và khung hiển thị lại PAKD đang áp dụng, phần đã nhập bị bỏ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-499",
    "ref": [
     "FR-phuong-an-kinh-doanh-028"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ sửa (chưa lưu bản điều chỉnh)",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Huỷ sửa\" thì tab \"Lịch sử\" không có dòng mới"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-500",
    "ref": [
     "FR-phuong-an-kinh-doanh-028"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ sửa (chưa lưu bản điều chỉnh)",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify bấm \"Huỷ sửa\" thì không có toast"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-501",
    "ref": [
     "FR-phuong-an-kinh-doanh-028"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm \"Huỷ bản điều chỉnh\" khi có bản nháp thì hiện toast \"Đã huỷ bản điều chỉnh PAKD\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-502",
    "ref": [
     "FR-phuong-an-kinh-doanh-028"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau Huỷ bản điều chỉnh khung hiển thị PAKD đang áp dụng với nhãn \"Đã duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-503",
    "ref": [
     "FR-phuong-an-kinh-doanh-028",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Huỷ bản điều chỉnh thì tab \"Lịch sử\" có dòng \"Huỷ bản điều chỉnh PAKD\" không có ghi chú"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-504",
    "ref": [
     "FR-phuong-an-kinh-doanh-028"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm \"Huỷ bản điều chỉnh\" thực hiện ngay, không có hộp hỏi xác nhận"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-505",
    "ref": [
     "FR-phuong-an-kinh-doanh-028",
     "FR-phuong-an-kinh-doanh-033",
     "BR-phuong-an-kinh-doanh-042"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Huỷ bản điều chỉnh V2 bị từ chối thì cột \"Phiên bản PAKD\" hiển thị \"V1, đã duyệt\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-506",
    "ref": [
     "BR-phuong-an-kinh-doanh-042"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Huỷ bản điều chỉnh V2 bị từ chối thì mục meta \"PAKD\" hiển thị \"V1, đã duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-507",
    "ref": [
     "FR-phuong-an-kinh-doanh-034",
     "BR-phuong-an-kinh-doanh-042"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Huỷ bản điều chỉnh bị từ chối thì cột \"Hạn lập PAKD\" hiển thị \"Duyệt\" kèm ngày duyệt của V1"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-508",
    "ref": [
     "FR-phuong-an-kinh-doanh-028",
     "NFR-phuong-an-kinh-doanh-008"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 2,
    "auto": "No",
    "text": "Verify nội dung bản điều chỉnh bị huỷ vẫn được lưu trong dữ liệu (không xoá cứng)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-509",
    "ref": [
     "FR-phuong-an-kinh-doanh-028"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 1,
    "auto": "No",
    "text": "Verify bấm \"Huỷ bản điều chỉnh\" đúng lúc bản đó vừa được người khác gửi duyệt thì thao tác huỷ bị từ chối với thông báo \"Dữ liệu vừa được người khác cập nhật — đã tải lại, vui lòng xem lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-510",
    "ref": [
     "FR-phuong-an-kinh-doanh-028",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Huỷ sửa và Huỷ bản điều chỉnh",
    "subcategory": "Huỷ bản điều chỉnh",
    "priority": 2,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi Huỷ bản điều chỉnh thì bản điều chỉnh còn nguyên"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-511",
    "ref": [
     "FR-phuong-an-kinh-doanh-025"
    ],
    "category": "Bản điều chỉnh bị từ chối — sửa tiếp",
    "subcategory": "Hiển thị và gửi lại",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh V2 bị từ chối thì khung có dải đỏ bắt đầu \"Bản điều chỉnh V2 bị Kế toán từ chối: {ý kiến}.\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-512",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Bản điều chỉnh bị từ chối — sửa tiếp",
    "subcategory": "Hiển thị và gửi lại",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh bị từ chối, SM thấy dòng thông báo \"Có bản điều chỉnh PAKD bị Kế toán từ chối — sửa tiếp và gửi Kế toán duyệt lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-513",
    "ref": [
     "FR-phuong-an-kinh-doanh-024"
    ],
    "category": "Bản điều chỉnh bị từ chối — sửa tiếp",
    "subcategory": "Hiển thị và gửi lại",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm \"Tiếp tục sửa PAKD\" thì khung mở chế độ điều chỉnh với nội dung bản bị từ chối",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-514",
    "ref": [
     "BR-phuong-an-kinh-doanh-025"
    ],
    "category": "Bản điều chỉnh bị từ chối — sửa tiếp",
    "subcategory": "Hiển thị và gửi lại",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify gửi lại bản điều chỉnh V2 bị từ chối thì toast \"Đã gửi bản điều chỉnh PAKD V2 — chờ Kế toán (CFO) duyệt lại\" (giữ số V2)",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-515",
    "ref": [
     "FR-phuong-an-kinh-doanh-047"
    ],
    "category": "Kết thúc dự án khi còn bản điều chỉnh",
    "subcategory": "Báo trước và tự huỷ",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án có bản điều chỉnh nháp, bấm Kết thúc dự án thì hộp xác nhận có câu \"Dự án còn bản điều chỉnh PAKD chưa gửi — bản này sẽ bị huỷ.\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-516",
    "ref": [
     "FR-phuong-an-kinh-doanh-047"
    ],
    "category": "Kết thúc dự án khi còn bản điều chỉnh",
    "subcategory": "Báo trước và tự huỷ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án có bản điều chỉnh bị từ chối chưa huỷ, bấm Kết thúc dự án thì hộp xác nhận có câu báo bản điều chỉnh sẽ bị huỷ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-517",
    "ref": [
     "FR-phuong-an-kinh-doanh-047"
    ],
    "category": "Kết thúc dự án khi còn bản điều chỉnh",
    "subcategory": "Báo trước và tự huỷ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án không có bản điều chỉnh, hộp xác nhận Kết thúc dự án không có câu \"Dự án còn bản điều chỉnh PAKD chưa gửi — bản này sẽ bị huỷ.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-518",
    "ref": [
     "FR-phuong-an-kinh-doanh-047"
    ],
    "category": "Kết thúc dự án khi còn bản điều chỉnh",
    "subcategory": "Báo trước và tự huỷ",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify xác nhận Kết thúc dự án có bản điều chỉnh nháp thì khung hiển thị PAKD đang áp dụng (bản điều chỉnh đã tự huỷ)",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-519",
    "ref": [
     "FR-phuong-an-kinh-doanh-047",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Kết thúc dự án khi còn bản điều chỉnh",
    "subcategory": "Báo trước và tự huỷ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Kết thúc dự án có bản điều chỉnh thì tab \"Lịch sử\" có dòng \"Huỷ bản điều chỉnh PAKD (Kết thúc dự án)\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-520",
    "ref": [
     "FR-phuong-an-kinh-doanh-047"
    ],
    "category": "Kết thúc dự án khi còn bản điều chỉnh",
    "subcategory": "Báo trước và tự huỷ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Kết thúc dự án có bản điều chỉnh V2 bị từ chối thì cột \"Phiên bản PAKD\" hiển thị \"V1, đã duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-521",
    "ref": [
     "FR-phuong-an-kinh-doanh-047"
    ],
    "category": "Kết thúc dự án khi còn bản điều chỉnh",
    "subcategory": "Báo trước và tự huỷ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án có bản điều chỉnh \"Chờ CFO\" thì không kết thúc được dự án",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-522",
    "ref": [
     "FR-phuong-an-kinh-doanh-047"
    ],
    "category": "Kết thúc dự án khi còn bản điều chỉnh",
    "subcategory": "Báo trước và tự huỷ",
    "priority": 2,
    "auto": "No",
    "text": "Verify nội dung bản điều chỉnh tự huỷ khi Kết thúc vẫn được lưu trong dữ liệu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-523",
    "ref": [
     "FR-phuong-an-kinh-doanh-047",
     "E-phuong-an-kinh-doanh-020"
    ],
    "category": "Kết thúc dự án khi còn bản điều chỉnh",
    "subcategory": "Báo trước và tự huỷ",
    "priority": 1,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi Kết thúc dự án có bản điều chỉnh thì dự án chưa kết thúc và bản điều chỉnh còn nguyên"
   }
  ]
 },
 {
  "scope": "uc",
  "target": "uc-duyet-dieu-chinh-pakd",
  "file": "checklist-uc-duyet-dieu-chinh-pakd.md",
  "items": [
   {
    "chk": "CHK-phuong-an-kinh-doanh-524",
    "ref": [
     "FR-phuong-an-kinh-doanh-035"
    ],
    "category": "Mở P-04 bản điều chỉnh",
    "subcategory": "Từ danh sách và màn chi tiết",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán xem danh sách thấy link \"Duyệt điều chỉnh\" ở dự án \"Đang thực hiện\" có bản điều chỉnh chờ duyệt",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-525",
    "ref": [
     "FR-phuong-an-kinh-doanh-029"
    ],
    "category": "Mở P-04 bản điều chỉnh",
    "subcategory": "Từ danh sách và màn chi tiết",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm link \"Duyệt điều chỉnh\" mở P-04 ngay trên danh sách"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-526",
    "ref": [
     "FR-phuong-an-kinh-doanh-035"
    ],
    "category": "Mở P-04 bản điều chỉnh",
    "subcategory": "Từ danh sách và màn chi tiết",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM xem danh sách thấy link \"Cập nhật\" ở dự án có bản điều chỉnh chờ duyệt"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-527",
    "ref": [
     "FR-phuong-an-kinh-doanh-035"
    ],
    "category": "Mở P-04 bản điều chỉnh",
    "subcategory": "Từ danh sách và màn chi tiết",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bấm link \"Cập nhật\" mở màn chi tiết của dự án"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-528",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Mở P-04 bản điều chỉnh",
    "subcategory": "Từ danh sách và màn chi tiết",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán mở dự án có bản điều chỉnh chờ thấy dòng thông báo \"Bản điều chỉnh PAKD V2 đang chờ Kế toán (CFO) duyệt lại.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-529",
    "ref": [
     "FR-phuong-an-kinh-doanh-029"
    ],
    "category": "Mở P-04 bản điều chỉnh",
    "subcategory": "Từ danh sách và màn chi tiết",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bấm nút \"Duyệt / Từ chối điều chỉnh\" trên dòng thông báo mở P-04",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-530",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Mở P-04 bản điều chỉnh",
    "subcategory": "Từ danh sách và màn chi tiết",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM mở dự án có bản điều chỉnh chờ thấy dòng thông báo \"Đang chờ Kế toán (CFO) duyệt bản điều chỉnh PAKD V2.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-531",
    "ref": [
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Mở P-04 bản điều chỉnh",
    "subcategory": "Từ danh sách và màn chi tiết",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM mở dự án có bản điều chỉnh chờ thấy dòng thông báo \"Đang chờ Kế toán duyệt PAKD.\" không có số phiên bản"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-532",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "So sánh cũ → mới",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify P-04 của bản điều chỉnh V2 có tiêu đề \"CFO duyệt bản điều chỉnh PAKD — V2\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-533",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "So sánh cũ → mới",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh đổi Chưa ký sang Đã ký thì P-04 hiện Tình trạng hợp đồng \"Chưa ký → Đã ký\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-534",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "So sánh cũ → mới",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify P-04 hiện Doanh thu, Chi phí kế hoạch, LN gộp dạng giá trị cũ (gạch ngang) → giá trị mới",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-535",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "So sánh cũ → mới",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify LN gộp mới trên P-04 điều chỉnh kèm biên % của bản mới"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-536",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "So sánh cũ → mới",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh mới là Đã ký thì P-04 hiện Số HĐ / ngày ký"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-537",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "So sánh cũ → mới",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh mới là Chưa ký thì P-04 không hiện Số HĐ / ngày ký"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-538",
    "ref": [
     "FR-phuong-an-kinh-doanh-030"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "So sánh cũ → mới",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify P-04 điều chỉnh có chú thích \"Duyệt → áp dụng bản điều chỉnh (doanh thu, chi phí, hợp đồng, kế hoạch theo tháng). Từ chối → giữ bản đang áp dụng, bản điều chỉnh trả về GĐK / SM sửa tiếp.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-539",
    "ref": [
     "FR-phuong-an-kinh-doanh-030",
     "E-phuong-an-kinh-doanh-015"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "So sánh cũ → mới",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án có hợp đồng lệch doanh thu bản điều chỉnh 3% thì P-04 điều chỉnh hiện dòng \"Giá trị HĐ hiện có {x} — lệch {z%} ⚠\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-540",
    "ref": [
     "FR-phuong-an-kinh-doanh-030",
     "FR-phuong-an-kinh-doanh-041",
     "BR-phuong-an-kinh-doanh-024",
     "E-phuong-an-kinh-doanh-023"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "Điểm chưa đạt và cập nhật theo hợp đồng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh sinh từ P-03 (PAKD áp dụng Chưa ký chuyển Đã ký, tổng % mốc 0) thì P-04 hiện khối \"Chưa đạt kiểm tra gửi:\" có dòng \"Tổng % các mốc nghiệm thu phải bằng 100% (hiện 0%)\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-541",
    "ref": [
     "E-phuong-an-kinh-doanh-023"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "Điểm chưa đạt và cập nhật theo hợp đồng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify P-04 có khối \"Chưa đạt kiểm tra gửi:\" Kế toán vẫn Từ chối kèm ý kiến được"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-542",
    "ref": [
     "FR-phuong-an-kinh-doanh-043"
    ],
    "category": "Nội dung P-04 dạng bản điều chỉnh",
    "subcategory": "Điểm chưa đạt và cập nhật theo hợp đồng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh chờ có dấu cập nhật theo hợp đồng thì P-04 hiển thị đủ nhãn \"Cập nhật theo hợp đồng sau khi nộp\", phần so sánh 8 trường với bản chụp và phần cũ → mới"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-543",
    "ref": [
     "FR-phuong-an-kinh-doanh-031"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt bản điều chỉnh thì hiện toast \"Kế toán đã duyệt bản điều chỉnh PAKD V2 — đã cập nhật số liệu dự án\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-544",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "BR-phuong-an-kinh-doanh-029"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt bản điều chỉnh doanh thu 1,200,000,000 thì cột \"Giá trị hợp đồng dự kiến\" cập nhật 1,200,000,000",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-545",
    "ref": [
     "FR-phuong-an-kinh-doanh-031"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt bản điều chỉnh thì cột \"Phiên bản PAKD\" hiển thị \"V2, đã duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-546",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "BR-phuong-an-kinh-doanh-029"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt bản điều chỉnh thì khung hiển thị nội dung bản điều chỉnh làm PAKD đang áp dụng, nhãn \"Đã duyệt\", không còn dải điều chỉnh",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-547",
    "ref": [
     "BR-phuong-an-kinh-doanh-029"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt bản điều chỉnh thì dự án vẫn \"Đang thực hiện\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-548",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Duyệt bản điều chỉnh thì tab \"Lịch sử\" có dòng \"CFO duyệt điều chỉnh PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-549",
    "ref": [
     "BR-phuong-an-kinh-doanh-029"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 1,
    "auto": "No",
    "text": "Verify Duyệt bản điều chỉnh thì kế hoạch theo tháng của dự án được thay bằng kế hoạch sinh từ bản điều chỉnh"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-550",
    "ref": [
     "FR-phuong-an-kinh-doanh-045"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt bản điều chỉnh Đã ký khi dự án chưa có hợp đồng thì P-03 hiển thị hợp đồng ban đầu tạo từ bản điều chỉnh",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-551",
    "ref": [
     "FR-phuong-an-kinh-doanh-045"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tạo hợp đồng ban đầu từ bản điều chỉnh thì tab \"Lịch sử\" có dòng \"Tạo hợp đồng từ PAKD V2\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-552",
    "ref": [
     "FR-phuong-an-kinh-doanh-045"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Duyệt bản điều chỉnh Đã ký khi dự án đã có hợp đồng thì hợp đồng giữ nguyên"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-553",
    "ref": [
     "FR-phuong-an-kinh-doanh-007"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau Duyệt bản điều chỉnh SM thấy lại nút \"Sửa PAKD\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-554",
    "ref": [
     "BR-phuong-an-kinh-doanh-025"
    ],
    "category": "Kế toán Duyệt bản điều chỉnh",
    "subcategory": "Kết quả duyệt điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify điều chỉnh tiếp sau khi V2 được duyệt thì lần gửi kế tiếp mang số V3",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-555",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "E-phuong-an-kinh-doanh-011"
    ],
    "category": "Kế toán Từ chối bản điều chỉnh",
    "subcategory": "Kết quả từ chối điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Từ chối bản điều chỉnh khi Ý kiến trống thì hiện \"Nhập lý do từ chối\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-556",
    "ref": [
     "FR-phuong-an-kinh-doanh-032"
    ],
    "category": "Kế toán Từ chối bản điều chỉnh",
    "subcategory": "Kết quả từ chối điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Từ chối bản điều chỉnh có ý kiến thì hiện toast \"Kế toán đã từ chối bản điều chỉnh PAKD V2 — giữ bản đang áp dụng\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-557",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-029"
    ],
    "category": "Kế toán Từ chối bản điều chỉnh",
    "subcategory": "Kết quả từ chối điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Từ chối bản điều chỉnh thì cột \"Giá trị hợp đồng dự kiến\" giữ theo V1",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-558",
    "ref": [
     "BR-phuong-an-kinh-doanh-029"
    ],
    "category": "Kế toán Từ chối bản điều chỉnh",
    "subcategory": "Kết quả từ chối điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Từ chối bản điều chỉnh thì cột \"Phiên bản PAKD\" hiển thị \"V2, từ chối\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-559",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-029"
    ],
    "category": "Kế toán Từ chối bản điều chỉnh",
    "subcategory": "Kết quả từ chối điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau Từ chối bản điều chỉnh, SM mở dự án thấy nhãn \"Điều chỉnh bị từ chối\" và nội dung bản điều chỉnh còn để sửa tiếp",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-560",
    "ref": [
     "BR-phuong-an-kinh-doanh-029"
    ],
    "category": "Kế toán Từ chối bản điều chỉnh",
    "subcategory": "Kết quả từ chối điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Từ chối bản điều chỉnh thì dự án vẫn \"Đang thực hiện\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-561",
    "ref": [
     "FR-phuong-an-kinh-doanh-032",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Kế toán Từ chối bản điều chỉnh",
    "subcategory": "Kết quả từ chối điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Từ chối bản điều chỉnh thì tab \"Lịch sử\" có dòng \"CFO từ chối điều chỉnh PAKD\" kèm ý kiến"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-562",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "FR-phuong-an-kinh-doanh-032"
    ],
    "category": "Quyết định điều chỉnh — cùng lúc và lỗi ghi",
    "subcategory": "Dữ liệu vừa đổi, quyền và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify 2 Kế toán cùng quyết định bản điều chỉnh V2 thì chỉ 1 quyết định được ghi, người sau nhận thông báo dữ liệu vừa đổi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-563",
    "ref": [
     "FR-phuong-an-kinh-doanh-043"
    ],
    "category": "Quyết định điều chỉnh — cùng lúc và lỗi ghi",
    "subcategory": "Dữ liệu vừa đổi, quyền và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify nội dung bản điều chỉnh đổi (lưu P-03) trong lúc P-04 mở, Kế toán bấm Duyệt thì không ghi, P-04 nạp lại và giữ Ý kiến"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-564",
    "ref": [
     "BR-phuong-an-kinh-doanh-004"
    ],
    "category": "Quyết định điều chỉnh — cùng lúc và lỗi ghi",
    "subcategory": "Dữ liệu vừa đổi, quyền và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify SM gửi yêu cầu ghi quyết định điều chỉnh bằng đường ngoài giao diện thì bị từ chối \"Bạn không có quyền thực hiện thao tác này.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-565",
    "ref": [
     "FR-phuong-an-kinh-doanh-031",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Quyết định điều chỉnh — cùng lúc và lỗi ghi",
    "subcategory": "Dữ liệu vừa đổi, quyền và lỗi ghi",
    "priority": 1,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi Duyệt bản điều chỉnh thì số liệu dự án, PAKD đang áp dụng, phiên bản giữ nguyên và P-04 giữ Ý kiến"
   }
  ]
 },
 {
  "scope": "uc",
  "target": "uc-dong-bo-hop-dong-vao-pakd",
  "file": "checklist-uc-dong-bo-hop-dong-vao-pakd.md",
  "items": [
   {
    "chk": "CHK-phuong-an-kinh-doanh-566",
    "ref": [
     "BR-phuong-an-kinh-doanh-041"
    ],
    "category": "Quyền lưu P-03",
    "subcategory": "Vai trò lưu hợp đồng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM khối dự án lưu P-03 thành công",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-567",
    "ref": [
     "BR-phuong-an-kinh-doanh-041"
    ],
    "category": "Quyền lưu P-03",
    "subcategory": "Vai trò lưu hợp đồng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify GĐK khối dự án lưu P-03 thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-568",
    "ref": [
     "BR-phuong-an-kinh-doanh-041"
    ],
    "category": "Quyền lưu P-03",
    "subcategory": "Vai trò lưu hợp đồng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán lưu P-03 của dự án thuộc khối bất kỳ thành công"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-569",
    "ref": [
     "BR-phuong-an-kinh-doanh-041"
    ],
    "category": "Quyền lưu P-03",
    "subcategory": "Vai trò lưu hợp đồng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM mở P-03 ở chế độ chỉ xem, không có nút lưu",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-570",
    "ref": [
     "FR-phuong-an-kinh-doanh-037",
     "BR-phuong-an-kinh-doanh-041",
     "E-phuong-an-kinh-doanh-018"
    ],
    "category": "Quyền lưu P-03",
    "subcategory": "Vai trò lưu hợp đồng",
    "priority": 1,
    "auto": "No",
    "text": "Verify AM gửi yêu cầu lưu P-03 bằng đường ngoài giao diện thì bị từ chối \"Bạn không có quyền thực hiện thao tác này.\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-571",
    "ref": [
     "FR-phuong-an-kinh-doanh-037",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Quyền lưu P-03",
    "subcategory": "Vai trò lưu hợp đồng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án \"Kết thúc\" thì Kế toán mở P-03 ở chế độ chỉ xem, không lưu được"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-572",
    "ref": [
     "FR-phuong-an-kinh-doanh-041",
     "BR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-025"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án có V1 đã duyệt, chưa có bản điều chỉnh, lưu P-03 với số HĐ khác PAKD thì cột \"Phiên bản PAKD\" hiển thị \"V2, chờ CFO\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-573",
    "ref": [
     "FR-phuong-an-kinh-doanh-041",
     "BR-phuong-an-kinh-doanh-037"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (a), khung PAKD hiển thị bản điều chỉnh với nhãn \"Chờ duyệt V2\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-574",
    "ref": [
     "FR-phuong-an-kinh-doanh-041",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh sinh từ P-03 có Mục 1 Tình trạng \"Đã ký\", Số hợp đồng, Ngày ký trên hợp đồng, Ngày ký thực tế, Giá trị hợp đồng theo hợp đồng vừa lưu",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-575",
    "ref": [
     "FR-phuong-an-kinh-doanh-041",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify hợp đồng có thời hạn 04/2027 – 09/2027 thì bản điều chỉnh có Bắt đầu 04/2027, Kết thúc 09/2027"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-576",
    "ref": [
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify hợp đồng trống ngày ký thì bản điều chỉnh giữ Ngày ký trên hợp đồng cũ của PAKD"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-577",
    "ref": [
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify hợp đồng trống thời hạn thì bản điều chỉnh giữ Bắt đầu / Kết thúc cũ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-578",
    "ref": [
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify hợp đồng giá trị 0 thì bản điều chỉnh giữ Giá trị hợp đồng cũ"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-579",
    "ref": [
     "FR-phuong-an-kinh-doanh-041"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (a), cột \"Giá trị hợp đồng dự kiến\" của dự án giữ theo bản đang áp dụng",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-580",
    "ref": [
     "BR-phuong-an-kinh-doanh-032",
     "BR-phuong-an-kinh-doanh-016"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify PAKD áp dụng Chưa ký, chưa có khoản mục có giá trị, lưu P-03 thì bản điều chỉnh có kế hoạch chi phí theo tháng sinh từ các giai đoạn có \"Từ\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-581",
    "ref": [
     "FR-phuong-an-kinh-doanh-041",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh sinh từ P-03 thì tab \"Lịch sử\" có dòng \"Gửi điều chỉnh PAKD V2 (theo hợp đồng)\" với người thực hiện là người lưu P-03"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-582",
    "ref": [
     "FR-phuong-an-kinh-doanh-041"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify P-04 của bản điều chỉnh sinh từ P-03 hiển thị Người nộp là người đã lưu P-03"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-583",
    "ref": [
     "FR-phuong-an-kinh-doanh-041",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh sinh từ P-03 không đạt kiểm tra gửi vẫn ở \"Chờ CFO\" (cột hiển thị \"V2, chờ CFO\"), không thành bản nháp",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-584",
    "ref": [
     "FR-phuong-an-kinh-doanh-041"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh sinh từ P-03 không đạt kiểm tra gửi thì hợp đồng vẫn được lưu (P-03 hiển thị thông tin mới)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-585",
    "ref": [
     "FR-phuong-an-kinh-doanh-041",
     "BR-phuong-an-kinh-doanh-044"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 2,
    "auto": "No",
    "text": "Verify bản điều chỉnh sinh từ P-03 có bản chụp nội dung lúc nộp gắn với V2"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-586",
    "ref": [
     "FR-phuong-an-kinh-doanh-041",
     "NFR-phuong-an-kinh-doanh-011"
    ],
    "category": "Nhánh (a) — đã có PAKD được duyệt",
    "subcategory": "Sinh bản điều chỉnh chờ duyệt",
    "priority": 1,
    "auto": "No",
    "text": "Verify 2 người lưu P-03 cùng lúc cho dự án đã có PAKD duyệt thì chỉ sinh 1 bản điều chỉnh, số phiên bản không trùng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-587",
    "ref": [
     "FR-phuong-an-kinh-doanh-042",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (b), (d) — bản đang chờ duyệt",
    "subcategory": "Cập nhật bản đang chờ",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify PAKD lần đầu V1 đang chờ, lưu P-03 với số HĐ khác thì khung hiển thị Mục 1 bản chờ theo hợp đồng mới",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-588",
    "ref": [
     "FR-phuong-an-kinh-doanh-042"
    ],
    "category": "Nhánh (b), (d) — bản đang chờ duyệt",
    "subcategory": "Cập nhật bản đang chờ",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (b), cột \"Phiên bản PAKD\" vẫn \"V1, chờ CFO\" (không sinh phiên bản mới)",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-589",
    "ref": [
     "FR-phuong-an-kinh-doanh-042"
    ],
    "category": "Nhánh (b), (d) — bản đang chờ duyệt",
    "subcategory": "Cập nhật bản đang chờ",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (b), Kế toán mở P-04 thấy nhãn \"Cập nhật theo hợp đồng sau khi nộp\"",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-590",
    "ref": [
     "FR-phuong-an-kinh-doanh-042",
     "BR-phuong-an-kinh-doanh-044"
    ],
    "category": "Nhánh (b), (d) — bản đang chờ duyệt",
    "subcategory": "Cập nhật bản đang chờ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (b), phần so sánh trên P-04 vẫn hiện Số HĐ lúc nộp (bản chụp không đổi)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-591",
    "ref": [
     "FR-phuong-an-kinh-doanh-042",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Nhánh (b), (d) — bản đang chờ duyệt",
    "subcategory": "Cập nhật bản đang chờ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (b), tab \"Lịch sử\" có dòng \"Cập nhật PAKD theo hợp đồng\" ghi chú \"bản đang chờ V1\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-592",
    "ref": [
     "FR-phuong-an-kinh-doanh-042"
    ],
    "category": "Nhánh (b), (d) — bản đang chờ duyệt",
    "subcategory": "Cập nhật bản đang chờ",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (b), cột \"Giá trị hợp đồng dự kiến\" của dự án vẫn \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-593",
    "ref": [
     "FR-phuong-an-kinh-doanh-042",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (b), (d) — bản đang chờ duyệt",
    "subcategory": "Cập nhật bản đang chờ",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh V2 đang chờ, lưu P-03 với giá trị HĐ khác thì Mục 1 bản điều chỉnh cập nhật và cột vẫn \"V2, chờ CFO\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-594",
    "ref": [
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (b), (d) — bản đang chờ duyệt",
    "subcategory": "Cập nhật bản đang chờ",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án \"Pending\" có PAKD đang chờ, lưu P-03 thì bản đang chờ được cập nhật theo hợp đồng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-595",
    "ref": [
     "FR-phuong-an-kinh-doanh-037",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (b), (d) — bản đang chờ duyệt",
    "subcategory": "Cập nhật bản đang chờ",
    "priority": 1,
    "auto": "No",
    "text": "Verify SM Gửi PAKD trước, P-03 được ghi sau thì P-03 áp nhánh (b): bản vừa gửi được cập nhật và gắn dấu"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-596",
    "ref": [
     "FR-phuong-an-kinh-doanh-037",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (c) — PAKD đang lập",
    "subcategory": "Cập nhật bản đang lập",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án \"Chưa có PAKD\" đã Lưu nháp PAKD, lưu P-03 với số HĐ khác thì Mục 1 PAKD đang lập theo hợp đồng mới",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-597",
    "ref": [
     "FR-phuong-an-kinh-doanh-037"
    ],
    "category": "Nhánh (c) — PAKD đang lập",
    "subcategory": "Cập nhật bản đang lập",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (c), cột \"Phiên bản PAKD\" vẫn \"—\" (không sinh phiên bản)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-598",
    "ref": [
     "FR-phuong-an-kinh-doanh-037"
    ],
    "category": "Nhánh (c) — PAKD đang lập",
    "subcategory": "Cập nhật bản đang lập",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (c), cột \"Giá trị hợp đồng dự kiến\" vẫn \"—\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-599",
    "ref": [
     "FR-phuong-an-kinh-doanh-037",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Nhánh (c) — PAKD đang lập",
    "subcategory": "Cập nhật bản đang lập",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (c), tab \"Lịch sử\" có dòng \"Cập nhật PAKD theo hợp đồng\" ghi chú \"bản đang lập\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-600",
    "ref": [
     "FR-phuong-an-kinh-doanh-037",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (c) — PAKD đang lập",
    "subcategory": "Cập nhật bản đang lập",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án bị từ chối đang làm lại, lưu P-03 thì bản đang làm lại được cập nhật và cột vẫn \"V1, từ chối\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-601",
    "ref": [
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (c) — PAKD đang lập",
    "subcategory": "Cập nhật bản đang lập",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify PAKD đang lập Chưa ký chưa có khoản mục có giá trị, lưu P-03 thì bản đang lập chuyển Đã ký với kế hoạch chi phí theo tháng sinh từ giai đoạn"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-602",
    "ref": [
     "FR-phuong-an-kinh-doanh-037"
    ],
    "category": "Nhánh (c) — PAKD đang lập",
    "subcategory": "Cập nhật bản đang lập",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify SM đang mở khung, tự lưu P-03 thì khung PAKD tự nạp lại theo hợp đồng mà không hiện thông báo khung vừa được tải lại"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-603",
    "ref": [
     "FR-phuong-an-kinh-doanh-046",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (e) — bản điều chỉnh nháp / bị từ chối",
    "subcategory": "Cập nhật chính bản điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify có bản điều chỉnh nháp, lưu P-03 với số HĐ khác thì Mục 1 bản điều chỉnh theo hợp đồng mới",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-604",
    "ref": [
     "FR-phuong-an-kinh-doanh-046"
    ],
    "category": "Nhánh (e) — bản điều chỉnh nháp / bị từ chối",
    "subcategory": "Cập nhật chính bản điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (e), phần SM đang soạn ở Mục 3, Mục 4 của bản điều chỉnh giữ nguyên",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-605",
    "ref": [
     "FR-phuong-an-kinh-doanh-046",
     "BR-phuong-an-kinh-doanh-038"
    ],
    "category": "Nhánh (e) — bản điều chỉnh nháp / bị từ chối",
    "subcategory": "Cập nhật chính bản điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (e), cột \"Phiên bản PAKD\" không đổi (không sinh bản điều chỉnh thứ hai, không sinh phiên bản)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-606",
    "ref": [
     "FR-phuong-an-kinh-doanh-046",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (e) — bản điều chỉnh nháp / bị từ chối",
    "subcategory": "Cập nhật chính bản điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh nháp Chưa ký, lưu P-03 thì bảng giai đoạn giữ nguyên, không bị chuyển sang kế hoạch chi phí theo tháng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-607",
    "ref": [
     "FR-phuong-an-kinh-doanh-046"
    ],
    "category": "Nhánh (e) — bản điều chỉnh nháp / bị từ chối",
    "subcategory": "Cập nhật chính bản điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh bị từ chối chưa huỷ, lưu P-03 thì Mục 1 cập nhật và nhãn vẫn \"Điều chỉnh bị từ chối\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-608",
    "ref": [
     "FR-phuong-an-kinh-doanh-046",
     "FR-phuong-an-kinh-doanh-038"
    ],
    "category": "Nhánh (e) — bản điều chỉnh nháp / bị từ chối",
    "subcategory": "Cập nhật chính bản điều chỉnh",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (e), tab \"Lịch sử\" có dòng \"Cập nhật PAKD theo hợp đồng\" ghi chú \"bản điều chỉnh đang soạn\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-609",
    "ref": [
     "FR-phuong-an-kinh-doanh-046"
    ],
    "category": "Nhánh (e) — bản điều chỉnh nháp / bị từ chối",
    "subcategory": "Cập nhật chính bản điều chỉnh",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify sau lưu P-03 nhánh (e), cột \"Giá trị hợp đồng dự kiến\" giữ theo bản đang áp dụng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-610",
    "ref": [
     "FR-phuong-an-kinh-doanh-037",
     "BR-phuong-an-kinh-doanh-032"
    ],
    "category": "Nhánh (g) và trường hợp không có trường khác",
    "subcategory": "Chỉ lưu hợp đồng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify dự án chưa từng lưu PAKD, lưu P-03 thì chỉ lưu hợp đồng, tab \"Lịch sử\" không có dòng \"Cập nhật PAKD theo hợp đồng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-611",
    "ref": [
     "FR-phuong-an-kinh-doanh-041",
     "BR-phuong-an-kinh-doanh-046"
    ],
    "category": "Nhánh (g) và trường hợp không có trường khác",
    "subcategory": "Chỉ lưu hợp đồng",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án có V1 đã duyệt, lưu P-03 với mọi trường ánh xạ giống PAKD thì không sinh bản điều chỉnh (cột vẫn \"V1, đã duyệt\")",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-612",
    "ref": [
     "FR-phuong-an-kinh-doanh-042",
     "BR-phuong-an-kinh-doanh-046"
    ],
    "category": "Nhánh (g) và trường hợp không có trường khác",
    "subcategory": "Chỉ lưu hợp đồng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify PAKD V1 đang chờ, lưu P-03 với mọi trường ánh xạ giống bản chờ thì P-04 không có nhãn \"Cập nhật theo hợp đồng sau khi nộp\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-613",
    "ref": [
     "FR-phuong-an-kinh-doanh-037",
     "BR-phuong-an-kinh-doanh-046"
    ],
    "category": "Nhánh (g) và trường hợp không có trường khác",
    "subcategory": "Chỉ lưu hợp đồng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify PAKD đang lập, lưu P-03 với mọi trường ánh xạ giống bản đang lập thì tab \"Lịch sử\" không có dòng \"Cập nhật PAKD theo hợp đồng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-614",
    "ref": [
     "FR-phuong-an-kinh-doanh-046",
     "BR-phuong-an-kinh-doanh-046"
    ],
    "category": "Nhánh (g) và trường hợp không có trường khác",
    "subcategory": "Chỉ lưu hợp đồng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify bản điều chỉnh nháp, lưu P-03 với mọi trường ánh xạ giống bản đó thì tab \"Lịch sử\" không có dòng \"Cập nhật PAKD theo hợp đồng\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-615",
    "ref": [
     "FR-phuong-an-kinh-doanh-037",
     "FR-phuong-an-kinh-doanh-041",
     "NFR-phuong-an-kinh-doanh-010"
    ],
    "category": "Lỗi ghi khi đồng bộ",
    "subcategory": "Ghi trọn vẹn cùng hợp đồng",
    "priority": 1,
    "auto": "No",
    "text": "Verify giả lập lỗi ghi khi lưu P-03 có đồng bộ PAKD thì hợp đồng và PAKD đều không đổi"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-616",
    "ref": [
     "FR-phuong-an-kinh-doanh-042",
     "FR-phuong-an-kinh-doanh-046"
    ],
    "category": "Lỗi ghi khi đồng bộ",
    "subcategory": "Ghi trọn vẹn cùng hợp đồng",
    "priority": 2,
    "auto": "No",
    "text": "Verify sau lỗi ghi khi lưu P-03, popup P-03 giữ dữ liệu đang nhập"
   }
  ]
 },
 {
  "scope": "uc",
  "target": "uc-nhac-cap-nhat-hop-dong",
  "file": "checklist-uc-nhac-cap-nhat-hop-dong.md",
  "items": [
   {
    "chk": "CHK-phuong-an-kinh-doanh-617",
    "ref": [
     "FR-phuong-an-kinh-doanh-040",
     "BR-phuong-an-kinh-doanh-043"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Bật cảnh báo",
    "priority": 1,
    "auto": "No",
    "text": "Verify PAKD đang áp dụng Chưa ký dự kiến ký 05/2027, dự án chưa có hợp đồng, sau lần xét ngày 01/06/2027 thì danh sách hiện chữ đỏ \"Quá tháng dự kiến ký 05/2027\" dưới tên dự án",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-618",
    "ref": [
     "FR-phuong-an-kinh-doanh-040",
     "FR-phuong-an-kinh-doanh-036"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Bật cảnh báo",
    "priority": 1,
    "auto": "No",
    "text": "Verify dự án quá tháng dự kiến ký chưa có hợp đồng thì dòng thông báo bước của màn chi tiết có chữ đỏ \"Quá tháng dự kiến ký 05/2027\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-619",
    "ref": [
     "FR-phuong-an-kinh-doanh-040",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Bật cảnh báo",
    "priority": 1,
    "auto": "No",
    "text": "Verify AM xem danh sách thấy chữ đỏ \"Quá tháng dự kiến ký 05/2027\" dưới tên dự án, không có số tiền nào",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-620",
    "ref": [
     "FR-phuong-an-kinh-doanh-040"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Bật cảnh báo",
    "priority": 2,
    "auto": "No",
    "text": "Verify AM mở màn chi tiết dự án quá tháng dự kiến ký thấy chữ đỏ \"Quá tháng dự kiến ký 05/2027\" trên dòng thông báo"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-621",
    "ref": [
     "BR-phuong-an-kinh-doanh-043"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Bật cảnh báo",
    "priority": 2,
    "auto": "No",
    "text": "Verify ngày 31/05/2027 (ngày cuối tháng dự kiến ký) thì dự án chưa có cảnh báo \"Quá tháng dự kiến ký\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-622",
    "ref": [
     "BR-phuong-an-kinh-doanh-043"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Bật cảnh báo",
    "priority": 2,
    "auto": "No",
    "text": "Verify PAKD Chưa ký chưa có Thời điểm dự kiến ký thì dự án không có cảnh báo \"Quá tháng dự kiến ký\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-623",
    "ref": [
     "NFR-phuong-an-kinh-doanh-012"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Bật cảnh báo",
    "priority": 2,
    "auto": "No",
    "text": "Verify tác vụ xét hằng ngày lỡ 2 ngày, lần chạy sau tự bật cảnh báo cho dự án đã quá tháng dự kiến ký"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-624",
    "ref": [
     "NFR-phuong-an-kinh-doanh-012"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Bật cảnh báo",
    "priority": 3,
    "auto": "No",
    "text": "Verify tác vụ xét hằng ngày lỗi thì bộ phận vận hành nhận cảnh báo"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-625",
    "ref": [
     "FR-phuong-an-kinh-doanh-040",
     "BR-phuong-an-kinh-doanh-043"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Gỡ cảnh báo",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify dự án đang có chữ đỏ \"Quá tháng dự kiến ký 05/2027\", lưu P-03 thì chữ đỏ biến mất ngay ở danh sách",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-626",
    "ref": [
     "FR-phuong-an-kinh-doanh-040"
    ],
    "category": "Cảnh báo đỏ quá tháng dự kiến ký",
    "subcategory": "Gỡ cảnh báo",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify sau lưu P-03, dòng thông báo bước của màn chi tiết không còn chữ \"Quá tháng dự kiến ký\""
   }
  ]
 },
 {
  "scope": "uc",
  "target": "chung",
  "file": "checklist-uc-chung.md",
  "items": [
   {
    "chk": "CHK-phuong-an-kinh-doanh-627",
    "ref": [
     "FR-phuong-an-kinh-doanh-038",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Phân quyền theo vai trò và khối",
    "subcategory": "AM và dữ liệu PAKD ngoài khung",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM mở tab \"Lịch sử\" của dự án đã có thao tác PAKD thì không thấy dòng thao tác PAKD nào (vd \"Nộp PAKD\", \"CFO duyệt PAKD\")",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-628",
    "ref": [
     "FR-phuong-an-kinh-doanh-038",
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Phân quyền theo vai trò và khối",
    "subcategory": "AM và dữ liệu PAKD ngoài khung",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM mở tab \"Lịch sử\" thì số đếm dòng của tab không tính các dòng thao tác PAKD"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-629",
    "ref": [
     "NFR-phuong-an-kinh-doanh-007"
    ],
    "category": "Phân quyền theo vai trò và khối",
    "subcategory": "AM và dữ liệu PAKD ngoài khung",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify AM không mở được màn Báo cáo hiệu quả dự án (MH-03)",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-630",
    "ref": [
     "BR-phuong-an-kinh-doanh-001"
    ],
    "category": "Phân quyền theo vai trò và khối",
    "subcategory": "AM và dữ liệu PAKD ngoài khung",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify SM khối A Xuất Excel danh sách thì file chỉ có dự án thuộc khối A",
    "uat": true
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-631",
    "ref": [
     "BR-phuong-an-kinh-doanh-001"
    ],
    "category": "Phân quyền theo vai trò và khối",
    "subcategory": "AM và dữ liệu PAKD ngoài khung",
    "priority": 1,
    "auto": "Yes",
    "text": "Verify Kế toán xem danh sách dự án thấy dự án của mọi khối"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-632",
    "ref": [
     "E-phuong-an-kinh-doanh-018"
    ],
    "category": "Phân quyền theo vai trò và khối",
    "subcategory": "AM và dữ liệu PAKD ngoài khung",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify Kế toán xem khung PAKD dự án \"Chưa có PAKD\" ở chế độ chỉ xem không hiện câu báo lỗi quyền nào"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-633",
    "ref": [
     "NFR-phuong-an-kinh-doanh-001"
    ],
    "category": "Định dạng hiển thị",
    "subcategory": "Số, %, tháng, ngày",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify tiền trên khung PAKD và P-04 hiển thị đơn vị VNĐ làm tròn đồng, phân cách nghìn bằng dấu phẩy (vd \"1,000,000\")"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-634",
    "ref": [
     "NFR-phuong-an-kinh-doanh-001"
    ],
    "category": "Định dạng hiển thị",
    "subcategory": "Số, %, tháng, ngày",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify % trên khung PAKD hiển thị 1 chữ số thập phân (vd Biên lợi nhuận \"25.0%\")"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-635",
    "ref": [
     "NFR-phuong-an-kinh-doanh-001"
    ],
    "category": "Định dạng hiển thị",
    "subcategory": "Số, %, tháng, ngày",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify Σ % mốc ở dòng \"TỔNG\" Mục 3 hiển thị nguyên số đã cộng (3 mốc 33.33 hiện 99.99)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-636",
    "ref": [
     "NFR-phuong-an-kinh-doanh-001"
    ],
    "category": "Định dạng hiển thị",
    "subcategory": "Số, %, tháng, ngày",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô tháng trên khung PAKD hiển thị dạng MM/YYYY"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-637",
    "ref": [
     "NFR-phuong-an-kinh-doanh-001"
    ],
    "category": "Định dạng hiển thị",
    "subcategory": "Số, %, tháng, ngày",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ngày nộp trên P-04 hiển thị dạng dd/mm/yyyy"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-638",
    "ref": [
     "NFR-phuong-an-kinh-doanh-001"
    ],
    "category": "Định dạng hiển thị",
    "subcategory": "Số, %, tháng, ngày",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô không có giá trị hiển thị \"—\" (vd Số tháng thực hiện khi chưa đủ tháng)"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-639",
    "ref": [
     "NFR-phuong-an-kinh-doanh-004"
    ],
    "category": "Loading và phản hồi",
    "subcategory": "Toast và trạng thái chờ",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify toast thông báo hiện ở góc trên phải màn hình"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-640",
    "ref": [
     "NFR-phuong-an-kinh-doanh-004"
    ],
    "category": "Loading và phản hồi",
    "subcategory": "Toast và trạng thái chờ",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify toast tự ẩn mà không cần người dùng đóng"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-641",
    "ref": [],
    "category": "Loading và phản hồi",
    "subcategory": "Toast và trạng thái chờ",
    "priority": 3,
    "auto": "No",
    "text": "Verify mạng chậm, bấm \"Gửi Kế toán duyệt\" thì không hiện toast thành công trước khi hệ thống ghi xong"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-642",
    "ref": [],
    "category": "Loading và phản hồi",
    "subcategory": "Toast và trạng thái chờ",
    "priority": 3,
    "auto": "No",
    "text": "Verify mạng chậm khi mở màn chi tiết thì khung PAKD không hiện số liệu của dự án trước đó trong lúc chờ tải"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-643",
    "ref": [],
    "category": "Accessibility cơ bản",
    "subcategory": "Bàn phím và nhãn",
    "priority": 3,
    "auto": "No",
    "text": "Verify phím Tab di chuyển qua các ô Mục 1 theo đúng thứ tự hiển thị"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-644",
    "ref": [],
    "category": "Accessibility cơ bản",
    "subcategory": "Bàn phím và nhãn",
    "priority": 3,
    "auto": "No",
    "text": "Verify mở P-04 thì tiêu điểm bàn phím nằm trong popup, Tab không nhảy ra màn phía sau"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-645",
    "ref": [],
    "category": "Accessibility cơ bản",
    "subcategory": "Bàn phím và nhãn",
    "priority": 3,
    "auto": "No",
    "text": "Verify các nút chỉ có biểu tượng (÷, ×, ✕) có tên đọc được khi rê chuột tới"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-646",
    "ref": [],
    "category": "Accessibility cơ bản",
    "subcategory": "Bàn phím và nhãn",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify ô bắt buộc ở Mục 1 có nhãn kèm dấu * (vd \"Giá trị hợp đồng (VNĐ)*\")"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-647",
    "ref": [
     "NFR-phuong-an-kinh-doanh-002"
    ],
    "category": "Responsive cơ bản",
    "subcategory": "Cửa sổ Chrome hẹp",
    "priority": 3,
    "auto": "No",
    "text": "Verify thu hẹp cửa sổ trình duyệt thì biểu đồ dòng tiền co giãn theo bề rộng khung, nhãn trục và chú thích không chồng nhau"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-648",
    "ref": [
     "NFR-phuong-an-kinh-doanh-002"
    ],
    "category": "Responsive cơ bản",
    "subcategory": "Cửa sổ Chrome hẹp",
    "priority": 3,
    "auto": "No",
    "text": "Verify thu hẹp cửa sổ thì biểu đồ và bảng tóm tắt chi phí tự xuống dòng, không tràn khỏi khung"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-649",
    "ref": [
     "NFR-phuong-an-kinh-doanh-003"
    ],
    "category": "Responsive cơ bản",
    "subcategory": "Cửa sổ Chrome hẹp",
    "priority": 3,
    "auto": "No",
    "text": "Verify thu hẹp cửa sổ thì bảng Nghiệm thu và bảng Mốc kế hoạch cuộn ngang, không vỡ bố cục"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-650",
    "ref": [],
    "category": "Responsive cơ bản",
    "subcategory": "Cửa sổ Chrome hẹp",
    "priority": 3,
    "auto": "No",
    "text": "Verify thu hẹp cửa sổ thì P-04 vẫn hiển thị đủ nút \"Huỷ\", \"Từ chối\", \"Duyệt\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-651",
    "ref": [
     "NFR-phuong-an-kinh-doanh-005"
    ],
    "category": "Thời điểm \"hôm nay\" theo giờ Việt Nam",
    "subcategory": "Đếm ngày lịch Asia/Ho_Chi_Minh",
    "priority": 2,
    "auto": "No",
    "text": "Verify lúc 06:30 sáng giờ Việt Nam, khung PAKD, dòng thông báo và cột \"Hạn lập PAKD\" hiển thị cùng số ngày còn lại cho cùng dự án"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-652",
    "ref": [
     "NFR-phuong-an-kinh-doanh-005"
    ],
    "category": "Thời điểm \"hôm nay\" theo giờ Việt Nam",
    "subcategory": "Đếm ngày lịch Asia/Ho_Chi_Minh",
    "priority": 3,
    "auto": "No",
    "text": "Verify gửi PAKD lúc 00:30 giờ Việt Nam thì ngày nộp ghi theo ngày lịch Việt Nam"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-653",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Edge cases",
    "subcategory": "Back, refresh, mất mạng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify đang nhập dở khung PAKD (chưa Lưu nháp), bấm Back trình duyệt, mở lại dự án thì khung hiển thị nội dung đã lưu gần nhất"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-654",
    "ref": [
     "FR-phuong-an-kinh-doanh-002"
    ],
    "category": "Edge cases",
    "subcategory": "Back, refresh, mất mạng",
    "priority": 2,
    "auto": "Yes",
    "text": "Verify đang nhập dở khung PAKD, tải lại trang (F5) thì khung hiển thị nội dung đã lưu gần nhất"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-655",
    "ref": [
     "E-phuong-an-kinh-doanh-020"
    ],
    "category": "Edge cases",
    "subcategory": "Back, refresh, mất mạng",
    "priority": 2,
    "auto": "No",
    "text": "Verify ngắt mạng, bấm Lưu nháp thì hiện \"Thao tác chưa thực hiện được, vui lòng thử lại\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-656",
    "ref": [
     "FR-phuong-an-kinh-doanh-019"
    ],
    "category": "Edge cases",
    "subcategory": "Back, refresh, mất mạng",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify dán \"02/2027\" vào ô tháng thì ô nhận giá trị \"02/2027\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-657",
    "ref": [
     "NFR-phuong-an-kinh-doanh-008"
    ],
    "category": "Lưu giữ và nhật ký tra soát",
    "subcategory": "Lưu giữ vĩnh viễn",
    "priority": 1,
    "auto": "No",
    "text": "Verify dự án đã Kết thúc vẫn tra được đủ phiên bản, ý kiến, bản chụp lúc nộp và lịch sử PAKD"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-658",
    "ref": [
     "NFR-phuong-an-kinh-doanh-013",
     "E-phuong-an-kinh-doanh-018"
    ],
    "category": "Lưu giữ và nhật ký tra soát",
    "subcategory": "Nhật ký tra soát (không có màn xem)",
    "priority": 2,
    "auto": "No",
    "text": "Verify thao tác PAKD bị từ chối vì không đủ quyền được ghi nhận tra soát với người, thời điểm, dự án, thao tác"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-659",
    "ref": [
     "NFR-phuong-an-kinh-doanh-013",
     "E-phuong-an-kinh-doanh-019"
    ],
    "category": "Lưu giữ và nhật ký tra soát",
    "subcategory": "Nhật ký tra soát (không có màn xem)",
    "priority": 2,
    "auto": "No",
    "text": "Verify thao tác bị từ chối vì dữ liệu vừa đổi được ghi nhận tra soát"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-660",
    "ref": [
     "NFR-phuong-an-kinh-doanh-013",
     "E-phuong-an-kinh-doanh-020"
    ],
    "category": "Lưu giữ và nhật ký tra soát",
    "subcategory": "Nhật ký tra soát (không có màn xem)",
    "priority": 2,
    "auto": "No",
    "text": "Verify lần ghi không trọn vẹn được ghi nhận tra soát với người, thời điểm, dự án, thao tác"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-661",
    "ref": [
     "NFR-phuong-an-kinh-doanh-013"
    ],
    "category": "Lưu giữ và nhật ký tra soát",
    "subcategory": "Nhật ký tra soát (không có màn xem)",
    "priority": 3,
    "auto": "No",
    "text": "Verify lỗi của tác vụ xét hằng ngày được ghi nhận tra soát"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-662",
    "ref": [
     "NFR-phuong-an-kinh-doanh-013"
    ],
    "category": "Lưu giữ và nhật ký tra soát",
    "subcategory": "Nhật ký tra soát (không có màn xem)",
    "priority": 2,
    "auto": "No",
    "text": "Verify thao tác bị từ chối quyền không thêm dòng mới vào tab \"Lịch sử\" của dự án"
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-663",
    "ref": [
     "BR-phuong-an-kinh-doanh-039"
    ],
    "category": "Ngưỡng cố định toàn công ty",
    "subcategory": "Ngưỡng 20% và 2%",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify 2 dự án thuộc 2 khối khác nhau cùng Biên lợi nhuận 19.9% đều hiển thị nhãn \"! Dưới khung\""
   },
   {
    "chk": "CHK-phuong-an-kinh-doanh-664",
    "ref": [
     "BR-phuong-an-kinh-doanh-039"
    ],
    "category": "Ngưỡng cố định toàn công ty",
    "subcategory": "Ngưỡng 20% và 2%",
    "priority": 3,
    "auto": "Yes",
    "text": "Verify 2 dự án thuộc 2 khối khác nhau cùng lệch hợp đồng 2,5% đều hiển thị cảnh báo lệch"
   }
  ]
 }
];
