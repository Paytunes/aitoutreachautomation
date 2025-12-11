import { getDashboardMetrics, getCallAudits, getTasks, getCampaigns } from "@/lib/mock-api";
import { DashboardWrapper } from "@/components/dashboard-wrapper";
import { DashboardHeader } from "@/components/dashboard-header";
import { getUserTypeFromToken } from "@/lib/auth";

export default async function DashboardPage() {
	// Get user type from token
	const userType = await getUserTypeFromToken();
	const [metrics, recentAudits, recentTasks, campaigns] = await Promise.all([
		getDashboardMetrics(),
		getCallAudits(1, 5),
		getTasks(1, 5),
		getCampaigns(),
	]);

	// Prepare chart data
	const campaignData = campaigns.map((c) => {
		const totalCalls = Math.floor(Math.random() * 500) + 200;
		const answeredCalls = Math.floor(totalCalls * 0.75);
		const convertedCalls = Math.floor(answeredCalls * 0.35);

		return {
			name: c.name,
			total_calls: totalCalls,
			answered_calls: answeredCalls,
			converted_calls: convertedCalls,
		};
	});

	// Disposition choices from backend
	const DISPOSITION_CHOICES = [
		["meeting_scheduled", "Meeting Scheduled"],
		["whatsapp_requested", "Whatsapp Requested"],
		["follow_up_needed", "Follow Up Needed"],
		["case_studies_requested", "Case Studies Requested"],
		["callback_requested", "Callback Requested"],
		["share_deck", "Share Deck"],
		["voicemail", "Voicemail"],
		["technical_issues", "Technical Issues"],
		["wrong_company", "Wrong Company"],
		["wrong_person", "Wrong Person"],
		["not_interested", "Not Interested"],
		["dnd_requested", "DND Requested"],
		["NA", "NA"],
	] as const;

	// Generate disposition data based on backend choices
	// Using actual color values instead of CSS variables for recharts compatibility
	const chartColors = [
		"#6366f1", // Indigo
		"#22c55e", // Green
		"#f59e0b", // Amber
		"#ef4444", // Red
		"#8b5cf6", // Purple
		"#06b6d4", // Cyan
		"#ec4899", // Pink
		"#f97316", // Orange
		"#84cc16", // Lime
		"#14b8a6", // Teal
		"#3b82f6", // Blue
		"#a855f7", // Violet
		"#10b981", // Emerald
	];

	const dispositionData = DISPOSITION_CHOICES.map(([value, label], index) => ({
		name: label, // Use label for display
		value: Math.floor(Math.random() * 30) + 5, // Random values for demo
		fill: chartColors[index % chartColors.length],
	}));

	const taskStatusData = [
		{
			name: "Pending",
			count: metrics.total_tasks - metrics.completed_tasks - 1,
			fill: "#f59e0b", // Amber
		},
		{ name: "In Progress", count: 1, fill: "#3b82f6" }, // Blue
		{ name: "Completed", count: metrics.completed_tasks, fill: "#22c55e" }, // Green
	];

	return (
		<div className="flex-1 space-y-8 p-6 lg:p-10">
			{/* Header */}
			<DashboardHeader />

			<DashboardWrapper
				userType={userType || "sales_ops"}
				initialMetrics={metrics}
				initialCampaignData={campaignData}
				initialDispositionData={dispositionData}
				initialTaskStatusData={taskStatusData}
				initialRecentAudits={recentAudits}
				initialRecentTasks={recentTasks}
			/>
		</div>
	);
}
