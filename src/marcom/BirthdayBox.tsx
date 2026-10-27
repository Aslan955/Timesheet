/**
 * Box "Sinh nhật hôm nay" — hiển thị trên trang chủ iMIS cho toàn thể CBNV (và là nội dung bài đăng Teams).
 *  - Tự lấy CBNV đang làm việc có ngày-tháng sinh = hôm nay (không thao tác tay, tự đổi theo ngày).
 *  - Thiết kế do MarCom chọn: bố cục (Thẻ / Danh sách / Banner ảnh nền), màu chủ đạo, tiêu đề, trường hiển thị, kiểu ảnh.
 *  - Nhiều người → hiện đủ danh sách. Không ai → ẩn box hoặc hiện nội dung mặc định.
 *  - Có banner MarCom (Cấu hình › Box sinh nhật) → chạy slide: Sinh nhật → Banner 1 → Banner 2…, mỗi mục N giây (mặc định 5),
 *    di chuột vào thì dừng, bấm chấm / mũi tên để chuyển.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Cake, ChevronLeft, ChevronRight, PartyPopper, X, EyeOff } from 'lucide-react';
import { useMarcom, BoxConfig, BoxTheme, HomeBanner } from './MarcomContext';
import { Avatar } from './MarcomUi';
import { MarcomEmployee, isBirthdayToday, fmtDayMonth, WEEKDAY_LONG } from './marcomData';

const DISMISS_KEY = 'marcom_bday_box_hidden';

export const BOX_THEMES: Record<BoxTheme, { label: string; swatch: string; bg: string; accent: string; icon: string; ring: string; hex: string }> = {
  pink: { label: 'Hồng', swatch: 'bg-pink-500', bg: 'from-[#fff1f5] via-[#fff8ec] to-[#ecfdf5] border-pink-100', accent: 'text-pink-500', icon: 'from-pink-500 to-amber-400', ring: 'ring-pink-100', hex: '#ec4899' },
  blue: { label: 'Xanh dương', swatch: 'bg-[#1f5fa8]', bg: 'from-[#eef5ff] via-[#f5f9ff] to-[#eefcf8] border-[#cfe0f5]', accent: 'text-[#1f5fa8]', icon: 'from-[#1f5fa8] to-sky-400', ring: 'ring-sky-100', hex: '#1f5fa8' },
  green: { label: 'Xanh lá', swatch: 'bg-[#0f8f6c]', bg: 'from-[#ecfdf5] via-[#f4fdf9] to-[#fffbea] border-emerald-100', accent: 'text-[#0f8f6c]', icon: 'from-[#0f8f6c] to-lime-400', ring: 'ring-emerald-100', hex: '#0f8f6c' },
  purple: { label: 'Tím', swatch: 'bg-violet-600', bg: 'from-[#f5f3ff] via-[#fdf4ff] to-[#fff1f5] border-violet-100', accent: 'text-violet-600', icon: 'from-violet-600 to-fuchsia-400', ring: 'ring-violet-100', hex: '#7c3aed' },
  orange: { label: 'Cam', swatch: 'bg-orange-500', bg: 'from-[#fff7ed] via-[#fffbeb] to-[#fef2f2] border-orange-100', accent: 'text-orange-500', icon: 'from-orange-500 to-amber-300', ring: 'ring-orange-100', hex: '#f97316' },
};

export const boxTitle = (cfg: BoxConfig, n: number) => cfg.title.replace(/\{\{soluong\}\}/g, String(n));

/** CBNV đang làm việc có sinh nhật hôm nay. */
export const useTodayBirthdays = (simulateEmpty = false) => {
  const { employees } = useMarcom();
  const todayKey = new Date().toDateString();
  return useMemo(
    () => (simulateEmpty ? [] : employees.filter((e) => e.active && isBirthdayToday(e)).sort((a, b) => a.name.localeCompare(b.name, 'vi'))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [employees, simulateEmpty, todayKey],
  );
};

const subLine = (cfg: BoxConfig, e: MarcomEmployee) => [cfg.showPosition ? e.position : null, cfg.showDivision ? e.division : null].filter(Boolean).join(' · ');

/** Nội dung box sinh nhật (1 mục của slide). onClose = hiện nút ẩn ở góc. */
const BirthdaySlide: React.FC<{ box: BoxConfig; people: MarcomEmployee[]; preview: boolean; onClose?: () => void }> = ({ box, people, preview, onClose }) => {
  const theme = BOX_THEMES[box.theme];
  const today = new Date();
  const dismiss = () => onClose?.();
  const rounded = box.photoShape === 'circle' ? 'rounded-full' : 'rounded-xl';

  if (people.length === 0) {
    return (
      <div className={`relative h-full rounded-2xl border bg-gradient-to-r ${theme.bg} px-5 py-4 flex items-center gap-3`}>
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
          <Cake size={20} className={theme.accent} />
        </div>
        <div className="text-sm font-semibold text-slate-600">{box.emptyText}</div>
      </div>
    );
  }

  const header = (light = false) => (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center shadow-md`}>
          <Cake size={22} className="text-white" />
        </div>
        <div>
          <div className={`text-[11px] font-black uppercase tracking-wider ${light ? 'text-white/80' : theme.accent}`}>
            Sinh nhật hôm nay · {WEEKDAY_LONG[today.getDay()]}, {fmtDayMonth(today)}
          </div>
          <div className={`text-base font-black flex items-center gap-1.5 ${light ? 'text-white' : 'text-slate-800'}`}>
            {boxTitle(box, people.length)} <PartyPopper size={16} className="text-amber-400" />
          </div>
        </div>
      </div>
      {!preview && onClose && (
        <button type="button" onClick={dismiss} className={`p-1.5 rounded-lg cursor-pointer ${light ? 'text-white/70 hover:bg-white/15' : 'text-slate-400 hover:bg-white/70 hover:text-slate-600'}`} title="Ẩn box trong hôm nay">
          <X size={15} />
        </button>
      )}
    </div>
  );

  const greeting = (light = false) => (
    <div className={`mt-4 rounded-xl px-4 py-3 border ${light ? 'bg-white/15 border-white/20' : 'bg-white/70 border-white'}`}>
      <p className={`text-sm font-medium leading-relaxed ${light ? 'text-white' : 'text-slate-700'}`}>“{box.greeting}”</p>
      <p className={`mt-1 text-xs font-black text-right ${light ? 'text-white/90' : theme.accent}`}>— {box.signature}</p>
    </div>
  );

  // ---- Bố cục Banner: ảnh nền MarCom + lớp phủ tối, chữ trắng
  if (box.layout === 'banner') {
    return (
      <div className="relative h-full overflow-hidden rounded-2xl shadow-sm">
        {box.bgUrl ? (
          <img src={box.bgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.icon}`} />
        )}
        <div className="absolute inset-0 bg-slate-900/35" />
        <div className="relative px-5 pt-4 pb-5">
          {header(true)}
          <div className="mt-4 flex flex-wrap gap-4">
            {people.map((e) => (
              <div key={e.id} className="flex flex-col items-center w-[110px] text-center">
                <Avatar e={e} size={64} rounded={rounded} className="ring-4 ring-white/40" />
                <div className="mt-1.5 text-[13px] font-black text-white leading-tight line-clamp-2">{e.name}</div>
                {subLine(box, e) && <div className="text-[11px] text-white/75 truncate w-full">{subLine(box, e)}</div>}
              </div>
            ))}
          </div>
          {greeting(true)}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-full overflow-hidden rounded-2xl border bg-gradient-to-br ${theme.bg} shadow-sm`}>
      <div className="pointer-events-none absolute inset-0 opacity-70">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute rounded-sm"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              width: 6,
              height: 10,
              transform: `rotate(${i * 40}deg)`,
              background: [theme.hex, '#fbbf24', '#34d399', '#60a5fa', '#a78bfa'][i % 5],
              opacity: 0.3,
            }}
          />
        ))}
      </div>
      <div className="relative px-5 pt-4 pb-5">
        {header()}
        {box.layout === 'list' ? (
          // ---- Bố cục Danh sách: gọn, nhiều người vẫn thoáng
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {people.map((e) => (
              <div key={e.id} className="flex items-center gap-3 bg-white/85 rounded-xl border border-white shadow-sm px-3 py-2">
                <Avatar e={e} size={40} rounded={rounded} className={`ring-2 ${theme.ring}`} />
                <div className="min-w-0">
                  <div className="text-[13px] font-black text-slate-800 truncate">🎂 {e.name}</div>
                  {subLine(box, e) && <div className="text-[11px] font-semibold text-slate-400 truncate">{subLine(box, e)}</div>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          // ---- Bố cục Thẻ (mặc định)
          <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
            {people.map((e) => (
              <div key={e.id} className="shrink-0 w-[150px] bg-white/85 backdrop-blur rounded-2xl border border-white shadow-sm p-3 text-center">
                <div className="relative mx-auto w-16 h-16">
                  <Avatar e={e} size={64} rounded={rounded} className={`ring-4 ${theme.ring}`} />
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[11px]">🎂</span>
                </div>
                <div className="mt-2 text-[13px] font-black text-slate-800 leading-tight line-clamp-2">{e.name}</div>
                {subLine(box, e) && <div className="text-[11px] font-semibold text-slate-400 truncate">{subLine(box, e)}</div>}
              </div>
            ))}
          </div>
        )}
        {greeting()}
      </div>
    </div>
  );
};

/** 1 banner MarCom trong slide — có link thì bấm mở trang mới. */
const BannerSlide: React.FC<{ b: HomeBanner }> = ({ b }) => {
  const img = (
    <div className="relative h-full min-h-[200px] overflow-hidden rounded-2xl shadow-sm bg-slate-100">
      <img src={b.url} alt={b.name} className="absolute inset-0 w-full h-full object-cover" draggable={false} />
    </div>
  );
  return b.link ? (
    <a href={b.link} target="_blank" rel="noopener noreferrer" className="block h-full" title={b.name}>
      {img}
    </a>
  ) : (
    img
  );
};

export const BirthdayBox: React.FC<{ preview?: boolean; simulateEmpty?: boolean; cfg?: BoxConfig }> = ({ preview = false, simulateEmpty = false, cfg }) => {
  const { config } = useMarcom();
  const box = cfg ?? config.box;
  const todayKey = new Date().toDateString();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return !preview && localStorage.getItem(DISMISS_KEY) === todayKey;
    } catch {
      return false;
    }
  });
  const people = useTodayBirthdays(simulateEmpty);
  const banners = (box.banners || []).filter((b) => b.active && b.url);
  const hasBday = people.length > 0 || box.emptyMode === 'default';
  const slides: ({ kind: 'bday'; id: string } | { kind: 'banner'; id: string; b: HomeBanner })[] = [
    ...(hasBday ? [{ kind: 'bday' as const, id: 'bday' }] : []),
    ...banners.map((b) => ({ kind: 'banner' as const, id: b.id, b })),
  ];
  const n = slides.length;
  const dur = Math.max(2, box.slideSeconds || 5) * 1000;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const cur = n ? idx % n : 0;
  useEffect(() => {
    if (n < 2 || paused) return;
    const t = window.setInterval(() => setElapsed((e) => e + 100), 100);
    return () => window.clearInterval(t);
  }, [n, paused]);
  useEffect(() => {
    if (elapsed < dur) return;
    setIdx((i) => (i + 1) % Math.max(1, n));
    setElapsed(0);
  }, [elapsed, dur, n]);
  const go = (i: number) => {
    setIdx(((i % n) + n) % n);
    setElapsed(0);
  };

  if (!preview && (!box.showOnHome || dismissed)) return null;
  const dismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, todayKey);
    } catch {
      /* bỏ qua */
    }
  };

  if (!n)
    return preview ? (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center text-xs font-semibold text-slate-400 flex items-center justify-center gap-2">
        <EyeOff size={14} /> Không có sinh nhật hôm nay và chưa có banner → box được ẩn khỏi trang chủ
      </div>
    ) : null;
  // Chỉ có box sinh nhật → hiển thị như cũ, không chạy slide
  if (n === 1 && hasBday) return <BirthdaySlide box={box} people={people} preview={preview} onClose={dismiss} />;

  return (
    <div
      className="relative group"
      data-testid="home-slider"
      data-paused={paused ? '1' : '0'}
      data-index={cur}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid">
        {slides.map((x, i) => (
          <div
            key={x.id}
            aria-hidden={i !== cur}
            data-slide={x.kind === 'bday' ? 'birthday' : x.b.name}
            className={`[grid-area:1/1] transition-opacity duration-500 ${i === cur ? 'opacity-100 z-[1]' : 'opacity-0 pointer-events-none'}`}
          >
            {x.kind === 'bday' ? <BirthdaySlide box={box} people={people} preview={preview} /> : <BannerSlide b={x.b} />}
          </div>
        ))}
      </div>
      {!preview && (
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 z-[2] p-1.5 rounded-lg cursor-pointer bg-white/70 text-slate-500 hover:bg-white hover:text-slate-700 shadow-sm"
          title="Ẩn trong hôm nay"
        >
          <X size={15} />
        </button>
      )}
      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(cur - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-[2] w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white"
            title="Mục trước"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => go(cur + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-[2] w-8 h-8 rounded-full bg-white/80 shadow flex items-center justify-center text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white"
            title="Mục sau"
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-[2] flex items-center gap-1.5 rounded-full bg-slate-900/20 px-2 py-1 backdrop-blur-sm">
            {slides.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => go(i)}
                title={x.kind === 'bday' ? 'Sinh nhật hôm nay' : x.b.name}
                className={`relative h-1.5 rounded-full overflow-hidden cursor-pointer transition-all ${i === cur ? 'w-8 bg-white/50' : 'w-1.5 bg-white/70 hover:bg-white'}`}
              >
                {i === cur && <span className="absolute inset-y-0 left-0 bg-white" style={{ width: `${Math.min(100, (elapsed / dur) * 100)}%` }} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
