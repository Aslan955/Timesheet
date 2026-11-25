/** Kho onsite dùng chung: đơn sửa / duyệt ở Quản lý Đơn từ hiện ngay ở Báo cáo Onsite (chốt) và Payroll (đọc số đã chốt).
 *  Bảng lương (Payroll) cũng giữ ở đây để không mất khi chuyển màn và để Báo cáo Onsite biết kỳ lương nào đã duyệt / khoá. */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { INIT_CLOSINGS, INIT_RECORDS, OnsiteClosing, OnsiteRec, Period, RoleKey, liveClosings } from './onsiteData';
import { PAY_APPROVED, SalaryDb, seedDb } from '../payroll/salary/salaryData';

interface Ctx {
  records: OnsiteRec[];
  setRecords: React.Dispatch<React.SetStateAction<OnsiteRec[]>>;
  /** Kỳ lương lấy từ bảng lương thật (chỉ đọc). */
  periods: Period[];
  /** Kỳ chốt onsite: khoá khi kỳ lương cùng tháng đã duyệt; saved = số các đơn đã chốt (cập nhật ngay khi chốt / bỏ chốt). */
  closings: OnsiteClosing[];
  setClosings: React.Dispatch<React.SetStateAction<OnsiteClosing[]>>;
  salaryDb: SalaryDb;
  setSalaryDb: React.Dispatch<React.SetStateAction<SalaryDb>>;
  role: RoleKey;
  setRole: (r: RoleKey) => void;
  reset: () => void;
}

const OnsiteCtx = createContext<Ctx | null>(null);

const PAY_REJECTED = 20;
/** Kỳ lương (SalaryApproval) → dạng Period dùng ở màn onsite: trạng thái duyệt + khoá. */
const toPeriods = (db: SalaryDb): Period[] => db.periods.filter((p) => !p.IsDeleted).map((p) => ({
  id: `SA-${p.Year}-${String(p.Month).padStart(2, '0')}`,
  year: p.Year,
  month: p.Month,
  status: p.StatusId === PAY_APPROVED ? 'APPROVED' : p.StatusId === PAY_REJECTED ? 'REJECTED' : 'REQUESTED',
  approvedAt: p.StatusId === PAY_APPROVED ? p.ApprovedAt || undefined : undefined,
  locked: p.IsLocked,
}));

function useStore(initialRole: RoleKey): Ctx {
  const [records, setRecords] = useState<OnsiteRec[]>(INIT_RECORDS);
  const [rawClosings, setClosings] = useState<OnsiteClosing[]>(INIT_CLOSINGS);
  const [salaryDb, setSalaryDb] = useState<SalaryDb>(() => seedDb());
  const [role, setRole] = useState<RoleKey>(initialRole);
  const periods = useMemo(() => toPeriods(salaryDb), [salaryDb]);
  const closings = useMemo(() => liveClosings(rawClosings, records, (y, m) => {
    const p = periods.find((x) => x.year === y && x.month === m && x.status === 'APPROVED');
    return p ? p.approvedAt ?? null : undefined;
  }), [rawClosings, records, periods]);
  const reset = () => { setRecords(INIT_RECORDS); setClosings(INIT_CLOSINGS); setSalaryDb(seedDb()); };
  return { records, setRecords, periods, closings, setClosings, salaryDb, setSalaryDb, role, setRole, reset };
}

export const OnsiteProvider: React.FC<{ children: React.ReactNode; initialRole?: RoleKey }> = ({ children, initialRole = 'hod' }) => {
  const store = useStore(initialRole as RoleKey);
  return <OnsiteCtx.Provider value={store}>{children}</OnsiteCtx.Provider>;
};

/** Dùng được cả khi trang render ngoài Provider (test render lẻ) — khi đó tự giữ state cục bộ. */
export function useOnsite(): Ctx {
  const ctx = useContext(OnsiteCtx);
  const local = useStore('hod');
  return ctx || local;
}
