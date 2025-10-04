import NextAuth, { NextAuthOptions, DefaultSession, DefaultUser } from "next-auth";
import Google, { GoogleProfile } from "next-auth/providers/google";
import { initServer, db } from "../../../../lib/initServer";
import type { Pool } from "mysql2/promise";
import { v4 as uuidv4 } from "uuid";
import { MyJWT } from "../../../../types/User/JWT.type";
import { getCurrentDateTime } from "../../../../utils/Variables/getDateTime";
import generateUsername from "../../../../utils/Variables/generateUsername";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("Error: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set in environment variables.");
    process.exit(1);
}

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

declare module "next-auth" {
    interface Session {
        user: {
            id?: string;
            name?: string | null;
            username?: string | null;
            email?: string;
            image?: string | null;
            is_admin?: boolean;
            is_mod?: boolean;
        } & DefaultSession["user"];
    }

    interface User extends DefaultUser {
        id?: string;
        name?: string | null;
        username?: string | null;
        email?: string;
        image?: string | null;
        is_admin?: boolean;
        is_mod?: boolean;
    }
}

const authOptions: NextAuthOptions = {
    session: { strategy: "jwt" },

    providers: [
        Google({
            clientId: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
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
                "SELECT id, name, username, email, image, is_admin, is_mod FROM users WHERE email = ?",
                [email]
            );

            if (!Array.isArray(rows)) return false;

            if (rows.length === 0) {
                const newId = uuidv4();
                const username = generateUsername(name);

                await pool.execute(
                    "INSERT INTO users (id, name, username, email, image, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    [newId, name || undefined, username, email, image || undefined, now, now]
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

            if (account?.provider === "google" && profile) {
                const googleProfile = profile as GoogleProfile;

                const pool = await getPool();
                const [rows] = await pool.execute<MyJWT[]>(
                    "SELECT id, name, username, email, image, is_admin, is_mod FROM users WHERE email = ?",
                    [googleProfile.email]
                );

                if (Array.isArray(rows) && rows.length > 0) {
                    const dbUser = rows[0];
                    t.id = dbUser.id ?? t.id;
                    t.username = dbUser.username ?? null;
                    t.name = dbUser.name ?? googleProfile.name ?? "";
                    t.email = dbUser.email ?? googleProfile.email ?? "";
                    t.image = dbUser.image ?? googleProfile.picture ?? "";
                    t.is_admin = Boolean(dbUser.is_admin);
                    t.is_mod = Boolean(dbUser.is_mod);
                }
            }

            if (user?.email) {
                const pool = await getPool();
                const [rows] = await pool.execute<MyJWT[]>(
                    "SELECT id, name, username, email, image, is_admin, is_mod FROM users WHERE email = ?",
                    [user.email]
                );

                if (Array.isArray(rows) && rows.length > 0) {
                    const dbUser = rows[0];
                    t.id = dbUser.id ?? t.id;
                    t.username = dbUser.username ?? null;
                    t.name = dbUser.name ?? user.name ?? "";
                    t.email = dbUser.email ?? user.email ?? "";
                    t.image = dbUser.image ?? user.image ?? "";
                    t.is_admin = Boolean(dbUser.is_admin);
                    t.is_mod = Boolean(dbUser.is_mod);
                }
            }

            return t;
        },

        async session({ session, token }) {
            const t = token as MyJWT;

            if (session.user) {
                session.user.id = t.id;
                session.user.username = t.username ?? null;
                session.user.name = t.name;
                session.user.email = t.email;
                session.user.image = t.image;
                session.user.is_admin = Boolean(t.is_admin);
                session.user.is_mod = Boolean(t.is_mod);
            }

            return session;
        },

        async redirect({ url, baseUrl }) {
            if (url.startsWith(baseUrl)) {
                return url;
            }
            return baseUrl + "/dashboard";
        },
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };