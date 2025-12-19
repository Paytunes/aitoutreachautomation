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
	UnifiedItem,
} from "./types";

// Disposition choices constant - Order of call processing by Sales Ops
export const DISPOSITION_CHOICES = [
	["meeting_scheduled", "Meeting Scheduled"],
	["callback_requested", "Callback Requested"],
	["follow_up_needed", "Follow Up Needed"],
	["case_studies_requested", "Case Studies Requested"],
	["share_deck", "Share Deck"],
	["whatsapp_requested", "Whatsapp Requested"],
	["dnd_requested", "DND Requested"],
	["wrong_company", "Wrong Company"],
	["wrong_person", "Wrong Person"],
	["NA", "NA"],
] as const;

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
		updated_at: "2025-12-15T10:30:00Z",
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
		updated_at: "2025-12-14T11:15:00Z",
	},
];

const CAMPAIGNS: AICallCampaign[] = [
	{
		id: "camp-001",
		name: "Q4 Property Lead Generation",
		description: "Outbound campaign to qualify property investment leads",
		started_at: "2024-10-01T00:00:00Z",
		completed_at: undefined,
		bot_id: "1",
		vertical_id: "1",
		solution: "outbound",
		is_active: true,
		additional_metadata: { target: 500, completed: 342 },
		created_at: "2024-09-15T08:00:00Z",
		updated_at: "2025-12-15T09:00:00Z",
	},
	{
		id: "camp-002",
		name: "Insurance Support Enhancement",
		description: "Inbound call routing and claim support automation",
		started_at: "2024-11-01T00:00:00Z",
		completed_at: undefined,
		bot_id: "2",
		vertical_id: "2",
		solution: "inbound",
		is_active: true,
		additional_metadata: { handled_calls: 1250, avg_satisfaction: 4.3 },
		created_at: "2024-10-20T10:00:00Z",
		updated_at: "2025-12-14T14:20:00Z",
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
	{
		id: "lead-001",
		name: "John Smith",
		email: "john.smith@email.com",
		personal_email: "john.personal@gmail.com",
		secondary_email: "john.smith@techcorp.com",
		group_email: "sales@techcorp.com",
		phone: "+91 98765 43210",
		company: "TechCorp Solutions",
		company_type: "Client",
		company_zone: "North",
		company_solution: "bundle_1",
		company_nickname: "TechCorp",
		job_title: "VP of Sales",
	},
	{
		id: "lead-002",
		name: "Alice Johnson",
		email: "alice.j@email.com",
		personal_email: "alice.johnson@yahoo.com",
		secondary_email: "alice.j@globalfinance.com",
		group_email: "operations@globalfinance.com",
		phone: "+91 98765 43211",
		company: "Global Finance Inc",
		company_type: "Agency",
		company_zone: "East",
		company_solution: "bundle_2",
		company_nickname: "GlobalFin",
		job_title: "Director of Operations",
	},
	{
		id: "lead-003",
		name: "Robert Brown",
		email: "rbrown@email.com",
		personal_email: "robert.brown.personal@gmail.com",
		secondary_email: "robert.brown@realestatepartners.com",
		group_email: "management@realestatepartners.com",
		phone: "+91 98765 43212",
		company: "Real Estate Partners",
		company_type: "Client",
		company_zone: "West",
		company_solution: "bundle_3",
		company_nickname: "RE Partners",
		job_title: "Senior Manager",
	},
	{
		id: "lead-004",
		name: "Mary Davis",
		email: "mdavis@email.com",
		personal_email: "mary.davis.personal@yahoo.com",
		secondary_email: "mary.davis@insurancegroup.com",
		group_email: "claims@insurancegroup.com",
		phone: "+91 98765 43213",
		company: "Insurance Group LLC",
		company_type: "Client",
		company_zone: "Central",
		company_solution: "pos_soundbox_consumer_marketing",
		company_nickname: "InsGroup",
		job_title: "Claims Manager",
	},
	{
		id: "lead-005",
		name: "Thomas Wilson",
		email: "twilson@email.com",
		personal_email: "thomas.wilson@gmail.com",
		secondary_email: "thomas.wilson@propertyinvestments.com",
		group_email: "advisors@propertyinvestments.com",
		phone: "+91 98765 43214",
		company: "Property Investments Co",
		company_type: "Agency",
		company_zone: "South",
		company_solution: "metro_train_audio_ads",
		company_nickname: "PropInvest",
		job_title: "Investment Advisor",
	},
	{
		id: "lead-006",
		name: "Sarah Martinez",
		email: "sarah.m@email.com",
		personal_email: "sarah.martinez@gmail.com",
		secondary_email: "sarah.m@commercialrealty.com",
		group_email: "bizdev@commercialrealty.com",
		phone: "+91 98765 43215",
		company: "Commercial Realty",
		company_type: "Client",
		company_zone: "North",
		company_solution: "pos_soundbox_trade_marketing",
		company_nickname: "CommRealty",
		job_title: "Business Development",
	},
	{
		id: "lead-007",
		name: "David Lee",
		email: "david.lee@email.com",
		personal_email: "david.lee.personal@yahoo.com",
		secondary_email: "david.lee@residentialproperties.com",
		group_email: "sales@residentialproperties.com",
		phone: "+91 98765 43216",
		company: "Residential Properties",
		company_type: "Client",
		company_zone: "East",
		company_solution: "bundle_1",
		company_nickname: "ResProps",
		job_title: "Sales Manager",
	},
	{
		id: "lead-008",
		name: "Emily Chen",
		email: "emily.chen@email.com",
		personal_email: "emily.chen.personal@gmail.com",
		secondary_email: "emily.chen@premierinsurance.com",
		group_email: "customer.relations@premierinsurance.com",
		phone: "+91 98765 43217",
		company: "Premier Insurance",
		company_type: "Agency",
		company_zone: "West",
		company_solution: "bundle_2",
		company_nickname: "Premier",
		job_title: "Customer Relations",
	},
	{
		id: "lead-009",
		name: "Michael Taylor",
		email: "m.taylor@email.com",
		personal_email: "michael.taylor@gmail.com",
		secondary_email: "m.taylor@luxuryestates.com",
		group_email: "partners@luxuryestates.com",
		phone: "+91 98765 43218",
		company: "Luxury Estates",
		company_type: "Client",
		company_zone: "Central",
		company_solution: "bundle_3",
		company_nickname: "Luxury",
		job_title: "Senior Partner",
	},
	{
		id: "lead-010",
		name: "Jennifer White",
		email: "j.white@email.com",
		personal_email: "jennifer.white.personal@yahoo.com",
		secondary_email: "j.white@metroproperties.com",
		group_email: "directors@metroproperties.com",
		phone: "+91 98765 43219",
		company: "Metro Properties",
		company_type: "Client",
		company_zone: "South",
		company_solution: "pos_soundbox_consumer_marketing",
		company_nickname: "Metro",
		job_title: "Regional Director",
	},
	{
		id: "lead-011",
		name: "Christopher Anderson",
		email: "chris.a@email.com",
		personal_email: "chris.anderson@gmail.com",
		secondary_email: "chris.a@firsttimebuyers.com",
		group_email: "agents@firsttimebuyers.com",
		phone: "+91 98765 43220",
		company: "First Time Buyers Co",
		company_type: "Client",
		company_zone: "North",
		company_solution: "metro_train_audio_ads",
		company_nickname: "FTB Co",
		job_title: "Buyer's Agent",
	},
	{
		id: "lead-012",
		name: "Amanda Garcia",
		email: "amanda.g@email.com",
		personal_email: "amanda.garcia.personal@yahoo.com",
		secondary_email: "amanda.g@retailsolutions.com",
		group_email: "operations@retailsolutions.com",
		phone: "+91 98765 43221",
		company: "Retail Solutions",
		company_type: "Agency",
		company_zone: "East",
		company_solution: "pos_soundbox_trade_marketing",
		company_nickname: "RetailSol",
		job_title: "Operations Manager",
	},
	{
		id: "lead-013",
		name: "James Rodriguez",
		email: "james.r@email.com",
		personal_email: "james.rodriguez@gmail.com",
		secondary_email: "james.r@investmentproperties.com",
		group_email: "directors@investmentproperties.com",
		phone: "+91 98765 43222",
		company: "Investment Properties Group",
		company_type: "Client",
		company_zone: "West",
		company_solution: "bundle_1",
		company_nickname: "InvestGroup",
		job_title: "Investment Director",
	},
	{
		id: "lead-014",
		name: "Lisa Thompson",
		email: "lisa.t@email.com",
		personal_email: "lisa.thompson.personal@gmail.com",
		secondary_email: "lisa.t@secureinsurance.com",
		group_email: "policies@secureinsurance.com",
		phone: "+91 98765 43223",
		company: "Secure Insurance",
		company_type: "Agency",
		company_zone: "Central",
		company_solution: "bundle_2",
		company_nickname: "Secure",
		job_title: "Policy Manager",
	},
	{
		id: "lead-015",
		name: "Daniel Moore",
		email: "daniel.m@email.com",
		personal_email: "daniel.moore@yahoo.com",
		secondary_email: "daniel.m@urbanproperties.com",
		group_email: "consultants@urbanproperties.com",
		phone: "+91 98765 43224",
		company: "Urban Properties",
		company_type: "Client",
		company_zone: "South",
		company_solution: "bundle_3",
		company_nickname: "Urban",
		job_title: "Property Consultant",
	},
	{
		id: "lead-016",
		name: "Jessica Jackson",
		email: "jessica.j@email.com",
		personal_email: "jessica.jackson.personal@gmail.com",
		secondary_email: "jessica.j@rentalinvestments.com",
		group_email: "portfolio@rentalinvestments.com",
		phone: "+91 98765 43225",
		company: "Rental Investments LLC",
		company_type: "Client",
		company_zone: "North",
		company_solution: "pos_soundbox_consumer_marketing",
		company_nickname: "RentalInvest",
		job_title: "Portfolio Manager",
	},
	{
		id: "lead-017",
		name: "Matthew Harris",
		email: "matt.h@email.com",
		personal_email: "matthew.harris@gmail.com",
		secondary_email: "matt.h@homesolutions.com",
		group_email: "sales@homesolutions.com",
		phone: "+91 98765 43226",
		company: "Home Solutions",
		company_type: "Client",
		company_zone: "East",
		company_solution: "metro_train_audio_ads",
		company_nickname: "HomeSol",
		job_title: "Sales Representative",
	},
	{
		id: "lead-018",
		name: "Nicole Clark",
		email: "nicole.c@email.com",
		personal_email: "nicole.clark.personal@yahoo.com",
		secondary_email: "nicole.c@vacationproperties.com",
		group_email: "marketing@vacationproperties.com",
		phone: "+91 98765 43227",
		company: "Vacation Properties Inc",
		company_type: "Agency",
		company_zone: "West",
		company_solution: "pos_soundbox_trade_marketing",
		company_nickname: "VacationProps",
		job_title: "Marketing Manager",
	},
	{
		id: "lead-019",
		name: "Ryan Lewis",
		email: "ryan.l@email.com",
		personal_email: "ryan.lewis@gmail.com",
		secondary_email: "ryan.l@eliterealestate.com",
		group_email: "executives@eliterealestate.com",
		phone: "+91 98765 43228",
		company: "Elite Real Estate",
		company_type: "Client",
		company_zone: "Central",
		company_solution: "bundle_1",
		company_nickname: "Elite",
		job_title: "Senior VP",
	},
	{
		id: "lead-020",
		name: "Stephanie Walker",
		email: "stephanie.w@email.com",
		personal_email: "stephanie.walker.personal@gmail.com",
		secondary_email: "stephanie.w@trustinsurance.com",
		group_email: "accounts@trustinsurance.com",
		phone: "+91 98765 43229",
		company: "Trust Insurance",
		company_type: "Agency",
		company_zone: "South",
		company_solution: "bundle_2",
		company_nickname: "Trust",
		job_title: "Account Executive",
	},
];

const ACTIONABLES: Actionable[] = [
	{
		id: "act-001",
		name: "Callback by AI - Someone picked up the call",
		description: "Request AI callback when someone else picked up the call",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: [],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-002",
		name: "Callback by AI - Call quality issue",
		description: "Request AI callback due to call quality issues",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: [],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-003",
		name: "Callback by Human - Followup",
		description: "Request human callback for follow-up",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: ["Whatsapp", "Email", "Call"],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-004",
		name: "Callback by Human - Get right POC info",
		description: "Request human callback to get the right point of contact information",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: ["Whatsapp", "Email", "Call"],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-005",
		name: "Callback by Human - Requested Human callback",
		description: "Human callback requested by the lead",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: [],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-006",
		name: "Share deck/case studies - before meeting",
		description: "Share deck or case studies before a scheduled meeting",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: ["Whatsapp", "Email"],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-007",
		name: "Share deck/case studies - independently",
		description: "Share deck or case studies independently without a meeting",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: ["Whatsapp", "Email"],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-008",
		name: "Send meeting invite - all info confirmed",
		description: "Send meeting invite when all information has been confirmed",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: [],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-009",
		name: "Send meeting invite - some info missing",
		description: "Send meeting invite when some information is still missing",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: ["Whatsapp", "Email", "Call"],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-010",
		name: "Update info in CRM - Lead contact info",
		description: "Update lead contact information in CRM",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: [],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-011",
		name: "Update info in CRM - DND",
		description: "Update CRM information for Do Not Disturb requests",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: [],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
	{
		id: "act-012",
		name: "Update info in CRM - IVR",
		description: "Update CRM information based on IVR data",
		is_active: true,
		additional_metadata: {},
		template_data: {},
		dispositions: [],
		default_status: "todo",
		preference: [],
		created_at: "2025-12-15T12:00:00Z",
		updated_at: "2025-12-15T12:00:00Z",
	},
];

const CALL_AUDITS: CallAuditData[] = [
	{
		id: "audit-001",
		lead_id: "lead-001",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-001",
		phone_number: "+91 98765 43210",
		source_phone_number: "+1-555-0100",
		call_duration: 345,
		call_url: "https://audio.example.com/call-001.mp3",
		call_status: "ANSWERED",
		dispositions: "meeting_scheduled",
		interest_level: 8,
		call_summary: "Customer showed strong interest in 3-bedroom property. Requested viewing appointment.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "High priority follow-up. Mentioned budget of $500k.",
		actionables: ["act-005", "act-006", "act-007", "act-008", "act-009"],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.92 },
		created_at: "2025-12-15T09:30:00Z",
		updated_at: "2025-12-15T09:30:00Z",
	},
	{
		id: "audit-002",
		lead_id: "lead-002",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-002",
		phone_number: "+91 98765 43211",
		source_phone_number: "+1-555-0100",
		call_duration: 0,
		call_url: "https://audio.example.com/call-002.mp3",
		call_status: "NO ANSWER",
		dispositions: "not_interested",
		interest_level: 2,
		call_summary: "Lead not interested at this time. Mentioned busy schedule.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: false,
		is_company_name_wrong: true,
		notes: "Potential future opportunity. May follow up next quarter.",
		actionables: [],
		action_status: "pending",
		call_metadata: { sentiment: "neutral", agent_performance: 0.75 },
		created_at: "2025-12-14T10:15:00Z",
		updated_at: "2025-12-14T10:15:00Z",
	},
	{
		id: "audit-003",
		lead_id: "lead-003",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-003",
		phone_number: "+91 98765 43212",
		source_phone_number: "+1-555-0100",
		call_duration: 450,
		call_url: "https://audio.example.com/call-003.mp3",
		call_status: "ANSWERED",
		dispositions: "follow_up_needed",
		interest_level: 7,
		call_summary: "Customer interested in multiple properties. Discussed investment strategy.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Investor profile. Follow up with portfolio analysis.",
		actionables: [],
		action_status: "in-progress",
		call_metadata: { sentiment: "positive", agent_performance: 0.88 },
		created_at: "2025-12-14T11:00:00Z",
		updated_at: "2025-12-14T11:30:00Z",
	},
	{
		id: "audit-004",
		lead_id: "lead-004",
		campaign_id: "camp-002",
		call_id: "CALL-20241201-004",
		phone_number: "+91 98765 43213",
		source_phone_number: "inbound",
		call_duration: 180,
		call_url: "https://audio.example.com/call-004.mp3",
		call_status: "ANSWERED",
		dispositions: "NA",
		interest_level: 9,
		call_summary: "Insurance claim processed successfully. Customer satisfied with resolution.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Positive customer experience. Consider for testimonial.",
		actionables: [],
		action_status: undefined,
		call_metadata: { sentiment: "very_positive", agent_performance: 0.95 },
		created_at: "2025-12-13T13:20:00Z",
		updated_at: "2025-12-13T13:20:00Z",
	},
	{
		id: "audit-005",
		lead_id: "lead-005",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-005",
		phone_number: "+91 98765 43214",
		source_phone_number: "+1-555-0101",
		call_duration: 280,
		call_url: "https://audio.example.com/call-005.mp3",
		call_status: "ANSWERED",
		dispositions: "meeting_scheduled",
		interest_level: 6,
		call_summary: "Customer interested in investment properties. Has questions about financing.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Needs financing education. Schedule follow-up consultation.",
		actionables: [],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.82 },
		created_at: "2025-12-13T14:45:00Z",
		updated_at: "2025-12-13T14:45:00Z",
	},
	{
		id: "audit-006",
		lead_id: "lead-006",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-006",
		phone_number: "+91 98765 43215",
		source_phone_number: "+1-555-0100",
		call_duration: 320,
		call_url: "https://audio.example.com/call-006.mp3",
		call_status: "ANSWERED",
		dispositions: "follow_up_needed",
		interest_level: 7,
		call_summary: "Interested in commercial properties. Requested market analysis report.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Commercial investor. High value potential.",
		actionables: ["act-006"],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.85 },
		created_at: "2025-12-12T15:00:00Z",
		updated_at: "2025-12-12T15:00:00Z",
	},
	{
		id: "audit-007",
		lead_id: "lead-007",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-007",
		phone_number: "+91 98765 43216",
		source_phone_number: "+1-555-0101",
		call_duration: 0,
		call_url: "https://audio.example.com/call-007.mp3",
		call_status: "BUSY",
		dispositions: "not_interested",
		interest_level: 3,
		call_summary: "Currently not in market. Willing to receive information for future.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: false,
		is_company_name_wrong: false,
		notes: "Nurture lead. Follow up in 3 months.",
		actionables: [],
		action_status: "pending",
		call_metadata: { sentiment: "neutral", agent_performance: 0.78 },
		created_at: "2025-12-12T15:30:00Z",
		updated_at: "2025-12-12T15:30:00Z",
	},
	{
		id: "audit-008",
		lead_id: "lead-008",
		campaign_id: "camp-002",
		call_id: "CALL-20241201-008",
		phone_number: "+91 98765 43217",
		source_phone_number: "inbound",
		call_duration: 420,
		call_url: "https://audio.example.com/call-008.mp3",
		call_status: "ANSWERED",
		dispositions: "NA",
		interest_level: 8,
		call_summary: "Insurance claim inquiry resolved. Customer very satisfied with service.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Excellent customer service experience.",
		actionables: [],
		action_status: undefined,
		call_metadata: { sentiment: "very_positive", agent_performance: 0.94 },
		created_at: "2025-12-11T16:00:00Z",
		updated_at: "2025-12-11T16:00:00Z",
	},
	{
		id: "audit-009",
		lead_id: "lead-009",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-009",
		phone_number: "+91 98765 43218",
		source_phone_number: "+1-555-0100",
		call_duration: 380,
		call_url: "https://audio.example.com/call-009.mp3",
		call_status: "ANSWERED",
		dispositions: "meeting_scheduled",
		interest_level: 9,
		call_summary: "Highly interested in luxury properties. Ready to make purchase decision.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "VIP lead. Immediate follow-up required. Budget $1.2M.",
		actionables: ["act-005", "act-006"],
		action_status: "pending",
		call_metadata: { sentiment: "very_positive", agent_performance: 0.96 },
		created_at: "2025-12-11T16:30:00Z",
		updated_at: "2025-12-11T16:30:00Z",
	},
	{
		id: "audit-010",
		lead_id: "lead-010",
		campaign_id: "camp-001",
		call_id: "CALL-20241201-010",
		phone_number: "+91 98765 43219",
		source_phone_number: "+1-555-0101",
		call_duration: 0,
		call_url: "https://audio.example.com/call-010.mp3",
		call_status: "NO ANSWER",
		dispositions: "follow_up_needed",
		interest_level: 6,
		call_summary: "Interested but needs more information about property locations.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Send location map and area information.",
		actionables: ["act-006"],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.8 },
		created_at: "2025-12-15T17:00:00Z",
		updated_at: "2025-12-15T17:00:00Z",
	},
	{
		id: "audit-011",
		lead_id: "lead-011",
		campaign_id: "camp-001",
		call_id: "CALL-20241202-001",
		phone_number: "+91 98765 43220",
		source_phone_number: "+1-555-0100",
		call_duration: 275,
		call_url: "https://audio.example.com/call-011.mp3",
		call_status: "ANSWERED",
		dispositions: "meeting_scheduled",
		interest_level: 7,
		call_summary: "First-time buyer interested in starter homes. Needs guidance on process.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "First-time buyer program. Educational follow-up needed.",
		actionables: ["act-006", "act-007"],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.83 },
		created_at: "2025-12-14T09:00:00Z",
		updated_at: "2025-12-14T09:00:00Z",
	},
	{
		id: "audit-012",
		lead_id: "lead-012",
		campaign_id: "camp-001",
		call_id: "CALL-20241202-002",
		phone_number: "+91 98765 43221",
		source_phone_number: "+1-555-0100",
		call_duration: 0,
		call_url: "https://audio.example.com/call-012.mp3",
		call_status: "FAILED",
		dispositions: "not_interested",
		interest_level: 2,
		call_summary: "Not interested in current offerings. May consider in future.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: false,
		is_company_name_wrong: false,
		notes: "Long-term nurture. Add to newsletter list.",
		actionables: [],
		action_status: "pending",
		call_metadata: { sentiment: "neutral", agent_performance: 0.72 },
		created_at: "2025-12-13T10:00:00Z",
		updated_at: "2025-12-13T10:00:00Z",
	},
	{
		id: "audit-013",
		lead_id: "lead-013",
		campaign_id: "camp-001",
		call_id: "CALL-20241202-003",
		phone_number: "+91 98765 43222",
		source_phone_number: "+1-555-0101",
		call_duration: 510,
		call_url: "https://audio.example.com/call-013.mp3",
		call_status: "ANSWERED",
		dispositions: "meeting_scheduled",
		interest_level: 8,
		call_summary: "Very interested in multiple properties. Wants to schedule viewings.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "High priority. Multiple property interests. Schedule viewings ASAP.",
		actionables: ["act-005", "act-007"],
		action_status: "in-progress",
		call_metadata: { sentiment: "very_positive", agent_performance: 0.91 },
		created_at: "2025-12-12T11:00:00Z",
		updated_at: "2025-12-12T11:30:00Z",
	},
	{
		id: "audit-014",
		lead_id: "lead-014",
		campaign_id: "camp-002",
		call_id: "CALL-20241202-004",
		phone_number: "+91 98765 43223",
		source_phone_number: "inbound",
		call_duration: 240,
		call_url: "https://audio.example.com/call-014.mp3",
		call_status: "ANSWERED",
		dispositions: "NA",
		interest_level: 9,
		call_summary: "Insurance claim processed efficiently. Customer appreciated quick response.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Positive feedback. Consider for case study.",
		actionables: [],
		action_status: undefined,
		call_metadata: { sentiment: "very_positive", agent_performance: 0.93 },
		created_at: "2025-12-11T12:00:00Z",
		updated_at: "2025-12-11T12:00:00Z",
	},
	{
		id: "audit-015",
		lead_id: "lead-015",
		campaign_id: "camp-001",
		call_id: "CALL-20241202-005",
		phone_number: "+91 98765 43224",
		source_phone_number: "+1-555-0100",
		call_duration: 0,
		call_url: "https://audio.example.com/call-015.mp3",
		call_status: "NA",
		dispositions: "follow_up_needed",
		interest_level: 5,
		call_summary: "Moderate interest. Wants to see property photos before deciding.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Send property photos and virtual tour links.",
		actionables: ["act-006"],
		action_status: "pending",
		call_metadata: { sentiment: "neutral", agent_performance: 0.77 },
		created_at: "2025-12-15T13:00:00Z",
		updated_at: "2025-12-15T13:00:00Z",
	},
	{
		id: "audit-016",
		lead_id: "lead-016",
		campaign_id: "camp-001",
		call_id: "CALL-20241202-006",
		phone_number: "+91 98765 43225",
		source_phone_number: "+1-555-0101",
		call_duration: 395,
		call_url: "https://audio.example.com/call-016.mp3",
		call_status: "ANSWERED",
		dispositions: "meeting_scheduled",
		interest_level: 8,
		call_summary: "Interested in rental properties for investment. Discussed ROI expectations.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Investment property lead. Send ROI analysis and rental projections.",
		actionables: ["act-006", "act-007"],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.89 },
		created_at: "2025-12-14T14:00:00Z",
		updated_at: "2025-12-14T14:00:00Z",
	},
	{
		id: "audit-017",
		lead_id: "lead-017",
		campaign_id: "camp-001",
		call_id: "CALL-20241202-007",
		phone_number: "+91 98765 43226",
		source_phone_number: "+1-555-0100",
		call_duration: 0,
		call_url: "https://audio.example.com/call-017.mp3",
		call_status: "NO ANSWER",
		dispositions: "not_interested",
		interest_level: 1,
		call_summary: "Not interested. Already purchased property elsewhere.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: false,
		is_company_name_wrong: false,
		notes: "Closed opportunity. Remove from active list.",
		actionables: [],
		action_status: "pending",
		call_metadata: { sentiment: "negative", agent_performance: 0.7 },
		created_at: "2025-12-13T15:00:00Z",
		updated_at: "2025-12-13T15:00:00Z",
	},
	{
		id: "audit-018",
		lead_id: "lead-018",
		campaign_id: "camp-001",
		call_id: "CALL-20241202-008",
		phone_number: "+91 98765 43227",
		source_phone_number: "+1-555-0101",
		call_duration: 360,
		call_url: "https://audio.example.com/call-018.mp3",
		call_status: "ANSWERED",
		dispositions: "follow_up_needed",
		interest_level: 7,
		call_summary: "Interested in vacation properties. Discussed seasonal rental potential.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Vacation property market. Send seasonal rental data.",
		actionables: ["act-006"],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.86 },
		created_at: "2025-12-12T16:00:00Z",
		updated_at: "2025-12-12T16:00:00Z",
	},
	{
		id: "audit-019",
		lead_id: "lead-019",
		campaign_id: "camp-001",
		call_id: "CALL-20241202-009",
		phone_number: "+91 98765 43228",
		source_phone_number: "+1-555-0100",
		call_duration: 290,
		call_url: "https://audio.example.com/call-019.mp3",
		call_status: "ANSWERED",
		dispositions: "meeting_scheduled",
		interest_level: 9,
		call_summary: "Very interested in luxury condos. Ready to move forward quickly.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "High-value lead. Luxury market. Immediate attention required.",
		actionables: ["act-005", "act-006", "act-007"],
		action_status: "pending",
		call_metadata: { sentiment: "very_positive", agent_performance: 0.95 },
		created_at: "2025-12-11T17:00:00Z",
		updated_at: "2025-12-11T17:00:00Z",
	},
	{
		id: "audit-020",
		lead_id: "lead-020",
		campaign_id: "camp-002",
		call_id: "CALL-20241202-010",
		phone_number: "+91 98765 43229",
		source_phone_number: "inbound",
		call_duration: 200,
		call_url: "https://audio.example.com/call-020.mp3",
		call_status: "ANSWERED",
		dispositions: "NA",
		interest_level: 8,
		call_summary: "Insurance claim resolved. Customer happy with claim settlement.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Satisfied customer. Good candidate for referral program.",
		actionables: [],
		action_status: undefined,
		call_metadata: { sentiment: "positive", agent_performance: 0.88 },
		created_at: "2025-12-15T18:00:00Z",
		updated_at: "2025-12-15T18:00:00Z",
	},
	{
		id: "audit-021",
		lead_id: "lead-007",
		campaign_id: "camp-001",
		call_id: "CALL-20241215-021",
		phone_number: "+91 98765 43216",
		source_phone_number: "+1-555-0100",
		call_duration: 280,
		call_url: "https://audio.example.com/call-021.mp3",
		call_status: "ANSWERED",
		dispositions: "follow_up_needed",
		interest_level: 6,
		call_summary: "Follow-up call regarding property investment opportunities. Requested more information.",
		voicemail_detected: false,
		rpc_verified: true,
		email_captured: true,
		is_company_name_wrong: false,
		notes: "Interested in commercial properties. Schedule follow-up meeting.",
		actionables: ["act-005", "act-006"],
		action_status: "pending",
		call_metadata: { sentiment: "positive", agent_performance: 0.85 },
		created_at: "2025-12-14T11:00:00Z",
		updated_at: "2025-12-14T11:00:00Z",
	},
];

const TASKS: Task[] = [
	{
		id: "task-006",
		actionable_id: "act-005",
		employee_id: "1",
		call_audit_id: "audit-001",
		task_status: "todo",
		description: "Send meeting invite to John Smith for product demo on Dec 5th",
		created_at: "2025-12-15T14:00:00Z",
		updated_at: "2025-12-15T14:00:00Z",
	},
	{
		id: "task-007",
		actionable_id: "act-006",
		employee_id: "2",
		call_audit_id: "audit-002",
		task_status: "todo",
		description: "Send case studies and product deck to Alice Johnson",
		created_at: "2025-12-14T14:15:00Z",
		updated_at: "2025-12-14T14:30:00Z",
	},
	{
		id: "task-008",
		actionable_id: "act-007",
		employee_id: "3",
		call_audit_id: "audit-003",
		task_status: "todo",
		description: "Schedule callback with Robert Brown - discuss pricing options",
		created_at: "2025-12-14T14:20:00Z",
		updated_at: "2025-12-14T14:20:00Z",
	},
	{
		id: "task-009",
		actionable_id: "act-008",
		employee_id: "4",
		call_audit_id: "audit-004",
		task_status: "todo",
		description: "Update lead data in CRM for Thomas Wilson - mark as qualified",
		created_at: "2025-12-13T14:25:00Z",
		updated_at: "2025-12-13T14:40:00Z",
	},
	{
		id: "task-010",
		actionable_id: "act-009",
		employee_id: "1",
		call_audit_id: "audit-005",
		task_status: "todo",
		description: "Text on Whatsapp to Mary Davis - follow up on meeting request",
		created_at: "2025-12-13T14:30:00Z",
		updated_at: "2025-12-13T14:30:00Z",
	},
	{
		id: "task-011",
		actionable_id: "act-005",
		employee_id: "2",
		call_audit_id: "audit-006",
		task_status: "completed",
		description: "Meeting invite sent to Sarah Connor for Dec 8th",
		created_at: "2025-12-12T10:00:00Z",
		updated_at: "2025-12-15T09:00:00Z",
	},
	{
		id: "task-012",
		actionable_id: "act-006",
		employee_id: "3",
		call_audit_id: "audit-007",
		task_status: "completed",
		description: "Case studies and deck sent to Michael Chen",
		created_at: "2025-12-11T15:00:00Z",
		updated_at: "2025-12-12T16:00:00Z",
	},
	{
		id: "task-013",
		actionable_id: "act-007",
		employee_id: "4",
		call_audit_id: "audit-008",
		task_status: "todo",
		description: "Callback scheduled with Jennifer Lee for Dec 3rd at 2 PM",
		created_at: "2025-12-15T10:00:00Z",
		updated_at: "2025-12-15T11:00:00Z",
	},
	{
		id: "task-014",
		actionable_id: "act-008",
		employee_id: "1",
		call_audit_id: "audit-009",
		task_status: "todo",
		description: "Update lead data in CRM for David Kim - add notes from call",
		created_at: "2025-12-14T15:00:00Z",
		updated_at: "2025-12-14T15:00:00Z",
	},
	{
		id: "task-015",
		actionable_id: "act-009",
		employee_id: "2",
		call_audit_id: "audit-010",
		task_status: "completed",
		description: "WhatsApp message sent to Lisa Anderson with meeting details",
		created_at: "2025-12-12T14:00:00Z",
		updated_at: "2025-12-15T08:00:00Z",
	},
	{
		id: "task-016",
		actionable_id: "act-005",
		employee_id: "1",
		call_audit_id: "audit-021",
		task_status: "todo",
		description: "Send meeting invite to David Lee for property investment discussion",
		created_at: "2025-12-14T11:15:00Z",
		updated_at: "2025-12-14T11:15:00Z",
	},
	{
		id: "task-017",
		actionable_id: "act-006",
		employee_id: "1",
		call_audit_id: "audit-001",
		task_status: "todo",
		description: "Send case studies to John Smith - follow up on initial interest",
		created_at: "2025-12-10T09:00:00Z",
		updated_at: "2025-12-10T09:00:00Z",
	},
	{
		id: "task-018",
		actionable_id: "act-007",
		employee_id: "1",
		call_audit_id: "audit-001",
		task_status: "todo",
		description: "Schedule callback with John Smith - discuss pricing options",
		created_at: "2025-12-11T10:30:00Z",
		updated_at: "2025-12-11T10:30:00Z",
	},
	{
		id: "task-019",
		actionable_id: "act-008",
		employee_id: "1",
		call_audit_id: "audit-001",
		task_status: "todo",
		description: "Update CRM for John Smith - mark as high priority lead",
		created_at: "2025-12-09T14:00:00Z",
		updated_at: "2025-12-09T14:00:00Z",
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

// Helper function to apply call audit filters according to business rules
function applyCallAuditFilters(audits: CallAuditView[]): CallAuditView[] {
	return audits.filter((audit) => {
		// Filter 1: Remove calls where status is "BUSY", "NO ANSWER", and "FAILED"
		const excludedStatuses = ["BUSY", "NO ANSWER", "FAILED"];
		if (audit.call_status && excludedStatuses.includes(audit.call_status.toUpperCase())) {
			return false;
		}

		// Filter 2: Check for failed call status with Oriserve
		// If Oriserve status indicates failure, exclude the call
		// Assuming Oriserve status might be in call_metadata or we check for "ORISERVE_FAILED" status
		if (audit.call_status === "FAILED") {
			return false;
		}

		// Filter 3: Remove voicemail disposition calls
		if (audit.dispositions === "voicemail") {
			return false;
		}

		// Filter 4: Remove calls with "Voicemail" and "answering machine" in call summary (case insensitive)
		if (audit.call_summary) {
			const summaryLower = audit.call_summary.toLowerCase();
			if (summaryLower.includes("voicemail") || summaryLower.includes("answering machine")) {
				return false;
			}
		}

		// Filter 5: High interest calls (interest level 5+) without specific dispositions
		// These should be kept but assigned to sales (handled separately, not filtered out)

		return true;
	});
}

// Helper function to check if a phone number has failed 3 times and mark it as wrong in CRM
// In a real system, this would query the database for failure count per phone number
function checkAndMarkWrongNumber(phoneNumber: string, callStatus: string | undefined): void {
	// This is a placeholder - in real implementation, we would:
	// 1. Query all call audits for this phone number
	// 2. Count failures (status = "FAILED" or "ORISERVE_FAILED")
	// 3. If count >= 3, update the lead's phone number as wrong in CRM
	// For now, we'll just log it as a note
	if (callStatus === "FAILED" || callStatus === "ORISERVE_FAILED") {
		// In real system: mark lead phone as wrong in CRM
		// For now, this is handled by the backend when processing calls
	}
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

	// Apply business rule filters (exclude BUSY, NO ANSWER, FAILED, voicemail, etc.)
	results = applyCallAuditFilters(results);

	// Check for numbers that should be marked as wrong (failures >= 3)
	// In real system, this would be handled by a background job
	results.forEach((audit) => {
		checkAndMarkWrongNumber(audit.phone_number, audit.call_status);
	});

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
	let results = TASKS.map((task) => {
		// If task has a linked call audit, populate it with lead and campaign
		let callAuditWithDetails = undefined;
		if (task.call_audit_id) {
			const audit = CALL_AUDITS.find((c) => c.id === task.call_audit_id);
			if (audit) {
				callAuditWithDetails = {
					...audit,
					lead: LEADS.find((l) => l.id === audit.lead_id)!,
					campaign: CAMPAIGNS.find((c) => c.id === audit.campaign_id)!,
				};
			}
		}

		return {
			...task,
			actionable: ACTIONABLES.find((a) => a.id === task.actionable_id)!,
			employee: EMPLOYEES.find((e) => e.id === task.employee_id)!,
			call_audit: callAuditWithDetails,
		};
	});

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

	// If task has a linked call audit, populate it with lead and campaign
	let callAuditWithDetails = undefined;
	if (task.call_audit_id) {
		const audit = CALL_AUDITS.find((c) => c.id === task.call_audit_id);
		if (audit) {
			callAuditWithDetails = {
				...audit,
				lead: LEADS.find((l) => l.id === audit.lead_id)!,
				campaign: CAMPAIGNS.find((c) => c.id === audit.campaign_id)!,
			};
		}
	}

	return {
		...task,
		actionable: ACTIONABLES.find((a) => a.id === task.actionable_id)!,
		employee: EMPLOYEES.find((e) => e.id === task.employee_id)!,
		call_audit: callAuditWithDetails,
	};
}

export async function getTasksByLeadId(leadId: string, excludeTaskId?: string): Promise<TaskView[]> {
	// Find all call audits for this lead
	const auditsForLead = CALL_AUDITS.filter((audit) => audit.lead_id === leadId);
	const auditIds = auditsForLead.map((audit) => audit.id);

	// Find all tasks linked to these call audits, excluding the current task
	const relatedTasks = TASKS.filter(
		(task) => task.call_audit_id && auditIds.includes(task.call_audit_id) && task.id !== excludeTaskId
	);

	// Map to TaskView format
	return relatedTasks.map((task) => {
		// Populate call audit with lead and campaign
		let callAuditWithDetails = undefined;
		if (task.call_audit_id) {
			const audit = CALL_AUDITS.find((c) => c.id === task.call_audit_id);
			if (audit) {
				callAuditWithDetails = {
					...audit,
					lead: LEADS.find((l) => l.id === audit.lead_id)!,
					campaign: CAMPAIGNS.find((c) => c.id === audit.campaign_id)!,
				};
			}
		}

		return {
			...task,
			actionable: ACTIONABLES.find((a) => a.id === task.actionable_id)!,
			employee: EMPLOYEES.find((e) => e.id === task.employee_id)!,
			call_audit: callAuditWithDetails,
		};
	});
}

export function getCampaigns(): AICallCampaign[] {
	return CAMPAIGNS;
}

export function getVerticals(): Vertical[] {
	return VERTICALS;
}

export function getDispositions(): string[] {
	// Return dispositions in the specified order
	return DISPOSITION_CHOICES.map(([value]) => value).filter((value) => {
		// Only return dispositions that exist in the data
		return CALL_AUDITS.some((a) => a.dispositions === value);
	});
}

export function getEmployees(): Employee[] {
	return EMPLOYEES;
}

export function getActionables(): Actionable[] {
	return ACTIONABLES;
}

/**
 * Get recommended actionables based on call audit properties
 * Recommendations are based on disposition, interest level, call summary, and other factors
 */
export function getRecommendedActionables(audit: CallAuditView): string[] {
	const recommendedIds: string[] = [];
	const disposition = audit.dispositions?.toLowerCase();
	const interestLevel = audit.interest_level || 0;
	const callSummary = audit.call_summary?.toLowerCase() || "";
	const isWrongCompany = audit.is_company_name_wrong || false;
	const voicemailDetected = audit.voicemail_detected || false;

	// Map actionables by their intended use cases
	// Callback by AI - Someone picked up the call
	if (callSummary.includes("someone else") || callSummary.includes("different person")) {
		recommendedIds.push("act-001");
	}

	// Callback by AI - Call quality issue
	if (
		callSummary.includes("quality") ||
		callSummary.includes("poor connection") ||
		callSummary.includes("bad line")
	) {
		recommendedIds.push("act-002");
	}

	// Callback by Human - Followup
	if (disposition === "follow_up_needed" || disposition === "callback_requested") {
		recommendedIds.push("act-003");
	}

	// Callback by Human - Get right POC info
	if (isWrongCompany || callSummary.includes("wrong person") || callSummary.includes("not the right contact")) {
		recommendedIds.push("act-004");
	}

	// Callback by Human - Requested Human callback
	if (
		callSummary.includes("speak to human") ||
		callSummary.includes("human representative") ||
		disposition === "callback_requested"
	) {
		recommendedIds.push("act-005");
	}

	// Share deck/case studies - before meeting
	if (
		(disposition === "case_studies_requested" || disposition === "share_deck") &&
		(callSummary.includes("meeting") || callSummary.includes("schedule"))
	) {
		recommendedIds.push("act-006");
	}

	// Share deck/case studies - independently
	if (disposition === "case_studies_requested" || disposition === "share_deck") {
		recommendedIds.push("act-007");
	}

	// Send meeting invite - all info confirmed
	if (disposition === "meeting_scheduled" && interestLevel >= 7 && !callSummary.includes("missing")) {
		recommendedIds.push("act-008");
	}

	// Send meeting invite - some info missing
	if (disposition === "meeting_scheduled" && (callSummary.includes("missing") || callSummary.includes("need more"))) {
		recommendedIds.push("act-009");
	}

	// Update info in CRM - Lead contact info
	if (
		callSummary.includes("update contact") ||
		callSummary.includes("wrong email") ||
		callSummary.includes("wrong phone")
	) {
		recommendedIds.push("act-010");
	}

	// Update info in CRM - DND
	if (disposition === "dnd_requested" || callSummary.includes("do not disturb") || callSummary.includes("dnd")) {
		recommendedIds.push("act-011");
	}

	// Update info in CRM - IVR
	if (callSummary.includes("ivr") || callSummary.includes("interactive voice")) {
		recommendedIds.push("act-012");
	}

	// Combine with existing recommendations from audit.actionables
	const existingRecommendations = audit.actionables || [];
	const combinedRecommendations = [...new Set([...recommendedIds, ...existingRecommendations])];

	return combinedRecommendations;
}

// Unified API to get both Call Audits and Tasks in a single list
export async function getUnifiedItems(
	page = 1,
	limit = 10,
	filters?: {
		type?: "call_audit" | "task" | "all";
		status?: string; // For tasks: "todo" | "completed"
		employee_id?: string; // For tasks
		campaign_id?: string; // For call audits
		disposition?: string; // For call audits
	}
): Promise<{ data: UnifiedItem[]; total: number; page: number; limit: number }> {
	// Get all call audits
	const allCallAudits = CALL_AUDITS.map((audit) => ({
		...audit,
		lead: LEADS.find((l) => l.id === audit.lead_id)!,
		campaign: CAMPAIGNS.find((c) => c.id === audit.campaign_id)!,
	}));

	// Get all tasks
	const allTasks = TASKS.map((task) => {
		// If task has a linked call audit, populate it with lead and campaign
		let callAuditWithDetails = undefined;
		if (task.call_audit_id) {
			const audit = CALL_AUDITS.find((c) => c.id === task.call_audit_id);
			if (audit) {
				callAuditWithDetails = {
					...audit,
					lead: LEADS.find((l) => l.id === audit.lead_id)!,
					campaign: CAMPAIGNS.find((c) => c.id === audit.campaign_id)!,
				};
			}
		}

		return {
			...task,
			actionable: ACTIONABLES.find((a) => a.id === task.actionable_id)!,
			employee: EMPLOYEES.find((e) => e.id === task.employee_id)!,
			call_audit: callAuditWithDetails,
		};
	});

	// Apply business rule filters to call audits (exclude BUSY, NO ANSWER, FAILED, voicemail, etc.)
	let filteredCallAudits = applyCallAuditFilters(allCallAudits);

	// Apply additional filters
	if (filters?.campaign_id) {
		filteredCallAudits = filteredCallAudits.filter((a) => a.campaign_id === filters.campaign_id);
	}
	if (filters?.disposition) {
		filteredCallAudits = filteredCallAudits.filter((a) => a.dispositions === filters.disposition);
	}

	// Filter tasks
	let filteredTasks = allTasks;
	if (filters?.status) {
		filteredTasks = filteredTasks.filter((t) => t.task_status === filters.status);
	}
	if (filters?.employee_id) {
		filteredTasks = filteredTasks.filter((t) => t.employee_id === filters.employee_id);
	}

	// Convert to unified items
	const callAuditItems: UnifiedItem[] = filteredCallAudits.map((audit) => ({
		type: "call_audit",
		id: audit.id,
		created_at: audit.created_at,
		updated_at: audit.updated_at,
		call_audit: audit,
	}));

	const taskItems: UnifiedItem[] = filteredTasks.map((task) => ({
		type: "task",
		id: task.id,
		created_at: task.created_at,
		updated_at: task.updated_at,
		task: task,
	}));

	// Combine and filter by type if specified
	let combinedItems: UnifiedItem[] = [];
	if (!filters?.type || filters.type === "all") {
		combinedItems = [...callAuditItems, ...taskItems];
	} else if (filters.type === "call_audit") {
		combinedItems = callAuditItems;
	} else if (filters.type === "task") {
		combinedItems = taskItems;
	}

	// Sort by created_at descending (most recent first)
	combinedItems.sort((a, b) => {
		const dateA = new Date(a.created_at).getTime();
		const dateB = new Date(b.created_at).getTime();
		return dateB - dateA;
	});

	// Paginate
	const start = (page - 1) * limit;
	const end = start + limit;
	const paginated = combinedItems.slice(start, end);

	return { data: paginated, total: combinedItems.length, page, limit };
}

// Helper function to get unified item by ID (works for both call audits and tasks)
export async function getUnifiedItemById(id: string): Promise<UnifiedItem | null> {
	// Try call audit first
	const audit = CALL_AUDITS.find((a) => a.id === id);
	if (audit) {
		return {
			type: "call_audit",
			id: audit.id,
			created_at: audit.created_at,
			updated_at: audit.updated_at,
			call_audit: {
				...audit,
				lead: LEADS.find((l) => l.id === audit.lead_id)!,
				campaign: CAMPAIGNS.find((c) => c.id === audit.campaign_id)!,
			},
		};
	}

	// Try task
	const task = TASKS.find((t) => t.id === id);
	if (task) {
		// If task has a linked call audit, populate it with lead and campaign
		let callAuditWithDetails = undefined;
		if (task.call_audit_id) {
			const linkedAudit = CALL_AUDITS.find((c) => c.id === task.call_audit_id);
			if (linkedAudit) {
				callAuditWithDetails = {
					...linkedAudit,
					lead: LEADS.find((l) => l.id === linkedAudit.lead_id)!,
					campaign: CAMPAIGNS.find((c) => c.id === linkedAudit.campaign_id)!,
				};
			}
		}

		return {
			type: "task",
			id: task.id,
			created_at: task.created_at,
			updated_at: task.updated_at,
			task: {
				...task,
				actionable: ACTIONABLES.find((a) => a.id === task.actionable_id)!,
				employee: EMPLOYEES.find((e) => e.id === task.employee_id)!,
				call_audit: callAuditWithDetails,
			},
		};
	}

	return null;
}

// Update task notes
export async function updateTaskNotes(taskId: string, notes: string): Promise<void> {
	const taskIndex = TASKS.findIndex((t) => t.id === taskId);
	if (taskIndex === -1) {
		throw new Error(`Task with id ${taskId} not found`);
	}

	// Update the task notes and updated_at timestamp
	TASKS[taskIndex] = {
		...TASKS[taskIndex],
		notes,
		updated_at: new Date().toISOString(),
	};

	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 300));
}

// Update call audit notes
export async function updateCallAuditNotes(auditId: string, notes: string): Promise<void> {
	const auditIndex = CALL_AUDITS.findIndex((a) => a.id === auditId);
	if (auditIndex === -1) {
		throw new Error(`Call audit with id ${auditId} not found`);
	}

	// Update the call audit notes and updated_at timestamp
	CALL_AUDITS[auditIndex] = {
		...CALL_AUDITS[auditIndex],
		notes,
		updated_at: new Date().toISOString(),
	};

	// Simulate API delay
	await new Promise((resolve) => setTimeout(resolve, 300));
}
