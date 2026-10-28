/**
 * Giao diện phía NGƯỜI NHẬN lời chúc sinh nhật:
 *  - WishPopup     : popup thông báo góc màn hình khi có lời chúc mới ("X vừa gửi lời chúc sinh nhật tới bạn") — bấm để mở thiệp.
 *  - NotificationBell : chuông trên thanh đầu trang, danh sách thông báo lời chúc, bấm 1 thông báo → mở thiệp.
 *  - WishCardModal : thiệp chúc mừng sinh nhật của người chúc (mẫu thiệp, lời chúc, ký tên, thời gian) + nút Gửi lời cảm ơn.
 */
import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, ChevronLeft, ChevronRight, Heart, X } from 'lucide-react';
import { WISH_THEMES, dismissPop, fmtWishTime, markAllRead, openWish, thankWish, useOpenedWish, usePopWish, useWishes, type Wish } from './wishStore';

/** Ảnh đại diện — không tải được ảnh thì hiện chữ cái đầu. */
const Ava: React.FC<{ src: string; name: string; className?: string }> = ({ src, name, className = '' }) => {
  const [bad, setBad] = useState(false);
  const ws = name.trim().split(/\s+/);
  const ini = (ws.length > 1 ? ws[0][0] + ws[ws.length - 1][0] : ws[0]?.[0] || '?').toUpperCase();
  return bad || !src ? (
    <span className={`inline-flex items-center justify-center rounded-full bg-[#1f5fa8] text-white font-bold text-[12px] ${className}`}>{ini}</span>
  ) : (
    <img src={src} alt={name} onError={() => setBad(true)} className={`rounded-full object-cover ${className}`} referrerPolicy="no-referrer" />
  );
};

const Confetti: React.FC<{ colors: string[] }> = ({ colors }) => (
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {Array.from({ length: 26 }).map((_, i) => (
      <span
        key={i}
        className="absolute rounded-sm"
        style={{
          left: `${(i * 37) % 100}%`,
          top: `${(i * 53) % 100}%`,
          width: i % 3 ? 6 : 9,
          height: i % 3 ? 10 : 9,
          borderRadius: i % 3 ? 2 : 999,
          transform: `rotate(${i * 33}deg)`,
          background: colors[i % colors.length],
          opacity: 0.45,
        }}
      />
    ))}
  </div>
);

/** Thiệp chúc mừng sinh nhật (người nhận bấm vào thông báo). */
export const WishCardModal: React.FC = () => {
  const openedId = useOpenedWish();
  const wishes = useWishes();
  const w = wishes.find((x) => x.id === openedId);
  const [toast, setToast] = useState('');
  useEffect(() => setToast(''), [openedId]);
  if (!w) return null;
  const T = WISH_THEMES[w.theme] || WISH_THEMES.cake;
  // các lời chúc khác gửi tới cùng người nhận → chuyển qua lại
  const same = wishes.filter((x) => x.toId === w.toId);
  const idx = same.findIndex((x) => x.id === w.id);
  const close = () => openWish(null);
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" data-testid="wish-card">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={close} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <motion.div
        key={w.id}
        initial={{ scale: 0.85, opacity: 0, rotate: -2 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        className={`relative w-full max-w-md rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br ${T.bg}`}
      >
        <Confetti colors={T.dots} />
        <button onClick={close} className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/70 hover:bg-white transition-colors cursor-pointer" title="Đóng">
          <X size={16} className="text-slate-500" />
        </button>
        <div className="relative px-7 pt-8 pb-6 text-center">
          <motion.div initial={{ y: -8 }} animate={{ y: [0, -6, 0] }} transition={{ repeat: Infinity, duration: 2.2 }} className="text-5xl leading-none">
            {T.emoji}
          </motion.div>
          <p className={`mt-3 text-[11px] font-black uppercase tracking-[0.18em] ${T.accent}`}>Happy Birthday</p>
          <h3 className="mt-1 text-xl font-black text-slate-900">Chúc mừng sinh nhật {w.toName}!</h3>

          <div className="mt-5 rounded-2xl bg-white/85 backdrop-blur border border-white shadow-sm px-5 py-4 text-left">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <Ava src={w.fromAvatar} name={w.fromName} className={`w-9 h-9 ring-2 ${T.ring}`} />
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-slate-800 truncate">{w.fromName} gửi lời chúc tới bạn</p>
                <p className="text-[10.5px] text-slate-400 font-semibold">{fmtWishTime(w.sentAt)}</p>
              </div>
            </div>
            <p className="mt-3 text-[14px] leading-relaxed text-slate-700 font-medium whitespace-pre-wrap break-words">“{w.message}”</p>
            {w.signature && <p className={`mt-3 text-right text-[13px] font-black ${T.accent}`}>— {w.signature}</p>}
          </div>

          {same.length > 1 && (
            <div className="mt-3 flex items-center justify-center gap-2 text-[11.5px] font-semibold text-slate-600">
              <button disabled={idx <= 0} onClick={() => openWish(same[idx - 1].id)} className="p-1 rounded-full bg-white/70 hover:bg-white disabled:opacity-30 cursor-pointer" title="Lời chúc trước">
                <ChevronLeft size={14} />
              </button>
              Lời chúc {idx + 1} / {same.length} gửi tới {w.toName}
              <button disabled={idx >= same.length - 1} onClick={() => openWish(same[idx + 1].id)} className="p-1 rounded-full bg-white/70 hover:bg-white disabled:opacity-30 cursor-pointer" title="Lời chúc sau">
                <ChevronRight size={14} />
              </button>
            </div>
          )}

          {toast && <p className="mt-3 text-[12px] font-bold text-emerald-700">{toast}</p>}
          <div className="mt-5 flex gap-3">
            <button onClick={close} className="flex-1 py-2.5 bg-white/80 hover:bg-white text-slate-600 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer">
              Đóng
            </button>
            <button
              disabled={w.thanked}
              onClick={() => (thankWish(w.id), setToast(`Đã gửi lời cảm ơn tới ${w.fromName} ❤️`))}
              className={`flex-1 py-2.5 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60 disabled:cursor-default ${T.btn}`}
            >
              <Heart size={14} className={w.thanked ? 'fill-white' : ''} /> {w.thanked ? 'Đã cảm ơn' : 'Gửi lời cảm ơn'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/** Popup thông báo góc màn hình khi có lời chúc mới — bấm để mở thiệp. */
export const WishPopup: React.FC = () => {
  const popId = usePopWish();
  const wishes = useWishes();
  const w = wishes.find((x) => x.id === popId);
  useEffect(() => {
    if (!popId) return;
    const t = window.setTimeout(dismissPop, 12000);
    return () => window.clearTimeout(t);
  }, [popId]);
  return (
    <AnimatePresence>
      {w && (
        <motion.div
          key={w.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="fixed bottom-6 right-6 z-[150] w-[340px]"
          data-testid="wish-popup"
        >
          <div
            role="button"
            onClick={() => openWish(w.id)}
            className="relative cursor-pointer rounded-2xl bg-white border border-rose-100 shadow-2xl p-3.5 pr-9 flex items-start gap-3 hover:border-rose-300 transition-colors"
          >
            <span className="relative shrink-0">
              <Ava src={w.fromAvatar} name={w.fromName} className="w-10 h-10" />
              <span className="absolute -bottom-1 -right-1 text-base">{WISH_THEMES[w.theme]?.emoji || '🎂'}</span>
            </span>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-wider text-rose-500">Thông báo · Lời chúc sinh nhật</p>
              <p className="text-[12.5px] font-bold text-slate-800 leading-snug mt-0.5">
                {w.fromName} vừa gửi lời chúc sinh nhật tới {w.toName}
              </p>
              <p className="text-[11.5px] text-slate-500 truncate mt-0.5">{w.message}</p>
              <p className="text-[11px] font-bold text-rose-600 mt-1">Bấm để xem thiệp chúc →</p>
            </div>
            <button
              onClick={(e) => (e.stopPropagation(), dismissPop())}
              className="absolute top-2 right-2 p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              title="Ẩn thông báo"
            >
              <X size={14} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/** Chuông thông báo trên thanh đầu trang. */
export const NotificationBell: React.FC = () => {
  const wishes = useWishes();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const unread = wishes.filter((w) => !w.read).length;
  const toggle = () => {
    const r = ref.current?.getBoundingClientRect();
    if (r) setPos({ top: r.bottom + 8, right: Math.max(8, window.innerWidth - r.right) });
    setOpen((o) => !o);
  };
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && !panel.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);
  const pick = (w: Wish) => (setOpen(false), openWish(w.id));
  return (
    <div ref={ref} className="relative">
      <button onClick={toggle} className="relative p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors cursor-pointer" title="Thông báo" data-testid="header-bell">
        <Bell size={18} />
        {unread > 0 ? (
          <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center">{unread}</span>
        ) : (
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
        )}
      </button>
      {open &&
        createPortal(
        <div ref={panel} style={{ top: pos.top, right: pos.right }} className="fixed w-[360px] bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-[120]" data-testid="header-notifs">
          <div className="px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
            <span className="text-[13px] font-bold text-gray-800">Thông báo</span>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-[11.5px] font-semibold text-[#1f5fa8] hover:underline cursor-pointer">
                Đánh dấu đã đọc tất cả
              </button>
            )}
          </div>
          {!wishes.length ? (
            <div className="px-4 py-8 text-center text-[12px] text-gray-400">Chưa có thông báo nào.</div>
          ) : (
            <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
              {wishes.map((w) => (
                <button key={w.id} onClick={() => pick(w)} className={`w-full text-left px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors ${w.read ? 'hover:bg-gray-50' : 'bg-rose-50/50 hover:bg-rose-50'}`}>
                  <span className="relative shrink-0">
                    <Ava src={w.fromAvatar} name={w.fromName} className="w-9 h-9" />
                    <span className="absolute -bottom-1 -right-1 text-[13px]">{WISH_THEMES[w.theme]?.emoji || '🎂'}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] text-gray-800 leading-snug">
                      <b>{w.fromName}</b> đã gửi lời chúc sinh nhật tới <b>{w.toName}</b>
                    </span>
                    <span className="block text-[11.5px] text-gray-500 truncate mt-0.5">{w.message}</span>
                    <span className="block text-[10.5px] text-gray-400 mt-0.5">
                      {fmtWishTime(w.sentAt)}
                      {w.thanked && <span className="ml-1.5 text-rose-500">· đã cảm ơn ❤️</span>}
                    </span>
                  </span>
                  {!w.read && <span className="mt-1.5 w-2 h-2 rounded-full bg-rose-500 shrink-0" />}
                </button>
              ))}
            </div>
          )}
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-[10.5px] text-gray-400">
            Bản demo: hiển thị thông báo của mọi người nhận để thử luồng. Bản chính thức chỉ người được chúc nhận thông báo.
          </div>
        </div>,
          document.body,
        )}
    </div>
  );
};

/** Đặt 1 lần trong khung ứng dụng: popup thông báo + thiệp chúc. */
export const WishHost: React.FC = () =>
  createPortal(
    <>
      <WishPopup />
      <WishCardModal />
    </>,
    document.body,
  );
