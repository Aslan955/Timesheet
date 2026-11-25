/**
 * Box trang chủ — hiển thị trên trang chủ iMIS cho toàn thể CBNV, chạy slide: Sinh nhật · Chào mừng thành viên mới · Banner.
 *  - Slide Sinh nhật: CBNV đang làm việc có ngày-tháng sinh = hôm nay. Không ai → ẩn slide hoặc hiện nội dung mặc định.
 *  - Slide Chào mừng thành viên mới (CR-20261105-001): nhân sự của đợt onboard tuần này (đợt thứ 3 gần nhất ≤ hôm nay,
 *    cùng cách tính đợt màn Welcome). Bật/tắt riêng, tiêu đề + lời chào riêng, vị trí đặt được. Không ai → ẩn slide.
 *  - Thiết kế do MarCom chọn, riêng cho từng slide (designOf): bố cục (Thẻ / Danh sách / Banner ảnh nền), màu, ảnh nền, kiểu ảnh, hiện Khối / Vị trí, ký tên.
 *  - Mỗi mục N giây (mặc định 5), di chuột vào thì dừng, bấm chấm / mũi tên để chuyển. Không còn slide nào → ẩn Box.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Cake, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Hand, Megaphone, PartyPopper, X, EyeOff } from 'lucide-react';
import { useMarcom, BoxConfig, BoxLayout, BoxTheme, HomeBanner } from './MarcomContext';
import { Avatar } from './MarcomUi';
import { COUNT_VAR, MarcomEmployee, SlideEffect, normalizeEffect, normalizeOverlay, isBirthdayToday, fmtDayMonth, inWelcomeBatch, shownBatchTuesday, welcomeBatchMembers } from './marcomData';
import { useMarcomLang } from './i18n';
import { SlideOverlay } from './SlideOverlay';

const DISMISS_KEY = 'marcom_bday_box_hidden';

export const BOX_THEMES: Record<BoxTheme, { label: string; labelEn: string; swatch: string; bg: string; accent: string; icon: string; ring: string; hex: string }> = {
  pink: { label: 'Hồng', labelEn: 'Pink', swatch: 'bg-pink-500', bg: 'from-[#fff1f5] via-[#fff8ec] to-[#ecfdf5] border-pink-100', accent: 'text-pink-500', icon: 'from-pink-500 to-amber-400', ring: 'ring-pink-100', hex: '#ec4899' },
  blue: { label: 'Xanh dương', labelEn: 'Blue', swatch: 'bg-[#1f5fa8]', bg: 'from-[#eef5ff] via-[#f5f9ff] to-[#eefcf8] border-[#cfe0f5]', accent: 'text-[#1f5fa8]', icon: 'from-[#1f5fa8] to-sky-400', ring: 'ring-sky-100', hex: '#1f5fa8' },
  green: { label: 'Xanh lá', labelEn: 'Green', swatch: 'bg-[#0f8f6c]', bg: 'from-[#ecfdf5] via-[#f4fdf9] to-[#fffbea] border-emerald-100', accent: 'text-[#0f8f6c]', icon: 'from-[#0f8f6c] to-lime-400', ring: 'ring-emerald-100', hex: '#0f8f6c' },
  purple: { label: 'Tím', labelEn: 'Purple', swatch: 'bg-violet-600', bg: 'from-[#f5f3ff] via-[#fdf4ff] to-[#fff1f5] border-violet-100', accent: 'text-violet-600', icon: 'from-violet-600 to-fuchsia-400', ring: 'ring-violet-100', hex: '#7c3aed' },
  orange: { label: 'Cam', labelEn: 'Orange', swatch: 'bg-orange-500', bg: 'from-[#fff7ed] via-[#fffbeb] to-[#fef2f2] border-orange-100', accent: 'text-orange-500', icon: 'from-orange-500 to-amber-300', ring: 'ring-orange-100', hex: '#f97316' },
};

// đồng bộ code iMIS 05/11 — biến tiêu đề {Count}
const fillCount = (tpl: string, n: number) => tpl.split(COUNT_VAR).join(String(n));

/** Một ô trong thứ tự slide của Box. */
export type BoxSlot = { kind: 'bday' } | { kind: 'welcome' } | { kind: 'banner'; b: HomeBanner };
const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(lo, v || 0), hi);
/** Thứ tự slide: banner + slide Sinh nhật tại birthdaySlideIndex (số banner đứng trước — như code), rồi slide Chào mừng tại welcomeSlideIndex (CR). */
export const boxSlots = (cfg: BoxConfig): BoxSlot[] => {
  const banners = cfg.banners || [];
  const list: BoxSlot[] = banners.map((b) => ({ kind: 'banner' as const, b }));
  list.splice(clamp(cfg.birthdaySlideIndex, 0, banners.length), 0, { kind: 'bday' });
  list.splice(clamp(cfg.welcomeSlideIndex, 0, list.length), 0, { kind: 'welcome' });
  return list;
};
/** Ngược lại boxSlots: danh sách ô → banners + 2 chỉ số vị trí. */
export const slotsToConfig = (slots: BoxSlot[]): Pick<BoxConfig, 'banners' | 'birthdaySlideIndex' | 'welcomeSlideIndex'> => {
  const bi = slots.findIndex((s) => s.kind === 'bday');
  return {
    banners: slots.flatMap((s) => (s.kind === 'banner' ? [s.b] : [])),
    birthdaySlideIndex: slots.slice(0, bi).filter((s) => s.kind === 'banner').length,
    welcomeSlideIndex: slots.findIndex((s) => s.kind === 'welcome'),
  };
};

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

/** Nhân sự mới của đợt onboard gần nhất (thứ 3 gần nhất ≤ hôm nay) — cùng danh sách màn Welcome, ảnh Employee.
 *  Trang chủ chỉ hiện slide vào ĐÚNG ngày thứ 3 của đợt (isBatchDay) — chốt 05/11 (CR-20261105-001). */
export const useWelcomeNewcomers = (simulateEmpty = false) => {
  const { employees } = useMarcom();
  const todayKey = new Date().toDateString();
  return useMemo(() => {
    const tuesday = shownBatchTuesday();
    const isBatchDay = new Date().getDay() === 2;
    return { tuesday, isBatchDay, people: simulateEmpty ? [] : welcomeBatchMembers(employees, tuesday) };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [employees, simulateEmpty, todayKey]);
};

// CR-20261105-001 thiết kế riêng 05/11 — mỗi slide người có 1 bộ thiết kế
export type PeopleKind = 'bday' | 'welcome';
export interface SlideDesign {
  layout: BoxLayout;
  theme: BoxTheme;
  bgUrl: string | null;
  bgName: string | null;
  photoShape: 'circle' | 'rounded';
  showDivision: boolean;
  showPosition: boolean;
  signature: string;
  title: string;
  greeting: string;
}
export const designOf = (box: BoxConfig, kind: PeopleKind): SlideDesign =>
  kind === 'welcome'
    ? {
        layout: box.welcomeLayout,
        theme: box.welcomeTheme,
        bgUrl: box.welcomeBgUrl,
        bgName: box.welcomeBgName,
        photoShape: box.welcomePhotoShape,
        showDivision: box.welcomeShowDivision,
        showPosition: box.welcomeShowPosition,
        signature: box.welcomeSignature,
        title: box.welcomeTitle,
        greeting: box.welcomeGreeting,
      }
    : {
        layout: box.layout,
        theme: box.theme,
        bgUrl: box.bgUrl,
        bgName: box.bgName,
        photoShape: box.photoShape,
        showDivision: box.showDivision,
        showPosition: box.showPosition,
        signature: box.signature,
        title: box.title,
        greeting: box.greeting,
      };
/** Ngược lại designOf: patch thiết kế → patch BoxConfig đúng bộ field của slide. */
export const designPatch = (kind: PeopleKind, p: Partial<SlideDesign>): Partial<BoxConfig> => {
  if (kind === 'bday') return p;
  const map: Record<keyof SlideDesign, keyof BoxConfig> = {
    layout: 'welcomeLayout', theme: 'welcomeTheme', bgUrl: 'welcomeBgUrl', bgName: 'welcomeBgName', photoShape: 'welcomePhotoShape',
    showDivision: 'welcomeShowDivision', showPosition: 'welcomeShowPosition', signature: 'welcomeSignature', title: 'welcomeTitle', greeting: 'welcomeGreeting',
  };
  return Object.fromEntries(Object.entries(p).map(([k, v]) => [map[k as keyof SlideDesign], v])) as Partial<BoxConfig>;
};

/** Khung Box ở chế độ gọn (trang chủ): mọi slide cao cố định 240px — đồng bộ code iMIS 18/11 (.mce-compact --mce-cp-h).
 *  Banner 8:1 hiện trọn nhờ object-fit + nền mờ của chính ảnh lấp phần trống. Mọi slide cùng khung nên không giật khi chuyển. */
export const COMPACT_H = 'w-full h-[240px]';
/** Thanh thu gọn: hiện tối đa ngần này tên, còn lại "+N" — đồng bộ code iMIS (PeekMaxNames). */
const PEEK_MAX_NAMES = 3;
/** Trên số người này thì danh sách trên banner chạy ngang; mỗi người ~3 giây. */
export const MARQUEE_FROM = 5;
const marqueeSeconds = (n: number) => Math.max(12, n * 3);

const subLine = (d: SlideDesign, e: MarcomEmployee) => [d.showPosition ? e.position : null, d.showDivision ? e.division : null].filter(Boolean).join(' · ');

/** 1 mục slide có danh sách người: Sinh nhật (kind 'bday') hoặc Chào mừng thành viên mới (kind 'welcome'). onClose = hiện nút ẩn ở góc. */
const PeopleSlide: React.FC<{
  box: BoxConfig;
  people: MarcomEmployee[];
  preview: boolean;
  onClose?: () => void;
  kind: PeopleKind;
  batch?: Date; // đợt thứ 3 của slide Chào mừng
  sample?: boolean; // xem trước bằng nhân sự mẫu (đợt hiện tại không có ai)
  compact?: boolean; // bản gọn cho trang chủ (cao cố định 1 hàng)
  fx?: React.ReactNode; // hiệu ứng trên màn — đặt giữa nền và nội dung để hạt chạy phía sau thẻ / chữ
}> = ({ box, people, preview, onClose, kind, batch, sample, compact, fx }) => {
  const { tr, wdLong } = useMarcomLang();
  const d = designOf(box, kind); // CR-20261105-001 thiết kế riêng 05/11
  const theme = BOX_THEMES[d.theme];
  const today = new Date();
  const dismiss = () => onClose?.();
  const rounded = d.photoShape === 'circle' ? 'rounded-full' : 'rounded-xl';
  const welcome = kind === 'welcome';
  const Icon = welcome ? Hand : Cake;
  const emoji = welcome ? '👋' : '🎂';
  const dateLine = (e: MarcomEmployee) => (welcome ? `${tr('Onboard', 'Onboard')} ${fmtDayMonth(e.onboardDate)}` : '');

  // ---- Bản gọn cho trang chủ: cao cố định, 1 hàng — lời chào bên trái, thẻ người bên phải (trên 5 người thì chạy ngang)
  if (compact && people.length > 0) {
    const light = d.layout === 'banner';
    const marquee = people.length > MARQUEE_FROM;
    const card = (e: MarcomEmployee) => (
      <div
        className={`shrink-0 w-[128px] rounded-xl px-2 pt-3 pb-2.5 text-center ${light ? 'bg-white/15 ring-1 ring-white/25 backdrop-blur' : 'bg-white/75 ring-1 ring-white backdrop-blur shadow-[0_6px_16px_-8px_rgba(15,23,42,.35)]'}`}
      >
        <div className="relative mx-auto w-[52px] h-[52px]">
          <span className="absolute -inset-[2px] rounded-full" style={{ background: `conic-gradient(${theme.hex}, #fbbf24, #34d399, ${theme.hex})` }} />
          <span className="absolute inset-0 rounded-full bg-white" />
          <Avatar e={e} size={52} rounded="rounded-full" className="relative" />
          <span className="absolute -bottom-1 -right-1.5 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center text-[11px]">{emoji}</span>
        </div>
        <div className={`mt-2 text-[13px] font-semibold leading-tight truncate ${light ? 'text-white' : 'text-slate-800'}`} title={e.name}>
          {e.name}
        </div>
        {(welcome ? dateLine(e) : subLine(d, e)) && (
          <div className={`text-[13px] truncate ${light ? 'text-white/75' : welcome ? `${theme.accent} font-medium` : 'text-slate-400 font-medium'}`}>{welcome ? dateLine(e) : subLine(d, e)}</div>
        )}
      </div>
    );
    return (
      <div
        className={`relative ${COMPACT_H} overflow-hidden rounded-2xl ${light ? '' : `border border-white bg-gradient-to-r ${theme.bg}`} shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_24px_-12px_rgba(15,23,42,.18)]`}
        data-testid={welcome ? 'welcome-compact' : 'bday-compact'}
      >
        {light ? (
          d.bgUrl ? (
            <>
              <img src={d.bgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
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
                  className="absolute"
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
            {!welcome && (
              <svg className="pointer-events-none absolute right-3 -bottom-2 h-[75%] opacity-60" viewBox="0 0 90 140" aria-hidden>
                <path d="M28 70 C26 95 36 110 30 140" stroke="#94a3b8" strokeWidth="1" fill="none" />
                <path d="M62 60 C64 90 54 110 60 140" stroke="#94a3b8" strokeWidth="1" fill="none" />
                <ellipse cx="28" cy="44" rx="20" ry="25" fill={theme.hex} opacity=".55" />
                <ellipse cx="62" cy="34" rx="18" ry="23" fill="#fbbf24" opacity=".6" />
                <ellipse cx="22" cy="36" rx="5" ry="8" fill="#fff" opacity=".45" />
                <ellipse cx="57" cy="26" rx="4" ry="7" fill="#fff" opacity=".45" />
              </svg>
            )}
          </>
        )}
        {fx}

        <div className="relative h-full flex items-center gap-6 pl-16 pr-16">
          {/* Lời chào */}
          <div className="min-w-0 flex-1 max-w-[520px]">
            <div className={`inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-[13px] font-semibold ${light ? 'bg-white/15 text-white ring-1 ring-white/25' : `bg-white/80 ${theme.accent} ring-1 ring-white shadow-sm`}`}>
              <Icon size={12} />{' '}
              {welcome
                ? `${tr('Chào mừng thành viên mới', 'Welcome new members')} · ${tr('Đợt', 'Batch')} ${batch ? fmtDayMonth(batch) : ''}`
                : `${tr('Sinh nhật hôm nay', "Today's birthdays")} · ${wdLong[today.getDay()]}, ${fmtDayMonth(today)}`}
              {sample && <span className="ml-1 px-1.5 rounded bg-amber-100 text-amber-700">{tr('Dữ liệu mẫu', 'Sample data')}</span>}
            </div>
            <div className={`mt-2.5 text-[24px] font-semibold tracking-tight flex items-center gap-1.5 truncate ${light ? 'text-white' : 'text-slate-800'}`}>
              {fillCount(d.title, people.length)} <PartyPopper size={18} className="text-amber-400 shrink-0" />
            </div>
            <div className={`mt-2 text-[13px] italic leading-relaxed line-clamp-3 ${light ? 'text-white/85' : 'text-slate-600'}`}>
              “{d.greeting}”{' '}
              <span className={`not-italic font-semibold whitespace-nowrap ${light ? 'text-white' : theme.accent}`}>— {d.signature}</span>
            </div>
          </div>

          {/* Người — trên 5 người thì chạy ngang liên tục (di chuột vào để dừng) */}
          {marquee ? (
            <div
              className="flex-1 min-w-0 overflow-hidden motion-reduce:overflow-x-auto group/mq [mask-image:linear-gradient(to_right,transparent,#000_7%,#000_93%,transparent)]"
              data-testid={welcome ? 'welcome-marquee' : 'bday-marquee'}
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
      <div className={`relative overflow-hidden h-full rounded-2xl border bg-gradient-to-r ${theme.bg} px-5 py-4 flex items-center gap-3 ${compact ? COMPACT_H : ''}`}>
        {fx}
        <div className="relative w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
          <Cake size={20} className={theme.accent} />
        </div>
        {/* đồng bộ code iMIS 05/11 — nội dung mặc định là chữ thường */}
        <div className="relative text-sm font-semibold text-slate-600 whitespace-pre-line">{box.emptyText}</div>
      </div>
    );
  }

  const header = (light = false) => (
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-3">
        <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${theme.icon} flex items-center justify-center shadow-md`}>
          <Icon size={22} className="text-white" />
        </div>
        <div>
          <div className={`text-[11px] font-black uppercase tracking-wider ${light ? 'text-white/80' : theme.accent}`}>
            {welcome
              ? `${tr('Chào mừng thành viên mới', 'Welcome new members')} · ${tr('Đợt', 'Batch')} ${batch ? fmtDayMonth(batch) : ''}`
              : `${tr('Sinh nhật hôm nay', "Today's birthdays")} · ${wdLong[today.getDay()]}, ${fmtDayMonth(today)}`}
            {sample && (
              <span className="ml-2 normal-case tracking-normal px-1.5 py-px rounded bg-amber-100 text-amber-700 border border-amber-200">
                {tr('Dữ liệu mẫu', 'Sample data')}
              </span>
            )}
          </div>
          <div className={`text-base font-black flex items-center gap-1.5 ${light ? 'text-white' : 'text-slate-800'}`}>
            {fillCount(d.title, people.length)} <PartyPopper size={16} className="text-amber-400" />
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
        {/* đồng bộ code iMIS 05/11 — lời chúc chung là chữ thường */}
        “{d.greeting}”
      </div>
      <p className={`mt-1 text-xs font-black text-right ${light ? 'text-white/90' : theme.accent}`}>— {d.signature}</p>
    </div>
  );

  // ---- Bố cục Banner: ảnh nền MarCom + lớp phủ tối, chữ trắng
  if (d.layout === 'banner') {
    return (
      <div className="relative h-full overflow-hidden rounded-2xl shadow-sm">
        {d.bgUrl ? (
          <img src={d.bgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.icon}`} />
        )}
        <div className="absolute inset-0 bg-slate-900/35" />
        {fx}
        <div className="relative px-5 pt-4 pb-5">
          {header(true)}
          <div className="mt-4 flex flex-wrap gap-4">
            {people.map((e) => (
              <div key={e.id} className="flex flex-col items-center w-[110px] text-center">
                <Avatar e={e} size={64} rounded={rounded} className="ring-4 ring-white/40" />
                <div className="mt-1.5 text-[13px] font-black text-white leading-tight line-clamp-2">{e.name}</div>
                {subLine(d, e) && <div className="text-[11px] text-white/75 truncate w-full">{subLine(d, e)}</div>}
                {welcome && <div className="text-[11px] font-semibold text-white/90">{dateLine(e)}</div>}
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
      {fx}
      <div className="relative px-5 pt-4 pb-5">
        {header()}
        {d.layout === 'list' ? (
          // ---- Bố cục Danh sách: gọn, nhiều người vẫn thoáng
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {people.map((e) => (
              <div key={e.id} className="flex items-center gap-3 bg-white/85 rounded-xl border border-white shadow-sm px-3 py-2">
                <Avatar e={e} size={40} rounded={rounded} className={`ring-2 ${theme.ring}`} />
                <div className="min-w-0">
                  <div className="text-[13px] font-black text-slate-800 truncate">{emoji} {e.name}</div>
                  {subLine(d, e) && <div className="text-[11px] font-semibold text-slate-400 truncate">{subLine(d, e)}</div>}
                  {welcome && <div className={`text-[11px] font-bold ${theme.accent}`}>{dateLine(e)}</div>}
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
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 border-2 border-white flex items-center justify-center text-[11px]">{emoji}</span>
                </div>
                <div className="mt-2 text-[13px] font-black text-slate-800 leading-tight line-clamp-2">{e.name}</div>
                {subLine(d, e) && <div className="text-[11px] font-semibold text-slate-400 truncate">{subLine(d, e)}</div>}
                {welcome && <div className={`text-[11px] font-bold ${theme.accent}`}>{dateLine(e)}</div>}
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
// đồng bộ code iMIS 18/11 — khung 8:1, nền mờ phía sau, ảnh theo cách hiển thị (object-fit) cấu hình, mặc định contain;
// video MP4/WebM: chỉ 1 video (không nền mờ), tự chạy, tắt tiếng, lặp
// Bản gọn (trang chủ): cao cố định COMPACT_H, đổ bóng mềm, rê chuột phóng nhẹ, có link thì hiện nút "Xem chi tiết"
const BannerSlide: React.FC<{ b: HomeBanner; fit: BoxConfig['bannerFit']; compact?: boolean }> = ({ b, fit, compact }) => {
  const img = (
    <div
      className={`group/bn relative overflow-hidden rounded-2xl ${b.video ? 'bg-slate-900' : 'bg-slate-100'} ${compact ? `${COMPACT_H} shadow-[0_1px_2px_rgba(15,23,42,.06),0_8px_24px_-12px_rgba(15,23,42,.25)]` : 'h-full min-h-[120px] aspect-[8/1] shadow-sm'}`}
    >
      {b.video ? (
        <video src={b.url} className="absolute inset-0 w-full h-full" style={{ objectFit: fit || 'contain' }} muted playsInline autoPlay loop preload="metadata" disablePictureInPicture aria-hidden />
      ) : (
        <>
          <img src={b.url} alt="" aria-hidden className="absolute inset-0 w-full h-full object-cover blur-[24px] brightness-[0.8] scale-[1.15]" draggable={false} />
          <img
            src={b.url}
            alt={b.name}
            className={`absolute inset-0 w-full h-full ${compact ? 'transition-transform duration-700 group-hover/bn:scale-[1.02]' : ''}`}
            style={{ objectFit: fit || 'contain' }}
            draggable={false}
          />
        </>
      )}
      {compact && <span className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5" />}
      {compact && b.link && (
        <span className="absolute right-4 bottom-4 inline-flex items-center gap-1 h-7 px-3 rounded-full bg-white/90 text-[13px] font-semibold text-slate-700 shadow opacity-0 group-hover/bn:opacity-100 transition-opacity">
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

/** Xem trước đúng 1 slide người trong editor — không có ai thì dùng nhân sự mẫu để thấy thiết kế. CR-20261105-001 thiết kế riêng 05/11 */
export const SlidePreview: React.FC<{ kind: PeopleKind; cfg: BoxConfig }> = ({ kind, cfg }) => {
  const { employees, birthdayEmployees } = useMarcom();
  const bday = useTodayBirthdays();
  const { tuesday, people: newcomers } = useWelcomeNewcomers();
  const real = kind === 'welcome' ? newcomers : bday;
  const sample = real.length === 0;
  const people = sample ? (kind === 'welcome' ? employees.filter(inWelcomeBatch) : birthdayEmployees.filter((e) => e.active)).slice(0, 3) : real;
  return <PeopleSlide kind={kind} box={cfg} people={people} batch={tuesday} sample={sample} preview />;
};

type Slide = { kind: 'bday'; id: string } | { kind: 'welcome'; id: string } | { kind: 'banner'; id: string; b: HomeBanner };

/** Hiệu ứng của 1 slide: banner lưu ở HomeBanner.effect, slide Sinh nhật / Chào mừng ở BoxConfig. */
const effectOf = (box: BoxConfig, x: Slide): SlideEffect =>
  normalizeEffect(x.kind === 'banner' ? x.b.effect : x.kind === 'bday' ? box.birthdayEffect : box.welcomeEffect);
const overlayOf = (box: BoxConfig, x: Slide) =>
  normalizeOverlay(x.kind === 'banner' ? x.b.overlay : x.kind === 'bday' ? box.birthdayOverlay : box.welcomeOverlay);
/** Id slide dùng cho "Xem thử hiệu ứng" ở editor: 'bday' | 'welcome' | id banner. */
export const slotId = (s: BoxSlot) => (s.kind === 'banner' ? s.b.id : s.kind);

/** compact: bản gọn cho trang chủ (cao cố định, 1 hàng). replay: editor bấm "Xem thử" → nhảy tới slide id và chạy lại hiệu ứng (n tăng mỗi lần bấm). */
export const BirthdayBox: React.FC<{
  preview?: boolean;
  simulateEmpty?: boolean;
  simulateNoNewcomers?: boolean;
  cfg?: BoxConfig;
  compact?: boolean;
  replay?: { id: string; n: number };
  onReplayMissing?: () => void;
}> = ({ preview = false, simulateEmpty = false, simulateNoNewcomers = false, cfg, compact = false, replay, onReplayMissing }) => {
  const { config, employees } = useMarcom();
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
  const { tuesday, isBatchDay, people: newcomers } = useWelcomeNewcomers(simulateNoNewcomers);
  // Xem trước: đợt hiện tại không có ai → dùng nhân sự mẫu (gắn nhãn "Dữ liệu mẫu"); trang chủ thì ẩn slide
  const welcomeSample = preview && box.welcomeEnabled && newcomers.length === 0;
  const welcomePeople = welcomeSample ? employees.filter(inWelcomeBatch).slice(0, 3) : newcomers;
  const hasBday = people.length > 0 || box.emptyMode === 'default';
  // Thứ tự theo danh sách cấu hình (boxSlots) rồi bỏ các slide không hiện — đồng bộ code iMIS 05/11 (BirthdaySlideIndex)
  const ordered: Slide[] = boxSlots(box).map((s) => (s.kind === 'banner' ? { kind: 'banner' as const, id: s.b.id, b: s.b } : { kind: s.kind, id: s.kind }));
  const slides = ordered.filter((x) =>
    x.kind === 'bday' ? hasBday : x.kind === 'welcome' ? box.welcomeEnabled && welcomePeople.length > 0 && (preview || isBatchDay) : x.b.active && !!x.b.url,
  );
  const n = slides.length;
  const baseDur = (box.slideSeconds > 0 ? box.slideSeconds : 5) * 1000; // đồng bộ code iMIS 05/11 — cho phép 1–2 giây
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const cur = n ? idx % n : 0;
  // Bản gọn: slide người đang chạy danh sách (trên 5 người) → giữ đủ 1 vòng rồi mới sang slide sau
  const curCount = slides[cur]?.kind === 'bday' ? people.length : slides[cur]?.kind === 'welcome' ? welcomePeople.length : 0;
  const dur = compact && curCount > MARQUEE_FROM ? Math.max(baseDur, marqueeSeconds(curCount) * 1000) : baseDur;
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
  // Đếm số lần chạy lại theo slide → đổi key của riêng slide đó để hiệu ứng chạy lại (slide khác giữ nguyên)
  const [replays, setReplays] = useState<Record<string, number>>({});
  useEffect(() => {
    if (!replay) return;
    const i = slides.findIndex((x) => x.id === replay.id);
    if (i < 0) return onReplayMissing?.();
    setReplays((r) => ({ ...r, [replay.id]: (r[replay.id] || 0) + 1 }));
    go(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replay?.n]);

  if (!preview && !box.showOnHome) return null;
  // đồng bộ code iMIS 18/11 — bấm "Thu gọn" → box thành 1 thanh mỏng (nhớ trong ngày), bấm thanh để mở lại; không có gì để hiện thì không có thanh
  if (!preview && dismissed) {
    if (!n) return null;
    const names = people.map((e) => e.name).filter(Boolean);
    const peek = names.slice(0, PEEK_MAX_NAMES).join(', ') + (names.length > PEEK_MAX_NAMES ? ` +${names.length - PEEK_MAX_NAMES}` : '');
    return (
      <button
        type="button"
        aria-expanded={false}
        onClick={() => {
          setDismissed(false);
          try {
            localStorage.removeItem(DISMISS_KEY);
          } catch {
            /* bỏ qua */
          }
        }}
        className="w-full min-h-[44px] px-3.5 py-1.5 flex items-center gap-2.5 rounded-xl border border-[#f3d3e3] bg-gradient-to-r from-[#fdf2f8] to-white to-70% text-[13px] text-slate-700 text-left cursor-pointer transition-[border-color,box-shadow] hover:border-pink-300 hover:shadow-[0_2px_8px_rgba(190,24,93,.08)]"
        data-testid="home-banner-restore"
      >
        {people.length > 0 ? (
          <>
            <span className="w-7 h-7 shrink-0 grid place-items-center rounded-lg bg-pink-100 text-pink-700">
              <Cake size={14} />
            </span>
            <span className="flex-1 min-w-0 truncate">
              <b className="font-semibold text-slate-900">{tr('Sinh nhật hôm nay', "Today's birthdays")}</b> · {peek}
            </span>
          </>
        ) : (
          <>
            <span className="w-7 h-7 shrink-0 grid place-items-center rounded-lg bg-sky-100 text-sky-700">
              <Megaphone size={14} />
            </span>
            <span className="flex-1 min-w-0 truncate">
              <b className="font-semibold text-slate-900">{tr('Bảng tin MarCom', 'MarCom news')}</b>
            </span>
          </>
        )}
        <span className="shrink-0 inline-flex items-center gap-1.5 font-semibold text-pink-700">
          {tr('Mở lại', 'Expand')} <ChevronDown size={14} />
        </span>
      </button>
    );
  }
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
        <EyeOff size={14} />{' '}
        {tr(
          'Không có sinh nhật hôm nay, không có nhân sự mới trong đợt và chưa có banner → Box được ẩn khỏi trang chủ',
          'No birthdays today, no new members in this batch and no banners → the Box is hidden from the home page',
        )}
      </div>
    ) : null;
  // Hiệu ứng trên màn: slide người → chạy sau thẻ / chữ (fx); banner ảnh → phủ trên ảnh (ở khung slide bên dưới)
  const renderSlide = (x: Slide, onClose?: () => void, on = false) =>
    x.kind === 'bday' ? (
      <PeopleSlide kind="bday" box={box} people={people} preview={preview} onClose={onClose} compact={compact} fx={on && <SlideOverlay type={overlayOf(box, x)} behind />} />
    ) : x.kind === 'welcome' ? (
      <PeopleSlide kind="welcome" box={box} people={welcomePeople} batch={tuesday} sample={welcomeSample} preview={preview} onClose={onClose} compact={compact} fx={on && <SlideOverlay type={overlayOf(box, x)} behind />} />
    ) : (
      <BannerSlide b={x.b} fit={box.bannerFit} compact={compact} />
    );
  const slideTitle = (x: Slide) =>
    x.kind === 'bday' ? tr('Sinh nhật hôm nay', "Today's birthdays") : x.kind === 'welcome' ? tr('Chào mừng thành viên mới', 'Welcome new members') : x.b.name;
  // Chỉ có 1 slide sinh nhật / chào mừng → hiển thị tĩnh, không chạy slide
  // (bản gọn luôn dùng khung slide bên dưới để có nút ẩn ở góc)
  if (n === 1 && slides[0].kind !== 'banner' && !compact)
    return (
      <div className="relative" key={`${slides[0].id}-${replays[slides[0].id] || 0}`}>
        {renderSlide(slides[0], dismiss, true)}
      </div>
    );

  return (
    <div
      className="relative group"
      data-testid="home-slider"
      data-paused={paused ? '1' : '0'}
      data-index={cur}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Hiệu ứng theo từng slide: slide đang hiện chạy hiệu ứng vào (mbx-fx-*), slide vừa rời mờ đi; khung cắt phần trượt / lật ra ngoài */}
      <div className="grid grid-cols-[minmax(0,1fr)] overflow-hidden rounded-2xl [perspective:1200px]">
        {slides.map((x, i) => {
          const on = i === cur;
          const fx = effectOf(box, x);
          const style = { '--fx-dur': baseDur <= 2000 ? '250ms' : fx === 'fade' ? '500ms' : '700ms', '--slide-dur': `${dur}ms` } as React.CSSProperties;
          return (
            <div
              key={`${x.id}-${replays[x.id] || 0}`}
              aria-hidden={!on}
              data-slide={x.kind === 'bday' ? 'birthday' : x.kind === 'welcome' ? 'welcome' : x.b.name}
              data-effect={fx}
              style={style}
              className={`relative [grid-area:1/1] min-w-0 ${on ? `opacity-100 z-[1] mbx-in mbx-fx-${fx}` : `opacity-0 pointer-events-none transition-opacity ${effectOf(box, slides[cur]) === 'none' ? 'duration-0' : 'duration-300'}`}`}
            >
              {renderSlide(x, undefined, on)}
              {on && x.kind === 'banner' && <SlideOverlay type={overlayOf(box, x)} />}
            </div>
          );
        })}
      </div>
      {!preview && (
        <button
          type="button"
          onClick={dismiss}
          className={`absolute z-[2] rounded-lg cursor-pointer bg-white/70 text-slate-500 hover:bg-white hover:text-slate-700 shadow-sm ${compact ? 'top-2 right-2 p-1' : 'top-3 right-3 p-1.5'}`}
          title={tr('Thu gọn', 'Collapse')}
          aria-label={tr('Thu gọn', 'Collapse')}
        >
          <ChevronUp size={15} />
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
                title={slideTitle(x)}
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
