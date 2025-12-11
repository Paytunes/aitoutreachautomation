"use client";

import { useState, useEffect, useMemo } from "react";
import { DashboardCharts } from "@/components/dashboard-charts";
import { ConversionFunnelChart } from "@/components/conversion-funnel-chart";
import { ConversionFunnelBarChart } from "@/components/conversion-funnel-bar-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Users, Phone, Mail, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { useRole } from "@/lib/role-context";
import { getCallAudits } from "@/lib/mock-api";
import type { CallAuditView, TaskView } from "@/lib/types";
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
const getDispositionLabel = (value?: string): string => {
	if (!value) return "—";
	const choice = DISPOSITION_CHOICES.find(([val]) => val === value);
	return choice ? choice[1] : value;
};

interface DashboardContentProps {
	userType: UserRole;
	metrics: {
		total_audits: number;
		total_tasks: number;
		completed_tasks: number;
		active_campaigns: number;
	};
	campaignData: Array<{ name: string; total_calls: number; answered_calls: number; converted_calls: number }>;
	dispositionData: Array<{ name: string; value: number; fill: string }>;
	taskStatusData: Array<{ name: string; count: number; fill: string }>;
	recentAudits: { data: CallAuditView[] };
	recentTasks: { data: TaskView[] };
}

export function DashboardContent({
	userType: initialUserType,
	metrics,
	campaignData,
	dispositionData,
	taskStatusData,
	recentAudits,
	recentTasks,
}: DashboardContentProps) {
	// Use role from context (can be changed via dropdown), fallback to prop
	const { role: contextRole } = useRole();
	const userType = contextRole || initialUserType || "sales_ops";

	// Executive view - Analytics focused, no task/call audit details
	if (userType === "executive") {
		const [allAudits, setAllAudits] = useState<CallAuditView[]>([]);

		// Fetch all audits for high probability leads calculation
		useEffect(() => {
			const loadAudits = async () => {
				const result = await getCallAudits(1, 1000);
				setAllAudits(result.data);
			};
			loadAudits();
		}, []);

		// Calculate high probability leads based on interest level and disposition
		const highProbabilityLeads = useMemo(() => {
			// Negative dispositions to exclude
			const negativeDispositions = ["not_interested", "wrong_company", "wrong_person", "dnd_requested"];

			return allAudits
				.filter((audit) => {
					// Filter by high interest level (>= 7) and positive dispositions
					const hasHighInterest = (audit.interest_level || 0) >= 7;
					const hasPositiveDisposition =
						audit.dispositions &&
						!negativeDispositions.includes(audit.dispositions) &&
						audit.dispositions !== "NA";
					return hasHighInterest && hasPositiveDisposition;
				})
				.sort((a, b) => (b.interest_level || 0) - (a.interest_level || 0)) // Sort by interest level descending
				.slice(0, 10); // Top 10 only
		}, [allAudits]);

		// Executive metrics data - matching screenshot values
		const executiveMetrics = {
			totalLeadsIngested: 12450,
			aiContactRate: 34,
			actionablesFound: 1200,
			pipelineValue: 4.5,
		};

		// Conversion funnel data - matching screenshot values
		const funnelData = [
			{ stage: "Free Pool", leads: 12450 },
			{ stage: "AI Outreach", leads: 11200 },
			{ stage: "Connected", leads: 4800 },
			{ stage: "Actionable", leads: 1200 },
			{ stage: "Meeting Booked", leads: 450 },
			{ stage: "Closed Won", leads: 120 },
		];

		return (
			<>
				{/* Metrics Grid - Executive Dashboard */}
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
					<Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600">Total Leads Ingested</p>
									<p className="text-4xl font-bold text-gray-900 mt-2">
										{executiveMetrics.totalLeadsIngested.toLocaleString()}
									</p>
									<p className="text-xs mt-2 font-medium text-green-600">+12.5% from last month</p>
								</div>
								<div className="text-gray-400 flex-shrink-0 mt-1">
									<Users size={20} />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600">AI Contact Rate</p>
									<p className="text-4xl font-bold text-gray-900 mt-2">
										{executiveMetrics.aiContactRate}%
									</p>
									<p className="text-xs mt-2 font-medium text-green-600">+3.2% from last month</p>
								</div>
								<div className="text-gray-400 flex-shrink-0 mt-1">
									<Phone size={20} />
								</div>
							</div>
						</CardContent>
					</Card>

					<Card className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-sm font-medium text-gray-600">Actionables Found</p>
									<p className="text-4xl font-bold text-gray-900 mt-2">
										{executiveMetrics.actionablesFound.toLocaleString()}
									</p>
									<p className="text-xs mt-2 font-medium text-red-600">-2.1% from last month</p>
								</div>
								<div className="text-gray-400 flex-shrink-0 mt-1">
									<Mail size={20} />
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Conversion Funnel Bar Chart */}
				<ConversionFunnelBarChart data={funnelData} />

				{/* High Probability Leads Section */}
				<Card className="bg-white border border-gray-200">
					<CardHeader>
						<CardTitle className="text-gray-900">High Probability Leads</CardTitle>
						<p className="text-sm text-gray-600 mt-1">Top prospects requiring immediate attention</p>
					</CardHeader>
					<CardContent>
						{highProbabilityLeads.length === 0 ? (
							<div className="text-center py-12 text-gray-500">
								<p className="text-sm">No high probability leads at this time</p>
							</div>
						) : (
							<div className="overflow-x-auto">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="text-gray-700">Lead Name</TableHead>
											<TableHead className="text-gray-700">Campaign</TableHead>
											<TableHead className="text-gray-700">Interest Level</TableHead>
											<TableHead className="text-gray-700">Disposition</TableHead>
											<TableHead className="text-gray-700">Phone</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{highProbabilityLeads.map((audit) => (
											<TableRow key={audit.id} className="hover:bg-gray-50">
												<TableCell className="font-medium text-gray-900">
													<Link
														href={`/call-audits/${audit.id}`}
														className="text-blue-600 hover:underline"
													>
														{audit.lead.name}
													</Link>
												</TableCell>
												<TableCell className="text-sm text-gray-600">
													{audit.campaign.name}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<div className="w-16 bg-gray-200 rounded-full h-1.5">
															<div
																className="bg-blue-600 rounded-full h-1.5"
																style={{
																	width: `${
																		((audit.interest_level || 0) / 10) * 100
																	}%`,
																}}
															/>
														</div>
														<span className="text-xs font-medium text-gray-700">
															{audit.interest_level || 0}/10
														</span>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className="bg-green-50 text-green-700 border-green-200"
													>
														{getDispositionLabel(audit.dispositions)}
													</Badge>
												</TableCell>
												<TableCell className="text-sm font-mono text-gray-600">
													{audit.phone_number}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						)}
					</CardContent>
				</Card>
			</>
		);
	}

	// Sales Ops view - Full dashboard with call audits and tasks
	// Calculate percentage changes (mock data - in production, this would come from API)
	const calculatePercentageChange = (current: number, baseChange: number) => {
		const previous = current / (1 + baseChange / 100);
		return baseChange;
	};

	const metricsWithChanges = {
		totalAuditsChange: calculatePercentageChange(metrics.total_audits, 8.5),
		totalTasksChange: calculatePercentageChange(metrics.total_tasks, 12.3),
		completedTasksChange: calculatePercentageChange(metrics.completed_tasks, 15.7),
		activeCampaignsChange: calculatePercentageChange(metrics.active_campaigns, -3.2),
	};

	return (
		<>
			{/* Metrics Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm font-medium text-muted-foreground">Total Call Audits</p>
								<p className="text-3xl font-bold text-foreground mt-2">{metrics.total_audits}</p>
								<p
									className={`text-xs mt-2 font-medium ${
										metricsWithChanges.totalAuditsChange >= 0 ? "text-green-600" : "text-red-600"
									}`}
								>
									{metricsWithChanges.totalAuditsChange >= 0 ? (
										<TrendingUp className="inline w-3 h-3 mr-1" />
									) : (
										<TrendingDown className="inline w-3 h-3 mr-1" />
									)}
									{Math.abs(metricsWithChanges.totalAuditsChange).toFixed(1)}% from last month
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
								<p className="text-3xl font-bold text-foreground mt-2">{metrics.total_tasks}</p>
								<p
									className={`text-xs mt-2 font-medium ${
										metricsWithChanges.totalTasksChange >= 0 ? "text-green-600" : "text-red-600"
									}`}
								>
									{metricsWithChanges.totalTasksChange >= 0 ? (
										<TrendingUp className="inline w-3 h-3 mr-1" />
									) : (
										<TrendingDown className="inline w-3 h-3 mr-1" />
									)}
									{Math.abs(metricsWithChanges.totalTasksChange).toFixed(1)}% from last month
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
								<p className="text-3xl font-bold text-foreground mt-2">{metrics.completed_tasks}</p>
								<p
									className={`text-xs mt-2 font-medium ${
										metricsWithChanges.completedTasksChange >= 0 ? "text-green-600" : "text-red-600"
									}`}
								>
									{metricsWithChanges.completedTasksChange >= 0 ? (
										<TrendingUp className="inline w-3 h-3 mr-1" />
									) : (
										<TrendingDown className="inline w-3 h-3 mr-1" />
									)}
									{Math.abs(metricsWithChanges.completedTasksChange).toFixed(1)}% from last month
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm font-medium text-muted-foreground">Active Campaigns</p>
								<p className="text-3xl font-bold text-foreground mt-2">{metrics.active_campaigns}</p>
								<p
									className={`text-xs mt-2 font-medium ${
										metricsWithChanges.activeCampaignsChange >= 0
											? "text-green-600"
											: "text-red-600"
									}`}
								>
									{metricsWithChanges.activeCampaignsChange >= 0 ? (
										<TrendingUp className="inline w-3 h-3 mr-1" />
									) : (
										<TrendingDown className="inline w-3 h-3 mr-1" />
									)}
									{Math.abs(metricsWithChanges.activeCampaignsChange).toFixed(1)}% from last month
								</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Charts */}
			<DashboardCharts
				campaignData={campaignData}
				dispositionData={dispositionData}
				taskStatusData={taskStatusData}
			/>

			{/* Recent Audits and Tasks */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Recent Call Audits */}
				<Card className="bg-card border-border">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-foreground">Recent Call Audits</CardTitle>
							<Link href="/call-audits" className="text-sm text-primary hover:underline">
								View all
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Lead</TableHead>
										<TableHead>Disposition</TableHead>
										<TableHead>Duration</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentAudits.data.map((audit) => (
										<TableRow key={audit.id} className="hover:bg-muted/50 cursor-pointer">
											<TableCell className="font-medium">
												<Link
													href={`/call-audits/${audit.id}`}
													className="text-primary hover:underline"
												>
													{audit.lead.name}
												</Link>
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className="bg-primary/10 text-primary border-primary/30"
												>
													{getDispositionLabel(audit.dispositions)}
												</Badge>
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{audit.call_duration}s
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>

				{/* Recent Tasks */}
				<Card className="bg-card border-border">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-foreground">Recent Tasks</CardTitle>
							<Link href="/tasks" className="text-sm text-primary hover:underline">
								View all
							</Link>
						</div>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>Action</TableHead>
										<TableHead>Status</TableHead>
										<TableHead>Assigned</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{recentTasks.data.map((task) => (
										<TableRow key={task.id} className="hover:bg-muted/50 cursor-pointer">
											<TableCell className="font-medium">
												<Link
													href={`/tasks/${task.id}`}
													className="text-primary hover:underline"
												>
													{task.actionable.name}
												</Link>
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={
														task.task_status === "completed"
															? "bg-green-500/10 text-green-700 border-green-500/30"
															: task.task_status === "in-progress"
															? "bg-blue-500/10 text-blue-700 border-blue-500/30"
															: "bg-yellow-500/10 text-yellow-700 border-yellow-500/30"
													}
												>
													{task.task_status}
												</Badge>
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">
												{task.employee.name}
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</div>
					</CardContent>
				</Card>
			</div>
		</>
	);
}
