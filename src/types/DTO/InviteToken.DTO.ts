import { InviteToken } from "../InviteCode/token.type";

export interface InviteTokenResponseDTO {
    tokens: InviteToken[];
    count: number;
}