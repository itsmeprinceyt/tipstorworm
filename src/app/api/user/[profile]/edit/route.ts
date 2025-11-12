/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { initServer, db } from "../../../../../lib/initServer";
import { getCurrentDateTime } from "../../../../../utils/Variables/getDateTime";
import { MyJWT } from "../../../../../types/User/JWT.type";
import { logAudit } from "../../../../../utils/Variables/AuditLogger";
import { ProfileUpdateRequestDTO } from "../../../../../types/User/Profile/ProfileEdit.DTO";

/**
 * @description
 * Updates the authenticated user's profile information.
 * Allows users to modify their username, bio, website, and profile visibility.
 *
 * @workflow
 * 1. Authenticate user session
 * 2. Validate request body and field constraints
 * 3. Check username availability if being changed
 * 4. Update user record in database
 * 5. Log audit trail for security
 * 6. Return updated user data
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

    if (body.username && body.username.length > 20) {
      return NextResponse.json(
        { error: "Username must be 20 characters or less" },
        { status: 400 }
      );
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

    if (body.username !== undefined) {
      updateFields.push("username = ?");
      updateValues.push(body.username);
    }

    if (body.bio !== undefined) {
      updateFields.push("bio = ?");
      updateValues.push(body.bio);
    }

    if (body.website !== undefined) {
      updateFields.push("website = ?");
      updateValues.push(body.website);
    }

    if (body.visibility !== undefined) {
      updateFields.push("visibility = ?");
      updateValues.push(body.visibility);
    }

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
        updated_fields: Object.keys(body),
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
