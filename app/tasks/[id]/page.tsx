import {
	getTaskById,
	getTasksByLeadId,
	getActionables,
	getCallAuditById,
	getUnifiedItemById,
	getRecommendedActionables,
	DISPOSITION_CHOICES,
} from "@/lib/mock-api";
import { RelatedTasks } from "@/components/related-tasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
	ArrowLeft,
	Clock,
	User,
	CheckCircle2,
	Circle,
	AlertCircle,
	Mail,
	Phone,
	Briefcase,
	MapPin,
	Tag,
	Building2,
	Calendar,
	XCircle,
} from "lucide-react";
import { ActionablesSection } from "@/components/actionables-section";
import { AudioPlayer } from "@/components/audio-player";
import { DispositionSelector } from "@/components/disposition-selector";
import { TaskNavigation } from "@/components/task-navigation";
import { MarkCompleteButton } from "@/components/mark-complete-button";
import { TaskNotesEditor } from "@/components/task-notes-editor";
import { CallAuditNotesEditor } from "@/components/call-audit-notes-editor";
import { CollapsibleAudioPlayer } from "@/components/collapsible-audio-player";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;

	// In real app, this would come from auth context/token
	// For now, using mock user ID - in production, get from token
	const currentUserId = "1"; // Mock current user ID

	// Check if ID is a call audit or a task using unified API
	const unifiedItem = await getUnifiedItemById(id);

	if (!unifiedItem) {
		return (
			<div className="flex-1 space-y-6 p-6 lg:p-10">
				<Button asChild variant="ghost" className="text-foreground hover:bg-muted">
					<Link href="/tasks">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Tasks
					</Link>
				</Button>
				<div className="flex items-center justify-center h-96">
					<p className="text-muted-foreground text-lg">Item not found</p>
				</div>
			</div>
		);
	}

	// If it's a call audit, render call audit detail view
	if (unifiedItem.type === "call_audit" && unifiedItem.call_audit) {
		const audit = unifiedItem.call_audit;

		// Get all actionables
		const allActionables = getActionables();
		// Get recommended actionables based on call audit properties
		const recommendedActionableIds = getRecommendedActionables(audit);

		// Find the matching disposition value from choices
		const defaultDisposition = audit.dispositions
			? DISPOSITION_CHOICES.find(([value]) => value === audit.dispositions)?.[0] ||
			  DISPOSITION_CHOICES.find(([, label]) => label === audit.dispositions)?.[0]
			: undefined;

		// Format date
		const formatDate = (dateString: string) => {
			const date = new Date(dateString);
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		};

		// Format solution name for display
		const formatSolutionName = (solution?: string) => {
			if (!solution) return "—";
			return solution
				.split("_")
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(" ");
		};

		return (
			<div className="flex-1 p-6 overflow-auto h-full">
				{/* Navigation and Mark Complete Button */}
				<div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
					<TaskNavigation currentId={id} currentUserId={currentUserId} />
					<MarkCompleteButton currentId={id} currentUserId={currentUserId} />
				</div>

				{/* Main Content: Two Equal Columns */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Left Column */}
					<div className="space-y-5">
						{/* Call Recording */}
						<Card className="bg-card border-border">
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
								<CardTitle className="text-foreground text-base">Call Recording</CardTitle>
								<div className="flex items-center gap-2">
									<DispositionSelector
										defaultDisposition={defaultDisposition}
										dispositionChoices={
											DISPOSITION_CHOICES.map((d) => [d[0], d[1]]) as [string, string][]
										}
										auditId={audit.id}
										compact={true}
									/>
								</div>
							</CardHeader>
							<CardContent className="pt-0">
								<AudioPlayer duration={audit.call_duration || 202} src={audit.call_url} />
								{audit.call_summary && (
									<div className="mt-4 rounded-lg border-2 border-primary/20 bg-primary/5 p-4 max-h-60 overflow-y-auto">
										<p className="text-sm font-bold text-foreground mb-2">Call Summary</p>
										<p className="text-sm text-foreground leading-relaxed whitespace-pre-line">
											{audit.call_summary}
										</p>
									</div>
								)}
							</CardContent>
						</Card>
						{/* Lead Information - Compact */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-2">
								<CardTitle className="text-foreground text-sm">Lead Information</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-3">
									{/* Personal Information */}
									<div>
										<p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
											Personal Information
										</p>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
											<div className="flex items-start gap-2">
												<User className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Lead Name</p>
													<p className="text-xs font-medium text-foreground truncate">
														{audit.lead.name}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-2">
												<Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Phone</p>
													<p className="text-xs font-medium text-foreground font-mono truncate">
														{audit.phone_number}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-2">
												<Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Personal Email</p>
													<p className="text-xs font-medium text-foreground truncate">
														{audit.lead.personal_email || "—"}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-2">
												<Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Work Email</p>
													<p className="text-xs font-medium text-foreground truncate">
														{audit.lead.secondary_email || "—"}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-2">
												<Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Group Work Email</p>
													<p className="text-xs font-medium text-foreground truncate">
														{audit.lead.group_email || "—"}
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Company Information */}
									{(audit.lead.company ||
										audit.lead.company_type ||
										audit.lead.company_zone ||
										audit.campaign.solution ||
										audit.lead.company_solution ||
										audit.lead.company_nickname ||
										audit.is_company_name_wrong !== undefined) && (
										<div>
											<p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
												Company Information
											</p>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
												{audit.lead.company && (
													<div className="flex items-start gap-2">
														<Building2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0 flex-1">
															<p className="text-xs text-muted-foreground">Company</p>
															<p className="text-xs font-medium text-foreground truncate">
																{audit.lead.company}
															</p>
														</div>
													</div>
												)}
												{audit.lead.company_type && (
													<div className="flex items-start gap-2">
														<Briefcase className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0">
															<p className="text-xs text-muted-foreground">Type</p>
															<p className="text-xs font-medium text-foreground truncate">
																{audit.lead.company_type}
															</p>
														</div>
													</div>
												)}
												{audit.lead.company_zone && (
													<div className="flex items-start gap-2">
														<MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0">
															<p className="text-xs text-muted-foreground">Zone</p>
															<p className="text-xs font-medium text-foreground truncate">
																{audit.lead.company_zone}
															</p>
														</div>
													</div>
												)}
												{audit.campaign.solution && (
													<div className="flex items-start gap-2">
														<Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0">
															<p className="text-xs text-muted-foreground">
																Call Solution
															</p>
															<p className="text-xs font-medium text-foreground truncate">
																{formatSolutionName(audit.campaign.solution)}
															</p>
														</div>
													</div>
												)}
												{audit.lead.company_solution && (
													<div className="flex items-start gap-2 col-span-2 md:col-span-3">
														<Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0 flex-1">
															<p className="text-xs text-muted-foreground">
																Suggested Solution
															</p>
															<div className="flex flex-wrap gap-1 mt-0.5">
																{audit.lead.company_solution
																	.split(",")
																	.map((solution, idx, arr) => (
																		<span
																			key={idx}
																			className="text-xs font-medium text-foreground"
																		>
																			{formatSolutionName(solution.trim())}
																			{idx < arr.length - 1 && (
																				<span className="text-muted-foreground mx-0.5">
																					,
																				</span>
																			)}
																		</span>
																	))}
															</div>
														</div>
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column */}
					<div className="space-y-5">
						<Card className="bg-card border-2 border-primary/20 shadow-lg">
							<CardHeader className="pb-4">
								<CardTitle className="text-foreground text-lg font-bold">Actionable Items</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<ActionablesSection
									actionables={allActionables}
									auditId={audit.id}
									leadName={audit.lead.name}
									recommendedActionableIds={recommendedActionableIds}
									currentUserId={currentUserId}
								/>
							</CardContent>
						</Card>

						{/* Call Details */}
						<Card className="bg-card border-border">
							<CardHeader className="pb-4">
								<CardTitle className="text-foreground text-base">Call Details</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="grid grid-cols-2 gap-4">
									<div className="flex items-center gap-3">
										{audit.rpc_verified ? (
											<CheckCircle2 className="w-5 h-5 text-green-600" />
										) : (
											<XCircle className="w-5 h-5 text-red-600" />
										)}
										<div>
											<p className="text-sm text-muted-foreground">RPC Verified</p>
											<p className="text-sm font-medium text-foreground">
												{audit.rpc_verified ? "Verified" : "Not Verified"}
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3">
										<Tag className="w-5 h-5 text-muted-foreground" />
										<div className="flex flex-col gap-1">
											<p className="text-sm text-muted-foreground">Interest</p>
											<div className="flex items-center gap-2">
												<div className="w-20 bg-muted rounded h-2">
													<div
														className="bg-primary rounded h-2"
														style={{
															width: `${((audit.interest_level || 0) / 10) * 100}%`,
														}}
													/>
												</div>
												<span className="text-sm font-medium text-foreground">
													{audit.interest_level || 0}/10
												</span>
											</div>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Notes Editor */}
						<CallAuditNotesEditor auditId={audit.id} initialNotes={audit.notes || ""} />
					</div>
				</div>
			</div>
		);
	}

	// If it's a task, render task view (don't redirect even if it has call_audit_id)
	const task = unifiedItem.task;
	if (!task) {
		return (
			<div className="flex-1 space-y-6 p-6 lg:p-10">
				<Button asChild variant="ghost" className="text-foreground hover:bg-muted">
					<Link href="/tasks">
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Tasks
					</Link>
				</Button>
				<div className="flex items-center justify-center h-96">
					<p className="text-muted-foreground text-lg">Task not found</p>
				</div>
			</div>
		);
	}

	// Get related tasks for the same lead (if applicable)
	const relatedTasks = task?.call_audit?.lead?.id ? await getTasksByLeadId(task.call_audit.lead.id, id) : [];

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-500/10 text-green-700 border-green-500/30";
			case "todo":
				return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30";
			default:
				return "bg-gray-500/10 text-gray-700 border-gray-500/30";
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckCircle2 className="w-5 h-5 text-green-600" />;
			case "todo":
				return <Circle className="w-5 h-5 text-yellow-600" />;
			default:
				return <Circle className="w-5 h-5 text-gray-600" />;
		}
	};

	// COMMENTED OUT: Task type determination logic - not needed for simplified manual task view
	// const getTaskType = (actionableName: string): string => {
	// 	const name = actionableName.toLowerCase();
	// 	if (name.includes("meeting") || name.includes("invite")) {
	// 		return "meeting-invite";
	// 	}
	// 	if (name.includes("case study") || name.includes("deck") || name.includes("document")) {
	// 		return "case-studies-deck";
	// 	}
	// 	if (name.includes("callback") || name.includes("call back") || name.includes("follow-up call")) {
	// 		return "callback";
	// 	}
	// 	if (name.includes("crm") || name.includes("update lead") || name.includes("lead data")) {
	// 		return "crm-update";
	// 	}
	// 	if (name.includes("whatsapp") || name.includes("whats app") || name.includes("text")) {
	// 		return "whatsapp";
	// 	}
	// 	return "default";
	// };

	// COMMENTED OUT: Task type specific rendering - using simple view instead
	// const taskType = getTaskType(task.actionable.name);
	// const hasCallAudio = Boolean(task.call_audit?.call_url);
	// const lead = task.call_audit?.lead;

	const formatTaskStatus = (status: string): string => {
		if (!status) return "";
		// Handle common statuses
		if (status === "todo") return "Todo";
		if (status === "completed") return "Completed";
		// For other statuses with hyphens or underscores
		return status
			.split(/[-_]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
	};

	// Format disposition to Title Case
	const formatDisposition = (disposition?: string): string => {
		if (!disposition) return "—";
		// Handle special case
		if (disposition === "NA") return "NA";
		// Convert snake_case to Title Case
		return disposition
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
	};

	const formatDate = (dateString?: string) => {
		if (!dateString) return "—";
		return new Date(dateString).toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	// Format solution name for display
	const formatSolutionName = (solution?: string) => {
		if (!solution) return "—";
		return solution
			.split("_")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	// Manual task view - simple screen without actionables
	return (
		<div className="flex-1 p-6 lg:p-10 space-y-6">
			{/* Navigation, Status, and Mark Complete Button */}
			<div className="flex items-center justify-between gap-4 flex-wrap">
				<div className="flex items-center gap-4">
					<TaskNavigation currentId={id} currentUserId={currentUserId} />
					<Badge variant="outline" className={getStatusColor(task.task_status)}>
						{formatTaskStatus(task.task_status)}
					</Badge>
				</div>
				<MarkCompleteButton currentId={id} currentUserId={currentUserId} />
			</div>

			{/* Main Content: Two Equal Columns */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Left Column */}
				<div className="space-y-5">
					{/* Task Details */}
					<Card className="bg-card border-border">
						<CardHeader className="pb-3">
							<CardTitle className="text-foreground text-base">Task Details</CardTitle>
						</CardHeader>
						<CardContent className="pt-0 space-y-4">
							<div className="flex flex-wrap gap-2">
								<Badge variant="outline" className="bg-muted/50 text-foreground border-border">
									Task ID: {task.id}
								</Badge>
								<Badge variant="outline" className="bg-muted/50 text-foreground border-border">
									Status: {formatTaskStatus(task.task_status)}
								</Badge>
								<Badge variant="outline" className="bg-muted/50 text-foreground border-border">
									Created: {formatDate(task.created_at)}
								</Badge>
								<Badge variant="outline" className="bg-muted/50 text-foreground border-border">
									Updated: {formatDate(task.updated_at)}
								</Badge>
							</div>

							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex items-start gap-3">
									<Briefcase className="w-5 h-5 text-primary mt-0.5" />
									<div>
										<p className="text-xs text-muted-foreground">Actionable</p>
										<p className="text-base font-medium text-foreground">{task.actionable.name}</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<User className="w-5 h-5 text-primary mt-0.5" />
									<div>
										<p className="text-xs text-muted-foreground">Assigned To</p>
										<p className="text-base font-medium text-foreground">{task.employee.name}</p>
										<p className="text-sm text-muted-foreground">{task.employee.email}</p>
									</div>
								</div>
							</div>

							{task.description && (
								<div className="border-t border-border pt-4">
									<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
										Description
									</p>
									<div className="p-4 rounded-md bg-muted/50 border border-border">
										<p className="text-foreground leading-relaxed">{task.description}</p>
									</div>
								</div>
							)}
						</CardContent>
					</Card>

					{/* Call Recording - Collapsible */}
					{task.call_audit?.call_url && (
						<CollapsibleAudioPlayer
							audioUrl={task.call_audit.call_url}
							duration={task.call_audit.call_duration || 202}
							callSummary={task.call_audit.call_summary}
						/>
					)}

					{/* Notes Editor */}
					<TaskNotesEditor taskId={task.id} initialNotes={task.notes || ""} />
				</div>

				{/* Right Column */}
				<div className="space-y-5">
					{/* Lead Information - Compact */}
					{task.call_audit && (
						<Card className="bg-card border-border">
							<CardHeader className="pb-2">
								<CardTitle className="text-foreground text-sm">Lead Information</CardTitle>
							</CardHeader>
							<CardContent className="pt-0">
								<div className="space-y-3">
									{/* Personal Information */}
									<div>
										<p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
											Personal Information
										</p>
										<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
											<div className="flex items-start gap-2">
												<User className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Lead Name</p>
													<p className="text-xs font-medium text-foreground truncate">
														{task.call_audit.lead.name}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-2">
												<Phone className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Phone</p>
													<p className="text-xs font-medium text-foreground font-mono truncate">
														{task.call_audit.phone_number}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-2">
												<Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Personal Email</p>
													<p className="text-xs font-medium text-foreground truncate">
														{task.call_audit.lead.personal_email || "—"}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-2">
												<Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Work Email</p>
													<p className="text-xs font-medium text-foreground truncate">
														{task.call_audit.lead.secondary_email || "—"}
													</p>
												</div>
											</div>
											<div className="flex items-start gap-2">
												<Mail className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
												<div className="min-w-0">
													<p className="text-xs text-muted-foreground">Group Work Email</p>
													<p className="text-xs font-medium text-foreground truncate">
														{task.call_audit.lead.group_email || "—"}
													</p>
												</div>
											</div>
										</div>
									</div>

									{/* Company Information */}
									{(task.call_audit.lead.company ||
										task.call_audit.lead.company_type ||
										task.call_audit.lead.company_zone ||
										task.call_audit.campaign.solution ||
										task.call_audit.lead.company_solution ||
										task.call_audit.lead.company_nickname ||
										task.call_audit.is_company_name_wrong !== undefined) && (
										<div>
											<p className="text-xs font-semibold text-muted-foreground mb-1.5 uppercase tracking-wide">
												Company Information
											</p>
											<div className="grid grid-cols-2 md:grid-cols-3 gap-2">
												{task.call_audit.lead.company && (
													<div className="flex items-start gap-2">
														<Building2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0 flex-1">
															<p className="text-xs text-muted-foreground">Company</p>
															<p className="text-xs font-medium text-foreground truncate">
																{task.call_audit.lead.company}
															</p>
														</div>
													</div>
												)}
												{task.call_audit.lead.company_type && (
													<div className="flex items-start gap-2">
														<Briefcase className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0">
															<p className="text-xs text-muted-foreground">Type</p>
															<p className="text-xs font-medium text-foreground truncate">
																{task.call_audit.lead.company_type}
															</p>
														</div>
													</div>
												)}
												{task.call_audit.lead.company_zone && (
													<div className="flex items-start gap-2">
														<MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0">
															<p className="text-xs text-muted-foreground">Zone</p>
															<p className="text-xs font-medium text-foreground truncate">
																{task.call_audit.lead.company_zone}
															</p>
														</div>
													</div>
												)}
												{task.call_audit.campaign.solution && (
													<div className="flex items-start gap-2">
														<Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0">
															<p className="text-xs text-muted-foreground">
																Call Solution
															</p>
															<p className="text-xs font-medium text-foreground truncate">
																{formatSolutionName(task.call_audit.campaign.solution)}
															</p>
														</div>
													</div>
												)}
												{task.call_audit.lead.company_solution && (
													<div className="flex items-start gap-2">
														<Tag className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0">
															<p className="text-xs text-muted-foreground">
																Suggested Solution
															</p>
															<p className="text-xs font-medium text-foreground">
																{(task.call_audit.lead.company_solution || "")
																	.split(",")
																	.map((s) => s.trim())
																	.filter(Boolean)
																	.map((solution) => formatSolutionName(solution))
																	.join(", ")}
															</p>
														</div>
													</div>
												)}
												{task.call_audit.lead.company_nickname && (
													<div className="flex items-start gap-2">
														<Building2 className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
														<div className="min-w-0">
															<p className="text-xs text-muted-foreground">Nickname</p>
															<p className="text-xs font-medium text-foreground truncate">
																{task.call_audit.lead.company_nickname}
															</p>
														</div>
													</div>
												)}
												{task.call_audit.is_company_name_wrong !== undefined && (
													<div className="flex items-start gap-2">
														{task.call_audit.is_company_name_wrong ? (
															<AlertCircle className="w-3.5 h-3.5 text-red-600 mt-0.5 flex-shrink-0" />
														) : (
															<CheckCircle2 className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
														)}
														<div className="min-w-0">
															<p className="text-xs text-muted-foreground">
																Company Name
															</p>
															<p className="text-xs font-medium text-foreground">
																{task.call_audit.is_company_name_wrong
																	? "Wrong"
																	: "Correct"}
															</p>
														</div>
													</div>
												)}
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>
					)}

					{/* Related Tasks */}
					{relatedTasks.length > 0 && <RelatedTasks tasks={relatedTasks} currentTaskId={task.id} />}
				</div>
			</div>
		</div>
	);
}
