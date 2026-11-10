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
import { RichHtml } from './RichText';
import { MarcomEmployee, isBirthdayToday, fmtDayMonth } from './marcomData';
import { useMarcomLang } from './i18n';

const DISMISS_KEY = 'marcom_bday_box_hidden';

export const BOX_THEMES: Record<BoxTheme, { label: string; labelEn: string; swatch: string; bg: string; accent: string; icon: string; ring: string; hex: string }> = {
  pink: { label: 'Hồng', labelEn: 'Pink', swatch: 'bg-pink-500', bg: 'from-[#fff1f5] via-[#fff8ec] to-[#ecfdf5] border-pink-100', accent: 'text-pink-500', icon: 'from-pink-500 to-amber-400', ring: 'ring-pink-100', hex: '#ec4899' },
  blue: { label: 'Xanh dương', labelEn: 'Blue', swatch: 'bg-[#1f5fa8]', bg: 'from-[#eef5ff] via-[#f5f9ff] to-[#eefcf8] border-[#cfe0f5]', accent: 'text-[#1f5fa8]', icon: 'from-[#1f5fa8] to-sky-400', ring: 'ring-sky-100', hex: '#1f5fa8' },
  green: { label: 'Xanh lá', labelEn: 'Green', swatch: 'bg-[#0f8f6c]', bg: 'from-[#ecfdf5] via-[#f4fdf9] to-[#fffbea] border-emerald-100', accent: 'text-[#0f8f6c]', icon: 'from-[#0f8f6c] to-lime-400', ring: 'ring-emerald-100', hex: '#0f8f6c' },
  purple: { label: 'Tím', labelEn: 'Purple', swatch: 'bg-violet-600', bg: 'from-[#f5f3ff] via-[#fdf4ff] to-[#fff1f5] border-violet-100', accent: 'text-violet-600', icon: 'from-violet-600 to-fuchsia-400', ring: 'ring-violet-100', hex: '#7c3aed' },
  orange: { label: 'Cam', labelEn: 'Orange', swatch: 'bg-orange-500', bg: 'from-[#fff7ed] via-[#fffbeb] to-[#fef2f2] border-orange-100', accent: 'text-orange-500', icon: 'from-orange-500 to-amber-300', ring: 'ring-orange-100', hex: '#f97316' },
};

export const boxTitle = (cfg: BoxConfig, n: number) => cfg.title.replace(/\{\{soluong\}\}/g, String(n));

/** CBNV đang làm việc có sinh nhật hôm nay. */
export const useTodayBirthdays = (simulateEmpty = false) => {
  const { birthdayEmployees: employees } = useMarcom();
  const todayKey = new Date().toDateString();
  return useMemo(
    () => (simulateEmpty ? [] : employees.filter((e) => e.active && isBirthdayToday(e)).sort((a, b) => a.name.localeCompare(b.name, 'vi'))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [employees, simulateEmpty, todayKey],
  );
};

const subLine = (cfg: BoxConfig, e: MarcomEmployee) => [cfg.showPosition ? e.position : null, cfg.showDivision ? e.division : null].filter(Boolean).join(' · ');

/** Nội dung box sinh nhật (1 mục của slide). onClose = hiện nút ẩn ở góc. */
/** Chiều cao cố định của box ở chế độ gọn (trang chủ) — mọi slide cùng cao để không giật khi chuyển. */
export const COMPACT_H = 'h-[150px]';
/** Trên số người này thì danh sách trên banner chạy ngang; mỗi người ~3 giây. */
export const MARQUEE_FROM = 5;
const marqueeSeconds = (n: number) => Math.max(12, n * 3);

const BirthdaySlide: React.FC<{ box: BoxConfig; people: MarcomEmployee[]; preview: boolean; onClose?: () => void; compact?: boolean }> = ({ box, people, preview, onClose, compact }) => {
  const { tr, wdLong } = useMarcomLang();
  const theme = BOX_THEMES[box.theme];
  const today = new Date();
  const dismiss = () => onClose?.();
  const rounded = box.photoShape === 'circle' ? 'rounded-full' : 'rounded-xl';

  if (compact && people.length > 0) {
    const light = box.layout === 'banner';
    const marquee = people.length > MARQUEE_FROM;
    const card = (e: MarcomEmployee) => (
      <div
        className={`shrink-0 w-[128px] rounded-2xl px-2 pt-2.5 pb-2 text-center ${light ? 'bg-white/15 ring-1 ring-white/25 backdrop-blur' : 'bg-white/75 ring-1 ring-white backdrop-blur shadow-[0_6px_16px_-8px_rgba(15,23,42,.35)]'}`}
      >
        <div className="relative mx-auto w-[50px] h-[50px]">
          <span className="absolute -inset-[3px] rounded-full" style={{ background: `conic-gradient(${theme.hex}, #fbbf24, #34d399, ${theme.hex})` }} />
          <span className="absolute inset-0 rounded-full bg-white" />
          <Avatar e={e} size={50} rounded="rounded-full" className="relative" />
          <span className="absolute -bottom-1 -right-1.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-[13px]">🎂</span>
        </div>
        <div className={`mt-1.5 text-[13px] font-semibold leading-tight truncate ${light ? 'text-white' : 'text-slate-800'}`} title={e.name}>
          {e.name}
        </div>
        {subLine(box, e) && <div className={`text-[13px] truncate ${light ? 'text-white/75' : 'text-slate-400 font-medium'}`}>{subLine(box, e)}</div>}
      </div>
    );
    return (
      <div
        className={`relative ${COMPACT_H} overflow-hidden rounded-2xl ${light ? '' : `border border-white bg-gradient-to-r ${theme.bg}`} shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_24px_-12px_rgba(15,23,42,.18)]`}
        data-testid="bday-compact"
      >
        {light ? (
          box.bgUrl ? (
            <>
              <img src={box.bgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/70 via-slate-900/40 to-slate-900/10" />
            </>
          ) : (
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.icon}`} />
          )
        ) : (
          <>
            {/* mảng màu mờ + hoa giấy */}
            <div className="pointer-events-none absolute -top-24 -left-16 w-72 h-72 rounded-full blur-3xl opacity-30" style={{ background: theme.hex }} />
            <div className="pointer-events-none absolute -bottom-28 left-[38%] w-80 h-80 rounded-full blur-3xl opacity-25 bg-amber-300" />
            <div className="pointer-events-none absolute -top-20 right-10 w-64 h-64 rounded-full blur-3xl opacity-20 bg-sky-300" />
            <div className="pointer-events-none absolute inset-0">
              {Array.from({ length: 22 }).map((_, k) => (
                <span
                  key={k}
                  className="absolute rounded-[2px]"
                  style={{
                    left: `${(k * 47 + 13) % 100}%`,
                    top: `${(k * 29 + 7) % 100}%`,
                    width: k % 3 ? 5 : 7,
                    height: k % 3 ? 9 : 7,
                    borderRadius: k % 3 ? 2 : 999,
                    transform: `rotate(${k * 37}deg)`,
                    background: [theme.hex, '#fbbf24', '#34d399', '#60a5fa', '#a78bfa', '#fb7185'][k % 6],
                    opacity: 0.35,
                  }}
                />
              ))}
            </div>
            {/* bóng bay góc phải */}
            <svg className="pointer-events-none absolute right-3 -bottom-2 h-[120px] opacity-60" viewBox="0 0 90 140" aria-hidden>
              <path d="M28 70 C26 95 36 110 30 140" stroke="#94a3b8" strokeWidth="1" fill="none" />
              <path d="M62 60 C64 90 54 110 60 140" stroke="#94a3b8" strokeWidth="1" fill="none" />
              <ellipse cx="28" cy="44" rx="20" ry="25" fill={theme.hex} opacity=".55" />
              <ellipse cx="62" cy="34" rx="18" ry="23" fill="#fbbf24" opacity=".6" />
              <ellipse cx="22" cy="36" rx="5" ry="8" fill="#fff" opacity=".45" />
              <ellipse cx="57" cy="26" rx="4" ry="7" fill="#fff" opacity=".45" />
            </svg>
          </>
        )}

        <div className="relative h-full flex items-center gap-6 pl-16 pr-16">
          {/* Lời chúc */}
          <div className="min-w-0 flex-1 max-w-[520px]">
            <div className={`inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[13px] font-semibold ${light ? 'bg-white/15 text-white ring-1 ring-white/25' : `bg-white/80 ${theme.accent} ring-1 ring-white shadow-sm`}`}>
              <Cake size={12} /> {tr('Sinh nhật hôm nay', "Today's birthdays")} · {wdLong[today.getDay()]}, {fmtDayMonth(today)}
            </div>
            <div className={`mt-1.5 text-[19px] font-semibold tracking-tight flex items-center gap-1.5 truncate ${light ? 'text-white' : 'text-slate-800'}`}>
              {boxTitle(box, people.length)} <PartyPopper size={18} className="text-amber-400 shrink-0" />
            </div>
            <div className={`mt-1 text-[13px] italic leading-snug line-clamp-2 ${light ? 'text-white/85' : 'text-slate-600'}`}>
              “<RichHtml inline html={box.greeting} />”{' '}
              <span className={`not-italic font-semibold whitespace-nowrap ${light ? 'text-white' : theme.accent}`}>— {box.signature}</span>
            </div>
          </div>

          {/* Người có sinh nhật — trên 5 người thì chạy ngang liên tục (di chuột vào để dừng) */}
          {marquee ? (
            <div
              className="flex-1 min-w-0 overflow-hidden motion-reduce:overflow-x-auto group/mq [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]"
              data-testid="bday-marquee"
            >
              <div
                className="bday-marquee flex w-max py-2 group-hover/mq:[animation-play-state:paused]"
                style={{ animationName: 'bday-marquee', animationDuration: `${marqueeSeconds(people.length)}s`, animationTimingFunction: 'linear', animationIterationCount: 'infinite' }}
              >
                {[...people, ...people].map((e, k) => (
                  <div key={`${e.id}-${k}`} className="shrink-0 pr-2.5" aria-hidden={k >= people.length || undefined}>
                    {card(e)}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex-1 min-w-0 flex gap-2.5 overflow-x-auto py-2 justify-end [scrollbar-width:none]">
              {people.map((e) => (
                <React.Fragment key={e.id}>{card(e)}</React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (people.length === 0) {
    return (
      <div className={`relative h-full rounded-2xl border bg-gradient-to-r ${theme.bg} px-5 py-4 flex items-center gap-3 ${compact ? COMPACT_H : ''}`}>
        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
          <Cake size={20} className={theme.accent} />
        </div>
        <RichHtml html={box.emptyText} className="text-sm font-semibold text-slate-600" />
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
            {tr('Sinh nhật hôm nay', "Today's birthdays")} · {wdLong[today.getDay()]}, {fmtDayMonth(today)}
          </div>
          <div className={`text-base font-black flex items-center gap-1.5 ${light ? 'text-white' : 'text-slate-800'}`}>
            {boxTitle(box, people.length)} <PartyPopper size={16} className="text-amber-400" />
          </div>
        </div>
      </div>
      {!preview && onClose && (
        <button type="button" onClick={dismiss} className={`p-1.5 rounded-lg cursor-pointer ${light ? 'text-white/70 hover:bg-white/15' : 'text-slate-400 hover:bg-white/70 hover:text-slate-600'}`} title={tr('Ẩn box trong hôm nay', 'Hide this box for today')}>
          <X size={15} />
        </button>
      )}
    </div>
  );

  const greeting = (light = false) => (
    <div className={`mt-4 rounded-xl px-4 py-3 border ${light ? 'bg-white/15 border-white/20' : 'bg-white/70 border-white'}`}>
      <div className={`text-sm font-medium leading-relaxed ${light ? 'text-white' : 'text-slate-700'}`}>
        “<RichHtml inline html={box.greeting} />”
      </div>
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
const BannerSlide: React.FC<{ b: HomeBanner; compact?: boolean }> = ({ b, compact }) => {
  const img = (
    <div
      className={`group/bn relative overflow-hidden rounded-2xl bg-slate-100 ${compact ? `${COMPACT_H} shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_24px_-12px_rgba(15,23,42,.25)]` : 'h-full min-h-[200px] shadow-sm'}`}
    >
      <img src={b.url} alt={b.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/bn:scale-[1.02]" draggable={false} />
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />
      {b.link && (
        <span className="absolute right-4 bottom-4 inline-flex items-center gap-1 h-7 px-3 rounded-full bg-white/90 text-[11.5px] font-bold text-slate-700 shadow opacity-0 group-hover/bn:opacity-100 transition-opacity">
          Xem chi tiết <ChevronRight size={13} />
        </span>
      )}
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

/** compact: bản gọn cho trang chủ (cao cố định, 1 hàng). */
export const BirthdayBox: React.FC<{ preview?: boolean; simulateEmpty?: boolean; cfg?: BoxConfig; compact?: boolean }> = ({ preview = false, simulateEmpty = false, cfg, compact = false }) => {
  const { config } = useMarcom();
  const { tr } = useMarcomLang();
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
  const baseDur = Math.max(2, box.slideSeconds || 5) * 1000;
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const cur = n ? idx % n : 0;
  // Slide sinh nhật đang chạy danh sách → giữ đủ 1 vòng rồi mới sang slide sau
  const dur = compact && slides[cur]?.kind === 'bday' && people.length > MARQUEE_FROM ? Math.max(baseDur, marqueeSeconds(people.length) * 1000) : baseDur;
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
        <EyeOff size={14} /> {tr('Không có sinh nhật hôm nay và chưa có banner → box được ẩn khỏi trang chủ', 'No birthdays today and no banners → the box is hidden from the home page')}
      </div>
    ) : null;
  // Chỉ có box sinh nhật → hiển thị như cũ, không chạy slide
  if (n === 1 && hasBday && !compact) return <BirthdaySlide box={box} people={people} preview={preview} onClose={dismiss} />;

  return (
    <div
      className="relative group"
      data-testid="home-slider"
      data-paused={paused ? '1' : '0'}
      data-index={cur}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid grid-cols-[minmax(0,1fr)]">
        {slides.map((x, i) => (
          <div
            key={x.id}
            aria-hidden={i !== cur}
            data-slide={x.kind === 'bday' ? 'birthday' : x.b.name}
            className={`[grid-area:1/1] min-w-0 transition-opacity duration-500 ${i === cur ? 'opacity-100 z-[1]' : 'opacity-0 pointer-events-none'}`}
          >
            {x.kind === 'bday' ? <BirthdaySlide box={box} people={people} preview={preview} compact={compact} /> : <BannerSlide b={x.b} compact={compact} />}
          </div>
        ))}
      </div>
      {!preview && (
        <button
          type="button"
          onClick={dismiss}
          className={`absolute z-[2] rounded-lg cursor-pointer bg-white/70 text-slate-500 hover:bg-white hover:text-slate-700 shadow-sm ${compact ? 'top-2 right-2 p-1' : 'top-3 right-3 p-1.5'}`}
          title={tr('Ẩn trong hôm nay', 'Hide for today')}
        >
          <X size={15} />
        </button>
      )}
      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(cur - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-[2] w-9 h-9 rounded-full bg-white/75 backdrop-blur ring-1 ring-white shadow-md flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white"
            title={tr('Mục trước', 'Previous')}
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => go(cur + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-[2] w-9 h-9 rounded-full bg-white/75 backdrop-blur ring-1 ring-white shadow-md flex items-center justify-center text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-white"
            title={tr('Mục sau', 'Next')}
          >
            <ChevronRight size={16} />
          </button>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-[2] flex items-center gap-1.5 rounded-full bg-slate-900/25 px-2 py-1 backdrop-blur-sm">
            {slides.map((x, i) => (
              <button
                key={x.id}
                type="button"
                onClick={() => go(i)}
                title={x.kind === 'bday' ? tr('Sinh nhật hôm nay', "Today's birthdays") : x.b.name}
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
