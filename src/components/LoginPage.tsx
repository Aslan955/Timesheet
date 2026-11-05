/**
 * Màn đăng nhập iMIS — bố cục 2 khối: khối thương hiệu (nền xanh, minh hoạ nền tảng) + khối đăng nhập (logo VTX Group).
 * Chỉ đăng nhập bằng tài khoản Microsoft 365 của công ty (SSO): mật khẩu, xác thực 2 lớp, quên mật khẩu do Microsoft quản lý.
 * Bản prototype: chưa nối Microsoft Entra ID — bấm nút rồi chọn tài khoản mẫu để vào hệ thống.
 */
import React, { useEffect, useState } from 'react';
import { ArrowLeft, CircleHelp, Globe, Loader2, ShieldCheck } from 'lucide-react';
import { PROC_PEOPLE, emailOf } from './process/processStore';
import groupLogo from '../assets/login/vtx-group-members.png';

export interface LoginUser {
  email: string;
  name: string;
  method: 'microsoft';
}
const KEY = 'imis_login';
/** Phiên đăng nhập đã lưu (Ghi nhớ đăng nhập → localStorage, không thì chỉ trong tab này). */
export const savedLogin = (): LoginUser | null => {
  for (const st of [() => window.sessionStorage, () => window.localStorage]) {
    try {
      const v = st().getItem(KEY);
      if (v) return JSON.parse(v) as LoginUser;
    } catch {
      /* trình duyệt chặn lưu trữ → đăng nhập lại */
    }
  }
  return null;
};
export const clearLogin = () => {
  for (const st of [() => window.sessionStorage, () => window.localStorage]) {
    try {
      st().removeItem(KEY);
    } catch {
      /* bỏ qua */
    }
  }
};
const remember = (u: LoginUser, keep: boolean) => {
  try {
    (keep ? window.localStorage : window.sessionStorage).setItem(KEY, JSON.stringify(u));
  } catch {
    /* bỏ qua */
  }
};

const BRAND = '#011b64'; // xanh navy logo VTX
const ACCENT = '#ff0f55'; // hồng nhấn logo VTX
const BLUE = '#1f5fa8';

/** Khung đăng nhập giữ đúng tỉ lệ thiết kế 1060 × 700: màn nhỏ hơn (laptop, zoom 125%…) thì thu nhỏ cả khung cho vừa, không bị cắt. */
const CARD_W = 1060;
const CARD_H = 700;
const useFitScale = () => {
  const calc = () => {
    if (typeof window === 'undefined' || window.innerWidth < 768) return 1; // điện thoại: xếp 1 cột, không thu nhỏ
    return Math.min(1, (window.innerWidth - 48) / CARD_W, (window.innerHeight - 150) / CARD_H);
  };
  const [k, setK] = useState(calc);
  useEffect(() => {
    const on = () => setK(calc());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return Math.max(0.6, k);
};

export const LoginPage: React.FC<{ onLogin: (u: LoginUser) => void }> = ({ onLogin }) => {
  const k = useFitScale();
  return (
  <div className="min-h-screen w-full relative overflow-auto flex flex-col items-center justify-center px-4 py-10" style={{ background: 'linear-gradient(135deg,#e9f0fb 0%,#f6f8fc 45%,#fdeef3 100%)' }}>
    <Backdrop />
    <div className="absolute top-5 right-6 flex items-center gap-5 text-[13px] text-slate-600 z-10">
      <span className="inline-flex items-center gap-1.5">
        <Globe size={15} /> Tiếng Việt
      </span>
      <span className="w-px h-4 bg-slate-300" />
      <a className="inline-flex items-center gap-1.5 hover:text-[#1f5fa8] cursor-pointer" title="Liên hệ IT: it@congty.vn">
        <CircleHelp size={15} /> Trợ giúp
      </a>
    </div>

    <div className="relative z-10 w-full max-w-[1060px] md:w-[1060px] md:min-h-[700px] md:max-w-none grid grid-cols-1 md:grid-cols-[1.05fr_1fr] rounded-[18px] overflow-hidden shadow-[0_24px_60px_-20px_rgba(1,27,100,0.35)] bg-white" style={k < 1 ? { zoom: k } : undefined} data-testid="login-card">
      <BrandPanel />
      <div className="px-8 sm:px-14 py-12 flex flex-col justify-center">
        <ImisLogo className="h-14 w-auto self-center" />
        <h1 className="mt-8 text-center text-[26px] font-bold text-slate-800">Đăng nhập</h1>
        <p className="text-center text-[13px] text-slate-500 mt-1">Hệ thống quản trị doanh nghiệp iMIS</p>
        <MicrosoftLogin onLogin={onLogin} />
      </div>
    </div>

    <p className="relative z-10 mt-8 text-[12.5px] text-slate-500">Copyright © 2026 VTX Group · Synodus · Aequitas</p>
  </div>
  );
};

/** Logo chữ iMIS theo phong cách logo VTX: chữ đậm khối màu navy, nét nhấn hồng dạng lưỡi chéo (như nét chữ X). */
export const ImisLogo: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 138 60" className={className} role="img" aria-label="iMIS" data-testid="imis-logo">
    {/* chữ i: thân navy + chấm hồng vát chéo 2 góc (như nét cắt chữ X của logo VTX) */}
    <rect x="4" y="22" width="15" height="34" rx="1.5" fill={BRAND} />
    <path d="M4 18 V11 L11 5 H19 V12 L12 18 Z" fill={ACCENT} />
    <text x="26" y="56" fontFamily="Inter, 'Segoe UI', Arial, sans-serif" fontSize="56" fontWeight="800" letterSpacing="1" fill={BRAND}>
      MIS
    </text>
  </svg>
);

/** Nền: các mảng màu mờ theo màu thương hiệu. */
const Backdrop: React.FC = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900" aria-hidden="true">
    <defs>
      <radialGradient id="lg-a" cx="0.2" cy="0.15" r="0.5">
        <stop offset="0" stopColor="#3b7be0" stopOpacity="0.28" />
        <stop offset="1" stopColor="#3b7be0" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="lg-b" cx="0.85" cy="0.9" r="0.45">
        <stop offset="0" stopColor={ACCENT} stopOpacity="0.16" />
        <stop offset="1" stopColor={ACCENT} stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="1440" height="900" fill="url(#lg-a)" />
    <rect width="1440" height="900" fill="url(#lg-b)" />
    <path d="M0 720 C 300 640 520 800 820 730 S 1260 620 1440 690 V900 H0Z" fill={BRAND} opacity="0.05" />
    <path d="M0 780 C 360 720 620 860 940 790 S 1300 720 1440 760 V900 H0Z" fill={BRAND} opacity="0.06" />
    {Array.from({ length: 9 }, (_, i) => (
      <circle key={i} cx={120 + i * 150} cy={90 + (i % 3) * 30} r="2.5" fill={BRAND} opacity="0.12" />
    ))}
  </svg>
);

/** Khối thương hiệu bên trái: tiêu đề + minh hoạ các phân hệ iMIS + các công ty thành viên. */
const BrandPanel: React.FC = () => (
  <div className="relative hidden md:flex flex-col items-center text-white px-8 pt-0 pb-8 overflow-hidden" style={{ background: `linear-gradient(160deg, #1d5fd6 0%, #0c3fae 45%, ${BRAND} 100%)` }}>
    <div className="bg-white rounded-b-[14px] px-6 py-2.5 shadow-md flex items-center gap-2">
      <ImisLogo className="h-5 w-auto" />
      <span className="w-px h-4 bg-slate-300" />
      <span className="text-[12px] font-semibold text-slate-600">Hệ thống quản trị</span>
    </div>
    <span className="mt-8 px-4 py-1 rounded-full border border-white/50 bg-white/10 text-[12.5px] font-semibold tracking-[0.12em]">NỀN TẢNG</span>
    <h2 className="mt-3 text-center text-[27px] leading-[1.25] font-extrabold tracking-wide drop-shadow-sm">
      QUẢN TRỊ DOANH NGHIỆP
      <br />
      HỢP NHẤT
    </h2>
    <Illustration />
    {/* Logo tập đoàn kèm công ty thành viên — đúng file logo công ty gửi */}
    <div className="mt-auto w-full flex justify-center pt-2">
      <div className="bg-white rounded-[16px] shadow-lg w-full max-w-[400px] px-10 py-7" data-testid="brand-lockup">
        <img src={groupLogo} alt="VTX Group · Synodus · Aequitas" className="w-full h-auto" />
      </div>
    </div>
  </div>
);

/** Minh hoạ: bảng điều khiển trung tâm + các thẻ phân hệ bay quanh. */
const Illustration: React.FC = () => {
  const card = (x: number, y: number, w: number, h: number, rot = 0) => (
    <rect x={x} y={y} width={w} height={h} rx="10" fill="#ffffff" fillOpacity="0.14" stroke="#ffffff" strokeOpacity="0.45" transform={rot ? `rotate(${rot} ${x + w / 2} ${y + h / 2})` : undefined} />
  );
  return (
    <svg viewBox="0 0 440 300" className="w-full max-w-[420px] mt-4" aria-hidden="true">
      <defs>
        <linearGradient id="il-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="1" stopColor="#dce8ff" stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <ellipse cx="220" cy="270" rx="150" ry="16" fill="#000" opacity="0.18" />
      {/* vòng quỹ đạo */}
      <ellipse cx="220" cy="150" rx="200" ry="118" fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeDasharray="4 6" />
      {/* màn hình trung tâm */}
      <rect x="120" y="70" width="200" height="140" rx="14" fill="url(#il-screen)" />
      <rect x="120" y="70" width="200" height="24" rx="12" fill={BRAND} />
      <rect x="120" y="82" width="200" height="12" fill={BRAND} />
      <circle cx="136" cy="82" r="3.5" fill={ACCENT} />
      <circle cx="148" cy="82" r="3.5" fill="#ffffff" fillOpacity="0.6" />
      <circle cx="160" cy="82" r="3.5" fill="#ffffff" fillOpacity="0.6" />
      {/* biểu đồ cột */}
      {[34, 58, 44, 72, 52, 86].map((h, i) => (
        <rect key={i} x={140 + i * 18} y={196 - h} width="11" height={h} rx="3" fill={i === 5 ? ACCENT : BLUE} fillOpacity={i === 5 ? 1 : 0.8} />
      ))}
      {/* đường xu hướng */}
      <polyline points="250,170 268,150 286,158 304,124" fill="none" stroke="#0f8f6c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="304" cy="124" r="4" fill="#0f8f6c" />
      <rect x="250" y="182" width="56" height="6" rx="3" fill={BRAND} fillOpacity="0.25" />
      <rect x="250" y="106" width="40" height="6" rx="3" fill={BRAND} fillOpacity="0.25" />
      <rect x="120" y="210" width="200" height="10" rx="5" fill="#ffffff" fillOpacity="0.35" />
      <rect x="196" y="220" width="48" height="34" fill="#ffffff" fillOpacity="0.25" />
      <rect x="170" y="252" width="100" height="8" rx="4" fill="#ffffff" fillOpacity="0.5" />

      {/* thẻ phân hệ: Hợp đồng */}
      {card(18, 48, 82, 62, -6)}
      <g transform="rotate(-6 59 79)">
        <rect x="34" y="60" width="26" height="34" rx="4" fill="#ffffff" />
        <rect x="39" y="68" width="16" height="3" rx="1.5" fill={BLUE} />
        <rect x="39" y="75" width="12" height="3" rx="1.5" fill={BLUE} fillOpacity="0.5" />
        <rect x="39" y="82" width="14" height="3" rx="1.5" fill={BLUE} fillOpacity="0.5" />
        <text x="66" y="83" fontSize="10" fill="#ffffff" fontWeight="700">HĐ</text>
      </g>
      {/* Nhân sự */}
      {card(14, 168, 86, 60, 5)}
      <g transform="rotate(5 57 198)">
        <circle cx="42" cy="190" r="9" fill="#ffffff" />
        <path d="M28 214 a14 12 0 0 1 28 0z" fill="#ffffff" />
        <circle cx="64" cy="192" r="7" fill="#ffffff" fillOpacity="0.6" />
        <path d="M54 214 a10 9 0 0 1 20 0z" fill="#ffffff" fillOpacity="0.6" />
      </g>
      {/* Ticket */}
      {card(344, 40, 84, 60, 7)}
      <g transform="rotate(7 386 70)">
        <path d="M358 58 h52 v10 a6 6 0 0 0 0 12 v10 h-52 v-10 a6 6 0 0 0 0 -12z" fill="#ffffff" />
        <rect x="370" y="66" width="28" height="3" rx="1.5" fill={ACCENT} />
        <rect x="370" y="74" width="20" height="3" rx="1.5" fill={BLUE} fillOpacity="0.5" />
      </g>
      {/* Quy trình */}
      {card(342, 166, 86, 62, -5)}
      <g transform="rotate(-5 385 197)">
        <circle cx="362" cy="196" r="7" fill="#ffffff" />
        <circle cx="410" cy="182" r="7" fill="#ffffff" />
        <circle cx="410" cy="212" r="7" fill={ACCENT} />
        <path d="M369 196 L403 184 M369 197 L403 210" stroke="#ffffff" strokeWidth="2" />
      </g>
      {/* chấm sáng */}
      <circle cx="110" cy="30" r="3" fill="#ffffff" fillOpacity="0.7" />
      <circle cx="330" cy="246" r="3" fill="#ffffff" fillOpacity="0.6" />
      <circle cx="420" cy="140" r="2.5" fill={ACCENT} />
    </svg>
  );
};

const MsLogo: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 21 21" aria-hidden="true">
    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
  </svg>
);
/** Tài khoản mẫu cho bản prototype (khi chạy thật: Microsoft trả về tài khoản đã đăng nhập trên máy). */
const DEMO = PROC_PEOPLE.slice(0, 6);
const initials = (n: string) =>
  n
    .split(/\s+/)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Đăng nhập một chạm bằng tài khoản Microsoft 365 công ty. */
const MicrosoftLogin: React.FC<{ onLogin: (u: LoginUser) => void }> = ({ onLogin }) => {
  const [keep, setKeep] = useState(true);
  const [step, setStep] = useState<'start' | 'pick' | 'busy'>('start');
  const pick = (name: string) => {
    setStep('busy');
    window.setTimeout(() => {
      const u: LoginUser = { email: emailOf(name) || 'admin@congty.vn', name, method: 'microsoft' };
      remember(u, keep);
      onLogin(u);
    }, 700);
  };
  if (step === 'pick')
    return (
      <div className="mt-6" data-testid="login-pick">
        <button type="button" onClick={() => setStep('start')} className="inline-flex items-center gap-1 text-[13px] text-slate-500 hover:text-slate-700 cursor-pointer">
          <ArrowLeft size={15} /> Quay lại
        </button>
        <div className="mt-3 rounded-[10px] border border-slate-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 text-[13px] font-semibold text-slate-700 flex items-center gap-2">
            <MsLogo size={16} /> Chọn tài khoản công ty
            <span className="ml-auto text-[11px] font-normal text-slate-400">mô phỏng (prototype)</span>
          </div>
          <div className="divide-y divide-slate-100 max-h-[300px] overflow-auto">
            {DEMO.map((n) => (
              <button key={n} type="button" onClick={() => pick(n)} className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-[#eaf2fc] cursor-pointer" data-testid="login-account">
                <span className="w-9 h-9 rounded-full bg-[#1f5fa8] text-white text-[12px] font-bold flex items-center justify-center">{initials(n)}</span>
                <span className="min-w-0">
                  <span className="block text-[14px] font-semibold text-slate-800">{n}</span>
                  <span className="block text-[12px] text-slate-500 truncate">{emailOf(n)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div className="mt-8 space-y-5" data-testid="login-ms">
      <button
        type="button"
        onClick={() => setStep('pick')}
        disabled={step === 'busy'}
        className="w-full h-12 rounded-[8px] text-white text-[15px] font-semibold cursor-pointer inline-flex items-center justify-center gap-3 transition shadow-sm disabled:opacity-80"
        style={{ background: `linear-gradient(90deg, ${BLUE}, #0c3fae)` }}
        data-testid="login-microsoft"
      >
        {step === 'busy' ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <span className="bg-white rounded-[4px] p-1 inline-flex">
            <MsLogo size={16} />
          </span>
        )}
        {step === 'busy' ? 'Đang đăng nhập…' : 'Đăng nhập bằng Microsoft 365'}
      </button>
      <label className="flex items-center justify-center gap-2 text-[13px] text-slate-600 cursor-pointer select-none">
        <input type="checkbox" checked={keep} onChange={(e) => setKeep(e.target.checked)} className="w-4 h-4 accent-[#1f5fa8]" /> Ghi nhớ đăng nhập trên máy này
      </label>
      <div className="rounded-[10px] bg-[#f3f6fa] border border-slate-200 px-4 py-3 text-[12.5px] text-slate-600 leading-relaxed flex gap-2.5">
        <ShieldCheck size={18} className="text-[#0f8f6c] shrink-0 mt-0.5" />
        <span>
          Dùng <b>email công ty</b> (tài khoản Outlook / Teams). Mật khẩu, xác thực 2 lớp và đặt lại mật khẩu do Microsoft 365 quản lý — iMIS không lưu mật khẩu của bạn.
        </span>
      </div>
      <p className="text-center text-[12px] text-slate-400">Chưa có tài khoản hoặc không đăng nhập được? Liên hệ phòng IT: it@congty.vn</p>
    </div>
  );
};
