"use client";

import { useState, useEffect } from "react";
import { Sidebar, SidebarContext } from "@/components/sidebar";
import { SidebarContent } from "@/components/sidebar-content";
import type { UserRole } from "@/lib/auth";

interface SidebarWrapperProps {
	userType?: UserRole | null;
	children: React.ReactNode;
}

export function SidebarWrapper({ userType, children }: SidebarWrapperProps) {
	// Initialize to false to match server-side render
	const [collapsed, setCollapsed] = useState(false);
	const [mounted, setMounted] = useState(false);

	// Read from localStorage after mount to avoid hydration mismatch
	useEffect(() => {
		setMounted(true);
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("sidebarCollapsed");
			if (saved === "true") {
				setCollapsed(true);
			}
		}
	}, []);

	// Save collapsed state to localStorage
	useEffect(() => {
		if (mounted && typeof window !== "undefined") {
			localStorage.setItem("sidebarCollapsed", collapsed.toString());
		}
	}, [collapsed, mounted]);

	return (
		<SidebarContext.Provider value={{ collapsed }}>
			<div className="min-h-screen bg-background overflow-hidden">
				<Sidebar userType={userType} collapsed={collapsed} setCollapsed={setCollapsed} />
				<SidebarContent>{children}</SidebarContent>
			</div>
		</SidebarContext.Provider>
	);
}

