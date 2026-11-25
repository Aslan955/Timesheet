/**
 * Hiệu ứng trên màn của 1 slide Box trang chủ — cơ bản, thể thao, ngày lễ Việt Nam, ngày quốc tế.
 * Mỗi hiệu ứng = vài lớp chuyển động (rơi, bay lên, lấp lánh, treo đung đưa, nảy, bay ngang, pháo hoa).
 * Lớp phủ không bắt chuột, chạy lặp suốt lúc slide hiển thị; CSS ở index.css (.mbx-ov / .mbx-p …).
 */
import React, { useMemo } from 'react';
import { SlideOverlay as Overlay } from './marcomData';

/** Số ngẫu nhiên cố định theo seed → mỗi lần render cùng 1 bố cục hạt. */
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const CONFETTI = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#a855f7', '#ec4899', '#facc15'];
const FW = ['#f43f5e', '#facc15', '#38bdf8', '#a78bfa', '#34d399'];

type P = React.CSSProperties & Record<`--${string}`, string>;
type Range = [number, number];

/** Cờ Việt Nam vẽ bằng SVG (emoji cờ không hiện trên Windows). */
const Flag: React.FC<{ h: number }> = ({ h }) => (
  <svg width={h * 1.5} height={h} viewBox="0 0 30 20" style={{ display: 'block', filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.25))' }}>
    <rect width="30" height="20" rx="1.5" fill="#da251d" />
    <polygon points="15,4 16.76,9.43 22.47,9.43 17.85,12.79 19.62,18.21 15,14.86 10.38,18.21 12.15,12.79 7.53,9.43 13.24,9.43" fill="#ffcd00" />
  </svg>
);

/** Bộ dựng các lớp chuyển động; r = số ngẫu nhiên cố định. */
const builders = (r: () => number) => {
  const between = (a: number, b: number) => a + r() * (b - a);
  const pick = <T,>(l: T[]) => l[Math.floor(r() * l.length)];
  const glyph = (g: string, size: number) => (g === 'flag' ? <Flag h={size} /> : <i className="mbx-g" style={{ fontSize: size }}>{g}</i>);
  // Rơi xuống / bay lên: trễ âm để màn đã đầy hạt ngay khi slide hiện.
  // Chiều sâu z: hạt xa nhỏ hơn, mờ hơn, chậm hơn. spin = xoay tròn (pháo giấy, quả bóng); còn lại chỉ nghiêng nhẹ.
  const drift = (n: number, d: Range, render: (i: number, z: number) => React.ReactNode, rise = false, spin = false) =>
    Array.from({ length: n }, (_, i) => {
      const z = between(0.55, 1);
      const dur = between(d[0], d[1]) / (0.6 + 0.4 * z);
      const style: P = {
        left: `${between(0, 100)}%`,
        opacity: 0.65 + 0.35 * z,
        '--d': `${dur}s`,
        '--dl': `${-between(0, dur)}s`,
        '--sd': `${between(2.2, 3.8)}s`,
        '--sx': `${between(4, spin ? 18 : 12)}px`,
        '--rot': `${spin ? between(-360, 360) : between(-15, 15)}deg`,
      };
      return (
        <span key={i} className={`mbx-p ${rise ? 'mbx-p-rise' : ''}`} style={style}>
          {render(i, z)}
        </span>
      );
    });
  const sized = (size: Range, z: number) => between(size[0], size[1]) * (0.7 + 0.3 * z);
  return {
    fall: (g: string[], n: number, d: Range, size: Range, spin = false) => drift(n, d, (_, z) => glyph(pick(g), sized(size, z)), false, spin),
    rise: (g: string[], n: number, d: Range, size: Range) => drift(n, d, (_, z) => glyph(pick(g), sized(size, z)), true),
    confetti: (n: number) =>
      drift(n, [3.5, 7], (i) => {
        const w = between(5, 9);
        return (
          <i>
            <b className="mbx-cf" style={{ width: w, height: w * between(1.3, 2), background: CONFETTI[i % CONFETTI.length], borderRadius: i % 3 === 0 ? '50%' : 1, '--fl': `${between(0.8, 1.6)}s` } as P} />
          </i>
        );
      }, false, true),
    // Nền box thường sáng: bông tuyết xanh nhạt viền trắng + hạt tròn viền xám để vẫn thấy rõ
    snow: (n: number) =>
      drift(n, [6, 13], (i) => {
        if (i % 3 === 0) return <i style={{ fontSize: between(12, 20), lineHeight: 1, color: '#7dd3fc', textShadow: '0 0 2px #fff, 0 1px 3px rgba(14,116,144,.45)' }}>❄</i>;
        const s = between(4, 8);
        return <i style={{ width: s, height: s, borderRadius: '50%', background: '#fff', opacity: between(0.75, 1), boxShadow: '0 0 0 1px rgba(148,163,184,.55), 0 1px 4px rgba(100,116,139,.45)' }} />;
      }),
    balloons: (n: number) => drift(n, [8, 14], (i, z) => <i className="mbx-g" style={{ fontSize: sized([22, 32], z), filter: `hue-rotate(${(i * 67) % 360}deg) drop-shadow(0 3px 4px rgba(15,23,42,.18))` }}>🎈</i>, true),
    twinkle: (g: string[], n: number, size: Range) =>
      Array.from({ length: n }, (_, i) => {
        const style: P = { left: `${between(2, 96)}%`, top: `${between(6, 88)}%`, fontSize: `${between(size[0], size[1])}px`, '--d': `${between(2, 3.4)}s`, '--dl': `${-between(0, 3.4)}s` };
        return (
          <span key={i} className="mbx-tw mbx-g" style={style}>
            {pick(g)}
          </span>
        );
      }),
    // Đèn lồng treo dây ở mép trên, đung đưa
    hang: (g: string[], n: number) =>
      Array.from({ length: n }, (_, i) => {
        const style: P = { left: `${((i + 0.5) / n) * 100 + between(-4, 4)}%`, fontSize: `${between(22, 30)}px`, '--len': `${between(6, 26)}px`, '--d': `${between(2.2, 3.4)}s`, '--dl': `${-between(0, 3)}s` };
        return (
          <span key={i} className="mbx-hang mbx-g" style={style}>
            {pick(g)}
          </span>
        );
      }),
    // Bóng nảy dọc mép dưới
    bounce: (g: string[], n: number, size: Range) =>
      Array.from({ length: n }, (_, i) => {
        const style: P = { left: `${((i + 0.5) / n) * 100 + between(-5, 5)}%`, fontSize: `${between(size[0], size[1])}px`, '--d': `${between(1, 1.6)}s`, '--dl': `${-between(0, 1.6)}s`, '--hgt': `${between(70, 140)}px` };
        return (
          <span key={i} className="mbx-bn mbx-g" style={style}>
            {pick(g)}
          </span>
        );
      }),
    // Bay ngang từ trái sang phải, nhấp nhô
    fly: (g: string[], n: number, d: Range, size: Range) =>
      Array.from({ length: n }, (_, i) => {
        const dur = between(d[0], d[1]);
        const style: P = { top: `${between(5, 70)}%`, fontSize: `${between(size[0], size[1])}px`, '--d': `${dur}s`, '--dl': `${-between(0, dur)}s` };
        return (
          <span key={i} className="mbx-fly mbx-g" style={style}>
            <i>{pick(g)}</i>
          </span>
        );
      }),
    fireworks: (n: number) =>
      Array.from({ length: n }, (_, k) => {
        const color = FW[k % FW.length];
        const style: P = { left: `${between(10, 90)}%`, top: `${between(15, 60)}%`, '--d': `${between(1.8, 2.6)}s`, '--dl': `${-between(0, 2.6)}s`, '--r': `${between(60, 110)}px` };
        return (
          <span key={k} className="mbx-fw" style={style}>
            {Array.from({ length: 18 }, (_, j) => (
              <i key={j} style={{ background: color, boxShadow: `0 0 8px 1px ${color}`, '--a': `${(360 / 18) * j}deg` } as P} />
            ))}
          </span>
        );
      }),
  };
};

/** Các lớp của từng hiệu ứng. */
const layersOf = (type: Overlay, B: ReturnType<typeof builders>): React.ReactNode[][] => {
  switch (type) {
    // Cơ bản
    case 'confetti':
      return [B.confetti(42)];
    case 'snow':
      return [B.snow(46)];
    case 'petals':
      return [B.fall(['🌸'], 22, [7, 13], [12, 20])];
    case 'hearts':
      return [B.rise(['💖', '❤️', '💕', '💗'], 16, [6, 11], [13, 22])];
    case 'balloons':
      return [B.balloons(11)];
    case 'sparkles':
      return [B.twinkle(['✨'], 18, [10, 20])];
    case 'fireworks':
      return [B.fireworks(6)];
    // Thể thao
    case 'football':
      return [B.bounce(['⚽'], 5, [24, 32]), B.twinkle(['✨'], 6, [10, 14])];
    case 'balls':
      return [B.fall(['⚽', '🏀', '🏐', '🎾', '🏓'], 12, [6, 10], [18, 26], true)];
    case 'medals':
      return [B.fall(['🥇', '🥈', '🥉', '🏅'], 10, [8, 12], [18, 26]), B.twinkle(['🏆'], 3, [26, 32]), B.twinkle(['✨'], 8, [10, 14])];
    // Ngày lễ Việt Nam
    case 'tet':
      return [B.hang(['🏮'], 5), B.fall(['🧧', '🌼', '🌼', '🌸'], 18, [8, 13], [14, 22])];
    case 'mid-autumn':
      return [B.hang(['🏮'], 6), B.twinkle(['⭐', '✨'], 12, [10, 16]), B.fall(['🥮'], 5, [9, 14], [16, 22])];
    case 'national-day':
      return [B.fall(['flag'], 11, [7, 12], [11, 17]), B.twinkle(['⭐'], 14, [10, 16])];
    case 'teachers':
      return [B.fall(['📚', '🌷', '💐', '✏️', '🌹'], 16, [8, 13], [14, 22])];
    case 'women':
      return [B.fall(['🌹', '💐', '🌷', '🌸'], 16, [8, 13], [14, 22]), B.rise(['💖'], 6, [8, 12], [12, 18])];
    // Ngày quốc tế
    case 'new-year':
      return [B.fireworks(5), B.confetti(24)];
    case 'christmas':
      return [B.snow(30), B.fall(['🎁', '🎄', '⭐', '🔔'], 10, [8, 13], [16, 24])];
    case 'halloween':
      return [B.fly(['🦇'], 5, [8, 12], [18, 24]), B.fall(['🎃', '👻'], 8, [9, 14], [18, 26])];
    case 'children':
      return [B.balloons(7), B.fall(['🧸', '🍭', '🪁', '🍬'], 10, [8, 13], [16, 24])];
    case 'earth':
      return [B.fall(['🍃', '🌱', '🌿'], 20, [7, 12], [14, 20]), B.twinkle(['🌍'], 3, [18, 24])];
    default:
      return [];
  }
};

/** behind = nằm sau thẻ / chữ của slide (slide Sinh nhật, Chào mừng); mặc định phủ trên (banner ảnh). */
export const SlideOverlay: React.FC<{ type: Overlay; behind?: boolean }> = ({ type, behind }) => {
  const layers = useMemo(() => {
    let h = 7;
    for (const c of type) h = (h * 31 + c.charCodeAt(0)) | 0;
    return layersOf(type, builders(rng(h)));
  }, [type]);
  if (type === 'none' || !layers.length) return null;
  return (
    <div className={`mbx-ov ${behind ? 'mbx-ov-back' : ''}`} aria-hidden data-overlay={type}>
      {layers.map((l, i) => (
        <React.Fragment key={i}>{l}</React.Fragment>
      ))}
    </div>
  );
};
