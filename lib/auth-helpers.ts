/**
 * Helper functions for authentication token management
 * These are for development/testing purposes
 */

import type { UserRole } from "./auth"

/**
 * Create a mock token for development/testing
 * In production, tokens would be issued by your authentication server
 */
export function createMockToken(userType: UserRole, userId: string = "1"): string {
	const tokenData = {
		user_type: userType,
		user_id: userId,
		email: `user-${userId}@example.com`,
		iat: Math.floor(Date.now() / 1000),
		exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
	}

	// Encode as base64 for mock token
	return Buffer.from(JSON.stringify(tokenData)).toString("base64")
}

/**
 * Set mock token in browser cookies (for development/testing)
 * Usage: Call this in browser console or create a test page
 */
export function setMockTokenInCookie(userType: UserRole, userId: string = "1") {
	if (typeof window === "undefined") {
		console.warn("setMockTokenInCookie can only be called in browser")
		return
	}

	const token = createMockToken(userType, userId)
	document.cookie = `auth_token=${token}; path=/; max-age=3600`
	console.log(`Mock token set for user type: ${userType}`)
}

