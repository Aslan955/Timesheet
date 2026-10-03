#1. Mở màn tạo dự án
##1.1. Theo vai trò
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-228 → FR-quan-ly-du-an-kinh-doanh-011 · Verify mỗi vai trò AM, SM bấm "Cấp mã dự án" mở màn tạo có nút gửi "Gửi GĐK duyệt"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-229 → FR-quan-ly-du-an-kinh-doanh-011 · Verify GĐK bấm "Cấp mã dự án" mở màn tạo có nút gửi "Tạo & cấp mã"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-230 → FR-quan-ly-du-an-kinh-doanh-011, BR-quan-ly-du-an-kinh-doanh-002 · Verify tài khoản Kế toán mở trực tiếp đường dẫn màn tạo dự án không vào được màn tạo
##1.2. Bố cục màn tạo
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-231 → FR-quan-ly-du-an-kinh-doanh-011 · Verify đầu trang màn tạo có đủ "← Quay lại", "Huỷ", nút gửi
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-232 → FR-quan-ly-du-an-kinh-doanh-011 · Verify meta màn tạo hiện "Version: Mới · Trạng thái: Đang soạn · Người tạo"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-233 → FR-quan-ly-du-an-kinh-doanh-011 · Verify với AM / SM dải hướng dẫn bắt đầu "Hướng dẫn quy trình: AM / SM gửi yêu cầu → Giám đốc khối duyệt" đúng câu ở Mục 10 spec
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-234 → FR-quan-ly-du-an-kinh-doanh-011 · Verify với GĐK dải hướng dẫn bắt đầu "Hướng dẫn quy trình: Giám đốc khối tạo → hệ thống cấp mã ngay (bỏ bước duyệt mã)" đúng câu ở Mục 10 spec
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-235 → FR-quan-ly-du-an-kinh-doanh-011 · Verify khung Mã dự án hiện "Tự sinh sau khi GĐK duyệt" ở mã, "Tạo sau khi được cấp mã (tối đa 2 mã)" ở mã outsource
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-236 → FR-quan-ly-du-an-kinh-doanh-011 · Verify khung Hợp đồng & tài liệu hiện nhãn "Chưa ký" kèm ghi chú "Cập nhật ký hợp đồng trên màn chi tiết sau khi dự án được cấp mã."
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-237 → FR-quan-ly-du-an-kinh-doanh-011 · Verify với AM / SM khung PAKD chỉ có ghi chú bắt đầu "Phần nhập PAKD mở sau khi Giám đốc khối duyệt"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-238 → FR-quan-ly-du-an-kinh-doanh-011 · Verify với GĐK khung PAKD chỉ có ghi chú bắt đầu "Phần nhập PAKD mở ngay sau khi tạo"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-239 → FR-quan-ly-du-an-kinh-doanh-011 · Verify cuối màn tạo lặp lại nút "Huỷ" và nút gửi
[4] [Yes] CHK-quan-ly-du-an-kinh-doanh-240 → NFR-quan-ly-du-an-kinh-doanh-004 · Verify nút "← Quay lại" nằm bên trái, các nút tác vụ nằm bên phải đầu trang màn tạo
#2. Nhập thông tin dự án
##2.1. Chọn người và khách hàng từ IMIS
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-241 → FR-quan-ly-du-an-kinh-doanh-017, BR-quan-ly-du-an-kinh-doanh-033 · Verify mỗi ô PM kinh doanh, PM sản xuất, PM outsource, Giám đốc kinh doanh, Giám đốc khối, AM chỉ liệt kê người có vai trò tương ứng trong danh mục nhân sự IMIS
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-242 → BR-quan-ly-du-an-kinh-doanh-033 · Verify danh sách người trong ô chọn sắp theo thứ tự tiếng Việt
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-243 → BR-quan-ly-du-an-kinh-doanh-033 · Verify người đã ngừng hoạt động trong IMIS không có trong danh sách chọn
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-244 → FR-quan-ly-du-an-kinh-doanh-017 · Verify chọn 2 AM thì mỗi AM thành 1 thẻ có nút ×
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-245 → FR-quan-ly-du-an-kinh-doanh-017 · Verify bấm × trên thẻ AM bỏ AM đó khỏi danh sách đã chọn
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-246 → FR-quan-ly-du-an-kinh-doanh-017, BR-quan-ly-du-an-kinh-doanh-034 · Verify ô Tên khách hàng liệt kê khách hàng từ danh mục khách hàng IMIS
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-247 → FR-quan-ly-du-an-kinh-doanh-017 · Verify chọn khách hàng thì ô Mã khách hàng tự điền mã của khách hàng đó
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-248 → FR-quan-ly-du-an-kinh-doanh-017 · Verify chưa chọn khách hàng thì ô Mã khách hàng hiện "Theo khách hàng"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-249 → FR-quan-ly-du-an-kinh-doanh-017 · Verify ô Người tạo tự động là người dùng đang tạo
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-250 → BR-quan-ly-du-an-kinh-doanh-053 · Verify ô Khối ở màn tạo của mỗi vai trò GĐK, SM, AM chỉ có khối của tài khoản
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-251 → FR-quan-ly-du-an-kinh-doanh-030 · Verify chọn PM trực tiếp ở màn tạo, không có nút "Update PM"
##2.2. Danh mục IMIS không tải được
[1] [No] CHK-quan-ly-du-an-kinh-doanh-252 → E-quan-ly-du-an-kinh-doanh-038, FR-quan-ly-du-an-kinh-doanh-017 · Verify giả lập IMIS lỗi khi mở màn tạo thì ô chọn người bị khoá kèm câu "Không tải được danh mục từ hệ thống nhân sự / khách hàng"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-253 → E-quan-ly-du-an-kinh-doanh-038 · Verify giả lập danh mục khách hàng lỗi thì ô Tên khách hàng bị khoá kèm nút "Thử lại"
[2] [No] CHK-quan-ly-du-an-kinh-doanh-254 → E-quan-ly-du-an-kinh-doanh-038, FR-quan-ly-du-an-kinh-doanh-017 · Verify khi ô chọn người bị khoá, các ô khác vẫn nhập được, dữ liệu đang nhập không mất
[2] [No] CHK-quan-ly-du-an-kinh-doanh-255 → E-quan-ly-du-an-kinh-doanh-038 · Verify IMIS hoạt động lại, bấm "Thử lại" tải được danh mục, ô chọn mở khoá
[2] [No] CHK-quan-ly-du-an-kinh-doanh-256 → E-quan-ly-du-an-kinh-doanh-038 · Verify ô Khách hàng bị khoá chưa chọn được thì bấm gửi hiện lỗi "Chọn khách hàng"
##2.3. Đính kèm tài liệu khi tạo
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-257 → FR-quan-ly-du-an-kinh-doanh-018 · Verify khung "Tài liệu đính kèm (n)" có nút "Đính kèm tài liệu" chọn được nhiều tệp, danh sách tệp hiện tên, dung lượng, nút xoá
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-258 → NFR-quan-ly-du-an-kinh-doanh-005 · Verify dung lượng tệp hiển thị theo đơn vị KB / MB
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-259 → FR-quan-ly-du-an-kinh-doanh-018 · Verify bấm nút xoá tệp trên màn tạo bỏ tệp khỏi danh sách trước khi gửi
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-260 → BR-quan-ly-du-an-kinh-doanh-051 · Verify chọn tệp đúng 20 MB định dạng pdf được nhận vào danh sách
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-261 → E-quan-ly-du-an-kinh-doanh-041, BR-quan-ly-du-an-kinh-doanh-051, FR-quan-ly-du-an-kinh-doanh-018 · Verify chọn tệp lớn hơn 20 MB bị loại kèm câu "Tệp "{tên}" vượt 20 MB"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-262 → E-quan-ly-du-an-kinh-doanh-041, BR-quan-ly-du-an-kinh-doanh-051 · Verify chọn tệp .zip bị loại kèm câu "Tệp "{tên}" không đúng định dạng (chỉ nhận pdf, doc, docx, xls, xlsx, jpg, png)"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-263 → E-quan-ly-du-an-kinh-doanh-041, BR-quan-ly-du-an-kinh-doanh-051 · Verify chọn cùng lượt 1 tệp .zip và 1 tệp .docx thì tệp .docx vẫn được nhận vào danh sách
#3. Kiểm tra dữ liệu khi gửi
##3.1. Thông tin bắt buộc
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-264 → E-quan-ly-du-an-kinh-doanh-001, BR-quan-ly-du-an-kinh-doanh-026 · Verify bỏ trống Tên dự án, bấm gửi hiện lỗi "Nhập tên dự án" dưới ô
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-265 → BR-quan-ly-du-an-kinh-doanh-026, BR-quan-ly-du-an-kinh-doanh-050 · Verify Tên dự án chỉ gồm khoảng trắng, bấm gửi hiện lỗi "Nhập tên dự án"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-266 → E-quan-ly-du-an-kinh-doanh-002, BR-quan-ly-du-an-kinh-doanh-026 · Verify chưa chọn Khối, bấm gửi hiện lỗi "Chọn khối"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-267 → E-quan-ly-du-an-kinh-doanh-003, BR-quan-ly-du-an-kinh-doanh-026 · Verify chưa chọn Loại dự án, bấm gửi hiện lỗi "Chọn loại dự án"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-268 → E-quan-ly-du-an-kinh-doanh-004, BR-quan-ly-du-an-kinh-doanh-026 · Verify chưa chọn khách hàng, bấm gửi hiện lỗi "Chọn khách hàng"
##3.2. Ngày dự án
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-269 → E-quan-ly-du-an-kinh-doanh-005, BR-quan-ly-du-an-kinh-doanh-026 · Verify ngày kết thúc trước ngày bắt đầu, bấm gửi hiện lỗi "Ngày kết thúc phải sau ngày bắt đầu" ở ô ngày
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-270 → BR-quan-ly-du-an-kinh-doanh-026 · Verify ngày kết thúc bằng ngày bắt đầu được chấp nhận, gửi thành công
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-271 → BR-quan-ly-du-an-kinh-doanh-026 · Verify chỉ nhập ngày bắt đầu, bỏ trống ngày kết thúc thì không có lỗi ngày
##3.3. Dải lỗi tổng hợp và thời điểm hiện lỗi
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-272 → E-quan-ly-du-an-kinh-doanh-006, FR-quan-ly-du-an-kinh-doanh-012 · Verify bỏ trống Tên dự án, Khối, bấm gửi hiện dải đỏ "Còn 2 thông tin cần bổ sung: Nhập tên dự án · Chọn khối"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-273 → FR-quan-ly-du-an-kinh-doanh-012, E-quan-ly-du-an-kinh-doanh-001 · Verify ô lỗi viền đỏ kèm dòng chữ đỏ dưới ô
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-274 → FR-quan-ly-du-an-kinh-doanh-012, E-quan-ly-du-an-kinh-doanh-006 · Verify bấm gửi khi còn lỗi thì dự án không được tạo, màn vẫn ở màn tạo
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-275 → FR-quan-ly-du-an-kinh-doanh-012 · Verify mở màn tạo, chưa bấm gửi thì không hiện lỗi nào dù ô bắt buộc đang trống
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-276 → FR-quan-ly-du-an-kinh-doanh-012 · Verify sau lần bấm gửi đầu, nhập Tên dự án thì lỗi "Nhập tên dự án" biến mất ngay, dải đỏ giảm số lỗi
##3.4. Giới hạn độ dài
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-277 → BR-quan-ly-du-an-kinh-doanh-050 · Verify Tên dự án dài đúng 255 ký tự được chấp nhận
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-278 → E-quan-ly-du-an-kinh-doanh-040, FR-quan-ly-du-an-kinh-doanh-012 · Verify Tên dự án dài 256 ký tự, bấm gửi hiện chữ đỏ "Tối đa 255 ký tự" dưới ô
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-279 → E-quan-ly-du-an-kinh-doanh-040 · Verify lỗi vượt độ dài nằm trong dải lỗi tổng hợp "Còn {n} thông tin cần bổ sung: …"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-280 → BR-quan-ly-du-an-kinh-doanh-050 · Verify Ghi chú dài 1.001 ký tự, bấm gửi hiện chữ đỏ "Tối đa {n} ký tự" với n là 1.000
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-281 → BR-quan-ly-du-an-kinh-doanh-050 · Verify Tên dự án nhập "  Dự án A  " được lưu thành "Dự án A"
#4. Gửi yêu cầu mở mã (AM / SM)
##4.1. Kết quả gửi
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-282 → FR-quan-ly-du-an-kinh-doanh-013, BR-quan-ly-du-an-kinh-doanh-003 · Verify AM gửi hợp lệ tạo dự án ở trạng thái "Chờ duyệt mã"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-283 → BR-quan-ly-du-an-kinh-doanh-003, FR-quan-ly-du-an-kinh-doanh-013 · Verify dự án vừa gửi chưa có mã: khung Mã dự án hiện "Chờ GĐK duyệt"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-284 → BR-quan-ly-du-an-kinh-doanh-003, FR-quan-ly-du-an-kinh-doanh-013 · Verify dự án vừa gửi có cột Hạn lập PAKD "—" trên danh sách
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-285 → FR-quan-ly-du-an-kinh-doanh-013, BR-quan-ly-du-an-kinh-doanh-014 · Verify dự án vừa gửi có meta Version v1
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-286 → FR-quan-ly-du-an-kinh-doanh-013, BR-quan-ly-du-an-kinh-doanh-052, BR-quan-ly-du-an-kinh-doanh-036 · Verify tab Lịch sử có dòng "Tạo dự án" ghi chú "Version 1", người thực hiện "{người dùng} ({vai trò})"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-287 → FR-quan-ly-du-an-kinh-doanh-013 · Verify sau khi gửi, màn chuyển sang chi tiết của dự án mới
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-288 → FR-quan-ly-du-an-kinh-doanh-013 · Verify sau khi gửi hiện thông báo "Đã gửi yêu cầu mở mã dự án — chờ GĐK duyệt"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-289 → FR-quan-ly-du-an-kinh-doanh-018, FR-quan-ly-du-an-kinh-doanh-013 · Verify gửi kèm 2 tệp thì 2 tệp hiện trong cột Tài liệu đính kèm của dự án mới
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-290 → FR-quan-ly-du-an-kinh-doanh-018, BR-quan-ly-du-an-kinh-doanh-037, BR-quan-ly-du-an-kinh-doanh-052 · Verify gửi kèm tệp thì tab Lịch sử có dòng "Cập nhật tài liệu đính kèm" ghi chú "Đính kèm {tên tệp, …}"
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-291 → FR-quan-ly-du-an-kinh-doanh-011 · Verify bật nút KEY khi tạo thì dự án mới hiện nhãn KEY cạnh tên
#5. GĐK tạo & cấp mã
##5.1. Cấp mã ngay
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-292 → FR-quan-ly-du-an-kinh-doanh-014, BR-quan-ly-du-an-kinh-doanh-004 · Verify GĐK gửi hợp lệ tạo dự án ở trạng thái "Chưa có PAKD"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-293 → FR-quan-ly-du-an-kinh-doanh-015, BR-quan-ly-du-an-kinh-doanh-006 · Verify khách hàng mã "022" đã có mã tổng lớn nhất "022.687" thì dự án GĐK tạo nhận mã tổng "022.688"
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-294 → BR-quan-ly-du-an-kinh-doanh-006 · Verify khách hàng có mã tổng lớn nhất ".007" thì dự án mới nhận số thứ tự ".008" đủ 3 chữ số
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-295 → FR-quan-ly-du-an-kinh-doanh-015, BR-quan-ly-du-an-kinh-doanh-007 · Verify dự án mã tổng "022.688" có Mã kinh doanh "022.688.1", Mã sản xuất "022.688.2"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-296 → FR-quan-ly-du-an-kinh-doanh-014, BR-quan-ly-du-an-kinh-doanh-004, BR-quan-ly-du-an-kinh-doanh-005 · Verify dự án GĐK tạo có Hạn lập PAKD "Còn 30 ngày" trên danh sách ngay sau khi tạo
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-297 → FR-quan-ly-du-an-kinh-doanh-014 · Verify sau khi GĐK tạo hiện thông báo "Đã cấp mã {mã} — GĐK lập PAKD trước {dd/mm/yyyy}" với ngày = hôm nay + 30
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-298 → FR-quan-ly-du-an-kinh-doanh-014 · Verify tab Lịch sử của dự án GĐK tạo chỉ có dòng "Tạo dự án", không có dòng riêng cho việc cấp mã
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-299 → FR-quan-ly-du-an-kinh-doanh-014 · Verify sau khi GĐK tạo, màn chuyển sang chi tiết dự án mới
##5.2. Hết số thứ tự
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-300 → BR-quan-ly-du-an-kinh-doanh-006 · Verify khách hàng có mã tổng lớn nhất ".998" thì dự án mới nhận ".999"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-301 → E-quan-ly-du-an-kinh-doanh-027, FR-quan-ly-du-an-kinh-doanh-014, BR-quan-ly-du-an-kinh-doanh-006 · Verify khách hàng có mã tổng lớn nhất ".999", GĐK gửi tạo hiện "Khách hàng {Mã KH} đã dùng hết số thứ tự 999 — không cấp được mã mới"
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-302 → E-quan-ly-du-an-kinh-doanh-027 · Verify sau lỗi hết số thứ tự, dự án không được tạo, người dùng ở lại màn tạo
##5.3. Mã không trùng
[1] [No] CHK-quan-ly-du-an-kinh-doanh-303 → FR-quan-ly-du-an-kinh-doanh-015, BR-quan-ly-du-an-kinh-doanh-006 · Verify 2 phiên GĐK cùng lúc tạo dự án cho cùng khách hàng nhận 2 mã tổng khác nhau
#6. Thoát màn tạo và thao tác lặp
##6.1. Quay lại, Huỷ, Back
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-304 → FR-quan-ly-du-an-kinh-doanh-011 · Verify bấm "← Quay lại" về ngay danh sách, không hiện hộp xác nhận
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-305 → FR-quan-ly-du-an-kinh-doanh-011 · Verify bấm "← Quay lại" sau khi đã nhập dữ liệu thì không có dự án mới trên danh sách
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-306 → FR-quan-ly-du-an-kinh-doanh-011 · Verify bấm "Huỷ" về ngay danh sách, không hiện hộp xác nhận
[2] [Yes] CHK-quan-ly-du-an-kinh-doanh-307 → FR-quan-ly-du-an-kinh-doanh-011 · Verify bấm "Huỷ" sau khi đã nhập dữ liệu thì không có dự án mới trên danh sách
[3] [Yes] CHK-quan-ly-du-an-kinh-doanh-308 → FR-quan-ly-du-an-kinh-doanh-011 · Verify bấm nút Back của trình duyệt khi đang nhập ở màn tạo không tạo dự án mới
##6.2. Bấm gửi nhiều lần
[1] [Yes] CHK-quan-ly-du-an-kinh-doanh-309 → NFR-quan-ly-du-an-kinh-doanh-014 · Verify bấm nhanh 2 lần nút "Gửi GĐK duyệt" chỉ tạo đúng 1 dự án
#7. Lỗi khi ghi
##7.1. Quyền thay đổi tại lúc gửi
[1] [No] CHK-quan-ly-du-an-kinh-doanh-310 → FR-quan-ly-du-an-kinh-doanh-013, E-quan-ly-du-an-kinh-doanh-030 · Verify tài khoản bị đổi khỏi vai trò AM trong lúc đang ở màn tạo, bấm gửi thì dự án không được tạo
[1] [No] CHK-quan-ly-du-an-kinh-doanh-311 → FR-quan-ly-du-an-kinh-doanh-014 · Verify tài khoản không còn là GĐK tại lúc bấm "Tạo & cấp mã" thì dự án không được tạo
##7.2. Ghi không trọn vẹn
[1] [No] CHK-quan-ly-du-an-kinh-doanh-312 → FR-quan-ly-du-an-kinh-doanh-013, NFR-quan-ly-du-an-kinh-doanh-014, FR-quan-ly-du-an-kinh-doanh-018 · Verify giả lập lỗi ghi giữa chừng khi AM gửi thì không có dự án, tệp, dòng lịch sử nào được ghi
[2] [No] CHK-quan-ly-du-an-kinh-doanh-313 → E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi không trọn vẹn, màn tạo giữ nguyên dữ liệu đang nhập
[1] [No] CHK-quan-ly-du-an-kinh-doanh-314 → FR-quan-ly-du-an-kinh-doanh-014 · Verify giả lập lỗi ghi khi GĐK tạo, lần tạo kế tiếp thành công nhận đúng số thứ tự đã định cho lần lỗi
[2] [No] CHK-quan-ly-du-an-kinh-doanh-315 → E-quan-ly-du-an-kinh-doanh-037 · Verify sau lỗi ghi không trọn vẹn, bấm gửi lại thành công tạo đúng 1 dự án
