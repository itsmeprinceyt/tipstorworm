/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { initServer, db } from "../../../../../lib/initServer";
import { getCurrentDateTime } from "../../../../../utils/Variables/getDateTime.util";
import { MyJWT } from "../../../../../types/User/JWT.type";
import { logAudit } from "../../../../../utils/Variables/AuditLogger.util";
import { ProfileUpdateRequestDTO } from "../../../../../types/User/Profile/ProfileEdit.DTO";

/**
 * @description
 * Updates the authenticated user's profile information with comprehensive security validation.
 * Allows users to modify their username, bio, website, and profile visibility while enforcing
 * strict input validation and SQL injection protection.
 *
 * @security
 * - Parameterized queries prevent SQL injection attacks
 * - Field whitelisting restricts updates to allowed fields only
 * - Username validation with regex pattern: ^[a-zA-Z0-9_]+$
 * - SQL injection pattern detection in username field
 * - Input length constraints for all fields
 * - Audit logging for security monitoring
 *
 * @validation
 * - Username: max 20 chars, alphanumeric and underscores only
 * - Bio: max 160 characters
 * - Website: max 100 characters
 * - Visibility: must be 'public' or 'private'
 * - Username uniqueness check against existing users
 *
 * @workflow
 * 1. Authenticate user session and check ban status
 * 2. Validate request body structure and field constraints
 * 3. Apply comprehensive username security validation
 * 4. Check username availability if being changed
 * 5. Build safe parameterized update query with field whitelisting
 * 6. Update user record in database using parameterized queries
 * 7. Log audit trail for security monitoring
 * 8. Return appropriate response with success/error messages
 *
 */
export async function PATCH(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user as MyJWT;

    if (user.is_banned) {
      return NextResponse.json(
        { error: "Your account has been restricted" },
        { status: 403 }
      );
    }

    const body: ProfileUpdateRequestDTO = await req.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { error: "No fields to update" },
        { status: 400 }
      );
    }

    if (body.username) {
      if (body.username.length > 20) {
        return NextResponse.json(
          { error: "Username must be 20 characters or less" },
          { status: 400 }
        );
      }

      const usernameRegex = /^[a-zA-Z0-9_]+$/;
      if (!usernameRegex.test(body.username)) {
        return NextResponse.json(
          {
            error:
              "Username can only contain letters, numbers, and underscores",
          },
          { status: 400 }
        );
      }

      const sqlInjectionPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|EXEC|ALTER|CREATE|TRUNCATE)\b)/i,
        /('|"|`|--|#|\/\*|\*\/|;)/,
        /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
        /(UNION\s+ALL)/i,
      ];

      for (const pattern of sqlInjectionPatterns) {
        if (pattern.test(body.username)) {
          return NextResponse.json(
            { error: "Invalid username format" },
            { status: 400 }
          );
        }
      }
    }

    if (body.bio && body.bio.length > 160) {
      return NextResponse.json(
        { error: "Bio must be 160 characters or less" },
        { status: 400 }
      );
    }

    if (body.website && body.website.length > 100) {
      return NextResponse.json(
        { error: "Website URL must be 100 characters or less" },
        { status: 400 }
      );
    }

    if (body.visibility && !["public", "private"].includes(body.visibility)) {
      return NextResponse.json(
        { error: "Visibility must be either 'public' or 'private'" },
        { status: 400 }
      );
    }

    await initServer();
    const pool = db();

    if (body.username && body.username !== user.username) {
      const [existingUser] = await pool.query(
        `SELECT id FROM users WHERE username = ? AND id != ?`,
        [body.username, user.id]
      );

      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return NextResponse.json(
          { error: "Username is already taken" },
          { status: 409 }
        );
      }
    }

    const updateFields: string[] = [];
    const updateValues: any[] = [];
    const updatedAt = getCurrentDateTime();

    const allowedFields = ["username", "bio", "website", "visibility"];

    Object.keys(body).forEach((field) => {
      if (
        allowedFields.includes(field) &&
        body[field as keyof ProfileUpdateRequestDTO] !== undefined
      ) {
        updateFields.push(`${field} = ?`);
        updateValues.push(body[field as keyof ProfileUpdateRequestDTO]);
      }
    });

    updateFields.push("updated_at = ?");
    updateValues.push(updatedAt);
    updateValues.push(user.id);

    const query = `UPDATE users SET ${updateFields.join(", ")} WHERE id = ?`;

    await pool.query(query, updateValues);

    await logAudit(
      {
        user_id: user.user_id!,
        email: user.email!,
        name: user.name || "Unknown",
      },
      "user_update",
      `User ${user.email} updated their profile`,
      {
        updated_fields: Object.keys(body).filter((field) =>
          allowedFields.includes(field)
        ),
        previous_username: user.username,
        new_username: body.username,
        visibility_changed: body.visibility !== user.visibility,
      }
    );

    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error, please try again later" },
      { status: 500 }
    );
  }
}
