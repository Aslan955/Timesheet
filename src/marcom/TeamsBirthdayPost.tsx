/**
 * Bài đăng sinh nhật trên kênh Microsoft Teams (theo mẫu bài "HAPPY BIRTHDAY" của VTX Group Community):
 *  - Tin nhắn văn bản: dòng tiêu đề (+ @mention team) và nội dung MarCom soạn, có biến tự điền:
 *      {{thang}} tháng hiện tại · {{soluong}} / {{soluong_chu}} số người (số / chữ) · {{team}} tên team
 *      {{danhsach}} mỗi người 1 dòng: "🎂 @Họ tên – Vị trí, Khối" (@mention đúng người)
 *    Hỗ trợ **chữ đậm**.
 *  - Ảnh thiệp đính kèm: tự ghép ảnh polaroid của từng người (ảnh lấy từ Employee) + họ tên + "Vị trí - Khối" lên nền thiệp.
 * Mock giao diện (Teams chế độ tối) — chưa gọi Teams thật.
 */
import React from 'react';
import { BoxConfig } from './MarcomContext';
import { MarcomEmployee } from './marcomData';

/** Danh bạ Team › Kênh lấy từ Microsoft Teams (mock). */
export const TEAMS_DIRECTORY: { team: string; channels: string[] }[] = [{ team: 'VTX Group Community', channels: ['General', 'HCNS'] }];

const initialsOf = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

/** Tài khoản đăng bài cố định: Bot iMIS dành riêng cho MarCom (không đổi tài khoản / ảnh). */
export const TEAMS_SENDER = { name: 'iMIS · MarCom', account: 'Bot iMIS (ứng dụng Teams)' };

export const SenderAvatar: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <span
    className="shrink-0 rounded-full bg-gradient-to-br from-[#5b5fc7] to-[#7f85f5] text-white font-bold flex items-center justify-center"
    style={{ width: size, height: size, fontSize: size * 0.34 }}
  >
    iM
  </span>
);

const NUM_WORDS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười'];
export const numberWord = (n: number) => NUM_WORDS[n] ?? String(n);

/** Biến dùng trong nội dung bài đăng Teams. */
export const TEAMS_PLACEHOLDERS: { key: string; desc: string }[] = [
  { key: '{{danhsach}}', desc: 'Danh sách người sinh nhật: 🎂 @Họ tên – Vị trí, Khối (mỗi người 1 dòng)' },
  { key: '{{soluong_chu}}', desc: 'Số người bằng chữ (VD: hai)' },
  { key: '{{soluong}}', desc: 'Số người bằng số' },
  { key: '{{thang}}', desc: 'Tháng hiện tại' },
  { key: '{{team}}', desc: 'Tên team Teams' },
];

/** **đậm** → <b>. */
const rich = (text: string, keyBase: string) =>
  text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <b key={`${keyBase}-${i}`} className="font-bold text-white">
        {part.slice(2, -2)}
      </b>
    ) : (
      <React.Fragment key={`${keyBase}-${i}`}>{part}</React.Fragment>
    ),
  );

const Mention: React.FC<{ children: React.ReactNode }> = ({ children }) => <span className="text-[#7f85f5] hover:underline cursor-pointer">{children}</span>;

export const TeamsBirthdayPost: React.FC<{ cfg: BoxConfig; people: MarcomEmployee[] }> = ({ cfg, people }) => {
  const today = new Date();
  const skip = people.length === 0 && cfg.emptyMode === 'hide';
  const fill = (t: string) =>
    t
      .replace(/\{\{thang\}\}/g, String(today.getMonth() + 1))
      .replace(/\{\{soluong_chu\}\}/g, numberWord(people.length))
      .replace(/\{\{soluong\}\}/g, String(people.length))
      .replace(/\{\{team\}\}/g, cfg.teamsTeam);

  const body = people.length === 0 ? cfg.emptyText : cfg.teamsBody;

  return (
    <div className="rounded-[6px] bg-[#1f1f1f] border border-[#3d3d3d] overflow-hidden font-[Segoe_UI,system-ui,sans-serif]">
      {/* Thanh kênh */}
      <div className="flex items-center gap-2 px-4 h-10 bg-[#292929] border-b border-[#3d3d3d] text-[13px]">
        <span className="w-6 h-6 rounded-[4px] bg-[#6b6b6b] text-white text-[10px] font-bold flex items-center justify-center">{initialsOf(cfg.teamsTeam).toLowerCase()}</span>
        <span className="font-semibold text-white">{cfg.teamsTeam}</span>
        <span className="text-[#8a8a8a]">›</span>
        <span className="text-[#d6d6d6]">{cfg.teamsChannel}</span>
      </div>

      <div className="p-4">
        {skip ? (
          <div className="text-center text-[12px] text-[#8a8a8a] py-6">Hôm nay không có sinh nhật → bot không đăng bài.</div>
        ) : (
          <div className="flex gap-3">
            <SenderAvatar />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-[12px]">
                <span className="font-semibold text-white">{TEAMS_SENDER.name}</span>
                <span className="px-1 rounded-[3px] bg-[#3d3e66] text-[10px] font-semibold text-[#c5c7fa]">Ứng dụng</span>
                <span className="text-[#8a8a8a]">{cfg.teamsPostTime}</span>
              </div>

              <div className="mt-1 rounded-[6px] bg-[#292929] px-4 py-3 text-[14px] leading-[1.55] text-[#d6d6d6]">
                {/* Dòng tiêu đề */}
                <p className="font-bold text-white">
                  {fill(cfg.teamsHeader)}
                  {cfg.teamsMentionAll && (
                    <>
                      {' '}
                      <Mention>{cfg.teamsTeam}</Mention>
                    </>
                  )}
                </p>
                <div className="h-3" />

                {/* Nội dung */}
                {fill(body)
                  .split('\n')
                  .map((line, i) =>
                    line.trim() === '{{danhsach}}' ? (
                      <div key={i}>
                        {people.map((e) => (
                          <p key={e.id}>
                            🎂 <Mention>{e.name}</Mention> – {e.position}, {e.division}
                          </p>
                        ))}
                      </div>
                    ) : line.trim() === '' ? (
                      <div key={i} className="h-3" />
                    ) : (
                      <p key={i}>{rich(line, `l${i}`)}</p>
                    ),
                  )}

                {/* Ảnh thiệp */}
                {cfg.teamsAttachCard && people.length > 0 && (
                  <div className="mt-3">
                    <BirthdayCardImage cfg={cfg} people={people} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/** Ảnh thiệp sinh nhật tự ghép: nền (MarCom / mặc định) + polaroid từng người (ảnh Employee, họ tên, Vị trí - Khối). */
export const BirthdayCardImage: React.FC<{ cfg: BoxConfig; people: MarcomEmployee[]; size?: number }> = ({ cfg, people, size = 260 }) => {
  const shown = people.slice(0, 4);
  const pw = shown.length <= 2 ? 92 : 70; // độ rộng polaroid
  return (
    <div className="relative overflow-hidden rounded-[6px] shadow-md select-none" style={{ width: size, height: size }}>
      {cfg.cardBgUrl ? (
        <img src={cfg.cardBgUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div
          className="absolute inset-0 bg-[#ef3b2d]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)', backgroundSize: '16px 16px' }}
        >
          <span className="absolute top-2 left-2 px-1.5 py-px rounded-[2px] bg-white/90 text-[8px] font-black text-[#ef3b2d] leading-tight">
            VTX Group
          </span>
          <span className="absolute top-[42px] right-4 text-[22px] rotate-12">🥳</span>
          <span className="absolute bottom-1 left-2 text-[20px]">🎉</span>
          <span className="absolute bottom-1 right-2 text-[22px]">🎁</span>
          <div className="absolute top-[18px] left-0 right-0 text-center">
            <span className="inline-block px-2 bg-[#ffd400] text-[#ef3b2d] text-[15px] font-black leading-tight">HAPPY</span>
            <div className="text-white text-[30px] font-black leading-none drop-shadow-[0_2px_0_rgba(0,0,0,.25)]">Birthday!</div>
          </div>
        </div>
      )}
      <div className="absolute left-0 right-0 bottom-[30px] flex flex-wrap justify-center gap-1.5 px-2">
        {shown.map((e, i) => (
          <div key={e.id} className="bg-white p-1 pb-1.5 shadow-md" style={{ width: pw, transform: `rotate(${i % 2 ? 3 : -3}deg)` }}>
            {e.photoUrl ? (
              <img src={e.photoUrl} alt={e.name} className="w-full aspect-square object-cover" />
            ) : (
              <div className="w-full aspect-square bg-slate-200 flex items-center justify-center text-[9px] text-slate-500">Chưa có ảnh</div>
            )}
            <div className="mt-0.5 text-center text-[8px] font-bold text-slate-800 leading-tight truncate">{e.name}</div>
            <div className="text-center text-[6.5px] text-slate-500 leading-tight truncate">
              {e.position} - {e.division}
            </div>
          </div>
        ))}
      </div>
      {people.length > 4 && <span className="absolute bottom-2 left-1/2 -translate-x-1/2 px-1.5 rounded-full bg-white/90 text-[9px] font-bold text-[#ef3b2d]">+{people.length - 4} người</span>}
    </div>
  );
};
