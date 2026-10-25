/**
 * ContractsPage — "Contracts" (Human Resources) · Quản lý hợp đồng lao động — màn RIÊNG, dữ liệu riêng (không dùng Employees).
 * Giao diện: bộ khung ERP như màn Dự án kinh doanh (thanh tiêu đề, ô KPI, thẻ hồ sơ, khung có tiêu đề, bảng kẻ ô).
 *
 *  Danh sách : 4 ô tổng quan (Đang có hiệu lực theo loại HĐ · Chưa có hợp đồng · Sắp hết hạn [7/15/30/60/90 ngày] · Hết hạn chưa tái ký)
 *              — bấm để lọc · thẻ chế độ xem · đơn vị · tìm kiếm · Danh sách / Chia đôi · cột hiển thị · bộ lọc · xuất Excel · phân trang.
 *  Import hợp đồng (nút riêng) · Thêm ▾ : Thêm hợp đồng · Import từ Excel · Tải file mẫu nhập.   ⋯ : Tái ký / In / Xoá đã chọn · Xuất Excel.
 *  Chi tiết  : xem / sửa / thêm trên trang (không popup) — người lao động, thông tin HĐ, lương & phụ cấp & bảo hiểm, người ký,
 *              đính kèm, ghi chú · thẻ Quá trình hợp đồng · Lịch sử · In HĐ · Sao chép · Tái ký · Xoá.
 *  Quy tắc (theo iHRP): trường * bắt buộc · không cho 2 HĐ của 1 NLĐ có thời gian hiệu lực giao nhau · Số HĐ tự sinh, không trùng
 *              · Ngày hết hạn tự tính theo loại / thời hạn · Người ký mặc định theo Thiết lập người ký (đơn vị + loại HĐ + ngày hiệu lực).
 *  ĐVT: VNĐ.
 */
import React, { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import * as XLSX from 'xlsx';
import {
  AlertTriangle, ArrowDown, ArrowUp, Check, ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Columns2, Copy, Download, Eye,
  FileSignature, FileSpreadsheet, Filter, History, LayoutList, List, ListOrdered, MoreHorizontal, NotebookPen, Paperclip, PenLine, Pencil, Pin, Plus,
  FilePlus2, Printer, RefreshCw, Save, Search, Settings, Settings2, Table2, Trash2, Upload, User, UserPlus, Wallet, X,
} from 'lucide-react';
import { CheckBox, DateInput, InfoGrid, addDays, addMonths, dmy, nowIso, norm, parseDateCell, today, uid } from './EmployeePage';
import { Btn, ErpPage, ErpTitleBar, FieldTable, FolderTabs, KpiBox, Panel, Segmented, Tag, erp } from './erp/Erp';
import {
  KIND_COLOR, KIND_LABEL, activeCompanies, colorOf, companyById, defaultCompanyId, defaultTerm, defaultTypeOf, getCatalog, insuranceOf, isK, kindOf, rateOf,
  KIND_SHORT, attachmentsFor, contractNoBase, fieldLabel, shortOf, templateForType, termsOf, typeDef, typeNames, useCatalog, type AppendixTypeDef, type Kind,
} from './contracts/catalog';
import { downloadBytes, mergeDocx, soThanhChu, zip } from './contracts/docx';
import { PrintDialog, type PrintItem, type PrintJob } from './contracts/PrintDialog';

// ==========================================================================
// Danh mục
// ==========================================================================
const ME = 'hr.lan';
/** Loại hợp đồng lấy từ Danh mục hợp đồng (Loại hợp đồng): tên, nhóm, thời hạn, mức hưởng, bảo hiểm mặc định. */
type CType = string;
// Tên 3 loại HĐ có sẵn trong danh mục — chỉ dùng cho dữ liệu mẫu
const TV: CType = 'Hợp đồng thử việc';
const XD: CType = 'Hợp đồng xác định thời hạn';
const KXD: CType = 'Hợp đồng không xác định thời hạn';
const TT: CType = 'Hợp đồng thực tập';
const SEED_TYPES: CType[] = [TV, XD, KXD, 'Hợp đồng học việc', TT, 'Hợp đồng dịch vụ'];
const UNITS = [
  'Ban Giám đốc',
  'Khối Chính phủ (G1)',
  'Khối Doanh nghiệp (G2)',
  'Khối Tài chính – Ngân hàng (BFSI)',
  'Trung tâm Sản xuất phần mềm',
  'Phòng Kinh doanh',
  'Phòng Nhân sự',
  'Phòng Tài chính – Kế toán',
];
const UNIT_POS: Record<string, string[]> = {
  'Ban Giám đốc': ['Phó Tổng Giám đốc', 'Giám đốc vận hành', 'Trợ lý Ban Giám đốc'],
  'Khối Chính phủ (G1)': ['Giám đốc dự án', 'Chuyên viên phân tích nghiệp vụ', 'Kỹ sư phần mềm'],
  'Khối Doanh nghiệp (G2)': ['Quản lý dự án', 'Kỹ sư phần mềm', 'Chuyên viên tư vấn giải pháp'],
  'Khối Tài chính – Ngân hàng (BFSI)': ['Kỹ sư kiểm thử', 'Kỹ sư phần mềm', 'Chuyên viên phân tích nghiệp vụ'],
  'Trung tâm Sản xuất phần mềm': ['Trưởng nhóm phát triển', 'Kỹ sư phần mềm', 'Kỹ sư DevOps', 'Thiết kế UI/UX'],
  'Phòng Kinh doanh': ['Chuyên viên kinh doanh', 'Trưởng phòng kinh doanh', 'Chuyên viên chăm sóc khách hàng'],
  'Phòng Nhân sự': ['Chuyên viên tuyển dụng', 'Chuyên viên C&B', 'Trưởng phòng Nhân sự'],
  'Phòng Tài chính – Kế toán': ['Kế toán tổng hợp', 'Kế toán thanh toán', 'Kế toán trưởng'],
};
const WORKPLACES = ['Văn phòng Hà Nội', 'Văn phòng TP. Hồ Chí Minh', 'Văn phòng Đà Nẵng', 'Onsite tại khách hàng'];
const WORK_TIMES = ['Giờ hành chính (8h/ngày, T2–T6)', 'Ca kíp', 'Bán thời gian', 'Linh hoạt'];
/** Các khoản hỗ trợ theo Phụ lục 01 của bộ mẫu hợp đồng (trường trộn tương ứng). */
const SUPPORTS = [
  { name: 'Hỗ trợ ăn trưa', field: 'Trợ_cấp_ăn_trưa' },
  { name: 'Hỗ trợ xăng xe', field: 'Trợ_cấp_xăng_xe' },
  { name: 'Hỗ trợ điện thoại', field: 'Trợ_cấp_điện_thoại' },
  { name: 'Hỗ trợ nhà ở', field: 'Trợ_cấp_nhà_ở' },
];
const ID_PLACES = ['Cục Cảnh sát QLHC về TTXH', 'Bộ Công an', 'Cục Cảnh sát ĐKQL cư trú và DLQG về dân cư'];

// ==========================================================================
// Kiểu dữ liệu
// ==========================================================================
export interface Worker {
  id: string;
  code: string;
  name: string;
  gender: 'Nam' | 'Nữ';
  birthDate: string;
  idNo: string; // Số CCCD / Hộ chiếu
  idDate: string; // Ngày cấp
  idPlace: string; // Nơi cấp
  address: string; // Nơi đăng ký hộ khẩu / thường trú
  currentAddress: string; // Nơi ở hiện tại
  phone: string;
  position: string;
  unit: string;
  joinDate: string;
  working: boolean;
}
interface Allowance {
  id: string;
  name: string;
  amount: number;
}
interface CFile {
  id: string;
  name: string;
  size: number;
}
interface CLog {
  at: string;
  by: string;
  action: string;
  changes?: string[];
}
export interface Contract {
  id: string;
  workerId: string;
  companyId: string; // Công ty ký HĐ (Danh mục công ty)
  no: string;
  type: CType;
  term: string; // '1 năm' · '2 tháng' · '' (KXĐ)
  signDate: string;
  from: string;
  to: string; // '' = không thời hạn
  unit: string; // Đơn vị ký hợp đồng
  position: string; // Vị trí công việc
  workplace: string;
  workTime: string;
  jobDesc: string;
  baseSalary: number; // lương cơ bản gốc
  rate: number; // mức hưởng %
  allowances: Allowance[]; // 4 khoản hỗ trợ: ăn trưa, xăng xe, điện thoại, nhà ở
  perfBonus: number; // thưởng hiệu quả công việc (tạm tính)
  insurance: { bhxh: boolean; bhyt: boolean; bhtn: boolean };
  signerSalutation: string; // Ông / Bà
  signer: string;
  signerTitle: string;
  authorization: string;
  signPlace: string;
  files: CFile[];
  note: string;
  history: CLog[];
}
interface SignerSetting {
  id: string;
  unit: string; // '' = tất cả đơn vị
  types: CType[];
  from: string;
  salutation: string;
  signer: string;
  signerTitle: string;
  authorization: string;
}

// ==========================================================================
// Ngày, tiền, trạng thái
// ==========================================================================
const money = (n?: number) => (n ? Math.round(n).toLocaleString('en-US') : '');
const parseMoney = (s: string) => Number(String(s).replace(/[^\d]/g, '')) || 0;
const salaryOf = (c: Pick<Contract, 'baseSalary' | 'rate'>) => Math.round(((c.baseSalary || 0) * (c.rate ?? 100)) / 100);
const allowTotal = (c: Contract) => c.allowances.reduce((s, a) => s + (a.amount || 0), 0);
const supportsOf = (amounts: number[]): Allowance[] => SUPPORTS.map((x, i) => ({ id: uid(), name: x.name, amount: amounts[i] || 0 }));
/** Chuẩn hoá về đúng 4 khoản hỗ trợ (giữ số tiền theo tên). */
const normSupports = (list: Allowance[]) => SUPPORTS.map((x) => ({ id: uid(), name: x.name, amount: list.find((a) => a.name === x.name)?.amount || 0 }));
const supportAmt = (c: Pick<Contract, 'allowances'>, name: string) => c.allowances.find((a) => a.name === name)?.amount || 0;
/** Số HĐ theo mẫu: «Mã_NV»/«ký hiệu công ty»/«ký hiệu loại HĐ» — trùng thì thêm -2, -3… */
const nextContractNo = (empCode: string, companyId: string, type: CType, contracts: Pick<Contract, 'id' | 'no'>[], selfId = '') => {
  const base = contractNoBase(empCode || '…', companyId, type);
  const used = new Set(contracts.filter((c) => c.id !== selfId).map((c) => c.no.toLowerCase()));
  if (!used.has(base.toLowerCase())) return base;
  for (let i = 2; ; i++) if (!used.has(`${base}-${i}`.toLowerCase())) return `${base}-${i}`;
};
const titleCase = (s: string) => s.toLocaleLowerCase('vi').replace(/(^|\s)(\S)/gu, (_, a: string, b: string) => a + b.toLocaleUpperCase('vi'));
const daysBetween = (a: string, b: string) => Math.round((new Date(`${b}T00:00:00`).getTime() - new Date(`${a}T00:00:00`).getTime()) / 86400000);
const termMonths = (type: CType, term: string) => termsOf(type).find((x) => x.label === term)?.months || 0;
const endOf = (type: CType, term: string, from: string) => {
  const m = termMonths(type, term);
  return isK(type, 'KXD') || !m || !from ? '' : addDays(addMonths(from, m), -1);
};
/** Tái ký: Thử việc → HĐ xác định thời hạn 1 năm → 2 năm (cùng loại, nếu danh mục cho phép) → Không xác định thời hạn. */
const nextOf = (c: Pick<Contract, 'type' | 'term'>): { type: CType; term: string } => {
  const k = kindOf(c.type);
  if (k === 'TV' || k === 'OTHER') {
    if (k === 'OTHER') return { type: defaultTypeOf('TV'), term: defaultTerm(defaultTypeOf('TV')) };
    const t = defaultTypeOf('XD');
    return { type: t, term: termsOf(t).some((x) => x.months === 12) ? '1 năm' : defaultTerm(t) };
  }
  if (k === 'XD' && termMonths(c.type, c.term) <= 12 && termsOf(c.type).some((x) => x.months === 24)) return { type: c.type, term: '2 năm' };
  return { type: defaultTypeOf('KXD'), term: '' };
};
const isValid = (c: Contract, t = today()) => c.from <= t && (!c.to || c.to >= t);
const overlaps = (a: Pick<Contract, 'from' | 'to'>, b: Pick<Contract, 'from' | 'to'>) => a.from <= (b.to || '9999-12-31') && b.from <= (a.to || '9999-12-31');

// ==========================================================================
// Dữ liệu mẫu (giả lập) — NLĐ, hợp đồng, thiết lập người ký
// ==========================================================================
const FAMILY = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Ngô', 'Dương', 'Lý', 'Phan', 'Trịnh', 'Đinh'];
const MIDDLE_M = ['Văn', 'Đức', 'Minh', 'Quang', 'Hữu', 'Thành', 'Công', 'Gia'];
const MIDDLE_F = ['Thị', 'Thu', 'Ngọc', 'Thanh', 'Mai', 'Phương', 'Hồng', 'Khánh'];
const GIVEN_M = ['Anh', 'Bảo', 'Cường', 'Dũng', 'Hải', 'Hùng', 'Khoa', 'Long', 'Nam', 'Phong', 'Quân', 'Sơn', 'Tuấn', 'Việt'];
const GIVEN_F = ['An', 'Chi', 'Giang', 'Hà', 'Hương', 'Lan', 'Linh', 'My', 'Ngân', 'Oanh', 'Quỳnh', 'Trang', 'Vy', 'Yến'];
const BASE_BY_POS = (pos: string) =>
  /Phó Tổng|Giám đốc|Kế toán trưởng/.test(pos) ? 60_000_000 : /Trưởng|Quản lý/.test(pos) ? 40_000_000 : /Kỹ sư|Thiết kế|DevOps|phân tích|tư vấn/.test(pos) ? 24_000_000 : 15_000_000;

const SIGNER_SEED: SignerSetting[] = [{ id: 's1', unit: '', types: SEED_TYPES, from: '2022-01-01', salutation: 'Ông', signer: 'Lê Hoài Thanh', signerTitle: 'Giám đốc', authorization: '' }];
/** Người ký mặc định: thiết lập khớp đơn vị (cụ thể hơn "tất cả") + loại HĐ, có hiệu lực đến ngày ký — mới nhất. */
const findSigner = (unit: string, type: CType, date: string, list: SignerSetting[]) =>
  list
    .filter((s) => (!s.unit || s.unit === unit) && s.types.includes(type) && s.from <= (date || today()))
    .sort((a, b) => Number(!!b.unit) - Number(!!a.unit) || b.from.localeCompare(a.from))[0];

/** Người ký mặc định: theo Thiết lập người ký; không có thiết lập phù hợp → người đại diện theo pháp luật của công ty ký HĐ. */
const signerOf = (unit: string, type: CType, date: string, list: SignerSetting[], companyId: string) => {
  const sg = findSigner(unit, type, date, list);
  if (sg) return sg;
  const co = companyById(companyId);
  return co ? { salutation: co.legalRepSalutation, signer: co.legalRep, signerTitle: co.legalRepTitle, authorization: '' } : undefined;
};

const mkContract = (w: Worker, type: CType, term: string, from: string, all: Contract[]): Contract => {
  const other = isK(type, 'OTHER'); // học việc / thực tập / dịch vụ: khoản hỗ trợ cố định
  const base = other ? 3_000_000 : BASE_BY_POS(w.position);
  const tv = isK(type, 'TV');
  const ins = insuranceOf(type);
  const sg = findSigner(w.unit, type, from, SIGNER_SEED);
  const companyId = w.unit === 'Trung tâm Sản xuất phần mềm' ? 'co-2' : 'co-1';
  const n = Number(w.code.replace(/\D/g, '')) || 0;
  return {
    id: uid(),
    workerId: w.id,
    companyId,
    no: nextContractNo(w.code, companyId, type, all),
    type,
    term,
    signDate: from,
    from,
    to: endOf(type, term, from),
    unit: w.unit,
    position: w.position,
    workplace: WORKPLACES[(w.code.charCodeAt(4) || 0) % 3],
    workTime: WORK_TIMES[0],
    jobDesc: `${w.position} — ${w.unit}`,
    baseSalary: base,
    rate: rateOf(type),
    allowances: supportsOf(other ? [] : [730_000, n % 3 ? 500_000 : 0, base >= 24_000_000 ? 300_000 : 0, base >= 40_000_000 ? 2_000_000 : 0]),
    perfBonus: tv || isK(type, 'OTHER') ? 0 : base >= 40_000_000 ? 5_000_000 : base >= 24_000_000 ? 2_000_000 : 1_000_000,
    insurance: { bhxh: ins, bhyt: ins, bhtn: ins },
    signerSalutation: sg?.salutation || '',
    signer: sg?.signer || '',
    signerTitle: sg?.signerTitle || '',
    authorization: sg?.authorization || '',
    signPlace: 'Hà Nội',
    files: [],
    note: '',
    history: [{ at: `${from}T02:00:00.000Z`, by: ME, action: 'Tạo hợp đồng' }],
  };
};

/** Sinh dữ liệu mẫu theo kịch bản để đủ các trạng thái: không thời hạn, xác định thời hạn, thử việc, sắp hết hạn, hết hạn chưa tái ký, chưa có HĐ. */
const buildSeed = () => {
  const t = today();
  const workers: Worker[] = [];
  const contracts: Contract[] = [];
  let r = 7;
  const rnd = (n: number) => ((r = (r * 9301 + 49297) % 233280), Math.floor((r / 233280) * n));
  for (let i = 0; i < 60; i++) {
    const female = i % 3 === 1;
    const name = `${FAMILY[rnd(FAMILY.length)]} ${(female ? MIDDLE_F : MIDDLE_M)[rnd(8)]} ${(female ? GIVEN_F : GIVEN_M)[rnd(14)]}`.toUpperCase();
    const unit = UNITS[i % UNITS.length];
    const pos = UNIT_POS[unit][rnd(UNIT_POS[unit].length)];
    const scen = i % 10; // 0–3 KXĐ · 4 XĐ sắp hết hạn · 5 XĐ còn hạn · 6 XĐ 3 năm · 7 hết hạn chưa tái ký · 8 thử việc · 9 chưa có HĐ
    const join =
      scen <= 3 ? addDays(t, -(560 + rnd(1300))) : scen === 4 ? addDays(t, -(421 - rnd(20))) : scen === 5 ? addDays(t, -(90 + rnd(200))) : scen === 6 ? addDays(t, -(200 + rnd(500))) : scen === 7 ? addDays(t, -(430 + rnd(120))) : scen === 8 ? addDays(t, -(3 + rnd(45))) : addDays(t, -rnd(20));
    const w: Worker = {
      id: `W${String(i + 1).padStart(3, '0')}`,
      code: `NV${String(1001 + i)}`,
      name,
      gender: female ? 'Nữ' : 'Nam',
      birthDate: `${1985 + rnd(16)}-${String(1 + rnd(12)).padStart(2, '0')}-${String(1 + rnd(28)).padStart(2, '0')}`,
      idNo: `0${String(10_000_000_000 + rnd(9_000_000) * 997).slice(0, 11)}`,
      idDate: `${2021 + rnd(4)}-${String(1 + rnd(12)).padStart(2, '0')}-${String(1 + rnd(28)).padStart(2, '0')}`,
      idPlace: ID_PLACES[rnd(10) < 8 ? 0 : 1],
      address: ['Cầu Giấy, Hà Nội', 'Đống Đa, Hà Nội', 'Hà Đông, Hà Nội', 'Nam Định', 'Thái Bình', 'Nghệ An', 'Hải Châu, Đà Nẵng'][rnd(7)],
      currentAddress: ['Cầu Giấy, Hà Nội', 'Thanh Xuân, Hà Nội', 'Nam Từ Liêm, Hà Nội', 'Hoàng Mai, Hà Nội', 'Ba Đình, Hà Nội'][rnd(5)],
      phone: `0900 000 ${String(100 + i).padStart(3, '0')}`, // số giả lập
      position: pos,
      unit,
      joinDate: join,
      working: true,
    };
    workers.push(w);
    if (scen === 9) continue;
    if (scen === 8 && i >= 40) {
      w.position = 'Thực tập sinh';
      contracts.push(mkContract(w, TT, '3 tháng', join, contracts)); // sinh viên thực tập
      continue;
    }
    const tv = mkContract(w, TV, '2 tháng', join, contracts);
    contracts.push(tv);
    if (scen === 8) continue;
    const f1 = addDays(tv.to, 1);
    if (scen === 6) {
      contracts.push(mkContract(w, XD, '3 năm', f1, contracts));
      continue;
    }
    const c1 = mkContract(w, XD, '1 năm', f1, contracts);
    contracts.push(c1);
    if (scen === 4 || scen === 5 || scen === 7) continue;
    contracts.push(mkContract(w, KXD, '', addDays(c1.to, 1), contracts));
  }
  // 2 NLĐ đã nghỉ việc (HĐ đã chấm dứt)
  workers.slice(0, 2).forEach((w) => (w.working = false));
  return { workers, contracts };
};

// ==========================================================================
// Kho dữ liệu riêng của màn hợp đồng
// ==========================================================================
type Store = { workers: Worker[]; contracts: Contract[]; signers: SignerSetting[] };
let STATE: Store = { ...buildSeed(), signers: SIGNER_SEED };
const SUBS = new Set<() => void>();
const update = (fn: (s: Store) => Store) => {
  STATE = fn(STATE);
  SUBS.forEach((f) => f());
};
const useStore = () => useSyncExternalStore((cb) => (SUBS.add(cb), () => void SUBS.delete(cb)), () => STATE);

/** Trạng thái hiển thị của HĐ. */
const stateOf = (c: Contract, all: Contract[], soonDays: number): { text: string; cls: string } => {
  const t = today();
  const later = all.some((x) => x.workerId === c.workerId && x.id !== c.id && x.from > c.from);
  if (c.from > t) return { text: 'Chưa có hiệu lực', cls: 'bg-sky-50 text-sky-700 border-sky-300' };
  if (c.to && c.to < t) return later ? { text: 'Đã tái ký', cls: 'bg-slate-100 text-slate-500 border-slate-300' } : { text: 'Hết hạn', cls: 'bg-rose-50 text-rose-700 border-rose-300' };
  if (c.to && c.to <= addDays(t, soonDays) && !later) return { text: 'Sắp hết hạn', cls: 'bg-orange-50 text-orange-700 border-orange-300' };
  return { text: 'Đang hiệu lực', cls: 'bg-emerald-50 text-emerald-700 border-emerald-300' };
};

const validate = (c: Contract, all: Contract[]): Record<string, string> => {
  const e: Record<string, string> = {};
  if (!c.workerId) e.workerId = 'Chọn người lao động';
  if (!c.companyId) e.companyId = 'Chọn công ty ký hợp đồng';
  if (!c.no.trim()) e.no = 'Bắt buộc';
  else if (all.some((x) => x.id !== c.id && x.no.toLowerCase() === c.no.trim().toLowerCase())) e.no = 'Số hợp đồng đã tồn tại';
  if (!c.type) e.type = 'Bắt buộc';
  if (!isK(c.type, 'KXD') && !c.term) e.term = 'Bắt buộc';
  if (!c.signDate) e.signDate = 'Bắt buộc';
  if (!c.from) e.from = 'Bắt buộc';
  if (!isK(c.type, 'KXD') && !c.to) e.to = 'Bắt buộc';
  if (c.to && c.from && c.to < c.from) e.to = 'Trước ngày có hiệu lực';
  if (!c.unit) e.unit = 'Bắt buộc';
  if (!c.position.trim()) e.position = 'Bắt buộc';
  if (c.rate < 0 || c.rate > 100) e.rate = 'Từ 0 đến 100%';
  const hit = c.workerId && c.from ? all.find((x) => x.id !== c.id && x.workerId === c.workerId && overlaps(c, x)) : undefined;
  if (hit) e.from = `Giao thời gian hiệu lực với HĐ ${hit.no} (${dmy(hit.from)} → ${hit.to ? dmy(hit.to) : 'không thời hạn'})`;
  return e;
};
const LABELS: [keyof Contract, string][] = [
  ['companyId', 'Công ty ký HĐ'], ['no', 'Số hợp đồng'], ['type', 'Loại hợp đồng'], ['term', 'Thời hạn'], ['signDate', 'Ngày ký'], ['from', 'Ngày có hiệu lực'], ['to', 'Ngày hết hạn'],
  ['unit', 'Đơn vị ký HĐ'], ['position', 'Vị trí công việc'], ['workplace', 'Nơi làm việc'], ['workTime', 'Thời gian làm việc'], ['jobDesc', 'Mô tả công việc'],
  ['baseSalary', 'Lương cơ bản gốc'], ['rate', 'Mức hưởng (%)'], ['perfBonus', 'Thưởng hiệu quả (tạm tính)'], ['signerSalutation', 'Xưng hô người ký'], ['signer', 'Người ký'], ['signerTitle', 'Chức danh người ký'], ['authorization', 'Giấy uỷ quyền'],
  ['signPlace', 'Nơi ký'], ['note', 'Ghi chú'],
];
const showV = (k: keyof Contract, v: unknown) => (k === 'companyId' ? companyById(String(v))?.name || '—' : k === 'signDate' || k === 'from' || k === 'to' ? dmy(String(v || '')) || '—' : k === 'baseSalary' || k === 'perfBonus' ? money(Number(v)) || '—' : String(v ?? '') || '—');
const diffC = (a: Contract, b: Contract) => {
  const out = LABELS.filter(([k]) => (a[k] ?? '') !== (b[k] ?? '')).map(([k, l]) => `${l}: ${showV(k, a[k])} → ${showV(k, b[k])}`);
  SUPPORTS.forEach((x) => supportAmt(a, x.name) !== supportAmt(b, x.name) && out.push(`${x.name}: ${money(supportAmt(a, x.name)) || 0} → ${money(supportAmt(b, x.name)) || 0}`));
  if (JSON.stringify(a.insurance) !== JSON.stringify(b.insurance)) out.push('Bảo hiểm: đã cập nhật');
  if (a.files.length !== b.files.length) out.push('File đính kèm: đã cập nhật');
  return out;
};
const lineOf = (c: Contract) => `${c.no} · ${shortOf(c.type)}${c.term ? ` ${c.term}` : ''} · ${dmy(c.from)} → ${c.to ? dmy(c.to) : 'không thời hạn'}`;
const blankFor = (w: Worker | undefined, s: Store, type?: CType, from?: string): Contract => {
  const last = w ? [...s.contracts].filter((c) => c.workerId === w.id).sort((a, b) => b.from.localeCompare(a.from))[0] : undefined;
  const nx = last ? nextOf(last) : { type: defaultTypeOf('TV'), term: defaultTerm(defaultTypeOf('TV')) };
  const tp = type || nx.type;
  const term = type ? defaultTerm(type) : nx.term;
  const f = from || (last?.to ? addDays(last.to, 1) : w?.joinDate && !last ? (w.joinDate > today() ? w.joinDate : today()) : today());
  const unit = w?.unit || '';
  const companyId = last && companyById(last.companyId)?.active ? last.companyId : defaultCompanyId();
  const sg = signerOf(unit, tp, f, s.signers, companyId);
  return {
    id: uid(),
    workerId: w?.id || '',
    companyId,
    no: nextContractNo(w?.code || '', companyId, tp, s.contracts),
    type: tp,
    term,
    signDate: f,
    from: f,
    to: endOf(tp, term, f),
    unit,
    position: w?.position || '',
    workplace: last?.workplace || WORKPLACES[0],
    workTime: last?.workTime || WORK_TIMES[0],
    jobDesc: last?.jobDesc || (w ? `${w.position} — ${w.unit}` : ''),
    baseSalary: last?.baseSalary || (w ? BASE_BY_POS(w.position) : 0),
    rate: rateOf(tp),
    allowances: last ? normSupports(last.allowances) : supportsOf([730_000]),
    perfBonus: last?.perfBonus || 0,
    insurance: { bhxh: insuranceOf(tp), bhyt: insuranceOf(tp), bhtn: insuranceOf(tp) },
    signerSalutation: sg?.salutation || '',
    signer: sg?.signer || '',
    signerTitle: sg?.signerTitle || '',
    authorization: sg?.authorization || '',
    signPlace: 'Hà Nội',
    files: [],
    note: '',
    history: [],
  };
};

/** Bản in mặc định (HTML → in / lưu PDF) — dùng khi loại HĐ chưa có template Word. Nhiều HĐ → nhiều trang. */
const printHtml = (items: { w: Worker; c: Contract }[]) => {
  const row = (k: string, v: string) => `<tr><td class="k">${k}</td><td>${v || '…………………………'}</td></tr>`;
  const page = ({ w, c }: { w: Worker; c: Contract }) => `<section>
<p class="c"><b>CỘNG HOÀ XÃ HỘI CHỦ NGHĨA VIỆT NAM</b><br><b><u>Độc lập – Tự do – Hạnh phúc</u></b></p>
<h1>${c.type.toUpperCase()}</h1><p class="sub">Số: ${c.no}</p>
<h2>Bên A — Người sử dụng lao động</h2><table>${row('Công ty', companyById(c.companyId)?.name || '')}${row('Địa chỉ', companyById(c.companyId)?.address || '')}${row('Mã số thuế', companyById(c.companyId)?.taxCode || '')}${row('Đơn vị', c.unit)}${row('Người đại diện', `${c.signerSalutation} ${c.signer}`.trim())}${row('Chức vụ', c.signerTitle)}${c.authorization ? row('Theo', c.authorization) : ''}</table>
<h2>Bên B — Người lao động</h2><table>${row('Họ và tên', w.name)}${row('Mã NLĐ', w.code)}${row('Giới tính', w.gender)}${row('Ngày sinh', dmy(w.birthDate))}${row('Số CCCD / Hộ chiếu', w.idNo)}${row('Ngày cấp', dmy(w.idDate))}${row('Nơi cấp', w.idPlace)}${row('Nơi đăng ký hộ khẩu', w.address)}${row('Nơi ở hiện tại', w.currentAddress)}${row('Số điện thoại', w.phone)}</table>
<h2>Điều 1. Thời hạn và công việc</h2><table>${row('Loại hợp đồng', c.type)}${row('Thời hạn', isK(c.type, 'KXD') ? 'Không xác định thời hạn' : `${c.term} — từ ${dmy(c.from)} đến ${dmy(c.to)}`)}${row('Vị trí công việc', c.position)}${row('Mô tả công việc', c.jobDesc)}${row('Nơi làm việc', c.workplace)}${row('Thời gian làm việc', c.workTime)}</table>
<h2>Điều 2. Tiền lương và phụ cấp</h2><table>${row('Lương cơ bản gốc', `${money(c.baseSalary)} VNĐ/tháng`)}${row('Mức hưởng', `${c.rate}%`)}${row('Lương cơ bản', `${money(salaryOf(c))} VNĐ/tháng`)}${c.allowances.filter((a) => a.amount).map((a) => row(a.name, `${money(a.amount)} VNĐ/tháng`)).join('')}${c.perfBonus ? row('Thưởng hiệu quả (tạm tính)', `${money(c.perfBonus)} VNĐ/tháng`) : ''}</table>
<h2>Điều 3. Bảo hiểm</h2><p>Tham gia: ${[c.insurance.bhxh && 'BHXH', c.insurance.bhyt && 'BHYT', c.insurance.bhtn && 'BHTN'].filter(Boolean).join(', ') || 'Không'} theo quy định hiện hành.</p>
${c.note ? `<h2>Ghi chú</h2><p>${c.note}</p>` : ''}
<p style="margin-top:16px">Hợp đồng lập tại ${c.signPlace || '…………'}, ngày ${dmy(c.signDate) || '…………'}, thành 02 bản có giá trị như nhau, mỗi bên giữ 01 bản.</p>
<div class="sig"><div><b>NGƯỜI LAO ĐỘNG</b><br><i>(Ký, ghi rõ họ tên)</i><br><br><br><br>${w.name}</div><div><b>NGƯỜI SỬ DỤNG LAO ĐỘNG</b><br><i>(Ký, đóng dấu)</i><br><br><br><br>${c.signer}</div></div></section>`;
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><title>${items.length === 1 ? `HĐLĐ ${items[0].c.no}` : `In ${items.length} hợp đồng`}</title>
<style>body{font-family:'Times New Roman',serif;font-size:14px;line-height:1.55;margin:40px 60px;color:#111}section{page-break-after:always}section:last-child{page-break-after:auto}
h1{text-align:center;font-size:20px;margin:6px 0 2px}.c{text-align:center}.sub{text-align:center;font-style:italic;margin-bottom:16px}table{width:100%;border-collapse:collapse;margin:4px 0 10px}
td{padding:3px 4px;vertical-align:top}td.k{width:200px;color:#333}h2{font-size:15px;margin:14px 0 4px}.sig{display:flex;justify-content:space-between;margin-top:36px;text-align:center}.sig div{width:45%}
@media print{body{margin:18mm}}</style></head><body>${items.map(page).join('')}<script>window.onload=()=>setTimeout(()=>window.print(),300)</script></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  if (!window.open(url, '_blank')) {
    const a = document.createElement('a');
    a.href = url;
    a.download = items.length === 1 ? `HDLD_${items[0].c.no}.html` : `In_hop_dong_${today()}.html`;
    a.click();
  }
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
};


/** Dữ liệu trộn vào template Word — tên trường theo bộ mẫu hợp đồng (xem màn Template hợp đồng). */
export const mergeDataOf = (c: Contract, w: Worker, appendix?: AppendixTypeDef, appendixDate = today()): Record<string, string> => {
  const co = companyById(c.companyId);
  const sal = salaryOf(c);
  const sup = allowTotal(c);
  const name = w.name.toLocaleUpperCase('vi');
  const months = termMonths(c.type, c.term);
  const d: Record<string, string> = {
    // Người lao động
    Mã_NV: w.code,
    Họ_và_tên: name,
    Họ_và_tên2: titleCase(w.name),
    Họ_tên_1: name,
    Xưng_hô_NLĐ: w.gender === 'Nữ' ? 'Bà' : 'Ông',
    Giới_tính: w.gender,
    Bday: dmy(w.birthDate),
    Số_CMNDCCCD_Hộ_chiếu: w.idNo,
    Date_of_Issue: dmy(w.idDate),
    Nơi_cấp: w.idPlace,
    Địa_chỉ_thường_trú: w.address,
    Nơi_ở_hiện_tại: w.currentAddress,
    SĐT: w.phone,
    Ngày_vào_làm: dmy(w.joinDate),
    // Hợp đồng
    Số_hợp_đồng: c.no,
    Loại_hợp_đồng: c.type,
    Contract_start: dmy(c.from),
    Contract_end: c.to ? dmy(c.to) : '',
    Số_tháng_HD: months ? String(months) : '',
    Thời_hạn: isK(c.type, 'KXD') ? 'Không xác định thời hạn' : c.term,
    Ngày_ký: dmy(c.signDate),
    Nơi_ký: c.signPlace,
    Đơn_vị: c.unit,
    Vị_trí_công_việc: c.position,
    Nơi_làm_việc: c.workplace,
    Thời_gian_làm_việc: c.workTime,
    Mô_tả_công_việc: c.jobDesc,
    Bảo_hiểm: [c.insurance.bhxh && 'BHXH', c.insurance.bhyt && 'BHYT', c.insurance.bhtn && 'BHTN'].filter(Boolean).join(', ') || 'Không tham gia',
    Ghi_chú: c.note,
    // Lương & hỗ trợ
    Lương_Cơ_bản: money(sal) || '0',
    LCB_bằng_chữ: soThanhChu(sal),
    Lương_gốc: money(c.baseSalary) || '0',
    Mức_hưởng: String(c.rate),
    HQCV_tạm_tính: money(c.perfBonus) || '0',
    Tổng_hỗ_trợ: money(sup) || '0',
    Tổng_thu_nhập: money(sal + sup + (c.perfBonus || 0)) || '0',
    // Người ký
    Xưng_hô: c.signerSalutation,
    Người_đại_diện_ký: c.signer,
    Chức_vụ: c.signerTitle,
    Giấy_ủy_quyền: c.authorization,
    // Phụ lục (theo hợp đồng đang áp dụng)
    Mã_Hợp_đồng_hiện_tại: c.no,
    DS_Nhân_viênMã_NV_cũ1: w.code,
    Ngày_bắt_đầu_HD: dmy(c.from),
    Ngày_ký_HD_hiện_tại_text: dmy(c.signDate),
    Ngày_áp_dụng_text: dmy(appendixDate),
    Tên_phụ_lục: appendix?.name || '',
    Nội_dung_điều_chỉnh: appendix?.changes.join(', ') || '',
    // Công ty
    Tên_công_ty: co?.name || '',
    Tên_viết_tắt: co?.shortName || '',
    Mã_số_thuế: co?.taxCode || '',
    Địa_chỉ_công_ty: co?.address || '',
    Điện_thoại_công_ty: co?.phone || '',
    Đại_diện_pháp_luật: co?.legalRep || '',
    Ngày_in: dmy(today()),
  };
  SUPPORTS.forEach((x) => (d[x.field] = money(supportAmt(c, x.name)) || '0'));
  // các tên trường khác nhau trong bộ mẫu nhưng cùng dữ liệu
  d.Ngày_sinh = d.BOD_text = d.Bday;
  d.Ngày_cấp = d.Ngày_cấp_text = d.Date_of_Issue;
  d.Người_ký = d.Người_đại_diện_ký;
  d.HQCV = d.HQCV_tạm_tính;
  d.Ngày_ký_Phụ_lục_điều_chỉnh = d.Ngày_áp_dụng_text;
  return d;
};
/** Trường được phép để trống khi in (không cảnh báo). */
const OPTIONAL_FIELDS = new Set(['Giấy_ủy_quyền', 'Ghi_chú', 'Mô_tả_công_việc', 'Contract_end', 'Số_tháng_HD', 'Điện_thoại_công_ty', 'Tên_phụ_lục', 'Nội_dung_điều_chỉnh', 'Mã_số_thuế']);
const safeName = (s: string) => s.replace(/[\\/:*?"<>|]+/g, '_');

/** Tạo file in từ các lệnh in của popup "In hợp đồng": mẫu Word → file .docx đã trộn (+ văn bản kèm theo); nhiều file → nén .zip.
 *  Không dùng mẫu Word → bản in mặc định. Báo các trường trong mẫu đang để trống (vd chưa nhập ngày cấp CCCD). */
const printJobs = async (jobs: PrintJob[], src: Map<string, { w: Worker; c: Contract }>, flash?: (m: string) => void) => {
  const word = jobs.filter((j) => j.main);
  const html = jobs.filter((j) => !j.main).map((j) => src.get(j.item.id)!);
  try {
    const files: { name: string; data: Uint8Array }[] = [];
    const missing = new Set<string>();
    for (const j of word) {
      const { w, c } = src.get(j.item.id)!;
      for (const t of [j.main!, ...j.extras]) {
        t.fields.forEach((k) => k in j.data && !j.data[k].trim() && !OPTIONAL_FIELDS.has(k) && missing.add(fieldLabel(k)));
        const pre = t.kind === 'HD' ? 'HDLD' : t.kind === 'PL' ? `PHULUC${j.app ? `_${j.app.code}` : ''}` : t.code.replace(/^AEQ-/, '');
        files.push({ name: `${pre}_${safeName(c.no)}_${w.code}.docx`, data: await mergeDocx(t.data!, j.data) });
      }
    }
    if (files.length === 1) downloadBytes(files[0].data, files[0].name);
    else if (files.length) downloadBytes(zip(files), `In_hop_dong_${today().replace(/-/g, '')}.zip`, 'application/zip');
    if (html.length) printHtml(html);
    const kt = word.reduce((n, j) => n + j.extras.length, 0);
    const edited = word.reduce((n, j) => n + j.edited.length, 0);
    const msg = [
      word.length === 1 ? `Đã tạo file Word theo mẫu "${word[0].main!.name}"${kt ? ` + ${kt} văn bản kèm theo (nén .zip)` : ''}` : word.length ? `Đã tạo ${files.length} file Word cho ${word.length} hợp đồng (nén .zip)` : '',
      edited ? `áp dụng ${edited} chỉnh sửa trên bản xem trước` : '',
      html.length ? `${html.length} hợp đồng dùng bản in mặc định` : '',
      missing.size ? `Còn trống: ${[...missing].slice(0, 5).join(', ')}${missing.size > 5 ? '…' : ''}` : '',
    ].filter(Boolean);
    flash?.(msg.join(' · '));
  } catch (e) {
    flash?.(`Không tạo được file Word: ${(e as Error).message}`);
  }
};
const toPrintItem = ({ w, c }: { w: Worker; c: Contract }): PrintItem => ({
  id: c.id,
  title: w.name,
  sub: `${c.no} · ${c.type}`,
  typeName: c.type,
  companyId: c.companyId,
  defaultTpl: templateForType(c.type, c.companyId),
  attachments: attachmentsFor(c.type, c.companyId),
  dataOf: (app, appDate) => mergeDataOf(c, w, app, appDate),
});
/** In ngay theo mẫu mặc định (không mở popup). */
export const printContracts = (items: { w: Worker; c: Contract }[], flash?: (m: string) => void) =>
  printJobs(
    items.map((x) => {
      const it = toPrintItem(x);
      return { item: it, main: it.defaultTpl, extras: it.attachments, data: it.dataOf(), edited: [] };
    }),
    new Map(items.map((x) => [x.c.id, x])),
    flash,
  );

/** Popup "In hợp đồng" — mở từ danh sách (Thao tác → In), xem nhanh, chi tiết hợp đồng. */
let PRINT_REQ: { w: Worker; c: Contract }[] | null = null;
const PRINT_SUBS = new Set<() => void>();
export const openPrint = (items: { w: Worker; c: Contract }[] | null) => {
  PRINT_REQ = items && items.length ? items : null;
  PRINT_SUBS.forEach((f) => f());
};
const PrintHost: React.FC<{ flash: (m: string) => void }> = ({ flash }) => {
  const req = useSyncExternalStore(
    (cb) => (PRINT_SUBS.add(cb), () => void PRINT_SUBS.delete(cb)),
    () => PRINT_REQ,
  );
  const items = useMemo(() => req?.map(toPrintItem) || [], [req]);
  if (!req || !items.length) return null;
  return <PrintDialog items={items} onClose={() => openPrint(null)} onPrint={(jobs) => printJobs(jobs, new Map(req.map((x) => [x.c.id, x])), flash)} />;
};
/** Dùng cho màn Danh mục / Template: dữ liệu hợp đồng + đổi tên loại HĐ. */
export const getContractStore = () => STATE;
export const useContractStore = () => useStore();
export const renameContractType = (from: string, to: string) =>
  update((x) => ({ ...x, contracts: x.contracts.map((c) => (c.type === from ? { ...c, type: to } : c)), signers: x.signers.map((g) => ({ ...g, types: g.types.map((t) => (t === from ? to : t)) })) }));


// ==========================================================================
// UI dùng chung — theo bộ khung ERP (màn Dự án kinh doanh)
// ==========================================================================
const CRUMBS = ['Human Resources', 'Hợp đồng lao động'];
const INPUT = erp.inputFull;
const BTN = 'inline-flex items-center justify-center gap-1.5 h-8 px-3 rounded-[3px] border text-[12px] font-semibold whitespace-nowrap cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
const btn = {
  primary: `${BTN} bg-[#1f5fa8] border-[#184c88] text-white hover:bg-[#184c88]`,
  outline: `${BTN} bg-white border-slate-300 text-slate-700 hover:bg-slate-50`,
  danger: `${BTN} bg-rose-600 border-rose-700 text-white hover:bg-rose-700`,
  icon: 'inline-flex items-center justify-center w-7 h-7 rounded-[3px] border border-slate-300 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer',
  link: 'inline-flex items-center gap-1 text-[12px] font-semibold text-[#1f5fa8] hover:underline cursor-pointer disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed',
};
const ACTIVE_BTN = '!bg-[#eef4fb] !border-[#1f5fa8] !text-[#1f5fa8]';
const MENU = 'absolute top-full mt-1 z-40 bg-white border border-slate-300 rounded-[4px] shadow-lg py-1';
const StateTag: React.FC<{ st: { text: string; cls: string } }> = ({ st }) => <Tag cls={st.cls}>{st.text}</Tag>;
/** Menu thả xuống: đóng khi bấm ra ngoài / Esc. */
const useDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', esc);
    return () => (document.removeEventListener('mousedown', close), document.removeEventListener('keydown', esc));
  }, [open]);
  return { open, setOpen, ref };
};
const MenuItem: React.FC<{ icon?: React.ElementType; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }> = ({ icon: Icon, onClick, disabled, danger, children }) => (
  <button
    type="button"
    disabled={disabled}
    onClick={onClick}
    className={`w-full flex items-center gap-2 px-3 py-1.5 text-left text-[12.5px] hover:bg-[#eaf2fc] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer ${danger ? 'text-rose-600' : 'text-slate-700'}`}
  >
    {Icon && <Icon size={14} className={danger ? 'text-rose-500' : 'text-[#1f5fa8]'} />}
    {children}
  </button>
);
const Toast: React.FC<{ msg: string }> = ({ msg }) =>
  msg ? <div className="fixed top-4 right-4 z-[60] rounded-[4px] border border-[#184c88] bg-[#1e3a5f] text-white text-[12.5px] px-4 py-2.5 shadow-xl max-w-[520px]">{msg}</div> : null;

// ==========================================================================
// Cột bảng
// ==========================================================================
type Row = { c: Contract; w: Worker; st: { text: string; cls: string } };
interface Col {
  key: string;
  label: string;
  width: number;
  pin?: boolean; // cố định bên trái
  align?: 'right' | 'center';
  def?: boolean; // hiện mặc định
  sort?: (r: Row) => string | number;
  cell: (r: Row) => React.ReactNode;
  xlsx: (r: Row) => string | number;
}
const COLS: Col[] = [
  { key: 'signDate', label: 'Ngày ký HĐ', width: 104, pin: true, align: 'center', def: true, sort: (r) => r.c.signDate, cell: (r) => dmy(r.c.signDate), xlsx: (r) => dmy(r.c.signDate) },
  { key: 'no', label: 'Số hợp đồng', width: 178, pin: true, def: true, sort: (r) => r.c.no, cell: (r) => <span className={`${erp.code} font-semibold`}>{r.c.no}</span>, xlsx: (r) => r.c.no },
  { key: 'name', label: 'Họ và tên NLĐ', width: 200, pin: true, def: true, sort: (r) => r.w.name, cell: (r) => <span className="font-semibold text-slate-800">{r.w.name}</span>, xlsx: (r) => r.w.name },
  { key: 'code', label: 'Mã NLĐ', width: 84, def: true, sort: (r) => r.w.code, cell: (r) => <span className="font-mono text-slate-600">{r.w.code}</span>, xlsx: (r) => r.w.code },
  { key: 'position', label: 'Vị trí công việc', width: 190, def: true, sort: (r) => r.c.position, cell: (r) => r.c.position, xlsx: (r) => r.c.position },
  { key: 'unit', label: 'Đơn vị ký hợp đồng', width: 220, def: true, sort: (r) => r.c.unit, cell: (r) => r.c.unit, xlsx: (r) => r.c.unit },
  { key: 'type', label: 'Loại hợp đồng', width: 220, def: true, sort: (r) => r.c.type, cell: (r) => r.c.type, xlsx: (r) => r.c.type },
  { key: 'term', label: 'Thời hạn', width: 84, align: 'center', def: true, sort: (r) => termMonths(r.c.type, r.c.term) || 999, cell: (r) => r.c.term || '—', xlsx: (r) => r.c.term || '-' },
  { key: 'from', label: 'Ngày có hiệu lực', width: 112, align: 'center', def: true, sort: (r) => r.c.from, cell: (r) => dmy(r.c.from), xlsx: (r) => dmy(r.c.from) },
  { key: 'to', label: 'Ngày hết hạn', width: 104, align: 'center', def: true, sort: (r) => r.c.to || '9999', cell: (r) => (r.c.to ? dmy(r.c.to) : '—'), xlsx: (r) => (r.c.to ? dmy(r.c.to) : '-') },
  { key: 'salary', label: 'Lương cơ bản', width: 116, align: 'right', def: true, sort: (r) => salaryOf(r.c), cell: (r) => money(salaryOf(r.c)) || '—', xlsx: (r) => salaryOf(r.c) || '' },
  { key: 'perf', label: 'Thưởng HQ (tạm tính)', width: 140, align: 'right', sort: (r) => r.c.perfBonus || 0, cell: (r) => money(r.c.perfBonus) || '—', xlsx: (r) => r.c.perfBonus || '' },
  { key: 'phone', label: 'Số điện thoại', width: 120, sort: (r) => r.w.phone, cell: (r) => r.w.phone || '—', xlsx: (r) => r.w.phone },
  { key: 'allow', label: 'Hỗ trợ', width: 104, align: 'right', sort: (r) => allowTotal(r.c), cell: (r) => money(allowTotal(r.c)) || '—', xlsx: (r) => allowTotal(r.c) || '' },
  { key: 'status', label: 'Trạng thái', width: 118, def: true, sort: (r) => r.st.text, cell: (r) => <StateTag st={r.st} />, xlsx: (r) => r.st.text },
  { key: 'company', label: 'Công ty ký HĐ', width: 170, sort: (r) => companyById(r.c.companyId)?.shortName || '', cell: (r) => companyById(r.c.companyId)?.shortName || '—', xlsx: (r) => companyById(r.c.companyId)?.name || '' },
  { key: 'signer', label: 'Người ký', width: 170, def: true, sort: (r) => r.c.signer, cell: (r) => r.c.signer || '—', xlsx: (r) => r.c.signer },
  { key: 'workplace', label: 'Nơi làm việc', width: 180, sort: (r) => r.c.workplace, cell: (r) => r.c.workplace || '—', xlsx: (r) => r.c.workplace },
  { key: 'note', label: 'Ghi chú', width: 200, sort: (r) => r.c.note, cell: (r) => r.c.note || '—', xlsx: (r) => r.c.note },
];
const COLS_KEY = 'contracts-visible-cols-v2';
const loadCols = (): string[] => {
  try {
    const v = JSON.parse(localStorage.getItem(COLS_KEY) || 'null');
    if (Array.isArray(v) && v.length) return v;
  } catch {
    /* dùng mặc định */
  }
  return COLS.filter((c) => c.def).map((c) => c.key);
};

type View = 'all' | 'valid' | 'expiring' | 'expired' | 'upcoming' | 'ended' | 'noContract';
const VIEWS: { key: View; label: string }[] = [
  { key: 'all', label: 'Tất cả hợp đồng' },
  { key: 'valid', label: 'Đang có hiệu lực' },
  { key: 'expiring', label: 'Sắp hết hạn' },
  { key: 'expired', label: 'Hết hạn chưa tái ký' },
  { key: 'upcoming', label: 'Chưa có hiệu lực' },
  { key: 'ended', label: 'Đã hết hạn' },
  { key: 'noContract', label: 'NLĐ chưa có hợp đồng' },
];
type Mode = { kind: 'list' } | { kind: 'detail'; id: string; edit?: boolean } | { kind: 'new'; workerId?: string; copyOf?: string } | { kind: 'signers' };
type Adv = { types: CType[]; signA: string; signB: string; fromA: string; fromB: string; toA: string; toB: string; status: string };
const ADV0: Adv = { types: [], signA: '', signB: '', fromA: '', fromB: '', toA: '', toB: '', status: '' };

// ==========================================================================
// Trang
// ==========================================================================
export const ContractsPage: React.FC = () => {
  const s = useStore();
  useCatalog(); // đổi danh mục (loại HĐ, công ty, template) → vẽ lại
  const [mode, setMode] = useState<Mode>({ kind: 'list' });
  const [toast, setToast] = useState('');
  const timer = useRef(0);
  const flash = (m: string) => {
    setToast(m);
    window.clearTimeout(timer.current); // thông báo mới không bị hẹn giờ của thông báo cũ xoá sớm
    timer.current = window.setTimeout(() => setToast(''), m.length > 80 ? 5000 : 3200);
  };
  return (
    <ErpPage>
      <Toast msg={toast} />
      <PrintHost flash={flash} />
      {mode.kind === 'list' && <ContractList s={s} setMode={setMode} flash={flash} />}
      {(mode.kind === 'detail' || mode.kind === 'new') && <ContractDetail key={mode.kind === 'detail' ? mode.id : `new-${mode.workerId || ''}-${mode.copyOf || ''}`} s={s} mode={mode} setMode={setMode} flash={flash} />}
      {mode.kind === 'signers' && <SignerSetup s={s} onBack={() => setMode({ kind: 'list' })} flash={flash} />}
    </ErpPage>
  );
};

// ==========================================================================
// Danh sách
// ==========================================================================
const ContractList: React.FC<{ s: Store; setMode: (m: Mode) => void; flash: (m: string) => void }> = ({ s, setMode, flash }) => {
  const [view, setView] = useState<View>('all');
  const [typeF, setTypeF] = useState<Kind | ''>('');
  const cat = useCatalog();
  const [soonDays, setSoonDays] = useState(30);
  const [layout, setLayout] = useState<'list' | 'split'>('list');
  const [q, setQ] = useState('');
  const [unit, setUnit] = useState('');
  const [adv, setAdv] = useState<Adv>(ADV0);
  const [sort, setSort] = useState<{ key: string; dir: 1 | -1 }>({ key: 'signDate', dir: -1 });
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(25);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [visible, setVisible] = useState<string[]>(loadCols);
  const [panel, setPanel] = useState<'' | 'import' | 'renew' | 'delete'>('');
  const [selId, setSelId] = useState<string | null>(null);
  const addDd = useDropdown();
  const moreDd = useDropdown();
  const colDd = useDropdown();
  const filtDd = useDropdown();
  const t = today();

  const workerOf = useMemo(() => new Map(s.workers.map((w) => [w.id, w])), [s.workers]);
  const latestOf = useMemo(() => {
    const m = new Map<string, Contract>();
    s.contracts.forEach((c) => {
      const o = m.get(c.workerId);
      if (!o || c.from > o.from) m.set(c.workerId, c);
    });
    return m;
  }, [s.contracts]);
  const all: Row[] = useMemo(
    () => s.contracts.filter((c) => workerOf.has(c.workerId)).map((c) => ({ c, w: workerOf.get(c.workerId)!, st: stateOf(c, s.contracts, soonDays) })),
    [s.contracts, workerOf, soonDays],
  );
  const inView = (r: Row, v: View) =>
    v === 'all'
      ? true
      : v === 'valid'
        ? isValid(r.c, t)
        : v === 'expiring'
          ? isValid(r.c, t) && !!r.c.to && r.c.to <= addDays(t, soonDays) && latestOf.get(r.w.id)?.id === r.c.id
          : v === 'expired'
            ? !!r.c.to && r.c.to < t && latestOf.get(r.w.id)?.id === r.c.id && r.w.working
            : v === 'upcoming'
              ? r.c.from > t
              : v === 'ended'
                ? !!r.c.to && r.c.to < t
                : false;
  // Số liệu tổng quan
  const validRows = all.filter((r) => isValid(r.c, t));
  const byType = (['KXD', 'XD', 'TV', 'OTHER'] as Kind[]).map((tp) => ({ tp, n: validRows.filter((r) => kindOf(r.c.type) === tp).length }));
  const noContract = s.workers.filter((w) => w.working && !latestOf.has(w.id));
  const countOf = (v: View) => (v === 'noContract' ? noContract.length : all.filter((r) => inView(r, v)).length);

  const rows = useMemo(() => {
    const n = norm(q);
    const out = all
      .filter((r) => inView(r, view))
      .filter((r) => !typeF || kindOf(r.c.type) === typeF)
      .filter((r) => !unit || r.c.unit === unit)
      .filter((r) => !n || [r.w.name, r.w.code, r.c.no, r.c.position, r.c.unit, r.c.signer].some((v) => norm(v).includes(n)))
      .filter(
        (r) =>
          (!adv.types.length || adv.types.includes(r.c.type)) &&
          (!adv.signA || r.c.signDate >= adv.signA) &&
          (!adv.signB || r.c.signDate <= adv.signB) &&
          (!adv.fromA || r.c.from >= adv.fromA) &&
          (!adv.fromB || r.c.from <= adv.fromB) &&
          (!adv.toA || (r.c.to && r.c.to >= adv.toA)) &&
          (!adv.toB || (r.c.to && r.c.to <= adv.toB)) &&
          (!adv.status || r.st.text === adv.status),
      );
    const col = COLS.find((c) => c.key === sort.key);
    if (col?.sort) out.sort((a, b) => (col.sort!(a) < col.sort!(b) ? -1 : col.sort!(a) > col.sort!(b) ? 1 : 0) * sort.dir || b.c.no.localeCompare(a.c.no));
    return out;
  }, [all, view, typeF, unit, q, adv, sort, latestOf, t, soonDays, cat]); // eslint-disable-line react-hooks/exhaustive-deps
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const pg = Math.min(page, pages);
  const shown = rows.slice((pg - 1) * size, pg * size);
  useEffect(() => setPage(1), [view, typeF, unit, q, adv, size]);
  const pickedRows = rows.filter((r) => picked.has(r.c.id));
  const allOnPage = shown.length > 0 && shown.every((r) => picked.has(r.c.id));
  const advCount = [adv.types.length > 0, adv.signA || adv.signB, adv.fromA || adv.fromB, adv.toA || adv.toB, adv.status].filter(Boolean).length;
  const split = layout === 'split' && view !== 'noContract';
  const sel = rows.find((r) => r.c.id === selId) || (split ? shown[0] : undefined);

  const cols = COLS.filter((c) => visible.includes(c.key));
  const LEAD = [34, 44]; // ô chọn · STT
  const pinOffsets = (() => {
    let x = LEAD[0] + LEAD[1];
    return cols.map((c) => {
      const o = c.pin ? x : -1;
      if (c.pin) x += c.width;
      return o;
    });
  })();
  const lastPin = cols.reduce((k, c, i) => (c.pin ? i : k), -1);
  const saveCols = (v: string[]) => {
    setVisible(v);
    try {
      localStorage.setItem(COLS_KEY, JSON.stringify(v));
    } catch {
      /* bỏ qua */
    }
  };
  const exportXlsx = (list: Row[] = rows) => {
    const aoa = [['STT', ...cols.map((c) => c.label)], ...list.map((r, i) => [i + 1, ...cols.map((c) => c.xlsx(r))])];
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [{ wch: 6 }, ...cols.map((c) => ({ wch: Math.round(c.width / 7) }))];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'HopDong');
    XLSX.writeFile(wb, `danh-sach-hop-dong_${t.replace(/-/g, '')}.xlsx`);
  };
  const del = () => {
    const ids = new Set(pickedRows.map((r) => r.c.id));
    update((x) => ({ ...x, contracts: x.contracts.filter((c) => !ids.has(c.id)) }));
    flash(`Đã xoá ${ids.size} hợp đồng`);
    setPicked(new Set());
    setPanel('');
  };
  const openRow = (r: Row) => (split ? setSelId(r.c.id) : setMode({ kind: 'detail', id: r.c.id }));
  const goView = (v: View, tp: Kind | '' = '') => {
    setView(v);
    setTypeF(tp);
    setPicked(new Set());
  };
  const togglePick = (id: string) =>
    setPicked((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const viewLabel = VIEWS.find((v) => v.key === view)!.label + (typeF ? ` · ${KIND_LABEL[typeF]}` : '');
  const th = `${erp.th} border-t-0 align-middle`;

  return (
    <>
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Danh sách hợp đồng lao động"
        actions={
          <>
            <Btn icon={Settings2} onClick={() => setMode({ kind: 'signers' })}>
              Thiết lập người ký
            </Btn>
            <div ref={moreDd.ref} className="relative">
              <Btn icon={MoreHorizontal} onClick={() => moreDd.setOpen((o) => !o)} className={moreDd.open ? ACTIVE_BTN : ''} title="Thao tác với hợp đồng đã chọn">
                Thao tác{pickedRows.length ? ` (${pickedRows.length})` : ''}
              </Btn>
              {moreDd.open && (
                <div className={`${MENU} right-0 w-64`}>
                  <MenuItem icon={RefreshCw} disabled={!pickedRows.length} onClick={() => (moreDd.setOpen(false), setPanel('renew'))}>
                    Tái ký hợp đồng đã chọn{pickedRows.length ? ` (${pickedRows.length})` : ''}
                  </MenuItem>
                  <MenuItem icon={Printer} disabled={!pickedRows.length} onClick={() => (moreDd.setOpen(false), openPrint(pickedRows.map((r) => ({ w: r.w, c: r.c }))))}>
                    In hợp đồng đã chọn{pickedRows.length ? ` (${pickedRows.length})` : ''}
                  </MenuItem>
                  <MenuItem icon={FileSpreadsheet} onClick={() => (moreDd.setOpen(false), exportXlsx(pickedRows.length ? pickedRows : rows))}>
                    Xuất Excel {pickedRows.length ? 'các dòng đã chọn' : 'danh sách đang lọc'}
                  </MenuItem>
                  <div className="my-1 border-t border-slate-200" />
                  <MenuItem icon={Trash2} danger disabled={!pickedRows.length} onClick={() => (moreDd.setOpen(false), setPanel('delete'))}>
                    Xoá hợp đồng đã chọn{pickedRows.length ? ` (${pickedRows.length})` : ''}
                  </MenuItem>
                </div>
              )}
            </div>
            <Btn icon={Upload} onClick={() => setPanel((p) => (p === 'import' ? '' : 'import'))} className={panel === 'import' ? ACTIVE_BTN : ''} title="Nhập hợp đồng hàng loạt từ file Excel">
              Import hợp đồng
            </Btn>
            <div ref={addDd.ref} className="relative inline-flex">
              <button type="button" onClick={() => setMode({ kind: 'new' })} className={`${btn.primary} rounded-r-none`}>
                <Plus size={14} /> Thêm hợp đồng
              </button>
              <button type="button" onClick={() => addDd.setOpen((o) => !o)} className={`${btn.primary} rounded-l-none !px-1.5 border-l-white/30`} title="Tuỳ chọn thêm">
                <ChevronDown size={14} />
              </button>
              {addDd.open && (
                <div className={`${MENU} right-0 w-56`}>
                  <MenuItem icon={Plus} onClick={() => (addDd.setOpen(false), setMode({ kind: 'new' }))}>
                    Thêm hợp đồng
                  </MenuItem>
                  <MenuItem icon={Upload} onClick={() => (addDd.setOpen(false), setPanel('import'))}>
                    Import hợp đồng từ Excel
                  </MenuItem>
                  <MenuItem icon={Download} onClick={() => (addDd.setOpen(false), downloadTemplate())}>
                    Tải file mẫu nhập
                  </MenuItem>
                </div>
              )}
            </div>
          </>
        }
        notice={
          panel === 'delete' && pickedRows.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-rose-50 text-[12.5px] text-rose-700">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">
                Xoá <b>{pickedRows.length}</b> hợp đồng đã chọn? Không khôi phục được.
              </span>
              <Btn onClick={() => setPanel('')} className="h-7">
                Không xoá
              </Btn>
              <Btn variant="danger" icon={Trash2} onClick={del} className="h-7 !bg-rose-600 !text-white !border-rose-700 hover:!bg-rose-700">
                Xoá hợp đồng
              </Btn>
            </div>
          ) : null
        }
      />

      {/* Tổng quan */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiBox
          label="Đang có hiệu lực"
          value={validRows.length}
          valueText={String(validRows.length)}
          onClick={() => goView('valid')}
          active={view === 'valid' && !typeF}
          sub={
            <span className="flex items-center gap-2 tracking-tight">
              {byType.map((x) => (
                <button
                  key={x.tp}
                  type="button"
                  onClick={(e) => (e.stopPropagation(), goView('valid', view === 'valid' && typeF === x.tp ? '' : x.tp))}
                  className={`inline-flex items-center gap-1 whitespace-nowrap hover:text-slate-900 cursor-pointer ${view === 'valid' && typeF === x.tp ? 'font-bold text-slate-900 underline underline-offset-2' : ''}`}
                  title={`Lọc ${KIND_LABEL[x.tp]}`}
                >
                  <span className="w-2 h-2 rounded-sm" style={{ background: KIND_COLOR[x.tp] }} />
                  {KIND_SHORT[x.tp]} <b className="text-slate-700">{x.n}</b>
                </button>
              ))}
            </span>
          }
        />
        <KpiBox label="Chưa có hợp đồng" value={noContract.length} valueText={String(noContract.length)} onClick={() => goView('noContract')} active={view === 'noContract'} sub="NLĐ đang làm việc chưa ký hợp đồng" />
        <KpiBox
          label="Sắp hết hạn"
          value={countOf('expiring')}
          valueText={String(countOf('expiring'))}
          className="!border-t-orange-500"
          onClick={() => goView('expiring')}
          active={view === 'expiring'}
          sub={
            <span className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              Hết hạn trong
              <select value={soonDays} onChange={(e) => setSoonDays(Number(e.target.value))} className="h-5 border border-slate-300 rounded-[3px] bg-white px-1 text-[11px] text-slate-700 cursor-pointer">
                {[7, 15, 30, 60, 90].map((d) => (
                  <option key={d} value={d}>
                    {d} ngày
                  </option>
                ))}
              </select>
              tới
            </span>
          }
        />
        <KpiBox label="Hết hạn chưa tái ký" value={countOf('expired')} valueText={String(countOf('expired'))} tone="bad" onClick={() => goView('expired')} active={view === 'expired'} sub="HĐ mới nhất đã hết hạn, NLĐ còn làm việc" />
      </div>

      {panel === 'import' && <ImportPanel s={s} onClose={() => setPanel('')} flash={flash} />}
      {panel === 'renew' && pickedRows.length > 0 && (
        <RenewPanel s={s} rows={pickedRows} onClose={() => setPanel('')} onDone={(n) => (flash(`Đã tái ký ${n} hợp đồng`), setPicked(new Set()), setPanel(''))} />
      )}

      <div>
        <FolderTabs tabs={VIEWS.map((v) => ({ key: v.key, label: `${v.label} (${countOf(v.key)})` }))} value={view} onChange={(k) => goView(k)} />
        <div className={split ? 'grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_400px] 2xl:grid-cols-[minmax(0,1fr)_460px] gap-3 items-start' : ''}>
          <Panel
            title={viewLabel}
            icon={Table2}
            noPad
            className="!rounded-t-none !border-t-0"
            actions={
              <>
                <select value={unit} onChange={(e) => setUnit(e.target.value)} className={`${erp.input} h-7 w-56`}>
                  <option value="">Tất cả đơn vị</option>
                  {UNITS.map((u) => (
                    <option key={u}>{u}</option>
                  ))}
                </select>
                <div className="relative w-60">
                  <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm số HĐ, họ tên, mã NLĐ, vị trí..." className={`${erp.inputFull} h-7 pl-7`} />
                </div>
                {view !== 'noContract' && (
                  <>
                    <Segmented
                      options={[
                        { key: 'list', label: <span className="inline-flex items-center gap-1"><List size={13} /> Danh sách</span> },
                        { key: 'split', label: <span className="inline-flex items-center gap-1"><Columns2 size={13} /> Chia đôi</span> },
                      ]}
                      value={layout}
                      onChange={setLayout}
                    />
                    <div ref={filtDd.ref} className="relative">
                      <Btn icon={Filter} className={`h-7 ${advCount ? ACTIVE_BTN : ''}`} onClick={() => filtDd.setOpen((o) => !o)}>
                        Bộ lọc{advCount ? ` (${advCount})` : ''}
                      </Btn>
                      {filtDd.open && <AdvFilter adv={adv} setAdv={setAdv} onClose={() => filtDd.setOpen(false)} />}
                    </div>
                    <div ref={colDd.ref} className="relative">
                      <Btn icon={Settings} className="h-7" title="Tuỳ chỉnh cột hiển thị" onClick={() => colDd.setOpen((o) => !o)}>
                        Cột
                      </Btn>
                      {colDd.open && (
                        <div className={`${MENU} right-0 w-60 !py-0`}>
                          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-200 bg-[#f3f6fa] text-[12px]">
                            <b className="text-[#1e3a5f]">Cột hiển thị</b>
                            <button type="button" className={btn.link} onClick={() => saveCols(COLS.filter((c) => c.def).map((c) => c.key))}>
                              Mặc định
                            </button>
                          </div>
                          <div className="max-h-80 overflow-auto py-1">
                            {COLS.map((c) => (
                              <label key={c.key} className="flex items-center gap-2 px-3 py-1 text-[12.5px] hover:bg-[#eaf2fc] cursor-pointer">
                                <CheckBox checked={visible.includes(c.key)} onChange={(v) => saveCols(v ? COLS.filter((x) => visible.includes(x.key) || x.key === c.key).map((x) => x.key) : visible.filter((x) => x !== c.key))} />
                                <span className="flex-1">{c.label}</span>
                                {c.pin && <Pin size={11} className="text-slate-400" />}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Btn icon={FileSpreadsheet} className="h-7" onClick={() => exportXlsx()}>
                      Xuất Excel
                    </Btn>
                  </>
                )}
                {(typeF || advCount > 0 || q || unit) && (
                  <button type="button" className={btn.link} onClick={() => (setTypeF(''), setAdv(ADV0), setQ(''), setUnit(''))}>
                    Bỏ lọc
                  </button>
                )}
              </>
            }
          >
            {view === 'noContract' ? (
              <NoContractTable workers={noContract.filter((w) => (!unit || w.unit === unit) && (!q || [w.name, w.code, w.position].some((v) => norm(v).includes(norm(q)))))} onAdd={(id) => setMode({ kind: 'new', workerId: id })} />
            ) : (
              <>
                <div className="overflow-auto max-h-[calc(100vh-320px)] min-h-[260px]">
                  <table className={erp.table} style={{ width: LEAD[0] + LEAD[1] + cols.reduce((x, c) => x + c.width, 0), minWidth: '100%' }}>
                    <thead className="sticky top-0 z-20">
                      <tr>
                        <th className={`${th} sticky left-0 z-30 border-l-0 text-center`} style={{ width: LEAD[0], minWidth: LEAD[0] }}>
                          <CheckBox
                            checked={allOnPage}
                            onChange={(v) =>
                              setPicked((p) => {
                                const n = new Set(p);
                                shown.forEach((r) => (v ? n.add(r.c.id) : n.delete(r.c.id)));
                                return n;
                              })
                            }
                          />
                        </th>
                        <th className={`${th} sticky z-30 text-center`} style={{ left: LEAD[0], width: LEAD[1], minWidth: LEAD[1] }}>
                          STT
                        </th>
                        {cols.map((c, i) => (
                          <th
                            key={c.key}
                            style={{ width: c.width, minWidth: c.width, left: pinOffsets[i] >= 0 ? pinOffsets[i] : undefined }}
                            className={`${th} ${pinOffsets[i] >= 0 ? 'sticky z-30' : ''} ${i === lastPin ? 'shadow-[2px_0_0_0_#cbd5e1]' : ''} ${i === cols.length - 1 ? 'border-r-0' : ''} ${c.align === 'right' ? 'text-right' : c.align === 'center' ? 'text-center' : 'text-left'}`}
                          >
                            <button type="button" onClick={() => setSort((x) => ({ key: c.key, dir: x.key === c.key ? (x.dir === 1 ? -1 : 1) : 1 }))} className={`inline-flex items-center gap-1 cursor-pointer hover:text-[#1f5fa8] ${c.align === 'right' ? 'flex-row-reverse' : ''}`}>
                              {c.label}
                              {sort.key === c.key && (sort.dir === 1 ? <ArrowUp size={12} className="text-[#1f5fa8]" /> : <ArrowDown size={12} className="text-[#1f5fa8]" />)}
                            </button>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {shown.map((r, idx) => {
                        const active = split && sel?.c.id === r.c.id;
                        const bg = active ? 'bg-[#dbe8f8]' : picked.has(r.c.id) ? 'bg-[#eef4fb]' : idx % 2 ? 'bg-[#f8fafc]' : 'bg-white';
                        return (
                          <tr key={r.c.id} className={`${bg} hover:bg-[#eaf2fc] cursor-pointer`} onClick={() => openRow(r)}>
                            <td className={`${erp.td} sticky left-0 z-10 bg-inherit border-l-0 text-center`} onClick={(e) => e.stopPropagation()}>
                              <CheckBox checked={picked.has(r.c.id)} onChange={() => togglePick(r.c.id)} />
                            </td>
                            <td className={`${erp.td} sticky z-10 bg-inherit text-center text-slate-500`} style={{ left: LEAD[0] }}>
                              {(pg - 1) * size + idx + 1}
                            </td>
                            {cols.map((c, i) => (
                              <td
                                key={c.key}
                                style={{ left: pinOffsets[i] >= 0 ? pinOffsets[i] : undefined, maxWidth: c.width }}
                                className={`${erp.td} ${pinOffsets[i] >= 0 ? 'sticky z-10 bg-inherit' : ''} ${i === lastPin ? 'shadow-[2px_0_0_0_#cbd5e1]' : ''} ${i === cols.length - 1 ? 'border-r-0' : ''} whitespace-nowrap overflow-hidden text-ellipsis ${c.align === 'right' ? erp.num : c.align === 'center' ? 'text-center' : ''}`}
                                title={typeof c.xlsx(r) === 'string' ? String(c.xlsx(r)) : undefined}
                              >
                                {c.cell(r)}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                      {!shown.length && (
                        <tr>
                          <td colSpan={cols.length + 2} className="px-3 py-10 text-center text-[12.5px] text-slate-400">
                            Không có hợp đồng phù hợp bộ lọc.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                {/* Phân trang */}
                <div className="flex flex-wrap items-center gap-3 px-3 py-1.5 border-t border-slate-300 bg-slate-50 text-[12px] text-slate-600">
                  <span>
                    Tổng số: <b className="text-slate-800">{rows.length}</b> hợp đồng
                  </span>
                  {pickedRows.length > 0 && (
                    <span className="text-[#1f5fa8]">
                      · Đã chọn <b>{pickedRows.length}</b>{' '}
                      <button type="button" className="hover:underline cursor-pointer" onClick={() => setPicked(new Set())}>
                        (bỏ chọn)
                      </button>
                    </span>
                  )}
                  <span className="text-slate-400">· {split ? 'Bấm dòng để xem nhanh bên phải' : 'Bấm vào dòng để xem chi tiết'}</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    Số dòng/trang
                    <select value={size} onChange={(e) => setSize(Number(e.target.value))} className={`${erp.input} h-6 w-16 px-1`}>
                      {[10, 25, 50, 100].map((n) => (
                        <option key={n}>{n}</option>
                      ))}
                    </select>
                    <b className="mx-2 tabular-nums text-slate-800">
                      {rows.length ? (pg - 1) * size + 1 : 0}–{Math.min(pg * size, rows.length)}
                    </b>
                    {(
                      [
                        [ChevronsLeft, 1, 'Trang đầu'],
                        [ChevronLeft, pg - 1, 'Trang trước'],
                        [ChevronRight, pg + 1, 'Trang sau'],
                        [ChevronsRight, pages, 'Trang cuối'],
                      ] as const
                    ).map(([Icon, p, title]) => (
                      <button key={title} type="button" title={title} disabled={p < 1 || p > pages || p === pg} onClick={() => setPage(p)} className={`${btn.icon} !w-6 !h-6 disabled:opacity-40 disabled:cursor-default`}>
                        <Icon size={13} />
                      </button>
                    ))}
                  </span>
                </div>
              </>
            )}
          </Panel>
          {split && (
            <div className="xl:sticky xl:top-3">
              {sel ? (
                <QuickView s={s} r={sel} soonDays={soonDays} flash={flash} onOpen={(edit) => setMode({ kind: 'detail', id: sel.c.id, edit })} />
              ) : (
                <Panel title="Xem nhanh" icon={Eye}>
                  <p className="py-10 text-center text-slate-400">Chọn một hợp đồng để xem.</p>
                </Panel>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const AdvFilter: React.FC<{ adv: Adv; setAdv: (a: Adv) => void; onClose: () => void }> = ({ adv, setAdv, onClose }) => {
  const [a, setA] = useState(adv);
  const range = (label: string, k1: keyof Adv, k2: keyof Adv) => (
    <div className="grid grid-cols-[120px_1fr_auto_1fr] items-center gap-1.5">
      <span className="text-[12px] text-slate-600">{label}</span>
      <DateInput value={String(a[k1])} onChange={(v) => setA({ ...a, [k1]: v })} />
      <span className="text-slate-400">→</span>
      <DateInput value={String(a[k2])} onChange={(v) => setA({ ...a, [k2]: v })} />
    </div>
  );
  return (
    <div className={`${MENU} right-0 w-[460px] !py-0`}>
      <div className="px-3 py-1.5 border-b border-slate-200 bg-[#f3f6fa] text-[12px] font-bold uppercase tracking-wide text-[#1e3a5f]">Bộ lọc nâng cao</div>
      <div className="px-3 py-2.5 space-y-2">
        <div className="grid grid-cols-[120px_1fr] gap-1.5">
          <span className="text-[12px] text-slate-600 pt-0.5">Loại hợp đồng</span>
          <div className="flex flex-col gap-1">
            {typeNames().map((tp) => (
              <label key={tp} className="flex items-center gap-2 text-[12.5px] cursor-pointer">
                <CheckBox checked={a.types.includes(tp)} onChange={(v) => setA({ ...a, types: v ? [...a.types, tp] : a.types.filter((x) => x !== tp) })} /> {tp}
              </label>
            ))}
          </div>
        </div>
        {range('Ngày ký HĐ', 'signA', 'signB')}
        {range('Ngày có hiệu lực', 'fromA', 'fromB')}
        {range('Ngày hết hạn', 'toA', 'toB')}
        <div className="grid grid-cols-[120px_1fr] items-center gap-1.5">
          <span className="text-[12px] text-slate-600">Trạng thái</span>
          <select value={a.status} onChange={(e) => setA({ ...a, status: e.target.value })} className={INPUT}>
            <option value="">Tất cả</option>
            {['Đang hiệu lực', 'Sắp hết hạn', 'Hết hạn', 'Đã tái ký', 'Chưa có hiệu lực'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-1.5 px-3 py-2 border-t border-slate-200 bg-slate-50">
        <Btn className="h-7" onClick={() => (setA(ADV0), setAdv(ADV0), onClose())}>
          Xoá lọc
        </Btn>
        <Btn variant="primary" icon={Check} className="h-7" onClick={() => (setAdv(a), onClose())}>
          Áp dụng
        </Btn>
      </div>
    </div>
  );
};

const NoContractTable: React.FC<{ workers: Worker[]; onAdd: (id: string) => void }> = ({ workers, onAdd }) => (
  <>
    <div className="overflow-auto">
      <table className={erp.table}>
        <thead>
          <tr>
            {['STT', 'Mã NLĐ', 'Họ và tên NLĐ', 'Vị trí công việc', 'Đơn vị', 'Ngày vào làm', 'Thao tác'].map((h, i, arr) => (
              <th key={h} className={`${erp.th} border-t-0 ${i === 0 ? 'border-l-0 text-center w-12' : i === arr.length - 1 ? 'border-r-0 text-center w-36' : 'text-left'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {workers.map((w, i) => (
            <tr key={w.id} className={erp.tr}>
              <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{i + 1}</td>
              <td className={`${erp.td} ${erp.code} font-semibold`}>{w.code}</td>
              <td className={`${erp.td} font-semibold text-slate-800`}>{w.name}</td>
              <td className={erp.td}>{w.position}</td>
              <td className={erp.td}>{w.unit}</td>
              <td className={`${erp.td} text-center`}>{dmy(w.joinDate)}</td>
              <td className={`${erp.td} border-r-0 text-center`}>
                <button type="button" className={btn.link} onClick={() => onAdd(w.id)}>
                  <Plus size={13} /> Thêm hợp đồng
                </button>
              </td>
            </tr>
          ))}
          {!workers.length && (
            <tr>
              <td colSpan={7} className="px-3 py-10 text-center text-[12.5px] text-slate-400">
                Tất cả người lao động đều đã có hợp đồng.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className="px-3 py-1.5 border-t border-slate-300 bg-slate-50 text-[12px] text-slate-600">
      Tổng số: <b className="text-slate-800">{workers.length}</b> người lao động chưa có hợp đồng
    </div>
  </>
);

// ==========================================================================
// Ô nhập dùng chung cho trang chi tiết
// ==========================================================================
const errCls = (e?: string) => (e ? '!border-rose-400 !bg-rose-50/40' : '');
const ErrText: React.FC<{ e?: string }> = ({ e }) => (e ? <span className="block text-[11px] text-rose-600 mt-0.5">{e}</span> : null);
const fmtAt = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};
const fileSize = (n: number) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);
const lb = (text: string, req: boolean | undefined, editing: boolean) => (
  <>
    {text}
    {editing && req && <span className="text-rose-600 ml-0.5">*</span>}
  </>
);

/** Ô tiền: hiển thị 1,234,567 — lưu số. */
const MoneyInput: React.FC<{ value: number; onChange: (n: number) => void; disabled?: boolean; className?: string }> = ({ value, onChange, disabled, className = '' }) => (
  <input value={money(value)} disabled={disabled} inputMode="numeric" placeholder="0" onChange={(e) => onChange(parseMoney(e.target.value))} className={`${INPUT} text-right tabular-nums ${className}`} />
);

/** Chọn NLĐ có tìm kiếm (theo tên / mã). */
const WorkerPicker: React.FC<{ workers: Worker[]; value: string; onChange: (id: string) => void; err?: string }> = ({ workers, value, onChange, err }) => {
  const dd = useDropdown();
  const [q, setQ] = useState('');
  const cur = workers.find((w) => w.id === value);
  const list = workers.filter((w) => !q || norm(`${w.code} ${w.name}`).includes(norm(q))).slice(0, 50);
  return (
    <div ref={dd.ref} className="relative w-full">
      <button type="button" onClick={() => (dd.setOpen((o) => !o), setQ(''))} className={`${INPUT} flex items-center gap-2 text-left cursor-pointer ${errCls(err)}`}>
        {cur ? (
          <span className="truncate flex-1">
            <b>{cur.name}</b> <span className="text-slate-400 font-mono">· {cur.code}</span>
          </span>
        ) : (
          <span className="flex-1 text-slate-400">Chọn người lao động</span>
        )}
        <ChevronDown size={14} className="text-slate-400 shrink-0" />
      </button>
      {dd.open && (
        <div className={`${MENU} left-0 right-0 !py-0`}>
          <div className="p-1.5 border-b border-slate-200 bg-slate-50">
            <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm theo tên hoặc mã NLĐ" className={`${INPUT} h-7`} />
          </div>
          <div className="max-h-64 overflow-auto py-1">
            {list.map((w) => (
              <button key={w.id} type="button" onClick={() => (onChange(w.id), dd.setOpen(false))} className={`w-full flex items-center gap-2 px-3 py-1 text-left text-[12.5px] hover:bg-[#eaf2fc] cursor-pointer ${w.id === value ? 'bg-[#eef4fb]' : ''}`}>
                <span className="font-mono text-[#1f5fa8] w-14 shrink-0">{w.code}</span>
                <span className="flex-1 truncate">{w.name}</span>
                <span className="text-[11px] text-slate-400 truncate max-w-[45%]">{w.working ? w.unit : 'đã nghỉ việc'}</span>
              </button>
            ))}
            {!list.length && <p className="px-3 py-3 text-slate-400 text-center">Không tìm thấy</p>}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================================================
// Xem nhanh (chế độ chia đôi)
// ==========================================================================
const QuickView: React.FC<{ s: Store; r: Row; soonDays: number; onOpen: (edit?: boolean) => void; flash: (m: string) => void }> = ({ s, r, soonDays, onOpen, flash }) => {
  const { c, w, st } = r;
  const others = s.contracts.filter((x) => x.workerId === w.id).sort((a, b) => b.from.localeCompare(a.from));
  const left = c.to && c.to >= today() ? daysBetween(today(), c.to) : null;
  return (
    <Panel
      title="Xem nhanh hợp đồng"
      icon={Eye}
      noPad
      actions={
        <>
          <Btn icon={Printer} className="h-7" onClick={() => openPrint([{ w, c }])}>
            In
          </Btn>
          <Btn variant="primary" icon={Pencil} className="h-7" onClick={() => onOpen(true)}>
            Sửa
          </Btn>
        </>
      }
      footer={
        <button type="button" className={btn.link} onClick={() => onOpen()}>
          Mở chi tiết hợp đồng <ChevronRight size={13} />
        </button>
      }
    >
      <div className="flex items-start justify-between gap-2 px-3 py-2 border-b border-slate-200 bg-[#fafbfd]">
        <div className="min-w-0">
          <p className="font-bold text-[14px] text-[#1e3a5f] truncate">{w.name}</p>
          <p className="text-[12px] text-slate-500">
            <span className="font-mono">{w.code}</span> · <span className={erp.code}>{c.no}</span>
          </p>
        </div>
        <StateTag st={st} />
      </div>
      <FieldTable
        labelWidth="38%"
        rows={[
          { label: 'Loại hợp đồng', value: c.type },
          { label: 'Thời hạn', value: c.term || 'Không xác định thời hạn' },
          { label: 'Ngày ký', value: dmy(c.signDate) },
          { label: 'Hiệu lực', value: `${dmy(c.from)} → ${c.to ? dmy(c.to) : 'không thời hạn'}` },
          ...(left !== null ? [{ label: 'Còn lại', value: <span className={left <= soonDays ? 'text-orange-700 font-semibold' : ''}>{left} ngày</span> }] : []),
          { label: 'Đơn vị ký HĐ', value: c.unit },
          { label: 'Vị trí công việc', value: c.position },
          { label: 'Nơi làm việc', value: c.workplace },
          { label: 'Lương cơ bản (VNĐ)', value: money(salaryOf(c)), num: true, strong: true },
          { label: 'Hỗ trợ (VNĐ)', value: money(allowTotal(c)), num: true },
          { label: 'Thưởng HQ tạm tính (VNĐ)', value: money(c.perfBonus), num: true },
          { label: 'Người ký', value: c.signer ? `${c.signerSalutation} ${c.signer} — ${c.signerTitle}` : '' },
          { label: 'Số điện thoại', value: w.phone },
          { label: 'Ghi chú', value: c.note },
        ]}
      />
      <div className="px-3 py-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-slate-500 mb-1">Quá trình hợp đồng ({others.length})</p>
        <ol className="space-y-0.5">
          {others.map((x) => (
            <li key={x.id} className={`text-[12px] ${x.id === c.id ? 'font-bold text-[#1f5fa8]' : 'text-slate-600'}`}>
              {lineOf(x)}
            </li>
          ))}
        </ol>
      </div>
    </Panel>
  );
};

// ==========================================================================
// Chi tiết / thêm / sửa hợp đồng — trên trang, không popup
// ==========================================================================
type NewWorker = { code: string; name: string };
/** Thông tin NLĐ dùng trên hợp đồng (theo bộ mẫu): sửa ngay trên màn hợp đồng. */
type WorkerInfo = Pick<Worker, 'gender' | 'birthDate' | 'idNo' | 'idDate' | 'idPlace' | 'address' | 'currentAddress' | 'phone' | 'joinDate'>;
const W_INFO: [keyof WorkerInfo, string][] = [
  ['gender', 'Giới tính'], ['birthDate', 'Ngày sinh'], ['idNo', 'Số CCCD / Hộ chiếu'], ['idDate', 'Ngày cấp'], ['idPlace', 'Nơi cấp'],
  ['address', 'Nơi đăng ký hộ khẩu'], ['currentAddress', 'Nơi ở hiện tại'], ['phone', 'Số điện thoại'], ['joinDate', 'Ngày vào làm'],
];
const infoOf = (w?: Worker, joinDate = ''): WorkerInfo => ({
  gender: w?.gender || 'Nam', birthDate: w?.birthDate || '', idNo: w?.idNo || '', idDate: w?.idDate || '', idPlace: w?.idPlace ?? ID_PLACES[0],
  address: w?.address || '', currentAddress: w?.currentAddress || '', phone: w?.phone || '', joinDate: w?.joinDate || joinDate,
});
const showW = (k: keyof WorkerInfo, v: string) => (k === 'birthDate' || k === 'idDate' || k === 'joinDate' ? dmy(v) || '—' : v || '—');
const nextWorkerCode = (ws: Worker[]) => `NV${ws.reduce((m, w) => Math.max(m, Number(w.code.replace(/\D/g, '')) || 0), 1000) + 1}`;

const ContractDetail: React.FC<{
  s: Store;
  mode: { kind: 'detail'; id: string; edit?: boolean } | { kind: 'new'; workerId?: string; copyOf?: string };
  setMode: (m: Mode) => void;
  flash: (m: string) => void;
}> = ({ s, mode, setMode, flash }) => {
  const isNew = mode.kind === 'new';
  const orig = mode.kind === 'detail' ? s.contracts.find((c) => c.id === mode.id) : undefined;
  const src = mode.kind === 'new' && mode.copyOf ? s.contracts.find((c) => c.id === mode.copyOf) : undefined;
  const init = (): Contract => {
    if (orig) return structuredClone(orig);
    if (src) {
      const f = today();
      return {
        ...structuredClone(src),
        id: uid(),
        workerId: '',
        no: nextContractNo('', src.companyId, src.type, s.contracts),
        signDate: f,
        from: f,
        to: endOf(src.type, src.term, f),
        files: [],
        history: [],
        allowances: normSupports(src.allowances),
      };
    }
    return blankFor(s.workers.find((w) => w.id === (mode.kind === 'new' ? mode.workerId : '')), s);
  };
  const [d, setD] = useState<Contract>(init);
  const [editing, setEditing] = useState(isNew || (mode.kind === 'detail' && !!mode.edit));
  const [tab, setTab] = useState<'info' | 'chain' | 'history'>('info');
  const [tried, setTried] = useState(false);
  const [signerTouched, setSignerTouched] = useState(!isNew);
  const [confirmDel, setConfirmDel] = useState(false);
  const [nw, setNw] = useState<NewWorker | null>(null);
  const [wi, setWi] = useState<WorkerInfo>(() => infoOf(s.workers.find((x) => x.id === (orig?.workerId || (mode.kind === 'new' ? mode.workerId : '')))));
  const [noTouched, setNoTouched] = useState(!isNew);
  const fileRef = useRef<HTMLInputElement>(null);

  if (mode.kind === 'detail' && !orig)
    return (
      <ErpTitleBar
        onBack={() => setMode({ kind: 'list' })}
        title="Hợp đồng không còn tồn tại"
      />
    );

  const w = s.workers.find((x) => x.id === d.workerId);
  const errs = validate(nw ? { ...d, workerId: 'NEW' } : d, s.contracts);
  const nwErr: Record<string, string> = {};
  if (nw) {
    if (!nw.name.trim()) nwErr.name = 'Bắt buộc';
    if (!nw.code.trim()) nwErr.code = 'Bắt buộc';
    else if (s.workers.some((x) => x.code.toLowerCase() === nw.code.trim().toLowerCase())) nwErr.code = 'Mã NLĐ đã tồn tại';
  }
  if (wi.idNo && !/^[A-Za-z0-9]{8,12}$/.test(wi.idNo)) nwErr.idNo = 'CCCD 12 số / CMND 9 số / hộ chiếu 8 ký tự';
  if (wi.phone && !/^[0-9 +.]{9,15}$/.test(wi.phone)) nwErr.phone = 'Số điện thoại không hợp lệ';
  if (wi.idDate && wi.birthDate && wi.idDate < wi.birthDate) nwErr.idDate = 'Trước ngày sinh';
  const empCode = nw ? nw.code.trim() : w?.code || '';
  const E = (k: string) => (tried ? errs[k] : undefined);
  const NE = (k: string) => (tried ? nwErr[k] : undefined);

  /** Cập nhật + tự tính: ngày hết hạn theo loại/thời hạn/ngày hiệu lực, người ký theo thiết lập. */
  const set = (patch: Partial<Contract>) =>
    setD((o) => {
      const n = { ...o, ...patch };
      if ('type' in patch && patch.type !== o.type) {
        n.term = defaultTerm(n.type);
        n.rate = rateOf(n.type);
        n.insurance = { bhxh: insuranceOf(n.type), bhyt: insuranceOf(n.type), bhtn: insuranceOf(n.type) };
      }
      if ('type' in patch || 'term' in patch || 'from' in patch) n.to = endOf(n.type, n.term, n.from);
      if (!noTouched && ('type' in patch || 'companyId' in patch)) n.no = nextContractNo(empCode, n.companyId, n.type, s.contracts, n.id);
      if (!signerTouched && ('type' in patch || 'unit' in patch || 'from' in patch || 'signDate' in patch || 'companyId' in patch)) {
        const sg = signerOf(n.unit, n.type, n.signDate || n.from, s.signers, n.companyId);
        n.signerSalutation = sg?.salutation || '';
        n.signer = sg?.signer || '';
        n.signerTitle = sg?.signerTitle || '';
        n.authorization = sg?.authorization || '';
      }
      return n;
    });
  const pickWorker = (id: string) => {
    const nwk = s.workers.find((x) => x.id === id);
    if (!nwk) return;
    setWi(infoOf(nwk));
    if (src) setD((o) => ({ ...o, workerId: id, no: noTouched ? o.no : nextContractNo(nwk.code, o.companyId, o.type, s.contracts, o.id) }));
    else {
      const b = blankFor(nwk, s);
      setD((o) => ({ ...b, id: o.id, no: noTouched ? o.no : b.no }));
      setSignerTouched(false);
    }
  };
  const applySigner = () => {
    const sg = signerOf(d.unit, d.type, d.signDate || d.from, s.signers, d.companyId);
    if (!sg) return flash('Không có thiết lập người ký phù hợp với đơn vị / loại HĐ / ngày ký');
    setD((o) => ({ ...o, signerSalutation: sg.salutation, signer: sg.signer, signerTitle: sg.signerTitle, authorization: sg.authorization }));
    setSignerTouched(false);
  };

  const save = () => {
    setTried(true);
    if (Object.keys(errs).length || Object.keys(nwErr).length) return flash('Vui lòng kiểm tra các trường được đánh dấu đỏ');
    let c: Contract = { ...d, no: d.no.trim(), position: d.position.trim(), term: isK(d.type, 'KXD') ? '' : d.term, to: isK(d.type, 'KXD') ? '' : d.to };
    let newW: Worker | undefined;
    const info: WorkerInfo = { ...wi, idNo: wi.idNo.trim(), idPlace: wi.idPlace.trim(), address: wi.address.trim(), currentAddress: wi.currentAddress.trim(), phone: wi.phone.trim() };
    if (nw) {
      newW = { id: `W${uid()}`, code: nw.code.trim(), name: nw.name.trim().toUpperCase(), ...info, joinDate: info.joinDate || c.from, position: c.position, unit: c.unit, working: true };
      c = { ...c, workerId: newW.id };
    }
    // Thông tin NLĐ thay đổi → cập nhật hồ sơ NLĐ
    const wChanges = !nw && w ? W_INFO.filter(([k]) => (w[k] || '') !== (info[k] || '')).map(([k, l]) => `${l}: ${showW(k, w[k])} → ${showW(k, info[k])}`) : [];
    const workersNext = (ws: Worker[]) => (newW ? [...ws, newW] : wChanges.length ? ws.map((x) => (x.id === w!.id ? { ...x, ...info } : x)) : ws);
    if (isNew) {
      c.history = [{ at: nowIso(), by: ME, action: src ? `Tạo hợp đồng (sao chép từ ${src.no})` : 'Tạo hợp đồng' }, ...(wChanges.length ? [{ at: nowIso(), by: ME, action: 'Cập nhật thông tin người lao động', changes: wChanges }] : [])];
      update((x) => ({ ...x, workers: workersNext(x.workers), contracts: [...x.contracts, c] }));
      flash(`Đã thêm hợp đồng ${c.no}${newW ? ` và người lao động ${newW.name}` : ''}`);
      setMode({ kind: 'detail', id: c.id });
      return;
    }
    const changes = diffC(orig!, c);
    if (!changes.length && !wChanges.length) {
      setEditing(false);
      setTried(false);
      return flash('Không có thay đổi');
    }
    c.history = [
      ...orig!.history,
      ...(changes.length ? [{ at: nowIso(), by: ME, action: 'Cập nhật hợp đồng', changes }] : []),
      ...(wChanges.length ? [{ at: nowIso(), by: ME, action: 'Cập nhật thông tin người lao động', changes: wChanges }] : []),
    ];
    update((x) => ({ ...x, workers: workersNext(x.workers), contracts: x.contracts.map((y) => (y.id === c.id ? c : y)) }));
    setD(c);
    setEditing(false);
    setTried(false);
    flash(`Đã lưu hợp đồng ${c.no}`);
  };
  const cancel = () => {
    if (isNew) return setMode({ kind: 'list' });
    setD(structuredClone(orig!));
    setWi(infoOf(w));
    setEditing(false);
    setTried(false);
    setNw(null);
  };
  const remove = () => {
    update((x) => ({ ...x, contracts: x.contracts.filter((c) => c.id !== d.id) }));
    flash(`Đã xoá hợp đồng ${d.no}`);
    setMode({ kind: 'list' });
  };
  const addFiles = (fl: FileList | null) => {
    if (!fl?.length) return;
    setD((o) => ({ ...o, files: [...o.files, ...[...fl].map((f) => ({ id: uid(), name: f.name, size: f.size }))] }));
  };

  const others = w ? s.contracts.filter((x) => x.workerId === w.id).sort((a, b) => b.from.localeCompare(a.from)) : [];
  const st = orig ? stateOf(orig, s.contracts, 30) : undefined;
  const positions = [...new Set(UNIT_POS[d.unit] || Object.values(UNIT_POS).flat())];
  const renewing = mode.kind === 'new' && !!mode.workerId && others.length > 0;
  const title = isNew ? (src ? `Sao chép hợp đồng ${src.no}` : renewing ? 'Tái ký hợp đồng' : 'Thêm hợp đồng lao động') : editing ? `Sửa hợp đồng ${orig!.no}` : `Hợp đồng ${orig!.no}`;
  const ed = editing;
  const lastLog = orig?.history[orig.history.length - 1];

  // ---- Người lao động (theo phần "Và một bên là" của bộ mẫu hợp đồng)
  const wText = (k: keyof WorkerInfo, ph = '', err?: string, filter?: (v: string) => string) =>
    ed ? (
      <>
        <input value={wi[k]} placeholder={ph} onChange={(e) => setWi({ ...wi, [k]: filter ? filter(e.target.value) : e.target.value })} className={`${INPUT} ${errCls(err)}`} />
        <ErrText e={err} />
      </>
    ) : (
      showW(k, wi[k]).replace(/^—$/, '')
    );
  const wDate = (k: keyof WorkerInfo, err?: string) =>
    ed ? (
      <>
        <DateInput value={wi[k]} onChange={(v) => setWi({ ...wi, [k]: v })} className={errCls(err)} />
        <ErrText e={err} />
      </>
    ) : (
      dmy(wi[k])
    );
  const workerLeft = [
    nw
      ? {
          label: lb('Họ và tên', true, ed),
          value: (
            <>
              <input value={nw.name} placeholder="Viết hoa có dấu" onChange={(e) => setNw({ ...nw, name: e.target.value })} className={`${INPUT} ${errCls(NE('name'))}`} />
              <ErrText e={NE('name')} />
            </>
          ),
        }
      : { label: lb('Họ và tên NLĐ', true, ed), value: isNew && ed ? <><WorkerPicker workers={s.workers} value={d.workerId} onChange={pickWorker} err={E('workerId')} /><ErrText e={E('workerId')} /></> : <b className="text-slate-900">{w?.name}</b> },
    nw
      ? {
          label: lb('Mã NLĐ', true, ed),
          value: (
            <>
              <input
                value={nw.code}
                onChange={(e) => {
                  setNw({ ...nw, code: e.target.value });
                  if (!noTouched) setD((o) => ({ ...o, no: nextContractNo(e.target.value.trim(), o.companyId, o.type, s.contracts, o.id) }));
                }}
                className={`${INPUT} ${errCls(NE('code'))}`}
              />
              <ErrText e={NE('code')} />
            </>
          ),
        }
      : { label: 'Mã NLĐ', value: w ? <span className={erp.code}>{w.code}</span> : '' },
    {
      label: 'Giới tính',
      value: ed ? (
        <select value={wi.gender} onChange={(e) => setWi({ ...wi, gender: e.target.value as 'Nam' | 'Nữ' })} className={`${INPUT} w-28`}>
          <option>Nam</option>
          <option>Nữ</option>
        </select>
      ) : (
        wi.gender
      ),
    },
    { label: 'Ngày sinh', value: wDate('birthDate') },
    { label: 'Số CCCD / Hộ chiếu', value: wText('idNo', '12 số', NE('idNo'), (v) => v.replace(/[^A-Za-z0-9]/g, '').slice(0, 12)) },
    { label: 'Ngày cấp', value: wDate('idDate', NE('idDate')) },
  ];
  const workerRight = [
    {
      label: 'Nơi cấp',
      value: ed ? (
        <>
          <input list="c3-idplace" value={wi.idPlace} onChange={(e) => setWi({ ...wi, idPlace: e.target.value })} className={INPUT} />
          <datalist id="c3-idplace">
            {ID_PLACES.map((x) => (
              <option key={x} value={x} />
            ))}
          </datalist>
        </>
      ) : (
        wi.idPlace
      ),
    },
    { label: 'Nơi đăng ký hộ khẩu', value: wText('address') },
    { label: 'Nơi ở hiện tại', value: wText('currentAddress') },
    { label: 'Số điện thoại', value: wText('phone', '', NE('phone')) },
    { label: 'Ngày vào làm', value: wDate('joinDate') },
    ...(nw ? [] : [{ label: 'Tình trạng', value: w ? <Tag cls={w.working ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-slate-100 text-slate-600 border-slate-300'}>{w.working ? 'Đang làm việc' : 'Đã nghỉ việc'}</Tag> : '' }]),
  ];

  // ---- Thông tin hợp đồng
  const sel = (value: string, onChange: (v: string) => void, opts: React.ReactNode, err?: string, disabled?: boolean) => (
    <>
      <select value={value} disabled={disabled} onChange={(e) => onChange(e.target.value)} className={`${INPUT} ${errCls(err)}`}>
        {opts}
      </select>
      <ErrText e={err} />
    </>
  );
  const infoLeft = [
    {
      label: lb('Công ty ký HĐ', true, ed),
      value: ed
        ? sel(d.companyId, (v) => set({ companyId: v }), <><option value="">— Chọn công ty —</option>{activeCompanies(d.companyId).map((co) => <option key={co.id} value={co.id}>{co.name}</option>)}</>, E('companyId'))
        : companyById(d.companyId)?.name || '',
    },
    {
      label: lb('Số hợp đồng', true, ed),
      value: ed ? (
        <>
          <span className="flex items-center gap-2 w-full">
            <input value={d.no} onChange={(e) => (setNoTouched(true), set({ no: e.target.value }))} className={`${INPUT} font-mono ${errCls(E('no'))}`} />
            {noTouched && (
              <button type="button" className={`${btn.link} whitespace-nowrap`} title="Tạo lại theo «Mã NV»/«ký hiệu công ty»/«ký hiệu loại HĐ»" onClick={() => (setNoTouched(false), setD((o) => ({ ...o, no: nextContractNo(empCode, o.companyId, o.type, s.contracts, o.id) })))}>
                <RefreshCw size={12} /> Tự sinh
              </button>
            )}
          </span>
          {!noTouched && <span className="text-[11px] text-slate-400 mt-0.5">Tự sinh: «Mã NV»/«ký hiệu công ty»/«ký hiệu loại HĐ»</span>}
          <ErrText e={E('no')} />
        </>
      ) : (
        <span className={`${erp.code} font-semibold`}>{d.no}</span>
      ),
    },
    { label: lb('Loại hợp đồng', true, ed), value: ed ? sel(d.type, (v) => set({ type: v as CType }), [...new Set([...typeNames(), d.type])].map((tp) => <option key={tp}>{tp}</option>), E('type')) : <span className="inline-flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: colorOf(d.type) }} />{d.type}</span> },
    {
      label: lb('Thời hạn', !isK(d.type, 'KXD'), ed),
      value: ed
        ? sel(d.term, (v) => set({ term: v }), <>{isK(d.type, 'KXD') ? <option value="">Không xác định</option> : <option value="">— Chọn —</option>}{termsOf(d.type).map((x) => <option key={x.label}>{x.label}</option>)}</>, E('term'), isK(d.type, 'KXD'))
        : d.term || 'Không xác định thời hạn',
    },
    { label: lb('Ngày ký', true, ed), value: ed ? <><DateInput value={d.signDate} onChange={(v) => set({ signDate: v })} className={errCls(E('signDate'))} /><ErrText e={E('signDate')} /></> : dmy(d.signDate) },
    { label: lb('Ngày bắt đầu', true, ed), value: ed ? <><DateInput value={d.from} onChange={(v) => set({ from: v })} className={errCls(E('from'))} /><ErrText e={E('from')} /></> : dmy(d.from) },
    { label: 'Ngày kết thúc', value: <span className="tabular-nums">{isK(d.type, 'KXD') ? 'Không thời hạn' : dmy(d.to)}{ed && <span className="ml-2 text-[11px] text-slate-400">(tự tính)</span>}<ErrText e={E('to')} /></span> },
  ];
  const infoRight = [
    { label: lb('Bộ phận công tác', true, ed), value: ed ? sel(d.unit, (v) => set({ unit: v }), <><option value="">— Chọn đơn vị —</option>{UNITS.map((u) => <option key={u}>{u}</option>)}</>, E('unit')) : d.unit },
    {
      label: lb('Chức danh chuyên môn', true, ed),
      value: ed ? (
        <>
          <input list="c3-positions" value={d.position} onChange={(e) => set({ position: e.target.value })} className={`${INPUT} ${errCls(E('position'))}`} />
          <datalist id="c3-positions">
            {positions.map((p) => (
              <option key={p} value={p} />
            ))}
          </datalist>
          <ErrText e={E('position')} />
        </>
      ) : d.position,
    },
    { label: 'Nơi làm việc', value: ed ? sel(d.workplace, (v) => set({ workplace: v }), WORKPLACES.map((x) => <option key={x}>{x}</option>)) : d.workplace },
    { label: 'Thời gian làm việc', value: ed ? sel(d.workTime, (v) => set({ workTime: v }), WORK_TIMES.map((x) => <option key={x}>{x}</option>)) : d.workTime },
    { label: 'Nơi ký', value: ed ? <input value={d.signPlace} onChange={(e) => set({ signPlace: e.target.value })} className={INPUT} /> : d.signPlace },
    { label: 'Công việc phải làm', value: ed ? <textarea value={d.jobDesc} rows={2} onChange={(e) => set({ jobDesc: e.target.value })} className={`${INPUT} h-auto py-1.5 resize-y`} /> : <span className="whitespace-pre-wrap">{d.jobDesc}</span> },
  ];

  // ---- Lương
  const insurance = (
    <span className="flex flex-wrap items-center gap-4">
      {(
        [
          ['bhxh', 'BHXH'],
          ['bhyt', 'BHYT'],
          ['bhtn', 'BHTN'],
        ] as const
      ).map(([k, l]) => (
        <span key={k} className="flex items-center gap-1.5">
          <CheckBox checked={d.insurance[k]} onChange={ed ? (v) => set({ insurance: { ...d.insurance, [k]: v } }) : undefined} /> {l}
        </span>
      ))}
    </span>
  );
  const money1 = (v: number, on: (n: number) => void) => (ed ? <MoneyInput value={v} onChange={on} /> : <span className="tabular-nums">{money(v) || '0'}</span>);
  const setSupport = (name: string, n: number) => set({ allowances: normSupports(d.allowances).map((a) => (a.name === name ? { ...a, amount: n } : a)) });
  // Tiền lương (Điều 3 của hợp đồng)
  const payLeft = [
    { label: 'Lương cơ bản gốc', value: money1(d.baseSalary, (n) => set({ baseSalary: n })) },
    { label: 'Mức hưởng (%)', value: ed ? <><input type="number" min={0} max={100} value={d.rate} onChange={(e) => set({ rate: Number(e.target.value) })} className={`${INPUT} text-right tabular-nums w-28 ${errCls(E('rate'))}`} /><ErrText e={E('rate')} /></> : `${d.rate}%` },
    { label: 'Mức lương', value: <b className="tabular-nums text-slate-900">{money(salaryOf(d)) || '0'}</b> },
  ];
  const payRight = [
    { label: 'Bằng chữ', value: <i className="text-slate-600">{soThanhChu(salaryOf(d))}</i> },
    { label: 'Tham gia bảo hiểm', value: insurance },
    { label: 'Tổng thu nhập', value: <b className="tabular-nums text-[#1e3a5f]">{money(salaryOf(d) + allowTotal(d) + (d.perfBonus || 0)) || '0'}</b> },
  ];
  // Phụ lục hợp đồng — Phụ lục 01: các khoản hỗ trợ (theo bộ mẫu hợp đồng)
  const appLeft = SUPPORTS.slice(0, 3).map((x) => ({ label: x.name, value: money1(supportAmt(d, x.name), (n) => setSupport(x.name, n)) }));
  const appRight = [
    ...SUPPORTS.slice(3).map((x) => ({ label: x.name, value: money1(supportAmt(d, x.name), (n) => setSupport(x.name, n)) })),
    { label: 'Thưởng hiệu quả (tạm tính)', value: money1(d.perfBonus || 0, (n) => set({ perfBonus: n })) },
    { label: 'Tổng hỗ trợ & thưởng', value: <b className="tabular-nums text-slate-900">{money(allowTotal(d) + (d.perfBonus || 0)) || '0'}</b> },
  ];

  return (
    <div className="space-y-3">
      <ErpTitleBar
        crumbs={isNew || editing ? CRUMBS : undefined}
        title={
          <>
            {title}
            {st && !editing && <StateTag st={st} />}
          </>
        }
        onBack={editing ? undefined : () => setMode({ kind: 'list' })}
        actions={
          editing ? (
            <>
              <Btn icon={X} onClick={cancel}>
                {isNew ? 'Huỷ' : 'Huỷ sửa'}
              </Btn>
              <Btn variant="primary" icon={Save} onClick={save}>
                {isNew ? 'Lưu hợp đồng' : 'Lưu thay đổi'}
              </Btn>
            </>
          ) : (
            <>
              <Btn icon={Printer} onClick={() => w && openPrint([{ w, c: d }])} title="Chọn mẫu in, xem trước và sửa thông tin trước khi tạo file Word">
                In HĐ
              </Btn>
              <Btn icon={Copy} onClick={() => setMode({ kind: 'new', copyOf: d.id })}>
                Sao chép
              </Btn>
              <Btn icon={RefreshCw} onClick={() => setMode({ kind: 'new', workerId: d.workerId })} disabled={isK(d.type, 'KXD') && others[0]?.id === d.id} title={isK(d.type, 'KXD') && others[0]?.id === d.id ? 'Hợp đồng không xác định thời hạn không cần tái ký' : 'Tạo hợp đồng kế tiếp cho NLĐ'}>
                Tái ký
              </Btn>
              <Btn variant="primary" icon={Pencil} onClick={() => (setEditing(true), setTab('info'), setConfirmDel(false))}>
                Sửa
              </Btn>
              <Btn variant="danger" icon={Trash2} onClick={() => setConfirmDel(true)}>
                Xoá
              </Btn>
            </>
          )
        }
        meta={
          isNew || !orig
            ? undefined
            : [
                { label: 'Số HĐ', value: <span className="font-mono">{orig.no}</span> },
                { label: 'Người lao động', value: w ? `${w.name} (${w.code})` : '' },
                { label: 'Hiệu lực', value: `${dmy(orig.from)} → ${orig.to ? dmy(orig.to) : 'không thời hạn'}` },
                { label: 'Lương cơ bản', value: `${money(salaryOf(orig))} VNĐ` },
                { label: 'Template in', value: [templateForType(orig.type, orig.companyId)?.name || 'Chưa cấu hình (bản in mặc định)', ...attachmentsFor(orig.type, orig.companyId).map((t) => `+ ${t.name}`)].join(' ') },
                ...(lastLog ? [{ label: 'Cập nhật', value: `${fmtAt(lastLog.at)} bởi ${lastLog.by}` }] : []),
              ]
        }
        notice={
          confirmDel ? (
            <div className="flex flex-wrap items-center gap-3 px-4 py-2 bg-rose-50 text-[12.5px] text-rose-700">
              <AlertTriangle size={14} className="shrink-0" />
              <span className="flex-1 min-w-[240px]">
                Xoá hợp đồng <b>{d.no}</b> của <b>{w?.name}</b>? Không khôi phục được.
              </span>
              <Btn onClick={() => setConfirmDel(false)} className="h-7">
                Không xoá
              </Btn>
              <Btn variant="danger" icon={Trash2} onClick={remove} className="h-7 !bg-rose-600 !text-white !border-rose-700 hover:!bg-rose-700">
                Xoá hợp đồng
              </Btn>
            </div>
          ) : tried && (Object.keys(errs).length > 0 || Object.keys(nwErr).length > 0) ? (
            <div className="flex items-center gap-2 px-4 py-1.5 bg-rose-50 text-[12px] text-rose-700">
              <AlertTriangle size={13} className="shrink-0" /> Còn {Object.keys(errs).length + Object.keys(nwErr).length} trường chưa hợp lệ (đánh dấu đỏ).
            </div>
          ) : null
        }
      />

      {!isNew && (
        <FolderTabs
          tabs={[
            { key: 'info', label: 'Thông tin hợp đồng', icon: LayoutList },
            { key: 'chain', label: `Quá trình hợp đồng (${others.length})`, icon: ListOrdered },
            { key: 'history', label: `Lịch sử (${d.history.length})`, icon: History },
          ]}
          value={tab}
          onChange={(k) => !editing && setTab(k)}
        />
      )}

      {tab === 'info' && (
        <div className="space-y-3">
          <Panel
            title="Người lao động"
            icon={User}
            noPad
            actions={
              ed && isNew ? (
                <button
                  type="button"
                  className={btn.link}
                  onClick={() => {
                    const v = nw ? null : { code: nextWorkerCode(s.workers), name: '' };
                    setNw(v);
                    setWi(infoOf(v ? undefined : w, d.from));
                    if (!noTouched) setD((o) => ({ ...o, no: nextContractNo(v ? v.code : w?.code || '', o.companyId, o.type, s.contracts, o.id) }));
                  }}
                >
                  {nw ? (
                    <>
                      <X size={13} /> Chọn NLĐ có sẵn
                    </>
                  ) : (
                    <>
                      <UserPlus size={13} /> Thêm NLĐ mới
                    </>
                  )}
                </button>
              ) : undefined
            }
          >
            <InfoGrid left={workerLeft} right={workerRight} />
          </Panel>

          <Panel title="Thông tin hợp đồng" icon={FileSignature} noPad>
            <InfoGrid left={infoLeft} right={infoRight} />
          </Panel>

          <Panel title="Tiền lương (VNĐ/tháng)" icon={Wallet} noPad>
            <InfoGrid left={payLeft} right={payRight} />
          </Panel>

          <Panel
            title="Phụ lục hợp đồng — Phụ lục 01: Các khoản hỗ trợ (VNĐ/tháng)"
            icon={FilePlus2}
            noPad
            footer={`Đính kèm hợp đồng số ${d.no || '…'} · có hiệu lực từ ngày ${dmy(d.from) || '…'}${d.to ? ` đến ngày ${dmy(d.to)}` : ''}, theo thời hạn của hợp đồng · in cùng hợp đồng (Phụ lục 01 trong mẫu Word).`}
          >
            <InfoGrid left={appLeft} right={appRight} labelW={[150, 200]} />
          </Panel>

          <Panel
            title="Người ký hợp đồng"
            icon={PenLine}
            noPad
            actions={
              ed ? (
                <button type="button" className={btn.link} onClick={applySigner} title="Lấy theo Thiết lập người ký (đơn vị + loại HĐ + ngày ký)">
                  <RefreshCw size={13} /> Lấy theo thiết lập
                </button>
              ) : undefined
            }
            footer={ed && !signerTouched ? 'Tự động theo Thiết lập người ký khi đổi công ty, đơn vị, loại HĐ hoặc ngày ký (không có thiết lập → người đại diện của công ty).' : undefined}
          >
            <InfoGrid
              left={[
                {
                  label: 'Người ký',
                  value: ed ? (
                    <span className="flex items-center gap-1.5 w-full">
                      <select value={d.signerSalutation} onChange={(e) => (setSignerTouched(true), setD({ ...d, signerSalutation: e.target.value }))} className={`${INPUT} w-20`}>
                        <option value="">—</option>
                        <option>Ông</option>
                        <option>Bà</option>
                      </select>
                      <input value={d.signer} onChange={(e) => (setSignerTouched(true), setD({ ...d, signer: e.target.value }))} className={INPUT} />
                    </span>
                  ) : (
                    <b>
                      {d.signerSalutation} {d.signer}
                    </b>
                  ),
                },
                { label: 'Chức danh', value: ed ? <input value={d.signerTitle} onChange={(e) => (setSignerTouched(true), setD({ ...d, signerTitle: e.target.value }))} className={INPUT} /> : d.signerTitle },
              ]}
              right={[{ label: 'Giấy uỷ quyền', value: ed ? <input value={d.authorization} placeholder="Số / ngày giấy uỷ quyền (nếu có)" onChange={(e) => (setSignerTouched(true), setD({ ...d, authorization: e.target.value }))} className={INPUT} /> : d.authorization }]}
            />
          </Panel>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <Panel
              title={`File đính kèm (${d.files.length})`}
              icon={Paperclip}
              noPad
              actions={
                ed ? (
                  <>
                    <Btn icon={Upload} className="h-7" onClick={() => fileRef.current?.click()}>
                      Đính kèm file
                    </Btn>
                    <input ref={fileRef} type="file" multiple className="hidden" onChange={(e) => (addFiles(e.target.files), (e.target.value = ''))} />
                  </>
                ) : undefined
              }
            >
              {d.files.length ? (
                <table className={erp.table}>
                  <tbody>
                    {d.files.map((f, i) => (
                      <tr key={f.id} className={erp.tr}>
                        <td className={`${erp.td} border-l-0 w-10 text-center text-slate-500`}>{i + 1}</td>
                        <td className={erp.td}>
                          <span className="inline-flex items-center gap-1.5">
                            <Paperclip size={12} className="text-slate-400" />
                            {f.name}
                          </span>
                        </td>
                        <td className={`${erp.td} ${erp.num} w-20 text-slate-500`}>{fileSize(f.size)}</td>
                        {ed && (
                          <td className={`${erp.td} border-r-0 w-10 text-center`}>
                            <button type="button" className="p-1 rounded text-slate-400 hover:text-rose-600 cursor-pointer" title="Bỏ file" onClick={() => setD({ ...d, files: d.files.filter((x) => x.id !== f.id) })}>
                              <X size={13} />
                            </button>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="px-3 py-3 text-[12.5px] text-slate-400">Chưa có file (bản scan HĐ đã ký, phụ lục…).</p>
              )}
            </Panel>
            <Panel title="Ghi chú" icon={NotebookPen}>
              {ed ? <textarea value={d.note} rows={3} placeholder="Nhập ghi chú…" onChange={(e) => setD({ ...d, note: e.target.value })} className={`${INPUT} h-auto py-1.5 resize-y`} /> : <p className="whitespace-pre-wrap text-[13px]">{d.note || <span className="text-slate-400">—</span>}</p>}
            </Panel>
          </div>
        </div>
      )}

      {tab === 'chain' && (
        <Panel title="Quá trình hợp đồng của người lao động" icon={ListOrdered} noPad footer="Bấm vào dòng để mở hợp đồng · Tái ký theo thứ tự Thử việc → XĐ 1 năm → XĐ 2 năm → Không xác định thời hạn">
          <table className={erp.table}>
            <thead>
              <tr>
                {['STT', 'Số hợp đồng', 'Loại hợp đồng', 'Thời hạn', 'Ngày ký', 'Ngày có hiệu lực', 'Ngày hết hạn', 'Lương cơ bản', 'Người ký', 'Trạng thái'].map((h, i, arr) => (
                  <th key={h} className={`${erp.th} border-t-0 ${i === 0 ? 'border-l-0 w-12 text-center' : i === arr.length - 1 ? 'border-r-0 text-left' : h === 'Lương cơ bản' ? 'text-right' : 'text-left'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {others.map((x, i) => (
                <tr key={x.id} onClick={() => x.id !== d.id && setMode({ kind: 'detail', id: x.id })} className={`${x.id === d.id ? 'bg-[#dbe8f8] font-semibold' : `${erp.tr} cursor-pointer`}`}>
                  <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{i + 1}</td>
                  <td className={`${erp.td} ${erp.code}`}>{x.no}</td>
                  <td className={erp.td}>{x.type}</td>
                  <td className={`${erp.td} text-center`}>{x.term || '—'}</td>
                  <td className={`${erp.td} text-center`}>{dmy(x.signDate)}</td>
                  <td className={`${erp.td} text-center`}>{dmy(x.from)}</td>
                  <td className={`${erp.td} text-center`}>{x.to ? dmy(x.to) : '—'}</td>
                  <td className={`${erp.td} ${erp.num}`}>{money(salaryOf(x))}</td>
                  <td className={erp.td}>{x.signer || '—'}</td>
                  <td className={`${erp.td} border-r-0`}>
                    <StateTag st={stateOf(x, s.contracts, 30)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {tab === 'history' && (
        <Panel title="Lịch sử thay đổi" icon={History} noPad>
          <table className={erp.table}>
            <thead>
              <tr>
                {['Thời gian', 'Người thực hiện', 'Thao tác', 'Nội dung thay đổi'].map((h, i, arr) => (
                  <th key={h} className={`${erp.th} text-left border-t-0 ${i === 0 ? 'border-l-0 w-40' : ''} ${i === arr.length - 1 ? 'border-r-0' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...d.history].reverse().map((h, i) => (
                <tr key={i} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 whitespace-nowrap`}>{fmtAt(h.at)}</td>
                  <td className={erp.td}>{h.by}</td>
                  <td className={`${erp.td} font-semibold`}>{h.action}</td>
                  <td className={`${erp.td} border-r-0`}>
                    {h.changes?.length ? (
                      <ul className="space-y-0.5">
                        {h.changes.map((c, j) => (
                          <li key={j}>{c}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {!d.history.length && (
                <tr>
                  <td colSpan={4} className="px-3 py-8 text-center text-slate-400">
                    Chưa có lịch sử.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Panel>
      )}
    </div>
  );
};

// ==========================================================================
// Tái ký hàng loạt (khung trên trang)
// ==========================================================================
const RenewPanel: React.FC<{ s: Store; rows: Row[]; onClose: () => void; onDone: (n: number) => void }> = ({ s, rows, onClose, onDone }) => {
  // Mỗi NLĐ chỉ tái ký từ HĐ mới nhất của họ
  const items = useMemo(() => {
    const seen = new Set<string>();
    return rows
      .map((r) => ({ r, last: [...s.contracts].filter((c) => c.workerId === r.w.id).sort((a, b) => b.from.localeCompare(a.from))[0] }))
      .filter(({ r }) => (seen.has(r.w.id) ? false : (seen.add(r.w.id), true)));
  }, [rows, s.contracts]);
  const [cfg, setCfg] = useState(
    () => Object.fromEntries(items.map(({ r, last }) => [r.w.id, { ...nextOf(last), from: last.to ? addDays(last.to, 1) : '' }])) as Record<string, { type: CType; term: string; from: string }>,
  );
  const [signDate, setSignDate] = useState('');
  const [signPlace, setSignPlace] = useState('Hà Nội');

  const plan = (() => {
    let all = s.contracts;
    return items.map(({ r, last }) => {
      const k = cfg[r.w.id];
      if (isK(last.type, 'KXD') && !last.to) return { r, last, skip: 'HĐ không xác định thời hạn — không cần tái ký' };
      const c: Contract = {
        ...blankFor(r.w, s, k.type, k.from),
        companyId: last.companyId,
        no: nextContractNo(r.w.code, last.companyId, k.type, all),
        term: isK(k.type, 'KXD') ? '' : k.term,
        to: endOf(k.type, isK(k.type, 'KXD') ? '' : k.term, k.from),
        signDate: signDate || k.from,
        signPlace,
        unit: last.unit,
        position: last.position,
        workplace: last.workplace,
        workTime: last.workTime,
        jobDesc: last.jobDesc,
        baseSalary: last.baseSalary,
        allowances: normSupports(last.allowances),
        perfBonus: last.perfBonus || 0,
      };
      const sg = signerOf(c.unit, c.type, c.signDate, s.signers, c.companyId);
      c.signerSalutation = sg?.salutation || '';
      c.signer = sg?.signer || '';
      c.signerTitle = sg?.signerTitle || '';
      c.authorization = sg?.authorization || '';
      c.history = [{ at: nowIso(), by: ME, action: `Tái ký từ HĐ ${last.no}` }];
      const e = validate(c, all);
      const err = Object.values(e)[0];
      if (!err) all = [...all, c];
      return { r, last, c, err };
    });
  })();
  const ok = plan.filter((p) => p.c && !p.err);
  const run = () => {
    const add = ok.map((p) => p.c!);
    update((x) => ({ ...x, contracts: [...x.contracts, ...add] }));
    onDone(add.length);
  };
  const th = `${erp.th} border-t-0 text-left`;

  return (
    <Panel
      title={`Tái ký hợp đồng — ${items.length} người lao động`}
      icon={RefreshCw}
      noPad
      className="!border-[#1f5fa8]"
      actions={
        <Btn icon={X} className="h-7" onClick={onClose}>
          Đóng
        </Btn>
      }
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-3 py-2 border-b border-slate-200 bg-[#fafbfd] text-[12px]">
        <label className="flex items-center gap-2">
          <span className="text-slate-600 whitespace-nowrap">Ngày ký</span>
          <span className="w-36">
            <DateInput value={signDate} onChange={setSignDate} />
          </span>
          <span className="text-slate-400">(trống = ngày có hiệu lực)</span>
        </label>
        <label className="flex items-center gap-2">
          <span className="text-slate-600 whitespace-nowrap">Nơi ký</span>
          <input value={signPlace} onChange={(e) => setSignPlace(e.target.value)} className={`${erp.input} w-36`} />
        </label>
        <span className="text-slate-500 flex-1 min-w-[260px]">Loại HĐ gợi ý: Thử việc → XĐ 1 năm → XĐ 2 năm → Không xác định thời hạn · Người ký lấy theo Thiết lập người ký.</span>
      </div>
      <div className="overflow-auto max-h-[360px]">
        <table className={erp.table}>
          <thead className="sticky top-0 z-10">
            <tr>
              <th className={`${th} border-l-0 w-10 text-center`}>STT</th>
              {['Người lao động', 'Hợp đồng hiện tại', 'Loại HĐ mới', 'Thời hạn', 'Ngày có hiệu lực', 'Ngày hết hạn', 'Người ký', 'Kiểm tra'].map((h, i, arr) => (
                <th key={h} className={`${th} ${i === arr.length - 1 ? 'border-r-0' : ''}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {plan.map((p, i) => {
              const k = cfg[p.r.w.id];
              const setK = (patch: Partial<{ type: CType; term: string; from: string }>) =>
                setCfg((o) => {
                  const n = { ...o[p.r.w.id], ...patch };
                  if (patch.type) n.term = defaultTerm(patch.type);
                  return { ...o, [p.r.w.id]: n };
                });
              return (
                <tr key={p.r.w.id} className={erp.tr}>
                  <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{i + 1}</td>
                  <td className={`${erp.td} whitespace-nowrap`}>
                    <b>{p.r.w.name}</b> <span className="font-mono text-slate-400">{p.r.w.code}</span>
                  </td>
                  <td className={`${erp.td} text-slate-600 whitespace-nowrap`}>{lineOf(p.last)}</td>
                  {p.skip ? (
                    <td colSpan={6} className={`${erp.td} border-r-0 text-slate-400`}>
                      {p.skip}
                    </td>
                  ) : (
                    <>
                      <td className={`${erp.td} !py-1`}>
                        <select value={k.type} onChange={(e) => setK({ type: e.target.value as CType })} className={`${erp.input} h-7 w-48`}>
                          {typeNames().map((tp) => (
                            <option key={tp} value={tp}>
                              {shortOf(tp)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className={`${erp.td} !py-1`}>
                        <select value={k.term} disabled={isK(k.type, 'KXD')} onChange={(e) => setK({ term: e.target.value })} className={`${erp.input} h-7 w-24`}>
                          {isK(k.type, 'KXD') && <option value="">—</option>}
                          {termsOf(k.type).map((x) => (
                            <option key={x.label}>{x.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className={`${erp.td} !py-1 w-36`}>
                        <DateInput value={k.from} onChange={(v) => setK({ from: v })} className="!h-7" />
                      </td>
                      <td className={`${erp.td} text-center whitespace-nowrap`}>{p.c?.to ? dmy(p.c.to) : '—'}</td>
                      <td className={`${erp.td} whitespace-nowrap`}>{p.c?.signer || <span className="text-rose-600">Chưa có thiết lập</span>}</td>
                      <td className={`${erp.td} border-r-0`}>
                        {p.err ? (
                          <span className="text-rose-600 text-[12px]">{p.err}</span>
                        ) : (
                          <Tag cls="bg-emerald-50 text-emerald-700 border-emerald-300" icon={Check}>
                            Hợp lệ
                          </Tag>
                        )}
                      </td>
                    </>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-1.5 px-3 py-2 border-t border-slate-300 bg-slate-50">
        <span className="mr-auto text-[12px] text-slate-600">
          Hợp lệ <b className="text-emerald-700">{ok.length}</b> / {plan.length}
        </span>
        <Btn onClick={onClose}>Huỷ</Btn>
        <Btn variant="primary" icon={RefreshCw} disabled={!ok.length} onClick={run}>
          Tái ký {ok.length} hợp đồng
        </Btn>
      </div>
    </Panel>
  );
};

// ==========================================================================
// Nhập từ Excel
// ==========================================================================
const TPL_COLS = ['Mã NLĐ', 'Số HĐ', 'Loại HĐ', 'Thời hạn', 'Ngày ký', 'Ngày có hiệu lực', 'Ngày hết hạn', 'Đơn vị ký HĐ', 'Vị trí công việc', 'Lương cơ bản gốc', 'Mức hưởng (%)', 'Ghi chú', 'Mã công ty', ...SUPPORTS.map((x) => x.name), 'Thưởng hiệu quả (tạm tính)'];
const downloadTemplate = () => {
  const t = today();
  const sample = STATE.workers.find((w) => w.working && !STATE.contracts.some((c) => c.workerId === w.id));
  const ws = XLSX.utils.aoa_to_sheet([
    TPL_COLS,
    [sample?.code || 'NV1010', '', TV, '2 tháng', dmy(t), dmy(t), '', sample?.unit || UNITS[4], sample?.position || 'Kỹ sư phần mềm', 24_000_000, 85, 'Để trống Số HĐ: hệ thống tự sinh theo «Mã NV»/«ký hiệu công ty»/«ký hiệu loại HĐ»', getCatalog().companies.find((co) => co.id === defaultCompanyId())?.code || '', 730_000, 500_000, 0, 0, 0],
  ]);
  ws['!cols'] = TPL_COLS.map((c) => ({ wch: Math.max(14, c.length + 4) }));
  const ref = XLSX.utils.aoa_to_sheet([
    ['Loại HĐ', 'Thời hạn hợp lệ'],
    ...typeNames().map((tp) => [tp, termsOf(tp).map((x) => x.label).join(', ') || '(để trống)']),
    [],
    ['Mã công ty', 'Tên công ty'],
    ...activeCompanies().map((co) => [co.code, co.name]),
    [],
    ['Đơn vị ký HĐ'],
    ...UNITS.map((u) => [u]),
    [],
    ['Ghi chú'],
    ['Số HĐ đã tồn tại → cập nhật hợp đồng đó; để trống hoặc số mới → thêm mới.'],
    ['Ngày dạng dd/mm/yyyy. Ngày hết hạn để trống sẽ tự tính theo loại HĐ và thời hạn.'],
  ]);
  ref['!cols'] = [{ wch: 40 }, { wch: 40 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'HopDong');
  XLSX.utils.book_append_sheet(wb, ref, 'DanhMuc');
  XLSX.writeFile(wb, 'mau-nhap-hop-dong.xlsx');
};
type ImpRow = { line: number; kind: 'Thêm mới' | 'Cập nhật' | 'Lỗi'; code: string; name: string; c?: Contract; err?: string };
const matchType = (v: string): CType | undefined => {
  const n = norm(v);
  if (!n) return undefined;
  const hit = getCatalog().types.find((t) => t.active && (norm(t.name) === n || norm(shortOf(t.name)) === n || norm(t.code) === n));
  if (hit) return hit.name;
  return /thu viec/.test(n) ? defaultTypeOf('TV') : /khong xac dinh/.test(n) ? defaultTypeOf('KXD') : /xac dinh/.test(n) ? defaultTypeOf('XD') : undefined;
};
const KIND_CLS = { 'Thêm mới': 'bg-emerald-50 text-emerald-700 border-emerald-300', 'Cập nhật': 'bg-sky-50 text-sky-700 border-sky-300', Lỗi: 'bg-rose-50 text-rose-700 border-rose-300' };

const ImportPanel: React.FC<{ s: Store; onClose: () => void; flash: (m: string) => void }> = ({ s, onClose, flash }) => {
  const [fileName, setFileName] = useState('');
  const [rows, setRows] = useState<ImpRow[]>([]);
  const [onlyErr, setOnlyErr] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  const parse = async (f: File) => {
    setFileName(f.name);
    const wb = XLSX.read(await f.arrayBuffer(), { cellDates: true });
    const sh = wb.Sheets[wb.SheetNames[0]];
    const aoa = XLSX.utils.sheet_to_json<unknown[]>(sh, { header: 1, defval: '', raw: true });
    const head = (aoa[0] || []).map((h) => norm(h));
    const idx = (label: string) => head.indexOf(norm(label));
    const miss = TPL_COLS.filter((c) => ['Mã NLĐ', 'Loại HĐ', 'Ngày có hiệu lực'].includes(c) && idx(c) < 0);
    if (miss.length) {
      setRows([]);
      return flash(`File thiếu cột: ${miss.join(', ')} — dùng "Tải file mẫu nhập"`);
    }
    let all = s.contracts;
    const out: ImpRow[] = [];
    aoa.slice(1).forEach((r, i) => {
      const g = (label: string) => (idx(label) >= 0 ? r[idx(label)] : '');
      const gs = (label: string) => String(g(label) ?? '').trim();
      if (!r.some((v) => String(v ?? '').trim())) return;
      const line = i + 2;
      const code = gs('Mã NLĐ');
      const w = s.workers.find((x) => x.code.toLowerCase() === code.toLowerCase());
      const fail = (err: string) => out.push({ line, kind: 'Lỗi', code, name: w?.name || '', err });
      if (!code) return fail('Mã NLĐ: Bắt buộc');
      if (!w) return fail(`Không tìm thấy NLĐ mã ${code}`);
      const no = gs('Số HĐ');
      const old = no ? all.find((c) => c.no.toLowerCase() === no.toLowerCase()) : undefined;
      if (old && old.workerId !== w.id) return fail(`Số HĐ ${no} thuộc NLĐ khác`);
      const typeRaw = gs('Loại HĐ');
      const type = matchType(typeRaw) || (typeRaw ? undefined : old?.type);
      if (!type) return fail(typeRaw ? `Loại HĐ không hợp lệ: ${typeRaw}` : 'Loại HĐ: Bắt buộc');
      const term = isK(type, 'KXD') ? '' : gs('Thời hạn') || (old?.type === type ? old.term : '');
      if (!isK(type, 'KXD') && !termsOf(type).some((x) => x.label === term)) return fail(term ? `Thời hạn "${term}" không hợp lệ với ${shortOf(type)}` : 'Thời hạn: Bắt buộc');
      const dates: Record<string, string> = {};
      for (const [k, label] of [
        ['signDate', 'Ngày ký'],
        ['from', 'Ngày có hiệu lực'],
        ['to', 'Ngày hết hạn'],
      ] as const) {
        const v = parseDateCell(g(label));
        if (v === null) return fail(`${label} không đúng dạng dd/mm/yyyy`);
        dates[k] = v;
      }
      const from = dates.from || old?.from || '';
      if (!from) return fail('Ngày có hiệu lực: Bắt buộc');
      const unit = gs('Đơn vị ký HĐ') || old?.unit || w.unit;
      const coCode = gs('Mã công ty');
      const co = coCode ? getCatalog().companies.find((x) => x.code.toLowerCase() === coCode.toLowerCase()) : undefined;
      if (coCode && !co) return fail(`Mã công ty không có trong danh mục: ${coCode}`);
      if (co && !co.active && co.id !== old?.companyId) return fail(`Công ty ${co.code} đã ngừng sử dụng`);
      if (!UNITS.includes(unit)) return fail(`Đơn vị không có trong danh mục: ${unit}`);
      const baseRaw = g('Lương cơ bản gốc');
      const rateRaw = g('Mức hưởng (%)');
      const base = baseRaw === '' ? undefined : typeof baseRaw === 'number' ? baseRaw : parseMoney(String(baseRaw));
      const rate = rateRaw === '' ? undefined : Number(rateRaw);
      if (rate !== undefined && isNaN(rate)) return fail('Mức hưởng phải là số');
      const num = (label: string) => {
        const v = g(label);
        return v === '' || v === undefined ? undefined : typeof v === 'number' ? v : parseMoney(String(v));
      };
      const baseC = old ? structuredClone(old) : blankFor(w, { ...s, contracts: all }, type, from);
      const c: Contract = {
        ...baseC,
        no: old ? old.no : no || nextContractNo(w.code, co?.id || baseC.companyId, type, all),
        type,
        term,
        signDate: dates.signDate || old?.signDate || from,
        from,
        to: isK(type, 'KXD') ? '' : dates.to || endOf(type, term, from),
        unit,
        companyId: co?.id || baseC.companyId,
        position: gs('Vị trí công việc') || old?.position || w.position,
        baseSalary: base ?? baseC.baseSalary,
        rate: rate ?? (old && old.type === type ? old.rate : rateOf(type)),
        note: gs('Ghi chú') || old?.note || '',
        allowances: normSupports(baseC.allowances).map((a) => ({ ...a, amount: num(a.name) ?? a.amount })),
        perfBonus: num('Thưởng hiệu quả (tạm tính)') ?? baseC.perfBonus ?? 0,
      };
      if (!old) {
        // HĐ mới: người ký theo thiết lập
        const sg = signerOf(c.unit, c.type, c.signDate, s.signers, c.companyId);
        c.signerSalutation = sg?.salutation || '';
        c.signer = sg?.signer || '';
        c.signerTitle = sg?.signerTitle || '';
        c.authorization = sg?.authorization || '';
      }
      const e = validate(c, all);
      if (Object.keys(e).length) return fail(Object.entries(e).map(([k, v]) => `${LABELS.find(([lk]) => lk === k)?.[1] || (k === 'workerId' ? 'NLĐ' : k)}: ${v}`).join(' · '));
      if (old) {
        const ch = diffC(old, c);
        c.history = [...old.history, { at: nowIso(), by: ME, action: `Cập nhật từ Excel (${f.name})`, changes: ch }];
        all = all.map((x) => (x.id === old.id ? c : x));
      } else {
        c.history = [{ at: nowIso(), by: ME, action: `Nhập từ Excel (${f.name})` }];
        all = [...all, c];
      }
      out.push({ line, kind: old ? 'Cập nhật' : 'Thêm mới', code, name: w.name, c });
    });
    setRows(out);
    if (!out.length) flash('File không có dòng dữ liệu');
  };
  const nIns = rows.filter((r) => r.kind === 'Thêm mới').length;
  const nUpd = rows.filter((r) => r.kind === 'Cập nhật').length;
  const nErr = rows.filter((r) => r.kind === 'Lỗi').length;
  const save = () => {
    const ok = rows.filter((r) => r.c);
    update((x) => {
      let cs = x.contracts;
      ok.forEach((r) => (cs = cs.some((c) => c.id === r.c!.id) ? cs.map((c) => (c.id === r.c!.id ? r.c! : c)) : [...cs, r.c!]));
      return { ...x, contracts: cs };
    });
    flash(`Đã nhập: thêm mới ${nIns}, cập nhật ${nUpd}${nErr ? `, bỏ qua ${nErr} dòng lỗi` : ''}`);
    onClose();
  };
  const shown = onlyErr ? rows.filter((r) => r.kind === 'Lỗi') : rows;
  const th = `${erp.th} border-t-0 text-left`;

  return (
    <Panel
      title="Import hợp đồng từ Excel"
      icon={Upload}
      noPad
      className="!border-[#1f5fa8]"
      actions={
        <>
          <Btn icon={Download} className="h-7" onClick={downloadTemplate}>
            Tải file mẫu nhập
          </Btn>
          <Btn icon={X} className="h-7" onClick={onClose}>
            Đóng
          </Btn>
        </>
      }
      footer="Số HĐ đã có → cập nhật hợp đồng đó · để trống Số HĐ → thêm mới, hệ thống tự sinh số · dòng lỗi không được lưu."
    >
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 bg-[#fafbfd]">
        <Btn icon={FileSpreadsheet} onClick={() => ref.current?.click()}>
          Chọn file .xlsx
        </Btn>
        <input ref={ref} type="file" accept=".xlsx,.xls" className="hidden" onChange={(e) => (e.target.files?.[0] && parse(e.target.files[0]), (e.target.value = ''))} />
        <span className="text-[12.5px] text-slate-600">{fileName || 'Chưa chọn file'}</span>
        {rows.length > 0 && (
          <span className="ml-auto flex flex-wrap items-center gap-1.5">
            <Tag cls={KIND_CLS['Thêm mới']}>Thêm mới {nIns}</Tag>
            <Tag cls={KIND_CLS['Cập nhật']}>Cập nhật {nUpd}</Tag>
            <Tag cls={KIND_CLS['Lỗi']}>Lỗi {nErr}</Tag>
            {nErr > 0 && (
              <label className="flex items-center gap-1.5 ml-2 text-[12px] cursor-pointer">
                <CheckBox checked={onlyErr} onChange={setOnlyErr} /> Chỉ xem dòng lỗi
              </label>
            )}
          </span>
        )}
      </div>
      {rows.length > 0 && (
        <>
          <div className="overflow-auto max-h-[340px]">
            <table className={erp.table}>
              <thead className="sticky top-0">
                <tr>
                  {['Dòng', 'Kết quả', 'Mã NLĐ', 'Họ và tên', 'Số HĐ', 'Loại HĐ', 'Hiệu lực', 'Lương cơ bản', 'Chi tiết'].map((h, i, arr) => (
                    <th key={h} className={`${th} ${i === 0 ? 'border-l-0 w-12 text-center' : ''} ${i === arr.length - 1 ? 'border-r-0' : ''} ${h === 'Lương cơ bản' ? '!text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((r) => (
                  <tr key={r.line} className={erp.tr}>
                    <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{r.line}</td>
                    <td className={erp.td}>
                      <Tag cls={KIND_CLS[r.kind]}>{r.kind}</Tag>
                    </td>
                    <td className={`${erp.td} ${erp.code}`}>{r.code}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.name}</td>
                    <td className={`${erp.td} font-mono`}>{r.c?.no}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.c ? `${shortOf(r.c.type)}${r.c.term ? ` ${r.c.term}` : ''}` : ''}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{r.c ? `${dmy(r.c.from)} → ${r.c.to ? dmy(r.c.to) : '—'}` : ''}</td>
                    <td className={`${erp.td} ${erp.num}`}>{r.c ? money(salaryOf(r.c)) : ''}</td>
                    <td className={`${erp.td} border-r-0 ${r.err ? 'text-rose-600' : 'text-slate-500'}`}>{r.err || (r.kind === 'Cập nhật' ? r.c?.history[r.c.history.length - 1]?.changes?.join(' · ') || 'Không đổi' : '')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end gap-1.5 px-3 py-2 border-t border-slate-300 bg-slate-50">
            <Btn onClick={onClose}>Huỷ</Btn>
            <Btn variant="primary" icon={Save} disabled={!nIns && !nUpd} onClick={save}>
              Lưu {nIns + nUpd} dòng hợp lệ
            </Btn>
          </div>
        </>
      )}
    </Panel>
  );
};

// ==========================================================================
// Thiết lập người ký hợp đồng
// ==========================================================================
const SignerSetup: React.FC<{ s: Store; onBack: () => void; flash: (m: string) => void }> = ({ s, onBack, flash }) => {
  const blank = (): SignerSetting => ({ id: uid(), unit: '', types: [...typeNames()], from: today(), salutation: 'Ông', signer: '', signerTitle: '', authorization: '' });
  const [form, setForm] = useState<SignerSetting | null>(null);
  const [tried, setTried] = useState(false);
  const [delId, setDelId] = useState<string | null>(null);
  const isEdit = !!form && s.signers.some((x) => x.id === form.id);
  const errs: Record<string, string> = {};
  if (form) {
    if (!form.types.length) errs.types = 'Chọn ít nhất 1 loại';
    if (!form.from) errs.from = 'Bắt buộc';
    if (!form.signer.trim()) errs.signer = 'Bắt buộc';
    if (!form.signerTitle.trim()) errs.signerTitle = 'Bắt buộc';
    const dup = s.signers.find((x) => x.id !== form.id && x.unit === form.unit && x.from === form.from && x.types.some((tp) => form.types.includes(tp)));
    if (dup) errs.from = `Trùng thiết lập của ${dup.signer} (cùng đơn vị, ngày hiệu lực, loại HĐ)`;
  }
  const E = (k: string) => (tried ? errs[k] : undefined);
  const save = () => {
    setTried(true);
    if (!form || Object.keys(errs).length) return;
    const v = { ...form, signer: form.signer.trim(), signerTitle: form.signerTitle.trim(), authorization: form.authorization.trim() };
    update((x) => ({ ...x, signers: isEdit ? x.signers.map((y) => (y.id === v.id ? v : y)) : [...x.signers, v] }));
    flash(isEdit ? 'Đã cập nhật thiết lập người ký' : 'Đã thêm thiết lập người ký');
    setForm(null);
    setTried(false);
  };
  const list = [...s.signers].sort((a, b) => a.unit.localeCompare(b.unit) || b.from.localeCompare(a.from));
  const exportX = () => {
    const ws = XLSX.utils.aoa_to_sheet([['Đơn vị', 'Loại hợp đồng', 'Ngày hiệu lực', 'Người ký', 'Chức danh', 'Giấy uỷ quyền'], ...list.map((x) => [x.unit || 'Tất cả đơn vị', x.types.map((tp) => shortOf(tp)).join(', '), dmy(x.from), `${x.salutation} ${x.signer}`, x.signerTitle, x.authorization])]);
    ws['!cols'] = [{ wch: 34 }, { wch: 50 }, { wch: 14 }, { wch: 24 }, { wch: 22 }, { wch: 50 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'NguoiKy');
    XLSX.writeFile(wb, 'thiet-lap-nguoi-ky.xlsx');
  };
  const th = `${erp.th} border-t-0 text-left`;

  return (
    <div className="space-y-3">
      <ErpTitleBar
        crumbs={CRUMBS}
        title="Thiết lập người ký hợp đồng"
        onBack={onBack}
        actions={
          <>
            <Btn icon={FileSpreadsheet} onClick={exportX}>
              Xuất Excel
            </Btn>
            <Btn variant="primary" icon={Plus} onClick={() => (setForm(blank()), setTried(false))}>
              Thêm thiết lập
            </Btn>
          </>
        }
        notice={
          <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 text-[12px] text-slate-600">
            <Settings2 size={13} className="shrink-0 text-[#1f5fa8]" />
            Khi thêm / tái ký hợp đồng, người ký mặc định lấy theo thiết lập khớp <b>đơn vị ký HĐ</b> (ưu tiên thiết lập riêng của đơn vị hơn "Tất cả đơn vị"), <b>loại HĐ</b> và có <b>ngày hiệu lực</b> gần nhất không sau ngày ký.
          </div>
        }
      />

      {form && (
        <Panel
          title={isEdit ? 'Sửa thiết lập người ký' : 'Thêm thiết lập người ký'}
          icon={PenLine}
          noPad
          className="!border-[#1f5fa8]"
          actions={
            <>
              <Btn icon={X} className="h-7" onClick={() => (setForm(null), setTried(false))}>
                Huỷ
              </Btn>
              <Btn variant="primary" icon={Save} className="h-7" onClick={save}>
                Lưu
              </Btn>
            </>
          }
        >
          <InfoGrid
            left={[
              {
                label: 'Đơn vị ký HĐ',
                value: (
                  <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className={INPUT}>
                    <option value="">Tất cả đơn vị</option>
                    {UNITS.map((u) => (
                      <option key={u}>{u}</option>
                    ))}
                  </select>
                ),
              },
              {
                label: lb('Loại hợp đồng', true, true),
                value: (
                  <>
                    <span className="flex flex-wrap gap-x-4 gap-y-1">
                      {typeNames().map((tp) => (
                        <span key={tp} className="flex items-center gap-1.5">
                          <CheckBox checked={form.types.includes(tp)} onChange={(v) => setForm({ ...form, types: v ? typeNames().filter((x) => form.types.includes(x) || x === tp) : form.types.filter((x) => x !== tp) })} /> {shortOf(tp)}
                        </span>
                      ))}
                    </span>
                    <ErrText e={E('types')} />
                  </>
                ),
              },
              {
                label: lb('Ngày hiệu lực', true, true),
                value: (
                  <>
                    <DateInput value={form.from} onChange={(v) => setForm({ ...form, from: v })} className={errCls(E('from'))} />
                    <ErrText e={E('from')} />
                  </>
                ),
              },
            ]}
            right={[
              {
                label: lb('Người ký', true, true),
                value: (
                  <>
                    <span className="flex items-center gap-1.5 w-full">
                      <select value={form.salutation} onChange={(e) => setForm({ ...form, salutation: e.target.value })} className={`${INPUT} w-20`}>
                        <option>Ông</option>
                        <option>Bà</option>
                      </select>
                      <input value={form.signer} onChange={(e) => setForm({ ...form, signer: e.target.value })} className={`${INPUT} ${errCls(E('signer'))}`} />
                    </span>
                    <ErrText e={E('signer')} />
                  </>
                ),
              },
              {
                label: lb('Chức danh', true, true),
                value: (
                  <>
                    <input value={form.signerTitle} onChange={(e) => setForm({ ...form, signerTitle: e.target.value })} className={`${INPUT} ${errCls(E('signerTitle'))}`} />
                    <ErrText e={E('signerTitle')} />
                  </>
                ),
              },
              { label: 'Giấy uỷ quyền', value: <input value={form.authorization} placeholder="Số / ngày giấy uỷ quyền (nếu có)" onChange={(e) => setForm({ ...form, authorization: e.target.value })} className={INPUT} /> },
            ]}
          />
        </Panel>
      )}

      <Panel title="Danh sách thiết lập người ký" icon={Table2} noPad footer={`${list.length} thiết lập`}>
        <div className="overflow-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${th} border-l-0 w-12 text-center`}>STT</th>
                {['Đơn vị ký HĐ', 'Loại hợp đồng', 'Ngày hiệu lực', 'Người ký', 'Chức danh', 'Giấy uỷ quyền', 'Đang áp dụng'].map((h) => (
                  <th key={h} className={th}>
                    {h}
                  </th>
                ))}
                <th className={`${th} border-r-0 w-28 text-center`}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {list.map((x, i) => {
                const used = s.contracts.filter((c) => c.signer === x.signer && (!x.unit || c.unit === x.unit) && x.types.includes(c.type)).length;
                return (
                  <tr key={x.id} className={form?.id === x.id ? 'bg-[#dbe8f8]' : erp.tr}>
                    <td className={`${erp.td} border-l-0 text-center text-slate-500`}>{i + 1}</td>
                    <td className={erp.td}>{x.unit || <i className="text-slate-500">Tất cả đơn vị</i>}</td>
                    <td className={erp.td}>
                      <span className="flex flex-wrap gap-1">
                        {x.types.map((tp) => (
                          <Tag key={tp} cls="bg-white text-slate-700 border-slate-300">
                            <span className="w-1.5 h-1.5 rounded-sm" style={{ background: colorOf(tp) }} />
                            {shortOf(tp)}
                          </Tag>
                        ))}
                      </span>
                    </td>
                    <td className={`${erp.td} text-center`}>{dmy(x.from)}</td>
                    <td className={`${erp.td} font-semibold whitespace-nowrap`}>
                      {x.salutation} {x.signer}
                    </td>
                    <td className={erp.td}>{x.signerTitle}</td>
                    <td className={`${erp.td} text-slate-600`}>{x.authorization || '—'}</td>
                    <td className={`${erp.td} ${erp.num} text-slate-600`}>{used} HĐ</td>
                    <td className={`${erp.td} border-r-0 text-center whitespace-nowrap`}>
                      {delId === x.id ? (
                        <span className="inline-flex items-center gap-1">
                          <Btn
                            variant="danger"
                            className="h-6 px-2 !bg-rose-600 !text-white !border-rose-700"
                            onClick={() => (update((st) => ({ ...st, signers: st.signers.filter((y) => y.id !== x.id) })), setDelId(null), flash('Đã xoá thiết lập'))}
                          >
                            Xoá
                          </Btn>
                          <Btn className="h-6 px-2" onClick={() => setDelId(null)}>
                            Không
                          </Btn>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <button type="button" className={btn.link} onClick={() => (setForm({ ...x, types: [...x.types] }), setTried(false))}>
                            Sửa
                          </button>
                          <button type="button" className={`${btn.link} !text-rose-600`} onClick={() => setDelId(x.id)}>
                            Xoá
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!list.length && (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-center text-slate-400">
                    Chưa có thiết lập người ký.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
};

export default ContractsPage;
