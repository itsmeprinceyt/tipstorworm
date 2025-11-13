/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { initServer, db } from "../../../../../lib/initServer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import { getCurrentDateTime } from "../../../../../utils/Variables/getDateTime";
import imageKitConfig from "../../../../..//utils/Imagekit/ImageKit.config";
import { logAudit } from "../../../.../../../../utils/Variables/AuditLogger";

/**
 * @description Handles uploading or updating user profile photo with automatic cleanup of existing cover photo.
 *
 * @workflow
 *  1. Authenticate and validate user
 *  2. Check if user already has an existing cover photo
 *  3. If existing cover photo exists, attempt to delete it from ImageKit
 *  4. Update database with new cover photo fields
 *  5. Log audit entry for profile photo update
 *  6. Return success response
 */
export async function POST(req: Request): Promise<NextResponse> {
  await initServer();
  const pool = db();

  try {
    const user = await getServerSession(authOptions);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { cover_photo, cover_photo_id } = await req.json();

    if (!cover_photo || !cover_photo_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const [userRows]: any[] = await pool.query(
      "SELECT user_id, email, cover_image, cover_image_id FROM users WHERE user_id = ? LIMIT 1",
      [user.user.user_id]
    );

    if (!userRows?.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const targetUser = userRows[0];
    const currentCoverPhotoID: string | null = targetUser.cover_image_id;

    if (currentCoverPhotoID) {
      const imagekit = imageKitConfig();
      try {
        await imagekit.deleteFile(currentCoverPhotoID);
      } catch (imageKitError: any) {
        if (
          imageKitError.message.includes("File not found") ||
          imageKitError.message.includes("No file exists")
        ) {
          console.warn(
            "File not found in ImageKit, proceeding with database update"
          );
        }
      }
    }

    const currentDateTime = getCurrentDateTime();
    await pool.query(
      `UPDATE users 
       SET cover_image = ?, cover_image_id = ?, updated_at = ?
       WHERE user_id = ?`,
      [cover_photo, cover_photo_id, currentDateTime, user.user.user_id]
    );

    await logAudit(
      {
        user_id: user.user.user_id!,
        email: user.user.email!,
        name: user.user.name || "Unknown",
      },
      "user_update",
      `User ${user.user.email} updated their cover picture`
    );

    return NextResponse.json(
      {
        message: "Cover Photo updated successfully",
        previous_cover_deleted: !!currentCoverPhotoID,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("Failed to update profile photo:", err);
    return NextResponse.json(
      { error: "Failed to update profile photo" },
      { status: 500 }
    );
  }
}
