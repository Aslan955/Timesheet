import React, { useState, useMemo } from 'react';
import { 
  CalendarDays,
  Search,
  Filter,
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet,
  Lock,
  Unlock,
  Eye,
  ChevronRight,
  RefreshCw,
  Check,
  ArrowUp
} from 'lucide-react';

type HRStatus = 'OPEN' | 'REVIEW' | 'APPROVED' | 'BLOCK';

interface HREmployeeData {
  id: string;
  projectName: string;
  authorName: string;
  authorKey: string;
  pm: string;
  department: string;
  timeLog: number;
  attendance: number;
  status: HRStatus;
}

const MOCK_HR_DATA: HREmployeeData[] = [
  { id: '1', projectName: 'V.26.G.FX.103.66.S', authorName: 'BÙI NGỌC THANH TRÚC', authorKey: 'trucbnt', pm: 'BÙI NGỌC THANH TRÚC', department: 'Software Development', timeLog: 40, attendance: 40, status: 'OPEN' },
  { id: '2', projectName: 'ĐA-DỰ-ÁN', authorName: 'NGUYỄN VĂN AN', authorKey: 'annv', pm: 'NGUYỄN VĂN AN', department: 'Software Development', timeLog: 40, attendance: 40, status: 'REVIEW' },
  { id: '3', projectName: 'X.25.NB.ADB', authorName: 'BÙI NGỌC THANH TRÚC', authorKey: 'trucbnt', pm: 'BÙI NGỌC THANH TRÚC', department: 'Software Development', timeLog: 160, attendance: 160, status: 'APPROVED' },
  { id: '4', projectName: 'V.26.G.FX.103.66.S', authorName: 'BÙI QUANG TUYỀN', authorKey: 'tuyenbq', pm: 'BÙI QUANG TUYỀN', department: 'Backend Engineering', timeLog: 42, attendance: 40, status: 'BLOCK' },
  { id: '5', projectName: '022.060.2', authorName: 'BÙI THỊ HÀ', authorKey: 'habt', pm: 'BÙI THỊ HÀ', department: 'QA & Testing', timeLog: 168, attendance: 168, status: 'OPEN' },
  { id: '6', projectName: '838.168.2', authorName: 'BÙI THỊ KIM DUNG', authorKey: 'dungbtk', pm: 'BÙI THỊ KIM DUNG', department: 'Data Analytics', timeLog: 40, attendance: 40, status: 'REVIEW' },
  { id: '7', projectName: 'V.25.G.RD.C12.43', authorName: 'BÙI VĂN ĐOÀN', authorKey: 'doanbv', pm: 'BÙI VĂN ĐOÀN', department: 'R&D Center', timeLog: 160, attendance: 160, status: 'APPROVED' },
  { id: '8', projectName: '012.010.2', authorName: 'BÙI VĂN ĐOÀN', authorKey: 'doanbv', pm: 'BÙI VĂN ĐOÀN', department: 'R&D Center', timeLog: 40, attendance: 40, status: 'BLOCK' },
  { id: '9', projectName: 'H99.212.2', authorName: 'CAO BẮC TIẾN', authorKey: 'tiencb', pm: 'CAO BẮC TIẾN', department: 'IoT Solutions', timeLog: 40, attendance: 40, status: 'OPEN' },
  { id: '10', projectName: 'ICU.565', authorName: 'CAO BẮC TIẾN', authorKey: 'tiencb', pm: 'CAO BẮC TIẾN', department: 'IoT Solutions', timeLog: 160, attendance: 160, status: 'REVIEW' },
  { id: '11', projectName: 'X.24.NB.PMO', authorName: 'HỒ TÚ ANH', authorKey: 'anht', pm: 'HỒ TÚ ANH', department: 'PMO Office', timeLog: 40, attendance: 40, status: 'APPROVED' },
];

const HR_WEEKS = [
  { id: 0, label: 'Cả tháng', range: '01-30/09' },
  { id: 1, label: 'Tuần 1', range: '01-06/09' },
  { id: 2, label: 'Tuần 2', range: '07-13/09' },
  { id: 3, label: 'Tuần 3', range: '14-20/09' },
  { id: 4, label: 'Tuần 4', range: '21-27/09' },
];

export const HRTimesheetPage: React.FC = () => {
  const [selectedWeek, setSelectedWeek] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeFilterTab, setActiveFilterTab] = useState<'ALL' | 'LATE_SUBMIT' | 'LATE_APPROVE'>('ALL');

  const stats = useMemo(() => {
    const total = MOCK_HR_DATA.length;
    const compliant = MOCK_HR_DATA.filter(d => d.status === 'APPROVED').length;
    const missing = MOCK_HR_DATA.filter(d => d.status === 'OPEN').length;
    const mismatch = MOCK_HR_DATA.filter(d => d.status === 'REVIEW').length;
    const overdue = MOCK_HR_DATA.filter(d => d.status === 'BLOCK').length;
    
    return { total, compliant, missing, mismatch, overdue };
  }, []);

  const filteredData = useMemo(() => {
    return MOCK_HR_DATA.filter(item => {
      // 1. Text Search Filter
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const match = item.authorName.toLowerCase().includes(query) || 
                      item.authorKey.toLowerCase().includes(query) || 
                      item.projectName.toLowerCase().includes(query);
        if (!match) return false;
      }
      
      // 2. Tab Filter
      if (activeFilterTab === 'LATE_SUBMIT') {
        // Dữ liệu giả lập cho Submit muộn (Trạng thái là BLOCK hoặc OPEN nhưng chưa submit)
        if (item.status !== 'BLOCK') return false; 
      }
      if (activeFilterTab === 'LATE_APPROVE') {
        // Dữ liệu giả lập cho Duyệt muộn (Đang REVIEW quá hạn SLA)
        if (item.status !== 'REVIEW') return false;
      }
      
      return true;
    });
  }, [searchTerm, activeFilterTab]);

  const isAllSelected = filteredData.length > 0 && selectedIds.length === filteredData.length;

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedIds([]);
    else setSelectedIds(filteredData.map(item => item.id));
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <>
      {/* 1. Breadcrumb / Header Area */}
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
             <span className="text-slate-800 text-xl">HR Compliance</span>
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
                 value={selectedWeek}
                 onChange={(e) => setSelectedWeek(Number(e.target.value))}
               >
                 {HR_WEEKS.map(w => (
                   <option key={w.id} value={w.id}>
                     {w.label} {w.range ? `(${w.range})` : ''}
                   </option>
                 ))}
               </select>
             </div>
           </div>
         </div>

         {/* 3. Alerts */}
         {stats.overdue > 0 ? (
           <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg flex items-center justify-between text-sm shadow-sm mb-4">
             <div className="flex items-center space-x-3 text-red-800">
               <AlertCircle size={18} className="text-red-500" />
               <span>Có <strong className="font-bold">{stats.overdue} nhân sự</strong> quá hạn submit Timesheet. Đã tự động khóa kỳ công.</span>
             </div>
           </div>
         ) : stats.mismatch > 0 || stats.missing > 0 ? (
           <div className="bg-orange-50 border-l-4 border-orange-500 p-3 rounded-r-lg flex items-center justify-between text-sm shadow-sm mb-4">
             <div className="flex items-center space-x-3 text-orange-800">
               <AlertTriangle size={18} className="text-orange-500" />
               <span>Có <strong className="font-bold">{stats.mismatch + stats.missing} nhân sự</strong> có dấu hiệu lệch giờ hoặc thiếu công chưa giải trình.</span>
             </div>
           </div>
         ) : null}

         {/* 4. Summary Cards */}
         <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-4">
           {/* Card 1 */}
           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Đúng hạn & đủ công</div>
             <div className="flex items-baseline space-x-1 mb-1">
               <span className="text-2xl font-black text-slate-800">{stats.compliant}</span>
               <span className="text-xs text-slate-500 font-medium">nhân sự</span>
             </div>
             <div className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-200 pt-3 mt-3">
               Đã tuân thủ quy định
             </div>
           </div>

           {/* Card 2 */}
           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-red-300 transition-colors">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Vi phạm chênh lệch</div>
             <div className="flex items-baseline space-x-1 mb-1">
               <span className={`text-2xl font-black ${stats.missing > 0 ? 'text-red-600' : 'text-slate-800'}`}>{stats.missing}</span>
               <span className="text-xs text-slate-500 font-medium">nhân sự</span>
             </div>
             <div className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-200 pt-3 mt-3">
               Thiếu công hoặc lệch giờ
             </div>
           </div>

           {/* Card 3 */}
           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-orange-300 transition-colors">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Chờ duyệt</div>
             <div className="flex items-baseline space-x-1 mb-1">
               <span className={`text-2xl font-black ${stats.mismatch > 0 ? 'text-orange-500' : 'text-slate-800'}`}>{stats.mismatch}</span>
               <span className="text-xs text-slate-500 font-medium">nhân sự</span>
             </div>
             <div className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-200 pt-3 mt-3">
               Nhân sự đang chờ duyệt
             </div>
           </div>

           {/* Card 4 */}
           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-purple-300 transition-colors">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quá hạn submit</div>
             <div className="flex items-baseline space-x-1 mb-1">
               <span className={`text-2xl font-black ${stats.overdue > 0 ? 'text-purple-600' : 'text-slate-800'}`}>{stats.overdue}</span>
               <span className="text-xs text-slate-500 font-medium">nhân sự</span>
             </div>
             <div className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-200 pt-3 mt-3">
               Bị khóa tự động
             </div>
           </div>
           
           {/* Card 5 */}
           <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-rose-300 transition-colors">
             <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Quá hạn duyệt</div>
             <div className="flex items-baseline space-x-1 mb-1">
               <span className={`text-2xl font-black text-rose-600`}>1</span>
               <span className="text-xs text-slate-500 font-medium">timesheet</span>
             </div>
             <div className="text-xs text-slate-500 mt-auto pt-2 border-t border-slate-200 pt-3 mt-3">
               Vi phạm SLA
             </div>
           </div>
         </div>

         {/* 5. Main Data Card */}
         <div className="bg-white border border-slate-300 rounded shadow-sm">
           
           {/* Filter Tabs (Mới thêm) */}
           <div className="flex items-center px-4 py-3 border-b border-slate-200 gap-6 overflow-x-auto no-scrollbar">
             <button 
               onClick={() => setActiveFilterTab('ALL')}
               className={`whitespace-nowrap pb-1 text-[13px] font-bold border-b-2 transition-colors ${activeFilterTab === 'ALL' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Toàn bộ danh sách
             </button>
             <button 
               onClick={() => setActiveFilterTab('LATE_SUBMIT')}
               className={`whitespace-nowrap pb-1 text-[13px] font-bold border-b-2 transition-colors ${activeFilterTab === 'LATE_SUBMIT' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Submit muộn
             </button>
             <button 
               onClick={() => setActiveFilterTab('LATE_APPROVE')}
               className={`whitespace-nowrap pb-1 text-[13px] font-bold border-b-2 transition-colors ${activeFilterTab === 'LATE_APPROVE' ? 'border-orange-500 text-orange-500' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
             >
               Approve muộn
             </button>
           </div>

           {/* Top Actions Bar (Đẩy xuống dưới Filter Tabs) */}
           <div className="flex items-center justify-between p-3 border-b border-slate-200">
             <div className="flex items-center space-x-6">
               <button className="flex items-center space-x-1.5 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors cursor-pointer">
                 <Unlock size={18} strokeWidth={2.5} />
                 <span>Mở khóa hàng loạt</span>
               </button>
               <button className="flex items-center space-x-1.5 text-slate-600 hover:text-slate-700 text-sm font-medium transition-colors cursor-pointer">
                 <Lock size={18} strokeWidth={2.5} />
                 <span>Khóa hàng loạt</span>
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
             <div className="relative">
               <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
               <input 
                 type="text" 
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 placeholder="Search Employee..." 
                 className="pl-8 pr-3 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:border-blue-400 w-64 text-slate-700" 
               />
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
                 {filteredData.map((item, idx) => {
                   const isSelected = selectedIds.includes(item.id);
                   
                   const isRed = item.status === 'OPEN' || item.status === 'BLOCK';
                   const textColor = isRed ? 'text-rose-600 font-medium' : 'text-slate-700';

                   let statusBadge = null;
                   if (item.status === 'OPEN') {
                     statusBadge = <span className="inline-block px-3 py-0.5 border border-slate-300 text-slate-500 text-[11px] font-bold rounded-full uppercase shadow-sm bg-white">OPEN</span>;
                   } else if (item.status === 'REVIEW') {
                     statusBadge = <span className="inline-block px-3 py-0.5 border border-sky-300 text-sky-500 text-[11px] font-bold rounded-full uppercase shadow-sm bg-white">REVIEW</span>;
                   } else if (item.status === 'APPROVED') {
                     statusBadge = <span className="inline-block px-3 py-0.5 border border-emerald-400 text-emerald-600 text-[11px] font-bold rounded-full uppercase shadow-sm bg-white">APPROVED</span>;
                   } else if (item.status === 'BLOCK') {
                     statusBadge = <span className="inline-block px-3 py-0.5 border border-rose-300 text-rose-500 text-[11px] font-bold rounded-full uppercase shadow-sm bg-white">BLOCK</span>;
                   }

                   return (
                     <tr 
                       key={item.id} 
                       className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50' : ''}`}
                     >
                       <td className="py-2 px-3 text-center border-r border-slate-200">
                         <div className="flex justify-center">
                           <div 
                             className={`w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer ${isSelected ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'}`}
                             onClick={() => toggleSelectOne(item.id)}
                           >
                             {isSelected && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                           </div>
                         </div>
                       </td>
                       <td className={`py-2 px-3 text-center border-r border-slate-200 ${textColor}`}>
                         {idx + 1}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 ${textColor}`}>
                         {item.projectName}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 uppercase ${textColor}`}>
                         {item.authorName}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 ${textColor}`}>
                         {item.authorKey}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 uppercase ${textColor}`}>
                         {item.pm}
                       </td>
                       <td className={`py-2 px-3 border-r border-slate-200 ${textColor}`}>
                         {item.department}
                       </td>
                       <td className={`py-2 px-3 text-right pr-4 border-r border-slate-200 ${textColor}`}>
                         {item.timeLog}
                       </td>
                       <td className={`py-2 px-3 text-right pr-4 border-r border-slate-200 ${textColor}`}>
                         {item.attendance || ''}
                       </td>
                       <td className="py-2 px-3 border-r border-slate-200 text-center">
                         {statusBadge}
                       </td>
                       <td className="py-2 px-3 text-center">
                         <div className="flex items-center justify-center space-x-2 text-blue-500">
                           <button className="hover:text-blue-700 cursor-pointer transition-colors" title="View details">
                             <Eye size={15} strokeWidth={2.5} />
                           </button>
                           {(item.status === 'OPEN' || item.status === 'REVIEW') && (
                              <button className="hover:text-blue-700 cursor-pointer transition-colors" title="Approve">
                                <Check size={16} strokeWidth={3} />
                              </button>
                           )}
                           {item.status === 'BLOCK' && (
                             <button className="text-purple-600 hover:text-purple-700 cursor-pointer transition-colors" title="Unlock">
                               <Unlock size={15} strokeWidth={2.5} />
                             </button>
                           )}
                           <button 
                             className={`transition-colors ${item.status === 'BLOCK' ? 'text-slate-300 cursor-not-allowed' : 'hover:text-blue-700 cursor-pointer'}`} 
                             title="Reject / Disable"
                             disabled={item.status === 'BLOCK'}
                           >
                             <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
                           </button>
                         </div>
                       </td>
                     </tr>
                   );
                 })}
                 
                 {filteredData.length === 0 && (
                   <tr>
                     <td colSpan={10} className="py-8 text-center text-slate-500 text-sm">
                       Không tìm thấy dữ liệu.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
         </div>
      </div>
    </>
  );
};
