/**
 * Email store (mock) — mẫu email + lịch sử gửi cho ứng viên.
 *  - 3 loại: Lịch phỏng vấn, Thư từ chối, Offer letter.
 *  - Mẫu có biến động {{...}} thay bằng dữ liệu ứng viên khi soạn.
 *  - "Gửi" là mock: ghi vào lịch sử (chưa gửi thật). Thay bằng gọi API sau.
 */
import React, { createContext, useContext, useMemo, useState } from 'react';

export type EmailType = 'interview' | 'thanks' | 'offer' | 'hr';

export const EMAIL_TYPES: { type: EmailType; label: string }[] = [
  { type: 'interview', label: 'Mail phỏng vấn' },
  { type: 'thanks', label: 'Mail cảm ơn' },
  { type: 'offer', label: 'Mail offer letter' },
  { type: 'hr', label: 'Gửi thông tin sang HCNS' },
];

export const emailTypeLabel = (t: EmailType) => EMAIL_TYPES.find((e) => e.type === t)?.label || t;

export interface EmailTemplate {
  subject: string;
  body: string;
}

export interface SentEmail {
  id: string;
  candidateId: string;
  candidateName: string;
  type: EmailType;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  sentBy: string;
}

// Các biến động dùng trong mẫu
export const EMAIL_PLACEHOLDERS: { key: string; desc: string }[] = [
  { key: '{{ten}}', desc: 'Tên ứng viên' },
  { key: '{{vitri}}', desc: 'Vị trí ứng tuyển' },
  { key: '{{idrequest}}', desc: 'Mã yêu cầu tuyển dụng' },
  { key: '{{email}}', desc: 'Email ứng viên' },
  { key: '{{sdt}}', desc: 'Số điện thoại ứng viên' },
  { key: '{{thoigian}}', desc: 'Thời gian phỏng vấn' },
  { key: '{{diadiem}}', desc: 'Địa điểm phỏng vấn' },
  { key: '{{nguoiPV}}', desc: 'Người phỏng vấn' },
  { key: '{{luong}}', desc: 'Mức lương offer' },
  { key: '{{ngaynhanviec}}', desc: 'Ngày nhận việc' },
];

const DEFAULT_TEMPLATES: Record<EmailType, EmailTemplate> = {
  interview: {
    subject: 'Thư mời phỏng vấn vị trí {{vitri}}',
    body: `Kính gửi {{ten}},

Cảm ơn bạn đã ứng tuyển vị trí {{vitri}} ({{idrequest}}) tại công ty chúng tôi.
Chúng tôi trân trọng mời bạn tham dự buổi phỏng vấn:

• Thời gian: {{thoigian}}
• Địa điểm: {{diadiem}}
• Người phỏng vấn: {{nguoiPV}}

Vui lòng phản hồi email này để xác nhận lịch. Rất mong được gặp bạn.

Trân trọng,
Phòng Tuyển dụng`,
  },
  thanks: {
    subject: 'Cảm ơn bạn đã ứng tuyển vị trí {{vitri}}',
    body: `Kính gửi {{ten}},

Cảm ơn bạn đã quan tâm và dành thời gian ứng tuyển vị trí {{vitri}} tại công ty chúng tôi.
Chúng tôi đã nhận được hồ sơ của bạn và sẽ phản hồi trong thời gian sớm nhất.

Một lần nữa cảm ơn bạn. Chúc bạn nhiều sức khỏe và thành công.

Trân trọng,
Phòng Tuyển dụng`,
  },
  offer: {
    subject: 'Thư mời nhận việc (Offer) - {{vitri}}',
    body: `Kính gửi {{ten}},

Chúc mừng! Chúng tôi vui mừng gửi đến bạn thư mời nhận việc cho vị trí {{vitri}} ({{idrequest}}).

• Mức lương: {{luong}}
• Ngày nhận việc dự kiến: {{ngaynhanviec}}

Vui lòng phản hồi email này để xác nhận trước ngày nhận việc. Chào mừng bạn gia nhập đội ngũ!

Trân trọng,
Phòng Tuyển dụng`,
  },
  hr: {
    subject: 'Bàn giao thông tin ứng viên {{ten}} - {{vitri}}',
    body: `Kính gửi Phòng Hành chính - Nhân sự,

Phòng Tuyển dụng bàn giao thông tin ứng viên đã trúng tuyển để phối hợp onboard:

• Họ và tên: {{ten}}
• Vị trí: {{vitri}} ({{idrequest}})
• Email: {{email}}
• Điện thoại: {{sdt}}
• Ngày nhận việc dự kiến: {{ngaynhanviec}}

Vui lòng phối hợp chuẩn bị thủ tục tiếp nhận. Trân trọng cảm ơn.

Trân trọng,
Phòng Tuyển dụng`,
  },
};

// Thay biến động {{key}} bằng giá trị (bỏ trống nếu không có)
export function fillTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{(\w+)\}\}/g, (_, k) => (vars[k] ?? '').toString());
}

interface EmailContextValue {
  templates: Record<EmailType, EmailTemplate>;
  updateTemplate: (type: EmailType, tpl: EmailTemplate) => void;
  sent: SentEmail[];
  sendEmail: (mail: Omit<SentEmail, 'id' | 'sentAt' | 'sentBy'>) => void;
  sentForCandidate: (candidateId: string) => SentEmail[];
}

const EmailContext = createContext<EmailContextValue | null>(null);

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [templates, setTemplates] = useState<Record<EmailType, EmailTemplate>>(() => ({ ...DEFAULT_TEMPLATES }));
  const [sent, setSent] = useState<SentEmail[]>([]);

  const updateTemplate: EmailContextValue['updateTemplate'] = (type, tpl) => {
    setTemplates((prev) => ({ ...prev, [type]: tpl }));
  };

  const sendEmail: EmailContextValue['sendEmail'] = (mail) => {
    const now = new Date();
    const stamp = now.toLocaleString('vi-VN', { hour12: false });
    setSent((prev) => [
      { ...mail, id: `MAIL-${now.getTime()}`, sentAt: stamp, sentBy: 'Phòng Tuyển dụng' },
      ...prev,
    ]);
  };

  const sentForCandidate = (candidateId: string) => sent.filter((m) => m.candidateId === candidateId);

  const value = useMemo<EmailContextValue>(
    () => ({ templates, updateTemplate, sent, sendEmail, sentForCandidate }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [templates, sent],
  );

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};

export function useEmail(): EmailContextValue {
  const ctx = useContext(EmailContext);
  if (!ctx) throw new Error('useEmail must be used within an EmailProvider');
  return ctx;
}
