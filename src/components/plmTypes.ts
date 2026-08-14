// Database Entity Types according to PRD V2.0

export type ProjectStatus =
  | 'Draft'
  | 'Pending_GDKhoi'
  | 'Code_Generated'
  | 'Pending_BOD'
  | 'Pending_Accountant'
  | 'Pending_IT'
  | 'Jira_Syncing'
  | 'Active'
  | 'Closed';

export interface Project {
  id: string; // UUID or ID string
  customer_code: string; // e.g. "VTX", "BIDV", "VIN"
  project_name: string;
  sale_id: string;
  sale_name: string;
  status: ProjectStatus;
  created_at: string;
  
  // Closing approvals tracker
  closing_approved_gdkhoi?: boolean | null;
  closing_approved_accountant?: boolean | null;
  closing_approved_bod?: boolean | null;
  closing_reason?: string;
}

export interface ProjectCodes {
  id: string;
  project_id: string;
  master_code: string;       // e.g. VTX.284
  sale_code: string;         // e.g. VTX.284.1
  production_code: string;   // e.g. VTX.284.2
  outsource_codes: string[]; // e.g. [VTX.284.2.1, VTX.284.2.2] manually created by PM in Active phase
}

export interface StageCosts {
  id: string;
  stage_id: string;
  item_name: string;
  amount: number;
  description: string;
}

export interface ProjectStages {
  id: string;
  project_id: string;
  stage_name: string;
  order_index: number;
  start_date: string;
  end_date: string;
  costs: StageCosts[];
}

export interface CostChangeRequests {
  id: string;
  project_id: string;
  stage_cost_id: string; // Links to the cost item to change
  stage_name: string;    // Helper for displaying which stage
  item_name: string;     // Helper for displaying which item
  original_amount: number; // Helper for visual contrast
  requested_amount: number;
  reason: string;
  bod_approved: boolean | null;
  accountant_approved: boolean | null;
  status: 'Pending' | 'Approved' | 'Rejected';
  created_at: string;
}

export interface ApprovalLog {
  id: string;
  project_id: string;
  actor_name: string;
  role: string;
  action: string; // e.g. "Submit", "Approve", "Reject", "Technical Approve"
  comment: string;
  created_at: string;
}
