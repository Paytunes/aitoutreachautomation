"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

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
	// Use a consistent initial value to avoid hydration mismatch
	// Always start with initialRole if provided, otherwise default to "sales_ops"
	// This ensures server and client render the same initial value
	const [role, setRole] = useState<UserRole>(() => {
		// Only use initialRole from token if explicitly provided (not undefined)
		// This means there's a valid token with a role
		if (initialRole !== undefined) {
			return initialRole
		}
		// Default to "sales_ops" for initial render (matches server-side)
		// We'll read from localStorage after mount to preserve user selection
		return "sales_ops"
	})

	// After mount, handle localStorage sync
	useEffect(() => {
		if (typeof window === "undefined") return

		// If we have a token role, use it and sync to localStorage
		if (initialRole !== undefined) {
			setRole(initialRole)
			localStorage.setItem("userRole", initialRole)
		} else {
			// No token role: read from localStorage to preserve user's manual selection
			const savedRole = localStorage.getItem("userRole") as UserRole
			if (savedRole) {
				setRole(savedRole)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialRole]) // Only depend on initialRole - this runs once on mount or when token changes

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

