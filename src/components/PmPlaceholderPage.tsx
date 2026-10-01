/**
 * PmPlaceholderPage — khung trống cho các màn bổ sung của module Project Management
 * (Tổng quan, Mục tiêu kinh doanh, Công nợ phải thu, Dòng tiền, Nhật ký dự án).
 * Nội dung chi tiết sẽ được xây dựng sau theo mô tả nghiệp vụ.
 */
import React from 'react';
import { Construction } from 'lucide-react';
import { ErpPage, ErpTitleBar, Panel } from './erp/Erp';

export const PmPlaceholderPage: React.FC<{ title: string; icon?: React.ElementType }> = ({ title, icon = Construction }) => (
  <ErpPage>
    <ErpTitleBar crumbs={['Quản trị dự án & Tài chính', title]} title={title} />
    <Panel title={title} icon={icon}>
      <div className="flex flex-col items-center justify-center text-center py-16 text-slate-500">
        <Construction size={30} className="text-slate-400 mb-3" />
        <p className="text-[14px] font-semibold text-slate-700">Màn hình đang được xây dựng</p>
        <p className="text-[12.5px] mt-1">Nội dung màn “{title}” sẽ được bổ sung theo mô tả nghiệp vụ.</p>
      </div>
    </Panel>
  </ErpPage>
);
