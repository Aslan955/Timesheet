/**
 * WorkflowDrawer — "Các bước thực hiện": quy trình & phê duyệt PAKD hiển thị theo hàng dọc,
 * trong một ngăn kéo bên phải màn chi tiết dự án.
 *
 *  • Bấm tab "Quy trình" ở mép phải để kéo ngăn ra, bấm » để ẩn (giống menu).
 *  • Kéo mép trái của ngăn để đổi độ rộng; kéo hẹp quá thì ngăn tự ẩn.
 *  • Trạng thái mở / độ rộng được nhớ trên trình duyệt (localStorage).
 *
 * Các bước: Lập yêu cầu cấp mã → GĐK duyệt mã → PM lập & nộp PAKD → Kế toán (CFO) duyệt PAKD
 *           → Thực hiện dự án → Kết thúc. Nhánh đóng: … → PM lập & nộp PAKD → Đóng dự án.
 */
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, CheckCircle2, ChevronLeft, ChevronsRight, ClipboardCheck, Flag, ListChecks, Lock, RotateCcw, Send, X as XIcon } from 'lucide-react';
import { BizHistory, BizProject, BizRole, PAKD_DAYS, PakdVersion, latestPakd } from '../business/BusinessProjectContext';
import { Btn } from './erp/Erp';

// --------------------------------------------------------------------------
// Định dạng
// --------------------------------------------------------------------------
const dmy = (iso?: string) => (iso ? iso.slice(0, 10).split('-').reverse().join('/') : '');
const dmyHm = (iso?: string) => {
  if (!iso) return '';
  if (iso.length <= 10) return dmy(iso);
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};
const todayIso = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a: string, b: string) => Math.round((Date.parse(b) - Date.parse(a)) / 86400000);
/** "namnv (GĐK)" → "namnv"; giữ nguyên tên người. */
const personOf = (by?: string) => (by || '').replace(/\s*\((AM|GĐK|PM|CFO)\)\s*$/, '').trim();
const initials = (name: string) => {
  const w = name.trim().split(/\s+/).filter(Boolean);
  if (!w.length) return '?';
  return (w.length === 1 ? w[0].slice(0, 2) : w[0][0] + w[w.length - 1][0]).toUpperCase();
};
const AVATAR_BG = ['#8bc34a', '#7e6bd6', '#4f7fd1', '#e0883a', '#2ba59a', '#d4588b'];
const avatarBg = (name: string) => AVATAR_BG[[...name].reduce((s, c) => s + c.charCodeAt(0), 0) % AVATAR_BG.length];

// --------------------------------------------------------------------------
// Mô hình bước
// --------------------------------------------------------------------------
type StepState = 'done' | 'current' | 'todo' | 'closed';
interface Step {
  key: string;
  title: string;
  who?: string; // người thực hiện / phụ trách
  role?: string; // nhãn vai trò hiển thị khi chưa có tên
  at?: string; // thời điểm hoàn thành
  notes?: { text: string; tone?: 'warn' | 'bad' | 'muted' }[];
}

const lastHist = (p: BizProject, pred: (h: BizHistory) => boolean) => [...p.history].reverse().find(pred);

const buildSteps = (p: BizProject): { steps: Step[]; states: StepState[] } => {
  const last = latestPakd(p);
  const created = p.history.find((h) => h.action === 'Tạo dự án');
  const approved = lastHist(p, (h) => h.action === 'Duyệt mã dự án');
  const closed = lastHist(p, (h) => h.action === 'Tự động đóng dự án');
  const reopened = lastHist(p, (h) => h.action === 'Mở lại dự án');
  const cfoOk = lastHist(p, (h) => /duyệt PAKD$/.test(h.action) && !/từ chối/.test(h.action));
  const finished = lastHist(p, (h) => h.action === 'Kết thúc dự án');
  const selfIssued = !approved && !!p.codeIssuedAt && p.status !== 'Chờ duyệt mã';

  const creator = p.creator || personOf(created?.by) || (p.am || [])[0] || '';
  const s1: Step = { key: 'req', title: 'Lập yêu cầu cấp mã', who: creator, role: 'AM', at: created?.at || p.createdAt };
  const s2: Step = {
    key: 'code',
    title: 'Giám đốc khối duyệt mã',
    who: approved ? personOf(approved.by) : selfIssued ? creator : p.businessDirector || '',
    role: 'GĐK',
    at: approved?.at || (selfIssued ? p.codeIssuedAt : undefined),
    notes: selfIssued ? [{ text: 'GĐK tạo yêu cầu — mã được cấp ngay', tone: 'muted' }] : undefined,
  };

  // Bước PM lập & nộp PAKD
  const s3: Step = { key: 'pakd', title: 'PM lập & nộp PAKD', who: p.businessPm || '', role: 'PM', notes: [] };
  if (last) s3.at = last.submittedAt;
  p.pakd
    .filter((v) => v.state === 'Từ chối')
    .forEach((v) => s3.notes!.push({ text: `V${v.version} bị từ chối ${dmy(v.decidedAt)}${v.note ? ` — ${v.note}` : ''}`, tone: 'bad' }));
  if (p.status === 'Chưa có PAKD' && p.pakdDeadline) {
    const d = daysBetween(todayIso(), p.pakdDeadline);
    s3.notes!.push({
      text: `Hạn nộp ${dmy(p.pakdDeadline)} · ${d > 0 ? `còn ${d} ngày` : d === 0 ? 'hết hạn hôm nay' : `quá hạn ${-d} ngày`}`,
      tone: d <= 3 ? 'warn' : 'muted',
    });
    if (!p.pakd.length) s3.notes!.push({ text: `Quá ${PAKD_DAYS} ngày kể từ ngày cấp mã mà chưa nộp PAKD → dự án tự đóng`, tone: 'muted' });
  }
  if (reopened && p.status !== 'Đóng') s3.notes!.push({ text: `Mở lại ${dmyHm(reopened.at)} bởi ${personOf(reopened.by)}`, tone: 'muted' });

  if (p.status === 'Đóng') {
    if (!p.pakd.length) s3.notes!.push({ text: 'Không nộp PAKD trong hạn', tone: 'bad' });
    const s4: Step = {
      key: 'closed',
      title: 'Đóng dự án',
      who: closed ? personOf(closed.by) : 'Hệ thống',
      at: closed?.at || p.closedAt,
      notes: [
        { text: closed?.note || `Quá ${PAKD_DAYS} ngày chưa nộp PAKD`, tone: 'bad' },
        { text: 'Chỉ Kế toán (CFO) được mở lại dự án', tone: 'muted' },
      ],
    };
    return { steps: [s1, s2, s3, s4], states: ['done', 'done', p.pakd.length ? 'done' : 'todo', 'closed'] };
  }

  const s4: Step = {
    key: 'cfo',
    title: 'Kế toán (CFO) duyệt PAKD',
    who: last?.state === 'Đã duyệt' ? personOf(cfoOk?.by) || '' : '',
    role: 'Kế toán (CFO)',
    at: last?.state === 'Đã duyệt' ? cfoOk?.at || last.decidedAt : undefined,
    notes: last?.state === 'Chờ CFO' ? [{ text: `Đang chờ duyệt PAKD V${last.version}`, tone: 'warn' }] : last?.note && last.state === 'Đã duyệt' ? [{ text: last.note, tone: 'muted' }] : undefined,
  };
  const s5: Step = { key: 'run', title: 'Thực hiện dự án', who: p.productionPm || '', role: 'PM sản xuất' };
  const s6: Step = { key: 'end', title: 'Kết thúc', who: finished ? personOf(finished.by) : '', at: finished?.at };

  const order = ['Chờ duyệt mã', 'Chưa có PAKD', 'PAKD chờ duyệt', 'Đang thực hiện', 'Kết thúc'];
  const cur = order.indexOf(p.status); // bước hiện tại = cur + 1 (bước 0 "Lập yêu cầu" luôn xong)
  const steps = [s1, s2, s3, s4, s5, s6];
  const states: StepState[] = steps.map((_, i) => (i === 0 ? 'done' : i <= cur ? 'done' : i === cur + 1 ? 'current' : 'todo'));
  if (p.status === 'Kết thúc') states[5] = 'done';
  return { steps, states };
};

// --------------------------------------------------------------------------
// Giao diện
// --------------------------------------------------------------------------
const Avatar: React.FC<{ name: string }> = ({ name }) => (
  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: avatarBg(name) }}>
    {initials(name)}
  </span>
);

const Dot: React.FC<{ state: StepState }> = ({ state }) =>
  state === 'done' ? (
    <span className="w-[18px] h-[18px] rounded-full bg-emerald-500 flex items-center justify-center">
      <Check size={11} strokeWidth={3.5} className="text-white" />
    </span>
  ) : state === 'closed' ? (
    <span className="w-[18px] h-[18px] rounded-full bg-rose-500 flex items-center justify-center">
      <XIcon size={11} strokeWidth={3.5} className="text-white" />
    </span>
  ) : state === 'current' ? (
    <span className="block w-[18px] h-[18px] rounded-full border-2 border-[#1f7ae0] bg-white" />
  ) : (
    <span className="block w-[18px] h-[18px] rounded-full border-2 border-slate-300 bg-white" />
  );

const NOTE_CLS = { warn: 'text-amber-700', bad: 'text-rose-600', muted: 'text-slate-500' } as const;

const StepCard: React.FC<{ step: Step; state: StepState; action?: React.ReactNode }> = ({ step, state, action }) => {
  const box =
    state === 'current'
      ? 'bg-[#eaf4ff] border-[#7db4f0]'
      : state === 'closed'
        ? 'bg-rose-50 border-rose-200'
        : 'bg-white border-transparent shadow-[0_1px_2px_rgba(15,23,42,0.06)]';
  const title = state === 'current' ? 'text-[#1f7ae0]' : state === 'closed' ? 'text-rose-700' : state === 'todo' ? 'text-slate-700' : 'text-slate-800';
  const showWho = state !== 'todo' || !!step.who;
  return (
    <div className={`relative ml-3 rounded-[6px] border px-3.5 py-2.5 ${box}`}>
      {/* mũi nhọn chỉ về chấm tròn */}
      <span
        className={`absolute -left-[6px] top-[13px] w-2.5 h-2.5 rotate-45 border-l border-b ${
          state === 'current' ? 'bg-[#eaf4ff] border-[#7db4f0]' : state === 'closed' ? 'bg-rose-50 border-rose-200' : 'bg-white border-transparent'
        }`}
      />
      <p className={`text-[13px] font-bold ${title}`}>{step.title}</p>
      {showWho && (
        <div className="flex items-center gap-2 mt-1.5 text-[12.5px] text-slate-600">
          {step.who ? <Avatar name={step.who} /> : <span className="w-6 h-6 rounded-full bg-slate-200 shrink-0" />}
          <span className="truncate">{step.who || step.role || '—'}</span>
          {step.who && step.role && state !== 'done' && <span className="text-[11px] text-slate-400 shrink-0">· {step.role}</span>}
        </div>
      )}
      {step.at && state !== 'todo' && (
        <p className={`text-[12px] mt-1.5 font-medium ${state === 'closed' ? 'text-rose-600' : 'text-emerald-600'}`}>{dmyHm(step.at)}</p>
      )}
      {step.notes?.map((n, i) => (
        <p key={i} className={`text-[11.5px] mt-1 leading-snug ${NOTE_CLS[n.tone || 'muted']}`}>
          {n.text}
        </p>
      ))}
      {action && <div className="mt-2.5 flex flex-wrap gap-2">{action}</div>}
    </div>
  );
};

const PAKD_TAG: Record<PakdVersion['state'], string> = {
  'Chờ CFO': 'bg-amber-50 text-amber-700 border-amber-300',
  'Đã duyệt': 'bg-emerald-50 text-emerald-700 border-emerald-300',
  'Từ chối': 'bg-rose-50 text-rose-700 border-rose-300',
};

// --------------------------------------------------------------------------
// Ngăn kéo
// --------------------------------------------------------------------------
const LS_OPEN = 'bizWorkflowDrawer.open';
const LS_WIDTH = 'bizWorkflowDrawer.width';
const MIN_W = 300;
const MAX_W = 620;
const lsGet = (k: string) => {
  try {
    return window.localStorage.getItem(k);
  } catch {
    return null;
  }
};
const lsSet = (k: string, v: string) => {
  try {
    window.localStorage.setItem(k, v);
  } catch {
    /* bỏ qua */
  }
};

/** Trạng thái mở / độ rộng của ngăn (dùng chung để trang chính chừa chỗ khi ngăn đang mở). */
export const useWorkflowDrawer = () => {
  const [open, setOpenState] = useState(() => lsGet(LS_OPEN) !== '0');
  const [width, setWidthState] = useState(() => {
    const w = Number(lsGet(LS_WIDTH));
    return w >= MIN_W && w <= MAX_W ? w : 360;
  });
  const setOpen = (v: boolean) => {
    setOpenState(v);
    lsSet(LS_OPEN, v ? '1' : '0');
  };
  const setWidth = (w: number) => {
    setWidthState(w);
    lsSet(LS_WIDTH, String(w));
  };
  return { open, setOpen, width, setWidth };
};

export const WorkflowDrawer: React.FC<{
  project: BizProject;
  role: BizRole;
  open: boolean;
  width: number;
  onOpenChange: (v: boolean) => void;
  onWidthChange: (w: number) => void;
  onApproveCode: () => void;
  onReopen: () => void;
  onSubmit: () => void;
  onDecide: () => void;
  onFinish: () => void;
}> = ({ project: p, role, open, width, onOpenChange, onWidthChange, onApproveCode, onReopen, onSubmit, onDecide, onFinish }) => {
  const { steps, states } = buildSteps(p);
  const last = latestPakd(p);

  // Nút thao tác gắn vào bước hiện tại (theo vai trò đang xem).
  const actionFor = (key: string): React.ReactNode => {
    if (key === 'code' && p.status === 'Chờ duyệt mã' && role === 'GĐK')
      return (
        <Btn variant="primary" icon={CheckCircle2} className="h-7" onClick={onApproveCode}>
          Duyệt mã
        </Btn>
      );
    if (key === 'pakd' && p.status === 'Chưa có PAKD' && role === 'PM')
      return (
        <Btn variant="success" icon={Send} className="h-7" disabled={!p.plan.length} title={p.plan.length ? undefined : 'Import kế hoạch theo tháng trước khi nộp'} onClick={onSubmit}>
          Nộp PAKD {p.pakd.length ? `V${p.pakd.length + 1}` : ''}
        </Btn>
      );
    if (key === 'cfo' && p.status === 'PAKD chờ duyệt' && role === 'CFO')
      return (
        <Btn variant="primary" icon={ClipboardCheck} className="h-7" onClick={onDecide}>
          Duyệt / Từ chối
        </Btn>
      );
    if (key === 'run' && p.status === 'Đang thực hiện')
      return (
        <Btn icon={Flag} className="h-7" onClick={onFinish}>
          Kết thúc dự án
        </Btn>
      );
    if (key === 'closed' && role === 'CFO')
      return (
        <Btn variant="primary" icon={RotateCcw} className="h-7" onClick={onReopen} title={`Mở lại → Chưa có PAKD, hạn ${PAKD_DAYS} ngày mới`}>
          Mở lại dự án
        </Btn>
      );
    return null;
  };
  const myTurn = steps.some((s) => actionFor(s.key) && s.key !== 'run');

  // Kéo mép trái để đổi độ rộng; kéo hẹp hơn MIN_W - 80 thì ẩn ngăn.
  const drag = useRef<{ x: number; w: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      if (!drag.current) return;
      const w = drag.current.w + (drag.current.x - e.clientX);
      if (w < MIN_W - 80) {
        drag.current = null;
        setDragging(false);
        onOpenChange(false);
        return;
      }
      onWidthChange(Math.max(MIN_W, Math.min(MAX_W, w)));
    };
    const up = () => {
      drag.current = null;
      setDragging(false);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
  }, [dragging]);

  return (
    <>
      {/* Tab kéo ngăn ra (khi đang ẩn) */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="tab"
            initial={{ x: 40 }}
            animate={{ x: 0 }}
            exit={{ x: 40 }}
            onClick={() => onOpenChange(true)}
            title="Mở quy trình & phê duyệt PAKD"
            className="fixed right-0 top-1/3 z-40 bg-[#1f5fa8] hover:bg-[#184d89] text-white rounded-l-[6px] shadow-lg px-1.5 py-3 flex flex-col items-center gap-2"
          >
            <ChevronLeft size={15} />
            <span className="text-[12px] font-semibold tracking-wide [writing-mode:vertical-rl] rotate-180">Quy trình PAKD</span>
            {myTurn && <span className="w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#1f5fa8]" title="Có bước đang chờ bạn xử lý" />}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Ngăn kéo */}
      <AnimatePresence>
        {open && (
          <motion.aside
            key="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.22 }}
            style={{ width }}
            className={`fixed right-0 top-12 bottom-0 z-40 bg-[#f3f6f9] border-l border-slate-300 shadow-[-6px_0_18px_rgba(15,23,42,0.10)] flex flex-col ${dragging ? 'select-none' : ''}`}
          >
            {/* tay nắm đổi độ rộng */}
            <div
              onPointerDown={(e) => {
                drag.current = { x: e.clientX, w: width };
                setDragging(true);
              }}
              title="Kéo để đổi độ rộng"
              className="absolute left-0 top-0 bottom-0 w-1.5 -translate-x-1/2 cursor-col-resize hover:bg-[#1f7ae0]/30 active:bg-[#1f7ae0]/40"
            />

            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <p className="flex items-center gap-2 text-[13px] font-bold text-slate-800 uppercase tracking-wide">
                <ListChecks size={15} className="text-[#1f5fa8]" /> Các bước thực hiện
              </p>
              <button onClick={() => onOpenChange(false)} title="Ẩn quy trình" className="p-1 rounded hover:bg-slate-200 text-slate-500">
                <ChevronsRight size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-5">
              {/* Dòng thời gian */}
              <ol>
                {steps.map((s, i) => {
                  const st = states[i];
                  const next = states[i + 1];
                  return (
                    <li key={s.key} className="relative flex gap-1 pb-3 last:pb-0">
                      {i < steps.length - 1 && (
                        <span
                          className={`absolute left-[8px] top-[22px] bottom-[-4px] ${
                            st === 'done' && next !== 'todo' ? 'w-[2px] bg-emerald-500' : 'w-0 border-l-2 border-dashed border-slate-300'
                          }`}
                        />
                      )}
                      <span className="relative z-[1] pt-[11px] shrink-0">
                        <Dot state={st} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <StepCard step={s} state={st} action={st === 'current' || st === 'closed' ? actionFor(s.key) : undefined} />
                      </div>
                    </li>
                  );
                })}
              </ol>

              {/* Phiên bản PAKD */}
              <p className="mt-5 mb-2 text-[12px] font-bold text-slate-600 uppercase tracking-wide">Phiên bản PAKD</p>
              {p.pakd.length ? (
                <div className="space-y-2">
                  {[...p.pakd].reverse().map((v) => (
                    <div key={v.version} className="bg-white rounded-[6px] px-3 py-2 shadow-[0_1px_2px_rgba(15,23,42,0.06)] text-[12px]">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800">V{v.version}</span>
                        <span className={`px-1.5 py-[1px] rounded-[3px] border text-[11px] font-semibold ${PAKD_TAG[v.state]}`}>{v.state}</span>
                      </div>
                      <p className="text-slate-500 mt-0.5">
                        Nộp {dmy(v.submittedAt)} · {v.submittedBy}
                      </p>
                      {v.decidedAt && (
                        <p className="text-slate-500">
                          {v.state === 'Từ chối' ? 'Từ chối' : 'Duyệt'} {dmy(v.decidedAt)} · {v.decidedBy}
                        </p>
                      )}
                      {v.note && <p className="text-slate-600 mt-0.5">“{v.note}”</p>}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[12px] text-slate-400">
                  Chưa nộp PAKD.{p.status === 'Chưa có PAKD' && ' PM import kế hoạch theo tháng rồi bấm "Nộp PAKD".'}
                </p>
              )}
              {last?.state === 'Chờ CFO' && role !== 'CFO' && (
                <p className="mt-3 flex items-center gap-1.5 text-[11.5px] text-slate-500">
                  <Lock size={12} /> Chọn vai trò Kế toán (CFO) để duyệt PAKD.
                </p>
              )}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};
