import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getUploadAuth } from "../../../../utils/Imagekit/ImageKitAuth.server";
import { getProduction } from "../../../../utils/Variables/getProduction.util";

/**
 * @brief NEEDED FOR CLIENT SIDE UPLOADING : Generates secure ImageKit upload authentication for authenticated users
 *
 * @description
 * API endpoint that provides short-lived ImageKit upload credentials for the currently
 * authenticated user. Ensures user-specific file organization by enforcing folder
 * segregation based on user ID. Clients should call this endpoint immediately before
 * initiating file uploads via ImageKit's browser SDK.
 *
 * @workflow
 * 1. Session Validation - Checks for valid user authentication via NextAuth
 * 2. Authorization Check - Returns 403 if no valid user session exists
 * 3. Credential Generation - Creates temporary ImageKit upload tokens with expiration
 */
export async function GET() {
  try {
    const user = await getServerSession(authOptions);

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const auth = getUploadAuth();
    const value: boolean = getProduction();
    return NextResponse.json({ ...auth, value }, { status: 200 });
  } catch (error: unknown) {
    console.error("Image Kit Auth Generation Error: ", error);
    return NextResponse.json(
      { error: "Failed to create upload auth" },
      { status: 500 }
    );
  }
}
