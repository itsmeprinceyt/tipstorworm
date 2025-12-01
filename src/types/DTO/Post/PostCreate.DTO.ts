/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PostCreateRequestDTO {
  title: string;
  short_description: string;
  long_description?: string;
  markdown_description?: string;
  categories?: string[];
  icon_url?: string;
  icon_id?: string;
  post_status?: "public" | "private";
  featured?: boolean;
  metadata?: Record<string, any>;
}