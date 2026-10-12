/**
 * PmoContext — trạng thái dùng chung của module PMO trong phiên làm việc:
 * dự án đang chọn (Portfolio → Cockpit), hàng đợi phê duyệt, vai trò đang xem.
 * Chưa có API: dữ liệu mẫu từ pmo.ts, quyết định phê duyệt lưu trong bộ nhớ.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';
import { INBOX_SEED, InboxItem, PMO_PROJECTS, PmoProject, TODAY } from './pmo';

export type PmoRole = 'PM' | 'GĐSX' | 'GĐK' | 'TCT';

interface Ctx {
  projects: PmoProject[];
  focusId: string;
  setFocusId: (id: string) => void;
  focus: PmoProject;
  role: PmoRole;
  setRole: (r: PmoRole) => void;
  /** Khối đang xem (GĐSX/GĐK); TCT xem tất cả. */
  khoi: string;
  setKhoi: (k: string) => void;
  inbox: InboxItem[];
  decide: (id: string, approve: boolean, reason?: string) => void;
}

const PmoCtx = createContext<Ctx | null>(null);

export const PmoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const projects = PMO_PROJECTS;
  const [focusId, setFocusId] = useState(projects[4].id); // G3-2026-001
  const [role, setRole] = useState<PmoRole>('GĐSX');
  const [khoi, setKhoi] = useState('G3');
  const [inbox, setInbox] = useState<InboxItem[]>(INBOX_SEED);
  const focus = useMemo(() => projects.find((p) => p.id === focusId) || projects[0], [projects, focusId]);

  const decide = (id: string, approve: boolean, reason?: string) =>
    setInbox((cur) => cur.map((x) => (x.id === id ? { ...x, status: approve ? 'Đã duyệt' : 'Từ chối', decidedAt: TODAY, reason } : x)));

  return <PmoCtx.Provider value={{ projects, focusId, setFocusId, focus, role, setRole, khoi, setKhoi, inbox, decide }}>{children}</PmoCtx.Provider>;
};

export const usePmo = () => {
  const c = useContext(PmoCtx);
  if (!c) throw new Error('usePmo must be used within PmoProvider');
  return c;
};
