"use client"

import { useState, useEffect } from "react"
import { getTasks, getEmployees } from "@/lib/mock-api"
import type { TaskView } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from "lucide-react"
import { useRole } from "@/lib/role-context"

export default function PipelinePage() {
	const [tasks, setTasks] = useState<TaskView[]>([])
	const [loading, setLoading] = useState(false)
	const { role } = useRole()
	// In real app, this would come from auth context
	const currentUserId = "1" // Mock current user ID

	useEffect(() => {
		const loadTasks = async () => {
			setLoading(true)
			// For Sales Team, only show tasks assigned to them
			// For Sales Ops, show all tasks
			const result = await getTasks(1, 100, {
				employee_id: role === "sales_team" ? currentUserId : undefined,
			})
			setTasks(result.data)
			setLoading(false)
		}
		loadTasks()
	}, [role, currentUserId])

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
				return <CheckCircle2 className="w-5 h-5 text-green-600" />
			case "in-progress":
				return <Clock className="w-5 h-5 text-blue-600" />
			case "pending":
				return <AlertCircle className="w-5 h-5 text-yellow-600" />
			default:
				return <AlertCircle className="w-5 h-5 text-gray-600" />
		}
	}

	const pipelineStages = [
		{ id: "pending", label: "Pending", tasks: tasks.filter((t) => t.task_status === "pending") },
		{ id: "in-progress", label: "In Progress", tasks: tasks.filter((t) => t.task_status === "in-progress") },
		{ id: "completed", label: "Completed", tasks: tasks.filter((t) => t.task_status === "completed") },
	]

	return (
		<div className="flex-1 space-y-6 p-6 lg:p-10">
			{/* Header */}
			<div className="flex flex-col gap-2">
				<h1 className="text-3xl font-bold text-foreground">Task Pipeline</h1>
				<p className="text-muted-foreground">Visual pipeline view of all tasks organized by status</p>
			</div>

			{loading ? (
				<div className="flex items-center justify-center py-12">
					<p className="text-muted-foreground">Loading pipeline...</p>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{pipelineStages.map((stage) => (
						<Card key={stage.id} className="bg-card border-border">
							<CardHeader className="pb-3">
								<div className="flex items-center justify-between">
									<CardTitle className="text-foreground text-lg">{stage.label}</CardTitle>
									<Badge variant="outline" className={getStatusColor(stage.id)}>
										{stage.tasks.length}
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="space-y-3">
								{stage.tasks.length === 0 ? (
									<div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
										No tasks in this stage
									</div>
								) : (
									stage.tasks.map((task) => (
										<Link
											key={task.id}
											href={`/tasks/${task.id}`}
											className="block p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 transition-colors group"
										>
											<div className="flex items-start justify-between gap-3">
												<div className="flex-1 min-w-0">
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
			)}
		</div>
	)
}

