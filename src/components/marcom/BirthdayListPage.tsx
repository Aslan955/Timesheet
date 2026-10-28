/**
 * MarCom · Sinh nhật nhân sự (yêu cầu 1.1 + trạng thái mail 1.4).
 *  - Danh sách sinh nhật theo tháng, sắp xếp ngày 01 → cuối tháng, real-time theo hồ sơ Employee.
 *  - Tối thiểu: Họ tên – Division (Khối) – Ngày sinh – Email nội bộ (+ ảnh, mã NV, trạng thái mail chúc mừng).
 *  - Chỉ nhân sự đang làm việc; nhân sự đã nghỉ bị loại khỏi danh sách. Sinh 29/02 năm không nhuận → chúc ngày 28/02.
 *  - Ảnh chúc mừng (chỉ cho sinh nhật): mặc định lấy từ Employee, MarCom tải ảnh khác lên / xoá cho từng người (lưu S3);
 *    ảnh tải lên chỉ dùng cho lần sinh nhật của năm đang xem, năm sau quay về ảnh Employee.
 *    Khoá đổi ảnh từ lúc ảnh được dùng lần đầu ở box trang chủ, bài Teams (khi bật kênh Teams) hoặc mail.
 * Giao diện: khung ERP (src/components/erp/Erp.tsx) như màn Báo cáo hiệu quả dự án.
 */
import React, { useMemo, useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Cake, ChevronLeft, ChevronRight, Copy, Download, FileSpreadsheet, RefreshCw, Table2, Trash2, Upload } from 'lucide-react';
import { useMarcom } from '../../marcom/MarcomContext';
import { Avatar, FilterBar, FilterCell, LangSwitch, TAG, iconBtn, useToast } from '../../marcom/MarcomUi';
import { useMarcomLang } from '../../marcom/i18n';
import { Btn, ErpPage, ErpTitleBar, KpiBox, Panel, Tag, erp } from '../erp/Erp';
import {
  DIVISIONS, MAX_IMAGE_BYTES, MarcomEmployee, PhotoSource, TEAMS_POST_ENABLED, birthdayInYear, fromKey, fmtDate, fmtDayMonth, fmtTime, startOfDay, addDays,
  isPastTimeToday, downloadPhoto,
} from '../../marcom/marcomData';

export const BirthdayListPage: React.FC = () => {
  const { employees: allEmployees, photoForYear, logs, config, refresh } = useMarcom();
  const { toast, toastNode } = useToast();
  const { tr, wdShort } = useMarcomLang();
  const now = new Date();
  const today = startOfDay(now);
  const thisYear = today.getFullYear();
  // Tháng đang xem — ‹ › đi qua mốc năm (12 → 01 năm sau, 01 → 12 năm trước)
  const [view, setView] = useState({ year: thisYear, month: today.getMonth() });
  const { year, month } = view;
  // Ảnh chúc mừng theo sinh nhật của năm đang xem
  const employees = useMemo(() => allEmployees.map((e) => photoForYear(e, year)), [allEmployees, photoForYear, year]);
  const shiftMonth = (d: number) =>
    setView((v) => {
      const t = new Date(v.year, v.month + d, 1);
      return { year: t.getFullYear(), month: t.getMonth() };
    });
  const [division, setDivision] = useState('all');
  const [q, setQ] = useState('');

  const active = useMemo(() => employees.filter((e) => e.active), [employees]);
  const excluded = employees.filter((e) => !e.active && fromKey(e.dob).getMonth() === month).length;

  const rows = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return active
      .filter((e) => fromKey(e.dob).getMonth() === month)
      .filter((e) => division === 'all' || e.division === division)
      .filter((e) => !kw || e.name.toLowerCase().includes(kw) || e.email.toLowerCase().includes(kw) || e.code.toLowerCase().includes(kw))
      .sort((a, b) => birthdayInYear(a, year).getDate() - birthdayInYear(b, year).getDate() || a.name.localeCompare(b.name, 'vi'));
  }, [active, year, month, division, q]);

  const todayCount = active.filter((e) => birthdayInYear(e, thisYear).getTime() === today.getTime()).length;
  // 7 ngày tới có thể vắt sang năm sau (cuối tháng 12)
  const weekCount = active.filter((e) =>
    [birthdayInYear(e, thisYear), birthdayInYear(e, thisYear + 1)].some((b) => b >= today && b <= addDays(today, 6)),
  ).length;
  const inViewMonth = (iso: string) => {
    const d = new Date(iso);
    return d.getFullYear() === year && d.getMonth() === month;
  };
  const sentInMonth = logs.filter((l) => l.kind === 'birthday' && l.status === 'sent' && inViewMonth(l.sentAt)).length;
  // Badge lỗi: số người có bản ghi sau cùng trong tháng là Lỗi (lỗi đã tự thử lại thành công không đếm)
  const failedInMonth = useMemo(() => {
    const latest = new Map<string, { at: string; status: string }>();
    logs
      .filter((l) => l.kind === 'birthday' && l.status !== 'test' && inViewMonth(l.sentAt))
      .forEach((l) => {
        const cur = latest.get(l.employeeId);
        if (!cur || l.sentAt > cur.at) latest.set(l.employeeId, { at: l.sentAt, status: l.status });
      });
    return [...latest.values()].filter((x) => x.status === 'failed').length;
  }, [logs, year, month]);

  /** Trạng thái mail chúc mừng trong năm đang xem — theo bản ghi sau cùng; "Đã gửi" chỉ khi bản ghi đó thành công. */
  const mailState = (e: MarcomEmployee) => {
    const b = birthdayInYear(e, year);
    const isToday = b.getTime() === today.getTime();
    // Trạng thái theo bản ghi sau cùng của năm đang xem (bỏ qua gửi thử)
    const log = logs
      .filter((l) => l.kind === 'birthday' && l.employeeId === e.id && l.status !== 'test' && new Date(l.sentAt).getFullYear() === year)
      .reduce<(typeof logs)[number] | undefined>((a, l) => (!a || l.sentAt > a.sentAt ? l : a), undefined);
    if (log?.status === 'failed') return { state: 'failed' as const, b, isToday };
    if (log?.status === 'sent') return { state: 'sent' as const, b, isToday, at: log.sentAt };
    if (b < today || (isToday && isPastTimeToday(config.birthday.sendTime))) return { state: 'notSent' as const, b, isToday };
    if (!config.birthday.enabled) return { state: 'off' as const, b, isToday };
    return { state: 'waiting' as const, b, isToday };
  };

  const mailLabel = (e: MarcomEmployee) => {
    const m = mailState(e);
    if (m.state === 'failed') return tr('Gửi lỗi', 'Failed');
    if (m.state === 'sent') return `${tr('Đã gửi', 'Sent')}${m.at ? ` ${fmtTime(m.at)}` : ''}`;
    if (m.state === 'notSent') return tr('Không gửi', 'Not sent');
    if (m.state === 'off') return tr('Tắt tự động', 'Auto-send off');
    return m.isToday ? `${tr('Chờ gửi', 'Pending')} ${config.birthday.sendTime}` : `${tr('Lên lịch', 'Scheduled')} ${fmtDayMonth(m.b)} ${config.birthday.sendTime}`;
  };
  const MAIL_TAG = { failed: TAG.rose, sent: TAG.green, notSent: TAG.slate, off: TAG.slate };
  const mailStatus = (e: MarcomEmployee) => {
    const m = mailState(e);
    return <Tag cls={m.state === 'waiting' ? (m.isToday ? TAG.amber : TAG.blue) : MAIL_TAG[m.state]}>{mailLabel(e)}</Tag>;
  };

  /** Ảnh đã được dùng ở kênh đang bật (box trang chủ từ đầu ngày, bài Teams từ giờ đăng, mail đã gửi) → khoá đổi ảnh. */
  const photoLocked = (e: MarcomEmployee) => {
    const b = birthdayInYear(e, year);
    const at = (hhmm: string) => {
      const [h, m] = hhmm.split(':').map(Number);
      const d = new Date(b);
      d.setHours(h, m, 0, 0);
      return d;
    };
    return (
      mailState(e).state === 'sent' ||
      (config.box.showOnHome && now >= b) ||
      (TEAMS_POST_ENABLED && config.box.postToTeams && now >= at(config.box.teamsPostTime))
    );
  };

  const exportExcel = () => {
    const data = rows.map((e, i) => ({
      [tr('STT', 'No.')]: i + 1,
      [tr('Ngày sinh nhật', 'Birthday')]: fmtDayMonth(e.dob),
      [tr('Họ và tên', 'Full name')]: e.name,
      [tr('Mã NV', 'Employee ID')]: e.code,
      [tr('Division (Khối)', 'Division')]: e.division,
      [tr('Vị trí', 'Position')]: e.position,
      [tr('Ngày sinh', 'Date of birth')]: fmtDate(e.dob),
      [tr('Email nội bộ', 'Internal email')]: e.email,
      [tr('Trạng thái mail', 'Mail status')]: mailLabel(e),
      [tr('Nguồn ảnh', 'Photo source')]: e.photoSource === 'upload' ? tr('Tải lên', 'Upload') : 'Employee',
      // Đường dẫn mẫu: hệ thống thật trả link S3 / link ảnh hồ sơ Employee
      [tr('Link ảnh', 'Photo link')]:
        e.photoSource === 'upload' ? `s3://imis-marcom/birthday-photos/${e.code}/${e.uploadedPhotoName}` : e.photoUrl ? `employee/${e.code}/avatar` : '',
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{ wch: 5 }, { wch: 14 }, { wch: 24 }, { wch: 12 }, { wch: 16 }, { wch: 20 }, { wch: 12 }, { wch: 30 }, { wch: 16 }, { wch: 12 }, { wch: 48 }];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tr(`Sinh nhat T${month + 1}`, `Birthdays M${month + 1}`));
    XLSX.writeFile(wb, tr(`SinhNhat_Thang${month + 1}_${year}.xlsx`, `Birthdays_${month + 1}_${year}.xlsx`));
    toast(tr(`Đã xuất ${rows.length} nhân sự sinh nhật tháng ${month + 1}/${year}`, `Exported ${rows.length} employees with birthdays in ${month + 1}/${year}`));
  };

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text);
    toast(`${tr('Đã copy', 'Copied')}: ${text}`);
  };

  const isDefault = year === thisYear && month === today.getMonth() && division === 'all' && !q;

  return (
    <ErpPage>
      {toastNode}
      <ErpTitleBar
        crumbs={['Human Resources', 'MarCom', tr('Sinh nhật nhân sự', 'Employee birthdays')]}
        title={tr('Sinh nhật nhân sự', 'Employee birthdays')}
        actions={
          <>
            <LangSwitch />
            <Btn icon={RefreshCw} onClick={refresh} title={tr('Dữ liệu đọc trực tiếp từ hồ sơ Employee', 'Data is read directly from Employee profiles')}>
              {tr('Làm mới', 'Refresh')}
            </Btn>
            <Btn variant="success" icon={FileSpreadsheet} onClick={exportExcel} disabled={rows.length === 0}>
              {tr('Xuất Excel', 'Export Excel')}
            </Btn>
          </>
        }
      />

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        <KpiBox label={tr('Sinh nhật hôm nay', 'Birthdays today')} value={todayCount} tone="neutral" sub={`${wdShort[today.getDay()]}, ${fmtDate(today)}`} />
        <KpiBox label={tr('7 ngày tới', 'Next 7 days')} value={weekCount} sub={tr('Tính cả hôm nay', 'Including today')} />
        <KpiBox
          label={tr(`Sinh nhật tháng ${month + 1}/${year}`, `Birthdays in ${month + 1}/${year}`)}
          value={rows.length}
          sub={excluded ? tr(`Đã loại ${excluded} nhân sự nghỉ việc`, `${excluded} resigned employee(s) excluded`) : tr('Nhân sự đang làm việc', 'Active employees')}
        />
        <KpiBox
          label={tr(`Mail đã gửi tháng ${month + 1}/${year}`, `Mails sent in ${month + 1}/${year}`)}
          value={sentInMonth}
          tone={failedInMonth ? 'bad' : 'good'}
          badge={failedInMonth ? tr(`${failedInMonth} lỗi`, `${failedInMonth} failed`) : undefined}
          sub={tr('Xem chi tiết ở Email tự động › Lịch sử gửi', 'See details in Automated emails › Send history')}
        />
      </div>

      <Panel
        title={tr(`Danh sách sinh nhật tháng ${month + 1}/${year}`, `Birthday list ${month + 1}/${year}`)}
        icon={Table2}
        noPad
        actions={<span className="text-[12px] text-slate-600">{tr(`${rows.length} nhân sự · sắp xếp ngày 01 → cuối tháng`, `${rows.length} employees · sorted from day 01 → month end`)}</span>}
        footer={tr(
          'Danh sách đọc trực tiếp từ hồ sơ Employee — thêm/sửa ngày sinh, khối, email, ảnh trên Employee sẽ cập nhật ngay · Ảnh chúc mừng mặc định lấy từ Employee, có thể tải ảnh khác lên cho từng người đến khi ảnh được dùng · Nhân sự đã nghỉ việc không hiển thị',
          'List is read directly from Employee profiles — changes to date of birth, division, email or photo apply immediately · Greeting photo defaults to the Employee photo; a different one can be uploaded per person until the photo is used · Resigned employees are hidden',
        )}
      >
        <div className="p-3 border-b border-slate-200">
          <FilterBar
            right={
              !isDefault && (
                <Btn
                  className="h-7"
                  onClick={() => {
                    setView({ year: thisYear, month: today.getMonth() });
                    setDivision('all');
                    setQ('');
                  }}
                >
                  {tr('Mặc định', 'Reset')}
                </Btn>
              )
            }
          >
            <FilterCell label={tr('Tháng', 'Month')}>
              <span className="inline-flex items-center border border-slate-300 rounded-[3px] bg-white overflow-hidden h-7">
                <button type="button" onClick={() => shiftMonth(-1)} className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 border-r border-slate-300 cursor-pointer" title={tr('Tháng trước', 'Previous month')}>
                  <ChevronLeft size={14} />
                </button>
                <select value={month} onChange={(e) => setView({ year, month: Number(e.target.value) })} className="!h-full px-2 text-[12px] font-semibold text-slate-800 bg-white outline-none cursor-pointer">
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {tr('Tháng', 'Month')} {String(i + 1).padStart(2, '0')}/{year}
                    </option>
                  ))}
                </select>
                <button type="button" onClick={() => shiftMonth(1)} className="w-7 h-full flex items-center justify-center text-slate-500 hover:bg-slate-100 border-l border-slate-300 cursor-pointer" title={tr('Tháng sau', 'Next month')}>
                  <ChevronRight size={14} />
                </button>
              </span>
            </FilterCell>
            <FilterCell label={tr('Division (Khối)', 'Division')}>
              <select value={division} onChange={(e) => setDivision(e.target.value)} className={`${erp.input} w-44`}>
                <option value="all">{tr('Tất cả', 'All')}</option>
                {DIVISIONS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
            </FilterCell>
            <FilterCell label={tr('Tìm kiếm', 'Search')} className="flex-1 min-w-[220px] max-w-[360px]">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={tr('Tên, mã NV, email…', 'Name, employee ID, email…')} className={`${erp.input} w-full min-w-0`} />
            </FilterCell>
          </FilterBar>
        </div>

        <div className="overflow-x-auto">
          <table className={erp.table}>
            <thead>
              <tr>
                <th className={`${erp.th} w-[88px] text-center whitespace-nowrap`}>{tr('Ngày', 'Day')}</th>
                <th className={`${erp.th} text-left`}>{tr('Họ và tên', 'Full name')}</th>
                <th className={`${erp.th} text-left`}>{tr('Mã NV', 'Employee ID')}</th>
                <th className={`${erp.th} text-left`}>{tr('Division (Khối)', 'Division')}</th>
                <th className={`${erp.th} text-center`}>{tr('Ngày sinh', 'Date of birth')}</th>
                <th className={`${erp.th} text-left`}>{tr('Email nội bộ', 'Internal email')}</th>
                <th className={`${erp.th} text-left`}>{tr('Mail chúc mừng', 'Greeting mail')}</th>
                <th className={`${erp.th} text-left`} title={
                    TEAMS_POST_ENABLED
                      ? tr('Ảnh dùng cho box sinh nhật, bài Teams và mail chúc mừng', 'Photo used in the birthday box, Teams post and greeting mail')
                      : tr('Ảnh dùng cho box sinh nhật và mail chúc mừng', 'Photo used in the birthday box and greeting mail')
                  }>
                  {tr('Ảnh chúc mừng', 'Greeting photo')}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className={`${erp.td} py-10 text-center text-slate-400`}>
                    {tr('Không có nhân sự sinh nhật phù hợp điều kiện lọc.', 'No birthdays match the current filters.')}
                  </td>
                </tr>
              )}
              {rows.map((e) => {
                const b = birthdayInYear(e, year);
                const isToday = b.getTime() === today.getTime();
                return (
                  <tr key={e.id} className={isToday ? 'bg-[#fff6d6] hover:bg-[#fdefc0]' : erp.tr}>
                    {/* Ô cố định bề rộng: ngày + thứ (VI 2 ký tự "T2", EN 3 ký tự "Wed") luôn thẳng hàng, không xuống dòng */}
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <span className="inline-flex items-center w-full justify-center tabular-nums">
                        <span className={`w-[18px] text-right font-bold ${isToday ? 'text-[#b45309]' : 'text-slate-800'}`}>{String(b.getDate()).padStart(2, '0')}</span>
                        <span className="w-[14px] text-center text-slate-300">·</span>
                        <span className="w-[30px] text-left text-slate-400">{wdShort[b.getDay()]}</span>
                      </span>
                    </td>
                    <td className={erp.td}>
                      <div className="flex items-center gap-2">
                        <Avatar e={e} size={26} />
                        <span className="font-semibold text-slate-800">{e.name}</span>
                        {isToday && <Tag cls={TAG.amber} icon={Cake}>{tr('Hôm nay', 'Today')}</Tag>}
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
                    <td className={`${erp.td} whitespace-nowrap`}>
                      <PhotoCell e={e} year={year} toast={toast} locked={photoLocked(e)} />
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

/** Ảnh chúc mừng của 1 nhân sự: nguồn ảnh tự chuyển theo ảnh tải lên (không gạt tay); locked = ảnh đã được dùng. */
const PhotoCell: React.FC<{ e: MarcomEmployee; year: number; toast: (m: string) => void; locked: boolean }> = ({ e, year, toast, locked }) => {
  const { uploadPhoto, removePhoto } = useMarcom();
  const { tr } = useMarcomLang();
  const fileRef = useRef<HTMLInputElement>(null);
  const lockedTitle = TEAMS_POST_ENABLED
    ? tr('Ảnh đã được dùng (box trang chủ / Teams / mail) — không đổi ảnh được nữa', 'Photo already used (home box / Teams / mail) — it can no longer be changed')
    : tr('Ảnh đã được dùng (box trang chủ / mail) — không đổi ảnh được nữa', 'Photo already used (home box / mail) — it can no longer be changed');

  const onFile = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const f = ev.target.files?.[0];
    ev.target.value = '';
    if (!f) return;
    if (!f.type.startsWith('image/')) return toast(tr('Chỉ nhận file ảnh (PNG/JPG)', 'Only image files are accepted (PNG/JPG)'));
    if (f.size > MAX_IMAGE_BYTES) return toast(tr('Ảnh tối đa 5MB', 'Maximum image size is 5MB'));
    uploadPhoto(e.id, f, year);
    toast(tr(`Đã tải ảnh lên cho ${e.name}`, `Photo uploaded for ${e.name}`));
  };

  const options: { key: PhotoSource; label: string; title: string }[] = [
    {
      key: 'employee',
      label: 'Employee',
      title: e.employeePhotoUrl ? tr('Đang dùng ảnh trên hồ sơ Employee', 'Using the Employee profile photo') : tr('Hồ sơ Employee chưa có ảnh', 'Employee profile has no photo'),
    },
    {
      key: 'upload',
      label: tr('Tải lên', 'Upload'),
      title: e.uploadedPhotoName ? `${tr('Đang dùng ảnh tải lên', 'Using uploaded photo')}: ${e.uploadedPhotoName}` : tr('Tự chuyển sang khi tải ảnh lên', 'Switches automatically once a photo is uploaded'),
    },
  ];

  return (
    <div className="flex items-center gap-1">
      <div className="inline-flex h-6 border border-slate-300 rounded-[3px] overflow-hidden text-[11px] font-semibold select-none">
        {options.map((o) => (
          <span
            key={o.key}
            title={o.title}
            className={`px-2 flex items-center ${e.photoSource === o.key ? (locked ? 'bg-slate-400 text-white' : 'bg-[#1f5fa8] text-white') : 'bg-white text-slate-400'}`}
          >
            {o.label}
          </span>
        ))}
      </div>
      <button
        type="button"
        className={iconBtn}
        disabled={locked}
        onClick={() => fileRef.current?.click()}
        title={
          locked
            ? lockedTitle
            : e.uploadedPhotoUrl
              ? tr('Thay ảnh tải lên', 'Replace uploaded photo')
              : tr('Tải ảnh lên thay ảnh Employee', 'Upload a photo to replace the Employee photo')
        }
      >
        <Upload size={14} />
      </button>
      {e.uploadedPhotoUrl && (
        <button
          type="button"
          className={iconBtn}
          disabled={locked}
          onClick={() => {
            removePhoto(e.id);
            toast(tr(`Đã xoá ảnh tải lên của ${e.name} — dùng lại ảnh Employee`, `Removed uploaded photo of ${e.name} — back to the Employee photo`));
          }}
          title={locked ? lockedTitle : tr('Xoá ảnh tải lên, quay về ảnh Employee', 'Remove uploaded photo, back to the Employee photo')}
        >
          <Trash2 size={14} />
        </button>
      )}
      <button
        type="button"
        className={iconBtn}
        disabled={!e.photoUrl}
        onClick={() => downloadPhoto(e)}
        title={e.photoUrl ? tr('Tải ảnh đang dùng về máy', 'Download the photo in use') : tr('Hồ sơ Employee chưa có ảnh', 'Employee profile has no photo')}
      >
        <Download size={14} />
      </button>
      <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={onFile} />
    </div>
  );
};
