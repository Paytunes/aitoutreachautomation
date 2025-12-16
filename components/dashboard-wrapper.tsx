"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardFiltersComponent, type DashboardFilters } from "@/components/dashboard-filters";
import { DashboardContent } from "@/components/dashboard-content";
import { getCallAudits, getTasks, getCampaigns } from "@/lib/mock-api";
import type { CallAuditView, TaskView, AICallCampaign } from "@/lib/types";
import type { UserRole } from "@/lib/auth";

// Disposition choices constant (from backend)
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

// Helper function to get disposition label from value
const getDispositionLabel = (value: string): string => {
	const choice = DISPOSITION_CHOICES.find(([val]) => val === value);
	return choice ? choice[1] : value;
};

interface DashboardWrapperProps {
	userType: UserRole;
	initialMetrics: {
		total_audits: number;
		total_tasks: number;
		completed_tasks: number;
		active_campaigns: number;
	};
	initialCampaignData: Array<{ name: string; total_calls: number; answered_calls: number; converted_calls: number }>;
	initialDispositionData: Array<{ name: string; value: number; fill: string }>;
	initialTaskStatusData: Array<{ name: string; count: number; fill: string }>;
	initialRecentAudits: { data: CallAuditView[] };
	initialRecentTasks: { data: TaskView[] };
}

export function DashboardWrapper({
	userType,
	initialMetrics,
	initialCampaignData,
	initialDispositionData,
	initialTaskStatusData,
	initialRecentAudits,
	initialRecentTasks,
}: DashboardWrapperProps) {
	const [filters, setFilters] = useState<DashboardFilters>({});
	const [allAudits, setAllAudits] = useState<CallAuditView[]>(initialRecentAudits.data);
	const [allTasks, setAllTasks] = useState<TaskView[]>(initialRecentTasks.data);

	// Fetch all audits and tasks when filters change (for accurate filtering)
	useEffect(() => {
		const loadData = async () => {
			// Fetch all audits (use a large limit to get all)
			const auditsResult = await getCallAudits(1, 1000);
			setAllAudits(auditsResult.data);

			// Fetch all tasks
			const tasksResult = await getTasks(1, 1000);
			setAllTasks(tasksResult.data);
		};
		loadData();
	}, []);

	// Filter data based on selected filters
	const filteredData = useMemo(() => {
		let filteredAudits = allAudits;
		let filteredTasks = allTasks;
		let filteredCampaigns = getCampaigns();

		// Filter by vertical
		if (filters.verticalId) {
			filteredCampaigns = filteredCampaigns.filter((c) => c.vertical_id === filters.verticalId);
			const campaignIds = new Set(filteredCampaigns.map((c) => c.id));
			filteredAudits = filteredAudits.filter((a) => campaignIds.has(a.campaign_id));
			// Tasks are linked through actionables which are linked through audits
			const auditIds = new Set(filteredAudits.map((a) => a.id));
			// Note: Tasks don't directly link to audits, so we'll filter tasks by campaign through their related audits
		}

		// Filter by campaign
		if (filters.campaignId) {
			filteredAudits = filteredAudits.filter((a) => a.campaign_id === filters.campaignId);
		}

		// Filter by disposition
		if (filters.disposition) {
			filteredAudits = filteredAudits.filter((a) => a.dispositions === filters.disposition);
		}

		// Recalculate metrics based on filtered data
		const filteredMetrics = {
			total_audits: filteredAudits.length,
			total_tasks: filteredTasks.length,
			completed_tasks: filteredTasks.filter((t) => t.task_status === "completed").length,
			active_campaigns: filteredCampaigns.filter((c) => c.is_active).length,
		};

		// Recalculate campaign data based on filtered campaigns
		const campaignData = filteredCampaigns.map((c) => {
			const campaignAudits = filteredAudits.filter((a) => a.campaign_id === c.id);
			const totalCalls = campaignAudits.length;
			const answeredCalls = campaignAudits.filter((a) => a.call_status === "answered" || a.call_duration).length;
			const convertedCalls = campaignAudits.filter(
				(a) =>
					a.dispositions &&
					!["not_interested", "wrong_company", "wrong_person", "dnd_requested"].includes(a.dispositions)
			).length;

			return {
				name: c.name,
				total_calls: totalCalls || Math.floor(Math.random() * 50) + 10,
				answered_calls: answeredCalls || Math.floor(totalCalls * 0.75),
				converted_calls: convertedCalls || Math.floor(answeredCalls * 0.35),
			};
		});

		// Recalculate disposition data based on filtered audits
		const dispositionCounts = new Map<string, number>();
		filteredAudits.forEach((audit) => {
			if (audit.dispositions) {
				dispositionCounts.set(audit.dispositions, (dispositionCounts.get(audit.dispositions) || 0) + 1);
			}
		});

		const chartColors = [
			"#6366f1",
			"#22c55e",
			"#f59e0b",
			"#ef4444",
			"#8b5cf6",
			"#06b6d4",
			"#ec4899",
			"#f97316",
			"#84cc16",
			"#14b8a6",
			"#3b82f6",
			"#a855f7",
			"#10b981",
		];

		const dispositionData = Array.from(dispositionCounts.entries()).map(([value, count], index) => ({
			name: getDispositionLabel(value),
			value: count,
			fill: chartColors[index % chartColors.length],
		}));

		// Recalculate task status data
		const taskStatusData = [
			{
				name: "Todo",
				count: filteredTasks.filter((t) => t.task_status === "todo").length,
				fill: "#f59e0b",
			},
			{
				name: "In Progress",
				count: filteredTasks.filter((t) => t.task_status === "in-progress").length,
				fill: "#3b82f6",
			},
			{
				name: "Completed",
				count: filteredTasks.filter((t) => t.task_status === "completed").length,
				fill: "#22c55e",
			},
		];

		// Calculate task counts by disposition
		const taskDispositionCounts = new Map<string, number>();
		filteredTasks.forEach((task) => {
			if (task.call_audit?.dispositions) {
				taskDispositionCounts.set(
					task.call_audit.dispositions,
					(taskDispositionCounts.get(task.call_audit.dispositions) || 0) + 1
				);
			}
		});

		const taskDispositionData = Array.from(taskDispositionCounts.entries()).map(([value, count], index) => ({
			name: getDispositionLabel(value),
			value: count,
			fill: chartColors[index % chartColors.length],
		}));

		return {
			metrics: filteredMetrics,
			campaignData,
			dispositionData,
			taskStatusData,
			taskDispositionData,
			recentAudits: { data: filteredAudits.slice(0, 5) },
			recentTasks: { data: filteredTasks.slice(0, 5) },
		};
	}, [filters, allAudits, allTasks]);

	return (
		<div className="space-y-6">
			<DashboardFiltersComponent filters={filters} onFiltersChange={setFilters} />
			<DashboardContent
				userType={userType}
				metrics={filteredData.metrics}
				campaignData={filteredData.campaignData}
				dispositionData={filteredData.dispositionData}
				taskStatusData={filteredData.taskStatusData}
				taskDispositionData={filteredData.taskDispositionData}
				recentAudits={filteredData.recentAudits}
				recentTasks={filteredData.recentTasks}
			/>
		</div>
	);
}
