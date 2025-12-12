"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
	LayoutDashboard,
	PhoneCall,
	CheckSquare,
	Menu,
	X,
	KanbanSquare,
	Headphones,
	ClipboardList,
	Settings,
} from "lucide-react";
import { useState } from "react";
import { useRole } from "@/lib/role-context";
import type { UserRole } from "@/lib/auth";

const EXECUTIVE_NAVIGATION = [
	{ href: "/", label: "Executive Dashboard", icon: LayoutDashboard },
	{ href: "/call-audits", label: "Call Audits", icon: PhoneCall },
	{ href: "/tasks", label: "Tasks", icon: CheckSquare },
];

const SALES_OPS_NAVIGATION = [
	{ href: "/", label: "Dashboard", icon: LayoutDashboard },
	{ href: "/call-audits", label: "Call Audits", icon: PhoneCall },
	{ href: "/tasks", label: "Tasks", icon: CheckSquare },
];

const SALES_TEAM_NAVIGATION = [
	{ href: "/sales-team", label: "My Dashboard", icon: LayoutDashboard },
	{ href: "/tasks/pipeline", label: "Pipeline", icon: KanbanSquare },
	{ href: "/tasks", label: "All Tasks", icon: CheckSquare },
];

interface SidebarProps {
	userType?: UserRole | null;
}

export function Sidebar({ userType }: SidebarProps) {
	console.log("Sidebar", userType);
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const { role: contextRole } = useRole();

	// Use userType from token if available, otherwise fall back to context role
	const role = userType || contextRole;

	const getNavigation = () => {
		switch (role) {
			case "executive":
				return EXECUTIVE_NAVIGATION;
			case "sales_ops":
				return SALES_OPS_NAVIGATION;
			case "sales_team":
				return SALES_TEAM_NAVIGATION;
			default:
				return SALES_OPS_NAVIGATION;
		}
	};

	const NAVIGATION = getNavigation();

	return (
		<>
			<button
				onClick={() => setOpen(!open)}
				className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-sidebar hover:bg-sidebar-accent"
			>
				{open ? <X size={20} /> : <Menu size={20} />}
			</button>

			<aside
				className={cn(
					"fixed inset-y-0 left-0 z-40 w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-transform duration-300 overflow-hidden",
					open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
				)}
			>
				<div className="flex flex-col h-full pt-20 lg:pt-0">
					<div className="px-6 py-6 border-b border-sidebar-border">
						<h1 className="text-xl font-bold text-sidebar-foreground">
							{role === "executive" ? "AI Sales Hub" : "Call Audit System"}
						</h1>
						<p className="text-xs text-sidebar-foreground/60 mt-1">Command Center</p>
					</div>

					<nav className="flex-1 px-3 py-6 space-y-2">
						{NAVIGATION.map((item) => {
							const Icon = item.icon;
							// Handle active state - check exact match or if pathname starts with href (for nested routes)
							let isActive = false;
							if (item.href === "/") {
								// Root path: only active if exactly "/" and not sales_team
								isActive = pathname === "/" && role !== "sales_team";
							} else if (item.href === "/sales-team") {
								// Sales team dashboard: exact match only
								isActive = pathname === "/sales-team";
							} else if (item.href === "/tasks") {
								// Tasks: exact match or detail pages (/tasks/[id]), but NOT /tasks/pipeline
								isActive = pathname === "/tasks" || (pathname.startsWith("/tasks/") && !pathname.startsWith("/tasks/pipeline"));
							} else if (item.href === "/tasks/pipeline") {
								// Pipeline: exact match only
								isActive = pathname === "/tasks/pipeline";
							} else {
								// Other routes: exact match or pathname starts with href (for detail pages)
								isActive = pathname === item.href || pathname.startsWith(item.href + "/");
							}
							return (
								<Link
									key={item.href}
									href={item.href}
									onClick={() => setOpen(false)}
									className={cn(
										"flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
										isActive
											? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-lg"
											: "text-sidebar-foreground hover:bg-sidebar-accent"
									)}
								>
									<Icon size={20} />
									<span className="font-medium">{item.label}</span>
								</Link>
							);
						})}
					</nav>

					{/* Settings for Executive */}
					{role === "executive" && (
						<div className="px-3 py-2">
							<Link
								href="/settings"
								onClick={() => setOpen(false)}
								className={cn(
									"flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
									pathname === "/settings"
										? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-lg"
										: "text-sidebar-foreground hover:bg-sidebar-accent"
								)}
							>
								<Settings size={20} />
								<span className="font-medium">Settings</span>
							</Link>
						</div>
					)}

					<div className="px-6 py-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50">
						<p>© 2025 {role === "executive" ? "AI Sales Hub" : "Call Audit System"}</p>
					</div>
				</div>
			</aside>

			{open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}
		</>
	);
}
