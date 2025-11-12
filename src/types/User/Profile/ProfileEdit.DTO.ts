export interface ProfileUpdateRequestDTO {
  username?: string;
  bio?: string;
  website?: string;
  visibility?: "public" | "private";
}