"use client";

// COMMENTED OUT: Multiple user type flow - keeping single type only
// import { useRole } from "@/lib/role-context";
// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useRef } from "react";

export function RoleRedirect() {
	// COMMENTED OUT: Role-based redirect logic
	// const { role } = useRole();
	// const pathname = usePathname();
	// const router = useRouter();
	// const hasRedirected = useRef(false);

	// useEffect(() => {
	// 	// Reset redirect flag when pathname becomes "/" again
	// 	// This allows redirect to work if user navigates back to "/" after being redirected
	// 	if (pathname === "/") {
	// 		hasRedirected.current = false;
	// 	}
	// }, [pathname]);

	// useEffect(() => {
	// 	// Only redirect from root path, and only once per pathname change
	// 	// Don't redirect if already redirected for this pathname visit
	// 	if (hasRedirected.current) return;

	// 	// Only redirect Sales Team from root to their dashboard
	// 	if (role === "sales_team" && pathname === "/") {
	// 		hasRedirected.current = true;
	// 		router.push("/sales-team");
	// 	}
	// }, [role, pathname, router]);

	return null;
}
