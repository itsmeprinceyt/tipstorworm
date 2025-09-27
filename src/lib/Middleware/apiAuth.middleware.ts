import { NextRequest } from 'next/server';
import { verifyJWT, getTokenFromCookies } from './jwtVerify.middleware';
import { Payload } from '../../types/JWT/payload.type';
import { AuthResult } from '../../types/Middleware/AuthResult.type';

/**
 * @brief Verifies user authentication by extracting and validating JWT token from request cookies.
 * 
 * This function performs the core authentication check for API routes by:
 * 1. Extracting the JWT access token from HTTP-only cookies
 * 2. Verifying the token signature and expiration using Web Crypto API
 * 3. Returning a standardized AuthResult with user data or error information
 * 
 * Used as the foundation for both regular authentication and admin verification.
 * Handles common authentication failure scenarios with descriptive error messages.
 * @example **Success Case:**
 * - `{ success: true, user: Payload }` - Valid token with decoded user data
 * 
 * @example **Failure Cases:**
 * - `{ success: false, error: 'Authentication required' }` - No token found in cookies
 * - `{ success: false, error: 'Invalid or expired token' }` - Token verification failed
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  const token = getTokenFromCookies(request);
  if (!token) return { success: false, error: 'Authentication required' };
  
  const user = await verifyJWT(token);
  if (!user) return { success: false, error: 'Invalid or expired token' };
  
  return { success: true, user };
}

/**
 * @brief Verifies both user authentication and admin authorization for restricted API endpoints.
 * 
 * Performs a two-stage verification process:
 * 1. Calls verifyAuth() to ensure user has valid authentication
 * 2. Checks the `is_admin` flag in the JWT payload for admin privileges
 * 
 * This function prevents both unauthorized access (no token) and privilege escalation
 * (valid user but not admin). Essential for protecting sensitive admin operations
 * like user management, system settings, and administrative dashboards.

 * @example **Success Case:**
 * - `{ success: true, user: Payload }` - Valid admin user with full privileges
 * 
 * @example **Failure Cases:**
 * - `{ success: false, error: 'Authentication required' }` - No token found
 * - `{ success: false, error: 'Invalid or expired token' }` - Token verification failed
 * - `{ success: false, error: 'Admin access required' }` - Valid user but not admin
 */
export async function verifyAdmin(request: NextRequest): Promise<AuthResult> {
  const authResult = await verifyAuth(request);
  
  if (!authResult.success) return authResult;
  
  if (!authResult.user?.is_admin) return { success: false, error: 'Admin access required' };
  
  return authResult;
}

/**
 * @brief Higher-order function that wraps API route handlers with authentication middleware.
 * 
 * This decorator pattern function automatically handles authentication for API routes,
 * eliminating the need to manually check authentication in every protected endpoint.
 * It intercepts the request, verifies authentication, and only calls the actual
 * handler if the user is properly authenticated.
 * 
 * @example **Benefits:**
 * - DRY principle - no repeated auth code in route handlers
 * - Consistent error responses across all authenticated endpoints
 * - Automatic 401 status code handling for unauthorized requests
 * - Type safety with guaranteed user object in handler function
 * 
 * @example **Authentication Flow:**
 * 1. Extract and verify JWT token from request cookies
 * 2. If authentication fails, return 401 JSON response immediately
 * 3. If authentication succeeds, call original handler with user data
 * 4. Return whatever the original handler returns
 */
export function withAuth(handler: (req: NextRequest, user: Payload) => Promise<Response>) {
  return async (req: NextRequest) => {
    const authResult = await verifyAuth(req);
    
    if (!authResult.success) {
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return handler(req, authResult.user!);
  };
}

/**
 * @brief Higher-order function that wraps API route handlers with admin authentication middleware.
 * 
 * Similar to withAuth() but with additional admin privilege verification. This decorator
 * ensures that only users with admin privileges can access sensitive administrative
 * endpoints. Provides both authentication and authorization in a single wrapper.
 * 
 * @example **Security Features:**
 * - Dual-layer protection (authentication + authorization)
 * - Proper HTTP status codes (401 for auth issues, 403 for permission issues)
 * - Prevents privilege escalation attacks
 * - Consistent error response format across admin endpoints
 * 
 * @example **Status Code Logic:**
 * - 401 Unauthorized: Missing or invalid token (authentication failure)
 * - 403 Forbidden: Valid user but lacks admin privileges (authorization failure)
 * 
 * @example **Authorization Flow:**
 * 1. Verify user authentication (token exists and is valid)
 * 2. Verify admin authorization (is_admin flag is true)
 * 3. If either check fails, return appropriate error status (401/403)
 * 4. If both checks pass, call original handler with admin user data
 * 5. Return whatever the original handler returns
 */
export function withAdmin(handler: (req: NextRequest, user: Payload) => Promise<Response>): (req: NextRequest) => Promise<Response> {
  return async (req: NextRequest) => {
    const authResult = await verifyAdmin(req);
    
    if (!authResult.success) {
      const status = authResult.error?.includes('Admin') ? 403 : 401;
      return new Response(
        JSON.stringify({ error: authResult.error }),
        { status, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    return handler(req, authResult.user!);
  };
}
