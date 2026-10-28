/**
 * Công thức của trường "Công thức": số, tham chiếu trường {Tên trường}, + - * / và ngoặc ().
 * Phân tích cú pháp riêng (không dùng eval) — báo lỗi cú pháp, trường không tồn tại, chia cho 0.
 */
import type { NumKind } from './processStore';

type Tok = { t: 'num'; v: number } | { t: 'ref'; v: string } | { t: 'op'; v: string };

const lex = (s: string): Tok[] => {
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
    } else if (c === '{') {
      const j = s.indexOf('}', i);
      if (j < 0) throw new Error('Thiếu dấu } đóng tên trường');
      const name = s.slice(i + 1, j).trim();
      if (!name) throw new Error('Tên trường trong {} đang trống');
      out.push({ t: 'ref', v: name });
      i = j + 1;
    } else if (/[0-9.,]/.test(c)) {
      let j = i;
      while (j < s.length && /[0-9.,]/.test(s[j])) j++;
      const raw = s.slice(i, j).replace(',', '.');
      const v = Number(raw);
      if (!isFinite(v)) throw new Error(`Số không hợp lệ: ${s.slice(i, j)}`);
      out.push({ t: 'num', v });
      i = j;
    } else if ('+-*/()×÷'.includes(c)) {
      out.push({ t: 'op', v: c === '×' ? '*' : c === '÷' ? '/' : c });
      i++;
    } else {
      throw new Error(`Ký tự không hợp lệ: "${c}"`);
    }
  }
  return out;
};

/** Tính công thức. get(name) trả về giá trị số của trường (null = trường không tồn tại). */
export const evalFormula = (expr: string, get: (name: string) => number | null): number => {
  const toks = lex(expr);
  if (!toks.length) throw new Error('Không được để trống');
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === 'op' && peek()!.v === v;
  const factor = (): number => {
    const k = peek();
    if (!k) throw new Error('Công thức chưa hoàn chỉnh');
    if (k.t === 'op' && (k.v === '+' || k.v === '-')) {
      p++;
      const v = factor();
      return k.v === '-' ? -v : v;
    }
    if (k.t === 'num') return p++, k.v;
    if (k.t === 'ref') {
      p++;
      const v = get(k.v);
      if (v === null) throw new Error(`Không có trường {${k.v}}`);
      return v;
    }
    if (k.t === 'op' && k.v === '(') {
      p++;
      const v = expr_();
      if (!isOp(')')) throw new Error('Thiếu dấu ) đóng ngoặc');
      p++;
      return v;
    }
    throw new Error(`Vị trí không hợp lệ: "${k.v}"`);
  };
  const term = (): number => {
    let v = factor();
    while (isOp('*') || isOp('/')) {
      const op = toks[p++].v;
      const r = factor();
      if (op === '/' && r === 0) throw new Error('Chia cho 0');
      v = op === '*' ? v * r : v / r;
    }
    return v;
  };
  const expr_ = (): number => {
    let v = term();
    while (isOp('+') || isOp('-')) {
      const op = toks[p++].v;
      const r = term();
      v = op === '+' ? v + r : v - r;
    }
    return v;
  };
  const v = expr_();
  if (p < toks.length) throw new Error(`Thừa ký tự: "${(toks[p] as { v: unknown }).v}"`);
  return v;
};

/** Tên các trường được tham chiếu trong công thức. */
export const refsOf = (expr: string) => [...expr.matchAll(/\{([^}]+)\}/g)].map((m) => m[1].trim());

export const roundBy = (v: number, mode: 'nearest' | 'up' | 'down' = 'nearest', decimals = 0) => {
  const k = 10 ** Math.max(0, decimals);
  const x = v * k;
  const r = mode === 'up' ? Math.ceil(x - 1e-9) : mode === 'down' ? Math.floor(x + 1e-9) : Math.round(x);
  return r / k;
};

/** Hiển thị số theo kiểu: thập phân / tự nhiên / phần trăm / tiền tệ (en-US: 1,234,567.89). */
export const fmtNumber = (v: number | null | undefined, kind: NumKind | 'currency' = 'decimal', decimals = 2, currency = 'VND') => {
  if (v === null || v === undefined || !isFinite(v)) return '';
  const d = kind === 'integer' ? 0 : kind === 'currency' ? (currency === 'VND' ? 0 : Math.min(2, decimals)) : decimals;
  const s = v.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: Math.max(0, d) });
  return kind === 'percent' ? `${s}%` : kind === 'currency' ? `${s} ${currency}` : s;
};
