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
/** Danh mục người ký hợp đồng — 1 công ty có thể có nhiều người ký (người đại diện theo pháp luật, người được uỷ quyền). */
export interface SignerDef {
  id: string;
  code: string;
  companyId: string;
  salutation: string; // Ông / Bà
  name: string; // họ tên người ký
  employeeCode?: string; // mã nhân viên (chọn từ danh sách Employees)
  title: string; // chức danh
  authorization: string; // số / ngày giấy uỷ quyền (để trống nếu là người đại diện theo pháp luật)
  isDefault: boolean; // người ký mặc định của công ty
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
export type Catalog = { types: ContractTypeDef[]; companies: CompanyDef[]; signers: SignerDef[]; appendix: AppendixTypeDef[]; templates: TemplateDef[] };

// ==========================================================================
// Trường trộn — theo danh sách chuẩn "DS trường trộn_v2" (trường trộn thư của Word «Tên_trường»).
// Trong file Word dùng được 2 cách: chèn trường Word (Insert → Quick Parts → Field → MergeField) hoặc gõ {{Tên_trường}}.
// ==========================================================================
export interface FieldDef {
  key: string;
  label: string; // tên gọi chuẩn
  group: string;
  sample: string;
  desc?: string; // diễn giải
  format?: string; // định dạng dữ liệu
  legacyOf?: string; // tên cũ — cùng dữ liệu với trường mới này
}
/** Danh sách trường trộn chuẩn (DS trường trộn_v2) + tên cũ của bộ mẫu trước đây (vẫn trộn được). */
export const FIELD_GROUPS = ["I. Thông tin người lao động", "II. Thông tin hợp đồng & công việc", "III. Tiền lương & các khoản hỗ trợ", "IV. Người đại diện ký (bên sử dụng lao động)", "V. Phụ lục hợp đồng", "VI. Thông tin công ty (bên sử dụng lao động)", "VII. Thông tin khác", "Tên cũ (mẫu Word cũ vẫn dùng được)"];
export const FIELDS: FieldDef[] = [
  { group: "I. Thông tin người lao động", key: "Mã_NV", label: "Mã nhân viên", desc: "Mã nhân viên trên hệ thống", sample: "NV1016", format: "Văn bản – IN HOA, viết liền, không dấu cách" },
  { group: "I. Thông tin người lao động", key: "HỌ_VÀ_TÊN_NLĐ_IN_HOA", label: "HỌ VÀ TÊN NLĐ (IN HOA)", desc: "Họ và tên người lao động, in hoa toàn bộ", sample: "TRẦN VĂN CƯỜNG", format: "Văn bản – IN HOA toàn bộ" },
  { group: "I. Thông tin người lao động", key: "Họ_và_tên_nlđ", label: "Họ và tên người lao động (viết thường)", desc: "Họ và tên người lao động, viết hoa chữ cái đầu mỗi từ", sample: "Trần Văn Cường", format: "Văn bản – viết hoa chữ cái đầu mỗi từ" },
  { group: "I. Thông tin người lao động", key: "Xưng_hô_NLĐ", label: "Danh xưng người lao động", desc: "Ông hoặc Bà, theo giới tính người lao động", sample: "Ông", format: "Danh mục – Ông | Bà" },
  { group: "I. Thông tin người lao động", key: "Giới_tính", label: "Giới tính", desc: "Giới tính của người lao động", sample: "Nam", format: "Danh mục – Nam | Nữ" },
  { group: "I. Thông tin người lao động", key: "Ngày_sinh", label: "Ngày sinh (dd/mm/yyyy)", desc: "Ngày sinh của người lao động", sample: "11/06/1994", format: "Ngày – dd/mm/yyyy" },
  { group: "I. Thông tin người lao động", key: "Ngày_sinh_text", label: "Ngày sinh (ngày … tháng … năm …)", desc: "Như {{Ngày_sinh}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 11 tháng 6 năm 1994", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "I. Thông tin người lao động", key: "Quốc_tịch", label: "Quốc tịch", desc: "Quốc tịch của người lao động", sample: "Việt Nam", format: "Văn bản – viết hoa chữ cái đầu mỗi từ" },
  { group: "I. Thông tin người lao động", key: "CCCD_Hộ_chiếu", label: "Số Căn cước/CCCD/Hộ chiếu", desc: "Số thẻ Căn cước, CCCD (12 chữ số) hoặc số hộ chiếu", sample: "001094000000", format: "Chuỗi ký tự – giữ số 0 đầu, viết liền không dấu cách" },
  { group: "I. Thông tin người lao động", key: "Ngày_cấp_giấy_tờ_NLĐ", label: "Ngày cấp giấy tờ tùy thân (dd/mm/yyyy)", desc: "Ngày cấp thẻ Căn cước, CCCD hoặc hộ chiếu", sample: "15/08/2021", format: "Ngày – dd/mm/yyyy" },
  { group: "I. Thông tin người lao động", key: "Ngày_cấp_giấy_tờ_NLĐ_text", label: "Ngày cấp giấy tờ tùy thân (ngày … tháng … năm …)", desc: "Như {{Ngày_cấp_giấy_tờ_NLĐ}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 15 tháng 8 năm 2021", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "I. Thông tin người lao động", key: "Nơi_cấp_giấy_tờ_NLĐ", label: "Nơi cấp giấy tờ tùy thân", desc: "Cơ quan cấp, ghi đúng như trên giấy tờ", sample: "Cục Cảnh sát quản lý hành chính về trật tự xã hội", format: "Văn bản – viết hoa chữ cái đầu, ghi đầy đủ tên cơ quan, không viết tắt" },
  { group: "I. Thông tin người lao động", key: "Địa_chỉ_thường_trú", label: "Nơi thường trú", desc: "Địa chỉ thường trú theo đơn vị hành chính", sample: "Số 25 đường Lê Duẩn, phường Hải Châu, thành phố Đà Nẵng", format: "Văn bản – Số nhà, đường/phố/thôn/tổ, phường/xã/đặc khu, tỉnh/thành phố" },
  { group: "I. Thông tin người lao động", key: "Nơi_ở_hiện_tại", label: "Chỗ ở hiện tại", desc: "Địa chỉ nơi đang ở; ghi như nơi thường trú nếu trùng", sample: "Số 12 ngõ 175 phố Xuân Thủy, phường Cầu Giấy, thành phố Hà Nội", format: "Văn bản – Số nhà, đường/phố/thôn/tổ, phường/xã/đặc khu, tỉnh/thành phố" },
  { group: "I. Thông tin người lao động", key: "SĐT_NLĐ", label: "Số điện thoại người lao động", desc: "Số điện thoại di động liên hệ", sample: "0900 000 116", format: "Chuỗi số – 10 chữ số, giữ số 0 đầu, nhóm 4-3-3" },
  { group: "I. Thông tin người lao động", key: "Email_NLĐ", label: "Email người lao động", desc: "Email cá nhân", sample: "tranvancuong@email.com", format: "Văn bản – chữ thường, không dấu, không khoảng trắng" },
  { group: "I. Thông tin người lao động", key: "Trình_độ_chuyên_môn", label: "Trình độ chuyên môn", desc: "Trình độ đào tạo và chuyên ngành cao nhất", sample: "Cử nhân Kế toán", format: "Văn bản – viết hoa chữ cái đầu" },
  { group: "I. Thông tin người lao động", key: "Số_giấy_phép_lao_động", label: "Số giấy phép lao động", desc: "Chỉ áp dụng người lao động nước ngoài; để trống với người lao động Việt Nam", sample: "", format: "Văn bản – IN HOA, ghi đúng số trên giấy phép" },
  { group: "I. Thông tin người lao động", key: "Số_tài_khoản", label: "Số tài khoản nhận lương", desc: "Số tài khoản ngân hàng nhận lương của người lao động", sample: "0123456789", format: "Chuỗi số – giữ số 0 đầu, viết liền không dấu cách" },
  { group: "I. Thông tin người lao động", key: "Ngân_hàng", label: "Ngân hàng nhận lương", desc: "Tên ngân hàng và chi nhánh mở tài khoản", sample: "Vietcombank – Chi nhánh Hà Nội", format: "Văn bản – \"Tên ngân hàng – Chi nhánh\"" },
  { group: "I. Thông tin người lao động", key: "Ngày_vào_làm", label: "Ngày bắt đầu làm việc (dd/mm/yyyy)", desc: "Ngày người lao động bắt đầu làm việc tại công ty", sample: "20/09/2026", format: "Ngày – dd/mm/yyyy" },
  { group: "I. Thông tin người lao động", key: "Ngày_vào_làm_text", label: "Ngày bắt đầu làm việc (ngày … tháng … năm …)", desc: "Như {{Ngày_vào_làm}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 20 tháng 9 năm 2026", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Số_hợp_đồng", label: "Số hợp đồng", desc: "Số hiệu hợp đồng do hệ thống cấp", sample: "NV1016/AEQUITAS/HDCT", format: "Văn bản – IN HOA, theo quy tắc đánh số hợp đồng của công ty" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Loại_hợp_đồng", label: "Loại hợp đồng", desc: "Loại hợp đồng giao kết", sample: "Hợp đồng lao động xác định thời hạn", format: "Danh mục – Hợp đồng lao động xác định thời hạn | Hợp đồng lao động không xác định thời hạn | Hợp đồng thử việc | Hợp đồng học việc | Hợp đồng thực tập | Hợp đồng dịch vụ" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Ngày_ký", label: "Ngày ký hợp đồng (dd/mm/yyyy)", desc: "Ngày hai bên ký hợp đồng", sample: "20/09/2026", format: "Ngày – dd/mm/yyyy" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Ngày_ký_text", label: "Ngày ký hợp đồng  (ngày … tháng … năm …)", desc: "Như {{Ngày_ký}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 20 tháng 9 năm 2026", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Nơi_ký", label: "Địa điểm ký kết", desc: "Tỉnh/thành phố nơi ký, dùng ở dòng địa danh đầu văn bản", sample: "Hà Nội", format: "Văn bản – tên tỉnh/thành phố, không kèm chữ \"thành phố\"" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Contract_start", label: "Ngày hiệu lực hợp đồng (dd/mm/yyyy)", desc: "Ngày hợp đồng bắt đầu có hiệu lực", sample: "20/09/2026", format: "Ngày – dd/mm/yyyy" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Contract_start_text", label: "Ngày hiệu lực hợp đồng (ngày … tháng … năm …)", desc: "Như {{Contract_start}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 20 tháng 9 năm 2026", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Contract_end", label: "Ngày hết hạn hợp đồng (dd/mm/yyyy)", desc: "Ngày hợp đồng hết hiệu lực; để trống với HĐLĐ không xác định thời hạn", sample: "19/09/2027", format: "Ngày – dd/mm/yyyy" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Contract_end_text", label: "Ngày hết hạn hợp đồng (ngày … tháng … năm …)", desc: "Như {{Contract_end}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 19 tháng 9 năm 2027", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Số_tháng_HD", label: "Thời hạn hợp đồng (số tháng)", desc: "Số tháng của thời hạn hợp đồng; để trống với HĐLĐ không xác định thời hạn", sample: "12", format: "Số nguyên – không kèm đơn vị" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Đơn_vị", label: "Đơn vị/Bộ phận công tác", desc: "Phòng, ban, bộ phận người lao động trực thuộc", sample: "Phòng Tài chính – Kế toán", format: "Văn bản – viết hoa chữ cái đầu" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Vị_trí_công_việc", label: "Chức danh chuyên môn", desc: "Chức danh, vị trí công việc người lao động đảm nhận", sample: "Kế toán tổng hợp", format: "Văn bản – viết hoa chữ cái đầu" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Cấp_bậc", label: "Cấp bậc", desc: "Cấp bậc chức danh và bậc lương theo thang, bảng lương", sample: "Chuyên viên – Bậc 3", format: "Văn bản – \"Cấp bậc – Bậc\"" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Quản_lý_trực_tiếp", label: "Quản lý trực tiếp", desc: "Họ tên và chức danh người quản lý trực tiếp", sample: "Nguyễn Thị Lan – Kế toán trưởng", format: "Văn bản – \"Họ tên – Chức danh\"" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Nơi_làm_việc", label: "Địa điểm làm việc", desc: "Địa chỉ nơi người lao động làm việc", sample: "Tầng 15, Tòa nhà CIC Tower, số 2 Nguyễn Thị Duệ, phường Yên Hòa, thành phố Hà Nội", format: "Văn bản – Số nhà, đường/phố/thôn/tổ, phường/xã/đặc khu, tỉnh/thành phố" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Hình_thức_làm_việc", label: "Hình thức làm việc", desc: "Toàn thời gian hoặc không trọn thời gian", sample: "Toàn thời gian", format: "Danh mục – Toàn thời gian | Không trọn thời gian" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Thời_gian_làm_việc", label: "Thời giờ làm việc", desc: "Số giờ làm việc và ngày làm việc trong tuần", sample: "8 giờ/ngày, 40 giờ/tuần, từ thứ Hai đến thứ Sáu", format: "Văn bản – viết hoa chữ cái đầu" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Mô_tả_công_việc", label: "Mô tả công việc", desc: "Nhiệm vụ chính của người lao động", sample: "- Lập báo cáo tài chính hằng tháng\n- Kiểm soát chứng từ thu, chi", format: "Văn bản nhiều dòng – mỗi nhiệm vụ một dòng, bắt đầu bằng \"- \"" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Bảo_hiểm", label: "Chế độ bảo hiểm bắt buộc", desc: "Các loại bảo hiểm bắt buộc người lao động tham gia", sample: "Bảo hiểm xã hội, bảo hiểm y tế, bảo hiểm thất nghiệp", format: "Văn bản – viết hoa chữ cái đầu, ghi đầy đủ tên, ngăn cách bằng dấu phẩy" },
  { group: "II. Thông tin hợp đồng & công việc", key: "Ghi_chú", label: "Thỏa thuận khác", desc: "Nội dung thỏa thuận khác (nếu có); để trống nếu không có", sample: "Áp dụng Quy chế lương, thưởng hiện hành của Công ty", format: "Văn bản – viết hoa chữ cái đầu" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Lương_Cơ_bản", label: "Mức lương cơ bản", desc: "Mức lương theo hợp đồng (đã áp dụng tỷ lệ hưởng)", sample: "15.000.000", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "LCB_bằng_chữ", label: "Mức lương cơ bản (bằng chữ)", desc: "Mức lương cơ bản viết bằng chữ", sample: "Mười lăm triệu đồng", format: "Văn bản – số tiền bằng chữ, viết hoa chữ cái đầu, kết thúc bằng \"đồng\"" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Mức_hưởng", label: "Tỷ lệ hưởng lương", desc: "Tỷ lệ % mức lương được hưởng (thử việc tối thiểu 85%)", sample: "100%", format: "Tỷ lệ – số nguyên kèm ký hiệu \"%\", không dấu cách" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Phụ_cấp_trách_nhiệm", label: "Phụ cấp trách nhiệm", desc: "Phụ cấp lương theo chức danh, trách nhiệm (tính đóng BHXH)", sample: "0", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Hỗ_trợ_ăn_trưa", label: "Hỗ trợ ăn trưa", desc: "Khoản hỗ trợ ăn trưa hằng tháng", sample: "730.000", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Hỗ_trợ_xăng_xe", label: "Hỗ trợ xăng xe", desc: "Khoản hỗ trợ xăng xe hằng tháng", sample: "500.000", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Hỗ_trợ_điện_thoại", label: "Hỗ trợ điện thoại", desc: "Khoản hỗ trợ điện thoại hằng tháng", sample: "300.000", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Hỗ_trợ_nhà_ở", label: "Hỗ trợ nhà ở", desc: "Khoản hỗ trợ nhà ở hằng tháng", sample: "0", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "HQCV_tạm_tính", label: "Thưởng hiệu quả công việc (tạm tính)", desc: "Mức thưởng hiệu quả công việc dự kiến; thực nhận theo kết quả đánh giá", sample: "2.000.000", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Tổng_hỗ_trợ", label: "Tổng các khoản hỗ trợ", desc: "Tổng hỗ trợ ăn trưa, xăng xe, điện thoại, nhà ở", sample: "1.530.000", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Tổng_thu_nhập", label: "Tổng thu nhập", desc: "Mức lương cơ bản + phụ cấp + tổng hỗ trợ + thưởng hiệu quả tạm tính", sample: "18.530.000", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Tổng_thu_nhập_bằng_chữ", label: "Tổng thu nhập (bằng chữ)", desc: "Tổng thu nhập viết bằng chữ", sample: "Mười tám triệu năm trăm ba mươi nghìn đồng", format: "Văn bản – số tiền bằng chữ, viết hoa chữ cái đầu, kết thúc bằng \"đồng\"" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Hình_thức_trả_lương", label: "Hình thức trả lương", desc: "Cách thức chi trả lương", sample: "Chuyển khoản", format: "Danh mục – Chuyển khoản | Tiền mặt" },
  { group: "III. Tiền lương & các khoản hỗ trợ", key: "Kỳ_hạn_trả_lương", label: "Thời hạn trả lương", desc: "Ngày trả lương cố định hằng tháng", sample: "ngày 10 hằng tháng", format: "Văn bản – chữ thường, \"ngày dd hằng tháng\"" },
  { group: "IV. Người đại diện ký (bên sử dụng lao động)", key: "Xưng_hô", label: "Danh xưng người đại diện ký", desc: "Ông hoặc Bà, theo giới tính người đại diện ký", sample: "Ông", format: "Danh mục – Ông | Bà" },
  { group: "IV. Người đại diện ký (bên sử dụng lao động)", key: "NGƯỜI_ĐẠI_DIỆN_KÝ_IN_HOA", label: "HỌ TÊN NGƯỜI ĐẠI DIỆN KÝ (IN HOA)", desc: "Họ tên người đại diện ký, in hoa toàn bộ", sample: "LÊ HOÀI THANH", format: "Văn bản – IN HOA toàn bộ" },
  { group: "IV. Người đại diện ký (bên sử dụng lao động)", key: "Người_đại_diện_ký", label: "Họ tên người đại diện ký (viết thường)", desc: "Họ tên người đại diện ký, viết hoa chữ cái đầu mỗi từ", sample: "Lê Hoài Thanh", format: "Văn bản – viết hoa chữ cái đầu mỗi từ" },
  { group: "IV. Người đại diện ký (bên sử dụng lao động)", key: "Chức_vụ", label: "Chức vụ người đại diện ký", desc: "Chức vụ người đại diện ký, viết hoa chữ cái đầu", sample: "Giám đốc", format: "Văn bản – viết hoa chữ cái đầu" },
  { group: "IV. Người đại diện ký (bên sử dụng lao động)", key: "Giấy_ủy_quyền", label: "Văn bản ủy quyền ký", desc: "Số, ngày văn bản ủy quyền; để trống khi người đại diện theo pháp luật trực tiếp ký", sample: "", format: "Văn bản – \"Giấy ủy quyền số … ngày dd/mm/yyyy\"" },
  { group: "V. Phụ lục hợp đồng", key: "Số_phụ_lục", label: "Số phụ lục", desc: "Số hiệu của phụ lục hợp đồng", sample: "01/2026/PLHĐ-NV1016", format: "Văn bản – IN HOA, theo quy tắc đánh số phụ lục của công ty" },
  { group: "V. Phụ lục hợp đồng", key: "Tên_phụ_lục", label: "Tên phụ lục", desc: "Tên loại phụ lục", sample: "Phụ lục điều chỉnh tiền lương", format: "Văn bản – viết hoa chữ cái đầu" },
  { group: "V. Phụ lục hợp đồng", key: "Mã_Hợp_đồng_hiện_tại", label: "Số hợp đồng đang áp dụng", desc: "Số của hợp đồng được sửa đổi, bổ sung bởi phụ lục", sample: "NV1016/AEQUITAS/HDCT", format: "Văn bản – IN HOA, theo quy tắc đánh số hợp đồng của công ty" },
  { group: "V. Phụ lục hợp đồng", key: "Ngày_ký_HD_hiện_tại", label: "Ngày ký hợp đồng đang áp dụng (dd/mm/yyyy)", desc: "Ngày ký hợp đồng được sửa đổi", sample: "20/09/2026", format: "Ngày – dd/mm/yyyy" },
  { group: "V. Phụ lục hợp đồng", key: "Ngày_ký_HD_hiện_tại_text", label: "Ngày ký hợp đồng đang áp dụng  (ngày … tháng … năm …)", desc: "Như {{Ngày_ký_HD_hiện_tại_text}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 20 tháng 9 năm 2026", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "V. Phụ lục hợp đồng", key: "Ngày_bắt_đầu_HD", label: "Ngày hiệu lực hợp đồng đang áp dụng (dd/mm/yyyy)", desc: "Ngày bắt đầu hiệu lực của hợp đồng được sửa đổi", sample: "20/09/2026", format: "Ngày – dd/mm/yyyy" },
  { group: "V. Phụ lục hợp đồng", key: "Ngày_bắt_đầu_HD_text", label: "Ngày hiệu lực hợp đồng đang áp dụng (ngày … tháng … năm …)", desc: "Như {{Ngày_bắt_đầu_HD}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 20 tháng 9 năm 2026", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "V. Phụ lục hợp đồng", key: "Ngày_ký_Phụ_lục_điều_chỉnh", label: "Ngày ký phụ lục (dd/mm/yyyy)", desc: "Ngày hai bên ký phụ lục (có thể khác ngày hiệu lực)", sample: "25/10/2026", format: "Ngày – dd/mm/yyyy" },
  { group: "V. Phụ lục hợp đồng", key: "Ngày_ký_Phụ_lục_điều_chỉnh_text", label: "Ngày ký phụ lục (ngày … tháng … năm …)", desc: "Như {{Ngày_ký_Phụ_lục_điều_chỉnh}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 25 tháng 10 năm 2026", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "V. Phụ lục hợp đồng", key: "Ngày_áp_dụng", label: "Ngày hiệu lực phụ lục (dd/mm/yyyy)", desc: "Ngày nội dung phụ lục bắt đầu áp dụng", sample: "01/11/2026", format: "Ngày – dd/mm/yyyy" },
  { group: "V. Phụ lục hợp đồng", key: "Ngày_áp_dụng_text", label: "Ngày hiệu lực phụ lục (ngày … tháng … năm …)", desc: "Như {{Ngày_áp_dụng_text}}, trình bày dạng \"ngày … tháng … năm …\"", sample: "ngày 01 tháng 11 năm 2026", format: "Ngày – \"ngày dd tháng m năm yyyy\" (ngày < 10 và tháng 1, 2 thêm số 0 phía trước)" },
  { group: "V. Phụ lục hợp đồng", key: "Nội_dung_điều_chỉnh", label: "Nội dung sửa đổi, bổ sung", desc: "Các nội dung được thay đổi trong phụ lục", sample: "Tiền lương, phụ cấp", format: "Văn bản – viết hoa chữ cái đầu, ngăn cách bằng dấu phẩy" },
  { group: "V. Phụ lục hợp đồng", key: "Lương_cũ", label: "Mức lương trước điều chỉnh", desc: "Mức lương cơ bản trước khi ký phụ lục", sample: "13.000.000", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
  { group: "V. Phụ lục hợp đồng", key: "Vị_trí_công_việc_cũ", label: "Chức danh trước điều chỉnh", desc: "Chức danh, vị trí công việc trước khi ký phụ lục", sample: "Kế toán viên", format: "Văn bản – viết hoa chữ cái đầu" },
  { group: "V. Phụ lục hợp đồng", key: "Đơn_vị_cũ", label: "Bộ phận trước điều chỉnh", desc: "Đơn vị, bộ phận công tác trước khi ký phụ lục", sample: "Phòng Kinh doanh", format: "Văn bản – viết hoa chữ cái đầu" },
  { group: "VI. Thông tin công ty (bên sử dụng lao động)", key: "TÊN_CÔNG_TY_IN_HOA", label: "TÊN DOANH NGHIỆP (IN HOA)", desc: "Tên đầy đủ theo Giấy chứng nhận đăng ký doanh nghiệp, in hoa", sample: "CÔNG TY CỔ PHẦN AEQUITAS", format: "Văn bản – IN HOA toàn bộ" },
  { group: "VI. Thông tin công ty (bên sử dụng lao động)", key: "Tên_công_ty", label: "Tên doanh nghiệp (viết thường)", desc: "Tên đầy đủ của doanh nghiệp, viết hoa chữ cái đầu mỗi từ", sample: "Công ty Cổ phần Aequitas", format: "Văn bản – viết hoa chữ \"Công ty\" và tên riêng" },
  { group: "VI. Thông tin công ty (bên sử dụng lao động)", key: "Tên_viết_tắt", label: "Tên viết tắt", desc: "Tên viết tắt theo Giấy chứng nhận đăng ký doanh nghiệp", sample: "AEQUITAS", format: "Văn bản – giữ nguyên như đăng ký" },
  { group: "VI. Thông tin công ty (bên sử dụng lao động)", key: "Mã_số_thuế", label: "Mã số doanh nghiệp", desc: "Mã số doanh nghiệp, đồng thời là mã số thuế", sample: "0108598427", format: "Chuỗi số – 10 chữ số, giữ số 0 đầu" },
  { group: "VI. Thông tin công ty (bên sử dụng lao động)", key: "Địa_chỉ_công_ty", label: "Địa chỉ trụ sở chính", desc: "Địa chỉ trụ sở chính của doanh nghiệp", sample: "Tầng 15, Tòa nhà CIC Tower, số 2 Nguyễn Thị Duệ, phường Yên Hòa, thành phố Hà Nội", format: "Văn bản – Tầng/tòa nhà, số nhà, đường/phố, phường/xã, tỉnh/thành phố" },
  { group: "VI. Thông tin công ty (bên sử dụng lao động)", key: "Điện_thoại_công_ty", label: "Số điện thoại doanh nghiệp", desc: "Số điện thoại liên hệ của doanh nghiệp", sample: "024 3200 0000", format: "Chuỗi số – mã vùng và số máy, nhóm 3-4-4" },
  { group: "VI. Thông tin công ty (bên sử dụng lao động)", key: "Đại_diện_pháp_luật", label: "Người đại diện theo pháp luật", desc: "Họ tên người đại diện theo pháp luật của doanh nghiệp", sample: "Lê Hoài Thanh", format: "Văn bản – viết hoa chữ cái đầu mỗi từ" },
  { group: "VII. Thông tin khác", key: "Ngày_in", label: "Ngày in văn bản (dd/mm/yyyy)", desc: "Ngày hệ thống xuất văn bản", sample: "23/10/2026", format: "Ngày – dd/mm/yyyy" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Họ_và_tên", label: "Như {{HỌ_VÀ_TÊN_NLĐ_IN_HOA}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{HỌ_VÀ_TÊN_NLĐ_IN_HOA}}", sample: '', format: '', legacyOf: "HỌ_VÀ_TÊN_NLĐ_IN_HOA" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Họ_tên_1", label: "Như {{HỌ_VÀ_TÊN_NLĐ_IN_HOA}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{HỌ_VÀ_TÊN_NLĐ_IN_HOA}}", sample: '', format: '', legacyOf: "HỌ_VÀ_TÊN_NLĐ_IN_HOA" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Họ_và_tên2", label: "Như {{Họ_và_tên_nlđ}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Họ_và_tên_nlđ}}", sample: '', format: '', legacyOf: "Họ_và_tên_nlđ" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Bday", label: "Như {{Ngày_sinh}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Ngày_sinh}}", sample: '', format: '', legacyOf: "Ngày_sinh" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "BOD_text", label: "Như {{Ngày_sinh}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Ngày_sinh}}", sample: '', format: '', legacyOf: "Ngày_sinh" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Số_CMNDCCCD_Hộ_chiếu", label: "Như {{CCCD_Hộ_chiếu}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{CCCD_Hộ_chiếu}}", sample: '', format: '', legacyOf: "CCCD_Hộ_chiếu" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Date_of_Issue", label: "Như {{Ngày_cấp_giấy_tờ_NLĐ}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Ngày_cấp_giấy_tờ_NLĐ}}", sample: '', format: '', legacyOf: "Ngày_cấp_giấy_tờ_NLĐ" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Ngày_cấp", label: "Như {{Ngày_cấp_giấy_tờ_NLĐ}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Ngày_cấp_giấy_tờ_NLĐ}}", sample: '', format: '', legacyOf: "Ngày_cấp_giấy_tờ_NLĐ" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Ngày_cấp_text", label: "Như {{Ngày_cấp_giấy_tờ_NLĐ}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Ngày_cấp_giấy_tờ_NLĐ}}", sample: '', format: '', legacyOf: "Ngày_cấp_giấy_tờ_NLĐ" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Nơi_cấp", label: "Như {{Nơi_cấp_giấy_tờ_NLĐ}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Nơi_cấp_giấy_tờ_NLĐ}}", sample: '', format: '', legacyOf: "Nơi_cấp_giấy_tờ_NLĐ" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "SĐT", label: "Như {{SĐT_NLĐ}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{SĐT_NLĐ}}", sample: '', format: '', legacyOf: "SĐT_NLĐ" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Trợ_cấp_ăn_trưa", label: "Như {{Hỗ_trợ_ăn_trưa}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Hỗ_trợ_ăn_trưa}}", sample: '', format: '', legacyOf: "Hỗ_trợ_ăn_trưa" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Trợ_cấp_xăng_xe", label: "Như {{Hỗ_trợ_xăng_xe}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Hỗ_trợ_xăng_xe}}", sample: '', format: '', legacyOf: "Hỗ_trợ_xăng_xe" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Trợ_cấp_điện_thoại", label: "Như {{Hỗ_trợ_điện_thoại}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Hỗ_trợ_điện_thoại}}", sample: '', format: '', legacyOf: "Hỗ_trợ_điện_thoại" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Trợ_cấp_nhà_ở", label: "Như {{Hỗ_trợ_nhà_ở}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Hỗ_trợ_nhà_ở}}", sample: '', format: '', legacyOf: "Hỗ_trợ_nhà_ở" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "HQCV", label: "Như {{HQCV_tạm_tính}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{HQCV_tạm_tính}}", sample: '', format: '', legacyOf: "HQCV_tạm_tính" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Người_ký", label: "Như {{Người_đại_diện_ký}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Người_đại_diện_ký}}", sample: '', format: '', legacyOf: "Người_đại_diện_ký" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "DS_Nhân_viênMã_NV_cũ1", label: "Như {{Mã_NV}}", desc: "Tên trường của bộ mẫu cũ — nên đổi sang {{Mã_NV}}", sample: '', format: '', legacyOf: "Mã_NV" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Thời_hạn", label: "Thời hạn hợp đồng (chữ)", desc: "Thời hạn ghi bằng chữ, VD \"1 năm\"; HĐ không xác định thời hạn ghi \"Không xác định thời hạn\"", sample: "1 năm", format: "Văn bản" },
  { group: "Tên cũ (mẫu Word cũ vẫn dùng được)", key: "Lương_gốc", label: "Lương cơ bản (100%, chưa áp dụng tỷ lệ hưởng)", desc: "Lương cơ bản khai báo đóng bảo hiểm", sample: "15.000.000", format: "Số tiền – #.##0 (dấu chấm phân cách hàng nghìn), không kèm đơn vị" },
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
// Dữ liệu mẫu (người được uỷ quyền là tên giả định)
const SIGNERS_SEED: SignerDef[] = [
  { id: 'sg-aeq-1', code: 'AEQ-GD', companyId: 'co-1', salutation: 'Ông', name: 'Lê Hoài Thanh', employeeCode: 'V00101', title: 'Giám đốc', authorization: '', isDefault: true, active: true, note: 'Người đại diện theo pháp luật' },
  { id: 'sg-aeq-2', code: 'AEQ-PGD', companyId: 'co-1', salutation: 'Bà', name: 'Nguyễn Thu Hà', employeeCode: 'V00102', title: 'Phó Giám đốc', authorization: 'Giấy uỷ quyền số 01/2026/UQ-AEQ ngày 02/01/2026', isDefault: false, active: true, note: 'Ký HĐ thử việc, học việc, thực tập' },
  { id: 'sg-aeq-3', code: 'AEQ-NS', companyId: 'co-1', salutation: 'Ông', name: 'Phạm Minh Tuấn', employeeCode: 'V00118', title: 'Trưởng phòng Nhân sự', authorization: 'Giấy uỷ quyền số 02/2026/UQ-AEQ ngày 02/01/2026', isDefault: false, active: true, note: '' },
  { id: 'sg-edso-1', code: 'EDSO-GD', companyId: 'co-2', salutation: 'Ông', name: 'Lê Hoài Thanh', employeeCode: 'V00101', title: 'Giám đốc', authorization: '', isDefault: true, active: true, note: 'Người đại diện theo pháp luật' },
  { id: 'sg-edso-2', code: 'EDSO-PGD', companyId: 'co-2', salutation: 'Ông', name: 'Trần Quốc Bảo', employeeCode: 'V00125', title: 'Phó Giám đốc', authorization: 'Giấy uỷ quyền số 05/2026/UQ-EDSO ngày 15/03/2026', isDefault: false, active: true, note: '' },
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
      { t: 'Chèn trường Word (Insert → Quick Parts → Field → MergeField) hoặc gõ tên trường trong cặp ngoặc nhọn đôi, ví dụ {{HỌ_VÀ_TÊN_NLĐ_IN_HOA}}. Khi in, hệ thống thay bằng dữ liệu của hợp đồng. Trường _text đã có chữ “ngày … tháng … năm …”.', i: true, after: 200 },
      ...FIELD_GROUPS.filter((g) => !g.startsWith('Tên cũ')).flatMap((g): BuildBlock[] => [{ t: g, b: true, after: 40 }, ...FIELDS.filter((f) => f.group === g).map((f): BuildBlock => ({ t: `${f.label}: {{${f.key}}}`, after: 20 }))]),
    ]),
};

// ==========================================================================
// Kho dữ liệu danh mục
// ==========================================================================
let CAT: Catalog = { types: TYPES_SEED, companies: COMPANIES_SEED, signers: SIGNERS_SEED, appendix: APPENDIX_SEED, templates: TEMPLATES_SEED() };
const SUBS = new Set<() => void>();
export const getCatalog = () => CAT;
export const updateCatalog = (fn: (c: Catalog) => Catalog) => {
  CAT = fn(CAT);
  SUBS.forEach((f) => f());
};
export const useCatalog = () => useSyncExternalStore((cb) => (SUBS.add(cb), () => void SUBS.delete(cb)), () => CAT);
/** Tải bộ mẫu Word có sẵn và đọc trường trộn. */
/** Mỗi mẫu tải riêng — 1 file lỗi không làm mất các mẫu còn lại. */
export const templatesReady: Promise<void> = Promise.all(
  CAT.templates
    .filter((t) => t.fileUrl && !t.data)
    .map(async (t) => {
      try {
        const res = await fetch(t.fileUrl!);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = new Uint8Array(await res.arrayBuffer());
        return { id: t.id, data, size: data.length, fields: (await inspectDocx(data)).fields };
      } catch (e) {
        console.warn(`Không tải được mẫu ${t.code} (${t.fileName})`, e);
        return null;
      }
    }),
).then((rs) => {
  const ok = rs.filter((r): r is NonNullable<typeof r> => !!r);
  if (ok.length) updateCatalog((c) => ({ ...c, templates: c.templates.map((t) => ({ ...t, ...(ok.find((r) => r.id === t.id) || {}) })) }));
});

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
export const signerById = (id?: string) => (id ? CAT.signers.find((x) => x.id === id) : undefined);
/** Người ký của công ty (đang sử dụng; giữ thêm người đang chọn) — mặc định lên đầu */
export const signersOf = (companyId: string, keep = '') =>
  CAT.signers.filter((x) => x.companyId === companyId && (x.active || x.id === keep)).sort((a, b) => Number(b.isDefault) - Number(a.isDefault) || a.code.localeCompare(b.code));
/** Người ký mặc định của công ty; chưa khai báo → người đại diện theo pháp luật trong danh mục công ty */
export const defaultSignerOf = (companyId: string): SignerDef | undefined => {
  const list = signersOf(companyId);
  const sg = list.find((x) => x.isDefault) || list[0];
  if (sg) return sg;
  const co = companyById(companyId);
  return co?.legalRep ? { id: '', code: '', companyId, salutation: co.legalRepSalutation, name: co.legalRep, title: co.legalRepTitle, authorization: '', isDefault: true, active: true, note: '' } : undefined;
};

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
