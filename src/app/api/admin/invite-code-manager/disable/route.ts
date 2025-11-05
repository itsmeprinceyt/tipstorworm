/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { initServer, db } from "../../../../../lib/initServer";
import { getServerSession } from "next-auth";
import { MyJWT } from "../../../../../types/User/JWT.type";
import { getCurrentDateTime } from "../../../../../utils/Variables/getDateTime";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { logAudit } from "../../../../../utils/Variables/AuditLogger";
import {
  ErrorResponseDTO,
  SuccessResponseDTO,
} from "../../../../../types/DTO/Global.DTO";

/**
 * @description
 * Disable an existing invitation token by setting active to 0.
 * This endpoint is restricted to administrators and moderators.
 *
 * @workflow
 * 1. Authenticate user session and validate permissions (admin/mod only)
 * 2. Validate token presence in request body
 * 3. Check if the token is already used or expired or not.
 * 4. Update token active status to 0 in database
 * 5. Log audit trail for security monitoring
 * 6. Return success response
 */
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const user = session.user as MyJWT;
    if (!user.is_admin && !user.is_mod) {
      return NextResponse.json(
        { error: "Insufficient permissions to disable invite codes" },
        { status: 403 }
      );
    }

    if (user.is_banned) {
      return NextResponse.json(
        { error: "You are banned, lil bro." },
        { status: 403 }
      );
    }

    const { token }: { token: string } = await req.json();

    if (!token || typeof token !== "string") {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    await initServer();
    const pool = db();

    const [existingTokens]: any = await pool.query(
      `SELECT token, active, uses, max_uses, expires_at FROM invite_tokens WHERE token = ?`,
      [token]
    );

    const existingToken = existingTokens[0];

    if (!existingToken) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    if (!existingToken.active) {
      return NextResponse.json(
        { error: "This token is already disabled" },
        { status: 400 }
      );
    }

    if (existingToken.uses >= existingToken.max_uses) {
      return NextResponse.json(
        { error: "This token has reached maximum usage limit" },
        { status: 400 }
      );
    }

    const now = new Date();
    const expiresAt = existingToken.expires_at
      ? new Date(existingToken.expires_at)
      : null;

    if (expiresAt && expiresAt < now) {
      return NextResponse.json(
        { error: "This token is already expired" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      await connection.query(
        `UPDATE invite_tokens SET active = 0 WHERE token = ?`,
        [token]
      );

      await logAudit(
        {
          user_id: user.user_id!,
          email: user.email!,
          name: user.name || "Unknown",
        },
        "invite_token_deactivate",
        `User ${user.email} disabled invite code: ${token}`,
        {
          token: token,
          deactivated_at: getCurrentDateTime(),
        }
      );

      return NextResponse.json<SuccessResponseDTO>({
        success: true,
        message: "Invite code disabled successfully",
        status: 200,
      });
    } finally {
      connection.release();
    }
  } catch (error: unknown) {
    console.error("Error disabled invite code:", error);
    return NextResponse.json<ErrorResponseDTO>({
      error: "Server error, please try again later",
      status: 500,
    });
  }
}
