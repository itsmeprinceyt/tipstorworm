import { UploadResult } from "./ImageKitAuthResponse.DTO";
// TODO: work in progress
export interface BatchUploadButtonProps {
  folder: string;
  isPrivateFile?: boolean;
  onUploaded?: (results: UploadResult[]) => void;
  disabled?: boolean;
  text?: string;
  currentImageCount?: number;
  maxImages?: number;
  photo_type?: "pre_ride" | "post_ride";
}

// To Allow individual upload cancellation
export interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "success" | "error" | "cancelled";
  source: AbortController;
}
