export interface PublicProfileData {
  user_id: string;
  name: string;
  username: string;
  image?: string;
  cover_image?: string;
  bio?: string;
  website?: string;
  visibility: "public" | "private";
  created_at: string;
  is_own_profile: boolean;
}