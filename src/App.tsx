/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Layout } from './components/Layout';
import { LeavesPage } from './components/LeavesPage';
import { TimesheetPage } from './components/TimesheetPage';
import { TimesheetApprovalPage } from './components/TimesheetApprovalPage';
import { LeaveBalancesPage } from './components/LeaveBalancesPage';
import { SystemConfigurationPage } from './components/SystemConfigurationPage';
import { DashboardPage } from './components/DashboardPage';
import { RequestManagementPage } from './components/RequestManagementPage';
import { AttendancePage } from './components/AttendancePage';
import { AttendanceSummaryPage } from './components/AttendanceSummaryPage';
import { DependentPage } from './components/DependentPage';
import { ProjectsPage } from './components/ProjectsPage';
import { ProjectFinancePage } from './components/ProjectFinancePage';
import { RevenuePlanPage } from './components/RevenuePlanPage';
import { CompanyOverviewPage } from './components/CompanyOverviewPage';
import { PayrollApprovalPage } from './components/PayrollApprovalPage';
import { PayrollListPage } from './components/PayrollListPage';
import { PayrollProvider } from './payroll/PayrollContext';
import { ProjectLaborCostPage } from './components/ProjectLaborCostPage';
import { FinancePlanProvider } from './finance/FinancePlanContext';
import { BusinessProjectPage } from './components/BusinessProjectPage';
import { PmPlaceholderPage } from './components/PmPlaceholderPage';
import { BizTargetPage, BizTargetProvider } from './components/BizTargetPage';
import { PM_PLACEHOLDER_SCREENS } from './constants';
import { BizReportPage } from './components/BizReportPage';
import { BlockPlanPage } from './components/BlockPlanPage';
import { BlockPlanProvider } from './business/BlockPlanContext';
import { OverviewPage } from './components/OverviewPage';
import { BusinessProjectProvider } from './business/BusinessProjectContext';
import { OnsiteReportPage } from './components/OnsiteReportPage';
import { LeaveReportPage } from './components/LeaveReportPage';
import { CandidatePage } from './components/CandidatePage';
import { CandidateDetailV2Page } from './components/CandidateDetailV2Page';
import { CatalogPage } from './components/CatalogPage';
import { CatalogProvider, CATALOG_DEFS } from './catalog/CatalogContext';
import { RecruitmentRequestPage } from './components/RecruitmentRequestPage';
import { RecruitmentProvider } from './recruitment/RecruitmentContext';
import { CandidateProvider } from './candidates/CandidateContext';
import { EmailProvider } from './email/EmailContext';
import { EmailTemplatePage } from './components/EmailTemplatePage';

export default function App() {
  const [activeItem, setActiveItem] = useState('Mục tiêu kinh doanh'); // màn mở mặc định khi vào hệ thống

  const renderContent = () => {
    // Mỗi danh mục tuyển dụng là 1 màn riêng (định tuyến theo tên danh mục)
    const catalogDef = CATALOG_DEFS.find((d) => d.label === activeItem);
    if (catalogDef) {
      return <CatalogPage catalogKey={catalogDef.key} />;
    }
    // Recruitment 2 (skin v2) — cùng bố cục module 1, giao diện style mới
    if (activeItem.endsWith(' · V2')) {
      const base = activeItem.slice(0, -' · V2'.length);
      if (base === 'Quản lý ứng viên') return <CandidatePage skin="v2" />;
      if (base === 'Yêu cầu tuyển dụng') return <RecruitmentRequestPage skin="v2" />;
      if (base === 'Mẫu email') return <EmailTemplatePage skin="v2" />;
      const catV2 = CATALOG_DEFS.find((d) => d.label === base);
      if (catV2) return <CatalogPage catalogKey={catV2.key} skin="v2" />;
    }

    // Các màn bổ sung của Project Management (khung trống, làm nội dung sau)
    if (PM_PLACEHOLDER_SCREENS[activeItem]) return <PmPlaceholderPage key={activeItem} title={PM_PLACEHOLDER_SCREENS[activeItem]} />;

    switch (activeItem) {
      case 'Overview':
        return <DashboardPage onNavigate={setActiveItem} />;
      case 'Projects':
        return <ProjectsPage />;
      case 'Dự án kinh doanh':
        return <BusinessProjectPage />;
      case 'PM · Tổng quan':
        return <OverviewPage />;
      case 'Mục tiêu kinh doanh':
        return <BizTargetPage />;
      case 'Báo cáo hiệu quả dự án':
        return <BizReportPage onNavigate={setActiveItem} />;
      case 'Lập kế hoạch khối':
        return <BlockPlanPage />;
      case 'Thông tin tài chính dự án':
        return <ProjectFinancePage />;
      case 'Kế hoạch thu chi':
        return <RevenuePlanPage />;
      case 'Toàn cảnh thu chi':
        return <CompanyOverviewPage />;
      case 'Duyệt bảng lương khối':
        return <PayrollApprovalPage />;
      case 'Payroll':
        return <PayrollListPage onNavigate={setActiveItem} />;
      case 'Leaves':
        return <LeavesPage />;
      case 'Timesheet':
        return <TimesheetPage />;
      case 'Duyệt Timesheet':
        return <TimesheetApprovalPage />;
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
      case 'Yêu cầu tuyển dụng':
        return <RecruitmentRequestPage />;
      case 'Quản lý ứng viên':
      case 'Ứng viên':
        return <CandidatePage />;
      case 'Chi tiết ứng viên (Giao diện mới)':
        return <CandidateDetailV2Page />;
      case 'Mẫu email':
        return <EmailTemplatePage />;
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
      <RecruitmentProvider>
        <CandidateProvider>
          <EmailProvider>
            <FinancePlanProvider>
              <BusinessProjectProvider>
                <BizTargetProvider>
                  <PayrollProvider>
                    <BlockPlanProvider>
                      <Layout activeItem={activeItem} onSelect={setActiveItem}>
                        {renderContent()}
                      </Layout>
                    </BlockPlanProvider>
                  </PayrollProvider>
                </BizTargetProvider>
              </BusinessProjectProvider>
            </FinancePlanProvider>
          </EmailProvider>
        </CandidateProvider>
      </RecruitmentProvider>
    </CatalogProvider>
  );
}
