/**
 * Luật thuần cho popup Gửi mail tuyển dụng: map loại mail → template, thay biến, đọc số tiền bằng chữ,
 * tách ngày phỏng vấn từ eventId lịch Outlook.
 */
import { MailKind, MailLog, MailTemplate, Stage } from '../../recruitment/rc/rcData';

export const isInterviewKind = (k: MailKind) => k.startsWith('Mời phỏng vấn');
export const isOfferKind = (k: MailKind) => k.startsWith('Offer Letter');
export const isThankKind = (k: MailKind) => k.startsWith('Thư cảm ơn');
export const roundOf = (k: MailKind) => (k.includes('Vòng 2') ? 2 : 1);
export const isStaffingKind = (k: MailKind) => k.includes('(Staffing)');

/** Loại mail bắt buộc chọn lượt ứng tuyển (trừ 2 thư cảm ơn). */
export const needsApplication = (k: MailKind) => !isThankKind(k);

export const templateCodeOf = (k: MailKind): string => {
  if (isInterviewKind(k)) return `RECRUITMENT_INTERVIEW_R${roundOf(k)}${isStaffingKind(k) ? '_STAFFING' : ''}`;
  if (isOfferKind(k)) return 'RECRUITMENT_OFFER_LETTER';
  if (k === 'Thư cảm ơn - fail CV') return 'RECRUITMENT_THANKYOU_CV';
  if (k === 'Thư cảm ơn - fail phỏng vấn') return 'RECRUITMENT_THANKYOU_INTERVIEW';
  if (k === 'Báo hủy Onboard sang HCNS') return 'RECRUITMENT_CANCEL_ONBOARD';
  return 'RECRUITMENT_HCNS_HANDOFF';
};

/** Template đang bật; Staffing thiếu → dùng mẫu thường + đổi tiền tố "[VTX Group - Aequitas]". */
export const resolveTemplate = (k: MailKind, templates: MailTemplate[]): MailTemplate | null => {
  const code = templateCodeOf(k);
  const t = templates.find((x) => x.code === code && x.active);
  if (t) return t;
  if (isInterviewKind(k) && isStaffingKind(k)) {
    const base = templates.find((x) => x.code === code.replace('_STAFFING', '') && x.active);
    if (base) return { ...base, title: base.title.replace('[VTX Group]', '[VTX Group - Aequitas]') };
  }
  if (k === 'Báo hủy Onboard sang HCNS')
    return {
      code, name: 'Báo hủy Onboard (nội dung dự phòng)', channel: 'Email', active: true, parameters: '',
      title: '[iMIS] Báo hủy Onboard - Ứng viên {CandidateName}',
      content: '<p>Kính gửi Phòng Hành chính - Nhân sự,</p><p>Ứng viên <b>{CandidateName}</b> đã từ chối / hủy nhận việc vị trí {Position} ({RequestCode}).</p><p>Lý do: {CancelReason}</p><p>Ghi chú: {CancelNote}</p><p>Trân trọng,<br/>{TaName}</p>',
    };
  return null;
};

export const fillVars = (text: string, vars: Record<string, string>) => text.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

/** Stage sau khi gửi thành công (null = không đổi). */
export const stageAfter = (k: MailKind, failStage: Stage): Stage | null => {
  if (isInterviewKind(k)) return roundOf(k) === 2 ? 'Intv 2_Schedule' : 'Intv 1_Schedule';
  if (isOfferKind(k)) return 'Offering';
  if (isThankKind(k)) return failStage;
  if (k === 'Báo hủy Onboard sang HCNS') return 'Offer Rejected';
  return null;
};

// --------------------------------------------------------------------------
// Lịch phỏng vấn (eventId = evt-<applicationId>-r<round>-<yyyy-mm-ddTHH:mm>)
// --------------------------------------------------------------------------
export const makeEventId = (appId: string, round: number, date: string, time: string) => `evt-${appId || 'x'}-r${round}-${date}T${time}`;
export const eventDate = (m: MailLog): Date | null => {
  const hit = m.eventId?.match(/(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})$/);
  return hit ? new Date(hit[1]) : null;
};
export const isPastInterview = (m: MailLog) => {
  const d = eventDate(m);
  return !!d && d.getTime() < Date.now();
};
/** Lời mời còn hiệu lực = lời mời mới nhất cùng lượt + cùng vòng, chưa huỷ. */
export const isLatestInvite = (m: MailLog, all: MailLog[]) =>
  !all.some((x) => x.id !== m.id && x.kind === m.kind && x.applicationId === m.applicationId && x.ok && x.sentAt > m.sentAt);
export const activeInvites = (all: MailLog[], candidateId: string, applicationId?: string) =>
  all.filter(
    (m) => m.candidateId === candidateId && isInterviewKind(m.kind) && m.ok && !m.cancelled && !!m.eventId && (!applicationId || m.applicationId === applicationId) && !isPastInterview(m) && isLatestInvite(m, all),
  );

// --------------------------------------------------------------------------
// Đọc số tiền bằng chữ
// --------------------------------------------------------------------------
const VI = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const vi3 = (n: number, full: boolean) => {
  const h = Math.floor(n / 100), t = Math.floor((n % 100) / 10), u = n % 10;
  const out: string[] = [];
  if (h > 0 || full) out.push(`${VI[h]} trăm`);
  if (t === 0) {
    if (u > 0 && (h > 0 || full)) out.push('linh');
  } else out.push(t === 1 ? 'mười' : `${VI[t]} mươi`);
  if (u > 0) out.push(u === 1 && t > 1 ? 'mốt' : u === 5 && t > 0 ? 'lăm' : VI[u]);
  return out.join(' ');
};
export const viMoneyWords = (v: number | ''): string => {
  if (v === '' || !v || v <= 0) return '';
  const units = ['', ' nghìn', ' triệu', ' tỷ'];
  const groups: number[] = [];
  let x = Math.floor(v);
  while (x > 0) {
    groups.push(x % 1000);
    x = Math.floor(x / 1000);
  }
  const parts: string[] = [];
  for (let i = groups.length - 1; i >= 0; i--) if (groups[i]) parts.push(vi3(groups[i], i < groups.length - 1) + units[i % 4]);
  const s = parts.join(' ');
  return `${s.charAt(0).toUpperCase()}${s.slice(1)} đồng`;
};

const EN1 = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const EN10 = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const en3 = (n: number) => {
  const h = Math.floor(n / 100), r = n % 100;
  const out: string[] = [];
  if (h) out.push(`${EN1[h]} hundred`);
  if (r) out.push(r < 20 ? EN1[r] : `${EN10[Math.floor(r / 10)]}${r % 10 ? `-${EN1[r % 10]}` : ''}`);
  return out.join(' ');
};
export const enMoneyWords = (v: number | ''): string => {
  if (v === '' || !v || v <= 0) return '';
  const units = ['', ' thousand', ' million', ' billion'];
  const parts: string[] = [];
  let x = Math.floor(v), i = 0;
  while (x > 0) {
    const g = x % 1000;
    if (g) parts.unshift(en3(g) + units[i]);
    x = Math.floor(x / 1000);
    i++;
  }
  const s = parts.join(' ');
  return `${s.charAt(0).toUpperCase()}${s.slice(1)} Vietnam dong`;
};

/** Email công ty giả lập từ họ tên (tên + chữ cái đầu họ/đệm). */
export const staffEmail = (name: string) => {
  const p = name.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase().split(/\s+/).filter(Boolean);
  return p.length ? `${p[p.length - 1]}${p.slice(0, -1).map((s) => s[0]).join('')}@vtxgroup.vn` : '';
};

export const enDate = (iso: string) => {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  return `${d.toLocaleDateString('en-US', { weekday: 'long' })}, ${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
};
