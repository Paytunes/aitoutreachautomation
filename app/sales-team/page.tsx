"use client"

import { useState, useEffect } from "react"
import { getTasks, getEmployees } from "@/lib/mock-api"
import type { TaskView } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckSquare, Clock, AlertCircle, TrendingUp } from "lucide-react"

export default function SalesTeamDashboard() {
	const [tasks, setTasks] = useState<TaskView[]>([])
	const [loading, setLoading] = useState(false)
	// In real app, this would come from auth context/token
	// For now, using mock user ID - in production, get from token
	const currentUserId = "1" // Mock current user ID

	useEffect(() => {
		const loadTasks = async () => {
			setLoading(true)
			// Filter tasks assigned to current user
			const result = await getTasks(1, 100, {
				employee_id: currentUserId,
			})
			setTasks(result.data)
			setLoading(false)
		}
		loadTasks()
	}, [currentUserId])

	const assignedTasks = tasks
	const pendingTasks = tasks.filter((t) => t.task_status === "pending")
	const inProgressTasks = tasks.filter((t) => t.task_status === "in-progress")
	const completedTasks = tasks.filter((t) => t.task_status === "completed")

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-500/10 text-green-700 border-green-500/30"
			case "in-progress":
				return "bg-blue-500/10 text-blue-700 border-blue-500/30"
			case "pending":
				return "bg-yellow-500/10 text-yellow-700 border-yellow-500/30"
			default:
				return "bg-gray-500/10 text-gray-700 border-gray-500/30"
		}
	}

	const getStatusIcon = (status: string) => {
		switch (status) {
			case "completed":
				return <CheckSquare className="w-5 h-5 text-green-600" />
			case "in-progress":
				return <Clock className="w-5 h-5 text-blue-600" />
			case "pending":
				return <AlertCircle className="w-5 h-5 text-yellow-600" />
			default:
				return <AlertCircle className="w-5 h-5 text-gray-600" />
		}
	}

	return (
		<div className="flex-1 space-y-8 p-6 lg:p-10">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">My Tasks Dashboard</h1>
				<p className="text-muted-foreground">View and manage your assigned tasks</p>
			</div>

			{/* Metrics Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="bg-card border-border">
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

				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm font-medium text-muted-foreground">Pending</p>
								<p className="text-3xl font-bold text-foreground mt-2">{pendingTasks.length}</p>
							</div>
							<AlertCircle className="w-8 h-8 text-yellow-600" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-card border-border">
					<CardContent className="pt-6">
						<div className="flex items-start justify-between">
							<div className="flex-1">
								<p className="text-sm font-medium text-muted-foreground">In Progress</p>
								<p className="text-3xl font-bold text-foreground mt-2">{inProgressTasks.length}</p>
							</div>
							<Clock className="w-8 h-8 text-blue-600" />
						</div>
					</CardContent>
				</Card>

				<Card className="bg-card border-border">
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
			</div>

			{/* Tasks List */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Pending Tasks */}
				<Card className="bg-card border-border">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-foreground">Pending Tasks</CardTitle>
							<Badge variant="outline" className="bg-yellow-500/10 text-yellow-700 border-yellow-500/30">
								{pendingTasks.length}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{loading ? (
								<p className="text-sm text-muted-foreground">Loading...</p>
							) : pendingTasks.length === 0 ? (
								<p className="text-sm text-muted-foreground">No pending tasks</p>
							) : (
								pendingTasks.map((task) => (
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

				{/* In Progress Tasks */}
				<Card className="bg-card border-border">
					<CardHeader>
						<div className="flex items-center justify-between">
							<CardTitle className="text-foreground">In Progress</CardTitle>
							<Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-500/30">
								{inProgressTasks.length}
							</Badge>
						</div>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{loading ? (
								<p className="text-sm text-muted-foreground">Loading...</p>
							) : inProgressTasks.length === 0 ? (
								<p className="text-sm text-muted-foreground">No tasks in progress</p>
							) : (
								inProgressTasks.map((task) => (
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
			</div>

			{/* Quick Actions */}
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap gap-3">
						<Link
							href="/tasks/pipeline"
							className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
						>
							View Pipeline
						</Link>
						<Link
							href="/tasks"
							className="px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-sm font-medium"
						>
							View All Tasks
						</Link>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

