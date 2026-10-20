export type Language = 'vi' | 'en';

export const translations = {
  vi: {
    // Language names
    lang_name: 'Tiếng Việt',
    lang_code: 'VI',
    lang_switch: 'Chuyển ngôn ngữ',

    // Role switcher
    role: {
      label: 'ROLE:',
      hr: 'HCNS (HR)',
      hr_full: 'Ban Nhân Sự (HCNS)',
      employee: 'Nhân sự (NV)',
      employee_full: 'Nhân sự tự đánh giá',
      manager: 'Quản lý (QL)',
      manager_full: 'Quản lý trực tiếp (QL)',
      switch_role_tip: 'Bấm chuyển vai trò để kiểm thử phân quyền',
    },

    // Header & Tabs
    module_title: 'Đánh Giá Định Kỳ Nhân Sự',
    module_subtitle: 'Hệ thống quản lý, giám sát chu trình đánh giá hiệu suất, năng lực và xem xét hợp đồng định kỳ',
    tabs: {
      alerts: 'Cảnh Báo Đánh Giá Định Kỳ',
      list: 'Danh Sách Đánh Giá',
      reports: 'Báo Cáo Tổng Hợp & Phân Bổ',
      config: 'Cấu Hình Chu Kỳ & Tiêu Chuẩn',
    },

    // KPI / Stats
    stats: {
      total: 'Tổng số hồ sơ',
      completed: 'Đã hoàn thành',
      in_progress: 'Đang đánh giá',
      overdue: 'Quá hạn SLA',
      due_soon: 'Sắp đến hạn (≤ 7 ngày)',
      waiting_emp: 'Chờ NV tự chấm',
      waiting_mgr: 'Chờ QL đánh giá',
      waiting_hr: 'Chờ HCNS duyệt',
      completion_rate: 'Tỷ lệ hoàn thành',
    },

    // Filters & Actions
    filter: {
      search_placeholder: 'Tìm kiếm nhân sự, mã NV, chức danh...',
      department: 'Phòng ban',
      all_departments: 'Tất cả phòng ban',
      period: 'Kỳ đánh giá',
      all_periods: 'Tất cả các kỳ',
      status: 'Trạng thái',
      all_statuses: 'Tất cả trạng thái',
      contract_type: 'Loại hợp đồng',
      all_contracts: 'Tất cả loại HĐ',
      reset: 'Xóa bộ lọc',
      export_excel: 'Xuất Excel',
      create_new: 'Tạo kỳ đánh giá mới',
      refresh: 'Làm mới',
      filter_title: 'Bộ lọc nâng cao',
      records_found: 'Tìm thấy {count} kết quả phù hợp',
    },

    // Table Columns
    table: {
      stt: 'STT',
      emp_code: 'Mã NV',
      full_name: 'Họ và tên',
      department: 'Phòng ban',
      position: 'Chức danh',
      contract_type: 'Loại HĐ',
      official_date: 'Official Date',
      review_date: 'Hạn Review',
      period: 'Kỳ đánh giá',
      evaluator: 'Người đánh giá',
      status: 'Trạng thái',
      score: 'Điểm số',
      rating: 'Xếp loại',
      actions: 'Thao tác',
      view_detail: 'Xem chi tiết',
      send_remind: 'Gửi nhắc nhở',
      no_data: 'Không tìm thấy hồ sơ đánh giá nào',
    },

    // Statuses
    status: {
      on_time: 'Trong hạn',
      due_soon: 'Sắp đến hạn',
      overdue: 'Quá hạn',
      emp_eval: 'Nhân viên đánh giá',
      mgr_eval: 'Quản lý đánh giá',
      hr_review: 'HCNS Review',
      completed: 'Hoàn thành',
    },

    // Ratings
    rating: {
      excellent: 'Xuất sắc (A)',
      good: 'Tốt (B)',
      meets: 'Đạt (C)',
      needs_improvement: 'Cần cải thiện (D)',
    },

    // Detail Modal
    detail: {
      modal_title: 'Hồ Sơ Đánh Giá Định Kỳ',
      profile_info: 'Hồ sơ nhân sự',
      system_date: 'Ngày hệ thống',
      
      // Block 1: Info
      block1_title: 'THÔNG TIN KỲ ĐÁNH GIÁ & PHÂN CÔNG PHỤ TRÁCH',
      period_label: 'KỲ ĐÁNH GIÁ',
      period_cycle: 'Định kỳ 6 tháng',
      period_sla: 'SLA 6T',
      contract_label: 'LOẠI HỢP ĐỒNG',
      official_date_label: 'OFFICIAL DATE',
      review_date_label: 'HẠN REVIEW (REVIEW DATE)',
      evaluator_label: 'NGƯỜI ĐÁNH GIÁ PHỤ TRÁCH',
      change_evaluator_btn: 'Đổi người',
      change_evaluator_tip: 'Ban Nhân Sự (HCNS) có thẩm quyền phân công hoặc đổi Người đánh giá',
      status_activated: '✓ Đã kích hoạt',
      status_not_sent: 'Chưa gửi',
      role_context_mgr: 'Bạn là Quản lý trực tiếp',
      role_context_emp: 'Quản lý trực tiếp chấm điểm của bạn',
      role_context_hr: 'Quản lý trực tiếp',

      // Block 2: Workflow & Actions
      block2_title: 'Quy Trình & Hành Động Đánh Giá Nhân Sự',
      block2_subtitle: 'Chu trình 5 giai đoạn liên thông từ HCNS, Nhân viên tự đánh giá đến Quản lý trực tiếp',
      current_stage_label: 'Giai đoạn hiện tại:',

      // Steps
      step1_title: '1. HCNS gửi bảng đánh giá',
      step1_tag: 'Ban Nhân Sự (HCNS)',
      step1_desc: 'Phát hành biểu mẫu đánh giá KPI & năng lực chuẩn theo vị trí công việc cho nhân sự.',
      step1_preview_btn: 'Preview bảng đánh giá',
      step1_send_btn: 'Gửi bảng đánh giá',
      step1_waiting: '⏳ Chờ Ban HCNS phát hành biểu mẫu',
      step1_sent: '✓ Đã gửi đánh giá',

      step2_title: '2. Nhân viên tự đánh giá',
      step2_tag_prefix: 'NV:',
      step2_desc: 'Tải biểu mẫu, tự chấm điểm năng lực và nộp lại kèm tài liệu minh chứng kết quả thực tế.',
      step2_download_btn: 'Tải mẫu tự đánh giá',
      step2_upload_btn: 'Nộp bài tự đánh giá (Bước 2)',
      step2_waiting_emp: '⏳ Chờ nhân viên nộp bài',
      step2_remind_btn: 'Nhắc nộp bài 🔔',
      step2_remind_emp_btn: 'Nhắc NV 🔔',
      step2_support_upload: 'Hỗ trợ nộp',
      step2_submitted: '✓ Đã gửi đánh giá',
      step2_waiting_step1: 'Chờ bước 1 hoàn thành',

      step3_title: '3. Quản lý trực tiếp đánh giá',
      step3_tag_prefix: 'QL:',
      step3_desc: 'Quản lý thẩm định minh chứng, chấm điểm độc lập và đề xuất xếp loại năng lực.',
      step3_download_emp_work: 'Tải bài tự chấm của NV',
      step3_grade_btn: 'Chấm điểm & Gửi lên HCNS (Bước 3)',
      step3_waiting_mgr: '⏳ Quản lý đang thẩm định & đối soát',
      step3_remind_mgr: 'Đôn đốc QL 🔔',
      step3_support_grade: 'Hỗ trợ nhập',
      step3_submitted: '✓ Đã gửi đánh giá',
      step3_waiting_step2: 'Chờ nhân viên nộp bài',

      step4_title: '4. HCNS review & thẩm định',
      step4_tag: 'Ban Nhân Sự (HCNS)',
      step4_desc: 'Rà soát tính hợp lệ của điểm số, kiểm soát phân bổ xếp loại và chuẩn bị đóng kỳ.',
      step4_pending_hr: 'Đang chờ HCNS duyệt (Mở nút Phê duyệt ở footer)',
      step4_submitted_to_hr: '⏳ Đã gửi lên HCNS thẩm định & tổng hợp',
      step4_hr_reviewed: '✓ HCNS đã review & thông qua',
      step4_waiting_step3: 'Chờ Quản lý gửi kết quả',

      step5_title: '5. Hoàn tất đóng kỳ',
      step5_tag: 'Hệ thống & HCNS',
      step5_desc: 'Phê duyệt chính thức, ban hành kết quả và hoàn tất lưu trữ hồ sơ đánh giá định kỳ.',
      step5_completed: '✓ Đã hoàn tất đóng kỳ đánh giá',
      step5_waiting_step4: 'Chờ phê duyệt ở bước 4',

      // Footer
      footer_status_label: 'Trạng thái hồ sơ:',
      footer_close: 'Đóng',
      footer_save_draft: 'Lưu bản nháp',
      footer_approve: 'Phê duyệt & Đóng kỳ',
      footer_approve_only_hr: '(Chỉ mở khi HCNS Review)',
      footer_waiting_issuance: 'Chờ phát hành biểu mẫu',
    },

    // Sub Modals
    modals: {
      // Assign Evaluator Modal
      assign_title: 'Phân Công / Đổi Người Đánh Giá Phụ Trách',
      assign_subtitle: 'Ban Nhân Sự (HCNS) có thẩm quyền cập nhật người trực tiếp thẩm định KPI & năng lực cho nhân sự này.',
      assign_current: 'Người đánh giá hiện tại:',
      assign_new: 'Chọn Người Đánh Giá Mới:',
      assign_reason: 'Lý do thay đổi (bắt buộc theo quy định kiểm toán nhân sự):',
      assign_reason_placeholder: 'Ví dụ: Thay đổi cơ cấu quản lý phòng ban, chuyển nhóm dự án, Quản lý cũ đi công tác...',
      assign_confirm: 'Xác Nhận Thay Đổi',
      assign_cancel: 'Hủy bỏ',

      // Preview Template Modal
      preview_title: 'Xem Trước Biểu Mẫu Đánh Giá Định Kỳ (Chuẩn Công Ty)',
      preview_subtitle: 'Biểu mẫu tự động trích xuất các tiêu chí KPI và khung năng lực theo vị trí việc làm',
      preview_part1: 'Phần I: Đánh Giá Kết Quả Thực Hiện KPI Công Việc (Trọng số 70%)',
      preview_part2: 'Phần II: Khung Năng Lực Cốt Lõi & Chuyên Môn (Trọng số 30%)',
      preview_kpi_target: 'Chỉ tiêu giao (Target)',
      preview_kpi_weight: 'Trọng số',
      preview_download: 'Tải Biểu Mẫu Excel (.xlsx)',
      preview_close: 'Đóng xem trước',

      // Upload / Grading Modal
      upload_title_emp: 'Nộp Bản Tự Đánh Giá & Minh Chứng Kết Quả (Bước 2)',
      upload_title_mgr: 'Quản Lý Nhập Điểm & Thẩm Định Đánh Giá (Bước 3)',
      upload_score_label_emp: 'Điểm tự chấm (Thang điểm 100):',
      upload_score_label_mgr: 'Điểm Quản lý thẩm định (Thang điểm 100):',
      upload_proposed_rating: 'Đề xuất xếp loại:',
      upload_notes_label: 'Nhận xét chi tiết & ý kiến phản hồi:',
      upload_file_label: 'Tải lên file bảng đánh giá (.xlsx) hoặc tài liệu minh chứng:',
      upload_drag_drop: 'Kéo thả file vào đây hoặc bấm để chọn tệp',
      upload_btn_submit_emp: 'Gửi bài tự đánh giá lên Quản lý',
      upload_btn_submit_mgr: 'Hoàn tất chấm điểm & Gửi lên HCNS',
      upload_cancel: 'Hủy bỏ',
    },

    // Toast alerts
    toasts: {
      sent_success: 'Đã gửi biểu mẫu đánh giá đến nhân viên {name}!',
      submitted_success: 'Đã nộp bài tự đánh giá thành công! Hồ sơ đã được chuyển cho Quản lý.',
      manager_graded_success: 'Quản lý đã hoàn tất chấm điểm và gửi hồ sơ lên Ban HCNS thẩm định!',
      approved_success: 'Đã chính thức phê duyệt & hoàn tất đóng kỳ đánh giá cho nhân sự {name}!',
      assigned_success: 'Đã cập nhật người đánh giá phụ trách thành công!',
      reminded_emp: 'Đã gửi email nhắc nhở nhân viên {name} nộp bài tự đánh giá!',
      reminded_mgr: 'Đã gửi email nhắc nhở Quản lý {name} hoàn tất chấm điểm!',
      exported: 'Đã xuất danh sách đánh giá định kỳ ra file Excel thành công!',
    }
  },

  en: {
    // Language names
    lang_name: 'English',
    lang_code: 'EN',
    lang_switch: 'Switch Language',

    // Role switcher
    role: {
      label: 'ROLE:',
      hr: 'HR Admin (HR)',
      hr_full: 'Human Resources Admin (HR)',
      employee: 'Employee (EMP)',
      employee_full: 'Employee Self-Assessment',
      manager: 'Manager (MGR)',
      manager_full: 'Direct Manager (MGR)',
      switch_role_tip: 'Click to switch role and test permissions',
    },

    // Header & Tabs
    module_title: 'Periodic Performance Evaluation',
    module_subtitle: 'Performance evaluation management, KPI monitoring, competency appraisal, and contract review system',
    tabs: {
      alerts: 'Periodic Evaluation Alerts',
      list: 'Evaluation Records List',
      reports: 'Summary & Distribution Reports',
      config: 'Cycle & Criteria Configuration',
    },

    // KPI / Stats
    stats: {
      total: 'Total Records',
      completed: 'Completed',
      in_progress: 'In Progress',
      overdue: 'Overdue SLA',
      due_soon: 'Due Soon (≤ 7 days)',
      waiting_emp: 'Awaiting Employee',
      waiting_mgr: 'Awaiting Manager',
      waiting_hr: 'Awaiting HR Review',
      completion_rate: 'Completion Rate',
    },

    // Filters & Actions
    filter: {
      search_placeholder: 'Search employee name, code, title...',
      department: 'Department',
      all_departments: 'All Departments',
      period: 'Evaluation Period',
      all_periods: 'All Periods',
      status: 'Status',
      all_statuses: 'All Statuses',
      contract_type: 'Contract Type',
      all_contracts: 'All Contract Types',
      reset: 'Reset Filters',
      export_excel: 'Export Excel',
      create_new: 'New Evaluation Cycle',
      refresh: 'Refresh',
      filter_title: 'Advanced Filter',
      records_found: 'Found {count} matching records',
    },

    // Table Columns
    table: {
      stt: 'No.',
      emp_code: 'Emp Code',
      full_name: 'Full Name',
      department: 'Department',
      position: 'Position',
      contract_type: 'Contract Type',
      official_date: 'Official Date',
      review_date: 'Review Deadline',
      period: 'Period',
      evaluator: 'Assigned Evaluator',
      status: 'Status',
      score: 'Score',
      rating: 'Rating',
      actions: 'Actions',
      view_detail: 'View Details',
      send_remind: 'Send Reminder',
      no_data: 'No evaluation records found matching current filters',
    },

    // Statuses
    status: {
      on_time: 'On Time',
      due_soon: 'Due Soon',
      overdue: 'Overdue',
      emp_eval: 'Employee Self-Review',
      mgr_eval: 'Manager Review',
      hr_review: 'HR Review',
      completed: 'Completed',
    },

    // Ratings
    rating: {
      excellent: 'Excellent (A)',
      good: 'Good (B)',
      meets: 'Meets Expectations (C)',
      needs_improvement: 'Needs Improvement (D)',
    },

    // Detail Modal
    detail: {
      modal_title: 'Periodic Evaluation Record',
      profile_info: 'Employee Profile',
      system_date: 'System Date',
      
      // Block 1: Info
      block1_title: 'PERIODIC EVALUATION INFO & EVALUATOR ASSIGNMENT',
      period_label: 'EVALUATION PERIOD',
      period_cycle: '6-Month Periodic',
      period_sla: 'SLA 6M',
      contract_label: 'CONTRACT TYPE',
      official_date_label: 'OFFICIAL DATE',
      review_date_label: 'REVIEW DEADLINE (REVIEW DATE)',
      evaluator_label: 'ASSIGNED EVALUATOR',
      change_evaluator_btn: 'Change Evaluator',
      change_evaluator_tip: 'HR Admin has authority to assign or reassign the Evaluator',
      status_activated: '✓ Activated',
      status_not_sent: 'Not Sent',
      role_context_mgr: 'You are the Direct Manager',
      role_context_emp: 'Your Direct Manager grades this',
      role_context_hr: 'Direct Manager',

      // Block 2: Workflow & Actions
      block2_title: 'Evaluation Process & Action Workflow',
      block2_subtitle: '5-stage sequential process connecting HR Admin, Employee Self-Review, and Direct Manager',
      current_stage_label: 'Current Stage:',

      // Steps
      step1_title: '1. HR sends evaluation form',
      step1_tag: 'HR Admin (HR)',
      step1_desc: 'Issue standard KPI & competency evaluation form aligned with employee job description.',
      step1_preview_btn: 'Preview Evaluation Form',
      step1_send_btn: 'Send Evaluation Form',
      step1_waiting: '⏳ Awaiting HR form issuance',
      step1_sent: '✓ Form Sent',

      step2_title: '2. Employee self-assessment',
      step2_tag_prefix: 'EMP:',
      step2_desc: 'Download form, self-score competencies, and submit with supporting work evidence.',
      step2_download_btn: 'Download Evaluation Form',
      step2_upload_btn: 'Submit Self-Assessment (Step 2)',
      step2_waiting_emp: '⏳ Awaiting employee submission',
      step2_remind_btn: 'Remind Employee 🔔',
      step2_remind_emp_btn: 'Remind EMP 🔔',
      step2_support_upload: 'Assisted Submit',
      step2_submitted: '✓ Assessment Submitted',
      step2_waiting_step1: 'Waiting for Step 1 completion',

      step3_title: '3. Direct manager evaluation',
      step3_tag_prefix: 'MGR:',
      step3_desc: 'Manager audits evidence, conducts independent scoring, and proposes performance rating.',
      step3_download_emp_work: 'Download Employee Form',
      step3_grade_btn: 'Grade & Submit to HR (Step 3)',
      step3_waiting_mgr: '⏳ Manager reviewing & cross-checking',
      step3_remind_mgr: 'Urge Manager 🔔',
      step3_support_grade: 'Assisted Grade',
      step3_submitted: '✓ Grade Submitted',
      step3_waiting_step2: 'Waiting for employee submission',

      step4_title: '4. HR review & audit',
      step4_tag: 'HR Admin (HR)',
      step4_desc: 'Audit score validity, verify rating distribution balance, and prepare for cycle closure.',
      step4_pending_hr: 'Awaiting HR approval (Approval button enabled in footer)',
      step4_submitted_to_hr: '⏳ Submitted to HR for audit & consolidation',
      step4_hr_reviewed: '✓ HR reviewed & approved',
      step4_waiting_step3: 'Waiting for manager results',

      step5_title: '5. Finalize & close cycle',
      step5_tag: 'System & HR',
      step5_desc: 'Officially approve, announce final results, and archive periodic evaluation records.',
      step5_completed: '✓ Evaluation cycle closed successfully',
      step5_waiting_step4: 'Waiting for Step 4 approval',

      // Footer
      footer_status_label: 'Record Status:',
      footer_close: 'Close',
      footer_save_draft: 'Save Draft',
      footer_approve: 'Approve & Close Cycle',
      footer_approve_only_hr: '(Only available in HR Review stage)',
      footer_waiting_issuance: 'Waiting for Form Issuance',
    },

    // Sub Modals
    modals: {
      // Assign Evaluator Modal
      assign_title: 'Assign / Change Assigned Evaluator',
      assign_subtitle: 'HR Admin has authority to update the manager directly evaluating KPIs & competency for this employee.',
      assign_current: 'Current Evaluator:',
      assign_new: 'Select New Evaluator:',
      assign_reason: 'Reason for change (Required for HR audit compliance):',
      assign_reason_placeholder: 'E.g., Department restructuring, project re-allocation, previous manager on leave...',
      assign_confirm: 'Confirm Change',
      assign_cancel: 'Cancel',

      // Preview Template Modal
      preview_title: 'Preview Periodic Evaluation Form (Company Standard)',
      preview_subtitle: 'Standard template automatically extracting KPI targets and competency criteria by job role',
      preview_part1: 'Part I: KPI & Work Performance Evaluation (Weight 70%)',
      preview_part2: 'Part II: Core & Professional Competency Framework (Weight 30%)',
      preview_kpi_target: 'Target Output',
      preview_kpi_weight: 'Weight',
      preview_download: 'Download Excel Template (.xlsx)',
      preview_close: 'Close Preview',

      // Upload / Grading Modal
      upload_title_emp: 'Submit Self-Assessment & Work Evidence (Step 2)',
      upload_title_mgr: 'Manager Scoring & Competency Appraisal (Step 3)',
      upload_score_label_emp: 'Self-Score (100-point scale):',
      upload_score_label_mgr: 'Manager Audited Score (100-point scale):',
      upload_proposed_rating: 'Proposed Rating:',
      upload_notes_label: 'Detailed Feedback & Review Comments:',
      upload_file_label: 'Upload evaluation sheet (.xlsx) or supporting evidence documents:',
      upload_drag_drop: 'Drag and drop file here, or click to browse',
      upload_btn_submit_emp: 'Submit Self-Assessment to Manager',
      upload_btn_submit_mgr: 'Finalize Scoring & Submit to HR',
      upload_cancel: 'Cancel',
    },

    // Toast alerts
    toasts: {
      sent_success: 'Evaluation form sent to employee {name} successfully!',
      submitted_success: 'Self-assessment submitted successfully! Record forwarded to Manager.',
      manager_graded_success: 'Manager completed scoring and submitted record to HR Admin!',
      approved_success: 'Officially approved and closed evaluation cycle for employee {name}!',
      assigned_success: 'Assigned evaluator updated successfully!',
      reminded_emp: 'Reminder email sent to employee {name} to submit self-assessment!',
      reminded_mgr: 'Reminder email sent to Manager {name} to complete evaluation!',
      exported: 'Periodic evaluation list exported to Excel successfully!',
    }
  }
};
