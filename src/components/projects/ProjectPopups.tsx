/**
 * Popup của màn Dự án — PopupConfirm (Common/PopupConfirmComponent.razor): "Xác nhận" + câu hỏi tiếng Anh hard-code.
 * Đã bỏ PopupConfirmClosing / PopupCollectData (chốt 04/11: /Projects không đổi trạng thái).
 */
import React from 'react';
import { AlertTriangle, CheckCircle2, Info, Save, X, XCircle } from 'lucide-react';
import { Btn } from '../erp/Erp';
import { useProjects } from '../../projects/ProjectsContext';

export const Modal: React.FC<{ title: React.ReactNode; onClose: () => void; children: React.ReactNode; footer: React.ReactNode; width?: number }> = ({ title, onClose, children, footer, width = 480 }) => (
  <div className="fixed inset-0 z-[900] flex items-center justify-center bg-slate-900/40 p-4" onMouseDown={onClose}>
    <div className="bg-white rounded-[4px] border border-slate-300 shadow-xl w-full flex flex-col max-h-[90vh]" style={{ maxWidth: width }} onMouseDown={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 bg-[#f7f9fc]">
        <h3 className="text-[14px] font-bold text-[#1e3a5f]">{title}</h3>
        <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
          <X size={16} />
        </button>
      </div>
      <div className="p-4 overflow-auto text-[13px]">{children}</div>
      <div className="flex justify-end gap-2 px-4 py-2.5 border-t border-slate-200 bg-slate-50">{footer}</div>
    </div>
  </div>
);

/** PopupConfirm.Show(message, onConfirm) — header "Xác nhận", nút Hủy / Xác nhận. */
export const ConfirmDialog: React.FC<{ message: string; onConfirm: () => void; onClose: () => void }> = ({ message, onConfirm, onClose }) => (
  <Modal
    title="Xác nhận"
    onClose={onClose}
    width={400}
    footer={
      <>
        <Btn onClick={onClose}>Hủy</Btn>
        <Btn
          variant="primary"
          icon={Save}
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Xác nhận
        </Btn>
      </>
    }
  >
    {message}
  </Modal>
);

/** toastr — góc trên phải. */
export const Toasts: React.FC = () => {
  const { toasts } = useProjects();
  const ic = { success: CheckCircle2, error: XCircle, warning: AlertTriangle, info: Info };
  const cls = { success: 'bg-emerald-600', error: 'bg-rose-600', warning: 'bg-amber-500', info: 'bg-sky-600' };
  return (
    <div className="fixed top-3 right-3 z-[1000] space-y-2 w-[320px]">
      {toasts.map((t) => {
        const I = ic[t.kind];
        return (
          <div key={t.id} className={`${cls[t.kind]} text-white rounded-[4px] shadow-lg px-3 py-2 text-[12.5px] flex gap-2 items-start`}>
            <I size={15} className="shrink-0 mt-0.5" />
            <span>{t.text}</span>
          </div>
        );
      })}
    </div>
  );
};
