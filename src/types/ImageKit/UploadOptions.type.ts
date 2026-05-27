export type UploadOptions = {
  fileName?: string;
  baseName?: string;
  folder?: string;
  isPrivateFile?: boolean;
  customMetadata?: Record<string, unknown>;
  responseFields?: (
    | "isPrivateFile"
    | "customMetadata"
    | "tags"
    | "customCoordinates"
    | "embeddedMetadata"
    | "isPublished"
    | "metadata"
    | "selectedFieldsSchema"
  )[];
  onProgress?: (pct: number) => void;
  abortSignal?: AbortSignal;
};
