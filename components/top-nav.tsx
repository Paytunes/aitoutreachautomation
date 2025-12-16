"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getTaskById } from "@/lib/mock-api";

const BREADCRUMB_MAP: Record<string, string> = {
	"/": "Dashboard",
	"/sales-team": "My Dashboard",
	"/call-audits": "Call Audits",
	"/ops-review": "Ops Review Queue",
	"/tasks": "Tasks",
	"/tasks/board": "Task Board",
};

export function TopNav() {
	const pathname = usePathname();
	const router = useRouter();
	const { role, setRole } = useRole();

	const [dynamicTitle, setDynamicTitle] = useState<string | null>(null);

	const isTaskDetail = useMemo(() => {
		// Matches /tasks/[id] but not /tasks or /tasks/board
		return pathname.startsWith("/tasks/") && !pathname.includes("/board");
	}, [pathname]);

	useEffect(() => {
		const loadTaskTitle = async () => {
			if (!isTaskDetail) {
				setDynamicTitle(null);
				return;
			}
			const parts = pathname.split("/").filter(Boolean);
			const taskId = parts[1];
			if (!taskId) {
				setDynamicTitle(null);
				return;
			}
			const task = await getTaskById(taskId);
			if (task?.actionable?.name) {
				setDynamicTitle(task.actionable.name);
			} else if (task?.id) {
				setDynamicTitle(`Task ${task.id}`);
			} else {
				setDynamicTitle("Task Details");
			}
		};

		loadTaskTitle();
	}, [pathname, isTaskDetail]);

	// Handle detail pages and overrides
	let title = BREADCRUMB_MAP[pathname] || "Page";
	if (pathname.includes("/call-audits/")) {
		title = "Call Audit Details";
	} else if (isTaskDetail) {
		title = dynamicTitle || "Task Details";
	}

	const handleRoleChange = (value: string) => {
		const newRole = value as any;
		setRole(newRole);

		// Navigate to appropriate dashboard based on role
		if (newRole === "sales_team") {
			router.push("/sales-team");
		} else {
			router.push("/");
		}
	};

	return (
		<div className="border-b border-border bg-background">
			<div className="flex h-16 items-center justify-between px-6">
				<h2 className="text-xl font-semibold text-foreground">{title}</h2>
				<div className="flex items-center gap-4">
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
				</div>
			</div>
		</div>
	);
}
