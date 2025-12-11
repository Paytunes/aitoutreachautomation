# Authentication & User Type from Token

## Overview

The application now uses token-based authentication to determine user type. User type is extracted from the authentication token and used to customize the dashboard and navigation.

## User Types

- `executive` - Executives (Dashboard only)
- `sales_ops` - Sales Ops Team (Dashboard, Call Audits, Tasks)
- `sales_team` - Sales Team (My Dashboard, Pipeline, Tasks)

## Token Structure

The authentication token should contain a `user_type` field:

```json
{
  "user_type": "executive" | "sales_ops" | "sales_team",
  "user_id": "string",
  "email": "string",
  "iat": number,
  "exp": number
}
```

## Implementation

### Server-Side (Token Extraction)

The `getUserTypeFromToken()` function in `lib/auth.ts` extracts the user type from:
1. Cookie named `auth_token`
2. Decodes the token (base64 JSON for development, JWT for production)
3. Returns the `user_type` field

### Usage

**Dashboard Page** (`app/page.tsx`):
- Gets user type from token
- Passes it to `DashboardContent` component
- Dashboard renders differently based on user type

**Layout** (`app/layout.tsx`):
- Gets user type from token
- Passes it to `Sidebar` component
- Initializes `RoleProvider` with token-based role

**Components**:
- `DashboardContent` - Uses `userType` prop instead of role context
- `Sidebar` - Uses `userType` prop if available, falls back to context

## Development/Testing

For development, you can set a mock token using the browser console:

```javascript
// Import the helper (or use directly in console)
import { setMockTokenInCookie } from '@/lib/auth-helpers'

// Set token for different user types
setMockTokenInCookie('executive', '1')
setMockTokenInCookie('sales_ops', '2')
setMockTokenInCookie('sales_team', '3')
```

Or manually set the cookie:
```javascript
// Create token data
const tokenData = {
  user_type: 'executive', // or 'sales_ops' or 'sales_team'
  user_id: '1',
  email: 'user@example.com'
}

// Encode and set cookie
const token = btoa(JSON.stringify(tokenData))
document.cookie = `auth_token=${token}; path=/; max-age=3600`
```

## Production Setup

In production, you'll need to:

1. **Replace mock token parsing** with actual JWT verification:
   ```typescript
   import jwt from 'jsonwebtoken'
   
   const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserToken
   return decoded.user_type || null
   ```

2. **Set up token in your authentication flow**:
   - After login, set the `auth_token` cookie
   - Token should be a valid JWT with `user_type` in the payload

3. **Handle token refresh**:
   - Implement token refresh logic
   - Update cookie when token expires

## Default Behavior

If no token is found or token doesn't contain `user_type`:
- Defaults to `sales_ops` role
- User can still manually switch roles via TopNav dropdown (for development)

