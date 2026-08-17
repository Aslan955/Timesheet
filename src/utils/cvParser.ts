/**
 * Đọc CV (PDF / .txt) và trích xuất thông tin cơ bản của ứng viên bằng regex + heuristic theo nhãn.
 * KHÔNG dùng AI — độ chính xác phụ thuộc vào cách CV trình bày (rõ nhãn "Họ tên:", "Email:"... thì chuẩn hơn).
 */
import * as pdfjsLib from 'pdfjs-dist';
// Vite: nạp worker của pdf.js dưới dạng URL để chạy trong trình duyệt
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ParsedCV {
  name?: string;
  dob?: string; // yyyy-mm-dd
  address?: string;
  currentCompany?: string;
  email?: string;
  phone?: string;
  position?: string;
}

// ---- Trích text từ file CV ----
export const extractTextFromFile = async (file: File): Promise<string> => {
  const ext = file.name.split('.').pop()?.toLowerCase();
  if (ext === 'pdf') {
    const buf = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
    let text = '';
    for (let p = 1; p <= pdf.numPages; p++) {
      const page = await pdf.getPage(p);
      const content = await page.getTextContent();
      // Mỗi item là 1 đoạn text; nối lại theo dòng dựa vào toạ độ y
      const lines: Record<number, string[]> = {};
      content.items.forEach((it) => {
        const item = it as { str: string; transform: number[] };
        if (!item.str) return;
        const y = Math.round(item.transform[5]);
        (lines[y] = lines[y] || []).push(item.str);
      });
      const ys = Object.keys(lines)
        .map(Number)
        .sort((a, b) => b - a); // PDF: y lớn = trên cùng
      text += ys.map((y) => lines[y].join(' ')).join('\n') + '\n';
    }
    return text;
  }
  // .txt và các định dạng text khác
  return await file.text();
};

// ---- Regex cơ bản ----
const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
// SĐT VN: 09xx, 03xx, 07xx, 08xx, 05xx hoặc +84..., cho phép khoảng trắng/dấu chấm/gạch ngang
const PHONE_RE = /(?:(?:\+?84)|0)(?:[\s.-]?\d){9,10}/;

const removeDiacritics = (s: string) =>
  s.normalize('NFD').replace(new RegExp('[\\u0300-\\u036f]', 'g'), '');

// Lấy giá trị nằm sau 1 nhãn (vd "Họ và tên: Nguyễn Văn A"); nhận diện nhãn không phân biệt dấu/hoa thường
const findByLabel = (lines: string[], labels: string[]): string => {
  const normLabels = labels.map((l) => removeDiacritics(l).toLowerCase());
  for (let i = 0; i < lines.length; i++) {
    const raw = lines[i].trim();
    if (!raw) continue;
    const norm = removeDiacritics(raw).toLowerCase();
    for (const nl of normLabels) {
      const idx = norm.indexOf(nl);
      if (idx === -1) continue;
      // Cắt phần sau nhãn (theo độ dài nhãn), rồi bỏ dấu ':' / '-' ở đầu
      let after = raw.slice(idx + nl.length).replace(/^[\s:：\-–—]+/, '').trim();
      // Nếu cùng dòng không có giá trị -> lấy dòng kế tiếp không rỗng
      if (!after && i + 1 < lines.length) after = lines[i + 1].trim();
      if (after) return after;
    }
  }
  return '';
};

// Chuẩn hoá ngày sinh về yyyy-mm-dd (nhận dd/mm/yyyy, dd-mm-yyyy, yyyy-mm-dd, dd.mm.yyyy)
const normalizeDob = (raw: string): string => {
  if (!raw) return '';
  const m1 = raw.match(/\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})\b/);
  if (m1) {
    const [, d, m, y] = m1;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  const m2 = raw.match(/\b(\d{4})[\/.\-](\d{1,2})[\/.\-](\d{1,2})\b/);
  if (m2) {
    const [, y, m, d] = m2;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return '';
};

// Đoán họ tên: ưu tiên nhãn; nếu không có, lấy dòng đầu "giống tên người" (2-5 từ, chữ cái đầu viết hoa, không chứa số/@)
const guessName = (lines: string[]): string => {
  const byLabel = findByLabel(lines, ['Họ và tên', 'Họ tên', 'Full name', 'Name']);
  if (byLabel) return byLabel.split(/\s{2,}|\||,/)[0].trim();

  for (const raw of lines.slice(0, 12)) {
    const line = raw.trim();
    if (!line || line.length > 40) continue;
    if (/[@\d]/.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length < 2 || words.length > 5) continue;
    // Mỗi từ bắt đầu bằng chữ hoa; chấp nhận cả Title Case (Nguyễn) lẫn IN HOA (TRẦN) - hỗ trợ tiếng Việt
    const looksName = words.every((w) => /^[A-ZÀ-Ỹ][A-Za-zÀ-Ỹà-ỹ'.-]*$/.test(w));
    if (looksName) return line;
  }
  return '';
};

export const parseCV = (text: string): ParsedCV => {
  const lines = text.split(/\r?\n/).map((l) => l.trim());
  const flat = text.replace(/\s+/g, ' ');

  const email = flat.match(EMAIL_RE)?.[0] || '';
  const phoneRaw = flat.match(PHONE_RE)?.[0] || '';
  const phone = phoneRaw ? phoneRaw.replace(/[.\-]/g, ' ').replace(/\s+/g, ' ').trim() : '';

  const dob = normalizeDob(findByLabel(lines, ['Ngày sinh', 'Ngày tháng năm sinh', 'Date of birth', 'DOB', 'Born']));
  const address = findByLabel(lines, ['Địa chỉ', 'Address', 'Nơi ở', 'Chỗ ở hiện tại']);
  const position = findByLabel(lines, ['Vị trí ứng tuyển', 'Vị trí', 'Chức danh', 'Position', 'Job title', 'Applied for']);
  const currentCompany = findByLabel(lines, [
    'Công ty gần nhất',
    'Công ty hiện tại',
    'Công ty',
    'Current company',
    'Company',
    'Employer',
  ]);

  return {
    name: guessName(lines) || undefined,
    dob: dob || undefined,
    address: address || undefined,
    currentCompany: currentCompany || undefined,
    email: email || undefined,
    phone: phone || undefined,
    position: position || undefined,
  };
};

// Tiện ích gộp: nhận file -> trả về thông tin đã parse
export const parseCVFile = async (file: File): Promise<ParsedCV> => {
  const text = await extractTextFromFile(file);
  return parseCV(text);
};
