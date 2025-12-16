"use client";

import { useSidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SidebarContentProps {
	children: ReactNode;
}

export function SidebarContent({ children }: SidebarContentProps) {
	const { collapsed } = useSidebar();

	return (
		<div
			className={cn(
				"flex-1 flex flex-col transition-all duration-300",
				collapsed ? "lg:pl-16" : "lg:pl-64"
			)}
		>
			<TopNav />
			<main className="flex-1 overflow-auto">{children}</main>
		</div>
	);
}

