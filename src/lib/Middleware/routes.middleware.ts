/**
 * @brief Central configuration object defining route access control rules for the application.
 * 
 * This configuration serves as the single source of truth for route-based access control,
 * enabling easy management of which routes require authentication, admin privileges, owner
 * privileges, or should be publicly accessible. Used by middleware to determine appropriate 
 * handling for each incoming request based on the route path.
 * 
 * @example **Route Categories:**
 * - **adminRoutes**: Require both authentication and admin privileges (is_admin: true)
 * - **ownerRoutes**: Require authentication and owner privileges (is_owner: true)
 * - **protectedRoutes**: Require valid user authentication but no specific role
 * - **publicRoutes**: Open to all users regardless of authentication status
 * - **authRoutes**: Login/registration pages that should redirect authenticated users
 * 
 * @example **Pattern Matching:**
 * - Admin, owner, and protected routes use `startsWith()` matching for nested paths
 * - Auth and public routes use exact matching
 * - Routes not explicitly listed default to 'public' access
 * 
 * @example **Maintenance Benefits:**
 * - Centralized route management
 * - Easy to add/remove protected routes
 * - Clear separation of access levels
 * - Type-safe route categorization
 */
export const routeConfig = {
  adminRoutes: ['/admin'],
  ownerRoutes: ['/owner'],
  protectedRoutes: ['/dashboard', '/profile'],
  authRoutes: ['/login', '/registeration', '/registeration-owner'],
  publicRoutes: ['/', '/network'],
  verificationPage: ['/verify/contact-info'],
};

/**
 * @brief Determines the access control category for a given route pathname.
 * 
 * Analyzes the incoming request pathname against the configured route patterns
 * to determine what level of authentication/authorization is required. This
 * function implements the core routing logic used by middleware to make
 * access control decisions.
 * 
 * @example **Matching Priority (first match wins):**
 * 1. Admin routes - checked first with `startsWith()` for nested admin paths
 * 2. Owner routes - checked second with `startsWith()` for nested owner paths
 * 3. Protected routes - checked third with `startsWith()` for nested user paths  
 * 4. Auth routes - checked fourth with exact matching
 * 5. Public routes - default fallback for unmatched routes
 */
export function getRouteType(pathname: string): 'admin' | 'owner' | 'protected' | 'auth' | 'public' | 'verify' {
  if (routeConfig.adminRoutes.some(route => pathname.startsWith(route))) {
    return 'admin';
  }

  if (routeConfig.ownerRoutes.some(route => pathname.startsWith(route))) {
    return 'owner';
  }

  if (routeConfig.protectedRoutes.some(route => pathname.startsWith(route))) {
    return 'protected';
  }

  if (routeConfig.authRoutes.some(route => pathname.startsWith(route))) {
    return 'auth';
  }

  if (routeConfig.verificationPage.some(route => pathname.startsWith(route))) {
    return 'verify';
  }

  return 'public';
}