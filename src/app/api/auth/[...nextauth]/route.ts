import NextAuth, { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import Google, { GoogleProfile } from "next-auth/providers/google";
import { initServer, db } from "../../../../lib/initServer";
import type { Pool } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { MyJWT } from "../../../../types/User/JWT.type";
import { getCurrentDateTime } from "../../../../utils/Variables/getDateTime";
import generateUsername from "../../../../utils/Variables/generateUsername";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

let pool: Pool | null = null;
async function getPool(): Promise<Pool> {
    if (!pool) {
        await initServer();
        pool = db();
    }
    return pool;
}

function sanitizeString(value: unknown, maxLen = 255): string {
    if (typeof value !== "string") return "";
    const s = value.trim();
    return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function isValidEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function generateUserId(): string {
    return uuidv4().replace(/-/g, "").slice(0, 12);
}

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            user_id?: string;
            name?: string | null;
            username?: string | null;
            email?: string;
            image?: string | null;
            cover_image?: string | null;
            is_admin?: boolean;
            is_mod?: boolean;
            is_banned?: boolean;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id?: string;
        user_id?: string;
        name?: string | null;
        username?: string | null;
        email?: string;
        image?: string | null;
        cover_image?: string | null;
        is_admin?: boolean;
        is_mod?: boolean;
        is_banned?: boolean;
    }
}


const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },

    providers: [
        Google({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "select_account",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],

    callbacks: {
        async signIn({ profile }) {
            const now = getCurrentDateTime();
            const googleProfile = profile as GoogleProfile;

            if (!googleProfile.email) return false;

            const email = sanitizeString(googleProfile.email, 320);
            if (!isValidEmail(email)) return false;

            const name = sanitizeString(googleProfile.name ?? "", 255);
            const image = sanitizeString(googleProfile.picture ?? "", 500);

            const pool = await getPool();

            const [rows] = await pool.execute<MyJWT[]>(
                "SELECT id, user_id, name, username, email, image, is_admin, is_mod FROM users WHERE email = ?",
                [email]
            );

            if (!Array.isArray(rows)) return false;

            if (rows.length === 0) {
                const newId = uuidv4();
                const userId = generateUserId();
                const username = generateUsername(name);

                await pool.execute(
                    "INSERT INTO users (id, user_id, name, username, email, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                    [newId, userId, name || undefined, username, email, image || undefined, now, now]
                );
            } else {
                const user = rows[0];
                if ((user.name ?? "") !== name || (user.image ?? "") !== image) {
                    await pool.execute(
                        "UPDATE users SET name = ?, image = ?, updated_at = ? WHERE email = ?",
                        [name || user.name, image || user.image, now, email]
                    );
                }
            }

            return true;
        },

        async jwt({ token, user, account, profile }) {
            const t = token as MyJWT;
            const pool = await getPool();

            let emailToCheck: string | null = null;

            if (account?.provider === "google" && profile) {
                const googleProfile = profile as GoogleProfile;
                emailToCheck = googleProfile.email;
            }

            if (user?.email) {
                emailToCheck = user.email;
            }

            if (emailToCheck) {
                const [rows] = await pool.execute<MyJWT[]>(
                    "SELECT id, user_id, name, username, email, image, cover_image, is_admin, is_mod, is_banned FROM users WHERE email = ?",
                    [emailToCheck]
                );

                if (Array.isArray(rows) && rows.length > 0) {
                    const dbUser = rows[0];
                    t.id = dbUser.id ?? t.id;
                    t.user_id = dbUser.user_id ?? t.user_id;
                    t.username = dbUser.username ?? null;
                    t.name = dbUser.name ?? "";
                    t.email = dbUser.email ?? emailToCheck;
                    t.image = dbUser.image ?? "";
                    t.cover_image = dbUser.cover_image ?? "";
                    t.is_admin = Boolean(dbUser.is_admin);
                    t.is_mod = Boolean(dbUser.is_mod);
                    t.is_banned = Boolean(dbUser.is_banned);
                }
            }

            return t;
        },


        async session({ session, token }) {
            const t = token as MyJWT;

            if (session.user) {
                session.user.id = t.id;
                session.user.user_id = t.user_id;
                session.user.username = t.username ?? null;
                session.user.name = t.name;
                session.user.email = t.email;
                session.user.image = t.image;
                session.user.cover_image = t.cover_image;
                session.user.is_admin = Boolean(t.is_admin);
                session.user.is_mod = Boolean(t.is_mod);
                session.user.is_banned = Boolean(t.is_banned);
            }


            return session;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) return url;
            return baseUrl + "/dashboard";
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
export { authOptions };
