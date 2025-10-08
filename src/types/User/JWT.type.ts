import { RowDataPacket } from "mysql2";
import { JWT } from "next-auth/jwt";

export interface MyJWT extends JWT, RowDataPacket {
    name?: string;
    email?: string;
    image?: string | null;
    id?: string;
    user_id?: string;
    username?: string | null;
    is_admin?: boolean;
    is_mod?: boolean;
    is_banned?: boolean;
}