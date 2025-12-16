"use client";

import { useState, useEffect, useMemo } from "react";
import { getTasks } from "@/lib/mock-api";
import type { TaskView } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle2, Clock, Circle, ArrowRight } from "lucide-react";
import { useRole } from "@/lib/role-context";

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

export default function TaskBoardPage() {
	const [tasks, setTasks] = useState<TaskView[]>([]);
	const [loading, setLoading] = useState(false);
	const { role } = useRole();
	// In real app, this would come from auth context
	const currentUserId = "1"; // Mock current user ID

	useEffect(() => {
		const loadTasks = async () => {
			setLoading(true);
			// For Sales Team, only show tasks assigned to them
			// For Sales Ops, show all tasks
			const result = await getTasks(1, 100, {
				employee_id: role === "sales_team" ? currentUserId : undefined,
			});
			setTasks(result.data);
			setLoading(false);
		};
		loadTasks();
	}, [role, currentUserId]);

	const getDispositionColor = (disposition?: string) => {
		switch (disposition) {
			case "meeting_scheduled":
				return "bg-green-500/10 text-green-700 border-green-500/30";
			case "whatsapp_requested":
				return "bg-blue-500/10 text-blue-700 border-blue-500/30";
			case "follow_up_needed":
				return "bg-amber-500/10 text-amber-700 border-amber-500/30";
			case "case_studies_requested":
				return "bg-purple-500/10 text-purple-700 border-purple-500/30";
			case "callback_requested":
				return "bg-cyan-500/10 text-cyan-700 border-cyan-500/30";
			case "share_deck":
				return "bg-indigo-500/10 text-indigo-700 border-indigo-500/30";
			case "voicemail":
				return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30";
			case "technical_issues":
				return "bg-orange-500/10 text-orange-700 border-orange-500/30";
			case "wrong_company":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "wrong_person":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "not_interested":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "dnd_requested":
				return "bg-red-500/10 text-red-700 border-red-500/30";
			case "NA":
				return "bg-gray-500/10 text-gray-700 border-gray-500/30";
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

	// Order dispositions: NA first, then others, with meeting_scheduled at the end
	const orderedDispositions = useMemo(() => {
		const dispositions = DISPOSITION_CHOICES.map(([value]) => value);
		// Move NA to front
		const naIndex = dispositions.indexOf("NA");
		const na = dispositions.splice(naIndex, 1)[0];
		// Move meeting_scheduled to end
		const meetingIndex = dispositions.indexOf("meeting_scheduled");
		const meeting = dispositions.splice(meetingIndex, 1)[0];
		// Return: NA first, then others, meeting_scheduled last
		return [na, ...dispositions, meeting];
	}, []);

	// Group tasks by disposition
	const boardStages = useMemo(() => {
		return orderedDispositions.map((dispositionValue) => {
			const tasksForDisposition = tasks.filter((task) => {
				// Get disposition from linked call audit
				return task.call_audit?.dispositions === dispositionValue;
			});
			return {
				id: dispositionValue,
				label: getDispositionLabel(dispositionValue),
				tasks: tasksForDisposition,
			};
		});
	}, [tasks, orderedDispositions]);

	return (
		<div className="flex-1 space-y-6 p-6 lg:p-10">
			{loading ? (
				<div className="flex items-center justify-center py-12">
					<p className="text-muted-foreground">Loading board...</p>
				</div>
			) : (
				<Card className="flex flex-col bg-card border-border">
					<CardContent className="p-6">
						<div className="w-full overflow-x-auto">
							<div className="flex gap-4 items-start pb-4 min-w-max">
								{boardStages.map((stage) => (
									<Card
										key={stage.id}
										className="bg-card border-border w-[280px] flex-shrink-0 flex flex-col"
										style={{ height: "calc(100vh - 280px)" }}
									>
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between">
												<CardTitle className="text-foreground text-lg">{stage.label}</CardTitle>
												<Badge variant="outline" className={getDispositionColor(stage.id)}>
													{stage.tasks.length}
												</Badge>
											</div>
										</CardHeader>
										<CardContent className="flex-1 space-y-3 overflow-y-auto flex flex-col min-h-0">
											{stage.tasks.length === 0 ? (
												<div className="flex items-center justify-center py-8 text-muted-foreground text-sm h-full">
													No tasks
												</div>
											) : (
												stage.tasks.map((task) => (
													<Link
														key={task.id}
														href={`/tasks/${task.id}`}
														className="block p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors group"
													>
														<div className="flex items-start justify-between gap-3">
															<div className="flex-1 min-w-0 text-left">
																<div className="flex items-center gap-2 mb-2">
																	{getStatusIcon(task.task_status)}
																	<h3 className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
																		{task.actionable.name}
																	</h3>
																</div>
																{task.description && (
																	<p className="text-xs text-muted-foreground line-clamp-2 mb-2">
																		{task.description}
																	</p>
																)}
																<div className="flex items-center gap-2 text-xs text-muted-foreground">
																	<span>Assigned to: {task.employee.name}</span>
																</div>
															</div>
															<ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
														</div>
													</Link>
												))
											)}
										</CardContent>
									</Card>
								))}
							</div>
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
