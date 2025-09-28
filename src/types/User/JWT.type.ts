import { RowDataPacket } from "mysql2";
import { JWT } from "next-auth/jwt";

export interface MyJWT extends JWT, RowDataPacket {
    id?: string;
    name?: string;
    username?: string | null;
    email?: string;
    image?: string;
}