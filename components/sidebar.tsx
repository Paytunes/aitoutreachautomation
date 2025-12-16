"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";
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
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
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
	{ href: "/tasks/board", label: "Task Board", icon: KanbanSquare },
	{ href: "/tasks", label: "All Tasks", icon: CheckSquare },
];

interface SidebarContextType {
	collapsed: boolean;
}

export const SidebarContext = createContext<SidebarContextType>({ collapsed: false });

export const useSidebar = () => useContext(SidebarContext);

interface SidebarProps {
	userType?: UserRole | null;
	collapsed?: boolean;
	setCollapsed?: (collapsed: boolean) => void;
}

export function Sidebar({ userType, collapsed: externalCollapsed, setCollapsed: externalSetCollapsed }: SidebarProps) {
	console.log("Sidebar", userType);
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	// Initialize to false to match server-side render
	const [internalCollapsed, setInternalCollapsed] = useState(false);
	const [mounted, setMounted] = useState(false);
	
	// Use external collapsed state if provided, otherwise use internal state
	const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
	const setCollapsed = externalSetCollapsed || setInternalCollapsed;
	
	const { role: contextRole } = useRole();

	// Use userType from token if available, otherwise fall back to context role
	const role = userType || contextRole;

	// Read from localStorage after mount to avoid hydration mismatch (only if using internal state)
	useEffect(() => {
		if (externalCollapsed === undefined) {
			setMounted(true);
			if (typeof window !== "undefined") {
				const saved = localStorage.getItem("sidebarCollapsed");
				if (saved === "true") {
					setInternalCollapsed(true);
				}
			}
		}
	}, [externalCollapsed]);

	// Save collapsed state to localStorage
	useEffect(() => {
		if (mounted && typeof window !== "undefined") {
			localStorage.setItem("sidebarCollapsed", collapsed.toString());
		}
	}, [collapsed, mounted]);

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
					"fixed inset-y-0 left-0 z-40 bg-sidebar text-sidebar-foreground border-r border-sidebar-border flex flex-col transition-all duration-300 overflow-hidden",
					open ? "translate-x-0" : "-translate-x-full md:translate-x-0",
					collapsed ? "w-16 md:w-16" : "w-64 md:w-64"
				)}
			>
				<div className="flex flex-col h-full pt-20 lg:pt-0">
					<div className={cn(
						"border-b border-sidebar-border flex items-center justify-between",
						collapsed ? "px-3 py-4" : "px-6 py-6"
					)}>
						{!collapsed && (
							<div>
								<h1 className="text-xl font-bold text-sidebar-foreground">
									{role === "executive" ? "AI Sales Hub" : "Call Audit System"}
								</h1>
								<p className="text-xs text-sidebar-foreground/60 mt-1">Command Center</p>
							</div>
						)}
						<button
							onClick={() => setCollapsed(!collapsed)}
							className={cn(
								"p-2 rounded-md hover:bg-sidebar-accent transition-colors",
								collapsed ? "mx-auto" : ""
							)}
							aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						>
							{collapsed ? (
								<ChevronRight size={20} className="text-sidebar-foreground" />
							) : (
								<ChevronLeft size={20} className="text-sidebar-foreground" />
							)}
						</button>
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
								// Tasks: exact match or detail pages (/tasks/[id]), but NOT /tasks/board
								isActive = pathname === "/tasks" || (pathname.startsWith("/tasks/") && !pathname.startsWith("/tasks/board"));
							} else if (item.href === "/tasks/board") {
								// Task Board: exact match only
								isActive = pathname === "/tasks/board";
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
										"flex items-center rounded-lg transition-all duration-200",
										collapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3",
										isActive
											? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-lg"
											: "text-sidebar-foreground hover:bg-sidebar-accent"
									)}
									title={collapsed ? item.label : undefined}
								>
									<Icon size={20} />
									{!collapsed && <span className="font-medium">{item.label}</span>}
								</Link>
							);
						})}
					</nav>

					{/* Settings for Executive */}
					{role === "executive" && (
						<div className={cn("py-2", collapsed ? "px-3" : "px-3")}>
							<Link
								href="/settings"
								onClick={() => setOpen(false)}
								className={cn(
									"flex items-center rounded-lg transition-all duration-200",
									collapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3",
									pathname === "/settings"
										? "bg-sidebar-primary text-sidebar-primary-foreground font-medium shadow-lg"
										: "text-sidebar-foreground hover:bg-sidebar-accent"
								)}
								title={collapsed ? "Settings" : undefined}
							>
								<Settings size={20} />
								{!collapsed && <span className="font-medium">Settings</span>}
							</Link>
						</div>
					)}

					{!collapsed && (
						<div className="px-6 py-4 border-t border-sidebar-border text-xs text-sidebar-foreground/50">
							<p>© 2025 {role === "executive" ? "AI Sales Hub" : "Call Audit System"}</p>
						</div>
					)}
				</div>
			</aside>

			{open && <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setOpen(false)} />}
		</>
	);
}
