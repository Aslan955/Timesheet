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
export type ColType =
  | 'stt' | 'text' | 'textarea' | 'select' | 'date' | 'month' | 'datetime' | 'address' | 'decimal' | 'integer' | 'percent' | 'currency'
  | 'currencyCode' | 'catalog' | 'employee' | 'file' | 'formula';
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
  { type: 'currencyCode', label: 'Loại tiền', group: 'Chọn từ danh mục' },
  { type: 'catalog', label: 'Danh mục (dự án, khách hàng…)', group: 'Chọn từ danh mục' },
  { type: 'employee', label: 'Nhân viên', group: 'Chọn từ danh mục' },
  { type: 'file', label: 'Tải tệp' },
  { type: 'formula', label: 'Công thức (theo cột)' },
];
export interface TableCol {
  id: string;
  name: string;
  type: ColType;
  required: boolean;
  options?: string[]; // cột Chọn giá trị
  sum?: boolean; // cột số / tiền: hiện dòng tổng
  words?: boolean; // dòng tổng hiện số tiền bằng chữ
  catalog?: string; // cột Danh mục: tên danh mục (Dự án, Khách hàng…)
  expr?: string; // cột Công thức: biểu thức theo tên cột, VD {Số lượng} * {Đơn giá}
  fmt?: 'currency' | 'percent' | 'decimal'; // cột Công thức: kiểu hiển thị
}
export type NumKind = 'decimal' | 'integer' | 'percent';
export interface FieldCfg {
  // chung
  defaultOn?: boolean;
  defaultValue?: string;
  // Một dòng / Nhiều dòng / Email
  dependsOn?: string; // id trường phụ thuộc (chỉ hiện khi trường đó đã có giá trị)
  dependsValue?: string; // chỉ hiện khi trường phụ thuộc có đúng giá trị này (VD "Khác")
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
  linkSum?: string; // tên trường số / bảng của quy trình nguồn — cộng dồn để dùng trong Công thức (VD tổng tiền đã tạm ứng)
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
  'Dự án': ['PRJ-001 · Hệ thống quản lý kho (mẫu)', 'PRJ-002 · Cổng thông tin khách hàng (mẫu)', 'PRJ-003 · Ứng dụng di động bán hàng (mẫu)', 'PRJ-004 · Chuyển đổi số văn phòng (mẫu)', 'NỘI BỘ · Chi phí chung công ty'],
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
  /** Mẫu tiêu đề đơn — {Tên trường} được thay bằng giá trị, VD "Đề nghị tạm ứng {Mục đích tạm ứng} của {Người đề nghị}" */
  titleTpl?: string;
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
export const PROC_GROUPS = ['Kế toán – Tài chính', 'Hành chính – Nhân sự', 'Mua hàng', 'Kinh doanh', 'Dự án', 'Kỹ thuật', 'Khác'];
export const PROC_UNITS = ['Ban Giám đốc', 'Phòng Kế toán', 'Phòng Hành chính – Nhân sự', 'Khối Kinh doanh (G1)', 'Khối Sản xuất (G2)', 'Khối Sản xuất (G3)', 'Phòng Mua hàng'];
export const PROC_PEOPLE = [
  'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Thu Dung', 'Hoàng Minh Đức', 'Vũ Thị Giang', 'Đặng Quốc Huy', 'Bùi Thanh Hương',
  'Đỗ Văn Khánh', 'Ngô Thị Lan', 'Dương Minh Long', 'Lý Thu Mai', 'Phan Văn Nam', 'Trịnh Thị Oanh',
];
/** Email công việc (mẫu): tên + chữ cái đầu họ, đệm — không dấu, VD Trần Thị Bình → binhtt@congty.vn */
export const EMAIL_DOMAIN = 'congty.vn';
const EMAILS: Record<string, string> = (() => {
  const used = new Map<string, number>();
  return Object.fromEntries(
    PROC_PEOPLE.map((n) => {
      const w = n.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().split(/\s+/).filter(Boolean);
      const base = `${w[w.length - 1]}${w.slice(0, -1).map((x) => x[0]).join('')}`;
      const k = (used.get(base) || 0) + 1;
      used.set(base, k);
      return [n, `${base}${k > 1 ? k : ''}@${EMAIL_DOMAIN}`];
    }),
  );
})();
export const emailOf = (name: string) => EMAILS[name] || '';
/** Nhãn chọn nhân viên: Họ tên — email */
export const personLabel = (name: string) => (EMAILS[name] ? `${name} — ${EMAILS[name]}` : name);
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
    titleTpl: '',
    version: '1.0',
    group: '',
    steps: [newStep('Lập đề nghị'), newStep(), newStep()],
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
/** Tên trường dùng trong mẫu tiêu đề */
export const titleRefs = (tpl: string) => [...(tpl || '').matchAll(/\{([^{}]+)\}/g)].map((m) => m[1].trim());
/** Dựng tiêu đề đơn từ mẫu; trường chưa nhập giữ nguyên tên trường. */
export const renderTitle = (tpl: string, fields: ProcField[], values: Record<string, unknown>, empty = (name: string) => name) =>
  (tpl || '').replace(/\{([^{}]+)\}/g, (_, n: string) => {
    const f = fields.find((x) => x.label.trim() === n.trim());
    const v = f ? values[f.id] : undefined;
    const s = Array.isArray(v) ? v.join(', ') : typeof v === 'number' ? v.toLocaleString('en-US') : typeof v === 'string' ? v.trim() : '';
    return s || empty(n.trim());
  });
/** Cột của bảng (dựng nhanh dữ liệu mẫu) */
export const col = (name: string, type: ColType, required = false, extra: Partial<TableCol> = {}): TableCol => ({ id: uidP('c'), name, type, required, ...extra });
export const STT = (): TableCol => ({ id: 'stt', name: 'STT', type: 'stt', required: true });

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
  // ---- Trường dùng lại
  const F = newField;
  const nguoi = (label = 'Người đề nghị') => F('employee', label, true, { multiple: true, defaultCreator: true });
  const nhanTien = () => [F('text', 'Tổ chức/Cá nhân nhận tiền', true), F('text', 'Số tài khoản', true, { format: 'digits' }), F('text', 'Ngân hàng', true)];
  const tbl = (label: string, required: boolean, columns: TableCol[]) => F('table', label, required, { columns, rowsDefault: 1, allowAddRows: true });
  const sel = (label: string, required: boolean, options: string[], cfg: FieldCfg = {}) => ({ ...F('select', label, required, cfg), options });
  const tien = (name: string, required = true) => col(name, 'currency', required, { sum: true, words: true });
  const loaiTien = () => col('Loại tiền', 'currencyCode', true);
  const duAn = (name = 'Mã dự án', required = false) => col(name, 'catalog', required, { catalog: 'Dự án' });
  const tep = (name: string, required = false) => col(name, 'file', required);
  const coKhong = (name: string) => col(name, 'select', true, { options: ['Có', 'Không'] });
  const deXuat = () => col('Đề xuất', 'select', true, { options: ['Chọn', 'Không chọn'] });
  const dl = (n: number) => n; // hạn xử lý (ngày)
  const S = newStep;

  return [
    // 1. Tạm ứng
    mk('QT-001', 'Quy trình tạm ứng', 'Kế toán – Tài chính', 'coins', 'orange', [
      S('Lập yêu cầu', [
        nguoi(),
        F('text', 'Mục đích tạm ứng', true),
        F('datetime', 'Hạn thanh toán', true, { dateKind: 'date', dateLimit: 'notPast' }),
        F('datetime', 'Ngày hoàn ứng', true, { dateKind: 'date', dateLimit: 'notPast' }),
        ...nhanTien(),
        tbl('Bảng kê tạm ứng', true, [STT(), tep('Hóa đơn, chứng từ, tài liệu khác kèm theo (nếu có)', true), col('Nội dung tạm ứng', 'text', true), loaiTien(), tien('Số tiền'), duAn(), col('Ghi chú', 'text')]),
      ]),
      S('Trưởng bộ phận duyệt', [], dl(1)),
      S('Kế toán kiểm tra', [], dl(1)),
      S('Kế toán trưởng duyệt', [], dl(1)),
      S('Giám đốc phê duyệt', [], dl(2)),
    ], { titleTpl: 'Đề nghị tạm ứng {Mục đích tạm ứng} của {Người đề nghị}', requests: 37, days: 90, desc: 'Tạm ứng chi phí công tác, mua sắm, chi phí dự án. Hoàn ứng qua "Quy trình quyết toán tạm ứng".' }),

    // 2. Quyết toán tạm ứng
    mk('QT-002', 'Quy trình quyết toán tạm ứng', 'Kế toán – Tài chính', 'calc', 'green', [
      S('Lập đề nghị', [
        nguoi(),
        F('text', 'Mục đích quyết toán', true),
        { ...F('linkedData', 'Danh sách đề nghị tạm ứng được quyết toán', true, { linkProcess: 'QT-001', multiple: true, linkSum: 'Bảng kê tạm ứng' }), hint: 'Thêm đề nghị tạm ứng' },
        F('formula', 'Tổng số tiền đã tạm ứng', false, { returnKind: 'currency', decimals: 0, expr: '{Danh sách đề nghị tạm ứng được quyết toán}' }),
        tbl('Bảng chi tiết quyết toán', true, [STT(), col('Khoản chi', 'text', true), tep('Hóa đơn, chứng từ, tài liệu kèm theo'), tien('Số tiền đề nghị thanh toán'), duAn(), col('Ghi chú', 'text')]),
        F('formula', 'Tổng tiền quyết toán', false, { returnKind: 'currency', decimals: 0, expr: '{Bảng chi tiết quyết toán}' }),
        { ...F('formula', 'Chênh lệch thừa/thiếu', false, { returnKind: 'currency', decimals: 0, expr: '{Tổng tiền quyết toán} - {Tổng số tiền đã tạm ứng}' }), hint: 'Dương: công ty trả thêm cho người đề nghị · Âm: người đề nghị hoàn lại công ty' },
        ...nhanTien(),
      ]),
      S('Trưởng bộ phận duyệt', [], dl(1)),
      S('Kế toán kiểm tra chứng từ', [], dl(2)),
      S('Kế toán trưởng duyệt', [], dl(1)),
      S('Giám đốc phê duyệt', [], dl(2)),
    ], { titleTpl: 'Đề nghị hoàn ứng {Mục đích quyết toán} của {Người đề nghị}', requests: 21, days: 88 }),

    // 3. Thanh toán
    mk('QT-003', 'Quy trình thanh toán', 'Kế toán – Tài chính', 'wallet', 'blue', [
      S('Lập đề nghị', [
        nguoi(),
        F('text', 'Mục đích thanh toán', true),
        ...nhanTien(),
        F('datetime', 'Hạn thanh toán', true, { dateKind: 'date', dateLimit: 'notPast' }),
        tbl('Bảng chi tiết đề nghị thanh toán', true, [STT(), col('Khoản chi', 'text', true), tep('Hóa đơn, chứng từ, tài liệu đính kèm'), loaiTien(), tien('Số tiền thanh toán'), duAn(), col('Ghi chú', 'text')]),
      ]),
      S('Trưởng bộ phận duyệt', [], dl(1)),
      S('Kế toán kiểm tra', [], dl(1)),
      S('Kế toán trưởng duyệt', [], dl(1)),
      S('Giám đốc phê duyệt', [], dl(2)),
    ], { titleTpl: 'Đề nghị thanh toán {Mục đích thanh toán} của {Người đề nghị}', requests: 64, days: 86, related: ['Ngô Thị Lan'] }),

    // 4. Xuất hoá đơn
    mk('QT-004', 'Quy trình xuất hóa đơn', 'Kế toán – Tài chính', 'receipt', 'violet', [
      S('Lập đề nghị', [
        nguoi(),
        F('text', 'Tên đơn vị', true),
        F('text', 'Mã số thuế', true, { format: 'digits', maxLength: 14 }),
        F('text', 'Địa chỉ', true),
        { ...F('email', 'Email', true, { multiple: true }), hint: 'Nhấn Enter để thêm mới email' },
        F('datetime', 'Ngày hóa đơn', true, { dateKind: 'date' }),
        tbl('Bảng kê chi tiết', true, [
          STT(), col('Nội dung xuất hóa đơn', 'text', true), loaiTien(), col('Đơn vị tính', 'text'), col('Số lượng', 'decimal'),
          col('Đơn giá trước VAT', 'currency', true), col('Thuế suất', 'percent', true),
          col('Thành tiền', 'formula', true, { expr: '{Số lượng} * {Đơn giá trước VAT} * (1 + {Thuế suất} / 100)', fmt: 'currency', sum: true, words: true }),
          duAn('Dự án', true),
        ]),
      ]),
      S('Quản lý dự án xác nhận', [], dl(1)),
      S('Kế toán kiểm tra', [], dl(1)),
      S('Kế toán trưởng duyệt', [], dl(1)),
      S('Kế toán xuất hóa đơn', [F('text', 'Số hóa đơn', true), F('datetime', 'Ngày xuất hóa đơn', true, { dateKind: 'date', defaultToday: true }), F('file', 'File hóa đơn', true, { maxFiles: 3, accept: '.pdf,.xml' })], dl(1)),
    ], { titleTpl: 'Đề nghị xuất hóa đơn của {Người đề nghị} cho {Tên đơn vị}', requests: 18, days: 80 }),

    // 5. Phát hành bảo lãnh
    mk('QT-005', 'Quy trình phát hành bảo lãnh', 'Kế toán – Tài chính', 'building', 'slate', [
      S('Lập đề nghị', [
        nguoi(),
        F('text', 'Khách hàng', true),
        F('text', 'Mã số thuế', true, { format: 'digits', maxLength: 14 }),
        F('text', 'Địa chỉ', true),
        sel('Loại bảo lãnh', true, ['Bảo lãnh dự thầu', 'Bảo lãnh thực hiện hợp đồng', 'Bảo lãnh tạm ứng', 'Bảo lãnh bảo hành', 'Khác']),
        F('text', 'Điền loại bảo lãnh (nếu ở trên chọn Khác)', true, { dependsOn: '__Loại bảo lãnh', dependsValue: 'Khác' }),
        F('datetime', 'Ngày phát hành', true, { dateKind: 'date' }),
        tbl('Thông tin phát hành bảo lãnh', true, [
          col('Tên gói thầu', 'text', true), col('Tên hạng mục công việc', 'text', true), col('Hiệu lực bảo lãnh', 'text', true), col('Giá trị', 'currency', true),
          col('Tỷ lệ bảo lãnh', 'formula', false, { expr: '{Giá trị bảo lãnh} / {Giá trị} * 100', fmt: 'percent' }),
          tien('Giá trị bảo lãnh', false), duAn('Dự án', true), tep('Mẫu thư', true),
        ]),
      ]),
      S('Trưởng bộ phận duyệt', [], dl(1)),
      S('Pháp chế kiểm tra', [], dl(2)),
      S('Kế toán trưởng duyệt', [], dl(1)),
      S('Giám đốc phê duyệt', [], dl(2)),
      S('Kế toán làm thủ tục với ngân hàng', [F('text', 'Số thư bảo lãnh', true), F('file', 'Thư bảo lãnh đã phát hành', true)], dl(3)),
    ], { titleTpl: 'Đề nghị phát hành {Loại bảo lãnh} của {Người đề nghị}', requests: 9, days: 75 }),

    // 6. Tổ chức sự kiện
    mk('QT-006', 'Đề xuất tổ chức sự kiện', 'Hành chính – Nhân sự', 'list', 'rose', [
      S('Lập đề xuất', [
        nguoi('Người đề xuất'),
        F('text', 'Tên sự kiện', true),
        F('text', 'Mục đích', true),
        F('datetime', 'Thời gian tổ chức', true, { dateKind: 'date', dateLimit: 'notPast' }),
        F('file', 'File kế hoạch tổng thể', true),
        F('currency', 'Ngân sách dự kiến', true, { showWords: true }),
        F('file', 'Bảng tính chi tiết ngân sách', true),
        F('file', 'Báo giá NCC'),
        F('text', 'Trưởng BTC', true),
        F('file', 'Danh sách thành viên BTC', true),
      ]),
      S('Trưởng bộ phận duyệt', [], dl(1)),
      S('Hành chính – Nhân sự xem xét', [], dl(2)),
      S('Truyền thông góp ý', [], dl(2)),
      S('Kế toán kiểm tra ngân sách', [], dl(1)),
      S('Kế toán trưởng duyệt', [], dl(1)),
      S('Giám đốc phê duyệt', [], dl(2)),
    ], { titleTpl: 'Đề xuất tổ chức sự kiện của {Người đề xuất}', requests: 6, days: 70 }),

    // 7. Mua hàng hoá, dịch vụ
    mk('QT-007', 'Đề xuất mua hàng hóa, dịch vụ', 'Mua hàng', 'cart', 'orange', [
      S('Lập đề xuất', [
        nguoi('Người đề xuất'),
        F('textarea', 'Mục đích mua sắm', true),
        F('datetime', 'Thời gian mua sắm dự kiến', true, { dateKind: 'date' }),
        tbl('Danh mục hàng hóa cần mua', true, [
          STT(), col('Tên hàng hóa, dịch vụ', 'text', true), col('Thông số kỹ thuật', 'text'), col('Xuất xứ', 'text'), col('Đơn vị tính', 'text', true),
          col('Số lượng', 'decimal', true), loaiTien(), col('Đơn giá tham khảo', 'currency', true),
          col('Thành tiền', 'formula', false, { expr: '{Số lượng} * {Đơn giá tham khảo}', fmt: 'currency', sum: true, words: true }),
        ]),
        tbl('So sánh Vendor', true, [
          STT(), col('Tên nhà cung cấp', 'text', true), col('Mã số thuế', 'text', true), col('Tổng giá trị NCC báo giá', 'currency', true),
          col('Ưu điểm', 'text', true), col('Nhược điểm', 'text', true), deXuat(), col('Lý do chọn/Không chọn', 'text', true), tep('Báo giá'),
        ]),
        F('file', 'Tài liệu đính kèm'),
      ]),
      S('Trưởng bộ phận duyệt', [], dl(1)),
      S('Phòng Mua hàng thẩm định', [], dl(3)),
      S('Giám đốc phê duyệt', [], dl(2)),
    ], { titleTpl: 'Đề xuất mua HHDV của {Người đề xuất}', requests: 27, days: 65 }),

    // 8. Làm thêm giờ
    mk('QT-008', 'Đề xuất làm thêm giờ (OT)', 'Hành chính – Nhân sự', 'clock', 'blue', [
      S('Lập yêu cầu', [
        nguoi('Người đề xuất'),
        sel('Hình thức OT', true, ['Theo giờ', 'Theo ngày', 'Theo khối lượng công việc'], { defaultOn: true, defaultValue: 'Theo giờ' }),
        F('textarea', 'Lý do làm thêm giờ', true),
        F('textarea', 'Mục tiêu công việc', true),
        F('textarea', 'Hiệu quả kỳ vọng', true),
        F('textarea', 'KPI hoặc sản phẩm công việc gắn kèm', true),
        F('file', 'Tài liệu đính kèm', true),
        tbl('Ngân sách OT', true, [STT(), col('Nhân viên', 'employee', true), col('Từ', 'date', true), col('Đến', 'date', true), loaiTien(), tien('Số tiền'), duAn('Dự án', true), col('Ghi chú', 'text')]),
      ]),
      S('Quản lý trực tiếp duyệt', [], dl(1)),
      S('Quản lý dự án xác nhận', [], dl(1)),
      S('Giám đốc khối duyệt', [], dl(1)),
      S('Hành chính – Nhân sự kiểm tra', [], dl(1)),
      S('Kế toán kiểm tra ngân sách', [], dl(1)),
      S('Giám đốc phê duyệt', [], dl(2)),
    ], { titleTpl: 'Đề xuất OT của {Người đề xuất}', requests: 52, days: 60 }),

    // 10. Thuê ngoài cho dự án
    mk('QT-010', 'Đề xuất thuê ngoài cho dự án', 'Dự án', 'project', 'violet', [
      S('Lập đề xuất', [
        nguoi('Người đề xuất'),
        tbl('Thông tin dự án', true, [
          duAn('Dự án', true), col('Quản lý dự án', 'text', true), col('Thời hạn hoàn thành', 'date', true), col('Phạm vi công việc thuê ngoài', 'text', true),
          col('Nguồn lực nội bộ hiện có', 'text'), col('Lý do thuê ngoài', 'text', true), col('Rủi ro nếu không thuê ngoài', 'text'),
        ]),
        tbl('Thông tin đề xuất', true, [
          col('Hạng mục thuê ngoài', 'text', true), col('Mô tả công việc cụ thể', 'text', true), col('Đầu ra/Bàn giao cần đạt', 'text', true), col('Tiêu chuẩn nghiệm thu', 'text', true),
          col('Tài liệu/Sản phẩm Vendor phải bàn giao', 'text', true), coKhong('Có bàn giao Source Code không?'), coKhong('Có bàn giao tài liệu kỹ thuật không?'),
          coKhong('Có yêu cầu bảo hành/hỗ trợ sau bàn giao không?'),
        ]),
        tbl('Cơ sở xác định giá thuê ngoài', true, [
          col('Phương pháp tính giá', 'select', true, { options: ['Theo man-month', 'Theo khối lượng', 'Trọn gói'] }), col('Số lượng nhân sự/Khối lượng', 'decimal', true), col('Đơn giá', 'currency', true),
          col('Tổng giá trị (Đã bao gồm VAT/PIT)', 'formula', true, { expr: '{Số lượng nhân sự/Khối lượng} * {Đơn giá}', fmt: 'currency', sum: true, words: true }),
          col('Giá nội bộ dự kiến tự thực hiện', 'currency', true), col('Điều khoản thanh toán', 'text', true), col('Điều kiện nghiệm thu trước thanh toán', 'text', true), col('Ghi chú', 'text'),
        ]),
        tbl('Bảng báo giá so sánh Vendor', true, [
          STT(), col('Vendor/NCC', 'text', true), col('MST', 'text'), col('Tổng giá trị hợp đồng theo yêu cầu đề xuất', 'currency', true),
          col('Ưu điểm', 'text', true), col('Nhược điểm', 'text', true), deXuat(), col('Lý do chọn/Không chọn', 'text', true), tep('Báo giá'),
        ]),
        F('file', 'Tài liệu đính kèm', true),
      ]),
      S('Quản lý dự án xem xét', [], dl(1)),
      S('Giám đốc khối duyệt', [], dl(2)),
      S('Kế toán trưởng thẩm định', [], dl(2)),
      S('Giám đốc phê duyệt', [], dl(2)),
    ], { titleTpl: 'Đề xuất thuê ngoài cho dự án của {Người đề xuất}', requests: 8, days: 55 }),

    // 11. Khen thưởng
    mk('QT-011', 'Đề xuất khen thưởng', 'Hành chính – Nhân sự', 'docs', 'green', [
      S('Lập đề xuất', [
        nguoi('Người đề xuất'),
        F('text', 'Tên đợt khen thưởng', true),
        F('org', 'Khối/Phòng ban', true),
        sel('Hình thức khen thưởng', true, ['Tiền mặt', 'Hiện vật', 'Giấy khen', 'Kết hợp tiền và giấy khen']),
        F('currency', 'Tổng giá trị', true),
        sel('Đối tượng khen thưởng', true, ['Cá nhân', 'Tập thể', 'Cá nhân và tập thể']),
        F('textarea', 'Căn cứ', true),
        F('textarea', 'Lý do', true),
        tbl('Danh sách khen thưởng', false, [STT(), col('Tên nhân viên/Phòng ban/Bộ phận', 'text'), col('Chức vụ', 'text'), tien('Số tiền', false), duAn('Dự án'), col('Ghi chú', 'text')]),
        F('file', 'Tài liệu đính kèm'),
      ]),
      S('Trưởng bộ phận duyệt', [], dl(1)),
      S('Hành chính – Nhân sự thẩm định', [], dl(2)),
      S('Kế toán kiểm tra', [], dl(1)),
      S('Kế toán trưởng duyệt', [], dl(1)),
      S('Giám đốc phê duyệt', [], dl(2)),
    ], { titleTpl: 'Đề xuất khen thưởng của {Người đề xuất}', requests: 4, days: 50 }),
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
