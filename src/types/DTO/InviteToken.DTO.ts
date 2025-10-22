import { InviteToken } from "../InviteCode/token.type";

export interface InviteTokenResponseDTO {
    tokens: InviteToken[];
    count: number;
}

export interface InviteTokenCreateRequestDTO {
    expires_at: string;
}