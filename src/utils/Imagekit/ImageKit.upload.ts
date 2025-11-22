"use client";
import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitUploadNetworkError,
  ImageKitServerError,
} from "@imagekit/next";
import type { UploadOptions } from "../../types/ImageKit/UploadOptions.type";
import { UploadResult } from "../../types/ImageKit/ImageKitAuthResponse.DTO";
import ImageKitAuthGenerate from "./ImageKitAuth.client";
import { getCurrentDateTime } from "../Variables/getDateTime.util";

/**
 * @brief Uploads files to ImageKit with secure authentication and standardized filename formatting
 *
 * @description
 * Handles client-side file uploads to ImageKit with automatic authentication token generation,
 * filename sanitization, and comprehensive error handling. Generates unique filenames by
 * appending timestamps to prevent conflicts and preserves original file extensions.
 *
 * @workflow
 * 1. Authentication - Fetches secure upload credentials from server-side auth generator
 * 2. Filename Processing - Extracts original name, sanitizes spaces, appends timestamp (YYYYMMDDHHMMSS)
 * 3. Upload Execution - Transfers file to ImageKit with progress tracking support
 * 4. Error Handling - Catches and categorizes upload errors (abort, network, server, invalid requests)
 * 5. Result Return - Provides upload response or null for aborted operations
 */
export async function uploadToImageKit(
  file: File | Blob,
  opts: UploadOptions = {}
): Promise<UploadResult | null> {
  const {
    fileName: explicitFileName,
    baseName,
    folder,
    isPrivateFile = false,
    onProgress,
    abortSignal,
    ...rest
  } = opts;

  if (!folder) {
    return null;
  }

  const { token, expire, signature, publicKey, value } =
    await ImageKitAuthGenerate();
  let finalFolder: string = folder;

  if (!value) {
    finalFolder = `/tipstor-worm-${value}/${finalFolder}`;
  } else {
    finalFolder = `/tipstor-worm/${finalFolder}`;
  }

  if (!value) {
  }

  const fallbackOriginalName = (file as File)?.name ?? `upload`;
  const { base: originalBase, ext } = splitNameAndExt(fallbackOriginalName);
  const safeBase = (baseName ?? originalBase).trim().replace(/\s+/g, "-");
  const now = getCurrentDateTime();
  const finalFileName = explicitFileName ?? `${safeBase}_${now}${ext || ""}`;

  try {
    const result = await upload({
      token,
      expire,
      signature,
      publicKey,

      file,
      fileName: finalFileName,

      folder: finalFolder,
      isPrivateFile,

      ...rest,

      onProgress: (evt) => {
        if (!onProgress) return;
        const total = evt?.total ?? 0;
        onProgress(total > 0 ? (evt.loaded / total) * 100 : 0);
      },

      abortSignal,
    });

    return result;
  } catch (error: unknown) {
    if (error instanceof ImageKitAbortError) {
      console.error("Upload aborted:", error.reason);
      return null;
    }
    if (error instanceof ImageKitInvalidRequestError) {
      console.error("Invalid request:", error.message);
      throw error;
    }
    if (error instanceof ImageKitUploadNetworkError) {
      console.error("Network error:", error.message);
      throw error;
    }
    if (error instanceof ImageKitServerError) {
      console.error("Server error:", error.message);
      throw error;
    }
    console.error("Unknown upload error:", error);
    throw error;
  }
}

// Helper Functions
function splitNameAndExt(original: string) {
  const idx = original.lastIndexOf(".");
  if (idx <= 0) return { base: original, ext: "" };
  return { base: original.slice(0, idx), ext: original.slice(idx) };
}
