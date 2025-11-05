import { InviteToken } from "../Public/InviteCode/InviteToken.type";

export interface InviteTokenResponseDTO {
  tokens: InviteToken[];
  count: number;
}

export interface InviteTokenCreateRequestDTO {
  expires_at: string;
}

interface DataInfo {
  valid: boolean;
  expires_at: string | undefined;
  is_master_token: boolean;
}

export interface PublicInviteTokenResponseDTO {
  success: boolean;
  data: DataInfo;
  message: string;
}
