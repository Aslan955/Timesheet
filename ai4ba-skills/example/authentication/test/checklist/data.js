window.FEATURE = "authentication";
window.UPDATED = "2026-07-19";
window.CHECKLISTS_DATA = [
  {
    "scope": "uc",
    "target": "uc-forgot-password",
    "file": "checklist-uc-forgot-password.md",
    "items": [
      {
        "chk": "CHK-authentication-071",
        "ref": [
          "FR-authentication-016"
        ],
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "priority": 2,
        "auto": "Yes",
        "text": "Kiểm tra biểu mẫu quên mật khẩu có thể truy cập từ luồng đăng nhập."
      },
      {
        "chk": "CHK-authentication-072",
        "ref": [
          "FR-authentication-016",
          "BR-authentication-008"
        ],
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "priority": 1,
        "auto": "Yes",
        "text": "Gửi email của tài khoản tồn tại; kiểm tra thông báo yêu cầu đặt lại trung lập xuất hiện."
      },
      {
        "chk": "CHK-authentication-073",
        "ref": [
          "FR-authentication-016",
          "NFR-authentication-007"
        ],
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "priority": 1,
        "auto": "Yes",
        "text": "Gửi email không tồn tại; kiểm tra cùng thông báo yêu cầu đặt lại trung lập xuất hiện."
      },
      {
        "chk": "CHK-authentication-074",
        "ref": [
          "FR-authentication-017"
        ],
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "priority": 1,
        "auto": "No",
        "text": "Gửi email của tài khoản tồn tại; kiểm tra email đặt lại được gửi đi."
      },
      {
        "chk": "CHK-authentication-075",
        "ref": [
          "FR-authentication-017"
        ],
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "priority": 1,
        "auto": "No",
        "text": "Gửi email của tài khoản tồn tại; kiểm tra liên kết đặt lại hết hạn sau 30 phút."
      },
      {
        "chk": "CHK-authentication-076",
        "ref": [
          "FR-authentication-018"
        ],
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở liên kết đặt lại chưa dùng còn hiệu lực; kiểm tra biểu mẫu mật khẩu mới tải thành công."
      },
      {
        "chk": "CHK-authentication-077",
        "ref": [
          "FR-authentication-018"
        ],
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "priority": 2,
        "auto": "Yes",
        "text": "Nhập các mật khẩu hợp lệ trùng khớp; kiểm tra thao tác gửi được chấp nhận."
      },
      {
        "chk": "CHK-authentication-078",
        "ref": [
          "FR-authentication-018"
        ],
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập nội dung xác nhận khác; kiểm tra việc đặt lại mật khẩu bị từ chối."
      },
      {
        "chk": "CHK-authentication-079",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu mới không hợp lệ; kiểm tra lỗi chính sách nội tuyến xuất hiện."
      },
      {
        "chk": "CHK-authentication-080",
        "ref": [
          "FR-authentication-018"
        ],
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "priority": 1,
        "auto": "No",
        "text": "Gửi các mật khẩu hợp lệ trùng khớp từ liên kết hợp lệ; kiểm tra thông tin xác thực của tài khoản được cập nhật."
      },
      {
        "chk": "CHK-authentication-081",
        "ref": [
          "FR-authentication-018"
        ],
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "priority": 1,
        "auto": "No",
        "text": "Hoàn tất đặt lại mật khẩu; kiểm tra mã thông báo đặt lại được đánh dấu là đã dùng."
      },
      {
        "chk": "CHK-authentication-082",
        "ref": [
          "FR-authentication-019",
          "BR-authentication-007"
        ],
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "priority": 1,
        "auto": "No",
        "text": "Hoàn tất đặt lại mật khẩu; kiểm tra mọi phiên hiện có bị thu hồi."
      },
      {
        "chk": "CHK-authentication-083",
        "ref": [
          "FR-authentication-018"
        ],
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "priority": 2,
        "auto": "Yes",
        "text": "Hoàn tất đặt lại mật khẩu; kiểm tra thông báo thành công được hiển thị."
      },
      {
        "chk": "CHK-authentication-084",
        "ref": [
          "FR-authentication-018"
        ],
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "priority": 2,
        "auto": "Yes",
        "text": "Hoàn tất đặt lại mật khẩu; kiểm tra đích đến đăng nhập được cung cấp."
      },
      {
        "chk": "CHK-authentication-085",
        "ref": [
          "FR-authentication-020",
          "E-authentication-009"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "priority": 1,
        "auto": "Yes",
        "text": "Mở liên kết đặt lại sau 30 phút; kiểm tra kết quả liên kết hết hạn xuất hiện."
      },
      {
        "chk": "CHK-authentication-086",
        "ref": [
          "FR-authentication-020",
          "E-authentication-009"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "priority": 1,
        "auto": "Yes",
        "text": "Mở lại liên kết đặt lại đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện."
      },
      {
        "chk": "CHK-authentication-087",
        "ref": [
          "E-authentication-009"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở kết quả liên kết đặt lại không hợp lệ; kiểm tra tùy chọn yêu cầu đặt lại mới được cung cấp."
      },
      {
        "chk": "CHK-authentication-088",
        "ref": [
          "NFR-authentication-008"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Sự kiện nhạy cảm",
        "priority": 2,
        "auto": "No",
        "text": "Hoàn tất đặt lại mật khẩu; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu."
      },
      {
        "chk": "CHK-authentication-089",
        "ref": [
          "NFR-authentication-009"
        ],
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "Yes",
        "text": "Điều hướng biểu mẫu đặt lại bằng Tab; kiểm tra trường mật khẩu mới nhận tiêu điểm bàn phím."
      },
      {
        "chk": "CHK-authentication-090",
        "ref": [
          "FR-authentication-019"
        ],
        "category": "Trường hợp biên",
        "subcategory": "Đặt lại trên nhiều thiết bị",
        "priority": 1,
        "auto": "Yes",
        "text": "Đặt lại mật khẩu trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác bị từ chối."
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-google-oauth",
    "file": "checklist-uc-google-oauth.md",
    "items": [
      {
        "chk": "CHK-authentication-057",
        "ref": [
          "FR-authentication-012"
        ],
        "category": "Truy cập Google OAuth",
        "subcategory": "Truy cập",
        "priority": 2,
        "auto": "Yes",
        "text": "Kiểm tra nút đăng nhập bằng Google hiển thị trên màn hình đăng nhập."
      },
      {
        "chk": "CHK-authentication-058",
        "ref": [
          "FR-authentication-012"
        ],
        "category": "Truy cập Google OAuth",
        "subcategory": "Truy cập",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn đăng nhập bằng Google; kiểm tra điều hướng đến màn hình chấp thuận của Google."
      },
      {
        "chk": "CHK-authentication-059",
        "ref": [
          "FR-authentication-012"
        ],
        "category": "Hoàn tất OAuth",
        "subcategory": "Tài khoản mới",
        "priority": 2,
        "auto": "Yes",
        "text": "Hoàn tất chấp thuận của Google bằng email Google đã xác minh; kiểm tra không yêu cầu trường hồ sơ bổ sung."
      },
      {
        "chk": "CHK-authentication-060",
        "ref": [
          "FR-authentication-013",
          "BR-authentication-009"
        ],
        "category": "Hoàn tất OAuth",
        "subcategory": "Tài khoản mới",
        "priority": 1,
        "auto": "No",
        "text": "Hoàn tất chấp thuận của Google bằng email mới; kiểm tra trạng thái tài khoản được tạo là đã xác minh."
      },
      {
        "chk": "CHK-authentication-061",
        "ref": [
          "FR-authentication-012"
        ],
        "category": "Hoàn tất OAuth",
        "subcategory": "Tài khoản mới",
        "priority": 1,
        "auto": "Yes",
        "text": "Hoàn tất chấp thuận của Google bằng email mới; kiểm tra điều hướng vào ứng dụng."
      },
      {
        "chk": "CHK-authentication-065",
        "ref": [
          "FR-authentication-015",
          "E-authentication-008"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Callback thất bại",
        "priority": 1,
        "auto": "Yes",
        "text": "Hủy chấp thuận của Google; kiểm tra quay lại màn hình đăng nhập."
      },
      {
        "chk": "CHK-authentication-066",
        "ref": [
          "FR-authentication-015",
          "E-authentication-008"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Callback thất bại",
        "priority": 1,
        "auto": "Yes",
        "text": "Mô phỏng callback Google thất bại; kiểm tra thông báo lỗi Google xuất hiện."
      },
      {
        "chk": "CHK-authentication-067",
        "ref": [
          "FR-authentication-015"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Callback thất bại",
        "priority": 1,
        "auto": "No",
        "text": "Mô phỏng callback Google thất bại; kiểm tra không có tài khoản chưa hoàn chỉnh nào được lưu."
      },
      {
        "chk": "CHK-authentication-068",
        "ref": [
          "E-authentication-008"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Callback thất bại",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở trạng thái lỗi Google; kiểm tra có tùy chọn thử lại hiển thị."
      },
      {
        "chk": "CHK-authentication-069",
        "ref": [
          "NFR-authentication-008"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Nhật ký kiểm toán",
        "priority": 2,
        "auto": "No",
        "text": "Tự động liên kết Google với tài khoản hiện có; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu."
      },
      {
        "chk": "CHK-authentication-070",
        "ref": [
          "NFR-authentication-009"
        ],
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím",
        "priority": 3,
        "auto": "Yes",
        "text": "Điều hướng màn hình đăng nhập bằng Tab; kiểm tra nút đăng nhập bằng Google nhận tiêu điểm bàn phím."
      },
      {
        "chk": "CHK-authentication-062",
        "ref": [
          "FR-authentication-014",
          "BR-authentication-003"
        ],
        "category": "Trường hợp biên",
        "subcategory": "Email hiện có",
        "priority": 1,
        "auto": "No",
        "text": "Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra liên kết nhà cung cấp Google được tạo."
      },
      {
        "chk": "CHK-authentication-063",
        "ref": [
          "FR-authentication-014",
          "BR-authentication-002"
        ],
        "category": "Trường hợp biên",
        "subcategory": "Email hiện có",
        "priority": 1,
        "auto": "No",
        "text": "Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không có tài khoản thứ hai được tạo."
      },
      {
        "chk": "CHK-authentication-064",
        "ref": [
          "FR-authentication-014",
          "BR-authentication-003"
        ],
        "category": "Trường hợp biên",
        "subcategory": "Email hiện có",
        "priority": 1,
        "auto": "Yes",
        "text": "Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không yêu cầu mật khẩu cũ."
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-login-email",
    "file": "checklist-uc-login-email.md",
    "items": [
      {
        "chk": "CHK-authentication-037",
        "ref": [],
        "category": "Truy cập đăng nhập",
        "subcategory": "Truy cập",
        "priority": 2,
        "auto": "Yes",
        "text": "Kiểm tra biểu mẫu đăng nhập bằng email có thể truy cập từ phiên chưa xác thực."
      },
      {
        "chk": "CHK-authentication-038",
        "ref": [
          "FR-authentication-008"
        ],
        "category": "Gửi thông tin xác thực",
        "subcategory": "Luồng thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Gửi thông tin xác thực hợp lệ cho tài khoản đã xác minh và không bị khóa; kiểm tra điều hướng vào ứng dụng."
      },
      {
        "chk": "CHK-authentication-039",
        "ref": [
          "FR-authentication-008"
        ],
        "category": "Gửi thông tin xác thực",
        "subcategory": "Luồng thành công",
        "priority": 1,
        "auto": "No",
        "text": "Đăng nhập thành công sau các lần thất bại trước đó; kiểm tra bộ đếm lần thử thất bại được đặt lại."
      },
      {
        "chk": "CHK-authentication-040",
        "ref": [
          "FR-authentication-011"
        ],
        "category": "Gửi thông tin xác thực",
        "subcategory": "Luồng thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở biểu mẫu đăng nhập; kiểm tra tùy chọn nhớ đăng nhập mặc định tắt."
      },
      {
        "chk": "CHK-authentication-041",
        "ref": [
          "FR-authentication-011",
          "NFR-authentication-006"
        ],
        "category": "Gửi thông tin xác thực",
        "subcategory": "Luồng thành công",
        "priority": 1,
        "auto": "No",
        "text": "Đăng nhập khi bật tùy chọn nhớ đăng nhập; kiểm tra phiên thiết bị vẫn hợp lệ trong 30 ngày."
      },
      {
        "chk": "CHK-authentication-042",
        "ref": [
          "FR-authentication-010",
          "E-authentication-003"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Thông tin xác thực không hợp lệ",
        "priority": 1,
        "auto": "Yes",
        "text": "Gửi mật khẩu sai cho email hiện có; kiểm tra thông báo chung về thông tin xác thực không hợp lệ xuất hiện."
      },
      {
        "chk": "CHK-authentication-043",
        "ref": [
          "FR-authentication-010",
          "NFR-authentication-007"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Thông tin xác thực không hợp lệ",
        "priority": 1,
        "auto": "Yes",
        "text": "Gửi email không tồn tại; kiểm tra cùng thông báo chung về thông tin xác thực không hợp lệ xuất hiện."
      },
      {
        "chk": "CHK-authentication-044",
        "ref": [
          "FR-authentication-010"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Thông tin xác thực không hợp lệ",
        "priority": 1,
        "auto": "No",
        "text": "Gửi thông tin xác thực không hợp lệ; kiểm tra bộ đếm lần thử thất bại tăng thêm một."
      },
      {
        "chk": "CHK-authentication-050",
        "ref": [
          "FR-authentication-009",
          "E-authentication-004"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Chưa xác minh và lỗi mạng",
        "priority": 1,
        "auto": "Yes",
        "text": "Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra quyền truy cập ứng dụng bị chặn."
      },
      {
        "chk": "CHK-authentication-051",
        "ref": [
          "FR-authentication-009",
          "E-authentication-004"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Chưa xác minh và lỗi mạng",
        "priority": 2,
        "auto": "Yes",
        "text": "Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra nút gửi lại xác nhận xuất hiện."
      },
      {
        "chk": "CHK-authentication-052",
        "ref": [
          "FR-authentication-027",
          "BR-authentication-011"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Chưa xác minh và lỗi mạng",
        "priority": 1,
        "auto": "No",
        "text": "Mô phỏng lỗi mạng khi đăng nhập; kiểm tra bộ đếm lần thử thất bại không thay đổi."
      },
      {
        "chk": "CHK-authentication-045",
        "ref": [
          "FR-authentication-025",
          "BR-authentication-006"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Tạo ba lần thử không hợp lệ liên tiếp; kiểm tra captcha hiển thị ở lần thử tiếp theo."
      },
      {
        "chk": "CHK-authentication-046",
        "ref": [
          "FR-authentication-025"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Gửi lần thử tiếp theo mà không hoàn tất captcha; kiểm tra đăng nhập bị chặn."
      },
      {
        "chk": "CHK-authentication-047",
        "ref": [
          "FR-authentication-026",
          "BR-authentication-005"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "priority": 1,
        "auto": "No",
        "text": "Tạo năm lần thử không hợp lệ liên tiếp; kiểm tra việc khóa tài khoản được ghi nhận trong 24 giờ."
      },
      {
        "chk": "CHK-authentication-048",
        "ref": [
          "FR-authentication-026",
          "E-authentication-005"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "priority": 1,
        "auto": "Yes",
        "text": "Gửi thông tin xác thực cho tài khoản bị khóa; kiểm tra thông báo khóa tạm thời xuất hiện."
      },
      {
        "chk": "CHK-authentication-049",
        "ref": [
          "FR-authentication-026"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "priority": 2,
        "auto": "No",
        "text": "Chuyển tài khoản bị khóa vượt quá 24 giờ; kiểm tra tài khoản đủ điều kiện đăng nhập trở lại."
      },
      {
        "chk": "CHK-authentication-056",
        "ref": [
          "NFR-authentication-009"
        ],
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "Yes",
        "text": "Điều hướng biểu mẫu đăng nhập bằng Tab; kiểm tra trường email nhận tiêu điểm bàn phím."
      },
      {
        "chk": "CHK-authentication-053",
        "ref": [
          "FR-authentication-021"
        ],
        "category": "Trường hợp biên",
        "subcategory": "Phiên đồng thời",
        "priority": 1,
        "auto": "Yes",
        "text": "Đăng nhập cùng tài khoản trên thiết bị thứ hai; kiểm tra phiên trên thiết bị đầu tiên vẫn hoạt động."
      },
      {
        "chk": "CHK-authentication-054",
        "ref": [
          "FR-authentication-022"
        ],
        "category": "Trường hợp biên",
        "subcategory": "Phiên đồng thời",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn đăng xuất trên thiết bị hiện tại; kiểm tra thiết bị đó trở về trạng thái chưa xác thực."
      },
      {
        "chk": "CHK-authentication-055",
        "ref": [
          "FR-authentication-022"
        ],
        "category": "Trường hợp biên",
        "subcategory": "Phiên đồng thời",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn đăng xuất trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác vẫn sử dụng được."
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-signup-email",
    "file": "checklist-uc-signup-email.md",
    "items": [
      {
        "chk": "CHK-authentication-001",
        "ref": [],
        "category": "Truy cập đăng ký",
        "subcategory": "Truy cập",
        "priority": 2,
        "auto": "Yes",
        "text": "Kiểm tra biểu mẫu đăng ký có thể truy cập từ phiên chưa xác thực."
      },
      {
        "chk": "CHK-authentication-002",
        "ref": [
          "FR-authentication-003"
        ],
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu hợp lệ gồm 8 ký tự; kiểm tra trường chấp nhận mật khẩu."
      },
      {
        "chk": "CHK-authentication-003",
        "ref": [
          "FR-authentication-003"
        ],
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "priority": 2,
        "auto": "Yes",
        "text": "Nhập mật khẩu hợp lệ gồm 20 ký tự; kiểm tra trường chấp nhận mật khẩu."
      },
      {
        "chk": "CHK-authentication-004",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu gồm 7 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện."
      },
      {
        "chk": "CHK-authentication-005",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu gồm 21 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện."
      },
      {
        "chk": "CHK-authentication-006",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu không có chữ hoa; kiểm tra lỗi chính sách nội tuyến xuất hiện."
      },
      {
        "chk": "CHK-authentication-007",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu không có chữ thường; kiểm tra lỗi chính sách nội tuyến xuất hiện."
      },
      {
        "chk": "CHK-authentication-008",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu không có ký tự đặc biệt; kiểm tra lỗi chính sách nội tuyến xuất hiện."
      },
      {
        "chk": "CHK-authentication-009",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu chứa phần cục bộ của email có ít nhất ba ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện."
      },
      {
        "chk": "CHK-authentication-010",
        "ref": [
          "FR-authentication-029"
        ],
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "priority": 3,
        "auto": "Yes",
        "text": "Nhập mật khẩu; kiểm tra chỉ báo độ mạnh cập nhật theo thời gian thực."
      },
      {
        "chk": "CHK-authentication-011",
        "ref": [
          "FR-authentication-001"
        ],
        "category": "Gửi đăng ký",
        "subcategory": "Luồng thành công",
        "priority": 1,
        "auto": "No",
        "text": "Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra trạng thái tài khoản được tạo là chưa xác minh."
      },
      {
        "chk": "CHK-authentication-012",
        "ref": [
          "FR-authentication-004"
        ],
        "category": "Gửi đăng ký",
        "subcategory": "Luồng thành công",
        "priority": 1,
        "auto": "No",
        "text": "Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra email xác nhận chứa liên kết có hiệu lực 24 giờ được gửi đi."
      },
      {
        "chk": "CHK-authentication-013",
        "ref": [
          "FR-authentication-004"
        ],
        "category": "Gửi đăng ký",
        "subcategory": "Luồng thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra màn hình đã gửi xác nhận hiển thị email đã gửi."
      },
      {
        "chk": "CHK-authentication-014",
        "ref": [
          "FR-authentication-002",
          "E-authentication-001"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Email đã tồn tại",
        "priority": 1,
        "auto": "Yes",
        "text": "Gửi email đã đăng ký; kiểm tra lỗi nội tuyến email trùng lặp xuất hiện."
      },
      {
        "chk": "CHK-authentication-015",
        "ref": [
          "E-authentication-001"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Email đã tồn tại",
        "priority": 2,
        "auto": "Yes",
        "text": "Chọn liên kết khôi phục đăng nhập từ lỗi email trùng lặp; kiểm tra điều hướng đến luồng đăng nhập."
      },
      {
        "chk": "CHK-authentication-016",
        "ref": [
          "FR-authentication-031"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Bảo vệ khỏi bot",
        "priority": 2,
        "auto": "Yes",
        "text": "Kích hoạt bảo vệ khỏi bot khi đăng ký; kiểm tra captcha được yêu cầu trước khi gửi."
      },
      {
        "chk": "CHK-authentication-017",
        "ref": [
          "NFR-authentication-003"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Bảo vệ khỏi bot",
        "priority": 1,
        "auto": "No",
        "text": "Kiểm tra nhật ký xác thực sau khi đăng ký; kiểm tra mật khẩu đã gửi không xuất hiện."
      },
      {
        "chk": "CHK-authentication-018",
        "ref": [
          "NFR-authentication-009"
        ],
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "Yes",
        "text": "Điều hướng biểu mẫu bằng Tab; kiểm tra nút gửi nhận tiêu điểm bàn phím."
      },
      {
        "chk": "CHK-authentication-019",
        "ref": [
          "NFR-authentication-009"
        ],
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "Yes",
        "text": "Kiểm tra trường mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình."
      },
      {
        "chk": "CHK-authentication-020",
        "ref": [
          "FR-authentication-028",
          "BR-authentication-010"
        ],
        "category": "Trường hợp biên",
        "subcategory": "Lưu giữ tài khoản chưa xác minh",
        "priority": 2,
        "auto": "No",
        "text": "Chuyển tài khoản chưa xác minh vượt quá 24 giờ; kiểm tra tài khoản bị xóa."
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-unlink-google",
    "file": "checklist-uc-unlink-google.md",
    "items": [
      {
        "chk": "CHK-authentication-091",
        "ref": [],
        "category": "Truy cập bảo mật tài khoản",
        "subcategory": "Truy cập",
        "priority": 2,
        "auto": "Yes",
        "text": "Kiểm tra màn hình bảo mật tài khoản có thể truy cập đối với người dùng đã xác thực."
      },
      {
        "chk": "CHK-authentication-092",
        "ref": [
          "FR-authentication-023"
        ],
        "category": "Truy cập bảo mật tài khoản",
        "subcategory": "Truy cập",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở tài khoản đã liên kết Google; kiểm tra nút hủy liên kết hiển thị."
      },
      {
        "chk": "CHK-authentication-093",
        "ref": [
          "FR-authentication-023"
        ],
        "category": "Hủy liên kết bằng mật khẩu",
        "subcategory": "Luồng thành công",
        "priority": 1,
        "auto": "No",
        "text": "Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra liên kết nhà cung cấp bị xóa."
      },
      {
        "chk": "CHK-authentication-094",
        "ref": [
          "FR-authentication-023"
        ],
        "category": "Hủy liên kết bằng mật khẩu",
        "subcategory": "Luồng thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra xác nhận thành công xuất hiện."
      },
      {
        "chk": "CHK-authentication-095",
        "ref": [
          "FR-authentication-023"
        ],
        "category": "Hủy liên kết bằng mật khẩu",
        "subcategory": "Luồng thành công",
        "priority": 1,
        "auto": "Yes",
        "text": "Đăng nhập bằng email sau khi hủy liên kết Google; kiểm tra quyền truy cập ứng dụng thành công."
      },
      {
        "chk": "CHK-authentication-096",
        "ref": [
          "FR-authentication-023"
        ],
        "category": "Hủy liên kết bằng mật khẩu",
        "subcategory": "Luồng thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Quay lại bảo mật tài khoản sau khi hủy liên kết Google; kiểm tra nút hủy liên kết không còn."
      },
      {
        "chk": "CHK-authentication-097",
        "ref": [
          "FR-authentication-024",
          "E-authentication-010"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Yêu cầu mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Chọn hủy liên kết trên tài khoản chỉ dùng Google; kiểm tra biểu mẫu bắt buộc đặt mật khẩu xuất hiện."
      },
      {
        "chk": "CHK-authentication-098",
        "ref": [
          "FR-authentication-003",
          "FR-authentication-024"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Yêu cầu mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu hợp lệ gồm 8 ký tự vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra mật khẩu được chấp nhận."
      },
      {
        "chk": "CHK-authentication-099",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Yêu cầu mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu không hợp lệ vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện."
      },
      {
        "chk": "CHK-authentication-100",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Yêu cầu mật khẩu",
        "priority": 1,
        "auto": "Yes",
        "text": "Nhập mật khẩu chứa phần cục bộ của email vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện."
      },
      {
        "chk": "CHK-authentication-101",
        "ref": [
          "FR-authentication-024",
          "BR-authentication-004"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Duy trì quyền truy cập tài khoản",
        "priority": 1,
        "auto": "No",
        "text": "Hoàn tất tạo mật khẩu bắt buộc; kiểm tra thông tin xác thực bằng email tồn tại trước khi xóa nhà cung cấp."
      },
      {
        "chk": "CHK-authentication-102",
        "ref": [
          "FR-authentication-024",
          "BR-authentication-004"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Duy trì quyền truy cập tài khoản",
        "priority": 1,
        "auto": "No",
        "text": "Thử xóa nhà cung cấp trước khi tạo mật khẩu; kiểm tra liên kết Google vẫn được lưu."
      },
      {
        "chk": "CHK-authentication-103",
        "ref": [
          "NFR-authentication-009"
        ],
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "Yes",
        "text": "Điều hướng bảo mật tài khoản bằng Tab; kiểm tra nút hủy liên kết nhận tiêu điểm bàn phím."
      },
      {
        "chk": "CHK-authentication-104",
        "ref": [
          "NFR-authentication-009"
        ],
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "priority": 3,
        "auto": "Yes",
        "text": "Kiểm tra trường bắt buộc đặt mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình."
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-verify-email",
    "file": "checklist-uc-verify-email.md",
    "items": [
      {
        "chk": "CHK-authentication-021",
        "ref": [
          "FR-authentication-005"
        ],
        "category": "Truy cập xác minh",
        "subcategory": "Liên kết xác nhận",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở liên kết xác nhận hợp lệ; kiểm tra trang kết quả xác minh tải thành công."
      },
      {
        "chk": "CHK-authentication-022",
        "ref": [
          "FR-authentication-005"
        ],
        "category": "Xác nhận email",
        "subcategory": "Luồng thành công",
        "priority": 1,
        "auto": "No",
        "text": "Dùng liên kết xác nhận chưa dùng còn hiệu lực; kiểm tra trạng thái tài khoản chuyển thành đã xác minh."
      },
      {
        "chk": "CHK-authentication-023",
        "ref": [
          "FR-authentication-005"
        ],
        "category": "Xác nhận email",
        "subcategory": "Luồng thành công",
        "priority": 1,
        "auto": "No",
        "text": "Dùng liên kết xác nhận hợp lệ; kiểm tra mã thông báo được đánh dấu là đã dùng."
      },
      {
        "chk": "CHK-authentication-024",
        "ref": [
          "FR-authentication-005"
        ],
        "category": "Xác nhận email",
        "subcategory": "Luồng thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Dùng liên kết xác nhận hợp lệ; kiểm tra thông báo thành công được hiển thị."
      },
      {
        "chk": "CHK-authentication-025",
        "ref": [
          "FR-authentication-005"
        ],
        "category": "Xác nhận email",
        "subcategory": "Luồng thành công",
        "priority": 2,
        "auto": "Yes",
        "text": "Dùng liên kết xác nhận hợp lệ; kiểm tra đích đến đăng nhập được cung cấp."
      },
      {
        "chk": "CHK-authentication-026",
        "ref": [
          "FR-authentication-006",
          "E-authentication-006"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "priority": 1,
        "auto": "Yes",
        "text": "Mở liên kết xác nhận sau 24 giờ; kiểm tra kết quả liên kết hết hạn xuất hiện."
      },
      {
        "chk": "CHK-authentication-027",
        "ref": [
          "FR-authentication-006",
          "E-authentication-006"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "priority": 1,
        "auto": "Yes",
        "text": "Mở lại liên kết xác nhận đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện."
      },
      {
        "chk": "CHK-authentication-028",
        "ref": [
          "FR-authentication-007"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "priority": 2,
        "auto": "Yes",
        "text": "Mở trạng thái đã gửi xác nhận; kiểm tra nút gửi lại hiển thị."
      },
      {
        "chk": "CHK-authentication-029",
        "ref": [
          "FR-authentication-007"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "priority": 1,
        "auto": "No",
        "text": "Yêu cầu gửi lại được phép; kiểm tra email xác nhận mới được gửi đi."
      },
      {
        "chk": "CHK-authentication-030",
        "ref": [
          "FR-authentication-007"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "priority": 1,
        "auto": "No",
        "text": "Yêu cầu gửi lại được phép; kiểm tra liên kết mới có thời hạn hiệu lực 24 giờ."
      },
      {
        "chk": "CHK-authentication-031",
        "ref": [
          "FR-authentication-007",
          "E-authentication-007"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "priority": 2,
        "auto": "Yes",
        "text": "Yêu cầu gửi lại hai lần trong vòng 60 giây; kiểm tra lỗi thời gian chờ xuất hiện."
      },
      {
        "chk": "CHK-authentication-032",
        "ref": [
          "FR-authentication-007",
          "E-authentication-007"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "priority": 2,
        "auto": "Yes",
        "text": "Yêu cầu gửi lại sau năm lần gửi trong một ngày; kiểm tra lỗi giới hạn hằng ngày xuất hiện."
      },
      {
        "chk": "CHK-authentication-033",
        "ref": [
          "FR-authentication-007",
          "E-authentication-007"
        ],
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "priority": 3,
        "auto": "Yes",
        "text": "Kích hoạt thời gian chờ gửi lại; kiểm tra gợi ý thời gian chờ còn lại được hiển thị."
      },
      {
        "chk": "CHK-authentication-034",
        "ref": [
          "FR-authentication-006",
          "E-authentication-006"
        ],
        "category": "Bảo mật cơ bản",
        "subcategory": "Dùng một lần",
        "priority": 1,
        "auto": "Yes",
        "text": "Dùng một mã thông báo xác nhận từ thiết bị thứ hai sau khi đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện."
      },
      {
        "chk": "CHK-authentication-035",
        "ref": [
          "NFR-authentication-009"
        ],
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím",
        "priority": 3,
        "auto": "Yes",
        "text": "Điều hướng kết quả xác minh bằng Tab; kiểm tra nút gửi lại nhận tiêu điểm bàn phím."
      },
      {
        "chk": "CHK-authentication-036",
        "ref": [
          "BR-authentication-001"
        ],
        "category": "Trường hợp biên",
        "subcategory": "Cổng truy cập",
        "priority": 1,
        "auto": "Yes",
        "text": "Thử mở nội dung học tập được bảo vệ trước khi xác minh; kiểm tra quyền truy cập bị từ chối."
      }
    ]
  }
];
