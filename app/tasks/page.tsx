"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getTasks, getEmployees } from "@/lib/mock-api";
import { useRole } from "@/lib/role-context";
import type { TaskView } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortColumn = "action" | "description" | "assignee" | "status" | "updated" | "created";
type SortDirection = "asc" | "desc";

interface SortConfig {
	column: SortColumn;
	direction: SortDirection;
}

export default function TasksPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const { role } = useRole();

	const [tasks, setTasks] = useState<TaskView[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	// In real app, this would come from auth context/token
	const currentUserId = "1"; // Mock current user ID

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [employeeFilter, setEmployeeFilter] = useState("");
	const [employees, setEmployees] = useState<ReturnType<typeof getEmployees>>([]);

	const [sort, setSort] = useState<SortConfig>({ column: "created", direction: "asc" });

	const limit = 10;

	// Format task status to Title Case
	const formatTaskStatus = (status: string): string => {
		return status
			.split("-")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ");
	};

	// Format relative time (hours ago / days ago)
	const formatRelativeTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();

		// Handle negative values (future dates) or invalid dates
		if (diffMs < 0 || isNaN(diffMs)) {
			return "just now";
		}

		const diffSeconds = Math.floor(diffMs / 1000);
		const diffMinutes = Math.floor(diffSeconds / 60);
		const diffHours = Math.floor(diffMinutes / 60);
		const diffDays = Math.floor(diffHours / 24);

		if (diffDays > 0) {
			return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
		} else if (diffHours > 0) {
			const remainingMinutes = diffMinutes % 60;
			if (remainingMinutes > 0) {
				return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ${remainingMinutes} ${
					remainingMinutes === 1 ? "minute" : "minutes"
				} ago`;
			}
			return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
		} else if (diffMinutes > 0) {
			return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
		} else {
			return "just now";
		}
	};

	// Load employees data
	useEffect(() => {
		setEmployees(getEmployees());
	}, []);

	// Sync URL params with filter state whenever URL changes
	useEffect(() => {
		const status = searchParams.get("status");
		const employeeId = searchParams.get("employee_id");

		// Update status filter from URL
		if (status) {
			setStatusFilter(status);
		} else {
			setStatusFilter("");
		}

		// Only set employee filter for non-sales_team users
		if (employeeId && role !== "sales_team") {
			setEmployeeFilter(employeeId);
		} else {
			setEmployeeFilter("");
		}
	}, [searchParams, role]);

	// Load tasks
	useEffect(() => {
		const loadTasks = async () => {
			setLoading(true);
			// For Sales Team, automatically filter by current user (ignore employeeFilter from URL)
			// For Sales Ops, use employeeFilter from URL if provided
			const result = await getTasks(page, limit, {
				status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
				employee_id:
					role === "sales_team"
						? currentUserId
						: employeeFilter && employeeFilter !== "all"
						? employeeFilter
						: undefined,
			});
			setTasks(result.data);
			setTotal(result.total);
			setLoading(false);
		};
		loadTasks();
	}, [page, statusFilter, employeeFilter, role, currentUserId]);

	// Filter by search query
	const filteredTasks = tasks.filter(
		(task) =>
			task.actionable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			task.description?.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const sortedTasks = [...filteredTasks].sort((a, b) => {
		let comparison = 0;
		switch (sort.column) {
			case "action":
				comparison = a.actionable.name.localeCompare(b.actionable.name);
				break;
			case "description":
				comparison = (a.description || "").localeCompare(b.description || "");
				break;
			case "assignee":
				comparison = a.employee.name.localeCompare(b.employee.name);
				break;
			case "status":
				comparison = a.task_status.localeCompare(b.task_status);
				break;
			case "updated":
				comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
				break;
			case "created":
				comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
				break;
		}
		return sort.direction === "asc" ? comparison : -comparison;
	});

	const handleSort = (column: SortColumn) => {
		setSort((prev) => {
			if (prev.column === column) {
				return { column, direction: prev.direction === "asc" ? "desc" : "asc" };
			}
			return { column, direction: column === "created" ? "asc" : "asc" };
		});
		setPage(1);
	};

	const getSortIcon = (column: SortColumn) => {
		if (sort.column !== column) return <ArrowUpDown className="w-4 h-4 text-muted-foreground" />;
		return sort.direction === "asc" ? (
			<ArrowUp className="w-4 h-4 text-primary" />
		) : (
			<ArrowDown className="w-4 h-4 text-primary" />
		);
	};

	const totalPages = Math.ceil(total / limit);

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

	return (
		<div className="flex-1 space-y-6 p-6">
			{/* Filters Card */}
			<Card className="bg-card border-border">
				<CardHeader className="pb-4">
					<CardTitle className="text-foreground">Filters</CardTitle>
				</CardHeader>
				<CardContent className="pt-0">
					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 items-end">
						{/* Search Input */}
						<div className="relative">
							<Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search by action or description..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(1);
								}}
								className="pl-10 bg-background text-foreground border-border"
							/>
						</div>

						{/* Status Filter */}
						<div className="w-full">
							<Select
								value={statusFilter || "all"}
								onValueChange={(value) => {
									const newStatus = value === "all" ? "" : value;
									setStatusFilter(newStatus);
									setPage(1);
									// Update URL
									const params = new URLSearchParams(searchParams.toString());
									if (newStatus) {
										params.set("status", newStatus);
									} else {
										params.delete("status");
									}
									const queryString = params.toString();
									router.replace(queryString ? `/tasks?${queryString}` : "/tasks", { scroll: false });
								}}
							>
								<SelectTrigger className="bg-background text-foreground border-border w-full">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Status</SelectItem>
									<SelectItem value="todo">Todo</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Assignee Filter - Only show for Sales Ops */}
						{role !== "sales_team" && (
							<div className="w-full">
								<Select
									value={employeeFilter || "all"}
									onValueChange={(value) => {
										const newEmployee = value === "all" ? "" : value;
										setEmployeeFilter(newEmployee);
										setPage(1);
										// Update URL
										const params = new URLSearchParams(searchParams.toString());
										if (newEmployee) {
											params.set("employee_id", newEmployee);
										} else {
											params.delete("employee_id");
										}
										const queryString = params.toString();
										router.replace(queryString ? `/tasks?${queryString}` : "/tasks", {
											scroll: false,
										});
									}}
								>
									<SelectTrigger className="bg-background text-foreground border-border w-full">
										<SelectValue placeholder="Filter by assignee" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all">All Assignees</SelectItem>
										{employees.map((employee) => (
											<SelectItem key={employee.id} value={employee.id}>
												{employee.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						)}

						{/* Reset Button */}
						<Button
							onClick={() => {
								setSearchQuery("");
								setStatusFilter("");
								setEmployeeFilter("");
								setPage(1);
								router.replace("/tasks", { scroll: false });
							}}
							variant="outline"
							className="border-border text-foreground hover:bg-muted w-full sm:w-auto"
						>
							Reset Filters
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Table Card */}
			<Card className="bg-card border-border">
				<CardHeader>
					<CardTitle className="text-foreground">
						Tasks ({sortedTasks.length} of {total})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">Loading...</p>
							</div>
						) : sortedTasks.length === 0 ? (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">No tasks found</p>
							</div>
						) : (
							<>
								<Table>
									<TableHeader>
										<TableRow className="border-border">
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("action")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Action
													{getSortIcon("action")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("description")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Description
													{getSortIcon("description")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("assignee")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Assignee
													{getSortIcon("assignee")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("status")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Status
													{getSortIcon("status")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("updated")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Updated
													{getSortIcon("updated")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("created")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Created
													{getSortIcon("created")}
												</button>
											</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{sortedTasks.map((task) => (
											<TableRow key={task.id} className="border-border hover:bg-muted/50">
												<TableCell className="font-medium">
													<Link
														href={`/tasks/${task.id}`}
														className="text-primary hover:underline"
													>
														{task.actionable.name}
													</Link>
												</TableCell>
												<TableCell
													className="text-sm max-w-xs truncate"
													title={task.description}
												>
													{task.description || "—"}
												</TableCell>
												<TableCell className="text-sm">{task.employee.name}</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={getStatusColor(task.task_status)}
													>
														{formatTaskStatus(task.task_status)}
													</Badge>
												</TableCell>
												<TableCell className="text-xs text-muted-foreground">
													{formatRelativeTime(task.updated_at)}
												</TableCell>
												<TableCell className="text-xs text-muted-foreground">
													{formatRelativeTime(task.created_at)}
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>

								{/* Pagination */}
								<div className="flex items-center justify-between mt-6 pt-6 border-t border-border">
									<p className="text-sm text-muted-foreground">
										Page {page} of {totalPages}
									</p>
									<div className="flex gap-2">
										<Button
											onClick={() => setPage(Math.max(1, page - 1))}
											disabled={page === 1}
											variant="outline"
											size="sm"
											className="border-border text-foreground hover:bg-muted disabled:opacity-50"
										>
											<ChevronLeft className="w-4 h-4 mr-1" />
											Previous
										</Button>
										<Button
											onClick={() => setPage(Math.min(totalPages, page + 1))}
											disabled={page === totalPages}
											variant="outline"
											size="sm"
											className="border-border text-foreground hover:bg-muted disabled:opacity-50"
										>
											Next
											<ChevronRight className="w-4 h-4 ml-1" />
										</Button>
									</div>
								</div>
							</>
						)}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
