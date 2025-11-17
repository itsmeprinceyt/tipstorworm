import { upload } from "@imagekit/next";

export type UploadResult = Awaited<ReturnType<typeof upload>>;

export type UploadAuthResponse = {
  token: string;
  expire: number;
  signature: string;
  publicKey: string;
  value: boolean;
};