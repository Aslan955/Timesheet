/**
 * Song ngữ VI/EN cho module MarCom — dùng chung ngôn ngữ toàn app (LanguageContext, lưu localStorage 'app_language').
 * Chỉ dịch giao diện; nội dung MarCom tự nhập (tiêu đề/nội dung mail, bài Teams, lời chúc, banner) giữ nguyên.
 */
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../i18n/translations';
import { EMPLOYEE_STATUS_LABEL, EmployeeStatus, MAIL_PLACEHOLDERS, WEEKDAY_LONG, WEEKDAY_SHORT } from './marcomData';

const WEEKDAY_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEKDAY_LONG_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const EMPLOYEE_STATUS_LABEL_EN: Record<EmployeeStatus, string> = {
  Working: 'Working',
  Resigned: 'Resigned',
  'Cancel Onboard': 'Cancel Onboard',
};
// đồng bộ code iMIS 05/11 — biến {PascalCase} như MarcomPlaceholders
const PLACEHOLDER_DESC_EN: Record<string, string> = {
  '{EmployeeName}': 'Full name',
  '{Division}': 'Division',
  '{Position}': 'Position',
  '{BirthDate}': 'Date of birth (dd/MM)',
  '{OnboardDate}': 'Onboard date (dd/MM/yyyy)',
};
/** Ghi chú hệ thống sinh ra trong lịch sử gửi / dữ liệu mẫu (không phải nội dung người dùng nhập). */
// đồng bộ code iMIS 05/11 — ghi chú nhật ký chỉ "Gửi thử" hoặc lỗi gửi
const SYSTEM_NOTE_EN: Record<string, string> = {
  'Gửi thử': 'Test send',
  'Nhân sự đã nghỉ việc': 'Employee has resigned',
  'Mailbox không tồn tại (550 5.1.1)': 'Mailbox does not exist (550 5.1.1)',
  'Máy chủ mail tạm thời không phản hồi (421)': 'Mail server temporarily unavailable (421)',
  'Ứng viên từ chối offer, nhận việc nơi khác': 'Candidate declined the offer and joined another company',
  'Ứng viên không đến nhận việc, không liên lạc được': 'Candidate did not show up and cannot be reached',
  'Ứng viên xin lùi 1 ngày do bàn giao việc cũ': 'Candidate asked to postpone 1 day to hand over previous job',
};

export const useMarcomLang = () => {
  const { language, setLanguage } = useLanguage();
  const en = language === 'en';
  return {
    lang: language as Language,
    en,
    setLanguage,
    /** tr('Lưu', 'Save') — chọn bản theo ngôn ngữ hiện tại; dùng được cho cả chuỗi lẫn JSX. */
    tr: <T,>(vi: T, enText: T): T => (en ? enText : vi),
    wdShort: en ? WEEKDAY_SHORT_EN : WEEKDAY_SHORT,
    wdLong: en ? WEEKDAY_LONG_EN : WEEKDAY_LONG,
    statusLabel: (s: EmployeeStatus) => (en ? EMPLOYEE_STATUS_LABEL_EN : EMPLOYEE_STATUS_LABEL)[s],
    placeholders: MAIL_PLACEHOLDERS.map((p) => ({ ...p, desc: en ? PLACEHOLDER_DESC_EN[p.key] ?? p.desc : p.desc })),
    /** Dịch ghi chú hệ thống; chuỗi lạ (người dùng nhập) giữ nguyên. "Gửi thử: lỗi" dịch phần đầu. */
    note: (s: string | undefined) => {
      if (!s || !en) return s;
      if (SYSTEM_NOTE_EN[s]) return SYSTEM_NOTE_EN[s];
      const i = s.indexOf(': ');
      return i > 0 && SYSTEM_NOTE_EN[s.slice(0, i)] ? `${SYSTEM_NOTE_EN[s.slice(0, i)]}: ${SYSTEM_NOTE_EN[s.slice(i + 2)] ?? s.slice(i + 2)}` : s;
    },
  };
};
