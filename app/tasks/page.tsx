"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getUnifiedItems, getEmployees } from "@/lib/mock-api";
// COMMENTED OUT: Multiple user type role context
// import { useRole } from "@/lib/role-context";
import type { UnifiedItem, TaskView } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";

type SortColumn = "action" | "description" | "assignee" | "status" | "created";
type SortDirection = "asc" | "desc";

interface SortConfig {
	column: SortColumn;
	direction: SortDirection;
}

export default function TasksPage() {
	const searchParams = useSearchParams();
	const router = useRouter();
	// COMMENTED OUT: Multiple user type role logic
	// const { role } = useRole();

	const [items, setItems] = useState<UnifiedItem[]>([]);
	const [total, setTotal] = useState(0);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	// In real app, this would come from auth context/token
	const currentUserId = "1"; // Mock current user ID

	// Filter states
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [typeFilter, setTypeFilter] = useState<"all" | "call_audit" | "task">("all");
	const [employees, setEmployees] = useState<ReturnType<typeof getEmployees>>([]);

	const [sort, setSort] = useState<SortConfig>({ column: "created", direction: "desc" });

	const limit = 10;

	// Format task status to Title Case
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
		const type = searchParams.get("type");

		// Update status filter from URL
		if (status) {
			setStatusFilter(status);
		} else {
			setStatusFilter("");
		}

		// Update type filter from URL
		if (type && (type === "call_audit" || type === "task" || type === "all")) {
			setTypeFilter(type);
		} else {
			setTypeFilter("all");
		}
	}, [searchParams]);

	// Load unified items (both call audits and tasks)
	useEffect(() => {
		const loadItems = async () => {
			setLoading(true);
			const result = await getUnifiedItems(page, limit, {
				type: typeFilter,
				status: statusFilter && statusFilter !== "all" ? statusFilter : undefined,
				employee_id: currentUserId, // Filter tasks by current user
			});
			setItems(result.data);
			setTotal(result.total);
			setLoading(false);
		};
		loadItems();
	}, [page, statusFilter, typeFilter, currentUserId]);

	// Filter by search query
	const filteredItems = items.filter((item) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		if (item.type === "task" && item.task) {
			return (
				item.task.actionable.name.toLowerCase().includes(query) ||
				item.task.description?.toLowerCase().includes(query) ||
				item.task.employee.name.toLowerCase().includes(query)
			);
		} else if (item.type === "call_audit" && item.call_audit) {
			return (
				item.call_audit.lead.name.toLowerCase().includes(query) ||
				item.call_audit.campaign.name.toLowerCase().includes(query)
			);
		}
		return false;
	});

	const sortedItems = [...filteredItems].sort((a, b) => {
		let comparison = 0;
		switch (sort.column) {
			case "action":
				if (a.type === "task" && a.task && b.type === "task" && b.task) {
					comparison = a.task.actionable.name.localeCompare(b.task.actionable.name);
				} else if (a.type === "call_audit" && a.call_audit && b.type === "call_audit" && b.call_audit) {
					comparison = a.call_audit.lead.name.localeCompare(b.call_audit.lead.name);
				} else {
					comparison = a.type.localeCompare(b.type);
				}
				break;
			case "description":
				const aDesc =
					a.type === "task" && a.task
						? a.task.description || ""
						: a.type === "call_audit" && a.call_audit
						? a.call_audit.call_summary || ""
						: "";
				const bDesc =
					b.type === "task" && b.task
						? b.task.description || ""
						: b.type === "call_audit" && b.call_audit
						? b.call_audit.call_summary || ""
						: "";
				comparison = aDesc.localeCompare(bDesc);
				break;
			case "assignee":
				const aAssignee =
					a.type === "task" && a.task
						? a.task.employee.name
						: a.type === "call_audit" && a.call_audit
						? a.call_audit.lead.name
						: "";
				const bAssignee =
					b.type === "task" && b.task
						? b.task.employee.name
						: b.type === "call_audit" && b.call_audit
						? b.call_audit.lead.name
						: "";
				comparison = aAssignee.localeCompare(bAssignee);
				break;
			case "status":
				const aStatus =
					a.type === "task" && a.task
						? a.task.task_status
						: a.type === "call_audit" && a.call_audit
						? a.call_audit.dispositions || ""
						: "";
				const bStatus =
					b.type === "task" && b.task
						? b.task.task_status
						: b.type === "call_audit" && b.call_audit
						? b.call_audit.dispositions || ""
						: "";
				comparison = aStatus.localeCompare(bStatus);
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
								placeholder="Search by name, action, or description..."
								value={searchQuery}
								onChange={(e) => {
									setSearchQuery(e.target.value);
									setPage(1);
								}}
								className="pl-10 bg-background text-foreground border-border"
							/>
						</div>

						{/* Type Filter */}
						<div className="w-full">
							<Select
								value={typeFilter}
								onValueChange={(value) => {
									const newType = value as "all" | "call_audit" | "task";
									setTypeFilter(newType);
									setPage(1);
									// Update URL
									const params = new URLSearchParams(searchParams.toString());
									if (newType !== "all") {
										params.set("type", newType);
									} else {
										params.delete("type");
									}
									const queryString = params.toString();
									router.replace(queryString ? `/tasks?${queryString}` : "/tasks", { scroll: false });
								}}
							>
								<SelectTrigger className="bg-background text-foreground border-border w-full">
									<SelectValue placeholder="Filter by type" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Types</SelectItem>
									<SelectItem value="call_audit">Call Audits</SelectItem>
									<SelectItem value="task">Tasks</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Status Filter (only applies to tasks) */}
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

						{/* COMMENTED OUT: Assignee Filter - Only show for Sales Ops (multiple user types) */}
						{/* {role !== "sales_team" && (
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
						)} */}

						{/* Reset Button */}
						<Button
							onClick={() => {
								setSearchQuery("");
								setStatusFilter("");
								setTypeFilter("all");
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
						Items ({sortedItems.length} of {total})
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="overflow-x-auto">
						{loading ? (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">Loading...</p>
							</div>
						) : sortedItems.length === 0 ? (
							<div className="flex items-center justify-center py-12">
								<p className="text-muted-foreground">No items found</p>
							</div>
						) : (
							<>
								<Table>
									<TableHeader>
										<TableRow className="border-border">
											<TableHead className="text-foreground">Type</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("action")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Name / Action
													{getSortIcon("action")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("description")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Description / Summary
													{getSortIcon("description")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("assignee")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Assignee / Lead
													{getSortIcon("assignee")}
												</button>
											</TableHead>
											<TableHead className="text-foreground">
												<button
													type="button"
													onClick={() => handleSort("status")}
													className="flex items-center gap-2 hover:text-primary transition-colors w-full text-left"
												>
													Status / Disposition
													{getSortIcon("status")}
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
										{sortedItems.map((item) => {
											if (item.type === "task" && item.task) {
												return (
													<TableRow key={item.id} className="border-border hover:bg-muted/50">
														<TableCell>
															<Badge
																variant="outline"
																className="bg-blue-500/10 text-blue-700 border-blue-500/30"
															>
																Task
															</Badge>
														</TableCell>
														<TableCell className="font-medium">
															<Link
																href={`/tasks/${item.task.id}`}
																className="text-primary hover:underline"
															>
																{item.task.actionable.name}
															</Link>
														</TableCell>
														<TableCell
															className="text-sm max-w-xs truncate"
															title={item.task.description}
														>
															{item.task.description || "—"}
														</TableCell>
														<TableCell className="text-sm">
															{item.task.employee.name}
														</TableCell>
														<TableCell>
															<Badge
																variant="outline"
																className={getStatusColor(item.task.task_status)}
															>
																{formatTaskStatus(item.task.task_status)}
															</Badge>
														</TableCell>
														<TableCell className="text-xs text-muted-foreground">
															{formatRelativeTime(item.task.created_at)}
														</TableCell>
													</TableRow>
												);
											} else if (item.type === "call_audit" && item.call_audit) {
												const audit = item.call_audit;
												return (
													<TableRow key={item.id} className="border-border hover:bg-muted/50">
														<TableCell>
															<Badge
																variant="outline"
																className="bg-purple-500/10 text-purple-700 border-purple-500/30"
															>
																Call Audit
															</Badge>
														</TableCell>
														<TableCell className="font-medium">
															<Link
																href={`/tasks/${audit.id}`}
																className="text-primary hover:underline"
															>
																{audit.lead.name}
															</Link>
														</TableCell>
														<TableCell
															className="text-sm max-w-xs truncate"
															title={audit.call_summary}
														>
															{audit.call_summary || "—"}
														</TableCell>
														<TableCell className="text-sm">{audit.lead.name}</TableCell>
														<TableCell>
															{audit.dispositions ? (
																<Badge
																	variant="outline"
																	className="bg-primary/10 text-primary border-primary/30"
																>
																	{formatDisposition(audit.dispositions)}
																</Badge>
															) : (
																<span className="text-xs text-muted-foreground">—</span>
															)}
														</TableCell>
														<TableCell className="text-xs text-muted-foreground">
															{formatRelativeTime(audit.created_at)}
														</TableCell>
													</TableRow>
												);
											}
											return null;
										})}
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
