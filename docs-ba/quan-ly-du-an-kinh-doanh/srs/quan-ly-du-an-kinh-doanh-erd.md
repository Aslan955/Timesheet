---
type: srs-erd
feature: quan-ly-du-an-kinh-doanh
updated: 2026-10-03
---

# Quản lý dự án kinh doanh — Entity Relationship Diagram

> Scope: thực thể nghiệp vụ của màn Danh sách dự án (MH-02) và vòng đời dự án, trừ nội dung PAKD. Khoá trong sơ đồ là khoá **logic** để đọc quan hệ, không phải thiết kế cơ sở dữ liệu. Kiểu dữ liệu ghi gọn nghiệp vụ.

## Diagram

```mermaid
erDiagram
    KhachHang ||--o{ DuAn : "co nhieu du an"
    NhanSu ||--o{ DuAn : "la PM kinh doanh"
    NhanSu ||--o{ DuAn : "la PM san xuat"
    NhanSu ||--o{ AMCuaDuAn : "la AM"
    DuAn ||--o{ AMCuaDuAn : "co nhieu AM"
    MucTieuKhoi ||--o{ NhatKyMucTieu : "ghi vet moi lan luu hoac xoa o P-05"
    DuAn ||--o| HopDong : "co toi da 1 hop dong"
    HopDong ||--o{ PhuLucHopDong : "co phu luc"
    DuAn ||--o{ TepDinhKem : "tai lieu du an"
    HopDong ||--o{ TepDinhKem : "tep hop dong"
    PhuLucHopDong ||--o{ TepDinhKem : "tep phu luc"
    DuAn ||--o{ MaOutsource : "toi da 2 ma dang co"
    NhanSu ||--o{ MaOutsource : "la PM outsource"
    DuAn ||--o{ LichSuDuAn : "ghi lich su"
    DuAn ||--o| NhatKyXoa : "nhat ky khi xoa mem"
    DuAn ||--o{ SoLieuThang : "so thuc te theo thang"
    DuAn ||--o{ PhienBanPAKD : "phien ban PAKD (feature khac)"

    DuAn {
        chuoi id PK "ma noi bo"
        chuoi khach_hang_id FK "ma KH 3 ky tu"
        chuoi pm_kd_nhan_su_id FK "PM kinh doanh"
        chuoi pm_sx_nhan_su_id FK "PM san xuat"
        chuoi ten "bat buoc"
        logic trong_diem "KEY"
        so version "bat dau 1"
        chuoi trang_thai "7 trang thai"
        logic da_xoa "xoa mem"
        chuoi ma_tong "KH.STT toi da 999, trong khi chua cap"
        chuoi ma_kd "ma_tong.1"
        chuoi ma_sx "ma_tong.2"
        chuoi pm_outsource_mac_dinh "gan cho ma outsource moi"
        chuoi khoi "G1 G2 G3 G4 BFSI GPDV"
        chuoi loai_du_an "5 loai"
        chuoi gd_kinh_doanh "Giam doc kinh doanh"
        chuoi gd_khoi "Giam doc khoi"
        chuoi nguoi_tao "nguoi dung tao"
        ngay bat_dau "thoi gian du an"
        ngay ket_thuc "khong truoc bat dau"
        tien doanh_thu_du_kien "theo PAKD da duyet"
        tien chi_phi_kh_kd "theo PAKD da duyet"
        tien chi_phi_kh_sx "theo PAKD da duyet"
        logic da_ky_hd "co da ky"
        ngay du_kien_ky "theo PAKD da duyet"
        ngay ngay_cap_ma "GDK duyet hoac GDK tao"
        ngay han_lap_pakd "cap ma hoac mo lai Pending + 30"
        ngay ngay_dong "ngay chuyen Pending"
        chuoi ly_do_tu_choi_ma "bat buoc khi tu choi"
        chuoi ghi_chu "tuy chon"
        thoi_diem tao_luc "tao"
        thoi_diem cap_nhat_luc "cap nhat"
        chuoi import_thuc_te_tep "lan import gan nhat"
        chuoi import_thuc_te_boi "lan import gan nhat"
        thoi_diem import_thuc_te_luc "lan import gan nhat"
    }
    KhachHang {
        chuoi ma_kh PK "3 ky tu A-Z 0-9, danh muc IMIS"
        chuoi ten_kh "bat buoc"
        logic noi_bo "tuy chon"
        chuoi dia_chi "tuy chon"
        chuoi email "dung dang neu co"
        chuoi so_dien_thoai "tuy chon"
        chuoi mo_ta "tuy chon"
    }
    NhanSu {
        chuoi id PK "danh muc IMIS"
        chuoi ho_ten "ten hien thi"
        chuoi vai_tro "PM, GD, AM..."
    }
    AMCuaDuAn {
        chuoi du_an_id FK "du an"
        chuoi nhan_su_id FK "AM"
    }
    MucTieuKhoi {
        chuoi id PK "nam + khoi"
        chuoi nam "nam"
        chuoi khoi "khoi"
        tien muc_tieu "VND"
        chuoi nguon "BOD duyet hoac nhap tay"
        chuoi cap_nhat_boi "nguoi luu gan nhat"
        thoi_diem cap_nhat_luc "lan luu gan nhat"
    }
    NhatKyMucTieu {
        chuoi id PK "ma nhat ky"
        chuoi muc_tieu_khoi_id FK "nam + khoi"
        chuoi nguoi_luu "Ke toan"
        thoi_diem luc "thoi diem luu hoac xoa o P-05"
        tien gia_tri_cu "truoc khi luu, co the trong"
        tien gia_tri_moi "sau khi luu, trong khi xoa muc tieu"
    }
    HopDong {
        chuoi id PK "theo du an"
        chuoi du_an_id FK "1-1 voi du an"
        chuoi so_hd "bat buoc"
        ngay ngay_ky "bat buoc"
        tien gia_tri "bat buoc, khac 0"
        ngay tu_ngay "thoi han tu"
        ngay den_ngay "khong truoc tu"
        chuoi ly_do_lech "bat buoc khi lech qua 2%"
        thoi_diem cap_nhat_luc "lan cuoi"
        chuoi cap_nhat_boi "nguoi cap nhat"
    }
    PhuLucHopDong {
        chuoi id PK "ma phu luc"
        chuoi hop_dong_id FK "hop dong"
        chuoi so_phu_luc "bat buoc"
        ngay ngay_ky "bat buoc"
        chuoi noi_dung "tuy chon"
    }
    TepDinhKem {
        chuoi id PK "ma tep"
        chuoi du_an_id FK "mot trong ba chu so huu"
        chuoi hop_dong_id FK "mot trong ba chu so huu"
        chuoi phu_luc_hop_dong_id FK "mot trong ba chu so huu"
        chuoi ten "ten tep"
        so dung_luong "byte"
    }
    MaOutsource {
        chuoi ma PK "ma_tong + hau to, khong dung lai so"
        chuoi du_an_id FK "du an"
        chuoi pm_nhan_su_id FK "PM phu trach"
        thoi_diem tao_luc "ngay tao"
        chuoi tao_boi "nguoi tao"
        logic da_xoa "xoa mem, so khong cap lai"
        thoi_diem xoa_luc "khi xoa ma"
    }
    LichSuDuAn {
        chuoi id PK "ma dong lich su"
        chuoi du_an_id FK "du an"
        thoi_diem luc "thoi diem"
        chuoi boi "nguoi va vai tro hoac He thong"
        chuoi thao_tac "ten thao tac"
        chuoi ghi_chu "chi tiet"
    }
    NhatKyXoa {
        chuoi id PK "ma nhat ky"
        chuoi du_an_id FK "du an da xoa"
        chuoi nguoi_xoa "GDK"
        thoi_diem luc "thoi diem xoa"
        chuoi ly_do "bat buoc"
    }
    SoLieuThang {
        chuoi id PK "du an + thang"
        chuoi du_an_id FK "du an"
        chuoi thang "MM/YYYY"
        tien doanh_thu "import thuc te"
        tien thu "tu so ke toan"
        tien chi_sx "tu so ke toan"
        tien chi_kd "tu so ke toan"
        so klcv "SP, import thuc te"
    }
    PhienBanPAKD {
        chuoi id PK "phien ban"
        chuoi du_an_id FK "du an"
        so phien_ban "V1 V2"
        chuoi trang_thai "Nhap, Cho Ke toan, Da duyet, Tu choi, Da huy"
        logic dieu_chinh "ban dieu chinh"
    }
```

## Entity Reference

| Entity | Purpose | Key attributes |
|--------|---------|----------------|
| DuAn — Dự án | Một dự án kinh doanh từ lúc xin mở mã đến kết thúc; xoá là xoá mềm | trạng thái (7), cờ đã xoá, mã tổng / KD / SX, khách hàng, PM, khối, loại, hạn lập PAKD, ngày cấp mã, ngày đóng, lý do từ chối mã, version; số liệu kế hoạch (doanh thu / chi phí / ngày dự kiến ký) chỉ đồng bộ khi PAKD được Kế toán duyệt |
| KhachHang — Khách hàng | Danh mục khách hàng dùng chung của IMIS; P-01 thêm mới lưu đủ trường | mã KH (3 ký tự, không trùng), tên, nội bộ, địa chỉ, email, SĐT, mô tả |
| NhanSu — Nhân sự | Danh mục nhân sự dùng chung của IMIS, lọc theo vai trò khi chọn PM / Giám đốc / AM | họ tên, vai trò |
| AMCuaDuAn | Một dự án có nhiều AM | dự án, nhân sự |
| MucTieuKhoi — Mục tiêu khối | Mục tiêu giá trị HĐ ký theo năm × khối; từ BOD duyệt (MH-01) hoặc Kế toán nhập tay cho khối chưa có số BOD | năm, khối, mục tiêu, nguồn, người / thời điểm cập nhật |
| NhatKyMucTieu — Nhật ký mục tiêu khối | Vết mỗi lần Kế toán lưu hoặc xoá mục tiêu ở P-05 (không cần màn xem — Phase H Q-48) | người thao tác, thời điểm, năm × khối, giá trị cũ → mới (xoá: → trống) |
| HopDong — Hợp đồng | Thông tin ký hợp đồng (P-03) hoặc tạo ban đầu từ PAKD Đã ký được duyệt | số, ngày ký, giá trị, thời hạn, lý do lệch (bắt buộc khi lệch > 2%), người / thời điểm cập nhật |
| PhuLucHopDong — Phụ lục | Phụ lục điều chỉnh hợp đồng | số phụ lục, ngày ký, nội dung, tệp |
| TepDinhKem — Tệp đính kèm | Tệp của dự án / hợp đồng / phụ lục (mỗi tệp thuộc đúng một chủ sở hữu) | tên, dung lượng |
| MaOutsource — Mã outsource | Mã con kèm PM riêng; tối đa 2 mã đang có; mã đầu tiên `.3`, mã sau = hậu tố lớn nhất từng cấp + 1; mã xoá được đánh dấu đã xoá, số không cấp lại | mã, PM, người / ngày tạo, đã xoá, thời điểm xoá |
| LichSuDuAn — Lịch sử | Nhật ký thao tác trên dự án (tab Lịch sử), giữ vĩnh viễn | thời điểm, người (kèm vai trò) hoặc "Hệ thống", thao tác, ghi chú |
| NhatKyXoa — Nhật ký xoá | Bản ghi khi GĐK xoá mềm dự án | người xoá, thời điểm, lý do |
| SoLieuThang — Số liệu tháng thực tế | Số thực tế theo tháng của dự án: Doanh thu / KLCV do Kế toán import ở màn chi tiết; Thu / Chi SX / Chi KD từ Import sổ kế toán | tháng, doanh thu, thu, chi SX, chi KD, KLCV |
| PhienBanPAKD — Phiên bản PAKD | Tham chiếu: quyết định trạng thái dự án; đặc tả ở feature `phuong-an-kinh-doanh` | phiên bản, trạng thái (Nháp, Chờ Kế toán, Đã duyệt, Từ chối, Đã huỷ), bản điều chỉnh |

## Notes & Assumptions

- Dự án không gắn khoá với Mục tiêu khối: Sổ theo dõi so khớp logic theo khối của dự án + năm (năm ký / năm dự kiến ký) với mục tiêu cùng khối, cùng năm.
- Mã outsource bị xoá vẫn được giữ (đã xoá + thời điểm xoá) để không cấp lại số hậu tố và để sổ kế toán còn ghép được chi phí cũ.
- Ngoài PM kinh doanh / sản xuất, dự án còn tham chiếu Giám đốc kinh doanh, Giám đốc khối, PM outsource mặc định (cũng thuộc danh mục nhân sự) — không vẽ thêm quan hệ để sơ đồ gọn.
- Dự án đã xoá mềm vẫn còn trong dữ liệu (cờ `da_xoa`), kèm 1 bản ghi nhật ký xoá; không tính vào danh sách, Sổ theo dõi, Xuất Excel.
- Số liệu tháng **kế hoạch** thuộc PAKD được duyệt (feature `phuong-an-kinh-doanh` / `bao-cao-hieu-qua-du-an`) — không mô hình ở đây.
- Mã tổng / `.1` / `.2` và mã outsource được Import sổ kế toán dùng để ghép dòng sổ vào dự án (feature `bao-cao-hieu-qua-du-an`, reverse OQ-13).
- Không mô hình: nội dung PAKD, giai đoạn KH01–KH05 (đã loại bỏ).
