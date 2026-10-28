/**
 * Lời chúc sinh nhật giữa đồng nghiệp — kho dùng chung cho trang chủ (người chúc soạn) và chuông thông báo trên thanh đầu trang
 * (người nhận bấm vào thông báo → mở thiệp chúc của người chúc). Lưu trong trình duyệt để tải lại trang không mất (bản prototype).
 */
import { useSyncExternalStore } from 'react';

export type WishTheme = 'cake' | 'balloon' | 'firework' | 'flower';
export const WISH_THEMES: Record<WishTheme, { label: string; emoji: string; bg: string; ring: string; accent: string; btn: string; dots: string[] }> = {
  cake: { label: 'Bánh kem', emoji: '🎂', bg: 'from-rose-100 via-pink-50 to-amber-50', ring: 'ring-rose-300', accent: 'text-rose-600', btn: 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/25', dots: ['#fb7185', '#fbbf24', '#f472b6'] },
  balloon: { label: 'Bóng bay', emoji: '🎈', bg: 'from-sky-100 via-blue-50 to-emerald-50', ring: 'ring-sky-300', accent: 'text-sky-700', btn: 'bg-sky-600 hover:bg-sky-700 shadow-sky-600/25', dots: ['#38bdf8', '#34d399', '#f87171'] },
  firework: { label: 'Pháo hoa', emoji: '🎆', bg: 'from-violet-200 via-fuchsia-50 to-indigo-100', ring: 'ring-violet-300', accent: 'text-violet-700', btn: 'bg-violet-600 hover:bg-violet-700 shadow-violet-600/25', dots: ['#a78bfa', '#f0abfc', '#fde047'] },
  flower: { label: 'Hoa', emoji: '💐', bg: 'from-amber-100 via-yellow-50 to-lime-50', ring: 'ring-amber-300', accent: 'text-amber-700', btn: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25', dots: ['#fbbf24', '#a3e635', '#fb923c'] },
};
/** Gợi ý lời chúc nhanh trong popup soạn. */
export const WISH_SUGGESTIONS = [
  'Chúc mừng sinh nhật! Chúc bạn tuổi mới thật nhiều sức khỏe, niềm vui và thành công. 🎉',
  'Happy birthday! Chúc bạn một năm mới rực rỡ, công việc thuận lợi và luôn giữ được năng lượng tích cực nhé! 🚀',
  'Sinh nhật vui vẻ! Cảm ơn bạn vì đã là một đồng nghiệp tuyệt vời. Chúc mọi điều tốt đẹp nhất sẽ đến với bạn. 💐',
];

export interface Wish {
  id: string;
  fromName: string; // người chúc
  fromAvatar: string;
  toId: string; // người được chúc
  toName: string;
  toAvatar: string;
  message: string;
  signature: string; // ký tên hiển thị cuối thiệp
  theme: WishTheme;
  sentAt: string; // ISO
  read: boolean; // người nhận đã mở
  thanked: boolean; // người nhận đã gửi lời cảm ơn
}

/** Người dùng đang đăng nhập (prototype). */
export const CURRENT_USER = { name: 'Nguyễn Văn An', avatar: 'https://ui-avatars.com/api/?name=Nguyen+An&background=1f5fa8&color=fff&bold=true' };

const KEY = 'imis_bday_wishes';
const load = (): Wish[] => {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};
let WISHES: Wish[] = load();
let OPENED: string | null = null; // id lời chúc đang mở thiệp
let POP: string | null = null; // id lời chúc đang hiện popup thông báo (góc màn hình)
const SUBS = new Set<() => void>();
const emit = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(WISHES));
  } catch {
    /* bỏ qua */
  }
  SUBS.forEach((f) => f());
};
const sub = (cb: () => void) => (SUBS.add(cb), () => void SUBS.delete(cb));

export const useWishes = () => useSyncExternalStore(sub, () => WISHES);
export const useOpenedWish = () => useSyncExternalStore(sub, () => OPENED);
export const usePopWish = () => useSyncExternalStore(sub, () => POP);

export const sendWish = (w: Omit<Wish, 'id' | 'sentAt' | 'read' | 'thanked'>) => {
  const wish: Wish = { ...w, id: `WN-${Date.now()}`, sentAt: new Date().toISOString(), read: false, thanked: false };
  WISHES = [wish, ...WISHES];
  POP = wish.id; // người nhận nhận popup thông báo
  emit();
  return wish;
};
/** Người nhận bấm vào thông báo → mở thiệp, đánh dấu đã đọc. */
export const openWish = (id: string | null) => {
  OPENED = id;
  if (id) {
    WISHES = WISHES.map((w) => (w.id === id ? { ...w, read: true } : w));
    if (POP === id) POP = null;
  }
  emit();
};
export const dismissPop = () => {
  POP = null;
  emit();
};
export const markAllRead = () => {
  WISHES = WISHES.map((w) => ({ ...w, read: true }));
  emit();
};
export const thankWish = (id: string) => {
  WISHES = WISHES.map((w) => (w.id === id ? { ...w, thanked: true, read: true } : w));
  emit();
};

export const fmtWishTime = (iso: string) => {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'Vừa xong';
  if (mins < 60) return `${mins} phút trước`;
  return `${p(d.getHours())}:${p(d.getMinutes())} ${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()}`;
};
