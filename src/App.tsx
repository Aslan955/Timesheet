/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { Layout } from './components/Layout';
import { LeavesPage } from './components/LeavesPage';
import { TimesheetPage } from './components/TimesheetPage';
import { TimesheetApprovalPage } from './components/TimesheetApprovalPage';
import { TimesheetV2Page } from './components/TimesheetV2Page';
import { ProjectTimesheetPage } from './components/ProjectTimesheetPage';
import { LeaveBalancesPage } from './components/LeaveBalancesPage';
import { SystemConfigurationPage } from './components/SystemConfigurationPage';
import { DashboardPage } from './components/DashboardPage';
import { RequestManagementPage } from './components/RequestManagementPage';
import { AttendancePage } from './components/AttendancePage';
import { AttendanceSummaryPage } from './components/AttendanceSummaryPage';
import { DependentPage } from './components/DependentPage';
import { EmployeePage } from './components/EmployeePage';
import { ContractsPage } from './components/ContractsPage';
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
import { PmoProvider } from './pmo/PmoContext';
import { PmoCockpitPage } from './components/pmo/PmoCockpitPage';
import { PmoPortfolioPage } from './components/pmo/PmoPortfolioPage';
import { PmoInboxPage } from './components/pmo/PmoInboxPage';
import { PmoProjectPage } from './components/pmo/PmoProjectPage';
import { PmoPnlPage } from './components/pmo/PmoPnlPage';
import { PmoReportPage } from './components/pmo/PmoReportPage';
import { PmoAlertPage } from './components/pmo/PmoAlertPage';
import { PmoAllocationPage } from './components/pmo/PmoAllocationPage';
import { PmoResourceRequestPage } from './components/pmo/PmoResourceRequestPage';
import { PmoCapacityPage } from './components/pmo/PmoCapacityPage';
import { PmoTimesheetPage } from './components/pmo/PmoTimesheetPage';
import { PmoUserRolePage } from './components/pmo/PmoUserRolePage';
import { PmoIntegrationPage } from './components/pmo/PmoIntegrationPage';
import { PmoRateCardPage } from './components/pmo/PmoRateCardPage';
import { PmoKhoiConfigPage } from './components/pmo/PmoKhoiConfigPage';
import { PmoAuditPage } from './components/pmo/PmoAuditPage';
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
import { PeriodicEvaluationPage } from './components/PeriodicEvaluationPage';
import { MarcomProvider } from './marcom/MarcomContext';
import { BirthdayListPage } from './components/marcom/BirthdayListPage';
import { WelcomeOnboardPage } from './components/marcom/WelcomeOnboardPage';
import { MarcomEmailPage } from './components/marcom/MarcomEmailPage';

export default function App() {
  const [activeItem, setActiveItem] = useState('Mục tiêu kinh doanh'); // màn mở mặc định khi vào hệ thống
  // Chuyển màn từ bên trong một màn khác (vd hồ sơ nhân viên → Hợp đồng lao động)
  useEffect(() => {
    const go = (ev: Event) => setActiveItem((ev as CustomEvent<{ item: string }>).detail.item);
    window.addEventListener('imis:navigate', go);
    return () => window.removeEventListener('imis:navigate', go);
  }, []);

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
      case 'Project Cockpit':
        return <PmoCockpitPage onNavigate={setActiveItem} />;
      case 'Portfolio khối':
        return <PmoPortfolioPage key="khoi" scope="khoi" onNavigate={setActiveItem} />;
      case 'Portfolio TCT':
        return <PmoPortfolioPage key="tct" scope="tct" onNavigate={setActiveItem} />;
      case 'Inbox phê duyệt':
        return <PmoInboxPage onNavigate={setActiveItem} />;
      case 'Khối P&L':
        return <PmoPnlPage onNavigate={setActiveItem} />;
      case 'Dự án PMO':
        return <PmoProjectPage onNavigate={setActiveItem} />;
      case 'Heatmap allocation':
        return <PmoAllocationPage onNavigate={setActiveItem} />;
      case 'Yêu cầu & điều chuyển':
        return <PmoResourceRequestPage onNavigate={setActiveItem} />;
      case 'Dự báo capacity':
        return <PmoCapacityPage onNavigate={setActiveItem} />;
      case 'Báo cáo dự án':
        return <PmoReportPage onNavigate={setActiveItem} />;
      case 'Trung tâm cảnh báo':
        return <PmoAlertPage onNavigate={setActiveItem} />;
      case 'Timesheet theo WP':
        return <PmoTimesheetPage onNavigate={setActiveItem} />;
      case 'Người dùng & role':
        return <PmoUserRolePage onNavigate={setActiveItem} />;
      case 'Trung tâm tích hợp':
        return <PmoIntegrationPage onNavigate={setActiveItem} />;
      case 'Rate card & overhead':
        return <PmoRateCardPage onNavigate={setActiveItem} />;
      case 'Cấu hình khối':
        return <PmoKhoiConfigPage onNavigate={setActiveItem} />;
      case 'Audit log':
        return <PmoAuditPage onNavigate={setActiveItem} />;
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
      case 'Timesheet V2':
        return <TimesheetV2Page />;
      case 'Bảng công dự án':
      case 'Timesheet Dự Án':
        return <ProjectTimesheetPage />;
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
      case 'Sinh nhật nhân sự':
        return <BirthdayListPage />;
      case 'Welcome Onboard':
        return <WelcomeOnboardPage />;
      case 'Email tự động MarCom':
        return <MarcomEmailPage />;
      case 'Đánh giá định kỳ':
      case 'Cảnh báo đánh giá định kỳ':
      case 'Danh sách đánh giá':
        return <PeriodicEvaluationPage />;
      case 'Employees':
        return <EmployeePage />;
      case 'Contracts':
        return <ContractsPage />;
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
                      <PmoProvider>
                        <MarcomProvider>
                          <Layout activeItem={activeItem} onSelect={setActiveItem}>
                            {renderContent()}
                          </Layout>
                        </MarcomProvider>
                      </PmoProvider>
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
