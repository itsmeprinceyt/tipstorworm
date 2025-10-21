export interface InviteToken {
    token: string;
    created_by: string | null;
    uses: number;
    max_uses: number;
    active: boolean;
    created_at: string;
    expires_at: string | null;
    creator_email?: string;
    creator_name?: string;
}

export interface InviteTokenEntity {
    token: string;
    created_by: string | null;
    uses: number;
    max_uses: number;
    active: number;
    created_at: Date;
    expires_at: Date | null;
}
