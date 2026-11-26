/**
 * Trang B — /Payroll/Detail?month=&year= (SalaryDetailComponent → SalarySumarryListComponent).
 * Lưới 69 cột theo thứ tự SSL:114-379 (cụm onsite gộp còn 2 cột), ghim 4 cột trái (checkbox, STT, Mã NV, Họ tên) bằng đo độ rộng thật.
 */
import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, FileSpreadsheet, Loader2, Recycle, Search, Send, Upload } from 'lucide-react';
import { Btn, ErpTitleBar, Panel, Tag, erp } from '../erp/Erp';
import {
  Ctx, ImportFile, MailItem, Outcome, PAY_APPROVED, SCOPE_LABEL, Salary, SalaryDb, exportRows, fmtCurrency, fmtD, fmtDT, fmtN0, fmtN2, loadDetail,
  periodLabel, recollectPrecheck, scopeOf, uiFlags, uiImport, uiRecollect, uiSendMailDetail,
} from '../../payroll/salary/salaryData';
import { ConfirmPopup, ImportPopup, StatusPill } from './SalaryUi';

type Kind = 'text' | 'money' | 'num' | 'n2' | 'date' | 'dt' | 'center';
interface Col {
  label: string;
  w: number;
  kind: Kind;
  get: (r: Salary) => string | number | null;
  right?: boolean;
  title?: string;
}
const c = (label: string, w: number, kind: Kind, get: Col['get'], extra: Partial<Col> = {}): Col => ({ label, w, kind, get, ...extra });
/** 67 cột dữ liệu (sau checkbox + STT), nhãn theo VI:2304-2374; onsite chỉ 2 cột: Số ngày Onsite + Tiền onsite (số đã chốt ở Báo cáo Onsite). */
export const DATA_COLS: Col[] = [
  c('Mã NV', 120, 'text', (r) => r.StaffId),
  c('Họ tên', 180, 'text', (r) => r.FullName),
  c('Vị trí', 160, 'text', (r) => r.Position),
  c('Khối', 160, 'text', (r) => r.Division),
  c('Bộ phận', 160, 'text', (r) => r.Department),
  c('Trạng thái', 130, 'text', (r) => r.Status),
  c('Ngày bắt đầu làm việc', 120, 'date', (r) => r.StartDate),
  c('Ngày nghỉ việc', 120, 'date', (r) => r.ResignationDate),
  c('Chưa hoàn thiện hồ sơ', 100, 'center', (r) => r.FileIncomplete),
  c('Mức lương 1', 120, 'money', (r) => r.SalaryLevel),
  c('Tiền lương cơ bản làm căn cứ tính BH', 120, 'money', (r) => r.BasicSalary),
  c('Ăn trưa', 120, 'money', (r) => r.LunchAllowance),
  c('Xăng xe', 120, 'money', (r) => r.FuelAllowance),
  c('Điện thoại', 120, 'money', (r) => r.PhoneAllowance),
  c('Nhà ở', 120, 'money', (r) => r.HousingAllowance),
  c('Thưởng HQCV tạm tính', 150, 'money', (r) => r.PerformanceBonusEstimated),
  c('Mức lương 2', 120, 'money', (r) => r.SalaryLevel2),
  c('Tiền lương cơ bản làm căn cứ tính BH2', 120, 'money', (r) => r.BasicSalary2),
  c('Ăn trưa2', 120, 'money', (r) => r.LunchAllowance2),
  c('Xăng xe2', 120, 'money', (r) => r.FuelAllowance2),
  c('Điện thoại2', 120, 'money', (r) => r.PhoneAllowance2),
  c('Nhà ở2', 120, 'money', (r) => r.HousingAllowance2),
  c('Thưởng HQCV tạm tính2', 150, 'money', (r) => r.PerformanceBonusEstimated2),
  c('Ngày công trong tháng', 100, 'num', (r) => r.WorkDaysInMonth),
  c('Công 1', 100, 'num', (r) => r.WorkDaysType1),
  c('Công 2', 100, 'num', (r) => r.WorkDaysType2),
  c('Tổng công tính lương', 100, 'n2', (r) => r.TotalWorkDays),
  c('Lương theo ngày công', 180, 'money', (r) => r.SalaryBasedOnWorkDays),
  c('Giờ OT', 100, 'n2', (r) => r.OvertimeHours),
  c('Tiền OT', 120, 'money', (r) => r.OvertimePay),
  c('Tiền OT theo gói', 150, 'money', (r) => r.OvertimePayPackage),
  c('Số ngày Onsite', 120, 'n2', (r) => r.OnsiteDays),
  c('Tiền onsite', 120, 'money', (r) => r.OnsiteAllowance, { title: 'Số đã chốt ở Báo cáo Onsite — gồm < 30km, ≥ 30km và tiền bổ sung tháng trước' }),
  c('PC thiết bị', 120, 'money', (r) => r.DeviceAllowance),
  c('PC gửi xe', 120, 'money', (r) => r.ParkingAllowance),
  c('PC khác', 120, 'money', (r) => r.OtherAllowances),
  c('Thưởng dự án', 120, 'money', (r) => r.ProjectBonus),
  c('Thưởng kinh doanh', 120, 'money', (r) => r.BusinessBonus),
  c('Thưởng lễ/tết', 120, 'money', (r) => r.HolidayBonus),
  c('Thưởng giới thiệu nhân viên', 150, 'money', (r) => r.ReferralBonus),
  c('Công tác phí', 150, 'money', (r) => r.BusinessTripAllowance),
  c('Thưởng khác', 120, 'money', (r) => r.OtherBonuses),
  c('Điều chỉnh khác trước thuế', 150, 'money', (r) => r.TaxAdjustment + r.BackPay, { title: 'Hiển thị TaxAdjustment + BackPay; sort/lọc theo TaxAdjustment thuần (SSL:284-288)' }),
  c('Tổng thu nhập', 170, 'money', (r) => r.TotalIncome, { right: true }),
  c('Tổng trích đóng - NLĐ', 150, 'money', (r) => r.SocialInsurance),
  c('Tổng trích đóng - CTY', 150, 'money', (r) => r.CompanyInsurance),
  c('Tổng BHXH', 150, 'money', (r) => r.SocialInsurance + r.CompanyInsurance, { title: 'Cột tính, không FieldName — không sort/lọc được' }),
  c('Kinh phí công đoàn', 150, 'money', (r) => r.UnionFeeCompany),
  c('Đoàn phí công đoàn', 150, 'money', (r) => r.TradeUnionFee),
  c('Số người phụ thuộc', 120, 'num', (r) => r.DependentsCount),
  c('TN Miễn thuế', 150, 'money', (r) => r.TaxExemptIncome),
  c('Thu nhập chịu thuế', 150, 'money', (r) => r.TaxableIncome),
  c('Thu nhập tính thuế', 180, 'money', (r) => r.TaxCalculatedIncome),
  c('Số thuế TNCN phải nộp', 180, 'money', (r) => r.PersonalIncomeTax),
  c('Khấu trừ không chịu thuế', 180, 'money', (r) => r.NonTaxDeductions, { right: true }),
  c('Tạm ứng/Khấu trừ khác', 180, 'money', (r) => r.OtherDeductions, { right: true }),
  c('Thực nhận', 160, 'money', (r) => r.NetReceived, { right: true }),
  c('Lương lần 1', 180, 'money', (r) => r.NetReceivedPart1, { right: true }),
  c('Lương lần 2', 180, 'money', (r) => r.NetReceivedPart2, { right: true }),
  c('Tổng chi phí công ty', 180, 'money', (r) => r.CompanyCost),
  c('Mã dự án', 150, 'text', (r) => r.ProjectCode),
  c('Mail', 180, 'text', (r) => r.Email),
  c('TK ngân hàng', 180, 'text', (r) => r.BankAccount),
  c('Ngân hàng', 180, 'text', (r) => r.BankName),
  c('Công ty', 180, 'text', (r) => r.Company),
  c('Tháng', 100, 'text', (r) => r.Month),
  c('Ngày thu thập cuối', 180, 'dt', (r) => r.CollectDate),
];
const SUM_COLS = new Set(['Thực nhận', 'Lương lần 1', 'Lương lần 2']);
const cellText = (col: Col, r: Salary): string => {
  const v = col.get(r);
  switch (col.kind) {
    case 'money':
      return fmtCurrency(v as number);
    case 'n2':
      return fmtN2((v as number) ?? 0);
    case 'date':
      return fmtD(v as string | null);
    case 'dt':
      return fmtDT(v as string | null);
    case 'num':
      return String(v ?? 0);
    default:
      return (v as string) ?? '';
  }
};

const HEAD_BG = '#e8edf4';
const PIN_EDGE = 'shadow-[inset_-1px_0_0_#94a3b8]';

export const SalaryDetailPage: React.FC<{
  db: SalaryDb;
  ctx: Ctx;
  year: number;
  month: number;
  profileSelect: React.ReactNode;
  onBack: () => void;
  apply: (o: Outcome, after?: () => void) => void;
  toast: (type: 'success' | 'warning' | 'error' | 'info', text: string) => void;
  showMails: (m: MailItem[]) => void;
  onCrash: (msg: string) => void;
}> = ({ db, ctx, year, month, profileSelect, onBack, apply, toast, showMails, onCrash }) => {
  const st = useMemo(() => loadDetail(db, ctx, year, month), [db, ctx, year, month]);
  const f = uiFlags(ctx.profile);
  const [q, setQ] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(0);
  const [virtual, setVirtual] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);
  /** SelectedDataItems: null khi chưa từng tick dòng nào (đúng như DxGrid). */
  const [selected, setSelected] = useState<string[] | null>(null);
  const [confirm, setConfirm] = useState<{ text: string; onOk: () => void } | null>(null);
  const [importOpen, setImportOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const rows = useMemo(() => {
    const n = q.trim().toLowerCase();
    if (!n) return st.rows;
    return st.rows.filter((r) => DATA_COLS.some((col) => cellText(col, r).toLowerCase().includes(n)));
  }, [st.rows, q]);
  const pages = Math.max(1, Math.ceil(rows.length / pageSize));
  const curPage = Math.min(page, pages - 1);
  const shown = virtual ? rows : rows.slice(curPage * pageSize, curPage * pageSize + pageSize);
  const sel = new Set(selected ?? []);
  const allSel = rows.length > 0 && rows.every((r) => sel.has(r.EmployeeId));
  const toggle = (id: string) => setSelected((s) => (s ?? []).includes(id) ? (s ?? []).filter((x) => x !== id) : [...(s ?? []), id]);
  const toggleAll = () => setSelected(allSel ? [] : rows.map((r) => r.EmployeeId));

  // Ghim cột trái: đo độ rộng thật của tiêu đề để tính left (không đặt cứng — tránh đè cột kế bên)
  const pinRefs = useRef<(HTMLTableCellElement | null)[]>([]);
  const [pinLefts, setPinLefts] = useState<number[]>([0, 0, 0, 0]);
  useLayoutEffect(() => {
    const ws = [0, 1, 2, 3].map((i) => pinRefs.current[i]?.getBoundingClientRect().width || 0);
    const ls = ws.map((_, i) => ws.slice(0, i).reduce((t, w) => t + w, 0));
    if (ls.join() !== pinLefts.join()) setPinLefts(ls);
  });
  const [, setTick] = useState(0);
  useLayoutEffect(() => {
    const on = () => setTick((t) => t + 1);
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  const pin = (i: number, bg: string, z = 2): React.CSSProperties => ({ position: 'sticky', left: pinLefts[i] ?? 0, zIndex: z, background: bg });
  const pinRef = (i: number) => (el: HTMLTableCellElement | null) => {
    pinRefs.current[i] = el;
  };

  // Điều kiện nút (SSL:398-410, :504-517)
  const showImport = !st.isLocked && f.canImport;
  const showSendMail = st.hasPeriod && st.status === PAY_APPROVED && !st.isLocked && f.canApprove;
  const showRecollect = st.status === PAY_APPROVED && !st.isLocked && f.canWriteRecords;

  const withLoading = (fn: () => void) => {
    setLoading(true);
    setTimeout(() => {
      fn();
      setLoading(false);
    }, 350);
  };
  const doExport = () => {
    const ex = exportRows(db, ctx, year, month);
    toast('info', `Mở tab mới /Payroll/ExportPayroll?year=${year}&month=${month} → tải ${ex.fileName} (giả lập): ${ex.rows.length} dòng trong phạm vi quyền${ex.computed ? ', bảng Salary chưa có dòng nên xuất số TÍNH TẠM' : ''}; bỏ qua ô Search / dòng chọn.`);
  };
  const doSendMail = () => {
    const pre = uiSendMailDetail(db, ctx, year, month, selected);
    if (pre.toast.type === 'warning') return toast('warning', pre.toast.text);
    const n = new Set(selected).size;
    setConfirm({
      text: `Are you sure you want to send payslip email to ${n} selected employee(s)?`,
      onOk: () => {
        setConfirm(null);
        const o = uiSendMailDetail(db, ctx, year, month, selected);
        apply(o);
        if (o.mails) showMails(o.mails);
      },
    });
  };
  const doRecollect = () => {
    const crash = recollectPrecheck(selected);
    if (crash) return onCrash(crash);
    const ids = selected ?? [];
    setConfirm({
      text: 'Are you sure you want to recollect selected options?',
      onOk: () => {
        setConfirm(null);
        withLoading(() => apply(uiRecollect(db, ctx, year, month, ids)));
      },
    });
  };
  const doUpload = (file: ImportFile) => {
    withLoading(() => {
      const o = uiImport(db, ctx, year, month, file);
      setImportErrors(o.importResult?.Errors ?? []);
      apply(o, () => {
        if (o.done) setImportOpen(false);
      });
    });
  };

  const crumbs = ['Trang chủ', 'PayRoll', 'Payroll', `Detail ${periodLabel(year, month)}`];
  const os = st.onsite;
  // Kỳ chưa duyệt đang tính tạm ⇒ nhắc PC onsite lấy theo các dòng đã chốt ở Báo cáo Onsite
  const onsiteWarn = f.canRead && st.hasPeriod && st.status !== PAY_APPROVED;
  const totals = { 'Thực nhận': 0, 'Lương lần 1': 0, 'Lương lần 2': 0 } as Record<string, number>;
  rows.forEach((r) => {
    totals['Thực nhận'] += r.NetReceived;
    totals['Lương lần 1'] += r.NetReceivedPart1;
    totals['Lương lần 2'] += r.NetReceivedPart2;
  });

  return (
    <>
      <ErpTitleBar
        onBack={onBack}
        backLabel="Danh sách kỳ"
        crumbs={crumbs}
        title={`Detail ${periodLabel(year, month)}`}
        actions={profileSelect}
        meta={[
          { label: 'Kỳ (GetByPeriodAsync)', value: st.hasPeriod ? <>#{st.periodId} <StatusPill statusId={st.status!} /></> : 'Không tìm thấy kỳ ⇒ coi như đã khoá' },
          { label: 'Khoá', value: st.isLocked ? 'Đã khoá' : 'Chưa khoá' },
          { label: 'Nguồn dữ liệu', value: st.source === 'saved' ? 'Bảng Salary đã lưu' : st.source === 'calc' ? 'TÍNH TẠM mỗi lần mở (không ghi DB)' : '—' },
          { label: 'Phạm vi dòng', value: SCOPE_LABEL[scopeOf(ctx.profile)] },
          {
            label: 'Onsite (Báo cáo Onsite)',
            value: os.lines ? `Đã chốt ${os.lines} người · ${fmtCurrency(os.total)}` : 'Chưa chốt dòng nào ⇒ Tiền onsite = 0',
          },
        ]}
      />

      {!f.canRead && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-800 rounded-[4px] px-3 py-2 text-[12.5px]">
          <AlertTriangle size={15} /> Bạn không có quyền xem dữ liệu bảng lương này.
        </div>
      )}

      {onsiteWarn && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-300 text-amber-800 rounded-[4px] px-3 py-2 text-[12.5px]">
          <AlertTriangle size={15} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">{`Tiền onsite = số các dòng đã chốt ở Báo cáo Onsite tháng ${periodLabel(year, month)} (${os.lines} người · ${fmtCurrency(os.total)})`}</p>
            <p className="text-[11.5px]">HCNS bấm Chốt / Bỏ chốt ở PayRoll › Báo cáo Onsite là số trong bảng cập nhật ngay. Duyệt kỳ lương sẽ khoá onsite tháng này — dòng chưa chốt lúc đó chuyển sang kỳ sau.</p>
          </div>
        </div>
      )}

      {st.crash && (
        <div className="bg-rose-50 border border-rose-300 text-rose-800 rounded-[4px] px-3 py-2 text-[12.5px]">
          <b>Lỗi chưa xử lý khi nạp trang (mô phỏng):</b> {st.crash}
          <p className="text-[11.5px] mt-0.5">Theo code: kỳ tạo với tháng ngoài 1–12 vẫn lưu được (popup Add New không validate) ⇒ CreateSalaryRecordsAsync gọi DateTime.DaysInMonth và ném lỗi.</p>
        </div>
      )}

      {f.canRead && st.issues.length > 0 && (
        <div className="bg-orange-50 border border-orange-300 rounded-[4px] text-[12.5px]">
          <div className="flex flex-wrap items-center gap-2 px-3 py-2">
            <AlertTriangle size={15} className="text-orange-600 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-orange-800">{st.issues.length} nhân viên thiếu dữ liệu, chưa được đưa vào bảng lương</p>
              <p className="text-orange-700 truncate" title="Bổ sung mã NV (tạo tài khoản) / khối trong hồ sơ nhân sự rồi thu thập lại.">
                Bổ sung mã NV (tạo tài khoản) / khối trong hồ sơ nhân sự rồi thu thập lại.
              </p>
            </div>
            <Btn className="h-7" icon={bannerOpen ? ChevronUp : ChevronDown} onClick={() => setBannerOpen((v) => !v)}>
              {bannerOpen ? 'Thu gọn' : 'Xem danh sách'}
            </Btn>
          </div>
          {bannerOpen && (
            <div className="px-3 pb-3">
              <table className={`${erp.table} bg-white`}>
                <thead>
                  <tr>
                    {['Mã NV', 'Họ tên', 'Bộ phận', 'Lỗi dữ liệu'].map((h) => (
                      <th key={h} className={`${erp.th} text-left`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {st.issues.map((x) => (
                    <tr key={x.EmployeeId} className={erp.tr}>
                      <td className={erp.td}>{x.StaffId || <span className="text-slate-400">—</span>}</td>
                      <td className={erp.td}>{x.FullName}</td>
                      <td className={erp.td}>{x.Department}</td>
                      <td className={`${erp.td} space-x-1`}>
                        {x.MissingStaffId && <Tag cls="bg-amber-50 text-amber-700 border-amber-300">Thiếu mã NV</Tag>}
                        {x.MissingDivision && <Tag cls="bg-orange-50 text-orange-700 border-orange-300">Thiếu khối</Tag>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {f.canRead && (
        <Panel
          title="Bảng lương"
          noPad
          actions={
            <>
              <Btn variant="primary" icon={FileSpreadsheet} className="h-7" onClick={doExport}>
                Export to XLSX
              </Btn>
              <label className="flex items-center gap-1.5 text-[12px] text-slate-600 cursor-pointer">
                <input type="checkbox" checked={virtual} onChange={(e) => setVirtual(e.target.checked)} /> Enable Virtual Scrolling
              </label>
              {showImport && (
                <Btn icon={Upload} className="h-7" onClick={() => (setImportErrors([]), setImportOpen(true))}>
                  Import
                </Btn>
              )}
              {showSendMail && (
                <Btn variant="primary" icon={Send} className="h-7" onClick={doSendMail}>
                  Send Mail
                </Btn>
              )}
              {showRecollect && (
                <Btn variant="success" icon={Recycle} className="h-7" onClick={doRecollect}>
                  Re-Collect
                </Btn>
              )}
              <div className="relative w-52">
                <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                <input value={q} onChange={(e) => (setQ(e.target.value), setPage(0))} placeholder="Search…" className={`${erp.inputFull} h-7 pl-7`} />
              </div>
            </>
          }
          footer={
            <span className="flex flex-wrap items-center gap-3">
              <span>
                {rows.length} dòng · đã chọn {selected === null ? '0 (SelectedDataItems = null — chưa từng tick)' : sel.size}
              </span>
              {!virtual && (
                <span className="flex items-center gap-1.5 ml-auto">
                  Cỡ trang
                  <select className={`${erp.input} h-6 text-[11px]`} value={pageSize} onChange={(e) => (setPageSize(Number(e.target.value)), setPage(0))}>
                    {[10, 20, 50].map((n) => (
                      <option key={n}>{n}</option>
                    ))}
                  </select>
                  <Btn className="h-6 px-2" disabled={curPage === 0} onClick={() => setPage(curPage - 1)}>
                    ‹
                  </Btn>
                  Trang {curPage + 1}/{pages}
                  <Btn className="h-6 px-2" disabled={curPage >= pages - 1} onClick={() => setPage(curPage + 1)}>
                    ›
                  </Btn>
                </span>
              )}
            </span>
          }
        >
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 z-20 bg-white/70 flex items-center justify-center gap-2 text-[13px] text-slate-700">
                <Loader2 size={16} className="animate-spin" /> Fetching Data...
              </div>
            )}
            <div className={`overflow-auto ${virtual ? 'max-h-[420px]' : 'max-h-[620px]'}`}>
              <table className={`${erp.table} w-max`}>
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th ref={pinRef(0)} style={{ ...pin(0, HEAD_BG, 4), minWidth: 60, width: 60 }} className={`${erp.th} text-center border-t-0 border-l-0`}>
                      <input type="checkbox" checked={allSel} onChange={toggleAll} title="Chọn tất cả (mọi trang)" />
                    </th>
                    <th ref={pinRef(1)} style={{ ...pin(1, HEAD_BG, 4), minWidth: 50, width: 50 }} className={`${erp.th} text-center border-t-0`}>
                      STT
                    </th>
                    {DATA_COLS.map((col, i) => (
                      <th
                        key={col.label}
                        ref={i < 2 ? pinRef(i + 2) : undefined}
                        style={{ minWidth: col.w, width: col.w, maxWidth: col.w, ...(i < 2 ? pin(i + 2, HEAD_BG, 4) : {}) }}
                        className={`${erp.th} text-left border-t-0 overflow-hidden text-ellipsis ${i === 1 ? PIN_EDGE : ''}`}
                        title={col.title ? `${col.label} — ${col.title}` : col.label}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shown.length === 0 && (
                    <tr>
                      <td colSpan={DATA_COLS.length + 2} className={`${erp.td} text-left text-slate-400 py-6 pl-[260px]`}>
                        No data to display
                      </td>
                    </tr>
                  )}
                  {shown.map((r, i) => {
                    const idx = virtual ? i : curPage * pageSize + i;
                    const isSel = sel.has(r.EmployeeId);
                    const bg = isSel ? '#eaf2fc' : idx % 2 ? '#f8fafc' : '#ffffff';
                    return (
                      <tr key={r.EmployeeId + r.StaffId} className="[&:hover>td]:!bg-[#eaf2fc]" style={{ background: bg }}>
                        <td style={pin(0, bg)} className={`${erp.td} text-center border-l-0`}>
                          <input type="checkbox" checked={isSel} onChange={() => toggle(r.EmployeeId)} />
                        </td>
                        <td style={pin(1, bg)} className={`${erp.td} text-center text-slate-500`}>
                          {idx + 1}
                        </td>
                        {DATA_COLS.map((col, k) => {
                          const txt = cellText(col, r);
                          const align = col.kind === 'date' || col.kind === 'dt' || col.kind === 'center' ? 'text-center' : col.right ? 'text-right' : 'text-left';
                          return (
                            <td
                              key={col.label}
                              style={k < 2 ? pin(k + 2, bg) : undefined}
                              className={`${erp.td} whitespace-nowrap ${align} ${k === 0 ? 'font-mono text-slate-700' : ''} ${k === 1 ? `font-semibold text-slate-900 ${PIN_EDGE}` : ''}`}
                            >
                              {txt}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className={erp.totalRow}>
                    <td style={pin(0, '#fff6d6')} className={`${erp.td} border-l-0`} />
                    <td style={pin(1, '#fff6d6')} className={erp.td} />
                    {DATA_COLS.map((col, k) => (
                      <td key={col.label} style={k < 2 ? pin(k + 2, '#fff6d6') : undefined} className={`${erp.td} whitespace-nowrap ${SUM_COLS.has(col.label) ? 'text-right' : ''} ${k === 1 ? PIN_EDGE : ''}`}>
                        {k === 0 ? `Count: ${rows.length}` : SUM_COLS.has(col.label) ? fmtN0(totals[col.label]) : ''}
                      </td>
                    ))}
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Panel>
      )}

      {confirm && <ConfirmPopup text={confirm.text} onCancel={() => setConfirm(null)} onOk={confirm.onOk} />}
      {importOpen && (
        <ImportPopup
          errors={importErrors}
          onCancel={() => setImportOpen(false)}
          onUpload={doUpload}
          onDownloadTemplate={() => toast('info', 'Mở /Templates/payroll/template_import_cac_khoan_khac.xlsx (giả lập).')}
        />
      )}
    </>
  );
};
