/**
 * PayRoll › Payroll (/Payroll) — prototype ĐÚNG logic code hiện tại, trừ onsite (ĐỀ XUẤT: lấy số đã chốt ở Báo cáo Onsite qua useOnsite()).
 * Trang A: danh sách kỳ lương (SalaryComponent). Trang B: chi tiết bảng lương 1 kỳ (SalarySumarryListComponent).
 * Logic + dữ liệu mẫu: src/payroll/salary/salaryData.ts. Bất thường được tái hiện nguyên, liệt kê ở khung "Ghi chú theo code".
 */
import React, { useMemo, useRef, useState } from 'react';
import { Ban, Check, Eye, Lock, LockOpen, Plus, Search, Send, ShieldCheck, Table2, Trash2, XCircle } from 'lucide-react';
import { Btn, ErpTitleBar, Panel, erp } from '../erp/Erp';
import {
  Ctx, MailItem, Outcome, PAY_APPROVED, PAY_REJECTED, PAY_REQUESTED, PROFILES, SalaryApproval, SalaryDb, ToastType,
  fmtD, fmtDT, nowIso, periodGrid, profileOf, seedDb, uiApprove, uiCreatePeriod, uiDelete, uiFlags, uiLock, uiReject, uiSendMailPeriod, uiUnlock,
} from '../../payroll/salary/salaryData';
import { useOnsite } from '../../onsite/OnsiteContext';
import { AddNewPopup, ConfirmPopup, MailPreviewPopup, StatusPill, ToastStack } from './SalaryUi';
import { SalaryDetailPage } from './SalaryDetail';

// ───────────────────────── Ghi chú theo code ─────────────────────────
const NOTES_BACKEND: [string, string][] = [
  ['BH 10,5% / 21,5% / 2% × lương BH, KHÔNG có trần (V01088 lương BH 60tr trừ 6,3tr)', 'SS:1246-1248'],
  ['Đổi mức lương giữa tháng: BH, ăn trưa trừ thuế lấy mức CŨ (đợt 1); đoàn phí theo trung bình 2 mức', 'SS:453-455, 1250-1261'],
  ['Trạng thái "Nghỉ việc" so ngày nghỉ với HÔM NAY, không so với kỳ ⇒ tính lại kỳ cũ đổi số', 'SS:1969'],
  ['Học việc / CTV / trạng thái rỗng: luỹ tiến trên toàn bộ TN chịu thuế, không giảm trừ 15,5tr', 'SS:1271-1274, 1294-1298'],
  ['Toàn bộ tiền OT giờ được miễn thuế; OT gói không miễn. OT giờ tính theo GrossIncome, lương công theo tổng thành phần', 'SS:1263, 569-580'],
  ['Trạng thái / HĐ lấy từ hợp đồng gắn với lịch sử lương mới nhất (latest.Contracts)', 'SS:434-442'],
  ['Không có bảng công ĐÃ KHOÁ ⇒ lương theo công = 0 nhưng vẫn ra dòng (OT, thưởng…)', 'SS:274-276, 612-631'],
  ['Duyệt kỳ: nếu kỳ ĐÃ có dòng Salary (vd Recollect trước khi duyệt) ⇒ giữ nguyên các dòng đó, không tính phần còn lại', 'SS:243-254'],
  ['Re-Collect danh sách rỗng ⇒ tính lại CẢ KỲ (WhereIf bỏ lọc)', 'SS:282-284'],
  ['Từ chối ghi đè ApprovedBy/ApprovedAt bằng người từ chối; ghi chú bị bỏ', 'SAS:256-259'],
  ['Có thể có 2 kỳ cùng tháng (1 Rejected + 1 mới); GetByPeriodAsync FirstOrDefault không ORDER BY ⇒ Detail có thể đọc kỳ Rejected; duyệt lại kỳ Rejected cũ đâm unique index', 'SAS:81-111, 455-461'],
  ['Xoá kỳ xoá mềm MỌI dòng Salary theo Year/Month chuỗi ⇒ xoá kỳ Rejected cũ cũng xoá dòng của kỳ mới cùng tháng; không xoá bảng import', 'SAS:409'],
  ['Khoá kỳ không kiểm trạng thái (khoá được kỳ Requested ⇒ không duyệt được); khoá tự từ chối đơn nghỉ chờ duyệt, mở khoá không hoàn tác', 'SAS:313-338; LeaveRequestService.cs:1210'],
  ['Import: xem tạm lấy dòng import Id LỚN nhất, upsert lấy Id NHỎ nhất; kỳ đã có dòng ⇒ chỉ RecalculateSalary (không tính lại công/OT, giữ PC onsite đã lưu)', 'SS:1396, 1518, 1594-1614'],
  ['Onsite: ĐỀ XUẤT luồng mới — lấy số đã chốt ở Báo cáo Onsite (Phụ lục 03), Payroll không tự tính / gắn đơn. PC Onsite = tiền các dòng HR đã bấm Chốt (gồm bổ sung tháng trước), vào ngay không chờ hoàn tất tháng; duyệt kỳ lương ⇒ khoá onsite tháng đó, dòng chưa chốt sang kỳ sau', 'Đề xuất — onsiteData.payrollFromClosing'],
  ['Mail: dòng 8 hiện SỐ GIỜ OT dưới nhãn tiền; T13 luôn 0; "Các khoản trừ khác" đọc 2 trường không bao giờ có giá trị; hạn phản hồi ddMMyyyy', 'MS:404-457, 388-398'],
];
const NOTES_UI: [string, string][] = [
  ['Approve bắt nhập Note nhưng không gửi / lưu; Reject nhận note nhưng không lưu', 'SC.cs:153-191'],
  ['Nút Reject chỉ hiện khi Requested (service cho từ chối cả Approved) ⇒ không có đường UI huỷ duyệt', 'SC:110-120; SAS:243'],
  ['Send mail ở lưới kỳ gửi CẢ KỲ, câu xác nhận không nêu số người; ở trang B bắt chọn ≥ 1', 'SC.cs:168-176; SSL:631-659'],
  ['Re-Collect khi CHƯA TỪNG tick dòng: SelectedDataItems = null ⇒ .OfType() ném ArgumentNullException ngoài try ⇒ sập circuit Blazor', 'SSL:661-664'],
  ['Add New không validate: tháng 0 / 13 vẫn lưu, mở Detail sẽ lỗi DaysInMonth', 'SPC:26-33'],
  ['Cột "Approved By/At" cũng là người / ngày từ chối', 'SAS:256-257'],
  ['Class locked-row không có CSS ⇒ kỳ khoá trông như thường; icon Lock (ổ mở) = hành động khoá, ổ đóng = mở khoá', 'SC.cs:248-258; SC:79-131'],
  ['Lưới kỳ cho chọn nhiều dòng bằng click nhưng không nút nào dùng', 'SC:31-40'],
  ['"Điều chỉnh khác trước thuế" hiển thị TaxAdjustment + BackPay nhưng sort/lọc theo TaxAdjustment; "Tổng BHXH" không FieldName', 'SSL:284-288'],
  ['Breadcrumb trang B chưa dịch (PayRoll › Payroll); trang A lặp "Bảng lương › Bảng lương"', 'SDC:15-18; VI:941, 949'],
  ['Send Mail trang B cần CanApprovePayroll dù comment ghi CanWriteRecords', 'SSL:506-511'],
  ['Import hiện ở mọi trạng thái kỳ; Re-Collect / Send Mail chỉ khi Approved; kỳ Requested/Rejected tính tạm toàn công ty mỗi lần mở', 'SSL:398-410, 603-606'],
  ['" ₫" ở mọi ô tiền, dòng tổng N0 không ₫; phần lớn cột tiền căn trái', 'StringHelper.cs:104-118; SSL:381-386'],
  ['Export bỏ qua ô Search, filter và dòng chọn; kỳ chưa có dòng Salary ⇒ xuất số tính tạm', 'SSL:622-627; SS:1760-1769'],
];

const pad = (n: number) => String(n).padStart(2, '0');

export const SalaryCodePage: React.FC<{ initialProfile?: string; initialView?: { year: number; month: number } | null; initialDb?: SalaryDb }> = ({
  initialProfile = 'hr',
  initialView = null,
  initialDb,
}) => {
  // Bảng lương giữ trong kho dùng chung (không mất khi chuyển màn; Báo cáo Onsite đọc trạng thái kỳ lương). initialDb chỉ dùng cho test.
  const store = useOnsite();
  const [localDb, setLocalDb] = useState<SalaryDb>(() => initialDb || seedDb());
  const db = initialDb ? localDb : store.salaryDb;
  const setDb = initialDb ? setLocalDb : store.setSalaryDb;
  const [profileKey, setProfileKey] = useState(initialProfile);
  const [view, setView] = useState<{ year: number; month: number } | null>(initialView);
  const [detailKey, setDetailKey] = useState(0);
  const [toasts, setToasts] = useState<{ id: number; type: ToastType; text: string }[]>([]);
  const tid = useRef(1);
  const [mails, setMails] = useState<MailItem[] | null>(null);
  const [crash, setCrash] = useState<string | null>(null);
  const profile = profileOf(profileKey);
  // Kỳ chốt onsite dùng chung với Báo cáo Onsite — chốt xong là vào bảng lương ngay (kỳ đã duyệt giữ số đã lưu)
  const { closings } = store;
  const ctx: Ctx = useMemo(() => ({ profile, now: nowIso(), closings }), [profile, db, closings]);
  const f = uiFlags(profile);

  const toast = (type: ToastType, text: string) => {
    const id = tid.current++;
    setToasts((t) => [...t, { id, type, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  };
  const apply = (o: Outcome, after?: () => void) => {
    setDb(o.db);
    toast(o.toast.type, o.toast.text);
    after?.();
  };
  const onCrash = (msg: string) => {
    setCrash(msg);
    toast('error', `Lỗi chưa xử lý (mô phỏng): ${msg}`);
  };

  const profileSelect = (
    <label className="flex items-center gap-1.5 text-[12px] text-slate-600">
      <ShieldCheck size={14} className="text-[#1f5fa8]" /> Hồ sơ quyền
      <select className={`${erp.input} h-7 text-[12px] w-[290px]`} value={profileKey} onChange={(e) => setProfileKey(e.target.value)}>
        {PROFILES.map((p) => (
          <option key={p.key} value={p.key}>
            {p.label}
          </option>
        ))}
      </select>
    </label>
  );

  return (
    <div className="space-y-3 pb-12">
      <ToastStack items={toasts} onClose={(id) => setToasts((t) => t.filter((x) => x.id !== id))} />
      {view ? (
        <SalaryDetailPage
          key={detailKey}
          db={db}
          ctx={ctx}
          year={view.year}
          month={view.month}
          profileSelect={profileSelect}
          onBack={() => setView(null)}
          apply={apply}
          toast={toast}
          showMails={setMails}
          onCrash={onCrash}
        />
      ) : (
        <PeriodListPage db={db} ctx={ctx} profileSelect={profileSelect} apply={apply} onView={(y, m) => setView({ year: y, month: m })} showMails={setMails} />
      )}
      {mails && <MailPreviewPopup mails={mails} onClose={() => setMails(null)} />}
      {crash && (
        <div className="fixed bottom-0 inset-x-0 z-[150] bg-[#ffffe0] border-t border-amber-300 shadow-[0_-1px_2px_rgba(0,0,0,0.2)] px-4 py-2 text-[12.5px] text-slate-800 flex items-center gap-3">
          <XCircle size={15} className="text-rose-600 shrink-0" />
          <span className="flex-1">
            An unhandled error has occurred. <span className="text-slate-500">(Blazor circuit đã sập — mô phỏng: {crash})</span>
          </span>
          <button type="button" className="text-[#1f5fa8] underline cursor-pointer" onClick={() => (setCrash(null), setDetailKey((k) => k + 1))}>
            Reload
          </button>
        </div>
      )}
    </div>
  );
};

// ═════════════════════════════ Trang A — Danh sách kỳ lương ═════════════════════════════
const PeriodListPage: React.FC<{
  db: SalaryDb;
  ctx: Ctx;
  profileSelect: React.ReactNode;
  apply: (o: Outcome, after?: () => void) => void;
  onView: (y: number, m: number) => void;
  showMails: (m: MailItem[]) => void;
}> = ({ db, ctx, profileSelect, apply, onView, showMails }) => {
  const f = uiFlags(ctx.profile);
  const [q, setQ] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [confirm, setConfirm] = useState<{ text: string; withNote?: boolean; onOk: (note: string) => void } | null>(null);
  const [picked, setPicked] = useState<number[]>([]);
  const all = periodGrid(db);
  const rows = all.filter((p) => {
    const n = q.trim().toLowerCase();
    if (!n) return true;
    return [p.Year, p.Month, p.ApprovedBy, fmtD(p.ApprovedAt), p.CreatorName, fmtDT(p.CreationTime), STATUS_TEXT(p)].join(' ').toLowerCase().includes(n);
  });
  const now = new Date();
  const ask = (text: string, onOk: (note: string) => void, withNote = false) => setConfirm({ text, onOk, withNote });
  const run = (fn: (note: string) => Outcome, after?: (o: Outcome) => void) => (note: string) => {
    setConfirm(null);
    const o = fn(note);
    apply(o);
    after?.(o);
  };

  if (!f.canRead) {
    return (
      <>
        <ErpTitleBar crumbs={['Trang chủ', 'Bảng lương', 'Bảng lương']} title="Bảng lương" actions={profileSelect} />
        <Panel title="Không vào được màn" icon={Table2}>
          <p className="text-slate-600">
            PayrollController.Index (PayrollController.cs:44-51): thiếu <b>Payroll.Read</b> và không phải Admin ⇒ chuyển về <b>/</b> (trang chủ) kèm toast "không có quyền". Grid không hiển thị.
          </p>
        </Panel>
      </>
    );
  }

  const icon = (title: string, Ic: React.ElementType, onClick?: () => void, cls = 'text-[#1f5fa8] hover:text-[#184c88]') =>
    onClick ? (
      <button type="button" title={title} onClick={(e) => (e.stopPropagation(), onClick())} className={`p-[3px] cursor-pointer ${cls}`}>
        <Ic size={14} />
      </button>
    ) : (
      <span title={title} className={`p-[3px] ${cls}`}>
        <Ic size={14} />
      </span>
    );

  const actions = (p: SalaryApproval) => (
    <div className="flex items-center justify-center gap-2">
      {icon('View', Eye, () => onView(p.Year, p.Month))}
      {p.IsLocked ? (
        f.canManagePeriod ? (
          icon('Unlock', Lock, () => ask('Unlock this record?', run(() => uiUnlock(db, ctx, p.Id))))
        ) : (
          icon('Locked', Lock, undefined, 'text-gray-400')
        )
      ) : (
        <>
          {f.canManagePeriod &&
            icon('Delete', Trash2, () =>
              ask('Are you sure you want to delete this Payroll record? This will delete all associated salary details for this period.', run(() => uiDelete(db, ctx, p.Id))),
            )}
          {f.canApprove && p.StatusId === PAY_APPROVED &&
            icon('Send mail', Send, () =>
              ask('Are you sure you want to send mail this Salary?', run(() => uiSendMailPeriod(db, ctx, p.Year, p.Month), (o) => o.mails && showMails(o.mails))),
            )}
          {f.canApprove && (p.StatusId === PAY_REQUESTED || p.StatusId === PAY_REJECTED) &&
            icon('Approve', Check, () => ask('Are you sure you want to Approve this Salary?', run((note) => uiApprove(db, ctx, p.Id, note)), true))}
          {f.canApprove && p.StatusId === PAY_REQUESTED && icon('Reject', Ban, () => ask('Are you sure you want to Reject this Salary?', run((note) => uiReject(db, ctx, p.Id, note)), true))}
          {f.canManagePeriod && icon('Lock', LockOpen, () => ask('Lock this record?', run(() => uiLock(db, ctx, p.Id))))}
        </>
      )}
    </div>
  );

  const H = ['#', 'Year', 'Month', 'Approved By', 'Approved At', 'Created By', 'Created Date', 'Status', 'Actions'];
  const W = [40, 102, 120, 140, 140, 160, 140, 110, 180];
  return (
    <>
      <ErpTitleBar crumbs={['Trang chủ', 'Bảng lương', 'Bảng lương']} title="Bảng lương" actions={profileSelect} />
      <Panel
        title="Kỳ lương"
        icon={Table2}
        noPad
        actions={
          <>
            {f.canCreatePeriod && (
              <Btn variant="primary" icon={Plus} className="h-7" onClick={() => setAddOpen(true)}>
                Add New
              </Btn>
            )}
            <div className="relative w-52">
              <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" className={`${erp.inputFull} h-7 pl-7`} />
            </div>
          </>
        }
        footer={`${rows.length} kỳ · Trang 1/1 · cỡ trang 30 · sắp Year ↓, Month ↓ · bấm dòng chỉ đổi màu (chọn nhiều nhưng không nút nào dùng)`}
      >
        <div className="overflow-x-auto">
          <table className={`${erp.table} min-w-[1100px]`}>
            <thead>
              <tr>
                {H.map((h, i) => (
                  <th
                    key={h}
                    style={{ minWidth: W[i], ...(i === 8 ? { position: 'sticky', right: 0, zIndex: 2, background: '#e8edf4' } : {}) }}
                    className={`${erp.th} border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 8 ? 'border-r-0 shadow-[inset_1px_0_0_#94a3b8]' : ''} ${[3, 5].includes(i) ? 'text-left' : 'text-center'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className={`${erp.td} text-center text-slate-400 py-6 border-x-0`}>
                    No data to display
                  </td>
                </tr>
              )}
              {rows.map((p, i) => {
                const isPicked = picked.includes(p.Id);
                const bg = isPicked ? '#dbe7f5' : '#ffffff';
                return (
                  <tr key={p.Id} style={{ background: bg }} className="cursor-default" onClick={() => setPicked((s) => (s.includes(p.Id) ? s.filter((x) => x !== p.Id) : [...s, p.Id]))}>
                    <td className={`${erp.td} text-center text-slate-500 border-l-0`}>{i + 1}</td>
                    <td className={`${erp.td} text-center`}>{p.Year}</td>
                    <td className={`${erp.td} text-center`}>{p.Month}</td>
                    <td className={erp.td}>{p.ApprovedBy || ''}</td>
                    <td className={`${erp.td} text-center`}>{fmtD(p.ApprovedAt)}</td>
                    <td className={erp.td}>{p.CreatorName}</td>
                    <td className={`${erp.td} text-center`}>{fmtDT(p.CreationTime)}</td>
                    <td className={`${erp.td} text-center`}>
                      <StatusPill statusId={p.StatusId} />
                    </td>
                    <td style={{ position: 'sticky', right: 0, zIndex: 1, background: bg }} className={`${erp.td} border-r-0 shadow-[inset_1px_0_0_#94a3b8]`}>
                      {actions(p)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
      {addOpen && (
        <AddNewPopup
          defMonth={now.getMonth() + 1}
          defYear={now.getFullYear()}
          onCancel={() => setAddOpen(false)}
          onSave={(y, m) => {
            const o = uiCreatePeriod(db, ctx, y, m);
            apply(o);
            if (o.done) setAddOpen(false);
            return o.done;
          }}
        />
      )}
      {confirm && <ConfirmPopup text={confirm.text} withNote={confirm.withNote} onCancel={() => setConfirm(null)} onOk={confirm.onOk} />}
    </>
  );
};
const STATUS_TEXT = (p: SalaryApproval) => (p.StatusId === 18 ? 'Requested' : p.StatusId === 19 ? 'Approved' : 'Rejected');
