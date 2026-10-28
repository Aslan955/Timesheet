/**
 * Store module Tuyển dụng (bám code iMIS) — dùng chung cho Yêu cầu tuyển dụng, Quản lý ứng viên,
 * Danh mục tuyển dụng, Mẫu email và Bàn giao onboard.
 */
import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import {
  RcRequest, RcCandidate, RcApplication, CatalogItem, CatalogType, MailLog, BizLog, MailTemplate, Stage, HrInfo,
  SEED_REQUESTS, SEED_CANDIDATES, SEED_APPLICATIONS, SEED_CATALOG, SEED_MAIL_LOGS, SEED_LOGS, SEED_TEMPLATES,
  HIRED_STAGES, WISHLIST_STAGES, CURRENT_TA, genRequestCode, genCandidateCode, nowIso, todayIso, norm, CATALOG_LABEL,
} from './rcData';

export interface RequestStats {
  candidateCount: number;
  hired: number;
  wishlist: number;
  remaining: number | null;
  onboarded: number;
  official: number;
}

export interface DraftApp {
  requestId: string;
  stage: Stage;
}

/** Mở thẳng 1 bản ghi khi chuyển màn (prototype định tuyến theo tên menu, không có URL). */
export type RcFocus = { screen: 'request' | 'candidate'; id: string; mode?: 'view' | 'edit' | 'create' } | null;

interface RcValue {
  focus: RcFocus;
  setFocus: (f: RcFocus) => void;
  requests: RcRequest[];
  candidates: RcCandidate[];
  applications: RcApplication[];
  catalog: CatalogItem[];
  mailLogs: MailLog[];
  logs: BizLog[];
  templates: MailTemplate[];
  // tra cứu
  request: (id: string) => RcRequest | undefined;
  requestByCode: (code: string) => RcRequest | undefined;
  candidate: (id: string) => RcCandidate | undefined;
  appsOfCandidate: (candidateId: string) => RcApplication[];
  appsOfRequest: (requestId: string) => RcApplication[];
  stats: (requestId: string) => RequestStats;
  /** Tên các phần tử đang sử dụng (sắp Priority, Name); giữ giá trị đang chọn dù đã tắt. */
  options: (type: CatalogType, keep?: string[]) => string[];
  isDeactivated: (type: CatalogType, name: string) => boolean;
  emailTaken: (email: string, excludeId?: string) => RcCandidate | undefined;
  // ghi
  saveRequest: (r: RcRequest) => RcRequest;
  deleteRequest: (id: string) => void;
  saveCandidate: (c: RcCandidate, draftApps: DraftApp[] | null) => RcCandidate;
  deleteCandidate: (id: string) => void;
  updateNote: (candidateId: string, note: string) => void;
  setCandidateStage: (candidateId: string, stage: Stage) => void;
  /** Liên kết ứng viên ↔ hồ sơ nhân sự (RecruitmentHrLink) — đổi khi HCNS duyệt / TA báo huỷ. */
  setCandidateHr: (candidateId: string, hr: HrInfo) => void;
  assign: (candidateId: string, requestId: string) => string | null;
  unassign: (applicationId: string) => void;
  setAppStage: (applicationId: string, stage: Stage, syncCandidate?: boolean) => void;
  saveCatalog: (item: CatalogItem) => Record<string, string>;
  deleteCatalog: (id: string) => string | null;
  addMail: (m: Omit<MailLog, 'id' | 'sentAt' | 'sentBy'>) => MailLog;
  cancelInterview: (mailId: string, reason: string) => void;
  saveTemplate: (t: MailTemplate) => void;
  importCandidates: (rows: Partial<RcCandidate>[]) => { accepted: number; skipped: number; errors: string[]; duplicates: string[] };
}

const RcContext = createContext<RcValue | null>(null);
let seq = 1000;
const uid = (p: string) => `${p}${++seq}`;

export const RcProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [candidates, setCandidates] = useState(SEED_CANDIDATES);
  const [applications, setApplications] = useState(SEED_APPLICATIONS);
  const [catalog, setCatalog] = useState(SEED_CATALOG);
  const [mailLogs, setMailLogs] = useState(SEED_MAIL_LOGS);
  const [logs, setLogs] = useState(SEED_LOGS);
  const [templates, setTemplates] = useState(SEED_TEMPLATES);
  const [focus, setFocus] = useState<RcFocus>(null);

  // ref để các hàm ghi luôn đọc state mới nhất
  const ref = useRef({ requests, candidates, applications, catalog });
  ref.current = { requests, candidates, applications, catalog };

  const log = (entity: BizLog['entity'], entityId: string, action: string, changes?: BizLog['changes']) =>
    setLogs((l) => [...l, { id: uid('l'), entity, entityId, at: nowIso(), by: CURRENT_TA, action, changes }]);

  const reqCode = (requestId: string) => ref.current.requests.find((r) => r.id === requestId)?.code || requestId;

  const value = useMemo<RcValue>(() => {
    const request = (id: string) => requests.find((r) => r.id === id);
    const appsOfRequest = (requestId: string) => applications.filter((a) => a.requestId === requestId).sort((a, b) => a.appliedDate.localeCompare(b.appliedDate));
    const appsOfCandidate = (candidateId: string) =>
      applications.filter((a) => a.candidateId === candidateId).sort((a, b) => (b.stageChangedAt || b.appliedDate).localeCompare(a.stageChangedAt || a.appliedDate));

    const stats = (requestId: string): RequestStats => {
      const r = request(requestId);
      const apps = appsOfRequest(requestId);
      const hired = apps.filter((a) => HIRED_STAGES.includes(a.stage)).length;
      const onb = apps.filter((a) => a.stage === 'Onboarded');
      return {
        candidateCount: apps.length,
        hired,
        wishlist: apps.filter((a) => WISHLIST_STAGES.includes(a.stage)).length,
        remaining: r && r.headcount !== '' ? Number(r.headcount) - hired : null,
        onboarded: onb.length,
        official: onb.filter((a) => candidates.find((c) => c.id === a.candidateId)?.hr.status === 'OfficialEmployee').length,
      };
    };

    const options = (type: CatalogType, keep: string[] = []) => {
      const items = catalog.filter((c) => c.type === type).sort((a, b) => a.priority - b.priority || a.name.localeCompare(b.name, 'vi'));
      const active = items.filter((c) => c.isActive).map((c) => c.name);
      const extra = keep.filter((k) => k && !active.includes(k));
      return [...active, ...extra];
    };
    const isDeactivated = (type: CatalogType, name: string) => !!name && !catalog.some((c) => c.type === type && c.name === name && c.isActive);

    const emailTaken = (email: string, excludeId?: string) =>
      email.trim() ? candidates.find((c) => c.id !== excludeId && c.email.trim().toLowerCase() === email.trim().toLowerCase()) : undefined;

    const saveRequest = (r: RcRequest): RcRequest => {
      if (r.id) {
        const prev = ref.current.requests.find((x) => x.id === r.id);
        setRequests((list) => list.map((x) => (x.id === r.id ? r : x)));
        log('request', r.id, 'Cập nhật yêu cầu tuyển dụng', prev ? diffObj(prev, r) : undefined);
        return r;
      }
      const saved: RcRequest = { ...r, id: uid('rq'), code: genRequestCode(r.block, r.dateReceived, ref.current.requests), createdBy: CURRENT_TA, createdAt: nowIso() };
      setRequests((list) => [saved, ...list]);
      log('request', saved.id, 'Tạo yêu cầu tuyển dụng');
      return saved;
    };

    const deleteRequest = (id: string) => {
      setRequests((list) => list.filter((x) => x.id !== id));
      setApplications((list) => list.filter((a) => a.requestId !== id));
    };

    const saveCandidate = (c: RcCandidate, draftApps: DraftApp[] | null): RcCandidate => {
      const isNew = !c.id;
      const saved: RcCandidate = isNew ? { ...c, id: uid('c'), code: genCandidateCode(ref.current.candidates), createdBy: CURRENT_TA } : c;
      if (isNew) setCandidates((list) => [saved, ...list]);
      else {
        const prev = ref.current.candidates.find((x) => x.id === c.id);
        setCandidates((list) => list.map((x) => (x.id === c.id ? saved : x)));
        const ch = prev ? diffObj(prev, saved) : [];
        if (ch.length) log('candidate', saved.id, 'Cập nhật hồ sơ ứng viên', ch);
      }
      if (isNew) log('candidate', saved.id, 'Tạo hồ sơ ứng viên');
      // null = form không đụng tới lượt ứng tuyển → giữ nguyên; [] = gỡ hết
      if (draftApps) {
        const cur = ref.current.applications.filter((a) => a.candidateId === saved.id);
        const keepIds = draftApps.map((d) => d.requestId);
        const removed = cur.filter((a) => !keepIds.includes(a.requestId));
        const added = draftApps.filter((d) => !cur.some((a) => a.requestId === d.requestId));
        setApplications((list) => [
          ...list.filter((a) => !(a.candidateId === saved.id && !keepIds.includes(a.requestId))).map((a) => {
            const d = a.candidateId === saved.id ? draftApps.find((x) => x.requestId === a.requestId) : undefined;
            return d && d.stage !== a.stage ? { ...a, stage: d.stage, stageChangedAt: nowIso() } : a;
          }),
          ...added.map((d) => ({ id: uid('a'), candidateId: saved.id, requestId: d.requestId, stage: d.stage, appliedDate: todayIso(), stageChangedAt: nowIso(), addedBy: CURRENT_TA })),
        ]);
        added.forEach((d) => log('candidate', saved.id, 'Gán yêu cầu tuyển dụng', [{ field: 'Yêu cầu tuyển dụng', from: '', to: reqCode(d.requestId) }]));
        removed.forEach((a) => log('candidate', saved.id, 'Gỡ yêu cầu tuyển dụng', [{ field: 'Yêu cầu tuyển dụng', from: reqCode(a.requestId), to: '' }]));
      }
      return saved;
    };

    const deleteCandidate = (id: string) => {
      setCandidates((list) => list.filter((x) => x.id !== id));
      setApplications((list) => list.filter((a) => a.candidateId !== id));
    };

    const updateNote = (candidateId: string, note: string) => {
      const prev = ref.current.candidates.find((c) => c.id === candidateId);
      setCandidates((list) => list.map((c) => (c.id === candidateId ? { ...c, note } : c)));
      log('candidate', candidateId, 'Sửa ghi chú', [{ field: 'Ghi chú', from: prev?.note || '', to: note }]);
    };

    const setCandidateStage = (candidateId: string, stage: Stage) => {
      const prev = ref.current.candidates.find((c) => c.id === candidateId);
      if (!prev || prev.stage === stage) return;
      setCandidates((list) => list.map((c) => (c.id === candidateId ? { ...c, stage } : c)));
      log('candidate', candidateId, 'Đổi vòng tuyển dụng (tổng)', [{ field: 'Vòng tuyển dụng', from: prev.stage, to: stage }]);
    };

    const setCandidateHr = (candidateId: string, hr: HrInfo) => setCandidates((list) => list.map((c) => (c.id === candidateId ? { ...c, hr } : c)));

    const assign = (candidateId: string, requestId: string): string | null => {
      const r = ref.current.requests.find((x) => x.id === requestId);
      if (!r || r.status !== 'Đang tuyển') return 'Chỉ cho phép gán ứng viên khi yêu cầu tuyển dụng ở trạng thái Đang tuyển';
      if (ref.current.applications.some((a) => a.candidateId === candidateId && a.requestId === requestId)) return 'Ứng viên đã được gán vào yêu cầu này';
      setApplications((list) => [...list, { id: uid('a'), candidateId, requestId, stage: 'New', appliedDate: todayIso(), stageChangedAt: nowIso(), addedBy: CURRENT_TA }]);
      log('candidate', candidateId, 'Gán yêu cầu tuyển dụng', [{ field: 'Yêu cầu tuyển dụng', from: '', to: r.code }]);
      return null;
    };

    const unassign = (applicationId: string) => {
      const a = ref.current.applications.find((x) => x.id === applicationId);
      if (!a) return;
      setApplications((list) => list.filter((x) => x.id !== applicationId));
      log('candidate', a.candidateId, 'Gỡ yêu cầu tuyển dụng', [{ field: 'Yêu cầu tuyển dụng', from: reqCode(a.requestId), to: '' }]);
    };

    const setAppStage = (applicationId: string, stage: Stage, syncCandidate = true) => {
      const a = ref.current.applications.find((x) => x.id === applicationId);
      if (!a || a.stage === stage) return;
      setApplications((list) => list.map((x) => (x.id === applicationId ? { ...x, stage, stageChangedAt: nowIso() } : x)));
      log('candidate', a.candidateId, 'Đổi vòng tuyển dụng', [{ field: `Vòng (${reqCode(a.requestId)})`, from: a.stage, to: stage }]);
      if (syncCandidate) setCandidates((list) => list.map((c) => (c.id === a.candidateId ? { ...c, stage } : c)));
    };

    const saveCatalog = (item: CatalogItem): Record<string, string> => {
      const e: Record<string, string> = {};
      if (!item.name.trim()) e.name = 'Vui lòng nhập tên';
      if (!item.code.trim()) e.code = 'Vui lòng nhập mã';
      const same = ref.current.catalog.filter((c) => c.type === item.type && c.id !== item.id);
      if (item.name.trim() && same.some((c) => c.name.trim().toLowerCase() === item.name.trim().toLowerCase())) e.name = `Tên "${item.name.trim()}" đã tồn tại trong danh mục`;
      if (item.code.trim() && same.some((c) => c.code.trim().toLowerCase() === item.code.trim().toLowerCase())) e.code = `Mã "${item.code.trim()}" đã tồn tại trong danh mục`;
      if (Object.keys(e).length) return e;
      if (item.id) setCatalog((list) => list.map((c) => (c.id === item.id ? item : c)));
      else setCatalog((list) => [...list, { ...item, id: uid('cat') }]);
      return {};
    };

    const deleteCatalog = (id: string): string | null => {
      const it = ref.current.catalog.find((c) => c.id === id);
      if (!it) return null;
      const n = refCount(it, ref.current.candidates, ref.current.requests);
      if (n > 0) return `"${it.name}" đang được ${n} bản ghi sử dụng nên không xoá được. Hãy bỏ tick Đang sử dụng để ẩn khỏi ô chọn.`;
      setCatalog((list) => list.filter((c) => c.id !== id));
      return null;
    };

    const addMail = (m: Omit<MailLog, 'id' | 'sentAt' | 'sentBy'>) => {
      const full: MailLog = { ...m, id: uid('m'), sentAt: nowIso(), sentBy: CURRENT_TA };
      setMailLogs((l) => [...l, full]);
      return full;
    };

    const cancelInterview = (mailId: string, reason: string) => {
      const m = mailLogs.find((x) => x.id === mailId);
      if (!m) return;
      setMailLogs((l) => [
        ...l.map((x) => (x.id === mailId ? { ...x, cancelled: true } : x)),
        { ...m, id: uid('m'), kind: 'Đã huỷ lịch phỏng vấn', subject: `Huỷ lịch phỏng vấn – ${m.kind.replace('Mời phỏng vấn - ', '')}`, body: `Lý do: ${reason}`, sentAt: nowIso(), sentBy: CURRENT_TA, attachments: [], eventId: undefined },
      ]);
      if (reason === 'Ứng viên từ chối') {
        setApplications((list) => list.map((a) => (a.id === m.applicationId ? { ...a, stage: 'Not Interested', stageChangedAt: nowIso() } : a)));
        setCandidates((list) => list.map((c) => (c.id === m.candidateId ? { ...c, stage: 'Not Interested' } : c)));
      }
    };

    const saveTemplate = (t: MailTemplate) => setTemplates((list) => list.map((x) => (x.code === t.code ? t : x)));

    const importCandidates: RcValue['importCandidates'] = (rows) => {
      const errors: string[] = [];
      const duplicates: string[] = [];
      const ok: RcCandidate[] = [];
      const known = [...ref.current.candidates];
      rows.forEach((row, i) => {
        const line = i + 2;
        const miss = (
          [
            ['fullName', 'Họ và tên'], ['email', 'Email'], ['university', 'Trường đại học'], ['major', 'Chuyên ngành'],
            ['currentPosition', 'Vị trí hiện tại'], ['currentCompany', 'Công ty hiện tại'], ['techStack', 'Tech Stack'],
          ] as [keyof RcCandidate, string][]
        ).find(([k]) => !String(row[k] ?? '').trim());
        if (miss) {
          errors.push(`Dòng ${line}: Thiếu "${miss[1]}"`);
          return;
        }
        const dup = known.find((c) => c.email.toLowerCase() === String(row.email).toLowerCase() || (!!row.phone && norm(c.phone).replace(/\D/g, '') === String(row.phone).replace(/\D/g, '')));
        if (dup) duplicates.push(`Dòng ${line}: Đã có hồ sơ trùng email hoặc số điện thoại: ${dup.code}`);
        const sources = options('Source');
        const c: RcCandidate = {
          ...emptyFromRow(row),
          source: sources.includes(String(row.source || '')) ? String(row.source) : 'Khác',
          inputDate: row.inputDate || todayIso(),
          id: uid('c'),
          code: genCandidateCode([...known]),
          createdBy: CURRENT_TA,
        };
        known.push(c);
        ok.push(c);
      });
      if (ok.length) setCandidates((list) => [...ok, ...list]);
      return { accepted: ok.length, skipped: errors.length, errors, duplicates };
    };

    return {
      focus, setFocus,
      requests, candidates, applications, catalog, mailLogs, logs, templates,
      request,
      requestByCode: (code) => requests.find((r) => r.code === code),
      candidate: (id) => candidates.find((c) => c.id === id),
      appsOfCandidate, appsOfRequest, stats, options, isDeactivated, emailTaken,
      saveRequest, deleteRequest, saveCandidate, deleteCandidate, updateNote, setCandidateStage, setCandidateHr, assign, unassign, setAppStage,
      saveCatalog, deleteCatalog, addMail, cancelInterview, saveTemplate, importCandidates,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests, candidates, applications, catalog, mailLogs, logs, templates, focus]);

  return <RcContext.Provider value={value}>{children}</RcContext.Provider>;
};

export function useRc(): RcValue {
  const ctx = useContext(RcContext);
  if (!ctx) throw new Error('useRc must be used within an RcProvider');
  return ctx;
}

// ==========================================================================
// Helper nội bộ
// ==========================================================================
const LABELS: Record<string, string> = {
  priority: 'Mức ưu tiên', status: 'Tình trạng', block: 'Khối', position: 'Vị trí', skill: 'Skill', level: 'Level', taPics: 'TA PIC', taSupport: 'TA Support',
  dateReceived: 'Ngày nhận', endDate: 'Ngày kết thúc', deadline: 'Deadline', headcount: 'SL cần', note: 'Ghi chú', isStaffing: 'Staffing', salary: 'Mức lương',
  workLocation: 'Địa điểm làm việc', contractType: 'Loại hợp đồng', contractDuration: 'Thời hạn hợp đồng', jobDescription: 'JD', equipment: 'Thiết bị yêu cầu',
  inputDate: 'Ngày tiếp nhận', fullName: 'Họ và tên', appliedPosition: 'Vị trí ứng tuyển', dob: 'Ngày sinh', email: 'Email', phone: 'Điện thoại', taInput: 'TA Input',
  address: 'Địa chỉ', linkedin: 'LinkedIn', source: 'Nguồn ứng viên', referrerName: 'Người refer', university: 'Trường đại học', major: 'Chuyên ngành',
  currentPosition: 'Vị trí hiện tại', currentCompany: 'Công ty hiện tại', techStack: 'Tech Stack', skills: 'Kỹ năng', cvFile: 'File CV', cvLink: 'Link CV',
};
const show = (v: unknown) => (Array.isArray(v) ? v.join(', ') : typeof v === 'boolean' ? (v ? 'Có' : 'Không') : v == null ? '' : String(v));
function diffObj<T extends object>(a: T, b: T) {
  return (Object.keys(LABELS) as (keyof T & string)[])
    .filter((k) => k in a && show(a[k]) !== show(b[k]))
    .map((k) => ({ field: LABELS[k], from: show(a[k]), to: show(b[k]) }));
}

/** Đếm tham chiếu (Candidate 5 trường + Skills + Request 3 trường). */
function refCount(it: CatalogItem, candidates: RcCandidate[], requests: RcRequest[]) {
  const n = it.name;
  switch (it.type) {
    case 'Source':
      return candidates.filter((c) => c.source === n).length;
    case 'University':
      return candidates.filter((c) => c.university === n).length;
    case 'Major':
      return candidates.filter((c) => c.major === n).length;
    case 'Position':
      return candidates.filter((c) => c.appliedPosition === n).length + requests.filter((r) => r.position === n).length;
    case 'Level':
      return requests.filter((r) => r.level === n).length;
    case 'Skill':
      return candidates.filter((c) => c.skills.includes(n)).length + requests.filter((r) => r.skill === n).length;
    default:
      return 0;
  }
}

function emptyFromRow(row: Partial<RcCandidate>): RcCandidate {
  return {
    id: '', code: '', inputDate: '', fullName: '', appliedPosition: '', dob: '', email: '', phone: '', taInput: '', address: '', linkedin: '', source: '',
    referrerName: '', university: '', major: '', currentPosition: '', currentCompany: '', techStack: '', skills: [], cvFile: '', cvLink: '', note: '',
    stage: 'New', hr: { status: 'None' }, createdBy: '',
    ...row,
  } as RcCandidate;
}

export { CATALOG_LABEL };
