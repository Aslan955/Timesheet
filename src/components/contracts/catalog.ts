/**
 * catalog.ts — Danh mục dùng cho module Hợp đồng lao động:
 *  - Loại hợp đồng (nhóm Thử việc / Xác định thời hạn / Không xác định thời hạn, thời hạn cho phép, mặc định…)
 *  - Công ty (pháp nhân ký hợp đồng)
 *  - Loại phụ lục hợp đồng
 *  - Template Word (.docx) cho hợp đồng / phụ lục, có trường trộn {{...}}
 * Màn Hợp đồng đọc trực tiếp các danh mục này (loại HĐ, thời hạn, công ty ký, in HĐ theo template).
 * Dữ liệu mẫu là giả lập.
 */
import { useSyncExternalStore } from 'react';
import { buildDocx, inspectDocx, type BuildBlock } from './docx';

export type Kind = 'TV' | 'XD' | 'KXD' | 'OTHER';
export const KINDS: Kind[] = ['TV', 'XD', 'KXD', 'OTHER'];
export const KIND_LABEL: Record<Kind, string> = { TV: 'Thử việc', XD: 'Xác định thời hạn', KXD: 'Không xác định thời hạn', OTHER: 'Khác (học việc, thực tập, dịch vụ)' };
export const KIND_SHORT: Record<Kind, string> = { TV: 'Thử việc', XD: 'Xác định', KXD: 'Không XĐ', OTHER: 'Khác' };
export const KIND_COLOR: Record<Kind, string> = { KXD: '#3b5bdb', XD: '#a855f7', TV: '#f43f5e', OTHER: '#0d9488' };
export const KIND_CLS: Record<Kind, string> = {
  TV: 'bg-rose-50 text-rose-700 border-rose-300',
  XD: 'bg-violet-50 text-violet-700 border-violet-300',
  KXD: 'bg-indigo-50 text-indigo-700 border-indigo-300',
  OTHER: 'bg-teal-50 text-teal-700 border-teal-300',
};
/** Thời hạn được chọn trong danh mục (tháng). */
export const TERM_OPTIONS = [1, 2, 3, 6, 9, 12, 18, 24, 36];
export const termLabel = (m: number) => (m % 12 === 0 ? `${m / 12} năm` : `${m} tháng`);
export const KIND_MAX: Record<Kind, number> = { TV: 6, XD: 36, KXD: 0, OTHER: 36 };

export interface ContractTypeDef {
  id: string;
  code: string;
  name: string;
  kind: Kind;
  suffix: string; // ký hiệu cuối số HĐ: «Mã_NV»/AEQUITAS/HDCT
  terms: number[]; // tháng
  defTerm: number; // 0 = không có
  rate: number; // mức hưởng mặc định %
  insurance: boolean; // tham gia BHXH/BHYT/BHTN mặc định
  order: number;
  active: boolean;
  note: string;
}
export interface CompanyDef {
  id: string;
  code: string;
  name: string;
  shortName: string;
  contractCode: string; // ký hiệu công ty trong số HĐ: «Mã_NV»/AEQUITAS/HDCT
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  legalRep: string;
  legalRepTitle: string;
  legalRepSalutation: string; // Ông / Bà
  bankAccount: string;
  bankName: string;
  isDefault: boolean;
  active: boolean;
  note: string;
}
export const APPENDIX_FIELDS = ['Tiền lương', 'Phụ cấp', 'Vị trí / chức danh', 'Đơn vị công tác', 'Nơi làm việc', 'Thời gian làm việc', 'Thời hạn hợp đồng', 'Nội dung khác'];
export interface AppendixTypeDef {
  id: string;
  code: string;
  name: string;
  changes: string[];
  order: number;
  active: boolean;
  note: string;
}
export type TplKind = 'HD' | 'KT' | 'PL';
export const TPL_KIND_LABEL: Record<TplKind, string> = { HD: 'Hợp đồng', KT: 'Văn bản kèm theo HĐ', PL: 'Phụ lục hợp đồng' };
export interface TplLog {
  at: string;
  by: string;
  action: string;
}
export interface TemplateDef {
  id: string;
  code: string;
  name: string;
  kind: TplKind;
  appliesTo: string[]; // id loại HĐ (HD) hoặc id loại phụ lục (PL)
  companyId: string; // '' = mọi công ty
  fileName: string;
  size: number;
  data: Uint8Array | null;
  fileUrl?: string; // file mẫu có sẵn (tải khi mở ứng dụng)
  fields: string[];
  uploadedAt: string;
  uploadedBy: string;
  active: boolean;
  note: string;
  history: TplLog[];
}
export type Catalog = { types: ContractTypeDef[]; companies: CompanyDef[]; appendix: AppendixTypeDef[]; templates: TemplateDef[] };

// ==========================================================================
// Trường trộn — đặt tên theo bộ mẫu hợp đồng AEQUITAS (trường trộn thư của Word «Tên_trường»).
// Trong file Word dùng được 2 cách: chèn trường Word (Insert → Quick Parts → Field → MergeField) hoặc gõ {{Tên_trường}}.
// ==========================================================================
export interface FieldDef {
  key: string;
  label: string;
  group: string;
  sample: string;
}
export const FIELD_GROUPS = ['Người lao động', 'Hợp đồng', 'Lương & hỗ trợ', 'Người ký', 'Phụ lục', 'Công ty', 'Khác'];
export const FIELDS: FieldDef[] = [
  { group: 'Người lao động', key: 'Mã_NV', label: 'Mã nhân viên — ghép số HĐ «Mã_NV»/AEQUITAS/HDCT', sample: 'NV1016' },
  { group: 'Người lao động', key: 'Họ_và_tên', label: 'Họ và tên (IN HOA)', sample: 'TRẦN VĂN CƯỜNG' },
  { group: 'Người lao động', key: 'Họ_và_tên2', label: 'Họ và tên (chữ thường)', sample: 'Trần Văn Cường' },
  { group: 'Người lao động', key: 'Họ_tên_1', label: 'Như «Họ_và_tên»', sample: 'TRẦN VĂN CƯỜNG' },
  { group: 'Người lao động', key: 'Xưng_hô_NLĐ', label: 'Ông / Bà (theo giới tính người lao động)', sample: 'Ông' },
  { group: 'Người lao động', key: 'Giới_tính', label: 'Giới tính', sample: 'Nam' },
  { group: 'Người lao động', key: 'Bday', label: 'Ngày sinh', sample: '11/06/1994' },
  { group: 'Người lao động', key: 'Ngày_sinh', label: 'Như «Bday»', sample: '11/06/1994' },
  { group: 'Người lao động', key: 'BOD_text', label: 'Như «Bday»', sample: '11/06/1994' },
  { group: 'Người lao động', key: 'Số_CMNDCCCD_Hộ_chiếu', label: 'Số CCCD / Hộ chiếu', sample: '001094000000' },
  { group: 'Người lao động', key: 'Date_of_Issue', label: 'Ngày cấp CCCD / Hộ chiếu', sample: '15/08/2021' },
  { group: 'Người lao động', key: 'Ngày_cấp', label: 'Như «Date_of_Issue»', sample: '15/08/2021' },
  { group: 'Người lao động', key: 'Ngày_cấp_text', label: 'Như «Date_of_Issue»', sample: '15/08/2021' },
  { group: 'Người lao động', key: 'Nơi_cấp', label: 'Nơi cấp', sample: 'Cục Cảnh sát QLHC về TTXH' },
  { group: 'Người lao động', key: 'Địa_chỉ_thường_trú', label: 'Nơi đăng ký hộ khẩu / thường trú', sample: 'Hải Châu, Đà Nẵng' },
  { group: 'Người lao động', key: 'Nơi_ở_hiện_tại', label: 'Nơi ở hiện tại / tạm trú', sample: 'Cầu Giấy, Hà Nội' },
  { group: 'Người lao động', key: 'SĐT', label: 'Số điện thoại', sample: '0900 000 116' },
  { group: 'Người lao động', key: 'Ngày_vào_làm', label: 'Ngày vào làm', sample: '20/09/2026' },
  { group: 'Hợp đồng', key: 'Số_hợp_đồng', label: 'Số hợp đồng đầy đủ', sample: 'NV1016/AEQUITAS/HDCT' },
  { group: 'Hợp đồng', key: 'Loại_hợp_đồng', label: 'Loại hợp đồng', sample: 'Hợp đồng xác định thời hạn' },
  { group: 'Hợp đồng', key: 'Contract_start', label: 'Ngày bắt đầu / có hiệu lực của hợp đồng', sample: '20/09/2026' },
  { group: 'Hợp đồng', key: 'Contract_end', label: 'Ngày kết thúc hợp đồng (trống nếu không thời hạn)', sample: '19/09/2027' },
  { group: 'Hợp đồng', key: 'Số_tháng_HD', label: 'Số tháng của hợp đồng', sample: '12' },
  { group: 'Hợp đồng', key: 'Thời_hạn', label: 'Thời hạn', sample: '1 năm' },
  { group: 'Hợp đồng', key: 'Ngày_ký', label: 'Ngày ký hợp đồng', sample: '20/09/2026' },
  { group: 'Hợp đồng', key: 'Nơi_ký', label: 'Nơi ký', sample: 'Hà Nội' },
  { group: 'Hợp đồng', key: 'Đơn_vị', label: 'Bộ phận công tác (đơn vị)', sample: 'Phòng Tài chính – Kế toán' },
  { group: 'Hợp đồng', key: 'Vị_trí_công_việc', label: 'Chức danh chuyên môn / vị trí công việc', sample: 'Kế toán tổng hợp' },
  { group: 'Hợp đồng', key: 'Nơi_làm_việc', label: 'Địa điểm làm việc', sample: 'Văn phòng Hà Nội' },
  { group: 'Hợp đồng', key: 'Thời_gian_làm_việc', label: 'Thời gian làm việc', sample: 'Giờ hành chính (8h/ngày, T2–T6)' },
  { group: 'Hợp đồng', key: 'Mô_tả_công_việc', label: 'Công việc phải làm', sample: '' },
  { group: 'Hợp đồng', key: 'Bảo_hiểm', label: 'Bảo hiểm tham gia', sample: 'BHXH, BHYT, BHTN' },
  { group: 'Hợp đồng', key: 'Ghi_chú', label: 'Ghi chú', sample: '' },
  { group: 'Lương & hỗ trợ', key: 'Lương_Cơ_bản', label: 'Mức lương (= lương gốc × mức hưởng)', sample: '15,000,000' },
  { group: 'Lương & hỗ trợ', key: 'LCB_bằng_chữ', label: 'Mức lương bằng chữ', sample: 'Mười lăm triệu đồng' },
  { group: 'Lương & hỗ trợ', key: 'Lương_gốc', label: 'Lương cơ bản gốc (100%)', sample: '15,000,000' },
  { group: 'Lương & hỗ trợ', key: 'Mức_hưởng', label: 'Mức hưởng (%)', sample: '100' },
  { group: 'Lương & hỗ trợ', key: 'Trợ_cấp_ăn_trưa', label: 'Hỗ trợ ăn trưa', sample: '730,000' },
  { group: 'Lương & hỗ trợ', key: 'Trợ_cấp_xăng_xe', label: 'Hỗ trợ xăng xe', sample: '500,000' },
  { group: 'Lương & hỗ trợ', key: 'Trợ_cấp_điện_thoại', label: 'Hỗ trợ điện thoại', sample: '300,000' },
  { group: 'Lương & hỗ trợ', key: 'Trợ_cấp_nhà_ở', label: 'Hỗ trợ nhà ở', sample: '0' },
  { group: 'Lương & hỗ trợ', key: 'HQCV_tạm_tính', label: 'Thưởng hiệu quả công việc (tạm tính)', sample: '2,000,000' },
  { group: 'Lương & hỗ trợ', key: 'HQCV', label: 'Như «HQCV_tạm_tính»', sample: '2,000,000' },
  { group: 'Lương & hỗ trợ', key: 'Tổng_hỗ_trợ', label: 'Tổng các khoản hỗ trợ', sample: '1,530,000' },
  { group: 'Lương & hỗ trợ', key: 'Tổng_thu_nhập', label: 'Lương + hỗ trợ + thưởng hiệu quả', sample: '18,530,000' },
  { group: 'Người ký', key: 'Xưng_hô', label: 'Ông / Bà của người đại diện ký', sample: 'Ông' },
  { group: 'Người ký', key: 'Người_đại_diện_ký', label: 'Người đại diện ký', sample: 'Lê Hoài Thanh' },
  { group: 'Người ký', key: 'Người_ký', label: 'Như «Người_đại_diện_ký»', sample: 'Lê Hoài Thanh' },
  { group: 'Người ký', key: 'Chức_vụ', label: 'Chức vụ người đại diện ký', sample: 'Giám đốc' },
  { group: 'Người ký', key: 'Giấy_ủy_quyền', label: 'Giấy uỷ quyền (nếu có)', sample: '' },
  { group: 'Phụ lục', key: 'Mã_Hợp_đồng_hiện_tại', label: 'Số hợp đồng đang áp dụng', sample: 'NV1016/AEQUITAS/HDCT' },
  { group: 'Phụ lục', key: 'DS_Nhân_viênMã_NV_cũ1', label: 'Mã NV — ghép số HĐ đang áp dụng «…»/AEQUITAS/HDCT', sample: 'NV1016' },
  { group: 'Phụ lục', key: 'Ngày_bắt_đầu_HD', label: 'Ngày bắt đầu hợp đồng đang áp dụng', sample: '20/09/2026' },
  { group: 'Phụ lục', key: 'Ngày_ký_HD_hiện_tại_text', label: 'Ngày ký hợp đồng đang áp dụng', sample: '20/09/2026' },
  { group: 'Phụ lục', key: 'Ngày_áp_dụng_text', label: 'Ngày áp dụng phụ lục', sample: '01/11/2026' },
  { group: 'Phụ lục', key: 'Ngày_ký_Phụ_lục_điều_chỉnh', label: 'Như «Ngày_áp_dụng_text»', sample: '01/11/2026' },
  { group: 'Phụ lục', key: 'Tên_phụ_lục', label: 'Tên loại phụ lục', sample: 'Phụ lục điều chỉnh lương' },
  { group: 'Phụ lục', key: 'Nội_dung_điều_chỉnh', label: 'Nội dung điều chỉnh', sample: 'Tiền lương, Phụ cấp' },
  { group: 'Công ty', key: 'Tên_công_ty', label: 'Tên công ty', sample: 'CÔNG TY CỔ PHẦN AEQUITAS' },
  { group: 'Công ty', key: 'Tên_viết_tắt', label: 'Tên viết tắt', sample: 'AEQUITAS' },
  { group: 'Công ty', key: 'Mã_số_thuế', label: 'Mã số thuế', sample: '0108598427' },
  { group: 'Công ty', key: 'Địa_chỉ_công_ty', label: 'Địa chỉ trụ sở', sample: 'Tầng 15, Tòa nhà CIC TOWER…' },
  { group: 'Công ty', key: 'Điện_thoại_công_ty', label: 'Điện thoại công ty', sample: '' },
  { group: 'Công ty', key: 'Đại_diện_pháp_luật', label: 'Người đại diện theo pháp luật', sample: 'Lê Hoài Thanh' },
  { group: 'Khác', key: 'Ngày_in', label: 'Ngày in', sample: '23/10/2026' },
];
export const FIELD_KEYS = new Set(FIELDS.map((f) => f.key.normalize('NFC')));
export const fieldLabel = (k: string) => FIELDS.find((f) => f.key === k)?.label || k;

// ==========================================================================
// Dữ liệu ban đầu — theo bộ mẫu hợp đồng của công ty
// ==========================================================================
const ME = 'hr.lan';
const T0 = '2026-10-23T02:00:00.000Z';
const TYPES_SEED: ContractTypeDef[] = [
  { id: 'ct-tv', code: 'HDTV', name: 'Hợp đồng thử việc', kind: 'TV', suffix: 'HDTV', terms: [1, 2], defTerm: 2, rate: 85, insurance: false, order: 1, active: true, note: 'Thời gian thử việc tối đa 60 ngày (180 ngày với quản lý doanh nghiệp).' },
  { id: 'ct-xd', code: 'HDXD', name: 'Hợp đồng xác định thời hạn', kind: 'XD', suffix: 'HDCT', terms: [6, 12, 24, 36], defTerm: 12, rate: 100, insurance: true, order: 2, active: true, note: 'Thời hạn không quá 36 tháng; ký tối đa 2 lần trước khi chuyển không xác định thời hạn.' },
  { id: 'ct-kxd', code: 'HDKXD', name: 'Hợp đồng không xác định thời hạn', kind: 'KXD', suffix: 'HDCT', terms: [], defTerm: 0, rate: 100, insurance: true, order: 3, active: true, note: '' },
  { id: 'ct-hv', code: 'HDHV', name: 'Hợp đồng học việc', kind: 'OTHER', suffix: 'HDHV', terms: [1, 2, 3], defTerm: 3, rate: 100, insurance: false, order: 4, active: true, note: 'Học việc tại công ty, được hỗ trợ một khoản tiền hằng tháng.' },
  { id: 'ct-tt', code: 'HDTT', name: 'Hợp đồng thực tập', kind: 'OTHER', suffix: 'HDTT', terms: [1, 2, 3, 6], defTerm: 3, rate: 100, insurance: false, order: 5, active: true, note: 'Sinh viên thực tập.' },
  { id: 'ct-dv', code: 'HDDV', name: 'Hợp đồng dịch vụ', kind: 'OTHER', suffix: 'HDDV', terms: [1, 3, 6, 12], defTerm: 3, rate: 100, insurance: false, order: 6, active: true, note: 'Hợp đồng dân sự — cộng tác / cung ứng dịch vụ theo hạng mục, nghiệm thu khi hoàn thành.' },
];
const COMPANIES_SEED: CompanyDef[] = [
  {
    id: 'co-1', code: 'AEQ', name: 'CÔNG TY CỔ PHẦN AEQUITAS', shortName: 'AEQUITAS', contractCode: 'AEQUITAS', taxCode: '0108598427',
    address: 'Tầng 15, Tòa nhà CIC TOWER, số 2 ngõ 219 Phố Trung Kính, Phường Yên Hòa, Thành phố Hà Nội, Việt Nam', phone: '', email: '',
    legalRep: 'Lê Hoài Thanh', legalRepTitle: 'Giám đốc', legalRepSalutation: 'Ông', bankAccount: '', bankName: '', isDefault: true, active: true, note: 'Theo bộ mẫu hợp đồng AEQUITAS',
  },
  {
    id: 'co-2', code: 'EDSO', name: 'CÔNG TY CỔ PHẦN EDSO LABS', shortName: 'EDSO LABS', contractCode: 'EDSOLABS', taxCode: '',
    address: 'Tầng 3, Tòa nhà Bamboo Airways, số 265 đường Cầu Giấy, Phường Dịch Vọng, Quận Cầu Giấy, Thành phố Hà Nội, Việt Nam', phone: '', email: '',
    legalRep: 'Lê Hoài Thanh', legalRepTitle: 'Giám đốc', legalRepSalutation: 'Ông', bankAccount: '', bankName: '', isDefault: false, active: true,
    note: 'Theo “Mẫu Edso”. Mẫu đang ghi mã số thuế giống AEQUITAS (0108598427) — cần bổ sung mã số thuế đúng của EDSO LABS.',
  },
];
const APPENDIX_SEED: AppendixTypeDef[] = [
  { id: 'pl-01', code: 'PL01', name: 'Phụ lục điều chỉnh lương', changes: ['Tiền lương', 'Phụ cấp'], order: 1, active: true, note: 'Điều chỉnh các khoản hỗ trợ và thưởng hiệu quả' },
  { id: 'pl-02', code: 'PL02', name: 'Phụ lục điều chỉnh chức vụ & lương', changes: ['Vị trí / chức danh', 'Tiền lương', 'Phụ cấp'], order: 2, active: true, note: '' },
  { id: 'pl-03', code: 'PL03', name: 'Phụ lục điều chỉnh bộ phận & lương', changes: ['Đơn vị công tác', 'Tiền lương', 'Phụ cấp'], order: 3, active: true, note: '' },
  { id: 'pl-04', code: 'PL04', name: 'Phụ lục điều chỉnh điều khoản hợp đồng', changes: ['Nội dung khác'], order: 4, active: true, note: '' },
];

// ---- Bộ mẫu Word của công ty (đã kiểm tra trường trộn) -------------------------------------
import urlHdtv from './templates/aeq-hdtv.docx?url';
import urlHdxd from './templates/aeq-hd-xac-dinh-thoi-han.docx?url';
import urlHdkxd from './templates/aeq-hd-khong-xac-dinh-thoi-han.docx?url';
import urlNda from './templates/aeq-nda.docx?url';
import urlPlLuong from './templates/aeq-pl-dieu-chinh-luong.docx?url';
import urlPlChucVu from './templates/aeq-pl-dieu-chinh-chuc-vu-luong.docx?url';
import urlPlBoPhan from './templates/aeq-pl-dieu-chinh-bo-phan-luong.docx?url';
import urlPlDieuKhoan from './templates/aeq-pl-dieu-chinh-dieu-khoan.docx?url';
import urlHddv from './templates/aeq-hd-dich-vu.docx?url';
import urlHdhv from './templates/aeq-hd-hoc-viec.docx?url';
import urlHdtt from './templates/aeq-hd-thuc-tap.docx?url';
import urlEdso from './templates/edso-hd-lao-dong.docx?url';
import { TEMPLATE_FIXES } from './templates/fixes';

const mkTpl = (id: string, code: string, name: string, kind: TplKind, appliesTo: string[], companyId: string, fileName: string, fileUrl: string, note = ''): TemplateDef => {
  // khớp tên file (dev: aeq-hdtv.docx · bản build: aeq-hdtv-<mã>.docx)
  const key = Object.keys(TEMPLATE_FIXES)
    .filter((k) => new RegExp(`/${k.replace('.docx', '')}[.-][^/]*$`).test(fileUrl))
    .sort((a, b) => b.length - a.length)[0];
  const fixes = (key && TEMPLATE_FIXES[key]) || [];
  return {
  id,
  code,
  name,
  kind,
  appliesTo,
  companyId,
  fileName,
  size: 0,
  data: null,
  fileUrl,
  fields: [],
  uploadedAt: T0,
  uploadedBy: ME,
  active: true,
  note,
  history: [{ at: T0, by: ME, action: `Tải lên file ${fileName}` }, ...(fixes.length ? [{ at: T0, by: ME, action: `Chỉnh file khi đưa vào hệ thống (${fixes.length} chỗ): ${fixes.join('; ')}` }] : [])],
  };
};
const TEMPLATES_SEED = (): TemplateDef[] => [
  mkTpl('tp-hdtv', 'AEQ-HDTV', 'Hợp đồng thử việc', 'HD', ['ct-tv'], 'co-1', '1.1. AEQ_HDTV.docx', urlHdtv, 'Kèm Phụ lục 01 — các khoản hỗ trợ'),
  mkTpl('tp-hdxd', 'AEQ-HDXD', 'Hợp đồng lao động xác định thời hạn', 'HD', ['ct-xd'], 'co-1', '2.1. AEQ_HĐ xác định thời hạn 1.docx', urlHdxd, 'Kèm Phụ lục 01 — các khoản hỗ trợ'),
  mkTpl('tp-hdkxd', 'AEQ-HDKXD', 'Hợp đồng lao động không xác định thời hạn', 'HD', ['ct-kxd'], 'co-1', '4. AEQ_HĐ không xác định thời hạn.docx', urlHdkxd, 'Kèm Phụ lục 01 — các khoản hỗ trợ'),
  mkTpl('tp-nda', 'AEQ-NDA', 'Thỏa thuận bảo mật thông tin (NDA)', 'KT', ['ct-tv', 'ct-xd'], 'co-1', '5. AEQ_NDA.docx', urlNda, 'In kèm khi In HĐ thử việc / xác định thời hạn. Số: «Mã_NV»/TTBMTT/AEQUITAS'),
  mkTpl('tp-pl-luong', 'AEQ-PL-LUONG', 'Phụ lục điều chỉnh lương', 'PL', ['pl-01'], 'co-1', '7. AEQ_Phụ lục điều chỉnh lương.docx', urlPlLuong),
  mkTpl('tp-pl-cv', 'AEQ-PL-CV', 'Phụ lục điều chỉnh chức vụ & lương', 'PL', ['pl-02'], 'co-1', '7.1 AEQ_Phụ lục điều chỉnh chức vụ  lương.docx', urlPlChucVu, 'Chức danh, mức lương lấy theo hợp đồng đang áp dụng; ngày áp dụng chọn khi in'),
  mkTpl('tp-pl-bp', 'AEQ-PL-BP', 'Phụ lục điều chỉnh bộ phận & lương', 'PL', ['pl-03'], 'co-1', '7.2 AEQ_Phụ lục điều chỉnh bộ phận  lương.docx', urlPlBoPhan),
  mkTpl('tp-pl-dk', 'AEQ-PL-DK', 'Phụ lục điều chỉnh điều khoản hợp đồng', 'PL', ['pl-04'], 'co-1', 'Mẫu Phụ lục điều chỉnh điều khoản HD.docx', urlPlDieuKhoan),
  mkTpl('tp-hddv', 'AEQ-HDDV', 'Hợp đồng dịch vụ', 'HD', ['ct-dv'], 'co-1', '8. AEQ BM_HDDV update 3103.docx', urlHddv, 'Bảng hạng mục công việc, tiêu chuẩn nghiệm thu và biên bản nghiệm thu điền tay'),
  mkTpl('tp-hdhv', 'AEQ-HDHV', 'Hợp đồng học việc', 'HD', ['ct-hv'], 'co-1', '9. AEQ_HĐ Học việc.docx', urlHdhv, ''),
  mkTpl('tp-hdtt', 'AEQ-HDTT', 'Hợp đồng thực tập', 'HD', ['ct-tt'], 'co-1', '9.1 AEQ_HĐ Thực tập.docx', urlHdtt, ''),
  mkTpl('tp-edso', 'EDSO-HDLD', 'Hợp đồng lao động (EDSO LABS)', 'HD', ['ct-kxd'], 'co-2', 'Mẫu Edso.docx', urlEdso, 'Template riêng của công ty EDSO LABS — HĐ không xác định thời hạn'),
];
/** File Word liệt kê toàn bộ trường trộn — tải về để soạn mẫu mới. */
export const SAMPLE_FILES = {
  allFields: () =>
    buildDocx([
      { t: 'DANH SÁCH TRƯỜNG TRỘN — TEMPLATE HỢP ĐỒNG', b: true, c: true, sz: 28, after: 120 },
      { t: 'Chèn trường Word (Insert → Quick Parts → Field → MergeField) hoặc gõ tên trường trong cặp ngoặc nhọn đôi, ví dụ {{Họ_và_tên}}. Khi in, hệ thống thay bằng dữ liệu của hợp đồng.', i: true, after: 200 },
      ...FIELD_GROUPS.flatMap((g): BuildBlock[] => [{ t: g, b: true, after: 40 }, ...FIELDS.filter((f) => f.group === g).map((f): BuildBlock => ({ t: `${f.label}: {{${f.key}}}`, after: 20 }))]),
    ]),
};

// ==========================================================================
// Kho dữ liệu danh mục
// ==========================================================================
let CAT: Catalog = { types: TYPES_SEED, companies: COMPANIES_SEED, appendix: APPENDIX_SEED, templates: TEMPLATES_SEED() };
const SUBS = new Set<() => void>();
export const getCatalog = () => CAT;
export const updateCatalog = (fn: (c: Catalog) => Catalog) => {
  CAT = fn(CAT);
  SUBS.forEach((f) => f());
};
export const useCatalog = () => useSyncExternalStore((cb) => (SUBS.add(cb), () => void SUBS.delete(cb)), () => CAT);
/** Tải bộ mẫu Word có sẵn và đọc trường trộn. */
export const templatesReady: Promise<void> = Promise.all(
  CAT.templates
    .filter((t) => t.fileUrl && !t.data)
    .map(async (t) => {
      const data = new Uint8Array(await (await fetch(t.fileUrl!)).arrayBuffer());
      return { id: t.id, data, size: data.length, fields: (await inspectDocx(data)).fields };
    }),
)
  .then((rs) => updateCatalog((c) => ({ ...c, templates: c.templates.map((t) => ({ ...t, ...(rs.find((r) => r.id === t.id) || {}) })) })))
  .catch((e) => console.warn('Không tải được bộ mẫu hợp đồng', e));

// ==========================================================================
// Tra cứu dùng ở màn Hợp đồng
// ==========================================================================
const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;
export const typeDef = (name: string) => CAT.types.find((t) => t.name === name);
export const typeById = (id: string) => CAT.types.find((t) => t.id === id);
export const kindOf = (name: string): Kind => typeDef(name)?.kind || (/thử việc/i.test(name) ? 'TV' : /không xác định/i.test(name) ? 'KXD' : 'XD');
export const isK = (name: string, k: Kind) => kindOf(name) === k;
/** Tên các loại HĐ (theo thứ tự). all = gồm cả loại ngừng sử dụng. */
export const typeNames = (all = false) => [...CAT.types].filter((t) => all || t.active).sort(byOrder).map((t) => t.name);
export const termsOf = (name: string) => (typeDef(name)?.terms || []).map((m) => ({ label: termLabel(m), months: m }));
export const defaultTerm = (name: string) => {
  const d = typeDef(name);
  return d && d.kind !== 'KXD' && d.defTerm ? termLabel(d.defTerm) : '';
};
export const rateOf = (name: string) => typeDef(name)?.rate ?? (isK(name, 'TV') ? 85 : 100);
export const insuranceOf = (name: string) => typeDef(name)?.insurance ?? !isK(name, 'TV');
export const colorOf = (name: string) => KIND_COLOR[kindOf(name)];
export const shortOf = (name: string) => {
  const s = name.replace(/^hợp đồng\s+/i, '');
  return s.charAt(0).toUpperCase() + s.slice(1);
};
/** Loại HĐ mặc định của 1 nhóm (loại đang dùng, thứ tự nhỏ nhất). */
export const defaultTypeOf = (k: Kind) => [...CAT.types].filter((t) => t.kind === k && t.active).sort(byOrder)[0]?.name || [...CAT.types].filter((t) => t.kind === k).sort(byOrder)[0]?.name || '';

export const companyById = (id: string) => CAT.companies.find((c) => c.id === id);
export const defaultCompanyId = () => (CAT.companies.find((c) => c.isDefault && c.active) || CAT.companies.find((c) => c.active))?.id || '';
export const activeCompanies = (keep = '') => CAT.companies.filter((c) => c.active || c.id === keep);

/** Template áp dụng: đang dùng, đúng loại (HĐ / phụ lục), ưu tiên template riêng của công ty. */
export const findTemplate = (kind: TplKind, targetId: string | undefined, companyId: string) =>
  targetId
    ? CAT.templates
        .filter((t) => t.active && t.kind === kind && t.data && t.appliesTo.includes(targetId) && (!t.companyId || t.companyId === companyId))
        .sort((a, b) => Number(!!b.companyId) - Number(!!a.companyId))[0]
    : undefined;
export const templateForType = (typeName: string, companyId: string) => findTemplate('HD', typeDef(typeName)?.id, companyId);
/** Văn bản in kèm hợp đồng (vd Thỏa thuận bảo mật) — mọi template KT đang dùng khớp loại HĐ + công ty. */
export const attachmentsFor = (typeName: string, companyId: string) => {
  const id = typeDef(typeName)?.id;
  return id ? CAT.templates.filter((t) => t.active && t.kind === 'KT' && t.data && t.appliesTo.includes(id) && (!t.companyId || t.companyId === companyId)) : [];
};
/** Ký hiệu số HĐ: «Mã_NV»/«ký hiệu công ty»/«ký hiệu loại HĐ». */
export const contractNoBase = (empCode: string, companyId: string, typeName: string) =>
  `${empCode}/${companyById(companyId)?.contractCode || 'CT'}/${typeDef(typeName)?.suffix || 'HD'}`;
