/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { LeavesPage } from './components/LeavesPage';
import { TimesheetPage } from './components/TimesheetPage';
import { LeaveBalancesPage } from './components/LeaveBalancesPage';
import { SystemConfigurationPage } from './components/SystemConfigurationPage';
import { DashboardPage } from './components/DashboardPage';
import { RequestManagementPage } from './components/RequestManagementPage';
import { AttendancePage } from './components/AttendancePage';
import { AttendanceSummaryPage } from './components/AttendanceSummaryPage';
import { DependentPage } from './components/DependentPage';
import { ProjectsPage } from './components/ProjectsPage';
import { OnsiteReportPage } from './components/OnsiteReportPage';
import { LeaveReportPage } from './components/LeaveReportPage';
import { CandidatePage } from './components/CandidatePage';
import { CandidateDetailV2Page } from './components/CandidateDetailV2Page';
import { CatalogPage } from './components/CatalogPage';
import { CatalogProvider, CATALOG_DEFS } from './catalog/CatalogContext';

export default function App() {
  const [activeItem, setActiveItem] = useState('Overview');

  const renderContent = () => {
    // Mỗi danh mục tuyển dụng là 1 màn riêng (định tuyến theo tên danh mục)
    const catalogDef = CATALOG_DEFS.find((d) => d.label === activeItem);
    if (catalogDef) {
      return <CatalogPage catalogKey={catalogDef.key} />;
    }

    switch (activeItem) {
      case 'Overview':
        return <DashboardPage onNavigate={setActiveItem} />;
      case 'Projects':
        return <ProjectsPage />;
      case 'Leaves':
        return <LeavesPage />;
      case 'Timesheet':
        return <TimesheetPage />;
      case 'Chấm công':
        return <AttendancePage />;
      case 'Tổng hợp công':
        return <AttendanceSummaryPage />;
      case 'Báo cáo Onsite':
        return <OnsiteReportPage />;
      case 'Phép cá nhân':
        return <LeaveBalancesPage />;
      case 'Báo cáo nghỉ phép nhân sự':
      case 'Leaves Report':
        return <LeaveReportPage onNavigate={setActiveItem} />;
      case 'Request Management':
      case 'Quản lý Đơn từ':
        return <RequestManagementPage />;
      case 'System Configuration':
        return <SystemConfigurationPage />;
      case 'Thông tin người phụ thuộc':
        return <DependentPage />;
      case 'Quản lý ứng viên':
      case 'Ứng viên':
        return <CandidatePage />;
      case 'Chi tiết ứng viên (Giao diện mới)':
        return <CandidateDetailV2Page />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
            <div className="text-4xl font-bold bg-gray-200/50 p-8 rounded-2xl border border-gray-300/50 text-gray-400">
              {activeItem}
            </div>
            <p className="text-lg">This section is currently under development.</p>
          </div>
        );
    }
  };

  return (
    <CatalogProvider>
      <Layout activeItem={activeItem} onSelect={setActiveItem}>
        {renderContent()}
      </Layout>
    </CatalogProvider>
  );
}
