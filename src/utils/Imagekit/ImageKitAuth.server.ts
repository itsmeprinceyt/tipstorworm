import "server-only";
import { getUploadAuthParams } from "@imagekit/next/server";
import { UploadAuthResponse } from "../../types/ImageKit/ImageKitAuthResponse.DTO";

/**
 * @brief SERVER-SIDE: Generates secure ImageKit upload authentication credentials
 * 
 * @description
 * Server-only function that creates short-lived upload authentication parameters
 * using ImageKit's server SDK. Safely handles the private API key in server environment
 * and generates time-limited tokens for secure client-side uploads. This function
 * should never be exposed to the client and must only be called from server-side routes.
 * 
 * @workflow
 * 1. Environment Validation - Checks for required ImageKit private and public keys
 * 2. Credential Generation - Uses ImageKit SDK to create secure upload tokens with expiration
 * 3. Security Enforcement - Keeps private key completely isolated from client exposure
 * 4. Parameter Return - Provides complete authentication package for client upload operations
 */
export function getUploadAuth(): UploadAuthResponse {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;

    if (!privateKey || !publicKey) {
        throw new Error("Missing IMAGEKIT_PRIVATE_KEY or IMAGEKIT_PUBLIC_KEY");
    }

    const { token, expire, signature } = getUploadAuthParams({
        privateKey,
        publicKey,
    });

    return { token, expire, signature, publicKey };
}