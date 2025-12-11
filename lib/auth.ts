import { cookies } from "next/headers"

export type UserRole = "executive" | "sales_ops" | "sales_team"

interface UserToken {
	user_type?: UserRole
	user_id?: string
	email?: string
	// Add other token fields as needed
}

/**
 * Extract user type from authentication token
 * In production, this would decode a JWT token from cookies or headers
 */
export async function getUserTypeFromToken(): Promise<UserRole | null> {
	try {
		// In production, get token from cookies or Authorization header
		const cookieStore = await cookies()
		const token = cookieStore.get("auth_token")?.value

		if (!token) {
			// For development, return null (will use default)
			return null
		}

		// In production, decode JWT token here
		// For now, mock implementation
		// const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserToken
		// return decoded.user_type || null

		// Mock: Parse token if it's a JSON string (for development)
		try {
			const decoded = JSON.parse(Buffer.from(token, "base64").toString()) as UserToken
			return decoded.user_type || null
		} catch {
			// If token is not in expected format, return null
			return null
		}
	} catch (error) {
		console.error("Error extracting user type from token:", error)
		return null
	}
}

/**
 * Get current user ID from token
 */
export async function getUserIdFromToken(): Promise<string | null> {
	try {
		const cookieStore = await cookies()
		const token = cookieStore.get("auth_token")?.value

		if (!token) {
			return null
		}

		try {
			const decoded = JSON.parse(Buffer.from(token, "base64").toString()) as UserToken
			return decoded.user_id || null
		} catch {
			return null
		}
	} catch (error) {
		console.error("Error extracting user ID from token:", error)
		return null
	}
}

