/** Điều hướng chéo Dự án kinh doanh ↔ Quản lý dự án › Dự án: ghi đích chờ rồi chuyển menu (App nghe 'imis:navigate'). */
type Target = { kind: 'project'; code: string } | { kind: 'biz'; id: string };
let pending: Target | null = null;

const go = (item: string) => window.dispatchEvent(new CustomEvent('imis:navigate', { detail: { item } }));

export const openProjectRecord = (code: string) => {
  pending = { kind: 'project', code };
  go('QLDA · Dự án');
};
export const openBizProject = (id: string) => {
  pending = { kind: 'biz', id };
  go('Dự án kinh doanh');
};

/** Lấy (và xoá) đích chờ của màn đang mở. */
export function takePending(kind: 'project'): string | null;
export function takePending(kind: 'biz'): string | null;
export function takePending(kind: Target['kind']): string | null {
  if (pending?.kind !== kind) return null;
  const v = pending.kind === 'project' ? pending.code : pending.id;
  pending = null;
  return v;
}
