"use client";

import { useState, useEffect } from "react";
import { getTasks, getUnifiedItems } from "@/lib/mock-api";
import type { TaskView, UnifiedItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckSquare, TrendingUp, Play, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
	const router = useRouter();
	const [userTasks, setUserTasks] = useState<TaskView[]>([]);
	const [allTasks, setAllTasks] = useState<TaskView[]>([]);
	const [userUnifiedItems, setUserUnifiedItems] = useState<UnifiedItem[]>([]);
	const [loading, setLoading] = useState(false);
	// In real app, this would come from auth context/token
	// For now, using mock user ID - in production, get from token
	const currentUserId = "1"; // Mock current user ID

	useEffect(() => {
		const loadData = async () => {
			setLoading(true);
			// Load user-specific tasks
			const userTasksResult = await getTasks(1, 100, {
				employee_id: currentUserId,
			});
			setUserTasks(userTasksResult.data);

			// Load unified items (tasks and call audits) for user - for Play button
			const unifiedItemsResult = await getUnifiedItems(1, 1000, {
				employee_id: currentUserId,
			});
			// Sort by created_at ascending to get oldest first - but getUnifiedItems already sorts descending
			// So we need to reverse it to get oldest first
			const sortedItems = [...unifiedItemsResult.data].reverse();
			setUserUnifiedItems(sortedItems);

			// Load overall data for summary
			const allTasksResult = await getTasks(1, 1000);
			setAllTasks(allTasksResult.data);

			setLoading(false);
		};
		loadData();
	}, [currentUserId]);

	// User-level metrics
	const userAssignedTasks = userTasks;
	const userTodoTasks = userTasks.filter((t) => t.task_status === "todo");
	const userCompletedTasks = userTasks.filter((t) => t.task_status === "completed");

	// Overall metrics
	const overallTotalTasks = allTasks.length;
	const overallCompletedTasks = allTasks.filter((t) => t.task_status === "completed").length;

	// Get first item (task or call audit) from unified list for Play button
	const firstItem = userUnifiedItems.length > 0 ? userUnifiedItems[0] : null;

	const handlePlayClick = () => {
		if (firstItem) {
			router.push(`/tasks/${firstItem.id}`);
		}
	};

	// Get display name for the first item
	const getFirstItemDisplayName = () => {
		if (!firstItem) return null;
		if (firstItem.type === "task" && firstItem.task) {
			return firstItem.task.actionable.name;
		} else if (firstItem.type === "call_audit" && firstItem.call_audit) {
			return firstItem.call_audit.lead.name;
		}
		return null;
	};

	return (
		<div className="flex-1 space-y-8 p-6 lg:p-10">
			{/* Overall Summary */}
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground text-xl">Overall Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<div className="flex items-start justify-between p-4 rounded-lg bg-muted/30">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Total Tasks</p>
								<p className="text-2xl font-bold text-foreground mt-1">
									{loading ? "—" : overallTotalTasks}
								</p>
							</div>
							<CheckSquare className="w-6 h-6 text-primary" />
						</div>
						<div className="flex items-start justify-between p-4 rounded-lg bg-muted/30">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
								<p className="text-2xl font-bold text-foreground mt-1">
									{loading ? "—" : overallCompletedTasks}
								</p>
							</div>
							<CheckSquare className="w-6 h-6 text-green-600" />
						</div>
						<div className="flex items-start justify-between p-4 rounded-lg bg-muted/30">
							<div>
								<p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
								<p className="text-2xl font-bold text-foreground mt-1">
									{loading
										? "—"
										: overallTotalTasks > 0
										? Math.round((overallCompletedTasks / overallTotalTasks) * 100)
										: 0}
									%
								</p>
							</div>
							<TrendingUp className="w-6 h-6 text-green-600" />
						</div>
					</div>
				</CardContent>
			</Card>

			{/* User Level Summary */}
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground text-xl">Your Summary</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
						<Link href="/tasks" className="block h-full">
							<Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer h-full">
								<CardContent className="pt-6 h-full flex flex-col">
									<div className="flex items-start justify-between flex-1">
										<div className="flex-1">
											<p className="text-sm font-medium text-muted-foreground">Total Assigned</p>
											<p className="text-3xl font-bold text-foreground mt-2">
												{userAssignedTasks.length}
											</p>
											<p className="text-xs text-muted-foreground mt-1 opacity-0">Placeholder</p>
										</div>
										<CheckSquare className="w-8 h-8 text-primary" />
									</div>
								</CardContent>
							</Card>
						</Link>

						<Link href="/tasks?status=todo" className="block h-full">
							<Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer h-full">
								<CardContent className="pt-6 h-full flex flex-col">
									<div className="flex items-start justify-between flex-1">
										<div className="flex-1">
											<p className="text-sm font-medium text-muted-foreground">Todo</p>
											<p className="text-3xl font-bold text-foreground mt-2">
												{userTodoTasks.length}
											</p>
											<p className="text-xs text-muted-foreground mt-1 opacity-0">Placeholder</p>
										</div>
										<Circle className="w-8 h-8 text-yellow-600" />
									</div>
								</CardContent>
							</Card>
						</Link>

						<Link href="/tasks?status=completed" className="block h-full">
							<Card className="bg-card border-border hover:bg-muted/50 transition-colors cursor-pointer h-full">
								<CardContent className="pt-6 h-full flex flex-col">
									<div className="flex items-start justify-between flex-1">
										<div className="flex-1">
											<p className="text-sm font-medium text-muted-foreground">Completed</p>
											<p className="text-3xl font-bold text-foreground mt-2">
												{userCompletedTasks.length}
											</p>
											<p className="text-xs text-muted-foreground mt-1">
												{userAssignedTasks.length > 0
													? Math.round(
															(userCompletedTasks.length / userAssignedTasks.length) * 100
													  )
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
				</CardContent>
			</Card>

			{/* Big Play Button */}
			{firstItem && (
				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex flex-col items-center justify-center py-12">
							<Button
								onClick={handlePlayClick}
								size="lg"
								className="w-full max-w-md h-20 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg cursor-pointer"
							>
								<Play className="w-8 h-8 mr-3" />
								Start Working on Tasks
							</Button>
							{getFirstItemDisplayName() && (
								<p className="text-sm text-muted-foreground mt-4">Next: {getFirstItemDisplayName()}</p>
							)}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
