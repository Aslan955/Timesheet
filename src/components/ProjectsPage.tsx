import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Check,
  ChevronRight,
  Coins,
  Clock,
  Lock,
  Unlock,
  Activity,
  FileText,
  CheckCircle,
  X,
  AlertCircle,
  ArrowRight,
  Copy,
  RefreshCw,
  UserCheck,
  Code,
  Layers,
  ChevronDown,
  CornerDownRight,
  HelpCircle
} from 'lucide-react';
import {
  Project,
  ProjectStatus,
  ProjectCodes,
  ProjectStages,
  StageCosts,
  CostChangeRequests,
  ApprovalLog
} from './plmTypes';
import {
  INITIAL_PROJECTS,
  INITIAL_PROJECT_CODES,
  INITIAL_PROJECT_STAGES,
  INITIAL_COST_CHANGE_REQUESTS,
  INITIAL_APPROVAL_LOGS
} from './plmData';

export const ProjectsPage: React.FC = () => {
  // Core Local States (with Initial Mock Data)
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [projectCodes, setProjectCodes] = useState<ProjectCodes[]>(INITIAL_PROJECT_CODES);
  const [projectStages, setProjectStages] = useState<ProjectStages[]>(INITIAL_PROJECT_STAGES);
  const [changeRequests, setChangeRequests] = useState<CostChangeRequests[]>(INITIAL_COST_CHANGE_REQUESTS);
  const [approvalLogs, setApprovalLogs] = useState<ApprovalLog[]>(INITIAL_APPROVAL_LOGS);

  // Selected Project
  const [selectedProjectId, setSelectedProjectId] = useState<string>('PRJ-101');

  // Active Role Simulator
  type SimRole = 'Sale' | 'GDKhoi' | 'BOD' | 'Accountant' | 'PM' | 'IT';
  const [activeRole, setActiveRole] = useState<SimRole>('Sale');

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Form creation states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newCustomerCode, setNewCustomerCode] = useState('');

  // Cost Change Request creator state
  const [isChangeRequestModalOpen, setIsChangeRequestModalOpen] = useState(false);
  const [selectedCostIdToChange, setSelectedCostIdToChange] = useState('');
  const [requestedAmountStr, setRequestedAmountStr] = useState('');
  const [changeReason, setChangeReason] = useState('');

  // Stage adding state
  const [isAddingStageInline, setIsAddingStageInline] = useState(false);
  const [newStageName, setNewStageName] = useState('');
  const [newStageStart, setNewStageStart] = useState('');
  const [newStageEnd, setNewStageEnd] = useState('');

  // Cost adding state (keyed by stageId)
  const [activeStageIdForNewCost, setActiveStageIdForNewCost] = useState<string | null>(null);
  const [newCostName, setNewCostName] = useState('');
  const [newCostAmountStr, setNewCostAmountStr] = useState('');
  const [newCostDesc, setNewCostDesc] = useState('');

  // Close project request form state
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [closeReason, setCloseReason] = useState('');

  // Outsource Code Generator state
  const [newOutsourceSuffix, setNewOutsourceSuffix] = useState('');

  // JIRA Sync simulation active state
  const [isJiraSyncing, setIsJiraSyncing] = useState(false);
  const [jiraProgressLogs, setJiraProgressLogs] = useState<string[]>([]);

  // Simple Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Helper selectors
  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  const getProjectCodes = (projectId: string): ProjectCodes | undefined => {
    return projectCodes.find(c => c.project_id === projectId);
  };

  const getProjectStages = (projectId: string): ProjectStages[] => {
    return projectStages
      .filter(s => s.project_id === projectId)
      .sort((a, b) => a.order_index - b.order_index);
  };

  const calculateTotalCost = (projectId: string): number => {
    const stages = getProjectStages(projectId);
    return stages.reduce((acc, stage) => {
      const stageSum = stage.costs.reduce((sum, cost) => sum + cost.amount, 0);
      return acc + stageSum;
    }, 0);
  };

  const getLogsForProject = (projectId: string): ApprovalLog[] => {
    return approvalLogs
      .filter(l => l.project_id === projectId)
      .sort((a, b) => b.created_at.localeCompare(a.created_at));
  };

  const getChangeRequestsForProject = (projectId: string): CostChangeRequests[] => {
    return changeRequests.filter(r => r.project_id === projectId);
  };

  // --- ACTIONS ---

  // Create Project (Draft)
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !newCustomerCode.trim()) {
      triggerToast('Vui lòng điền đầy đủ tên dự án và mã khách hàng.', 'error');
      return;
    }

    const trimmedCode = newCustomerCode.trim().toUpperCase();
    const newId = `PRJ-${Math.floor(100 + Math.random() * 900)}`;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newProj: Project = {
      id: newId,
      customer_code: trimmedCode,
      project_name: newProjectName.trim(),
      sale_id: 'sale-01',
      sale_name: 'Nguyễn Nam (AM)',
      status: 'Draft',
      created_at: nowStr,
    };

    // Add 1 default empty stage for onboarding
    const defaultStage: ProjectStages = {
      id: `STAGE-${newId}-1`,
      project_id: newId,
      stage_name: 'Giai đoạn 1: Chuẩn bị PAKD',
      order_index: 0,
      start_date: '2026-07-01',
      end_date: '2026-07-31',
      costs: []
    };

    // Create Initial Log
    const newLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: newId,
      actor_name: 'Nguyễn Nam (AM)',
      role: 'Sale / AM',
      action: 'Khởi tạo',
      comment: 'Tạo hồ sơ thầu, lập danh sách các giai đoạn phương án kinh doanh động.',
      created_at: nowStr
    };

    setProjects([newProj, ...projects]);
    setProjectStages(prev => [...prev, defaultStage]);
    setApprovalLogs(prev => [newLog, ...prev]);
    setSelectedProjectId(newId);
    setIsCreateModalOpen(false);

    // Reset fields
    setNewProjectName('');
    setNewCustomerCode('');
    triggerToast(`Đã tạo thành công dự án ${newId} ở trạng thái Nháp.`, 'success');
  };

  // Dynamic Business Plan Stage Modifiers (Only works when Draft)
  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStageName.trim()) {
      triggerToast('Vui lòng điền tên giai đoạn.', 'error');
      return;
    }

    if (!activeProject || activeProject.status !== 'Draft') {
      triggerToast('Chỉ có thể thêm giai đoạn khi dự án ở trạng thái Draft.', 'error');
      return;
    }

    const currentStages = getProjectStages(activeProject.id);
    const newStage: ProjectStages = {
      id: `STAGE-${activeProject.id}-${Math.floor(100 + Math.random() * 900)}`,
      project_id: activeProject.id,
      stage_name: newStageName.trim(),
      order_index: currentStages.length,
      start_date: newStageStart || '2026-07-01',
      end_date: newStageEnd || '2026-08-31',
      costs: []
    };

    setProjectStages(prev => [...prev, newStage]);
    setNewStageName('');
    setNewStageStart('');
    setNewStageEnd('');
    setIsAddingStageInline(false);
    triggerToast('Đã thêm giai đoạn động mới.', 'success');
  };

  const handleDeleteStage = (stageId: string) => {
    if (!activeProject || activeProject.status !== 'Draft') {
      triggerToast('Chỉ có thể xóa giai đoạn khi dự án ở trạng thái Draft.', 'error');
      return;
    }
    setProjectStages(prev => prev.filter(s => s.id !== stageId));
    triggerToast('Đã xóa giai đoạn thành công.', 'info');
  };

  // Stage Costs Modifiers (Only works when Draft)
  const handleAddCostItem = (e: React.FormEvent, stageId: string) => {
    e.preventDefault();
    const amount = parseFloat(newCostAmountStr.replace(/,/g, ''));
    if (!newCostName.trim() || isNaN(amount) || amount <= 0) {
      triggerToast('Vui lòng điền tên hạng mục và số tiền hợp lệ.', 'error');
      return;
    }

    if (!activeProject || activeProject.status !== 'Draft') {
      triggerToast('Chỉ có thể thêm chi phí khi dự án ở trạng thái Draft.', 'error');
      return;
    }

    setProjectStages(prev =>
      prev.map(stage => {
        if (stage.id === stageId) {
          const newCost: StageCosts = {
            id: `COST-${stageId}-${Math.floor(100 + Math.random() * 900)}`,
            stage_id: stageId,
            item_name: newCostName.trim(),
            amount,
            description: newCostDesc.trim() || 'Không có mô tả.'
          };
          return {
            ...stage,
            costs: [...stage.costs, newCost]
          };
        }
        return stage;
      })
    );

    setNewCostName('');
    setNewCostAmountStr('');
    setNewCostDesc('');
    setActiveStageIdForNewCost(null);
    triggerToast('Đã thêm khoản chi phí thành công.', 'success');
  };

  const handleDeleteCostItem = (stageId: string, costId: string) => {
    if (!activeProject || activeProject.status !== 'Draft') {
      triggerToast('Chỉ có thể xóa chi phí khi dự án ở trạng thái Draft.', 'error');
      return;
    }
    setProjectStages(prev =>
      prev.map(stage => {
        if (stage.id === stageId) {
          return {
            ...stage,
            costs: stage.costs.filter(c => c.id !== costId)
          };
        }
        return stage;
      })
    );
    triggerToast('Đã xóa khoản chi phí thành công.', 'info');
  };

  // Submit to GĐ Khối (Draft -> Pending_GDKhoi)
  const handleSubmitToGdkhoi = (projectId: string) => {
    const stages = getProjectStages(projectId);
    if (stages.length === 0 || stages.every(s => s.costs.length === 0)) {
      triggerToast('PAKD cần có ít nhất 1 giai đoạn và các khoản chi phí chi tiết trước khi nộp.', 'error');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const totalCost = calculateTotalCost(projectId);

    // Update Project Status
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return { ...p, status: 'Pending_GDKhoi' };
        }
        return p;
      })
    );

    // Add Log
    const newLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: projectId,
      actor_name: 'Nguyễn Nam (AM)',
      role: 'Sale / AM',
      action: 'Nộp hồ sơ (Submit)',
      comment: `Nộp hồ sơ PAKD thầu động. Tổng dự toán ngân sách: ${totalCost.toLocaleString('vi-VN')} VNĐ. Kính trình Giám đốc Khối xem xét duyệt.`,
      created_at: nowStr
    };
    setApprovalLogs(prev => [newLog, ...prev]);
    triggerToast('Đã trình hồ sơ lên Giám đốc Khối phê duyệt!', 'success');
  };

  // GĐ Khối Approves (Pending_GDKhoi -> Code_Generated -> Pending_BOD)
  // Generates Project Codes Automatically
  const handleApproveGdkhoi = (projectId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const targetProject = projects.find(p => p.id === projectId);
    if (!targetProject) return;

    // Generate code logic
    const random3Digit = Math.floor(100 + Math.random() * 899);
    const masterCode = `${targetProject.customer_code}.${random3Digit}`;
    const saleCode = `${masterCode}.1`;
    const productionCode = `${masterCode}.2`;

    const newCodes: ProjectCodes = {
      id: `CODE-${projectId}-${Math.floor(100 + Math.random() * 900)}`,
      project_id: projectId,
      master_code: masterCode,
      sale_code: saleCode,
      production_code: productionCode,
      outsource_codes: []
    };

    setProjectCodes(prev => [...prev, newCodes]);

    // Transition to Pending_BOD directly
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return { ...p, status: 'Pending_BOD' };
        }
        return p;
      })
    );

    // Add Log
    const newLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: projectId,
      actor_name: 'Nguyễn Tiến Dũng (GĐ Khối)',
      role: 'Giám đốc Khối',
      action: 'Duyệt & Cấp mã',
      comment: `Đã phê duyệt PAKD sơ bộ. Hệ thống tự động kích hoạt cấp mã thầu thành công: Mã Tổng: ${masterCode} | Mã Sale: ${saleCode} | Mã SX: ${productionCode}. Chuyển tiếp BOD duyệt ngân sách tổng thể.`,
      created_at: nowStr
    };
    setApprovalLogs(prev => [newLog, ...prev]);
    triggerToast(`GĐ Khối phê duyệt thành công! Mã dự án ${masterCode} đã được sinh tự động.`, 'success');
  };

  // BOD Approves (Pending_BOD -> Pending_Accountant)
  const handleApproveBod = (projectId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return { ...p, status: 'Pending_Accountant' };
        }
        return p;
      })
    );

    const newLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: projectId,
      actor_name: 'Phạm Minh Hải (CEO/BOD)',
      role: 'CT HĐQT / CEO',
      action: 'Duyệt Ngân Sách',
      comment: 'BOD phê duyệt ngân sách tổng thể và các chỉ số tài chính sơ bộ của PAKD. Chuyển sang Kế toán thẩm định thầu.',
      created_at: nowStr
    };
    setApprovalLogs(prev => [newLog, ...prev]);
    triggerToast('Ban Giám đốc (BOD) đã thông qua ngân sách dự án.', 'success');
  };

  // Accountant Approves (Pending_Accountant -> Pending_IT)
  const handleApproveAccountant = (projectId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return { ...p, status: 'Pending_IT' };
        }
        return p;
      })
    );

    const newLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: projectId,
      actor_name: 'Lê Thị Mai (Kế toán Trưởng)',
      role: 'Kế toán',
      action: 'Phê duyệt tài chính',
      comment: 'Kiểm tra công nợ khách hàng, tính hợp lệ pháp lý đạt chuẩn. Phê duyệt chuyển tiếp lên bước kiểm tra kỹ thuật IT.',
      created_at: nowStr
    };
    setApprovalLogs(prev => [newLog, ...prev]);
    triggerToast('Kế toán đã hoàn thành thẩm định tài chính.', 'success');
  };

  // IT Approves Technical & Simulates Jira Synchronization (Pending_IT -> Jira_Syncing -> Active)
  const handleApproveIT = (projectId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    // Step 1: Put into Jira_Syncing state
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return { ...p, status: 'Jira_Syncing' };
        }
        return p;
      })
    );
    
    setIsJiraSyncing(true);
    setJiraProgressLogs(['[SYSTEM] Kích hoạt tiến trình đồng bộ API sang Jira Cloud...']);

    // Log the action first
    const initialITLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: projectId,
      actor_name: 'Nguyễn Quốc Hùng (IT System)',
      role: 'IT / System',
      action: 'Duyệt Kỹ Thuật',
      comment: 'Rà soát hạ tầng kỹ thuật đạt chuẩn. Đang tự động gọi API POST /api/v1/projects sang Jira để khởi tạo dự án vận hành.',
      created_at: nowStr
    };
    setApprovalLogs(prev => [initialITLog, ...prev]);

    // Simulate API responses with intervals
    setTimeout(() => {
      setJiraProgressLogs(prev => [...prev, '[INFO] Gửi payload POST đến https://vtx-jira.atlassian.net/rest/api/3/project...']);
    }, 600);

    setTimeout(() => {
      setJiraProgressLogs(prev => [...prev, `[INFO] Tích hợp mã dự án gốc: ${getProjectCodes(projectId)?.master_code || 'N/A'} thành công.`]);
    }, 1200);

    setTimeout(() => {
      setJiraProgressLogs(prev => [
        ...prev,
        '[SUCCESS] Jira Cloud phản hồi: HTTP 200 OK.',
        '[SUCCESS] Đã tạo Project Board Jira, liên kết Mã Sản xuất hoàn tất.',
        '[SYSTEM] Dự án chính thức kích hoạt chuyển trạng thái sang ACTIVE.'
      ]);
      
      // Step 2: Finalize transition to Active
      setProjects(prev =>
        prev.map(p => {
          if (p.id === projectId) {
            return { ...p, status: 'Active' };
          }
          return p;
        })
      );
      
      const activeLog: ApprovalLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        project_id: projectId,
        actor_name: 'Hệ thống tự động',
        role: 'System Integration',
        action: 'Active',
        comment: 'Đồng bộ Jira thành công 100%. Dự án chính thức chuyển sang trạng thái hoạt động thực tế (Active). Chi phí ban đầu đã được khóa cứng.',
        created_at: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };
      setApprovalLogs(prev => [activeLog, ...prev]);
      setIsJiraSyncing(false);
      triggerToast('Dự án đã đồng bộ sang Jira và chính thức kích hoạt (ACTIVE)!', 'success');
    }, 2200);
  };

  // Outsource Code Generator (Only for PM in Active phase)
  const handleGenerateOutsourceCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOutsourceSuffix.trim()) {
      triggerToast('Vui lòng điền hậu tố mã Outsource (ví dụ: OS-01).', 'error');
      return;
    }

    if (!activeProject || activeProject.status !== 'Active') {
      triggerToast('Chỉ có thể sinh mã Outsource khi dự án đang Active.', 'error');
      return;
    }

    const currentCodes = getProjectCodes(activeProject.id);
    if (!currentCodes) {
      triggerToast('Không tìm thấy mã dự án tổng thể.', 'error');
      return;
    }

    const cleanSuffix = newOutsourceSuffix.trim().replace(/\s+/g, '-').toUpperCase();
    const newOutsourceVal = `${currentCodes.production_code}.${cleanSuffix}`;

    if (currentCodes.outsource_codes.includes(newOutsourceVal)) {
      triggerToast('Mã Outsource này đã tồn tại trong dự án.', 'error');
      return;
    }

    setProjectCodes(prev =>
      prev.map(c => {
        if (c.project_id === activeProject.id) {
          return {
            ...c,
            outsource_codes: [...c.outsource_codes, newOutsourceVal]
          };
        }
        return c;
      })
    );

    // Add Log
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const pmLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: activeProject.id,
      actor_name: 'Hoàng Ngọc Sơn (PM)',
      role: 'PM / GĐSX',
      action: 'Cấp mã Outsource',
      comment: `PM tạo thủ công mã Outsource liên kết: ${newOutsourceVal} phục vụ thuê thầu phụ ngoài.`,
      created_at: nowStr
    };
    setApprovalLogs(prev => [pmLog, ...prev]);

    setNewOutsourceSuffix('');
    triggerToast(`Đã cấp thành công mã Outsource phụ: ${newOutsourceVal}`, 'success');
  };

  // Reject back to Draft
  const handleRejectProject = (projectId: string, currentStepRole: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    setProjects(prev =>
      prev.map(p => {
        if (p.id === projectId) {
          return { ...p, status: 'Draft' };
        }
        return p;
      })
    );

    const newLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: projectId,
      actor_name: activeRole === 'GDKhoi' ? 'Nguyễn Tiến Dũng (GĐ Khối)' : activeRole === 'BOD' ? 'Phạm Minh Hải (CEO)' : 'Lê Thị Mai (Kế toán Trưởng)',
      role: currentStepRole,
      action: 'Từ chối (Reject)',
      comment: `Từ chối phê duyệt hồ sơ. Yêu cầu AM/Sale rà soát, giải trình lại cơ cấu phân bổ chi phí và kế hoạch nhân lực giai đoạn thầu sơ bộ.`,
      created_at: nowStr
    };
    setApprovalLogs(prev => [newLog, ...prev]);
    triggerToast('Đã từ chối hồ sơ và trả về trạng thái Nháp (Draft) để điều chỉnh.', 'info');
  };

  // --- COST CHANGE REQUESTS (Module 3) ---
  const handleCreateChangeRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const reqAmount = parseFloat(requestedAmountStr.replace(/,/g, ''));
    if (!selectedCostIdToChange || isNaN(reqAmount) || reqAmount <= 0 || !changeReason.trim()) {
      triggerToast('Vui lòng nhập đầy đủ thông tin đề xuất thay đổi chi phí.', 'error');
      return;
    }

    // Find the original cost item
    const stages = getProjectStages(selectedProjectId);
    let originalCostItem: StageCosts | undefined;
    let targetStageName = '';

    for (const stage of stages) {
      const found = stage.costs.find(c => c.id === selectedCostIdToChange);
      if (found) {
        originalCostItem = found;
        targetStageName = stage.stage_name;
        break;
      }
    }

    if (!originalCostItem) {
      triggerToast('Không tìm thấy khoản chi phí gốc tương ứng.', 'error');
      return;
    }

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newReq: CostChangeRequests = {
      id: `CR-${Math.floor(100 + Math.random() * 899)}`,
      project_id: selectedProjectId,
      stage_cost_id: selectedCostIdToChange,
      stage_name: targetStageName,
      item_name: originalCostItem.item_name,
      original_amount: originalCostItem.amount,
      requested_amount: reqAmount,
      reason: changeReason.trim(),
      bod_approved: null,
      accountant_approved: null,
      status: 'Pending',
      created_at: nowStr
    };

    setChangeRequests([newReq, ...changeRequests]);

    // Log Request
    const reqLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: selectedProjectId,
      actor_name: 'Nguyễn Nam (Sale)',
      role: 'Sale / AM',
      action: 'Tạo Change Request',
      comment: `Đề xuất thay đổi số tiền hạng mục "${originalCostItem.item_name}" từ ${originalCostItem.amount.toLocaleString('vi-VN')} VNĐ thành ${reqAmount.toLocaleString('vi-VN')} VNĐ. Lý do: ${changeReason.trim()}`,
      created_at: nowStr
    };
    setApprovalLogs(prev => [reqLog, ...prev]);

    setSelectedCostIdToChange('');
    setRequestedAmountStr('');
    setChangeReason('');
    setIsChangeRequestModalOpen(false);
    triggerToast('Đã nộp yêu cầu thay đổi chi phí. Chờ Ban Giám đốc và Kế toán đồng duyệt chốt chặn kép!', 'success');
  };

  // Double Approvals Checker (Chốt chặn kép BOD & Kế toán)
  const handleApproveChangeRequest = (requestId: string, role: 'BOD' | 'Accountant', isApprove: boolean) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    setChangeRequests(prev =>
      prev.map(req => {
        if (req.id === requestId) {
          const updated = { ...req };
          if (role === 'BOD') {
            updated.bod_approved = isApprove;
          } else {
            updated.accountant_approved = isApprove;
          }

          // If either rejects, status is Rejected
          if (updated.bod_approved === false || updated.accountant_approved === false) {
            updated.status = 'Rejected';
            
            // Log Reject
            const rejectLog: ApprovalLog = {
              id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
              project_id: req.project_id,
              actor_name: role === 'BOD' ? 'Phạm Minh Hải (CEO/BOD)' : 'Lê Thị Mai (Kế toán Trưởng)',
              role: role === 'BOD' ? 'CT HĐQT / CEO' : 'Kế toán',
              action: 'Từ chối đổi chi phí',
              comment: `Bác bỏ phiếu thay đổi chi phí ${requestId} cho hạng mục "${req.item_name}". Kế hoạch tài chính thầu không chấp nhận vượt định mức này.`,
              created_at: nowStr
            };
            setApprovalLogs(logs => [rejectLog, ...logs]);
            triggerToast(`Đã bác bỏ phiếu thay đổi chi phí ${requestId}.`, 'info');
          }
          // If BOTH approve -> Overwrite database (StageCosts)
          else if (updated.bod_approved === true && updated.accountant_approved === true) {
            updated.status = 'Approved';

            // Overwrite budget in stages database trigger
            setProjectStages(stages =>
              stages.map(stage => {
                const hasCostItem = stage.costs.some(c => c.id === req.stage_cost_id);
                if (hasCostItem) {
                  return {
                    ...stage,
                    costs: stage.costs.map(c => {
                      if (c.id === req.stage_cost_id) {
                        return { ...c, amount: req.requested_amount };
                      }
                      return c;
                    })
                  };
                }
                return stage;
              })
            );

            // Log approved overwrite
            const successLog: ApprovalLog = {
              id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
              project_id: req.project_id,
              actor_name: 'Hệ thống tự động',
              role: 'System Budget Trigger',
              action: 'Ghi đè chi phí',
              comment: `Đã được Ban Giám Đốc và Kế toán đồng thuận phê duyệt phiếu ${requestId}. Hệ thống tự động cập nhật, ghi đè hạn mức chi phí mới: ${req.requested_amount.toLocaleString('vi-VN')} VNĐ cho khoản thầu "${req.item_name}".`,
              created_at: nowStr
            };
            setApprovalLogs(logs => [successLog, ...logs]);
            triggerToast(`Chốt chặn kép thành công! Ngân sách hạng mục "${req.item_name}" đã được cập nhật mới.`, 'success');
          } else {
            // Halfway approved
            const halfLog: ApprovalLog = {
              id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
              project_id: req.project_id,
              actor_name: role === 'BOD' ? 'Phạm Minh Hải (CEO/BOD)' : 'Lê Thị Mai (Kế toán Trưởng)',
              role: role === 'BOD' ? 'CT HĐQT / CEO' : 'Kế toán',
              action: 'Duyệt bán phần',
              comment: `Đã xác nhận phê duyệt đổi chi phí của ${role === 'BOD' ? 'BOD' : 'Kế toán'} trên phiếu ${requestId}. Chờ ý kiến xác nhận từ phía còn lại để hoàn tất luồng chốt kép.`,
              created_at: nowStr
            };
            setApprovalLogs(logs => [halfLog, ...logs]);
            triggerToast(`Xác nhận phê duyệt từ ${role === 'BOD' ? 'Ban Giám đốc' : 'Kế toán'}. Chờ phản hồi chốt từ đối tác còn lại.`, 'info');
          }

          return updated;
        }
        return req;
      })
    );
  };

  // --- PROJECT CLOSE FLOW (Active -> Closed) ---
  const handleRequestClose = (e: React.FormEvent) => {
    e.preventDefault();
    if (!closeReason.trim()) {
      triggerToast('Vui lòng nhập lý do đóng dự án.', 'error');
      return;
    }

    setProjects(prev =>
      prev.map(p => {
        if (p.id === selectedProjectId) {
          return {
            ...p,
            closing_reason: closeReason.trim(),
            closing_approved_gdkhoi: null,
            closing_approved_accountant: null,
            closing_approved_bod: null
          };
        }
        return p;
      })
    );

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const reqLog: ApprovalLog = {
      id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
      project_id: selectedProjectId,
      actor_name: 'Hoàng Ngọc Sơn (PM)',
      role: 'PM / GĐSX',
      action: 'Yêu cầu đóng dự án',
      comment: `Trình duyệt đóng mã thầu dự án. Lý do: ${closeReason.trim()}. Cần phê duyệt liên hoàn từ GĐ Khối -> Kế toán -> BOD.`,
      created_at: nowStr
    };
    setApprovalLogs(prev => [reqLog, ...prev]);

    setCloseReason('');
    setIsCloseModalOpen(false);
    triggerToast('Đã gửi yêu cầu đóng dự án. Chờ các bộ phận thẩm định đóng mã!', 'success');
  };

  const handleApproveClosingStep = (role: 'GDKhoi' | 'Accountant' | 'BOD', isApprove: boolean) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
    
    setProjects(prev =>
      prev.map(p => {
        if (p.id === selectedProjectId) {
          const updated = { ...p };
          if (role === 'GDKhoi') {
            updated.closing_approved_gdkhoi = isApprove;
          } else if (role === 'Accountant') {
            updated.closing_approved_accountant = isApprove;
          } else if (role === 'BOD') {
            updated.closing_approved_bod = isApprove;
          }

          // If anyone rejects, cancel close request
          if (isApprove === false) {
            updated.closing_reason = undefined;
            updated.closing_approved_gdkhoi = undefined;
            updated.closing_approved_accountant = undefined;
            updated.closing_approved_bod = undefined;

            const rejectLog: ApprovalLog = {
              id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
              project_id: selectedProjectId,
              actor_name: role === 'GDKhoi' ? 'Nguyễn Tiến Dũng (GĐ Khối)' : role === 'Accountant' ? 'Lê Thị Mai (Kế toán)' : 'Phạm Minh Hải (CEO/BOD)',
              role: role === 'GDKhoi' ? 'GĐ Khối' : role === 'Accountant' ? 'Kế toán' : 'CT HĐQT / CEO',
              action: 'Bác bỏ yêu cầu đóng',
              comment: 'Từ chối đóng dự án. Yêu cầu làm rõ các khoản công nợ thầu phụ hoặc bàn giao kỹ thuật trước khi thanh lý.',
              created_at: nowStr
            };
            setApprovalLogs(logs => [rejectLog, ...logs]);
            triggerToast('Đã từ chối đóng dự án và chuyển hồ sơ về trạng thái Active hoạt động.', 'info');
          }
          // If all three approved -> Closed!
          else if (
            updated.closing_approved_gdkhoi === true &&
            updated.closing_approved_accountant === true &&
            updated.closing_approved_bod === true
          ) {
            updated.status = 'Closed';
            
            const closeLog: ApprovalLog = {
              id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
              project_id: selectedProjectId,
              actor_name: 'Hệ thống tự động',
              role: 'System Trigger',
              action: 'Đóng chính thức',
              comment: 'Tất cả 3 bộ phận phê duyệt thành công. Dự án chính thức thanh lý, khoá mọi cổng truy cập, kết thúc vòng đời hoạt động.',
              created_at: nowStr
            };
            setApprovalLogs(logs => [closeLog, ...logs]);
            triggerToast('Dự án đã chính thức đóng hoàn tất và thanh lý mã!', 'success');
          } else {
            // Logging partial approval
            const roleLabel = role === 'GDKhoi' ? 'GĐ Khối' : role === 'Accountant' ? 'Kế toán' : 'CEO / BOD';
            const partLog: ApprovalLog = {
              id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
              project_id: selectedProjectId,
              actor_name: role === 'GDKhoi' ? 'Nguyễn Tiến Dũng (GĐ Khối)' : role === 'Accountant' ? 'Lê Thị Mai (Kế toán)' : 'Phạm Minh Hải (CEO/BOD)',
              role: roleLabel,
              action: 'Duyệt đóng một phần',
              comment: `Xác nhận phê duyệt đóng dự án từ bộ phận ${roleLabel}. Chờ các bên còn lại xác nhận thông qua.`,
              created_at: nowStr
            };
            setApprovalLogs(logs => [partLog, ...logs]);
            triggerToast(`Xác nhận phê duyệt đóng dự án từ ${roleLabel}.`, 'info');
          }

          return updated;
        }
        return p;
      })
    );
  };

  // Filter & Search Logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch =
      p.project_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 text-slate-800 text-left" id="project-lifecycle-management-system">
      {/* Dynamic Toast Alerts */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border animate-slideIn ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : toast.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-rose-200'
              : 'bg-indigo-50 text-indigo-800 border-indigo-200'
          }`}
        >
          <CheckCircle size={16} className={toast.type === 'success' ? 'text-emerald-600' : 'text-indigo-600'} />
          <span className="text-xs font-bold font-sans">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Persistent System Simulator Controls */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-indigo-500 to-purple-500" />
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xs font-black uppercase tracking-widest text-slate-400">Trình giả lập vai trò hệ thống</h1>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold">
            Thay đổi vai trò hiện tại của bạn bên dưới để thực hiện các hành động phê duyệt, sửa đổi hoặc đóng dự án tương ứng.
          </p>
        </div>

        {/* Role Selectors */}
        <div className="flex flex-wrap gap-1.5 bg-slate-50 border border-slate-200/60 p-1.5 rounded-xl">
          {[
            { id: 'Sale', label: '💼 Sale / AM', desc: 'Lập & nộp PAKD, Đề xuất CR chi phí' },
            { id: 'GDKhoi', label: '👨‍💼 GĐ Khối', desc: 'Duyệt PAKD, Sinh mã tự động' },
            { id: 'BOD', label: '👑 CEO / BOD', desc: 'Duyệt ngân sách tổng, Duyệt CR' },
            { id: 'Accountant', label: '👩‍💼 Kế toán', desc: 'Kiểm toán tài chính, Thẩm thầu, Duyệt CR' },
            { id: 'PM', label: '🛠 PM / GĐSX', desc: 'Nhận dự án, Cấp mã Outsource, Đóng dự án' },
            { id: 'IT', label: '💻 IT / System', desc: 'Technical review & Đồng bộ Jira Cloud' }
          ].map(role => (
            <button
              key={role.id}
              onClick={() => {
                setActiveRole(role.id as SimRole);
                triggerToast(`Đã chuyển sang vai trò: ${role.label.split(' ')[1]}`, 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                activeRole === role.id
                  ? 'bg-indigo-600 text-white shadow-sm font-extrabold'
                  : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
              }`}
              title={role.desc}
            >
              {role.label.split(' ')[1]}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN TWO-COLUMN WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: PROJECT DIRECTORY & METRICS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Stats Panel */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Tổng số dự án</span>
              <span className="text-xl font-black text-slate-900 font-mono mt-1">{projects.length}</span>
              <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Trong vòng đời</span>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-xs flex flex-col justify-between">
              <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider block">Đang hoạt động</span>
              <span className="text-xl font-black text-emerald-600 font-mono mt-1">
                {projects.filter(p => p.status === 'Active').length}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold mt-1 block">Active on Jira</span>
            </div>
          </div>

          {/* Directory Navigation & Filters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Danh mục dự án</h3>
                <p className="text-[10px] text-slate-500 font-medium">Tìm kiếm & Phân loại trạng thái</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
              >
                <Plus size={12} />
                <span>Thêm mới</span>
              </button>
            </div>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Tìm theo tên hoặc mã khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white outline-none rounded-xl px-3 py-2 transition-all font-semibold"
            />

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-slate-100 pb-2">
              {['All', 'Draft', 'Pending_GDKhoi', 'Pending_BOD', 'Pending_Accountant', 'Pending_IT', 'Active', 'Closed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                    statusFilter === st
                      ? 'bg-slate-200 text-slate-800'
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {st === 'All' ? 'Tất cả' : st.replace('Pending_', 'Chờ ')}
                </button>
              ))}
            </div>

            {/* Project List */}
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 no-scrollbar-y">
              {filteredProjects.map(proj => {
                const totalCost = calculateTotalCost(proj.id);
                const isSelected = proj.id === selectedProjectId;
                const codes = getProjectCodes(proj.id);
                
                return (
                  <div
                    key={proj.id}
                    onClick={() => {
                      setSelectedProjectId(proj.id);
                      setIsAddingStageInline(false);
                      setActiveStageIdForNewCost(null);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                      isSelected
                        ? 'bg-indigo-50/50 border-indigo-200 shadow-3xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-0 left-0 h-full w-1 bg-indigo-600" />
                    )}
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                        {proj.id}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                        proj.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : proj.status === 'Draft'
                          ? 'bg-slate-100 text-slate-600 border-slate-200'
                          : proj.status === 'Closed'
                          ? 'bg-slate-200 text-slate-800 border-slate-300'
                          : 'bg-amber-50 text-amber-700 border-amber-200/60 animate-pulse'
                      }`}>
                        {proj.status.replace('Pending_', 'Chờ ')}
                      </span>
                    </div>

                    <div className="mt-2 space-y-1">
                      <h4 className="font-extrabold text-[12px] text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-tight">
                        {proj.project_name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold">
                        Khách hàng: <span className="text-slate-700 font-bold">{proj.customer_code}</span> | AM: {proj.sale_name.split(' ')[0]}
                      </p>
                      {codes?.master_code && (
                        <p className="text-[10px] text-indigo-700 font-mono font-bold flex items-center gap-1">
                          <Code size={10} />
                          <span>Mã dự án: {codes.master_code}</span>
                        </p>
                      )}
                    </div>

                    <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                      <span className="text-slate-400">Dự toán ngân sách:</span>
                      <span className="font-black text-slate-900 font-mono">{totalCost.toLocaleString('vi-VN')} đ</span>
                    </div>
                  </div>
                );
              })}

              {filteredProjects.length === 0 && (
                <p className="text-xs text-slate-400 italic text-center py-6">Không tìm thấy dự án nào phù hợp.</p>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE PROJECT WORKSPACE */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Project Header Card & State Machine */}
          {activeProject ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-5 text-left">
              
              {/* Top Row: Title & Action Controls based on status */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                      {activeProject.id}
                    </span>
                    <h2 className="font-black text-sm text-slate-900 leading-tight">
                      {activeProject.project_name}
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Khách hàng: <span className="font-bold text-slate-700">{activeProject.customer_code}</span> | Tạo ngày: {activeProject.created_at} | Người phụ trách: <span className="font-semibold text-slate-700">{activeProject.sale_name}</span>
                  </p>
                </div>

                {/* Submit / Approve Actions block */}
                <div className="shrink-0 flex items-center gap-2">
                  
                  {/* Draft State (Action for Sale) */}
                  {activeProject.status === 'Draft' && (
                    <div className="flex items-center gap-2">
                      {activeRole === 'Sale' ? (
                        <button
                          onClick={() => handleSubmitToGdkhoi(activeProject.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Trình duyệt PAKD</span>
                          <ArrowRight size={14} />
                        </button>
                      ) : (
                        <div className="bg-slate-50 text-slate-500 text-[10px] font-bold px-3 py-2 border rounded-xl flex items-center gap-1.5">
                          <Lock size={12} />
                          <span>Chuyển vai trò Sale để Trình duyệt</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending GĐ Khối (Action for GDKhoi) */}
                  {activeProject.status === 'Pending_GDKhoi' && (
                    <div className="flex items-center gap-2">
                      {activeRole === 'GDKhoi' ? (
                        <>
                          <button
                            onClick={() => handleApproveGdkhoi(activeProject.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle size={14} />
                            <span>Phê duyệt & Cấp mã thầu</span>
                          </button>
                          <button
                            onClick={() => handleRejectProject(activeProject.id, 'GĐ Khối')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            Từ chối
                          </button>
                        </>
                      ) : (
                        <div className="bg-amber-50 text-amber-800 text-[10px] font-bold px-3 py-2 border border-amber-200 rounded-xl flex items-center gap-1.5 animate-pulse">
                          <Clock size={12} />
                          <span>Chờ Giám đốc Khối Phê duyệt</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending BOD (Action for BOD) */}
                  {activeProject.status === 'Pending_BOD' && (
                    <div className="flex items-center gap-2">
                      {activeRole === 'BOD' ? (
                        <>
                          <button
                            onClick={() => handleApproveBod(activeProject.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle size={14} />
                            <span>Phê duyệt Ngân sách</span>
                          </button>
                          <button
                            onClick={() => handleRejectProject(activeProject.id, 'CT HĐQT / CEO')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            Từ chối
                          </button>
                        </>
                      ) : (
                        <div className="bg-amber-50 text-amber-800 text-[10px] font-bold px-3 py-2 border border-amber-200 rounded-xl flex items-center gap-1.5 animate-pulse">
                          <Clock size={12} />
                          <span>Chờ Ban Giám Đốc (BOD) Duyệt</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending Accountant (Action for Accountant) */}
                  {activeProject.status === 'Pending_Accountant' && (
                    <div className="flex items-center gap-2">
                      {activeRole === 'Accountant' ? (
                        <>
                          <button
                            onClick={() => handleApproveAccountant(activeProject.id)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCircle size={14} />
                            <span>Duyệt Thẩm Định Thầu</span>
                          </button>
                          <button
                            onClick={() => handleRejectProject(activeProject.id, 'Kế toán')}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-black px-3.5 py-2.5 rounded-xl transition-all cursor-pointer"
                          >
                            Từ chối
                          </button>
                        </>
                      ) : (
                        <div className="bg-amber-50 text-amber-800 text-[10px] font-bold px-3 py-2 border border-amber-200 rounded-xl flex items-center gap-1.5 animate-pulse">
                          <Clock size={12} />
                          <span>Chờ Kế Toán Trưởng Duyệt</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Pending IT (Action for IT) */}
                  {activeProject.status === 'Pending_IT' && (
                    <div className="flex items-center gap-2">
                      {activeRole === 'IT' ? (
                        <button
                          onClick={() => handleApproveIT(activeProject.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all flex items-center gap-1.5 cursor-pointer animate-bounce"
                        >
                          <Activity size={14} />
                          <span>Duyệt Kỹ Thuật & Sync Jira</span>
                        </button>
                      ) : (
                        <div className="bg-amber-50 text-amber-800 text-[10px] font-bold px-3 py-2 border border-amber-200 rounded-xl flex items-center gap-1.5 animate-pulse">
                          <Clock size={12} />
                          <span>Chờ IT Xác nhận Kỹ thuật</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Jira Syncing state display */}
                  {activeProject.status === 'Jira_Syncing' && (
                    <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 text-[10px] font-bold px-3 py-2 rounded-xl flex items-center gap-2">
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Đang gọi API Jira, vui lòng chờ...</span>
                    </div>
                  )}

                  {/* Active State (Closing triggers) */}
                  {activeProject.status === 'Active' && (
                    <div className="flex items-center gap-2">
                      {activeProject.closing_reason ? (
                        /* closing approvals flow */
                        <div className="bg-amber-50 text-amber-800 text-[10px] font-bold px-3 py-2 border border-amber-200 rounded-xl flex items-center gap-1">
                          <Clock size={11} className="animate-pulse" />
                          <span>Đang duyệt Đóng thầu</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => setIsCloseModalOpen(true)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Đề xuất Đóng dự án
                        </button>
                      )}
                    </div>
                  )}

                  {/* Closed State indicator */}
                  {activeProject.status === 'Closed' && (
                    <div className="bg-slate-100 text-slate-700 text-[10px] font-black px-3 py-2 rounded-xl border border-slate-200 flex items-center gap-1.5">
                      <Lock size={12} />
                      <span>Dự án đã thanh lý đóng mã</span>
                    </div>
                  )}
                </div>
              </div>

              {/* State Machine Progress Stepper */}
              <div className="pt-2">
                <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3.5">
                  Lộ trình vòng đời phê duyệt dự án (State Machine)
                </p>
                
                {/* Visual horizontal sequence */}
                <div className="grid grid-cols-2 sm:grid-cols-8 gap-2">
                  {[
                    { key: 'Draft', label: '1. Nháp (Draft)' },
                    { key: 'Pending_GDKhoi', label: '2. Chờ GĐK' },
                    { key: 'Pending_BOD', label: '3. Chờ BOD' },
                    { key: 'Pending_Accountant', label: '4. Chờ Kế toán' },
                    { key: 'Pending_IT', label: '5. Chờ IT' },
                    { key: 'Jira_Syncing', label: '6. Sync Jira' },
                    { key: 'Active', label: '7. Hoạt động' },
                    { key: 'Closed', label: '8. Đã đóng' }
                  ].map((node, index) => {
                    const isPassed = (() => {
                      const list: ProjectStatus[] = [
                        'Draft',
                        'Pending_GDKhoi',
                        'Pending_BOD',
                        'Pending_Accountant',
                        'Pending_IT',
                        'Jira_Syncing',
                        'Active',
                        'Closed'
                      ];
                      const currentIdx = list.indexOf(activeProject.status);
                      const nodeIdx = list.indexOf(node.key as ProjectStatus);
                      return currentIdx > nodeIdx;
                    })();

                    const isCurrent = activeProject.status === node.key;

                    return (
                      <div
                        key={node.key}
                        className={`p-2 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-indigo-600 border-indigo-600 text-white font-black shadow-xs scale-102 ring-2 ring-indigo-200'
                            : isPassed
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-bold'
                            : 'bg-slate-50 border-slate-200 text-slate-400'
                        }`}
                      >
                        <p className="text-[9px] font-mono leading-none tracking-tight">
                          {node.label}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* JIRA Sync Terminal overlay simulator */}
              {isJiraSyncing && (
                <div className="bg-slate-900 text-indigo-400 font-mono text-[11px] p-4 rounded-xl border border-slate-800 space-y-1.5 relative overflow-hidden shadow-inner">
                  <div className="absolute top-2 right-3 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                  <div className="flex items-center gap-2 border-b border-slate-800 pb-1.5 mb-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] text-slate-500 font-black tracking-widest ml-1 uppercase">Jira Pipeline Sandbox Terminal</span>
                  </div>
                  {jiraProgressLogs.map((log, idx) => (
                    <p key={idx} className={log.startsWith('[SUCCESS]') ? 'text-emerald-400' : log.startsWith('[SYSTEM]') ? 'text-indigo-300 font-bold' : 'text-slate-300'}>
                      {log}
                    </p>
                  ))}
                </div>
              )}

              {/* Closing Approval Flow Action Box (Active & requested close) */}
              {activeProject.status === 'Active' && activeProject.closing_reason && (
                <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800">
                    <Clock size={16} className="animate-spin" />
                    <h4 className="text-xs font-black uppercase tracking-wider">Luồng duyệt đóng dự án liên hoàn</h4>
                  </div>
                  <p className="text-xs text-slate-600 font-medium bg-white px-3 py-2 rounded-lg border">
                    <span className="font-bold text-slate-700">Lý do đóng dự án:</span> {activeProject.closing_reason}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Step 1: GĐ Khối */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase">1. Giám đốc Khối</span>
                        {activeProject.closing_approved_gdkhoi === true ? (
                          <span className="text-emerald-600 text-[10px] font-black">✓ Đã duyệt</span>
                        ) : (
                          <span className="text-amber-600 text-[10px] font-black">⏱ Chờ duyệt</span>
                        )}
                      </div>
                      {activeRole === 'GDKhoi' && activeProject.closing_approved_gdkhoi === null && (
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => handleApproveClosingStep('GDKhoi', true)}
                            className="bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded"
                          >
                            Duyệt đóng
                          </button>
                          <button
                            onClick={() => handleApproveClosingStep('GDKhoi', false)}
                            className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-black px-2 py-1 rounded"
                          >
                            Bác bỏ
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Step 2: Kế toán */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase">2. Kế toán thầu</span>
                        {activeProject.closing_approved_accountant === true ? (
                          <span className="text-emerald-600 text-[10px] font-black">✓ Đã duyệt</span>
                        ) : (
                          <span className="text-amber-600 text-[10px] font-black">⏱ Chờ duyệt</span>
                        )}
                      </div>
                      {activeRole === 'Accountant' && activeProject.closing_approved_accountant === null && (
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => handleApproveClosingStep('Accountant', true)}
                            className="bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded"
                          >
                            Duyệt đóng
                          </button>
                          <button
                            onClick={() => handleApproveClosingStep('Accountant', false)}
                            className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-black px-2 py-1 rounded"
                          >
                            Bác bỏ
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Step 3: BOD */}
                    <div className="bg-white p-3 rounded-lg border border-slate-200 flex flex-col justify-between space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase">3. Ban Giám đốc (BOD)</span>
                        {activeProject.closing_approved_bod === true ? (
                          <span className="text-emerald-600 text-[10px] font-black">✓ Đã duyệt</span>
                        ) : (
                          <span className="text-amber-600 text-[10px] font-black">⏱ Chờ duyệt</span>
                        )}
                      </div>
                      {activeRole === 'BOD' && activeProject.closing_approved_bod === null && (
                        <div className="flex gap-1.5 pt-1">
                          <button
                            onClick={() => handleApproveClosingStep('BOD', true)}
                            className="bg-emerald-600 text-white text-[9px] font-black px-2 py-1 rounded"
                          >
                            Duyệt đóng
                          </button>
                          <button
                            onClick={() => handleApproveClosingStep('BOD', false)}
                            className="bg-rose-50 text-rose-600 border border-rose-100 text-[9px] font-black px-2 py-1 rounded"
                          >
                            Bác bỏ
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[9px] text-amber-800 italic">
                    💡 Hãy chuyển vai trò giả lập sang từng bộ phận phía trên để đồng xác nhận chốt luồng đóng hoàn tất.
                  </p>
                </div>
              )}
            </div>
          ) : null}

          {/* MODULE 1: DYNAMIC BUSINESS PLAN (PAKD ĐỘNG) */}
          {activeProject ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers size={14} className="text-indigo-600" />
                    <span>Phương án kinh doanh động (Dynamic Business Plan)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Danh sách {getProjectStages(activeProject.id).length} giai đoạn tiếp tiếp cận, triển khai & thầu.
                  </p>
                </div>

                {/* Lock indicator */}
                <div className="shrink-0">
                  {activeProject.status === 'Draft' ? (
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] border border-emerald-200 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                      <Unlock size={11} />
                      <span>AM Đang Thiết lập (Được chỉnh sửa)</span>
                    </span>
                  ) : (
                    <span className="bg-slate-100 text-slate-500 text-[10px] border border-slate-200/60 px-3 py-1.5 rounded-xl font-bold flex items-center gap-1">
                      <Lock size={11} />
                      <span>Đã khóa cứng (Chỉ đọc)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Real-time cumulative Cost summary */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Tổng chi phí cộng dồn (Cumulative total)</span>
                  <p className="text-xs text-slate-500 font-semibold">Cộng tổng tự động từ mọi hạng mục chi phí của các giai đoạn thầu</p>
                </div>
                <div className="text-left sm:text-right">
                  <span className="text-lg font-black text-indigo-700 font-mono">
                    {calculateTotalCost(activeProject.id).toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>

              {/* Stage List Display */}
              <div className="space-y-4">
                {getProjectStages(activeProject.id).map((stage, sIdx) => {
                  const stageTotal = stage.costs.reduce((sum, c) => sum + c.amount, 0);
                  const isAddingCost = activeStageIdForNewCost === stage.id;
                  
                  return (
                    <div key={stage.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                      {/* Stage Header Info */}
                      <div className="bg-slate-50/70 border-b border-slate-100 p-3.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-xs text-slate-900 flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-[10px] font-black flex items-center justify-center">
                              {sIdx + 1}
                            </span>
                            <span>{stage.stage_name}</span>
                          </h4>
                          <p className="text-[10px] text-slate-500 font-semibold pl-7">
                            Lộ trình: {stage.start_date} ~ {stage.end_date}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 pl-7 sm:pl-0">
                          <span className="font-mono text-xs text-slate-700 font-black">
                            {stageTotal.toLocaleString('vi-VN')} đ
                          </span>

                          {activeProject.status === 'Draft' && (
                            <button
                              onClick={() => handleDeleteStage(stage.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                              title="Xóa giai đoạn"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Cost items table/list inside stage */}
                      <div className="p-3.5 space-y-2">
                        {stage.costs.length === 0 ? (
                          <p className="text-[10px] text-slate-400 italic py-2 pl-2">Không có khoản mục chi phí nào.</p>
                        ) : (
                          <div className="space-y-1.5 pl-2">
                            {stage.costs.map(cost => (
                              <div
                                key={cost.id}
                                className="flex items-start justify-between p-2.5 rounded-lg bg-slate-50/50 hover:bg-slate-50 border border-slate-150 text-xs transition-all"
                              >
                                <div className="space-y-0.5 max-w-[70%]">
                                  <p className="font-extrabold text-slate-800 flex items-center gap-1">
                                    <CornerDownRight size={12} className="text-slate-400 shrink-0" />
                                    <span>{cost.item_name}</span>
                                  </p>
                                  <p className="text-[10px] text-slate-400 pl-4">{cost.description}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                  <span className="font-mono text-[11px] font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                                    {cost.amount.toLocaleString('vi-VN')} đ
                                  </span>

                                  {activeProject.status === 'Draft' && (
                                    <button
                                      onClick={() => handleDeleteCostItem(stage.id, cost.id)}
                                      className="text-slate-400 hover:text-rose-600 transition-colors"
                                      title="Xóa chi phí"
                                    >
                                      <Trash2 size={11} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Inline cost adding interface (Only Draft) */}
                        {activeProject.status === 'Draft' && (
                          <div className="pt-2 pl-2">
                            {isAddingCost ? (
                              <form
                                onSubmit={(e) => handleAddCostItem(e, stage.id)}
                                className="bg-slate-50/50 border border-slate-200 rounded-xl p-3 space-y-2.5 text-xs text-left"
                              >
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    placeholder="Tên hạng mục chi phí (ví dụ: Thuê thiết bị mạng thầu)..."
                                    value={newCostName}
                                    onChange={(e) => setNewCostName(e.target.value)}
                                    className="px-2.5 py-1.5 bg-white border outline-none rounded-lg font-semibold"
                                  />
                                  <input
                                    type="text"
                                    placeholder="Số tiền chi phí thầu (VNĐ)..."
                                    value={newCostAmountStr}
                                    onChange={(e) => {
                                      // format helper
                                      const rawVal = e.target.value.replace(/,/g, '');
                                      if (!isNaN(Number(rawVal))) {
                                        setNewCostAmountStr(Number(rawVal).toLocaleString('en-US'));
                                      } else if (rawVal === '') {
                                        setNewCostAmountStr('');
                                      }
                                    }}
                                    className="px-2.5 py-1.5 bg-white border outline-none rounded-lg font-mono font-bold"
                                  />
                                </div>
                                <input
                                  type="text"
                                  placeholder="Mô tả mục tiêu chi tiết của khoản thầu thô..."
                                  value={newCostDesc}
                                  onChange={(e) => setNewCostDesc(e.target.value)}
                                  className="w-full px-2.5 py-1.5 bg-white border outline-none rounded-lg"
                                />
                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="submit"
                                    className="bg-indigo-600 text-white font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer"
                                  >
                                    Thêm khoản chi phí
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveStageIdForNewCost(null)}
                                    className="bg-slate-200 text-slate-700 font-bold text-[10px] px-3 py-1.5 rounded-lg cursor-pointer"
                                  >
                                    Hủy
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <button
                                onClick={() => {
                                  setActiveStageIdForNewCost(stage.id);
                                  setNewCostName('');
                                  setNewCostAmountStr('');
                                  setNewCostDesc('');
                                }}
                                className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
                              >
                                <Plus size={12} />
                                <span>Thêm hạng mục chi phí</span>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inline stage adding form (Only Draft) */}
              {activeProject.status === 'Draft' && (
                <div>
                  {isAddingStageInline ? (
                    <form
                      onSubmit={handleAddStage}
                      className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
                    >
                      <h4 className="text-[11px] font-black uppercase text-slate-400">Thêm giai đoạn lộ trình động mới</h4>
                      <input
                        type="text"
                        placeholder="Tên giai đoạn (ví dụ: Chạy thử Demo kỹ thuật tại nhà máy)..."
                        value={newStageName}
                        onChange={(e) => setNewStageName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 outline-none rounded-xl text-xs font-semibold"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-slate-400 uppercase">Ngày bắt đầu</label>
                          <input
                            type="date"
                            value={newStageStart}
                            onChange={(e) => setNewStageStart(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 outline-none rounded-xl text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-extrabold text-slate-400 uppercase">Ngày kết thúc</label>
                          <input
                            type="date"
                            value={newStageEnd}
                            onChange={(e) => setNewStageEnd(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-slate-200 outline-none rounded-xl text-xs"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 justify-end pt-1">
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white text-[10px] font-black px-3.5 py-2 rounded-xl cursor-pointer"
                        >
                          Xác nhận thêm
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingStageInline(false)}
                          className="bg-slate-200 text-slate-700 text-[10px] font-black px-3.5 py-2 rounded-xl cursor-pointer"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setIsAddingStageInline(true)}
                      className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 border-dashed py-3.5 rounded-xl text-xs font-bold text-slate-600 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Thêm Giai đoạn Lộ trình thầu động</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : null}

          {/* MODULE 2: AUTO CODE GENERATOR CARD (CHỈ KÍCH HOẠT KHI ĐÃ CÓ MÃ) */}
          {activeProject && getProjectCodes(activeProject.id) ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Code size={14} className="text-indigo-600" />
                  <span>Cấp mã thầu dự án tự động (Auto-Code Allocation)</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Mã tổng quan và phân nhánh cho Sale, Sản xuất và thầu phụ Outsource.
                </p>
              </div>

              {/* Codes display panel */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Master code */}
                <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-xl flex flex-col justify-between relative group">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Mã Dự án Tổng</span>
                  <p className="text-sm font-black text-indigo-900 font-mono mt-1">
                    {getProjectCodes(activeProject.id)?.master_code}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getProjectCodes(activeProject.id)?.master_code || '');
                      triggerToast('Đã copy mã dự án tổng!', 'success');
                    }}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-indigo-600 transition-colors"
                  >
                    <Copy size={12} />
                  </button>
                </div>

                {/* Sale code */}
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between relative">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Mã Sale / AM</span>
                  <p className="text-sm font-black text-slate-800 font-mono mt-1">
                    {getProjectCodes(activeProject.id)?.sale_code}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getProjectCodes(activeProject.id)?.sale_code || '');
                      triggerToast('Đã copy mã Sale!', 'success');
                    }}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Copy size={12} />
                  </button>
                </div>

                {/* Production code */}
                <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-xl flex flex-col justify-between relative">
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Mã Sản xuất (PM)</span>
                  <p className="text-sm font-black text-slate-800 font-mono mt-1">
                    {getProjectCodes(activeProject.id)?.production_code}
                  </p>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(getProjectCodes(activeProject.id)?.production_code || '');
                      triggerToast('Đã copy mã Sản xuất!', 'success');
                    }}
                    className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>

              {/* Outsource Code block */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Danh mục mã Outsource (PM cấp thủ công)
                  </span>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Cấp mã thuê thầu phụ dựa trên nhánh mã sản xuất thầu chính.
                  </p>
                </div>

                {/* Outsource Code List */}
                <div className="flex flex-wrap gap-2">
                  {getProjectCodes(activeProject.id)?.outsource_codes.length === 0 ? (
                    <span className="text-[10px] text-slate-400 italic">Chưa phát sinh mã Outsource phụ thầu.</span>
                  ) : (
                    getProjectCodes(activeProject.id)?.outsource_codes.map(oc => (
                      <span
                        key={oc}
                        className="font-mono text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1.5"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>{oc}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(oc);
                            triggerToast(`Đã copy mã outsource ${oc}!`, 'success');
                          }}
                          className="text-slate-400 hover:text-emerald-700 ml-1.5"
                        >
                          <Copy size={10} />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Create Outsource action (Only PM in Active phase) */}
                {activeProject.status === 'Active' && (
                  <div className="pt-1.5">
                    {activeRole === 'PM' ? (
                      <form onSubmit={handleGenerateOutsourceCode} className="flex gap-2">
                        <div className="relative flex-1 max-w-xs">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-mono font-bold uppercase">
                            {getProjectCodes(activeProject.id)?.production_code}.
                          </span>
                          <input
                            type="text"
                            placeholder="Mã (ví dụ: OS-01)..."
                            value={newOutsourceSuffix}
                            onChange={(e) => setNewOutsourceSuffix(e.target.value)}
                            className="w-full text-xs pl-20 pr-3 py-2 bg-slate-50 focus:bg-white border focus:border-indigo-500 outline-none rounded-xl font-mono font-bold text-slate-700"
                          />
                        </div>
                        <button
                          type="submit"
                          className="bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black px-4 py-2 rounded-xl transition-all cursor-pointer"
                        >
                          Cấp mã Outsource
                        </button>
                      </form>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic">
                        💡 Chuyển vai trò giả lập thành "PM / GĐSX" để thực hiện sinh mã thầu phụ Outsource cho các đối tác phụ.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {/* MODULE 3: COST CHANGE REQUEST (CHỐT CHẶN KÉP KHÓA CỨNG) */}
          {activeProject ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Coins size={14} className="text-indigo-600" />
                    <span>Hạng mục yêu cầu thay đổi chi phí (Cost Change Requests)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-semibold">
                    Thay đổi định mức khi dự án đã Active. Đòi hỏi đồng phê duyệt chốt chặn kép (BOD + Kế toán).
                  </p>
                </div>

                {/* Show CR create button only if active */}
                {activeProject.status === 'Active' && (
                  <button
                    onClick={() => {
                      // reset CR fields
                      const stages = getProjectStages(activeProject.id);
                      if (stages.length === 0 || stages.every(s => s.costs.length === 0)) {
                        triggerToast('Không có khoản chi phí nào có sẵn để thay đổi.', 'error');
                        return;
                      }
                      setSelectedCostIdToChange(stages[0]?.costs[0]?.id || '');
                      setRequestedAmountStr('');
                      setChangeReason('');
                      setIsChangeRequestModalOpen(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black px-3 py-2 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <Plus size={12} />
                    <span>Đề xuất thay đổi</span>
                  </button>
                )}
              </div>

              {/* Warnings and Info rules */}
              <div className="bg-indigo-50/40 border border-indigo-150 p-3.5 rounded-xl text-xs space-y-1">
                <p className="font-extrabold text-indigo-900 flex items-center gap-1">
                  <AlertCircle size={14} className="text-indigo-600 shrink-0" />
                  <span>Quy chế Chốt Chặn Kép:</span>
                </p>
                <p className="text-slate-600 font-medium leading-relaxed pl-5">
                  Khi dự án bước vào giai đoạn hoạt động, toàn bộ ngân sách thầu ban đầu bị khóa cứng. Mọi đề xuất phát sinh buộc phải lập phiếu Change Request và chỉ được tự động cập nhật đè vào biểu phí khi <span className="font-bold text-indigo-700">CẢ HAI bộ phận (BOD và Kế toán) đồng thuận Approved</span>.
                </p>
              </div>

              {/* Active Change Requests List */}
              <div className="space-y-3">
                {getChangeRequestsForProject(activeProject.id).length === 0 ? (
                  <p className="text-xs text-slate-400 italic text-center py-4">
                    Không có đề xuất thay đổi chi phí nào trong dự án này.
                  </p>
                ) : (
                  getChangeRequestsForProject(activeProject.id).map(req => (
                    <div
                      key={req.id}
                      className="border border-slate-200 rounded-xl p-4 space-y-3.5 bg-slate-50/50"
                    >
                      {/* Summary details */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                              {req.id}
                            </span>
                            <span className="font-extrabold text-xs text-slate-800">
                              {req.item_name}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 font-semibold pl-1">
                            Giai đoạn: <span className="font-bold">{req.stage_name}</span>
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">Đề xuất thay đổi</p>
                          <p className="text-xs font-mono font-bold text-slate-800 mt-0.5">
                            {req.original_amount.toLocaleString('vi-VN')} đ
                            <span className="text-indigo-600 mx-1.5">➜</span>
                            <span className="font-black text-indigo-700">{req.requested_amount.toLocaleString('vi-VN')} đ</span>
                          </p>
                        </div>
                      </div>

                      {/* Change reason */}
                      <p className="text-xs text-slate-600 font-semibold bg-white p-2.5 rounded-lg border border-slate-100">
                        <span className="font-bold text-slate-500 block text-[9px] uppercase tracking-wider mb-0.5">Lý do thay đổi:</span>
                        "{req.reason}"
                      </p>

                      {/* Approval tracks */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                        <div className="flex flex-wrap gap-4 text-[10px] font-extrabold">
                          {/* BOD check status */}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">BOD Phê duyệt:</span>
                            <span className={`px-2 py-0.5 rounded font-black ${
                              req.bod_approved === true
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.bod_approved === false
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                              {req.bod_approved === true ? 'Approved' : req.bod_approved === false ? 'Rejected' : 'Pending'}
                            </span>
                          </div>

                          {/* Accountant check status */}
                          <div className="flex items-center gap-2">
                            <span className="text-slate-400">Kế toán Phê duyệt:</span>
                            <span className={`px-2 py-0.5 rounded font-black ${
                              req.accountant_approved === true
                                ? 'bg-emerald-100 text-emerald-800'
                                : req.accountant_approved === false
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-slate-100 text-slate-400'
                            }`}>
                              {req.accountant_approved === true ? 'Approved' : req.accountant_approved === false ? 'Rejected' : 'Pending'}
                            </span>
                          </div>
                        </div>

                        {/* Overall request status */}
                        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                          <span className="text-[10px] text-slate-400 font-bold">Trạng thái:</span>
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                            req.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : req.status === 'Rejected'
                              ? 'bg-rose-50 text-rose-800 border-rose-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}>
                            {req.status === 'Approved' ? 'Đã duyệt ghi đè' : req.status === 'Rejected' ? 'Bác bỏ' : 'Chờ duyệt kép'}
                          </span>
                        </div>
                      </div>

                      {/* Live Quick simulator approvals (Show buttons if role is BOD or Accountant and status is Pending) */}
                      {req.status === 'Pending' && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3 bg-slate-100/50 -mx-4 -mb-4 p-3 rounded-b-xl">
                          <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1.5">
                            <UserCheck size={12} className="text-indigo-600" />
                            <span>Thao tác nhanh cho {activeRole === 'BOD' ? 'CEO / BOD' : activeRole === 'Accountant' ? 'Kế toán' : 'các bên có thẩm quyền'}</span>
                          </p>

                          <div className="flex gap-2">
                            {activeRole === 'BOD' && req.bod_approved === null && (
                              <>
                                <button
                                  onClick={() => handleApproveChangeRequest(req.id, 'BOD', true)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Duyệt (Approved)
                                </button>
                                <button
                                  onClick={() => handleApproveChangeRequest(req.id, 'BOD', false)}
                                  className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Bác bỏ (Rejected)
                                </button>
                              </>
                            )}

                            {activeRole === 'Accountant' && req.accountant_approved === null && (
                              <>
                                <button
                                  onClick={() => handleApproveChangeRequest(req.id, 'Accountant', true)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Duyệt (Approved)
                                </button>
                                <button
                                  onClick={() => handleApproveChangeRequest(req.id, 'Accountant', false)}
                                  className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-3 py-1.5 rounded-lg cursor-pointer"
                                >
                                  Bác bỏ (Rejected)
                                </button>
                              </>
                            )}

                            {activeRole !== 'BOD' && activeRole !== 'Accountant' && (
                              <span className="text-[9px] text-slate-400 italic">
                                Hãy chuyển vai trò thành "CEO / BOD" hoặc "Kế toán" để thực hiện phê duyệt.
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}

          {/* AUDIT LOG TRAIL - SYSTEM EVENT TRAIL */}
          {activeProject ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 text-left">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Activity size={14} className="text-indigo-600" />
                  <span>Nhật ký luồng phê duyệt & tích hợp (Audit Trail logs)</span>
                </h3>
                <p className="text-[11px] text-slate-500 font-semibold">
                  Tất cả các thay đổi lịch sử trạng thái của dự án này.
                </p>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1 no-scrollbar-y">
                {getLogsForProject(activeProject.id).map((log, index) => (
                  <div
                    key={log.id || index}
                    className="flex items-start justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100/70 border border-slate-100 transition-all text-xs"
                  >
                    <div className="space-y-1 pr-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-800">{log.actor_name}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 border border-indigo-100 px-2 py-0.2 rounded-md">
                          {log.role}
                        </span>
                      </div>
                      <p className="text-slate-500 font-medium">
                        Hành động: <span className="font-bold text-slate-700">{log.action}</span>
                      </p>
                      <p className="text-slate-500 italic">“{log.comment}”</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] text-slate-400 font-mono font-bold block">{log.created_at}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* MODAL 1: CREATE PROJECT (DRAFT) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-left animate-zoomIn">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Khởi tạo thầu dự án mới</h3>
                <p className="text-[10px] text-slate-400">Trạng thái mặc định: Nháp (Draft)</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Tên Dự án thầu</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: Dự án thầu phần mềm lõi camera thông minh..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Mã khách hàng định danh (Customer code)</label>
                <input
                  type="text"
                  required
                  placeholder="ví dụ: VTX, BIDV, VIN, LCA..."
                  value={newCustomerCode}
                  onChange={(e) => setNewCustomerCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-mono font-bold focus:bg-white focus:border-indigo-500 transition-all"
                />
                <p className="text-[9px] text-slate-400">Mã này sẽ dùng làm tiền tố để tự động sinh mã dự án thầu phân nhánh về sau.</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Tạo dự án nháp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CREATE COST CHANGE REQUEST (ACTIVE ONLY) */}
      {isChangeRequestModalOpen && activeProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-left animate-zoomIn">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Đề xuất thay đổi chi phí</h3>
                <p className="text-[10px] text-indigo-600 font-mono font-bold">Dự án: {activeProject.id}</p>
              </div>
              <button
                onClick={() => setIsChangeRequestModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateChangeRequest} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Chọn hạng mục muốn đổi</label>
                <select
                  value={selectedCostIdToChange}
                  onChange={(e) => setSelectedCostIdToChange(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold"
                >
                  {getProjectStages(activeProject.id).flatMap(stage =>
                    stage.costs.map(c => (
                      <option key={c.id} value={c.id}>
                        {stage.stage_name.substring(0, 15)}... - {c.item_name} ({c.amount.toLocaleString('vi-VN')} đ)
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Số tiền mới mong muốn (VNĐ)</label>
                <input
                  type="text"
                  required
                  placeholder="Nhập số tiền..."
                  value={requestedAmountStr}
                  onChange={(e) => {
                    const rawVal = e.target.value.replace(/,/g, '');
                    if (!isNaN(Number(rawVal))) {
                      setRequestedAmountStr(Number(rawVal).toLocaleString('en-US'));
                    } else if (rawVal === '') {
                      setRequestedAmountStr('');
                    }
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-mono font-bold focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Lý do điều chỉnh thầu chi tiết</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Giải trình lý do phát sinh thực tế bắt buộc điều chỉnh chi phí..."
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangeRequestModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Nộp yêu cầu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REQUEST CLOSE PROJECT */}
      {isCloseModalOpen && activeProject && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden text-left animate-zoomIn">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="space-y-0.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">Đề xuất đóng dự án & thanh lý</h3>
                <p className="text-[10px] text-indigo-600 font-mono font-bold">{activeProject.id}</p>
              </div>
              <button
                onClick={() => setIsCloseModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleRequestClose} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase">Giải trình lý do đóng dự án</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Ghi rõ lý do quyết toán dự án thầu, hoàn tất nghiệm thu sản xuất 100%..."
                  value={closeReason}
                  onChange={(e) => setChangeReason(e.target.value)} // set reason
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 outline-none rounded-xl text-xs font-semibold focus:bg-white focus:border-indigo-500 transition-all"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCloseModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  Nộp yêu cầu đóng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
