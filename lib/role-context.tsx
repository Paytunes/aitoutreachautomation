"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export type UserRole = "executive" | "sales_ops" | "sales_team"

interface RoleContextType {
	role: UserRole
	setRole: (role: UserRole) => void
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({
	children,
	initialRole,
}: {
	children: ReactNode
	initialRole?: UserRole
}) {
	// Use initialRole from token, fallback to localStorage, then default
	const [role, setRole] = useState<UserRole>(() => {
		if (initialRole) {
			return initialRole
		}
		if (typeof window !== "undefined") {
			const savedRole = localStorage.getItem("userRole") as UserRole
			return savedRole || "sales_ops"
		}
		return "sales_ops"
	})

	const handleSetRole = (newRole: UserRole) => {
		setRole(newRole)
		if (typeof window !== "undefined") {
			localStorage.setItem("userRole", newRole)
		}
	}

	return <RoleContext.Provider value={{ role, setRole: handleSetRole }}>{children}</RoleContext.Provider>
}

export function useRole() {
	const context = useContext(RoleContext)
	if (context === undefined) {
		throw new Error("useRole must be used within a RoleProvider")
	}
	return context
}

