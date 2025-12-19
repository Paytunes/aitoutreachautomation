"use client";

import { TaskView } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckCircle2, Circle, Briefcase, User } from "lucide-react";

interface RelatedTasksProps {
	tasks: TaskView[];
	currentTaskId: string;
}

export function RelatedTasks({ tasks, currentTaskId }: RelatedTasksProps) {
	const formatTaskStatus = (status: string): string => {
		if (!status) return "";
		if (status === "todo") return "Todo";
		if (status === "completed") return "Completed";
		return status
			.split(/[-_]/)
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
	};

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
				return <CheckCircle2 className="w-4 h-4 text-green-600" />;
			case "todo":
				return <Circle className="w-4 h-4 text-yellow-600" />;
			default:
				return <Circle className="w-4 h-4 text-gray-600" />;
		}
	};

	return (
		<Card className="bg-card border-border">
			<CardHeader className="pb-3">
				<CardTitle className="text-foreground text-base">Related Tasks</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-3">
					{tasks.map((task) => (
						<Link
							key={task.id}
							href={`/tasks/${task.id}`}
							className={`block p-4 rounded-lg border transition-colors ${
								task.id === currentTaskId
									? "border-primary bg-primary/5"
									: "border-border bg-card hover:bg-muted/50"
							}`}
						>
							<div className="flex items-start justify-between gap-3">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-2">
										{getStatusIcon(task.task_status)}
										<h4 className="font-semibold text-foreground text-sm">{task.actionable.name}</h4>
										<Badge variant="outline" className={getStatusColor(task.task_status)}>
											{formatTaskStatus(task.task_status)}
										</Badge>
									</div>
									{task.description && (
										<p className="text-xs text-muted-foreground line-clamp-2 mb-2">{task.description}</p>
									)}
									<div className="flex items-center gap-4 text-xs text-muted-foreground">
										<div className="flex items-center gap-1.5">
											<User className="w-3 h-3" />
											<span>{task.employee.name}</span>
										</div>
										{task.call_audit && (
											<div className="flex items-center gap-1.5">
												<Briefcase className="w-3 h-3" />
												<span>{task.call_audit.lead.name}</span>
											</div>
										)}
									</div>
								</div>
							</div>
						</Link>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

