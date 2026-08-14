import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Wallet, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  Download, 
  Printer, 
  History, 
  ChevronRight, 
  X, 
  Check, 
  Clock, 
  Sparkles, 
  FileSpreadsheet, 
  User, 
  ArrowUpDown,
  ShieldCheck,
  AlertCircle,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MOCK_EMPLOYEE_LEAVE_REPORTS, 
  EmployeeLeaveReportData, 
  LeaveHistoryItem 
} from '../constants';

interface LeaveReportPageProps {
  onNavigate?: (page: string) => void;
}

export const LeaveReportPage: React.FC<LeaveReportPageProps> = ({ onNavigate }) => {
  const [reports, setReports] = useState<EmployeeLeaveReportData[]>(MOCK_EMPLOYEE_LEAVE_REPORTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'remaining' | 'used' | 'granted'>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Selected employee for view history drawer
  const [historyModalEmployee, setHistoryModalEmployee] = useState<EmployeeLeaveReportData | null>(null);

  // Selection State for Checkboxes
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const departments = ['all', 'Development', 'Tester', 'Designer', 'HR', 'Production', 'Marketing'];

  // Filter & Sort Logic
  const filteredReports = useMemo(() => {
    return reports
      .filter(item => {
        const matchesQuery = 
          item.employeeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.username.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = selectedDept === 'all' || item.department === selectedDept;
        return matchesQuery && matchesDept;
      })
      .sort((a, b) => {
        let valA: any = a.employeeId;
        let valB: any = b.employeeId;

        if (sortBy === 'name') {
          valA = a.employeeName;
          valB = b.employeeName;
        } else if (sortBy === 'remaining') {
          valA = a.remainingDays;
          valB = b.remainingDays;
        } else if (sortBy === 'used') {
          valA = a.usedDays;
          valB = b.usedDays;
        } else if (sortBy === 'granted') {
          valA = a.grantedDays;
          valB = b.grantedDays;
        }

        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
  }, [reports, searchQuery, selectedDept, sortBy, sortOrder]);

  // Toggle select individual employee
  const toggleSelectEmp = (empId: string) => {
    setSelectedIds(prev => 
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  // Toggle select all filtered employees
  const isAllSelected = useMemo(() => {
    if (filteredReports.length === 0) return false;
    return filteredReports.every(r => selectedIds.includes(r.employeeId));
  }, [filteredReports, selectedIds]);

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReports.map(r => r.employeeId));
    }
  };

  // Quick Adjustment Modal state
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedEmpIdForAdjust, setSelectedEmpIdForAdjust] = useState('');
  const [adjustType, setAdjustType] = useState<'plus' | 'minus'>('plus');
  const [adjustAmount, setAdjustAmount] = useState('1');
  const [adjustReason, setAdjustReason] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Totals calculations
  const totalEmployees = filteredReports.length;
  const totalGranted = filteredReports.reduce((acc, curr) => acc + curr.grantedDays, 0);
  const totalUsed = filteredReports.reduce((acc, curr) => acc + curr.usedDays, 0);
  const totalRemaining = filteredReports.reduce((acc, curr) => acc + curr.remainingDays, 0);

  // Handle manual leave adjustment submission
  const handlePerformAdjustment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmpIdForAdjust) {
      triggerToast('⚠️ Vui lòng chọn nhân viên cần điều chỉnh!');
      return;
    }

    const amount = parseFloat(adjustAmount) || 0;
    if (amount <= 0) {
      triggerToast('⚠️ Số ngày điều chỉnh phải lớn hơn 0!');
      return;
    }

    setReports(prev => prev.map(emp => {
      if (emp.employeeId === selectedEmpIdForAdjust) {
        const isPlus = adjustType === 'plus';
        const newGranted = isPlus ? emp.grantedDays + amount : emp.grantedDays;
        const newRemaining = isPlus ? emp.remainingDays + amount : Math.max(0, emp.remainingDays - amount);
        const newUsed = !isPlus ? emp.usedDays + amount : emp.usedDays;

        const newHistoryItem: LeaveHistoryItem = {
          id: `H-${Date.now()}`,
          date: new Date().toLocaleString('vi-VN').replace(',', ''),
          type: adjustType,
          amount: amount,
          reason: adjustReason || (isPlus ? 'Cộng phép thủ công bởi HR' : 'Trừ phép thủ công bởi HR'),
          performer: 'HR Admin',
          balanceAfter: newRemaining
        };

        return {
          ...emp,
          grantedDays: newGranted,
          remainingDays: newRemaining,
          usedDays: newUsed,
          history: [newHistoryItem, ...emp.history]
        };
      }
      return emp;
    }));

    const targetEmp = reports.find(r => r.employeeId === selectedEmpIdForAdjust);
    const actionText = adjustType === 'plus' ? `Cộng ${amount} ngày` : `Trừ ${amount} ngày`;
    triggerToast(`🎉 Đã ${actionText} phép thành công cho ${targetEmp?.employeeName || selectedEmpIdForAdjust}!`);

    setIsAdjustModalOpen(false);
    setAdjustAmount('1');
    setAdjustReason('');
  };

  const handleExportExcel = () => {
    const count = selectedIds.length > 0 ? selectedIds.length : filteredReports.length;
    triggerToast(`📥 Đã xuất dữ liệu ${count} nhân sự ra tập tin Báo_cáo_nghỉ_phép_2026.xlsx thành công!`);
  };

  const handleExportCSV = () => {
    const targetData = selectedIds.length > 0 
      ? filteredReports.filter(r => selectedIds.includes(r.employeeId))
      : filteredReports;

    const headers = ["Mã NV", "Tên nhân viên", "User", "Phòng ban", "Chức danh", "Phép còn lại", "Phép đã dùng", "Số phép được cộng", "Lịch sử biến động"];
    const rows = targetData.map(emp => [
      emp.employeeId,
      `"${emp.employeeName}"`,
      `"@${emp.username}"`,
      `"${emp.department}"`,
      `"${emp.position}"`,
      emp.remainingDays,
      emp.usedDays,
      emp.grantedDays,
      `"${emp.history.length} lượt"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Bao_cao_nghi_phep_${selectedIds.length > 0 ? 'da_chon' : 'tat_ca'}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast(`📊 Đã xuất tập tin CSV (${targetData.length} nhân sự) thành công!`);
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-transparent min-h-full space-y-6 font-sans select-none">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-[100] bg-slate-900/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700/50 flex items-center space-x-3 text-xs font-bold pointer-events-auto"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-[#0fa57c] animate-ping" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-3 border-b border-slate-200/60">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">
              Báo Cáo Ngày Nghỉ Phép Nhân Sự
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0fa57c]/10 text-[#0fa57c] border border-[#0fa57c]/20 uppercase">
              Module HR & Tiền Lương
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            Tổng hợp và theo dõi số dư phép, phép đã dùng, số phép được cộng và nhật ký biến động phép của toàn bộ nhân viên.
          </p>
        </div>

        {/* Action Header Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => setIsAdjustModalOpen(true)}
            className="px-4 py-2 bg-[#0fa57c] hover:bg-[#0fa57c]/90 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-950/20 transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Plus size={15} />
            <span>Cộng / Trừ phép nhanh</span>
          </button>
          
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <FileSpreadsheet size={15} className="text-emerald-600" />
            <span>Xuất Excel</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <Download size={15} className="text-blue-600" />
            <span>Xuất CSV</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 shadow-xs cursor-pointer active:scale-95"
          >
            <Printer size={15} className="text-slate-500" />
            <span>In Báo cáo</span>
          </button>
        </div>
      </div>

      {/* Floating Selection Batch Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="bg-slate-900 text-white p-3.5 px-5 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 border border-slate-700/60"
          >
            <div className="flex items-center space-x-3">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0fa57c] animate-pulse" />
              <span className="text-xs font-black">
                Đã chọn <span className="text-[#0fa57c] font-mono text-sm px-1.5 py-0.5 bg-slate-800 rounded">{selectedIds.length}</span> nhân sự
              </span>
            </div>

            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={handleExportExcel}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <FileSpreadsheet size={14} />
                <span>Xuất Excel ({selectedIds.length})</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Download size={14} />
                <span>Xuất CSV ({selectedIds.length})</span>
              </button>

              <button
                onClick={() => {
                  if (selectedIds.length === 1) {
                    setSelectedEmpIdForAdjust(selectedIds[0]);
                  }
                  setIsAdjustModalOpen(true);
                }}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <PlusCircle size={14} />
                <span>Cộng/Trừ phép</span>
              </button>

              <button
                onClick={() => setSelectedIds([])}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Bỏ chọn
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Tổng Nhân Sự */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tổng nhân sự trong báo cáo</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-slate-800 font-mono">{totalEmployees}</span>
              <span className="text-xs font-bold text-slate-400">nhân viên</span>
            </div>
            <p className="text-[10px] font-bold text-slate-400">Tất cả phòng ban</p>
          </div>
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users size={20} />
          </div>
        </div>

        {/* KPI 2: Tổng Phép Được Cộng */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Số phép được cộng</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-[#0fa57c] font-mono">+{totalGranted.toFixed(1)}</span>
              <span className="text-xs font-bold text-slate-400">ngày</span>
            </div>
            <p className="text-[10px] font-bold text-emerald-600">Thâm niên + Chế độ + Thưởng</p>
          </div>
          <div className="p-3 bg-emerald-50 text-[#0fa57c] rounded-xl">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* KPI 3: Tổng Phép Đã Dùng */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Số phép đã sử dụng</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-rose-600 font-mono">{totalUsed.toFixed(1)}</span>
              <span className="text-xs font-bold text-slate-400">ngày</span>
            </div>
            <p className="text-[10px] font-bold text-rose-500">Nghỉ phép năm & việc riêng</p>
          </div>
          <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
            <TrendingDown size={20} />
          </div>
        </div>

        {/* KPI 4: Phép Còn Lại */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tổng số phép còn lại</span>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-black text-indigo-600 font-mono">{totalRemaining.toFixed(1)}</span>
              <span className="text-xs font-bold text-slate-400">ngày</span>
            </div>
            <p className="text-[10px] font-bold text-indigo-500">Khả dụng năm {selectedYear}</p>
          </div>
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Wallet size={20} />
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Search Field */}
        <div className="relative flex-1 min-w-[240px]">
          <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm theo Mã NV, Tên nhân viên, User..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:border-[#0fa57c] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Department & Year Filters */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center space-x-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Phòng ban:</label>
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-[#0fa57c] cursor-pointer"
            >
              {departments.map(d => (
                <option key={d} value={d}>
                  {d === 'all' ? 'Tất cả phòng ban' : d}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Năm:</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-[#0fa57c] cursor-pointer"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
            </select>
          </div>

          {/* Sorting */}
          <div className="flex items-center space-x-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Sắp xếp:</label>
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 rounded-xl px-3 py-2 outline-none focus:border-[#0fa57c] cursor-pointer"
            >
              <option value="id">Mã nhân viên</option>
              <option value="name">Tên nhân viên</option>
              <option value="remaining">Phép còn lại</option>
              <option value="used">Phép đã dùng</option>
              <option value="granted">Số phép được cộng</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors cursor-pointer"
              title="Đảo chiều sắp xếp"
            >
              <ArrowUpDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* REPORT DATA TABLE WITH ALL REQUESTED COLUMNS STRICTLY PRESENT */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-50 text-[#0fa57c] rounded-lg">
              <Wallet size={16} />
            </div>
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Danh Sách Báo Cáo Phép Nhân Sự (Hiển Thị {filteredReports.length} Nhân Viên)
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Dữ liệu đồng bộ realtime với Ledger Quản lý Phép
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[950px]">
            <thead>
              <tr className="border-b border-slate-200/80 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider bg-slate-50">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={toggleSelectAll}
                    title={isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
                    className="w-4 h-4 rounded text-[#0fa57c] accent-[#0fa57c] cursor-pointer"
                  />
                </th>
                <th className="py-3 px-4">1. Mã nhân viên</th>
                <th className="py-3 px-4">2. Tên nhân viên</th>
                <th className="py-3 px-4">3. User</th>
                <th className="py-3 px-4 text-center">4. Phép còn lại</th>
                <th className="py-3 px-4 text-center">5. Phép đã dùng</th>
                <th className="py-3 px-4 text-center">6. Số phép được cộng</th>
                <th className="py-3 px-4 text-center">7. Lịch sử cộng trừ phép</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredReports.map((emp) => {
                const isSelected = selectedIds.includes(emp.employeeId);
                return (
                  <tr 
                    key={emp.employeeId} 
                    className={`transition-colors group ${isSelected ? 'bg-emerald-50/40' : 'hover:bg-slate-50/60'}`}
                  >
                    
                    {/* CHECKBOX COLUMN AT FRONT */}
                    <td className="py-3.5 px-3.5 w-10 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleSelectEmp(emp.employeeId)}
                        className="w-4 h-4 rounded text-[#0fa57c] accent-[#0fa57c] cursor-pointer"
                      />
                    </td>

                    {/* COL 1: Mã nhân viên */}
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200/60">
                        {emp.employeeId}
                      </span>
                    </td>

                  {/* COL 2: Tên nhân viên */}
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    <div className="flex items-center space-x-3">
                      <img
                        src={emp.avatar}
                        alt={emp.employeeName}
                        className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-black text-slate-800">{emp.employeeName}</div>
                        <div className="text-[10px] text-slate-400 font-semibold">{emp.position} • <span className="text-slate-500 font-bold">{emp.department}</span></div>
                      </div>
                    </div>
                  </td>

                  {/* COL 3: User */}
                  <td className="py-3.5 px-4 font-mono text-slate-600 font-semibold">
                    <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                      @{emp.username}
                    </span>
                  </td>

                  {/* COL 4: Phép còn lại */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-[#0fa57c] font-black font-mono rounded-xl border border-emerald-100 text-xs">
                      {emp.remainingDays.toFixed(1)} ngày
                    </span>
                  </td>

                  {/* COL 5: Phép đã dùng */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold font-mono text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-100">
                      {emp.usedDays.toFixed(1)} ngày
                    </span>
                  </td>

                  {/* COL 6: Số phép được cộng */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="font-bold font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl border border-blue-100">
                      +{emp.grantedDays.toFixed(1)} ngày
                    </span>
                  </td>

                  {/* COL 7: Lịch sử cộng trừ phép */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => setHistoryModalEmployee(emp)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-[#0fa57c] hover:text-white text-slate-700 text-[11px] font-bold rounded-xl transition-all border border-slate-200/80 flex items-center space-x-1.5 mx-auto cursor-pointer group/btn"
                    >
                      <History size={13} className="text-[#0fa57c] group-hover/btn:text-white transition-colors" />
                      <span>{emp.history.length} Lượt biến động</span>
                      <ChevronRight size={13} />
                    </button>
                  </td>

                </tr>
                );
              })}

              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                    Không tìm thấy dữ liệu báo cáo nghỉ phép phù hợp với bộ lọc!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DRAWER / MODAL: LỊCH SỬ CỘNG TRỪ PHÉP (LEAVE HISTORY TIMELINE) */}
      <AnimatePresence>
        {historyModalEmployee && (
          <div className="fixed inset-0 z-[110] flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setHistoryModalEmployee(null)}
              className="absolute inset-0 bg-black/30 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white h-screen shadow-2xl flex flex-col z-10"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={historyModalEmployee.avatar}
                    alt={historyModalEmployee.employeeName}
                    className="w-12 h-12 rounded-xl border border-slate-700 object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h3 className="font-black text-sm text-white flex items-center gap-2">
                      <span>{historyModalEmployee.employeeName}</span>
                      <span className="px-2 py-0.5 bg-[#0fa57c] text-white text-[10px] font-extrabold rounded font-mono">
                        {historyModalEmployee.employeeId}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-300 font-medium">
                      User: @{historyModalEmployee.username} • {historyModalEmployee.department}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setHistoryModalEmployee(null)}
                  className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Leave Balances Quick Summary inside Drawer */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Số phép được cộng</span>
                  <span className="text-sm font-black text-blue-600 font-mono">+{historyModalEmployee.grantedDays.toFixed(1)} ngày</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-slate-200/60">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block">Phép đã dùng</span>
                  <span className="text-sm font-black text-rose-600 font-mono">{historyModalEmployee.usedDays.toFixed(1)} ngày</span>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="text-[9px] font-bold text-[#0fa57c] uppercase block">Phép còn lại</span>
                  <span className="text-sm font-black text-emerald-800 font-mono">{historyModalEmployee.remainingDays.toFixed(1)} ngày</span>
                </div>
              </div>

              {/* Timeline Header */}
              <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <History size={14} className="text-[#0fa57c]" />
                  <span>Nhật Ký Biến Động Phép (Ledger)</span>
                </h4>
                <span className="text-[10px] font-bold text-slate-400">
                  {historyModalEmployee.history.length} giao dịch
                </span>
              </div>

              {/* Timeline Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 relative before:absolute before:left-9 before:top-6 before:bottom-6 before:w-0.5 before:bg-slate-200">
                {historyModalEmployee.history.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4 relative z-10">
                    {/* Timeline Node Badge */}
                    <div className={`w-6 h-6 rounded-full border-2 border-white shadow-xs flex items-center justify-center shrink-0 mt-1 ${
                      item.type === 'plus' ? 'bg-[#0fa57c] text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {item.type === 'plus' ? <Plus size={12} className="stroke-[3px]" /> : <Minus size={12} className="stroke-[3px]" />}
                    </div>

                    {/* Timeline Content Box */}
                    <div className="flex-1 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/60 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">{item.date}</span>
                        <span className={`text-xs font-black font-mono ${
                          item.type === 'plus' ? 'text-[#0fa57c]' : 'text-rose-600'
                        }`}>
                          {item.type === 'plus' ? '+' : '-'}{item.amount.toFixed(1)} ngày
                        </span>
                      </div>

                      <p className="text-xs font-bold text-slate-800">
                        {item.reason}
                      </p>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px] text-slate-400 font-medium">
                        <span>Người thực hiện: <strong className="text-slate-600">{item.performer}</strong></span>
                        <span>Số dư sau: <strong className="text-slate-700 font-mono">{item.balanceAfter.toFixed(1)}d</strong></span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
                <button
                  onClick={() => setHistoryModalEmployee(null)}
                  className="px-5 py-2 bg-slate-800 text-white text-xs font-bold rounded-xl hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Đóng cửa sổ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CỘNG / TRỪ PHÉP NHANH (QUICK LEAVE ADJUSTMENT MODAL) */}
      <AnimatePresence>
        {isAdjustModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdjustModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl z-10"
            >
              <div className="p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-[#0fa57c] text-white rounded-xl">
                    <Wallet size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-wider">Cộng / Trừ Phép Nhân Viên</h3>
                    <p className="text-[10px] text-slate-300 font-semibold">Điều chỉnh quỹ phép và ghi nhật ký tự động</p>
                  </div>
                </div>
                <button onClick={() => setIsAdjustModalOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handlePerformAdjustment} className="p-6 space-y-4 text-xs">
                {/* Employee Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Chọn Nhân Viên *</label>
                  <select
                    required
                    value={selectedEmpIdForAdjust}
                    onChange={(e) => setSelectedEmpIdForAdjust(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 outline-none focus:border-[#0fa57c]"
                  >
                    <option value="">-- Chọn nhân viên từ danh sách --</option>
                    {reports.map(r => (
                      <option key={r.employeeId} value={r.employeeId}>
                        {r.employeeId} - {r.employeeName} (@{r.username}) - Phép hiện tại: {r.remainingDays}d
                      </option>
                    ))}
                  </select>
                </div>

                {/* Adjustment Action Type */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Thao tác điều chỉnh *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAdjustType('plus')}
                      className={`p-3 rounded-xl border font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                        adjustType === 'plus'
                          ? 'bg-emerald-50 border-[#0fa57c] text-[#0fa57c] shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <PlusCircle size={16} />
                      <span>Cộng phép (+)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdjustType('minus')}
                      className={`p-3 rounded-xl border font-bold flex items-center justify-center space-x-2 cursor-pointer transition-all ${
                        adjustType === 'minus'
                          ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <MinusCircle size={16} />
                      <span>Trừ phép (-)</span>
                    </button>
                  </div>
                </div>

                {/* Amount of Days */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Số ngày điều chỉnh *</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={adjustAmount}
                    onChange={(e) => setAdjustAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold font-mono text-slate-800 outline-none focus:border-[#0fa57c]"
                  />
                </div>

                {/* Reason */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Lý do điều chỉnh *</label>
                  <textarea
                    required
                    rows={3}
                    value={adjustReason}
                    onChange={(e) => setAdjustReason(e.target.value)}
                    placeholder="Nhập chi tiết lý do (e.g. Cấp phép kết hôn, thưởng thành tích, trừ do nghỉ bù quá hạn...)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:border-[#0fa57c] resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAdjustModalOpen(false)}
                    className="px-4 py-2 text-slate-500 font-bold hover:text-slate-700 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#0fa57c] hover:bg-[#0fa57c]/90 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
                  >
                    Xác nhận điều chỉnh
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default LeaveReportPage;
