/**
 * MarCom · Sinh nhật nhân sự (yêu cầu 1.1 + trạng thái mail 1.4).
 *  - Danh sách sinh nhật theo tháng, sắp xếp ngày 01 → cuối tháng, real-time theo hồ sơ Employee.
 *  - Tối thiểu: Họ tên – Division (Khối) – Ngày sinh – Email nội bộ (+ ảnh, mã NV, trạng thái mail chúc mừng).
 *  - Chỉ nhân sự đang làm việc; nhân sự đã nghỉ bị loại khỏi danh sách.
 * Giao diện: khung ERP (src/components/erp/Erp.tsx) như màn Báo cáo hiệu quả dự án.
 */
import React, { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { Cake, ChevronLeft, ChevronRight, Copy, Download, FileSpreadsheet, RefreshCw, Table2 } from 'lucide-react';
import { useMarcom } from '../../marcom/MarcomContext';
import { Avatar, FilterBar, FilterCell, TAG, iconBtn, useToast } from '../../marcom/MarcomUi';
import { Btn, ErpPage, ErpTitleBar, KpiBox, Panel, Tag, erp } from '../erp/Erp';
import {
  DIVISIONS, MarcomEmployee, birthdayThisYear, fromKey, fmtDate, fmtDayMonth, fmtTime, startOfDay, addDays,
  WEEKDAY_SHORT, isPastTimeToday, downloadPhoto,
} from '../../marcom/marcomData';

export const BirthdayListPage: React.FC = () => {
  const { employees, logs, config, refresh } = useMarcom();
  const { toast, toastNode } = useToast();
  const now = new Date();
  const today = startOfDay(now);
  const year = today.getFullYear();
  const [month, setMonth] = useState(today.getMonth());
  const [division, setDivision] = useState('all');
  const [q, setQ] = useState('');

  const active = useMemo(() => employees.filter((e) => e.active), [employees]);
  const excluded = employees.filter((e) => !e.active && fromKey(e.dob).getMonth() === month).length;

  const rows = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return active
      .filter((e) => fromKey(e.dob).getMonth() === month)
      .filter((e) => division === 'all' || e.division === division)
      .filter((e) => !kw || e.name.toLowerCase().includes(kw) || e.email.includes(kw) || e.code.toLowerCase().includes(kw))
      .sort((a, b) => fromKey(a.dob).getDate() - fromKey(b.dob).getDate() || a.name.localeCompare(b.name, 'vi'));
  }, [active, month, division, q]);

  const todayCount = active.filter((e) => birthdayThisYear(e).getTime() === today.getTime()).length;
  const weekCount = active.filter((e) => {
    const b = birthdayThisYear(e);
    return b >= today && b <= addDays(today, 6);
  }).length;
  const sentThisMonth = logs.filter((l) => l.kind === 'birthday' && l.status === 'sent' && new Date(l.sentAt).getMonth() === today.getMonth()).length;
  const failedThisMonth = logs.filter((l) => l.kind === 'birthday' && l.status === 'failed' && new Date(l.sentAt).getMonth() === today.getMonth()).length;

  const mailStatus = (e: MarcomEmployee) => {
    const b = birthdayThisYear(e);
    const log = logs.find((l) => l.kind === 'birthday' && l.employeeId === e.id && l.status !== 'test' && new Date(l.sentAt).getFullYear() === year);
    if (log?.status === 'failed') return <Tag cls={TAG.rose}>Gửi lỗi</Tag>;
    if (log?.status === 'sent') return <Tag cls={TAG.green}>Đã gửi {fmtTime(log.sentAt)}</Tag>;
    const isToday = b.getTime() === today.getTime();
    if (b < today || (isToday && isPastTimeToday(config.birthday.sendTime))) return <Tag cls={TAG.green}>Đã gửi</Tag>;
    if (!config.birthday.enabled) return <Tag cls={TAG.slate}>Tắt tự động</Tag>;
    return <Tag cls={isToday ? TAG.amber : TAG.blue}>{isToday ? `Chờ gửi ${config.birthday.sendTime}` : `Lên lịch ${fmtDayMonth(b)} ${config.birthday.sendTime}`}</Tag>;
  };

  const exportExcel = () => {
    const data = rows.map((e, i) => ({
      STT: i + 1,
      'Ngày sinh nhật': fmtDayMonth(e.dob),
      'Họ và tên': e.name,
      'Mã NV': e.code,
      'Division (Khối)': e.division,
      'Ngày sinh': fmtDate(e.dob),
      'Email nội bộ': e.email,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 5 }, { wch: 14 }, { wch: 24 }, { wch: 12 }, { wch: 20 }, { wch: 12 }, { wch: 30 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `Sinh nhat T${month + 1}`);
    XLSX.writeFile(wb, `SinhNhat_Thang${month + 1}_${year}.xlsx`);
    toast(`Đã xuất ${rows.length} nhân sự sinh nhật tháng ${month + 1}/${year}`);
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast(`Đã copy: ${text}`);
  };

  const isDefault = month === today.getMonth() && division === 'all' && !q;

  return (
    <ErpPage>
      {toastNode}
      <ErpTitleBar
        crumbs={['Human Resources', 'MarCom', 'Sinh nhật nhân sự']}
        title="Sinh nhật nhân sự"
        actions={
          <>
            <Btn icon={RefreshCw} onClick={refresh} title="Dữ liệu đọc trực tiếp từ hồ sơ Employee">
              Làm mới
            </Btn>
            <Btn variant="success" icon={FileSpreadsheet} onClick={exportExcel} disabled={rows.length === 0}>
              Xuất Excel
            </Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiBox label="Sinh nhật hôm nay" value={todayCount} tone="neutral" sub={`${WEEKDAY_SHORT[today.getDay()]}, ${fmtDate(today)}`} />
        <KpiBox label="7 ngày tới" value={weekCount} sub="Tính cả hôm nay" />
        <KpiBox label={`Sinh nhật tháng ${month + 1}/${year}`} value={rows.length} sub={excluded ? `Đã loại ${excluded} nhân sự nghỉ việc` : 'Nhân sự đang làm việc'} />
        <KpiBox
          label="Mail đã gửi tháng này"
          value={sentThisMonth}
          tone={failedThisMonth ? 'bad' : 'good'}
          badge={failedThisMonth ? `${failedThisMonth} lỗi` : undefined}
          sub="Xem chi tiết ở Email tự động › Lịch sử gửi"
        />
      </div>

      <Panel
        title={`Danh sách sinh nhật tháng ${month + 1}/${year}`}
        icon={Table2}
        noPad
        actions={<span className="text-[12px] text-slate-600">{rows.length} nhân sự · sắp xếp ngày 01 → cuối tháng</span>}
        footer="Danh sách đọc trực tiếp từ hồ sơ Employee — thêm/sửa ngày sinh, khối, email, ảnh trên Employee sẽ cập nhật ngay · Nhân sự đã nghỉ việc không hiển thị"
      >
        <div className="p-3 border-b border-slate-200">
          <FilterBar
            right={
              !isDefault && (
                <Btn
                  className="h-7"
                  onClick={() => {
                    setMonth(today.getMonth());
                    setDivision('all');
                    setQ('');
                  }}
                >
                  Mặc định
                </Btn>
              )
            }
          >
            <FilterCell label="Tháng">
              <span className="inline-flex items-center border border-slate-300 rounded-[3px] bg-white overflow-hidden h-7">
                <button type="button" onClick={() => setMonth((m) => (m + 11) % 12)} className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 border-r border-slate-300 cursor-pointer" title="Tháng trước">
                  <ChevronLeft size={14} />
                </button>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className="!h-full px-2 text-[12px] font-semibold text-slate-800 bg-white outline-none cursor-pointer">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      Tháng {String(i + 1).padStart(2, '0')}/{year}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => setMonth((m) => (m + 1) % 12)} className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 border-l border-slate-300 cursor-pointer" title="Tháng sau">
                  <ChevronRight size={14} />
                </button>
              </span>
            </FilterCell>
            <FilterCell label="Division (Khối)">
              <select value={division} onChange={(e) => setDivision(e.target.value)} className={`${erp.input} w-44`}>
                <option value="all">Tất cả</option>
                {DIVISIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </FilterCell>
            <FilterCell label="Tìm kiếm" className="flex-1 min-w-[220px] max-w-[360px]">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Tên, mã NV, email…" className={`${erp.input} w-full min-w-0`} />
            </FilterCell>
          </FilterBar>
        </div>

        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} w-[70px] text-center`}>Ngày</th>
                <th className={`${erp.th} text-left`}>Họ và tên</th>
                <th className={`${erp.th} text-left`}>Mã NV</th>
                <th className={`${erp.th} text-left`}>Division (Khối)</th>
                <th className={`${erp.th} text-center`}>Ngày sinh</th>
                <th className={`${erp.th} text-left`}>Email nội bộ</th>
                <th className={`${erp.th} text-left`}>Mail chúc mừng</th>
                <th className={`${erp.th} w-[60px] text-center`}>Ảnh</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className={`${erp.td} py-10 text-center text-slate-400`}>
                    Không có nhân sự sinh nhật phù hợp điều kiện lọc.
                  </td>
                </tr>
              )}
              {rows.map((e) => {
                const b = birthdayThisYear(e);
                const isToday = b.getTime() === today.getTime();
                return (
                  <tr key={e.id} className={isToday ? 'bg-[#fff6d6] hover:bg-[#fdefc0]' : erp.tr}>
                    <td className={`${erp.td} text-center`}>
                      <span className={`font-bold ${isToday ? 'text-[#b45309]' : 'text-slate-800'}`}>{String(b.getDate()).padStart(2, '0')}</span>
                      <span className="text-slate-400"> · {WEEKDAY_SHORT[b.getDay()]}</span>
                    </td>
                    <td className={erp.td}>
                      <div className="flex items-center gap-2">
                        <Avatar e={e} size={26} />
                        <span className="font-semibold text-slate-800">{e.name}</span>
                        {isToday && <Tag cls={TAG.amber} icon={Cake}>Hôm nay</Tag>}
                      </div>
                    </td>
                    <td className={`${erp.td} ${erp.code}`}>{e.code}</td>
                    <td className={erp.td}>{e.division}</td>
                    <td className={`${erp.td} text-center`}>{fmtDate(e.dob)}</td>
                    <td className={erp.td}>
                      <button type="button" onClick={() => copy(e.email)} className="group inline-flex items-center gap-1 text-slate-700 hover:text-[#1f5fa8] cursor-pointer" title="Copy email">
                        {e.email}
                        <Copy size={11} className="opacity-0 group-hover:opacity-100" />
                      </button>
                    </td>
                    <td className={erp.td}>{mailStatus(e)}</td>
                    <td className={`${erp.td} text-center`}>
                      <button type="button" className={iconBtn} disabled={!e.photoUrl} onClick={() => downloadPhoto(e)} title={e.photoUrl ? 'Tải ảnh (từ hồ sơ Employee)' : 'Hồ sơ Employee chưa có ảnh'}>
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </ErpPage>
  );
};
