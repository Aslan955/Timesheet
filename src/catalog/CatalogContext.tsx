/**
 * Catalog store (danh mục dùng chung) — nguồn dữ liệu cho các trường select tuyển dụng.
 *
 * Mỗi danh mục được quản lý ở 1 màn riêng (CatalogPage). Mỗi phần tử danh mục gồm:
 *   - name: Tên hiển thị (giá trị lưu vào hồ sơ ứng viên)
 *   - code: Mã danh mục
 *   - priority: Độ ưu tiên (số nhỏ hiển thị trước)
 * Các select ở màn chi tiết ứng viên đọc trực tiếp danh sách tên (đã sắp theo độ ưu tiên)
 * nên chỉnh danh mục là select cập nhật ngay.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';

export type CatalogKey =
  | 'source'
  | 'university'
  | 'major'
  | 'level'
  | 'block'
  | 'position'
  | 'skill';

export interface CatalogItem {
  name: string;
  code: string;
  priority: number;
}

export interface CatalogDef {
  key: CatalogKey;
  label: string;       // Tên danh mục hiển thị
  description: string; // Mô tả ngắn: trường nào dùng danh mục này
  itemLabel: string;   // Nhãn 1 phần tử (dùng cho nút "Thêm ...")
}

// Thứ tự & metadata các danh mục
export const CATALOG_DEFS: CatalogDef[] = [
  { key: 'source', label: 'Nguồn ứng viên', description: 'Trường "Nguồn ứng viên" trên hồ sơ ứng viên', itemLabel: 'nguồn' },
  { key: 'university', label: 'Trường đại học', description: 'Trường "Trường đại học" ở mục Học vấn', itemLabel: 'trường' },
  { key: 'major', label: 'Chuyên ngành', description: 'Trường "Chuyên ngành" ở mục Học vấn', itemLabel: 'chuyên ngành' },
  { key: 'level', label: 'Level ứng tuyển', description: 'Trường "Level ứng tuyển" của yêu cầu tuyển dụng', itemLabel: 'level' },
  { key: 'block', label: 'Khối ứng tuyển', description: 'Trường "Khối ứng tuyển" của hồ sơ ứng viên', itemLabel: 'khối' },
  { key: 'position', label: 'Vị trí', description: 'Trường "Vị trí ứng tuyển / hiện tại"', itemLabel: 'vị trí' },
  { key: 'skill', label: 'Kỹ năng', description: 'Danh mục kỹ năng (chọn nhiều) theo yêu cầu', itemLabel: 'kỹ năng' },
];

// Sinh mã gợi ý từ tên: bỏ dấu, thay ký tự đặc biệt bằng "_", viết hoa.
export function suggestCode(name: string): string {
  return name
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase();
}

// Danh sách tên (seed) — đồng bộ với các hằng đang dùng trong CandidatePage.
const SEED_NAMES: Record<CatalogKey, string[]> = {
  source: ['LinkedIn', 'Refer', 'TopCV', 'VietnamWorks', 'ITViec', 'Website', 'Headhunt', 'Facebook', 'Khác'],
  level: ['Fresher', 'Intern', 'Junior', 'Middle', 'Senior', 'Lead', 'Manager', 'Director', 'C-level'],
  block: ['Software Development', 'QA / Testing', 'Data & AI', 'DevOps / Cloud', 'PM / BA', 'Design', 'R&D', 'Business'],
  university: [
    'Đại học Bách Khoa Hà Nội',
    'Đại học Công nghệ - ĐHQGHN',
    'Đại học Khoa học Tự nhiên - ĐHQGHN',
    'Đại học FPT',
    'Đại học Kinh tế Quốc dân',
    'Đại học Ngoại thương',
    'Học viện Công nghệ Bưu chính Viễn thông',
    'Học viện Kỹ thuật Quân sự',
    'Đại học Giao thông Vận tải',
    'Đại học Thủy lợi',
    'Đại học Công nghiệp Hà Nội',
    'Đại học Bách Khoa TP.HCM',
    'Đại học Khoa học Tự nhiên - ĐHQG TP.HCM',
    'Đại học Công nghệ Thông tin - ĐHQG TP.HCM',
    'Đại học Sư phạm Kỹ thuật TP.HCM',
    'Đại học Đà Nẵng',
    'Đại học Cần Thơ',
    'Khác',
  ],
  major: [
    'Công nghệ thông tin',
    'Kỹ thuật phần mềm',
    'Khoa học máy tính',
    'Mạng máy tính & Truyền thông',
    'An toàn thông tin',
    'Hệ thống thông tin',
    'Hệ thống thông tin quản lý',
    'Khoa học dữ liệu',
    'Trí tuệ nhân tạo',
    'Kỹ thuật máy tính',
    'Điện tử - Viễn thông',
    'Tự động hóa',
    'Toán - Tin ứng dụng',
    'Toán ứng dụng',
    'Kinh tế',
    'Quản trị kinh doanh',
    'Kế toán - Kiểm toán',
    'Tài chính - Ngân hàng',
    'Marketing',
    'Ngôn ngữ Anh',
    'Thiết kế đồ họa',
    'Khác',
  ],
  position: [
    'Software Developer',
    'Backend Engineer',
    'Frontend Engineer',
    'Fullstack Engineer',
    'Mobile Developer',
    'Business Analyst',
    'Data Analyst',
    'Data Engineer',
    'DevOps Engineer',
    'QA / Tester',
    'Designer',
    'IT Support',
    'Project Manager',
    'Delivery Manager',
    'Kế toán',
    'CTO',
  ],
  skill: [
    'Java', 'Spring Boot', 'Node.js', 'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular',
    'Python', 'Django', 'Go', 'PHP', '.NET', 'SQL', 'PostgreSQL', 'MongoDB', 'Redis',
    'Kafka', 'GraphQL', 'REST API', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform',
    'CI/CD', 'Linux', 'Selenium', 'Cypress', 'Playwright', 'Postman', 'JMeter', 'Manual Testing',
    'Figma', 'BPMN', 'Jira', 'Agile/Scrum', 'PyTorch', 'TensorFlow', 'Spark', 'Pandas', 'Machine Learning',
  ],
};

function seedItems(names: string[]): CatalogItem[] {
  return names.map((name, i) => ({ name, code: suggestCode(name), priority: i + 1 }));
}

const SEED: Record<CatalogKey, CatalogItem[]> = {
  source: seedItems(SEED_NAMES.source),
  university: seedItems(SEED_NAMES.university),
  major: seedItems(SEED_NAMES.major),
  level: seedItems(SEED_NAMES.level),
  block: seedItems(SEED_NAMES.block),
  position: seedItems(SEED_NAMES.position),
  skill: seedItems(SEED_NAMES.skill),
};

const byPriority = (a: CatalogItem, b: CatalogItem) => a.priority - b.priority || a.name.localeCompare(b.name);

interface CatalogContextValue {
  catalogs: Record<CatalogKey, CatalogItem[]>; // đã sắp theo độ ưu tiên
  names: Record<CatalogKey, string[]>;         // chỉ tên, sắp theo độ ưu tiên (cho select)
  defs: CatalogDef[];
  getDef: (key: CatalogKey) => CatalogDef;
  addItem: (key: CatalogKey, item: CatalogItem) => string | null; // null = OK, string = lỗi
  updateItem: (key: CatalogKey, index: number, item: CatalogItem) => string | null;
  removeItem: (key: CatalogKey, index: number) => void;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

const clone = (src: Record<CatalogKey, CatalogItem[]>): Record<CatalogKey, CatalogItem[]> =>
  Object.fromEntries(Object.entries(src).map(([k, v]) => [k, v.map((it) => ({ ...it }))])) as Record<CatalogKey, CatalogItem[]>;

export const CatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [raw, setRaw] = useState<Record<CatalogKey, CatalogItem[]>>(() => clone(SEED));

  // Kiểm tra trùng tên/mã (bỏ qua chính phần tử đang sửa)
  const duplicateError = (key: CatalogKey, item: CatalogItem, ignoreIndex = -1): string | null => {
    const list = raw[key];
    const nameDup = list.some((it, i) => i !== ignoreIndex && it.name.trim().toLowerCase() === item.name.trim().toLowerCase());
    if (nameDup) return `Tên "${item.name}" đã tồn tại trong danh mục`;
    const codeDup = item.code && list.some((it, i) => i !== ignoreIndex && it.code.trim().toLowerCase() === item.code.trim().toLowerCase());
    if (codeDup) return `Mã "${item.code}" đã tồn tại trong danh mục`;
    return null;
  };

  const addItem: CatalogContextValue['addItem'] = (key, item) => {
    if (!item.name.trim()) return 'Vui lòng nhập tên';
    if (!item.code.trim()) return 'Vui lòng nhập mã';
    const err = duplicateError(key, item);
    if (err) return err;
    setRaw((prev) => ({ ...prev, [key]: [...prev[key], { ...item, name: item.name.trim(), code: item.code.trim() }] }));
    return null;
  };

  const updateItem: CatalogContextValue['updateItem'] = (key, index, item) => {
    if (!item.name.trim()) return 'Vui lòng nhập tên';
    if (!item.code.trim()) return 'Vui lòng nhập mã';
    const err = duplicateError(key, item, index);
    if (err) return err;
    setRaw((prev) => ({
      ...prev,
      [key]: prev[key].map((it, i) => (i === index ? { ...item, name: item.name.trim(), code: item.code.trim() } : it)),
    }));
    return null;
  };

  const removeItem: CatalogContextValue['removeItem'] = (key, index) => {
    setRaw((prev) => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));
  };

  // Bản đã sắp xếp theo độ ưu tiên để hiển thị + đổ vào select
  const catalogs = useMemo(() => {
    const out = {} as Record<CatalogKey, CatalogItem[]>;
    (Object.keys(raw) as CatalogKey[]).forEach((k) => {
      out[k] = [...raw[k]].sort(byPriority);
    });
    return out;
  }, [raw]);

  const names = useMemo(() => {
    const out = {} as Record<CatalogKey, string[]>;
    (Object.keys(catalogs) as CatalogKey[]).forEach((k) => {
      out[k] = catalogs[k].map((it) => it.name);
    });
    return out;
  }, [catalogs]);

  const getDef = (key: CatalogKey) => CATALOG_DEFS.find((d) => d.key === key)!;

  const value = useMemo<CatalogContextValue>(
    () => ({ catalogs, names, defs: CATALOG_DEFS, getDef, addItem, updateItem, removeItem }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [catalogs, names, raw],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
};

export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog must be used within a CatalogProvider');
  return ctx;
}
