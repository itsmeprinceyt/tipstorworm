export type UploadOptions = {
  fileName?: string;
  baseName?: string;
  folder?: string;
  isPrivateFile?: boolean;
  customMetadata?:
    | string
    | Record<string, string | number | boolean | Array<string | number | boolean>>;

  responseFields?: string | string[];
  onProgress?: (pct: number) => void;
  abortSignal?: AbortSignal;
};