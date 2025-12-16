"use client";

import { useState, useEffect } from "react";
import { getTasks, getEmployees } from "@/lib/mock-api";
import type { TaskView } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { CheckSquare, Clock, Circle, TrendingUp, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Configurable: Number of days to consider a TODO task as overdue
const OVERDUE_TODO_DAYS = 3;

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

// Chart colors for disposition pie chart
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

export default function SalesTeamDashboard() {
	const [tasks, setTasks] = useState<TaskView[]>([]);
	const [loading, setLoading] = useState(false);
	// In real app, this would come from auth context/token
	// For now, using mock user ID - in production, get from token
	const currentUserId = "1"; // Mock current user ID

	useEffect(() => {
		const loadTasks = async () => {
			setLoading(true);
			// Filter tasks assigned to current user
			const result = await getTasks(1, 100, {
				employee_id: currentUserId,
			});
			setTasks(result.data);
			setLoading(false);
		};
		loadTasks();
	}, [currentUserId]);

	const assignedTasks = tasks;
	const todoTasks = tasks.filter((t) => t.task_status === "todo");
	const inProgressTasks = tasks.filter((t) => t.task_status === "in-progress");
	const completedTasks = tasks.filter((t) => t.task_status === "completed");

	// Filter TODO tasks that are older than configured days
	const overdueTodoTasks = todoTasks.filter((task) => {
		const createdDate = new Date(task.created_at);
		const now = new Date();
		const diffTime = now.getTime() - createdDate.getTime();
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
		return diffDays > OVERDUE_TODO_DAYS;
	});

	// Calculate task counts by disposition - match Task Board logic
	// Order dispositions: NA first, then others, with meeting_scheduled at the end
	const orderedDispositions = (() => {
		const dispositions = DISPOSITION_CHOICES.map(([value]) => value);
		// Move NA to front
		const naIndex = dispositions.indexOf("NA");
		const na = dispositions.splice(naIndex, 1)[0];
		// Move meeting_scheduled to end
		const meetingIndex = dispositions.indexOf("meeting_scheduled");
		const meeting = dispositions.splice(meetingIndex, 1)[0];
		// Return: NA first, then others, meeting_scheduled last
		return [na, ...dispositions, meeting];
	})();

	// Count tasks by disposition (same logic as Task Board)
	const taskDispositionData = orderedDispositions.map((dispositionValue, index) => {
		const tasksForDisposition = tasks.filter((task) => {
			// Get disposition from linked call audit (same as Task Board)
			return task.call_audit?.dispositions === dispositionValue;
		});
		return {
			name: getDispositionLabel(dispositionValue),
			value: tasksForDisposition.length,
			fill: chartColors[index % chartColors.length],
		};
	});

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
				return <CheckSquare className="w-5 h-5 text-green-600" />;
			case "in-progress":
				return <Clock className="w-5 h-5 text-blue-600" />;
			case "todo":
				return <Circle className="w-5 h-5 text-yellow-600" />;
			default:
				return <Circle className="w-5 h-5 text-gray-600" />;
		}
	};

	return (
		<div className="flex-1 space-y-8 p-6 lg:p-10">
			{/* Metrics Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				<Link href="/tasks" className="block">
					<Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-sm font-medium text-muted-foreground">Total Assigned</p>
									<p className="text-3xl font-bold text-foreground mt-2">{assignedTasks.length}</p>
								</div>
								<CheckSquare className="w-8 h-8 text-primary" />
							</div>
						</CardContent>
					</Card>
				</Link>

				<Link href="/tasks?status=todo" className="block">
					<Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-sm font-medium text-muted-foreground">Todo</p>
									<p className="text-3xl font-bold text-foreground mt-2">{todoTasks.length}</p>
								</div>
								<Circle className="w-8 h-8 text-yellow-600" />
							</div>
						</CardContent>
					</Card>
				</Link>

				<Link href="/tasks?status=completed" className="block">
					<Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer">
						<CardContent className="pt-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<p className="text-sm font-medium text-muted-foreground">Completed</p>
									<p className="text-3xl font-bold text-foreground mt-2">{completedTasks.length}</p>
									<p className="text-xs text-muted-foreground mt-1">
										{assignedTasks.length > 0
											? Math.round((completedTasks.length / assignedTasks.length) * 100)
											: 0}
										% completion rate
									</p>
								</div>
								<TrendingUp className="w-8 h-8 text-green-600" />
							</div>
						</CardContent>
					</Card>
				</Link>
			</div>

			{/* Tasks List */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Pending Tasks */}
				<Card className="bg-card border-border">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-foreground">Todo Tasks</CardTitle>
							<Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30">
								{todoTasks.length}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{loading ? (
								<p className="text-sm text-muted-foreground">Loading...</p>
							) : todoTasks.length === 0 ? (
								<p className="text-sm text-muted-foreground">No todo tasks</p>
							) : (
								todoTasks.map((task) => (
									<Link
										key={task.id}
										href={`/tasks/${task.id}`}
										className="block p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
									>
										<div className="flex items-start gap-3">
											{getStatusIcon(task.task_status)}
											<div className="flex-1 min-w-0">
												<h3 className="font-semibold text-foreground text-sm mb-1">
													{task.actionable.name}
												</h3>
												{task.description && (
													<p className="text-xs text-muted-foreground line-clamp-2">
														{task.description}
													</p>
												)}
											</div>
										</div>
									</Link>
								))
							)}
						</div>
					</CardContent>
				</Card>

				{/* Overdue Todo Tasks */}
				<Card className="bg-card border-border">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-foreground">
								Overdue Todo Tasks ({">"} {OVERDUE_TODO_DAYS} days)
							</CardTitle>
							<Badge variant="outline" className="bg-red-500/10 text-red-700 border-red-500/30">
								{overdueTodoTasks.length}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{loading ? (
								<p className="text-sm text-muted-foreground">Loading...</p>
							) : overdueTodoTasks.length === 0 ? (
								<p className="text-sm text-muted-foreground">
									No todo tasks older than {OVERDUE_TODO_DAYS} days
								</p>
							) : (
								overdueTodoTasks.map((task) => {
									const createdDate = new Date(task.created_at);
									const now = new Date();
									const diffTime = now.getTime() - createdDate.getTime();
									const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
									return (
										<Link
											key={task.id}
											href={`/tasks/${task.id}`}
											className="block p-3 rounded-lg border border-red-200 bg-red-50/30 hover:bg-red-50/50 transition-colors"
										>
											<div className="flex items-start gap-3">
												<AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
												<div className="flex-1 min-w-0">
													<div className="flex items-center gap-2 mb-1">
														<h3 className="font-semibold text-foreground text-sm">
															{task.actionable.name}
														</h3>
														<Badge
															variant="outline"
															className="bg-red-500/10 text-red-700 border-red-500/30 text-xs"
														>
															{diffDays} days ago
														</Badge>
													</div>
													{task.description && (
														<p className="text-xs text-muted-foreground line-clamp-2">
															{task.description}
														</p>
													)}
												</div>
											</div>
										</Link>
									);
								})
							)}
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Tasks by Disposition Chart */}
			{(() => {
				const chartData = taskDispositionData.filter((entry) => entry.value > 0);
				return chartData.length > 0 ? (
					<Card className="bg-card border-border">
						<CardHeader>
							<CardTitle className="text-foreground">Tasks by Disposition</CardTitle>
						</CardHeader>
						<CardContent className="flex justify-center">
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={chartData}
										cx="50%"
										cy="50%"
										labelLine={false}
										label={(entry: any) => `${entry.name}: ${entry.value}`}
										outerRadius={100}
										fill="#8884d8"
										dataKey="value"
									>
										{chartData.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.fill} />
										))}
									</Pie>
									<Tooltip />
								</PieChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				) : null;
			})()}
		</div>
	);
}
