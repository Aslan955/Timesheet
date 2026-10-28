/**
 * Phân hệ "Quy trình" — kho dữ liệu (mock, giữ trong phiên): danh sách quy trình phê duyệt do Kế toán / Admin thiết lập.
 * Mỗi quy trình: thông tin chung + các bước thực hiện (bước 1 = người tạo đơn) + bộ trường thông tin theo từng bước.
 * Chi tiết thiết lập từng loại trường (popup cấu hình) sẽ bổ sung sau theo tài liệu cột "Trường thông tin".
 */
import { useSyncExternalStore } from 'react';
import type React from 'react';
import {
  AlignLeft, Banknote, Briefcase, Building2, Calculator, Calendar, CheckSquare, ClipboardList, Database, FileStack, Hash, ListTree, Mail, MapPin,
  Barcode, Network, Plane, Receipt, ShoppingCart, Sigma, Table2, Type, Upload, UserCircle, Wallet, Workflow, FolderKanban, HandCoins, Clock,
} from 'lucide-react';

// ==========================================================================
// Loại trường thông tin (cột bên phải) — hiện chỉ thêm / đặt tên / bắt buộc; thiết lập chi tiết làm sau
// ==========================================================================
export type FieldType =
  | 'text' | 'textarea' | 'select' | 'datetime' | 'address' | 'number' | 'currency' | 'employee' | 'position' | 'org'
  | 'file' | 'subtask' | 'table' | 'catalog' | 'formula' | 'email' | 'runData' | 'linkedData' | 'autoCode';

export const FIELD_TYPES: { type: FieldType; label: string; icon: React.ElementType }[] = [
  { type: 'text', label: 'Một dòng', icon: Type },
  { type: 'textarea', label: 'Nhiều dòng', icon: AlignLeft },
  { type: 'select', label: 'Chọn giá trị', icon: CheckSquare },
  { type: 'datetime', label: 'Thời gian', icon: Calendar },
  { type: 'address', label: 'Địa giới hành chính', icon: MapPin },
  { type: 'number', label: 'Số', icon: Hash },
  { type: 'currency', label: 'Tiền tệ', icon: Banknote },
  { type: 'employee', label: 'Nhân viên', icon: UserCircle },
  { type: 'position', label: 'Tên vị trí công việc', icon: Briefcase },
  { type: 'org', label: 'Cơ cấu tổ chức', icon: Network },
  { type: 'file', label: 'Tải tệp', icon: Upload },
  { type: 'subtask', label: 'Công việc con', icon: ListTree },
  { type: 'table', label: 'Bảng', icon: Table2 },
  { type: 'catalog', label: 'Danh mục', icon: ClipboardList },
  { type: 'formula', label: 'Công thức', icon: Sigma },
  { type: 'email', label: 'Email', icon: Mail },
  { type: 'runData', label: 'Dữ liệu lượt chạy', icon: FileStack },
  { type: 'linkedData', label: 'Dữ liệu kết nối', icon: Database },
  { type: 'autoCode', label: 'Mã số tự sinh', icon: Barcode },
];
export const fieldTypeOf = (t: FieldType) => FIELD_TYPES.find((x) => x.type === t)!;

export interface ProcField {
  id: string;
  type: FieldType;
  label: string;
  required: boolean;
  hint: string; // gợi ý nhập
  options?: string[]; // danh sách lựa chọn (Chọn giá trị)
  cfg?: FieldCfg; // thiết lập chi tiết theo loại trường (popup thiết lập)
}

// ==========================================================================
// Thiết lập chi tiết từng loại trường
// ==========================================================================
export type ColType = 'stt' | 'text' | 'textarea' | 'select' | 'date' | 'month' | 'datetime' | 'address' | 'decimal' | 'integer' | 'percent' | 'currency';
export const COL_TYPES: { type: ColType; label: string; group?: string }[] = [
  { type: 'stt', label: 'Sinh STT tự động' },
  { type: 'text', label: 'Một dòng' },
  { type: 'textarea', label: 'Nhiều dòng' },
  { type: 'select', label: 'Chọn giá trị' },
  { type: 'date', label: 'Ngày/tháng/năm', group: 'Thời gian' },
  { type: 'month', label: 'Tháng/năm', group: 'Thời gian' },
  { type: 'datetime', label: 'Ngày/tháng/năm Giờ:phút', group: 'Thời gian' },
  { type: 'address', label: 'Địa giới hành chính' },
  { type: 'decimal', label: 'Số thập phân', group: 'Số' },
  { type: 'integer', label: 'Số tự nhiên', group: 'Số' },
  { type: 'percent', label: 'Số phần trăm', group: 'Số' },
  { type: 'currency', label: 'Tiền tệ' },
];
export interface TableCol {
  id: string;
  name: string;
  type: ColType;
  required: boolean;
  options?: string[]; // cột Chọn giá trị
  sum?: boolean; // cột số / tiền: hiện dòng tổng
}
export type NumKind = 'decimal' | 'integer' | 'percent';
export interface FieldCfg {
  // chung
  defaultOn?: boolean;
  defaultValue?: string;
  // Một dòng / Nhiều dòng / Email
  dependsOn?: string; // id trường phụ thuộc (chỉ hiện khi trường đó đã có giá trị)
  maxLength?: number;
  format?: 'free' | 'digits' | 'phone';
  // Chọn giá trị / Nhân viên / Vị trí / Cơ cấu tổ chức / Danh mục / Địa giới hành chính
  multiple?: boolean;
  display?: 'dropdown' | 'radio';
  catalog?: string;
  orgLevel?: 'unit' | 'all';
  defaultCreator?: boolean; // Nhân viên: mặc định là người tạo đơn
  // Thời gian
  dateKind?: 'date' | 'month' | 'datetime';
  dateLimit?: 'none' | 'notPast' | 'notFuture';
  defaultToday?: boolean;
  // Địa giới hành chính
  addrKind?: 'province' | 'ward';
  // Số
  numKind?: NumKind;
  numSource?: 'input' | 'list';
  numOptions?: number[];
  decimals?: number;
  min?: number | null;
  max?: number | null;
  // Tiền tệ
  currency?: string;
  allowCurrencyChoice?: boolean;
  showWords?: boolean;
  // Tải tệp
  maxFiles?: number;
  accept?: string;
  mergeTemplate?: string | null;
  signers?: string[];
  // Công việc con
  tasks?: string[];
  requireAll?: boolean;
  // Bảng
  columns?: TableCol[];
  rowsDefault?: number;
  allowAddRows?: boolean;
  // Công thức
  returnKind?: NumKind | 'currency';
  rounding?: 'nearest' | 'up' | 'down';
  expr?: string;
  editable?: boolean;
  // Dữ liệu lượt chạy / kết nối
  source?: string;
  linkProcess?: string; // mã quy trình nguồn (QT-xxx)
  // Mã số tự sinh
  prefix?: string;
  withYear?: boolean;
  digits?: number;
}

export const CURRENCIES = [
  { code: 'VND', name: 'Việt Nam đồng' },
  { code: 'USD', name: 'Đô la Mỹ' },
  { code: 'EUR', name: 'Đồng tiền chung Châu Âu' },
  { code: 'JPY', name: 'Yên Nhật' },
  { code: 'AUD', name: 'Đô la Úc' },
  { code: 'CNY', name: 'Nhân dân tệ Trung Quốc' },
  { code: 'GBP', name: 'Bảng Anh' },
  { code: 'HKD', name: 'Đô la Hồng Kông' },
];
/** 34 tỉnh, thành phố (sau sắp xếp đơn vị hành chính 2025). */
export const PROVINCES = [
  'Thành phố Hà Nội', 'Thành phố Huế', 'Thành phố Hải Phòng', 'Thành phố Đà Nẵng', 'Thành phố Hồ Chí Minh', 'Thành phố Cần Thơ',
  'Tỉnh An Giang', 'Tỉnh Bắc Ninh', 'Tỉnh Cà Mau', 'Tỉnh Cao Bằng', 'Tỉnh Đắk Lắk', 'Tỉnh Điện Biên', 'Tỉnh Đồng Nai', 'Tỉnh Đồng Tháp',
  'Tỉnh Gia Lai', 'Tỉnh Hà Tĩnh', 'Tỉnh Hưng Yên', 'Tỉnh Khánh Hòa', 'Tỉnh Lai Châu', 'Tỉnh Lâm Đồng', 'Tỉnh Lạng Sơn', 'Tỉnh Lào Cai',
  'Tỉnh Nghệ An', 'Tỉnh Ninh Bình', 'Tỉnh Phú Thọ', 'Tỉnh Quảng Ngãi', 'Tỉnh Quảng Ninh', 'Tỉnh Quảng Trị', 'Tỉnh Sơn La', 'Tỉnh Tây Ninh',
  'Tỉnh Thái Nguyên', 'Tỉnh Thanh Hóa', 'Tỉnh Tuyên Quang', 'Tỉnh Vĩnh Long',
];
/** Phường / xã — danh sách MẪU cho một số tỉnh, thành (bản chính thức lấy từ danh mục hành chính). */
export const WARDS: Record<string, string[]> = {
  'Thành phố Hà Nội': ['Phường Ba Đình', 'Phường Ngọc Hà', 'Phường Giảng Võ', 'Phường Hoàn Kiếm', 'Phường Cửa Nam', 'Phường Hai Bà Trưng', 'Phường Đống Đa', 'Phường Cầu Giấy', 'Phường Tây Hồ', 'Phường Thanh Xuân'],
  'Thành phố Hồ Chí Minh': ['Phường Sài Gòn', 'Phường Bến Thành', 'Phường Tân Định', 'Phường Bàn Cờ', 'Phường Xuân Hòa', 'Phường Chợ Lớn', 'Phường Thủ Đức', 'Phường Gò Vấp'],
  'Thành phố Đà Nẵng': ['Phường Hải Châu', 'Phường Hòa Cường', 'Phường Thanh Khê', 'Phường Sơn Trà', 'Phường Ngũ Hành Sơn', 'Phường Liên Chiểu'],
};
export const POSITIONS = ['Giám đốc', 'Phó giám đốc', 'Kế toán trưởng', 'Kế toán viên', 'Trưởng phòng', 'Chuyên viên', 'Nhân viên kinh doanh', 'Kỹ sư phần mềm', 'Trưởng nhóm', 'Thực tập sinh'];
/** Danh mục dùng cho trường "Danh mục" (mẫu — bản chính thức lấy từ IMIS). */
export const CATALOGS: Record<string, string[]> = {
  'Khách hàng': ['Khách hàng X (mẫu)', 'Khách hàng Y (mẫu)', 'Khách hàng Z (mẫu)'],
  'Dự án': ['Dự án quản lý kho (mẫu)', 'Dự án cổng thông tin (mẫu)', 'Dự án ứng dụng di động (mẫu)'],
  'Nhà cung cấp': ['Nhà cung cấp A (mẫu)', 'Nhà cung cấp B (mẫu)', 'Nhà cung cấp C (mẫu)'],
  'Hạng mục chi phí': ['Chi phí văn phòng', 'Chi phí tiếp khách', 'Chi phí công tác', 'Chi phí marketing', 'Chi phí đào tạo'],
};
/** Dữ liệu lượt chạy: thông tin của đơn tự điền. */
export const RUN_SOURCES: { key: string; label: string }[] = [
  { key: 'code', label: 'Mã đơn' },
  { key: 'creator', label: 'Người tạo đơn' },
  { key: 'creatorUnit', label: 'Phòng ban người tạo' },
  { key: 'createdAt', label: 'Ngày tạo đơn' },
  { key: 'submittedAt', label: 'Ngày gửi đơn' },
  { key: 'processName', label: 'Tên quy trình' },
  { key: 'version', label: 'Phiên bản quy trình' },
];
export const DEFAULT_TABLE_COLS = (): TableCol[] => [
  { id: 'stt', name: 'STT', type: 'stt', required: true },
  { id: 'nd', name: 'Nội dung', type: 'text', required: true },
  { id: 'st', name: 'Số tiền', type: 'currency', required: true, sum: true },
];
/** Thiết lập mặc định khi thêm trường. */
export const defaultCfg = (t: FieldType): FieldCfg => {
  switch (t) {
    case 'text':
      return { format: 'free' };
    case 'select':
      return { multiple: false, display: 'dropdown' };
    case 'datetime':
      return { dateKind: 'date', dateLimit: 'none' };
    case 'address':
      return { multiple: false, addrKind: 'province' };
    case 'number':
      return { numKind: 'decimal', numSource: 'input', decimals: 2 };
    case 'currency':
      return { currency: 'VND', allowCurrencyChoice: false, showWords: true };
    case 'employee':
    case 'position':
      return { multiple: false };
    case 'org':
      return { multiple: false, orgLevel: 'all' };
    case 'file':
      return { maxFiles: 5, accept: '', mergeTemplate: null, signers: [] };
    case 'subtask':
      return { tasks: ['Công việc 1'], requireAll: false };
    case 'table':
      return { columns: DEFAULT_TABLE_COLS(), rowsDefault: 1, allowAddRows: true };
    case 'catalog':
      return { catalog: 'Khách hàng', multiple: false };
    case 'formula':
      return { returnKind: 'decimal', rounding: 'nearest', decimals: 2, expr: '', editable: false, showWords: false };
    case 'runData':
      return { source: 'code' };
    case 'linkedData':
      return { linkProcess: '' };
    case 'autoCode':
      return { prefix: 'DN', withYear: true, digits: 4 };
    default:
      return {};
  }
};
export const cfgOf = (f: ProcField): FieldCfg => ({ ...defaultCfg(f.type), ...(f.cfg || {}) });
export interface ProcStep {
  id: string;
  name: string;
  desc: string; // mô tả bước (hướng dẫn người xử lý)
  deadlineDays: number | null; // hạn xử lý (ngày) — trống = không giới hạn
  fields: ProcField[];
}
export type PermMode = 'all' | 'units' | 'people';
export interface ProcLog {
  at: string;
  by: string;
  action: string;
}
export interface Process {
  id: string;
  code: string;
  name: string;
  desc: string;
  version: string;
  group: string;
  steps: ProcStep[];
  unlimitedSteps: boolean; // người duyệt cuối được chuyển tiếp thêm bước
  permMode: PermMode;
  permUnits: string[];
  permPeople: string[];
  quickSteps: string[]; // id bước được xử lý nhanh (duyệt ngay trên danh sách đơn)
  icon: string; // khoá trong PROC_ICONS
  color: string; // khoá trong PROC_COLORS
  related: string[]; // người liên quan (nhận thông báo, xem đơn)
  showStep1: boolean; // các bước sau xem được trường của bước 1
  active: boolean;
  requests: number; // số đơn đã phát sinh (mock)
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  history: ProcLog[];
}

// ==========================================================================
// Danh mục dùng chung (mẫu — bản chính thức lấy từ IMIS)
// ==========================================================================
export const PROC_GROUPS = ['Kế toán – Tài chính', 'Hành chính – Nhân sự', 'Kinh doanh', 'Dự án', 'Kỹ thuật', 'Khác'];
export const PROC_UNITS = ['Ban Giám đốc', 'Phòng Kế toán', 'Phòng Hành chính – Nhân sự', 'Khối Kinh doanh (G1)', 'Khối Sản xuất (G2)', 'Khối Sản xuất (G3)', 'Phòng Mua hàng'];
export const PROC_PEOPLE = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Thu Dung', 'Hoàng Minh Đức', 'Vũ Thị Giang', 'Đặng Quốc Huy', 'Bùi Thanh Hương',
  'Đỗ Văn Khánh', 'Ngô Thị Lan', 'Dương Minh Long', 'Lý Thu Mai', 'Phan Văn Nam', 'Trịnh Thị Oanh',
];
export const PERM_LABEL: Record<PermMode, string> = { all: 'Tất cả nhân viên', units: 'Theo phòng ban / khối', people: 'Theo nhân viên cụ thể' };

export const PROC_ICONS: Record<string, React.ElementType> = {
  workflow: Workflow, wallet: Wallet, receipt: Receipt, coins: HandCoins, cart: ShoppingCart, project: FolderKanban, plane: Plane,
  clock: Clock, calc: Calculator, building: Building2, docs: FileStack, list: ClipboardList,
};
export const PROC_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: 'bg-[#e8f1fb]', text: 'text-[#1f5fa8]', ring: 'ring-[#1f5fa8]' },
  green: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'ring-emerald-600' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-600', ring: 'ring-orange-500' },
  violet: { bg: 'bg-violet-50', text: 'text-violet-700', ring: 'ring-violet-600' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-600', ring: 'ring-rose-500' },
  slate: { bg: 'bg-slate-100', text: 'text-slate-700', ring: 'ring-slate-500' },
};

// ==========================================================================
// Tiện ích
// ==========================================================================
export const ME = 'ketoan.lan';
export const uidP = (p = 'x') => `${p}-${Math.random().toString(36).slice(2, 9)}`;
export const nowIsoP = () => new Date().toISOString();
export const fmtDateTime = (iso: string) => {
  if (!iso) return '—';
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
export const fmtDate = (iso: string) => fmtDateTime(iso).slice(0, 10);
export const newField = (type: FieldType, label?: string, required = false, cfg?: FieldCfg): ProcField => ({ id: uidP('f'), type, label: label || fieldTypeOf(type).label, required, hint: '', cfg: { ...defaultCfg(type), ...(cfg || {}) } });
export const newStep = (name = '', fields: ProcField[] = [], deadlineDays: number | null = null): ProcStep => ({ id: uidP('s'), name, desc: '', deadlineDays, fields });
export const blankProcess = (): Process => {
  const t = nowIsoP();
  return {
    id: uidP('p'),
    code: '',
    name: '',
    desc: '',
    version: '1.0',
    group: '',
    steps: [newStep('Người đề nghị'), newStep(), newStep()],
    unlimitedSteps: false,
    permMode: 'all',
    permUnits: [],
    permPeople: [],
    quickSteps: [],
    icon: 'workflow',
    color: 'blue',
    related: [],
    showStep1: true,
    active: true,
    requests: 0,
    createdBy: ME,
    createdAt: t,
    updatedAt: t,
    history: [],
  };
};
/** Mã quy trình tự sinh: QT-001, QT-002… */
export const nextCode = (list: Process[]) => {
  const n = Math.max(0, ...list.map((p) => Number(p.code.replace(/\D/g, '')) || 0)) + 1;
  return `QT-${String(n).padStart(3, '0')}`;
};
export const fieldCount = (p: Process) => p.steps.reduce((n, s) => n + s.fields.length, 0);

// ==========================================================================
// Dữ liệu mẫu
// ==========================================================================
const seed = (): Process[] => {
  const mk = (
    code: string, name: string, group: string, icon: string, color: string, steps: ProcStep[], extra: Partial<Process> & { days?: number } = {},
  ): Process => {
    // trường phụ thuộc khai báo theo tên ("__Tên trường") → id
    steps.forEach((st) => st.fields.forEach((f) => f.cfg?.dependsOn?.startsWith('__') && (f.cfg.dependsOn = st.fields.find((x) => x.label === f.cfg!.dependsOn!.slice(2))?.id)));
    const at = new Date(Date.now() - (extra.days ?? 20) * 86400000).toISOString();
    const { days, ...rest } = extra;
    void days;
    return {
      ...blankProcess(),
      code, name, group, icon, color, steps,
      createdAt: at,
      updatedAt: at,
      history: [{ at, by: rest.createdBy || ME, action: 'Tạo quy trình' }],
      ...rest,
    };
  };
  return [
    mk('QT-001', 'Đề nghị thanh toán', 'Kế toán – Tài chính', 'wallet', 'blue', [
      newStep('Người đề nghị', [
        newField('autoCode', 'Số đề nghị', true, { prefix: 'DNTT', withYear: true, digits: 4 }),
        newField('employee', 'Người đề nghị', true, { defaultCreator: true }),
        newField('org', 'Phòng ban', true),
        newField('catalog', 'Hạng mục chi phí', true, { catalog: 'Hạng mục chi phí' }),
        newField('textarea', 'Nội dung thanh toán', true),
        newField('table', 'Chi tiết khoản chi', true),
        newField('formula', 'Tổng tiền đề nghị', false, { returnKind: 'currency', decimals: 0, expr: '{Chi tiết khoản chi}', showWords: true }),
        newField('formula', 'Thuế GTGT (10%)', false, { returnKind: 'currency', decimals: 0, expr: '{Tổng tiền đề nghị} * 10 / 100' }),
        newField('formula', 'Tổng thanh toán', false, { returnKind: 'currency', decimals: 0, expr: '{Tổng tiền đề nghị} + {Thuế GTGT (10%)}', showWords: true }),
        newField('datetime', 'Hạn thanh toán', true, { dateKind: 'date', dateLimit: 'notPast' }),
        newField('text', 'Đơn vị thụ hưởng', true),
        newField('text', 'Số tài khoản / Ngân hàng', false, { dependsOn: '__Đơn vị thụ hưởng' }),
        newField('file', 'Chứng từ kèm theo', true, { maxFiles: 5, accept: '.pdf,.jpg,.png' }),
      ]),
      newStep('Trưởng bộ phận duyệt', [], 1),
      newStep('Kế toán kiểm tra', [{ ...newField('select', 'Kết quả kiểm tra chứng từ', true), options: ['Đủ chứng từ hợp lệ', 'Thiếu chứng từ – cần bổ sung', 'Chứng từ không hợp lệ'] }, newField('textarea', 'Ghi chú kế toán')], 2),
      newStep('Giám đốc phê duyệt', [], 2),
    ], { requests: 46, quickSteps: [], related: ['Ngô Thị Lan'], days: 60, desc: 'Thanh toán cho nhà cung cấp, chi phí dự án, chi phí văn phòng có chứng từ.' }),
    mk('QT-002', 'Đề nghị tạm ứng', 'Kế toán – Tài chính', 'coins', 'orange', [
      newStep('Người đề nghị', [
        newField('employee', 'Người tạm ứng', true), newField('textarea', 'Lý do tạm ứng', true), newField('currency', 'Số tiền tạm ứng', true),
        newField('datetime', 'Ngày hoàn ứng dự kiến', true),
      ]),
      newStep('Trưởng bộ phận duyệt', [], 1),
      newStep('Kế toán trưởng duyệt', [], 1),
    ], { requests: 23, days: 45 }),
    mk('QT-003', 'Phê duyệt dự án', 'Dự án', 'project', 'violet', [
      newStep('Người đề xuất', [
        newField('text', 'Tên dự án', true), newField('catalog', 'Khách hàng', true), newField('currency', 'Giá trị hợp đồng dự kiến', true),
        newField('number', 'Tỷ suất lợi nhuận dự kiến (%)'), newField('file', 'Phương án kinh doanh (PAKD)', true),
      ]),
      newStep('Giám đốc khối duyệt', [], 2),
      newStep('Kế toán thẩm định', [newField('textarea', 'Ý kiến thẩm định tài chính', true)], 3),
      newStep('Tổng giám đốc phê duyệt', [], 3),
    ], { requests: 12, days: 30, showStep1: true }),
    mk('QT-004', 'Đề nghị chi trả', 'Kế toán – Tài chính', 'receipt', 'green', [
      newStep('Người đề nghị', [newField('textarea', 'Nội dung chi', true), newField('currency', 'Số tiền', true), newField('file', 'Hoá đơn / chứng từ')]),
      newStep('Kế toán xử lý', [], 2),
      newStep('Thủ quỹ chi tiền', [newField('datetime', 'Ngày chi', true)], 1),
    ], { requests: 31, unlimitedSteps: true, days: 25 }),
    mk('QT-005', 'Đề nghị làm thêm giờ (OT)', 'Hành chính – Nhân sự', 'clock', 'rose', [
      newStep('Người đề nghị', [newField('datetime', 'Thời gian làm thêm', true), newField('number', 'Số giờ', true), newField('textarea', 'Nội dung công việc', true)]),
      newStep('Quản lý trực tiếp duyệt', [], 1),
      newStep('HCNS xác nhận', [], 2),
    ], { requests: 58, permMode: 'units', permUnits: ['Khối Sản xuất (G2)', 'Khối Sản xuất (G3)'], days: 15 }),
    mk('QT-006', 'Đề nghị mua sắm tài sản', 'Hành chính – Nhân sự', 'cart', 'slate', [
      newStep('Người đề nghị', [newField('table', 'Danh sách tài sản', true), newField('currency', 'Tổng giá trị dự kiến', true)]),
      newStep('Phòng Mua hàng báo giá', [newField('file', 'Báo giá nhà cung cấp', true)], 3),
      newStep('Giám đốc phê duyệt', [], 2),
    ], { requests: 0, active: false, version: '0.9', days: 5, desc: 'Bản nháp — chưa áp dụng.' }),
  ];
};

// ==========================================================================
// Kho dữ liệu
// ==========================================================================
let STATE: Process[] = seed();
const SUBS = new Set<() => void>();
export const getProcesses = () => STATE;
export const updateProcesses = (fn: (l: Process[]) => Process[]) => {
  STATE = fn(STATE);
  SUBS.forEach((f) => f());
};
export const useProcesses = () => useSyncExternalStore((cb) => (SUBS.add(cb), () => void SUBS.delete(cb)), () => STATE);
