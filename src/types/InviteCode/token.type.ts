export interface InviteTokenEntity {
    token: string;
    created_by: string | null;
    uses: number;
    max_uses: number;
    active: number;
    created_at: Date;
    expires_at: Date | null;
}