import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { initServer, db } from "../../../../lib/initServer";
import { MyJWT } from "../../../../types/User/JWT.type";


/**
 * @description
 * Fetches user profile data by user_id. Returns public profile data unless
 * the profile is private, in which case it returns an error.
 * 
 * @workflow
 * 1. Authenticate user session (optional - for checking own profile)
 * 2. Fetch user data from database
 * 3. Check profile visibility
 * 4. Return appropriate response based on visibility
 */

// TODO: allow searching through username
export async function GET(
  req: Request,
  context: { params: Promise<{ profile: string }> }
): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    const { profile } = await context.params;

    if (!profile) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    await initServer();
    const pool = db();

    const [users] = await pool.query(
      `SELECT 
        user_id, name, username, email, 
        image, cover_image, bio, website, 
        visibility, is_admin, is_mod, is_banned,
        created_at
       FROM users WHERE user_id = ?`,
      [profile]
    );

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userData = users[0] as MyJWT;
    const isOwnProfile = session?.user?.user_id === profile;
    if (userData.visibility === 'private' && !isOwnProfile) {
      return NextResponse.json(
        { error: "Private Profile" },
        { status: 403 }
      );
    }

    const profileResponse = {
      user_id: userData.user_id,
      name: userData.name,
      username: userData.username,
      image: userData.image,
      cover_image: userData.cover_image,
      bio: userData.bio,
      website: userData.website,
      visibility: userData.visibility,
      created_at: userData.created_at,
      is_own_profile: isOwnProfile
    };

    return NextResponse.json(
      {
        success: true,
        profile: profileResponse
      },
      { status: 200 }
    );

  } catch (error: unknown) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal server error, please try again later" },
      { status: 500 }
    );
  }
}