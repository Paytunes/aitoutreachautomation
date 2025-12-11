"use client"

import { useRole } from "@/lib/role-context"

export function DashboardHeader() {
	const { role } = useRole()

	return (
		<div className="flex flex-col gap-2">
			<h1 className="text-3xl font-bold text-foreground">
				{role === "executive" ? "Executive Dashboard" : "Dashboard"}
			</h1>
			<p className="text-muted-foreground">
				{role === "executive"
					? "Real-time insights into your AI sales operations"
					: "Welcome to your call audit and task management hub"}
			</p>
		</div>
	)
}

