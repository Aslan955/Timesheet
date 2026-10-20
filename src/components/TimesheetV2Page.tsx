import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  Search,
  Filter,
  RefreshCw,
  FileSpreadsheet,
  Check,
  Eye,
  ArrowUp,
  AlertTriangle,
  AlertCircle,
  CalendarDays
} from 'lucide-react';
import { MOCK_TIMESHEETS, TimesheetEntry } from '../constants';

import { PersonalTimesheetCalendarV2 } from './PersonalTimesheetCalendarV2';
import { HRTimesheetPage } from './HRTimesheetPage';
import { ProjectTimesheetPage } from './ProjectTimesheetPage';
import { Calendar, Users, ShieldCheck, Briefcase } from 'lucide-react';

export const TimesheetV2Page: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(24 * 3600 - 1);
  React.useEffect(() => {
    const timer = setInterval(() => setTimeLeft(prev => prev > 0 ? prev - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);
  const h = Math.floor(timeLeft / 3600).toString().padStart(2, '0');
  const m = Math.floor((timeLeft % 3600) / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  const countdownStr = `${h}:${m}:${s}`;

  const [mainViewMode, setMainViewMode] = useState<'Project Timesheet' | 'Personal Calendar' | 'Manager Approval' | 'HR Admin'>('Project Timesheet');
  // V2 có thêm trạng thái BLOCK — dữ liệu mẫu dùng chung giữ nguyên cho màn Timesheet cũ
  const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(() =>
    MOCK_TIMESHEETS.map(t => (t.id === 'TS-003' ? { ...t, status: 'BLOCK' } : t))
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProject, setSelectedProject] = useState('All');
  const [selectedManagerWeek, setSelectedManagerWeek] = useState<number>(3);

  const MANAGER_WEEKS = [
    { id: 0, label: 'Cả tháng', range: '01-30/09' },
    { id: 1, label: 'Tuần 1', range: '01-06/09' },
    { id: 2, label: 'Tuần 2', range: '07-13/09' },
    { id: 3, label: 'Tuần 3', range: '14-20/09' },
    { id: 4, label: 'Tuần 4', range: '21-27/09' },
    { id: 5, label: 'Tuần 5', range: '28-30/09' },
  ];

  const managerStats = useMemo(() => {
    const uniqueMembers = new Set(timesheets.map(t => t.authorKey)).size;
    const uniqueProjects = new Set(timesheets.map(t => t.projectName)).size;
    const pendingCount = timesheets.filter(t => t.status === 'REVIEW').length;
    const overdueCount = timesheets.filter(t => t.status === 'BLOCK').length; 
    
    const processedCount = timesheets.filter(t => t.status === 'APPROVED' || t.status === 'REJECTED').length;
    const totalCount = timesheets.length;
    // Giả lập 2 bản ghi sắp hết hạn SLA
    const approachingSlaCount = 2; 

    return {
      projects: uniqueProjects,
      members: uniqueMembers || 12,
      pending: pendingCount,
      overdue: overdueCount,
      approachingSla: approachingSlaCount,
      processed: processedCount,
      total: totalCount,
      progressPct: totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0
    };
  }, [timesheets]);

  // Filter Logic
  const uniqueProjects = useMemo(() => {
    const projects = new Set(timesheets.map(t => t.projectName));
    return Array.from(projects);
  }, [timesheets]);

  const filteredTimesheets = useMemo(() => {
    return timesheets.filter(item => {
      const matchProject = selectedProject === 'All' || item.projectName === selectedProject;
      if (!matchProject) return false;
      
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        return item.projectCode.toLowerCase().includes(query) || 
               item.projectName.toLowerCase().includes(query) ||
               item.authorName.toLowerCase().includes(query);
      }
      return true;
    });
  }, [timesheets, searchTerm, selectedProject]);

  const isAllSelected = filteredTimesheets.length > 0 && filteredTimesheets.every(t => selectedIds.includes(t.id));

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTimesheets.map(t => t.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const handleApproveSelected = () => {
    setTimesheets(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, status: 'APPROVED' } : t));
    setSelectedIds([]);
  };

  const handleRejectSelected = () => {
    setTimesheets(prev => prev.map(t => selectedIds.includes(t.id) ? { ...t, status: 'REJECTED' } : t));
    setSelectedIds([]);
  };

  return (
    <div className="bg-slate-100 min-h-screen font-sans text-slate-800">
      
      <div className="p-4 sm:p-6 bg-slate-50/50 space-y-5">
        {/* Mode Switcher Bar */}
        <div className="bg-slate-900 text-white p-2.5 px-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-300">Chế độ xem:</span>
            <div className="flex bg-slate-800 p-1 rounded-xl flex-wrap gap-1">
              <button
                onClick={() => setMainViewMode('Project Timesheet')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewMode === 'Project Timesheet' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Briefcase size={14} />
                <span>Bảng công dự án</span>
              </button>
              <button
                onClick={() => setMainViewMode('Personal Calendar')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewMode === 'Personal Calendar' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Calendar size={14} />
                <span>Timesheet cá nhân</span>
              </button>
              <button
                onClick={() => setMainViewMode('Manager Approval')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewMode === 'Manager Approval' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Users size={14} />
                <span>Duyệt Timesheet Dự Án (Manager)</span>
              </button>
              <button
                onClick={() => setMainViewMode('HR Admin')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
                  mainViewMode === 'HR Admin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck size={14} />
                <span>Giám Sát Tuân Thủ (HCNS)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {mainViewMode === 'Project Timesheet' ? (
        <ProjectTimesheetPage />
      ) : mainViewMode === 'Personal Calendar' ? (
        <div className="px-4 sm:px-6 pb-6"><PersonalTimesheetCalendarV2 /></div>
      ) : mainViewMode === 'HR Admin' ? (
        <HRTimesheetPage />
      ) : (
        <>
          {/* 1. Breadcrumb / Header Area (Simulated outside the card) */}
      <div className="bg-slate-50 border-b border-slate-200">
         <div className="flex flex-col">
           <div className="flex items-center px-4 py-3 text-lg font-medium text-slate-700">
             <div className="flex items-center cursor-pointer hover:text-slate-900 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-slate-600"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
               <span className="text-xl">Home</span>
             </div>
             <ChevronRight size={22} className="text-slate-500 mx-1.5" />
             <span className="cursor-pointer hover:text-slate-900 transition-colors text-xl">Timekeeping</span>
             <ChevronRight size={22} className="text-slate-500 mx-1.5" />
             <span className="text-slate-800 text-xl">Timesheet V2</span>
           </div>
         </div>
      </div>

      <div className="px-4 py-2">
         {/* 2. Filter Bar */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3 rounded-lg border border-slate-200 shadow-sm gap-4 mb-4">
           <div className="flex items-center space-x-3">
             <div className="flex items-center space-x-2">
               <CalendarDays size={18} className="text-slate-500" />
               <select className="font-bold text-slate-800 bg-transparent outline-none cursor-pointer text-sm">
                 <option>Tháng 09/2026</option>
                 <option>Tháng 08/2026</option>
               </select>
             </div>
             <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
             
             <div className="flex items-center">
               <select 
                 className="font-medium text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 outline-none cursor-pointer text-sm hover:border-slate-300"
                 value={selectedManagerWeek}
                 onChange={(e) => setSelectedManagerWeek(Number(e.target.value))}
               >
                 {MANAGER_WEEKS.map(w => (
                   <option key={w.id} value={w.id}>
                     {w.label} {w.range ? `(${w.range})` : ''}
                   </option>
                 ))}
               </select>
             </div>
           </div>
         </div>

         {/* 3. Alerts */}
         {managerStats.overdue > 0 ? (
           <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg flex items-center justify-between text-sm shadow-sm mb-4">
             <div className="flex items-center space-x-3 text-red-800">
               <AlertCircle size={18} className="text-red-500" />
               <span>Có <strong className="font-bold">{managerStats.overdue} timesheet</strong> đã quá thời gian duyệt theo quy định (SLA 48h). Vui lòng duyệt gấp!</span>
             </div>
           </div>
         ) : managerStats.pending > 0 ? (
           <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg flex items-center justify-between text-sm shadow-sm mb-4">
             <div className="flex items-center space-x-3 text-orange-800">
               <AlertTriangle size={18} className="text-orange-500" />
               <span>Bạn có <strong className="font-bold">{managerStats.pending} timesheet</strong> đang chờ duyệt.</span>
             </div>
           </div>
         ) : null}

         {/* 4. Summary Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
           {/* Card 1 */}
           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Dự Án Được Assign</div>
             <div className="flex items-baseline space-x-1 mb-1">
               <span className="text-2xl font-black text-slate-800">{managerStats.projects}</span>
               <span className="text-xs text-slate-500 font-medium">dự án</span>
             </div>
             <div className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-200 pt-3 mt-3">
               Đang quản lý
             </div>
           </div>

           {/* Card 2 */}
           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Timesheet Chờ Duyệt</div>
             <div className="flex items-baseline space-x-1 mb-1">
               <span className={`text-2xl font-black ${managerStats.pending > 0 ? 'text-orange-500' : 'text-slate-800'}`}>{managerStats.pending}</span>
               <span className="text-xs text-slate-500 font-medium">timesheet</span>
             </div>
             <div className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-200 pt-3 mt-3">
               Cần phê duyệt sớm
             </div>
           </div>

           {/* Card 3 */}
           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-red-300 transition-colors">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quá Hạn Duyệt</div>
             <div className="flex items-baseline space-x-1 mb-1">
               <span className={`text-2xl font-black ${managerStats.overdue > 0 ? 'text-red-600' : 'text-slate-800'}`}>{managerStats.overdue}</span>
               <span className="text-xs text-slate-500 font-medium">timesheet</span>
             </div>
             <div className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-200 pt-3 mt-3">
               Vi phạm SLA
             </div>
           </div>
           
           {/* Card 4 - Sắp đến hạn */}
           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-amber-300 transition-colors">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center space-x-1">
               <span>Sắp Đến Hạn SLA</span>
             </div>
             <div className="flex items-baseline mb-1">
               <span className="text-[26px] leading-[32px] font-black tracking-tight text-amber-500">{countdownStr}</span>
             </div>
             <div className="mt-auto"></div>
           </div>

         </div>

         {/* 5. Main Data Card */}
         <div className="bg-white border border-slate-300 rounded shadow-sm">
           
           {/* Top Actions Bar */}
           <div className="flex items-center justify-between p-3 border-b border-slate-200">
             <div className="flex items-center space-x-6">
               <button 
                 onClick={handleApproveSelected}
                 className="flex items-center space-x-1.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors cursor-pointer"
               >
                 <Check size={18} strokeWidth={2.5} />
                 <span>Approve Selection</span>
               </button>
               <button 
                 onClick={handleRejectSelected}
                 className="flex items-center space-x-1.5 text-rose-500 hover:text-rose-600 text-sm font-medium transition-colors cursor-pointer"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                 <span>Reject Selection</span>
               </button>
             </div>
             <div className="flex items-center space-x-6">
               <button className="flex items-center space-x-1.5 text-slate-800 hover:text-black text-sm font-medium transition-colors cursor-pointer">
                 <FileSpreadsheet size={16} strokeWidth={2.5} />
                 <span>Export to XLSX</span>
               </button>
               <button className="flex items-center space-x-1.5 text-amber-500 hover:text-amber-600 text-sm font-medium transition-colors cursor-pointer">
                 <RefreshCw size={16} strokeWidth={2.5} />
                 <span>Migrate Data</span>
               </button>
             </div>
           </div>

           {/* Grouping / Search Bar */}
           <div className="flex items-center justify-between p-3 border-b border-slate-200 bg-white">
             <span className="text-sm text-slate-600">
               Drag a column header here to group by that column
             </span>
             <div className="flex items-center gap-3">
               {/* Project Filter Dropdown */}
               <div className="relative">
                 <Filter size={14} className="absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
                 <select
                   value={selectedProject}
                   onChange={(e) => setSelectedProject(e.target.value)}
                   className="pl-8 pr-8 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-400 w-48 text-slate-700 appearance-none bg-white cursor-pointer"
                 >
                   <option value="All">All dự án</option>
                   {uniqueProjects.map(proj => (
                     <option key={proj} value={proj}>{proj}</option>
                   ))}
                 </select>
                 <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-500 pointer-events-none" />
               </div>

               <div className="relative">
                 <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                 <input 
                   type="text" 
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   placeholder="Enter text to search..." 
                   className="pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-400 w-64 text-slate-700" 
                 />
               </div>
             </div>
           </div>

           {/* Table */}
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse min-w-max">
               <thead>
                 <tr className="bg-slate-50 border-b border-slate-200 text-[13px] text-slate-800 font-bold">
                   <th className="py-2.5 px-3 w-10 text-center border-r border-slate-200">
                     <div className="flex justify-center">
                       <div 
                         className={`w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer ${isAllSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-400'}`}
                         onClick={toggleSelectAll}
                       >
                         {isAllSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                       </div>
                     </div>
                   </th>
                   <th className="py-2.5 px-3 w-10 text-center border-r border-slate-200 font-bold">#</th>
                   <th className="py-2.5 px-3 border-r border-slate-200 font-bold">
                     <div className="flex items-center justify-between">
                       <span>ProjectName</span>
                       <Filter size={14} className="text-slate-400 cursor-pointer" />
                     </div>
                   </th>
                   <th className="py-2.5 px-3 border-r border-slate-200 font-bold">
                     <div className="flex items-center justify-between">
                       <span>AuthorName</span>
                       <div className="flex items-center space-x-1.5">
                         <ArrowUp size={14} className="text-slate-800 cursor-pointer" strokeWidth={2.5} />
                         <Filter size={14} className="text-slate-400 cursor-pointer" />
                       </div>
                     </div>
                   </th>
                   <th className="py-2.5 px-3 border-r border-slate-200 font-bold">
                     <div className="flex items-center justify-between">
                       <span>AuthorKey</span>
                       <Filter size={14} className="text-slate-400 cursor-pointer" />
                     </div>
                   </th>
                   <th className="py-2.5 px-3 border-r border-slate-200 font-bold">
                     <div className="flex items-center justify-between">
                       <span>PM</span>
                       <Filter size={14} className="text-slate-400 cursor-pointer" />
                     </div>
                   </th>
                   <th className="py-2.5 px-3 border-r border-slate-200 font-bold">
                     <div className="flex items-center justify-between">
                       <span>Department</span>
                       <Filter size={14} className="text-slate-400 cursor-pointer" />
                     </div>
                   </th>
                   <th className="py-2.5 px-3 border-r border-slate-200 font-bold">
                     <div className="flex items-center justify-between">
                       <span>Time Log</span>
                       <Filter size={14} className="text-slate-400 cursor-pointer" />
                     </div>
                   </th>
                   <th className="py-2.5 px-3 border-r border-slate-200 font-bold">
                     <div className="flex items-center justify-between">
                       <span>Attenda..</span>
                     </div>
                   </th>
                   <th className="py-2.5 px-3 border-r border-slate-200 text-center font-bold">
                     <div className="flex items-center justify-center space-x-1">
                       <span>Status</span>
                       <Filter size={14} className="text-slate-400 cursor-pointer" />
                     </div>
                   </th>
                   <th className="py-2.5 px-3 border-slate-200 text-center font-bold">
                     Actions
                   </th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 text-[13px] text-slate-700 bg-white">
                 {filteredTimesheets.slice(0, 15).map((item, idx) => {
                   const isSelected = selectedIds.includes(item.id);
                   const isRed = [0, 1, 4, 5, 6, 7, 11].includes(idx);
                   const textColor = isRed ? 'text-rose-600 font-medium' : 'text-slate-700';

                   return (
                     <tr 
                       key={item.id} 
                       className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                     >
                       <td className="py-2 px-3 text-center border-r border-slate-200">
                         <div className="flex justify-center">
                           <div 
                             className={`w-4 h-4 rounded-sm border flex items-center justify-center ${item.status === 'BLOCK' ? 'bg-slate-100 border-slate-200 cursor-not-allowed opacity-50' : `cursor-pointer ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}`}`}
                             onClick={() => item.status !== 'BLOCK' && toggleSelectOne(item.id)}
                           >
                             {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                           </div>
                         </div>
                       </td>
                       <td className={`py-2 px-3 text-center border-r border-slate-200 ${textColor}`}>
                         {idx + 1}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 ${textColor}`}>
                         {item.projectCode}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 uppercase ${textColor}`}>
                         {item.authorName}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 ${textColor}`}>
                         {item.authorKey}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 uppercase ${textColor}`}>
                         {item.authorName}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 ${textColor}`}>
                         {item.department || 'G2'}
                       </td>
                       <td className={`py-2 px-3 text-right pr-4 border-r border-slate-200 ${textColor}`}>
                         {item.jiraHours > 0 ? item.jiraHours.toString().replace('.0', '') : ''}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 ${textColor}`}>
                         
                       </td>
                       <td className="py-2 px-3 border-r border-slate-200 text-center">
                         {item.status === 'REVIEW' && (
                           <span className="inline-block px-3 py-0.5 border border-sky-300 text-sky-500 text-[11px] font-semibold rounded-full uppercase">
                             REVIEW
                           </span>
                         )}
                         {item.status === 'APPROVED' && (
                           <span className="inline-block px-3 py-0.5 border border-emerald-300 text-emerald-500 text-[11px] font-semibold rounded-full uppercase">
                             APPROVED
                           </span>
                         )}
                         {item.status === 'REJECTED' && (
                           <span className="inline-block px-3 py-0.5 border border-rose-300 text-rose-500 text-[11px] font-semibold rounded-full uppercase">
                             REJECTED
                           </span>
                         )}
                         {item.status === 'BLOCK' && (
                           <span className="inline-block px-3 py-0.5 border border-rose-300 text-rose-500 text-[11px] font-semibold rounded-full uppercase">BLOCK</span>
                         )}
                       </td>
                       <td className="py-2 px-3 text-center">
                         <div className="flex items-center justify-center space-x-2">
                           <button className="text-blue-500 hover:text-blue-700 cursor-pointer transition-colors" title="View">
                             <Eye size={15} strokeWidth={2.5} />
                           </button>
                           {(item.status === 'REVIEW' || item.status === 'BLOCK') && (
                             <button 
                               className={`transition-colors ${item.status === 'BLOCK' ? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700 cursor-pointer'}`} 
                               title="Approve"
                               disabled={item.status === 'BLOCK'}
                             >
                               <Check size={16} strokeWidth={3} />
                             </button>
                           )}
                           <button 
                             className={`transition-colors ${item.status === 'BLOCK' ? 'text-slate-300 cursor-not-allowed' : 'text-blue-500 hover:text-blue-700 cursor-pointer'}`} 
                             title="Reject" 
                             disabled={item.status === 'BLOCK'}
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                           </button>
                         </div>
                       </td>
                     </tr>
                   );
                 })}
                 
                 {filteredTimesheets.length === 0 && (
                   <tr>
                     <td colSpan={11} className="py-8 text-center text-slate-500 text-sm">
                       No records found
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>
      </div>
        </>
      )}
    </div>
  );
};

export default TimesheetV2Page;
