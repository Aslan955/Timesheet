/**
 * Dữ liệu chi tiết chi phí vận hành khối (đơn vị: VNĐ) dùng chung cho
 * tab "Chi phí vận hành chi tiết" và tab Vận hành khối.
 */
export interface OverheadItem {
  desc: string; // Diễn giải
  amount: number; // Số tiền (VNĐ)
  unit: string; // Mã đơn vị
  month: string; // Tháng (MM/YYYY)
  version?: string; // Phiên bản import
  user?: string; // Người import
}

export const OVERHEAD_DETAIL: Record<string, OverheadItem[]> = {
  G1: [
    { desc: 'Chi phí tiếp khách Ban giám đốc_G1', amount: 12_500_000, unit: 'G1', month: '01/2026' },
    { desc: 'Chi phí thuê văn phòng khối_G1', amount: 85_000_000, unit: 'G1', month: '01/2026' },
    { desc: 'Chi phí điện nước, internet_G1', amount: 9_800_000, unit: 'G1', month: '01/2026' },
    { desc: 'Chi phí công cụ dụng cụ_G1', amount: 6_200_000, unit: 'G1', month: '02/2026' },
  ],
  G2: [
    { desc: 'Chi phí thuê văn phòng khối_G2', amount: 72_000_000, unit: 'G2', month: '01/2026' },
    { desc: 'Chi phí tiếp khách_G2', amount: 8_400_000, unit: 'G2', month: '01/2026' },
  ],
  G3: [
    { desc: 'Chi phí thuê văn phòng khối_G3', amount: 60_000_000, unit: 'G3', month: '01/2026' },
    { desc: 'Chi phí marketing sự kiện_G3', amount: 25_300_000, unit: 'G3', month: '01/2026' },
  ],
  G4: [
    { desc: 'Chi phí tiếp khách anh Tuấn_G4', amount: 953_625, unit: 'G4', month: '01/2026' },
    { desc: 'Chi phí tiếp khách anh Tuấn_G4', amount: 1_842_750, unit: 'G4', month: '01/2027' },
    { desc: 'Chi phí thuê văn phòng khối_G4', amount: 55_000_000, unit: 'G4', month: '01/2026' },
  ],
  BFSI: [
    { desc: 'Chi phí thuê văn phòng khối_BFSI', amount: 48_000_000, unit: 'BFSI', month: '01/2026' },
    { desc: 'Chi phí tiếp khách đối tác_BFSI', amount: 15_600_000, unit: 'BFSI', month: '01/2026' },
  ],
  'Giải pháp - Dịch vụ': [
    { desc: 'Chi phí thuê văn phòng khối_GPDV', amount: 40_000_000, unit: 'GPDV', month: '01/2026' },
    { desc: 'Chi phí công tác_GPDV', amount: 11_200_000, unit: 'GPDV', month: '02/2026' },
  ],
};
