import { getTaskById, getTasksByLeadId } from "@/lib/mock-api";
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
} from "lucide-react";
import { AudioPlayer } from "@/components/audio-player";
import { TaskActions } from "@/components/task-actions";
import { MeetingInviteView } from "@/components/task-views/meeting-invite-view";
import { CaseStudiesDeckView } from "@/components/task-views/case-studies-deck-view";
import { CallbackView } from "@/components/task-views/callback-view";
import { CrmUpdateView } from "@/components/task-views/crm-update-view";
import { WhatsAppView } from "@/components/task-views/whatsapp-view";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params;
	const task = await getTaskById(id);

	// Get related tasks for the same lead
	const relatedTasks = task?.call_audit?.lead?.id ? await getTasksByLeadId(task.call_audit.lead.id, id) : [];

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

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-500/10 text-green-700 border-green-500/30";
			case "in-progress":
				return "bg-blue-500/10 text-blue-700 border-blue-500/30";
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
			case "in-progress":
				return <Clock className="w-5 h-5 text-blue-600" />;
			case "todo":
				return <Circle className="w-5 h-5 text-yellow-600" />;
			default:
				return <Circle className="w-5 h-5 text-gray-600" />;
		}
	};

	// Determine task type based on actionable name
	const getTaskType = (actionableName: string): string => {
		const name = actionableName.toLowerCase();
		if (name.includes("meeting") || name.includes("invite")) {
			return "meeting-invite";
		}
		if (name.includes("case study") || name.includes("deck") || name.includes("document")) {
			return "case-studies-deck";
		}
		if (name.includes("callback") || name.includes("call back") || name.includes("follow-up call")) {
			return "callback";
		}
		if (name.includes("crm") || name.includes("update lead") || name.includes("lead data")) {
			return "crm-update";
		}
		if (name.includes("whatsapp") || name.includes("whats app") || name.includes("text")) {
			return "whatsapp";
		}
		return "default";
	};

	const taskType = getTaskType(task.actionable.name);

	const hasCallAudio = Boolean(task.call_audit?.call_url);
	const lead = task.call_audit?.lead;

	const formatSolutionName = (solution?: string) => {
		if (!solution) return "";
		return solution.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
	};

	const formatTaskStatus = (status: string): string => {
		return status
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
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

	const renderTaskView = () => {
		switch (taskType) {
			case "meeting-invite":
				return <MeetingInviteView task={task} />;
			case "case-studies-deck":
				return <CaseStudiesDeckView task={task} />;
			case "callback":
				return <CallbackView task={task} />;
			case "crm-update":
				return <CrmUpdateView task={task} />;
			case "whatsapp":
				return <WhatsAppView task={task} />;
			default:
				return (
					<Card className="bg-card border-border">
						<CardHeader>
							<CardTitle className="text-foreground">Task Details</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="p-4 rounded-md bg-muted/50 border border-border">
								<p className="text-foreground leading-relaxed">
									{task.description || "No additional details available for this task."}
								</p>
							</div>
						</CardContent>
					</Card>
				);
		}
	};

	return (
		<div className="flex-1 p-4 lg:p-6 space-y-4">
			{/* Header with back button */}
			<div className="flex items-start justify-between">
				<div className="space-y-1">
					<Button asChild variant="ghost" className="text-foreground hover:bg-muted mb-2">
						<Link href="/tasks">
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Tasks
						</Link>
					</Button>
				</div>
				<Badge variant="outline" className={getStatusColor(task.task_status)}>
					{task.task_status}
				</Badge>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
				{/* Lead Information */}
				{lead && (
					<Card className="bg-card border-border">
						<CardHeader className="pb-3">
							<CardTitle className="text-foreground text-base">Lead Information</CardTitle>
						</CardHeader>
						<CardContent className="pt-0 space-y-5">
							<div>
								<p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
									Personal Information
								</p>
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="flex items-start gap-3">
										<User className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Lead Name</p>
											<Link
												href={`/crm/leads/${lead.id}`}
												className="text-base font-medium text-foreground hover:text-primary transition-colors underline"
											>
												{lead.name}
											</Link>
										</div>
									</div>
									{lead.job_title && (
										<div className="flex items-start gap-3">
											<Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
											<div>
												<p className="text-sm text-muted-foreground">Job Title</p>
												<p className="text-base font-medium text-foreground">
													{lead.job_title}
												</p>
											</div>
										</div>
									)}
									<div className="flex items-start gap-3">
										<Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Phone</p>
											<p className="text-base font-medium text-foreground font-mono">
												{lead.phone || task.call_audit?.phone_number || "—"}
											</p>
										</div>
									</div>
									<div className="flex items-start gap-3">
										<Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
										<div>
											<p className="text-sm text-muted-foreground">Email</p>
											<p className="text-base font-medium text-foreground">{lead.email || "—"}</p>
										</div>
									</div>
									{task.call_audit?.created_at && (
										<div className="flex items-start gap-3">
											<Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
											<div>
												<p className="text-sm text-muted-foreground">Call Date</p>
												<p className="text-base font-medium text-foreground">
													{formatDate(task.call_audit?.created_at)}
												</p>
											</div>
										</div>
									)}
								</div>
							</div>

							{(lead.company ||
								lead.company_type ||
								lead.company_zone ||
								lead.company_solution ||
								lead.company_nickname ||
								task.call_audit?.is_company_name_wrong !== undefined) && (
								<div>
									<p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">
										Company Information
									</p>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										{lead.company && (
											<div className="flex items-start gap-3">
												<Building2 className="w-5 h-5 text-muted-foreground mt-0.5" />
												<div className="flex-1">
													<p className="text-sm text-muted-foreground">Company Name</p>
													<p className="text-base font-medium text-foreground">
														{lead.company}
													</p>
												</div>
											</div>
										)}
										{task.call_audit?.is_company_name_wrong !== undefined && (
											<div className="flex items-start gap-3">
												<AlertCircle className="w-5 h-5 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-sm text-muted-foreground">
														Is Company Name Wrong
													</p>
													<p className="text-base font-medium text-foreground">
														{task.call_audit.is_company_name_wrong ? "Yes" : "No"}
													</p>
												</div>
											</div>
										)}
										{lead.company_type && (
											<div className="flex items-start gap-3">
												<Briefcase className="w-5 h-5 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-sm text-muted-foreground">Type</p>
													<p className="text-base font-medium text-foreground">
														{lead.company_type}
													</p>
												</div>
											</div>
										)}
										{lead.company_zone && (
											<div className="flex items-start gap-3">
												<MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-sm text-muted-foreground">Zone</p>
													<p className="text-base font-medium text-foreground">
														{lead.company_zone}
													</p>
												</div>
											</div>
										)}
										{lead.company_solution && (
											<div className="flex items-start gap-3">
												<Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-sm text-muted-foreground">Solution</p>
													<p className="text-base font-medium text-foreground">
														{formatSolutionName(lead.company_solution)}
													</p>
												</div>
											</div>
										)}
										{lead.company_nickname && (
											<div className="flex items-start gap-3">
												<Tag className="w-5 h-5 text-muted-foreground mt-0.5" />
												<div>
													<p className="text-sm text-muted-foreground">Nickname</p>
													<p className="text-base font-medium text-foreground">
														{lead.company_nickname}
													</p>
												</div>
											</div>
										)}
									</div>
								</div>
							)}
						</CardContent>
					</Card>
				)}

				{/* Task Overview (merged Task Information + Summary) */}
				<Card className="bg-card border-border">
					<CardHeader className="pb-3">
						<CardTitle className="text-foreground text-base">Task Overview</CardTitle>
					</CardHeader>
					<CardContent className="pt-0 space-y-4">
						<div className="flex flex-wrap gap-2">
							<Badge variant="outline" className="bg-muted/50 text-foreground border-border">
								Task ID: {task.id}
							</Badge>
							<Badge variant="outline" className="bg-muted/50 text-foreground border-border">
								Priority: Normal
							</Badge>
							<Badge variant="outline" className="bg-muted/50 text-foreground border-border">
								Status: {formatTaskStatus(task.task_status)}
							</Badge>
							<Badge variant="outline" className="bg-muted/50 text-foreground border-border">
								Created:{" "}
								{new Date(task.created_at).toLocaleDateString(undefined, {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</Badge>
							<Badge variant="outline" className="bg-muted/50 text-foreground border-border">
								Updated:{" "}
								{new Date(task.updated_at).toLocaleDateString(undefined, {
									year: "numeric",
									month: "short",
									day: "numeric",
								})}
							</Badge>
						</div>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div className="flex items-start gap-3">
								<User className="w-5 h-5 text-primary mt-0.5" />
								<div>
									<p className="text-xs text-muted-foreground">Assigned To</p>
									<p className="text-base font-medium text-foreground">{task.employee.name}</p>
									<p className="text-sm text-muted-foreground">{task.employee.email}</p>
								</div>
							</div>
						</div>

						{hasCallAudio && (
							<div className="border-t border-border pt-4 space-y-3">
								<p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
									Call Audio
								</p>
								<AudioPlayer
									duration={task.call_audit?.call_duration || 0}
									src={task.call_audit?.call_url}
								/>
								<div className="text-xs text-muted-foreground">
									Linked to Call ID: {task.call_audit?.call_id || "—"}
								</div>
								{task.call_audit?.call_summary && (
									<div className="rounded-lg border border-border bg-muted/30 p-4">
										<p className="text-sm font-semibold text-foreground mb-2">Call Summary</p>
										<p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
											{task.call_audit.call_summary}
										</p>
									</div>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Task Type Specific View */}
				{renderTaskView()}

				{/* Right Column: Actions and Related Tasks */}
				<div className="flex flex-col gap-5">
					{/* Actions */}
					<Card className="bg-card border-border h-fit">
						<CardHeader className="pb-3">
							<CardTitle className="text-foreground text-base">Actions</CardTitle>
						</CardHeader>
						<CardContent className="pt-0">
							<TaskActions taskId={task.id} initialStatus={task.task_status} />
						</CardContent>
					</Card>

					{/* Related Tasks */}
					{lead && (
						<Card className="bg-card border-border">
							<CardHeader className="pb-3">
								<CardTitle className="text-foreground text-base">Related Tasks</CardTitle>
								<p className="text-sm text-muted-foreground">Other tasks for {lead.name}</p>
							</CardHeader>
							<CardContent className="pt-0 min-h-[100px]">
								{relatedTasks.length > 0 ? (
									<div className="space-y-3">
										{relatedTasks.map((relatedTask) => (
											<Link
												key={relatedTask.id}
												href={`/tasks/${relatedTask.id}`}
												className="block p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
											>
												<div className="flex items-start justify-between gap-4">
													<div className="flex-1 min-w-0">
														<div className="flex items-center gap-2 mb-2">
															<p className="text-base font-medium text-foreground">
																{relatedTask.actionable.name}
															</p>
															<Badge
																variant="outline"
																className={getStatusColor(relatedTask.task_status)}
															>
																{relatedTask.task_status}
															</Badge>
														</div>
														{relatedTask.description && (
															<p className="text-sm text-muted-foreground line-clamp-2 mb-2">
																{relatedTask.description}
															</p>
														)}
														<div className="flex items-center gap-4 text-xs text-muted-foreground">
															<span>Assigned to: {relatedTask.employee.name}</span>
															<span>
																Created:{" "}
																{new Date(relatedTask.created_at).toLocaleDateString(
																	undefined,
																	{
																		year: "numeric",
																		month: "short",
																		day: "numeric",
																	}
																)}
															</span>
														</div>
													</div>
													<div className="flex items-center gap-2">
														{getStatusIcon(relatedTask.task_status)}
													</div>
												</div>
											</Link>
										))}
									</div>
								) : (
									<div className="flex flex-col items-center justify-center py-12 text-center">
										<p className="text-sm text-muted-foreground">
											No other tasks found for this lead.
										</p>
									</div>
								)}
							</CardContent>
						</Card>
					)}
				</div>
			</div>
		</div>
	);
}
