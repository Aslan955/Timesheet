/** CRM · Module 02 — Sổ cái lịch sử quà tặng (mục 4.5). */
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Download, Gift as GiftIcon, Plus, Search, Trash2 } from 'lucide-react';
import { Btn, ErpPage, KpiBox, Panel, erp } from '../erp/Erp';
import { CRM_DIVISIONS, canExport, canSeeCustomer, dmy, fmtMoney, isTop, todayIso, userName } from '../../crm/crmData';
import { crm, useCrm, useMe } from '../../crm/crmStore';
import { GiftModal } from './CrmRemindersPage';
import { CrmTitle, DivTag, useToast } from './crmUi';

const sel = 'h-8 border border-slate-300 rounded-[3px] px-2 text-[12.5px] bg-white outline-none focus:border-[#1f5fa8] cursor-pointer';

export const CrmGiftsPage: React.FC<{ onOpenCustomer?: (id: string) => void }> = ({ onOpenCustomer }) => {
  const s = useCrm();
  const me = useMe();
  const { toast, toastNode } = useToast();
  const [year, setYear] = useState(todayIso().slice(0, 4));
  const [div, setDiv] = useState('');
  const [q, setQ] = useState('');
  const [add, setAdd] = useState(false);
  const cust = (id: string) => s.customers.find((c) => c.id === id);
  const visible = s.gifts.filter((g) => {
    const c = cust(g.customerId);
    return c ? canSeeCustomer(me, c) : isTop(me);
  });
  const needle = q.trim().toLowerCase();
  const rows = visible
    .filter((g) => !year || g.date.startsWith(year))
    .filter((g) => !div || g.division === div)
    .filter((g) => !needle || [g.item, g.occasion, cust(g.customerId)?.name || ''].some((v) => v.toLowerCase().includes(needle)))
    .sort((a, b) => b.date.localeCompare(a.date));
  const total = rows.reduce((a, g) => a + g.value * g.quantity, 0);
  const years = [...new Set(visible.map((g) => g.date.slice(0, 4)))].sort().reverse();
  const customersN = new Set(rows.map((g) => g.customerId)).size;

  const exportXlsx = () => {
    const head = ['Ngày', 'Khách hàng', 'Người nhận', 'Dịp', 'Quà tặng', 'Số lượng', 'Đơn giá', 'Thành tiền', 'Người tặng', 'Khối', 'Ghi chú'];
    const data = rows.map((g) => {
      const c = cust(g.customerId);
      return [dmy(g.date), c?.name || '', c?.contacts.find((k) => k.id === g.contactId)?.name || 'Cơ quan', g.occasion, g.item, g.quantity, g.value, g.value * g.quantity, userName(g.givenBy), g.division, g.note];
    });
    const ws = XLSX.utils.aoa_to_sheet([head, ...data]);
    ws['!cols'] = [12, 40, 24, 28, 28, 10, 14, 14, 20, 8, 30].map((wch) => ({ wch }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sổ quà tặng');
    XLSX.writeFile(wb, `CRM_SoQuaTang_${year || 'TatCa'}.xlsx`);
    crm.audit('Xuất dữ liệu', 'Sổ quà tặng', `${rows.length} dòng · ${fmtMoney(total)} VNĐ`);
    toast(`Đã xuất ${rows.length} dòng quà tặng`);
  };

  return (
    <ErpPage>
      {toastNode}
      <CrmTitle
        page="Sổ quà tặng"
        title="Sổ cái lịch sử quà tặng"
        actions={
          <>
            {canExport(me) && (
              <Btn icon={Download} onClick={exportXlsx}>
                Xuất Excel
              </Btn>
            )}
            <Btn variant="primary" icon={Plus} onClick={() => setAdd(true)} data-testid="gift-add">
              Ghi quà tặng
            </Btn>
          </>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        <KpiBox label="Số lần tặng quà" value={rows.length} sub={year ? `Năm ${year}` : 'Tất cả các năm'} />
        <KpiBox label="Tổng giá trị (VNĐ)" value={fmtMoney(total)} valueText={fmtMoney(total)} sub={`Bình quân ${fmtMoney(rows.length ? total / rows.length : 0)} / lần`} />
        <KpiBox label="Khách hàng được tặng" value={customersN} sub="Theo bộ lọc" />
        <KpiBox label="Dịp nhiều nhất" value={topOccasion(rows.map((g) => g.occasion)) || '—'} valueText={topOccasion(rows.map((g) => g.occasion)) || ''} sub="Theo số lần" />
      </div>
      <Panel title={`Sổ quà tặng (${rows.length})`} icon={GiftIcon} noPad footer="Ghi thêm khi xử lý nhắc việc chọn “Gửi quà” — dòng quà gắn với lần nhắc đó.">
        <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-slate-200 bg-[#f7f9fc]">
          <div className="relative flex-1 min-w-[220px] max-w-[320px]">
            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tìm quà, dịp, khách hàng…" className={`${erp.inputFull} pl-8`} />
          </div>
          <select value={year} onChange={(e) => setYear(e.target.value)} className={sel}>
            <option value="">Tất cả năm</option>
            {years.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
          {isTop(me) && (
            <select value={div} onChange={(e) => setDiv(e.target.value)} className={sel}>
              <option value="">Tất cả khối</option>
              {CRM_DIVISIONS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                {['Ngày', 'Khách hàng', 'Người nhận', 'Dịp', 'Quà tặng', 'SL', 'Đơn giá', 'Thành tiền', 'Người tặng', 'Khối', ''].map((h, i) => (
                  <th key={i} className={`${erp.th} ${i >= 5 && i <= 7 ? 'text-right' : 'text-left'} border-t-0 ${i === 0 ? 'border-l-0' : ''} ${i === 10 ? 'border-r-0 w-10' : ''}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((g) => {
                const c = cust(g.customerId);
                return (
                  <tr key={g.id} className={erp.tr}>
                    <td className={`${erp.td} border-l-0 whitespace-nowrap tabular-nums`}>{dmy(g.date)}</td>
                    <td className={`${erp.td} min-w-[220px]`}>
                      {c && onOpenCustomer ? (
                        <button type="button" onClick={() => onOpenCustomer(c.id)} className="text-left text-[#1f5fa8] hover:underline cursor-pointer">
                          {c.name}
                        </button>
                      ) : (
                        c?.name || '—'
                      )}
                    </td>
                    <td className={erp.td}>{c?.contacts.find((k) => k.id === g.contactId)?.name || 'Cơ quan'}</td>
                    <td className={erp.td}>{g.occasion}</td>
                    <td className={erp.td}>{g.item}</td>
                    <td className={`${erp.td} ${erp.num}`}>{g.quantity}</td>
                    <td className={`${erp.td} ${erp.num}`}>{fmtMoney(g.value)}</td>
                    <td className={`${erp.td} ${erp.num} font-semibold`}>{fmtMoney(g.value * g.quantity)}</td>
                    <td className={`${erp.td} whitespace-nowrap`}>{userName(g.givenBy)}</td>
                    <td className={erp.td}>
                      <DivTag d={g.division} />
                    </td>
                    <td className={`${erp.td} border-r-0`}>
                      {(isTop(me) || (me.role === 'gdk' && g.division === me.division)) && (
                        <button
                          type="button"
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Xoá dòng"
                          onClick={() => {
                            crm.removeGift(g.id);
                            toast('Đã xoá dòng quà tặng');
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {!rows.length && (
                <tr>
                  <td colSpan={11} className={`${erp.td} border-x-0 py-8 text-center text-slate-400`}>
                    Chưa có quà tặng.
                  </td>
                </tr>
              )}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className={erp.totalRow}>
                  <td className={`${erp.td} border-l-0`} colSpan={7}>
                    Tổng cộng
                  </td>
                  <td className={`${erp.td} ${erp.num}`}>{fmtMoney(total)}</td>
                  <td className={`${erp.td} border-r-0`} colSpan={3} />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Panel>
      {add && <GiftModal onClose={() => setAdd(false)} toast={toast} />}
    </ErpPage>
  );
};

const topOccasion = (list: string[]) => {
  const m = new Map<string, number>();
  list.forEach((x) => m.set(x, (m.get(x) || 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
};
