window.FEATURE = "authentication";
window.UPDATED = "2026-07-20";
window.LANG = "vi";
window.TESTCASES_DATA = [
  {
    "scope": "uc",
    "target": "uc-forgot-password",
    "file": "testcases-uc-forgot-password.md",
    "testcases": [
      {
        "stt": "1",
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-071",
        "ref": [
          "FR-authentication-016"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Kiểm tra biểu mẫu quên mật khẩu có thể truy cập từ luồng đăng nhập",
        "description": "Kiểm chứng: Kiểm tra biểu mẫu quên mật khẩu có thể truy cập từ luồng đăng nhập.",
        "steps": [
          {
            "step": "1",
            "action": "Ở màn đăng nhập, bấm liên kết \"Quên mật khẩu?\".",
            "expected": "Chuyển sang màn \"Quên mật khẩu\" có trường nhập email và nút gửi yêu cầu đặt lại; người dùng đến được form mà không cần đăng nhập trước.",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "2",
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-072",
        "ref": [
          "FR-authentication-016",
          "BR-authentication-008"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Tài khoản đã tồn tại và verified (dựng: đăng ký + xác nhận email; nguồn: FR-authentication-001)",
        "retired": false,
        "title": "Gửi email của tài khoản tồn tại; kiểm tra thông báo yêu cầu đặt lại trung lập xuất hiện",
        "description": "Kiểm chứng: Gửi email của tài khoản tồn tại; kiểm tra thông báo yêu cầu đặt lại trung lập xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email của một tài khoản đã tồn tại rồi bấm gửi yêu cầu đặt lại.",
            "expected": "Màn hiển thị thông báo trung tính \"Nếu email tồn tại trong hệ thống, đã gửi link đặt lại\" (FR-authentication-016). KHÔNG hiển thị chỉ báo nào cho biết email này có tồn tại.",
            "testData": "Email: hocvien@email.com"
          }
        ]
      },
      {
        "stt": "3",
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-073",
        "ref": [
          "FR-authentication-016",
          "NFR-authentication-007"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi email không tồn tại; kiểm tra cùng thông báo yêu cầu đặt lại trung lập xuất hiện",
        "description": "Kiểm chứng: Gửi email không tồn tại; kiểm tra cùng thông báo yêu cầu đặt lại trung lập xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập một email KHÔNG tồn tại trong hệ thống rồi bấm gửi yêu cầu đặt lại.",
            "expected": "Màn hiển thị ĐÚNG CÙNG thông báo trung tính \"Nếu email tồn tại trong hệ thống, đã gửi link đặt lại\" như trường hợp email tồn tại (TC02) — không tiết lộ email nào tồn tại (NFR-authentication-007, chống dò tài khoản). KHÔNG hiện lỗi kiểu \"email không tồn tại\".",
            "testData": "Email: unknown@email.com"
          }
        ]
      },
      {
        "stt": "4",
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-074",
        "ref": [
          "FR-authentication-017"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "Tài khoản đã tồn tại và verified (dựng: đăng ký + xác nhận email; nguồn: FR-authentication-001)",
        "retired": false,
        "title": "Gửi email của tài khoản tồn tại; kiểm tra email đặt lại được gửi đi",
        "description": "Kiểm chứng: Gửi email của tài khoản tồn tại; kiểm tra email đặt lại được gửi đi.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email của tài khoản tồn tại rồi bấm gửi yêu cầu đặt lại; kiểm tra hộp thư của email đó.",
            "expected": "Hệ thống gửi đúng một email đặt lại tới hòm thư của tài khoản, nội dung chứa link đặt lại mật khẩu (FR-authentication-017).",
            "testData": "Email: hocvien@email.com"
          }
        ]
      },
      {
        "stt": "5",
        "category": "Yêu cầu đặt lại mật khẩu",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-075",
        "ref": [
          "FR-authentication-017"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "Đã nhận link đặt lại mật khẩu còn hạn (dựng: gửi yêu cầu quên mật khẩu; nguồn: FR-authentication-017)",
        "retired": false,
        "title": "Gửi email của tài khoản tồn tại; kiểm tra liên kết đặt lại hết hạn sau 30 phút",
        "description": "Kiểm chứng: Gửi email của tài khoản tồn tại; kiểm tra liên kết đặt lại hết hạn sau 30 phút.",
        "steps": [
          {
            "step": "1",
            "action": "Sau khi nhận link đặt lại, chờ quá 30 phút rồi mở link.",
            "expected": "Link không còn hiệu lực sau đúng 30 phút kể từ lúc phát hành (FR-authentication-017); mở sau mốc đó dẫn tới trang kết quả link hết hạn (xem TC15).",
            "testData": "Thời gian chờ: > 30 phút"
          }
        ]
      },
      {
        "stt": "6",
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "checklist": "CHK-authentication-076",
        "ref": [
          "FR-authentication-018"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "Đã nhận link đặt lại mật khẩu còn hạn, chưa dùng (dựng: gửi yêu cầu quên mật khẩu; nguồn: FR-authentication-017)",
        "retired": false,
        "title": "Mở liên kết đặt lại chưa dùng còn hiệu lực; kiểm tra biểu mẫu mật khẩu mới tải thành công",
        "description": "Kiểm chứng: Mở liên kết đặt lại chưa dùng còn hiệu lực; kiểm tra biểu mẫu mật khẩu mới tải thành công.",
        "steps": [
          {
            "step": "1",
            "action": "Mở link đặt lại còn hạn và chưa dùng.",
            "expected": "Màn đặt mật khẩu mới tải thành công, hiển thị 2 trường nhập mật khẩu mới và xác nhận mật khẩu (FR-authentication-018).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "7",
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "checklist": "CHK-authentication-077",
        "ref": [
          "FR-authentication-018"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Nhập các mật khẩu hợp lệ trùng khớp; kiểm tra thao tác gửi được chấp nhận",
        "description": "Kiểm chứng: Nhập các mật khẩu hợp lệ trùng khớp; kiểm tra thao tác gửi được chấp nhận.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập mật khẩu mới đạt chính sách ở cả 2 trường (giống nhau) rồi bấm gửi.",
            "expected": "Hệ thống chấp nhận thao tác gửi (không hiện lỗi validation), tiến hành cập nhật mật khẩu (FR-authentication-018).",
            "testData": "Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "8",
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "checklist": "CHK-authentication-078",
        "ref": [
          "FR-authentication-018"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Nhập nội dung xác nhận khác; kiểm tra việc đặt lại mật khẩu bị từ chối",
        "description": "Kiểm chứng: Nhập nội dung xác nhận khác; kiểm tra việc đặt lại mật khẩu bị từ chối.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập mật khẩu mới và ô xác nhận KHÁC nhau rồi bấm gửi.",
            "expected": "Hệ thống từ chối đặt lại vì 2 trường không khớp; mật khẩu KHÔNG được cập nhật; người dùng vẫn ở màn đặt mật khẩu để sửa (FR-authentication-018 yêu cầu nhập 2 lần khớp).",
            "testData": "Mật khẩu: Hoc2024! / Xác nhận: Hoc2025!"
          }
        ]
      },
      {
        "stt": "9",
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "checklist": "CHK-authentication-079",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Nhập mật khẩu mới không hợp lệ; kiểm tra lỗi chính sách nội tuyến xuất hiện",
        "description": "Kiểm chứng: Nhập mật khẩu mới không hợp lệ; kiểm tra lỗi chính sách nội tuyến xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập mật khẩu mới KHÔNG đạt chính sách (vd quá ngắn / thiếu loại ký tự) rồi rời trường.",
            "expected": "Form hiện lỗi nội tuyến real-time \"Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn\" (E-authentication-002); nút gửi không cho hoàn tất đặt lại.",
            "testData": "Mật khẩu: 123"
          }
        ]
      },
      {
        "stt": "10",
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "checklist": "CHK-authentication-080",
        "ref": [
          "FR-authentication-018"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Gửi các mật khẩu hợp lệ trùng khớp từ liên kết hợp lệ; kiểm tra thông tin xác thực của tài khoản được cập nhật",
        "description": "Kiểm chứng: Gửi các mật khẩu hợp lệ trùng khớp từ liên kết hợp lệ; kiểm tra thông tin xác thực của tài khoản được cập nhật.",
        "steps": [
          {
            "step": "1",
            "action": "Từ link hợp lệ, nhập mật khẩu mới đạt chính sách (2 lần khớp) rồi gửi; sau đó thử đăng nhập bằng mật khẩu mới.",
            "expected": "Mật khẩu tài khoản được cập nhật thành mật khẩu mới — đăng nhập bằng mật khẩu mới thành công, mật khẩu cũ không còn dùng được (FR-authentication-018).",
            "testData": "Mật khẩu mới: Hoc2024!"
          }
        ]
      },
      {
        "stt": "11",
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "checklist": "CHK-authentication-081",
        "ref": [
          "FR-authentication-018"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "Đã đặt lại mật khẩu thành công từ một link (dựng: mở link còn hạn + đặt mật khẩu mới; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Hoàn tất đặt lại mật khẩu; kiểm tra mã thông báo đặt lại được đánh dấu là đã dùng",
        "description": "Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra mã thông báo đặt lại được đánh dấu là đã dùng.",
        "steps": [
          {
            "step": "1",
            "action": "Sau khi đặt lại thành công, mở LẠI đúng link đặt lại đó lần nữa.",
            "expected": "Link đã được đánh dấu là đã dùng — mở lại bị từ chối, dẫn tới trang kết quả link hết hạn/đã dùng (E-authentication-009), KHÔNG cho đặt lại mật khẩu lần nữa (FR-authentication-018 đánh dấu link đã dùng).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "12",
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "checklist": "CHK-authentication-082",
        "ref": [
          "FR-authentication-019",
          "BR-authentication-007"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "Tài khoản đang đăng nhập trên ≥2 thiết bị (dựng: đăng nhập cùng tài khoản ở 2 phiên; nguồn: FR-authentication-021)",
        "retired": false,
        "title": "Hoàn tất đặt lại mật khẩu; kiểm tra mọi phiên hiện có bị thu hồi",
        "description": "Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra mọi phiên hiện có bị thu hồi.",
        "steps": [
          {
            "step": "1",
            "action": "Trên thiết bị A, hoàn tất đặt lại mật khẩu; sau đó thao tác tiếp trên thiết bị B (đang đăng nhập từ trước).",
            "expected": "Mọi phiên đăng nhập trên tất cả thiết bị bị thu hồi sau khi đặt lại thành công — thiết bị B bị buộc đăng nhập lại, không thao tác tiếp được bằng phiên cũ (FR-authentication-019, BR-authentication-007).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "13",
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "checklist": "CHK-authentication-083",
        "ref": [
          "FR-authentication-018"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Hoàn tất đặt lại mật khẩu; kiểm tra thông báo thành công được hiển thị",
        "description": "Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra thông báo thành công được hiển thị.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập mật khẩu mới hợp lệ (2 lần khớp) rồi gửi để hoàn tất đặt lại.",
            "expected": "Màn hiển thị thông báo đặt lại thành công, báo cho người dùng biết mật khẩu đã được cập nhật (FR-authentication-018).",
            "testData": "Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "14",
        "category": "Đặt mật khẩu mới",
        "subcategory": "Đặt lại hợp lệ",
        "checklist": "CHK-authentication-084",
        "ref": [
          "FR-authentication-018"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "Vừa đặt lại mật khẩu thành công (dựng: mở link còn hạn + đặt mật khẩu mới; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Hoàn tất đặt lại mật khẩu; kiểm tra đích đến đăng nhập được cung cấp",
        "description": "Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra đích đến đăng nhập được cung cấp.",
        "steps": [
          {
            "step": "1",
            "action": "Ở màn thông báo thành công sau đặt lại, tìm lối vào đăng nhập.",
            "expected": "Màn thành công cung cấp đường dẫn/nút để người dùng đi tới màn đăng nhập bằng mật khẩu mới (do FR-authentication-019 đã thu hồi mọi phiên, buộc đăng nhập lại).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "15",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "checklist": "CHK-authentication-085",
        "ref": [
          "FR-authentication-020",
          "E-authentication-009"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Đã nhận link đặt lại mật khẩu (dựng: gửi yêu cầu quên mật khẩu; nguồn: FR-authentication-017)",
        "retired": false,
        "title": "Mở liên kết đặt lại sau 30 phút; kiểm tra kết quả liên kết hết hạn xuất hiện",
        "description": "Kiểm chứng: Mở liên kết đặt lại sau 30 phút; kiểm tra kết quả liên kết hết hạn xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Mở link đặt lại sau khi đã quá 30 phút kể từ lúc phát hành.",
            "expected": "Trang kết quả hiển thị \"Link đã hết hạn. [Quên mật khẩu] lại để nhận link mới.\" (E-authentication-009); KHÔNG hiển thị form đặt mật khẩu mới (FR-authentication-020).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "16",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "checklist": "CHK-authentication-086",
        "ref": [
          "FR-authentication-020",
          "E-authentication-009"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Đã có một link đặt lại đã được dùng để đổi mật khẩu (dựng: đặt lại thành công 1 lần; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Mở lại liên kết đặt lại đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện",
        "description": "Kiểm chứng: Mở lại liên kết đặt lại đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Mở lại đúng link đặt lại đã dùng trước đó.",
            "expected": "Trang kết quả hiển thị \"Link đã hết hạn. [Quên mật khẩu] lại để nhận link mới.\" (E-authentication-009); KHÔNG hiển thị form đặt mật khẩu mới (FR-authentication-020 chặn link đã dùng).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "17",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "checklist": "CHK-authentication-087",
        "ref": [
          "E-authentication-009"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "Đang ở trang kết quả link đặt lại hết hạn/đã dùng (dựng: mở link hết hạn hoặc đã dùng; nguồn: E-authentication-009)",
        "retired": false,
        "title": "Mở kết quả liên kết đặt lại không hợp lệ; kiểm tra tùy chọn yêu cầu đặt lại mới được cung cấp",
        "description": "Kiểm chứng: Mở kết quả liên kết đặt lại không hợp lệ; kiểm tra tùy chọn yêu cầu đặt lại mới được cung cấp.",
        "steps": [
          {
            "step": "1",
            "action": "Trên trang kết quả link không hợp lệ, tìm lối yêu cầu link mới.",
            "expected": "Trang cung cấp tùy chọn \"[Quên mật khẩu] lại để nhận link mới\" cho phép người dùng gửi yêu cầu đặt lại mới (E-authentication-009).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "18",
        "category": "Bảo mật cơ bản",
        "subcategory": "Sự kiện nhạy cảm",
        "checklist": "CHK-authentication-088",
        "ref": [
          "NFR-authentication-008"
        ],
        "priority": 2,
        "auto": "No",
        "preconditions": "Vừa đặt lại mật khẩu thành công (dựng: mở link còn hạn + đặt mật khẩu mới; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Hoàn tất đặt lại mật khẩu; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu",
        "description": "Kiểm chứng: Hoàn tất đặt lại mật khẩu; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu.",
        "steps": [
          {
            "step": "1",
            "action": "Sau khi đặt lại thành công, kiểm tra nhật ký sự kiện xác thực (audit log).",
            "expected": "Có một bản ghi sự kiện \"đặt lại mật khẩu\" trong nhật ký không sửa được (bất biến); bản ghi KHÔNG chứa giá trị mật khẩu (NFR-authentication-008).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "19",
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "checklist": "CHK-authentication-089",
        "ref": [
          "NFR-authentication-009"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "Đang ở màn đặt mật khẩu mới từ link còn hạn (dựng: mở link đặt lại còn hạn; nguồn: FR-authentication-018)",
        "retired": false,
        "title": "Điều hướng biểu mẫu đặt lại bằng Tab; kiểm tra trường mật khẩu mới nhận tiêu điểm bàn phím",
        "description": "Kiểm chứng: Điều hướng biểu mẫu đặt lại bằng Tab; kiểm tra trường mật khẩu mới nhận tiêu điểm bàn phím.",
        "steps": [
          {
            "step": "1",
            "action": "Dùng phím Tab điều hướng qua các trường của form đặt lại mật khẩu.",
            "expected": "Trường mật khẩu mới nhận được tiêu điểm bàn phím theo thứ tự Tab và có nhãn cho trình đọc màn hình (NFR-authentication-009, hỗ trợ điều hướng bàn phím + nhãn).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "20",
        "category": "Trường hợp biên",
        "subcategory": "Đặt lại trên nhiều thiết bị",
        "checklist": "CHK-authentication-090",
        "ref": [
          "FR-authentication-019"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Tài khoản đăng nhập đồng thời trên thiết bị A và B (dựng: đăng nhập cùng tài khoản ở 2 thiết bị; nguồn: FR-authentication-021)",
        "retired": false,
        "title": "Đặt lại mật khẩu trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác bị từ chối",
        "description": "Kiểm chứng: Đặt lại mật khẩu trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác bị từ chối.",
        "steps": [
          {
            "step": "1",
            "action": "Đặt lại mật khẩu thành công trên thiết bị A, rồi tiếp tục thao tác cần đăng nhập trên thiết bị B.",
            "expected": "Phiên đang hoạt động trên thiết bị B bị từ chối (thu hồi) ngay sau khi đặt lại thành công trên A — thiết bị B buộc đăng nhập lại bằng mật khẩu mới (FR-authentication-019).",
            "testData": "—"
          }
        ]
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-google-oauth",
    "file": "testcases-uc-google-oauth.md",
    "testcases": [
      {
        "stt": "21",
        "category": "Truy cập Google OAuth",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-057",
        "ref": [
          "FR-authentication-012"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Kiểm tra nút đăng nhập bằng Google hiển thị trên màn hình đăng nhập",
        "description": "Kiểm chứng: Kiểm tra nút đăng nhập bằng Google hiển thị trên màn hình đăng nhập.",
        "steps": [
          {
            "step": "1",
            "action": "Mở màn hình đăng nhập.",
            "expected": "Màn đăng nhập hiển thị nút đăng nhập bằng Google để người dùng chọn luồng đăng nhập/đăng ký Google (FR-authentication-012).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "22",
        "category": "Truy cập Google OAuth",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-058",
        "ref": [
          "FR-authentication-012"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Chọn đăng nhập bằng Google; kiểm tra điều hướng đến màn hình chấp thuận của Google",
        "description": "Kiểm chứng: Chọn đăng nhập bằng Google; kiểm tra điều hướng đến màn hình chấp thuận của Google.",
        "steps": [
          {
            "step": "1",
            "action": "Tại màn hình đăng nhập, chọn nút đăng nhập bằng Google.",
            "expected": "Hệ thống bắt đầu luồng đăng nhập/đăng ký Google để nhận email đã xác thực từ Google (FR-authentication-012). [TBD: cần BA cấp wording cho việc điều hướng tới màn hình chấp thuận của Google]",
            "testData": "Tài khoản Google đã xác minh: learner@email.com"
          }
        ]
      },
      {
        "stt": "23",
        "category": "Hoàn tất OAuth",
        "subcategory": "Tài khoản mới",
        "checklist": "CHK-authentication-059",
        "ref": [
          "FR-authentication-012"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Hoàn tất chấp thuận của Google bằng email Google đã xác minh; kiểm tra không yêu cầu trường hồ sơ bổ sung",
        "description": "Kiểm chứng: Hoàn tất chấp thuận của Google bằng email Google đã xác minh; kiểm tra không yêu cầu trường hồ sơ bổ sung.",
        "steps": [
          {
            "step": "1",
            "action": "Chọn đăng nhập bằng Google và hoàn tất chấp thuận bằng một tài khoản Google có email đã xác minh.",
            "expected": "Khi Google trả về email đã xác thực, hệ thống xác định người dùng qua email đó theo một luồng chung cho đăng ký và đăng nhập, không yêu cầu thêm trường nào ngoài dữ liệu Google trả về (FR-authentication-012).",
            "testData": "Tài khoản Google đã xác minh, chưa tồn tại trong hệ thống: new.google@example.com"
          }
        ]
      },
      {
        "stt": "24",
        "category": "Hoàn tất OAuth",
        "subcategory": "Tài khoản mới",
        "checklist": "CHK-authentication-060",
        "ref": [
          "FR-authentication-013",
          "BR-authentication-009"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Hoàn tất chấp thuận của Google bằng email mới; kiểm tra trạng thái tài khoản được tạo là đã xác minh",
        "description": "Kiểm chứng: Hoàn tất chấp thuận của Google bằng email mới; kiểm tra trạng thái tài khoản được tạo là đã xác minh.",
        "steps": [
          {
            "step": "1",
            "action": "Chọn đăng nhập bằng Google và hoàn tất chấp thuận bằng một email Google đã xác minh chưa tồn tại trong hệ thống.",
            "expected": "Hệ thống tạo tài khoản mới với trạng thái `verified`; tài khoản tạo qua Google được coi là `verified` ngay vì Google đã xác thực email (FR-authentication-013, BR-authentication-009).",
            "testData": "Tài khoản Google đã xác minh, chưa tồn tại trong hệ thống: new.google@example.com"
          }
        ]
      },
      {
        "stt": "25",
        "category": "Hoàn tất OAuth",
        "subcategory": "Tài khoản mới",
        "checklist": "CHK-authentication-061",
        "ref": [
          "FR-authentication-012"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Hoàn tất chấp thuận của Google bằng email mới; kiểm tra điều hướng vào ứng dụng",
        "description": "Kiểm chứng: Hoàn tất chấp thuận của Google bằng email mới; kiểm tra điều hướng vào ứng dụng.",
        "steps": [
          {
            "step": "1",
            "action": "Chọn đăng nhập bằng Google và hoàn tất chấp thuận bằng một email Google đã xác minh chưa tồn tại trong hệ thống.",
            "expected": "Khi Google trả về email đã xác thực, hệ thống hoàn tất luồng nhận diện người dùng qua email đó mà không hỏi thêm field ngoài dữ liệu Google trả về (FR-authentication-012). [TBD: cần BA cấp wording cho màn đích sau khi hoàn tất luồng Google]",
            "testData": "Tài khoản Google đã xác minh, chưa tồn tại trong hệ thống: new.google@example.com"
          }
        ]
      },
      {
        "stt": "26",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Callback thất bại",
        "checklist": "CHK-authentication-065",
        "ref": [
          "FR-authentication-015",
          "E-authentication-008"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Hủy chấp thuận của Google; kiểm tra quay lại màn hình đăng nhập",
        "description": "Kiểm chứng: Hủy chấp thuận của Google; kiểm tra quay lại màn hình đăng nhập.",
        "steps": [
          {
            "step": "1",
            "action": "Chọn đăng nhập bằng Google, sau đó hủy chấp thuận tại Google.",
            "expected": "Hệ thống trở về màn hình đăng nhập và hiển thị \"Đăng nhập Google thất bại. Vui lòng thử lại.\" (E-authentication-008).",
            "testData": "Tài khoản Google đã xác minh: learner@email.com"
          }
        ]
      },
      {
        "stt": "27",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Callback thất bại",
        "checklist": "CHK-authentication-066",
        "ref": [
          "FR-authentication-015",
          "E-authentication-008"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Mô phỏng callback Google thất bại; kiểm tra thông báo lỗi Google xuất hiện",
        "description": "Kiểm chứng: Mô phỏng callback Google thất bại; kiểm tra thông báo lỗi Google xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Mô phỏng callback Google trả về lỗi sau khi chọn đăng nhập bằng Google.",
            "expected": "Hệ thống trở về màn hình đăng nhập và hiển thị \"Đăng nhập Google thất bại. Vui lòng thử lại.\" (E-authentication-008).",
            "testData": "Callback Google: lỗi"
          }
        ]
      },
      {
        "stt": "28",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Callback thất bại",
        "checklist": "CHK-authentication-067",
        "ref": [
          "FR-authentication-015"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Mô phỏng callback Google thất bại; kiểm tra không có tài khoản chưa hoàn chỉnh nào được lưu",
        "description": "Kiểm chứng: Mô phỏng callback Google thất bại; kiểm tra không có tài khoản chưa hoàn chỉnh nào được lưu.",
        "steps": [
          {
            "step": "1",
            "action": "Mô phỏng callback Google thất bại cho một email Google chưa tồn tại trong hệ thống.",
            "expected": "Callback Google thất bại không tạo tài khoản dở dang trong hệ thống (FR-authentication-015).",
            "testData": "Email Google chưa tồn tại: failed.google@example.com; callback Google: lỗi"
          }
        ]
      },
      {
        "stt": "29",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Callback thất bại",
        "checklist": "CHK-authentication-068",
        "ref": [
          "E-authentication-008"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Mở trạng thái lỗi Google; kiểm tra có tùy chọn thử lại hiển thị",
        "description": "Kiểm chứng: Mở trạng thái lỗi Google; kiểm tra có tùy chọn thử lại hiển thị.",
        "steps": [
          {
            "step": "1",
            "action": "Mở trạng thái callback Google thất bại tại luồng đăng nhập bằng Google.",
            "expected": "Hệ thống trở về màn hình đăng nhập và hiển thị \"Đăng nhập Google thất bại. Vui lòng thử lại.\"; người dùng có thể thử lại Google hoặc dùng email/mật khẩu (E-authentication-008).",
            "testData": "Callback Google: lỗi"
          }
        ]
      },
      {
        "stt": "30",
        "category": "Bảo mật cơ bản",
        "subcategory": "Nhật ký kiểm toán",
        "checklist": "CHK-authentication-069",
        "ref": [
          "NFR-authentication-008"
        ],
        "priority": 2,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Tự động liên kết Google với tài khoản hiện có; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu",
        "description": "Kiểm chứng: Tự động liên kết Google với tài khoản hiện có; kiểm tra một sự kiện kiểm toán bất biến được ghi lại mà không chứa mật khẩu.",
        "steps": [
          {
            "step": "1",
            "action": "Hoàn tất chấp thuận Google bằng email trùng với một tài khoản hiện có để hệ thống tự liên kết Google.",
            "expected": "Hệ thống ghi một sự kiện tự liên kết Google trong nhật ký không sửa được; nhật ký không chứa mật khẩu (NFR-authentication-008).",
            "testData": "Tài khoản hiện có và email Google đã xác minh trùng nhau: existing@email.com"
          }
        ]
      },
      {
        "stt": "31",
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím",
        "checklist": "CHK-authentication-070",
        "ref": [
          "NFR-authentication-009"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Điều hướng màn hình đăng nhập bằng Tab; kiểm tra nút đăng nhập bằng Google nhận tiêu điểm bàn phím",
        "description": "Kiểm chứng: Điều hướng màn hình đăng nhập bằng Tab; kiểm tra nút đăng nhập bằng Google nhận tiêu điểm bàn phím.",
        "steps": [
          {
            "step": "1",
            "action": "Tại màn hình đăng nhập, nhấn Tab để điều hướng qua các trường và nút chính đến nút đăng nhập bằng Google.",
            "expected": "Form đăng nhập hỗ trợ điều hướng bàn phím; nút đăng nhập bằng Google nhận tiêu điểm bàn phím như một nút chính của màn hình (NFR-authentication-009).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "32",
        "category": "Trường hợp biên",
        "subcategory": "Email hiện có",
        "checklist": "CHK-authentication-062",
        "ref": [
          "FR-authentication-014",
          "BR-authentication-003"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra liên kết nhà cung cấp Google được tạo",
        "description": "Kiểm chứng: Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra liên kết nhà cung cấp Google được tạo.",
        "steps": [
          {
            "step": "1",
            "action": "Hoàn tất chấp thuận Google bằng email trùng với một tài khoản hiện có.",
            "expected": "Hệ thống tự liên kết Google vào tài khoản hiện có, đánh dấu tài khoản `verified` và đăng nhập (FR-authentication-014, BR-authentication-003).",
            "testData": "Tài khoản hiện có và email Google đã xác minh trùng nhau: existing@email.com"
          }
        ]
      },
      {
        "stt": "33",
        "category": "Trường hợp biên",
        "subcategory": "Email hiện có",
        "checklist": "CHK-authentication-063",
        "ref": [
          "FR-authentication-014",
          "BR-authentication-002"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không có tài khoản thứ hai được tạo",
        "description": "Kiểm chứng: Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không có tài khoản thứ hai được tạo.",
        "steps": [
          {
            "step": "1",
            "action": "Hoàn tất chấp thuận Google bằng email trùng với một tài khoản hiện có.",
            "expected": "Hệ thống không tạo tài khoản thứ hai: email là định danh duy nhất và một email chỉ có một tài khoản dùng chung cho cả hai phương thức (FR-authentication-014, BR-authentication-002).",
            "testData": "Tài khoản hiện có và email Google đã xác minh trùng nhau: existing@email.com"
          }
        ]
      },
      {
        "stt": "34",
        "category": "Trường hợp biên",
        "subcategory": "Email hiện có",
        "checklist": "CHK-authentication-064",
        "ref": [
          "FR-authentication-014",
          "BR-authentication-003"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không yêu cầu mật khẩu cũ",
        "description": "Kiểm chứng: Hoàn tất chấp thuận của Google bằng email của tài khoản hiện có; kiểm tra không yêu cầu mật khẩu cũ.",
        "steps": [
          {
            "step": "1",
            "action": "Hoàn tất chấp thuận Google bằng email trùng với một tài khoản hiện có.",
            "expected": "Hệ thống tự liên kết Google và đăng nhập vào tài khoản hiện có mà không yêu cầu nhập mật khẩu cũ (FR-authentication-014, BR-authentication-003).",
            "testData": "Tài khoản hiện có và email Google đã xác minh trùng nhau: existing@email.com"
          }
        ]
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-login-email",
    "file": "testcases-uc-login-email.md",
    "testcases": [
      {
        "stt": "35",
        "category": "Truy cập đăng nhập",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-037",
        "ref": [
          "—"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Kiểm tra biểu mẫu đăng nhập bằng email có thể truy cập từ phiên chưa xác thực",
        "description": "Kiểm chứng: Kiểm tra biểu mẫu đăng nhập bằng email có thể truy cập từ phiên chưa xác thực.",
        "steps": [
          {
            "step": "1",
            "action": "Từ một phiên chưa xác thực, truy cập màn đăng nhập.",
            "expected": "Màn login hiển thị form email/mật khẩu cho phiên chưa xác thực.",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "36",
        "category": "Gửi thông tin xác thực",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-038",
        "ref": [
          "FR-authentication-008"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Tài khoản đã có 5 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 5 lần; nguồn: FR-authentication-026)",
        "retired": false,
        "title": "Gửi thông tin xác thực hợp lệ cho tài khoản đã xác minh và không bị khóa; kiểm tra điều hướng vào ứng dụng",
        "description": "Kiểm chứng: Gửi thông tin xác thực hợp lệ cho tài khoản đã xác minh và không bị khóa; kiểm tra điều hướng vào ứng dụng.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email và mật khẩu đúng của tài khoản đã verified, không bị khóa, rồi gửi form đăng nhập.",
            "expected": "Hệ thống tạo phiên đăng nhập và cho người dùng vào app (FR-authentication-008).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "37",
        "category": "Gửi thông tin xác thực",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-039",
        "ref": [
          "FR-authentication-008"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "Đã nhận link đặt lại mật khẩu còn hạn (dựng: gửi yêu cầu quên mật khẩu; nguồn: FR-authentication-017)",
        "retired": false,
        "title": "Đăng nhập thành công sau các lần thất bại trước đó; kiểm tra bộ đếm lần thử thất bại được đặt lại",
        "description": "Kiểm chứng: Đăng nhập thành công sau các lần thất bại trước đó; kiểm tra bộ đếm lần thử thất bại được đặt lại.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email và mật khẩu đúng của tài khoản đã verified, không bị khóa, rồi gửi form đăng nhập sau các lần đăng nhập sai trước đó.",
            "expected": "Hệ thống tạo phiên đăng nhập và cho người dùng vào app (FR-authentication-008). SRS chưa đặc tả điều kiện đặt lại bộ đếm lần đăng nhập sai sau khi đăng nhập thành công [TBD: cần BA cấp wording]",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "38",
        "category": "Gửi thông tin xác thực",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-040",
        "ref": [
          "FR-authentication-011"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Mở biểu mẫu đăng nhập; kiểm tra tùy chọn nhớ đăng nhập mặc định tắt",
        "description": "Kiểm chứng: Mở biểu mẫu đăng nhập; kiểm tra tùy chọn nhớ đăng nhập mặc định tắt.",
        "steps": [
          {
            "step": "1",
            "action": "Mở màn đăng nhập và quan sát tùy chọn remember-me.",
            "expected": "Tùy chọn remember-me ở trạng thái tắt mặc định (FR-authentication-011).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "39",
        "category": "Gửi thông tin xác thực",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-041",
        "ref": [
          "FR-authentication-011",
          "NFR-authentication-006"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Đăng nhập khi bật tùy chọn nhớ đăng nhập; kiểm tra phiên thiết bị vẫn hợp lệ trong 30 ngày",
        "description": "Kiểm chứng: Đăng nhập khi bật tùy chọn nhớ đăng nhập; kiểm tra phiên thiết bị vẫn hợp lệ trong 30 ngày.",
        "steps": [
          {
            "step": "1",
            "action": "Bật tùy chọn remember-me, nhập email và mật khẩu đúng, rồi gửi form đăng nhập; kiểm tra lại phiên trên cùng thiết bị trong thời hạn 30 ngày.",
            "expected": "Hệ thống giữ phiên đăng nhập trên thiết bị đó trong 30 ngày (FR-authentication-011, NFR-authentication-006).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "40",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Thông tin xác thực không hợp lệ",
        "checklist": "CHK-authentication-042",
        "ref": [
          "FR-authentication-010",
          "E-authentication-003"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi mật khẩu sai cho email hiện có; kiểm tra thông báo chung về thông tin xác thực không hợp lệ xuất hiện",
        "description": "Kiểm chứng: Gửi mật khẩu sai cho email hiện có; kiểm tra thông báo chung về thông tin xác thực không hợp lệ xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email của tài khoản hiện có cùng mật khẩu sai rồi gửi form đăng nhập.",
            "expected": "Form đăng nhập hiện \"Email hoặc mật khẩu không đúng\" và tăng bộ đếm sai +1 (E-authentication-003).",
            "testData": "Email: learner@email.com / Mật khẩu: Sai123!"
          }
        ]
      },
      {
        "stt": "41",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Thông tin xác thực không hợp lệ",
        "checklist": "CHK-authentication-043",
        "ref": [
          "FR-authentication-010",
          "NFR-authentication-007"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi email không tồn tại; kiểm tra cùng thông báo chung về thông tin xác thực không hợp lệ xuất hiện",
        "description": "Kiểm chứng: Gửi email không tồn tại; kiểm tra cùng thông báo chung về thông tin xác thực không hợp lệ xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email không tồn tại cùng một mật khẩu rồi gửi form đăng nhập.",
            "expected": "Form đăng nhập hiện cùng thông báo chung \"Email hoặc mật khẩu không đúng\", không tiết lộ email nào tồn tại (FR-authentication-010, NFR-authentication-007).",
            "testData": "Email: unknown@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "42",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Thông tin xác thực không hợp lệ",
        "checklist": "CHK-authentication-044",
        "ref": [
          "FR-authentication-010"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi thông tin xác thực không hợp lệ; kiểm tra bộ đếm lần thử thất bại tăng thêm một",
        "description": "Kiểm chứng: Gửi thông tin xác thực không hợp lệ; kiểm tra bộ đếm lần thử thất bại tăng thêm một.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email của tài khoản hiện có cùng mật khẩu sai rồi gửi form đăng nhập.",
            "expected": "Form đăng nhập hiện \"Email hoặc mật khẩu không đúng\" và bộ đếm lần đăng nhập sai tăng +1 (FR-authentication-010).",
            "testData": "Email: learner@email.com / Mật khẩu: Sai123!"
          }
        ]
      },
      {
        "stt": "43",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Chưa xác minh và lỗi mạng",
        "checklist": "CHK-authentication-050",
        "ref": [
          "FR-authentication-009",
          "E-authentication-004"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra quyền truy cập ứng dụng bị chặn",
        "description": "Kiểm chứng: Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra quyền truy cập ứng dụng bị chặn.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email và mật khẩu đúng của tài khoản ở trạng thái unverified rồi gửi form đăng nhập.",
            "expected": "Form hiện \"Tài khoản chưa được xác nhận. [Gửi lại email xác nhận]\" và chặn người dùng vào app (E-authentication-004).",
            "testData": "Email: unverified@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "44",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Chưa xác minh và lỗi mạng",
        "checklist": "CHK-authentication-051",
        "ref": [
          "FR-authentication-009",
          "E-authentication-004"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra nút gửi lại xác nhận xuất hiện",
        "description": "Kiểm chứng: Gửi thông tin xác thực đúng cho tài khoản chưa xác minh; kiểm tra nút gửi lại xác nhận xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email và mật khẩu đúng của tài khoản ở trạng thái unverified rồi gửi form đăng nhập.",
            "expected": "Form hiện \"Tài khoản chưa được xác nhận. [Gửi lại email xác nhận]\", gồm tùy chọn gửi lại email xác nhận (E-authentication-004).",
            "testData": "Email: unverified@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "45",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Chưa xác minh và lỗi mạng",
        "checklist": "CHK-authentication-052",
        "ref": [
          "FR-authentication-027",
          "BR-authentication-011"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Mô phỏng lỗi mạng khi đăng nhập; kiểm tra bộ đếm lần thử thất bại không thay đổi",
        "description": "Kiểm chứng: Mô phỏng lỗi mạng khi đăng nhập; kiểm tra bộ đếm lần thử thất bại không thay đổi.",
        "steps": [
          {
            "step": "1",
            "action": "Mô phỏng lỗi mạng khi gửi form đăng nhập bằng email và mật khẩu.",
            "expected": "Lần đăng nhập thất bại do lỗi mạng không làm tăng bộ đếm lần đăng nhập sai (FR-authentication-027, BR-authentication-011).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "46",
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "checklist": "CHK-authentication-045",
        "ref": [
          "FR-authentication-025",
          "BR-authentication-006"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Tài khoản đã có 3 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 3 lần; nguồn: FR-authentication-025)",
        "retired": false,
        "title": "Tạo ba lần thử không hợp lệ liên tiếp; kiểm tra captcha hiển thị ở lần thử tiếp theo",
        "description": "Kiểm chứng: Tạo ba lần thử không hợp lệ liên tiếp; kiểm tra captcha hiển thị ở lần thử tiếp theo.",
        "steps": [
          {
            "step": "1",
            "action": "Sau 3 lần đăng nhập sai liên tiếp, thực hiện lần thử đăng nhập tiếp theo.",
            "expected": "Hệ thống yêu cầu captcha ở lần thử đăng nhập tiếp theo (FR-authentication-025, BR-authentication-006).",
            "testData": "Email: learner@email.com / Mật khẩu: Sai123!"
          }
        ]
      },
      {
        "stt": "47",
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "checklist": "CHK-authentication-046",
        "ref": [
          "FR-authentication-025"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Tài khoản đã có 3 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 3 lần; nguồn: FR-authentication-025)",
        "retired": false,
        "title": "Gửi lần thử tiếp theo mà không hoàn tất captcha; kiểm tra đăng nhập bị chặn",
        "description": "Kiểm chứng: Gửi lần thử tiếp theo mà không hoàn tất captcha; kiểm tra đăng nhập bị chặn.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email và mật khẩu đúng, để captcha chưa hoàn tất, rồi gửi form đăng nhập.",
            "expected": "Hệ thống yêu cầu captcha ở các lần thử sau 3 lần đăng nhập sai liên tiếp; khi captcha chưa được hoàn tất, đăng nhập không được thực hiện (FR-authentication-025).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "48",
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "checklist": "CHK-authentication-047",
        "ref": [
          "FR-authentication-026",
          "BR-authentication-005"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "Tài khoản đã có 5 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 5 lần; nguồn: FR-authentication-026)",
        "retired": false,
        "title": "Tạo năm lần thử không hợp lệ liên tiếp; kiểm tra việc khóa tài khoản được ghi nhận trong 24 giờ",
        "description": "Kiểm chứng: Tạo năm lần thử không hợp lệ liên tiếp; kiểm tra việc khóa tài khoản được ghi nhận trong 24 giờ.",
        "steps": [
          {
            "step": "1",
            "action": "Gửi 5 lần đăng nhập liên tiếp bằng email của cùng tài khoản và mật khẩu sai.",
            "expected": "Sau 5 lần đăng nhập sai liên tiếp, hệ thống khóa tài khoản trong 24 giờ và tự mở khóa sau đó (FR-authentication-026, BR-authentication-005).",
            "testData": "Email: learner@email.com / Mật khẩu: Sai123!"
          }
        ]
      },
      {
        "stt": "49",
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "checklist": "CHK-authentication-048",
        "ref": [
          "FR-authentication-026",
          "E-authentication-005"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "Tài khoản đã có 5 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 5 lần; nguồn: FR-authentication-026)",
        "retired": false,
        "title": "Gửi thông tin xác thực cho tài khoản bị khóa; kiểm tra thông báo khóa tạm thời xuất hiện",
        "description": "Kiểm chứng: Gửi thông tin xác thực cho tài khoản bị khóa; kiểm tra thông báo khóa tạm thời xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Nhập email và mật khẩu đúng của tài khoản đang bị khóa rồi gửi form đăng nhập.",
            "expected": "Form hiện \"Tài khoản tạm khóa do nhiều lần đăng nhập sai. Vui lòng thử lại sau {X} giờ.\" (E-authentication-005).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "50",
        "category": "Bảo mật cơ bản",
        "subcategory": "Captcha và khóa tài khoản",
        "checklist": "CHK-authentication-049",
        "ref": [
          "FR-authentication-026"
        ],
        "priority": 2,
        "auto": "No",
        "preconditions": "Tài khoản đã có 5 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 5 lần; nguồn: FR-authentication-026)",
        "retired": false,
        "title": "Chuyển tài khoản bị khóa vượt quá 24 giờ; kiểm tra tài khoản đủ điều kiện đăng nhập trở lại",
        "description": "Kiểm chứng: Chuyển tài khoản bị khóa vượt quá 24 giờ; kiểm tra tài khoản đủ điều kiện đăng nhập trở lại.",
        "steps": [
          {
            "step": "1",
            "action": "Chuyển thời điểm kiểm thử đến sau 24 giờ kể từ khi tài khoản bị khóa, rồi gửi form đăng nhập với email và mật khẩu đúng.",
            "expected": "Hệ thống tự mở khóa tài khoản sau 24 giờ và cho phép đăng nhập trở lại khi thông tin xác thực khớp (FR-authentication-026).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "51",
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "checklist": "CHK-authentication-056",
        "ref": [
          "NFR-authentication-009"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Điều hướng biểu mẫu đăng nhập bằng Tab; kiểm tra trường email nhận tiêu điểm bàn phím",
        "description": "Kiểm chứng: Điều hướng biểu mẫu đăng nhập bằng Tab; kiểm tra trường email nhận tiêu điểm bàn phím.",
        "steps": [
          {
            "step": "1",
            "action": "Mở màn đăng nhập và nhấn phím Tab để điều hướng qua các thành phần của form.",
            "expected": "Form đăng nhập hỗ trợ điều hướng bàn phím; trường email nhận tiêu điểm bàn phím (NFR-authentication-009).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "52",
        "category": "Trường hợp biên",
        "subcategory": "Phiên đồng thời",
        "checklist": "CHK-authentication-053",
        "ref": [
          "FR-authentication-021"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Đăng nhập cùng tài khoản trên thiết bị thứ hai; kiểm tra phiên trên thiết bị đầu tiên vẫn hoạt động",
        "description": "Kiểm chứng: Đăng nhập cùng tài khoản trên thiết bị thứ hai; kiểm tra phiên trên thiết bị đầu tiên vẫn hoạt động.",
        "steps": [
          {
            "step": "1",
            "action": "Đăng nhập cùng một tài khoản trên thiết bị thứ hai, rồi tiếp tục sử dụng phiên đang đăng nhập trên thiết bị thứ nhất.",
            "expected": "Hệ thống cho phép cùng tài khoản đăng nhập đồng thời trên nhiều thiết bị; phiên trên thiết bị thứ nhất vẫn hoạt động (FR-authentication-021).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "53",
        "category": "Trường hợp biên",
        "subcategory": "Phiên đồng thời",
        "checklist": "CHK-authentication-054",
        "ref": [
          "FR-authentication-022"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Chọn đăng xuất trên thiết bị hiện tại; kiểm tra thiết bị đó trở về trạng thái chưa xác thực",
        "description": "Kiểm chứng: Chọn đăng xuất trên thiết bị hiện tại; kiểm tra thiết bị đó trở về trạng thái chưa xác thực.",
        "steps": [
          {
            "step": "1",
            "action": "Trên thiết bị đang đăng nhập, chọn đăng xuất.",
            "expected": "Hệ thống thu hồi phiên của thiết bị hiện tại; thiết bị trở về trạng thái chưa xác thực và không hiện hộp thoại xác nhận (FR-authentication-022).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "54",
        "category": "Trường hợp biên",
        "subcategory": "Phiên đồng thời",
        "checklist": "CHK-authentication-055",
        "ref": [
          "FR-authentication-022"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Chọn đăng xuất trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác vẫn sử dụng được",
        "description": "Kiểm chứng: Chọn đăng xuất trên một thiết bị; kiểm tra phiên đang hoạt động trên thiết bị khác vẫn sử dụng được.",
        "steps": [
          {
            "step": "1",
            "action": "Trên thiết bị thứ nhất đang đăng nhập, chọn đăng xuất; sau đó tiếp tục sử dụng phiên đang hoạt động trên thiết bị thứ hai.",
            "expected": "Hệ thống chỉ thu hồi phiên của thiết bị thứ nhất; phiên đang hoạt động trên thiết bị thứ hai không bị ảnh hưởng và vẫn sử dụng được (FR-authentication-022).",
            "testData": "—"
          }
        ]
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-signup-email",
    "file": "testcases-uc-signup-email.md",
    "testcases": [
      {
        "stt": "55",
        "category": "Truy cập đăng ký",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-001",
        "ref": [
          "—"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Kiểm tra biểu mẫu đăng ký có thể truy cập từ phiên chưa xác thực",
        "description": "Kiểm chứng: Kiểm tra biểu mẫu đăng ký có thể truy cập từ phiên chưa xác thực.",
        "steps": [
          {
            "step": "1",
            "action": "Từ một phiên chưa xác thực, truy cập form đăng ký.",
            "expected": "Form đăng ký mở được khi phiên chưa xác thực. [TBD: cần BA cấp wording]",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "56",
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "checklist": "CHK-authentication-002",
        "ref": [
          "FR-authentication-003"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu hợp lệ gồm 8 ký tự; kiểm tra trường chấp nhận mật khẩu",
        "description": "Kiểm chứng: Nhập mật khẩu hợp lệ gồm 8 ký tự; kiểm tra trường chấp nhận mật khẩu.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập mật khẩu 8 ký tự thỏa chính sách.",
            "expected": "Trường mật khẩu chấp nhận giá trị vì có độ dài 8 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, đồng thời không chứa local-part email (FR-authentication-003).",
            "testData": "Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "57",
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "checklist": "CHK-authentication-003",
        "ref": [
          "FR-authentication-003"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu hợp lệ gồm 20 ký tự; kiểm tra trường chấp nhận mật khẩu",
        "description": "Kiểm chứng: Nhập mật khẩu hợp lệ gồm 20 ký tự; kiểm tra trường chấp nhận mật khẩu.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập mật khẩu 20 ký tự thỏa chính sách.",
            "expected": "Trường mật khẩu chấp nhận giá trị vì có độ dài 20 ký tự, gồm ít nhất 1 chữ hoa, 1 chữ thường và 1 ký tự đặc biệt, đồng thời không chứa local-part email (FR-authentication-003).",
            "testData": "Mật khẩu: Hocmatkhau2024!Abcde (20 ký tự)"
          }
        ]
      },
      {
        "stt": "58",
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "checklist": "CHK-authentication-004",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu gồm 7 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện",
        "description": "Kiểm chứng: Nhập mật khẩu gồm 7 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập mật khẩu 7 ký tự vào trường mật khẩu.",
            "expected": "Form hiện lỗi inline real-time \"Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn\" (E-authentication-002).",
            "testData": "Mật khẩu: Hoc24! (7 ký tự)"
          }
        ]
      },
      {
        "stt": "59",
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "checklist": "CHK-authentication-005",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu gồm 21 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện",
        "description": "Kiểm chứng: Nhập mật khẩu gồm 21 ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập mật khẩu 21 ký tự vào trường mật khẩu.",
            "expected": "Form hiện lỗi inline real-time \"Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn\" (E-authentication-002).",
            "testData": "Mật khẩu: Hoclongpassword2024!A (21 ký tự)"
          }
        ]
      },
      {
        "stt": "60",
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "checklist": "CHK-authentication-006",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu không có chữ hoa; kiểm tra lỗi chính sách nội tuyến xuất hiện",
        "description": "Kiểm chứng: Nhập mật khẩu không có chữ hoa; kiểm tra lỗi chính sách nội tuyến xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập mật khẩu không có chữ hoa vào trường mật khẩu.",
            "expected": "Form hiện lỗi inline real-time \"Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn\" (E-authentication-002).",
            "testData": "Mật khẩu: hoc2024! (không hoa)"
          }
        ]
      },
      {
        "stt": "61",
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "checklist": "CHK-authentication-007",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu không có chữ thường; kiểm tra lỗi chính sách nội tuyến xuất hiện",
        "description": "Kiểm chứng: Nhập mật khẩu không có chữ thường; kiểm tra lỗi chính sách nội tuyến xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập mật khẩu không có chữ thường vào trường mật khẩu.",
            "expected": "Form hiện lỗi inline real-time \"Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn\" (E-authentication-002).",
            "testData": "Mật khẩu: HOC2024! (không thường)"
          }
        ]
      },
      {
        "stt": "62",
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "checklist": "CHK-authentication-008",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu không có ký tự đặc biệt; kiểm tra lỗi chính sách nội tuyến xuất hiện",
        "description": "Kiểm chứng: Nhập mật khẩu không có ký tự đặc biệt; kiểm tra lỗi chính sách nội tuyến xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập mật khẩu không có ký tự đặc biệt vào trường mật khẩu.",
            "expected": "Form hiện lỗi inline real-time \"Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn\" (E-authentication-002).",
            "testData": "Mật khẩu: Hoc20240 (không ký tự đặc biệt)"
          }
        ]
      },
      {
        "stt": "63",
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "checklist": "CHK-authentication-009",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu chứa phần cục bộ của email có ít nhất ba ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện",
        "description": "Kiểm chứng: Nhập mật khẩu chứa phần cục bộ của email có ít nhất ba ký tự; kiểm tra lỗi chính sách nội tuyến xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập email rồi nhập mật khẩu có chứa local-part của email (ít nhất 3 ký tự) vào trường mật khẩu.",
            "expected": "Form hiện lỗi inline real-time \"Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn\" (E-authentication-002).",
            "testData": "Email: learner@example.com; Mật khẩu: Learner!1"
          }
        ]
      },
      {
        "stt": "64",
        "category": "Nhập thông tin xác thực",
        "subcategory": "Chính sách mật khẩu",
        "checklist": "CHK-authentication-010",
        "ref": [
          "FR-authentication-029"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu; kiểm tra chỉ báo độ mạnh cập nhật theo thời gian thực",
        "description": "Kiểm chứng: Nhập mật khẩu; kiểm tra chỉ báo độ mạnh cập nhật theo thời gian thực.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, lần lượt nhập các mật khẩu có độ mạnh khác nhau vào trường mật khẩu.",
            "expected": "Chỉ báo mức độ mạnh của mật khẩu cập nhật theo thời gian thực khi người dùng nhập mật khẩu trên form đăng ký (FR-authentication-029).",
            "testData": "Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "65",
        "category": "Gửi đăng ký",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-011",
        "ref": [
          "FR-authentication-001"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra trạng thái tài khoản được tạo là chưa xác minh",
        "description": "Kiểm chứng: Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra trạng thái tài khoản được tạo là chưa xác minh.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập email chưa tồn tại và mật khẩu đạt chính sách rồi gửi form.",
            "expected": "Hệ thống tạo tài khoản với trạng thái `unverified` khi email và mật khẩu hợp lệ, đồng thời email chưa tồn tại (FR-authentication-001).",
            "testData": "Email: newuser@example.com; Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "66",
        "category": "Gửi đăng ký",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-012",
        "ref": [
          "FR-authentication-004"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra email xác nhận chứa liên kết có hiệu lực 24 giờ được gửi đi",
        "description": "Kiểm chứng: Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra email xác nhận chứa liên kết có hiệu lực 24 giờ được gửi đi.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập email chưa tồn tại và mật khẩu đạt chính sách rồi gửi form; kiểm tra hộp thư của email đã đăng ký.",
            "expected": "Sau khi tài khoản được tạo, hệ thống gửi tới địa chỉ đã đăng ký email chứa link xác nhận có hạn 24 giờ (FR-authentication-004).",
            "testData": "Email: newuser@example.com; Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "67",
        "category": "Gửi đăng ký",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-013",
        "ref": [
          "FR-authentication-004"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra màn hình đã gửi xác nhận hiển thị email đã gửi",
        "description": "Kiểm chứng: Gửi thông tin xác thực hợp lệ và duy nhất; kiểm tra màn hình đã gửi xác nhận hiển thị email đã gửi.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập email chưa tồn tại và mật khẩu đạt chính sách rồi gửi form.",
            "expected": "Hệ thống gửi email xác nhận chứa link có hạn 24 giờ tới địa chỉ đã đăng ký; SRS không nêu màn hình xác nhận sau khi gửi hoặc việc hiển thị lại địa chỉ email. [TBD: cần BA cấp wording]",
            "testData": "Email: newuser@example.com; Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "68",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Email đã tồn tại",
        "checklist": "CHK-authentication-014",
        "ref": [
          "FR-authentication-002",
          "E-authentication-001"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Gửi email đã đăng ký; kiểm tra lỗi nội tuyến email trùng lặp xuất hiện",
        "description": "Kiểm chứng: Gửi email đã đăng ký; kiểm tra lỗi nội tuyến email trùng lặp xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập email đã đăng ký và mật khẩu đạt chính sách rồi gửi form.",
            "expected": "Form đăng ký hiện lỗi inline \"Email này đã được đăng ký. Bạn muốn [đăng nhập] hoặc [quên mật khẩu]?\"; hệ thống chặn tạo tài khoản (E-authentication-001).",
            "testData": "Email: learner@email.com; Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "69",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Email đã tồn tại",
        "checklist": "CHK-authentication-015",
        "ref": [
          "E-authentication-001"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Chọn liên kết khôi phục đăng nhập từ lỗi email trùng lặp; kiểm tra điều hướng đến luồng đăng nhập",
        "description": "Kiểm chứng: Chọn liên kết khôi phục đăng nhập từ lỗi email trùng lặp; kiểm tra điều hướng đến luồng đăng nhập.",
        "steps": [
          {
            "step": "1",
            "action": "Gửi form đăng ký với email đã đăng ký, rồi chọn liên kết [đăng nhập] trong lỗi inline xuất hiện.",
            "expected": "Form đăng ký hiện lỗi inline \"Email này đã được đăng ký. Bạn muốn [đăng nhập] hoặc [quên mật khẩu]?\"; khi chọn [đăng nhập], người dùng được chuyển sang luồng đăng nhập (E-authentication-001).",
            "testData": "Email: learner@email.com; Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "70",
        "category": "Bảo mật cơ bản",
        "subcategory": "Bảo vệ khỏi bot",
        "checklist": "CHK-authentication-016",
        "ref": [
          "FR-authentication-031"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "Tài khoản đã có 3 lần đăng nhập sai liên tiếp (dựng: submit sai mật khẩu 3 lần; nguồn: FR-authentication-025)",
        "retired": false,
        "title": "Kích hoạt bảo vệ khỏi bot khi đăng ký; kiểm tra captcha được yêu cầu trước khi gửi",
        "description": "Kiểm chứng: Kích hoạt bảo vệ khỏi bot khi đăng ký; kiểm tra captcha được yêu cầu trước khi gửi.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhập email và mật khẩu đạt chính sách, không hoàn tất captcha rồi gửi form.",
            "expected": "Form đăng ký yêu cầu captcha trước khi gửi để chống đăng ký hàng loạt bằng bot (FR-authentication-031).",
            "testData": "Email: newuser@example.com; Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "71",
        "category": "Bảo mật cơ bản",
        "subcategory": "Bảo vệ khỏi bot",
        "checklist": "CHK-authentication-017",
        "ref": [
          "NFR-authentication-003"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Kiểm tra nhật ký xác thực sau khi đăng ký; kiểm tra mật khẩu đã gửi không xuất hiện",
        "description": "Kiểm chứng: Kiểm tra nhật ký xác thực sau khi đăng ký; kiểm tra mật khẩu đã gửi không xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Đăng ký bằng email và mật khẩu hợp lệ, sau đó kiểm tra nhật ký xác thực tạo bởi luồng đăng ký.",
            "expected": "Nhật ký không chứa mật khẩu đã gửi; mật khẩu không được lưu dạng plaintext và không được ghi vào log (NFR-authentication-003).",
            "testData": "Email: newuser@example.com; Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "72",
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "checklist": "CHK-authentication-018",
        "ref": [
          "NFR-authentication-009"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Điều hướng biểu mẫu bằng Tab; kiểm tra nút gửi nhận tiêu điểm bàn phím",
        "description": "Kiểm chứng: Điều hướng biểu mẫu bằng Tab; kiểm tra nút gửi nhận tiêu điểm bàn phím.",
        "steps": [
          {
            "step": "1",
            "action": "Trên form đăng ký, nhấn Tab lần lượt qua các trường và nút chính đến nút gửi.",
            "expected": "Form đăng ký hỗ trợ điều hướng bằng bàn phím; nút gửi nhận tiêu điểm bàn phím (NFR-authentication-009).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "73",
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "checklist": "CHK-authentication-019",
        "ref": [
          "NFR-authentication-009"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Kiểm tra trường mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình",
        "description": "Kiểm chứng: Kiểm tra trường mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình.",
        "steps": [
          {
            "step": "1",
            "action": "Dùng trình đọc màn hình di chuyển đến trường mật khẩu trên form đăng ký.",
            "expected": "Trình đọc màn hình nhận được nhãn lập trình của trường mật khẩu; form đăng ký hỗ trợ nhãn cho trình đọc màn hình ở các trường và nút chính (NFR-authentication-009).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "74",
        "category": "Trường hợp biên",
        "subcategory": "Lưu giữ tài khoản chưa xác minh",
        "checklist": "CHK-authentication-020",
        "ref": [
          "FR-authentication-028",
          "BR-authentication-010"
        ],
        "priority": 2,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Chuyển tài khoản chưa xác minh vượt quá 24 giờ; kiểm tra tài khoản bị xóa",
        "description": "Kiểm chứng: Chuyển tài khoản chưa xác minh vượt quá 24 giờ; kiểm tra tài khoản bị xóa.",
        "steps": [
          {
            "step": "1",
            "action": "Chuẩn bị tài khoản ở trạng thái `unverified` đã quá 24 giờ, rồi chạy hoặc chờ tiến trình nền rà tài khoản chưa xác nhận.",
            "expected": "Hệ thống tự xóa tài khoản có trạng thái `unverified` quá 24 giờ (FR-authentication-028, BR-authentication-010).",
            "testData": "Tài khoản: `unverified`, tuổi tài khoản: >24 giờ"
          }
        ]
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-unlink-google",
    "file": "testcases-uc-unlink-google.md",
    "testcases": [
      {
        "stt": "75",
        "category": "Truy cập bảo mật tài khoản",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-091",
        "ref": [
          "—"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Kiểm tra màn hình bảo mật tài khoản có thể truy cập đối với người dùng đã xác thực",
        "description": "Kiểm chứng: Kiểm tra màn hình bảo mật tài khoản có thể truy cập đối với người dùng đã xác thực.",
        "steps": [
          {
            "step": "1",
            "action": "Đăng nhập bằng tài khoản đã xác thực, rồi mở màn hình bảo mật tài khoản.",
            "expected": "Người dùng đã xác thực mở được màn hình `account-security`, nơi SRS xác định có chức năng gỡ liên kết Google. [TBD: cần BA cấp wording]",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "76",
        "category": "Truy cập bảo mật tài khoản",
        "subcategory": "Truy cập",
        "checklist": "CHK-authentication-092",
        "ref": [
          "FR-authentication-023"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Mở tài khoản đã liên kết Google; kiểm tra nút hủy liên kết hiển thị",
        "description": "Kiểm chứng: Mở tài khoản đã liên kết Google; kiểm tra nút hủy liên kết hiển thị.",
        "steps": [
          {
            "step": "1",
            "action": "Đăng nhập tài khoản đã liên kết Google và mở màn hình bảo mật tài khoản.",
            "expected": "Màn hình bảo mật tài khoản cung cấp chức năng gỡ liên kết Google cho tài khoản đang có liên kết Google (FR-authentication-023).",
            "testData": "Email: learner@email.com / Google: đã liên kết"
          }
        ]
      },
      {
        "stt": "77",
        "category": "Hủy liên kết bằng mật khẩu",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-093",
        "ref": [
          "FR-authentication-023"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra liên kết nhà cung cấp bị xóa",
        "description": "Kiểm chứng: Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra liên kết nhà cung cấp bị xóa.",
        "steps": [
          {
            "step": "1",
            "action": "Trên màn hình bảo mật tài khoản đã có mật khẩu, thực hiện chức năng gỡ liên kết Google.",
            "expected": "Liên kết Google được gỡ khỏi tài khoản; khả năng đăng nhập bằng email và mật khẩu vẫn được giữ lại (FR-authentication-023).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024! / Google: đã liên kết"
          }
        ]
      },
      {
        "stt": "78",
        "category": "Hủy liên kết bằng mật khẩu",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-094",
        "ref": [
          "FR-authentication-023"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra xác nhận thành công xuất hiện",
        "description": "Kiểm chứng: Hủy liên kết Google khỏi tài khoản có mật khẩu; kiểm tra xác nhận thành công xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Trên màn hình bảo mật tài khoản đã có mật khẩu, thực hiện chức năng gỡ liên kết Google.",
            "expected": "Hệ thống hoàn tất việc gỡ liên kết Google và giữ khả năng đăng nhập bằng email/mật khẩu của tài khoản (FR-authentication-023).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024! / Google: đã liên kết"
          }
        ]
      },
      {
        "stt": "79",
        "category": "Hủy liên kết bằng mật khẩu",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-095",
        "ref": [
          "FR-authentication-023"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Đăng nhập bằng email sau khi hủy liên kết Google; kiểm tra quyền truy cập ứng dụng thành công",
        "description": "Kiểm chứng: Đăng nhập bằng email sau khi hủy liên kết Google; kiểm tra quyền truy cập ứng dụng thành công.",
        "steps": [
          {
            "step": "1",
            "action": "Sau khi đã gỡ liên kết Google, gửi form đăng nhập với email và mật khẩu của tài khoản.",
            "expected": "Người dùng vẫn đăng nhập được bằng email/mật khẩu sau khi liên kết Google đã được gỡ, qua đó duy trì quyền truy cập ứng dụng (FR-authentication-023).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "80",
        "category": "Hủy liên kết bằng mật khẩu",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-096",
        "ref": [
          "FR-authentication-023"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Quay lại bảo mật tài khoản sau khi hủy liên kết Google; kiểm tra nút hủy liên kết không còn",
        "description": "Kiểm chứng: Quay lại bảo mật tài khoản sau khi hủy liên kết Google; kiểm tra nút hủy liên kết không còn.",
        "steps": [
          {
            "step": "1",
            "action": "Sau khi đã gỡ liên kết Google, mở lại màn hình bảo mật tài khoản.",
            "expected": "Tài khoản không còn liên kết Google sau thao tác gỡ liên kết (FR-authentication-023).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "81",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Yêu cầu mật khẩu",
        "checklist": "CHK-authentication-097",
        "ref": [
          "FR-authentication-024",
          "E-authentication-010"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Chọn hủy liên kết trên tài khoản chỉ dùng Google; kiểm tra biểu mẫu bắt buộc đặt mật khẩu xuất hiện",
        "description": "Kiểm chứng: Chọn hủy liên kết trên tài khoản chỉ dùng Google; kiểm tra biểu mẫu bắt buộc đặt mật khẩu xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Trên màn hình bảo mật tài khoản chỉ dùng Google, thực hiện chức năng gỡ liên kết Google.",
            "expected": "Hệ thống áp dụng trạng thái \"Chuyển sang form buộc tạo mật khẩu trước khi cho gỡ liên kết\"; liên kết Google chưa bị gỡ (E-authentication-010).",
            "testData": "Tài khoản chỉ dùng Google: learner@email.com"
          }
        ]
      },
      {
        "stt": "82",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Yêu cầu mật khẩu",
        "checklist": "CHK-authentication-098",
        "ref": [
          "FR-authentication-003",
          "FR-authentication-024"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu hợp lệ gồm 8 ký tự vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra mật khẩu được chấp nhận",
        "description": "Kiểm chứng: Nhập mật khẩu hợp lệ gồm 8 ký tự vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra mật khẩu được chấp nhận.",
        "steps": [
          {
            "step": "1",
            "action": "Tại form buộc tạo mật khẩu, nhập mật khẩu hợp lệ vào trường mật khẩu.",
            "expected": "Mật khẩu được chấp nhận khi dài 8–20 ký tự, có ít nhất một chữ hoa, một chữ thường, một ký tự đặc biệt và không chứa local-part của email; sau đó mới có thể gỡ liên kết Google (FR-authentication-003, FR-authentication-024).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "83",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Yêu cầu mật khẩu",
        "checklist": "CHK-authentication-099",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu không hợp lệ vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện",
        "description": "Kiểm chứng: Nhập mật khẩu không hợp lệ vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Tại form buộc tạo mật khẩu, nhập mật khẩu không thỏa chính sách vào trường mật khẩu.",
            "expected": "Form hiện lỗi nội tuyến real-time \"Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn\" (E-authentication-002).",
            "testData": "Email: learner@email.com / Mật khẩu: 123"
          }
        ]
      },
      {
        "stt": "84",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Yêu cầu mật khẩu",
        "checklist": "CHK-authentication-100",
        "ref": [
          "FR-authentication-003",
          "E-authentication-002"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Nhập mật khẩu chứa phần cục bộ của email vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện",
        "description": "Kiểm chứng: Nhập mật khẩu chứa phần cục bộ của email vào biểu mẫu bắt buộc đặt mật khẩu; kiểm tra lỗi chính sách nội tuyến xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Tại form buộc tạo mật khẩu, nhập mật khẩu có chứa local-part của email vào trường mật khẩu.",
            "expected": "Form hiện lỗi nội tuyến real-time \"Mật khẩu cần 8-20 ký tự, có chữ hoa, chữ thường và ký tự đặc biệt, và không chứa phần đầu email của bạn\" (E-authentication-002).",
            "testData": "Email: learner@email.com / Mật khẩu: Learner2024!"
          }
        ]
      },
      {
        "stt": "85",
        "category": "Bảo mật cơ bản",
        "subcategory": "Duy trì quyền truy cập tài khoản",
        "checklist": "CHK-authentication-101",
        "ref": [
          "FR-authentication-024",
          "BR-authentication-004"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Hoàn tất tạo mật khẩu bắt buộc; kiểm tra thông tin xác thực bằng email tồn tại trước khi xóa nhà cung cấp",
        "description": "Kiểm chứng: Hoàn tất tạo mật khẩu bắt buộc; kiểm tra thông tin xác thực bằng email tồn tại trước khi xóa nhà cung cấp.",
        "steps": [
          {
            "step": "1",
            "action": "Tại form buộc tạo mật khẩu, nhập mật khẩu hợp lệ và hoàn tất tạo mật khẩu trước khi gỡ liên kết Google.",
            "expected": "Thông tin xác thực bằng email/mật khẩu được tạo trước khi liên kết Google được gỡ, để tài khoản vẫn có lối đăng nhập (FR-authentication-024, BR-authentication-004).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024!"
          }
        ]
      },
      {
        "stt": "86",
        "category": "Bảo mật cơ bản",
        "subcategory": "Duy trì quyền truy cập tài khoản",
        "checklist": "CHK-authentication-102",
        "ref": [
          "FR-authentication-024",
          "BR-authentication-004"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Thử xóa nhà cung cấp trước khi tạo mật khẩu; kiểm tra liên kết Google vẫn được lưu",
        "description": "Kiểm chứng: Thử xóa nhà cung cấp trước khi tạo mật khẩu; kiểm tra liên kết Google vẫn được lưu.",
        "steps": [
          {
            "step": "1",
            "action": "Trên tài khoản chỉ dùng Google, thực hiện chức năng gỡ liên kết nhưng không tạo mật khẩu ở form bắt buộc.",
            "expected": "Hệ thống buộc tạo mật khẩu trước khi được gỡ liên kết; vì chưa có mật khẩu, liên kết Google vẫn được giữ lại (FR-authentication-024, BR-authentication-004).",
            "testData": "Tài khoản chỉ dùng Google: learner@email.com"
          }
        ]
      },
      {
        "stt": "87",
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "checklist": "CHK-authentication-103",
        "ref": [
          "NFR-authentication-009"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Điều hướng bảo mật tài khoản bằng Tab; kiểm tra nút hủy liên kết nhận tiêu điểm bàn phím",
        "description": "Kiểm chứng: Điều hướng bảo mật tài khoản bằng Tab; kiểm tra nút hủy liên kết nhận tiêu điểm bàn phím.",
        "steps": [
          {
            "step": "1",
            "action": "Trên màn hình bảo mật tài khoản có liên kết Google, nhấn Tab để điều hướng đến chức năng gỡ liên kết Google.",
            "expected": "Chức năng gỡ liên kết Google nhận được tiêu điểm khi điều hướng bằng bàn phím, đáp ứng hỗ trợ điều hướng bàn phím cho nút chính của màn xác thực (NFR-authentication-009).",
            "testData": "—"
          }
        ]
      },
      {
        "stt": "88",
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím và nhãn",
        "checklist": "CHK-authentication-104",
        "ref": [
          "NFR-authentication-009"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Kiểm tra trường bắt buộc đặt mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình",
        "description": "Kiểm chứng: Kiểm tra trường bắt buộc đặt mật khẩu bằng trình đọc màn hình; kiểm tra trường cung cấp nhãn lập trình.",
        "steps": [
          {
            "step": "1",
            "action": "Mở form buộc tạo mật khẩu và dùng trình đọc màn hình di chuyển tới trường mật khẩu.",
            "expected": "Trình đọc màn hình nhận diện được nhãn lập trình gắn với trường mật khẩu, đáp ứng yêu cầu nhãn cho trình đọc màn hình ở các trường của form xác thực (NFR-authentication-009).",
            "testData": "—"
          }
        ]
      }
    ]
  },
  {
    "scope": "uc",
    "target": "uc-verify-email",
    "file": "testcases-uc-verify-email.md",
    "testcases": [
      {
        "stt": "89",
        "category": "Truy cập xác minh",
        "subcategory": "Liên kết xác nhận",
        "checklist": "CHK-authentication-021",
        "ref": [
          "FR-authentication-005"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Mở liên kết xác nhận hợp lệ; kiểm tra trang kết quả xác minh tải thành công",
        "description": "Kiểm chứng: Mở liên kết xác nhận hợp lệ; kiểm tra trang kết quả xác minh tải thành công.",
        "steps": [
          {
            "step": "1",
            "action": "Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ trong email xác nhận.",
            "expected": "Trang `verify-result-success` tải và hiển thị \"Xác nhận email thành công! Vui lòng đăng nhập.\", rồi chuyển về màn đăng nhập (FR-authentication-005).",
            "testData": "Liên kết xác nhận chưa dùng, được tạo dưới 24 giờ cho learner@email.com"
          }
        ]
      },
      {
        "stt": "90",
        "category": "Xác nhận email",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-022",
        "ref": [
          "FR-authentication-005"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Dùng liên kết xác nhận chưa dùng còn hiệu lực; kiểm tra trạng thái tài khoản chuyển thành đã xác minh",
        "description": "Kiểm chứng: Dùng liên kết xác nhận chưa dùng còn hiệu lực; kiểm tra trạng thái tài khoản chuyển thành đã xác minh.",
        "steps": [
          {
            "step": "1",
            "action": "Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ của tài khoản `unverified`.",
            "expected": "Hệ thống chuyển trạng thái tài khoản từ `unverified` sang `verified` sau khi xử lý liên kết (FR-authentication-005).",
            "testData": "Tài khoản `unverified`: learner@email.com; liên kết xác nhận chưa dùng, được tạo dưới 24 giờ"
          }
        ]
      },
      {
        "stt": "91",
        "category": "Xác nhận email",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-023",
        "ref": [
          "FR-authentication-005"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Dùng liên kết xác nhận hợp lệ; kiểm tra mã thông báo được đánh dấu là đã dùng",
        "description": "Kiểm chứng: Dùng liên kết xác nhận hợp lệ; kiểm tra mã thông báo được đánh dấu là đã dùng.",
        "steps": [
          {
            "step": "1",
            "action": "Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ và kiểm tra lại trạng thái mã thông báo sau khi xác nhận.",
            "expected": "Hệ thống đánh dấu link xác nhận là đã dùng; mã thông báo có trạng thái `used` và không còn có thể xác nhận lại (FR-authentication-005).",
            "testData": "Liên kết xác nhận chưa dùng, được tạo dưới 24 giờ cho learner@email.com"
          }
        ]
      },
      {
        "stt": "92",
        "category": "Xác nhận email",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-024",
        "ref": [
          "FR-authentication-005"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Dùng liên kết xác nhận hợp lệ; kiểm tra thông báo thành công được hiển thị",
        "description": "Kiểm chứng: Dùng liên kết xác nhận hợp lệ; kiểm tra thông báo thành công được hiển thị.",
        "steps": [
          {
            "step": "1",
            "action": "Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ trong email xác nhận.",
            "expected": "Trang kết quả hiển thị \"Xác nhận email thành công! Vui lòng đăng nhập.\" (FR-authentication-005).",
            "testData": "Liên kết xác nhận chưa dùng, được tạo dưới 24 giờ cho learner@email.com"
          }
        ]
      },
      {
        "stt": "93",
        "category": "Xác nhận email",
        "subcategory": "Luồng thành công",
        "checklist": "CHK-authentication-025",
        "ref": [
          "FR-authentication-005"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Dùng liên kết xác nhận hợp lệ; kiểm tra đích đến đăng nhập được cung cấp",
        "description": "Kiểm chứng: Dùng liên kết xác nhận hợp lệ; kiểm tra đích đến đăng nhập được cung cấp.",
        "steps": [
          {
            "step": "1",
            "action": "Mở liên kết xác nhận chưa dùng, còn hiệu lực 24 giờ và theo luồng chuyển tiếp từ trang kết quả thành công.",
            "expected": "Sau khi hiển thị \"Xác nhận email thành công! Vui lòng đăng nhập.\", trang kết quả chuyển người dùng về màn đăng nhập (FR-authentication-005).",
            "testData": "Email: learner@email.com / Mật khẩu: Hoc2024! / Liên kết xác nhận chưa dùng, được tạo dưới 24 giờ"
          }
        ]
      },
      {
        "stt": "94",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "checklist": "CHK-authentication-026",
        "ref": [
          "FR-authentication-006",
          "E-authentication-006"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Mở liên kết xác nhận sau 24 giờ; kiểm tra kết quả liên kết hết hạn xuất hiện",
        "description": "Kiểm chứng: Mở liên kết xác nhận sau 24 giờ; kiểm tra kết quả liên kết hết hạn xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Mở liên kết xác nhận đã được tạo quá 24 giờ.",
            "expected": "Trang kết quả hiện \"Link đã hết hạn hoặc đã được sử dụng. [Gửi lại link xác nhận]\" (E-authentication-006).",
            "testData": "Liên kết xác nhận đã hết hạn (được tạo quá 24 giờ) cho learner@email.com"
          }
        ]
      },
      {
        "stt": "95",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Liên kết không hợp lệ",
        "checklist": "CHK-authentication-027",
        "ref": [
          "FR-authentication-006",
          "E-authentication-006"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Mở lại liên kết xác nhận đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện",
        "description": "Kiểm chứng: Mở lại liên kết xác nhận đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Mở lại liên kết xác nhận đã được dùng để xác nhận tài khoản.",
            "expected": "Trang kết quả hiện \"Link đã hết hạn hoặc đã được sử dụng. [Gửi lại link xác nhận]\" (E-authentication-006).",
            "testData": "Liên kết xác nhận có trạng thái `used` cho learner@email.com"
          }
        ]
      },
      {
        "stt": "96",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "checklist": "CHK-authentication-028",
        "ref": [
          "FR-authentication-007"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Mở trạng thái đã gửi xác nhận; kiểm tra nút gửi lại hiển thị",
        "description": "Kiểm chứng: Mở trạng thái đã gửi xác nhận; kiểm tra nút gửi lại hiển thị.",
        "steps": [
          {
            "step": "1",
            "action": "Hoàn tất gửi email xác nhận và mở trang trạng thái `verify-sent`.",
            "expected": "Trang `verify-sent` hiển thị \"Đã gửi email xác nhận tới {email}…\" và có nút gửi lại để yêu cầu link xác nhận mới (FR-authentication-007).",
            "testData": "Email: learner@email.com"
          }
        ]
      },
      {
        "stt": "97",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "checklist": "CHK-authentication-029",
        "ref": [
          "FR-authentication-007"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Yêu cầu gửi lại được phép; kiểm tra email xác nhận mới được gửi đi",
        "description": "Kiểm chứng: Yêu cầu gửi lại được phép; kiểm tra email xác nhận mới được gửi đi.",
        "steps": [
          {
            "step": "1",
            "action": "Tại trang trạng thái đã gửi xác nhận, bấm nút gửi lại khi đã qua cooldown và chưa đạt giới hạn ngày.",
            "expected": "Hệ thống gửi lại email xác nhận chứa một link mới tới địa chỉ email đã đăng ký (FR-authentication-007).",
            "testData": "Email: learner@email.com; lần gửi lại thứ 2 trong ngày, cách lần trước trên 60 giây"
          }
        ]
      },
      {
        "stt": "98",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "checklist": "CHK-authentication-030",
        "ref": [
          "FR-authentication-007"
        ],
        "priority": 1,
        "auto": "No",
        "preconditions": "—",
        "retired": false,
        "title": "Yêu cầu gửi lại được phép; kiểm tra liên kết mới có thời hạn hiệu lực 24 giờ",
        "description": "Kiểm chứng: Yêu cầu gửi lại được phép; kiểm tra liên kết mới có thời hạn hiệu lực 24 giờ.",
        "steps": [
          {
            "step": "1",
            "action": "Tại trang trạng thái đã gửi xác nhận, bấm nút gửi lại khi đã qua cooldown và kiểm tra link trong email mới.",
            "expected": "Hệ thống gửi một link xác nhận mới; link này có hạn 24 giờ kể từ thời điểm tạo (FR-authentication-007).",
            "testData": "Email: learner@email.com; lần gửi lại thứ 2 trong ngày, cách lần trước trên 60 giây"
          }
        ]
      },
      {
        "stt": "99",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "checklist": "CHK-authentication-031",
        "ref": [
          "FR-authentication-007",
          "E-authentication-007"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Yêu cầu gửi lại hai lần trong vòng 60 giây; kiểm tra lỗi thời gian chờ xuất hiện",
        "description": "Kiểm chứng: Yêu cầu gửi lại hai lần trong vòng 60 giây; kiểm tra lỗi thời gian chờ xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Tại trang trạng thái đã gửi xác nhận, bấm nút gửi lại hai lần; lần thứ hai thực hiện trong vòng 60 giây sau lần đầu.",
            "expected": "Nút gửi lại tạm vô hiệu và hệ thống hiển thị thông báo còn thời gian chờ (E-authentication-007).",
            "testData": "Email: learner@email.com; lần gửi lại thứ hai trong vòng 60 giây"
          }
        ]
      },
      {
        "stt": "100",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "checklist": "CHK-authentication-032",
        "ref": [
          "FR-authentication-007",
          "E-authentication-007"
        ],
        "priority": 2,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Yêu cầu gửi lại sau năm lần gửi trong một ngày; kiểm tra lỗi giới hạn hằng ngày xuất hiện",
        "description": "Kiểm chứng: Yêu cầu gửi lại sau năm lần gửi trong một ngày; kiểm tra lỗi giới hạn hằng ngày xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Sau khi đã gửi lại email xác nhận 5 lần trong ngày, bấm nút gửi lại thêm một lần.",
            "expected": "Nút gửi lại tạm vô hiệu và hệ thống hiển thị thông báo đã đạt giới hạn ngày (E-authentication-007).",
            "testData": "Email: learner@email.com; đã có 5 lần gửi lại email xác nhận trong ngày"
          }
        ]
      },
      {
        "stt": "101",
        "category": "Xử lý xác thực và lỗi",
        "subcategory": "Giới hạn gửi lại",
        "checklist": "CHK-authentication-033",
        "ref": [
          "FR-authentication-007",
          "E-authentication-007"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Kích hoạt thời gian chờ gửi lại; kiểm tra gợi ý thời gian chờ còn lại được hiển thị",
        "description": "Kiểm chứng: Kích hoạt thời gian chờ gửi lại; kiểm tra gợi ý thời gian chờ còn lại được hiển thị.",
        "steps": [
          {
            "step": "1",
            "action": "Bấm nút gửi lại, sau đó quan sát trạng thái nút trong thời gian cooldown 60 giây.",
            "expected": "Nút gửi lại tạm vô hiệu và hệ thống hiển thị thông báo còn thời gian chờ (E-authentication-007).",
            "testData": "Email: learner@email.com; vừa gửi lại email xác nhận"
          }
        ]
      },
      {
        "stt": "102",
        "category": "Bảo mật cơ bản",
        "subcategory": "Dùng một lần",
        "checklist": "CHK-authentication-034",
        "ref": [
          "FR-authentication-006",
          "E-authentication-006"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Dùng một mã thông báo xác nhận từ thiết bị thứ hai sau khi đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện",
        "description": "Kiểm chứng: Dùng một mã thông báo xác nhận từ thiết bị thứ hai sau khi đã dùng; kiểm tra kết quả liên kết đã dùng xuất hiện.",
        "steps": [
          {
            "step": "1",
            "action": "Dùng liên kết xác nhận trên thiết bị A, rồi mở đúng liên kết đó trên thiết bị B.",
            "expected": "Trên thiết bị B, trang kết quả hiện \"Link đã hết hạn hoặc đã được sử dụng. [Gửi lại link xác nhận]\" (E-authentication-006).",
            "testData": "Một liên kết xác nhận chưa dùng cho learner@email.com; trình duyệt/thiết bị A và B"
          }
        ]
      },
      {
        "stt": "103",
        "category": "Khả năng truy cập cơ bản",
        "subcategory": "Bàn phím",
        "checklist": "CHK-authentication-035",
        "ref": [
          "NFR-authentication-009"
        ],
        "priority": 3,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Điều hướng kết quả xác minh bằng Tab; kiểm tra nút gửi lại nhận tiêu điểm bàn phím",
        "description": "Kiểm chứng: Điều hướng kết quả xác minh bằng Tab; kiểm tra nút gửi lại nhận tiêu điểm bàn phím.",
        "steps": [
          {
            "step": "1",
            "action": "Tại trang kết quả liên kết hết hạn có \"[Gửi lại link xác nhận]\", nhấn Tab để điều hướng đến nút này.",
            "expected": "SRS chỉ yêu cầu hỗ trợ điều hướng bàn phím cho form đăng nhập/đăng ký, không quy định khả năng nhận tiêu điểm Tab của nút gửi lại trên trang kết quả xác minh. [TBD: cần BA cấp wording]",
            "testData": "Liên kết xác nhận đã hết hạn"
          }
        ]
      },
      {
        "stt": "104",
        "category": "Trường hợp biên",
        "subcategory": "Cổng truy cập",
        "checklist": "CHK-authentication-036",
        "ref": [
          "BR-authentication-001"
        ],
        "priority": 1,
        "auto": "Yes",
        "preconditions": "—",
        "retired": false,
        "title": "Thử mở nội dung học tập được bảo vệ trước khi xác minh; kiểm tra quyền truy cập bị từ chối",
        "description": "Kiểm chứng: Thử mở nội dung học tập được bảo vệ trước khi xác minh; kiểm tra quyền truy cập bị từ chối.",
        "steps": [
          {
            "step": "1",
            "action": "Dùng tài khoản `unverified` để truy cập một nội dung học tập được bảo vệ.",
            "expected": "Hệ thống từ chối quyền truy cập nội dung học tập cho đến khi email của tài khoản được xác nhận (BR-authentication-001).",
            "testData": "Tài khoản `unverified`: learner@email.com; một URL nội dung học tập được bảo vệ"
          }
        ]
      }
    ]
  }
];
