/**
 * laborCost — Tính chi phí nhân công theo dự án từ timesheet (worklog Jira) và bảng lương.
 *
 * Logic (bám file "BẢNG CP DỰ ÁN THEO TIỀN LƯƠNG.xlsx"):
 *   MH   : giờ công mỗi NV log vào từng dự án trong kỳ (pivot từ Worklogs)
 *   Tỷ lệ: MH(NV, DA) / Tổng giờ NV log trong kỳ        (sheet MM / BHXH / CPCĐ)
 *   CP   : Tỷ lệ × Lương   +   Tỷ lệ × CP BHXH   +   Tỷ lệ × CPCĐ
 * → Toàn bộ chi phí lương của NV được phân bổ hết cho các dự án NV đã log,
 *   theo tỷ trọng giờ. Ngày công = giờ / 8.
 * NV không log Jira (hành chính, sale…) được "phân bổ thủ công" giờ vào dự án;
 * giờ thủ công cộng chung với giờ Jira khi tính tỷ lệ.
 *
 * Đơn vị tiền: VNĐ.
 */
import * as XLSX from 'xlsx';

export const HOURS_PER_DAY = 8;

export interface Worklog {
  username: string;
  fullName: string;
  project: string; // mã dự án (Project Name trên Jira)
  hours: number;
  date: string; // yyyy-mm-dd
  issueKey?: string;
}

/** Phân bổ thủ công cho NV không log Jira */
export interface ManualAllocation {
  period: string; // yyyy-mm
  username: string;
  fullName?: string;
  project: string;
  hours: number;
}

export interface SalaryRow {
  username: string;
  fullName?: string;
  salary: number; // Lương theo ngày công của kỳ
  bhxh: number; // CP BHXH công ty đóng
  cpcd: number; // Kinh phí công đoàn
}

export interface UserMeta {
  username: string;
  fullName?: string;
  required?: number; // giờ chuẩn của kỳ
  pendingWeeks: number; // số tuần timesheet chưa được duyệt
}

export interface LaborDataset {
  source: string;
  worklogs: Worklog[];
  /** Bảng lương theo kỳ: period (yyyy-mm) → username → lương */
  salaries: Record<string, Record<string, SalaryRow>>;
  /** Giờ chuẩn & trạng thái duyệt theo kỳ */
  users: Record<string, Record<string, UserMeta>>;
  manual: ManualAllocation[];
  /** Gán dự án → khối (ghi đè / bổ sung cho mapping từ Kế hoạch thu chi) */
  projectKhoi: Record<string, string>;
}

export const NO_KHOI = 'Chưa gán khối';

export interface Allocation {
  project: string;
  username: string;
  fullName: string;
  hours: number;
  manualHours: number;
  ratio: number;
  salary: number;
  bhxh: number;
  cpcd: number;
  total: number;
}

export interface EmployeeResult {
  username: string;
  fullName: string;
  hours: number;
  manualHours: number;
  required: number;
  pendingWeeks: number;
  hasSalary: boolean;
  salary: number;
  bhxh: number;
  cpcd: number;
  total: number;
  allocations: Allocation[];
}

export interface ProjectResult {
  project: string;
  khoi: string;
  headcount: number;
  hours: number;
  mm: number; // man-month = Σ tỷ lệ
  salary: number;
  bhxh: number;
  cpcd: number;
  total: number;
  members: Allocation[];
}

export interface LaborResult {
  period: string; // yyyy-mm
  employees: EmployeeResult[];
  projects: ProjectResult[];
  /** NV có lương nhưng không log giờ nào trong kỳ → chi phí chưa được phân bổ */
  unallocated: SalaryRow[];
  totals: { hours: number; salary: number; bhxh: number; cpcd: number; total: number };
}

// ==========================================================================
// Kỳ & giờ chuẩn
// ==========================================================================
export const periodsOf = (logs: Worklog[]) => Array.from(new Set(logs.map((w) => w.date.slice(0, 7)))).sort().reverse();

/** Mọi kỳ có dữ liệu (worklog, phân bổ thủ công hoặc bảng lương) */
export const datasetPeriods = (ds: LaborDataset) =>
  Array.from(new Set([...periodsOf(ds.worklogs), ...ds.manual.map((m) => m.period), ...Object.keys(ds.salaries)].filter(Boolean))).sort();

export const periodLabel = (p: string) => (p ? `${p.slice(5, 7)}/${p.slice(0, 4)}` : '—');

/** Giờ chuẩn = số ngày T2–T6 của tháng × 8 (dùng khi file không có sheet Users) */
export const standardHours = (period: string) => {
  const [y, m] = period.split('-').map(Number);
  let d = 0;
  for (let i = 1; i <= new Date(y, m, 0).getDate(); i++) {
    const wd = new Date(y, m - 1, i).getDay();
    if (wd !== 0 && wd !== 6) d++;
  }
  return d * HOURS_PER_DAY;
};

// ==========================================================================
// Tính toán
// ==========================================================================
export const computeLaborCost = (ds: LaborDataset, period: string, khoiOf: (project: string) => string = () => NO_KHOI): LaborResult => {
  const logs = ds.worklogs.filter((w) => w.date.startsWith(period));
  const std = standardHours(period);
  const salaries = ds.salaries[period] || {};
  const users = ds.users[period] || {};

  // MH: user → project → giờ (Jira + thủ công)
  const mh = new Map<string, Map<string, { h: number; manual: number }>>();
  const names = new Map<string, string>();
  const add = (username: string, project: string, hours: number, manual: boolean, fullName?: string) => {
    if (!mh.has(username)) mh.set(username, new Map());
    const m = mh.get(username)!;
    const c = m.get(project) || { h: 0, manual: 0 };
    c.h += hours;
    if (manual) c.manual += hours;
    m.set(project, c);
    if (fullName && !names.has(username)) names.set(username, fullName);
  };
  logs.forEach((w) => add(w.username, w.project, w.hours, false, w.fullName));
  ds.manual.filter((a) => a.period === period && a.hours > 0).forEach((a) => add(a.username, a.project, a.hours, true, a.fullName));

  const employees: EmployeeResult[] = [];
  const byProject = new Map<string, Allocation[]>();

  mh.forEach((projMap, username) => {
    const hours = Array.from(projMap.values()).reduce((s, c) => s + c.h, 0);
    const manualHours = Array.from(projMap.values()).reduce((s, c) => s + c.manual, 0);
    const sal = salaries[username];
    const meta = users[username];
    const fullName = names.get(username) || sal?.fullName || meta?.fullName || username;
    const allocations: Allocation[] = [];
    projMap.forEach(({ h, manual }, project) => {
      const ratio = hours ? h / hours : 0;
      const a: Allocation = {
        project,
        username,
        fullName,
        hours: h,
        manualHours: manual,
        ratio,
        salary: ratio * (sal?.salary || 0),
        bhxh: ratio * (sal?.bhxh || 0),
        cpcd: ratio * (sal?.cpcd || 0),
        total: 0,
      };
      a.total = a.salary + a.bhxh + a.cpcd;
      allocations.push(a);
      if (!byProject.has(project)) byProject.set(project, []);
      byProject.get(project)!.push(a);
    });
    allocations.sort((a, b) => b.hours - a.hours);
    employees.push({
      username,
      fullName,
      hours,
      manualHours,
      required: meta?.required || std,
      pendingWeeks: meta?.pendingWeeks || 0,
      hasSalary: !!sal,
      salary: sal?.salary || 0,
      bhxh: sal?.bhxh || 0,
      cpcd: sal?.cpcd || 0,
      total: sal ? sal.salary + sal.bhxh + sal.cpcd : 0,
      allocations,
    });
  });

  const projects: ProjectResult[] = Array.from(byProject.entries()).map(([project, members]) => {
    const sum = (f: (a: Allocation) => number) => members.reduce((s, a) => s + f(a), 0);
    return {
      project,
      khoi: khoiOf(project),
      headcount: members.length,
      hours: sum((a) => a.hours),
      mm: sum((a) => a.ratio),
      salary: sum((a) => a.salary),
      bhxh: sum((a) => a.bhxh),
      cpcd: sum((a) => a.cpcd),
      total: sum((a) => a.total),
      members: [...members].sort((a, b) => b.total - a.total),
    };
  });
  projects.sort((a, b) => b.total - a.total);
  employees.sort((a, b) => a.username.localeCompare(b.username));

  const unallocated = Object.values(salaries).filter((s) => !mh.has(s.username) && s.salary + s.bhxh + s.cpcd > 0);
  return { period, employees, projects, unallocated, totals: totalsOf(projects) };
};

const totalsOf = (projects: ProjectResult[]) => {
  const tot = (f: (p: ProjectResult) => number) => projects.reduce((s, p) => s + f(p), 0);
  return { hours: tot((p) => p.hours), salary: tot((p) => p.salary), bhxh: tot((p) => p.bhxh), cpcd: tot((p) => p.cpcd), total: tot((p) => p.total) };
};

/**
 * Chỉ giữ phần chi phí thuộc 1 khối: dự án của khối, và với mỗi NV chỉ các
 * phân bổ vào dự án của khối đó (NV làm chéo khối → chi phí tính về khối của dự án).
 */
export const filterByKhoi = (r: LaborResult, khoi: string): LaborResult => {
  if (!khoi) return r;
  const projects = r.projects.filter((p) => p.khoi === khoi);
  const codes = new Set(projects.map((p) => p.project));
  const employees = r.employees
    .map((e) => {
      const allocations = e.allocations.filter((a) => codes.has(a.project));
      const s = (f: (a: Allocation) => number) => allocations.reduce((x, a) => x + f(a), 0);
      return { ...e, allocations, hours: s((a) => a.hours), manualHours: s((a) => a.manualHours), salary: s((a) => a.salary), bhxh: s((a) => a.bhxh), cpcd: s((a) => a.cpcd), total: s((a) => a.total) };
    })
    .filter((e) => e.allocations.length);
  return { ...r, projects, employees, unallocated: [], totals: totalsOf(projects) };
};

/** Cộng dồn nhiều kỳ (vd cả năm): theo dự án & theo NV */
export const aggregateResults = (list: LaborResult[], label: string): LaborResult => {
  if (list.length === 1) return list[0];
  const proj = new Map<string, ProjectResult>();
  const emp = new Map<string, EmployeeResult>();
  const addAlloc = (arr: Allocation[], a: Allocation, key: 'project' | 'username') => {
    const x = arr.find((y) => y[key] === a[key]);
    if (!x) return void arr.push({ ...a });
    x.hours += a.hours;
    x.manualHours += a.manualHours;
    x.salary += a.salary;
    x.bhxh += a.bhxh;
    x.cpcd += a.cpcd;
    x.total += a.total;
    x.ratio += a.ratio; // cộng dồn = man-month
  };
  list.forEach((r) => {
    r.projects.forEach((p) => {
      const x = proj.get(p.project);
      if (!x) return void proj.set(p.project, { ...p, members: p.members.map((m) => ({ ...m })) });
      x.hours += p.hours;
      x.mm += p.mm;
      x.salary += p.salary;
      x.bhxh += p.bhxh;
      x.cpcd += p.cpcd;
      x.total += p.total;
      p.members.forEach((m) => addAlloc(x.members, m, 'username'));
      x.headcount = x.members.length;
    });
    r.employees.forEach((e) => {
      const x = emp.get(e.username);
      if (!x) return void emp.set(e.username, { ...e, allocations: e.allocations.map((a) => ({ ...a })) });
      x.hours += e.hours;
      x.manualHours += e.manualHours;
      x.required += e.required;
      x.pendingWeeks += e.pendingWeeks;
      x.hasSalary ||= e.hasSalary;
      x.salary += e.salary;
      x.bhxh += e.bhxh;
      x.cpcd += e.cpcd;
      x.total += e.total;
      e.allocations.forEach((a) => addAlloc(x.allocations, a, 'project'));
    });
  });
  // Tỷ lệ phân bổ của NV trong nhiều kỳ = giờ DA / tổng giờ
  emp.forEach((e) => e.allocations.forEach((a) => (a.ratio = e.hours ? a.hours / e.hours : 0)));
  const projects = Array.from(proj.values()).sort((a, b) => b.total - a.total);
  projects.forEach((p) => p.members.sort((a, b) => b.total - a.total));
  return {
    period: label,
    projects,
    employees: Array.from(emp.values()).sort((a, b) => a.username.localeCompare(b.username)),
    unallocated: list.flatMap((r) => r.unallocated),
    totals: totalsOf(projects),
  };
};

// ==========================================================================
// Đọc file Excel
// ==========================================================================
const norm = (s: unknown) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

const num = (v: unknown) => {
  if (typeof v === 'number') return isFinite(v) ? v : 0;
  const n = Number(String(v ?? '').replace(/[\s,]/g, ''));
  return isNaN(n) ? 0 : n;
};

const toDate = (v: unknown): string => {
  if (typeof v === 'number') {
    const d = XLSX.SSF.parse_date_code(v);
    return d ? `${d.y}-${String(d.m).padStart(2, '0')}-${String(d.d).padStart(2, '0')}` : '';
  }
  if (v instanceof Date) return `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, '0')}-${String(v.getDate()).padStart(2, '0')}`;
  const s = String(v ?? '').trim();
  let m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return `${m[1]}-${m[2].padStart(2, '0')}-${m[3].padStart(2, '0')}`;
  m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/); // dd/mm/yyyy
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return '';
};

const findCol = (head: string[], ...cands: string[]) => {
  for (const c of cands) {
    const i = head.indexOf(c);
    if (i >= 0) return i;
  }
  return -1;
};

export interface ParseReport {
  worklogs?: Worklog[];
  salaries?: Record<string, SalaryRow>;
  users?: Record<string, UserMeta>;
  manual?: ManualAllocation[]; // period để trống — gán theo kỳ khi nhập
  projectKhoi?: Record<string, string>;
  notes: string[];
  errors: string[];
}

/**
 * Nhận diện theo tiêu đề cột, không phụ thuộc tên sheet:
 *   • Worklog : có cột Username + Hours + (Project Name | Mã dự án) + Work date   (export Tempo/Jira)
 *   • Lương   : có cột User name + (Lương… | CP BHXH | CPCĐ) — có thể nằm ở 1 hoặc nhiều sheet
 *   • Users   : có cột Username + Required                                        (export Tempo)
 */
export const parseLaborWorkbook = (wb: XLSX.WorkBook): ParseReport => {
  const rep: ParseReport = { notes: [], errors: [] };
  const salaries: Record<string, SalaryRow> = {};
  const salaryCols = { salary: false, bhxh: false, cpcd: false };
  // Pivot giờ công (sheet MH): User name | <mã dự án>… | Grand Total
  const pivot: { username: string; project: string; hours: number }[] = [];
  let pivotSheet = '';

  for (const name of wb.SheetNames) {
    const aoa = XLSX.utils.sheet_to_json<unknown[]>(wb.Sheets[name], { header: 1, defval: '', blankrows: false });
    if (!aoa.length) continue;
    const head = aoa[0].map(norm);
    const body = aoa.slice(1);

    // --- Dự án → Khối: Mã dự án | Khối ---
    const cKhoi = findCol(head, 'khoi', 'ten khoi', 'account category');
    const cCode = findCol(head, 'ma du an', 'project name', 'project key', 'du an');
    if (cKhoi >= 0 && cCode >= 0 && findCol(head, 'hours', 'so gio') < 0) {
      const map: Record<string, string> = { ...(rep.projectKhoi || {}) };
      body.forEach((r) => {
        const code = String(r[cCode] ?? '').trim();
        const k = String(r[cKhoi] ?? '').trim();
        if (code && k) map[code] = k;
      });
      rep.projectKhoi = map;
      rep.notes.push(`Sheet "${name}": gán khối cho ${Object.keys(map).length} dự án`);
      continue;
    }

    const cUser = findCol(head, 'username', 'user name', 'tai khoan', 'ma nv');
    if (cUser < 0) continue;
    const cName = findCol(head, 'full name', 'ho va ten', 'ho ten');

    // --- Worklog ---
    const cHours = findCol(head, 'hours', 'so gio', 'gio');
    const cProj = findCol(head, 'project name', 'ma du an', 'du an', 'project key');
    const cDate = findCol(head, 'work date', 'ngay', 'ngay lam viec');
    if (cHours >= 0 && cProj >= 0 && cDate >= 0) {
      const cIssue = findCol(head, 'issue key');
      const logs: Worklog[] = [];
      let bad = 0;
      body.forEach((r) => {
        const username = String(r[cUser] ?? '').trim();
        const project = String(r[cProj] ?? '').trim();
        const date = toDate(r[cDate]);
        const hours = num(r[cHours]);
        if (!username && !project) return;
        if (!username || !project || !date || hours <= 0) return void bad++;
        logs.push({ username, project, date, hours, fullName: cName >= 0 ? String(r[cName] ?? '').trim() : '', issueKey: cIssue >= 0 ? String(r[cIssue]) : undefined });
      });
      rep.worklogs = [...(rep.worklogs || []), ...logs];
      rep.notes.push(`Sheet "${name}": ${logs.length.toLocaleString('vi-VN')} dòng worklog`);
      if (bad) rep.errors.push(`Sheet "${name}": bỏ qua ${bad} dòng thiếu tài khoản / dự án / ngày / số giờ.`);
      continue;
    }

    // --- Users (Tempo) ---
    const cReq = findCol(head, 'required', 'gio chuan');
    if (cReq >= 0) {
      const periodCols = head.map((h, i) => (h.startsWith('period') ? i : -1)).filter((i) => i >= 0);
      const users: Record<string, UserMeta> = { ...(rep.users || {}) };
      body.forEach((r) => {
        const username = String(r[cUser] ?? '').trim();
        if (!username) return;
        users[username] = {
          username,
          fullName: cName >= 0 ? String(r[cName] ?? '').trim() : undefined,
          required: num(r[cReq]) || undefined,
          pendingWeeks: periodCols.filter((c) => norm(r[c]) && norm(r[c]) !== 'approved').length,
        };
      });
      rep.users = users;
      rep.notes.push(`Sheet "${name}": giờ chuẩn & trạng thái duyệt của ${Object.keys(users).length} NV`);
      continue;
    }

    // --- Phân bổ thủ công dạng danh sách: Username | Mã dự án | Số giờ ---
    if (cProj >= 0 && cHours >= 0) {
      const list: ManualAllocation[] = [];
      body.forEach((r) => {
        const username = String(r[cUser] ?? '').trim();
        const project = String(r[cProj] ?? '').trim();
        const hours = num(r[cHours]);
        if (username && project && hours > 0) list.push({ period: '', username, project, hours, fullName: cName >= 0 ? String(r[cName] ?? '').trim() : undefined });
      });
      rep.manual = [...(rep.manual || []), ...list];
      rep.notes.push(`Sheet "${name}": ${list.length} dòng phân bổ thủ công`);
      continue;
    }

    // --- Pivot giờ công (MH) ---
    const cGrand = head.indexOf('grand total');
    const hasMoney = head.some((h) => h.startsWith('luong') || h.includes('bhxh') || h === 'cpcd');
    if (cGrand >= 0 && !hasMoney) {
      body.forEach((r) => {
        const username = String(r[cUser] ?? '').trim();
        if (!username || /total/i.test(username)) return;
        for (let c = 0; c < cGrand; c++) {
          if (c === cUser || c === cName) continue;
          const h = num(r[c]);
          if (h > 0) pivot.push({ username, project: String(aoa[0][c]).trim(), hours: h });
        }
      });
      pivotSheet = name;
      continue;
    }

    // --- Lương / BHXH / CPCĐ ---
    const cSal = head.findIndex((h) => h.startsWith('luong'));
    const cBh = head.findIndex((h) => h.includes('bhxh'));
    const cCd = head.findIndex((h) => h === 'cpcd' || h.includes('cong doan'));
    if (cSal < 0 && cBh < 0 && cCd < 0) continue;
    let n = 0;
    body.forEach((r) => {
      const username = String(r[cUser] ?? '').trim();
      if (!username || /total/i.test(username)) return;
      const s = (salaries[username] ||= { username, salary: 0, bhxh: 0, cpcd: 0 });
      if (cName >= 0 && r[cName]) s.fullName = String(r[cName]).trim();
      if (cSal >= 0) s.salary = num(r[cSal]);
      if (cBh >= 0) s.bhxh = num(r[cBh]);
      if (cCd >= 0) s.cpcd = num(r[cCd]);
      n++;
    });
    const got = [cSal >= 0 && 'Lương', cBh >= 0 && 'BHXH', cCd >= 0 && 'CPCĐ'].filter(Boolean).join(', ');
    salaryCols.salary ||= cSal >= 0;
    salaryCols.bhxh ||= cBh >= 0;
    salaryCols.cpcd ||= cCd >= 0;
    rep.notes.push(`Sheet "${name}": ${got} của ${n} NV`);
  }

  // Pivot MH: chỉ lấy NV không có worklog → coi là phân bổ thủ công (NV có worklog đã tính từ Jira)
  if (pivot.length) {
    const hasLog = new Set((rep.worklogs || []).map((w) => w.username));
    const list = pivot.filter((x) => !hasLog.has(x.username)).map((x) => ({ period: '', ...x }));
    if (list.length) {
      rep.manual = [...(rep.manual || []), ...list];
      rep.notes.push(`Sheet "${pivotSheet}": ${new Set(list.map((x) => x.username)).size} NV không log Jira → phân bổ thủ công`);
    }
  }

  if (Object.keys(salaries).length) {
    rep.salaries = salaries;
    const miss = [!salaryCols.salary && 'Lương', !salaryCols.bhxh && 'CP BHXH', !salaryCols.cpcd && 'CPCĐ'].filter(Boolean);
    if (miss.length) rep.notes.push(`Không có cột ${miss.join(', ')} — tính bằng 0.`);
  }
  if (!rep.worklogs && !rep.salaries && !rep.users && !rep.manual && !rep.projectKhoi) {
    rep.errors.push('Không nhận diện được sheet nào. Cần sheet worklog (Username, Hours, Work date, Project Name) hoặc sheet lương (User name, Lương, CP BHXH, CPCĐ).');
  }
  return rep;
};

// ==========================================================================
// File mẫu & xuất báo cáo
// ==========================================================================
export const buildTemplate = () => {
  const wb = XLSX.utils.book_new();
  const wl = XLSX.utils.aoa_to_sheet([
    ['Issue Key', 'Hours', 'Work date', 'Username', 'Full name', 'Project Name'],
    ['0128882-129', 8, '2026-08-03', 'cuongnt', 'Nguyễn Tiến Cường', '012.888.2'],
    ['0226331-57', 5.5, '2026-08-03', 'quynhpn', 'Phạm Như Quỳnh', '022.633.1'],
    ['0226331-60', 2.5, '2026-08-03', 'quynhpn', 'Phạm Như Quỳnh', '012.888.2'],
  ]);
  wl['!cols'] = [{ wch: 14 }, { wch: 8 }, { wch: 12 }, { wch: 14 }, { wch: 24 }, { wch: 16 }];
  const sal = XLSX.utils.aoa_to_sheet([
    ['User name', 'Họ và tên', 'Lương theo ngày công', 'CP BHXH', 'CPCĐ'],
    ['cuongnt', 'Nguyễn Tiến Cường', 30000000, 1141650, 106200],
    ['quynhpn', 'Phạm Như Quỳnh', 25000000, 1141650, 106200],
  ]);
  sal['!cols'] = [{ wch: 14 }, { wch: 24 }, { wch: 20 }, { wch: 12 }, { wch: 12 }];
  const guide = XLSX.utils.aoa_to_sheet([
    ['HƯỚNG DẪN'],
    ['• Sheet Worklogs: xuất từ Jira/Tempo (Worklogs report). Giữ nguyên tên cột; hệ thống dùng Username, Hours, Work date, Project Name.'],
    ['• Sheet Luong: 1 dòng / NV. Lương theo ngày công, CP BHXH (công ty đóng), CPCĐ của kỳ — đơn vị VNĐ.'],
    ['• Sheet PhanBoThuCong: NV không log Jira (hành chính, sale…) — số giờ phân bổ vào từng dự án trong kỳ.'],
    ['• Sheet DuAn: gán mã dự án vào khối. Dự án đã có trong Kế hoạch thu chi được tự nhận khối, không cần khai lại.'],
    ['• Mỗi file = 1 tháng: lương trong file áp cho tháng của worklog trong file (hoặc tháng đang chọn nếu file chỉ có lương).'],
    ['• Có thể nhập riêng từng file (chỉ worklog hoặc chỉ lương); dữ liệu còn lại giữ nguyên.'],
    ['• Công thức: CP dự án = Σ (giờ NV log vào DA ÷ tổng giờ NV log trong kỳ) × (Lương + BHXH + CPCĐ).'],
  ]);
  guide['!cols'] = [{ wch: 120 }];
  const man = XLSX.utils.aoa_to_sheet([
    ['User name', 'Họ và tên', 'Mã dự án', 'Số giờ'],
    ['tapvu', 'Nguyễn Văn Tạp Vụ', 'S.23.NB.BO.HRM', 168],
  ]);
  man['!cols'] = [{ wch: 14 }, { wch: 24 }, { wch: 18 }, { wch: 10 }];
  const prj = XLSX.utils.aoa_to_sheet([
    ['Mã dự án', 'Khối'],
    ['012.888.2', 'G1'],
    ['022.633.1', 'G2'],
    ['S.23.NB.BO.HRM', 'Back Office'],
  ]);
  prj['!cols'] = [{ wch: 18 }, { wch: 16 }];
  XLSX.utils.book_append_sheet(wb, wl, 'Worklogs');
  XLSX.utils.book_append_sheet(wb, sal, 'Luong');
  XLSX.utils.book_append_sheet(wb, man, 'PhanBoThuCong');
  XLSX.utils.book_append_sheet(wb, prj, 'DuAn');
  XLSX.utils.book_append_sheet(wb, guide, 'HuongDan');
  return wb;
};

export interface MonthlyRow {
  khoi: string;
  project: string;
  months: number[]; // 12 tháng, VNĐ
}

/** Ma trận chi phí theo dự án × 12 tháng của 1 năm */
export const monthlyMatrix = (monthly: Record<string, LaborResult>, year: number): MonthlyRow[] => {
  const rows = new Map<string, MonthlyRow>();
  for (let m = 1; m <= 12; m++) {
    const r = monthly[`${year}-${String(m).padStart(2, '0')}`];
    r?.projects.forEach((p) => {
      if (!rows.has(p.project)) rows.set(p.project, { khoi: p.khoi, project: p.project, months: Array(12).fill(0) });
      rows.get(p.project)!.months[m - 1] += p.total;
    });
  }
  return Array.from(rows.values());
};

export const buildReport = (r: LaborResult, matrix?: { year: number; rows: MonthlyRow[] }) => {
  const wb = XLSX.utils.book_new();
  const round = (n: number) => Math.round(n);
  if (matrix) {
    const byKhoi = new Map<string, MonthlyRow[]>();
    matrix.rows.forEach((x) => byKhoi.set(x.khoi, [...(byKhoi.get(x.khoi) || []), x]));
    const aoa: (string | number)[][] = [['Khối', 'Mã dự án', ...Array.from({ length: 12 }, (_, i) => `T${i + 1}`), `Cả năm ${matrix.year}`]];
    Array.from(byKhoi.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([khoi, list]) => {
        const sum = Array(12).fill(0).map((_, i) => list.reduce((s, x) => s + x.months[i], 0));
        aoa.push([khoi, 'TỔNG KHỐI', ...sum.map(round), round(sum.reduce((a, b) => a + b, 0))]);
        list.forEach((x) => aoa.push([khoi, x.project, ...x.months.map(round), round(x.months.reduce((a, b) => a + b, 0))]));
      });
    const ws = XLSX.utils.aoa_to_sheet(aoa);
    ws['!cols'] = [{ wch: 16 }, { wch: 18 }, ...Array(13).fill({ wch: 14 })];
    XLSX.utils.book_append_sheet(wb, ws, 'Khoi x Thang');
  }
  const proj = XLSX.utils.aoa_to_sheet([
    ['Khối', 'Mã dự án', 'Số NV', 'Giờ công', 'Ngày công', 'Man-month', 'Lương', 'BHXH', 'CPCĐ', 'Tổng chi phí'],
    ...r.projects.map((p) => [p.khoi, p.project, p.headcount, p.hours, p.hours / HOURS_PER_DAY, +p.mm.toFixed(3), round(p.salary), round(p.bhxh), round(p.cpcd), round(p.total)]),
    ['TỔNG', '', '', r.totals.hours, r.totals.hours / HOURS_PER_DAY, '', round(r.totals.salary), round(r.totals.bhxh), round(r.totals.cpcd), round(r.totals.total)],
  ]);
  const detail = XLSX.utils.aoa_to_sheet([
    ['Khối', 'Mã dự án', 'Username', 'Họ tên', 'Giờ công', 'Giờ thủ công', 'Tỷ lệ', 'Lương', 'BHXH', 'CPCĐ', 'Tổng'],
    ...r.projects.flatMap((p) => p.members.map((a) => [p.khoi, p.project, a.username, a.fullName, a.hours, a.manualHours, +a.ratio.toFixed(4), round(a.salary), round(a.bhxh), round(a.cpcd), round(a.total)])),
  ]);
  const emp = XLSX.utils.aoa_to_sheet([
    ['Username', 'Họ tên', 'Giờ log', 'Giờ chuẩn', 'Số dự án', 'Lương', 'BHXH', 'CPCĐ', 'Tổng'],
    ...r.employees.map((e) => [e.username, e.fullName, e.hours, e.required, e.allocations.length, round(e.salary), round(e.bhxh), round(e.cpcd), round(e.total)]),
  ]);
  XLSX.utils.book_append_sheet(wb, proj, 'Theo du an');
  XLSX.utils.book_append_sheet(wb, detail, 'Chi tiet NV x DA');
  XLSX.utils.book_append_sheet(wb, emp, 'Theo nhan vien');
  return wb;
};

// ==========================================================================
// Dữ liệu mẫu (T1 → T8/2026, mã dự án khớp Kế hoạch thu chi để tự nhận khối)
// ==========================================================================
export const sampleDataset = (): LaborDataset => {
  type Split = [string, number][];
  // username, họ tên, lương, phân bổ giờ theo giai đoạn: [từ tháng, tỷ trọng dự án]
  const people: [string, string, number, [number, Split][]][] = [
    ['cuongnt', 'Nguyễn Tiến Cường', 35_000_000, [[1, [['022.060.2', 1]]]]],
    ['haipgh', 'Phạm Gia Hải', 28_000_000, [[1, [['100.000.2', 0.4], ['022.060.2', 0.6]]]]],
    ['quynhpn', 'Phạm Như Quỳnh', 32_000_000, [[1, [['012.003.2', 1]]], [5, [['012.003.2', 0.5], ['005.008.2', 0.5]]]]],
    ['hoangtm', 'Trần Minh Hoàng', 26_000_000, [[1, [['005.008.2', 1]]]]],
    ['lanl', 'Lê Thị Lan', 30_000_000, [[1, [['038.360.2', 0.6], ['024.002.1', 0.4]]]]],
    ['ducnc', 'Nguyễn Công Đức', 40_000_000, [[1, [['024.002.1', 1]]]]],
    ['huongptt', 'Phạm Thị Thu Hương', 22_000_000, [[3, [['023.011.5', 1]]]]],
    ['tamtc', 'Trần Chí Tâm', 45_000_000, [[1, [['002.941.2', 1]]]]],
    ['duynk', 'Nguyễn Khánh Duy', 24_000_000, [[1, [['002.941.2', 0.3], ['994.994.2', 0.7]]]]],
    ['nhungdth', 'Đỗ Thị Hồng Nhung', 20_000_000, [[1, [['V.25.S.FX.DRA.12', 1]]]]],
    ['anhltt1', 'Lê Thị Tú Anh', 27_000_000, [[1, [['010.540.2', 1]]], [6, [['010.540.2', 0.5], ['X.25.NB.ADB', 0.5]]]]],
    ['tuannq1', 'Nguyễn Quốc Tuấn', 33_000_000, [[1, [['022.060.2', 0.4], ['012.003.2', 0.6]]]]], // làm chéo khối G1 / G2
    ['minhlq', 'Lê Quang Minh', 29_000_000, [[4, [['024.002.1', 0.5], ['023.011.5', 0.5]]]]], // vào làm từ T4
  ];
  const raise: Record<string, number> = { cuongnt: 1.1, ducnc: 1.08, tamtc: 1.05 }; // tăng lương từ T7
  const fillRate: Record<string, number> = { nhungdth: 0.3, tuannq1: 0.8 }; // log thiếu ở T8
  const worklogs: Worklog[] = [];
  const salaries: LaborDataset['salaries'] = {};
  const users: LaborDataset['users'] = {};
  const manual: ManualAllocation[] = [];

  for (let m = 1; m <= 8; m++) {
    const period = `2026-${String(m).padStart(2, '0')}`;
    const days: string[] = [];
    for (let d = 1; d <= new Date(2026, m, 0).getDate(); d++) {
      const wd = new Date(2026, m - 1, d).getDay();
      if (wd !== 0 && wd !== 6) days.push(`${period}-${String(d).padStart(2, '0')}`);
    }
    const sal: Record<string, SalaryRow> = {};
    people.forEach(([username, fullName, base, phases]) => {
      const phase = [...phases].reverse().find(([from]) => from <= m);
      if (!phase) return; // chưa vào làm
      const split = phase[1];
      sal[username] = { username, fullName, salary: m >= 7 ? Math.round((base * (raise[username] || 1)) / 1000) * 1000 : base, bhxh: 1_141_650, cpcd: 106_200 };
      const n = Math.round(days.length * (m === 8 ? fillRate[username] ?? 1 : 1));
      days.slice(0, n).forEach((date, di) => {
        let left = 8;
        split.forEach(([project, w], si) => {
          // làm tròn 0.5h, dự án cuối nhận phần còn lại
          const h = si === split.length - 1 ? left : Math.round(8 * w * 2 + (di % 3 === 0 ? 1 : 0)) / 2;
          const hh = Math.min(left, h);
          if (hh > 0) worklogs.push({ username, fullName, project, hours: hh, date, issueKey: `${project.replace(/\D/g, '')}-${100 + di}` });
          left -= hh;
        });
      });
    });
    // NV hành chính không log Jira → phân bổ thủ công vào dự án nội bộ G1
    sal.tapvu = { username: 'tapvu', fullName: 'Nguyễn Văn Tạp Vụ', salary: 9_000_000, bhxh: 1_141_650, cpcd: 106_200 };
    manual.push({ period, username: 'tapvu', fullName: 'Nguyễn Văn Tạp Vụ', project: '100.000.2', hours: days.length * HOURS_PER_DAY });
    salaries[period] = sal;
  }
  // T8: 1 NV có lương nhưng chưa log timesheet, 1 NV còn tuần chưa duyệt
  salaries['2026-08'].thanhlv = { username: 'thanhlv', fullName: 'Lê Văn Thành', salary: 25_000_000, bhxh: 1_141_650, cpcd: 106_200 };
  users['2026-08'] = { tuannq1: { username: 'tuannq1', required: 168, pendingWeeks: 1 } };
  // X.25.NB.ADB chưa có trong Kế hoạch thu chi → để "Chưa gán khối" minh hoạ việc gán
  return { source: 'Dữ liệu mẫu', worklogs, salaries, users, manual, projectKhoi: {} };
};
