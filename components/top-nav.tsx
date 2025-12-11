"use client";

import { usePathname, useRouter } from "next/navigation";
import { useRole } from "@/lib/role-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BREADCRUMB_MAP: Record<string, string> = {
	"/": "Dashboard",
	"/sales-team": "My Dashboard",
	"/call-audits": "Call Audits",
	"/tasks": "Tasks",
	"/tasks/pipeline": "Task Pipeline",
};

export function TopNav() {
	const pathname = usePathname();
	const router = useRouter();
	const { role, setRole } = useRole();

	// Handle detail pages
	let title = BREADCRUMB_MAP[pathname] || "Page";
	if (pathname.includes("/call-audits/")) {
		title = "Call Audit Details";
	} else if (pathname.includes("/tasks/") && !pathname.includes("/pipeline")) {
		title = "Task Details";
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
