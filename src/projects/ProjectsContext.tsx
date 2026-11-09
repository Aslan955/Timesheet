/**
 * Context màn "Quản lý dự án › Dự án": danh sách dự án, vai trò / quyền đang demo, toast.
 * Dự án tạo tay: state riêng. Dự án có PakdId: sinh từ BusinessProjectContext (bizLink.ts) + overlay phần /Projects tự quản;
 * đổi PM ⇒ ghi ngược về Dự án kinh doanh (D49). State sống trong bộ nhớ (reset khi tải lại trang).
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useBusinessProjects } from '../business/BusinessProjectContext';
import { BIZ_OWNED, bizRows } from './bizLink';
import { Ctx, PERSONAS, Perm, Persona, QProject, S, SEED_PROJECTS, SvcResult, nowIso } from './projectData';

export interface Toast {
  id: number;
  kind: 'success' | 'error' | 'warning' | 'info';
  text: string;
}

interface ProjectsState {
  projects: QProject[];
  persona: Persona;
  perms: Set<Perm>;
  has: (k: Perm) => boolean;
  setPersona: (key: string) => void;
  togglePerm: (k: Perm) => void;
  ctx: () => Ctx;
  /** Áp kết quả service: ok ⇒ ghi bản ghi + toast thành công; lỗi ⇒ toast lỗi. Trả về ok. */
  apply: (r: SvcResult, successText: string) => boolean;
  upsert: (p: QProject) => void;
  remove: (id: string) => void;
  toasts: Toast[];
  toast: (kind: Toast['kind'], text: string) => void;
  reset: () => void;
}

const C = createContext<ProjectsState | null>(null);

export const ProjectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const biz = useBusinessProjects();
  const [manual, setManual] = useState<QProject[]>(SEED_PROJECTS);
  const [overlay, setOverlay] = useState<Record<string, QProject>>({});
  const derived = useMemo(() => bizRows(biz.projects), [biz.projects]);
  const projects = useMemo(() => {
    const own = (d: QProject) => Object.fromEntries(BIZ_OWNED.map((k) => [k, d[k]]));
    return [...derived.map((d) => (overlay[d.id] ? { ...overlay[d.id], ...own(d) } : d)), ...manual];
  }, [derived, overlay, manual]);
  const [persona, setP] = useState<Persona>(PERSONAS[0]);
  const [perms, setPerms] = useState<Set<Perm>>(new Set(PERSONAS[0].perms));
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((kind: Toast['kind'], text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, kind, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const has = useCallback((k: Perm) => perms.has(k), [perms]);
  const ctx = useCallback((): Ctx => ({ persona, has, now: nowIso() }), [persona, has]);
  const { setCodePm } = biz;
  const upsert = useCallback(
    (p: QProject) => {
      const base = derived.find((d) => d.id === p.id);
      if (!base) return setManual((all) => (all.some((x) => x.id === p.id) ? all.map((x) => (x.id === p.id ? p : x)) : [p, ...all]));
      // PM là của Dự án kinh doanh: ghi ngược (mã Closed /Projects không cho sửa nên không tới đây)
      if (p.pm !== base.pm && base.statusId !== S.CLOSED) setCodePm(base.pakdId!, base.projectCode, p.pm, persona.user);
      setOverlay((o) => ({ ...o, [p.id]: p }));
    },
    [derived, setCodePm, persona.user],
  );

  const value = useMemo<ProjectsState>(
    () => ({
      projects,
      persona,
      perms,
      has,
      setPersona: (key) => {
        const p = PERSONAS.find((x) => x.key === key) || PERSONAS[0];
        setP(p);
        setPerms(new Set(p.perms));
      },
      togglePerm: (k) =>
        setPerms((s) => {
          const n = new Set(s);
          if (n.has(k)) n.delete(k);
          else n.add(k);
          return n;
        }),
      ctx,
      apply: (r, successText) => {
        if (!r.ok) {
          toast('error', r.message);
          return false;
        }
        upsert(r.project);
        toast('success', successText);
        return true;
      },
      upsert,
      remove: (id) => setManual((all) => all.filter((x) => x.id !== id)),
      toasts,
      toast,
      // Chỉ khôi phục phần /Projects; dữ liệu Dự án kinh doanh thuộc màn đó
      reset: () => {
        setManual(SEED_PROJECTS);
        setOverlay({});
      },
    }),
    [projects, persona, perms, has, ctx, toasts, toast, upsert],
  );

  return <C.Provider value={value}>{children}</C.Provider>;
};

export const useProjects = () => {
  const v = useContext(C);
  if (!v) throw new Error('useProjects phải nằm trong ProjectsProvider');
  return v;
};
