/**
 * Ảnh đại diện chữ viết tắt, dựng tại chỗ (data URI SVG) — không gửi tên nhân sự ra dịch vụ ngoài.
 */
const PALETTE: [string, string][] = [
  ['#e8f5ef', '#0f8f6c'],
  ['#eaf2fc', '#1f5fa8'],
  ['#fff1e6', '#c2410c'],
  ['#f3e8ff', '#7c3aed'],
  ['#ffe4ec', '#be185d'],
  ['#e0f2fe', '#0369a1'],
];

export const initialsOf = (name: string) => {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0].slice(0, 2) : `${w[0][0]}${w[w.length - 1][0]}`).toUpperCase();
};

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);

/** Màu nền / chữ ổn định theo tên. */
export const avatarColors = (name: string) => PALETTE[hash(name) % PALETTE.length];

export const initialsAvatar = (name: string, colors?: [string, string]) => {
  const [bg, fg] = colors || avatarColors(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" rx="32" fill="${bg}"/><text x="32" y="33" text-anchor="middle" dominant-baseline="middle" font-family="Inter,Arial,sans-serif" font-size="24" font-weight="700" fill="${fg}">${initialsOf(name)}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
};
