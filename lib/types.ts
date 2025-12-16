// Database Model Types

export interface Vertical {
	id: string;
	name: string;
}

export interface Bot {
	id: string;
	agent_name: string;
	vertical_id: string;
	purpose_of_call: string;
	phone_number: string[];
	re_engagement_text: string[];
	max_duration_call?: number;
	inbound_enabled: boolean;
	call_opening_statement?: string;
	inbound_call_opening_statement?: string;
	generative_prompt?: string;
	analytics_prompt?: string;
	is_active: boolean;
	additional_metadata: Record<string, any>;
	created_at: string;
	updated_at: string;
}

export interface AICallCampaign {
	id: string;
	name: string;
	description?: string;
	started_at?: string;
	completed_at?: string;
	bot_id: string;
	vertical_id?: string;
	solution: string;
	is_active: boolean;
	additional_metadata: Record<string, any>;
	created_at: string;
	updated_at: string;
}

export interface LeadContact {
	id: string;
	name: string;
	email?: string;
	phone?: string;
	company?: string;
	company_type?: string;
	company_zone?: string;
	company_solution?: string;
	company_nickname?: string;
	job_title?: string;
}

export interface Actionable {
	id: string;
	name: string;
	description?: string;
	is_active: boolean;
	additional_metadata?: Record<string, any>;
	created_at: string;
	updated_at: string;
}

export interface Employee {
	id: string;
	name: string;
	email: string;
}

export interface Task {
	id: string;
	actionable_id: string;
	employee_id: string;
	call_audit_id?: string;
	task_status: "todo" | "completed";
	description?: string;
	created_at: string;
	updated_at: string;
}

export interface CallAuditData {
	id: string;
	lead_id: string;
	campaign_id: string;
	call_id: string;
	phone_number: string;
	source_phone_number?: string;
	call_duration?: number;
	call_url?: string;
	call_status?: string;
	dispositions?: string;
	interest_level?: number;
	call_summary?: string;
	voicemail_detected: boolean;
	rpc_verified: boolean;
	email_captured?: boolean;
	is_company_name_wrong?: boolean;
	notes?: string;
	actionables: string[];
	action_status?: string;
	call_metadata?: Record<string, any>;
	created_at: string;
	updated_at: string;
}

// Extended types for views
export interface CallAuditView extends CallAuditData {
	lead: LeadContact;
	campaign: AICallCampaign;
}

export interface TaskView extends Task {
	actionable: Actionable;
	employee: Employee;
	call_audit?: CallAuditView;
}

export interface DashboardMetrics {
	total_audits: number;
	total_tasks: number;
	completed_tasks: number;
	active_campaigns: number;
}
