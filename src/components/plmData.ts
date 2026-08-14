import { Project, ProjectCodes, ProjectStages, CostChangeRequests, ApprovalLog } from './plmTypes';

// Initial Mock Projects
export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'PRJ-101',
    customer_code: 'VIN',
    project_name: 'Hệ thống Quản lý Lưu kho Thông minh Vinamilk 2026',
    sale_id: 'sale-01',
    sale_name: 'Nguyễn Nam (AM)',
    status: 'Draft',
    created_at: '2026-06-15 09:30',
  },
  {
    id: 'PRJ-102',
    customer_code: 'BIDV',
    project_name: 'Ứng dụng Di động Tài chính Số BIDV thế hệ mới',
    sale_id: 'sale-02',
    sale_name: 'Trần Văn Hùng (AM)',
    status: 'Pending_GDKhoi',
    created_at: '2026-06-18 14:15',
  },
  {
    id: 'PRJ-103',
    customer_code: 'VTX',
    project_name: 'Hệ thống Camera AI Đô thị Thông minh Hà Nội',
    sale_id: 'sale-01',
    sale_name: 'Nguyễn Nam (AM)',
    status: 'Active',
    created_at: '2026-06-01 10:00',
  },
  {
    id: 'PRJ-104',
    customer_code: 'LCA',
    project_name: 'Hạ tầng lưu trữ đám mây Sở Lào Cai',
    sale_id: 'sale-03',
    sale_name: 'Lê Thu Trang (AM)',
    status: 'Closed',
    created_at: '2026-05-10 11:20',
  }
];

// Initial Project Codes Map
export const INITIAL_PROJECT_CODES: ProjectCodes[] = [
  {
    id: 'CODE-103',
    project_id: 'PRJ-103',
    master_code: 'VTX.502',
    sale_code: 'VTX.502.1',
    production_code: 'VTX.502.2',
    outsource_codes: ['VTX.502.2.1', 'VTX.502.2.2']
  },
  {
    id: 'CODE-104',
    project_id: 'PRJ-104',
    master_code: 'LCA.128',
    sale_code: 'LCA.128.1',
    production_code: 'LCA.128.2',
    outsource_codes: ['LCA.128.2.1']
  }
];

// Initial Stages and Cost items inside
export const INITIAL_PROJECT_STAGES: ProjectStages[] = [
  // PRJ-101 (Draft)
  {
    id: 'STAGE-101-1',
    project_id: 'PRJ-101',
    stage_name: 'Khảo sát hiện trạng & Thiết kế nghiệp vụ thầu',
    order_index: 0,
    start_date: '2026-07-01',
    end_date: '2026-07-31',
    costs: [
      { id: 'COST-101-1-1', stage_id: 'STAGE-101-1', item_name: 'Công tác phí khảo sát hiện trường các nhà máy', amount: 35000000, description: 'Chi phí đi lại, ăn ở cho 3 kỹ sư giải pháp tại 4 tỉnh.' },
      { id: 'COST-101-1-2', stage_id: 'STAGE-101-1', item_name: 'Thuê chuyên gia thiết kế kiến trúc hệ thống', amount: 80000000, description: 'Chuyên gia tư vấn ngoài tối ưu sơ đồ kho thông minh.' }
    ]
  },
  {
    id: 'STAGE-101-2',
    project_id: 'PRJ-101',
    stage_name: 'Xây dựng bản Demo & Thử nghiệm kỹ thuật',
    order_index: 1,
    start_date: '2026-08-01',
    end_date: '2026-09-15',
    costs: [
      { id: 'COST-101-2-1', stage_id: 'STAGE-101-2', item_name: 'Mua bản quyền phần mềm mô phỏng 3D', amount: 120000000, description: 'Phục vụ dựng mô hình ảo chứng minh năng lực với Vinamilk.' },
      { id: 'COST-101-2-2', stage_id: 'STAGE-101-2', item_name: 'Mua thiết bị cảm biến IoT demo', amount: 45000000, description: '5 bộ cảm biến tiệm cận thử nghiệm truyền tải dữ liệu.' }
    ]
  },

  // PRJ-102 (Pending_GDKhoi)
  {
    id: 'STAGE-102-1',
    project_id: 'PRJ-102',
    stage_name: 'Lập Giải pháp tổng thể & Trình bày Hội đồng BIDV',
    order_index: 0,
    start_date: '2026-07-15',
    end_date: '2026-08-15',
    costs: [
      { id: 'COST-102-1-1', stage_id: 'STAGE-102-1', item_name: 'Thiết kế giao diện UI/UX mẫu', amount: 150000000, description: 'Thuê Agency ngoài thiết kế 15 màn hình chính ứng dụng BIDV Pay.' },
      { id: 'COST-102-1-2', stage_id: 'STAGE-102-1', item_name: 'Tổ chức hội thảo kỹ thuật chuyên sâu', amount: 40000000, description: 'Thuê phòng họp, teabreak tiếp đón đại diện khối Công nghệ BIDV.' }
    ]
  },
  {
    id: 'STAGE-102-2',
    project_id: 'PRJ-102',
    stage_name: 'Ký kết thỏa thuận khung & Triển khai MVP',
    order_index: 1,
    start_date: '2026-08-16',
    end_date: '2026-12-31',
    costs: [
      { id: 'COST-102-2-1', stage_id: 'STAGE-102-2', item_name: 'Ngân sách thiết lập cổng tích hợp API CoreBanking', amount: 350000000, description: 'Phí bản quyền cổng kết nối an toàn bảo mật và hạ tầng dev.' }
    ]
  },

  // PRJ-103 (Active)
  {
    id: 'STAGE-103-1',
    project_id: 'PRJ-103',
    stage_name: 'Khảo sát luồng camera & Nhập linh kiện camera AI',
    order_index: 0,
    start_date: '2026-06-01',
    end_date: '2026-06-30',
    costs: [
      { id: 'COST-103-1-1', stage_id: 'STAGE-103-1', item_name: 'Nhập khẩu 50 Camera AI chuyên dụng', amount: 1200000000, description: 'Linh kiện phần cứng cốt lõi nhập khẩu chính ngạch.' },
      { id: 'COST-103-1-2', stage_id: 'STAGE-103-1', item_name: 'Hạ tầng truyền dẫn quang nội đô', amount: 450000000, description: 'Hợp tác nhà mạng kéo cáp quang đến các điểm nút trọng yếu.' }
    ]
  },
  {
    id: 'STAGE-103-2',
    project_id: 'PRJ-103',
    stage_name: 'Huấn luyện mô hình nhận diện AI & Triển khai',
    order_index: 1,
    start_date: '2026-07-01',
    end_date: '2026-10-31',
    costs: [
      { id: 'COST-103-2-1', stage_id: 'STAGE-103-2', item_name: 'Thuê GPU đám mây huấn luyện AI model', amount: 600000000, description: 'Huấn luyện nhận diện biển số xe và hành vi giao thông Hà Nội.' },
      { id: 'COST-103-2-2', stage_id: 'STAGE-103-2', item_name: 'Chi phí nhân lực PM, Dev vận hành', amount: 800000000, description: 'Lương đội ngũ dự án trong 4 tháng phát triển chính thức.' }
    ]
  },

  // PRJ-104 (Closed)
  {
    id: 'STAGE-104-1',
    project_id: 'PRJ-104',
    stage_name: 'Triển khai thiết lập đám mây Lào Cai',
    order_index: 0,
    start_date: '2026-05-15',
    end_date: '2026-06-15',
    costs: [
      { id: 'COST-104-1-1', stage_id: 'STAGE-104-1', item_name: 'Hạ tầng máy chủ ảo Cloud VPS', amount: 450000000, description: 'Thiết lập hạ tầng bảo mật dữ liệu tỉnh.' }
    ]
  }
];

// Initial Cost Change Requests (Pending)
export const INITIAL_COST_CHANGE_REQUESTS: CostChangeRequests[] = [
  {
    id: 'CR-201',
    project_id: 'PRJ-103', // For Active project VTX
    stage_cost_id: 'COST-103-2-1', // GPU training cost
    stage_name: 'Huấn luyện mô hình nhận diện AI & Triển khai',
    item_name: 'Thuê GPU đám mây huấn luyện AI model',
    original_amount: 600000000,
    requested_amount: 750000000, // Wants 150M extra
    reason: 'Do tập dữ liệu huấn luyện phình to để tăng độ chính xác lên 99% theo yêu cầu phát sinh từ Sở Giao Thông.',
    bod_approved: null, // Pending BOD
    accountant_approved: null, // Pending Accountant
    status: 'Pending',
    created_at: '2026-06-28 16:30'
  }
];

// Initial Approval Logs
export const INITIAL_APPROVAL_LOGS: ApprovalLog[] = [
  {
    id: 'LOG-001',
    project_id: 'PRJ-101',
    actor_name: 'Nguyễn Nam (AM)',
    role: 'Sale / AM',
    action: 'Khởi tạo',
    comment: 'Khởi tạo nháp hồ sơ dự án giải pháp kho thông minh Vinamilk.',
    created_at: '2026-06-15 09:30'
  },
  {
    id: 'LOG-002',
    project_id: 'PRJ-102',
    actor_name: 'Trần Văn Hùng (AM)',
    role: 'Sale / AM',
    action: 'Submit',
    comment: 'Đã hoàn thiện PAKD động gồm 2 Giai đoạn với tổng ngân sách 540 triệu đồng. Kính trình GĐ Khối xem xét.',
    created_at: '2026-06-18 14:15'
  },
  {
    id: 'LOG-003',
    project_id: 'PRJ-103',
    actor_name: 'Nguyễn Tiến Dũng (GĐ Khối)',
    role: 'Giám đốc Khối',
    action: 'Phê duyệt',
    comment: 'Phê duyệt giải pháp sơ bộ. Đã sinh mã tổng VTX.502.',
    created_at: '2026-06-02 11:00'
  },
  {
    id: 'LOG-004',
    project_id: 'PRJ-103',
    actor_name: 'Phạm Minh Hải (CEO)',
    role: 'BOD',
    action: 'Phê duyệt Ngân sách',
    comment: 'BOD đồng ý thông qua ngân sách tiền dự án camera AI 2.45 tỷ đồng.',
    created_at: '2026-06-03 15:30'
  },
  {
    id: 'LOG-005',
    project_id: 'PRJ-103',
    actor_name: 'Lê Thị Mai (Kế toán Trưởng)',
    role: 'Kế toán',
    action: 'Phê duyệt Tài chính',
    comment: 'Đã rà soát rủi ro công nợ, bảo đảm tính pháp lý thầu. Đủ điều kiện triển khai.',
    created_at: '2026-06-04 10:45'
  },
  {
    id: 'LOG-006',
    project_id: 'PRJ-103',
    actor_name: 'Nguyễn Quốc Hùng (IT System)',
    role: 'IT System',
    action: 'Xác nhận Kỹ thuật',
    comment: 'Xác nhận cấu hình hạ tầng tích hợp hệ thống. Đã đồng bộ sang Jira Cloud.',
    created_at: '2026-06-05 16:00'
  }
];
