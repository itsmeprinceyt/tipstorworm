import axios from "axios";
import { UploadAuthResponse } from "../../types/ImageKit/ImageKitAuthResponse.DTO";

/**
 * @brief CLIENT SIDE: Generates secure authentication credentials for ImageKit uploads
 *
 * @description
 * Fetches secure upload authentication tokens from the server-side API endpoint.
 * Validates and transforms the response data to ensure proper TypeScript typing
 * and numeric expiration values for the ImageKit upload client.
 *
 * @workflow
 * 1. API Request - Calls server endpoint (/api/user/image-kit-auth) to get fresh credentials
 * 2. Data Validation - Checks expiration value is a valid numeric timestamp
 * 3. Type Transformation - Converts string expire values to numbers for client compatibility
 * 4. Error Handling - Throws descriptive error for invalid authentication responses
 * 5. Credential Return - Provides complete auth package for ImageKit upload operations
 */
export default async function ImageKitAuthGenerate(): Promise<UploadAuthResponse> {
  const { data } = await axios.get<UploadAuthResponse>(
    "/api/user/image-kit-auth"
  );

  const expireNum =
    typeof data.expire === "string" ? Number(data.expire) : data.expire;

  if (!Number.isFinite(expireNum)) {
    throw new Error("Invalid expire value from /api/user/image-kit-auth");
  }

  return {
    token: data.token,
    expire: expireNum,
    signature: data.signature,
    publicKey: data.publicKey,
  };
}
