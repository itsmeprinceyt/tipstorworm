import { RowDataPacket } from "mysql2";
import { JWT } from "next-auth/jwt";

export interface MyJWT extends JWT, RowDataPacket {
    id?: string;
    user_id?: string;
    name?: string;
    username?: string | null;
    email?: string;
    image?: string | null;
    cover_image?: string | null;
    bio: string;
    website: string;
    visibility: 'public' | 'private';
    is_admin?: boolean;
    is_mod?: boolean;
    is_banned?: boolean;
}