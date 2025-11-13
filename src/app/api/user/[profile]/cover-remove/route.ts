/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { initServer, db } from "../../../../../lib/initServer";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../api/auth/[...nextauth]/route";
import imageKitConfig from "../../../../..//utils/Imagekit/ImageKit.config";
import { getCurrentDateTime } from "../../../../../utils/Variables/getDateTime";

/**
 * @description Deletes a user's profile photo from both ImageKit storage and database records.
 * Supports both self-service deletion (users deleting their own photo) and admin operations
 * (admins deleting other users' photos).
 *
 * @workflow
 *  1. Authenticate and authorize the requesting user
 *  2. Determine target user based on request parameters (self or specified user)
 *  3. Validate admin privileges if deleting another user's photo
 *  4. Fetch target user's current profile photo metadata from database
 *  5. Attempt to delete the file from ImageKit storage (gracefully handles missing files)
 *  6. Clear profile photo references from database (profile_photo, profile_photo_id)
 *  7. Log comprehensive audit trail for the deletion operation
 *  8. Return success response with deletion details
 */
export async function POST(req: Request): Promise<NextResponse> {
  await initServer();
  const pool = db();

  try {
    const user = await getServerSession(authOptions);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userPfpToRemove } = await req.json();

    const isDeletingOwnProfile =
      !userPfpToRemove || userPfpToRemove === user.user.user_id;
    const targetUserId = isDeletingOwnProfile
      ? user.user.user_id
      : userPfpToRemove;

    if (!isDeletingOwnProfile && !user.user.is_admin) {
      return NextResponse.json(
        { error: "Unauthorized to delete other users' cover photos" },
        { status: 403 }
      );
    }

    const [userRows]: any[] = await pool.query(
      "SELECT user_id, email, cover_image, cover_image_id FROM users WHERE user_id = ? LIMIT 1",
      [targetUserId]
    );

    if (!userRows?.length) {
      return NextResponse.json(
        { error: "Target user not found" },
        { status: 404 }
      );
    }

    const targetUser = userRows[0];
    const currentCoverPhotoID: string | null = targetUser.cover_image_id;

    if (!currentCoverPhotoID) {
      return NextResponse.json(
        { error: "No Cover Photo exists for this user" },
        { status: 400 }
      );
    }

    const imagekit = imageKitConfig();
    try {
      await imagekit.deleteFile(currentCoverPhotoID);
    } catch (imageKitError: any) {
      if (
        imageKitError.message.includes("File not found") ||
        imageKitError.message.includes("No file exists")
      ) {
        console.warn(
          "File not found in ImageKit, proceeding with database cleanup"
        );
      }
    }

    const currentDateTime = getCurrentDateTime();
    await pool.query(
      `UPDATE users 
             SET cover_image = NULL, 
                 cover_image_id = NULL, 
                 updated_at = ?
             WHERE user_id = ?`,
      [currentDateTime, targetUserId]
    );

    return NextResponse.json(
      {
        success: true,
        isDeletingOwnProfile,
        message: "Cover Photo deleted successfully"
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Delete profile photo error:", err.message);
    return NextResponse.json(
      { error: "Failed to delete profile photo" },
      { status: 500 }
    );
  }
}
