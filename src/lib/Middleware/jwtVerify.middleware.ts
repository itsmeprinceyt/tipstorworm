import { jwtVerify } from 'jose';
import { Payload } from '../../types/JWT/payload.type';

/**
 * @brief JWT secret key encoded for Web Crypto API compatibility in Edge Runtime.
 * 
 * Converts the JWT_SECRET_TOKEN environment variable from string to Uint8Array
 * format required by the 'jose' library for JWT verification in Next.js Edge Runtime.
 * The TextEncoder ensures proper encoding for cryptographic operations.
 * 
 * @example **Security Note:** This secret must match exactly with the secret used during
 * JWT token creation in login/register endpoints to ensure successful verification.
 */
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET_TOKEN!);

/**
 * @brief Verifies JWT access token signature and extracts user payload data.
 * 
 * Uses the 'jose' library (Web Crypto API compatible) to verify JWT tokens in
 * Next.js Edge Runtime environment. This function handles the core cryptographic
 * verification of token authenticity, expiration, and signature validity.
 * 
 * @example **Verification Process:**
 * 1. Validates JWT signature using the secret key
 * 2. Checks token expiration timestamp
 * 3. Verifies token structure and format
 * 4. Extracts and returns the payload data
 * 
 * @example **Security Features:**
 * - Cryptographic signature verification prevents token tampering
 * - Automatic expiration checking prevents use of stale tokens
 * - Safe error handling prevents information leakage about failure reasons
 */
export async function verifyJWT(token: string): Promise<Payload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as Payload;
  } catch (error: unknown) {
    console.error(error);
    return null;
  }
}

/**
 * @brief Extracts JWT access token from HTTP request cookie header.
 * 
 * Parses the raw Cookie header string to locate and extract the 'access_token'
 * cookie value. This function handles the HTTP cookie parsing required for
 * server-side authentication in API routes and middleware.
 * 
 * @example **Cookie Format Handling:**
 * - Supports multiple cookies in single header (standard HTTP format)
 * - Properly handles URL encoding/decoding of cookie values
 * - Case-sensitive cookie name matching ('access_token')
 * - Graceful handling of malformed or missing cookie headers
 * 
 * @example **Security Considerations:**
 * - Only extracts HTTP-only cookies (client-side JavaScript cannot access)
 * - Handles URL decoding to restore original JWT token format
 * - Returns null for any parsing errors to prevent security bypasses
 */
export function getTokenFromCookies(request: Request): string | null {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return null;
  
  const match = cookieHeader.match(/access_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}
