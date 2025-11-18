/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PostCreateRequestDTO {
  title: string;
  slug: string;
  description?: string;
  content?: string;
  categories?: string[];
  icon?: string;
  icon_id?: string;
  post_status?: "public" | "private";
  featured?: boolean;
  metadata?: Record<string, any>;
}