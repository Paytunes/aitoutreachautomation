"use client"

import { useRole } from "@/lib/role-context"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

export function RoleRedirect() {
	const { role } = useRole()
	const pathname = usePathname()
	const router = useRouter()

	useEffect(() => {
		// Redirect Sales Team to their dashboard when accessing root
		if (role === "sales_team" && pathname === "/") {
			router.push("/sales-team")
		}
	}, [role, pathname, router])

	return null
}

