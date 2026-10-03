---
type: test-checklist-index
feature: phuong-an-kinh-doanh
status: draft
updated: 2026-10-03
next_chk_id: 665
links:
  - docs/phuong-an-kinh-doanh/srs/phuong-an-kinh-doanh-spec.md
  - docs/phuong-an-kinh-doanh/usecases/phuong-an-kinh-doanh-usecase-index.md
---

# Test Checklists — phuong-an-kinh-doanh

## Checklists

| Scope | Target | File | Items | P1 | P2 | P3 | P4 | Auto | Status | Updated |
|-------|--------|------|-------|----|----|----|----|------|--------|---------|
| uc | uc-xem-pakd | [checklist-uc-xem-pakd.md](checklist-uc-xem-pakd.md) | 146 | 44 | 51 | 45 | 6 | 129/17 | draft | 2026-10-03 |
| uc | uc-lap-gui-pakd | [checklist-uc-lap-gui-pakd.md](checklist-uc-lap-gui-pakd.md) | 207 | 62 | 102 | 41 | 2 | 183/24 | draft | 2026-10-03 |
| uc | uc-duyet-pakd | [checklist-uc-duyet-pakd.md](checklist-uc-duyet-pakd.md) | 93 | 46 | 35 | 10 | 2 | 64/29 | draft | 2026-10-03 |
| uc | uc-dieu-chinh-pakd | [checklist-uc-dieu-chinh-pakd.md](checklist-uc-dieu-chinh-pakd.md) | 77 | 35 | 38 | 4 | 0 | 62/15 | draft | 2026-10-03 |
| uc | uc-duyet-dieu-chinh-pakd | [checklist-uc-duyet-dieu-chinh-pakd.md](checklist-uc-duyet-dieu-chinh-pakd.md) | 42 | 27 | 13 | 2 | 0 | 37/5 | draft | 2026-10-03 |
| uc | uc-dong-bo-hop-dong-vao-pakd | [checklist-uc-dong-bo-hop-dong-vao-pakd.md](checklist-uc-dong-bo-hop-dong-vao-pakd.md) | 51 | 28 | 19 | 4 | 0 | 45/6 | draft | 2026-10-03 |
| uc | uc-nhac-cap-nhat-hop-dong | [checklist-uc-nhac-cap-nhat-hop-dong.md](checklist-uc-nhac-cap-nhat-hop-dong.md) | 10 | 4 | 5 | 1 | 0 | 2/8 | draft | 2026-10-03 |
| uc | chung (cross-cutting) | [checklist-uc-chung.md](checklist-uc-chung.md) | 38 | 6 | 11 | 21 | 0 | 20/18 | draft | 2026-10-03 |

Tập UAT: 130 mục — xem mục Tập UAT.

## Coverage

> Đối chiếu nghĩa vụ test ↔ CHK (per-obligation). Nguồn edge VERIFIES cho KG. Coverage table là **bản đồ điều hướng**, KHÔNG phải nguồn nội dung TC. Tầng: UI · API · —. Trạng thái: covered · excluded-approved · blocked · tbd · partial.

> Tổng 909 nghĩa vụ: covered 892 · excluded-approved 5 · blocked 12 · tbd 0 · partial 0.

| Source ID | Nghĩa vụ (obligation) | Scope | CHK-ID | Tầng | Trạng thái | Lý do (nếu excluded) |
|-----------|----------------------|-------|--------|------|-----------|----------------------|
| FR-phuong-an-kinh-doanh-001 | happy — SM xem khung dự án khối mình | uc-xem-pakd | CHK-phuong-an-kinh-doanh-001 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | happy — GĐK xem khung dự án khối mình | uc-xem-pakd | CHK-phuong-an-kinh-doanh-002 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | happy — Kế toán xem khung mọi khối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-003 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | meta "PAKD" hiện với vai trò được xem | uc-xem-pakd | CHK-phuong-an-kinh-doanh-004 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | alternate — khung vẫn hiện khi đang sửa thông tin cơ bản | uc-xem-pakd | CHK-phuong-an-kinh-doanh-005 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | AM thấy khung 🔒 | uc-xem-pakd | CHK-phuong-an-kinh-doanh-006 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | AM — ẩn mục "PAKD" trên meta | uc-xem-pakd | CHK-phuong-an-kinh-doanh-007 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | SM mở dự án khối khác bị từ chối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-008 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | GĐK mở dự án khối khác bị từ chối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-009 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | alternate — "Chờ duyệt mã" không hiện khung | uc-xem-pakd | CHK-phuong-an-kinh-doanh-011 | UI | covered | — |
| FR-phuong-an-kinh-doanh-001 | alternate — khung chỉ ở tab "Thông tin dự án" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-012 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | nhánh 1 — có bản điều chỉnh thì nạp bản điều chỉnh | uc-xem-pakd | CHK-phuong-an-kinh-doanh-013 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | nhánh 2 — nạp PAKD đã lưu | uc-xem-pakd | CHK-phuong-an-kinh-doanh-014 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | nhánh 3 — form trống mặc định | uc-xem-pakd | CHK-phuong-an-kinh-doanh-015 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | tình trạng theo cờ đã ký của dự án | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-163 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | tình trạng theo cờ chưa ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-164 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | điền sẵn thông tin hợp đồng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-165 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | giá trị = doanh thu dự kiến khi chưa có HĐ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-166 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | Bắt đầu / Kết thúc theo thời hạn HĐ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-167 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | Bắt đầu / Kết thúc theo thời gian dự án | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-168 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | Thời điểm dự kiến ký theo ngày dự kiến ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-169 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | điền sẵn chi phí kế hoạch | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-170 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | nạp PAKD đã lưu khi làm lại | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-342 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | mở lại hiển thị bản đã lưu | chung | CHK-phuong-an-kinh-doanh-653 | UI | covered | — |
| FR-phuong-an-kinh-doanh-002 | tải lại trang hiển thị bản đã lưu | chung | CHK-phuong-an-kinh-doanh-654 | UI | covered | — |
| FR-phuong-an-kinh-doanh-003 | happy — chuyển dự án nạp lại khung | uc-xem-pakd | CHK-phuong-an-kinh-doanh-016 | UI | covered | — |
| FR-phuong-an-kinh-doanh-003 | bỏ phần đang sửa chưa lưu khi nạp lại | uc-xem-pakd | CHK-phuong-an-kinh-doanh-017 | UI | covered | — |
| FR-phuong-an-kinh-doanh-003 | nạp lại do người khác lưu P-03 | uc-xem-pakd | CHK-phuong-an-kinh-doanh-018 | UI | covered | — |
| FR-phuong-an-kinh-doanh-003 | thông báo khi nạp lại do người khác | uc-xem-pakd | CHK-phuong-an-kinh-doanh-019 | UI | covered | — |
| FR-phuong-an-kinh-doanh-003 | nạp lại do người khác lưu nháp | uc-xem-pakd | CHK-phuong-an-kinh-doanh-020 | UI | covered | — |
| FR-phuong-an-kinh-doanh-003 | nạp lại do Kế toán quyết định | uc-xem-pakd | CHK-phuong-an-kinh-doanh-021 | UI | covered | — |
| FR-phuong-an-kinh-doanh-003 | alternate — thao tác của chính người dùng không hiện E24 | uc-xem-pakd | CHK-phuong-an-kinh-doanh-022 | UI | covered | — |
| FR-phuong-an-kinh-doanh-004 | Người lập = người lưu PAKD | uc-xem-pakd | CHK-phuong-an-kinh-doanh-023 | UI | covered | — |
| FR-phuong-an-kinh-doanh-004 | Người lập = người lưu bản điều chỉnh khi đang điều chỉnh | uc-xem-pakd | CHK-phuong-an-kinh-doanh-024 | UI | covered | — |
| FR-phuong-an-kinh-doanh-004 | Người lập = người nộp phiên bản mới nhất khi chưa có người lưu | uc-xem-pakd | CHK-phuong-an-kinh-doanh-025 | UI | covered | — |
| FR-phuong-an-kinh-doanh-004 | Người lập = tài khoản hiện tại | uc-xem-pakd | CHK-phuong-an-kinh-doanh-026 | UI | covered | — |
| FR-phuong-an-kinh-doanh-004 | Hạn lập PAKD dd/mm/yyyy | uc-xem-pakd | CHK-phuong-an-kinh-doanh-027 | UI | covered | — |
| FR-phuong-an-kinh-doanh-004 | Hạn lập PAKD "—" khi chưa có hạn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-028 | UI | covered | — |
| FR-phuong-an-kinh-doanh-004 | ô Thời gian còn lại | uc-xem-pakd | CHK-phuong-an-kinh-doanh-029 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 1 — bản điều chỉnh Chờ CFO | uc-xem-pakd | CHK-phuong-an-kinh-doanh-038 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 2 — điều chỉnh bị từ chối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-039 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 3 — đang mở sửa | uc-xem-pakd | CHK-phuong-an-kinh-doanh-040 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 3 — có bản điều chỉnh nháp | uc-xem-pakd | CHK-phuong-an-kinh-doanh-041 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 4 — chưa có phiên bản | uc-xem-pakd | CHK-phuong-an-kinh-doanh-042 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 5 — lần đầu Chờ CFO | uc-xem-pakd | CHK-phuong-an-kinh-doanh-043 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 6 — Đã duyệt | uc-xem-pakd | CHK-phuong-an-kinh-doanh-044 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 7 — từ chối làm lại | uc-xem-pakd | CHK-phuong-an-kinh-doanh-045 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 8 — sau huỷ bản điều chỉnh bị từ chối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-046 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | nhánh 9 — còn lại hiện tên trạng thái phiên bản | uc-xem-pakd | CHK-phuong-an-kinh-doanh-047 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | màu xanh lá cho "Đã duyệt" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-048 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | màu vàng cho nhãn chờ duyệt | uc-xem-pakd | CHK-phuong-an-kinh-doanh-049 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | màu đỏ cho nhãn từ chối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-050 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | màu xanh dương cho "Đang điều chỉnh" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-051 | UI | covered | — |
| FR-phuong-an-kinh-doanh-005 | màu xám cho nhãn còn lại | uc-xem-pakd | CHK-phuong-an-kinh-doanh-052 | UI | covered | — |
| FR-phuong-an-kinh-doanh-006 | nhánh (a) — SM khối dự án nhập được | uc-xem-pakd | CHK-phuong-an-kinh-doanh-053 | UI | covered | — |
| FR-phuong-an-kinh-doanh-006 | Kế toán luôn chỉ xem | uc-xem-pakd | CHK-phuong-an-kinh-doanh-054 | UI | covered | — |
| FR-phuong-an-kinh-doanh-006 | "PAKD chờ duyệt" chỉ xem | uc-xem-pakd | CHK-phuong-an-kinh-doanh-055 | UI | covered | — |
| FR-phuong-an-kinh-doanh-006 | "Pending" chỉ xem | uc-xem-pakd | CHK-phuong-an-kinh-doanh-056 | UI | covered | — |
| FR-phuong-an-kinh-doanh-006 | "Kết thúc" chỉ xem | uc-xem-pakd | CHK-phuong-an-kinh-doanh-057 | UI | covered | — |
| FR-phuong-an-kinh-doanh-006 | Đang thực hiện chưa mở điều chỉnh thì chỉ xem | uc-xem-pakd | CHK-phuong-an-kinh-doanh-058 | UI | covered | — |
| FR-phuong-an-kinh-doanh-006 | chỉ xem khoá cả các nút thao tác dòng | uc-xem-pakd | CHK-phuong-an-kinh-doanh-059 | UI | covered | — |
| FR-phuong-an-kinh-doanh-006 | nhánh (a) — làm lại sau từ chối được nhập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-342 | UI | covered | — |
| FR-phuong-an-kinh-doanh-006 | nhánh (b) — đang điều chỉnh được nhập | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-454 | UI | covered | — |
| FR-phuong-an-kinh-doanh-007 | tiêu đề mặc định | uc-xem-pakd | CHK-phuong-an-kinh-doanh-060 | UI | covered | — |
| FR-phuong-an-kinh-doanh-007 | tiêu đề khi có bản điều chỉnh chờ duyệt | uc-xem-pakd | CHK-phuong-an-kinh-doanh-061 | UI | covered | — |
| FR-phuong-an-kinh-doanh-007 | nút "Sửa PAKD" hiện khi đủ điều kiện | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-447 | UI | covered | — |
| FR-phuong-an-kinh-doanh-007 | vai trò không được điều chỉnh không thấy nút | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-448 | UI | covered | — |
| FR-phuong-an-kinh-doanh-007 | có bản chờ duyệt không có nút | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-449 | UI | covered | — |
| FR-phuong-an-kinh-doanh-007 | đang ở chế độ sửa không hiện nút | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-450 | UI | covered | — |
| FR-phuong-an-kinh-doanh-007 | tiêu đề khi đang điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-461 | UI | covered | — |
| FR-phuong-an-kinh-doanh-007 | nút "Sửa PAKD" hiện lại sau duyệt điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-553 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | Doanh thu kế hoạch Đã ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-071 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | Doanh thu kế hoạch Chưa ký có giá trị | uc-xem-pakd | CHK-phuong-an-kinh-doanh-072 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | Doanh thu kế hoạch Chưa ký chưa có giá trị | uc-xem-pakd | CHK-phuong-an-kinh-doanh-073 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | Lợi nhuận | uc-xem-pakd | CHK-phuong-an-kinh-doanh-074 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | Lợi nhuận âm tô đỏ | uc-xem-pakd | CHK-phuong-an-kinh-doanh-075 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | Biên lợi nhuận % 1 chữ số thập phân | uc-xem-pakd | CHK-phuong-an-kinh-doanh-076 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | nhãn "▲ Đạt" khi ≥ 20% | uc-xem-pakd | CHK-phuong-an-kinh-doanh-077 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | nhãn "! Dưới khung" khi < 20% | uc-xem-pakd | CHK-phuong-an-kinh-doanh-078 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | biên "—" khi chưa có doanh thu | uc-xem-pakd | CHK-phuong-an-kinh-doanh-079 | UI | covered | — |
| FR-phuong-an-kinh-doanh-008 | ghi chú "Khung tối thiểu 20.0%" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-080 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | biểu đồ Đã ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-085 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | biểu đồ Chưa ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-086 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | trục tháng theo dải có số liệu | uc-xem-pakd | CHK-phuong-an-kinh-doanh-087 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | nhãn trục "x tỷ" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-088 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | nhãn trục "x tr" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-089 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | trục tiền tự làm tròn bước | uc-xem-pakd | CHK-phuong-an-kinh-doanh-090 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | tooltip "Tháng MM/YYYY" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-091 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | chú thích "ĐVT: VNĐ" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-092 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | trống — Đã ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-093 | UI | covered | — |
| FR-phuong-an-kinh-doanh-009 | trống — Chưa ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-094 | UI | covered | — |
| FR-phuong-an-kinh-doanh-010 | bảng tóm tắt Đã ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-106 | UI | covered | — |
| FR-phuong-an-kinh-doanh-010 | % doanh thu = chi phí / doanh thu | uc-xem-pakd | CHK-phuong-an-kinh-doanh-107 | UI | covered | — |
| FR-phuong-an-kinh-doanh-010 | % "—" khi chưa có doanh thu | uc-xem-pakd | CHK-phuong-an-kinh-doanh-108 | UI | covered | — |
| FR-phuong-an-kinh-doanh-010 | bảng tóm tắt Chưa ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-109 | UI | covered | — |
| FR-phuong-an-kinh-doanh-010 | Chưa ký chưa có tháng | uc-xem-pakd | CHK-phuong-an-kinh-doanh-110 | UI | covered | — |
| FR-phuong-an-kinh-doanh-010 | dòng TỔNG Chưa ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-111 | UI | covered | — |
| FR-phuong-an-kinh-doanh-010 | tổng = 0 hiện "—" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-112 | UI | covered | — |
| FR-phuong-an-kinh-doanh-011 | Mục 1 Đã ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-175 | UI | covered | — |
| FR-phuong-an-kinh-doanh-011 | Mục 1 Chưa ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-176 | UI | covered | — |
| FR-phuong-an-kinh-doanh-011 | Xác suất tối đa 100 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-177 | UI | covered | — |
| FR-phuong-an-kinh-doanh-012 | happy — điền sẵn khi đổi sang Đã ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-180 | UI | covered | — |
| FR-phuong-an-kinh-doanh-012 | đổi sang Đã ký xoá dải lỗi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-190 | UI | covered | — |
| FR-phuong-an-kinh-doanh-012 | alternate — đổi Đã ký → Chưa ký giữ dữ liệu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-191 | UI | covered | — |
| FR-phuong-an-kinh-doanh-012 | khoá "Chưa ký" (a) — lập lần đầu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-192 | UI | covered | — |
| FR-phuong-an-kinh-doanh-012 | khoá "Chưa ký" (a) — làm lại | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-193 | UI | covered | — |
| FR-phuong-an-kinh-doanh-012 | khoá "Chưa ký" (b) — điều chỉnh từ bản Đã ký | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-466 | UI | covered | — |
| FR-phuong-an-kinh-doanh-012 | khoá "Chưa ký" (a) — điều chỉnh khi dự án đã ký | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-467 | UI | covered | — |
| FR-phuong-an-kinh-doanh-012 | điều chỉnh Chưa ký → Đã ký | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-468 | UI | covered | — |
| FR-phuong-an-kinh-doanh-013 | Mục 2 Đã ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-195 | UI | covered | — |
| FR-phuong-an-kinh-doanh-013 | Số tháng tự tính | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-196 | UI | covered | — |
| FR-phuong-an-kinh-doanh-013 | Số tháng "—" khi chưa đủ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-199 | UI | covered | — |
| FR-phuong-an-kinh-doanh-013 | Số tháng "—" khi ≤ 0 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-200 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | bảng Mục 3 đủ cột | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-201 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | Giá trị mốc tự tính | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-202 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | Giá trị thu đợt tự tính | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-203 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | % mốc tối đa 100 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-204 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | Tỷ lệ tối đa 100 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-205 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | Tháng thu tiền tự tính | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-206 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | Tháng thu tiền "—" khi chưa có tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-211 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | dòng TỔNG | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-212 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | Σ % lệch 100 quá 0,01 chữ đỏ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-213 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | BVA — lệch đúng 0,01 không đỏ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-214 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | Thêm dòng mốc mới mặc định | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-215 | UI | covered | — |
| FR-phuong-an-kinh-doanh-014 | xoá dòng không hỏi xác nhận | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-216 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | đầu mục Kỳ kế hoạch | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-217 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | cột tháng theo kỳ, nhãn T{tháng}/{yy} | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-218 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | cảnh báo kỳ tạm | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-222 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | thêm cột tháng ngoài kỳ đang có số | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-223 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | cột ngoài kỳ tô vàng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-224 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | cảnh báo chi phí ngoài kỳ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-225 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | 2 cột đầu cố định khi cuộn ngang | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-227 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | 2 khối chi phí và nút Thêm khoản mục | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-228 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | Thêm khoản mục vào đúng khối | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-229 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | cấu trúc dòng khoản mục | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-232 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | Tổng dòng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-233 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | Cộng chi phí sản xuất theo tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-234 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | Cộng chi phí kinh doanh theo tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-235 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | tháng = 0 hiện "—" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-236 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | dòng TỔNG CHI PHÍ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-237 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | dòng Luỹ kế chi phí | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-238 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | nhập 0 xoá giá trị tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-239 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | nút × xoá dòng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-240 | UI | covered | — |
| FR-phuong-an-kinh-doanh-015 | chú thích cuối mục | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-241 | UI | covered | — |
| FR-phuong-an-kinh-doanh-016 | gợi ý nút ÷ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-242 | UI | covered | — |
| FR-phuong-an-kinh-doanh-016 | mở hộp chia đều | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-243 | UI | covered | — |
| FR-phuong-an-kinh-doanh-016 | happy — Chia đều | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-244 | UI | covered | — |
| FR-phuong-an-kinh-doanh-016 | bỏ giá trị ngoài kỳ của dòng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-245 | UI | covered | — |
| FR-phuong-an-kinh-doanh-016 | alternate — Huỷ đóng hộp | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-246 | UI | covered | — |
| FR-phuong-an-kinh-doanh-016 | Tổng giá trị chia đều theo giới hạn tiền | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-282 | UI | covered | — |
| FR-phuong-an-kinh-doanh-017 | bảng Mốc kế hoạch đủ cột | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-247 | UI | covered | — |
| FR-phuong-an-kinh-doanh-017 | Tổng = SX + KD | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-248 | UI | covered | — |
| FR-phuong-an-kinh-doanh-017 | dòng TỔNG giai đoạn | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-249 | UI | covered | — |
| FR-phuong-an-kinh-doanh-017 | Thêm dòng giai đoạn | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-250 | UI | covered | — |
| FR-phuong-an-kinh-doanh-017 | cảnh báo thiếu Từ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-251 | UI | covered | — |
| FR-phuong-an-kinh-doanh-017 | cảnh báo Đến trước Từ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-252 | UI | covered | — |
| FR-phuong-an-kinh-doanh-017 | negative — giai đoạn không có tiền không cảnh báo | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-253 | UI | covered | — |
| FR-phuong-an-kinh-doanh-017 | cảnh báo giai đoạn vẫn cho gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-327 | UI | covered | — |
| FR-phuong-an-kinh-doanh-018 | đối chiếu khi dự án đã có hợp đồng | uc-xem-pakd | CHK-phuong-an-kinh-doanh-113 | UI | covered | — |
| FR-phuong-an-kinh-doanh-018 | cảnh báo lệch > 2% | uc-xem-pakd | CHK-phuong-an-kinh-doanh-114 | UI | covered | — |
| FR-phuong-an-kinh-doanh-018 | dự án chưa có hợp đồng hiện "—" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-117 | UI | covered | — |
| FR-phuong-an-kinh-doanh-018 | doanh thu trống / 0 hiện "—" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-118 | UI | covered | — |
| FR-phuong-an-kinh-doanh-018 | gốc doanh thu = bản đang hiển thị | uc-xem-pakd | CHK-phuong-an-kinh-doanh-119 | UI | covered | — |
| FR-phuong-an-kinh-doanh-018 | Chưa ký có tháng dự kiến ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-121 | UI | covered | — |
| FR-phuong-an-kinh-doanh-018 | Chưa ký chưa có tháng dự kiến ký | uc-xem-pakd | CHK-phuong-an-kinh-doanh-122 | UI | covered | — |
| FR-phuong-an-kinh-doanh-018 | dòng cố định cuối mục | uc-xem-pakd | CHK-phuong-an-kinh-doanh-123 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | ô số tự phân cách nghìn | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-254 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | ô số chỉ nhận chữ số | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-255 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | ô % nhận dấu chấm thập phân | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-256 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | ô trống hiện gợi ý "0" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-257 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | chuẩn hoá "2/2027" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-258 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | chuẩn hoá khi nhấn Enter | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-259 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | sai dạng báo lỗi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-262 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | xoá trắng ô tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-266 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | lỗi khi gửi chỉ ở dải lỗi chung | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-267 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | chọn nhiều tệp hiện thẻ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-268 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | nút × gỡ tệp | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-269 | UI | covered | — |
| FR-phuong-an-kinh-doanh-019 | dán giá trị tháng hợp lệ | chung | CHK-phuong-an-kinh-doanh-656 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | dòng hướng dẫn chân khung | uc-xem-pakd | CHK-phuong-an-kinh-doanh-062 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | "Lưu lần cuối" của PAKD | uc-xem-pakd | CHK-phuong-an-kinh-doanh-070 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | nút đầu trang khi lập lần đầu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-150 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | ẩn nút khi đang sửa thông tin cơ bản | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-151 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | ẩn nút khi rời khung | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-152 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | không có nút khi khung không cho nhập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-153 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | ẩn nút khi khung không còn cho nhập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-334 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | nút đầu trang khi đang điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-463 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | "Lưu lần cuối" của bản điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-465 | UI | covered | — |
| FR-phuong-an-kinh-doanh-020 | "Huỷ bản điều chỉnh" khi đã có bản lưu | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-474 | UI | covered | — |
| FR-phuong-an-kinh-doanh-021 | Lưu nháp vẫn kiểm giới hạn nhập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-284 | UI | covered | — |
| FR-phuong-an-kinh-doanh-021 | happy — toast Lưu nháp | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-287 | UI | covered | — |
| FR-phuong-an-kinh-doanh-021 | Lưu nháp không kiểm tra | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-288 | UI | covered | — |
| FR-phuong-an-kinh-doanh-021 | giữ nguyên trạng thái dự án, không sinh phiên bản | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-289 | UI | covered | — |
| FR-phuong-an-kinh-doanh-021 | nội dung được lưu kèm người / thời điểm | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-290 | UI | covered | — |
| FR-phuong-an-kinh-doanh-021 | ghi lịch sử "Lưu nháp PAKD" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-291 | UI | covered | — |
| FR-phuong-an-kinh-doanh-021 | dự án không còn "Chưa có PAKD" khi lưu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-293 | UI | covered | — |
| FR-phuong-an-kinh-doanh-021 | dự án vừa Pending khi lưu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-295 | UI | covered | — |
| FR-phuong-an-kinh-doanh-021 | ghi không trọn vẹn | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-296 | UI | covered | — |
| FR-phuong-an-kinh-doanh-022 | kiểm giới hạn nhập khi gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-275 | UI | covered | — |
| FR-phuong-an-kinh-doanh-022 | có lỗi thì không gửi, hiện dải đỏ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-299 | UI | covered | — |
| FR-phuong-an-kinh-doanh-022 | cuộn tới đầu khung | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-300 | UI | covered | — |
| FR-phuong-an-kinh-doanh-022 | dải lỗi tự mất khi sửa ô | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-301 | UI | covered | — |
| FR-phuong-an-kinh-doanh-022 | liệt kê đủ danh sách lỗi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-302 | UI | covered | — |
| FR-phuong-an-kinh-doanh-022 | kiểm tra khi gửi điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-483 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | happy — dự án sang "PAKD chờ duyệt" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-329 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | toast gửi với số phiên bản lưu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-330 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | thêm phiên bản Chờ CFO | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-331 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | lịch sử "Nộp PAKD" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-332 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | khung chỉ xem sau khi gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-333 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | không đồng bộ số liệu PAKD khi gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-335 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | lưu bản chụp lúc nộp | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-338 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | gửi lại giữ số phiên bản | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-343 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | dự án vừa Pending khi gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-348 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | PAKD vừa được người khác gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-349 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | P-03 vừa cập nhật Mục 1 bản đang lập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-350 | UI | covered | — |
| FR-phuong-an-kinh-doanh-023 | ghi không trọn vẹn khi gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-352 | UI | covered | — |
| FR-phuong-an-kinh-doanh-024 | happy — bật chế độ điều chỉnh từ góc khung | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-454 | UI | covered | — |
| FR-phuong-an-kinh-doanh-024 | nút dòng thông báo thoát sửa thông tin cơ bản | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-456 | UI | covered | — |
| FR-phuong-an-kinh-doanh-024 | nút dòng thông báo về tab Thông tin dự án | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-457 | UI | covered | — |
| FR-phuong-an-kinh-doanh-024 | nút dòng thông báo cuộn tới khung | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-458 | UI | covered | — |
| FR-phuong-an-kinh-doanh-024 | góc khung khi đang sửa thông tin — chỉ nút của chế độ sửa thông tin | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-459 | UI | covered | — |
| FR-phuong-an-kinh-doanh-024 | nút điều chỉnh hiện sau khi thoát sửa thông tin | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-460 | UI | covered | — |
| FR-phuong-an-kinh-doanh-024 | nút "Tiếp tục sửa PAKD" khi đã có bản điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-476 | UI | covered | — |
| FR-phuong-an-kinh-doanh-024 | Tiếp tục sửa PAKD mở lại bản điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-513 | UI | covered | — |
| FR-phuong-an-kinh-doanh-025 | dải xanh "đang sửa" | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-462 | UI | covered | — |
| FR-phuong-an-kinh-doanh-025 | dải vàng chờ duyệt | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-489 | UI | covered | — |
| FR-phuong-an-kinh-doanh-025 | dải đỏ bị từ chối | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-511 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | happy — toast Lưu nháp điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-469 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | Lưu nháp điều chỉnh không kiểm tra | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-470 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | giữ số liệu dự án và PAKD đang áp dụng | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-471 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | lịch sử "Lưu nháp điều chỉnh PAKD" | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-472 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | chế độ sửa vẫn mở sau lưu nháp | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-473 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | Lưu nháp điều chỉnh kiểm giới hạn nhập | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-477 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | bản điều chỉnh vừa được người khác gửi — không ghi đè | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-479 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | dự án và khung nạp lại theo dữ liệu mới | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-480 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | dự án không còn Đang thực hiện | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-481 | UI | covered | — |
| FR-phuong-an-kinh-doanh-026 | ghi không trọn vẹn | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-482 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | happy — toast gửi điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-484 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | dự án giữ Đang thực hiện | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-485 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | số liệu dự án theo bản đã duyệt | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-486 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | thêm phiên bản Chờ CFO đánh dấu điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-487 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | khung hiển thị bản điều chỉnh chỉ xem | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-488 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | lịch sử "Gửi điều chỉnh PAKD" | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-490 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | thoát chế độ sửa sau gửi | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-491 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | lưu bản chụp lúc nộp | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-492 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | bản điều chỉnh vừa được người khác gửi | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-495 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | dự án vừa Kết thúc khi gửi | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-496 | UI | covered | — |
| FR-phuong-an-kinh-doanh-027 | ghi không trọn vẹn | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-497 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | Huỷ sửa — thoát và nạp lại bản đang áp dụng | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-498 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | Huỷ sửa không ghi lịch sử | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-499 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | Huỷ sửa không toast | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-500 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | Huỷ bản điều chỉnh — toast | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-501 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | giữ bản đang áp dụng | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-502 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | lịch sử "Huỷ bản điều chỉnh PAKD" | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-503 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | không hỏi xác nhận | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-504 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | bản bị từ chối không còn là phiên bản hiển thị | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-505 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | nội dung bản bị huỷ được lưu lại | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-508 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | huỷ khi bản vừa được gửi / huỷ | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-509 | UI | covered | — |
| FR-phuong-an-kinh-doanh-028 | ghi không trọn vẹn | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-510 | UI | covered | — |
| FR-phuong-an-kinh-doanh-029 | mở P-04 từ danh sách | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-356 | UI | covered | — |
| FR-phuong-an-kinh-doanh-029 | Kế toán duyệt mọi khối | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-358 | UI | covered | — |
| FR-phuong-an-kinh-doanh-029 | mở P-04 từ dòng thông báo | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-360 | UI | covered | — |
| FR-phuong-an-kinh-doanh-029 | Pending có bản chờ vẫn duyệt được | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-361 | UI | covered | — |
| FR-phuong-an-kinh-doanh-029 | chỉ Kế toán mở được P-04 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-364 | UI | covered | — |
| FR-phuong-an-kinh-doanh-029 | mở P-04 điều chỉnh từ danh sách | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-525 | UI | covered | — |
| FR-phuong-an-kinh-doanh-029 | mở P-04 điều chỉnh từ dòng thông báo | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-529 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | tiêu đề P-04 lần đầu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-366 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | nội dung dạng lần đầu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-367 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | số liệu tính từ bản đang chờ | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-368 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | LN gộp kèm biên % | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-369 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | Kế hoạch theo tháng "{n} tháng" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-370 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | "Chưa import" khi không có tháng | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-371 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | "Chưa import" không chặn duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-372 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | ô Ý kiến | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-373 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | chú thích lần đầu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-374 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | 3 nút P-04 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-375 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | cảnh báo lệch HĐ trên P-04 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-376 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | BVA — lệch 2% không cảnh báo trên P-04 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-377 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | dự án chưa có HĐ không cảnh báo | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-378 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | cảnh báo lệch không chặn | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-379 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | liệt kê điểm chưa đạt — bản lần đầu cập nhật theo HĐ | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-380 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | điểm chưa đạt không chặn Duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-381 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | negative — đạt kiểm tra không có khối cảnh báo | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-382 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | Huỷ đóng không lưu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-383 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | ✕ đóng không lưu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-384 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | bấm nền mờ đóng không lưu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-385 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | tiêu đề P-04 điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-532 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | Tình trạng hợp đồng hiện tại → mới | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-533 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | Doanh thu, Chi phí, LN gộp dạng cũ → mới | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-534 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | LN gộp kèm biên % bản mới | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-535 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | Số HĐ / ngày ký khi bản mới Đã ký | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-536 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | không hiện Số HĐ khi bản mới Chưa ký | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-537 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | chú thích điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-538 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | cảnh báo lệch HĐ — dạng điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-539 | UI | covered | — |
| FR-phuong-an-kinh-doanh-030 | liệt kê điểm chưa đạt — bản sinh từ P-03 | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-540 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | nội dung đổi so với lúc mở P-04 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-389 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | Duyệt không bắt buộc ý kiến | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-392 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | toast duyệt lần đầu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-393 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | dự án sang Đang thực hiện | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-394 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | phiên bản sang Đã duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-395 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | người quyết định hiển thị mã vai trò | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-396 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | lịch sử duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-398 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | Pending duyệt sang Đang thực hiện | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-402 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | đồng bộ số liệu khi duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-403 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | đồng bộ kế hoạch tháng | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-413 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | phiên bản không còn Chờ CFO khi ghi | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-439 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | ghi không trọn vẹn khi duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-443 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | popup giữ Ý kiến khi lỗi | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-444 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | toast duyệt điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-543 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | đồng bộ số liệu bản điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-544 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | phiên bản điều chỉnh sang Đã duyệt | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-545 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | bản điều chỉnh thành PAKD đang áp dụng | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-546 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | lịch sử duyệt điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-548 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | điều chỉnh — phiên bản không còn Chờ CFO khi ghi | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-562 | UI | covered | — |
| FR-phuong-an-kinh-doanh-031 | ghi không trọn vẹn — điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-565 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | nội dung đổi so với lúc mở P-04 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-391 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | từ chối thiếu ý kiến | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-426 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | Ý kiến theo giới hạn nhập | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-431 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | happy — toast từ chối lần đầu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-432 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | dự án về Chưa có PAKD | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-433 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | phiên bản sang Từ chối kèm ý kiến | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-434 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | lịch sử từ chối | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-435 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | không có số liệu cần hoàn lại | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-436 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | Pending từ chối giữ Pending | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-437 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | không ghi lịch sử chuyển trạng thái thừa | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-438 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | phiên bản không còn Chờ CFO khi ghi | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-441 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | ghi không trọn vẹn khi từ chối | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-446 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | từ chối điều chỉnh thiếu ý kiến | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-555 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | toast từ chối điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-556 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | giữ PAKD đang áp dụng | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-557 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | giữ bản điều chỉnh để sửa tiếp | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-559 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | lịch sử từ chối điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-561 | UI | covered | — |
| FR-phuong-an-kinh-doanh-032 | điều chỉnh — phiên bản không còn Chờ CFO khi ghi | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-562 | UI | covered | — |
| FR-phuong-an-kinh-doanh-033 | cột Phiên bản PAKD — Chờ CFO | uc-xem-pakd | CHK-phuong-an-kinh-doanh-124 | UI | covered | — |
| FR-phuong-an-kinh-doanh-033 | meta PAKD — Đã duyệt | uc-xem-pakd | CHK-phuong-an-kinh-doanh-125 | UI | covered | — |
| FR-phuong-an-kinh-doanh-033 | cột Phiên bản PAKD — Từ chối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-126 | UI | covered | — |
| FR-phuong-an-kinh-doanh-033 | chữ đỏ từ chối chỉ ở cột danh sách | uc-xem-pakd | CHK-phuong-an-kinh-doanh-127 | UI | covered | — |
| FR-phuong-an-kinh-doanh-033 | chưa có phiên bản hiện "—" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-128 | UI | covered | — |
| FR-phuong-an-kinh-doanh-033 | sau huỷ hiển thị bản đang áp dụng | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-505 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh Chờ duyệt mã | uc-xem-pakd | CHK-phuong-an-kinh-doanh-129 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh Pending — ngày chuyển Pending | uc-xem-pakd | CHK-phuong-an-kinh-doanh-130 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh làm lại — dòng chính "Làm lại V{n}" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-131 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh làm lại — dòng phụ ngày từ chối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-132 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh làm lại — quá hạn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-133 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh chưa đặt hạn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-134 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh còn hạn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-135 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | còn ≤ 3 ngày tô cam | uc-xem-pakd | CHK-phuong-an-kinh-doanh-136 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh hết hạn hôm nay | uc-xem-pakd | CHK-phuong-an-kinh-doanh-137 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh quá hạn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-138 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh chưa có phiên bản | uc-xem-pakd | CHK-phuong-an-kinh-doanh-139 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh Chờ CFO — "Nộp V{n}" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-140 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh Đã duyệt — "Duyệt" + ngày | uc-xem-pakd | CHK-phuong-an-kinh-doanh-141 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh điều chỉnh bị từ chối chưa huỷ | uc-xem-pakd | CHK-phuong-an-kinh-doanh-142 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | sau huỷ — "Duyệt" + ngày duyệt bản đang áp dụng | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-507 | UI | covered | — |
| FR-phuong-an-kinh-doanh-034 | nhánh Pending hiện "hạn" thay ngày chuyển Pending | uc-xem-pakd | — | — | blocked | blocked — OQ-CHK-01 (FR-034: "Pending" + ngày chuyển Pending (hoặc hạn) — spec không nêu điều kiện hiện hạn; Q-52 không phủ nhánh Pending) |
| FR-phuong-an-kinh-doanh-035 | Chưa có PAKD — SM thấy "Lập PAKD" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-147 | UI | covered | — |
| FR-phuong-an-kinh-doanh-035 | Chưa có PAKD — vai trò khác thấy "Xem" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-148 | UI | covered | — |
| FR-phuong-an-kinh-doanh-035 | link mở màn chi tiết | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-149 | UI | covered | — |
| FR-phuong-an-kinh-doanh-035 | PAKD chờ duyệt — Kế toán thấy "Duyệt" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-354 | UI | covered | — |
| FR-phuong-an-kinh-doanh-035 | link "Duyệt" đỏ đậm | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-355 | UI | covered | — |
| FR-phuong-an-kinh-doanh-035 | PAKD chờ duyệt — vai trò khác thấy "Xem" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-357 | UI | covered | — |
| FR-phuong-an-kinh-doanh-035 | Đang thực hiện có bản chờ — Kế toán thấy "Duyệt điều chỉnh" | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-524 | UI | covered | — |
| FR-phuong-an-kinh-doanh-035 | Đang thực hiện có bản chờ — vai trò khác thấy "Cập nhật" | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-526 | UI | covered | — |
| FR-phuong-an-kinh-doanh-035 | link "Cập nhật" mở màn chi tiết | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-527 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | Chưa có PAKD — SM / GĐK | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-154 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | Chưa có PAKD — biến thể quá hạn | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-155 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | Chưa có PAKD sau từ chối — SM / GĐK | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-156 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | Chưa có PAKD — Kế toán | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-157 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | Chưa có PAKD — AM không thấy hạn | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-158 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | PAKD chờ duyệt — Kế toán | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-359 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | PAKD chờ duyệt — SM / GĐK | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-362 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | PAKD chờ duyệt — AM không thấy số V | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-363 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | Đang thực hiện — SM / GĐK không có bản điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-455 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | Đang thực hiện — có bản điều chỉnh đang soạn | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-475 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | Đang thực hiện — có bản điều chỉnh bị từ chối | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-512 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | bản điều chỉnh chờ — Kế toán | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-528 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | bản điều chỉnh chờ — SM / GĐK | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-530 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | bản điều chỉnh chờ — AM | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-531 | UI | covered | — |
| FR-phuong-an-kinh-doanh-036 | dòng thông báo có chữ đỏ quá tháng dự kiến ký | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-618 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | nhánh (g) — Mục 1 nạp sẵn khi lập lần đầu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-165 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | lưu P-03 kiểm quyền | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-570 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | nhánh (f) — Kết thúc P-03 chỉ xem | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-571 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | PAKD vừa được gửi trong lúc lưu P-03 thì áp nhánh (b) | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-595 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | happy (c) — cập nhật bản đang lập | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-596 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | không sinh phiên bản | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-597 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | không đổi số liệu dự án | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-598 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | lịch sử "bản đang lập" | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-599 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | bản làm lại sau từ chối | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-600 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | khung PAKD tự nạp lại sau đồng bộ | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-602 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | nhánh (g) — chỉ lưu hợp đồng | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-610 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | không có trường khác thì không ghi lịch sử | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-613 | UI | covered | — |
| FR-phuong-an-kinh-doanh-037 | đồng bộ ghi trọn vẹn cùng hợp đồng | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-615 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Lưu nháp PAKD" không ghi chú | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-291 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Nộp PAKD" có ghi chú | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-332 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | thao tác PAKD khác không tăng Version | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-339 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "{mã vai trò} duyệt PAKD" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-398 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | chỉ "Tạo hợp đồng từ PAKD" tăng Version | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-421 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Tạo hợp đồng từ PAKD V{n}" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-422 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "{mã vai trò} từ chối PAKD" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-435 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Lưu nháp điều chỉnh PAKD" | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-472 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Gửi điều chỉnh PAKD" | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-490 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Huỷ bản điều chỉnh PAKD" | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-503 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Huỷ bản điều chỉnh PAKD (Kết thúc dự án)" | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-519 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "{mã vai trò} duyệt điều chỉnh PAKD" | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-548 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "{mã vai trò} từ chối điều chỉnh PAKD" | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-561 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Gửi điều chỉnh PAKD V{n} (theo hợp đồng)" | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-581 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Cập nhật PAKD theo hợp đồng" — bản đang chờ | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-591 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Cập nhật PAKD theo hợp đồng" — bản đang lập | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-599 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | dòng "Cập nhật PAKD theo hợp đồng" — bản điều chỉnh đang soạn | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-608 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | AM không thấy dòng thao tác PAKD | chung | CHK-phuong-an-kinh-doanh-627 | UI | covered | — |
| FR-phuong-an-kinh-doanh-038 | số đếm dòng không tính dòng PAKD với AM | chung | CHK-phuong-an-kinh-doanh-628 | UI | covered | — |
| FR-phuong-an-kinh-doanh-039 | người nhận = người lập PAKD đang áp dụng + GĐK khối | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| FR-phuong-an-kinh-doanh-039 | chỉ PAKD đang áp dụng Chưa ký, chưa có HĐ; PAKD đang lập / chờ duyệt không nhắc | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| FR-phuong-an-kinh-doanh-039 | nội dung "Dự án {mã} dự kiến ký HĐ {MM/YYYY} — cập nhật hợp đồng (P-03)" | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| FR-phuong-an-kinh-doanh-039 | chưa có tháng dự kiến ký — nội dung bỏ phần tháng (🔶) | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| FR-phuong-an-kinh-doanh-039 | dừng nhắc khi lưu P-03 | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| FR-phuong-an-kinh-doanh-040 | cảnh báo đỏ ở danh sách | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-617 | UI | covered | — |
| FR-phuong-an-kinh-doanh-040 | cảnh báo đỏ trên dòng thông báo | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-618 | UI | covered | — |
| FR-phuong-an-kinh-doanh-040 | AM cũng thấy cảnh báo | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-619 | UI | covered | — |
| FR-phuong-an-kinh-doanh-040 | AM thấy cảnh báo trên dòng thông báo | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-620 | UI | covered | — |
| FR-phuong-an-kinh-doanh-040 | gỡ cảnh báo ngay khi lưu P-03 | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-625 | UI | covered | — |
| FR-phuong-an-kinh-doanh-040 | gỡ cảnh báo trên dòng thông báo | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-626 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | P-04 liệt kê điểm chưa đạt của bản sinh từ hợp đồng | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-540 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | happy — sinh bản điều chỉnh Chờ CFO | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-572 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | khung hiển thị bản điều chỉnh chờ duyệt | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-573 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | Mục 1 theo hợp đồng | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-574 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | kỳ thực hiện theo thời hạn | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-575 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | số liệu dự án giữ tới khi duyệt | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-579 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | lịch sử bản sinh từ hợp đồng | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-581 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | người nộp = người lưu P-03 | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-582 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | luôn vào Chờ CFO kể cả khi không đạt kiểm tra | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-583 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | việc lưu hợp đồng không bị chặn | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-584 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | lưu bản chụp | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-585 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | số phiên bản không trùng khi thao tác cùng lúc | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-586 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | không có trường khác thì không sinh bản điều chỉnh | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-611 | UI | covered | — |
| FR-phuong-an-kinh-doanh-041 | ghi trọn vẹn cùng việc lưu hợp đồng | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-615 | UI | covered | — |
| FR-phuong-an-kinh-doanh-042 | happy (b) — cập nhật Mục 1 bản lần đầu đang chờ | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-587 | UI | covered | — |
| FR-phuong-an-kinh-doanh-042 | giữ số phiên bản, không sinh phiên bản mới | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-588 | UI | covered | — |
| FR-phuong-an-kinh-doanh-042 | gắn dấu "Cập nhật theo hợp đồng sau khi nộp" | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-589 | UI | covered | — |
| FR-phuong-an-kinh-doanh-042 | giữ bản chụp lúc nộp | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-590 | UI | covered | — |
| FR-phuong-an-kinh-doanh-042 | lịch sử "bản đang chờ V{n}" | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-591 | UI | covered | — |
| FR-phuong-an-kinh-doanh-042 | không đổi số liệu dự án | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-592 | UI | covered | — |
| FR-phuong-an-kinh-doanh-042 | happy (d) — cập nhật bản điều chỉnh đang chờ | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-593 | UI | covered | — |
| FR-phuong-an-kinh-doanh-042 | không khác thì không gắn dấu | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-612 | UI | covered | — |
| FR-phuong-an-kinh-doanh-042 | ghi không trọn vẹn — P-03 giữ dữ liệu | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-616 | UI | covered | — |
| FR-phuong-an-kinh-doanh-043 | nhãn trên P-04 — dạng lần đầu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-386 | UI | covered | — |
| FR-phuong-an-kinh-doanh-043 | so sánh 8 trường với bản chụp | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-387 | UI | covered | — |
| FR-phuong-an-kinh-doanh-043 | quyết định trên nội dung hiện tại | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-388 | UI | covered | — |
| FR-phuong-an-kinh-doanh-043 | nội dung đổi khi P-04 mở — Duyệt bị từ chối | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-389 | UI | covered | — |
| FR-phuong-an-kinh-doanh-043 | P-04 nạp lại giữ Ý kiến | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-390 | UI | covered | — |
| FR-phuong-an-kinh-doanh-043 | nội dung đổi khi P-04 mở — Từ chối bị từ chối | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-391 | UI | covered | — |
| FR-phuong-an-kinh-doanh-043 | dạng điều chỉnh — nhãn, so sánh 8 trường, giữ cũ → mới | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-542 | UI | covered | — |
| FR-phuong-an-kinh-doanh-043 | dạng điều chỉnh — nội dung đổi khi P-04 mở | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-563 | UI | covered | — |
| FR-phuong-an-kinh-doanh-044 | AM — ẩn 3 cột ở danh sách | uc-xem-pakd | CHK-phuong-an-kinh-doanh-143 | UI | covered | — |
| FR-phuong-an-kinh-doanh-044 | AM — ẩn ô Σ Giá trị HĐ dự kiến | uc-xem-pakd | CHK-phuong-an-kinh-doanh-144 | UI | covered | — |
| FR-phuong-an-kinh-doanh-044 | AM — Xuất Excel không có 3 cột | uc-xem-pakd | CHK-phuong-an-kinh-doanh-145 | UI | covered | — |
| FR-phuong-an-kinh-doanh-044 | alternate — vai trò được xem thấy 3 cột | uc-xem-pakd | CHK-phuong-an-kinh-doanh-146 | UI | covered | — |
| FR-phuong-an-kinh-doanh-045 | tạo hợp đồng ban đầu khi duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-417 | UI | covered | — |
| FR-phuong-an-kinh-doanh-045 | Version dự án +1 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-421 | UI | covered | — |
| FR-phuong-an-kinh-doanh-045 | lịch sử "Tạo hợp đồng từ PAKD V{n}" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-422 | UI | covered | — |
| FR-phuong-an-kinh-doanh-045 | đã có HĐ không ghi đè | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-423 | UI | covered | — |
| FR-phuong-an-kinh-doanh-045 | PAKD Chưa ký không tạo hợp đồng | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-424 | UI | covered | — |
| FR-phuong-an-kinh-doanh-045 | xét "chưa có HĐ" tại lúc ghi | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-425 | UI | covered | — |
| FR-phuong-an-kinh-doanh-045 | tạo hợp đồng ban đầu — duyệt điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-550 | UI | covered | — |
| FR-phuong-an-kinh-doanh-045 | lịch sử tạo HĐ — điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-551 | UI | covered | — |
| FR-phuong-an-kinh-doanh-045 | đã có HĐ không ghi đè — điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-552 | UI | covered | — |
| FR-phuong-an-kinh-doanh-046 | happy — cập nhật Mục 1 bản điều chỉnh nháp | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-603 | UI | covered | — |
| FR-phuong-an-kinh-doanh-046 | giữ phần đang soạn ở các mục khác | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-604 | UI | covered | — |
| FR-phuong-an-kinh-doanh-046 | không sinh bản điều chỉnh thứ hai | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-605 | UI | covered | — |
| FR-phuong-an-kinh-doanh-046 | bản Chưa ký không áp chuyển giai đoạn | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-606 | UI | covered | — |
| FR-phuong-an-kinh-doanh-046 | bản bị từ chối giữ nhãn | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-607 | UI | covered | — |
| FR-phuong-an-kinh-doanh-046 | lịch sử "bản điều chỉnh đang soạn" | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-608 | UI | covered | — |
| FR-phuong-an-kinh-doanh-046 | không đổi số liệu dự án | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-609 | UI | covered | — |
| FR-phuong-an-kinh-doanh-046 | không khác thì không cập nhật | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-614 | UI | covered | — |
| FR-phuong-an-kinh-doanh-046 | ghi không trọn vẹn — P-03 giữ dữ liệu | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-616 | UI | covered | — |
| FR-phuong-an-kinh-doanh-047 | báo trước trong hộp xác nhận — bản nháp | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-515 | UI | covered | — |
| FR-phuong-an-kinh-doanh-047 | báo trước — bản bị từ chối | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-516 | UI | covered | — |
| FR-phuong-an-kinh-doanh-047 | negative — không có bản điều chỉnh không báo | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-517 | UI | covered | — |
| FR-phuong-an-kinh-doanh-047 | tự huỷ bản điều chỉnh, giữ bản đang áp dụng | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-518 | UI | covered | — |
| FR-phuong-an-kinh-doanh-047 | lịch sử "Huỷ bản điều chỉnh PAKD (Kết thúc dự án)" | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-519 | UI | covered | — |
| FR-phuong-an-kinh-doanh-047 | bản bị từ chối không còn là phiên bản hiển thị | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-520 | UI | covered | — |
| FR-phuong-an-kinh-doanh-047 | bản đang chờ duyệt thì không kết thúc được | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-521 | UI | covered | — |
| FR-phuong-an-kinh-doanh-047 | nội dung bản tự huỷ được lưu lại | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-522 | UI | covered | — |
| FR-phuong-an-kinh-doanh-047 | kết thúc và huỷ ghi trọn vẹn | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-523 | UI | covered | — |
| BR-phuong-an-kinh-doanh-001 | nhánh SM khối mình xem được | uc-xem-pakd | CHK-phuong-an-kinh-doanh-001 | UI | covered | — |
| BR-phuong-an-kinh-doanh-001 | nhánh GĐK khối mình xem được | uc-xem-pakd | CHK-phuong-an-kinh-doanh-002 | UI | covered | — |
| BR-phuong-an-kinh-doanh-001 | nhánh Kế toán xem mọi khối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-003 | UI | covered | — |
| BR-phuong-an-kinh-doanh-001 | nhánh ngoài khối bị từ chối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-008, CHK-phuong-an-kinh-doanh-009 | UI | covered | — |
| BR-phuong-an-kinh-doanh-001 | danh sách — SM chỉ thấy dự án khối mình | uc-xem-pakd | CHK-phuong-an-kinh-doanh-010 | UI | covered | — |
| BR-phuong-an-kinh-doanh-001 | Xuất Excel — SM chỉ khối mình | chung | CHK-phuong-an-kinh-doanh-630 | UI | covered | — |
| BR-phuong-an-kinh-doanh-001 | danh sách — Kế toán mọi khối | chung | CHK-phuong-an-kinh-doanh-631 | UI | covered | — |
| BR-phuong-an-kinh-doanh-002 | SM khối dự án được lập | uc-xem-pakd | CHK-phuong-an-kinh-doanh-053 | UI | covered | — |
| BR-phuong-an-kinh-doanh-002 | Kế toán không được lập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-153 | UI | covered | — |
| BR-phuong-an-kinh-doanh-002 | GĐK khối dự án được lập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-292 | UI | covered | — |
| BR-phuong-an-kinh-doanh-002 | GĐK khối dự án gửi được | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-340 | UI | covered | — |
| BR-phuong-an-kinh-doanh-002 | ngoài khối không được lập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-346 | UI | covered | — |
| BR-phuong-an-kinh-doanh-003 | SM khối dự án được điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-447 | UI | covered | — |
| BR-phuong-an-kinh-doanh-003 | Kế toán không được điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-448 | UI | covered | — |
| BR-phuong-an-kinh-doanh-003 | không điều chỉnh khi bản điều chỉnh đang Chờ CFO | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-449 | UI | covered | — |
| BR-phuong-an-kinh-doanh-003 | chỉ khi dự án Đang thực hiện — Pending | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-451 | UI | covered | — |
| BR-phuong-an-kinh-doanh-003 | chỉ khi dự án Đang thực hiện — Kết thúc | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-452 | UI | covered | — |
| BR-phuong-an-kinh-doanh-003 | GĐK khối dự án được điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-453 | UI | covered | — |
| BR-phuong-an-kinh-doanh-003 | ngoài khối không được điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-494 | UI | covered | — |
| BR-phuong-an-kinh-doanh-004 | Kế toán là người duyệt mọi khối | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-358 | UI | covered | — |
| BR-phuong-an-kinh-doanh-004 | SM / GĐK không duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-364 | UI | covered | — |
| BR-phuong-an-kinh-doanh-004 | ghi quyết định kiểm vai trò | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-365 | UI | covered | — |
| BR-phuong-an-kinh-doanh-004 | điều chỉnh — chỉ Kế toán quyết định | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-564 | UI | covered | — |
| BR-phuong-an-kinh-doanh-005 | nhánh còn hạn > 0 | uc-xem-pakd | CHK-phuong-an-kinh-doanh-029 | UI | covered | — |
| BR-phuong-an-kinh-doanh-005 | nhánh = 0 ngày | uc-xem-pakd | CHK-phuong-an-kinh-doanh-030 | UI | covered | — |
| BR-phuong-an-kinh-doanh-005 | nhánh < 0 ngày | uc-xem-pakd | CHK-phuong-an-kinh-doanh-031 | UI | covered | — |
| BR-phuong-an-kinh-doanh-005 | nhánh không có hạn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-032 | UI | covered | — |
| BR-phuong-an-kinh-doanh-005 | nhánh phiên bản mới nhất Chờ CFO | uc-xem-pakd | CHK-phuong-an-kinh-doanh-033 | UI | covered | — |
| BR-phuong-an-kinh-doanh-005 | nhánh đã có phiên bản Đã duyệt | uc-xem-pakd | CHK-phuong-an-kinh-doanh-034 | UI | covered | — |
| BR-phuong-an-kinh-doanh-005 | nhánh bị từ chối đếm tiếp | uc-xem-pakd | CHK-phuong-an-kinh-doanh-035 | UI | covered | — |
| BR-phuong-an-kinh-doanh-005 | chữ đỏ khi ≤ 3 ngày chưa nộp | uc-xem-pakd | CHK-phuong-an-kinh-doanh-036 | UI | covered | — |
| BR-phuong-an-kinh-doanh-005 | BVA — 4 ngày không tô đỏ | uc-xem-pakd | CHK-phuong-an-kinh-doanh-037 | UI | covered | — |
| BR-phuong-an-kinh-doanh-006 | nhánh Đã ký = Giá trị hợp đồng | uc-xem-pakd | CHK-phuong-an-kinh-doanh-071 | UI | covered | — |
| BR-phuong-an-kinh-doanh-006 | nhánh Chưa ký = Giá trị dự kiến | uc-xem-pakd | CHK-phuong-an-kinh-doanh-072 | UI | covered | — |
| BR-phuong-an-kinh-doanh-006 | nhánh trống = 0 | uc-xem-pakd | CHK-phuong-an-kinh-doanh-073 | UI | covered | — |
| BR-phuong-an-kinh-doanh-007 | nhánh Đã ký = Σ kế hoạch tháng 6 nhóm | uc-xem-pakd | CHK-phuong-an-kinh-doanh-081 | UI | covered | — |
| BR-phuong-an-kinh-doanh-007 | nhánh Đã ký bỏ qua bảng giai đoạn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-082 | UI | covered | — |
| BR-phuong-an-kinh-doanh-007 | nhánh Chưa ký = Σ Sản xuất + Σ Kinh doanh giai đoạn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-083 | UI | covered | — |
| BR-phuong-an-kinh-doanh-007 | nhánh Chưa ký bỏ qua bảng khoản mục | uc-xem-pakd | CHK-phuong-an-kinh-doanh-084 | UI | covered | — |
| BR-phuong-an-kinh-doanh-008 | Chi phí SX = Σ 3 nhóm SX | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-234 | UI | covered | — |
| BR-phuong-an-kinh-doanh-008 | Chi phí KD = Tổng − Chi phí SX | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-235 | UI | covered | — |
| BR-phuong-an-kinh-doanh-008 | Chi phí KD = Tổng − SX khi đồng bộ | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-404 | UI | covered | — |
| BR-phuong-an-kinh-doanh-009 | Lợi nhuận = Doanh thu − Tổng chi phí | uc-xem-pakd | CHK-phuong-an-kinh-doanh-074 | UI | covered | — |
| BR-phuong-an-kinh-doanh-009 | Biên = Lợi nhuận / Doanh thu | uc-xem-pakd | CHK-phuong-an-kinh-doanh-076 | UI | covered | — |
| BR-phuong-an-kinh-doanh-009 | BVA — biên = 20% là Đạt | uc-xem-pakd | CHK-phuong-an-kinh-doanh-077 | UI | covered | — |
| BR-phuong-an-kinh-doanh-009 | nhánh dưới 20% | uc-xem-pakd | CHK-phuong-an-kinh-doanh-078 | UI | covered | — |
| BR-phuong-an-kinh-doanh-009 | nhánh Doanh thu = 0 | uc-xem-pakd | CHK-phuong-an-kinh-doanh-079 | UI | covered | — |
| BR-phuong-an-kinh-doanh-009 | ngưỡng không chặn gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-326 | UI | covered | — |
| BR-phuong-an-kinh-doanh-009 | ngưỡng không chặn duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-401 | UI | covered | — |
| BR-phuong-an-kinh-doanh-010 | Giá trị mốc = Giá trị HĐ × % / 100 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-202 | UI | covered | — |
| BR-phuong-an-kinh-doanh-010 | Giá trị thu = Giá trị mốc × Tỷ lệ / 100 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-203 | UI | covered | — |
| BR-phuong-an-kinh-doanh-011 | tháng gửi hồ sơ + làm tròn(chờ/30) | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-206 | UI | covered | — |
| BR-phuong-an-kinh-doanh-011 | gửi hồ sơ trống dùng Thời điểm mốc | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-207 | UI | covered | — |
| BR-phuong-an-kinh-doanh-011 | BVA — 14 ngày +0 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-208 | UI | covered | — |
| BR-phuong-an-kinh-doanh-011 | BVA — 15 ngày +1 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-209 | UI | covered | — |
| BR-phuong-an-kinh-doanh-011 | 45 ngày +2 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-210 | UI | covered | — |
| BR-phuong-an-kinh-doanh-011 | cả hai tháng trống | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-211 | UI | covered | — |
| BR-phuong-an-kinh-doanh-012 | công thức số tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-196 | UI | covered | — |
| BR-phuong-an-kinh-doanh-012 | qua năm | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-197 | UI | covered | — |
| BR-phuong-an-kinh-doanh-012 | BVA — cùng tháng = 1 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-198 | UI | covered | — |
| BR-phuong-an-kinh-doanh-012 | thiếu 1 trong 2 → 0 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-199 | UI | covered | — |
| BR-phuong-an-kinh-doanh-013 | Thu tháng = Σ Giá trị thu đợt theo Tháng thu tiền | uc-xem-pakd | CHK-phuong-an-kinh-doanh-095 | UI | covered | — |
| BR-phuong-an-kinh-doanh-013 | Chi tháng = Σ ô tháng khối SX + KD | uc-xem-pakd | CHK-phuong-an-kinh-doanh-096 | UI | covered | — |
| BR-phuong-an-kinh-doanh-013 | mốc không có Thời điểm vẫn sinh dòng thu | uc-xem-pakd | CHK-phuong-an-kinh-doanh-097 | UI | covered | — |
| BR-phuong-an-kinh-doanh-013 | ô tháng giá trị 0 không sinh dòng | uc-xem-pakd | CHK-phuong-an-kinh-doanh-098 | UI | covered | — |
| BR-phuong-an-kinh-doanh-013 | Doanh thu tháng = Σ Giá trị mốc theo Thời điểm | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-415 | UI | covered | — |
| BR-phuong-an-kinh-doanh-014 | chia đều chi phí giai đoạn cho các tháng Từ → Đến | uc-xem-pakd | CHK-phuong-an-kinh-doanh-101 | UI | covered | — |
| BR-phuong-an-kinh-doanh-014 | chia chính xác không làm tròn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-102 | UI | covered | — |
| BR-phuong-an-kinh-doanh-014 | Đến trống thì = Từ | uc-xem-pakd | CHK-phuong-an-kinh-doanh-103 | UI | covered | — |
| BR-phuong-an-kinh-doanh-014 | Doanh thu và Thu theo tháng = 0 | uc-xem-pakd | CHK-phuong-an-kinh-doanh-104 | UI | covered | — |
| BR-phuong-an-kinh-doanh-014 | giai đoạn thiếu Từ không sinh tháng, vẫn tính tổng | uc-xem-pakd | CHK-phuong-an-kinh-doanh-105 | UI | covered | — |
| BR-phuong-an-kinh-doanh-014 | giai đoạn thiếu Từ được cảnh báo | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-251 | UI | covered | — |
| BR-phuong-an-kinh-doanh-014 | Đến trước Từ không sinh tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-252 | UI | covered | — |
| BR-phuong-an-kinh-doanh-014 | kế hoạch tháng Chưa ký khi duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-416 | UI | covered | — |
| BR-phuong-an-kinh-doanh-015 | Dòng chi = Chi SX + Chi KD | uc-xem-pakd | CHK-phuong-an-kinh-doanh-096 | UI | covered | — |
| BR-phuong-an-kinh-doanh-015 | LKDT(t) = Thu(t) − Chi(t) + LKDT(t−1) | uc-xem-pakd | CHK-phuong-an-kinh-doanh-099 | UI | covered | — |
| BR-phuong-an-kinh-doanh-015 | tháng trống tính 0, chạy liên tục | uc-xem-pakd | CHK-phuong-an-kinh-doanh-100 | UI | covered | — |
| BR-phuong-an-kinh-doanh-016 | chia đều làm tròn nghìn | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-171 | UI | covered | — |
| BR-phuong-an-kinh-doanh-016 | không có tháng thì dòng không có giá trị | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-173 | UI | covered | — |
| BR-phuong-an-kinh-doanh-016 | làm tròn xuống nghìn, tháng cuối nhận phần dư | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-244 | UI | covered | — |
| BR-phuong-an-kinh-doanh-016 | chia đều khi đồng bộ hợp đồng | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-580 | UI | covered | — |
| BR-phuong-an-kinh-doanh-017 | kỳ = Bắt đầu → Kết thúc khi đủ và hợp lệ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-218 | UI | covered | — |
| BR-phuong-an-kinh-doanh-017 | thiếu Kết thúc — 12 tháng năm của Bắt đầu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-219 | UI | covered | — |
| BR-phuong-an-kinh-doanh-017 | chưa có Bắt đầu — 12 tháng năm hiện tại | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-220 | UI | covered | — |
| BR-phuong-an-kinh-doanh-017 | Kết thúc < Bắt đầu — kỳ tạm | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-221 | UI | covered | — |
| BR-phuong-an-kinh-doanh-017 | tháng có số ngoài kỳ được thêm cột | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-223 | UI | covered | — |
| BR-phuong-an-kinh-doanh-018 | nhánh lệch > 2% cảnh báo | uc-xem-pakd | CHK-phuong-an-kinh-doanh-114 | UI | covered | — |
| BR-phuong-an-kinh-doanh-018 | BVA — đúng 2% không cảnh báo | uc-xem-pakd | CHK-phuong-an-kinh-doanh-115 | UI | covered | — |
| BR-phuong-an-kinh-doanh-018 | tính trên giá trị chưa làm tròn | uc-xem-pakd | CHK-phuong-an-kinh-doanh-116 | UI | covered | — |
| BR-phuong-an-kinh-doanh-018 | nhánh dự án chưa có hợp đồng | uc-xem-pakd | CHK-phuong-an-kinh-doanh-117 | UI | covered | — |
| BR-phuong-an-kinh-doanh-018 | nhánh doanh thu 0 | uc-xem-pakd | CHK-phuong-an-kinh-doanh-118 | UI | covered | — |
| BR-phuong-an-kinh-doanh-018 | gốc DT trên khung là bản đang hiển thị | uc-xem-pakd | CHK-phuong-an-kinh-doanh-119 | UI | covered | — |
| BR-phuong-an-kinh-doanh-018 | chỉ cảnh báo, không chặn gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-328 | UI | covered | — |
| BR-phuong-an-kinh-doanh-018 | gốc DT trên P-04 là bản đang chờ | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-376 | UI | covered | — |
| BR-phuong-an-kinh-doanh-019 | lần đầu ngày 01 tháng dự kiến ký | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| BR-phuong-an-kinh-doanh-019 | lặp mỗi 7 ngày tới khi lưu hợp đồng | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| BR-phuong-an-kinh-doanh-019 | chưa có tháng dự kiến ký — nhắc ngày 01 hằng tháng | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| BR-phuong-an-kinh-doanh-020 | Giá trị HĐ trống lấy Giá trị dự kiến | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-180 | UI | covered | — |
| BR-phuong-an-kinh-doanh-020 | giữ Giá trị HĐ hiện có | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-181 | UI | covered | — |
| BR-phuong-an-kinh-doanh-020 | Bắt đầu = Từ sớm nhất | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-182 | UI | covered | — |
| BR-phuong-an-kinh-doanh-020 | Kết thúc = Đến muộn nhất | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-183 | UI | covered | — |
| BR-phuong-an-kinh-doanh-020 | Đến trống thì lấy Từ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-184 | UI | covered | — |
| BR-phuong-an-kinh-doanh-020 | chuyển giai đoạn thành kế hoạch chi phí tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-185 | UI | covered | — |
| BR-phuong-an-kinh-doanh-020 | tên giai đoạn trống dùng tên mặc định | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-186 | UI | covered | — |
| BR-phuong-an-kinh-doanh-020 | chỉ sinh dòng khi giá trị > 0 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-187 | UI | covered | — |
| BR-phuong-an-kinh-doanh-020 | đã có chi phí thì giữ kế hoạch cũ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-188 | UI | covered | — |
| BR-phuong-an-kinh-doanh-020 | không sinh được dòng nào thì giữ kế hoạch cũ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-189 | UI | covered | — |
| BR-phuong-an-kinh-doanh-021 | nhánh (1) dự án đã ký — lập lần đầu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-192 | UI | covered | — |
| BR-phuong-an-kinh-doanh-021 | nhánh (1) dự án đã ký — làm lại | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-193 | UI | covered | — |
| BR-phuong-an-kinh-doanh-021 | các trường hợp khác đổi tự do | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-194 | UI | covered | — |
| BR-phuong-an-kinh-doanh-021 | nhánh (2) điều chỉnh khi bản áp dụng Đã ký | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-466 | UI | covered | — |
| BR-phuong-an-kinh-doanh-021 | nhánh (1) dự án đã ký — điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-467 | UI | covered | — |
| BR-phuong-an-kinh-doanh-022 | Đã ký — 2 dòng chi phí kế hoạch | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-170 | UI | covered | — |
| BR-phuong-an-kinh-doanh-022 | chia đều trên các tháng thời hạn | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-171 | UI | covered | — |
| BR-phuong-an-kinh-doanh-022 | chỉ có tháng bắt đầu thì 1 tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-172 | UI | covered | — |
| BR-phuong-an-kinh-doanh-022 | không có tháng nào | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-173 | UI | covered | — |
| BR-phuong-an-kinh-doanh-022 | Chưa ký — giai đoạn "Toàn dự án" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-174 | UI | covered | — |
| BR-phuong-an-kinh-doanh-023 | 4 mốc gợi ý | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-159 | UI | covered | — |
| BR-phuong-an-kinh-doanh-023 | 8 khoản mục mẫu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-160 | UI | covered | — |
| BR-phuong-an-kinh-doanh-023 | Xác suất mặc định 50% | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-161 | UI | covered | — |
| BR-phuong-an-kinh-doanh-023 | 1 giai đoạn trống | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-162 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | Lưu nháp không kiểm tra bộ gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-288 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | kiểm tra khi gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-299 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | kiểm tra chung — Đã ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-303 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | kiểm tra chung — Chưa ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-304 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | bộ kiểm Đã ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-306 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | bộ kiểm Chưa ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-318 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | bộ kiểm theo tình trạng — Chưa ký không kiểm Mục 4 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-324 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | cảnh báo E13 không chặn gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-325 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | cảnh báo E16 không chặn gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-326 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | cảnh báo E17 không chặn gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-327 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | cảnh báo E15 không chặn gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-328 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | chạy lại bộ kiểm khi mở P-04 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-380 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | Lưu nháp điều chỉnh không kiểm tra | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-470 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | kiểm tra khi gửi điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-483 | UI | covered | — |
| BR-phuong-an-kinh-doanh-024 | ngoại lệ bản sinh từ P-03 chạy lại khi mở P-04 | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-540 | UI | covered | — |
| BR-phuong-an-kinh-doanh-025 | số V = số bản đã duyệt + 1 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-330 | UI | covered | — |
| BR-phuong-an-kinh-doanh-025 | số V khi chưa có bản duyệt là V1 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-331 | UI | covered | — |
| BR-phuong-an-kinh-doanh-025 | bị từ chối gửi lại giữ số | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-343 | UI | covered | — |
| BR-phuong-an-kinh-doanh-025 | cột dùng số lưu sau gửi lại | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-344 | UI | covered | — |
| BR-phuong-an-kinh-doanh-025 | mỗi lần gửi thêm 1 dòng phiên bản | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-345 | UI | covered | — |
| BR-phuong-an-kinh-doanh-025 | số V điều chỉnh = số bản đã duyệt + 1 | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-484 | UI | covered | — |
| BR-phuong-an-kinh-doanh-025 | gửi lại điều chỉnh giữ số | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-514 | UI | covered | — |
| BR-phuong-an-kinh-doanh-025 | số V tăng khi có lần duyệt | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-554 | UI | covered | — |
| BR-phuong-an-kinh-doanh-025 | số V bản sinh từ P-03 | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-572 | UI | covered | — |
| BR-phuong-an-kinh-doanh-026 | chưa duyệt — Giá trị HĐ dự kiến hiện "—" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-335 | UI | covered | — |
| BR-phuong-an-kinh-doanh-026 | chưa duyệt — dự án không nhận số liệu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-336 | UI | covered | — |
| BR-phuong-an-kinh-doanh-026 | không cộng vào Sổ theo dõi / Báo cáo khi chưa duyệt | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-337 | UI | covered | — |
| BR-phuong-an-kinh-doanh-026 | chỉ đồng bộ khi duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-403 | UI | covered | — |
| BR-phuong-an-kinh-doanh-026 | bị từ chối — dự án không nhận số liệu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-436 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | Doanh thu dự kiến = Doanh thu kế hoạch | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-403 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | Chi phí SX / KD kế hoạch | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-404 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | cờ đã ký = tình trạng PAKD | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-405 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | Ngày dự kiến ký (Đã ký) = Ngày ký thực tế | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-406 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | Ngày ký thực tế trống lấy Ngày ký trên HĐ | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-407 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | cả 2 trống giữ giá trị cũ | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-408 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | Ngày dự kiến ký (Chưa ký) = ngày 01 tháng dự kiến | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-409 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | Ngày bắt đầu = ngày 01 tháng Bắt đầu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-410 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | Ngày kết thúc = ngày cuối tháng Kết thúc | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-411 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | BVA — tháng 2 năm nhuận | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-412 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | kế hoạch tháng thay toàn bộ, nguồn "PAKD lập trên hệ thống" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-413 | UI | covered | — |
| BR-phuong-an-kinh-doanh-027 | chỉ thay khi có ≥ 1 tháng | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-414 | UI | covered | — |
| BR-phuong-an-kinh-doanh-028 | Duyệt lần đầu → Đang thực hiện | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-394 | UI | covered | — |
| BR-phuong-an-kinh-doanh-028 | Duyệt khi Pending → Đang thực hiện | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-402 | UI | covered | — |
| BR-phuong-an-kinh-doanh-028 | Từ chối → Chưa có PAKD | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-433 | UI | covered | — |
| BR-phuong-an-kinh-doanh-028 | Pending từ chối giữ Pending | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-437 | UI | covered | — |
| BR-phuong-an-kinh-doanh-028 | không ghi lịch sử thừa | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-438 | UI | covered | — |
| BR-phuong-an-kinh-doanh-029 | Duyệt → áp số liệu bản điều chỉnh vào dự án | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-544 | UI | covered | — |
| BR-phuong-an-kinh-doanh-029 | bản điều chỉnh thành đang áp dụng, bỏ bản điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-546 | UI | covered | — |
| BR-phuong-an-kinh-doanh-029 | trạng thái dự án không đổi | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-547 | UI | covered | — |
| BR-phuong-an-kinh-doanh-029 | áp kế hoạch tháng bản điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-549 | UI | covered | — |
| BR-phuong-an-kinh-doanh-029 | Từ chối → giữ PAKD đang áp dụng | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-557 | UI | covered | — |
| BR-phuong-an-kinh-doanh-029 | Từ chối chỉ đổi trạng thái phiên bản | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-558 | UI | covered | — |
| BR-phuong-an-kinh-doanh-029 | giữ bản điều chỉnh để sửa tiếp | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-559 | UI | covered | — |
| BR-phuong-an-kinh-doanh-029 | Từ chối — trạng thái dự án không đổi | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-560 | UI | covered | — |
| BR-phuong-an-kinh-doanh-030 | Duyệt không bắt buộc ý kiến | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-392 | UI | covered | — |
| BR-phuong-an-kinh-doanh-030 | ý kiến cắt khoảng trắng đầu / cuối | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-399 | UI | covered | — |
| BR-phuong-an-kinh-doanh-030 | Duyệt không nhập ý kiến giữ ý kiến cũ | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-400 | UI | covered | — |
| BR-phuong-an-kinh-doanh-030 | ý kiến bắt buộc khi Từ chối | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-426 | UI | covered | — |
| BR-phuong-an-kinh-doanh-031 | hiển thị mã vai trò "CFO" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-396 | UI | covered | — |
| BR-phuong-an-kinh-doanh-031 | lưu tài khoản người quyết định | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-397 | UI | covered | — |
| BR-phuong-an-kinh-doanh-031 | người thực hiện "{tài khoản} ({vai trò})" | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-398 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (f) Kết thúc chỉ xem | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-571 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (a) sinh bản điều chỉnh | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-572 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | ánh xạ Tình trạng, số / ngày ký, giá trị | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-574 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | ánh xạ Bắt đầu / Kết thúc theo thời hạn | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-575 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | ngày ký trống giữ cũ | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-576 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | thời hạn trống giữ cũ | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-577 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | giá trị 0 giữ cũ | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-578 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | Chưa ký chưa có chi phí — chuyển giai đoạn thành chi phí tháng | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-580 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | bản nhánh (a) luôn vào Chờ CFO | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-583 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (b) cập nhật bản đang chờ | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-587 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (d) không sinh bản mới | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-593 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | Pending lưu P-03 bình thường | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-594 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | chọn nhánh theo tình trạng tại lúc ghi | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-595 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (c) cập nhật bản đang lập | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-596 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (c) gồm bản làm lại | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-600 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (c) — chuyển giai đoạn sang chi phí tháng | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-601 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (e) cập nhật chính bản điều chỉnh | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-603 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (e) không chuyển giai đoạn | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-606 | UI | covered | — |
| BR-phuong-an-kinh-doanh-032 | nhánh (g) chưa có bản PAKD | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-610 | UI | covered | — |
| BR-phuong-an-kinh-doanh-033 | dạng 1 chữ số tháng có "/" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-258 | UI | covered | — |
| BR-phuong-an-kinh-doanh-033 | dạng không ngăn cách | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-259 | UI | covered | — |
| BR-phuong-an-kinh-doanh-033 | ngăn cách "-" | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-260 | UI | covered | — |
| BR-phuong-an-kinh-doanh-033 | ngăn cách "." | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-261 | UI | covered | — |
| BR-phuong-an-kinh-doanh-033 | tháng ngoài 1–12 không hợp lệ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-262 | UI | covered | — |
| BR-phuong-an-kinh-doanh-033 | năm phải 4 chữ số | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-265 | UI | covered | — |
| BR-phuong-an-kinh-doanh-034 | Xác suất > 100 tự về 100 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-177 | UI | covered | — |
| BR-phuong-an-kinh-doanh-034 | ô số không nhận số âm | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-178 | UI | covered | — |
| BR-phuong-an-kinh-doanh-034 | % mốc > 100 tự về 100 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-204 | UI | covered | — |
| BR-phuong-an-kinh-doanh-034 | Tỷ lệ > 100 tự về 100 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-205 | UI | covered | — |
| BR-phuong-an-kinh-doanh-034 | Thời gian chờ tối đa 999 ngày | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-283 | UI | covered | — |
| BR-phuong-an-kinh-doanh-035 | khối A chỉ chọn nhóm SX | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-230 | UI | covered | — |
| BR-phuong-an-kinh-doanh-035 | khối B chỉ chọn nhóm KD | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-231 | UI | covered | — |
| BR-phuong-an-kinh-doanh-036 | Chưa ký nhập theo giai đoạn, không có kế hoạch tháng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-179 | UI | covered | — |
| BR-phuong-an-kinh-doanh-037 | có bản chờ thì không ai sửa được | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-449 | UI | covered | — |
| BR-phuong-an-kinh-doanh-037 | số liệu dự án vẫn theo bản đã duyệt | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-486 | UI | covered | — |
| BR-phuong-an-kinh-doanh-037 | khung hiển thị bản điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-488 | UI | covered | — |
| BR-phuong-an-kinh-doanh-037 | có bản chờ thì khung hiển thị bản điều chỉnh — P-03 | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-573 | UI | covered | — |
| BR-phuong-an-kinh-doanh-038 | danh sách phiên bản chỉ thêm, không xoá | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-345 | UI | covered | — |
| BR-phuong-an-kinh-doanh-038 | tối đa 1 bản điều chỉnh đang mở | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-605 | UI | covered | — |
| BR-phuong-an-kinh-doanh-039 | ngưỡng 20% không phân biệt khối | chung | CHK-phuong-an-kinh-doanh-663 | UI | covered | — |
| BR-phuong-an-kinh-doanh-039 | ngưỡng 2% không phân biệt khối | chung | CHK-phuong-an-kinh-doanh-664 | UI | covered | — |
| BR-phuong-an-kinh-doanh-040 | nhánh lập lần đầu được nhập | uc-xem-pakd | CHK-phuong-an-kinh-doanh-062 | UI | covered | — |
| BR-phuong-an-kinh-doanh-040 | nhánh Chưa có PAKD — người không được lập | uc-xem-pakd | CHK-phuong-an-kinh-doanh-063 | UI | covered | — |
| BR-phuong-an-kinh-doanh-040 | nhánh PAKD chờ duyệt | uc-xem-pakd | CHK-phuong-an-kinh-doanh-064 | UI | covered | — |
| BR-phuong-an-kinh-doanh-040 | nhánh Đang thực hiện — được điều chỉnh | uc-xem-pakd | CHK-phuong-an-kinh-doanh-065 | UI | covered | — |
| BR-phuong-an-kinh-doanh-040 | nhánh Đang thực hiện — không được điều chỉnh | uc-xem-pakd | CHK-phuong-an-kinh-doanh-066 | UI | covered | — |
| BR-phuong-an-kinh-doanh-040 | nhánh bản điều chỉnh chờ duyệt | uc-xem-pakd | CHK-phuong-an-kinh-doanh-067 | UI | covered | — |
| BR-phuong-an-kinh-doanh-040 | nhánh Pending | uc-xem-pakd | CHK-phuong-an-kinh-doanh-068 | UI | covered | — |
| BR-phuong-an-kinh-doanh-040 | nhánh Kết thúc | uc-xem-pakd | CHK-phuong-an-kinh-doanh-069 | UI | covered | — |
| BR-phuong-an-kinh-doanh-040 | nhánh đang điều chỉnh (được sửa) | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-464 | UI | covered | — |
| BR-phuong-an-kinh-doanh-041 | SM khối mình được lưu P-03 | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-566 | UI | covered | — |
| BR-phuong-an-kinh-doanh-041 | GĐK khối mình được lưu P-03 | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-567 | UI | covered | — |
| BR-phuong-an-kinh-doanh-041 | Kế toán lưu P-03 mọi khối | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-568 | UI | covered | — |
| BR-phuong-an-kinh-doanh-041 | AM chỉ xem P-03 | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-569 | UI | covered | — |
| BR-phuong-an-kinh-doanh-041 | AM bị từ chối khi cố lưu | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-570 | UI | covered | — |
| BR-phuong-an-kinh-doanh-042 | phiên bản hiển thị = bản Đã duyệt gần nhất khi bản điều chỉnh bị từ chối đã huỷ | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-505 | UI | covered | — |
| BR-phuong-an-kinh-doanh-042 | meta hiển thị bản đang áp dụng | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-506 | UI | covered | — |
| BR-phuong-an-kinh-doanh-042 | cột Hạn lập theo phiên bản hiển thị | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-507 | UI | covered | — |
| BR-phuong-an-kinh-doanh-043 | quá tháng dự kiến ký và chưa có HĐ | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-617 | UI | covered | — |
| BR-phuong-an-kinh-doanh-043 | BVA — ngày cuối tháng chưa quá | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-621 | UI | covered | — |
| BR-phuong-an-kinh-doanh-043 | không có tháng dự kiến ký thì không cảnh báo | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-622 | UI | covered | — |
| BR-phuong-an-kinh-doanh-043 | có hợp đồng thì hết cảnh báo | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-625 | UI | covered | — |
| BR-phuong-an-kinh-doanh-044 | bản chụp mỗi lần gửi — lần đầu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-338 | UI | covered | — |
| BR-phuong-an-kinh-doanh-044 | bản chụp — gửi điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-492 | UI | covered | — |
| BR-phuong-an-kinh-doanh-044 | bản chụp — bản sinh từ hợp đồng | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-585 | UI | covered | — |
| BR-phuong-an-kinh-doanh-044 | bản chụp không thay đổi sau khi lưu | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-590 | UI | covered | — |
| BR-phuong-an-kinh-doanh-045 | Số HĐ, Giá trị từ PAKD | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-417 | UI | covered | — |
| BR-phuong-an-kinh-doanh-045 | thời hạn ngày 01 tháng Bắt đầu → ngày cuối tháng Kết thúc | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-418 | UI | covered | — |
| BR-phuong-an-kinh-doanh-045 | Ngày ký = Ngày ký thực tế | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-419 | UI | covered | — |
| BR-phuong-an-kinh-doanh-045 | Ngày ký thực tế trống lấy Ngày ký trên HĐ | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-420 | UI | covered | — |
| BR-phuong-an-kinh-doanh-045 | dự án đã có HĐ không ghi đè | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-423 | UI | covered | — |
| BR-phuong-an-kinh-doanh-046 | nhánh (a) không khác — chỉ lưu HĐ | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-611 | UI | covered | — |
| BR-phuong-an-kinh-doanh-046 | nhánh (b) không khác — không gắn dấu | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-612 | UI | covered | — |
| BR-phuong-an-kinh-doanh-046 | nhánh (c) không khác — không lịch sử | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-613 | UI | covered | — |
| BR-phuong-an-kinh-doanh-046 | nhánh (e) không khác — không lịch sử | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-614 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | ô ngắn tối đa 255 ký tự | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-275 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | BVA — 255 ký tự hợp lệ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-276 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | ô dài tối đa 1.000 ký tự | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-277 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | tên khoản mục tối đa 255 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-278 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | Đánh giá rủi ro tối đa 1.000 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-279 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | ô tiền tối đa 15 chữ số | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-280 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | BVA — 15 chữ số hợp lệ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-281 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | Tổng giá trị chia đều tối đa 15 chữ số | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-282 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | Thời gian chờ tối đa 999 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-283 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | áp cả khi Lưu nháp | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-284 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | ô bắt buộc chỉ khoảng trắng coi như trống | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-285 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | cắt khoảng trắng đầu / cuối trước khi lưu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-286 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | Ý kiến chỉ khoảng trắng coi như trống | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-429 | UI | covered | — |
| BR-phuong-an-kinh-doanh-047 | Ý kiến tối đa 1.000 ký tự | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-431 | UI | covered | — |
| BR-phuong-an-kinh-doanh-048 | tệp > 20 MB bị loại | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-270 | UI | covered | — |
| BR-phuong-an-kinh-doanh-048 | BVA — 20 MB được nhận | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-271 | UI | covered | — |
| BR-phuong-an-kinh-doanh-048 | sai định dạng bị loại | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-272 | UI | covered | — |
| BR-phuong-an-kinh-doanh-048 | tệp hợp lệ khác trong lượt vẫn nhận | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-273 | UI | covered | — |
| BR-phuong-an-kinh-doanh-048 | áp cho tệp của giai đoạn | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-274 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-001 | tiền VNĐ phân cách nghìn dấu phẩy | chung | CHK-phuong-an-kinh-doanh-633 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-001 | % 1 chữ số thập phân | chung | CHK-phuong-an-kinh-doanh-634 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-001 | ngoại lệ Σ % mốc hiện nguyên số | chung | CHK-phuong-an-kinh-doanh-635 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-001 | tháng MM/YYYY | chung | CHK-phuong-an-kinh-doanh-636 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-001 | ngày dd/mm/yyyy | chung | CHK-phuong-an-kinh-doanh-637 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-001 | ô trống "—" | chung | CHK-phuong-an-kinh-doanh-638 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-002 | biểu đồ co giãn, nhãn không chồng | chung | CHK-phuong-an-kinh-doanh-647 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-002 | biểu đồ và tóm tắt tự xuống dòng | chung | CHK-phuong-an-kinh-doanh-648 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-003 | kỳ 24 tháng vẫn nhập được | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-226 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-003 | giữ cố định 2 cột khi cuộn ngang | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-227 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-003 | bảng Nghiệm thu và Mốc kế hoạch cuộn ngang | chung | CHK-phuong-an-kinh-doanh-649 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-004 | toast góc trên phải | chung | CHK-phuong-an-kinh-doanh-639 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-004 | toast tự ẩn | chung | CHK-phuong-an-kinh-doanh-640 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-004 | toast ẩn sau 2,5 giây ± 0,2 | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-phuong-an-kinh-doanh-005 | mọi chỗ đếm "hôm nay" theo giờ Việt Nam | chung | CHK-phuong-an-kinh-doanh-651 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-005 | ngày nộp theo giờ Việt Nam | chung | CHK-phuong-an-kinh-doanh-652 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-006 | 95% thao tác ≤ 3 giây | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-phuong-an-kinh-doanh-006 | Xuất Excel Năm = "Tất cả" ≤ 10 giây | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-phuong-an-kinh-doanh-007 | AM — khung PAKD bị ẩn số liệu | uc-xem-pakd | CHK-phuong-an-kinh-doanh-006 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | AM — meta không có PAKD | uc-xem-pakd | CHK-phuong-an-kinh-doanh-007 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | AM — ẩn 3 cột PAKD | uc-xem-pakd | CHK-phuong-an-kinh-doanh-143 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | AM — ẩn ô tổng | uc-xem-pakd | CHK-phuong-an-kinh-doanh-144 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | AM — file Xuất Excel | uc-xem-pakd | CHK-phuong-an-kinh-doanh-145 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | AM — dòng thông báo không có hạn lập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-158 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | quyền kiểm ở mọi thao tác, không chỉ ẩn nút | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-346 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | AM — dòng thông báo không có số phiên bản | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-363 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | ngoại lệ — AM thấy cảnh báo không có số tiền | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-619 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | AM — ẩn dòng lịch sử PAKD | chung | CHK-phuong-an-kinh-doanh-627 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | AM — số đếm dòng lịch sử | chung | CHK-phuong-an-kinh-doanh-628 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-007 | AM không mở MH-03 | chung | CHK-phuong-an-kinh-doanh-629 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-008 | bản điều chỉnh bị huỷ không xoá cứng | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-508 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-008 | sau Kết thúc vẫn tra được đủ dữ liệu PAKD | chung | CHK-phuong-an-kinh-doanh-657 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-009 | quy mô 200 tài khoản, 50 người dùng đồng thời, dữ liệu 10 năm | chung | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-phuong-an-kinh-doanh-010 | Lưu nháp — dữ liệu nhập được giữ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-297 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | bấm lại ghi đúng một lần | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-298 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | Gửi — trọn vẹn hoặc không ghi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-352 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | Gửi — dữ liệu nhập được giữ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-353 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | Duyệt — trọn vẹn hoặc không ghi | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-443 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | Duyệt — bấm lại ghi một lần | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-445 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | Từ chối — trọn vẹn hoặc không ghi | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-446 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | Lưu nháp điều chỉnh — trọn vẹn hoặc không ghi | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-482 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | Gửi điều chỉnh — trọn vẹn hoặc không ghi | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-497 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | Huỷ điều chỉnh — trọn vẹn hoặc không ghi | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-510 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | Duyệt điều chỉnh — trọn vẹn hoặc không ghi | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-565 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-010 | P-03 sang PAKD — trọn vẹn hoặc không ghi | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-615 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-011 | double-submit chỉ ghi 1 phiên bản | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-341 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-011 | kiểm trạng thái tại lúc gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-348 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-011 | hợp đồng ban đầu và Version không lặp khi thao tác cùng lúc | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-425 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-011 | mỗi phiên bản chỉ nhận 1 quyết định | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-439 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-011 | double-submit chỉ 1 quyết định | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-442 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-011 | double-submit gửi điều chỉnh | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-493 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-011 | số V không trùng khi thao tác cùng lúc | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-586 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-012 | tự bù cảnh báo quá tháng dự kiến ký | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-623 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-012 | tác vụ lỗi cảnh báo vận hành | uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-624 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-012 | tác vụ hằng ngày hoàn tất trước 06:00 | uc-nhac-cap-nhat-hop-dong | — | — | excluded-approved | ngoài profile Core-functional — UAT 2026-10-03 (chờ BA duyệt ở L1) |
| NFR-phuong-an-kinh-doanh-012 | tự bù nhắc ngày lỡ | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| NFR-phuong-an-kinh-doanh-012 | chạy lại nhiều lần không gửi nhắc trùng | uc-nhac-cap-nhat-hop-dong | — | — | blocked | blocked — OQ-36 (kênh thông báo chủ động chưa chốt; nhắc chỉ bật khi có kênh) |
| NFR-phuong-an-kinh-doanh-013 | (a) ghi nhận thao tác bị từ chối quyền | chung | CHK-phuong-an-kinh-doanh-658 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-013 | (a) ghi nhận thao tác bị từ chối do trạng thái đổi | chung | CHK-phuong-an-kinh-doanh-659 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-013 | (b) ghi nhận lần ghi không trọn vẹn | chung | CHK-phuong-an-kinh-doanh-660 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-013 | (c) ghi nhận lỗi tác vụ hằng ngày | chung | CHK-phuong-an-kinh-doanh-661 | UI | covered | — |
| NFR-phuong-an-kinh-doanh-013 | tách khỏi tab Lịch sử | chung | CHK-phuong-an-kinh-doanh-662 | UI | covered | — |
| E-phuong-an-kinh-doanh-001 | message — Đã ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-303 | UI | covered | — |
| E-phuong-an-kinh-doanh-001 | message — Chưa ký | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-304 | UI | covered | — |
| E-phuong-an-kinh-doanh-001 | recovery — nhập rồi gửi lại | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-305 | UI | covered | — |
| E-phuong-an-kinh-doanh-002 | message — trống | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-306 | UI | covered | — |
| E-phuong-an-kinh-doanh-002 | message — bằng 0 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-307 | UI | covered | — |
| E-phuong-an-kinh-doanh-003 | message — thiếu Kết thúc | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-308 | UI | covered | — |
| E-phuong-an-kinh-doanh-003 | message — thiếu Bắt đầu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-309 | UI | covered | — |
| E-phuong-an-kinh-doanh-004 | message | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-310 | UI | covered | — |
| E-phuong-an-kinh-doanh-004 | BVA — cùng tháng hợp lệ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-311 | UI | covered | — |
| E-phuong-an-kinh-doanh-005 | screen state — Σ % chữ đỏ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-213 | UI | covered | — |
| E-phuong-an-kinh-doanh-005 | message | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-312 | UI | covered | — |
| E-phuong-an-kinh-doanh-005 | BVA — lệch đúng 0,01 hợp lệ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-313 | UI | covered | — |
| E-phuong-an-kinh-doanh-005 | BVA — lệch 0,1 báo lỗi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-314 | UI | covered | — |
| E-phuong-an-kinh-doanh-006 | message | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-315 | UI | covered | — |
| E-phuong-an-kinh-doanh-007 | message | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-316 | UI | covered | — |
| E-phuong-an-kinh-doanh-007 | negative — dòng không có giá trị không bắt tên | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-317 | UI | covered | — |
| E-phuong-an-kinh-doanh-008 | message | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-318 | UI | covered | — |
| E-phuong-an-kinh-doanh-009 | message — Giá trị dự kiến | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-319 | UI | covered | — |
| E-phuong-an-kinh-doanh-009 | message — Đánh giá rủi ro | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-320 | UI | covered | — |
| E-phuong-an-kinh-doanh-009 | 2 lỗi riêng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-321 | UI | covered | — |
| E-phuong-an-kinh-doanh-010 | message | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-322 | UI | covered | — |
| E-phuong-an-kinh-doanh-010 | giai đoạn có tiền nhưng thiếu tên | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-323 | UI | covered | — |
| E-phuong-an-kinh-doanh-011 | message | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-426 | UI | covered | — |
| E-phuong-an-kinh-doanh-011 | screen state — ô Ý kiến bắt buộc | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-427 | UI | covered | — |
| E-phuong-an-kinh-doanh-011 | side-effect — không lưu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-428 | UI | covered | — |
| E-phuong-an-kinh-doanh-011 | recovery — nhập ý kiến rồi từ chối lại | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-430 | UI | covered | — |
| E-phuong-an-kinh-doanh-011 | message — điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-555 | UI | covered | — |
| E-phuong-an-kinh-doanh-012 | message — tháng 13 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-262 | UI | covered | — |
| E-phuong-an-kinh-doanh-012 | recovery — giữ giá trị cũ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-263 | UI | covered | — |
| E-phuong-an-kinh-doanh-012 | BVA — tháng 0 | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-264 | UI | covered | — |
| E-phuong-an-kinh-doanh-012 | message — năm 2 chữ số | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-265 | UI | covered | — |
| E-phuong-an-kinh-doanh-013 | side-effect — cột ngoài kỳ tô vàng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-224 | UI | covered | — |
| E-phuong-an-kinh-doanh-013 | message | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-225 | UI | covered | — |
| E-phuong-an-kinh-doanh-013 | recovery — vẫn gửi được | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-325 | UI | covered | — |
| E-phuong-an-kinh-doanh-014 | message | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-222 | UI | covered | — |
| E-phuong-an-kinh-doanh-015 | message trên khung | uc-xem-pakd | CHK-phuong-an-kinh-doanh-114 | UI | covered | — |
| E-phuong-an-kinh-doanh-015 | screen state — ⚠ cam trên khung | uc-xem-pakd | CHK-phuong-an-kinh-doanh-120 | UI | covered | — |
| E-phuong-an-kinh-doanh-015 | không chặn gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-328 | UI | covered | — |
| E-phuong-an-kinh-doanh-015 | message trên P-04 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-376 | UI | covered | — |
| E-phuong-an-kinh-doanh-015 | recovery — Kế toán vẫn duyệt được | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-379 | UI | covered | — |
| E-phuong-an-kinh-doanh-015 | message trên P-04 — điều chỉnh | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-539 | UI | covered | — |
| E-phuong-an-kinh-doanh-016 | message "! Dưới khung" | uc-xem-pakd | CHK-phuong-an-kinh-doanh-078 | UI | covered | — |
| E-phuong-an-kinh-doanh-016 | không chặn gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-326 | UI | covered | — |
| E-phuong-an-kinh-doanh-016 | không chặn duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-401 | UI | covered | — |
| E-phuong-an-kinh-doanh-017 | message — thiếu Từ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-251 | UI | covered | — |
| E-phuong-an-kinh-doanh-017 | message — Đến trước Từ | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-252 | UI | covered | — |
| E-phuong-an-kinh-doanh-017 | recovery — vẫn gửi được | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-327 | UI | covered | — |
| E-phuong-an-kinh-doanh-018 | message khi truy cập dự án ngoài khối | uc-xem-pakd | CHK-phuong-an-kinh-doanh-008 | UI | covered | — |
| E-phuong-an-kinh-doanh-018 | message — thao tác ghi bị từ chối | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-346 | UI | covered | — |
| E-phuong-an-kinh-doanh-018 | side-effect — dữ liệu không đổi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-347 | UI | covered | — |
| E-phuong-an-kinh-doanh-018 | message — ghi quyết định không đủ quyền | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-365 | UI | covered | — |
| E-phuong-an-kinh-doanh-018 | message — ghi bản điều chỉnh không đủ quyền | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-494 | UI | covered | — |
| E-phuong-an-kinh-doanh-018 | message — lưu P-03 không đủ quyền | uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-570 | UI | covered | — |
| E-phuong-an-kinh-doanh-018 | screen state — vai trò chỉ xem không có báo lỗi | chung | CHK-phuong-an-kinh-doanh-632 | UI | covered | — |
| E-phuong-an-kinh-doanh-018 | side-effect — lần bị từ chối được ghi nhận | chung | CHK-phuong-an-kinh-doanh-658 | UI | covered | — |
| E-phuong-an-kinh-doanh-019 | message — Lưu nháp khi PAKD vừa được gửi | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-293 | UI | covered | — |
| E-phuong-an-kinh-doanh-019 | recovery — tự nạp lại dự án và khung | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-294 | UI | covered | — |
| E-phuong-an-kinh-doanh-019 | message — gửi khi dự án vừa Pending | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-348 | UI | covered | — |
| E-phuong-an-kinh-doanh-019 | recovery — khung nạp theo dữ liệu mới, bỏ phần chưa lưu | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-351 | UI | covered | — |
| E-phuong-an-kinh-doanh-019 | message — nội dung bản chờ đã đổi | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-389 | UI | covered | — |
| E-phuong-an-kinh-doanh-019 | recovery — P-04 giữ Ý kiến đang nhập | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-390 | UI | covered | — |
| E-phuong-an-kinh-doanh-019 | message — 2 Kế toán cùng quyết định | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-440 | UI | covered | — |
| E-phuong-an-kinh-doanh-019 | message — Lưu nháp điều chỉnh khi bản vừa được gửi | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-478 | UI | covered | — |
| E-phuong-an-kinh-doanh-019 | side-effect — lần bị từ chối được ghi nhận | chung | CHK-phuong-an-kinh-doanh-659 | UI | covered | — |
| E-phuong-an-kinh-doanh-020 | message | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-296 | UI | covered | — |
| E-phuong-an-kinh-doanh-020 | recovery — giữ dữ liệu đang nhập | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-297 | UI | covered | — |
| E-phuong-an-kinh-doanh-020 | bấm lại ghi đúng một lần | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-298 | UI | covered | — |
| E-phuong-an-kinh-doanh-020 | side-effect — dữ liệu giữ như trước | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-352 | UI | covered | — |
| E-phuong-an-kinh-doanh-020 | recovery — P-04 giữ Ý kiến | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-444 | UI | covered | — |
| E-phuong-an-kinh-doanh-020 | side-effect — Kết thúc không trọn vẹn thì không đổi | uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-523 | UI | covered | — |
| E-phuong-an-kinh-doanh-020 | mất kết nối — giữ dữ liệu | chung | CHK-phuong-an-kinh-doanh-655 | UI | covered | — |
| E-phuong-an-kinh-doanh-020 | side-effect — lần thất bại được ghi nhận | chung | CHK-phuong-an-kinh-doanh-660 | UI | covered | — |
| E-phuong-an-kinh-doanh-021 | message trong dải lỗi khung | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-275 | UI | covered | — |
| E-phuong-an-kinh-doanh-021 | message — tối đa 15 chữ số | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-280 | UI | covered | — |
| E-phuong-an-kinh-doanh-021 | message — tối đa 999 ngày | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-283 | UI | covered | — |
| E-phuong-an-kinh-doanh-021 | side-effect — không lưu, áp cả Lưu nháp | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-284 | UI | covered | — |
| E-phuong-an-kinh-doanh-021 | message trên P-04 | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-431 | UI | covered | — |
| E-phuong-an-kinh-doanh-022 | message — vượt 20 MB | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-270 | UI | covered | — |
| E-phuong-an-kinh-doanh-022 | message — sai định dạng | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-272 | UI | covered | — |
| E-phuong-an-kinh-doanh-022 | recovery — tệp hợp lệ khác vẫn nhận | uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-273 | UI | covered | — |
| E-phuong-an-kinh-doanh-023 | message — bản lần đầu | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-380 | UI | covered | — |
| E-phuong-an-kinh-doanh-023 | không chặn — Duyệt | uc-duyet-pakd | CHK-phuong-an-kinh-doanh-381 | UI | covered | — |
| E-phuong-an-kinh-doanh-023 | message — bản điều chỉnh sinh từ P-03 | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-540 | UI | covered | — |
| E-phuong-an-kinh-doanh-023 | recovery — từ chối kèm ý kiến để SM / GĐK sửa | uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-541 | UI | covered | — |
| E-phuong-an-kinh-doanh-024 | side-effect — phần đang sửa chưa lưu bị bỏ | uc-xem-pakd | CHK-phuong-an-kinh-doanh-018 | UI | covered | — |
| E-phuong-an-kinh-doanh-024 | message | uc-xem-pakd | CHK-phuong-an-kinh-doanh-019 | UI | covered | — |
| E-phuong-an-kinh-doanh-024 | negative — không hiện với thao tác của chính mình | uc-xem-pakd | CHK-phuong-an-kinh-doanh-022 | UI | covered | — |
| OQ-5 | baseline: phiên đăng nhập hết hạn khi Lưu nháp / Gửi / quyết định | chung | — | — | blocked | blocked — OQ-CHK-02 (spec chưa nêu hành vi khi phiên hết hạn; cơ chế tài khoản chờ OQ-5) |

**Câu hỏi mở chặn coverage:**

- OQ-36 (spec Mục 12) — kênh thông báo chủ động chưa chốt: toàn bộ phần gửi nhắc cập nhật hợp đồng (FR-phuong-an-kinh-doanh-039, BR-phuong-an-kinh-doanh-019, phần nhắc của NFR-phuong-an-kinh-doanh-012) để blocked.
- OQ-CHK-01 — FR-phuong-an-kinh-doanh-034 ghi nguyên văn: "Pending → "Pending" + ngày chuyển Pending (hoặc hạn)" nhưng không nêu khi nào hiện hạn thay ngày chuyển Pending; Q-52 (OQ-32) chỉ chốt nhánh bị từ chối, BR-phuong-an-kinh-doanh-005 / BR-phuong-an-kinh-doanh-042 không nói về Pending. Gợi ý tham khảo: `quan-ly-du-an-kinh-doanh` BR-quan-ly-du-an-kinh-doanh-024 ghi "Pending → "Pending" + ngày đóng" (không có nhánh hạn) — cần BA chốt bỏ "(hoặc hạn)" để đồng bộ.
- OQ-CHK-02 — hành vi khi phiên đăng nhập hết hạn lúc Lưu nháp / Gửi / Duyệt (giữ nội dung đang nhập? đăng nhập lại rồi tiếp tục?) — spec chưa nêu; cơ chế tài khoản chờ OQ-5.

## Tập UAT

| UC | CHK-ID | Nội dung | Ưu tiên |
|----|--------|----------|---------|
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-001 | SM mở dự án khối mình thấy khung PAKD | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-003 | Kế toán (CFO) xem được khung PAKD dự án mọi khối | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-006 | AM chỉ thấy dòng 🔒, không thấy số liệu PAKD | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-008 | SM mở dự án khối khác bị từ chối "Bạn không có quyền…" | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-010 | SM không thấy dự án khối khác trong danh sách | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-014 | Mở lại dự án thấy đúng PAKD đã Lưu nháp | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-035 | Bị từ chối lần đầu: "Thời gian còn lại" đếm tiếp theo hạn gốc | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-038 | Bản điều chỉnh chờ duyệt: nhãn "Chờ duyệt V2" | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-039 | Bản điều chỉnh bị từ chối: nhãn "Điều chỉnh bị từ chối" | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-042 | Chưa có phiên bản: nhãn "Chưa có PAKD" | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-043 | Lần đầu chờ duyệt: nhãn "Đã có PAKD · chờ Kế toán duyệt" | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-044 | Đã duyệt: nhãn "Đã duyệt" | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-045 | Bị từ chối lần đầu: nhãn "Từ chối — làm lại" | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-054 | Kế toán mở dự án "Chưa có PAKD": khung chỉ xem | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-055 | Dự án "PAKD chờ duyệt": SM chỉ xem khung | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-071 | Đã ký: Doanh thu kế hoạch = Giá trị hợp đồng | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-072 | Chưa ký: Doanh thu kế hoạch = Giá trị hợp đồng dự kiến | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-074 | Lợi nhuận = Doanh thu kế hoạch − tổng chi phí | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-077 | Biên lợi nhuận 20.0%: nhãn "▲ Đạt" | P2 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-078 | Biên lợi nhuận 19.9%: nhãn "! Dưới khung" | P2 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-099 | Luỹ kế dòng tiền = Dòng thu − Dòng chi + luỹ kế tháng trước | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-114 | Giá trị HĐ lệch doanh thu 2,01%: hiện "— đang lệch" và ⚠ | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-115 | Giá trị HĐ lệch đúng 2%: không cảnh báo | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-131 | Bị từ chối: cột Hạn lập "Làm lại V1" kèm số ngày còn lại | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-142 | Điều chỉnh bị từ chối: cột Hạn lập "Điều chỉnh bị từ chối dd/mm/yyyy" | P1 |
| uc-xem-pakd | CHK-phuong-an-kinh-doanh-143 | AM không thấy 3 cột PAKD ở danh sách | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-147 | SM thấy link "Lập PAKD" cho dự án "Chưa có PAKD" | P2 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-150 | SM thấy nút "Lưu nháp" · "Gửi Kế toán duyệt" trên đầu trang | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-153 | Kế toán không có nút "Lưu nháp" · "Gửi Kế toán duyệt" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-154 | Dòng thông báo "Dự án cần lập phương án kinh doanh (PAKD)…" kèm hạn lập | P2 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-156 | Bị từ chối: dòng thông báo "PAKD V1 bị từ chối ({ý kiến}) — cần lập lại." | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-165 | Dự án đã có hợp đồng: Mục 1 nạp sẵn thông tin hợp đồng | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-185 | Đổi Chưa ký → Đã ký: giai đoạn chuyển thành chi phí theo tháng | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-192 | Dự án đã ký: khoá lựa chọn "Chưa ký" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-202 | Giá trị mốc = Giá trị hợp đồng × % mốc | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-206 | Tháng thu tiền = tháng gửi hồ sơ + thời gian chờ | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-234 | "Cộng chi phí sản xuất" theo tháng = tổng khoản mục khối A | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-244 | Chia đều 10,000,000 cho 3 tháng: 3,333,000 · 3,333,000 · 3,334,000 | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-251 | Giai đoạn có tiền thiếu "Từ": cảnh báo cam | P2 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-258 | Ô tháng gõ "2/2027" tự thành "02/2027" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-270 | Tệp đính kèm 21 MB bị loại "vượt 20 MB" | P2 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-287 | Lưu nháp: toast "Đã lưu nháp PAKD" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-288 | Lưu nháp không kiểm tra trường bắt buộc | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-289 | Sau Lưu nháp: dự án vẫn "Chưa có PAKD", chưa có phiên bản | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-299 | Gửi thiếu bắt buộc: dải đỏ "Chưa gửi được — cần bổ sung:" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-303 | Thiếu Phạm vi công việc: báo "Nhập Phạm vi công việc" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-312 | Tổng % mốc 90: báo "Tổng % các mốc nghiệm thu phải bằng 100%…" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-315 | Không có chi phí: báo "Lập kế hoạch chi phí…" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-318 | Chưa ký thiếu tháng dự kiến ký: báo "Nhập Thời điểm dự kiến ký" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-326 | Biên lợi nhuận dưới 20% vẫn gửi được | P2 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-329 | Gửi hợp lệ: dự án chuyển "PAKD chờ duyệt" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-330 | Toast "Đã gửi PAKD V1 — chờ Kế toán (CFO) duyệt" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-332 | Lịch sử "Nộp PAKD" kèm doanh thu, chi phí | P2 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-333 | Sau gửi: khung chỉ xem, nhãn "Đã có PAKD · chờ Kế toán duyệt" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-335 | Sau gửi: cột "Giá trị hợp đồng dự kiến" vẫn "—" | P1 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-342 | Bị từ chối: khung mở lại cho sửa nội dung đã gửi | P2 |
| uc-lap-gui-pakd | CHK-phuong-an-kinh-doanh-343 | Gửi lại sau từ chối giữ số V1 | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-354 | Kế toán thấy link "Duyệt" ở dự án "PAKD chờ duyệt" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-360 | Nút "Duyệt / Từ chối PAKD" trên dòng thông báo mở P-04 | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-364 | SM không có link, nút duyệt | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-367 | P-04 hiện dự án, người nộp, doanh thu, chi phí, LN gộp, kế hoạch tháng | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-368 | Số liệu P-04 lấy từ PAKD đang chờ duyệt | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-376 | HĐ lệch 5%: P-04 cảnh báo "Giá trị HĐ hiện có … lệch … ⚠" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-380 | Bản chờ không đạt kiểm tra: P-04 hiện khối "Chưa đạt kiểm tra gửi:" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-387 | Cập nhật theo hợp đồng sau khi nộp: P-04 so sánh 8 trường với bản chụp | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-392 | Duyệt không cần nhập ý kiến | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-393 | Toast "Kế toán đã duyệt PAKD V1 — dự án chuyển "Đang thực hiện"" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-394 | Duyệt lần đầu: dự án chuyển "Đang thực hiện" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-395 | Duyệt: cột Phiên bản "V1, đã duyệt" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-402 | Dự án Pending được duyệt chuyển "Đang thực hiện" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-403 | Duyệt: "Giá trị hợp đồng dự kiến" = doanh thu PAKD | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-413 | Duyệt: kế hoạch theo tháng của dự án thay theo PAKD | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-417 | PAKD Đã ký, dự án chưa có HĐ: duyệt tạo hợp đồng từ PAKD | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-423 | Dự án đã có hợp đồng: duyệt không ghi đè hợp đồng | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-426 | Từ chối thiếu ý kiến: báo "Nhập lý do từ chối" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-432 | Toast "Kế toán đã từ chối PAKD V1 — trả về GĐK lập lại" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-433 | Từ chối lần đầu: dự án về "Chưa có PAKD" | P1 |
| uc-duyet-pakd | CHK-phuong-an-kinh-doanh-437 | Dự án Pending bị từ chối: giữ "Pending" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-447 | SM thấy nút "Sửa PAKD" ở dự án "Đang thực hiện" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-448 | Kế toán không thấy nút "Sửa PAKD" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-449 | Có bản điều chỉnh chờ duyệt: không có nút "Sửa PAKD" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-454 | Bấm "Sửa PAKD": khung chuyển chế độ điều chỉnh | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-463 | Đầu trang "Huỷ sửa" · "Lưu nháp" · "Gửi Kế toán duyệt điều chỉnh" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-466 | Bản đang áp dụng Đã ký: khoá "Chưa ký" khi điều chỉnh | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-469 | Lưu nháp điều chỉnh: toast "Đã lưu nháp bản điều chỉnh PAKD" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-483 | Gửi điều chỉnh thiếu bắt buộc: dải đỏ, không gửi | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-484 | Toast "Đã gửi bản điều chỉnh PAKD V2 — chờ Kế toán (CFO) duyệt lại" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-486 | Gửi điều chỉnh: "Giá trị hợp đồng dự kiến" vẫn theo V1 | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-487 | Gửi điều chỉnh: cột Phiên bản "V2, chờ CFO" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-501 | Huỷ bản điều chỉnh: toast "Đã huỷ bản điều chỉnh PAKD" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-502 | Sau huỷ: khung về PAKD đang áp dụng, nhãn "Đã duyệt" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-505 | Huỷ bản bị từ chối: cột Phiên bản về "V1, đã duyệt" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-511 | Bị từ chối: dải đỏ "Bản điều chỉnh V2 bị Kế toán từ chối…" | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-513 | "Tiếp tục sửa PAKD" mở lại bản bị từ chối | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-514 | Gửi lại bản điều chỉnh bị từ chối giữ số V2 | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-515 | Kết thúc dự án: hộp xác nhận báo bản điều chỉnh sẽ bị huỷ | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-518 | Xác nhận Kết thúc: bản điều chỉnh tự huỷ, khung về bản đang áp dụng | P1 |
| uc-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-521 | Có bản điều chỉnh chờ duyệt: không kết thúc được dự án | P2 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-524 | Kế toán thấy link "Duyệt điều chỉnh" ở danh sách | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-529 | Nút "Duyệt / Từ chối điều chỉnh" mở P-04 | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-533 | P-04 hiện Tình trạng hợp đồng "Chưa ký → Đã ký" | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-534 | P-04 hiện Doanh thu, Chi phí, LN gộp dạng cũ → mới | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-540 | Bản sinh từ P-03 không đạt kiểm tra: P-04 hiện "Chưa đạt kiểm tra gửi:" | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-543 | Toast "Kế toán đã duyệt bản điều chỉnh PAKD V2 — đã cập nhật số liệu dự án" | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-544 | Duyệt điều chỉnh: "Giá trị hợp đồng dự kiến" theo bản điều chỉnh | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-546 | Duyệt điều chỉnh: bản điều chỉnh thành PAKD đang áp dụng | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-550 | Duyệt điều chỉnh Đã ký, chưa có HĐ: tạo hợp đồng từ PAKD | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-554 | Điều chỉnh tiếp sau khi V2 duyệt mang số V3 | P2 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-556 | Toast "Kế toán đã từ chối bản điều chỉnh PAKD V2 — giữ bản đang áp dụng" | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-557 | Từ chối điều chỉnh: "Giá trị hợp đồng dự kiến" giữ theo V1 | P1 |
| uc-duyet-dieu-chinh-pakd | CHK-phuong-an-kinh-doanh-559 | Từ chối điều chỉnh: SM thấy "Điều chỉnh bị từ chối", bản còn để sửa | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-566 | SM lưu P-03 thành công | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-569 | AM chỉ xem P-03, không có nút lưu | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-572 | Đã có PAKD duyệt, lưu P-03 khác: sinh "V2, chờ CFO" | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-574 | Bản điều chỉnh sinh từ P-03 có Mục 1 theo hợp đồng | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-579 | Sau lưu P-03: "Giá trị hợp đồng dự kiến" giữ bản đang áp dụng | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-583 | Bản sinh từ P-03 không đạt kiểm tra vẫn "Chờ CFO" | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-587 | PAKD đang chờ duyệt: lưu P-03 cập nhật Mục 1 bản chờ | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-588 | PAKD đang chờ duyệt: lưu P-03 giữ "V1, chờ CFO" | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-589 | P-04 hiện nhãn "Cập nhật theo hợp đồng sau khi nộp" | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-596 | PAKD đang lập: lưu P-03 cập nhật Mục 1 theo hợp đồng | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-603 | Bản điều chỉnh nháp: lưu P-03 cập nhật Mục 1 theo hợp đồng | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-604 | Bản điều chỉnh nháp: phần đang soạn ở Mục 3, 4 giữ nguyên | P1 |
| uc-dong-bo-hop-dong-vao-pakd | CHK-phuong-an-kinh-doanh-611 | Hợp đồng không khác PAKD: không sinh bản điều chỉnh | P1 |
| uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-617 | Quá tháng dự kiến ký chưa có HĐ: chữ đỏ ở danh sách | P1 |
| uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-619 | AM cũng thấy chữ đỏ "Quá tháng dự kiến ký", không có số tiền | P1 |
| uc-nhac-cap-nhat-hop-dong | CHK-phuong-an-kinh-doanh-625 | Lưu P-03: chữ đỏ "Quá tháng dự kiến ký" mất ngay | P1 |
| chung | CHK-phuong-an-kinh-doanh-627 | AM không thấy dòng thao tác PAKD ở tab "Lịch sử" | P1 |
| chung | CHK-phuong-an-kinh-doanh-629 | AM không mở được Báo cáo hiệu quả dự án (MH-03) | P1 |
| chung | CHK-phuong-an-kinh-doanh-630 | SM Xuất Excel danh sách chỉ có dự án khối mình | P1 |

Tổng: 130 mục / 8 UC

## Retired CHK-IDs

> ID của item đã xóa — KHÔNG reuse, KHÔNG lấp gap. List máy-đọc (validator reject nếu item sống mang ID ở đây).

| CHK-ID | Retired date | Lý do |
|--------|--------------|-------|
