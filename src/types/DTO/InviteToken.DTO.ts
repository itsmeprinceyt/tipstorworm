import { InviteToken } from "../InviteCode/InviteToken.type";

export interface InviteTokenResponseDTO {
    tokens: InviteToken[];
    count: number;
}

export interface InviteTokenCreateRequestDTO {
    expires_at: string;
}