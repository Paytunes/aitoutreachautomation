import type {
	Vertical,
	Bot,
	AICallCampaign,
	LeadContact,
	Actionable,
	Employee,
	Task,
	CallAuditData,
	CallAuditView,
	TaskView,
	DashboardMetrics,
} from "./types";

// Mock Data
const VERTICALS: Vertical[] = [
	{ id: "1", name: "Paytunes" },
	{ id: "2", name: "Virsora" },
	// Legacy verticals (can be removed when not needed)
	{ id: "3", name: "Real Estate" },
	{ id: "4", name: "Insurance" },
	{ id: "5", name: "Finance" },
];

const EMPLOYEES: Employee[] = [
	{ id: "1", name: "Sarah Johnson", email: "sarah@example.com" },
	{ id: "2", name: "Michael Chen", email: "michael@example.com" },
	{ id: "3", name: "Emma Rodriguez", email: "emma@example.com" },
	{ id: "4", name: "James Wilson", email: "james@example.com" },
];

const BOTS: Bot[] = [
	{
		id: "1",
		agent_name: "Real Estate Qualifier",
		vertical_id: "1",
		purpose_of_call: "Qualify leads for real estate investment",
		phone_number: ["+1-555-0100", "+1-555-0101"],
		re_engagement_text: ["Follow-up on property interest", "Schedule viewing"],
		max_duration_call: 600,
		inbound_enabled: true,
		call_opening_statement: "Hello, I am calling about available properties in your area.",
		inbound_call_opening_statement: "Thank you for calling. How can I help you today?",
		generative_prompt: "Qualify leads based on budget and property type",
		analytics_prompt: "Analyze call sentiment and objections",
		is_active: true,
		additional_metadata: { version: "2.1", model: "GPT-4" },
		created_at: "2024-01-15T08:00:00Z",
		updated_at: "2024-12-01T10:30:00Z",
	},
	{
		id: "2",
		agent_name: "Insurance Claims Assistant",
		vertical_id: "2",
		purpose_of_call: "Handle insurance claim inquiries",
		phone_number: ["+1-555-0200"],
		re_engagement_text: ["Claim status update", "Documentation required"],
		max_duration_call: 900,
		inbound_enabled: true,
		call_opening_statement: "Thank you for contacting us. What is your claim number?",
		inbound_call_opening_statement: "Insurance claims support. How may I assist you?",
		generative_prompt: "Process claims and provide status updates",
		analytics_prompt: "Monitor claim sentiment and satisfaction",
		is_active: true,
		additional_metadata: { version: "1.8", model: "Claude-3" },
		created_at: "2024-02-20T09:00:00Z",
		updated_at: "2024-12-01T11:15:00Z",
	},
];

const CAMPAIGNS: AICallCampaign[] = [
	{
		id: "camp-001",
		name: "Q4 Property Lead Generation",
		description: "Outbound campaign to qualify property investment leads",
		started_at: "2024-10-01T00:00:00Z",
		completed_at: null,
		bot_id: "1",
		vertical_id: "1",
		solution: "outbound",
		is_active: true,
		additional_metadata: { target: 500, completed: 342 },
		created_at: "2024-09-15T08:00:00Z",
		updated_at: "2024-12-01T09:00:00Z",
	},
	{
		id: "camp-002",
		name: "Insurance Support Enhancement",
		description: "Inbound call routing and claim support automation",
		started_at: "2024-11-01T00:00:00Z",
		completed_at: null,
		bot_id: "2",
		vertical_id: "2",
		solution: "inbound",
		is_active: true,
		additional_metadata: { handled_calls: 1250, avg_satisfaction: 4.3 },
		created_at: "2024-10-20T10:00:00Z",
		updated_at: "2024-12-01T14:20:00Z",
	},
	{
		id: "camp-003",
		name: "Summer Lead Nurturing",
		description: "Re-engagement campaign for past prospects",
		started_at: "2024-06-01T00:00:00Z",
		completed_at: "2024-08-31T23:59:59Z",
		bot_id: "1",
		vertical_id: "1",
		solution: "outbound",
		is_active: false,
		additional_metadata: { target: 800, completed: 758 },
		created_at: "2024-05-10T08:00:00Z",
		updated_at: "2024-09-01T16:30:00Z",
	},
];

const LEADS: LeadContact[] = [
	{ id: "lead-001", name: "John Smith", email: "john.smith@email.com", phone: "555-0001" },
	{ id: "lead-002", name: "Alice Johnson", email: "alice.j@email.com", phone: "555-0002" },
	{ id: "lead-003", name: "Robert Brown", email: "rbrown@email.com", phone: "555-0003" },
	{ id: "lead-004", name: "Mary Davis", email: "mdavis@email.com", phone: "555-0004" },
	{ id: "lead-005", name: "Thomas Wilson", email: "twilson@email.com", phone: "555-0005" },
];

const ACTIONABLES: Actionable[] = [
	{
		id: "act-005",
		name: "Send meeting invite",
		description: "Schedule and send meeting invitation to the lead",
		is_active: true,
		additional_metadata: { priority: "high", category: "scheduling" },
		created_at: "2024-12-01T12:00:00Z",
		updated_at: "2024-12-01T12:00:00Z",
	},
	{
		id: "act-006",
		name: "Send case studies and deck",
		description: "Share case studies and product deck with the lead",
		is_active: true,
		additional_metadata: { priority: "medium", category: "documentation" },
		created_at: "2024-12-01T12:15:00Z",
		updated_at: "2024-12-01T12:15:00Z",
	},
	{
		id: "act-007",
		name: "Callback",
		description: "Schedule a callback with the lead",
		is_active: true,
		additional_metadata: { priority: "high", category: "follow-up" },
		created_at: "2024-12-01T12:30:00Z",
		updated_at: "2024-12-01T12:30:00Z",
	},
	{
		id: "act-008",
		name: "Update lead data in CRM",
		description: "Update lead information and status in CRM system",
		is_active: true,
		additional_metadata: { priority: "medium", category: "data-management" },
		created_at: "2024-12-01T12:45:00Z",
		updated_at: "2024-12-01T12:45:00Z",
	},
	{
		id: "act-009",
		name: "Text on Whatsapp",
		description: "Send WhatsApp message to the lead",
		is_active: true,
		additional_metadata: { priority: "medium", category: "communication" },
		created_at: "2024-12-01T13:00:00Z",
		updated_at: "2024-12-01T13:00:00Z",
	},
];

const CALL_AUDITS: CallAuditData[] = [
	{
		id: "audit-001",
		lead_id: "lead-001",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-001",
		phone_number: "555-0001",
		source_phone_number: "+1-555-0100",
		call_duration: 345,
		call_url: "https://audio.example.com/call-001.mp3",
		call_status: "completed",
		dispositions: "Interested",
		interest_level: 8,
		call_summary: "Customer showed strong interest in 3-bedroom property. Requested viewing appointment.",
		voicemail_detected: false,
		rpc_verified: true,
		notes: "High priority follow-up. Mentioned budget of $500k.",
		actionables: ["act-005", "act-006", "act-007", "act-008", "act-009"],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.92 },
		created_at: "2024-12-01T09:30:00Z",
		updated_at: "2024-12-01T09:30:00Z",
	},
	{
		id: "audit-002",
		lead_id: "lead-002",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-002",
		phone_number: "555-0002",
		source_phone_number: "+1-555-0100",
		call_duration: 120,
		call_url: "https://audio.example.com/call-002.mp3",
		call_status: "completed",
		dispositions: "Not Interested",
		interest_level: 2,
		call_summary: "Lead not interested at this time. Mentioned busy schedule.",
		voicemail_detected: false,
		rpc_verified: true,
		notes: "Potential future opportunity. May follow up next quarter.",
		actionables: [],
		action_status: "pending",
		call_metadata: { sentiment: "neutral", agent_performance: 0.75 },
		created_at: "2024-12-01T10:15:00Z",
		updated_at: "2024-12-01T10:15:00Z",
	},
	{
		id: "audit-003",
		lead_id: "lead-003",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-003",
		phone_number: "555-0003",
		source_phone_number: "+1-555-0100",
		call_duration: 450,
		call_url: "https://audio.example.com/call-003.mp3",
		call_status: "completed",
		dispositions: "Warm Lead",
		interest_level: 7,
		call_summary: "Customer interested in multiple properties. Discussed investment strategy.",
		voicemail_detected: false,
		rpc_verified: true,
		notes: "Investor profile. Follow up with portfolio analysis.",
		actionables: [],
		action_status: "in-progress",
		call_metadata: { sentiment: "positive", agent_performance: 0.88 },
		created_at: "2024-12-01T11:00:00Z",
		updated_at: "2024-12-01T11:30:00Z",
	},
	{
		id: "audit-004",
		lead_id: "lead-004",
		campaign_id: "camp-002",
		call_id: "CALL-20241201-004",
		phone_number: "555-0004",
		source_phone_number: "inbound",
		call_duration: 180,
		call_url: "https://audio.example.com/call-004.mp3",
		call_status: "completed",
		dispositions: "Claim Processed",
		interest_level: 9,
		call_summary: "Insurance claim processed successfully. Customer satisfied with resolution.",
		voicemail_detected: false,
		rpc_verified: true,
		notes: "Positive customer experience. Consider for testimonial.",
		actionables: [],
		action_status: null,
		call_metadata: { sentiment: "very_positive", agent_performance: 0.95 },
		created_at: "2024-12-01T13:20:00Z",
		updated_at: "2024-12-01T13:20:00Z",
	},
	{
		id: "audit-005",
		lead_id: "lead-005",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-005",
		phone_number: "555-0005",
		source_phone_number: "+1-555-0101",
		call_duration: 280,
		call_url: "https://audio.example.com/call-005.mp3",
		call_status: "completed",
		dispositions: "Interested",
		interest_level: 6,
		call_summary: "Customer interested in investment properties. Has questions about financing.",
		voicemail_detected: false,
		rpc_verified: true,
		notes: "Needs financing education. Schedule follow-up consultation.",
		actionables: [],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.82 },
		created_at: "2024-12-01T14:45:00Z",
		updated_at: "2024-12-01T14:45:00Z",
	},
];

const TASKS: Task[] = [
	{
		id: "task-006",
		actionable_id: "act-005",
		employee_id: "1",
		task_status: "pending",
		description: "Send meeting invite to John Smith for product demo on Dec 5th",
		created_at: "2024-12-01T14:00:00Z",
		updated_at: "2024-12-01T14:00:00Z",
	},
	{
		id: "task-007",
		actionable_id: "act-006",
		employee_id: "2",
		task_status: "in-progress",
		description: "Send case studies and product deck to Alice Johnson",
		created_at: "2024-12-01T14:15:00Z",
		updated_at: "2024-12-01T14:30:00Z",
	},
	{
		id: "task-008",
		actionable_id: "act-007",
		employee_id: "3",
		task_status: "pending",
		description: "Schedule callback with Robert Brown - discuss pricing options",
		created_at: "2024-12-01T14:20:00Z",
		updated_at: "2024-12-01T14:20:00Z",
	},
	{
		id: "task-009",
		actionable_id: "act-008",
		employee_id: "4",
		task_status: "in-progress",
		description: "Update lead data in CRM for Thomas Wilson - mark as qualified",
		created_at: "2024-12-01T14:25:00Z",
		updated_at: "2024-12-01T14:40:00Z",
	},
	{
		id: "task-010",
		actionable_id: "act-009",
		employee_id: "1",
		task_status: "pending",
		description: "Text on Whatsapp to Mary Davis - follow up on meeting request",
		created_at: "2024-12-01T14:30:00Z",
		updated_at: "2024-12-01T14:30:00Z",
	},
	{
		id: "task-011",
		actionable_id: "act-005",
		employee_id: "2",
		task_status: "completed",
		description: "Meeting invite sent to Sarah Connor for Dec 8th",
		created_at: "2024-11-30T10:00:00Z",
		updated_at: "2024-12-01T09:00:00Z",
	},
	{
		id: "task-012",
		actionable_id: "act-006",
		employee_id: "3",
		task_status: "completed",
		description: "Case studies and deck sent to Michael Chen",
		created_at: "2024-11-29T15:00:00Z",
		updated_at: "2024-11-30T16:00:00Z",
	},
	{
		id: "task-013",
		actionable_id: "act-007",
		employee_id: "4",
		task_status: "in-progress",
		description: "Callback scheduled with Jennifer Lee for Dec 3rd at 2 PM",
		created_at: "2024-12-01T10:00:00Z",
		updated_at: "2024-12-01T11:00:00Z",
	},
	{
		id: "task-014",
		actionable_id: "act-008",
		employee_id: "1",
		task_status: "pending",
		description: "Update lead data in CRM for David Kim - add notes from call",
		created_at: "2024-12-01T15:00:00Z",
		updated_at: "2024-12-01T15:00:00Z",
	},
	{
		id: "task-015",
		actionable_id: "act-009",
		employee_id: "2",
		task_status: "completed",
		description: "WhatsApp message sent to Lisa Anderson with meeting details",
		created_at: "2024-11-30T14:00:00Z",
		updated_at: "2024-12-01T08:00:00Z",
	},
];

// API Functions
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
	return {
		total_audits: CALL_AUDITS.length,
		total_tasks: TASKS.length,
		completed_tasks: TASKS.filter((t) => t.task_status === "completed").length,
		active_campaigns: CAMPAIGNS.filter((c) => c.is_active).length,
	};
}

export async function getCallAudits(
	page = 1,
	limit = 10,
	filters?: {
		campaign_id?: string;
		disposition?: string;
		interest_level?: number;
		date_from?: string;
		date_to?: string;
	}
): Promise<{ data: CallAuditView[]; total: number; page: number; limit: number }> {
	let results = CALL_AUDITS.map((audit) => ({
		...audit,
		lead: LEADS.find((l) => l.id === audit.lead_id)!,
		campaign: CAMPAIGNS.find((c) => c.id === audit.campaign_id)!,
	}));

	if (filters?.campaign_id) {
		results = results.filter((a) => a.campaign_id === filters.campaign_id);
	}
	if (filters?.disposition) {
		results = results.filter((a) => a.dispositions === filters.disposition);
	}
	if (filters?.interest_level !== undefined) {
		results = results.filter((a) => a.interest_level === filters.interest_level);
	}

	const start = (page - 1) * limit;
	const end = start + limit;
	const paginated = results.slice(start, end);

	return { data: paginated, total: results.length, page, limit };
}

export async function getCallAuditById(id: string): Promise<CallAuditView | null> {
	const audit = CALL_AUDITS.find((a) => a.id === id);
	if (!audit) return null;

	return {
		...audit,
		lead: LEADS.find((l) => l.id === audit.lead_id)!,
		campaign: CAMPAIGNS.find((c) => c.id === audit.campaign_id)!,
	};
}

export async function getTasks(
	page = 1,
	limit = 10,
	filters?: {
		status?: string;
		employee_id?: string;
		date_from?: string;
		date_to?: string;
	}
): Promise<{ data: TaskView[]; total: number; page: number; limit: number }> {
	let results = TASKS.map((task) => ({
		...task,
		actionable: ACTIONABLES.find((a) => a.id === task.actionable_id)!,
		employee: EMPLOYEES.find((e) => e.id === task.employee_id)!,
	}));

	if (filters?.status) {
		results = results.filter((t) => t.task_status === filters.status);
	}
	if (filters?.employee_id) {
		results = results.filter((t) => t.employee_id === filters.employee_id);
	}

	const start = (page - 1) * limit;
	const end = start + limit;
	const paginated = results.slice(start, end);

	return { data: paginated, total: results.length, page, limit };
}

export async function getTaskById(id: string): Promise<TaskView | null> {
	const task = TASKS.find((t) => t.id === id);
	if (!task) return null;

	return {
		...task,
		actionable: ACTIONABLES.find((a) => a.id === task.actionable_id)!,
		employee: EMPLOYEES.find((e) => e.id === task.employee_id)!,
	};
}

export function getCampaigns(): AICallCampaign[] {
	return CAMPAIGNS;
}

export function getVerticals(): Vertical[] {
	return VERTICALS;
}

export function getDispositions(): string[] {
	return [...new Set(CALL_AUDITS.map((a) => a.dispositions).filter(Boolean))];
}

export function getEmployees(): Employee[] {
	return EMPLOYEES;
}

export function getActionables(): Actionable[] {
	return ACTIONABLES;
}
