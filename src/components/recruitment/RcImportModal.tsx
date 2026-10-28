/**
 * Nhập ứng viên từ file (RecruitmentImportPopup.razor): 2 bước — tải file mẫu 17 cột, chọn file.
 * Dò cột theo tên (bỏ dấu, không phân biệt hoa thường); dòng lỗi bị bỏ, dòng hợp lệ vẫn nhận.
 */
import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { AlertTriangle, Download, FileUp, XCircle } from 'lucide-react';
import { Btn } from '../erp/Erp';
import { Modal } from '../../marcom/MarcomUi';
import { useRc } from '../../recruitment/rc/RcContext';
import { RcCandidate, norm } from '../../recruitment/rc/rcData';

/** 17 cột file mẫu (alias đầu tiên) — * là bắt buộc. */
const TEMPLATE_COLUMNS: { header: string; key: keyof RcCandidate; required?: boolean }[] = [
  { header: 'Ngày tiếp nhận', key: 'inputDate', required: true },
  { header: 'Họ và tên', key: 'fullName', required: true },
  { header: 'Email', key: 'email', required: true },
  { header: 'Điện thoại', key: 'phone' },
  { header: 'Ngày sinh', key: 'dob' },
  { header: 'Địa chỉ', key: 'address' },
  { header: 'LinkedIn', key: 'linkedin' },
  { header: 'Trường đại học', key: 'university', required: true },
  { header: 'Chuyên ngành', key: 'major', required: true },
  { header: 'Vị trí hiện tại', key: 'currentPosition', required: true },
  { header: 'Công ty hiện tại', key: 'currentCompany', required: true },
  { header: 'Tech Stack', key: 'techStack', required: true },
  { header: 'Nguồn', key: 'source', required: true },
  { header: 'Người Refer', key: 'referrerName' },
  { header: 'Chuyên môn', key: 'appliedPosition' },
  { header: 'TA PIC', key: 'taInput' },
  { header: 'Ghi chú', key: 'note' },
];
const PREVIEW = 3;

const toIso = (v: unknown): string => {
  if (v instanceof Date && !isNaN(v.getTime())) {
    const p = (n: number) => String(n).padStart(2, '0');
    return `${v.getFullYear()}-${p(v.getMonth() + 1)}-${p(v.getDate())}`;
  }
  const s = String(v ?? '').trim();
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
  return /^\d{4}-\d{2}-\d{2}/.test(s) ? s.slice(0, 10) : '';
};

type Result = { accepted: number; skipped: number; errors: string[]; duplicates: string[] };

export const RcImportModal: React.FC<{ open: boolean; onClose: () => void; onDone?: (msg: string) => void }> = ({ open, onClose, onDone }) => {
  const { importCandidates } = useRc();
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const downloadTemplate = () => {
    const ws = XLSX.utils.aoa_to_sheet([TEMPLATE_COLUMNS.map((c) => (c.required ? `${c.header}*` : c.header))]);
    ws['!cols'] = TEMPLATE_COLUMNS.map(() => ({ wch: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template UV');
    XLSX.writeFile(wb, 'Template_UngVien.xlsx');
  };

  const pick = async (file: File) => {
    setFileName(file.name);
    setBusy(true);
    setResult(null);
    try {
      const buf = await file.arrayBuffer();
      const wb = XLSX.read(buf, { type: 'array', cellDates: true, codepage: 65001 });
      const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      const byHeader = new Map(TEMPLATE_COLUMNS.map((c) => [norm(c.header), c.key]));
      const rows: Partial<RcCandidate>[] = raw.map((r) => {
        const out: Partial<RcCandidate> = {};
        Object.entries(r).forEach(([h, v]) => {
          const key = byHeader.get(norm(h.replace(/\*/g, '')));
          if (!key) return;
          if (key === 'inputDate' || key === 'dob') (out as Record<string, unknown>)[key] = toIso(v);
          else (out as Record<string, unknown>)[key] = String(v ?? '').trim();
        });
        return out;
      });
      const res = importCandidates(rows);
      setResult(res);
      onDone?.(
        res.skipped
          ? `Đã import ${res.accepted} ứng viên, bỏ qua ${res.skipped} dòng lỗi (${res.errors.slice(0, PREVIEW).join('; ')}${res.errors.length > PREVIEW ? '…' : ''})`
          : `Đã import thành công ${res.accepted} ứng viên.`,
      );
    } catch {
      setResult({ accepted: 0, skipped: 0, errors: ['Không đọc được file. Chấp nhận .xlsx, .xls, .csv.'], duplicates: [] });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const close = () => {
    setResult(null);
    setFileName('');
    onClose();
  };

  return (
    <Modal open={open} onClose={close} width="max-w-[620px]" title="Nhập ứng viên từ file" footer={<Btn onClick={close}>Đóng</Btn>}>
      <div className="space-y-3">
        <Step n={1} title="Tải file mẫu" sub="Dùng đúng cấu trúc cột của file mẫu để nhập thành công.">
          <Btn icon={Download} onClick={downloadTemplate}>
            Tải file mẫu (.xlsx)
          </Btn>
        </Step>
        <Step n={2} title="Chọn file từ máy" sub="Chấp nhận .xlsx, .xls, .csv. Dòng lỗi bị bỏ qua, dòng hợp lệ vẫn được nhận.">
          <Btn variant="primary" icon={FileUp} disabled={busy} onClick={() => fileRef.current?.click()}>
            {busy ? 'Đang xử lý...' : 'Chọn file'}
          </Btn>
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])} />
          {fileName && <p className="text-[12px] text-slate-500 mt-1">Đã chọn: {fileName}</p>}
        </Step>

        {result && (
          <div className="space-y-2">
            <div className={`px-3 py-2 rounded-[4px] border text-[12.5px] ${result.accepted > 0 ? 'bg-amber-50 border-amber-300 text-amber-800' : 'bg-rose-50 border-rose-300 text-rose-800'}`}>
              Nhận: <b>{result.accepted}</b> dòng · Bỏ qua: <b>{result.skipped}</b> dòng
            </div>
            {result.duplicates.length > 0 && (
              <div className="px-3 py-2 rounded-[4px] border bg-amber-50 border-amber-300 text-[12px] text-amber-800">
                <p className="flex items-center gap-1.5">
                  <AlertTriangle size={13} />
                  <span>
                    <b>{result.duplicates.length} dòng trùng hồ sơ đã có — vẫn được nhận.</b> Kiểm tra lại và gộp hồ sơ nếu cần.
                  </span>
                </p>
                <ul className="list-disc pl-5 mt-1">
                  {result.duplicates.slice(0, PREVIEW).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
            {result.errors.length > 0 && (
              <div className="px-3 py-2 rounded-[4px] border bg-rose-50 border-rose-300 text-[12px] text-rose-800">
                <p className="flex items-center gap-1.5 font-semibold">
                  <XCircle size={13} /> Dòng lỗi đã bị bỏ qua:
                </p>
                <ul className="list-disc pl-5 mt-1">
                  {result.errors.slice(0, PREVIEW).map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};

const Step: React.FC<{ n: number; title: string; sub: string; children: React.ReactNode }> = ({ n, title, sub, children }) => (
  <div className="flex gap-3 border border-slate-300 rounded-[4px] p-3">
    <span className="w-6 h-6 rounded-full bg-[#1f5fa8] text-white text-[12px] font-bold flex items-center justify-center shrink-0">{n}</span>
    <div className="min-w-0 flex-1">
      <p className="text-[13px] font-bold text-[#1e3a5f]">{title}</p>
      <p className="text-[12px] text-slate-500 mb-2">{sub}</p>
      {children}
    </div>
  </div>
);
