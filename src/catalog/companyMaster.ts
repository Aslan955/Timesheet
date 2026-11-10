/**
 * Kho dữ liệu gốc "Catalog > Company" — dùng chung cho:
 *  - màn Catalog > Company (CompanyPage)
 *  - Human Resources > Danh mục hợp đồng > tab Công ty (đọc từ đây, sửa thì ghi ngược về đây)
 */
import { useSyncExternalStore } from 'react';

export interface Company {
  id: string;
  code: string;
  name: string; // tên ngắn (hiển thị) — bên hợp đồng là "Tên viết tắt"
  address: string;
  description: string; // tên pháp lý đầy đủ — bên hợp đồng là "Tên công ty"
  taxCode: string;
  phone: string;
  email: string;
  bankAccount: string;
  bank: string;
  representative: string;
  isActive: boolean;
  signsContract: boolean; // Ký hợp đồng — pháp nhân dùng làm Bên A trên HĐ lao động (D-10)
  ver: number; // phiên bản bản ghi — tăng mỗi lần lưu/ngừng/xoá, dùng phát hiện xung đột sửa đồng thời
}

const SEED: Company[] = [
  { id: 'co-1', code: 'AEQ', name: 'AEQUITAS', address: 'Tầng 15, Tòa nhà CIC TOWER, số 2 ngõ 219 Phố Trung Kính, Phường Yên Hòa, Thành phố Hà Nội, Việt Nam', description: 'CÔNG TY CỔ PHẦN AEQUITAS', taxCode: '0108598427', phone: '024 3555 0404', email: 'contact@aequitas.vn', bankAccount: '68686868686868', bank: 'MB Bank', representative: 'Lê Hoài Thanh', isActive: true, signsContract: true, ver: 1 },
  { id: 'co-2', code: 'EDSO', name: 'EDSO LABS', address: 'Tầng 3, Tòa nhà Bamboo Airways, số 265 đường Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Thành phố Hà Nội, Việt Nam', description: 'CÔNG TY CỔ PHẦN EDSO LABS', taxCode: '', phone: '', email: '', bankAccount: '', bank: '', representative: 'Lê Hoài Thanh', isActive: true, signsContract: true, ver: 1 },
  { id: 'co-3', code: 'META', name: 'META SOLUTIONS', address: 'Số 86 ngõ 88, đường Đại Từ, Xã Hoàng Mai, Hà Nội', description: 'CÔNG TY CỔ PHẦN META SOLUTIONS', taxCode: '0108123456', phone: '024 3555 0101', email: 'contact@meta.vn', bankAccount: '19036123456011', bank: 'Techcombank', representative: 'Nguyễn Văn An', isActive: true, signsContract: false, ver: 1 },
  { id: 'co-4', code: 'BDA', name: 'BDA', address: 'Tầng 4, Tòa nhà Sannam, số 78 phố Duy Tân, Cầu Giấy, Hà Nội', description: 'CÔNG TY TNHH CÔNG NGHỆ CAO BDA', taxCode: '0109234567', phone: '024 3555 0202', email: 'contact@bda.vn', bankAccount: '12210009876543', bank: 'BIDV', representative: 'Trần Minh Đức', isActive: true, signsContract: false, ver: 1 },
  { id: 'co-5', code: 'SYNODUS', name: 'SYNODUS', address: 'Tầng 15, Tòa nhà CIC TOWER, số 2 ngõ 219 Trung Kính, Cầu Giấy, Hà Nội', description: 'CÔNG TY CỔ PHẦN SYNODUS', taxCode: '0110345678', phone: '024 3555 0303', email: 'contact@synodus.com', bankAccount: '0011004567890', bank: 'Vietcombank', representative: 'Lê Thị Hoa', isActive: true, signsContract: false, ver: 1 },
];

let MASTERS: Company[] = SEED;
const SUBS = new Set<() => void>();
export const getMasters = () => MASTERS;
export const updateMasters = (fn: (c: Company[]) => Company[]) => {
  const old = MASTERS;
  // Bản ghi đổi (khác tham chiếu) → tăng ver; bản ghi mới → ver 1
  MASTERS = fn(old).map((n) => { const o = old.find((x) => x.id === n.id); return o ? (o === n ? n : { ...n, ver: o.ver + 1 }) : { ...n, ver: 1 }; });
  [...SUBS].forEach((f) => f());
};
/** Đăng ký nhận thay đổi (không phải hook) — dùng cho kho danh mục hợp đồng đồng bộ ngược. */
export const subscribeMasters = (f: () => void) => (SUBS.add(f), () => void SUBS.delete(f));
export const useCompanies = () => useSyncExternalStore((cb) => subscribeMasters(cb), () => MASTERS);
