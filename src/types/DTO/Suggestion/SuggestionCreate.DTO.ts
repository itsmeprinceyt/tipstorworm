/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SuggestionCreateRequestDTO {
  type:
    | "suggestion"
    | "bug_report"
    | "feature_request"
    | "content_report"
    | "other";
  title: string;
  description: string;
  related_post_id?: string;
  related_user_id?: string;
  allow_contact: boolean;
  contact_email?: string;
  metadata?: Record<string, any>;
}
