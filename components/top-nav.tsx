"use client";

import React, { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowLeft } from "lucide-react";
// COMMENTED OUT: Role selector removed - single user type only
// import { useRole } from "@/lib/role-context";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTaskById, getCallAuditById, getUnifiedItemById } from "@/lib/mock-api";

const BREADCRUMB_MAP: Record<string, string> = {
	"/": "Dashboard",
	"/call-audits": "Call Audits",
	"/ops-review": "Ops Review Queue",
	"/tasks": "Tasks",
	"/tasks/board": "Task Board",
};

export function TopNav() {
	const pathname = usePathname();
	// COMMENTED OUT: Role selector removed - single user type only
	// const router = useRouter();
	// const { role, setRole } = useRole();

	const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);

	const isTaskDetail = useMemo(() => {
		// Matches /tasks/[id] but not /tasks or /tasks/board
		return pathname.startsWith("/tasks/") && !pathname.includes("/board") && pathname !== "/tasks";
	}, [pathname]);

	const isCallAuditDetail = useMemo(() => {
		return pathname.startsWith("/call-audits/") && pathname !== "/call-audits";
	}, [pathname]);

	useEffect(() => {
		const loadDetailTitle = async () => {
			if (!isTaskDetail && !isCallAuditDetail) {
				setDynamicTitle(null);
				return;
			}

			const parts = pathname.split("/").filter(Boolean);
			const id = parts[1];

			if (!id) {
				setDynamicTitle(null);
				return;
			}

			// Use unified API to get both task and call audit
			const unifiedItem = await getUnifiedItemById(id);
			
			if (unifiedItem) {
				if (unifiedItem.type === "task" && unifiedItem.task) {
					setDynamicTitle(unifiedItem.task.actionable.name || `Task ${id}`);
				} else if (unifiedItem.type === "call_audit" && unifiedItem.call_audit) {
					setDynamicTitle(unifiedItem.call_audit.lead.name || "Call Audit Details");
				} else {
					setDynamicTitle(isTaskDetail ? "Task Details" : "Call Audit Details");
				}
			} else {
				setDynamicTitle(isTaskDetail ? "Task Details" : "Call Audit Details");
			}
		};

		loadDetailTitle();
	}, [pathname, isTaskDetail, isCallAuditDetail]);

	// Build breadcrumb items
	const breadcrumbItems = useMemo(() => {
		const items: Array<{ label: string; href?: string }> = [];

		// Always start with Dashboard
		items.push({ label: "Dashboard", href: "/" });

		// Add parent route if not on root and not already in the map
		if (pathname !== "/") {
			// Check if pathname is a detail page (has /tasks/[id] or /call-audits/[id])
			const isDetailPage = isTaskDetail || isCallAuditDetail;
			
			if (isDetailPage) {
				// For detail pages, add parent route
				if (isTaskDetail) {
					items.push({ label: "Tasks", href: "/tasks" });
				} else if (isCallAuditDetail) {
					items.push({ label: "Call Audits", href: "/call-audits" });
				}
			}
		}

		// Add current page (no link for current page)
		// Only add if not root, and use dynamic title for detail pages
		if (pathname !== "/") {
			const isDetailPage = isTaskDetail || isCallAuditDetail;
			const currentLabel = isDetailPage 
				? (dynamicTitle || "Details")
				: (BREADCRUMB_MAP[pathname] || "Page");
			
			// Only add if it's different from the last item (to avoid duplicates)
			const lastItem = items[items.length - 1];
			if (!lastItem || lastItem.label !== currentLabel) {
				items.push({ label: currentLabel });
			}
		}

		return items;
	}, [pathname, dynamicTitle, isTaskDetail, isCallAuditDetail]);

	// COMMENTED OUT: Role selector removed - single user type only
	// const handleRoleChange = (value: string) => {
	// 	const newRole = value as any;
	// 	setRole(newRole);

	// 	// Navigate to appropriate dashboard based on role
	// 	if (newRole === "sales_team") {
	// 		router.push("/sales-team");
	// 	} else {
	// 		router.push("/");
	// 	}
	// };

	return (
		<div className="border-b border-border bg-background">
			<div className="flex h-16 items-center justify-between px-6">
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbItems.map((item, index) => {
							const isLast = index === breadcrumbItems.length - 1;
							return (
								<React.Fragment key={index}>
									<BreadcrumbItem>
										{isLast ? (
											<BreadcrumbPage className="text-foreground font-semibold">
												{item.label}
											</BreadcrumbPage>
										) : (
											<BreadcrumbLink asChild>
												<Link href={item.href!} className="text-muted-foreground hover:text-foreground">
													{item.label}
												</Link>
											</BreadcrumbLink>
										)}
									</BreadcrumbItem>
									{!isLast && <BreadcrumbSeparator />}
								</React.Fragment>
							);
						})}
					</BreadcrumbList>
				</Breadcrumb>
				{/* COMMENTED OUT: Role selector removed - single user type only */}
				{/* <div className="flex items-center gap-4">
					<span className="text-sm text-muted-foreground">Role:</span>
					<Select value={role} onValueChange={handleRoleChange}>
						<SelectTrigger className="w-40 h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="executive">Executive</SelectItem>
							<SelectItem value="sales_ops">Sales Ops</SelectItem>
							<SelectItem value="sales_team">Sales Team</SelectItem>
						</SelectContent>
					</Select>
				</div> */}
			</div>
		</div>
	);
}
